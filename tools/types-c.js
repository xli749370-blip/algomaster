// 题型模板库 C（29-42）：进阶 DP / 双指针 / 单调队列 / 区间 / 贪心对比
// 约定同 types-a：gen(r) 造数据，solve(p) 出真值，outputText 与 solve 同源

// ---- 复用工具 ----
const kadane = a => { let best = -Infinity, cur = 0; for (const x of a) { cur = Math.max(x, cur + x); best = Math.max(best, cur); } return best; };

function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
    if (h[l] < h[r]) l++; else r--;
  }
  return best;
}

function trap(h) {
  let l = 0, r = h.length - 1, lm = 0, rm = 0, ans = 0;
  while (l < r) {
    if (h[l] < h[r]) { lm = Math.max(lm, h[l]); ans += lm - h[l]; l++; }
    else { rm = Math.max(rm, h[r]); ans += rm - h[r]; r--; }
  }
  return ans;
}

function slideMax(a, k) {
  const q = [], res = [];
  for (let i = 0; i < a.length; i++) {
    while (q.length && q[0] <= i - k) q.shift();
    while (q.length && a[q[q.length - 1]] <= a[i]) q.pop();
    q.push(i);
    if (i >= k - 1) res.push(a[q[0]]);
  }
  return res;
}

function mergeIntervals(iv) {
  const s = iv.slice().sort((x, y) => x[0] - y[0]);
  const out = [];
  for (const [l, r] of s) {
    if (out.length && l <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], r);
    else out.push([l, r]);
  }
  return out;
}

function jumpMin(a) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < a.length - 1; i++) {
    farthest = Math.max(farthest, i + a[i]);
    if (i === curEnd) { jumps++; curEnd = farthest; }
  }
  return jumps;
}

function coinGreedy(amount) {
  const d = [25, 10, 5, 1];
  let cnt = 0;
  for (const c of d) { cnt += Math.floor(amount / c); amount %= c; }
  return cnt;
}

function coinDp(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++)
    for (const c of coins) if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}

function editDist(s, t) {
  const n = s.length, m = t.length;
  const dp = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
  return dp[n][m];
}

function minPathSum(g) {
  const n = g.length, m = g[0].length;
  const dp = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (i === 0 && j === 0) dp[i][j] = g[i][j];
    else dp[i][j] = g[i][j] + Math.min(i > 0 ? dp[i - 1][j] : Infinity, j > 0 ? dp[i][j - 1] : Infinity);
  }
  return dp[n - 1][m - 1];
}

function uniquePaths(n, m) {
  let r = 1;
  for (let i = 1; i <= n - 1; i++) r = r * (m - 1 + i) / i;
  return Math.round(r);
}

function completeKnapsack(items, cap) {
  const dp = Array(cap + 1).fill(0);
  for (let c = 0; c <= cap; c++)
    for (const [w, v] of items) if (w <= c) dp[c] = Math.max(dp[c], dp[c - w] + v);
  return dp[cap];
}

function lpsLen(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++)
      dp[i][j] = s[i] === s[j] ? dp[i + 1][j - 1] + 2 : Math.max(dp[i + 1][j], dp[i][j - 1]);
  }
  return n ? dp[0][n - 1] : 0;
}

function countInv(a) {
  let cnt = 0;
  const sortCnt = arr => {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    const l = sortCnt(arr.slice(0, mid)), r = sortCnt(arr.slice(mid));
    const out = [];
    let i = 0, j = 0;
    while (i < l.length && j < r.length) {
      if (l[i] <= r[j]) out.push(l[i++]);
      else { cnt += l.length - i; out.push(r[j++]); }
    }
    while (i < l.length) out.push(l[i++]);
    while (j < r.length) out.push(r[j++]);
    return out;
  };
  sortCnt(a);
  return cnt;
}

const TYPES_C = [

// 29. 最大子段和
{
  key: "kadane", cat: "DP", diff: "中等",
  title: p => `最大子段和（n = ${p.n}）`,
  desc: p => `给定长度 ${p.n} 的整数数组（含负数），求所有连续子段中和的最大值。要求 O(n)：设 dp[i] 为「以 i 结尾的最大子段和」，则 dp[i] = max(a[i], dp[i-1] + a[i])，答案是所有 dp 的最大值。`,
  gen: r => { const n = 5 + r.int(25); return { n, a: Array.from({ length: n }, () => r.int(41) - 18) }; },
  solve: p => String(kadane(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数（可正可负）：${p.a.join(" ")}`,
  outputText: p => String(kadane(p.a)),
  code: {
    cpp: `int maxSubArray(const vector<int>& a) {
    int best = INT_MIN, cur = 0;
    for (int x : a) {
        cur = max(x, cur + x);      // 接着前一段，或从自己重新开一段
        best = max(best, cur);
    }
    return best;
}`,
    py: `def max_sub_array(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
    java: `static int maxSubArray(int[] a) {
    int best = Integer.MIN_VALUE, cur = 0;
    for (int x : a) {
        cur = Math.max(x, cur + x);
        best = Math.max(best, cur);
    }
    return best;
}`,
    c: `int maxSubArray(const int* a, int n) {
    int best = INT_MIN, cur = 0;
    for (int i = 0; i < n; i++) {
        cur = a[i] > cur + a[i] ? a[i] : cur + a[i];
        if (cur > best) best = cur;
    }
    return best;
}`
  },
  points: ["best 必须初始化为 -INF，初始化为 0 会让全负数数组错误输出 0", "空数组要特判返回 0（或题目约定），否则 -INF 会漏到输出里", "要输出具体区间时，额外记录起点：cur 被重置为 a[i] 的那一刻就是新区间起点"]
},

// 30. 盛最多水的容器
{
  key: "max-water", cat: "双指针", diff: "中等",
  title: p => `盛最多水的容器（n = ${p.n}）`,
  desc: p => `给出 ${p.n} 根竖直隔板的高度，选择两根隔板与 x 轴围成容器，求能装的最大水量（面积 = 两板距离 × 较矮板高）。用双指针从两端收拢，每次移动较矮的一侧。`,
  gen: r => { const n = 4 + r.int(10); return { n, h: Array.from({ length: n }, () => 1 + r.int(20)) }; },
  solve: p => String(maxArea(p.h)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个高度：${p.h.join(" ")}`,
  outputText: p => String(maxArea(p.h)),
  code: {
    cpp: `int maxArea(const vector<int>& h) {
    int l = 0, r = (int)h.size() - 1, best = 0;
    while (l < r) {
        best = max(best, min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++; else r--;   // 移动矮的一侧才可能变高
    }
    return best;
}`,
    py: `def max_area(h):
    l, r, best = 0, len(h) - 1, 0
    while l < r:
        best = max(best, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]:
            l += 1
        else:
            r -= 1
    return best`,
    java: `static int maxArea(int[] h) {
    int l = 0, r = h.length - 1, best = 0;
    while (l < r) {
        best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++; else r--;
    }
    return best;
}`,
    c: `int maxArea(const int* h, int n) {
    int l = 0, r = n - 1, best = 0;
    while (l < r) {
        int area = (h[l] < h[r] ? h[l] : h[r]) * (r - l);
        if (area > best) best = area;
        if (h[l] < h[r]) l++; else r--;
    }
    return best;
}`
  },
  points: ["移动较矮的一侧：放弃它能排除一整批不可能更优的解，这是正确性关键", "两侧等高时任移一侧均可，不要写成两个分支都不动导致死循环", "面积用 int 就够（高度与距离都小于 1e5），但乘之前确认不会溢出"]
},

// 31. 接雨水
{
  key: "rain-water", cat: "双指针", diff: "困难",
  title: p => `接雨水（n = ${p.n}）`,
  desc: p => `给定 ${p.n} 根柱子高度（宽度均为 1），计算下雨后能接住多少单位雨水。每个位置的水量 = max(0, min(左侧最高, 右侧最高) - 自身高度)，双指针可在 O(n) 时间 O(1) 空间完成。`,
  gen: r => { const n = 4 + r.int(10); return { n, h: Array.from({ length: n }, () => r.int(10)) }; },
  solve: p => String(trap(p.h)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个高度：${p.h.join(" ")}`,
  outputText: p => String(trap(p.h)),
  code: {
    cpp: `int trap(const vector<int>& h) {
    int l = 0, r = (int)h.size() - 1, lm = 0, rm = 0, ans = 0;
    while (l < r) {
        if (h[l] < h[r]) { lm = max(lm, h[l]); ans += lm - h[l]; l++; }
        else            { rm = max(rm, h[r]); ans += rm - h[r]; r--; }
    }
    return ans;
}`,
    py: `def trap(h):
    l, r, lm, rm, ans = 0, len(h) - 1, 0, 0, 0
    while l < r:
        if h[l] < h[r]:
            lm = max(lm, h[l]); ans += lm - h[l]; l += 1
        else:
            rm = max(rm, h[r]); ans += rm - h[r]; r -= 1
    return ans`,
    java: `static int trap(int[] h) {
    int l = 0, r = h.length - 1, lm = 0, rm = 0, ans = 0;
    while (l < r) {
        if (h[l] < h[r]) { lm = Math.max(lm, h[l]); ans += lm - h[l]; l++; }
        else             { rm = Math.max(rm, h[r]); ans += rm - h[r]; r--; }
    }
    return ans;
}`,
    c: `int trap(const int* h, int n) {
    int l = 0, r = n - 1, lm = 0, rm = 0, ans = 0;
    while (l < r) {
        if (h[l] < h[r]) {
            if (h[l] > lm) lm = h[l];
            ans += lm - h[l]; l++;
        } else {
            if (h[r] > rm) rm = h[r];
            ans += rm - h[r]; r--;
        }
    }
    return ans;
}`
  },
  points: ["先更新 lm/rm 再累加，顺序反了会得到负水量", "另一种写法是预处理左右最大值数组（O(n) 空间），理解两种写法等价很有用", "答案可能达到 n × maxHeight，n 很大时用 long long"]
},

// 32. 滑动窗口最大值
{
  key: "slide-max", cat: "滑动窗口", diff: "困难",
  title: p => `滑动窗口最大值（n = ${p.n}, k = ${p.k}）`,
  desc: p => `数组长度 ${p.n}，窗口大小 ${p.k}，从左到右滑动，输出每个窗口内的最大值。标准解法是单调队列：队列存下标，对应值严格递减，队首就是当前窗口最大值，整体 O(n)。`,
  gen: r => { const n = 6 + r.int(12); const k = 2 + r.int(Math.min(4, n - 1)); return { n, k, a: Array.from({ length: n }, () => r.int(50)) }; },
  solve: p => slideMax(p.a, p.k).join(" "),
  inputText: p => `第一行 n = ${p.n}, k = ${p.k}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => slideMax(p.a, p.k).join(" "),
  code: {
    cpp: `vector<int> maxSlidingWindow(const vector<int>& a, int k) {
    deque<int> q;                  // 存下标，值单调递减
    vector<int> res;
    for (int i = 0; i < (int)a.size(); i++) {
        while (!q.empty() && q.front() <= i - k) q.pop_front();   // 队首出窗
        while (!q.empty() && a[q.back()] <= a[i]) q.pop_back();   // 维护单调
        q.push_back(i);
        if (i >= k - 1) res.push_back(a[q.front()]);
    }
    return res;
}`,
    py: `from collections import deque

def max_sliding_window(a, k):
    q, res = deque(), []
    for i, x in enumerate(a):
        while q and q[0] <= i - k:
            q.popleft()
        while q and a[q[-1]] <= x:
            q.pop()
        q.append(i)
        if i >= k - 1:
            res.append(a[q[0]])
    return res`,
    java: `static int[] maxSlidingWindow(int[] a, int k) {
    Deque<Integer> q = new ArrayDeque<>();
    int[] res = new int[a.length - k + 1];
    int p = 0;
    for (int i = 0; i < a.length; i++) {
        while (!q.isEmpty() && q.peekFirst() <= i - k) q.pollFirst();
        while (!q.isEmpty() && a[q.peekLast()] <= a[i]) q.pollLast();
        q.offerLast(i);
        if (i >= k - 1) res[p++] = a[q.peekFirst()];
    }
    return res;
}`,
    c: `void maxSlidingWindow(const int* a, int n, int k, int* res) {
    int q[1005], h = 0, t = 0, p = 0;   // q[h..t) 存下标
    for (int i = 0; i < n; i++) {
        if (h < t && q[h] <= i - k) h++;
        while (h < t && a[q[t - 1]] <= a[i]) t--;
        q[t++] = i;
        if (i >= k - 1) res[p++] = a[q[h]];
    }
}`
  },
  points: ["队列里存下标而不是值，否则无法判断是否滑出窗口", "窗口大小 k 大于数组长度时无输出，边界要判", "不想写单调队列时可用 multiset（C++）或 TreeMap（Java）做惰性删除，复杂度 O(n log n)"]
},

// 33. 区间合并
{
  key: "merge-intervals", cat: "区间", diff: "中等",
  title: p => `合并重叠区间（m = ${p.m}）`,
  desc: p => `给出 ${p.m} 个闭区间 [l, r]，合并所有重叠或相邻的区间后输出。先按左端点排序，再线性扫描：若能接上当前区间就延伸右端，否则另起一段。`,
  gen: r => {
    const m = 2 + r.int(5);
    const iv = Array.from({ length: m }, () => { const l = r.int(20); return [l, l + 1 + r.int(8)]; });
    return { m, iv };
  },
  solve: p => { const out = mergeIntervals(p.iv); return out.length + "\n" + out.map(([l, r]) => `${l} ${r}`).join("\n"); },
  inputText: p => `第一行 m = ${p.m}\n接下来 ${p.m} 行每行两个整数 l r：\n${p.iv.map(([l, r]) => `${l} ${r}`).join("\n")}`,
  outputText: p => { const out = mergeIntervals(p.iv); return out.length + "\n" + out.map(([l, r]) => `${l} ${r}`).join("\n"); },
  code: {
    cpp: `vector<vector<int>> merge(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end());                 // 按左端点排序
    vector<vector<int>> res;
    for (auto& x : iv) {
        if (!res.empty() && x[0] <= res.back()[1])
            res.back()[1] = max(res.back()[1], x[1]);
        else res.push_back(x);
    }
    return res;
}`,
    py: `def merge(iv):
    iv = sorted(iv, key=lambda x: x[0])
    res = []
    for l, r in iv:
        if res and l <= res[-1][1]:
            res[-1][1] = max(res[-1][1], r)
        else:
            res.append([l, r])
    return res`,
    java: `static List<int[]> merge(int[][] iv) {
    Arrays.sort(iv, (a, b) -> a[0] - b[0]);
    List<int[]> res = new ArrayList<>();
    for (int[] x : iv) {
        if (!res.isEmpty() && x[0] <= res.get(res.size() - 1)[1])
            res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], x[1]);
        else res.add(new int[]{x[0], x[1]});
    }
    return res;
}`,
    c: `int cmp(const void* a, const void* b) {
    const int* x = (const int*)a; const int* y = (const int*)b;
    return x[0] - y[0];
}
int merge(int iv[][2], int m, int out[][2]) {
    qsort(iv, m, sizeof(iv[0]), cmp);
    int k = 0;
    for (int i = 0; i < m; i++) {
        if (k > 0 && iv[i][0] <= out[k - 1][1])
            out[k - 1][1] = iv[i][1] > out[k - 1][1] ? iv[i][1] : out[k - 1][1];
        else { out[k][0] = iv[i][0]; out[k][1] = iv[i][1]; k++; }
    }
    return k;
}`
  },
  points: ["不排序直接扫描是错的，输入区间顺序任意", "合并时要取 max(右端)，否则被包含的小区间会让结果变短", "要求合并「相邻」区间（如 [1,2] 与 [3,4]）时把条件改成 l <= back[1] + 1"]
},

// 34. 跳跃游戏 II
{
  key: "jump-min", cat: "贪心", diff: "中等",
  title: p => `跳跃游戏的最少跳跃次数（n = ${p.n}）`,
  desc: p => `数组第 i 个元素表示从位置 i 最多能跳几步，从下标 0 出发，求到达最后一个位置的最少跳跃次数。贪心按「层」推进：记录当前层能到的最远位置，走完一层就把跳跃次数加 1。`,
  gen: r => { const n = 3 + r.int(8); return { n, a: Array.from({ length: n }, () => 1 + r.int(3)) }; },
  solve: p => String(jumpMin(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个跳跃能力：${p.a.join(" ")}`,
  outputText: p => String(jumpMin(p.a)),
  code: {
    cpp: `int jump(const vector<int>& a) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < (int)a.size() - 1; i++) {
        farthest = max(farthest, i + a[i]);
        if (i == curEnd) { jumps++; curEnd = farthest; }   // 一层走完
    }
    return jumps;
}`,
    py: `def jump(a):
    jumps = cur_end = farthest = 0
    for i in range(len(a) - 1):
        farthest = max(farthest, i + a[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    return jumps`,
    java: `static int jump(int[] a) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < a.length - 1; i++) {
        farthest = Math.max(farthest, i + a[i]);
        if (i == curEnd) { jumps++; curEnd = farthest; }
    }
    return jumps;
}`,
    c: `int jump(const int* a, int n) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n - 1; i++) {
        int reach = i + a[i];
        if (reach > farthest) farthest = reach;
        if (i == curEnd) { jumps++; curEnd = farthest; }
    }
    return jumps;
}`
  },
  points: ["循环上界是 n-1：站在最后一个位置不需要再跳", "必须提前判断能否到达终点，否则题目保证可达的假设不成立时会死循环", "这是 BFS 层序的贪心实现，不要误写成每次跳最远（那是错的）"]
},

// 35. 找零钱（贪心）
{
  key: "coin-greedy", cat: "贪心", diff: "简单",
  title: p => `硬币找零（面额 25/10/5/1，金额 ${p.amount}）`,
  desc: p => `用面额 25、10、5、1 的硬币凑出金额 ${p.amount}，求最少硬币数。这组面额满足「后一项整除前一项」的规范性质，因此贪心（每次尽量用大面额）就是最优解——换一组面额则不一定。`,
  gen: r => ({ amount: 1 + r.int(99) }),
  solve: p => String(coinGreedy(p.amount)),
  inputText: p => `第一行一个整数 amount = ${p.amount}`,
  outputText: p => String(coinGreedy(p.amount)),
  code: {
    cpp: `int coinChange(int amount) {
    int d[4] = {25, 10, 5, 1}, cnt = 0;
    for (int i = 0; i < 4; i++) { cnt += amount / d[i]; amount %= d[i]; }
    return cnt;
}`,
    py: `def coin_change(amount):
    cnt = 0
    for c in (25, 10, 5, 1):
        cnt += amount // c
        amount %= c
    return cnt`,
    java: `static int coinChange(int amount) {
    int[] d = {25, 10, 5, 1};
    int cnt = 0;
    for (int c : d) { cnt += amount / c; amount %= c; }
    return cnt;
}`,
    c: `int coinChange(int amount) {
    int d[4] = {25, 10, 5, 1}, cnt = 0;
    for (int i = 0; i < 4; i++) { cnt += amount / d[i]; amount %= d[i]; }
    return cnt;
}`
  },
  points: ["贪心只对「规范面额」成立，面额为 1/3/4 时贪心会出错（金额 6：贪心 4+1+1 用 3 枚，最优 3+3 用 2 枚）", "整除与取余配合使用，不要写成 amount -= d[i] 的循环（大金额会超时）", "金额为 0 时返回 0，不要漏判"]
},

// 36. 零钱兑换（DP）
{
  key: "coin-dp", cat: "DP", diff: "中等",
  title: p => `零钱兑换（面额 ${p.coins.join("/")}，金额 ${p.amount}）`,
  desc: p => `给定面额 ${p.coins.join("、")}（每种数量不限）与目标金额 ${p.amount}，求凑出该金额的最少硬币数，无法凑出输出 -1。这是完全背包的变形：dp[j] = min(dp[j], dp[j-c] + 1)，j 从小到大枚举。`,
  gen: r => {
    const pool = [1, 3, 4, 5, 7];
    const coins = [1].concat(pool.filter(() => r.int(2) === 0));
    return { coins: [...new Set(coins)].sort((a, b) => a - b), amount: 5 + r.int(36) };
  },
  solve: p => String(coinDp(p.coins, p.amount)),
  inputText: p => `第一行硬币种数 k = ${p.coins.length}, 目标金额 amount = ${p.amount}\n第二行 ${p.coins.length} 个面额：${p.coins.join(" ")}`,
  outputText: p => String(coinDp(p.coins, p.amount)),
  code: {
    cpp: `int coinChange(const vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX / 2);
    dp[0] = 0;
    for (int j = 1; j <= amount; j++)
        for (int c : coins)
            if (c <= j) dp[j] = min(dp[j], dp[j - c] + 1);
    return dp[amount] >= INT_MAX / 2 ? -1 : dp[amount];
}`,
    py: `def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount
    for j in range(1, amount + 1):
        for c in coins:
            if c <= j and dp[j - c] + 1 < dp[j]:
                dp[j] = dp[j - c] + 1
    return -1 if dp[amount] == INF else dp[amount]`,
    java: `static int coinChange(int[] coins, int amount) {
    int INF = Integer.MAX_VALUE / 2;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int j = 1; j <= amount; j++)
        for (int c : coins) if (c <= j) dp[j] = Math.min(dp[j], dp[j - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}`,
    c: `int coinChange(const int* coins, int k, int amount) {
    int dp[10005];
    dp[0] = 0;
    for (int j = 1; j <= amount; j++) dp[j] = 1000000;
    for (int j = 1; j <= amount; j++)
        for (int i = 0; i < k; i++)
            if (coins[i] <= j && dp[j - coins[i]] + 1 < dp[j])
                dp[j] = dp[j - coins[i]] + 1;
    return dp[amount] > amount ? -1 : dp[amount];
}`
  },
  points: ["dp 初值用 INF/2 而不是 INT_MAX，否则 +1 会整型溢出变成负数", "完全背包的 j 从小到大枚举；0/1 背包则必须从大到小，这是最容易混淆的一点", "返回 -1 的判定要用 >= INF/2，不能用 == INT_MAX"]
},

// 37. 编辑距离
{
  key: "edit-dist", cat: "DP", diff: "困难",
  title: p => `编辑距离（"${p.s}" → "${p.t}"）`,
  desc: p => `求把字符串 "${p.s}" 变成 "${p.t}" 的最少操作次数，允许插入、删除、替换各一次算一步。经典二维 DP：dp[i][j] 表示前 i 个字符变成前 j 个字符的最小代价。`,
  gen: r => {
    const mk = () => Array.from({ length: 3 + r.int(6) }, () => "abc"[r.int(3)]).join("");
    return { s: mk(), t: mk() };
  },
  solve: p => String(editDist(p.s, p.t)),
  inputText: p => `第一行字符串 s = ${p.s}\n第二行字符串 t = ${p.t}`,
  outputText: p => String(editDist(p.s, p.t)),
  code: {
    cpp: `int minDistance(const string& s, const string& t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = s[i-1] == t[j-1]
                ? dp[i-1][j-1]
                : min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
    return dp[n][m];
}`,
    py: `def min_distance(s, t):
    n, m = len(s), len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1): dp[i][0] = i
    for j in range(m + 1): dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i-1] == t[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
    return dp[n][m]`,
    java: `static int minDistance(String s, String t) {
    int n = s.length(), m = t.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = s.charAt(i-1) == t.charAt(j-1)
                ? dp[i-1][j-1]
                : Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1])) + 1;
    return dp[n][m];
}`,
    c: `int minDistance(const char* s, const char* t) {
    int n = strlen(s), m = strlen(t);
    int dp[505][505];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1];
            else {
                int a = dp[i-1][j], b = dp[i][j-1], c2 = dp[i-1][j-1];
                int mn = a < b ? a : b; if (c2 < mn) mn = c2;
                dp[i][j] = mn + 1;
            }
        }
    return dp[n][m];
}`
  },
  points: ["初始化第 0 行/列是把空串变成前缀的代价，漏掉就全错", "字符相等时直接继承 dp[i-1][j-1]，不要再多加 1", "只需上一行时可用滚动数组把空间降到 O(m)，但要用临时变量保存被覆盖的 dp[j-1]"]
},

// 38. 网格最小路径和
{
  key: "min-path-sum", cat: "DP", diff: "中等",
  title: p => `网格最小路径和（${p.n} × ${p.m}）`,
  desc: p => `一个 ${p.n} 行 ${p.m} 列的非负整数网格，从左上角走到右下角，每步只能向右或向下，求路径上数字之和的最小值。dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])。`,
  gen: r => {
    const n = 2 + r.int(3), m = 2 + r.int(3);
    return { n, m, g: Array.from({ length: n }, () => Array.from({ length: m }, () => r.int(10))) };
  },
  solve: p => String(minPathSum(p.g)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.n} 行每行 ${p.m} 个整数：\n${p.g.map(r => r.join(" ")).join("\n")}`,
  outputText: p => String(minPathSum(p.g)),
  code: {
    cpp: `int minPathSum(vector<vector<int>>& g) {
    int n = g.size(), m = g[0].size();
    vector<vector<int>> dp(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (!i && !j) dp[i][j] = g[i][j];
            else if (!i)  dp[i][j] = dp[i][j-1] + g[i][j];
            else if (!j)  dp[i][j] = dp[i-1][j] + g[i][j];
            else dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + g[i][j];
        }
    return dp[n-1][m-1];
}`,
    py: `def min_path_sum(g):
    n, m = len(g), len(g[0])
    dp = [[0] * m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            if i == 0 and j == 0:
                dp[i][j] = g[i][j]
            elif i == 0:
                dp[i][j] = dp[i][j-1] + g[i][j]
            elif j == 0:
                dp[i][j] = dp[i-1][j] + g[i][j]
            else:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + g[i][j]
    return dp[n-1][m-1]`,
    java: `static int minPathSum(int[][] g) {
    int n = g.length, m = g[0].length;
    int[][] dp = new int[n][m];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (i == 0 && j == 0) dp[i][j] = g[i][j];
            else if (i == 0) dp[i][j] = dp[i][j-1] + g[i][j];
            else if (j == 0) dp[i][j] = dp[i-1][j] + g[i][j];
            else dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + g[i][j];
        }
    return dp[n-1][m-1];
}`,
    c: `int minPathSum(int g[105][105], int n, int m) {
    int dp[105][105];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (!i && !j) dp[i][j] = g[i][j];
            else if (!i) dp[i][j] = dp[i][j-1] + g[i][j];
            else if (!j) dp[i][j] = dp[i-1][j] + g[i][j];
            else dp[i][j] = (dp[i-1][j] < dp[i][j-1] ? dp[i-1][j] : dp[i][j-1]) + g[i][j];
        }
    return dp[n-1][m-1];
}`
  },
  points: ["第一行与第一列只有唯一走法，不能套用 min 公式（否则会取到未初始化的 0）", "数组下标越界检查比 min 更划算：先特判边界再走通式", "可以把二维压成一维 dp[j] = min(dp[j], dp[j-1]) + g[i][j]，注意 j=0 时要单独处理"]
},

// 39. 不同路径计数
{
  key: "unique-paths", cat: "DP", diff: "中等",
  title: p => `不同路径计数（${p.n} × ${p.m} 网格）`,
  desc: p => `在 ${p.n} 行 ${p.m} 列的网格里，从左上角走到右下角，每步只能向右或向下，求不同路径总数。结果是组合数 C(n+m-2, n-1)，也可以用滚动数组 DP 递推。`,
  gen: r => ({ n: 2 + r.int(5), m: 2 + r.int(5) }),
  solve: p => String(uniquePaths(p.n, p.m)),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}`,
  outputText: p => String(uniquePaths(p.n, p.m)),
  code: {
    cpp: `int uniquePaths(int n, int m) {
    vector<long long> dp(m, 1);
    for (int i = 1; i < n; i++)
        for (int j = 1; j < m; j++)
            dp[j] += dp[j-1];      // dp[j] 旧值是上方，dp[j-1] 是左侧
    return (int)dp[m-1];
}`,
    py: `def unique_paths(n, m):
    dp = [1] * m
    for i in range(1, n):
        for j in range(1, m):
            dp[j] += dp[j-1]
    return dp[m-1]`,
    java: `static int uniquePaths(int n, int m) {
    int[] dp = new int[m];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++)
        for (int j = 1; j < m; j++)
            dp[j] += dp[j-1];
    return dp[m-1];
}`,
    c: `int uniquePaths(int n, int m) {
    long long dp[105];
    for (int j = 0; j < m; j++) dp[j] = 1;
    for (int i = 1; i < n; i++)
        for (int j = 1; j < m; j++)
            dp[j] += dp[j-1];
    return (int)dp[m-1];
}`
  },
  points: ["滚动数组的关键理解：dp[j] 在更新前是「上方」，dp[j-1] 已更新为「左侧」", "n、m 到 100 时结果会超出 int，必须用 long long，题目通常要求取模 1e9+7", "组合数写法要边乘边除，先算阶乘再除会溢出"]
},

// 40. 完全背包
{
  key: "complete-knapsack", cat: "DP", diff: "中等",
  title: p => `完全背包最大价值（${p.n} 件物品，容量 ${p.cap}）`,
  desc: p => `有 ${p.n} 种物品，每种可以取无限件，第 i 种重量 ${p.items.map(x => x[0]).join("/")}、价值 ${p.items.map(x => x[1]).join("/")}。背包容量 ${p.cap}，求能装下的最大价值。与 0/1 背包唯一区别是容量维度从小到大枚举。`,
  gen: r => {
    const n = 2 + r.int(3);
    return { n, cap: 5 + r.int(16), items: Array.from({ length: n }, () => [1 + r.int(8), 1 + r.int(20)]) };
  },
  solve: p => String(completeKnapsack(p.items, p.cap)),
  inputText: p => `第一行 n = ${p.n}, cap = ${p.cap}\n接下来 ${p.n} 行每行 w v：\n${p.items.map(x => x.join(" ")).join("\n")}`,
  outputText: p => String(completeKnapsack(p.items, p.cap)),
  code: {
    cpp: `int completeKnapsack(vector<pair<int,int>>& items, int cap) {
    vector<int> dp(cap + 1, 0);
    for (int c = 0; c <= cap; c++)          // 从小到大 => 允许重复取
        for (auto& [w, v] : items)
            if (w <= c) dp[c] = max(dp[c], dp[c - w] + v);
    return dp[cap];
}`,
    py: `def complete_knapsack(items, cap):
    dp = [0] * (cap + 1)
    for c in range(cap + 1):
        for w, v in items:
            if w <= c:
                dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]`,
    java: `static int completeKnapsack(int[][] items, int cap) {
    int[] dp = new int[cap + 1];
    for (int c = 0; c <= cap; c++)
        for (int[] it : items)
            if (it[0] <= c) dp[c] = Math.max(dp[c], dp[c - it[0]] + it[1]);
    return dp[cap];
}`,
    c: `int completeKnapsack(int w[], int v[], int n, int cap) {
    int dp[10005];
    for (int i = 0; i <= cap; i++) dp[i] = 0;
    for (int c = 0; c <= cap; c++)
        for (int i = 0; i < n; i++)
            if (w[i] <= c && dp[c - w[i]] + v[i] > dp[c])
                dp[c] = dp[c - w[i]] + v[i];
    return dp[cap];
}`
  },
  points: ["容量从小到大 = 完全背包（同一物品可重复用）；从大到小 = 0/1 背包", "外层循环物品、内层循环容量也能做完全背包，但必须内层从小到大", "求「恰好装满」时把 dp 初值设成 -INF、dp[0]=0，不要用 0 初始化"]
},

// 41. 最长回文子序列
{
  key: "lps", cat: "DP", diff: "中等",
  title: p => `最长回文子序列（s = "${p.s}"）`,
  desc: p => `求字符串 "${p.s}" 中最长回文子序列的长度（子序列可以不相邻）。区间 DP：s[i]==s[j] 时 dp[i][j] = dp[i+1][j-1] + 2，否则取两端舍弃的较大值。`,
  gen: r => ({ s: Array.from({ length: 4 + r.int(7) }, () => "ab"[r.int(2)]).join("") }),
  solve: p => String(lpsLen(p.s)),
  inputText: p => `第一行字符串 s = ${p.s}（长度 ${p.s.length}）`,
  outputText: p => String(lpsLen(p.s)),
  code: {
    cpp: `int longestPalindromeSubseq(const string& s) {
    int n = s.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++)
            dp[i][j] = s[i] == s[j] ? dp[i+1][j-1] + 2
                                    : max(dp[i+1][j], dp[i][j-1]);
    }
    return n ? dp[0][n-1] : 0;
}`,
    py: `def longest_palindrome_subseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1] if n else 0`,
    java: `static int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++)
            dp[i][j] = s.charAt(i) == s.charAt(j)
                ? dp[i+1][j-1] + 2
                : Math.max(dp[i+1][j], dp[i][j-1]);
    }
    return n == 0 ? 0 : dp[0][n-1];
}`,
    c: `int longestPalindromeSubseq(const char* s) {
    int n = strlen(s);
    static int dp[505][505];
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++) {
            if (s[i] == s[j]) dp[i][j] = dp[i+1][j-1] + 2;
            else dp[i][j] = dp[i+1][j] > dp[i][j-1] ? dp[i+1][j] : dp[i][j-1];
        }
    }
    return n ? dp[0][n-1] : 0;
}`
  },
  points: ["i 必须从 n-1 递减，因为 dp[i][j] 依赖 dp[i+1][*]（更靠后的位置）", "子序列 ≠ 子串：求最长回文子串要用中心扩展或马拉车，别混用", "dp 数组较大时用 short 或滚动数组，1000 长度用 int 已是 4MB"]
},

// 42. 逆序对计数
{
  key: "count-inversions", cat: "排序", diff: "困难",
  title: p => `逆序对计数（n = ${p.n}）`,
  desc: p => `统计数组中有多少对 (i, j) 满足 i < j 且 a[i] > a[j]。暴力 O(n²) 会超时，标准解法是归并排序：合并时右半元素出列，就说明它与左半剩余的所有元素都构成逆序对。`,
  gen: r => { const n = 4 + r.int(8); return { n, a: Array.from({ length: n }, () => r.int(21)) }; },
  solve: p => String(countInv(p.a)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => String(countInv(p.a)),
  code: {
    cpp: `long long cnt = 0;
void mergeCount(vector<int>& a, int l, int r, vector<int>& tmp) {
    if (r - l <= 1) return;
    int mid = (l + r) >> 1;
    mergeCount(a, l, mid, tmp);
    mergeCount(a, mid, r, tmp);
    int i = l, j = mid, k = l;
    while (i < mid && j < r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { cnt += mid - i; tmp[k++] = a[j++]; }   // 左半剩余全部构成逆序对
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < r)   tmp[k++] = a[j++];
    for (int t = l; t < r; t++) a[t] = tmp[t];
}`,
    py: `def count_inversions(a):
    cnt = 0
    def sort_cnt(arr):
        nonlocal cnt
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        l, r = sort_cnt(arr[:mid]), sort_cnt(arr[mid:])
        out, i, j = [], 0, 0
        while i < len(l) and j < len(r):
            if l[i] <= r[j]:
                out.append(l[i]); i += 1
            else:
                cnt += len(l) - i
                out.append(r[j]); j += 1
        out += l[i:] + r[j:]
        return out
    sort_cnt(a)
    return cnt`,
    java: `static long cnt = 0;
static void mergeCount(int[] a, int l, int r, int[] tmp) {
    if (r - l <= 1) return;
    int mid = (l + r) >>> 1;
    mergeCount(a, l, mid, tmp);
    mergeCount(a, mid, r, tmp);
    int i = l, j = mid, k = l;
    while (i < mid && j < r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { cnt += mid - i; tmp[k++] = a[j++]; }
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < r)   tmp[k++] = a[j++];
    System.arraycopy(tmp, l, a, l, r - l);
}`,
    c: `long long cnt = 0;
void mergeCount(int* a, int l, int r, int* tmp) {
    if (r - l <= 1) return;
    int mid = (l + r) >> 1;
    mergeCount(a, l, mid, tmp);
    mergeCount(a, mid, r, tmp);
    int i = l, j = mid, k = l;
    while (i < mid && j < r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { cnt += mid - i; tmp[k++] = a[j++]; }
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < r)   tmp[k++] = a[j++];
    for (int t = l; t < r; t++) a[t] = tmp[t];
}`
  },
  points: ["逆序对总数可达 n(n-1)/2，n=1e5 时约 5e9，必须用 long long", "用 <= 而不是 <：相等元素不构成逆序对（严格大于才算）", "树状数组 + 离散化是另一种 O(n log n) 解法，适合需要支持修改的场景"]
}
];

module.exports = { TYPES_C };
