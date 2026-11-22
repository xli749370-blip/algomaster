#!/usr/bin/env node
/** 线上验证：node tools/online-check.js [url]
 *  检查真机视口下的布局（App Shell）、附加说明是否已移除、vivo 场景的安装引导文案
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const URL = process.argv[2] || "https://algomaster.app.workbuddy.host/?sharecode=TMJWP6H5MQ";
const CDP_PORT = 9342;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find(p => fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));

let fails = 0;
const ok = (n, c, extra) => { if (c) console.log("PASS  " + n + (extra ? "  " + extra : "")); else { fails++; console.log("FAIL  " + n + (extra ? "  " + extra : "")); } };

(async () => {
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-online-" + process.pid),
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
  const errors = [];
  ws.addEventListener("message", e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); return; }
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.text);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
      errors.push((m.params.args || []).map(a => a.value || a.description || "").join(" "));
    }
  });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => (await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true })).result.value;
  await send("Page.enable"); await send("Runtime.enable");

  const goto = async () => {
    await send("Page.navigate", { url: URL });
    for (let i = 0; i < 80; i++) {
      const okk = await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length");
      if (okk) break;
      await sleep(200);
    }
    await sleep(2200);
  };

  const VIVO_UA = "Mozilla/5.0 (Linux; Android 14; V2309A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 VivoBrowser/19.3.0.0";

  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setUserAgentOverride", { userAgent: VIVO_UA, platform: "Linux armv8l" });
  await goto();

  const m = await ev(`
    const de = document.documentElement, app = document.getElementById('app');
    const nav = document.getElementById('mainNav'), nr = nav.getBoundingClientRect();
    const txt = document.body.innerText;
    return {
      docScrollable: de.scrollHeight > de.clientHeight + 1,
      navParent: nav.parentNode.id, navBottom: Math.round(nr.bottom), vh: window.innerHeight,
      footerGone: txt.indexOf('数据保存在本地浏览器') < 0,
      noteGone: txt.indexOf('常规赛程规律') < 0,
      appScroll: app.scrollHeight > app.clientHeight,
      cnn: App.detectEnv().cnn,
      modalOpen: !document.getElementById('modal').classList.contains('hidden'),
      modalTitle: document.getElementById('modalTitle').innerText,
      modalText: document.getElementById('modalBody').innerText.replace(/\\s+/g, ' ').slice(0, 160),
      swVersion: null
    };`);

  ok("线上：页面本身不可滚动（不再滚出空白）", m.docScrollable === false, `vh=${m.vh}`);
  ok("线上：底部导航在布局内且贴底", m.navParent === "navSlot" && Math.abs(m.navBottom - m.vh) <= 2, `bottom=${m.navBottom}`);
  ok("线上：内容区独立滚动", m.appScroll === true);
  ok("线上：页脚附加说明已移除", m.footerGone === true);
  ok("线上：赛程脚注已移除", m.noteGone === true);
  ok("线上：识别 vivo 浏览器", m.cnn === "vivo");
  ok("线上：首屏弹出安装层", m.modalOpen === true, m.modalTitle);

  /* 关键：国产浏览器里我们不再 preventDefault，浏览器自己的安装提示才有机会出现。
     线上必须确认 nativeReady=true（放行）且 canPrompt=false（没拦截）。 */
  const nat = await ev("return { nativeReady: AMInstall.nativeReady(), canPrompt: AMInstall.canPrompt() };");
  ok("线上：vivo 下放行浏览器原生安装提示", nat.nativeReady === true && nat.canPrompt === false,
    `nativeReady=${nat.nativeReady} canPrompt=${nat.canPrompt}`);
  ok("线上：默认浏览器路径文案（安装应用 / 添加到桌面）", /安装应用|添加到桌面/.test(m.modalText), m.modalText.slice(-70));
  await new Promise(r => setTimeout(r, 500));
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(__dirname, "shots", "online-vivo.png"), Buffer.from(r.data, "base64"));

  // 图文引导 + APK 下载路径（线上必须真的能下到 .apk）
  const gd = await ev(`App.closeModalForce();
    let clicked = null;
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { clicked = this.getAttribute('href'); };
    App.installNow();
    HTMLAnchorElement.prototype.click = orig;
    await new Promise(r=>setTimeout(r,200));
    const g = (App.openInstallGuide(), document.getElementById('modalBody'));
    const out = { url: location.href, clicked, shot: !!g.querySelector('.guide-shot'),
                  hasApk: !!g.querySelector('.apk-btn') };
    return out;`);
  ok("线上：安卓「下载 App」指向真实安装包", !!gd.clicked && /\/download\/algomaster\.apk/.test(gd.clicked), String(gd.clicked));
  ok("线上：安装引导里有下载按钮", gd.hasApk === true);
  ok("线上：引导含菜单位置图示", gd.shot === true);
  const apkRes = await (await fetch(gd.clicked.replace(/^http/, "http"))).status;
  ok("线上：安装包可直接下载", apkRes === 200, `HTTP ${apkRes}`);
  await ev("App.closeModalForce(); return 1");

  // 关掉弹层后滚到底，确认没有空白
  await ev("App.closeModalForce(); const a=document.getElementById('app'); a.scrollTop=a.scrollHeight; return 1");
  await sleep(500);
  const b = await ev(`
    const nav = document.getElementById('mainNav').getBoundingClientRect();
    return { navBottom: Math.round(nav.bottom), vh: window.innerHeight,
             docScrollable: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1 };`);
  ok("线上：滚到底导航不位移", Math.abs(b.navBottom - b.vh) <= 2, `bottom=${b.navBottom}`);
  ok("线上：滚到底无页面空白", b.docScrollable === false);
  const r2 = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(__dirname, "shots", "online-vivo-bottom.png"), Buffer.from(r2.data, "base64"));

  ok("线上：控制台无异常", errors.length === 0, errors.slice(0, 2).join(" | "));

  // 退出：确认后必须真的离开页面
  await send("Page.navigate", { url: "about:blank" });
  await sleep(400);
  await goto();
  const beforeExit = await ev("return location.href");
  await ev("App.confirmExit(); App.exitApp(); return 1");
  await sleep(1300);
  const afterExit = await ev("return location.href");
  ok("线上：确认退出后真的离开页面", afterExit !== beforeExit, `${afterExit}`);

  try { await send("Browser.close"); } catch (e) {}
  chrome.kill();
  console.log(fails === 0 ? "\nONLINE CHECKS PASSED" : `\n${fails} ONLINE CHECK(S) FAILED`);
  process.exit(fails === 0 ? 0 : 1);
})();
