import { injectShareBarIntoHtml } from './universalShareBar.js';

/**
 * Generador de Trivia / Cuestionario Gamificado interactivo en un único archivo HTML.
 * Incluye temporizador, efectos de sonido sintetizados mediante Web Audio API (sin archivos externos),
 * barra de progreso animada, feedback pedagógico inmediato y resumen final de puntuación.
 */

export function generateGamifiedQuizHTML({
  title = 'Trivia Interactiva de la Clase',
  subject = 'General',
  questions = []
} = {}) {
  const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubject = subject.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const defaultQuestions = questions.length > 0 ? questions : [
    {
      question: '¿Cuál es el primer paso recomendado para resolver un problema complejo?',
      options: [
        'Descomponer el problema en partes más simples y manejables',
        'Escribir código de inmediato sin planear',
        'Omitir los datos iniciales y adivinar la respuesta',
        'Pedir que alguien más lo resuelva'
      ],
      correctIndex: 0,
      feedback: '¡Exacto! La descomposición es uno de los pilares del pensamiento computacional y la resolución de problemas.'
    },
    {
      question: '¿Qué función cumple una retroalimentación formativa oportuna?',
      options: [
        'Asignar una etiqueta inmutable al estudiante',
        'Guiar al aprendiz para identificar fortalezas y rutas de mejora',
        'Calificar numéricamente sin explicaciones',
        'Terminar la sesión sin comprobación'
      ],
      correctIndex: 1,
      feedback: '¡Correcto! La retroalimentación formativa brinda andamiajes para consolidar el aprendizaje continuo.'
    },
    {
      question: '¿Cómo se asegura la accesibilidad mediante el marco DUA en el aula?',
      options: [
        'Ofreciendo múltiples formas de representación, expresión y motivación',
        'Aplicando una única evaluación escrita idéntica para todos',
        'Evitando el uso de recursos visuales y auditivos',
        'Separando a los estudiantes con ritmos diferentes'
      ],
      correctIndex: 0,
      feedback: '¡Excelente! El Diseño Universal para el Aprendizaje elimina barreras ofreciendo múltiples opciones pedagógicas.'
    }
  ];

  const questionsJson = JSON.stringify(defaultQuestions).replace(/</g, '\\u003c');

  const rawHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — Trivia Gamificada</title>
  <style>
    :root {
      --primary: #315B54;
      --primary-dark: #1E3B34;
      --accent: #E8B931;
      --success: #16A34A;
      --error: #DC2626;
      --bg: #F4F7F6;
      --card-bg: #FFFFFF;
      --text: #142B25;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .quiz-container {
      width: 100%;
      max-width: 680px;
      background: var(--card-bg);
      border-radius: 24px;
      padding: 36px 40px;
      box-shadow: 0 16px 40px rgba(20, 43, 37, 0.08);
      border: 1px solid rgba(49, 91, 84, 0.15);
      position: relative;
    }
    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .quiz-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--primary-dark);
    }
    .badge {
      background: rgba(49, 91, 84, 0.1);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
    }
    .timer-bar-wrap {
      width: 100%;
      height: 8px;
      background: rgba(49, 91, 84, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .timer-bar {
      height: 100%;
      background: var(--primary);
      width: 100%;
      transition: width 1s linear;
    }
    .question-box {
      margin-bottom: 24px;
    }
    .question-count {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .question-text {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.4;
      color: var(--text);
    }
    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .option-btn {
      width: 100%;
      text-align: left;
      padding: 14px 20px;
      background: #FFFFFF;
      border: 2px solid rgba(49, 91, 84, 0.2);
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .option-btn:hover:not(:disabled) {
      background: rgba(49, 91, 84, 0.06);
      border-color: var(--primary);
      transform: translateY(-1px);
    }
    .option-btn.correct {
      background: rgba(22, 163, 74, 0.12) !important;
      border-color: var(--success) !important;
      color: var(--success) !important;
    }
    .option-btn.wrong {
      background: rgba(220, 38, 38, 0.12) !important;
      border-color: var(--error) !important;
      color: var(--error) !important;
    }
    .feedback-box {
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
      display: none;
    }
    .feedback-box.correct {
      display: block;
      background: rgba(22, 163, 74, 0.1);
      border-left: 4px solid var(--success);
      color: #166534;
    }
    .feedback-box.wrong {
      display: block;
      background: rgba(220, 38, 38, 0.1);
      border-left: 4px solid var(--error);
      color: #991B1B;
    }
    .btn-next {
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: none;
      margin-left: auto;
      transition: background 0.2s ease;
    }
    .btn-next:hover {
      background: var(--primary-dark);
    }
    .btn-next.show {
      display: block;
    }
    .results-screen {
      display: none;
      text-align: center;
      padding: 20px 0;
    }
    .results-screen.show {
      display: block;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(49, 91, 84, 0.12);
      border: 4px solid var(--primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
    }
    .score-num {
      font-size: 36px;
      font-weight: 900;
      color: var(--primary);
    }
    .score-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary-dark);
    }
    .btn-restart {
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      padding: 12px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <div id="gameScreen">
      <div class="quiz-header">
        <span class="quiz-title">${safeTitle}</span>
        <span class="badge" id="timerBadge">⏱️ 30s</span>
      </div>
      <div class="timer-bar-wrap">
        <div class="timer-bar" id="timerBar"></div>
      </div>
      <div class="question-box">
        <div class="question-count" id="qCount">Pregunta 1 de 3</div>
        <h2 class="question-text" id="qText"></h2>
      </div>
      <div class="options-grid" id="optionsGrid"></div>
      <div class="feedback-box" id="feedbackBox"></div>
      <button class="btn-next" id="btnNextQ">Siguiente Pregunta →</button>
    </div>

    <div class="results-screen" id="resultsScreen">
      <h2 style="font-size: 26px; font-weight: 800; color: var(--primary-dark); margin-bottom: 8px;">¡Cuestionario Completado!</h2>
      <p style="color: #576864; font-size: 15px; margin-bottom: 24px;">Has terminado la sesión gamificada.</p>
      <div class="score-circle">
        <span class="score-num" id="finalScore">0</span>
        <span class="score-label" id="finalMax">de 3</span>
      </div>
      <p id="resultMsg" style="font-size: 16px; font-weight: 600; color: var(--text);"></p>
      <button class="btn-restart" id="btnRestart">🔄 Jugar de nuevo</button>
    </div>
  </div>

  <script>
    const questions = ${questionsJson};
    let currentQ = 0;
    let score = 0;
    let timeLeft = 30;
    let timerInterval = null;
    let audioCtx = null;

    function playSound(type) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (type === 'correct') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.1);
          osc.frequency.setValueAtTime(783.99, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === 'wrong') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(164.81, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'finish') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554.37, now + 0.15);
          osc.frequency.setValueAtTime(659.25, now + 0.3);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
        }
      } catch (e) {}
    }

    const qCount = document.getElementById('qCount');
    const qText = document.getElementById('qText');
    const optionsGrid = document.getElementById('optionsGrid');
    const feedbackBox = document.getElementById('feedbackBox');
    const btnNextQ = document.getElementById('btnNextQ');
    const timerBadge = document.getElementById('timerBadge');
    const timerBar = document.getElementById('timerBar');
    const gameScreen = document.getElementById('gameScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    const finalScore = document.getElementById('finalScore');
    const finalMax = document.getElementById('finalMax');
    const resultMsg = document.getElementById('resultMsg');
    const btnRestart = document.getElementById('btnRestart');

    function startTimer() {
      clearInterval(timerInterval);
      timeLeft = 30;
      timerBadge.textContent = '⏱️ 30s';
      timerBar.style.width = '100%';

      timerInterval = setInterval(() => {
        timeLeft--;
        timerBadge.textContent = '⏱️ ' + timeLeft + 's';
        timerBar.style.width = ((timeLeft / 30) * 100) + '%';

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleTimeOut();
        }
      }, 1000);
    }

    function renderQuestion(idx) {
      const q = questions[idx];
      qCount.textContent = 'Pregunta ' + (idx + 1) + ' de ' + questions.length;
      qText.textContent = q.question;
      optionsGrid.innerHTML = '';
      feedbackBox.className = 'feedback-box';
      feedbackBox.style.display = 'none';
      btnNextQ.className = 'btn-next';

      q.options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = '<span style="opacity:0.6; font-size:13px; font-weight:700;">' + String.fromCharCode(65 + optIdx) + '.</span> <span>' + opt + '</span>';
        btn.addEventListener('click', () => selectAnswer(optIdx));
        optionsGrid.appendChild(btn);
      });

      startTimer();
    }

    function selectAnswer(selectedIdx) {
      clearInterval(timerInterval);
      const q = questions[currentQ];
      const buttons = optionsGrid.querySelectorAll('.option-btn');
      buttons.forEach(b => b.disabled = true);

      if (selectedIdx === q.correctIndex) {
        score++;
        buttons[selectedIdx].classList.add('correct');
        feedbackBox.textContent = '✓ ' + (q.feedback || '¡Respuesta correcta!');
        feedbackBox.className = 'feedback-box correct';
        playSound('correct');
      } else {
        buttons[selectedIdx].classList.add('wrong');
        buttons[q.correctIndex].classList.add('correct');
        feedbackBox.textContent = '✗ ' + (q.feedback || 'Respuesta incorrecta.');
        feedbackBox.className = 'feedback-box wrong';
        playSound('wrong');
      }

      btnNextQ.className = 'btn-next show';
      btnNextQ.textContent = (currentQ === questions.length - 1) ? 'Ver Resultados Finales' : 'Siguiente Pregunta →';
    }

    function handleTimeOut() {
      const q = questions[currentQ];
      const buttons = optionsGrid.querySelectorAll('.option-btn');
      buttons.forEach(b => b.disabled = true);
      buttons[q.correctIndex].classList.add('correct');
      feedbackBox.textContent = '⏳ ¡Tiempo agotado! ' + (q.feedback || '');
      feedbackBox.className = 'feedback-box wrong';
      playSound('wrong');
      btnNextQ.className = 'btn-next show';
    }

    btnNextQ.addEventListener('click', () => {
      if (currentQ < questions.length - 1) {
        currentQ++;
        renderQuestion(currentQ);
      } else {
        showResults();
      }
    });

    function showResults() {
      clearInterval(timerInterval);
      gameScreen.style.display = 'none';
      resultsScreen.className = 'results-screen show';
      finalScore.textContent = score;
      finalMax.textContent = 'de ' + questions.length;
      playSound('finish');

      const pct = (score / questions.length) * 100;
      if (pct >= 80) {
        resultMsg.textContent = '🏆 ¡Excelente dominio conceptual! Has superado el reto con distinción.';
      } else if (pct >= 50) {
        resultMsg.textContent = '👍 ¡Buen trabajo! Tienes bases sólidas; revisa los conceptos clave para afianzar.';
      } else {
        resultMsg.textContent = '📚 Buen intento. Te recomendamos repasar los temas de la sesión y volver a probar.';
      }
    }

    btnRestart.addEventListener('click', () => {
      currentQ = 0;
      score = 0;
      resultsScreen.className = 'results-screen';
      gameScreen.style.display = 'block';
      renderQuestion(0);
    });

    renderQuestion(0);
  </script>
</body>
</html>`;

  return injectShareBarIntoHtml(rawHtml, { title: safeTitle, subject: safeSubject });
}
