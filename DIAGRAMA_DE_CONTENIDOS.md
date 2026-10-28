# Diagrama de Contenidos del Proyecto

## Proyecto
**Inspiracte — Plataforma Educativa Asistida por IA**

## Propósito
Representar la organización conceptual de los contenidos e instrumentos de evaluación del sistema, estructurados para el andamiaje docente (Guía 30 del MEN y otras áreas).

---

## Estructura Jerárquica

```
Inspiracte
│
├── 1. CONFIGURACIÓN INICIAL (WIZARD)
│   ├── Datos de Clase (Tema, Grado, Materia, Duración)
│   ├── Enfoque Pedagógico (Objetivos, Estándares, Metodología STEAM)
│   └── Inclusión (Adaptaciones DUA, Contexto Aula)
│
├── 2. GENERACIÓN CON IA (GEMINI)
│   ├── Plan de Clase Estructurado (Markdown)
│   └── Material Complementario
│       ├── Rúbricas HTML
│       ├── Diapositivas
│       ├── Sopas de Letras (Juegos)
│       ├── Cuestionarios / Evaluaciones
│       ├── Flashcards
│       └── Juegos de Roles / Talleres
│
├── 3. ALMACENAMIENTO (FIREBASE)
│   ├── Auth (Usuarios Docentes)
│   └── Firestore (Historial de Planes, Plantillas Institucionales)
│
└── 4. VISUALIZACIÓN Y UX
    ├── Rutas de Aplicación (React Router)
    ├── Estado Global (Zustand)
    └── Animaciones y Estilos (Framer Motion, CSS)
```

---

## Representación Visual en Mermaid

```mermaid
flowchart TD
    ROOT(["🎓 Inspiracte"])

    ROOT --> B1["📋 1. Configuración (Wizard)"]
    ROOT --> B2["🧠 2. Generación IA (Gemini)"]
    ROOT --> B3["☁️ 3. Almacenamiento (Firebase)"]
    ROOT --> B4["🖥️ 4. Visualización (UX)"]

    B1 --> B1_1["Datos Generales"]
    B1 --> B1_2["Objetivos y Estándares (MEN)"]
    B1 --> B1_3["Inclusión y DUA"]

    B2 --> B2_1["Plan de Clase (Markdown)"]
    B2 --> B2_2["Generación de HTML Dinámico"]
    B2_2 --> B2_2_1["Rúbricas"]
    B2_2 --> B2_2_2["Material Didáctico (Flashcards, Diapositivas)"]
    B2_2 --> B2_2_3["Evaluaciones / Sopas de letras"]

    B3 --> B3_1["Usuarios (Auth)"]
    B3 --> B3_2["Historial de Planes (Firestore)"]

    B4 --> B4_1["Rutas React Router"]
    B4 --> B4_2["Gestión de Estado (Zustand)"]
```
