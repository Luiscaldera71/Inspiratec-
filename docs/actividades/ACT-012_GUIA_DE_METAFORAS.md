# ACT-012 — Diseño de la Guía de Metáforas

## 1. Información General
- **ID de la Actividad:** ACT-012 (Actividad 10 del Plan de Trabajo)
- **Nombre Oficial:** Diseño de la Guía de Metáforas
- **Semana de Ejecución:** Semana 6 / Semana 10 (Consolidación y Cierre)
- **Prioridad:** Media-Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Multimedial, Componente 5)
- **Producto Esperado:** `GUIA_DE_METAFORAS.md` y colección de recursos gráficos fidedignos.

---

## 2. Objetivo y Justificación

### Objetivo General
Elaborar la **Guía de Metáforas de MODESEC** para el software educativo INSPIRATEC mediante una auditoría integral y fidedigna de la base de código existente, identificando los elementos visuales e iconográficos reales implementados, documentando su función operativa y reproduciendo con exactitud su apariencia gráfica a partir de las fuentes originales del proyecto, sin inventar, sustituir ni reinterpretar libremente los recursos visuales.

### Justificación Técnica y Metodológica
En el marco de MODESEC (Fase II: Diseño Multimedial), la Guía de Metáforas permite sistematizar el puente cognitivo entre el modelo mental del usuario docente y la arquitectura computacional del sistema. INSPIRATEC no implementa metáforas lúdicas infantiles arbitrarias, sino una **metáfora instrumental implícita de alta fidelidad: «El Taller de Co-Creación del Arquitecto Curricular»**, donde cada icono de la biblioteca `lucide-react`, cada panel Glassmorphism y cada control canónico facilitan la comprensión intuitiva de la interfaz y la transposición didáctica rigurosa.

---

## 3. Participación del Equipo (Roles Scrum Oficiales)

| Integrante | Rol Scrum | Contribución Específica en ACT-012 |
|---|---|---|
| **Luis Caldera** | Dev Team / UI-UX Lead | Auditoría ergonómica visual de la interfaz, mapeo de los 30 elementos gráficos reales en `src/` y verificación de consistencia en el Dock y paneles Glassmorphism. |
| **Daniel Tapias** | Dev Team / Git Lead | Extracción fidedigna de los 33 archivos vectoriales SVG desde `node_modules/lucide-react/dist/esm/icons/`, estructuración de `docs/diseno-multimedial/iconos/` y trazabilidad técnica en Markdown. |
| **Zoe Peñata** | Scrum Master | Coordinación del sprint de la Actividad 10, control de completitud de la tabla de 3 columnas (Nombre, Imagen, Descripción) y remoción de bloqueos metodológicos. |
| **María Soto** | Product Owner | Validación de la pertinencia pedagógica de la metáfora del "Arquitecto Curricular" frente a la práctica real de los docentes de Tecnología e Informática. |
| **María Ubarne** | Product Owner Support | Verificación del significado metafórico y operativo de los elementos de inclusión DUA/PIAR (`Accessibility`) y del radar de estilos cognitivos. |
| **Maira Ortega** | Facilitadora de Equipo | Revisión de legibilidad y claridad conceptual en las descripciones operativas de los 30 elementos para evitar sobrecarga terminológica. |

---

## 4. Desarrollo Metodológico

1. **Inspección de Código e Interfaces:** Se auditaron exhaustivamente `src/App.jsx`, `src/pages/WizardPage.jsx`, `src/pages/EditorPage.jsx`, `src/components/`, `src/styles/ui.css` e `src/index.css`.
2. **Inventario Fidedigno de 30 Elementos Gráficos Reales:** Se descartaron elementos ficticios, registrando únicamente controles existentes clasificados en:
   - Navegación Global y Dock Lateral (Inicio, Generador, Mis Planes, Biblioteca, Experiencias, Plantillas, Foro, ADN, Configuración, Ayuda, Soporte, Admin, Info).
   - Asistente de Planificación / Wizard (Estudiantes, Inclusión DUA/PIAR, Ramificación de Estándares MEN, Temporización).
   - Editor y Síntesis Multimodal (Guardar, Exportar, Diapositivas, Quizzes, Sopas de Letras, Modo Vista Previa, Descarte).
   - Resiliencia y Control del Usuario (Monitor de red en línea/offline, Confirmaciones seguras, Advertencias y Cierre).
3. **Extracción y Preservación Vectorial:** Se extrajeron directamente 33 archivos SVG limpios (`viewBox="0 0 24 24"`, `stroke-width="2"`, `stroke="#2563eb"`) en `docs/diseno-multimedial/iconos/` garantizando una reproducción visual 100% idéntica a la que el usuario observa en pantalla.
4. **Fundamentación Teórica de la Metáfora:** Se redactó la justificación distinguiendo con rigor entre *Metáfora visual*, *Representación visual* y *Función operativa*.

---

## 5. Artefactos Generados

- **Documento Principal Maestro:** [`docs/diseno-multimedial/GUIA_DE_METAFORAS.md`](../diseno-multimedial/GUIA_DE_METAFORAS.md).
- **Documento Ejecutivo en Raíz:** [`GUIA_DE_METAFORAS.md`](../../GUIA_DE_METAFORAS.md).
- **Colección de Iconos SVG Oficiales:** Directorio [`docs/diseno-multimedial/iconos/`](../diseno-multimedial/iconos/) con 33 archivos vectoriales reales del software.
- **Ficha Técnica de Actividad:** `docs/actividades/ACT-012_GUIA_DE_METAFORAS.md`.
- **Registro de Uso de IA (ROCAS):** [`docs/ia/REGISTRO_IA_ACT-012.md`](../ia/REGISTRO_IA_ACT-012.md).
- **Carpeta de Evidencias:** [`docs/evidencias/ACT-012/README.md`](../evidencias/ACT-012/README.md).

---

## 6. Evaluación Académica de la Actividad

| Criterio | Calificación (1 a 4) | Justificación Evaluativa |
|---|---|---|
| **Cumplimiento** | **4 — Consolidado** | Se elaboró la tabla institucional de 3 columnas completa con 30 elementos reales y su respectiva justificación. |
| **Calidad** | **4 — Consolidado** | Fidelidad absoluta a los elementos del código; distinción rigurosa entre metáfora, representación y función operativa. |
| **Evidencia** | **4 — Consolidado** | Cada icono está extraído y guardado como SVG vectorial nativo referenciado directamente en el Markdown. |
| **Documentación** | **4 — Consolidado** | Estructura profesional uniforme, hipervínculos relativos válidos y doble ubicación estratégica (raíz y diseño multimedial). |
| **Responsabilidad** | **4 — Consolidado** | Participación verificable de los 6 integrantes del equipo articulados bajo los 7 hábitos de Covey. |
| **Coherencia** | **4 — Consolidado** | Coherencia total con MODESEC, la ventana estándar ACT-008 y el mapa de navegación ACT-006. |

---

## 7. Trazabilidad de los 7 Hábitos en ACT-012

- **Daniel Tapias (H1, H3, H7):** Proactividad en la inspección de dependencias y extracción programática de SVGs; priorización en la trazabilidad documental; y *afilar la sierra* en la organización de activos.
- **Luis Caldera (H1, H2, H6):** Liderazgo en el inventario ergonómico; fin en mente al garantizar que la iconografía sea fiel al sistema de diseño Glassmorphism 2026; y sinergia visual con el equipo.
- **Zoe Peñata (H3, H6):** Priorización de la entrega institucional de la Actividad 10; gestión de tiempos del sprint; e integración colaborativa de los hallazgos.
- **Maira Ortega (H4, H5):** Empatía hacia la comprensión del usuario final evitando sobrecarga terminológica; y beneficio mutuo ganar-ganar en la claridad de las descripciones.
- **María Soto (H2, H5):** Claridad en el fin pedagógico en mente; validación del rol del docente como arquitecto curricular frente a metáforas triviales.
- **María Ubarne (H5, H6):** Comprensión profunda de la accesibilidad DUA/PIAR y sinergia con el equipo técnico para reflejar las ayudas inclusivas en la guía.
