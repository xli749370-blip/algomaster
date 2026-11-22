#!/usr/bin/env node
/** 线上可安装性诊断：node tools/diag.js [url] */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const URL = process.argv[2] || "https://algomaster.app.workbuddy.host/?sharecode=TMJWP6H5MQ";
const CDP_PORT = 9341;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find(p => fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const dir = path.join(os.tmpdir(), "am-diag-" + process.pid);
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + dir,
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
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => {
    const r = await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) return "EXCEPTION: " + JSON.stringify(r.result.exceptionDetails.exception && r.result.exceptionDetails.exception.description);
    return r.result && r.result.result && r.result.result.value;
  };

  const netFail = [];
  const wsMsgs = [];
  ws.addEventListener("message", e => {
    const m = JSON.parse(e.data);
    if (m.method === "Network.responseReceived") {
      const r = m.params.response;
      if (r.status >= 400) netFail.push(r.status + " " + r.url);
    }
    if (m.method === "Log.entryAdded") {
      const en = m.params.entry;
      if (en.level === "error") wsMsgs.push(en.text + " " + (en.url || ""));
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: URL });
  await sleep(6000);

  const state = await ev(`
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      href: location.href,
      sw: reg ? { scope: reg.scope, active: !!reg.active, state: reg.active && reg.active.state, script: reg.active && reg.active.scriptURL } : null,
      controlled: !!navigator.serviceWorker.controller,
      manifest: (document.querySelector('link[rel=manifest]')||{}).href,
      displayStandalone: matchMedia('(display-mode: standalone)').matches,
      icons: [...document.querySelectorAll('link[rel=icon],link[rel=apple-touch-icon]')].map(x => x.href),
      cssApplied: getComputedStyle(document.body).backgroundColor,
      appOk: typeof App !== 'undefined'
    };`);

  console.log("== 页面状态 ==");
  console.log(JSON.stringify(state, null, 2));

  const man = await send("Page.getAppManifest");
  console.log("\n== Manifest ==");
  console.log("url:", man.result && man.result.url);
  console.log("errors:", JSON.stringify(man.result && man.result.errors));
  console.log("parsed keys:", man.result && man.result.parsed ? Object.keys(man.result.parsed) : null);

  const inst = await send("Page.getInstallabilityErrors");
  console.log("\n== 可安装性错误 ==");
  console.log(JSON.stringify(inst.result, null, 2));

  console.log("\n== 失败请求 (>=400) ==");
  console.log(netFail.length ? [...new Set(netFail)].join("\n") : "无");
  console.log("\n== 控制台错误 ==");
  console.log(wsMsgs.length ? [...new Set(wsMsgs)].join("\n") : "无");

  try { await send("Browser.close"); } catch (e) {}
  chrome.kill();
})();
