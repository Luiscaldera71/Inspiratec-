import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dna, 
  Sparkles, 
  Award, 
  Layers, 
  Star, 
  Check, 
  RotateCw, 
  Save, 
  Lightbulb, 
  BookOpen, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  FolderCheck,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Shield,
  Building,
  UserCheck,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react';
import { auth } from '../firebase';
import { useAppStore } from '../store/useAppStore';
import { 
  getPedagogicalDna, 
  savePedagogicalDna, 
  autoSyncDnaFromHistory, 
  addRecursoProbado,
  removeRecursoProbado,
  DEFAULT_PEDAGOGICAL_DNA 
} from '../services/pedagogicalDnaService';
import PageLoadingState from '../components/PageLoadingState';

const AVAILABLE_DINAMICAS = [
  'Dinámicas desconectadas (Unplugged) sin pantallas',
  'Pregunta socrática provocadora del entorno',
  'Rutina de pensamiento: Veo - Pienso - Me pregunto',
  'Reto lúdico rompehielos (Icebreaker)',
  'Lluvia de ideas guiada con mapas mentales',
  'Analogía del mundo real o caso cotidiano',
  'Demostración experimental interactiva'
];

const AVAILABLE_EVALUACIONES = [
  'Evaluación formativa cualitativa con rúbrica analítica',
  'Coevaluación reflexiva entre pares',
  'Retroalimentación inmediata sin penalización',
  'Autoevaluación metacognitiva con escala de logro',
  'Portafolio digital de evidencias de aprendizaje',
  'Desafío o trivia gamificada de cierre'
];

const AVAILABLE_DUA = [
  'Múltiples formas de representación visual e interactiva',
  'Opciones para sostener el esfuerzo y la persistencia',
  'Flexibilidad en las formas de acción y expresión',
  'Andamiaje gradual y pistas adaptativas',
  'Material concreto y recursos multisensoriales'
];

const AVAILABLE_EJES = [
  'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)',
  'Educación Ambiental y Sostenibilidad (PRAE)',
  'Convivencia, Paz y Habilidades Ciudadanas',
  'Alfabetización Digital & Ciudadanía Crítica',
  'Emprendimiento, Innovación y Pensamiento Creativo',
  'Salud, Bienestar y Educación Socioemocional'
];

const AREAS_SECUNDARIAS = [
  'Matemáticas',
  'Tecnología e Informática',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Lengua Castellana',
  'Inglés',
  'Educación Artística',
  'Ética y Valores Humanos'
];

export default function AdnPedagogicoPage() {
  const navigate = useNavigate();
  const { userId, userProfile } = useAppStore();
  
  // Detección robusta de privilegios de Administrador para Daniel y perfiles Admin
  const isAdmin = Boolean(
    userProfile?.rol === 'Admin' || 
    userProfile?.role === 'admin' || 
    (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com') ||
    (userProfile?.email && userProfile.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com')
  );

  const [dna, setDna] = useState(DEFAULT_PEDAGOGICAL_DNA);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('memoria'); // 'memoria' | 'herramientas' | 'transversalidad' | 'probados'
  
  // Modo de guardado institucional para administradores
  const [isInstitutionalScope, setIsInstitutionalScope] = useState(false);

  // Formulario rápido para nuevo recurso probado
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState('rubrica');
  const [newResourceEngagement, setNewResourceEngagement] = useState(5);
  const [newResourceNote, setNewResourceNote] = useState('');

  // Estados locales para escribir y agregar opciones personalizadas
  const [customDinamicaInput, setCustomDinamicaInput] = useState('');
  const [customEvaluacionInput, setCustomEvaluacionInput] = useState('');
  const [customDuaInput, setCustomDuaInput] = useState('');
  const [customEjeInput, setCustomEjeInput] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Sincronizar y cargar automáticamente con el historial real de planes del usuario o institución
        const syncedData = await autoSyncDnaFromHistory(userId, null, isAdmin);
        setDna(syncedData);
      } catch (e) {
        console.error("Error al cargar y sincronizar ADN:", e);
        try {
          const data = await getPedagogicalDna(userId, isAdmin);
          setDna(data);
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, isAdmin]);

  const handleSyncWithPlanes = async () => {
    setIsSyncing(true);
    try {
      const updated = await autoSyncDnaFromHistory(userId, dna, isAdmin);
      setDna(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error("Error al sincronizar historial:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleAplicarDefecto = async (checked) => {
    const updated = { ...dna, aplicarAdnPorDefecto: checked };
    setDna(updated);
    try {
      await savePedagogicalDna(userId, updated, isAdmin && isInstitutionalScope);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.warn("Error auto-guardando preferencia de ADN por defecto:", e);
    }
  };

  const handleSave = async () => {
    try {
      await savePedagogicalDna(userId, dna, isAdmin && isInstitutionalScope);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error("Error guardando ADN:", e);
    }
  };

  const toggleArrayItem = (category, field, item) => {
    setDna(prev => {
      const currentArr = prev[category]?.[field] || [];
      const exists = currentArr.includes(item);
      const nextArr = exists ? currentArr.filter(i => i !== item) : [...currentArr, item];
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: nextArr
        }
      };
    });
  };

  // Añadir una opción personalizada escrita por el docente/administrador
  const handleAddCustomOption = (category, field, customField, value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return;

    setDna(prev => {
      const catObj = prev[category] || {};
      const currentSelected = catObj[field] || [];
      const currentCustom = catObj[customField] || [];

      const nextCustom = currentCustom.includes(trimmed) ? currentCustom : [...currentCustom, trimmed];
      const nextSelected = currentSelected.includes(trimmed) ? currentSelected : [...currentSelected, trimmed];

      return {
        ...prev,
        [category]: {
          ...catObj,
          [customField]: nextCustom,
          [field]: nextSelected
        }
      };
    });
  };

  // Eliminar una opción personalizada creada por el usuario
  const handleDeleteCustomOption = (category, field, customField, itemToRemove, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDna(prev => {
      const catObj = prev[category] || {};
      const currentSelected = catObj[field] || [];
      const currentCustom = catObj[customField] || [];

      return {
        ...prev,
        [category]: {
          ...catObj,
          [customField]: currentCustom.filter(i => i !== itemToRemove),
          [field]: currentSelected.filter(i => i !== itemToRemove)
        }
      };
    });
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newResourceTitle.trim()) return;

    try {
      const updated = await addRecursoProbado(userId, {
        title: newResourceTitle.trim(),
        type: newResourceType,
        engagement: Number(newResourceEngagement),
        notaDocente: newResourceNote.trim() || 'Recurso evaluado como altamente participativo en aula.',
        efectividad: newResourceEngagement >= 4 ? 'Alta efectividad' : 'En validación'
      });
      setDna(updated);
      setNewResourceTitle('');
      setNewResourceNote('');
      setShowAddResource(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error al añadir recurso probado:", err);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const updated = await removeRecursoProbado(userId, resourceId);
      setDna(updated);
    } catch (err) {
      console.error("Error al eliminar recurso probado:", err);
    }
  };

  if (loading) {
    return (
      <div className="adn-container" style={{ padding: '16px clamp(16px, 2.5vw, 24px) 36px' }}>
        <PageLoadingState 
          icon={Dna}
          badge="Identidad Curricular"
          title="Cargando tu ADN Pedagógico..."
          subtitle="Recuperando memoria contextual, estilos de aprendizaje y configuraciones docentes."
          fullPage
        />
      </div>
    );
  }

  const { memoriaExito, cajaHerramientas, matrizTransversalidad, recursosProbados } = dna;

  return (
    <div className="adn-container">
      
      {/* 1. Header con Identidad Pedagógica y Soporte Administrador / Docente */}
      <header className="adn-hero-card">
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <div className="adn-badge-pill">
                <Dna size={13} style={{ color: '#4ADE80' }} />
                <span>Identidad Docente & Memoria Contextual</span>
              </div>

              {/* Badge de Rol: Docente o Administrador */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isAdmin ? 'rgba(234, 179, 8, 0.22)' : 'rgba(74, 222, 128, 0.18)',
                color: isAdmin ? '#FEF08A' : '#BBF7D0',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                border: isAdmin ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(74, 222, 128, 0.35)'
              }}>
                {isAdmin ? <Shield size={12} /> : <UserCheck size={12} />}
                <span>{isAdmin ? 'Modo Administrador Curricular' : 'Modo Docente Titular'}</span>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 800, margin: '0 0 6px', color: '#FFFDF9', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              Mi ADN Pedagógico & Estudio Transversal
            </h1>
            <p style={{ fontSize: '13px', color: '#D1E7DD', margin: 0, lineHeight: 1.55, maxWidth: '680px' }}>
              Tu huella profesional de enseñanza. Inspiratec registra automáticamente las metodologías más exitosas en tus clases, 
              tus recursos didácticos predilectos y conecta ejes transversales en cada nuevo plan generado con IA.
            </p>
          </div>

          {/* Acciones principales: Sincronizar y Guardar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleSyncWithPlanes}
                disabled={isSyncing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFFDF9',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: '14px',
                  padding: '11px 18px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                title={isAdmin ? "Sincroniza con los planes de la institución para enriquecer la memoria curricular" : "Analiza tus planes guardados y experiencias para actualizar tus metodologías y recursos predilectos"}
              >
                <RotateCw size={15} className={isSyncing ? 'spin' : ''} />
                <span>{isSyncing ? 'Sincronizando...' : (isAdmin ? 'Sincronizar Historial' : 'Actualizar con mis planes')}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#4ADE80',
                  color: '#142A26',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '11px 22px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(74, 222, 128, 0.42)',
                  transition: 'all 0.18s ease'
                }}
              >
                {saveSuccess ? <Check size={16} /> : <Save size={16} />}
                <span>{saveSuccess ? '¡Guardado en la Nube!' : 'Guardar ADN'}</span>
              </button>
            </div>

            {/* Selector de alcance para Administradores */}
            {isAdmin && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(0,0,0,0.22)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.14)' }}>
                <input
                  type="checkbox"
                  checked={isInstitutionalScope}
                  onChange={(e) => setIsInstitutionalScope(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#FACC15', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: '#FEF08A', fontWeight: 600 }}>
                  Establecer como Estándar Curricular Institucional
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Interruptor de activación en el planificador */}
        <div style={{
          marginTop: '26px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} style={{ color: '#FACC15' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>
              Aplicar mi ADN Pedagógico por defecto al diseñar nuevos planes en el Planificador
            </span>
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
            <input
              type="checkbox"
              checked={dna.aplicarAdnPorDefecto}
              onChange={(e) => handleToggleAplicarDefecto(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#4ADE80', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', color: '#D1E7DD', fontWeight: 600 }}>
              {dna.aplicarAdnPorDefecto ? 'Activado automáticamente' : 'Desactivado (manual)'}
            </span>
          </label>
        </div>
      </header>

      {/* 2. Pestañas de Navegación del ADN */}
      <nav className="adn-tabs-nav" aria-label="Secciones de ADN Pedagógico">
        {[
          { id: 'memoria', label: '1. Memoria de Éxito Automática', icon: TrendingUp },
          { id: 'herramientas', label: '2. Caja de Herramientas Favorita', icon: Sliders },
          { id: 'transversalidad', label: '3. Matriz de Transversalidad', icon: Layers },
          { id: 'probados', label: '4. Recursos Probados en Aula', icon: FolderCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`adn-tab-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Contenido de las Pestañas */}
      
      {/* PESTAÑA 1: MEMORIA DE ÉXITO */}
      {activeTab === 'memoria' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Métricas destacadas en Grid */}
          <div className="adn-metric-grid">
            <div className="adn-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>
                <span>Planes Analizados</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(26, 77, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={16} color="#1A4D43" />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#142A26', lineHeight: 1.1 }}>
                {memoriaExito.totalPlanesAnalizados || 0}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                {memoriaExito.totalPlanesAnalizados === 1 ? '1 secuencia didáctica en tu historial' : `${memoriaExito.totalPlanesAnalizados || 0} secuencias didácticas en tu historial`}
              </div>
            </div>

            <div className="adn-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>
                <span>Índice de Innovación</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={16} color="#059669" />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>
                {memoriaExito.totalPlanesAnalizados > 0 ? `${memoriaExito.indiceInnovacion}%` : '0%'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                {memoriaExito.totalPlanesAnalizados > 0 ? 'Diversificación metodológica y DUA' : 'Se calculará al analizar tus secuencias'}
              </div>
            </div>

            <div className="adn-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>
                <span>Metodología Principal</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={16} color="#2563EB" />
                </div>
              </div>
              <div 
                title={memoriaExito.metodologiasFrecuentes?.[0]?.name || (memoriaExito.totalPlanesAnalizados > 0 ? 'Aprendizaje Activo' : 'Sin secuencias aún')}
                style={{ 
                  fontSize: '14.5px', 
                  fontWeight: 700, 
                  color: '#142A26', 
                  lineHeight: 1.35, 
                  minHeight: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  wordBreak: 'break-word'
                }}
              >
                {memoriaExito.metodologiasFrecuentes?.[0]?.name || (memoriaExito.totalPlanesAnalizados > 0 ? 'Aprendizaje Activo' : 'Sin secuencias aún')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                {memoriaExito.metodologiasFrecuentes?.[0]?.count 
                  ? `${memoriaExito.metodologiasFrecuentes[0].count} ${memoriaExito.metodologiasFrecuentes[0].count === 1 ? 'sesión planificada' : 'sesiones planificadas'}`
                  : 'Crea tu primer plan en el Planificador'}
              </div>
            </div>

            <div className="adn-metric-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>
                <span>Recurso Didáctico Favorito</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={16} color="#D97706" />
                </div>
              </div>
              <div 
                title={memoriaExito.recursosPredilectos?.[0]?.name || (memoriaExito.totalPlanesAnalizados > 0 ? 'Material de clase' : 'Sin recursos aún')}
                style={{ 
                  fontSize: '14.5px', 
                  fontWeight: 700, 
                  color: '#142A26', 
                  lineHeight: 1.35, 
                  minHeight: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  wordBreak: 'break-word'
                }}
              >
                {memoriaExito.recursosPredilectos?.[0]?.name || (memoriaExito.totalPlanesAnalizados > 0 ? 'Material de clase' : 'Sin recursos aún')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                {memoriaExito.recursosPredilectos?.[0]?.count 
                  ? `${memoriaExito.recursosPredilectos[0].count} veces generado/anexado`
                  : 'Anexa rúbricas o juegos en el Editor'}
              </div>
            </div>
          </div>

          {/* Gráficos de Frecuencia y Recursos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            
            {/* Metodologías más frecuentes */}
            <div className="adn-card-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Compass size={20} color="#1A4D43" />
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                  Metodologías que más te funcionan
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
                Detectadas automáticamente a partir de tus planes guardados y valoraciones docentes:
              </p>
              
              {Array.isArray(memoriaExito.metodologiasFrecuentes) && memoriaExito.metodologiasFrecuentes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {memoriaExito.metodologiasFrecuentes.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>
                        <span>{item.name}</span>
                        <span style={{ color: '#1A4D43', fontWeight: 700 }}>
                          {item.count} {item.count === 1 ? 'plan' : 'planes'} ({item.porcentaje || 50}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${item.porcentaje || 50}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #1A4D43 0%, #34D399 100%)',
                          borderRadius: '999px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '28px 18px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1.5px dashed #CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Compass size={32} style={{ color: '#94A3B8' }} />
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    Aún no hay secuencias didácticas analizadas
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '340px', margin: 0, lineHeight: 1.5 }}>
                    Al crear secuencias en el Planificador, Inspiratec identificará tus metodologías STEAM más exitosas.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/planificador')}
                    style={{
                      marginTop: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#1A4D43',
                      color: '#FFFDF9',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Crear secuencia en el Planificador</span>
                  </button>
                </div>
              )}
            </div>

            {/* Recursos didácticos predilectos */}
            <div className="adn-card-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Star size={20} color="#D97706" />
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                  Recursos Didácticos más generados y anexados
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
                Materiales que la IA priorizará sugerir y estructurar en tus nuevas clases:
              </p>
              
              {Array.isArray(memoriaExito.recursosPredilectos) && memoriaExito.recursosPredilectos.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {memoriaExito.recursosPredilectos.map((rec, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#F8FAFC',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.15s ease'
                    }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>
                        {rec.name}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#059669',
                        background: '#ECFDF5',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        border: '1px solid #A7F3D0'
                      }}>
                        {rec.count} {rec.count === 1 ? 'vez usado' : 'veces usado'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '28px 18px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1.5px dashed #CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Star size={32} style={{ color: '#94A3B8' }} />
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    Sin recursos didácticos predilectos aún
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '340px', margin: 0, lineHeight: 1.5 }}>
                    Al generar rúbricas, cuestionarios o juegos didácticos anexos a tus clases, la IA registrará tus formatos favoritos.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* PESTAÑA 2: CAJA DE HERRAMIENTAS FAVORITA */}
      {activeTab === 'herramientas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Dinámicas de Inicio */}
          <div className="adn-card-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sparkles size={20} color="#1A4D43" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                Dinámicas de Inicio Predilectas (Fase de Exploración)
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
              Marca con estrella las actividades con las que prefieres capturar la atención de tu grupo al abrir la clase o escribe tus propias dinámicas:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_DINAMICAS.map((din, idx) => {
                const isSelected = cajaHerramientas.dinamicasInicio?.includes(din);
                return (
                  <button
                    key={`din-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('cajaHerramientas', 'dinamicasInicio', din)}
                    className={`adn-chip-button ${isSelected ? 'active-emerald' : 'inactive'}`}
                  >
                    <Star size={14} style={{ fill: isSelected ? '#FACC15' : 'none', stroke: isSelected ? '#FACC15' : 'currentColor' }} />
                    <span>{din}</span>
                  </button>
                );
              })}

              {/* Dinámicas personalizadas escritas por el docente */}
              {Array.from(new Set([
                ...(cajaHerramientas.dinamicasPersonalizadas || []),
                ...(cajaHerramientas.dinamicasInicio || []).filter(d => !AVAILABLE_DINAMICAS.includes(d))
              ])).map((din, idx) => {
                const isSelected = cajaHerramientas.dinamicasInicio?.includes(din);
                return (
                  <button
                    key={`custom-din-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('cajaHerramientas', 'dinamicasInicio', din)}
                    className={`adn-chip-button ${isSelected ? 'active-emerald' : 'inactive'}`}
                    title="Dinámica personalizada creada por ti"
                  >
                    <Star size={14} style={{ fill: isSelected ? '#FACC15' : 'none', stroke: isSelected ? '#FACC15' : 'currentColor' }} />
                    <span>{din}</span>
                    <span
                      role="button"
                      className="adn-chip-delete-btn"
                      onClick={(e) => handleDeleteCustomOption('cajaHerramientas', 'dinamicasInicio', 'dinamicasPersonalizadas', din, e)}
                      title="Eliminar esta opción personalizada"
                    >
                      <X size={13} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Input para agregar dinámica personalizada */}
            <div className="adn-custom-input-row">
              <input
                type="text"
                className="adn-custom-input"
                value={customDinamicaInput}
                onChange={(e) => setCustomDinamicaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomOption('cajaHerramientas', 'dinamicasInicio', 'dinamicasPersonalizadas', customDinamicaInput);
                    setCustomDinamicaInput('');
                  }
                }}
                placeholder="Otra dinámica"
              />
              <button
                type="button"
                className="adn-custom-add-btn"
                onClick={() => {
                  handleAddCustomOption('cajaHerramientas', 'dinamicasInicio', 'dinamicasPersonalizadas', customDinamicaInput);
                  setCustomDinamicaInput('');
                }}
                disabled={!customDinamicaInput.trim()}
              >
                <Plus size={14} /> Añadir dinámica
              </button>
            </div>
          </div>

          {/* Instrumentos de Evaluación */}
          <div className="adn-card-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="#059669" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                Estilos y Formas de Evaluación Favoritas
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
              ¿Cómo valoras el aprendizaje formativo de tus estudiantes? (La IA adaptará la sección de evaluación según tus elecciones):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_EVALUACIONES.map((eva, idx) => {
                const isSelected = cajaHerramientas.estilosEvaluacion?.includes(eva);
                return (
                  <button
                    key={`eva-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('cajaHerramientas', 'estilosEvaluacion', eva)}
                    className={`adn-chip-button ${isSelected ? 'active-green' : 'inactive'}`}
                  >
                    {isSelected ? <CheckCircle2 size={15} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor' }} />}
                    <span>{eva}</span>
                  </button>
                );
              })}

              {/* Evaluaciones personalizadas escritas por el docente */}
              {Array.from(new Set([
                ...(cajaHerramientas.estilosEvaluacionPersonalizados || []),
                ...(cajaHerramientas.estilosEvaluacion || []).filter(e => !AVAILABLE_EVALUACIONES.includes(e))
              ])).map((eva, idx) => {
                const isSelected = cajaHerramientas.estilosEvaluacion?.includes(eva);
                return (
                  <button
                    key={`custom-eva-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('cajaHerramientas', 'estilosEvaluacion', eva)}
                    className={`adn-chip-button ${isSelected ? 'active-green' : 'inactive'}`}
                    title="Estilo de evaluación personalizado creado por ti"
                  >
                    {isSelected ? <CheckCircle2 size={15} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor' }} />}
                    <span>{eva}</span>
                    <span
                      role="button"
                      className="adn-chip-delete-btn"
                      onClick={(e) => handleDeleteCustomOption('cajaHerramientas', 'estilosEvaluacion', 'estilosEvaluacionPersonalizados', eva, e)}
                      title="Eliminar esta opción personalizada"
                    >
                      <X size={13} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Input para agregar evaluación personalizada */}
            <div className="adn-custom-input-row">
              <input
                type="text"
                className="adn-custom-input"
                value={customEvaluacionInput}
                onChange={(e) => setCustomEvaluacionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomOption('cajaHerramientas', 'estilosEvaluacion', 'estilosEvaluacionPersonalizados', customEvaluacionInput);
                    setCustomEvaluacionInput('');
                  }
                }}
                placeholder="Otro estilo de evaluación"
              />
              <button
                type="button"
                className="adn-custom-add-btn"
                onClick={() => {
                  handleAddCustomOption('cajaHerramientas', 'estilosEvaluacion', 'estilosEvaluacionPersonalizados', customEvaluacionInput);
                  setCustomEvaluacionInput('');
                }}
                disabled={!customEvaluacionInput.trim()}
              >
                <Plus size={14} /> Añadir evaluación
              </button>
            </div>
          </div>

          {/* Enfoques DUA */}
          <div className="adn-card-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Lightbulb size={20} color="#D97706" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                Principios DUA Predilectos (Inclusión Efectiva)
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
              Prioridades para la accesibilidad, múltiples medios de expresión y diversificación de tus secuencias didácticas:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_DUA.map((dua, idx) => {
                const isSelected = cajaHerramientas.enfoquesDuaFavoritos?.includes(dua);
                return (
                  <button
                    key={`dua-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('cajaHerramientas', 'enfoquesDuaFavoritos', dua)}
                    className={`adn-chip-button ${isSelected ? 'active-amber' : 'inactive'}`}
                  >
                    {isSelected ? <CheckCircle2 size={15} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor' }} />}
                    <span>{dua}</span>
                  </button>
                );
              })}

              {/* Enfoques DUA personalizados */}
              {Array.from(new Set([
                ...(cajaHerramientas.enfoquesDuaPersonalizados || []),
                ...(cajaHerramientas.enfoquesDuaFavoritos || []).filter(d => !AVAILABLE_DUA.includes(d))
              ])).map((dua, idx) => {
                const isSelected = cajaHerramientas.enfoquesDuaFavoritos?.includes(dua);
                return (
                  <button
                    key={`custom-dua-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('cajaHerramientas', 'enfoquesDuaFavoritos', dua)}
                    className={`adn-chip-button ${isSelected ? 'active-amber' : 'inactive'}`}
                    title="Apoyo DUA personalizado creado por ti"
                  >
                    {isSelected ? <CheckCircle2 size={15} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor' }} />}
                    <span>{dua}</span>
                    <span
                      role="button"
                      className="adn-chip-delete-btn"
                      onClick={(e) => handleDeleteCustomOption('cajaHerramientas', 'enfoquesDuaFavoritos', 'enfoquesDuaPersonalizados', dua, e)}
                      title="Eliminar esta opción personalizada"
                    >
                      <X size={13} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Input para agregar principio DUA personalizado */}
            <div className="adn-custom-input-row">
              <input
                type="text"
                className="adn-custom-input"
                value={customDuaInput}
                onChange={(e) => setCustomDuaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomOption('cajaHerramientas', 'enfoquesDuaFavoritos', 'enfoquesDuaPersonalizados', customDuaInput);
                    setCustomDuaInput('');
                  }
                }}
                placeholder="Otro apoyo DUA"
              />
              <button
                type="button"
                className="adn-custom-add-btn"
                onClick={() => {
                  handleAddCustomOption('cajaHerramientas', 'enfoquesDuaFavoritos', 'enfoquesDuaPersonalizados', customDuaInput);
                  setCustomDuaInput('');
                }}
                disabled={!customDuaInput.trim()}
              >
                <Plus size={14} /> Añadir apoyo DUA
              </button>
            </div>
          </div>

          {/* Notas Pedagógicas Clave */}
          <div className="adn-card-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <BookOpen size={20} color="#1A4D43" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                Tu Filosofía y Receta Pedagógica Personal
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 14px', lineHeight: 1.5 }}>
              Escribe anotaciones libres sobre lo que mejor te funciona con tus grupos. Gemini las tomará como directiva central de redacción:
            </p>
            <textarea
              rows={4}
              value={cajaHerramientas.notasClave || ''}
              onChange={(e) => setDna(prev => ({
                ...prev,
                cajaHerramientas: { ...prev.cajaHerramientas, notasClave: e.target.value }
              }))}
              placeholder="Cuéntanos cómo enseñas"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#FFFFFF',
                color: '#1E293B'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1A4D43'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            />
          </div>

        </div>
      )}

      {/* PESTAÑA 3: MATRIZ DE TRANSVERSALIDAD */}
      {activeTab === 'transversalidad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Ejes Institucionales */}
          <div className="adn-card-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Layers size={20} color="#1A4D43" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                Ejes Transversales Institucionales Prioritarios
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 18px', lineHeight: 1.5 }}>
              Selecciona los ejes curriculares que tu colegio promueve en los proyectos transversales (PRAE, STEAM, Convivencia) o añade los proyectos específicos de tu institución:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_EJES.map((eje, idx) => {
                const isSelected = matrizTransversalidad.ejesInstitucionales?.includes(eje);
                return (
                  <button
                    key={`eje-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('matrizTransversalidad', 'ejesInstitucionales', eje)}
                    className={`adn-chip-button ${isSelected ? 'active-emerald' : 'inactive'}`}
                  >
                    {isSelected ? <CheckCircle2 size={15} /> : null}
                    <span>{eje}</span>
                  </button>
                );
              })}

              {/* Ejes personalizados añadidos por la institución o docente */}
              {Array.from(new Set([
                ...(matrizTransversalidad.ejesPersonalizados || []),
                ...(matrizTransversalidad.ejesInstitucionales || []).filter(e => !AVAILABLE_EJES.includes(e))
              ])).map((eje, idx) => {
                const isSelected = matrizTransversalidad.ejesInstitucionales?.includes(eje);
                return (
                  <button
                    key={`custom-eje-${idx}`}
                    type="button"
                    onClick={() => toggleArrayItem('matrizTransversalidad', 'ejesInstitucionales', eje)}
                    className={`adn-chip-button ${isSelected ? 'active-emerald' : 'inactive'}`}
                    title="Eje o proyecto institucional personalizado"
                  >
                    {isSelected ? <CheckCircle2 size={15} /> : null}
                    <span>{eje}</span>
                    <span
                      role="button"
                      className="adn-chip-delete-btn"
                      onClick={(e) => handleDeleteCustomOption('matrizTransversalidad', 'ejesInstitucionales', 'ejesPersonalizados', eje, e)}
                      title="Eliminar este eje personalizado"
                    >
                      <X size={13} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Input para agregar eje transversal personalizado */}
            <div className="adn-custom-input-row">
              <input
                type="text"
                className="adn-custom-input"
                value={customEjeInput}
                onChange={(e) => setCustomEjeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomOption('matrizTransversalidad', 'ejesInstitucionales', 'ejesPersonalizados', customEjeInput);
                    setCustomEjeInput('');
                  }
                }}
                placeholder="Otro proyecto"
              />
              <button
                type="button"
                className="adn-custom-add-btn"
                onClick={() => {
                  handleAddCustomOption('matrizTransversalidad', 'ejesInstitucionales', 'ejesPersonalizados', customEjeInput);
                  setCustomEjeInput('');
                }}
                disabled={!customEjeInput.trim()}
              >
                <Plus size={14} /> Añadir proyecto transversal
              </button>
            </div>
          </div>

          {/* Configuración de Articulación Inter-área */}
          <div className="adn-card-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Compass size={20} color="#2563EB" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#142A26' }}>
                Articulación Interdisciplinar Habitual
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                  Área secundaria con la que más sueles conectar:
                </label>
                <select
                  value={matrizTransversalidad.areaSecundariaPredilecta || 'Matemáticas'}
                  onChange={(e) => setDna(prev => ({
                    ...prev,
                    matrizTransversalidad: { ...prev.matrizTransversalidad, areaSecundariaPredilecta: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    color: '#1E293B',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  {AREAS_SECUNDARIAS.map((area, idx) => (
                    <option key={idx} value={area}>{area}</option>
                  ))}
                </select>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                  Aparecerá preseleccionada en el formulario de nuevos planes transversales.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                  Reto o Pregunta Problémica del Entorno Habitual:
                </label>
                <input
                  type="text"
                  value={matrizTransversalidad.retoEntornoHabitual || ''}
                  onChange={(e) => setDna(prev => ({
                    ...prev,
                    matrizTransversalidad: { ...prev.matrizTransversalidad, retoEntornoHabitual: e.target.value }
                  }))}
                  placeholder="Ej.: Sostenibilidad ambiental"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    color: '#1E293B'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                  Sirve como hilo conductor para conectar los aprendizajes de ambas disciplinas.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PESTAÑA 4: BANCO DE RECURSOS PROBADOS */}
      {activeTab === 'probados' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div className="adn-card-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 4px', color: '#142A26' }}>
                  Banco de Recursos Probados y Efectivos en Aula
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  Materiales didácticos generados que han demostrado alto engagement y efectividad formativa con tus estudiantes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddResource(!showAddResource)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: '#1A4D43',
                  color: '#FFFDF9',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(26, 77, 67, 0.25)'
                }}
              >
                <Plus size={15} />
                <span>{showAddResource ? 'Cerrar formulario' : 'Añadir Recurso Probado'}</span>
              </button>
            </div>

            {/* Formulario para añadir recurso probado */}
            {showAddResource && (
              <form onSubmit={handleCreateResource} style={{ background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#142A26' }}>
                  Registrar un recurso didáctico exitoso en el aula
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Nombre del recurso didáctico:
                    </label>
                    <input
                      type="text"
                      required
                      value={newResourceTitle}
                      onChange={(e) => setNewResourceTitle(e.target.value)}
                      placeholder="Nombre del material"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Tipo de material:
                    </label>
                    <select
                      value={newResourceType}
                      onChange={(e) => setNewResourceType(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px', backgroundColor: '#FFF' }}
                    >
                      <option value="rubrica">Rúbrica Socioformativa</option>
                      <option value="juegos">Trivia / Juego Gamificado</option>
                      <option value="presentacion">Presentación Interactiva</option>
                      <option value="sopa">Sopa de Letras</option>
                      <option value="preguntas">Banco de Preguntas</option>
                      <option value="flashcards">Flashcards</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Nivel de engagement (1 a 5 estrellas):
                    </label>
                    <select
                      value={newResourceEngagement}
                      onChange={(e) => setNewResourceEngagement(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px', backgroundColor: '#FFF' }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 estrellas (Impacto sobresaliente)</option>
                      <option value={4}>⭐⭐⭐⭐ 4 estrellas (Muy participativo)</option>
                      <option value={3}>⭐⭐⭐ 3 estrellas (Buen desempeño)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nota u observación docente de aula:
                  </label>
                  <input
                    type="text"
                    value={newResourceNote}
                    onChange={(e) => setNewResourceNote(e.target.value)}
                    placeholder="Comentario"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddResource(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '13px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: '#1A4D43', color: '#FFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Guardar Recurso en Banco
                  </button>
                </div>
              </form>
            )}

            {/* Listado de recursos probados en cards */}
            {(!recursosProbados || recursosProbados.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                <FolderCheck size={44} style={{ opacity: 0.35, margin: '0 auto 12px auto', display: 'block' }} />
                <p style={{ fontSize: '14.5px', margin: 0, fontWeight: 500 }}>
                  Aún no tienes recursos registrados en tu banco probado. Puedes añadir uno nuevo arriba o valorar materiales al sistematizar tus experiencias.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {recursosProbados.map((rec) => (
                  <div key={rec.id} style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#142A26', margin: 0 }}>
                          {rec.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(rec.id)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                          title="Eliminar de recursos probados"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '10px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            style={{ 
                              fill: i < (rec.engagement || 5) ? '#FACC15' : 'none', 
                              stroke: i < (rec.engagement || 5) ? '#FACC15' : '#CBD5E1' 
                            }} 
                          />
                        ))}
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669', marginLeft: '6px', background: '#ECFDF5', padding: '2px 8px', borderRadius: '12px' }}>
                          {rec.efectividad || 'Alta efectividad'}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                        "{rec.notaDocente || 'Efectivo en aula'}"
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Tipo: {rec.type}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#1A4D43', fontWeight: 700 }}>
                        Probado en aula ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
