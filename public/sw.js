const CACHE_NAME = 'resource-hub-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.svg',
  '/favicon.ico',
  '/placeholder.svg'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache:', error);
      })
  );
});

// Fetch event - handle requests with cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response, or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback response for offline
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          // For other types of requests, return an appropriate fallback
          return new Response('', {
            status: 408,
            statusText: 'Request Timeout'
          });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});