const CACHE_NAME = 'utweb-offlinemode';
const BASE_PATH = '/utweb/';
const BASE_TXT = '/utweb/cache/base.txt';
const OST_TXT = '/utweb/cache/ostplayer.txt';

// --- Install: cache root + utweb files ---
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    const fetchList = async (txtPath) => {
      try {
        const res = await fetch(txtPath);
        if (!res.ok) return [];
        return (await res.text()).split('\n').map(s => s.trim()).filter(Boolean);
      } catch {
        return [];
      }
    };

    const baseFiles = await fetchList(BASE_TXT);
    const ostFiles = await fetchList(OST_TXT);
    const allFiles = [...baseFiles, ...ostFiles];

    await cache.addAll(allFiles);
    console.log(`[SW] Cached ${allFiles.length} files.`);
    self.skipWaiting();
  })());
});

// --- Activate ---
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// --- Message listener ---
self.addEventListener('message', async event => {
  if (!event.data || event.data.type !== 'CACHE_FILES') return;
  const filesToCache = event.data.files || [];
  const port = event.ports[0];
  const cache = await caches.open(CACHE_NAME);
  const failedFiles = [];

  for (const file of filesToCache) {
    try {
      const res = await fetch(file);
      if (res.ok) await cache.put(file, res.clone());
      else failedFiles.push(file);
    } catch {
      failedFiles.push(file);
    }
  }

  port.postMessage({ status: 'done', failedFiles });
});

// --- Fetch handler ---
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        const url = new URL(event.request.url);
        if (url.pathname === '/' || url.pathname === '/index.html') return caches.match('/index.html');
        if (url.pathname.startsWith(BASE_PATH)) return caches.match(BASE_PATH + 'index.html');
        return null;
      });
    })
  );
});
