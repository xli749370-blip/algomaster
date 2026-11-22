// 题型模板库 F（83-101）：单调栈 / 并查集 / 拓扑排序 / 最短路 / 最小生成树 /
// 树论（LCA、直径）/ 树状数组 / ST 表 / 差分 / 堆 / 回溯 / 博弈 / 二分答案

const TYPES_F = [];
const F = TYPES_F;

// ============ 公共实现（solve 与 outputText 共用同一份，杜绝两份逻辑写岔） ============

function nextGreater(a) {
  const out = Array(a.length).fill(-1), st = [];
  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st[st.length - 1]] < a[i]) out[st.pop()] = a[i];
    st.push(i);
  }
  return out;
}

function dailyTemps(t) {
  const out = Array(t.length).fill(0), st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[st[st.length - 1]] < t[i]) {
      const j = st.pop();
      out[j] = i - j;
    }
    st.push(i);
  }
  return out;
}

function maxRect(h) {
  const a = h.concat([0]), st = [];
  let best = 0;
  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st[st.length - 1]] >= a[i]) {
      const height = a[st.pop()];
      const left = st.length ? st[st.length - 1] : -1;
      const area = height * (i - left - 1);
      if (area > best) best = area;
    }
    st.push(i);
  }
  return best;
}

class DSU {
  constructor(n) {
    this.p = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.cnt = n;
  }
  find(x) {
    while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; }
    return x;
  }
  union(a, b) {
    a = this.find(a); b = this.find(b);
    if (a === b) return false;
    if (this.rank[a] < this.rank[b]) { const t = a; a = b; b = t; }
    this.p[b] = a;
    if (this.rank[a] === this.rank[b]) this.rank[a]++;
    this.cnt--;
    return true;
  }
}

const compCount = (n, edges) => {
  const d = new DSU(n);
  for (const [u, v] of edges) d.union(u, v);
  return d.cnt;
};

const redundantEdges = (n, edges) => {
  const d = new DSU(n);
  let c = 0;
  for (const [u, v] of edges) if (!d.union(u, v)) c++;
  return c;
};

function topoLex(n, edges) {
  const indeg = Array(n).fill(0), adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }
  const ready = [];
  for (let i = 0; i < n; i++) if (!indeg[i]) ready.push(i);
  ready.sort((x, y) => x - y);
  const out = [];
  while (ready.length) {
    const u = ready.shift();
    out.push(u);
    for (const v of adj[u]) {
      if (--indeg[v] === 0) {
        ready.push(v);
        ready.sort((x, y) => x - y);   // 每次取当前最小，得到字典序最小拓扑序
      }
    }
  }
  return out.length === n ? out : null;
}

function dijkstra(n, edges, src, dst) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const dist = Array(n).fill(Infinity), done = Array(n).fill(false);
  dist[src] = 0;
  for (let it = 0; it < n; it++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    done[u] = true;
    for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}

function kruskal(n, edges) {
  const es = edges.slice().sort((a, b) => a[2] - b[2]);
  const d = new DSU(n);
  let sum = 0, used = 0;
  for (const [u, v, w] of es) if (d.union(u, v)) { sum += w; used++; }
  return used === n - 1 ? sum : -1;
}

function lcaNaive(parent, u, v) {
  const depth = Array(parent.length).fill(0);
  for (let i = 1; i < parent.length; i++) depth[i] = depth[parent[i]] + 1;
  while (depth[u] > depth[v]) u = parent[u];
  while (depth[v] > depth[u]) v = parent[v];
  while (u !== v) { u = parent[u]; v = parent[v]; }
  return u;
}

function treeDiam(parent) {
  const n = parent.length, adj = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) { adj[i].push(parent[i]); adj[parent[i]].push(i); }
  const bfs = start => {
    const dist = Array(n).fill(-1);
    dist[start] = 0;
    const q = [start];
    let far = start;
    for (let h = 0; h < q.length; h++) {
      const u = q[h];
      if (dist[u] > dist[far]) far = u;
      for (const v of adj[u]) if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return [far, dist[far]];
  };
  const [a] = bfs(0);
  const [, d] = bfs(a);
  return d;
}

function fenwickRun(a, ops) {
  const n = a.length, bit = Array(n + 1).fill(0);
  const add = (i, v) => { for (i++; i <= n; i += i & -i) bit[i] += v; };
  const sum = i => { let s = 0; for (i++; i > 0; i -= i & -i) s += bit[i]; return s; };
  a.forEach((v, i) => add(i, v));
  const out = [];
  for (const op of ops) {
    if (op[0] === "add") add(op[1], op[2]);
    else out.push(sum(op[1]));
  }
  return out;
}

function buildSt(a) {
  const n = a.length, log = Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) log[i] = log[i >> 1] + 1;
  const K = log[n] + 1;
  const t = Array.from({ length: K }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) t[0][i] = a[i];
  for (let k = 1; k < K; k++)
    for (let i = 0; i + (1 << k) <= n; i++)
      t[k][i] = Math.max(t[k - 1][i], t[k - 1][i + (1 << (k - 1))]);
  return { t, log, K };
}
function rmqMax(st, l, r) {
  const k = st.log[r - l + 1];
  return Math.max(st.t[k][l], st.t[k][r - (1 << k) + 1]);
}

function applyDiff(n, ops) {
  const d = Array(n + 1).fill(0);
  for (const [l, r, v] of ops) { d[l] += v; d[r + 1] -= v; }
  const out = [];
  let cur = 0;
  for (let i = 0; i < n; i++) { cur += d[i]; out.push(cur); }
  return out;
}

function heapKMerge(arrs, m) {
  const all = [];
  for (const a of arrs) for (const x of a) all.push(x);
  all.sort((x, y) => x - y);
  return all.slice(0, m);
}

function medianStream(nums) {
  const out = [];
  const bag = [];
  for (const x of nums) {
    let i = bag.length;
    while (i > 0 && bag[i - 1] > x) i--;
    bag.splice(i, 0, x);
    out.push(bag[(bag.length - 1) >> 1]);   // 下中位数
  }
  return out;
}

function kthPerm(n, k) {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  const nextPerm = arr => {
    let i = arr.length - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) i--;
    if (i < 0) return false;
    let j = arr.length - 1;
    while (arr[j] <= arr[i]) j--;
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    for (let l = i + 1, r = arr.length - 1; l < r; l++, r--) { const q = arr[l]; arr[l] = arr[r]; arr[r] = q; }
    return true;
  };
  for (let i = 1; i < k; i++) if (!nextPerm(a)) break;
  return a;
}

const nimFirst = piles => piles.reduce((x, y) => x ^ y, 0) !== 0;

function minCapacity(w, days) {
  const can = c => {
    let d = 1, cur = 0;
    for (const x of w) {
      if (cur + x > c) { d++; cur = 0; }
      cur += x;
    }
    return d <= days;
  };
  let lo = Math.max(...w), hi = w.reduce((s, x) => s + x, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (can(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

function spiralMatrix(n) {
  const g = Array.from({ length: n }, () => Array(n).fill(0));
  let top = 0, bottom = n - 1, left = 0, right = n - 1, v = 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) g[top][j] = v++;
    top++;
    for (let i = top; i <= bottom; i++) g[i][right] = v++;
    right--;
    if (top <= bottom) { for (let j = right; j >= left; j--) g[bottom][j] = v++; bottom--; }
    if (left <= right) { for (let i = bottom; i >= top; i--) g[i][left] = v++; left++; }
  }
  return g;
}

// ============================== 83. 下一个更大元素 ==============================
F.push({
  key: "mono-next-greater", cat: "单调栈", diff: "中等",
  title: p => `下一个更大元素（n = ${p.a.length}）`,
  desc: p => `给定数组 ${p.a.join(" ")}，对每个位置求它右边第一个比它大的数，不存在输出 -1。用单调递减栈：新元素比栈顶大就把栈顶的答案定下来，每个元素进出栈各一次，总复杂度 O(n)。`,
  gen: r => ({ a: Array.from({ length: 5 + r.int(10) }, () => 1 + r.int(30)) }),
  solve: p => nextGreater(p.a).join(" "),
  inputText: p => `第一行 n = ${p.a.length}\n第二行 ${p.a.length} 个整数：${p.a.join(" ")}`,
  outputText: p => nextGreater(p.a).join(" "),
  code: {
    cpp: `vector<int> nextGreater(const vector<int>& a) {
    int n = a.size();
    vector<int> res(n, -1), st;   // st 存下标，栈内对应的值单调递减
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.back()] < a[i]) {
            res[st.back()] = a[i];   // 出栈时才确定答案
            st.pop_back();
        }
        st.push_back(i);
    }
    return res;
}`,
    py: `def next_greater(a):
    res, st = [-1] * len(a), []
    for i, x in enumerate(a):
        while st and a[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res`,
    java: `static int[] nextGreater(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && a[st.peek()] < a[i]) res[st.pop()] = a[i];
        st.push(i);
    }
    return res;
}`,
    c: `void nextGreater(const int* a, int n, int* res) {
    int st[100005], top = 0;
    for (int i = 0; i < n; i++) res[i] = -1;
    for (int i = 0; i < n; i++) {
        while (top && a[st[top - 1]] < a[i]) res[st[--top]] = a[i];
        st[top++] = i;
    }
}`
  },
  points: ["栈里存下标而不是值：只有下标才能把答案写回原位置", "出栈的那一刻才是答案确定的时刻，入栈时不知道右边有什么", "要求「严格更大」用 <，要求「大于等于」改成 <=，两种语义别混"]
});

// ============================== 84. 每日温度 ==============================
F.push({
  key: "mono-daily-temp", cat: "单调栈", diff: "中等",
  title: p => `每日温度（${p.t.length} 天，最高 ${Math.max(...p.t)}℃）`,
  desc: p => `给定连续 ${p.t.length} 天的气温 ${p.t.join(" ")}，对每天求「还要等几天才会更暖」，之后都不会更暖则输出 0。本质是下一个更大元素，但输出的是下标距离。`,
  gen: r => ({ t: Array.from({ length: 5 + r.int(8) }, () => 10 + r.int(30)) }),
  solve: p => dailyTemps(p.t).join(" "),
  inputText: p => `第一行 n = ${p.t.length}\n第二行 ${p.t.length} 个整数（气温）：${p.t.join(" ")}`,
  outputText: p => dailyTemps(p.t).join(" "),
  code: {
    cpp: `vector<int> dailyTemperatures(const vector<int>& t) {
    int n = t.size();
    vector<int> res(n, 0), st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && t[st.back()] < t[i]) {
            res[st.back()] = i - st.back();   // 差值就是等待天数
            st.pop_back();
        }
        st.push_back(i);
    }
    return res;
}`,
    py: `def daily_temperatures(t):
    res, st = [0] * len(t), []
    for i, x in enumerate(t):
        while st and t[st[-1]] < x:
            j = st.pop()
            res[j] = i - j
        st.append(i)
    return res`,
    java: `static int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] res = new int[n];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && t[st.peek()] < t[i]) {
            int j = st.pop();
            res[j] = i - j;
        }
        st.push(i);
    }
    return res;
}`,
    c: `void dailyTemperatures(const int* t, int n, int* res) {
    int st[100005], top = 0;
    for (int i = 0; i < n; i++) res[i] = 0;
    for (int i = 0; i < n; i++) {
        while (top && t[st[top - 1]] < t[i]) {
            int j = st[--top];
            res[j] = i - j;
        }
        st[top++] = i;
    }
}`
  },
  points: ["栈里留下的下标气温是单调不增的，所以新的高温能一次弹掉一批", "没有更暖的天要输出 0，初始化就写 0 而不是 -1", "暴力两重循环是 O(n²)，n = 1e5 必然超时，必须用栈降到 O(n)"]
});

// ============================== 85. 柱状图最大矩形 ==============================
F.push({
  key: "mono-max-rect", cat: "单调栈", diff: "困难",
  title: p => `柱状图中最大的矩形（${p.h.length} 根柱子）`,
  desc: p => `柱高分别为 ${p.h.join(" ")}，求能勾勒出的最大矩形面积。枚举「以某根柱子为最矮」向两边扩展到第一个更矮的位置，用单调递增栈一次扫描求出左右边界。技巧：末尾补一个高度 0 的哨兵，保证最后全部出栈。`,
  gen: r => ({ h: Array.from({ length: 4 + r.int(8) }, () => 1 + r.int(12)) }),
  solve: p => String(maxRect(p.h)),
  inputText: p => `第一行 n = ${p.h.length}\n第二行 ${p.h.length} 个整数（柱高）：${p.h.join(" ")}`,
  outputText: p => String(maxRect(p.h)),
  code: {
    cpp: `int largestRectangleArea(vector<int>& h) {
    h.push_back(0);                 // 哨兵：保证栈内元素最终全部弹出
    stack<int> st;
    int best = 0;
    for (int i = 0; i < (int)h.size(); i++) {
        while (!st.empty() && h[st.top()] >= h[i]) {
            int height = h[st.top()]; st.pop();
            int left = st.empty() ? -1 : st.top();
            best = max(best, height * (i - left - 1));   // 宽度 = 右界 - 左界 - 1
        }
        st.push(i);
    }
    return best;
}`,
    py: `def largest_rectangle(h):
    h = h + [0]
    st, best = [], 0
    for i, x in enumerate(h):
        while st and h[st[-1]] >= x:
            height = h[st.pop()]
            left = st[-1] if st else -1
            best = max(best, height * (i - left - 1))
        st.append(i)
    return best`,
    java: `static int largestRectangleArea(int[] h) {
    int n = h.length, best = 0;
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];
        while (!st.isEmpty() && h[st.peek()] >= cur) {
            int height = h[st.pop()];
            int left = st.isEmpty() ? -1 : st.peek();
            best = Math.max(best, height * (i - left - 1));
        }
        if (i < n) st.push(i);
    }
    return best;
}`,
    c: `int largestRectangleArea(int* h, int n) {
    int st[100005], top = 0, best = 0;
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];
        while (top && h[st[top - 1]] >= cur) {
            int height = h[st[--top]];
            int left = top ? st[top - 1] : -1;
            int area = height * (i - left - 1);
            if (area > best) best = area;
        }
        if (i < n) st[top++] = i;
    }
    return best;
}`
  },
  points: ["宽度是 i - left - 1，因为 left 和 i 都是「更矮的柱子」，中间才是合法区间", "空栈时左边界取 -1，写成 0 会让宽度少算一格", "面积要用 long long 承接的场景：高度与宽度都接近 1e5 时乘积可达 1e10"]
});

// ============================== 86. 连通分量数 ==============================
F.push({
  key: "uf-components", cat: "并查集", diff: "简单",
  title: p => `连通分量计数（${p.n} 点 ${p.m} 边）`,
  desc: p => `无向图有 ${p.n} 个点、${p.m} 条边，求连通分量个数。并查集：初始每个点自成一个集合，每成功合并一次就把集合计数减 1；路径压缩后单次操作近似 O(1)。`,
  gen: r => {
    const n = 4 + r.int(6);
    const m = 2 + r.int(n + 2);
    const edges = Array.from({ length: m }, () => [r.int(n), r.int(n)]).filter(([u, v]) => u !== v);
    return { n, m: edges.length, edges };
  },
  solve: p => String(compCount(p.n, p.edges)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行每行两个整数 u v（0 <= u, v < ${p.n}）：\n${p.edges.map(e => e.join(" ")).join("\n")}`,
  outputText: p => String(compCount(p.n, p.edges)),
  code: {
    cpp: `struct DSU {
    vector<int> p, rk;
    int cnt;
    DSU(int n) : p(n), rk(n, 0), cnt(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { while (p[x] != x) x = p[x] = p[p[x]]; return x; }  // 路径压缩
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (rk[a] < rk[b]) swap(a, b);
        p[b] = a;
        if (rk[a] == rk[b]) rk[a]++;
        cnt--;                       // 只在真正合并时减 1
    }
};`,
    py: `class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.cnt = n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        self.p[b] = a
        self.cnt -= 1
        return True`,
    java: `static class DSU {
    int[] p, rk;
    int cnt;
    DSU(int n) { p = new int[n]; rk = new int[n]; cnt = n; for (int i = 0; i < n; i++) p[i] = i; }
    int find(int x) { while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x; }
    boolean union(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rk[a] < rk[b]) { int t = a; a = b; b = t; }
        p[b] = a;
        if (rk[a] == rk[b]) rk[a]++;
        cnt--;
        return true;
    }
}`,
    c: `int p[100005], rk_[100005], cnt;
void init(int n) { for (int i = 0; i < n; i++) p[i] = i, rk_[i] = 0; cnt = n; }
int find(int x) { while (p[x] != x) x = p[x] = p[p[x]]; return x; }
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rk_[a] < rk_[b]) { int t = a; a = b; b = t; }
    p[b] = a;
    if (rk_[a] == rk_[b]) rk_[a]++;
    cnt--;
}`
  },
  points: ["只在真的把两个不同集合合并时才减计数，同集合内连边不影响分量数", "路径压缩写成 p[x] = p[p[x]] 一次跳两格，比递归版本更省栈", "按秩合并能保证树高 O(log n)，两项优化都用上才接近反阿克曼级"]
});

// ============================== 87. 冗余边（判环） ==============================
F.push({
  key: "uf-redundant", cat: "并查集", diff: "中等",
  title: p => `多余的边（${p.n} 点 ${p.m} 边）`,
  desc: p => `无向图有 ${p.n} 个点、${p.m} 条边，求其中「连接的两个点已经连通」的边数（即形成环的边数）。逐条加边，用并查集判断两端是否已在同一集合：已在说明这条边多余。`,
  gen: r => {
    const n = 4 + r.int(5);
    const edges = [];
    for (let i = 1; i < n; i++) edges.push([r.int(i), i]);          // 先连成一棵树
    for (let k = 0, e = 1 + r.int(3); k < e; k++) {                  // 再加几条随机边
      const u = r.int(n), v = r.int(n);
      if (u !== v) edges.push([u, v]);
    }
    return { n, m: edges.length, edges };
  },
  solve: p => String(redundantEdges(p.n, p.edges)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行每行 u v：\n${p.edges.map(e => e.join(" ")).join("\n")}`,
  outputText: p => String(redundantEdges(p.n, p.edges)),
  code: {
    cpp: `int redundantEdges(int n, vector<vector<int>>& edges) {
    DSU d(n);
    int cnt = 0;
    for (auto& e : edges)
        if (!d.unite(e[0], e[1])) cnt++;   // 已经连通 -> 这条边多余
    return cnt;
}`,
    py: `def redundant_edges(n, edges):
    d = DSU(n)
    cnt = 0
    for u, v in edges:
        if not d.union(u, v):
            cnt += 1
    return cnt`,
    java: `static int redundantEdges(int n, int[][] edges) {
    DSU d = new DSU(n);
    int cnt = 0;
    for (int[] e : edges) if (!d.union(e[0], e[1])) cnt++;
    return cnt;
}`,
    c: `int redundantEdges(int n, int edges[][2], int m) {
    init(n);
    int cnt = 0;
    for (int i = 0; i < m; i++) if (find(edges[i][0]) == find(edges[i][1])) cnt++;
        else unite(edges[i][0], edges[i][1]);
    return cnt;
}`
  },
  points: ["并查集判环只适用于无向图；有向图要用拓扑排序或三色标记 DFS", "自环（u == v）也算多余边，find(u) == find(v) 天然成立", "边数 m > n - 1 时必然有环，可作为快速前置判断"]
});

// ============================== 88. 字典序最小拓扑序 ==============================
F.push({
  key: "graph-topo-lex", cat: "图论", diff: "中等",
  title: p => `字典序最小的拓扑排序（${p.n} 个任务）`,
  desc: p => `${p.n} 个任务（编号 0..${p.n - 1}）之间有 ${p.m} 条依赖 a -> b 表示 a 必须先做，求字典序最小的合法执行顺序。每次从当前入度为 0 的点中取编号最小的，用最小堆（或有序表）维护候选集。`,
  gen: r => {
    const n = 4 + r.int(5);
    const edges = [];
    for (let k = 0, e = 1 + r.int(n); k < e; k++) {
      const u = r.int(n), v = r.int(n);
      if (u < v) edges.push([u, v]);            // 只加 i<j 的边，天然无环
    }
    return { n, m: edges.length, edges };
  },
  solve: p => { const o = topoLex(p.n, p.edges); return o ? o.join(" ") : "impossible"; },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行每行 a b，表示 a 必须早于 b：\n${p.edges.map(e => e.join(" ")).join("\n")}`,
  outputText: p => { const o = topoLex(p.n, p.edges); return o ? o.join(" ") : "impossible"; },
  code: {
    cpp: `vector<int> topoSort(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); indeg[e[1]]++; }
    priority_queue<int, vector<int>, greater<int>> pq;   // 小根堆 -> 字典序最小
    for (int i = 0; i < n; i++) if (!indeg[i]) pq.push(i);
    vector<int> order;
    while (!pq.empty()) {
        int u = pq.top(); pq.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) pq.push(v);
    }
    return (int)order.size() == n ? order : vector<int>{};   // 不足 n 个说明有环
}`,
    py: `import heapq

def topo_sort(n, edges):
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    pq = [i for i in range(n) if indeg[i] == 0]
    heapq.heapify(pq)
    order = []
    while pq:
        u = heapq.heappop(pq)
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(pq, v)
    return order if len(order) == n else []`,
    java: `static List<Integer> topoSort(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); indeg[e[1]]++; }
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) pq.offer(i);
    List<Integer> order = new ArrayList<>();
    while (!pq.isEmpty()) {
        int u = pq.poll();
        order.add(u);
        for (int v : adj.get(u)) if (--indeg[v] == 0) pq.offer(v);
    }
    return order.size() == n ? order : new ArrayList<>();
}`,
    c: `// 用入度为 0 的扫描数组模拟小根堆（n 很小时够用）
void topoSort(int n, int adj[][100], int* deg, int** edges, int m, int* out, int* len) {
    for (int i = 0; i < m; i++) { adj[edges[i][0]][deg[edges[i][0]]++] = edges[i][1]; }
    int indeg[100] = {0};
    for (int i = 0; i < m; i++) indeg[edges[i][1]]++;
    *len = 0;
    for (int step = 0; step < n; step++) {
        int pick = -1;
        for (int i = 0; i < n; i++) if (indeg[i] == 0) { pick = i; break; }  // 取编号最小的
        if (pick == -1) return;
        out[(*len)++] = pick;
        indeg[pick] = -1;
        for (int k = 0; k < deg[pick]; k++) indeg[adj[pick][k]]--;
    }
}`
  },
  points: ["要「字典序最小」必须用小根堆，用普通队列得到的是任意一个合法拓扑序", "最终输出不足 n 个元素说明图中有环，拓扑排序不存在", "邻接表比邻接矩阵省空间，稀疏图（m << n²）差异非常明显"]
});

// ============================== 89. 单源最短路 ==============================
F.push({
  key: "graph-dijkstra", cat: "图论", diff: "中等",
  title: p => `单源最短路（${p.n} 点 ${p.m} 边，0 → ${p.n - 1}）`,
  desc: p => `无向带权图有 ${p.n} 个点、${p.m} 条边（边权 ${p.wmin}~${p.wmax}），求从 0 到 ${p.n - 1} 的最短距离，不可达输出 -1。Dijkstra：每次取出当前距离最小的未确定点去松弛邻居，堆优化后 O((n+m) log n)。`,
  gen: r => {
    const n = 4 + r.int(5);
    const edges = [];
    for (let i = 0; i + 1 < n; i++) edges.push([i, i + 1, 1 + r.int(20)]);   // 保证连通
    for (let k = 0, e = r.int(n + 2); k < e; k++) {
      const u = r.int(n), v = r.int(n);
      if (u !== v) edges.push([u, v, 1 + r.int(20)]);
    }
    return { n, m: edges.length, edges, wmin: 1, wmax: 20, dst: n - 1 };
  },
  solve: p => String(dijkstra(p.n, p.edges, 0, p.dst)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}，起点 0，终点 ${p.dst}\n接下来 ${p.m} 行每行 u v w：\n${p.edges.map(e => e.join(" ")).join("\n")}`,
  outputText: p => String(dijkstra(p.n, p.edges, 0, p.dst)),
  code: {
    cpp: `const long long INF = 4e18;
vector<long long> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int s) {
    vector<long long> dist(n, INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;          // 过期堆项直接跳过
        for (auto [v, w] : adj[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    return dist;
}`,
    py: `import heapq

def dijkstra(n, adj, s):
    INF = float("inf")
    dist = [INF] * n
    dist[s] = 0
    pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    java: `static long[] dijkstra(int n, List<int[]>[] adj, int s) {
    long INF = Long.MAX_VALUE / 4;
    long[] dist = new long[n];
    Arrays.fill(dist, INF);
    dist[s] = 0;
    PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
    pq.offer(new long[]{0, s});
    while (!pq.isEmpty()) {
        long[] cur = pq.poll();
        int u = (int) cur[1];
        if (cur[0] > dist[u]) continue;
        for (int[] e : adj[u]) {
            int v = e[0], w = e[1];
            if (cur[0] + w < dist[v]) { dist[v] = cur[0] + w; pq.offer(new long[]{dist[v], v}); }
        }
    }
    return dist;
}`,
    c: `// 邻接矩阵 + 朴素 Dijkstra，适合稠密图 n <= 1000
void dijkstra(int n, long long g[][1005], int s, long long* dist) {
    int vis[1005] = {0};
    for (int i = 0; i < n; i++) dist[i] = 4000000000000000000LL;
    dist[s] = 0;
    for (int it = 0; it < n; it++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!vis[i] && (u == -1 || dist[i] < dist[u])) u = i;
        if (u == -1) break;
        vis[u] = 1;
        for (int v = 0; v < n; v++)
            if (g[u][v] < 4000000000000000000LL && dist[u] + g[u][v] < dist[v])
                dist[v] = dist[u] + g[u][v];
    }
}`
  },
  points: ["Dijkstra 只适用于非负边权；有负权必须用 Bellman-Ford / SPFA", "堆里有「过期项」时要用 d > dist[u] 跳过，否则复杂度会退化", "距离数组用 long long：多条 1e9 的边叠加会超出 int 范围"]
});

// ============================== 90. 最小生成树 ==============================
F.push({
  key: "graph-kruskal", cat: "图论", diff: "中等",
  title: p => `最小生成树（${p.n} 点 ${p.m} 边）`,
  desc: p => `给定 ${p.n} 个点、${p.m} 条带权无向边，求最小生成树的边权和，图不连通输出 -1。Kruskal：把边按权值升序排列，逐条尝试加入，若两端已连通就跳过（并查集判断），选满 n-1 条即完成。`,
  gen: r => {
    const n = 4 + r.int(5);
    const edges = [];
    for (let i = 1; i < n; i++) edges.push([r.int(i), i, 1 + r.int(30)]);
    for (let k = 0, e = r.int(n + 2); k < e; k++) {
      const u = r.int(n), v = r.int(n);
      if (u !== v) edges.push([u, v, 1 + r.int(30)]);
    }
    return { n, m: edges.length, edges };
  },
  solve: p => String(kruskal(p.n, p.edges)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行每行 u v w：\n${p.edges.map(e => e.join(" ")).join("\n")}`,
  outputText: p => String(kruskal(p.n, p.edges)),
  code: {
    cpp: `int kruskal(int n, vector<array<int,3>>& edges) {   // 返回 MST 权值和，不连通返回 -1
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });
    DSU d(n);
    int sum = 0, used = 0;
    for (auto& e : edges)
        if (d.unite(e[0], e[1])) { sum += e[2]; if (++used == n - 1) break; }
    return used == n - 1 ? sum : -1;
}`,
    py: `def kruskal(n, edges):
    edges = sorted(edges, key=lambda e: e[2])
    d = DSU(n)
    total = used = 0
    for u, v, w in edges:
        if d.union(u, v):
            total += w
            used += 1
            if used == n - 1:
                break
    return total if used == n - 1 else -1`,
    java: `static int kruskal(int n, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    DSU d = new DSU(n);
    int sum = 0, used = 0;
    for (int[] e : edges)
        if (d.union(e[0], e[1])) { sum += e[2]; if (++used == n - 1) break; }
    return used == n - 1 ? sum : -1;
}`,
    c: `int cmpEdge(const void* a, const void* b) {
    return ((int*)a)[2] - ((int*)b)[2];
}
int kruskal(int n, int edges[][3], int m) {
    qsort(edges, m, sizeof(int) * 3, cmpEdge);
    init(n);
    int sum = 0, used = 0;
    for (int i = 0; i < m; i++)
        if (unite(edges[i][0], edges[i][1])) { sum += edges[i][2]; if (++used == n - 1) break; }
    return used == n - 1 ? sum : -1;
}`
  },
  points: ["「选满 n-1 条边」是终止条件，也是判定图是否连通的依据", "边按权排序后，Kruskal 的正确性来自「最小边一定可以进某棵 MST」的切割性质", "稠密图 Prim 用邻接矩阵 O(n²) 常数更小；稀疏图两者都行，Kruskal 更好写"]
});

// ============================== 91. 最近公共祖先 ==============================
F.push({
  key: "tree-lca", cat: "树", diff: "中等",
  title: p => `二叉树的最近公共祖先（${p.parent.length} 个结点，查询 ${p.u} 与 ${p.v}）`,
  desc: p => `树用父指针数组表示：parent[i] = i 的父亲（0 号是根，parent[0] = -1），当前数组为 ${p.parent.join(" ")}。求结点 ${p.u} 和 ${p.v} 的最近公共祖先编号。朴素做法：先把深的那个爬到与浅的同深度，再一起往上走直到相遇。`,
  gen: r => {
    const n = 5 + r.int(6);
    const parent = [-1];
    for (let i = 1; i < n; i++) parent.push(r.int(i));
    const u = 1 + r.int(n - 1), v = 1 + r.int(n - 1);
    return { parent, u, v };
  },
  solve: p => String(lcaNaive(p.parent, p.u, p.v)),
  inputText: p => `第一行 n = ${p.parent.length}，根为 0\n第二行 n 个整数 parent[i]（parent[0] = -1）：${p.parent.join(" ")}\n第三行 u = ${p.u}, v = ${p.v}`,
  outputText: p => String(lcaNaive(p.parent, p.u, p.v)),
  code: {
    cpp: `int lca(int u, int v, const vector<int>& par, const vector<int>& depth) {
    while (depth[u] > depth[v]) u = par[u];      // 深的先上爬到同层
    while (depth[v] > depth[u]) v = par[v];
    while (u != v) { u = par[u]; v = par[v]; }   // 同时上爬直到相遇
    return u;
}
// 预处理深度：因为 parent[i] < i，顺序扫描一次即可
vector<int> buildDepth(const vector<int>& par) {
    vector<int> depth(par.size(), 0);
    for (size_t i = 1; i < par.size(); i++) depth[i] = depth[par[i]] + 1;
    return depth;
}`,
    py: `def lca(u, v, par, depth):
    while depth[u] > depth[v]:
        u = par[u]
    while depth[v] > depth[u]:
        v = par[v]
    while u != v:
        u, v = par[u], par[v]
    return u

def build_depth(par):
    depth = [0] * len(par)
    for i in range(1, len(par)):
        depth[i] = depth[par[i]] + 1
    return depth`,
    java: `static int lca(int u, int v, int[] par, int[] depth) {
    while (depth[u] > depth[v]) u = par[u];
    while (depth[v] > depth[u]) v = par[v];
    while (u != v) { u = par[u]; v = par[v]; }
    return u;
}
static int[] buildDepth(int[] par) {
    int[] depth = new int[par.length];
    for (int i = 1; i < par.length; i++) depth[i] = depth[par[i]] + 1;
    return depth;
}`,
    c: `int lca(int u, int v, const int* par, const int* depth) {
    while (depth[u] > depth[v]) u = par[u];
    while (depth[v] > depth[u]) v = par[v];
    while (u != v) { u = par[u]; v = par[v]; }
    return u;
}
void buildDepth(const int* par, int n, int* depth) {
    depth[0] = 0;
    for (int i = 1; i < n; i++) depth[i] = depth[par[i]] + 1;
}`
  },
  points: ["必须先对齐深度，否则两个指针永远差着层级往上走，可能错过公共祖先", "n 个结点单次查询 O(n)，q 次查询就 O(nq)；量大要用倍增（ST 表思想）做到 O(log n)", "求 LCA 后，路径长度 = depth[u] + depth[v] - 2 * depth[lca]，这是高频配套考点"]
});

// ============================== 92. 树的直径 ==============================
F.push({
  key: "tree-diameter", cat: "树", diff: "困难",
  title: p => `树的直径（${p.parent.length} 个结点的无权树）`,
  desc: p => `树以父指针数组给出 ${p.parent.join(" ")}，求直径（最长路径上的边数）。结论：从任意点出发找到最远点 a，再从 a 出发找到最远距离，这个距离就是直径。两遍 BFS，O(n)。`,
  gen: r => {
    const n = 5 + r.int(7);
    const parent = [-1];
    for (let i = 1; i < n; i++) parent.push(r.int(i));
    return { parent };
  },
  solve: p => String(treeDiam(p.parent)),
  inputText: p => `第一行 n = ${p.parent.length}\n第二行 ${p.parent.length} 个整数 parent[i]（parent[0] = -1）：${p.parent.join(" ")}`,
  outputText: p => String(treeDiam(p.parent)),
  code: {
    cpp: `pair<int,int> bfs(int start, const vector<vector<int>>& adj) {   // 返回 {最远点, 距离}
    int n = adj.size();
    vector<int> dist(n, -1);
    queue<int> q;
    dist[start] = 0; q.push(start);
    int far = start;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (dist[u] > dist[far]) far = u;
        for (int v : adj[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return {far, dist[far]};
}
int diameter(const vector<vector<int>>& adj) {
    int a = bfs(0, adj).first;      // 第一次从任意点找最远点
    return bfs(a, adj).second;      // 第二次得到直径长度
}`,
    py: `from collections import deque

def bfs(start, adj):
    dist = [-1] * len(adj)
    dist[start] = 0
    q = deque([start])
    far = start
    while q:
        u = q.popleft()
        if dist[u] > dist[far]:
            far = u
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return far, dist[far]

def diameter(adj):
    a, _ = bfs(0, adj)
    return bfs(a, adj)[1]`,
    java: `static int[] bfs(int start, List<Integer>[] adj) {
    int n = adj.length;
    int[] dist = new int[n];
    Arrays.fill(dist, -1);
    ArrayDeque<Integer> q = new ArrayDeque<>();
    dist[start] = 0; q.add(start);
    int far = start;
    while (!q.isEmpty()) {
        int u = q.poll();
        if (dist[u] > dist[far]) far = u;
        for (int v : adj[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
    }
    return new int[]{far, dist[far]};
}`,
    c: `int bfs(int start, int n, const int adj[][1005], const int* deg, int* dist) {
    int q[100005], head = 0, tail = 0, far = start;
    for (int i = 0; i < n; i++) dist[i] = -1;
    dist[start] = 0;
    q[tail++] = start;
    while (head < tail) {
        int u = q[head++];
        if (dist[u] > dist[far]) far = u;
        for (int k = 0; k < deg[u]; k++) {
            int v = adj[u][k];
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q[tail++] = v; }
        }
    }
    return far;
}`
  },
  points: ["两次 BFS 的结论对「边权全为 1」的树成立；带权树要用两次 DFS 累加距离而不是步数", "第一次 BFS 的起点可以任意，这条性质是算法正确性的关键", "直径端点一定是叶子，若题目要求输出端点，两次 BFS 都已顺带得到"]
});

// ============================== 93. 树状数组 ==============================
F.push({
  key: "fenwick-ops", cat: "树状数组", diff: "中等",
  title: p => `树状数组：单点加与前缀和（n = ${p.n}，${p.ops.length} 次操作）`,
  desc: p => `维护长度 ${p.n} 的数组 ${p.a.join(" ")}，支持两种操作：\`add i v\` 把第 i 个位置加 v，\`sum i\` 查询前 i+1 个元素之和。树状数组用 i & -i 跳转，单次操作 O(log n)。`,
  gen: r => {
    const n = 6 + r.int(6);
    const a = Array.from({ length: n }, () => 1 + r.int(20));
    const ops = [];
    for (let k = 0, c = 3 + r.int(3); k < c; k++) {
      if (r.int(2)) ops.push(["add", r.int(n), 1 + r.int(10)]);
      else ops.push(["sum", r.int(n)]);
    }
    if (!ops.some(o => o[0] === "sum")) ops.push(["sum", n - 1]);   // 保证至少有一次查询
    return { n, a, ops };
  },
  solve: p => fenwickRun(p.a, p.ops).join("\n"),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}\n接下来 ${p.ops.length} 行操作：\n${p.ops.map(o => o.join(" ")).join("\n")}`,
  outputText: p => fenwickRun(p.a, p.ops).join("\n"),
  code: {
    cpp: `struct Fenwick {
    int n; vector<long long> t;
    Fenwick(int n) : n(n), t(n + 1, 0) {}
    void add(int i, long long v) {          // 下标从 0 开始
        for (i++; i <= n; i += i & -i) t[i] += v;
    }
    long long sum(int i) {                   // 前 i+1 个元素之和
        long long s = 0;
        for (i++; i > 0; i -= i & -i) s += t[i];
        return s;
    }
    long long range(int l, int r) { return sum(r) - (l ? sum(l - 1) : 0); }
};`,
    py: `class Fenwick:
    def __init__(self, n):
        self.n = n
        self.t = [0] * (n + 1)

    def add(self, i, v):
        i += 1
        while i <= self.n:
            self.t[i] += v
            i += i & -i

    def sum(self, i):
        i += 1
        s = 0
        while i > 0:
            s += self.t[i]
            i -= i & -i
        return s`,
    java: `static class Fenwick {
    int n;
    long[] t;
    Fenwick(int n) { this.n = n; t = new long[n + 1]; }
    void add(int i, long v) { for (i++; i <= n; i += i & -i) t[i] += v; }
    long sum(int i) { long s = 0; for (i++; i > 0; i -= i & -i) s += t[i]; return s; }
}`,
    c: `long long bit[100005];
int bitN;
void bitInit(int n) { bitN = n; for (int i = 0; i <= n; i++) bit[i] = 0; }
void bitAdd(int i, long long v) { for (i++; i <= bitN; i += i & -i) bit[i] += v; }
long long bitSum(int i) { long long s = 0; for (i++; i > 0; i -= i & -i) s += bit[i]; return s; }`
  },
  points: ["树状数组下标习惯从 1 开始，用 0 基下标时进出都要 +1/-1，别混", "i & -i 取到的是「最低位的 1」，它决定了每个结点管辖的区间长度", "求区间和用 sum(r) - sum(l-1)；改成维护差分数组就能实现区间加、单点查"]
});

// ============================== 94. ST 表区间最大值 ==============================
F.push({
  key: "sparse-rmq", cat: "区间查询", diff: "中等",
  title: p => `静态区间最大值（n = ${p.a.length}，${p.qs.length} 次查询）`,
  desc: p => `给定数组 ${p.a.join(" ")}，回答 ${p.qs.length} 个区间最大值查询。ST 表（稀疏表）：st[k][i] 表示从 i 起长度 2^k 的区间最值，预处理 O(n log n)，单次查询 O(1)，且不需要修改数组。`,
  gen: r => {
    const n = 8 + r.int(9);
    const a = Array.from({ length: n }, () => 1 + r.int(50));
    const qs = Array.from({ length: 2 + r.int(3) }, () => {
      const l = r.int(n), rr = l + r.int(n - l);
      return [l, rr];
    });
    return { a, qs };
  },
  solve: p => { const st = buildSt(p.a); return p.qs.map(([l, r]) => rmqMax(st, l, r)).join("\n"); },
  inputText: p => `第一行 n = ${p.a.length}, q = ${p.qs.length}\n第二行 ${p.a.length} 个整数：${p.a.join(" ")}\n接下来 ${p.qs.length} 行每行 l r（0 基闭区间）：\n${p.qs.map(q => q.join(" ")).join("\n")}`,
  outputText: p => { const st = buildSt(p.a); return p.qs.map(([l, r]) => rmqMax(st, l, r)).join("\n"); },
  code: {
    cpp: `struct SparseTable {
    vector<vector<int>> st; vector<int> lg;
    explicit SparseTable(const vector<int>& a) {
        int n = a.size();
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        int K = lg[n] + 1;
        st.assign(K, vector<int>(n));
        st[0] = a;
        for (int k = 1; k < K; k++)
            for (int i = 0; i + (1 << k) <= n; i++)
                st[k][i] = max(st[k-1][i], st[k-1][i + (1 << (k-1))]);
    }
    int query(int l, int r) {              // 闭区间
        int k = lg[r - l + 1];
        return max(st[k][l], st[k][r - (1 << k) + 1]);
    }
};`,
    py: `class SparseTable:
    def __init__(self, a):
        n = len(a)
        self.lg = [0] * (n + 1)
        for i in range(2, n + 1):
            self.lg[i] = self.lg[i >> 1] + 1
        K = self.lg[n] + 1
        self.st = [a[:] ] + [[0] * n for _ in range(K - 1)]
        for k in range(1, K):
            span = 1 << (k - 1)
            for i in range(n - (1 << k) + 1):
                self.st[k][i] = max(self.st[k-1][i], self.st[k-1][i + span])

    def query(self, l, r):
        k = self.lg[r - l + 1]
        return max(self.st[k][l], self.st[k][r - (1 << k) + 1])`,
    java: `static class SparseTable {
    int[][] st;
    int[] lg;
    SparseTable(int[] a) {
        int n = a.length;
        lg = new int[n + 1];
        for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
        int K = lg[n] + 1;
        st = new int[K][n];
        st[0] = a.clone();
        for (int k = 1; k < K; k++)
            for (int i = 0; i + (1 << k) <= n; i++)
                st[k][i] = Math.max(st[k-1][i], st[k-1][i + (1 << (k-1))]);
    }
    int query(int l, int r) {
        int k = lg[r - l + 1];
        return Math.max(st[k][l], st[k][r - (1 << k) + 1]);
    }
}`,
    c: `int st[18][100005], lg2[100005];
void buildST(const int* a, int n) {
    lg2[1] = 0;
    for (int i = 2; i <= n; i++) lg2[i] = lg2[i >> 1] + 1;
    for (int i = 0; i < n; i++) st[0][i] = a[i];
    for (int k = 1; (1 << k) <= n; k++)
        for (int i = 0; i + (1 << k) <= n; i++) {
            int x = st[k-1][i], y = st[k-1][i + (1 << (k-1))];
            st[k][i] = x > y ? x : y;
        }
}
int query(int l, int r) {
    int k = lg2[r - l + 1];
    int x = st[k][l], y = st[k][r - (1 << k) + 1];
    return x > y ? x : y;
}`
  },
  points: ["查询区间可能覆盖不完全，用两段长度 2^k 的重叠区间取最值即可（重叠不影响最值）", "ST 表不支持修改：有修改就要换线段树或树状数组", "空间 O(n log n)，n = 1e6 时约 20 倍数组，注意内存上限"]
});

// ============================== 95. 差分数组 ==============================
F.push({
  key: "diff-range-add", cat: "差分", diff: "简单",
  title: p => `区间加与最终数组（n = ${p.n}，${p.ops.length} 次区间加）`,
  desc: p => `长度为 ${p.n} 的数组初始全为 0，执行 ${p.ops.length} 次操作「把 [l, r] 全加 v」，求最终数组。差分数组：d[l] += v、d[r+1] -= v，最后做一次前缀和还原，总复杂度 O(n + q) 而不是 O(nq)。`,
  gen: r => {
    const n = 5 + r.int(6);
    const ops = Array.from({ length: 2 + r.int(3) }, () => {
      const l = r.int(n), rr = l + r.int(n - l);
      return [l, rr, 1 + r.int(9)];
    });
    return { n, ops };
  },
  solve: p => applyDiff(p.n, p.ops).join(" "),
  inputText: p => `第一行 n = ${p.n}, q = ${p.ops.length}\n接下来 ${p.ops.length} 行每行 l r v（0 基闭区间）：\n${p.ops.map(o => o.join(" ")).join("\n")}`,
  outputText: p => applyDiff(p.n, p.ops).join(" "),
  code: {
    cpp: `vector<long long> rangeAdd(int n, vector<array<int,3>>& ops) {
    vector<long long> d(n + 1, 0);
    for (auto& o : ops) {
        d[o[0]] += o[2];
        d[o[1] + 1] -= o[2];      // r+1 处抵消，注意数组要开到 n+1
    }
    vector<long long> res(n);
    long long cur = 0;
    for (int i = 0; i < n; i++) { cur += d[i]; res[i] = cur; }
    return res;
}`,
    py: `def range_add(n, ops):
    d = [0] * (n + 1)
    for l, r, v in ops:
        d[l] += v
        d[r + 1] -= v
    res, cur = [], 0
    for i in range(n):
        cur += d[i]
        res.append(cur)
    return res`,
    java: `static long[] rangeAdd(int n, int[][] ops) {
    long[] d = new long[n + 1];
    for (int[] o : ops) { d[o[0]] += o[2]; d[o[1] + 1] -= o[2]; }
    long[] res = new long[n];
    long cur = 0;
    for (int i = 0; i < n; i++) { cur += d[i]; res[i] = cur; }
    return res;
}`,
    c: `void rangeAdd(int n, int ops[][3], int q, long long* res) {
    long long d[100005] = {0};
    for (int i = 0; i < q; i++) {
        d[ops[i][0]] += ops[i][2];
        d[ops[i][1] + 1] -= ops[i][2];
    }
    long long cur = 0;
    for (int i = 0; i < n; i++) { cur += d[i]; res[i] = cur; }
}`
  },
  points: ["差分数组要开 n+1 大小：最后一次操作可能在 n 位置写 d[r+1]", "前缀和还原必须按顺序累加，不能只加 d[i] 本身", "在差分上再做一次前缀和就得到原数组的「二阶差分」，可以处理区间加等差数列这类变形"]
});

// ============================== 96. 合并 k 个有序数组 ==============================
F.push({
  key: "heap-k-merge", cat: "堆", diff: "中等",
  title: p => `合并 ${p.arrs.length} 个有序数组取前 ${p.m} 小`,
  desc: p => `有 ${p.arrs.length} 个已升序排列的数组，取合并后最小的 ${p.m} 个数。标准做法是小根堆：每个数组先把首元素入堆，每次弹堆顶输出、再把同数组的下一个入堆，复杂度 O(m log k)，不需要把所有元素全部排序。`,
  gen: r => {
    const arrs = Array.from({ length: 2 + r.int(3) }, () =>
      Array.from({ length: 3 + r.int(4) }, () => 1 + r.int(40)).sort((a, b) => a - b));
    const total = arrs.reduce((s, a) => s + a.length, 0);
    const m = 3 + r.int(Math.max(total - 3, 1));
    return { arrs, m: Math.min(m, total) };
  },
  solve: p => heapKMerge(p.arrs, p.m).join(" "),
  inputText: p => `第一行 k = ${p.arrs.length}, m = ${p.m}\n接下来 ${p.arrs.length} 行，每行一个升序数组：\n${p.arrs.map(a => a.join(" ")).join("\n")}`,
  outputText: p => heapKMerge(p.arrs, p.m).join(" "),
  code: {
    cpp: `vector<int> mergeK(vector<vector<int>>& arrs, int m) {
    // 堆元素: {值, 数组下标, 元素下标}
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> pq;
    for (int i = 0; i < (int)arrs.size(); i++)
        if (!arrs[i].empty()) pq.push({arrs[i][0], i, 0});
    vector<int> out;
    while (!pq.empty() && (int)out.size() < m) {
        auto [v, i, j] = pq.top(); pq.pop();
        out.push_back(v);
        if (j + 1 < (int)arrs[i].size()) pq.push({arrs[i][j + 1], i, j + 1});
    }
    return out;
}`,
    py: `import heapq

def merge_k(arrs, m):
    pq = []
    for i, a in enumerate(arrs):
        if a:
            pq.append((a[0], i, 0))
    heapq.heapify(pq)
    out = []
    while pq and len(out) < m:
        v, i, j = heapq.heappop(pq)
        out.append(v)
        if j + 1 < len(arrs[i]):
            heapq.heappush(pq, (arrs[i][j + 1], i, j + 1))
    return out`,
    java: `static List<Integer> mergeK(int[][] arrs, int m) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int i = 0; i < arrs.length; i++) if (arrs[i].length > 0) pq.offer(new int[]{arrs[i][0], i, 0});
    List<Integer> out = new ArrayList<>();
    while (!pq.isEmpty() && out.size() < m) {
        int[] cur = pq.poll();
        out.add(cur[0]);
        if (cur[2] + 1 < arrs[cur[1]].length) pq.offer(new int[]{arrs[cur[1]][cur[2] + 1], cur[1], cur[2] + 1});
    }
    return out;
}`,
    c: `// 简易小根堆（数组实现），元素编码为 (值 * 1000 + 数组号 * 10 + 位置)
void mergeK(int arrs[][100], int lens[], int k, int m, int* out, int* len) {
    int heap[1005], sz = 0;
    int push = 0; (void) push;
    for (int i = 0; i < k; i++) if (lens[i]) {
        heap[sz++] = arrs[i][0] * 1000 + i * 10 + 0;
        for (int c = sz - 1; c > 0;) { int p = (c - 1) / 2; if (heap[p] > heap[c]) { int t = heap[p]; heap[p] = heap[c]; heap[c] = t; c = p; } else break; }
    }
    *len = 0;
    while (sz && *len < m) {
        int top = heap[0];
        out[(*len)++] = top / 1000;
        int i = (top % 1000) / 10, j = top % 10 + 1;
        heap[0] = heap[--sz];
        if (j < lens[i]) heap[0] = arrs[i][j] * 1000 + i * 10 + j;
        for (int c = 0;;) {
            int l = 2 * c + 1, r = l + 1, mn = c;
            if (l < sz && heap[l] < heap[mn]) mn = l;
            if (r < sz && heap[r] < heap[mn]) mn = r;
            if (mn == c) break;
            int t = heap[c]; heap[c] = heap[mn]; heap[mn] = t; c = mn;
        }
    }
}`
  },
  points: ["堆里只存 k 个「当前候选」，不是全部元素，内存从 O(N) 降到 O(k)", "堆元素必须带上数组下标和位置，否则无法知道该补哪个下一个元素", "只在需要前 m 小时用堆；要完整有序结果且 k 很小时直接全部排序反而更简单"]
});

// ============================== 97. 数据流中位数 ==============================
F.push({
  key: "heap-median-stream", cat: "堆", diff: "困难",
  title: p => `数据流的中位数（${p.nums.length} 个数逐个到达）`,
  desc: p => `数字依次到达：${p.nums.join(" ")}，每到达一个就输出当前所有数的中位数（偶数个时取下中位数）。标准解法是对顶堆：大根堆存较小的一半、小根堆存较大的一半，两堆大小差不超过 1，中位数就在堆顶。`,
  gen: r => ({ nums: Array.from({ length: 6 + r.int(5) }, () => 1 + r.int(50)) }),
  solve: p => medianStream(p.nums).join(" "),
  inputText: p => `第一行 n = ${p.nums.length}\n第二行 ${p.nums.length} 个整数（按到达顺序）：${p.nums.join(" ")}`,
  outputText: p => medianStream(p.nums).join(" "),
  code: {
    cpp: `class MedianFinder {
    priority_queue<int> low;                              // 大根堆，存较小的一半
    priority_queue<int, vector<int>, greater<int>> high;  // 小根堆，存较大的一半
public:
    void addNum(int x) {
        low.push(x);
        high.push(low.top()); low.pop();        // 先经 low 过滤一遍保证有序
        if (high.size() > low.size()) { low.push(high.top()); high.pop(); }
    }
    double findMedian() const {
        if (low.size() > high.size()) return low.top();
        return (low.top() + high.top()) / 2.0;
    }
};`,
    py: `import heapq

class MedianFinder:
    def __init__(self):
        self.low = []    # 大根堆（存负数）
        self.high = []   # 小根堆

    def add(self, x):
        heapq.heappush(self.low, -x)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) // 2`,
    java: `static class MedianFinder {
    PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> high = new PriorityQueue<>();
    void add(int x) {
        low.offer(x);
        high.offer(low.poll());
        if (high.size() > low.size()) low.offer(high.poll());
    }
    double median() {
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + high.peek()) / 2.0;
    }
}`,
    c: `// 用两个有序数组模拟堆语义（数据量小时更直观）
int low[1005], high[1005], ln = 0, hn = 0;
void insertSorted(int* a, int* n, int x) {
    int i = *n;
    while (i > 0 && a[i - 1] > x) { a[i] = a[i - 1]; i--; }
    a[i] = x; (*n)++;
}
void addNum(int x) {
    insertSorted(low, &ln, x);
    high[hn++] = low[--ln];
    if (hn > ln) { insertSorted(low, &ln, high[--hn]); }
}
int median() { return ln > hn ? low[ln - 1] : low[ln - 1]; }`
  },
  points: ["新元素先压入 low 再转到 high，这一步天然保证了「max(low) <= min(high)」", "两堆大小差控制在 1 以内，中位数才能只看堆顶", "要求上中位数时改成 low 多留一个元素；浮点中位数要注意整型除法截断"]
});

// ============================== 98. 第 k 个排列 ==============================
F.push({
  key: "backtrack-kth-perm", cat: "回溯", diff: "中等",
  title: p => `字典序第 ${p.k} 个排列（n = ${p.n}）`,
  desc: p => `求 1..${p.n} 全排列中字典序第 ${p.k} 个（${p.n}! = ${p.fact} 个排列）。可以逐个 next_permutation 走 k-1 步，也可以用康托展开直接算：第 i 位取「剩余数字中第 k / (n-1-i)! 个」，把 O(n·n!) 降到 O(n²)。`,
  gen: r => {
    const n = 3 + r.int(4);
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    return { n, k: 1 + r.int(fact), fact };
  },
  solve: p => kthPerm(p.n, p.k).join(" "),
  inputText: p => `第一行 n = ${p.n}, k = ${p.k}（1 <= k <= ${p.fact}）`,
  outputText: p => kthPerm(p.n, p.k).join(" "),
  code: {
    cpp: `vector<int> kthPermutation(int n, int k) {
    vector<int> nums(n), res;
    iota(nums.begin(), nums.end(), 1);
    vector<int> fact(n + 1, 1);
    for (int i = 1; i <= n; i++) fact[i] = fact[i-1] * i;
    --k;                                     // 康托展开是 0 基
    for (int i = 0; i < n; i++) {
        int block = fact[n - 1 - i];
        int idx = k / block;                 // 该位取剩余里第 idx 个
        k %= block;
        res.push_back(nums[idx]);
        nums.erase(nums.begin() + idx);
    }
    return res;
}`,
    py: `def kth_permutation(n, k):
    nums = list(range(1, n + 1))
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i
    k -= 1
    res = []
    for i in range(n):
        block = fact[n - 1 - i]
        idx = k // block
        k %= block
        res.append(nums.pop(idx))
    return res`,
    java: `static int[] kthPermutation(int n, int k) {
    List<Integer> nums = new ArrayList<>();
    for (int i = 1; i <= n; i++) nums.add(i);
    int[] fact = new int[n + 1];
    fact[0] = 1;
    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
    k--;
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        int block = fact[n - 1 - i];
        int idx = k / block;
        k %= block;
        res[i] = nums.remove(idx);
    }
    return res;
}`,
    c: `void kthPermutation(int n, int k, int* res) {
    int nums[15], fact[15];
    for (int i = 0; i < n; i++) nums[i] = i + 1;
    fact[0] = 1;
    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
    k--;
    int len = n;
    for (int i = 0; i < n; i++) {
        int block = fact[n - 1 - i];
        int idx = k / block;
        k %= block;
        res[i] = nums[idx];
        for (int j = idx; j + 1 < len; j++) nums[j] = nums[j + 1];
        len--;
    }
}`
  },
  points: ["康托展开的 k 要转成 0 基（先减 1），否则整体偏移一个排列", "n 到 9 以内 fact 不会溢出 int，n 更大时阶乘必须用 long long", "k 超出 n! 时要取模或判非法，否则 idx 会越界"]
});

// ============================== 99. Nim 博弈 ==============================
F.push({
  key: "game-nim", cat: "博弈", diff: "中等",
  title: p => `Nim 取石子（${p.piles.length} 堆，共 ${p.piles.reduce((s, x) => s + x, 0)} 颗）`,
  desc: p => `有 ${p.piles.length} 堆石子（${p.piles.join(" ")}），两人轮流从任意一堆取至少 1 颗，取走最后一颗者胜。结论：所有堆大小的异或和为 0 则先手必败，否则先手必胜（把异或和补成 0 就是必胜策略）。`,
  gen: r => ({ piles: Array.from({ length: 2 + r.int(3) }, () => 1 + r.int(15)) }),
  solve: p => (nimFirst(p.piles) ? "First" : "Second"),
  inputText: p => `第一行 n = ${p.piles.length}\n第二行 ${p.piles.length} 个整数（每堆石子数）：${p.piles.join(" ")}`,
  outputText: p => (nimFirst(p.piles) ? "First" : "Second"),
  code: {
    cpp: `bool firstPlayerWins(const vector<int>& piles) {
    int x = 0;
    for (int v : piles) x ^= v;        // 异或和
    return x != 0;                     // 非 0 先手必胜
}
// 求必胜的第一步：找到一堆满足 (a[i] ^ x) < a[i]，把它改成 a[i] ^ x
int winningMove(const vector<int>& piles) {
    int x = 0;
    for (int v : piles) x ^= v;
    if (x == 0) return -1;
    for (int i = 0; i < (int)piles.size(); i++)
        if ((piles[i] ^ x) < piles[i]) return i;
    return -1;
}`,
    py: `def first_player_wins(piles):
    x = 0
    for v in piles:
        x ^= v
    return x != 0

def winning_move(piles):
    x = 0
    for v in piles:
        x ^= v
    if x == 0:
        return -1
    for i, v in enumerate(piles):
        if (v ^ x) < v:
            return i
    return -1`,
    java: `static boolean firstPlayerWins(int[] piles) {
    int x = 0;
    for (int v : piles) x ^= v;
    return x != 0;
}`,
    c: `int firstPlayerWins(const int* piles, int n) {
    int x = 0;
    for (int i = 0; i < n; i++) x ^= piles[i];
    return x != 0;
}`
  },
  points: ["异或和是 0 的位置叫「必败态」：无论怎么走都会把对手送回非 0 的必胜态", "取最后一颗者胜与取最后一颗者败（misère 版）结论不同，后者要多判「全为 1」的特殊情况", "求具体方案时用 (a[i] ^ x) < a[i] 找可操作堆，不能直接取最大堆"]
});

// ============================== 100. 二分答案：运载能力 ==============================
F.push({
  key: "binary-ship-capacity", cat: "二分", diff: "中等",
  title: p => `船运货物（${p.w.length} 件，限 ${p.days} 天）`,
  desc: p => `货物重量 ${p.w.join(" ")}，必须按顺序装船，船每天最多运一次且总重不超过载重 C，要求 ${p.days} 天内运完，求最小载重 C。答案具有单调性：C 越大越容易完成，所以二分 C 并用贪心 check（能装就装，装不下就开新的一天）。`,
  gen: r => {
    const w = Array.from({ length: 4 + r.int(5) }, () => 1 + r.int(20));
    const days = 1 + r.int(w.length);
    return { w, days };
  },
  solve: p => String(minCapacity(p.w, p.days)),
  inputText: p => `第一行 n = ${p.w.length}, days = ${p.days}\n第二行 ${p.w.length} 个整数（货物重量）：${p.w.join(" ")}`,
  outputText: p => String(minCapacity(p.w, p.days)),
  code: {
    cpp: `int shipWithinDays(vector<int>& w, int days) {
    int lo = *max_element(w.begin(), w.end());     // 下界：至少能装下最重的一件
    int hi = accumulate(w.begin(), w.end(), 0);    // 上界：一天全部运完
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int need = 1, cur = 0;
        for (int x : w) {
            if (cur + x > mid) { need++; cur = 0; }
            cur += x;
        }
        if (need <= days) hi = mid; else lo = mid + 1;
    }
    return lo;
}`,
    py: `def ship_within_days(w, days):
    lo, hi = max(w), sum(w)
    while lo < hi:
        mid = (lo + hi) // 2
        need, cur = 1, 0
        for x in w:
            if cur + x > mid:
                need += 1
                cur = 0
            cur += x
        if need <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    java: `static int shipWithinDays(int[] w, int days) {
    int lo = 0, hi = 0;
    for (int x : w) { lo = Math.max(lo, x); hi += x; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int need = 1, cur = 0;
        for (int x : w) {
            if (cur + x > mid) { need++; cur = 0; }
            cur += x;
        }
        if (need <= days) hi = mid; else lo = mid + 1;
    }
    return lo;
}`,
    c: `int shipWithinDays(const int* w, int n, int days) {
    int lo = 0, hi = 0;
    for (int i = 0; i < n; i++) { if (w[i] > lo) lo = w[i]; hi += w[i]; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, need = 1, cur = 0;
        for (int i = 0; i < n; i++) {
            if (cur + w[i] > mid) { need++; cur = 0; }
            cur += w[i];
        }
        if (need <= days) hi = mid; else lo = mid + 1;
    }
    return lo;
}`
  },
  points: ["下界必须是最大单件重量，写成 0 会让 check 在这些用例上永远失败", "mid 用 lo + (hi - lo) / 2 避免 lo + hi 溢出", "二分答案的模板要记牢：可行就缩右界、不可行就推左界，最后 lo == hi 就是答案"]
});

// ============================== 101. 螺旋矩阵生成 ==============================
F.push({
  key: "spiral-generate", cat: "矩阵", diff: "中等",
  title: p => `生成 ${p.n} × ${p.n} 螺旋矩阵`,
  desc: p => `按顺时针螺旋顺序把 1 到 ${p.n * p.n} 填入 ${p.n} × ${p.n} 矩阵，输出每一行。用四条边界 top/bottom/left/right 收缩：填完一条边就更新对应边界，注意正方形的最后两步前要再检查边界是否还有效。`,
  gen: r => ({ n: 3 + r.int(3) }),
  solve: p => spiralMatrix(p.n).map(row => row.join(" ")).join("\n"),
  inputText: p => `第一行 n = ${p.n}`,
  outputText: p => spiralMatrix(p.n).map(row => row.join(" ")).join("\n"),
  code: {
    cpp: `vector<vector<int>> generateMatrix(int n) {
    vector<vector<int>> g(n, vector<int>(n));
    int top = 0, bottom = n - 1, left = 0, right = n - 1, v = 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) g[top][j] = v++;
        top++;
        for (int i = top; i <= bottom; i++) g[i][right] = v++;
        right--;
        if (top <= bottom) {                      // 防止最后一行重复填
            for (int j = right; j >= left; j--) g[bottom][j] = v++;
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) g[i][left] = v++;
            left++;
        }
    }
    return g;
}`,
    py: `def generate_matrix(n):
    g = [[0] * n for _ in range(n)]
    top, bottom, left, right, v = 0, n - 1, 0, n - 1, 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            g[top][j] = v; v += 1
        top += 1
        for i in range(top, bottom + 1):
            g[i][right] = v; v += 1
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1):
                g[bottom][j] = v; v += 1
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                g[i][left] = v; v += 1
            left += 1
    return g`,
    java: `static int[][] generateMatrix(int n) {
    int[][] g = new int[n][n];
    int top = 0, bottom = n - 1, left = 0, right = n - 1, v = 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) g[top][j] = v++;
        top++;
        for (int i = top; i <= bottom; i++) g[i][right] = v++;
        right--;
        if (top <= bottom) { for (int j = right; j >= left; j--) g[bottom][j] = v++; bottom--; }
        if (left <= right) { for (int i = bottom; i >= top; i--) g[i][left] = v++; left++; }
    }
    return g;
}`,
    c: `void generateMatrix(int n, int g[][105]) {
    int top = 0, bottom = n - 1, left = 0, right = n - 1, v = 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) g[top][j] = v++;
        top++;
        for (int i = top; i <= bottom; i++) g[i][right] = v++;
        right--;
        if (top <= bottom) { for (int j = right; j >= left; j--) g[bottom][j] = v++; bottom--; }
        if (left <= right) { for (int i = bottom; i >= top; i--) g[i][left] = v++; left++; }
    }
}`
  },
  points: ["奇数阶矩阵最后一圈只剩中心一格，两个 if 判断缺一个就会重复写值", "四步顺序固定为「上右下左」，调整顺序会破坏顺时针语义", "边界更新放在填完之后，否则会把已经填过的元素再覆盖一次"]
});

module.exports = { TYPES_F };
