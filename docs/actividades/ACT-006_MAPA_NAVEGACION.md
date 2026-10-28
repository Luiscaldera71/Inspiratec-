# FICHA DE ACTIVIDAD — INSPIRATEC

## 1. Información General
- **ID de la Actividad:** ACT-006
- **Nombre:** Diseñar el Mapa de Navegación
- **Fase MODESEC:** Diseño Computacional / Diseño Multimedial
- **Semana de la Guía:** Semana 03
- **Prioridad:** Alta
- **Estado:** COMPLETADA (Actualizada y Alineada con MODESEC)
- **Responsables Principales:** Daniel Tapias (Frontend / Rutas), Luis Caldera (UX / Arquitectura)

---

## 2. Objetivo de la Actividad
Diseñar, fundamentar y diagramar el mapa de navegación del software educativo **INSPIRATEC** bajo la metodología **MODESEC** y los principios de Interacción Humano-Computador (HCI), garantizando:
1. La organización e interconexión jerárquica de interfaces en 5 niveles:
   $$\text{Pantalla Inicial} \longrightarrow \text{Módulos Principales} \longrightarrow \text{Pantallas Secundarias} \longrightarrow \text{Actividades} \longrightarrow \text{Resultados}$$
2. La presencia sistemática de controles universales de navegación: **Regresar**, **Inicio**, **Ayuda** y **Cerrar/Cancelar**.
3. El cumplimiento estricto de la regla pedagógica de la guía: **acceso al contenido formativo en un máximo de 3 interacciones**.

---

## 3. Desarrollo y Metodología

### 3.1. Fundamentación en la Arquitectura de Navegación
La topología de interacción de **INSPIRATEC** modela la experiencia del docente mediante un esquema jerárquico estructurado en tres (3) niveles con divisiones funcionales de flujo descendente:

![Mapa de Navegación Oficial — INSPIRATEC](../evidencias/ACT-006/MAPA_NAVEGACION.png)

- **NIVEL 1: AUTENTICACIÓN (Ingreso):** Flujo de acceso secuencial compuesto por `Login / Registro` (`/auth`), `Recuperar Contraseña` y `Validación de Credenciales`.
- **NIVEL 2: PANEL PRINCIPAL:** Nodo central convergente correspondiente al `Panel Principal (Inicio)` (`/home`), el cual actúa como pivote de navegación global.
- **NIVEL 3: DIVISIONES PRINCIPALES (Flujo hacia abajo):**
  - **2. Barra Superior (Control Global):** `Configuración IA (Estado: Lista)` y `Menú de Usuario (Admin)` con accesos a *Mi Perfil*, *Cambiar Contraseña*, *Bienvenida INSPIRATEC* y *Cerrar Sesión*.
  - **3. Menú Lateral (Navegación Principal):**
    - **Planeación:** `Inicio` (`/home`), `Planificador` (`/`), `Mis Planes (3)` (`/mis-planes`), `Mi ADN Pedagógico` (`/adn-pedagogico`), `Plantillas` (`/plantillas`) y `Administración` (`/administracion`).
    - **Comunidad:** `Biblioteca` (`/biblioteca`), `Experiencias` (`/experiencias`) y `Foro Docente` (`/foro`).
    - **Soporte:** `Ayuda y Guías` (`/ayuda`), `Soporte Técnico` (`/soporte`) y `Acerca de` (`/acerca`).

### 3.2. Controles Canónicos de Navegación
- **Regresar:** Implementado mediante `Breadcrumbs` interactivo en cabeceras de gestión y botón `← Volver a Mis Planes` en `/editor`, sincronizado con `useNavigate(-1)`.
- **Inicio:** Icono canónico en el Sidebar global y logotipo de la barra superior enlazados a `/home` o `/`.
- **Ayuda:** Acceso permanente a `/ayuda`, activador de tour interactivo guiado y co-docente IA flotante desacoplado.
- **Cerrar o Cancelar:** Tecla `Escape`, botón `✕` en modales, botones `Cancelar` con salvaguarda de datos en formularios y botón de cierre de sesión en el menú de usuario.

### 3.3. Verificación de la Regla de Oro ($\le 3$ Interacciones)
Se auditó formalmente el árbol de interacción para el acceso a cualquier contenido formativo desde la pantalla de Inicio:
- *Biblioteca comunitaria:* Clic en Sidebar (1) $\to$ Clic en plan (2) = **2 clics** (CUMPLE).
- *Mis planes guardados:* Clic en Sidebar (1) $\to$ Clic en plan (2) = **2 clics** (CUMPLE).
- *Mi ADN Pedagógico:* Clic en Sidebar (1) = **1 clic** (CUMPLE).
- *Plantillas PEI:* Clic en Sidebar (1) $\to$ Clic en formato (2) = **2 clics** (CUMPLE).
- *Diapositivas OVA:* Pestaña Material (1) $\to$ Diapositivas (2) = **2 clics** (CUMPLE).
- *Rúbricas Analíticas:* Clic en Rúbrica (1) = **1 clic** (CUMPLE).
- *Cuestionario / Quiz:* Pestaña Material (1) $\to$ Quiz (2) = **2 clics** (CUMPLE).
- *Trivia Gamificada:* Pestaña Material (1) $\to$ Trivia (2) = **2 clics** (CUMPLE).
- *Acerca de:* Clic en Sidebar (1) = **1 clic** (CUMPLE).
- **Dictamen:** **100% de cumplimiento**. Promedio empírico de acceso: 1.7 interacciones.

---

## 4. Participación del Equipo y Roles
- **Daniel Tapias (Desarrollador / Frontend):** Análisis del sistema de rutas (`App.jsx`), validación de parámetros de URL (`useSearchParams`), diseño de la arquitectura jerárquica de 5 niveles MODESEC y codificación del mapa vectorial SVG. *(Participación verificada)*.
- **Luis Caldera (Desarrollador / Frontend):** Auditoría de las rutas de usuario, diseño de la experiencia interactiva, validación técnica de la regla de $\le 3$ clics y pruebas de navegación por teclado / breadcrumbs. *(Participación verificada)*.
- **Zoe Peñata (Scrum Master):** Alineación de la actividad ACT-006 con la Guía de la Semana 03, control de entregables y aseguramiento de la matriz de evaluación. *(Participación reportada)*.
- **María Soto (Product Owner):** Validación de los recorridos clave de acceso al contenido formativo (Biblioteca y Mis Planes) en un máximo de 3 clics. *(Participación reportada)*.
- **María Ubarne (Product Owner - Apoyo Curricular):** Aseguramiento de la integración transversal de las opciones DUA y plantillas PEI en el mapa. *(Participación reportada)*.
- **Maira Ortega (Facilitadora / Apoyo UI):** Revisión de principios de usabilidad, accesibilidad DUA y consistencia visual con la identidad de marca INSPIRATEC. *(Participación reportada)*.

---

## 5. Aplicación de los 7 Hábitos de Stephen R. Covey en la Actividad

Conforme al marco de efectividad personal e interpersonal de Stephen R. Covey articulado en el proyecto (ver [ACT-016](../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md)), los 6 integrantes del equipo aplicaron los hábitos de la siguiente manera:

| Integrante | Rol Oficial | Hábitos Covey Principales | Evidencia Operativa en ACT-006 |
|---|---|:---:|---|
| **Daniel Tapias** | Desarrollador / Frontend | **H1 (Ser Proactivo)<br>H6 (Sinergizar)** | Tomó la iniciativa técnica para auditar las rutas de React Router v7 (`App.jsx`), eliminar callejones sin salida y conectar sinérgicamente la vista de Mis Planes con el Editor en un flujo bidireccional fluido. |
| **Luis Caldera** | Desarrollador / Frontend | **H2 (Empezar con un Fin en Mente)<br>H5 (Buscar Primero Comprender)** | Visualizó desde el inicio el resultado esperado (mapa vectorial SVG de alta legibilidad en 5 niveles MODESEC) y comprendió las necesidades de navegación del docente para diagramar controles claros. |
| **Zoe Peñata** | Scrum Master | **H3 (Poner Primero lo Primero)** | Priorizó los requisitos estrictos de la Guía de la Semana 03 frente a tareas accesorias, garantizando que el mapa contara con los 5 niveles exigidos antes de dar por cerrada la actividad. |
| **María Soto** | Product Owner | **H2 (Empezar con un Fin en Mente)<br>H4 (Pensar en Ganar-Ganar)** | Aseguró que el acceso a los planes formativos y a la biblioteca fuera inmediato (≤ 2 interacciones), generando un beneficio directo tanto para el docente (ahorro de tiempo) como para la plataforma (adopción). |
| **María Ubarne** | Product Owner (Apoyo) | **H6 (Sinergizar)<br>H7 (Afilar la Sierra)** | Articuló los componentes de inclusión DUA y plantillas PEI de forma transversal en el mapa, y promovió la mejora continua del flujo revisando la consistencia entre pantallas principales y secundarias. |
| **Maira Ortega** | Facilitadora / UI | **H5 (Buscar Primero Comprender y Después Ser Comprendido)** | Analizó los recorridos visuales poniéndose en el lugar de docentes con diversos niveles de competencia digital, garantizando etiquetas comprensibles y controles universales (Regresar, Inicio, Ayuda, Cerrar) en cada ventana. |

---

## 6. Productos y Evidencias

| Entregable | Formato | Ubicación en el Repositorio | Descripción |
|:---|:---:|:---|:---|
| **Mapa de Navegación Oficial** | Imagen (`.png`) | [`docs/evidencias/ACT-006/MAPA_NAVEGACION.png`](../evidencias/ACT-006/MAPA_NAVEGACION.png) | Esquema visual oficial del mapa de navegación con los 3 niveles jerárquicos y flujos hacia abajo. |
| **Documento Maestro del Mapa** | Markdown (`.md`) | [`docs/diseno-multimedial/MAPA_NAVEGACION.md`](../diseno-multimedial/MAPA_NAVEGACION.md) | Fundamentación metodológica, auditoría de rutas y verificación de la regla de $\le 3$ interacciones. |
| **Carpeta de Evidencias ACT-006** | Directorio (`README.md`) | [`docs/evidencias/ACT-006/`](../evidencias/ACT-006/README.md) | Carpeta de evidencias y entregables de la Semana 03. |
| **Registro de Inteligencia Artificial** | Markdown (`.md`) | [`docs/ia/REGISTRO_IA_ACT-006.md`](../ia/REGISTRO_IA_ACT-006.md) | Registro del soporte de IA bajo metodología ROCAS. |

---

## 7. Integración de IA
- **Registro Formal de IA:** [REGISTRO_IA_ACT-006.md](../ia/REGISTRO_IA_ACT-006.md)
- **Metodología:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida) y verificación humana con pruebas funcionales del enrutador React.

---

## 8. Evaluación y Monitoreo
- **Cumplimiento:** 5/5
- **Calidad Técnica:** 5/5
- **Evidencia Gráfica:** 5/5
- **Documentación Metodológica:** 5/5
- **Coherencia con MODESEC:** 5/5
- **Observaciones:** Producto de alta fidelidad, con trazabilidad rigurosa, cumplimiento del 100% de la regla de 3 interacciones y soporte para responsive design en dispositivos móviles, tablets y escritorio.
