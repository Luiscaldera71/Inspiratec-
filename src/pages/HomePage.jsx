import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getGenericTemplateForArea } from '../services/templates/genericTemplates';
import { 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  AlertTriangle,
  Calculator,
  FlaskConical,
  Cpu,
  Globe,
  Languages,
  Compass,
  Settings
} from 'lucide-react';

const AREAS_CURRICULARES = [
  {
    id: 'matematicas',
    nombre: 'Matemáticas',
    icon: Calculator,
    color: '#2563EB',
    bgIcon: 'rgba(37, 99, 235, 0.12)',
    accentBorder: 'rgba(37, 99, 235, 0.28)',
    liquidTint: 'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)'
  },
  {
    id: 'ciencias_naturales',
    nombre: 'Ciencias Naturales',
    icon: FlaskConical,
    color: '#16A34A',
    bgIcon: 'rgba(22, 163, 74, 0.12)',
    accentBorder: 'rgba(22, 163, 74, 0.28)',
    liquidTint: 'radial-gradient(circle at 10% 20%, rgba(22, 163, 74, 0.08) 0%, transparent 60%)'
  },
  {
    id: 'lengua_castellana',
    nombre: 'Lengua Castellana',
    icon: BookOpen,
    color: '#E11D48',
    bgIcon: 'rgba(225, 29, 72, 0.12)',
    accentBorder: 'rgba(225, 29, 72, 0.28)',
    liquidTint: 'radial-gradient(circle at 10% 20%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)'
  },
  {
    id: 'tecnologia_informatica',
    nombre: 'Tecnología e Informática',
    icon: Cpu,
    color: '#0D9488',
    bgIcon: 'rgba(13, 148, 136, 0.12)',
    accentBorder: 'rgba(13, 148, 136, 0.28)',
    liquidTint: 'radial-gradient(circle at 10% 20%, rgba(13, 148, 136, 0.08) 0%, transparent 60%)'
  },
  {
    id: 'ciencias_sociales',
    nombre: 'Ciencias Sociales',
    icon: Globe,
    color: '#7C3AED',
    bgIcon: 'rgba(124, 58, 237, 0.12)',
    accentBorder: 'rgba(124, 58, 237, 0.28)',
    liquidTint: 'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)'
  },
  {
    id: 'ingles',
    nombre: 'Inglés',
    icon: Languages,
    color: '#0284C7',
    bgIcon: 'rgba(2, 132, 199, 0.12)',
    accentBorder: 'rgba(2, 132, 199, 0.28)',
    liquidTint: 'radial-gradient(circle at 10% 20%, rgba(2, 132, 199, 0.08) 0%, transparent 60%)'
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { 
    userProfile, 
    apiKey, 
    planesCount, 
    updateWizardData,
    clearWizardFormOnly
  } = useAppStore();

  const primerNombre = userProfile?.nombre ? userProfile.nombre.split(' ')[0] : 'Docente';

  const handleCrearPlanPorArea = (areaNombre) => {
    clearWizardFormOnly();
    const tpl = getGenericTemplateForArea(areaNombre);
    updateWizardData({
      materia: areaNombre,
      asignatura: areaNombre,
      docente: userProfile?.nombre || '',
      institucion: userProfile?.institucion || '',
      formato: tpl?.titulo || `Formato de ${areaNombre}`,
      formatoInstrucciones: '',
      esTransversal: false,
      recursos: ''
    });
    navigate('/');
  };

  const handleCrearPlanTransversal = () => {
    clearWizardFormOnly();
    const tpl = getGenericTemplateForArea('Tecnología e Informática');
    updateWizardData({
      materia: 'Tecnología e Informática',
      asignatura: 'Tecnología e Informática',
      docente: userProfile?.nombre || '',
      institucion: userProfile?.institucion || '',
      esTransversal: true,
      areaSecundaria: 'Matemáticas',
      ejeTransversal: 'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)',
      formato: tpl?.titulo || 'Estructura estándar INSPIRATEC',
      formatoInstrucciones: '',
      recursos: ''
    });
    navigate('/');
  };

  const handleIniciarLibre = () => {
    clearWizardFormOnly();
    navigate('/');
  };

  return (
    <div className="home-full-immersive-view" style={{ minHeight: 'calc(100vh - 64px)', paddingBottom: '40px', position: 'relative' }}>
      
      {/* ORBES LÍQUIDOS FLOTANTES EN EL FONDO (Generan refracción auténtica a través del cristal) */}
      <div className="liquid-ambient-container" aria-hidden="true">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      <div 
        className="home-content-container"
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}
      >
        
        {/* ENCABEZADO ULTRA-LIMPIO CON LIQUID GLASS */}
        <header 
          className="liquid-glass-header"
          style={{
            borderRadius: '24px',
            padding: '26px 30px'
          }}
        >
          {/* Fila superior: Saludo y accesos rápidos */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '5px 14px', 
              backgroundColor: 'rgba(24, 54, 48, 0.08)', 
              borderRadius: '999px', 
              color: '#183630', 
              fontSize: '12.5px', 
              fontWeight: 700,
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8)'
            }}>
              <Sparkles size={13} color="#183630" />
              <span>Hola, {primerNombre}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/mis-planes')}
                className="liquid-arrow-action"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1E3A34',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 36, 32, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
                }}
                title="Ver mis planes guardados"
              >
                <FileText size={13} />
                <span>{planesCount || 0} planes</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/config')}
                className="liquid-arrow-action"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1E3A34',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 36, 32, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
                }}
                title="Configuración de IA y perfil"
              >
                <Settings size={13} />
                <span>Ajustes</span>
              </button>
            </div>
          </div>

          {/* Título de alto impacto sin saturación de texto */}
          <h1 style={{ 
            fontSize: '32px', 
            fontFamily: 'var(--font-heading)', 
            color: '#0E241E', 
            margin: '0 0 6px 0',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            ¿Qué vas a enseñar hoy?
          </h1>
          <p style={{ 
            color: '#4B5E57', 
            fontSize: '15px', 
            margin: 0,
            fontWeight: 500
          }}>
            Elige tu área de trabajo para comenzar a crear tu plan de clase con IA.
          </p>

          {!apiKey && (
            <div style={{ 
              marginTop: '14px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '12px', 
              color: '#C2410C', 
              backgroundColor: 'rgba(234, 88, 12, 0.08)', 
              padding: '6px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(234, 88, 12, 0.2)'
            }}>
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>
                Para activar la IA, registra tu clave en{' '}
                <button 
                  type="button" 
                  onClick={() => navigate('/config')} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    fontWeight: 700, 
                    textDecoration: 'underline', 
                    cursor: 'pointer', 
                    padding: 0 
                  }}
                >
                  Configuración
                </button>.
              </span>
            </div>
          )}
        </header>

        {/* PARRILLA DE ÁREAS CURRICULARES CON EFECTO Y REFLEJO LIQUID GLASS */}
        <section>
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '14px'
            }}
          >
            {AREAS_CURRICULARES.map((area) => {
              const IconComp = area.icon;
              return (
                <div
                  key={area.id}
                  onClick={() => handleCrearPlanPorArea(area.nombre)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCrearPlanPorArea(area.nombre);
                    }
                  }}
                  className="liquid-glass-card"
                  style={{
                    borderRadius: '20px',
                    padding: '20px 22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    borderColor: area.accentBorder,
                    backgroundImage: area.liquidTint
                  }}
                  title={`Crear plan en ${area.nombre}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div 
                      className="liquid-icon-float"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        backgroundColor: area.bgIcon,
                        color: area.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: `1px solid ${area.accentBorder}`,
                        boxShadow: `0 4px 14px ${area.bgIcon}, inset 0 1px 1px rgba(255, 255, 255, 0.9)`
                      }}
                    >
                      <IconComp size={24} />
                    </div>

                    <div>
                      <h2 style={{
                        fontSize: '17.5px',
                        fontWeight: 700,
                        color: '#0E241E',
                        margin: 0,
                        lineHeight: '1.25'
                      }}>
                        {area.nombre}
                      </h2>
                      <span style={{ fontSize: '12px', color: '#687B75', fontWeight: 500 }}>
                        Iniciar clase
                      </span>
                    </div>
                  </div>

                  <div 
                    className="liquid-arrow-action"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: area.bgIcon,
                      color: area.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `1px solid ${area.accentBorder}`,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ACCIONES COMPLEMENTARIAS CON LIQUID GLASS */}
        <section 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '12px' 
          }}
        >
          {/* Opción A: Proyecto Transversal o STEAM */}
          <div
            onClick={handleCrearPlanTransversal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCrearPlanTransversal();
              }
            }}
            className="liquid-glass-card"
            style={{
              backgroundColor: 'rgba(240, 253, 244, 0.82)',
              borderColor: 'rgba(134, 239, 172, 0.7)',
              borderRadius: '18px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            title="Diseñar un plan interdisciplinar STEAM"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                className="liquid-icon-float"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.9)'
                }}
              >
                <Compass size={20} />
              </div>
              <div>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#14532D', display: 'block' }}>
                  Proyecto Transversal / STEAM
                </span>
                <span style={{ fontSize: '12px', color: '#166534' }}>
                  Articular dos áreas simultáneas
                </span>
              </div>
            </div>
            <div className="liquid-arrow-action">
              <ArrowRight size={16} color="#15803D" />
            </div>
          </div>

          {/* Opción B: Iniciar en Blanco */}
          <div
            onClick={handleIniciarLibre}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleIniciarLibre();
              }
            }}
            className="liquid-glass-card"
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.82)',
              borderColor: 'rgba(24, 54, 48, 0.22)',
              borderRadius: '18px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            title="Abrir el asistente sin preselección de área"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                className="liquid-icon-float"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(24, 54, 48, 0.08)',
                  color: '#183630',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.9)'
                }}
              >
                <PlusCircle size={20} />
              </div>
              <div>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#142B25', display: 'block' }}>
                  Plan en Blanco
                </span>
                <span style={{ fontSize: '12px', color: '#526660' }}>
                  Comenzar desde cero
                </span>
              </div>
            </div>
            <div className="liquid-arrow-action">
              <ArrowRight size={16} color="#183630" />
            </div>
          </div>
        </section>

        {/* ENLACE SECUNDARIO A PLANTILLAS */}
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => navigate('/plantillas')}
            className="liquid-arrow-action"
            style={{
              background: 'none',
              border: 'none',
              color: '#315B54',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'underline'
            }}
          >
            <BookOpen size={14} />
            <span>Ver biblioteca de plantillas curriculares</span>
          </button>
        </div>

      </div>
    </div>
  );
}
