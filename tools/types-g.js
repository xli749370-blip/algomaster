// 题型模板库 G（102-120）：贪心 / DP 经典 / 数论 / 位运算 / 字符串 / 模拟

const TYPES_G = [];
const G = TYPES_G;

// ============ 公共实现（solve 与 outputText 共用） ============

function gasStart(gas, cost) {
  const n = gas.length;
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < n; i++) {
    total += gas[i] - cost[i];
    tank += gas[i] - cost[i];
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total >= 0 ? start % n : -1;
}

function taskCoolTime(counts, n) {
  const total = counts.reduce((s, x) => s + x, 0);
  const maxC = Math.max(...counts);
  let numMax = 0;
  for (const c of counts) if (c === maxC) numMax++;
  return Math.max(total, (maxC - 1) * (n + 1) + numMax);
}

function candyTotal(r) {
  const n = r.length;
  const c = Array(n).fill(1);
  for (let i = 1; i < n; i++) if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;
  for (let i = n - 2; i >= 0; i--) if (r[i] > r[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
  return c.reduce((s, x) => s + x, 0);
}

function stockMulti(p) {
  let s = 0;
  for (let i = 1; i < p.length; i++) if (p[i] > p[i - 1]) s += p[i] - p[i - 1];
  return s;
}

function lcsLen(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[n][m];
}

function lisLen(a) {
  const n = a.length;
  const dp = Array(n).fill(1);
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    if (dp[i] > best) best = dp[i];
  }
  return best;
}

function coinComb(coins, amount) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) for (let j = c; j <= amount; j++) dp[j] += dp[j - c];   // 外层硬币避免重复计数
  return dp[amount];
}

function palindromeCut(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--)
    for (let j = i; j < n; j++)
      isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
  const dp = Array(n).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] === Infinity) continue;
    for (let j = i; j < n; j++)
      if (isPal[i][j]) {
        if (j === n - 1) dp[n] = Math.min(dp[n] === undefined ? Infinity : dp[n], dp[i]);
        else dp[j + 1] = Math.min(dp[j + 1], dp[i] + 1);
      }
  }
  const res = Array(n + 1).fill(Infinity);
  res[0] = 0;
  for (let i = 0; i < n; i++)
    if (res[i] !== Infinity)
      for (let j = i; j < n; j++) if (isPal[i][j]) res[j + 1] = Math.min(res[j + 1], res[i] + (j + 1 < n ? 1 : 0));
  return res[n];
}

function wordBreak(s, dict) {
  const n = s.length;
  const dp = Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++)
    for (const w of dict)
      if (i >= w.length && dp[i - w.length] && s.slice(i - w.length, i) === w) { dp[i] = true; break; }
  return dp[n];
}

function matrixChain(p) {
  const n = p.length - 1;   // 矩阵个数
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++)
        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]);
    }
  return n ? dp[0][n - 1] : 0;
}

function powMod(b, e, mod) {
  let r = 1;
  b %= mod;
  while (e > 0) {
    if (e & 1) r = (r * b) % mod;
    b = (b * b) % mod;
    e >>= 1;
  }
  return r;
}

function primeCount(n) {
  const mark = Array(n + 1).fill(true);
  mark[0] = mark[1] = false;
  for (let i = 2; i * i <= n; i++) if (mark[i]) for (let j = i * i; j <= n; j += i) mark[j] = false;
  let c = 0;
  for (let i = 2; i <= n; i++) if (mark[i]) c++;
  return c;
}

const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };

function gcdRange(a, qs) {
  return qs.map(([l, r]) => { let g = a[l]; for (let i = l + 1; i <= r; i++) g = gcd(g, a[i]); return g; });
}

function reverseBits32(x) {
  let r = 0;
  for (let i = 0; i < 32; i++) {
    r = (r << 1) | ((x >>> i) & 1);
  }
  return r >>> 0;
}

function countOccur(text, pat) {
  let c = 0;
  for (let i = 0; i + pat.length <= text.length; i++) if (text.slice(i, i + pat.length) === pat) c++;
  return c;
}

function longestPalindrome(s) {
  if (!s.length) return 0;
  let best = 1;
  for (let c = 0; c < s.length; c++) {
    for (const [l0, r0] of [[c, c], [c, c + 1]]) {
      let l = l0, r = r0;
      while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
      best = Math.max(best, r - l - 1);
    }
  }
  return best;
}

function robotFinal(cmds, k) {
  let x = 0, y = 0;
  for (let t = 0; t < k; t++)
    for (const c of cmds) {
      if (c === "L") x--;
      else if (c === "R") x++;
      else if (c === "U") y++;
      else if (c === "D") y--;
    }
  return `${x} ${y}`;
}

function twoStackQueue(ops) {
  const inBox = [], outBox = [], res = [];
  for (const op of ops) {
    if (op[0] === "push") inBox.push(op[1]);
    else {
      if (!outBox.length) while (inBox.length) outBox.push(inBox.pop());
      res.push(outBox.length ? String(outBox.pop()) : "empty");
    }
  }
  return res;
}

function countOnesUpto(n) {
  let c = 0;
  for (let i = 0; i <= n; i++) { let x = i; while (x) { x &= x - 1; c++; } }
  return c;
}

// ============================== 102. 加油站 ==============================
G.push({
  key: "greedy-gas-station", cat: "贪心", diff: "中等",
  title: p => `加油站（${p.gas.length} 个站点）`,
  desc: p => `环路上有 ${p.gas.length} 个加油站，各站油量为 [${p.gas.join(", ")}]，到下一站的耗油为 [${p.cost.join(", ")}]。求能绕环路一周的出发站编号，无解输出 -1。贪心：一路累加油量，一旦油箱为负说明「从当前起点到此处」都不能作为起点，起点直接跳到下一站，总复杂度 O(n)。`,
  gen: r => {
    const n = 4 + r.int(5);
    const gas = Array.from({ length: n }, () => r.int(10));
    const cost = Array.from({ length: n }, () => r.int(10));
    return { n, gas, cost };
  },
  solve: p => String(gasStart(p.gas, p.cost)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数（各站油量）：${p.gas.join(" ")}\n第三行 ${p.n} 个整数（各段耗油）：${p.cost.join(" ")}`,
  outputText: p => String(gasStart(p.gas, p.cost)),
  code: {
    cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        total += gas[i] - cost[i];
        tank  += gas[i] - cost[i];
        if (tank < 0) { start = i + 1; tank = 0; }   // 之前所有站都不可能是起点
    }
    return total >= 0 ? start : -1;
}`,
    py: `def can_complete_circuit(gas, cost):
    total = tank = start = 0
    for i in range(len(gas)):
        total += gas[i] - cost[i]
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1`,
    java: `static int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        total += gas[i] - cost[i];
        tank += gas[i] - cost[i];
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`,
    c: `int canCompleteCircuit(const int* gas, const int* cost, int n) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < n; i++) {
        total += gas[i] - cost[i];
        tank += gas[i] - cost[i];
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`
  },
  points: ["总油量小于总耗油时一定无解，这一条可以先判", "油箱为负时起点跳到 i+1 而不是 i，因为从 i 出发本身就不成立", "题目保证解唯一，所以不用回头验证；不保证唯一时要在末尾再跑一遍确认"]
});

// ============================== 103. 任务调度冷却 ==============================
G.push({
  key: "greedy-task-cool", cat: "贪心", diff: "困难",
  title: p => `任务调度（频次 ${p.counts.join("/")}，冷却 ${p.n}）`,
  desc: p => `某类任务共 ${p.counts.reduce((s, x) => s + x, 0)} 个，同类任务之间至少间隔 ${p.n} 个时间单位。求完成全部任务的最短时间。公式：设最高频次为 M、达到 M 的任务有 c 种，则答案是 max(总数, (M-1)*(n+1)+c)——空位够就用「按频次排格子」，不够就直接连续执行。`,
  gen: r => {
    const k = 2 + r.int(3);
    return { counts: Array.from({ length: k }, () => 1 + r.int(4)), n: 1 + r.int(2) };
  },
  solve: p => String(taskCoolTime(p.counts, p.n)),
  inputText: p => `第一行 k = ${p.counts.length}, 冷却 n = ${p.n}\n第二行 ${p.counts.length} 个整数（每类任务的个数）：${p.counts.join(" ")}`,
  outputText: p => String(taskCoolTime(p.counts, p.n)),
  code: {
    cpp: `int leastInterval(vector<int>& tasks, int n) {
    vector<int> cnt(26, 0);
    for (int t : tasks) cnt[t - 'A']++;
    int mx = *max_element(cnt.begin(), cnt.end());
    int numMax = count(cnt.begin(), cnt.end(), mx);
    int total = tasks.size();
    return max(total, (mx - 1) * (n + 1) + numMax);
}`,
    py: `from collections import Counter

def least_interval(tasks, n):
    cnt = Counter(tasks)
    mx = max(cnt.values())
    num_max = sum(1 for v in cnt.values() if v == mx)
    return max(len(tasks), (mx - 1) * (n + 1) + num_max)`,
    java: `static int leastInterval(char[] tasks, int n) {
    int[] cnt = new int[26];
    for (char c : tasks) cnt[c - 'A']++;
    int mx = 0;
    for (int v : cnt) mx = Math.max(mx, v);
    int numMax = 0;
    for (int v : cnt) if (v == mx) numMax++;
    return Math.max(tasks.length, (mx - 1) * (n + 1) + numMax);
}`,
    c: `int leastInterval(const char* tasks, int len, int n) {
    int cnt[26] = {0}, mx = 0, numMax = 0;
    for (int i = 0; i < len; i++) if (++cnt[tasks[i] - 'A'] > mx) mx = cnt[tasks[i] - 'A'];
    for (int i = 0; i < 26; i++) if (cnt[i] == mx) numMax++;
    int gongshi = (mx - 1) * (n + 1) + numMax;
    return gongshi > len ? gongshi : len;
}`
  },
  points: ["公式里的 c 是「频次等于最大值的任务种数」，不是任务总数", "总数比公式算出的空位排布还大时直接取总数，说明任务多到不用等冷却", "冷却 n = 0 时公式退化成最大值，答案就是任务总数"]
});

// ============================== 104. 分发糖果 ==============================
G.push({
  key: "greedy-candy", cat: "贪心", diff: "困难",
  title: p => `分发糖果（${p.r.length} 个孩子）`,
  desc: p => `孩子评分 ${p.r.join(" ")}，相邻两个孩子中评分高的必须拿到更多糖果，每人至少 1 颗，求最少总糖果数。两遍贪心：从左到右处理「比左边高」，再从右到左处理「比右边高」并取较大值。`,
  gen: r => ({ r: Array.from({ length: 5 + r.int(5) }, () => 1 + r.int(8)) }),
  solve: p => String(candyTotal(p.r)),
  inputText: p => `第一行 n = ${p.r.length}\n第二行 ${p.r.length} 个整数（评分）：${p.r.join(" ")}`,
  outputText: p => String(candyTotal(p.r)),
  code: {
    cpp: `int candy(vector<int>& r) {
    int n = r.size();
    vector<int> c(n, 1);
    for (int i = 1; i < n; i++) if (r[i] > r[i-1]) c[i] = c[i-1] + 1;              // 左 -> 右
    for (int i = n - 2; i >= 0; i--) if (r[i] > r[i+1]) c[i] = max(c[i], c[i+1] + 1); // 右 -> 左
    int s = 0;
    for (int v : c) s += v;
    return s;
}`,
    py: `def candy(r):
    n = len(r)
    c = [1] * n
    for i in range(1, n):
        if r[i] > r[i - 1]:
            c[i] = c[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if r[i] > r[i + 1]:
            c[i] = max(c[i], c[i + 1] + 1)
    return sum(c)`,
    java: `static int candy(int[] r) {
    int n = r.length;
    int[] c = new int[n];
    Arrays.fill(c, 1);
    for (int i = 1; i < n; i++) if (r[i] > r[i-1]) c[i] = c[i-1] + 1;
    for (int i = n - 2; i >= 0; i--) if (r[i] > r[i+1]) c[i] = Math.max(c[i], c[i+1] + 1);
    int s = 0;
    for (int v : c) s += v;
    return s;
}`,
    c: `int candy(const int* r, int n) {
    int c[100005];
    for (int i = 0; i < n; i++) c[i] = 1;
    for (int i = 1; i < n; i++) if (r[i] > r[i-1]) c[i] = c[i-1] + 1;
    for (int i = n - 2; i >= 0; i--) if (r[i] > r[i+1] && c[i+1] + 1 > c[i]) c[i] = c[i+1] + 1;
    int s = 0;
    for (int i = 0; i < n; i++) s += c[i];
    return s;
}`
  },
  points: ["第二遍必须取 max(c[i], c[i+1]+1)，直接赋值会把第一遍的结果覆盖掉", "一遍循环无法同时兼顾左右两侧，这是这道题最容易踩的坑", "总糖果数可能达到 O(n²)，n 大时求和要用 long long"]
});

// ============================== 105. 多次买卖股票 ==============================
G.push({
  key: "greedy-stock-multi", cat: "贪心", diff: "简单",
  title: p => `买卖股票的最佳时机 II（${p.prices.length} 天）`,
  desc: p => `价格序列 ${p.prices.join(" ")}，可以多次买入卖出（同一时刻只能持有一股），求最大利润。关键观察：把所有上涨区间的涨幅加起来就是答案——每一次「今天比昨天贵」都等价于低买高卖，贪心即最优。`,
  gen: r => ({ prices: Array.from({ length: 6 + r.int(6) }, () => 1 + r.int(30)) }),
  solve: p => String(stockMulti(p.prices)),
  inputText: p => `第一行 n = ${p.prices.length}\n第二行 ${p.prices.length} 个整数（每日价格）：${p.prices.join(" ")}`,
  outputText: p => String(stockMulti(p.prices)),
  code: {
    cpp: `int maxProfit(vector<int>& p) {
    int sum = 0;
    for (int i = 1; i < (int)p.size(); i++)
        if (p[i] > p[i-1]) sum += p[i] - p[i-1];   // 每个上涨段都收下
    return sum;
}`,
    py: `def max_profit(prices):
    return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))`,
    java: `static int maxProfit(int[] p) {
    int sum = 0;
    for (int i = 1; i < p.length; i++) if (p[i] > p[i-1]) sum += p[i] - p[i-1];
    return sum;
}`,
    c: `int maxProfit(const int* p, int n) {
    int sum = 0;
    for (int i = 1; i < n; i++) if (p[i] > p[i-1]) sum += p[i] - p[i-1];
    return sum;
}`
  },
  points: ["与「只能买卖一次」区别很大：那题用 min 维护前缀最低价，这题直接收上涨段", "连续上涨段拆成多笔交易利润相同（[1,2,3] 一笔赚 2，两笔也是 2），这是贪心成立的依据", "含手续费或含冷冻期时贪心不再成立，必须回归 DP 状态机"]
});

// ============================== 106. 最长公共子序列 ==============================
G.push({
  key: "dp-lcs", cat: "DP", diff: "中等",
  title: p => `最长公共子序列（"${p.a}" 与 "${p.b}"）`,
  desc: p => `求两个字符串 "${p.a}" 与 "${p.b}" 的最长公共子序列长度（不必连续）。dp[i][j] 表示 a 前 i 个字符与 b 前 j 个字符的 LCS：字符相同取左上 +1，否则取上方与左方的较大值。`,
  gen: r => {
    const alpha = "ACGT";
    const mk = len => Array.from({ length: len }, () => alpha[r.int(4)]).join("");
    return { a: mk(4 + r.int(5)), b: mk(4 + r.int(5)) };
  },
  solve: p => String(lcsLen(p.a, p.b)),
  inputText: p => `第一行字符串 a：${p.a}\n第二行字符串 b：${p.b}`,
  outputText: p => String(lcsLen(p.a, p.b)),
  code: {
    cpp: `int lcs(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1] + 1
                                          : max(dp[i-1][j], dp[i][j-1]);
    return dp[n][m];
}`,
    py: `def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`,
    java: `static int lcs(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = a.charAt(i-1) == b.charAt(j-1)
                ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[n][m];
}`,
    c: `int lcs(const char* a, const char* b) {
    int n = strlen(a), m = strlen(b);
    static int dp[1005][1005];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1] + 1
                                          : (dp[i-1][j] > dp[i][j-1] ? dp[i-1][j] : dp[i][j-1]);
    return dp[n][m];
}`
  },
  points: ["dp 数组要多开一行一列，让 i-1 / j-1 不越界", "子序列不要求连续，所以不等时取 max 而不是清零", "空间可以用两行滚动数组从 O(nm) 降到 O(min(n,m))"]
});

// ============================== 107. 最长上升子序列 ==============================
G.push({
  key: "dp-lis", cat: "DP", diff: "中等",
  title: p => `最长上升子序列（n = ${p.a.length}）`,
  desc: p => `求数组 ${p.a.join(" ")} 的最长严格上升子序列长度。朴素 DP：dp[i] 表示以 i 结尾的最长上升长度，向前面所有更小的元素转移，O(n²)。进阶用「维护每种长度结尾的最小值」+ 二分，可以做到 O(n log n)。`,
  gen: r => ({ a: Array.from({ length: 6 + r.int(8) }, () => 1 + r.int(30)) }),
  solve: p => String(lisLen(p.a)),
  inputText: p => `第一行 n = ${p.a.length}\n第二行 ${p.a.length} 个整数：${p.a.join(" ")}`,
  outputText: p => String(lisLen(p.a)),
  code: {
    cpp: `// O(n^2) 朴素写法
int lisSlow(const vector<int>& a) {
    int n = a.size(), best = 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        best = max(best, dp[i]);
    }
    return best;
}
// O(n log n)：tails[k] = 长度 k+1 的上升子序列中结尾的最小值
int lisFast(const vector<int>& a) {
    vector<int> tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);   // 严格上升用 lower_bound
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
    py: `import bisect

def lis_length(a):
    tails = []
    for x in a:
        i = bisect.bisect_left(tails, x)   # 严格上升；非降用 bisect_right
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
    java: `static int lisLength(int[] a) {
    int[] tails = new int[a.length];
    int size = 0;
    for (int x : a) {
        int lo = 0, hi = size;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (tails[mid] < x) lo = mid + 1; else hi = mid;
        }
        tails[lo] = x;
        if (lo == size) size++;
    }
    return size;
}`,
    c: `int lisLength(const int* a, int n) {
    int tails[100005], size = 0;
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = size;
        while (lo < hi) {
            int mid = (lo + hi) >> 1;
            if (tails[mid] < a[i]) lo = mid + 1; else hi = mid;
        }
        tails[lo] = a[i];
        if (lo == size) size++;
    }
    return size;
}`
  },
  points: ["严格上升用 lower_bound，非降（允许相等）要用 upper_bound，混用会算错长度", "tails 数组本身不是某个具体的 LIS，只保证长度正确，不能直接输出它", "n 到 1e5 时 O(n²) 必然超时，必须换成二分版本"]
});

// ============================== 108. 零钱兑换组合数 ==============================
G.push({
  key: "dp-coin-comb", cat: "DP", diff: "中等",
  title: p => `零钱兑换的组合数（面额 ${p.coins.join("/")}，目标 ${p.amount}）`,
  desc: p => `用面额 ${p.coins.join("、")} 的硬币凑出 ${p.amount}，求组合种数（顺序不同算同一种）。dp[j] 表示凑出金额 j 的方案数，硬币放外层循环、金额放内层正序，这样每种硬币可以被重复使用又不会重复计数排列。`,
  gen: r => {
    const coins = [1, 2, 3, 5].filter(() => r.int(4) > 0);
    if (!coins.length) coins.push(1);
    return { coins: coins.sort((a, b) => a - b), amount: 5 + r.int(16) };
  },
  solve: p => String(coinComb(p.coins, p.amount)),
  inputText: p => `第一行硬币种数 ${p.coins.length}，目标金额 ${p.amount}\n第二行 ${p.coins.length} 个整数（面额）：${p.coins.join(" ")}`,
  outputText: p => String(coinComb(p.coins, p.amount)),
  code: {
    cpp: `int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;                              // 凑 0 元有 1 种方案：什么都不选
    for (int c : coins)                     // 硬币在外层：避免把排列当成组合
        for (int j = c; j <= amount; j++)
            dp[j] += dp[j - c];
    return dp[amount];
}`,
    py: `def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for j in range(c, amount + 1):
            dp[j] += dp[j - c]
    return dp[amount]`,
    java: `static int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int c : coins)
        for (int j = c; j <= amount; j++)
            dp[j] += dp[j - c];
    return dp[amount];
}`,
    c: `int change(int amount, const int* coins, int k) {
    int dp[100005] = {0};
    dp[0] = 1;
    for (int i = 0; i < k; i++)
        for (int j = coins[i]; j <= amount; j++)
            dp[j] += dp[j - coins[i]];
    return dp[amount];
}`
  },
  points: ["硬币在外层、金额在内层正序 = 组合数；两层交换 = 排列数，这是最容易混淆的一点", "dp[0] = 1 是递推的起点，写成 0 会导致全部结果为 0", "方案数增长很快，amount 上千时会溢出 int，要用 long long 或取模"]
});

// ============================== 109. 回文分割 ==============================
G.push({
  key: "dp-palindrome-cut", cat: "DP", diff: "困难",
  title: p => `分割回文串（"${p.s}"）`,
  desc: p => `把字符串 "${p.s}" 分割成若干回文子串，求最少分割次数。先 O(n²) 预处理 isPal[i][j]，再用 dp[i] 表示前缀 i 的最小分割数做转移；预处理后整体 O(n²)。`,
  gen: r => {
    const alpha = "abc";
    return { s: Array.from({ length: 5 + r.int(5) }, () => alpha[r.int(3)]).join("") };
  },
  solve: p => String(palindromeCut(p.s)),
  inputText: p => `第一行字符串 s：${p.s}`,
  outputText: p => String(palindromeCut(p.s)),
  code: {
    cpp: `int minCut(string s) {
    int n = s.size();
    vector<vector<bool>> pal(n, vector<bool>(n, false));
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = (s[i] == s[j]) && (j - i < 2 || pal[i+1][j-1]);
    vector<int> dp(n + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] == INT_MAX) continue;
        for (int j = i; j < n; j++)
            if (pal[i][j]) dp[j+1] = min(dp[j+1], dp[i] + (j + 1 < n ? 1 : 0));
    }
    return dp[n];
}`,
    py: `def min_cut(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
    INF = float("inf")
    dp = [INF] * (n + 1)
    dp[0] = 0
    for i in range(n):
        if dp[i] == INF:
            continue
        for j in range(i, n):
            if pal[i][j]:
                dp[j + 1] = min(dp[j + 1], dp[i] + (1 if j + 1 < n else 0))
    return dp[n]`,
    java: `static int minCut(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i+1][j-1]);
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] == Integer.MAX_VALUE) continue;
        for (int j = i; j < n; j++)
            if (pal[i][j]) dp[j+1] = Math.min(dp[j+1], dp[i] + (j + 1 < n ? 1 : 0));
    }
    return dp[n];
}`,
    c: `int minCut(const char* s) {
    int n = strlen(s);
    static int pal[505][505];
    static int dp[505];
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = (s[i] == s[j]) && (j - i < 2 || pal[i+1][j-1]);
    for (int i = 0; i <= n; i++) dp[i] = 1e9;
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] == 1e9) continue;
        for (int j = i; j < n; j++)
            if (pal[i][j]) {
                int cand = dp[i] + (j + 1 < n ? 1 : 0);
                if (cand < dp[j+1]) dp[j+1] = cand;
            }
    }
    return dp[n];
}`
  },
  points: ["isPal 要按 i 从大到小推，否则 pal[i+1][j-1] 还没算出来", "最后一段回文串后面不需要再加一次分割，所以末尾要特殊处理", "n 到 2000 时 O(n²) 空间吃紧，可以用中心扩展把空间降到 O(n)"]
});

// ============================== 110. 单词拆分 ==============================
G.push({
  key: "dp-word-break", cat: "DP", diff: "中等",
  title: p => `单词拆分（"${p.s}"，词典 ${p.dict.length} 词）`,
  desc: p => `判断 "${p.s}" 能否由词典 {${p.dict.join(", ")}} 中的单词拼接而成（单词可重复使用）。dp[i] 表示前缀 i 能否拆分，枚举每个词做转移：dp[i] 为真当且仅当存在词 w 使 dp[i-|w|] 为真且尾部恰好是 w。`,
  gen: r => {
    const pool = ["ab", "a", "b", "c", "abab"];
    const dict = pool.filter(() => r.int(3) > 0);
    if (!dict.length) dict.push("a");
    let s = "";
    if (r.int(10) < 7) {
      for (let k = 0, c = 2 + r.int(3); k < c; k++) s += dict[r.int(dict.length)];
    } else {
      for (let k = 0, c = 5 + r.int(4); k < c; k++) s += "abc"[r.int(3)];
    }
    return { s: s || "a", dict };
  },
  solve: p => (wordBreak(p.s, p.dict) ? "true" : "false"),
  inputText: p => `第一行字符串 s：${p.s}\n第二行词典：${p.dict.join(" ")}`,
  outputText: p => (wordBreak(p.s, p.dict) ? "true" : "false"),
  code: {
    cpp: `bool wordBreak(string s, vector<string>& dict) {
    int n = s.size();
    vector<bool> dp(n + 1, false);
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (const string& w : dict) {
            int L = w.size();
            if (i >= L && dp[i - L] && s.compare(i - L, L, w) == 0) { dp[i] = true; break; }
        }
    return dp[n];
}`,
    py: `def word_break(s, words):
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for w in words:
            if i >= len(w) and dp[i - len(w)] and s[i - len(w):i] == w:
                dp[i] = True
                break
    return dp[n]`,
    java: `static boolean wordBreak(String s, List<String> dict) {
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (String w : dict) {
            int L = w.length();
            if (i >= L && dp[i - L] && s.regionMatches(i - L, w, 0, L)) { dp[i] = true; break; }
        }
    return dp[n];
}`,
    c: `int wordBreak(const char* s, char words[][20], int k) {
    int n = strlen(s);
    int dp[1005] = {0};
    dp[0] = 1;
    for (int i = 1; i <= n; i++)
        for (int t = 0; t < k; t++) {
            int L = strlen(words[t]);
            if (i >= L && dp[i - L] && strncmp(s + i - L, words[t], L) == 0) { dp[i] = 1; break; }
        }
    return dp[n];
}`
  },
  points: ["dp 定义在「前缀」上，转移看的是尾部是否匹配某个单词", "找到一条可行拆分就要 break，继续枚举只会浪费时间", "词典含单字符时大量状态可用，注意内层循环顺序会影响常数但不影响正确性"]
});

// ============================== 111. 矩阵链乘法 ==============================
G.push({
  key: "dp-matrix-chain", cat: "DP", diff: "困难",
  title: p => `矩阵链乘法的乘法次数（${p.p.length - 1} 个矩阵，维度 ${p.p.join("×")}）`,
  desc: p => `矩阵链维度为 ${p.p.join(" × ")}（共 ${p.p.length - 1} 个矩阵），求标量乘法的最少次数。区间 DP：dp[i][j] 表示第 i 到第 j 个矩阵的最优代价，枚举断点 k 拆成两段，加上合并代价 p[i]*p[k+1]*p[j+1]。`,
  gen: r => ({ p: Array.from({ length: 3 + r.int(4) }, () => 2 + r.int(9)) }),
  solve: p => String(matrixChain(p.p)),
  inputText: p => `第一行矩阵个数 ${p.p.length - 1}\n第二行 ${p.p.length} 个整数（维度）：${p.p.join(" ")}`,
  outputText: p => String(matrixChain(p.p)),
  code: {
    cpp: `int matrixChain(vector<int>& p) {
    int n = p.size() - 1;                        // 矩阵个数
    vector<vector<long long>> dp(n, vector<long long>(n, 0));
    for (int len = 2; len <= n; len++)           // 区间长度从小到大
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = LLONG_MAX;
            for (int k = i; k < j; k++)
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j]
                                       + 1LL * p[i] * p[k+1] * p[j+1]);
        }
    return n ? (int)dp[0][n-1] : 0;
}`,
    py: `def matrix_chain(p):
    n = len(p) - 1
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float("inf")
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
    return dp[0][n - 1] if n else 0`,
    java: `static long matrixChain(int[] p) {
    int n = p.length - 1;
    long[][] dp = new long[n][n];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = Long.MAX_VALUE;
            for (int k = i; k < j; k++)
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k+1][j] + (long) p[i] * p[k+1] * p[j+1]);
        }
    return n > 0 ? dp[0][n-1] : 0;
}`,
    c: `long long matrixChain(const int* p, int m) {
    int n = m - 1;
    long long dp[105][105] = {{0}};
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = 1e18;
            for (int k = i; k < j; k++) {
                long long cand = dp[i][k] + dp[k+1][j] + 1LL * p[i] * p[k+1] * p[j+1];
                if (cand < dp[i][j]) dp[i][j] = cand;
            }
        }
    return n ? dp[0][n-1] : 0;
}`
  },
  points: ["dp 的维度是「矩阵个数 n-1」，写成 p.length 会越界或少算一层", "区间 DP 必须按长度从小到大枚举，否则子区间还没算出来", "合并代价是 p[i]*p[k+1]*p[j+1]，三个下标容易写错，建议先在纸上验算 3 个矩阵"]
});

// ============================== 112. 快速幂取模 ==============================
G.push({
  key: "math-fast-pow", cat: "数学", diff: "简单",
  title: p => `快速幂取模（${p.b}^${p.e} mod ${p.mod}）`,
  desc: p => `计算 ${p.b} 的 ${p.e} 次方对 ${p.mod} 取模的结果。快速幂把指数按二进制拆开，每轮底数自乘、指数右移，O(log e) 完成；注意每一步乘法后都要取模，防止溢出。`,
  gen: r => ({ b: 2 + r.int(8), e: 5 + r.int(16), mod: 97 + r.int(900) }),
  solve: p => String(powMod(p.b, p.e, p.mod)),
  inputText: p => `三个整数 b = ${p.b}, e = ${p.e}, mod = ${p.mod}`,
  outputText: p => String(powMod(p.b, p.e, p.mod)),
  code: {
    cpp: `long long qpow(long long b, long long e, long long mod) {
    long long r = 1;
    b %= mod;
    while (e > 0) {
        if (e & 1) r = r * b % mod;   // 这一位为 1 就乘上当前底数
        b = b * b % mod;              // 底数平方，对应指数翻倍
        e >>= 1;
    }
    return r;
}`,
    py: `def qpow(b, e, mod):
    r = 1
    b %= mod
    while e > 0:
        if e & 1:
            r = r * b % mod
        b = b * b % mod
        e >>= 1
    return r`,
    java: `static long qpow(long b, long e, long mod) {
    long r = 1;
    b %= mod;
    while (e > 0) {
        if ((e & 1) == 1) r = r * b % mod;
        b = b * b % mod;
        e >>= 1;
    }
    return r;
}`,
    c: `long long qpow(long long b, long long e, long long mod) {
    long long r = 1;
    b %= mod;
    while (e > 0) {
        if (e & 1) r = r * b % mod;
        b = b * b % mod;
        e >>= 1;
    }
    return r;
}`
  },
  points: ["mod 为 1 时结果恒为 0，循环里 b %= 1 会得到 0，逻辑依然正确", "底数超过 int 时先 b %= mod 再乘，否则第一次乘法就溢出", "矩阵快速幂、模逆元（费马小定理）都基于这份骨架，值得背下来"]
});

// ============================== 113. 区间质数个数 ==============================
G.push({
  key: "math-sieve-count", cat: "数学", diff: "简单",
  title: p => `不超过 ${p.n} 的质数个数`,
  desc: p => `统计 [2, ${p.n}] 内质数的个数。埃氏筛：从 2 开始，把每个质数的倍数全部标记为合数，只筛到 √n 即可（更大的合数一定有小质因子），总复杂度 O(n log log n)。`,
  gen: r => ({ n: 100 + r.int(400) }),
  solve: p => String(primeCount(p.n)),
  inputText: p => `一个整数 n = ${p.n}`,
  outputText: p => String(primeCount(p.n)),
  code: {
    cpp: `int countPrimes(int n) {
    if (n < 2) return 0;
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; (long long)i * i <= n; i++)
        if (isPrime[i])
            for (int j = i * i; j <= n; j += i) isPrime[j] = false;   // 从 i*i 开始
    int c = 0;
    for (int i = 2; i <= n; i++) if (isPrime[i]) c++;
    return c;
}`,
    py: `def count_primes(n):
    if n < 2:
        return 0
    mark = bytearray([1]) * (n + 1)
    mark[0] = mark[1] = 0
    i = 2
    while i * i <= n:
        if mark[i]:
            mark[i * i:n + 1:i] = bytes(len(range(i * i, n + 1, i)))
        i += 1
    return sum(mark)`,
    java: `static int countPrimes(int n) {
    if (n < 2) return 0;
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; (long) i * i <= n; i++)
        if (isPrime[i])
            for (int j = i * i; j <= n; j += i) isPrime[j] = false;
    int c = 0;
    for (int i = 2; i <= n; i++) if (isPrime[i]) c++;
    return c;
}`,
    c: `int countPrimes(int n) {
    static char mark[10000005];
    if (n < 2) return 0;
    for (int i = 0; i <= n; i++) mark[i] = 1;
    mark[0] = mark[1] = 0;
    for (int i = 2; (long long)i * i <= n; i++)
        if (mark[i])
            for (int j = i * i; j <= n; j += i) mark[j] = 0;
    int c = 0;
    for (int i = 2; i <= n; i++) if (mark[i]) c++;
    return c;
}`
  },
  points: ["内层从 i*i 开始而不是 2i，能省掉一半重复标记", "i*i 可能溢出 int，用 (long long)i * i 判断循环条件", "n 到 1e7 以上时筛法要用 bitset 或分段筛控制内存"]
});

// ============================== 114. 区间 GCD ==============================
G.push({
  key: "math-gcd-range", cat: "数学", diff: "中等",
  title: p => `区间最大公约数（n = ${p.a.length}，${p.qs.length} 次查询）`,
  desc: p => `给定数组 ${p.a.join(" ")}，回答 ${p.qs.length} 个区间的 GCD。gcd 满足结合律，可以像求和一样合并；这里用逐元素折叠实现，量大时可换线段树或 ST 表做到 O(log n) / O(1)。`,
  gen: r => {
    const n = 6 + r.int(6);
    const a = Array.from({ length: n }, () => 2 + r.int(30));
    const qs = Array.from({ length: 2 + r.int(2) }, () => {
      const l = r.int(n), rr = l + r.int(n - l);
      return [l, rr];
    });
    return { a, qs };
  },
  solve: p => gcdRange(p.a, p.qs).join("\n"),
  inputText: p => `第一行 n = ${p.a.length}, q = ${p.qs.length}\n第二行 ${p.a.length} 个整数：${p.a.join(" ")}\n接下来 ${p.qs.length} 行每行 l r：\n${p.qs.map(q => q.join(" ")).join("\n")}`,
  outputText: p => gcdRange(p.a, p.qs).join("\n"),
  code: {
    cpp: `long long gcdRange(const vector<int>& a) {
    return accumulate(a.begin(), a.end(), 0LL,
        [](long long x, long long y) { return __gcd(x, y); });
}
// 线段树维护区间 gcd（支持修改）
struct SegTree {
    int n; vector<long long> t;
    SegTree(const vector<int>& a) { n = a.size(); t.assign(2 * n, 0);
        for (int i = 0; i < n; i++) t[n + i] = a[i];
        for (int i = n - 1; i > 0; i--) t[i] = __gcd(t[2*i], t[2*i+1]); }
    long long query(int l, int r) {                      // 闭区间
        long long res = 0;
        for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
            if (l & 1) res = __gcd(res, t[l++]);
            if (r & 1) res = __gcd(res, t[--r]);
        }
        return res;
    }
};`,
    py: `from math import gcd
from functools import reduce

def gcd_range(a, l, r):
    return reduce(gcd, a[l:r + 1])

def gcd_all(a):
    return reduce(gcd, a, 0)`,
    java: `static int gcd(int a, int b) { while (b != 0) { int t = a % b; a = b; b = t; } return a; }
static int gcdRange(int[] a, int l, int r) {
    int g = 0;
    for (int i = l; i <= r; i++) g = gcd(g, a[i]);
    return g;
}`,
    c: `long long gcd_ll(long long a, long long b) { while (b) { long long t = a % b; a = b; b = t; } return a; }
long long gcdRange(const int* a, int l, int r) {
    long long g = 0;
    for (int i = l; i <= r; i++) g = gcd_ll(g, a[i]);
    return g;
}`
  },
  points: ["gcd(0, x) = x，所以把初值设为 0 可以直接折叠，不用特殊处理第一个元素", "gcd 可与区间加法混用做差分维护，是「区间加 + 区间 gcd」这一经典题的核心", "Python 的 math.gcd 会自动取绝对值，手写时负数要用 abs"]
});

// ============================== 115. 反转二进制位 ==============================
G.push({
  key: "bits-reverse", cat: "位运算", diff: "简单",
  title: p => `反转 32 位二进制（x = ${p.x}）`,
  desc: p => `把 ${p.x} 的 32 位二进制表示整体反转，输出反转后的无符号整数。逐位取最低位拼到答案的最高位，固定循环 32 次；也可以用分治掩码交换法（5 步）做到 O(1)。`,
  gen: r => ({ x: r.int(1 << 20) }),
  solve: p => String(reverseBits32(p.x)),
  inputText: p => `一个整数 x = ${p.x}（按 32 位无符号解释）`,
  outputText: p => String(reverseBits32(p.x)),
  code: {
    cpp: `uint32_t reverseBits(uint32_t x) {
    uint32_t r = 0;
    for (int i = 0; i < 32; i++) {
        r = (r << 1) | (x & 1);   // 取最低位拼到结果末尾
        x >>= 1;
    }
    return r;
}
// 分治掩码法，5 步完成
uint32_t reverseBitsFast(uint32_t x) {
    x = ((x & 0x55555555u) << 1)  | ((x >> 1) & 0x55555555u);
    x = ((x & 0x33333333u) << 2)  | ((x >> 2) & 0x33333333u);
    x = ((x & 0x0F0F0F0Fu) << 4)  | ((x >> 4) & 0x0F0F0F0Fu);
    x = ((x & 0x00FF00FFu) << 8)  | ((x >> 8) & 0x00FF00FFu);
    return (x << 16) | (x >> 16);
}`,
    py: `def reverse_bits(x):
    r = 0
    for _ in range(32):
        r = ((r << 1) | (x & 1)) & 0xFFFFFFFF
        x >>= 1
    return r`,
    java: `static int reverseBits(int x) {
    int r = 0;
    for (int i = 0; i < 32; i++) {
        r = (r << 1) | (x & 1);
        x >>>= 1;                 // 必须用无符号右移
    }
    return r;
}`,
    c: `unsigned int reverseBits(unsigned int x) {
    unsigned int r = 0;
    for (int i = 0; i < 32; i++) {
        r = (r << 1) | (x & 1u);
        x >>= 1;
    }
    return r;
}`
  },
  points: ["Java / C 必须用无符号右移 >>>：用 >> 会把符号位一路带下来", "结果可能超过 int 的表示范围，输出时按 32 位无符号解释", "固定 32 次循环，别写成 while(x) —— 前导零也要参与反转"]
});

// ============================== 116. 子串出现次数 ==============================
G.push({
  key: "str-count-occur", cat: "字符串", diff: "中等",
  title: p => `模式串出现次数（文本 "${p.text}"，模式 "${p.pat}"）`,
  desc: p => `统计模式串 "${p.pat}" 在文本 "${p.text}" 中出现的次数（允许重叠）。暴力比较是 O(nm)；Rabin-Karp 用滚动哈希把每次比较降到 O(1)，期望 O(n+m)，冲突时再逐字符校验。`,
  gen: r => {
    const text = Array.from({ length: 10 + r.int(9) }, () => "ab"[r.int(2)]).join("");
    const pat = Array.from({ length: 2 + r.int(2) }, () => "ab"[r.int(2)]).join("");
    return { text, pat };
  },
  solve: p => String(countOccur(p.text, p.pat)),
  inputText: p => `第一行文本：${p.text}\n第二行模式串：${p.pat}`,
  outputText: p => String(countOccur(p.text, p.pat)),
  code: {
    cpp: `int countOccur(const string& s, const string& p) {
    int n = s.size(), m = p.size(), cnt = 0;
    if (m == 0 || m > n) return 0;
    const long long B = 131, MOD = 1000000007;
    long long hp = 0, hs = 0, pw = 1;
    for (int i = 0; i < m; i++) { hp = (hp * B + p[i]) % MOD; pw = pw * B % MOD; }
    for (int i = 0; i < n; i++) {
        hs = (hs * B + s[i]) % MOD;
        if (i >= m) hs = (hs - s[i - m] * pw % MOD + MOD) % MOD;
        if (i >= m - 1 && hs == hp && s.compare(i - m + 1, m, p) == 0) cnt++;  // 哈希相等再校验
    }
    return cnt;
}`,
    py: `def count_occur(s, p):
    return sum(1 for i in range(len(s) - len(p) + 1) if s[i:i + len(p)] == p)`,
    java: `static int countOccur(String s, String p) {
    int n = s.length(), m = p.length(), cnt = 0;
    if (m == 0 || m > n) return 0;
    for (int i = 0; i + m <= n; i++)
        if (s.regionMatches(i, p, 0, m)) cnt++;   // 允许重叠，i 每次 +1
    return cnt;
}`,
    c: `int countOccur(const char* s, const char* p) {
    int n = strlen(s), m = strlen(p), cnt = 0;
    for (int i = 0; i + m <= n; i++)
        if (strncmp(s + i, p, m) == 0) cnt++;
    return cnt;
}`
  },
  points: ["允许重叠时下标每次只前进 1，不允许重叠则要 i += m", "模式串长度大于文本时直接返回 0，否则循环条件会算错", "哈希相等不等于字符串相等，必须再逐字符校验一次，否则会被碰撞骗过"]
});

// ============================== 117. 最长回文子串 ==============================
G.push({
  key: "str-longest-palindrome", cat: "字符串", diff: "困难",
  title: p => `最长回文子串长度（"${p.s}"）`,
  desc: p => `求字符串 "${p.s}" 中最长回文子串的长度。中心扩展法：以每个字符（奇数长度）和每对相邻字符之间（偶数长度）为中心向两侧扩展，共 2n-1 个中心，O(n²)。Manacher 加分隔符后可以做到 O(n)。`,
  gen: r => ({ s: Array.from({ length: 6 + r.int(7) }, () => "abc"[r.int(3)]).join("") }),
  solve: p => String(longestPalindrome(p.s)),
  inputText: p => `第一行字符串 s：${p.s}`,
  outputText: p => String(longestPalindrome(p.s)),
  code: {
    cpp: `int longestPalindrome(const string& s) {
    int n = s.size(), best = 1;
    for (int c = 0; c < n; c++) {
        for (int d = 0; d < 2; d++) {                 // d=0 奇数中心, d=1 偶数中心
            int l = c, r = c + d;
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
            best = max(best, r - l - 1);              // 越界后回退一格才是真实长度
        }
    }
    return best;
}
// Manacher：插入分隔符后统一处理奇偶，O(n)
int manacher(const string& s) {
    string t = "^#";
    for (char c : s) { t += c; t += '#'; }
    t += '$';
    int n = t.size(), C = 0, R = 0, best = 0;
    vector<int> P(n, 0);
    for (int i = 1; i < n - 1; i++) {
        P[i] = (R > i) ? min(R - i, P[2 * C - i]) : 1;
        while (t[i + P[i]] == t[i - P[i]]) P[i]++;
        if (i + P[i] > R) { C = i; R = i + P[i]; }
        best = max(best, P[i] - 1);
    }
    return best;
}`,
    py: `def longest_palindrome(s):
    best = 0
    for c in range(len(s)):
        for l0, r0 in ((c, c), (c, c + 1)):
            l, r = l0, r0
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            best = max(best, r - l - 1)
    return best`,
    java: `static int longestPalindrome(String s) {
    int n = s.length(), best = 1;
    for (int c = 0; c < n; c++)
        for (int d = 0; d < 2; d++) {
            int l = c, r = c + d;
            while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) { l--; r++; }
            best = Math.max(best, r - l - 1);
        }
    return best;
}`,
    c: `int longestPalindrome(const char* s) {
    int n = strlen(s), best = 1;
    for (int c = 0; c < n; c++)
        for (int d = 0; d < 2; d++) {
            int l = c, r = c + d;
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
            if (r - l - 1 > best) best = r - l - 1;
        }
    return best;
}`
  },
  points: ["长度是 r - l - 1，因为循环退出时 l 和 r 已经各多走了一步", "偶数长度回文要以「两个字符之间」为中心，两个中心都要试", "Manacher 插入 # 后长度统一为奇数，返回 P[i]-1 才是原串长度"]
});

// ============================== 118. 机器人模拟 ==============================
G.push({
  key: "sim-robot", cat: "模拟", diff: "简单",
  title: p => `机器人走位（指令 "${p.cmds}" × ${p.k}）`,
  desc: p => `机器人从 (0,0) 出发，指令串 "${p.cmds}" 中 L/R/U/D 分别表示左右上下移动一格，重复执行 ${p.k} 遍，求最终坐标。纯模拟，注意别把方向搞反（U 是 y 加 1 还是减 1 取决于坐标系约定，本题 U 为 y 加 1）。`,
  gen: r => ({
    cmds: Array.from({ length: 4 + r.int(6) }, () => "LRUD"[r.int(4)]).join(""),
    k: 1 + r.int(3)
  }),
  solve: p => robotFinal(p.cmds, p.k),
  inputText: p => `第一行指令串：${p.cmds}\n第二行重复次数：${p.k}`,
  outputText: p => robotFinal(p.cmds, p.k),
  code: {
    cpp: `pair<int,int> finalPosition(const string& cmds, int k) {
    int x = 0, y = 0;
    for (int t = 0; t < k; t++)
        for (char c : cmds) {
            if (c == 'L') x--;
            else if (c == 'R') x++;
            else if (c == 'U') y++;
            else if (c == 'D') y--;
        }
    return {x, y};
}`,
    py: `def final_position(cmds, k):
    x = y = 0
    for _ in range(k):
        for c in cmds:
            if c == "L":
                x -= 1
            elif c == "R":
                x += 1
            elif c == "U":
                y += 1
            elif c == "D":
                y -= 1
    return x, y`,
    java: `static int[] finalPosition(String cmds, int k) {
    int x = 0, y = 0;
    for (int t = 0; t < k; t++)
        for (char c : cmds.toCharArray()) {
            if (c == 'L') x--;
            else if (c == 'R') x++;
            else if (c == 'U') y++;
            else y--;
        }
    return new int[]{x, y};
}`,
    c: `void finalPosition(const char* cmds, int k, int* x, int* y) {
    *x = *y = 0;
    for (int t = 0; t < k; t++)
        for (int i = 0; cmds[i]; i++) {
            if (cmds[i] == 'L') (*x)--;
            else if (cmds[i] == 'R') (*x)++;
            else if (cmds[i] == 'U') (*y)++;
            else if (cmds[i] == 'D') (*y)--;
        }
}`
  },
  points: ["重复 k 遍时可以先算出单遍的位移再乘以 k，复杂度从 O(k·n) 降到 O(n)", "指令里可能有不在集合内的字符，用 else if 精确匹配而不是 else 兜底", "坐标范围可能在多次重复后溢出 short，直接用 int"]
});

// ============================== 119. 两栈模拟队列 ==============================
G.push({
  key: "stack-two-queue", cat: "栈队列", diff: "中等",
  title: p => `用两个栈实现队列（${p.ops.length} 次操作）`,
  desc: p => `维护一个队列，支持 push v（入队）与 pop（出队并输出队首），共 ${p.ops.length} 次操作。两个栈：入栈 in 负责 push，出栈 out 负责 pop；out 为空时把 in 全部倒入 out，这样顺序恰好反转两次还原为先进先出，均摊 O(1)。`,
  gen: r => {
    const ops = [];
    for (let k = 0, c = 3 + r.int(4); k < c; k++) {
      if (r.int(2) || !ops.length) ops.push(["push", 1 + r.int(50)]);
      else ops.push(["pop"]);
    }
    if (!ops.some(o => o[0] === "pop")) ops.push(["pop"]);   // 保证至少有一次出队
    return { ops };
  },
  solve: p => twoStackQueue(p.ops).join("\n"),
  inputText: p => `${p.ops.length} 行操作：\n${p.ops.map(o => o.join(" ")).join("\n")}`,
  outputText: p => twoStackQueue(p.ops).join("\n"),
  code: {
    cpp: `class MyQueue {
    stack<int> in, out;
    void shift() {                       // out 为空时才整体搬一次
        if (out.empty())
            while (!in.empty()) { out.push(in.top()); in.pop(); }
    }
public:
    void push(int x) { in.push(x); }
    int pop() {
        shift();
        if (out.empty()) return -1;      // 队列为空
        int v = out.top(); out.pop(); return v;
    }
    int peek() { shift(); return out.empty() ? -1 : out.top(); }
    bool empty() { return in.empty() && out.empty(); }
};`,
    py: `class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def _shift(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())

    def push(self, x):
        self.inbox.append(x)

    def pop(self):
        self._shift()
        return self.outbox.pop() if self.outbox else None`,
    java: `static class MyQueue {
    Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();
    void shift() { if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop()); }
    void push(int x) { in.push(x); }
    int pop() {
        shift();
        return out.isEmpty() ? -1 : out.pop();
    }
}`,
    c: `int inStk[100005], outStk[100005], inTop = 0, outTop = 0;
void shift(void) {
    if (outTop == 0) while (inTop > 0) outStk[outTop++] = inStk[--inTop];
}
void push(int x) { inStk[inTop++] = x; }
int pop(void) { shift(); return outTop ? outStk[--outTop] : -1; }`
  },
  points: ["只在 out 为空时搬运，否则会打乱顺序（新元素会插到旧元素前面）", "每个元素最多被搬运一次，所以均摊复杂度是 O(1) 而不是 O(n)", "用队列模拟栈则是 push 时整体翻一次，两者别搞反"]
});

// ============================== 120. 区间二进制 1 的个数 ==============================
G.push({
  key: "bits-count-upto", cat: "位运算", diff: "中等",
  title: p => `0 到 ${p.n} 的二进制中 1 的总数`,
  desc: p => `统计 0, 1, 2, ..., ${p.n} 的二进制表示里 1 的总个数。按位统计：第 k 位（值 2^k）每 2^(k+1) 个数构成一个周期，其中前 2^k 个为 0、后 2^k 个为 1，用除法直接算出这一位有多少个 1，总复杂度 O(log n)。`,
  gen: r => ({ n: 10 + r.int(190) }),
  solve: p => String(countOnesUpto(p.n)),
  inputText: p => `一个整数 n = ${p.n}`,
  outputText: p => String(countOnesUpto(p.n)),
  code: {
    cpp: `// 按位统计：0..n 中第 k 位出现 1 的次数
long long countOnes(long long n) {
    long long total = 0;
    for (long long k = 1; k <= n; k <<= 1) {
        long long full = (n + 1) / (k << 1);       // 完整周期数
        long long rest = (n + 1) % (k << 1);       // 余下部分
        total += full * k + max(0LL, rest - k);    // 余下部分里前 k 个为 0，后面为 1
        if (k > n / 2) break;                      // 防止 k <<= 1 溢出
    }
    return total;
}
// 另一种写法：逐个数用 x &= x-1 消掉最低位 1 计数（O(n log n)，n 小时更直观）
long long countOnesBrute(long long n) {
    long long c = 0;
    for (long long i = 0; i <= n; i++) {
        long long x = i;
        while (x) { x &= x - 1; c++; }
    }
    return c;
}`,
    py: `def count_ones(n):
    total, k = 0, 1
    while k <= n:
        full, rest = (n + 1) // (k << 1), (n + 1) % (k << 1)
        total += full * k + max(0, rest - k)
        k <<= 1
    return total`,
    java: `static long countOnes(long n) {
    long total = 0;
    for (long k = 1; k <= n; k <<= 1) {
        long full = (n + 1) / (k << 1);
        long rest = (n + 1) % (k << 1);
        total += full * k + Math.max(0, rest - k);
        if (k > n / 2) break;
    }
    return total;
}`,
    c: `long long countOnes(long long n) {
    long long total = 0;
    for (long long k = 1; k <= n; k <<= 1) {
        long long full = (n + 1) / (k << 1);
        long long rest = (n + 1) % (k << 1);
        total += full * k + (rest > k ? rest - k : 0);
        if (k > n / 2) break;
    }
    return total;
}`
  },
  points: ["区间长度是 n+1 而不是 n，因为从 0 数到 n 一共 n+1 个数", "余下部分超过 k 时才有额外的 1，用 max(0, rest - k) 统一处理", "k <<= 1 在 k 接近 2^62 时会溢出，循环里加 k > n/2 的保护判断"]
});

module.exports = { TYPES_G };
