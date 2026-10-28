import { injectShareBarIntoHtml } from './universalShareBar.js';

/**
 * Generador autónomo de Diapositivas / OVA Interactivo en un único archivo HTML.
 * Genera una presentación interactiva moderna, responsiva, con modo pantalla completa,
 * atajos de teclado (Flechas, Espacio, F), notas para el docente y animaciones fluidas.
 */

export function buildPresentationHtml({
  title = 'Presentación de la Clase',
  subject = 'General',
  grade = '',
  slides = []
} = {}) {
  const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubject = subject.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeGrade = grade ? grade.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

  const defaultSlides = slides.length > 0 ? slides : [
    {
      title: safeTitle,
      subtitle: `${safeSubject} ${safeGrade ? `• Grado ${safeGrade}` : ''}`,
      content: ['Bienvenido a la sesión de aprendizaje', 'Explora los conceptos clave usando las flechas de navegación'],
      notes: 'Presentar el propósito y activar saberes previos del grupo.'
    },
    {
      title: 'Propósito de Aprendizaje',
      subtitle: '¿Qué aprenderemos hoy?',
      content: ['Comprender los principios fundamentales del tema.', 'Aplicar lo aprendido en retos prácticos y colaborativos.'],
      notes: 'Explicar con claridad el objetivo formativo a los estudiantes.'
    },
    {
      title: 'Desarrollo Conceptual',
      subtitle: 'Ideas clave',
      content: ['Conceptos estructurados y ejemplos prácticos.', 'Conexiones con situaciones reales de la vida cotidiana.'],
      notes: 'Fomentar la participación y preguntas de los alumnos.'
    },
    {
      title: 'Actividad Práctica',
      subtitle: 'Manos a la obra',
      content: ['Trabajo individual o en equipos.', 'Resolución de problemas guiada con mediación docente.'],
      notes: 'Acompañar a los estudiantes y resolver dudas frecuentes.'
    },
    {
      title: 'Cierre y Reflexión',
      subtitle: 'Metacognición',
      content: ['Puesta en común de conclusiones.', '¿Qué aprendimos y cómo lo aplicaremos?'],
      notes: 'Realizar evaluación formativa y sintetizar los logros alcanzados.'
    }
  ];

  const slidesJson = JSON.stringify(defaultSlides).replace(/</g, '\\u003c');

  const rawHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — Diapositivas Interactivas</title>
  <style>
    :root {
      --primary: #315B54;
      --primary-dark: #1E3B34;
      --primary-light: #477A72;
      --accent: #E8B931;
      --bg: #F4F7F6;
      --card-bg: #FFFFFF;
      --text-main: #142B25;
      --text-muted: #576864;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
    }
    header {
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(49, 91, 84, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .header-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-dark);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      background: rgba(49, 91, 84, 0.1);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .header-controls {
      display: flex;
      gap: 8px;
    }
    button.btn {
      background: #FFFFFF;
      color: var(--primary);
      border: 1px solid rgba(49, 91, 84, 0.25);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    button.btn:hover {
      background: rgba(49, 91, 84, 0.08);
      border-color: var(--primary);
    }
    button.btn-primary {
      background: var(--primary);
      color: #FFFFFF;
      border: none;
    }
    button.btn-primary:hover {
      background: var(--primary-dark);
    }
    main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px;
      position: relative;
    }
    .slide-card {
      width: 100%;
      max-width: 900px;
      min-height: 480px;
      background: var(--card-bg);
      border-radius: 24px;
      padding: 50px 60px;
      box-shadow: 0 16px 40px rgba(20, 43, 37, 0.08);
      border: 1px solid rgba(49, 91, 84, 0.12);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      animation: fadeIn 0.3s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-header {
      margin-bottom: 24px;
    }
    .slide-subtitle {
      color: var(--primary-light);
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .slide-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.25;
    }
    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 18px;
      line-height: 1.6;
      color: #2D3748;
    }
    .slide-body ul {
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .slide-body li {
      margin-bottom: 4px;
    }
    .slide-notes-box {
      margin-top: 24px;
      padding: 12px 18px;
      background: rgba(232, 185, 49, 0.12);
      border-left: 4px solid var(--accent);
      border-radius: 0 8px 8px 0;
      font-size: 13px;
      color: #744210;
      display: none;
    }
    .slide-notes-box.show {
      display: block;
    }
    footer {
      padding: 16px 28px;
      background: #FFFFFF;
      border-top: 1px solid rgba(49, 91, 84, 0.12);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .nav-buttons {
      display: flex;
      gap: 12px;
    }
    .progress-bar-container {
      flex: 1;
      max-width: 320px;
      margin: 0 24px;
      height: 6px;
      background: rgba(49, 91, 84, 0.12);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--primary);
      width: 0%;
      transition: width 0.25s ease;
    }
    .counter {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
    }
    @media (max-width: 640px) {
      .slide-card {
        padding: 30px 24px;
        min-height: 380px;
      }
      .slide-title {
        font-size: 24px;
      }
      .slide-body {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-title">
      <span>${safeTitle}</span>
      <span class="badge">${safeSubject}</span>
    </div>
    <div class="header-controls">
      <button class="btn" id="btnNotes">📝 Notas</button>
      <button class="btn" id="btnFullscreen">⛶ Pantalla completa</button>
    </div>
  </header>

  <main>
    <div class="slide-card" id="slideCard">
      <div class="slide-header">
        <div class="slide-subtitle" id="slideSubtitle"></div>
        <h2 class="slide-title" id="slideTitle"></h2>
      </div>
      <div class="slide-body" id="slideBody"></div>
      <div class="slide-notes-box" id="slideNotes"></div>
    </div>
  </main>

  <footer>
    <div class="counter" id="slideCounter">1 / 1</div>
    <div class="progress-bar-container">
      <div class="progress-bar-fill" id="progressFill"></div>
    </div>
    <div class="nav-buttons">
      <button class="btn" id="btnPrev">← Anterior</button>
      <button class="btn btn-primary" id="btnNext">Siguiente →</button>
    </div>
  </footer>

  <script>
    const slides = ${slidesJson};
    let currentIndex = 0;
    let showNotes = false;

    const elTitle = document.getElementById('slideTitle');
    const elSubtitle = document.getElementById('slideSubtitle');
    const elBody = document.getElementById('slideBody');
    const elNotes = document.getElementById('slideNotes');
    const elCounter = document.getElementById('slideCounter');
    const elProgress = document.getElementById('progressFill');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnNotes = document.getElementById('btnNotes');
    const btnFullscreen = document.getElementById('btnFullscreen');
    const slideCard = document.getElementById('slideCard');

    function renderSlide(index) {
      const slide = slides[index];
      if (!slide) return;

      slideCard.style.animation = 'none';
      void slideCard.offsetWidth;
      slideCard.style.animation = 'fadeIn 0.25s ease forwards';

      elTitle.textContent = slide.title || '';
      elSubtitle.textContent = slide.subtitle || '';

      if (Array.isArray(slide.content)) {
        elBody.innerHTML = '<ul>' + slide.content.map(c => '<li>' + c + '</li>').join('') + '</ul>';
      } else {
        elBody.innerHTML = '<p>' + (slide.content || '') + '</p>';
      }

      if (slide.notes) {
        elNotes.textContent = '💡 Nota docente: ' + slide.notes;
        elNotes.className = showNotes ? 'slide-notes-box show' : 'slide-notes-box';
      } else {
        elNotes.className = 'slide-notes-box';
      }

      elCounter.textContent = (index + 1) + ' / ' + slides.length;
      elProgress.style.width = (((index + 1) / slides.length) * 100) + '%';

      btnPrev.disabled = index === 0;
      btnNext.textContent = (index === slides.length - 1) ? 'Finalizar ✓' : 'Siguiente →';
    }

    btnPrev.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderSlide(currentIndex);
      }
    });

    btnNext.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        renderSlide(currentIndex);
      }
    });

    btnNotes.addEventListener('click', () => {
      showNotes = !showNotes;
      renderSlide(currentIndex);
    });

    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (currentIndex < slides.length - 1) {
          currentIndex++;
          renderSlide(currentIndex);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          currentIndex--;
          renderSlide(currentIndex);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        btnFullscreen.click();
      }
    });

    renderSlide(0);
  </script>
</body>
</html>`;

  return injectShareBarIntoHtml(rawHtml, { title: safeTitle, subject: safeSubject, grade: safeGrade });
}
