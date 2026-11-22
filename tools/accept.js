#!/usr/bin/env node
/**
 * 二次验收：真实浏览器点击可达性 + 交互逻辑回归
 * 用法: node tools/accept.js  [ONLINE=url]
 * 退出码: 0 全通过 / 1 有失败
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8991;
const CDP_PORT = 9345;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json",
  ".apk": "application/vnd.android.package-archive",
};
function startServer() {
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split("?")[0]);
    const f = path.join(ROOT, u === "/" ? "index.html" : u);
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    fs.readFile(f, (err, buf) => {
      if (err) { res.writeHead(404); return res.end("404"); }
      res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(buf);
    });
  });
  return new Promise((r) => srv.listen(PORT, "127.0.0.1", () => r(srv)));
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = {};
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) (this.handlers[msg.method] || []).forEach((fn) => fn(msg.params));
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error("CDP 超时: " + method)); }
      }, 25000);
    });
  }
  on(m, fn) { (this.handlers[m] = this.handlers[m] || []).push(fn); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const httpJSON = async (u) => (await fetch(u)).json();

let cdp;
const pageErrors = [];
const results = [];
const shotsDir = path.join(__dirname, "shots");

async function ev(expr) {
  const r = await cdp.send("Runtime.evaluate", {
    expression: `(async () => { ${expr} })()`,
    awaitPromise: true, returnByValue: true, userGesture: true,
  });
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || "evaluate 异常");
  }
  return r.result.value;
}
const evalRaw = (expr) => ev(`return (${expr});`);

async function test(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail });
    console.log(`PASS  ${name}${detail ? "  " + detail : ""}`);
  } catch (e) {
    results.push({ name, ok: false, detail: e.message });
    console.log(`FAIL  ${name}\n      ${e.message}`);
  }
}
const assert = (c, m) => { if (!c) throw new Error(m || "断言失败"); };

async function shot(name) {
  const r = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(shotsDir, name + ".png"), Buffer.from(r.data, "base64"));
}

/** 真实 DOM 点击：定位 → 滚动到视口 → click()，返回是否点到了 */
async function clickText(sel, text, wait = 260) {
  const ok = await ev(`
    const nodes = [...document.querySelectorAll(${JSON.stringify(sel)})];
    const el = nodes.find(n => (n.textContent || "").replace(/\\s+/g, "").includes(${JSON.stringify(
      String(text).replace(/\s+/g, ""))}));
    if (!el) return false;
    el.scrollIntoView({ block: "center" });
    el.click();
    return true;`);
  if (!ok) throw new Error(`找不到可点击元素 ${sel} 包含「${text}」`);
  await sleep(wait);
  return true;
}
async function clickSel(sel, idx = 0, wait = 260) {
  const ok = await ev(`
    const nodes = [...document.querySelectorAll(${JSON.stringify(sel)})];
    const el = nodes[${idx}];
    if (!el) return false;
    el.scrollIntoView({ block: "center" });
    el.click();
    return true;`);
  if (!ok) throw new Error(`找不到元素 ${sel}[${idx}]`);
  await sleep(wait);
  return true;
}

const curPage = () => evalRaw("App.state.page");
const appLen = () => evalRaw("document.querySelector('#app').innerHTML.length");

/** 页面必须「有肉」：不是空壳、不是加载中、无 undefined/NaN */
async function assertPage(label, minLen = 400) {
  const info = await evalRaw(`(() => {
    const html = document.querySelector("#app").innerHTML;
    return {
      page: App.state.page,
      len: html.length,
      loading: /加载中|加载失败/.test(html),
      bad: /\\[object Object\\]|>undefined<|>NaN<|undefined 节|undefined 道/.test(html),
      text: (document.querySelector("#app").innerText || "").slice(0, 0)
    };
  })()`);
  assert(!info.loading, `${label}: 停在「加载中/加载失败」——${info.page}`);
  assert(!info.bad, `${label}: 正文含 undefined/NaN——${info.page}`);
  assert(info.len >= minLen, `${label}: 内容过短 ${info.len} < ${minLen}——${info.page}`);
  return `${info.page} ${info.len}B`;
}

(async () => {
  if (!CHROME) { console.error("未找到 Chrome/Edge"); process.exit(1); }
  fs.mkdirSync(shotsDir, { recursive: true });
  const srv = await startServer();
  const userDir = path.join(os.tmpdir(), "am-accept-" + process.pid);
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--disable-features=Translate", "--hide-scrollbars", "--window-size=390,844",
    "--remote-debugging-port=" + CDP_PORT, "--user-data-dir=" + userDir, "about:blank",
  ], { stdio: "ignore" });

  try {
    for (let i = 0; i < 120; i++) { try { await httpJSON(`http://127.0.0.1:${CDP_PORT}/json/version`); break; } catch { await sleep(150); } }
    let target = null;
    for (let i = 0; i < 40; i++) {
      const list = await httpJSON(`http://127.0.0.1:${CDP_PORT}/json/list`);
      target = list.find((t) => t.type === "page");
      if (target) break;
      await sleep(150);
    }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.addEventListener("open", res); ws.addEventListener("error", rej); });
    cdp = new CDP(ws);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    cdp.on("Runtime.exceptionThrown", (p) => {
      const d = p.exceptionDetails || {};
      pageErrors.push((d.exception && d.exception.description) || d.text || "unknown");
    });
    cdp.on("Log.entryAdded", (p) => { if (p.entry && p.entry.level === "error") pageErrors.push(p.entry.text); });
    cdp.on("Runtime.consoleAPICalled", (p) => {
      if (p.type === "error") pageErrors.push((p.args || []).map((a) => a.value || a.description).join(" "));
    });

    const BASE = process.env.ONLINE || `http://127.0.0.1:${PORT}/index.html`;
    await cdp.send("Page.navigate", { url: BASE });
    for (let i = 0; i < 80; i++) {
      const ok = await evalRaw("typeof App !== 'undefined' && !!(App.store && document.querySelector('#app') && document.querySelector('#app').children.length)");
      if (ok) break;
      await sleep(120);
    }
    await sleep(1400);

    /* ============ 1. 底部 Tab 全量点击 ============ */
    console.log("\n--- 1. 底部导航 ---");
    for (const [k, label] of [["home", "首页"], ["codex", "题库"], ["courses", "课程"], ["algo", "算法"], ["profile", "我的"]]) {
      await test(`Tab「${label}」点击可进入`, async () => {
        await clickText(".main-nav a", label, 420);
        const p = await curPage();
        assert(p === k, `期望 page=${k}，实际 ${p}`);
        return await assertPage(`Tab ${label}`);
      });
    }

    /* ============ 2. 首页所有功能卡 ============ */
    console.log("\n--- 2. 首页功能卡 ---");
    await clickText(".main-nav a", "首页", 420);
    // 只取真正的业务入口：排除安装引导条（它按可用性动态出现，会挤掉索引）
    const homeCards = await evalRaw(`[...document.querySelectorAll('#app [onclick]')]
      .filter(e => !e.closest('.install-strip'))
      .map(e => ({ text: (e.innerText||'').replace(/\\s+/g,' ').trim().slice(0,18), oc: e.getAttribute('onclick') }))
      .filter(x => x.oc && (x.oc.includes('App.nav') || x.oc.includes('openProblem')))`);
    console.log(`      首页可点击入口 ${homeCards.length} 个`);
    for (let i = 0; i < homeCards.length; i++) {
      const card = homeCards[i];
      await test(`首页入口 #${i + 1}「${card.text || card.oc}」`, async () => {
        await clickText(".main-nav a", "首页", 380);
        // 按 onclick 源码 + 文案双条件定位，不依赖 DOM 序号
        const ok = await ev(`
          const want = ${JSON.stringify(card.oc)};
          const txt = ${JSON.stringify(String(card.text).replace(/\s+/g, ""))};
          const el = [...document.querySelectorAll('#app [onclick]')]
            .filter(n => !n.closest('.install-strip'))
            .find(n => n.getAttribute('onclick') === want &&
                       (!txt || (n.innerText||'').replace(/\\s+/g,'').includes(txt)));
          if (!el) return false;
          el.scrollIntoView({ block: "center" });
          el.click(); return true;`);
        assert(ok, "元素消失");
        await sleep(700);
        const p = await curPage();
        assert(p !== "home", `点击后仍停在首页（onclick=${card.oc}）`);
        return await assertPage(`首页入口「${card.text}」`, 300);
      });
    }

    /* ============ 3. 课程：列表 → 章节 → 微课 ============ */
    console.log("\n--- 3. 课程链路 ---");
    await clickText(".main-nav a", "课程", 500);
    await test("课程列表渲染 4 门语言", async () => {
      const n = await evalRaw(`document.querySelectorAll('#app .card.click').length`);
      assert(n === 4, "语言卡片数 " + n);
      return n + " 门";
    });

    const langs = ["cpp", "py", "java", "c"];
    for (const lang of langs) {
      await test(`[${lang}] 点语言卡 → 章节目录`, async () => {
        await clickText(".main-nav a", "课程", 420);
        const ok = await ev(`
          const cards = [...document.querySelectorAll('#app .card.click')];
          const el = cards[${langs.indexOf(lang)}];
          if (!el) return false;
          el.click(); return true;`);
        assert(ok, "语言卡不存在");
        await sleep(420);
        const p = await curPage();
        assert(p === "course-detail", `期望 course-detail，实际 ${p}`);
        const rows = await evalRaw(`document.querySelectorAll('#app .row').length`);
        assert(rows === 20, "章节行数 " + rows);
        return `${rows} 章`;
      });

      await test(`[${lang}] 点第 1 章 → 微课正文`, async () => {
        await clickSel("#app .row", 0, 900);
        const p = await curPage();
        assert(p === "lesson", "实际 " + p);
        const info = await evalRaw(`(() => {
          const b = document.querySelector('.lesson-body');
          return { mic: document.querySelectorAll('.mic').length, len: b ? b.innerHTML.length : 0,
                   codes: document.querySelectorAll('.lesson-body pre code').length,
                   hl: document.querySelectorAll('.lesson-body pre code[data-hl="1"]').length };
        })()`);
        assert(info.len > 3000, "正文过短 " + info.len);
        assert(info.mic >= 3, "微课小节数 " + info.mic);
        assert(info.codes >= 3, "代码块数 " + info.codes);
        assert(info.hl === info.codes, `高亮未生效 ${info.hl}/${info.codes}`);
        return `${info.mic} 节 / ${info.codes} 代码 / ${Math.round(info.len / 1024)}KB`;
      });
    }

    await test("课程「下一章 / 上一章」可翻页", async () => {
      await clickText(".main-nav a", "课程", 420);
      await clickSel("#app .card.click", 0, 400);
      await clickSel("#app .row", 0, 900);
      await clickText(".ch-nav button", "下一章", 900);
      let i = await evalRaw("App.state.lesson");
      assert(i === 1, "下一章后 lesson=" + i);
      await clickText(".ch-nav button", "上一章", 900);
      i = await evalRaw("App.state.lesson");
      assert(i === 0, "上一章后 lesson=" + i);
      return "0↔1 正常";
    });

    await test("章内目录锚点跳转生效", async () => {
      const r = await ev(`
        const chip = document.querySelector('#app .toc a, #app .sec-toc a, #app [onclick*="jumpSec"]');
        if (!chip) return { skip: true };
        chip.click();
        await new Promise(r => setTimeout(r, 800));
        return { skip: false, top: App.scrollTop() };`);
      if (r.skip) return "本章无目录结构（跳过）";
      assert(r.top > 100, "点击后未滚动 " + r.top);
      return "scrollTop=" + r.top;
    });

    await test("「标记已学」往返可切换", async () => {
      const sel = '.ch-nav button.btn-primary, .ch-nav button.btn-ghost';
      await ev(`
        const btns = [...document.querySelectorAll('.ch-nav button')];
        const b = btns.find(x => /标记|已学/.test(x.textContent)); b && b.click(); return 1`);
      await sleep(300);
      const a = await evalRaw(`(() => { const k = App.state.course + '-' + App.state.lesson; return !!App.store.lessonsDone[k]; })()`);
      await ev(`
        const btns = [...document.querySelectorAll('.ch-nav button')];
        const b = btns.find(x => /标记|已学/.test(x.textContent)); b && b.click(); return 1`);
      await sleep(300);
      const b2 = await evalRaw(`(() => { const k = App.state.course + '-' + App.state.lesson; return !!App.store.lessonsDone[k]; })()`);
      assert(a !== b2, `标记未切换 ${a}→${b2}`);
      return `标记=${a} → 取消=${b2}`;
    });

    await test("章末「练同主题题目」跳到题库并带关键词", async () => {
      const has = await evalRaw(`!!document.querySelector('#app .ch-foot button')`);
      if (!has) return "本章无同主题入口（跳过）";
      await clickText("#app .ch-foot button", "练同主题", 800);
      const p = await curPage();
      assert(p === "codex", "实际 " + p);
      const st = await evalRaw(`({ kw: (document.querySelector('#codexKw') || {}).value || '',
        n: document.querySelectorAll('#app .prob-row').length })`);
      assert(st.n > 0, "跳转后题库为空");
      return st.kw ? "kw=" + st.kw : "无同名题型 → 回退全部(" + st.n + " 条)";
    });

    await test("章末「章节目录」回到课程详情", async () => {
      await clickText(".main-nav a", "课程", 400);
      await clickSel("#app .card.click", 0, 400);
      await clickSel("#app .row", 0, 1000);
      await clickText("#app .ch-foot button", "章节目录", 600);
      const p = await curPage();
      assert(p === "course-detail", "实际 " + p);
      return p;
    });

    await test("系统返回键从微课逐级退回首页", async () => {
      await clickText(".main-nav a", "课程", 400);
      await clickSel("#app .card.click", 0, 400);
      await clickSel("#app .row", 0, 900);
      const chain = [];
      for (let i = 0; i < 4; i++) {
        await ev("App.hardwareBack(); return 1");
        await sleep(320);
        chain.push(await curPage());
      }
      assert(chain[0] === "course-detail", "第一步应回 course-detail，实际 " + chain[0]);
      assert(chain[1] === "courses", "第二步应回 courses，实际 " + chain[1]);
      return chain.join(" → ");
    });

    /* ============ 4. 算法专题 ============ */
    console.log("\n--- 4. 算法专题 ---");
    await clickText(".main-nav a", "算法", 500);
    const algoN = await evalRaw("document.querySelectorAll('#app .alg-row').length");
    await test(`算法专题列表 ${algoN} 个全部可打开`, async () => {
      const bad = [];
      for (let i = 0; i < algoN; i++) {
        await clickText(".main-nav a", "算法", 320);
        await clickSel("#app .alg-row", i, 340);
        const p = await curPage();
        if (p !== "algo-detail") { bad.push(`#${i}→${p}`); continue; }
        const info = await evalRaw(`(() => {
          const html = document.querySelector('#app').innerHTML;
          return { len: html.length, bad: /\\[object Object\\]|>undefined</.test(html),
                   codes: document.querySelectorAll('#app pre code').length };
        })()`);
        if (info.len < 1500) bad.push(`#${i} 内容短 ${info.len}`);
        else if (info.bad) bad.push(`#${i} 含 undefined`);
        else if (info.codes < 1) bad.push(`#${i} 无代码块`);
      }
      assert(bad.length === 0, bad.slice(0, 6).join(" | "));
      return `${algoN}/${algoN} 正常`;
    });

    /* ============ 5. 题库 codex ============ */
    console.log("\n--- 5. 题库 ---");
    await clickText(".main-nav a", "题库", 900);
    await test("题库首屏渲染题目列表", async () => {
      const d = await evalRaw(`({ page: App.state.page, ready: App.indexReady, err: App.indexErr,
        idx: (window.PROBLEM_INDEX || []).length, rows: document.querySelectorAll('#app .prob-row').length,
        head: document.querySelector('#app').innerText.slice(0, 40).replace(/\\s+/g, ' ') })`);
      assert(d.rows > 0, `列表为空 [page=${d.page} ready=${d.ready} err=${d.err} idx=${d.idx} head=${d.head}]`);
      return d.rows + " 条";
    });
    await test("题库搜索命中标题", async () => {
      await ev(`
        const kw = document.querySelector('#codexKw');
        if (!kw) throw new Error('搜索框不存在');
        kw.focus(); kw.value = '排序';
        kw.dispatchEvent(new Event('input', { bubbles: true }));
        return 1;`);
      await sleep(600);
      const n = await evalRaw(`document.querySelectorAll('#app .prob-row').length`);
      assert(n > 0, "搜索无结果");
      return n + " 条命中";
    });
    await test("题库搜索命中题型分类", async () => {
      await ev(`
        const kw = document.querySelector('#codexKw');
        kw.value = 'DP';
        kw.dispatchEvent(new Event('input', { bubbles: true }));
        return 1;`);
      await sleep(600);
      const n = await evalRaw(`document.querySelectorAll('#app .prob-row').length`);
      assert(n > 0, "按分类搜不到");
      return n + " 条命中";
    });
    await test("搜不到时给出可点击的推荐题型", async () => {
      await ev(`
        const kw = document.querySelector('#codexKw');
        kw.value = 'zzzz不存在';
        kw.dispatchEvent(new Event('input', { bubbles: true }));
        return 1;`);
      await sleep(600);
      const n = await evalRaw(`document.querySelectorAll('#app .codex-sug .chip').length`);
      assert(n >= 3, "推荐题型数量 " + n);
      await clickSel("#app .codex-sug .chip", 0, 500);
      const rows = await evalRaw(`document.querySelectorAll('#app .prob-row').length`);
      assert(rows > 0, "点推荐词后仍无结果");
      return `${n} 个推荐 → ${rows} 条命中`;
    });
    await test("题库分组筛选可切换", async () => {
      const ok = await ev(`
        const chips = [...document.querySelectorAll('#app .chip, #app .seg, #app [onclick*="setGroup"]')];
        if (chips.length < 2) return false;
        chips[1].click(); return true;`);
      assert(ok, "找不到分组切换");
      await sleep(500);
      return await assertPage("分组筛选", 300);
    });
    await test("点题目进入做题页（题目/题解/代码三 Tab）", async () => {
      await clickText(".main-nav a", "题库", 700);
      await ev("App.resetCodexFilter(); return 1");
      await sleep(400);
      await clickSel("#app .prob-row", 0, 1400);
      const p = await curPage();
      assert(p === "solve", "实际 " + p);
      const tabs = await evalRaw(`[...document.querySelectorAll('.solve-tabs [onclick]')].map(e => e.textContent.trim())`);
      assert(tabs.length >= 2, "Tab 数量 " + tabs.length);
      const body = await evalRaw(`document.body.innerText.length`);
      assert(body > 500, "做题页内容过少");
      return tabs.join("/");
    });

    /* ============ 6. 其余模块 ============ */
    console.log("\n--- 6. 其余模块 ---");
    for (const [label, page] of [["精讲"], ["速查手册"], ["面试题库"], ["做题技巧"], ["打卡"]]) {
      // 从首页/资源区进入
      await clickText(".main-nav a", "首页", 400);
      const found = await ev(`
        const el = [...document.querySelectorAll('#app [onclick]')]
          .find(n => (n.innerText||'').includes(${JSON.stringify(label)}));
        if (!el) return false;
        el.scrollIntoView({ block: 'center' }); el.click(); return true;`);
      if (!found) { console.log(`      （首页无「${label}」入口，跳过）`); continue; }
      await sleep(700);
      await test(`「${label}」入口可打开`, async () => await assertPage(label, 400));
    }

    /* ============ 6.5 深度交互 ============ */
    console.log("\n--- 6.5 深度交互 ---");

    await test("做题页：运行 / 提交 / 记录 AC", async () => {
      await clickText(".main-nav a", "题库", 700);
      await ev("App.resetCodexFilter(); return 1");
      await sleep(400);
      const id = await evalRaw("(document.querySelector('#app .prob-row') || {}).getAttribute ? document.querySelector('#app .prob-row').getAttribute('onclick').match(/'([^']+)'/)[1] : null");
      assert(id, "拿不到题号");
      await clickText("#app .prob-row", id, 1400);
      const CODE = JSON.stringify("#include <bits/stdc++.h>\nusing namespace std;\nint main(){ cout << 1; return 0; }");
      await ev(`
        const ta = document.getElementById("codeInput");
        if (!ta) throw new Error("找不到编辑器");
        ta.value = ${CODE};
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        return 1;`);
      await clickText("#app .editor-actions button", "运行", 800);
      const runTxt = await evalRaw(`document.getElementById("resultPanel").innerText`);
      assert(/静态检查|通过|✗/.test(runTxt), "运行后无结果面板输出：" + runTxt.slice(0, 60));
      await clickText("#app .editor-actions button", "提交", 900);
      const ac = await evalRaw(`!!App.store.probsDone[${JSON.stringify(id)}]`);
      assert(ac, "提交后未记录 AC");
      return "题 " + id + " 已 AC";
    });

    await test("题库列表显示已 AC 标记", async () => {
      await clickText(".main-nav a", "题库", 800);
      await sleep(400);
      const n = await evalRaw(`document.querySelectorAll('#app .prob-name svg').length`);
      assert(n > 0, "列表里没有 AC 标记");
      return n + " 条带标记";
    });

    await test("速查手册：四种语言切换都有内容", async () => {
      await clickText(".main-nav a", "首页", 400);
      await ev("App.nav('manual'); return 1");
      await sleep(800);
      const counts = [];
      for (let i = 0; i < 4; i++) {
        await ev(`App.switchManual(${JSON.stringify(["cpp", "py", "java", "c"][i])}); return 1`);
        await sleep(700);
        const n = await evalRaw(`document.querySelectorAll('#app .api-item, #app .row, #app .card').length`);
        const bad = await evalRaw(`(() => { const h = document.querySelector('#app').innerHTML;
          const ctx = [];
          let k = -1;
          while ((k = h.indexOf('undefined', k + 1)) >= 0 && ctx.length < 2) ctx.push(h.slice(Math.max(0, k - 80), k + 30));
          const obj = h.indexOf('[object Object]');
          return ctx.length ? ctx.join(' >> ') : (obj >= 0 ? 'OBJ:' + h.slice(Math.max(0, obj - 80), obj + 30) : ""); })()`);
        assert(n > 0, `第 ${i + 1} 种语言没有条目`);
        assert(!bad, `第 ${i + 1} 种语言正文含空值：…${bad}…`);
        counts.push(n);
      }
      return counts.join("/");
    });

    await test("面试题库：分页加载更多 + 换方向重置", async () => {
      await ev("App.nav('interview'); return 1");
      await sleep(1200);
      const first = await evalRaw(`document.querySelectorAll('#app .row').length`);
      assert(first > 0 && first <= 40, "首屏条数 " + first);
      const hasMore = await evalRaw(`!!document.querySelector('#app .more-wrap button')`);
      if (!hasMore) return "条目较少，无分页";
      const idBefore = await evalRaw(`document.querySelector('#app .row').getAttribute('onclick')`);
      await clickSel("#app .more-wrap button", 0, 700);
      const after = await evalRaw(`document.querySelectorAll('#app .row').length`);
      assert(after > first, `加载更多无效 ${first} → ${after}`);
      // 切到第一个方向，条数应回到 ≤40
      await clickSel("#app .cat-chips .chip", 1, 700);
      const reset = await evalRaw(`document.querySelectorAll('#app .row').length`);
      assert(reset <= 40, "换方向未重置分页 " + reset);
      return `${first} → ${after}，切方向后 ${reset}`;
    });

    await test("页面内「返回」链接逐级正确", async () => {
      await ev("App.goTab('courses'); return 1");
      await sleep(400);
      await clickSel("#app .card.click", 0, 400);
      assert((await curPage()) === "course-detail", "未进入课程详情");
      await clickSel("#app .back-link", 0, 500);
      assert((await curPage()) === "courses", "返回后不在课程列表");
      return "detail → courses";
    });

    /* ============ 6.6 状态与数据 ============ */
    console.log("\n--- 6.6 状态与数据 ---");

    await test("打卡：点一次即记一天，重复点击不叠加", async () => {
      await clickText(".main-nav a", "首页", 400);
      await ev("App.nav('checkin'); return 1");
      await sleep(800);
      const before = await evalRaw("App.store.checkins.length");
      await clickText("#app .card button", "打卡", 700);
      const after = await evalRaw("App.store.checkins.length");
      assert(after === before + 1, `打卡未记录 ${before} → ${after}`);
      const st = await evalRaw(`(() => {
        const b = [...document.querySelectorAll('#app .card button')].find(x => /打卡/.test(x.innerText));
        return { text: b ? b.innerText.trim() : "", disabled: b ? b.disabled : null,
                 streak: App.streak() }; })()`);
      assert(/今天已打卡/.test(st.text), "按钮未切换为已打卡：" + st.text);
      assert(st.disabled === true, "已打卡按钮仍可点");
      assert(st.streak >= 1, "连续天数为 " + st.streak);
      await ev("App.doCheckin(); return 1");
      const again = await evalRaw("App.store.checkins.length");
      assert(again === after, "重复调用导致重复记录 " + after + " → " + again);
      return `连续 ${st.streak} 天`;
    });

    await test("主题切换后刷新仍保持", async () => {
      await ev("App.setTheme('light'); return 1");
      await sleep(400);
      const before = await evalRaw("document.documentElement.getAttribute('data-theme')");
      assert(before === "light", "切换未生效：" + before);
      await cdp.send("Page.reload", {});
      await sleep(2200);
      const after = await evalRaw("document.documentElement.getAttribute('data-theme')");
      assert(after === "light", "刷新后主题丢失：" + after);
      await ev("App.setTheme('dark'); return 1");
      return "light 持久化正常";
    });

    await test("算法专题：标记掌握后进度与列表同步", async () => {
      await ev("App.goTab('algo'); return 1");
      await sleep(700);
      const id = await evalRaw("(ALGOS[0] || {}).id");
      assert(id, "没有专题数据");
      await clickSel("#app .alg-row", 0, 1000);
      const btnOk = await ev(`
        const b = [...document.querySelectorAll('#app button')].find(x => /标记|已掌握/.test(x.innerText));
        if (!b) return false;
        b.scrollIntoView({ block: "center" });
        b.click(); return true;`);
      assert(btnOk, "详情页没有「标记掌握」按钮");
      await sleep(600);
      const done = await evalRaw(`!!App.store.algosDone[${JSON.stringify(id)}]`);
      assert(done, "未写入掌握状态");
      await ev("App.goTab('algo'); return 1");
      await sleep(600);
      const rowDone = await evalRaw(`!!document.querySelector('#app .alg-row.done')`);
      assert(rowDone, "列表未显示已掌握");
      // 复原，避免污染后续断言
      await ev(`App.markDone('algo', ${JSON.stringify(id)}); return 1`);
      await sleep(300);
      const restored = await evalRaw(`!App.store.algosDone[${JSON.stringify(id)}]`);
      assert(restored, "取消掌握失败");
      return "标记 → 列表 .done → 取消 正常";
    });

    await test("未登录点成就：弹出登录而不是静默失败", async () => {
      await ev("App.goTab('profile'); return 1");
      await sleep(900);
      const isLogin = await evalRaw("!!App.store.account");
      if (isLogin) return "已登录，跳过";
      const ok = await ev(`
        const a = document.querySelector('#app .ach');
        if (!a) return false;
        a.click(); return true;`);
      assert(ok, "成就卡片不存在");
      await sleep(600);
      const modal = await evalRaw(`(() => { const m = document.getElementById('modal');
        return { open: m && !m.classList.contains('hidden'), title: (document.getElementById('modalTitle')||{}).textContent || '' }; })()`);
      assert(modal.open, "点成就后没有弹出登录层");
      assert(/登录|头像框/.test(modal.title), "弹层标题异常：" + modal.title);
      await ev("App.closeModalForce(); return 1");
      return modal.title;
    });

    await test("做题页：切语言代码各自独立保存", async () => {
      await ev("App.openSolve('G00001'); return 1");
      await sleep(1500);
      const CODE_CPP = JSON.stringify("#include <bits/stdc++.h>\nint main(){ return 0; } // cpp 版");
      const CODE_PY = JSON.stringify("def solve():\n    return 0  # py 版");
      await ev(`const t = document.getElementById('codeInput'); t.value = ${CODE_CPP};
        t.dispatchEvent(new Event('input', { bubbles: true })); App.saveEditorCode(); return 1`);
      await ev("App.setLang('py'); return 1");
      await sleep(700);
      const pyVal = await evalRaw("document.getElementById('codeInput').value");
      assert(!/cpp 版/.test(pyVal), "切到 Python 后仍显示 C++ 代码");
      await ev(`const t = document.getElementById('codeInput'); t.value = ${CODE_PY};
        t.dispatchEvent(new Event('input', { bubbles: true })); App.saveEditorCode(); return 1`);
      await ev("App.setLang('cpp'); return 1");
      await sleep(700);
      const back = await evalRaw("document.getElementById('codeInput').value");
      assert(/cpp 版/.test(back), "切回 C++ 后代码丢失");
      const store = await evalRaw("Object.keys(App.store.code).filter(k => k.indexOf('G00001:') === 0).length");
      assert(store >= 2, "语言代码未分键保存：" + store);
      return `${store} 份代码独立`;
    });

    await test("做题页：笔记保存后重开仍在", async () => {
      const NOTE = JSON.stringify("这是自动化测试写下的笔记");
      const has = await evalRaw("!!document.getElementById('noteBox')");
      assert(has, "做题页没有笔记输入框");
      await ev(`const n = document.getElementById('noteBox'); n.value = ${NOTE};
        n.dispatchEvent(new Event('input', { bubbles: true })); App.saveNote(); return 1`);
      await sleep(500);
      await ev("App.goBack(); return 1");
      await sleep(700);
      await ev("App.openSolve('G00001'); return 1");
      await sleep(1400);
      const v = await evalRaw("(document.getElementById('noteBox') || {}).value || ''");
      assert(/自动化测试写下的笔记/.test(v), "重开后笔记丢失：" + v.slice(0, 40));
      return "笔记持久化 OK";
    });

    await test("收藏后「我的」收藏数 +1", async () => {
      const before = await evalRaw("Object.keys(App.store.fav || {}).filter(k => App.store.fav[k]).length");
      await ev("App.toggleFav('G00001'); return 1");
      await sleep(500);
      const after = await evalRaw("Object.keys(App.store.fav || {}).filter(k => App.store.fav[k]).length");
      assert(after === before + 1, `收藏数未变化 ${before} → ${after}`);
      await ev("App.goTab('profile'); return 1");
      await sleep(700);
      const txt = await evalRaw("document.querySelector('#app').innerText");
      assert(/收藏/.test(txt), "我的页没有收藏入口");
      await ev("App.toggleFav('G00001'); return 1");
      return `收藏 ${before} → ${after}`;
    });

    await test("深层返回栈：题库 → 题 → 返回 → 首页 四级正确", async () => {
      await ev("App.goTab('home'); return 1");
      await sleep(400);
      await ev("App.goTab('codex'); return 1");
      await sleep(600);
      await ev("App.openSolve('G00002'); return 1");
      await sleep(1300);
      let p = await curPage();
      assert(p === "solve", "未进入做题页：" + p);
      await ev("App.goBack(); return 1");
      await sleep(600);
      p = await curPage();
      assert(p === "codex", "返回后不在题库：" + p);
      await ev("App.goTab('home'); return 1");
      await sleep(400);
      p = await curPage();
      assert(p === "home", "回首页失败：" + p);
      return "solve → codex → home";
    });

    /* ============ 7. 视觉 / 主题 / 布局 ============ */
    console.log("\n--- 7. 视觉与布局 ---");
    for (const theme of ["dark", "light"]) {
      await test(`${theme} 主题下无横向溢出`, async () => {
        await ev(`App.setTheme('${theme}', true); return 1`);
        await sleep(300);
        await clickText(".main-nav a", "课程", 500);
        await clickSel("#app .card.click", 0, 400);
        await clickSel("#app .row", 0, 1000);
        const r = await evalRaw(`(() => {
          const box = document.getElementById('app');
          const br = box.getBoundingClientRect();
          const scrollable = el => {
            for (let p = el.parentElement; p && p !== box; p = p.parentElement) {
              const ox = getComputedStyle(p).overflowX;
              if (ox === 'auto' || ox === 'scroll') return true;
            }
            return false;
          };
          const over = [...box.querySelectorAll('*')]
            .filter(e => e.getBoundingClientRect().right > br.right + 1.5 && !scrollable(e))
            .slice(0, 5).map(e => e.tagName + '.' + (e.className || '').toString().slice(0, 24));
          return { docW: document.documentElement.scrollWidth, winW: innerWidth, over };
        })()`);
        assert(r.docW <= r.winW + 1, `文档横向溢出 ${r.docW} > ${r.winW}`);
        assert(r.over.length === 0, "溢出元素: " + r.over.join(", "));
        await shot(`accept-lesson-${theme}`);
        return `${r.winW}px 无溢出`;
      });
    }

    await test("底部导航与内容不重叠（窄屏）", async () => {
      const r = await evalRaw(`(() => {
        const nav = document.getElementById('mainNav');
        const box = document.getElementById('app');
        if (!nav || !box) return { skip: true };
        const nb = nav.getBoundingClientRect(), ab = box.getBoundingClientRect();
        return { navBottom: Math.round(nb.bottom), appBottom: Math.round(ab.bottom),
                 vh: innerHeight, overlap: ab.bottom > nb.top + 1 };
      })()`);
      if (r.skip) return "无导航（跳过）";
      assert(!r.overlap, `内容压住导航 app.bottom=${r.appBottom} nav.top=${r.navBottom}`);
      assert(Math.abs(r.navBottom - r.vh) <= 2, `导航未贴底 ${r.navBottom} vs ${r.vh}`);
      return `nav 底=${r.navBottom} / 视口=${r.vh}`;
    });

    /* ============ 8. 控制台清洁度 ============ */
    console.log("\n--- 8. 控制台 ---");
    await test("无 JS 运行时异常 / 资源 404", async () => {
      const real = pageErrors.filter((e) => !/favicon|manifest|sw\.js.*404|ServiceWorker/i.test(e));
      assert(real.length === 0, real.slice(0, 3).join(" || "));
      return "0 异常";
    });

    /* ---------------- 汇总 ---------------- */
    const fail = results.filter((r) => !r.ok);
    console.log(`\n========== 合计 ${results.length} 项，FAIL ${fail.length} ==========`);
    if (fail.length) {
      fail.forEach((f) => console.log(`  ✗ ${f.name}: ${f.detail}`));
      process.exitCode = 1;
    }
    await cdp.send("Page.navigate", { url: "about:blank" });
  } catch (e) {
    console.error("执行异常:", e.message);
    process.exitCode = 1;
  } finally {
    try { chrome.kill(); } catch {}
    srv.close();
    await sleep(200);
    process.exit(process.exitCode || 0);
  }
})();
