import { injectShareBarIntoHtml } from './universalShareBar.js';

/**
 * rubricGenerator.js
 * Generador interactivo de Rúbricas Analíticas de Evaluación en un único archivo HTML.
 * Permite al docente/estudiante:
 * - Clic en cada descriptor de nivel (Superior: 5.0, Alto: 4.0, Básico: 3.2, Bajo: 2.0).
 * - Cálculo automático y en tiempo real de la calificación ponderada total.
 * - Despliegue de retroalimentación cualitativa según el nivel obtenido.
 * - Imprimir la matriz de evaluación y compartirla directamente.
 */

export function generateInteractiveRubricHTML({
  title = 'Rúbrica Analítica de Evaluación',
  subject = 'General',
  grade = '',
  criteria = []
} = {}) {
  const safeTitle = (title || 'Rúbrica de Evaluación').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubject = (subject || 'General').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const defaultCriteria = (criteria && criteria.length > 0 ? criteria : [
    {
      name: 'Apropiación de Conceptos y Saberes',
      weight: 30,
      levels: {
        superior: 'Demuestra dominio riguroso y profundo de los conceptos, argumentando con precisión técnica y pertinencia.',
        alto: 'Comprende y aplica correctamente los conceptos clave con escasas imprecisiones menores.',
        basico: 'Identifica los conceptos básicos aunque presenta dificultades al contextualizarlos o explicarlos en detalle.',
        bajo: 'Presenta confusión o desconoce los conceptos fundamentales abordados en la sesión formativa.'
      }
    },
    {
      name: 'Procedimiento y Aplicación Práctica',
      weight: 40,
      levels: {
        superior: 'Ejecuta el procedimiento de forma autónoma, eficiente e innovadora, superando los desafíos planteados.',
        alto: 'Desarrolla el procedimiento adecuadamente siguiendo las pautas dadas con resultados satisfactorios.',
        basico: 'Realiza el procedimiento con apoyo intermitente y requiere correcciones para completar la tarea.',
        bajo: 'No logra ejecutar el procedimiento o muestra inconsistencias graves en su aplicación.'
      }
    },
    {
      name: 'Comunicación, Trabajo y Actitud Formativa',
      weight: 30,
      levels: {
        superior: 'Comunica sus hallazgos con claridad ejemplar, participa activamente y fomenta la colaboración.',
        alto: 'Expresa sus ideas de forma clara y mantiene una actitud colaborativa constante.',
        basico: 'Expone sus ideas con limitaciones y participa pasivamente en las actividades grupales.',
        bajo: 'Muestra desinterés, interrumpe el trabajo colaborativo o no entrega evidencias comunicables.'
      }
    }
  ]);

  const rawHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} — Rúbrica Interactiva</title>
  <style>
    :root {
      --primary: #142B25;
      --primary-sage: #315B54;
      --gold: #D4AF37;
      --bg: #F4F7F6;
      --card-bg: #FFFFFF;
      --border: rgba(49, 91, 84, 0.2);
      --text: #142B25;
      --text-muted: #576864;
      --sup-color: #059669;
      --alto-color: #0284C7;
      --bas-color: #D97706;
      --bajo-color: #DC2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 0 0 40px 0; }
    .rubric-container { max-width: 1080px; margin: 24px auto; padding: 0 20px; }
    .rubric-header-card {
      background: #FFFFFF; border-radius: 18px; padding: 24px 28px; margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(20, 43, 37, 0.06); border: 1px solid var(--border);
    }
    .rubric-title { font-size: 22px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
    .rubric-subtitle { font-size: 14px; color: var(--text-muted); }
    .rubric-table-wrapper {
      background: #FFFFFF; border-radius: 18px; overflow: hidden;
      box-shadow: 0 8px 24px rgba(20, 43, 37, 0.06); border: 1px solid var(--border);
    }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    thead { background: var(--primary); color: #FFFFFF; }
    th { padding: 14px 16px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    th.col-crit { width: 28%; }
    th.col-lvl { width: 18%; text-align: center; }
    tbody tr { border-bottom: 1px solid var(--border); }
    tbody tr:last-child { border-bottom: none; }
    td.crit-cell { padding: 16px; background: #FAFDFB; font-weight: 600; font-size: 14px; color: var(--primary); border-right: 1px solid var(--border); }
    td.crit-cell small { display: block; font-weight: 400; color: var(--text-muted); font-size: 12px; margin-top: 4px; }
    td.lvl-cell {
      padding: 14px; font-size: 13px; line-height: 1.45; color: #374151; cursor: pointer;
      transition: all 0.15s ease; border-right: 1px solid var(--border); vertical-align: top; user-select: none;
    }
    td.lvl-cell:last-child { border-right: none; }
    td.lvl-cell:hover { background: rgba(49, 91, 84, 0.08); transform: scale(1.01); }
    td.lvl-cell.selected-sup { background: #ECFDF5; border: 2px solid var(--sup-color); font-weight: 600; color: #065F46; }
    td.lvl-cell.selected-alto { background: #F0F9FF; border: 2px solid var(--alto-color); font-weight: 600; color: #075985; }
    td.lvl-cell.selected-bas { background: #FFFBEB; border: 2px solid var(--bas-color); font-weight: 600; color: #92400E; }
    td.lvl-cell.selected-bajo { background: #FEF2F2; border: 2px solid var(--bajo-color); font-weight: 600; color: #991B1B; }

    .score-summary-card {
      margin-top: 24px; background: #FFFFFF; border-radius: 18px; padding: 24px 28px;
      box-shadow: 0 8px 24px rgba(20, 43, 37, 0.06); border: 1.5px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
    }
    .score-box { display: flex; align-items: center; gap: 16px; }
    .score-badge {
      width: 76px; height: 76px; border-radius: 18px; background: var(--primary); color: #FFFFFF;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      font-size: 26px; font-weight: 800; border: 2px solid var(--gold);
    }
    .score-badge small { font-size: 10px; font-weight: 600; color: #A7F3D0; }
    .score-details h4 { font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 4px; }
    .score-details p { font-size: 13.5px; color: var(--text-muted); }
    .btn-reset {
      background: rgba(49, 91, 84, 0.1); color: var(--primary-sage); border: 1px solid var(--primary-sage);
      padding: 9px 18px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer;
    }
    .btn-reset:hover { background: var(--primary-sage); color: #FFFFFF; }
    @media (max-width: 768px) {
      .rubric-table-wrapper { overflow-x: auto; }
      table { min-width: 640px; }
    }
  </style>
</head>
<body>
  <div class="rubric-container">
    <div class="rubric-header-card">
      <h1 class="rubric-title">${safeTitle}</h1>
      <p class="rubric-subtitle">Haz clic sobre las celdas de cada criterio para registrar la evaluación en tiempo real.</p>
    </div>

    <div class="rubric-table-wrapper">
      <table id="rubricTable">
        <thead>
          <tr>
            <th class="col-crit">Criterio de Evaluación</th>
            <th class="col-lvl" style="background:#065F46;">Superior (5.0)</th>
            <th class="col-lvl" style="background:#0369A1;">Alto (4.0)</th>
            <th class="col-lvl" style="background:#B45309;">Básico (3.2)</th>
            <th class="col-lvl" style="background:#991B1B;">Bajo (2.0)</th>
          </tr>
        </thead>
        <tbody>
          ${defaultCriteria.map((c, idx) => `
            <tr data-crit-index="${idx}" data-weight="${c.weight}">
              <td class="crit-cell">
                ${c.name}
                <small>Ponderación: ${c.weight}%</small>
              </td>
              <td class="lvl-cell" data-level="sup" data-score="5.0">${c.levels.superior}</td>
              <td class="lvl-cell" data-level="alto" data-score="4.0">${c.levels.alto}</td>
              <td class="lvl-cell" data-level="bas" data-score="3.2">${c.levels.basico}</td>
              <td class="lvl-cell" data-level="bajo" data-score="2.0">${c.levels.bajo}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="score-summary-card">
      <div class="score-box">
        <div class="score-badge">
          <span id="finalScoreText">0.0</span>
          <small>/ 5.0</small>
        </div>
        <div class="score-details">
          <h4 id="scoreLabel">Evaluación Pendiente</h4>
          <p id="scoreDescription">Selecciona un nivel en cada fila de la matriz para calcular la nota final y la retroalimentación.</p>
        </div>
      </div>
      <div>
        <button type="button" class="btn-reset" id="btnResetRubric">Reiniciar Evaluación</button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      var selections = {};
      var rows = document.querySelectorAll('tbody tr');
      var totalRows = rows.length;
      var scoreText = document.getElementById('finalScoreText');
      var scoreLabel = document.getElementById('scoreLabel');
      var scoreDesc = document.getElementById('scoreDescription');
      var btnReset = document.getElementById('btnResetRubric');

      rows.forEach(function(row) {
        var rowIndex = row.getAttribute('data-crit-index');
        var weight = parseFloat(row.getAttribute('data-weight')) || (100 / totalRows);
        var cells = row.querySelectorAll('.lvl-cell');

        cells.forEach(function(cell) {
          cell.addEventListener('click', function() {
            cells.forEach(function(c) {
              c.classList.remove('selected-sup', 'selected-alto', 'selected-bas', 'selected-bajo');
            });
            var lvl = cell.getAttribute('data-level');
            var score = parseFloat(cell.getAttribute('data-score'));
            cell.classList.add('selected-' + lvl);
            selections[rowIndex] = { score: score, weight: weight, level: lvl };
            calculateTotal();
          });
        });
      });

      function calculateTotal() {
        var totalWeightedScore = 0;
        var totalWeight = 0;
        var count = 0;

        for (var k in selections) {
          totalWeightedScore += (selections[k].score * (selections[k].weight / 100));
          totalWeight += selections[k].weight;
          count++;
        }

        if (count === 0) {
          scoreText.textContent = '0.0';
          scoreLabel.textContent = 'Evaluación Pendiente';
          scoreDesc.textContent = 'Selecciona un nivel en cada criterio para calcular el resultado.';
          return;
        }

        var finalScore = (totalWeightedScore * (100 / (totalWeight || 100))).toFixed(1);
        scoreText.textContent = finalScore;

        if (finalScore >= 4.6) {
          scoreLabel.textContent = 'Desempeño Superior 🌟';
          scoreDesc.textContent = 'Logro excepcional de todos los propósitos y estándares propuestos.';
        } else if (finalScore >= 4.0) {
          scoreLabel.textContent = 'Desempeño Alto 👍';
          scoreDesc.textContent = 'Dominio satisfactorio de los conceptos y aplicaciones prácticas.';
        } else if (finalScore >= 3.0) {
          scoreLabel.textContent = 'Desempeño Básico ⚠️';
          scoreDesc.textContent = 'Cumple con los requisitos mínimos pero requiere refuerzo conceptual.';
        } else {
          scoreLabel.textContent = 'Desempeño Bajo ❌';
          scoreDesc.textContent = 'Se requiere plan de mejoramiento pedagógico y acompañamiento docente.';
        }
      }

      btnReset.addEventListener('click', function() {
        selections = {};
        document.querySelectorAll('.lvl-cell').forEach(function(c) {
          c.classList.remove('selected-sup', 'selected-alto', 'selected-bas', 'selected-bajo');
        });
        calculateTotal();
      });
    })();
  </script>
</body>
</html>`;

  return injectShareBarIntoHtml(rawHtml, { title: safeTitle, subject: safeSubject, grade });
}
