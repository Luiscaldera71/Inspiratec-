/* InspiraTEC · Service Worker
   - Navegación: red primero y, sin conexión, la pantalla principal guardada.
   - Archivos estáticos (JS/CSS/imágenes/fuentes): se guardan para abrir más rápido.
   - Firebase, Gemini y cualquier otro dominio NO se tocan (siempre van a la red). */
const VERSION = 'v1';
const SHELL_CACHE = `inspiratec-shell-${VERSION}`;
const RUNTIME_CACHE = `inspiratec-runtime-${VERSION}`;
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/favicon-32.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase, Google, Gemini...
  if (req.headers.has('range') || /\.(mp4|webm|mov)$/i.test(url.pathname)) return; // video: siempre red

  // Páginas: red primero, con respaldo sin conexión
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    );
    return;
  }

  // Recursos con hash (inmutables): primero caché
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  // Imágenes, íconos, fuentes: caché y actualización en segundo plano
  if (/\.(png|jpe?g|webp|svg|ico|woff2?|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const red = fetch(req).then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)); }
          return res;
        }).catch(() => hit);
        return hit || red;
      })
    );
  }
});