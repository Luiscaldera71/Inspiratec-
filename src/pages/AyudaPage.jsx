import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  LifeBuoy, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AyudaPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const preguntas = [
    { 
      q: "¿Cómo genero mi primer plan de clase?", 
      a: "Accede al Planificador de Clases desde el menú lateral. El asistente te guiará en 4 fases: información básica (tema y materia), metodología pedagógica, estándares curriculares del MEN y consideraciones DUA. Finalmente, pulsa 'Generar Clase' y el co-docente de IA estructurará la secuencia didáctica completa.",
      categoria: "Planificación",
      icon: <Sparkles size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Cómo guardo, descargo y comparto mis secuencias?", 
      a: "Desde el Editor interactivo puedes pulsar 'Guardar en la nube' en cualquier momento. Tu planeación quedará registrada en 'Mis Planes', donde tendrás opciones para descargarla en formato Word (.docx), PDF oficial o transferirla a la Biblioteca Comunitaria para inspirar a otros maestros.",
      categoria: "Almacenamiento",
      icon: <FileText size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Qué son las plantillas y para qué sirven?", 
      a: "Las plantillas te permiten estandarizar la estructura didáctica de tus clases (Momentos de Inicio, Desarrollo, Cierre, Criterios de Evaluación y DUA). Al seleccionar una plantilla en el planificador, la IA organizará la respuesta respetando estrictamente el formato institucional de tu colegio.",
      categoria: "Plantillas",
      icon: <BookOpen size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Qué son los ajustes razonables y el enfoque DUA?", 
      a: "El Diseño Universal para el Aprendizaje (DUA) garantiza que la enseñanza ofrezca múltiples formas de representación, expresión e implicación. INSPIRATEC incorpora sugerencias automáticas para estudiantes con barreras visuales, auditivas, motoras o requerimientos del PIAR institucional.",
      categoria: "Inclusión DUA",
      icon: <Compass size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Cómo configuro mi propia clave de Inteligencia Artificial (BYOK)?", 
      a: "En la barra superior pulsa en 'Configuración IA' (o en la sección de Herramientas). Allí puedes pegar tu clave API de Google Gemini gratuita. Tu clave se almacena de forma segura y cifrada exclusivamente en tu navegador, garantizando total privacidad.",
      categoria: "Configuración",
      icon: <CheckCircle2 size={16} color="var(--primary-sage)" />
    }
  ];

  const filteredPreguntas = preguntas.filter(p => 
    p.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <HelpCircle size={24} />
          </div>
          <div>
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <Sparkles size={13} color="#2B524A" />
              <span>Base de Conocimiento y Guías</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Centro de Ayuda Pedagógica
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '14.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.55', fontWeight: 500 }}>
              Resuelve tus dudas sobre el asistente de secuencias didácticas, plantillas curriculares y adaptaciones de aula con IA.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <BookOpen size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{preguntas.length} Guías Oficiales</span>
          </div>
          <div className="mgmt-stat-pill">
            <LifeBuoy size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>Soporte Disponible</span>
          </div>
        </div>
      </header>

      {/* Barra de Búsqueda de Cristal (Mismo desenfoque) */}
      <div 
        className="mgmt-filter-bar" 
        style={{ 
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '16px',
          padding: '10px 16px',
          marginBottom: '12px',
          boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div className="mgmt-search-box" style={{ maxWidth: '100%' }}>
          <Search size={16} color="var(--primary-sage)" />
          <input 
            type="text" 
            placeholder="Buscar" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mgmt-search-input"
            aria-label="Buscar en las guías y preguntas"
          />
        </div>
      </div>

      {/* Lista de Preguntas Frecuentes en Tarjetas de Cristal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {filteredPreguntas.length === 0 ? (
          <div 
            className="mgmt-empty-card"
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '20px',
              padding: '24px 20px',
              boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
            }}
          >
            <HelpCircle size={32} color="var(--primary-sage)" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '16px', color: '#142B25', margin: '0 0 4px 0', fontWeight: 700 }}>No se encontraron respuestas</h3>
            <p style={{ fontSize: '13.5px', color: '#2B453E', margin: 0 }}>
              Prueba con otro término de búsqueda o contacta directamente a nuestro soporte técnico.
            </p>
          </div>
        ) : (
          filteredPreguntas.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index} 
                className="mgmt-card" 
                style={{ 
                  padding: '16px 20px',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  border: isExpanded ? '1px solid #142B25' : '1px solid rgba(255, 255, 255, 0.94)',
                  backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 254, 250, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: isExpanded ? '0 8px 24px rgba(16, 36, 32, 0.10)' : '0 4px 14px rgba(16, 36, 32, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', backgroundColor: 'rgba(71, 122, 114, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#183630', backgroundColor: 'rgba(71, 122, 114, 0.14)', padding: '2px 7px', borderRadius: '999px', marginRight: '6px' }}>
                        {item.categoria}
                      </span>
                      <h3 style={{ fontSize: '15px', color: '#142B25', margin: '4px 0 0 0', fontWeight: 700 }}>
                        {item.q}
                      </h3>
                    </div>
                  </div>
                  <div style={{ color: '#183630', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(49, 91, 84, 0.14)', color: '#243B34', fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: 0 }}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tarjeta Flotante: Recorrido Explicativo de Bienvenida (Mismo desenfoque de cristal) */}
      <div 
        className="mgmt-card" 
        style={{ 
          padding: '18px 24px', 
          textAlign: 'center', 
          marginBottom: '12px',
          backgroundColor: 'rgba(255, 254, 250, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
          <Sparkles size={20} />
        </div>
        <h3 style={{ color: '#142B25', fontSize: '17px', fontWeight: 700, margin: '0 0 4px 0' }}>
          Recorrido Explicativo de Bienvenida
        </h3>
        <p style={{ color: '#2B453E', fontSize: '13.5px', maxWidth: '580px', margin: '0 auto 14px', lineHeight: '1.55' }}>
          Revive la presentación visual e interactiva sobre la organización, herramientas curriculares y filosofía educativa de INSPIRATEC.
        </p>
        <button 
          type="button"
          className="btn btn-primary" 
          onClick={() => {
            navigate('/home');
            setTimeout(() => window.dispatchEvent(new Event('open-bienvenida')), 100);
          }}
          style={{ padding: '8px 20px', fontSize: '13.5px' }}
        >
          Ver Bienvenida Interactiva
        </button>
      </div>

      {/* Tarjeta Flotante: Contacto a Soporte (Mismo desenfoque de cristal) */}
      <div 
        className="mgmt-card" 
        style={{ 
          padding: '18px 24px', 
          textAlign: 'center', 
          backgroundColor: 'rgba(255, 254, 250, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
        }}
      >
        <h3 style={{ fontSize: '16px', color: '#142B25', margin: '0 0 4px 0', fontWeight: 700 }}>
          ¿Aún necesitas ayuda o reportar un caso?
        </h3>
        <p style={{ color: '#3A544C', fontSize: '13.5px', margin: '0 0 12px 0' }}>
          Nuestro equipo técnico docente está disponible para orientarte en la configuración y uso de la plataforma.
        </p>
        <button 
          type="button"
          className="btn-outline" 
          onClick={() => navigate('/soporte')}
          style={{ padding: '8px 18px', fontSize: '13.5px' }}
        >
          <LifeBuoy size={15} /> Contactar a Soporte Técnico
        </button>
      </div>

    </div>
  );
}
