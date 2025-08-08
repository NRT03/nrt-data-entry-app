const CACHE_NAME = 'nrt-v6'; // Change this number every time you update your app
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'service-worker.js',
  'https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  'icon-192x192.png',
  'icon-512x512.png'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching new files.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting(); // Force the new service worker to activate immediately
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating and cleaning up old caches.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        return clients.claim(); // Take control of all pages immediately
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
