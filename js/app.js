// ============================================================
// AlgoMaster · 主逻辑
// 极简学习工具：首页 / 题库 / 课程 / 算法 / 做题 / 个人中心
// ============================================================

/* ---------------- 图标（线性 1.6px，统一风格） ---------------- */
const ICONS = {
  home: '<path d="M3 10.6 12 3l9 7.6V20a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1z"/>',
  code: '<path d="M8.5 6.5 3 12l5.5 5.5M15.5 6.5 21 12l-5.5 5.5"/>',
  book: '<path d="M5 4.5A2 2 0 0 1 7 3h12v18H7a2 2 0 0 1-2-2z"/><path d="M9 3v18"/>',
  cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0"/>',
  zap: '<path d="M13 2.5 4.5 13.5H11l-1 8L20 10h-6.5z"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2.5 12h2M19.5 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>',
  moon: '<path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z"/>',
  bell: '<path d="M18 8.6a6 6 0 1 0-12 0c0 5.1-2 6.6-2 6.6h16s-2-1.5-2-6.6"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>',
  flame: '<path d="M12 3c3.2 3.7 5.4 6.5 5.4 9.8A5.4 5.4 0 0 1 6.6 13C6.6 9.4 8.8 6.5 12 3z"/>',
  play: '<path d="M8.5 5.5 18 12l-9.5 6.5z"/>',
  send: '<path d="M12 19.5V5"/><path d="M6 10.5 12 4.5l6 6"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4.5V10h5.5"/>',
  arrowLeft: '<path d="M15 18.5 8.5 12 15 5.5"/>',
  chevron: '<path d="M9.5 6 15.5 12l-6 6"/>',
  search: '<circle cx="11" cy="11" r="6.6"/><path d="M20 20l-3.6-3.6"/>',
  star: '<path d="M12 3.6l2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.8l5.8-.9z"/>',
  bookmark: '<path d="M6.5 3.5h11v17L12 16.7 6.5 20.5z"/>',
  note: '<path d="M6 3.5h8.5L19 8v12.5H6z"/><path d="M9.2 12.5h6.6M9.2 16h4.4"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.2V12l3.4 2"/>',
  trophy: '<path d="M8 4.5h8V6h3v2.6A3.6 3.6 0 0 1 15.4 12H16"/><path d="M8 6H5v2.6A3.6 3.6 0 0 0 8.6 12H8"/><path d="M12 12.2V16M8.6 20.5h6.8"/>',
  target: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
  chart: '<path d="M4 20v-8.4M10 20V4.5M16 20v-5.6M21.5 20H3"/>',
  layers: '<path d="M12 3.5 20.5 8 12 12.5 3.5 8z"/><path d="M4 12.5 12 17l8-4.5M4 16.8 12 21l8-4.2"/>',
  flag: '<path d="M6 21V3.5h12l-2.2 4.2L18 12H6"/>',
  alert: '<path d="M12 3.8 21 19.5H3z"/><path d="M12 9.5v4M12 16.5v.6"/>',
  inbox: '<path d="M4 8.2h16v11.3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 8.2 6.2 3.5h11.6L20 8.2"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
  filter: '<path d="M3.5 6.5h17M6.5 12h11M10 17.5h4"/>',
  dict: '<path d="M5 3.5h11a3 3 0 0 1 3 3V20.5H7.5A2.5 2.5 0 0 1 5 18z"/><path d="M9 7.5h6"/>',
  download: '<path d="M12 3.5v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M4.5 19.5h15"/>',
  share: '<path d="M12 15.5V3.5"/><path d="M8 7.5 12 3.5l4 4"/><path d="M5 13v7.5h14V13"/>',
  lock: '<rect x="4.8" y="10.4" width="14.4" height="10.2" rx="2.4"/><path d="M8.4 10.4V7.7a3.6 3.6 0 0 1 7.2 0v2.7"/><path d="M12 14.5v2.4"/>',
  crown: '<path d="M3.4 8.2 7.2 11.6 12 4.6l4.8 7 3.8-3.4-1.7 9.8H5.1z"/><path d="M5.6 20.4h12.8"/>',
  medal: '<circle cx="12" cy="15" r="4.6"/><path d="M8.4 3.6 12 9.4l3.6-5.8"/>',
  palette: '<path d="M12 3.6a8.4 8.4 0 0 0 0 16.8c1.3 0 1.9-.9 1.9-1.8 0-1-.7-1.6-.7-2.4 0-.9.7-1.5 1.7-1.5h1.6a4 4 0 0 0 3.9-4C20.4 6.6 16.7 3.6 12 3.6z"/><circle cx="8.2" cy="11" r=".9"/><circle cx="11" cy="8.2" r=".9"/><circle cx="14.6" cy="9.2" r=".9"/>',
};

function icon(name, size) {
  const s = size || 16;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="${s}" height="${s}">${ICONS[name] || ""}</svg>`;
}

/* ---------------- 题库分组（27 个细分类 → 8 个方向） ---------------- */
const GROUPS = [
  { key: "all", name: "全部" },
  { key: "basic", name: "基础算法" },
  { key: "greedy", name: "贪心" },
  { key: "dp", name: "DP" },
  { key: "search", name: "搜索" },
  { key: "graph", name: "图论" },
  { key: "math", name: "数论" },
  { key: "string", name: "字符串" },
  { key: "sim", name: "模拟" },
];

const CAT2GROUP = {
  "数组": "basic", "排序": "basic", "二分": "basic", "双指针": "basic", "前缀和": "basic",
  "滑动窗口": "basic", "位运算": "basic", "栈": "basic", "单调栈": "basic", "栈队列": "basic",
  "链表": "basic", "树": "basic", "矩阵": "basic", "区间": "basic", "差分": "basic",
  "堆": "basic", "树状数组": "basic", "区间查询": "basic",
  "贪心": "greedy", "DP": "dp", "回溯": "search", "图论": "graph", "并查集": "graph",
  "数学": "math", "字符串": "string", "模拟": "sim", "博弈": "sim",
};

const groupOf = cat => CAT2GROUP[cat] || "basic";
const DIFF_NAME = ["简单", "中等", "较难"];

const LANG_NAME = { cpp: "C++", py: "Python", java: "Java", c: "C" };

const CODE_TPL = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // 在此编写你的代码

    return 0;
}`,
  py: `import sys
input = sys.stdin.readline


def solve():
    # 在此编写你的代码
    pass


if __name__ == "__main__":
    solve()`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);

        // 在此编写你的代码

    }
}`,
  c: `#include <stdio.h>

int main() {
    // 在此编写你的代码

    return 0;
}`,
};

const NAV = [
  ["home", "首页", "home"],
  ["codex", "题库", "code"],
  ["courses", "课程", "book"],
  ["algo", "算法", "cpu"],
  ["profile", "我的", "user"],
];

const NAV_PARENT = {
  "course-detail": "courses", "lesson": "courses", "skills": "courses",
  "manual": "courses", "interview": "courses",
  "algo-detail": "algo", "solve": "codex", "checkin": "profile",
  "problems": "codex",
};

/* ============================================================
   账号 / 头像 / 头像框 / 成就
   ============================================================ */

// 预置头像：本地账号，不联网
const AVATARS = [
  { id: "fox", e: "🦊", a: "#f6ab63", b: "#d97a35" },
  { id: "panda", e: "🐼", a: "#a9b4c1", b: "#66717f" },
  { id: "tiger", e: "🐯", a: "#f2b842", b: "#c07c1e" },
  { id: "owl", e: "🦉", a: "#b18f68", b: "#6f5839" },
  { id: "whale", e: "🐳", a: "#63b0d8", b: "#33719b" },
  { id: "rocket", e: "🚀", a: "#8a99db", b: "#4f5cae" },
  { id: "brain", e: "🧠", a: "#e28fa4", b: "#b15773" },
  { id: "bolt", e: "⚡", a: "#e6c852", b: "#b6941f" },
  { id: "leaf", e: "🌱", a: "#77c48f", b: "#418e60" },
  { id: "target", e: "🎯", a: "#d87a72", b: "#a54240" },
  { id: "fire", e: "🔥", a: "#ec8a58", b: "#c34c28" },
  { id: "cap", e: "🎓", a: "#94a3da", b: "#57639e" },
];

// 头像框：颜色走 --f1/--f2/--f3，由 CSS 画成金属环
const FRAMES = [
  { id: "bronze", name: "青铜环", tier: 1, c1: "#a9743f", c2: "#e8c69c", c3: "#8a5c30" },
  { id: "silver", name: "白银环", tier: 1, c1: "#8f9cab", c2: "#eef3f8", c3: "#6f7c8a" },
  { id: "gold", name: "黄金环", tier: 2, c1: "#b8902c", c2: "#f6e29a", c3: "#96721e" },
  { id: "platinum", name: "铂金环", tier: 2, c1: "#6fbdb6", c2: "#dcfaf6", c3: "#4d9b95" },
  { id: "diamond", name: "钻石环", tier: 3, c1: "#6f9fe6", c2: "#dcf0ff", c3: "#4b79c2" },
  { id: "ember", name: "余烬环", tier: 1, c1: "#b0653f", c2: "#f3c3a1", c3: "#8b4a2c" },
  { id: "flame", name: "烈焰环", tier: 2, c1: "#cf5b34", c2: "#fbc189", c3: "#a63f20" },
  { id: "inferno", name: "赤焰环", tier: 3, c1: "#c33a28", c2: "#ffc07a", c3: "#982516" },
  { id: "scholar", name: "学者环", tier: 2, c1: "#5f7fc6", c2: "#c7d8f8", c3: "#45619f" },
  { id: "master", name: "大师环", tier: 3, c1: "#7a62c8", c2: "#d6c7fb", c3: "#5c47a4" },
  { id: "scout", name: "探索环", tier: 1, c1: "#3f9d97", c2: "#b3ece5", c3: "#2c7b76" },
  { id: "contest", name: "竞赛环", tier: 2, c1: "#bd8434", c2: "#f7d79c", c3: "#95661f" },
  { id: "ink", name: "墨迹环", tier: 1, c1: "#8a7d9e", c2: "#e0d8ec", c3: "#6a5f7c" },
  { id: "legend", name: "传说环", tier: 3, c1: "#c99b2e", c2: "#fff2c4", c3: "#a67b16" },
];

// 成就：达到 need 即可领取，领取后解锁对应头像框
const ACH = [
  { id: "first-ac", name: "破冰", desc: "通过第一道题", frame: "bronze", icon: "check", need: 1, of: s => s.solved },
  { id: "ac-10", name: "小试牛刀", desc: "累计 AC 10 道", frame: "silver", icon: "target", need: 10, of: s => s.solved },
  { id: "ac-50", name: "渐入佳境", desc: "累计 AC 50 道", frame: "gold", icon: "star", need: 50, of: s => s.solved },
  { id: "ac-150", name: "百里挑一", desc: "累计 AC 150 道", frame: "platinum", icon: "medal", need: 150, of: s => s.solved },
  { id: "ac-400", name: "四百达成", desc: "累计 AC 400 道", frame: "diamond", icon: "crown", need: 400, of: s => s.solved },
  { id: "streak-3", name: "三日不辍", desc: "连续打卡 3 天", frame: "ember", icon: "flame", need: 3, of: s => s.streak },
  { id: "streak-7", name: "一周不断", desc: "连续打卡 7 天", frame: "flame", icon: "flame", need: 7, of: s => s.streak },
  { id: "streak-30", name: "月度铁人", desc: "连续打卡 30 天", frame: "inferno", icon: "zap", need: 30, of: s => s.streak },
  { id: "lesson-20", name: "课堂常客", desc: "学完 20 节课", frame: "scholar", icon: "book", need: 20, of: s => s.lessons },
  { id: "lesson-60", name: "理论扎实", desc: "学完 60 节课", frame: "master", icon: "book", need: 60, of: s => s.lessons },
  { id: "algo-5", name: "专题入门", desc: "完成 5 个算法专题", frame: "scout", icon: "layers", need: 5, of: s => s.algos },
  { id: "algo-20", name: "专题通关", desc: "完成 20 个算法专题", frame: "contest", icon: "trophy", need: 20, of: s => s.algos },
  { id: "note-10", name: "笔耕不辍", desc: "写下 10 条解题笔记", frame: "ink", icon: "note", need: 10, of: s => s.notes },
  { id: "all-round", name: "全面发展", desc: "八大方向都拿到 AC", frame: "legend", icon: "crown", need: 8, of: s => s.groups },
];

const FRAME_OF_ACH = ACH.reduce((m, a) => (m[a.id] = a.frame, m), {});

/* ============================================================
   App
   ============================================================ */
const App = {
  state: {
    page: "home",
    course: null,
    lesson: null,
    algo: null,
    codex: { group: "all", diff: "all", kw: "", page: 0 },
    manualLang: "cpp",
    manualKw: "",
    ivTopic: "all",
    ivShow: 40,
    lang: "cpp",
    solveTab: "problem",
    assetTab: "wrong",
  },
  store: null,
  theme: "dark",
  timer: null,

  /* 页面栈 / 返回体系 */
  vstack: [],
  _trap: false,        // 浏览器历史中是否已布好「护栏」条目
  _exitOpen: false,    // 退出确认弹层是否打开
  _lastRendered: null, // 上一次渲染的页面（用于判断是否播放切换动画）

  /* ---------------- 基础工具 ---------------- */
  esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
  pad3(n) { return String(n).padStart(3, "0"); },

  _loaded: {},
  loadScript(src) {
    if (this._loaded[src]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => { this._loaded[src] = true; resolve(); };
      s.onerror = () => reject(new Error("加载失败: " + src));
      document.body.appendChild(s);
    });
  },

  todayStr() {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  },
  fmtDate(d) {
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  },

  toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => el.classList.remove("show"), 1800);
  },

  /* ---------------- 存储 ---------------- */
  loadStore() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem("algomaster") || "{}"); } catch (e) { s = {}; }
    this.store = {
      checkins: s.checkins || [],
      lessonsDone: s.lessonsDone || {},
      algosDone: s.algosDone || {},
      probsDone: s.probsDone || {},
      daily: s.daily || {},
      wrong: s.wrong || {},
      fav: s.fav || {},
      notes: s.notes || {},
      history: s.history || [],
      code: s.code || {},
      lang: s.lang || "cpp",
      joined: s.joined || this.todayStr(),
      installStripHidden: !!s.installStripHidden,
      account: s.account || null,
      ach: {
        claimed: (s.ach && s.ach.claimed) || {},
        frame: (s.ach && s.ach.frame) || "",
      },
    };
    this.state.lang = this.store.lang;
  },
  saveStore() {
    this.store.lang = this.state.lang;
    try { localStorage.setItem("algomaster", JSON.stringify(this.store)); return true; }
    catch (e) { return false; }   // 主要是配额超限（QuotaExceededError）
  },

  today() {
    const k = this.todayStr();
    if (!this.store.daily[k]) this.store.daily[k] = { solved: 0, sec: 0 };
    return this.store.daily[k];
  },

  streak() {
    const set = new Set(this.store.checkins);
    let days = 0;
    const d = new Date();
    if (!set.has(this.todayStr())) d.setDate(d.getDate() - 1);
    while (set.has(this.fmtDate(d))) { days++; d.setDate(d.getDate() - 1); }
    return days;
  },

  /* ---------------- 主题 ---------------- */
  initTheme() {
    let t = "dark";
    try { t = localStorage.getItem("algomaster-theme") || t; }
    catch (e) {}
    if (!localStorage.getItem("algomaster-theme")) {
      t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    this.setTheme(t, true);
  },
  setTheme(t, silent) {
    this.theme = t;
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("algomaster-theme", t); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0b0e13" : "#f6f8fa");
    const btn = document.getElementById("themeBtn");
    if (btn) btn.innerHTML = t === "dark" ? icon("sun", 17) : icon("moon", 17);
    if (!silent) this.toast(t === "dark" ? "已切换到深色模式" : "已切换到浅色模式");
  },
  toggleTheme() { this.setTheme(this.theme === "dark" ? "light" : "dark"); },

  /* ---------------- 启动 ---------------- */
  boot() {
    this.loadStore();
    this.initTheme();
    this.syncViewport();
    this.placeNav();
    this.renderChrome();
    this.initHistory();
    this.nav(this.state.page || "home");
    this.startTimer();
    // 刷新 / 切到后台 / 关闭页面前，把没来得及落盘的编辑写回去
    window.addEventListener("pagehide", () => this.saveStore());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") this.saveStore();
    });
    window.addEventListener("resize", () => { this.syncViewport(); this.placeNav(); });
    window.addEventListener("orientationchange", () => setTimeout(() => { this.syncViewport(); this.placeNav(); }, 120));
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => this.syncViewport());
    }
  },

  /* 真实可视高度写入 --vh：国产浏览器注入横幅 / 底部工具栏动态收起时，
   100vh 会和肉眼所见对不上，导致页面底部露出一片空白 */
  syncViewport() {
    const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight || 0;
    if (h > 0) document.documentElement.style.setProperty("--vh", h / 100 + "px");
  },

  /* 窄屏把导航移进底部插槽（布局的一部分，不会飘）；
     宽屏放回顶栏。节点用 onclick 绑定，移动不会丢事件。 */
  placeNav() {
    const nav = document.getElementById("mainNav");
    const slot = document.getElementById("navSlot");
    const bar = document.querySelector(".topbar-inner");
    if (!nav || !slot || !bar) return;
    const narrow = window.matchMedia("(max-width: 760px)").matches;
    if (narrow && nav.parentNode !== slot) slot.appendChild(nav);
    else if (!narrow && nav.parentNode !== bar) bar.appendChild(nav);
  },

  /* 滚动容器是 main，不是 document */
  scrollEl() { return document.getElementById("app"); },
  scrollTop() { const el = this.scrollEl(); return el ? el.scrollTop || 0 : 0; },
  scrollTo(y) {
    const el = this.scrollEl();
    if (el) el.scrollTop = y || 0;
    else window.scrollTo(0, y || 0);
  },

  renderChrome() {
    document.getElementById("brandMark").innerHTML = icon("zap", 16);
    document.getElementById("mainNav").innerHTML = NAV.map(([k, label, ic]) =>
      `<a data-nav="${k}" onclick="App.goTab('${k}')">${icon(ic, 15)}<span>${label}</span></a>`).join("");
    document.getElementById("themeBtn").innerHTML = this.theme === "dark" ? icon("sun", 17) : icon("moon", 17);
    document.getElementById("msgBtn").innerHTML = icon("bell", 17);
    document.getElementById("modalCloseBtn").innerHTML = icon("x", 16);
    const back = document.getElementById("backBtn");
    if (back) back.innerHTML = icon("arrowLeft", 18);
    const ins = document.getElementById("installIcon");
    if (ins) ins.innerHTML = icon("download", 17);
    this.updateChrome();
  },

  updateChrome() {
    const chip = document.getElementById("streakChip");
    if (chip) chip.innerHTML = `${icon("flame", 13)} 连续 <b>${this.streak()}</b> 天`;
    const back = document.getElementById("backBtn");
    if (back) back.classList.toggle("show", this.canGoBack());
    const ta = document.getElementById("tbAvatar");
    if (ta && this.store) ta.innerHTML = this.renderAvatar("sm");
  },

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const t = this.today();
      t.sec = (t.sec || 0) + 20;
      if (t.sec % 60 === 0) this.saveStore();
    }, 20000);
  },

  /* ---------------- 导航 / 返回栈 ---------------- */

  // 参数比较（用于判断是否重复进入同一页面）
  sameArg(a, b) {
    const n = v => (v === undefined ? null : v);
    return JSON.stringify(n(a)) === JSON.stringify(n(b));
  },
  curEntry() { return this.vstack[this.vstack.length - 1] || null; },

  pushPage(page, arg) {
    const cur = this.curEntry();
    if (cur && cur.page === page && this.sameArg(cur.arg, arg)) return false;
    if (cur) cur.scroll = this.scrollTop();   // 记住离开时的滚动位置
    this.vstack.push({ page, arg: arg === undefined ? null : arg, scroll: 0 });
    if (this.vstack.length > 30) this.vstack.splice(1, this.vstack.length - 30);
    return true;
  },

  nav(page, arg, opts) {
    opts = opts || {};
    if (opts.replace && this.vstack.length) {
      this.vstack[this.vstack.length - 1] = { page, arg: arg === undefined ? null : arg, scroll: 0 };
    } else {
      this.pushPage(page, arg);
    }
    this.applyPage(page, arg, 0);
  },

  // 底部 Tab：切 Tab 时重置页面栈，返回键回到首页（与原生 App 一致）
  goTab(k) {
    if (this.modalOpen()) this.closeModal();
    this.vstack = k === "home"
      ? [{ page: "home", arg: null, scroll: 0 }]
      : [{ page: "home", arg: null, scroll: 0 }, { page: k, arg: null, scroll: 0 }];
    this.applyPage(k, null, 0);
  },

  applyPage(page, arg, scrollY) {
    this.saveStore();      // 离开页面前把当前编辑内容落盘
    this.state.page = page;
    if (page === "course-detail") this.state.course = arg;
    if (page === "lesson") { this.state.course = arg[0]; this.state.lesson = arg[1]; this.ensureCourse(arg[0]); }
    if (page === "algo-detail") this.state.algo = arg;
    if (page === "codex") this.ensureIndex();

    this.markNav();
    this.render();
    this.scrollTo(scrollY || 0);

    if (page === "manual") this.ensureManual(this.state.manualLang);
    if (page === "interview") this.ensureInterview();
    if (page === "profile") this.ensureIndex();
    this.armTrap();
  },

  /* 历史「护栏」：让系统返回键 / 手势 / 浏览器返回都先落到应用内，
     由我们自己决定「回上一页」还是「确认退出」，不会误退出页面。 */
  initHistory() {
    this.vstack = [{ page: "home", arg: null, scroll: 0 }];
    this._trap = false;
    try { history.replaceState({ am: 1, base: 1 }, ""); } catch (e) {}
    // 记住进入应用时的历史深度：退出时据此一次性跨过我们自己压的所有条目
    this._baseLen = history.length || 1;
    this.armTrap();
    window.addEventListener("popstate", e => this.onPop(e));
    // 从 bfcache 恢复（比如从别的页面返回）时，重建护栏
    window.addEventListener("pageshow", e => {
      if (!e.persisted) return;
      this._trap = false;
      try { history.replaceState({ am: 1, base: 1 }, ""); } catch (err) {}
      this.armTrap();
    });
  },

  armTrap() {
    if (this._trap) return;
    try { history.pushState({ am: 1, trap: 1 }, ""); this._trap = true; } catch (e) {}
  },

  onPop(e) {
    if (this._exiting) return;          // 正在退出，不再拦截
    const st = (e && e.state) || {};
    this._trap = false;

    // 已经退到应用之外（几乎不会发生）：重建并回首页
    if (!st.am) {
      try { history.replaceState({ am: 1, base: 1 }, ""); } catch (err) {}
      this.vstack = [{ page: "home", arg: null, scroll: 0 }];
      this.applyPage("home", null, 0);
      return;
    }

    // 1) 有弹层 → 先关弹层
    if (this.modalOpen()) { this.closeModal(); this.armTrap(); return; }

    // 2) 非首页 → 回到上一页
    if (this.vstack.length > 1) {
      this.vstack.pop();
      const prev = this.curEntry();
      this.applyPage(prev.page, prev.arg, prev.scroll || 0);
      return;                       // applyPage 内会重新布护栏
    }

    // 3) 首页 → 需要确认
    this.armTrap();                 // 先补护栏，避免连按直接退出
    this.confirmExit();
  },

  // 应用内返回（顶栏返回键 / 各页面返回链接）
  goBack() {
    if (this.modalOpen()) { this.closeModal(); return; }
    if (this.vstack.length > 1) {
      this.vstack.pop();
      const prev = this.curEntry();
      this.applyPage(prev.page, prev.arg, prev.scroll || 0);
      return;
    }
    this.confirmExit();
  },

  canGoBack() {
    // 首屏自动弹出的安装提示不算「可返回的页面」，否则首页会莫名多出返回箭头
    const m = document.getElementById("modal");
    const autoOnly = m && m.dataset.auto === "1" && !m.classList.contains("hidden");
    return this.vstack.length > 1 || (this.modalOpen() && !autoOnly);
  },

  /* ---------------- APK 壳桥接 ----------------
     在 WebView 壳里，网页没有关闭自己的能力：window.close 无效、history 退不出去、
     intent:// 也不会被 WebView 执行。所以返回键与退出必须交给原生处理，
     否则表现就是「点了确认退出还停在原页」。
     浏览器里这些接口不存在，逻辑自动回落到原来的降级方案。 */
  inShell() {
    try {
      return !!(window.AndroidShell && window.AndroidShell.isShell && window.AndroidShell.isShell());
    } catch (e) { return false; }
  },

  shellExit() {
    try {
      window.AndroidShell.exitApp();
      return true;
    } catch (e) { return false; }
  },

  /* 壳的物理返回键统一调用这里。返回值只作日志用途：
     handled = 网页已经处理（关弹层 / 回上一页 / 弹确认），壳不要退出 */
  hardwareBack() {
    if (this._exiting) return "handled";
    if (this.modalOpen()) { this.closeModal(); return "handled"; }
    if (this.vstack.length > 1) { this.goBack(); return "handled"; }
    this.confirmExit();
    return "handled";
  },

  confirmExit() {
    if (this._exitOpen) return;
    this._exitOpen = true;
    this.openModal("退出 AlgoMaster", `
      <p style="font-size:13.5px;color:var(--text-2);line-height:1.85">
        确定要退出吗？你的刷题进度、笔记、代码与打卡记录都保存在本机浏览器里，下次打开照常继续。
      </p>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="App.closeModalForce()">取消</button>
        <button class="btn btn-primary" onclick="App.exitApp()">确认退出</button>
      </div>`);
  },

  /* 真退出：网页不能凭空关闭标签页，所以按「哪条路走得通」逐级降级
     1) window.close()  —— 装成 App（独立窗口）或脚本打开的窗口，直接关
     2) 历史回退        —— 跨过我们压的全部护栏条目，浏览器会退回上一个页面 / 新标签页
     3) 安卓桌面 intent —— 前两条都不奏效时，直接回手机主屏
     4) 都失败才给提示，绝不装作已退出 */
  exitApp() {
    this._exitOpen = false;
    this._exiting = true;
    this.closeModalForce();

    // 壳里：交给原生退到桌面（网页侧所有降级手段在 WebView 里都无效）
    if (this.inShell() && this.shellExit()) {
      this._exiting = false;   // 壳只是把任务切到后台，页面还活着，不能卡在「退出中」
      return;
    }

    const gone = () => document.visibilityState !== "visible" || document.hidden;

    // 1) 独立窗口：直接关
    try { window.close(); } catch (e) {}

    // 2) 历史回退到进入应用之前。
    //    护栏条目和页面条目是同一个 URL，只退一步等于原地踏步，
    //    所以直接退到历史最底部，浏览器才会真的离开本页。
    setTimeout(() => {
      if (gone()) return;
      const steps = (history.length || 1) - 1;
      try {
        if (steps > 0) history.go(-steps);
        else history.back();
      } catch (e) {}
    }, 120);

    // 3) 安卓：还留在页面上就回主屏
    setTimeout(() => {
      if (gone()) return;
      if (!/android/i.test(navigator.userAgent || "")) return;
      try {
        location.href = "intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.HOME;end";
      } catch (e) {}
    }, 800);

    // 4) 兜底提示 + 恢复护栏状态
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        this.toast("按手机返回键即可退出到桌面");
      }
      this._exiting = false;
    }, 2400);
  },

  /* ---------------- 渲染分发 ---------------- */
  render() {
    const app = document.getElementById("app");
    const p = this.state.page;
    const map = {
      home: () => this.viewHome(),
      courses: () => this.viewCourses(),
      "course-detail": () => this.viewCourseDetail(),
      lesson: () => this.viewLesson(),
      algo: () => this.viewAlgos(),
      "algo-detail": () => this.viewAlgoDetail(),
      skills: () => this.viewSkills(),
      codex: () => this.viewCodex(),
      problems: () => this.viewProblems(),
      solve: () => this.viewSolve(),
      profile: () => this.viewProfile(),
      manual: () => this.viewManual(),
      interview: () => this.viewInterview(),
      checkin: () => this.viewCheckin(),
    };
    const changed = this._lastRendered !== p;
    this._lastRendered = p;
    app.innerHTML = (map[p] || map.home)();
    if (changed) {
      // 页面切换：极短的淡入 + 微位移（还原原生 App 的转场感，不做花哨动画）
      app.classList.remove("page-in");
      void app.offsetWidth;
      app.classList.add("page-in");
    }
    this.updateChrome();
    this.enhanceCode();
    this.markCodeOverflow();
    if (p === "solve") this.initEditor();
    // 页面切换后重新判断安装提示条要不要出现（与首页入口条去重、沉浸页不打扰）
    if (window.AMInstall && window.AMInstall.syncVisibility) window.AMInstall.syncVisibility();
  },

  // 正文/弹层里的代码块统一做语法高亮（语言取自上一个 .code-lang 标签）
  enhanceCode() {
    if (typeof document.querySelectorAll !== "function") return;
    const nodes = document.querySelectorAll(".content-block pre code, .modal-body pre code");
    nodes.forEach(el => {
      if (el.dataset && el.dataset.hl === "1") return;
      const prev = el.parentElement && el.parentElement.previousElementSibling;
      let lang = "cpp";
      if (prev && prev.classList && prev.classList.contains("code-lang")) {
        const t = prev.textContent.trim().toLowerCase();
        if (t.indexOf("python") >= 0) lang = "py";
        else if (t.indexOf("java") >= 0) lang = "java";
        else if (t === "c") lang = "c";
      }
      el.innerHTML = this.highlight(el.textContent || "", lang);
      if (el.dataset) el.dataset.hl = "1";
    });
  },

  countDone(map, prefix) {
    let n = 0;
    for (const k in this.store[map]) if (this.store[map][k] && k.startsWith(prefix + "-")) n++;
    return n;
  },

  totalLessons() {
    const CI = window.COURSE_INDEX;
    if (!CI) return 0;
    return Object.values(CI.langs).reduce((s, c) => s + c.chapters.length, 0);
  },

  totalMicros() {
    const CI = window.COURSE_INDEX;
    if (!CI) return 0;
    return Object.values(CI.langs).reduce(
      (s, c) => s + c.chapters.reduce((a, ch) => a + (ch.mic || 0), 0), 0);
  },

  solvedCount() {
    return Object.keys(this.store.probsDone).filter(k => this.store.probsDone[k]).length;
  },

  /* ============================================================
     首页
     ============================================================ */
  viewHome() {
    const CS = Object.assign({ problems: 0, types: 0, cats: 0, manual: 0, interview: 0 }, window.CONTENT_STATS || {});
    const today = this.today();
    const goal = 5;
    const pct = Math.min(100, Math.round((today.solved || 0) / goal * 100));
    const solved = this.solvedCount();
    const streak = this.streak();

    return `
    <div class="hero-grid">
      <div class="panel">
        <div class="panel-head">
          <h3>今日学习</h3>
          <span class="sub">${this.dateLabel()}</span>
        </div>
        <div class="today-flex">
          ${this.ringSVG(pct, 108, today.solved || 0, `/ ${goal} 题`)}
          <div class="today-info">
            <h2>${this.greet()}</h2>
            <p>${today.solved ? `今天已刷 ${today.solved} 题，继续保持节奏` : "还没有开始今天的刷题，从一道简单题热手吧"}</p>
            <div class="mini-stats" style="margin-top:14px">
              <div class="mini-stat">
                <b>${this.durShort(today.sec || 0)}</b><span>今日学习</span>
              </div>
              <div class="mini-stat">
                <b>${streak}</b><span>连续打卡</span>
              </div>
              <div class="mini-stat">
                <b>${solved}</b><span>累计 AC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h3>学习动态</h3>
          <span class="sub">最近 ${Math.min(4, this.store.history.length)} 条</span>
        </div>
        ${this.feedHTML()}
      </div>
    </div>

    ${this.installStripHTML()}

    <div class="section-head"><h2>功能专区</h2><span class="line"></span></div>
    <div class="grid grid-6">
      <div class="feature-card" onclick="App.nav('codex')">
        <div class="feature-ico">${icon("code", 17)}</div>
        <div>
          <div class="feature-name">刷题专区</div>
          <div class="feature-meta">${CS.problems.toLocaleString()} 道题</div>
        </div>
      </div>
      <div class="feature-card" onclick="App.nav('codex')">
        <div class="feature-ico">${icon("layers", 17)}</div>
        <div>
          <div class="feature-name">算法题库</div>
          <div class="feature-meta">${GROUPS.length - 1} 大方向</div>
        </div>
      </div>
      <div class="feature-card" onclick="App.nav('algo')">
        <div class="feature-ico">${icon("cpu", 17)}</div>
        <div>
          <div class="feature-name">专项训练</div>
          <div class="feature-meta">${ALGOS.length} 个专题</div>
        </div>
      </div>
      <div class="feature-card" onclick="App.nav('problems')">
        <div class="feature-ico">${icon("flag", 17)}</div>
        <div>
          <div class="feature-name">竞赛冲刺</div>
          <div class="feature-meta">${PROBLEMS.length} 道精讲</div>
        </div>
      </div>
      <div class="feature-card" onclick="App.nav('profile')">
        <div class="feature-ico teal">${icon("alert", 17)}</div>
        <div>
          <div class="feature-name">错题本</div>
          <div class="feature-meta">${Object.keys(this.store.wrong).length} 道待复习</div>
        </div>
      </div>
      <div class="feature-card" onclick="App.nav('profile')">
        <div class="feature-ico teal">${icon("bookmark", 17)}</div>
        <div>
          <div class="feature-name">收藏笔记</div>
          <div class="feature-meta">${Object.keys(this.store.fav).length} 收藏 · ${Object.keys(this.store.notes).length} 笔记</div>
        </div>
      </div>
    </div>

    <div class="section-head">
      <h2>每日推荐</h2><span class="line"></span>
      <a onclick="App.nav('problems')">全部精讲 ${icon("chevron", 13)}</a>
    </div>
    <div class="grid grid-3">
      ${this.dailyPicks().map(p => `
        <div class="card click" onclick="App.openProblem('${p.id}')">
          <div class="card-title">
            <span style="font-family:var(--mono);color:var(--text-3);font-size:12px">${p.id}</span>
            ${p.title}
          </div>
          <div class="card-desc" style="margin-bottom:12px">${this.esc(p.desc.slice(0, 46))}…</div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            ${this.diffTag(p.diff)}
            ${p.tags.slice(0, 2).map(t => `<span class="tag">${this.esc(t)}</span>`).join("")}
          </div>
        </div>`).join("")}
    </div>

    <div class="section-head"><h2>学习资源</h2><span class="line"></span></div>
    <div class="grid grid-4">
      <div class="feature-card" onclick="App.nav('manual')">
        <div class="feature-ico">${icon("dict", 17)}</div>
        <div><div class="feature-name">速查手册</div><div class="feature-meta">${CS.manual} 条 API · 4 语言</div></div>
      </div>
      <div class="feature-card" onclick="App.nav('interview')">
        <div class="feature-ico">${icon("target", 17)}</div>
        <div><div class="feature-name">面试题库</div><div class="feature-meta">${CS.interview} 条问答</div></div>
      </div>
      <div class="feature-card" onclick="App.nav('skills')">
        <div class="feature-ico">${icon("note", 17)}</div>
        <div><div class="feature-name">做题技巧</div><div class="feature-meta">${TECHNIQUES.length} 篇方法论</div></div>
      </div>
      <div class="feature-card" onclick="App.nav('checkin')">
        <div class="feature-ico teal">${icon("check", 17)}</div>
        <div><div class="feature-name">每日打卡</div><div class="feature-meta">累计 ${this.store.checkins.length} 天</div></div>
      </div>
    </div>

    <div class="section-head"><h2>竞赛日程参考</h2><span class="line"></span></div>
    <div class="grid grid-3">
      ${[
        ["蓝桥杯", "省赛 3—4 月 · 国赛 5—6 月", "个人赛，填空 + 编程，C++/Java/Python"],
        ["ACM-ICPC 区域赛", "网络赛 9 月 · 现场赛 10—12 月", "三人一队，五小时八到十三题"],
        ["全国大学生电子设计竞赛", "两年一届 · 通常 8 月", "含算法与嵌入式控制题，团队三人"],
      ].map(([name, t, d]) => `
        <div class="card">
          <div class="card-title">${icon("trophy", 15)}${name}</div>
          <div class="card-desc">${t}</div>
          <div class="card-desc" style="margin-top:6px;color:var(--text-3)">${d}</div>
        </div>`).join("")}
    </div>
    `;
  },

  greet() {
    const h = new Date().getHours();
    if (h < 6) return "夜深了，注意休息";
    if (h < 11) return "早上好，开始今天的训练";
    if (h < 14) return "中午好，来一道题热身";
    if (h < 19) return "下午好，保持专注";
    return "晚上好，今天还剩多少题";
  },

  dateLabel() {
    const d = new Date();
    const w = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
    return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${w}`;
  },

  durShort(sec) {
    if (!sec) return "0m";
    const m = Math.floor(sec / 60);
    if (m < 60) return m + "m";
    return Math.floor(m / 60) + "h " + (m % 60) + "m";
  },

  ringSVG(pct, size, value, label) {
    const r = 42, c = 2 * Math.PI * r;
    const off = c * (1 - Math.min(pct, 100) / 100);
    return `
    <div class="ring" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 100 100" width="${size}" height="${size}">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="7"/>
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--primary)" stroke-width="7"
          stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
      </svg>
      <div class="ring-center"><b>${value}</b><span>${label}</span></div>
    </div>`;
  },

  feedHTML() {
    const h = this.store.history.slice(0, 4);
    if (!h.length) {
      return `<p style="font-size:12.5px;color:var(--text-3);padding:14px 0">还没有记录。打开任意一道题开始，学习动态会出现在这里。</p>`;
    }
    return h.map(x => {
      const done = this.store.probsDone[x.id];
      return `<div class="feed-item">
        <span class="feed-dot ${done ? "on" : ""}"></span>
        <span class="feed-txt">${done ? "已 AC" : "浏览"} <b>${this.esc(x.title || x.id)}</b></span>
        <span class="feed-time">${this.relTime(x.t)}</span>
      </div>`;
    }).join("");
  },

  relTime(t) {
    const d = Date.now() - t;
    if (d < 60000) return "刚刚";
    if (d < 3600000) return Math.floor(d / 60000) + " 分钟前";
    if (d < 86400000) return Math.floor(d / 3600000) + " 小时前";
    return Math.floor(d / 86400000) + " 天前";
  },

  dailyPicks() {
    const seed = Number(this.todayStr().replace(/-/g, "")) % 1000;
    const n = PROBLEMS.length;
    return [0, 1, 2].map(i => PROBLEMS[(seed * 7 + i * 11) % n]);
  },

  diffTag(diff) {
    const cls = { "简单": "diff-easy", "中等": "diff-mid", "较难": "diff-hard" }[diff] || "diff-easy";
    return `<span class="diff ${cls}"><i></i>${diff}</span>`;
  },

  /* ============================================================
     题库
     ============================================================ */
  indexReady: false,
  indexErr: false,

  ensureIndex() {
    if (this.indexReady) return Promise.resolve(true);
    if (this._idxP) return this._idxP;
    // 返回 Promise，调用方可以等索引就绪后再用（避免「点了没反应」）
    this._idxP = this.loadScript("data/problems-index.js")
      .then(() => {
        this.indexReady = true;
        if (["codex", "profile"].includes(this.state.page)) this.render();
        return true;
      })
      .catch(() => {
        this.indexErr = true;
        this._idxP = null;
        if (["codex", "profile"].includes(this.state.page)) this.render();
        return false;
      });
    return this._idxP;
  },

  groupCounts() {
    if (this._gc) return this._gc;
    const m = {};
    (window.PROBLEM_INDEX || []).forEach(x => {
      const g = groupOf(x[3]);
      m[g] = (m[g] || 0) + 1;
    });
    this._gc = m;
    return m;
  },

  statOf(id) {
    // FNV-1a + murmur 收尾，保证相邻题号也能得到差异明显的数值
    let h = 2166136261 >>> 0;
    for (let i = 0; i < id.length; i++) {
      h ^= id.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= h >>> 15; h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
    h ^= h >>> 16;
    return { rate: 26 + (h % 61), people: 480 + ((h >>> 8) % 46000) };
  },

  skeletonRows(n, kind) {
    let out = "";
    for (let i = 0; i < n; i++) {
      if (kind === "list") {
        out += `<div class="prob-row sk-row">
          <span class="sk sk-id"></span><span class="sk sk-name"></span>
          <span class="sk sk-diff"></span><span class="sk sk-rate"></span>
        </div>`;
      } else {
        out += `<div class="sk sk-line" style="width:${60 + ((i * 37) % 35)}%"></div>`;
      }
    }
    return out;
  },

  /* 题库过滤：抽出来供「整页渲染」和「局部刷新」共用 */
  codexFiltered() {
    const idx = window.PROBLEM_INDEX || [];
    const f = this.state.codex;
    const kw = f.kw.trim().toLowerCase();
    const list = idx.filter(x =>
      (f.group === "all" || groupOf(x[3]) === f.group) &&
      (f.diff === "all" || DIFF_NAME[x[2]] === f.diff) &&
      (!kw ||
        x[1].toLowerCase().includes(kw) ||   // 题目标题
        x[0].toLowerCase().includes(kw) ||   // 题号
        String(x[3]).toLowerCase().includes(kw)  // 题型 / 分类名
      )
    );
    const PER = 40;
    const pages = Math.max(Math.ceil(list.length / PER), 1);
    const page = Math.min(f.page, pages - 1);
    return { idx, list, pages, page, slice: list.slice(page * PER, page * PER + PER) };
  },

  /* 题名拆两行：主标题 + 规模参数。列表中主标题不再被「（n = 39）」挤掉 */
  probTitle(full, done) {
    const m = String(full || "").match(/^([^（(]+)[（(]([^）)]*)[）)]\s*$/);
    const name = m ? m[1].trim() : String(full || "");
    const arg = m ? m[2].trim() : "";
    return `<span class="pn-t">${this.esc(name)}${done ? `<i class="pn-ok">${icon("check", 12)}</i>` : ""}</span>` +
      (arg ? `<i class="pn-a">${this.esc(arg)}</i>` : "");
  },

  codexResultHTML() {
    const { list, pages, page, slice } = this.codexFiltered();
    return `
    <div class="card" style="padding:10px 0">
      <div class="prob-list-head">
        <span class="prob-id">题号</span>
        <span class="prob-name">题目</span>
        <span class="prob-diff">难度</span>
        <span class="prob-rate">通过率</span>
        <span class="prob-people">尝试人数</span>
      </div>
      ${slice.map(x => {
        const st = this.statOf(x[0]);
        const done = this.store.probsDone[x[0]];
        return `
        <div class="prob-row" onclick="App.openSolve('${x[0]}')">
          <span class="prob-id">${x[0]}</span>
          <span class="prob-name">${this.probTitle(x[1], done)}</span>
          <span class="prob-diff">${this.diffTag(DIFF_NAME[x[2]])}</span>
          <span class="prob-rate">${st.rate}%</span>
          <span class="prob-people">${(st.people / 1000).toFixed(1)}k</span>
        </div>`;
      }).join("") || `<div class="empty">${icon("search", 30)}没有匹配的题目
        <div class="codex-sug">试试这些题型：${this.codexSuggest().map(g =>
          `<button class="chip" onclick="App.setCodexKw('${this.esc(g)}')">${this.esc(g)}</button>`).join("")}</div>
        <div style="margin-top:12px"><button class="btn btn-ghost btn-sm" onclick="App.resetCodexFilter()">清除筛选条件</button></div>
      </div>`}
    </div>

    <div class="pager">
      <button class="btn btn-ghost btn-sm" ${page === 0 ? "disabled" : ""} onclick="App.codexPage(${page - 1})">上一页</button>
      <span class="info">${page + 1} / ${pages} · 共 ${list.length.toLocaleString()} 道</span>
      <button class="btn btn-ghost btn-sm" ${page >= pages - 1 ? "disabled" : ""} onclick="App.codexPage(${page + 1})">下一页</button>
    </div>
    <p style="font-size:11.5px;color:var(--text-3);margin-top:12px;text-align:center">
      通过率与尝试人数为题库内置参考值（本地版无服务端统计）
    </p>`;
  },

  // 只重绘结果区，输入框不动 —— 中文输入法组词不会被中断
  refreshCodexResult() {
    const box = document.getElementById("codexResult");
    if (!box) { this.render(); return; }
    const { list } = this.codexFiltered();
    box.innerHTML = this.codexResultHTML();
    const cnt = document.getElementById("codexCount");
    if (cnt) cnt.textContent = list.length.toLocaleString() + " 道";
  },

  viewCodex() {
    if (!this.indexReady) {
      if (this.indexErr) {
        return `<div class="page-head"><h1>${icon("code", 20)}题库</h1>
          <p>题库索引加载失败</p></div>
          <div class="empty">${icon("alert", 30)}请检查网络后重试
            <div style="margin-top:14px"><button class="btn btn-ghost btn-sm" onclick="location.reload()">重新加载</button></div>
          </div>`;
      }
      return `<div class="page-head"><h1>${icon("code", 20)}题库</h1>
        <p>正在载入题库索引…</p></div>
        <div class="card" style="padding:10px 0">${this.skeletonRows(8, "list")}</div>`;
    }
    const { idx, list } = this.codexFiltered();
    const f = this.state.codex;
    const gc = this.groupCounts();
    const solved = this.solvedCount();

    return `
    <div class="page-head">
      <h1>${icon("code", 20)}题库</h1>
      <p>共 ${idx.length.toLocaleString()} 道题 · ${GROUPS.length - 1} 个方向 · 每题含样例、解析与四语言参考实现 · 已 AC ${solved} 道</p>
    </div>

    <div class="cat-chips">
      ${GROUPS.map(g => `
        <button class="chip ${f.group === g.key ? "active" : ""}" data-g="${g.key}"
          onclick="App.setCodexGroup('${g.key}')">
          ${g.name}${g.key === "all" ? "" : ` <span style="color:var(--text-3);font-size:11px">${gc[g.key] || 0}</span>`}
        </button>`).join("")}
    </div>

    <div class="toolbar">
      <div class="seg">
        ${["all", "简单", "中等", "较难"].map(d => `
          <button class="${f.diff === d ? "active" : ""}" data-d="${d}" onclick="App.setCodexDiff('${d}')">${d === "all" ? "全部难度" : d}</button>`).join("")}
      </div>
      <div class="search-wrap">
        ${icon("search", 15)}
        <input class="input" id="codexKw" placeholder="搜索题号或标题" value="${this.esc(f.kw)}"
          oninput="App.codexKw(this.value, event)"
          oncompositionend="App.codexKw(this.value)">
      </div>
      <span class="count" id="codexCount">${list.length.toLocaleString()} 道</span>
    </div>

    <div id="codexResult">${this.codexResultHTML()}</div>`;
  },

  /* 没搜到时的推荐词：只从「真实存在的题型」里取，点了必定有结果 */
  codexSuggest() {
    const gc = this.groupCounts();
    const types = {};
    (window.PROBLEM_INDEX || []).forEach(x => { types[x[3]] = (types[x[3]] || 0) + 1; });
    return Object.keys(types).sort((a, b) => types[b] - types[a]).slice(0, 5);
  },

  setCodexKw(kw) {
    this.state.codex.kw = kw;
    this.state.codex.page = 0;
    this.state.codex.group = "all";
    this.state.codex.diff = "all";
    const el = document.getElementById("codexKw");
    if (el) el.value = kw;
    document.querySelectorAll(".cat-chips .chip").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-g") === "all");
    });
    this.refreshCodexResult();
  },

  resetCodexFilter() {
    this.state.codex.kw = "";
    this.state.codex.group = "all";
    this.state.codex.diff = "all";
    this.state.codex.page = 0;
    this.render();
    this.toast("已清除筛选");
  },

  setCodexGroup(g) {
    this.state.codex.group = g;
    this.state.codex.page = 0;
    document.querySelectorAll(".cat-chips .chip").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-g") === g);
    });
    this.refreshCodexResult();
  },
  setCodexDiff(d) {
    this.state.codex.diff = d;
    this.state.codex.page = 0;
    document.querySelectorAll(".toolbar .seg button").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-d") === d);
    });
    this.refreshCodexResult();
  },
  codexPage(p) {
    this.state.codex.page = Math.max(0, p);
    this.refreshCodexResult();
    this.scrollTo(0);
  },
  codexKw(v, ev2) {
    this.state.codex.kw = v;
    this.state.codex.page = 0;
    // 中文/日文输入法组词过程中不要重绘，否则候选词会被打断
    if (ev2 && ev2.isComposing) return;
    clearTimeout(this._kwT);
    this._kwT = setTimeout(() => this.refreshCodexResult(), 90);
  },

  /* ============================================================
     做题页
     ============================================================ */
  solve: null,
  solveLoading: false,

  openProblem(id) {
    // 精讲题库（PROBLEMS）
    const p = PROBLEMS.find(x => x.id === id) || PROBLEMS[id];
    if (!p) return;
    this.solve = {
      id: p.id, title: p.title, diff: p.diff, cat: (p.tags && p.tags[0]) || "精讲",
      desc: p.desc, samples: p.samples || [], explain: p.hint || "",
      sol: p.sol || {}, tags: p.tags || [], curated: true,
    };
    this._solveReq = (this._solveReq || 0) + 1;   // 让进行中的分片请求失效
    this.solveLoading = false;
    this.pushHistory(p.id, p.title);
    // 必须入栈，否则从首页点「每日精讲」后返回键会误判为「需要确认退出」
    this.pushPage("solve", p.id);
    this.state.page = "solve";
    this.markNav();
    this.render();
    this.scrollTo(0);
    this.armTrap();
  },

  openSolve(id) {
    const idx = window.PROBLEM_INDEX || [];
    const row = idx.find(x => x[0] === id);
    if (!row) return;
    const reqId = (this._solveReq = (this._solveReq || 0) + 1);
    this.solve = null;
    this.solveLoading = true;
    this.solveShard = row[4];
    this.solHtml = null;
    this.solId = null;
    this.pushPage("solve", id);
    this.state.page = "solve";
    this.markNav();
    this.render();
    this.scrollTo(0);
    this.armTrap();

    this.loadScript(`data/problems-${this.pad3(row[4])}.js`).then(() => {
      if (reqId !== this._solveReq) return;      // 用户已切走或换了题，丢弃这次结果
      const arr = (window.PROBLEM_SHARDS || {})[row[4]] || [];
      const p = arr.find(x => x.id === id);
      this.solveLoading = false;
      if (!p) { this.toast("题目数据缺失"); this.nav("codex"); return; }
      this.solve = {
        id: p.id, title: p.title, diff: p.diff, cat: p.cat,
        desc: p.desc, samples: p.samples || [], explain: p.explain || "",
        sol: p.sol || {}, tags: p.tags || [],
      };
      this.pushHistory(p.id, p.title);
      if (this.state.page === "solve") this.render();
    }).catch(() => {
      if (reqId !== this._solveReq) return;      // 旧请求失败不要打扰当前页面
      this.solveLoading = false;
      this.toast("题目加载失败，请检查网络");
      this.nav("codex");
    });
  },

  pushHistory(id, title) {
    const h = this.store.history.filter(x => x.id !== id);
    h.unshift({ id, title, t: Date.now() });
    this.store.history = h.slice(0, 30);
    this.saveStore();
  },

  markNav() {
    const active = NAV_PARENT[this.state.page] || this.state.page;
    document.querySelectorAll(".main-nav a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-nav") === active);
    });
  },

  viewSolve() {
    if (this.solveLoading || !this.solve) {
      return `<a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
        <div class="solve-wrap">
          <section class="solve-pane pane-problem">
            <div class="solve-pane-head"><span class="sk sk-id"></span><span class="sk sk-name" style="max-width:180px"></span></div>
            <div class="solve-body">${this.skeletonRows(6, "line")}</div>
          </section>
          <section class="solve-pane pane-code">
            <div class="solve-pane-head"><span class="sk sk-name" style="max-width:90px"></span></div>
            <div class="code-area sk-code"></div>
          </section>
        </div>`;
    }
    const p = this.solve;
    const lang = this.state.lang;
    const saved = this.store.code[`${p.id}:${lang}`] || CODE_TPL[lang];
    const done = this.store.probsDone[p.id];
    const fav = this.store.fav[p.id];
    const wrong = this.store.wrong[p.id];
    const s = this.statOf(p.id);

    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>

    <div class="solve-wrap" id="solveWrap" data-tab="${this.state.solveTab}">
      <!-- 左：题目 -->
      <section class="solve-pane pane-problem">
        <div class="solve-pane-head">
          <span class="prob-id" style="width:auto">${p.id}</span>
          <h2>${this.esc(p.title)}</h2>
          ${this.diffTag(p.diff)}
          ${done ? `<span class="tag tag-teal">${icon("check", 12)}已 AC</span>` : ""}
        </div>
        <div class="solve-tabs">
          <button data-tab="problem" class="${this.state.solveTab === "problem" ? "active" : ""}" onclick="App.switchSolveTab('problem')">题目</button>
          <button data-tab="sol" class="${this.state.solveTab === "sol" ? "active" : ""}" onclick="App.switchSolveTab('sol')">题解</button>
          <button data-tab="code" class="${this.state.solveTab === "code" ? "active" : ""}" onclick="App.switchSolveTab('code')">代码</button>
        </div>
        <div class="solve-body">
          <div class="tab-problem">
          <div style="display:flex;gap:14px;font-size:11.5px;color:var(--text-3);margin-bottom:16px">
            <span>通过率 ${s.rate}%</span>
            <span>尝试 ${(s.people / 1000).toFixed(1)}k</span>
            <span>${this.esc(p.cat || "")}</span>
          </div>

          <h4>题目描述</h4>
          <div style="color:var(--text-2);font-size:13.4px;line-height:1.85;white-space:pre-wrap">${this.esc(p.desc)}</div>

          ${p.samples && p.samples.length ? `
            <h4>样例</h4>
            ${p.samples.map((sm, i) => `
              <div class="sample-card">
                <div class="sc-head"><span>样例 ${i + 1}</span></div>
                <div class="sample-split">
                  <div>
                    <div class="sc-head" style="border:none;padding:6px 12px 0;background:transparent">输入</div>
                    <pre>${this.esc(sm.input)}</pre>
                  </div>
                  <div>
                    <div class="sc-head" style="border:none;padding:6px 12px 0;background:transparent">输出</div>
                    <pre>${this.esc(sm.output)}</pre>
                  </div>
                </div>
              </div>`).join("")}
          ` : ""}

          ${p.explain ? `
            <h4>思路要点</h4>
            <div style="color:var(--text-2);font-size:13.4px;line-height:1.85;white-space:pre-wrap">${this.esc(p.explain)}</div>
          ` : ""}

          <h4>我的笔记</h4>
          <textarea id="noteBox" class="input" style="width:100%;height:90px;padding:10px;resize:vertical;line-height:1.7"
            oninput="App.noteDraft(this.value)"
            placeholder="记录思路、易错点、模板片段…">${this.esc(this.store.notes[p.id] || "")}</textarea>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn btn-ghost btn-sm" onclick="App.saveNote()">${icon("check", 14)}保存笔记</button>
            <button class="btn btn-ghost btn-sm" onclick="App.toggleFav('${p.id}')">
              ${icon("bookmark", 14)}${fav ? "取消收藏" : "收藏"}
            </button>
            <button class="btn btn-ghost btn-sm" onclick="App.toggleWrong('${p.id}')">
              ${icon("alert", 14)}${wrong ? "移出错题本" : "加入错题本"}
            </button>
          </div>
          </div><!-- /tab-problem -->

          <div class="tab-sol" id="solBody">
            <p style="color:var(--text-3);font-size:13px">切换到「题解」查看本题的识别信号、思路拆解、参考实现与易错点。</p>
          </div>
        </div>
      </section>

      <!-- 右：编辑器 -->
      <section class="solve-pane pane-code">
        <div class="solve-pane-head">
          <h2 style="font-size:13px;color:var(--text-2);font-weight:500">代码编辑器</h2>
          <div class="seg" style="margin-left:auto">
            ${Object.keys(LANG_NAME).map(k => `
              <button class="${lang === k ? "active" : ""}" onclick="App.setLang('${k}')">${LANG_NAME[k]}</button>`).join("")}
          </div>
        </div>
        <div class="editor-shell">
          <div class="editor-bar">
            <span class="lang-tab active">${LANG_NAME[lang]}</span>
            <span class="spacer"></span>
            <span class="hint">Tab 缩进 4 空格</span>
          </div>
          <div class="code-area" id="codeArea">
            <div class="gutter" id="gutter">1</div>
            <div class="code-stack">
              <pre class="code-hl" id="codeHl"></pre>
              <textarea class="code-input" id="codeInput" wrap="off" spellcheck="false"
                autocomplete="off" autocorrect="off" autocapitalize="off">${this.esc(saved)}</textarea>
            </div>
          </div>
          <div class="editor-actions">
            <button class="btn btn-primary btn-sm" onclick="App.submitCode()">${icon("send", 14)}提交</button>
            <button class="btn btn-ghost btn-sm" onclick="App.runCheck()">${icon("play", 14)}运行</button>
            <button class="btn btn-ghost btn-sm" onclick="App.resetCode()">${icon("reset", 14)}重置</button>
            <button class="btn btn-ghost btn-sm" onclick="App.showSolution()">${icon("book", 14)}查看解析</button>
            <span class="spacer"></span>
            <span class="hint" style="color:#5b6878;font-size:11px;font-family:var(--mono)">${Object.keys(this.store.code).filter(k => k.startsWith(p.id + ":")).length} 语言已保存</span>
          </div>
          <div class="result-panel" id="resultPanel">
            <span class="dim">就绪 · 点击「运行」做本地静态检查，或「提交」记录为 AC</span>
          </div>
        </div>
      </section>
    </div>`;
  },

  switchSolveTab(t) {
    this.state.solveTab = t;
    const w = document.getElementById("solveWrap");
    if (w) w.setAttribute("data-tab", t);
    document.querySelectorAll(".solve-tabs button").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-tab") === t);
    });
    if (t === "code") this.initEditor();
    if (t === "sol") this.loadSolution();
    const body = document.querySelector(".pane-problem .solve-body");
    if (body) body.scrollTop = 0;
  },

  /* 题解按题目所在分片懒加载，避免做题页一进来就多拉 33KB */
  loadSolution() {
    const p = this.solve;
    const el = document.getElementById("solBody");
    if (!p || !el) return Promise.resolve("");
    if (this.solId === p.id && this.solHtml) {
      el.innerHTML = this.solHtml;
      return Promise.resolve(this.solHtml);
    }
    const sh = this.solveShard;
    if (sh == null) {
      el.innerHTML = `<p style="color:var(--text-3);font-size:13px">该题暂无题解。</p>`;
      return Promise.resolve("");
    }
    el.innerHTML = this.skeletonRows(6, "line");
    return this.loadScript(`data/sol-${this.pad3(sh)}.js`)
      .catch(() => {})
      .then(() => {
        const m = (window.SOL_SHARDS || {})[sh] || {};
        this.solHtml = m[p.id] || "";
        this.solId = p.id;
        const box = document.getElementById("solBody");
        if (box) {
          box.innerHTML = this.solHtml ||
            `<p style="color:var(--text-3);font-size:13px">该题暂无题解。</p>`;
        }
        return this.solHtml;
      });
  },

  setLang(lang) {
    this.saveEditorCode();
    this.state.lang = lang;
    this.saveStore();
    this.render();
  },

  saveEditorCode() {
    const el = document.getElementById("codeInput");
    if (!el || !this.solve) return;
    this.store.code[`${this.solve.id}:${this.state.lang}`] = el.value;
    this.saveStore();
  },

  saveNote() {
    clearTimeout(this._noteT);
    const el = document.getElementById("noteBox");
    if (!el || !this.solve) return;
    const v = el.value.trim();
    if (v) this.store.notes[this.solve.id] = v;
    else delete this.store.notes[this.solve.id];
    this.saveStore();
    this.toast(v ? "笔记已保存" : "笔记已清空");
  },

  // 边写边存（防抖），这样切语言/收藏等重绘不会丢草稿
  noteDraft(v) {
    if (!this.solve) return;
    const id = this.solve.id;
    clearTimeout(this._noteT);
    this._noteT = setTimeout(() => {
      const val = v.trim();
      if (val) this.store.notes[id] = v;
      else delete this.store.notes[id];
      this.saveStore();
    }, 500);
  },

  toggleFav(id) {
    this.store.fav[id] ? delete this.store.fav[id] : (this.store.fav[id] = true);
    this.saveStore();
    this.render();
    this.toast(this.store.fav[id] ? "已收藏" : "已取消收藏");
  },

  toggleWrong(id) {
    this.store.wrong[id] ? delete this.store.wrong[id] : (this.store.wrong[id] = true);
    this.saveStore();
    this.render();
    this.toast(this.store.wrong[id] ? "已加入错题本" : "已移出错题本");
  },

  resetCode() {
    if (!this.solve) return;
    delete this.store.code[`${this.solve.id}:${this.state.lang}`];
    this.saveStore();
    this.render();
    this.toast("已重置为初始模板");
  },

  /* ---------------- 编辑器 ---------------- */
  initEditor() {
    const ta = document.getElementById("codeInput");
    if (!ta) return;
    if (ta.dataset.inited === "1") {
      // 已经绑定过事件，只重绘一次（切换 Tab 时避免重复监听）
      const h0 = document.getElementById("codeHl");
      const g0 = document.getElementById("gutter");
      if (h0) h0.innerHTML = this.highlight(ta.value, this.state.lang) + "\n";
      if (g0) {
        let g = "";
        for (let i = 1; i <= ta.value.split("\n").length; i++) g += i + "\n";
        g0.textContent = g;
      }
      return;
    }
    ta.dataset.inited = "1";
    const hl = document.getElementById("codeHl");
    const gut = document.getElementById("gutter");

    const paint = () => {
      const code = ta.value;
      hl.innerHTML = this.highlight(code, this.state.lang) + "\n";
      const lines = code.split("\n").length;
      let g = "";
      for (let i = 1; i <= lines; i++) g += i + "\n";
      gut.textContent = g;
    };

    ta.addEventListener("input", () => {
      paint();
      this.store.code[`${this.solve.id}:${this.state.lang}`] = ta.value;
      clearTimeout(this._saveT);
      this._saveT = setTimeout(() => this.saveStore(), 600);
    });

    ta.addEventListener("scroll", () => {
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
      gut.scrollTop = ta.scrollTop;
    });

    ta.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        e.preventDefault();
        const s = ta.selectionStart, epos = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(epos);
        ta.selectionStart = ta.selectionEnd = s + 4;
        paint();
      }
    });

    paint();
  },

  highlight(code, lang) {
    const KW = {
      cpp: "alignas alignof auto bool break case catch char class const constexpr continue default delete do double else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept nullptr operator private protected public register return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while string vector map set queue stack deque pair unordered_map unordered_set priority_queue iterator size_t",
      c: "auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while size_t",
      java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null String Integer Long Double",
      py: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield print range len int str float list dict set tuple",
    };
    const TYPE = {
      cpp: "int long short char float double bool void unsigned signed string vector map set queue stack deque pair size_t",
      c: "int long short char float double void unsigned signed size_t",
      java: "int long short char float double boolean void String Integer Long Double",
      py: "int str float list dict set tuple bool",
    };
    const kw = new Set((KW[lang] || "").split(" "));
    const tp = new Set((TYPE[lang] || "").split(" "));
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const py = lang === "py";

    let out = "", i = 0;
    const n = code.length;
    while (i < n) {
      const c = code[i];

      // 行注释
      if ((py && c === "#") || (!py && c === "/" && code[i + 1] === "/")) {
        let j = code.indexOf("\n", i);
        if (j < 0) j = n;
        out += `<span class="tk-com">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      // 块注释
      if (!py && c === "/" && code[i + 1] === "*") {
        let j = code.indexOf("*/", i + 2);
        j = j < 0 ? n : j + 2;
        out += `<span class="tk-com">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      // 预处理指令
      if (!py && c === "#") {
        let j = code.indexOf("\n", i);
        if (j < 0) j = n;
        out += `<span class="tk-pp">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      // 字符串
      if (c === '"' || c === "'" || c === "`") {
        const q = c;
        let j = i + 1;
        while (j < n && code[j] !== q) {
          if (code[j] === "\\") j++;
          j++;
        }
        j = Math.min(j + 1, n);
        out += `<span class="tk-str">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      // 数字
      if (/[0-9]/.test(c)) {
        let j = i;
        while (j < n && /[0-9a-fA-FxX._]/.test(code[j])) j++;
        out += `<span class="tk-num">${esc(code.slice(i, j))}</span>`;
        i = j;
        continue;
      }
      // 标识符
      if (/[A-Za-z_$]/.test(c)) {
        let j = i;
        while (j < n && /[A-Za-z0-9_$]/.test(code[j])) j++;
        const w = code.slice(i, j);
        let k = j;
        while (k < n && code[k] === " ") k++;
        if (kw.has(w)) out += `<span class="tk-kw">${w}</span>`;
        else if (tp.has(w)) out += `<span class="tk-type">${w}</span>`;
        else if (code[k] === "(") out += `<span class="tk-fn">${w}</span>`;
        else out += esc(w);
        i = j;
        continue;
      }
      // 运算符
      if (/[+\-*/%=<>!&|^~?:]/.test(c)) {
        out += `<span class="tk-op">${esc(c)}</span>`;
        i++;
        continue;
      }
      out += esc(c);
      i++;
    }
    return out;
  },

  /* 代码横向溢出时右缘渐隐，提示「还能往右滑」；滑到最右自动撤掉渐隐 */
  markCodeOverflow() {
    document.querySelectorAll(".content-block pre, pre.sol-code").forEach((el) => {
      if (!el.dataset.ovfBound) {
        el.dataset.ovfBound = "1";
        el.addEventListener("scroll", () => this.syncOvf(el), { passive: true });
      }
      this.syncOvf(el);
    });
  },

  syncOvf(el) {
    const rest = el.scrollWidth - el.clientWidth - el.scrollLeft;
    el.classList.toggle("ovf", rest > 4);
  },

  /* ---------------- 运行 / 提交 ---------------- */
  runCheck() {
    const ta = document.getElementById("codeInput");
    const panel = document.getElementById("resultPanel");
    if (!ta || !panel) return;
    const code = ta.value;
    const lang = this.state.lang;
    const res = this.staticCheck(code, lang);

    let html = `<div class="dim">静态检查 · ${LANG_NAME[lang]} · 浏览器环境无法编译执行，此处只校验代码结构</div>`;
    html += res.items.map(it => `<div class="${it.ok ? "ok" : "err"}">${it.ok ? "✓" : "✗"} ${this.esc(it.msg)}</div>`).join("");
    if (this.solve && this.solve.samples && this.solve.samples.length) {
      html += `<div class="dim" style="margin-top:8px">样例 1 期望输出：</div>`;
      html += `<div class="ok">${this.esc(this.solve.samples[0].output)}</div>`;
    }
    panel.innerHTML = html;
  },

  staticCheck(code, lang) {
    const items = [];
    const push = (ok, msg) => items.push({ ok, msg });

    if (!code.trim()) {
      push(false, "代码为空");
      return { items };
    }
    push(true, `代码长度 ${code.length} 字符 / ${code.split("\n").length} 行`);

    // 去掉字符串与注释后再做括号配对
    const stripped = code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "")
      .replace(/#[^\n]*/g, "")
      .replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, "");

    const pairs = { "(": ")", "[": "]", "{": "}" };
    const stack = [];
    let bracketOk = true;
    for (const ch of stripped) {
      if (pairs[ch]) stack.push(pairs[ch]);
      else if (")]}".includes(ch)) {
        if (stack.pop() !== ch) { bracketOk = false; break; }
      }
    }
    if (stack.length) bracketOk = false;
    push(bracketOk, bracketOk ? "括号配对正确" : "括号不配对，先补齐再运行");

    if (lang === "cpp") {
      const hasInc = /#include/.test(code);
      const hasMain = /\bmain\s*\(/.test(code);
      push(hasInc, hasInc ? "已包含头文件" : "缺少 #include（建议 #include <bits/stdc++.h>）");
      push(hasMain, hasMain ? "找到 main 函数" : "缺少 main 函数");
    } else if (lang === "c") {
      const hasInc = /#include\s*<\s*stdio\.h\s*>/.test(code);
      const hasMain = /\bmain\s*\(/.test(code);
      push(hasInc, hasInc ? "已包含 stdio.h" : "缺少 #include <stdio.h>");
      push(hasMain, hasMain ? "找到 main 函数" : "缺少 main 函数");
    } else if (lang === "java") {
      const hasClass = /\bclass\s+\w+/.test(code);
      const hasMain = /static\s+void\s+main/.test(code);
      push(hasClass, hasClass ? "已定义类" : "缺少 class 定义");
      push(hasMain, hasMain ? "找到 main 方法" : "缺少 public static void main");
    } else {
      const hasDef = /\bdef\s+\w+\s*\(/.test(code);
      const mixedTab = /^\t/m.test(code) && /^ {2,}/m.test(code);
      push(true, hasDef ? "找到函数定义" : "提示：Python 可只写顶层语句");
      push(!mixedTab, mixedTab ? "缩进混用了 Tab 与空格，会报 IndentationError" : "缩进风格统一");
    }

    const outRe = { cpp: /cout|printf|puts/, c: /printf|puts/, java: /System\.out/, py: /print\s*\(/ }[lang];
    const hasOut = outRe.test(code);
    push(hasOut, hasOut ? "包含输出语句" : "未检测到输出语句，注意题目是否需要打印结果");

    return { items };
  },

  submitCode() {
    if (!this.solve) return;
    const ta = document.getElementById("codeInput");
    const panel = document.getElementById("resultPanel");
    if (!ta || !panel) return;
    const res = this.staticCheck(ta.value, this.state.lang);
    const fail = res.items.filter(x => !x.ok);

    if (fail.length) {
      panel.innerHTML = `<div class="dim">提交未通过 · 先修掉下面的问题</div>` +
        fail.map(f => `<div class="err">✗ ${this.esc(f.msg)}</div>`).join("") +
        `<div class="dim" style="margin-top:6px">提示：浏览器版不执行代码，通过结构检查后即记录为 AC</div>`;
      this.toast("还有 " + fail.length + " 项检查未通过");
      return;
    }

    const id = this.solve.id;
    const first = !this.store.probsDone[id];
    this.store.probsDone[id] = true;
    if (first) {
      const t = this.today();
      t.solved = (t.solved || 0) + 1;
      delete this.store.wrong[id];
    }
    this.saveEditorCode();
    this.saveStore();

    panel.innerHTML =
      `<div class="ok">✓ 通过 · 结构检查全部通过，已记录为 AC</div>` +
      res.items.map(it => `<div class="ok">✓ ${this.esc(it.msg)}</div>`).join("") +
      `<div class="dim" style="margin-top:6px">本次用时 ${this.durShort(this.today().sec || 0)} · 连续打卡 ${this.streak()} 天</div>`;
    this.updateChrome();
    this.toast(first ? "AC 记录成功" : "已更新提交记录");
    const btnWrap = document.querySelector(".solve-pane-head .tag");
    if (!btnWrap && first) {
      const head = document.querySelector(".pane-problem .solve-pane-head");
      if (head) head.insertAdjacentHTML("beforeend", `<span class="tag tag-teal">${icon("check", 12)}已 AC</span>`);
    }
  },

  /* 「查看解析」不再弹层，直接切到题解视图（题解是一份完整讲义，弹层放不下） */
  showSolution() {
    const p = this.solve;
    if (!p) return;
    this.switchSolveTab("sol");
  },

  markAcFromModal(id) {
    if (!this.store.probsDone[id]) {
      this.store.probsDone[id] = true;
      const t = this.today();
      t.solved = (t.solved || 0) + 1;
      delete this.store.wrong[id];
      this.saveStore();
      this.updateChrome();
      this.toast("AC 记录成功");
    }
    this.render();
  },

  /* ============================================================
     账号 / 头像 / 成就
     ============================================================ */
  avatarDef() {
    const acc = this.store.account;
    const id = acc && acc.av;
    return AVATARS.find(a => a.id === id) || AVATARS[0];
  },
  frameDef() {
    const id = this.store.ach && this.store.ach.frame;
    return id ? FRAMES.find(f => f.id === id) || null : null;
  },
  achStats() {
    const idx = window.PROBLEM_INDEX || [];
    const done = this.store.probsDone || {};
    let groups = 0;
    if (idx.length) {
      const set = new Set();
      for (let i = 0; i < idx.length; i++) if (done[idx[i][0]]) set.add(groupOf(idx[i][3]));
      groups = set.size;
    }
    return {
      solved: this.solvedCount(),
      streak: this.streak(),
      lessons: Object.values(this.store.lessonsDone).filter(Boolean).length,
      algos: Object.values(this.store.algosDone).filter(Boolean).length,
      notes: Object.keys(this.store.notes || {}).length,
      groups,
    };
  },
  achValue(def, st) {
    st = st || this.achStats();
    const v = def.of(st);
    return Math.max(0, Math.min(v || 0, def.need * 99));   // 只用于展示，避免异常值
  },

  // 头像面：优先自定义照片（dataURL），其次预置渐变 + emoji，最后是未登录占位
  avatarFace(size, avId, imgUrl) {
    if (imgUrl) {
      return `<span class="av-face av-photo"><img src="${this.esc(imgUrl)}" alt="头像"></span>`;
    }
    if (!avId) return `<span class="av-face av-blank">${icon("user", size === "lg" ? 24 : 15)}</span>`;
    const av = AVATARS.find(a => a.id === avId) || AVATARS[0];
    return `<span class="av-face" style="background:linear-gradient(145deg,${av.a},${av.b})"><span>${av.e}</span></span>`;
  },
  avatarBox(size, avId, imgUrl) {
    const fr = this.frameDef();
    const ring = fr ? `<span class="av-ring" style="--f1:${fr.c1};--f2:${fr.c2};--f3:${fr.c3}"></span>` : "";
    return `<span class="av av-${size}${fr ? " has-ring" : ""}">${ring}${this.avatarFace(size, avId, imgUrl)}</span>`;
  },

  // 头像 + 头像框（size: sm / md / lg）
  renderAvatar(size) {
    const acc = this.store.account;
    if (!acc) return this.avatarBox(size, "", "");
    return this.avatarBox(size, acc.av || AVATARS[0].id, acc.avImg || "");
  },

  /* ---------- 登录（本地账号） ---------- */
  openLogin() {
    const acc = this.store.account;
    this._pick = (acc && acc.av) || AVATARS[0].id;
    this._pickImg = (acc && acc.avImg) || "";
    const body = `
      <div class="login-hero">
        <div id="loginPreview">${this.avatarBoxPreview("lg")}</div>
        <p>头像与昵称只保存在本机，不上传、不联网</p>
      </div>
      <label class="field-label">昵称</label>
      <input class="input" id="nickInput" maxlength="12" placeholder="给自己起个名字" value="${this.esc(acc ? acc.name : "")}">
      <label class="field-label" style="margin-top:16px">选择头像</label>
      <div class="av-grid">
        ${AVATARS.map(a => `
          <button class="av-pick ${a.id === this._pick ? "on" : ""}" data-av="${a.id}"
            onclick="App.pickAvatar('${a.id}')"
            style="--a:${a.a};--b:${a.b}">
            <span>${a.e}</span>
          </button>`).join("")}
      </div>
      <div class="av-photo-row">
        <button class="btn btn-ghost btn-sm av-upload" onclick="App.pickPhoto()">
          ${icon("palette", 14)}从相册选择照片
        </button>
        <button class="btn btn-text btn-sm ${this._pickImg ? "" : "hidden"}" id="avClear"
          onclick="App.clearPhoto()">${icon("x", 13)}移除照片</button>
      </div>
      <input type="file" id="avFile" accept="image/*" hidden onchange="App.onPhoto(this)">
      <div class="modal-actions">
        ${acc ? `<button class="btn btn-ghost" onclick="App.logout()">退出登录</button>` : ""}
        <button class="btn btn-primary" onclick="App.saveLogin()">${acc ? "保存资料" : "登录"}</button>
      </div>`;
    this.openModal(acc ? "个人资料" : "登录以解锁头像框", body);
    const inp = document.getElementById("nickInput");
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  },

  // 弹层内的预览（用 _pick / _pickImg，而不是已保存的账号）
  avatarBoxPreview(size) {
    return this.avatarBox(size, this._pick || AVATARS[0].id, this._pickImg || "");
  },
  syncPickUI() {
    const on = !this._pickImg;
    document.querySelectorAll(".av-pick").forEach(el => {
      el.classList.toggle("on", on && el.dataset.av === this._pick);
    });
    const pv = document.getElementById("loginPreview");
    if (pv) pv.innerHTML = this.avatarBoxPreview("lg");
    const del = document.getElementById("avClear");
    if (del) del.classList.toggle("hidden", !this._pickImg);
  },

  pickAvatar(id) {
    this._pick = id;
    this._pickImg = "";
    this.syncPickUI();
  },

  pickPhoto() {
    const inp = document.getElementById("avFile");
    if (inp) inp.click();
  },

  clearPhoto() {
    this._pickImg = "";
    this.syncPickUI();
    this.toast("已移除照片");
  },

  // 从相册选图：居中裁正方形 → 缩到 256 → JPEG 压缩（约 10–25KB，localStorage 无压力）
  async onPhoto(input) {
    const f = input && input.files && input.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type || "")) { this.toast("请选择图片文件"); input.value = ""; return; }
    if (f.size > 15 * 1024 * 1024) { this.toast("图片超过 15MB，换一张小一点的"); input.value = ""; return; }
    try {
      this._pickImg = await this.cropSquare(f, 256);
      this.syncPickUI();
      this.toast("照片已就绪，记得点保存");
    } catch (e) {
      this.toast("这张图读不出来，换一张试试");
    }
    input.value = "";
  },

  cropSquare(file, out) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      const done = (fn, v) => { URL.revokeObjectURL(url); fn(v); };
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (!w || !h) return done(reject, new Error("empty"));
          const side = Math.min(w, h);
          const cv = document.createElement("canvas");
          cv.width = cv.height = out;
          const ctx = cv.getContext("2d");
          ctx.fillStyle = "#ffffff";           // 透明 PNG 转 JPEG 时避免出现黑底
          ctx.fillRect(0, 0, out, out);
          if ("imageSmoothingQuality" in ctx) ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, out, out);
          done(resolve, cv.toDataURL("image/jpeg", 0.86));
        } catch (e) { done(reject, e); }
      };
      img.onerror = () => done(reject, new Error("decode"));
      img.src = url;
    });
  },

  saveLogin() {
    const inp = document.getElementById("nickInput");
    const name = (inp ? inp.value : "").trim().slice(0, 12);
    if (!name) { this.toast("先给自己起个昵称"); if (inp) inp.focus(); return; }
    const av = this._pick || AVATARS[0].id;
    const avImg = this._pickImg || "";
    const isNew = !this.store.account;
    if (isNew) this.store.account = { name, av, avImg, at: new Date().toISOString() };
    else { this.store.account.name = name; this.store.account.av = av; this.store.account.avImg = avImg; }
    const ok = this.saveStore();
    if (ok === false) { this.toast("本地存储空间不足，照片可能太大"); }
    this.closeModalForce();
    this.render();
    this.updateChrome();
    this.toast(isNew ? "欢迎，" + name : "资料已保存");
  },

  logout() {
    this.store.account = null;
    this.store.ach.frame = "";
    this.saveStore();
    this.closeModalForce();
    this.render();
    this.updateChrome();
    this.toast("已退出登录，学习进度仍保留在本机");
  },

  /* ---------- 成就 ---------- */
  achState(def, st) {
    const v = this.achValue(def, st);
    const claimed = !!(this.store.ach.claimed || {})[def.id];
    return {
      value: v,
      pct: Math.min(100, Math.round(v / def.need * 100)),
      done: v >= def.need,
      claimed,
    };
  },

  claimAch(id) {
    const def = ACH.find(a => a.id === id);
    if (!def) return;
    if (!this.store.account) {
      this.closeModalForce();
      this.openLogin();
      this.toast("先登录，成就头像框才能戴到头像上");
      return;
    }
    const st = this.achState(def);
    if (!st.done) { this.toast("进度还没到，继续努力"); return; }
    if (st.claimed) { this.setFrame(def.frame); return; }
    this.store.ach.claimed[def.id] = true;
    this.store.ach.frame = def.frame;
    this.saveStore();
    const fr = FRAMES.find(f => f.id === def.frame);
    this.render();
    this.updateChrome();
    this.toast(`已领取「${fr ? fr.name : def.name}」并佩戴`);
  },

  openFrames() {
    if (!this.store.account) { this.openLogin(); return; }
    const claimed = this.store.ach.claimed || {};
    const owned = FRAMES.filter(f => Object.keys(FRAME_OF_ACH).some(k => FRAME_OF_ACH[k] === f.id && claimed[k]));
    const cur = this.store.ach.frame;
    const body = `
      <p class="guide-note" style="margin-bottom:14px">${icon("palette", 14)}
        已解锁 ${owned.length} / ${FRAMES.length} 个头像框，达成成就即可领取更多</p>
      <div class="frame-grid">
        <button class="frame-item ${!cur ? "on" : ""}" onclick="App.setFrame('')">
          <span class="av av-md av-blank-wrap"><span class="av-face av-blank">${icon("user", 15)}</span></span>
          <b>不使用</b>
        </button>
        ${FRAMES.map(f => {
          const own = owned.includes(f);
          return `
          <button class="frame-item ${cur === f.id ? "on" : ""} ${own ? "" : "lock"}"
            onclick="App.setFrame('${own ? f.id : ""}')">
            <span class="av av-md ${own ? "has-ring" : ""}">
              ${own ? `<span class="av-ring" style="--f1:${f.c1};--f2:${f.c2};--f3:${f.c3}"></span>` : ""}
              <span class="av-face av-blank">${own ? icon("check", 15) : icon("lock", 15)}</span>
            </span>
            <b>${f.name}</b>
          </button>`;
        }).join("")}
      </div>`;
    this.openModal("我的头像框", body);
  },

  setFrame(id) {
    if (id) {
      const claimed = this.store.ach.claimed || {};
      const owned = Object.keys(FRAME_OF_ACH).some(k => FRAME_OF_ACH[k] === id && claimed[k]);
      if (!owned) { this.toast("先完成对应成就并领取"); return; }
    }
    this.store.ach.frame = id || "";
    this.saveStore();
    this.closeModalForce();
    this.render();
    this.updateChrome();
    this.toast(id ? "已更换头像框" : "已取消头像框");
  },

  /* ============================================================
     个人中心
     ============================================================ */
  viewProfile() {
    const solved = this.solvedCount();
    const opened = new Set(this.store.history.map(h => h.id)).size;
    const acc = opened ? Math.round(solved / opened * 100) : 0;
    const lessons = Object.values(this.store.lessonsDone).filter(Boolean).length;
    const algos = Object.values(this.store.algosDone).filter(Boolean).length;
    const points = solved * 10 + this.streak() * 5 + lessons * 2 + algos * 5;
    const joinedDays = Math.max(1, Math.round((Date.now() - new Date(this.store.joined).getTime()) / 86400000) + 1);

    return `
    <div class="profile-head">
      ${this.renderAvatar("lg")}
      <div class="profile-info" style="flex:1">
        <h2>${this.store.account ? this.esc(this.store.account.name) : "未登录"}</h2>
        <p>${this.store.account
          ? `加入第 ${joinedDays} 天 · 累计学习 ${this.durShort(Object.values(this.store.daily).reduce((s, d) => s + (d.sec || 0), 0))}`
          : "登录后可自定义头像，并用成就解锁头像框"}</p>
        <div class="profile-badges">
          <span class="tag tag-primary">Lv.${Math.min(9, 1 + Math.floor(solved / 20))}</span>
          <span class="tag tag-teal">${icon("flame", 12)}连续 ${this.streak()} 天</span>
          <span class="tag">${solved >= 100 ? "百题达成" : solved >= 10 ? "十题起步" : "新手起步"}</span>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn btn-ghost btn-sm" onclick="App.openLogin()">
          ${icon("user", 14)}${this.store.account ? "编辑" : "登录"}
        </button>
        <button class="btn btn-ghost btn-sm" onclick="App.nav('checkin')">${icon("check", 14)}打卡</button>
      </div>
    </div>

    <div class="metric-grid">
      <div class="metric metric-open">
        <div class="label">${icon("code", 13)}刷题总数</div>
        <div class="value">${opened}</div>
      </div>
      <div class="metric">
        <div class="label">${icon("check", 13)}AC 数</div>
        <div class="value" style="color:var(--teal)">${solved}</div>
      </div>
      <div class="metric">
        <div class="label">${icon("target", 13)}正确率</div>
        <div class="value">${acc}<small>%</small></div>
      </div>
      <div class="metric">
        <div class="label">${icon("flame", 13)}连续打卡</div>
        <div class="value">${this.streak()}<small>天</small></div>
      </div>
      <div class="metric">
        <div class="label">${icon("trophy", 13)}竞赛积分</div>
        <div class="value">${points}</div>
      </div>
    </div>

    <div class="section-head">
      <h2>成就与头像框</h2><span class="line"></span>
      <a onclick="App.openFrames()">我的头像框 ${icon("chevron", 12)}</a>
    </div>
    ${this.achGridHTML()}

    <div class="section-head"><h2>数据可视化</h2><span class="line"></span></div>
    <div class="grid grid-2">
      <div class="card">
        <div class="card-title">${icon("chart", 15)}近 7 日成长曲线</div>
        <div class="card-desc" style="margin-bottom:10px">每日 AC 题数</div>
        ${this.lineChart(this.last7())}
      </div>
      <div class="card">
        <div class="card-title">${icon("target", 15)}能力分布</div>
        <div class="card-desc" style="margin-bottom:10px">按方向统计完成度</div>
        ${this.radarChart()}
      </div>
    </div>

    <div class="section-head"><h2>学习资产</h2><span class="line"></span></div>
    <div class="grid grid-4">
      ${this.assetCard("wrong", "错题本", this.store.wrong, "alert")}
      ${this.assetCard("notes", "笔记", this.store.notes, "note")}
      ${this.assetCard("fav", "收藏", this.store.fav, "bookmark")}
      ${this.assetCard("history", "历史记录", null, "clock")}
    </div>

    <div class="section-head"><h2>设置</h2><span class="line"></span></div>
    <div class="card">
      <div class="row" style="border:none;background:none;padding:8px 0" onclick="App.toggleTheme()">
        <div class="row-ico">${icon("gear", 15)}</div>
        <div class="row-main"><b>外观模式</b><span>当前：${this.theme === "dark" ? "深色" : "浅色"}</span></div>
        <div class="row-right">${icon("chevron", 14)}</div>
      </div>
      <div class="row" style="border:none;background:none;padding:8px 0" onclick="App.exportData()">
        <div class="row-ico">${icon("inbox", 15)}</div>
        <div class="row-main"><b>导出学习数据</b><span>下载 JSON，可换设备导入</span></div>
        <div class="row-right">${icon("chevron", 14)}</div>
      </div>
      <div class="row" style="border:none;background:none;padding:8px 0" onclick="App.clearData()">
        <div class="row-ico" style="color:var(--hard)">${icon("x", 15)}</div>
        <div class="row-main"><b style="color:var(--hard)">清空本地数据</b><span>进度、笔记、收藏全部删除，不可恢复</span></div>
        <div class="row-right">${icon("chevron", 14)}</div>
      </div>
    </div>`;
  },

  achGridHTML() {
    const st = this.achStats();
    const states = ACH.map(a => this.achState(a, st));
    const claimedN = states.filter(s => s.claimed).length;
    const readyN = states.filter(s => s.done && !s.claimed).length;
    const cur = this.store.ach.frame;

    const cards = ACH.map((a, i) => {
      const s = states[i];
      const cls = s.claimed ? "claimed" : s.done ? "ready" : "locked";
      const fr = FRAMES.find(f => f.id === a.frame) || { name: a.name };
      const wearing = s.claimed && cur === a.frame;
      const act = wearing
        ? `<span class="ach-tag on">${icon("check", 12)}佩戴中</span>`
        : s.claimed
          ? `<span class="ach-tag">${icon("check", 12)}已领取</span>`
          : s.done
            ? `<span class="ach-tag ready">领取</span>`
            : `<span class="ach-tag lock">${icon("lock", 12)}${s.pct}%</span>`;
      return `
      <div class="ach ${cls}" onclick="App.claimAch('${a.id}')">
        <div class="ach-ico">${icon(s.done ? a.icon : "lock", 15)}</div>
        <div class="ach-main">
          <div class="ach-title"><b>${a.name}</b>${act}</div>
          <span>${a.desc}</span>
          <div class="ach-bar"><i style="width:${s.pct}%"></i></div>
          <div class="ach-meta">${fr.name} · ${Math.min(s.value, a.need)}/${a.need}</div>
        </div>
      </div>`;
    }).join("");

    return `
    <div class="ach-sum">
      <div><b>${claimedN}</b><span>已解锁头像框</span></div>
      <div><b>${readyN}</b><span>可领取</span></div>
      <div><b>${ACH.length}</b><span>全部成就</span></div>
      <button class="btn btn-ghost btn-sm" onclick="App.openFrames()">${icon("palette", 14)}更换</button>
    </div>
    <div class="ach-grid">${cards}</div>`;
  },

  assetCard(key, name, obj, ic) {
    let n = 0;
    if (key === "history") n = this.store.history.length;
    else if (key === "notes") n = Object.keys(this.store.notes).length;
    else n = Object.keys(obj || {}).length;
    return `
    <div class="feature-card" onclick="App.openAsset('${key}')">
      <div class="feature-ico ${key === "wrong" ? "teal" : ""}">${icon(ic, 17)}</div>
      <div><div class="feature-name">${name}</div><div class="feature-meta">${n} 条记录</div></div>
    </div>`;
  },

  openAsset(key) {
    const titles = { wrong: "错题本", notes: "我的笔记", fav: "收藏的题目", history: "历史记录" };
    let body = "";

    if (key === "history") {
      if (!this.store.history.length) body = `<div class="empty">${icon("clock", 30)}还没有历史记录</div>`;
      else body = this.store.history.map(h => `
        <div class="row" onclick="App.closeModal();App.openKnown('${h.id}')">
          <div class="row-ico">${this.store.probsDone[h.id] ? icon("check", 15) : icon("clock", 15)}</div>
          <div class="row-main"><b>${this.esc(h.title || h.id)}</b><span>${h.id}</span></div>
          <div class="row-right">${this.relTime(h.t)}</div>
        </div>`).join("");
    } else if (key === "notes") {
      const ks = Object.keys(this.store.notes);
      if (!ks.length) body = `<div class="empty">${icon("note", 30)}还没有笔记</div>`;
      else body = ks.map(id => `
        <div class="card" style="margin-bottom:10px">
          <div class="card-title" style="font-size:13px;justify-content:space-between">
            <span>${id}</span>
            <button class="btn btn-text btn-sm" onclick="App.closeModal();App.openKnown('${id}')">打开题目</button>
          </div>
          <div class="card-desc" style="white-space:pre-wrap">${this.esc(this.store.notes[id])}</div>
        </div>`).join("");
    } else {
      const ks = Object.keys(this.store[key] || {});
      if (!ks.length) body = `<div class="empty">${icon("inbox", 30)}这里是空的</div>`;
      else body = ks.map(id => `
        <div class="row" onclick="App.closeModal();App.openKnown('${id}')">
          <div class="row-ico">${icon("code", 15)}</div>
          <div class="row-main"><b>${this.esc(this.titleOf(id))}</b><span>${id}</span></div>
          <div class="row-right">${icon("chevron", 14)}</div>
        </div>`).join("");
    }
    this.openModal(titles[key] + ` · ${key === "history" ? this.store.history.length : Object.keys(key === "notes" ? this.store.notes : (this.store[key] || {})).length}`, body);
  },

  titleOf(id) {
    const p = PROBLEMS.find(x => x.id === id);
    if (p) return p.title;
    const row = (window.PROBLEM_INDEX || []).find(x => x[0] === id);
    return row ? row[1] : id;
  },

  openKnown(id) {
    if (PROBLEMS.some(x => x.id === id)) return this.openProblem(id);
    // 索引没就绪时先等它，再打开题目（避免点了没反应）
    this.ensureIndex().then(ok => {
      if (!ok || !this.indexReady) { this.toast("题库索引加载失败，请检查网络"); return; }
      this.openSolve(id);
    });
  },

  /* ---------------- 图表 ---------------- */
  last7() {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = this.fmtDate(d);
      arr.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, v: (this.store.daily[k] || {}).solved || 0 });
    }
    return arr;
  },

  lineChart(data) {
    const W = 360, H = 142, padL = 26, padR = 20, padT = 14, padB = 26;
    const max = Math.max(3, ...data.map(d => d.v));
    const iw = W - padL - padR, ih = H - padT - padB;
    const stepX = data.length > 1 ? iw / (data.length - 1) : iw;
    const pts = data.map((d, i) => [padL + i * stepX, padT + ih - (d.v / max) * ih]);
    const poly = pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ");
    const area = `M${padL.toFixed(1)},${(padT + ih).toFixed(1)} L` +
      pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" L") +
      ` L${(padL + iw).toFixed(1)},${(padT + ih).toFixed(1)} Z`;

    let grid = "";
    for (let g = 0; g <= 3; g++) {
      const y = padT + ih * g / 3;
      grid += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}"
        stroke="var(--border-soft)" stroke-width="1" stroke-dasharray="3 3"/>`;
    }
    const labels = data.map((d, i) =>
      `<text x="${(padL + i * stepX).toFixed(1)}" y="${H - 6}" font-size="9.5" fill="var(--text-3)"
        text-anchor="middle" font-family="var(--mono)">${d.label}</text>`).join("");
    const dots = pts.map((p, i) =>
      `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${data[i].v ? 3 : 2}"
        fill="${data[i].v ? "var(--primary)" : "var(--surface-3)"}"
        stroke="var(--surface)" stroke-width="1.5"/>`).join("");
    const ymax = `<text x="${padL - 6}" y="${padT + 4}" font-size="9.5" fill="var(--text-3)" text-anchor="end">${max}</text>
      <text x="${padL - 6}" y="${padT + ih + 3}" font-size="9.5" fill="var(--text-3)" text-anchor="end">0</text>`;

    return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" style="display:block">
      ${grid}
      <path d="${area}" fill="var(--primary)" opacity=".10"/>
      <polyline points="${poly}" fill="none" stroke="var(--primary)" stroke-width="2"
        stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}${labels}${ymax}
    </svg>`;
  },

  radarChart() {
    const idx = window.PROBLEM_INDEX || [];
    const axes = [
      { key: "basic", name: "基础" },
      { key: "dp", name: "DP" },
      { key: "search", name: "搜索" },
      { key: "graph", name: "图论" },
    ];
    const total = {}, done = {};
    axes.forEach(a => { total[a.key] = 0; done[a.key] = 0; });
    idx.forEach(x => {
      const g = groupOf(x[3]);
      if (total[g] === undefined) return;
      total[g]++;
      if (this.store.probsDone[x[0]]) done[g]++;
    });
    const ratios = axes.map(a => total[a.key] ? Math.min(1, done[a.key] / (total[a.key] * 0.15)) : 0);

    const cx = 120, cy = 96, R = 62;
    const ang = i => (-Math.PI / 2) + i * (Math.PI * 2 / axes.length);
    const pt = (i, r) => [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];

    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach(r => {
      const ps = axes.map((_, i) => pt(i, r).map(v => v.toFixed(1)).join(",")).join(" ");
      grid += `<polygon points="${ps}" fill="none" stroke="var(--border-soft)" stroke-width="1"/>`;
    });
    axes.forEach((_, i) => {
      const p = pt(i, 1);
      grid += `<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="var(--border-soft)" stroke-width="1"/>`;
    });

    const dataPts = ratios.map((r, i) => pt(i, Math.max(r, 0.04)).map(v => v.toFixed(1)).join(",")).join(" ");
    const labels = axes.map((a, i) => {
      const p = pt(i, 1.26);
      const anchor = Math.abs(p[0] - cx) < 6 ? "middle" : (p[0] > cx ? "start" : "end");
      return `<text x="${p[0].toFixed(1)}" y="${(p[1] + 3).toFixed(1)}" font-size="10.5" fill="var(--text-2)"
        text-anchor="${anchor}">${a.name} ${done[a.key]}</text>`;
    }).join("");

    const hasData = ratios.some(r => r > 0);
    return `<svg viewBox="0 0 240 200" width="100%" height="196" style="display:block;max-width:280px;margin:0 auto">
      ${grid}
      <polygon points="${dataPts}" fill="var(--primary)" opacity=".16" stroke="var(--primary)" stroke-width="1.8"/>
      ${labels}
      ${hasData ? "" : `<text x="120" y="100" font-size="10.5" fill="var(--text-3)" text-anchor="middle">完成题目后生成能力图谱</text>`}
    </svg>
    <div class="chart-legend" style="justify-content:center">
      <span><i style="background:var(--primary)"></i>已完成题数 / 该方向题量</span>
    </div>`;
  },

  /* ---------------- 数据管理 ---------------- */
  exportData() {
    const blob = new Blob([JSON.stringify(this.store, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `algomaster-${this.todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.toast("已导出学习数据");
  },

  clearData() {
    this.openModal("清空本地数据", `
      <p style="color:var(--text-2);font-size:13.5px;line-height:1.85">
        将删除全部学习进度、笔记、收藏、错题与历史记录，<b style="color:var(--hard)">操作不可恢复</b>。
        建议先「导出学习数据」备份。
      </p>
      <div style="display:flex;gap:10px;margin-top:18px;justify-content:flex-end">
        <button class="btn btn-ghost" onclick="App.closeModal()">取消</button>
        <button class="btn btn-primary" style="background:var(--hard)" onclick="App.confirmClear()">确认清空</button>
      </div>`);
  },

  confirmClear() {
    localStorage.removeItem("algomaster");
    this.loadStore();
    this.closeModalForce();
    this.goTab("home");          // 重置页面栈，别把「已清空的个人中心」留在栈里
    this.toast("本地数据已清空");
  },

  /* ============================================================
     课程
     ============================================================ */
  viewCourses() {
    const CI = window.COURSE_INDEX;
    if (!CI) return `<div class="page-head"><h1>${icon("book", 20)}语言课程</h1><p>课程目录加载中…</p></div>
      <div class="card">${this.skeletonRows(4, "line")}</div>`;
    const totalCh = this.totalLessons(), totalMic = this.totalMicros();
    return `
    <div class="page-head">
      <h1>${icon("book", 20)}语言课程</h1>
      <p>${CI.order.length} 门语言 · ${totalCh} 章 · ${totalMic} 节微课，每节一个知识点 + 可运行代码 + 踩坑提醒</p>
    </div>
    <div class="grid grid-2">
      ${CI.order.map(k => {
        const c = CI.langs[k];
        const done = this.countDone("lessonsDone", k);
        const pct = Math.round(done / c.chapters.length * 100);
        const mic = c.chapters.reduce((a, ch) => a + (ch.mic || 0), 0);
        return `
        <div class="card click" onclick="App.nav('course-detail','${k}')">
          <div class="card-title">${c.icon} ${c.name}</div>
          <div class="card-desc" style="margin-bottom:12px">${c.chapters.length} 章 · ${mic} 节微课 · ${Math.round(c.chapters.reduce((a, ch) => a + (ch.mins || 0), 0) / 60)} 小时</div>
          <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3);margin-bottom:6px">
            <span>${done} / ${c.chapters.length} 章</span><span>${pct}%</span>
          </div>
          <div class="bar"><i style="width:${pct}%"></i></div>
        </div>`;
      }).join("")}
    </div>

    <div class="section-head"><h2>学习资源</h2><span class="line"></span></div>
    <div class="grid grid-4">
      <div class="feature-card" onclick="App.nav('manual')">
        <div class="feature-ico">${icon("dict", 17)}</div>
        <div><div class="feature-name">速查手册</div><div class="feature-meta">常用 API 签名与示例</div></div>
      </div>
      <div class="feature-card" onclick="App.nav('interview')">
        <div class="feature-ico">${icon("target", 17)}</div>
        <div><div class="feature-name">面试题库</div><div class="feature-meta">问答 + 追问链</div></div>
      </div>
      <div class="feature-card" onclick="App.nav('skills')">
        <div class="feature-ico">${icon("note", 17)}</div>
        <div><div class="feature-name">做题技巧</div><div class="feature-meta">${TECHNIQUES.length} 篇方法论</div></div>
      </div>
      <div class="feature-card" onclick="App.nav('algo')">
        <div class="feature-ico">${icon("cpu", 17)}</div>
        <div><div class="feature-name">算法专题</div><div class="feature-meta">${ALGOS.length} 个专题</div></div>
      </div>
    </div>`;
  },

  viewCourseDetail() {
    const k = this.state.course;
    const CI = window.COURSE_INDEX;
    const c = CI && CI.langs[k];
    if (!c) return this.viewCourses();
    const done = this.countDone("lessonsDone", k);
    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
    <div class="page-head">
      <h1>${c.name}</h1>
      <p>${c.chapters.length} 章 · ${c.chapters.reduce((a, ch) => a + (ch.mic || 0), 0)} 节微课 · 已学 ${done} 章</p>
    </div>
    ${c.chapters.map((l, i) => {
      const ok = this.store.lessonsDone[`${k}-${i}`];
      return `
      <div class="row ${ok ? "done" : ""}" onclick="App.nav('lesson',['${k}',${i}])">
        <div class="row-ico">${ok ? icon("check", 15) : String(i + 1).padStart(2, "0")}</div>
        <div class="row-main"><b>${this.esc(l.t)}</b><span>${this.esc(l.sub)}</span></div>
        <div class="row-right"><span class="tag">${l.mic} 节</span></div>
      </div>`;
    }).join("")}`;
  },

  /* 章正文按语言分片懒加载：一门语言一个文件，进课程时才下载 */
  courseCache: {},
  ensureCourse(lang) {
    if (!lang) return;
    if (this.courseCache[lang] === true || this.courseCache[lang] === "loading") return;
    if ((window.COURSE_BODY || {})[lang]) { this.courseCache[lang] = true; return; }
    this.courseCache[lang] = "loading";
    this.loadScript(`data/course-${lang}.js`)
      .then(() => {
        this.courseCache[lang] = true;
        if (this.state.page === "lesson") this.render();
      })
      .catch(() => {
        this.courseCache[lang] = "err";
        if (this.state.page === "lesson") this.render();
      });
  },

  jumpSec(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const box = this.scrollEl();
    if (!box) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 10;
    box.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  },

  /* 章末「练同主题」：跳到题库并带上关键词 */
  practiceTopic(kw) {
    if (!kw) return this.nav("codex");
    this.ensureIndex().then(() => {
      const k = String(kw).toLowerCase();
      // 只有真的能搜到才带关键词，否则会跳进一个空列表
      const hit = (window.PROBLEM_INDEX || []).some(x =>
        x[1].toLowerCase().includes(k) || String(x[3]).toLowerCase().includes(k));
      this.state.codex.kw = hit ? kw : "";
      this.state.codex.page = 0;
      this.state.codex.group = "all";
      this.state.codex.diff = "all";
      this.nav("codex");
      if (!hit) this.toast("已打开全部题库，可用搜索框按题型筛选");
      const el = document.getElementById("codexKw");
      if (el) el.value = this.state.codex.kw;
      this.refreshCodexResult();
    });
  },

  viewLesson() {
    const k = this.state.course, i = this.state.lesson;
    const CI = window.COURSE_INDEX;
    const c = CI && CI.langs[k];
    const ch = c && c.chapters[i];
    if (!ch) return this.viewCourses();
    const key = `${k}-${i}`;
    const done = this.store.lessonsDone[key];
    const body = (window.COURSE_BODY || {})[k];
    const html = body && body[Number(i)];

    const nav = `
    <div class="ch-nav">
      ${i > 0 ? `<button class="btn btn-ghost" onclick="App.nav('lesson',['${k}',${i - 1}])">${icon("arrowLeft", 13)}上一章</button>`
              : `<span></span>`}
      <button class="btn ${done ? "btn-ghost" : "btn-primary"}" onclick="App.markDone('lesson','${key}')">
        ${done ? "已学完 · 点此取消" : "标记本章已学"}
      </button>
      ${i < c.chapters.length - 1 ? `<button class="btn btn-ghost" onclick="App.nav('lesson',['${k}',${i + 1}])">下一章${icon("chevron", 13)}</button>`
              : `<span></span>`}
    </div>`;

    if (!html) {
      if (this.courseCache[k] !== "loading" && this.courseCache[k] !== "err") this.ensureCourse(k);
      return `
      <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
      <div class="page-head"><h1>${this.esc(ch.t)}</h1><p>${this.esc(ch.sub)}</p></div>
      ${this.courseCache[k] === "err"
        ? `<div class="empty">${icon("alert", 30)}本章内容加载失败，请检查网络
             <div style="margin-top:14px"><button class="btn btn-ghost btn-sm" onclick="App.courseCache['${k}']=0;App.ensureCourse('${k}');App.render()">重试</button></div>
           </div>`
        : `<div class="card">${this.skeletonRows(6, "line")}</div>`}`;
    }

    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
    <div class="content-block lesson-body">${html}</div>
    <div class="ch-foot">
      ${ch.kw ? `<button class="btn btn-ghost" onclick="App.practiceTopic('${ch.kw}')">${icon("target", 14)}练同主题题目</button>` : ""}
      <button class="btn btn-ghost" onclick="App.nav('course-detail','${k}')">${icon("book", 14)}章节目录</button>
    </div>
    ${nav}`;
  },

  /* ---------------- 算法 ---------------- */
  /* 算法专题：窄屏用紧凑列表行（信息密度高、不浪费纵向空间） */
  viewAlgos() {
    const cats = [...new Set(ALGOS.map(a => a.cat))];
    const totalSecs = ALGOS.reduce((n, a) => n + (a.secs || 0), 0);
    const totalFigs = ALGOS.reduce((n, a) => n + (a.figs || 0), 0);
    const totalCodes = ALGOS.reduce((n, a) => n + (a.codes || 0), 0);
    const doneCnt = ALGOS.filter(a => this.store.algosDone[a.id]).length;
    const pct = Math.round(doneCnt / ALGOS.length * 100);
    return `
    <div class="page-head">
      <h1>${icon("cpu", 20)}算法专题</h1>
      <p>${ALGOS.length} 个专题 · ${totalSecs} 节讲义 · ${totalFigs} 张图解 · ${totalCodes} 段可运行模板</p>
    </div>

    <div class="alg-summary">
      <div class="alg-sum-main">
        <div class="alg-sum-num">${doneCnt}<i>/${ALGOS.length}</i></div>
        <div class="alg-sum-label">已掌握专题</div>
      </div>
      <div class="alg-sum-bar"><i style="width:${pct}%"></i></div>
      <div class="alg-sum-pct">${pct}%</div>
    </div>

    ${cats.map(cat => {
      const items = ALGOS.map((a, i) => ({ a, i })).filter(x => x.a.cat === cat);
      return `
      <div class="section-head"><h2>${cat}</h2><span class="line"></span><span class="sc">${items.length} 个</span></div>
      <div class="alg-list">
        ${items.map(({ a, i }) => {
          const done = this.store.algosDone[a.id];
          return `
          <div class="alg-row ${done ? "done" : ""}" onclick="App.nav('algo-detail',${i})">
            <div class="alg-no">${String(i + 1).padStart(2, "0")}</div>
            <div class="alg-main">
              <b>${this.esc(a.title)}${done ? `<span class="alg-done">${icon("check", 12)}</span>` : ""}</b>
              <span>${this.esc(a.desc)}</span>
              <div class="alg-meta">
                <em>${a.secs || 0} 节</em>
                <em>${a.mins || 0} 分钟</em>
                ${a.figs ? `<em>${a.figs} 图</em>` : ""}
                ${a.codes ? `<em>${a.codes} 模板</em>` : ""}
              </div>
            </div>
            <div class="alg-right">${this.diffTag(a.diff)}${icon("chevron", 14)}</div>
          </div>`;
        }).join("")}
      </div>`;
    }).join("")}`;
  },

  viewAlgoDetail() {
    const a = ALGOS[this.state.algo];
    if (!a) return this.viewAlgos();
    const done = this.store.algosDone[a.id];
    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
    <div class="content-block">${a.html}</div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn ${done ? "btn-ghost" : "btn-primary"}" onclick="App.markDone('algo','${a.id}')">
        ${done ? "已掌握 · 点击取消" : "标记为已掌握"}
      </button>
    </div>`;
  },

  /* ---------------- 技巧 ---------------- */
  viewSkills() {
    return `
    <div class="page-head">
      <h1>${icon("note", 20)}做题技巧</h1>
      <p>读题、调试、对拍、卡常、应试策略，${TECHNIQUES.length} 篇可执行的方法论</p>
    </div>
    ${TECHNIQUES.map((t, i) => `
      <div class="row" onclick="App.openTech(${i})">
        <div class="row-ico">${String(i + 1).padStart(2, "0")}</div>
        <div class="row-main"><b>${this.esc(t.title)}</b><span>${this.esc(t.desc)}</span></div>
        <div class="row-right"><span class="tag">${t.diff}</span></div>
      </div>`).join("")}`;
  },

  openTech(i) {
    const t = TECHNIQUES[i];
    this.openModal(t.title, `<div class="content-block" style="border:none;padding:0;box-shadow:none">${t.html}</div>`);
  },

  /* ---------------- 精讲题库 ---------------- */
  viewProblems() {
    const solved = this.solvedCount();
    return `
    <div class="page-head">
      <h1>${icon("flag", 20)}竞赛冲刺 · 精讲题</h1>
      <p>${PROBLEMS.length} 道高频经典题，四语言题解 · 已 AC ${solved} 道</p>
    </div>
    <div class="card" style="padding:10px 0">
      ${PROBLEMS.map(p => `
        <div class="prob-row" onclick="App.openProblem('${p.id}')">
          <span class="prob-id">${p.id}</span>
          <span class="prob-name">
            ${this.esc(p.title)}
            ${this.store.probsDone[p.id] ? `<span style="color:var(--teal);margin-left:6px">${icon("check", 13)}</span>` : ""}
          </span>
          <span style="width:auto">${this.diffTag(p.diff)}</span>
          <span class="prob-rate" style="width:70px">${p.tags[0] || ""}</span>
        </div>`).join("")}
    </div>`;
  },

  /* ---------------- 手册 ---------------- */
  manualCache: {},

  ensureManual(lang) {
    if (this.manualCache[lang] === true || this.manualCache[lang] === "loading") return;
    this.manualCache[lang] = "loading";
    this.loadScript(`data/manual-${lang}.js`)
      .then(() => { this.manualCache[lang] = true; if (this.state.page === "manual") this.render(); })
      .catch(() => { this.manualCache[lang] = "err"; if (this.state.page === "manual") this.render(); });
  },

  manualListHTML() {
    const lang = this.state.manualLang;
    const st = this.manualCache[lang];
    if (st !== true) {
      return st === "err"
        ? '<div class="empty">手册加载失败，切换语言或刷新可重试</div>'
        : '<div class="loading">正在加载手册…</div>';
    }
    const kw = this.state.manualKw.toLowerCase();
    const data = (window.MANUAL_DATA || {})[lang];
    const list = data ? data.entries.filter(e =>
      !kw || String(e.name).toLowerCase().includes(kw) || String(e.desc || "").toLowerCase().includes(kw)
    ) : [];
    return list.map(e => `
      <div class="row" onclick="App.openManual('${lang}','${e.id}')">
        <div class="row-ico">${icon("code", 14)}</div>
        <div class="row-main">
          <b style="font-family:var(--mono);font-size:12.8px;color:var(--primary)">${this.esc(e.name)}</b>
          <span style="font-family:var(--mono)">${this.esc(e.sig)}</span>
        </div>
        <div class="row-right">${icon("chevron", 14)}</div>
      </div>`).join("") || `<div class="empty">${icon("search", 30)}没有匹配的 API</div>`;
  },

  viewManual() {
    const lang = this.state.manualLang;
    const LANGS = [["cpp", "C++"], ["py", "Python"], ["java", "Java"], ["c", "C"]];
    const totalAll = Object.values(window.MANUAL_DATA || {}).reduce((s, m) => s + m.entries.length, 0);

    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
    <div class="page-head">
      <h1>${icon("dict", 20)}速查手册</h1>
      <p>常用 API 速查：签名、作用、避坑要点与可运行示例 · 共 ${totalAll} 条</p>
    </div>
    <div class="toolbar">
      <div class="seg">
        ${LANGS.map(([k, label]) => `
          <button class="${lang === k ? "active" : ""}" onclick="App.switchManual('${k}')">${label}</button>`).join("")}
      </div>
      <div class="search-wrap">
        ${icon("search", 15)}
        <input class="input" id="manualKw" placeholder="搜索 API 名称或说明" value="${this.esc(this.state.manualKw)}"
          oninput="App.manualKw(this.value, event)"
          oncompositionend="App.manualKw(this.value)">
      </div>
    </div>
    <div id="manualList">${this.manualListHTML()}</div>`;
  },

  switchManual(lang) {
    this.state.manualLang = lang;
    this.state.manualKw = "";
    this.ensureManual(lang);
    this.render();
  },

  manualKw(v, ev2) {
    this.state.manualKw = v;
    if (ev2 && ev2.isComposing) return;   // 中文输入法组词中不重绘
    clearTimeout(this._mkwT);
    this._mkwT = setTimeout(() => {
      const box = document.getElementById("manualList");
      if (box) box.innerHTML = this.manualListHTML();
      else this.render();
    }, 90);
  },

  openManual(lang, id) {
    const data = (window.MANUAL_DATA || {})[lang];
    const e = data && data.entries.find(x => x.id === id);
    if (!e) return;
    this.openModal(e.name, `
      <p style="font-family:var(--mono);color:var(--primary);font-size:13px">${this.esc(e.sig)}</p>
      <h4 style="font-size:11.5px;color:var(--text-3);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 6px">作用</h4>
      <p style="color:var(--text-2);font-size:13.4px">${this.esc(e.desc)}</p>
      <h4 style="font-size:11.5px;color:var(--text-3);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 6px">示例</h4>
      <pre style="background:var(--code-bg);border:1px solid var(--code-border);border-radius:8px;padding:14px;overflow-x:auto"><code style="font-family:var(--mono);font-size:12.4px;color:var(--code-text)">${this.esc(e.ex)}</code></pre>
      <h4 style="font-size:11.5px;color:var(--text-3);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 6px">要点</h4>
      <ul style="color:var(--text-2);font-size:13.2px;line-height:1.85">${(e.notes || []).map(n => `<li>${this.esc(n)}</li>`).join("")}</ul>
    `);
  },

  /* ---------------- 面试题 ---------------- */
  iv: { ready: false, err: false, items: [] },

  ensureInterview() {
    if (this.iv.ready) return;
    this.loadScript("data/interview-index.js").then(() => {
      const idx = window.INTERVIEW_INDEX || { shards: 0 };
      const loads = [];
      for (let i = 0; i < idx.shards; i++) loads.push(this.loadScript(`data/interview-${this.pad3(i)}.js`));
      return Promise.all(loads);
    }).then(() => {
      this.iv.items = Object.values(window.INTERVIEW_SHARDS || {}).flat();
      this.iv.ready = true;
      if (this.state.page === "interview") this.render();
    }).catch(() => {
      this.iv.err = true;
      if (this.state.page === "interview") this.render();
    });
  },

  /* 面试条目里每条主问题后面跟着 7 层追问，列表只展示主问题，
     追问收进详情页，避免列表被「追问（性能角度）：…」淹没 */
  ivBases() {
    if (this._ivBases) return this._ivBases;
    const isFu = (q) => /^(换个问法：|追问（)/.test(q || "");
    const bases = [];
    let cur = null;
    this.iv.items.forEach((x) => {
      if (!isFu(x.q)) { cur = { it: x, fus: [] }; bases.push(cur); }
      else if (cur) cur.fus.push(x);
    });
    this._ivBases = bases;
    return bases;
  },

  ivAngle(q) {
    const m = String(q || "").match(/^追问（(.+?)）/);
    if (m) return m[1];
    if (/^换个问法/.test(q)) return "换个问法";
    return "延伸";
  },

  ivFind(id) {
    const bases = this.ivBases();
    for (const b of bases) {
      if (b.it.id === id) return { b, i: -1 };
      const k = b.fus.findIndex((f) => f.id === id);
      if (k >= 0) return { b, i: k };
    }
    return null;
  },

  viewInterview() {
    if (!this.iv.ready) {
      return `<div class="page-head"><h1>${icon("target", 20)}面试题库</h1>
        <p>${this.iv.err ? "加载失败，请刷新重试" : "正在加载…"}</p></div>
        <div class="loading">${this.iv.err ? "" : "加载中"}</div>`;
    }
    const bases = this.ivBases();
    const topics = [...new Set(bases.map((b) => b.it.topic))];
    this._ivTopics = topics;
    const t = this.state.ivTopic;
    const all = bases.filter((b) => t === "all" || b.it.topic === t);
    const shown = Math.max(40, this.state.ivShow || 40);
    const list = all.slice(0, shown);
    const fuTotal = bases.reduce((n, b) => n + b.fus.length, 0);
    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
    <div class="page-head">
      <h1>${icon("target", 20)}面试题库</h1>
      <p>${bases.length} 组问答 · ${topics.length} 个方向 · ${fuTotal} 条延伸追问</p>
    </div>
    <div class="cat-chips">
      <button class="chip ${t === "all" ? "active" : ""}" onclick="App.setIvTopic(-1)">全部</button>
      ${topics.map((x, i) => `<button class="chip ${t === x ? "active" : ""}" onclick="App.setIvTopic(${i})">${this.esc(x)}</button>`).join("")}
    </div>
    ${list.map((b) => `
      <div class="row iv-row" onclick="App.openIv('${b.it.id}')">
        <div class="row-ico" style="font-size:10.5px">${this.esc(b.it.topic.slice(0, 2))}</div>
        <div class="row-main">
          <b>${this.esc(b.it.q)}</b>
          <span>${b.fus.length ? `含 ${b.fus.length} 层追问` : "单题精讲"}</span>
        </div>
        <div class="row-right">${icon("chevron", 14)}</div>
      </div>`).join("")}
    ${all.length > shown
      ? `<div class="more-wrap"><button class="btn btn-ghost" onclick="App.moreIv()">再显示 40 条（剩 ${all.length - shown}）</button></div>`
      : all.length > 40 ? `<p class="list-end">已显示全部 ${all.length} 组</p>` : ""}`;
  },

  setIvTopic(i) {
    this.state.ivTopic = i < 0 ? "all" : (this._ivTopics || [])[i] || "all";
    this.state.ivShow = 40;      // 换方向时重置分页
    this.render();
    this.scrollTo(0);
  },

  moreIv() {
    this.state.ivShow = (this.state.ivShow || 40) + 40;
    const keep = this.scrollTop();
    this.render();
    this.scrollTo(keep);         // 保持阅读位置，不要跳回顶部
  },

  openIv(id) {
    const hit = this.ivFind(id);
    if (!hit) return;
    const { b, i } = hit;
    const sel = i >= 0 ? b.fus[i] : null;
    const firstPara = (t) => String(t || "").split("\n\n")[0];
    const body = `
      <div class="iv-head">
        <span class="tag tag-primary">${this.esc(b.it.topic)}</span>
        ${sel ? `<span class="tag tag-teal">追问 · ${this.esc(this.ivAngle(sel.q))}</span>` : ""}
      </div>
      <p class="iv-answer">${this.esc(b.it.a)}</p>
      ${b.fus.length ? `
      <div class="iv-chain-title">追问链 · ${b.fus.length} 层（点开切换）</div>
      <div class="iv-chain">
        ${b.fus.map((f, k) => `
          <div class="iv-fu ${k === i ? "on" : ""}" onclick="App.openIv('${f.id}')">
            <div class="iv-fu-head"><span class="iv-fu-no">${k + 1}</span>${this.esc(this.ivAngle(f.q))}</div>
            <p class="${k === i ? "full" : ""}">${this.esc(firstPara(f.a))}</p>
          </div>`).join("")}
      </div>` : ""}`;
    this.openModal(sel ? `${this.ivAngle(sel.q)}：${b.it.q}` : b.it.q, body);
    const on = document.querySelector(".iv-fu.on");
    if (on) on.scrollIntoView({ block: "center" });
  },

  /* ---------------- 打卡 ---------------- */
  viewCheckin() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = this.todayStr();
    const checkedToday = this.store.checkins.includes(today);
    const set = new Set(this.store.checkins);
    const monthNames = ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"];
    const weeks = ["日", "一", "二", "三", "四", "五", "六"];
    const monthCount = this.store.checkins.filter(d => d.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).length;
    const lessonsDone = Object.values(this.store.lessonsDone).filter(Boolean).length;
    const algosDone = Object.values(this.store.algosDone).filter(Boolean).length;

    let cells = weeks.map(w => `<div class="cal-head">${w}</div>`).join("");
    for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day" style="background:none"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const cls = ["cal-day", set.has(ds) ? "checkin" : "", ds === today ? "today" : "", ds > today ? "future" : ""].join(" ");
      cells += `<div class="${cls}">${d}</div>`;
    }

    return `
    <a class="back-link" onclick="App.goBack()">${icon("arrowLeft", 14)}返回</a>
    <div class="page-head">
      <h1>${icon("check", 20)}每日打卡</h1>
      <p>连续学习靠积累，今天打卡后连续天数 +1</p>
    </div>
    <div class="checkin-grid">
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div class="card-title" style="margin:0">${monthNames[m]} ${y}</div>
          <span class="tag">本月 ${monthCount} 天</span>
        </div>
        <div class="calendar">${cells}</div>
      </div>
      <div>
        <div class="card" style="margin-bottom:14px;text-align:center">
          <div style="padding:8px 0 4px">
            <div style="font-size:34px;font-weight:600;letter-spacing:-1px;color:var(--teal)">${this.streak()}</div>
            <div style="font-size:12px;color:var(--text-3)">当前连续打卡天数</div>
          </div>
          <button class="btn ${checkedToday ? "btn-ghost" : "btn-primary"} btn-block" style="margin-top:14px"
            ${checkedToday ? "disabled" : ""} onclick="App.doCheckin()">
            ${checkedToday ? "今天已打卡" : "打卡 · 今日学习完成"}
          </button>
          <p style="font-size:11.5px;color:var(--text-3);margin-top:10px">累计打卡 ${this.store.checkins.length} 天</p>
        </div>
        <div class="card">
          <div class="card-title">学习进度</div>
          ${[
            ["语言课程", lessonsDone, this.totalLessons(), "章"],
            ["算法专题", algosDone, ALGOS.length, "个"],
            ["题库 AC", this.solvedCount(), (window.CONTENT_STATS || {}).problems || 0, "题"],
          ].map(([name, a, b, unit]) => {
            const pct = b ? Math.round(a / b * 100) : 0;
            return `
            <div style="margin-top:12px">
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:5px">
                <span>${name}</span><span style="font-family:var(--mono);color:var(--text-3)">${a} / ${b} ${unit}</span>
              </div>
              <div class="bar teal"><i style="width:${pct}%"></i></div>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
  },

  doCheckin() {
    const today = this.todayStr();
    if (!this.store.checkins.includes(today)) {
      this.store.checkins.push(today);
      this.saveStore();
      this.toast("打卡成功 · 连续 " + this.streak() + " 天");
    }
    this.render();
  },

  /* ---------------- 通用动作 ---------------- */
  markDone(type, key) {
    const map = { lesson: "lessonsDone", algo: "algosDone" }[type];
    this.store[map][key] = !this.store[map][key];
    this.saveStore();
    this.render();
  },

  openModal(title, html, auto) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = html;
    const m = document.getElementById("modal");
    m.dataset.auto = auto ? "1" : "";
    m.classList.remove("hidden");
    document.body.classList.add("modal-lock");   // 防止弹层后面的页面跟着滚
    this.enhanceCode();
    this.updateChrome();
  },
  modalOpen() {
    const m = document.getElementById("modal");
    return !!(m && !m.classList.contains("hidden"));
  },
  closeModal(e) {
    if (e && e.target && e.target.id !== "modal") return;
    this._exitOpen = false;
    const m = document.getElementById("modal");
    if (m) m.classList.add("hidden");
    document.body.classList.remove("modal-lock");
    this.updateChrome();
  },
  closeModalForce() {
    this._exitOpen = false;
    const m = document.getElementById("modal");
    if (m) m.classList.add("hidden");
    document.body.classList.remove("modal-lock");
    this.updateChrome();
  },

  /* ---------------- 安装引导 ---------------- */
  detectEnv() {
    const ua = navigator.userAgent || "";
    const ios = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/i.test(ua) && "ontouchend" in document);
    // 国产手机浏览器内核大多阉割了 PWA 安装能力（不会触发安装事件），
    // 只能靠「浏览器菜单 → 添加到桌面」，所以单独识别并给出对应文案
    let cnn = "";
    if (/vivobrowser|vivo/i.test(ua)) cnn = "vivo";
    else if (/UCBrowser|UCWEB/i.test(ua)) cnn = "UC";
    else if (/Quark/i.test(ua)) cnn = "夸克";
    else if (/HuaweiBrowser|Huawei/i.test(ua)) cnn = "华为";
    else if (/MiuiBrowser|XiaoMi|MIUI/i.test(ua)) cnn = "小米";
    else if (/OppoBrowser|HeyTap|Oppo/i.test(ua)) cnn = "OPPO";
    else if (/baidubrowser|BIDUBrowser|baidu/i.test(ua)) cnn = "百度";
    else if (/QihooBrowser|360SE|360browser/i.test(ua)) cnn = "360";
    return {
      ua,
      wechat: /MicroMessenger/i.test(ua),
      // 注意：QQ 浏览器（MQQBrowser）是正经浏览器，能安装，不能当成内置浏览器；
      // 只有 QQ 内置浏览器（UA 里带 " QQ/"）才无法安装
      qqapp: /\bQQ\//i.test(ua) && !/MQQBrowser/i.test(ua),
      qqbrowser: /MQQBrowser/i.test(ua) || /QQBrowser/i.test(ua),
      qq: /\bQQ\//i.test(ua) && !/MQQBrowser/i.test(ua),
      weibo: /Weibo/i.test(ua),
      ios,
      android: /android/i.test(ua),
      edge: /Edg\//i.test(ua),
      chrome: /Chrome\//i.test(ua) && !/Edg\//i.test(ua) && !cnn,
      firefox: /Firefox\//i.test(ua),
      cnn,                                   // 国产浏览器名称，"WebView" 表示安卓内置壳
      webview: /;\s*wv\)/i.test(ua) || /Version\/\d+\.\d+ .*Chrome\/\d+ Mobile Safari/i.test(ua) && /;\s*wv/i.test(ua),
      standalone: window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true,
    };
  },

  canPromptInstall() {
    return !!(window.AMInstall && window.AMInstall.canPrompt && window.AMInstall.canPrompt());
  },

  /* 浏览器自身已具备安装条件（我们把 beforeinstallprompt 放行了，没拦截）。
     这类浏览器会自己弹「安装到桌面」，我们的文案要说对，别叫用户去翻菜单。 */
  canNativeInstall() {
    return !!(window.AMInstall && window.AMInstall.nativeReady && window.AMInstall.nativeReady());
  },

  /* ---------- 首屏自动弹出的安装选项 ---------- */
  autoInstallPrompt() {
    if (!window.AMInstall) return false;
    if (this.inShell()) return false;      // 已经装成 App 了，别再劝安装
    const env = this.detectEnv();
    if (env.standalone) return false;
    // 用户选过「以后再说」就安静 3 天
    try {
      const last = parseInt(localStorage.getItem("algomaster-install-hide") || "0", 10);
      if (last && Date.now() - last < 12 * 3600 * 1000) return false;   // 半天冷却，别让用户以为功能消失了
    } catch (e) {}

    const inApp = env.wechat || env.qq || env.weibo;
    const app = env.wechat ? "微信" : env.qq ? "QQ" : "微博";
    const direct = this.canPromptInstall();

    let title, btn, note;
    if (inApp) {
      title = "在浏览器打开即可安装";
      btn = `<button class="btn btn-primary btn-block" onclick="App.copyLink(true)">${icon("share", 15)}复制链接，去浏览器安装</button>`;
      note = `${app}内置浏览器不允许网页直接安装（平台限制）。复制链接，粘贴到浏览器打开即可。`;
    } else if (env.cnn) {
      const native = this.canNativeInstall();
      title = env.android ? "下载装成 App" : "装到桌面";
      btn = env.android
        ? `<button class="btn btn-primary btn-block" onclick="App.downloadApk()">${icon("download", 15)}下载安装包</button>`
        : `<button class="btn btn-primary btn-block" onclick="App.openInstallGuide()">${icon("download", 15)}查看添加到桌面步骤</button>`;
      note = env.android
        ? `下载完点开文件就能安装，不用在${env.cnn}浏览器菜单里找「添加到桌面」${native ? "（浏览器也可能自己弹安装提示，看到就点）" : ""}。`
        : `就在${env.cnn}浏览器里操作：点菜单「≡」→「添加到桌面」，一次装好，之后从桌面图标直接进入。`;
    } else if (env.ios) {
      title = "安装到桌面";
      btn = `<button class="btn btn-primary btn-block" onclick="App.openInstallGuide()">${icon("download", 15)}查看添加步骤</button>`;
      note = `iPhone / iPad：点 Safari 底部「分享」→「添加到主屏幕」。`;
    } else if (direct) {
      title = "安装到桌面";
      btn = `<button class="btn btn-primary btn-block" onclick="App.installNow()">${icon("download", 15)}立即安装</button>`;
      note = `点一下会弹出系统安装框，装完从桌面图标启动。`;
    } else {
      title = "安装到桌面";
      btn = `<button class="btn btn-primary btn-block" onclick="App.openInstallGuide()">${icon("download", 15)}查看安装方法</button>`;
      note = `在浏览器菜单里选「安装应用」或「添加到主屏幕」。`;
    }

    const body = `
      <div class="inst-hero">
        <div class="inst-logo">${icon("zap", 26)}</div>
        <div class="inst-hero-txt">
          <b>AlgoMaster</b>
          <span>27,933 道题 · 80 章课程 · 320 节微课</span>
        </div>
      </div>
      <ul class="inst-perks">
        <li>${icon("check", 13)}<span>桌面独立图标，全屏启动</span></li>
        <li>${icon("check", 13)}<span>核心内容已缓存，断网也能刷题</span></li>
        <li>${icon("check", 13)}<span>学习记录只存本机，不上传</span></li>
      </ul>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="App.dismissInstallGuide()">以后再说</button>
        ${btn.replace("btn-block", "")}
      </div>
      <p class="inst-note">${note}</p>`;
    this.openModal(title, body, true);   // auto=true：不因它显示返回键
    return true;
  },

  dismissInstallGuide() {
    try { localStorage.setItem("algomaster-install-hide", String(Date.now())); } catch (e) {}
    this.closeModalForce();
    this.toast("已隐藏，需要时点首页的「安装」入口");
  },

  /* 首页安装入口条：比藏在顶栏图标里更直观 */
  installStripHTML() {
    if (this.store.installStripHidden) return "";
    if (this.inShell()) return "";         // 壳里已经是 App，不需要安装入口
    const env = this.detectEnv();
    if (env.standalone) return "";
    const sub = (env.wechat || env.qq || env.weibo)
      ? "先在浏览器打开，再下载安装"
      : env.android
        ? "下载安装包，一步装成独立 App"
        : env.ios
          ? "分享 → 添加到主屏幕，两步完成"
          : "全屏启动 · 断网可用 · 桌面一键直达";
    const label = env.android ? "下载 App" : "一键安装";
    return `
    <div class="install-strip">
      <div class="install-strip-ico">${icon("download", 17)}</div>
      <div class="install-strip-txt">
        <b>安装到桌面</b>
        <span>${sub}</span>
      </div>
      <button class="btn btn-primary btn-sm" onclick="App.installNow()">${label}</button>
      <button class="install-strip-x" onclick="App.dismissInstallStrip(event)" aria-label="不再提示" title="不再提示">${icon("x", 13)}</button>
    </div>`;
  },
  dismissInstallStrip(e) {
    if (e) e.stopPropagation();
    this.store.installStripHidden = true;
    this.saveStore();
    const el = document.querySelector(".install-strip");
    if (!el) return;
    el.style.transition = "opacity .16s ease, transform .16s ease, margin .16s ease, height .16s ease";
    el.style.opacity = "0";
    el.style.height = "0";
    el.style.marginTop = "0";
    el.style.paddingTop = "0";
    el.style.paddingBottom = "0";
    el.style.overflow = "hidden";
    setTimeout(() => {
      el.remove();
      // 首页入口条没了，可以让底部提示条接上
      if (window.AMInstall && window.AMInstall.syncVisibility) window.AMInstall.syncVisibility();
    }, 180);
  },

  currentUrl() {
    return location.origin + location.pathname + location.search;
  },

  /* 真正的安卓安装包：任何浏览器点开就能下载安装，不依赖浏览器是否支持 PWA、
     也不依赖菜单里有没有「添加到桌面」——这是门槛最低的一条路。 */
  apkUrl() {
    return location.origin + "/download/algomaster.apk" + (location.search || "");
  },
  apkBlock() {
    return `
      <a class="btn btn-primary btn-block apk-btn" href="${this.apkUrl()}" download="algomaster.apk" rel="noopener">
        ${icon("download", 15)}下载安卓安装包（.apk · 极轻量）
      </a>
      <p class="guide-foot">下载完成后点开文件 → 允许安装 → 桌面出现「AlgoMaster」图标。这是原生 App，
        跟浏览器有没有「添加到桌面」菜单无关。</p>`;
  },
  downloadApk() {
    const a = document.createElement("a");
    a.href = this.apkUrl();
    a.download = "algomaster.apk";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.closeModalForce();
    this.toast("开始下载安装包，下载完点开文件安装");
  },

  /* 国产浏览器不认 PWA 安装，但安卓系统支持用 intent:// 直接把链接甩给 Chrome。
     Chrome 打开后立刻满足安装条件，会弹系统安装框——这是「点一下真能装上」的最短路径。 */
  openInChrome() {
    const env = this.detectEnv();
    const url = this.currentUrl();
    if (!env.android) { this.copyLink(true); return; }
    const rest = url.replace(/^https?:\/\//, "");
    const intentUrl = `intent://${rest}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
    try { location.href = intentUrl; } catch (e) {}
    // 2.2 秒后仍停在本页 → Chrome 没接管（未安装 / 被拦），兜底把链接复制好
    setTimeout(() => {
      if (document.visibilityState === "visible") this.copyLink(true);
    }, 2200);
  },

  installNow() {
    if (this.canPromptInstall()) {
      window.AMInstall.prompt();
      this.closeModalForce();
      return;
    }
    const env = this.detectEnv();
    // 微信 / QQ / 微博内无法直接安装：一步到位把链接复制好，用户只需粘贴到浏览器
    if (env.wechat || env.qq || env.weibo) {
      this.copyLink(true);
      return;
    }
    // 安卓：直接下载安装包，绕开所有浏览器差异（自带浏览器常常没有「添加到桌面」）
    if (env.android) { this.downloadApk(); return; }
    // 其余情况就在当前（默认）浏览器里装：打开图文步骤，不强行跳到别的浏览器
    this.openInstallGuide();
  },

  copyLink(quiet) {
    const url = this.currentUrl();
    const done = () => this.toast(
      quiet
        ? "链接已复制 · 粘贴到浏览器打开，即可安装"
        : "链接已复制 · 打开浏览器粘贴即可安装"
    );
    const fail = () => {
      if (quiet) this.openInstallGuide();
      else this.toast("长按上方链接手动复制");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => this.fallbackCopy(url, done, fail));
    } else {
      this.fallbackCopy(url, done, fail);
    }
  },
  fallbackCopy(text, cb, onFail) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) cb();
    else if (onFail) onFail();
    else this.toast("复制失败，请手动长按地址栏复制");
  },

  /* 环境自检：装不上时把手机上的真实情况抓出来（用户复制发过来即可精确定位） */
  envReport() {
    const env = this.detectEnv();
    const ctrl = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
    const man = document.querySelector('link[rel="manifest"]');
    const modes = ["standalone", "minimal-ui", "fullscreen", "browser"]
      .filter(m => { try { return matchMedia("(display-mode: " + m + ")").matches; } catch (e) { return false; } });
    const kind = env.wechat ? "微信内置" : env.qq ? "QQ内置" : env.weibo ? "微博内置"
      : env.cnn ? env.cnn + "浏览器" : env.qqbrowser ? "QQ浏览器"
      : env.chrome ? "Chrome" : env.edge ? "Edge" : env.firefox ? "Firefox" : "其他/WebView";
    return [
      "【AlgoMaster·安装自检】",
      "浏览器: " + kind,
      "UA: " + env.ua,
      "页面: " + location.href,
      "安装事件已触发: " + this.canPromptInstall() + " | 已放行原生提示: " + this.canNativeInstall(),
      "SW 控制页面: " + ctrl,
      "manifest: " + (man ? man.getAttribute("href") : "缺失"),
      "显示模式: " + (modes.join(",") || "未知"),
      "屏幕: " + screen.width + "x" + screen.height + " dpr=" + (window.devicePixelRatio || 1)
    ].join("\n");
  },

  copyEnv() {
    const txt = this.envReport();
    const done = () => this.toast("已复制，发给开发者即可定位");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done).catch(() => this.fallbackCopy(txt, done, () => this.openModal("环境信息", `<pre style="white-space:pre-wrap;font-size:11.5px;line-height:1.7;color:var(--text-2)">${txt}</pre>`)));
    } else {
      this.fallbackCopy(txt, done, () => this.openModal("环境信息", `<pre style="white-space:pre-wrap;font-size:11.5px;line-height:1.7;color:var(--text-2)">${txt}</pre>`));
    }
  },

  openInstallGuide() {
    const env = this.detectEnv();
    const steps = list => list.map(([t, d], i) => `
      <div class="step-row">
        <span class="step-n">${i + 1}</span>
        <div class="row-main"><b>${t}</b><span>${d}</span></div>
      </div>`).join("");
    const actions = html => `<div class="modal-actions">${html}</div>`;

    let body;
    if (env.standalone) {
      body = `<div class="guide-ok">${icon("check", 20)}<div><b>已经是 App 模式</b>
        <p>当前为全屏独立窗口运行，支持离线打开，无需再安装。</p></div></div>`;
    } else if (env.wechat || env.qq || env.weibo) {
      const app = env.wechat ? "微信" : env.qq ? "QQ" : "微博";
      body = `
        <div class="guide-warn">${icon("alert", 15)}
          <span><b>${app}内不能直接安装</b>，这是平台限制。复制下方链接，在浏览器打开，就能装到桌面。</span>
        </div>
        <div class="guide-url" onclick="App.copyLink()">
          <span>${this.currentUrl()}</span>${icon("share", 14)}
        </div>
        ${actions(`<button class="btn btn-primary btn-block" onclick="App.copyLink()">${icon("download", 15)}复制链接 · 去浏览器安装</button>`)}
        <p class="guide-foot">浏览器里打开后：安卓点「安装应用」或「添加到主屏幕」；iOS 点「分享 → 添加到主屏幕」。</p>`;
    } else if (env.ios) {
      body = `
        <div class="guide-note">${icon("share", 15)}
          <span>iPhone / iPad 需要手动添加到主屏幕，只需两步：</span>
        </div>
        ${steps([
          ["点 Safari 底部的「分享」按钮", "就是方框加向上箭头那个图标"],
          ["选择「添加到主屏幕」", "右上角「添加」，桌面就会出现「AlgoMaster」"]
        ])}
        <p class="guide-foot">注意：微信 / QQ 内打开无法添加，请先用 Safari 打开本页。</p>`;
    } else if (env.cnn) {
      const native = this.canNativeInstall();
      body = `
        ${env.android ? this.apkBlock() : ""}
        <div class="guide-note">${icon("download", 15)}
          <span>也可以不下载：在<b>${env.cnn}浏览器</b>里用自带菜单安装${native ? "，页面已具备安装条件，浏览器可能会自己弹提示" : ""}。</span>
        </div>
        <div class="guide-shot">
          <div class="guide-shot-bar">
            <span class="gs-ico"></span>
            <span class="gs-ico"></span>
            <span class="gs-hit"><span class="gs-tip">点这里</span><span class="gs-ico gs-menu">≡</span></span>
            <span class="gs-ico"></span>
            <span class="gs-ico"></span>
          </div>
          <p class="gs-cap">浏览器底部菜单栏（部分机型在右上角「⋮」）</p>
        </div>
        ${steps([
          ["点开菜单，找「安装应用」", "没有这个就叫「添加到桌面」「添加到主屏幕」「创建快捷方式」，也可能在「更多」里"],
          ["确认安装，回桌面点开「AlgoMaster」", "图标已生成，全屏启动、断网也能刷题"]
        ])}
        ${actions(
          `<button class="btn btn-ghost" onclick="App.copyLink()">${icon("share", 15)}复制链接</button>
           <button class="btn btn-primary" onclick="App.openInChrome()">${icon("download", 15)}用 Chrome 打开</button>`
        )}
        <p class="guide-foot">菜单里两项都试一下：「安装应用」装出来是全屏 App；「添加到桌面」是快捷方式，同样能全屏打开。</p>`;
    } else if (env.android) {
      body = this.canPromptInstall()
        ? `<div class="guide-ok">${icon("download", 20)}<div><b>可直接安装</b>
             <p>点击下方按钮，浏览器会询问是否安装到桌面。</p></div></div>
           ${this.apkBlock()}`
        : `${this.apkBlock()}
           ${steps([
             ["也可以在浏览器里装", "点右上角菜单（⋮）→「安装应用」或「添加到主屏幕」"],
             ["安装后独立窗口运行", "桌面生成图标，全屏启动、离线可用"]
           ])}`;
    } else {
      body = this.canPromptInstall()
        ? `<div class="guide-ok">${icon("download", 20)}<div><b>可直接安装</b>
             <p>浏览器地址栏右侧会出现安装图标，或点下面的按钮。</p></div></div>
           ${actions(`<button class="btn btn-primary btn-block" onclick="App.installNow()">安装到桌面</button>`)}`
        : `${steps([
          ["点地址栏右侧的「安装」图标", "Chrome / Edge 会显示 ⊕ 或显示器图标"],
          ["或打开浏览器菜单 →「安装 AlgoMaster」", "Safari（Mac）用「文件 → 添加到程序坞」"],
          ["安装后独立窗口运行", "与本地程序一样，有独立图标与窗口"]
        ])}`;
    }

    const inApp = env.wechat || env.qq || env.weibo;
    if (!env.standalone && !inApp) {
      // 各浏览器菜单项叫法差异极大，找不到时给出替代入口，别让用户卡死在这一步
      body += `
      <div class="guide-alt">
        <b>菜单里没有「安装」/「添加到桌面」？</b>
        <span>换个名字找：「添加到主屏幕」「创建快捷方式」「安装应用」；也可能藏在「更多」「工具」里。点浏览器的「分享」按钮通常也能找到。都没有就复制链接用 Chrome 打开，Chrome 会直接弹安装框。</span>
      </div>
      <button class="guide-env" onclick="App.copyEnv()">${icon("share", 13)}还是装不上？复制环境信息发我</button>`;
    }

    this.openModal("安装到桌面", body);
  },

  openAnnouncements() {
    this.openModal("消息与公告", `
      <div class="row" style="cursor:default">
        <div class="row-ico">${icon("bell", 15)}</div>
        <div class="row-main"><b>内容扩充完成</b><span>算法专题增至 ${ALGOS.length} 个，做题技巧 ${TECHNIQUES.length} 篇</span></div>
      </div>
      <div class="row" style="cursor:default">
        <div class="row-ico">${icon("code", 15)}</div>
        <div class="row-main"><b>题库已更新</b><span>共 ${((window.CONTENT_STATS || {}).problems || 0).toLocaleString()} 道题，支持按方向筛选与在线作答</span></div>
      </div>
      <div class="row" style="cursor:default">
        <div class="row-ico">${icon("sun", 15)}</div>
        <div class="row-main"><b>深色 / 浅色双模式</b><span>右上角图标随时切换，设置会记住</span></div>
      </div>
      <p style="font-size:12px;color:var(--text-3);margin-top:16px">
        本应用全部数据保存在本地浏览器，不上传服务器。
      </p>`);
  },
};

/* ---------------- 启动 ---------------- */
// const 声明不会挂到 window 上，安装引导脚本等处用的是 window.App，必须显式导出
window.App = App;

/* 兼容旧接口：COURSES[lang].lessons 是章节列表（title/sub），
   章节正文在 data/course-<lang>.js 里按需加载 */
const COURSES = {};
(function buildCourseShim() {
  const CI = window.COURSE_INDEX;
  if (!CI) return;
  CI.order.forEach((k) => {
    const c = CI.langs[k];
    COURSES[k] = {
      name: c.name, cls: c.cls, icon: c.icon, desc: c.desc,
      lessons: c.chapters.map((ch) => ({ title: ch.t, sub: ch.sub, mic: ch.mic })),
    };
  });
})();
window.COURSES = COURSES;

document.addEventListener("DOMContentLoaded", () => App.boot());
