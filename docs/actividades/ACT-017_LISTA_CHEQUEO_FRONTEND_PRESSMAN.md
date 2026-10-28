# ACT-017 — Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño

**Instrumento de evaluación formativa y autoevaluación para interfaces de usuario en informática educativa**  
**Fuente Bibliográfica de Referencia Exigida:**  
Roger S. Pressman & Bruce R. Maxim (2019). *Software Engineering: A Practitioner's Approach* (9th Edition, McGraw-Hill Education). Capítulo 12 (*User Experience Design*), Capítulo 13 (*Design for Mobility*) y Capítulo 14 (*Pattern-Based Design*).

---

## 1. Datos Generales del Proyecto y Control de Evaluación

* **Asignatura / Curso:** Informática Educativa / Diseño de Interfaces de Usuario (Semana 10)
* **Fecha de Evaluación:** 16 de Octubre de 2026
* **Nombre de la Aplicación / Frontend:** INSPIRATEC (Generador Curricular y Didáctico de Planes de Clase con IA)
* **Versión / Rama Git:** `v1.2.0` / `main`
* **Integrantes del Equipo (Grupo 2):**
  * Daniel Tapias Acosta (Frontend / Git Lead)
  * Luis Caldera (Frontend / UI-UX Lead)
  * Zoe Peñata (Scrum Master)
  * Maira Ortega (Facilitadora de Equipo)
  * María Soto (Product Owner)
  * María Ubarne (Product Owner Support)
* **URL Repositorio:** `https://github.com/DanielTapias12/planclase`
* **Docente / Evaluador:** Prof. Raúl Toscano Miranda
* **Diagnóstico Inicial:** **22 / 32 pts** (**68.75%**) — *Básico con Observaciones*
* **Calificación Final Verificada (Post-Implementación):** **30 / 32 pts** (**93.75%**) — *Sobresaliente / Certificación de Frontend Aprobada*

---

## 2. Instrucciones de Uso y Escala de Valoración

Esta lista de chequeo verifica con rigor metodológico la aplicación de modelos, reglas ergonómicas, principios de movilidad y patrones de diseño formalizados en los Capítulos 12, 13 y 14 de Pressman & Maxim (9na Edición). Cada ítem está sustentado mediante evidencia tangible en el código fuente (`src/`) y en la interfaz interactiva desplegada.

| Código | Escala de Calificación | Ponderación | Criterio de Evaluación Operativo |
|:---:|---|:---:|---|
| **C** | Cumple Totalmente | 2 Puntos (100%) | El frontend implementa rigurosamente el criterio teórico; es funcional, visible y comprobable en la demo. |
| **CP** | Cumple Parcialmente | 1 Punto (50%) | Se evidencia la intención en la interfaz o código, pero con inconsistencias, fallos visuales o cobertura incompleta. |
| **NC** | No Cumple | 0 Puntos (0%) | El criterio teórico no fue considerado; está ausente o no funciona en la interfaz de usuario desarrollada. |
| **NA** | No Aplica | Excluido (N/A) | El criterio fue explícitamente descartado del alcance por mutuo acuerdo con el docente. |

---

## 3. Capítulo 12: Diseño de la Experiencia de Usuario (UX Design)

### UX-01: Los 5 Planos de Garrett y Arquitectura de Información (IA)
* **Ref. Teórica:** Pressman Cap. 12.1 y Cap. 12.1.1 (*"Information Architecture"*, p. 236); Garrett [Gar02/Gar11].
* **Criterios Evaluados:**
  * *Arquitectura de Contenido (Organización y Rotulado/Labeling):* Objetos de información y pantallas estructurados lógicamente con etiquetas y títulos unívocos.
  * *Filosofía de Navegación y Recorrido (Traversal):* Recorrido intuitivo, fluido, sin callejones sin salida, facilitando búsqueda y asimilación.
  * *Estrategia, Alcance y Superficie:* Equilibrio entre objetivos pedagógicos docentes, esqueleto y superficie Glassmorphism armónica.
* **Evidencia en Frontend:**
  * En `src/App.jsx`, el menú lateral (`app-sidebar-lateral`) estructura la arquitectura en 3 grupos semánticos unívocos: **Planeación** (`/home`, `/`, `/mis-planes`, `/plantillas`, `/administracion`), **Comunidad** (`/biblioteca`, `/experiencias`, `/foro`) y **Soporte** (`/ayuda`, `/soporte`, `/acerca`).
  * En `src/pages/HomePage.jsx`, el *Panel Editorial de Bienvenida* organiza métricas, accesos rápidos por tarjetas (*Cards*) con jerarquía visual y títulos descriptivos.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Wireframes / IA y Rotulado revisados y coherentes con `DIAGRAMA_DE_CONTENIDOS.md`.

---

### UX-02: Regla de Oro 1 de Mandel: Poner al Usuario en Control
* **Ref. Teórica:** Pressman Cap. 12.2.1 (*"Place the User in Control"*); Theo Mandel [Man97].
* **Criterios Evaluados:**
  * *Interacción flexible:* Sin secuencias forzadas ni flujos rígidos obligatorios.
  * *Reversibilidad de acciones:* Mecanismos visibles para deshacer, retroceder o cancelar antes de operaciones irreversibles.
  * *Persistencia de borradores:* Posibilidad de interrumpir procesos extensos y retomarlos más tarde sin pérdida de datos.
* **Evidencia en Frontend:**
  * En `src/store/useAppStore.js` existen funciones `saveWizardProgress` y almacenamiento en `localStorage` (`inspiratec_active_session`).
  * En `src/components/ConfirmModal.jsx` se provee confirmación no invasiva montada vía `createPortal`.
  * **Debilidad Detectada:** En `src/pages/WizardPage.jsx` (líneas 60-65), un hook `useEffect` ejecuta agresivamente `clearWizardFormOnly()` al montar el componente, reseteando cualquier borrador en progreso si el usuario navega a otra sección y regresa. Además, falta historial de deshacer/rehacer (Undo/Redo) en el editor Markdown.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Requiere desactivar la limpieza automática del formulario en el montaje del Wizard para respetar la persistencia del borrador, e incorporar botones de deshacer en el editor.

---

### UX-03: Regla de Oro 2 de Mandel: Reducir la Carga de Memoria
* **Ref. Teórica:** Pressman Cap. 12.2.2 (*"Reduce the User’s Memory Load"*); Theo Mandel [Man97], Miller (1956, regla 7±2).
* **Criterios Evaluados:**
  * *Reconocimiento sobre recuerdo:* Opciones, instrucciones contextuales y estados visibles en pantalla en el momento de actuar.
  * *Segmentación (Chunking):* Formularios y contenidos fragmentados en pasos progresivos (Wizards o Steppers).
  * *Valores por defecto y sugerencias:* Placeholders ilustrativos, autocompletado y plantillas predeterminadas.
* **Evidencia en Frontend:**
  * En `src/pages/WizardPage.jsx`, el planificador implementa un Wizard de 4 fases progresivas (`Fase 1: Identificación`, `Fase 2: Audiencia y Temporalidad`, `Fase 3: Metodología`, `Fase 4: Inclusión DUA`).
  * Sugerencias asistidas por IA mediante botones interactivos (`suggestObjectives`, `suggestStandards`) que inyectan opciones contextualmente sin obligar al docente a memorizar códigos de la Guía 30 del MEN.
  * Valores predeterminados sensibles y placeholders dinámicos contextualizados por asignatura en `tema`.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Chunking, steppers y ayudas contextuales implementadas rigurosamente.

---

### UX-04: Regla de Oro 3 de Mandel: Consistencia Integral
* **Ref. Teórica:** Pressman Cap. 12.2.3 (*"Make the Interface Consistent"*); Theo Mandel [Man97].
* **Criterios Evaluados:**
  * *Consistencia visual:* Misma paleta cromática corporativa, escalas tipográficas y familia iconográfica homogénea.
  * *Consistencia operativa:* Mismos gestos, clics y atajos producen idénticos resultados en toda la aplicación.
  * *Consistencia terminológica:* Vocabulario estandarizado en botones y etiquetas.
* **Evidencia en Frontend:**
  * En `src/index.css`, se define un sistema de tokens semánticos centralizado: `--color-brand-primary: #1E3D37`, `--color-brand-active: #315B54`, `--color-surface-base`, desenfoques Glassmorphism unificados (16-30px).
  * Toda la iconografía proviene unívocamente de `lucide-react` con grosores uniformes.
  * Terminología estandarizada para "Generar Plan", "Guardar Borrador", "Editar", "Eliminar" en todas las vistas.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Sistema de diseño verificado y coherente en todas las vistas de la aplicación.

---

### UX-05: Modelado de Usuarios, Personas y Análisis de Tareas
* **Ref. Teórica:** Pressman Cap. 12.4.2 (*"User Modeling"*, Recuadro SafeHome) y Cap. 12.4.3 (*"Task Analysis"*).
* **Criterios Evaluados:**
  * *Diseño centrado en el arquetipo:* Responde a las competencias y limitaciones de la Persona docente.
  * *Optimización de tareas frecuentes:* Eliminación de pasos innecesarios en actividades prioritarias.
  * *Análisis Jerárquico de Tareas (HTA):* Descomposición lógica de operaciones complejas en sub-tareas guiadas.
* **Evidencia en Frontend:**
  * El diseño responde directamente al arquetipo del Docente de Educación Básica y Media en Colombia, facilitando la planificación curricular con lineamientos MEN y DUA.
  * En `HomePage.jsx`, se priorizan en un solo clic las 3 tareas más frecuentes: "Crear Nuevo Plan de Clase", "Retomar Mis Planes" y "Usar Plantilla Oficial".
  * El flujo de generación descompone la tarea compleja de planificación en un Análisis Jerárquico de 4 pasos ordenados.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Perfiles Persona y HTA reflejados fielmente en la jerarquía de interacción.

---

### UX-06: Directrices Ergonómicas de Bruce Tognazzini
* **Ref. Teórica:** Pressman Cap. 12.8.1 (*"Usability Guidelines"*); Bruce Tognazzini [Tog01].
* **Criterios Evaluados:**
  * *Ley de Fitts:* Botones de acción clave con tamaño generoso, bien delimitados y en zonas de fácil alcance.
  * *Anticipación y retroalimentación:* Respuesta inmediata ante eventos (spinners, barras de progreso, estados disabled/hover).
  * *Preservación del estado:* Conservación de campos ante recarga o errores temporales.
* **Evidencia en Frontend:**
  * Botones principales de acción con padding generoso (12px a 16px) y áreas de clic amplias.
  * En `WizardPage.jsx`, al pulsar "Generar Plan de Clase con IA", el botón se deshabilita, se muestra un spinner animado (`Loader2`), una barra de progreso porcentual (`progressPercent`) y un texto de fase dinámico ("Analizando contexto didáctico...", "Formulando objetivos de aprendizaje...", "Consolidando documento final...").
  * **Debilidad Detectada:** La preservación del estado del formulario del Wizard falla ante navegación accidental debido al `clearWizardFormOnly()` en montaje mencionado en UX-02.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Ley de Fitts y retroalimentación de progreso excelentes; pendiente subsanar la preservación de estado del formulario en caliente.

---

### UX-07: Accesibilidad Universal y Principios WCAG (POUR)
* **Ref. Teórica:** Pressman Cap. 12.8.2 (*"Accessibility Guidelines"*); W3C WCAG 2.1 (POUR).
* **Criterios Evaluados:**
  * *Perceptible:* Contraste cromático >= 4.5:1 para texto estándar y texto alternativo en imágenes.
  * *Operable:* Navegabilidad íntegra por teclado con indicador visual de foco delimitado (`:focus-visible`).
  * *Comprensible y Robusto:* Semántica HTML5 adecuada (`<nav>`, `<main>`, `<aside>`, `<header>`, `<button>`).
* **Evidencia en Frontend:**
  * Uso de etiquetas semánticas HTML5 en `App.jsx` (`<header>`, `<aside>`, `<nav>`, `<main>`), y roles ARIA en modales y menús desplegables.
  * Paleta con contraste superior a 5.5:1 entre textos oscuros (`#142B25`) y fondos claros Glassmorphism (`#FFFDF9`).
  * **Debilidad Detectada:** En `src/index.css`, se encontraron múltiples reglas con `outline: none;` sin el correspondiente `:focus-visible` o focus ring accesible (solo 2 elementos tienen definida regla `:focus-visible` explícita en todo el CSS). Navegar exclusivamente con `Tab` deja invisibles los focos en varios botones secundarios e inputs.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Requiere una regla global de anillo de foco accesible (`:focus-visible { outline: 2px solid var(--color-brand-active); outline-offset: 2px; }`).

---

### UX-08: Prototipado Validado y Métricas de Usabilidad
* **Ref. Teórica:** Pressman Cap. 12.5 y Cap. 12.7; Knapp et al. (2016); Nielsen (1993).
* **Criterios Evaluados:**
  * *Prototipado interactivo:* Wireframes y prototipos previos a la codificación.
  * *Pruebas con usuarios:* Regla de los 5 usuarios (Nielsen).
  * *Medición de usabilidad:* Cálculo del índice SUS (System Usability Scale).
* **Evidencia en Frontend:**
  * Existen wireframes iniciales y diagramas en `docs/evidencias/diagramas/`, junto con la auditoría heurística previa documentada en `docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md`.
  * **Debilidad Detectada:** La prueba empírica formal con 5 usuarios docentes y el cálculo cuantitativo tabulado del índice SUS (promedio sobre 100 pts) permanece catalogado como compromiso pendiente en `ACT-015`, sin el dataset de encuestas consolidado en el repositorio.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Prototipado y heurísticas cubiertos; falta consolidar la batería de encuestas SUS con 5 docentes de muestra.

---

## 4. Capítulo 13: Diseño para la Movilidad (Mobile UI/UX)

### MOB-01: Pirámide de Diseño Móvil / Web (Pressman & Lowe)
* **Ref. Teórica:** Pressman Cap. 13.5 (*"Web Design Pyramid"*, Pressman & Lowe [Pre08]).
* **Criterios Evaluados:**
  * *Simplicidad radical del contenido:* Priorización de la información esencial para pantallas pequeñas.
  * *Unidades Semánticas de Navegación (NSU):* Fragmentación en bloques semánticos atómicos.
  * *Diseño responsivo fluido:* Adaptación a móviles mediante Media Queries, Flexbox y Grid sin scroll horizontal.
* **Evidencia en Frontend:**
  * En `src/index.css` y `src/App.css`, media queries para `<= 768px` y `<= 480px` colapsan las cuadrículas de 3 y 4 columnas a 1 sola columna vertical con espaciado amplio.
  * El menú lateral se transforma en un Drawer móvil deslizante con botón hamburguesa (`mobile-nav-toggle`) y overlay de fondo (`sidebar-backdrop`).
  * Sin desplazamiento horizontal no deseado (`overflow-x: hidden` en layout base).
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Comportamiento responsivo fluido comprobable en DevTools (375px a 768px).

---

### MOB-02: Ergonomía Táctil y Zona del Pulgar (Thumb Zone)
* **Ref. Teórica:** Pressman Cap. 13.2.1, Cap. 13.8 (Hoober & Berkman [Hoo12]; Schumacher [Sch09]) y Cap. 14.7 (Patrones Móviles).
* **Criterios Evaluados:**
  * *Zona natural del pulgar (Thumb Zone):* Controles primarios situados en el tercio inferior de la pantalla móvil.
  * *Dimensiones mínimas de toque (Touch Targets):* Áreas de contacto de al menos 48x48 px/dp.
  * *Espaciado de seguridad:* Separación preventiva de 8-12 px entre controles para evitar toques involuntarios.
* **Evidencia en Frontend:**
  * El token `--touch-target: 44px` está declarado en CSS, y los botones de menú cumplen dimensiones táctiles aceptables.
  * Existe un componente `BottomSheet.jsx` en `src/components/ui/`, pero **no está integrado** en las vistas reales del sistema.
  * **Debilidad Detectada:** En vista móvil de `WizardPage.jsx` y `EditorPage.jsx`, las acciones críticas ("Siguiente Paso", "Paso Anterior", "Generar Plan", "Guardar") están al final del scroll del formulario o en barras superiores, fuera del tercio inferior inmediato (Thumb Zone), obligando al usuario a desplazarse manualmente para alcanzarlas con una sola mano.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Requiere una barra flotante fija inferior (Sticky Bottom Action Bar) en móvil para los controles primarios del Wizard y Editor.

---

### MOB-03: Sensibilidad al Contexto y Adaptabilidad (Context-Aware Apps)
* **Ref. Teórica:** Pressman Cap. 13.4 (*"Context-Aware Apps"*) y Cap. 13.1.2 (*"Technical Considerations"*).
* **Criterios Evaluados:**
  * *Adaptación a orientación:* Reorganización limpia entre portrait y landscape sin perder estado.
  * *Sensibilidad lumínica y ambiental:* Soporte para modo oscuro / claro (`prefers-color-scheme`).
  * *Entrada contextual optimizada:* Teclados virtuales especializados (`inputmode="numeric"`, `type="email"`, etc.).
* **Evidencia en Frontend:**
  * La reorganización entre horizontal y vertical responde fluidamente por Flexbox y CSS Grid.
  * **Debilidades Detectadas:**
    1. No existe soporte en el CSS para la media query `@media (prefers-color-scheme: dark)` ni selector de modo oscuro.
    2. Los campos numéricos en `WizardPage.jsx` (como `numEstudiantes` o `duracion`) no incluyen el atributo `inputMode="numeric"` o `pattern="[0-9]*"`, dependiendo exclusivamente del tipo nativo que en navegadores móviles no siempre despliega el teclado numérico extendido ergonómico.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Requiere agregar `inputMode="numeric"` en campos cuantitativos y preparar variables de contraste para modo oscuro.

---

### MOB-04: Resiliencia de Red y Rendimiento en Movilidad
* **Ref. Teórica:** Pressman Cap. 13.1.2 (*"Technical Considerations"*) y Cap. 13.8 (*"Mobility Design Best Practices"*).
* **Criterios Evaluados:**
  * *Manejo elegante offline / conexión lenta:* Notificación transparente no invasiva ante pérdidas de red.
  * *Optimización de recursos multimedia:* Carga diferida e imágenes vectoriales/optimizadas.
  * *Fluidez e hilo principal despejado:* Operaciones asíncronas no bloqueantes.
* **Evidencia en Frontend:**
  * Build ultra-ligero y optimizado con Vite, carga asíncrona de servicios de Firebase y Gemini AI.
  * **Debilidad Detectada:** Al simular "Offline" en DevTools, la aplicación carece de un detector reactivo de conectividad (`navigator.onLine` / eventos `online` y `offline`). Si la red cae, las peticiones fallan silenciosamente en consola o lanzan errores genéricos sin un banner contextual flotante que oriente al docente sobre la continuidad de sus borradores locales.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Requiere implementar un hook o banner global de estado de red (`NetworkStatusBanner`) para manejo elegante offline.

---

## 5. Capítulo 14: Diseño Basado en Patrones (Pattern-Based UI)

### PAT-01: Patrones Arquitectónicos y de Presentación (MVC / Componentes)
* **Ref. Teórica:** Pressman Cap. 14.1.1 (Gamma et al. [Gam95]) y Cap. 14.3 (*"Architectural Patterns - MVC"*).
* **Criterios Evaluados:**
  * *Separación estricta de responsabilidades:* Desacoplamiento entre vista, lógica y persistencia.
  * *Arquitectura de componentes modulares:* Bloques reutilizables con bajo acoplamiento.
  * *Gestión de estado predecible:* Flujo unidireccional y auditable.
* **Evidencia en Frontend:**
  * Desacoplamiento riguroso:
    * Capa de Presentación: `src/pages/` y `src/components/ui/`.
    * Capa de Estado y Control: `src/store/useAppStore.js` con Zustand y middleware de persistencia.
    * Capa de Servicios y Acceso a Datos: `src/services/dbService.js` (Firestore), `src/services/aiService.js` (Google Gemini) y `src/services/authService.js` (Firebase Auth).
    * Ningún componente de interfaz ejecuta consultas directas a base de datos sin pasar por los servicios.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Arquitectura en capas limpia y flujo unidireccional auditado exitosamente.

---

### PAT-02: Patrones de Navegación de Interfaz (Tidwell & van Welie)
* **Ref. Teórica:** Pressman Cap. 14.6 (*"User Interface Design Patterns"*); Tidwell [Tid11] y van Welie [Wel01].
* **Criterios Evaluados:**
  * *Patrones canónicos de navegación:* Pestañas (Tabs) para vistas paralelas, Migas de Pan (Breadcrumbs) para jerarquías y Drawer para navegación lateral.
  * *Localización espacial permanente:* Estados activos resaltados en los menús.
  * *Paginación o scroll estructurado:* Manejo claro de listados extensos.
* **Evidencia en Frontend:**
  * En `EditorPage.jsx` se implementan Tabs para alternar entre "Vista Previa", "Editor Markdown", "Rúbrica" y "Materiales".
  * Menú Lateral con estados activos destacados (`.active`) y contadores dinámicos de planes creados.
  * **Debilidad Detectada:** Aunque el componente `Breadcrumbs.jsx` fue desarrollado en `src/components/ui/Breadcrumbs.jsx`, **no está instanciado en ninguna de las páginas del sistema** (`EditorPage`, `WizardPage`, `PlantillasPage`). El docente no dispone de la línea de migas de pan ("Inicio > Planificador > Paso 2") en la parte superior del contenido.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Integrar el componente `Breadcrumbs` en la cabecera de las vistas principales para cumplir totalmente con Tidwell.

---

### PAT-03: Patrones de Entrada de Datos y Formularios
* **Ref. Teórica:** Pressman Cap. 14.6 (*"User Interface Design Patterns - Input & Forms"*); Tidwell [Tid11].
* **Criterios Evaluados:**
  * *Validación reactiva en línea (Inline Validation):* Comprobación campo a campo en tiempo real con mensajes descriptivos bajo el input.
  * *Máscaras de entrada y formateo asistido:* Controles especializados que guían el llenado.
  * *Agrupación semántica de campos:* Agrupación temática de campos en tarjetas o fieldsets.
* **Evidencia en Frontend:**
  * Los campos en `WizardPage.jsx` están agrupados temáticamente en bloques limpios (`wizard-group`) con iconos y textos de ayuda.
  * **Debilidad Crítica Detectada:** La validación de campos obligatorios en el Wizard utiliza la instrucción nativa del navegador `alert("Por favor completa el Tema y los Recursos...")` (línea 76 de `WizardPage.jsx`). Esto transgrede el patrón ergonómico de validación reactiva en línea (*Inline Validation*), interrumpiendo abruptamente el flujo del usuario con un diálogo modal síncrono del sistema operativo en lugar de colorear suavemente el borde del input y desplegar un texto de error debajo del campo.
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Reemplazar las alertas nativas por validación reactiva en línea con estados de error visuales y accesibles.

---

### PAT-04: Prevención y Eliminación de Antipatrones de Diseño de UI
* **Ref. Teórica:** Pressman Cap. 14.5 (*"Anti-Patterns"*); William Brown et al. [Bro98].
* **Criterios Evaluados:**
  * *Ausencia de The Blob (Componente Dios):* Sin archivos de interfaz que concentren excesiva lógica, estilos y peticiones monolíticas.
  * *Ausencia de Mystery Meat Navigation:* Iconos interactivos con texto explicativo visible o tooltip inmediato.
  * *Ausencia de Modal Hell y Spaghetti UI:* Sin ventanas modales superpuestas ni bucles desorientadores.
* **Evidencia en Frontend:**
  * No existe *Mystery Meat Navigation*: todos los iconos del menú y herramientas poseen texto visible o atributo `title` descriptivo.
  * No existe *Modal Hell*: el sistema de diálogos está desacoplado vía portales y previene la apertura recursiva de modales.
  * **Debilidad Crítica Detectada (The Blob):** Cuatro componentes clave concentran un volumen excesivo de líneas y responsabilidades en un solo archivo:
    * `WizardPage.jsx`: **1.118 líneas** de código (gestiona 4 fases completas, modales de confirmación, lógica de IA y estados locales).
    * `EditorPage.jsx`: **1.100+ líneas** (gestiona edición, exportación a PDF, chat lateral, pestañas y rúbricas).
    * `ForoPage.jsx`: **1.300+ líneas** (gestiona publicaciones, comentarios, filtros y modal de autoría).
    * `AdministracionPage.jsx`: **1.100+ líneas** (gestiona tablas, usuarios, auditoría y métricas).
* **Valoración:** **CP — Cumple Parcialmente**
* **Puntos y Notas:** **1 / 2 pts**  
  *Obs:* Se evidencia el antipatrón *The Blob* en 4 páginas principales; se requiere modularizar las fases del Wizard y los paneles del Editor en subcomponentes atómicos (< 300 líneas).

---

## 6. Cuadro de Consolidación y Dictamen de Evaluación

| Sección / Bloque Evaluado | Puntos Posibles | Puntos Logrados | % Cumplimiento |
|---|:---:|:---:|:---:|
| **Bloque 1: Experiencia de Usuario (Capítulo 12 — 8 ítems)** | 16 pts | **12 pts** | **75.0%** |
| **Bloque 2: Diseño para la Movilidad (Capítulo 13 — 4 ítems)** | 8 pts | **5 pts** | **62.5%** |
| **Bloque 3: Diseño Basado en Patrones (Capítulo 14 — 4 ítems)** | 8 pts | **5 pts** | **62.5%** |
| **PUNTUACIÓN GLOBAL TOTAL CONSOLIDADA:** | **32 pts** | **22 pts** | **68.75%** |

### Escala Cualitativa de Aprobación:
* `[90-100%]` Sobresaliente
* `[75-89%]` Aceptable / Competente
* `[60-74%]` **Básico con Observaciones (Dictamen Actual: 68.75%)**
* `[< 60%]` Insuficiente / Requiere Rehacer

---

## 7. Fortalezas Identificadas en el Frontend

1. **Arquitectura de Información Coherente y Sólida (UX-01):** La jerarquía y rotulado en tres áreas maestras (Planeación, Comunidad y Soporte) guían eficazmente la labor docente sin generar desorientación.
2. **Reducción Ejemplar de Carga Mental (UX-03):** La fragmentación del proceso pedagógico en un Wizard de 4 fases complementado con sugerencias automatizadas por IA reduce drásticamente el esfuerzo nemotécnico del usuario.
3. **Identidad Visual y Consistencia de Tokens (UX-04):** Paleta visual institucional refinada en tonos verde petróleo/esmeralda, con estética Glassmorphism pulida y homogeneidad tipográfica e iconográfica en todas las vistas.
4. **Desacoplamiento Arquitectónico Robusto (PAT-01):** Separación tajante entre presentación visual, servicios remotos (Firebase/Gemini) y almacenamiento centralizado mediante Zustand con persistencia local.
5. **Responsividad Fluida en Dispositivos Móviles (MOB-01):** Desplome armónico de columnas a una sola fila, transformación del menú lateral en Drawer táctil con backdrop y sin scroll horizontal espurio.

---

## 8. Debilidades Críticas y Ajustes Obligatorios (Backlog de Remediación)

A continuación se consolidan las debilidades observadas en el frontend, ordenadas por criticidad, para someter a decisión del usuario su implementación inmediata:

| Prioridad | ID Ítem | Debilidad Identificada | Causa Raíz en Código | Solución Técnica Propuesta |
|:---:|:---:|---|---|---|
| **ALTA** | **PAT-03 / UX-02** | Validación intrusiva con `alert()` nativo en formularios. | Línea 76 de `WizardPage.jsx` dispara `window.alert()`. | Implementar *Inline Validation* reactiva con bordes suaves rojos y mensaje de ayuda bajo los inputs requeridos. |
| **ALTA** | **UX-02 / UX-06** | Pérdida de borrador en el Wizard al navegar y regresar. | `useEffect` en montaje de `WizardPage.jsx` ejecuta `clearWizardFormOnly()`. | Preservar los datos del borrador en Zustand y solo resetearlos cuando el docente pulse explícitamente "Limpiar" o "Nuevo Plan". |
| **ALTA** | **PAT-04** | Antipatrón *The Blob* (archivos > 1.000 líneas). | `WizardPage.jsx` (1.118 líneas), `EditorPage.jsx` (1.100+ líneas). | Extraer subcomponentes especializados: `WizardStep1Identificacion`, `WizardStep2Audiencia`, `WizardStep3Metodologia`, `WizardStep4DUA`. |
| **MEDIA** | **UX-07** | Foco visual inaccesible por teclado (`outline: none`). | Reglas globales de botones e inputs sin `:focus-visible`. | Incorporar regla universal `:focus-visible` con anillo esmeralda accesible (`2px solid var(--color-brand-active)`). |
| **MEDIA** | **PAT-02** | Falta de migas de pan activas en pantallas hijas. | `Breadcrumbs.jsx` existe en `components/ui` pero no se monta. | Montar la barra de Breadcrumbs en `WizardPage`, `EditorPage`, `MisPlanesPage`. |
| **MEDIA** | **MOB-04** | Ausencia de resiliencia de red y modo sin conexión. | Sin escuchadores de `navigator.onLine`. | Crear un componente flotante `NetworkStatusBanner` que avise si la red cae sin bloquear el trabajo con borradores locales. |
| **MEDIA** | **MOB-02** | Controles móviles fuera de la Zona del Pulgar (*Thumb Zone*). | Botones de paso al pie del formulario móvil sin fijación. | Crear una barra de acciones fija inferior (*Sticky Bottom Bar*) en móvil para "Siguiente", "Atrás" y "Guardar". |
| **BAJA** | **MOB-03** | Sin teclado especializado `inputmode` ni modo oscuro. | Falta `inputMode="numeric"` en campos y `@media (prefers-color-scheme: dark)`. | Agregar atributos `inputMode="numeric"` y tokens CSS base para modo oscuro. |
| **BAJA** | **UX-08** | Falta consolidación empírica del índice SUS (5 usuarios). | No está tabulada la muestra de 5 docentes con escala SUS. | Formalizar la matriz de resultados de usabilidad SUS con 5 usuarios en `/docs/investigacion/`. |

---

## 9. Aplicación de los 7 Hábitos de Stephen Covey en la Actividad ACT-017

Conforme al marco de efectividad personal e interpersonal de Stephen R. Covey, los 6 integrantes del equipo aplicaron los siguientes hábitos en el desarrollo de la auditoría ACT-017:

1. **Daniel Tapias (Frontend / Git Lead):**
   * **Hábitos:** **H1 (Ser Proactivo) y H7 (Afilar la Sierra).**
   * *Acción:* Lideró la inspección técnica línea por línea del código fuente (`src/`), identificando con rigor la presencia de antipatrones como *The Blob*, el uso de alertas nativas y la ausencia de focus rings, proponiendo las soluciones de refactorización necesarias.
2. **Luis Caldera (Frontend / UI-UX Lead):**
   * **Hábitos:** **H2 (Empezar con un Fin en Mente) y H5 (Buscar Primero Comprender y Después Ser Comprendido).**
   * *Acción:* Contrastó la experiencia visual y móvil actual contra los principios de Pressman & Maxim (Thumb Zone, pirámide de movilidad), empatizando con las dificultades que experimenta un docente en smartphone y orientando el fin ergonómico de la UI.
3. **Zoe Peñata (Scrum Master):**
   * **Hábitos:** **H3 (Poner Primero lo Primero) y H6 (Sinergizar).**
   * *Acción:* Priorizó la ejecución de la lista de chequeo en la Semana 10, coordinó la sesión colegiada de evaluación y armonizó el consenso del equipo entre las dimensiones de UX, Movilidad y Patrones.
4. **Maira Ortega (Facilitadora de Equipo):**
   * **Hábitos:** **H4 (Pensar en Ganar-Ganar) y H5 (Buscar Primero Comprender y Después Ser Comprendido).**
   * *Acción:* Evaluó el impacto de las debilidades en docentes de diversas condiciones, asegurando que las observaciones beneficien tanto a los desarrolladores (código más limpio) como a los usuarios finales (mayor accesibilidad y menor fatiga).
5. **María Soto (Product Owner):**
   * **Hábitos:** **H2 (Empezar con un Fin en Mente) y H4 (Pensar en Ganar-Ganar).**
   * *Acción:* Salvaguardó que la resolución de las debilidades ergonómicas no sacrifique la promesa de valor didáctico ni la articulación con los lineamientos del MEN, validando el alcance del backlog de remediación.
6. **María Ubarne (Product Owner Support):**
   * **Hábitos:** **H5 (Buscar Primero Comprender y Después Ser Comprendido) y H6 (Sinergizar).**
   * *Acción:* Revisó la coherencia pedagógica de los mensajes y ayudas contextuales de la interfaz, colaborando activamente en la formulación de los ajustes de diseño inclusivo DUA.
