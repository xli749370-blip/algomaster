// C++ 第 1-5 章 · 每章 4 节微课
module.exports = [
  {
    t: "C++ 入门与第一个程序",
    sub: "工具链 · 编译四阶段 · 第一个程序 · 常见报错",
    mins: 45,
    kw: "输入输出",
    goals: [
      "在自己的电脑或在线环境里跑通第一个 C++ 程序",
      "说清「预处理 → 编译 → 汇编 → 链接」四个阶段各做了什么",
      "看懂编译器报错的行号与错误类型，知道先改哪一行",
      "会写竞赛常用骨架：快速 IO + 文件重定向",
    ],
    map: [
      ["环节", "你需要的工具", "验收标准"],
      ["写代码", "VSCode / Dev-C++ / CLion", "能新建 .cpp 文件并保存"],
      ["编译", "g++ / clang++ / MSVC", "命令行 `g++ a.cpp -o a` 不报错"],
      ["运行", "终端或在线判题", "看到 Hello, AlgoMaster!"],
      ["调试", "断点 / cout 打点", "能定位到出错的那一行"],
    ],
    mic: [
      {
        t: "工具链：代码是怎么变成程序的",
        lead: "C++ 不是「写完就能跑」的语言，中间必须经过一次翻译——把人类写的文本翻译成 CPU 能执行的机器码。",
        body: [
          "C++ 是**编译型语言**：源码要先经过编译器处理，生成与操作系统、CPU 架构相关的可执行文件。所以同一个 .cpp 文件，在 Windows 上编译出的 .exe 拿到 Linux 上是跑不了的。",
          "初学者最常卡住的地方不是语法，而是「环境没配好」。判断环境是否正常只需要一条命令：能打印出版本号，就说明编译器已经就位。",
        ],
        code: `g++ --version      # Windows(MinGW) / Linux / macOS 通用
clang++ --version  # macOS 自带的是 clang

# 装好之后，用一条命令完成「编译 + 运行」
g++ hello.cpp -o hello && ./hello`,
        lang: "bash",
        cap: "`-o hello` 指定输出文件名；`&&` 表示编译成功才执行。Windows 下运行写 `hello.exe` 或直接 `./hello`。",
        pts: [
          "**编译器**：把 C++ 翻成机器码，最常用 g++（GCC 家族）和 clang++",
          "**编辑器 / IDE**：VSCode 轻、CLion 聪明、Dev-C++ 简单但老旧",
          "**在线环境**：洛谷、Codeforces、LeetCode 的编辑器可以直接跑，零配置",
        ],
        pit: "装了 VSCode 不等于装了编译器。VSCode 只是编辑器，`g++` 找不到时提示 `g++: command not found`，需要单独安装 MinGW-w64 并把它加进 PATH。",
      },
      {
        t: "四个阶段：预处理、编译、汇编、链接",
        lead: "一条 `g++` 命令背后藏着四个独立步骤，理解它们就能解释 90% 的「undefined reference」类错误。",
        body: [
          "**预处理**处理以 `#` 开头的行：把 `#include` 的文件内容原地展开、把 `#define` 做文本替换、删掉注释。产物是纯 C++ 代码（.i 文件）。",
          "**编译**把预处理后的代码翻译成汇编语言（.s），这一步才真正做语法检查与优化。**汇编**把汇编翻成机器码（.o 目标文件）。**链接**把多个 .o 和用到的库拼成一个可执行文件——函数声明在编译阶段够用，函数实体必须由链接器找到。",
        ],
        code: `g++ -E hello.cpp -o hello.i   # 1 预处理
g++ -S hello.i   -o hello.s   # 2 编译成汇编
g++ -c hello.s   -o hello.o   # 3 汇编成目标文件
g++ hello.o      -o hello     # 4 链接成可执行文件`,
        lang: "bash",
        table: [
          ["阶段", "输入", "输出", "典型错误"],
          ["预处理", ".cpp", ".i", "找不到头文件"],
          ["编译", ".i", ".s", "语法错误、类型错误"],
          ["汇编", ".s", ".o", "极少出错"],
          ["链接", ".o + 库", "可执行文件", "undefined reference"],
        ],
        pts: [
          "语法错误 → 编译阶段报，会给出**行号**，从第一条错误开始改",
          "`undefined reference to xxx` → 链接阶段报，说明只声明没定义，或忘了链接库",
          "`multiple definition` → 同一个函数/variable 被定义了两次（常见于在头文件里写函数体）",
        ],
        pit: "报错信息里出现十几条错误时，通常只有第一条是真的，后面的都是连锁反应。改完第一条重新编译，错误往往只剩一半。",
      },
      {
        t: "第一个程序与输入输出",
        lead: "`cout` 是「把东西倒进屏幕」的水管，`cin >>` 是「从键盘往变量里灌」的漏斗，方向符号就是水流方向。",
        body: [
          "`#include <iostream>` 引入输入输出流；`using namespace std;` 让你少写 `std::` 前缀；`int main()` 是程序唯一的入口，返回值 0 表示正常结束。",
          "`endl` 除了换行还会**刷新缓冲区**，在大量输出时它会拖慢程序，竞赛里通常用 `'\\n'` 代替。",
        ],
        code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;                 // 空格/换行都会自动跳过
    cout << a + b << "\\n";          // 用 \\n 比 endl 快
    cerr << "debug: " << a << "\\n"; // 错误流，判题时不会被当作答案
    return 0;
}`,
        lang: "C++",
        pts: [
          "`cin >>` 会自动跳过空白字符，读 `1 2` 和读 `1\\n2` 效果一样",
          "`getline(cin, s)` 读**整行**，但它不会跳过前导空白",
          "输出小数用 `cout << fixed << setprecision(2)` 控制两位小数",
        ],
        pit: "`cin >> n;` 之后紧接着 `getline(cin, s)` 会读到空串——因为第一行末尾的换行符还留在缓冲区里。先调一次 `cin.ignore()` 吃掉它。",
      },
      {
        t: "竞赛骨架与常见报错对照",
        lead: "把骨架背下来，比赛时能省下 3 分钟，还能避开两个致命坑：IO 太慢与文件重定向。",
        body: [
          "下面这段是绝大多数竞赛题的开头。`ios::sync_with_stdio(false)` 解除 C 与 C++ 流同步，`cin.tie(0)` 解除 cin 与 cout 的绑定，两行合计能让 `cin/cout` 提速 3~5 倍。",
          "本地调试时用 `freopen` 从文件读数据很爽，**但提交前一定要删掉或注释掉**，否则判题机会读不到输入而直接 WA。",
        ],
        code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

#ifdef LOCAL
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
#endif

    int n; 
    if (!(cin >> n)) return 0;   // 读到 EOF 就退出
    cout << n * 2 << "\\n";
    return 0;
}`,
        lang: "C++",
        table: [
          ["报错关键字", "真实原因", "怎么改"],
          ["expected ';'", "上一行漏分号", "看**上一行**行尾"],
          ["was not declared", "变量名拼错 / 没 include", "检查拼写与头文件"],
          ["undefined reference", "只有声明没有定义", "补函数体或链接库"],
          ["Segmentation fault", "数组越界 / 空指针", "打印下标边界"],
          ["Time Limit Exceeded", "IO 慢或算法复杂度高", "先加快速 IO"],
        ],
        pts: [
          "`bits/stdc++.h` 是 GCC 万能头，方便但编译更慢；正式项目别用",
          "本地宏 `LOCAL` 用 `-DLOCAL` 编译时才生效，提交时天然失效，最安全",
          "读不到数据时直接 `return 0`，能避免 UB 导致的玄学错误",
        ],
        pit: "`while (cin >> n)` 是读到文件结束才停。如果题目数据是「多组、以 0 结尾」，必须自己写 `if (n == 0) break;`，否则会死循环。",
      },
    ],
    qa: [
      ["C 和 C++ 的区别？", "C++ 兼容大部分 C 语法，但多了类、模板、异常、STL、引用、命名空间；C 更贴近硬件，没有运行时开销。"],
      ["为什么 main 要返回 int？", "它是进程退出码，0 表示成功，非 0 表示异常，操作系统和脚本靠它判断程序是否正常结束。"],
    ],
    sum: "语法只占三成，环境、编译链路和报错定位才是入门期真正的门槛。",
  },

  {
    t: "变量、数据类型与运算符",
    sub: "基本类型 · 溢出 · 类型转换 · 位运算",
    mins: 50,
    kw: "模拟",
    goals: [
      "给每种数据选对类型，尤其是不会溢出的类型",
      "理解整数除法、取模与浮点误差的坑",
      "会用位运算做快速乘除与状态标记",
      "能说清 int / long long / double 的取值范围",
    ],
    map: [
      ["类型", "典型字节", "范围 / 精度", "什么时候用"],
      ["int", "4", "约 ±2.1×10⁹", "普通计数"],
      ["long long", "8", "约 ±9.2×10¹⁸", "求和、乘法、答案取模前"],
      ["double", "8", "15~16 位有效数字", "实数运算"],
      ["char", "1", "-128 ~ 127", "字符与 ASCII"],
    ],
    mic: [
      {
        t: "五种基本类型怎么选",
        lead: "选类型只问两件事：最大可能是多少？需不需要小数？",
        body: [
          "`int` 是 32 位有符号整数，上限 `2147483647`，大约是 21 亿。两个 10 万相乘就已经是 100 亿，早就溢出了——所以**看到乘法、求和、答案很大，一律 long long**。",
          "`char` 本质是 1 字节整数，存的是 ASCII 码。`'A'` 就是 65，所以 `'a' - 'A' == 32` 可以用来做大小写转换。",
        ],
        code: `int a = 1e9;            // 1e9 是 double，赋给 int 会隐式转换
long long b = 1LL * a * a;  // 1e18，必须用 1LL 提升
double pi = 3.14159265358979;
char c = 'A';
bool flag = true;        // 底层是 1 字节，别和 int 混用

cout << 'a' - 'A' << "\\n";        // 32
cout << (char)('A' + 2) << "\\n";  // C`,
        lang: "C++",
        pts: [
          "`long long` 的常量要写 `1LL` 或 `10LL`，否则字面量默认是 int，先溢出再赋值",
          "`unsigned` 会把负数变成巨大的正数，竞赛里几乎只有位运算才用它",
          "`double` 比较大小要允许误差：`fabs(a-b) < 1e-9`",
        ],
        pit: "`int mid = (l + r) / 2;` 当 l、r 都接近 2e9 时会溢出。二分里写成 `l + (r - l) / 2` 更安全。",
      },
      {
        t: "整数除法、取模与浮点误差",
        lead: "C++ 的 `/` 对整数是「截断」不是「四舍五入」，这是新手 WA 的头号来源。",
        body: [
          "两个 int 相除结果还是 int，`7 / 2 == 3`，`-7 / 2 == -3`（向零截断）。想要小数，必须让其中一个变成浮点：`7 / 2.0`。",
          "取模 `%` 的结果符号跟被除数一致：`-7 % 3 == -1`。数学上我们想要恒非负，就写成 `((a % m) + m) % m`。",
        ],
        code: `cout << 7 / 2 << "\\n";      // 3
cout << 7 / 2.0 << "\\n";    // 3.5
cout << -7 % 3 << "\\n";     // -1
cout << (( -7 % 3) + 3) % 3; // 2  恒非负

// 浮点误差：0.1 + 0.2 != 0.3
if (fabs(0.1 + 0.2 - 0.3) < 1e-9) cout << "equal";
// 向上取整的整数写法
int up = (a + b - 1) / b;`,
        lang: "C++",
        pts: [
          "`ceil(a / b)` 用整数算永远等于 `a / b`，因为除法已经先截断了",
          "答案要求取模时，每一步都要 `% MOD`，别只在最后取",
          "比较浮点用 `eps = 1e-9`（double）或 `1e-6`（float）",
        ],
        pit: "判断奇偶别写 `a % 2 == 1`，负数时会得到 -1 导致漏判。写 `a % 2 != 0` 或 `a & 1`。",
      },
      {
        t: "类型转换：隐式、显式与危险区",
        lead: "编译器会自动帮你转，但它的规则有时不符合直觉——尤其是负数与无符号混算。",
        body: [
          "**隐式转换**按「精度低的向精度高的看齐」：char → int → long long → double。但 int 与 unsigned 混算时，int 会被转成 unsigned，负数直接变成巨大的正数。",
          "**显式转换**推荐 `static_cast<double>(a) / b`，比 C 风格 `(double)a / b` 更安全可读；指针类型转换用 `dynamic_cast`（带检查）或 `reinterpret_cast`（硬转）。",
        ],
        code: `int a = -1;
unsigned b = 1;
cout << (a < b) << "\\n";          // 0：a 被转成 4294967295

double avg = static_cast<double>(sum) / n;  // 推荐
int t = (int)3.99;                           // 3，直接截断
cout << to_string(42) + "!" << "\\n";        // int 转 string
int v = stoi("123");                         // string 转 int`,
        lang: "C++",
        pts: [
          "`stoi` / `stoll` 遇到非法字符会抛异常，竞赛数据干净时可以直接用",
          "`to_string` 比 `sprintf` 慢，但短字符串无所谓",
          "`double` 转 `int` 是截断，想要四舍五入写 `(int)(x + 0.5)`",
        ],
        pit: "`for (int i = 0; i < v.size(); i++)` 中 `v.size()` 是无符号数，v 为空时 `i < 0` 与无符号比较恒假没问题，但 `i <= v.size() - 1` 在空容器上会变成比较 18446744073709551615，直接越界。",
      },
      {
        t: "位运算：把整数当地址簿用",
        lead: "整数的二进制位是最省的布尔数组，也是最快的乘除法工具。",
        body: [
          "`&` 取位、`|` 置位、`^` 翻转、`~` 全取反、`<<` 左移（乘 2 的幂）、`>>` 右移（除 2 的幂）。计算机里负数用**补码**表示，所以 `-1` 的二进制全是 1。",
          "竞赛里位运算的两大用途：状态压缩（用一个 int 表示「哪些元素被选」）和快速判断奇偶/2 的幂。",
        ],
        code: `int x = 0b1011;             // 11
cout << (x & 1) << "\\n";    // 1  判断奇偶
cout << (1 << 4) << "\\n";   // 16 乘 2^4
cout << (x >> 1) << "\\n";   // 5  除 2
cout << __builtin_popcount(x) << "\\n";  // 3 二进制里 1 的个数
x |= (1 << 2);              // 置位第 2 位
x &= ~(1 << 0);             // 清除第 0 位
bool isPow2 = (n > 0) && !(n & (n - 1));`,
        lang: "C++",
        pts: [
          "`lowbit = x & -x` 取出最低位的 1，树状数组的核心",
          "`1 << 31` 在 int 上是未定义行为（符号位），要写 `1LL << 31`",
          "子集枚举模板：`for (s = mask; s; s = (s - 1) & mask)`",
        ],
        pit: "`-8 >> 1` 对有符号数是算术右移，结果是 -4；对无符号数才是逻辑右移。混用时先统一类型。",
      },
    ],
    qa: [
      ["为什么 long long 也溢出过？", "long long 上限约 9.2e18，三个 1e6 相乘就爆了。乘法前先想清楚量级，必要时用 __int128 或取模。"],
      ["float 和 double 怎么选？", "竞赛统一用 double；float 只有 7 位有效数字，累积误差大，几乎不用。"],
    ],
    sum: "选类型盯住量级，除法和取模盯住符号，浮点比较盯住误差。",
  },

  {
    t: "控制流：分支与循环",
    sub: "if/switch 坠落 · for/while · break/continue · 常见死循环",
    mins: 45,
    kw: "模拟",
    goals: [
      "能根据题意选择 if / switch / 循环结构",
      "写出不会死循环、不会越界的循环边界",
      "掌握 continue / break 在嵌套循环里的真实作用范围",
      "会把 for 循环改写成前缀和等常见套路",
    ],
    map: [
      ["结构", "什么时候用", "要小心的点"],
      ["if / else if", "区间判断、多个条件", "条件顺序决定正确性"],
      ["switch", "离散等值判断", "忘写 break 会「坠落」"],
      ["for", "次数已知的循环", "边界用 < 还是 <="],
      ["while", "次数未知、靠条件结束", "变量必须在循环内更新"],
    ],
    mic: [
      {
        t: "if 的条件顺序与短路求值",
        lead: "多个条件用 && 连接时，左边为假右边就不执行——这既能提速，也能防越界。",
        body: [
          "`&&` 和 `||` 是**短路**的：`a[i] > 0 && i < n` 如果先判断 `a[i]`，i 越界时就已经崩了。所以把「安全」的判断放左边：`i < n && a[i] > 0`。",
          "`else if` 链是有顺序的，从上往下第一个成立的分支执行完就跳出。写区间判断时，宽条件放前面会吃掉窄条件。",
        ],
        code: `int s;
cin >> s;
if (s >= 90)      cout << "A";
else if (s >= 80) cout << "B";   // 到这里 s 必然 < 90
else if (s >= 60) cout << "C";
else              cout << "D";

// 短路保护越界
if (i >= 0 && i < n && a[i] == target) { /* ... */ }`,
        lang: "C++",
        pts: [
          "`if (x = 1)` 是赋值且恒为真，编译器会警告，务必写 `==`",
          "浮点不要直接 `==`，用误差比较",
          "三元运算符 `a > b ? a : b` 只适合简单取值，嵌套可读性差",
        ],
        pit: "`if (0 < x < 10)` 在 C++ 里等价于 `(0 < x) < 10`，恒为真。必须写 `0 < x && x < 10`。",
      },
      {
        t: "switch 与 break 坠落",
        lead: "switch 是「跳到对应标签往下执行」，不写 break 就会一路穿到底。",
        body: [
          "`switch` 只能判断整型或枚举（C++17 起支持字符串不行，但支持 `std::string` 不行、`char` 可以）。它的本质是一张跳转表，比一长串 if 更快也更清晰。",
          "「坠落」不总是 bug：多个 case 共用同一段逻辑时，故意不写 break 是标准写法。",
        ],
        code: `switch (op) {
    case '+': ans = a + b; break;
    case '-': ans = a - b; break;
    case '*':
    case 'x':                 // 故意坠落：* 和 x 都走这里
        ans = a * b; break;
    default:  ans = 0;
}`,
        lang: "C++",
        pts: [
          "每个 case 后写 break，或改用 return 直接结束函数",
          "`case` 后必须是**常量表达式**，不能是变量",
          "记得写 default，即使逻辑上不会走到",
        ],
        pit: "在 case 里定义变量必须加花括号 `{ int t = 1; }`，否则作用域会跨 case，编译报错。",
      },
      {
        t: "for 循环的边界艺术",
        lead: "90% 的数组越界都发生在循环边界上，把「下标从 0 开始、长度 n、右边界 n-1」当成肌肉记忆。",
        body: [
          "`for (int i = 0; i < n; i++)` 是访问整个数组的标准写法。要访问 `[l, r]` 闭区间，就写 `i <= r`。这两个写法混用是越界主因。",
          "循环变量在循环外声明时，循环结束后仍可访问（C++ 作用域规则），但只在 for 头里声明的 i 出了循环就销毁。",
        ],
        code: `int a[10];
for (int i = 0; i < 10; i++) a[i] = i * i;   // 填满 0..9

// 反向遍历
for (int i = 9; i >= 0; i--) cout << a[i] << " ";

// 步长不为 1
for (int i = 0; i < n; i += 2) { /* 跳着走 */ }

// 二维：先枚举行再枚举列
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++) sum += g[i][j];`,
        lang: "C++",
        pts: [
          "`for (int i = 0; i <= n; i++)` 会多访问一个元素，n 是长度时必然越界",
          "反向循环 `i >= 0` 时 i 必须是有符号数，用无符号会死循环",
          "范围 for：`for (int x : v)` 是拷贝，改值要用 `for (int &x : v)`",
        ],
        pit: "`for (int i = 0; i < v.size() - 1; i++)` 在 v 为空时，`v.size() - 1` 变成巨大的无符号数，循环直接跑飞。先判空或改用 `int n = v.size()`。",
      },
      {
        t: "while、do-while 与 break/continue",
        lead: "while 适合「不知道循环几次」，但它的三个部件（初始化、条件、更新）是分散的，容易漏。",
        body: [
          "`while (cin >> x)` 是竞赛读入不定长数据的经典写法，读到 EOF 自动结束。`do-while` 至少执行一次，适合「先做再判断」的场景。",
          "`break` 只跳出**最近一层**循环。要跳出两层，用标志变量或把逻辑抽成函数用 `return`。",
        ],
        code: `int n;
while (cin >> n) {            // 多组数据
    if (n == 0) break;        // 以 0 结束
    cout << n * n << "\\n";
}

int i = 0;
do { i++; } while (i < 3);    // 至少执行一次

// 跳出两层：标志位
bool found = false;
for (int i = 0; i < n && !found; i++)
    for (int j = 0; j < m; j++)
        if (g[i][j] == target) { found = true; break; }`,
        lang: "C++",
        pts: [
          "`continue` 跳过本次循环剩余部分，直接进入下一次判定",
          "死循环 `while (true)` 里必须有 break 出口",
          "`goto` 能跳，但会把控制流搅乱，除跳出多层循环外别用",
        ],
        pit: "`while (n--)` 在 n 为 0 时先判断 0（假）再自减，n 会变成 -1；如果是无符号，`n--` 到 0 后再减会变成 4294967295，死循环。",
      },
    ],
    qa: [
      ["switch 和 if 性能差多少？", "分支少时几乎一样；分支多且值是密集整数时 switch 会编译成跳转表，O(1) 定位。"],
    ],
    sum: "边界写「长度 n 配 <，闭区间 r 配 <=」，条件写「安全判断放左边」。",
  },

  {
    t: "数组与字符串",
    sub: "一维/二维数组 · 前缀和 · string 操作 · 字符处理",
    mins: 55,
    kw: "前缀和",
    goals: [
      "正确声明、初始化、遍历一维与二维数组",
      "用前缀和把区间求和从 O(n) 降到 O(1)",
      "熟练使用 string 的查找、截取、拼接、比较",
      "分清字符数组与 std::string 的区别",
    ],
    map: [
      ["主题", "关键 API", "复杂度"],
      ["一维数组", "`a[i]`、`sizeof`、`memset`", "访问 O(1)"],
      ["二维数组", "`g[i][j]`、按行优先遍历", "访问 O(1)"],
      ["前缀和", "`pre[i] = pre[i-1] + a[i]`", "预处理 O(n)，查询 O(1)"],
      ["string", "`substr/find/+=/compare`", "拼接均摊 O(1)"],
    ],
    mic: [
      {
        t: "数组声明、初始化与越界",
        lead: "数组就是一段连续的内存，下标是「离起点的偏移量」，所以从 0 开始。",
        body: [
          "全局数组会自动清零，**局部数组不会**——里面是上一次残留的垃圾值。这是「本地对、提交 WA」的经典原因。",
          "大数组（比如 1e6 个 int）必须开在全局，因为函数栈默认只有 1~8MB，开在局部会栈溢出（Segmentation fault）。",
        ],
        code: `int g[1005];              // 全局：自动全 0
const int N = 1e6 + 5;
int big[N];               // 4MB，放全局安全

int a[5] = {1, 2, 3};     // 剩下两个自动补 0
int b[5] = {};            // 全 0
memset(a, 0, sizeof a);   // 按字节清零，只适合 0 / -1

int grid[105][105] = {};  // 二维全 0`,
        lang: "C++",
        pts: [
          "`memset` 按字节赋值，只有 0 和 -1 是安全的，填充 1 会得到 16843009",
          "`sizeof(a) / sizeof(a[0])` 只在数组**还在作用域内**时有效，传进函数后退化成指针",
          "二维数组 `g[i][j]` 的内存是行优先连续的，按行遍历对缓存最友好",
        ],
        pit: "`int a[n];` 这种变长数组不是标准 C++，某些编译器能过、判题机可能崩。n 上限已知就开常量大小，否则用 `vector<int> a(n)`。",
      },
      {
        t: "前缀和：一次预处理，万次查询",
        lead: "把「从前往后累加」的结果存下来，任意区间和就等于两个前缀相减。",
        body: [
          "定义 `pre[i] = a[1] + a[2] + ... + a[i]`，则 `sum(l, r) = pre[r] - pre[l-1]`。预处理 O(n)，之后每次查询 O(1)。",
          "二维前缀和同理：`pre[i][j]` 表示左上角 (1,1) 到 (i,j) 的矩形和，查询用容斥原理加加减减。",
        ],
        code: `// 一维：下标从 1 开始，省掉 l-1 的边界判断
long long pre[N];
for (int i = 1; i <= n; i++) pre[i] = pre[i - 1] + a[i];
long long sum = pre[r] - pre[l - 1];

// 二维前缀和
for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + g[i][j];

// 查询 (x1,y1)-(x2,y2)
long long s = pre[x2][y2] - pre[x1-1][y2] - pre[x2][y1-1] + pre[x1-1][y1-1];`,
        lang: "C++",
        pts: [
          "下标从 1 开始能省掉大量 `l == 0` 的特判，竞赛强烈推荐",
          "求和结果用 `long long`，1e5 个 1e9 相加就到 1e14 了",
          "差分是前缀和的逆运算：区间加值用差分，最后再前缀和还原",
        ],
        pit: "`pre[r] - pre[l-1]` 中的 l 是 1 时要用 `pre[0]`，所以数组必须开到 0 位并初始化为 0。",
      },
      {
        t: "std::string 常用操作",
        lead: "string 是会自动扩容的字符数组，绝大部分字符串题用它比拼 char[] 省事。",
        body: [
          "`+` 拼接、`substr(pos, len)` 截取、`find` 查找返回下标（找不到返回 `string::npos`）、`compare` 字典序比较。`s[i]` 是 char，`s.size()` 是长度。",
          "string 支持 `==`、`<` 直接比较，按字典序逐字符比——这让排序字符串数组变得极其简单。",
        ],
        code: `string s = "AlgoMaster";
cout << s.size() << "\\n";              // 10
cout << s.substr(0, 4) << "\\n";        // Algo
cout << s.find("Master") << "\\n";      // 4
if (s.find("xyz") == string::npos) cout << "not found\\n";
s += "!";                                // 追加
reverse(s.begin(), s.end());             // 翻转
sort(vs.begin(), vs.end());               // 字典序排序
char c = toupper(s[0]);                   // 转大写`,
        lang: "C++",
        pts: [
          "`s.length()` 与 `s.size()` 完全等价",
          "`getline(cin, s)` 读一整行（含空格），`cin >> s` 只读到空格",
          "循环里大量 `s = s + c` 会退化成 O(n²)，改用 `s += c` 或先 push_back",
        ],
        pit: "`s.find(t)` 返回的是 `size_t`（无符号），写成 `if (s.find(t) >= 0)` 永远为真。必须和 `string::npos` 比较。",
      },
      {
        t: "字符处理与进制转换",
        lead: "字符本质是数字，`'0'` 到 `'9'` 的 ASCII 是连续的，所以 `c - '0'` 就是它的数值。",
        body: [
          "判断字符类别用 `<cctype>`：`isdigit`、`isalpha`、`islower`、`toupper`。注意这些函数参数是 int，传负的 char 是 UB，稳妥写 `toupper((unsigned char)c)`。",
          "进制转换：任意进制转十进制用「乘基加位」，十进制转任意进制用「取模倒序」。",
        ],
        code: `int toInt(char c) { return c - '0'; }
char toChar(int d) { return char('0' + d); }

// 任意进制 -> 十进制
int parse(string s, int base) {
    int v = 0;
    for (char c : s) {
        int d = isdigit(c) ? c - '0' : tolower(c) - 'a' + 10;
        v = v * base + d;
    }
    return v;
}

// 十进制 -> 二进制字符串
string toBin(int n) {
    if (n == 0) return "0";
    string r;
    while (n) { r += char('0' + n % 2); n /= 2; }
    reverse(r.begin(), r.end());
    return r;
}`,
        lang: "C++",
        pts: [
          "`'a' - 'A' == 32`，大小写互转就是加减 32（或用 `^ 32`）",
          "`stoi(s, nullptr, 16)` 可以直接把十六进制字符串转成 int",
          "`printf(\"%x\")` 输出小写十六进制，`%X` 输出大写",
        ],
        pit: "`isupper('a')` 返回的不一定是 1，可能是任意非零值。不要写 `if (isupper(c) == 1)`，直接 `if (isupper(c))`。",
      },
    ],
    qa: [
      ["数组和 vector 怎么选？", "长度固定用数组（快、省），长度动态或需要 push_back 用 vector；竞赛里能用数组就用数组。"],
      ["string 拼接为什么有时很慢？", "`s = s + c` 每次都新建字符串并拷贝，n 次就是 O(n²)；`s += c` 是原地追加，均摊 O(1)。"],
    ],
    sum: "数组下标从 0、前缀和下标从 1；字符串查找永远和 npos 比。",
  },

  {
    t: "函数与作用域",
    sub: "参数传递 · 引用 · 重载 · 递归 · 内联",
    mins: 50,
    kw: "递归",
    goals: [
      "分清值传递、引用传递、指针传递的差别与开销",
      "会用默认参数、函数重载组织接口",
      "写出正确的递归：终止条件 + 递推关系",
      "知道递归深度限制与「爆栈」的应对方法",
    ],
    map: [
      ["传参方式", "写法", "能否修改实参", "开销"],
      ["值传递", "`f(int x)`", "不能", "拷贝一份"],
      ["引用传递", "`f(int &x)`", "能", "零拷贝"],
      ["常量引用", "`f(const vector<int> &v)`", "不能（只读）", "零拷贝"],
      ["指针传递", "`f(int *p)`", "能（解引用后）", "拷贝地址"],
    ],
    mic: [
      {
        t: "三种传参：什么时候用哪个",
        lead: "大对象一律传 const 引用，要改实参就传引用，其余传值最简单。",
        body: [
          "**值传递**会把实参复制一份进函数，函数里怎么改都不影响外面。这对小类型（int/double）最快，对大对象（vector/string）就是纯浪费。",
          "**引用**是变量的别名，不拷贝，改它就是改原变量。加 `const` 表示只读，既避免拷贝又防止误改，是传容器的标准姿势。",
        ],
        code: `void byValue(int x) { x = 100; }              // 外面不变
void byRef(int &x)   { x = 100; }              // 外面变成 100
void byConstRef(const vector<int> &v) {        // 只读，零拷贝
    cout << v.size();
}

int a = 1;
byValue(a);   // a 还是 1
byRef(a);     // a 变成 100

// 交换的正确写法
void mySwap(int &x, int &y) { int t = x; x = y; y = t; }`,
        lang: "C++",
        pts: [
          "引用必须在定义时绑定，之后不能改绑到别的变量",
          "不要返回局部变量的引用或指针——函数结束它就没了",
          "传数组给函数会退化成指针，长度要额外传一个参数",
        ],
        pit: "`void f(int &x)` 不能接字面量 `f(5)`，会编译报错。要兼容常量就写 `const int &x`。",
      },
      {
        t: "默认参数、重载与内联",
        lead: "默认参数让调用更省事，重载让同名函数按类型分流，inline 让小函数零开销。",
        body: [
          "**默认参数**必须从右往左连续给：`f(int a, int b = 1, int c = 2)` 合法，`f(int a = 1, int b)` 非法。",
          "**重载**靠参数列表（个数或类型）区分，**不能**只靠返回值区分。`int f(int)` 与 `double f(int)` 无法共存。",
        ],
        code: `int add(int a, int b = 10) { return a + b; }
add(5);      // 15
add(5, 1);   // 6

// 重载：同名不同参
void print(int x)         { cout << "int " << x; }
void print(double x)      { cout << "double " << x; }
void print(const string &s){ cout << "str " << s; }

// 小函数内联，省掉函数调用开销
inline int sq(int x) { return x * x; }`,
        lang: "C++",
        pts: [
          "默认参数只写在**声明**里（头文件），定义里再写一次会编译错误",
          "`inline` 只是给编译器的建议，现代编译器会自动决定",
          "重载决议优先精确匹配，其次隐式转换，容易踩到意外转换的坑",
        ],
        pit: "`print('a')` 在同时有 `print(int)` 和 `print(double)` 时，char 会提升为 int 走整型版本，不会报错也不会走你以为的那个。",
      },
      {
        t: "递归：把大问题拆成同形的小问题",
        lead: "写递归只需要回答两个问题：什么时候停？怎么用更小的答案拼出当前答案？",
        body: [
          "递归函数一定包含**终止条件**（base case）和**递推关系**（recursive case）。缺终止条件就是无限递归 → 栈溢出。",
          "每次递归都会在栈上压一帧，默认栈约 1~8MB，一层几十字节，深度上万就可能爆。深搜时要么改迭代，要么用显式栈。",
        ],
        code: `// 阶乘
long long fact(int n) {
    if (n <= 1) return 1;        // 终止条件
    return n * fact(n - 1);      // 递推
}

// 斐波那契（朴素版，指数级，仅示意）
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// 汉诺塔：把 n-1 个移到辅助柱，再移最大盘
void hanoi(int n, char a, char b, char c) {
    if (n == 0) return;
    hanoi(n - 1, a, c, b);
    cout << a << " -> " << c << "\\n";
    hanoi(n - 1, b, a, c);
}`,
        lang: "C++",
        pts: [
          "递归一定要往「规模变小」的方向走，否则永远到不了终止条件",
          "朴素 fib 是 O(2ⁿ)，加个记忆化数组就变 O(n)",
          "深度可能上万时，优先考虑迭代或手动模拟栈",
        ],
        pit: "`hanoi` 里 `n == 0 return` 是终止条件；如果写成 `n == 1` 也能对，但要多写一层移动逻辑，容易漏。",
      },
      {
        t: "作用域、生命周期与全局变量",
        lead: "变量在哪出生、活多久、谁能看见，决定了它是「安全」还是「玄学 bug」。",
        body: [
          "**局部变量**在花括号内有效，函数返回即销毁；**全局变量**整个程序可见，且自动零初始化；**static 局部变量**只初始化一次，函数返回后仍保留值。",
          "竞赛里全局数组是标配（自动清零 + 不占栈），但也带来「上一组数据没清干净」的经典 bug——多组测试时要手动 `memset` 或 `fill`。",
        ],
        code: `int g_cnt = 0;              // 全局：自动 0

void f() {
    int local = 0;          // 每次调用都重新初始化
    static int calls = 0;   // 只初始化一次，跨调用保留
    calls++; g_cnt++;
    cout << calls << "\\n";
}

int main() {
    f(); f(); f();          // 输出 1 2 3
    cout << g_cnt;          // 3
}`,
        lang: "C++",
        pts: [
          "同名时局部变量会**遮蔽**全局变量，想用全局加 `::g_cnt`",
          "`static` 全局变量只在当前文件可见，等价于私有",
          "多组数据不清空全局数组，是最难查的 WA 来源之一",
        ],
        pit: "`for (int i = 0; ...) {}` 之后再用 i 会报未声明；如果循环外也声明了 i，则内层会遮蔽外层，改的不是同一个变量。",
      },
    ],
    qa: [
      ["引用和指针的区别？", "引用必须初始化、不能改绑、没有空引用、语法像普通变量；指针可以为空、可以改指向、需要解引用。"],
      ["递归和迭代怎么选？", "结构天然分治（树、图、回溯）用递归；线性过程或深度很大用迭代。"],
    ],
    sum: "大对象传 const 引用，递归先写终止条件，多组数据先清全局。",
  },
];
