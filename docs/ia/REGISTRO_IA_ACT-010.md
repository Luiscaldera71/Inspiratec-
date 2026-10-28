# Registro de Uso de IA — ACT-010 (Guion Técnico Multimedial)

## Estructura ROCAS

### R — Rol
Arquitecto de Software Educativo y Documentador Técnico Multimedial según marco MODESEC.

### O — Objetivo
Inspeccionar exhaustivamente el código fuente y la interfaz en ejecución de INSPIRATEC para estructurar el Guion Técnico Multimedial ventana por ventana, mapeando elementos visuales, recursos multimedia, acciones y eventos interactivos en la matriz institucional de 6 columnas.

### C — Contexto
Software en producción local con 15 ventanas principales en React Router DOM, 5 modales emergentes montados con `createPortal`, fondo interactivo SVG animado `FondoPixel.jsx`, banco de iconos `lucide-react`, y síntesis de voz Web Speech API en la biblioteca de materiales didácticos.

### A — Acción
- Recorrido técnico por cada archivo de ruta en `src/pages/` y componentes en `src/components/`.
- Identificación rigurosa de elementos DOM, manejadores de eventos (`onClick`, `onChange`, `onSubmit`), estados en Zustand (`useAppStore`) y endpoints de servicio (`geminiService.js`, `dbService.js`).
- Redacción de la matriz técnica en formato Markdown sin asumir componentes ficticios ni inventar audios/videos donde no existan.

### S — Salida
- Documento maestro `GUION_TECNICO_MULTIMEDIAL.md` en la raíz y en `docs/diseno-multimedial/`.
- Ficha de actividad `docs/actividades/ACT-010_GUION_TECNICO_MULTIMEDIAL.md`.
- Repositorio fotográfico en `docs/evidencias/ACT-010/`.

---

## Validación Humana del Equipo

- **Daniel Tapias (Dev / Git Lead):** Comprobación línea por línea de que las acciones y eventos descritos correspondan a las funciones implementadas en los componentes JSX.
- **Luis Caldera (UI/UX Lead):** Verificación de los tokens cromáticos, sombras de cristal y tipografías Lora y DM Sans.
- **Zoe Peñata (Scrum Master):** Revisión de la completitud del inventario de 15 ventanas y 5 modales.
- **María Soto (PO) y María Ubarne:** Validación de que los propósitos didácticos y apoyos DUA no hayan sido alterados conceptualmente.
