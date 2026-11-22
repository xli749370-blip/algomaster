// C 第 11-15 章 · 每章 4 节微课
module.exports = [
  {
    t: "C 手写数据结构",
    sub: "顺序表 · 链表 · 栈与队列 · 复杂度取舍",
    mins: 55,
    kw: "链表",
    goals: [
      "手写动态数组（顺序表）并支持扩容",
      "手写单链表与常见操作",
      "用数组或链表实现栈与队列",
      "按操作频率选择底层结构",
    ],
    map: [
      ["结构", "优点", "缺点"],
      ["顺序表", "随机访问 O(1)、缓存友好", "中间插入 O(n)"],
      ["链表", "插入删除 O(1)", "随机访问 O(n)"],
      ["栈", "简单、尾插尾删", "只能后进先出"],
      ["队列", "先进先出", "数组实现要处理循环"],
    ],
    mic: [
      {
        t: "顺序表：带容量与长度的数组",
        lead: "C 的数组不知道自己的长度，所以顺序表就是把「数组 + size + capacity」打包成一个结构体。",
        body: [
          "`push` 时若 `size == cap` 就扩容到 2 倍，`pop` 只减 size。这是所有动态数组（含 C++ vector）的基本原理。",
          "顺序表的内存连续，遍历与随机访问都最快，是默认选择。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size, cap;
} Vec;

void vecInit(Vec *v) { v->data = NULL; v->size = v->cap = 0; }

int vecPush(Vec *v, int x) {
    if (v->size == v->cap) {
        int nc = v->cap ? v->cap * 2 : 4;
        int *p = realloc(v->data, nc * sizeof(int));
        if (!p) return -1;
        v->data = p; v->cap = nc;
    }
    v->data[v->size++] = x;
    return 0;
}

void vecFree(Vec *v) { free(v->data); vecInit(v); }

int main(void) {
    Vec v; vecInit(&v);
    for (int i = 0; i < 5; i++) vecPush(&v, i * i);
    printf("%d %d \\n", v.size, v.cap);     // 5 8
    printf("%d\\n", v.data[4]);             // 16
    vecFree(&v);
    return 0;
}`,
        lang: "C",
        pts: [
          "容量按 2 倍增长保证均摊 O(1)",
          "扩容后旧指针失效，所有外部引用要更新",
          "用完必须 free，否则泄漏",
        ],
        pit: "`realloc` 返回值直接赋给 `v->data`，失败时原指针丢失导致泄漏。",
      },
      {
        t: "单链表：插入删除的代价与优势",
        lead: "链表每个节点单独分配，靠指针串起来——插入删除只需改指针，但找第 i 个要一路走。",
        body: [
          "头插法 O(1)，尾插法若无 tail 指针则 O(n)。删除需要「前驱」，所以常用「双指针」或「二级指针」。",
          "链表节点分散在堆上，缓存不友好，实测遍历比数组慢 3~10 倍——别盲目认为链表更快。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int val; struct Node *next; } Node;

Node *pushFront(Node *h, int v) {
    Node *n = malloc(sizeof *n);
    n->val = v; n->next = h;
    return n;
}

Node *removeValue(Node *h, int v) {
    Node **pp = &h;                    // 二级指针，统一处理头节点
    while (*pp) {
        if ((*pp)->val == v) {
            Node *dead = *pp;
            *pp = dead->next;
            free(dead);
        } else pp = &(*pp)->next;
    }
    return h;
}

int main(void) {
    Node *h = NULL;
    for (int i = 1; i <= 4; i++) h = pushFront(h, i);
    h = removeValue(h, 2);
    for (Node *p = h; p; p = p->next) printf("%d ", p->val);   // 4 3 1
    printf("\\n");
    while (h) { Node *t = h->next; free(h); h = t; }
    return 0;
}`,
        lang: "C",
        pts: [
          "用 `Node **pp` 可以避免「删除头节点」的特判",
          "删除前必须保存 next，free 后取不到",
          "需要频繁按下标访问时用顺序表，不要用链表",
        ],
        pit: "`free(dead)` 后继续使用 `dead->next` 是 use-after-free，必须先把 next 存出来。",
      },
      {
        t: "栈与队列：用数组实现最快",
        lead: "栈就是「只在尾部操作」的顺序表，队列用「循环数组」可以避免搬移。",
        body: [
          "栈：`push` 到 `size++`，`pop` 到 `size--`。队列：`head`/`tail` 两个下标，取模实现循环。",
          "循环队列要区分「空」与「满」：常用 `(tail + 1) % cap == head` 判满，牺牲一个位置。",
        ],
        code: `#include <stdio.h>
#define CAP 8

int stk[CAP], top = 0;
void push(int x) { if (top < CAP) stk[top++] = x; }
int pop(void) { return top > 0 ? stk[--top] : -1; }

int q[CAP], head = 0, tail = 0, qn = 0;
void enq(int x) { if (qn < CAP) { q[tail] = x; tail = (tail + 1) % CAP; qn++; } }
int deq(void) { if (!qn) return -1; int v = q[head]; head = (head + 1) % CAP; qn--; return v; }

int main(void) {
    push(1); push(2);
    printf("%d %d\\n", pop(), pop());     // 2 1

    enq(1); enq(2); enq(3);
    printf("%d %d\\n", deq(), deq());     // 1 2
    return 0;
}`,
        lang: "C",
        pts: [
          "栈用 `top` 指向「下一个空位」，pop 先减再取",
          "循环队列用取模避免元素搬移",
          "用 `qn` 记录元素数比「牺牲一个位置」更直观",
        ],
        pit: "循环队列忘取模（`tail++` 不 `% CAP`）会越界写，症状是偶尔崩溃或数据错乱。",
      },
      {
        t: "结构选择：按操作频率决定",
        lead: "没有「最好的结构」，只有「最匹配操作模式的结构」。",
        body: [
          "读多写少、需要随机访问 → 数组/顺序表；频繁头尾插删 → 双端队列；频繁在已知位置插删 → 链表；需要按 key 查找 → 哈希表（要自己写）。",
          "算法题里 90% 场景用数组就够，先别急着上链表。",
        ],
        code: `// 场景判断速查
// 1) 需要 a[i] 随时访问          -> 数组
// 2) 只在尾部 push/pop            -> 数组 + size
// 3) 头尾都要操作                  -> 循环数组或双端队列
// 4) 已持有节点指针要 O(1) 删除    -> 链表
// 5) 频繁查「是否存在」             -> 哈希表 / 排序 + 二分

// 哈希表最小实现（开放寻址）
#define HS 100003
int key[HS], val[HS];      // key 为 -1 表示空
int hfind(int k) {
    int i = (k % HS + HS) % HS;
    while (key[i] != -1 && key[i] != k) i = (i + 1) % HS;
    return i;
}`,
        lang: "C",
        pts: [
          "数组的缓存友好性常被低估，实际比链表快很多",
          "哈希表要处理冲突（开放寻址或拉链）",
          "数据结构的选择比微优化更能决定性能",
        ],
        pit: "用链表实现「需要随机访问」的结构，代码能跑但复杂度从 O(1) 退化到 O(n)。",
      },
    ],
    qa: [
      ["为什么 C 没有内置容器？", "C 的设计哲学是「最小运行时」，容器由库（如 GLib）或使用者自己实现，保持语言本身可移植、无隐藏开销。"],
      ["链表真的比数组快吗？", "只在「已定位节点后插入删除」时快。遍历、查找、随机访问都比数组慢，因为缓存不命中。"],
    ],
    sum: "顺序表管随机访问、链表管已知位置插删、栈队列用数组、选结构看操作模式。",
  },

  {
    t: "C 语言学习路线",
    sub: "进阶方向 · 与系统/嵌入式的联系 · 学习顺序",
    mins: 40,
    kw: "复杂度",
    goals: [
      "知道 C 学完之后可以往哪走",
      "理解 C 与操作系统、嵌入式的绑定关系",
      "规划从语法到工程的路径",
      "避免「学完语法就停滞」",
    ],
    map: [
      ["方向", "用到的 C 能力", "典型工作"],
      ["操作系统/内核", "指针、内存、汇编", "驱动、内核模块"],
      ["嵌入式", "寄存器、位操作、中断", "单片机固件"],
      ["基础设施", "网络、并发、性能", "数据库、中间件"],
      ["音视频/图形", "内存布局、SIMD", "编解码、渲染"],
    ],
    mic: [
      {
        t: "C 的能力边界与生态位置",
        lead: "C 是「系统层的通用语言」：操作系统、数据库、编译器、嵌入式，底层几乎都有 C。",
        body: [
          "C 的优势是「可预测」：没有 GC、没有隐藏拷贝、能看到每一字节。这让它适合做性能敏感、资源受限的底层。",
          "C 的劣势是「一切都得自己来」：没有容器、没有异常、没有包管理，工程化成本高。",
        ],
        code: `// C 的典型应用层次
// 硬件 / 驱动        -> C（寄存器操作、中断）
// 操作系统内核        -> C（Linux 内核绝大部分）
// 运行时 / 虚拟机     -> C / C++（JVM、CPython 解释器）
// 数据库 / 存储引擎    -> C / C++（SQLite、Redis）
// 上层业务            -> Java / Go / Python（很少用 C）

// 想深入系统方向，C 是必经之路
#include <stdio.h>
int main(void) { puts("C 是地基"); return 0; }`,
        lang: "C",
        pts: [
          "学会 C 不等于会写系统软件，还要补操作系统与计算机组成",
          "C 的很多「坑」其实是硬件与 ABI 的真相",
          "C 的工程能力体现在构建、调试、内存管理上",
        ],
        pit: "只背语法不动手写项目，学完 C 依然不会做任何实际的东西。",
      },
      {
        t: "从语法到工程的四步",
        lead: "第一步能写能跑，第二步能拆分模块，第三步能调试内存问题，第四步能读别人的代码。",
        body: [
          "练习路径：小工具（计算器、文本统计）→ 数据结构实现（链表、哈希表）→ 小项目（HTTP 服务器、JSON 解析器）→ 读开源（redis、lua 的部分模块）。",
          "每步都要配套：会写 Makefile、会用 gdb、会看 valgrind/ASan 报告。",
        ],
        code: `阶段一：语法与 IO
  · 命令行计算器、文件字符统计
阶段二：数据结构
  · 动态数组、链表、哈希表、二叉堆
阶段三：系统能力
  · 简易 HTTP 服务器（socket）
  · JSON 解析器（递归下降）
阶段四：工程与阅读
  · Makefile / CMake、单元测试
  · 读 SQLite / Lua / Redis 的小模块`,
        lang: "text",
        pts: [
          "每个阶段都要有可运行的产出",
          "调试能力（gdb + ASan）比多学语法更重要",
          "读优秀开源代码是提升最快的方式",
        ],
        pit: "一直在刷语法题，从没写过超过 500 行的程序，面试时说不出任何工程细节。",
      },
      {
        t: "必须补的三门基础课",
        lead: "C 的很多行为由「计算机组成 + 操作系统 + 编译原理」决定，缺了这三门只能靠死记。",
        body: [
          "计算机组成：字节序、对齐、缓存、寄存器，解释「为什么这样写更快」。",
          "操作系统：进程、线程、虚拟内存、文件描述符，解释「malloc 背后发生了什么」。编译原理：预处理、链接、符号表，解释「undefined reference」。",
        ],
        code: `对应关系
· 大小端 / 对齐      <- 计算机组成
· 栈溢出 / 段错误    <- 操作系统（虚拟内存）
· malloc 与 brk/mmap <- 操作系统
· 预处理 / 链接      <- 编译原理
· 内联 / 优化        <- 编译原理

推荐阅读顺序
1. 《深入理解计算机系统》(CSAPP) 前 9 章
2. 《操作系统导论》(OSTEP) 虚拟化部分
3. 《程序员的自我修养：链接、装载与库》`,
        lang: "text",
        pts: [
          "CSAPP 的实验（bomb、malloc lab）非常值得做",
          "理解链接过程能解决一大半「undefined reference」",
          "虚拟内存是理解指针与崩溃的关键",
        ],
        pit: "跳过基础直接学「高性能编程」，结果只会抄参数，遇到问题无法定位。",
      },
      {
        t: "常见误区与建议",
        lead: "C 学习最容易踩的四个误区：追求奇技淫巧、忽视警告、不用工具、只写不读。",
        body: [
          "别写 `a+++++b` 这种表达式；`-Wall -Wextra -Werror` 全开；从第一天就用 ASan 与 gdb；定期读别人的代码。",
          "另外：不要用 C 写业务系统（除非有明确理由），它的开发效率与安全性代价很高。",
        ],
        code: `# 推荐的编译选项（日常开发）
gcc -std=c11 -Wall -Wextra -Wpedantic -Werror \\
    -g -fsanitize=address,undefined -o app app.c

# 发布构建
gcc -std=c11 -O2 -DNDEBUG -o app app.c

# 检查未定义行为
./app   # UBSan 会打印具体行号与原因`,
        lang: "bash",
        pts: [
          "把警告当错误（`-Werror`），能消灭大量隐患",
          "ASan + UBSan 是 C 开发必备的安全网",
          "用 C 做业务前先评估「是否真的需要」",
        ],
        pit: "关掉警告「让它先编过」，等于把所有隐患推到运行时——这是 C 项目质量崩塌的起点。",
      },
    ],
    qa: [
      ["C 和 Rust 怎么选？", "新项目做系统编程可以优先考虑 Rust（内存安全）；维护既有 C 代码、嵌入式、内核仍以 C 为主。"],
      ["学 C 需要先学汇编吗？", "不必先学，但看一点汇编（尤其是函数调用与栈帧）能大幅加深对指针与崩溃的理解。"],
    ],
    sum: "四步走：能跑 → 能拆 → 能调 → 能读；补组成、操作系统、链接三门课。",
  },

  {
    t: "位运算与内存布局",
    sub: "补码 · 移位陷阱 · 位域 · 大小端",
    mins: 50,
    kw: "状态压缩",
    goals: [
      "理解补码与有符号数的二进制表示",
      "掌握掩码、置位、清位、取位技巧",
      "知道位域与对齐的关系",
      "会判断并处理大小端",
    ],
    map: [
      ["操作", "写法", "用途"],
      ["取第 i 位", "`(x >> i) & 1`", "状态判断"],
      ["置位", "`x | (1u << i)`", "打开开关"],
      ["清位", "`x & ~(1u << i)`", "关闭开关"],
      ["检测大小端", "读联合体首字节", "跨平台数据"],
    ],
    mic: [
      {
        t: "补码与有符号表示",
        lead: "负数在计算机里用补码表示：`-x` 等于 `~x + 1`，好处是加减法可以统一用加法器。",
        body: [
          "8 位下 `-1` 是 `11111111`，`-128` 是 `10000000`。所以有符号数的范围是 `-2ⁿ⁻¹` 到 `2ⁿ⁻¹-1`，负数比正数多一个。",
          "补码让 `x & -x` 能取出最低位的 1，这是树状数组与位计数的核心技巧。",
        ],
        code: `#include <stdio.h>

int main(void) {
    int x = -1;
    printf("%08x\\n", (unsigned) x);       // ffffffff

    int a = 5;                             // 0101
    printf("%d\\n", a & -a);                // 1，最低位 1
    printf("%d\\n", a & (a - 1));           // 4，清掉最低位 1

    int cnt = 0, t = 0b101101;
    while (t) { t &= t - 1; cnt++; }
    printf("%d\\n", cnt);                   // 4

    printf("%d\\n", -7 >> 1);               // -4（算术右移）
    printf("%u\\n", (unsigned) -7 >> 1);    // 2147483644（逻辑右移）
    return 0;
}`,
        lang: "C",
        pts: [
          "`x & -x` 取最低位 1，`x & (x-1)` 清除最低位 1",
          "有符号右移是算术右移（补符号位）",
          "printf 用 `%x` 打印十六进制，负数要先转 unsigned",
        ],
        pit: "`1 << 31` 在 int 上是 UB（符号位），要写 `1u << 31` 或 `1LL << 31`。",
      },
      {
        t: "掩码、标志位与位域",
        lead: "一个整数能存 32 个开关，这是最省内存的「布尔数组」；位域则让结构体按位分配。",
        body: [
          "用宏定义每一位的含义（`#define FLAG_A (1u << 0)`），用 `|` 组合、`&` 检测，是可读性与效率的平衡。",
          "位域 `struct { unsigned a : 3; unsigned b : 5; }` 让字段只占指定位数，但布局依赖编译器，不适合跨平台协议。",
        ],
        code: `#include <stdio.h>

#define FLAG_READ   (1u << 0)
#define FLAG_WRITE  (1u << 1)
#define FLAG_EXEC   (1u << 2)

struct Flags {
    unsigned readable : 1;
    unsigned writable : 1;
    unsigned level    : 4;      // 0~15
};

int main(void) {
    unsigned perm = 0;
    perm |= FLAG_READ | FLAG_WRITE;
    printf("%u\\n", (perm & FLAG_READ) != 0);      // 1
    perm &= ~FLAG_READ;
    printf("%u\\n", (perm & FLAG_READ) != 0);      // 0

    struct Flags f = {1, 1, 9};
    printf("%zu %u\\n", sizeof f, f.level);        // 4 9
    return 0;
}`,
        lang: "C",
        pts: [
          "标志位用无符号数，避免符号位带来的麻烦",
          "位域的 `sizeof` 与字段顺序依赖编译器",
          "跨平台协议不要用位域，手动移位更可靠",
        ],
        pit: "`if (perm & FLAG_READ == 1)` 的优先级是 `==` 高于 `&`，判断永远错——必须加括号。",
      },
      {
        t: "大小端与字节序",
        lead: "小端把低位字节放低地址（x86），大端反过来（网络字节序）。跨平台传输必须统一。",
        body: [
          "用 `htonl/ntohl` 做主机序与网络序转换。判断本机字节序可以用联合体或指针强转。",
          "把一个 int 按字节写进文件再读，在不同字节序的机器上会解析错。",
        ],
        code: `#include <stdio.h>
#include <stdint.h>
#include <arpa/inet.h>

int main(void) {
    uint32_t x = 0x01020304;
    unsigned char *p = (unsigned char *) &x;
    printf("%02x %02x %02x %02x\\n", p[0], p[1], p[2], p[3]);
    // 小端输出：04 03 02 01

    printf("%08x\\n", x);                       // 01020304
    printf("%08x\\n", htonl(x));                // 04030201（网络序）
    printf("%08x\\n", ntohl(htonl(x)));          // 01020304

    // 判断字节序
    uint16_t y = 0x0001;
    printf("%s\\n", *(unsigned char *) &y == 1 ? "little" : "big");
    return 0;
}`,
        lang: "C",
        pts: [
          "x86/ARM 常见配置都是小端",
          "网络传输统一用大端（网络字节序）",
          "`htonl/htons` 在 `<arpa/inet.h>`（Windows 是 winsock2.h）",
        ],
        pit: "直接把结构体 fwrite 到文件再跨平台读，字节序与对齐都会出问题——必须逐字段序列化。",
      },
      {
        t: "内存布局：栈、堆、数据段",
        lead: "一个 C 程序的地址空间分成代码段、数据段、BSS、堆、栈——理解它才能看懂很多崩溃。",
        body: [
          "全局/静态变量在数据段（已初始化）或 BSS（未初始化，自动为 0）；局部变量在栈上；`malloc` 在堆上。",
          "栈从高地址向低地址增长，堆相反。栈溢出与堆溢出表现不同：前者段错误，后者可能悄悄破坏数据。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

int g_init = 1;        // 数据段
int g_zero;            // BSS（自动 0）
static int s = 2;      // 数据段

int main(void) {
    int local = 3;                       // 栈
    int *heap = malloc(sizeof(int));     // 堆
    *heap = 4;

    printf("code  %p\\n", (void *) main);
    printf("data  %p\\n", (void *) &g_init);
    printf("bss   %p\\n", (void *) &g_zero);
    printf("heap  %p\\n", (void *) heap);
    printf("stack %p\\n", (void *) &local);

    free(heap);
    return 0;
}`,
        lang: "C",
        pts: [
          "BSS 段不占可执行文件体积（只有长度信息）",
          "栈大小有限（常见 8MB），大数组放堆或全局",
          "函数内的 `static` 变量在数据段，不是栈",
        ],
        pit: "在函数里定义 `int a[1000000]` 会直接栈溢出崩溃，而同样的全局数组完全没问题。",
      },
    ],
    qa: [
      ["为什么要用补码？", "让减法可以用加法实现，硬件只需一套加法器；同时 0 只有一种表示。"],
      ["栈溢出和堆溢出有什么区别？", "栈溢出通常是递归过深或局部数组过大，直接段错误；堆溢出会破坏堆管理信息，崩溃点往往滞后。"],
    ],
    sum: "补码取负、位操作加括号、跨平台统一大端、大数组别放栈上。",
  },

  {
    t: "函数指针与回调",
    sub: "声明语法 · qsort 回调 · 函数表 · 状态机",
    mins: 50,
    kw: "排序",
    goals: [
      "读懂并写出函数指针声明",
      "用回调实现通用逻辑（qsort、事件）",
      "用函数指针数组实现分派表",
      "理解回调在 C 里的典型用途",
    ],
    map: [
      ["声明", "含义", "用法"],
      ["`int (*f)(int)`", "指向函数的指针", "`f(1)` 或 `(*f)(1)`"],
      ["`int *f(int)`", "返回指针的函数", "别与上面混淆"],
      ["`int (*arr[3])(int)`", "函数指针数组", "分派表"],
      ["`typedef`", "起别名", "简化声明"],
    ],
    mic: [
      {
        t: "函数指针的声明与调用",
        lead: "函数名本身就是地址，函数指针就是「存函数地址的变量」——这让「把函数当参数传」成为可能。",
        body: [
          "`int (*f)(int, int)` 表示「f 是指向「接收两个 int 返回 int 的函数」的指针」。括号必须加，否则变成「返回指针的函数」。",
          "`f = add;` 不需要取地址符（也可以写 `&add`）；调用 `f(1,2)` 或 `(*f)(1,2)` 都行。",
        ],
        code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main(void) {
    int (*f)(int, int) = add;
    printf("%d\\n", f(2, 3));           // 5
    f = mul;
    printf("%d\\n", (*f)(2, 3));        // 6

    // typedef 简化
    typedef int (*BinOp)(int, int);
    BinOp ops[2] = {add, mul};
    for (int i = 0; i < 2; i++) printf("%d ", ops[i](4, 5));
    printf("\\n");                       // 9 20
    return 0;
}`,
        lang: "C",
        pts: [
          "`int (*f)(int)` 与 `int *f(int)` 完全不同",
          "函数指针可以比较、可以放进数组与结构体",
          "`typedef` 能让复杂声明可读",
        ],
        pit: "漏写括号 `int *f(int)` 会被解析成「返回 int* 的函数」，报错信息常常误导人。",
      },
      {
        t: "回调：把行为参数化",
        lead: "C 没有泛型与 lambda，回调（函数指针）就是「把一段逻辑传给另一个函数」的唯一手段。",
        body: [
          "`qsort` 的比较函数、`bsearch` 的比较、事件系统的监听器、线程入口函数，全是回调。",
          "回调函数必须匹配签名，且要注意「谁来释放上下文」。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

int byAsc(const void *a, const void *b) {
    return (*(const int *) a > *(const int *) b) - (*(const int *) a < *(const int *) b);
}

void forEach(int *a, int n, void (*fn)(int)) {
    for (int i = 0; i < n; i++) fn(a[i]);
}

void printIt(int x) { printf("%d ", x); }
void doubleIt(int x) { printf("%d ", x * 2); }

int main(void) {
    int a[5] = {5, 2, 8, 1, 9};
    qsort(a, 5, sizeof a[0], byAsc);
    forEach(a, 5, printIt);   printf("\\n");
    forEach(a, 5, doubleIt);  printf("\\n");
    return 0;
}`,
        lang: "C",
        pts: [
          "`qsort` 的比较函数参数是 `const void *`，必须强转",
          "回调让「遍历」与「对每个元素做什么」解耦",
          "C 没有闭包，需要上下文时额外传 `void *ctx`",
        ],
        pit: "在回调里改了被遍历的数组，会破坏遍历逻辑（类似 C++ 迭代器失效）。",
      },
      {
        t: "函数指针数组：分派表",
        lead: "一堆 `if/else` 或 `switch` 处理不同类型的命令时，函数表更清晰也更好扩展。",
        body: [
          "把「命令字符串 → 处理函数」做成表，新增命令只加一行，符合开闭原则。",
          "这是 C 里实现「多态」的常用手法（结合结构体里的函数指针，就是 C 版的虚表）。",
        ],
        code: `#include <stdio.h>
#include <string.h>

void cmdAdd(void)  { puts("add"); }
void cmdDel(void)  { puts("del"); }
void cmdList(void) { puts("list"); }

typedef struct { const char *name; void (*fn)(void); } Cmd;

Cmd table[] = {
    {"add",  cmdAdd},
    {"del",  cmdDel},
    {"list", cmdList},
};

void dispatch(const char *name) {
    for (size_t i = 0; i < sizeof table / sizeof table[0]; i++)
        if (strcmp(table[i].name, name) == 0) { table[i].fn(); return; }
    printf("unknown: %s\\n", name);
}

int main(void) {
    dispatch("add");
    dispatch("list");
    dispatch("xyz");
    return 0;
}`,
        lang: "C",
        pts: [
          "用 `sizeof table / sizeof table[0]` 求表长",
          "表驱动比长 switch 更易扩展与测试",
          "结构体里放函数指针 = C 的「接口」",
        ],
        pit: "表里的函数签名必须完全一致，参数多了少了都会在调用时崩溃或读到垃圾。",
      },
      {
        t: "用函数指针写状态机",
        lead: "状态机的每个状态是一个函数，返回下一个状态的函数指针——代码即状态图。",
        body: [
          "这种写法避免了巨大的 switch，每个状态的处理逻辑独立可测，状态转移一目了然。",
          "在协议解析、UI 流程、游戏 AI 中非常常见。",
        ],
        code: `#include <stdio.h>

struct Ctx { int input; };

typedef void (*State)(struct Ctx *);

void idle(struct Ctx *c);
void running(struct Ctx *c);
void done(struct Ctx *c);

State next = idle;

void idle(struct Ctx *c) {
    puts("idle");
    if (c->input == 1) next = running;
}
void running(struct Ctx *c) {
    puts("running");
    if (c->input == 2) next = done;
}
void done(struct Ctx *c) { puts("done"); }

int main(void) {
    struct Ctx c = {0};
    int inputs[] = {1, 2, 0};
    for (int i = 0; i < 3; i++) { c.input = inputs[i]; next(&c); }
    return 0;
}`,
        lang: "C",
        pts: [
          "状态函数的签名必须统一",
          "转移逻辑集中在状态函数里，比 switch 好维护",
          "复杂状态机可把转移表数据化（状态 × 输入 → 新状态）",
        ],
        pit: "状态函数里忘记更新 next，流程会卡在同一状态——调试时表现为「重复输出同一行」。",
      },
    ],
    qa: [
      ["函数指针和 void* 能互转吗？", "标准不允许（函数指针与对象指针可能不同大小），POSIX 允许，但跨平台代码不要这么做。"],
      ["回调里怎么带上下文？", "额外传一个 `void *ctx` 参数，回调内部强转回真实类型，这是 C 的标准做法。"],
    ],
    sum: "函数指针要加括号、回调配 void* 上下文、分派表代替长 switch、状态机用函数指针。",
  },

  {
    t: "宏与预处理进阶",
    sub: "带参宏陷阱 · do-while(0) · 字符串化 · 条件编译",
    mins: 45,
    kw: "复杂度",
    goals: [
      "写出安全的多语句宏",
      "用 # 与 ## 做字符串化与拼接",
      "用条件编译隔离平台代码",
      "知道宏什么时候必须用、什么时候该避免",
    ],
    map: [
      ["语法", "作用", "示例"],
      ["`#define`", "文本替换", "常量、简单函数"],
      ["`#`", "字符串化", "`#x` → \"x\""],
      ["`##`", "记号拼接", "`a##b` → ab"],
      ["`#if/#ifdef`", "条件编译", "平台/调试"],
    ],
    mic: [
      {
        t: "带参宏的三重陷阱",
        lead: "宏是文本替换，所以「优先级、副作用、类型」三个问题都归你管。",
        body: [
          "① 参数不加括号 → 优先级错；② 参数被多次求值 → 副作用（`i++` 自增两次）；③ 没有类型检查 → 传错类型不报错。",
          "结论：能用 `static inline` 函数就别用宏；宏只用于「需要文本级能力」的场景。",
        ],
        code: `#include <stdio.h>

#define SQ_BAD(x)   x * x
#define SQ_OK(x)    ((x) * (x))
#define MAX_BAD(a,b) ((a) > (b) ? (a) : (b))

static inline int sq(int x) { return x * x; }   // 首选

int main(void) {
    printf("%d\\n", SQ_BAD(1 + 2));    // 5（错）
    printf("%d\\n", SQ_OK(1 + 2));     // 9
    printf("%d\\n", sq(1 + 2));        // 9

    int i = 3;
    printf("%d\\n", MAX_BAD(i++, 10)); // i 自增两次
    printf("%d\\n", i);                // 5
    return 0;
}`,
        lang: "C",
        pts: [
          "参数与整体都加括号，能解决优先级但解决不了副作用",
          "`static inline` 函数有类型检查、可调试、无副作用",
          "宏名全大写，提醒使用者「这是宏」",
        ],
        pit: "用宏实现「函数」的最大隐患是副作用：`MAX(i++, j)` 会让 i 自增两次。",
      },
      {
        t: "do { } while (0) 的用处",
        lead: "多语句宏如果不加包裹，在 `if (x) MACRO();` 里就会破坏控制流。",
        body: [
          "`do { ... } while (0)` 让宏成为一个「单语句块」，可以在末尾安全地加分号，也能配合 if/else 使用。",
          "另一种做法是用 `({ ... })`（GCC 扩展语句表达式），但不可移植。",
        ],
        code: `#include <stdio.h>

#define SWAP_BAD(a, b)  int t = a; a = b; b = t;
#define SWAP_OK(a, b)   do { int t = (a); (a) = (b); (b) = t; } while (0)

int main(void) {
    int x = 1, y = 2;
    // if (x < y) SWAP_BAD(x, y);   // 展开后 t 的作用域破坏 if
    if (x < y) SWAP_OK(x, y);
    printf("%d %d\\n", x, y);         // 2 1

    // 也可以安全地写成
    if (x) SWAP_OK(x, y);
    else puts("no");
    return 0;
}`,
        lang: "C",
        pts: [
          "`do-while(0)` 后面必须加分号，与普通语句一致",
          "宏内变量用唯一名字或加花括号限制作用域",
          "`if/else` 里用宏必须保证展开后是单语句",
        ],
        pit: "多语句宏没包裹，在 `if (...) MACRO(); else ...` 里会编译报错，或是 else 绑错分支。",
      },
      {
        t: "字符串化与记号拼接",
        lead: "`#x` 把参数变成字符串，`a##b` 把两个记号拼成一个——这是写日志宏与批量定义的关键。",
        body: [
          "调试宏 `LOG(x)` 打印「表达式名 = 值」，就是靠 `#x` 实现的。",
          "`##` 常用于生成一批函数或字段名（如 `DEF_CMD(name)` 生成 `cmd_name`）。",
        ],
        code: `#include <stdio.h>

#define STR(x) #x
#define XSTR(x) STR(x)
#define LOG_INT(x) printf("%s = %d\\n", #x, (x))

#define CONCAT(a, b) a##b
#define MAKE_GETTER(field) int get_##field(void) { return field; }

int age = 18;
MAKE_GETTER(age)          // 生成 int get_age(void)

int main(void) {
    int count = 42;
    LOG_INT(count);                 // count = 42

    printf("%s\\n", STR(hello));    // hello
    printf("%s\\n", XSTR(__LINE__));// 展开后是行号字符串

    int CONCAT(my, Var) = 7;        // 等价 int myVar = 7;
    printf("%d %d\\n", myVar, get_age());
    return 0;
}`,
        lang: "C",
        pts: [
          "`#x` 不会展开 x 本身，需要 `XSTR` 两层才能展开宏",
          "`##` 只能拼接合法记号，拼出非法名会编译错误",
          "这类技巧在日志、协议定义、测试框架里很常见",
        ],
        pit: "`STR(__LINE__)` 得到字符串 \"__LINE__\"，必须用两层宏 `XSTR(__LINE__)` 才是实际行号。",
      },
      {
        t: "条件编译的工程用法",
        lead: "同一份代码在不同平台/配置下编译，是 C 项目可移植性的核心手段。",
        body: [
          "用 `#if defined(_WIN32)` 分支平台代码，用 `#ifndef NDEBUG` 保留断言，用 `#if 0` 临时屏蔽代码块。",
          "编译期开关通过 `-D` 传入，不要写死在头文件里。",
        ],
        code: `#include <stdio.h>

#ifdef _WIN32
  #include <windows.h>
  #define SLEEP(ms) Sleep(ms)
#else
  #include <unistd.h>
  #define SLEEP(ms) usleep((ms) * 1000)
#endif

#ifndef NDEBUG
  #define ASSERT(x) do { if (!(x)) { \\
      fprintf(stderr, "assert fail: %s at %s:%d\\n", #x, __FILE__, __LINE__); \\
      abort(); } } while (0)
#else
  #define ASSERT(x) ((void) 0)
#endif

int main(void) {
    ASSERT(1 + 1 == 2);
    printf("ok\\n");
    return 0;
}
// 编译：gcc main.c -o app       （带断言）
//       gcc -DNDEBUG main.c -o app（关闭断言）`,
        lang: "C",
        pts: [
          "`assert.h` 的 `assert` 在 `-DNDEBUG` 时自动失效",
          "自定义 ASSERT 要打印文件名与行号",
          "`#if 0 ... #endif` 是最安全的「注释掉代码」方式",
        ],
        pit: "在断言里写有副作用的表达式（`assert(f())`），关掉断言后逻辑就变了。",
      },
    ],
    qa: [
      ["宏和 const 常量怎么选？", "常量用 `const`/`enum`（有类型、可调试）；宏只在需要预处理能力（条件编译、字符串化）时用。"],
      ["`#pragma once` 和 include guard 哪个好？", "`#pragma once` 更简洁且不会因宏重名出错；include guard 是标准写法，兼容性最好。"],
    ],
    sum: "宏加括号、多语句 use do-while、日志用 # 字符串化、开关走 -D。",
  },
];
