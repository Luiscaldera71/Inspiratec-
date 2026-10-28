import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function TermsAndConditionsModal({ isOpen, onClose, onAccept }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div 
        className="modal-glass-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="modal-glass-card"
          style={{ maxWidth: '720px' }}
        >
          {/* Header */}
          <div className="modal-glass-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(71, 122, 114, 0.14)',
                border: '1px solid rgba(71, 122, 114, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1C3D36',
                flexShrink: 0
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 id="terms-modal-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                  Términos y Política de Datos Personales
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#527068' }}>
                  Conforme a la Ley 1581 de 2012 y Normativa de Habeas Data en Colombia
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="modal-glass-close-btn"
              aria-label="Cerrar modal de términos"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Scrollable */}
          <div className="modal-glass-body" style={{ fontSize: '14px', lineHeight: '1.65', color: '#1E352E' }}>
            <div style={{
              backgroundColor: 'rgba(71, 122, 114, 0.08)',
              border: '1px solid rgba(71, 122, 114, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#142B25',
              fontSize: '13px'
            }}>
              <Lock size={18} style={{ flexShrink: 0, color: '#315B54' }} />
              <span>
                <strong>Privacidad y Seguridad Garantizada:</strong> Tus datos de contacto (número celular y correo) se almacenan protegidos mediante cifrado criptográfico y tokens de autenticación JWT.
              </span>
            </div>

            <h4 style={{ color: '#142B25', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              1. Identificación del Responsable del Tratamiento
            </h4>
            <p style={{ marginBottom: '16px' }}>
              La plataforma <strong>INSPIRATEC</strong> actúa como responsable del tratamiento de los datos personales recolectados a través de su sitio web y aplicativo de planeación docente con Inteligencia Artificial.
            </p>

            <h4 style={{ color: '#142B25', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              2. Marco Normativo Aplicable
            </h4>
            <p style={{ marginBottom: '8px' }}>
              La recolección, almacenamiento, uso y protección de datos se rigen de acuerdo con el marco legal colombiano:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Artículo 15 de la Constitución Política de Colombia:</strong> Derecho fundamental a la intimidad personal y familiar, buen nombre y Habeas Data.</li>
              <li><strong>Ley Estatutaria 1581 de 2012:</strong> Régimen General de Protección de Datos Personales en Colombia.</li>
              <li><strong>Decreto Reglamentario 1377 de 2013:</strong> Reglamentación de la autorización previa, expresa e informada del titular.</li>
              <li><strong>Ley 1273 de 2009:</strong> De la protección de la información y de los datos (Delitos Informáticos).</li>
            </ul>

            <h4 style={{ color: '#142B25', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              3. Datos Recolectados y Finalidades Específicas
            </h4>
            <p style={{ marginBottom: '8px' }}>
              Recolectamos datos como: <em>Nombre completo, Correo electrónico, Número Celular / WhatsApp, Institución Educativa, Nivel Académico</em> y preferencias pedagógicas. Estos datos serán utilizados estrictamente para:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Personalización Pedagógica:</strong> Adecuar las respuestas y planes generados por los modelos de Inteligencia Artificial (Google Gemini) al contexto real de tu aula.</li>
              <li><strong>Canal de Comunicación y Soporte:</strong> Brindar asistencia técnica, notificaciones de novedades del sistema y recuperación de acceso mediante correo y número celular registrado.</li>
              <li><strong>Seguridad e Integridad de la Cuenta:</strong> Emisión de tokens de sesión autenticados (JWT - JSON Web Tokens) para validar la identidad y prevenir suplantaciones.</li>
              <li><strong>Estadísticas Agregadas Anónimas:</strong> Medir el impacto pedagógico global sin revelar en ningún momento la identidad particular del docente ni de sus estudiantes.</li>
            </ul>

            <h4 style={{ color: '#142B25', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              4. Mecanismos de Encriptación y Seguridad
            </h4>
            <p style={{ marginBottom: '16px' }}>
              En cumplimiento del principio de seguridad, los datos sensibles —en particular el <strong>número celular</strong>— son procesados con <strong>encriptación simétrica en reposo</strong> y transmitidos bajo protocolos seguros HTTPS/TLS. Toda sesión y ejecución de pruebas dentro de la plataforma cuenta con firma criptográfica <strong>JWT</strong> para garantizar la autenticidad del emisor.
            </p>

            <h4 style={{ color: '#142B25', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              5. Derechos del Titular (Derechos de Habeas Data)
            </h4>
            <p style={{ marginBottom: '8px' }}>
              Como titular de los datos, te asisten los siguientes derechos contemplados en el Artículo 8 de la Ley 1581 de 2012:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Conocer, actualizar y rectificar tus datos personales en cualquier momento desde tu perfil.</li>
              <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
              <li>Ser informado sobre el uso que se le ha dado a tus datos personales.</li>
              <li>Revocar la autorización o solicitar la supresión del dato cuando no se respeten los principios legales.</li>
              <li>Acceder en forma gratuita a tus datos personales tratados por el sistema.</li>
            </ul>

            <h4 style={{ color: '#142B25', fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              6. Canales para Ejercer tus Derechos
            </h4>
            <p style={{ marginBottom: '16px' }}>
              Puedes actualizar tus datos o solicitar la supresión de tu cuenta en el menú <em>"Mi Perfil"</em>, enviando un ticket desde la sección <em>"Soporte"</em> o comunicándote al canal institucional de privacidad: <strong>habeasdata@inspiratec.edu.co</strong>.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="modal-glass-footer" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#527068' }}>
              Última actualización: Febrero 2026
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={onClose}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cerrar
              </button>
              {onAccept && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => { onAccept(); onClose(); }}
                  style={{
                    padding: '8px 20px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} /> Aceptar Términos
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
