// C++ 第 6-10 章 · 每章 4 节微课
module.exports = [
  {
    t: "指针与内存管理",
    sub: "地址与解引用 · 空指针 · new/delete · 智能指针",
    mins: 60,
    kw: "链表",
    goals: [
      "能读懂 `*` 与 `&` 在声明和表达式里的不同含义",
      "会手动申请/释放内存，知道为什么要成对",
      "能判断并避免野指针、悬垂指针、内存泄漏",
      "会用 unique_ptr / shared_ptr 让内存自动回收",
    ],
    map: [
      ["概念", "含义", "典型错误"],
      ["指针变量", "存的是另一个变量的地址", "未初始化就解引用"],
      ["解引用", "`*p` 取出 p 指向的值", "指向已释放的内存"],
      ["动态内存", "`new` / `delete` 成对出现", "只 new 不 delete → 泄漏"],
      ["智能指针", "离开作用域自动释放", "循环引用导致 shared_ptr 不释放"],
    ],
    mic: [
      {
        t: "指针是什么：一个存地址的变量",
        lead: "普通变量存「值」，指针变量存「值放在哪」——就像门牌号与房子的关系。",
        body: [
          "`&x` 取变量 x 的地址，`int *p = &x` 让 p 指向 x，`*p` 则是「顺着地址找到房子，把里面的东西取出来」。这三个符号是同一件事的三个视角。",
          "指针的类型决定了「一次读几个字节」以及「+1 走多远」：`int*` 加 1 前进 4 字节，`char*` 加 1 前进 1 字节。",
        ],
        code: `int x = 42;
int *p = &x;        // p 里存的是 x 的地址

cout << p << "\\n";   // 0x7ffd... 地址
cout << *p << "\\n";  // 42，解引用
*p = 100;            // 顺着地址改值
cout << x << "\\n";   // 100

int a[3] = {1, 2, 3};
int *q = a;          // 数组名退化为首元素地址
cout << *(q + 1);    // 2，等价于 a[1]`,
        lang: "C++",
        pts: [
          "`int *p` 中的 `*` 属于类型，`*p` 中的 `*` 是解引用运算符",
          "`p + 1` 不是地址加 1 字节，而是加一个 `sizeof(类型)`",
          "`a[i]` 本质就是 `*(a + i)`，所以 `i[a]` 居然也合法",
        ],
        pit: "声明时 `int *p, q;` 只有 p 是指针，q 是普通 int。想两个都是指针必须写 `int *p, *q;`。",
      },
      {
        t: "空指针、野指针与悬垂指针",
        lead: "指针三大事故：没初始化（野）、释放后还用（悬垂）、忘了判空。",
        body: [
          "**野指针**：没初始化就解引用，指向随机地址，行为完全不可预测。**悬垂指针**：delete 之后指针值还在，但内存已归还，再用就是踩别人地盘。",
          "规范做法：初始化就置 `nullptr`，delete 之后立刻置 `nullptr`，每次解引用前判空。",
        ],
        code: `int *p = nullptr;          // 好习惯：先给个确定值
if (p) { /* 判空后再用 */ }

int *q = new int(5);
delete q;
q = nullptr;                // 防悬垂

// 函数返回局部变量的地址 = 悬垂
int *bad() { int x = 1; return &x; }   // 千万别这么写`,
        lang: "C++",
        pts: [
          "`nullptr` 是类型安全的空指针，别再用 `NULL` 或 `0`",
          "`delete nullptr` 是安全的，什么也不做",
          "同一块内存 delete 两次是未定义行为，通常直接崩",
        ],
        pit: "`if (p)` 只判了指针本身，不保证它指向的内存有效——释放过的指针值仍然非空。",
      },
      {
        t: "new / delete 与动态数组",
        lead: "栈上的数组大小必须编译期确定，需要「运行时决定长度」时就得向堆申请。",
        body: [
          "`new T` 申请一个对象，`new T[n]` 申请数组，对应 `delete p` 与 `delete[] p`。**数组一定要用 delete[]**，否则只析构第一个元素，其余泄漏。",
          "在竞赛里其实很少手动 new：`vector` 已经帮你管好了。真正需要手动管理内存的场景是手写链表、树这类节点结构。",
        ],
        code: `int n;
cin >> n;
int *a = new int[n];        // 堆上开 n 个 int
for (int i = 0; i < n; i++) a[i] = i;
delete[] a;                  // 数组必须 delete[]

// 手写链表节点
struct Node { int val; Node *next; };
Node *head = new Node{1, nullptr};
head->next = new Node{2, nullptr};
// 释放整条链
while (head) { Node *t = head->next; delete head; head = t; }`,
        lang: "C++",
        pts: [
          "`new` 失败会抛 `bad_alloc`，竞赛里几乎不会发生",
          "`new int[n]()` 带括号会零初始化，`new int[n]` 不会",
          "现代写法：`vector<int> a(n)` 或 `make_unique<int[]>(n)`",
        ],
        pit: "`new` 配 `delete`、`new[]` 配 `delete[]`，错配是 UB；用 `vector` 就完全不用操心这件事。",
      },
      {
        t: "智能指针：让析构自动发生",
        lead: "智能指针把「谁负责 delete」写进类型里，离开作用域自动释放，从根上消灭泄漏。",
        body: [
          "`unique_ptr` 独占所有权，不能拷贝只能 move，开销与裸指针相同，**默认首选**。`shared_ptr` 用引用计数共享所有权，计数归零才释放，但有多余开销。",
          "`weak_ptr` 不增加计数，专门用来打破 shared_ptr 的循环引用——两个对象互相持有对方时，计数永远不归零。",
        ],
        code: `#include <memory>

auto p = make_unique<int>(42);        // 独占
cout << *p << "\\n";
// auto q = p;                         // 编译错误：不能拷贝

auto sp = make_shared<int>(7);        // 共享
auto sp2 = sp;                        // 计数变 2
cout << sp.use_count() << "\\n";      // 2

struct Node { shared_ptr<Node> next; };
auto a = make_shared<Node>();
a->next = a;                          // 循环引用，永远不释放`,
        lang: "C++",
        pts: [
          "优先 `make_unique` / `make_shared`，比裸 new 更安全也更高效",
          "`unique_ptr` 可以放进容器：`vector<unique_ptr<T>>`",
          "需要移交所有权时用 `std::move(p)`",
        ],
        pit: "`shared_ptr` 的引用计数是原子的，多线程安全但比 unique_ptr 慢；能用 unique 就别用 shared。",
      },
    ],
    qa: [
      ["指针和引用的本质区别？", "指针是对象（占内存、可为空、可改指向）；引用是别名（必须绑定、不可改绑、无空引用，底层通常用指针实现）。"],
      ["内存泄漏怎么排查？", "Valgrind、AddressSanitizer（-fsanitize=address）、或把裸 new 全换成智能指针从设计上避免。"],
    ],
    sum: "指针记三件事：初始化成 nullptr、释放后置空、new[] 配 delete[]。",
  },

  {
    t: "STL 容器大全（一）",
    sub: "vector · string · pair · stack · queue",
    mins: 55,
    kw: "模拟",
    goals: [
      "根据「要不要随机访问、要不要频繁插删」选对容器",
      "掌握 vector 的扩容机制与 reserve 的意义",
      "用 pair 与 struct 组织多字段数据",
      "分清 stack / queue / deque / priority_queue 的接口差异",
    ],
    map: [
      ["容器", "底层", "随机访问", "尾部插入", "中间插入"],
      ["vector", "连续数组", "O(1)", "均摊 O(1)", "O(n)"],
      ["deque", "分段连续", "O(1)", "O(1)", "O(n)"],
      ["list", "双向链表", "不支持", "O(1)", "O(1)"],
      ["stack/queue", "适配器", "不支持", "O(1)", "不支持"],
    ],
    mic: [
      {
        t: "vector：九成场景的默认选择",
        lead: "vector 就是会自动变长的数组，既能 O(1) 随机访问，又不用你管内存。",
        body: [
          "`push_back` 在容量满时会申请一块更大的内存（通常翻倍）并整体搬过去，所以单次可能是 O(n)，但**均摊 O(1)**。知道要放多少元素时先 `reserve`，能省掉所有搬移。",
          "删除元素不会缩小容量；想真正释放内存用 `shrink_to_fit()` 或与空 vector 交换。",
        ],
        code: `vector<int> v;
v.reserve(1000);            // 预留空间，避免反复扩容
for (int i = 0; i < 10; i++) v.push_back(i * i);

cout << v.size() << " " << v.capacity() << "\\n";
cout << v.front() << " " << v.back() << "\\n";
v.pop_back();               // 删末尾，O(1)
v.insert(v.begin() + 2, 99);// 中间插入，O(n)
v.erase(v.begin());         // 删头部，O(n)

sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());  // 去重三连`,
        lang: "C++",
        pts: [
          "`v[i]` 不检查越界，`v.at(i)` 会抛异常但更慢；竞赛用 `[]`",
          "`size()` 返回无符号数，`v.size() - 1` 在空容器上会变成极大值",
          "二维动态数组：`vector<vector<int>> g(n, vector<int>(m, 0))`",
        ],
        pit: "在范围 for 里 push_back 会让迭代器失效，可能死循环或崩溃。要扩容就改用下标循环并预留容量。",
      },
      {
        t: "string 与 vector<char> 的取舍",
        lead: "string 是专门为文本优化的容器，能用它就别用 char 数组。",
        body: [
          "string 支持 `+`、`+=`、`substr`、`find`、`compare`，还能和 C 风格字符串互转（`c_str()`）。它的内存也是连续的，可以和 `vector<char>` 互相构造。",
          "处理大量拼接时，先 `s.reserve(总长度)`；需要频繁在头部插入时，string 依然要整体搬移，考虑改用 deque 或反向处理。",
        ],
        code: `string s = "abc";
s.reserve(100);
s += "def";                     // 追加，均摊 O(1)
s.insert(0, ">> ");             // 头部插入 O(n)
cout << s.substr(1, 3) << "\\n";
cout << s.c_str() << "\\n";      // 传给 C 函数
printf("%s\\n", s.c_str());

string t(5, 'x');                // "xxxxx"
int num = stoi("42");            // 字符串转数字`,
        lang: "C++",
        pts: [
          "`s.back()` 取最后一个字符，`s.pop_back()` 删除它",
          "`to_string(int)` 转字符串，`stoi/stoll/stod` 反向转",
          "`string` 不可变部分操作用 `const string&` 传参避免拷贝",
        ],
        pit: "`s.c_str()` 返回的指针在 string 被修改或销毁后立即失效，不要长期保存。",
      },
      {
        t: "pair 与自定义结构体排序",
        lead: "pair 是「两个值捆一起」，自带字典序比较，是存「(值, 下标)」的最省事工具。",
        body: [
          "`pair<A,B>` 先比 first 再比 second，所以 `vector<pair<int,int>>` 直接 sort 就是按第一关键字、第二关键字升序。要降序就传自定义比较器。",
          "字段超过两个就用 struct + 自定义 `operator<`，可读性远好于嵌套 pair。",
        ],
        code: `vector<pair<int,int>> v = {{3,1},{1,2},{1,1}};
sort(v.begin(), v.end());     // (1,1) (1,2) (3,1)

auto p = make_pair(1, "one");
cout << p.first << p.second;

// 结构体排序
struct Node { int w, id; };
vector<Node> a = {{5,1},{2,2}};
sort(a.begin(), a.end(), [](const Node &x, const Node &y) {
    if (x.w != y.w) return x.w > y.w;   // 权值降序
    return x.id < y.id;                 // id 升序
});`,
        lang: "C++",
        pts: [
          "`pair` 的比较是字典序，先 first 后 second",
          "结构体排序的比较器必须满足严格弱序，否则 sort 会越界崩溃",
          "`tie(w, id) < tie(x.w, x.id)` 是写多关键字比较的偷懒技巧",
        ],
        pit: "比较器里用 `<=` 而不是 `<` 会破坏严格弱序，`sort` 可能直接段错误。相等时必须返回 false。",
      },
      {
        t: "stack / queue / priority_queue",
        lead: "这三个是「适配器」：底层还是 vector/deque，只暴露受限接口，逼你用对的语义。",
        body: [
          "`stack` 后进先出（括号匹配、单调栈）；`queue` 先进先出（BFS）；`priority_queue` 每次取最大（堆优化 Dijkstra）。",
          "`priority_queue` 默认是**大根堆**，要小根堆得写 `priority_queue<int, vector<int>, greater<int>>`——这三个参数是新手最容易写错的地方。",
        ],
        code: `stack<int> st;
st.push(1); st.push(2);
cout << st.top();  st.pop();       // 2

queue<int> q;
q.push(1); q.push(2);
cout << q.front(); q.pop();        // 1

priority_queue<int> mx;                       // 大根堆
priority_queue<int, vector<int>, greater<int>> mn;  // 小根堆
mx.push(3); mx.push(9); mx.push(1);
cout << mx.top();                  // 9`,
        lang: "C++",
        pts: [
          "三者都没有迭代器，不能遍历，只能取顶/首元素",
          "`pop()` 返回 void，取值必须先 `top()` / `front()`",
          "空容器上调用 top/pop 是 UB，务必先判 `empty()`",
        ],
        pit: "`for (auto x : st)` 编译不过——stack 不支持遍历。需要遍历就用 vector 加手动下标。",
      },
    ],
    qa: [
      ["vector 扩容为什么要翻倍？", "翻倍使 n 次插入的总搬移次数是 O(n)，均摊每次 O(1)；按固定长度增长会退化成 O(n²)。"],
      ["priority_queue 怎么存自定义类型？", "重载 `operator<`（注意是小于号，大根堆取最大）或传第三个参数自定义比较器。"],
    ],
    sum: "默认 vector，要堆用 priority_queue，要先进先出用 queue，别为了「省一次搬移」乱用 list。",
  },

  {
    t: "STL 容器大全（二）",
    sub: "set/map · unordered 系列 · 迭代器 · 复杂度陷阱",
    mins: 55,
    kw: "哈希表",
    goals: [
      "用 set/map 做有序维护与范围查询",
      "知道哈希容器什么时候会退化成 O(n)",
      "分清 `map[k]` 与 `find` 的副作用差异",
      "会写自定义比较器与哈希函数",
    ],
    map: [
      ["容器", "有序", "单次操作", "典型用途"],
      ["set", "是（红黑树）", "O(log n)", "去重 + 找前驱后继"],
      ["map", "是（红黑树）", "O(log n)", "键值映射 + 范围查询"],
      ["unordered_set", "否（哈希）", "均摊 O(1)", "纯判重"],
      ["unordered_map", "否（哈希）", "均摊 O(1)", "计数、缓存"],
    ],
    mic: [
      {
        t: "set 与 map：有序的红黑树",
        lead: "set 是「自动排序 + 自动去重」的集合，map 是给每个键挂一个值。",
        body: [
          "两者底层都是红黑树，插入、删除、查找都是 O(log n)，且**始终有序**。所以能 O(log n) 找 `lower_bound`（第一个 ≥ x 的元素）——这是哈希表做不到的。",
          "`map` 的 `[]` 在键不存在时会**插入一个默认值**，这既方便（计数）又危险（只想查询却污染了容器）。",
        ],
        code: `set<int> s;
s.insert(3); s.insert(1); s.insert(3);
cout << s.size() << "\\n";        // 2，自动去重
for (int x : s) cout << x << " ";  // 1 3，自动有序

auto it = s.lower_bound(2);       // 第一个 >= 2
if (it != s.end()) cout << *it;   // 3

map<string,int> cnt;
cnt["apple"]++;                   // 不存在则插入 0 再 ++
if (cnt.count("pear")) cout << cnt["pear"];
auto f = cnt.find("pear");        // 不插入，更安全
if (f != cnt.end()) cout << f->second;`,
        lang: "C++",
        pts: [
          "`count()` 只返回 0/1，用来判存在；`find()` 返回迭代器",
          "`s.erase(x)` 按键删，返回删除个数；`s.erase(it)` 按迭代器删",
          "`multiset` 允许重复，`erase(x)` 会删掉**所有**等于 x 的元素",
        ],
        pit: "遍历 map 时 `erase(it++)` 才是安全的；C++11 起 `it = m.erase(it)` 也行，但 `m.erase(it); it++` 是 UB。",
      },
      {
        t: "unordered 系列与哈希退化",
        lead: "哈希容器平均 O(1)，但被针对构造数据时可以退化成 O(n)——出题人会这么干。",
        body: [
          "`unordered_map` / `unordered_set` 用哈希表实现，不保证顺序，但查找更快。键必须是可哈希的类型（内置类型、string 都行）。",
          "如果哈希函数把所有键映射到同一个桶，所有操作都会退化成链表遍历 O(n)。Codeforces 上有专门的 anti-hash 测试，把 int 键的 map 卡成 TLE。",
        ],
        code: `unordered_map<int,int> cnt;
cnt[1]++; cnt[2]++;
cout << cnt[1] << "\\n";
cnt.reserve(10000);        // 预留桶，减少 rehash
cnt.max_load_factor(0.7);

unordered_set<string> seen;
if (seen.insert(s).second) { /* 第一次出现 */ }

// 防 anti-hash：给键加随机偏移
struct SafeHash {
    size_t operator()(int x) const {
        static const size_t salt = chrono::steady_clock::now().time_since_epoch().count();
        return hash<int>()(x ^ salt);
    }
};
unordered_map<int,int,SafeHash> mp;`,
        lang: "C++",
        pts: [
          "需要有序或范围查询时，必须用 map/set",
          "`reserve(n)` 能减少 rehash，n 是预估元素数",
          "`unordered_map<pair<int,int>,...>` 编译不过，需要自定义哈希",
        ],
        pit: "迭代 unordered_map 的顺序是不确定的，甚至同一程序两次运行也不同。别依赖它的顺序输出。",
      },
      {
        t: "迭代器：容器的通用游标",
        lead: "迭代器是「指向容器元素的对象」，让算法库能对所有容器一视同仁。",
        body: [
          "`begin()` 指向首元素，`end()` 指向**最后一个元素之后**（哨兵），所以遍历条件永远是 `it != end()`，不是 `<=`。",
          "随机访问迭代器（vector/deque）支持 `it + n`，双向迭代器（set/map/list）只能 `++`/`--`。`std::advance` 和 `std::next` 能统一处理。",
        ],
        code: `vector<int> v = {10, 20, 30};
for (auto it = v.begin(); it != v.end(); ++it) cout << *it << " ";

auto it = v.begin() + 1;     // 随机访问迭代器才能 +1
cout << *it;                 // 20
cout << *(v.end() - 1);      // 30，最后一个元素

set<int> s = {1, 2, 3};
auto sit = s.begin();
// sit + 1;                  // 编译错误：只有双向迭代器
advance(sit, 1);             // 正确做法，
cout << *sit;                // 2`,
        lang: "C++",
        pts: [
          "`end()` 不能解引用，只能比较",
          "容器扩容（push_back、insert）会让所有迭代器失效，用完即弃",
          "`prev(end())` 与 `end() - 1` 都指向最后一个元素",
        ],
        pit: "在循环里 `v.push_back(x)` 后继续用旧的 `it`，是未定义行为，常见表现是读到垃圾值或崩溃。",
      },
      {
        t: "复杂度陷阱：常数也是时间",
        lead: "O(log n) 的 map 比 O(1) 的数组慢几十倍，1e7 次操作时这个常数会决定 TLE。",
        body: [
          "红黑树每次操作要做指针跳转与旋转，缓存极不友好；哈希表要算 hash + 探测。相比之下，数组下标访问只要一次乘法加法。",
          "经验值：1 秒内，vector 下标访问能跑约 1e8~1e9 次；unordered_map 约 1e7；map 约 1e6。数据范围小（如值域 1e6）时，用数组代替 map。",
        ],
        code: `// 慢：值域才 1e6，却用 map
map<int,int> cnt;
for (int x : a) cnt[x]++;
for (auto &kv : cnt) if (kv.second > 1) ...

// 快：直接用数组当哈希表
const int MAXV = 1e6 + 5;
int cnt[MAXV] = {};
for (int x : a) cnt[x]++;
for (int v = 1; v <= n; v++) if (cnt[v] > 1) ...`,
        lang: "C++",
        pts: [
          "值域 ≤ 1e7 且非负：用数组代替 map 通常快 10 倍以上",
          "`map` 遍历是按键升序的，可当「有序去重」用",
          "需要同时有序 + O(1) 查询时，考虑排序 + 二分代替 map",
        ],
        pit: "把 1e9 值域的数直接开数组会爆内存——这时才该用 map 或离散化。",
      },
    ],
    qa: [
      ["map 和 unordered_map 怎么选？", "要有序或范围查询选 map；纯查找计数选 unordered_map 并 reserve；值域小就用数组。"],
      ["set 能做「第 k 小」吗？", "标准 set 不行（没有下标），需要 pb_ds 的 tree 或树状数组/线段树。"],
    ],
    sum: "有序用 map/set，快速查找用 unordered + reserve，值域小就直接开数组。",
  },

  {
    t: "面向对象：类与封装",
    sub: "class/struct · 构造析构 · this · static · 运算符重载",
    mins: 55,
    kw: "模拟",
    goals: [
      "用 class 把「数据 + 操作」绑在一起",
      "分清构造函数、析构函数、拷贝构造的调用时机",
      "理解 public/private 的真实作用与 this 指针",
      "会重载运算符让自定义类型像内置类型一样用",
    ],
    map: [
      ["成员", "作用", "调用时机"],
      ["构造函数", "初始化对象", "对象创建时"],
      ["析构函数", "释放资源", "对象销毁 / 离开作用域"],
      ["拷贝构造", "用同类型对象初始化新对象", "值传递、返回值、显式拷贝"],
      ["static 成员", "属于类不属于对象", "类加载时初始化一次"],
    ],
    mic: [
      {
        t: "class 与 struct：封装的最小单元",
        lead: "类就是把一堆变量和操作这些变量的函数，打包成一个新类型。",
        body: [
          "`class` 默认 private，`struct` 默认 public——其余完全一样。竞赛里常用 struct 存多维数据，因为它写起来短。",
          "封装的真正价值不是「藏起来」，而是**保证不变式**：外部只能通过成员函数改数据，你就有机会检查合法性。",
        ],
        code: `struct Point {
    int x, y;                       // public
    Point(int x = 0, int y = 0) : x(x), y(y) {}   // 初始化列表

    int dist2() const {             // const 表示不改成员
        return x * x + y * y;
    }
    void move(int dx, int dy) { x += dx; y += dy; }
};

Point p(3, 4);
cout << p.dist2();   // 25

class Counter {
    int n = 0;                       // private
public:
    void inc() { n++; }
    int get() const { return n; }
};`,
        lang: "C++",
        pts: [
          "初始化列表 `: x(x)` 比在函数体里赋值更早、更高效",
          "成员函数加 `const` 才能在 const 对象/引用上调用",
          "`explicit` 修饰单参构造，防止意外的隐式类型转换",
        ],
        pit: "初始化列表的顺序由**成员声明顺序**决定，不是你在列表里写的顺序。写反了会用到未初始化的值。",
      },
      {
        t: "构造、析构与三法则",
        lead: "对象有生命周期：出生时构造，死亡时析构。管内存的类必须自己写这三件事。",
        body: [
          "**三法则**：如果你需要自定义析构函数、拷贝构造、拷贝赋值中的任何一个，通常三个都需要——因为它们共同定义「资源怎么复制、怎么释放」。",
          "C++11 之后加上移动构造与移动赋值，变成**五法则**。现代做法是「零法则」：用智能指针和容器，一个都不用写。",
        ],
        code: `class Buf {
    int *p; int n;
public:
    Buf(int n) : p(new int[n]()), n(n) {}
    ~Buf() { delete[] p; }                        // 析构释放

    Buf(const Buf &o) : p(new int[o.n]), n(o.n) {  // 深拷贝
        copy(o.p, o.p + n, p);
    }
    Buf &operator=(const Buf &o) {                 // 拷贝赋值
        if (this == &o) return *this;              // 自赋值保护
        delete[] p;
        n = o.n; p = new int[n];
        copy(o.p, o.p + n, p);
        return *this;
    }
};`,
        lang: "C++",
        pts: [
          "默认拷贝构造是**浅拷贝**，两个对象指向同一块内存 → 双重 delete",
          "拷贝赋值必须处理自赋值（`a = a`）",
          "现代替代：成员换成 `vector<int>` 或 `unique_ptr`，三法则直接消失",
        ],
        pit: "析构函数里不要抛异常——栈展开过程中再抛会导致程序直接终止。",
      },
      {
        t: "this 指针、static 成员与友元",
        lead: "`this` 是「当前对象的地址」，static 成员是「全类共享的一份」。",
        body: [
          "成员函数里访问 `x` 等价于 `this->x`。当参数名与成员名冲突时，必须写 `this->x = x`。`this` 也是实现链式调用的关键：返回 `*this`。",
          "`static` 成员变量属于类，所有对象共用一份，必须在类外定义；`static` 成员函数没有 this，不能访问非静态成员。",
        ],
        code: `class Counter {
    static int total;          // 声明
    int id;
public:
    Counter() { id = ++total; }
    static int count() { return total; }   // 无 this

    Counter &inc(int k) { id += k; return *this; }  // 链式
};
int Counter::total = 0;        // 类外定义，必须写

Counter a, b;
cout << Counter::count();      // 2
a.inc(1).inc(2);               // 链式调用`,
        lang: "C++",
        pts: [
          "static 成员变量在类外定义时不再写 static 关键字",
          "static 成员函数里不能用 this，也不能直接访问普通成员",
          "C++17 起可用 `inline static int total = 0;` 在类内直接定义",
        ],
        pit: "只声明 static 成员而忘记在类外定义，链接时会报 `undefined reference`。",
      },
      {
        t: "运算符重载：让自定义类型融入语法",
        lead: "重载 `+`、`<`、`==` 之后，自定义类型就能直接 sort、比较、相加。",
        body: [
          "成员函数形式 `a.operator+(b)` 第一个操作数是 this；友元/全局形式 `operator+(a,b)` 两个都能显式控制，对称性更好。",
          "`<` 重载的价值最大：一重载，`sort`、`set`、`priority_queue` 全都能用了。",
        ],
        code: `struct Vec {
    int x, y;
    Vec operator+(const Vec &o) const { return {x + o.x, y + o.y}; }
    bool operator<(const Vec &o) const {       // 供 sort / set 用
        return x != o.x ? x < o.x : y < o.y;
    }
    bool operator==(const Vec &o) const { return x == o.x && y == o.y; }
};

// 输出流重载必须是全局函数
ostream &operator<<(ostream &os, const Vec &v) {
    return os << "(" << v.x << "," << v.y << ")";
}

Vec a{1,2}, b{3,4};
cout << a + b << "\\n";     // (4,6)`,
        lang: "C++",
        pts: [
          "比较类运算符加 const，且不要修改操作数",
          "`<<`/`>>` 重载必须写成全局函数（左操作数是流）",
          "只重载真正有语义的运算符，别为了炫技重载 `,`",
        ],
        pit: "同时重载 `<` 和 `==` 时注意一致性：`a<b && b<a` 都为假应等价于 `a==b`，否则 set/sort 行为会怪。",
      },
    ],
    qa: [
      ["struct 和 class 的区别？", "默认访问权限不同（public vs private），默认继承方式不同。其他完全一样。"],
      ["为什么析构函数常声明为 virtual？", "通过基类指针 delete 派生类对象时，虚析构才能正确调用派生类析构，否则资源泄漏。"],
    ],
    sum: "管资源的类要遵守三/五法则，现代 C++ 用容器和智能指针直接规避。",
  },

  {
    t: "模板与泛型编程",
    sub: "函数模板 · 类模板 · 特化 · lambda 与 auto",
    mins: 55,
    kw: "二分",
    goals: [
      "写出能适配多种类型的函数模板",
      "理解模板是编译期展开，不是运行时多态",
      "会用类模板封装通用数据结构",
      "掌握 lambda 的捕获方式与常见误用",
    ],
    map: [
      ["语法", "作用", "注意"],
      ["`template<class T>`", "声明类型参数", "T 在编译期确定"],
      ["函数模板", "一套逻辑适配多类型", "类型推导可能不如预期"],
      ["类模板", "通用容器/结构", "使用时必须写 `<T>`（C++17 可省略）"],
      ["lambda", "就地定义匿名函数", "捕获方式决定生命周期风险"],
    ],
    mic: [
      {
        t: "函数模板：一次编写，多类型复用",
        lead: "模板不是「运行时判断类型」，而是「编译期为每个用到的类型各生成一份代码」。",
        body: [
          "`template<class T> T myMax(T a, T b)` 中的 T 是占位符，调用 `myMax(1, 2)` 时编译器把 T 替换成 int，生成一份专用代码。这叫**实例化**。",
          "所以模板代码必须写在头文件里（调用方要能看到完整定义），否则链接时找不到实例。",
        ],
        code: `template<class T>
T myMax(T a, T b) { return a > b ? a : b; }

cout << myMax(3, 7) << "\\n";          // T = int
cout << myMax(2.5, 1.5) << "\\n";      // T = double
cout << myMax<string>("a", "b");       // T = string

// 多类型参数
template<class A, class B>
auto add(A a, B b) -> decltype(a + b) { return a + b; }

// C++14 起可直接推导返回类型
template<class A, class B>
auto add2(A a, B b) { return a + b; }`,
        lang: "C++",
        pts: [
          "模板参数可以是类型，也可以是整数常量：`template<int N>`",
          "`myMax(1, 2.5)` 会推导失败（T 冲突），需显式写 `myMax<double>(1, 2.5)`",
          "模板错误信息很长，先看第一行「required from here」",
        ],
        pit: "把模板函数的定义放到 .cpp 里、声明放头文件，其他文件调用时链接会报 undefined reference。",
      },
      {
        t: "类模板与泛型数据结构",
        lead: "类模板让「容器」和「元素类型」解耦，STL 的 vector/map 全是这么写的。",
        body: [
          "类模板在定义时不知道 T 是什么，所有用到 T 的地方都留空。实例化 `Stack<int>` 时才真正生成代码。",
          "模板可以带默认参数，也可以有特化版本处理特殊类型——这是很多库做优化的手段。",
        ],
        code: `template<class T>
class Stack {
    vector<T> d;
public:
    void push(const T &x) { d.push_back(x); }
    void pop() { d.pop_back(); }
    T &top() { return d.back(); }
    bool empty() const { return d.empty(); }
    size_t size() const { return d.size(); }
};

Stack<int> si;      si.push(1);
Stack<string> ss;   ss.push("hi");

// 非类型参数：编译期确定大小
template<class T, int N>
struct Arr { T a[N]; int size() const { return N; } };
Arr<int, 10> buf;`,
        lang: "C++",
        pts: [
          "类模板的成员函数定义在类外时，每处都要重复写 `template<class T>`",
          "C++17 起 `Stack s = Stack<int>();` 可简写为 `Stack s{...}`（CTAD）",
          "模板实例化是编译期的，不会带来运行时开销",
        ],
        pit: "模板类在头文件里定义、又在 .cpp 里显式实例化，容易出现「同一个模板被实例化两次」的链接冲突，用 include guard 与匿名命名空间处理。",
      },
      {
        t: "lambda：就地写一个匿名函数",
        lead: "lambda 是「用完就扔的小函数」，最适合当 sort 的比较器、算法的谓词。",
        body: [
          "语法 `[捕获](参数){ 函数体 }`。捕获列表决定能访问哪些外部变量：`[=]` 按值捕获全部，`[&]` 按引用捕获全部，`[x, &y]` 精确指定。",
          "按值捕获的变量在 lambda 创建时就固定了（除非加 `mutable`）；按引用捕获要小心被引用的变量提前销毁。",
        ],
        code: `int k = 3;
vector<int> v = {5, 1, 4};

sort(v.begin(), v.end(), [](int a, int b) { return a > b; });   // 降序

int cnt = count_if(v.begin(), v.end(), [k](int x) { return x > k; });

auto add = [](int a, int b) { return a + b; };
cout << add(1, 2);

// 递归 lambda（C++14）
auto fib = [](auto &&self, int n) -> int {
    return n <= 1 ? n : self(self, n - 1) + self(self, n - 2);
};
cout << fib(fib, 10);`,
        lang: "C++",
        pts: [
          "`[]` 空捕获不能访问任何外部变量，包括全局之外的局部变量",
          "`[&]` 在异步/延迟执行场景下极易悬垂，优先按值捕获",
          "`mutable` 允许修改按值捕获的副本，但改的是副本不是原变量",
        ],
        pit: "在 lambda 里按引用捕获循环变量 i，若 lambda 被存起来延后执行，所有 lambda 看到的都是循环结束后的同一个 i。",
      },
      {
        t: "auto、decltype 与类型推导规则",
        lead: "`auto` 让编译器替你写类型，省掉 `vector<int>::iterator` 这种长串。",
        body: [
          "`auto x = expr;` 按值推导，会**丢掉引用和 const**；`auto &x = expr;` 保留引用；`const auto &x` 是遍历容器最常用的写法（零拷贝 + 只读）。",
          "`decltype(expr)` 推导出表达式的精确类型（含引用与 const），常用于模板返回类型。",
        ],
        code: `vector<int> v = {1, 2, 3};

for (auto x : v) x *= 2;         // 改的是副本，v 不变
for (auto &x : v) x *= 2;        // 真改
for (const auto &x : v) cout << x;  // 只读，零拷贝

auto it = v.begin();             // vector<int>::iterator
auto n = v.size();               // size_t

int a = 1;
decltype(a) b = 2;               // int
decltype((a)) c = a;             // int&，注意多了一层括号`,
        lang: "C++",
        pts: [
          "`auto` 不能用于函数参数（C++20 的 auto 参数是模板语法糖）",
          "遍历容器优先 `const auto &`，避免隐式拷贝整个元素",
          "`auto` 推导 `size()` 得到无符号类型，做减法要留神",
        ],
        pit: "`auto x = v[0];` 是拷贝；想改元素必须 `auto &x`。这个差别在存大对象时同时影响正确性和性能。",
      },
    ],
    qa: [
      ["模板和虚函数（多态）的区别？", "模板是编译期静态多态（零开销、代码膨胀）；虚函数是运行期动态多态（一次虚表跳转）。"],
      ["为什么模板报错那么长？", "因为实例化链路被完整打印出来。看最后一条「error:」和它上面一行的「required from」通常就能定位。"],
    ],
    sum: "模板 = 编译期填空；lambda = 就地小函数；auto 推导会丢引用和 const。",
  },
];
