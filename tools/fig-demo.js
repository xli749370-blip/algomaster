/** 图元预览：node tools/fig-demo.js → tools/shots/fig-demo-{dark,light}.png */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const F = require("./figs");

const ROOT = path.resolve(__dirname, "..");

const figs = [
  F.arr({
    label: "双指针 · 对撞", vals: [1, 3, 5, 7, 9, 11, 13], idx: true,
    spans: [{ from: 2, to: 4, label: "窗口 [l, r]" }],
    ptrs: [{ i: 2, label: "l" }, { i: 4, label: "r" }],
    cap: "两个指针从两端向中间收拢，每一步都能排除一个不可能的答案。",
  }),
  F.arr({
    label: "二分查找 · 区间收缩", vals: [2, 4, 6, 8, 10, 12, 14, 16], idx: true,
    marks: [{ i: 4, cls: "f-hi" }, { i: 1, cls: "" }, { i: 6, cls: "" }],
    ptrs: [{ i: 1, label: "L" }, { i: 4, label: "mid" }, { i: 6, label: "R" }],
    cap: "mid 命中目标；未命中时按大小关系丢掉一半区间。",
  }),
  F.blocks({
    label: "链表 · 单链表插入", kind: "list",
    items: ["1", "2", "3", "4"], mark: [1],
    ptrs: [{ i: 1, label: "prev" }, { i: 2, label: "cur" }],
    cap: "先改新节点的 next，再改 prev 的 next，顺序反了会断链。",
  }),
  F.tree({
    label: "二叉树 · 前中后序", levels: [[1], [2, 3], [4, 5, 6, 7]], hl: [1, 4],
    cap: "前序 1-2-4-5-3-6-7，中序 4-2-5-1-6-3-7，后序 4-5-2-6-7-3-1。",
  }),
  F.layers({
    label: "BFS · 按层扩散",
    layers: [["A"], ["B", "C"], ["D", "E", "F"]],
    edges: [[[0, 0], [1, 0]], [[0, 0], [1, 1]], [[1, 0], [2, 0]], [[1, 0], [2, 1]], [[1, 1], [2, 2]]],
    cap: "队列保证同一层的点先被全部处理，因此第一次到达就是最短步数。",
  }),
  F.grid({
    label: "DP 表 · 0/1 背包", head: ["", "w=1", "w=2", "w=3", "w=4"],
    headCol: ["∅", "v1", "v2", "v3"], hl: [[2, 3]],
    rows: [["0", "0", "0", "0"], ["0", "2", "2", "2"], ["0", "2", "4", "6"], ["0", "2", "4", "6"]],
    cap: "dp[i][j] 只依赖正上方与左上方两个格子，可压成一维。",
  }),
  F.pipe({
    label: "C++ 编译四阶段",
    steps: [{ t: "预处理", sub: ".i" }, { t: "编译", sub: ".s" }, { t: "汇编", sub: ".o" }, { t: "链接", sub: "可执行文件" }],
    cap: "每一步出错，报错信息的形态完全不同，先定位阶段再动手改。",
  }),
  F.curve({
    label: "复杂度增长", curves: [
      { name: "O(log n)", f: (t) => Math.log2(1 + t * 15) },
      { name: "O(n)", f: (t) => t * 12, cls: "f-hi" },
      { name: "O(n log n)", f: (t) => t * 12 * Math.log2(2 + t * 8) },
      { name: "O(n²)", f: (t) => t * t * 12 },
    ],
    cap: "n = 10^5 时，O(n²) 已经是 10^10 次运算，必然超时。",
  }),
  F.buckets({
    label: "哈希表 · 拉链法", hit: "key7",
    buckets: [["0", []], ["1", [["key1", 3], ["key7", 9]]], ["2", [["key2", 5]]], ["3", []], ["4", [["key4", 1]]]],
    cap: "冲突的元素挂在同一条链上，负载因子过高时要扩容。",
  }),
  F.mem({
    label: "C 数组 · 连续内存", ptr: { i: 2, label: "arr" },
    cells: [
      { addr: "0x100", val: "11", name: "a[0]" }, { addr: "0x104", val: "22", name: "a[1]" },
      { addr: "0x108", val: "33", name: "a[2]" }, { addr: "0x10c", val: "44", name: "a[3]" },
    ],
    cap: "a[i] 等价于 *(a + i)，地址按元素大小等距递增。",
  }),
  F.passes({
    label: "冒泡排序 · 每趟结果",
    passes: [
      { tag: "初始", vals: [5, 1, 4, 2, 8] },
      { tag: "第 1 趟", vals: [1, 4, 2, 5, 8], mark: [4, 3] },
      { tag: "第 2 趟", vals: [1, 2, 4, 5, 8], mark: [3, 2] },
    ],
    cap: "每趟把当前最大值送到末尾，已排好的部分不再比较。",
  }),
  F.blocks({ label: "栈 · 后进先出", kind: "stack", items: ["3", "7", "1"], cap: "只在一端进出。" }),
];

function page(theme, list) {
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">
<link rel="stylesheet" href="../css/style.css">
<style>body{background:var(--bg);margin:0;padding:10px;font-family:var(--font);color:var(--text)}
.wrap{max-width:700px;margin:0 auto}.content-block{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px}</style>
</head><body><div class="wrap"><div class="content-block">${(list || figs).join("\n")}</div></div></body></html>`;
}

const CHROME = ["C:////Program Files////Google////Chrome////Application////chrome.exe"].find((p) => fs.existsSync(p));
const out = path.join(__dirname, "shots");
fs.mkdirSync(out, { recursive: true });
const groups = [];
for (let i = 0; i < figs.length; i += 3) groups.push(figs.slice(i, i + 3));
for (const theme of ["dark", "light"]) {
  groups.forEach((g, gi) => {
    const f = path.join(__dirname, `fig-${theme}-${gi}.html`);
    fs.writeFileSync(f, page(theme, g));
    execFileSync(CHROME, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2",
      "--window-size=740,880", "--screenshot=" + path.join(out, `fig-${theme}-${gi}.png`),
      "file:///" + f.replace(/\\/g, "/"),
    ], { stdio: "ignore" });
    console.log(`OK fig-${theme}-${gi}.png`);
  });
}
