import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { testApiConnection } from '../services/aiService';
import { updateUserProfile } from '../services/authService';
import FelderSilvermanModule from '../components/FelderSilvermanModule';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Eye,
  EyeOff,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfigPage() {
  const { apiKey, setApiKey, userId, userProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState('ia'); // 'ia' | 'estilos'
  const [inputKey, setInputKey] = useState(apiKey);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [showPassword, setShowPassword] = useState(false);

  const tienePerfilFelder = Boolean(
    userProfile?.felderSilverman || 
    (typeof window !== 'undefined' && localStorage.getItem('inspiratec_felder_silverman'))
  );

  const handleSaveAndTest = async (e) => {
    e?.preventDefault();
    if (!inputKey.trim()) return;

    setStatus('loading');
    const isValid = await testApiConnection(inputKey.trim());
    if (isValid) {
      setApiKey(inputKey.trim());
      setStatus('success');
      if (userId) {
        try {
          await updateUserProfile(userId, { apiKey: inputKey.trim() });
        } catch (err) {
          console.error("Error guardando API Key en perfil:", err);
        }
      }
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="mgmt-container">
      
      {/* Cabecera del Módulo */}
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
            {activeTab === 'ia' ? <Key size={24} /> : <Compass size={24} />}
          </div>
          <div>
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <Sparkles size={13} color="#2B524A" />
              <span>
                {activeTab === 'ia' ? 'Conectividad e Inteligencia Artificial' : 'Perfil Docente & Mediación DUA'}
              </span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              {activeTab === 'ia' ? 'Configuración de Inteligencia Artificial' : 'Autodiagnóstico Pedagógico (Felder-Silverman)'}
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '14.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.55', fontWeight: 500 }}>
              {activeTab === 'ia' 
                ? 'Administra tu clave privada BYOK (Bring Your Own Key) para conectar los servicios de Gemini con máxima velocidad y privacidad.'
                : 'Explora tus tendencias pedagógicas en 4 dimensiones continuas mediante un gráfico radial interactivo basado en Felder-Silverman.'
              }
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className={`mgmt-stat-pill ${apiKey ? 'saved' : 'draft'}`}>
            <ShieldCheck size={14} style={{ color: apiKey ? 'var(--primary-sage)' : '#ca8a04' }} />
            <span>{apiKey ? 'API Key Configurada' : 'Sin Clave Activa'}</span>
          </div>

          <div className={`mgmt-stat-pill ${tienePerfilFelder ? 'saved' : 'draft'}`}>
            <Compass size={14} style={{ color: tienePerfilFelder ? 'var(--primary-sage)' : '#ca8a04' }} />
            <span>{tienePerfilFelder ? 'Perfil Docente Activo' : 'Autodiagnóstico Pendiente'}</span>
          </div>
        </div>
      </header>

      {/* Selector de Pestañas de Cristal */}
      <div 
        className="mgmt-filter-bar" 
        style={{ 
          marginBottom: '12px', 
          padding: '6px 10px', 
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '14px',
          boxShadow: '0 6px 20px rgba(16, 36, 32, 0.05)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}
        role="tablist"
        aria-label="Pestañas de configuración"
      >
        <button 
          type="button"
          role="tab"
          aria-selected={activeTab === 'ia'}
          onClick={() => setActiveTab('ia')}
          className={`btn-outline ${activeTab === 'ia' ? 'active' : ''}`}
          style={{ 
            padding: '7px 16px', 
            fontSize: '13.5px', 
            borderRadius: '10px',
            backgroundColor: activeTab === 'ia' ? '#142B25' : 'rgba(255, 255, 255, 0.90)',
            color: activeTab === 'ia' ? '#FFFFFF' : '#142B25',
            borderColor: activeTab === 'ia' ? '#142B25' : 'rgba(49, 91, 84, 0.18)',
            fontWeight: activeTab === 'ia' ? 700 : 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'ia' ? '0 4px 12px rgba(20, 43, 37, 0.20)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Key size={15} />
          <span>Inteligencia Artificial (API Key)</span>
        </button>

        <button 
          type="button"
          role="tab"
          aria-selected={activeTab === 'estilos'}
          onClick={() => setActiveTab('estilos')}
          className={`btn-outline ${activeTab === 'estilos' ? 'active' : ''}`}
          style={{ 
            padding: '7px 16px', 
            fontSize: '13.5px', 
            borderRadius: '10px',
            backgroundColor: activeTab === 'estilos' ? '#142B25' : 'rgba(255, 255, 255, 0.90)',
            color: activeTab === 'estilos' ? '#FFFFFF' : '#142B25',
            borderColor: activeTab === 'estilos' ? '#142B25' : 'rgba(49, 91, 84, 0.18)',
            fontWeight: activeTab === 'estilos' ? 700 : 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'estilos' ? '0 4px 12px rgba(20, 43, 37, 0.20)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Compass size={15} />
          <span>Autodiagnóstico Felder-Silverman</span>
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <AnimatePresence mode="wait">
        {activeTab === 'ia' ? (
          <motion.div 
            key="tab-ia"
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={17} style={{ color: 'var(--primary-active)' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#142B25', margin: 0, fontWeight: 700 }}>
                Google Gemini API Key
              </h2>
            </div>
            
            <p style={{ color: '#2B453E', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '28px' }}>
              Para que el planificador pedagógico, las sugerencias DUA y el co-docente interactivo funcionen con la máxima velocidad y autonomía, ingresa tu clave API personal de Google AI Studio.
            </p>
            
            <form onSubmit={handleSaveAndTest}>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="gemini-api-key"
                  style={{ fontSize: '14px', color: '#142B25', fontWeight: 600, marginBottom: '8px', display: 'block' }}
                >
                  Clave de API de Gemini *
                </label>
                
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    id="gemini-api-key"
                    type={showPassword ? 'text' : 'password'} 
                    value={inputKey}
                    onChange={(e) => { setInputKey(e.target.value); setStatus('idle'); }}
                    placeholder="AIzaSy..."
                    className="wizard-input"
                    style={{ 
                      width: '100%', 
                      paddingRight: '48px', 
                      fontFamily: 'monospace', 
                      fontSize: '14.5px',
                      backgroundColor: 'rgba(255, 255, 255, 0.80)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1.5px solid rgba(49, 91, 84, 0.20)',
                      borderRadius: '12px',
                      color: '#142B25'
                    }}
                    disabled={status === 'loading'}
                    autoComplete="off"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '4px' }}
                    title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                    aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <p className="form-helper-text" style={{ color: '#4A635B', marginTop: '6px' }}>
                  Tu clave se almacena de forma segura en tu navegador y en tu perfil docente. Nunca se comparte con terceros.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={status === 'loading' || !inputKey.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '42px', padding: '8px 22px' }}
                >
                  {status === 'loading' ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
                  <span>{status === 'loading' ? 'Validando conexión...' : 'Guardar y Probar Conexión'}</span>
                </button>
              </div>
            </form>

            {/* Notificaciones de Estado de Validación */}
            {status === 'success' && (
              <div style={{ padding: '14px 18px', backgroundColor: 'rgba(220, 252, 231, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: '#166534', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(22, 163, 74, 0.35)', marginBottom: '24px' }}>
                <CheckCircle size={22} style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>¡Conexión verificada exitosamente!</strong>
                  <span style={{ fontSize: '13px' }}>Tu clave es válida y todos los servicios pedagógicos con IA están listos para utilizarse.</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div style={{ padding: '14px 18px', backgroundColor: 'rgba(254, 226, 226, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: '#991B1B', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(220, 38, 38, 0.35)', marginBottom: '24px' }}>
                <XCircle size={22} style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px' }}>No se pudo validar la clave</strong>
                  <span style={{ fontSize: '13px' }}>Verifica que la clave comience por "AIzaSy..." y tenga habilitada la cuota en Google AI Studio.</span>
                </div>
              </div>
            )}

            {/* Ayuda y Enlace a AI Studio */}
            <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(49, 91, 84, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '13.5px', color: '#2B453E' }}>
                ¿Aún no tienes una clave de API gratuita?
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px' }}
              >
                <span>Obtener en Google AI Studio</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tab-estilos"
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <FelderSilvermanModule />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

