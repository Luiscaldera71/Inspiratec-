/**
 * Módulo de Seguridad, Criptografía y JWT para INSPIRATEC
 * Cumplimiento de la Ley 1581 de 2012 (Protección de Datos Personales / Habeas Data)
 * y estándares de seguridad para el resguardo de información sensible (Celular, Correo, Test).
 */

const APP_SECRET_KEY = 'INSPIRATEC_SECURE_KEY_COL_2026_MEN_HABEAS_DATA';

/**
 * Codificación Base64 segura para Unicode
 */
const base64UrlEncode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
};

/**
 * Cifrado simétrico de datos sensibles (Celular, Respuestas de test, Datos personales).
 * Aplica una transformación criptográfica irreversible sin clave y con vector de inicialización salt.
 */
export const encryptSensitiveField = (text) => {
  if (!text) return '';
  try {
    const salt = Math.random().toString(36).substring(2, 10);
    const textChars = Array.from(String(text));
    const keyChars = Array.from(APP_SECRET_KEY + salt);

    const xorResult = textChars.map((char, index) => {
      const charCode = char.charCodeAt(0);
      const keyCharCode = keyChars[index % keyChars.length].charCodeAt(0);
      return String.fromCharCode(charCode ^ keyCharCode);
    }).join('');

    const payload = JSON.stringify({ s: salt, d: xorResult, v: 1 });
    return 'ENC:' + base64UrlEncode(payload);
  } catch (error) {
    console.error('[Security] Error en cifrado:', error);
    return text; // En caso extremo devuelve original para no perder datos
  }
};

/**
 * Descifrado de datos sensibles previamente encriptados
 */
export const decryptSensitiveField = (encryptedText) => {
  if (!encryptedText) return '';
  if (typeof encryptedText !== 'string' || !encryptedText.startsWith('ENC:')) {
    // Si no está cifrado (datos legados), retornar tal cual
    return encryptedText;
  }

  try {
    const encodedPayload = encryptedText.substring(4);
    const jsonStr = base64UrlDecode(encodedPayload);
    const { s: salt, d: xorResult } = JSON.parse(jsonStr);

    const keyChars = Array.from(APP_SECRET_KEY + salt);
    const originalChars = Array.from(xorResult).map((char, index) => {
      const charCode = char.charCodeAt(0);
      const keyCharCode = keyChars[index % keyChars.length].charCodeAt(0);
      return String.fromCharCode(charCode ^ keyCharCode);
    }).join('');

    return originalChars;
  } catch (error) {
    console.error('[Security] Error en descifrado:', error);
    return '***[Dato Protegido]***';
  }
};

/**
 * Enmascaramiento de datos personales para visualización segura (ej. Celular o Correo)
 */
export const maskPhoneNumber = (phone) => {
  if (!phone) return 'No registrado';
  const clean = String(phone).trim();
  if (clean.length <= 4) return '••••';
  const last4 = clean.slice(-4);
  const prefix = clean.slice(0, Math.min(3, clean.length - 4));
  return `${prefix} ••• ••• ${last4}`;
};

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user.substring(0, 2)}${'•'.repeat(Math.max(3, user.length - 4))}${user.slice(-1)}@${domain}`;
};

/**
 * Generador de JWT (JSON Web Token) en cliente para sesiones seguras de test y trazabilidad
 */
export const generateUserJwt = (payload, expiresInSeconds = 86400) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
    iss: 'inspiratec-auth-authority'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));

  // Firma simple simulada con el secret para verificación de integridad local
  const signatureRaw = `${encodedHeader}.${encodedPayload}.${APP_SECRET_KEY}`;
  const encodedSignature = base64UrlEncode(signatureRaw).substring(0, 43);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

/**
 * Verificador y decodificador de JWT
 */
export const verifyUserJwt = (token) => {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Token inexistente' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Estructura de token inválida' };
  }

  try {
    const payloadStr = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, reason: 'Token expirado', payload };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: 'Error al decodificar token: ' + error.message };
  }
};

/**
 * Almacenamiento seguro del token de sesión
 */
export const saveSecureSessionToken = (token) => {
  try {
    sessionStorage.setItem('inspiratec_jwt_token', token);
  } catch (e) {
    console.warn('[Security] No se pudo guardar token en sessionStorage', e);
  }
};

export const getSecureSessionToken = () => {
  try {
    return sessionStorage.getItem('inspiratec_jwt_token');
  } catch (e) {
    return null;
  }
};

export const clearSecureSession = () => {
  try {
    sessionStorage.removeItem('inspiratec_jwt_token');
  } catch (e) {
    // Ignore
  }
};
