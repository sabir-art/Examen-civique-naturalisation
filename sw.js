/**
 * Service worker : rend l'application utilisable hors ligne.
 * Stratégie « cache d'abord » pour les ressources locales, avec mise à jour
 * en arrière-plan. Changer CACHE force le rechargement des fichiers.
 */

const CACHE = 'examen-civique-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './js/app.js',
  './js/store.js',
  './js/engine.js',
  './js/sync.js',
  './js/ai.js',
  './js/lib/dom.js',
  './js/lib/util.js',
  './js/components/quiz.js',
  './js/components/results.js',
  './js/views/onboarding.js',
  './js/views/home.js',
  './js/views/reviser.js',
  './js/views/examen.js',
  './js/views/cours.js',
  './js/views/livret.js',
  './js/views/roman.js',
  './js/views/progres.js',
  './js/views/compte.js',
  './js/views/assistant.js',
  './js/data/programme.js',
  './js/data/questions.js',
  './js/data/cours.js',
  './js/data/livret.js',
  './js/data/q-livret.js',
  './js/data/livret/partie-1.js',
  './js/data/livret/partie-2.js',
  './js/data/livret/partie-3.js',
  './js/data/livret/partie-4.js',
  './js/data/livret/partie-5.js',
  './js/data/livret/annexes.js',
  './js/data/roman.js',
  './js/data/roman/acte-1.js',
  './js/data/roman/acte-2.js',
  './js/data/roman/acte-3.js',
  './js/data/q-principes.js',
  './js/data/q-principes-situations.js',
  './js/data/q-institutions.js',
  './js/data/q-droits.js',
  './js/data/q-droits-situations.js',
  './js/data/q-histoire.js',
  './js/data/q-societe.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // synchronisation : toujours réseau

  // Navigation : on sert la coquille de l'application.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html').then((r) => r || caches.match('./'))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
