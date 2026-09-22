const CACHE_NAME = 'sitasi-cache-v12';
const BASE_URL = self.registration.scope;

const urlsToCache = [
    BASE_URL,
    new URL('./index.html', BASE_URL).href,
    new URL('./style.css', BASE_URL).href,
    new URL('./app.js', BASE_URL).href,
    new URL('./manifest.json', BASE_URL).href,
    new URL('./icon-192.svg', BASE_URL).href,
    new URL('./icon-512.svg', BASE_URL).href
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => caches.match(new URL('./index.html', BASE_URL).href))
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        )).then(() => self.clients.claim())
    );
});
