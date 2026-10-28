import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import '../styles/install.css';

/**
 * Invitación para instalar InspiraTEC como app (PWA).
 * - Se muestra solo si se abre desde el navegador (no instalada).
 * - Android/escritorio (Chrome, Edge): botón "Instalar" con el aviso oficial del navegador.
 * - iPhone/iPad: instrucciones para «Agregar a pantalla de inicio».
 * - Al instalarla (o si ya corre como app) no vuelve a aparecer.
 * - «Ahora no» la oculta 7 días; tras 3 rechazos deja de insistir.
 */
const KEY_INSTALADA = 'inspiratec_pwa_instalada';
const KEY_RECHAZO = 'inspiratec_pwa_rechazo';
const SIETE_DIAS = 7 * 24 * 60 * 60 * 1000;

// El evento puede dispararse antes de montar el componente: se captura al cargar el módulo.
let promptDiferido = null;
const oyentes = new Set();
const avisar = () => oyentes.forEach((fn) => fn());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    promptDiferido = e;
    avisar();
  });
  window.addEventListener('appinstalled', () => {
    promptDiferido = null;
    try { localStorage.setItem(KEY_INSTALADA, '1'); } catch (_) {}
    avisar();
  });
}

const leer = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };

const yaEsApp = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true);

const esIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

function puedeMostrarse() {
  if (yaEsApp() || leer(KEY_INSTALADA) === '1') return false;
  let rechazo = { n: 0, t: 0 };
  try { rechazo = JSON.parse(leer(KEY_RECHAZO) || '{"n":0,"t":0}'); } catch (_) {}
  if (rechazo.n >= 3) return false;
  if (rechazo.t && Date.now() - rechazo.t < SIETE_DIAS) return false;
  return true;
}

export default function InstallPrompt() {
  const [, forzar] = useState(0);
  const [visible, setVisible] = useState(false);
  const [instalando, setInstalando] = useState(false);

  const ios = esIOS();
  const puedeInstalar = Boolean(promptDiferido) || ios;

  useEffect(() => {
    const fn = () => forzar((n) => n + 1);
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  }, []);

  // Aparece unos segundos después de entrar, para no tapar la carga inicial
  useEffect(() => {
    if (!puedeInstalar || !puedeMostrarse()) { setVisible(false); return undefined; }
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, [puedeInstalar]);

  const rechazar = () => {
    let r = { n: 0, t: 0 };
    try { r = JSON.parse(leer(KEY_RECHAZO) || '{"n":0,"t":0}'); } catch (_) {}
    try { localStorage.setItem(KEY_RECHAZO, JSON.stringify({ n: (r.n || 0) + 1, t: Date.now() })); } catch (_) {}
    setVisible(false);
  };

  const instalar = async () => {
    if (!promptDiferido) return;
    setInstalando(true);
    try {
      promptDiferido.prompt();
      const { outcome } = await promptDiferido.userChoice;
      if (outcome === 'accepted') {
        try { localStorage.setItem(KEY_INSTALADA, '1'); } catch (_) {}
        setVisible(false);
      } else {
        rechazar();
      }
    } finally {
      promptDiferido = null;
      setInstalando(false);
    }
  };

  if (!visible) return null;

  return (
    <aside className="pwa-card" role="dialog" aria-label="Instalar InspiraTEC">
      <button type="button" className="pwa-x" onClick={rechazar} aria-label="Cerrar">
        <X size={16} />
      </button>

      <img className="pwa-icon" src="/icon-192.png" alt="" draggable={false} />

      <div className="pwa-body">
        <strong>Instala InspiraTEC en tu dispositivo</strong>
        {ios && !promptDiferido ? (
          <p>
            Toca <Share size={14} className="pwa-inline" /> <b>Compartir</b> y luego{' '}
            <PlusSquare size={14} className="pwa-inline" /> <b>Agregar a pantalla de inicio</b>.
          </p>
        ) : (
          <p>Ábrela como una app, más rápido y sin barras del navegador.</p>
        )}

        <div className="pwa-actions">
          {promptDiferido && (
            <button type="button" className="pwa-install" onClick={instalar} disabled={instalando}>
              <Download size={16} /> {instalando ? 'Instalando…' : 'Instalar'}
            </button>
          )}
          <button type="button" className="pwa-later" onClick={rechazar}>Ahora no</button>
        </div>
      </div>
    </aside>
  );
}
