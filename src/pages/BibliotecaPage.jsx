import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Loader2, 
  Library, 
  Search, 
  Copy, 
  Eye, 
  X, 
  GraduationCap, 
  User, 
  BookOpen, 
  Download,
  Filter
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PageLoadingState from '../components/PageLoadingState';

export default function BibliotecaPage() {
  const navigate = useNavigate();
  const { loadPlan } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Todos los grados');
  const [previewPlan, setPreviewPlan] = useState(null);

  const gradosOptions = [
    'Todos los grados', '1ro', '2do', '3ro', '4to', 
    '5to', '6to', '7mo', '8vo', '9no', '10mo', '11mo'
  ];

  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!previewPlan) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPreviewPlan(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [previewPlan]);

  useEffect(() => {
    const fetchRecursos = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "planes"), where("estado", "==", "Biblioteca"));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setRecursos(data);
      } catch (e) {
        console.error("Error fetching library", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecursos();
  }, []);

  const handleClonar = (rec) => {
    loadPlan(rec.metadata || rec, rec.markdown, null); // Clonar como nueva secuencia
    navigate('/editor');
  };

  const filteredRecursos = recursos.filter(rec => {
    const titulo = rec.tema || rec.metadata?.tema || '';
    const autor = rec.metadata?.autor || 'Docente';
    const grado = rec.grado || rec.metadata?.grado || '';
    const materia = rec.materia || rec.metadata?.materia || '';
    
    const matchesSearch = 
      titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'Todos los grados' || grado === selectedGrade;
    return matchesSearch && matchesGrade;
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
              <Library size={14} color="#2B524A" />
              <span>Recursos Didácticos Abiertos</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Biblioteca Comunitaria
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '14.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.55', fontWeight: 500 }}>
              Explora, consulta y clona secuencias didácticas compartidas abiertamente por la red de docentes. Adapta cualquier experiencia a las necesidades de tu contexto escolar.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <BookOpen size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{recursos.length} {recursos.length === 1 ? 'Recurso disponible' : 'Recursos disponibles'}</span>
          </div>
        </div>
      </header>

      {/* Barra de Filtros y Búsqueda (Mismo desenfoque de cristal) */}
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
            aria-label="Buscar en la biblioteca"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} style={{ color: 'var(--text-secondary)' }} />
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="wizard-select"
            style={{ 
              width: 'auto', 
              minWidth: '180px', 
              padding: '9px 14px', 
              fontSize: '13.5px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(49, 91, 84, 0.22)',
              borderRadius: '12px',
              color: '#142B25'
            }}
            aria-label="Filtrar por grado escolar"
          >
            {gradosOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Estado de Carga */}
      {loading ? (
        <PageLoadingState 
          icon={Library}
          badge="Repositorio Abierto"
          title="Explorando la biblioteca comunitaria..."
          subtitle="Sincronizando secuencias didácticas compartidas, recursos y guías de clase."
          minHeight="340px"
        />
      ) : filteredRecursos.length === 0 ? (
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
            <Library size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '8px' }}>
            No se encontraron recursos
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '22px' }}>
            {searchTerm || selectedGrade !== 'Todos los grados'
              ? 'Prueba modificando los términos de búsqueda o el grado seleccionado.'
              : 'Aún no hay secuencias compartidas en la biblioteca pública. ¡Sé el primero en compartir desde Mis Planes!'}
          </p>
          {(searchTerm || selectedGrade !== 'Todos los grados') && (
            <button className="btn-outline" onClick={() => { setSearchTerm(''); setSelectedGrade('Todos los grados'); }}>
              Restablecer filtros
            </button>
          )}
        </div>
      ) : (
        /* Cuadrícula de Recursos Comunitarios */
        <div className="mgmt-grid">
          {filteredRecursos.map(rec => {
            const titulo = rec.tema || rec.metadata?.tema || 'Plan de Clase';
            const autor = rec.metadata?.autor || 'Docente';
            const grado = rec.grado || rec.metadata?.grado || 'Sin especificar';
            const materia = rec.materia || rec.metadata?.materia || '';
            const descargas = rec.descargas || 0;

            return (
              <article 
                key={rec.id} 
                className="mgmt-card" 
                onClick={() => setPreviewPlan(rec)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') setPreviewPlan(rec); }}
                aria-label={`Ver recurso ${titulo}`}
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
                  <span className="editor-badge saved" style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                    Plan Compartido
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Download size={12} />
                    <span>{descargas} usos</span>
                  </div>
                </div>

                <h2 className="mgmt-card-title">{titulo}</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '12px' }}>
                  <User size={14} style={{ color: 'var(--primary-sage)' }} />
                  <span>Por: <strong>{autor}</strong></span>
                </div>

                <div className="mgmt-card-meta">
                  {materia && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} style={{ color: 'var(--primary-sage)' }} /> {materia}
                    </span>
                  )}
                  {grado && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={13} style={{ color: 'var(--primary-sage)' }} /> {grado}
                    </span>
                  )}
                </div>

                <div className="mgmt-card-actions">
                  <button 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '7px 12px', fontSize: '13px', minHeight: '36px' }}
                    onClick={(e) => { e.stopPropagation(); setPreviewPlan(rec); }}
                    title="Vista previa del documento"
                  >
                    <Eye size={14} /> <span>Previsualizar</span>
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '7px 12px', fontSize: '13px', minHeight: '36px' }}
                    onClick={(e) => { e.stopPropagation(); handleClonar(rec); }}
                    title="Clonar esta secuencia didáctica en tu editor"
                  >
                    <Copy size={14} /> <span>Usar Plan</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Previsualización Completa con Diseño de Cristal */}
      {previewPlan && createPortal(
        <div 
          className="modal-glass-backdrop" 
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewPlan(null); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-plan-title"
        >
          <div 
            className="modal-glass-card" 
            style={{ 
              maxWidth: '860px',
              backgroundColor: 'rgba(255, 254, 250, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.96)',
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(16, 36, 32, 0.22)'
            }}
          >
            <div className="modal-glass-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(71, 122, 114, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1C3D36',
                  flexShrink: 0
                }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 id="preview-plan-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                    {previewPlan.tema || previewPlan.metadata?.tema || 'Plan de Clase'}
                  </h3>
                  <span style={{ fontSize: '12.5px', color: '#527068' }}>
                    Compartido por {previewPlan.metadata?.autor || 'Docente de la Comunidad'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewPlan(null)} 
                className="modal-glass-close-btn"
                aria-label="Cerrar vista previa"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-glass-body">
              <div style={{ 
                marginBottom: '20px', 
                padding: '14px 18px', 
                backgroundColor: 'rgba(255, 254, 250, 0.88)', 
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.94)',
                borderRadius: '16px', 
                display: 'flex', 
                gap: '24px', 
                flexWrap: 'wrap', 
                fontSize: '13px', 
                color: '#142B25',
                boxShadow: '0 4px 16px rgba(20, 42, 38, 0.05)'
              }}>
                <span><strong>Materia:</strong> {previewPlan.metadata?.materia || previewPlan.materia || 'General'}</span>
                <span><strong>Grado:</strong> {previewPlan.metadata?.grado || previewPlan.grado || 'General'}</span>
              </div>

              <article className="markdown-content" style={{ color: '#142B25' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewPlan.markdown || '_Sin contenido markdown disponible para este plan._'}
                </ReactMarkdown>
              </article>
            </div>

            <div className="modal-glass-footer">
              <button className="btn-outline" onClick={() => setPreviewPlan(null)}>Cerrar</button>
              <button className="btn btn-primary" onClick={() => { handleClonar(previewPlan); setPreviewPlan(null); }}>
                <Copy size={14} /> Usar este plan en mi cuenta
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
