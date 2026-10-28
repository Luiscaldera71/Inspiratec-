/**
 * universalShareBar.js
 * Inyecta una barra superior de herramientas interactiva y autónoma en cualquier material HTML generado.
 * Permite a docentes y estudiantes:
 * 1. Compartir el recurso directamente (Web Share API nativa o copia al portapapeles con toast).
 * 2. Imprimir o guardar como PDF en un clic con estilos de impresión optimizados (@media print).
 * 3. Proyectar en pantalla completa para el aula de clases.
 * 4. Funcionar 100% autónomo (offline), sin dependencias externas ni CDN.
 */

export function getUniversalShareBarHtml({
  title = 'Material Didáctico Interactivo',
  subject = 'INSPIRATEC',
  author = 'Docente Planificador',
  grade = ''
} = {}) {
  const safeTitle = (title || 'Material Didáctico').replace(/"/g, '&quot;');
  const safeSubject = (subject || 'General').replace(/"/g, '&quot;');
  const safeGrade = (grade ? ` • Grado ${grade}` : '').replace(/"/g, '&quot;');
  const safeAuthor = (author || 'Comunidad Docente').replace(/"/g, '&quot;');

  return `
  <!-- ==================== BARRA UNIVERSAL INSPIRATEC (COMPARTIR Y HERRAMIENTAS) ==================== -->
  <style>
    .inspiratec-share-bar {
      width: 100%;
      background: #142B25;
      color: #FFFFFF;
      padding: 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      position: relative;
      z-index: 99999;
      box-sizing: border-box;
    }
    .inspiratec-share-bar * {
      box-sizing: border-box;
    }
    .inspiratec-share-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 220px;
    }
    .inspiratec-share-badge {
      background: linear-gradient(135deg, #D4AF37, #F59E0B);
      color: #0E1A17;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .inspiratec-share-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
      line-height: 1.2;
    }
    .inspiratec-share-sub {
      font-size: 11.5px;
      color: #A7F3D0;
      margin: 0;
    }
    .inspiratec-share-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .inspiratec-share-btn {
      background: rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.22);
      padding: 6px 13px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.18s ease;
      text-decoration: none;
      outline: none;
    }
    .inspiratec-share-btn:hover {
      background: rgba(255, 255, 255, 0.24);
      border-color: #D4AF37;
      color: #FACC15;
      transform: translateY(-1px);
    }
    .inspiratec-share-btn-primary {
      background: #D4AF37;
      color: #142B25;
      border-color: #D4AF37;
      font-weight: 700;
    }
    .inspiratec-share-btn-primary:hover {
      background: #F59E0B;
      color: #0E1A17;
      border-color: #F59E0B;
    }
    .inspiratec-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #142B25;
      color: #FFFFFF;
      border: 1px solid #D4AF37;
      border-radius: 12px;
      padding: 12px 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      font-size: 13px;
      font-weight: 600;
      z-index: 1000000;
      display: none;
      align-items: center;
      gap: 8px;
      animation: inspiratecToastIn 0.25s ease forwards;
    }
    @keyframes inspiratecToastIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media print {
      .inspiratec-share-bar, .inspiratec-toast {
        display: none !important;
      }
    }
  </style>

  <div class="inspiratec-share-bar" id="inspiratecShareBar">
    <div class="inspiratec-share-meta">
      <span class="inspiratec-share-badge">★ INSPIRATEC</span>
      <div>
        <div class="inspiratec-share-title">${safeTitle}</div>
        <div class="inspiratec-share-sub">${safeSubject}${safeGrade} • ${safeAuthor}</div>
      </div>
    </div>
    <div class="inspiratec-share-actions">
      <button type="button" class="inspiratec-share-btn inspiratec-share-btn-primary" id="inspiratecBtnShare" title="Compartir este recurso con estudiantes o colegas">
        🔗 Compartir
      </button>
      <button type="button" class="inspiratec-share-btn" id="inspiratecBtnPrint" title="Imprimir o guardar como PDF para aula física">
        🖨️ Imprimir / PDF
      </button>
      <button type="button" class="inspiratec-share-btn" id="inspiratecBtnFullscreen" title="Proyectar en pantalla completa">
        ⛶ Pantalla Completa
      </button>
    </div>
  </div>

  <div class="inspiratec-toast" id="inspiratecToast">
    ✓ Recurso didáctico listo para compartir
  </div>

  <script>
    (function() {
      function initInspiratecShareBar() {
        var btnShare = document.getElementById('inspiratecBtnShare');
        var btnPrint = document.getElementById('inspiratecBtnPrint');
        var btnFullscreen = document.getElementById('inspiratecBtnFullscreen');
        var toast = document.getElementById('inspiratecToast');

        function showToast(msg) {
          if (!toast) return;
          toast.textContent = msg || '✓ Recurso copiado al portapapeles';
          toast.style.display = 'flex';
          setTimeout(function() {
            toast.style.display = 'none';
          }, 3500);
        }

        if (btnShare) {
          btnShare.addEventListener('click', function() {
            var shareData = {
              title: '${safeTitle}',
              text: 'Recurso Didáctico Interactivo: ${safeTitle} (${safeSubject}). Diseñado con INSPIRATEC para el aprendizaje activo.',
              url: window.location.href && window.location.href.indexOf('blob:') !== 0 ? window.location.href : ''
            };

            if (navigator.share && (shareData.url || navigator.canShare)) {
              navigator.share(shareData).catch(function(err) {
                fallbackShare();
              });
            } else {
              fallbackShare();
            }

            function fallbackShare() {
              var copyText = '★ RECURSO DIDÁCTICO INSPIRATEC ★\\n' +
                'Título: ${safeTitle}\\n' +
                'Área: ${safeSubject}${safeGrade}\\n' +
                'Docente: ${safeAuthor}\\n' +
                'Este material es interactivo y funciona directamente en cualquier navegador o dispositivo móvil.';
              
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyText).then(function() {
                  showToast('✓ Resumen copiado. ¡Pégalo en WhatsApp, Correo o Classroom!');
                }).catch(function() {
                  prompt('Copia los datos de este recurso para compartir:', copyText);
                });
              } else {
                prompt('Copia los datos de este recurso para compartir:', copyText);
              }
            }
          });
        }

        if (btnPrint) {
          btnPrint.addEventListener('click', function() {
            window.print();
          });
        }

        if (btnFullscreen) {
          btnFullscreen.addEventListener('click', function() {
            if (!document.fullscreenElement) {
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(function(){});
              } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
              }
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen().catch(function(){});
              }
            }
          });
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInspiratecShareBar);
      } else {
        initInspiratecShareBar();
      }
    })();
  </script>
  <!-- ==================== FIN BARRA UNIVERSAL ==================== -->
  `;
}

/**
 * Inyecta la barra universal de compartir y estilos de compatibilidad en cualquier HTML
 */
export function injectShareBarIntoHtml(htmlString, metadata = {}) {
  if (!htmlString || typeof htmlString !== 'string') return htmlString;
  
  // Si ya tiene la barra, no duplicar
  if (htmlString.includes('inspiratec-share-bar')) return htmlString;

  const barHtml = getUniversalShareBarHtml(metadata);

  // Inyectar justo después de <body> si existe, o al principio
  if (/<body[^>]*>/i.test(htmlString)) {
    return htmlString.replace(/(<body[^>]*>)/i, `$1\n${barHtml}\n`);
  } else {
    return barHtml + '\n' + htmlString;
  }
}
