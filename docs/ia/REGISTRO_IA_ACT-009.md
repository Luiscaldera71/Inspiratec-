# Registro de Uso de IA — ACT-009 (Descripción de Ventanas)

## Estructura ROCAS

### R — Rol
Analista de Interfaces y Auditor de Documentación Académica bajo el marco MODESEC.

### O — Objetivo
Elaborar la descripción institucional completa de todas las ventanas y cuadros de diálogo del software educativo INSPIRATEC, estructurando la plantilla MODESEC de 9 campos obligatorios (Nombre, Imagen, Texto, Audio, Video, Animación, Acciones del usuario, Botones, Navegación) con base en la ejecución verificable del frontend.

### C — Contexto
Software educativo INSPIRATEC con 15 ventanas funcionales, estética Glassmorphism 2026, fondo interactivo pixel art y capturas de pantalla de alta fidelidad suministradas por el equipo de desarrollo para Inicio, Mis Planes, Plantillas, Planificador, Editor, Biblioteca y Configuración.

### A — Acción
- Inspección detallada de las vistas en ejecución y componentes JSX de `src/pages/`.
- Verificación de la ausencia de elementos multimedia invisibles (no inventar audios ni videos donde no existen).
- Estructuración de las tablas descriptivas para las 15 ventanas y los 5 modales emergentes.
- Vinculación de rutas de imagen reales archivadas en `docs/evidencias/ACT-009/`.

### S — Salida
- Documento maestro `DESCRIPCION_VENTANAS.md` en la raíz del proyecto y en `docs/diseno-multimedial/`.
- Ficha de actividad `docs/actividades/ACT-009_DESCRIPCION_VENTANAS.md`.
- Repositorio fotográfico en `docs/evidencias/ACT-009/`.

---

## Validación Humana del Equipo

- **Zoe Peñata (Scrum Master):** Revisión de que el análisis corresponda verdaderamente a las capturas proporcionadas sin incluir elementos imaginarios ni asumir funcionalidades invisibles.
- **Luis Caldera (UI/UX) y Daniel Tapias (Git Lead):** Revisión de la coherencia técnica de los textos, botones de acción, iconos y rutas en el enrutador de React.
- **Maira Ortega y María Soto:** Revisión de que el texto extraído y su intención reflejen la realidad de la experiencia del usuario docente.
- **María Ubarne:** Validación final del documento respecto al requerimiento académico institucional.
