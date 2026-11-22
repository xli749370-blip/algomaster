#!/usr/bin/env node
/** 模拟线上「必须带 ?sharecode 或 cookie 才放行」的网关，用于本地验证可安装性
 *  node tools/gate.js  → http://127.0.0.1:8901/?sharecode=TMJWP6H5MQ */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8901;
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8",
};

function denied(res) {
  res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<!doctype html><meta charset=utf-8><title>403</title><h1>403</h1>");
}

http.createServer((req, res) => {
  const u = new URL(req.url, "http://127.0.0.1");
  const hasCode = u.searchParams.has("sharecode");
  const hasCookie = /__wb_rsc=/.test(req.headers.cookie || "");
  if (u.pathname !== "/" && !hasCode && !hasCookie) return denied(res);

  if (hasCode) res.setHeader("Set-Cookie", "__wb_rsc=1; Path=/; Max-Age=2592000; HttpOnly; SameSite=None; Secure");
  const f = path.join(ROOT, u.pathname === "/" ? "index.html" : decodeURIComponent(u.pathname));
  if (!f.startsWith(ROOT)) return denied(res);
  fs.readFile(f, (e, b) => {
    if (e) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
    res.end(b);
  });
}).listen(PORT, "127.0.0.1", () => console.log("gate on " + PORT));
