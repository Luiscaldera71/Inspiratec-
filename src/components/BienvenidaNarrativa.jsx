import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { updateUserPedagogicalProfile } from '../services/authService';
import './BienvenidaNarrativa.css';
import { 
  Lightbulb, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  FileText, 
  Layers, 
  Library, 
  MessageSquare, 
  HelpCircle, 
  LifeBuoy, 
  Info, 
  Settings,
  Dna,
  Edit3
} from 'lucide-react';

/* ==========================================================================
   IMAGEN ÚNICA INSTITUCIONAL OFICIAL DE BIENVENIDA
   Ubicada en la carpeta Bienvenida (Bien.png)
   ========================================================================== */
const BIEN_IMAGE = '/Bienvenida/Bien.png';

/* ==========================================================================
   CONFIGURACIÓN DE ESCENAS NARRATIVAS ACTUALIZADAS (ECOSISTEMA INSPIRATEC)
   Presenta todos los apartados esenciales, el nuevo ADN Pedagógico,
   la suite de materiales didácticos interactivos y la soberanía del docente.
   ========================================================================== */
const SCENES = [
  {
    id: 'inicio',
    image: BIEN_IMAGE,
    badge: 'Bienvenida · Visión Editorial 2026',
    icon: <Sparkles size={16} />,
    title: 'Bienvenido a INSPIRATEC',
    description: 'Un ecosistema creado para potenciar la labor docente con serenidad, rigor pedagógico y tecnología reflexiva. Aquí la Inteligencia Artificial actúa como un co-diseñador para estructurar tus ideas, mientras que el criterio educativo, la sensibilidad del aula y la toma de decisiones permanecen siempre en tus manos.',
    canDo: 'Descubre en este recorrido los apartados esenciales de la plataforma o ingresa directamente a tu espacio de trabajo.',
    actionLabel: 'Comenzar Recorrido',
    actionHint: 'Desplázate hacia abajo o pulsa continuar'
  },
  {
    id: 'planificador',
    image: BIEN_IMAGE,
    badge: 'El Planificador · Creador de Secuencias',
    icon: <Compass size={16} />,
    title: 'Crea secuencias didácticas completas y contextualizadas',
    description: 'El núcleo de diseño pedagógico de INSPIRATEC. A través de un asistente paso a paso, defines el tema, área curricular, grado escolar, estándares y DBA del MEN, metodologías activas y consideraciones de accesibilidad e inclusión (DUA) para generar una propuesta estructurada con tiempos realistas.',
    canDo: 'Configura las variables de tu clase, activa sugerencias pedagógicas con IA y obtén una propuesta curricular lista para enriquecer en el editor.',
    actionLabel: 'Siguiente: Mi ADN Pedagógico',
    actionHint: 'Diseño curricular paso a paso'
  },
  {
    id: 'adn-pedagogico',
    image: BIEN_IMAGE,
    badge: 'Mi ADN Pedagógico · Identidad y Memoria',
    icon: <Dna size={16} />,
    title: 'Tu sello profesional con memoria de éxito continua',
    description: 'Tu perfil docente evoluciona con tu práctica. Este apartado registra automáticamente qué metodologías has calificado mejor (ABP, Gamificación, DUA, Pensamiento Computacional), los recursos didácticos que más empleas y tu caja de herramientas favorita. Además, te permite articular proyectos transversales institucionales (STEAM, PRAE ambiental, Convivencia y Ciudadanía) cruzando áreas secundarias.',
    canDo: 'Fija con estrella tus dinámicas predilectas, guarda tu filosofía pedagógica y activa el interruptor "✨ Aplicar mi ADN Pedagógico" al planificar para que cada clase refleje tu identidad.',
    actionLabel: 'Siguiente: Editor & Modo Socrático',
    actionHint: 'Personalización curricular inteligente'
  },
  {
    id: 'editor',
    image: BIEN_IMAGE,
    badge: 'Editor Estructurado · Laboratorio de Mediación',
    icon: <Edit3 size={16} />,
    title: 'Perfecciona y ajusta tu clase sin código crudo',
    description: 'Un entorno de trabajo interactivo que descompone tu plan en secciones modulares: tablas de secuencia didáctica, fórmulas matemáticas limpias en KaTeX y un asistente conversacional con doble modo: Modo Directo para modificaciones inmediatas y Modo Socrático Guiado para dialogar reflexivamente antes de alterar el documento.',
    canDo: 'Modifica celdas directamente en pantalla, consulta sugerencias reflexivas con Gemini y exporta tu documento final en formato oficial Word (.docx) o PDF.',
    actionLabel: 'Siguiente: Materiales Didácticos',
    actionHint: 'Edición fluida sin enredos técnicos'
  },
  {
    id: 'materiales-didacticos',
    image: BIEN_IMAGE,
    badge: 'Materiales Didácticos · Recursos de Aula',
    icon: <Layers size={16} />,
    title: 'Suite completa de 6 recursos interactivos y portables',
    description: 'Lleva tu planeación directamente a la interacción con los estudiantes. En el panel inferior del editor puedes generar una suite completa de materiales adaptados a tu tema: Presentación con diapositivas, Sopa de letras temática, Banco de preguntas formativas, Trivia gamificada con audio, Rúbrica socioformativa analítica y Flashcards 3D.',
    canDo: 'Genera recursos adaptados al tema de tu clase, compártelos directamente con tus estudiantes por enlace o WhatsApp y descárgalos como archivos HTML autónomos que funcionan sin conexión a internet.',
    actionLabel: 'Siguiente: Mis Planes y Formatos',
    actionHint: 'Materiales 100% funcionales y portables'
  },
  {
    id: 'mis-planes',
    image: BIEN_IMAGE,
    badge: 'Mis Planes & Formatos · Bóveda Curricular',
    icon: <FileText size={16} />,
    title: 'Repositorio seguro y adaptación al formato de tu colegio',
    description: 'Cada secuencia didáctica queda guardada en tu repositorio personal protegido en la nube y en tu almacenamiento local. Además, cuentas con plantillas oficiales por área (Matemáticas, Tecnología, Ciencias Naturales, Ciencias Sociales, Lenguaje e Inglés) y la libertad de crear formatos propios con las secciones que exige tu colegio.',
    canDo: 'Retoma borradores, filtra por estado (Borrador, Guardado, Sistematizado), descarga copias institucionales y reutiliza plantillas con un solo clic.',
    actionLabel: 'Siguiente: Comunidad Docente',
    actionHint: 'Archivos siempre a tu alcance'
  },
  {
    id: 'comunidad',
    image: BIEN_IMAGE,
    badge: 'Comunidad · Inteligencia Colectiva',
    icon: <Library size={16} />,
    title: 'Biblioteca, bitácora de experiencias y foro colegiado',
    description: 'La docencia se enriquece en red. En la Biblioteca Comunitaria puedes explorar y clonar proyectos de maestros de todo el país; en Experiencias sistematizas lo ocurrido en el aula documentando qué funcionó y qué ajustes requirió el grupo; y en el Foro Docente debates sobre retos cotidianos de evaluación e inclusión.',
    canDo: 'Publica tus mejores creaciones, califica recursos probados en aula y participa en debates pedagógicos horizontales.',
    actionLabel: 'Siguiente: Configuración IA',
    actionHint: 'Conocimiento educativo abierto y colaborativo'
  },
  {
    id: 'configuracion_ia',
    image: BIEN_IMAGE,
    badge: 'Configuración IA · Tu Motor Gemini',
    icon: <Settings size={16} />,
    title: 'Control total, privacidad y soberanía tecnológica',
    description: 'INSPIRATEC opera conectado a la API de Google Gemini (Gemini 2.5/3.5 Flash). Al ingresar tu clave personal gratuita, tus planes no se comparten públicamente con terceros, no dependes de cuotas colectivas saturadas y mantienes el control directo de la generación inteligente.',
    canDo: 'Ingresa tu API Key de Gemini en Configuración (icono de engrane en la barra superior) para activar la asistencia inteligente en toda la plataforma.',
    actionLabel: 'Ir a Inicio',
    actionHint: 'Configuración disponible en la barra superior'
  }
];

export default function BienvenidaNarrativa() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userProfile } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef(null);

  // Comprobar si la bienvenida debe mostrarse:
  // ÚNICAMENTE 1 sola vez y exclusivamente cuando el usuario se registra
  useEffect(() => {
    if (!userId || userId === 'anon') return;

    const storageKey = `inspiratec_bienvenida_completada_${userId}`;
    const alreadyCompleted = localStorage.getItem(storageKey);

    // Si ya fue completada localmente o en el perfil de Firestore, jamás abrir automáticamente
    if (alreadyCompleted === 'true' || userProfile?.bienvenidaCompletada === true) {
      return;
    }

    // El tutorial solo debe aparecer 1 sola vez y es cuando el usuario se registra
    const isJustRegistered = 
      sessionStorage.getItem('inspiratec_just_registered') === userId ||
      localStorage.getItem(`inspiratec_just_registered_${userId}`) === 'true';

    // Si está en /home Y acaba de registrarse, mostrarlo una única vez
    if (location.pathname === '/home' && isJustRegistered) {
      setIsOpen(true);
    }
  }, [userId, userProfile?.bienvenidaCompletada, location.pathname]);

  // Manejar evento global para reapertura manual (desde Ayuda, Menú o Footer)
  useEffect(() => {
    const handleManualOpen = () => {
      setCurrentScene(0);
      setIsOpen(true);
      if (location.pathname !== '/home') {
        navigate('/home');
      }
    };

    window.addEventListener('open-bienvenida', handleManualOpen);
    return () => {
      window.removeEventListener('open-bienvenida', handleManualOpen);
    };
  }, [location.pathname, navigate]);

  // Si no está abierta o no estamos en /home, no renderizar nada
  const isVisible = isOpen && location.pathname === '/home';

  // Registrar finalización y cerrar la experiencia definitivamente
  const handleCompleteAndClose = useCallback(() => {
    if (userId && userId !== 'anon') {
      localStorage.setItem(`inspiratec_bienvenida_completada_${userId}`, 'true');
      localStorage.removeItem(`inspiratec_just_registered_${userId}`);
      sessionStorage.removeItem('inspiratec_just_registered');
      // Persistir en Firestore para que no vuelva a aparecer en ningún dispositivo
      updateUserPedagogicalProfile(userId, { bienvenidaCompletada: true }).catch(() => {});
    }
    setIsOpen(false);
  }, [userId]);

  // Navegar a una escena específica con scroll suave
  const scrollToScene = useCallback((index) => {
    if (!containerRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, SCENES.length - 1));
    const targetElement = containerRef.current.children[targetIndex];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentScene(targetIndex);
    }
  }, []);

  // Detectar el índice de la escena activa según la posición de scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight || window.innerHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== currentScene && newIndex >= 0 && newIndex < SCENES.length) {
      setCurrentScene(newIndex);
    }
  }, [currentScene]);

  // Teclas de dirección (flecha arriba / flecha abajo / escape)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToScene(currentScene + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToScene(currentScene - 1);
      } else if (e.key === 'Escape') {
        handleCompleteAndClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentScene, scrollToScene, handleCompleteAndClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="bienvenida-narrative-root" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Bienvenida explicativa INSPIRATEC"
    >
      {/* Barra superior fija y discreta */}
      <header className="bienvenida-top-header">
        <div className="bienvenida-top-brand">
          <Lightbulb size={18} color="#8ec3b7" />
          <span className="bienvenida-top-brand-title">INSPIRATEC</span>
          <span className="bienvenida-top-brand-sub">Guía de Bienvenida</span>
        </div>

        <button 
          type="button" 
          className="bienvenida-btn-close-top"
          onClick={handleCompleteAndClose}
          aria-label="Cerrar bienvenida e ir a Inicio"
          title="Cerrar e ir a Inicio"
        >
          <X size={18} />
        </button>
      </header>

      {/* Riel discreto de navegación lateral izquierda */}
      <nav className="bienvenida-rail-dots" aria-label="Progreso de escenas">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            type="button"
            className={`bienvenida-rail-dot ${idx === currentScene ? 'active' : ''}`}
            onClick={() => scrollToScene(idx)}
            aria-label={`Ir a escena ${idx + 1}: ${scene.title}`}
            title={`Escena ${idx + 1}: ${scene.title}`}
          />
        ))}
      </nav>

      {/* Contenedor central con scroll vertical suave */}
      <main 
        ref={containerRef} 
        className="bienvenida-scroll-container" 
        onScroll={handleScroll}
      >
        {SCENES.map((scene, index) => {
          const isLast = index === SCENES.length - 1;

          return (
            <section 
              key={scene.id} 
              id={`bienvenida-scene-${scene.id}`}
              className="bienvenida-scene-section"
              aria-label={`Escena ${index + 1}: ${scene.title}`}
            >
              {/* Imagen de fondo a pantalla completa (Única: Bien.png) */}
              <div 
                className="bienvenida-scene-bg" 
                style={{ backgroundImage: `url("${scene.image || BIEN_IMAGE}")` }}
                aria-hidden="true"
              />

              {/* Capa de contraste con degradado sutil */}
              <div className="bienvenida-scene-overlay" aria-hidden="true" />

              {/* Contenido editorial en tarjeta de cristal */}
              <div className="bienvenida-scene-content-wrapper">
                <article className="bienvenida-editorial-card">
                  {/* Encabezado con badge e índice */}
                  <div className="bienvenida-card-header">
                    <span className="bienvenida-badge">
                      {scene.icon}
                      <span>{scene.badge}</span>
                    </span>
                    <span className="bienvenida-scene-indicator-pill">
                      {String(index + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Título de la escena */}
                  <h2 className="bienvenida-card-title">
                    {scene.title}
                  </h2>

                  {/* Párrafo explicativo */}
                  <p className="bienvenida-card-description">
                    {scene.description}
                  </p>

                  {/* Qué puedes hacer aquí */}
                  <div className="bienvenida-action-box">
                    <CheckCircle2 size={18} className="bienvenida-action-box-icon" />
                    <p className="bienvenida-action-box-text">
                      <strong>Qué puedes hacer: </strong>
                      {scene.canDo}
                    </p>
                  </div>

                  {/* Acciones al pie de la tarjeta */}
                  <footer className="bienvenida-card-footer">
                    {isLast ? (
                      <button 
                        type="button" 
                        className="bienvenida-btn-final-primary"
                        onClick={handleCompleteAndClose}
                      >
                        <span>{scene.actionLabel}</span>
                        <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="bienvenida-btn-step"
                        onClick={() => scrollToScene(index + 1)}
                      >
                        <span>{scene.actionLabel}</span>
                        <ArrowRight size={16} />
                      </button>
                    )}

                    <span className="bienvenida-hint-scroll">
                      {scene.actionHint}
                    </span>
                  </footer>
                </article>
              </div>
            </section>
          );
        })}
      </main>

      {/* Cápsula de controles flotante en la esquina inferior derecha */}
      <aside className="bienvenida-floating-controls" aria-label="Controles de la presentación">
        {/* Flechas de navegación previa y siguiente */}
        <div className="bienvenida-nav-arrows">
          <button 
            type="button" 
            className="bienvenida-control-btn-icon"
            onClick={() => scrollToScene(currentScene - 1)}
            disabled={currentScene === 0}
            aria-label="Escena anterior"
            title="Escena anterior"
          >
            <ChevronUp size={18} />
          </button>

          <button 
            type="button" 
            className="bienvenida-control-btn-icon"
            onClick={() => scrollToScene(currentScene + 1)}
            disabled={currentScene === SCENES.length - 1}
            aria-label="Escena siguiente"
            title="Escena siguiente"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Indicador numérico de progreso */}
        <div className="bienvenida-controls-progress">
          <strong>{String(currentScene + 1).padStart(2, '0')}</strong>
          <span>/</span>
          <span>{String(SCENES.length).padStart(2, '0')}</span>
        </div>

        <div className="bienvenida-controls-divider" />

        {/* Botón «Explorar por mi cuenta» o «Ir a Inicio» */}
        {currentScene === SCENES.length - 1 ? (
          <button 
            type="button" 
            className="bienvenida-btn-finish-capsule"
            onClick={handleCompleteAndClose}
          >
            <span>Ir a Inicio</span>
            <CheckCircle2 size={15} />
          </button>
        ) : (
          <button 
            type="button" 
            className="bienvenida-btn-skip"
            onClick={handleCompleteAndClose}
            title="Cerrar la bienvenida y acceder al espacio de trabajo"
          >
            Explorar por mi cuenta
          </button>
        )}
      </aside>
    </div>
  );
}
