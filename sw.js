/**
 * Service worker : rend l'application utilisable hors ligne.
 * Stratégie « cache d'abord » pour les ressources locales, avec mise à jour
 * en arrière-plan. Changer CACHE force le rechargement des fichiers.
 */

const CACHE = 'examen-civique-v11';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/spot/principes-valeurs-clair.svg',
  './assets/spot/principes-valeurs-sombre.svg',
  './assets/spot/institutions-clair.svg',
  './assets/spot/institutions-sombre.svg',
  './assets/spot/droits-devoirs-clair.svg',
  './assets/spot/droits-devoirs-sombre.svg',
  './assets/spot/histoire-geo-culture-clair.svg',
  './assets/spot/histoire-geo-culture-sombre.svg',
  './assets/spot/vivre-societe-clair.svg',
  './assets/spot/vivre-societe-sombre.svg',
  './assets/spot/examen-clair.svg',
  './assets/spot/examen-sombre.svg',
  './assets/spot/revision-clair.svg',
  './assets/spot/revision-sombre.svg',
  './assets/spot/livret-clair.svg',
  './assets/spot/livret-sombre.svg',
  './assets/spot/histoire-clair.svg',
  './assets/spot/histoire-sombre.svg',
  './assets/spot/progres-clair.svg',
  './assets/spot/progres-sombre.svg',
  './assets/spot/assistant-clair.svg',
  './assets/spot/assistant-sombre.svg',
  './assets/spot/compte-clair.svg',
  './assets/spot/compte-sombre.svg',
  './assets/story/ch01.svg',
  './assets/story/ch02.svg',
  './assets/story/ch03.svg',
  './assets/story/ch04.svg',
  './assets/story/ch05.svg',
  './assets/story/ch06.svg',
  './assets/story/ch07.svg',
  './assets/story/ch08.svg',
  './assets/story/ch09.svg',
  './assets/story/ch10.svg',
  './assets/story/ch11.svg',
  './assets/story/ch12.svg',
  './assets/story/ch13.svg',
  './assets/story/ch14.svg',
  './assets/story/ch15.svg',
  './assets/story/ch16.svg',
  './assets/story/ch17.svg',
  './assets/story/ch18.svg',
  './assets/story/ch19.svg',
  './assets/story/ch20.svg',
  './assets/story/ch21.svg',
  './assets/story/ch22.svg',
  './js/app.js',
  './js/store.js',
  './js/engine.js',
  './js/sync.js',
  './js/ai.js',
  './js/ai-context.js',
  './js/lib/dom.js',
  './js/lib/icons.js',
  './js/lib/feedback.js',
  './js/lib/xp.js',
  './js/lib/rappel.js',
  './js/lib/util.js',
  './js/components/quiz.js',
  './js/components/results.js',
  './js/components/reponse-ia.js',
  './js/components/approfondir.js',
  './js/views/onboarding.js',
  './js/views/home.js',
  './js/views/reviser.js',
  './js/views/examen.js',
  './js/views/cours.js',
  './js/views/livret.js',
  './js/views/roman.js',
  './js/views/cartes.js',
  './js/views/progres.js',
  './js/views/parcours.js',
  './js/views/recherche.js',
  './js/views/activite.js',
  './js/views/compte.js',
  './js/views/assistant.js',
  './js/views/reglages-ia.js',
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
      // `cache: 'reload'` contourne le cache HTTP du navigateur. Sans cela, une
      // feuille de style périmée peut être servie à côté d'un index.html neuf :
      // les deux versions se mélangent et la mise en page casse.
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
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
