# INSPIRATEC — Documentación Técnica de Actualización Visual, Glassmorphism y Sistema de Modales

**Fecha de Actualización:** Octubre 2026  
**Proyecto:** INSPIRATEC — Software Educativo para la Planeación Curricular y Generación de Instrumentos Didácticos  
**Equipo:** Grupo 2 — Licenciatura en Informática / Diseño y Desarrollo de Software Educativo III, Universidad de Córdoba  

---

## 1. Resumen Ejecutivo de Cambios

En esta fase de evolución del proyecto se refinó integralmente la experiencia de usuario (UX/UI), consolidando un lenguaje visual institucional basado en **Glassmorphism (vidrio esmerilado translúcido)**, fondos ambientales fotográficos de alta resolución, paneles con desenfoque ambiental dinámico en todas las vistas del sistema y un sistema unificado y accesible para todas las ventanas emergentes (modales, popovers y diálogos de confirmación) de la plataforma montados con `createPortal`.

---

## 2. Mejoras Específicas Realizadas

### 2.1. Barra Superior y Menú de Usuario (Armonización Asimétrica)
- **Eliminación del recuadro interior del usuario:** Se eliminó el fondo blanco sólido y el borde tosco que enmarcaba al botón de usuario en la barra superior.
- **Asimetría elegante:** Ahora el botón del usuario (`Admin` / `Docente`) se apoya orgánicamente sobre la cápsula translúcida común mediante la clase `.user-menu-btn`, integrando un avatar circular de 28px con tipografía de 13px (`font-weight: 600`, `#1E3D37`) y hover sutil, emparejándose con el estilo de **Configuración IA**.

### 2.2. Sistema Unificado de Ventanas Emergentes (`.modal-glass-*`) y Montaje Portal
Se consolidó una arquitectura modular de clases CSS en `src/index.css`:
- `.modal-glass-backdrop`: Fondo oscuro inmersivo (`rgba(14, 38, 33, 0.72)` a `rgba(8, 20, 18, 0.82)`) con desenfoque de 14px a 18px.
- `.modal-glass-card`: Tarjetas translúcidas con desenfoque de 30px (`backdrop-filter: blur(30px) saturate(140%)`), bordes de luz blanca sutil (`1px solid rgba(255, 255, 255, 0.95)`), esquinas redondeadas de 24px y sombras volumétricas.
- `.modal-glass-header` y `.modal-glass-footer`: Cabecera y pie con fondos esmerilados y líneas divisorias translúcidas casi imperceptibles.
- `.modal-glass-close-btn`: Botón de cierre ergonómico con micro-interacciones hover y soporte accesible para tecla `Escape`.
- **Garantía de Superposición Absoluta (`createPortal`):** Todas las ventanas emergentes se montan directamente en `document.body` mediante el portal de React con índice de apilamiento superior (`z-index: 9999`). Esto asegura que ningún modal quede solapado, recortado o subordinado visualmente a las barras de navegación, menús fijos o contenedores padres.
- **Bloqueo de scroll:** Todos los modales implementan bloqueo automático del scroll de fondo (`overflow: hidden` en `document.body`) mientras están visibles.

### 2.3. Despliegue de Glassmorphism Homogéneo en Todas las Vistas
Se aplicó la estética de paneles de cristal (`backdrop-filter: blur(20px)` a `30px`, fondos translúcidos `rgba(255, 255, 255, 0.82)`, bordes `rgba(255, 255, 255, 0.85)` y sombras suaves) de manera homogénea en todos los módulos de la aplicación:
1. **Administración (`AdministracionPage.jsx`):** Desenfocado de tarjetas KPI de métricas, gráficos analíticos de uso, tablas de gestión docente, filtros y tickets de soporte.
2. **Biblioteca Comunitaria (`BibliotecaPage.jsx`):** Cabecera estilizada, barra de búsqueda y filtros temáticos, tarjetas de planes compartidos y modal de previsualización con badges de grado/materia.
3. **Configuración IA (`ConfigPage.jsx`):** Paneles esmerilados para la selección de modelos, parámetros de temperatura, prompts del sistema y tokens pedagógicos.
4. **Acerca de (`AboutPage.jsx`):** Envoltura de todo el contenido y tarjetas de los integrantes del equipo en paneles de cristal de alto contraste (`.mgmt-card`), garantizando legibilidad total sobre el fondo fotográfico.
5. **Soporte Técnico (`SoportePage.jsx`):** Formulario de contacto, tickets activos y canales de atención con paneles translúcidos.
6. **Ayuda y Guías (`AyudaPage.jsx`):** Acordeones interactivos de preguntas frecuentes (FAQ) y guías paso a paso con efecto esmerilado.
7. **Foro Docente (`ForoPage.jsx`):** Hilos de discusión, debates metodológicos y respuestas enriquecidas en tarjetas de cristal.
8. **Experiencias de Aprendizaje (`ExperienciasPage.jsx`):** Sistematización de prácticas pedagógicas, filtros y muro de experiencias.
9. **Plantillas Institucionales (`PlantillasPage.jsx`):** Catálogo de estructuras pedagógicas predefinidas (DUA, ABP, Tradicional) y modal de desglose curricular.

### 2.4. Componente Reutilizable de Confirmación Destructiva (`ConfirmModal.jsx`)
- Se creó e integró `src/components/ConfirmModal.jsx` para erradicar definitivamente las alertas grises nativas del navegador (`window.confirm`).
- Funciona con portal, diseño de cristal, iconografía de advertencia y confirmación asíncrona segura en:
  - **Mis Planes (`MisPlanesPage.jsx`):** Al eliminar planes de clase del historial docente.
  - **Plantillas (`PlantillasPage.jsx`):** Al eliminar estructuras pedagógicas personalizadas.
  - **Experiencias (`ExperienciasPage.jsx`):** Al eliminar experiencias sistematizadas del muro docente.

### 2.5. Pantalla Intermedia de Carga Cinematográfica (`WizardPage.jsx` y `EditorPage.jsx`)
- Overlay inmersivo con spinner pulsante, textos reflexivos sobre co-docencia y barra de progreso durante la consulta y generación de secuencias con el motor Google Gemini.

---

## 3. Estado de Compilación y Validación
- **Vite Build:** Compilación limpia verificada con `pnpm run build` sin errores de módulos ni dependencias rotas.
- **Rendimiento y Fluidez:** Transiciones CSS aceleradas por GPU (`will-change`, `transform`) sin impacto negativo en la tasa de refresco.
- **Seguridad:** Los datos sensibles de contacto docente continúan protegidos con cifrado y persistencia validada en Firebase.
