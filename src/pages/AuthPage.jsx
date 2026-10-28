import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, loginWithGoogle } from '../services/authService';
import TermsAndConditionsModal from '../components/TermsAndConditionsModal';
import { Mail, Lock, User, Building2, GraduationCap, Eye, EyeOff, ArrowRight, Shield, Loader2 } from 'lucide-react';
import '../styles/auth.css';

// Mensajes claros para los errores más comunes de Firebase Auth
const mensajeError = (err) => {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.';
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este correo. Inicia sesión.';
    case 'auth/weak-password':
      return 'La contraseña debe tener mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
    case 'auth/network-request-failed':
      return 'No hay conexión a internet. Revisa tu red e inténtalo de nuevo.';
    case 'auth/popup-blocked':
      return 'Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.';
    case 'auth/operation-not-allowed':
      return 'El inicio de sesión con Google aún no está habilitado en Firebase.';
    case 'auth/unauthorized-domain':
      return 'Este dominio no está autorizado en Firebase (Authentication > Configuración > Dominios autorizados).';
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con este correo usando otro método de acceso.';
    default:
      return err?.message || 'Error en la autenticación.';
  }
};

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    institucion: '',
    nivel: '',
    metodologiaInstitucional: 'Aprendizaje Basado en Proyectos (ABP)',
    otraMetodologia: '',
    aceptaTerminos: false
  });

  // Respeta "reducir movimiento": el video queda en pausa
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current?.pause();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const cred = await loginUser(formData.email, formData.password);
        const uid = cred?.user?.uid;
        if (uid) {
          localStorage.setItem(`inspiratec_bienvenida_completada_${uid}`, 'true');
          localStorage.removeItem(`inspiratec_just_registered_${uid}`);
        }
        sessionStorage.removeItem('inspiratec_just_registered');
      } else {
        if (!formData.aceptaTerminos) {
          throw new Error('Debes aceptar los Términos y Condiciones y la Política de Protección de Datos (Ley 1581 de 2012) para registrarte.');
        }
        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener mínimo 6 caracteres.');
        }
        const metodologiaFinal = formData.metodologiaInstitucional === 'Otra'
          ? (formData.otraMetodologia || 'Aprendizaje Activo Personalizado').trim()
          : (formData.metodologiaInstitucional || 'Aprendizaje Basado en Proyectos (ABP)');

        const newUser = await registerUser(
          formData.nombre,
          formData.institucion,
          formData.nivel,
          formData.email,
          formData.password,
          '',
          formData.aceptaTerminos,
          metodologiaFinal
        );

        // Señalizar que el usuario se acaba de registrar para abrir el tutorial una única vez
        if (newUser?.uid) {
          sessionStorage.setItem('inspiratec_just_registered', newUser.uid);
          localStorage.setItem(`inspiratec_just_registered_${newUser.uid}`, 'true');
        }
      }
      navigate('/home');
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { user, isNew } = await loginWithGoogle();
      if (isNew) {
        sessionStorage.setItem('inspiratec_just_registered', user.uid);
        localStorage.setItem(`inspiratec_just_registered_${user.uid}`, 'true');
      } else {
        localStorage.setItem(`inspiratec_bienvenida_completada_${user.uid}`, 'true');
        localStorage.removeItem(`inspiratec_just_registered_${user.uid}`);
        sessionStorage.removeItem('inspiratec_just_registered');
      }
      navigate('/home');
    } catch (err) {
      // Cerrar la ventana de Google no es un error
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setError(mensajeError(err));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const ocupado = loading || googleLoading;

  return (
    <div className="auth-stage">
      {/* Fondo animado (video proporcionado) con respaldo de degradado mientras carga */}
      <video
        ref={videoRef}
        className="auth-video"
        src="/login/login-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="auth-veil" aria-hidden="true" />

      <main className="auth-layout">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-brand">
            <img className="auth-logo" src="/images/logo-inspiratec.png" alt="InspiraTEC" draggable={false} />
            <h1 id="auth-title" className="auth-tagline">
              {isLogin ? 'Docentes que transforman con tecnología' : 'Crea tu cuenta docente y únete a la comunidad'}
            </h1>
          </div>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
            {!isLogin && (
              <>
                <label className="auth-field">
                  <span className="auth-label">Nombre completo</span>
                  <span className="auth-input-wrap">
                    <User size={18} className="auth-input-icon" />
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej. Profe María Pérez" autoComplete="name" />
                  </span>
                </label>

                <div className="auth-row">
                  <label className="auth-field">
                    <span className="auth-label">Institución</span>
                    <span className="auth-input-wrap">
                      <Building2 size={18} className="auth-input-icon" />
                      <input type="text" name="institucion" value={formData.institucion} onChange={handleChange} required placeholder="Colegio…" autoComplete="organization" />
                    </span>
                  </label>
                  <label className="auth-field">
                    <span className="auth-label">Nivel</span>
                    <span className="auth-input-wrap">
                      <GraduationCap size={18} className="auth-input-icon" />
                      <select name="nivel" value={formData.nivel} onChange={handleChange} required>
                        <option value="">Selecciona…</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Media">Media</option>
                      </select>
                    </span>
                  </label>
                </div>

                <label className="auth-field">
                  <span className="auth-label">Metodología o enfoque institucional</span>
                  <span className="auth-input-wrap auth-select-wrap">
                    <select name="metodologiaInstitucional" value={formData.metodologiaInstitucional} onChange={handleChange} required>
                      <option value="Aprendizaje Basado en Proyectos (ABP)">Aprendizaje Basado en Proyectos (ABP)</option>
                      <option value="Enfoque STEAM Interdisciplinario">Enfoque STEAM Interdisciplinario</option>
                      <option value="Aprendizaje Cooperativo y Socrático">Aprendizaje Cooperativo y Socrático</option>
                      <option value="Aula Invertida (Flipped Classroom)">Aula Invertida (Flipped Classroom)</option>
                      <option value="Enseñanza para la Comprensión (EpC)">Enseñanza para la Comprensión (EpC)</option>
                      <option value="Socioformativo o por Competencias">Socioformativo o por Competencias</option>
                      <option value="Constructivismo y Aprendizaje Significativo">Constructivismo y Aprendizaje Significativo</option>
                      <option value="Escuela Nueva / Metodologías Activas">Escuela Nueva / Metodologías Activas</option>
                      <option value="Otra">Otra metodología (especificar)…</option>
                    </select>
                  </span>
                </label>

                {formData.metodologiaInstitucional === 'Otra' && (
                  <label className="auth-field">
                    <span className="auth-label">Escribe la metodología de tu colegio</span>
                    <span className="auth-input-wrap auth-select-wrap">
                      <input type="text" name="otraMetodologia" value={formData.otraMetodologia} onChange={handleChange} required placeholder="Ej.: Pedagogía dialogante" />
                    </span>
                  </label>
                )}
              </>
            )}

            <label className="auth-field">
              <span className="auth-label sr-only">Correo electrónico</span>
              <span className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon auth-icon-blue" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Correo electrónico" autoComplete="email" />
              </span>
            </label>

            <label className="auth-field">
              <span className="auth-label sr-only">Contraseña</span>
              <span className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon auth-icon-blue" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Contraseña"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {!isLogin && <small className="auth-hint">Mínimo 6 caracteres</small>}
            </label>

            {!isLogin && (
              <div className="auth-terms">
                <label>
                  <input type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleChange} />
                  <span>
                    He leído y acepto los{' '}
                    <button type="button" onClick={() => setShowTermsModal(true)}>Términos y Condiciones</button>{' '}
                    (Ley 1581 / Habeas Data).
                  </span>
                </label>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={ocupado}>
              <span>{loading ? 'Procesando…' : isLogin ? 'Ingresar' : 'Registrarme'}</span>
              <span className="auth-submit-icon">
                {loading ? <Loader2 size={18} className="auth-spin" /> : <ArrowRight size={18} />}
              </span>
            </button>
          </form>

          <div className="auth-divider" role="separator"><span>o</span></div>

          <button type="button" className="auth-google" onClick={handleGoogle} disabled={ocupado}>
            {googleLoading ? <Loader2 size={20} className="auth-spin" /> : <GoogleLogo />}
            <span>{googleLoading ? 'Conectando con Google…' : 'Continuar con Google'}</span>
          </button>

          {isLogin && (
            <p className="auth-legal">
              Al continuar con Google aceptas los{' '}
              <button type="button" onClick={() => setShowTermsModal(true)}>Términos y Condiciones</button>.
            </p>
          )}

          <p className="auth-switch">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button type="button" onClick={() => { setIsLogin((v) => !v); setError(null); }}>
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>

          <p className="auth-secure"><Shield size={13} /> Conexión protegida y datos cifrados</p>
        </section>
      </main>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setFormData((prev) => ({ ...prev, aceptaTerminos: true }))}
      />
    </div>
  );
}
