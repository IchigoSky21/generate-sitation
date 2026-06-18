const CACHE_NAME = 'citation-generator-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

// Tahap Instalasi: Menyimpan file ke dalam Cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Membuka cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Tahap Fetch: Mengambil dari Cache saat offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika file ada di cache, gunakan itu. Jika tidak, ambil dari internet.
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Tahap Aktivasi: Membersihkan Cache lama jika ada pembaruan versi
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});