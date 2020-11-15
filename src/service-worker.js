// src/service-worker.js
workbox.core.setCacheNameDetails({ prefix: "amplify-datastore" });
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
