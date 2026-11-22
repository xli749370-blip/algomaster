#!/usr/bin/env node
/** 布局回归：验证 App Shell（body 定高 + main 内滚 + 导航固定）
 *  node tools/layout-check.js
 *  检查：页面不可滚出空白 / 导航贴在视口底部 / 各尺寸无横向溢出 / vivo 文案
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "shots");
const PORT = 8979, CDP_PORT = 9335;
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

let fails = 0;
const ok = (n, c, extra) => { if (c) console.log("PASS  " + n + (extra ? "  " + extra : "")); else { fails++; console.log("FAIL  " + n + (extra ? "  " + extra : "")); } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-layout-" + process.pid),
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
  await send("Page.enable"); await send("Runtime.enable");

  const shot = async name => {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
  };

  const goto = async () => {
    await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
    for (let i = 0; i < 60; i++) {
      const okk = await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length");
      if (okk) break;
      await sleep(150);
    }
    await sleep(700);
  };

  const sizes = [
    { w: 390, h: 844, name: "iphone14" },
    { w: 360, h: 640, name: "small-android" },
    { w: 412, h: 915, name: "pixel" },
  ];

  for (const s of sizes) {
    await send("Emulation.setDeviceMetricsOverride", { width: s.w, height: s.h, deviceScaleFactor: 1, mobile: true });
    await goto();
    await ev("App.setTheme('light', true); return 1");
    await sleep(350);
    // 关掉首屏安装弹层，避免影响测量
    await ev("App.closeModalForce && App.closeModalForce(); return 1");

    const m0 = await ev(`
      const de = document.documentElement;
      const app = document.getElementById('app');
      const nav = document.getElementById('mainNav');
      const nr = nav.getBoundingClientRect();
      return {
        docScroll: de.scrollHeight, innerH: window.innerHeight,
        bodyScroll: document.body.scrollHeight,
        appScroll: app.scrollHeight, appClient: app.clientHeight, appTop: app.getBoundingClientRect().top,
        navTop: Math.round(nr.top), navBottom: Math.round(nr.bottom), navParent: nav.parentNode.id || nav.parentNode.className,
        docOverflowX: de.scrollWidth - de.clientWidth,
        canScrollDoc: de.scrollHeight > de.clientHeight + 1
      };`);

    ok(`[${s.name}] 页面本身不可滚动（无空白区）`, m0.canScrollDoc === false, `doc=${m0.docScroll} vh=${m0.innerH}`);
    ok(`[${s.name}] 导航贴住视口底部`, Math.abs(m0.navBottom - s.h) <= 1, `bottom=${m0.navBottom} vh=${s.h}`);
    ok(`[${s.name}] 导航在底部插槽内`, m0.navParent === "navSlot", `parent=${m0.navParent}`);
    ok(`[${s.name}] 内容区可独立滚动`, m0.appScroll > m0.appClient, `scroll=${m0.appScroll} client=${m0.appClient}`);
    ok(`[${s.name}] 无横向溢出`, m0.docOverflowX <= 0, `dx=${m0.docOverflowX}`);

    // 滚到底：导航必须还在原位，且页面不出现空白
    const m1 = await ev(`
      const app = document.getElementById('app');
      app.scrollTop = app.scrollHeight;
      await new Promise(r => setTimeout(r, 260));
      const nav = document.getElementById('mainNav').getBoundingClientRect();
      const de = document.documentElement;
      return { navBottom: Math.round(nav.bottom), canScrollDoc: de.scrollHeight > de.clientHeight + 1, atBottom: Math.round(app.scrollTop + app.clientHeight) >= app.scrollHeight - 2 };`);
    ok(`[${s.name}] 滚到底导航不位移`, Math.abs(m1.navBottom - s.h) <= 1, `bottom=${m1.navBottom}`);
    ok(`[${s.name}] 滚到底不出现页面空白`, m1.canScrollDoc === false);
    await shot(`layout-${s.name}-bottom`);

    // 赛程区域（首页底部）截图，确认附加说明已移除
    const hasNote = await ev("return document.getElementById('app').innerText.indexOf('常规赛程规律') >= 0");
    ok(`[${s.name}] 赛程脚注已移除`, hasNote === false);
  }

  // 桌面：导航回到顶栏
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await goto();
  await ev("App.closeModalForce && App.closeModalForce(); return 1");
  const desk = await ev(`
    const nav = document.getElementById('mainNav');
    return { parent: nav.parentNode.className, pos: getComputedStyle(nav).position,
             canScrollDoc: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1 };`);
  ok("[desktop] 导航回到顶栏", /topbar-inner/.test(desk.parent), `parent=${desk.parent}`);
  ok("[desktop] 页面不可滚动", desk.canScrollDoc === false);
  await shot("layout-desktop");

  // 退出：点「确认退出」必须真的离开页面，而不是停在原地
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Page.navigate", { url: "about:blank" });
  await sleep(400);
  await goto();
  const beforeHref = await ev("return location.href");
  const exitRes = await ev("App.confirmExit(); App.exitApp(); return true;");
  await sleep(1200);
  const afterHref = await ev("return location.href");
  ok("[exit] 确认退出后真的离开了页面", afterHref !== beforeHref, `${beforeHref} → ${afterHref}`);

  // vivo 浏览器：文案
  await send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (Linux; Android 14; V2309A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 VivoBrowser/19.3.0.0",
    platform: "Linux armv8l",
  });
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await goto();
  await ev("localStorage.removeItem('algomaster-install-hide'); return 1");
  const cn = await ev("const e=App.detectEnv(); App.autoInstallPrompt(); return { cnn: e.cnn, text: document.getElementById('modalBody').innerText.slice(0,120), title: document.getElementById('modalTitle').innerText };");
  ok("[vivo] 识别为国产浏览器", cn.cnn === "vivo", `cnn=${cn.cnn}`);
  ok("[vivo] 弹层首推下载 APK（不依赖浏览器菜单）", /下载/.test(cn.text) && /安装/.test(cn.text), cn.text.slice(0, 70));
  await shot("layout-vivo-install");

  // 步骤引导：默认浏览器里必须能独立走通（不依赖 Chrome）
  await ev("App.openInstallGuide(); return 1");
  await sleep(400);
  const gd = await ev(`const b=document.getElementById('modalBody');
    return { hasShot: !!b.querySelector('.guide-shot'), hasMenuTip: /点这里/.test(b.innerText),
             text: b.innerText.replace(/\\s+/g,' ').slice(0,120) };`);
  ok("[vivo] 引导里有菜单位置图示", gd.hasShot && gd.hasMenuTip);
  ok("[vivo] 引导里同时给出「下载」与「菜单安装」两条路", /下载/.test(gd.text) && /安装应用|添加到桌面/.test(gd.text), gd.text.slice(0, 70));
  await shot("layout-vivo-guide");

  // 点「一键安装」不应跳走浏览器，而是留在本页给步骤
  // （测试环境里 Chrome 会触发 beforeinstallprompt，这里强制模拟「浏览器不支持自动安装」）
  const stay = await ev(`App.closeModalForce();
    let clicked = null;
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { clicked = this.getAttribute('href'); };
    App.installNow();
    HTMLAnchorElement.prototype.click = orig;
    await new Promise(r=>setTimeout(r,200));
    return { url: location.href, clicked, modal: !document.getElementById('modal').classList.contains('hidden') };`);
  ok("[vivo] 安卓点「下载 App」直接下载安装包", !!stay.clicked && /\.apk/.test(stay.clicked), String(stay.clicked));
  ok("[vivo] 下载不跳走浏览器（停在当前页）", /127\.0\.0\.1/.test(stay.url) && stay.modal === false);

  // 安装包里必须真有 dex，且能被浏览器下载到
  const apkPath = require('path').join(ROOT, 'download', 'algomaster.apk');
  const apkOk = require('fs').existsSync(apkPath) && require('fs').statSync(apkPath).size > 5000;
  ok("[apk] 站点里存在可下载的安装包", apkOk, apkPath);

  /* 关键回归：国产浏览器里绝不能 preventDefault —— 一旦拦截，浏览器自带的
     「安装 / 添加到桌面」提示就永远不出现，而它们的 prompt() 又常被忽略，
     用户就彻底没有安装入口（只能被迫去 Chrome）。 */
  await ev("App.closeModalForce(); return 1");
  const cnPrompt = await ev("return { canPrompt: AMInstall.canPrompt(), nativeReady: AMInstall.nativeReady() };");
  ok("[vivo] 放行浏览器原生安装提示（不拦截事件）",
    cnPrompt.nativeReady === true && cnPrompt.canPrompt === false,
    `nativeReady=${cnPrompt.nativeReady} canPrompt=${cnPrompt.canPrompt}`);
  const cnModalText = await ev(`localStorage.removeItem('algomaster-install-hide');
    App.autoInstallPrompt();
    return document.getElementById('modalBody').innerText.replace(/\\s+/g,' ');`);
  ok("[vivo] 弹层说明下载后点开文件安装", /下载|安装/.test(cnModalText), cnModalText.slice(0, 80));
  await ev("App.closeModalForce(); return 1");

  // Chrome 安卓：仍由我们接管（拦截事件 + 手势内调起系统安装框）
  await send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    platform: "Linux armv8l",
  });
  await goto();
  await sleep(1200);
  const chPrompt = await ev("return { canPrompt: AMInstall.canPrompt(), nativeReady: AMInstall.nativeReady() };");
  ok("[chrome] 保留主动调起系统安装框的能力",
    chPrompt.canPrompt === true && chPrompt.nativeReady === false,
    `canPrompt=${chPrompt.canPrompt} nativeReady=${chPrompt.nativeReady}`);

  /* ===== APK 壳模式 =====
     壳通过 addJavascriptInterface 暴露 AndroidShell。期望行为：
     返回键完全由网页页面栈决定；确认退出交给原生回桌面；已装成 App 就不再劝安装。 */
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: "window.AndroidShell={isShell:function(){return true;},exitApp:function(){window.__shellExit=true;}};",
  });
  await goto();
  await sleep(1500);   // 跨过首屏自动安装弹层的触发时机

  const shell = await ev(`return {
    inShell: App.inShell(),
    strip: !!document.querySelector('.install-strip'),
    barHidden: document.getElementById('installBar').classList.contains('hidden'),
    modalOpen: !document.getElementById('modal').classList.contains('hidden'),
    canBack: App.canGoBack()
  };`);
  ok("[apk壳] 识别为壳内运行", shell.inShell === true);
  ok("[apk壳] 首页不再出现安装入口条", shell.strip === false);
  ok("[apk壳] 不再弹安装引导 / 底部安装条", shell.modalOpen === false && shell.barHidden === true,
    `modal=${shell.modalOpen} barHidden=${shell.barHidden}`);
  ok("[apk壳] 首页不显示返回箭头", shell.canBack === false);

  const back1 = await ev(`App.nav('codex'); await new Promise(r=>setTimeout(r,500));
    const before = App.state.page;
    const ret = App.hardwareBack();
    await new Promise(r=>setTimeout(r,500));
    return { before: before, ret: ret, after: App.state.page };`);
  ok("[apk壳] 子页返回键回到上一页", back1.before === "codex" && back1.after === "home" && back1.ret === "handled",
    `${back1.before} -> ${back1.after} ret=${back1.ret}`);

  const back2 = await ev(`const ret = App.hardwareBack(); await new Promise(r=>setTimeout(r,300));
    return { ret: ret, modal: !document.getElementById('modal').classList.contains('hidden'),
             title: document.getElementById('modalTitle').textContent };`);
  ok("[apk壳] 首页返回键弹确认退出", back2.ret === "handled" && back2.modal === true && /退出/.test(back2.title),
    back2.title);

  const exit = await ev(`App.exitApp(); await new Promise(r=>setTimeout(r,400));
    return { shellExit: !!window.__shellExit, url: location.pathname, exiting: App._exiting,
             modal: !document.getElementById('modal').classList.contains('hidden') };`);
  ok("[apk壳] 确认退出交给原生回桌面", exit.shellExit === true && /index\.html/.test(exit.url),
    `shellExit=${exit.shellExit} url=${exit.url}`);
  ok("[apk壳] 退出后状态复位（不卡在退出中）", exit.exiting === false && exit.modal === false);

  try { await send("Browser.close"); } catch (e) {}
  chrome.kill(); srv.close();
  console.log(fails === 0 ? "\nALL LAYOUT CHECKS PASSED" : `\n${fails} CHECK(S) FAILED`);
  process.exit(fails === 0 ? 0 : 1);
})();
