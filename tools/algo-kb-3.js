/* 算法专题 KB · 图论与高级篇（11 个专题） */
module.exports = [
  {
    id: "graph",
    cat: "图论",
    title: "图的存储与遍历（DFS / BFS）",
    diff: "中等",
    desc: "邻接表 / 邻接矩阵 · 连通块 · 二分图 · 拓扑排序",
    mins: 26,
    goals: [
      "在邻接表与邻接矩阵之间按数据范围做选择",
      "用 DFS / BFS 求连通块、判环、求最短路",
      "用 BFS 求无权图最短步数并说清为什么对",
      "用黑白染色判断二分图",
    ],
    sections: [
      {
        t: "怎么存一张图",
        lead: "n 个点 m 条边，选存储方式只看两个数：n 多大、要不要 O(1) 判边。",
        table: [
          ["方式", "空间", "判边", "遍历邻居", "适用"],
          ["邻接矩阵", "O(n²)", "O(1)", "O(n)", "n ≤ 1000 的稠密图、Floyd"],
          ["邻接表 vector", "O(n+m)", "O(deg)", "O(deg)", "通用首选"],
          ["链式前向星", "O(n+m)", "O(deg)", "O(deg)", "卡内存 / 需要边编号"],
        ],
        code: `int n, m;
vector<vector<int>> g;                 // g[u] = u 的所有邻居

// 读入无向图
g.assign(n + 1, {});
for (int i = 0; i < m; ++i) {
    int u, v; cin >> u >> v;
    g[u].push_back(v);
    g[v].push_back(u);                 // 有向图去掉这一行
}

// 带权图：存 pair<邻居, 权值>
vector<vector<pair<int,int>>> gw(n + 1);`,
        lang: "cpp",
        pit: "无向图存边时忘了 `g[v].push_back(u)`，会出现「有的方向能走、有的不能」——表现为部分点访问不到。",
      },
      {
        t: "DFS 与 BFS：一个栈一个队列",
        lead: "DFS 用递归（系统栈）深挖到底，BFS 用队列一层层扩散。两者的差别只在「下一个访问谁」。",
        fig: "bfsdfs",
        code: `// DFS：求连通块个数
vector<int> vis(n + 1, 0);
void dfs(int u) {
    vis[u] = 1;
    for (int v : g[u]) if (!vis[v]) dfs(v);
}
int blocks = 0;
for (int i = 1; i <= n; ++i) if (!vis[i]) { ++blocks; dfs(i); }

// BFS：无权图单源最短路
vector<int> dist(n + 1, -1);
queue<int> q;
dist[s] = 0; q.push(s);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) if (dist[v] == -1) {
        dist[v] = dist[u] + 1;
        q.push(v);
    }
}`,
        lang: "cpp",
        cap: "BFS 第一次到达某个点时，步数一定最少：队列保证所有距离为 d 的点都在距离 d+1 的点之前被处理。",
      },
      {
        t: "二分图：黑白染色",
        lead: "能把点分成两堆、所有边都跨堆的图叫二分图。用 BFS/DFS 交替染色，冲突就不是二分图。",
        code: `// 染色判二分图（同时也就判了奇环）
vector<int> color(n + 1, 0);            // 0 未染，1 / -1 两种颜色
bool isBipartite() {
    for (int s = 1; s <= n; ++s) {
        if (color[s]) continue;
        queue<int> q; q.push(s); color[s] = 1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (!color[v]) { color[v] = -color[u]; q.push(v); }
                else if (color[v] == color[u]) return false;   // 同色相邻 → 有奇环
            }
        }
    }
    return true;
}`,
        lang: "cpp",
        pts: [
          "二分图 ⇔ 不存在长度为奇数的环",
          "二分图最大匹配可以用匈牙利算法或最大流",
          "DFS 求拓扑排序要加「访问中」标记才能判环",
        ],
        pit: "图可能不连通，染色必须对每个未染色的点都启动一次 BFS。只从 1 号点开始会漏掉其它连通块。",
      },
      {
        t: "边数很大的时候：链式前向星",
        lead: "m 达到 10⁶ 时，`vector<vector<int>>` 的每个小 vector 都有额外开销，换成三条平行数组更省。",
        code: `int head[N], nxt[M], to[M], ecnt = 0;
void addEdge(int u, int v) {
    to[++ecnt] = v; nxt[ecnt] = head[u]; head[u] = ecnt;
}
// 遍历 u 的所有出边
for (int e = head[u]; e; e = nxt[e]) { int v = to[e]; /* ... */ }`,
        lang: "cpp",
        cap: "head 初始化为 0，边的编号从 1 开始，这样 0 可以当「没有边」的哨兵。",
      },
    ],
    sum: "小图用矩阵，大图用邻接表；连通块用 DFS，最短路用 BFS，二分图看染色。",
  },

  {
    id: "shortestpath",
    cat: "图论",
    title: "最短路三兄弟",
    diff: "较难",
    desc: "Dijkstra · Bellman-Ford / SPFA · Floyd · 选型判据",
    mins: 30,
    goals: [
      "按「边权正负 + 单源多源」正确选择最短路算法",
      "手写堆优化 Dijkstra 并说清复杂度",
      "用 SPFA 处理负权并判负环",
      "用 Floyd 求全源最短路与传递闭包",
    ],
    sections: [
      {
        t: "先选算法，再写代码",
        lead: "选错算法比写错代码更致命：负权图用 Dijkstra 会得到错误答案，而且不报错。",
        table: [
          ["算法", "边权", "源", "复杂度", "能否判负环"],
          ["BFS", "全为 1", "单源", "O(n+m)", "否"],
          ["Dijkstra（堆）", "非负", "单源", "O((n+m) log n)", "否"],
          ["Bellman-Ford", "可负", "单源", "O(nm)", "能"],
          ["SPFA", "可负", "单源", "平均 O(km)", "能"],
          ["Floyd", "可负（无负环）", "全源", "O(n³)", "能（看对角线）"],
        ],
      },
      {
        t: "Dijkstra：每次确定一个最近点",
        lead: "把点分成「已确定」和「未确定」两堆，每次从未确定里取距离最小的，用它去松弛邻居。",
        fig: "dijkstra",
        code: `vector<long long> dijkstra(int s, int n, vector<vector<pair<int,int>>>& g) {
    const long long INF = 1e18;
    vector<long long> d(n + 1, INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    d[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [du, u] = pq.top(); pq.pop();
        if (du > d[u]) continue;             // 过期条目，跳过
        for (auto [v, w] : g[u]) {
            if (d[v] > du + w) {
                d[v] = du + w;
                pq.push({d[v], v});
            }
        }
    }
    return d;
}`,
        lang: "cpp",
        cap: "`if (du > d[u]) continue;` 这一行不能省：同一个点可能被压入多次，不跳过会让复杂度退化。",
        pit: "边权是 1 时别用 Dijkstra，直接 BFS 更快；边权可能为负时 Dijkstra 会给出错误结果，必须换 Bellman-Ford / SPFA。",
      },
      {
        t: "Bellman-Ford / SPFA：能处理负权",
        lead: "Bellman-Ford 做 n-1 轮「对所有边松弛」，如果第 n 轮还能松弛，说明有负环。",
        code: `// SPFA：队列优化的 Bellman-Ford
bool spfa(int s, int n, vector<vector<pair<int,int>>>& g, vector<long long>& d) {
    const long long INF = 1e18;
    d.assign(n + 1, INF);
    vector<int> inq(n + 1, 0), cnt(n + 1, 0);
    queue<int> q;
    d[s] = 0; q.push(s); inq[s] = 1;
    while (!q.empty()) {
        int u = q.front(); q.pop(); inq[u] = 0;
        for (auto [v, w] : g[u]) {
            if (d[v] > d[u] + w) {
                d[v] = d[u] + w;
                cnt[v] = cnt[u] + 1;
                if (cnt[v] >= n) return false;      // 入队链超过 n 次 → 负环
                if (!inq[v]) { q.push(v); inq[v] = 1; }
            }
        }
    }
    return true;
}`,
        lang: "cpp",
        cap: "判负环靠 `cnt[v] >= n`：一条最短路边数不会超过 n-1，超过就说明在负环上绕圈。",
        pit: "SPFA 的最坏复杂度仍是 O(nm)，出题人可以构造数据把它卡到超时。非负权一律用 Dijkstra。",
      },
      {
        t: "Floyd：三重循环的顺序不能错",
        lead: "Floyd 的本质是「允许经过前 k 个点时的最短路」，所以 k 必须在最外层。",
        code: `// 初始化：d[i][i]=0，有边则 d[u][v]=w，其余 INF
for (int k = 1; k <= n; ++k)                // k 必须在最外层！
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= n; ++j)
            if (d[i][k] + d[k][j] < d[i][j])
                d[i][j] = d[i][k] + d[k][j];

// 判负环：跑完后若存在 d[i][i] < 0，说明有负环
// 传递闭包：把 min 换成 "可达" 的或运算，用 bitset 可加速到 O(n³/64)`,
        lang: "cpp",
        pit: "把 k 写到内层会得到错误结果，而且小数据常常还是对的（因为 k 恰好按序），很难调试。记住口诀：**k 在最外层**。",
      },
    ],
    sum: "无权 BFS、非负 Dijkstra、有负 SPFA、全源 Floyd；负环看松弛次数与对角线。",
  },

  {
    id: "unionfind",
    cat: "图论",
    title: "并查集与最小生成树",
    diff: "中等",
    desc: "路径压缩 · 按秩合并 · Kruskal · 带权并查集",
    mins: 24,
    goals: [
      "手写带路径压缩的并查集（十行以内）",
      "解释为什么路径压缩后单次操作接近 O(1)",
      "用 Kruskal 求最小生成树并判连通",
      "用带权并查集处理「相对关系」类问题",
    ],
    sections: [
      {
        t: "并查集只干两件事",
        lead: "把两个集合合并（union），问两个元素是否同集合（find）。别的都不管，所以极快。",
        fig: "dsu",
        code: `int fa[N];
void init(int n) { for (int i = 1; i <= n; ++i) fa[i] = i; }

int find(int x) {                     // 路径压缩
    return fa[x] == x ? x : fa[x] = find(fa[x]);
}
void unite(int a, int b) {
    fa[find(a)] = find(b);
}
bool same(int a, int b) { return find(a) == find(b); }`,
        lang: "cpp",
        cap: "`fa[x] = find(fa[x])` 这一句把沿途所有节点直接挂到根上，之后查询就是一步。",
      },
      {
        t: "优化：压缩 + 按秩合并",
        lead: "路径压缩把树压平，按秩合并让矮树挂到高树下。两者合用，单次操作摊还 O(α(n))，实际就是常数。",
        code: `int fa[N], sz[N];
void init(int n) { for (int i = 1; i <= n; ++i) { fa[i] = i; sz[i] = 1; } }
int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (sz[a] < sz[b]) swap(a, b);     // 小树挂大树
    fa[b] = a;
    sz[a] += sz[b];
}`,
        lang: "cpp",
        table: [
          ["优化", "作用", "复杂度"],
          ["无优化", "可能退化成链", "O(n) 单次"],
          ["路径压缩", "查询路径全压平", "摊还 O(log n)"],
          ["按秩合并", "树高控制在对数级", "O(log n)"],
          ["两者合用", "近似常数", "摊还 O(α(n))"],
        ],
      },
      {
        t: "Kruskal：按边权从小到大挑",
        lead: "排序所有边，能连就连（两端不同集合），连到 n-1 条边就得到最小生成树。",
        code: `struct Edge { int u, v, w; };
long long kruskal(int n, vector<Edge>& es) {
    sort(es.begin(), es.end(), [](auto& a, auto& b) { return a.w < b.w; });
    init(n);
    long long sum = 0; int used = 0;
    for (auto& e : es) {
        if (find(e.u) == find(e.v)) continue;   // 已连通，加了会成环
        unite(e.u, e.v);
        sum += e.w; ++used;
        if (used == n - 1) break;               // 已够 n-1 条边
    }
    return used == n - 1 ? sum : -1;            // -1 表示图不连通
}`,
        lang: "cpp",
        cap: "Kruskal 正确性来自「割性质」：全局最小的那条跨割边一定属于某个最小生成树。",
        pit: "图不连通时 Kruskal 只能选出部分边，必须判断 `used == n-1`，否则会返回一个偏小的错误答案。",
      },
      {
        t: "带权并查集：处理相对关系",
        lead: "不只记「谁和谁一组」，还记「两人差多少」，就能解「食物链」「奇偶校验」这类题。",
        code: `// d[x] = x 到父亲的权值差；find 时顺带把 d 累加到根
int fa[N], d[N];
int find(int x) {
    if (fa[x] == x) return x;
    int r = find(fa[x]);
    d[x] += d[fa[x]];              // 累加到根的距离
    return fa[x] = r;
}
// 合并：让 a 的根挂到 b 的根下，需要满足 d[a] - d[b] = w
void unite(int a, int b, int w) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;          // 已同集合，可在这里校验矛盾
    fa[ra] = rb;
    d[ra] = d[b] + w - d[a];
}`,
        lang: "cpp",
        cap: "关键是先 `find` 再算 d：`find` 会把 d 更新成「到根的距离」，之后的加减才有意义。",
      },
    ],
    sum: "并查集 = find + union + 路径压缩；最小生成树按边权排序后「能连就连」。",
  },

  {
    id: "advanced",
    cat: "高级",
    title: "进阶算法路线图",
    diff: "较难",
    desc: "从区域赛铜牌到金牌的知识分布与刷题顺序",
    mins: 18,
    goals: [
      "知道每个阶段该学什么、不该碰什么",
      "按「性价比」排出自己的学习顺序",
      "识别自己当前卡在哪个层级",
    ],
    sections: [
      {
        t: "四个阶段，按顺序走",
        lead: "跳过基础直接学网络流，结果往往是「模板会背、题不会建」。",
        fig: "roadmap",
        table: [
          ["阶段", "核心内容", "对应水平", "建议题量"],
          ["入门", "语法 + 排序 + 二分 + 双指针 + 前缀和", "蓝桥省二 / 力扣 200 题", "150~250"],
          ["基础", "DFS/BFS + DP + 树 + 堆 + 并查集 + 最短路", "省一 / 区域赛铜", "250~450"],
          ["进阶", "线段树 + 树状数组 + 树形 DP + 状压 DP + 网络流", "区域赛银", "450~700"],
          ["高级", "多项式 + 生成函数 + 计算几何 + 字符串自动机", "区域赛金 / ICPC", "700+"],
        ],
      },
      {
        t: "性价比排序：先学什么最划算",
        lead: "同样的时间，有些知识点能覆盖一大片题，有些只能解一两道。",
        pts: [
          "**最高性价比**：二分、前缀和、双指针、BFS/DFS、基础 DP、并查集",
          "**次高**：堆、最短路、拓扑排序、树状数组、单调栈/队列",
          "**中等**：线段树、树形 DP、状压 DP、字符串哈希、KMP",
          "**低性价比（竞赛向）**：网络流、计算几何、多项式、后缀自动机",
          "**面试向另算**：链表、二叉树、哈希表、排序的工程实现比高级算法更重要",
        ],
        pit: "只背模板不做题是最大的浪费。一个模板至少配 5 道题：2 道裸模板、2 道变形、1 道综合，否则考场上根本认不出来。",
      },
      {
        t: "对拍：把「我觉得对」变成「确实对」",
        lead: "写完一份自认为正确的代码后，最有效的验证不是再看一遍，而是让暴力解和它在随机数据上互相对答案。",
        body: [
          "对拍由三个程序组成：**数据生成器**（造随机小数据）、**暴力解**（写法简单但正确）、**待测解**（你的代码）。循环跑几百组，一旦输出不同就停下来保存那组数据。",
        ],
        code: `# 1. 造数据：gen.py（小规模，保证暴力解能跑完）
import random
n = random.randint(1, 8)
print(n)
print(*[random.randint(-10, 10) for _ in range(n)])

# 2. 对拍循环：run.sh
for i in $(seq 1 300); do
  python3 gen.py > in.txt
  ./brute  < in.txt > out1.txt     # 暴力解
  ./submit < in.txt > out2.txt     # 待测解
  if ! diff -q out1.txt out2.txt > /dev/null; then
    echo "第 $i 组不同，数据在 in.txt"
    break
  fi
done
echo "对拍结束"`,
        lang: "bash",
        cap: "暴力解的写法要「笨但显然正确」：比如求最短路就用 Floyd 或全枚举，别用同一套思路写两遍——那样会一起错。",
        pts: [
          "先确保暴力解在大数据上会超时，但小数据一定对",
          "数据要覆盖边界：n=1、全相同、全递增、全递减、最大值",
          "对拍跑通不代表一定对：它只能发现「两份代码不一致」",
        ],
        pit: "对拍时两边都用 `endl` + 手写快读，输出格式差异（多余空格、行末空格）会让 diff 一直报错，先确认输出格式严格一致。",
      },
      {
        t: "怎么判断自己卡在哪一层",
        lead: "不看刷题数量，看「看到题的前 30 秒在想什么」。",
        table: [
          ["症状", "缺什么", "怎么补"],
          ["读完题不知道用什么", "题型识别不足", "按专题刷，每专题 20 题"],
          ["知道用什么但写不对", "模板不熟", "手写 10 遍模板，闭卷默写"],
          ["写得对但超时", "复杂度分析弱", "先算复杂度再写代码"],
          ["能过样例但 WA", "边界与数据范围", "自造极端数据：n=1、全相同、最大值"],
          ["对拍才能发现错", "缺证明习惯", "写完先想「为什么这样对」"],
        ],
      },
    ],
    sum: "先把二分、前缀和、BFS/DFS、基础 DP、并查集练到闭眼能写，再谈线段树和网络流。",
  },

  {
    id: "string-algo",
    cat: "字符串",
    title: "字符串算法专题",
    diff: "较难",
    desc: "KMP · 字符串哈希 · Trie · Manacher",
    mins: 28,
    goals: [
      "手写 KMP 的 next 数组并解释失配跳转",
      "用字符串哈希做 O(1) 子串比较并知道怎么防冲突",
      "用 Trie 做前缀查询与异或最大值",
      "用 Manacher 求最长回文子串",
    ],
    sections: [
      {
        t: "KMP：失配时不要从头再来",
        lead: "暴力匹配失配后主串回退、模式串归零；KMP 只回退模式串，因为「已经匹配的部分」本身告诉了你该跳到哪。",
        fig: "kmp",
        code: `// next[i] = 模式串 p[0..i] 的最长相等前后缀长度
vector<int> buildNext(const string& p) {
    int m = p.size();
    vector<int> nxt(m, 0);
    for (int i = 1, j = 0; i < m; ++i) {
        while (j && p[i] != p[j]) j = nxt[j - 1];   // 失配，回退
        if (p[i] == p[j]) ++j;
        nxt[i] = j;
    }
    return nxt;
}

// 在 s 中找 p 的所有出现位置
vector<int> kmp(const string& s, const string& p) {
    vector<int> nxt = buildNext(p), res;
    for (int i = 0, j = 0; i < (int)s.size(); ++i) {
        while (j && s[i] != p[j]) j = nxt[j - 1];
        if (s[i] == p[j]) ++j;
        if (j == (int)p.size()) { res.push_back(i - j + 1); j = nxt[j - 1]; }
    }
    return res;
}`,
        lang: "cpp",
        cap: "`j = nxt[j-1]` 是核心：利用「p 的前缀等于后缀」这个已知信息，把模式串往右滑而不是归零。",
        pit: "next 数组有两种定义（前缀长度 vs 前缀最后位置），网上模板混用会导致下标差 1。自己写一种，只用一种。",
      },
      {
        t: "字符串哈希：把子串比较变成整数比较",
        lead: "给每个字符一个权值，把子串当成 base 进制数取模。预处理前缀哈希后，任意子串哈希 O(1) 得到。",
        code: `const unsigned long long B = 131;
vector<unsigned long long> h(n + 1), pw(n + 1);
pw[0] = 1;
for (int i = 1; i <= n; ++i) {
    h[i] = h[i - 1] * B + s[i - 1];
    pw[i] = pw[i - 1] * B;
}
// 子串 [l, r]（0 基）的哈希，用 unsigned 自然溢出省掉取模
unsigned long long get(int l, int r) { return h[r + 1] - h[l] * pw[r - l + 1]; }`,
        lang: "cpp",
        body: [
          "**冲突概率**：自然溢出（2⁶⁴）下，10⁶ 次比较的冲突概率约 10⁻⁷ 量级，竞赛一般够用。要更稳就双哈希（两个 base + 两个模数）。",
          "**被卡**：出题人知道你用的 base 就能构造冲突。把 base 随机化（`chrono` 取时间做种子）几乎无法被卡。",
        ],
        pit: "幂数组 `pw` 一定要预处理到 n，否则每次快速幂会多一个 log；忘了初始化 `pw[0]=1` 会让所有子串哈希都变成 0。",
      },
      {
        t: "Trie：共享前缀的树",
        lead: "每个节点代表一个前缀，字符在边上。插入和查询都是 O(长度)，与集合大小无关。",
        code: `int ch[N][26], cnt[N], tot = 0;     // cnt 记录经过该节点的单词数
void insert(const string& s) {
    int u = 0;
    for (char c : s) {
        int v = c - 'a';
        if (!ch[u][v]) ch[u][v] = ++tot;
        u = ch[u][v];
        ++cnt[u];
    }
}
bool query(const string& s) {       // 是否为某个单词的前缀
    int u = 0;
    for (char c : s) {
        int v = c - 'a';
        if (!ch[u][v]) return false;
        u = ch[u][v];
    }
    return cnt[u] > 0;
}`,
        lang: "cpp",
        cap: "Trie 也常用于「最大异或对」：把数按二进制从高位插入，查询时尽量走相反位。",
      },
      {
        t: "Manacher：最长回文子串 O(n)",
        lead: "插入分隔符把奇偶长度统一，再用「已知回文半径」避免重复扩展。",
        code: `string manacher(const string& s) {
    string t = "^#";
    for (char c : s) { t += c; t += '#'; }
    t += '$';
    int n = t.size(), C = 0, R = 0, best = 0, center = 0;
    vector<int> p(n, 0);
    for (int i = 1; i < n - 1; ++i) {
        p[i] = (R > i) ? min(R - i, p[2 * C - i]) : 1;   // 复用对称点
        while (t[i + p[i]] == t[i - p[i]]) ++p[i];        // 继续扩展
        if (i + p[i] > R) { C = i; R = i + p[i]; }
        if (p[i] > best) { best = p[i]; center = i; }
    }
    int start = (center - best) / 2;
    return s.substr(start, best - 1);
}`,
        lang: "cpp",
        pit: "分隔符要选不会出现在原串里的字符（`^`、`$`、`#`），否则会误匹配；`p[i]` 初值为 1 而不是 0。",
      },
    ],
    sum: "KMP 记 next、哈希做比较、Trie 存前缀、Manacher 求回文；四件套覆盖 80% 字符串题。",
  },

  {
    id: "advanced-ds",
    cat: "数据结构",
    title: "高级数据结构：树状数组 · 线段树 · ST 表",
    diff: "较难",
    desc: "单点改区间查 · 区间改区间查 · 静态区间最值",
    mins: 30,
    goals: [
      "用树状数组完成单点修改 + 区间查询",
      "用差分树状数组完成区间修改 + 单点查询",
      "写出线段树的建树、修改、查询",
      "用 ST 表 O(1) 回答静态区间最值",
    ],
    sections: [
      {
        t: "树状数组：十分钟能写完的区间工具",
        lead: "核心只有一个函数 `lowbit(i) = i & -i`，它给出 i 管辖的区间长度。",
        fig: "fenwick",
        code: `int n, t[N];
void add(int i, int v) {                 // 单点加
    for (; i <= n; i += i & -i) t[i] += v;
}
int sum(int i) {                          // 前缀和
    int s = 0;
    for (; i > 0; i -= i & -i) s += t[i];
    return s;
}
int rangeSum(int l, int r) { return sum(r) - sum(l - 1); }`,
        lang: "cpp",
        cap: "修改时向上跳（i += lowbit），查询时向下跳（i -= lowbit）——方向反了就死循环或恒为 0。",
      },
      {
        t: "线段树：能做的比树状数组多得多",
        lead: "每个节点管一段区间，递归把区间对半分。区间修改 + 区间查询 + 维护最大值/最小值/最大子段和都能做。",
        code: `int tr[4 * N], lazy[4 * N];
void build(int u, int l, int r, int a[]) {
    if (l == r) { tr[u] = a[l]; return; }
    int m = (l + r) >> 1;
    build(u << 1, l, m, a); build(u << 1 | 1, m + 1, r, a);
    tr[u] = tr[u << 1] + tr[u << 1 | 1];
}
void pushDown(int u, int l, int r) {
    if (!lazy[u]) return;
    int m = (l + r) >> 1;
    tr[u << 1] += lazy[u] * (m - l + 1);      lazy[u << 1] += lazy[u];
    tr[u << 1 | 1] += lazy[u] * (r - m);      lazy[u << 1 | 1] += lazy[u];
    lazy[u] = 0;
}
void update(int u, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) { tr[u] += v * (r - l + 1); lazy[u] += v; return; }
    pushDown(u, l, r);
    int m = (l + r) >> 1;
    if (ql <= m) update(u << 1, l, m, ql, qr, v);
    if (qr > m)  update(u << 1 | 1, m + 1, r, ql, qr, v);
    tr[u] = tr[u << 1] + tr[u << 1 | 1];
}`,
        lang: "cpp",
        table: [
          ["需求", "首选", "复杂度"],
          ["单点改 + 区间和", "树状数组", "O(log n)"],
          ["区间改 + 单点查", "差分树状数组", "O(log n)"],
          ["区间改 + 区间和", "线段树（懒标记）", "O(log n)"],
          ["区间最值（静态）", "ST 表", "预处理 O(n log n)，查询 O(1)"],
          ["区间最值（动态）", "线段树", "O(log n)"],
        ],
        pit: "线段树数组要开 4n。开 2n 在区间长度不是 2 的幂时会越界，而且错误往往只在部分测试点上出现。",
      },
      {
        t: "ST 表：静态区间最值的最优解",
        lead: "如果数组不变、只有查询，ST 表预处理 O(n log n)、查询 O(1)，比线段树快得多。",
        code: `int st[LOG][N], lg[N];
void build(int n, int a[]) {
    lg[1] = 0;
    for (int i = 2; i <= n; ++i) lg[i] = lg[i / 2] + 1;
    for (int i = 1; i <= n; ++i) st[0][i] = a[i];
    for (int k = 1; (1 << k) <= n; ++k)
        for (int i = 1; i + (1 << k) - 1 <= n; ++i)
            st[k][i] = max(st[k-1][i], st[k-1][i + (1 << (k-1))]);
}
int queryMax(int l, int r) {
    int k = lg[r - l + 1];
    return max(st[k][l], st[k][r - (1 << k) + 1]);   // 两段可重叠
}`,
        lang: "cpp",
        cap: "查询用两段长度为 2^k 的区间覆盖 [l, r]，允许重叠是因为 max/min 这类「幂等」运算重复算不影响结果。",
        pit: "ST 表不支持修改。用「区间和」举例是错的——和重复计算会翻倍，所以 ST 表只能用于 max/min/gcd 这类幂等运算。",
      },
    ],
    sum: "单点改区间查用树状数组，区间改区间查用线段树，静态最值用 ST 表。",
  },

  {
    id: "monotonic",
    cat: "数据结构",
    title: "单调栈与单调队列",
    diff: "中等",
    desc: "下一个更大元素 · 柱状图最大矩形 · 窗口最值",
    mins: 22,
    goals: [
      "一眼认出「下一个更大 / 更小」类问题",
      "用单调栈做柱状图最大矩形与接雨水",
      "用单调队列做滑动窗口最值",
      "说清为什么总复杂度是 O(n)",
    ],
    sections: [
      {
        t: "共同思想：弹掉「不可能成为答案」的元素",
        lead: "新元素进来时，栈（队列）里那些「既不如它新、又不如它好」的元素永远不会再被用到，直接丢掉。",
        fig: "mono",
        code: `// 下一个更大元素：栈内下标对应的值单调递减
vector<int> nextGreater(vector<int>& a) {
    int n = a.size();
    vector<int> res(n, -1);
    stack<int> st;
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && a[st.top()] < a[i]) {
            res[st.top()] = a[i];
            st.pop();
        }
        st.push(i);
    }
    return res;
}`,
        lang: "cpp",
        cap: "每个下标最多入栈一次、出栈一次，所以整体是 O(n) 而不是 O(n²)。",
      },
      {
        t: "柱状图最大矩形",
        lead: "枚举「以每根柱子为高度」能扩展到多宽，左右各找第一个更矮的柱子——正好是两次单调栈。",
        code: `int largestRectangle(vector<int>& h) {
    int n = h.size(), best = 0;
    vector<int> L(n), R(n);
    stack<int> st;
    for (int i = 0; i < n; ++i) {              // 左边第一个更矮的
        while (!st.empty() && h[st.top()] >= h[i]) st.pop();
        L[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    while (!st.empty()) st.pop();
    for (int i = n - 1; i >= 0; --i) {          // 右边第一个更矮的
        while (!st.empty() && h[st.top()] >= h[i]) st.pop();
        R[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    for (int i = 0; i < n; ++i) best = max(best, h[i] * (R[i] - L[i] - 1));
    return best;
}`,
        lang: "cpp",
        cap: "区间宽度是 `R[i] - L[i] - 1`：两个更矮的柱子之间（不含端点）就是能扩展的范围。",
        pit: "用 `>=` 还是 `>` 决定相等高度怎么处理。用 `>=` 会把相等柱子弹出，宽度仍然正确；混用会导致某些情况少算一格。",
      },
      {
        t: "单调队列：滑动窗口最值",
        lead: "窗口内「又老又小」的元素永远不可能成为最大值，可以安全丢弃。",
        code: `vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> dq;                                // 存下标，值单调递减
    vector<int> res;
    for (int i = 0; i < (int)a.size(); ++i) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();   // 滑出窗口
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back(); // 丢掉更小的
        dq.push_back(i);
        if (i >= k - 1) res.push_back(a[dq.front()]);
    }
    return res;
}`,
        lang: "cpp",
        pts: [
          "队头出队条件是「下标过期」，不是「值过期」——所以必须存下标",
          "求最小值时把两处比较反号即可",
          "单调队列优化 DP：形如 `dp[i] = min(dp[j]) + w[i]`（j 在窗口内）都可以用它降到 O(n)",
        ],
      },
    ],
    sum: "单调栈找「左右第一个更小/更大」，单调队列维护「窗口内最值」，核心都是丢弃无用元素。",
  },

  {
    id: "dp-advanced",
    cat: "进阶",
    title: "DP 进阶四件套",
    diff: "较难",
    desc: "区间 DP · 状压 DP · 树形 DP · 数位 DP",
    mins: 32,
    goals: [
      "按区间长度递推写出区间 DP",
      "用二进制位表示集合做状压 DP",
      "用后序遍历做树形 DP 并处理「选/不选」",
      "用数位 DP 统计满足数位限制的个数",
    ],
    sections: [
      {
        t: "区间 DP：按长度从小到大填表",
        lead: "状态是 `dp[l][r]`，转移要枚举分割点 k，所以必须保证短区间先算好。",
        fig: "interval",
        code: `// 石子合并：每次合并相邻两堆，代价为两堆之和
// dp[l][r] = 合并 [l, r] 的最小代价
for (int i = 1; i <= n; ++i) dp[i][i] = 0;
for (int len = 2; len <= n; ++len)
    for (int l = 1; l + len - 1 <= n; ++l) {
        int r = l + len - 1;
        dp[l][r] = INF;
        for (int k = l; k < r; ++k)
            dp[l][r] = min(dp[l][r], dp[l][k] + dp[k+1][r] + pre[r] - pre[l-1]);
    }`,
        lang: "cpp",
        cap: "三层循环的顺序是固定套路：长度 → 起点 → 分割点。写错顺序就会用到还没算的格子。",
        pit: "环形石子合并要「断环成链」：把数组复制一份接在后面，答案取所有长度 n 的区间的最小值。",
      },
      {
        t: "状压 DP：用一个整数表示一个集合",
        lead: "n ≤ 20 时，`1 << n` 个状态就能表示所有子集，转移时枚举「下一个放谁」。",
        fig: "bitmask",
        code: `// TSP：dp[mask][i] = 走过 mask 这些点、当前在 i 的最小代价
int dp[1 << 20][20];
for (int mask = 0; mask < (1 << n); ++mask)
    for (int i = 0; i < n; ++i) {
        if (!(mask >> i & 1)) continue;              // i 必须在集合里
        for (int j = 0; j < n; ++j) {
            if (mask >> j & 1) continue;             // j 还没走过
            int nm = mask | (1 << j);
            dp[nm][j] = min(dp[nm][j], dp[mask][i] + w[i][j]);
        }
    }`,
        lang: "cpp",
        table: [
          ["操作", "写法", "含义"],
          ["判断第 k 位", "`x >> k & 1`", "k 在不在集合里"],
          ["加入 k", "`x | (1 << k)`", "把 k 放进集合"],
          ["删除 k", "`x & ~(1 << k)`", "把 k 移出集合"],
          ["枚举子集", "`for (s = x; s; s = (s-1) & x)`", "遍历 x 的所有非空子集"],
          ["最低位", "`x & -x`", "取出最低的 1"],
        ],
        pit: "`1 << n` 当 n=31 时会溢出 int（变成负数）。n 接近 30 时用 `1LL << n`，或者确认题目 n ≤ 20。",
      },
      {
        t: "树形 DP：后序遍历合并子树",
        lead: "先算儿子再算自己，天然就是后序。最经典的是「选或不选」两类状态。",
        code: `// 没有上司的舞会：选了 u 就不能选它的儿子
int dp[N][2];
void dfs(int u, int fa) {
    dp[u][1] = val[u];                 // 选 u
    dp[u][0] = 0;                       // 不选 u
    for (int v : g[u]) {
        if (v == fa) continue;
        dfs(v, u);
        dp[u][1] += dp[v][0];           // 选 u → 儿子不能选
        dp[u][0] += max(dp[v][0], dp[v][1]);  // 不选 u → 儿子随意
    }
}
// 答案 = max(dp[root][0], dp[root][1])`,
        lang: "cpp",
        cap: "`dfs(u, fa)` 传父亲是为了在无向图里避免走回去；有向树可以省略这个参数。",
        pit: "n 很大（10⁵）时递归深度会爆栈。把 dfs 改成「先求拓扑序，再逆序递推」，或者手工开栈。",
      },
      {
        t: "数位 DP：按位枚举 + 记忆化",
        lead: "统计 [0, N] 中满足某数位性质的数，按高位到低位逐位确定，用「是否顶到上界」和「是否已有非零位」做状态。",
        code: `// 统计 [0, N] 中不含 4 的数的个数
long long memo[20][2][2];
int dig[20];
long long dfs(int pos, bool limit, bool started) {
    if (pos < 0) return 1;
    if (memo[pos][limit][started] != -1) return memo[pos][limit][started];
    int up = limit ? dig[pos] : 9;
    long long res = 0;
    for (int d = 0; d <= up; ++d) {
        if (d == 4) continue;                              // 题目限制
        res += dfs(pos - 1, limit && d == up, started || d > 0);
    }
    return memo[pos][limit][started] = res;
}`,
        lang: "cpp",
        cap: "`limit` 表示「前面每一位都顶到了上界」，此时当前位只能枚举到 dig[pos]；否则可以到 9。",
        pit: "memo 里不要把 `limit=true` 的状态存下来复用——它依赖具体的上界，存了会串味。可以只缓存 `limit=false` 的情况。",
      },
    ],
    sum: "区间 DP 看长度、状压 DP 看 mask、树形 DP 看后序、数位 DP 看 limit。",
  },

  {
    id: "math-algo",
    cat: "数学",
    title: "数论与组合数学",
    diff: "中等",
    desc: "gcd / 快速幂 / 逆元 / 筛法 / 组合数",
    mins: 26,
    goals: [
      "用辗转相除求 gcd 与扩展 gcd",
      "用快速幂与费马小定理求模逆元",
      "用线性筛在 O(n) 内筛出素数表",
      "预处理阶乘求组合数取模",
    ],
    sections: [
      {
        t: "gcd 与扩展 gcd",
        lead: "辗转相除只需要一行；扩展 gcd 顺便求出 ax + by = gcd(a,b) 的一组解，是解同余方程的基础。",
        code: `int gcd(int a, int b) { return b ? gcd(b, a % b) : a; }
int lcm(int a, int b) { return a / gcd(a, b) * b; }   // 先除后乘防溢出

// 扩展 gcd：返回 g = gcd(a,b)，并求出 x, y 使 ax + by = g
long long exgcd(long long a, long long b, long long& x, long long& y) {
    if (!b) { x = 1; y = 0; return a; }
    long long g = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return g;
}`,
        lang: "cpp",
        cap: "`lcm` 必须先除后乘：a*b 在 a,b 都是 10⁹ 时会溢出 long long 以外的中间值（int 直接溢出）。",
      },
      {
        t: "快速幂与逆元",
        lead: "模运算下没有除法，要除 a 就乘 a 的逆元。模数是素数时，逆元就是 a^(p-2)。",
        code: `long long qpow(long long a, long long n, long long mod) {
    long long r = 1 % mod; a %= mod;
    while (n) {
        if (n & 1) r = r * a % mod;
        a = a * a % mod;
        n >>= 1;
    }
    return r;
}
long long inv(long long a, long long p) { return qpow(a, p - 2, p); }   // p 必须是素数

// 线性求 1..n 的逆元（O(n)）
inv[1] = 1;
for (int i = 2; i <= n; ++i) inv[i] = (p - p / i) * inv[p % i] % p;`,
        lang: "cpp",
        pit: "费马小定理只在模数为**素数**时成立。模数不是素数（如 1000000007 是素数，但 10⁹ 不是）时要用扩展欧几里得求逆元。",
      },
      {
        t: "筛法：一次筛出所有素数",
        lead: "埃氏筛 O(n log log n) 够用；线性筛 O(n) 更快，还能顺便求最小质因子与积性函数。",
        fig: "mathalgo",
        code: `// 线性筛
vector<int> primes;
vector<bool> comp(n + 1, false);
for (int i = 2; i <= n; ++i) {
    if (!comp[i]) primes.push_back(i);
    for (int p : primes) {
        if (1LL * i * p > n) break;
        comp[i * p] = true;
        if (i % p == 0) break;        // 保证每个合数只被最小质因子筛一次
    }
}`,
        lang: "cpp",
        cap: "`if (i % p == 0) break;` 是线性筛的灵魂：它保证每个合数只被它的最小质因子筛到，所以总复杂度是 O(n)。",
      },
      {
        t: "组合数：预处理阶乘",
        lead: "C(n,k) = n! / (k!(n-k)!) ，模素数下用逆元代替除法，O(1) 回答每次询问。",
        code: `vector<long long> fac(n + 1), ifac(n + 1);
fac[0] = 1;
for (int i = 1; i <= n; ++i) fac[i] = fac[i-1] * i % p;
ifac[n] = qpow(fac[n], p - 2, p);
for (int i = n; i >= 1; --i) ifac[i-1] = ifac[i] * i % p;

long long C(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fac[n] * ifac[k] % p * ifac[n-k] % p;
}`,
        lang: "cpp",
        table: [
          ["需求", "方法", "复杂度"],
          ["单次 C(n,k)、模素数", "阶乘 + 逆元", "预处理 O(n)、查询 O(1)"],
          ["n 很大 k 很小", "直接乘 k 项再除", "O(k)"],
          ["模数不是素数", "杨辉三角 / 扩展 Lucas", "O(n²) / 特殊处理"],
          ["多次询问不同模数", "Lucas 定理", "O(p log n)"],
        ],
      },
    ],
    sum: "gcd 一行、逆元靠费马、筛法用线性、组合数预处理阶乘。",
  },

  {
    id: "bit-trick",
    cat: "进阶",
    title: "位运算技巧与集合枚举",
    diff: "中等",
    desc: "lowbit · 子集枚举 · 异或性质 · 位压缩状态",
    mins: 20,
    goals: [
      "熟练使用六个常用位运算技巧",
      "用 lowbit 快速取出/删除最低位",
      "用 Gosper 式枚举所有大小为 k 的子集",
      "利用异或的消去性质解「只出现一次」类问题",
    ],
    sections: [
      {
        t: "六个必背操作",
        lead: "位运算的价值在于「一次操作处理 32/64 个布尔量」，既省时间也省空间。",
        fig: "bitmask",
        table: [
          ["操作", "写法", "说明"],
          ["取最低位的 1", "`x & -x`", "lowbit，树状数组的基础"],
          ["删除最低位的 1", "`x & (x - 1)`", "常用来数 1 的个数"],
          ["判断是否 2 的幂", "`x && !(x & (x - 1))`", "只有一个 1"],
          ["取第 k 位", "`x >> k & 1`", "注意优先级，加括号"],
          ["把第 k 位置 1", "`x | (1 << k)`", "常用于状压 DP"],
          ["交换两数", "`a ^= b; b ^= a; a ^= b;`", "不借助临时变量"],
        ],
        code: `// 统计二进制中 1 的个数
int popcount(int x) {
    int c = 0;
    while (x) { x &= x - 1; ++c; }   // 每次消掉最低位的 1
    return c;
}
// 判断是不是 2 的幂
bool isPow2(int x) { return x > 0 && !(x & (x - 1)); }`,
        lang: "cpp",
      },
      {
        t: "枚举子集：Gosper 与逐位枚举",
        lead: "「从 n 个元素里选 k 个」如果 n ≤ 20，用整数枚举比递归快得多。",
        code: `// 1. 枚举 mask 的所有非空子集（总复杂度 3^n，n ≤ 20 可用）
for (int s = mask; s; s = (s - 1) & mask) { /* 处理 s */ }

// 2. 枚举所有大小为 k 的子集（Gosper's Hack）
int x = (1 << k) - 1;
int limit = 1 << n;
while (x < limit) {
    /* 处理 x */
    int c = x & -x, r = x + c;
    x = (((r ^ x) >> 2) / c) | r;
}`,
        lang: "cpp",
        cap: "`(s - 1) & mask` 的作用是「把 s 减一，再限制在 mask 的位里」，这样能按字典序不重不漏地遍历所有子集。",
        pit: "`1 << 31` 在 int 下是未定义行为（符号位）。n ≥ 31 时全部改用 `1LL << n`，循环变量也用 long long。",
      },
      {
        t: "异或的三个性质",
        lead: "a^a=0、a^0=a、异或满足交换律结合律——这三条能解决一大类「配对」问题。",
        code: `// 1. 只出现一次的数（其余都出现两次）
int singleNumber(vector<int>& a) {
    int x = 0;
    for (int v : a) x ^= v;
    return x;
}

// 2. 只出现一次的两个数：先整体异或得到 x^y，再用 lowbit 分组
vector<int> singleNumberIII(vector<int>& a) {
    int xy = 0;
    for (int v : a) xy ^= v;
    int low = xy & -xy;                      // 取最低的不同位
    int x = 0, y = 0;
    for (int v : a) (v & low ? x : y) ^= v;  // 按这一位分成两组
    return {x, y};
}

// 3. 缺失的数字：把 0..n 和数组一起异或
int missingNumber(vector<int>& a) {
    int x = a.size();
    for (int i = 0; i < (int)a.size(); ++i) x ^= i ^ a[i];
    return x;
}`,
        lang: "cpp",
        pit: "「三个数出现一次、其余两次」不能直接异或。要按二进制位统计每个位出现次数模 3，再用 `%3` 重组答案。",
      },
    ],
    sum: "lowbit 取最低位、x&(x-1) 消最低位、异或管配对；n ≤ 20 就用整数枚举集合。",
  },

  {
    id: "graph-advanced",
    cat: "图论",
    title: "图论进阶：拓扑 · 二分图 · 网络流",
    diff: "较难",
    desc: "拓扑排序 · 匈牙利匹配 · 最大流最小割",
    mins: 30,
    goals: [
      "用入度法 / DFS 求拓扑序并判环",
      "用匈牙利算法求二分图最大匹配",
      "写出 Dinic 最大流并理解残量网络",
      "知道哪些问题能建模成匹配或最大流",
    ],
    sections: [
      {
        t: "拓扑排序：只存在于有向无环图",
        lead: "每次取入度为 0 的点输出，把它指向的点的入度减 1。输出不完就说明有环。",
        fig: "topo",
        code: `// Kahn 算法
vector<int> topo(int n, vector<vector<int>>& g, vector<int>& indeg) {
    queue<int> q;
    for (int i = 1; i <= n; ++i) if (!indeg[i]) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return order;                       // size < n 说明有环
}`,
        lang: "cpp",
        cap: "把 queue 换成 priority_queue 就能得到字典序最小的拓扑序。",
        pit: "拓扑排序前必须先算好入度数组。忘记统计入度会导致队列一开始就是空的，函数直接返回空结果。",
      },
      {
        t: "二分图最大匹配：匈牙利算法",
        lead: "左边每个点轮流去「找对象」：如果目标已被占，就让占着的人去另找——这是一个递归的让位过程。",
        code: `int match[N];                          // match[v] = 与右部 v 配对的左部点
bool used[N];
bool dfs(int u, vector<vector<int>>& g) {
    for (int v : g[u]) {
        if (used[v]) continue;
        used[v] = true;
        if (!match[v] || dfs(match[v], g)) {   // 空闲，或原配能让位
            match[v] = u;
            return true;
        }
    }
    return false;
}
int maxMatching(int nL, vector<vector<int>>& g) {
    int res = 0;
    for (int u = 1; u <= nL; ++u) {
        fill(used, used + N, false);
        if (dfs(u, g)) ++res;
    }
    return res;
}`,
        lang: "cpp",
        cap: "`used` 数组每轮必须重置：它表示「这一轮增广中右部点是否已被尝试」，复用会导致漏解。",
      },
      {
        t: "最大流：Dinic 模板",
        lead: "在网络里不断找「还能压多少」的增广路，直到找不到为止。Dinic 用分层图一次找多条，复杂度 O(n²m)。",
        code: `struct Edge { int to, cap, rev; };
vector<Edge> g[N];
void addEdge(int u, int v, int c) {
    g[u].push_back({v, c, (int)g[v].size()});
    g[v].push_back({u, 0, (int)g[u].size() - 1});   // 反向边容量 0
}
int level[N], iter[N];
bool bfs(int s, int t) {
    fill(level, level + N, -1);
    queue<int> q; level[s] = 0; q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto& e : g[u]) if (e.cap > 0 && level[e.to] < 0) {
            level[e.to] = level[u] + 1; q.push(e.to);
        }
    }
    return level[t] >= 0;
}
int dfs(int u, int t, int f) {
    if (u == t) return f;
    for (int& i = iter[u]; i < (int)g[u].size(); ++i) {
        auto& e = g[u][i];
        if (e.cap > 0 && level[u] < level[e.to]) {
            int d = dfs(e.to, t, min(f, e.cap));
            if (d > 0) { e.cap -= d; g[e.to][e.rev].cap += d; return d; }
        }
    }
    return 0;
}
int maxFlow(int s, int t) {
    int flow = 0;
    while (bfs(s, t)) {
        fill(iter, iter + N, 0);
        int f;
        while ((f = dfs(s, t, INT_MAX)) > 0) flow += f;
    }
    return flow;
}`,
        lang: "cpp",
        table: [
          ["问题", "建模方式", "对应算法"],
          ["二分图最大匹配", "源→左→右→汇，容量 1", "最大流 / 匈牙利"],
          ["最小点覆盖", "等于最大匹配（二分图）", "匈牙利"],
          ["最小路径覆盖", "拆点后求最大匹配", "最大流"],
          ["最大权闭合子图", "正权连源、负权连汇", "最小割"],
          ["任务分配 / 排班", "人连任务，容量为工时", "最大流"],
        ],
        pit: "反向边的 rev 下标很容易写错：`g[u].push_back({v,c,g[v].size()})` 时 `g[v].size()` 是加边前的长度，正好是反向边将要插入的位置。",
      },
    ],
    sum: "拓扑看入度、匹配靠让位、最大流找增广；建模比模板更难，先想清「谁是点、谁是边、容量是什么」。",
  },
];
