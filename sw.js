const CACHE_NAME = "scoutpass-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./admin.html",
  "./scanner.html",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap",
  "https://unpkg.com/html5-qrcode",
  "https://cdn.jsdelivr.net/npm/sweetalert2@11",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"
];

// 1. Install Service Worker & Cache Files
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate & Clean Old Caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// 3. Fetch (Serve from Cache if Offline)
self.addEventListener("fetch", (e) => {
  // Database requests should always go to network (Don't cache Firebase data)
  if (e.request.url.includes("firebase") || e.request.url.includes("googleapis.com")) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => {
        // Optional: Return a custom offline page here if needed
      });
    })
  );
});