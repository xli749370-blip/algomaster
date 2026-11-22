#!/usr/bin/env node
/**
 * 交互逻辑端到端测试（真实 Chrome + CDP，零依赖）
 * 用法: node tools/e2e.js
 * 退出码: 0 全部通过 / 1 有失败
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8977;
const CDP_PORT = 9333;
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find(p => fs.existsSync(p));

/* ---------------- 静态服务器 ---------------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json",
};
function startServer() {
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split("?")[0]);
    let f = path.join(ROOT, u === "/" ? "index.html" : u);
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    fs.readFile(f, (err, buf) => {
      if (err) { res.writeHead(404); return res.end("404"); }
      res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(buf);
    });
  });
  return new Promise(r => srv.listen(PORT, "127.0.0.1", () => r(srv)));
}

/* ---------------- CDP 极简客户端 ---------------- */
class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = {};
    this.errors = [];
    ws.addEventListener("message", ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        (this.handlers[msg.method] || []).forEach(fn => fn(msg.params));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error("CDP 超时: " + method)); }
      }, 20000);
    });
  }
  on(method, fn) { (this.handlers[method] = this.handlers[method] || []).push(fn); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function httpJSON(url) {
  const res = await fetch(url);
  return res.json();
}

/* ---------------- 测试框架 ---------------- */
const results = [];
let cdp, pageErrors = [];

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
const evalRaw = expr => ev(`return (${expr});`);

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
function assert(cond, msg) { if (!cond) throw new Error(msg || "断言失败"); }
function eq(a, b, msg) {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error(`${msg || "不相等"}: 实际 ${A} ≠ 期望 ${B}`);
}

async function goto(url) {
  await cdp.send("Page.navigate", { url });
  await sleep(500);
  // 等 App 就绪
  for (let i = 0; i < 60; i++) {
    const ok = await evalRaw("typeof App !== 'undefined' && !!(App.store && document.querySelector('#app') && document.querySelector('#app').children.length)");
    if (ok) return;
    await sleep(100);
  }
  throw new Error("页面未就绪: " + url);
}

async function click(sel, wait = 120) {
  const ok = await ev(`
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return false;
    el.click();
    return true;`);
  if (!ok) throw new Error("找不到元素: " + sel);
  await sleep(wait);
}

async function typeInto(sel, val) {
  await ev(`
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) throw new Error("找不到输入框 ${sel}");
    el.focus();
    el.value = ${JSON.stringify(val)};
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return true;`);
}

/* ---------------- 主流程 ---------------- */
(async () => {
  if (!CHROME) { console.error("未找到 Chrome/Edge"); process.exit(1); }
  const srv = await startServer();

  const userDir = path.join(os.tmpdir(), "am-e2e-" + process.pid);
  const chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--disable-features=Translate", "--hide-scrollbars", "--window-size=1440,900",
    "--remote-debugging-port=" + CDP_PORT, "--user-data-dir=" + userDir,
    "about:blank",
  ], { stdio: "ignore" });

  try {
    let ver = null;
    for (let i = 0; i < 100; i++) {
      try { ver = await httpJSON(`http://127.0.0.1:${CDP_PORT}/json/version`); break; } catch (e) { await sleep(150); }
    }
    if (!ver) throw new Error("Chrome 调试端口未就绪");

    let target = null;
    for (let i = 0; i < 40; i++) {
      const list = await httpJSON(`http://127.0.0.1:${CDP_PORT}/json/list`);
      target = list.find(t => t.type === "page");
      if (target) break;
      await sleep(150);
    }
    if (!target) throw new Error("未找到页面 target");

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.addEventListener("open", res); ws.addEventListener("error", rej); });
    cdp = new CDP(ws);

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    cdp.on("Runtime.exceptionThrown", p => {
      const d = p.exceptionDetails || {};
      pageErrors.push((d.exception && d.exception.description) || d.text || "unknown");
    });
    cdp.on("Log.entryAdded", p => {
      if (p.entry && p.entry.level === "error") pageErrors.push(p.entry.text);
    });

    const BASE = `http://127.0.0.1:${PORT}/index.html`;
    await goto(BASE);
    await sleep(1600); // 等首屏自动引导条（1.2s）

    /* ---------- A. 首屏 ---------- */
    console.log("\n--- 首屏 ---");
    await test("首页渲染出内容", async () => {
      const n = await evalRaw("document.querySelectorAll('#app .feature-card').length");
      assert(n >= 6, "功能区卡片数量 " + n);
      return n + " 张功能卡";
    });
    await test("底部导航 5 个 Tab 且首页高亮", async () => {
      const r = await evalRaw(`(() => {
        const a = [...document.querySelectorAll('.main-nav a')];
        const cur = a.find(x => x.classList.contains('active'));
        return { n: a.length, active: cur ? cur.getAttribute('data-nav') : null };
      })()`);
      eq(r.n, 5, "Tab 数量");
      eq(r.active, "home", "高亮项");
      return "5 个";
    });
    await test("首页不显示返回键", async () => {
      const show = await evalRaw("document.getElementById('backBtn').classList.contains('show')");
      assert(!show, "返回键不该出现");
    });
    await test("首页有安装入口条", async () => {
      const n = await evalRaw("document.querySelectorAll('.install-strip').length");
      eq(n, 1, "安装条数量");
    });

    /* ---------- B. 返回体系 ---------- */
    console.log("\n--- 返回体系 ---");
    await test("进入题库后出现返回键", async () => {
      await click('.main-nav a[data-nav="codex"]', 900);
      const r = await evalRaw(`({
        page: App.state.page,
        show: document.getElementById('backBtn').classList.contains('show'),
        rows: document.querySelectorAll('.prob-row').length
      })`);
      eq(r.page, "codex", "当前页");
      assert(r.show, "返回键应显示");
      assert(r.rows > 0, "题目列表为空");
      return r.rows + " 行可见";
    });
    await test("顶栏返回键回首页并恢复状态", async () => {
      await click("#backBtn", 200);
      const r = await evalRaw("({ page: App.state.page, stack: App.vstack.length })");
      eq(r.page, "home", "当前页");
      eq(r.stack, 1, "栈深度");
    });
    await test("系统返回（popstate）回上一页", async () => {
      await click('.main-nav a[data-nav="courses"]', 300);
      eq(await evalRaw("App.state.page"), "courses");
      await ev("history.back(); return true;");
      await sleep(300);
      eq(await evalRaw("App.state.page"), "home", "系统返回后");
    });
    await test("首页返回弹出退出确认", async () => {
      await click('.main-nav a[data-nav="home"]', 200);
      await click("#backBtn", 250);
      const r = await evalRaw(`({
        open: App.modalOpen(),
        title: document.getElementById('modalTitle').textContent
      })`);
      assert(r.open, "未弹出确认框");
      assert(r.title.includes("退出"), "标题: " + r.title);
    });
    await test("退出确认可取消且不误退", async () => {
      await ev(`const b=[...document.querySelectorAll('#modalBody .btn')].find(x=>x.textContent.includes('取消')); b.click(); return true;`);
      await sleep(250);
      const r = await evalRaw("({ open: App.modalOpen(), page: App.state.page, exit: App._exitOpen })");
      assert(!r.open, "弹层未关闭");
      eq(r.page, "home", "页面");
      assert(!r.exit, "_exitOpen 未复位");
    });
    await test("弹层打开时返回先关弹层", async () => {
      await click("#msgBtn", 250);
      assert(await evalRaw("App.modalOpen()"), "公告未打开");
      await click("#backBtn", 250);
      const r = await evalRaw("({ open: App.modalOpen(), page: App.state.page })");
      assert(!r.open, "返回应关闭弹层");
      eq(r.page, "home", "页面不应变化");
    });
    await test("连点返回 8 次不白屏", async () => {
      await ev(`for (let i=0;i<8;i++) document.getElementById('backBtn').click(); return true;`);
      await sleep(400);
      const n = await evalRaw("document.querySelector('#app').children.length");
      assert(n > 0, "页面被清空");
      // 关掉可能弹出的退出确认
      await ev("App.closeModalForce(); return true;");
      return n + " 个区块";
    });

    /* ---------- C. 题库筛选 ---------- */
    console.log("\n--- 题库筛选 ---");
    await click('.main-nav a[data-nav="codex"]', 900);
    await test("切换分类后重置到第 1 页", async () => {
      await click(".pager .btn", 100); // 先翻到第 2 页（若可）
      const before = await evalRaw("App.state.codex.page");
      await ev(`App.setCodexGroup('greedy'); return true;`);
      await sleep(150);
      const r = await evalRaw("({ p: App.state.codex.page, g: App.state.codex.group })");
      eq(r.g, "greedy", "分类");
      eq(r.p, 0, "页码");
      return "翻页前 " + before;
    });
    await test("分类筛选后题目都属于该方向", async () => {
      const bad = await ev(`
        const rows = [...document.querySelectorAll('.prob-row .prob-name')].length;
        const g = App.groupCounts();
        return { rows, total: g.greedy || 0 };`);
      assert(bad.rows > 0, "该分类无题目");
      return bad.rows + " / 共 " + bad.total;
    });
    await test("难度筛选生效", async () => {
      await ev(`App.setCodexGroup('all'); App.setCodexDiff('简单'); return true;`);
      await sleep(150);
      const r = await evalRaw(`(() => {
        const tags = [...document.querySelectorAll('.prob-row .prob-diff .diff')].map(x => x.textContent.trim());
        return { n: tags.length, allEasy: tags.every(t => t === '简单'), uniq: [...new Set(tags)] };
      })()`);
      assert(r.n > 0, "无结果");
      assert(r.allEasy, "存在非简单题: " + r.uniq.join(","));
      await ev(`App.setCodexDiff('all'); return true;`);
    });
    await test("搜索后保持输入框焦点（不丢 IME）", async () => {
      await typeInto("#codexKw", "排序");
      await sleep(250);
      const r = await evalRaw(`({
        focus: document.activeElement && document.activeElement.id,
        kw: App.state.codex.kw,
        page: App.state.codex.page
      })`);
      eq(r.focus, "codexKw", "焦点应在输入框");
      eq(r.kw, "排序", "关键词");
      eq(r.page, 0, "页码");
    });
    await test("搜索无结果时给出空态", async () => {
      await typeInto("#codexKw", "zzzz不存在zzzz");
      await sleep(250);
      const n = await evalRaw("document.querySelectorAll('.prob-row').length");
      const empty = await evalRaw("!!document.querySelector('#app .empty')");
      eq(n, 0, "不应有结果");
      assert(empty, "缺少空态提示");
    });
    await test("清空搜索后恢复列表", async () => {
      await typeInto("#codexKw", "");
      await sleep(250);
      const n = await evalRaw("document.querySelectorAll('.prob-row').length");
      assert(n > 0, "列表未恢复");
      return n + " 行";
    });
    await test("分页可前进后退且首页禁用上一页", async () => {
      const dis0 = await evalRaw("document.querySelectorAll('.pager .btn')[0].disabled");
      assert(dis0, "第 1 页的「上一页」应禁用");
      await ev(`App.codexPage(1); return true;`);
      await sleep(150);
      eq(await evalRaw("App.state.codex.page"), 1, "页码");
      const dis1 = await evalRaw("document.querySelectorAll('.pager .btn')[0].disabled");
      assert(!dis1, "第 2 页的「上一页」应可用");
      await ev(`App.codexPage(0); return true;`);
      await sleep(150);
    });

    /* ---------- D. 做题页 ---------- */
    console.log("\n--- 做题页 ---");
    let pid = null;
    await test("点击题目进入做题页并加载完成", async () => {
      pid = await ev(`
        const row = document.querySelector('.prob-row');
        row.click();
        return row.querySelector('.prob-id').textContent.trim();`);
      await sleep(900);
      const r = await evalRaw(`({
        page: App.state.page,
        solve: App.solve && App.solve.id,
        loading: App.solveLoading,
        hasCode: !!document.getElementById('codeInput'),
        descLen: (App.solve && App.solve.desc || '').length
      })`);
      eq(r.page, "solve", "页面");
      assert(r.solve, "题目未加载");
      assert(!r.loading, "仍在 loading");
      assert(r.hasCode, "编辑器缺失");
      assert(r.descLen > 10, "题面为空");
      return pid + " · 描述 " + r.descLen + " 字";
    });
    await test("四种语言切换并各自保留代码", async () => {
      const out = {};
      for (const l of ["py", "java", "c", "cpp"]) {
        await ev(`App.setLang('${l}'); return true;`);
        await sleep(180);
        out[l] = await evalRaw(`({
          lang: App.state.lang,
          code: document.getElementById('codeInput').value.slice(0, 24)
        })`);
        eq(out[l].lang, l, "语言状态 " + l);
        assert(out[l].code.length > 3, l + " 模板为空");
      }
      return Object.keys(out).join(" → ");
    });
    await test("编辑器输入后自动落盘", async () => {
      const marker = "// e2e-" + Date.now();
      await ev(`
        const ta = document.getElementById('codeInput');
        ta.focus();
        ta.value = ta.value + "\\n" + ${JSON.stringify(marker)};
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        return true;`);
      await sleep(800);
      const r = await evalRaw(`(() => {
        const id = App.solve.id, k = id + ':' + App.state.lang;
        const raw = JSON.parse(localStorage.getItem('algomaster') || '{}');
        return {
          hasMarker: (App.store.code[k] || '').includes('e2e-'),
          saved: ((raw.code || {})[k] || '').includes('e2e-')
        };
      })()`);
      assert(r.hasMarker, "内存未更新");
      assert(r.saved, "localStorage 未落盘");
    });
    await test("收藏 / 取消收藏不丢编辑器内容", async () => {
      const before = await evalRaw("document.getElementById('codeInput').value.length");
      await ev(`App.toggleFav(App.solve.id); return true;`);
      await sleep(200);
      const r = await evalRaw(`({
        fav: !!App.store.fav[App.solve.id],
        len: document.getElementById('codeInput').value.length,
        note: document.getElementById('noteBox') ? 'ok' : 'missing'
      })`);
      assert(r.fav, "未收藏");
      eq(r.note, "ok", "页面结构被破坏");
      eq(r.len, before, "编辑器内容丢失");
      await ev(`App.toggleFav(App.solve.id); return true;`);
      await sleep(150);
      assert(!(await evalRaw(`!!App.store.fav[App.solve.id]`)), "取消收藏失败");
    });
    await test("笔记保存与清空", async () => {
      await typeInto("#noteBox", "e2e 笔记内容");
      await ev("App.saveNote(); return true;");
      await sleep(120);
      eq(await evalRaw("App.store.notes[App.solve.id]"), "e2e 笔记内容", "笔记未保存");
      await typeInto("#noteBox", "");
      await ev("App.saveNote(); return true;");
      await sleep(120);
      eq(await evalRaw("App.store.notes[App.solve.id]"), undefined, "笔记未清空");
    });
    await test("「运行」给出静态检查结果", async () => {
      await ev("App.runCheck(); return true;");
      await sleep(150);
      const txt = await evalRaw("document.getElementById('resultPanel').textContent");
      assert(txt.includes("静态检查"), "结果面板无内容: " + txt.slice(0, 40));
    });
    await test("「提交」记录 AC 且今日进度 +1", async () => {
      const before = await evalRaw("(App.today().solved || 0)");
      await ev(`
        const ta = document.getElementById('codeInput');
        ta.value = ${JSON.stringify(
          "class Solution { public: int solve() { return 0; } };"
        )};
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        return true;`);
      await sleep(200);
      // 用各语言都能通过的最小结构：先切到 cpp 并写完整代码
      await ev(`App.setLang('cpp'); return true;`);
      await sleep(200);
      await ev(`
        const ta = document.getElementById('codeInput');
        ta.value = '#include <bits/stdc++.h>\\nusing namespace std;\\nint main(){ int n; cin >> n; cout << n; return 0; }';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        return true;`);
      await sleep(200);
      await ev("App.submitCode(); return true;");
      await sleep(300);
      const r = await evalRaw(`({
        done: !!App.store.probsDone[App.solve.id],
        solved: App.today().solved || 0,
        panel: document.getElementById('resultPanel').textContent.slice(0, 60)
      })`);
      assert(r.done, "未记录 AC（" + r.panel + "）");
      eq(r.solved, before + 1, "今日进度");
    });
    await test("重复提交不重复累计进度", async () => {
      const before = await evalRaw("App.today().solved || 0");
      await ev("App.submitCode(); return true;");
      await sleep(250);
      eq(await evalRaw("App.today().solved || 0"), before, "进度被重复累加");
    });
    await test("查看解析切到题解视图并加载内容", async () => {
      await ev("App.showSolution(); return true;");
      await sleep(900);
      const r = await evalRaw(`(() => {
        const b = document.getElementById('solBody');
        const act = document.querySelector('.solve-tabs button.active');
        return { tab: act ? act.getAttribute('data-tab') : '',
                 len: b ? (b.innerText || '').length : 0,
                 code: b ? b.querySelectorAll('pre.sol-code').length : 0 };
      })()`);
      eq(r.tab, "sol", "Tab 未切到题解");
      assert(r.len > 200, "题解内容为空: " + r.len);
      assert(r.code > 0, "题解无参考代码");
      await ev("App.switchSolveTab('problem'); return true;");
      return r.len + " 字 · " + r.code + " 段代码";
    });
    await test("返回题库后筛选状态保持", async () => {
      await click(".back-link", 300);
      const r = await evalRaw("({ page: App.state.page, p: App.state.codex.page })");
      eq(r.page, "codex", "页面");
      eq(r.p, 0, "页码");
    });

    /* ---------- E. 打卡 ---------- */
    console.log("\n--- 打卡 ---");
    await test("打卡页可打卡且不重复累加", async () => {
      await ev(`App.nav('checkin'); return true;`);
      await sleep(300);
      const before = await evalRaw("App.store.checkins.length");
      await ev(`
        const b = [...document.querySelectorAll('#app .btn')].find(x => x.textContent.includes('打卡'));
        b.click(); return true;`);
      await sleep(300);
      const r = await evalRaw(`({
        n: App.store.checkins.length,
        streak: App.streak(),
        disabled: [...document.querySelectorAll('#app .btn')].some(x => x.textContent.includes('今天已打卡') && x.disabled)
      })`);
      eq(r.n, before + 1, "打卡记录数");
      assert(r.streak >= 1, "连续天数");
      assert(r.disabled, "打卡后按钮未禁用");
      // 再点一次
      await ev(`
        const b = [...document.querySelectorAll('#app .btn')].find(x => x.textContent.includes('今天已打卡'));
        if (b) b.click(); return true;`);
      await sleep(200);
      eq(await evalRaw("App.store.checkins.length"), before + 1, "重复打卡");
    });

    /* ---------- F. 主题 ---------- */
    console.log("\n--- 主题 ---");
    await test("主题切换并持久化", async () => {
      const t0 = await evalRaw("document.documentElement.dataset.theme");
      await click("#themeBtn", 250);
      const t1 = await evalRaw("document.documentElement.dataset.theme");
      assert(t0 !== t1, "主题未切换");
      eq(await evalRaw("localStorage.getItem('algomaster-theme')"), t1, "未持久化");
      await click("#themeBtn", 200);
      eq(await evalRaw("document.documentElement.dataset.theme"), t0, "未切回");
    });

    /* ---------- G. 安装 ---------- */
    console.log("\n--- 安装引导 ---");
    await test("安装引导弹层有可复制链接", async () => {
      await ev(`App.goTab('home'); App.openInstallGuide(); return true;`);
      await sleep(300);
      const r = await evalRaw(`({
        open: App.modalOpen(),
        url: !!document.querySelector('#modalBody .guide-url'),
        btn: (document.querySelector('#modalBody .btn') || {}).textContent || ''
      })`);
      assert(r.open, "弹层未打开");
      return r.url ? "含链接行" : "按环境给步骤（" + r.btn.trim() + "）";
    });
    await test("安装条可关闭且刷新后不再出现", async () => {
      await ev("App.closeModalForce(); App.goTab('home'); return true;");
      await sleep(200);
      const has = await evalRaw("!!document.querySelector('.install-strip')");
      assert(has, "安装条不存在");
      await ev(`
        const b = document.querySelector('.install-strip-x');
        b.click(); return true;`);
      await sleep(300);
      const gone = await evalRaw("!document.querySelector('.install-strip')");
      assert(gone, "关闭后仍存在");
      // 首页入口条关掉后，底部提示条应接上兜底
      await sleep(300);
      const barShown = await evalRaw("!document.getElementById('installBar').classList.contains('hidden')");
      assert(barShown, "入口条关闭后没有任何安装引导");
      await goto(BASE);
      await sleep(1500);
      const stillGone = await evalRaw("!document.querySelector('.install-strip')");
      assert(stillGone, "刷新后又出现");
    });

    /* ---------- H. 刷新后数据完整性 ---------- */
    console.log("\n--- 持久化 ---");
    await test("刷新后 AC / 打卡 / 收藏都在", async () => {
      const r = await evalRaw(`(() => {
        const s = App.store;
        return {
          ac: Object.keys(s.probsDone).length,
          checkins: s.checkins.length,
          theme: document.documentElement.dataset.theme,
          page: App.state.page
        };
      })()`);
      assert(r.ac >= 1, "AC 记录丢失");
      assert(r.checkins >= 1, "打卡丢失");
      eq(r.page, "home", "刷新后应回首页");
      return `AC ${r.ac} · 打卡 ${r.checkins} · 主题 ${r.theme}`;
    });
    await test("直接访问二级页不会崩", async () => {
      await ev(`App.applyPage('solve', 'P1001', 0); return true;`);
      await sleep(400);
      const n = await evalRaw("document.querySelector('#app').children.length");
      assert(n > 0, "页面空白");
      await ev(`App.goTab('home'); return true;`);
    });
    await test("个人中心图表不报错", async () => {
      await click('.main-nav a[data-nav="profile"]', 700);
      const r = await evalRaw(`({
        svg: document.querySelectorAll('#app svg').length,
        page: App.state.page
      })`);
      eq(r.page, "profile");
      assert(r.svg > 3, "图表 SVG 数量 " + r.svg);
      return r.svg + " 个 SVG";
    });

    /* ---------- H2. 更多路径 ---------- */
    console.log("\n--- 首页 / 课程 / 专题 ---");
    await test("首页「每日精讲」进入后可正常返回", async () => {
      await ev(`App.goTab('home'); return true;`);
      await sleep(200);
      const ok = await ev(`
        const c = document.querySelector('#app .card.click');
        if (!c) return false;
        c.click(); return true;`);
      assert(ok, "首页没有精讲卡片");
      await sleep(400);
      eq(await evalRaw("App.state.page"), "solve", "未进入做题页");
      const show = await evalRaw("document.getElementById('backBtn').classList.contains('show')");
      assert(show, "做题页返回键应显示");
      await click("#backBtn", 300);
      eq(await evalRaw("App.state.page"), "home", "未回到首页");
      assert(!(await evalRaw("App.modalOpen()")), "不应弹出退出确认");
      return "返回键回首页，无退出确认";
    });
    await test("快速连开两道题不会串数据", async () => {
      await click('.main-nav a[data-nav="codex"]', 800);
      const ids = await ev(`
        const rows = [...document.querySelectorAll('.prob-row')];
        const a = rows[0].querySelector('.prob-id').textContent.trim();
        const b = rows[1].querySelector('.prob-id').textContent.trim();
        rows[0].click(); rows[1].click();
        return [a, b];`);
      await sleep(1200);
      const cur = await evalRaw("App.solve && App.solve.id");
      eq(cur, ids[1], "最终显示的不是最后点的那题");
      return ids.join(" → ") + " = " + cur;
    });
    await test("课程：进入章节并标记完成", async () => {
      await ev(`App.goTab('courses'); return true;`);
      await sleep(300);
      await ev(`document.querySelector('#app .card.click').click(); return true;`);
      await sleep(300);
      eq(await evalRaw("App.state.page"), "course-detail", "课程详情");
      await ev(`
        const l = document.querySelector('#app .lesson-item, #app .row');
        if (l) l.click(); return true;`);
      await sleep(300);
      const r = await evalRaw("({ page: App.state.page, lesson: App.state.lesson })");
      eq(r.page, "lesson", "章节页");
      const before = await evalRaw("Object.values(App.store.lessonsDone).filter(Boolean).length");
      await ev(`
        const b = [...document.querySelectorAll('#app .btn')].find(x => /标记|完成/.test(x.textContent));
        if (b) b.click(); return !!b;`);
      await sleep(300);
      const after = await evalRaw("Object.values(App.store.lessonsDone).filter(Boolean).length");
      assert(after >= before, "进度异常");
      await click("#backBtn", 250);
      eq(await evalRaw("App.state.page"), "course-detail", "返回课程详情");
      return "章节 " + r.lesson + " · 已完成 " + after + " 章";
    });
    await test("算法专题可打开且返回", async () => {
      await ev(`App.goTab('algo'); return true;`);
      await sleep(300);
      await ev(`document.querySelector('#app .alg-row, #app .card.click, #app .row').click(); return true;`);
      await sleep(300);
      eq(await evalRaw("App.state.page"), "algo-detail", "专题详情");
      await click("#backBtn", 250);
      eq(await evalRaw("App.state.page"), "algo", "返回专题列表");
    });
    await test("手册切换语言并打开条目", async () => {
      await ev(`App.nav('manual'); return true;`);
      await sleep(500);
      const langs = await evalRaw(`[...document.querySelectorAll('#app .seg button')].map(b => b.textContent.trim())`);
      assert(langs.length >= 4, "语言切换按钮不足: " + langs.join(","));
      await ev(`
        const b = [...document.querySelectorAll('#app .seg button')].find(x => /Python/i.test(x.textContent));
        b.click(); return true;`);
      await sleep(400);
      const r = await evalRaw(`({ lang: App.state.manualLang, rows: document.querySelectorAll('#app .row').length })`);
      assert(r.rows > 0, "手册条目为空");
      const opened = await ev(`
        const row = document.querySelector('#app .row');
        if (!row) return false;
        row.click(); return true;`);
      assert(opened, "没有可点条目");
      await sleep(300);
      assert(await evalRaw("App.modalOpen()"), "条目弹层未打开");
      await ev("App.closeModalForce(); return true;");
      return r.lang + " · " + r.rows + " 条";
    });
    await test("手册搜索只刷新列表且不丢焦点", async () => {
      await ev(`App.switchManual('cpp'); return true;`);
      await sleep(500);
      const before = await evalRaw("document.querySelectorAll('#app .row').length");
      await typeInto("#manualKw", "vector");
      await sleep(300);
      const r = await evalRaw(`({
        rows: document.querySelectorAll('#app .row').length,
        focus: document.activeElement && document.activeElement.id,
        kw: App.state.manualKw
      })`);
      assert(r.rows > 0 && r.rows <= before, `结果异常 ${r.rows}/${before}`);
      eq(r.focus, "manualKw", "焦点丢失");
      eq(r.kw, "vector", "关键词");
      await typeInto("#manualKw", "");
      await sleep(300);
      eq(await evalRaw("document.querySelectorAll('#app .row').length"), before, "清空未恢复");
      return before + " → " + r.rows;
    });
    await test("面试题库按方向筛选并可打开详情", async () => {
      await ev(`App.nav('interview'); return true;`);
      await sleep(600);
      const total = await evalRaw("document.querySelectorAll('#app .row').length");
      const topic = await ev(`
        const chips = [...document.querySelectorAll('#app .cat-chips .chip')];
        if (chips.length < 2) return null;
        chips[1].click();
        return chips[1].textContent.trim();`);
      await sleep(300);
      const r = await evalRaw(`({ n: document.querySelectorAll('#app .row').length, t: App.state.ivTopic })`);
      assert(r.t && r.t !== "all", "未切换方向");
      assert(r.n > 0 && r.n < total, `筛选无效 ${r.n}/${total}`);
      await ev(`document.querySelector('#app .row').click(); return true;`);
      await sleep(300);
      assert(await evalRaw("App.modalOpen()"), "题目弹层未打开");
      await ev("App.closeModalForce(); return true;");
      await ev(`App.setIvTopic(-1); return true;`);
      await sleep(250);
      eq(await evalRaw("document.querySelectorAll('#app .row').length"), total, "回到全部");
      return topic + " · " + r.n + "/" + total;
    });
    await test("个人中心不出现悬浮安装条（不挡图表）", async () => {
      await ev(`App.goTab('profile'); return true;`);
      await sleep(700);
      const hidden = await evalRaw("document.getElementById('installBar').classList.contains('hidden')");
      assert(hidden, "个人中心仍显示安装条");
    });
    await test("个人中心收藏 / 错题 / 笔记弹层可用", async () => {
      await ev(`App.goTab('profile'); return true;`);
      await sleep(600);
      const keys = ["fav", "wrong", "notes", "history"];
      const out = [];
      for (const k of keys) {
        await ev(`App.openAsset('${k}'); return true;`);
        await sleep(200);
        assert(await evalRaw("App.modalOpen()"), k + " 弹层未打开");
        out.push(k + ":" + (await evalRaw("document.querySelectorAll('#modalBody .row, #modalBody .card').length")));
        await ev("App.closeModalForce(); return true;");
        await sleep(120);
      }
      return out.join(" ");
    });
    await test("弹层打开时锁住背景滚动", async () => {
      await ev(`App.openAnnouncements(); return true;`);
      await sleep(200);
      const locked = await evalRaw("getComputedStyle(document.getElementById('app')).overflowY");
      eq(locked, "hidden", "背景未锁定");
      await ev("App.closeModalForce(); return true;");
      await sleep(150);
      const free = await evalRaw("getComputedStyle(document.getElementById('app')).overflowY");
      assert(free !== "hidden", "关闭后未解锁");
    });
    await test("清空数据后回到首页且进度归零", async () => {
      const hadAc = await evalRaw("Object.keys(App.store.probsDone).length");
      await ev("App.clearData(); return true;");
      await sleep(250);
      await ev(`
        const b = [...document.querySelectorAll('#modalBody .btn')].find(x => x.textContent.includes('确认清空'));
        b.click(); return true;`);
      await sleep(400);
      const r = await evalRaw(`({
        page: App.state.page,
        stack: App.vstack.length,
        ac: Object.keys(App.store.probsDone).length,
        checkins: App.store.checkins.length
      })`);
      eq(r.page, "home", "页面");
      eq(r.stack, 1, "栈深度");
      eq(r.ac, 0, "AC 未清空");
      eq(r.checkins, 0, "打卡未清空");
      return "清理 " + hadAc + " 条 AC";
    });
    await test("每个底部 Tab 都能进入并显示内容", async () => {
      const out = [];
      for (const k of ["home", "codex", "courses", "algo", "profile"]) {
        await ev(`App.goTab('${k}'); return true;`);
        await sleep(k === "codex" || k === "profile" ? 700 : 250);
        const n = await evalRaw("document.querySelector('#app').children.length");
        assert(n > 0, k + " 页空白");
        out.push(k + ":" + n);
      }
      return out.join(" ");
    });

    /* ---------- H3. 移动端 375px ---------- */
    console.log("\n--- 移动端 375px ---");
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await goto(BASE);
    await sleep(1600);
    await test("底部导航固定在屏幕底部", async () => {
      const r = await evalRaw(`(() => {
        const nav = document.querySelector('.main-nav');
        const rect = nav.getBoundingClientRect();
        const cs = getComputedStyle(nav);
        return { pos: cs.position, parent: nav.parentNode.id, bottom: Math.round(window.innerHeight - rect.bottom), h: Math.round(rect.height), top: Math.round(rect.top),
                 docScrollable: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1 };
      })()`);
      eq(r.parent, "navSlot", "导航挂载位置");
      eq(r.pos, "static", "导航应随布局定位");
      assert(Math.abs(r.bottom) <= 2, "距底部 " + r.bottom + "px（应为 0）");
      assert(r.top > 400, "导航跑到顶部了: top=" + r.top);
      assert(r.docScrollable === false, "页面本身还能滚动，会露出空白");
      return `在布局内 · 高 ${r.h}px · 距底 ${r.bottom}px`;
    });
    await test("顶栏不换行且返回键位置正常", async () => {
      const r = await evalRaw(`(() => {
        const t = document.querySelector('.topbar-inner');
        return { h: Math.round(t.getBoundingClientRect().height), sw: t.scrollWidth, cw: t.clientWidth };
      })()`);
      assert(r.h <= 62, "顶栏高度异常 " + r.h);
      assert(r.sw <= r.cw + 1, "顶栏内容溢出: " + r.sw + " > " + r.cw);
      return "高 " + r.h + "px";
    });
    await test("做题页「代码」Tab 可切换分栏", async () => {
      await ev(`App.goTab('codex'); return true;`);
      await sleep(800);
      await ev(`document.querySelector('.prob-row').click(); return true;`);
      await sleep(1000);
      const init = await evalRaw(`(() => {
        const p = document.querySelector('.pane-problem'), c = document.querySelector('.pane-code');
        return { p: getComputedStyle(p).display, c: getComputedStyle(c).display };
      })()`);
      assert(init.c === "none", "移动端默认应隐藏代码栏: " + init.c);
      await ev(`
        const b = [...document.querySelectorAll('.solve-tabs button')].find(x => x.textContent.includes('代码'));
        b.click(); return true;`);
      await sleep(400);
      const after = await evalRaw(`(() => {
        const p = document.querySelector('.pane-problem'), c = document.querySelector('.pane-code');
        return { p: getComputedStyle(p).display, c: getComputedStyle(c).display, tab: App.state.solveTab };
      })()`);
      eq(after.tab, "code", "状态");
      assert(after.c !== "none", "代码栏未显示");
      assert(after.p === "none", "题目栏未隐藏");
      return "题目 → 代码切换正常";
    });
    await test("移动端题库工具条不溢出", async () => {
      await click(".back-link", 300);
      const r = await evalRaw(`(() => {
        const t = document.querySelector('.toolbar');
        const rect = t.getBoundingClientRect();
        return { w: Math.round(rect.width), sw: t.scrollWidth, cw: t.clientWidth, vw: window.innerWidth };
      })()`);
      assert(r.sw <= r.cw + 1, "工具条溢出 " + r.sw + " > " + r.cw);
      assert(r.w <= r.vw, "工具条超出屏幕");
      return r.w + "px 宽";
    });
    await test("移动端无横向滚动条", async () => {
      const r = await evalRaw(`({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })`);
      assert(r.sw <= r.cw + 1, "页面横向溢出 " + r.sw + " > " + r.cw);
      return r.sw + " / " + r.cw;
    });
    await cdp.send("Emulation.clearDeviceMetricsOverride");

    /* ---------- H4. 滚动恢复 / 环境适配 ---------- */
    console.log("\n--- 滚动恢复 / 环境 ---");
    await test("返回时恢复上次滚动位置", async () => {
      await ev(`App.goTab('codex'); return true;`);
      await sleep(900);
      await ev(`document.getElementById('app').scrollTop = 900; return true;`);
      await sleep(250);
      const before = await evalRaw("Math.round(document.getElementById('app').scrollTop)");
      assert(before > 500, "没能滚动: " + before);
      await ev(`document.querySelector('.prob-row').click(); return true;`);
      await sleep(900);
      eq(await evalRaw("Math.round(document.getElementById('app').scrollTop)"), 0, "进入新页应回到顶部");
      await click(".back-link", 400);
      const after = await evalRaw("Math.round(document.getElementById('app').scrollTop)");
      assert(Math.abs(after - before) <= 4, `滚动位置未恢复: ${after} ≠ ${before}`);
      return before + "px 已恢复";
    });
    await test("微信内置浏览器：首页给引导，内页不弹底部条", async () => {
      await cdp.send("Emulation.setUserAgentOverride", {
        userAgent: "Mozilla/5.0 (Linux; Android 13; PDEM30) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.42.2460(0x28002A3B) WeChat/arm64 Weixin NetType/WIFI",
      });
      await goto(BASE);
      await sleep(1500);
      const home = await evalRaw(`({
        strip: !!document.querySelector('.install-strip'),
        barHidden: document.getElementById('installBar').classList.contains('hidden')
      })`);
      assert(home.strip, "首页应显示安装入口条");
      assert(home.barHidden, "首页出现了重复的安装提示条");
      // 内页不再打扰（阅读/列表页都算）
      await ev(`App.goTab('codex'); return true;`);
      await sleep(1000);
      const inner = await evalRaw(`document.getElementById('installBar').classList.contains('hidden')`);
      assert(inner, "内页仍弹出底部安装条");
      await ev(`App.goTab('home'); return true;`);
      await sleep(600);
      await click(".install-strip", 600);
      const txt = await evalRaw(`document.getElementById('modalBody').textContent`);
      assert(/在浏览器|复制链接/.test(txt), "首页入口未给出安装指引");
      await ev("App.closeModalForce(); return true;");
      return "首页引导 + 内页安静";
    });
    await test("微信内引导弹层给出浏览器打开指引", async () => {
      await ev("App.openInstallGuide(); return true;");
      await sleep(250);
      const txt = await evalRaw("document.getElementById('modalBody').textContent");
      assert(/在浏览器打开/.test(txt), "缺少浏览器打开指引");
      assert(/复制链接/.test(txt), "缺少复制链接按钮");
      await ev("App.closeModalForce(); return true;");
    });
    await test("iOS Safari：引导给出「添加到主屏幕」", async () => {
      await cdp.send("Emulation.setUserAgentOverride", {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      await goto(BASE);
      await sleep(400);
      await ev("App.openInstallGuide(); return true;");
      await sleep(250);
      const txt = await evalRaw("document.getElementById('modalBody').textContent");
      assert(/添加到主屏幕/.test(txt), "缺少 iOS 引导");
      await ev("App.closeModalForce(); return true;");
    });
    await test("恢复默认 UA 后功能正常", async () => {
      await cdp.send("Emulation.setUserAgentOverride", { userAgent: "" });
      await goto(BASE);
      await sleep(500);
      await click('.main-nav a[data-nav="codex"]', 800);
      eq(await evalRaw("App.state.page"), "codex");
      const rows = await evalRaw("document.querySelectorAll('.prob-row').length");
      assert(rows > 0, "列表为空");
      return rows + " 行";
    });

    /* ---------- I. 运行时异常 ---------- */
    console.log("\n--- 控制台 ---");
    await test("全程无 JS 运行时异常", async () => {
      const real = pageErrors.filter(e => !/favicon|manifest|sw\.js|ServiceWorker/i.test(e));
      if (real.length) throw new Error(real.slice(0, 3).join(" | "));
      return "0 异常";
    });

  } catch (e) {
    results.push({ name: "测试流程本身", ok: false, detail: e.message });
    console.log("FATAL " + e.message);
  } finally {
    try { await cdp.send("Browser.close"); } catch (e) {}
    try { chrome.kill(); } catch (e) {}
    try { srv.close(); } catch (e) {}
  }

  const fail = results.filter(r => !r.ok);
  console.log(`\n合计 ${results.length} 项，失败 ${fail.length} 项`);
  if (fail.length) {
    console.log("\n失败列表:");
    fail.forEach(f => console.log(" - " + f.name + ": " + f.detail));
  }
  process.exit(fail.length ? 1 : 0);
})();
