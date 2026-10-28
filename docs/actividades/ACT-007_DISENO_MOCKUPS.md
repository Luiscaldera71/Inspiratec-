# ACT-007 — Diseñar Mockups de Alta Fidelidad

## 1. Información General
- **ID de la Actividad:** ACT-007 (Actividad 5 del Plan de Trabajo)
- **Nombre Oficial:** Diseñar Mockups de Alta Fidelidad
- **Semana de Ejecución:** Semana 3 / Semana 10 (Consolidación)
- **Prioridad:** Muy Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial) y Principios de Interacción de Theo Mandel
- **Ubicación de Entregables:** `docs/diseno-interface/mockups/`

---

## 2. Objetivo y Justificación

### Objetivo General
Diseñar y formalizar los mockups de alta fidelidad correspondientes a las vistas neurálgicas del software educativo INSPIRATEC, definiendo su paleta cromática, jerarquía tipográfica, iconografía, componentes de botón, distribución espacial y flujos de acción del usuario, garantizando el estricto cumplimiento de las tres reglas de oro de Theo Mandel.

### Justificación Técnica
Los mockups de alta fidelidad cierran la brecha entre el modelo conceptual (diagramas de contenido y mapas de navegación) y la implementación interactiva en código fuente. Permiten al equipo multidisciplinar auditar la ergonomía de la interfaz, el contraste cromático para docentes con fatiga visual y la disposición intuitiva de los controles pedagógicos antes del despliegue masivo en aula.

---

## 3. Participantes y Roles Scrum

| Participante | Rol Scrum Oficial | Contribución Específica en ACT-007 |
|---|---|---|
| **Luis Caldera** | Development Team / UI-UX Lead | Diseño y refinamiento de la estética Glassmorphism 2026, paleta cromática y maquetación de los 4 mockups de alta fidelidad. |
| **Daniel Tapias** | Development Team / Git Lead | Verificación de viabilidad técnica en React/Vite, exportación de capturas de alta resolución y trazabilidad de estilos en CSS. |
| **María Soto** | Product Owner | Aseguramiento de que el mockup de resultados y actividad refleje los tres momentos de clase exigidos por la Guía 30 del MEN. |
| **María Ubarne** | Product Owner Support | Validación de la accesibilidad cognitiva y apoyos DUA representados en los mockups. |
| **Zoe Peñata** | Scrum Master | Verificación del cumplimiento de los requisitos de la Semana 03 y alineación con las tres reglas de Theo Mandel. |
| **Maira Ortega** | Facilitadora de Equipo | Auditoría de la carga de memoria visual y consistencia de espaciados en la cuadrícula. |

---

## 4. Productos y Mockups Entregados

Los 26 mockups de alta fidelidad representativos del ecosistema fueron archivados en `docs/diseno-interface/mockups/`:

1. **`mockup-inicio.png`:** Ventana de Inicio (`/home`), bienvenida personalizada, indicadores de estado y modelos.
2. **`mockup-planificador.png`:** Planificador de Clases (`/`), asistente secuencial en 4 fases tripartitas con memoria de ADN pedagógico.
3. **`mockup-grafo-prerrequisitos.png`:** Grafo Interactivo de Prerrequisitos Curriculares (MEN), red ontológica de competencias por ciclos de grado de 1° a 11°.
4. **`mockup-adn-pedagogico.png`:** Mi ADN Pedagógico & Transversalidad (`/adn-pedagogico`), memoria contextual de éxito, métricas y analíticas.
5. **`mockup-caja-herramientas.png`:** Caja de Herramientas y DUA (`/adn-pedagogico`), dinámicas de inicio, evaluación formativa y receta docente.
6. **`mockup-dashboard.png`:** Panel y Repositorio de Mis Planes de Clase (`/mis-planes`), búsqueda en tiempo real, filtros y gestión de secuencias.
7. **`mockup-actividad.png`:** Catálogo de Estructuras y Modelos Curriculares (`/plantillas`), transferencia al asistente e inspección de plantillas.
8. **`mockup-resultados.png`:** Editor Curricular y Asistente Socrático (`/editor`), lienzo de trabajo con plan generado y panel de co-diseño con IA.
9. **`mockup-admin-analiticas.png`:** Panel de Administración — Analíticas y Métricas Gráficas (`/administracion`), Donut Chart SVG, producción STEAM y solicitudes.
10. **`mockup-admin-directorio.png`:** Panel de Administración — Directorio de Docentes (`/administracion`), búsqueda, filtros por nivel y cifrado Habeas Data.
11. **`mockup-admin-adn-colectivo.png`:** Panel de Administración — ADN Pedagógico Colectivo (`/administracion`), diagnóstico declarada vs aplicada, caja DUA institucional y banco probado.
12. **`mockup-admin-tickets.png`:** Panel de Administración — Tickets de Soporte (`/administracion`), gestión interactiva y resolución de solicitudes docentes.
13. **`mockup-biblioteca.png`:** Biblioteca Comunitaria (`/biblioteca`), recursos didácticos abiertos, filtrado por grado y clonación.
14. **`mockup-foro.png`:** Foro Docente Interactivo (`/foro`), diálogo pedagógico, vistas de navegación y categorías temáticas.
15. **`mockup-ayuda.png`:** Centro de Ayuda Pedagógica (`/ayuda`), base de conocimiento, acordeones interactivos y FAQ.
16. **`mockup-soporte.png`:** Soporte Técnico Institucional (`/soporte`), mesa de ayuda, formulario de tickets y protección Ley 1581.
17. **`mockup-experiencias.png`:** Banco de Experiencias Pedagógicas (`/experiencias`), sistematización de práctica docente, alternancia de privacidad, valoración por estrellas y retroalimentación entre pares.
18. **`mockup-acerca.png`:** Acerca de INSPIRATEC (`/acerca`), identidad institucional, principios axiológicos (Misión, Inclusión DUA, Innovación Pedagógica) y directorio del equipo creador con roles Scrum.
19. **`mockup-configuracion.png`:** Configuración de Inteligencia Artificial (`/config` — Pestaña API Key), gestión de clave privada BYOK Google Gemini, privacidad y prueba de conectividad en vivo.
20. **`mockup-autodiagnostico.png`:** Autodiagnóstico Pedagógico Felder-Silverman (`/config` — Pestaña Autodiagnóstico), instrumento de 8 reactivos reflexivos, gráfico radial interactivo y recomendaciones DUA.
21. **`mockup-menu-usuario.png`:** Menú Desplegable de Usuario (`UserMenu.jsx`), popover desacoplado de cristal con identificación, rol administrativo y accesos directos.
22. **`mockup-informacion-docente.png`:** Ventana Emergente de Información del Docente (`ProfileModal`), diálogo modal accesible de consulta y edición de datos con garantía Habeas Data.
23. **`mockup-cambiar-contrasena.png`:** Ventana Emergente de Cambio de Contraseña (`PasswordModal`), diálogo de seguridad con verificación de contraseña actual y nueva clave cifrada.
24. **`mockup-bienvenida.png`:** Ventana Inmersiva de Bienvenida Narrativa (`BienvenidaNarrativa.jsx`), onboarding editorial 2026 con recorrido interactivo en 8 escenas curriculares.
25. **`mockup-auth-login.png`:** Autenticación — Inicio de Sesión (`/login`), atmósfera cinematográfica con carrusel narrativo de 5 escenas pedagógicas, credenciales seguras y protección JWT.
26. **`mockup-auth-registro.png`:** Autenticación — Registro Docente (`/login`), vinculación curricular con institución, nivel, metodología institucional y consentimiento informado Ley 1581.

---

## 5. Evaluación de las Tres Reglas de Oro de Theo Mandel

1. **Dar el Control al Usuario:**
   - Soberanía pedagógica en la generación de secuencias.
   - Guardado de borradores intermedios y navegación no lineal reversible.
   - Cuadros de confirmación modal (`ConfirmModal.jsx`) para acciones destructivas.
2. **Reducir la Carga de Memoria:**
   - Reconocimiento antes que recuerdo mediante selectores curriculares estructurados (MEN / DBA / DUA).
   - Metadatos directos y explícitos en cada tarjeta de la interfaz sin necesidad de abrir archivos.
   - Stepper visual visible en el planificador que indica el avance secuencial.
3. **Mantener Consistencia Visual:**
   - Paleta corporativa de marca: Verde salvia (`#477A72`) y petróleo (`#142B25`, `#183630`).
   - Tipografía dual armónica: `Lora` (serif para encabezados) y `DM Sans` (sans-serif para lectura y controles).
   - Tratamientos Glassmorphism canónicos de alto contraste (`rgba(255, 254, 250, 0.86)` con `backdrop-filter: blur(16px)`).

---

## 6. Aplicación de los 7 Hábitos de Stephen R. Covey en ACT-007

Conforme al marco de efectividad personal e interpersonal establecido en [ACT-016](../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md) (Sección 5.14), cada integrante aplicó los 7 hábitos de Covey de manera concreta en la ejecución de ACT-007:

| Integrante | Rol Oficial | Hábitos Predominantes | Evidencia Operativa en ACT-007 |
|---|---|:---:|---|
| **Luis Caldera** | Development Team / UI-UX Lead | **H1 (Ser Proactivo)<br>H2 (Empezar con un Fin en Mente)<br>H6 (Sinergizar)** | Lideró la concepción visual de los 26 mockups de alta fidelidad, asegurando con un claro fin en mente (H2) que la interfaz Glassmorphism cumpla rigurosamente las tres reglas de oro de Theo Mandel y los estándares ergonómicos de MODESEC. |
| **Daniel Tapias** | Development Team / Git Lead | **H1 (Ser Proactivo)<br>H3 (Poner Primero lo Primero)** | Ejerció proactividad y priorización técnica al estructurar la exportación de capturas reales de alta fidelidad sobre la aplicación en ejecución y verificar la consistencia cromática y tipográfica con el sistema de tokens en `src/index.css`. |
| **Zoe Peñata** | Scrum Master | **H3 (Poner Primero lo Primero)<br>H6 (Sinergizar)** | Facilitó el cronograma de diseño, garantizando que los entregables se ubiquen en `docs/diseno-interface/mockups/` según los lineamientos de la Semana 03 y canalizando la sinergia colaborativa entre los roles pedagógicos y de desarrollo. |
| **Maira Ortega** | Facilitadora de Equipo | **H5 (Buscar Primero Comprender y Después Ser Comprendido)** | Analizó la ergonomía visual y la reducción de la carga de memoria (Regla 2 de Mandel), verificando que los metadatos explícitos en tarjetas y vistas eviten esfuerzo nemotécnico innecesario en los docentes usuarios. |
| **María Soto** | Product Owner | **H2 (Empezar con un Fin en Mente)<br>H5 (Buscar Primero Comprender)** | Como Product Owner, veló porque los mockups del planificador, plantillas y editor preserven la secuencia didáctica tripartita del MEN (Inicio, Desarrollo y Cierre) y las necesidades formativas del aula colombiana. |
| **María Ubarne** | Product Owner Support | **H5 (Buscar Primero Comprender)<br>H6 (Sinergizar)** | Comprobó la visibilidad, consistencia y articulación de los apoyos inclusivos DUA/PIAR en los mockups de resultados, planificador y configuraciones, garantizando el diseño universal en todas las pantallas. |
