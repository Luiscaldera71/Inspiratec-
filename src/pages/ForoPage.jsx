import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  getForoMessages, 
  addForoMessage, 
  addForoReply, 
  deleteForoMessage 
} from '../services/dbService';
import { auth } from '../firebase';
import { 
  MessagesSquare, 
  MessageSquare,
  PlusCircle, 
  Search, 
  X, 
  Filter, 
  Clock, 
  User, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  Pin, 
  Share2, 
  Trash2, 
  Send, 
  CornerDownRight, 
  Loader2, 
  Sparkles, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  PanelLeftClose, 
  PanelLeftOpen, 
  PanelRightClose, 
  PanelRightOpen, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Award,
  BookMarked,
  FolderOpen,
  MessageSquarePlus
} from 'lucide-react';
import PageLoadingState from '../components/PageLoadingState';

// Categorías temáticas pedagógicas oficiales de INSPIRATEC
export const FORO_CATEGORIAS = [
  { id: 'Innovación pedagógica', label: 'Innovación pedagógica', icon: Sparkles, color: '#315B54' },
  { id: 'Inteligencia artificial en educación', label: 'Inteligencia artificial en educación', icon: Sparkles, color: '#D4AF37' },
  { id: 'Estrategias didácticas', label: 'Estrategias didácticas', icon: Layers, color: '#2B524A' },
  { id: 'Evaluación del aprendizaje', label: 'Evaluación del aprendizaje', icon: Award, color: '#477A72' },
  { id: 'Inclusión y DUA', label: 'Inclusión y DUA', icon: ShieldCheck, color: '#10B981' },
  { id: 'Recursos educativos', label: 'Recursos educativos', icon: BookOpen, color: '#2563EB' },
  { id: 'Tecnología educativa', label: 'Tecnología educativa', icon: Layers, color: '#0D9488' },
  { id: 'Experiencias de aula', label: 'Experiencias de aula', icon: GraduationCap, color: '#7C3AED' },
  { id: 'Preguntas y ayuda entre docentes', label: 'Preguntas y ayuda entre docentes', icon: HelpCircle, color: '#EA580C' }
];

// Ayudante para obtener iniciales
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'D';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Ayudante para formatear fechas de manera legible
function formatRelativeDate(dateVal) {
  if (!dateVal) return 'Fecha no disponible';
  let dateObj = null;
  if (dateVal.toDate) dateObj = dateVal.toDate();
  else if (typeof dateVal === 'string' || typeof dateVal === 'number') dateObj = new Date(dateVal);
  
  if (!dateObj || isNaN(dateObj.getTime())) return 'Reciente';

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return dateObj.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ForoPage() {
  const { userId, userProfile } = useAppStore();
  const currentUserId = userId || auth.currentUser?.uid || 'anon';
  const currentUserName = userProfile?.nombre || auth.currentUser?.displayName || 'Docente';
  const currentUserRole = userProfile?.rol || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().includes('danieltapias') ? 'Admin' : 'Docente');
  const isAdmin = currentUserRole === 'Admin';

  // Lista y carga
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Vistas y filtros
  const [activeView, setActiveView] = useState('list'); // 'list' | 'detail'
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('recientes'); // 'recientes' | 'activas' | 'comentadas' | 'sin_respuesta'
  const [currentPage, setCurrentPage] = useState(1);
  const DISCUSSIONS_PER_PAGE = 7;

  // Persistencia de guardadas / favoritas en localStorage
  const [savedIds, setSavedIds] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem('inspiratec_foro_saved_ids');
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    }
    return [];
  });

  const toggleSaveDiscussion = (id) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_foro_saved_ids', JSON.stringify(next));
      }
      return next;
    });
    setFeedback(savedIds.includes(id) ? 'Conversación retirada de tus guardadas' : 'Conversación guardada en tus favoritas');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Paneles retráctiles
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return false;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('inspiratec_foro_cat_open');
      if (saved !== null) return saved !== 'false';
    }
    return true;
  });

  const [isContextOpen, setIsContextOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return false;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('inspiratec_foro_ctx_open');
      if (saved !== null) return saved !== 'false';
    }
    return true;
  });

  const toggleCategoriesPanel = () => {
    setIsCategoriesOpen(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_foro_cat_open', String(next));
      }
      return next;
    });
  };

  const toggleContextPanel = () => {
    setIsContextOpen(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_foro_ctx_open', String(next));
      }
      return next;
    });
  };

  // Modal para Nueva Discusión
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newDiscussionData, setNewDiscussionData] = useState({
    titulo: '',
    categoria: 'Innovación pedagógica',
    texto: '',
    etiquetas: '',
    destacado: false
  });

  // Editor de Respuesta en Vista Detallada
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Cargar borrador de respuesta al abrir una discusión específica
  useEffect(() => {
    if (selectedDiscussionId && typeof window !== 'undefined' && window.localStorage) {
      const draft = localStorage.getItem(`inspiratec_foro_draft_${selectedDiscussionId}`);
      setReplyText(draft || '');
    } else {
      setReplyText('');
    }
  }, [selectedDiscussionId]);

  // Guardar borrador en tiempo real mientras el usuario escribe
  const handleReplyChange = (e) => {
    const val = e.target.value;
    setReplyText(val);
    if (selectedDiscussionId && typeof window !== 'undefined' && window.localStorage) {
      if (val.trim()) {
        localStorage.setItem(`inspiratec_foro_draft_${selectedDiscussionId}`, val);
      } else {
        localStorage.removeItem(`inspiratec_foro_draft_${selectedDiscussionId}`);
      }
    }
  };

  // Cargar discusiones del backend
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const msgs = await getForoMessages();
      setMensajes(msgs || []);
    } catch (err) {
      console.error("Error al cargar mensajes del foro:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Discusión activa seleccionada
  const activeDiscussion = useMemo(() => {
    if (!selectedDiscussionId) return null;
    return mensajes.find(m => m.id === selectedDiscussionId) || null;
  }, [mensajes, selectedDiscussionId]);

  // Creación de nueva discusión
  const handleCreateDiscussion = async (e) => {
    e?.preventDefault();
    if (!newDiscussionData.titulo.trim() || !newDiscussionData.texto.trim()) {
      alert("Por favor ingresa tanto el título como el contenido pedagógico de la discusión.");
      return;
    }

    setIsPosting(true);
    try {
      const tagsArray = newDiscussionData.etiquetas
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        titulo: newDiscussionData.titulo.trim(),
        texto: newDiscussionData.texto.trim(),
        categoria: newDiscussionData.categoria || 'Innovación pedagógica',
        etiquetas: tagsArray,
        destacado: isAdmin && newDiscussionData.destacado
      };

      const newId = await addForoMessage(
        currentUserId,
        currentUserName,
        currentUserRole,
        payload
      );

      setNewDiscussionData({
        titulo: '',
        categoria: 'Innovación pedagógica',
        texto: '',
        etiquetas: '',
        destacado: false
      });
      setIsNewModalOpen(false);
      setFeedback('¡Discusión pedagógica publicada con éxito!');
      setTimeout(() => setFeedback(null), 3500);

      await fetchMessages();
      if (newId) {
        setSelectedDiscussionId(newId);
        setActiveView('detail');
      }
    } catch (err) {
      console.error("Error al crear discusión:", err);
      alert("Hubo un error al guardar tu discusión. Por favor intenta nuevamente.");
    } finally {
      setIsPosting(false);
    }
  };

  // Envío de respuesta
  const handleSendReply = async (e) => {
    e?.preventDefault();
    if (!selectedDiscussionId || !replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      await addForoReply(
        selectedDiscussionId,
        currentUserId,
        currentUserName,
        currentUserRole,
        replyText.trim()
      );

      // Limpiar borrador
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`inspiratec_foro_draft_${selectedDiscussionId}`);
      }
      setReplyText('');
      setFeedback('¡Tu aporte pedagógico fue publicado!');
      setTimeout(() => setFeedback(null), 3000);

      await fetchMessages();
    } catch (err) {
      console.error("Error al enviar respuesta:", err);
      alert("No se pudo enviar la respuesta. Por favor intenta de nuevo.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Eliminación de discusión
  const handleDeleteDiscussion = async (msgId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta discusión y todas sus respuestas? Esta acción no se puede deshacer.")) {
      return;
    }
    try {
      await deleteForoMessage(msgId);
      if (selectedDiscussionId === msgId) {
        setActiveView('list');
        setSelectedDiscussionId(null);
      }
      setFeedback('Conversación eliminada del foro');
      setTimeout(() => setFeedback(null), 3000);
      await fetchMessages();
    } catch (err) {
      console.error("Error al eliminar discusión:", err);
      alert("No se pudo eliminar la discusión.");
    }
  };

  // Copiar cita / enlace
  const handleCopyDiscussionLink = (msg) => {
    const textToCopy = `«${msg.titulo}» — Aporte de ${msg.nombre} en el Foro Docente de INSPIRATEC:\n${msg.texto}`;
    navigator.clipboard?.writeText(textToCopy);
    setFeedback('¡Cita de la discusión copiada al portapapeles!');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Filtrado y ordenamiento en tiempo real
  const filteredDiscussions = useMemo(() => {
    let list = [...mensajes];

    // 1. Filtro por Categoría / Vista
    if (activeCategoryFilter === 'mis_publicaciones') {
      list = list.filter(m => m.userId === currentUserId);
    } else if (activeCategoryFilter === 'mis_participaciones') {
      list = list.filter(m => Array.isArray(m.respuestas) && m.respuestas.some(r => r.userId === currentUserId));
    } else if (activeCategoryFilter === 'sin_responder') {
      list = list.filter(m => !m.respuestas || m.respuestas.length === 0);
    } else if (activeCategoryFilter === 'guardadas') {
      list = list.filter(m => savedIds.includes(m.id));
    } else if (activeCategoryFilter !== 'todas') {
      list = list.filter(m => m.categoria === activeCategoryFilter);
    }

    // 2. Filtro por Búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m => {
        const titleMatch = m.titulo?.toLowerCase().includes(q);
        const textMatch = m.texto?.toLowerCase().includes(q);
        const authorMatch = m.nombre?.toLowerCase().includes(q);
        const tagsMatch = Array.isArray(m.etiquetas) && m.etiquetas.some(t => t.toLowerCase().includes(q));
        return titleMatch || textMatch || authorMatch || tagsMatch;
      });
    }

    // 3. Ordenamiento
    list.sort((a, b) => {
      // Primero publicaciones fijadas/destacadas
      if (a.destacado && !b.destacado) return -1;
      if (!a.destacado && b.destacado) return 1;

      const getCreatedTime = (m) => {
        if (!m) return 0;
        if (m.createdAt?.toDate) return m.createdAt.toDate().getTime();
        if (m.createdAt?.toMillis) return m.createdAt.toMillis();
        return new Date(m.createdAt || 0).getTime() || 0;
      };

      const getUpdatedTime = (m) => {
        if (!m) return 0;
        if (m.respuestas && m.respuestas.length > 0) {
          const lastR = m.respuestas[m.respuestas.length - 1];
          return new Date(lastR.date || 0).getTime() || getCreatedTime(m);
        }
        if (m.updatedAt?.toDate) return m.updatedAt.toDate().getTime();
        return getCreatedTime(m);
      };

      if (sortBy === 'activas') {
        return getUpdatedTime(b) - getUpdatedTime(a);
      }
      if (sortBy === 'comentadas') {
        const countA = a.respuestas ? a.respuestas.length : 0;
        const countB = b.respuestas ? b.respuestas.length : 0;
        return countB - countA;
      }
      if (sortBy === 'sin_respuesta') {
        const countA = a.respuestas ? a.respuestas.length : 0;
        const countB = b.respuestas ? b.respuestas.length : 0;
        return countA - countB;
      }
      // Por defecto 'recientes'
      return getCreatedTime(b) - getCreatedTime(a);
    });

    return list;
  }, [mensajes, activeCategoryFilter, searchQuery, sortBy, savedIds, currentUserId]);

  // Paginación
  const totalPages = Math.ceil(filteredDiscussions.length / DISCUSSIONS_PER_PAGE) || 1;
  const paginatedDiscussions = useMemo(() => {
    const start = (currentPage - 1) * DISCUSSIONS_PER_PAGE;
    return filteredDiscussions.slice(start, start + DISCUSSIONS_PER_PAGE);
  }, [filteredDiscussions, currentPage]);

  // Ajustar página al cambiar de filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryFilter, searchQuery, sortBy]);

  // Métricas reales para cabecera y panel de contexto
  const totalRespuestasRegistradas = useMemo(() => {
    return mensajes.reduce((acc, m) => acc + (m.respuestas ? m.respuestas.length : 0), 0);
  }, [mensajes]);

  const discusionesSinRespuesta = useMemo(() => {
    return mensajes.filter(m => !m.respuestas || m.respuestas.length === 0).slice(0, 3);
  }, [mensajes]);

  // Conteo por categoría
  const categoryCounts = useMemo(() => {
    const counts = {};
    mensajes.forEach(m => {
      const cat = m.categoria || 'Estrategias didácticas';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [mensajes]);

  return (
    <div className="foro-page-container">
      
      {/* Toast / Notificación accesible de confirmación */}
      {feedback && (
        <div className="foro-feedback-toast" role="status" aria-live="polite">
          <CheckCircle2 size={16} color="#059669" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ========================================================
          ZONA A: CABECERA DEL FORO DOCENTE
          ======================================================== */}
      <header className="foro-header-panel">
        <div className="foro-header-top-row">
          <div className="foro-header-titles">
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <MessagesSquare size={14} color="#2B524A" />
              <span>Comunidad Académica de Aprendizaje</span>
            </div>
            <h1 className="foro-main-title">
              Foro Docente
            </h1>
            <p className="foro-main-subtitle">
              Espacio de diálogo pedagógico, intercambio de experiencias y resolución colaborativa de retos curriculares.
            </p>
          </div>

          <div className="foro-header-actions">
            <button 
              type="button" 
              className="btn btn-primary foro-btn-new-discussion"
              onClick={() => setIsNewModalOpen(true)}
              aria-label="Iniciar una nueva discusión pedagógica"
            >
              <PlusCircle size={17} />
              <span>Nueva discusión</span>
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Métricas de la Cabecera */}
        <div className="foro-header-bottom-row">
          <div className="foro-search-input-wrapper">
            <Search size={16} className="foro-search-icon" />
            <input 
              type="text" 
              className="foro-search-input"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar conversaciones en el foro"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="foro-search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Métricas discretas basadas en datos reales */}
          <div className="foro-header-metrics">
            <div className="foro-metric-pill" title="Conversaciones activas en la plataforma">
              <MessageSquare size={13} style={{ color: 'var(--primary-sage)' }} />
              <span><strong>{mensajes.length}</strong> temas</span>
            </div>
            <div className="foro-metric-pill" title="Aportes e intervenciones docentes registradas">
              <CornerDownRight size={13} style={{ color: '#D4AF37' }} />
              <span><strong>{totalRespuestasRegistradas}</strong> respuestas</span>
            </div>
            <div className="foro-metric-pill" title="Temas guardados en tus favoritos">
              <Bookmark size={13} style={{ color: '#2563EB' }} />
              <span><strong>{savedIds.length}</strong> guardadas</span>
            </div>
          </div>
        </div>

        {/* Chips de filtro rápido por categoría (Ideal para celular y tablet con scroll horizontal) */}
        <div className="foro-category-chips-scroll" role="tablist" aria-label="Filtro rápido de categorías">
          <button
            type="button"
            className={`foro-category-chip-btn ${activeCategoryFilter === 'todas' ? 'active' : ''}`}
            onClick={() => { setActiveCategoryFilter('todas'); if (activeView === 'detail') setActiveView('list'); }}
          >
            Todas ({mensajes.length})
          </button>
          {FORO_CATEGORIAS.map(cat => {
            const count = categoryCounts[cat.id] || 0;
            const isActive = activeCategoryFilter === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                className={`foro-category-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => { setActiveCategoryFilter(cat.id); if (activeView === 'detail') setActiveView('list'); }}
              >
                <Icon size={13} style={{ color: isActive ? '#FFF' : cat.color }} />
                <span>{cat.label}</span>
                {count > 0 && <span className="foro-category-chip-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Botones de control para contraer/expandir paneles en escritorio */}
        <div className="foro-toggle-panels-bar">
          <button 
            type="button"
            className={`foro-panel-toggle-btn ${isCategoriesOpen ? 'active' : ''}`}
            onClick={toggleCategoriesPanel}
            title={isCategoriesOpen ? "Ocultar panel de categorías para ampliar lectura" : "Mostrar panel de categorías"}
            aria-label={isCategoriesOpen ? "Ocultar panel de categorías" : "Mostrar panel de categorías"}
          >
            {isCategoriesOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            <span>{isCategoriesOpen ? "Ocultar Categorías" : "Ver Categorías"}</span>
          </button>

          <button 
            type="button"
            className={`foro-panel-toggle-btn ${isContextOpen ? 'active' : ''}`}
            onClick={toggleContextPanel}
            title={isContextOpen ? "Ocultar panel lateral de contexto" : "Mostrar panel de contexto y normas"}
            aria-label={isContextOpen ? "Ocultar panel de contexto" : "Mostrar panel de contexto"}
          >
            {isContextOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            <span>{isContextOpen ? "Ocultar Contexto" : "Ver Normas y Guía"}</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          ESPACIO PRINCIPAL TRIPANEL (CATEGORÍAS + DISCUCIÓN + CONTEXTO)
          ======================================================== */}
      <div className={`foro-workspace ${!isCategoriesOpen ? 'categories-collapsed' : ''} ${!isContextOpen ? 'context-collapsed' : ''}`}>
        
        {/* ========================================================
            ZONA B: PANEL LATERAL DE NAVEGACIÓN Y CATEGORÍAS
            ======================================================== */}
        <aside 
          className={`foro-categories-sidebar ${isCategoriesOpen ? 'is-open' : 'is-collapsed'}`}
          aria-label="Navegación y filtros temáticos del foro"
        >
          <div className="foro-sidebar-card">
            
            {/* Vistas Principales de Navegación */}
            <div className="foro-nav-section">
              <span className="foro-nav-section-title">Vistas de Navegación</span>
              
              <button 
                type="button"
                className={`foro-nav-btn ${activeCategoryFilter === 'todas' ? 'active' : ''}`}
                onClick={() => { setActiveCategoryFilter('todas'); if (activeView === 'detail') setActiveView('list'); }}
              >
                <div className="foro-nav-btn-icon"><MessagesSquare size={16} /></div>
                <span className="foro-nav-btn-text">Todas las discusiones</span>
                <span className="foro-nav-badge">{mensajes.length}</span>
              </button>

              <button 
                type="button"
                className={`foro-nav-btn ${activeCategoryFilter === 'mis_publicaciones' ? 'active' : ''}`}
                onClick={() => { setActiveCategoryFilter('mis_publicaciones'); if (activeView === 'detail') setActiveView('list'); }}
              >
                <div className="foro-nav-btn-icon"><User size={16} /></div>
                <span className="foro-nav-btn-text">Mis publicaciones</span>
                <span className="foro-nav-badge">
                  {mensajes.filter(m => m.userId === currentUserId).length}
                </span>
              </button>

              <button 
                type="button"
                className={`foro-nav-btn ${activeCategoryFilter === 'mis_participaciones' ? 'active' : ''}`}
                onClick={() => { setActiveCategoryFilter('mis_participaciones'); if (activeView === 'detail') setActiveView('list'); }}
              >
                <div className="foro-nav-btn-icon"><CornerDownRight size={16} /></div>
                <span className="foro-nav-btn-text">Mis participaciones</span>
                <span className="foro-nav-badge">
                  {mensajes.filter(m => m.respuestas && m.respuestas.some(r => r.userId === currentUserId)).length}
                </span>
              </button>

              <button 
                type="button"
                className={`foro-nav-btn ${activeCategoryFilter === 'sin_responder' ? 'active' : ''}`}
                onClick={() => { setActiveCategoryFilter('sin_responder'); if (activeView === 'detail') setActiveView('list'); }}
              >
                <div className="foro-nav-btn-icon"><HelpCircle size={16} /></div>
                <span className="foro-nav-btn-text">Sin responder</span>
                <span className="foro-nav-badge">
                  {mensajes.filter(m => !m.respuestas || m.respuestas.length === 0).length}
                </span>
              </button>

              <button 
                type="button"
                className={`foro-nav-btn ${activeCategoryFilter === 'guardadas' ? 'active' : ''}`}
                onClick={() => { setActiveCategoryFilter('guardadas'); if (activeView === 'detail') setActiveView('list'); }}
              >
                <div className="foro-nav-btn-icon"><Bookmark size={16} /></div>
                <span className="foro-nav-btn-text">Guardadas o favoritas</span>
                <span className="foro-nav-badge">{savedIds.length}</span>
              </button>
            </div>

            {/* Separador */}
            <div className="foro-sidebar-divider" />

            {/* Categorías Temáticas Académicas */}
            <div className="foro-nav-section">
              <span className="foro-nav-section-title">Categorías Temáticas</span>

              {FORO_CATEGORIAS.map(cat => {
                const IconComponent = cat.icon;
                const count = categoryCounts[cat.id] || 0;
                const isActive = activeCategoryFilter === cat.id;

                return (
                  <button 
                    key={cat.id}
                    type="button"
                    className={`foro-nav-btn foro-category-btn ${isActive ? 'active' : ''}`}
                    onClick={() => { setActiveCategoryFilter(cat.id); if (activeView === 'detail') setActiveView('list'); }}
                    title={`Ver debates sobre ${cat.label}`}
                  >
                    <div className="foro-nav-btn-icon" style={{ color: isActive ? '#FFF' : cat.color }}>
                      <IconComponent size={15} />
                    </div>
                    <span className="foro-nav-btn-text">{cat.label}</span>
                    {count > 0 && <span className="foro-nav-badge">{count}</span>}
                  </button>
                );
              })}
            </div>

          </div>
        </aside>

        {/* ========================================================
            ZONA C: ÁREA CENTRAL DE DISICUSIONES (LISTADO O DETALLE)
            ======================================================== */}
        <main className="foro-main-area">

          {/* VISTA 1: LISTADO DE DISICUSIONES */}
          {activeView === 'list' && (
            <div className="foro-feed-container">
              
              {/* Barra de Filtros Activos y Ordenamiento */}
              <div className="foro-feed-controls-bar">
                <div className="foro-feed-status-info">
                  <div className="foro-feed-active-badge">
                    <FolderOpen size={18} className="foro-feed-folder-icon" />
                    <h2 className="foro-feed-active-filter-tag">
                      {activeCategoryFilter === 'todas' ? 'Todas las discusiones' :
                       activeCategoryFilter === 'mis_publicaciones' ? 'Mis publicaciones' :
                       activeCategoryFilter === 'mis_participaciones' ? 'Mis aportes' :
                       activeCategoryFilter === 'sin_responder' ? 'Sin responder' :
                       activeCategoryFilter === 'guardadas' ? 'Guardadas' : activeCategoryFilter}
                    </h2>
                  </div>
                  <span className="foro-feed-count-tag">
                    {filteredDiscussions.length} {filteredDiscussions.length === 1 ? 'discusión' : 'discusiones'}
                  </span>
                  {(searchQuery || activeCategoryFilter !== 'todas') && (
                    <button 
                      type="button" 
                      className="foro-clear-filter-link"
                      onClick={() => { setSearchQuery(''); setActiveCategoryFilter('todas'); }}
                      title="Restablecer filtros de búsqueda y categoría"
                    >
                      <X size={12} /> Limpiar filtros
                    </button>
                  )}
                </div>

                {/* Selector de Ordenamiento Funcional */}
                <div className="foro-sort-wrapper">
                  <SlidersHorizontal size={14} className="foro-sort-icon" />
                  <label htmlFor="foro-sort-select" className="sr-only">Ordenar discusiones</label>
                  <select 
                    id="foro-sort-select"
                    className="foro-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recientes">Más recientes</option>
                    <option value="activas">Más activas (con respuestas nuevas)</option>
                    <option value="comentadas">Más comentadas</option>
                    <option value="sin_respuesta">Pendientes de respuesta</option>
                  </select>
                </div>
              </div>

              {/* Contenido: Loader, Vacío o Lista de Tarjetas */}
              {loading ? (
                <PageLoadingState 
                  icon={MessageSquare}
                  badge="Comunidad Docente"
                  title="Cargando conversaciones pedagógicas..."
                  subtitle="Sincronizando los aportes, debates y reflexiones de la comunidad docente."
                  minHeight="320px"
                />
              ) : filteredDiscussions.length === 0 ? (
                <div className="foro-empty-state-card">
                  <div className="foro-empty-icon-circle">
                    <MessagesSquare size={32} />
                  </div>
                  <h3>No se encontraron conversaciones</h3>
                  <p>
                    {searchQuery 
                      ? `No hay discusiones que coincidan con la búsqueda "${searchQuery}". Puedes intentar con otros términos o limpiar el filtro.`
                      : activeCategoryFilter !== 'todas'
                      ? `Aún no hay discusiones en la categoría "${activeCategoryFilter}". Sé el primer docente en iniciar el diálogo.`
                      : 'La comunidad aún no tiene publicaciones activas. Inicia la primera discusión compartiendo una experiencia de aula.'}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {searchQuery && (
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setSearchQuery('')}
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => setIsNewModalOpen(true)}
                    >
                      <PlusCircle size={15} /> Iniciar discusión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="foro-discussions-list">
                  {paginatedDiscussions.map((msg) => {
                    const isMsgAuthor = msg.userId === currentUserId;
                    const isMsgAdmin = msg.rol === 'Admin';
                    const hasReplies = msg.respuestas && msg.respuestas.length > 0;
                    const isSaved = savedIds.includes(msg.id);

                    return (
                      <article 
                        key={msg.id} 
                        className={`foro-discussion-card ${msg.destacado ? 'is-pinned' : ''}`}
                      >
                        {/* Fila Superior: Autor, Rol, Categoría y Metadatos */}
                        <div className="foro-card-top-row">
                          <div className="foro-author-block">
                            <div className="foro-avatar-circle" title={msg.nombre}>
                              {getInitials(msg.nombre)}
                            </div>
                            <div className="foro-author-meta">
                              <div className="foro-author-name-row">
                                <span className="foro-author-name">{msg.nombre}</span>
                                {isMsgAdmin && (
                                  <span className="foro-role-badge admin">
                                    <ShieldCheck size={11} /> Admin
                                  </span>
                                )}
                                {!isMsgAdmin && msg.rol && (
                                  <span className="foro-role-badge">
                                    {msg.rol}
                                  </span>
                                )}
                              </div>
                              <span className="foro-date-text">
                                <Clock size={11} /> {formatRelativeDate(msg.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="foro-card-top-badges">
                            {msg.destacado && (
                              <span className="foro-badge-pinned" title="Publicación destacada por la coordinación pedagógica">
                                <Pin size={12} /> Destacada
                              </span>
                            )}
                            <span className="foro-category-badge">
                              {msg.categoria || 'Estrategias didácticas'}
                            </span>
                          </div>
                        </div>

                        {/* Título y Extracto Clicables */}
                        <div 
                          className="foro-card-content-area"
                          onClick={() => { setSelectedDiscussionId(msg.id); setActiveView('detail'); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedDiscussionId(msg.id); setActiveView('detail'); } }}
                          aria-label={`Abrir discusión: ${msg.titulo}`}
                        >
                          <h3 className="foro-discussion-title">
                            {msg.titulo}
                          </h3>
                          <p className="foro-discussion-excerpt">
                            {msg.texto}
                          </p>
                        </div>

                        {/* Etiquetas temáticas */}
                        {Array.isArray(msg.etiquetas) && msg.etiquetas.length > 0 && (
                          <div className="foro-tags-row">
                            {msg.etiquetas.map((tag, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="foro-tag-chip"
                                onClick={() => setSearchQuery(tag)}
                                title={`Filtrar por etiqueta: ${tag}`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Barra Inferior: Respuestas y Acciones */}
                        <div className="foro-card-footer">
                          <div className="foro-card-footer-stats">
                            <span className="foro-stat-replies">
                              <MessageSquare size={14} />
                              <strong>{hasReplies ? msg.respuestas.length : 0}</strong> {msg.respuestas?.length === 1 ? 'respuesta' : 'respuestas'}
                            </span>
                            {hasReplies && (
                              <span className="foro-stat-last-activity">
                                • Última actividad {formatRelativeDate(msg.respuestas[msg.respuestas.length - 1].date)}
                              </span>
                            )}
                          </div>

                          <div className="foro-card-footer-actions">
                            <button 
                              type="button"
                              className={`foro-action-btn-icon ${isSaved ? 'is-active' : ''}`}
                              onClick={(e) => { e.stopPropagation(); toggleSaveDiscussion(msg.id); }}
                              aria-label={isSaved ? "Quitar de guardadas" : "Guardar en favoritas"}
                              title={isSaved ? "Quitar de favoritas" : "Guardar conversación"}
                            >
                              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                            </button>

                            <button 
                              type="button"
                              className="foro-action-btn-icon"
                              onClick={(e) => { e.stopPropagation(); handleCopyDiscussionLink(msg); }}
                              aria-label="Copiar cita de la discusión"
                              title="Copiar cita o enlace"
                            >
                              <Share2 size={15} />
                            </button>

                            {(isMsgAuthor || isAdmin) && (
                              <button 
                                type="button"
                                className="foro-action-btn-icon delete"
                                onClick={(e) => { e.stopPropagation(); handleDeleteDiscussion(msg.id); }}
                                aria-label="Eliminar discusión"
                                title="Eliminar conversación"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}

                            <button 
                              type="button"
                              className="foro-btn-open-thread"
                              onClick={() => { setSelectedDiscussionId(msg.id); setActiveView('detail'); }}
                              aria-label={`Participar en la discusión ${msg.titulo}`}
                            >
                              <span>Participar</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>

                      </article>
                    );
                  })}
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="foro-pagination-bar">
                  <button 
                    type="button" 
                    className="foro-page-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <span className="foro-page-info">
                    Página <strong>{currentPage}</strong> de {totalPages}
                  </span>
                  <button 
                    type="button" 
                    className="foro-page-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                  >
                    Siguiente <ChevronRight size={16} />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* VISTA 2: DETALLE COMPLETO DE UNA DISCUSIÓN */}
          {activeView === 'detail' && activeDiscussion && (
            <div className="foro-detail-container">
              
              {/* Botón Superior para Regresar al Listado */}
              <div className="foro-detail-back-bar">
                <button 
                  type="button" 
                  className="foro-detail-back-btn"
                  onClick={() => { setActiveView('list'); setSelectedDiscussionId(null); }}
                  aria-label="Volver al listado de discusiones"
                >
                  <ArrowLeft size={16} />
                  <span>Volver a todas las discusiones</span>
                </button>
              </div>

              {/* Tarjeta de la Publicación Principal */}
              <article className="foro-detail-main-card">
                
                {/* Cabecera del tema */}
                <div className="foro-detail-header">
                  <div className="foro-card-top-row">
                    <div className="foro-author-block">
                      <div className="foro-avatar-circle large" title={activeDiscussion.nombre}>
                        {getInitials(activeDiscussion.nombre)}
                      </div>
                      <div className="foro-author-meta">
                        <div className="foro-author-name-row">
                          <span className="foro-author-name" style={{ fontSize: '16px' }}>{activeDiscussion.nombre}</span>
                          {activeDiscussion.rol === 'Admin' && (
                            <span className="foro-role-badge admin">
                              <ShieldCheck size={12} /> Admin
                            </span>
                          )}
                          {activeDiscussion.rol && activeDiscussion.rol !== 'Admin' && (
                            <span className="foro-role-badge">
                              {activeDiscussion.rol}
                            </span>
                          )}
                        </div>
                        <span className="foro-date-text">
                          <Clock size={12} /> Publicado el {formatRelativeDate(activeDiscussion.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="foro-card-top-badges">
                      {activeDiscussion.destacado && (
                        <span className="foro-badge-pinned">
                          <Pin size={13} /> Destacada
                        </span>
                      )}
                      <span className="foro-category-badge">
                        {activeDiscussion.categoria || 'Estrategias didácticas'}
                      </span>
                    </div>
                  </div>

                  <h1 className="foro-detail-title">
                    {activeDiscussion.titulo}
                  </h1>

                  {Array.isArray(activeDiscussion.etiquetas) && activeDiscussion.etiquetas.length > 0 && (
                    <div className="foro-tags-row" style={{ marginTop: '12px' }}>
                      {activeDiscussion.etiquetas.map((t, idx) => (
                        <span key={idx} className="foro-tag-chip">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cuerpo del Texto de la Discusión */}
                <div className="foro-detail-body">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.75', fontSize: '15.5px', color: '#142B25', margin: 0 }}>
                    {activeDiscussion.texto}
                  </p>
                </div>

                {/* Acciones de la Publicación */}
                <div className="foro-detail-actions-bar">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      className={`btn-outline ${savedIds.includes(activeDiscussion.id) ? 'active' : ''}`}
                      onClick={() => toggleSaveDiscussion(activeDiscussion.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px' }}
                    >
                      {savedIds.includes(activeDiscussion.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      <span>{savedIds.includes(activeDiscussion.id) ? 'Guardada' : 'Guardar'}</span>
                    </button>

                    <button 
                      type="button" 
                      className="btn-outline"
                      onClick={() => handleCopyDiscussionLink(activeDiscussion)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px' }}
                    >
                      <Copy size={15} />
                      <span>Copiar cita</span>
                    </button>
                  </div>

                  {(activeDiscussion.userId === currentUserId || isAdmin) && (
                    <button 
                      type="button" 
                      className="btn-outline"
                      onClick={() => handleDeleteDiscussion(activeDiscussion.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                    >
                      <Trash2 size={15} />
                      <span>Eliminar discusión</span>
                    </button>
                  )}
                </div>
              </article>

              {/* Sección de Respuestas y Aportes */}
              <section className="foro-replies-section" aria-labelledby="respuestas-heading">
                <div className="foro-replies-header">
                  <h2 id="respuestas-heading" className="foro-replies-title">
                    <MessagesSquare size={20} className="foro-replies-icon" />
                    <span>Aportes pedagógicos de la comunidad</span>
                    <span className="foro-replies-count-badge">
                      {activeDiscussion.respuestas ? activeDiscussion.respuestas.length : 0}
                    </span>
                  </h2>
                </div>

                {(!activeDiscussion.respuestas || activeDiscussion.respuestas.length === 0) ? (
                  <div className="foro-no-replies-box">
                    <div className="foro-no-replies-icon-circle">
                      <MessageSquarePlus size={26} />
                    </div>
                    <h3 className="foro-no-replies-heading">Sin aportes registrados todavía</h3>
                    <p className="foro-no-replies-text">
                      Aún no hay respuestas en esta discusión. Sé el primer docente en aportar tu perspectiva o experiencia.
                    </p>
                  </div>
                ) : (
                  <div className="foro-replies-list">
                    {activeDiscussion.respuestas.map((resp, rIdx) => {
                      const isRespAdmin = resp.rol === 'Admin';
                      const isOriginalAuthor = resp.userId === activeDiscussion.userId;

                      return (
                        <div key={resp.id || rIdx} className="foro-reply-item">
                          <div className="foro-reply-header">
                            <div className="foro-author-block">
                              <div className="foro-avatar-circle small">
                                {getInitials(resp.nombre)}
                              </div>
                              <div>
                                <div className="foro-author-name-row">
                                  <span className="foro-author-name" style={{ fontSize: '14px' }}>{resp.nombre}</span>
                                  {isRespAdmin && (
                                    <span className="foro-role-badge admin">Admin</span>
                                  )}
                                  {isOriginalAuthor && (
                                    <span className="foro-role-badge" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#854D0E' }}>
                                      Autor
                                    </span>
                                  )}
                                </div>
                                <span className="foro-date-text">
                                  {formatRelativeDate(resp.date)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="foro-reply-body">
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.65', fontSize: '14.5px', color: '#1C1917', margin: 0 }}>
                              {resp.texto}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Editor de Respuesta con Preservación de Borrador */}
                <div className="foro-reply-editor-card">
                  <h3 className="foro-reply-editor-title">
                    <CornerDownRight size={17} style={{ color: 'var(--primary-sage)' }} />
                    <span>Redactar aporte pedagógico</span>
                  </h3>
                  
                  <form onSubmit={handleSendReply}>
                    <textarea 
                      className="wizard-textarea foro-reply-textarea"
                      placeholder="Tu respuesta"
                      value={replyText}
                      onChange={handleReplyChange}
                      rows={4}
                      disabled={isSubmittingReply}
                      aria-label="Escribir respuesta para esta discusión"
                    />

                    <div className="foro-reply-editor-footer">
                      <span className="foro-reply-author-label">
                        Respondiendo como: <strong>{currentUserName}</strong> ({currentUserRole})
                      </span>

                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!replyText.trim() || isSubmittingReply}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                      >
                        {isSubmittingReply ? <Loader2 size={16} className="spin" /> : <Send size={15} />}
                        <span>{isSubmittingReply ? 'Publicando...' : 'Publicar Aporte'}</span>
                      </button>
                    </div>
                  </form>
                </div>

              </section>

            </div>
          )}

        </main>

        {/* ========================================================
            ZONA D: PANEL DE CONTEXTO, NORMAS Y ACTIVIDAD RECIENTE
            ======================================================== */}
        <aside 
          className={`foro-context-sidebar ${isContextOpen ? 'is-open' : 'is-collapsed'}`}
          aria-label="Panel de contexto, normas y actividad"
        >
          <div className="foro-context-card">
            
            {/* Normas de Participación Académica */}
            <div className="foro-context-block">
              <h4 className="foro-context-block-title">
                <ShieldCheck size={16} style={{ color: 'var(--primary-sage)' }} />
                <span>Normas de Participación</span>
              </h4>
              <ul className="foro-rules-list">
                <li>
                  <strong>Diálogo constructivo:</strong> Fundamenta tus opiniones pedagógicas con respeto y rigor profesional.
                </li>
                <li>
                  <strong>Privacidad y ética:</strong> No publiques nombres, fotografías o datos sensibles que identifiquen a estudiantes o menores.
                </li>
                <li>
                  <strong>Colaboración abierta:</strong> Comparte recursos con espíritu de enriquecimiento docente mutuo.
                </li>
              </ul>
            </div>

            <div className="foro-sidebar-divider" />

            {/* Temas que necesitan respuesta */}
            {discusionesSinRespuesta.length > 0 && (
              <div className="foro-context-block">
                <h4 className="foro-context-block-title">
                  <HelpCircle size={16} style={{ color: '#EA580C' }} />
                  <span>Requieren tu aporte</span>
                </h4>
                <p style={{ fontSize: '12px', color: '#576864', margin: '0 0 10px 0' }}>
                  Preguntas docentes recientes aún sin respuesta:
                </p>
                <div className="foro-unanswered-list">
                  {discusionesSinRespuesta.map(un => (
                    <div 
                      key={un.id} 
                      className="foro-unanswered-item"
                      onClick={() => { setSelectedDiscussionId(un.id); setActiveView('detail'); }}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="foro-unanswered-title">{un.titulo}</span>
                      <span className="foro-unanswered-meta">Por {un.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="foro-sidebar-divider" />

            {/* Categorías destacadas */}
            <div className="foro-context-block">
              <h4 className="foro-context-block-title">
                <Sparkles size={16} style={{ color: '#D4AF37' }} />
                <span>Ejes Curriculares Clave</span>
              </h4>
              <div className="foro-topics-cloud">
                <span className="foro-topic-chip" onClick={() => setActiveCategoryFilter('Inclusión y DUA')}>Inclusión y DUA</span>
                <span className="foro-topic-chip" onClick={() => setActiveCategoryFilter('Inteligencia artificial en educación')}>IA en Educación</span>
                <span className="foro-topic-chip" onClick={() => setActiveCategoryFilter('Innovación pedagógica')}>STEAM</span>
                <span className="foro-topic-chip" onClick={() => setActiveCategoryFilter('Evaluación del aprendizaje')}>Rúbricas</span>
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* ========================================================
          MODAL ACCESIBLE: CREAR NUEVA DISCUSIÓN
          ======================================================== */}
      {isNewModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="editor-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) setIsNewModalOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-discussion-modal-title"
        >
          <div className="editor-modal-card foro-new-modal-card">
            
            {/* Cabecera del Modal */}
            <div className="modal-glass-header" style={{ padding: '20px 28px', borderBottom: '1px solid rgba(49, 91, 84, 0.12)' }}>
              <div>
                <span className="editorial-badge" style={{ marginBottom: '6px' }}>
                  <Sparkles size={13} color="#2B524A" /> Diálogo Académico
                </span>
                <h2 id="new-discussion-modal-title" className="modal-glass-title" style={{ fontSize: '20px', margin: 0 }}>
                  Iniciar Nueva Discusión Pedagógica
                </h2>
              </div>
              <button 
                type="button" 
                className="modal-glass-close-btn"
                onClick={() => setIsNewModalOpen(false)}
                aria-label="Cerrar ventana de nueva discusión"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateDiscussion} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Título de la Discusión */}
                <div className="input-group" style={{ margin: 0 }}>
                  <label htmlFor="new-foro-titulo">
                    Título de la discusión o pregunta central <span style={{ color: 'var(--error-color)' }}>*</span>
                  </label>
                  <input 
                    id="new-foro-titulo"
                    type="text"
                    required
                    placeholder="Título"
                    value={newDiscussionData.titulo}
                    onChange={(e) => setNewDiscussionData({ ...newDiscussionData, titulo: e.target.value })}
                  />
                </div>

                {/* Categoría Temática */}
                <div className="input-group" style={{ margin: 0 }}>
                  <label htmlFor="new-foro-categoria">Categoría temática oficial <span style={{ color: 'var(--error-color)' }}>*</span></label>
                  <select 
                    id="new-foro-categoria"
                    value={newDiscussionData.categoria}
                    onChange={(e) => setNewDiscussionData({ ...newDiscussionData, categoria: e.target.value })}
                  >
                    {FORO_CATEGORIAS.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Contenido / Reflexión */}
                <div className="input-group" style={{ margin: 0 }}>
                  <label htmlFor="new-foro-texto">
                    Contenido, contexto y planteamiento <span style={{ color: 'var(--error-color)' }}>*</span>
                  </label>
                  <textarea 
                    id="new-foro-texto"
                    required
                    rows={6}
                    placeholder="Cuéntanos"
                    value={newDiscussionData.texto}
                    onChange={(e) => setNewDiscussionData({ ...newDiscussionData, texto: e.target.value })}
                    className="wizard-textarea"
                    style={{ minHeight: '130px' }}
                  />
                </div>

                {/* Etiquetas temáticas */}
                <div className="input-group" style={{ margin: 0 }}>
                  <label htmlFor="new-foro-etiquetas">Etiquetas temáticas (opcionales, separadas por coma)</label>
                  <input 
                    id="new-foro-etiquetas"
                    type="text"
                    placeholder="Etiquetas separadas por coma"
                    value={newDiscussionData.etiquetas}
                    onChange={(e) => setNewDiscussionData({ ...newDiscussionData, etiquetas: e.target.value })}
                  />
                </div>

                {/* Opción de fijar/destacar para administradores */}
                {isAdmin && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#142B25', fontWeight: 600 }}>
                    <input 
                      type="checkbox"
                      checked={newDiscussionData.destacado}
                      onChange={(e) => setNewDiscussionData({ ...newDiscussionData, destacado: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#183630' }}
                    />
                    <span>Fijar como publicación destacada en la parte superior</span>
                  </label>
                )}

              </div>

              {/* Botones del Modal */}
              <div style={{ padding: '16px 28px', backgroundColor: 'rgba(237, 244, 241, 0.7)', borderTop: '1px solid rgba(49, 91, 84, 0.12)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsNewModalOpen(false)}
                  disabled={isPosting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isPosting || !newDiscussionData.titulo.trim() || !newDiscussionData.texto.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
                >
                  {isPosting ? <Loader2 size={16} className="spin" /> : <Send size={15} />}
                  <span>{isPosting ? 'Publicando...' : 'Publicar Discusión'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
