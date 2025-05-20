self.addEventListener('install', event => {
  console.log("Service Worker installed");
});

self.addEventListener('fetch', event => {
  // Puedes personalizar caché aquí si lo deseas
});
