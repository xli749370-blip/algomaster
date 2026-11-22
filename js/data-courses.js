// ============ 语言课程数据 ============
// 结构: COURSES[lang] = { name, cls, icon, desc, lessons: [{title, sub, html}] }

const COURSES = {

cpp: {
  name: "C++ 从零到精通",
  cls: "lang-cpp",
  icon: "🔷",
  desc: "从基础语法到 STL、面向对象、模板与现代 C++ 特性，共 12 章",
  lessons: [
  { title: "C++ 入门与第一个程序", sub: "环境搭建 · 编译流程 · Hello World", html: `
    <h2>第1章 C++ 入门与第一个程序</h2>
    <h3>1.1 环境搭建</h3>
    <p>C++ 是编译型语言，写完代码需要<strong>编译</strong>成机器码才能运行。常用环境：</p>
    <ul>
      <li><strong>本地</strong>：安装 MinGW-w64（Windows）或 g++/clang++（Linux/macOS），配合 VSCode + C/C++ 插件</li>
      <li><strong>IDE</strong>：CLion、Visual Studio（功能最全）、Dev-C++（轻量）</li>
      <li><strong>在线</strong>：洛谷、LeetCode 在线编译器，acwing.com</li>
    </ul>
    <h3>1.2 编译流程（面试常问）</h3>
    <p>源代码 → <strong>预处理</strong>（展开 #include/#define）→ <strong>编译</strong>（生成汇编）→ <strong>汇编</strong>（生成目标文件 .o）→ <strong>链接</strong>（合并库和目标文件）→ 可执行文件</p>
    <span class="code-lang">bash</span>
    <pre><code>g++ main.cpp -o main        # 编译并链接
g++ -std=c++17 -O2 main.cpp -o main   # 指定标准与优化
./main</code></pre>
    <h3>1.3 第一个程序</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;iostream&gt;      // 输入输出流头文件
using namespace std;       // 使用标准命名空间

int main() {               // 程序入口，返回 int
    cout &lt;&lt; "Hello, AlgoMaster!" &lt;&lt; endl;  // endl 会刷新缓冲区
    return 0;              // 0 表示正常退出
}</code></pre>
    <div class="tip-box">💡 <strong>算法竞赛技巧</strong>：加上 <code>ios::sync_with_stdio(false); cin.tie(0);</code> 可让 cin/cout 快到接近 scanf/printf。</div>
    <h3>1.4 注释</h3>
    <ul><li><code>// 单行注释</code></li><li><code>/* 多行注释 */</code></li></ul>
  ` },
  { title: "变量、数据类型与运算符", sub: "基本类型 · 类型转换 · 位运算", html: `
    <h2>第2章 变量、数据类型与运算符</h2>
    <h3>2.1 基本数据类型</h3>
    <table style="width:100%;font-size:13px;color:#c9cfdd;border-collapse:collapse">
      <tr style="color:#6c8cff"><th>类型</th><th>字节</th><th>范围</th></tr>
      <tr><td>int</td><td>4</td><td>约 ±21 亿</td></tr>
      <tr><td>long long</td><td>8</td><td>约 ±9.2×10^18</td></tr>
      <tr><td>float / double</td><td>4 / 8</td><td>6 / 15 位有效数字</td></tr>
      <tr><td>char</td><td>1</td><td>-128 ~ 127</td></tr>
      <tr><td>bool</td><td>1</td><td>true / false</td></tr>
    </table>
    <div class="warn-box">⚠️ int 溢出是算法题<strong>最常见错误</strong>！两个 1e9 的数相乘就会爆 int，要用 long long：数据范围 &gt; 2×10^9 时一律用 long long。</div>
    <h3>2.2 变量定义与常量</h3>
    <span class="code-lang">C++</span>
    <pre><code>int a = 10;
const double PI = 3.14159;    // 编译期常量
constexpr int N = 1e5 + 10;    // C++11 常量表达式
auto b = 3.14;                 // 自动类型推导（C++11）</code></pre>
    <h3>2.3 运算符</h3>
    <ul>
      <li>算术：<code>+ - * / %</code>（整数除法<strong>向零取整</strong>：<code>-7/2 == -3</code>）</li>
      <li>比较：<code>== != &lt; &gt; &lt;= &gt;=</code></li>
      <li>逻辑：<code>&amp;&amp; || !</code>（短路求值）</li>
      <li>位运算：<code>&amp;</code> 与、<code>|</code> 或、<code>^</code> 异或、<code>~</code> 取反、<code>&lt;&lt;</code> 左移、<code>&gt;&gt;</code> 右移</li>
    </ul>
    <h3>2.4 位运算实战技巧</h3>
    <span class="code-lang">C++</span>
    <pre><code>n &gt;&gt; 1          // 相当于 n/2（更快）
n &lt;&lt; 1 | 1      // n*2+1
n &amp; (n - 1)     // 消去最低位的 1（判断 2 的幂）
n &amp; -n          // 取最低位的 1（lowbit，树状数组核心）
n ^ n == 0      // 相同数异或为 0 —— 找只出现一次的数</code></pre>
  ` },
  { title: "控制流：分支与循环", sub: "if/switch · for/while · break/continue", html: `
    <h2>第3章 控制流：分支与循环</h2>
    <h3>3.1 分支</h3>
    <span class="code-lang">C++</span>
    <pre><code>int score = 85;
if (score &gt;= 90) cout &lt;&lt; "优秀";
else if (score &gt;= 60) cout &lt;&lt; "及格";
else cout &lt;&lt; "不及格";

switch (score / 10) {          // 只能用于整数类型
    case 10: case 9: cout &lt;&lt; "A"; break;   // 忘写 break 会"穿透"！
    case 8:  cout &lt;&lt; "B"; break;
    default: cout &lt;&lt; "C";
}
// 三目运算符
string s = score &gt;= 60 ? "pass" : "fail";</code></pre>
    <h3>3.2 循环</h3>
    <span class="code-lang">C++</span>
    <pre><code>for (int i = 0; i &lt; n; i++) { ... }        // 经典 for
for (int x : vec) { ... }                   // 范围 for（C++11），遍历 vector
while (cin &gt;&gt; n) { ... }                    // 读到 EOF
do { ... } while (cond);                    // 至少执行一次

// 常用套路：枚举数位
while (n) { int d = n % 10; n /= 10; }</code></pre>
    <div class="tip-box">💡 <code>break</code> 跳出本层循环；<code>continue</code> 跳过本次进入下一次。多重循环跳出可以用标志变量或 <code>goto</code>（不推荐）。</div>
  ` },
  { title: "数组与字符串", sub: "一维/二维数组 · string 基本操作", html: `
    <h2>第4章 数组与字符串</h2>
    <h3>4.1 数组</h3>
    <span class="code-lang">C++</span>
    <pre><code>int a[10];                  // 未初始化，值随机！
int b[10] = {0};            // 全部清 0（竞赛标准写法）
int c[][3] = {{1,2,3},{4,5,6}};   // 二维数组

// 常见内存开法（竞赛）
const int N = 1e5 + 10;
int d[N];                   // 开在全局区，避免栈溢出</code></pre>
    <div class="warn-box">⚠️ 数组越界不报错但行为未定义，<strong>循环边界务必小心</strong>。局部大数组（如 1e7 的 int）会栈溢出，请开在全局。</div>
    <h3>4.2 string</h3>
    <span class="code-lang">C++</span>
    <pre><code>string s = "hello";
s.size(); s.length();       // 长度
s.substr(1, 3);             // 从下标1截取3个字符 -> "ell"
s += " world";              // 拼接
s.find("ll");               // 返回下标，找不到返回 string::npos
sort(s.begin(), s.end());   // 对字符排序
// 比较：直接用 &lt; &gt; == 按字典序比较
// 字符判断：isdigit / isalpha / isupper / tolower / toupper</code></pre>
    <div class="tip-box">💡 十进制数转字符串：<code>to_string(123)</code>；字符串转数：<code>stoi("123")</code>、<code>stoll</code>（long long）。</div>
  ` },
  { title: "函数与作用域", sub: "参数传递 · 引用 · 重载 · 递归", html: `
    <h2>第5章 函数与作用域</h2>
    <h3>5.1 参数传递（重点！）</h3>
    <span class="code-lang">C++</span>
    <pre><code>void byValue(vector&lt;int&gt; v);        // 拷贝一份，慢，改不影响原数据
void byRef(vector&lt;int&gt;&amp; v);         // 引用传递，快，改会影响原数据
void constRef(const vector&lt;int&gt;&amp; v); // 常量引用：不拷贝又不许改（最佳实践）

int add(int a, int b) { return a + b; }  // 返回值可以 auto 推导（C++14）</code></pre>
    <div class="tip-box">💡 算法题里传 vector、string 一律用 <code>&amp;</code> 引用，否则每次调用都拷贝，直接 TLE。</div>
    <h3>5.2 重载与默认参数</h3>
    <span class="code-lang">C++</span>
    <pre><code>int  max(int a, int b);
double max(double a, double b);      // 同名不同参数 = 重载
void print(int a, int b = 10);       // 默认参数从右往左</code></pre>
    <h3>5.3 递归（算法基石）</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 阶乘：必须有终止条件！
long long fact(int n) {
    if (n &lt;= 1) return 1;
    return n * fact(n - 1);
}
// 斐波那契（朴素递归 O(2^n)，后面会学记忆化优化到 O(n)）
int fib(int n) { return n &lt; 2 ? n : fib(n-1) + fib(n-2); }</code></pre>
  ` },
  { title: "指针与内存管理", sub: "指针基础 · new/delete · 智能指针", html: `
    <h2>第6章 指针与内存管理</h2>
    <h3>6.1 指针基础</h3>
    <span class="code-lang">C++</span>
    <pre><code>int a = 10;
int* p = &amp;a;        // p 存 a 的地址
cout &lt;&lt; *p;         // 解引用：输出 10
*p = 20;            // 通过指针修改 a
int arr[5];
int* q = arr;       // 数组名即首元素地址
q + 1;              // 移动一个 int 的距离（4字节）

// 空指针
int* n = nullptr;   // C++11 起用 nullptr 代替 NULL</code></pre>
    <h3>6.2 动态内存</h3>
    <span class="code-lang">C++</span>
    <pre><code>int* arr = new int[100];   // 堆上分配
delete[] arr;              // 必须释放，否则内存泄漏

// 现代 C++ 推荐智能指针（自动释放）
#include &lt;memory&gt;
auto p1 = make_unique&lt;int&gt;(42);   // 独占所有权
auto p2 = make_shared&lt;int&gt;(42);   // 共享所有权，引用计数</code></pre>
    <div class="warn-box">⚠️ 链表题全是指针操作：定义节点 <code>struct Node { int val; Node* next; };</code>，画图！画图！画图！指针操作顺序错了就是断链/环。</div>
  ` },
  { title: "STL 容器大全（一）", sub: "vector · string · pair · stack · queue", html: `
    <h2>第7章 STL 容器大全（一）</h2>
    <h3>7.1 vector（动态数组，最常用）</h3>
    <span class="code-lang">C++</span>
    <pre><code>vector&lt;int&gt; v;
v.push_back(3);        // 尾部加入 O(1)
v.pop_back();          // 尾部删除
v.size(); v.empty();
v.clear();
v.insert(v.begin()+1, 5);   // 中间插入 O(n)
v.erase(v.begin());         // 删除 O(n)
vector&lt;int&gt; w(n, 0);        // n 个 0
vector&lt;vector&lt;int&gt;&gt; g(n);   // 二维（邻接表）</code></pre>
    <h3>7.2 pair（成对数据）</h3>
    <span class="code-lang">C++</span>
    <pre><code>pair&lt;int,int&gt; p = {1, 2};    // 或 make_pair
p.first; p.second;
// sort pair 默认先比 first 再比 second，非常适合区间排序</code></pre>
    <h3>7.3 stack / queue / priority_queue</h3>
    <span class="code-lang">C++</span>
    <pre><code>stack&lt;int&gt; st;     st.push(1); st.top(); st.pop();   // 栈：DFS、括号匹配
queue&lt;int&gt; q;      q.push(1); q.front(); q.pop();    // 队列：BFS
priority_queue&lt;int&gt; pq;               // 大根堆（默认）
priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq2;  // 小根堆</code></pre>
  ` },
  { title: "STL 容器大全（二）", sub: "set · map · unordered 系列 · 迭代器", html: `
    <h2>第8章 STL 容器大全（二）</h2>
    <h3>8.1 set / multiset（有序集合，红黑树）</h3>
    <span class="code-lang">C++</span>
    <pre><code>set&lt;int&gt; s;
s.insert(3);           // O(log n)，自动去重+排序
s.count(3);            // 是否存在
s.erase(3);
auto it = s.lower_bound(5);   // 第一个 &gt;= 5 的迭代器
// multiset 允许重复元素</code></pre>
    <h3>8.2 map / unordered_map（映射）</h3>
    <span class="code-lang">C++</span>
    <pre><code>map&lt;string,int&gt; m;             // 有序，O(log n)
m["apple"] = 3;                // 不存在则自动创建为 0
m.count("apple");
unordered_map&lt;string,int&gt; um;  // 哈希表，平均 O(1)
// 遍历
for (auto&amp; [k, v] : m) cout &lt;&lt; k &lt;&lt; " " &lt;&lt; v;   // C++17 结构化绑定</code></pre>
    <div class="tip-box">💡 选型：需要有序/前驱后继 → map；只查是否存在 → unordered_map（更快）；计数器 → <code>unordered_map&lt;K,int&gt;</code> 一把梭。</div>
    <h3>8.3 算法函数头文件 algorithm</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;algorithm&gt;
sort(v.begin(), v.end());                    // 排序 O(n log n)
sort(v.begin(), v.end(), greater&lt;int&gt;());    // 降序
max(a,b); min(a,b); swap(a,b);
reverse(v.begin(), v.end());
lower_bound / upper_bound;                   // 二分（必须有序！）
accumulate(v.begin(), v.end(), 0LL);         // 求和
max_element(v.begin(), v.end());             // 最大值迭代器
unique(v.begin(), v.end());                  // 相邻去重</code></pre>
  ` },
  { title: "面向对象：类与封装", sub: "class · 构造函数 · this · static", html: `
    <h2>第9章 面向对象：类与封装</h2>
    <h3>9.1 类的定义</h3>
    <span class="code-lang">C++</span>
    <pre><code>class Student {
private:                    // 私有：外部不可访问
    string name; int age;
public:                     // 公有：对外接口
    Student(string n, int a) : name(n), age(a) {}   // 构造函数+初始化列表
    void show() { cout &lt;&lt; name &lt;&lt; " " &lt;&lt; age; }
    string getName() const { return name; }          // const 成员函数不改成员
};
Student s("Tom", 18);</code></pre>
    <h3>9.2 三大特性</h3>
    <ul>
      <li><strong>封装</strong>：private 隐藏数据，public 暴露接口</li>
      <li><strong>继承</strong>：<code>class A : public B</code>，复用父类</li>
      <li><strong>多态</strong>：虚函数 <code>virtual</code>，运行时决定调用谁</li>
    </ul>
    <span class="code-lang">C++</span>
    <pre><code>class Shape { public: virtual double area() = 0; };  // 纯虚函数=抽象类
class Circle : public Shape {
    double r;
public: Circle(double r) : r(r) {}
    double area() override { return 3.14 * r * r; }  // override 确保重写
};</code></pre>
    <div class="tip-box">💡 有虚函数的类，析构函数必须也是 <code>virtual</code>，否则通过父类指针 delete 会泄漏。</div>
  ` },
  { title: "模板与泛型编程", sub: "函数模板 · 类模板 · auto/lambda", html: `
    <h2>第10章 模板与泛型编程</h2>
    <h3>10.1 函数模板</h3>
    <span class="code-lang">C++</span>
    <pre><code>template &lt;typename T&gt;
T myMax(T a, T b) { return a &gt; b ? a : b; }
myMax(3, 5);          // T 推导为 int
myMax(1.5, 2.5);      // T 推导为 double</code></pre>
    <h3>10.2 类模板</h3>
    <span class="code-lang">C++</span>
    <pre><code>template &lt;class T&gt;
class Stack {
    vector&lt;T&gt; data;
public:
    void push(T x) { data.push_back(x); }
    T pop() { T t = data.back(); data.pop_back(); return t; }
};</code></pre>
    <h3>10.3 lambda 表达式（C++11，竞赛神器）</h3>
    <span class="code-lang">C++</span>
    <pre><code>auto cmp = [](int a, int b) { return a &gt; b; };
sort(v.begin(), v.end(), cmp);

// 捕获外部变量：[=] 按值, [&amp;] 按引用
int k = 3;
auto addK = [&amp;k](int x) { return x + k; };

// 自定义比较结构体（pair 按第二维排序）
sort(v.begin(), v.end(), [](auto&amp; a, auto&amp; b){ return a.second &lt; b.second; });</code></pre>
  ` },
  { title: "C++11~17 现代特性速览", sub: "auto · 范围for · 移动语义 · 结构化绑定", html: `
    <h2>第11章 C++11~17 现代特性速览</h2>
    <span class="code-lang">C++</span>
    <pre><code>// C++11
auto x = 10;                       // 类型推导
for (int v : vec) {}               // 范围 for
nullptr;                           // 空指针
unordered_map&lt;int,int&gt;;            // 哈希容器
to_string(42); stoi("42");         // 数字字符串互转
vector&lt;int&gt; v = {1,2,3};           // 统一初始化列表

// C++14：泛型 lambda
auto add = [](auto a, auto b) { return a + b; };

// C++17
auto [a, b] = pair;                // 结构化绑定
if (int x = f(); x &gt; 0) {}         // if 初始化</code></pre>
    <div class="tip-box">💡 移动语义 <code>std::move</code>：把对象"搬"走而不是拷贝，大对象传参性能关键。理解即可，竞赛用 <code>&amp;</code> 引用足够。</div>
  ` },
  { title: "输入输出与竞赛模板", sub: "cin/cout · scanf · 文件IO · 万能头", html: `
    <h2>第12章 输入输出与竞赛模板</h2>
    <h3>12.1 读取输入的常见套路</h3>
    <span class="code-lang">C++</span>
    <pre><code>// 1. 先给 n，再读 n 个数
int n; cin &gt;&gt; n;
vector&lt;int&gt; a(n); for (auto&amp; x : a) cin &gt;&gt; x;

// 2. 不定行输入直到 EOF
int x; while (cin &gt;&gt; x) { ... }

// 3. 读整行（含空格）
string line; getline(cin, line);

// 4. 混用 cin 和 getline 前要清缓冲：cin.ignore();</code></pre>
    <h3>12.2 竞赛万能开头模板</h3>
    <span class="code-lang">C++</span>
    <pre><code>#include &lt;bits/stdc++.h&gt;      // GCC 万能头（MSVC 不支持）
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // 你的代码
    return 0;
}</code></pre>
    <div class="tip-box">💡 多组测试数据格式：<code>while (cin &gt;&gt; n &amp;&amp; n) {...}</code> 或 <code>while (T--) {...}</code>。输出浮点保留两位：<code>printf("%.2f", x)</code> 或 <code>cout &lt;&lt; fixed &lt;&lt; setprecision(2) &lt;&lt; x;</code></div>
  ` }
]},

python: {
  name: "Python 从零到精通",
  cls: "lang-python",
  icon: "🐍",
  desc: "语法核心、数据结构、函数式、面向对象、常用库，共 12 章",
  lessons: [
  { title: "Python 入门", sub: "安装 · 解释器 · 第一个程序", html: `
    <h2>第1章 Python 入门</h2>
    <h3>1.1 认识 Python</h3>
    <p>Python 是解释型语言，一行行执行，不用编译。语法接近自然语言，是<strong>算法入门最友好的语言</strong>，也是 AI/数据分析领域的主力语言。</p>
    <h3>1.2 运行方式</h3>
    <ul>
      <li>交互模式：终端输入 <code>python</code> 直接敲代码，即时看到结果</li>
      <li>脚本模式：<code>python main.py</code></li>
      <li>在线：LeetCode / 洛谷 / 菜鸟教程在线运行</li>
    </ul>
    <h3>1.3 第一个程序</h3>
    <span class="code-lang">Python</span>
    <pre><code>print("Hello, AlgoMaster!")   # 输出
name = input("你的名字：")          # input 返回字符串
print(f"你好, {name}!")             # f-string 格式化</code></pre>
    <div class="tip-box">💡 Python 没有 <code>{}</code>，用<strong>缩进（4空格）</strong>表示代码块，缩进错误是最常见报错。</div>
  ` },
  { title: "变量与基本类型", sub: "int/float/str/bool · 类型转换 · f-string", html: `
    <h2>第2章 变量与基本类型</h2>
    <h3>2.1 动态类型</h3>
    <span class="code-lang">Python</span>
    <pre><code>x = 10          # int
x = 3.14        # float（可以随时换类型）
s = "abc"       # str
ok = True       # bool
big = 2 ** 100  # int 任意精度！永远不溢出（算法题巨大优势）</code></pre>
    <h3>2.2 类型转换与运算</h3>
    <span class="code-lang">Python</span>
    <pre><code>int("42"); float("3.14"); str(42)
7 / 2      # 3.5 真除法，永远是 float
7 // 2     # 3   整除（向下取整：-7//2 == -4，注意！）
7 % 2      # 1   取模
2 ** 10    # 1024 幂</code></pre>
    <div class="warn-box">⚠️ Python 的 <code>//</code> 和 <code>%</code> 对负数是<strong>向下取整</strong>，和 C++ 的向零取整不同！<code>-7 // 2 == -4</code>，做二分/取模题要留心。</div>
    <h3>2.3 f-string 格式化</h3>
    <span class="code-lang">Python</span>
    <pre><code>x = 3.14159
print(f"{x:.2f}")     # 保留两位: 3.14
print(f"{x=}")        # 调试神器：打印变量名和值</code></pre>
  ` },
  { title: "字符串操作大全", sub: "切片 · 常用方法 · 不可变性", html: `
    <h2>第3章 字符串操作大全</h2>
    <h3>3.1 切片（Python 最强特性之一）</h3>
    <span class="code-lang">Python</span>
    <pre><code>s = "algorithm"
s[0]        # 'a'
s[-1]       # 'm'  负索引从后往前
s[1:4]      # 'lgo'  左闭右开
s[:3]       # 'alg'
s[::2]      # 'agrtm'  步长2
s[::-1]     # 'mhtirogla'  反转！</code></pre>
    <h3>3.2 常用方法</h3>
    <span class="code-lang">Python</span>
    <pre><code>s.strip()          # 去两端空白
s.split(",")        # 按逗号分割成列表
",".join(["a","b"]) # 列表拼接成字符串
s.replace("a","b")
s.find("go")        # 下标，找不到返回 -1
s.count("a")        # 计数
s.upper(); s.lower()
s.isdigit(); s.isalpha()
ord('a'); chr(97)   # 字符与 ASCII 互转</code></pre>
    <div class="tip-box">💡 字符串<strong>不可变</strong>：<code>s[0]='x'</code> 会报错。大量拼接用 <code>"".join(list)</code>，不要用 <code>+</code> 循环拼（O(n²)）。</div>
  ` },
  { title: "列表、元组与切片", sub: "list · tuple · 推导式", html: `
    <h2>第4章 列表、元组与切片</h2>
    <h3>4.1 list（最常用容器）</h3>
    <span class="code-lang">Python</span>
    <pre><code>a = [3, 1, 2]
a.append(4)         # 尾加 O(1)
a.pop()             # 尾删
a.insert(0, 9)      # 任意位置插入 O(n)
a.remove(2)         # 按值删除第一个匹配
a.sort()            # 原地排序（reverse=True 降序）
sorted(a)           # 返回新列表
a.reverse()
len(a); sum(a); max(a); min(a)
b = [0] * 10        # 10 个 0
grid = [[0]*5 for _ in range(3)]   # 3x5 二维（勿用 [[0]*5]*3！）</code></pre>
    <div class="warn-box">⚠️ <code>[[0]*5]*3</code> 三个行是<strong>同一个引用</strong>，改一行全变。二维列表必须用推导式。</div>
    <h3>4.2 tuple（不可变）</h3>
    <span class="code-lang">Python</span>
    <pre><code>p = (1, 2)          # 可作为 dict 的 key、可哈希
x, y = p            # 解包
a, b = b, a         # Python 交换变量不用临时变量！</code></pre>
    <h3>4.3 推导式（Pythonic 核心）</h3>
    <span class="code-lang">Python</span>
    <pre><code>squares = [x*x for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
matrix_t = [[row[i] for row in matrix] for i in range(len(matrix[0]))]  # 转置
d = {x: x*x for x in range(5)}      # 字典推导式</code></pre>
  ` },
  { title: "字典与集合", sub: "dict · set · 计数器套路", html: `
    <h2>第5章 字典与集合</h2>
    <h3>5.1 dict（哈希表，O(1) 查找）</h3>
    <span class="code-lang">Python</span>
    <pre><code>d = {"apple": 3, "banana": 5}
d["cherry"] = 2         # 增
d.get("pear", 0)        # 安全取值，不存在返回默认 0
del d["apple"]
for k, v in d.items(): ...
d.keys(); d.values()
d = {x: 0 for x in range(10)}   # 初始化</code></pre>
    <h3>5.2 set（去重 + 集合运算）</h3>
    <span class="code-lang">Python</span>
    <pre><code>s = {1, 2, 3}
s.add(4); s.discard(9)   # discard 不存在不报错
a &amp; b; a | b; a - b      # 交 / 并 / 差
len(set(nums)) == len(nums)   # 判断是否有重复</code></pre>
    <h3>5.3 算法题计数器套路</h3>
    <span class="code-lang">Python</span>
    <pre><code>from collections import Counter, defaultdict
cnt = Counter("aabbc")       # {'a':2,'b':2,'c':1}
cnt.most_common(1)           # 出现最多的
d = defaultdict(list)
d[key].append(x)             # key 不存在自动建空列表（建图神器）</code></pre>
  ` },
  { title: "控制流与循环", sub: "if/elif/else · for/while · enumerate/zip", html: `
    <h2>第6章 控制流与循环</h2>
    <span class="code-lang">Python</span>
    <pre><code># 分支
if score &gt;= 90:
    print("A")
elif score &gt;= 60:
    print("B")
else:
    print("C")

# Python 有三元和 switch 替代
grade = "A" if score &gt;= 90 else "B"
match cmd:                    # Python 3.10+ 结构匹配
    case "start": ...
    case _: ...

# 循环
for i in range(10): ...                # 0~9
for i in range(1, 10, 2): ...          # 1,3,5,7,9
for i, x in enumerate(a): ...          # 带下标遍历
for x, y in zip(a, b): ...             # 同步遍历两个列表

while n &gt; 0: n //= 10
else: ...       # 循环正常结束（没 break）才执行，少用</code></pre>
    <div class="tip-box">💡 遍历列表时不要边遍历边增删元素，会跳过元素。需要删除时用列表推导式或倒序遍历。</div>
  ` },
  { title: "函数与作用域", sub: "定义 · 默认参数 · *args/**kwargs · lambda", html: `
    <h2>第7章 函数与作用域</h2>
    <span class="code-lang">Python</span>
    <pre><code>def add(a, b=10):          # 默认参数
    return a + b

def f(*args, **kwargs):    # 任意个位置参数 / 关键字参数
    print(args, kwargs)

# 多返回值（其实是返回元组）
def divmod2(a, b): return a // b, a % b
q, r = divmod2(17, 5)

# lambda / 匿名函数：常用于排序 key
students.sort(key=lambda s: (-s.score, s.name))   # 先分数降序，再名字升序</code></pre>
    <h3>递归</h3>
    <span class="code-lang">Python</span>
    <pre><code>import sys
sys.setrecursionlimit(100000)   # 默认递归深度只有 1000，刷题必加！

def fact(n):
    return 1 if n &lt;= 1 else n * fact(n - 1)</code></pre>
    <div class="warn-box">⚠️ 默认参数不要用可变对象：<code>def f(x, lst=[])</code> 的 lst 会在多次调用间共享！应写 <code>lst=None</code> 再在函数内 <code>if lst is None: lst=[]</code>。</div>
    <h3>递归优化：记忆化装饰器</h3>
    <span class="code-lang">Python</span>
    <pre><code>from functools import lru_cache

@lru_cache(maxsize=None)     # 或 Python3.9+ @cache
def fib(n):
    return n if n &lt; 2 else fib(n-1) + fib(n-2)
# O(2^n) 直接变 O(n)</code></pre>
  ` },
  { title: "面向对象基础", sub: "class · __init__ · 继承 · 魔法方法", html: `
    <h2>第8章 面向对象基础</h2>
    <span class="code-lang">Python</span>
    <pre><code>class Node:
    def __init__(self, val):      # 构造函数
        self.val = val
        self.next = None

    def __repr__(self):           # 打印时的表现
        return f"Node({self.val})"

    def __lt__(self, other):      # 定义 &lt; 使其可被堆排序
        return self.val &lt; other.val

class Stack(Node):                # 继承
    def push(self, x): ...        # super().xxx() 调父类</code></pre>
    <h3>常用魔法方法</h3>
    <ul>
      <li><code>__len__</code>：支持 len()</li>
      <li><code>__eq__</code>：支持 ==</li>
      <li><code>__getitem__</code>：支持下标访问</li>
      <li><code>__hash__</code>：可作为 set/dict key</li>
    </ul>
    <span class="code-lang">Python</span>
    <pre><code>@dataclass                   # Python 3.7+，自动生成 __init__ 等
class Point:
    x: int
    y: int</code></pre>
  ` },
  { title: "模块、包与常用标准库", sub: "import · math · collections · heapq · itertools", html: `
    <h2>第9章 模块、包与常用标准库</h2>
    <span class="code-lang">Python</span>
    <pre><code>import math
math.gcd(12, 18)     # 最大公约数 6（3.9+ 支持多参数）
math.lcm(4, 6)       # 最小公倍数
math.sqrt(2); math.ceil(2.1); math.floor(2.9)
math.inf             # 正无穷

from collections import deque, Counter, defaultdict
q = deque([1,2,3])
q.appendleft(0); q.popleft()    # 双端队列 O(1)，滑动窗口必备

import heapq
h = []
heapq.heappush(h, 3)        # 小根堆
heapq.heappop(h)
heapq.heappush(h, -x)       # 大根堆技巧：存负数

import itertools
itertools.permutations([1,2,3])   # 全排列
itertools.combinations(a, 2)      # 组合
itertools.accumulate(a)           # 前缀和

import bisect
bisect.bisect_left(a, x)    # 二分查找第一个 &gt;= x 的位置（手写二分的平替）
bisect.insort(a, x)         # 有序插入</code></pre>
  ` },
  { title: "异常处理与文件操作", sub: "try/except · with open · JSON", html: `
    <h2>第10章 异常处理与文件操作</h2>
    <h3>10.1 异常</h3>
    <span class="code-lang">Python</span>
    <pre><code>try:
    x = int(input())
    r = 10 / x
except ValueError:
    print("不是数字")
except ZeroDivisionError:
    print("除零")
else:
    print("成功:", r)      # 无异常时执行
finally:
    print("总会执行")       # 释放资源</code></pre>
    <h3>10.2 文件</h3>
    <span class="code-lang">Python</span>
    <pre><code>with open("data.txt", "r", encoding="utf-8") as f:   # with 自动关闭
    for line in f:                    # 逐行读（大文件友好）
        line = line.strip()
    content = f.read()                # 或一次读完

with open("out.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")

import json
data = json.loads('{"a": 1}')    # 字符串 -> 字典
json.dumps({"a": 1}, ensure_ascii=False)  # 字典 -> 字符串</code></pre>
  ` },
  { title: "Python 算法竞赛模板", sub: "快速IO · 常用模板 · 骚操作", html: `
    <h2>第11章 Python 算法竞赛模板</h2>
    <h3>11.1 快速输入</h3>
    <span class="code-lang">Python</span>
    <pre><code>import sys
input = sys.stdin.readline     # cin 加速，比赛前两行先写上
n = int(input())
a = list(map(int, input().split()))</code></pre>
    <h3>11.2 常见套路</h3>
    <span class="code-lang">Python</span>
    <pre><code># 一行读入所有数
data = list(map(int, sys.stdin.read().split()))

# 多维数组初始化
dp = [[0] * m for _ in range(n)]

# 数字与字符
ord('a')          # 97
chr(65)           # 'A'

# 大整数：随便乘，不溢出
print(math.factorial(100))</code></pre>
    <div class="tip-box">💡 Python 慢是事实，但 <strong>O(n log n) 以内 n ≤ 10^6 的题基本都能过</strong>。卡常时：减少循环内属性查找、用局部变量、用推导式替代 for、必要时考虑 PyPy。</div>
    <h3>11.3 迭代器与生成器（节省内存）</h3>
    <span class="code-lang">Python</span>
    <pre><code>def gen():
    yield 1
    yield 2
for x in gen(): ...    # 惰性求值，处理大数据流</code></pre>
  ` },
  { title: "Python 与数据科学/爬虫入门", sub: "numpy · requests 简要预览", html: `
    <h2>第12章 Python 生态预览</h2>
    <h3>12.1 numpy（科学计算）</h3>
    <span class="code-lang">Python</span>
    <pre><code>import numpy as np
a = np.array([1,2,3])
b = a * 2                  # 向量化运算，比 for 快百倍
m = np.zeros((3,3), dtype=int)
m.T                        # 转置</code></pre>
    <h3>12.2 requests（HTTP/爬虫入门）</h3>
    <span class="code-lang">Python</span>
    <pre><code>import requests
r = requests.get("https://api.example.com/data", timeout=5)
r.status_code, r.json()</code></pre>
    <div class="tip-box">💡 学完本课程，建议方向：算法岗继续刷题 → 数据分析学 pandas → AI 学 PyTorch。Python 是最好的"胶水语言"。</div>
  ` }
]},

java: {
  name: "Java 从零到精通",
  cls: "lang-java",
  icon: "☕",
  desc: "语法核心、面向对象、集合框架、泛型与并发入门，共 12 章",
  lessons: [
  { title: "Java 入门与开发环境", sub: "JVM/JDK/JRE · 编译运行 · 第一个程序", html: `
    <h2>第1章 Java 入门</h2>
    <h3>1.1 三件套概念（面试必问）</h3>
    <ul>
      <li><strong>JDK</strong>：开发工具包（含编译器 javac、调试器等）</li>
      <li><strong>JRE</strong>：运行环境（含 JVM 和核心类库）</li>
      <li><strong>JVM</strong>：虚拟机，让 Java "一次编写，到处运行"</li>
    </ul>
    <h3>1.2 编译运行</h3>
    <span class="code-lang">bash</span>
    <pre><code>javac Main.java   # 生成 Main.class 字节码
java Main         # JVM 执行</code></pre>
    <h3>1.3 第一个程序</h3>
    <span class="code-lang">Java</span>
    <pre><code>public class Main {           // 文件名必须和公共类名一致！
    public static void main(String[] args) {   // 入口固定写法
        System.out.println("Hello, AlgoMaster!");
    }
}</code></pre>
    <div class="tip-box">💡 Java 一切代码都在<strong>类里</strong>，方法必须属于某个类。IDE 推荐 IntelliJ IDEA，刷题可直接用 LeetCode/牛客的在线编辑器。</div>
  ` },
  { title: "数据类型与运算", sub: "八大基本类型 · 包装类 · 字符串", html: `
    <h2>第2章 数据类型与运算</h2>
    <h3>2.1 八大基本类型</h3>
    <table style="width:100%;font-size:13px;color:#c9cfdd;border-collapse:collapse">
      <tr style="color:#6c8cff"><th>类型</th><th>字节</th><th>说明</th></tr>
      <tr><td>byte / short</td><td>1 / 2</td><td>少见</td></tr>
      <tr><td>int</td><td>4</td><td>±21 亿</td></tr>
      <tr><td>long</td><td>8</td><td>赋值要加 L：long x = 1L;</td></tr>
      <tr><td>float / double</td><td>4 / 8</td><td>float 要加 F</td></tr>
      <tr><td>char</td><td>2</td><td>Unicode，两个字节</td></tr>
      <tr><td>boolean</td><td>-</td><td>true/false</td></tr>
    </table>
    <h3>2.2 包装类与自动装箱</h3>
    <span class="code-lang">Java</span>
    <pre><code>Integer a = 127, b = 127;
a == b;              // true（缓存池 -128~127）
Integer c = 128, d = 128;
c == d;              // false！超出缓存，是不同对象
// 结论：包装类比较一律用 equals 或先拆箱</code></pre>
    <h3>2.3 字符串</h3>
    <span class="code-lang">Java</span>
    <pre><code>String s = "hello";
s.length(); s.charAt(0); s.substring(1,3);
s.equals("hello");        // 比较内容（== 比较的是引用！）
s.indexOf("ll"); s.contains("el");
Integer.parseInt("42"); String.valueOf(42);

// 大量拼接用 StringBuilder（String 不可变，+ 拼接 O(n²)）
StringBuilder sb = new StringBuilder();
sb.append("a").append(1);
String r = sb.toString(); sb.reverse();</code></pre>
  ` },
  { title: "控制流与数组", sub: "分支循环 · 数组定义 · Arrays 工具类", html: `
    <h2>第3章 控制流与数组</h2>
    <span class="code-lang">Java</span>
    <pre><code>// 循环与 C++ 一致，另有增强 for
for (int x : arr) System.out.println(x);
for (int i = 0; i &lt; n; i++) { ... }

// 数组
int[] a = new int[10];           // 默认全 0
int[] b = {1, 2, 3};
int[][] grid = new int[3][4];

// Arrays 工具类（刷题常备）
import java.util.*;
Arrays.sort(a);                          // 排序
Arrays.fill(a, -1);                      // 填充
Arrays.copyOf(a, 20);                    // 扩容拷贝
Arrays.toString(a);                      // 打印用
List&lt;Integer&gt; list = Arrays.asList(1,2,3);</code></pre>
    <div class="warn-box">⚠️ Java 整型溢出同样存在，数据范围大时用 <code>long</code>。数组排序去重：<code>TreeSet&lt;Integer&gt;</code> 最方便。</div>
  ` },
  { title: "面向对象三大特性", sub: "封装继承多态 · 接口 · 抽象类", html: `
    <h2>第4章 面向对象三大特性</h2>
    <span class="code-lang">Java</span>
    <pre><code>class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void makeSound() { System.out.println("..."); }
}

class Dog extends Animal {              // 继承
    public Dog(String name) { super(name); }
    @Override                            // 重写注解，写上编译器帮你检查
    public void makeSound() { System.out.println("汪汪"); }
}

Animal a = new Dog("旺财");
a.makeSound();         // 输出"汪汪" —— 多态！</code></pre>
    <h3>接口与抽象类</h3>
    <span class="code-lang">Java</span>
    <pre><code>interface Comparable2 { int compareTo(Object o); }  // 示意
abstract class Shape {
    abstract double area();          // 抽象方法无方法体
}
// 类只能单继承 extends，但可以实现多个 implements 接口</code></pre>
    <div class="tip-box">💡 面试高频："接口 vs 抽象类"——接口是"能做什么"（规范），抽象类是"是什么"（模板复用）。</div>
  ` },
  { title: "集合框架（一）", sub: "List · ArrayList · LinkedList", html: `
    <h2>第5章 集合框架（一）：List</h2>
    <span class="code-lang">Java</span>
    <pre><code>import java.util.*;

List&lt;Integer&gt; list = new ArrayList&lt;&gt;();   // 动态数组，查快
list.add(1); list.add(0, 5);
list.get(0); list.set(0, 9);
list.remove(Integer.valueOf(1));   // 按对象删（传 int 会按索引删！）
list.size(); list.contains(3);

List&lt;Integer&gt; linked = new LinkedList&lt;&gt;(); // 双向链表，增删头尾快
linked.addFirst(1); linked.removeLast();

// 遍历
for (int x : list) { ... }
for (int i = 0; i &lt; list.size(); i++) { ... }
Iterator&lt;Integer&gt; it = list.iterator();   // 遍历中删除元素用迭代器</code></pre>
    <div class="warn-box">⚠️ <code>remove(int)</code> 按索引删、<code>remove(Integer)</code> 按对象删，易踩坑。遍历中直接 <code>list.remove</code> 会 ConcurrentModificationException，用 <code>Iterator.remove()</code>。</div>
  ` },
  { title: "集合框架（二）", sub: "Map · Set · HashMap 原理", html: `
    <h2>第6章 集合框架（二）：Map 与 Set</h2>
    <span class="code-lang">Java</span>
    <pre><code>Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
map.put("a", 1);
map.get("a");                  // 不存在返回 null
map.getOrDefault("b", 0);      // 安全取值
map.containsKey("a");
for (Map.Entry&lt;String,Integer&gt; e : map.entrySet()) {
    e.getKey(); e.getValue();
}

// 刷题计数套路
map.merge(ch, 1, Integer::sum);     // 计数一行搞定

Set&lt;Integer&gt; set = new HashSet&lt;&gt;();   // 去重
set.add(1); set.contains(1);

TreeMap&lt;Integer,Integer&gt; tm = new TreeMap&lt;&gt;();   // 有序
tm.firstKey(); tm.floorKey(x); tm.ceilingKey(x); // 前驱后继</code></pre>
    <div class="tip-box">💡 HashMap 原理（面试必背）：数组+链表+红黑树。put 时对 key 求哈希定位桶；冲突挂链表，链表长度 ≥8 转红黑树；负载因子 0.75 触发扩容翻倍。</div>
  ` },
  { title: "泛型与常用语法糖", sub: "泛型类/方法 · 装箱 · var · 增强 switch", html: `
    <h2>第7章 泛型与常用语法糖</h2>
    <span class="code-lang">Java</span>
    <pre><code>// 泛型类
class Box&lt;T&gt; {
    private T data;
    public void set(T d) { data = d; }
    public T get() { return data; }
}
Box&lt;String&gt; b = new Box&lt;&gt;();    // 菱形推断

// 泛型方法
&lt;T extends Comparable&lt;T&gt;&gt; T max(T a, T b) {
    return a.compareTo(b) &gt; 0 ? a : b;
}

// Java 10+ var（局部变量类型推断）
var list = new ArrayList&lt;Integer&gt;();</code></pre>
    <div class="tip-box">💡 泛型是<strong>编译期</strong>检查，运行时会擦除（类型擦除）。<code>List&lt;Integer&gt;</code> 和 <code>List&lt;String&gt;</code> 运行时是同一个 class。</div>
  ` },
  { title: "异常处理", sub: "try/catch/finally · 受检异常 · 自定义异常", html: `
    <h2>第8章 异常处理</h2>
    <span class="code-lang">Java</span>
    <pre><code>try {
    int r = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("除零: " + e.getMessage());
} catch (Exception e) {          // 大异常放后面
    e.printStackTrace();
} finally {
    System.out.println("总会执行");   // 关资源
}

// try-with-resources（Java 7+，自动关闭）
try (var br = new BufferedReader(new FileReader("f.txt"))) {
    br.readLine();
}

// 自定义异常
class MyException extends Exception {
    public MyException(String msg) { super(msg); }
}
throw new MyException("参数非法");</code></pre>
    <div class="tip-box">💡 异常体系：Throwable → Error（严重，别管）+ Exception。Exception 分受检（编译器强制 try）和运行时异常（RuntimeException，如空指针）。</div>
  ` },
  { title: "Lambda 与 Stream API", sub: "函数式接口 · 流式处理 · Optional", html: `
    <h2>第9章 Lambda 与 Stream API</h2>
    <span class="code-lang">Java</span>
    <pre><code>// Lambda：任何"函数式接口"（只有一个抽象方法）都能用
Comparator&lt;Integer&gt; cmp = (a, b) -&gt; b - a;    // 降序
list.sort(cmp);

// Stream：声明式数据处理
List&lt;Integer&gt; nums = List.of(5, 2, 8, 1);
List&lt;Integer&gt; r = nums.stream()
    .filter(n -&gt; n % 2 == 1)      // 筛选
    .map(n -&gt; n * 10)             // 变换
    .sorted()                     // 排序
    .collect(Collectors.toList());

int sum = nums.stream().mapToInt(Integer::intValue).sum();
Optional&lt;Integer&gt; mx = nums.stream().max(Integer::compare);</code></pre>
    <div class="tip-box">💡 方法引用：<code>Integer::parseInt</code> 等价 <code>x -&gt; Integer.parseInt(x)</code>。Stream 是惰性求值，终端操作（collect/sum/forEach）才触发执行。</div>
  ` },
  { title: "Java 算法竞赛模板", sub: "快速IO · Scanner替代 · 常用容器速查", html: `
    <h2>第10章 Java 算法竞赛模板</h2>
    <h3>10.1 快速 IO（Scanner 很慢！）</h3>
    <span class="code-lang">Java</span>
    <pre><code>import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine());
        int[] a = new int[n];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i &lt; n; i++) a[i] = Integer.parseInt(st.nextToken());

        StringBuilder sb = new StringBuilder();   // 输出也用 sb，别用 println
        sb.append("ans");
        System.out.print(sb);
    }
}</code></pre>
    <h3>10.2 常用结构速查</h3>
    <span class="code-lang">Java</span>
    <pre><code>Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;();  // 栈
Queue&lt;Integer&gt; queue = new ArrayDeque&lt;&gt;();  // 队列
PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;&gt;();            // 小根堆
PriorityQueue&lt;Integer&gt; big = new PriorityQueue&lt;&gt;((x,y)-&gt;y-x); // 大根堆
TreeSet&lt;Integer&gt; ts = new TreeSet&lt;&gt;();    // 有序去重，floor/ceiling</code></pre>
  ` },
  { title: "多线程与并发入门", sub: "Thread · synchronized · 线程池", html: `
    <h2>第11章 多线程与并发入门</h2>
    <span class="code-lang">Java</span>
    <pre><code>// 方式一：继承 Thread
class MyThread extends Thread {
    public void run() { System.out.println("running"); }
}
new MyThread().start();       // 别调 run()，要调 start()！

// 方式二：实现 Runnable（推荐，不影响继承）
Thread t = new Thread(() -&gt; System.out.println("running"));
t.start(); t.join();          // 等待结束

// 线程安全：synchronized
synchronized (lock) { count++; }

// 线程池
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -&gt; doWork());
pool.shutdown();</code></pre>
    <div class="warn-box">⚠️ 面试高频：synchronized 与 Lock 区别、volatile 保证可见性不保证原子性、线程池参数（核心数/最大数/队列/拒绝策略）。</div>
  ` },
  { title: "Java 学习路线与面试地图", sub: "JVM 入门 · 学习路线 · 八股预览", html: `
    <h2>第12章 Java 学习路线</h2>
    <h3>进阶方向</h3>
    <ul>
      <li><strong>JVM</strong>：内存区域（堆/栈/方法区）、垃圾回收（GC 算法、分代回收）</li>
      <li><strong>并发深入</strong>：JUC 包、AQS、ConcurrentHashMap</li>
      <li><strong>框架</strong>：Spring / Spring Boot / MyBatis（后端就业必备）</li>
      <li><strong>数据库</strong>：MySQL + Redis</li>
    </ul>
    <h3>面试八股高频预览</h3>
    <ul>
      <li>HashMap 扩容机制 / 为什么线程不安全</li>
      <li>synchronized 锁升级过程</li>
      <li>JVM 内存模型与 GC roots</li>
      <li>== 与 equals 与 hashCode 的关系</li>
    </ul>
    <div class="tip-box">💡 刷算法用 Java 完全可行（LeetCode 时空限制对 Java 放宽）。竞赛模板固定后，语言不是瓶颈，思维才是。</div>
  ` }
]},

c: {
  name: "C 语言从零到精通",
  cls: "lang-c",
  icon: "⬜",
  desc: "语法核心、指针精通、内存管理、数据结构实现，共 12 章",
  lessons: [
  { title: "C 语言入门", sub: "gcc · 编译运行 · Hello World", html: `
    <h2>第1章 C 语言入门</h2>
    <p>C 语言诞生于 1972 年，是最接近底层的高级语言。操作系统、嵌入式、单片机都靠它。学 C 能真正理解<strong>内存</strong>是什么。</p>
    <span class="code-lang">bash</span>
    <pre><code>gcc main.c -o main    # 编译
./main</code></pre>
    <span class="code-lang">C</span>
    <pre><code>#include &lt;stdio.h&gt;       // 标准输入输出

int main(void) {
    printf("Hello, AlgoMaster!\\n");   // \n 换行
    return 0;
}</code></pre>
    <div class="tip-box">💡 C 语言<strong>没有面向对象、没有容器库</strong>，所有数据结构都要自己造——这是苦，也是理解算法的最好途径。</div>
  ` },
  { title: "基本类型与运算", sub: "int/float/char · sizeof · 类型转换", html: `
    <h2>第2章 基本类型与运算</h2>
    <span class="code-lang">C</span>
    <pre><code>int a = 10;            // 4字节
long long b = 1e18;    // 8字节，后缀 LL
float f = 3.14f;
double d = 3.14;
char c = 'A';          // 单引号是字符
unsigned int u = 4000000000u;   // 无符号

sizeof(int);           // 求字节数
printf("%d %lld %f %c %s", a, b, d, c, "str");   // 格式化输出
scanf("%d", &amp;a);       // 必须取地址 &amp;a！

// 运算符与 C++ 基本一致：整数除法向零取整
-7 / 2;      // -3
-7 % 2;      // -1</code></pre>
    <div class="warn-box">⚠️ <code>scanf</code> 忘写 <code>&amp;</code> 是新手第一大坑！另外 int 溢出：给 int 赋超过 21 亿的数会溢出变负数。</div>
  ` },
  { title: "控制流", sub: "if/switch · for/while · goto", html: `
    <h2>第3章 控制流</h2>
    <span class="code-lang">C</span>
    <pre><code>if (a &gt; 0) { ... } else if (a == 0) { ... } else { ... }

switch (x) {
    case 1: ...; break;
    default: ...;
}

for (int i = 0; i &lt; n; i++) { ... }   // C99 起可在 for 里定义变量
while (n--) { ... }
do { ... } while (cond);

// 常用：判断字符
if (c &gt;= '0' &amp;&amp; c &lt;= '9') ...   // 数字字符
if (c &gt;= 'a' &amp;&amp; c &lt;= 'z') ...   // 小写字母</code></pre>
  ` },
  { title: "数组与字符串", sub: "数组定义 · 字符数组 · 常用字符串函数", html: `
    <h2>第4章 数组与字符串</h2>
    <span class="code-lang">C</span>
    <pre><code>int a[10] = {0};            // 清零
int b[3][4] = {{1,2,3,4},{5,6,7,8},{9,10,11,12}};
// 二维数组按行优先存储，a[i][j] 地址 = 首地址 + (i*4+j)*4

// C 的字符串 = 字符数组 + '\\0' 结尾
char s[100] = "hello";
s[0] = 'H';
char t[] = "world";

// string.h 常用函数
strlen(s);                          // 长度（不含 '\\0'）
strcpy(dst, src); strncpy(dst, src, n);
strcmp(s1, s2);                     // 0相等，&lt;0 小，&gt;0 大
strcat(s1, s2);                     // 拼接
memset(a, 0, sizeof(a));            // 清零神器
memcpy(dst, src, n * sizeof(int));  // 拷贝</code></pre>
    <div class="tip-box">💡 竞赛输入：<code>scanf("%d", &amp;n)</code>；读一行带空格：<code>fgets(s, 100, stdin)</code>（会把换行读进去，需手动去）。<code>gets</code> 危险已废弃。</div>
  ` },
  { title: "函数与递归", sub: "传值/传指针 · 递归 · static", html: `
    <h2>第5章 函数与递归</h2>
    <span class="code-lang">C</span>
    <pre><code>// C 只有传值！想修改外部变量必须传指针
void swap(int* x, int* y) {
    int t = *x; *x = *y; *y = t;
}
int a = 1, b = 2;
swap(&amp;a, &amp;b);

// 数组传参退化为指针，长度需额外传
int sum(int arr[], int n) {
    int s = 0;
    for (int i = 0; i &lt; n; i++) s += arr[i];
    return s;
}

// static 局部变量：函数退出后值保留
void counter() { static int cnt = 0; cnt++; }</code></pre>
    <div class="tip-box">💡 函数声明（原型）要写在调用之前，或放头文件。递归与 C++ 相同，注意栈深度。</div>
  ` },
  { title: "指针精通（上）", sub: "指针与地址 · 指针运算 · 指针与数组", html: `
    <h2>第6章 指针精通（上）</h2>
    <span class="code-lang">C</span>
    <pre><code>int a = 10;
int* p = &amp;a;          // p 存 a 的地址
printf("%d\\n", *p);   // 解引用：10
*p = 20;

// 指针运算
int arr[5] = {1,2,3,4,5};
int* q = arr;          // 首元素地址
*(q + 2);              // 3 —— q+2 移动 2 个 int
// arr[i] 本质就是 *(arr + i)！

// 二级指针
int** pp = &amp;p;         // 指向指针的指针（链表插入删除常伴）

// void* 万能指针
void* v = &amp;a;
int n = *(int*)v;      // 使用前强制转换</code></pre>
    <div class="tip-box">💡 记住三句话：指针存<strong>地址</strong>；<code>*</code> 是<strong>顺藤摸瓜</strong>取内容；<code>&amp;</code> 是<strong>查户口</strong>拿地址。画内存图是最好的学习方法。</div>
  ` },
  { title: "指针精通（下）与动态内存", sub: "malloc/free · 野指针 · 动态数组", html: `
    <h2>第7章 指针精通（下）与动态内存</h2>
    <span class="code-lang">C</span>
    <pre><code>#include &lt;stdlib.h&gt;

int* arr = (int*)malloc(n * sizeof(int));   // 堆上申请，内容随机
int* arr2 = (int*)calloc(n, sizeof(int));   // 申请并清零
arr = (int*)realloc(arr, 2*n * sizeof(int)); // 扩容
free(arr);                                    // 用完必须释放！

int* p = (int*)malloc(sizeof(int));
*p = 42;
// 野指针三宗罪：
// 1. 用了未初始化的指针
// 2. free 之后继续用（应置 p = NULL）
// 3. 返回局部变量的地址</code></pre>
    <div class="warn-box">⚠️ 内存泄漏 = malloc 了没 free；重复 free 会崩溃。原则：<strong>谁申请谁释放</strong>，free 后立刻置 NULL。</div>
  ` },
  { title: "结构体与 typedef", sub: "struct · 结构体指针 · typedef · 链表节点", html: `
    <h2>第8章 结构体与 typedef</h2>
    <span class="code-lang">C</span>
    <pre><code>// C 没有类，struct 就是它的"对象"
typedef struct {
    char name[20];
    int age;
    double score;
} Student;

Student s = {"Tom", 18, 95.5};
Student* ps = &amp;s;
ps-&gt;age;              // 等价于 (*ps).age，箭头操作符
strcpy(ps-&gt;name, "Jerry");

// 链表节点（手写数据结构的基础）
typedef struct Node {
    int val;
    struct Node* next;      // 必须写 struct，此时 typedef 还没生效
} Node;</code></pre>
    <div class="tip-box">💡 排序结构体数组要自己写比较函数传给 qsort（下一章讲）。竞赛中常用 struct + 数组模拟一切数据结构。</div>
  ` },
  { title: "预处理与多文件", sub: "#define · 头文件 · 条件编译", html: `
    <h2>第9章 预处理与多文件</h2>
    <span class="code-lang">C</span>
    <pre><code>#define N 100000          // 宏常量
#define MAX(a,b) ((a)&gt;(b)?(a):(b))   // 宏函数（必须加括号！）
#define ll long long

#include "mylib.h"         // 双引号找当前目录，尖括号找系统目录

#ifdef DEBUG               // 条件编译
    printf("debug info");
#endif

// 头文件防重复包含
#ifndef MYLIB_H
#define MYLIB_H
// 声明...
#endif</code></pre>
    <div class="warn-box">⚠️ 宏是纯文本替换：<code>#define SQR(x) x*x</code> 调 <code>SQR(1+2)</code> 展开成 <code>1+2*1+2 = 5</code>！每个参数都要加括号。</div>
  ` },
  { title: "C 标准库速查", sub: "stdio/stdlib/string/math/time", html: `
    <h2>第10章 C 标准库速查</h2>
    <span class="code-lang">C</span>
    <pre><code>// stdio.h
printf / scanf / sprintf / sscanf / fgets / fopen / fclose
fprintf(fp, "%d", x);          // 写文件
fscanf(fp, "%d", &amp;x);          // 读文件

// stdlib.h
malloc / calloc / realloc / free
qsort(arr, n, sizeof(int), cmp);   // 快速排序
abs(x); rand(); srand(time(NULL));

// math.h
sqrt(x); pow(x, y); fabs(x); floor(x); ceil(x);

// ctype.h
isdigit(c); isalpha(c); toupper(c); tolower(c);

// qsort 比较函数模板
int cmp(const void* a, const void* b) {
    int x = *(int*)a, y = *(int*)b;
    return (x &gt; y) - (x &lt; y);    // 升序；long long 千万别直接相减会溢出
}</code></pre>
  ` },
  { title: "C 手写数据结构", sub: "链表 · 栈 · 队列 · 顺序表", html: `
    <h2>第11章 C 手写数据结构</h2>
    <h3>链表</h3>
    <span class="code-lang">C</span>
    <pre><code>typedef struct Node { int val; struct Node* next; } Node;

Node* create(int v) {
    Node* n = (Node*)malloc(sizeof(Node));
    n-&gt;val = v; n-&gt;next = NULL;
    return n;
}
// 头插法
n-&gt;next = head; head = n;
// 遍历
for (Node* p = head; p; p = p-&gt;next) printf("%d ", p-&gt;val);
// 释放：逐个 free</code></pre>
    <h3>数组模拟栈与队列（竞赛主流）</h3>
    <span class="code-lang">C</span>
    <pre><code>int stk[N], top = 0;     // 栈
stk[top++] = x;          // push
top--;                   // pop
stk[top-1];              // 栈顶

int q[N], hh = 0, tt = 0;   // 队列
q[tt++] = x;                // push
hh++;                       // pop（不真正删除）</code></pre>
  ` },
  { title: "C 语言学习路线", sub: "进阶方向 · 与操作系统/嵌入式的关系", html: `
    <h2>第12章 C 语言学习路线</h2>
    <h3>进阶方向</h3>
    <ul>
      <li><strong>操作系统</strong>：进程/线程、系统调用、信号 —— C 是 Linux 的母语</li>
      <li><strong>嵌入式</strong>：单片机（STM32）、驱动开发</li>
      <li><strong>底层</strong>：看《C 专家编程》《深入理解计算机系统》（CSAPP）</li>
    </ul>
    <h3>C 系语言的地图</h3>
    <ul>
      <li>C → C++（+面向对象/STL）→ Java/C#（虚拟机）→ Go（云原生）</li>
      <li>语法都是 C 的影子：学会了 C，其他语言学起来快一半</li>
    </ul>
    <div class="tip-box">💡 建议：学 C 的目标不是"会写 C 业务"，而是<strong>建立内存模型</strong>。理解了栈、堆、指针，你才能看懂一切语言的"引用""垃圾回收"到底在干嘛。</div>
  ` }
]}
};
