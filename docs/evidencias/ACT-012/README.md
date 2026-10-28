# Evidencias — ACT-012 (Diseño de la Guía de Metáforas)

## 1. Identificación de la Actividad
* **Actividad:** ACTIVIDAD 10 (ACT-012) — Diseño de la Guía de Metáforas.
* **Ciclo:** Semana 6 / Semana 10 (Consolidación y Cierre).
* **Marco de Referencia:** MODESEC (Fase II — Diseño Multimedial, Componente 5).
* **Equipo de Trabajo:** Grupo 2 (Luis Caldera, Daniel Tapias, Zoe Peñata, Maira Ortega, María Soto, María Ubarne).
* **Estado:** COMPLETADA Y VALIDADA.

---

## 2. Artefactos Producidos
1. **Guía de Metáforas Maestra:** [`docs/diseno-multimedial/GUIA_DE_METAFORAS.md`](../../diseno-multimedial/GUIA_DE_METAFORAS.md) (Tabla institucional de 3 columnas: Nombre, Imagen, Descripción con 30 elementos reales y justificación de metáfora).
2. **Guía de Metáforas Ejecutiva (Raíz del Repositorio):** [`GUIA_DE_METAFORAS.md`](../../../GUIA_DE_METAFORAS.md).
3. **Colección de 33 Iconos SVG Fidedignos:** Directorio [`docs/diseno-multimedial/iconos/`](../../diseno-multimedial/iconos/), extraídos directamente desde `node_modules/lucide-react/dist/esm/icons/`.
4. **Ficha Técnica Oficial:** [`docs/actividades/ACT-012_GUIA_DE_METAFORAS.md`](../../actividades/ACT-012_GUIA_DE_METAFORAS.md).
5. **Matriz de Trazabilidad de los 7 Hábitos de Covey:** [`docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`](../../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md#513-act-012--diseño-de-la-guía-de-metáforas-actividad-10) (Sección 5.13).
6. **Registro de Interacción con IA (ROCAS):** [`docs/ia/REGISTRO_IA_ACT-012.md`](../../ia/REGISTRO_IA_ACT-012.md).
7. **Bitácora de Campo:** [`docs/diario-campo/SEMANA_ACTUAL.md`](../../diario-campo/SEMANA_ACTUAL.md).
8. **Monitoreo Semanal:** [`docs/seguimiento/MONITOREO_SEMANAL.md`](../../seguimiento/MONITOREO_SEMANAL.md).

---

## 3. Trazabilidad de Elementos Gráficos en el Código Fuente

Todos los elementos gráficos documentados en la Guía de Metáforas provienen de componentes reales y activos en la base de código de la aplicación:

| Elemento Visual | Icono Lucide / Recurso | Archivo Fuente en el Código | Función en el Software |
|---|---|---|---|
| **Inicio** | `Home` (`home.svg`) | `src/App.jsx` (L34), `src/pages/HomePage.jsx` | Retorno al tablero principal de métricas. |
| **Generador IA** | `Sparkles` (`sparkles.svg`) | `src/App.jsx` (L35), `src/pages/WizardPage.jsx` | Asistente de co-creación curricular. |
| **Mis Planes** | `FileText` (`file-text.svg`) | `src/App.jsx` (L36), `src/pages/MisPlanesPage.jsx` | Archivo de planes de clase personales. |
| **Biblioteca** | `Library` (`library.svg`) | `src/App.jsx` (L39), `src/pages/BibliotecaPage.jsx` | Banco público de secuencias didácticas. |
| **Experiencias** | `Compass` (`compass.svg`) | `src/App.jsx` (L40), `src/pages/ExperienciasPage.jsx` | Muestra de metodologías activas (ABP/STEAM). |
| **Plantillas** | `BookOpen` (`book-open.svg`) | `src/App.jsx` (L37), `src/pages/PlantillasPage.jsx` | Moldes curriculares por áreas del MEN. |
| **Foro** | `MessageSquare` (`message-square.svg`) | `src/App.jsx` (L41), `src/pages/ForoPage.jsx` | Comunidad de práctica y diálogo docente. |
| **ADN Pedagógico** | `Dna` (`dna.svg`) | `src/App.jsx` (L45), `src/pages/AdnPedagogicoPage.jsx` | Calibración de estilos de Felder-Silverman. |
| **Configuración** | `Settings` (`settings.svg`) | `src/App.jsx` (L30), `src/pages/ConfigPage.jsx` | Ajustes de API Key y preferencias. |
| **Ayuda** | `HelpCircle` (`help-circle.svg`) | `src/App.jsx` (L42), `src/pages/AyudaPage.jsx` | FAQ y manual de uso interactivo. |
| **Soporte** | `LifeBuoy` (`life-buoy.svg`) | `src/App.jsx` (L43), `src/pages/SoportePage.jsx` | Asistencia técnica y reporte de fallas. |
| **Inclusión DUA/PIAR**| `Accessibility` (`accessibility.svg`) | `src/components/wizard/WizardStep4Inclusion.jsx` | Ajustes razonables y barreras en el aula. |
| **Estándares MEN** | `GitFork` (`git-fork.svg`) | `src/components/wizard/WizardStep3Estandares.jsx` | Ramificación curricular de la Guía 30. |
| **Diapositivas** | `MonitorPlay` (`monitor-play.svg`) | `src/pages/EditorPage.jsx` (L14) | Presentaciones conceptuales interactivas. |
| **Cuestionarios** | `ListChecks` (`list-checks.svg`) | `src/pages/EditorPage.jsx` (L13) | Trivias y evaluaciones formativas. |
| **Sopas de Letras** | `Puzzle` (`puzzle.svg`) | `src/pages/EditorPage.jsx` (L16) | Lúdica y afianzamiento de términos TIC. |
| **Guardar** | `Save` (`save.svg`) | `src/pages/EditorPage.jsx` (L7) | Persistencia en Firestore y almacenamiento local. |
| **Descargar** | `Download` (`download.svg`) | `src/pages/EditorPage.jsx` (L20) | Exportación a PDF, Word, Markdown y JSON. |
| **Conexión Red** | `Wifi` / `WifiOff` | `src/components/NetworkStatusBanner.jsx` | Indicadores de resiliencia y modo offline. |
| **Confirmación** | `CheckCircle2` / `AlertTriangle` | `src/components/ConfirmModal.jsx` | Prevención de errores y confirmación ética. |

---

## 4. Verificación de Cumplimiento de Criterios

* **Fidelidad Estricta:** No se utilizaron generadores de arte por IA para inventar ilustraciones tridimensionales ficticias; cada imagen es la reproducción exacta del glifo vectorial utilizado en producción por `lucide-react`.
* **Consistencia Visual:** Todos los iconos conservan trazo de 2px, terminaciones redondeadas y formato SVG escalable.
* **Integridad del Código de Producción:** No se modificaron componentes, hojas de estilo ni rutas funcionales de la aplicación durante esta actividad.
