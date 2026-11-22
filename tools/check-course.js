#!/usr/bin/env node
/** 课程内容回归：逐章打开，校验正文/微课/表格/代码块/锚点跳转
 *  node tools/check-course.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "shots");
const PORT = 8983, CDP_PORT = 9341;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => fs.existsSync(p));

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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0;
const ok = (n, c, extra) => { if (c) console.log("PASS  " + n + (extra ? "  " + extra : "")); else { fails++; console.log("FAIL  " + n + (extra ? "  " + extra : "")); } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-course-" + process.pid),
    "about:blank",
  ], { stdio: "ignore" });

  const tgt = await (async () => {
    for (let i = 0; i < 80; i++) {
      try {
        const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
        const t = list.find((x) => x.type === "page");
        if (t) return t;
      } catch (e) {}
      await sleep(150);
    }
    throw new Error("no target");
  })();

  const ws = new WebSocket(tgt.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0; const pend = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => (await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true })).result.value;
  const shot = async (name) => {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
  };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });

  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
  for (let i = 0; i < 80; i++) {
    const okk = await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length");
    if (okk) break;
    await sleep(150);
  }
  await sleep(600);
  await ev("App.closeModalForce && App.closeModalForce(); return 1");

  const CI = await ev("return window.COURSE_INDEX ? {order:COURSE_INDEX.order, langs:Object.keys(COURSE_INDEX.langs)} : null");
  ok("课程目录已加载", !!CI && CI.order.length >= 4, CI ? CI.order.join(",") : "null");

  const langs = CI ? CI.order : [];
  let totalCh = 0, totalMic = 0, emptyCh = [];

  for (const lang of langs) {
    const detail = await ev(`
      App.goTab('courses');
      App.nav('course-detail', ${JSON.stringify(lang)});
      await new Promise(r => setTimeout(r, 260));
      const c = COURSE_INDEX.langs[${JSON.stringify(lang)}];
      return { n: c.chapters.length, html: document.getElementById('app').innerText.length,
               rows: document.querySelectorAll('#app .row').length };`);
    ok(`[${lang}] 章节目录渲染`, detail.n > 0 && detail.rows === detail.n, `${detail.n} 章 / ${detail.rows} 行`);

    for (let i = 0; i < detail.n; i++) {
      const r = await ev(`
        App.nav('lesson', [${JSON.stringify(lang)}, ${i}]);
        for (let k = 0; k < 40; k++) {
          if (document.querySelector('.lesson-body')) break;
          await new Promise(r => setTimeout(r, 120));
        }
        const body = document.querySelector('.lesson-body');
        const html = body ? body.innerHTML : '';
        return {
          has: !!body,
          len: html.length,
          mic: document.querySelectorAll('.mic').length,
          tables: document.querySelectorAll('.lesson-body table').length,
          codes: document.querySelectorAll('.lesson-body pre code').length,
          toc: document.querySelectorAll('.toc-item').length,
          bad: /\\[object Object\\]|>undefined<|>NaN<|undefined 节/.test(html),
          scrollW: document.getElementById('app').scrollWidth - document.getElementById('app').clientWidth,
          title: (document.querySelector('.ch-title') || {}).textContent || ''
        };`);
      totalCh++;
      totalMic += r.mic;
      const good = r.has && r.len > 2000 && r.mic >= 1 && r.codes >= 1 && !r.bad && r.scrollW <= 1;
      if (!good) emptyCh.push(`${lang}#${i + 1} len=${r.len} mic=${r.mic} code=${r.codes} bad=${r.bad} dx=${r.scrollW}`);
    }
  }
  ok("全部章节正文完整（微课 + 代码 + 无溢出）", emptyCh.length === 0, emptyCh.length ? emptyCh.slice(0, 5).join(" | ") : `${totalCh} 章 / ${totalMic} 节微课`);

  // 锚点跳转
  const jump = await ev(`
    App.nav('lesson', ['cpp', 0]);
    for (let k = 0; k < 40; k++) { if (document.querySelector('.toc-item')) break; await new Promise(r => setTimeout(r, 120)); }
    const app = document.getElementById('app');
    app.scrollTop = 0;
    const btn = document.querySelectorAll('.toc-item')[2];
    if (!btn) return { ok: false };
    btn.click();
    await new Promise(r => setTimeout(r, 700));
    return { ok: true, top: Math.round(app.scrollTop), secTop: Math.round(document.getElementById('sec-0-2').getBoundingClientRect().top) };`);
  ok("章内目录可跳转", jump.ok && jump.top > 200, `scrollTop=${jump.top} secTop=${jump.secTop}`);

  // 标记已学 + 进度
  const mk = await ev(`
    App.nav('lesson', ['cpp', 0]);
    await new Promise(r => setTimeout(r, 300));
    const btn = [...document.querySelectorAll('.ch-nav .btn')].find(b => /标记本章已学/.test(b.textContent));
    if (!btn) return { ok: false };
    btn.click();
    await new Promise(r => setTimeout(r, 300));
    return { ok: !!App.store.lessonsDone['cpp-0'], label: document.querySelector('.ch-nav .btn-primary, .ch-nav .btn-ghost').textContent.trim() };`);
  ok("标记本章已学生效", mk.ok === true, JSON.stringify(mk));
  await ev("App.store.lessonsDone['cpp-0']=false; App.saveStore(); App.render(); return 1");

  // 截图：深色 / 浅色 各一张
  await ev("App.setTheme('dark', true); return 1");
  await ev("App.nav('lesson', ['cpp', 0]); return 1");
  await sleep(500);
  await shot("course-chapter-dark");
  await ev("App.jumpSec('sec-0-1'); return 1");
  await sleep(900);
  await shot("course-mid-dark");
  await ev("App.setTheme('light', true); return 1");
  await sleep(400);
  await shot("course-chapter-light");
  await ev("App.scrollTo(0); return 1");

  console.log(`\n章节总数 ${totalCh}，微课总数 ${totalMic}`);
  console.log("FAIL 数量: " + fails);
  chrome.kill();
  srv.close();
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
