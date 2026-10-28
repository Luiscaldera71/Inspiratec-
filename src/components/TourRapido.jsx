import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { updateUserPedagogicalProfile } from '../services/authService';
import '../styles/tour.css';

/**
 * Tutorial rápido (reemplaza la bienvenida de 11 escenas).
 * Resalta 5 elementos reales de la interfaz con un texto corto cada uno.
 * - Aparece una sola vez, al registrarse (igual que antes).
 * - Se puede volver a abrir con el evento global 'open-bienvenida' (Ayuda y menú de usuario).
 */
const STEPS = [
  {
    id: 'bienvenida',
    title: '¡Bienvenido/a a InspiraTEC!',
    text: 'Te mostramos lo esencial en menos de un minuto. Puedes omitirlo cuando quieras.'
  },
  {
    id: 'crear',
    desk: '#nav-planificador',
    mob: '.m-tab-fab',
    title: 'Crea tu plan de clase',
    text: 'Elige tema, grado y metodología, y la IA arma una propuesta que luego puedes editar.'
  },
  {
    id: 'planes',
    desk: '#nav-mis-planes',
    mob: '.m-tabbar a[href="/mis-planes"]',
    title: 'Tus planes, siempre a mano',
    text: 'Guárdalos, edítalos y descárgalos en Word o PDF.'
  },
  {
    id: 'adn',
    desk: '#nav-adn-pedagogico',
    mob: '.m-tabbar button.m-tab',
    title: 'Tu ADN pedagógico',
    text: 'La plataforma aprende tu estilo para que cada clase suene a ti.',
    mobText: 'En «Más» encuentras tu ADN pedagógico, la biblioteca, el foro y la ayuda.'
  },
  {
    id: 'comunidad',
    desk: '#nav-mas-recursos',
    title: 'Comunidad docente',
    text: 'Biblioteca, experiencias y foro para aprender de otros colegas.'
  },
  {
    id: 'ia',
    desk: '#nav-config',
    mob: '.m-ai-chip',
    title: 'Activa la inteligencia artificial',
    text: 'Agrega tu clave gratuita de Gemini en Configuración IA y estarás listo/a.',
    last: true
  }
];

const esMovil = () => typeof window !== 'undefined' && window.innerWidth < 768;
const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

function medir(selector) {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  el.scrollIntoView({ block: 'center', inline: 'nearest' });
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
}

export default function TourRapido() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userProfile } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // Solo se muestra una vez, justo después de registrarse
  useEffect(() => {
    if (!userId || userId === 'anon') return undefined;
    const done = localStorage.getItem(`inspiratec_bienvenida_completada_${userId}`);
    if (done === 'true' || userProfile?.bienvenidaCompletada === true) return undefined;
    const recien =
      sessionStorage.getItem('inspiratec_just_registered') === userId ||
      localStorage.getItem(`inspiratec_just_registered_${userId}`) === 'true';
    if (location.pathname === '/home' && recien) {
      const t = setTimeout(() => abrir(), 900);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userProfile?.bienvenidaCompletada, location.pathname]);

  // Reapertura manual (Ayuda / menú de usuario)
  useEffect(() => {
    const manual = () => {
      if (location.pathname !== '/home') navigate('/home');
      setTimeout(() => abrir(), 500);
    };
    window.addEventListener('open-bienvenida', manual);
    return () => window.removeEventListener('open-bienvenida', manual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  function abrir() {
    const movil = esMovil();
    // Solo se muestran los pasos cuyo elemento existe en esta pantalla
    const disponibles = STEPS.filter((s) => !s.desk && !s.mob ? true : Boolean(medir(movil ? s.mob : s.desk)));
    setSteps(disponibles);
    setIndex(0);
    setIsOpen(true);
  }

  const cerrar = useCallback(() => {
    if (userId && userId !== 'anon') {
      localStorage.setItem(`inspiratec_bienvenida_completada_${userId}`, 'true');
      localStorage.removeItem(`inspiratec_just_registered_${userId}`);
      sessionStorage.removeItem('inspiratec_just_registered');
      updateUserPedagogicalProfile(userId, { bienvenidaCompletada: true }).catch(() => {});
    }
    setIsOpen(false);
  }, [userId]);

  const paso = steps[index];
  const total = steps.length;

  // Mide el elemento resaltado (y vuelve a medir al cambiar el tamaño de la ventana)
  useEffect(() => {
    if (!isOpen || !paso) return undefined;
    const calcular = () => {
      const selector = esMovil() ? paso.mob : paso.desk;
      setRect(medir(selector));
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    calcular();
    const t = setTimeout(calcular, 350); // tras el desplazamiento suave del menú
    window.addEventListener('resize', calcular);
    return () => { clearTimeout(t); window.removeEventListener('resize', calcular); };
  }, [isOpen, paso]);

  const siguiente = useCallback(() => {
    if (index >= total - 1) cerrar();
    else setIndex((i) => i + 1);
  }, [index, total, cerrar]);

  const anterior = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') cerrar();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') siguiente();
      else if (e.key === 'ArrowLeft') anterior();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, cerrar, siguiente, anterior]);

  if (!isOpen || !paso) return null;

  const centrado = !rect;
  const cardW = Math.min(340, viewport.w - 24 || 340);
  let cardStyle = {};
  if (!centrado) {
    const hueco = 16;
    if (rect.right + hueco + cardW < viewport.w - 12 && rect.left < viewport.w / 2 && !esMovil()) {
      // A la derecha (menú lateral)
      cardStyle = { left: rect.right + hueco + 8, top: clamp(rect.top + rect.height / 2, 130, viewport.h - 130), transform: 'translateY(-50%)', width: cardW };
    } else if (rect.top > viewport.h / 2) {
      // Encima (barra inferior en móvil)
      cardStyle = { left: clamp(rect.left + rect.width / 2 - cardW / 2, 12, viewport.w - cardW - 12), bottom: viewport.h - rect.top + hueco + 6, width: cardW };
    } else {
      // Debajo (barra superior)
      cardStyle = { left: clamp(rect.left + rect.width / 2 - cardW / 2, 12, viewport.w - cardW - 12), top: rect.bottom + hueco + 6, width: cardW };
    }
  }

  const texto = esMovil() && paso.mobText ? paso.mobText : paso.text;
  const esUltimo = index === total - 1;

  return (
    <div className="mini-tour-layer" role="dialog" aria-modal="true" aria-label="Tutorial rápido de InspiraTEC">
      <div className={`mini-tour-dim ${centrado ? 'solid' : ''}`} onClick={(e) => e.stopPropagation()} />

      {!centrado && (
        <div
          className="mini-tour-spot"
          style={{ top: rect.top - 7, left: rect.left - 7, width: rect.width + 14, height: rect.height + 14 }}
          aria-hidden="true"
        />
      )}

      <div key={paso.id} className={`mini-tour-card ${centrado ? 'center' : ''}`} style={centrado ? { width: cardW } : cardStyle}>
        <button type="button" className="mini-tour-x" onClick={cerrar} aria-label="Omitir tutorial" title="Omitir">
          <X size={16} />
        </button>

        {centrado && (
          <div className="mini-tour-hero">
            <img className="mini-tour-logo" src="/images/logo-inspiratec.png" alt="InspiraTEC" draggable={false} />
          </div>
        )}

        <h3>{paso.title}</h3>
        <p>{texto}</p>

        <div className="mini-tour-foot">
          <div className="mini-tour-dots" aria-label={`Paso ${index + 1} de ${total}`}>
            {steps.map((s, i) => <i key={s.id} className={i === index ? 'on' : i < index ? 'done' : ''} />)}
          </div>

          <div className="mini-tour-actions">
            {index === 0 ? (
              <button type="button" className="mini-tour-skip" onClick={cerrar}>Omitir</button>
            ) : (
              <button type="button" className="mini-tour-back" onClick={anterior} aria-label="Anterior">
                <ArrowLeft size={16} />
              </button>
            )}
            <button type="button" className="mini-tour-next" onClick={siguiente} autoFocus>
              {index === 0 ? 'Empezar' : esUltimo ? '¡Listo!' : 'Siguiente'}
              {!esUltimo && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
