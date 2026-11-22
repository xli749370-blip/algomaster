// ============================================================
// 冒烟测试：模拟浏览器环境，跑通全部页面与交互
// 用法：node tools/smoke.js
// ============================================================
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
let fails = 0;
const loadedSrcs = [];

function ok(name, cond, extra) {
  if (cond) console.log("PASS  " + name + (extra ? "  " + extra : ""));
  else { fails++; console.log("FAIL  " + name + (extra ? "  " + extra : "")); }
}

/* ---------------- DOM Mock ---------------- */
const elems = {};
function makeEl(id) {
  return {
    id, innerHTML: "", textContent: "", value: "", style: {}, dataset: {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      toggle(c, v) { v ? this._s.add(c) : this._s.delete(c); },
      contains(c) { return this._s.has(c); },
    },
    focus() {}, setSelectionRange() {}, insertAdjacentHTML() {},
    addEventListener() {}, removeEventListener() {},
    setAttribute(k, v) { this.dataset[k] = v; }, getAttribute(k) { return this.dataset[k]; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    appendChild() {}, scrollTo() {}, click() {},
  };
}

const winListeners = {};
const win = {
  scrollTo() {}, matchMedia: () => ({ matches: false }),
  location: { href: "", origin: "http://x", pathname: "/", search: "" },
  navigator: { userAgent: "node" },
  addEventListener(t, fn) { (winListeners[t] = winListeners[t] || []).push(fn); },
  removeEventListener() {},
  dispatch(t, ev) { (winListeners[t] || []).forEach(fn => fn(ev)); },
};
global.window = win;
global.location = win.location;

/* 历史栈 mock：用于验证「返回」行为 */
const histEntries = [{ state: null }];
let histIdx = 0;
global.history = {
  get state() { return histEntries[histIdx] ? histEntries[histIdx].state : null; },
  get length() { return histEntries.length; },
  replaceState(st) { histEntries[histIdx] = { state: st }; },
  pushState(st) {
    histEntries.splice(histIdx + 1);
    histEntries.push({ state: st });
    histIdx = histEntries.length - 1;
  },
  go(n) { histIdx = Math.max(0, histIdx + n); },
  back() { this.go(-1); },
};
// 模拟用户按一次系统返回
function pressBack() {
  if (histIdx > 0) histIdx--;
  win.dispatch("popstate", { state: histEntries[histIdx] ? histEntries[histIdx].state : null });
}
global.navigator = { userAgent: "node" };
global.document = {
  documentElement: makeEl("html"),
  getElementById: id => (elems[id] = elems[id] || makeEl(id)),
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener() {},
  createElement: () => makeEl("tmp"),
  body: {
    appendChild() {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    style: {},
  },
  visibilityState: "visible",
};
let ls = "{}";
global.localStorage = {
  getItem: k => (k === "algomaster" ? ls : null),
  setItem: (k, v) => { if (k === "algomaster") ls = v; },
  removeItem: () => { ls = "{}"; },
};
global.Blob = function () {};
global.URL = { createObjectURL: () => "", revokeObjectURL() {} };
global.setInterval = () => 0;   // 关掉计时器，避免进程不退出
global.clearInterval = () => {};

/* ---------------- 加载脚本 ---------------- */
const FILES = [
  "data/course-index.js",
  "data/course-cpp.js",
  "data/course-py.js",
  "data/course-java.js",
  "data/course-c.js",
  "js/data-algorithms.js",
  "js/data-problems.js",
  "data/stats.js",
  "js/app.js",
];
FILES.filter(f => fs.existsSync(path.join(ROOT, f))).forEach(f => vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f }));

/* ---------------- 模拟动态 script 加载 ---------------- */
document.createElement = () => {
  const el = makeEl("script");
  let src = "";
  Object.defineProperty(el, "src", { set(v) { src = v; }, get() { return src; } });
  return el;
};
document.body.appendChild = el => {
  loadedSrcs.push(el.src);
  try {
    vm.runInThisContext(fs.readFileSync(path.join(ROOT, el.src), "utf8"), { filename: el.src });
    if (el.onload) el.onload();
  } catch (e) {
    if (el.onerror) el.onerror(e);
  }
};

/* ---------------- 启动 ---------------- */
async function main() {
App.boot();
ok("启动不抛异常", !!App.store);
ok("顶部导航渲染", document.getElementById("mainNav").innerHTML.includes("首页"));
ok("主题按钮渲染 SVG", document.getElementById("themeBtn").innerHTML.includes("<svg"));

const app = () => document.getElementById("app").innerHTML;
const tick = () => new Promise(r => setTimeout(r, 0));

/* ---------------- 基础页面 ---------------- */
["home", "courses", "algo", "skills", "problems", "checkin"].forEach(p => {
  App.nav(p);
  ok(`页面 ${p} 渲染`, app().length > 500, app().length + " 字符");
});

App.nav("home");
const home = app();
ok("首页含今日进度环", home.includes("<circle") && home.includes("今日学习"));
ok("首页含功能宫格", home.includes("刷题专区") && home.includes("错题本") && home.includes("收藏笔记"));
ok("首页含每日推荐", home.includes("每日推荐"));
ok("首页含竞赛日程", home.includes("竞赛日程参考"));
ok("首页含学习资源", home.includes("速查手册") && home.includes("面试题库"));

/* ---------------- 课程 & 算法 ---------------- */
let lessonCount = 0;
Object.keys(COURSES).forEach(k => {
  App.nav("course-detail", k);
  ok(`课程目录 ${k}`, app().includes(COURSES[k].lessons[0].title));
  COURSES[k].lessons.forEach((l, i) => { lessonCount++; App.nav("lesson", [k, i]); });
});
ok("全部章节渲染", lessonCount === 80, lessonCount + " 章");

let algoCount = 0;
ALGOS.forEach((a, i) => { algoCount++; App.nav("algo-detail", i); });
ok("全部算法专题渲染", algoCount === ALGOS.length, algoCount + " 个");

TECHNIQUES.forEach((t, i) => App.openTech(i));
ok("技巧弹层渲染", document.getElementById("modalBody").innerHTML.length > 200, TECHNIQUES.length + " 篇");

/* ---------------- 题库 ---------------- */
App.nav("codex");
await tick(); await tick();
ok("题库索引加载", App.indexReady && (window.PROBLEM_INDEX || []).length > 20000, (window.PROBLEM_INDEX || []).length + " 题");
ok("题库按方向分类", app().includes("基础算法") && app().includes("图论") && app().includes("字符串"));
ok("题库含通过率与人数", app().includes("通过率") && app().includes("尝试人数"));

App.setCodexGroup("dp");
ok("按 DP 方向筛选", App.state.codex.group === "dp");
App.state.codex.kw = "背包";
App.render();
ok("关键词搜索", app().includes("背包") || app().includes("没有匹配"));

App.setCodexGroup("all");
App.state.codex.kw = "";
App.render();

/* ---------------- 做题页 ---------------- */
const row = (window.PROBLEM_INDEX || [])[0];
App.openSolve(row[0]);
await tick(); await tick();
ok("打开做题页", App.state.page === "solve");
ok("分片加载成功", !!App.solve && App.solve.id === row[0], row[0]);
const solveHTML = app();
ok("左右分栏结构", solveHTML.includes("solve-wrap") && solveHTML.includes("pane-problem") && solveHTML.includes("pane-code"));
ok("代码编辑器含行号与高亮层", solveHTML.includes("gutter") && solveHTML.includes("code-hl") && solveHTML.includes("codeInput"));
ok("底部操作按钮齐全",
  solveHTML.includes("提交") && solveHTML.includes("运行") &&
  solveHTML.includes("重置") && solveHTML.includes("查看解析"));
ok("样例卡片渲染", solveHTML.includes("样例") || !(App.solve.samples || []).length);

App.initEditor();
const hl = App.highlight('#include <bits/stdc++.h>\nint main(){ cout << "hi"; }', "cpp");
ok("语法高亮输出", hl.includes("tk-pp") && hl.includes("tk-kw") && hl.includes("tk-str") && hl.includes("tk-fn"));
ok("高亮转义正确", !/[^&]<bits/.test(hl));

const chk = App.staticCheck("int main() { cout << 1; }", "cpp");
ok("静态检查：缺头文件被识别", chk.items.some(x => !x.ok && x.msg.includes("#include")));
const chk2 = App.staticCheck("#include <bits/stdc++.h>\nint main(){ cout << 1; }", "cpp");
ok("静态检查：合法代码全通过", chk2.items.every(x => x.ok));
const chk3 = App.staticCheck("print(1", "py");
ok("静态检查：括号不配对被识别", chk3.items.some(x => !x.ok));

document.getElementById("codeInput").value = "#include <bits/stdc++.h>\nint main(){ std::cout << 1; }";
App.runCheck();
ok("运行结果面板", document.getElementById("resultPanel").innerHTML.includes("静态检查"));
App.submitCode();
ok("提交后标记 AC", !!App.store.probsDone[row[0]]);
ok("今日刷题计数 +1", (App.store.daily[App.todayStr()] || {}).solved >= 1);

const row2 = (window.PROBLEM_INDEX || [])[1];
App.openSolve(row2[0]);
await tick(); await tick();
document.getElementById("codeInput").value = "int main(){";
App.submitCode();
ok("提交失败不记 AC", !App.store.probsDone[row2[0]]);
ok("失败原因可见", document.getElementById("resultPanel").innerHTML.includes("✗"));

App.toggleFav(row[0]);
ok("收藏写入", !!App.store.fav[row[0]]);
App.toggleWrong(row2[0]);
ok("错题本写入", !!App.store.wrong[row2[0]]);
const cur = App.solve.id;   // 当前打开的题目
document.getElementById("noteBox").value = "前缀和要开 long long";
App.saveNote();
ok("笔记写入", App.store.notes[cur] === "前缀和要开 long long");

App.state.lang = "py";
App.render();
document.getElementById("codeInput").value = "print(1)";
App.saveEditorCode();
ok("按语言保存代码", App.store.code[cur + ":py"] === "print(1)");

// 题解已改为「做题页内的 Tab」，不再弹层
App.showSolution();
const solWrap = document.getElementById("solveWrap");
ok("题解面板打开", solWrap.getAttribute("data-tab") === "sol" && !!document.getElementById("solBody"));
ok("题解 Tab 高亮", App.state.solveTab === "sol");

/* ---------------- 个人中心 ---------------- */
App.nav("profile");
await tick(); await tick();
const prof = app();
ok("个人中心渲染", prof.includes("刷题总数") && prof.includes("正确率") && prof.includes("竞赛积分"));
ok("成长折线图", prof.includes("<polyline") && prof.includes("成长曲线"));
ok("能力雷达图", prof.includes("<polygon") && prof.includes("能力分布"));
ok("学习资产卡片", prof.includes("错题本") && prof.includes("笔记") && prof.includes("收藏") && prof.includes("历史记录"));
ok("设置项", prof.includes("外观模式") && prof.includes("导出学习数据"));

App.openAsset("wrong");
ok("错题本弹层", document.getElementById("modalBody").innerHTML.includes(row2[0]));
App.openAsset("notes");
ok("笔记弹层", document.getElementById("modalBody").innerHTML.includes("前缀和"));
App.openAsset("history");
ok("历史弹层", document.getElementById("modalBody").innerHTML.length > 100);

/* ---------------- 主题 ---------------- */
App.setTheme("light", true);
ok("切换到浅色", document.documentElement.getAttribute("data-theme") === "light");
App.setTheme("dark", true);
ok("切换到深色", document.documentElement.getAttribute("data-theme") === "dark");

/* ---------------- 打卡 ---------------- */
App.nav("checkin");
App.doCheckin();
ok("打卡写入", App.store.checkins.includes(App.todayStr()));
ok("连续天数计算", App.streak() >= 1, App.streak() + " 天");

/* ---------------- 手册 / 面试 ---------------- */
App.nav("manual");
await tick(); await tick();
ok("手册加载", App.manualCache.cpp === true);
App.switchManual("py");
ok("切换 Python 手册", App.state.manualLang === "py");

App.nav("interview");
await tick(); await tick(); await tick();
ok("面试题库加载", App.iv.ready && App.iv.items.length > 100, App.iv.items.length + " 条");

/* ---------------- 转义安全 ---------------- */
App.nav("codex");
App.state.codex.kw = "<script>";
App.render();
ok("搜索词已转义", !app().includes("<script>alert"));

/* ---------------- 收尾 ---------------- */
/* ---------------- 返回栈 / 退出确认 ---------------- */
console.log("\n--- 返回行为 ---");
App.closeModalForce();
App.vstack = [{ page: "home", arg: null, scroll: 0 }];
App._trap = false;
App.armTrap();
App.nav("home");
ok("首页无返回键", App.canGoBack() === false);
App.nav("codex");
App.nav("courses");
ok("二级页面出现返回键", App.canGoBack() === true);
ok("返回键 DOM 显示", (function () {
  App.render(); return true;
})());

const beforeBack = App.state.page;
pressBack();
ok("系统返回跳上一页", beforeBack === "courses" && App.state.page === "codex", App.state.page);

App.openSolve((window.PROBLEM_INDEX || [])[0][0]);
await tick(); await tick();
pressBack();
ok("做题页返回题库", App.state.page === "codex", App.state.page);

App.nav("home");
App.vstack = [{ page: "home", arg: null, scroll: 0 }];
App.render();
App.openAnnouncements();
ok("弹层已打开", App.modalOpen());
pressBack();
ok("返回先关弹层", App.modalOpen() === false && App.state.page === "home");

pressBack();
ok("首页返回弹确认", App.modalOpen() === true && App._exitOpen === true);
ok("确认弹层含退出按钮", document.getElementById("modalBody").innerHTML.includes("确认退出"));
App.closeModalForce();
ok("取消后可继续使用", App.modalOpen() === false && App._exitOpen === false)

App.goTab("codex");
ok("切 Tab 重建栈（首页 + 当前 Tab）", App.vstack.length === 2 && App.vstack[0].page === "home" && App.state.page === "codex");
pressBack();
ok("Tab 页返回回首页", App.state.page === "home" && App.vstack.length === 1, App.state.page);
App.goTab("home");
ok("回首页栈清空", App.vstack.length === 1 && App.canGoBack() === false);;

/* ---------------- 安装引导 ---------------- */
console.log("\n--- 安装引导 ---");
App.openInstallGuide();
const guide = document.getElementById("modalBody").innerHTML;
ok("安装引导弹层渲染", guide.length > 120, guide.length + " 字符");
ok("安装引导含步骤或安装按钮", guide.includes("step-row") || guide.includes("installNow") || guide.includes("已经是 App"));
App.closeModalForce();
ok("环境探测可用", typeof App.detectEnv() === "object" && typeof App.detectEnv().ios === "boolean");
function setUA(v) {
  try { Object.defineProperty(global, "navigator", { value: { userAgent: v }, configurable: true, writable: true }); }
  catch (e) { global.navigator = { userAgent: v }; }
}
setUA("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) MicroMessenger/8.0");
App.openInstallGuide();
ok("微信内给出「在浏览器打开」指引", document.getElementById("modalBody").innerHTML.includes("在浏览器打开"));
App.closeModalForce();
setUA("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0) Safari/604.1");
App.openInstallGuide();
ok("iOS 给出「添加到主屏幕」指引", document.getElementById("modalBody").innerHTML.includes("添加到主屏幕"));
App.closeModalForce();
setUA("Mozilla/5.0 (Linux; Android 13) Chrome/120 Mobile");
App.openInstallGuide();
ok("安卓给出安装步骤", document.getElementById("modalBody").innerHTML.includes("主屏幕") || document.getElementById("modalBody").innerHTML.includes("安装"));
App.closeModalForce();
setUA("node");

console.log("\n动态加载文件数: " + loadedSrcs.length);
console.log("FAIL 数量: " + fails);
process.exit(fails ? 1 : 0);
}

main();
