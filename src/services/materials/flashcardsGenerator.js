import { injectShareBarIntoHtml } from './universalShareBar.js';

/**
 * flashcardsGenerator.js
 * Generador interactivo de Flashcards 3D en un único archivo HTML.
 * Incluye volteo interactivo de tarjetas (CSS 3D Transforms), navegación secuencial,
 * atajos de teclado (Espacio/Enter para girar, Flechas para navegar), y contador de dominio.
 */

export function generateInteractiveFlashcardsHTML({
  title = 'Flashcards Interactivas de Vocabulario',
  subject = 'General',
  grade = '',
  cards = []
} = {}) {
  const safeTitle = (title || 'Flashcards de Repaso').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubject = (subject || 'General').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const defaultCards = (cards && cards.length > 0 ? cards : [
    {
      front: 'Pensamiento Computacional',
      back: 'Proceso mental que permite formular problemas y sus soluciones de modo que puedan ser ejecutadas por un agente procesador de información.',
      category: 'Concepto Clave'
    },
    {
      front: 'Descomposición',
      back: 'Habilidad de dividir un problema complejo en subproblemas más pequeños y fáciles de entender y resolver.',
      category: 'Pilar Metodológico'
    },
    {
      front: 'Abstracción',
      back: 'Filtrar y seleccionar la información esencial ignorando detalles irrelevantes para crear un modelo aplicable.',
      category: 'Pilar Metodológico'
    },
    {
      front: 'Algoritmo',
      back: 'Conjunto secuencial, ordenado y finito de instrucciones claras para realizar una tarea o calcular un resultado.',
      category: 'Estructura Fundamental'
    },
    {
      front: 'Diseño Universal para el Aprendizaje (DUA)',
      back: 'Marco pedagógico que ofrece múltiples formas de representación, acción/expresión y motivación para eliminar barreras en el aula.',
      category: 'Inclusión Educativa'
    }
  ]);

  const cardsJson = JSON.stringify(defaultCards).replace(/</g, '\\u003c');

  const rawHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — Flashcards 3D</title>
  <style>
    :root {
      --primary: #142B25;
      --primary-sage: #315B54;
      --gold: #D4AF37;
      --bg: #F4F7F6;
      --card-bg: #FFFFFF;
      --text: #142B25;
      --text-muted: #576864;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
    .flashcards-app { width: 100%; max-width: 720px; padding: 24px; display: flex; flex-direction: column; align-items: center; }
    .fc-header { text-align: center; margin-bottom: 24px; }
    .fc-header h1 { font-size: 24px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
    .fc-header p { font-size: 14px; color: var(--text-muted); }

    .card-scene {
      width: 100%; height: 380px; perspective: 1000px; cursor: pointer; margin-bottom: 24px;
    }
    .card-object {
      width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 24px; box-shadow: 0 16px 40px rgba(20, 43, 37, 0.1);
    }
    .card-object.is-flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
      border-radius: 24px; padding: 36px 40px; display: flex; flex-direction: column;
      justify-content: space-between; border: 1.5px solid rgba(49, 91, 84, 0.2);
    }
    .card-face-front {
      background: #FFFFFF; color: var(--primary);
    }
    .card-face-back {
      background: linear-gradient(145deg, #1A3830, #142B25); color: #FFFFFF;
      transform: rotateY(180deg); border-color: var(--gold);
    }
    .fc-tag {
      align-self: flex-start; font-size: 11.5px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.05em; padding: 4px 10px; border-radius: 8px;
    }
    .card-face-front .fc-tag { background: rgba(49, 91, 84, 0.1); color: var(--primary-sage); }
    .card-face-back .fc-tag { background: rgba(212, 175, 55, 0.2); color: #FACC15; }
    .fc-content {
      font-size: 24px; font-weight: 700; text-align: center; line-height: 1.4; margin: auto 0;
    }
    .card-face-back .fc-content {
      font-size: 18px; font-weight: 500; color: #E5E7EB; text-align: center; line-height: 1.6;
    }
    .fc-hint {
      text-align: center; font-size: 12.5px; color: var(--text-muted);
    }
    .card-face-back .fc-hint { color: #A7F3D0; }

    .fc-controls {
      display: flex; gap: 14px; align-items: center; justify-content: center; width: 100%;
    }
    .fc-btn {
      background: #FFFFFF; color: var(--primary-sage); border: 1.5px solid var(--primary-sage);
      padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer;
      transition: all 0.18s ease; display: inline-flex; align-items: center; gap: 6px;
    }
    .fc-btn:hover { background: var(--primary-sage); color: #FFFFFF; }
    .fc-btn-primary { background: var(--primary); color: #FFFFFF; border-color: var(--primary); }
    .fc-btn-primary:hover { background: #1E3B34; }
    .fc-counter { font-size: 14px; font-weight: 700; color: var(--primary); min-width: 80px; text-align: center; }
  </style>
</head>
<body>
  <div class="flashcards-app">
    <div class="fc-header">
      <h1>${safeTitle}</h1>
      <p>Haz clic sobre la tarjeta o presiona la barra espaciadora para girarla.</p>
    </div>

    <div class="card-scene" id="cardScene">
      <div class="card-object" id="cardObject">
        <div class="card-face card-face-front">
          <span class="fc-tag" id="tagFront">Concepto</span>
          <div class="fc-content" id="textFront">Término</div>
          <div class="fc-hint">💡 Clic para ver definición en el reverso ↻</div>
        </div>
        <div class="card-face card-face-back">
          <span class="fc-tag" id="tagBack">Definición</span>
          <div class="fc-content" id="textBack">Explicación detallada</div>
          <div class="fc-hint">✓ Clic para volver al término</div>
        </div>
      </div>
    </div>

    <div class="fc-controls">
      <button type="button" class="fc-btn" id="btnPrev">← Anterior</button>
      <button type="button" class="fc-btn fc-btn-primary" id="btnFlip">↻ Girar Tarjeta</button>
      <button type="button" class="fc-btn" id="btnNext">Siguiente →</button>
    </div>
    <div style="margin-top: 14px;">
      <span class="fc-counter" id="counter">1 / 5</span>
    </div>
  </div>

  <script>
    (function() {
      var cards = ${cardsJson};
      var currentIndex = 0;
      var cardObject = document.getElementById('cardObject');
      var cardScene = document.getElementById('cardScene');
      var tagFront = document.getElementById('tagFront');
      var textFront = document.getElementById('textFront');
      var tagBack = document.getElementById('tagBack');
      var textBack = document.getElementById('textBack');
      var btnPrev = document.getElementById('btnPrev');
      var btnNext = document.getElementById('btnNext');
      var btnFlip = document.getElementById('btnFlip');
      var counter = document.getElementById('counter');

      function renderCard(idx) {
        cardObject.classList.remove('is-flipped');
        var c = cards[idx] || { front: 'Sin contenido', back: 'Sin definición' };
        tagFront.textContent = c.category || 'Concepto';
        tagBack.textContent = c.category || 'Definición';
        textFront.textContent = c.front;
        textBack.textContent = c.back;
        counter.textContent = (idx + 1) + ' / ' + cards.length;
      }

      function flipCard() {
        cardObject.classList.toggle('is-flipped');
      }

      cardScene.addEventListener('click', flipCard);
      btnFlip.addEventListener('click', function(e) {
        e.stopPropagation();
        flipCard();
      });

      btnPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentIndex > 0) {
          currentIndex--;
          renderCard(currentIndex);
        } else {
          currentIndex = cards.length - 1;
          renderCard(currentIndex);
        }
      });

      btnNext.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentIndex < cards.length - 1) {
          currentIndex++;
          renderCard(currentIndex);
        } else {
          currentIndex = 0;
          renderCard(currentIndex);
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          flipCard();
        } else if (e.code === 'ArrowRight') {
          btnNext.click();
        } else if (e.code === 'ArrowLeft') {
          btnPrev.click();
        }
      });

      renderCard(0);
    })();
  </script>
</body>
</html>`;

  return injectShareBarIntoHtml(rawHtml, { title: safeTitle, subject: safeSubject, grade });
}
