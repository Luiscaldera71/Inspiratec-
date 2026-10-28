/**
 * Illustrative schema only. Adapt to the application; not a runtime dependency.
 * Verify exact filenames before using these examples in production.
 */
export const sceneConfig = [
  {
    id: "campus-entry",
    src: "/scroll-images/Entrada del campus al amanecer-7.png",
    title: "Bienvenido a INSPIRATEC",
    description: "Un espacio para imaginar nuevas posibilidades educativas.",
    start: 0.00,
    peak: 0.06,
    end: 0.14,
    focalPoint: "center",
    motion: { scaleFrom: 1.00, scaleTo: 1.08, xFrom: 0, xTo: 0, yFrom: 1, yTo: -1 }
  },
  {
    id: "creative-space",
    src: "/scroll-images/Espacio creativo de planificación docente-9.png",
    title: "Ideas que toman forma",
    description: "Explora recursos para diseñar experiencias de aprendizaje.",
    start: 0.10,
    peak: 0.17,
    end: 0.25,
    focalPoint: "center",
    motion: { scaleFrom: 1.02, scaleTo: 1.10, xFrom: 0, xTo: -1, yFrom: 0, yTo: -1 }
  }
  // Add scenes only after verifying the exact assets and narrative order.
];
