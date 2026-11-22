// 题型模板库 E（57-82）：二分变种 / 二维前缀和 / 链表 / 字典树 / KMP / 网格搜索 / 大数 / 区间 DP

const TYPES_E = [];
const E = TYPES_E;

// ---------- 工具函数（solve 与 outputText 共用，保证完全一致） ----------
const lowerBound = (a, x) => { let l = 0, r = a.length; while (l < r) { const m = (l + r) >> 1; if (a[m] < x) l = m + 1; else r = m; } return l; };
const upperBound = (a, x) => { let l = 0, r = a.length; while (l < r) { const m = (l + r) >> 1; if (a[m] <= x) l = m + 1; else r = m; } return l; };
function isqrt(n) { let l = 0, r = 100000; while (l < r) { const m = (l + r + 1) >> 1; if (m * m <= n) l = m; else r = m - 1; } return l; }
function rotateMin(a) { let l = 0, r = a.length - 1; while (l < r) { const m = (l + r) >> 1; if (a[m] > a[r]) l = m + 1; else r = m; } return a[l]; }
function dedupLen(a) { const out = []; for (const x of a) if (!out.length || out[out.length - 1] !== x) out.push(x); return out; }
function moore(a) { let c = 0, cand = 0; for (const x of a) { if (c === 0) cand = x; c += x === cand ? 1 : -1; } return cand; }
function hasCycle(nxt) {
  let slow = 0, fast = 0, step = 0;
  while (fast !== -1 && nxt[fast] !== -1 && step <= nxt.length + 5) {
    slow = nxt[slow]; fast = nxt[nxt[fast]];
    if (slow === fast) return true;
    step++;
  }
  return false;
}
function rotate90(g) { const n = g.length; return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => g[n - 1 - j][i])); }
function primeFactor(n) {
  const parts = [];
  for (let p = 2; p * p <= n; p++) {
    if (n % p) continue;
    let k = 0;
    while (n % p === 0) { n /= p; k++; }
    parts.push(k > 1 ? `${p}^${k}` : `${p}`);
  }
  if (n > 1) parts.push(`${n}`);
  return parts.join("*");
}
function divisorCount(n) { let c = 0; for (let i = 1; i * i <= n; i++) if (n % i === 0) c += (i * i === n ? 1 : 2); return c; }
function pascalRow(n) { let row = [1]; for (let i = 0; i < n; i++) { const nx = [1]; for (let j = 1; j < row.length; j++) nx.push(row[j - 1] + row[j]); nx.push(1); row = nx; } return row; }
function rob(a) { let prev = 0, cur = 0; for (const x of a) { const t = Math.max(cur, prev + x); prev = cur; cur = t; } return cur; }
function maxProfit(p) { let lo = Infinity, best = 0; for (const x of p) { lo = Math.min(lo, x); best = Math.max(best, x - lo); } return best; }
function canPartition(a) {
  const sum = a.reduce((s, x) => s + x, 0);
  if (sum % 2) return false;
  const t = sum / 2, dp = Array(t + 1).fill(false);
  dp[0] = true;
  for (const x of a) for (let j = t; j >= x; j--) if (dp[j - x]) dp[j] = true;
  return dp[t];
}
function stoneMerge(a) {
  const n = a.length, pre = [0];
  for (const x of a) pre.push(pre[pre.length - 1] + x);
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + pre[j + 1] - pre[i]);
    }
  return n ? dp[0][n - 1] : 0;
}
function kmpFirst(s, p) {
  if (!p.length) return 0;
  const nx = Array(p.length).fill(0);
  for (let i = 1, k = 0; i < p.length; i++) {
    while (k && p[i] !== p[k]) k = nx[k - 1];
    if (p[i] === p[k]) k++;
    nx[i] = k;
  }
  for (let i = 0, k = 0; i < s.length; i++) {
    while (k && s[i] !== p[k]) k = nx[k - 1];
    if (s[i] === p[k]) k++;
    if (k === p.length) return i - p.length + 1;
  }
  return -1;
}
function gridBfs(g) {
  const n = g.length, m = g[0].length;
  if (g[0][0]) return -1;
  const dist = Array.from({ length: n }, () => Array(m).fill(-1));
  dist[0][0] = 0;
  const q = [[0, 0]];
  for (let h = 0; h < q.length; h++) {
    const [i, j] = q[h];
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const x = i + di, y = j + dj;
      if (x < 0 || y < 0 || x >= n || y >= m || g[x][y] || dist[x][y] !== -1) continue;
      dist[x][y] = dist[i][j] + 1;
      q.push([x, y]);
    }
  }
  return dist[n - 1][m - 1];
}
function islandCount(g) {
  const n = g.length, m = g[0].length, seen = Array.from({ length: n }, () => Array(m).fill(false));
  let cnt = 0;
  const go = (i, j) => {
    if (i < 0 || j < 0 || i >= n || j >= m || g[i][j] === 0 || seen[i][j]) return;
    seen[i][j] = true;
    go(i + 1, j); go(i - 1, j); go(i, j + 1); go(i, j - 1);
  };
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (g[i][j] && !seen[i][j]) { cnt++; go(i, j); }
  return cnt;
}
function bigAdd(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0, out = "";
  while (i >= 0 || j >= 0 || carry) {
    const s = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + carry;
    out = (s % 10) + out; carry = s >= 10 ? 1 : 0;
  }
  return out.replace(/^0+(?=\d)/, "");
}
function minWindow(s, t) {
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let missing = t.length, l = 0, best = Infinity;
  for (let r = 0; r < s.length; r++) {
    if (need[s[r]] > 0) missing--;
    need[s[r]] = (need[s[r]] || 0) - 1;
    while (missing === 0) {
      best = Math.min(best, r - l + 1);
      need[s[l]]++;
      if (need[s[l]] > 0) missing++;
      l++;
    }
  }
  return best === Infinity ? -1 : best;
}

// 57. 二分找左边界
E.push({
  key: "binary-leftmost", cat: "二分", diff: "简单",
  title: p => `查找第一个不小于 ${p.x} 的位置（n = ${p.n}）`,
  desc: p => `给定非递减数组与目标值 ${p.x}，输出第一个满足 a[i] >= ${p.x} 的下标（0 起），不存在则输出 ${p.n}（即数组长度，等价于 lower_bound 的返回值）。这是二分查找最常用的形态。`,
  gen: r => {
    const n = 6 + r.int(15);
    const a = Array.from({ length: n }, () => r.int(30)).sort((x, y) => x - y);
    return { n, a, x: r.int(32) };
  },
  solve: p => String(lowerBound(p.a, p.x)),
  inputText: p => `第一行 n = ${p.n}, x = ${p.x}\n第二行 ${p.n} 个非递减整数：${p.a.join(" ")}`,
  outputText: p => String(lowerBound(p.a, p.x)),
  code: {
    cpp: `int lowerBound(const vector<int>& a, int x) {
    int l = 0, r = a.size();          // 答案范围 [l, r]
    while (l < r) {
        int m = (l + r) / 2;
        if (a[m] < x) l = m + 1;      // 不可能是答案
        else r = m;                   // 可能是答案，保留
    }
    return l;
}`,
    py: `from bisect import bisect_left

def lower_bound(a, x):
    l, r = 0, len(a)
    while l < r:
        m = (l + r) // 2
        if a[m] < x:
            l = m + 1
        else:
            r = m
    return l      # 或直接 bisect_left(a, x)`,
    java: `static int lowerBound(int[] a, int x) {
    int l = 0, r = a.length;
    while (l < r) {
        int m = (l + r) >>> 1;
        if (a[m] < x) l = m + 1; else r = m;
    }
    return l;
}`,
    c: `int lowerBound(const int* a, int n, int x) {
    int l = 0, r = n;
    while (l < r) {
        int m = (l + r) >> 1;
        if (a[m] < x) l = m + 1; else r = m;
    }
    return l;
}`
  },
  points: ["右边界取 n（而不是 n-1），这样「全部小于 x」时能自然返回 n", "循环条件是 l < r，区间为左闭右开，最终 l == r 即答案", "把条件写反（a[m] <= x）就变成 upper_bound，两者只差一个等号"]
});

// 58. 整数平方根
E.push({
  key: "binary-sqrt", cat: "二分", diff: "简单",
  title: p => `整数平方根（n = ${p.n}）`,
  desc: p => `求 floor(sqrt(${p.n}))，即最大的整数 k 使 k² <= ${p.n}。这是「二分答案」的最简模型：答案具有单调性时就能二分，不需要数组有序。`,
  gen: r => ({ n: 2 + r.int(100000) }),
  solve: p => String(isqrt(p.n)),
  inputText: p => `第一行一个正整数 n = ${p.n}`,
  outputText: p => String(isqrt(p.n)),
  code: {
    cpp: `long long isqrt(long long n) {
    long long l = 0, r = 1e9 + 1;
    while (l < r) {
        long long m = (l + r + 1) / 2;
        if (m * m <= n) l = m; else r = m - 1;
    }
    return l;
}`,
    py: `from math import isqrt

def my_sqrt(n):
    l, r = 0, 10**9 + 1
    while l < r:
        m = (l + r + 1) // 2      # 上取整，避免死循环
        if m * m <= n:
            l = m
        else:
            r = m - 1
    return l`,
    java: `static long isqrt(long n) {
    long l = 0, r = 1000000001L;
    while (l < r) {
        long m = (l + r + 1) >>> 1;
        if (m * m <= n) l = m; else r = m - 1;
    }
    return l;
}`,
    c: `long long isqrt(long long n) {
    long long l = 0, r = 1000000001LL;
    while (l < r) {
        long long m = (l + r + 1) / 2;
        if (m * m <= n) l = m; else r = m - 1;
    }
    return l;
}`
  },
  points: ["求「最大满足条件的值」时 mid 要上取整 (l+r+1)/2，否则 l 可能永远不前进", "m*m 在 n 接近 1e18 时会超出 int，必须用 long long", "不要用 sqrt() 后转 int：浮点误差会让 1e18 附近的结果差 1"]
});

// 59. 旋转数组最小值
E.push({
  key: "rotated-min", cat: "二分", diff: "中等",
  title: p => `旋转排序数组的最小值（n = ${p.n}，旋转 ${p.k} 位）`,
  desc: p => `一个升序数组被循环右移 ${p.k} 位后得到当前数组 ${p.a.join(" ")}，求其中的最小值。二分时与右端点比较：a[mid] > a[r] 说明最小值在右侧，否则在左侧（含 mid）。`,
  gen: r => {
    const n = 5 + r.int(12);
    const base = Array.from({ length: n }, (_, i) => i * 3 + 2);
    const k = 1 + r.int(n - 1);
    const a = base.slice(n - k).concat(base.slice(0, n - k));
    return { n, k, a };
  },
  solve: p => String(rotateMin(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数（旋转后的升序数组）：${p.a.join(" ")}`,
  outputText: p => String(rotateMin(p.a)),
  code: {
    cpp: `int findMin(const vector<int>& a) {
    int l = 0, r = (int)a.size() - 1;
    while (l < r) {
        int m = (l + r) / 2;
        if (a[m] > a[r]) l = m + 1;   // 最小值在右半
        else r = m;                    // 在左半或就是 mid
    }
    return a[l];
}`,
    py: `def find_min(a):
    l, r = 0, len(a) - 1
    while l < r:
        m = (l + r) // 2
        if a[m] > a[r]:
            l = m + 1
        else:
            r = m
    return a[l]`,
    java: `static int findMin(int[] a) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int m = (l + r) >>> 1;
        if (a[m] > a[r]) l = m + 1; else r = m;
    }
    return a[l];
}`,
    c: `int findMin(const int* a, int n) {
    int l = 0, r = n - 1;
    while (l < r) {
        int m = (l + r) >> 1;
        if (a[m] > a[r]) l = m + 1; else r = m;
    }
    return a[l];
}`
  },
  points: ["必须和 a[r] 比较，和 a[l] 比较在单调区间上无法判断方向", "有重复元素时（如 [3,3,1,3]）需要额外 r-- 去重，退化为 O(n)", "数组完全有序（未旋转）时这段代码也正确返回 a[0]"]
});

// 60. 二维前缀和
E.push({
  key: "prefix-2d", cat: "前缀和", diff: "中等",
  title: p => `子矩阵求和（${p.n} × ${p.m}，${p.qs.length} 次查询）`,
  desc: p => `给定 ${p.n} 行 ${p.m} 列的矩阵与 ${p.qs.length} 个矩形查询 (r1, c1, r2, c2)，输出每个矩形内的元素和。二维前缀和：pre[i][j] = 左上角 (0,0) 到 (i-1,j-1) 的和，单次查询 O(1)。`,
  gen: r => {
    const n = 2 + r.int(4), m = 2 + r.int(4);
    const g = Array.from({ length: n }, () => Array.from({ length: m }, () => r.int(10)));
    const qs = Array.from({ length: 2 + r.int(3) }, () => {
      const r1 = r.int(n), r2 = r1 + r.int(n - r1);
      const c1 = r.int(m), c2 = c1 + r.int(m - c1);
      return [r1, c1, r2, c2];
    });
    return { n, m, g, qs };
  },
  solve: p => p.qs.map(([r1, c1, r2, c2]) => {
    let s = 0;
    for (let i = r1; i <= r2; i++) for (let j = c1; j <= c2; j++) s += p.g[i][j];
    return s;
  }).join("\n"),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}, q = ${p.qs.length}\n接下来 ${p.n} 行每行 ${p.m} 个整数：\n${p.g.map(row => row.join(" ")).join("\n")}\n接下来 ${p.qs.length} 行，每行 r1 c1 r2 c2：\n${p.qs.map(q => q.join(" ")).join("\n")}`,
  outputText: p => p.qs.map(([r1, c1, r2, c2]) => {
    let s = 0;
    for (let i = r1; i <= r2; i++) for (let j = c1; j <= c2; j++) s += p.g[i][j];
    return s;
  }).join("\n"),
  code: {
    cpp: `// pre[i][j] 表示前 i 行 j 列的和，行列都多开 1 便于处理边界
vector<vector<long long>> build(const vector<vector<int>>& g) {
    int n = g.size(), m = g[0].size();
    vector<vector<long long>> pre(n + 1, vector<long long>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + g[i-1][j-1];
    return pre;
}
long long query(vector<vector<long long>>& pre, int r1, int c1, int r2, int c2) {
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
}`,
    py: `def build(g):
    n, m = len(g), len(g[0])
    pre = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + g[i-1][j-1]
    return pre

def query(pre, r1, c1, r2, c2):
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]`,
    java: `static long[][] build(int[][] g) {
    int n = g.length, m = g[0].length;
    long[][] pre = new long[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + g[i-1][j-1];
    return pre;
}
static long query(long[][] pre, int r1, int c1, int r2, int c2) {
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
}`,
    c: `long long pre[105][105];
void build(int g[105][105], int n, int m) {
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + g[i-1][j-1];
}
long long query(int r1, int c1, int r2, int c2) {
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
}`
  },
  points: ["容斥公式：S = pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]，四个角少一个都不对", "前缀和数组行列各多开 1 并把下标整体右移，能省掉一堆 i==0 的特判", "n、m 到 1000 时总和可达 1e12，必须用 long long / Python 天然大整数"]
});

// 61. 多关键字排序
E.push({
  key: "sort-multi-key", cat: "排序", diff: "中等",
  title: p => `成绩排名（${p.stu.length} 名学生）`,
  desc: p => `给出 ${p.stu.length} 名学生的学号与三门成绩，按总分降序排序；总分相同时按学号升序。输出排序后的学号序列。关键是把比较规则抽象成一个函数，别写多重循环。`,
  gen: r => {
    const n = 4 + r.int(6);
    const stu = Array.from({ length: n }, (_, i) => [100 + i, r.int(101), r.int(101), r.int(101)]);
    return { stu };
  },
  solve: p => p.stu.slice().sort((a, b) => (b[1] + b[2] + b[3]) - (a[1] + a[2] + a[3]) || a[0] - b[0]).map(s => s[0]).join(" "),
  inputText: p => `第一行 n = ${p.stu.length}\n接下来 ${p.stu.length} 行，每行「学号 语文 数学 英语」：\n${p.stu.map(s => s.join(" ")).join("\n")}`,
  outputText: p => p.stu.slice().sort((a, b) => (b[1] + b[2] + b[3]) - (a[1] + a[2] + a[3]) || a[0] - b[0]).map(s => s[0]).join(" "),
  code: {
    cpp: `struct Stu { int id, a, b, c; };
sort(v.begin(), v.end(), [](const Stu& x, const Stu& y) {
    int sx = x.a + x.b + x.c, sy = y.a + y.b + y.c;
    if (sx != sy) return sx > sy;    // 总分降序
    return x.id < y.id;              // 学号升序
});`,
    py: `def rank(stu):
    # 总分降序、学号升序：key 里用负号 / 直接两段排序
    return sorted(stu, key=lambda s: (-(s[1] + s[2] + s[3]), s[0]))`,
    java: `Arrays.sort(v, (x, y) -> {
    int sx = x[1] + x[2] + x[3], sy = y[1] + y[2] + y[3];
    if (sx != sy) return sy - sx;
    return x[0] - y[0];
});`,
    c: `typedef struct { int id, a, b, c; } Stu;
int cmp(const void* p, const void* q) {
    const Stu* x = (const Stu*)p; const Stu* y = (const Stu*)q;
    int sx = x->a + x->b + x->c, sy = y->a + y->b + y->c;
    if (sx != sy) return sy - sx;
    return x->id - y->id;
}
qsort(v, n, sizeof(Stu), cmp);`
  },
  points: ["比较函数必须满足严格弱序，写成 >= 会让 sort 越界（C++ 直接 RE）", "多关键字用「短路写法」串起来最清晰：主键不同就返回主键比较，否则比次键", "Python 用元组 key 最省事，降序在数字前加负号，字符串降序可用 reverse 配合"]
});

// 62. 合并两个有序数组
E.push({
  key: "merge-two-sorted", cat: "排序", diff: "简单",
  title: p => `合并两个有序数组（${p.a.length} + ${p.b.length}）`,
  desc: p => `给定两个升序数组，合并为一个仍升序的数组并输出。双指针从前往后取较小者，是归并排序的核心步骤，时间复杂度 O(n+m)。`,
  gen: r => {
    const na = 3 + r.int(5), nb = 3 + r.int(5);
    return {
      a: Array.from({ length: na }, () => r.int(40)).sort((x, y) => x - y),
      b: Array.from({ length: nb }, () => r.int(40)).sort((x, y) => x - y)
    };
  },
  solve: p => [...p.a, ...p.b].sort((x, y) => x - y).join(" "),
  inputText: p => `第一行 n = ${p.a.length}, m = ${p.b.length}\n第二行 ${p.a.length} 个升序整数：${p.a.join(" ")}\n第三行 ${p.b.length} 个升序整数：${p.b.join(" ")}`,
  outputText: p => [...p.a, ...p.b].sort((x, y) => x - y).join(" "),
  code: {
    cpp: `vector<int> merge(const vector<int>& a, const vector<int>& b) {
    vector<int> res;
    int i = 0, j = 0;
    while (i < (int)a.size() && j < (int)b.size())
        res.push_back(a[i] <= b[j] ? a[i++] : b[j++]);
    while (i < (int)a.size()) res.push_back(a[i++]);
    while (j < (int)b.size()) res.push_back(b[j++]);
    return res;
}`,
    py: `def merge(a, b):
    i = j = 0
    res = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            res.append(a[i]); i += 1
        else:
            res.append(b[j]); j += 1
    return res + a[i:] + b[j:]`,
    java: `static int[] merge(int[] a, int[] b) {
    int[] res = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length) res[k++] = a[i] <= b[j] ? a[i++] : b[j++];
    while (i < a.length) res[k++] = a[i++];
    while (j < b.length) res[k++] = b[j++];
    return res;
}`,
    c: `int merge(const int* a, int na, const int* b, int nb, int* res) {
    int i = 0, j = 0, k = 0;
    while (i < na && j < nb) res[k++] = a[i] <= b[j] ? a[i++] : b[j++];
    while (i < na) res[k++] = a[i++];
    while (j < nb) res[k++] = b[j++];
    return k;
}`
  },
  points: ["用 <= 而不是 < 才能保证归并排序的稳定性", "两个 while 收尾一定要写，否则剩余元素会丢", "若要求原地合并到 a 的尾部（a 预留空间），要从后往前放，避免覆盖未处理元素"]
});

// 63. 有序数组去重
E.push({
  key: "dedup-sorted", cat: "双指针", diff: "简单",
  title: p => `有序数组原地去重（n = ${p.n}）`,
  desc: p => `给定非递减数组，原地删除重复元素，使每个元素只出现一次，输出去重后的长度与前段有效内容。用快慢指针：慢指针指向最后一个已确定的元素。`,
  gen: r => {
    const n = 5 + r.int(10);
    return { n, a: Array.from({ length: n }, () => r.int(8)).sort((x, y) => x - y) };
  },
  solve: p => { const d = dedupLen(p.a); return d.length + "\n" + d.join(" "); },
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个非递减整数：${p.a.join(" ")}`,
  outputText: p => { const d = dedupLen(p.a); return d.length + "\n" + d.join(" "); },
  code: {
    cpp: `int removeDuplicates(vector<int>& a) {
    if (a.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < (int)a.size(); fast++)
        if (a[fast] != a[slow]) a[++slow] = a[fast];
    return slow + 1;
}`,
    py: `def remove_duplicates(a):
    if not a:
        return 0
    slow = 0
    for fast in range(1, len(a)):
        if a[fast] != a[slow]:
            slow += 1
            a[slow] = a[fast]
    return slow + 1`,
    java: `static int removeDuplicates(int[] a) {
    if (a.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < a.length; fast++)
        if (a[fast] != a[slow]) a[++slow] = a[fast];
    return slow + 1;
}`,
    c: `int removeDuplicates(int* a, int n) {
    if (n == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < n; fast++)
        if (a[fast] != a[slow]) a[++slow] = a[fast];
    return slow + 1;
}`
  },
  points: ["返回的是长度，写 ++slow 之后别忘了最后 +1", "空数组与单元素要特判，否则 slow 的初值语义会出错", "若要求每个元素最多保留两次，加一个计数器判断即可（LeetCode 80）"]
});

// 64. 多数元素
E.push({
  key: "moore-vote", cat: "数学", diff: "中等",
  title: p => `多数元素（n = ${p.n}）`,
  desc: p => `数组中有个元素出现次数严格大于 n/2，找出它。摩尔投票法：把不同的元素两两抵消，最后剩下的候选人一定是多数元素，时间 O(n)、空间 O(1)。`,
  gen: r => {
    const n = 5 + 2 * r.int(6);
    const major = 1 + r.int(30);
    const cnt = Math.floor(n / 2) + 1 + r.int(n - Math.floor(n / 2) - 1);
    const a = [];
    for (let i = 0; i < cnt; i++) a.push(major);
    while (a.length < n) {
      let x = 1 + r.int(30);
      if (x === major) x = major + 1;
      a.push(x);
    }
    for (let i = a.length - 1; i > 0; i--) { const j = r.int(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return { n, a };
  },
  solve: p => String(moore(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => String(moore(p.a)),
  code: {
    cpp: `int majorityElement(const vector<int>& a) {
    int cand = 0, cnt = 0;
    for (int x : a) {
        if (cnt == 0) cand = x;
        cnt += (x == cand) ? 1 : -1;   // 相同 +1，不同 -1（抵消）
    }
    return cand;
}`,
    py: `def majority_element(a):
    cand, cnt = None, 0
    for x in a:
        if cnt == 0:
            cand = x
        cnt += 1 if x == cand else -1
    return cand`,
    java: `static int majorityElement(int[] a) {
    int cand = 0, cnt = 0;
    for (int x : a) {
        if (cnt == 0) cand = x;
        cnt += (x == cand) ? 1 : -1;
    }
    return cand;
}`,
    c: `int majorityElement(const int* a, int n) {
    int cand = 0, cnt = 0;
    for (int i = 0; i < n; i++) {
        if (cnt == 0) cand = a[i];
        cnt += (a[i] == cand) ? 1 : -1;
    }
    return cand;
}`
  },
  points: ["题目保证多数元素存在才能直接返回候选；否则要再扫一遍验证出现次数", "cnt 可能变成 0，此时立刻换候选，顺序不能反", "进阶：找出现次数 > n/3 的元素要同时维护两个候选与两个计数"]
});

// 65. 链表中间结点
E.push({
  key: "list-middle", cat: "链表", diff: "简单",
  title: p => `链表的中间结点（${p.n} 个结点）`,
  desc: p => `链表用数组模拟：第 i 个结点的值是 val[i]，next[i] 是下一个结点的下标，-1 表示结尾。输出中间结点的值——偶数个结点时取靠后的那个。快慢指针一次遍历即可。`,
  gen: r => {
    const n = 3 + r.int(10);
    return { n, val: Array.from({ length: n }, () => 1 + r.int(90)) };
  },
  solve: p => String(p.val[Math.floor(p.n / 2)]),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个结点值：${p.val.join(" ")}\n第三行 ${p.n} 个 next 下标（末尾为 -1）：${Array.from({ length: p.n }, (_, i) => i === p.n - 1 ? -1 : i + 1).join(" ")}`,
  outputText: p => String(p.val[Math.floor(p.n / 2)]),
  code: {
    cpp: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {     // fast 走两步，slow 走一步
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
    py: `def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
    java: `static ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
    c: `Node* middleNode(Node* head) {
    Node* slow = head; Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`
  },
  points: ["循环条件两个都要判：fast 判空和 fast->next 判空，少一个会空指针", "fast 走两步时，偶数长度会自然停在靠后的中间结点", "求「倒数第 k 个」用双指针间隔 k 步，思路同源"]
});

// 66. 合并两个有序链表
E.push({
  key: "list-merge", cat: "链表", diff: "简单",
  title: p => `合并两个有序链表（${p.a.length} + ${p.b.length}）`,
  desc: p => `两个升序链表，合并成一个升序链表并输出各结点值。用哑结点（dummy）简化头结点处理，尾插法逐个比较接入。`,
  gen: r => ({
    a: Array.from({ length: 3 + r.int(5) }, () => r.int(40)).sort((x, y) => x - y),
    b: Array.from({ length: 3 + r.int(5) }, () => r.int(40)).sort((x, y) => x - y)
  }),
  solve: p => [...p.a, ...p.b].sort((x, y) => x - y).join(" "),
  inputText: p => `第一行 n = ${p.a.length}, m = ${p.b.length}\n第二行 ${p.a.length} 个升序值：${p.a.join(" ")}\n第三行 ${p.b.length} 个升序值：${p.b.join(" ")}`,
  outputText: p => [...p.a, ...p.b].sort((x, y) => x - y).join(" "),
  code: {
    cpp: `ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0), *tail = &dummy;      // 哑结点省掉头结点特判
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else                  { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;                 // 剩下的一串直接接上
    return dummy.next;
}`,
    py: `def merge_two_lists(a, b):
    dummy = tail = ListNode(0)
    while a and b:
        if a.val <= b.val:
            tail.next = a; a = a.next
        else:
            tail.next = b; b = b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`,
    java: `static ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else                { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = a != null ? a : b;
    return dummy.next;
}`,
    c: `Node* mergeTwoLists(Node* a, Node* b) {
    Node dummy = {0, NULL}, *tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else                  { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}`
  },
  points: ["哑结点能让「头结点是谁」的讨论彻底消失，收尾记得返回 dummy.next", "循环结束后直接把剩余链表接上，不用再逐个搬", "不要新建结点复制值：链表题默认复用原结点，能省 O(n) 空间"]
});

// 67. 链表判环
E.push({
  key: "list-cycle", cat: "链表", diff: "中等",
  title: p => `判断链表是否有环（${p.n} 个结点${p.cycle ? "，尾结点指向 " + p.pos : "，无环"}）`,
  desc: p => `链表用 next 数组表示（-1 表示结尾）。判断链表中是否存在环，输出 YES 或 NO。Floyd 判圈：快指针每次两步、慢指针一步，相遇即有环。`,
  gen: r => {
    const n = 4 + r.int(8);
    const cycle = r.int(2) === 0;
    const pos = cycle ? r.int(n) : -1;
    const nxt = Array.from({ length: n }, (_, i) => i === n - 1 ? (cycle ? pos : -1) : i + 1);
    return { n, cycle, pos, val: Array.from({ length: n }, () => 1 + r.int(50)), nxt };
  },
  solve: p => hasCycle(p.nxt) ? "YES" : "NO",
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个结点值：${p.val.join(" ")}\n第三行 ${p.n} 个 next 下标：${p.nxt.join(" ")}`,
  outputText: p => hasCycle(p.nxt) ? "YES" : "NO",
  code: {
    cpp: `bool hasCycle(ListNode* head) {
    ListNode* slow = head; ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;    // 相遇即入环
    }
    return false;
}`,
    py: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    java: `static boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    c: `int hasCycle(Node* head) {
    Node* slow = head; Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}`
  },
  points: ["比较必须用结点指针是否相同，不能比较值（值可能重复）", "慢指针入环后最多再走一圈就会与快指针相遇，因此 O(n)", "找环的入口：相遇后让一个指针回到 head，两者同速前进，再次相遇处即入口"]
});

// 68. 矩阵旋转 90 度
E.push({
  key: "rotate-matrix", cat: "矩阵", diff: "中等",
  title: p => `方阵顺时针旋转 90°（${p.n} × ${p.n}）`,
  desc: p => `把 ${p.n} × ${p.n} 的矩阵顺时针旋转 90 度。两种写法：新开矩阵按 out[i][j] = in[n-1-j][i] 直接映射；或原地「先转置再左右翻转」。`,
  gen: r => {
    const n = 2 + r.int(4);
    return { n, g: Array.from({ length: n }, () => Array.from({ length: n }, () => r.int(50))) };
  },
  solve: p => rotate90(p.g).map(row => row.join(" ")).join("\n"),
  inputText: p => `第一行 n = ${p.n}\n接下来 ${p.n} 行每行 ${p.n} 个整数：\n${p.g.map(row => row.join(" ")).join("\n")}`,
  outputText: p => rotate90(p.g).map(row => row.join(" ")).join("\n"),
  code: {
    cpp: `void rotate(vector<vector<int>>& g) {   // 原地：转置 + 左右翻转
    int n = g.size();
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(g[i][j], g[j][i]);          // 沿主对角线转置
    for (auto& row : g) reverse(row.begin(), row.end());
}`,
    py: `def rotate(g):
    n = len(g)
    # 先转置（zip），再对每行反转
    return [list(row)[::-1] for row in zip(*g)]`,
    java: `static void rotate(int[][] g) {
    int n = g.length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int t = g[i][j]; g[i][j] = g[j][i]; g[j][i] = t;
        }
    for (int[] row : g)
        for (int l = 0, r = n - 1; l < r; l++, r--) {
            int t = row[l]; row[l] = row[r]; row[r] = t;
        }
}`,
    c: `void rotate(int g[105][105], int n) {
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int t = g[i][j]; g[i][j] = g[j][i]; g[j][i] = t;
        }
    for (int i = 0; i < n; i++)
        for (int l = 0, r = n - 1; l < r; l++, r--) {
            int t = g[i][l]; g[i][l] = g[i][r]; g[i][r] = t;
        }
}`
  },
  points: ["原地转置时内层从 j = i+1 开始，否则会交换两次变回原样", "顺时针 90° = 转置 + 左右翻转；逆时针 90° = 转置 + 上下翻转", "只有方阵能原地旋转，n×m 必须新开矩阵"]
});

// 69. 出现次数统计
E.push({
  key: "count-occur", cat: "二分", diff: "中等",
  title: p => `统计 ${p.x} 在有序数组中出现的次数（n = ${p.n}）`,
  desc: p => `非递减数组中统计值 ${p.x} 的出现次数。用两次二分求上下界，复杂度 O(log n)；直接线性扫描在 n 很大时会超时。`,
  gen: r => {
    const n = 8 + r.int(20);
    const a = Array.from({ length: n }, () => r.int(10)).sort((x, y) => x - y);
    return { n, a, x: a[r.int(n)] };
  },
  solve: p => String(upperBound(p.a, p.x) - lowerBound(p.a, p.x)),
  inputText: p => `第一行 n = ${p.n}, x = ${p.x}\n第二行 ${p.n} 个非递减整数：${p.a.join(" ")}`,
  outputText: p => String(upperBound(p.a, p.x) - lowerBound(p.a, p.x)),
  code: {
    cpp: `int countOccur(const vector<int>& a, int x) {
    int lo = lower_bound(a.begin(), a.end(), x) - a.begin();      // 第一个 >= x
    int hi = upper_bound(a.begin(), a.end(), x) - a.begin();      // 第一个 > x
    return hi - lo;
}`,
    py: `from bisect import bisect_left, bisect_right

def count_occur(a, x):
    return bisect_right(a, x) - bisect_left(a, x)`,
    java: `static int countOccur(int[] a, int x) {
    return upper(a, x) - lower(a, x);
}
static int lower(int[] a, int x) {
    int l = 0, r = a.length;
    while (l < r) { int m = (l + r) >>> 1; if (a[m] < x) l = m + 1; else r = m; }
    return l;
}
static int upper(int[] a, int x) {
    int l = 0, r = a.length;
    while (l < r) { int m = (l + r) >>> 1; if (a[m] <= x) l = m + 1; else r = m; }
    return l;
}`,
    c: `int lowerBound(const int* a, int n, int x) {
    int l = 0, r = n;
    while (l < r) { int m = (l + r) >> 1; if (a[m] < x) l = m + 1; else r = m; }
    return l;
}
int upperBound(const int* a, int n, int x) {
    int l = 0, r = n;
    while (l < r) { int m = (l + r) >> 1; if (a[m] <= x) l = m + 1; else r = m; }
    return l;
}
int countOccur(const int* a, int n, int x) { return upperBound(a, n, x) - lowerBound(a, n, x); }`
  },
  points: ["上下界之差就是出现次数，x 不存在时两者相等，结果为 0，无需特判", "注意 upper_bound 找的是「第一个大于 x」，条件用 <= 才能越过所有等于 x 的元素", "不想写两遍二分时，可用 lower_bound(x+1) 代替 upper_bound（仅对整数有效）"]
});

// 70. 质因数分解
E.push({
  key: "prime-factor", cat: "数学", diff: "简单",
  title: p => `质因数分解（n = ${p.n}）`,
  desc: p => `把 ${p.n} 分解为质因数的乘积，按「底数^指数」输出，指数为 1 时省略，多个质因数用 * 连接。例如 360 = 2^3*3^2*5。只需试除到 sqrt(n)。`,
  gen: r => ({ n: 12 + r.int(2000) }),
  solve: p => primeFactor(p.n),
  inputText: p => `第一行一个整数 n = ${p.n}`,
  outputText: p => primeFactor(p.n),
  code: {
    cpp: `string factorize(int n) {
    string out;
    for (int p = 2; (long long)p * p <= n; p++) {
        if (n % p) continue;
        int k = 0;
        while (n % p == 0) { n /= p; k++; }
        out += to_string(p) + (k > 1 ? "^" + to_string(k) : "") + "*";
    }
    if (n > 1) out += to_string(n) + "*";
    if (!out.empty()) out.pop_back();      // 去掉末尾的 *
    return out;
}`,
    py: `def factorize(n):
    parts = []
    p = 2
    while p * p <= n:
        if n % p == 0:
            k = 0
            while n % p == 0:
                n //= p
                k += 1
            parts.append(f"{p}^{k}" if k > 1 else str(p))
        p += 1
    if n > 1:
        parts.append(str(n))
    return "*".join(parts)`,
    java: `static String factorize(int n) {
    StringBuilder sb = new StringBuilder();
    for (int p = 2; (long) p * p <= n; p++) {
        if (n % p != 0) continue;
        int k = 0;
        while (n % p == 0) { n /= p; k++; }
        sb.append(p);
        if (k > 1) sb.append("^").append(k);
        if (n > 1) sb.append("*");
    }
    if (n > 1) sb.append(n);
    return sb.toString();
}`,
    c: `void factorize(int n, char* out) {
    int k = 0;
    for (int p = 2; (long long)p * p <= n; p++) {
        if (n % p) continue;
        int c = 0;
        while (n % p == 0) { n /= p; c++; }
        k += c > 1 ? sprintf(out + k, "%d^%d*", p, c) : sprintf(out + k, "%d*", p);
    }
    if (n > 1) k += sprintf(out + k, "%d*", n);
    if (k > 0) out[k - 1] = 0; else out[0] = 0;
}`
  },
  points: ["循环条件必须是 p*p <= n（用 long long 防溢出），这样剩余 n > 1 时本身就是质数", "内层 while 把 p 除尽，同时统计指数，否则指数会算错", "多次查询应先筛素数表再试除，可把复杂度降到 O(sqrt(n)/log n)"]
});

// 71. 约数个数
E.push({
  key: "divisor-count", cat: "数学", diff: "简单",
  title: p => `约数个数（n = ${p.n}）`,
  desc: p => `求 ${p.n} 的正约数个数。枚举到 sqrt(n) 即可：每找到一个小约数 i，就同时得到配对的 n/i，只有 i*i == n 时只算一个。`,
  gen: r => ({ n: 1 + r.int(800) }),
  solve: p => String(divisorCount(p.n)),
  inputText: p => `第一行一个正整数 n = ${p.n}`,
  outputText: p => String(divisorCount(p.n)),
  code: {
    cpp: `int divisorCount(int n) {
    int cnt = 0;
    for (int i = 1; (long long)i * i <= n; i++)
        if (n % i == 0) cnt += (i * i == n) ? 1 : 2;   // 完全平方数只算一次
    return cnt;
}`,
    py: `def divisor_count(n):
    cnt = 0
    i = 1
    while i * i <= n:
        if n % i == 0:
            cnt += 1 if i * i == n else 2
        i += 1
    return cnt`,
    java: `static int divisorCount(int n) {
    int cnt = 0;
    for (int i = 1; (long) i * i <= n; i++)
        if (n % i == 0) cnt += (i * i == n) ? 1 : 2;
    return cnt;
}`,
    c: `int divisorCount(int n) {
    int cnt = 0;
    for (int i = 1; (long long)i * i <= n; i++)
        if (n % i == 0) cnt += (i * i == n) ? 1 : 2;
    return cnt;
}`
  },
  points: ["完全平方数的平方根只算一个约数，漏掉判断会多算 1", "约数个数公式：若 n = p1^a1 * p2^a2 …，则个数 = (a1+1)(a2+1)…，配合质因数分解可 O(sqrt n)", "求约数之和把「+2」换成「+ i + n/i」即可"]
});

// 72. 杨辉三角第 n 行
E.push({
  key: "pascal-row", cat: "数学", diff: "简单",
  title: p => `杨辉三角第 ${p.n} 行`,
  desc: p => `输出杨辉三角第 ${p.n} 行（从第 0 行开始，第 n 行有 n+1 个数）。递推：cur[j] = prev[j-1] + prev[j]，两端恒为 1。也可用组合数公式单行直接算。`,
  gen: r => ({ n: r.int(11) }),
  solve: p => pascalRow(p.n).join(" "),
  inputText: p => `第一行一个整数 n = ${p.n}`,
  outputText: p => pascalRow(p.n).join(" "),
  code: {
    cpp: `vector<long long> pascalRow(int n) {
    vector<long long> row(1, 1);
    for (int i = 1; i <= n; i++) {
        row.push_back(1);
        for (int j = i - 1; j >= 1; j--) row[j] += row[j-1];  // 倒序原地更新
    }
    return row;
}`,
    py: `def pascal_row(n):
    row = [1]
    for i in range(1, n + 1):
        row.append(1)
        for j in range(i - 1, 0, -1):
            row[j] += row[j-1]
    return row`,
    java: `static long[] pascalRow(int n) {
    long[] row = new long[n + 1];
    row[0] = 1;
    for (int i = 1; i <= n; i++) {
        row[i] = 1;
        for (int j = i - 1; j >= 1; j--) row[j] += row[j-1];
    }
    return row;
}`,
    c: `void pascalRow(int n, long long* row) {
    row[0] = 1;
    for (int i = 1; i <= n; i++) {
        row[i] = 1;
        for (int j = i - 1; j >= 1; j--) row[j] += row[j-1];
    }
}`
  },
  points: ["原地更新必须从后往前（j 递减），从前往后会用到已被覆盖的旧值", "第 n 行第 k 个数就是 C(n, k)，n 到 30 以上会超 int，用 long long", "求某一行时只需 O(n) 空间，不必建整个三角"]
});

// 73. 打家劫舍
E.push({
  key: "house-robber", cat: "DP", diff: "中等",
  title: p => `打家劫舍（${p.n} 户）`,
  desc: p => `${p.n} 户人家沿街排列，第 i 户有 ${p.a.join("/")} 的钱，不能偷相邻两户，求能偷到的最大金额。dp[i] = max(dp[i-1], dp[i-2] + a[i])，可滚动到 O(1) 空间。`,
  gen: r => { const n = 4 + r.int(10); return { n, a: Array.from({ length: n }, () => r.int(30)) }; },
  solve: p => String(rob(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个非负整数：${p.a.join(" ")}`,
  outputText: p => String(rob(p.a)),
  code: {
    cpp: `int rob(const vector<int>& a) {
    int prev = 0, cur = 0;          // prev = dp[i-2], cur = dp[i-1]
    for (int x : a) {
        int next = max(cur, prev + x);
        prev = cur;
        cur = next;
    }
    return cur;
}`,
    py: `def rob(a):
    prev = cur = 0
    for x in a:
        prev, cur = cur, max(cur, prev + x)
    return cur`,
    java: `static int rob(int[] a) {
    int prev = 0, cur = 0;
    for (int x : a) {
        int next = Math.max(cur, prev + x);
        prev = cur;
        cur = next;
    }
    return cur;
}`,
    c: `int rob(const int* a, int n) {
    int prev = 0, cur = 0;
    for (int i = 0; i < n; i++) {
        int next = cur > prev + a[i] ? cur : prev + a[i];
        prev = cur; cur = next;
    }
    return cur;
}`
  },
  points: ["滚动更新顺序：先算 next，再 prev = cur、cur = next，写反会用错值", "环形街道（首尾相邻）要拆成「不含首」和「不含尾」两段各做一次取最大", "树形打家劫舍用 dp[u][0/1] 表示选/不选当前结点"]
});

// 74. 买卖股票最佳时机
E.push({
  key: "stock-profit", cat: "贪心", diff: "简单",
  title: p => `股票最大利润（${p.n} 天）`,
  desc: p => `给出 ${p.n} 天的股价 ${p.prices.join("/")}，只能买卖各一次（先买后卖），求最大利润，无法获利输出 0。边扫边记录历史最低价，用当天价减最低价更新答案。`,
  gen: r => { const n = 5 + r.int(10); return { n, prices: Array.from({ length: n }, () => 1 + r.int(50)) }; },
  solve: p => String(maxProfit(p.prices)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个价格：${p.prices.join(" ")}`,
  outputText: p => String(maxProfit(p.prices)),
  code: {
    cpp: `int maxProfit(const vector<int>& p) {
    int low = INT_MAX, best = 0;
    for (int x : p) {
        low = min(low, x);
        best = max(best, x - low);   // 今天卖出能赚多少
    }
    return best;
}`,
    py: `def max_profit(p):
    low, best = float('inf'), 0
    for x in p:
        low = min(low, x)
        best = max(best, x - low)
    return best`,
    java: `static int maxProfit(int[] p) {
    int low = Integer.MAX_VALUE, best = 0;
    for (int x : p) {
        low = Math.min(low, x);
        best = Math.max(best, x - low);
    }
    return best;
}`,
    c: `int maxProfit(const int* p, int n) {
    int low = 1000000000, best = 0;
    for (int i = 0; i < n; i++) {
        if (p[i] < low) low = p[i];
        if (p[i] - low > best) best = p[i] - low;
    }
    return best;
}`
  },
  points: ["必须先更新 low 再算利润，顺序反了可能用当天价当买入价（利润 0）", "可以多次买卖时改为累加所有上坡段（贪心），不是这题的答案", "允许最多 k 次交易时用 dp[j][0/1] 的持仓/空仓状态机"]
});

// 75. 分割等和子集
E.push({
  key: "partition-equal", cat: "DP", diff: "中等",
  title: p => `分割等和子集（${p.n} 个数）`,
  desc: p => `给定 ${p.n} 个正整数 ${p.a.join("/")}，能否分成两个和相等的子集？等价于「是否存在子集和等于总和的一半」，即 0/1 背包可达性判定，输出 YES 或 NO。`,
  gen: r => { const n = 3 + r.int(5); return { n, a: Array.from({ length: n }, () => 1 + r.int(10)) }; },
  solve: p => canPartition(p.a) ? "YES" : "NO",
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个正整数：${p.a.join(" ")}`,
  outputText: p => canPartition(p.a) ? "YES" : "NO",
  code: {
    cpp: `bool canPartition(const vector<int>& a) {
    int sum = accumulate(a.begin(), a.end(), 0);
    if (sum % 2) return false;              // 奇数直接不可能
    int t = sum / 2;
    vector<bool> dp(t + 1, false);
    dp[0] = true;
    for (int x : a)
        for (int j = t; j >= x; j--)
            if (dp[j - x]) dp[j] = true;
    return dp[t];
}`,
    py: `def can_partition(a):
    s = sum(a)
    if s % 2:
        return False
    t = s // 2
    dp = [True] + [False] * t
    for x in a:
        for j in range(t, x - 1, -1):
            if dp[j - x]:
                dp[j] = True
    return dp[t]`,
    java: `static boolean canPartition(int[] a) {
    int sum = 0;
    for (int x : a) sum += x;
    if ((sum & 1) == 1) return false;
    int t = sum / 2;
    boolean[] dp = new boolean[t + 1];
    dp[0] = true;
    for (int x : a)
        for (int j = t; j >= x; j--)
            if (dp[j - x]) dp[j] = true;
    return dp[t];
}`,
    c: `int canPartition(const int* a, int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) sum += a[i];
    if (sum % 2) return 0;
    int t = sum / 2;
    char dp[100005] = {1};
    for (int i = 0; i < n; i++)
        for (int j = t; j >= a[i]; j--)
            if (dp[j - a[i]]) dp[j] = 1;
    return dp[t];
}`
  },
  points: ["总和为奇数可直接返回 NO，这是最容易漏的一个剪枝", "容量必须倒序枚举，正序会变成「元素可重复使用」从而误判 YES", "dp 只需布尔值，用 bitset 还能再快一个数量级"]
});

// 76. 石子合并
E.push({
  key: "stone-merge", cat: "DP", diff: "困难",
  title: p => `石子合并最小代价（n = ${p.n}）`,
  desc: p => `一排 ${p.n} 堆石子（数量 ${p.a.join("/")}），每次只能合并相邻两堆，代价为两堆之和，求合并成一堆的最小总代价。区间 DP：dp[i][j] = min(dp[i][k] + dp[k+1][j]) + 区间和，按区间长度递增求解。`,
  gen: r => { const n = 2 + r.int(4); return { n, a: Array.from({ length: n }, () => 1 + r.int(9)) }; },
  solve: p => String(stoneMerge(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个正整数：${p.a.join(" ")}`,
  outputText: p => String(stoneMerge(p.a)),
  code: {
    cpp: `int mergeStones(const vector<int>& a) {
    int n = a.size();
    vector<int> pre(n + 1, 0);
    for (int i = 0; i < n; i++) pre[i+1] = pre[i] + a[i];
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int k = i; k < j; k++)
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + pre[j+1] - pre[i]);
        }
    return dp[0][n-1];
}`,
    py: `def merge_stones(a):
    n = len(a)
    pre = [0] * (n + 1)
    for i in range(n):
        pre[i+1] = pre[i] + a[i]
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = min(
                dp[i][k] + dp[k+1][j] for k in range(i, j)
            ) + pre[j+1] - pre[i]
    return dp[0][n-1]`,
    java: `static int mergeStones(int[] a) {
    int n = a.length;
    int[] pre = new int[n + 1];
    for (int i = 0; i < n; i++) pre[i+1] = pre[i] + a[i];
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++)
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k+1][j] + pre[j+1] - pre[i]);
        }
    return dp[0][n-1];
}`,
    c: `int mergeStones(const int* a, int n) {
    int pre[505] = {0}, dp[505][505] = {{0}};
    for (int i = 0; i < n; i++) pre[i+1] = pre[i] + a[i];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = 1000000000;
            for (int k = i; k < j; k++) {
                int v = dp[i][k] + dp[k+1][j] + pre[j+1] - pre[i];
                if (v < dp[i][j]) dp[i][j] = v;
            }
        }
    return dp[0][n-1];
}`
  },
  points: ["必须按区间长度递增枚举，因为长区间的答案依赖短区间", "合并代价用前缀和一次算出，别在循环里再求和（会多一个 O(n)）", "环形石子合并要把数组复制一份接在后面，答案取所有长度 n 的窗口最小值"]
});

// 77. 前缀计数（字典树）
E.push({
  key: "trie-prefix", cat: "字符串", diff: "中等",
  title: p => `统计以 "${p.prefix}" 为前缀的单词数`,
  desc: p => `给定 ${p.words.length} 个单词，统计其中以 "${p.prefix}" 开头的单词个数。字典树在每个结点记录经过它的单词数，插入时沿路 +1，查询时走到前缀末尾直接返回该计数。`,
  gen: r => {
    const pool = ["cat", "car", "card", "care", "dog", "do", "dot", "a", "ab"];
    const n = 3 + r.int(5);
    const words = [];
    for (let i = 0; i < n; i++) words.push(pool[r.int(pool.length)]);
    const base = words[r.int(words.length)];
    const prefix = base.slice(0, 1 + r.int(base.length));
    return { words, prefix };
  },
  solve: p => String(p.words.filter(w => w.startsWith(p.prefix)).length),
  inputText: p => `第一行 k = ${p.words.length}\n接下来 ${p.words.length} 行每行一个单词：\n${p.words.join("\n")}\n最后一行前缀：${p.prefix}`,
  outputText: p => String(p.words.filter(w => w.startsWith(p.prefix)).length),
  code: {
    cpp: `struct Trie {
    int ch[100005][26] = {0}, cnt[100005] = {0}, tot = 0;
    void insert(const string& s) {
        int u = 0;
        for (char c : s) {
            int& v = ch[u][c - 'a'];
            if (!v) v = ++tot;
            u = v;
            cnt[u]++;                 // 经过该结点即计数
        }
    }
    int query(const string& p) {
        int u = 0;
        for (char c : p) {
            u = ch[u][c - 'a'];
            if (!u) return 0;         // 前缀不存在
        }
        return cnt[u];
    }
};`,
    py: `class Trie:
    def __init__(self):
        self.ch = {}
        self.cnt = 0

    def insert(self, s):
        node = self
        for c in s:
            node = node.ch.setdefault(c, Trie())
            node.cnt += 1

    def query(self, p):
        node = self
        for c in p:
            node = node.ch.get(c)
            if node is None:
                return 0
        return node.cnt`,
    java: `static class Trie {
    Trie[] ch = new Trie[26];
    int cnt = 0;
    void insert(String s) {
        Trie u = this;
        for (char c : s.toCharArray()) {
            if (u.ch[c - 'a'] == null) u.ch[c - 'a'] = new Trie();
            u = u.ch[c - 'a'];
            u.cnt++;
        }
    }
    int query(String p) {
        Trie u = this;
        for (char c : p.toCharArray()) {
            u = u.ch[c - 'a'];
            if (u == null) return 0;
        }
        return u.cnt;
    }
}`,
    c: `int ch[100005][26], cnt2[100005], tot = 0;
void insertWord(const char* s) {
    int u = 0;
    for (int i = 0; s[i]; i++) {
        int c = s[i] - 'a';
        if (!ch[u][c]) ch[u][c] = ++tot;
        u = ch[u][c];
        cnt2[u]++;
    }
}
int queryPrefix(const char* p) {
    int u = 0;
    for (int i = 0; p[i]; i++) {
        u = ch[u][p[i] - 'a'];
        if (!u) return 0;
    }
    return cnt2[u];
}`
  },
  points: ["cnt 记在「经过的结点」上，所以插入时每走一步都要 +1（不是只在末尾 +1）", "查询要在前缀走完后立刻返回计数，不要继续往下搜（那样退化成 DFS）", "多组测试数据要重置 tot 与根结点，否则上一组的前缀会污染结果"]
});

// 78. KMP 首次匹配
E.push({
  key: "kmp-first", cat: "字符串", diff: "困难",
  title: p => `模式串首次出现位置（"${p.p}" in "${p.s}"）`,
  desc: p => `在主串 "${p.s}" 中找模式串 "${p.p}" 第一次出现的下标（0 起），不存在输出 -1。KMP 先求 next（最长相等前后缀）数组，失配时按 next 回退，复杂度 O(n+m)，比暴力快在「主串指针不回退」。`,
  gen: r => {
    const mk = (len, alpha) => Array.from({ length: len }, () => alpha[r.int(alpha.length)]).join("");
    return { s: mk(6 + r.int(9), "ab"), p: mk(2 + r.int(3), "ab") };
  },
  solve: p => String(kmpFirst(p.s, p.p)),
  inputText: p => `第一行主串 s = ${p.s}\n第二行模式串 p = ${p.p}`,
  outputText: p => String(kmpFirst(p.s, p.p)),
  code: {
    cpp: `vector<int> buildNext(const string& p) {
    vector<int> nx(p.size(), 0);
    for (int i = 1, k = 0; i < (int)p.size(); i++) {
        while (k && p[i] != p[k]) k = nx[k-1];
        if (p[i] == p[k]) k++;
        nx[i] = k;
    }
    return nx;
}
int kmp(const string& s, const string& p) {
    auto nx = buildNext(p);
    for (int i = 0, k = 0; i < (int)s.size(); i++) {
        while (k && s[i] != p[k]) k = nx[k-1];
        if (s[i] == p[k]) k++;
        if (k == (int)p.size()) return i - k + 1;
    }
    return -1;
}`,
    py: `def build_next(p):
    nx = [0] * len(p)
    k = 0
    for i in range(1, len(p)):
        while k and p[i] != p[k]:
            k = nx[k-1]
        if p[i] == p[k]:
            k += 1
        nx[i] = k
    return nx

def kmp(s, p):
    if not p:
        return 0
    nx = build_next(p)
    k = 0
    for i, c in enumerate(s):
        while k and c != p[k]:
            k = nx[k-1]
        if c == p[k]:
            k += 1
        if k == len(p):
            return i - len(p) + 1
    return -1`,
    java: `static int kmp(String s, String p) {
    int n = s.length(), m = p.length();
    if (m == 0) return 0;
    int[] nx = new int[m];
    for (int i = 1, k = 0; i < m; i++) {
        while (k > 0 && p.charAt(i) != p.charAt(k)) k = nx[k-1];
        if (p.charAt(i) == p.charAt(k)) k++;
        nx[i] = k;
    }
    for (int i = 0, k = 0; i < n; i++) {
        while (k > 0 && s.charAt(i) != p.charAt(k)) k = nx[k-1];
        if (s.charAt(i) == p.charAt(k)) k++;
        if (k == m) return i - m + 1;
    }
    return -1;
}`,
    c: `int kmp(const char* s, const char* p) {
    int n = strlen(s), m = strlen(p), nx[100005], k = 0;
    if (m == 0) return 0;
    nx[0] = 0;
    for (int i = 1; i < m; i++) {
        while (k && p[i] != p[k]) k = nx[k-1];
        if (p[i] == p[k]) k++;
        nx[i] = k;
    }
    k = 0;
    for (int i = 0; i < n; i++) {
        while (k && s[i] != p[k]) k = nx[k-1];
        if (s[i] == p[k]) k++;
        if (k == m) return i - m + 1;
    }
    return -1;
}`
  },
  points: ["next[i] 表示 p[0..i] 的最长相等前后缀长度，失配时回退到 nx[k-1] 而不是 k-1", "求 next 时的 while 与匹配时的 while 写法结构一致，但比较对象是模式串自己", "要统计所有出现位置时，匹配成功后令 k = nx[k-1] 继续而不是返回"]
});

// 79. 网格最短路
E.push({
  key: "grid-bfs", cat: "图论", diff: "中等",
  title: p => `网格最短步数（${p.n} × ${p.n}）`,
  desc: p => `一个 ${p.n} × ${p.n} 的网格，0 可通行、1 是障碍，从左上角走到右下角，每步上下左右移动，求最少步数，不可达输出 -1。边权全为 1 → BFS 一次搜索即可，不能用 DFS。`,
  gen: r => {
    const n = 3 + r.int(3);
    const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (r.int(4) === 0 ? 1 : 0)));
    g[0][0] = 0; g[n - 1][n - 1] = 0;
    return { n, g };
  },
  solve: p => String(gridBfs(p.g)),
  inputText: p => `第一行 n = ${p.n}\n接下来 ${p.n} 行每行 ${p.n} 个 0/1（0 可走，1 障碍）：\n${p.g.map(row => row.join(" ")).join("\n")}`,
  outputText: p => String(gridBfs(p.g)),
  code: {
    cpp: `int shortestPath(vector<vector<int>>& g) {
    int n = g.size(), m = g[0].size();
    if (g[0][0]) return -1;
    vector<vector<int>> dist(n, vector<int>(m, -1));
    queue<pair<int,int>> q;
    dist[0][0] = 0; q.push({0, 0});
    int dx[4] = {1,-1,0,0}, dy[4] = {0,0,1,-1};
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
            if (g[nx][ny] || dist[nx][ny] != -1) continue;
            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }
    return dist[n-1][m-1];
}`,
    py: `from collections import deque

def shortest_path(g):
    n, m = len(g), len(g[0])
    if g[0][0]:
        return -1
    dist = [[-1] * m for _ in range(n)]
    dist[0][0] = 0
    q = deque([(0, 0)])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < m and not g[nx][ny] and dist[nx][ny] < 0:
                dist[nx][ny] = dist[x][y] + 1
                q.append((nx, ny))
    return dist[n-1][m-1]`,
    java: `static int shortestPath(int[][] g) {
    int n = g.length, m = g[0].length;
    if (g[0][0] == 1) return -1;
    int[][] dist = new int[n][m];
    for (int[] row : dist) Arrays.fill(row, -1);
    Deque<int[]> q = new ArrayDeque<>();
    dist[0][0] = 0;
    q.offer(new int[]{0, 0});
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        for (int[] d : dirs) {
            int x = cur[0] + d[0], y = cur[1] + d[1];
            if (x < 0 || y < 0 || x >= n || y >= m) continue;
            if (g[x][y] == 1 || dist[x][y] != -1) continue;
            dist[x][y] = dist[cur[0]][cur[1]] + 1;
            q.offer(new int[]{x, y});
        }
    }
    return dist[n-1][m-1];
}`,
    c: `int shortestPath(int g[105][105], int n, int m) {
    int dist[105][105], qx[10005], qy[10005];
    for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) dist[i][j] = -1;
    if (g[0][0]) return -1;
    int h = 0, t = 0;
    dist[0][0] = 0; qx[t] = 0; qy[t] = 0; t++;
    int dx[4] = {1,-1,0,0}, dy[4] = {0,0,1,-1};
    while (h < t) {
        int x = qx[h], y = qy[h]; h++;
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
            if (g[nx][ny] || dist[nx][ny] != -1) continue;
            dist[nx][ny] = dist[x][y] + 1;
            qx[t] = nx; qy[t] = ny; t++;
        }
    }
    return dist[n-1][m-1];
}`
  },
  points: ["无权图最短路必须用 BFS，DFS 找到的路径不保证最短", "入队时就标记访问（dist != -1），出队再标记会让同一格子被多次入队", "起点就是障碍时直接返回 -1，别让 BFS 从非法状态出发"]
});

// 80. 岛屿数量
E.push({
  key: "island-count", cat: "图论", diff: "中等",
  title: p => `岛屿数量（${p.n} × ${p.m}）`,
  desc: p => `0/1 网格中，上下左右相邻的 1 连成一块，求连通块（岛屿）数量。对每个未访问的 1 做一次 DFS/BFS 并标记整个连通块，计数即答案。`,
  gen: r => {
    const n = 3 + r.int(4), m = 3 + r.int(4);
    return { n, m, g: Array.from({ length: n }, () => Array.from({ length: m }, () => (r.int(5) < 2 ? 1 : 0))) };
  },
  solve: p => String(islandCount(p.g)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.n} 行每行 ${p.m} 个 0/1：\n${p.g.map(row => row.join(" ")).join("\n")}`,
  outputText: p => String(islandCount(p.g)),
  code: {
    cpp: `int numIslands(vector<vector<int>>& g) {
    int n = g.size(), m = g[0].size(), cnt = 0;
    function<void(int,int)> dfs = [&](int i, int j) {
        if (i < 0 || j < 0 || i >= n || j >= m || g[i][j] == 0) return;
        g[i][j] = 0;                       // 淹掉，兼作访问标记
        dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1);
    };
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j]) { cnt++; dfs(i, j); }
    return cnt;
}`,
    py: `def num_islands(g):
    n, m = len(g), len(g[0])
    cnt = 0
    def dfs(i, j):
        if not (0 <= i < n and 0 <= j < m) or g[i][j] == 0:
            return
        g[i][j] = 0        # 标记已访问
        for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
            dfs(i + di, j + dj)
    for i in range(n):
        for j in range(m):
            if g[i][j]:
                cnt += 1
                dfs(i, j)
    return cnt`,
    java: `static int numIslands(int[][] g) {
    int n = g.length, m = g[0].length, cnt = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == 1) { cnt++; dfs(g, i, j); }
    return cnt;
}
static void dfs(int[][] g, int i, int j) {
    if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] == 0) return;
    g[i][j] = 0;
    dfs(g, i+1, j); dfs(g, i-1, j); dfs(g, i, j+1); dfs(g, i, j-1);
}`,
    c: `void dfs(int g[105][105], int n, int m, int i, int j) {
    if (i < 0 || j < 0 || i >= n || j >= m || g[i][j] == 0) return;
    g[i][j] = 0;
    dfs(g, n, m, i+1, j); dfs(g, n, m, i-1, j);
    dfs(g, n, m, i, j+1); dfs(g, n, m, i, j-1);
}
int numIslands(int g[105][105], int n, int m) {
    int cnt = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j]) { cnt++; dfs(g, n, m, i, j); }
    return cnt;
}`
  },
  points: ["把 1 改成 0 当访问标记最省空间，但会破坏原数组，需要保留就另开 visited", "网格很大时递归 DFS 会爆栈，改 BFS 或用并查集", "若 1 只按对角线相邻也算连通（8 方向），把四个方向扩成八个即可"]
});

// 81. 大数加法
E.push({
  key: "bigint-add", cat: "字符串", diff: "中等",
  title: p => `大整数加法（${p.a.length} 位 + ${p.b.length} 位）`,
  desc: p => `两个超出 64 位的正整数以字符串给出，求它们的和。模拟竖式：从末位开始逐位相加并处理进位，最后反转结果。这是 C/C++ 里没有大整数类型时的标准做法。`,
  gen: r => {
    const mk = len => String(1 + r.int(9)) + Array.from({ length: len - 1 }, () => r.int(10)).join("");
    return { a: mk(10 + r.int(15)), b: mk(10 + r.int(15)) };
  },
  solve: p => bigAdd(p.a, p.b),
  inputText: p => `第一行整数 A = ${p.a}\n第二行整数 B = ${p.b}`,
  outputText: p => bigAdd(p.a, p.b),
  code: {
    cpp: `string addBig(const string& a, const string& b) {
    string res;
    int i = a.size() - 1, j = b.size() - 1, carry = 0;
    while (i >= 0 || j >= 0 || carry) {
        int s = carry;
        if (i >= 0) s += a[i--] - '0';
        if (j >= 0) s += b[j--] - '0';
        res.push_back('0' + s % 10);
        carry = s / 10;
    }
    reverse(res.begin(), res.end());
    return res;
}`,
    py: `def add_big(a, b):
    i, j, carry, out = len(a) - 1, len(b) - 1, 0, []
    while i >= 0 or j >= 0 or carry:
        s = carry
        if i >= 0:
            s += int(a[i]); i -= 1
        if j >= 0:
            s += int(b[j]); j -= 1
        out.append(str(s % 10))
        carry = s // 10
    return "".join(reversed(out))`,
    java: `static String addBig(String a, String b) {
    StringBuilder sb = new StringBuilder();
    int i = a.length() - 1, j = b.length() - 1, carry = 0;
    while (i >= 0 || j >= 0 || carry > 0) {
        int s = carry;
        if (i >= 0) s += a.charAt(i--) - '0';
        if (j >= 0) s += b.charAt(j--) - '0';
        sb.append((char) ('0' + s % 10));
        carry = s / 10;
    }
    return sb.reverse().toString();
}`,
    c: `void addBig(const char* a, const char* b, char* out) {
    int i = strlen(a) - 1, j = strlen(b) - 1, k = 0, carry = 0;
    while (i >= 0 || j >= 0 || carry) {
        int s = carry;
        if (i >= 0) s += a[i--] - '0';
        if (j >= 0) s += b[j--] - '0';
        out[k++] = '0' + s % 10;
        carry = s / 10;
    }
    for (int t = 0; t < k / 2; t++) { char c = out[t]; out[t] = out[k-1-t]; out[k-1-t] = c; }
    out[k] = 0;
}`
  },
  points: ["循环条件要带上 carry，否则最高位的进位会丢（如 99 + 1 = 100）", "结果是从低位往上追加的，最后必须反转", "减法要处理借位与「结果为负」，乘法是双重循环 + 进位，模板结构类似"]
});

// 82. 最小覆盖子串
E.push({
  key: "min-window", cat: "滑动窗口", diff: "困难",
  title: p => `最小覆盖子串长度（s = "${p.s}", t = "${p.t}"）`,
  desc: p => `在 "${p.s}" 中找出包含 "${p.t}" 全部字符（含重复次数）的最短子串，输出其长度，不存在输出 -1。滑动窗口：右指针扩张到满足条件，再收缩左指针求最短，用 need 计数判断是否覆盖。`,
  gen: r => {
    const mk = (len, alpha) => Array.from({ length: len }, () => alpha[r.int(alpha.length)]).join("");
    const t = Array.from(new Set(mk(1 + r.int(2), "abc"))).join("");
    return { s: mk(6 + r.int(9), "abc"), t };
  },
  solve: p => String(minWindow(p.s, p.t)),
  inputText: p => `第一行字符串 s = ${p.s}\n第二行字符串 t = ${p.t}`,
  outputText: p => String(minWindow(p.s, p.t)),
  code: {
    cpp: `int minWindow(const string& s, const string& t) {
    unordered_map<char,int> need;
    for (char c : t) need[c]++;
    int missing = t.size(), l = 0, best = INT_MAX;
    for (int r = 0; r < (int)s.size(); r++) {
        if (need[s[r]] > 0) missing--;     // 这个字符还有缺口
        need[s[r]]--;                       // 负数表示多余
        while (missing == 0) {               // 已覆盖，试着收缩
            best = min(best, r - l + 1);
            need[s[l]]++;
            if (need[s[l]] > 0) missing++;
            l++;
        }
    }
    return best == INT_MAX ? -1 : best;
}`,
    py: `from collections import Counter

def min_window(s, t):
    need = Counter(t)
    missing, l, best = len(t), 0, float('inf')
    for r, c in enumerate(s):
        if need[c] > 0:
            missing -= 1
        need[c] -= 1
        while missing == 0:
            best = min(best, r - l + 1)
            need[s[l]] += 1
            if need[s[l]] > 0:
                missing += 1
            l += 1
    return -1 if best == float('inf') else best`,
    java: `static int minWindow(String s, String t) {
    int[] need = new int[128];
    for (char c : t.toCharArray()) need[c]++;
    int missing = t.length(), l = 0, best = Integer.MAX_VALUE;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        if (need[c] > 0) missing--;
        need[c]--;
        while (missing == 0) {
            best = Math.min(best, r - l + 1);
            char lc = s.charAt(l);
            need[lc]++;
            if (need[lc] > 0) missing++;
            l++;
        }
    }
    return best == Integer.MAX_VALUE ? -1 : best;
}`,
    c: `int minWindow(const char* s, const char* t) {
    int need[128] = {0}, m = strlen(t), missing = m, l = 0, best = 1000000000;
    for (int i = 0; t[i]; i++) need[(int)t[i]]++;
    for (int r = 0; s[r]; r++) {
        if (need[(int)s[r]] > 0) missing--;
        need[(int)s[r]]--;
        while (missing == 0) {
            if (r - l + 1 < best) best = r - l + 1;
            need[(int)s[l]]++;
            if (need[(int)s[l]] > 0) missing++;
            l++;
        }
    }
    return best == 1000000000 ? -1 : best;
}`
  },
  points: ["need 计数允许为负，负数代表窗口内该字符「多出来的」，收缩时正好还回去", "missing == 0 才收缩，收缩用 while 而不是 if（一次可以连缩多步）", "要返回具体子串而不只是长度，收缩时记录最优的 l 即可"]
});

module.exports = { TYPES_E };
