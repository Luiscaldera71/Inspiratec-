# ACT-015 — Validar Usabilidad y Accesibilidad (DUA)

## 1. Información General
- **ID de la Actividad:** ACT-015
- **Nombre Oficial:** Validar Usabilidad y Accesibilidad
- **Semana de Ejecución:** Semana 5 y 6
- **Prioridad:** Alta
- **Estado:** COMPLETADA (Auditoría heurística y de accesibilidad DUA/WCAG 2.1 AA consolidada)
- **Marco de Evaluación:** Criterios Heurísticos de Usabilidad (Nielsen / Shneiderman) y Pautas DUA / WCAG 2.1 AA

---

## 2. Marco y Dimensiones de Evaluación

Para cada una de las pantallas desarrolladas en INSPIRATEC se realiza una auditoría heurística estructurada en tres dimensiones fundamentales:

1. **Control del Usuario:**
   - *¿Puede regresar?*: Disponibilidad de botones de retorno, breadcrumbs o historial claro.
   - *¿Puede cancelar?*: Salida segura de formularios, modales o procesos sin pérdida forzada de estado.
   - *¿La navegación es clara?*: Reconocimiento inmediato de la ubicación espacial y jerárquica en la app.
2. **Carga Cognitiva:**
   - *¿La pantalla tiene demasiada información?*: Dosificación visual, espaciado y prevención de fatiga.
   - *¿El usuario debe recordar cosas innecesariamente?*: Visibilidad de estados, persistencia y reconocimiento sobre recuerdo.
   - *¿Los iconos ayudan a reconocer funciones?*: Metáforas visuales claras con etiquetas descriptivas o tooltips.
3. **Consistencia:**
   - *¿Se utilizan los mismos colores?*: Paleta cromática unificada (verde esmeralda, translúcidos Glassmorphism, neutros).
   - *¿Los botones funcionan igual?*: Comportamiento hover, estados activos, variantes primarias/secundarias y destructivas.
   - *¿La tipografía es coherente?*: Jerarquía consistente de tamaños, pesos y soporte de fuente accesible.

---

## 3. Matriz de Auditoría Pantalla por Pantalla

### 3.1. Pantalla 1: Generador de Planes de Clase (Wizard de 4 pasos) — `WizardPage.jsx`
* **Propósito:** Asistente guiado interactivo para estructuración de secuencias curriculares conectadas con Google Gemini.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | El stepper superior y el botón inferior "Paso Anterior" permiten volver sin resetear campos de los pasos ya completados. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | El botón "Cancelar" o el logo en cabecera retornan al inicio; se solicita confirmación si existen cambios no guardados. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Barra de progreso horizontal reactiva (`Stepper`) con números y nombres de paso (Básicos, Curricular, Metodología, DUA). |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | La segmentación en 4 pasos dosifica la complejidad; no satura al docente con más de 4-5 campos simultáneos. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Los datos previos se visualizan en un resumen lateral; la IA sugiere estándares y propósitos contextualmente sin que el docente los memorice. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | Iconos de Lucide React (`Sparkles`, `BookOpen`, `CheckCircle`, `Layers`) con etiquetas textuales directas. |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Paleta esmeralda (`#1E3D37`, `#2D5A50`) con acentos ámbar y fondo fotográfico con desenfoque Glassmorphism. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botón primario verde a la derecha ("Siguiente" / "Generar Plan") y botón secundario con borde translúcido a la izquierda. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Familia tipográfica sans-serif limpia con títulos h2/h3 escalonados y texto descriptivo en 14px. |

---

### 3.2. Pantalla 2: Editor y Visor de Plan de Clase — `EditorPage.jsx`
* **Propósito:** Edición interactiva, visualización de secuencias didácticas generadas y exportación de materiales.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Botón de retorno "← Volver a Mis Planes" en la barra de herramientas superior. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Diálogo de confirmación ante cambios pendientes antes de abandonar la edición. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Tabs organizados para alternar entre "Vista Previa", "Editor Markdown", "Rúbrica" y "Materiales". |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Aceptable (3/4)** | La vista del plan completo es densa por naturaleza curricular; se mitiga con acordeones colapsables para los 3 Momentos Didácticos. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Indicadores de guardado automático en tiempo real ("Guardado en la nube") visible en cabecera. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | Iconos claros para acciones críticas: `Download` (Exportar), `Copy` (Clonar), `Share2` (Compartir) y `Sparkles` (Ajustar con IA). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Fondo de cristal translúcido (`.mgmt-card`) con panel oscuro contrastado para el texto Markdown (`#1E3D37`). |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botones de cristal con microinteracción hover; acciones de guardado con feedback en Toast. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Renderizado con React Markdown usando el mismo sistema de jerarquía que el resto del sitio. |

---

### 3.3. Pantalla 3: Mis Planes — `MisPlanesPage.jsx`
* **Propósito:** Gestión de historial de planes creados, clonados y organizados por el docente.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Menú lateral (Sidebar) activo en todo momento para retornar a cualquier sección. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Eliminación protegida por el componente modal seguro `ConfirmModal.jsx` con botón de "Cancelar" explícito. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Barra de búsqueda instantánea por título de plan y filtros rápidos por grado y materia. |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Tarjetas tipo grid con información esencial: Título, Materia, Grado, Fecha y Badges de estado. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Vista previa rápida mediante modal; el docente no necesita abrir cada plan para saber qué contiene. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `Trash2` (eliminar con confirmación), `Edit` (editar), `Eye` (previsualizar), `Copy` (duplicar). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Tarjetas en Glassmorphism translúcido con borde blanco de 1px y sombras suaves consistentes. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Acciones homogéneas por tarjeta; acción primaria destacada "Crear Nuevo Plan" arriba a la derecha. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Mismo interlineado y tipografía legible sobre fondo claro. |

---

### 3.4. Pantalla 4: Plantillas Institucionales — `PlantillasPage.jsx`
* **Propósito:** Catálogo de formatos curriculares predefinidos (DUA, ABP, Tradicional) para acelerar la planeación.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Navegación lateral persistente y breadcrumbs de apoyo. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | El modal de detalle curricular de plantilla cuenta con botón `X` de cierre y soporte de tecla `Escape`. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Filtros por nivel educativo (Primaria, Secundaria, Media) y metodología activa. |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Catálogo con tarjetas breves; el desglose profundo de los 3 Momentos Pedagógicos se abre bajo demanda en modal. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Resumen estructurado en la tarjeta que indica si la plantilla cuenta con DUA, evaluación formativa o rúbrica. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | Iconos temáticos de método (`Layers`, `CheckSquare`, `FileText`). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Badges verdes y neutros armonizados con el diseño global. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botón primario "Usar Plantilla" que redirige al Wizard precargando el formato seleccionado. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Textos institucionales legibles y jerarquía estandarizada. |

---

### 3.5. Pantalla 5: Biblioteca Comunitaria — `BibliotecaPage.jsx`
* **Propósito:** Repositorio de recursos pedagógicos, secuencias compartidas por la comunidad y descargas.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Menú lateral accesible; visor de recursos con botón explícito de regreso. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Modal de previsualización montado con `createPortal` que se cierra con clic en el backdrop o `Escape`. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Filtro por tipo de recurso (Planes, Rúbricas, Diapositivas, Juegos) y campo de búsqueda en vivo. |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Paginación o scroll fluido con tarjetas compactas; estados vacíos claros cuando no hay coincidencias. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Metadatos visibles en cada tarjeta (autor, institución, grado, fecha, valoraciones comunitarias). |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | Iconos para tipo de archivo (`FileText`, `Sliders`, `Award`, `Download`). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Cabecera y tarjetas de recursos con paneles Glassmorphism replicados idénticamente a Inicio. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botones de acción "Ver / Clonar" con interacción táctil y estados hover consistentes. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Mismo tamaño y peso tipográfico en toda la biblioteca. |

---

### 3.6. Pantalla 6: Foro Docente y Experiencias — `ForoPage.jsx` / `ExperienciasPage.jsx`
* **Propósito:** Muro de reflexiones pedagógicas, sistematización de prácticas (IAP) y debate colaborativo.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Navegación global permanente y jerarquía de hilos con navegación clara hacia el muro principal. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | El formulario de redacción de aportes o respuestas cuenta con botón "Descartar" para cancelar la edición. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Pestañas temáticas para navegar entre "Experiencias", "Metodologías Activas", "Inclusión DUA" y "Debates". |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Tarjetas de experiencias con vista colapsada y botón "Leer experiencia completa" para evitar sobrecarga. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Respuestas anidadas debajo de cada aporte para no perder el contexto de la conversación. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `MessageSquare` (comentarios), `ThumbsUp` (útil), `Share2` (compartir) y `Tag` (etiquetas temáticas). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Fondo esmerilado con paneles de cristal; etiquetas de categoría con colores institucionales suaves. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botones de interacción social homogéneos en todas las tarjetas de debate. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Cuerpo de texto en 15px con interlineado generoso (1.6) para garantizar lectura cómoda de textos largos. |

---

### 3.7. Pantalla 7: Configuración IA — `ConfigPage.jsx`
* **Propósito:** Administración de claves de API de Google Gemini, selección de modelos y parámetros del motor generativo.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Navegación lateral persistente. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Botón "Restablecer Valores Predeterminados" para revertir modificaciones sin alterar el funcionamiento. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Secciones temáticas ordenadas en paneles: Conexión API, Modelos Disponibles y Parámetros Pedagógicos. |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Explicaciones en lenguaje pedagógico claro; se ocultan complejidades técnicas irrelevantes para el docente. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Botón de prueba de conexión ("Probar Conexión") que informa en tiempo real si la clave es válida con badge verde/rojo. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `Key` (API Key), `Cpu` (Modelos), `Sliders` (Temperatura), `ShieldCheck` (Seguridad). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Tarjetas en Glassmorphism translúcido con bordes iluminados. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botón de guardado reactivo con confirmación visual Toast. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Misma escala tipográfica que el resto del sistema. |

---

### 3.8. Pantalla 8: Administración — `AdministracionPage.jsx`
* **Propósito:** Monitoreo institucional, métricas KPI de uso docente, auditoría de habeas data y tickets de soporte.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Barra lateral con acceso al resto de vistas. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Modales de gestión docente con botón de cierre claro y escape por teclado. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Dashboard segmentado en 4 bloques: Métricas KPI, Gráficos Analíticos, Tabla de Docentes y Tickets. |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Aceptable (3/4)** | Pantalla con alta densidad analítica; se organizó en tarjetas esmeriladas independientes para evitar saturación. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Tablas paginadas con buscadores integrados y filtros por estado de cuenta. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `Users` (docentes), `BarChart2` (métricas), `AlertCircle` (tickets), `Check` (habeas data aprobado). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Paneles de cristal con desenfoque de 20-30px armonizados idénticamente al resto de la app. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botones de acción en tabla (Ver detalle, Cambiar estado) estandarizados. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Números en negrita para métricas y texto tabular limpio. |

---

### 3.9. Pantalla 9: Ayuda y Soporte Técnico — `AyudaPage.jsx` / `SoportePage.jsx`
* **Propósito:** Resolución de dudas, guías interactivas, preguntas frecuentes (FAQ) y canal de contacto técnico.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Menú lateral accesible en todo momento. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Formulario de tickets con botón para limpiar/descartar campos. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Selector claro entre "Preguntas Frecuentes", "Guías Paso a Paso" y "Contactar a Soporte". |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Acordeones colapsables interactivos que muestran solo la respuesta seleccionada, reduciendo la fatiga visual. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Buscador de preguntas en tiempo real para localizar soluciones instantáneamente. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `HelpCircle` (preguntas), `LifeBuoy` (soporte), `BookOpen` (guías), `Send` (enviar ticket). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Acordeones de cristal translúcido con desenfoque suave sobre fondo fotográfico. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Animación suave de apertura y cierre con microinteracción hover. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Preguntas en negrita destacada y respuestas legibles. |

---

### 3.10. Pantalla 10: Acerca de — `AboutPage.jsx`
* **Propósito:** Presentación institucional del proyecto, equipo creador (Grupo 2) y fundamentación universitaria.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Menú lateral permanente para volver a Inicio o al Wizard. |
| **Control del Usuario** | ¿Puede cancelar? | **N/A** | Pantalla puramente informativa y de lectura. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Desplazamiento vertical fluido con tarjeta contenedora protectora (`.mgmt-card`). |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Distribución ordenada: Introducción, Misión institucional, Tarjetas de los 6 integrantes con roles y enlaces a documentación. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Información auto-contenida con badges institucionales (Talento Unicordobés). |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `Award` (roles), `Code` (desarrollo), `GraduationCap` (pedagogía). |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Corrección de contraste implementada: tarjeta translúcida de alto contraste sobre fondo fotográfico. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Enlaces y botones de GitHub con hover uniforme. |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Títulos h1 y h2 estandarizados. |

---

### 3.11. Pantalla 11: Autenticación — `AuthPage.jsx`
* **Propósito:** Inicio de sesión y registro de usuarios docentes y administradores.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar? | **Cumple (4/4)** | Enlace para alternar instantáneamente entre "Iniciar Sesión" y "Registrarse" o volver al inicio público. |
| **Control del Usuario** | ¿Puede cancelar? | **Cumple (4/4)** | Formulario liviano de 2-3 campos; inputs con opción de borrado rápido. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Enfoque centrado en tarjeta única sin distracciones externas. |
| **Carga Cognitiva** | ¿Pantalla con demasiada info? | **Cumple (4/4)** | Mínima carga cognitiva: solo correo electrónico y contraseña. |
| **Carga Cognitiva** | ¿Debe recordar cosas? | **Cumple (4/4)** | Opción interactiva de visualización de contraseña (`Eye` / `EyeOff`) para validar lo escrito antes de enviar. |
| **Carga Cognitiva** | ¿Iconos ayudan a funciones? | **Cumple (4/4)** | `Mail` en input de correo, `Lock` en contraseña, `LogIn` en botón de acceso. |
| **Consistencia** | ¿Mismos colores? | **Cumple (4/4)** | Tarjeta esmerilada centrada con fondo ambiental de la Universidad de Córdoba. |
| **Consistencia** | ¿Botones funcionan igual? | **Cumple (4/4)** | Botón primario verde institucional con estado de carga ("Iniciando sesión..."). |
| **Consistencia** | ¿Tipografía coherente? | **Cumple (4/4)** | Etiquetas de formulario claras de 14px con tipografía de alto contraste. |

---

### 3.12. Componentes Transversales y Sistema de Modales (`ConfirmModal`, `TermsModal`, `UserMenu`)
* **Propósito:** Diálogos emergentes, acuerdos legales, gestión de perfil y confirmaciones críticas.
* **Evaluación Heurística:**

| Criterio | Pregunta Evaluada | Calificación | Hallazgo y Justificación Técnica en Código |
|---|---|:---:|---|
| **Control del Usuario** | ¿Puede regresar / cancelar? | **Cumple (4/4)** | Todos los modales implementan doble mecanismo de salida: botón visible "Cancelar" / "X", clic fuera en el backdrop y tecla `Escape`. |
| **Control del Usuario** | ¿La navegación es clara? | **Cumple (4/4)** | Montaje directo en `document.body` mediante `createPortal` con `z-index: 9999`; no colisionan con menús fijos ni encabezados. |
| **Carga Cognitiva** | ¿Carga visual y foco? | **Cumple (4/4)** | Desenfoque ambiental de la pantalla de fondo (`.modal-glass-backdrop`) que enfoca 100% de la atención en el diálogo activo. |
| **Consistencia** | ¿Colores y botones? | **Cumple (4/4)** | Acciones destructivas con botón rojo/ámbar (`ConfirmModal`) y secundarias con botón translúcido neutral. |
| **Consistencia** | ¿Tipografía y scroll? | **Cumple (4/4)** | Bloqueo estricto del scroll de fondo (`overflow: hidden` en `body`) para evitar desplazamientos accidentales. |

---

## 4. Auditoría de Accesibilidad (Pautas DUA y WCAG 2.1 AA)

| Dimensión DUA / WCAG | Estado en el Software | Evidencia Técnica en Código |
|---|---|---|
| **Contraste Cromático** | **Cumple (Ratio > 4.5:1)** | Textos oscuros (`#1E3D37`, `#0E2621`) sobre tarjetas de cristal con fondo blanco translúcido (`rgba(255, 255, 255, 0.85)`) y desenfoque de 20-30px, protegiendo la lectura contra la imagen de fondo. |
| **Soporte de Teclado** | **Cumple** | Navegación por tabulación (`Tab` / `Shift+Tab`), activación por `Enter` / `Space` y cierre de modales con tecla `Escape`. |
| **Semántica HTML5** | **Cumple** | Estructura con etiquetas nativas: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. |
| **Atributos ARIA** | **Cumple** | Uso de `aria-label`, `aria-expanded`, `aria-modal="true"`, `role="dialog"` en modales y menús de usuario. |
| **Inclusión DUA en Planes** | **Cumple** | El asistente de planeación incluye en el Paso 4 opciones específicas para adaptaciones DUA y ajustes razonables PIAR. |
| **Modo de Lectura Accesible** | **Cumple** | Implementado en `src/styles/ui.css` con variables CSS para alto contraste, modo sepia, ampliación de escala tipográfica y soporte de fuente dislexia (`OpenDyslexic`). |

---

## 5. Hallazgos y Acciones de Mejora Implementadas

1. **Hallazgo:** En el *Editor de Planes*, cuando una secuencia didáctica es muy extensa, el desplazamiento vertical prolongado provocaba pérdida momentánea de la barra de acciones.
   - **Acción Implementada:** Barra de herramientas de guardado, exportación y sincronización anclada con `sticky top-4 z-20 backdrop-blur-md` en `EditorPage.jsx`.
2. **Hallazgo:** En pantallas móviles de resolución inferior a 640px, la navegación horizontal del stepper del Wizard requería scroll excesivo.
   - **Acción Implementada:** Implementado diseño adaptativo móvil en `ui.css` y `WizardPage.jsx` con indicadores numéricos circulares compactos y scroll horizontal suave con snap.
3. **Hallazgo:** Validación formal con usuarios reales docentes para medir el índice estandarizado SUS (System Usability Scale).
   - **Acción Implementada:** Consolidado en `ACT-017` con panel de 12 docentes evaluadores obteniendo un puntaje medio SUS de **86.4 / 100** (Grado A - Excelente Usabilidad).

---

## 6. Participación del Equipo en la Actividad
- **Daniel Tapias (Desarrollo Frontend):** Implementación de `createPortal`, atajos de teclado, atributos ARIA y bloqueo de scroll en modales.
- **Luis Caldera (Desarrollo Frontend / UX):** Auditoría visual de consistencia cromática, espaciados y contraste tipográfico en paneles Glassmorphism.
- **Zoe Peñata (Scrum Master):** Coordinación de la auditoría de pantallas, seguimiento a los criterios de evaluación y gestión de tiempos.
- **Maira Ortega (Facilitadora):** Revisión de la carga cognitiva docente y evaluación de metáforas visuales de iconos.
- **María Soto (Product Owner):** Validación de flujos de navegación, claridad en la cancelación y guardado de planes curriculares.
- **María Ubarne (Product Owner Support):** Auditoría pedagógica de las adaptaciones DUA y PIAR en las opciones del planificador.

---

## 7. Evaluación Académica
- **Cumplimiento:** 4 — Consolidado (Auditoría completa pantalla por pantalla con las 9 preguntas evaluadas).
- **Calidad:** 4 — Consolidado (Rigor técnico y correlato exacto con los componentes JSX desplegados).
- **Evidencia:** 4 — Consolidado (Verificable directamente en el código fuente de `src/pages/` y `src/components/`).
- **Documentación:** 4 — Consolidado (Matriz estructurada y trazable).
- **Responsabilidad:** 4 — Consolidado (Aportes documentados de los 6 integrantes según sus roles).
- **Coherencia:** 4 — Consolidado (Alineación con MODESEC, DUA y WCAG).
