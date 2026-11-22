/** 视觉巡检截图：node tools/look.js  → tools/shots/look-*.png */
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { spawn } = require("child_process");
const ROOT = path.resolve(__dirname, "..");
const PORT = 8996, CDP_PORT = 9350;
const CHROME = ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(p => fs.existsSync(p));
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png" };
const srv = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  const f = path.join(ROOT, u === "/" ? "index.html" : u);
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); res.end(b); });
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  fs.mkdirSync(path.join(__dirname, "shots"), { recursive: true });
  await new Promise(r => srv.listen(PORT, "127.0.0.1", r));
  const dir = path.join(os.tmpdir(), "am-look-" + process.pid);
  const ch = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--remote-debugging-port=" + CDP_PORT, "--user-data-dir=" + dir, "about:blank"], { stdio: "ignore" });
  let t = null;
  for (let i = 0; i < 100; i++) { try { const l = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json(); t = l.find(x => x.type === "page"); if (t) break; } catch {} await sleep(150); }
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const pend = new Map();
  ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result || {}); pend.delete(m.id); } });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) return { __err: JSON.stringify(r.exceptionDetails).slice(0, 300) }; return r.result ? r.result.value : undefined; };
  const shot = async n => { const r = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(__dirname, "shots", n + ".png"), Buffer.from(r.data, "base64")); };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: process.env.ONLINE || `http://127.0.0.1:${PORT}/index.html` });
  await sleep(2400);

  const jobs = [
    ["home-dark", "App.setTheme('dark',true); App.goTab('home');", 900],
    ["home-light", "App.setTheme('light',true); App.goTab('home');", 900],
    ["home-2-light", "App.goTab('home');", 600],
    ["algo-list-dark", "App.setTheme('dark',true); App.goTab('algo');", 500],
    ["algo-list-light", "App.setTheme('light',true); App.goTab('algo');", 500],
    ["algo-detail-dark", "App.nav('algo-detail',0);", 700],
    ["algo-detail-light", "App.setTheme('light',true); App.nav('algo-detail',0);", 700],
    ["algo-detail2-light", "App.nav('algo-detail',3);", 700],
    ["algo-dp-light", "App.nav('algo-detail',8);", 900],
    ["algo-graph-dark", "App.setTheme('dark',true); App.nav('algo-detail',13);", 900],
    ["lesson-dark", "App.setTheme('dark',true); App.nav('lesson',['cpp',0]);", 1200],
    ["lesson-cpp1", "App.nav('lesson',['cpp',0]); await new Promise(r=>setTimeout(r,900)); App.jumpSec('sec-0-1');", 1400],
    ["lesson-cpp-p", "App.nav('lesson',['cpp',5]); await new Promise(r=>setTimeout(r,900)); App.jumpSec('sec-5-0');", 1400],
    ["lesson-cpp5", "App.nav('lesson',['cpp',5]);", 1300],
    ["lesson-py3", "App.setTheme('light',true); App.nav('lesson',['py',3]);", 1300],
    ["lesson-c3", "App.nav('lesson',['c',3]);", 1300],
    ["algo-sort-light", "App.setTheme('light',true); App.nav('algo-detail',1); await new Promise(r=>setTimeout(r,700)); App.jumpSec('alg-0');", 1300],
    ["algo-dp2-light", "App.nav('algo-detail',8); await new Promise(r=>setTimeout(r,700)); App.jumpSec('alg-1');", 1300],
    ["codex-dark", "App.setTheme('dark',true); App.goTab('codex');", 1200],
    ["solve-dark", "App.openSolve('G00001');", 1600],
    ["checkin-dark", "App.setTheme('dark',true); App.nav('checkin');", 900],
    ["profile-light", "App.setTheme('light',true); App.goTab('profile');", 1200],
    ["profile-ach-dark", "App.setTheme('dark',true); App.goTab('profile');", 1200],
    ["courses-light", "App.setTheme('light',true); App.goTab('courses');", 900],
    ["course-detail-dark", "App.setTheme('dark',true); App.nav('course-detail','cpp');", 900],
    ["interview-light", "App.setTheme('light',true); App.nav('interview');", 1400],
    ["codex-light", "App.setTheme('light',true); App.goTab('codex');", 1400],
    ["solve-light", "App.setTheme('light',true); App.openSolve('G00001');", 1700],
  ];
  // 长页分段：滚动到指定位置再截
  const scrollJobs = [
    ["home-3-dark", "App.setTheme('dark',true); App.goTab('home');", 900, 640],
    ["home-4-dark", "App.goTab('home');", 500, 1200],
    ["profile-2-light", "App.setTheme('light',true); App.goTab('profile');", 900, 900],
    ["profile-3-light", "App.goTab('profile');", 600, 1750],
    ["codex-2-dark", "App.setTheme('dark',true); App.goTab('codex');", 900, 700],
    ["algo-detail-2-dark", "App.setTheme('dark',true); App.nav('algo-detail',2);", 900, 1100],
    ["interview-detail-light", "App.setTheme('light',true); App.nav('interview'); await new Promise(r=>setTimeout(r,1000)); App.openIv('iv-1');", 1200, 0],
    ["solve-2-dark", "App.setTheme('dark',true); App.openSolve('G00001');", 1600, 640],
  ];
  for (const [n, code, wait, top] of scrollJobs) {
    const r = await ev(code + ` await new Promise(r=>setTimeout(r,${wait}));
      document.getElementById('app').scrollTop = ${top}; return what;` .replace('what', 'App.state.page'));
    await sleep(500);
    await shot("look-" + n);
    console.log(n, "->", r);
  }

  for (const [n, code, wait] of jobs) {
    const r = await ev(code + ` await new Promise(r=>setTimeout(r,${wait})); return App.state.page;`);
    await shot("look-" + n);
    console.log(n, "->", r);
  }
  ch.kill(); srv.close(); process.exit(0);
})();
