// 앱 화면 파일만 저장해 두고, GitHub 데이터는 항상 새로 받는다.
const CACHE = "stock-pick-app-v3";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return;   // GitHub API 는 건드리지 않음
  // 화면 파일: 네트워크 우선(새 버전 반영), 오프라인이면 저장본
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});

// 푸시 알림: GitHub Actions(src/notify.py)가 보낸다. 내용 {title, body, tab}
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch { d = {body: e.data && e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title || "종목추천", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.event || undefined,
    data: {tab: d.tab || "today"}, lang: "ko"}));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL("./?tab=" + encodeURIComponent((e.notification.data || {}).tab || "today"), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(cs => {
    for (const c of cs) if (c.url.startsWith(self.registration.scope) && "navigate" in c) return c.navigate(url).then(w => w && w.focus());
    return self.clients.openWindow(url);
  }));
});
