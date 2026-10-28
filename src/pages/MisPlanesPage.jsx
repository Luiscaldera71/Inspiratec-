import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getMisPlanes, deletePlanFromDB, updatePlanStatus } from '../services/dbService';
import { auth } from '../firebase';
import { 
  Loader2, 
  BookOpen, 
  PlusCircle, 
  Search, 
  Trash2, 
  Share2, 
  Sparkles, 
  Eye, 
  Calendar,
  GraduationCap,
  Layers,
  FileCheck,
  FileText,
  FileCode,
  RefreshCw
} from 'lucide-react';

import ConfirmModal from '../components/ConfirmModal';
import { exportPlanToPdf } from '../services/export/pdf/pdfEngine';
import { exportPlanToWord } from '../services/export/word/wordEngine';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import PageLoadingState from '../components/PageLoadingState';
import { updateSavedPlansWithRealProfile } from '../services/templates/identificationResolver';


export default function MisPlanesPage() {
  const navigate = useNavigate();
  const { loadPlan, userId, userProfile, setPlanesCount, clearWizardFormOnly } = useAppStore();
  
  const [planes, setPlanes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingPlanId, setDownloadingPlanId] = useState(null);
  const [downloadingWordPlanId, setDownloadingWordPlanId] = useState(null);

  const fetchPlanes = useCallback(async (targetId) => {
    setIsLoading(true);
    try {
      if (userProfile) {
        await updateSavedPlansWithRealProfile(userProfile, targetId);
      }
      const fetchedPlanes = await getMisPlanes(targetId);
      setPlanes(fetchedPlanes);
      setPlanesCount(fetchedPlanes.length);
    } catch (error) {
      console.error("Error al cargar planes", error);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, setPlanesCount]);

  useEffect(() => {
    let isMounted = true;
    const effectiveId = userId || auth.currentUser?.uid || 'anon';

    fetchPlanes(effectiveId);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && isMounted) {
        if (!userId) {
          useAppStore.getState().setUserId(user.uid);
        }
        fetchPlanes(user.uid);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId, fetchPlanes]);


  const handleEdit = (plan) => {
    loadPlan(plan, plan.markdown, plan.id);
    navigate(`/editor?id=${plan.id}`);
  };

  const handleDownloadPdf = async (plan) => {
    if (downloadingPlanId) return;
    setDownloadingPlanId(plan.id);

    try {
      await exportPlanToPdf({
        plan,
        markdown: plan.markdown,
        userProfile,
        planId: plan.id
      });
    } catch (err) {
      console.error('[INSPIRATEC Mis Planes] Error al descargar PDF:', err);
      alert(err.message || 'Error al descargar el PDF de este plan.');
    } finally {
      setDownloadingPlanId(null);
    }
  };

  const handleDownloadWord = async (plan) => {
    if (downloadingWordPlanId) return;
    setDownloadingWordPlanId(plan.id);

    try {
      await exportPlanToWord({
        plan,
        markdown: plan.markdown,
        userProfile,
        planId: plan.id
      });
    } catch (err) {
      console.error('[INSPIRATEC Mis Planes] Error al descargar Word:', err);
      alert(err.message || 'Error al descargar el archivo Word de este plan.');
    } finally {
      setDownloadingWordPlanId(null);
    }
  };

  const handleAction = async (plan, action) => {
    const planId = typeof plan === 'object' ? plan.id : plan;
    try {
      if (action === 'delete') {
        const target = typeof plan === 'object' ? plan : planes.find(p => p.id === planId);
        setPlanToDelete(target || { id: planId, tema: 'Plan de clase' });
      } else if (action === 'sistematizar') {
        await updatePlanStatus(planId, { estado: 'Sistematizado' });
        setPlanes(planes.map(p => p.id === planId ? { ...p, estado: 'Sistematizado' } : p));
      } else if (action === 'compartir') {
        await updatePlanStatus(planId, { estado: 'Biblioteca' });
        setPlanes(planes.map(p => p.id === planId ? { ...p, estado: 'Biblioteca' } : p));
      }
    } catch (err) {
      console.error("Error al ejecutar acción sobre el plan:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      const targetId = planToDelete.id;
      await deletePlanFromDB(targetId);

      // Sincronizar el store Zustand para evitar que el editor mantenga una copia activa del plan eliminado
      if (useAppStore.getState().clearActivePlanIfMatches) {
        useAppStore.getState().clearActivePlanIfMatches(targetId);
      }

      const newPlanes = planes.filter(p => p.id !== targetId);
      setPlanes(newPlanes);
      setPlanesCount(newPlanes.length);
      setPlanToDelete(null);
    } catch (err) {
      console.error("Error al eliminar plan:", err);
      alert("Hubo un inconveniente al eliminar el plan. Por favor intente nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPlanes = planes.filter(plan => {
    const matchesSearch = 
      (plan.tema || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.materia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.grado || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'todos') return matchesSearch;
    if (statusFilter === 'sistematizados') return matchesSearch && plan.estado === 'Sistematizado';
    if (statusFilter === 'biblioteca') return matchesSearch && plan.estado === 'Biblioteca';
    if (statusFilter === 'guardados') return matchesSearch && (plan.estado === 'Guardado' || !plan.estado);
    return matchesSearch;
  });

  return (
    <div className="mgmt-container">
      
      {/* Migas de Pan para orientación jerárquica */}
      <div style={{ marginBottom: '8px' }}>
        <Breadcrumbs items={[
          { label: 'Inicio', href: '/home', onClick: (e) => { e.preventDefault(); navigate('/home'); } },
          { label: 'Mis Planes de Clase' }
        ]} />
      </div>

      {/* Cabecera Editorial del Módulo (Mismo desenfoque y panel de cristal) */}
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
              <BookOpen size={14} color="#2B524A" />
              <span>Repositorio Curricular Personal</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Mis Planes de Clase
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '14.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.55', fontWeight: 500 }}>
              Gestiona, edita y organiza tus secuencias pedagógicas sincronizadas en la nube. Reabre borradores, publica en la biblioteca comunitaria o sistematiza tus experiencias.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <Layers size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{planes.length} {planes.length === 1 ? 'Plan guardado' : 'Planes guardados'}</span>
          </div>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchPlanes(userId || auth.currentUser?.uid || 'anon')}
            disabled={isLoading}
            title="Sincronizar y recargar planes"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              minHeight: '42px', 
              padding: '10px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: '#183630',
              border: '1px solid rgba(24, 54, 48, 0.20)',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            <span>Sincronizar</span>
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              clearWizardFormOnly();
              navigate('/');
            }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              minHeight: '42px', 
              padding: '10px 20px',
              backgroundColor: '#183630',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(20, 42, 38, 0.20)',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={16} /> Crear Nuevo Plan
          </button>
        </div>
      </header>

      {/* Barra de Filtros y Búsqueda */}
      {!isLoading && planes.length > 0 && (
        <div className="mgmt-filter-bar">
          <div className="mgmt-search-box">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mgmt-search-input"
              aria-label="Buscar planes"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className={`btn-outline ${statusFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setStatusFilter('todos')}
              style={{ 
                padding: '7px 16px', 
                fontSize: '13px',
                borderRadius: '10px',
                backgroundColor: statusFilter === 'todos' ? 'rgba(71, 122, 114, 0.22)' : 'rgba(255, 255, 255, 0.92)',
                borderColor: statusFilter === 'todos' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
                color: '#142B25',
                fontWeight: statusFilter === 'todos' ? 700 : 600,
                boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
              }}
            >
              Todos ({planes.length})
            </button>
            <button 
              className={`btn-outline ${statusFilter === 'guardados' ? 'active' : ''}`}
              onClick={() => setStatusFilter('guardados')}
              style={{ 
                padding: '7px 16px', 
                fontSize: '13px',
                borderRadius: '10px',
                backgroundColor: statusFilter === 'guardados' ? 'rgba(71, 122, 114, 0.22)' : 'rgba(255, 255, 255, 0.92)',
                borderColor: statusFilter === 'guardados' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
                color: '#142B25',
                fontWeight: statusFilter === 'guardados' ? 700 : 600,
                boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
              }}
            >
              Guardados
            </button>
            <button 
              className={`btn-outline ${statusFilter === 'sistematizados' ? 'active' : ''}`}
              onClick={() => setStatusFilter('sistematizados')}
              style={{ 
                padding: '7px 16px', 
                fontSize: '13px',
                borderRadius: '10px',
                backgroundColor: statusFilter === 'sistematizados' ? 'rgba(71, 122, 114, 0.22)' : 'rgba(255, 255, 255, 0.92)',
                borderColor: statusFilter === 'sistematizados' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
                color: '#142B25',
                fontWeight: statusFilter === 'sistematizados' ? 700 : 600,
                boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
              }}
            >
              Sistematizados
            </button>
            <button 
              className={`btn-outline ${statusFilter === 'biblioteca' ? 'active' : ''}`}
              onClick={() => setStatusFilter('biblioteca')}
              style={{ 
                padding: '7px 16px', 
                fontSize: '13px',
                borderRadius: '10px',
                backgroundColor: statusFilter === 'biblioteca' ? 'rgba(71, 122, 114, 0.22)' : 'rgba(255, 255, 255, 0.92)',
                borderColor: statusFilter === 'biblioteca' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
                color: '#142B25',
                fontWeight: statusFilter === 'biblioteca' ? 700 : 600,
                boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
              }}
            >
              En Biblioteca
            </button>
          </div>
        </div>
      )}
      
      {/* Estado de Carga */}
      {isLoading ? (
        <PageLoadingState 
          icon={BookOpen}
          badge="Secuencias Didácticas"
          title="Sincronizando tus secuencias didácticas..."
          subtitle="Recuperando tus planes curriculares, actividades y materiales desde la nube."
          minHeight="340px"
        />
      ) : planes.length === 0 ? (
        /* Estado Vacío Sin Planes */
        <div className="mgmt-empty-card">
          <div className="mgmt-empty-icon">
            <BookOpen size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '8px' }}>
            Aún no tienes secuencias didácticas guardadas
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '24px' }}>
            Comienza planificando una clase mediante el asistente pedagógico asistido por IA.
          </p>
          <button className="btn btn-primary" onClick={() => {
            clearWizardFormOnly();
            navigate('/');
          }}>
            <PlusCircle size={16} /> Crear mi primer plan
          </button>
        </div>
      ) : filteredPlanes.length === 0 ? (
        /* Estado Vacío Sin Resultados de Filtro */
        <div className="mgmt-empty-card">
          <div className="mgmt-empty-icon">
            <Search size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            No se encontraron planes
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            No hay secuencias que coincidan con el criterio "{searchTerm}".
          </p>
          <button className="btn-outline" onClick={() => { setSearchTerm(''); setStatusFilter('todos'); }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        /* Cuadrícula de Tarjetas de Planes */
        <div className="mgmt-grid">
          {filteredPlanes.map(plan => {
            const fecha = plan.createdAt?.toDate ? plan.createdAt.toDate().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Reciente';
            const estado = plan.estado || 'Guardado';
            
            return (
              <article 
                key={plan.id} 
                className="mgmt-card" 
                onClick={() => handleEdit(plan)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(plan); }}
                aria-label={`Ver plan ${plan.tema || 'Sin título'}`}
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
                  <span className={`editor-badge ${estado === 'Sistematizado' ? 'saved' : estado === 'Biblioteca' ? 'draft' : 'saved'}`} style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                    <FileCheck size={12} /> {estado}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} />
                    <span>{fecha}</span>
                  </div>
                </div>

                <h2 className="mgmt-card-title">{plan.tema || 'Plan de clase sin título'}</h2>
                
                <p className="mgmt-card-desc">
                  {plan.objetivos ? (
                    plan.objetivos.length > 110 ? `${plan.objetivos.substring(0, 110)}...` : plan.objetivos
                  ) : (
                    'Secuencia didáctica estructurada y lista para impartir en el aula.'
                  )}
                </p>

                <div className="mgmt-card-meta">
                  {plan.materia && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} style={{ color: 'var(--primary-sage)' }} /> {plan.materia}
                    </span>
                  )}
                  {plan.grado && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={13} style={{ color: 'var(--primary-sage)' }} /> {plan.grado}
                    </span>
                  )}
                </div>

                <div className="mgmt-card-actions">
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '7px 12px', fontSize: '13px', minHeight: '36px' }}
                    onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}
                    title="Abrir y editar en el visor de documentos"
                  >
                    <Eye size={14} /> <span>Abrir</span>
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--primary-active)' }}
                    onClick={(e) => { e.stopPropagation(); handleAction(plan.id, 'sistematizar'); }}
                    title="Convertir en experiencia sistematizada"
                  >
                    <Sparkles size={14} /> <span className="hide-mobile">Sistematizar</span>
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px' }}
                    onClick={(e) => { e.stopPropagation(); handleAction(plan.id, 'compartir'); }}
                    title="Publicar en la biblioteca comunitaria"
                  >
                    <Share2 size={14} />
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--primary-active)' }}
                    onClick={(e) => { e.stopPropagation(); handleDownloadPdf(plan); }}
                    disabled={downloadingPlanId === plan.id}
                    title="Descargar documento PDF institucional"
                  >
                    {downloadingPlanId === plan.id ? <Loader2 size={14} className="spin" /> : <FileText size={14} />}
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--primary-active)' }}
                    onClick={(e) => { e.stopPropagation(); handleDownloadWord(plan); }}
                    disabled={downloadingWordPlanId === plan.id}
                    title="Descargar documento de Word (.doc)"
                  >
                    {downloadingWordPlanId === plan.id ? <Loader2 size={14} className="spin" /> : <FileCode size={14} />}
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--error-color)', borderColor: '#FECACA' }}
                    onClick={(e) => { e.stopPropagation(); handleAction(plan, 'delete'); }}
                    title="Eliminar este plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación de eliminación con diseño de cristal */}
      <ConfirmModal
        isOpen={Boolean(planToDelete)}
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este plan de clase?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${planToDelete?.tema || planToDelete?.metadata?.tema || 'este plan'}"? Esta acción removerá el archivo de tu cuenta y no podrá revertirse.`}
        confirmText="Eliminar Plan"
        cancelText="Conservar Plan"
        isDestructive={true}
        confirmLoading={isDeleting}
      />
    </div>
  );
}
