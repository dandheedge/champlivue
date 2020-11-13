// src/service-worker.js
workbox.core.setCacheNameDetails({ prefix: "amplify-datastore" });
workbox.core.skipWaiting();
workbox.core.clientsClaim();
const cacheFiles = [
  {
    revision: "e653ab4d124bf16b5232",
    url: "https://aws-amplify.github.io/img/amplify.svg",
  },
];
self.__precacheManifest = cacheFiles.concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
