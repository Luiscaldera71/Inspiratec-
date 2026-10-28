# Mockups de Alta Fidelidad — INSPIRATEC
## Ecosistema Digital de Andamiaje Pedagógico y Co-diseño Curricular

---

### Identificación de la Actividad
- **Código:** ACT-007 (Actividad 5 del Plan de Trabajo)
- **Denominación Oficial:** Diseñar Mockups de Alta Fidelidad
- **Semana:** Semana 3 / Semana 10 (Consolidación)
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial) y las Tres Reglas de Oro de Theo Mandel
- **Ubicación:** `docs/diseno-interface/mockups/`

---

## 1. Inventario de Mockups de Alta Fidelidad

En correspondencia con los requerimientos de la actividad, se consolidaron los 4 mockups representativos del flujo nuclear del software:

| Archivo Mockup | Vista Representada | Ruta en el Frontend | Propósito en el Flujo |
|---|---|---|---|
| **`mockup-inicio.png`** | Ventana de Inicio | `/home` | Entrada editorial, resumen de métricas y acceso rápido a modelos. |
| **`mockup-planificador.png`** | Planificador de Clases (Wizard) | `/` | Co-diseño guiado en 4 fases tripartitas (Básica, Metodología, MEN, DUA). |
| **`mockup-grafo-prerrequisitos.png`** | Grafo Ontológico de Prerrequisitos | Modal / `/` | Explorador interactivo de competencias y progresión de la Guía 30 del MEN. |
| **`mockup-adn-pedagogico.png`** | Mi ADN Pedagógico & Transversalidad | `/adn-pedagogico` | Memoria contextual, métricas de éxito y configuración del perfil docente. |
| **`mockup-caja-herramientas.png`** | Caja de Herramientas y DUA | `/adn-pedagogico` | Selección de dinámicas de inicio, evaluación formativa y receta pedagógica. |
| **`mockup-dashboard.png`** | Repositorio / Dashboard | `/mis-planes` | Panel de gestión curricular, filtrado, sincronización y acciones sobre planes. |
| **`mockup-actividad.png`** | Arquitectura Curricular / Plantillas | `/plantillas` | Catálogo de estructuras didácticas, transferencia al asistente e inspección. |
| **`mockup-resultados.png`** | Editor Curricular / Resultados | `/editor` | Lienzo de trabajo con el plan generado, co-docente socrático IA y exportación. |
| **`mockup-admin-analiticas.png`** | Administración — Analíticas | `/administracion` | Métricas KPI macroscópicas, Donut Chart SVG por nivel y producción STEAM. |
| **`mockup-admin-directorio.png`** | Administración — Directorio | `/administracion` | Registro de claustro docente, filtros por nivel y protección Habeas Data. |
| **`mockup-admin-adn-colectivo.png`** | Administración — ADN Colectivo | `/administracion` | Diagnóstico declarada vs aplicada, caja DUA institucional y banco probado. |
| **`mockup-admin-tickets.png`** | Administración — Tickets Soporte | `/administracion` | Gestión y resolución en tiempo real de incidencias y dudas pedagógicas. |
| **`mockup-biblioteca.png`** | Biblioteca Comunitaria | `/biblioteca` | Repositorio abierto de secuencias didácticas compartidas, filtro por grado y clonación. |
| **`mockup-foro.png`** | Foro Docente Interactivo | `/foro` | Comunidad académica de aprendizaje, debate pedagógico y categorización temática. |
| **`mockup-ayuda.png`** | Centro de Ayuda Pedagógica | `/ayuda` | Base de conocimiento, acordeones interactivos colapsables y FAQ de uso. |
| **`mockup-soporte.png`** | Soporte Técnico Institucional | `/soporte` | Mesa de ayuda, formulario de tickets con validación y protección Ley 1581. |
| **`mockup-experiencias.png`** | Banco de Experiencias | `/experiencias` | Sistematización de práctica docente, privacidad, valoración por estrellas y réplicas. |
| **`mockup-acerca.png`** | Acerca de INSPIRATEC | `/acerca` | Identidad institucional, principios axiológicos (Misión, DUA, Innovación) y equipo creador Unicordobés. |
| **`mockup-configuracion.png`** | Configuración de IA (API Key) | `/config` | Soberanía tecnológica, ingreso seguro de clave BYOK Google Gemini y prueba en vivo. |
| **`mockup-autodiagnostico.png`** | Autodiagnóstico Felder-Silverman | `/config` | Autoevaluación en 8 reactivos, gráfico radial interactivo DUA y 4 dimensiones. |
| **`mockup-menu-usuario.png`** | Menú Desplegable de Usuario | Global / Barra superior | Popover de cristal con datos de sesión, rol de usuario y accesos directos de cuenta. |
| **`mockup-informacion-docente.png`** | Ventana Emergente Información Docente | Modal / `UserMenu` | Diálogo modal accesible con verificación JWT, datos protegidos y opción de edición. |
| **`mockup-cambiar-contrasena.png`** | Ventana Emergente Cambiar Contraseña | Modal / `UserMenu` | Diálogo modal de seguridad para reautenticación y actualización de clave en Firebase. |
| **`mockup-bienvenida.png`** | Bienvenida Inmersiva INSPIRATEC | Modal global / Onboarding | Experiencia interactiva de 8 escenas con narrativa pedagógica y recorrido guiado. |
| **`mockup-auth-login.png`** | Autenticación — Inicio de Sesión | `/login` | Acceso seguro a la plataforma con credenciales docentes, carrusel narrativo y protección JWT. |
| **`mockup-auth-registro.png`** | Autenticación — Registro Docente | `/login` | Formulario de vinculación institucional, nivel, metodología pedagógica y aceptación de Términos (Ley 1581). |

---

## 2. Aplicación de las Tres Reglas de Oro de Theo Mandel

### Regla 1: Dar el Control al Usuario
- **Navegación Soberana:** El docente puede retroceder, pausar o cancelar cualquier operación en el planificador mediante el guardado de borradores intermedios.
- **Transparencia y No Imposición:** El co-docente socrático de IA formula preguntas y propuestas reflexivas sin mutar arbitrariamente el texto del plan de clase. La decisión final de aceptar o rechazar cambios recae siempre en el usuario.
- **Acciones Reversibles:** Los cuadros de diálogo modales de confirmación segura (`ConfirmModal.jsx`) previenen la eliminación accidental de secuencias didácticas.

### Regla 2: Reducir la Carga de Memoria del Usuario
- **Reconocimiento sobre Recuerdo:** En lugar de obligar al docente a recordar estándares del MEN o taxonomías, el sistema despliega selectores estructurados con los DBA, competencias de la Guía 30 y principios DUA.
- **Visibilidad del Estado del Sistema:** La barra de pasos del wizard (`1. Información básica`, `2. Metodología`, `3. Estándares`, `4. Inclusión DUA`) y el semáforo de conectividad con Gemini en la barra superior informan en todo momento la situación del sistema.
- **Metadatos Explícitos en Tarjetas:** Cada tarjeta de plan o plantilla exhibe claramente su grado escolar, materia, fecha y estado de publicación, evitando la necesidad de abrir el archivo para conocer su contenido.

### Regla 3: Mantener la Consistencia Visual
- **Sistema de Diseño Unificado:** Todos los mockups comparten la paleta cromática verde salvia (`#477A72`) y petróleo (`#142B25`, `#183630`), con superficies de cristal translúcido marfil (`rgba(255, 254, 250, 0.86)` con `backdrop-filter: blur(16px)`).
- **Tipografía Coherente:** Jerarquía estricta con fuente serif `Lora` para títulos/métricas y sans-serif `DM Sans` para controles de interfaz y lectura continua.
- **Iconografía Homogénea:** Familia vectorial completa de `lucide-react` con grosores de trazo y tamaños uniformes en todas las vistas.

---

## 3. Especificaciones Visuales por Mockup

### 3.1 Mockup 1 — Inicio (`mockup-inicio.png`)
- **Colores:** Fondo marfil translúcido `rgba(255, 254, 250, 0.86)`, borde blanco `rgba(255, 255, 255, 0.94)`, acento verde institucional `#183630`, alerta advertencia `#EA580C`.
- **Tipografía:** Título H1 en `Lora` (28px, bold, color `#142B25`), textos en `DM Sans` (14.5px, color `#243630`).
- **Iconos:** `Sparkles`, `PlusCircle`, `BookOpen`, `Dna`, `FileText`, `Settings`, `ArrowRight`.
- **Botones:** Botón primario *"Iniciar Planificador de Clases"*, botón secundario *"Ver Plantillas Curriculares"*, botón *"Calibrar / Cambiar"*.
- **Distribución:** Layout asimétrico con dock lateral flotante a la izquierda, barra de utilidades superior a la derecha y tres franjas de contenido centradas.

### 3.2 Mockup 2 — Planificador de Clases (`mockup-planificador.png`)
- **Colores:** Banner verde suave para ADN Pedagógico, tarjetas de formulario en cristal marfil con bisel blanco de 1px, botones de acción en verde petróleo `#183630`.
- **Tipografía:** Título H1 `Lora` (26px), stepper numerado en `DM Sans` (13px, semibold), inputs y selectores (14px).
- **Iconos:** `RotateCcw`, `Check`, `CheckSquare`, `ArrowRight`, `ArrowLeft`, `Save`, `Sparkles`, `Share2`, `Eye`, `VolumeX`, `Accessibility`, `ShieldCheck`.
- **Botones:** Botón *"Comenzar nuevo plan en blanco"*, *"Sugerir con IA"*, *"Grafo de Prerrequisitos (MEN)"*, *"Sugerir estándares"*, *"Guardar progreso"*, *"Siguiente →"*, *"← Volver"*, *"Generar Clase"*.
- **Distribución:** Layout secuencial estructurado por tarjetas temáticas agrupadas (Tema, Audiencia, Recursos, Metodología, DUA).

### 3.3 Mockup 3 — Grafo Interactivo de Prerrequisitos (`mockup-grafo-prerrequisitos.png`)
- **Colores:** Columnas de cristal translúcido por ciclos escolares, nodos con bordes codificados por color según eje disciplinar (verde, azul, naranja), aristas SVG en verde salvia.
- **Tipografía:** Encabezados de columna y códigos MEN en `DM Sans` (11px a 13px, bold).
- **Iconos:** `Layers`, `Compass`, `ZoomIn`, `ZoomOut`, `RotateCcw`.
- **Botones:** Selectores de Grado y Eje, controles de escala y zoom (85%), nodos clicables de transferencia.
- **Distribución:** Modal/Drawer de amplia visualización (90% viewport) con canvas SVG interactivo.

### 3.4 Mockup 4 — Dashboard de Planes (`mockup-dashboard.png`)
- **Colores:** Tarjetas en cristal translúcido, insignias verdes de estado `#166534`, fondo de acento tenue `#E7EDE7`.
- **Tipografía:** Título H1 `Lora` (28px), metadatos en `DM Sans` (12px, semibold), títulos de tarjetas `Lora` (18px).
- **Iconos:** `Search`, `RefreshCw`, `PlusCircle`, `Eye`, `Sparkles`, `Share2`, `Download`, `Copy`, `Trash2`.
- **Botones:** *"Sincronizar"*, *"Crear Nuevo Plan"*, pestañas de filtro (*Todos*, *Guardados*, *Sistematizados*, *En Biblioteca*), botoneras de tarjeta (*Abrir*, *Sistematizar*, etc.).
- **Distribución:** Cabecera con migas de pan y métricas, barra de búsqueda y filtros intermedia, cuadrícula responsive de 3 columnas para tarjetas.

### 3.5 Mockup 5 — Actividad y Plantillas (`mockup-actividad.png`)
- **Colores:** Badges ámbar de estructura predeterminada, badges verdes de pública, fondo marfil de alto contraste.
- **Tipografía:** Título H1 `Lora` (28px), encabezados de plantillas en `Lora` (17px, bold), descripciones en `DM Sans` (13px).
- **Iconos:** `Layers`, `Plus`, `Search`, `Globe`, `CheckCircle`, `Eye`, `Share2`, `Trash2`.
- **Botones:** Botón primario *"+ Nueva Estructura"*, botones en tarjetas *"Usar en Asistente"*, botones *"Ver"*.
- **Distribución:** Panel superior con contador cuantitativo de modelos, barra de búsqueda temática y rejilla de 6 tarjetas de modelos del MEN.

### 3.6 Mockup 6 — Resultados y Editor (`mockup-resultados.png`)
- **Colores:** Superficie blanca elevada para el lienzo del documento, panel lateral con tinte suave de co-docente, texto de alto contraste WCAG AAA.
- **Tipografía:** Formato Markdown con títulos H1-H3 en `Lora` y párrafos en `DM Sans`.
- **Iconos:** `Save`, `Download`, `MessageSquare`, `Layers`, `FileCheck`.
- **Botones:** *"Guardar Plan"*, *"Exportar PDF"*, *"Descargar MD"*, *"Auditar DUA"*, *"Generar Rúbrica"*.
- **Distribución:** Vista dividida (*split-screen*) con editor estructurado en el 65% del ancho y panel de asistencia socrática en el 35%.

### 3.7 Mockups 7 a 10 — Módulo de Administración y Control
- **`mockup-admin-analiticas.png`:**
  - **Colores:** Pestañas translúcidas marfil `rgba(255, 254, 250, 0.86)`, Donut Chart SVG con arcos verde bosque `#183630`, verde salvia `#477A72` y gris platino, barras de progreso STEAM.
  - **Tipografía:** Cifras KPI en `Lora` (32px, bold), leyendas y porcentajes en `DM Sans` (12px a 14px).
  - **Iconos:** `BarChart3`, `Users`, `BookOpen`, `Sparkles`, `Award`, `Activity`.
  - **Distribución:** 4 tarjetas KPI en cuadrícula superior, panel Donut a la izquierda y producción STEAM a la derecha.
- **`mockup-admin-directorio.png`:**
  - **Colores:** Tabla con filas de cristal blanco `rgba(255, 255, 255, 0.92)`, badge de Habeas Data verde esmeralda con borde fino.
  - **Tipografía:** Cabeceras en `DM Sans` (13px, semibold), correos y nombres en `DM Sans` (14px).
  - **Iconos:** `Search`, `CheckCircle2`, `Lock`, `Unlock`, `Users`.
  - **Botones:** Filtros por nivel formativo (*Todos*, *Primaria*, *Secundaria*, *Media*), botones *"Ver Detalle"*.
- **`mockup-admin-adn-colectivo.png`:**
  - **Colores:** Badges institucionales verdes, barra comparativa con indicador de brecha curricular del 80%, estrellas doradas en banco de recursos.
  - **Tipografía:** Títulos H1 y métricas de claustro en `Lora`, etiquetas DUA y proyectos en `DM Sans`.
  - **Iconos:** `Dna`, `Layers`, `Lightbulb`, `Star`, `Compass`, `ShieldCheck`.
  - **Botones:** Botón *"Ir a mi ADN Personal"*, botones *"Ver Ficha"* en huella curricular docente.
- **`mockup-admin-tickets.png`:**
  - **Colores:** Badge de estado "Pendiente" en fondo ámbar suave `#FEF3C7` con texto `#92400E`, botón de respuesta en verde bosque `#183630`.
  - **Tipografía:** Asunto de ticket en `Lora` (20px, bold), metadatos y cuerpo en `DM Sans` (14px).
  - **Iconos:** `MessageSquare`, `Send`, `Clock`, `ShieldAlert`.
  - **Botones:** Botón primario *"Responder"* con icono `Send`.

### 3.8 Mockups 11 a 14 — Biblioteca, Foro, Ayuda y Soporte
- **`mockup-biblioteca.png` (Biblioteca Comunitaria):**
  - **Colores:** Badge verde esmeralda translúcido, tarjetas en cristal blanco con bisel de 1px, botón primario verde bosque `#183630`.
  - **Tipografía:** Título H1 `Lora` (28px), títulos de recursos en `Lora` (20px, bold), metadatos en `DM Sans` (13px).
  - **Iconos:** `Library`, `Search`, `Filter`, `Download`, `User`, `BookOpen`, `GraduationCap`, `Eye`, `Copy`.
  - **Botones:** Selector desplegable de grados, botones *"Previsualizar"* y *"Usar Plan"*.
- **`mockup-foro.png` (Foro Docente Interactivo):**
  - **Colores:** Badges categoriales multicolor armonizados (`#315B54`, `#D4AF37`, `#2B524A`, `#10B981`), botón primario verde oscuro `#183630`.
  - **Tipografía:** Título H1 `Lora` (28px), títulos de debates en `Lora` (20px, bold), textos en `DM Sans` (14px).
  - **Iconos:** `MessagesSquare`, `PlusCircle`, `Search`, `PanelLeftClose`, `PanelRightClose`, `Clock`, `ShieldCheck`, `Bookmark`, `Share2`, `Trash2`, `Send`.
  - **Botones:** Botón *"+ Nueva discusión"*, toggles de paneles laterales, filtros de categoría y botones *"Participar →"*.
- **`mockup-ayuda.png` (Centro de Ayuda Pedagógica):**
  - **Colores:** Acordeones en cristal marfil con borde blanco, chevrones indicadores de rotación suave, botón de soporte en verde salvia.
  - **Tipografía:** Título H1 `Lora` (28px), preguntas en `Lora` (18px, bold), explicaciones en `DM Sans` (14px).
  - **Iconos:** `HelpCircle`, `BookOpen`, `LifeBuoy`, `Search`, `Sparkles`, `FileText`, `Compass`, `ChevronDown`, `ChevronUp`.
  - **Botones:** Acordeones colapsables interactivos y botón *"Contactar a Soporte Técnico"*.
- **`mockup-soporte.png` (Soporte Técnico Institucional):**
  - **Colores:** Formulario en cristal blanco con inputs de bisel suave, paneles informativos de IA y privacidad con badges redondeados.
  - **Tipografía:** Título H1 `Lora` (28px), subtítulo en `DM Sans` (15px), etiquetas de formulario en `DM Sans` (14px, semibold).
  - **Iconos:** `LifeBuoy`, `Clock`, `MessageSquare`, `Send`, `Sparkles`, `AlertCircle`, `CheckCircle2`.
  - **Botones:** Botón primario *"Enviar Solicitud"* con icono `Send`.

### 3.9 Mockup 15 — Banco de Experiencias Pedagógicas
- **`mockup-experiencias.png` (Banco de Experiencias Pedagógicas):**
  - **Colores:** Badges verde bosque translúcido, estrellas de calificación en amarillo ámbar `#F59E0B`, botón primario verde bosque `#183630`, tarjetas en cristal marfil con borde de 1px.
  - **Tipografía:** Título H1 `Lora` (28px), títulos de experiencias en `Lora` (20px, bold), metadatos curriculares y autoría en `DM Sans` (13px/14px).
  - **Iconos:** `Sparkles`, `Globe`, `Lock`, `FileCheck`, `Search`, `Heart`, `Calendar`, `BookOpen`, `GraduationCap`, `Star`, `MessageSquare`, `Edit3`, `Trash2`.
  - **Botones:** Conmutadores de pestañas (*Mis Experiencias* vs *Comunidad*), botones de acción en tarjetas (*"Editar"*, *"Hacer Privada"*, *"Ver Experiencia"*, *"Calificar"*).

### 3.10 Mockup 16 — Acerca de INSPIRATEC
- **`mockup-acerca.png` (Acerca de INSPIRATEC — Identidad, Propósito y Equipo Creador):**
  - **Colores:** Superficies de cristal esmerilado marfil `rgba(255, 254, 250, 0.86)` con `backdrop-filter: blur(16px)`, bordes blancos ultradelgados `rgba(255, 255, 255, 0.94)`, acentos cromáticos armónicos: verde petróleo (`#142B25`, `#183630`), verde salvia (`#477A72`), verde esmeralda DUA (`#166534`), violeta innovación (`#6D28D9`), y gris/verde neutro (`#243630`, `#2B453E`).
  - **Tipografía:** Título H1 en `Lora` (28px, bold, color `#142B25`), títulos de sección H2 en `Lora` (22px, bold), subtítulos de tarjetas en `DM Sans` (16px a 17px, bold), cuerpo textual explicativo en `DM Sans` (13.5px a 14.5px, regular/medium), insignias editoriales y píldoras en `DM Sans` (12px / 14px, semibold/bold).
  - **Iconos:** `Users`, `Sparkles`, `BookOpen`, `Target`, `Heart`, `Lightbulb`, `ExternalLink`.
  - **Botones y Enlaces:** Botones píldora de contorno (*btn-outline*) *"Ver Perfil"* con icono `<ExternalLink size={13}>` vinculados a los repositorios de GitHub de cada uno de los 6 integrantes del equipo.
  - **Distribución:** Layout editorial estructurado en cuatro bloques:
    1. Cabecera editorial con icono distintivo `<Users>`, insignia *"Identidad, Enfoque y Propósito"*, título, subtítulo y píldoras cuantitativas (*Enfoque MEN & DUA*, *6 Creadores*).
    2. Cuadrícula de 3 tarjetas de principios axiológicos (*Nuestra Misión*, *Inclusión Total (DUA)*, *Innovación Pedagógica*).
    3. Franja introductoria de talento local con insignia *"Talento Unicordobés"*, título *"El Equipo Creador"* y síntesis investigativa.
    4. Cuadrícula responsiva de 6 tarjetas de integrantes con avatares circulares de alta fidelidad, nombres, etiquetas de rol Scrum y enlaces de perfil.

### 3.11 Mockup 17 y 18 — Configuración de IA y Autodiagnóstico Pedagógico
- **`mockup-configuracion.png` (Configuración de IA — Pestaña API Key):**
  - **Colores:** Superficie de cristal marfil translúcido `rgba(255, 254, 250, 0.88)` con `backdrop-filter: blur(16px)`, acento verde petróleo `#142B25` en pestaña activa y botón primario, bisel blanco fino, indicador de estado seguro en verde salvia y aviso informativo de privacidad en gris suave.
  - **Tipografía:** Título H1 `Lora` (28px, bold, `#142B25`), encabezado de tarjeta H2 `Lora` (18px, bold), subtítulos y etiquetas en `DM Sans` (14.5px y 13.5px).
  - **Iconos:** `Key`, `Sparkles`, `ShieldCheck`, `Eye`, `EyeOff`, `ExternalLink`, `Compass`.
  - **Botones y Controles:** Selector de pestañas tablist de cristal (*Inteligencia Artificial (API Key)* y *Autodiagnóstico Felder-Silverman*), campo de contraseña con máscara oculta y toggle de visibilidad `Eye`, botón primario *"Guardar y Probar Conexión"* con icono `ShieldCheck`, y enlace inferior de ayuda *"Obtener en Google AI Studio"* con icono `ExternalLink`.
  - **Distribución:** Cabecera con icono `<Key>`, badge editorial, título, subtítulo explicativo de soberanía BYOK y dos píldoras de estado (*API Key Configurada*, *Autodiagnóstico Pendiente*); barra intermedia con conmutador de pestañas y tarjeta principal centrada de gestión de credenciales.

- **`mockup-autodiagnostico.png` (Autodiagnóstico Pedagógico Felder-Silverman — Pestaña Autodiagnóstico):**
  - **Colores:** Lienzo extendido de cristal translúcido, insignias temáticas con fondos pasteles suaves (ámbar para advertencias científicas, verde para progreso y azul tenue para dimensiones), gráfico radial SVG con polígonos translúcidos en verde salvia (`#477A72`) y aristas de alta visibilidad, barras de progreso de las 4 dimensiones curriculares en degradé esmeralda/verde bosque.
  - **Tipografía:** Título H1 `Lora` (28px), títulos H2 y H3 en `Lora` (20px / 16px bold), enunciados de reactivos en `DM Sans` (13.5px semibold), opciones de respuesta en `DM Sans` (13px), recomendaciones DUA en `DM Sans` (12.5px).
### 3.12 Mockups 19 a 22 — Modales de Usuario, Credenciales y Bienvenida Narrativa
- **`mockup-menu-usuario.png` (Menú Desplegable de Usuario — Popover Glassmorphism):**
  - **Colores:** Contenedor flotante desacoplado en cristal translúcido marfil `rgba(255, 254, 250, 0.94)` con `backdrop-filter: blur(20px)`, borde blanco fino `1px solid rgba(255, 255, 255, 0.95)`, sombra de elevación profunda `0 12px 32px rgba(16, 36, 32, 0.16)`, badge de rol "Admin" en violeta suave (`background: rgba(124, 58, 237, 0.12)`, `color: #6D28D9`), texto peligroso "Cerrar Sesión" en rojo carmesí `#DC2626`.
  - **Tipografía:** Nombre de usuario en `DM Sans` (14px, bold, `#142B25`), correo institucional en `DM Sans` (12px, `#4A5551`), opciones de menú en `DM Sans` (13px, semibold).
  - **Iconos:** `User`, `Key`, `Sparkles` (dorado institucional `#D4AF37`), `LogOut`.
  - **Botones y Controles:** Opciones clicables con hover suave (`.user-menu-item-glass`): *"Mi Perfil"*, *"Cambiar Contraseña"*, *"Bienvenida INSPIRATEC"*, y separador con *"Cerrar Sesión"*.

- **`mockup-informacion-docente.png` (Ventana Emergente — Información del Docente):**
  - **Colores:** Telón modal con desenfoque de fondo, caja de diálogo en cristal blanco marfil `rgba(255, 254, 250, 0.96)`, cabecera con icono `<User>` en verde salvia, tarjeta de verificación de sesión en verde esmeralda translúcido (`rgba(22, 163, 74, 0.10)` con borde y texto verde `#166534`), inputs de lectura en gris claro `#F1F5F3` con bordes suaves, badge "Solo lectura" y badge de rol "Admin" en violeta.
  - **Tipografía:** Título de diálogo en `Lora` (22px, bold, `#142B25`), etiquetas de metadato en mayúsculas `DM Sans` (11px, bold, `#435750`), valores en `DM Sans` (14px, medium), botones en `DM Sans` (13.5px, bold).
  - **Iconos:** `User`, `X`, `ShieldCheck`, `Edit2` / `PenSquare`.
  - **Botones y Controles:** Botón de cierre superior `<X>`, botón secundario *"Cerrar"* y botón primario *"Editar Información"* (fondo verde bosque `#183630`, color blanco).

- **`mockup-cambiar-contrasena.png` (Ventana Emergente — Cambiar Contraseña):**
  - **Colores:** Diálogo centrado con esquinas redondeadas (`borderRadius: 24px`), superficie de cristal marfil con bisel perimetral, campos de texto con iconos conmutadores de ojo (`Eye`/`EyeOff`), botón primario en verde bosque oscuro `#142B25`.
  - **Tipografía:** Título en `Lora` (22px, bold), etiquetas de campo en `DM Sans` (13px, semibold), placeholders descriptivos en `DM Sans` (13px).
  - **Iconos:** `Key`, `X`, `Eye`, `EyeOff`, `Lock`.
  - **Botones y Controles:** 3 campos de contraseña protegidos (*Contraseña Actual*, *Nueva Contraseña*, *Confirmar Nueva Contraseña*) con botones de visibilidad, botón *"Cancelar"* y botón primario *"Actualizar Contraseña"* con icono `Lock`.

- **`mockup-bienvenida.png` (Ventana Inmersiva — Bienvenida Narrativa INSPIRATEC):**
  - **Colores:** Experiencia editorial inmersiva a pantalla completa con mosaico visual de fondo desenfocado, tarjeta flotante en verde petróleo profundo `#132622` con `backdrop-filter: blur(24px)` y borde sutil, insignia superior con chispa dorada, píldora de avance numerada (*01 / 08*), tarjeta de consejo en verde oscuro translúcido con icono verde de chequeo `CheckCircle2`.
  - **Tipografía:** Título principal H1 en `Lora` (30px, bold, color blanco marfil `#FFFDF9`), texto editorial reflexivo en `DM Sans` (14px, interlineado 1.6, color `#E0EAE6`), botón de acción en `DM Sans` (13.5px, bold).
  - **Iconos:** `Lightbulb`, `X`, `Sparkles`, `CheckCircle2`, `ArrowRight`, `ChevronUp`, `ChevronDown`.
  - **Botones y Controles:** Barra de cierre superior con marca INSPIRATEC y botón `<X>`, indicador vertical de pasos con puntos interactivos a la izquierda, botón primario *"Comenzar Recorrido →"*, y dock flotante inferior con flechas de navegación arriba/abajo, contador de escena (*01 / 08*) y botón *"Explorar por mi cuenta"*.

### 3.13 Mockups 25 y 26 — Autenticación: Inicio de Sesión y Registro Docente (`mockup-auth-login.png`, `mockup-auth-registro.png`)
- **`mockup-auth-login.png` (Inicio de Sesión / Acceso):**
  - **Colores:** Fondo cinematográfico de campus universitario y aula activa con degradado oscuro progresivo lateral (`linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)`), panel derecho en cristal esmerilado *Glassmorphism* oscuro `rgba(24, 35, 34, 0.4)` con `backdrop-filter: blur(20px)` y borde de luz `1px solid rgba(255, 255, 255, 0.6)`. Botón primario en verde institucional activo `var(--primary-active)` (`#10b981`), badge de seguridad en gris ahumado translúcido con icono verde menta `#14b8a6`.
  - **Tipografía:** Logotipo superior en `Georgia` / serif editorial (28px, negrita, `#F8FAFC`, tracking 1px), titular narrativo izquierdo H1 en `DM Sans` (48px, 800) con resaltado verde `#10b981`, cuerpo del formulario en `DM Sans` (13px semibold para etiquetas, 14px para campos), botón en 15px negrita.
  - **Iconos:** `Shield` (en badge de protección JWT y cifrado), `Eye` / `EyeOff` (toggle de visibilidad de contraseña).
  - **Botones y Controles:** 5 píldoras interactivas de cambio de escena en el carrusel narrativo inferior (anchura reactiva 36px/12px), campos de texto (*Correo Electrónico*, *Contraseña* protegida con botón de ojo), botón primario *"Ingresar"* con estado `:hover` verde salvia, badge de seguridad *"Protección con JWT y Cifrado"* y enlace interactivo *"¿No tienes cuenta? Regístrate aquí"*.

- **`mockup-auth-registro.png` (Registro Docente y Vinculación Curricular):**
  - **Colores:** Misma atmósfera cinematográfica nocturna/crepuscular de aula viva. Tarjeta flotante con barra de desplazamiento estilizada, contenedores de inputs en blanco perlado translúcido `rgba(255, 255, 255, 0.9)` con texto oscuro `#0F172A`, caja de consentimiento informado en cristal translúcido con borde tenue, acento verde esmeralda en el botón de acción principal.
  - **Tipografía:** Idéntica jerarquía visual estricta para garantizar consistencia: título de marca en serif, etiquetas de formulario de 13px con contraste de alta legibilidad sobre cristal oscuro, advertencias de validación en 11px (*"Mínimo 6 caracteres"*).
  - **Iconos:** `Eye`, `EyeOff`, `Shield`.
  - **Botones y Controles:** Cuadrícula de 2 columnas para *Institución* y *Nivel* (Primaria, Secundaria, Media), selector desplegable de *Metodología o Enfoque Institucional* (ABP, STEAM, EpC, etc.), campo de correo y contraseña con revelador, checkbox legal de *Aceptación de Términos y Condiciones (Ley 1581 / Habeas Data)* con hipervínculo que dispara el modal de términos, botón primario *"Registrarme"* y enlace alternador *"¿Ya tienes cuenta? Inicia sesión"*.






