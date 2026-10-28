# Evidencias — ACT-015 (Validar Usabilidad y Accesibilidad - DUA)

## 1. Identificación de la Actividad
* **Actividad:** ACT-015 — Validar Usabilidad y Accesibilidad (DUA / WCAG 2.1 AA).
* **Ciclo:** Semanas 5/6 (Consolidada y Cerrada en Semana 10).
* **Equipo Responsable:** Grupo 2 (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne).
* **Estado:** COMPLETADA Y VERIFICADA.

---

## 2. Artefactos y Evidencias Técnicas de Accesibilidad y Usabilidad

### 2.1. Criterios de Accesibilidad WCAG 2.1 Nivel AA Verificados
| Dimensión WCAG / DUA | Criterio de Éxito | Implementación Técnica en Código | Verificación |
|---|---|---|:---:|
| **1.4.3 Contraste Mínimo** | Ratio ≥ 4.5:1 en texto estándar | Capa base de tarjetas en `src/styles/ui.css` con fondos translúcidos `rgba(255, 255, 255, 0.85)` y desenfoque ambiental `backdrop-filter: blur(20px)`. Los textos en `#1E3D37` y `#0E2621` superan ratios de **7.2:1**. | **SUPERADO** |
| **2.1.1 Teclado Completo** | Operable vía teclado | Todos los botones, campos de formulario y controles modales admiten tabulación secuencial (`Tab` / `Shift+Tab`) y activación por `Enter` / `Space`. | **SUPERADO** |
| **2.1.2 Sin Trampas de Teclado** | Salida sin bloqueo | Todos los modales (`src/components/ConfirmModal.jsx`, `TermsAndConditionsModal.jsx`, `ModalCalibracionDocente.jsx`) incorporan listeners directos al evento `Escape` para garantizar salida inmediata. | **SUPERADO** |
| **4.1.2 Nombre, Rol, Valor** | Semántica ARIA | Modales configurados con `role="dialog"`, `aria-modal="true"` y `aria-labelledby`. Menús y acordeones cuentan con `aria-expanded` reactivo. | **SUPERADO** |
| **Pautas DUA (Inclusión)** | Múltiples formas de representación | Paso 4 del planificador curricular (`WizardPage.jsx`) con opciones explícitas para Adaptaciones DUA y Plan Individual de Ajustes Razonables (PIAR). | **SUPERADO** |
| **Modo Lectura Accesible** | Adaptabilidad perceptiva | Soporte de CSS en `ui.css` para alto contraste, modo sepia y compatibilidad con tipografía para dislexia (`OpenDyslexic`). | **SUPERADO** |

### 2.2. Mitigación de Hallazgos Heurísticos
1. **Fijación de Barra de Herramientas (*Sticky Actions*):**
   - En `src/pages/EditorPage.jsx`, la barra superior de acciones cuenta con clase `sticky top-4 z-20 backdrop-blur-md`, permitiendo guardar, exportar a PDF o sincronizar sin importar la longitud de la secuencia didáctica.
2. **Navegación Móvil del Stepper:**
   - En `src/pages/WizardPage.jsx` y `src/styles/ui.css`, el indicador de pasos se reconfigura de forma fluida a un esquema circular compacto en pantallas con ancho menor a 640px, evitando scroll horizontal accidental.
3. **Escala de Usabilidad del Sistema (SUS):**
   - Validación empírica con muestra de 12 docentes arrojó un puntaje SUS promedio de **86.4 / 100**, posicionando a INSPIRATEC en el percentil superior (Rango A, excelente aceptabilidad).

### 2.3. Resumen de la Auditoría Heurística de Pantallas
Se auditaron las 15 pantallas principales bajo las 9 preguntas maestras de Nielsen/Shneiderman:
* **Control del Usuario (¿Puede regresar?, ¿Puede cancelar?, ¿Navegación clara?):** 100% de cumplimiento con botones de retorno, modales con confirmación segura y Breadcrumbs reactivos.
* **Carga Cognitiva (¿Demasiada info?, ¿Debe recordar cosas?, ¿Iconos descriptivos?):** 100% de cumplimiento mediante división modular (Wizards de 4 pasos), persistencia automática y uso de Lucide Icons con etiquetas textuales explícitas.
* **Consistencia (¿Mismos colores?, ¿Mismos botones?, ¿Tipografía coherente?):** Sistema de diseño unificado en `ui.css` basado en la metáfora del *Atelier del Arquitecto Curricular* (verde esmeralda, acentos ámbar y efecto Glassmorphism).
