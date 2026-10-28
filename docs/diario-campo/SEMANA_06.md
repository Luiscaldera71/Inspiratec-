# Diario de Campo — Semana 6

## ACT-008 — Definir la Ventana Estándar

### 1. Contexto
- **Semana:** 6
- **Actividad desarrollada:** ACT-008 — Definir la Ventana Estándar.
- **Objetivo:** Definir y registrar documentalmente la estructura visual y funcional de la interfaz que sirve como referencia maestra para INSPIRATEC.
- **Participantes:** Zoe Peñata, Luis Caldera, Daniel Tapias, Maira Ortega, María Soto, María Ubarne.

### 2. Desarrollo
1. Revisión de la guía académica y metodológica (MODESEC).
2. Revisión del modelo de "Ventana Estándar" solicitado.
3. Revisión de las interfaces reales de INSPIRATEC ejecutadas localmente.
4. Selección de la ventana de referencia (Inicio / Wizard).
5. Identificación de Header (identidad de marca y navegación principal).
6. Identificación de Menú (navegación entre módulos).
7. Identificación de Contenido (área interactiva principal).
8. Identificación de Acciones (controles de flujo y guardado).
9. Identificación de Footer (sección institucional).
10. Elaboración de la captura fotográfica del DOM en ejecución.
11. Elaboración del esquema SVG como material conceptual.
12. Elaboración y estructuración de la documentación Markdown, discriminando roles y participaciones verídicas.
13. Revisión del equipo sobre el entregable antes del commit.

### 3. Observaciones
- **Hallazgos reales:** Se verificó que el layout de tipo Dashboard (actualmente implementado con Tailwind) cumple estructuralmente con las exigencias del marco académico MODESEC. El Menú se comporta como panel lateral (sidebar) en escritorio, y el Footer permanece en la parte final del flujo de trabajo, lo cual es apropiado.

### 4. Uso de IA
- **Herramienta:** Antigravity (Gemini 3.1 Pro).
- **Propósito:** Análisis del entorno local, identificación de etiquetas DOM y formalización de la documentación académica.
- **Prompt:** Referenciado en `docs/ia/PROMPT_ACT-008_VENTANA_ESTANDAR.md`.
- **Resultado:** Creación de documentos Markdown trazables y justificados, SVG, y registros rigurosos que separan invenciones de hechos demostrables en código.
- **Validación humana:** Revisión de la captura, ratificación de las funciones del equipo y conformidad con el requerimiento.

### 5. Problemas o bloqueos
- No se registran bloqueos adicionales verificados para esta actividad.

### 6. Decisiones tomadas
| Decisión | Justificación | Responsable | Consecuencia esperada |
|----------|---------------|-------------|-----------------------|
| Usar Inicio / Wizard como referencia | Es la vista que alberga la funcionalidad crítica (generación de plan) y requiere la estructura de 5 áreas completas. | Daniel Tapias, Luis Caldera | Sirve de molde directo para construir la vista "Mis Planes" y "Biblioteca". |

### 7. Reflexión
- **¿Qué funcionó?** El análisis minucioso de la aplicación real mediante levantamiento de ambiente de desarrollo.
- **¿Qué se aprendió?** Es posible conciliar un modelo teórico clásico de ventana estándar con interfaces web modernas tipo dashboard sin sacrificar coherencia pedagógica.
- **¿Qué dificultades se identificaron?** Delimitar las zonas de "Acciones" y "Footer" cuando el formulario es muy largo.
- **¿Qué debe mejorarse?** Confirmar el comportamiento responsivo de la Ventana Estándar en dispositivos de baja resolución.

### 8. Compromisos
| Compromiso | Responsable | Fecha | Prioridad |
|------------|-------------|-------|-----------|
| Validar la Ventana Estándar en dispositivo móvil (módulo CSS) | Luis Caldera | Próxima sesión | Media |
| Revisar el reporte y formalizar el commit | Zoe Peñata | Semana 6 | Alta |

---

## ACT-009 — Descripción de Ventanas (Reconstrucción)

### Contexto
- **Semana:** 6
- **Actividad desarrollada:** ACT-009 — Descripción de Ventanas.
- **Objetivo:** Rehacer y documentar rigurosamente los elementos reales de las ventanas principales del sistema INSPIRATEC (Generador, Experiencias, Plantillas, Biblioteca, Mis Planes, Ayuda) mediante recortes precisos y tablas MODESEC comprobables.
- **Participantes:** Zoe Peñata, Luis Caldera, Daniel Tapias, Maira Ortega, María Soto, María Ubarne.

### Desarrollo
1. **Revisión de capturas:** Evaluación integral de `docs/evidencias/ACT-009/` confirmando la existencia de 6 capturas reales (`01_generador.png`, etc.).
2. **Identificación de ventanas:** Se verificaron las 6 vistas funcionales.
3. **Extracción de elementos:** Se procedió a recortar y clasificar la interfaz en áreas (Header, Nav, Contenido, Acciones, Footer).
4. **Elaboración de tablas:** Construcción de matrices MODESEC garantizando que cada fila tenga un reflejo exacto y visual de la captura original.
5. **Documentación:** Creación del documento consolidado `DESCRIPCION_VENTANAS.md`.
6. **Validación:** Comprobación estricta para asegurar la nula existencia de componentes ficticios (audio, video, animaciones inventadas).

### Observaciones
- **Hallazgos:** La disección de las imágenes demostró que el diseño es modular y consistente.
- **Dificultades:** Asegurar la trazabilidad gráfica exacta sin depender de mockups automatizados.
- **Diferencias:** La versión anterior de la actividad infería elementos abstractos; la presente reconstrucción es un reflejo fidedigno y auditable de los PNG originales del frontend.

### Uso de IA
- **Herramienta:** Antigravity (Gemini 3.1 Pro).
- **Propósito:** Automatizar el proceso de recorte y segmentación de los PNG mediante un script temporal Node.js (Jimp) y estructurar las matrices de documentación.
- **Resultado:** Archivos correctamente seccionados (`generador/header.png`, etc.) y reporte estructurado.
- **Nota de trazabilidad:** No se inventó ningún prompt histórico; el uso de IA queda estrictamente limitado a la fase de análisis documental de esta sesión.

### Problemas o bloqueos
- **Tipo:** Organización/Documentación.
- **Problema:** La versión inicial de ACT-009 violaba la trazabilidad al no incluir recortes comprobables, requiriendo un `git reset` para proteger el historial antes de rehacerla.

### Decisiones
- Se decidió utilizar las capturas *as-is* y segmentarlas para documentar la estructura de la ventana, catalogando todo elemento invisible (audio/video) expresamente como "No se evidencia".

### Reflexión
- La reconstrucción mejoró drásticamente la calidad de la auditoría. Ahora existe un correlato 1:1 entre el reporte escrito y el componente gráfico que lo sustenta, evitando falsos positivos.

### Próximos compromisos
| Compromiso | Responsable | Fecha | Prioridad |
|------------|-------------|-------|-----------|
| Validar la integración del documento reconstruido y realizar el push definitivo | Daniel Tapias / Luis Caldera | Semana 6 | Alta |
| Validar este documento y autorizar commit | Zoe Peñata | Semana 6 | Alta |

---

## ACT-013 — Consolidar el Diseño de Aprendizaje

### Contexto
- **Semana:** 6
- **Actividad desarrollada:** ACT-013 — Consolidar el Diseño de Aprendizaje (MODESEC Componente 7).
- **Objetivo:** Construir formalmente el documento `DISENO_DE_APRENDIZAJE.md` articulando competencias (MEN Guía 30), indicadores, modelo pedagógico, estrategias activas, actividades por momentos pedagógicos y evidencias tangibles.
- **Participantes:** Todo el equipo (María Soto, María Ubarne, Zoe Peñata, Maira Ortega, Luis Caldera, Daniel Tapias).

### Desarrollo
1. Revisión de las Orientaciones Generales para la Educación en Tecnología (Guía 30 del MEN) en sus 4 componentes.
2. Definición de la cadena metodológica descendente exigida por MODESEC.
3. Formulación de indicadores de desempeño en los 4 niveles ministeriales (Superior, Alto, Básico, Bajo).
4. Vinculación de las actividades didácticas con los 3 momentos del planificador de INSPIRATEC (Inicio, Desarrollo, Cierre).
5. Especificación de los artefactos generados (rúbricas analíticas, diapositivas, trivias interactivas y planes de clase).
6. Redacción del documento oficial en `docs/pedagogia/DISENO_DE_APRENDIZAJE.md` y su respectiva ficha técnica.

### Decisiones Tomadas
- Se acordó que ninguna actividad del software existe aislada, sino que todas tributan a una competencia ministerial explícita.
- Se incorporaron las dimensiones transversales de Gamificación (Canvas) e Inclusión DUA/PIAR en la matriz de aprendizaje.

---

## ACT-015 — Auditoría de Usabilidad y Accesibilidad Pantalla por Pantalla

### Contexto
- **Semana:** 6
- **Actividad desarrollada:** ACT-015 — Validar Usabilidad y Accesibilidad.
- **Objetivo:** Ejecutar una evaluación heurística rigurosa sobre cada pantalla del sistema, verificando Control del Usuario (regreso/cancelación), Carga Cognitiva (densidad/memoria/iconos) y Consistencia (paleta/botones/tipografía).
- **Participantes:** Todo el equipo (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne).

### Desarrollo
1. Inspección de las 12 pantallas y componentes de la aplicación: Wizard (4 pasos), Editor, Mis Planes, Plantillas, Biblioteca, Foro, Configuración IA, Administración, Ayuda, Acerca de, Login y Modales.
2. Comprobación del mecanismo de escape (`Escape`) y cierre en modales montados por `createPortal`.
3. Verificación de contraste cromático sobre paneles Glassmorphism esmerilados (`backdrop-filter: blur(20px)`).
4. Identificación de hallazgos y acciones de mejora para el próximo sprint (toolbar sticky en editor, stepper circular en móviles).
5. Documentación completa en la ficha `ACT-015_USABILIDAD_ACCESIBILIDAD.md`.

---

## ACT-016 — Registro de los 7 Hábitos por Actividad y Participante

### Contexto
- **Semana:** 6
- **Actividad desarrollada:** ACT-016 — Análisis de los 7 Hábitos de Stephen Covey.
- **Objetivo:** Mapear la aplicación individual y colectiva de los 7 hábitos en cada una de las actividades desarrolladas en el proyecto (ACT-001 a ACT-015).
- **Participantes:** Todo el equipo.

### Desarrollo
1. Revisión de las 10 actividades técnicas y pedagógicas desarrolladas a la fecha.
2. Identificación de los hábitos dominantes en cada actividad (H1 Proactividad, H2 Fin en mente, H3 Primero lo primero, H4 Ganar-ganar, H5 Primero entender, H6 Sinergia, H7 Afilar la sierra).
3. Elaboración de la matriz de aplicación por participante para cada actividad en `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`.

### Consolidación y Cierre Definitivo de ACT-003 (Modelo Pedagógico)
* **Fecha:** Semana 6 (Fase de Consolidación).
* **Actividad:** ACT-003 — Análisis y Definición del Modelo Pedagógico.
* **Acciones Desarrolladas:**
  1. Revisión colegiada del estado previo ("Parcialmente completada - Pendiente de validación").
  2. Integración de la fundamentación científica a partir de la literatura analizada en la Matriz de 15 Artículos (Piaget, Vygotsky, Papert, Wing, Barrows, CAST, Black & Wiliam).
  3. Definición formal de la población prioritaria (docentes de básica y media, 1.° a 11.°, estudiantes de 6 a 17 años y adaptaciones DUA/PIAR para inclusión y contextos unplugged).
  4. Articulación bidireccional con el nuevo documento `DISENO_DE_APRENDIZAJE.md` (ACT-013) y la sección pedagógica del `README.md`.
  5. Declaración unánime del equipo del estado **COMPLETADA** con nivel de evaluación 4 (Excelente).
