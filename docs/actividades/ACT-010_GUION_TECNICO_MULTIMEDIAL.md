# ACT-010 — Elaboración del Guion Técnico Multimedial

## 1. Información General
- **ID de la Actividad:** ACT-010 (Actividad 8 del Cronograma de Trabajo)
- **Nombre Oficial:** Elaboración del Guion Técnico Multimedial
- **Semana de Ejecución:** Semana 6 / Semana 10 (Consolidación)
- **Prioridad:** Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial)
- **Producto Esperado:** `GUION_TECNICO_MULTIMEDIAL.md` en la raíz del proyecto y en `docs/diseno-multimedial/`.

---

## 2. Objetivo y Justificación

### Objetivo General
Elaborar el **Guion Técnico Multimedial integral de INSPIRATEC**, documentando la totalidad de la aplicación ventana por ventana, desde la pantalla inicial hasta el último módulo funcional y cuadro de diálogo modal, basándose estrictamente en el código fuente implementado, las hojas de estilo vigentes y la ejecución en vivo del software.

### Justificación Técnica
Bajo el marco de ingeniería de software educativo y la metodología MODESEC, el guion técnico multimedial formaliza el inventario completo de componentes gráficos, recursos sonoros, visuales, de animación y de interacción, asegurando la trazabilidad de cada botón, campo, evento (`onClick`, `onChange`, `onSubmit`) y acción del sistema, garantizando que el diseño implementado responda fielmente a las especificaciones curriculares y de accesibilidad DUA.

---

## 3. Responsables y Participantes

| Integrante | Rol Scrum Oficial | Contribución Específica en ACT-010 |
|---|---|---|
| **Daniel Tapias** | Development Team / Git Lead | Auditoría integral del código en `src/`, mapeo de eventos, rutas en `App.jsx`, tokens CSS y generación del documento maestro. |
| **Luis Caldera** | Development Team / UI-UX Lead | Levantamiento fotográfico de capturas reales de la interfaz Glassmorphism y validación de componentes de interacción. |
| **María Soto** | Product Owner | Verificación de coherencia entre los elementos técnicos del planificador y los lineamientos de la Guía 30 del MEN. |
| **María Ubarne** | Product Owner Support | Auditoría de componentes DUA en el editor y accesibilidad por voz (Web Speech API) en la biblioteca de materiales. |
| **Zoe Peñata** | Scrum Master | Control de calidad del formato institucional de 6 columnas y verificación de exhaustividad de las 15 ventanas. |
| **Maira Ortega** | Facilitadora de Equipo | Revisión de legibilidad tipográfica (Lora/DM Sans), flujos de navegación y trazabilidad de modales. |

---

## 4. Estructura y Entregables Generados

- **Documento Maestro en la Raíz:** [`GUION_TECNICO_MULTIMEDIAL.md`](../../GUION_TECNICO_MULTIMEDIAL.md)
- **Copia de Respaldo Institucional:** [`docs/diseno-multimedial/GUION_TECNICO_MULTIMEDIAL.md`](../diseno-multimedial/GUION_TECNICO_MULTIMEDIAL.md)
- **Carpeta de Evidencias y Capturas Reales:** `docs/evidencias/ACT-010/`
  - `V01_inicio.png` (Ventana de Inicio)
  - `V02_planificador.png` (Planificador de Clases — Vista General)
  - `V02_planificador_fase1.png` (Planificador — Fase 1: Información básica y ADN)
  - `V02_planificador_fase2.png` (Planificador — Fase 2: Metodología y Metas)
  - `V02_planificador_fase3.png` (Planificador — Fase 3: Estándares y DBA)
  - `V02_planificador_fase4.png` (Planificador — Fase 4: Inclusión DUA/PIAR)
  - `V02_planificador_grafo.png` (Planificador — Grafo Interactivo de Prerrequisitos MEN)
  - `V03_editor.png` (Editor Curricular y Co-docente IA)
  - `V04_mis_planes.png` (Mis Planes Guardados)
  - `V05_adn_pedagogico.png` (Mi ADN Pedagógico & Estudio Transversal — Vista General)
  - `V05_adn_pedagogico_pestana1.png` (ADN — Pestaña 1: Memoria de Éxito Automática)
  - `V05_adn_pedagogico_pestana2.png` (ADN — Pestaña 2: Caja de Herramientas y DUA)
  - `V05_adn_pedagogico_pestana3.png` (ADN — Pestaña 3: Matriz de Transversalidad)
  - `V05_adn_pedagogico_pestana4.png` (ADN — Pestaña 4: Recursos Probados en Aula)
  - `V06_plantillas.png` (Plantillas Curriculares)
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
- **Registro de Uso de IA:** [`docs/ia/REGISTRO_IA_ACT-010.md`](../ia/REGISTRO_IA_ACT-010.md)

---

## 5. Aplicación de los 7 Hábitos de Stephen R. Covey en ACT-010

Conforme al marco de efectividad personal e interpersonal establecido en [ACT-016](../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md) (Sección 5.16), cada integrante aplicó los 7 hábitos de Covey de manera concreta en la ejecución de ACT-010:

| Integrante | Rol Oficial | Hábitos Predominantes | Evidencia Operativa en ACT-010 |
|---|---|:---:|---|
| **Daniel Tapias** | Development Team / Git Lead | **H1 (Ser Proactivo)<br>H3 (Poner Primero lo Primero)<br>H7 (Afilar la Sierra)** | Lideró la estructuración de la matriz técnica de 6 columnas (`Ventana`, `Elemento`, `Descripción`, `Formato/Fuente`, `Acción`, `Evento`), auditando 86 elementos reales en `src/pages/*` y formalizando el documento maestro `GUION_TECNICO_MULTIMEDIAL.md` en la raíz. |
| **Luis Caldera** | Development Team / UI-UX Lead | **H1 (Ser Proactivo)<br>H6 (Sinergizar)** | Respaldó la documentación con el archivo de capturas reales en `docs/evidencias/ACT-010/` y la verificación de tokens visuales, animaciones CSS/SVG y componentes Glassmorphism 2026. |
| **Zoe Peñata** | Scrum Master | **H3 (Poner Primero lo Primero)** | Priorizó el control de calidad y la verificación de trazabilidad técnica, asegurando que no existan componentes ni recursos multimedia inventados y que se cumpla la totalidad de las ventanas y modales. |
| **Maira Ortega** | Facilitadora de Equipo | **H5 (Buscar Primero Comprender y Después Ser Comprendido)** | Validó la correspondencia entre los eventos registrados y las respuestas perceptibles en pantalla para docentes usuarios, garantizando claridad en las respuestas del sistema. |
| **María Soto** | Product Owner | **H2 (Empezar con un Fin en Mente)** | Aseguró la alineación del guion técnico con la intencionalidad formativa del software y las directrices curriculares del MEN, validando la coherencia pedagógica de las acciones y eventos. |
| **María Ubarne** | Product Owner Support | **H6 (Sinergizar)** | Auditó la consistencia técnica de las llamadas a la Web Speech API para síntesis vocal en los materiales didácticos generados y la articulación sinérgica de los controles inclusivos DUA. |
