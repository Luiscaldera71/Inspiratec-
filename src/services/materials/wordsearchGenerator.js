import { injectShareBarIntoHtml } from './universalShareBar.js';

/**
 * Generador de Sopa de Letras Interactiva en un único archivo HTML.
 * Genera una cuadrícula dinámica jugable en pantalla con selección táctil/ratón,
 * lista de palabras a encontrar con tachado automático, temporizador y modo imprimible.
 */

export function generateWordsearchHTML({
  title = 'Sopa de Letras Didáctica',
  subject = 'General',
  words = []
} = {}) {
  const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubject = subject.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const defaultWords = (words && words.length > 0 ? words : [
    'ALGORITMO',
    'DATOS',
    'SISTEMA',
    'VARIABLE',
    'LOGICA',
    'CODIGO',
    'COMPUTADOR',
    'REDES'
  ]).map(w => w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, "")).filter(w => w.length >= 3);

  const wordsJson = JSON.stringify(defaultWords);

  const rawHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — Sopa de Letras</title>
  <style>
    :root {
      --primary: #315B54;
      --primary-dark: #1E3B34;
      --accent: #E8B931;
      --success: #16A34A;
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
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .header-bar {
      width: 100%;
      max-width: 900px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .main-title {
      font-size: 24px;
      font-weight: 800;
      color: var(--primary-dark);
    }
    .btn {
      background: #FFFFFF;
      color: var(--primary);
      border: 1.5px solid var(--primary);
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn:hover {
      background: var(--primary);
      color: #FFFFFF;
    }
    .game-layout {
      width: 100%;
      max-width: 900px;
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 28px;
    }
    .grid-card {
      background: var(--card-bg);
      padding: 24px;
      border-radius: 20px;
      box-shadow: 0 12px 32px rgba(20, 43, 37, 0.08);
      border: 1px solid rgba(49, 91, 84, 0.15);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .word-grid {
      display: grid;
      grid-template-columns: repeat(12, 34px);
      grid-template-rows: repeat(12, 34px);
      gap: 4px;
      user-select: none;
      touch-action: none;
    }
    .cell {
      width: 34px;
      height: 34px;
      background: #FAFCFB;
      border: 1px solid rgba(49, 91, 84, 0.15);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      color: #142B25;
      cursor: pointer;
      transition: background 0.1s ease;
    }
    .cell:hover {
      background: rgba(49, 91, 84, 0.12);
    }
    .cell.selected {
      background: rgba(232, 185, 49, 0.4);
      border-color: var(--accent);
      color: #1E3B34;
    }
    .cell.found {
      background: rgba(22, 163, 74, 0.25) !important;
      border-color: var(--success) !important;
      color: var(--success) !important;
    }
    .words-card {
      background: var(--card-bg);
      padding: 24px;
      border-radius: 20px;
      box-shadow: 0 12px 32px rgba(20, 43, 37, 0.08);
      border: 1px solid rgba(49, 91, 84, 0.15);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .words-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-dark);
      border-bottom: 1px solid rgba(49, 91, 84, 0.12);
      padding-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    .word-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .word-item {
      padding: 8px 12px;
      background: #F4F7F6;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #2D3748;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
    }
    .word-item.found {
      background: rgba(22, 163, 74, 0.15);
      color: var(--success);
      text-decoration: line-through;
    }
    .victory-box {
      margin-top: 16px;
      padding: 14px;
      background: rgba(22, 163, 74, 0.12);
      border: 1px solid var(--success);
      border-radius: 12px;
      text-align: center;
      color: #166534;
      font-weight: 700;
      font-size: 14px;
      display: none;
    }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .header-bar button { display: none; }
      .grid-card, .words-card { box-shadow: none; border: 1px solid #000; }
    }
    @media (max-width: 768px) {
      .game-layout {
        grid-template-columns: 1fr;
      }
      .word-grid {
        grid-template-columns: repeat(12, 28px);
        grid-template-rows: repeat(12, 28px);
      }
      .cell {
        width: 28px;
        height: 28px;
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <h1 class="main-title">${safeTitle}</h1>
      <span style="font-size: 13px; color: #576864;">Área: ${safeSubject}</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn" onclick="window.print()">🖨️ Imprimir</button>
      <button class="btn" id="btnRestart">🔄 Reiniciar</button>
    </div>
  </div>

  <div class="game-layout">
    <div class="grid-card">
      <div class="word-grid" id="wordGrid"></div>
    </div>

    <div class="words-card">
      <div class="words-title">
        <span>Palabras a buscar</span>
        <span id="wordsProgress">0 / 0</span>
      </div>
      <ul class="word-list" id="wordList"></ul>
      <div class="victory-box" id="victoryBox">
        🎉 ¡Felicitaciones! Has encontrado todas las palabras.
      </div>
    </div>
  </div>

  <script>
    const WORDS = ${wordsJson};
    const GRID_SIZE = 12;
    let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    let foundWords = new Set();
    let selectedCells = [];
    let isMouseDown = false;

    const elGrid = document.getElementById('wordGrid');
    const elList = document.getElementById('wordList');
    const elProgress = document.getElementById('wordsProgress');
    const elVictory = document.getElementById('victoryBox');

    function initGame() {
      foundWords.clear();
      selectedCells = [];
      grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
      elVictory.style.display = 'none';

      // 1. Colocar palabras en la grilla (horizontal, vertical, diagonal)
      const directions = [
        [0, 1],   // horizontal derecha
        [1, 0],   // vertical abajo
        [1, 1],   // diagonal abajo-derecha
        [0, -1],  // horizontal izquierda
        [-1, 0]   // vertical arriba
      ];

      WORDS.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
          attempts++;
          const dir = directions[Math.floor(Math.random() * directions.length)];
          const r = Math.floor(Math.random() * GRID_SIZE);
          const c = Math.floor(Math.random() * GRID_SIZE);

          const endR = r + dir[0] * (word.length - 1);
          const endC = c + dir[1] * (word.length - 1);

          if (endR >= 0 && endR < GRID_SIZE && endC >= 0 && endC < GRID_SIZE) {
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
              const currR = r + dir[0] * i;
              const currC = c + dir[1] * i;
              if (grid[currR][currC] !== '' && grid[currR][currC] !== word[i]) {
                canPlace = false;
                break;
              }
            }

            if (canPlace) {
              for (let i = 0; i < word.length; i++) {
                grid[r + dir[0] * i][c + dir[1] * i] = word[i];
              }
              placed = true;
            }
          }
        }
      });

      // Rellenar vacíos con letras aleatorias
      const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (grid[r][c] === '') {
            grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
          }
        }
      }

      renderBoard();
      renderWordList();
    }

    function renderBoard() {
      elGrid.innerHTML = '';
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.r = r;
          cell.dataset.c = c;
          cell.textContent = grid[r][c];

          cell.addEventListener('mousedown', () => startSelect(r, c));
          cell.addEventListener('mouseenter', () => hoverSelect(r, c));
          cell.addEventListener('mouseup', endSelect);

          // Soporte táctil
          cell.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startSelect(r, c);
          });
          cell.addEventListener('touchend', (e) => {
            e.preventDefault();
            endSelect();
          });

          elGrid.appendChild(cell);
        }
      }
    }

    function renderWordList() {
      elList.innerHTML = '';
      WORDS.forEach(w => {
        const li = document.createElement('li');
        li.className = 'word-item' + (foundWords.has(w) ? ' found' : '');
        li.id = 'word-' + w;
        li.innerHTML = '<span>' + w + '</span>' + (foundWords.has(w) ? '<span>✓</span>' : '');
        elList.appendChild(li);
      });
      elProgress.textContent = foundWords.size + ' / ' + WORDS.length;
    }

    function startSelect(r, c) {
      isMouseDown = true;
      selectedCells = [{ r, c }];
      updateCellStyles();
    }

    function hoverSelect(r, c) {
      if (!isMouseDown) return;
      if (!selectedCells.some(cell => cell.r === r && cell.c === c)) {
        selectedCells.push({ r, c });
        updateCellStyles();
      }
    }

    function endSelect() {
      if (!isMouseDown) return;
      isMouseDown = false;

      // Verificar si la selección corresponde a alguna palabra (o su inverso)
      const selectedWord = selectedCells.map(c => grid[c.r][c.c]).join('');
      const reversedWord = selectedWord.split('').reverse().join('');

      let matched = null;
      if (WORDS.includes(selectedWord) && !foundWords.has(selectedWord)) {
        matched = selectedWord;
      } else if (WORDS.includes(reversedWord) && !foundWords.has(reversedWord)) {
        matched = reversedWord;
      }

      if (matched) {
        foundWords.add(matched);
        selectedCells.forEach(cell => {
          const domCell = elGrid.children[cell.r * GRID_SIZE + cell.c];
          if (domCell) domCell.classList.add('found');
        });
        renderWordList();
        if (foundWords.size === WORDS.length) {
          elVictory.style.display = 'block';
        }
      }

      selectedCells = [];
      updateCellStyles();
    }

    function updateCellStyles() {
      const domCells = elGrid.children;
      for (let i = 0; i < domCells.length; i++) {
        const r = parseInt(domCells[i].dataset.r, 10);
        const c = parseInt(domCells[i].dataset.c, 10);
        if (selectedCells.some(cell => cell.r === r && cell.c === c)) {
          domCells[i].classList.add('selected');
        } else {
          domCells[i].classList.remove('selected');
        }
      }
    }

    document.addEventListener('mouseup', () => {
      if (isMouseDown) endSelect();
    });

    document.getElementById('btnRestart').addEventListener('click', initGame);

    initGame();
  </script>
</body>
</html>`;

  return injectShareBarIntoHtml(rawHtml, { title: safeTitle, subject: safeSubject });
}
