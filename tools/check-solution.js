#!/usr/bin/env node
/**
 * 题解专项检查
 *  1) 静态：分片数量、总体积、每片能否解析、题解覆盖率
 *  2) 交互：真实浏览器里打开题目 → 切「题解」→ 校验内容与结构 → 切回题目不丢
 *  node tools/check-solution.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");
const PORT = 8986, CDP = 9352;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find(p => fs.existsSync(p));

let fails = 0;
const ok = (n, c, extra) => { if (c) console.log("PASS  " + n + (extra ? "  " + extra : "")); else { fails++; console.log("FAIL  " + n + (extra ? "  " + extra : "")); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

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

(async () => {
  /* ---------- 1. 静态检查 ---------- */
  const solFiles = fs.readdirSync(DATA).filter(f => /^sol-\d+\.js$/.test(f));
  const probFiles = fs.readdirSync(DATA).filter(f => /^problems-\d+\.js$/.test(f));
  ok("[静态] 题解分片与题库分片一一对应", solFiles.length === probFiles.length, `${solFiles.length}/${probFiles.length}`);

  let bytes = 0, count = 0, parseErr = 0, emptyHtml = 0;
  const sampleIds = [];
  for (const f of solFiles) {
    const src = fs.readFileSync(path.join(DATA, f), "utf8");
    bytes += Buffer.byteLength(src);
    const ctx = { window: {} };
    vm.createContext(ctx);
    try {
      vm.runInContext(src, ctx);
      const shard = ctx.window.SOL_SHARDS;
      for (const k of Object.keys(shard)) {
        for (const id of Object.keys(shard[k])) {
          count++;
          const h = shard[k][id];
          if (!h || h.length < 400) emptyHtml++;
          if (sampleIds.length < 1) sampleIds.push(id);
        }
      }
    } catch (e) { parseErr++; }
  }
  const mb = bytes / 1024 / 1024;
  ok("[静态] 题解总量 ≥ 50MB", mb >= 50, mb.toFixed(1) + "MB");
  ok("[静态] 全部题解分片可解析", parseErr === 0, `解析失败 ${parseErr} 个`);
  ok("[静态] 每题都有实质题解（≥400 字符）", emptyHtml === 0, `过短 ${emptyHtml} 条`);
  ok("[静态] 题解数量与题目数量一致", count === 27933, `${count} 条`);

  /* ---------- 2. 浏览器交互 ---------- */
  await new Promise(r => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-sol-" + process.pid),
    "about:blank",
  ], { stdio: "ignore" });

  const tgt = await (async () => {
    for (let i = 0; i < 80; i++) {
      try {
        const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
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
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
  for (let i = 0; i < 60; i++) {
    const ready = await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length");
    if (ready) break;
    await sleep(150);
  }
  await sleep(600);

  const r1 = await ev(`try {
    if (App.ensureIndex) await App.ensureIndex();
    if (!window.PROBLEM_INDEX) return { err: 'index missing' };
    App.openSolve('G00001');
    await new Promise(r => setTimeout(r, 1500));
    App.switchSolveTab('sol');
    await new Promise(r => setTimeout(r, 1300));
    const b = document.getElementById('solBody');
    const t = (b && b.innerText) || '';
    const act = document.querySelector('.solve-tabs button.active');
    return {
      page: App.state.page,
      hasHead: /数组求和/.test(t),
      blocks: ['看到什么就用这招','思路拆解','参考实现','复杂度','容易踩的坑','延伸与变体'].filter(k => t.indexOf(k) >= 0).length,
      hasCode: !!(b && b.querySelector('pre.sol-code code')),
      hasPy: /Python/.test(t),
      len: t.length,
      active: act ? act.getAttribute('data-tab') : ''
    };
  } catch (e) { return { err: e.message }; }`);
  ok("[交互] 进入做题页并切到题解", r1.page === "solve" && r1.len > 200, `len=${r1.len}`);
  ok("[交互] 题解六个板块齐全", r1.blocks === 6, `命中 ${r1.blocks}/6`);
  ok("[交互] 题型名正确（数组求和）", r1.hasHead === true);
  ok("[交互] 含可读参考代码与 Python 对照", r1.hasCode === true && r1.hasPy === true);
  ok("[交互] Tab 激活态切到 sol", r1.active === "sol", r1.active);

  const r2 = await ev(`App.switchSolveTab('problem'); await new Promise(r => setTimeout(r, 200));
    App.switchSolveTab('code'); await new Promise(r => setTimeout(r, 400));
    return { problemStill: App.state.page === 'solve',
             active: document.querySelector('.solve-tabs button.active').dataset.tab,
             editor: !!document.getElementById('codeInput') };`);
  ok("[交互] 切回题目/代码正常", r2.problemStill && r2.active === "code" && r2.editor === true);

  // 换一道不同题型的题，题解内容必须跟着变
  const r3 = await ev(`if (App.ensureIndex) await App.ensureIndex();
    App.openSolve('G01235');
    await new Promise(r => setTimeout(r, 1500));
    App.switchSolveTab('sol');
    await new Promise(r => setTimeout(r, 1200));
    const t = document.getElementById('solBody').innerText || '';
    return { len: t.length, hasBadge: /贪心/.test(t), cached: !!App.solHtml };`);
  ok("[交互] 换题后题解跟随切换", r3.len > 200 && r3.hasBadge === true, `len=${r3.len}`);

  try { await send("Browser.close"); } catch (e) {}
  chrome.kill(); srv.close();
  console.log(fails === 0 ? "\nALL SOLUTION CHECKS PASSED" : `\n${fails} CHECK(S) FAILED`);
  process.exit(fails === 0 ? 0 : 1);
})();
