import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Globe, 
  Lock, 
  Trash2, 
  Edit3, 
  Search, 
  Heart, 
  Calendar, 
  GraduationCap, 
  BookOpen,
  FileCheck,
  Star,
  MessageSquare,
  Compass
} from 'lucide-react';
import { getMisPlanes, updatePlanStatus, deletePlanFromDB, getCalificacionesPlan } from '../services/dbService';
import { useAppStore } from '../store/useAppStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import CalificacionExperienciaModal from '../components/CalificacionExperienciaModal';
import PageLoadingState from '../components/PageLoadingState';

export default function ExperienciasPage() {
  const [activeTab, setActiveTab] = useState('Mis Experiencias');
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeletingExp, setIsDeletingExp] = useState(false);
  const [selectedPlanForCalificar, setSelectedPlanForCalificar] = useState(null);

  const handleCalificacionActualizada = (planId, nuevasCalificaciones) => {
    setExperiencias(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, calificaciones: nuevasCalificaciones };
      }
      return p;
    }));
    if (selectedPlanForCalificar && selectedPlanForCalificar.id === planId) {
      setSelectedPlanForCalificar(prev => prev ? { ...prev, calificaciones: nuevasCalificaciones } : null);
    }
  };
  const { userId, loadPlan } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiencias = async () => {
      setLoading(true);
      try {
        if (activeTab === 'Mis Experiencias') {
          if (!userId) return;
          const planes = await getMisPlanes(userId);
          setExperiencias(planes.filter(p => p.estado === 'Sistematizado' || p.estado === 'Biblioteca'));
        } else {
          // Traer todas las sistematizadas públicas de la comunidad
          const q = query(collection(db, "planes"), where("estado", "==", "Biblioteca"));
          const snapshot = await getDocs(q);
          const comunidad = [];
          snapshot.forEach(doc => comunidad.push({ id: doc.id, ...doc.data() }));
          setExperiencias(comunidad);
        }
      } catch (err) {
        console.error("Error al cargar experiencias:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiencias();
  }, [activeTab, userId]);

  const handleAction = async (plan, action) => {
    const planId = typeof plan === 'object' ? plan.id : plan;
    try {
      if (action === 'delete') {
        const target = typeof plan === 'object' ? plan : experiencias.find(p => p.id === planId);
        setExpToDelete(target || { id: planId, tema: 'Experiencia' });
      } else if (action === 'togglePrivacy') {
        const targetPlan = experiencias.find(p => p.id === planId);
        const nuevoEstado = targetPlan.estado === 'Biblioteca' ? 'Sistematizado' : 'Biblioteca';
        await updatePlanStatus(planId, { estado: nuevoEstado });
        setExperiencias(experiencias.map(p => p.id === planId ? { ...p, estado: nuevoEstado } : p));
      } else if (action === 'edit' || action === 'view') {
        const targetPlan = experiencias.find(p => p.id === planId);
        loadPlan(targetPlan, targetPlan.markdown, targetPlan.id);
        navigate(`/editor?id=${targetPlan.id}`);
      }
    } catch (err) {
      console.error("Error al ejecutar acción:", err);
    }
  };

  const handleConfirmDeleteExp = async () => {
    if (!expToDelete) return;
    setIsDeletingExp(true);
    try {
      await deletePlanFromDB(expToDelete.id);
      setExperiencias(experiencias.filter(p => p.id !== expToDelete.id));
      setExpToDelete(null);
    } catch (err) {
      console.error("Error al eliminar experiencia:", err);
    } finally {
      setIsDeletingExp(false);
    }
  };

  const filteredExperiencias = experiencias.filter(exp => {
    const titulo = exp.tema || '';
    const autor = exp.metadata?.autor || '';
    const materia = exp.materia || '';
    const term = searchTerm.toLowerCase();
    return titulo.toLowerCase().includes(term) || autor.toLowerCase().includes(term) || materia.toLowerCase().includes(term);
  });

  return (
    <div className="mgmt-container">
      
      {/* Cabecera Editorial del Módulo (Mismo desenfoque y panel de cristal de Inicio) */}
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
          <div>
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <Sparkles size={14} color="#2B524A" />
              <span>Sistematización de Práctica Docente</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Experiencias Pedagógicas
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '14.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.55', fontWeight: 500 }}>
              Sistematiza el impacto didáctico de tus clases en el aula y descubre prácticas transformadoras compartidas por otros educadores de la comunidad.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <FileCheck size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{experiencias.length} {experiencias.length === 1 ? 'Experiencia registrada' : 'Experiencias registradas'}</span>
          </div>
        </div>
      </header>

      {/* Selector Editorial de Pestañas */}
      <div style={{ 
        display: 'inline-flex', 
        backgroundColor: 'rgba(255, 254, 250, 0.86)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '12px',
        gap: '6px',
        boxShadow: '0 4px 14px rgba(16, 36, 32, 0.06)',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => { setActiveTab('Mis Experiencias'); setSearchTerm(''); }}
          style={{ 
            padding: '7px 16px', 
            borderRadius: '10px',
            border: 'none', 
            backgroundColor: activeTab === 'Mis Experiencias' ? '#183630' : 'transparent',
            color: activeTab === 'Mis Experiencias' ? '#FFFFFF' : '#243630',
            fontWeight: activeTab === 'Mis Experiencias' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.18s ease',
            boxShadow: activeTab === 'Mis Experiencias' ? '0 4px 12px rgba(20, 42, 38, 0.18)' : 'none'
          }}
        >
          <Sparkles size={15} /> Mis Experiencias Sistematizadas
        </button>
        <button 
          onClick={() => { setActiveTab('Comunidad'); setSearchTerm(''); }}
          style={{ 
            padding: '7px 16px', 
            borderRadius: '10px',
            border: 'none', 
            backgroundColor: activeTab === 'Comunidad' ? '#183630' : 'transparent',
            color: activeTab === 'Comunidad' ? '#FFFFFF' : '#243630',
            fontWeight: activeTab === 'Comunidad' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.18s ease',
            boxShadow: activeTab === 'Comunidad' ? '0 4px 12px rgba(20, 42, 38, 0.18)' : 'none'
          }}
        >
          <Globe size={15} /> Experiencias de la Comunidad
        </button>
      </div>

      {/* Buscador (Mismo desenfoque de cristal) */}
      {!loading && experiencias.length > 0 && (
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
          <div className="mgmt-search-box">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Buscar" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mgmt-search-input"
              aria-label="Buscar experiencias"
            />
          </div>
        </div>
      )}

      {/* Estado de Carga */}
      {loading ? (
        <PageLoadingState 
          icon={Compass}
          badge="Comunidad Pedagógica"
          title="Cargando experiencias docentes..."
          subtitle="Recuperando buenas prácticas, proyectos aplicados y reflexiones pedagógicas del aula."
          minHeight="340px"
        />
      ) : filteredExperiencias.length === 0 ? (
        /* Estado Vacío (Mismo desenfoque y panel de cristal) */
        <div 
          className="mgmt-empty-card"
          style={{
            backgroundColor: 'rgba(255, 254, 250, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.94)',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
          }}
        >
          <div className="mgmt-empty-icon">
            <Sparkles size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '8px' }}>
            No se encontraron experiencias
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '22px' }}>
            {activeTab === 'Mis Experiencias'
              ? 'Aún no has sistematizado planes de clase. Ve a "Mis Planes" y haz clic en Sistematizar en cualquiera de tus secuencias.'
              : 'No hay experiencias públicas de la comunidad que coincidan con la búsqueda.'}
          </p>
          {activeTab === 'Mis Experiencias' && (
            <button className="btn btn-primary" onClick={() => navigate('/mis-planes')}>
              Ir a Mis Planes
            </button>
          )}
        </div>
      ) : (
        /* Cuadrícula de Experiencias */
        <div className="mgmt-grid">
          {filteredExperiencias.map(exp => {
            const isPublic = exp.estado === 'Biblioteca';
            const isMine = exp.userId === userId;
            const autor = isMine ? 'Tú (Docente)' : (exp.metadata?.autor || 'Docente');
            const fecha = exp.createdAt?.toDate ? exp.createdAt.toDate().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Reciente';
            
            const calificacionesExp = getCalificacionesPlan(exp.id, exp);
            const numCalificaciones = calificacionesExp.length;
            const sumaEstrellas = calificacionesExp.reduce((acc, c) => acc + (Number(c.estrellas) || 0), 0);
            const promedioEstrellas = numCalificaciones > 0 ? Number((sumaEstrellas / numCalificaciones).toFixed(1)) : 0;

            return (
              <article 
                key={exp.id} 
                className="mgmt-card" 
                onClick={() => handleAction(exp.id, 'view')}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAction(exp.id, 'view'); }}
                aria-label={`Ver experiencia ${exp.tema || 'Sin título'}`}
                style={{
                  backgroundColor: 'rgba(255, 254, 250, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.94)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
                }}
              >
                <div className="mgmt-card-header">
                  <span className={`editor-badge ${isPublic ? 'saved' : 'draft'}`} style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                    {isPublic ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} /> Pública en Comunidad
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Sistematización Privada
                      </span>
                    )}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    <Calendar size={13} />
                    <span>{fecha}</span>
                  </div>
                </div>

                <h2 className="mgmt-card-title">{exp.tema || 'Experiencia sin título'}</h2>
                
                <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 14px 0', fontWeight: 600 }}>
                  Por: {autor}
                </p>

                <div className="mgmt-card-meta">
                  {exp.materia && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} style={{ color: 'var(--primary-sage)' }} /> {exp.materia}
                    </span>
                  )}
                  {exp.grado && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={13} style={{ color: 'var(--primary-sage)' }} /> {exp.grado}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-sage)', fontWeight: 600 }}>
                    <Heart size={13} /> Destacada
                  </span>
                </div>

                {/* Bloque de Calificación y Retroalimentación Pedagógica */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '8px 12px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(49, 91, 84, 0.05)', 
                    border: '1px solid rgba(49, 91, 84, 0.12)',
                    margin: '10px 0 12px 0' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star 
                          key={st} 
                          size={13} 
                          fill={st <= Math.round(promedioEstrellas) ? '#F59E0B' : 'none'} 
                          color={st <= Math.round(promedioEstrellas) ? '#F59E0B' : '#CBD5E1'} 
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#142B25' }}>
                      {promedioEstrellas > 0 ? `${promedioEstrellas} / 5.0` : 'Sin calificar'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#718096' }}>
                      ({numCalificaciones} {numCalificaciones === 1 ? 'docente' : 'docentes'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedPlanForCalificar(exp); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#315B54',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      padding: '3px 6px',
                      borderRadius: '6px'
                    }}
                    title="Ver comentarios y calificar experiencia pedagógica"
                  >
                    <MessageSquare size={12} />
                    <span>{numCalificaciones > 0 ? 'Ver / Calificar' : 'Calificar'}</span>
                  </button>
                </div>

                {/* Acciones para Mis Experiencias */}
                {activeTab === 'Mis Experiencias' && (
                  <div className="mgmt-card-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '7px 12px', fontSize: '13px', minHeight: '36px' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp.id, 'edit'); }}
                      title="Editar esta experiencia en el editor"
                    >
                      <Edit3 size={14} /> <span>Editar</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--primary-active)' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp.id, 'togglePrivacy'); }}
                      title={isPublic ? 'Hacer privada' : 'Hacer pública'}
                    >
                      {isPublic ? <Lock size={14} /> : <Globe size={14} />}
                      <span className="hide-mobile">{isPublic ? 'Hacer Privada' : 'Publicar'}</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--error-color)', borderColor: '#FECACA' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp, 'delete'); }}
                      title="Eliminar experiencia"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                
                {/* Acciones para Comunidad */}
                {activeTab === 'Comunidad' && (
                  <div className="mgmt-card-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '7px 14px', fontSize: '13px', minHeight: '36px' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp.id, 'view'); }}
                    >
                      <span>Ver Experiencia</span>
                    </button>
                    <button 
                      type="button"
                      className="btn-outline" 
                      style={{ padding: '7px 12px', fontSize: '13px', minHeight: '36px', display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#B45309', borderColor: 'rgba(217, 119, 6, 0.3)' }} 
                      onClick={(e) => { e.stopPropagation(); setSelectedPlanForCalificar(exp); }}
                      title="Calificar y comentar este plan"
                    >
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span>Calificar ({numCalificaciones})</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación de eliminación con diseño de cristal */}
      <ConfirmModal
        isOpen={Boolean(expToDelete)}
        onClose={() => setExpToDelete(null)}
        onConfirm={handleConfirmDeleteExp}
        title="¿Eliminar esta experiencia pedagógica?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${expToDelete?.tema || expToDelete?.metadata?.tema || 'esta experiencia'}"?`}
        confirmText="Eliminar Experiencia"
        cancelText="Conservar"
        isDestructive={true}
        confirmLoading={isDeletingExp}
      />

      {/* Modal interactivo de calificación y retroalimentación pedagógica */}
      <CalificacionExperienciaModal
        isOpen={Boolean(selectedPlanForCalificar)}
        onClose={() => setSelectedPlanForCalificar(null)}
        plan={selectedPlanForCalificar}
        currentUser={auth.currentUser}
        onCalificacionActualizada={handleCalificacionActualizada}
      />
    </div>
  );
}
