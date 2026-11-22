// 离线缓存：只缓存核心框架文件，题库分片走网络（避免占用几十 MB 缓存配额）
const CACHE = "algomaster-v30";

// 本站在分享网关后面：任何请求都必须带 ?sharecode=xxx，否则 403。
// SW 脚本自身带的查询串就是授权码，这里复用它给所有资源补上。
const CODE = (() => {
  try {
    return new URL(self.location.href).search || "";
  } catch (e) {
    return "";
  }
})();
const withCode = (u) => {
  if (!CODE) return u;
  return u.includes("?") ? u + "&" + CODE.slice(1) : u + CODE;
};

const ASSETS = [
  "./index.html",
  "./css/style.css",
  "./js/data-algorithms.js",
  "./data/course-index.js",
  "./js/data-problems.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      // 逐个添加：单个资源失败不拖垮整个安装流程（否则 SW 永远装不上，PWA 也就不能安装）
      .then((c) =>
        Promise.all(
          ASSETS.map((a) =>
            c.add(new Request(withCode(a), { cache: "reload", credentials: "same-origin" }))
              .catch(() => null)
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  const isCore = ASSETS.some((a) => url.pathname.endsWith(a.replace("./", "/")));
  // 课程正文按语言分片（data/course-*.js）：用户打开过的语言顺手缓存，之后可离线读
  const isCourseBody = /\/data\/course-(cpp|py|java|c)\.js$/.test(url.pathname);
  if (!isCore && !isCourseBody) return; // 其余请求交给浏览器默认处理

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(e.request)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => caches.match("./index.html", { ignoreSearch: true }))
    )
  );
});
