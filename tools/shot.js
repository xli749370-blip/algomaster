#!/usr/bin/env node
/** 截图工具：node tools/shot.js  →  输出到 tools/shots/*.png */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "shots");
const PORT = 8978, CDP_PORT = 9334;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find(p => fs.existsSync(p));

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png" };
const srv = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  const f = path.join(ROOT, u === "/" ? "index.html" : u);
  fs.readFile(f, (e, b) => {
    if (e) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
    res.end(b);
  });
});
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-shot-" + process.pid),
    "about:blank",
  ], { stdio: "ignore" });

  const tgt = await (async () => {
    for (let i = 0; i < 80; i++) {
      try {
        const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
        const t = list.find(x => x.type === "page");
        if (t) return t;
      } catch (e) {}
      await sleep(150);
    }
    throw new Error("no target");
  })();

  const ws = new WebSocket(tgt.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const pend = new Map();
  ws.addEventListener("message", e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => (await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true })).result.value;

  await send("Page.enable");
  await send("Runtime.enable");

  const shot = async name => {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
    console.log("saved", name);
  };

  const goto = async () => {
    await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
    for (let i = 0; i < 50; i++) {
      const ok = await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length");
      if (ok) break;
      await sleep(150);
    }
    await sleep(1500);
  };

  // 桌面深色
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await goto();
  await ev("App.setTheme('dark', true); return 1");
  await sleep(400);
  await shot("desktop-dark-home");

  // 桌面浅色
  await ev("App.setTheme('light', true); return 1");
  await sleep(400);
  await shot("desktop-light-home");

  // 浅色题库
  await ev("App.goTab('codex'); return 1");
  await sleep(900);
  await shot("desktop-light-codex");

  // 移动端 375（深色）
  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await goto();
  await ev("App.setTheme('dark', true); return 1");
  await sleep(500);
  await shot("mobile-dark-home");

  await ev("document.querySelector('.install-strip') && document.querySelector('.install-strip').remove(); return 1");
  await ev("App.goTab('codex'); return 1");
  await sleep(900);
  await shot("mobile-dark-codex");

  await ev("document.querySelector('.prob-row').click(); return 1");
  await sleep(1100);
  await shot("mobile-dark-solve");

  await ev("App.goTab('profile'); return 1");
  await sleep(800);
  await shot("mobile-dark-profile");

  // 关闭
  try { await send("Browser.close"); } catch (e) {}
  chrome.kill(); srv.close();
})();
