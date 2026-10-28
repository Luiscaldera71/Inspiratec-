import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { modifyPlan } from '../services/aiService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Save, 
  Edit, 
  Eye,
  FileText, 
  FileCode, 
  PlusCircle, 
  ListChecks, 
  MonitorPlay, 
  HelpCircle, 
  Puzzle, 
  Send, 
  Loader2, 
  X, 
  Download, 
  Maximize2, 
  Sparkles, 
  ChevronDown,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  Trash2,
  AlertCircle,
  Zap,
  Info,
  ChevronUp,
  Lightbulb,
  Check,
  Layers
} from 'lucide-react';

import { savePlanToDB, updatePlanInDB, getPlanById } from '../services/dbService';
import { auth } from '../firebase';
import PageLoadingState from '../components/PageLoadingState';
import { generateComplementaryMaterial } from '../services/aiService';
import { exportPlanToPdf } from '../services/export/pdf/pdfEngine';
import { exportPlanToWord } from '../services/export/word/wordEngine';
import { formatCurricularMarkdown } from '../services/export/curricularMarkdownFormatter';
import { formatMathForWeb } from '../utils/mathFormatter';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import StructuredPlanDocument from '../components/StructuredPlanDocument';
import RecursosPanel from '../components/RecursosPanel';
import SesionesPanel from '../components/sesiones/SesionesPanel';

export default function EditorPage() {
  const { 
    planGenerado, 
    setPlanGenerado, 
    apiKey, 
    sesionChatIA,
    clearChatIAModo, 
    addMensajeChatIA, 
    wizardData,
    activePlanMetadata,
    planStatus, 
    setPlanStatus, 
    setEstadoCambios,
    resetWizard, 
    userId, 
    userProfile,
    planId, 
    setPlanId, 
    recursosAnexos, 
    addRecursoAnexo, 
    removeRecursoAnexo,
    loadPlan,
    planesCount, 
    setPlanesCount 
  } = useAppStore();

  const currentMetadata = useMemo(() => activePlanMetadata || wizardData || {}, [activePlanMetadata, wizardData]);

  const [searchParams] = useSearchParams();
  const urlPlanId = searchParams.get('id');

  const [prompt, setPrompt] = useState('');
  const [chatMode, setChatMode] = useState('direct'); // 'direct' | 'socratic'
  const [showModeHelp, setShowModeHelp] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });

  // Separación estricta de canales para que cada modo muestre únicamente sus propios mensajes
  const directMessages = useMemo(() => {
    return (sesionChatIA || []).filter(m => {
      const modo = m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct');
      return modo === 'direct';
    });
  }, [sesionChatIA]);

  const socraticMessages = useMemo(() => {
    return (sesionChatIA || []).filter(m => {
      const modo = m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct');
      return modo === 'socratic';
    });
  }, [sesionChatIA]);

  const activeChatMessages = chatMode === 'direct' ? directMessages : socraticMessages;

  const handleClearCurrentModeChat = () => {
    if (clearChatIAModo) {
      clearChatIAModo(chatMode);
    }
  };

  const handleApplyPromptSuggestion = (text) => {
    setPrompt(text);
  };
  const [isModifying, setIsModifying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [editablePlan, setEditablePlan] = useState(planGenerado || '');
  const [activeMobileTab, setActiveMobileTab] = useState('doc'); // 'doc' | 'chat'
  const [activeDocumentView, setActiveDocumentView] = useState('todo'); // 'todo' | 'plan' | 'materiales'
  const [saveFeedback, setSaveFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [generatingRecId, setGeneratingRecId] = useState(null);
  const [currentGeneratingTypeKey, setCurrentGeneratingTypeKey] = useState(null);

  
  // Estado de visibilidad del co-docente IA con persistencia local
  const [isChatOpen, setIsChatOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return false; // En móvil y tablet inicia cerrado para priorizar la lectura del documento
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('inspiratec_chat_collapsed') !== 'true';
    }
    return true;
  });

  const openChat = () => {
    setIsChatOpen(true);
    setActiveMobileTab('chat');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('inspiratec_chat_collapsed', 'false');
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setActiveMobileTab('doc');
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('inspiratec_chat_collapsed', 'true');
    }
  };

  const toggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  // Modal states for complementary materials
  const [showMaterialMenu, setShowMaterialMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContentHtml, setModalContentHtml] = useState('');
  const [isGeneratingMaterial, setIsGeneratingMaterial] = useState(false);
  const [materialError, setMaterialError] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  
  const chatEndRef = useRef(null);
  const materialMenuRef = useRef(null);
  const navigate = useNavigate();

  const processedDoc = useMemo(() => {
    if (!planGenerado) return '';
    const formatted = formatCurricularMarkdown(planGenerado);
    return formatMathForWeb(formatted);
  }, [planGenerado]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (materialMenuRef.current && !materialMenuRef.current.contains(event.target)) {
        setShowMaterialMenu(false);
      }
    };
    if (showMaterialMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMaterialMenu]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [isModalOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sesionChatIA]);

  useEffect(() => {
    if (planGenerado) {
      setEditablePlan(planGenerado);
    }
  }, [planGenerado]);

  // Sincronización precisa y segura con el ID de la URL y Firestore
  useEffect(() => {
    let isCancelled = false;

    const syncPlan = async () => {
      // 1. Si no hay ID en la URL pero tenemos un planId activo persistido, sincronizamos la URL
      if (!urlPlanId && planId) {
        navigate(`/editor?id=${planId}`, { replace: true });
        return;
      }

      // 2. Si hay urlPlanId y coincide con el planId actual y el documento está en memoria:
      if (urlPlanId && planId === urlPlanId && planGenerado && planGenerado.trim().length > 20) {
        return;
      }

      // 3. Si hay urlPlanId y difiere de la sesión en memoria o falta el contenido:
      if (urlPlanId) {
        try {
          setIsLoadingPlan(true);
          setLoadError(null);
          const remotePlan = await getPlanById(urlPlanId);
          if (isCancelled) return;
          if (remotePlan) {
            loadPlan(remotePlan, remotePlan.markdown, remotePlan.id);
          } else {
            setLoadError(`No se encontró el plan de clase solicitado.`);
          }
        } catch (err) {
          if (isCancelled) return;
          console.warn("No se pudo cargar el plan desde Firestore:", err);
          setLoadError("No fue posible cargar el plan desde la base de datos.");
        } finally {
          if (!isCancelled) {
            setIsLoadingPlan(false);
          }
        }
      }
    };

    syncPlan();

    return () => {
      isCancelled = true;
    };
  }, [urlPlanId, planId, planGenerado, loadPlan, navigate]);

  const handleModify = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !apiKey || !planGenerado) return;

    const userMsg = prompt.trim();
    // Guardamos el mensaje asociándolo explícitamente al canal activo
    addMensajeChatIA({ role: 'user', text: userMsg, modo: chatMode });
    setPrompt('');
    setIsModifying(true);

    try {
      // Alimentamos a Gemini únicamente con el historial conversacional del canal activo
      const activeHistory = chatMode === 'direct' ? directMessages : socraticMessages;
      const result = await modifyPlan(apiKey, planGenerado, userMsg, chatMode, activeHistory);

      if (chatMode === 'direct') {
        if (result.planModificado) {
          setPlanGenerado(result.planModificado);
          setPlanStatus('modificado');
          setEstadoCambios(true);
        }
        addMensajeChatIA({ 
          role: 'ia', 
          text: result.textoDialogo,
          tipo: 'directo',
          modo: 'direct'
        });
      } else {
        // Modo Diálogo Socrático Guiado (Caro 2015)
        addMensajeChatIA({ 
          role: 'ia', 
          text: result.textoDialogo,
          tipo: 'socratico',
          modo: 'socratic',
          planSugerido: result.planModificado
        });
      }
    } catch (error) {
      addMensajeChatIA({ 
        role: 'ia', 
        text: "Hubo un error al procesar la indicación: " + error.message,
        tipo: chatMode === 'socratic' ? 'socratico' : 'directo',
        modo: chatMode
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleAplicarPropuestaSocratica = (planSugerido) => {
    if (!planSugerido) return;
    setPlanGenerado(planSugerido);
    setPlanStatus('modificado');
    setEstadoCambios(true);
    setSaveFeedback({ type: 'success', text: 'Ajuste socrático aplicado exitosamente al documento.' });
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const handleSaveToBackend = async () => {
    const effectiveUserId = userId || auth.currentUser?.uid || 'anon';
    
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      if (planId) {
        await updatePlanInDB(planId, planGenerado, recursosAnexos);
        setPlanStatus('guardado');
        setEstadoCambios(false);
        setSaveFeedback({ type: 'success', text: 'Cambios guardados en Mis Planes con éxito.' });
      } else {
        const newPlanId = await savePlanToDB(effectiveUserId, currentMetadata, planGenerado, recursosAnexos);
        setPlanId(newPlanId);
        setPlanStatus('guardado');
        setEstadoCambios(false);
        setPlanesCount((planesCount || 0) + 1);
        setSaveFeedback({ type: 'success', text: 'Plan guardado exitosamente en Mis Planes.' });
        navigate(`/editor?id=${newPlanId}`, { replace: true });
      }
      setTimeout(() => setSaveFeedback(null), 4000);
    } catch (e) {
      setSaveFeedback({ type: 'error', text: 'Error al guardar: ' + (e.message || 'Verifica la conexión.') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      await exportPlanToPdf({
        plan: {
          ...currentMetadata,
          recursosAnexos
        },
        markdown: planGenerado,
        userProfile,
        planId
      });
    } catch (err) {
      console.error('[INSPIRATEC PDF] Error al exportar:', err.message);
      alert(err.message || 'Error al generar el documento PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    if (isExportingWord) return;
    setIsExportingWord(true);

    try {
      await exportPlanToWord({
        plan: {
          ...currentMetadata,
          recursosAnexos
        },
        markdown: planGenerado,
        userProfile,
        planId
      });
    } catch (err) {
      console.error('[INSPIRATEC WORD] Error al exportar:', err.message);
      alert(err.message || 'Error al generar el documento de Word.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const [sesionConstructor, setSesionConstructor] = useState(null); // 'evaluacion' | 'clase' | null

  const handleGenerarRecurso = async (def) => {
    // Evaluaciones y clases con QR no son archivos HTML: abren su propio constructor
    if (def.accion) {
      setSesionConstructor(def.accion);
      return;
    }
    if (!apiKey) {
      setModalTitle(def.nombre);
      setModalContentHtml('');
      setMaterialError('Configura tu API Key en Configuración para generar recursos.');
      setIsGeneratingMaterial(false);
      setIsModalOpen(true);
      return;
    }
    setGeneratingRecId(def.typeKey);
    setModalTitle(def.nombre);
    setIsModalOpen(true);
    setIsGeneratingMaterial(true);
    setModalContentHtml('');
    setMaterialError('');

    try {
      const html = await generateComplementaryMaterial(apiKey, planGenerado, def.typeKey, '');
      const existentes = (recursosAnexos || []).filter(r => r.typeKey === def.typeKey).length;
      const title = existentes > 0 ? `${def.nombre} (${existentes + 1})` : def.nombre;
      const recurso = {
        id: `${def.typeKey}_${Date.now()}`,
        typeKey: def.typeKey,
        title,
        tipo: def.nombre,
        html,
        anexadoAt: new Date().toISOString()
      };
      setModalTitle(title);
      setModalContentHtml(html);
      addRecursoAnexo(recurso);
      if (planId) {
        try {
          await updatePlanInDB(planId, planGenerado, [...(recursosAnexos || []), recurso]);
        } catch (err) {
          console.error('Error al guardar el recurso en el plan:', err);
        }
      }
    } catch (e) {
      setMaterialError(e.message || 'No fue posible generar el recurso.');
    } finally {
      setIsGeneratingMaterial(false);
      setGeneratingRecId(null);
    }
  };

  const handleAbrirRecurso = (recurso) => {
    setModalTitle(recurso.title);
    setModalContentHtml(recurso.html);
    setMaterialError('');
    setIsGeneratingMaterial(false);
    setIsModalOpen(true);
  };

  const handleDescargarRecurso = (recurso) => {
    const blob = new Blob([recurso.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(recurso.title || 'recurso').replace(/[^\w\-áéíóúñÁÉÍÓÚÑ]+/g, '_')}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleQuitarRecurso = async (idx) => {
    removeRecursoAnexo(idx);
    const updated = (recursosAnexos || []).filter((_, i) => i !== idx);
    if (planId) {
      try {
        await updatePlanInDB(planId, planGenerado, updated);
      } catch (e) {
        console.error('Error al quitar el recurso del plan:', e);
      }
    }
  };

  const sesionesPanelProps = {
    abrir: sesionConstructor,
    onCerrarConstructor: () => setSesionConstructor(null),
    planGenerado,
    planId,
    tema: currentMetadata?.tema || '',
    apiKey,
    userId: userId || auth.currentUser?.uid || null,
    recursosAnexos: recursosAnexos || []
  };

  const recursosPanelProps = {
    recursosAnexos: recursosAnexos || [],
    isGenerating: isGeneratingMaterial,
    generatingKey: generatingRecId,
    onGenerate: handleGenerarRecurso,
    onOpen: handleAbrirRecurso,
    onDownload: handleDescargarRecurso,
    onRemove: handleQuitarRecurso
  };
  const downloadMaterialHtml = () => {
    const blob = new Blob([modalContentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modalTitle.replace(/ /g, '_')}.html`;
    a.click();
  };

  const handleAnexarAlPlan = async () => {
    if (!modalTitle || !modalContentHtml) {
      setIsModalOpen(false);
      return;
    }

    const nuevoRecurso = {
      title: modalTitle,
      html: modalContentHtml,
      tipo: modalTitle,
      anexadoAt: new Date().toISOString()
    };

    // 1. Guardar de inmediato en el store (se persiste en localStorage con persist middleware)
    addRecursoAnexo(nuevoRecurso);
    setIsModalOpen(false);

    // 2. Persistencia y sincronización automática inmediata con Firestore
    const currentList = Array.isArray(recursosAnexos) ? recursosAnexos : [];
    const updatedList = [...currentList.filter(r => r.title !== modalTitle), nuevoRecurso];

    if (planId) {
      try {
        await updatePlanInDB(planId, planGenerado, updatedList);
        setPlanStatus('guardado');
      } catch (err) {
        console.error("Error al actualizar anexo en Firestore:", err);
      }
    } else if (planGenerado) {
      try {
        const effectiveUserId = userId || auth.currentUser?.uid || 'anon';
        const newId = await savePlanToDB(effectiveUserId, currentMetadata, planGenerado, updatedList);
        setPlanId(newId);
        setPlanStatus('guardado');
        setPlanesCount((planesCount || 0) + 1);
        navigate(`/editor?id=${newId}`, { replace: true });
      } catch (err) {
        console.error("Error al autoguardar nuevo plan con anexo:", err);
      }
    }
  };

  if (!planGenerado && !isLoadingPlan && !urlPlanId) {
    return (
      <div className="editor-view" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="mgmt-header" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(71, 122, 114, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#142B25' }}>
            <BookOpen size={30} />
          </div>
          <span className="editorial-badge">Planificador Curricular</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#142B25', marginBottom: '12px', fontWeight: 700 }}>
            No hay una secuencia didáctica activa
          </h2>
          <p style={{ color: '#3D5A53', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px', maxWidth: '480px' }}>
            Dirígete al asistente de creación para configurar los objetivos curriculares y generar una propuesta con el co-docente de IA.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Crear nueva secuencia didáctica
          </button>
        </div>
      </div>
    );
  }



  const breadcrumbsItems = [
    { label: 'Inicio', href: '/home', onClick: (e) => { e.preventDefault(); navigate('/home'); } },
    { label: 'Mis Planes', href: '/mis-planes', onClick: (e) => { e.preventDefault(); navigate('/mis-planes'); } },
    { label: currentMetadata?.tema || 'Editor de Clase' }
  ];

  return (
    <div className="editor-view">
      
      {/* Migas de Pan para orientación jerárquica */}
      <div style={{ marginBottom: '14px' }}>
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      {/* Notificación no invasiva de estado de guardado */}
      {saveFeedback && (
        <div 
          role="status" 
          aria-live="polite"
          style={{
            marginBottom: '16px',
            padding: '12px 20px',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: saveFeedback.type === 'success' ? 'rgba(236, 253, 245, 0.95)' : 'rgba(254, 242, 242, 0.95)',
            color: saveFeedback.type === 'success' ? '#065F46' : '#991B1B',
            border: saveFeedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
        >
          {saveFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{saveFeedback.text}</span>
        </div>
      )}

      {/* Barra de Acciones Centralizada de Cristal Translúcido (Mismo desenfoque y estilo de Inicio) */}
      <header 
        className="editor-toolbar-card"
        style={{
          backgroundColor: 'rgba(255, 254, 250, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '22px',
          padding: '20px 28px',
          marginBottom: '14px',
          boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div className="editor-toolbar-meta">
          <div className="editor-title-row">
            <h1 className="editor-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', fontWeight: 700, letterSpacing: '-0.015em' }}>
              {currentMetadata?.tema || 'Secuencia Didáctica'}
            </h1>
            <span className={`editor-badge ${planStatus === 'guardado' ? 'saved' : 'draft'}`}>
              {planStatus === 'guardado' ? (
                <>
                  <CheckCircle2 size={13} /> Guardado en Mis Planes
                </>
              ) : planStatus === 'generado' ? (
                <>
                  <Sparkles size={13} /> Propuesta generada (sin guardar)
                </>
              ) : planStatus === 'modificado' ? (
                <>
                  <Clock size={13} /> Cambios pendientes por guardar
                </>
              ) : (
                <>
                  <Clock size={13} /> Borrador en edición
                </>
              )}
            </span>
          </div>
          <div className="editor-meta-tags">
            <span className="editor-meta-tag">
              <BookOpen size={13} /> {currentMetadata?.materia || 'General'}
            </span>
            <span className="editor-meta-tag">
              {currentMetadata?.grado || 'Sin grado'}
            </span>
            {currentMetadata?.duracion && (
              <span className="editor-meta-tag">
                <Clock size={13} /> {currentMetadata.duracion}
              </span>
            )}
          </div>
        </div>
        
        <div className="editor-toolbar-actions">
          {/* Botón Principal Guardar */}
          <button 
            className="btn btn-primary" 
            onClick={handleSaveToBackend}
            disabled={isSaving}
            style={{ minHeight: '40px', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} 
            <span>
              {isSaving 
                ? 'Guardando...' 
                : planStatus === 'guardado' 
                ? 'Guardado' 
                : planStatus === 'modificado' 
                ? 'Guardar cambios' 
                : 'Guardar en Mis Planes'}
            </span>
          </button>
          
          {/* Toggle Modo Edición Estructurada del Plan */}
          <button 
            className="editor-btn-pill" 
            style={{ 
              backgroundColor: isEditMode ? 'rgba(71, 122, 114, 0.18)' : undefined,
              borderColor: isEditMode ? 'rgba(71, 122, 114, 0.45)' : undefined,
              color: isEditMode ? '#142B25' : undefined
            }} 
            onClick={() => setIsEditMode(!isEditMode)}
            title={isEditMode ? "Ver documento pedagógico estructurado" : "Editar directamente los apartados y la secuencia didáctica del plan"}
          >
            {isEditMode ? <Eye size={15} /> : <Edit size={15} />}
            <span>{isEditMode ? 'Ver Documento' : 'Editar Plan'}</span>
          </button>

          {/* Exportación */}
          <div className="editor-btn-group">
            <button 
              className="editor-btn-pill" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '13px', 
                background: 'transparent', 
                border: 'none', 
                boxShadow: 'none',
                opacity: isExportingPdf ? 0.7 : 1,
                cursor: isExportingPdf ? 'wait' : 'pointer'
              }} 
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              title={isExportingPdf ? "Generando documento PDF profesional..." : "Descargar documento PDF oficial"}
            >
              {isExportingPdf ? <Loader2 size={15} className="spin" /> : <FileText size={15} />}
              <span>{isExportingPdf ? 'Generando...' : 'PDF'}</span>
            </button>
            <button 
              className="editor-btn-pill" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '13px', 
                background: 'transparent', 
                border: 'none', 
                boxShadow: 'none',
                opacity: isExportingWord ? 0.7 : 1,
                cursor: isExportingWord ? 'wait' : 'pointer'
              }} 
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              title={isExportingWord ? "Generando documento Word..." : "Descargar documento de Word"}
            >
              {isExportingWord ? <Loader2 size={15} className="spin" /> : <FileCode size={15} />}
              <span>{isExportingWord ? 'Generando...' : 'Word'}</span>
            </button>
          </div>

          <div className="editor-separator"></div>

          <button 
            className="editor-btn-pill" 
            style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#477A72' }} 
            onClick={() => { resetWizard(); navigate('/'); }}
            title="Iniciar nueva secuencia desde cero"
          >
            <PlusCircle size={16} /> <span>Nuevo</span>
          </button>

          {/* Acceso a Recursos */}
          <button
            type="button"
            className="btn btn-primary"
            style={{ minHeight: '40px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}
            onClick={() => setActiveDocumentView('materiales')}
          >
            <Sparkles size={15} />
            <span>Recursos</span>
          </button>

        </div>
      </header>

      {/* Selector de Vistas: Plan de Clase vs Materiales Didácticos vs Co-docente IA (Móvil, Tablet y Escritorio) */}
      <nav className="editor-doc-view-switcher" aria-label="Cambiar vista del documento, recursos y co-docente">
        <button 
          type="button"
          className={`editor-doc-view-btn ${activeDocumentView === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveDocumentView('todo')}
          title="Ver el documento completo de plan y recursos didácticos integrados"
        >
          <Layers size={15} /> <span>Todo el Plan</span>
        </button>
        <button 
          type="button"
          className={`editor-doc-view-btn ${activeDocumentView === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveDocumentView('plan')}
          title="Ver únicamente la secuencia didáctica del plan de clase"
        >
          <BookOpen size={15} /> <span>Plan de Clase</span>
        </button>
        <button 
          type="button"
          className={`editor-doc-view-btn ${activeDocumentView === 'materiales' ? 'active' : ''}`}
          onClick={() => setActiveDocumentView('materiales')}
          title="Generar y ver los recursos HTML del plan"
        >
          <Sparkles size={15} /> 
          <span>Recursos</span>
          {recursosAnexos && recursosAnexos.length > 0 && (
            <span className="editor-view-badge-count">{recursosAnexos.length}</span>
          )}
        </button>
        <button 
          type="button"
          className={`editor-doc-view-btn ${activeDocumentView === 'chat' ? 'active' : ''}`}
          onClick={() => {
            setActiveDocumentView('chat');
            setIsChatOpen(true);
            setActiveMobileTab('chat');
          }}
          title="Conversar y calibrar la secuencia didáctica con el co-docente de Inteligencia Artificial"
        >
          <MessageSquare size={15} style={{ color: activeDocumentView === 'chat' ? '#5EEAD4' : '#D4AF37' }} /> 
          <span>Co-docente IA</span>
          {sesionChatIA && sesionChatIA.length > 0 && (
            <span className="editor-view-badge-count">{sesionChatIA.length}</span>
          )}
        </button>
      </nav>

      {/* Espacio de Trabajo: Documento Principal + Co-docente IA */}
      <div 
        className={`editor-workspace mobile-view-${activeMobileTab} ${!isChatOpen ? 'chat-collapsed' : 'chat-open'}`}
        style={{ position: 'relative', zIndex: isChatOpen ? 1500 : 20 }}
      >
        
        {/* Panel del Documento Principal */}
        <div 
          className="editor-doc-pane"
        >
          <div 
            className="editor-doc-card"
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.90)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '22px',
              boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {isLoadingPlan ? (
              <PageLoadingState 
                icon={FileText}
                badge="Documento Curricular"
                title="Recuperando secuencia pedagógica..."
                subtitle="Sincronizando la planeación y materiales desde la base de datos oficial."
                compact
                minHeight="280px"
              />
            ) : loadError ? (
              <div style={{ padding: '72px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <AlertCircle size={30} />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#142B25', marginBottom: '8px' }}>
                  {loadError}
                </h3>
                <p style={{ fontSize: '14px', color: '#576864', maxWidth: '420px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                  El documento solicitado no pudo ser recuperado. Puedes consultar tu lista de planes guardados o iniciar una nueva clase.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/mis-planes')}>
                    Ir a Mis Planes
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate('/planificador')}>
                    Ir al Planificador
                  </button>
                </div>
              </div>
            ) : !planGenerado ? (
              <div style={{ padding: '72px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(71, 122, 114, 0.12)', color: '#315B54', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <BookOpen size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#142B25', marginBottom: '8px' }}>
                  No hay una planeación activa en el Editor
                </h3>
                <p style={{ fontSize: '14px', color: '#576864', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                  Utiliza el Planificador para diseñar una nueva secuencia didáctica con asistencia de IA o abre un plan existente desde tu biblioteca.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/planificador')}>
                    Crear Nueva Clase
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/mis-planes')}>
                    Ver Mis Planes
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '1020px', width: '100%', margin: '0 auto', padding: '8px 4px', boxSizing: 'border-box' }}>
                {/* 1. Vista exclusiva de Recursos */}
                {activeDocumentView === 'materiales' && (
                  <div className="editor-materials-standalone-view">
                    <RecursosPanel {...recursosPanelProps} />
                    <SesionesPanel {...sesionesPanelProps} />
                  </div>
                )}

                {/* 2. Apartado Co-docente IA cuando se visualiza 'chat' */}
                {activeDocumentView === 'chat' && (
                  <div className="editor-chat-standalone-view" style={{ maxWidth: '880px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="editor-chat-header" style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#142B25', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
                          <Sparkles size={20} style={{ color: '#D4AF37' }} /> Co-docente IA — Asistente Pedagógico
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="editor-chat-online-badge">
                            <span className="editor-chat-online-dot" />
                            En línea
                          </span>
                        </div>
                      </div>

                      {/* Selector de Modalidad Pedagógica: Pestañas separadas */}
                      <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(49, 91, 84, 0.08)', padding: '4px', borderRadius: '12px' }} role="tablist" aria-label="Modalidad del co-docente">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={chatMode === 'direct'}
                          onClick={() => setChatMode('direct')}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: '12.5px',
                            fontWeight: chatMode === 'direct' ? 700 : 500,
                            backgroundColor: chatMode === 'direct' ? '#FFFFFF' : 'transparent',
                            color: chatMode === 'direct' ? '#142B25' : '#477A72',
                            border: 'none',
                            borderRadius: '9px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: chatMode === 'direct' ? '0 1px 4px rgba(16, 36, 32, 0.10)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title="Modo directo: reescribe y ajusta el documento inmediatamente"
                        >
                          <Zap size={14} color={chatMode === 'direct' ? '#315B54' : '#477A72'} />
                          <span>Directo</span>
                          {directMessages.length > 0 && (
                            <span className="editor-chat-tab-badge">{directMessages.length}</span>
                          )}
                        </button>

                        <button
                          type="button"
                          role="tab"
                          aria-selected={chatMode === 'socratic'}
                          onClick={() => setChatMode('socratic')}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: '12.5px',
                            fontWeight: chatMode === 'socratic' ? 700 : 500,
                            backgroundColor: chatMode === 'socratic' ? '#FFFFFF' : 'transparent',
                            color: chatMode === 'socratic' ? '#142B25' : '#477A72',
                            border: 'none',
                            borderRadius: '9px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: chatMode === 'socratic' ? '0 1px 4px rgba(16, 36, 32, 0.10)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title="Modo socrático: diálogo reflexivo con preguntas orientadoras y propuesta guiada (Caro 2015)"
                        >
                          <Lightbulb size={14} color={chatMode === 'socratic' ? '#D97706' : '#477A72'} />
                          <span>Socrático</span>
                          {socraticMessages.length > 0 && (
                            <span className="editor-chat-tab-badge" style={{ backgroundColor: 'rgba(217, 119, 6, 0.18)', color: '#92400E' }}>
                              {socraticMessages.length}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Botón interactivo para ver la explicación detallada de funcionalidad y limpiar canal */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setShowModeHelp(prev => !prev)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '2px 0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: chatMode === 'socratic' ? '#B45309' : '#315B54',
                            cursor: 'pointer'
                          }}
                        >
                          <Info size={13} />
                          <span>¿Cómo funciona el modo {chatMode === 'direct' ? 'Directo' : 'Socrático'}?</span>
                          {showModeHelp ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {activeChatMessages.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearCurrentModeChat}
                            style={{
                              background: 'none',
                              border: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              color: '#718096',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                            title={`Limpiar mensajes del canal ${chatMode === 'direct' ? 'Directo' : 'Socrático'}`}
                          >
                            <Trash2 size={12} />
                            <span>Limpiar conversación</span>
                          </button>
                        )}
                      </div>

                      {showModeHelp && (
                        <div className={`editor-chat-explanation-card ${chatMode}`} style={{ marginTop: '8px' }}>
                          {chatMode === 'direct' ? (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, marginBottom: '3px', color: '#183630' }}>
                                <Zap size={12} color="#315B54" />
                                <span>Edición Ejecutiva Inmediata</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '11.5px', color: '#2D3748', lineHeight: '1.45' }}>
                                <strong>¿Para qué sirve?</strong> Aplica tus órdenes pedagógicas directamente en el texto del plan de clase. Ideal para redactar rúbricas, reajustar tiempos o enriquecer actividades de inmediato.
                              </p>
                              <div style={{ marginTop: '6px', fontSize: '11px', color: '#4A5568', fontWeight: 600 }}>
                                Sugerencias rápidas (haz clic para usar):
                              </div>
                              <div className="editor-chat-chips-container">
                                <button type="button" className="editor-chat-chip" onClick={() => handleApplyPromptSuggestion('Añade una rúbrica analítica con escala valorativa de 1 a 5')}>
                                  + Rúbrica analítica
                                </button>
                                <button type="button" className="editor-chat-chip" onClick={() => handleApplyPromptSuggestion('Ajusta el tiempo de la fase de inicio a 15 min y agrega una lluvia de ideas')}>
                                  + Ajustar tiempos y lluvia de ideas
                                </button>
                                <button type="button" className="editor-chat-chip" onClick={() => handleApplyPromptSuggestion('Incluye una pausa activa socioemocional de 5 minutos en el desarrollo')}>
                                  + Pausa socioemocional
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, marginBottom: '3px', color: '#92400E' }}>
                                <Lightbulb size={12} color="#D97706" />
                                <span>Diálogo Socrático & Agencia Compartida</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '11.5px', color: '#78350F', lineHeight: '1.45' }}>
                                <strong>¿Para qué sirve?</strong> Actúa como un co-docente crítico. Analiza contigo la coherencia didáctica, transposición y DUA/PIAR planteando preguntas reflexivas. Si formula una propuesta de cambio, tú decides libremente si aplicarla.
                              </p>
                              <div style={{ marginTop: '6px', fontSize: '11px', color: '#92400E', fontWeight: 600 }}>
                                Preguntas pedagógicas sugeridas:
                              </div>
                              <div className="editor-chat-chips-container">
                                <button type="button" className="editor-chat-chip socratic" onClick={() => handleApplyPromptSuggestion('¿Cómo puedo activar saberes previos con una rutina de pensamiento?')}>
                                  🤔 Activar saberes previos
                                </button>
                                <button type="button" className="editor-chat-chip socratic" onClick={() => handleApplyPromptSuggestion('¿Qué posibles barreras de aprendizaje DUA podrían presentarse en el desarrollo?')}>
                                  🔍 Analizar barreras DUA
                                </button>
                                <button type="button" className="editor-chat-chip socratic" onClick={() => handleApplyPromptSuggestion('¿Es coherente la evaluación formativa con los estándares MEN del grado?')}>
                                  ⚖️ Coherencia evaluativa
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mensajes del Chat */}
                    <div className="editor-chat-messages" style={{ minHeight: '320px', maxHeight: '500px', overflowY: 'auto', padding: '12px 4px', marginBottom: '16px' }}>
                      {activeChatMessages.length === 0 && (
                        <div className="editor-chat-welcome-bubble" style={chatMode === 'socratic' ? { background: 'rgba(255, 251, 235, 0.90)', borderColor: 'rgba(217, 119, 6, 0.3)' } : undefined}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: chatMode === 'socratic' ? '#92400E' : '#142B25', marginBottom: '6px' }}>
                            {chatMode === 'direct' ? (
                              <>
                                <Zap size={15} color="#315B54" />
                                <span>Canal de Edición Directa</span>
                              </>
                            ) : (
                              <>
                                <Lightbulb size={15} color="#D97706" />
                                <span>Canal de Diálogo Socrático</span>
                              </>
                            )}
                          </div>
                          {chatMode === 'direct' ? (
                            <div>
                              Escribe la instrucción puntual que deseas aplicar y actualizaré el documento en tiempo real.
                              <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(49, 91, 84, 0.4)', fontStyle: 'italic', fontSize: '12.5px' }}>
                                "Agrega una escala valorativa de 3 niveles a la evaluación" o "Cambia el inicio por un estudio de caso".
                              </div>
                            </div>
                          ) : (
                            <div>
                              Conversemos reflexivamente sobre el diseño didáctico, barreras de inclusión DUA o adecuación curricular.
                              <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(217, 119, 6, 0.5)', fontStyle: 'italic', fontSize: '12.5px', color: '#78350F' }}>
                                "¿Cómo dialoga esta actividad con estudiantes con ritmos diversos?" o "¿Qué preguntas de metacognición recomiendas?".
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeChatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={msg.role === 'user' ? 'editor-chat-msg-user' : 'editor-chat-msg-ia'}
                          style={msg.tipo === 'socratico' || msg.modo === 'socratic' ? { borderLeft: '3px solid #D97706', backgroundColor: 'rgba(255, 251, 235, 0.90)' } : undefined}
                        >
                          {msg.role === 'ia' && (
                            <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '11px', 
                              fontWeight: 800, 
                              color: (msg.tipo === 'socratico' || msg.modo === 'socratic') ? '#92400E' : '#315B54', 
                              textTransform: 'uppercase', 
                              marginBottom: '6px', 
                              letterSpacing: '0.04em' 
                            }}>
                              {(msg.tipo === 'socratico' || msg.modo === 'socratic') ? (
                                <>
                                  <Lightbulb size={12} color="#D97706" /> Diálogo Socrático
                                </>
                              ) : (
                                <>
                                  <Zap size={12} color="#315B54" /> Edición Directa
                                </>
                              )}
                            </div>
                          )}
                          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>{msg.text}</div>

                          {msg.planSugerido && (
                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(49, 91, 84, 0.16)' }}>
                              <button
                                type="button"
                                onClick={() => handleAplicarPropuestaSocratica(msg.planSugerido)}
                                className="btn btn-primary"
                                style={{ fontSize: '12.5px', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#D97706', borderColor: '#B45309' }}
                              >
                                <Check size={14} />
                                <span>Aplicar propuesta al plan</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {isModifying && (
                        <div className="editor-chat-msg-ia" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#142B25', fontWeight: 500, padding: '14px' }}>
                          <Loader2 size={18} className="spin" style={{ color: chatMode === 'socratic' ? '#D97706' : '#315B54' }} />
                          <span>{chatMode === 'socratic' ? 'Elaborando diálogo socrático reflexivo...' : 'Reescribiendo la secuencia pedagógica...'}</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Formulario de Entrada */}
                    <form onSubmit={handleModify} className="editor-chat-input-bar" style={{ width: '100%', boxSizing: 'border-box' }}>
                      <input 
                        type="text" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        placeholder={chatMode === 'direct' ? "Escribe qué deseas modificar en el plan..." : "Pregúntale algo sobre la secuencia didáctica..."} 
                        disabled={isModifying || !apiKey}
                        style={{ flex: 1, minHeight: '44px', fontSize: '14px', padding: '10px 14px' }}
                      />
                      <button 
                        type="submit" 
                        disabled={isModifying || !prompt.trim() || !apiKey} 
                        className="btn btn-primary"
                        style={{ minHeight: '44px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {isModifying ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                        <span className="mobile-hide-text">Enviar</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. Modos que incluyen el Plan Estructurado ('plan' o 'todo') */}
                {(activeDocumentView === 'plan' || activeDocumentView === 'todo') && (
                  <StructuredPlanDocument 
                    markdown={processedDoc}
                    isEditing={isEditMode}
                    onSave={(newMarkdown) => {
                      setPlanGenerado(newMarkdown);
                      setPlanStatus('modificado');
                      setEstadoCambios(true);
                      setIsEditMode(false);
                      setSaveFeedback({ type: 'success', text: 'Cambios aplicados exitosamente al documento.' });
                      setTimeout(() => setSaveFeedback(null), 3500);
                    }}
                    onCancel={() => {
                      setIsEditMode(false);
                    }}
                  />
                )}

                {/* 3. Recursos al final cuando se visualiza 'todo' */}
                {!isEditMode && activeDocumentView === 'todo' && (
                  <div style={{ marginTop: '36px' }}>
                    <RecursosPanel {...recursosPanelProps} />
                    <SesionesPanel {...sesionesPanelProps} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Panel Lateral: Asistente Co-docente IA */}
        <aside 
          className={`editor-chat-pane ${!isChatOpen ? 'is-collapsed' : ''}`}
          style={{ zIndex: 2000 }}
          aria-hidden={!isChatOpen}
        >
          <div 
            className="editor-chat-card"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(49, 91, 84, 0.22)',
              borderRadius: '24px',
              boxShadow: '0 16px 48px rgba(16, 36, 32, 0.20), 0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            
            <div className="editor-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: '#142B25', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
                  <Sparkles size={17} style={{ color: '#D4AF37' }} /> Co-docente IA
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="editor-chat-online-badge">
                    <span className="editor-chat-online-dot" />
                    En línea
                  </span>
                  <button 
                    type="button" 
                    className="editor-chat-close-btn" 
                    onClick={toggleChat}
                    aria-label="Cerrar panel del co-docente IA"
                    title="Cerrar panel del co-docente IA"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Selector de Modalidad Pedagógica: Pestañas separadas con contadores de mensajes */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(49, 91, 84, 0.08)', padding: '3px', borderRadius: '10px' }} role="tablist" aria-label="Modalidad del co-docente">
                <button
                  type="button"
                  role="tab"
                  aria-selected={chatMode === 'direct'}
                  onClick={() => setChatMode('direct')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    fontSize: '11.5px',
                    fontWeight: chatMode === 'direct' ? 700 : 500,
                    backgroundColor: chatMode === 'direct' ? '#FFFFFF' : 'transparent',
                    color: chatMode === 'direct' ? '#142B25' : '#477A72',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: chatMode === 'direct' ? '0 1px 3px rgba(16, 36, 32, 0.10)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Modo directo: reescribe y ajusta el documento inmediatamente"
                >
                  <Zap size={12} color={chatMode === 'direct' ? '#315B54' : '#477A72'} />
                  <span>Directo</span>
                  {directMessages.length > 0 && (
                    <span className="editor-chat-tab-badge">{directMessages.length}</span>
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={chatMode === 'socratic'}
                  onClick={() => setChatMode('socratic')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    fontSize: '11.5px',
                    fontWeight: chatMode === 'socratic' ? 700 : 500,
                    backgroundColor: chatMode === 'socratic' ? '#FFFFFF' : 'transparent',
                    color: chatMode === 'socratic' ? '#142B25' : '#477A72',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: chatMode === 'socratic' ? '0 1px 3px rgba(16, 36, 32, 0.10)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Modo socrático: diálogo reflexivo con preguntas orientadoras y propuesta guiada (Caro 2015)"
                >
                  <Lightbulb size={12} color={chatMode === 'socratic' ? '#D97706' : '#477A72'} />
                  <span>Socrático</span>
                  {socraticMessages.length > 0 && (
                    <span className="editor-chat-tab-badge" style={{ backgroundColor: 'rgba(217, 119, 6, 0.18)', color: '#92400E' }}>
                      {socraticMessages.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Botón interactivo para ver la explicación detallada de funcionalidad y limpiar canal */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModeHelp(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px 0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: chatMode === 'socratic' ? '#B45309' : '#315B54',
                    cursor: 'pointer'
                  }}
                  title="Ver explicación y funcionamiento de esta modalidad"
                >
                  <Info size={12} />
                  <span>¿Cómo funciona el modo {chatMode === 'direct' ? 'Directo' : 'Socrático'}?</span>
                  {showModeHelp ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>

                {activeChatMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCurrentModeChat}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10.5px',
                      color: '#718096',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                    title={`Limpiar mensajes del canal ${chatMode === 'direct' ? 'Directo' : 'Socrático'}`}
                  >
                    <Trash2 size={11} />
                    <span>Limpiar canal</span>
                  </button>
                )}
              </div>

              {/* Tarjeta Explicativa Detallada de la Funcionalidad por Modo */}
              {showModeHelp && (
                <div className={`editor-chat-explanation-card ${chatMode}`}>
                  {chatMode === 'direct' ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, marginBottom: '3px', color: '#183630' }}>
                        <Zap size={12} color="#315B54" />
                        <span>Edición Ejecutiva Inmediata</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#2D3748', lineHeight: '1.4' }}>
                        <strong>¿Para qué sirve?</strong> Aplica tus órdenes pedagógicas directamente en el texto del plan de clase sin confirmaciones previas. Ideal para redactar rúbricas, reajustar tiempos o enriquecer actividades de inmediato.
                      </p>
                      <div style={{ marginTop: '5px', fontSize: '10.5px', color: '#4A5568', fontWeight: 600 }}>
                        Sugerencias rápidas (haz clic para usar):
                      </div>
                      <div className="editor-chat-chips-container">
                        <button 
                          type="button"
                          className="editor-chat-chip"
                          onClick={() => handleApplyPromptSuggestion('Añade una rúbrica analítica con escala valorativa de 1 a 5')}
                        >
                          + Rúbrica analítica
                        </button>
                        <button 
                          type="button"
                          className="editor-chat-chip"
                          onClick={() => handleApplyPromptSuggestion('Ajusta el tiempo de la fase de inicio a 15 min y agrega una lluvia de ideas')}
                        >
                          + Ajustar tiempos y lluvia de ideas
                        </button>
                        <button 
                          type="button"
                          className="editor-chat-chip"
                          onClick={() => handleApplyPromptSuggestion('Incluye una pausa activa socioemocional de 5 minutos en el desarrollo')}
                        >
                          + Pausa socioemocional
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, marginBottom: '3px', color: '#92400E' }}>
                        <Lightbulb size={12} color="#D97706" />
                        <span>Diálogo Socrático & Agencia Compartida</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#78350F', lineHeight: '1.4' }}>
                        <strong>¿Para qué sirve?</strong> Actúa como un co-docente crítico. No sobreescribe tu diseño de forma pasiva; analiza la coherencia didáctica, transposición y DUA/PIAR contigo y te plantea preguntas orientadoras. Si formula una propuesta de cambio, tú decides libremente si deseas aplicarla al plan con el botón "Aplicar propuesta".
                      </p>
                      <div style={{ marginTop: '5px', fontSize: '10.5px', color: '#92400E', fontWeight: 600 }}>
                        Preguntas pedagógicas sugeridas:
                      </div>
                      <div className="editor-chat-chips-container">
                        <button 
                          type="button"
                          className="editor-chat-chip socratic"
                          onClick={() => handleApplyPromptSuggestion('¿Cómo puedo activar saberes previos con una rutina de pensamiento?')}
                        >
                          🤔 Activar saberes previos
                        </button>
                        <button 
                          type="button"
                          className="editor-chat-chip socratic"
                          onClick={() => handleApplyPromptSuggestion('¿Qué posibles barreras de aprendizaje DUA podrían presentarse en el desarrollo?')}
                        >
                          🔍 Analizar barreras DUA
                        </button>
                        <button 
                          type="button"
                          className="editor-chat-chip socratic"
                          onClick={() => handleApplyPromptSuggestion('¿Es coherente la evaluación formativa con los estándares MEN del grado?')}
                        >
                          ⚖️ Coherencia evaluativa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Mensajes del Chat: Canal Separado Activo */}
            <div className="editor-chat-messages">
              {activeChatMessages.length === 0 && (
                <div className="editor-chat-welcome-bubble" style={chatMode === 'socratic' ? { background: 'rgba(255, 251, 235, 0.90)', borderColor: 'rgba(217, 119, 6, 0.3)' } : undefined}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: chatMode === 'socratic' ? '#92400E' : '#142B25', marginBottom: '4px' }}>
                    {chatMode === 'direct' ? (
                      <>
                        <Zap size={14} color="#315B54" />
                        <span>Canal de Edición Directa</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb size={14} color="#D97706" />
                        <span>Canal de Diálogo Socrático</span>
                      </>
                    )}
                  </div>
                  {chatMode === 'direct' ? (
                    <div>
                      Escribe la instrucción puntual que deseas aplicar y actualizaré el documento en tiempo real.
                      <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(49, 91, 84, 0.4)', fontStyle: 'italic', fontSize: '12px' }}>
                        "Agrega una escala valorativa de 3 niveles a la evaluación" o "Cambia el inicio por un estudio de caso".
                      </div>
                    </div>
                  ) : (
                    <div>
                      Conversemos reflexivamente sobre el diseño didáctico, barreras de inclusión DUA o adecuación curricular.
                      <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(217, 119, 6, 0.5)', fontStyle: 'italic', fontSize: '12px', color: '#78350F' }}>
                        "¿Cómo dialoga esta actividad con estudiantes con ritmos diversos?" o "¿Qué preguntas de metacognición recomiendas?".
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeChatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={msg.role === 'user' ? 'editor-chat-msg-user' : 'editor-chat-msg-ia'}
                  style={msg.tipo === 'socratico' || msg.modo === 'socratic' ? { borderLeft: '3px solid #D97706', backgroundColor: 'rgba(255, 251, 235, 0.90)' } : undefined}
                >
                  {msg.role === 'ia' && (
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '10.5px', 
                      fontWeight: 800, 
                      color: (msg.tipo === 'socratico' || msg.modo === 'socratic') ? '#92400E' : '#315B54', 
                      textTransform: 'uppercase', 
                      marginBottom: '6px', 
                      letterSpacing: '0.04em' 
                    }}>
                      {(msg.tipo === 'socratico' || msg.modo === 'socratic') ? (
                        <>
                          <Lightbulb size={11} color="#D97706" /> Diálogo Socrático
                        </>
                      ) : (
                        <>
                          <Zap size={11} color="#315B54" /> Edición Directa
                        </>
                      )}
                    </div>
                  )}
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.text}</div>

                  {msg.planSugerido && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(49, 91, 84, 0.16)' }}>
                      <button
                        type="button"
                        onClick={() => handleAplicarPropuestaSocratica(msg.planSugerido)}
                        className="btn btn-primary"
                        style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#D97706', borderColor: '#B45309' }}
                      >
                        <Check size={13} />
                        <span>Aplicar propuesta al plan</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isModifying && (
                <div className="editor-chat-msg-ia" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#142B25', fontWeight: 500 }}>
                  <Loader2 size={16} className="spin" style={{ color: chatMode === 'socratic' ? '#D97706' : '#315B54' }} />
                  <span>{chatMode === 'socratic' ? 'Elaborando diálogo socrático reflexivo...' : 'Reescribiendo la secuencia pedagógica...'}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Formulario de Entrada con Botón y Placeholder según Modalidad */}
            <form onSubmit={handleModify} className="editor-chat-input-bar">
              <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder={chatMode === 'direct' ? "Instrucción de cambio directo (ej: Añade una rúbrica analítica)..." : "Pregunta pedagógica o reflexión socrática..."} 
                className="editor-chat-input"
                disabled={isModifying || isEditMode}
                aria-label="Instrucción para el co-docente de IA"
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  padding: '0 14px', 
                  minHeight: '40px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: chatMode === 'socratic' ? '#D97706' : undefined,
                  borderColor: chatMode === 'socratic' ? '#B45309' : undefined
                }} 
                disabled={isModifying || isEditMode || !prompt.trim()}
                title={chatMode === 'direct' ? "Aplicar cambio directo" : "Enviar consulta socrática"}
              >
                {chatMode === 'direct' ? <Zap size={15} /> : <Send size={15} />}
              </button>
            </form>
            {isEditMode && (
              <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '8px', padding: '4px 8px', backgroundColor: 'rgba(254, 242, 242, 0.8)', borderRadius: '6px' }}>
                Desactiva el modo de edición de código para interactuar con el co-docente IA.
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop para móvil y tablet al abrir Co-docente IA */}
        {isChatOpen && (
          <div 
            className="editor-chat-mobile-backdrop" 
            onClick={toggleChat}
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Botón flotante accesible solo en escritorio si el panel está cerrado y no estamos en la pestaña chat */}
      {!isChatOpen && activeDocumentView !== 'chat' && (
        <button 
          type="button" 
          className="editor-floating-chat-trigger desktop-only-floating-btn"
          onClick={openChat}
          aria-label="Abrir panel del co-docente didáctico"
          title="Abrir panel del co-docente IA para conversar o ajustar"
        >
          <Sparkles size={16} style={{ color: '#D4AF37' }} />
          <span>Co-docente IA</span>
          {sesionChatIA.length > 0 && (
            <span className="editor-badge-chat-count">{sesionChatIA.length}</span>
          )}
        </button>
      )}
      
      {/* Modal para Material Complementario HTML montado en body con Portal para que los menús queden atrás con desenfoque */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="editor-modal-backdrop" 
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="material-modal-title"
        >
          <div className="editor-modal-card">
            
            {/* Header del Modal */}
            <div className="modal-glass-header" style={{ padding: '18px 26px' }}>
              <h3 id="material-modal-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                <Sparkles size={18} style={{ color: '#D4AF37' }} /> {modalTitle}
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!isGeneratingMaterial && modalContentHtml && !materialError && (
                  <>
                    {!recursosAnexos.some(r => r.title === modalTitle) && (
                      <button onClick={handleAnexarAlPlan} className="editor-btn-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px' }}>
                        <PlusCircle size={15} /> Anexar al Plan
                      </button>
                    )}
                    <button onClick={downloadMaterialHtml} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '13px' }}>
                      <Download size={15} /> Descargar HTML
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="modal-glass-close-btn"
                  aria-label="Cerrar modal de material"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div style={{ padding: 0, overflow: 'hidden', flex: 1, backgroundColor: '#FFF', display: 'flex', minHeight: '520px' }}>
              {isGeneratingMaterial ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'var(--text-secondary)', gap: '16px', padding: '48px', textAlign: 'center' }}>
                  <Loader2 size={44} className="spin" style={{ color: 'var(--primary-sage)' }} />
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '6px' }}>Generando material</h4>
                    <p style={{ fontSize: '13.5px', margin: '0 auto' }}>Puede tardar hasta un minuto.</p>
                  </div>
                </div>
              ) : materialError ? (
                <div role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '48px', textAlign: 'center', color: 'var(--error-color)' }}>
                  {materialError}
                </div>
              ) : (
                <iframe 
                  srcDoc={modalContentHtml}
                  sandbox="allow-scripts"
                  style={{ width: '100%', height: '100%', minHeight: '520px', border: 'none', backgroundColor: '#FFF' }}
                  title="Material Generado"
                />
              )}
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
