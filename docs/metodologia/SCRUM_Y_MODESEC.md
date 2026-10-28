# Metodología de Trabajo — SCRUM y MODESEC

El desarrollo del proyecto articula dos marcos complementarios con propósitos claramente diferenciados:

1. **SCRUM:** Marco de gestión, organización y seguimiento del trabajo en equipo.
2. **MODESEC:** Marco metodológico orientador para el diseño y desarrollo del software educativo.

---

## 1. Metodología de Gestión y Organización: SCRUM

**Scrum** es el marco adoptado por el equipo para coordinar actividades, gestionar el tiempo, priorizar requerimientos y evaluar los incrementos periódicos a lo largo de las 15 semanas del ciclo académico.

### Roles Scrum Oficiales y Responsabilidades en el Grupo 2
En concordancia con la Guía oficial de Scrum, se establecen tres responsabilidades principales (PO, SM, Developers), organizadas de la siguiente manera:

* **Product Owner:** **María Soto**  
  * *Responsabilidad Principal:* Representación de las necesidades del producto educativo, priorización de funcionalidades del backlog y validación del valor académico del sistema.  
  * *Responsabilidad Secundaria:* Revisión de requisitos y toma de decisiones sobre el alcance del producto.
* **Product Owner Support / Apoyo al Product Owner:** **María Ubarne**  
  * *Responsabilidad Principal:* Apoyo en el análisis de necesidades pedagógicas, priorización de requisitos y validación de funcionalidades.  
  * *Responsabilidad Secundaria:* Revisión funcional, apoyo documental y validación de avances del sistema.
* **Scrum Master:** **Zoe Peñata**  
  * *Responsabilidad Principal:* Coordinación general del equipo, seguimiento del tiempo, facilitación del proceso Scrum y remoción de bloqueos.  
  * *Responsabilidad Secundaria:* Apoyo en presentaciones y socialización académica del proyecto.
* **Scrum Master Support / Facilitadora del Equipo:** **Maira Ortega**  
  * *Responsabilidad Principal:* Apoyo en la organización de reuniones internas, seguimiento al cumplimiento de actividades y facilitación de la comunicación colaborativa.  
  * *Responsabilidad Secundaria:* Revisión continua del producto y elaboración de guiones para exposiciones.
* **Development Team / Desarrollador Frontend:** **Luis Caldera**  
  * *Responsabilidad Principal:* Diseño y desarrollo de interfaces frontend, elaboración de propuestas visuales y optimización de la experiencia de usuario (UI/UX).  
  * *Responsabilidad Secundaria:* Evaluación de criterios de actividades y coherencia del sistema.
* **Development Team / Desarrollador:** **Daniel Tapias**  
  * *Responsabilidad Principal:* Gestión del repositorio GitHub, integración técnica de código, documentación técnica y control de versiones.  
  * *Responsabilidad Secundaria:* Revisión de borradores, trazabilidad en Git y apoyo en la reestructuración del proyecto.

---

## 2. Metodología de Diseño de Software Educativo: MODESEC

> **Carácter Orientador:** MODESEC (Modelo de Diseño Educativo para Software Educativo en Colombia) no se asume como una metodología cerrada o completamente ejecutada; se adopta como un **marco metodológico orientador** para garantizar que el diseño instruccional, curricular y computacional del software responda con rigor pedagógico a las realidades del aula colombiana.

### Componentes de MODESEC y su Articulación en el Proyecto

| Componente MODESEC | Función Pedagógica en el Software | Estado en el Proyecto |
|---|---|---|
| **1. Necesidad Educativa** | Identificación de la sobrecarga docente y la fragmentación en la formulación de planes de clase bajo la Guía 30 del MEN y pautas DUA. | **Evidenciado** |
| **2. Objetivos Educativos** | Guiar la formulación de metas claras de aprendizaje mediante taxonomías integradas en el Wizard. | **Evidenciado** |
| **3. Competencias del Área** | Estructuración curricular según los 4 componentes de Tecnología e Informática del MEN (Naturaleza, Apropiación, Solución de problemas, Tecnología y sociedad). | **Evidenciado** |
| **4. Indicadores de Desempeño** | Generación de rúbricas analíticas dosificadas en los 4 niveles ministeriales (Superior, Alto, Básico, Bajo). | **Evidenciado** |
| **5. Diseño de Contenidos** | Organización jerárquica de contenidos conceptuales, procedimentales y actitudinales (ACT-001 / ACT-SEM01-002). | **En proceso** |
| **6. Diseño Pedagógico** | Articulación de metodologías activas (ABP, Pensamiento Computacional, Design Thinking, Gamificación, DUA, Indagación). | **Evidenciado** |
| **7. Diseño de Aprendizaje** | Dosificación de secuencias didácticas en Inicio, Desarrollo y Cierre adaptadas al tiempo de clase (60, 90, 120 min). | **En proceso** |
| **8. Diseño Computacional** | Arquitectura modular SPA en TypeScript con Express 5, Firebase Firestore y motor PDFMake/DOCX. | **Evidenciado** |
| **9. Diseño Multimedial** | Interfaz interactiva accesible (panel DUA: contraste, fuente dislexia, tamaño dinámico) y diapositivas con mapas conceptuales D3. | **Evidenciado** |
| **10. Producción** | Software plenamente operativo y ejecutable en entorno local. | **Evidenciado** |
| **11. Evaluación del Software** | Validación de usabilidad y pertinencia formativa con docentes en ejercicio. | **Pendiente** |

---

## 3. Articulación entre Ambos Marcos

```
┌────────────────────────────────────────────────────────┐
│                   MARCO DE GESTIÓN                     │
│                        SCRUM                           │
│  - Roles (PO, SM, Developers)                          │
│  - Sprints, backlog priorizado y revisiones periódicas │
│  - Bitácoras de campo y monitoreo semanal              │
└──────────────────────────┬─────────────────────────────┘
                           │ Gobierna el proceso de trabajo
                           ▼
┌────────────────────────────────────────────────────────┐
│             MARCO INSTRUCCIONAL ORIENTADOR             │
│                       MODESEC                          │
│  - Fundamentación didáctica y curricular (MEN Guía 30) │
│  - Inclusión y accesibilidad (DUA / PIAR)              │
│  - Diseño de contenidos, actividades y rúbricas        │
└────────────────────────────────────────────────────────┘
```
