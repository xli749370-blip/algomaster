#!/usr/bin/env node
/** 账号 / 成就 视觉与逻辑自检：node tools/shot-ach.js → tools/shots/ach-*.png */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "shots");
const PORT = 8986, CDP_PORT = 9343;
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

let pass = 0, fail = 0;
const eq = (a, b, m) => { if (String(a) === String(b)) { pass++; console.log("PASS ", m, "=", a); } else { fail++; console.log("FAIL ", m, "got", a, "want", b); } };
const ok = (c, m) => { if (c) { pass++; console.log("PASS ", m); } else { fail++; console.log("FAIL ", m); } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-ach-" + process.pid),
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
  let id = 0; const pend = new Map(); const errs = [];
  ws.addEventListener("message", e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") errs.push(m.params.exceptionDetails.text + " " + (m.params.exceptionDetails.exception || {}).description);
  });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => {
    const r = await send("Runtime.evaluate", { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true });
    if (!r || !r.result) return undefined;
    if (r.exceptionDetails) { errs.push((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return undefined; }
    return r.result.value;
  };

  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(1200);

  const shot = async name => {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
    console.log("saved", name);
  };

  // 1) 未登录：顶栏是占位头像
  eq(await ev("return !!document.querySelector('#tbAvatar .av-blank')"), "true", "未登录顶栏占位头像");

  // 2) 造一点进度 + 登录
  await ev(`
    const ids = ["G00001","G00002","G00003","G00004","G00005","G00006","G00007","G00008","G00009","G00010","G00011","G00012"];
    const pd = {};
    ids.forEach(k => pd[k] = true);
    App.store.probsDone = pd;
    App.store.notes = { a: "x", b: "y" };
    App.store.checkins = [App.todayStr()];
    App.saveStore();
    return 1;`);
  await send("Page.reload");
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(1200);

  await ev("App.goTab('profile'); return 1");
  await sleep(800);
  const before = await ev("return { n: App.achStats().solved, claimed: Object.keys(App.store.ach.claimed).length }");
  eq(before.n, 12, "AC 数同步");
  eq(before.claimed, 0, "初始未领取");

  // 未登录点领取 → 应弹登录
  await ev("App.claimAch('first-ac'); return 1");
  await sleep(400);
  ok(await ev("return App.modalOpen() && !!document.getElementById('nickInput')"), "未登录领取 → 弹登录");
  await shot("ach-login");

  // 登录
  await ev(`
    document.getElementById('nickInput').value = '小新';
    App.pickAvatar('whale');
    App.saveLogin();
    return 1;`);
  await sleep(500);
  eq(await ev("return App.store.account.name"), "小新", "昵称保存");
  ok(await ev("return document.getElementById('tbAvatar').innerHTML.includes('🐳')"), "顶栏头像更新");

  // 领取成就
  await ev("App.goTab('profile'); return 1");
  await sleep(600);
  await shot("ach-profile-1");
  await ev("App.claimAch('first-ac'); return 1");
  await sleep(400);
  eq(await ev("return !!App.store.ach.claimed['first-ac']"), "true", "首个成就已领取");
  eq(await ev("return App.store.ach.frame"), "bronze", "自动佩戴青铜环");
  ok(await ev("return document.querySelector('.profile-head .av-ring') !== null"), "个人中心头像出现框");

  // 未达成不能领
  await ev("App.claimAch('ac-400'); return 1");
  await sleep(300);
  eq(await ev("return !!App.store.ach.claimed['ac-400']"), "false", "未达成不可领取");

  // 头像框选择弹层
  await ev("App.goTab('profile'); App.openFrames(); return 1");
  await sleep(500);
  await shot("ach-frames");
  const frameCount = await ev("return document.querySelectorAll('.frame-item').length");
  eq(frameCount, 15, "头像框数量（14 + 不使用）");
  await ev("App.setFrame(''); return 1");
  await sleep(300);
  eq(await ev("return App.store.ach.frame"), "", "可取消头像框");

  // 刷新后数据保留
  await send("Page.reload");
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(1000);
  eq(await ev("return App.store.account && App.store.account.name"), "小新", "刷新后仍登录");
  eq(await ev("return Object.keys(App.store.ach.claimed).length"), 1, "刷新后成就保留");

  // 深色个人中心全页截图
  await ev("App.setTheme('dark', true); App.goTab('profile'); return 1");
  await sleep(700);
  await shot("ach-profile-dark");
  await ev("App.setTheme('light', true); return 1");
  await sleep(500);
  await shot("ach-profile-light");

  // 退出登录
  await ev("App.openLogin(); return 1");
  await sleep(400);
  await ev("App.logout(); return 1");
  await sleep(400);
  eq(await ev("return App.store.account"), "null", "退出登录");
  eq(await ev("return Object.keys(App.store.ach.claimed).length"), 1, "退出后成就记录保留");

  ok(errs.length === 0, "无运行时异常：" + errs.join(" | "));
  console.log(`\n合计 ${pass + fail} 项，失败 ${fail} 项`);

  try { await send("Browser.close"); } catch (e) {}
  chrome.kill(); srv.close();
  process.exit(fail ? 1 : 0);
})();
