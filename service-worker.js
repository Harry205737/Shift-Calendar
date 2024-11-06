const CACHE_NAME = 'shift-calendar-cache-v1';
const urlsToCache = [
  '/Shift-Calendar/',           // Your app's root URL
  '/Shift-Calendar/index.html',  // Main HTML file
  '/Shift-Calendar/manifest.json',
  '/Shift-Calendar/icons/icon-192x192.png',
  '/Shift-Calendar/icons/icon-512x512.png',
  // Add more assets here as needed
];

// Install the service worker and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch cached files if available, else fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate the service worker and clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
