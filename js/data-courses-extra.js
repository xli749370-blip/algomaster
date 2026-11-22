// ============ 语言课程扩充：每门语言追加第 13 - 20 章 ============
// 结构沿用 COURSES[lang].lessons：{ title, sub, html }
// 本文件必须在 data-courses.js 之后、app.js 之前加载

(function () {
  if (typeof COURSES === "undefined") return;

  const EXTRA = {
    // ==================== C++ ====================
    cpp: [
      {
        title: "迭代器与算法库进阶",
        sub: "迭代器分类 · algorithm 全家桶 · lambda 与谓词",
        html: `
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;algorithm&gt;
#include &lt;numeric&gt;

vector&lt;int&gt; v = {5, 2, 8, 1, 9};

// 1. 排序与去重（最常用组合）
sort(v.begin(), v.end());                       // 1 2 5 8 9
v.erase(unique(v.begin(), v.end()), v.end());

// 2. 查找类：都要求区间有序
auto lo = lower_bound(v.begin(), v.end(), 5);   // 第一个 &gt;= 5
auto hi = upper_bound(v.begin(), v.end(), 5);   // 第一个 &gt;  5
int cnt = hi - lo;                              // 等于 5 的个数

// 3. 变换与统计
int mx = *max_element(v.begin(), v.end());
int mn = *min_element(v.begin(), v.end());
long long sum = accumulate(v.begin(), v.end(), 0LL);   // 0LL 决定返回类型
int even = count_if(v.begin(), v.end(), [](int x){ return x % 2 == 0; });

// 4. 重排与填充
reverse(v.begin(), v.end());
fill(v.begin(), v.end(), 0);
rotate(v.begin(), v.begin() + 2, v.end());      // 左移 2 位

// 5. 移除类：remove 不真删，要配合 erase
v.erase(remove_if(v.begin(), v.end(), [](int x){ return x &lt; 3; }), v.end());</code></pre>

    <h3>13.2 迭代器分类与失效规则</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 输入迭代器 → 前向 → 双向 → 随机访问（能力递增）
// vector/deque: 随机访问    list/set/map: 双向

// 迭代器失效：这是 C++ 最容易出隐蔽 bug 的地方
vector&lt;int&gt; v = {1, 2, 3, 4};
for (auto it = v.begin(); it != v.end(); ) {
    if (*it % 2 == 0) it = v.erase(it);   // 用返回值接住下一个位置
    else ++it;
}
// push_back 触发扩容会让所有迭代器/引用失效
// list/map 的 erase 只让被删元素的迭代器失效</code></pre>

    <div class="warn-box">⚠️ 遍历中删除元素的唯一正确写法是 <code>it = v.erase(it)</code>，不能写 <code>v.erase(it); ++it;</code>——erase 之后 it 已失效。</div>
  `
      },
      {
        title: "位运算与状态压缩",
        sub: "位技巧 · 子集枚举 · 状态压缩 DP",
        html: `
    <h3>14.1 常用位技巧</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 判断奇偶
x &amp; 1
// 取最低位的 1（lowbit）
int lb = x &amp; -x;
// 消掉最低位的 1
x &amp;= x - 1;
// 判断是否为 2 的幂
(x &amp; (x - 1)) == 0 &amp;&amp; x &gt; 0
// 第 k 位设 1 / 清 0 / 取反
x |=  (1 &lt;&lt; k);
x &amp;= ~(1 &lt;&lt; k);
x ^=  (1 &lt;&lt; k);
// 统计 1 的个数
__builtin_popcount(x);          // int
__builtin_popcountll(x);        // long long</code></pre>

    <h3>14.2 子集枚举</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 枚举 0..(1&lt;&lt;n)-1 的所有子集
for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++) {
    for (int i = 0; i &lt; n; i++)
        if (mask &gt;&gt; i &amp; 1) { /* 选第 i 个元素 */ }
}

// 枚举 mask 的所有非空子集（总复杂度 O(3^n)）
for (int sub = mask; sub; sub = (sub - 1) &amp; mask) {
    // sub 是 mask 的一个子集
}</code></pre>

    <h3>14.3 状态压缩 DP</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 旅行商问题：dp[mask][i] 表示已访问集合 mask、当前在 i 的最小代价
int n; vector&lt;vector&lt;int&gt;&gt; w;             // w[i][j] 边权
vector&lt;vector&lt;int&gt;&gt; dp(1 &lt;&lt; n, vector&lt;int&gt;(n, INT_MAX));
dp[1][0] = 0;                             // 从 0 出发
for (int mask = 1; mask &lt; (1 &lt;&lt; n); mask++)
    for (int i = 0; i &lt; n; i++) {
        if (!(mask &gt;&gt; i &amp; 1) || dp[mask][i] == INT_MAX) continue;
        for (int j = 0; j &lt; n; j++)
            if (!(mask &gt;&gt; j &amp; 1))
                dp[mask | (1 &lt;&lt; j)][j] = min(dp[mask | (1 &lt;&lt; j)][j], dp[mask][i] + w[i][j]);
    }</code></pre>

    <div class="warn-box">⚠️ 状压 DP 的状态数是指数级的，n 超过 20 基本就跑不动了。写之前先算 2^n，超过 1e7 就该换思路。</div>
  `
      },
      {
        title: "常用数学与数论",
        sub: "gcd/lcm · 快速幂 · 质数筛 · 组合数取模",
        html: `
    <h3>15.1 最大公约数与最小公倍数</h3>
    <span class="code-lang">C++</span>
    <pre><code>long long gcd_ll(long long a, long long b) {
    return b == 0 ? a : gcd_ll(b, a % b);
}
// C++17 起标准库自带
#include &lt;numeric&gt;
long long g = std::gcd(a, b);

// 最小公倍数：先除后乘防止溢出
long long lcm_ll(long long a, long long b) {
    return a / std::gcd(a, b) * b;
}</code></pre>

    <h3>15.2 快速幂与模逆元</h3>
    <span class="code-lang">C++</span>
    <pre><code>long long qpow(long long b, long long e, long long mod) {
    long long r = 1; b %= mod;
    while (e &gt; 0) {
        if (e &amp; 1) r = r * b % mod;
        b = b * b % mod;
        e &gt;&gt;= 1;
    }
    return r;
}
// 费马小定理求逆元（mod 必须是质数）
long long inv(long long a, long long mod) { return qpow(a, mod - 2, mod); }</code></pre>

    <h3>15.3 质数筛</h3>
    <span class="code-lang">C++</span>
    <pre><code>const int N = 1000005;
vector&lt;bool&gt; isPrime(N, true);
vector&lt;int&gt; primes;
void sieve() {
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i &lt; N; i++) {
        if (isPrime[i]) primes.push_back(i);
        for (int p : primes) {
            if (1LL * i * p &gt;= N) break;
            isPrime[i * p] = false;
            if (i % p == 0) break;      // 线性筛的关键：只被最小质因子筛一次
        }
    }
}</code></pre>

    <div class="warn-box">⚠️ 组合数 C(n,k) 取模时，若 mod 是质数且 n &lt; mod，用「阶乘 + 逆元」；n 很大而 mod 很小时要用 Lucas 定理。</div>
  `
      },
      {
        title: "字符串处理进阶",
        sub: "KMP · 字典树 · 字符串哈希",
        html: `
    <h3>16.1 KMP 前缀函数</h3>
    <span class="code-lang">C++</span>
    <pre><code>// nxt[i] = 模式串前 i+1 个字符的最长公共前后缀长度
vector&lt;int&gt; buildNext(const string&amp; p) {
    int m = p.size();
    vector&lt;int&gt; nxt(m, 0);
    for (int i = 1, k = 0; i &lt; m; i++) {
        while (k &amp;&amp; p[i] != p[k]) k = nxt[k - 1];
        if (p[i] == p[k]) k++;
        nxt[i] = k;
    }
    return nxt;
}
int kmpFirst(const string&amp; s, const string&amp; p) {
    auto nxt = buildNext(p);
    for (int i = 0, k = 0; i &lt; (int)s.size(); i++) {
        while (k &amp;&amp; s[i] != p[k]) k = nxt[k - 1];
        if (s[i] == p[k]) k++;
        if (k == (int)p.size()) return i - k + 1;
    }
    return -1;
}</code></pre>

    <h3>16.2 字典树</h3>
    <span class="code-lang">C++</span>
    <pre><code>struct Trie {
    struct Node { int ch[26] = {0}; int cnt = 0; bool end = false; };
    vector&lt;Node&gt; t{Node()};                       // 0 号是根

    void insert(const string&amp; s) {
        int u = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!t[u].ch[x]) { t[u].ch[x] = t.size(); t.push_back(Node()); }
            u = t[u].ch[x];
            t[u].cnt++;                           // 经过此节点的单词数
        }
        t[u].end = true;
    }
    bool find(const string&amp; s) {
        int u = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!t[u].ch[x]) return false;
            u = t[u].ch[x];
        }
        return t[u].end;
    }
};</code></pre>

    <h3>16.3 字符串哈希</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 滚动哈希 + 前缀，O(1) 判断任意子串是否相等
const long long B = 131, MOD = 1000000007;
vector&lt;long long&gt; h(n + 1, 0), pw(n + 1, 1);
for (int i = 0; i &lt; n; i++) {
    h[i + 1] = (h[i] * B + s[i]) % MOD;
    pw[i + 1] = pw[i] * B % MOD;
}
auto hashOf = [&amp;](int l, int r) {              // 闭区间
    return (h[r + 1] - h[l] * pw[r - l + 1] % MOD + MOD) % MOD;
};</code></pre>

    <div class="warn-box">⚠️ 单哈希有碰撞风险，竞赛里常用双哈希（两个模数）或改用 KMP。哈希只用于「大概率相等」，关键判断前最好再逐字符校验。</div>
  `
      },
      {
        title: "并查集与图论模板",
        sub: "DSU · 邻接表 · Dijkstra · Kruskal",
        html: `
    <h3>17.1 并查集</h3>
    <span class="code-lang">C++</span>
    <pre><code>struct DSU {
    vector&lt;int&gt; p, rk;
    int cnt;
    explicit DSU(int n) : p(n), rk(n, 0), cnt(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rk[a] &lt; rk[b]) swap(a, b);
        p[b] = a;
        if (rk[a] == rk[b]) rk[a]++;
        cnt--;
        return true;
    }
};</code></pre>

    <h3>17.2 邻接表建图</h3>
    <span class="code-lang">C++</span>
    <pre><code>int n, m;
vector&lt;vector&lt;int&gt;&gt; adj(n);                       // 无权图
vector&lt;vector&lt;pair&lt;int,int&gt;&gt;&gt; wadj(n);           // 带权图

// 无权
adj[u].push_back(v); adj[v].push_back(u);        // 无向
// 带权
wadj[u].push_back({v, w});
wadj[v].push_back({u, w});</code></pre>

    <h3>17.3 Dijkstra 与 Kruskal</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 堆优化 Dijkstra
vector&lt;long long&gt; dijkstra(int n, vector&lt;vector&lt;pair&lt;int,int&gt;&gt;&gt;&amp; g, int s) {
    const long long INF = 4e18;
    vector&lt;long long&gt; dist(n, INF);
    priority_queue&lt;pair&lt;long long,int&gt;, vector&lt;pair&lt;long long,int&gt;&gt;, greater&lt;&gt;&gt; pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d &gt; dist[u]) continue;
        for (auto [v, w] : g[u])
            if (d + w &lt; dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    return dist;
}

// Kruskal 最小生成树
long long kruskal(int n, vector&lt;array&lt;int,3&gt;&gt; edges) {   // {u, v, w}
    sort(edges.begin(), edges.end(), [](auto&amp; a, auto&amp; b) { return a[2] &lt; b[2]; });
    DSU d(n); long long sum = 0; int used = 0;
    for (auto&amp; e : edges)
        if (d.unite(e[0], e[1])) { sum += e[2]; if (++used == n - 1) break; }
    return used == n - 1 ? sum : -1;
}</code></pre>

    <div class="warn-box">⚠️ Dijkstra 不能处理负权边；负权用 Bellman-Ford 或 SPFA。带负权还要判负环的话，只能上 Bellman-Ford 并检查第 n 轮是否还能松弛。</div>
  `
      },
      {
        title: "调试、性能与常数优化",
        sub: "断点与断言 · 快速 IO · 缓存友好 · profile",
        html: `
    <h3>18.1 断言与日志</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;cassert&gt;

// 用断言暴露「不可能发生」的状态，出问题时立刻定位而不是继续算错
int binarySearch(const vector&lt;int&gt;&amp; a, int x) {
    int l = 0, r = (int)a.size() - 1;
    while (l &lt;= r) {
        int m = l + (r - l) / 2;
        if (a[m] == x) return m;
        if (a[m] &lt; x) l = m + 1; else r = m - 1;
    }
    assert(l &gt; r);        // 循环结束时必然 l &gt; r
    return -1;
}</code></pre>

    <h3>18.2 快速 IO</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 竞赛标准写法：关闭同步 + 解绑
ios::sync_with_stdio(false);
cin.tie(nullptr);

// 数据量极大（1e6 以上）时手写读入
inline int readInt() {
    int x = 0, f = 1; char c = getchar();
    while (c &lt; '0' || c &gt; '9') { if (c == '-') f = -1; c = getchar(); }
    while (c &gt;= '0' &amp;&amp; c &lt;= '9') { x = x * 10 + (c - '0'); c = getchar(); }
    return x * f;
}
// 注意：用了 sync_with_stdio(false) 后不能和 scanf/printf 混用</code></pre>

    <h3>18.3 常数优化的三个方向</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 1. 减少拷贝：大对象传 const&amp;，返回值靠 RVO 不用 std::move
void process(const vector&lt;int&gt;&amp; v);

// 2. 缓存友好：二维数组按行访问，不要按列跳
for (int i = 0; i &lt; n; i++)
    for (int j = 0; j &lt; m; j++) sum += a[i][j];      // 局部性最好

// 3. 减少分支与函数调用：热点循环里把 size() 提到循环外
int sz = v.size();
for (int i = 0; i &lt; sz; i++) ...

// 4. 用 + 优化代替 %（模数是 2 的幂时）
x % 8   →   x &amp; 7</code></pre>

    <div class="warn-box">⚠️ 优化前先测量。用 <code>gprof</code> / <code>perf</code> / 计时器定位真正的热点，凭感觉优化常常是在优化 1% 的代码而让另外 99% 变难读。</div>
  `
      },
      {
        title: "工程组织与 CMake 入门",
        sub: "多文件拆分 · 头文件规范 · CMake · 单元测试",
        html: `
    <h3>19.1 头文件与时序</h3>
    <span class="code-lang">C++</span>
    <pre><code>// include/solution.h
#pragma once
#include &lt;vector&gt;

class Solution {
public:
    int solve(const std::vector&lt;int&gt;&amp; a);
};

// src/solution.cpp
#include "solution.h"

int Solution::solve(const std::vector&lt;int&gt;&amp; a) {
    int best = 0, cur = 0;
    for (int x : a) { cur = std::max(0, cur + x); best = std::max(best, cur); }
    return best;
}</code></pre>

    <h3>19.2 CMakeLists.txt</h3>
    <span class="code-lang">C++</span>
    <pre><code>cmake_minimum_required(VERSION 3.16)
project(algorithm_master CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

# 数据结构的公共实现编成静态库
add_library(ds STATIC src/dsu.cpp src/segtree.cpp)
target_include_directories(ds PUBLIC include)

# 可执行程序
add_executable(main src/main.cpp)
target_link_libraries(main PRIVATE ds)</code></pre>

    <pre><code># 构建流程
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j</code></pre>

    <h3>19.3 一个最小单元测试</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;cassert&gt;
#include "solution.h"

int main() {
    Solution s;
    assert(s.solve({1, -2, 3, -1, 2}) == 4);
    assert(s.solve({}) == 0);            // 边界
    assert(s.solve({-5}) == 0);          // 全负
    return 0;
}</code></pre>

    <div class="warn-box">⚠️ 头文件里只放声明，实现放 .cpp；函数定义写在头文件里又没加 inline，多文件引用时会报重复定义（multiple definition）。</div>
  `
      },
      {
        title: "现代 C++ 新特性视野",
        sub: "concepts · ranges · 结构化绑定 · 协程概览",
        html: `
    <h3>20.1 结构化绑定与 auto</h3>
    <span class="code-lang">C++</span>
    <pre><code>map&lt;string, int&gt; m = {{"a", 1}};
for (auto&amp; [k, v] : m) cout &lt;&lt; k &lt;&lt; v;      // 引用避免拷贝

pair&lt;int,int&gt; t = {3, 4};
auto [x, y] = t;

// 数组/结构体也支持
struct Point { int x, y; };
auto [px, py] = Point{1, 2};</code></pre>

    <h3>20.2 ranges：告别 begin/end</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;ranges&gt;
#include &lt;algorithm&gt;

vector&lt;int&gt; v = {5, 3, 9, 1, 7};
ranges::sort(v);                                   // 直接传容器
auto evens = v | views::filter([](int x){ return x % 2 == 0; });
auto doubled = v | views::transform([](int x){ return x * 2; });

// 惰性求值：views 只在遍历时计算，不产生中间容器
for (int x : v | views::take(3) | views::reverse) cout &lt;&lt; x &lt;&lt; ' ';</code></pre>

    <h3>20.3 concepts：约束模板参数</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;concepts&gt;

template &lt;typename T&gt;
requires std::integral&lt;T&gt;
T twice(T x) { return x * 2; }

// 简写形式
void print(const std::ranges::range auto&amp; r) {
    for (const auto&amp; x : r) std::cout &lt;&lt; x &lt;&lt; ' ';
}</code></pre>

    <h3>20.4 值得了解的方向</h3>
    <ul>
      <li><b>协程（coroutine）</b>：用 co_await/co_yield 写异步代码，避免回调地狱</li>
      <li><b>模块（modules）</b>：用 import 取代 #include，编译速度大幅提升</li>
      <li><b>Concurrency TS</b>：std::jthread、stop_token 让线程取消变自然</li>
      <li><b>format</b>：std::format 取代 printf / iostream 拼接</li>
    </ul>

    <div class="warn-box">⚠️ 竞赛/评测环境通常只到 C++17，写题时别用 C++20 的 ranges 和 concepts。想用新特性先确认目标编译器版本。</div>
  `
      }
    ],

    // ==================== Python ====================
    python: [
      {
        title: "推导式与生成器",
        sub: "列表/字典/集合推导式 · yield · 惰性求值",
        html: `
    <h3>13.1 四种推导式</h3>
    <span class="code-lang">Python</span>
    <pre><code># 列表推导式
squares = [x * x for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# 嵌套推导式（注意顺序：外层在前）
pairs = [(i, j) for i in range(3) for j in range(3) if i != j]

# 字典推导式
index = {v: i for i, v in enumerate(["a", "b", "c"])}

# 集合推导式（自动去重）
uniq = {x % 5 for x in range(20)}

# 生成器表达式：用圆括号，惰性求值，省内存
total = sum(x * x for x in range(1000000))</code></pre>

    <h3>13.2 生成器函数</h3>
    <span class="code-lang">Python</span>
    <pre><code>def fib():
    a, b = 0, 1
    while True:
        yield a                 # 每次 yield 暂停并返回值
        a, b = b, a + b

# 只取前 10 个，不会算完所有
import itertools
print(list(itertools.islice(fib(), 10)))

# 生成器只能遍历一次
g = (x for x in range(5))
print(sum(g))                   # 10
print(sum(g))                   # 0 —— 已经耗尽</code></pre>

    <h3>13.3 什么时候用生成器</h3>
    <ul>
      <li>数据量大到放不进内存（逐行读文件、流式处理日志）</li>
      <li>只需要遍历一次，不需要索引和切片</li>
      <li>流水线式处理：<code>a = (f(x) for x in src)</code> 再 <code>b = (g(y) for y in a)</code></li>
    </ul>

    <div class="warn-box">⚠️ 生成器耗尽后不会自动重置。需要重复遍历时要么写成函数每次调用都返回新生成器，要么老老实实用 list。</div>
  `
      },
      {
        title: "装饰器与上下文管理器",
        sub: "@decorator · functools.wraps · with 与 __enter__",
        html: `
    <h3>14.1 装饰器</h3>
    <span class="code-lang">Python</span>
    <pre><code>import functools, time

def timer(func):
    @functools.wraps(func)              # 保留原函数名与文档，必须加
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时 {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timer
def heavy(n):
    return sum(i * i for i in range(n))

# 带参数的装饰器：多包一层
def retry(times=3):
    def deco(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if i == times - 1:
                        raise
        return wrapper
    return deco

@retry(times=5)
def fetch(): ...</code></pre>

    <h3>14.2 上下文管理器</h3>
    <span class="code-lang">Python</span>
    <pre><code># 写法一：类
class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self
    def __exit__(self, exc_type, exc, tb):
        print(f"耗时 {time.perf_counter() - self.start:.4f}s")
        return False                    # 返回 True 会吞掉异常

with Timer():
    heavy(100000)

# 写法二：contextmanager 装饰器（更简洁）
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield
    finally:
        print(f"耗时 {time.perf_counter() - start:.4f}s")</code></pre>

    <div class="warn-box">⚠️ 装饰器一定要写 <code>@functools.wraps(func)</code>，否则被装饰函数的 <code>__name__</code> 全变成 wrapper，日志和调试会很难受。</div>
  `
      },
      {
        title: "迭代器协议与 itertools",
        sub: "__iter__/__next__ · itertools 六大工具 · 组合数学",
        html: `
    <h3>15.1 迭代器协议</h3>
    <span class="code-lang">Python</span>
    <pre><code>class Countdown:
    def __init__(self, n):
        self.n = n
    def __iter__(self):
        return self
    def __next__(self):
        if self.n &lt;= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

for x in Countdown(3):
    print(x)        # 3 2 1

# 任何可迭代对象都能用这些内置函数
nums = [3, 1, 4, 1, 5]
print(max(nums), min(nums), sum(nums), sorted(nums))
print(all(x &gt; 0 for x in nums), any(x &gt; 4 for x in nums))</code></pre>

    <h3>15.2 itertools 常用工具</h3>
    <span class="code-lang">Python</span>
    <pre><code>import itertools as it

# 1. 无限迭代
it.count(1, 2)            # 1, 3, 5, ...
it.cycle("AB")            # A B A B ...
it.repeat(7, 3)           # 7 7 7

# 2. 切片与拼接
list(it.islice(it.count(), 5))            # [0,1,2,3,4]
list(it.chain([1,2], [3], [4,5]))         # [1,2,3,4,5]

# 3. 组合数学（竞赛高频）
list(it.permutations([1,2,3], 2))          # 排列 6 种
list(it.combinations([1,2,3], 2))          # 组合 3 种
list(it.combinations_with_replacement([1,2], 2))

# 4. 分组（必须先按 key 排序）
for k, g in it.groupby(sorted("aabbcc")):
    print(k, len(list(g)))

# 5. 累积
list(it.accumulate([1,2,3,4]))             # [1,3,6,10]
list(it.accumulate([1,2,3,4], max))        # [1,2,3,4]</code></pre>

    <div class="warn-box">⚠️ groupby 只能合并相邻的同 key 元素，不排序直接用会得到一堆长度 1 的组。</div>
  `
      },
      {
        title: "类型注解与 dataclass",
        sub: "typing · dataclass · 从注解到文档",
        html: `
    <h3>16.1 基本类型注解</h3>
    <span class="code-lang">Python</span>
    <pre><code>from typing import Optional, Union, Iterable

def greet(name: str, times: int = 1) -&gt; str:
    return (f"Hello, {name}! " * times).strip()

def find(a: list[int], x: int) -&gt; Optional[int]:
    """返回下标，找不到返回 None"""
    for i, v in enumerate(a):
        if v == x:
            return i
    return None

# 联合类型（3.10+ 可以写 int | None）
def parse(x: Union[int, str]) -&gt; int: ...

# 注解只是提示，运行时不会检查类型
greet(123)      # 不报错，但不符合预期</code></pre>

    <h3>16.2 dataclass</h3>
    <span class="code-lang">Python</span>
    <pre><code>from dataclasses import dataclass, field

@dataclass
class Node:
    val: int
    children: list[int] = field(default_factory=list)   # 可变默认值必须用 factory
    tag: str = ""

    def total(self) -&gt; int:
        return self.val + sum(self.children)

n = Node(1, [2, 3])
print(n)            # 自动生成 __repr__
print(n == Node(1, [2, 3]))   # 自动生成 __eq__

# 不可变 + 可哈希
@dataclass(frozen=True)
class Point:
    x: int
    y: int

# 排序
@dataclass(order=True)
class Item:
    price: int
    name: str = field(compare=False)   # 不参与比较</code></pre>

    <div class="warn-box">⚠️ dataclass 的可变默认值（list/dict）必须用 <code>field(default_factory=list)</code>，直接写 <code>= []</code> 会抛 ValueError——所有实例共享同一个列表是最经典的坑。</div>
  `
      },
      {
        title: "并发：线程、进程与 asyncio",
        sub: "GIL · ThreadPoolExecutor · multiprocessing · async/await",
        html: `
    <h3>17.1 三种并发的选择</h3>
    <ul>
      <li><b>IO 密集</b>（网络请求、读写文件）→ 多线程或 asyncio</li>
      <li><b>CPU 密集</b>（大量计算）→ 多进程，绕开 GIL</li>
      <li><b>海量并发连接</b> → asyncio（单线程事件循环，开销最小）</li>
    </ul>

    <h3>17.2 线程池</h3>
    <span class="code-lang">Python</span>
    <pre><code>from concurrent.futures import ThreadPoolExecutor

def fetch(url):
    ...

with ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(fetch, urls))          # 保持顺序

# 需要异常处理时用 submit
futures = [pool.submit(fetch, u) for u in urls]
for f in futures:
    try:
        print(f.result())
    except Exception as e:
        print("失败", e)</code></pre>

    <h3>17.3 多进程</h3>
    <span class="code-lang">Python</span>
    <pre><code>from concurrent.futures import ProcessPoolExecutor

def cpu_job(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":                 # Windows 上必须加这行
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(cpu_job, [10**6] * 4)))</code></pre>

    <h3>17.4 asyncio</h3>
    <span class="code-lang">Python</span>
    <pre><code>import asyncio

async def fetch(i):
    await asyncio.sleep(1)             # 模拟 IO，不阻塞事件循环
    return i * 2

async def main():
    results = await asyncio.gather(*[fetch(i) for i in range(5)])
    print(results)                     # 总共约 1 秒而不是 5 秒

asyncio.run(main())</code></pre>

    <div class="warn-box">⚠️ asyncio 里调用阻塞函数（time.sleep、requests.get、大量计算）会卡死整个事件循环。要么换成异步库（aiohttp），要么丢进 <code>loop.run_in_executor</code>。</div>
  `
      },
      {
        title: "正则表达式实战",
        sub: "常用元字符 · 分组与命名 · 贪婪与非贪婪 · 实战模式",
        html: `
    <h3>18.1 基础语法速记</h3>
    <span class="code-lang">Python</span>
    <pre><code>import re

# 元字符
.        任意字符（不含换行）
\\d       数字      \\D  非数字
\\w       字母数字下划线   \\W  相反
\\s       空白      \\S  非空白
^ $      行首/行尾
* + ?    {n} {n,m}   量词（贪婪）
*? +? ??             非贪婪

# 字符集与分组
[abc]    其中任意一个    [^abc]  排除
(a|b)    分组或          (?:...) 非捕获分组
(?P&lt;name&gt;...)  命名分组</code></pre>

    <h3>18.2 常用函数</h3>
    <span class="code-lang">Python</span>
    <pre><code>s = "订单 A123 金额 88.5 元，订单 B456 金额 120 元"

# findall：返回所有匹配
re.findall(r"[A-Z]\\d{3}", s)                 # ['A123', 'B456']

# search：找第一个，返回 Match
m = re.search(r"金额 (\\d+(?:\\.\\d+)?)", s)
print(m.group(1))                             # 88.5

# 命名分组更好读
m = re.search(r"(?P&lt;amt&gt;\\d+(?:\\.\\d+)?) 元", s)
print(m.group("amt"))

# sub 替换
re.sub(r"\\d+", "#", s)

# 编译复用（循环里必须编译，否则每次都重新解析）
pat = re.compile(r"[A-Z]\\d{3}")
pat.findall(s)</code></pre>

    <h3>18.3 三个实战模式</h3>
    <span class="code-lang">Python</span>
    <pre><code># 1. 校验：用 fullmatch 而不是 match（match 只匹配开头）
re.fullmatch(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", "a@b.com")

# 2. 非贪婪提取标签内容
re.findall(r"&lt;b&gt;(.*?)&lt;/b&gt;", "&lt;b&gt;x&lt;/b&gt;&lt;b&gt;y&lt;/b&gt;")   # ['x', 'y']

# 3. 多行模式
re.findall(r"^\\d+", text, flags=re.M)</code></pre>

    <div class="warn-box">⚠️ 正则不要用来解析 HTML/JSON 这类嵌套结构，很容易漏边界。用专门的解析库；正则在「扁平文本抽取」上才是强项。</div>
  `
      },
      {
        title: "性能优化与剖析",
        sub: "cProfile · 时间复杂度陷阱 · 数据结构选择 · 内存",
        html: `
    <h3>19.1 先测量再优化</h3>
    <span class="code-lang">Python</span>
    <pre><code>import cProfile, pstats

def job():
    ...

cProfile.run("job()", "out.prof")
p = pstats.Stats("out.prof")
p.sort_stats("cumulative").print_stats(10)     # 看累计耗时 top10

# 简单计时
import time
t = time.perf_counter()
job()
print(f"{(time.perf_counter() - t) * 1000:.1f} ms")</code></pre>

    <h3>19.2 五个最常见的性能陷阱</h3>
    <span class="code-lang">Python</span>
    <pre><code># 1. 循环里做 in 判断（list 是 O(n)，set 是 O(1)）
if x in my_list:    →    if x in my_set:

# 2. 字符串循环拼接（每次新建对象，O(n^2)）
s = ""
for w in words: s += w          →    s = "".join(words)

# 3. 重复计算
for i in range(len(a)):
    for j in range(len(a)):            # len 提到外面
        ...

# 4. 用错数据结构
# 需要频繁在头部插入 → collections.deque 而不是 list
from collections import deque

# 5. 无谓的深拷贝
import copy
copy.deepcopy(big)      →    只在需要独立副本时用

# 6. 大量元素求和用内置函数（C 层实现）
sum(a) 比手写 for 快一个数量级</code></pre>

    <h3>19.3 内存视角</h3>
    <span class="code-lang">Python</span>
    <pre><code>import sys
sys.getsizeof([0] * 1000)          # 只算容器本身，不含元素

# 用 __slots__ 减少实例字典开销
class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

# array / numpy 存数值比 list 省几十倍内存
from array import array
a = array("i", range(1000))</code></pre>

    <div class="warn-box">⚠️ Python 的 <code>a += b</code> 对 list 是原地扩展（O(k)），对 str 是新建（O(n+k)）。同样是加号，语义差别很大。</div>
  `
      },
      {
        title: "虚拟环境与项目结构",
        sub: "venv · pip/requirements · 包组织 · 代码规范",
        html: `
    <h3>20.1 虚拟环境</h3>
    <pre><code># 创建与激活
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# macOS / Linux
source .venv/bin/activate

# 导出与安装依赖
pip freeze &gt; requirements.txt
pip install -r requirements.txt</code></pre>

    <h3>20.2 推荐的项目结构</h3>
    <pre><code>project/
├── .venv/                  # 虚拟环境（不进版本库）
├── src/
│   └── mypkg/
│       ├── __init__.py     # 标记为包，可在此导出公共 API
│       ├── core.py
│       └── utils.py
├── tests/
│   ├── test_core.py
│   └── conftest.py
├── pyproject.toml          # 项目元信息与依赖
├── requirements.txt
└── README.md</code></pre>

    <h3>20.3 包与导入</h3>
    <span class="code-lang">Python</span>
    <pre><code># src/mypkg/__init__.py
from .core import solve            # 对外暴露
__all__ = ["solve"]

# 使用方
from mypkg import solve

# 相对导入只在包内有效
from .utils import helper

# 判断是否被直接运行
if __name__ == "__main__":
    print(solve([1, 2, 3]))</code></pre>

    <h3>20.4 代码规范清单</h3>
    <ul>
      <li>变量与函数用小写加下划线，类用大驼峰，常量全大写</li>
      <li>函数只做一件事，超过 50 行就该拆</li>
      <li>用 f-string 而不是 % 或 format</li>
      <li>用 <code>is None</code> 而不是 <code>== None</code></li>
      <li>异常捕获要具体，别写裸 <code>except:</code></li>
      <li>用 black / ruff 自动格式化，别手工对齐</li>
    </ul>

    <div class="warn-box">⚠️ 不要把项目根目录加进 sys.path 来「解决」导入问题，那只是把问题藏起来。规范做法是安装成可编辑包：<code>pip install -e .</code>。</div>
  `
      }
    ],

    // ==================== Java ====================
    java: [
      {
        title: "IO 与 NIO 基础",
        sub: "字节流字符流 · 缓冲 · Files · 快速读入",
        html: `
    <h3>13.1 流的分类</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 字节流：处理二进制（图片、压缩包）
InputStream  / OutputStream
FileInputStream / FileOutputStream

// 字符流：处理文本（自动处理编码）
Reader / Writer
FileReader / FileWriter

// 永远套一层缓冲，否则每次读写都是一次系统调用
BufferedReader br = new BufferedReader(new FileReader("in.txt"));
BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"));</code></pre>

    <h3>13.2 try-with-resources</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 自动关闭，等价于 finally 里 close，且能正确合并异常
try (BufferedReader br = new BufferedReader(new FileReader("in.txt"));
     BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        bw.write(line.toUpperCase());
        bw.newLine();
    }
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>

    <h3>13.3 Files 工具类（推荐）</h3>
    <span class="code-lang">Java</span>
    <pre><code>import java.nio.file.*;

// 一次读完（小文件）
List&lt;String&gt; lines = Files.readAllLines(Path.of("in.txt"));
String all = Files.readString(Path.of("in.txt"));

// 写入
Files.writeString(Path.of("out.txt"), "hello\\n");

// 遍历目录
try (var stream = Files.list(Path.of("."))) {
    stream.filter(p -&gt; p.toString().endsWith(".java")).forEach(System.out::println);
}</code></pre>

    <h3>13.4 算法竞赛的快速读入</h3>
    <span class="code-lang">Java</span>
    <pre><code>static class FastScanner {
    private final InputStream in = System.in;
    private final byte[] buf = new byte[1 &lt;&lt; 16];
    private int ptr = 0, len = 0;

    private int read() throws IOException {
        if (ptr &gt;= len) { len = in.read(buf); ptr = 0; if (len &lt;= 0) return -1; }
        return buf[ptr++];
    }
    int nextInt() throws IOException {
        int c, x = 0, sign = 1;
        do { c = read(); } while (c &lt;= ' ');
        if (c == '-') { sign = -1; c = read(); }
        while (c &gt;= '0' &amp;&amp; c &lt;= '9') { x = x * 10 + c - '0'; c = read(); }
        return x * sign;
    }
}</code></pre>

    <div class="warn-box">⚠️ Scanner 用起来方便但极慢（1e6 个整数可能直接 TLE）。大数据量必须用 BufferedReader + StringTokenizer 或手写 FastScanner。</div>
  `
      },
      {
        title: "反射与注解",
        sub: "Class 对象 · 反射调用 · 自定义注解",
        html: `
    <h3>14.1 拿到 Class 的三种方式</h3>
    <span class="code-lang">Java</span>
    <pre><code>Class&lt;?&gt; c1 = String.class;              // 类字面量
Class&lt;?&gt; c2 = "abc".getClass();          // 实例
Class&lt;?&gt; c3 = Class.forName("java.lang.String");   // 全限定名

System.out.println(c1 == c2);            // true，同一个 Class 对象
System.out.println(c1.getSimpleName());  // String
System.out.println(c1.getSuperclass());</code></pre>

    <h3>14.2 反射创建与调用</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 无参构造 + 方法调用
Class&lt;?&gt; c = Class.forName("com.example.Solution");
Object obj = c.getDeclaredConstructor().newInstance();
Method m = c.getMethod("solve", int[].class);
Object res = m.invoke(obj, (Object) new int[]{1, 2, 3});

// 访问私有成员（需要 setAccessible，模块化后可能被禁）
Field f = c.getDeclaredField("cache");
f.setAccessible(true);
System.out.println(f.get(obj));</code></pre>

    <h3>14.3 自定义注解</h3>
    <span class="code-lang">Java</span>
    <pre><code>import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)      // 运行时保留才能被反射读到
@Target(ElementType.METHOD)
public @interface Benchmarked {
    String value() default "";
}

// 使用 + 通过反射读取
class Task {
    @Benchmarked("排序")
    public void sort() { ... }
}

Method m = Task.class.getMethod("sort");
if (m.isAnnotationPresent(Benchmarked.class)) {
    System.out.println(m.getAnnotation(Benchmarked.class).value());
}</code></pre>

    <div class="warn-box">⚠️ 反射会绕过编译期检查、性能比直接调用慢一个数量级，还会破坏封装。框架（Spring、JUnit）大量用它是因为通用性，业务代码里能不用就别用。</div>
  `
      },
      {
        title: "集合源码视角",
        sub: "ArrayList 扩容 · HashMap 原理 · 负载因子 · 线程安全",
        html: `
    <h3>15.1 ArrayList 扩容机制</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 默认容量 10（首次 add 时才分配）
// 扩容公式：newCapacity = oldCapacity + (oldCapacity >> 1)  即 1.5 倍
ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();
list.add(1);                     // 内部数组变成容量 10

// 已知规模时预设容量，避免多次扩容+拷贝
ArrayList&lt;Integer&gt; big = new ArrayList&lt;&gt;(1_000_000);

// 结论：随机访问 O(1)，尾部追加均摊 O(1)，中间插入删除 O(n)</code></pre>

    <h3>15.2 HashMap 核心原理</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 1. 数组 + 链表 + 红黑树（链表长度 &gt;= 8 且容量 &gt;= 64 时转树）
// 2. 索引计算：hash(key) &amp; (n - 1)，所以容量必须是 2 的幂
// 3. 默认初始容量 16，负载因子 0.75，元素数超过 12 就扩容为 2 倍
// 4. put 流程：算 hash -&gt; 定位桶 -&gt; 空则放 -&gt; 否则比对 key -&gt; 相等则覆盖 -&gt; 不等则尾插

HashMap&lt;String, Integer&gt; map = new HashMap&lt;&gt;(16, 0.75f);

// 5. 作为 key 的对象必须正确重写 hashCode 与 equals
class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x &amp;&amp; y == p.y;
    }
    @Override public int hashCode() { return Objects.hash(x, y); }
}</code></pre>

    <h3>15.3 选型对照</h3>
    <ul>
      <li><code>ArrayList</code> vs <code>LinkedList</code>：随机访问多用前者，频繁头插用后者（但后者缓存不友好，实际常被 ArrayDeque 替代）</li>
      <li><code>HashMap</code> vs <code>TreeMap</code>：需要有序或找前驱后继用 TreeMap（O(log n)）</li>
      <li><code>HashSet</code> 底层就是 HashMap 的 key 集合</li>
      <li>并发场景用 <code>ConcurrentHashMap</code>，不要用 <code>Collections.synchronizedMap</code></li>
    </ul>

    <div class="warn-box">⚠️ 只重写 equals 不重写 hashCode 会导致 HashMap 找不到刚放进去的元素——这是 Java 面试出现频率最高的坑之一。</div>
  `
      },
      {
        title: "JVM 内存模型与 GC 入门",
        sub: "堆栈划分 · 对象生命周期 · 垃圾回收器 · 调优思路",
        html: `
    <h3>16.1 运行时内存区域</h3>
    <ul>
      <li><b>堆（Heap）</b>：对象实例，所有线程共享，GC 的主战场</li>
      <li><b>虚拟机栈</b>：每个方法一个栈帧（局部变量表、操作数栈），线程私有</li>
      <li><b>方法区 / 元空间</b>：类元信息、常量，JDK 8 起用本地内存</li>
      <li><b>程序计数器</b>：当前字节码行号，唯一不会 OOM 的区域</li>
      <li><b>本地方法栈</b>：native 方法</li>
    </ul>

    <h3>16.2 堆的分代</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 新生代（Eden + 两个 Survivor）→ 老年代
// 新对象先进 Eden；Minor GC 后存活对象进 Survivor 并 age+1
// age 达到阈值（默认 15）或大对象直接晋升老年代

// 常见启动参数
// -Xms512m -Xmx512m      堆初始/最大（建议设成一样，避免动态扩缩）
// -Xmn256m               新生代大小
// -XX:+PrintGCDetails    打印 GC 日志（JDK 9+ 用 -Xlog:gc*）
// -XX:+HeapDumpOnOutOfMemoryError  OOM 时导出堆快照</code></pre>

    <h3>16.3 怎么判断对象可以回收</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 可达性分析：从 GC Roots 出发走不到的对象可回收
// GC Roots 包括：栈上局部变量引用的对象、静态变量、常量、JNI 引用

// 一个「循环引用」的例子：Java 不靠引用计数，所以能正确回收
class Node { Node next; }
Node a = new Node(); Node b = new Node();
a.next = b; b.next = a;
a = null; b = null;      // 此时两个对象都不可达，可以回收</code></pre>

    <h3>16.4 调优思路（顺序很重要）</h3>
    <ol>
      <li>先确认是不是内存问题：看 GC 日志频率与停顿时间</li>
      <li>频繁 Full GC 且老年代降不下来 → 内存泄漏，导堆快照找大对象</li>
      <li>Young GC 太频繁 → 新生代太小或对象创建速率太高</li>
      <li>单次停顿太长 → 换低延迟收集器（G1 / ZGC）</li>
      <li>最后才调参数，不要一上来就瞎调</li>
    </ol>

    <div class="warn-box">⚠️ 不要用 <code>System.gc()</code> 来「解决」内存问题。它只是建议 JVM 回收，实际是否执行由 JVM 决定，而且会引发不必要的 Full GC 停顿。</div>
  `
      },
      {
        title: "设计模式实战",
        sub: "单例 · 工厂 · 策略 · 观察者 · 什么时候不该用",
        html: `
    <h3>17.1 单例（线程安全版）</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 推荐：静态内部类（懒加载 + 线程安全，无需加锁）
public class Config {
    private Config() {}
    private static class Holder { static final Config INSTANCE = new Config(); }
    public static Config get() { return Holder.INSTANCE; }
}

// 枚举单例：最简洁，还能防反射与反序列化破坏
public enum Singleton {
    INSTANCE;
    public void doWork() { }
}</code></pre>

    <h3>17.2 策略模式（消灭 if-else 链）</h3>
    <span class="code-lang">Java</span>
    <pre><code>interface Discount { int apply(int price); }

class NoDiscount implements Discount { public int apply(int p) { return p; } }
class VipDiscount implements Discount { public int apply(int p) { return p * 8 / 10; } }

class Calculator {
    private final Map&lt;String, Discount&gt; table = Map.of(
        "none", new NoDiscount(),
        "vip",  new VipDiscount()
    );
    int total(String type, int price) {
        return table.getOrDefault(type, new NoDiscount()).apply(price);
    }
}
// 新增优惠类型只需加一个类 + 一行注册，不用改原有分支</code></pre>

    <h3>17.3 观察者</h3>
    <span class="code-lang">Java</span>
    <pre><code>interface Listener { void onEvent(String msg); }

class EventBus {
    private final List&lt;Listener&gt; listeners = new CopyOnWriteArrayList<>();
    void register(Listener l) { listeners.add(l); }
    void fire(String msg) { for (Listener l : listeners) l.onEvent(msg); }
}</code></pre>

    <h3>17.4 什么时候不该用模式</h3>
    <ul>
      <li>只有一种实现、且短期不会增加 → 直接写，不要为「未来可能」预留抽象</li>
      <li>模式带来的间接层让调用链变长、调试变难，收益要大于成本</li>
      <li>GoF 23 种模式里，日常用得最多的是策略、工厂、观察者、模板方法</li>
    </ul>

    <div class="warn-box">⚠️ 双检锁单例（DCL）必须给实例字段加 <code>volatile</code>，否则指令重排可能让别的线程拿到「半初始化」的对象。</div>
  `
      },
      {
        title: "测试与构建工具",
        sub: "JUnit 5 · 断言 · Mockito · Maven/Gradle",
        html: `
    <h3>18.1 JUnit 5 基本用法</h3>
    <span class="code-lang">Java</span>
    <pre><code>import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class SolutionTest {

    Solution s;

    @BeforeEach
    void setUp() { s = new Solution(); }        // 每个测试前都新建，避免相互影响

    @Test
    @DisplayName("两数之和：正常用例")
    void twoSumNormal() {
        assertArrayEquals(new int[]{0, 1}, s.twoSum(new int[]{2, 7, 11, 15}, 9));
    }

    @Test
    void twoSumNoAnswer() {
        assertEquals(-1, s.twoSumIndex(new int[]{1, 2}, 100));
    }

    @Test
    void emptyInput() {
        assertThrows(IllegalArgumentException.class, () -&gt; s.twoSum(new int[]{}, 0));
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 100})
    void sqrtIsFloor(int n) {
        assertTrue((int) Math.sqrt(n) &gt;= 0);
    }
}</code></pre>

    <h3>18.2 Mockito：隔离依赖</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 测 Service 时不要真的连数据库，用 mock 替代
Repository repo = mock(Repository.class);
when(repo.find(1)).thenReturn(new User("tom"));

Service service = new Service(repo);
assertEquals("tom", service.nameOf(1));

verify(repo, times(1)).find(1);        // 验证调用次数</code></pre>

    <h3>18.3 Maven 与 Gradle 对照</h3>
    <pre><code># Maven
mvn clean test
mvn package -DskipTests
mvn dependency:tree

# Gradle
./gradlew test
./gradlew build -x test
./gradlew dependencies</code></pre>

    <h3>18.4 测试金字塔</h3>
    <ul>
      <li><b>单元测试</b>（最多）：快、独立、覆盖逻辑分支</li>
      <li><b>集成测试</b>（适量）：验证模块间协作，比如数据库访问</li>
      <li><b>端到端测试</b>（少量）：验证完整链路，慢且脆弱</li>
    </ul>

    <div class="warn-box">⚠️ 测试之间必须互相独立：不要依赖执行顺序，不要在测试里共享可变状态（比如静态变量或同一个实例），否则会偶发失败且极难排查。</div>
  `
      },
      {
        title: "JDBC 与数据库访问",
        sub: "连接 · PreparedStatement · 事务 · 连接池",
        html: `
    <h3>19.1 标准流程</h3>
    <span class="code-lang">Java</span>
    <pre><code>String url = "jdbc:mysql://localhost:3306/demo?useSSL=false";

try (Connection conn = DriverManager.getConnection(url, "root", "pwd");
     PreparedStatement ps = conn.prepareStatement(
         "SELECT id, name FROM user WHERE age &gt; ? ORDER BY id")) {

    ps.setInt(1, 18);                    // 参数从 1 开始编号
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("id") + " " + rs.getString("name"));
        }
    }
}</code></pre>

    <h3>19.2 为什么必须用 PreparedStatement</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 错误示范：字符串拼接 -> SQL 注入
String sql = "SELECT * FROM user WHERE name = '" + input + "'";
// 输入 " ' OR '1'='1 " 就直接泄露全表

// 正确：预编译 + 参数绑定，参数永远被当作值而不是 SQL 片段
ps = conn.prepareStatement("SELECT * FROM user WHERE name = ?");
ps.setString(1, input);

// 批量插入也更快（一次网络往返）
ps = conn.prepareStatement("INSERT INTO t(a, b) VALUES(?, ?)");
for (Row r : rows) { ps.setInt(1, r.a); ps.setInt(2, r.b); ps.addBatch(); }
ps.executeBatch();</code></pre>

    <h3>19.3 事务</h3>
    <span class="code-lang">Java</span>
    <pre><code>conn.setAutoCommit(false);              // 关闭自动提交
try {
    updateA(conn);
    updateB(conn);
    conn.commit();
} catch (Exception e) {
    conn.rollback();                    // 任何一步失败整体回滚
    throw e;
} finally {
    conn.setAutoCommit(true);
}</code></pre>

    <h3>19.4 连接池</h3>
    <ul>
      <li>每次 <code>DriverManager.getConnection</code> 都建立真实 TCP 连接，开销很大（几十毫秒）</li>
      <li>生产必须用连接池：HikariCP（默认首选）、Druid</li>
      <li>池大小 ≈ 连接数上限，不是越大越好；通常 10~20 起步，按 QPS 与单次耗时估算</li>
      <li>用完必须归还（try-with-resources 的 close 对池化连接是「归还」而非真关）</li>
    </ul>

    <div class="warn-box">⚠️ 忘记关闭 ResultSet / Statement / Connection 会导致连接泄漏，池很快耗尽，表现为「获取连接超时」。务必用 try-with-resources。</div>
  `
      },
      {
        title: "常用工具类与最佳实践",
        sub: "Optional · Objects · Collections · Stream 陷阱",
        html: `
    <h3>20.1 Optional：显式表达「可能没有」</h3>
    <span class="code-lang">Java</span>
    <pre><code>Optional&lt;User&gt; u = repo.findById(1);

// 好的用法：提供默认值或直接消费
String name = u.map(User::getName).orElse("匿名");
u.ifPresent(x -&gt; System.out.println(x));

// 坏味道：把 Optional 当 null 用
if (u.isPresent()) { ... u.get() ... }        // 和 if (x != null) 没区别
// 更糟：Optional 作为字段或方法参数，应该只用作返回值</code></pre>

    <h3>20.2 Objects 与比较</h3>
    <span class="code-lang">Java</span>
    <pre><code>Objects.requireNonNull(arg, "arg 不能为 null");   // 快速失败
Objects.equals(a, b);                              // 避免 NPE
Objects.hash(x, y);                                // 生成 hashCode

// 排序：先按分数降序，再按名字升序
list.sort(Comparator.comparingInt(Student::getScore).reversed()
                    .thenComparing(Student::getName));</code></pre>

    <h3>20.3 Collections 工具</h3>
    <span class="code-lang">Java</span>
    <pre><code>Collections.sort(list);
Collections.reverse(list);
Collections.max(list); Collections.min(list);
Collections.unmodifiableList(list);        // 只读视图

// 空集合常量，比返回 null 更好
List&lt;String&gt; empty = Collections.emptyList();
Map&lt;String, Integer&gt; none = Map.of();</code></pre>

    <h3>20.4 Stream 的三个常见错误</h3>
    <span class="code-lang">Java</span>
    <pre><code>// 1. 流只能消费一次
Stream&lt;Integer&gt; s = list.stream();
s.count();
s.forEach(System.out::println);      // IllegalStateException

// 2. 不要在 forEach 里修改外部集合（并发修改或结果不可控）
// 3. 有副作用的 map 会让人误解语义，过滤统计用 filter/count/collect

// 正确：并行流只在数据量大且无状态时才用
long cnt = list.parallelStream().filter(x -&gt; x &gt; 100).count();</code></pre>

    <div class="warn-box">⚠️ <code>Collectors.toMap</code> 遇到重复 key 会直接抛 IllegalStateException。有重复可能时传第三个参数：<code>toMap(k, v, (a, b) -&gt; b)</code>。</div>
  `
      }
    ],

    // ==================== C ====================
    c: [
      {
        title: "位运算与内存布局",
        sub: "补码 · 移位陷阱 · 位域 · 大小端",
        html: `
    <h3>13.1 补码与移位</h3>
    <span class="code-lang">C</span>
    <pre><code>// 负数用补码存储：-1 的 32 位是 0xFFFFFFFF
int a = -1;
printf("%u\\n", (unsigned)a);      // 4294967295

// 有符号右移是实现定义（多数编译器算术右移，高位补符号位）
// 无符号右移一定补 0，做位操作时统一用 unsigned
unsigned x = 0xF0000000u;
x &gt;&gt; 4;                            // 0x0F000000

// 移位量必须小于位宽，否则是未定义行为
// x &lt;&lt; 32  对 int 是 UB，别写

// 取某一位、置位、清位
#define GET_BIT(v, i)  (((v) &gt;&gt; (i)) &amp; 1u)
#define SET_BIT(v, i)  ((v) |=  (1u &lt;&lt; (i)))
#define CLR_BIT(v, i)  ((v) &amp;= ~(1u &lt;&lt; (i)))</code></pre>

    <h3>13.2 结构体内存对齐</h3>
    <span class="code-lang">C</span>
    <pre><code>struct A { char c; int i; };        // 8 字节（3 字节填充）
struct B { int i; char c; };        // 8 字节（尾部填充）
struct C { char a; char b; int i; };// 8 字节
struct D { char a; int i; char b; };// 12 字节

// 结论：把大的成员放前面能减少填充
// 用 #pragma pack(1) 可以取消对齐，但会降低访问速度（某些架构上直接崩溃）

#include &lt;stddef.h&gt;
offsetof(struct A, i);              // 成员偏移量</code></pre>

    <h3>13.3 大小端</h3>
    <span class="code-lang">C</span>
    <pre><code>int x = 1;
if (*(char*)&amp;x == 1) printf("小端\\n");   // 常见于 x86/ARM
else printf("大端\\n");                     // 网络字节序是大端

// 网络传输要显式转换
#include &lt;arpa/inet.h&gt;
uint32_t n = htonl(x);                     // 主机序 -> 网络序
x = ntohl(n);</code></pre>

    <div class="warn-box">⚠️ 位运算一律用 <code>unsigned</code> 类型。对有符号数做移位、溢出、位反转都属于未定义行为或实现定义行为，换编译器结果就变。</div>
  `
      },
      {
        title: "函数指针与回调",
        sub: "声明语法 · qsort 回调 · 函数表 · 状态机",
        html: `
    <h3>14.1 声明与调用</h3>
    <span class="code-lang">C</span>
    <pre><code>int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

// 声明一个「接收两个 int、返回 int」的函数指针
int (*op)(int, int) = add;
printf("%d\\n", op(3, 4));        // 7，调用时不用 (*op)

// 常用 typedef 简化
typedef int (*BinOp)(int, int);
BinOp f = sub;
printf("%d\\n", f(3, 4));         // -1</code></pre>

    <h3>14.2 qsort 回调</h3>
    <span class="code-lang">C</span>
    <pre><code>// 回调必须严格匹配 int(const void*, const void*)
int cmpAsc(const void* a, const void* b) {
    int x = *(const int*)a, y = *(const int*)b;
    return (x &gt; y) - (x &lt; y);       // 避免相减溢出，返回 -1/0/1
}

int arr[] = {5, 2, 8, 1};
qsort(arr, 4, sizeof(int), cmpAsc);

// 结构体按多关键字排序
typedef struct { int score; char name[32]; } Stu;
int cmpStu(const void* a, const void* b) {
    const Stu* p = a; const Stu* q = b;
    if (p-&gt;score != q-&gt;score) return q-&gt;score - p-&gt;score;   // 分数降序
    return strcmp(p-&gt;name, q-&gt;name);                        // 名字升序
}</code></pre>

    <h3>14.3 函数表（代替长 if-else）</h3>
    <span class="code-lang">C</span>
    <pre><code>// 用函数指针数组实现简易状态机 / 命令分发
static void on_start(void) { puts("start"); }
static void on_stop(void)  { puts("stop"); }

void (*handlers[])(void) = { on_start, on_stop };

void dispatch(int cmd) {
    if (cmd &gt;= 0 &amp;&amp; cmd &lt; (int)(sizeof(handlers) / sizeof(handlers[0])))
        handlers[cmd]();
}</code></pre>

    <div class="warn-box">⚠️ 函数指针的括号不能省：<code>int *f(int)</code> 是「返回 int 指针的函数」，<code>int (*f)(int)</code> 才是函数指针。这个优先级坑几乎人人踩过一次。</div>
  `
      },
      {
        title: "宏与预处理进阶",
        sub: "带参宏陷阱 · do-while(0) · 条件编译 · 头文件保护",
        html: `
    <h3>15.1 带参宏的三个经典坑</h3>
    <span class="code-lang">C</span>
    <pre><code>// 坑 1：参数不加括号
#define SQUARE(x) x * x
SQUARE(1 + 2)      // 展开成 1 + 2 * 1 + 2 = 5，不是 9
#define SQUARE(x) ((x) * (x))      // 正确

// 坑 2：宏体不加外层括号
#define DOUBLE(x) (x) + (x)
2 * DOUBLE(3)      // 展开成 2 * (3) + (3) = 9，不是 12

// 坑 3：多重语句宏不加保护
#define SWAP(a, b) { int t = a; a = b; b = t; }
if (cond) SWAP(x, y); else ...     // 编译不过（宏展开后多了分号）

// 正确写法
#define SWAP(a, b) do { typeof(a) t = (a); (a) = (b); (b) = t; } while (0)</code></pre>

    <h3>15.2 条件编译</h3>
    <span class="code-lang">C</span>
    <pre><code>#ifdef DEBUG
#  define LOG(fmt, ...) fprintf(stderr, "[%s:%d] " fmt "\\n", __FILE__, __LINE__, ##__VA_ARGS__)
#else
#  define LOG(fmt, ...) ((void)0)      // 发布版彻底消失，零开销
#endif

// 平台分支
#if defined(_WIN32)
#  include &lt;windows.h&gt;
#elif defined(__linux__)
#  include &lt;unistd.h&gt;
#endif

// 常用预定义宏
__FILE__  __LINE__  __func__  __DATE__  __STDC_VERSION__</code></pre>

    <h3>15.3 头文件保护</h3>
    <span class="code-lang">C</span>
    <pre><code>// 写法一：传统宏保护（兼容性最好）
#ifndef SOLUTION_H
#define SOLUTION_H
/* 声明 */
#endif

// 写法二：pragma once（简洁，主流编译器都支持）
#pragma once

// 头文件里只放：函数声明、宏、类型定义、extern 变量声明
// 不要放函数定义（会导致重复定义），除非加 static inline</code></pre>

    <div class="warn-box">⚠️ 能用 <code>static inline</code> 函数就别用带参宏：函数有类型检查、能调试、不会重复求值副作用。<code>#define MAX(a,b) ((a)&gt;(b)?(a):(b))</code> 在 <code>MAX(i++, j++)</code> 时会让 i 自增两次。</div>
  `
      },
      {
        title: "文件 IO 与缓冲",
        sub: "fopen 模式 · 逐行读 · 二进制读写 · fflush",
        html: `
    <h3>16.1 打开与关闭</h3>
    <span class="code-lang">C</span>
    <pre><code>// 模式：r 读  w 写（清空）  a 追加  + 读写  b 二进制
FILE* fp = fopen("in.txt", "r");
if (!fp) { perror("fopen"); return 1; }     // 一定要判空
...
fclose(fp);                                  // 必须关闭，否则数据可能没落盘</code></pre>

    <h3>16.2 逐行读文本</h3>
    <span class="code-lang">C</span>
    <pre><code>char line[1024];
while (fgets(line, sizeof(line), fp)) {
    size_t n = strlen(line);
    if (n &amp;&amp; line[n - 1] == '\\n') line[n - 1] = 0;   // 去掉换行
    printf("读到: %s\\n", line);
}

// 按格式解析
int a, b;
while (fscanf(fp, "%d %d", &amp;a, &amp;b) == 2) {
    printf("%d\\n", a + b);
}</code></pre>

    <h3>16.3 二进制读写</h3>
    <span class="code-lang">C</span>
    <pre><code>typedef struct { int id; double score; } Record;

// 写
FILE* out = fopen("data.bin", "wb");
fwrite(&amp;rec, sizeof(Record), 1, out);
fclose(out);

// 读
FILE* in = fopen("data.bin", "rb");
size_t got = fread(&amp;rec, sizeof(Record), 1, in);
if (got != 1) { /* 文件不完整或格式不对 */ }
fclose(in);

// 二进制方式不适合跨平台/跨语言交换：结构体对齐与字节序都可能不同</code></pre>

    <h3>16.4 缓冲与刷新</h3>
    <span class="code-lang">C</span>
    <pre><code>// 标准输出是全缓冲（重定向到文件时）或行缓冲（终端）
// 程序崩溃时缓冲区内容会丢失，调试打印要主动刷新
printf("debug: x = %d\\n", x);
fflush(stdout);

// 设置缓冲策略
setvbuf(stdout, NULL, _IONBF, 0);   // 无缓冲，调试时最可靠
setvbuf(fp, buf, _IOFBF, 8192);     // 全缓冲 + 自定义大小</code></pre>

    <div class="warn-box">⚠️ <code>fgets</code> 遇到超长行会截断，剩下的部分留到下次读。处理超长行要么用 <code>getline</code>（POSIX），要么自己循环拼接。</div>
  `
      },
      {
        title: "手写常用算法",
        sub: "快排 · 归并 · 二分 · 字符串函数实现",
        html: `
    <h3>17.1 快速排序</h3>
    <span class="code-lang">C</span>
    <pre><code>void swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }

int partition(int* a, int l, int r) {
    int pivot = a[r];                 // 取最右为基准
    int i = l - 1;
    for (int j = l; j &lt; r; j++)
        if (a[j] &lt;= pivot) swap(&amp;a[++i], &amp;a[j]);
    swap(&amp;a[i + 1], &amp;a[r]);
    return i + 1;
}

void quickSort(int* a, int l, int r) {
    if (l &gt;= r) return;
    int p = partition(a, l, r);
    quickSort(a, l, p - 1);
    quickSort(a, p + 1, r);
}
// 平均 O(n log n)；已排序数组 + 固定取最右会导致 O(n^2)
// 改进：随机选基准，或小区间（&lt;16）改用插入排序</code></pre>

    <h3>17.2 归并排序</h3>
    <span class="code-lang">C</span>
    <pre><code>void merge(int* a, int l, int m, int r, int* tmp) {
    int i = l, j = m + 1, k = l;
    while (i &lt;= m &amp;&amp; j &lt;= r) tmp[k++] = (a[i] &lt;= a[j]) ? a[i++] : a[j++];
    while (i &lt;= m) tmp[k++] = a[i++];
    while (j &lt;= r) tmp[k++] = a[j++];
    for (i = l; i &lt;= r; i++) a[i] = tmp[i];
}

void mergeSort(int* a, int l, int r, int* tmp) {
    if (l &gt;= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m, tmp);
    mergeSort(a, m + 1, r, tmp);
    merge(a, l, m, r, tmp);
}
// 稳定排序，O(n log n) 稳定；代价是 O(n) 额外空间</code></pre>

    <h3>17.3 二分查找的两个边界</h3>
    <span class="code-lang">C</span>
    <pre><code>// 第一个 &gt;= x 的位置
int lowerBound(const int* a, int n, int x) {
    int l = 0, r = n;
    while (l &lt; r) { int m = l + (r - l) / 2; if (a[m] &lt; x) l = m + 1; else r = m; }
    return l;
}
// 第一个 &gt; x 的位置
int upperBound(const int* a, int n, int x) {
    int l = 0, r = n;
    while (l &lt; r) { int m = l + (r - l) / 2; if (a[m] &lt;= x) l = m + 1; else r = m; }
    return l;
}</code></pre>

    <div class="warn-box">⚠️ 手写排序时下标全是闭区间 [l, r]，写 <code>r = n - 1</code> 而不是 <code>n</code>，否则会越界读到 a[n]。二分则统一用左闭右开 [l, r)，两套模板别混。</div>
  `
      },
      {
        title: "内存调试与问题定位",
        sub: "段错误 · 越界 · 泄漏 · gdb · valgrind / ASan",
        html: `
    <h3>18.1 段错误的常见原因</h3>
    <span class="code-lang">C</span>
    <pre><code>int* p = NULL;
*p = 1;                    // 空指针解引用 -> 段错误

int a[10];
a[10] = 0;                 // 越界（不一定立刻崩，可能悄悄破坏别的变量）

char s[5];
strcpy(s, "hello");        // 缓冲区溢出（需要 6 字节）

int* q = malloc(10 * sizeof(int));
q[10] = 1;                 // 堆越界
free(q);
free(q);                   // 重复释放 -> 崩溃</code></pre>

    <h3>18.2 gdb 最常用的六条命令</h3>
    <pre><code>gcc -g -O0 main.c -o main      # 必须带 -g 才有调试信息
gdb ./main

(gdb) run                       # 运行，崩溃后停在出错行
(gdb) bt                        # 看调用栈
(gdb) frame 2                   # 切到第 2 帧
(gdb) print p                   # 看变量
(gdb) print *p@10               # 看 p 指向的 10 个元素
(gdb) break main.c:42           # 在指定行下断点</code></pre>

    <h3>18.3 内存检查工具</h3>
    <pre><code># AddressSanitizer：编译期插桩，定位越界/释放后使用/泄漏，最方便
gcc -fsanitize=address -g main.c -o main
./main

# valgrind：不需要重编译，但慢 20 倍以上
valgrind --leak-check=full --show-leak-kinds=all ./main</code></pre>

    <h3>18.4 三条防御习惯</h3>
    <ul>
      <li>malloc 之后立刻判 NULL；free 之后把指针置 NULL，防止重复释放</li>
      <li>数组长度用 <code>sizeof(a) / sizeof(a[0])</code> 计算，别写魔法数字</li>
      <li>字符串操作优先用带长度限制的版本：<code>snprintf</code> / <code>strncpy</code> + 手动补 <code>\\0</code></li>
    </ul>

    <div class="warn-box">⚠️ 越界写不一定当场崩溃，它可能破坏相邻变量或堆管理结构，等到很远的地方才炸。所以「跑起来没问题」绝不能作为没有越界的证据，一定要用 ASan 跑一遍。</div>
  `
      },
      {
        title: "Makefile 与多文件工程",
        sub: "编译链接过程 · Makefile 规则 · 静态/动态库",
        html: `
    <h3>19.1 四个阶段</h3>
    <pre><code># 预处理 -> 编译 -> 汇编 -> 链接
gcc -E main.c -o main.i         # 展开宏与 include
gcc -S main.i -o main.s         # 生成汇编
gcc -c main.c -o main.o         # 生成目标文件
gcc main.o util.o -o app        # 链接成可执行文件
# undefined reference 属于链接错误，说明只声明没定义</code></pre>

    <h3>19.2 一个够用的 Makefile</h3>
    <pre><code>CC      = gcc
CFLAGS  = -std=c11 -Wall -Wextra -O2 -g
TARGET  = app
SRCS    = $(wildcard src/*.c)
OBJS    = $(SRCS:.c=.o)
DEPS    = $(OBJS:.o=.d)

$(TARGET): $(OBJS)
	$(CC) $^ -o $@

%.o: %.c
	$(CC) $(CFLAGS) -MMD -MP -c $&lt; -o $@

-include $(DEPS)          # 自动追踪头文件依赖

clean:
	rm -f $(OBJS) $(DEPS) $(TARGET)

.PHONY: clean

# 注意：命令前必须是 TAB，不是空格</code></pre>

    <h3>19.3 静态库与动态库</h3>
    <pre><code># 静态库：链接进可执行文件，体积大但部署简单
gcc -c util.c -o util.o
ar rcs libutil.a util.o
gcc main.c -L. -lutil -o app

# 动态库：运行时加载，多程序共享
gcc -shared -fPIC util.c -o libutil.so
gcc main.c -L. -lutil -o app
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH   # 让程序找到 .so</code></pre>

    <div class="warn-box">⚠️ Makefile 里命令行的缩进必须是真正的 Tab 字符。<code>-MMD -MP</code> 生成依赖文件，让「改了头文件却没重编」这种诡异问题不再出现。</div>
  `
      },
      {
        title: "系统编程入门",
        sub: "系统调用 · 文件描述符 · 进程与管道 · 信号",
        html: `
    <h3>20.1 文件描述符与系统调用</h3>
    <span class="code-lang">C</span>
    <pre><code>#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int fd = open("in.txt", O_RDONLY);
if (fd &lt; 0) { perror("open"); return 1; }

char buf[4096];
ssize_t n;
while ((n = read(fd, buf, sizeof(buf))) &gt; 0) {
    write(STDOUT_FILENO, buf, n);
}
close(fd);

// 0 / 1 / 2 分别是 stdin / stdout / stderr
// FILE* 是对 fd 的封装，fileno(fp) 可取回底层 fd</code></pre>

    <h3>20.2 进程与管道</h3>
    <span class="code-lang">C</span>
    <pre><code>#include &lt;sys/wait.h&gt;

int pipefd[2];
pipe(pipefd);                    // pipefd[0] 读端，pipefd[1] 写端

pid_t pid = fork();
if (pid == 0) {                  // 子进程
    close(pipefd[0]);
    const char* msg = "hello from child";
    write(pipefd[1], msg, strlen(msg));
    close(pipefd[1]);
    _exit(0);
} else {                         // 父进程
    close(pipefd[1]);
    char buf[128] = {0};
    read(pipefd[0], buf, sizeof(buf) - 1);
    printf("父进程收到: %s\\n", buf);
    close(pipefd[0]);
    waitpid(pid, NULL, 0);
}</code></pre>

    <h3>20.3 信号</h3>
    <span class="code-lang">C</span>
    <pre><code>#include &lt;signal.h&gt;

volatile sig_atomic_t stop = 0;   // 信号处理里只能用 sig_atomic_t

void on_sigint(int sig) { (void)sig; stop = 1; }

int main(void) {
    signal(SIGINT, on_sigint);
    while (!stop) { /* 主循环 */ }
    printf("收到 Ctrl+C，退出\\n");
    return 0;
}
// 更推荐 sigaction：语义清晰、可控制是否自动重启被中断的系统调用</code></pre>

    <div class="warn-box">⚠️ 信号处理函数里不能调用 printf / malloc 这类非异步信号安全的函数，会导致死锁。正确做法只设置一个 <code>volatile sig_atomic_t</code> 标志，回到主循环再处理。</div>
  `
      }
    ]
  };

  Object.keys(EXTRA).forEach(function (lang) {
    if (COURSES[lang] && Array.isArray(COURSES[lang].lessons)) {
      Array.prototype.push.apply(COURSES[lang].lessons, EXTRA[lang]);
    }
  });
})();
