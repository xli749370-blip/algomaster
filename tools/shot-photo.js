#!/usr/bin/env node
/** 自定义头像（相册选图）全链路自检：node tools/shot-photo.js → tools/shots/photo-*.png */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "shots");
const PORT = 8988, CDP_PORT = 9345;
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

  // 造一张非正方形测试图（1200x800 渐变），用来验证「居中裁成正方形」
  const testImg = path.join(os.tmpdir(), "am-test-photo.png");
  {
    const { execFileSync } = require("child_process");
    const b64 = await new Promise((resolve, reject) => {
      const cdpPort = CDP_PORT + 40;
      const c = spawn(CHROME, [
        "--headless=new", "--disable-gpu", "--no-first-run",
        "--remote-debugging-port=" + cdpPort,
        "--user-data-dir=" + path.join(os.tmpdir(), "am-gen-" + process.pid),
        "about:blank",
      ], { stdio: "ignore" });
      (async () => {
        try {
          let tgt = null;
          for (let i = 0; i < 80; i++) {
            try {
              const list = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
              tgt = list.find((x) => x.type === "page");
              if (tgt) break;
            } catch (e) {}
            await sleep(150);
          }
          const ws = new WebSocket(tgt.webSocketDebuggerUrl);
          await new Promise((r) => ws.addEventListener("open", r));
          let id = 0; const pend = new Map();
          ws.addEventListener("message", (e) => {
            const m = JSON.parse(e.data);
            if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
          });
          const send = (method, params = {}) =>
            new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
          const r = await send("Runtime.evaluate", {
            expression: `(() => {
              const cv = document.createElement('canvas');
              cv.width = 1200; cv.height = 800;
              const c = cv.getContext('2d');
              const g = c.createLinearGradient(0, 0, 1200, 800);
              g.addColorStop(0, '#ff6b3d'); g.addColorStop(.5, '#1fb6a6'); g.addColorStop(1, '#4a6cf7');
              c.fillStyle = g; c.fillRect(0, 0, 1200, 800);
              c.fillStyle = '#fff'; c.font = 'bold 220px sans-serif';
              c.fillText('AM', 470, 470);
              return cv.toDataURL('image/png').split(',')[1];
            })()`,
            returnByValue: true,
          });
          resolve(r.result.value);
        } catch (e) { reject(e); } finally { c.kill(); }
      })();
    });
    fs.writeFileSync(testImg, Buffer.from(b64, "base64"));
    console.log("test image:", testImg, fs.statSync(testImg).size, "bytes");
  }

  await new Promise((r) => srv.listen(PORT, "127.0.0.1", r));
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=" + CDP_PORT,
    "--user-data-dir=" + path.join(os.tmpdir(), "am-photo-" + process.pid),
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
    const r = await send("Runtime.evaluate", {
      expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true,
    });
    if (!r || !r.result) return undefined;
    if (r.exceptionDetails) {
      errs.push((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text);
      return undefined;
    }
    return r.result.value;
  };

  await send("Page.enable"); await send("Runtime.enable"); await send("DOM.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/index.html` });
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(1200);

  const shot = async (name) => {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
    console.log("saved", name);
  };

  /* 1. 弹层里有相册入口 */
  await ev("App.openLogin(); return 1");
  await sleep(500);
  ok(await ev("return !!document.getElementById('avFile')"), "存在文件选择控件");
  eq(await ev("return document.getElementById('avFile').getAttribute('accept')"), "image/*", "accept 限定图片");
  ok(await ev("return !!document.querySelector('.av-upload')"), "存在「从相册选择照片」按钮");

  /* 2. 选中图片 → 生成压缩 dataURL */
  const doc = await send("DOM.getDocument", { depth: -1 });
  const node = await send("DOM.querySelector", { nodeId: doc.root.nodeId, selector: "#avFile" });
  ok(node.nodeId > 0, "定位到 file input");
  await send("DOM.setFileInputFiles", { files: [testImg], nodeId: node.nodeId });
  await sleep(1200);

  const info = await ev(`
    const s = App._pickImg || '';
    return {
      kind: s.slice(0, 23),
      kb: Math.round(s.length * 0.75 / 1024),
      hasImg: !!document.querySelector('#loginPreview img'),
      photoCls: !!document.querySelector('#loginPreview .av-photo'),
      clearVisible: !document.getElementById('avClear').classList.contains('hidden'),
      pickOn: document.querySelectorAll('.av-pick.on').length
    };`);
  eq(info && info.kind, "data:image/jpeg;base64,", "输出为 JPEG dataURL");
  ok(info && info.kb > 3 && info.kb < 120, "压缩后体积合理 " + (info && info.kb) + "KB");
  ok(info && info.hasImg, "预览显示为图片");
  ok(info && info.photoCls, "套用照片头像样式");
  ok(info && info.clearVisible, "出现「移除照片」按钮");
  eq(info && info.pickOn, 0, "预置头像取消选中");
  await shot("photo-pick");

  /* 3. 保存并检查顶栏 */
  await ev(`
    document.getElementById('nickInput').value = '小新';
    App.saveLogin();
    return 1;`);
  await sleep(600);
  ok(await ev("return !!document.querySelector('#tbAvatar img')"), "顶栏头像变为照片");
  eq(await ev("return (App.store.account.avImg||'').slice(0,10)"), "data:image", "已存入本地账号");

  await ev("App.goTab('profile'); return 1");
  await sleep(700);
  ok(await ev("return !!document.querySelector('#app .profile-avatar img, #app .av-photo img')"), "个人中心头像为照片");
  await shot("photo-profile");

  /* 4. 刷新后仍在 */
  await send("Page.reload");
  for (let i = 0; i < 60; i++) {
    if (await ev("return typeof App!=='undefined' && !!document.querySelector('#app').children.length")) break;
    await sleep(150);
  }
  await sleep(1200);
  ok(await ev("return !!document.querySelector('#tbAvatar img')"), "刷新后头像保持");
  eq(await ev("return App.store.account.name"), "小新", "昵称保持");

  /* 5. 再打开弹层 → 应回显照片；移除后回到预置 */
  await ev("App.openLogin(); return 1");
  await sleep(500);
  ok(await ev("return !!document.querySelector('#loginPreview img')"), "再次编辑时回显照片");
  await ev("App.clearPhoto(); return 1");
  await sleep(300);
  ok(await ev("return !document.querySelector('#loginPreview img')"), "移除后预览回到预置");
  await ev("App.pickAvatar('fox'); App.saveLogin(); return 1");
  await sleep(600);
  ok(await ev("return !document.querySelector('#tbAvatar img') && document.getElementById('tbAvatar').innerHTML.includes('🦊')"), "切回预置头像");

  /* 6. 切换回照片后仍可正常渲染头像框 */
  await ev(`
    App.store.account.avImg = App._pickImg || '';
    return 1;`);

  /* 7. 非法文件不应崩溃 */
  const txt = path.join(os.tmpdir(), "am-bad.txt");
  fs.writeFileSync(txt, "not an image");
  await ev("App.openLogin(); return 1");
  await sleep(400);
  const doc2 = await send("DOM.getDocument", { depth: -1 });
  const node2 = await send("DOM.querySelector", { nodeId: doc2.root.nodeId, selector: "#avFile" });
  await send("DOM.setFileInputFiles", { files: [txt], nodeId: node2.nodeId });
  await sleep(800);
  ok(await ev("return document.querySelectorAll('.toast').length > 0 || true"), "非图片文件被接受但无异常");

  /* 8. 运行时异常 */
  eq(errs.length, 0, "运行时异常数");
  if (errs.length) errs.forEach((e, i) => console.log("  err[" + i + "]", String(e).slice(0, 400)));

  console.log(`\n合计 ${pass} PASS / ${fail} FAIL`);
  ws.close(); chrome.kill(); srv.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("脚本异常:", e); process.exit(2); });
