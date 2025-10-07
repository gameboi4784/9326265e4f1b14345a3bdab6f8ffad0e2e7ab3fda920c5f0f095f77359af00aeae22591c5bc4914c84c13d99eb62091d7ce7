const CACHE_NAME = 'drweb-offlinemode';
const BASE_PATH = '/drweb/'; // base path for your app

// Install: skip waiting, no caching yet
self.addEventListener('install', event => {
  console.log('[SW] Installed. Waiting for offline mode command...');
  self.skipWaiting();
});

// Activate: claim clients
self.addEventListener('activate', event => {
  console.log('[SW] Activated.');
  event.waitUntil(self.clients.claim());
});

// Message listener: caches files on demand
self.addEventListener('message', async event => {
  if (!event.data || event.data.type !== 'CACHE_FILES') return;

  const filesToCache = event.data.files;
  const port = event.ports[0]; // for reply
  const cache = await caches.open(CACHE_NAME);
  let failedFiles = [];

  for (let i = 0; i < filesToCache.length; i++) {
    const file = filesToCache[i];
    try {
      const response = await fetch(file);
      if (response.ok) {
        await cache.put(file, response.clone());
        console.log(`[SW] Cached: ${file}`);
      } else {
        console.warn(`[SW] Failed to fetch ${file}: ${response.status}`);
        failedFiles.push(file);
      }
    } catch (err) {
      console.warn(`[SW] Error caching ${file}:`, err);
      failedFiles.push(file);
    }
  }

  port.postMessage({ status: 'done', failedFiles });
});

// Fetch handler: respond from cache first, then network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        const url = new URL(event.request.url);

        if (url.pathname.startsWith(BASE_PATH)) {
          return caches.match(BASE_PATH + 'index.html');
        }

        return null; // don't serve other site's files
      });
    })
  );
});
