#!/usr/bin/env node
/**
 * 题解生成器：把题库里每道题按「题型知识库」展开成一份完整题解
 * 输出 data/sol-<shard>.js（分片与 data/problems-<shard>.js 同号，按需懒加载）
 *
 *   node tools/gen-solutions.js            # 全量
 *   node tools/gen-solutions.js --limit 20 # 只跑前 20 个分片（抽样验证体积）
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const KB = require("./kb.js");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > 0 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const pad3 = n => String(n).padStart(3, "0");

/* 题型 key → 中文名（题解头部展示用） */
const TYPE_NAME = {
  "sum-array": "数组求和", "max-array": "求最大值与下标", "reverse-array": "数组原地逆序", "matrix-transpose": "矩阵转置",
  "bubble-sort": "冒泡排序", "count-inversions": "逆序对计数", "sort-multi-key": "多关键字排序", "merge-two-sorted": "合并两个有序数组",
  "binary-search": "二分查找", "binary-leftmost": "二分求边界", "binary-sqrt": "二分开方", "rotated-min": "旋转数组最小值",
  "count-occur": "二分统计出现次数", "binary-ship-capacity": "二分答案",
  "prefix-sum": "前缀和", "diff-range": "差分", "prefix-2d": "二维前缀和",
  "two-sum-sorted": "有序数组两数之和", "max-water": "盛最多水的容器", "rain-water": "接雨水", "dedup-sorted": "有序数组去重",
  "window-sum": "定长滑窗求和", "slide-max": "滑动窗口最大值", "min-window": "最小覆盖子串",
  "reverse-string": "字符串翻转", "palindrome": "回文判定", "char-count": "字符统计", "rle": "行程编码",
  "anagram-pairs": "变位词分组", "trie-prefix": "字典树前缀查询", "kmp-first": "KMP 首次匹配",
  "bigint-add": "大整数加法", "str-count-occur": "模式串计数", "str-longest-palindrome": "最长回文",
  "gcd-lcm": "最大公约数与最小公倍数", "prime-sieve": "线性筛质数", "fast-pow": "快速幂", "josephus": "约瑟夫环",
  "moore-vote": "摩尔投票", "prime-factor": "质因数分解", "divisor-count": "约数个数", "pascal-row": "组合数递推",
  "math-fast-pow": "矩阵快速幂", "math-sieve-count": "区间质数计数", "math-gcd-range": "区间 GCD",
  "fib": "斐波那契", "climb-stairs": "爬楼梯", "knapsack01": "01 背包", "lis": "最长上升子序列",
  "lcs": "最长公共子序列", "kadane": "最大子段和", "coin-dp": "最少硬币数", "edit-dist": "编辑距离",
  "min-path-sum": "最小路径和", "unique-paths": "路径计数", "complete-knapsack": "完全背包", "lps": "最长回文子序列",
  "subset-count": "子集和计数", "house-robber": "打家劫舍", "partition-equal": "等和划分", "stone-merge": "石子合并",
  "dp-lcs": "LCS 方案还原", "dp-lis": "LIS 方案还原", "dp-coin-comb": "硬币组合数", "dp-palindrome-cut": "回文分割",
  "dp-word-break": "单词拆分", "dp-matrix-chain": "矩阵连乘",
  "bracket-match": "括号匹配", "next-greater": "下一个更大元素", "stack-eval": "表达式求值",
  "reverse-k": "K 个一组翻转链表", "list-middle": "链表中点", "list-merge": "合并有序链表", "list-cycle": "链表判环",
  "graph-bfs": "BFS 最短路", "dijkstra": "Dijkstra", "union-find": "并查集", "topo-sort": "拓扑排序",
  "floyd": "Floyd 全源最短路", "grid-bfs": "网格 BFS", "island-count": "连通块计数", "graph-topo-lex": "字典序拓扑排序",
  "graph-dijkstra": "Dijkstra 路径还原", "graph-kruskal": "Kruskal 最小生成树",
  "merge-intervals": "合并区间",
  "jump-min": "最少跳跃次数", "coin-greedy": "贪心找零", "greedy-activity": "区间调度", "stock-profit": "买卖股票一次",
  "greedy-gas-station": "加油站", "greedy-task-cool": "任务冷却调度", "greedy-candy": "分糖果", "greedy-stock-multi": "买卖股票多次",
  "tree-inorder": "二叉树遍历", "tree-height": "树高与平衡", "tree-lca": "最近公共祖先", "tree-diameter": "树的直径",
  "heap-kth": "第 k 大元素", "heap-k-merge": "k 路归并", "heap-median-stream": "数据流中位数",
  "bit-count-range": "按位统计 1 的个数", "xor-single": "异或找单数", "bits-reverse": "位翻转", "bits-count-upto": "前缀 1 计数",
  "n-queens": "N 皇后", "backtrack-kth-perm": "第 k 个排列",
  "spiral": "螺旋遍历", "rotate-matrix": "矩阵旋转", "spiral-generate": "螺旋填数",
  "mono-next-greater": "单调栈求下一个更大", "mono-daily-temp": "每日温度", "mono-max-rect": "柱状图最大矩形",
  "uf-components": "连通块个数", "uf-redundant": "冗余连接",
  "fenwick-ops": "树状数组", "sparse-rmq": "ST 表区间最值", "diff-range-add": "区间加值",
  "game-nim": "Nim 博弈", "sim-robot": "机器人模拟", "stack-two-queue": "双栈实现队列",
};

/* ---------- 从题目里抽取本题参数，让题解「说具体的题」而不是泛泛而谈 ---------- */
function params(p) {
  const t = p.title || "";
  const d = p.desc || "";
  const got = {};
  const put = (k, v) => { if (v != null && got[k] == null) got[k] = v; };
  // 标题里的 n = 39 / q = 6 这类
  const re = /([nNmkqKMQ])\s*=\s*(\d+)/g;
  let m;
  while ((m = re.exec(t))) put(m[1].toLowerCase(), parseInt(m[2], 10));
  while ((m = re.exec(d))) put(m[1].toLowerCase(), parseInt(m[2], 10));
  // 数据规模上限，例如「n ≤ 10^5」
  const lim = d.match(/(?:n|N)\s*(?:≤|<=|不超过)\s*(\d+(?:\s*[×x*]\s*10\s*\^?\s*\d+)?)/);
  if (lim) got.limit = lim[1].replace(/\s+/g, "");
  // 数据范围说明句
  const range = d.match(/[^。\n]*(?:绝对值|数据范围|保证|不超过|至多)[^。\n]*。/);
  if (range) got.range = range[0].trim().slice(0, 120);
  return got;
}

/* ---------- 复杂度落成本题的具体估算 ---------- */
function complexityNote(kb, pr) {
  const n = pr.n;
  const notes = [];
  if (n) {
    if (/O\(log n\)/.test(kb.time)) notes.push(`n = ${n} 时二分类操作约需 ${Math.ceil(Math.log2(Math.max(n, 2)))} 次比较`);
    else if (/O\(n\)/.test(kb.time)) notes.push(`n = ${n} 时循环体执行约 ${n} 次，在 1e7 量级以内可放心`);
    else if (/O\(n²\)/.test(kb.time)) notes.push(`n = ${n} 时约 ${(n * n).toLocaleString("en-US")} 次基本操作，n ≤ 5000 左右可用`);
    else if (/O\(n log n\)/.test(kb.time)) notes.push(`n = ${n} 时约 ${Math.ceil(n * Math.log2(Math.max(n, 2))).toLocaleString("en-US")} 次基本操作`);
    else if (/O\(n³\)/.test(kb.time)) notes.push(`n = ${n} 时约 ${(n ** 3).toLocaleString("en-US")} 次，仅适合 n ≤ 300`);
    else if (/O\(n·m\)|O\(nm\)/.test(kb.time) && pr.m) notes.push(`n = ${n}, m = ${pr.m}，网格规模 ${(n * pr.m).toLocaleString("en-US")} 个格子`);
  }
  if (pr.limit) notes.push(`题目给的上界是 ${esc(pr.limit)}，按上面的复杂度可以放心通过`);
  if (!notes.length) notes.push("按题目给出的规模选择实现，一般 O(n log n) 以内都能通过");
  return notes;
}

/* ---------- 生成单题题解 ---------- */
function buildSolution(p) {
  const kb = KB[p.type];
  if (!kb) return null;
  const pr = params(p);
  const notes = complexityNote(kb, pr);
  const sameType = p.cat ? `同一题型的其他题目可以在「题库」里按分类 ${esc(p.cat)} 继续练` : "";

  return `<div class="sol">
  <div class="sol-head">
    <span class="sol-badge">${esc(TYPE_NAME[p.type] || p.type)}</span>
    <span class="sol-cat">${esc(p.cat || "")}</span>
    <span class="sol-diff">${esc(p.diff || "")}</span>
  </div>

  <h4>看到什么就用这招</h4>
  <p>${esc(kb.rec)}</p>

  <h4>思路拆解</h4>
  <p>${esc(kb.idea)}</p>
  <div class="sol-key"><b>关键点</b><span>${esc(kb.key)}</span></div>

  <h4>参考实现</h4>
  <div class="sol-lang">C++</div>
  <pre class="sol-code"><code>${esc(kb.cpp)}</code></pre>
  <details class="sol-fold"><summary>Python 对照</summary>
    <pre class="sol-code"><code>${esc(kb.py)}</code></pre>
  </details>

  <h4>复杂度</h4>
  <table class="sol-table">
    <tr><th>时间</th><td>${esc(kb.time)}</td></tr>
    <tr><th>空间</th><td>${esc(kb.sp)}</td></tr>
  </table>
  <ul class="sol-notes">${notes.map(x => `<li>${x}</li>`).join("")}</ul>

  ${pr.n || pr.range ? `<h4>本题代入</h4>
  <ul class="sol-notes">
    ${pr.n ? `<li>本题 n = <b>${pr.n}</b>${pr.m ? `，m = <b>${pr.m}</b>` : ""}</li>` : ""}
    ${pr.range ? `<li>数据范围：${esc(pr.range)}</li>` : ""}
  </ul>` : ""}

  <h4>容易踩的坑</h4>
  <ul class="sol-pit">${(kb.pit || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>

  <h4>延伸与变体</h4>
  <p>${esc(kb.va)}</p>
  ${sameType ? `<p class="sol-more">${sameType}。</p>` : ""}
</div>`;
}

/* ---------- 主流程 ---------- */
(async () => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DATA, "problems-index.js"), "utf8"), ctx);
  const IDX = ctx.window.PROBLEM_INDEX;
  const shards = [...new Set(IDX.map(r => r[4]))].sort((a, b) => a - b);
  console.log(`题目 ${IDX.length} 道，分片 ${shards.length} 个`);

  let written = 0, bytes = 0, missing = 0, noKb = 0;
  const t0 = Date.now();

  for (const sh of shards) {
    if (written >= LIMIT) break;
    const f = path.join(DATA, `problems-${pad3(sh)}.js`);
    if (!fs.existsSync(f)) { missing++; continue; }
    const c = { window: {} };
    vm.createContext(c);
    try {
      vm.runInContext(fs.readFileSync(f, "utf8"), c);
    } catch (e) { missing++; continue; }
    const arr = (c.window.PROBLEM_SHARDS || {})[sh] || [];
    const out = {};
    for (const p of arr) {
      if (!p || !p.type) continue;
      const html = buildSolution(p);
      if (!html) { noKb++; continue; }
      out[p.id] = html;
    }
    if (!Object.keys(out).length) continue;
    const js = "window.SOL_SHARDS=window.SOL_SHARDS||{};\nwindow.SOL_SHARDS[" + sh + "]=" + JSON.stringify(out) + ";\n";
    fs.writeFileSync(path.join(DATA, `sol-${pad3(sh)}.js`), js);
    written++; bytes += Buffer.byteLength(js);
  }

  const mb = (bytes / 1024 / 1024).toFixed(1);
  const per = written ? Math.round(bytes / written / 1024) : 0;
  console.log(`写出 ${written} 个题解分片，共 ${mb}MB，平均每片 ${per}KB，耗时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (missing) console.log(`跳过缺失分片 ${missing} 个`);
  if (noKb) console.log(`跳过无知识库题型 ${noKb} 题`);
  if (written && per) {
    console.log(`按此速率，${shards.length} 个分片预计 ${(per * shards.length / 1024).toFixed(0)}MB`);
  }
})();
