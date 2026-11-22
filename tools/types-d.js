// 题型模板库 D（43-56）：树 / 堆 / 字符串处理 / 位运算 / 回溯 / 矩阵 / 图论 / 模拟

const INF_D = 1e9;

// ---- 复用工具 ----
const heapChildren = i => [2 * i + 1, 2 * i + 2];

function makeTree(r, n) {
  return { n, v: Array.from({ length: n }, () => 1 + r.int(90)) };
}
function inorderTree(t) {
  const out = [];
  const go = i => {
    if (i >= t.n) return;
    const [l, rr] = heapChildren(i);
    go(l); out.push(t.v[i]); go(rr);
  };
  go(0);
  return out;
}
function heightTree(t) {
  const go = i => {
    if (i >= t.n) return 0;
    const [l, r] = heapChildren(i);
    return 1 + Math.max(go(l), go(r));
  };
  return go(0);
}
function popcount(x) { let c = 0; while (x) { x &= x - 1; c++; } return c; }
function rle(s) {
  const out = [];
  for (const ch of s) {
    if (out.length && out[out.length - 1][0] === ch) out[out.length - 1][1]++;
    else out.push([ch, 1]);
  }
  return out.map(([c, k]) => c + k).join("");
}
function anagramPairs(words) {
  const g = new Map();
  for (const w of words) {
    const k = w.split("").sort().join("");
    g.set(k, (g.get(k) || 0) + 1);
  }
  let cnt = 0;
  for (const m of g.values()) cnt += m * (m - 1) / 2;
  return cnt;
}
function subsetCount(a, target) {
  const dp = Array(target + 1).fill(0);
  dp[0] = 1;
  for (const x of a) for (let j = target; j >= x; j--) dp[j] += dp[j - x];
  return dp[target];
}
function nQueens(n) {
  let cnt = 0;
  const col = Array(n).fill(false), d1 = Array(2 * n).fill(false), d2 = Array(2 * n).fill(false);
  const go = row => {
    if (row === n) { cnt++; return; }
    for (let c = 0; c < n; c++) {
      const a = row + c, b = row - c + n;
      if (col[c] || d1[a] || d2[b]) continue;
      col[c] = d1[a] = d2[b] = true;
      go(row + 1);
      col[c] = d1[a] = d2[b] = false;
    }
  };
  go(0);
  return cnt;
}
function spiral(g) {
  const out = [];
  let t = 0, b = g.length - 1, l = 0, r = g[0].length - 1;
  while (t <= b && l <= r) {
    for (let j = l; j <= r; j++) out.push(g[t][j]);
    t++;
    for (let i = t; i <= b; i++) out.push(g[i][r]);
    r--;
    if (t <= b) { for (let j = r; j >= l; j--) out.push(g[b][j]); b--; }
    if (l <= r) { for (let i = b; i >= t; i--) out.push(g[i][l]); l++; }
  }
  return out;
}
function floydAll(m) {
  const n = m.length;
  const d = m.map(row => row.slice());
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
}
function activityMax(iv) {
  const s = iv.slice().sort((a, b) => a[1] - b[1]);
  let cnt = 0, last = -Infinity;
  for (const [l, r] of s) if (l >= last) { cnt++; last = r; }
  return cnt;
}
function evalRpn(tokens) {
  const st = [];
  for (const t of tokens) {
    if ("+-*".includes(t) && t.length === 1) {
      const b = st.pop(), a = st.pop();
      st.push(t === "+" ? a + b : t === "-" ? a - b : a * b);
    } else st.push(Number(t));
  }
  return st[0];
}
function josephus(n, k) {
  let ans = 0;
  for (let i = 2; i <= n; i++) ans = (ans + k) % i;
  return ans + 1;
}

const TYPES_D = [

// 43. 二叉树中序遍历
{
  key: "tree-inorder", cat: "树", diff: "简单",
  title: p => `二叉树的中序遍历（${p.n} 个结点）`,
  desc: p => `二叉树用数组存储：结点 i 的左孩子是 2i+1、右孩子是 2i+2，下标越界表示空结点。这是一棵 ${p.n} 个结点的完全二叉树样式的结构，请输出它的中序遍历序列（左-根-右）。`,
  gen: r => makeTree(r, 5 + r.int(7)),
  solve: p => inorderTree(p).join(" "),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个结点值（下标 0..${p.n - 1}）：${p.v.join(" ")}`,
  outputText: p => inorderTree(p).join(" "),
  code: {
    cpp: `vector<int> inorder(TreeNode* root) {
    vector<int> res;
    function<void(TreeNode*)> go = [&](TreeNode* u) {
        if (!u) return;
        go(u->left);
        res.push_back(u->val);
        go(u->right);
    };
    go(root);
    return res;
}`,
    py: `def inorder(root):
    res = []
    def go(u):
        if not u: return
        go(u.left); res.append(u.val); go(u.right)
    go(root)
    return res`,
    java: `static void inorder(TreeNode u, List<Integer> res) {
    if (u == null) return;
    inorder(u.left, res);
    res.add(u.val);
    inorder(u.right, res);
}`,
    c: `void inorder(Node* u, int* res, int* k) {
    if (!u) return;
    inorder(u->left, res, k);
    res[(*k)++] = u->val;
    inorder(u->right, res, k);
}`
  },
  points: ["中序 = 左-根-右，前序把输出提到递归前、后序放到递归后", "数组存二叉树时判断空结点用下标 >= n，不要用值判断（值可能为 0）", "递归深度等于树高，极端链表形状的树要改成显式栈迭代"]
},

// 44. 二叉树高度
{
  key: "tree-height", cat: "树", diff: "简单",
  title: p => `二叉树的深度（${p.n} 个结点）`,
  desc: p => `同样用数组形式给出 ${p.n} 个结点的二叉树（左孩子 2i+1、右孩子 2i+2），求树的高度（结点数计的层数，空树高度为 0）。递归定义：height = max(左高, 右高) + 1。`,
  gen: r => makeTree(r, 5 + r.int(9)),
  solve: p => String(heightTree(p)),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个结点值：${p.v.join(" ")}`,
  outputText: p => String(heightTree(p)),
  code: {
    cpp: `int height(TreeNode* u) {
    if (!u) return 0;
    return 1 + max(height(u->left), height(u->right));
}`,
    py: `def height(u):
    if not u:
        return 0
    return 1 + max(height(u.left), height(u.right))`,
    java: `static int height(TreeNode u) {
    if (u == null) return 0;
    return 1 + Math.max(height(u.left), height(u.right));
}`,
    c: `int height(Node* u) {
    if (!u) return 0;
    int l = height(u->left), r = height(u->right);
    return 1 + (l > r ? l : r);
}`
  },
  points: ["空树返回 0 还是 -1 取决于定义（按层数是 0，按边数是 -1），答题目约定", "完全二叉树的高度是 floor(log2(n)) + 1，可以直接算，但一般树必须递归", "求直径时要在每层更新 max(左高+右高)，不能只返回高度"]
},

// 45. 第 k 大元素
{
  key: "heap-kth", cat: "堆", diff: "中等",
  title: p => `数组中的第 ${p.k} 大元素（n = ${p.n}）`,
  desc: p => `在 ${p.n} 个整数中找出第 ${p.k} 大的元素（重复元素按位置计数）。固定大小 k 的小根堆是标准解法：堆顶就是第 k 大，时间 O(n log k)，空间 O(k)。`,
  gen: r => {
    const n = 6 + r.int(14);
    const k = 1 + r.int(Math.min(5, n) - 1);
    return { n, k, a: Array.from({ length: n }, () => r.int(80)) };
  },
  solve: p => String(p.a.slice().sort((x, y) => y - x)[p.k - 1]),
  inputText: p => `第一行 n = ${p.n}, k = ${p.k}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => String(p.a.slice().sort((x, y) => y - x)[p.k - 1]),
  code: {
    cpp: `int findKthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;   // 小根堆
    for (int x : a) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();   // 只保留最大的 k 个
    }
    return pq.top();
}`,
    py: `import heapq

def find_kth_largest(a, k):
    h = []
    for x in a:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]`,
    java: `static int findKthLargest(int[] a, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int x : a) {
        pq.offer(x);
        if (pq.size() > k) pq.poll();
    }
    return pq.peek();
}`,
    c: `// 手写小根堆（数组实现），heap[0] 为堆顶
void push(int* h, int* sz, int x) {
    int i = (*sz)++; h[i] = x;
    while (i && h[(i - 1) / 2] > h[i]) {
        int t = h[i]; h[i] = h[(i - 1) / 2]; h[(i - 1) / 2] = t; i = (i - 1) / 2;
    }
}
void pop(int* h, int* sz) {
    h[0] = h[--(*sz)];
    int i = 0;
    while (1) {
        int l = 2 * i + 1, r = l + 1, mn = i;
        if (l < *sz && h[l] < h[mn]) mn = l;
        if (r < *sz && h[r] < h[mn]) mn = r;
        if (mn == i) break;
        int t = h[i]; h[i] = h[mn]; h[mn] = t; i = mn;
    }
}`
  },
  points: ["求第 k 大用小根堆、求第 k 小用大根堆，方向别搞反", "堆大小固定为 k，多出来的立刻弹出，否则复杂度退化成 O(n log n)", "快选（quickselect）平均 O(n)，但最坏 O(n²)，面试可两者都提"]
},

// 46. 字符串压缩
{
  key: "rle", cat: "字符串", diff: "简单",
  title: p => `行程长度压缩（s = "${p.s}"）`,
  desc: p => `把连续重复的字符压缩成「字符 + 次数」的形式，例如 "aaabbc" 压缩为 "a3b2c1"。请按顺序输出压缩结果，注意单次出现的字符也要带上次数 1。`,
  gen: r => {
    const alpha = "abc";
    let s = "";
    let last = "";
    for (let i = 0; i < 5 + r.int(8); i++) {
      let c = alpha[r.int(3)];
      while (c === last) c = alpha[r.int(3)];
      s += c; last = c;
    }
    return { s };
  },
  solve: p => rle(p.s),
  inputText: p => `第一行字符串 s = ${p.s}（长度 ${p.s.length}）`,
  outputText: p => rle(p.s),
  code: {
    cpp: `string compress(const string& s) {
    string out;
    for (int i = 0; i < (int)s.size(); ) {
        int j = i;
        while (j < (int)s.size() && s[j] == s[i]) j++;
        out += s[i];
        out += to_string(j - i);
        i = j;
    }
    return out;
}`,
    py: `from itertools import groupby

def compress(s):
    return "".join(c + str(len(list(g))) for c, g in groupby(s))`,
    java: `static String compress(String s) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); ) {
        int j = i;
        while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
        sb.append(s.charAt(i)).append(j - i);
        i = j;
    }
    return sb.toString();
}`,
    c: `void compress(const char* s, char* out) {
    int k = 0;
    for (int i = 0; s[i]; ) {
        int j = i;
        while (s[j] && s[j] == s[i]) j++;
        out[k++] = s[i];
        k += sprintf(out + k, "%d", j - i);
        i = j;
    }
    out[k] = 0;
}`
  },
  points: ["用双指针 i/j 找相同段的边界比逐字符计数更不容易错", "数字超过 9 时要输出多位，用 to_string 而不是 char 强转", "如果要求「压缩后不变短就返回原串」，压缩完要比较长度"]
},

// 47. 字母异位词配对
{
  key: "anagram-pairs", cat: "字符串", diff: "中等",
  title: p => `字母异位词对的数量（${p.words.length} 个单词）`,
  desc: p => `给定 ${p.words.length} 个仅含小写字母的单词，统计有多少对 (i, j)（i < j）互为字母异位词（字符组成完全相同、顺序不同）。把所有单词按「字符排序后的串」分组，组内两两配对即可。`,
  gen: r => {
    const bases = ["abc", "aab", "abb", "abcd", "acb", "bca"];
    const k = 4 + r.int(5);
    const words = [];
    for (let i = 0; i < k; i++) {
      const b = bases[r.int(bases.length)].split("");
      for (let t = b.length - 1; t > 0; t--) { const j = r.int(t + 1); [b[t], b[j]] = [b[j], b[t]]; }
      words.push(b.join(""));
    }
    return { words };
  },
  solve: p => String(anagramPairs(p.words)),
  inputText: p => `第一行 k = ${p.words.length}\n接下来 ${p.words.length} 行每行一个单词：\n${p.words.join("\n")}`,
  outputText: p => String(anagramPairs(p.words)),
  code: {
    cpp: `int countPairs(const vector<string>& words) {
    unordered_map<string, int> g;
    for (auto w : words) { sort(w.begin(), w.end()); g[w]++; }
    int cnt = 0;
    for (auto& [k, v] : g) cnt += v * (v - 1) / 2;
    return cnt;
}`,
    py: `from collections import Counter

def count_pairs(words):
    g = Counter("".join(sorted(w)) for w in words)
    return sum(v * (v - 1) // 2 for v in g.values())`,
    java: `static int countPairs(String[] words) {
    Map<String, Integer> g = new HashMap<>();
    for (String w : words) {
        char[] c = w.toCharArray();
        Arrays.sort(c);
        g.merge(new String(c), 1, Integer::sum);
    }
    int cnt = 0;
    for (int v : g.values()) cnt += v * (v - 1) / 2;
    return cnt;
}`,
    c: `int cmpCh(const void* a, const void* b) { return *(const char*)a - *(const char*)b; }
// 简易哈希：26 个字母的计数向量拼成 key
void makeKey(const char* w, char* key) {
    int cnt[26] = {0};
    for (int i = 0; w[i]; i++) cnt[w[i] - 'a']++;
    int k = 0;
    for (int i = 0; i < 26; i++) k += sprintf(key + k, "%d,", cnt[i]);
}`
  },
  points: ["排序后作 key 是最直观写法，O(L log L)；用 26 位计数数组作 key 可降到 O(L)", "组内有 m 个元素时贡献 C(m,2) = m(m-1)/2 对，不要漏乘", "计数可能超 int，n 很大时用 long long"]
},

// 48. 二进制 1 的总数
{
  key: "bit-count-range", cat: "位运算", diff: "中等",
  title: p => `1 到 ${p.n} 的二进制中 1 的总数`,
  desc: p => `统计从 1 到 ${p.n}（含）所有整数的二进制表示里 1 的总个数。逐个 popcount 是 O(n log n)；规律解法按位统计，每一位上 1 的个数为 (n+1)/(2^(i+1))*2^i 加余数部分，可做到 O(log n)。`,
  gen: r => ({ n: 5 + r.int(200) }),
  solve: p => { let s = 0; for (let i = 1; i <= p.n; i++) s += popcount(i); return String(s); },
  inputText: p => `第一行一个整数 n = ${p.n}`,
  outputText: p => { let s = 0; for (let i = 1; i <= p.n; i++) s += popcount(i); return String(s); },
  code: {
    cpp: `int countOnes(int n) {
    int cnt = 0;
    for (int i = 1; i <= n; i++) {
        int x = i;
        while (x) { x &= x - 1; cnt++; }   // 每次消掉最低位的 1
    }
    return cnt;
}`,
    py: `def count_ones(n):
    return sum(bin(i).count("1") for i in range(1, n + 1))`,
    java: `static int countOnes(int n) {
    int cnt = 0;
    for (int i = 1; i <= n; i++) cnt += Integer.bitCount(i);
    return cnt;
}`,
    c: `int countOnes(int n) {
    int cnt = 0;
    for (int i = 1; i <= n; i++) {
        int x = i;
        while (x) { x &= x - 1; cnt++; }
    }
    return cnt;
}`
  },
  points: ["x & (x-1) 每次消掉最低位的 1，循环次数等于 1 的个数，比逐位判断更快", "n 到 1e9 时必须用按位统计的 O(log n) 公式，暴力会超时", "GCC 有 __builtin_popcount，Java 有 Integer.bitCount，Python 用 bin().count('1')"]
},

// 49. 只出现一次的数
{
  key: "xor-single", cat: "位运算", diff: "简单",
  title: p => `只出现一次的数字（n = ${p.a.length}）`,
  desc: p => `数组中除了一个数只出现一次，其余每个数都恰好出现两次，找出这个数。要求 O(n) 时间、O(1) 空间：把所有数异或起来，成对的数互相抵消为 0，剩下的就是答案。`,
  gen: r => {
    const u = 1 + r.int(50);
    const p1 = 51 + r.int(20), p2 = 72 + r.int(20);
    const a = [u, p1, p1, p2, p2, 92 + r.int(8), 92 + r.int(8)];
    for (let i = a.length - 1; i > 0; i--) { const j = r.int(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return { u, a };
  },
  solve: p => String(p.a.reduce((x, y) => x ^ y, 0)),
  inputText: p => `第一行 n = ${p.a.length}\n第二行 ${p.a.length} 个整数：${p.a.join(" ")}`,
  outputText: p => String(p.a.reduce((x, y) => x ^ y, 0)),
  code: {
    cpp: `int singleNumber(const vector<int>& a) {
    int ans = 0;
    for (int x : a) ans ^= x;   // 成对的异或为 0
    return ans;
}`,
    py: `def single_number(a):
    from functools import reduce
    from operator import xor
    return reduce(xor, a, 0)`,
    java: `static int singleNumber(int[] a) {
    int ans = 0;
    for (int x : a) ans ^= x;
    return ans;
}`,
    c: `int singleNumber(const int* a, int n) {
    int ans = 0;
    for (int i = 0; i < n; i++) ans ^= a[i];
    return ans;
}`
  },
  points: ["异或三条性质：a^a=0、a^0=a、异或满足交换律与结合律", "若有「两个」数各出现一次，先全部异或得到 x^y，再取最低位的 1 分组求解", "若每个数出现三次，要用「逐位统计 mod 3」而不是异或"]
},

// 50. 子集和方案数
{
  key: "subset-count", cat: "DP", diff: "中等",
  title: p => `子集和等于 ${p.target} 的方案数（n = ${p.n}）`,
  desc: p => `给定 ${p.n} 个正整数，从中选出若干个数（每个最多选一次），使它们的和恰好等于 ${p.target}，求方案数。这是 0/1 背包计数：dp[j] += dp[j-a[i]]，容量维度必须从大到小枚举。`,
  gen: r => {
    const n = 4 + r.int(4);
    return { n, a: Array.from({ length: n }, () => 1 + r.int(6)), target: 3 + r.int(12) };
  },
  solve: p => String(subsetCount(p.a, p.target)),
  inputText: p => `第一行 n = ${p.n}, target = ${p.target}\n第二行 ${p.n} 个正整数：${p.a.join(" ")}`,
  outputText: p => String(subsetCount(p.a, p.target)),
  code: {
    cpp: `int countSubset(const vector<int>& a, int target) {
    vector<long long> dp(target + 1, 0);
    dp[0] = 1;
    for (int x : a)
        for (int j = target; j >= x; j--)   // 必须倒序，避免重复使用同一元素
            dp[j] += dp[j - x];
    return (int)dp[target];
}`,
    py: `def count_subset(a, target):
    dp = [0] * (target + 1)
    dp[0] = 1
    for x in a:
        for j in range(target, x - 1, -1):
            dp[j] += dp[j - x]
    return dp[target]`,
    java: `static int countSubset(int[] a, int target) {
    long[] dp = new long[target + 1];
    dp[0] = 1;
    for (int x : a)
        for (int j = target; j >= x; j--)
            dp[j] += dp[j - x];
    return (int) dp[target];
}`,
    c: `int countSubset(const int* a, int n, int target) {
    long long dp[100005];
    for (int j = 0; j <= target; j++) dp[j] = 0;
    dp[0] = 1;
    for (int i = 0; i < n; i++)
        for (int j = target; j >= a[i]; j--)
            dp[j] += dp[j - a[i]];
    return (int)dp[target];
}`
  },
  points: ["倒序枚举容量是 0/1 背包的灵魂，正序就变成「每种元素无限次」的完全背包", "dp[0]=1 表示空集算一种方案，漏掉这个初始化结果全为 0", "方案数增长很快，题目一般要求取模 1e9+7，累加时就要取模"]
},

// 51. N 皇后
{
  key: "n-queens", cat: "回溯", diff: "困难",
  title: p => `${p.n} 皇后问题的方案数`,
  desc: p => `在 ${p.n} × ${p.n} 的棋盘上放 ${p.n} 个皇后，使它们互不攻击（不同行、不同列、不同对角线），求方案总数。回溯按行放置，用三个布尔数组 O(1) 判断列与两条对角线是否被占用。`,
  gen: r => ({ n: 4 + r.int(5) }),
  solve: p => String(nQueens(p.n)),
  inputText: p => `第一行一个整数 n = ${p.n}`,
  outputText: p => String(nQueens(p.n)),
  code: {
    cpp: `int totalNQueens(int n) {
    vector<bool> col(n), d1(2 * n), d2(2 * n);
    int cnt = 0;
    function<void(int)> dfs = [&](int row) {
        if (row == n) { cnt++; return; }
        for (int c = 0; c < n; c++) {
            if (col[c] || d1[row + c] || d2[row - c + n]) continue;
            col[c] = d1[row + c] = d2[row - c + n] = true;
            dfs(row + 1);
            col[c] = d1[row + c] = d2[row - c + n] = false;
        }
    };
    dfs(0);
    return cnt;
}`,
    py: `def total_n_queens(n):
    cnt = 0
    col, d1, d2 = [False]*n, [False]*(2*n), [False]*(2*n)
    def dfs(row):
        nonlocal cnt
        if row == n:
            cnt += 1
            return
        for c in range(n):
            if col[c] or d1[row+c] or d2[row-c+n]:
                continue
            col[c] = d1[row+c] = d2[row-c+n] = True
            dfs(row + 1)
            col[c] = d1[row+c] = d2[row-c+n] = False
    dfs(0)
    return cnt`,
    java: `static int totalNQueens(int n) {
    boolean[] col = new boolean[n], d1 = new boolean[2*n], d2 = new boolean[2*n];
    return dfs(0, n, col, d1, d2);
}
static int dfs(int row, int n, boolean[] col, boolean[] d1, boolean[] d2) {
    if (row == n) return 1;
    int cnt = 0;
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row+c] || d2[row-c+n]) continue;
        col[c] = d1[row+c] = d2[row-c+n] = true;
        cnt += dfs(row + 1, n, col, d1, d2);
        col[c] = d1[row+c] = d2[row-c+n] = false;
    }
    return cnt;
}`,
    c: `int col_[20], d1_[40], d2_[40], N_, cnt_;
void dfs(int row) {
    if (row == N_) { cnt_++; return; }
    for (int c = 0; c < N_; c++) {
        if (col_[c] || d1_[row + c] || d2_[row - c + N_]) continue;
        col_[c] = d1_[row + c] = d2_[row - c + N_] = 1;
        dfs(row + 1);
        col_[c] = d1_[row + c] = d2_[row - c + N_] = 0;
    }
}
int totalNQueens(int n) {
    N_ = n; cnt_ = 0;
    for (int i = 0; i < 20; i++) col_[i] = 0;
    for (int i = 0; i < 40; i++) d1_[i] = d2_[i] = 0;
    dfs(0);
    return cnt_;
}`
  },
  points: ["两条对角线的编号：主对角线 row+c，副对角线 row-c+n，加 n 是为了避免负数下标", "回溯必须完整复原状态，漏掉任何一处会导致后续分支被错误剪枝", "n=8 时共 92 个解；14 以上纯回溯会超时，需要位运算优化"]
},

// 52. 螺旋矩阵
{
  key: "spiral", cat: "矩阵", diff: "中等",
  title: p => `螺旋遍历矩阵（${p.n} × ${p.m}）`,
  desc: p => `按顺时针螺旋顺序遍历 ${p.n} 行 ${p.m} 列的矩阵并输出。用四个边界 top/bottom/left/right 收缩：先右、再下、再左、再上，每走完一条边就收缩对应边界。`,
  gen: r => {
    const n = 2 + r.int(4), m = 2 + r.int(4);
    return { n, m, g: Array.from({ length: n }, () => Array.from({ length: m }, () => r.int(30))) };
  },
  solve: p => spiral(p.g).join(" "),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.n} 行每行 ${p.m} 个整数：\n${p.g.map(row => row.join(" ")).join("\n")}`,
  outputText: p => spiral(p.g).join(" "),
  code: {
    cpp: `vector<int> spiralOrder(vector<vector<int>>& g) {
    vector<int> res;
    int t = 0, b = g.size() - 1, l = 0, r = g[0].size() - 1;
    while (t <= b && l <= r) {
        for (int j = l; j <= r; j++) res.push_back(g[t][j]);
        t++;
        for (int i = t; i <= b; i++) res.push_back(g[i][r]);
        r--;
        if (t <= b) { for (int j = r; j >= l; j--) res.push_back(g[b][j]); b--; }
        if (l <= r) { for (int i = b; i >= t; i--) res.push_back(g[i][l]); l++; }
    }
    return res;
}`,
    py: `def spiral_order(g):
    res = []
    t, b, l, r = 0, len(g) - 1, 0, len(g[0]) - 1
    while t <= b and l <= r:
        for j in range(l, r + 1): res.append(g[t][j])
        t += 1
        for i in range(t, b + 1): res.append(g[i][r])
        r -= 1
        if t <= b:
            for j in range(r, l - 1, -1): res.append(g[b][j])
            b -= 1
        if l <= r:
            for i in range(b, t - 1, -1): res.append(g[i][l])
            l += 1
    return res`,
    java: `static List<Integer> spiralOrder(int[][] g) {
    List<Integer> res = new ArrayList<>();
    int t = 0, b = g.length - 1, l = 0, r = g[0].length - 1;
    while (t <= b && l <= r) {
        for (int j = l; j <= r; j++) res.add(g[t][j]);
        t++;
        for (int i = t; i <= b; i++) res.add(g[i][r]);
        r--;
        if (t <= b) { for (int j = r; j >= l; j--) res.add(g[b][j]); b--; }
        if (l <= r) { for (int i = b; i >= t; i--) res.add(g[i][l]); l++; }
    }
    return res;
}`,
    c: `void spiralOrder(int g[105][105], int n, int m, int* res, int* k) {
    int t = 0, b = n - 1, l = 0, r = m - 1;
    *k = 0;
    while (t <= b && l <= r) {
        for (int j = l; j <= r; j++) res[(*k)++] = g[t][j];
        t++;
        for (int i = t; i <= b; i++) res[(*k)++] = g[i][r];
        r--;
        if (t <= b) { for (int j = r; j >= l; j--) res[(*k)++] = g[b][j]; b--; }
        if (l <= r) { for (int i = b; i >= t; i--) res[(*k)++] = g[i][l]; l++; }
    }
}`
  },
  points: ["第三、四条边必须先判断 t<=b / l<=r，否则单行或单列矩阵会重复输出", "边界用「闭区间」理解最直观：每条边遍历完立刻收缩，边界含义保持统一", "另一种做法是方向数组 + 越界/已访问判断，代码短但会多开 visited 空间"]
},

// 53. Floyd 多源最短路
{
  key: "floyd", cat: "图论", diff: "中等",
  title: p => `Floyd 多源最短路（${p.n} 个顶点）`,
  desc: p => `给出 ${p.n} 个顶点的邻接矩阵（INF 表示无边），求任意两点间的最短距离，不可达输出 INF。Floyd 的三重循环顺序必须是「中转点 k 在最外层」，这是 DP 的阶段定义决定的。`,
  gen: r => {
    const n = 3 + r.int(3);
    const m = Array.from({ length: n }, () => Array(n).fill(INF_D));
    for (let i = 0; i < n; i++) {
      m[i][i] = 0;
      for (let j = i + 1; j < n; j++) {
        if (r.int(3) === 0) continue;
        const w = 1 + r.int(9);
        m[i][j] = w; m[j][i] = w;
      }
    }
    return { n, m };
  },
  solve: p => floydAll(p.m).map(row => row.map(x => x >= INF_D / 2 ? "INF" : String(x)).join(" ")).join("\n"),
  inputText: p => `第一行 n = ${p.n}\n接下来 ${p.n} 行邻接矩阵（INF 表示无边）：\n${p.m.map(row => row.map(x => x >= INF_D / 2 ? "INF" : String(x)).join(" ")).join("\n")}`,
  outputText: p => floydAll(p.m).map(row => row.map(x => x >= INF_D / 2 ? "INF" : String(x)).join(" ")).join("\n"),
  code: {
    cpp: `const int INF = 1e9;
void floyd(vector<vector<int>>& d) {
    int n = d.size();
    for (int k = 0; k < n; k++)          // 中转点必须在最外层
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][k] + d[k][j] < d[i][j])
                    d[i][j] = d[i][k] + d[k][j];
}`,
    py: `INF = 10 ** 9

def floyd(d):
    n = len(d)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return d`,
    java: `static void floyd(int[][] d) {
    int n = d.length;
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][k] + d[k][j] < d[i][j])
                    d[i][j] = d[i][k] + d[k][j];
}`,
    c: `#define INF 1000000000
void floyd(int d[105][105], int n) {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][k] + d[k][j] < d[i][j])
                    d[i][j] = d[i][k] + d[k][j];
}`
  },
  points: ["k 必须最外层，写成 i 最外层就退化成「只允许经过 i 之前的中转点」，答案是错的", "INF 不能取 INT_MAX，两个 INF 相加会溢出成负数", "O(n³)，n 超过 500 就别用；单源用 Dijkstra，含负权用 Bellman-Ford"]
},

// 54. 活动选择（区间调度）
{
  key: "greedy-activity", cat: "贪心", diff: "中等",
  title: p => `最多能参加多少个活动（m = ${p.m}）`,
  desc: p => `有 ${p.m} 个活动，每个占用时间段 [开始, 结束]，同一时间只能参加一个，求最多能参加几个。贪心策略是「按结束时间升序排序，能早就早」——这个策略可严格证明最优，按开始时间或时长排序都不行。`,
  gen: r => {
    const m = 3 + r.int(6);
    return { m, iv: Array.from({ length: m }, () => { const l = 1 + r.int(15); return [l, l + 1 + r.int(6)]; }) };
  },
  solve: p => String(activityMax(p.iv)),
  inputText: p => `第一行 m = ${p.m}\n接下来 ${p.m} 行每行开始与结束时间：\n${p.iv.map(x => x.join(" ")).join("\n")}`,
  outputText: p => String(activityMax(p.iv)),
  code: {
    cpp: `int maxActivities(vector<pair<int,int>> iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b) { return a.second < b.second; });
    int cnt = 0, last = INT_MIN;
    for (auto& [l, r] : iv)
        if (l >= last) { cnt++; last = r; }   // 与上一个不冲突
    return cnt;
}`,
    py: `def max_activities(iv):
    iv.sort(key=lambda x: x[1])        # 按结束时间排序
    cnt, last = 0, float('-inf')
    for l, r in iv:
        if l >= last:
            cnt += 1
            last = r
    return cnt`,
    java: `static int maxActivities(int[][] iv) {
    Arrays.sort(iv, (a, b) -> a[1] - b[1]);
    int cnt = 0, last = Integer.MIN_VALUE;
    for (int[] x : iv)
        if (x[0] >= last) { cnt++; last = x[1]; }
    return cnt;
}`,
    c: `int cmpEnd(const void* a, const void* b) {
    const int* x = (const int*)a; const int* y = (const int*)b;
    return x[1] - y[1];
}
int maxActivities(int iv[][2], int m) {
    qsort(iv, m, sizeof(iv[0]), cmpEnd);
    int cnt = 0, last = -1000000;
    for (int i = 0; i < m; i++)
        if (iv[i][0] >= last) { cnt++; last = iv[i][1]; }
    return cnt;
}`
  },
  points: ["按结束时间排序是贪心正确性的关键，按开始时间排序会得到错误答案", "区间端点是否算冲突要看题意：「结束=下一场开始」通常允许，所以用 >=", "要输出具体选了哪些活动，就顺带记录下标"]
},

// 55. 后缀表达式求值
{
  key: "stack-eval", cat: "栈", diff: "中等",
  title: p => `逆波兰表达式求值（${p.tokens.length} 个 token）`,
  desc: p => `给出后缀表达式（逆波兰表示）「${p.tokens.join(" ")}」，求它的值。遇数字压栈，遇运算符弹出两个数计算后压回——注意先弹出的是右操作数，减法和除法顺序不能反。`,
  gen: r => {
    // 合法 RPN 必须先有两个操作数，之后每次「运算符 + 操作数」才能保持栈合法
    const tokens = [String(1 + r.int(9)), String(1 + r.int(9))];
    for (let i = 0, k = 1 + r.int(4); i < k; i++) {
      tokens.push(["+", "-", "*"][r.int(3)]);
      tokens.push(String(1 + r.int(9)));
    }
    return { tokens };
  },
  solve: p => String(evalRpn(p.tokens)),
  inputText: p => `第一行 k = ${p.tokens.length}（token 个数）\n第二行 ${p.tokens.join(" ")}`,
  outputText: p => String(evalRpn(p.tokens)),
  code: {
    cpp: `int evalRPN(const vector<string>& tk) {
    stack<int> st;
    for (auto& t : tk) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            int b = st.top(); st.pop();         // 先弹出的是右操作数
            int a = st.top(); st.pop();
            if (t == "+") st.push(a + b);
            else if (t == "-") st.push(a - b);
            else if (t == "*") st.push(a * b);
            else st.push(a / b);
        } else st.push(stoi(t));
    }
    return st.top();
}`,
    py: `def eval_rpn(tk):
    st = []
    for t in tk:
        if t in "+-*/":
            b = st.pop()      # 右操作数先出栈
            a = st.pop()
            if t == "+": st.append(a + b)
            elif t == "-": st.append(a - b)
            elif t == "*": st.append(a * b)
            else: st.append(int(a / b))
        else:
            st.append(int(t))
    return st[0]`,
    java: `static int evalRPN(String[] tk) {
    Deque<Integer> st = new ArrayDeque<>();
    for (String t : tk) {
        if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
            int b = st.pop(), a = st.pop();
            switch (t) {
                case "+": st.push(a + b); break;
                case "-": st.push(a - b); break;
                case "*": st.push(a * b); break;
                default:  st.push(a / b);
            }
        } else st.push(Integer.parseInt(t));
    }
    return st.peek();
}`,
    c: `int evalRPN(char tk[][10], int k) {
    int st[105], top = 0;
    for (int i = 0; i < k; i++) {
        char c = tk[i][0];
        if ((c == '+' || c == '-' || c == '*' || c == '/') && tk[i][1] == 0) {
            int b = st[--top], a = st[--top];
            int r = c == '+' ? a + b : c == '-' ? a - b : c == '*' ? a * b : a / b;
            st[top++] = r;
        } else st[top++] = atoi(tk[i]);
    }
    return st[0];
}`
  },
  points: ["减法和除法必须用「次顶元素 op 栈顶」，反过来一定错", "判断运算符时注意区分负号和减号（本题 token 都是非负整数，可简化）", "结果是栈里最后剩下的唯一元素，正常表达式求值结束后栈大小应为 1"]
},

// 56. 约瑟夫环
{
  key: "josephus", cat: "数学", diff: "中等",
  title: p => `约瑟夫环（n = ${p.n}, k = ${p.k}）`,
  desc: p => `${p.n} 个人围成一圈，从第 1 个人开始报数，报到 ${p.k} 的人出圈，下一个人重新从 1 开始报，求最后留下的人的编号（1 起）。递推公式：f(1) = 0，f(i) = (f(i-1) + k) % i，答案最后加 1。`,
  gen: r => ({ n: 5 + r.int(10), k: 1 + r.int(6) }),
  solve: p => String(josephus(p.n, p.k)),
  inputText: p => `第一行 n = ${p.n}, k = ${p.k}`,
  outputText: p => String(josephus(p.n, p.k)),
  code: {
    cpp: `int lastRemaining(int n, int k) {
    int ans = 0;                          // 1 个人时幸存者下标为 0
    for (int i = 2; i <= n; i++)
        ans = (ans + k) % i;              // 每轮规模扩大 1
    return ans + 1;                       // 转成 1 起编号
}`,
    py: `def last_remaining(n, k):
    ans = 0
    for i in range(2, n + 1):
        ans = (ans + k) % i
    return ans + 1`,
    java: `static int lastRemaining(int n, int k) {
    int ans = 0;
    for (int i = 2; i <= n; i++) ans = (ans + k) % i;
    return ans + 1;
}`,
    c: `int lastRemaining(int n, int k) {
    int ans = 0;
    for (int i = 2; i <= n; i++) ans = (ans + k) % i;
    return ans + 1;
}`
  },
  points: ["递推是从「剩 i 个人」倒推回「剩 i-1 个人」，所以循环 i 从 2 递增到 n", "结果是从 0 开始的下标，输出 1 起编号时最后一次 +1，容易忘", "用链表或数组模拟是 O(nk)，n 很大时会超时，必须用递推 O(n)"]
}
];

module.exports = { TYPES_D };
