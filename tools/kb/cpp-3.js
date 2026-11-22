// C++ 第 11-15 章 · 每章 4 节微课
module.exports = [
  {
    t: "C++11~17 现代特性速览",
    sub: "auto · 范围 for · 移动语义 · 结构化绑定 · optional",
    mins: 50,
    kw: "模拟",
    goals: [
      "用现代语法把老代码写短一半",
      "理解移动语义解决了什么问题",
      "会用结构化绑定、init-statement、optional 提升可读性",
      "知道哪些新特性在竞赛环境可用",
    ],
    map: [
      ["特性", "标准", "解决的问题"],
      ["auto / 范围 for", "C++11", "写类型、写迭代器太啰嗦"],
      ["移动语义 / 右值引用", "C++11", "大对象返回时的深拷贝"],
      ["结构化绑定", "C++17", "pair/tuple 取值要写 first/second"],
      ["if 初始化语句", "C++17", "变量作用域外泄"],
    ],
    mic: [
      {
        t: "auto 与范围 for：删掉冗余代码",
        lead: "现代 C++ 的第一原则是「让编译器写它已经知道的东西」。",
        body: [
          "`for (auto &x : v)` 替代 `for (int i = 0; i < v.size(); i++)`，不仅短，还避免了 `v.size()` 无符号比较的坑。",
          "配合 `auto`，遍历 map 时不用再写 `map<string,int>::iterator`，可读性提升非常明显。",
        ],
        code: `vector<pair<string,int>> v = {{"a",1},{"b",2}};

for (auto &p : v) p.second++;         // 改值
for (const auto &p : v) cout << p.first;  // 只读

map<string,int> cnt;
for (auto &[k, c] : cnt) cout << k << ":" << c << "\\n";  // C++17 结构化绑定`,
        lang: "C++",
        pts: [
          "要改元素用 `auto &`，只读用 `const auto &`，纯拷贝才用 `auto`",
          "范围 for 底层就是 begin/end，容器在遍历中被修改会 UB",
          "结构化绑定同样支持 `auto &[a, b] = pair`",
        ],
        pit: "`for (auto x : v)` 里对 x 赋值不会改到容器——这是初学者最常见的「改了没生效」。",
      },
      {
        t: "移动语义：不再深拷贝",
        lead: "把资源「搬走」而不是「复制一份」，是大对象性能的关键优化。",
        body: [
          "函数返回 vector 时，老标准会深拷贝一次。移动语义让新对象直接接管旧对象的内存指针，然后把旧对象的指针置空——O(1) 完成。",
          "右值引用 `T&&` 标记「这个对象马上就不用了」，`std::move` 只是把它转成右值引用，本身不搬任何东西。",
        ],
        code: `vector<int> makeVec() {
    vector<int> v(1000000, 7);
    return v;                 // NRVO / 移动，不拷贝
}

vector<int> a = makeVec();
vector<int> b = std::move(a);  // 接管 a 的内存，a 变空
cout << a.size() << "\\n";     // 0（标准只保证有效，通常为空）

class Buf {
    vector<int> d;
public:
    Buf(Buf &&o) noexcept : d(std::move(o.d)) {}   // 移动构造
};`,
        lang: "C++",
        pts: [
          "`std::move` 之后的对象仍可析构、可重新赋值，但值不确定",
          "标注 `noexcept` 的移动构造才会被 vector 扩容时优先采用",
          "对 `const` 对象用 move 会退化成拷贝",
        ],
        pit: "`std::move` 一个局部变量后继续读它，可能拿到空值——move 是「我保证不再用它」的契约。",
      },
      {
        t: "初始化列表、optional 与 if 初始化",
        lead: "C++17 的几个小语法，能显著减少「先声明、后赋值、再判空」的啰嗦三段式。",
        body: [
          "`if (auto it = m.find(k); it != m.end())` 把变量限制在 if 作用域内，避免污染外层。",
          "`std::optional<T>` 表示「可能没有值」，比用 -1 或空指针表达「无」更类型安全。",
        ],
        code: `map<string,int> m = {{"a", 1}};
if (auto it = m.find("a"); it != m.end())
    cout << it->second << "\\n";

optional<int> parse(string s) {
    try { return stoi(s); } catch (...) { return nullopt; }
}
if (auto v = parse("42"); v) cout << *v << "\\n";

// 类内成员默认初始化 + 聚合初始化
struct P { int x = 0, y = 0; };
P p{1, 2};`,
        lang: "C++",
        pts: [
          "`optional` 用 `has_value()` 或 `if (v)` 判断，`*v` 取值",
          "`optional` 有额外一个 bool 的开销，热循环里别用",
          "结构化绑定 + if 初始化是读代码最舒服的组合",
        ],
        pit: "对空的 optional 直接 `*v` 是 UB，跟空指针解引用一样危险。",
      },
      {
        t: "竞赛环境可用性清单",
        lead: "不是所有新特性都能用：判题机的编译器版本决定了你能写什么。",
        body: [
          "洛谷 / Codeforces 通常支持 C++17 甚至 C++20；部分老 OJ 只到 C++11 或 C++14。用之前先看题目页的编译器选项。",
          "`bits/stdc++.h` 只在 GCC 有，MSVC 没有；`__int128` 也只在 GCC/Clang 可用。",
        ],
        code: `// GCC 专属：128 位整数，范围约 1.7e38
__int128 mul(__int128 a, __int128 b) { return a * b; }
void print128(__int128 x) {
    if (x == 0) { cout << 0; return; }
    string s;
    while (x) { s += char('0' + x % 10); x /= 10; }
    reverse(s.begin(), s.end());
    cout << s;
}

// 常用内置位运算
cout << __builtin_popcount(7) << "\\n";      // 3
cout << __builtin_ctz(8) << "\\n";           // 3（末尾 0 的个数）
cout << __builtin_clz(8) << "\\n";           // 前导 0 的个数`,
        lang: "C++",
        pts: [
          "`__int128` 不能直接 cin/cout，需要手写读写",
          "`__builtin_popcountll` 用于 long long",
          "C++17 的 `std::gcd` / `std::lcm` 在 `<numeric>` 里",
        ],
        pit: "开了 `-std=c++11` 却写结构化绑定，报错信息会指向奇怪的位置。先确认标准版本。",
      },
    ],
    qa: [
      ["移动语义和拷贝的区别一句话？", "拷贝是「再买一套一样的家具」，移动是「把家具搬到新房子，旧房子清空」。"],
      ["为什么 return 局部 vector 不需要 move？", "编译器会做返回值优化（NRVO），直接在调用方的空间里构造，连移动都省了。"],
    ],
    sum: "auto 省类型、move 省拷贝、optional 表达「可能没有」、if 初始化省作用域。",
  },

  {
    t: "输入输出与竞赛模板",
    sub: "cin/cout 提速 · scanf/printf · 快读快写 · 文件 IO",
    mins: 45,
    kw: "输入输出",
    goals: [
      "知道 cin/cout 什么时候会成为瓶颈",
      "会用 getline 处理含空格的整行输入",
      "手写快读快写应对 1e6 级别的数据量",
      "能正确做文件重定向与多组数据处理",
    ],
    map: [
      ["方式", "速度", "使用场景"],
      ["cin/cout 加速", "中", "绝大多数题目"],
      ["scanf/printf", "较快", "格式化输出、老题"],
      ["fread 快读", "最快", "1e6 以上整数输入"],
      ["getline", "中", "整行、含空格字符串"],
    ],
    mic: [
      {
        t: "cin/cout 为什么会慢",
        lead: "默认情况下 cin 和 C 的 stdin 保持同步，每次读写都要互相刷新——关掉它就快了。",
        body: [
          "`ios::sync_with_stdio(false)` 解除 C/C++ 流同步，`cin.tie(nullptr)` 解除 cin 与 cout 的绑定。两行代码通常带来 3~5 倍提速。",
          "关闭同步后**不要混用** `cin` 和 `scanf`，两者缓冲区独立，读入顺序会乱。",
        ],
        code: `int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n; cin >> n;
    for (int i = 0; i < n; i++) { int x; cin >> x; }
    cout << n << "\\n";
}`,
        lang: "C++",
        pts: [
          "用 `'\\n'` 代替 `endl`，`endl` 每次都 flush",
          "关闭同步后仍然可以用 `printf`，但别和 cin 交替读同一份输入",
          "`cout << fixed << setprecision(6)` 控制小数位数",
        ],
        pit: "`endl` 在 1e6 行输出时会慢 3 倍以上，这是最常见的 TLE 原因之一。",
      },
      {
        t: "整行读取与格式解析",
        lead: "含空格的字符串必须用 getline，但 getline 和 >> 混用有个换行残留陷阱。",
        body: [
          "`cin >> s` 遇空格即停；`getline(cin, s)` 读到换行为止。混用时，前一个 `>>` 留下的换行会让 getline 立刻返回空串。",
          "解决方法是 `cin.ignore(numeric_limits<streamsize>::max(), '\\n')` 或 `getchar()` 吃掉那一行。",
        ],
        code: `int n; 
cin >> n;
cin.ignore();                 // 吃掉 n 后面的换行
for (int i = 0; i < n; i++) {
    string line;
    getline(cin, line);
    cout << line.size() << "\\n";
}

// 按分隔符切分
string s = "a,b,c";
stringstream ss(s);
string tok;
while (getline(ss, tok, ',')) cout << tok << "\\n";`,
        lang: "C++",
        pts: [
          "`getline` 不会跳过前导空白，行首空格会被保留",
          "`stringstream` 适合行内二次切分，但比手写 parse 慢",
          "空行也会被 getline 读到（长度为 0），注意判空",
        ],
        pit: "Windows 的 `\\r\\n` 会让 getline 读到的串末尾多一个 `\\r`，比较字符串前先去掉它。",
      },
      {
        t: "手写快读快写",
        lead: "当输入有 1e6 个整数时，fread 一次读一大块比 cin 快 10 倍。",
        body: [
          "快读的原理：用 `fread` 把整块输入读进缓冲区，然后自己逐字符解析数字，绕开流的所有开销。",
          "快写同理，把数字转成字符塞进缓冲区，最后一次性输出。",
        ],
        code: `static char buf[1 << 20], *p1 = buf, *p2 = buf;
#define gc() (p1 == p2 && (p2 = (p1 = buf) + fread(buf, 1, 1 << 20, stdin), p1 == p2) ? EOF : *p1++)

inline int read() {
    int x = 0, f = 1; char c = gc();
    while (c < '0' || c > '9') { if (c == '-') f = -1; c = gc(); }
    while (c >= '0' && c <= '9') { x = x * 10 + (c - '0'); c = gc(); }
    return x * f;
}

inline void write(long long x) {
    char s[24]; int n = 0;
    if (x == 0) { putchar('0'); return; }
    while (x) { s[n++] = char('0' + x % 10); x /= 10; }
    while (n) putchar(s[--n]);
}`,
        lang: "C++",
        pts: [
          "加了快读就**别再用 cin**，两套缓冲区会冲突",
          "`1 << 20` 是 1MB 缓冲，通常够用",
          "需要读负数时用上面的 f 符号位处理",
        ],
        pit: "快读里的 `gc()` 宏没有括号保护，写成 `gc() + 1` 会展开错误。宏参数一律加括号。",
      },
      {
        t: "多组数据与文件重定向",
        lead: "多组数据的三种结束方式（EOF / 计数 / 哨兵）必须分清，否则就是死循环或漏读。",
        body: [
          "EOF 结束：`while (cin >> n)`；计数结束：先读 T 再循环 T 次；哨兵结束：读到 `0` 或 `-1` 时 break。",
          "本地用 freopen 读文件调试很方便，但**提交前务必删除**，或用 `#ifdef LOCAL` 包住。",
        ],
        code: `int T; cin >> T;              // 计数
while (T--) { solve(); }

int n;
while (cin >> n && n) {       // 哨兵：0 结束
    solve(n);
}

while (cin >> n) {            // EOF 结束
    solve(n);
}

#ifdef LOCAL
freopen("in.txt", "r", stdin);
#endif`,
        lang: "C++",
        pts: [
          "多组数据时，全局数组/容器必须在每组开始前清空",
          "`while (T--)` 在 T 为 0 时会执行一次 `T--` 把 T 变成 -1，循环体不执行，安全",
          "`freopen` 之后无法恢复 stdin，调试完记得注释",
        ],
        pit: "多组数据忘清全局变量是经典 WA：本机能过样例，一交就挂。养成在 solve() 开头清空的习惯。",
      },
    ],
    qa: [
      ["cin 和 scanf 能混用吗？", "默认可以（有同步），但关掉 sync_with_stdio 后不行，缓冲区不同步会导致读入错乱。"],
      ["为什么我的输出用 endl 会 TLE？", "endl 每次都强制 flush，1e6 行输出等于 1e6 次系统调用级别的刷新。"],
    ],
    sum: "两行加速解决九成 TLE，1e6 以上整数输入上手写快读，多组数据先清全局。",
  },

  {
    t: "迭代器与算法库进阶",
    sub: "algorithm 全家桶 · lower_bound · 去重 · 排列与分割",
    mins: 50,
    kw: "二分",
    goals: [
      "用 algorithm 库替代手写循环",
      "掌握排序 + 去重 + 二分的标准三连",
      "会用 next_permutation 枚举排列",
      "知道哪些函数要求区间有序",
    ],
    map: [
      ["函数", "作用", "前提"],
      ["sort", "排序", "比较器满足严格弱序"],
      ["unique", "去重相邻重复", "必须**先排序**"],
      ["lower_bound", "第一个 ≥ x", "区间有序"],
      ["next_permutation", "下一个排列", "当前区间有序（升序起）"],
    ],
    mic: [
      {
        t: "排序、去重、统计三件套",
        lead: "「sort + unique + erase」是处理重复元素的标准动作，缺一不可。",
        body: [
          "`unique` 只把**相邻**的重复元素移到后面，返回新末尾迭代器。所以必须先排序，再用 erase 真正删掉尾部垃圾。",
          "统计类函数 `count`、`count_if`、`accumulate`、`max_element` 能省掉手写循环，但注意 `accumulate` 的初始值类型决定返回类型——用 `0` 会溢出。",
        ],
        code: `vector<int> v = {3, 1, 3, 2, 1};
sort(v.begin(), v.end());                       // 1 1 2 3 3
v.erase(unique(v.begin(), v.end()), v.end());   // 1 2 3

long long sum = accumulate(v.begin(), v.end(), 0LL);   // 0LL！
int mx = *max_element(v.begin(), v.end());
int even = count_if(v.begin(), v.end(), [](int x){ return x % 2 == 0; });
int c3 = count(v.begin(), v.end(), 3);

reverse(v.begin(), v.end());
rotate(v.begin(), v.begin() + 1, v.end());      // 左旋一位`,
        lang: "C++",
        pts: [
          "`accumulate` 用 `0LL` 起步，用 `0` 时中间结果仍是 int 会溢出",
          "`minmax_element` 一次遍历同时拿最小最大",
          "`nth_element` 可以 O(n) 求第 k 小",
        ],
        pit: "对未排序的 vector 调 `unique` 不会报错，但结果毫无意义——它只处理相邻重复。",
      },
      {
        t: "二分三兄弟：lower_bound / upper_bound / binary_search",
        lead: "二分不是「猜答案」，而是「在有序数组里定位边界」——写对的前提是区间有序。",
        body: [
          "`lower_bound(b, e, x)` 返回第一个 `>= x` 的位置；`upper_bound` 返回第一个 `> x` 的位置。两者相减就是 x 的出现次数。",
          "都不存在时返回 `end()`。判存在用 `binary_search`（返回 bool），要位置用 lower/upper。",
        ],
        code: `vector<int> a = {1, 3, 3, 3, 5, 8};

auto lo = lower_bound(a.begin(), a.end(), 3);   // 下标 1
auto hi = upper_bound(a.begin(), a.end(), 3);   // 下标 4
cout << hi - lo << "\\n";                        // 3 个

int idx = lower_bound(a.begin(), a.end(), 4) - a.begin();  // 5
bool has = binary_search(a.begin(), a.end(), 8);           // true

// 找最后一个 <= x
auto it = upper_bound(a.begin(), a.end(), 4);
if (it != a.begin()) cout << *prev(it);          // 3`,
        lang: "C++",
        pts: [
          "返回值是迭代器，减 `begin()` 才得到下标",
          "降序数组要传 `greater<int>()` 作为第四参数",
          "对结构体二分需自定义比较或重载 `<`",
        ],
        pit: "`lower_bound` 在**降序**数组上默认比较仍是 `<`，结果完全错误，必须显式传比较器。",
      },
      {
        t: "排列、分割与集合操作",
        lead: "`next_permutation` 按字典序枚举全排列，是暴力枚举的神器，但必须先排序。",
        body: [
          "`do { ... } while (next_permutation(...))` 会枚举所有排列，共 n! 个。n ≤ 10 时可用，n = 12 就 4.8 亿了。",
          "`partition` 按谓词分成两段（不稳定），`stable_partition` 保持相对顺序。集合操作 `set_union/intersection/difference` 要求两段都有序。",
        ],
        code: `vector<int> p = {1, 2, 3};
sort(p.begin(), p.end());
do {
    for (int x : p) cout << x;
    cout << "\\n";
} while (next_permutation(p.begin(), p.end()));

vector<int> v = {1, 2, 3, 4, 5};
auto mid = partition(v.begin(), v.end(), [](int x){ return x % 2 == 0; });
// 偶数在前，奇数在后

vector<int> A = {1,2,3}, B = {2,3,4}, C;
set_intersection(A.begin(), A.end(), B.begin(), B.end(), back_inserter(C));`,
        lang: "C++",
        pts: [
          "`next_permutation` 从当前排列开始，所以要先把序列排成最小排列",
          "`back_inserter(C)` 让算法能往容器尾部追加",
          "集合操作的结果容器要自己保证足够空间或使用插入迭代器",
        ],
        pit: "`do-while` 结构才能枚举到第一个排列；写成 `while (next_permutation(...))` 会漏掉初始顺序。",
      },
      {
        t: "自定义二分：答案在单调函数上",
        lead: "真正的二分题往往没有数组，而是「答案具有单调性」——能二分的是判定函数。",
        body: [
          "二分答案的模板：`check(mid)` 为真时说明答案可以更小（或更大），据此收缩区间。关键是**想清楚 check 的方向**。",
          "整数二分的两种写法：求最小可行值用 `lo = mid + 1` 收缩，求最大可行值用 `hi = mid - 1`。写之前先确定区间是闭是开。",
        ],
        code: `// 求最小的 x 使 check(x) 为真
int lo = 0, hi = 1e9, ans = -1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (check(mid)) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
}

// 浮点二分：固定迭代 100 次比判 eps 更稳
double l = 0, r = 1e9;
for (int it = 0; it < 100; it++) {
    double m = (l + r) / 2;
    if (f(m)) r = m; else l = m;
}`,
        lang: "C++",
        pts: [
          "`lo + (hi - lo) / 2` 避免 `lo + hi` 溢出",
          "判定函数必须单调：真的一侧全真，假的一侧全假",
          "浮点二分用固定次数，避免 eps 太小时死循环",
        ],
        pit: "二分区间没覆盖到答案（比如答案是 0 但 lo 从 1 开始），会得到错误的 -1，且样例可能刚好过。",
      },
    ],
    qa: [
      ["sort 用的什么算法？", "introsort：快排 + 堆排 + 插入排序的混合，最坏也是 O(n log n)。"],
      ["lower_bound 能用于 set 吗？", "可以，`s.lower_bound(x)` 是成员函数，比通用版快（树上直接走）。"],
    ],
    sum: "排序去重三连靠 unique+erase，二分永远先确认有序，二分答案先确认单调。",
  },

  {
    t: "位运算与状态压缩",
    sub: "位技巧 · 子集枚举 · 状态压缩 DP · lowbit",
    mins: 55,
    kw: "状态压缩",
    goals: [
      "熟练用位运算做集合的增删查",
      "会用二进制表示「选/不选」的集合状态",
      "掌握子集枚举的 O(3ⁿ) 写法",
      "理解状态压缩 DP 的转移与边界",
    ],
    map: [
      ["操作", "写法", "含义"],
      ["查第 i 位", "`(s >> i) & 1`", "元素 i 是否在集合里"],
      ["置第 i 位", "`s | (1 << i)`", "把 i 加入集合"],
      ["清第 i 位", "`s & ~(1 << i)`", "把 i 移出集合"],
      ["取最低位 1", "`s & -s`", "lowbit"],
    ],
    mic: [
      {
        t: "用整数表示集合",
        lead: "一个 int 有 32 位，就是 32 个开关——这是最省内存的布尔数组。",
        body: [
          "位运算的三件套：查（`&`）、置（`|`）、清（`& ~`）。翻转用 `^`。因为它们都是单条 CPU 指令，比数组访问还快。",
          "集合大小 ≤ 20 时，`1 << n` 不超过 100 万，可以枚举所有子集；到 25 就是 3300 万，通常就超时或爆内存了。",
        ],
        code: `int s = 0;
s |= (1 << 3);                 // 加入元素 3
bool has3 = (s >> 3) & 1;      // 查询
s &= ~(1 << 3);                // 移除
s ^= (1 << 3);                 // 翻转

int low = s & -s;              // 最低位的 1
int cnt = __builtin_popcount(s);   // 集合大小

// 全集
int full = (1 << n) - 1;`,
        lang: "C++",
        pts: [
          "`1 << i` 的 i 建议不超过 30（int 只有 31 位可用）",
          "`__builtin_popcount` 只接受 unsigned int，long long 用 `popcountll`",
          "`s & -s` 在补码下等价于「只保留最低位的 1」",
        ],
        pit: "`1 << 31` 是符号位，属于 UB；需要 32 位以上就用 `1LL << i`。",
      },
      {
        t: "子集枚举：遍历所有「选哪些」",
        lead: "`for (s = 0; s < (1 << n); s++)` 就是「枚举 n 个元素的全部 2ⁿ 种选择」。",
        body: [
          "对每个 s，再用 `(s >> i) & 1` 判断第 i 个元素选没选，就能暴力处理所有组合。n ≤ 22 时大致可接受。",
          "如果外层已经在枚举 mask，内层要枚举 mask 的所有子集，用 `for (sub = mask; sub; sub = (sub - 1) & mask)`，总量是 3ⁿ。",
        ],
        code: `int n = 5;
for (int s = 0; s < (1 << n); s++) {
    vector<int> chosen;
    for (int i = 0; i < n; i++)
        if (s >> i & 1) chosen.push_back(a[i]);
    // 处理这一种选择
}

// 枚举 mask 的所有子集
for (int mask = 0; mask < (1 << n); mask++)
    for (int sub = mask; ; sub = (sub - 1) & mask) {
        // 处理 sub
        if (sub == 0) break;
    }`,
        lang: "C++",
        pts: [
          "外层枚举顺序天然是「二进制数值升序」，与字典序无关",
          "子集枚举的 `(sub - 1) & mask` 保证每次都是 mask 的子集",
          "3ⁿ 在 n = 20 时约 3.4e9，太重；n ≤ 16 才安全",
        ],
        pit: "`for (int sub = mask; sub; sub = (sub - 1) & mask)` 会漏掉空集，需要在循环外单独处理。",
      },
      {
        t: "状态压缩 DP 入门",
        lead: "把「已经访问过哪些点」压成一个整数，DP 的维度就少了一维。",
        body: [
          "经典题：旅行商问题（TSP）。`dp[mask][i]` 表示「已访问集合 mask，最后停在 i」的最小代价，转移是枚举下一个未访问的点 j。",
          "状态数 `2ⁿ × n`，转移枚举 n，总复杂度 `O(2ⁿ · n²)`。n ≤ 20 时可跑，n = 20 约 4 亿次。",
        ],
        code: `// TSP：n 个点，dist[i][j] 为距离
int n; 
vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX / 2));
dp[1][0] = 0;                    // 从 0 出发
for (int mask = 1; mask < (1 << n); mask++)
    for (int i = 0; i < n; i++) {
        if (!(mask >> i & 1) || dp[mask][i] == INT_MAX / 2) continue;
        for (int j = 0; j < n; j++) {
            if (mask >> j & 1) continue;
            int nm = mask | (1 << j);
            dp[nm][j] = min(dp[nm][j], dp[mask][i] + dist[i][j]);
        }
    }
int ans = INT_MAX;
for (int i = 1; i < n; i++) ans = min(ans, dp[(1 << n) - 1][i] + dist[i][0]);`,
        lang: "C++",
        pts: [
          "`INT_MAX` 相加会溢出，用 `INT_MAX / 2` 当无穷大",
          "只从「已访问」的状态转移，跳过非法状态能省大量时间",
          "`dp` 用 `vector` 开在堆上，别开成局部数组",
        ],
        pit: "`1 << n` 在 n ≥ 31 时溢出，且内存也放不下——状态压缩只在 n ≤ 22 左右可行。",
      },
      {
        t: "lowbit、树状数组与位计数技巧",
        lead: "`x & -x` 取出最低位的 1，是所有「按二进制位分组」算法的地基。",
        body: [
          "树状数组的 `i += i & -i` 就是「跳到下一个管辖范围包含 i 的位置」，理解了 lowbit 才能理解它为什么是 O(log n)。",
          "`x & (x - 1)` 清除最低位的 1——可以用来数 1 的个数（循环次数等于 1 的个数），也能判断 2 的幂。",
        ],
        code: `int lowbit(int x) { return x & -x; }

// 树状数组
int tree[N];
void add(int i, int v) { for (; i <= n; i += lowbit(i)) tree[i] += v; }
int sum(int i) { int s = 0; for (; i > 0; i -= lowbit(i)) s += tree[i]; return s; }

// 数 1 的个数（Brian Kernighan）
int popcount(int x) { int c = 0; while (x) { x &= x - 1; c++; } return c; }

// 判断 2 的幂
bool isPow2(int x) { return x > 0 && !(x & (x - 1)); }`,
        lang: "C++",
        pts: [
          "树状数组下标从 1 开始，0 会让 lowbit 死循环",
          "`x & (x-1)` 每次干掉一个 1，循环次数 = 1 的个数",
          "`__builtin_popcount` 通常比手写循环更快",
        ],
        pit: "树状数组的下标 0 是禁区：`lowbit(0) == 0`，`add(0, v)` 会无限循环。",
      },
    ],
    qa: [
      ["状态压缩能处理 n 多大的问题？", "时间复杂度通常 2ⁿ·n²，n ≤ 20 可行；空间 2ⁿ·n 个 int，n = 22 已经 350MB，要压缩。"],
      ["为什么 1 << 31 是未定义行为？", "int 只有 31 位数值位，左移到符号位在标准里是 UB，实际可能得到负数。"],
    ],
    sum: "位运算三件套查置清，n ≤ 20 想状压，lowbit 是树状数组的钥匙。",
  },

  {
    t: "常用数学与数论",
    sub: "gcd/快速幂 · 质数筛 · 组合数 · 同余与逆元",
    mins: 60,
    kw: "数学",
    goals: [
      "会写 gcd/lcm、快速幂、快速乘",
      "掌握埃氏筛与线性筛的区别",
      "能算组合数并对 1e9+7 取模",
      "理解逆元、费马小定理的适用条件",
    ],
    map: [
      ["算法", "复杂度", "用途"],
      ["欧几里得 gcd", "O(log min(a,b))", "约分、同余方程"],
      ["快速幂", "O(log n)", "大指数取模"],
      ["埃氏筛", "O(n log log n)", "筛质数、筛因子"],
      ["线性筛", "O(n)", "同时求积性函数"],
    ],
    mic: [
      {
        t: "gcd、lcm 与快速幂",
        lead: "`gcd(a,b) = gcd(b, a%b)` 递归到 0 就是答案——这是两千年前的算法，至今仍是最快的实用写法。",
        body: [
          "`lcm(a,b) = a / gcd(a,b) * b`，**先除后乘**避免溢出。C++17 起 `<numeric>` 里有 `std::gcd`。",
          "快速幂把指数按二进制拆分，每次平方底数，O(log n) 完成 `a^b mod m`。取模运算要在每步都做。",
        ],
        code: `long long gcd(long long a, long long b) { return b ? gcd(b, a % b) : a; }
long long lcm(long long a, long long b) { return a / gcd(a, b) * b; }

long long qpow(long long a, long long b, long long m) {
    long long r = 1 % m;
    a %= m;
    while (b) {
        if (b & 1) r = r * a % m;
        a = a * a % m;
        b >>= 1;
    }
    return r;
}

// 快速乘：a*b 会溢出时用
long long qmul(long long a, long long b, long long m) {
    long long r = 0;
    while (b) { if (b & 1) r = (r + a) % m; a = a * 2 % m; b >>= 1; }
    return r;
}`,
        lang: "C++",
        pts: [
          "`qpow` 的初始值写 `1 % m`，m = 1 时才是 0",
          "`a %= m` 放在循环外，避免底数本身超范围",
          "指数是 long long 才需要快速幂；普通 pow 返回 double 会丢精度",
        ],
        pit: "`lcm` 写成 `a * b / gcd` 时，a、b 都是 1e9 就先溢出了；必须先除后乘。",
      },
      {
        t: "质数筛：从 O(n log log n) 到 O(n)",
        lead: "筛法的核心思想是「用已知的质数去划掉它的倍数」，而不是逐个试除。",
        body: [
          "埃氏筛：从 2 开始，把每个质数的倍数标记为合数。复杂度 O(n log log n)，1e7 以内很快。",
          "线性筛（欧拉筛）：每个合数只被它最小的质因子筛一次，复杂度严格 O(n)，还能顺便求欧拉函数等积性函数。",
        ],
        code: `const int N = 1e7 + 5;
bool isComp[N];
vector<int> primes;

void sieve(int n) {                    // 线性筛
    for (int i = 2; i <= n; i++) {
        if (!isComp[i]) primes.push_back(i);
        for (int p : primes) {
            if (1LL * i * p > n) break;
            isComp[i * p] = true;
            if (i % p == 0) break;     // 关键：保证只筛一次
        }
    }
}

// 单个数判质数：试除到 sqrt
bool isPrime(long long x) {
    if (x < 2) return false;
    for (long long d = 2; d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}`,
        lang: "C++",
        pts: [
          "`i * p` 用 `1LL *` 防 int 溢出",
          "`i % p == 0` 时 break 是线性筛的灵魂",
          "区间筛：求 [L,R] 的质数时用 sqrt(R) 内的质数去筛",
        ],
        pit: "`bool` 数组开 1e8 就 100MB，容易 MLE；用 `bitset` 或 `vector<bool>` 可省 8 倍。",
      },
      {
        t: "组合数：递推、阶乘与取模",
        lead: "C(n,m) = C(n-1,m-1) + C(n-1,m)——杨辉三角的每一格都是它上方两格之和。",
        body: [
          "n ≤ 2000 时直接打表递推 O(n²)；n 很大但模数是质数时，用阶乘 + 逆元 O(n) 预处理、O(1) 查询。",
          "模数不是质数时不能用费马小定理，要改用扩展欧几里得或 Lucas 定理（模数为小质数）。",
        ],
        code: `const int MOD = 1e9 + 7;
long long C[2005][2005];

void buildC(int n) {
    for (int i = 0; i <= n; i++) {
        C[i][0] = C[i][i] = 1;
        for (int j = 1; j < i; j++)
            C[i][j] = (C[i-1][j-1] + C[i-1][j]) % MOD;
    }
}

// 阶乘 + 逆元（MOD 为质数）
long long fac[N], inv[N];
void init(int n) {
    fac[0] = 1;
    for (int i = 1; i <= n; i++) fac[i] = fac[i-1] * i % MOD;
    inv[n] = qpow(fac[n], MOD - 2, MOD);
    for (int i = n; i > 0; i--) inv[i-1] = inv[i] * i % MOD;
}
long long comb(int n, int m) {
    if (m < 0 || m > n) return 0;
    return fac[n] * inv[m] % MOD * inv[n-m] % MOD;
}`,
        lang: "C++",
        pts: [
          "`int` 存组合数表在 n > 1000 时可能溢出中间值，用 `long long` 或每步取模",
          "逆元公式 `a^(p-2) mod p` 要求 p 为质数且 a 不是 p 的倍数",
          "Lucas 定理处理 n, m 很大而 p 很小的情况",
        ],
        pit: "`inv` 数组从 n 倒推时下标要到 0，写成 `i > 0` 才对；`i >= 0` 会越界。",
      },
      {
        t: "同余、逆元与常见数论套路",
        lead: "在模运算的世界里，「除以 a」等于「乘以 a 的逆元」。",
        body: [
          "`a` 在模 p 下的逆元是满足 `a·x ≡ 1 (mod p)` 的 x。p 为质数且 gcd(a,p)=1 时，`x = a^(p-2)`。",
          "常见套路：前缀积 + 逆元做「除一个数」的区间查询；中国剩余定理合并多个同余方程；扩展欧几里得解 `ax + by = gcd`。",
        ],
        code: `// 扩展欧几里得：求 ax + by = gcd(a,b)
long long exgcd(long long a, long long b, long long &x, long long &y) {
    if (!b) { x = 1; y = 0; return a; }
    long long g = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return g;
}

// 逆元（要求 gcd(a,m)=1）
long long inv(long long a, long long m) {
    long long x, y;
    exgcd(a, m, x, y);
    return (x % m + m) % m;
}

// 负数取模修正
int mod(int x, int m) { return (x % m + m) % m; }`,
        lang: "C++",
        pts: [
          "扩展欧几里得求出的是特解，通解要加 `k·(b/g)`",
          "费马小定理只在模数为质数时成立，别乱用",
          "`(x % m + m) % m` 是负数取模的标准修正写法",
        ],
        pit: "`a * b % m` 在 a、b 都接近 m = 1e9 时会溢出 long long？不会（1e18 < 9.2e18），但三个数连乘就会。",
      },
    ],
    qa: [
      ["为什么快速幂要对底数先取模？", "底数可能远大于 m，先取模等价且避免后续乘法溢出。"],
      ["1e9+7 为什么这么常用？", "它是质数，逆元存在；且两个模内数相乘不超过 long long，不用额外处理溢出。"],
    ],
    sum: "gcd 递归、幂取模每步、组合数看规模选递推或阶乘逆元。",
  },
];
