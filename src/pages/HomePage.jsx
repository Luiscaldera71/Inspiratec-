import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getGenericTemplateForArea } from '../services/templates/genericTemplates';
import { getMisPlanes, getLocalSavedPlans } from '../services/dbService';
import { auth } from '../firebase';
import {
  Sparkles,
  Plus,
  ArrowRight,
  ArrowUp,
  BookOpen,
  FileText,
  Calculator,
  FlaskConical,
  Cpu,
  Globe,
  Languages,
  Compass,
  Dna,
  Library,
  MessageSquare,
  Layers,
  FilePlus2,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Users,
  CalendarDays
} from 'lucide-react';

// Meta visual del anillo de progreso (planes de clase creados)
const META_PLANES = 10;

const AREAS_CURRICULARES = [
  { id: 'matematicas', nombre: 'Matemáticas', icon: Calculator, tone: 'blue' },
  { id: 'ciencias_naturales', nombre: 'Ciencias Naturales', icon: FlaskConical, tone: 'green' },
  { id: 'lengua_castellana', nombre: 'Lengua Castellana', icon: BookOpen, tone: 'pink' },
  { id: 'tecnologia_informatica', nombre: 'Tecnología e Informática', icon: Cpu, tone: 'teal' },
  { id: 'ciencias_sociales', nombre: 'Ciencias Sociales', icon: Globe, tone: 'violet' },
  { id: 'ingles', nombre: 'Inglés', icon: Languages, tone: 'orange' }
];

const normalizar = (s = '') =>
  String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const areaDeMateria = (materia) => {
  const m = normalizar(materia);
  if (!m) return undefined;
  return AREAS_CURRICULARES.find((a) => {
    const n = normalizar(a.nombre);
    return m === n || m.includes(n) || n.includes(m);
  });
};

const fechaDePlan = (plan) => {
  const c = plan?.createdAt;
  let d = null;
  if (c?.toDate) d = c.toDate();
  else if (c?.seconds) d = new Date(c.seconds * 1000);
  else if (typeof c === 'string' || typeof c === 'number') d = new Date(c);
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Cuenta animada de 0 al valor (respeta prefers-reduced-motion)
function useCountUp(target, ms = 900) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    const reducido = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducido) { setValor(target); return undefined; }
    const inicio = performance.now();
    let raf;
    const paso = (t) => {
      const p = Math.min(1, (t - inicio) / ms);
      setValor(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return valor;
}

export default function HomePage() {
  const navigate = useNavigate();
  const {
    userId,
    userProfile,
    apiKey,
    planesCount,
    updateWizardData,
    clearWizardFormOnly
  } = useAppStore();

  // Pintado inmediato con los planes locales; luego se fusiona con lo que responda la nube
  const [planes, setPlanes] = useState(() =>
    getLocalSavedPlans()
      .filter((p) => p && p.id && (p.userId || 'anon') === (userId || auth.currentUser?.uid || 'anon'))
      .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
  );
  const [cargando, setCargando] = useState(true);
  const [solicitud, setSolicitud] = useState('');

  const primerNombre = userProfile?.nombre ? userProfile.nombre.split(' ')[0] : 'docente';
  const iaLista = Boolean(apiKey && apiKey.length > 10);

  useEffect(() => {
    let activo = true;
    const uid = userId || auth.currentUser?.uid || 'anon';
    getMisPlanes(uid)
      .then((lista) => { if (activo) setPlanes(Array.isArray(lista) ? lista : []); })
      .catch((e) => console.error(e))
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [userId]);

  const totalPlanes = cargando ? Math.max(planesCount || 0, planes.length) : planes.length;
  const recientes = planes.slice(0, 3);

  const resumen = useMemo(() => {
    const sistematizados = planes.filter((p) => p.estado === 'Sistematizado').length;
    const enBiblioteca = planes.filter((p) => p.estado === 'Biblioteca').length;
    const areas = new Set(planes.map((p) => areaDeMateria(p.materia)?.id || normalizar(p.materia)).filter(Boolean));
    return { sistematizados, enBiblioteca, areas: areas.size };
  }, [planes]);

  const planesPorArea = useMemo(() => {
    const mapa = {};
    planes.forEach((p) => {
      const a = areaDeMateria(p.materia);
      if (a) mapa[a.id] = (mapa[a.id] || 0) + 1;
    });
    return mapa;
  }, [planes]);

  const porcentaje = Math.min(100, Math.round((totalPlanes / META_PLANES) * 100));
  const cPlanes = useCountUp(totalPlanes);
  const cSistem = useCountUp(resumen.sistematizados);
  const cBiblio = useCountUp(resumen.enBiblioteca);
  const cAreas = useCountUp(resumen.areas);
  const cPorc = useCountUp(porcentaje);
  const RADIO = 52;
  const CIRCUNF = 2 * Math.PI * RADIO;

  const prepararPlan = (areaNombre, extra = {}) => {
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
      recursos: '',
      ...extra
    });
    navigate('/');
  };

  const handleCrearPlanPorArea = (areaNombre) => prepararPlan(areaNombre);

  const handleCrearPlanTransversal = () =>
    prepararPlan('Tecnología e Informática', {
      esTransversal: true,
      areaSecundaria: 'Matemáticas',
      ejeTransversal: 'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)'
    });

  const handleIniciarLibre = () => {
    clearWizardFormOnly();
    navigate('/');
  };

  const handleAbrirPlan = (plan) => {
    useAppStore.getState().loadPlan(plan, plan.markdown, plan.id);
    navigate(`/editor?id=${plan.id}`);
  };

  const handleEnviarSolicitud = (e) => {
    e.preventDefault();
    const texto = solicitud.trim();
    clearWizardFormOnly();
    if (texto) {
      updateWizardData({
        tema: texto,
        docente: userProfile?.nombre || '',
        institucion: userProfile?.institucion || ''
      });
    }
    navigate('/');
  };

  const accesosRapidos = [
    { id: 'plan', label: 'Plan de clase', icon: FilePlus2, tone: 'blue', onClick: handleIniciarLibre },
    { id: 'steam', label: 'Proyecto transversal STEAM', icon: Lightbulb, tone: 'green', onClick: handleCrearPlanTransversal },
    { id: 'adn', label: 'Mi ADN pedagógico', icon: Dna, tone: 'violet', onClick: () => navigate('/adn-pedagogico') },
    { id: 'plantillas', label: 'Plantillas curriculares', icon: Layers, tone: 'orange', onClick: () => navigate('/plantillas') },
    { id: 'biblioteca', label: 'Biblioteca comunitaria', icon: Library, tone: 'pink', onClick: () => navigate('/biblioteca') },
    { id: 'experiencias', label: 'Experiencias significativas', icon: Compass, tone: 'indigo', onClick: () => navigate('/experiencias') }
  ];

  const accionesAsistente = [
    { id: 'a1', label: 'Crear una clase desde cero', icon: FilePlus2, onClick: handleIniciarLibre },
    { id: 'a2', label: 'Generar un proyecto transversal STEAM', icon: Lightbulb, onClick: handleCrearPlanTransversal },
    { id: 'a3', label: 'Revisar mi ADN pedagógico', icon: Dna, onClick: () => navigate('/adn-pedagogico') },
    { id: 'a4', label: 'Explorar plantillas curriculares', icon: Layers, onClick: () => navigate('/plantillas') },
    { id: 'a5', label: 'Buscar experiencias de colegas', icon: Compass, onClick: () => navigate('/experiencias') }
  ];

  return (
    <div className="home-page">
      <div className="home-layout">
        {/* ===================== COLUMNA PRINCIPAL ===================== */}
        <div className="home-main-col">
          {/* HERO */}
          <section
            className="home-hero"
            aria-labelledby="home-hero-title"
          >
            {/* Escenario animado: la imagen del banner se divide en capas (cuerpo, cabeza, brazo, tableta) */}
            <div className="home-hero-stage" aria-hidden="true">
              <img className="stage-base" src="/images/banner-inicio.jpg" alt="" draggable={false} />
              <div className="rig-float">
                <i className="rig-layer rig-body" />
                <i className="rig-layer rig-tablet" />
                <i className="rig-layer rig-arm" />
                <i className="rig-layer rig-head" />
              </div>
            </div>
            <div className="home-hero-copy">
              <span className="home-hero-hello">
                Hola, {primerNombre} <span aria-hidden="true">👋</span>
              </span>
              <h1 id="home-hero-title" className="home-hero-title">
                Hoy es un gran día
                <br />
                para <em>inspirar</em>
              </h1>
              <p className="home-hero-text">
                Diseña, personaliza y desarrolla planes de clase para cualquier área
                con el poder de la inteligencia artificial.
              </p>
              <div className="home-hero-actions">
                <button type="button" className="aurora-btn aurora-btn-primary" onClick={handleIniciarLibre}>
                  <Plus size={18} /> Crear plan de clase
                </button>
                <button type="button" className="aurora-btn aurora-btn-ghost" onClick={() => navigate('/plantillas')}>
                  Ver plantillas
                </button>
              </div>
              {!iaLista && (
                <button type="button" className="home-hero-warning" onClick={() => navigate('/config')}>
                  <AlertTriangle size={14} />
                  Para activar la IA registra tu clave en Configuración
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </section>

          {/* ACCESOS RÁPIDOS */}
          <section className="glass-panel" aria-labelledby="home-quick-title">
            <div className="glass-panel-head">
              <h2 id="home-quick-title">Accesos rápidos</h2>
            </div>
            <div className="home-quick-grid">
              {accesosRapidos.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.id} type="button" className={`home-quick-tile tone-${a.tone}`} onClick={a.onClick}>
                    <span className="tone-icon"><Icon size={22} /></span>
                    <span className="home-quick-label">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* PLANES RECIENTES */}
          <section className="glass-panel" aria-labelledby="home-recent-title">
            <div className="glass-panel-head">
              <h2 id="home-recent-title">Mis planes recientes</h2>
              <button type="button" className="glass-link" onClick={() => navigate('/mis-planes')}>
                Ver todos <ArrowRight size={14} />
              </button>
            </div>

            {recientes.length > 0 ? (
              <div className="home-recent-grid">
                {recientes.map((plan) => {
                  const area = areaDeMateria(plan.materia);
                  const Icon = area?.icon || FileText;
                  const tone = area?.tone || 'indigo';
                  const fecha = fechaDePlan(plan);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      className={`home-recent-card tone-${tone}`}
                      onClick={() => handleAbrirPlan(plan)}
                      title="Abrir plan en el editor"
                    >
                      <span className="home-recent-cover">
                        <Icon className="home-recent-bigicon" size={96} strokeWidth={1.2} aria-hidden="true" />
                        {plan.grado && <span className="home-recent-grade">Grado {String(plan.grado).replace(/\s*(mo|vo|to|no|°)$/i, '')}</span>}
                        <span className="home-recent-title">{plan.tema || 'Plan de clase sin título'}</span>
                        <span className="home-recent-chips">
                          {plan.materia && <span>{plan.materia}</span>}
                          {plan.estado && <span>{plan.estado}</span>}
                        </span>
                      </span>
                      <span className="home-recent-foot">
                        <span><CalendarDays size={14} /> {fecha || 'Sin fecha'}</span>
                        <span>Abrir <ArrowRight size={14} /></span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="home-empty">
                <span className="tone-icon tone-blue"><FilePlus2 size={26} /></span>
                <div>
                  <strong>{cargando ? 'Cargando tus planes…' : 'Aún no tienes planes guardados'}</strong>
                  {!cargando && <p>Crea tu primer plan de clase con IA y aparecerá aquí.</p>}
                </div>
                {!cargando && (
                  <button type="button" className="aurora-btn aurora-btn-primary" onClick={handleIniciarLibre}>
                    <Plus size={16} /> Crear mi primer plan
                  </button>
                )}
              </div>
            )}
          </section>

          {/* EXPLORAR POR ÁREA */}
          <section className="glass-panel" aria-labelledby="home-areas-title">
            <div className="glass-panel-head">
              <h2 id="home-areas-title">Explorar por área</h2>
            </div>
            <div className="home-areas-grid">
              {AREAS_CURRICULARES.map((area) => {
                const Icon = area.icon;
                const n = planesPorArea[area.id] || 0;
                return (
                  <button
                    key={area.id}
                    type="button"
                    className={`home-area-tile tone-${area.tone}`}
                    onClick={() => handleCrearPlanPorArea(area.nombre)}
                    title={`Crear plan en ${area.nombre}`}
                  >
                    <span className="tone-icon"><Icon size={22} /></span>
                    <span className="home-area-name">{area.nombre}</span>
                    <span className="home-area-sub">{n > 0 ? `${n} ${n === 1 ? 'plan' : 'planes'}` : 'Crear plan'}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ===================== COLUMNA LATERAL ===================== */}
        <aside className="home-side-col" aria-label="Asistente, progreso y comunidad">
          {/* ASISTENTE */}
          <section className="glass-panel home-assistant">
            <div className="home-assistant-head">
              <span className="home-assistant-avatar"><Sparkles size={20} /></span>
              <strong>Asistente InspiraTEC</strong>
              <span className={`home-assistant-status ${iaLista ? 'on' : 'off'}`}>
                <i /> {iaLista ? 'En línea' : 'Sin configurar'}
              </span>
            </div>
            <p className="home-assistant-bubble">Soy tu asistente pedagógico. ¿Qué te gustaría hacer hoy?</p>
            <ul className="home-assistant-actions">
              {accionesAsistente.map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.id}>
                    <button type="button" onClick={a.onClick}>
                      <Icon size={15} /> <span>{a.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <form className="home-assistant-input" onSubmit={handleEnviarSolicitud}>
              <input
                type="text"
                value={solicitud}
                onChange={(e) => setSolicitud(e.target.value)}
                placeholder="Escribe el tema de tu próxima clase…"
                aria-label="Tema de la próxima clase"
              />
              <button type="submit" aria-label="Empezar plan con este tema" title="Empezar plan con este tema">
                <ArrowUp size={18} />
              </button>
            </form>
          </section>

          {/* PROGRESO */}
          <section className="glass-panel" aria-labelledby="home-progress-title">
            <div className="glass-panel-head">
              <h2 id="home-progress-title">Mi progreso</h2>
            </div>
            <div className="home-progress">
              <div className="home-ring" role="img" aria-label={`${totalPlanes} de ${META_PLANES} planes creados`}>
                <svg viewBox="0 0 124 124">
                  <defs>
                    <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#4F9BFF" />
                      <stop offset="1" stopColor="#7C5CFF" />
                    </linearGradient>
                  </defs>
                  <circle cx="62" cy="62" r={RADIO} className="home-ring-track" />
                  <circle
                    cx="62"
                    cy="62"
                    r={RADIO}
                    className="home-ring-value"
                    strokeDasharray={CIRCUNF}
                    strokeDashoffset={CIRCUNF * (1 - porcentaje / 100)}
                  />
                </svg>
                <div className="home-ring-label">
                  <strong>{cPorc}%</strong>
                  <span>Meta de {META_PLANES} planes</span>
                </div>
              </div>

              <ul className="home-stats">
                <li><span className="tone-icon tone-blue"><FileText size={16} /></span><b>{cPlanes}</b><span>Planes de clase</span></li>
                <li><span className="tone-icon tone-green"><CheckCircle2 size={16} /></span><b>{cSistem}</b><span>Sistematizados</span></li>
                <li><span className="tone-icon tone-orange"><Library size={16} /></span><b>{cBiblio}</b><span>En la biblioteca</span></li>
                <li><span className="tone-icon tone-violet"><Users size={16} /></span><b>{cAreas}</b><span>Áreas trabajadas</span></li>
              </ul>
            </div>
          </section>

          {/* COMUNIDAD */}
          <section className="glass-panel" aria-labelledby="home-community-title">
            <div className="glass-panel-head">
              <h2 id="home-community-title">Comunidad y recursos</h2>
            </div>
            <ul className="home-resources">
              <li>
                <button type="button" onClick={() => navigate('/biblioteca')}>
                  <span className="tone-icon tone-pink"><Library size={18} /></span>
                  <span><b>Biblioteca comunitaria</b><small>Planes compartidos por docentes</small></span>
                  <ArrowRight size={16} />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/experiencias')}>
                  <span className="tone-icon tone-indigo"><Compass size={18} /></span>
                  <span><b>Experiencias sistematizadas</b><small>Aprende de otras aulas</small></span>
                  <ArrowRight size={16} />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/foro')}>
                  <span className="tone-icon tone-green"><MessageSquare size={18} /></span>
                  <span><b>Foro docente</b><small>Pregunta y comparte ideas</small></span>
                  <ArrowRight size={16} />
                </button>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
