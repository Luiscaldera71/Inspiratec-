import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { generatePlan, suggestObjectives, suggestStandards } from '../services/aiService';
import { getGenericTemplateForArea, normalizeAreaName, GENERIC_TEMPLATES } from '../services/templates/genericTemplates';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Check, 
  Eye, 
  VolumeX, 
  Accessibility, 
  ShieldCheck, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

import ConfirmModal from '../components/ConfirmModal';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

// Subcomponentes modulares de cada fase pedagógica
import WizardStep1Basicos from '../components/wizard/WizardStep1Basicos';
import WizardStep2Metodologia from '../components/wizard/WizardStep2Metodologia';
import WizardStep3Estandares from '../components/wizard/WizardStep3Estandares';
import WizardStep4Inclusion from '../components/wizard/WizardStep4Inclusion';

export default function WizardPage() {
  const { 
    wizardData, 
    wizardStep,
    setWizardStep,
    saveWizardProgress,
    updateWizardData, 
    clearWizardFormOnly,
    apiKey, 
    misPlantillas,
    completePlanGeneration,
    userProfile
  } = useAppStore();
  const navigate = useNavigate();

  // El paso inicial se recupera del estado persistido para preservar el avance del docente
  const [step, setStep] = useState(() => wizardStep || 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [saveFeedback, setSaveFeedback] = useState(null);
  const [isSuggestingObj, setIsSuggestingObj] = useState(false);
  const [isSuggestingStd, setIsSuggestingStd] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showClearModal, setShowClearModal] = useState(false);

  // Sincronizar el paso local con el paso persistido en store
  useEffect(() => {
    if (wizardStep && wizardStep !== step) {
      setStep(wizardStep);
    }
  }, [wizardStep]);

  const handleSaveProgress = () => {
    saveWizardProgress(wizardData, step);
    setSaveFeedback(`Progreso guardado (Fase ${step})`);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const validateStep1 = () => {
    const errors = {};
    if (!wizardData.tema || !wizardData.tema.trim()) {
      errors.tema = "Por favor indica el tema o nombre de la clase.";
    }
    if (!wizardData.recursos || !wizardData.recursos.trim()) {
      errors.recursos = "Por favor describe los recursos didácticos o ambiente disponible.";
    }
    return errors;
  };

  const handleNext = () => {
    if (step === 1) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
    }

    const nextStep = Math.min(step + 1, 4);
    setStep(nextStep);
    setWizardStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePrev = () => {
    const prevStep = Math.max(step - 1, 1);
    setStep(prevStep);
    setWizardStep(prevStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpiar error reactivamente al editar
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (type === 'checkbox') {
      const arr = wizardData[name] || [];
      if (checked) updateWizardData({ [name]: [...arr, value] });
      else updateWizardData({ [name]: arr.filter(item => item !== value) });
    } else {
      if (name === 'materia') {
        const canonical = normalizeAreaName(value);
        const isGenericCurrent = !wizardData.formato || 
          GENERIC_TEMPLATES.some(gt => gt.titulo === wizardData.formato);
        
        if (isGenericCurrent && !wizardData.formatoInstrucciones) {
          const autoTemplate = getGenericTemplateForArea(canonical);
          updateWizardData({ 
            materia: value, 
            recursos: '',
            formato: autoTemplate.titulo,
            formatoInstrucciones: ''
          });
        } else {
          updateWizardData({ [name]: value, recursos: '' });
        }
      } else if (name === 'formato') {
        const matchedCustom = misPlantillas?.find(p => p.titulo === value);
        if (matchedCustom && matchedCustom.instrucciones) {
          updateWizardData({
            formato: matchedCustom.titulo,
            formatoInstrucciones: matchedCustom.instrucciones,
            recursos: ''
          });
        } else {
          updateWizardData({
            formato: value,
            formatoInstrucciones: '',
            recursos: ''
          });
        }
      } else {
        updateWizardData({ [name]: value });
      }
    }
  };

  const handleSuggestObjectives = async () => {
    if (!apiKey) {
      setSuggestionError("Configura tu API Key de Gemini en Configuración para usar la asistencia pedagógica.");
      return;
    }
    setSuggestionError(null);
    setIsSuggestingObj(true);
    try {
      const text = await suggestObjectives(apiKey, wizardData);
      updateWizardData({ objetivos: text });
    } catch (e) {
      setSuggestionError(e.message || "No fue posible sugerir objetivos en este momento.");
    } finally {
      setIsSuggestingObj(false);
    }
  };

  const handleSuggestStandards = async () => {
    if (!apiKey) {
      setSuggestionError("Configura tu API Key de Gemini en Configuración para consultar referentes curriculares.");
      return;
    }
    setSuggestionError(null);
    setIsSuggestingStd(true);
    try {
      const text = await suggestStandards(apiKey, wizardData);
      updateWizardData({ estandaresMEN: [text] }); 
    } catch (e) {
      setSuggestionError(e.message || "No fue posible sugerir estándares curriculares.");
    } finally {
      setIsSuggestingStd(false);
    }
  };

  // Generación guiada del plan: NO persiste automáticamente en la base de datos hasta que el docente revise en el Editor
  const handleGenerate = async () => {
    if (isGenerating) return;

    if (!apiKey) {
      setGenerationError("Por favor configura tu API Key de Gemini en Configuración para generar secuencias con IA.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);

    let plan = '';
    let metadataSnapshot = null;

    try {
      metadataSnapshot = { ...wizardData };
      plan = await generatePlan(apiKey, wizardData, misPlantillas, userProfile);

      if (!plan || typeof plan !== 'string' || plan.trim().length < 60) {
        throw new Error("El servicio de IA no generó una respuesta estructurada válida. Por favor intenta de nuevo.");
      }

      // Al completar con éxito: actualiza la sesión con estado 'generado' (sin registrar en base de datos aún)
      // newPlanId = null para que el docente decida conscientemente cuándo guardarlo en Mis Planes
      completePlanGeneration(plan, metadataSnapshot, null);
      setIsGenerating(false);
      navigate('/editor');
    } catch (error) {
      setGenerationError(error.message || "Ocurrió un error al contactar al servicio de IA. Por favor verifica tu conexión y tu API Key.");
      setIsGenerating(false);
    }
  };

  const handleConfirmClearForm = () => {
    clearWizardFormOnly();
    setStep(1);
    setFieldErrors({});
    setShowClearModal(false);
  };


  const stepsInfo = [
    { num: 1, title: 'Información básica', desc: 'Contexto de tu clase para construir una planificación pertinente.' },
    { num: 2, title: 'Metodología', desc: 'Define cómo orientarás el aprendizaje de tus estudiantes.' },
    { num: 3, title: 'Estándares', desc: 'Conecta las actividades con los referentes curriculares oficiales.' },
    { num: 4, title: 'Inclusión (DUA)', desc: 'Anticipa barreras de aprendizaje y considera apoyos específicos.' }
  ];

  const inclusionOptions = [
    {
      value: "Discapacidad visual",
      label: "Discapacidad visual",
      desc: "Apoyo con audio, descripción y material táctil",
      icon: <Eye size={18} color="var(--primary-active)" />
    },
    {
      value: "Discapacidad auditiva",
      label: "Discapacidad auditiva",
      desc: "Apoyo visual, subtítulos y lenguaje de señas",
      icon: <VolumeX size={18} color="var(--primary-active)" />
    },
    {
      value: "Discapacidad motora",
      label: "Discapacidad motora",
      desc: "Adaptaciones de movilidad y acceso físico",
      icon: <Accessibility size={18} color="var(--primary-active)" />
    },
    {
      value: "PIAR aplicable",
      label: "PIAR Institucional",
      desc: "Plan Individual de Ajustes Razonables",
      icon: <ShieldCheck size={18} color="var(--primary-active)" />
    }
  ];

  const progressPercentage = ((step - 1) / (stepsInfo.length - 1)) * 100;
  const hasDraftData = Boolean(wizardData.tema || wizardData.recursos || wizardData.objetivos);

  const breadcrumbsItems = [
    { label: 'Inicio', href: '/home', onClick: (e) => { e.preventDefault(); navigate('/home'); } },
    { label: 'Planificador', href: '/' }
  ];

  return (
    <div className="wizard-container">
      {/* Migas de Pan (Breadcrumbs) para orientación jerárquica */}
      <div style={{ marginBottom: '8px' }}>
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      {/* 1. Panel Editorial de Cabecera y Stepper */}
      <section className="planificador-header-panel">
        <div className="planificador-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <div className="editorial-badge" style={{ margin: 0 }}>
              <Sparkles size={14} color="#2B524A" />
              <span>Secuencia Didáctica Guiada</span>
            </div>
            {hasDraftData && (
              <button 
                type="button"
                className="editor-btn-pill"
                onClick={() => setShowClearModal(true)}
                title="Descartar el borrador actual y comenzar un plan en blanco"
                style={{ fontSize: '12px', padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={12} /> Comenzar nuevo plan en blanco
              </button>
            )}
          </div>

          <h1 className="planificador-title">
            Planificador de Clases
          </h1>
          <p className="planificador-subtitle">
            Configura los propósitos pedagógicos, metodología y adaptaciones DUA para generar tu secuencia didáctica estructurada con asistencia de IA.
          </p>
        </div>
        
        {/* Stepper / Indicador de Progreso Responsive */}
        <div id="tour-wizard-progress" className="wizard-stepper" style={{ marginBottom: 0 }}>
          <div className="wizard-stepper-track">
            <div 
              className="wizard-stepper-progress-fill" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          {stepsInfo.map(s => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <div 
                key={s.num} 
                className={`wizard-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (isCompleted || isActive) {
                    setStep(s.num);
                    setWizardStep(s.num);
                  }
                }}
                style={{ cursor: isCompleted ? 'pointer' : 'default' }}
                title={isCompleted ? `Regresar a ${s.title}` : s.title}
              >
                <div className="wizard-step-bubble" aria-current={isActive ? 'step' : undefined}>
                  {isCompleted ? <Check size={18} strokeWidth={2.5} /> : s.num}
                </div>
                <span className="wizard-step-label">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Tarjeta de Formulario y Fase Pedagógica */}
      <div className="wizard-card">
        {/* Encabezado de la Fase Actual */}
        <div className="wizard-section-header">
          <h3 className="wizard-section-title">
            {stepsInfo[step - 1].title}
          </h3>
          <p className="wizard-section-desc">
            {stepsInfo[step - 1].desc}
          </p>
        </div>

        {/* Formulario Modularizado */}
        <div className="planificador-form">

          {/* FASE 1: INFORMACIÓN BÁSICA */}
          {step === 1 && (
            <WizardStep1Basicos
              wizardData={wizardData}
              fieldErrors={fieldErrors}
              handleChange={handleChange}
              misPlantillas={misPlantillas}
              userProfile={userProfile}
            />
          )}

          {/* FASE 2: METODOLOGÍA Y OBJETIVOS */}
          {step === 2 && (
            <WizardStep2Metodologia
              wizardData={wizardData}
              handleChange={handleChange}
              isSuggestingObj={isSuggestingObj}
              handleSuggestObjectives={handleSuggestObjectives}
              suggestionError={suggestionError}
            />
          )}

          {/* FASE 3: ESTÁNDARES CURRICULARES */}
          {step === 3 && (
            <WizardStep3Estandares
              wizardData={wizardData}
              updateWizardData={updateWizardData}
              isSuggestingStd={isSuggestingStd}
              handleSuggestStandards={handleSuggestStandards}
              suggestionError={suggestionError}
            />
          )}

          {/* FASE 4: INCLUSIÓN Y DUA */}
          {step === 4 && (
            <WizardStep4Inclusion
              wizardData={wizardData}
              handleChange={handleChange}
              inclusionOptions={inclusionOptions}
            />
          )}

          {/* Barra de Acciones de Escritorio */}
          <div className="planificador-actions">
            <div className="planificador-actions-left">
              {step > 1 && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handlePrev} 
                  style={{ minWidth: '110px' }}
                >
                  <ArrowLeft size={16} /> Volver
                </button>
              )}
            </div>
            
            <div className="planificador-actions-right">
              {saveFeedback && (
                <span className="planificador-save-feedback">
                  <Check size={15} /> {saveFeedback}
                </span>
              )}
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleSaveProgress}
                title="Guardar el estado actual del borrador para continuar después"
              >
                <Save size={16} /> Guardar progreso
              </button>
              
              {step < 4 ? (
                <button 
                  id="tour-wizard-next" 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleNext} 
                  style={{ minWidth: '130px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>Siguiente</span> <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  id="tour-wizard-next"
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  style={{ minWidth: '180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isGenerating ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />} 
                  <span>{isGenerating ? 'Generando propuesta...' : 'Generar Clase'}</span>
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Barra fija inferior para dispositivos móviles (Ergonomía Thumb Zone / Cap. 13) */}
      <aside className="wizard-mobile-sticky-bar" aria-label="Controles táctiles rápidos del planificador">
        {step > 1 ? (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handlePrev}
            style={{ flex: 1, minHeight: '44px' }}
          >
            <ArrowLeft size={16} /> Volver
          </button>
        ) : (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleSaveProgress}
            style={{ flex: 1, minHeight: '44px' }}
            title="Guardar borrador"
          >
            <Save size={16} /> Borrador
          </button>
        )}

        {step < 4 ? (
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleNext}
            style={{ flex: 2, minHeight: '44px' }}
          >
            <span>Siguiente</span> <ArrowRight size={16} />
          </button>
        ) : (
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ flex: 2, minHeight: '44px' }}
          >
            {isGenerating ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
            <span>{isGenerating ? 'Generando...' : 'Generar Clase'}</span>
          </button>
        )}
      </aside>

      {/* Modal de confirmación para comenzar un nuevo plan en blanco */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClearForm}
        title="¿Comenzar un nuevo plan en blanco?"
        message="Se restablecerán los campos del formulario para iniciar una nueva planificación desde cero. Si tienes datos importantes, puedes pulsar 'Guardar progreso' antes de continuar."
        confirmText="Comenzar en blanco"
        cancelText="Continuar con este borrador"
        isDestructive={false}
        icon={RotateCcw}
      />

      {/* Overlay cinematográfico de generación con IA */}
      {(isGenerating || generationError) && typeof document !== 'undefined' && createPortal(
        <div 
          className="wizard-generating-cinematic-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gen-modal-title"
        >
          <div className="wizard-generating-cinematic-card">
            {isGenerating ? (
              <div>
                <div className="wizard-generating-orb-container">
                  <div className="wizard-generating-orb-ring-outer" />
                  <div className="wizard-generating-orb-ring" />
                  <div className="wizard-generating-orb">
                    <Sparkles size={32} />
                  </div>
                </div>

                <span className="editorial-badge" style={{ margin: '0 auto 12px auto' }}>
                  <Sparkles size={13} /> Co-docente Didáctico Activo
                </span>
                
                <h3 id="gen-modal-title" style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: '#142B25',
                  marginBottom: '8px',
                  letterSpacing: '-0.015em'
                }}>
                  Tejiendo tu Secuencia Didáctica
                </h3>

                <p style={{ fontSize: '14.5px', color: '#3D5A53', margin: '0 auto', maxWidth: '420px' }}>
                  Esto puede tardar unos segundos.
                </p>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                  color: '#DC2626'
                }}>
                  <AlertCircle size={32} />
                </div>
                <h3 id="gen-modal-title" style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#142B25',
                  marginBottom: '10px'
                }}>
                  No se pudo generar la planeación
                </h3>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#991B1B',
                  backgroundColor: 'rgba(254, 242, 242, 0.8)',
                  border: '1px solid rgba(252, 165, 165, 0.6)',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  marginBottom: '16px',
                  textAlign: 'left',
                  wordBreak: 'break-word'
                }}>
                  {generationError}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setGenerationError(null)}
                  >
                    Cerrar y verificar datos
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleGenerate}
                    style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Sparkles size={15} /> Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
