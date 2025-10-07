const CACHE_NAME = 'root';
const ROOT_FILES = [
  '/index.html',
  '/localspace.png',
  '/style.css',
  '/fonts/8bitOperatorPlus-Regular.ttf',
  '/fonts/8bitOperatorPlus-Bold.ttf',
  '/fonts/determination.otf',
  '/fonts/determinationsans.woff',
  '/fonts/PixelOperator-Bold.ttf',
  '/dog.cur',
];

// --- Install: cache all root files ---
self.addEventListener('install', event => {
  console.log('[SW Root] Installing and caching root files...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ROOT_FILES))
  );
  self.skipWaiting();
});

// --- Activate ---
self.addEventListener('activate', event => {
  console.log('[SW Root] Activated.');
  event.waitUntil(self.clients.claim());
});

// --- Fetch handler ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        const url = new URL(event.request.url);

        // Navigation fallback: any attempt to access root should serve index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }

        // Fallback for exact root assets
        if (ROOT_FILES.includes(url.pathname)) {
          return caches.match(url.pathname);
        }

        // Nothing found, return null to show offline error
        return null;
      });
    })
  );
});
