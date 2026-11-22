const cacheName = 'practice-offline-v1';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(async cache => {
    const page = await fetch('./', {cache:'reload'});
    if (!page.ok || page.redirected) throw Error('Page unavailable');
    await cache.put('./', page);
    await self.skipWaiting();
  }));
});
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' && new URL(event.request.url).origin === self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => caches.open(cacheName).then(cache => cache.match('./'))));
  }
});
