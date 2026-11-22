// C 第 1-5 章 · 每章 4 节微课
module.exports = [
  {
    t: "C 语言入门",
    sub: "gcc · 编译运行 · 第一个程序 · 与 C++ 的差异",
    mins: 40,
    kw: "输入输出",
    goals: [
      "用 gcc 完成编译与运行",
      "写出标准的 main 与头文件包含",
      "理解 C 没有类、没有引用、没有 STL",
      "看懂最常见的编译错误与警告",
    ],
    map: [
      ["步骤", "命令", "产物"],
      ["预处理", "`gcc -E`", ".i"],
      ["编译", "`gcc -S`", ".s"],
      ["汇编", "`gcc -c`", ".o"],
      ["链接", "`gcc a.o -o a`", "可执行文件"],
    ],
    mic: [
      {
        t: "gcc 的四步与常用参数",
        lead: "C 是「贴近硬件」的语言：没有运行时帮你管内存，也没有标准库容器，你拿到的就是指针和字节。",
        body: [
          "`gcc main.c -o main` 一步完成编译链接。加 `-Wall -Wextra` 打开警告，能提前发现大量隐患。",
          "`-O2` 开优化、`-g` 保留调试信息、`-std=c11` 指定标准、`-lm` 链接数学库。",
        ],
        code: `gcc -Wall -Wextra -std=c11 main.c -o main
./main

# 分步
gcc -E main.c -o main.i
gcc -S main.i -o main.s
gcc -c main.s -o main.o
gcc main.o -o main

# 带数学库
gcc calc.c -o calc -lm`,
        lang: "bash",
        pts: [
          "`-Wall` 一定要开，C 的隐式转换问题很多",
          "`-lm` 必须放在源文件之后，否则链接不到 math",
          "`-g` 配合 gdb 调试，不改变程序逻辑",
        ],
        pit: "忘了 `-lm` 时报 `undefined reference to sqrt`，看起来像代码问题，其实是链接参数顺序问题。",
      },
      {
        t: "第一个 C 程序",
        lead: "C 程序从 `main` 开始，`#include` 只是把头文件内容原地插进来——没有命名空间，也没有类。",
        body: [
          "`#include <stdio.h>` 引入 `printf` 的声明；`int main(void)` 是标准入口；`return 0` 表示正常退出。",
          "C99 之后允许在任意位置声明变量，但很多老教材仍把声明放开头——两种都合法。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int a = 3, b = 4;
    printf("%d + %d = %d\\n", a, b, a + b);
    printf("size of int = %zu\\n", sizeof(int));

    char name[32];
    scanf("%31s", name);          // 限制长度，防溢出
    printf("hi, %s\\n", name);
    return 0;
}`,
        lang: "C",
        pts: [
          "`printf` 的格式符必须与参数类型匹配，否则是未定义行为",
          "`scanf(\"%s\")` 不检查长度，务必用 `%31s` 这类限制",
          "`sizeof` 返回 `size_t`，用 `%zu` 打印",
        ],
        pit: "`scanf(\"%d\", n)` 少了取地址符 `&`，程序会直接段错误——这是新手第一个 crash。",
      },
      {
        t: "C 与 C++ 的关键差异",
        lead: "C 没有类、模板、引用、异常、STL，也没有 `new/delete`——它只有函数、结构体和指针。",
        body: [
          "C 的结构体不能有成员函数；字符串是 `char` 数组而不是对象；数组不知道自己的长度，必须额外传 size。",
          "C 的「泛型」只能靠 `void*` 加函数指针手工实现。",
        ],
        code: `// C：结构体 + 手工函数
struct Point { int x, y; };
int point_dist2(struct Point p) { return p.x * p.x + p.y * p.y; }

// C：字符串是 char 数组
char s[16] = "abc";
size_t n = strlen(s);           // 要 include <string.h>

// C：没有引用，只能传指针
void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

// C++ 里能写 Point::dist2()、std::string、int& —— C 都没有`,
        lang: "C",
        pts: [
          "C 的结构体变量必须写 `struct Point p;`（或用 typedef 简写）",
          "字符串函数在 `<string.h>`，比较用 `strcmp` 不能用 `==`",
          "数组传参会退化为指针，长度信息丢失",
        ],
        pit: "用 `if (s1 == s2)` 比较字符串，比较的是地址而不是内容，永远不相等（除非同一指针）。",
      },
      {
        t: "常见错误与调试习惯",
        lead: "C 的编译警告就是你要看的「体检报告」——很多段错误在警告里已经提示了。",
        body: [
          "`warning: implicit declaration of function` 说明忘了 include；`uninitialized variable` 说明变量没初始化。",
          "段错误先用 `printf` 或 `gdb` 定位到行；越界问题用 `-fsanitize=address` 编译能直接指出位置。",
        ],
        code: `# 用 AddressSanitizer 抓越界（gcc/clang 都支持）
gcc -g -fsanitize=address -o app app.c
./app

# gdb 基本用法
gcc -g -o app app.c
gdb ./app
# (gdb) run
# (gdb) bt          # 看调用栈
# (gdb) print i     # 看变量
# (gdb) break 12    # 第 12 行断点`,
        lang: "bash",
        table: [
          ["现象", "常见原因"],
          ["Segmentation fault", "空指针、越界、野指针"],
          ["输出乱码", "格式符与类型不匹配"],
          ["结果随机变化", "变量未初始化"],
          ["死循环", "循环变量未更新"],
        ],
        pts: [
          "开 `-fsanitize=address` 能让越界/泄漏立刻现形",
          "`gdb` 的 `bt` 看调用栈是定位崩溃的第一步",
          "编译警告不要忽略，尤其 `-Wall` 报的",
        ],
        pit: "「本机能跑、判题机崩」九成是未初始化变量或数组越界，靠运气在本机没触发。",
      },
    ],
    qa: [
      ["C 和 C++ 能混用吗？", "可以，但要在头文件用 `extern \"C\"` 避免名字改编；C++ 代码不能直接放进 .c 文件。"],
      ["为什么 C 的 main 要返回 int？", "它是进程退出码，0 表示成功，操作系统与脚本靠它判断结果。"],
    ],
    sum: "开 -Wall、scanf 加 & 和长度、字符串用 strcmp、越界用 ASan 抓。",
  },

  {
    t: "基本类型与运算",
    sub: "int/float/char · sizeof · 类型转换 · 溢出",
    mins: 45,
    kw: "模拟",
    goals: [
      "记住 C 各类型的字节数与范围",
      "理解有符号溢出的未定义行为",
      "正确做类型转换与格式化输出",
      "知道 char 与整数在 C 里的等价性",
    ],
    map: [
      ["类型", "典型字节", "范围"],
      ["char", "1", "-128 ~ 127"],
      ["short", "2", "-32768 ~ 32767"],
      ["int", "4", "约 ±21 亿"],
      ["long long", "8", "约 ±9.2×10¹⁸"],
      ["double", "8", "15~16 位有效数字"],
    ],
    mic: [
      {
        t: "类型的字节数与 sizeof",
        lead: "C 的 `int` 字节数依赖平台（常见 4 字节），所以涉及二进制或网络传输时要改用 `<stdint.h>` 的定长类型。",
        body: [
          "`sizeof` 是编译期运算符，返回 `size_t`（无符号）。`sizeof(arr)/sizeof(arr[0])` 能算出数组元素个数——但只在数组还在作用域内时有效。",
          "`int8_t/uint32_t/int64_t` 明确指定位数，跨平台安全。",
        ],
        code: `#include <stdio.h>
#include <stdint.h>

printf("%zu %zu %zu %zu\\n",
       sizeof(char), sizeof(int), sizeof(long), sizeof(long long));

int a[10];
printf("%zu\\n", sizeof(a) / sizeof(a[0]));   // 10

int32_t x = 100;
uint64_t y = 1ULL << 40;
printf("%d %llu\\n", x, (unsigned long long) y);`,
        lang: "C",
        pts: [
          "`sizeof` 的结果是 `size_t`，用 `%zu` 打印",
          "数组作为函数参数后退化为指针，`sizeof` 只得到指针大小",
          "`long` 在 Windows 是 4 字节，在 Linux 64 位是 8 字节——别依赖它",
        ],
        pit: "把数组传给函数后再 `sizeof(arr)/sizeof(arr[0])` 得到的是 2（指针大小/元素大小）而不是长度。",
      },
      {
        t: "整数溢出与未定义行为",
        lead: "有符号整数溢出在 C 标准里是「未定义行为」，编译器可以做任何事——包括把你的判断优化掉。",
        body: [
          "无符号溢出是良定义的（按 2ⁿ 取模）；有符号溢出是 UB。`INT_MAX + 1` 在不同优化等级下可能得到不同结果。",
          "防溢出：用 `long long`、检查边界（`if (a > INT_MAX - b)`）、或改用无符号。",
        ],
        code: `#include <limits.h>
#include <stdio.h>

int a = INT_MAX;
printf("%d\\n", a + 1);        // UB，常见输出 -2147483648

unsigned u = UINT_MAX;
printf("%u\\n", u + 1);        // 0，良定义

long long safe = (long long) a + 1;   // 正确
printf("%lld\\n", safe);

// 溢出检测
if (b > 0 && a > INT_MAX - b) printf("会溢出\\n");`,
        lang: "C",
        pts: [
          "`INT_MAX` / `LLONG_MAX` 在 `<limits.h>` 里",
          "乘法溢出检测更麻烦，直接用 `long long` 最省心",
          "`-fwrapv` 可让 gcc 按回绕处理有符号溢出（非标准行为）",
        ],
        pit: "用 `int` 存 `1e9 * 1e9` 结果完全错误，且不报任何错——比抛异常更危险。",
      },
      {
        t: "类型转换与格式化输出",
        lead: "C 的隐式转换规则复杂（整型提升、算术转换），格式符写错会读出垃圾值甚至崩溃。",
        body: [
          "`char`/`short` 参与运算会自动提升为 `int`；`int` 与 `unsigned` 混算时 int 会转成 unsigned。",
          "`printf` 的 `%d`（int）、`%ld`（long）、`%lld`（long long）、`%f`（double）、`%s`、`%c`、`%zu`（size_t）必须匹配。",
        ],
        code: `int i = 300;
char c = (char) i;             // 44（截断低 8 位）
printf("%d\\n", c);

double d = 3.99;
printf("%d\\n", (int) d);       // 3，截断

printf("%.2f\\n", d);            // 3.99
printf("%5d|%-5d|%05d\\n", 42, 42, 42);

long long big = 1LL << 50;
printf("%lld\\n", big);         // 必须用 %lld

unsigned x = 1;
printf("%d\\n", x - 2);         // -1（用 %u 会是巨大值）`,
        lang: "C",
        pts: [
          "`float` 用 `printf` 时会自动提升为 `double`，所以 `%f` 通用",
          "用 `%d` 打印 `long long` 是 UB，必须 `%lld`",
          "`(int)` 强转是截断，不是四舍五入",
        ],
        pit: "`printf(\"%d\", d)` 传 double 给 `%d`，输出随机数字——这类错误编译器只会给警告。",
      },
      {
        t: "char、字符串与 ASCII",
        lead: "C 里 char 就是 1 字节整数，`'A'` 的值是 65——这让字符处理可以完全用整数运算。",
        body: [
          "`char` 分 `signed char`（-128~127）与 `unsigned char`（0~255），是否等价于 `signed` 由实现定义。",
          "`0` 与 `'\\0'` 是字符串结束符；`'0'` 是字符 48。这三者混淆是 C 的经典错误来源。",
        ],
        code: `#include <stdio.h>
#include <ctype.h>

char c = 'A';
printf("%d %c\\n", c, c + 1);          // 65 B
printf("%c\\n", 'a' - 32);             // A

printf("%d %d\\n", '0', 0);            // 48 0
char digit = '7';
int v = digit - '0';                   // 7
printf("%d\\n", v);

printf("%d %d\\n", isdigit('7'), isalpha('a'));  // 非 0 值表示真

char buf[8] = "abc";
printf("%zu %c\\n", sizeof(buf), buf[0]);   // 8 a`,
        lang: "C",
        pts: [
          "`'0'` 是字符（48），`0` 是数值，`'\\0'` 是结束符",
          "`isdigit` 等函数参数要传 `unsigned char` 或 EOF，别传负 char",
          "`char buf[8] = \"abc\"` 会自动补 `\\0`，剩 4 个字节为 0",
        ],
        pit: "把 `'0'` 当 0 用，`int n = '0';` 结果是 48——赋值与比较都会错。",
      },
    ],
    qa: [
      ["为什么说 C 不检查数组越界？", "数组只是指针运算的语法糖，编译器不插入边界检查，越界访问是未定义行为。"],
      ["`size_t` 是什么类型？", "无符号整数类型，用来表示对象大小与下标，足够容纳任何对象的大小。"],
    ],
    sum: "sizeof 用 %zu、有符号溢出是 UB、格式符必须匹配、'0' 不等于 0。",
  },

  {
    t: "控制流",
    sub: "if/switch · for/while · goto · 常见陷阱",
    mins: 40,
    kw: "模拟",
    goals: [
      "写出正确的分支与循环边界",
      "理解 switch 的整数要求与穿透",
      "知道 goto 的合理用途（错误清理）",
      "避开赋值与比较写混、漏 break 等问题",
    ],
    map: [
      ["结构", "要求", "陷阱"],
      ["if/else", "条件为整数表达式", "`=` 与 `==`"],
      ["switch", "只能是整型/枚举", "漏 break 穿透"],
      ["for", "三部分都可省略", "边界 off-by-one"],
      ["goto", "跳转到标签", "滥用破坏结构"],
    ],
    mic: [
      {
        t: "if 与常见书写错误",
        lead: "C 里任何非 0 值都是真，所以 `if (x = 1)` 恒为真——这是 C 最经典的 bug。",
        body: [
          "把常量写在左边（`if (1 == x)`）能让误写 `=` 变成编译错误，这是老派技巧。现代编译器开 `-Wall` 会直接警告。",
          "`else if` 链的顺序决定正确性；浮点不要用 `==` 比较。",
        ],
        code: `#include <stdio.h>
#include <math.h>

int x = 0;
if (x = 1) printf("恒为真（错误用法）\\n");
if (1 == x) printf("这样写漏 = 会编译报错\\n");

double d = 0.1 + 0.2;
if (fabs(d - 0.3) < 1e-9) printf("近似相等\\n");

int score = 85;
if (score >= 90) puts("A");
else if (score >= 80) puts("B");
else puts("C");`,
        lang: "C",
        pts: [
          "`if (0 < x < 10)` 在 C 里恒为真，必须写 `0 < x && x < 10`",
          "`-Wall` 会警告「suggest parentheses」与「assignment in condition」",
          "浮点比较用 `fabs(a-b) < eps`",
        ],
        pit: "`if (p)` 只判指针非空，不保证它指向有效内存——释放过的指针值仍然非空。",
      },
      {
        t: "switch 与穿透",
        lead: "switch 只能判断整数（含 char、枚举），每个 case 后不写 break 就会一路执行到底。",
        body: [
          "case 标签必须是编译期常量。default 可以省略但建议写上。",
          "有意穿透（多个 case 共用逻辑）是合法且常见的写法，但要加注释说明。",
        ],
        code: `char op = '+';
int a = 3, b = 4, r = 0;
switch (op) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*':
    case 'x':                       // 有意穿透
        r = a * b; break;
    default:
        r = 0;
}
printf("%d\\n", r);

// 用 switch 做状态机
int state = 0;
switch (state) {
    case 0: state = 1; break;
    case 1: state = 2; break;
    default: state = 0;
}`,
        lang: "C",
        pts: [
          "`switch` 不能用于 `double`、字符串",
          "每个 case 后记得 break，或用 `return` 结束函数",
          "case 里不能声明变量（C99 起加花括号可以）",
        ],
        pit: "漏 break 会继续执行下一个 case 并可能覆盖结果，而且不会报错——只能靠 review 或警告。",
      },
      {
        t: "循环的边界与无符号陷阱",
        lead: "`for (unsigned i = n - 1; i >= 0; i--)` 会死循环，因为无符号永远不会小于 0。",
        body: [
          "倒序循环的循环变量必须是有符号类型，或改用 `i < n` 正向 + 反向索引。",
          "`for (int i = 0; i < strlen(s); i++)` 每次都重算长度，O(n²)，要把长度提到外面。",
        ],
        code: `#include <stdio.h>
#include <string.h>

int a[5] = {1, 2, 3, 4, 5};
for (int i = 4; i >= 0; i--) printf("%d ", a[i]);   // 正确
printf("\\n");

// 错误示例（会跑飞）
size_t n = 5;
for (size_t i = n - 1; i < n; i--) { /* ... */ }

// 长度提到循环外
const char *s = "abcdef";
size_t len = strlen(s);
for (size_t i = 0; i < len; i++) putchar(s[i]);
putchar('\\n');

// do-while 至少执行一次
int k = 10;
do { printf("once\\n"); } while (k < 5);`,
        lang: "C",
        pts: [
          "无符号循环变量倒序是死循环的高发区",
          "`strlen` 在循环条件里是 O(n²)",
          "`while (i--)` 与 `while (--i)` 差一次迭代",
        ],
        pit: "`for (int i = 0; i <= n; i++)` 访问长度 n 的数组必然越界，`<=` 与 `<` 混用是主要 bug 源。",
      },
      {
        t: "goto 的正当用途",
        lead: "goto 被骂了很多年，但在 C 里「统一错误清理」是它的标准用法，Linux 内核大量使用。",
        body: [
          "多层嵌套里出错需要释放多个资源时，goto 能让清理代码只写一份，比层层 if 嵌套清晰。",
          "永远不要用它往回跳（形成循环），也不要跨函数跳。",
        ],
        code: `#include <stdlib.h>
#include <stdio.h>

int process(void) {
    int ret = -1;
    char *a = NULL, *b = NULL;

    a = malloc(100);
    if (!a) goto cleanup;
    b = malloc(200);
    if (!b) goto cleanup;

    // 正常逻辑
    ret = 0;

cleanup:
    free(b);
    free(a);
    return ret;
}

int main(void) {
    printf("%d\\n", process());
    return 0;
}`,
        lang: "C",
        pts: [
          "清理标签统一放在函数末尾，`free(NULL)` 是安全的",
          "只向前跳，不要向后跳",
          "`goto` 不能跨函数",
        ],
        pit: "在 goto 之前声明的变量如果在跳转后被使用，可能跳过初始化——C 的 goto 不管变量初始化。",
      },
    ],
    qa: [
      ["switch 比 if 快吗？", "分支多且值密集时编译器会生成跳转表，O(1)；分支少时差别不大。"],
      ["for 和 while 能互相替代吗？", "能。for 适合「次数/范围明确」，while 适合「条件结束」。"],
    ],
    sum: "常量写左边防误赋值、switch 别漏 break、无符号别倒序、清理用 goto。",
  },

  {
    t: "数组与字符串",
    sub: "数组初始化 · 字符数组 · string.h · 安全边界",
    mins: 50,
    kw: "前缀和",
    goals: [
      "正确声明、初始化、遍历一维与二维数组",
      "分清字符数组与字符串字面量",
      "熟练使用 string.h 的核心函数",
      "写出不会越界的字符串处理代码",
    ],
    map: [
      ["函数", "作用", "注意"],
      ["`strlen`", "长度（不含 \\0）", "O(n)"],
      ["`strcpy`", "复制", "不检查长度"],
      ["`strncpy`", "限长复制", "可能不补 \\0"],
      ["`strcmp`", "比较", "返回差值符号"],
      ["`strcat`", "拼接", "目标必须够大"],
    ],
    mic: [
      {
        t: "数组的初始化与内存布局",
        lead: "C 数组就是一段连续内存，数组名在大多数表达式里退化为首元素指针。",
        body: [
          "`int a[5] = {1, 2}` 剩余元素补 0；`int a[5] = {0}` 全 0；局部数组不初始化就是垃圾值。",
          "二维数组 `int g[3][4]` 在内存里是行优先连续的，`g[i][j]` 等价于 `*(*(g+i)+j)`。",
        ],
        code: `#include <stdio.h>
#include <string.h>

int g[3][4];                     // 全局自动全 0
int a[5] = {1, 2};               // {1,2,0,0,0}
int b[5] = {0};                  // 全 0
int c[] = {1, 2, 3};              // 长度自动为 3

memset(a, 0, sizeof a);           // 按字节清零
printf("%zu\\n", sizeof(g) / sizeof(g[0]));   // 3 行

for (int i = 0; i < 3; i++)
    for (int j = 0; j < 4; j++)
        g[i][j] = i * 4 + j;
printf("%d\\n", g[1][2]);          // 6`,
        lang: "C",
        pts: [
          "`memset` 只适合 0 和 -1，填其他值会得到意外结果",
          "大数组放全局或用 `malloc`，局部大数组会栈溢出",
          "`sizeof(a)` 得到总字节数，除以元素大小才是长度",
        ],
        pit: "`int a[n]`（变长数组）C99 支持但在栈上分配，n 很大时直接崩；老编译器不支持会报错。",
      },
      {
        t: "字符数组与字符串字面量",
        lead: "C 没有字符串类型，字符串就是「以 \\0 结尾的 char 数组」——所有字符串函数都依赖这个约定。",
        body: [
          "`char s[] = \"abc\"` 创建可修改的数组（长度 4，含 \\0）；`char *p = \"abc\"` 指向只读的字面量，改它会段错误。",
          "字符串长度是 `strlen`（到 \\0 为止），不是 `sizeof`（数组总大小）。",
        ],
        code: `#include <stdio.h>
#include <string.h>

char s1[] = "abc";           // 可修改，sizeof = 4
char *s2 = "abc";            // 只读字面量
const char *s3 = "abc";      // 推荐写法

printf("%zu %zu\\n", sizeof(s1), strlen(s1));   // 4 3

s1[0] = 'X';
puts(s1);                    // Xbc
// s2[0] = 'X';              // 段错误

char buf[10] = {0};
snprintf(buf, sizeof buf, "%d-%d", 1, 2);       // 安全格式化
puts(buf);`,
        lang: "C",
        pts: [
          "`sizeof(s1)` 含结尾 \\0，`strlen` 不含",
          "修改字符串字面量是 UB，必须用数组或 `malloc`",
          "`snprintf` 会保证不越界，`sprintf` 不会",
        ],
        pit: "`char *p = \"abc\"; p[0] = 'x';` 在某些平台能跑（字面量在可写段），换平台就崩——绝不能这么写。",
      },
      {
        t: "string.h 核心函数",
        lead: "这六个函数覆盖了 C 里 90% 的字符串操作：strlen、strcpy、strncpy、strcmp、strcat、strstr。",
        body: [
          "`strcmp` 返回 0 表示相等，不能直接当布尔用（相等时是 0 即假）。`strncmp` 可限长比较。",
          "`strtok` 会修改原字符串（把分隔符改成 \\0），且不可重入——多线程或嵌套使用要用 `strtok_r`。",
        ],
        code: `#include <stdio.h>
#include <string.h>

char a[32] = "hello";
char b[32];

strcpy(b, a);                 // 不安全但短串可用
strncpy(b, a, sizeof b - 1);  // 更安全
b[sizeof b - 1] = '\\0';

printf("%d\\n", strcmp(a, b) == 0);   // 1
printf("%s\\n", strstr("hello world", "wor"));   // world

char line[] = "a,b,c";
char *tok = strtok(line, ",");
while (tok) {
    printf("[%s]", tok);
    tok = strtok(NULL, ",");
}
printf("\\n");

printf("%zu\\n", strspn("abc12", "abc"));   // 3，前缀匹配长度`,
        lang: "C",
        pts: [
          "`strcmp` 相等返回 0，判断相等要写 `== 0`",
          "`strncpy` 若源串长于 n 则不会补 \\0，必须手动补",
          "`strtok` 会破坏原串，需要保留原串就先复制",
        ],
        pit: "`if (strcmp(a, b))` 是「不相等」的意思，语义完全反了——这是极高频的写错点。",
      },
      {
        t: "安全边界：自己写长度检查",
        lead: "C 没有任何内置边界检查，所有「安全」都来自你写的判断。",
        body: [
          "读入字符串用 `fgets(buf, sizeof buf, stdin)` 而不是 `gets`（已从标准中移除）。",
          "拼接前先算长度：`if (strlen(a) + strlen(b) + 1 > sizeof(dst)) return -1;`",
        ],
        code: `#include <stdio.h>
#include <string.h>

int safeCat(char *dst, size_t cap, const char *src) {
    size_t dl = strlen(dst), sl = strlen(src);
    if (dl + sl + 1 > cap) return -1;      // 放不下
    memcpy(dst + dl, src, sl + 1);          // 连 \\0 一起拷
    return 0;
}

int main(void) {
    char buf[16] = "abc";
    if (safeCat(buf, sizeof buf, "def") == 0) puts(buf);

    char in[32];
    if (fgets(in, sizeof in, stdin)) {
        in[strcspn(in, "\\n")] = '\\0';      // 去掉换行
        puts(in);
    }
    return 0;
}`,
        lang: "C",
        pts: [
          "`fgets` 会保留换行符，通常要手动去掉",
          "`strcspn(s, \"\\n\")` 是去掉行尾换行的惯用法",
          "目标缓冲区大小始终作为参数显式传递",
        ],
        pit: "`fgets` 读满缓冲区时不会读完这一行，剩下内容会留在输入流里影响下次读取。",
      },
    ],
    qa: [
      ["为什么 `gets` 被移除了？", "它完全无法限制输入长度，任何使用都可能导致缓冲区溢出，C11 已将其从标准中删除。"],
      ["`strlen` 为什么是 O(n)？", "它必须逐字节扫描直到遇到 \\0，C 的字符串不保存长度信息。"],
    ],
    sum: "字符串以 \\0 结尾、strcmp 相等返回 0、读入用 fgets、拼接先算长度。",
  },

  {
    t: "函数与递归",
    sub: "声明与定义 · 传值/传指针 · 递归 · static",
    mins: 45,
    kw: "递归",
    goals: [
      "理解 C 只有传值，想改实参只能传指针",
      "会写函数声明并组织多文件",
      "写出正确的递归与终止条件",
      "知道 static 在函数与变量上的不同含义",
    ],
    map: [
      ["概念", "含义", "注意"],
      ["传值", "复制一份进函数", "改不到实参"],
      ["传指针", "复制地址", "可改指向的内容"],
      ["声明", "告诉编译器函数存在", "头文件里"],
      ["static 函数", "仅本文件可见", "内部链接"],
    ],
    mic: [
      {
        t: "只有传值：想改实参就传指针",
        lead: "C 没有引用，所有参数都是「值拷贝」；想修改调用方的变量，就传它的地址。",
        body: [
          "`void swap(int a, int b)` 交换的是副本，外面完全不变；`void swap(int *a, int *b)` 才能生效。",
          "传数组名等于传首元素地址，所以函数里改数组元素会影响原数组，但 `sizeof` 拿不到长度。",
        ],
        code: `#include <stdio.h>

void badSwap(int a, int b) { int t = a; a = b; b = t; }
void goodSwap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void fill(int *arr, size_t n, int v) {
    for (size_t i = 0; i < n; i++) arr[i] = v;
}

int main(void) {
    int x = 1, y = 2;
    badSwap(x, y);  printf("%d %d\\n", x, y);   // 1 2
    goodSwap(&x, &y); printf("%d %d\\n", x, y); // 2 1

    int a[5];
    fill(a, 5, 7);
    printf("%d %zu\\n", a[0], sizeof(a) / sizeof(a[0]));   // 7 5
    return 0;
}`,
        lang: "C",
        pts: [
          "结构体作为参数会整体拷贝，大结构体要传指针",
          "想通过函数返回多个值，用指针参数（out 参数）",
          "`const int *p` 表示不能通过 p 改值",
        ],
        pit: "`void f(int arr[])` 与 `void f(int *arr)` 完全相同，函数里 `sizeof(arr)` 是指针大小。",
      },
      {
        t: "函数声明、定义与多文件",
        lead: "C 的编译器只认「先声明后使用」，跨文件调用必须靠头文件里的声明。",
        body: [
          "声明只写签名（`int add(int, int);`），定义写实现。头文件用 include guard 防重复包含。",
          "`static` 函数只在当前文件可见，是 C 里的「私有函数」。",
        ],
        code: `// math_util.h
#ifndef MATH_UTIL_H
#define MATH_UTIL_H
int add(int a, int b);
int g_counter;            // 不要这样！头文件里别定义变量
extern int g_shared;      // 声明，定义放 .c
#endif

// math_util.c
#include "math_util.h"
int g_shared = 0;
int add(int a, int b) { return a + b; }
static int helper(void) { return 1; }   // 仅本文件可用

// main.c
#include "math_util.h"
int main(void) { return add(1, 2); }

// 编译：gcc main.c math_util.c -o app`,
        lang: "C",
        pts: [
          "头文件只放声明、宏、类型定义，不放变量定义",
          "`extern` 声明「别处有定义」，避免重复定义",
          "`static` 函数配合同名不同实现可用于模块隔离",
        ],
        pit: "在头文件里写 `int counter;` 又被多个 .c 包含，链接时报 multiple definition——要改成 `extern` + 一处定义。",
      },
      {
        t: "递归与调用栈",
        lead: "递归就是「函数调用自己」，每次调用都在栈上压一帧，所以要有终止条件也要控制深度。",
        body: [
          "写递归三步：确定终止条件、确定递推关系、确认每次向终止条件靠近。",
          "C 的栈通常 1~8MB，一层几十字节，深度几万就可能段错误。深搜要改迭代或加大栈（`ulimit -s`）。",
        ],
        code: `#include <stdio.h>

long long fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}

int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);   // 指数级，仅示意
}

void hanoi(int n, char a, char b, char c) {
    if (n == 0) return;
    hanoi(n - 1, a, c, b);
    printf("%c -> %c\\n", a, c);
    hanoi(n - 1, b, a, c);
}

int main(void) {
    printf("%lld\\n", fact(20));
    printf("%d\\n", fib(10));
    hanoi(2, 'A', 'B', 'C');
    return 0;
}`,
        lang: "C",
        pts: [
          "每次递归都要「规模变小」，否则永远到不了终止条件",
          "朴素 fib 是指数级，加记忆化数组变 O(n)",
          "深递归可用显式栈改写，避免爆栈",
        ],
        pit: "递归深度 1e5 以上常常直接段错误，且没有任何提示——调试时容易误以为是逻辑错误。",
      },
      {
        t: "static 与作用域",
        lead: "`static` 在 C 里有两种完全不同的含义：修饰函数/全局变量表示「本文件私有」，修饰局部变量表示「跨调用保留」。",
        body: [
          "static 全局变量/函数：内部链接，其他文件看不到。static 局部变量：只初始化一次，函数返回后值仍在。",
          "这跟 C++ 的 static 成员完全不同，别混。",
        ],
        code: `#include <stdio.h>

static int fileOnly = 0;          // 本文件私有

void counter(void) {
    static int calls = 0;         // 只初始化一次
    calls++;
    printf("第 %d 次调用\\n", calls);
}

static void helper(void) { }      // 本文件私有函数

int main(void) {
    counter(); counter(); counter();
    return 0;
}`,
        lang: "C",
        pts: [
          "static 局部变量在数据段，不在栈上",
          "static 变量默认零初始化",
          "static 函数无法被其他文件链接，可用于同文件内重名",
        ],
        pit: "static 局部变量在多线程下不是线程安全的（共享同一份），并发场景要加锁或改设计。",
      },
    ],
    qa: [
      ["C 的函数能返回数组吗？", "不能直接返回局部数组（会被销毁），要返回 `malloc` 的指针或通过参数传入缓冲区。"],
      ["为什么需要函数声明？", "C 编译器单遍处理，调用点之前必须知道函数签名，否则按隐式声明（返回 int）处理，容易出错。"],
    ],
    sum: "只有传值、改实参传指针、头文件放声明、递归先写终止。",
  },
];
