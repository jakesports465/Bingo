/* Gridiron Command — service worker (PWA offline + auto-updating) */
const VER = "gc-v3-5";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VER).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VER).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // The app HTML/navigation: NETWORK-FIRST so new deploys load immediately when online.
  const isDoc = req.mode === "navigate" || (url.origin === location.origin && /\.html$|\/$/.test(url.pathname));
  if (isDoc) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone(); caches.open(VER).then((c) => c.put("./index.html", copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((h) => h || caches.match("./index.html")))
    );
    return;
  }

  // Other same-origin assets: cache-first (fast), fall back to network.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone(); caches.open(VER).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html")))
    );
    return;
  }

  // Cross-origin (proxy / API / logos): network-first, cache last-good for offline.
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone(); caches.open(VER + "-data").then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
