# Evidencias — ACT-017 (Lista de Chequeo Frontend Pressman)

## 1. Identificación
* **Actividad:** ACT-017 — Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño.
* **Ciclo:** Semana 10.
* **Equipo Evaluado:** Grupo 2 (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne).

---

## 2. Documentos y Artefactos Producidos
1. **Instrumento Oficial de Evaluación:** [ACT-017_LISTA_CHEQUEO_FRONTEND_PRESSMAN.md](../../actividades/ACT-017_LISTA_CHEQUEO_FRONTEND_PRESSMAN.md).
2. **Matriz de los 7 Hábitos por Integrante:** [ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md (Sección 5.11)](../../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md).
3. **Diario de Campo de la Semana 10:** [SEMANA_10.md](../../diario-campo/SEMANA_10.md).
4. **Registro de Interacción con IA (ROCAS):** [REGISTRO_IA_ACT-017.md](../../ia/REGISTRO_IA_ACT-017.md).
5. **Monitoreo Semanal de Proyecto:** [MONITOREO_SEMANAL.md](../../seguimiento/MONITOREO_SEMANAL.md).

---

## 3. Trazabilidad de Evidencias en Código Fuente
* **Bloque 1 (Capítulo 12 - UX):**
  * `src/App.jsx`: Menú lateral semántico en 3 grupos (Planeación, Comunidad, Soporte).
  * `src/pages/HomePage.jsx`: Panel editorial de bienvenida y accesos rápidos por tarjetas.
  * `src/pages/WizardPage.jsx`: Stepper de 4 pasos, autocompletado y sugerencias IA (`suggestObjectives`, `suggestStandards`).
  * `src/components/ConfirmModal.jsx`: Modales no invasivos vía `createPortal`.
* **Bloque 2 (Capítulo 13 - Movilidad):**
  * `src/index.css`: Media queries para móvil `<= 768px` y menú deslizable Drawer (`.app-sidebar-lateral.open`).
  * `src/components/ui/BottomSheet.jsx`: Componente para interacción táctil en móvil.
* **Bloque 3 (Capítulo 14 - Patrones):**
  * `src/store/useAppStore.js`: Estado global con Zustand y persistencia local (`localStorage`).
  * `src/services/`: Capa de servicios desacoplada (`dbService.js`, `aiService.js`, `authService.js`).
  * `src/pages/EditorPage.jsx`: Navegación canónica por pestañas (Vista Previa, Editor Markdown, Rúbrica, Materiales).
