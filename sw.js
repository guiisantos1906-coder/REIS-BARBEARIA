const CACHE = 'reis-estatico-20261104-area-2';
const CORE = ['./index.html','./style.css?v=20261104-area','./script.js?v=20261104-area','./animacoes.js','./cinema.js','./melhorias.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('reis-estatico-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (/\/admin\.(?:html|js)$/.test(url.pathname)) return;
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!/\.(?:html|css|js|webmanifest|png|svg|jpg|jpeg|webp)$/.test(url.pathname) && req.mode !== 'navigate') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(req);
      if (fresh.ok) await cache.put(req, fresh.clone());
      return fresh;
    } catch (error) {
      const cached = await cache.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const page = await cache.match('./index.html');
        if (page) return page;
      }
      return Response.error();
    }
  })());
});
