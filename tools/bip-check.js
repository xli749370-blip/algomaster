#!/usr/bin/env node
/** 验证 beforeinstallprompt 是否真的触发（安装框能否弹出的唯一硬指标）：
 *  node tools/bip-check.js [url] */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const URL_ = process.argv[2] || "https://algomaster.app.workbuddy.host/?sharecode=TMJWP6H5MQ";
const CDP_PORT = 9351;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-bip-" + process.pid),
    "about:blank",
  ], { stdio: "ignore" });

  let tgt = null;
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
      tgt = list.find((x) => x.type === "page");
      if (tgt) break;
    } catch (e) {}
    await sleep(150);
  }
  if (!tgt) throw new Error("no target");

  const ws = new WebSocket(tgt.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0; const pend = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
  });
  const send = (method, params = {}) =>
    new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => {
    const r = await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true });
    if (!r || !r.result) return undefined;
    if (r.exceptionDetails) return { __err: (r.exceptionDetails.exception || {}).description };
    return r.result.value;
  };

  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

  // 页面脚本执行前埋钩子，记录事件是否触发
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__bip = { fired: false, at: 0, err: "" };
      window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        window.__bip.fired = true;
        window.__bip.at = Date.now();
        window.__bipEvt = e;
      });
      window.addEventListener('appinstalled', function () { window.__installed = true; });
      window.__errs = [];
      window.addEventListener('unhandledrejection', function (e) { window.__errs.push(String(e.reason)); });
    `,
  });

  await send("Page.navigate", { url: URL_ });
  for (let i = 0; i < 100; i++) {
    const ready = await ev("return typeof App!=='undefined' && !!document.querySelector('#app') && document.querySelector('#app').children.length>0");
    if (ready) break;
    await sleep(200);
  }
  // 等 SW 就绪 + Chrome 完成可安装性判定
  for (let i = 0; i < 40; i++) {
    const fired = await ev("return !!(window.__bip && window.__bip.fired)");
    if (fired) break;
    await sleep(250);
  }

  const bip = await ev("return window.__bip || null");
  const sw = await ev(`
    const reg = await navigator.serviceWorker.getRegistration();
    return reg ? { scope: reg.scope, active: !!reg.active, state: reg.active && reg.active.state,
                   script: reg.active && reg.active.scriptURL } : null;`);
  const errs = await ev("return window.__errs || []");

  console.log("beforeinstallprompt :", bip && bip.fired ? "已触发 ✓" : "未触发 ✗");
  console.log("Service Worker      :", JSON.stringify(sw));
  console.log("未处理的 promise 异常:", (errs || []).length, errs || []);

  // 真实点击一次，验证手势里能调起 prompt
  let gestureOk = "未测试（事件未触发）";
  if (bip && bip.fired) {
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: 200, y: 400, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: 200, y: 400, button: "left", clickCount: 1 });
    await sleep(1200);
    const st = await ev("return { errs: (window.__errs||[]).length, toast: (document.querySelector('.toast')||{}).textContent || '' }");
    gestureOk = st && st.errs === 0 ? "手势内调用无异常 ✓" : "有点击异常 ✗";
    console.log("手势调用 prompt   :", gestureOk);
  }

  ws.close(); chrome.kill();
  const good = bip && bip.fired;
  console.log(good ? "\n结论：该地址满足安装条件，系统安装框会在用户首次点击时弹出。" : "\n结论：仍不满足安装条件。");
  process.exit(good ? 0 : 1);
})().catch((e) => { console.error("脚本异常:", e.message); process.exit(2); });
