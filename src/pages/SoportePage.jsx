import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { addTicket } from '../services/dbService';
import { auth } from '../firebase';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

export default function SoportePage() {
  const [enviado, setEnviado] = useState(false);
  const [asunto, setAsunto] = useState('');
  const [desc, setDesc] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { userId, userProfile } = useAppStore();

  if (enviado) {
    return (
      <div className="mgmt-container">
        <div 
          className="mgmt-card" 
          style={{ 
            textAlign: 'center', 
            padding: '56px 36px', 
            backgroundColor: 'rgba(255, 254, 250, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.94)',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(22, 163, 74, 0.16)', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ color: '#142B25', fontSize: '26px', fontWeight: 700, margin: '0 0 10px 0', fontFamily: 'var(--font-heading)' }}>
            ¡Ticket Enviado con Éxito!
          </h2>
          <p style={{ color: '#2B453E', fontSize: '15.5px', maxWidth: '520px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Hemos recibido tu solicitud técnica. Nuestro equipo de administración curricular la revisará y podrás consultar la respuesta en tu bandeja o en la pestaña de notificaciones.
          </p>
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={() => { setEnviado(false); setAsunto(''); setDesc(''); }}
            style={{ padding: '10px 26px', fontSize: '14.5px' }}
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asunto.trim() || !desc.trim() || enviando) return;

    setEnviando(true);
    try {
      const safeUserId = userId || 'anonymous';
      const safeNombre = userProfile?.nombre || 'Docente Anónimo';
      const safeEmail = auth.currentUser?.email || userProfile?.email || 'N/A';
      await addTicket(safeUserId, safeNombre, safeEmail, asunto.trim(), desc.trim());
      setEnviado(true);
    } catch(err) {
      console.error("Error al enviar ticket de soporte:", err);
      alert("Error al enviar el ticket: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mgmt-container">
      
      {/* Cabecera Editorial Institucional (Mismo desenfoque y panel de cristal de Inicio) */}
      <header 
        className="mgmt-header"
        style={{
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          padding: '16px 22px',
          marginBottom: '12px',
          boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div className="mgmt-header-info">
          <div className="mgmt-header-icon" style={{ backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630', borderRadius: '14px', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LifeBuoy size={24} />
          </div>
          <div>
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={13} color="#2B524A" />
              <span>Mesa de Ayuda y Soporte Técnico</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Soporte Técnico Institucional
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '14.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.55', fontWeight: 500 }}>
              ¿Tienes dificultades con el asistente de IA, generación de planes o configuración de tu cuenta? Estamos aquí para acompañarte.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <Clock size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>Respuesta en &lt; 24h</span>
          </div>
          <div className="mgmt-stat-pill">
            <MessageSquare size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>Atención Directa</span>
          </div>
        </div>
      </header>

      {/* Grid de Formulario y Consejos Rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        
        {/* Formulario Principal de Ticket (Mismo desenfoque de cristal) */}
        <div 
          className="mgmt-card" 
          style={{ 
            padding: '20px 24px',
            backgroundColor: 'rgba(255, 254, 250, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.94)',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
          }}
        >
          <div style={{ marginBottom: '14px', borderBottom: '1px solid rgba(49, 91, 84, 0.14)', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '17px', color: '#142B25', margin: 0, fontWeight: 700 }}>
              Crear Nuevo Ticket de Asistencia
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label htmlFor="soporte-asunto" style={{ fontWeight: 600, color: '#142B25', display: 'block', marginBottom: '8px', fontSize: '13.5px' }}>
                Asunto del caso <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input 
                id="soporte-asunto"
                type="text" 
                placeholder="Asunto" 
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="wizard-input"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.80)',
                  border: '1.5px solid rgba(49, 91, 84, 0.20)',
                  borderRadius: '12px'
                }}
                required
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label htmlFor="soporte-desc" style={{ fontWeight: 600, color: '#142B25', display: 'block', marginBottom: '8px', fontSize: '13.5px' }}>
                Descripción detallada del problema <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea 
                id="soporte-desc"
                placeholder="¿Qué ocurrió?" 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="wizard-textarea"
                style={{ 
                  height: '140px',
                  backgroundColor: 'rgba(255, 255, 255, 0.80)',
                  border: '1.5px solid rgba(49, 91, 84, 0.20)',
                  borderRadius: '12px'
                }}
                required
              />
              <span style={{ fontSize: '12.5px', color: '#4A635B', marginTop: '6px', display: 'block' }}>
                Incluye detalles como la materia o si el problema ocurre en un dispositivo específico.
              </span>
            </div>

            <div style={{ paddingTop: '8px' }}>
              <button 
                type="submit"
                className="btn btn-primary" 
                disabled={!asunto.trim() || !desc.trim() || enviando}
                style={{ padding: '11px 26px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {enviando ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                <span>{enviando ? 'Enviando ticket...' : 'Enviar Solicitud'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Panel Lateral con Consejos Rápidos (Mismo desenfoque de cristal) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div 
            className="mgmt-card" 
            style={{ 
              padding: '16px 20px', 
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '16px',
              boxShadow: '0 6px 18px rgba(16, 36, 32, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#183630" />
              <h3 style={{ fontSize: '14.5px', color: '#142B25', margin: 0, fontWeight: 700 }}>
                ¿Falla la generación con IA?
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#2B453E', lineHeight: '1.5', margin: 0 }}>
              Verifica que tu API Key de Google Gemini esté activa y sin espacios al inicio o final en la pestaña de <strong>Configuración IA</strong>. Puedes generar una nueva clave gratuita en Google AI Studio en menos de un minuto.
            </p>
          </div>

          <div 
            className="mgmt-card" 
            style={{ 
              padding: '16px 20px', 
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '16px',
              boxShadow: '0 6px 18px rgba(16, 36, 32, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} color="#183630" />
              <h3 style={{ fontSize: '14.5px', color: '#142B25', margin: 0, fontWeight: 700 }}>
                Protección de tus Datos
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#2B453E', lineHeight: '1.5', margin: 0 }}>
              Tus solicitudes son confidenciales y están respaldadas por nuestra política de tratamiento de datos personales (Ley 1581 de 2012). Ninguna información sensible es compartida públicamente.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
