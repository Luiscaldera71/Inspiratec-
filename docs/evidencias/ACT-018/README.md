# Evidencias — ACT-018 (Lista de Chequeo Frontend STI y Metacognición)

## 1. Identificación
* **Actividad:** ACT-018 — Lista de Chequeo para la Verificación del Frontend: Sistemas Tutores Inteligentes (STI / ITS).
* **Ciclo:** Semana 10.
* **Fuente Teórica:** Caro Piñeres, Manuel Fernando (2015). *Metamodel for personalized adaptation of pedagogical strategies using metacognition in Intelligent Tutoring Systems*. Tesis Doctoral, Universidad Nacional de Colombia.
* **Equipo Evaluado:** Grupo 2 (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne).

---

## 2. Documentos y Artefactos Producidos
1. **Instrumento Oficial de Evaluación:** [ACT-018_LISTA_CHEQUEO_STI_CARO.md](../../actividades/ACT-018_LISTA_CHEQUEO_STI_CARO.md).
2. **Registro de Interacción con IA (ROCAS):** [REGISTRO_IA_ACT-018.md](../../ia/REGISTRO_IA_ACT-018.md).
3. **Diario de Campo de la Semana 10:** [SEMANA_10.md](../../diario-campo/SEMANA_10.md).
4. **Monitoreo Semanal de Proyecto:** [MONITOREO_SEMANAL.md](../../seguimiento/MONITOREO_SEMANAL.md).

---

## 3. Trazabilidad de Evidencias en Código Fuente
* **Bloque 1: Reflejo de los Cuatro Módulos Canónicos:**
  * `src/components/wizard/WizardStep3Estandares.jsx` & `src/services/aiService.js`: Módulo del Experto basado en la ontología del MEN (Guía 30, DBA).
  * `src/components/wizard/WizardStep4Inclusion.jsx` & `src/pages/HomePage.jsx`: Módulo del Estudiante/Overlay con perfil DUA/PIAR y métricas de progreso.
  * `src/components/wizard/WizardStep2Metodologia.jsx`: Módulo del Tutor con tácticas didácticas formales (ABP, Gamificación, Flipped Classroom).
  * `src/styles/ui.css` & `src/index.css`: Módulo de Interfaz ergonómica con *Warm Glassmorphism* y retroalimentación accesible.
* **Bloque 2: Características de Inteligencia del Tutor:**
  * `src/services/aiService.js` (`generateComplementaryMaterial`): Bifurcación multimodal (Flashcards 3D, diapositivas animadas, sopa de letras, quizzes interactivos).
  * `src/components/ui/Breadcrumbs.jsx` & `src/pages/WizardPage.jsx`: Navegación dual secuencial y global.
  * `src/components/wizard/WizardStep1Basicos.jsx`: Andamiaje escalonado en 3 niveles con Advisor de IA.
  * `src/services/aiService.js` & `src/services/dbService.js`: Cascada de modelos resiliente y fallback local.
  * `src/components/NetworkStatusBanner.jsx` & `src/pages/EditorPage.jsx` (`modifyPlan`): Replanificación en caliente ante desconexión o ajuste del docente.
* **Bloque 3: Metacognición Computacional y Doble Lazo:**
  * `src/pages/EditorPage.jsx`: Separación Nivel Objeto (editor) vs Meta-Nivel (autorregulación, badges de ciclo de vida).
  * `src/store/useAppStore.js`: Juicios metacognitivos de persistencia (`planStatus`: 'borrador', 'generado', 'guardado').
  * `src/components/ConfirmModal.jsx`: Agencia compartida (*Shared Agency*) que pone el control en manos del docente.
