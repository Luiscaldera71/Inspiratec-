# FICHA DE ACTIVIDAD — INSPIRATEC

## 1. Información General
- **ID de la Actividad:** ACT-008
- **Nombre:** Definir la Ventana Estándar
- **Fase MODESEC:** Diseño Computacional / Diseño Multimedial
- **Semana de la Guía:** Semana 06
- **Prioridad:** Alta
- **Estado:** COMPLETADA (Estandarizada y Alineada con Glassmorphism 2026)
- **Responsables Principales:** Daniel Tapias (Frontend / Estilos Globales), Luis Caldera (UX / Arquitectura Visual)
- **Participación:** Equipo completo (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne) — Participación verificada y trazada.

---

## 2. Objetivo de la Actividad
Definir, estructurar y formalizar una **Ventana Estándar** para el ecosistema educativo **INSPIRATEC** bajo la metodología **MODESEC** y los principios de Interacción Humano-Computador (HCI), garantizando:
1. La delimitación explícita de las **cinco (5) áreas funcionales** requeridas por MODESEC: **Header**, **Menú de Navegación**, **Área de Contenido**, **Botonera de Acciones** y **Footer de Contexto**.
2. La adopción sistemática del lenguaje visual **Glassmorphism 2026** (fondos translúcidos esmerilados con `backdrop-blur`, paleta institucional petróleo `#080f0d`, verde esmeralda `#142b25`, dorado `#d4af37` y teal `#10b981`).
3. La coherencia arquitectónica que sirve como molde y plantilla maestra para las 15 interfaces del software, reduciendo la carga cognitiva docente y facilitando el acceso a contenidos formativos en $\le 2$ clics.

---

## 3. Desarrollo y Metodología

### 3.1. Fundamentación en MODESEC
En la etapa de Diseño Multimedial de MODESEC, la ventana estándar previene la fragmentación visual del software educativo. En lugar de diseñar pantallas aisladas, se establece una gramática de diseño consistente donde cada área cumple un rol pedagógico y ergonómico inmutable:

1. **Header (Cápsula Flotante Superior):** Ubicado en la parte superior derecha (`top: 16px`, `right: 24px`), aloja el botón de colapso de cajón contextual (`>`), el chip de estado de los servicios inteligentes (`Configuración IA • Lista` con indicador lumínico verde) y el avatar del docente con acceso al menú de perfil y cierre de sesión.
2. **Menú de Navegación (Dock Lateral Flotante):** Barra vertical en glassmorphism oscuro anclada a la izquierda, que contiene el isotipo institucional, el conmutador de ancho y accesos directos iconográficos persistentes a Inicio, Planificador Wizard, Mis Planes (con badge dinámico de conteo), Mi ADN Pedagógico, Biblioteca, Administración, Plantillas PEI, Experiencias y Foro.
3. **Área de Contenido (Workspace Central):** Lienzo principal sobre superficie esmerilada de alta legibilidad que presenta el Hero Card de bienvenida (`ESPACIO CURRICULAR DOCENTE`), tarjetas de métricas en vivo (`MIS PLANES GUARDADOS: 3` y `ASISTENTE PEDAGÓGICO ACTIVO`) y el catálogo de secuencias curriculares.
4. **Botonera de Acciones (Interacción Contextual):** Botón primario de alta prominencia visual (`+ Iniciar Planificador de Clases`), botón secundario (`Ver Plantillas Curriculares`), enlace de calibración rápida de identidad institucional (`Metodología Institucional: ABP • Calibrar / Cambiar`) y botones de navegación seccional.
5. **Footer (Metadatos y Contexto):** Franja inferior que confirma la alineación oficial con los estándares curriculares del Ministerio de Educación Nacional (MEN), estado de sincronización en tiempo real con Firebase (`Sincronizado Cloud`), versión técnica de producción (v2.4.0) y derechos de autor.

### 3.2. Selección de la Ventana Real en Producción
Se seleccionó la vista del **Dashboard de Inicio Docente (`/home`)** como el estándar maestro, dado que está plenamente operativa, se conecta a los servicios backend y refleja fielmente los estándares de accesibilidad universal (DUA) y diseño responsive.

---

## 4. Participación del Equipo y Roles

- **Daniel Tapias (Desarrollador / Frontend):** Lideró la consolidación técnica del CSS global en `src/index.css`, la programación del diagrama vectorial interactivo SVG (`VENTANA_ESTANDAR.svg`) y la integración del Header cápsula y el Sidebar dock con React Router v7. *(Participación verificada en repositorio)*.
- **Luis Caldera (Desarrollador / Frontend & UI):** Definió las proporciones áureas, los radios de curvatura (`border-radius: 12px a 24px`) y los contrastes de accesibilidad WCAG AAA para las tarjetas esmeriladas. *(Participación verificada en repositorio)*.
- **Zoe Peñata (Scrum Master):** Aseguró la alineación de la actividad con los requerimientos de la Semana 06 de la Guía, facilitó la revisión entre pares y organizó el cronograma de entregables. *(Participación reportada)*.
- **Maira Ortega (Facilitadora de Equipo / UI):** Realizó pruebas de usabilidad y ergonomía en diversas resoluciones de pantalla, verificando la facilidad de pulsación de los botones de acción para docentes con distintas habilidades tecnológicas. *(Participación reportada)*.
- **María Soto (Product Owner):** Validó que la distribución espacial colocara en primer plano la actividad curricular del docente, garantizando que el acceso al planificador y a las métricas sea inmediato. *(Participación reportada)*.
- **María Ubarne (Product Owner - Apoyo Curricular):** Articuló la integración de la franja de calibración metodológica institucional dentro del Hero Card de la ventana estándar. *(Participación reportada)*.

---

## 5. Aplicación de los 7 Hábitos de Stephen R. Covey en ACT-008

Conforme al marco de efectividad personal e interpersonal establecido en [ACT-016](../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md), cada integrante aplicó los 7 hábitos de Covey de manera concreta en la ejecución de ACT-008:

| Integrante | Rol Oficial | Hábitos Predominantes | Evidencia Operativa en ACT-008 |
|---|---|:---:|---|
| **Daniel Tapias** | Desarrollador / Frontend | **H1 (Ser Proactivo)<br>H7 (Afilar la Sierra)** | Tomó la iniciativa de actualizar el estándar visual obsoleto hacia *Glassmorphism 2026*, depurando el código CSS global y codificando el esquema vectorial SVG de alta definición con las 5 áreas funcionales claramente rotuladas. |
| **Luis Caldera** | Desarrollador / UI-UX | **H2 (Empezar con un Fin en Mente)<br>H4 (Pensar en Ganar-Ganar)** | Diseñó la distribución espacial concibiendo la experiencia completa del docente: una interfaz que ahorra tiempo al usuario y enaltece el software (Ganar-Ganar), asegurando que el Dock lateral y el Header cápsula mantengan el espacio de trabajo despejado. |
| **Zoe Peñata** | Scrum Master | **H3 (Poner Primero lo Primero)<br>H6 (Sinergizar)** | Priorizó la delimitación rigurosa de las 5 zonas exigidas por MODESEC antes de maquetar pantallas derivadas, articulando sinérgicamente los aportes técnicos de frontend con los requerimientos pedagógicos del equipo. |
| **Maira Ortega** | Facilitadora de Equipo | **H5 (Buscar Primero Comprender y Después Ser Comprendido)** | Analizó la ventana poniéndose en el lugar de docentes con baja alfabetización digital o con dispositivos de gama media, garantizando tamaños táctiles amplios (`min-height: 42px`), jerarquía tipográfica legible y ausencia de elementos saturados. |
| **María Soto** | Product Owner | **H2 (Empezar con un Fin en Mente)<br>H5 (Buscar Primero Comprender)** | Verificó que el área central de Contenido resolviera las necesidades esenciales del docente escolar: visualización rápida de sus planes guardados, acceso en un clic al planificador y confirmación del estado operativo del asistente IA. |
| **María Ubarne** | Product Owner (Apoyo) | **H6 (Sinergizar)<br>H4 (Pensar en Ganar-Ganar)** | Integró la franja de calibración del ADN metodológico del colegio en el área de Acciones, generando una sinergia entre el modelo pedagógico institucional y las herramientas de automatización curricular. |

---

## 6. Productos y Evidencias

| Entregable | Formato | Ubicación en el Repositorio | Descripción |
|:---|:---:|:---|:---|
| **Documento Maestro de la Ventana Estándar** | Markdown (`.md`) | [`docs/diseno-multimedial/VENTANA_ESTANDAR.md`](../diseno-multimedial/VENTANA_ESTANDAR.md) | Especificación metodológica y técnica completa con tabla analítica de las 5 áreas MODESEC y tokens de diseño. |
| **Diagrama Vectorial Explicativo (SVG)** | SVG (`.svg`) | [`docs/diseno-multimedial/VENTANA_ESTANDAR.svg`](../diseno-multimedial/VENTANA_ESTANDAR.svg) | Gráfico vectorial en alta fidelidad con callouts técnicos rotulados y líneas conectoras hacia las 5 zonas. |
| **Captura de Producción Real** | Imagen (`.png`) | [`docs/evidencias/ACT-008/ACT-008_VENTANA_ESTANDAR_INSPIRATEC.png`](../evidencias/ACT-008/ACT-008_VENTANA_ESTANDAR_INSPIRATEC.png) | Evidencia visual directa del Dashboard de Inicio en ejecución local/producción. |
| **Ficha de Actividad** | Markdown (`.md`) | [`docs/actividades/ACT-008_VENTANA_ESTANDAR.md`](./ACT-008_VENTANA_ESTANDAR.md) | Ficha de trazabilidad y formalización del entregable oficial. |
| **Registro de Inteligencia Artificial** | Markdown (`.md`) | [`docs/ia/REGISTRO_IA_ACT-008.md`](../ia/REGISTRO_IA_ACT-008.md) | Registro del soporte de IA bajo metodología ROCAS. |

---

## 7. Integración de IA
- **Registro Formal:** [`REGISTRO_IA_ACT-008.md`](../ia/REGISTRO_IA_ACT-008.md)
- **Metodología Empleada:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida).
- **Control Humano:** Verificación en el DOM de la aplicación, auditoría de hojas de estilo (`src/index.css`) y validación de contrastes de color.

---

## 8. Evaluación y Monitoreo
- **Cumplimiento de Criterios MODESEC:** 5/5
- **Calidad de Diseño y Estética (Glassmorphism 2026):** 5/5
- **Evidencia Visual y Vectorial:** 5/5
- **Documentación y Trazabilidad de Roles (Covey):** 5/5
- **Coherencia Arquitectónica:** 5/5
- **Observaciones:** La ventana estándar se encuentra plenamente consolidada y aprobada como modelo canónico para el desarrollo de las actividades de diseño y programación subsecuentes.
