import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const INITIAL_WIZARD_DATA = {
  tema: '',
  formato: 'Formato genérico de Matemáticas',
  formatoInstrucciones: '',
  institucion: '',
  sede: '',
  docente: '',
  tutor: '',
  asignatura: 'Matemáticas',
  grupo: '',
  fecha: '',
  grado: '10mo',
  materia: 'Matemáticas',
  duracion: '90 minutos (1 sesión continua)',
  sesiones: '1',
  numEstudiantes: '',
  recursos: '',
  metodologiaSTEAM: '',
  objetivos: '',
  estandaresMEN: [],
  inclusion: [],
  otrasNecesidades: '',
  // ADN Pedagógico & Estudio Transversal
  aplicarAdnPedagógico: true,
  esTransversal: false,
  ejeTransversal: 'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)',
  areaSecundaria: '',
  retoContextual: ''
};

export const useAppStore = create(
  persist(
    (set) => ({
      // Estado de Sesión Activa Persistente
      planGenerado: '',
      estadoCambios: false,
      sesionChatIA: [],
      apiKey: (typeof localStorage !== 'undefined' ? localStorage.getItem('inspiratec_api_key') : '') || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : '') || '',
      planStatus: 'borrador', // borrador, guardado

      setPlanGenerado: (plan) => set({ planGenerado: plan, estadoCambios: true, planStatus: 'borrador' }),
      setEstadoCambios: (estado) => set({ estadoCambios: estado }),
      setPlanStatus: (status) => set({ planStatus: status }),
      addMensajeChatIA: (mensaje) => set((state) => ({ sesionChatIA: [...state.sesionChatIA, mensaje] })),
      clearChatIA: () => set({ sesionChatIA: [] }),
      clearChatIAModo: (modo) => set((state) => ({
        sesionChatIA: (state.sesionChatIA || []).filter(m => {
          const msgModo = m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct');
          return msgModo !== modo;
        })
      })),
      
      recursosAnexos: [],
      addRecursoAnexo: (recurso) => set((state) => {
        const list = Array.isArray(state.recursosAnexos) ? state.recursosAnexos : [];
        const filtered = list.filter(r => (r.prompt && recurso.prompt) ? r.prompt !== recurso.prompt : r.title !== recurso.title);
        return { 
          recursosAnexos: [...filtered, recurso], 
          estadoCambios: true, 
          planStatus: 'borrador' 
        };
      }),
      removeRecursoAnexo: (indexOrTitle) => set((state) => {
        const list = Array.isArray(state.recursosAnexos) ? state.recursosAnexos : [];
        return {
          recursosAnexos: list.filter((r, idx) => 
            typeof indexOrTitle === 'number' ? idx !== indexOrTitle : r.title !== indexOrTitle
          ),
          estadoCambios: true
        };
      }),
      setRecursosAnexos: (recursos) => set({ recursosAnexos: Array.isArray(recursos) ? recursos : [] }),
      
      setApiKey: (key) => {
        localStorage.setItem('inspiratec_api_key', key);
        set({ apiKey: key });
      },

      // Estado del Formulario del Asistente (Borrador independiente del plan activo)
      wizardData: { ...INITIAL_WIZARD_DATA },
      wizardStep: 1,
      wizardDraftSavedAt: null,
      wizardSaveStatus: 'idle', // 'idle' | 'saving' | 'saved'

      updateWizardData: (data) => set((state) => ({
        wizardData: { ...state.wizardData, ...data },
        wizardSaveStatus: 'idle'
      })),

      setWizardStep: (step) => set({ wizardStep: step }),

      saveWizardProgress: (data = {}, step = null) => set((state) => ({
        wizardData: { ...state.wizardData, ...data },
        wizardStep: step !== null ? step : state.wizardStep,
        wizardDraftSavedAt: new Date().toISOString(),
        wizardSaveStatus: 'saved'
      })),

      clearWizardFormOnly: () => set({
        wizardData: { ...INITIAL_WIZARD_DATA },
        wizardStep: 1,
        wizardDraftSavedAt: null,
        wizardSaveStatus: 'idle'
      }),

      // Metadatos de la clase activa en el Editor (independientes del formulario)
      activePlanMetadata: null,
      setActivePlanMetadata: (meta) => set({ activePlanMetadata: meta }),

      // Al completar generación con IA: actualiza el Editor con la propuesta y prepara el formulario para la siguiente planeación
      // Si newPlanId es null, el plan queda en estado 'generado' (sin persistir en Mis Planes hasta confirmación explícita)
      completePlanGeneration: (planMarkdown, planMetadata, newPlanId = null) => set({
        planGenerado: planMarkdown,
        activePlanMetadata: { ...planMetadata },
        planId: newPlanId,
        planStatus: newPlanId ? 'guardado' : 'generado',
        estadoCambios: !newPlanId,
        wizardData: { ...INITIAL_WIZARD_DATA },
        wizardStep: 1,
        wizardDraftSavedAt: null,
        wizardSaveStatus: 'idle',
        sesionChatIA: [],
        recursosAnexos: []
      }),

      userId: null,
      userProfile: null,
      setUserId: (id) => set({ userId: id }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      planId: null,
      setPlanId: (id) => set({ planId: id }),
      planesCount: 0,
      setPlanesCount: (count) => set({ planesCount: count }),

      misPlantillas: [],
      addPlantilla: (plantilla) => set((state) => ({
        misPlantillas: [plantilla, ...state.misPlantillas]
      })),
      setMisPlantillas: (plantillas) => set({ misPlantillas: plantillas }),

      // Cargar un documento existente en el Editor: NO contamina ni sobrescribe el borrador del wizard
      loadPlan: (planMetadata, markdownContent, planId = null) => set({
        activePlanMetadata: { ...(planMetadata || {}) },
        planGenerado: markdownContent || '',
        planId: planId,
        planStatus: 'guardado',
        estadoCambios: false,
        sesionChatIA: [],
        recursosAnexos: Array.isArray(planMetadata?.recursosAnexos) ? planMetadata.recursosAnexos : []
      }),

      // Limpia el plan activo si coincide con el ID de un plan eliminado
      clearActivePlanIfMatches: (targetPlanId) => set((state) => {
        if (!targetPlanId) return {};
        const matchesId = state.planId === targetPlanId;
        const matchesTema = state.activePlanMetadata?.tema && (
          typeof targetPlanId === 'object' 
            ? state.activePlanMetadata?.tema === targetPlanId.tema
            : false
        );
        if (matchesId || matchesTema) {
          return {
            activePlanMetadata: null,
            planGenerado: '',
            planId: null,
            planStatus: 'borrador',
            estadoCambios: false,
            sesionChatIA: [],
            recursosAnexos: []
          };
        }
        return {};
      }),

      resetWizard: () => set({
        wizardData: { ...INITIAL_WIZARD_DATA },
        wizardStep: 1,
        wizardDraftSavedAt: null,
        wizardSaveStatus: 'idle',
        activePlanMetadata: null,
        planGenerado: '',
        planId: null,
        planStatus: 'borrador',
        sesionChatIA: [],
        recursosAnexos: []
      })
    }),
    {
      name: 'inspiratec_active_session',
      partialize: (state) => ({
        planGenerado: state.planGenerado,
        planId: state.planId,
        planStatus: state.planStatus,
        userId: state.userId,
        activePlanMetadata: state.activePlanMetadata,
        recursosAnexos: state.recursosAnexos,
        sesionChatIA: state.sesionChatIA,
        wizardData: state.wizardData,
        wizardStep: state.wizardStep,
        wizardDraftSavedAt: state.wizardDraftSavedAt,
        wizardSaveStatus: state.wizardSaveStatus,
      })
    }
  )
);

