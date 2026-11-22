// C 第 6-10 章 · 每章 4 节微课
module.exports = [
  {
    t: "指针精通（上）",
    sub: "指针与地址 · 指针运算 · 指针与数组 · 多级指针",
    mins: 55,
    kw: "链表",
    goals: [
      "读懂指针的声明与解引用",
      "理解指针算术的单位是「元素」",
      "分清数组名与指针变量的差异",
      "会用二级指针修改指针本身",
    ],
    map: [
      ["表达式", "含义", "类型"],
      ["`p`", "地址值", "`int *`"],
      ["`*p`", "指向的值", "`int`"],
      ["`&x`", "x 的地址", "`int *`"],
      ["`p + 1`", "前进一个元素", "`int *`"],
      ["`**pp`", "二级指针的目标值", "`int`"],
    ],
    mic: [
      {
        t: "声明与解引用",
        lead: "`int *p` 读作「p 是一个指向 int 的指针」，`*` 属于类型；`*p` 在表达式里才是解引用。",
        body: [
          "指针变量的值是一个地址，`&x` 取地址，`*p` 顺着地址取内容。未初始化的指针是野指针，解引用是 UB。",
          "`const int *p` 不能改值，`int * const p` 不能改指向，两者组合就是都不能改。",
        ],
        code: `#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;

    printf("%p %d\\n", (void *) p, *p);
    *p = 100;
    printf("%d\\n", x);          // 100

    const int *pc = &x;          // 不能通过 pc 改值
    int *const cp = &x;          // cp 不能改指向
    // pc = NULL; 合法；*pc = 1; 非法
    // cp = NULL; 非法；*cp = 1; 合法

    int *np = NULL;
    printf("%d\\n", np == NULL);  // 1
    return 0;
}`,
        lang: "C",
        pts: [
          "`p` 本身也是一个变量，占 8 字节（64 位）",
          "`printf` 打印地址用 `%p` 并强转 `(void *)`",
          "`NULL` 是空指针常量，解引用必崩",
        ],
        pit: "`int *p, q;` 中 p 是指针、q 是 int。一行声明多个指针要写 `int *p, *q;`。",
      },
      {
        t: "指针算术：单位是元素",
        lead: "`p + 1` 不是地址加 1 字节，而是加 `sizeof(*p)` 字节——这是指针类型存在的意义。",
        body: [
          "对 `int *` 加 1 前进 4 字节，对 `char *` 加 1 前进 1 字节。两个同类型指针相减得到「相隔多少个元素」。",
          "指针只能在同一数组内做算术；跨数组相减是 UB（虽然实践中常能得到数值）。",
        ],
        code: `#include <stdio.h>

int main(void) {
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;

    printf("%d %d\\n", *p, *(p + 2));    // 10 30
    printf("%td\\n", &a[3] - &a[0]);     // 3
    printf("%zu\\n", sizeof(int));       // 4

    char *cp = (char *) a;
    printf("%d\\n", *(int *) (cp + 4));  // 20，按字节偏移

    p++;
    printf("%d\\n", *p);                 // 20
    return 0;
}`,
        lang: "C",
        pts: [
          "指针相减的结果类型是 `ptrdiff_t`，用 `%td` 打印",
          "`a[i]` 完全等价于 `*(a + i)`",
          "越界指针即使不解引用也是 UB（理论上）",
        ],
        pit: "把指针强转成 `char *` 再按字节偏移，很容易踩到对齐问题——跨类型访问要用 memcpy。",
      },
      {
        t: "数组名不是指针变量",
        lead: "数组名在大多数表达式里退化为首元素地址，但它本身不是指针变量——不能赋值、`sizeof` 得到整个数组大小。",
        body: [
          "`sizeof(a)` 对数组是总字节数，对指针是 8。`&a` 的类型是「指向整个数组的指针」，`&a + 1` 会跳过整个数组。",
          "数组作为函数参数时**必然**退化为指针，长度信息丢失，所以要额外传 size。",
        ],
        code: `#include <stdio.h>

void f(int arr[]) {                 // 等价于 int *arr
    printf("%zu\\n", sizeof(arr));   // 8（指针大小）
}

int main(void) {
    int a[10];
    printf("%zu\\n", sizeof(a));      // 40
    f(a);

    // a = NULL;   // 编译错误：数组名不是可修改的左值

    int (*pa)[10] = &a;               // 指向整个数组的指针
    printf("%zu\\n", sizeof(*pa));    // 40
    printf("%td\\n", (char *) (pa + 1) - (char *) pa);  // 40
    return 0;
}`,
        lang: "C",
        pts: [
          "`int *p[10]` 是「10 个指针的数组」，`int (*p)[10]` 是「指向数组的指针」",
          "函数里想拿数组长度必须额外传参",
          "`&a` 与 `a` 的地址值相同但类型不同",
        ],
        pit: "在函数里写 `sizeof(arr) / sizeof(arr[0])` 算出 2（8/4），据此循环会越界。",
      },
      {
        t: "二级指针：修改指针本身",
        lead: "函数里想改变「调用方的指针指向哪」，就必须传指针的地址，也就是二级指针。",
        body: [
          "典型场景：链表头指针的插入删除、`malloc` 失败后修改传入的指针、二维数组的动态创建。",
          "`**pp` 是最终的值，`*pp` 是那一级指针。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

void alloc(int **pp, int n) {
    *pp = malloc(n * sizeof(int));   // 修改调用方的指针
    if (*pp) for (int i = 0; i < n; i++) (*pp)[i] = i;
}

void pushFront(int **head, int v) {
    int *node = malloc(sizeof(int));
    *node = v;
    // 简化示意：这里把 node 当成新头
    *head = node;
}

int main(void) {
    int *arr = NULL;
    alloc(&arr, 5);
    printf("%d\\n", arr[3]);          // 3
    free(arr);

    int *head = NULL;
    pushFront(&head, 7);
    printf("%d\\n", *head);           // 7
    free(head);
    return 0;
}`,
        lang: "C",
        pts: [
          "`int **pp` 指向「int 指针」",
          "链表操作几乎都靠二级指针简化头节点处理",
          "`(*pp)[i]` 的括号不能省，`*pp[i]` 含义完全不同",
        ],
        pit: "`*pp[i]` 等价于 `*(pp[i])`，先取下标的指针再解引用，与 `(*pp)[i]` 完全不同——括号是必需的。",
      },
    ],
    qa: [
      ["指针和数组是一回事吗？", "不是。数组是连续内存块，指针是存地址的变量；数组名会退化为指针，但不能赋值、sizeof 不同。"],
      ["为什么 `&a + 1` 跳过整个数组？", "因为 `&a` 的类型是 `int (*)[10]`，加 1 前进一个「10 个 int」的大小。"],
    ],
    sum: "指针算术按元素、数组名不是变量、函数传数组必退化、改指针用二级指针。",
  },

  {
    t: "指针精通（下）与动态内存",
    sub: "malloc/free · 内存泄漏 · 野指针 · 动态数组",
    mins: 55,
    kw: "链表",
    goals: [
      "正确申请与释放堆内存",
      "识别泄漏、悬垂、重复释放三类问题",
      "用 malloc 创建与扩展二维数组",
      "知道 calloc/realloc 的差异",
    ],
    map: [
      ["函数", "作用", "注意"],
      ["`malloc`", "申请未初始化内存", "检查 NULL"],
      ["`calloc`", "申请并清零", "两个参数相乘"],
      ["`realloc`", "调整大小", "可能搬家，旧指针失效"],
      ["`free`", "释放", "只能释放 malloc 系列"],
    ],
    mic: [
      {
        t: "malloc 与 free 的正确姿势",
        lead: "`malloc` 从堆上要一块内存，返回 `void *`；用完必须 `free`，且只能 free 一次。",
        body: [
          "`malloc` 不会清零，拿到的是垃圾值；要清零用 `calloc` 或 `memset`。申请失败返回 NULL，虽然现代系统很少失败，但检查是习惯。",
          "`free(p)` 之后 p 变成悬垂指针，最好立刻 `p = NULL`。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    int n = 5;
    int *a = malloc(n * sizeof *a);      // 推荐写法：sizeof *a
    if (!a) return 1;                    // 必须检查
    memset(a, 0, n * sizeof *a);

    for (int i = 0; i < n; i++) a[i] = i * i;
    printf("%d\\n", a[4]);               // 16

    free(a);
    a = NULL;                            // 防悬垂
    return 0;
}`,
        lang: "C",
        pts: [
          "`malloc(n * sizeof *a)` 比 `sizeof(int)` 更不易出错",
          "`free(NULL)` 是安全的，什么也不做",
          "`free` 之后立刻置 NULL，能避免大部分 use-after-free",
        ],
        pit: "`malloc(10)` 只给 10 字节，若当成 `int[10]` 用就严重越界——`malloc` 的参数是字节数。",
      },
      {
        t: "三类内存错误：泄漏、悬垂、重复释放",
        lead: "C 的内存问题几乎都能归到这三类，且它们往往在很久之后才崩溃。",
        body: [
          "**泄漏**：申请了不释放，长期运行内存持续增长。**悬垂**：释放后继续用。**重复释放**：同一指针 free 两次，堆结构被破坏。",
          "还有一个隐蔽的：**越界写**会破坏堆的管理信息，崩溃点与出错点相距很远。",
        ],
        code: `#include <stdlib.h>
#include <stdio.h>

void leak(void) {
    int *p = malloc(100);
    // 忘记 free → 泄漏
}

void dangling(void) {
    int *p = malloc(sizeof(int));
    free(p);
    // *p = 1;        // 悬垂，UB
}

void doubleFree(void) {
    int *p = malloc(sizeof(int));
    free(p);
    // free(p);       // 重复释放，堆损坏
}

int main(void) {
    leak(); dangling(); doubleFree();
    return 0;
}`,
        lang: "C",
        pts: [
          "用 `-fsanitize=address` 编译能立刻定位这三类问题",
          "Valgrind 也能检测泄漏与非法访问（Linux）",
          "泄漏在短命程序里影响不大，在服务里是致命的",
        ],
        pit: "把栈上变量的地址当返回值（`return &local`），得到的是悬垂指针，行为不可预测。",
      },
      {
        t: "realloc 与动态扩容",
        lead: "`realloc` 调整已分配块的大小，可能原地扩展，也可能搬到新地址——旧指针必须用返回值覆盖。",
        body: [
          "`p = realloc(p, newSize)` 的写法有风险：失败时返回 NULL 且原块还在，直接覆盖就泄漏了。安全写法用临时变量。",
          "容量按 2 倍增长，均摊 O(1)，和 C++ vector 的策略一致。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int cap = 4, n = 0;
    int *a = malloc(cap * sizeof *a);

    for (int i = 0; i < 10; i++) {
        if (n == cap) {
            int *tmp = realloc(a, (cap * 2) * sizeof *a);
            if (!tmp) { free(a); return 1; }   // 失败：原块仍有效
            a = tmp;
            cap *= 2;
        }
        a[n++] = i;
    }
    printf("%d %d\\n", n, cap);       // 10 16
    free(a);
    return 0;
}`,
        lang: "C",
        pts: [
          "`realloc(p, 0)` 等价于 free(p)，别依赖",
          "扩容后旧指针可能失效，所有指向旧块的指针都要更新",
          "`realloc` 不会初始化新增的部分",
        ],
        pit: "`a = realloc(a, size)` 失败时 a 被置 NULL，原内存泄漏且再也无法释放。",
      },
      {
        t: "动态二维数组与释放顺序",
        lead: "C 没有内置的二维动态数组，要么「一次分配 + 手动算下标」，要么「分配指针数组 + 每行单独分配」。",
        body: [
          "方式一（连续内存）：`int *a = malloc(n*m*sizeof(int))`，访问用 `a[i*m+j]`。缓存友好，只需一次 free。",
          "方式二（行指针）：`int **a`，每行单独 malloc，释放时要逐行 free 再 free(a)。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 3, m = 4;

    // 方式一：连续
    int *flat = malloc((size_t) n * m * sizeof *flat);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            flat[i * m + j] = i + j;
    printf("%d\\n", flat[1 * m + 2]);     // 3
    free(flat);

    // 方式二：行指针
    int **g = malloc(n * sizeof *g);
    for (int i = 0; i < n; i++) g[i] = malloc(m * sizeof **g);
    g[2][3] = 9;
    printf("%d\\n", g[2][3]);
    for (int i = 0; i < n; i++) free(g[i]);
    free(g);
    return 0;
}`,
        lang: "C",
        pts: [
          "方式一内存连续、cache 友好，推荐用于算法题",
          "方式二灵活（每行可不等长），但释放必须逐行",
          "`(size_t) n * m` 防止 int 乘法溢出",
        ],
        pit: "方式二只 `free(g)` 不逐行 free，会泄漏所有行内存——ASan 会直接报出来。",
      },
    ],
    qa: [
      ["malloc 和 calloc 的区别？", "`malloc` 一个参数、不清零；`calloc(n, size)` 两个参数、清零，且会检查乘法溢出。"],
      ["free 怎么知道要释放多少字节？", "堆管理器在块头保存了大小信息，所以 free 不需要传入长度（这也是越界写会破坏堆的原因）。"],
    ],
    sum: "malloc 传字节数、free 后置 NULL、realloc 用临时变量、二维数组注意释放顺序。",
  },

  {
    t: "结构体与 typedef",
    sub: "struct · 指针访问 · 内存对齐 · 链表节点",
    mins: 50,
    kw: "排序",
    goals: [
      "定义并使用结构体",
      "分清 `.` 与 `->` 的使用场景",
      "理解内存对齐与 sizeof 的关系",
      "用结构体写链表与排序",
    ],
    map: [
      ["写法", "含义", "场景"],
      ["`struct P p;`", "结构体变量", "直接访问用 `.`"],
      ["`struct P *q;`", "结构体指针", "访问用 `->`"],
      ["`typedef`", "起别名", "省掉 struct 关键字"],
      ["对齐", "填充字节", "sizeof 比字段之和大"],
    ],
    mic: [
      {
        t: "结构体的定义与使用",
        lead: "结构体把不同类型的字段打包成一个整体，是 C 里唯一的「自定义类型」手段。",
        body: [
          "`struct Point { int x, y; };` 定义类型；`struct Point p = {1, 2};` 创建并初始化。C99 支持指定初始化 `{.y = 2}`。",
          "结构体可以整体赋值（`p2 = p1` 是拷贝），但不能用 `==` 比较——要逐字段比或 memcmp。",
        ],
        code: `#include <stdio.h>
#include <string.h>

struct Point { int x, y; };

typedef struct {
    char name[16];
    int score;
} Student;                     // 匿名结构体 + typedef

int main(void) {
    struct Point p1 = {1, 2};
    struct Point p2 = p1;             // 整体拷贝
    p2.x = 9;
    printf("%d %d\\n", p1.x, p2.x);    // 1 9

    Student s = {.name = "Amy", .score = 92};
    Student t = s;
    strcpy(t.name, "Bob");
    printf("%s %d\\n", s.name, t.score);   // Amy 92
    return 0;
}`,
        lang: "C",
        pts: [
          "结构体赋值是浅拷贝，含指针字段时要自己深拷贝",
          "不能用 `==` 比较结构体",
          "`typedef struct {...} T;` 是最常用的写法",
        ],
        pit: "两个结构体之间有填充字节，`memcmp` 比较可能因垃圾值不同而误判不等。",
      },
      {
        t: "点号与箭头",
        lead: "变量用 `.`，指针用 `->`；`p->x` 就是 `(*p).x` 的简写。",
        body: [
          "这是 C 里最高频的语法混淆点。传结构体给函数时通常传指针（避免拷贝），所以函数里全用 `->`。",
          "`const struct P *p` 表示不能通过 p 修改字段，是只读参数的标准写法。",
        ],
        code: `#include <stdio.h>

struct Rect { int w, h; };

int area(const struct Rect *r) {       // 只读指针
    return r->w * r->h;                // 等价 (*r).w
}

void scale(struct Rect *r, int k) {
    r->w *= k;
    r->h *= k;
}

int main(void) {
    struct Rect r = {3, 4};
    printf("%d\\n", area(&r));         // 12
    scale(&r, 2);
    printf("%d %d\\n", r.w, r.h);       // 6 8
    return 0;
}`,
        lang: "C",
        pts: [
          "`(*p).x` 的括号不能省，`*p.x` 是 `*(p.x)`",
          "大结构体一定传指针，避免整块拷贝",
          "`const` 加在参数上能防止意外修改",
        ],
        pit: "`struct Rect *r; r.w` 会编译错误（r 是指针），必须 `r->w`。",
      },
      {
        t: "内存对齐与 sizeof",
        lead: "编译器会插入填充字节让字段对齐，所以 `sizeof(struct)` 常大于字段之和。",
        body: [
          "规则：每个字段的起始地址是其大小的整数倍，结构体总大小是其最大对齐数的整数倍。",
          "调整字段顺序（大的放前面）可能减少填充。网络协议/文件格式要 `#pragma pack(1)` 取消填充，但会牺牲性能。",
        ],
        code: `#include <stdio.h>
#include <stddef.h>

struct A { char c; int i; char d; };       // 12 字节（有填充）
struct B { int i; char c; char d; };       // 8 字节
#pragma pack(push, 1)
struct C { char c; int i; char d; };       // 6 字节
#pragma pack(pop)

int main(void) {
    printf("%zu %zu %zu\\n", sizeof(struct A), sizeof(struct B), sizeof(struct C));
    printf("%zu\\n", offsetof(struct A, i));    // 4
    return 0;
}`,
        lang: "C",
        pts: [
          "`offsetof` 能查字段偏移，调试对齐问题很有用",
          "`#pragma pack(1)` 会降低访问速度（可能跨 cache line）",
          "结构体末尾可能还有填充，`sizeof` 包含它",
        ],
        pit: "把结构体直接 `fwrite` 到文件再读，不同编译器/对齐设置下会解析错乱——必须用定长类型 + 显式序列化。",
      },
      {
        t: "结构体实战：链表与排序",
        lead: "链表节点就是一个「含自身指针的结构体」，这是结构体最经典的应用。",
        body: [
          "`struct Node { int val; struct Node *next; };` 注意 C 里必须写 `struct Node *`（或用 typedef 提前声明）。",
          "`qsort` 可以对结构体数组排序，比较函数接收 `const void *`，要转成结构体指针再比。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

Node *push(Node *head, int v) {
    Node *n = malloc(sizeof *n);
    n->val = v;
    n->next = head;
    return n;
}

void freeList(Node *h) {
    while (h) { Node *t = h->next; free(h); h = t; }
}

typedef struct { int score; char name[8]; } Stu;

int cmpStu(const void *a, const void *b) {
    const Stu *x = a, *y = b;
    if (x->score != y->score) return y->score - x->score;   // 分数降序
    return 0;
}

int main(void) {
    Node *h = NULL;
    for (int i = 1; i <= 3; i++) h = push(h, i);
    for (Node *p = h; p; p = p->next) printf("%d ", p->val);
    printf("\\n");
    freeList(h);

    Stu s[3] = {{85, "a"}, {92, "b"}, {78, "c"}};
    qsort(s, 3, sizeof s[0], cmpStu);
    printf("%s\\n", s[0].name);        // b
    return 0;
}`,
        lang: "C",
        pts: [
          "typedef 之后可以直接 `Node *` 不用写 struct",
          "`qsort` 的比较函数必须返回 int，负数表示 a 在前",
          "释放链表要先用临时变量保存 next，否则 free 后拿不到",
        ],
        pit: "`free(h)` 之后再用 `h->next` 是 use-after-free，必须先存 `t = h->next`。",
      },
    ],
    qa: [
      ["`struct` 和 `typedef struct` 的区别？", "前者类型名是 `struct X`；后者用 typedef 起了别名，可以直接写 `X`。"],
      ["为什么结构体不能直接 `==`？", "C 没有为结构体定义比较运算，而且填充字节的值不确定，逐字节比较也不可靠。"],
    ],
    sum: "变量点指针箭、大结构体传指针、对齐看 sizeof、链表释放先存 next。",
  },

  {
    t: "预处理与多文件",
    sub: "#define · 头文件保护 · 条件编译 · 模块拆分",
    mins: 45,
    kw: "复杂度",
    goals: [
      "区分宏与函数的差别",
      "写出正确的头文件保护",
      "用条件编译做平台适配与调试开关",
      "把单文件拆成规范的模块",
    ],
    map: [
      ["指令", "作用", "注意"],
      ["`#include`", "插入文件内容", "`<>` 系统，`\"\"` 本地"],
      ["`#define`", "文本替换", "加括号防优先级问题"],
      ["`#ifdef`", "条件编译", "调试/平台开关"],
      ["`#pragma once`", "防重复包含", "非标准但通用"],
    ],
    mic: [
      {
        t: "宏：文本替换的陷阱",
        lead: "宏是「编译前把文本替换掉」，没有类型检查、没有作用域，参数必须加括号。",
        body: [
          "`#define SQ(x) x*x` 在 `SQ(1+2)` 时展开成 `1+2*1+2 = 5`，完全错误。写成 `((x)*(x))` 才对。",
          "`#define MAX(a,b) ((a)>(b)?(a):(b))` 也有副作用问题（a 被求值两次），能用 `inline` 函数就别用宏。",
        ],
        code: `#include <stdio.h>

#define BAD(x) x*x
#define GOOD(x) ((x)*(x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    printf("%d\\n", BAD(1 + 2));     // 5（错误）
    printf("%d\\n", GOOD(1 + 2));    // 9
    printf("%d\\n", MAX(3, 5));      // 5

    int i = 0;
    // MAX(i++, 10) 会自增两次 —— 宏的副作用
    return 0;
}`,
        lang: "C",
        pts: [
          "宏参数与整体都要加括号",
          "多语句宏用 `do { ... } while (0)` 包起来",
          "`const` 常量与 `inline` 函数优先于宏",
        ],
        pit: "`#define SQUARE(x) ((x)*(x))` 传给 `SQUARE(i++)` 仍会自增两次——括号解决不了副作用。",
      },
      {
        t: "头文件保护与组织",
        lead: "头文件会被多个 .c 包含，必须防止重复定义——用 include guard 或 `#pragma once`。",
        body: [
          "`#ifndef X_H / #define X_H / ... / #endif` 是标准写法；`#pragma once` 更简洁且被主流编译器支持。",
          "头文件里只放：函数声明、宏、类型定义、`extern` 变量声明、`inline` 函数。不要放变量定义与函数体。",
        ],
        code: `// point.h
#ifndef POINT_H
#define POINT_H

typedef struct { int x, y; } Point;

int point_dist2(const Point *p);
extern int g_pointCount;        // 声明，定义在 .c

#endif

// point.c
#include "point.h"
int g_pointCount = 0;
int point_dist2(const Point *p) { return p->x * p->x + p->y * p->y; }

// main.c
#include "point.h"
int main(void) { Point p = {3, 4}; return point_dist2(&p); }

// gcc main.c point.c -o app`,
        lang: "C",
        pts: [
          "头文件名与宏名对应，避免重名",
          "`#pragma once` 可作为 `#ifndef` 的替代",
          "头文件互相包含时用前向声明 `struct X;` 打破循环",
        ],
        pit: "头文件里定义了变量又被多处包含，链接时报 multiple definition；改成 `extern` 声明 + 一处定义。",
      },
      {
        t: "条件编译：平台与调试开关",
        lead: "`#ifdef` 让同一份代码在不同平台/配置下编译出不同结果，且不产生运行时开销。",
        body: [
          "调试输出用 `#ifdef DEBUG` 包住，发布时加 `-DNDEBUG` 或去掉 `-DDEBUG` 就自动消失。",
          "平台适配用 `_WIN32`、`__linux__` 等预定义宏。",
        ],
        code: `#include <stdio.h>

#ifdef DEBUG
#define LOG(fmt, ...) fprintf(stderr, "[%s:%d] " fmt "\\n", __FILE__, __LINE__, __VA_ARGS__)
#else
#define LOG(fmt, ...) ((void) 0)
#endif

int main(void) {
    LOG("value = %d", 42);      // 无 DEBUG 时编译成空语句

#ifdef _WIN32
    puts("Windows");
#elif defined(__linux__)
    puts("Linux");
#else
    puts("Other");
#endif
    return 0;
}

// 编译：gcc -DDEBUG main.c -o app`,
        lang: "C",
        pts: [
          "`__FILE__`、`__LINE__`、`__func__` 是内置的调试信息",
          "`__VA_ARGS__` 支持可变参数宏（C99）",
          "`#if 0 ... #endif` 可用来临时注释大段代码",
        ],
        pit: "只在头文件里 `#define DEBUG` 会导致包含顺序不同结果不同，调试开关应通过编译参数传入。",
      },
      {
        t: "从单文件到多文件工程",
        lead: "文件超过几百行就该拆：按职责分模块，声明进头文件，实现进源文件。",
        body: [
          "常见划分：`main.c`（入口）、`module.c/h`（业务）、`util.c/h`（工具）。编译时把多个 .c 一起传给 gcc，或分步编译再用链接器合并。",
          "模块内部函数用 `static` 隐藏，只暴露必要的接口——这是 C 的封装手段。",
        ],
        code: `project/
├── main.c
├── point.c
├── point.h
├── util.c
└── util.h

# 一步编译
gcc -Wall -o app main.c point.c util.c

# 分步（增量编译更快）
gcc -c point.c -o point.o
gcc -c util.c  -o util.o
gcc -c main.c  -o main.o
gcc point.o util.o main.o -o app

# 静态库
ar rcs libpoint.a point.o
gcc main.o -L. -lpoint -o app`,
        lang: "bash",
        pts: [
          "每个 .c 单独编译成 .o，改一个文件只需重编它",
          "静态库 `.a` 在链接时被拷进可执行文件",
          "`static` 函数是模块私有的最佳实践",
        ],
        pit: "只编译 `main.c` 而忘了其他 .c，报 `undefined reference`——这是多文件工程最常见的错误。",
      },
    ],
    qa: [
      ["`#include <>` 和 `\"\"` 的区别？", "`<>` 优先在系统头文件目录找；`\"\"` 优先在当前目录找，找不到再去系统目录。"],
      ["宏和 inline 函数怎么选？", "优先 inline：有类型检查、无副作用、可调试。宏只在需要「文本级」能力（如字符串化、条件编译）时用。"],
    ],
    sum: "宏加括号、多语句用 do-while、头文件只放声明、调试开关走编译参数。",
  },

  {
    t: "C 标准库速查",
    sub: "stdio · stdlib · string · math · time",
    mins: 45,
    kw: "字符串",
    goals: [
      "记住常用库函数的分组",
      "正确使用 printf/scanf 的格式符",
      "会用 qsort/bsearch 与随机数",
      "知道哪些函数不安全、该用什么替代",
    ],
    map: [
      ["头文件", "常用函数", "用途"],
      ["stdio.h", "printf/scanf/fgets/fopen", "输入输出"],
      ["stdlib.h", "malloc/qsort/atoi/rand", "通用工具"],
      ["string.h", "strlen/strcmp/memcpy", "字符串与内存"],
      ["math.h", "sqrt/pow/fabs", "数学"],
    ],
    mic: [
      {
        t: "stdio.h：格式化输入输出",
        lead: "`printf` 的格式符是 C 里最容易出错的地方，类型不匹配就是 UB。",
        body: [
          "`%d` int、`%ld` long、`%lld` long long、`%u` unsigned、`%f` double、`%c` char、`%s` 字符串、`%p` 指针、`%zu` size_t、`%%` 百分号。",
          "宽度与精度：`%5.2f`（宽 5、两位小数）、`%-5d`（左对齐）、`%05d`（补零）。",
        ],
        code: `#include <stdio.h>

int main(void) {
    printf("%d|%5d|%-5d|%05d\\n", 42, 42, 42, 42);
    printf("%.2f|%8.3f\\n", 3.14159, 3.14159);
    printf("%s|%10s|%-10s|\\n", "hi", "hi", "hi");
    printf("%c %zu %p\\n", 'A', sizeof(int), (void *) &main);
    printf("%%\\n");

    int a;
    if (scanf("%d", &a) != 1) return 1;    // 检查返回值
    printf("%d\\n", a);
    return 0;
}`,
        lang: "C",
        pts: [
          "`scanf` 返回成功读入的项数，可用于判断输入是否结束",
          "`scanf` 的字符串参数不写 `&`（数组名已是地址）",
          "`printf` 用 `%f` 打 double，`scanf` 用 `%lf` 读 double",
        ],
        pit: "`scanf(\"%f\", &d)` 读 double 是错的（`%f` 是 float），会写入错误字节数导致数据错乱。",
      },
      {
        t: "stdlib.h：转换、排序、随机",
        lead: "`qsort` 是 C 里唯一的标准排序，`atoi/strtol` 做字符串转数字，`rand` 质量差但够用。",
        body: [
          "`qsort(base, n, size, cmp)` 的比较函数必须返回 int。`bsearch` 要求数组已排序。",
          "`rand()` 的周期与质量都不好，需要先 `srand(time(NULL))` 播种；竞赛里常用自己实现的随机。",
        ],
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int cmp(const void *a, const void *b) {
    int x = *(const int *) a, y = *(const int *) b;
    return (x > y) - (x < y);          // 防溢出的三态比较
}

int main(void) {
    int a[5] = {3, 1, 4, 1, 5};
    qsort(a, 5, sizeof a[0], cmp);
    for (int i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\\n");

    int key = 4;
    int *p = bsearch(&key, a, 5, sizeof a[0], cmp);
    printf("%s\\n", p ? "found" : "not found");

    printf("%d %ld\\n", atoi("42"), strtol("ff", NULL, 16));

    srand((unsigned) time(NULL));
    printf("%d\\n", rand() % 100);
    return 0;
}`,
        lang: "C",
        pts: [
          "比较函数返回 `(x>y)-(x<y)` 是最安全的写法",
          "`strtol` 能指定进制并检测错误，比 `atoi` 安全",
          "`rand() % n` 有轻微偏差，要求均匀用 `(int)((double)rand()/RAND_MAX*n)`",
        ],
        pit: "比较函数里写 `return x - y;`，当差值超出 int 范围时会溢出导致排序错乱。",
      },
      {
        t: "string.h 与 memory 操作",
        lead: "字符串函数处理「到 \\0 为止」，内存函数处理「指定字节数」——别混用。",
        body: [
          "`strlen/strcpy/strcmp/strcat` 遇 \\0 停；`memcpy/memmove/memset/memcmp` 按字节处理任意数据。",
          "重叠内存拷贝必须用 `memmove`，`memcpy` 在源与目标重叠时是 UB。",
        ],
        code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[32] = "hello";
    printf("%zu\\n", strlen(s));           // 5

    char d[32];
    memcpy(d, s, strlen(s) + 1);           // 连 \\0 一起拷
    printf("%s\\n", d);

    char buf[16] = "abcdef";
    memmove(buf + 1, buf, 5);              // 重叠拷贝，正确
    printf("%s\\n", buf);                   // aabcde

    int a[3] = {1, 2, 3}, b[3];
    memcpy(b, a, sizeof a);
    printf("%d\\n", memcmp(a, b, sizeof a) == 0);   // 1

    memset(buf, 0, sizeof buf);
    return 0;
}`,
        lang: "C",
        pts: [
          "`memcpy` 目标与源不能重叠，重叠用 `memmove`",
          "`memset` 按字节填充，只适合 0 与 -1",
          "`strncpy` 不保证补 \\0，`snprintf` 更安全",
        ],
        pit: "`memcpy(dst, src, strlen(src))` 漏了 +1，目标串没有 \\0 结尾，后续 `printf` 会读到垃圾。",
      },
      {
        t: "math.h、time.h 与常见取舍",
        lead: "数学函数要链 `-lm`；`time` 用于计时与播种；浮点比较永远要允许误差。",
        body: [
          "`sqrt/pow/exp/log/fabs/floor/ceil/round` 都是 double 版本，float 用 `sqrtf`。",
          "`clock()` 测 CPU 时间，`time()` 精度只到秒；计时用 `clock_gettime` 或 `gettimeofday`。",
        ],
        code: `#include <stdio.h>
#include <math.h>
#include <time.h>

int main(void) {
    printf("%.3f %.3f\\n", sqrt(2.0), pow(2, 10));
    printf("%.0f %.0f\\n", floor(3.7), ceil(3.2));
    if (fabs(0.1 + 0.2 - 0.3) < 1e-9) puts("equal");

    clock_t t0 = clock();
    volatile double s = 0;
    for (int i = 0; i < 1000000; i++) s += sqrt(i);
    double ms = (double) (clock() - t0) / CLOCKS_PER_SEC * 1000;
    printf("%.1f ms\\n", ms);

    time_t now = time(NULL);
    printf("%s", ctime(&now));
    return 0;
}
// gcc main.c -o app -lm`,
        lang: "C",
        pts: [
          "链接数学库要加 `-lm` 且放在源文件之后",
          "`clock()` 测的是 CPU 时间，不是墙钟时间",
          "`round(2.5)` 是 3（远离零），与银行家舍入不同",
        ],
        pit: "`printf(\"%.0f\", 2.5)` 受浮点表示影响可能输出 2 而不是 3，涉及金额要用整数分。",
      },
    ],
    qa: [
      ["为什么 C 的字符串函数被认为不安全？", "它们不接收目标缓冲区大小，输入超长就会溢出；应改用 `strncpy/snprintf/fgets` 等带长度的版本。"],
      ["`qsort` 是稳定排序吗？", "不是。需要稳定排序要自己实现归并，或在比较函数里加入原始下标作为次序。"],
    ],
    sum: "格式符必须匹配、qsort 比较防溢出、重叠拷贝用 memmove、数学库加 -lm。",
  },
];
