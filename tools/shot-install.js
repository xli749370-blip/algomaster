#!/usr/bin/env node
/** 首屏自动弹出安装选项 自检：node tools/shot-install.js → tools/shots/install-*.png */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "shots");
const PORT = 8990, CDP_PORT = 9353;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => fs.existsSync(p));

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png",
};
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

let pass = 0, fail = 0;
const eq = (a, b, m) => {
  if (String(a) === String(b)) { pass++; console.log("PASS ", m, "=", a); }
  else { fail++; console.log("FAIL ", m, "got", a, "want", b); }
};
const ok = (c, m) => { if (c) { pass++; console.log("PASS ", m); } else { fail++; console.log("FAIL ", m); } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-inst-" + process.pid),
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
  let id = 0; const pend = new Map(); const errs = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") {
      errs.push(m.params.exceptionDetails.text + " " + ((m.params.exceptionDetails.exception || {}).description || ""));
    }
  });
  const send = (method, params = {}) =>
    new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => {
    const r = await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true });
    if (!r || !r.result) return undefined;
    if (r.exceptionDetails) { errs.push((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return undefined; }
    return r.result.value;
  };
  const shot = async (name) => {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
    console.log("saved", name);
  };

  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }

  /* 1. 首屏后自动弹出 */
  await sleep(2600);
  const s1 = await ev(`
    const m = document.getElementById('modal');
    return {
      open: !!m && !m.classList.contains('hidden'),
      title: (document.getElementById('modalTitle')||{}).textContent || '',
      hasLogo: !!document.querySelector('.inst-logo'),
      perks: document.querySelectorAll('.inst-perks li').length,
      btns: [...document.querySelectorAll('#modalBody .modal-actions .btn')].map(b => b.textContent.trim()),
    };`);
  ok(s1 && s1.open, "打开链接后自动弹出安装选项");
  eq(s1 && s1.title, "安装到桌面", "弹层标题");
  ok(s1 && s1.hasLogo, "显示应用图标块");
  eq(s1 && s1.perks, 3, "三条安装价值说明");
  ok(s1 && s1.btns.length === 2, "两个操作按钮：" + (s1 && s1.btns.join(" / ")));
  await shot("install-auto");

  /* 2. 点「以后再说」→ 关闭且记录 */
  await ev(`
    const b = [...document.querySelectorAll('#modalBody .modal-actions .btn')].find(x => x.textContent.trim() === '以后再说');
    if (b) b.click();
    return 1;`);
  await sleep(400);
  ok(await ev("return document.getElementById('modal').classList.contains('hidden')"), "「以后再说」关闭弹层");
  ok(await ev("return !!localStorage.getItem('algomaster-install-hide')"), "记录了隐藏时间");

  /* 3. 刷新后 3 天内不再打扰 */
  await send("Page.reload");
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(2600);
  ok(await ev("return document.getElementById('modal').classList.contains('hidden')"), "3 天内不再自动弹出");

  /* 4. 首页安装入口条仍在（随时可装） */
  ok(await ev("return !!document.querySelector('.install-strip')"), "首页安装入口条保持可见");

  /* 5. 清掉隐藏记录后，从非首页进入不应弹 */
  await ev("localStorage.removeItem('algomaster-install-hide'); return 1");
  await ev("App.goTab('codex'); return 1");
  await sleep(300);
  await send("Page.reload");
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(2600);
  eq(await ev("return (window.App.state.page||'')"), "home", "刷新后回到首页");
  ok(await ev("return !document.getElementById('modal').classList.contains('hidden')"), "首页仍会自动弹出");

  /* 6. 微信内：文案改为复制链接 */
  await ev("localStorage.removeItem('algomaster-install-hide'); return 1");
  await send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (Linux; Android 13; PDEM30) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.42.2460(0x28002A3B) WeChat/arm64 Weixin NetType/WIFI",
  });
  await send("Page.reload");
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(2600);
  const s2 = await ev(`
    return {
      open: !document.getElementById('modal').classList.contains('hidden'),
      title: (document.getElementById('modalTitle')||{}).textContent || '',
      btn: ([...document.querySelectorAll('#modalBody .modal-actions .btn')].pop()||{}).textContent || ''
    };`);
  ok(s2 && s2.open, "微信内同样弹出");
  eq(s2 && s2.title, "在浏览器打开即可安装", "微信内标题");
  ok(s2 && /复制链接/.test(s2.btn), "微信内主按钮为复制链接：「" + (s2 && s2.btn.trim()) + "」");
  await shot("install-wechat");

  /* 7. 独立窗口模式下不应再提示 */
  const r7 = await ev(`
    App.closeModalForce();
    localStorage.removeItem('algomaster-install-hide');
    const orig = App.detectEnv;
    App.detectEnv = function () { return Object.assign(orig.call(this), { standalone: true }); };
    const ret = App.autoInstallPrompt();
    App.detectEnv = orig;
    return { ret: ret, open: !document.getElementById('modal').classList.contains('hidden') };`);
  ok(r7 && r7.ret === false, "已是 App 模式时直接跳过");
  ok(r7 && r7.open === false, "App 模式下不弹安装选项");

  /* 8. 3 天内隐藏逻辑对自动弹层生效 */
  const r8 = await ev(`
    App.closeModalForce();
    localStorage.setItem('algomaster-install-hide', String(Date.now()));
    const ret = App.autoInstallPrompt();
    localStorage.removeItem('algomaster-install-hide');
    return { ret: ret, open: !document.getElementById('modal').classList.contains('hidden') };`);
  ok(r8 && r8.ret === false, "3 天内已隐藏则跳过");

  eq(errs.length, 0, "运行时异常数");
  if (errs.length) errs.forEach((e, i) => console.log("  err[" + i + "]", String(e).slice(0, 300)));

  console.log(`\n合计 ${pass} PASS / ${fail} FAIL`);
  ws.close(); chrome.kill(); srv.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("脚本异常:", e); process.exit(2); });
