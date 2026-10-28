import { injectShareBarIntoHtml } from './universalShareBar.js';

/**
 * questionsGenerator.js
 * Generador de Cuestionarios y Bancos de Preguntas Formativas en HTML interactivo autónomo.
 * Permite a los estudiantes:
 * - Responder preguntas formativas a su propio ritmo (sin estrés de temporizador).
 * - Consultar "Pistas Pedagógicas DUA" antes de responder.
 * - Recibir retroalimentación inmediata con explicación detallada paso a paso.
 * - Visualizar su progreso formativo y reporte de desempeño con opciones de reintento.
 */

export function generateInteractiveQuestionsHTML({
  title = 'Banco de Preguntas Formativas',
  subject = 'General',
  grade = '',
  questions = []
} = {}) {
  const safeTitle = (title || 'Banco de Preguntas Formativas').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubject = (subject || 'General').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeGrade = (grade || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const defaultQuestions = questions.length > 0 ? questions : [
    {
      question: '¿Cuál es la principal ventaja de descomponer un problema en subproblemas más pequeños?',
      options: [
        'Permite abordar cada parte con mayor foco y reducir la sobrecarga cognitiva.',
        'Hace que el problema sea más largo e innecesariamente complejo.',
        'Evita tener que evaluar o comprobar las respuestas finales.',
        'Garantiza que no se requieran conceptos previos.'
      ],
      correctIndex: 0,
      hint: 'Piensa en cómo abordas un proyecto grande: dividirlo en fases facilita resolverlo paso a paso.',
      explanation: 'La descomposición es una habilidad de pensamiento de orden superior que reduce la complejidad y facilita el análisis sistemático.'
    },
    {
      question: '¿Qué distingue una evaluación formativa de una sumativa tradicional?',
      options: [
        'Su propósito es monitorear y enriquecer el aprendizaje continuo, no solo certificar una nota final.',
        'Es más estricta y solo se realiza al final del año lectivo.',
        'No permite la retroalimentación cualitativa del docente.',
        'Se aplica únicamente de manera individual y sin rúbrica.'
      ],
      correctIndex: 0,
      hint: 'Recuerda que "formativa" proviene de "formar" durante el proceso de aprendizaje.',
      explanation: 'La evaluación formativa proporciona información oportuna tanto al docente como al estudiante para ajustar estrategias y superar dificultades.'
    },
    {
      question: 'Al diseñar actividades bajo el marco DUA, ¿qué principio asegura que todos los estudiantes puedan demostrar lo que saben?',
      options: [
        'Proveer múltiples formas de acción y expresión.',
        'Exigir que todos entreguen exactamente el mismo tipo de examen escrito.',
        'Omitir los apoyos visuales para estandarizar el proceso.',
        'Reducir los objetivos de aprendizaje para los estudiantes con ritmos diversos.'
      ],
      correctIndex: 0,
      hint: 'Considera cómo un estudiante puede comunicar sus ideas a través de texto, audio, organizadores gráficos o maquetas.',
      explanation: 'El principio de múltiples medios de acción y expresión permite a los estudiantes comunicar su comprensión utilizando los canales que mejor potencien sus capacidades.'
    }
  ];

  const questionsJson = JSON.stringify(defaultQuestions).replace(/</g, '\\u003c');

  const rawHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - INSPIRATEC</title>
  <style>
    :root {
      --primary: #183630;
      --primary-light: #315B54;
      --accent: #D97706;
      --success: #10B981;
      --error: #EF4444;
      --bg: #F4F7F6;
      --card-bg: #FFFFFF;
      --text: #142B25;
      --text-muted: #4B635D;
      --border: rgba(49, 91, 84, 0.18);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 24px 16px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .quiz-container {
      width: 100%;
      max-width: 780px;
      background: var(--card-bg);
      border-radius: 20px;
      padding: 32px 28px;
      box-shadow: 0 10px 30px rgba(20, 43, 37, 0.08);
      border: 1px solid var(--border);
    }
    .quiz-header {
      border-bottom: 2px solid rgba(49, 91, 84, 0.1);
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .quiz-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(49, 91, 84, 0.12);
      color: var(--primary);
      margin-bottom: 6px;
    }
    .quiz-title {
      font-size: 22px;
      font-weight: 800;
      color: var(--primary);
      line-height: 1.3;
    }
    .quiz-meta {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: rgba(49, 91, 84, 0.12);
      border-radius: 4px;
      margin-bottom: 24px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #183630, #315B54);
      width: 0%;
      transition: width 0.3s ease;
    }
    .question-card {
      margin-bottom: 24px;
    }
    .question-number {
      font-size: 12px;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .question-text {
      font-size: 17px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.45;
      margin-bottom: 18px;
    }
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 18px;
    }
    .option-btn {
      width: 100%;
      text-align: left;
      padding: 14px 18px;
      font-size: 14.5px;
      border-radius: 12px;
      border: 1.5px solid var(--border);
      background: #FFFFFF;
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.15s ease;
      line-height: 1.4;
    }
    .option-btn:hover:not(:disabled) {
      border-color: var(--primary-light);
      background: rgba(49, 91, 84, 0.04);
      transform: translateY(-1px);
    }
    .option-letter {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(49, 91, 84, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      color: var(--primary);
      flex-shrink: 0;
    }
    .option-btn.correct {
      border-color: var(--success);
      background: rgba(16, 185, 129, 0.12);
      color: #065F46;
      font-weight: 600;
    }
    .option-btn.correct .option-letter {
      background: var(--success);
      color: #FFFFFF;
    }
    .option-btn.wrong {
      border-color: var(--error);
      background: rgba(239, 68, 68, 0.12);
      color: #991B1B;
    }
    .option-btn.wrong .option-letter {
      background: var(--error);
      color: #FFFFFF;
    }
    .hint-container {
      margin-bottom: 16px;
    }
    .hint-toggle-btn {
      background: none;
      border: 1px dashed var(--accent);
      color: var(--accent);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .hint-toggle-btn:hover {
      background: rgba(217, 119, 6, 0.1);
    }
    .hint-box {
      margin-top: 8px;
      padding: 12px 16px;
      border-radius: 10px;
      background: #FFFBEB;
      border-left: 4px solid var(--accent);
      font-size: 13px;
      color: #92400E;
      display: none;
    }
    .feedback-box {
      margin-top: 14px;
      padding: 14px 18px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.5;
      display: none;
    }
    .feedback-box.correct {
      display: block;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      color: #065F46;
    }
    .feedback-box.wrong {
      display: block;
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #991B1B;
    }
    .nav-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .btn {
      padding: 10px 20px;
      font-size: 13.5px;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background: var(--primary);
      color: #FFFFFF;
    }
    .btn-primary:hover:not(:disabled) {
      background: var(--primary-light);
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: rgba(49, 91, 84, 0.12);
      color: var(--primary);
    }
    .results-screen {
      display: none;
      text-align: center;
      padding: 20px 0;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #183630, #315B54);
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
      box-shadow: 0 10px 24px rgba(24, 54, 48, 0.2);
    }
    .score-num { font-size: 36px; font-weight: 800; line-height: 1; }
    .score-total { font-size: 13px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="quiz-container">
    <div class="quiz-header">
      <div>
        <span class="quiz-badge">Banco de Preguntas Formativas</span>
        <h1 class="quiz-title">${safeTitle}</h1>
        <div class="quiz-meta">${safeSubject}${safeGrade ? ' · Grado ' + safeGrade : ''}</div>
      </div>
      <div id="counter" style="font-size: 13px; font-weight: 700; color: var(--primary-light);">1 / 3</div>
    </div>

    <div class="progress-bar-container">
      <div id="progressFill" class="progress-bar-fill"></div>
    </div>

    <div id="quizScreen">
      <div class="question-card">
        <div id="qNumber" class="question-number">Pregunta 1</div>
        <div id="qText" class="question-text"></div>

        <div class="hint-container">
          <button type="button" class="hint-toggle-btn" onclick="toggleHint()">
            💡 Pista Pedagógica DUA
          </button>
          <div id="hintBox" class="hint-box"></div>
        </div>

        <div id="optionsList" class="options-list"></div>

        <div id="feedbackBox" class="feedback-box"></div>
      </div>

      <div class="nav-buttons">
        <button id="prevBtn" type="button" class="btn btn-secondary" onclick="prevQuestion()" disabled>Anterior</button>
        <button id="nextBtn" type="button" class="btn btn-primary" onclick="nextQuestion()" disabled>Siguiente Pregunta</button>
      </div>
    </div>

    <div id="resultsScreen" class="results-screen">
      <div class="score-circle">
        <div id="finalScore" class="score-num">0</div>
        <div id="finalTotal" class="score-total">de 3 correctas</div>
      </div>
      <h2 style="font-size: 22px; color: var(--primary); margin-bottom: 8px;">¡Comprobación Formativa Completada!</h2>
      <p id="finalFeedback" style="font-size: 14.5px; color: var(--text-muted); max-width: 500px; margin: 0 auto 24px auto;">
        Has completado el banco de preguntas formativas.
      </p>
      <button type="button" class="btn btn-primary" onclick="restartQuiz()">Reiniciar Cuestionario</button>
    </div>
  </div>

  <script>
    const questions = ${questionsJson};
    let currentIndex = 0;
    const userAnswers = new Array(questions.length).fill(null);

    function updateQuestion() {
      const q = questions[currentIndex];
      document.getElementById('counter').innerText = (currentIndex + 1) + ' / ' + questions.length;
      document.getElementById('qNumber').innerText = 'Pregunta ' + (currentIndex + 1) + ' de ' + questions.length;
      document.getElementById('qText').innerText = q.question;

      const hintBox = document.getElementById('hintBox');
      hintBox.style.display = 'none';
      hintBox.innerText = q.hint || 'Lee con atención las opciones y reflexiona sobre el objetivo de la clase.';

      const pct = ((currentIndex + 1) / questions.length) * 100;
      document.getElementById('progressFill').style.width = pct + '%';

      const letters = ['A', 'B', 'C', 'D', 'E'];
      const optionsContainer = document.getElementById('optionsList');
      optionsContainer.innerHTML = '';

      const isAnswered = userAnswers[currentIndex] !== null;
      const feedbackBox = document.getElementById('feedbackBox');

      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.innerHTML = '<span class=\"option-letter\">' + letters[idx] + '</span><span>' + opt + '</span>';

        if (isAnswered) {
          btn.disabled = true;
          if (idx === q.correctIndex) btn.classList.add('correct');
          if (userAnswers[currentIndex] === idx && idx !== q.correctIndex) btn.classList.add('wrong');
        } else {
          btn.onclick = () => selectOption(idx);
        }

        optionsContainer.appendChild(btn);
      });

      if (isAnswered) {
        const wasCorrect = userAnswers[currentIndex] === q.correctIndex;
        feedbackBox.className = 'feedback-box ' + (wasCorrect ? 'correct' : 'wrong');
        feedbackBox.innerHTML = '<strong>' + (wasCorrect ? '✓ ¡Excelente razonamiento!' : '✕ Oportunidad de aprendizaje:') + '</strong> ' + (q.explanation || q.feedback || '');
        feedbackBox.style.display = 'block';
        document.getElementById('nextBtn').disabled = false;
      } else {
        feedbackBox.style.display = 'none';
        document.getElementById('nextBtn').disabled = true;
      }

      document.getElementById('prevBtn').disabled = currentIndex === 0;
      if (currentIndex === questions.length - 1) {
        document.getElementById('nextBtn').innerText = isAnswered ? 'Ver Resultados' : 'Finalizar';
      } else {
        document.getElementById('nextBtn').innerText = 'Siguiente Pregunta';
      }
    }

    function toggleHint() {
      const box = document.getElementById('hintBox');
      box.style.display = box.style.display === 'block' ? 'none' : 'block';
    }

    function selectOption(idx) {
      userAnswers[currentIndex] = idx;
      updateQuestion();
    }

    function prevQuestion() {
      if (currentIndex > 0) {
        currentIndex--;
        updateQuestion();
      }
    }

    function nextQuestion() {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        updateQuestion();
      } else {
        showResults();
      }
    }

    function showResults() {
      document.getElementById('quizScreen').style.display = 'none';
      const resultsScreen = document.getElementById('resultsScreen');
      resultsScreen.style.display = 'block';

      let correctCount = 0;
      questions.forEach((q, i) => {
        if (userAnswers[i] === q.correctIndex) correctCount++;
      });

      document.getElementById('finalScore').innerText = correctCount;
      document.getElementById('finalTotal').innerText = 'de ' + questions.length + ' correctas';

      const pct = (correctCount / questions.length) * 100;
      let msg = '';
      if (pct >= 80) {
        msg = '¡Dominio conceptual sobresaliente! Demuestras una comprensión sólida de los estándares y conceptos abordados.';
      } else if (pct >= 60) {
        msg = '¡Buen desempeño! Se observa apropiación de las ideas clave, con algunos aspectos puntuales por afianzar.';
      } else {
        msg = 'Continúa fortaleciendo los conceptos. Te recomendamos repasar los momentos de la clase y volver a intentar el cuestionario.';
      }
      document.getElementById('finalFeedback').innerText = msg;
    }

    function restartQuiz() {
      userAnswers.fill(null);
      currentIndex = 0;
      document.getElementById('resultsScreen').style.display = 'none';
      document.getElementById('quizScreen').style.display = 'block';
      updateQuestion();
    }

    // Iniciar en la primera pregunta
    updateQuestion();
  </script>
</body>
</html>`;

  return injectShareBarIntoHtml(rawHtml, {
    title: safeTitle,
    type: 'Cuestionario / Banco de Preguntas Formativas',
    subject: safeSubject
  });
}
