// FunTogether Service Worker — Web Push
// (No fetch/caching handler on purpose, to avoid serving a stale app version.)

self.addEventListener("install", function() { self.skipWaiting(); });
self.addEventListener("activate", function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function(event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { title: "FunTogether", body: event.data ? event.data.text() : "" }; }
  event.waitUntil(
    self.registration.showNotification(data.title || "FunTogether", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-96.png",
      dir: "rtl",
      lang: "he",
      vibrate: [120, 60, 120],
      tag: "ft-msg",
      renotify: true,
      data: { url: data.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(self.location.origin) === 0 && "focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/ft26.html");
    })
  );
});
