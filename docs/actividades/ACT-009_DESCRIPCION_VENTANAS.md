# ACT-009 — Descripción de Ventanas

## 1. Información General
- **ID de la Actividad:** ACT-009 (Actividad 7 del Plan de Trabajo)
- **Nombre:** Descripción de Ventanas
- **Semana de Ejecución:** Semana 6 / Semana 10 (Consolidación)
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial)
- **Producto Esperado:** `DESCRIPCION_VENTANAS.md` en la raíz del proyecto y en `docs/diseno-multimedial/`.

---

## 2. Objetivo y Justificación

### Objetivo General
Documentar formal y exhaustivamente la interfaz gráfica de usuario de INSPIRATEC mediante la inspección real de cada ventana, describiendo sus áreas principales, elementos multimedia, tipografía, acciones del usuario, botones y mecanismos de navegación, siguiendo el formato estándar de MODESEC.

### Justificación Técnica
La descripción de ventanas constituye el inventario funcional y visual de referencia para el equipo de desarrollo, el aseguramiento de la calidad (QA) y la validación pedagógica. Asegura que cada pantalla implementada en el código fuente (`src/pages/*`) cumpla con los principios de diseño DUA, la regla de accesibilidad WCAG y la coherencia metodológica con la Guía 30 del MEN.

---

## 3. Participantes y Roles Scrum

| Participante | Rol Scrum Oficial | Contribución en ACT-009 |
|---|---|---|
| **Zoe Peñata** | Scrum Master | Facilitación del sprint, control de completitud del inventario de ventanas y verificación del formato institucional. |
| **Luis Caldera** | Development Team / UI-UX Lead | Levantamiento de capturas de pantalla reales en alta resolución del sistema Glassmorphism y mapeo visual. |
| **Daniel Tapias** | Development Team / Git Lead | Auditoría técnica de rutas en `App.jsx`, verificación de eventos DOM (`onClick`, `onChange`), props y serialización Markdown. |
| **Maira Ortega** | Facilitadora de Equipo | Revisión de consistencia en textos instruccionales y verificación de la carga cognitiva en la navegación. |
| **María Soto** | Product Owner | Validación de coherencia curricular de las plantillas y alineación con los momentos didácticos del MEN. |
| **María Ubarne** | Product Owner Support | Auditoría de componentes inclusivos DUA y accesibilidad por voz (Web Speech API) en la biblioteca. |

---

## 4. Evidencias y Productos Generados

- **Documento Maestro:** [`DESCRIPCION_VENTANAS.md`](../../DESCRIPCION_VENTANAS.md)
- **Copia Institucional:** [`docs/diseno-multimedial/DESCRIPCION_VENTANAS.md`](../diseno-multimedial/DESCRIPCION_VENTANAS.md)
- **Carpeta de Evidencias Fotográficas Reales (`docs/evidencias/ACT-009/`):**
  - `V01_inicio.png` (Ventana de Inicio)
  - `V04_mis_planes.png` (Mis Planes de Clase — Repositorio Personal)
  - `V05_adn_pedagogico.png` (Mi ADN Pedagógico & Estudio Transversal — Vista General)
  - `V05_adn_pedagogico_pestana1.png` (ADN — Pestaña 1: Memoria de Éxito Automática)
  - `V05_adn_pedagogico_pestana2.png` (ADN — Pestaña 2: Caja de Herramientas y DUA)
  - `V05_adn_pedagogico_pestana3.png` (ADN — Pestaña 3: Matriz de Transversalidad)
  - `V05_adn_pedagogico_pestana4.png` (ADN — Pestaña 4: Recursos Probados en Aula)
  - `V06_plantillas.png` (Mis Estructuras de Clase — Catálogo de Modelos)
  - `V02_planificador.png` (Planificador de Clases — Vista General)
  - `V02_planificador_fase1.png` (Planificador — Fase 1: Información básica y ADN)
  - `V02_planificador_fase2.png` (Planificador — Fase 2: Metodología y Metas)
  - `V02_planificador_fase3.png` (Planificador — Fase 3: Estándares y DBA)
  - `V02_planificador_fase4.png` (Planificador — Fase 4: Inclusión DUA/PIAR)
  - `V02_planificador_grafo.png` (Planificador — Grafo Interactivo de Prerrequisitos MEN)
  - `V03_editor.png` (Editor Curricular y Co-docente IA)
  - `V07_biblioteca.png` (Biblioteca Comunitaria — Recursos Abiertos)
  - `V08_experiencias.png` (Banco de Experiencias Pedagógicas — Vista Comunidad)
  - `V08_experiencias_mis_experiencias.png` (Banco de Experiencias — Mis Experiencias Sistematizadas)
  - `V09_foro.png` (Foro Docente Interactivo — Diálogo y Comunidades)
  - `V10_configuracion.png` (Configuración de IA Gemini — Vista General)
  - `V10_configuracion_ia.png` (Configuración de IA — Pestaña 1: API Key BYOK)
  - `V10_configuracion_autodiagnostico.png` (Configuración — Pestaña 2: Autodiagnóstico Felder-Silverman y Gráfico Radial DUA)
  - `V10_administracion.png` (Panel de Administración y Control — Vista General)
  - `V10_administracion_analiticas.png` (Administración — Pestaña 1: Analíticas y Métricas Gráficas)
  - `V10_administracion_directorio.png` (Administración — Pestaña 2: Directorio de Docentes y Habeas Data)
  - `V10_administracion_adn_colectivo.png` (Administración — Pestaña 3: Identidad & ADN Pedagógico Colectivo)
  - `V10_administracion_tickets.png` (Administración — Pestaña 4: Tickets de Soporte y Atención)
  - `V12_ayuda.png` (Centro de Ayuda Pedagógica — Base de Conocimiento y Guías)
  - `V13_soporte.png` (Soporte Técnico Institucional — Mesa de Ayuda y Tickets)
  - `V14_acerca.png` (Acerca de INSPIRATEC — Identidad, Propósito y Equipo Creador)
  - `V15_auth_login.png` (Ventana de Autenticación — Inicio de Sesión y Acceso Seguro)
  - `V15_auth_registro.png` (Ventana de Autenticación — Registro Docente y Habeas Data)
  - `M02_bienvenida_narrativa.png` (Modal Inmersivo — Bienvenida a INSPIRATEC)
  - `M05_menu_usuario.png` (Apartado de Usuario — Popover Menú Desplegable)
  - `M06_informacion_docente.png` (Ventana Emergente — Información del Docente y Habeas Data)
  - `M07_cambiar_contrasena.png` (Ventana Emergente — Cambio Seguro de Contraseña)
- **Registro de Uso de IA:** [`docs/ia/REGISTRO_IA_ACT-009.md`](../ia/REGISTRO_IA_ACT-009.md)

---

## 4. Aplicación de los 7 Hábitos de Stephen R. Covey en ACT-009

Conforme al marco de efectividad personal e interpersonal establecido en [ACT-016](../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md) (Sección 5.15), cada integrante aplicó los 7 hábitos de Covey de manera concreta en la ejecución de ACT-009:

| Integrante | Rol Oficial | Hábitos Predominantes | Evidencia Operativa en ACT-009 |
|---|---|:---:|---|
| **Zoe Peñata** | Scrum Master | **H3 (Poner Primero lo Primero)<br>H6 (Sinergizar)** | Como Scrum Master, coordinó la actualización integral de la matriz institucional de descripción de ventanas, asegurando que cada una de las 15 pantallas y 5 modales cumpla los 9 campos obligatorios de MODESEC sin omitir información comprobable. |
| **Luis Caldera** | Development Team / UI-UX Lead | **H1 (Ser Proactivo)<br>H5 (Buscar Primero Comprender)** | Gestionó el levantamiento fotográfico real de alta fidelidad sobre la interfaz en ejecución, empatizando con el usuario docente para describir con precisión las zonas de interacción, los elementos multimedia y los botones de acción. |
| **Daniel Tapias** | Development Team / Git Lead | **H1 (Ser Proactivo)<br>H7 (Afilar la Sierra)** | Auditó las rutas en `src/App.jsx`, los manejadores de eventos DOM (`onClick`, `onChange`) y los estados en Zustand, afilando la sierra para que la documentación Markdown (`DESCRIPCION_VENTANAS.md`) refleje exactamente el código fuente implementado. |
| **Maira Ortega** | Facilitadora de Equipo | **H5 (Buscar Primero Comprender y Después Ser Comprendido)** | Revisó la comprensibilidad de los textos instruccionales y las acciones del usuario, garantizando que el guion describa la experiencia pedagógica real sin ambigüedades técnicas para el maestro. |
| **María Soto** | Product Owner | **H2 (Empezar con un Fin en Mente)<br>H4 (Pensar en Ganar-Ganar)** | Validó que la descripción de las plantillas y el planificador responda al propósito constructivista de beneficio mutuo ganar-ganar entre docente y estudiante, facilitando la planeación curricular de calidad. |
| **María Ubarne** | Product Owner Support | **H5 (Buscar Primero Comprender)<br>H6 (Sinergizar)** | Comprobó que los elementos de accesibilidad (síntesis de voz en biblioteca, adaptaciones DUA y radar polar en configuración) estuvieran formalmente registrados sin invenciones. |
