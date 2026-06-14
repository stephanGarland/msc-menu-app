"use strict";
const CACHE = "galley-v6";
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js",
  "https://fonts.googleapis.com/css2?family=Marcellus&display=swap"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(PRECACHE.map((u) => c.add(u)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // App shell: cache-first, refresh in background.
  // Fonts/pdf.js: cache-first (versioned URLs, immutable in practice).
  // Everything else (e.g. menu PDF fetches): network only — let the app handle failures.
  const url = new URL(req.url);
  if (url.pathname.endsWith("/bundle.json")) return; // always fresh from network

  // HTML / navigations: network-first so deploys appear on the next load,
  // falling back to cache when offline (mid-ocean).
  const isShellOrigin = url.origin === self.location.origin;
  const isHTML = req.mode === "navigate" ||
    (isShellOrigin && (url.pathname.endsWith("/") || url.pathname.endsWith(".html")));
  if (isHTML) {
    e.respondWith(
      fetch(req).then((resp) => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return resp;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then((c) => c || caches.match("./index.html"))
      )
    );
    return;
  }
  const isShell = url.origin === self.location.origin;
  const isVendor =
    url.hostname === "cdnjs.cloudflare.com" ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";

  if (!isShell && !isVendor) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: isShell }).then((cached) => {
      const network = fetch(req)
        .then((resp) => {
          if (resp && (resp.ok || resp.type === "opaque")) {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
