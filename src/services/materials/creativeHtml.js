/**
 * creativeHtml.js
 * Motor de generación de recursos HTML a medida con IA.
 *
 * Cada recurso se diseña desde cero: en cada llamada se sortea una dirección visual y un
 * formato de interacción distintos para que dos recursos del mismo tipo no se parezcan.
 * Si la IA falla o entrega un HTML defectuoso NO se fabrica contenido de reemplazo:
 * se lanza un error claro para que el docente reintente.
 */

const DESIGN_DIRECTIONS = [
  'Cuaderno de campo: fondo papel cálido, trazos tipo lápiz, notas adhesivas y subrayados a mano, acentos terracota.',
  'Laboratorio nocturno: fondo azul marino profundo, acentos neón cian y lima, tarjetas de vidrio con brillo sutil.',
  'Bauhaus lúdico: formas geométricas primarias (círculos, cuadrados, triángulos), colores rojo, amarillo y azul, tipografía muy gruesa.',
  'Mapa del tesoro: texturas de pergamino, rutas punteadas, íconos de hitos y brújula, paleta tierra y verde bosque.',
  'Panel de misión espacial: interfaz tipo cabina, indicadores, barras de progreso, paleta grafito con ámbar y turquesa.',
  'Papel recortado: capas con sombras suaves como collage de papel, colores pastel saturados, esquinas redondeadas amplias.',
  'Minimalismo editorial: mucho espacio en blanco, tipografía serif de gran tamaño, un solo color de acento intenso.',
  'Ciudad de bloques: estética de piezas encajables, bordes marcados, colores brillantes planos, sombras duras.',
  'Acuarela suave: degradados orgánicos, fondos translúcidos, formas fluidas, paleta verdes y corales.',
  'Arcade retro: cuadrícula de píxeles, tipografía monoespaciada, paleta de pocos colores vivos, efectos de puntaje.'
];

const INTERACTION_FORMATS = {
  default: [
    'Misión con escenas: el estudiante avanza por escenas de una historia y cada decisión cambia lo que ve.',
    'Laboratorio de variables: controles deslizantes y botones que modifican en vivo una escena animada y muestran el efecto.',
    'Taller de armado: piezas que se arrastran o se ordenan para construir un modelo, proceso o solución, con validación.',
    'Exploración en capas: un esquema grande con zonas que se tocan para revelar explicaciones, ejemplos y retos.',
    'Detective: pistas y evidencias que el estudiante clasifica para llegar a una conclusión justificada.',
    'Estaciones cooperativas: varias estaciones con roles (lector, constructor, verificador, vocero) para trabajar en equipos.'
  ],
  diapositivas: [
    'Presentación narrativa de escenas a pantalla completa con transiciones, atajos de teclado y momentos de pregunta al grupo.',
    'Presentación tipo recorrido donde cada diapositiva incluye una mini actividad que el docente lanza al público.'
  ],
  preguntas: [
    'Cuestionario de rutas: según la respuesta el estudiante recibe pistas distintas y puede reintentar con ayuda.',
    'Casos breves: cada pregunta nace de una situación realista con retroalimentación que explica el porqué.'
  ],
  juegos: [
    'Juego de equipos con marcador compartido en pantalla, turnos y comodines.',
    'Carrera de retos con niveles crecientes, vidas, rachas y medallas.',
    'Juego de construcción de un objeto o ciudad donde cada acierto desbloquea una pieza.'
  ],
  sopa: [
    'Sopa de letras con pistas en lugar de la lista de palabras: el estudiante deduce el término a partir de su definición.',
    'Cruce de palabras y sopa combinados con temporizador y modo cooperativo.'
  ],
  rubrica: [
    'Rúbrica interactiva para autoevaluación y coevaluación que calcula la nota y genera un resumen imprimible.'
  ],
  flashcards: [
    'Tarjetas con repetición espaciada: el estudiante marca si la domina y el sistema vuelve a mostrar las difíciles.',
    'Tarjetas de emparejar y ordenar con modo individual y modo parejas.'
  ],
  taller_contexto: [
    'Taller de problemas reales con datos manipulables, pasos guiados y verificación inmediata.'
  ],
  estudio_caso: [
    'Caso con decisiones ramificadas, roles de equipo y una puesta en común final.'
  ],
  simulacion: [
    'Simulación con parámetros ajustables, gráfica en vivo y preguntas de predicción antes de ejecutar.'
  ],
  laboratorio: [
    'Mesa de laboratorio virtual con instrumentos que se arrastran, tabla de datos que se llena sola y gráfica de resultados.'
  ],
  escape_room: [
    'Sala ilustrada en SVG con objetos que se tocan, acertijos encadenados, pistas con costo y cuenta regresiva.'
  ],
  ruleta: [
    'Ruleta animada en canvas con sectores de retos, dado opcional y marcador por equipos.'
  ],
  tablero: [
    'Tablero de casillas con fichas de equipos, dado, casillas de reto, bonus y retroceso.'
  ],
  memoria: [
    'Tarjetas boca abajo que se voltean, con tiempo, intentos y modo por parejas.'
  ],
  ordenar_pasos: [
    'Tarjetas que se arrastran a una línea de orden con validación paso a paso y explicación.'
  ],
  crucigrama: [
    'Cuadrícula de crucigrama navegable con teclado, pistas horizontales y verticales y verificación por palabra.'
  ],
  linea_tiempo: [
    'Línea horizontal con hitos que se despliegan, zoom por etapas y un reto final de ordenar.'
  ],
  historia_interactiva: [
    'Relato por escenas ilustradas en SVG con decisiones que cambian el rumbo y un resumen de aprendizajes.'
  ],
  reto_equipos: [
    'Tablero de misión con tarjetas de roles, tareas por turnos, progreso del equipo y coevaluación.'
  ],
  debate: [
    'Tablero de dos posturas con banco de argumentos, evidencias, turnos cronometrados y votación final.'
  ],
  mapa_conceptual: [
    'Mapa de nodos conectados dibujado en SVG que se despliega por niveles y permite completar conexiones.'
  ],
  glosario: [
    'Glosario con buscador, letras de navegación y tarjetas con ejemplo y dibujo.'
  ],
  guia_estudiante: [
    'Ficha por pasos con casillas para responder, ejemplos resueltos desplegables y botón de imprimir.'
  ],
  ticket_salida: [
    'Cierre en tres pasos: comprobación rápida, semáforo de comprensión y reflexión escrita, con resumen para imprimir.'
  ]
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Valida de forma estructural el HTML recibido de la IA. Devuelve la lista de problemas.
 */
export function validateGeneratedHtml(html) {
  const problems = [];
  if (!html || typeof html !== 'string') return ['La respuesta está vacía.'];
  if (!/^\s*<!doctype html/i.test(html)) problems.push('No comienza con <!DOCTYPE html>.');
  if (!/<\/html>\s*$/i.test(html)) problems.push('El documento está incompleto (no termina en </html>).');
  if (html.length < 6000) problems.push('El recurso es demasiado corto o simple.');
  if (!/<style[\s>]/i.test(html)) problems.push('No incluye estilos CSS.');
  if (!/<script[\s>]/i.test(html)) problems.push('No incluye JavaScript.');
  if (!/<meta[^>]+viewport/i.test(html)) problems.push('Falta la etiqueta meta viewport.');
  if (/lorem ipsum/i.test(html)) problems.push('Contiene texto de relleno (lorem ipsum).');
  if (!/AudioContext/.test(html)) problems.push('No incluye sonido con la Web Audio API (AudioContext).');
  if (!/@keyframes|transition\s*:|\.animate\(/.test(html)) problems.push('No incluye animaciones (@keyframes, transition o animate).');
  if (/<(?:script|link)[^>]+(?:src|href)=["']https?:\/\//i.test(html)) problems.push('Usa recursos externos (CDN); debe ser autónomo.');

  // Comprobación de sintaxis del JavaScript embebido
  // Solo se revisan los scripts ejecutables (se omiten bloques de datos como application/json)
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(m => !/\btype\s*=\s*["']?(?!text\/javascript|module|application\/javascript)/i.test(m[1]))
    .map(m => m[2]);
  scripts.forEach((code, i) => {
    if (!code.trim()) return;
    try {
      // eslint-disable-next-line no-new-func
      new Function(code);
    } catch (e) {
      problems.push(`Error de sintaxis en el script ${i + 1}: ${e.message}`);
    }
  });
  return problems;
}

function stripFences(text) {
  let out = (text || '').trim();
  out = out.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
  return out;
}

const SYSTEM_INSTRUCTION = `Eres un diseñador instruccional, diseñador de interfaces y desarrollador front-end senior. Creas Objetos Virtuales de Aprendizaje (OVA), simuladores y juegos educativos que se ven profesionales y que un docente puede proyectar en el aula o compartir con sus estudiantes.

ENTREGA: un único archivo HTML5 autónomo con <style> y <script> incluidos. Sin librerías, CDN, fuentes ni imágenes externas (usa SVG, CSS, canvas y emojis si hace falta). Debe funcionar sin conexión.

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO:
- <!DOCTYPE html>, <html lang="es">, <meta charset>, <meta name="viewport"> y <title> descriptivo.
- Variables CSS en :root para colores, espaciado y tipografía; layout con CSS Grid/Flex; diseño responsivo (celular, tableta, proyector).
- HTML semántico (header, main, section, nav, button) con atributos aria y foco visible; navegable con teclado.
- JavaScript organizado: un objeto de estado, funciones pequeñas con nombres claros, render a partir del estado y eventos con addEventListener. Sin alert()/prompt(). Comprueba que cada elemento exista antes de usarlo.
- Animaciones y transiciones con CSS (@keyframes y transition): entrada de elementos, retroalimentación animada al acertar y al fallar, progreso que se llena y una celebración visual al completar (por ejemplo confeti en canvas o CSS). Respeta prefers-reduced-motion reduciendo el movimiento.

SONIDO (OBLIGATORIO):
- Genera los sonidos con la Web Audio API (AudioContext, osciladores y envolventes), sin archivos de audio externos: clic o avance, acierto, error, logro o final. El AudioContext se crea o reanuda tras el primer gesto del usuario.
- Incluye un botón visible para silenciar o activar el sonido, con el estado recordado durante la sesión. Los sonidos son breves y agradables, nunca estridentes.

ALINEACIÓN CON LA CLASE (OBLIGATORIO):
- Usa únicamente los conceptos, términos, ejemplos, datos y actividades que aparecen en el PLAN DE CLASE. No introduzcas temas ajenos.
- El recurso debe servir para dos cosas: que el docente lo proyecte para mostrar lo que está explicando en esos momentos de la clase y que los estudiantes lo usen para evidenciar que comprendieron el tema. Indica en pantalla a qué momento o idea del plan corresponde cada parte.

CALIDAD PEDAGÓGICA:
- Contenido real, preciso y completo del tema, adecuado al grado. Nada de relleno ni secciones vacías.
- Debe tener una función didáctica clara: el estudiante hace algo (decide, arrastra, ordena, simula, predice, construye) y recibe retroalimentación inmediata que explica el porqué.
- Incluye objetivo visible, progreso, un cierre con síntesis o resultado, y botón para reiniciar.
- Si el contexto pide trabajo en equipo, incluye roles, turnos, marcador compartido o una actividad cooperativa dentro del recurso.
- Texto grande (cuerpo mínimo 18px), alto contraste, interfaz pensada para proyectar.
- Sé original: evita la plantilla genérica de "tarjeta blanca con botones azules". La estética y la mecánica deben sentirse únicas para este tema.

Devuelve ÚNICAMENTE el código HTML completo, desde <!DOCTYPE html> hasta </html>, sin bloques markdown ni explicaciones.`;

/**
 * Genera un recurso HTML a medida.
 * @param {Object} opts
 * @param {Function} opts.callApi - función (apiKey, body) => Promise<string>
 * @param {string} opts.apiKey
 * @param {string} opts.brief - qué debe ser el recurso
 * @param {string} [opts.typeKey] - tipo de material (para elegir formatos de interacción)
 * @param {string} [opts.context] - texto con el plan o datos de la clase
 * @returns {Promise<string>} HTML validado
 */
export async function generateCreativeHtml({ callApi, apiKey, brief, typeKey = 'default', context = '' }) {
  const formats = INTERACTION_FORMATS[typeKey] || INTERACTION_FORMATS.default;
  const direction = pick(DESIGN_DIRECTIONS);
  const format = pick(formats);

  const basePrompt = `${SYSTEM_INSTRUCTION}

DIRECCIÓN VISUAL (úsala como punto de partida y reinterprétala para el tema): ${direction}
FORMATO DE INTERACCIÓN SUGERIDO (adáptalo si el tema pide algo mejor): ${format}

RECURSO A CREAR: ${brief}
${context ? `\nCONTEXTO DE LA CLASE:\n${context}\n` : ''}`;

  let lastProblems = [];
  let html = '';

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt = attempt === 0
      ? basePrompt
      : `${basePrompt}\n\nTU INTENTO ANTERIOR TUVO ESTOS PROBLEMAS, CORRÍGELOS Y ENTREGA EL ARCHIVO COMPLETO:\n- ${lastProblems.join('\n- ')}`;

    const text = await callApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1, maxOutputTokens: 32768 }
    });
    html = stripFences(text);
    lastProblems = validateGeneratedHtml(html);
    if (lastProblems.length === 0) return html;
  }

  throw new Error(`La IA no entregó un recurso válido (${lastProblems.slice(0, 2).join(' ')}). Intenta generarlo de nuevo.`);
}
