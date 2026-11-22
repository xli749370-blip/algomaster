// C++ 第 16-20 章 · 每章 4 节微课
module.exports = [
  {
    t: "字符串处理进阶",
    sub: "哈希 · KMP · 字典树 · 回文与子序列",
    mins: 60,
    kw: "字符串",
    goals: [
      "用字符串哈希 O(1) 判断子串相等",
      "手写 KMP 的 next 数组并解释它的含义",
      "用字典树做前缀查找",
      "知道什么题该用哈希、什么题必须 KMP",
    ],
    map: [
      ["方法", "预处理", "单次匹配", "适用"],
      ["朴素匹配", "O(1)", "O(nm)", "短串"],
      ["字符串哈希", "O(n)", "O(1)", "子串比较、判重"],
      ["KMP", "O(m)", "O(n)", "单模式匹配"],
      ["字典树", "O(总长)", "O(串长)", "前缀查询、多模式"],
    ],
    mic: [
      {
        t: "字符串哈希：把字符串变成数字",
        lead: "把字符串当成 base 进制数取模，两个子串相等就等价于两个哈希值相等。",
        body: [
          "取 base = 131（或 13331）、模 2⁶⁴（用 unsigned long long 自然溢出），冲突概率极低。预处理前缀哈希后，任意子串哈希都能 O(1) 算出。",
          "公式：`h[l..r] = h[r] - h[l-1] * base^(r-l+1)`。需要额外预处理 base 的幂。",
        ],
        code: `typedef unsigned long long ull;
const int N = 1e6 + 5, B = 131;
ull h[N], pw[N];

void init(string s) {              // 下标从 1 开始
    pw[0] = 1;
    for (int i = 1; i <= (int)s.size(); i++) {
        h[i] = h[i-1] * B + s[i-1];
        pw[i] = pw[i-1] * B;
    }
}
ull get(int l, int r) {            // s[l..r] 的哈希
    return h[r] - h[l-1] * pw[r-l+1];
}`,
        lang: "C++",
        pts: [
          "自然溢出（ull）等价于模 2⁶⁴，速度最快但有被构造攻击的可能",
          "稳妥做法：双哈希（两个 base/mod 组合）",
          "下标从 1 开始能让 `l-1` 落在合法位置，省掉特判",
          "要比较两个串的任意子串，两串各建一套哈希",
        ],
        pit: "`get(l, r)` 里 `pw[r-l+1]` 别忘了 +1，差一位就全错。",
      },
      {
        t: "KMP：利用已经匹配的信息",
        lead: "暴力匹配失败时会把指针退回开头，KMP 用 next 数组告诉它「退到哪还能复用已匹配的部分」。",
        body: [
          "`next[i]` 表示「模式串前 i 个字符的最长相等前后缀长度」。匹配失败时，模式串指针退到 `next[j]`，主串指针不回退。",
          "整体复杂度 O(n+m)。求 next 的过程本质是「模式串自己匹配自己」。",
        ],
        code: `vector<int> buildNext(const string &p) {
    int m = p.size();
    vector<int> nxt(m, 0);
    for (int i = 1, j = 0; i < m; i++) {
        while (j && p[i] != p[j]) j = nxt[j-1];
        if (p[i] == p[j]) j++;
        nxt[i] = j;
    }
    return nxt;
}

vector<int> kmp(const string &s, const string &p) {
    auto nxt = buildNext(p);
    vector<int> pos;
    for (int i = 0, j = 0; i < (int)s.size(); i++) {
        while (j && s[i] != p[j]) j = nxt[j-1];
        if (s[i] == p[j]) j++;
        if (j == (int)p.size()) { pos.push_back(i - j + 1); j = nxt[j-1]; }
    }
    return pos;
}`,
        lang: "C++",
        pts: [
          "next 数组也叫失配指针，含义是「最长公共前后缀」",
          "`j = nxt[j-1]` 是回退，不是重置为 0",
          "找所有出现位置时匹配成功后要 `j = nxt[j-1]` 继续",
        ],
        pit: "把 `nxt[j-1]` 写成 `nxt[j]` 会越界或死循环，这是手写 KMP 最常见的 bug。",
      },
      {
        t: "字典树：按前缀组织字符串",
        lead: "字典树把公共前缀合并成一条路径，查一个串只需走它的长度步。",
        body: [
          "每个节点有 26 个子指针（小写字母）和一个「是否是单词结尾」的标记。插入和查询都是 O(L)，L 是串长。",
          "空间是主要问题：n 个长度 L 的串最坏需要 n·L 个节点。用数组 `tr[maxn][26]` 比指针更省更稳。",
        ],
        code: `const int MAXN = 1e6 + 5;
int tr[MAXN][26], cnt = 0;
bool isEnd[MAXN];

void insert(const string &s) {
    int u = 0;
    for (char c : s) {
        int v = c - 'a';
        if (!tr[u][v]) tr[u][v] = ++cnt;
        u = tr[u][v];
    }
    isEnd[u] = true;
}

bool query(const string &s) {
    int u = 0;
    for (char c : s) {
        int v = c - 'a';
        if (!tr[u][v]) return false;
        u = tr[u][v];
    }
    return isEnd[u];
}

bool hasPrefix(const string &s) {   // 是否存在以 s 为前缀的串
    int u = 0;
    for (char c : s) {
        int v = c - 'a';
        if (!tr[u][v]) return false;
        u = tr[u][v];
    }
    return true;
}`,
        lang: "C++",
        pts: [
          "根节点固定为 0，`++cnt` 从 1 开始分配",
          "26 个 int 指针 × 1e6 节点 = 104MB，注意内存上限",
          "01 字典树可求最大异或对",
        ],
        pit: "多组测试数据时 `tr` 数组必须清零，但 `memset(tr, 0, sizeof tr)` 在 1e6×26 时很慢，改记「用到过的节点」逐个还原。",
      },
      {
        t: "回文、子序列与常用字符串结论",
        lead: "很多字符串题不需要高级算法，只要用对结论就能把 O(n²) 降到 O(n)。",
        body: [
          "**最长回文子串**：Manacher O(n)，或哈希 + 二分 O(n log n)。**最长公共子序列**：DP O(nm)。**最长回文子序列**：区间 DP。",
          "几个高频结论：回文串去掉首尾仍是回文；字符重排能构成回文 ⟺ 最多一个字符出现奇数次；子序列只需相对顺序不变。",
        ],
        code: `// 能否重排成回文
bool canPalin(const string &s) {
    int cnt[26] = {}, odd = 0;
    for (char c : s) cnt[c - 'a']++;
    for (int i = 0; i < 26; i++) if (cnt[i] & 1) odd++;
    return odd <= 1;
}

// 最长公共子序列
int lcs(const string &a, const string &b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = a[i-1] == b[j-1] ? dp[i-1][j-1] + 1
                                        : max(dp[i-1][j], dp[i][j-1]);
    return dp[n][m];
}

// 统计字符出现次数
int cnt[26] = {};
for (char c : s) cnt[c - 'a']++;`,
        lang: "C++",
        pts: [
          "子串要求连续，子序列不要求连续——读题时务必分清",
          "LCS 空间可压成一维（滚动数组），注意从后往前更新",
          "字符集大时用 unordered_map 代替 26 长度的数组",
        ],
        pit: "把「子序列」当「子串」做，是最常见的读题错误，样例往往还过得去。",
      },
    ],
    qa: [
      ["哈希和 KMP 怎么选？", "只需比较子串相等（判重、回文判定）用哈希；要找一个模式串的所有出现位置用 KMP，哈希也可以但要额外二分。"],
      ["KMP 的 next 数组和 AC 自动机的 fail 指针什么关系？", "AC 自动机的 fail 就是多模式串版本的 next，本质都是「最长可复用后缀」。"],
    ],
    sum: "哈希管相等、KMP 管匹配、字典树管前缀、结论题先想结论。",
  },

  {
    t: "并查集与图论模板",
    sub: "DSU · 邻接表 · 最短路 · 最小生成树",
    mins: 65,
    kw: "并查集",
    goals: [
      "写出带路径压缩与按秩合并的并查集",
      "用邻接表存图并按需选择遍历方式",
      "掌握 Dijkstra / SPFA / Floyd 的适用场景",
      "会用 Kruskal 求最小生成树",
    ],
    map: [
      ["算法", "复杂度", "适用"],
      ["并查集", "近 O(1)", "连通性、合并集合"],
      ["Dijkstra + 堆", "O(m log n)", "非负边单源最短路"],
      ["SPFA", "最坏 O(nm)", "有负边、判负环"],
      ["Floyd", "O(n³)", "全源最短路，n ≤ 500"],
    ],
    mic: [
      {
        t: "并查集：只关心「在不在一个集合」",
        lead: "并查集维护一堆集合，支持「合并两个集合」和「查某个元素属于哪个集合」，几乎 O(1)。",
        body: [
          "用一棵树表示一个集合，根就是集合代表。`find(x)` 往上找根，`unite(a,b)` 把一个根挂到另一个根上。",
          "两个优化：**路径压缩**（查找时把路径上的点直接连到根）和**按秩合并**（小树挂大树），一起用复杂度接近 O(1)。",
        ],
        code: `int fa[N], rk[N];

void init(int n) { for (int i = 1; i <= n; i++) fa[i] = i, rk[i] = 0; }

int find(int x) {                 // 路径压缩
    return fa[x] == x ? x : fa[x] = find(fa[x]);
}

bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;     // 已同集合
    if (rk[a] < rk[b]) swap(a, b);
    fa[b] = a;                    // 小树挂大树
    if (rk[a] == rk[b]) rk[a]++;
    return true;
}

bool same(int a, int b) { return find(a) == find(b); }`,
        lang: "C++",
        pts: [
          "`find` 里 `fa[x] = find(fa[x])` 的赋值就是路径压缩",
          "带权并查集可维护「到根的距离」，用于食物链这类题",
          "初始化必须 `fa[i] = i`，漏了会得到奇怪的结果",
        ],
        pit: "递归版 `find` 在链很长时可能爆栈；不压缩且 n = 1e6 时改成迭代写法。",
      },
      {
        t: "图的存储：邻接表与链式前向星",
        lead: "n 个点 m 条边，用 `vector<vector<int>>` 存邻接表最直观，m 很大时用链式前向星省内存。",
        body: [
          "邻接表 `g[u].push_back({v, w})` 遍历一个点的出边是 O(度数)，比邻接矩阵 O(n) 快得多，稀疏图必备。",
          "链式前向星用 `head[] + nxt[]` 数组模拟链表，节点数固定时更快更省，是竞赛中的常见写法。",
        ],
        code: `// 邻接表
vector<vector<pair<int,int>>> g(n + 1);   // (邻点, 边权)
g[u].push_back({v, w});
for (auto [v, w] : g[u]) { /* 遍历出边 */ }

// 链式前向星
int head[N], to[M], nxt[M], wt[M], ecnt = 0;
void addEdge(int u, int v, int w) {
    to[++ecnt] = v; wt[ecnt] = w;
    nxt[ecnt] = head[u]; head[u] = ecnt;
}
for (int e = head[u]; e; e = nxt[e]) { int v = to[e], w = wt[e]; }`,
        lang: "C++",
        pts: [
          "无向图每条边要加两次（u→v 和 v→u）",
          "链式前向星的边下标从 1 开始，用 0 表示空",
          "点数 ≤ 1000 时邻接矩阵更方便（Floyd、传递闭包）",
        ],
        pit: "无向图只加了一条边，是最难发现的 WA 之一——跑出来的最短路总是偏大。",
      },
      {
        t: "最短路三件套",
        lead: "非负边用 Dijkstra，有负边用 SPFA，点数小要全源用 Floyd。",
        body: [
          "**Dijkstra + 优先队列**：每次取出当前距离最小的点，松弛它的出边。堆里可能有重复项，弹出时用 `if (d > dist[u]) continue` 跳过旧项。",
          "**Floyd** 三重循环必须把 k 放最外层，这是很多人写错的地方。",
        ],
        code: `// Dijkstra：O(m log n)
vector<long long> dijkstra(int s, int n) {
    vector<long long> d(n + 1, LLONG_MAX);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    d[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [du, u] = pq.top(); pq.pop();
        if (du > d[u]) continue;              // 过期项
        for (auto [v, w] : g[u])
            if (d[u] + w < d[v]) { d[v] = d[u] + w; pq.push({d[v], v}); }
    }
    return d;
}

// Floyd：k 必须在最外层
for (int k = 1; k <= n; k++)
  for (int i = 1; i <= n; i++)
    for (int j = 1; j <= n; j++)
      if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];`,
        lang: "C++",
        pts: [
          "Dijkstra 不能处理负边（会得到错误答案而非只是变慢）",
          "SPFA 被卡的数据很常见，能用 Dijkstra 就别用 SPFA",
          "Floyd 的 `INF` 要够大且相加不溢出，用 `1e18` 会溢出，用 `4e18/3` 左右",
        ],
        pit: "`d[u] + w` 溢出：`d[u]` 是 `LLONG_MAX` 时加任何数都会变负，必须判 `d[u] == INF` 提前 continue。",
      },
      {
        t: "最小生成树：Kruskal 与并查集",
        lead: "把边按权值排序，能连就连——Kruskal 的正确性来自「不成环就一定最优」的贪心。",
        body: [
          "按边权升序枚举，若两端不在同一连通块就用并查集合并并计入答案。选够 n-1 条边即结束，总复杂度 O(m log m)。",
          "稠密图上 Prim + 邻接矩阵是 O(n²)，比 Kruskal 更合适。",
        ],
        code: `struct Edge { int u, v, w; };

long long kruskal(int n, vector<Edge> &edges) {
    sort(edges.begin(), edges.end(), [](const Edge &a, const Edge &b) { return a.w < b.w; });
    init(n);
    long long ans = 0; int used = 0;
    for (auto &e : edges) {
        if (unite(e.u, e.v)) { ans += e.w; if (++used == n - 1) break; }
    }
    return used == n - 1 ? ans : -1;   // -1 表示不连通
}`,
        lang: "C++",
        pts: [
          "边权相同不影响正确性，任意顺序都行",
          "图不连通时生成不了树，要明确返回什么",
          "答案可能超 int，用 long long",
        ],
        pit: "遍历边前必须先排序——忘了 sort 得到的是随便一棵生成树，不是最小的。",
      },
    ],
    qa: [
      ["并查集能维护哪些额外信息？", "集合大小、最值、带权距离（到根的距离）、可持久化版本（主席树并查集）。"],
      ["负环怎么判？", "SPFA 记录每个点入队次数，超过 n 次说明存在负环；或用 Bellman-Ford 松弛 n 轮。"],
    ],
    sum: "连通性找并查集、非负最短路 Dijkstra、全源 Floyd（k 在外层）、最小生成树 Kruskal + 排序。",
  },

  {
    t: "调试、性能与常数优化",
    sub: "断言 · 对拍 · 缓存友好 · 卡常手段",
    mins: 50,
    kw: "复杂度",
    goals: [
      "用 assert 与对拍快速定位逻辑错误",
      "看懂「同样复杂度为什么别人过得快」",
      "掌握几条最有效的常数优化",
      "建立「先测边界再交题」的习惯",
    ],
    map: [
      ["手段", "收益", "代价"],
      ["快速 IO", "3~10×", "无"],
      ["减少取模 / 位运算代替乘除", "1.5~2×", "可读性"],
      ["数组代替 map", "5~10×", "内存"],
      ["循环顺序缓存友好", "2~3×", "无"],
    ],
    mic: [
      {
        t: "assert 与对拍：让错误自己冒出来",
        lead: "与其盯着代码看半小时，不如写个暴力程序让机器对拍。",
        body: [
          "`assert(条件)` 在条件为假时直接终止并打印位置，比默默算错好得多。它在 `-DNDEBUG` 时会被编译掉，不影响最终性能。",
          "对拍流程：写暴力解法 brute.cpp + 正解 fast.cpp + 随机数据生成 gen.cpp，循环比较输出，发现不同就保存这组数据。",
        ],
        code: `// 正解里加断言
assert(0 <= idx && idx < n);
assert(sum >= 0);

// 对拍脚本（bash）
for i in $(seq 1 1000); do
  ./gen > in.txt
  ./brute < in.txt > a.txt
  ./fast  < in.txt > b.txt
  if ! diff -q a.txt b.txt > /dev/null; then
      echo "WA on case $i"; break
  fi
done`,
        lang: "bash",
        pts: [
          "断言放在「理论上一定成立」的地方，比如下标范围、单调性",
          "对拍数据要包含小范围随机 + 边界值（n=1、全相同、全不同）",
          "发现 WA 后立刻 `cp in.txt wa.txt` 保存现场",
        ],
        pit: "在提交的正解里留 `assert` 且条件写错，会直接 RE。用 `#ifdef LOCAL` 包住更安全。",
      },
      {
        t: "常数优化：同样 O(n log n) 为什么差 5 倍",
        lead: "大 O 只描述增长趋势，真正跑起来还要看内存访问模式与指令数量。",
        body: [
          "**缓存友好**是最大的一项：二维数组按行遍历（`g[i][j]` 内层 j）比按列遍历快好几倍，因为内存是行优先连续的。",
          "其次是减少函数调用与取模：`%` 比 `&` 慢很多，模数是 2 的幂时用 `& (m-1)`；把 `i < v.size()` 提到循环外存到变量里也能省。",
        ],
        code: `// 慢：每轮都调用 size()，且无符号比较
for (int i = 0; i < (int)v.size(); i++) ...

// 快：把长度提出来
int n = v.size();
for (int i = 0; i < n; i++) ...

// 慢：取模
x = x % MOD;
// 快：MOD 是 2 的幂时
x = x & (MOD - 1);

// 快：用位运算代替乘除 2 的幂
y = x << 3;    // x * 8
z = x >> 1;    // x / 2`,
        lang: "C++",
        pts: [
          "把最内层循环里不变的量提到外面（循环不变量外提）",
          "少用 `endl`、少用 `vector` 的 `at()`",
          "开 `-O2` 通常能带来 2~5 倍提升，但别依赖它掩盖算法问题",
        ],
        pit: "过度优化会让代码难以调试。先保证正确性，TLE 了再逐项加优化，每次只改一处并重测。",
      },
      {
        t: "复杂度估算：1 秒能跑多少次",
        lead: "记住几个量级，看数据范围就能反推该用什么算法。",
        body: [
          "1 秒约 1e8 次简单运算。所以 n ≤ 20 → 2ⁿ 状压；n ≤ 500 → O(n³)；n ≤ 5000 → O(n²)；n ≤ 1e6 → O(n log n)；n ≤ 1e8 → O(n)。",
          "内存同理：`int a[1e8]` 就是 400MB，多半 MLE。看到 n = 1e5 就该想到线段树/树状数组/二分，而不是 O(n²)。",
        ],
        code: `n ≤ 10        -> 全排列 O(n!)
n ≤ 20        -> 状压 O(2^n · n)
n ≤ 500       -> Floyd O(n^3)
n ≤ 5000      -> O(n^2) DP
n ≤ 2e5       -> O(n log n) 排序/树状数组/线段树
n ≤ 1e7       -> O(n) 线性筛/双指针
总运算量     -> 控制在 1e8 以内`,
        lang: "text",
        pts: [
          "看到 1e5 想到 O(n log n)，看到 1e3 想到 O(n²)",
          "多次查询区间最值：预处理 O(n log n) + 查询 O(1)（ST 表）",
          "常数大的 O(n log n) 在 1e6 时也可能 TLE，要留余量",
        ],
        pit: "把 O(n²) 的 n 当成 1e4 就觉得能过——1e8 次带取模的运算是 2 秒以上，实际会 TLE。",
      },
      {
        t: "常见 WA / RE / TLE 的排查顺序",
        lead: "按「最可能且最容易验证」的顺序查，比随机改代码高效十倍。",
        body: [
          "WA：先看边界（n=1、全相同、负数）、再看溢出（int 改 long long）、最后看多组数据是否清空。",
          "RE：基本是数组越界或除以 0，把数组开大 10 个数往往就好了。TLE：先加快速 IO，再换算法。",
        ],
        code: `// 快速定位：把关键中间量打到 stderr
#define dbg(x) cerr << #x " = " << (x) << "\\n"
dbg(n); dbg(sum); dbg(l); dbg(r);

// 数组开大一点，成本极低
const int MAXN = 100005;     // 题目说 1e5，开到 1e5+5`,
        lang: "C++",
        pts: [
          "`cerr` 不会被当作输出，调试信息用它可以避免污染答案",
          "提交前把所有 dbg 注释掉（或 `#ifdef LOCAL`）",
          "数组统一多开 5~10 个，能吃掉大量 off-by-one",
        ],
        pit: "把调试输出打到 `cout` 里忘了删，是「样例对、提交 WA」的经典原因。",
      },
    ],
    qa: [
      ["为什么我的程序在本机能过、提交就 WA？", "九成是未定义行为：局部数组未初始化、越界读写、多组数据没清空。本机侥幸，判题机就崩。"],
      ["开了 -O2 还需要卡常吗？", "需要。算法复杂度不对，-O2 救不回来；常数差 5 倍时 -O2 只能补 2 倍。"],
    ],
    sum: "先对拍找错、再按「边界 → 溢出 → 清空」顺序修 WA，TLE 先加 IO 再换算法。",
  },

  {
    t: "工程组织与 CMake 入门",
    sub: "多文件拆分 · 头文件规范 · CMake · 单元测试",
    mins: 45,
    kw: "复杂度",
    goals: [
      "把单文件代码拆成头文件 + 实现文件",
      "理解 include guard 与 ODR 规则",
      "写出能用的 CMakeLists.txt",
      "知道如何为算法代码加最小单测",
    ],
    map: [
      ["文件", "放什么", "会被谁包含"],
      [".h / .hpp", "声明、模板、inline", "多个 .cpp"],
      [".cpp", "实现", "不直接被包含"],
      ["CMakeLists.txt", "构建规则", "cmake"],
      ["tests/", "单测用例", "ctest"],
    ],
    mic: [
      {
        t: "头文件与实现分离",
        lead: "声明放头文件（让所有人知道「有这个函数」），定义放 .cpp（只编译一次）。",
        body: [
          "头文件里写函数声明、类定义、模板、`inline` 函数；.cpp 里写函数体。这样修改实现时，其他文件不需要重新编译。",
          "**ODR（单一定义规则）**：同一个函数/变量在整个程序里只能定义一次。把函数体写进头文件又被多个 .cpp 包含，就会 `multiple definition`。",
        ],
        code: `// math_utils.h
#pragma once
int add(int a, int b);          // 只声明

// math_utils.cpp
#include "math_utils.h"
int add(int a, int b) { return a + b; }   // 定义

// main.cpp
#include "math_utils.h"
int main() { return add(1, 2); }

// 编译
g++ main.cpp math_utils.cpp -o app`,
        lang: "C++",
        pts: [
          "`#pragma once` 比传统 include guard 简洁，主流编译器都支持",
          "模板和 `constexpr` 必须写在头文件里（调用方需要看到定义）",
          "头文件里不要 `using namespace std;`，会污染所有包含者",
        ],
        pit: "头文件互相包含（a.h 包含 b.h，b.h 又包含 a.h）会导致类型不完整，改用前向声明 `class B;` 打破循环。",
      },
      {
        t: "CMake：一次编写，跨平台构建",
        lead: "CMake 不直接编译，而是生成 Makefile / Visual Studio 工程，再交给真正的构建工具。",
        body: [
          "最小可用工程只需要三行：最低版本、项目名、可执行目标。加上 `CMAKE_CXX_STANDARD` 指定标准，`-O2 -Wall` 通过 `CMAKE_CXX_FLAGS` 传入。",
          "调试与发布用不同的构建目录（`build-debug` / `build-release`），避免互相覆盖。",
        ],
        code: `cmake_minimum_required(VERSION 3.16)
project(algomaster CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(app main.cpp math_utils.cpp)
target_compile_options(app PRIVATE -O2 -Wall -Wextra)

# 常用命令
# cmake -S . -B build
# cmake --build build -j
# ./build/app`,
        lang: "cmake",
        pts: [
          "`-Wall -Wextra` 能提前发现大量隐患，建议一直开着",
          "库用 `add_library`，测试用 `enable_testing()` + `add_test`",
          "不要 `file(GLOB ...)` 收集源文件，新增文件不会自动触发重新配置",
        ],
        pit: "在源码目录里直接 `cmake .` 会生成一堆文件污染工程，永远用 `-B build` 指定独立构建目录。",
      },
      {
        t: "为算法代码写最小单测",
        lead: "算法也需要测试：把样例固化成断言，改代码时立刻知道有没有破坏原有行为。",
        body: [
          "最轻量的做法是一个 `test.cpp`，里面用 `assert` 覆盖样例、边界、随机对拍。跑通就返回 0，失败就崩——CI 也是这样判断的。",
          "正式一点用 GoogleTest / Catch2，但竞赛场景一个 assert 文件足够。",
        ],
        code: `#include <cassert>
#include "solution.h"

int main() {
    assert(solve(1) == 1);
    assert(solve(2) == 2);
    assert(solve(0) == 0);
    assert(solve(-1) == -1);          // 边界
    assert(solve(1000000000) >= 0);   // 大数不溢出

    // 随机对拍
    for (int t = 0; t < 1000; t++) {
        int n = rand() % 50;
        assert(fast(n) == brute(n));
    }
    puts("all tests passed");
}`,
        lang: "C++",
        pts: [
          "每个 bug 修完都补一条对应用例，防止回归",
          "边界值优先：0、1、负数、最大值",
          "`assert` 在 `-DNDEBUG` 下失效，测试构建不要加这个宏",
        ],
        pit: "只测样例等于没测——样例往往是最「友好」的那一组数据。",
      },
      {
        t: "代码风格与可维护性",
        lead: "比赛代码也要能读懂：三天后回来改，你就是那个读代码的人。",
        body: [
          "统一命名（变量 camelCase、常量全大写）、统一缩进、函数不超过一屏。变量名用 `left/right` 而不是 `l/r`（`l` 和 `1` 太像）。",
          "把重复逻辑抽成函数，把魔数换成具名常量。这些习惯在长题、多文件工程里能救命。",
        ],
        code: `const int MOD = 1'000'000'007;   // C++14 数字分隔符
const int MAXN = 200005;

// 好：名字说明含义
int lowerBoundIndex = lower_bound(a.begin(), a.end(), target) - a.begin();

// 差：全靠猜
int k = lower_bound(a.begin(), a.end(), t) - a.begin();

// 好：复杂条件抽成有名字的函数
bool canFinish(int days) { ... }
while (lo < hi) { int mid = (lo + hi) / 2; if (canFinish(mid)) hi = mid; else lo = mid + 1; }`,
        lang: "C++",
        pts: [
          "用 `const` / `constexpr` 表达「这个值不该变」",
          "提前 return 减少嵌套层级",
          "注释解释「为什么」，不是「做了什么」",
        ],
        pit: "为了省字符把变量名写成 `a1, a2, aa, bb`，半小时后自己都分不清哪个是哪个。",
      },
    ],
    qa: [
      ["为什么头文件里不能定义非 inline 函数？", "被多个 .cpp 包含时会产生多份定义，违反 ODR，链接时报 multiple definition。"],
      ["CMake 和 Makefile 的关系？", "CMake 生成 Makefile（或其他构建系统的工程文件），是更高层的构建描述工具。"],
    ],
    sum: "声明进头、定义进源、模板留头部；CMake 三行起步，构建目录永远独立。",
  },

  {
    t: "现代 C++ 新特性视野",
    sub: "concepts · ranges · 协程 · 三路比较",
    mins: 45,
    kw: "复杂度",
    goals: [
      "知道 C++20 四大特性各自解决什么问题",
      "能用 ranges 写出更短的管道式代码",
      "理解 concepts 如何改善模板报错",
      "判断哪些特性现在可以放心用",
    ],
    map: [
      ["特性", "标准", "一句话"],
      ["concepts", "C++20", "给模板参数加约束"],
      ["ranges", "C++20", "可组合的惰性序列"],
      ["三路比较 `<=>`", "C++20", "一个运算符生成六个"],
      ["协程", "C++20", "函数可暂停/恢复"],
    ],
    mic: [
      {
        t: "concepts：让模板报错说人话",
        lead: "模板报错难读的根因是「约束写在函数体里」，concepts 把约束提到签名上。",
        body: [
          "`requires` 子句声明「T 必须支持什么操作」。不满足时，编译器在调用点就给出清晰错误，而不是展开几十层模板栈。",
          "标准库已内置一批 concept：`integral`、`floating_point`、`same_as`、`sortable` 等。",
        ],
        code: `#include <concepts>

template<std::integral T>
T twice(T x) { return x * 2; }

template<class T>
requires requires(T a, T b) { a + b; }
T add(T a, T b) { return a + b; }

// 不满足约束时，报错直接指出「int 不满足 integral」
twice(3);        // OK
// twice(3.5);   // 编译错误，信息友好`,
        lang: "C++",
        pts: [
          "`requires requires` 是「约束表达式」的简写形式",
          "concept 可以组合：`template<std::integral T> requires (sizeof(T) >= 4)`",
          "C++20 之前用 SFINAE / enable_if 实现同样效果，可读性差很多",
        ],
        pit: "concepts 只在 C++20 及以上可用，GCC 需要 `-std=c++20` 且版本 ≥ 10。",
      },
      {
        t: "ranges：把操作串成管道",
        lead: "`v | views::filter(...) | views::transform(...)` 读起来像自然语言，且是惰性的。",
        body: [
          "ranges 的 view 不复制数据，只在遍历时按需计算。所以对 1e6 个元素做 filter + take(10)，只处理到够 10 个为止。",
          "注意惰性视图的生命周期：view 引用原容器，原容器销毁后 view 就悬垂了。",
        ],
        code: `#include <ranges>
#include <vector>
#include <iostream>
namespace views = std::views;

std::vector<int> v = {1,2,3,4,5,6,7,8,9,10};

for (int x : v | views::filter([](int n){ return n % 2 == 0; })
               | views::transform([](int n){ return n * n; })
               | views::take(3))
    std::cout << x << " ";      // 4 16 36

auto evens = v | views::filter([](int n){ return n % 2 == 0; });
std::cout << std::ranges::count(evens, 4);   // 1`,
        lang: "C++",
        pts: [
          "`views::take(n)` 可以配合无限序列使用",
          "`std::ranges::sort(v)` 不用再写 `v.begin(), v.end()`",
          "view 是惰性的，`auto x = v | views::transform(f);` 不会立即计算",
        ],
        pit: "把 view 存成成员或返回出去，原容器销毁后访问就是 UB。需要长期保存时用 `views::to` 物化或手动拷贝。",
      },
      {
        t: "三路比较与结构化改进",
        lead: "`<=>` 一次定义就自动生成 `<`、`>`、`<=`、`>=`，减少样板代码。",
        body: [
          "`auto operator<=>(const T &) const = default;` 让编译器按成员顺序生成比较，这对需要放进 `set`/`sort` 的结构体极方便。",
          "配套的 `std::strong_ordering` / `weak_ordering` / `partial_ordering` 区分「可替换相等」与「仅等价」。",
        ],
        code: `#include <compare>

struct Point {
    int x, y;
    auto operator<=>(const Point &) const = default;   // 全部比较自动生成
    bool operator==(const Point &) const = default;
};

Point a{1,2}, b{1,3};
std::cout << (a < b) << (a == b) << (a != b);   // 1 0 1

std::set<Point> s{a, b};     // 直接用`,
        lang: "C++",
        pts: [
          "`= default` 按成员声明顺序逐个比较",
          "浮点成员只能得到 `partial_ordering`（NaN 不可比）",
          "C++20 起 `!=` 会由 `==` 自动生成",
        ],
        pit: "声明了 `<=>` 但没声明 `==` 时，`==` 不会自动生成（除非用 `= default`）。",
      },
      {
        t: "哪些新特性值得马上用",
        lead: "工程上求稳，竞赛上看编译器：能显著减少 bug 的优先用，语法糖按需用。",
        body: [
          "**性价比最高**：`auto`、范围 for、结构化绑定、`nullptr`、`override`、`make_unique`。它们要么更安全，要么更短，没有运行时代价。",
          "**谨慎使用**：协程、modules（编译器支持参差）、`constexpr` 深度递归（编译期爆炸）。",
        ],
        code: `// 值得马上用
for (const auto &[k, v] : mp) { /* ... */ }
auto p = std::make_unique<Widget>();
void f() override;                 // 编译期检查是否真的重写
class X final;                     // 禁止继承，利于优化

// 竞赛里要确认编译器支持
// -std=c++17  : 结构化绑定、optional、if 初始化
// -std=c++20  : concepts、ranges、<=>`,
        lang: "C++",
        pts: [
          "`override` 能在拼错函数名时直接报错，强烈建议加",
          "`final` 能帮编译器去虚化，性能有微小提升",
          "别在竞赛里用 modules / 协程，编译环境不稳定",
        ],
        pit: "C++20 的 `<ranges>` 在 GCC 10 之前不完整，本地能编过、判题机可能编不过。",
      },
    ],
    qa: [
      ["C++20 值不值得学？", "值得。concepts 与 ranges 明显改善可读性；但竞赛仍以 C++17 为主，工程上可逐步迁移。"],
      ["modules 会取代 include 吗？", "长期看会，但目前编译器与构建系统支持不完整，实际项目仍以头文件为主。"],
    ],
    sum: "C++20 三件宝：concepts 管约束、ranges 管管道、`<=>` 管比较；竞赛仍以 C++17 为安全线。",
  },
];
