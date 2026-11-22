// 题型模板库 B（15-28）
const TYPES_B = [

// 15. 快速幂
{
  key: "fast-pow", cat: "数学", diff: "中等",
  title: p => `快速幂（a = ${p.a}, b = ${p.b}）`,
  desc: p => `计算 a^b mod 1e9+7，其中 a = ${p.a}、b = ${p.b}。b 可能很大，必须用快速幂做到 O(log b)，不能循环 b 次。`,
  gen: r => { const a = 2 + r.int(500), b = 10 + r.int(100000); return { a, b }; },
  solve: p => { const MOD = 1000000007n; let r = 1n, a = BigInt(p.a) % MOD, b = BigInt(p.b); while (b > 0n) { if (b & 1n) r = r * a % MOD; a = a * a % MOD; b >>= 1n; } return String(r); },
  inputText: p => `一行两个整数 a = ${p.a}, b = ${p.b}`,
  outputText: p => { const MOD = 1000000007n; let r = 1n, a = BigInt(p.a) % MOD, b = BigInt(p.b); while (b > 0n) { if (b & 1n) r = r * a % MOD; a = a * a % MOD; b >>= 1n; } return String(r); },
  code: {
    cpp: `const long long MOD = 1e9 + 7;
long long qpow(long long a, long long b) {
    long long r = 1; a %= MOD;
    for (; b; b >>= 1, a = a * a % MOD)   // b 的每一二进制位
        if (b & 1) r = r * a % MOD;
    return r;
}`,
    py: `MOD = 10**9 + 7
def qpow(a, b):
    r = 1
    a %= MOD
    while b:
        if b & 1: r = r * a % MOD
        a = a * a % MOD
        b >>= 1
    return r
# 内置写法：pow(a, b, MOD) 就是快速幂`,
    java: `static final long MOD = 1_000_000_007L;
static long qpow(long a, long b) {
    long r = 1; a %= MOD;
    while (b > 0) {
        if ((b & 1) == 1) r = r * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return r;
}`,
    c: `#define MOD 1000000007LL
long long qpow(long long a, long long b) {
    long long r = 1; a %= MOD;
    while (b) {
        if (b & 1) r = r * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return r;
}`
  },
  points: ["二进制拆分指数：b=13(1101) 时拆成 a^8 * a^4 * a^1", "每轮底数平方、指数右移，循环次数是 log2(b)", "乘法前先取模，否则 a*a 在 long long 里也可能溢出（模数接近 1e18 时要用龟速乘）"]
},

// 16. 斐波那契
{
  key: "fib", cat: "DP", diff: "简单",
  title: p => `斐波那契第 ${p.n} 项（对 1e9+7 取模）`,
  desc: p => `求斐波那契数列第 ${p.n} 项（F(0)=0, F(1)=1, F(i)=F(i-1)+F(i-2)），结果对 1e9+7 取模。请比较朴素递归、递推、矩阵快速幂三种做法。`,
  gen: r => ({ n: 10 + r.int(60) }),
  solve: p => { let a = 0n, b = 1n; for (let i = 0; i < p.n; i++) { const c = (a + b) % 1000000007n; a = b; b = c; } return String(a); },
  inputText: p => `一行一个整数 n = ${p.n}`,
  outputText: p => { let a = 0n, b = 1n; for (let i = 0; i < p.n; i++) { const c = (a + b) % 1000000007n; a = b; b = c; } return String(a); },
  code: {
    cpp: `// 滚动变量递推：O(n) 时间、O(1) 空间
int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int c = (a + b) % MOD;
        a = b; b = c;
    }
    return a;
}
// n 达 1e18 时用矩阵快速幂 O(log n)`,
    py: `MOD = 10**9 + 7
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, (a + b) % MOD
    return a`,
    java: `static int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int c = (int)(((long)a + b) % 1_000_000_007L);
        a = b; b = c;
    }
    return a;
}`,
    c: `int fib(int n) {
    long long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        long long c = (a + b) % 1000000007LL;
        a = b; b = c;
    }
    return (int)a;
}`
  },
  points: ["朴素递归是 O(2^n)，n=40 就卡住，必须记忆化或递推", "滚动变量把空间从 O(n) 降到 O(1)：只保留最近两项", "n 很大（1e18）时用矩阵快速幂：[[1,1],[1,0]]^n 的左上角就是 F(n+1)"]
},

// 17. 爬楼梯
{
  key: "climb-stairs", cat: "DP", diff: "简单",
  title: p => `爬楼梯方案数（n = ${p.n}）`,
  desc: p => `每次可以爬 1 阶或 2 阶，问爬到第 ${p.n} 阶共有多少种不同走法（对 1e9+7 取模）。`,
  gen: r => ({ n: 5 + r.int(45) }),
  solve: p => { let a = 1n, b = 1n; for (let i = 1; i < p.n; i++) { const c = (a + b) % 1000000007n; a = b; b = c; } return String(b); },
  inputText: p => `一行一个整数 n = ${p.n}`,
  outputText: p => { let a = 1n, b = 1n; for (let i = 1; i < p.n; i++) { const c = (a + b) % 1000000007n; a = b; b = c; } return String(b); },
  code: {
    cpp: `int climbStairs(int n) {
    int a = 1, b = 1;                 // f(0)=1, f(1)=1
    for (int i = 1; i < n; i++) {
        int c = (a + b) % MOD;
        a = b; b = c;
    }
    return b;
}`,
    py: `def climb_stairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b % (10**9 + 7)`,
    java: `static int climbStairs(int n) {
    int a = 1, b = 1;
    for (int i = 1; i < n; i++) {
        int c = (int)(((long)a + b) % 1_000_000_007L);
        a = b; b = c;
    }
    return b;
}`,
    c: `int climbStairs(int n) {
    long long a = 1, b = 1;
    for (int i = 1; i < n; i++) {
        long long c = (a + b) % 1000000007LL;
        a = b; b = c;
    }
    return (int)b;
}`
  },
  points: ["状态定义：f(i) = 到第 i 阶的方案数，转移 f(i)=f(i-1)+f(i-2)", "本质是斐波那契，只是初值不同：f(0)=1,f(1)=1", "扩展：每次可爬 1~m 阶时，用前缀和优化到 O(n)"]
},

// 18. 0-1 背包
{
  key: "knapsack01", cat: "DP", diff: "较难",
  title: p => `0-1 背包（n = ${p.n}，W = ${p.W}）`,
  desc: p => `有 ${p.n} 件物品，第 i 件重量 w[i]、价值 v[i]，背包容量 W = ${p.W}。每件物品最多选一次，求能获得的最大总价值。`,
  gen: r => {
    const n = 3 + r.int(12), W = 10 + r.int(40);
    const w = Array.from({length:n}, () => 1 + r.int(10));
    const v = Array.from({length:n}, () => 1 + r.int(30));
    return { n, W, w, v };
  },
  solve: p => { const dp = new Array(p.W + 1).fill(0); for (let i = 0; i < p.n; i++) for (let j = p.W; j >= p.w[i]; j--) dp[j] = Math.max(dp[j], dp[j - p.w[i]] + p.v[i]); return String(dp[p.W]); },
  inputText: p => `第一行 n = ${p.n}, W = ${p.W}\n第二行 w：${p.w.join(" ")}\n第三行 v：${p.v.join(" ")}`,
  outputText: p => { const dp = new Array(p.W + 1).fill(0); for (let i = 0; i < p.n; i++) for (let j = p.W; j >= p.w[i]; j--) dp[j] = Math.max(dp[j], dp[j - p.w[i]] + p.v[i]); return String(dp[p.W]); },
  code: {
    cpp: `int knapsack(const vector<int>& w, const vector<int>& v, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < (int)w.size(); i++)
        for (int j = W; j >= w[i]; j--)          // 倒序！保证每件只用一次
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}`,
    py: `def knapsack(w, v, W):
    dp = [0] * (W + 1)
    for i in range(len(w)):
        for j in range(W, w[i] - 1, -1):     # 倒序遍历
            dp[j] = max(dp[j], dp[j - w[i]] + v[i])
    return dp[W]`,
    java: `static int knapsack(int[] w, int[] v, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < w.length; i++)
        for (int j = W; j >= w[i]; j--)
            dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}`,
    c: `int knapsack(const int* w, const int* v, int n, int W) {
    int dp[1005] = {0};
    for (int i = 0; i < n; i++)
        for (int j = W; j >= w[i]; j--)
            if (dp[j - w[i]] + v[i] > dp[j]) dp[j] = dp[j - w[i]] + v[i];
    return dp[W];
}`
  },
  points: ["一维滚动数组必须倒序遍历容量，否则同一件物品会被重复选（那就变成完全背包了）", "dp[j] 定义：容量不超过 j 时的最大价值", "求「恰好装满」时初值要设 -INF 而不是 0"]
},

// 19. LIS
{
  key: "lis", cat: "DP", diff: "中等",
  title: p => `最长上升子序列（n = ${p.n}）`,
  desc: p => `给定长度 ${p.n} 的序列，求最长严格递增子序列的长度（子序列不要求连续）。请给出 O(n log n) 的贪心+二分做法。`,
  gen: r => { const n = 6 + r.int(40); const a = Array.from({length:n}, () => r.int(100)); return { n, a }; },
  solve: p => { const t = []; for (const x of p.a) { let l = 0, rr = t.length; while (l < rr) { const m = (l+rr)>>1; if (t[m] < x) l = m + 1; else rr = m; } t[l] = x; if (l === t.length - 1 && t.length) {} } return String(t.length); },
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => { const t = []; for (const x of p.a) { let l = 0, rr = t.length; while (l < rr) { const m = (l+rr)>>1; if (t[m] < x) l = m + 1; else rr = m; } t[l] = x; } return String(t.length); },
  code: {
    cpp: `int lis(const vector<int>& a) {
    vector<int> tails;                       // tails[i] = 长度 i+1 的 LIS 最小结尾
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);   // 接在最长的后面
        else *it = x;                                // 替换，让结尾更小
    }
    return tails.size();
}`,
    py: `import bisect
def lis(a):
    tails = []
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)`,
    java: `static int lis(int[] a) {
    int[] tails = new int[a.length];
    int size = 0;
    for (int x : a) {
        int l = 0, r = size;
        while (l < r) { int m = (l + r) >>> 1; if (tails[m] < x) l = m + 1; else r = m; }
        tails[l] = x;
        if (l == size) size++;
    }
    return size;
}`,
    c: `int lis(const int* a, int n) {
    int* tails = malloc(n * sizeof(int));
    int size = 0;
    for (int i = 0; i < n; i++) {
        int l = 0, r = size;
        while (l < r) { int m = (l + r) / 2; if (tails[m] < a[i]) l = m + 1; else r = m; }
        tails[l] = a[i];
        if (l == size) size++;
    }
    int res = size; free(tails); return res;
}`
  },
  points: ["tails 数组本身不是某个 LIS，但它的长度等于 LIS 长度", "严格递增用 lower_bound；非严格递增（不下降）改用 upper_bound", "朴素 O(n²) 的 dp[i]=max(dp[j]+1) 适合理解，n 大时必须换二分"]
},

// 20. LCS
{
  key: "lcs", cat: "DP", diff: "较难",
  title: p => `最长公共子序列（|A|=${p.a.length}, |B|=${p.b.length}）`,
  desc: p => `求两个字符串 A、B 的最长公共子序列长度。子序列不要求连续，例如 "abcde" 与 "ace" 的 LCS 长为 3。`,
  gen: r => { const mk = (len) => { let s = ""; for (let i = 0; i < len; i++) s += String.fromCharCode(97 + r.int(4)); return s; }; return { a: mk(4 + r.int(8)), b: mk(4 + r.int(8)) }; },
  solve: p => { const n = p.a.length, m = p.b.length; const dp = Array.from({length:n+1},()=>new Array(m+1).fill(0)); for (let i=1;i<=n;i++) for (let j=1;j<=m;j++) dp[i][j] = p.a[i-1]===p.b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]); return String(dp[n][m]); },
  inputText: p => `第一行 A = ${p.a}\n第二行 B = ${p.b}`,
  outputText: p => { const n = p.a.length, m = p.b.length; const dp = Array.from({length:n+1},()=>new Array(m+1).fill(0)); for (let i=1;i<=n;i++) for (let j=1;j<=m;j++) dp[i][j] = p.a[i-1]===p.b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]); return String(dp[n][m]); },
  code: {
    cpp: `int lcs(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = (a[i-1] == b[j-1])
                ? dp[i-1][j-1] + 1
                : max(dp[i-1][j], dp[i][j-1]);
    return dp[n][m];
}`,
    py: `def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            dp[i][j] = dp[i-1][j-1] + 1 if a[i-1] == b[j-1] \\
                       else max(dp[i-1][j], dp[i][j-1])
    return dp[n][m]`,
    java: `static int lcs(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = (a.charAt(i-1) == b.charAt(j-1))
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[n][m];
}`,
    c: `int lcs(const char* a, const char* b) {
    int n = strlen(a), m = strlen(b);
    static int dp[505][505];
    for (int i = 0; i <= n; i++) dp[i][0] = 0;
    for (int j = 0; j <= m; j++) dp[0][j] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1] + 1
                : (dp[i-1][j] > dp[i][j-1] ? dp[i-1][j] : dp[i][j-1]);
    return dp[n][m];
}`
  },
  points: ["dp[i][j] 表示 A 前 i 个和 B 前 j 个的 LCS 长度", "字符相等时继承对角线 +1，否则取左/上较大值", "求具体子序列时要回溯 dp 表；滚动数组可降到 O(min(n,m)) 空间"]
},

// 21. 括号匹配
{
  key: "bracket-match", cat: "栈", diff: "简单",
  title: p => `括号序列合法性（长度 ${p.s.length}）`,
  desc: p => `给定只含 ()[]{} 的字符串（长度 ${p.s.length}），判断是否所有括号都正确配对闭合，输出 YES 或 NO。要求 O(n)。`,
  gen: r => {
    const len = 2 + r.int(14) * 2;
    const pairs = [["(", ")"], ["[", "]"], ["{", "}"]];
    let s = "";
    const good = r.int(2) === 0;
    if (good) {
      // 生成合法序列
      const build = (dep) => {
        if (dep > 3 || s.length >= len) return;
        const p = pairs[r.int(3)];
        s += p[0]; build(dep + 1); s += p[1];
        if (r.int(2)) build(dep + 1);
      };
      while (s.length < len - 1) build(1);
      if (s.length > 12) s = s.slice(0, 12);
    } else {
      let t = ""; for (let i = 0; i < len; i++) t += "()[]{}"[r.int(6)];
      s = t;
    }
    return { s: s || "()" };
  },
  solve: p => { const st = [], m = {")":"(", "]":"[", "}":"{"}; for (const c of p.s) { if ("([{".includes(c)) st.push(c); else if (st.pop() !== m[c]) return "NO"; } return st.length ? "NO" : "YES"; },
  inputText: p => `一行字符串：${p.s}`,
  outputText: p => { const st = [], m = {")":"(", "]":"[", "}":"{"}; for (const c of p.s) { if ("([{".includes(c)) st.push(c); else if (st.pop() !== m[c]) return "NO"; } return st.length ? "NO" : "YES"; },
  code: {
    cpp: `bool isValid(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) return false;                     // 多出右括号
            char t = st.top(); st.pop();
            if ((c == ')' && t != '(') || (c == ']' && t != '[') || (c == '}' && t != '{'))
                return false;
        }
    }
    return st.empty();                                        // 左括号必须清空
}`,
    py: `def is_valid(s):
    st, m = [], {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in "([{": st.append(c)
        elif not st or st.pop() != m[c]: return False
    return not st`,
    java: `static boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else if (st.isEmpty()) return false;
        else { char t = st.pop();
            if ((c == ')' && t != '(') || (c == ']' && t != '[') || (c == '}' && t != '{')) return false; }
    }
    return st.isEmpty();
}`,
    c: `int isValid(const char* s) {
    char st[10005]; int top = 0;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st[top++] = c;
        else {
            if (!top) return 0;
            char t = st[--top];
            if ((c == ')' && t != '(') || (c == ']' && t != '[') || (c == '}' && t != '{')) return 0;
        }
    }
    return top == 0;
}`
  },
  points: ["右括号出现时：栈为空（多右）或栈顶不匹配，直接判否", "遍历结束栈必须为空，否则有未闭合的左括号", "变种：只有一种括号时可用计数器；多种括号必须用栈"]
},

// 22. 下一个更大元素
{
  key: "next-greater", cat: "栈", diff: "中等",
  title: p => `下一个更大元素（n = ${p.n}）`,
  desc: p => `对数组中每个元素，找出它右边第一个比它大的元素值；不存在则输出 -1。要求 O(n)，使用单调栈。`,
  gen: r => { const n = 5 + r.int(15); const a = Array.from({length:n}, () => r.int(50)); return { n, a }; },
  solve: p => { const res = new Array(p.n).fill(-1), st = []; for (let i = 0; i < p.n; i++) { while (st.length && p.a[st[st.length-1]] < p.a[i]) { res[st.pop()] = p.a[i]; } st.push(i); } return res.join(" "); },
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => { const res = new Array(p.n).fill(-1), st = []; for (let i = 0; i < p.n; i++) { while (st.length && p.a[st[st.length-1]] < p.a[i]) { res[st.pop()] = p.a[i]; } st.push(i); } return res.join(" "); },
  code: {
    cpp: `vector<int> nextGreater(const vector<int>& a) {
    int n = a.size();
    vector<int> res(n, -1);
    stack<int> st;                        // 存下标，栈内值单调递减
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.top()] < a[i]) {
            res[st.top()] = a[i];         // 找到了右边第一个更大值
            st.pop();
        }
        st.push(i);
    }
    return res;
}`,
    py: `def next_greater(a):
    n = len(a)
    res = [-1] * n
    st = []                    # 存下标
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
    int* st = malloc(n * sizeof(int)); int top = 0;
    for (int i = 0; i < n; i++) {
        res[i] = -1;
        while (top && a[st[top-1]] < a[i]) res[st[--top]] = a[i];
        st[top++] = i;
    }
    free(st);
}`
  },
  points: ["栈里存下标而不是值，才能回填答案", "每个元素最多入栈出栈各一次，总复杂度 O(n)", "变异：循环数组的两倍长度遍历、求下一个更小元素（比较改 >）"]
},

// 23. 每 k 个一组反转
{
  key: "reverse-k", cat: "链表", diff: "中等",
  title: p => `每 ${p.k} 个一组翻转（n = ${p.n}）`,
  desc: p => `将数组（模拟链表）每 ${p.k} 个元素为一组进行翻转，不足 ${p.k} 个的尾部保持原序。要求空间 O(1)。`,
  gen: r => { const n = 6 + r.int(12); const k = 2 + r.int(4); const a = Array.from({length:n}, (_,i)=>i+1); return { n, k, a }; },
  solve: p => { const a = p.a.slice(); for (let i = 0; i + p.k <= a.length; i += p.k) { let l = i, rr = i + p.k - 1; while (l < rr) { const t = a[l]; a[l] = a[rr]; a[rr] = t; l++; rr--; } } return a.join(" "); },
  inputText: p => `第一行 n = ${p.n}, k = ${p.k}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => { const a = p.a.slice(); for (let i = 0; i + p.k <= a.length; i += p.k) { let l = i, rr = i + p.k - 1; while (l < rr) { const t = a[l]; a[l] = a[rr]; a[rr] = t; l++; rr--; } } return a.join(" "); },
  code: {
    cpp: `// 链表版本：先数长度，再每组内部头插反转
ListNode* reverseKGroup(ListNode* head, int k) {
    int n = 0;
    for (ListNode* p = head; p; p = p->next) n++;
    ListNode dummy(0); dummy.next = head;
    ListNode* pre = &dummy;
    while (n >= k) {
        ListNode* cur = pre->next;
        for (int i = 1; i < k; i++) {          // 头插法反转 k 个
            ListNode* nxt = cur->next;
            cur->next = nxt->next;
            nxt->next = pre->next;
            pre->next = nxt;
        }
        pre = cur; n -= k;
    }
    return dummy.next;
}`,
    py: `def reverse_k_group(a, k):
    a = a[:]
    for i in range(0, len(a) - k + 1, k):
        a[i:i+k] = a[i:i+k][::-1]      # 切片整体翻转
    return a`,
    java: `static int[] reverseKGroup(int[] a, int k) {
    for (int i = 0; i + k <= a.length; i += k)
        for (int l = i, r = i + k - 1; l < r; l++, r--) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
        }
    return a;
}`,
    c: `void reverseKGroup(int* a, int n, int k) {
    for (int i = 0; i + k <= n; i += k)
        for (int l = i, r = i + k - 1; l < r; l++, r--) {
            int t = a[l]; a[l] = a[r]; a[r] = t;
        }
}`
  },
  points: ["必须先判断剩余不足 k 个，尾部不翻转", "链表版本头插法每次把下一个节点插到组首，避免多次遍历", "指针题先在纸上画出 pre/cur/nxt 三个指针的位置"]
},

// 24. 图 BFS 最短路
{
  key: "graph-bfs", cat: "图论", diff: "中等",
  title: p => `无权图单源最短路（n = ${p.n}, m = ${p.m}）`,
  desc: p => `有 ${p.n} 个点、${p.m} 条无向边，求点 0 到点 ${p.t} 的最短边数；不可达输出 -1。要求 O(n+m)。`,
  gen: r => {
    const n = 5 + r.int(10);
    const m = n - 1 + r.int(8);
    const edges = [];
    for (let i = 1; i < n; i++) edges.push([i - 1, i]);
    for (let i = 0; i < m - (n - 1); i++) { const u = r.int(n), v = r.int(n); if (u !== v) edges.push([u, v]); }
    return { n, m: edges.length, edges, t: n - 1 };
  },
  solve: p => {
    const g = Array.from({length:p.n}, () => []);
    p.edges.forEach(([u,v]) => { g[u].push(v); g[v].push(u); });
    const d = new Array(p.n).fill(-1); d[0] = 0; const q = [0];
    while (q.length) { const u = q.shift(); for (const v of g[u]) if (d[v] === -1) { d[v] = d[u] + 1; q.push(v); } }
    return String(d[p.t]);
  },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行每行一条边 u v：\n${p.edges.map(e=>e.join(" ")).join("\n")}`,
  outputText: p => {
    const g = Array.from({length:p.n}, () => []);
    p.edges.forEach(([u,v]) => { g[u].push(v); g[v].push(u); });
    const d = new Array(p.n).fill(-1); d[0] = 0; const q = [0];
    while (q.length) { const u = q.shift(); for (const v of g[u]) if (d[v] === -1) { d[v] = d[u] + 1; q.push(v); } }
    return String(d[p.t]);
  },
  code: {
    cpp: `int bfsShortest(int n, const vector<vector<int>>& g, int s, int t) {
    vector<int> dist(n, -1);
    queue<int> q;
    dist[s] = 0; q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (u == t) return dist[u];
        for (int v : g[u])
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return -1;                        // 不可达
}`,
    py: `from collections import deque
def bfs_shortest(n, g, s, t):
    dist = [-1] * n
    dist[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        if u == t: return dist[u]
        for v in g[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return -1`,
    java: `static int bfsShortest(int n, List<List<Integer>> g, int s, int t) {
    int[] dist = new int[n];
    Arrays.fill(dist, -1);
    dist[s] = 0;
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(s);
    while (!q.isEmpty()) {
        int u = q.poll();
        if (u == t) return dist[u];
        for (int v : g.get(u))
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q.offer(v); }
    }
    return -1;
}`,
    c: `int bfsShortest(int n, int g[][105], int* deg, int s, int t) {
    int dist[105]; for (int i = 0; i < n; i++) dist[i] = -1;
    int q[105], h = 0, tl = 0;
    dist[s] = 0; q[tl++] = s;
    while (h < tl) {
        int u = q[h++];
        if (u == t) return dist[u];
        for (int i = 0; i < deg[u]; i++) {
            int v = g[u][i];
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q[tl++] = v; }
        }
    }
    return -1;
}`
  },
  points: ["BFS 第一次访问某点时的距离就是最短距离，所以入队时标记已访问", "无向图每条边要加两次", "边权全为 1 才可用 BFS；有不同权值要换 Dijkstra"]
},

// 25. Dijkstra
{
  key: "dijkstra", cat: "图论", diff: "较难",
  title: p => `堆优化 Dijkstra（n = ${p.n}, m = ${p.m}）`,
  desc: p => `有 ${p.n} 个点、${p.m} 条带非负权有向边，求源点 0 到所有点的最短距离，不可达输出 -1。要求 O(m log n)。`,
  gen: r => {
    const n = 4 + r.int(6);
    const edges = [];
    for (let i = 1; i < n; i++) edges.push([r.int(i), i, 1 + r.int(9)]);
    for (let i = 0; i < r.int(6); i++) { const u = r.int(n), v = r.int(n); if (u !== v) edges.push([u, v, 1 + r.int(9)]); }
    return { n, m: edges.length, edges };
  },
  solve: p => {
    const g = Array.from({length:p.n}, () => []);
    p.edges.forEach(([u,v,w]) => g[u].push([v,w]));
    const d = new Array(p.n).fill(Infinity); d[0] = 0;
    const pq = [[0,0]];
    while (pq.length) {
      pq.sort((a,b)=>a[0]-b[0]);
      const [du,u] = pq.shift();
      if (du > d[u]) continue;
      for (const [v,w] of g[u]) if (du + w < d[v]) { d[v] = du + w; pq.push([d[v], v]); }
    }
    return d.map(x => x === Infinity ? -1 : x).join(" ");
  },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行 u v w：\n${p.edges.map(e=>e.join(" ")).join("\n")}`,
  outputText: p => {
    const g = Array.from({length:p.n}, () => []);
    p.edges.forEach(([u,v,w]) => g[u].push([v,w]));
    const d = new Array(p.n).fill(Infinity); d[0] = 0;
    const pq = [[0,0]];
    while (pq.length) {
      pq.sort((a,b)=>a[0]-b[0]);
      const [du,u] = pq.shift();
      if (du > d[u]) continue;
      for (const [v,w] of g[u]) if (du + w < d[v]) { d[v] = du + w; pq.push([d[v], v]); }
    }
    return d.map(x => x === Infinity ? -1 : x).join(" ");
  },
  code: {
    cpp: `vector<long long> dijkstra(int n, vector<vector<pair<int,int>>>& g, int s) {
    vector<long long> dist(n, LLONG_MAX);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;               // 过期记录，跳过
        for (auto [v, w] : g[u])
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
    }
    return dist;
}`,
    py: `import heapq
def dijkstra(n, g, s):
    dist = [float('inf')] * n
    dist[s] = 0
    pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
    java: `static long[] dijkstra(int n, List<List<int[]>> g, int s) {
    long[] dist = new long[n];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[s] = 0;
    PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));
    pq.offer(new long[]{0, s});
    while (!pq.isEmpty()) {
        long[] t = pq.poll();
        long d = t[0]; int u = (int) t[1];
        if (d > dist[u]) continue;
        for (int[] e : g.get(u))
            if (d + e[1] < dist[e[0]]) {
                dist[e[0]] = d + e[1];
                pq.offer(new long[]{dist[e[0]], e[0]});
            }
    }
    return dist;
}`,
    c: `// O(n^2) 朴素版（n <= 1000 可接受）
void dijkstra(int n, int g[][505], int s, long long* dist) {
    int done[505] = {0};
    for (int i = 0; i < n; i++) dist[i] = (i == s ? 0 : LLONG_MAX);
    for (int it = 0; it < n; it++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!done[i] && (u == -1 || dist[i] < dist[u])) u = i;
        if (u == -1 || dist[u] == LLONG_MAX) break;
        done[u] = 1;
        for (int v = 0; v < n; v++)
            if (g[u][v] != INT_MAX && dist[u] + g[u][v] < dist[v])
                dist[v] = dist[u] + g[u][v];
    }
}`
  },
  points: ["弹出时 d > dist[u] 说明是过期记录，必须 continue，否则复杂度退化", "Dijkstra 不能处理负权边，负权请用 Bellman-Ford / SPFA", "dist 用 long long，多段路径累加可能超过 int"]
},

// 26. 并查集
{
  key: "union-find", cat: "图论", diff: "中等",
  title: p => `连通分量计数（n = ${p.n}, m = ${p.m}）`,
  desc: p => `有 ${p.n} 个点、${p.m} 条无向边，求图中有多少个连通分量。要求使用并查集，均摊复杂度接近 O(1)。`,
  gen: r => {
    const n = 5 + r.int(10);
    const edges = [];
    for (let i = 1; i < n; i++) if (r.int(3)) edges.push([i - 1, i]);
    for (let i = 0; i < r.int(4); i++) { const u = r.int(n), v = r.int(n); if (u !== v) edges.push([u, v]); }
    return { n, m: edges.length, edges };
  },
  solve: p => {
    const fa = Array.from({length:p.n}, (_, i) => i);
    const find = x => fa[x] === x ? x : (fa[x] = find(fa[x]));
    p.edges.forEach(([u,v]) => { fa[find(u)] = find(v); });
    return String(new Set(Array.from({length:p.n}, (_, i) => find(i))).size);
  },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行 u v：\n${p.edges.map(e=>e.join(" ")).join("\n")}`,
  outputText: p => {
    const fa = Array.from({length:p.n}, (_, i) => i);
    const find = x => fa[x] === x ? x : (fa[x] = find(fa[x]));
    p.edges.forEach(([u,v]) => { fa[find(u)] = find(v); });
    return String(new Set(Array.from({length:p.n}, (_, i) => find(i))).size);
  },
  code: {
    cpp: `int fa[N];
void init(int n) { for (int i = 0; i < n; i++) fa[i] = i; }
int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }   // 路径压缩
void merge(int a, int b) { fa[find(a)] = find(b); }
// 连通分量数 = find(i) == i 的个数`,
    py: `fa = list(range(n))
def find(x):
    while fa[x] != x:
        fa[x] = fa[fa[x]]        # 路径压缩
        x = fa[x]
    return x
def merge(a, b):
    fa[find(a)] = find(b)
comp = len({find(i) for i in range(n)})`,
    java: `static int[] fa;
static void init(int n) { fa = new int[n]; for (int i = 0; i < n; i++) fa[i] = i; }
static int find(int x) { return fa[x] == x ? x : (fa[x] = find(fa[x])); }
static void merge(int a, int b) { fa[find(a)] = find(b); }`,
    c: `int fa[100005];
int find(int x) { return fa[x] == x ? x : (fa[x] = find(fa[x])); }
void merge(int a, int b) { fa[find(a)] = find(b); }
// 初始化：for (int i = 0; i < n; i++) fa[i] = i;`
  },
  points: ["路径压缩让树变扁平，find 均摊接近 O(1)", "按秩/按大小合并可以进一步保证树高 O(log n)", "并查集只支持合并、不支持拆分；需要拆分时用「离线倒序」技巧"]
},

// 27. 拓扑排序
{
  key: "topo-sort", cat: "图论", diff: "中等",
  title: p => `拓扑排序判定（n = ${p.n}, m = ${p.m}）`,
  desc: p => `有 ${p.n} 个任务、${p.m} 条依赖关系（u → v 表示 u 必须先于 v），判断能否排出合法顺序，能则输出 YES 并给出任意一种顺序，否则输出 NO（存在环）。`,
  gen: r => {
    const n = 4 + r.int(6);
    const edges = [];
    for (let i = 1; i < n; i++) if (r.int(2)) edges.push([r.int(i), i]);
    for (let i = 0; i < r.int(3); i++) { const u = r.int(n), v = r.int(n); if (u < v) edges.push([u, v]); }
    return { n, m: edges.length, edges };
  },
  solve: p => {
    const g = Array.from({length:p.n}, () => []), indeg = new Array(p.n).fill(0);
    p.edges.forEach(([u,v]) => { g[u].push(v); indeg[v]++; });
    const q = []; for (let i = 0; i < p.n; i++) if (!indeg[i]) q.push(i);
    const order = [];
    while (q.length) { const u = q.shift(); order.push(u); for (const v of g[u]) if (--indeg[v] === 0) q.push(v); }
    return order.length === p.n ? `YES\n${order.join(" ")}` : "NO";
  },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行 u v：\n${p.edges.map(e=>e.join(" ")).join("\n") || "（无边）"}`,
  outputText: p => {
    const g = Array.from({length:p.n}, () => []), indeg = new Array(p.n).fill(0);
    p.edges.forEach(([u,v]) => { g[u].push(v); indeg[v]++; });
    const q = []; for (let i = 0; i < p.n; i++) if (!indeg[i]) q.push(i);
    const order = [];
    while (q.length) { const u = q.shift(); order.push(u); for (const v of g[u]) if (--indeg[v] === 0) q.push(v); }
    return order.length === p.n ? `YES\n${order.join(" ")}` : "NO";
  },
  code: {
    cpp: `vector<int> topo(int n, const vector<vector<int>>& g, vector<int> indeg) {
    queue<int> q;
    for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return order;        // order.size() < n 表示有环
}`,
    py: `from collections import deque
def topo(n, g, indeg):
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order        # len(order) < n 表示有环`,
    java: `static List<Integer> topo(int n, List<List<Integer>> g, int[] indeg) {
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return order;
}`,
    c: `int topo(int n, int g[][105], int* deg, int* order) {
    int indeg[105], cnt = 0;
    for (int i = 0; i < n; i++) indeg[i] = 0;
    for (int u = 0; u < n; u++)
        for (int i = 0; i < deg[u]; i++) indeg[g[u][i]]++;
    int q[105], h = 0, tl = 0;
    for (int i = 0; i < n; i++) if (!indeg[i]) q[tl++] = i;
    while (h < tl) {
        int u = q[h++];
        order[cnt++] = u;
        for (int i = 0; i < deg[u]; i++)
            if (--indeg[g[u][i]] == 0) q[tl++] = g[u][i];
    }
    return cnt;      // cnt < n 表示有环
}`
  },
  points: ["入度为 0 的点可以立即执行，执行后把邻居入度减 1", "最终输出点数少于 n 说明有环（这些点互相等待）", "需要字典序最小的拓扑序时，把队列换成小根堆"]
},

// 28. 矩阵转置
{
  key: "matrix-transpose", cat: "数组", diff: "简单",
  title: p => `矩阵转置（${p.n} × ${p.m}）`,
  desc: p => `给定 ${p.n} 行 ${p.m} 列的矩阵，输出它的转置（${p.m} 行 ${p.n} 列）。请理清下标变换关系并用一维数组模拟二维。`,
  gen: r => {
    const n = 2 + r.int(4), m = 2 + r.int(4);
    const mat = Array.from({length:n}, () => Array.from({length:m}, () => r.int(20)));
    return { n, m, mat };
  },
  solve: p => { const out = []; for (let j = 0; j < p.m; j++) { const row = []; for (let i = 0; i < p.n; i++) row.push(p.mat[i][j]); out.push(row.join(" ")); } return out.join("\n"); },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.n} 行每行 ${p.m} 个整数：\n${p.mat.map(r=>r.join(" ")).join("\n")}`,
  outputText: p => { const out = []; for (let j = 0; j < p.m; j++) { const row = []; for (let i = 0; i < p.n; i++) row.push(p.mat[i][j]); out.push(row.join(" ")); } return out.join("\n"); },
  code: {
    cpp: `vector<vector<int>> transpose(const vector<vector<int>>& a) {
    int n = a.size(), m = a[0].size();
    vector<vector<int>> t(m, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            t[j][i] = a[i][j];        // 行列互换
    return t;
}`,
    py: `def transpose(a):
    return [list(row) for row in zip(*a)]    # zip(*a) 即转置`,
    java: `static int[][] transpose(int[][] a) {
    int n = a.length, m = a[0].length;
    int[][] t = new int[m][n];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) t[j][i] = a[i][j];
    return t;
}`,
    c: `void transpose(int a[][105], int t[][105], int n, int m) {
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) t[j][i] = a[i][j];
}`
  },
  points: ["转置后行列数互换：n×m 变 m×n，动态分配时要注意", "Python 的 zip(*a) 是最优雅写法，返回元组需要转 list", "原地转置只能对方阵做（交换 a[i][j] 与 a[j][i]）"]
}
];

module.exports = { TYPES_B };
