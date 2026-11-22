// C 第 16-20 章 · 每章 4 节微课
module.exports = [
  {
    t: "文件 IO 与缓冲",
    sub: "fopen 模式 · 逐行读 · 二进制读写 · fflush",
    mins: 45,
    kw: "输入输出",
    goals: [
      "正确选择 fopen 的打开模式",
      "逐行读取大文件而不爆内存",
      "做二进制读写与结构体序列化",
      "理解缓冲与 fflush 的关系",
    ],
    map: [
      ["模式", "含义", "注意"],
      ["`r`", "只读", "文件必须存在"],
      ["`w`", "只写，清空", "会丢失原内容"],
      ["`a`", "追加", "不清空"],
      ["`rb/wb`", "二进制", "不做换行转换"],
    ],
    mic: [
      {
        t: "打开模式的语义",
        lead: "`w` 一打开就清空文件，这是最容易造成数据丢失的操作——写之前先确认路径。",
        body: [
          "`r` 读、`w` 写（清空）、`a` 追加、`r+` 读写、`w+` 读写（清空）。加 `b` 表示二进制，`a+` 追加并可读。",
          "`fopen` 失败返回 NULL，必须检查，否则后续操作直接段错误。",
        ],
        code: `#include <stdio.h>

int main(void) {
    FILE *f = fopen("out.txt", "w");
    if (!f) { perror("fopen"); return 1; }
    fprintf(f, "hello\\n");
    fclose(f);

    f = fopen("out.txt", "a");          // 追加
    if (f) { fputs("world\\n", f); fclose(f); }

    f = fopen("out.txt", "r");
    char line[128];
    while (f && fgets(line, sizeof line, f)) fputs(line, stdout);
    if (f) fclose(f);
    return 0;
}`,
        lang: "C",
        pts: [
          "`perror` 会打印系统给的错误原因，比 printf 有用",
          "`fclose` 会 flush 缓冲，务必调用",
          "二进制模式避免 Windows 的 `\\n` → `\\r\\n` 转换",
        ],
        pit: "用 `w` 模式打开一个已有文件，即使程序随后崩溃，原内容也已经没了。",
      },
      {
        t: "逐行读与定长读",
        lead: "大文件必须逐行或分块读，`fread` 整个文件进内存会直接 OOM。",
        body: [
          "`fgets(buf, size, f)` 读到换行或 size-1 字节，返回 NULL 表示结束或出错。它保留换行符，通常要手动去掉。",
          "`fread(buf, size, count, f)` 按块读，适合二进制；返回值是「成功读到的元素个数」，不是字节数。",
        ],
        code: `#include <stdio.h>
#include <string.h>

int main(void) {
    FILE *f = fopen("data.txt", "r");
    if (!f) return 1;

    char line[256];
    long lines = 0, chars = 0;
    while (fgets(line, sizeof line, f)) {
        line[strcspn(line, "\\r\\n")] = '\\0';   // 去掉行尾换行
        lines++;
        chars += strlen(line);
    }
    printf("%ld lines, %ld chars\\n", lines, chars);
    fclose(f);

    // 分块读二进制
    FILE *b = fopen("data.bin", "rb");
    if (b) {
        unsigned char buf[4096];
        size_t n;
        while ((n = fread(buf, 1, sizeof buf, b)) > 0) {
            // 处理 buf[0..n-1]
        }
        fclose(b);
    }
    return 0;
}`,
        lang: "C",
        pts: [
          "`fgets` 的第二个参数是缓冲区大小，最多读 size-1 个字符",
          "`fread` 返回元素个数，判断结束要结合 `feof`",
          "`strcspn` 是去换行的惯用法",
        ],
        pit: "一行超过缓冲区大小时 `fgets` 会分两次返回，拼接逻辑要考虑这种情况。",
      },
      {
        t: "二进制读写与结构体",
        lead: "`fwrite` 直接把内存字节写进文件，方便但不跨平台——对齐与字节序都会出问题。",
        body: [
          "同机同编译器读写结构体没问题；跨平台必须逐字段序列化（或统一用文本/JSON）。",
          "`fseek/ftell` 可以随机定位，适合定长记录的索引文件。",
        ],
        code: `#include <stdio.h>
#include <stdint.h>

typedef struct { int32_t id; char name[16]; double score; } Rec;

int main(void) {
    Rec a = {1, "Amy", 92.5}, b;

    FILE *f = fopen("rec.bin", "wb");
    if (!f) return 1;
    fwrite(&a, sizeof a, 1, f);
    fclose(f);

    f = fopen("rec.bin", "rb");
    if (!f) return 1;
    fread(&b, sizeof b, 1, f);
    printf("%d %s %.1f\\n", b.id, b.name, b.score);

    fseek(f, 0, SEEK_END);
    printf("size = %ld\\n", ftell(f));
    fclose(f);
    return 0;
}`,
        lang: "C",
        pts: [
          "用 `int32_t` 这类定长类型，避免平台差异",
          "`fseek(f, 0, SEEK_SET)` 可回到开头重读",
          "结构体含指针时不能直接 fwrite（写的是地址）",
        ],
        pit: "把含指针的结构体直接写文件，读回来指针是野值，一解引用就崩。",
      },
      {
        t: "缓冲、fflush 与错误处理",
        lead: "标准 IO 有缓冲，数据不会立刻落盘；崩溃前没 flush 就会丢数据。",
        body: [
          "`fflush(f)` 强制把缓冲区写入文件；`fclose` 会自动 flush。`setvbuf` 可以改缓冲策略（行缓冲/全缓冲/无缓冲）。",
          "每次操作后检查返回值或用 `ferror(f)`，写满磁盘这类错误会被静默忽略。",
        ],
        code: `#include <stdio.h>

int main(void) {
    FILE *f = fopen("log.txt", "w");
    if (!f) return 1;

    setvbuf(f, NULL, _IOLBF, 0);       // 行缓冲

    for (int i = 0; i < 3; i++) {
        fprintf(f, "line %d\\n", i);
        fflush(f);                      // 立刻落盘，防崩溃丢数据
    }

    if (ferror(f)) perror("write error");
    fclose(f);

    // 删文件
    if (remove("log.txt") != 0) perror("remove");
    return 0;
}`,
        lang: "C",
        pts: [
          "崩溃（未 fclose）时缓冲区内容会丢失",
          "日志场景建议每次写完 `fflush`",
          "`rename` 是原子替换文件的标准做法（先写临时文件）",
        ],
        pit: "只 `fprintf` 不 `fclose` 就 `return`，程序正常退出会 flush，但段错误退出就不会——数据直接丢。",
      },
    ],
    qa: [
      ["文本模式和二进制模式的区别？", "文本模式在 Windows 会把 `\\n` 转成 `\\r\\n` 读写双向转换；二进制模式原样读写。"],
      ["`fgets` 和 `scanf` 怎么选？", "读整行用 `fgets`（能读空格）；读格式化数据用 `scanf`，但要注意缓冲区溢出风险。"],
    ],
    sum: "w 会清空、fgets 去换行、二进制用定长类型、写完记得 fflush。",
  },

  {
    t: "手写常用算法",
    sub: "快排 · 归并 · 二分 · 字符串函数实现",
    mins: 55,
    kw: "排序",
    goals: [
      "手写快排与归并排序并说清复杂度",
      "手写 lower_bound 与二分答案",
      "实现 strlen/strcpy/memcpy 等基础函数",
      "理解这些实现的边界与坑",
    ],
    map: [
      ["算法", "平均", "最坏", "稳定"],
      ["快速排序", "O(n log n)", "O(n²)", "否"],
      ["归并排序", "O(n log n)", "O(n log n)", "是"],
      ["堆排序", "O(n log n)", "O(n log n)", "否"],
      ["二分查找", "O(log n)", "O(log n)", "—"],
    ],
    mic: [
      {
        t: "快速排序：分区是核心",
        lead: "快排的本质是「选一个基准，把小的放左边、大的放右边」，然后递归处理两侧。",
        body: [
          "Hoare 分区用双指针从两端向中间扫，交换逆序对，平均 O(n log n)。基准选得不好（如已排序数组选首元素）会退化成 O(n²)。",
          "三数取中或随机基准能显著降低退化概率；小数组切换插入排序更快。",
        ],
        code: `#include <stdio.h>

static void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int partition(int *a, int lo, int hi) {
    int mid = lo + (hi - lo) / 2;
    // 三数取中
    if (a[mid] < a[lo]) swap(&a[mid], &a[lo]);
    if (a[hi] < a[lo]) swap(&a[hi], &a[lo]);
    if (a[hi] < a[mid]) swap(&a[hi], &a[mid]);
    swap(&a[mid], &a[hi]);              // 基准放末尾

    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { swap(&a[i], &a[j]); i++; }
    swap(&a[i], &a[hi]);
    return i;
}

void quickSort(int *a, int lo, int hi) {
    while (lo < hi) {
        int p = partition(a, lo, hi);
        if (p - lo < hi - p) { quickSort(a, lo, p - 1); lo = p + 1; }
        else { quickSort(a, p + 1, hi); hi = p - 1; }   // 尾递归优化
    }
}

int main(void) {
    int a[8] = {5, 2, 8, 1, 9, 3, 7, 4};
    quickSort(a, 0, 7);
    for (int i = 0; i < 8; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`,
        lang: "C",
        pts: [
          "分区时用 `a[j] < pivot` 保证相等元素的处理一致",
          "先递归较小的区间，另一侧改循环，能控制栈深度",
          "快排不稳定，需要稳定性用归并",
        ],
        pit: "基准固定取首元素 + 已排序输入 = O(n²)，1e5 数据会直接超时。",
      },
      {
        t: "归并排序：稳定且可统计逆序对",
        lead: "归并把数组一分为二，分别排好再合并——合并过程天然稳定，还能顺手统计逆序对。",
        body: [
          "时间复杂度稳定 O(n log n)，代价是需要 O(n) 额外空间。合并时「左边大于右边就取右边」的步数就是逆序对数。",
          "外部排序（大文件排序）也基于归并思想。",
        ],
        code: `#include <stdio.h>

long long inv = 0;
int tmp[100005];

void mergeSort(int *a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);

    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];       // <= 保证稳定
        else { inv += m - i + 1; tmp[k++] = a[j++]; }
    }
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (int t = l; t <= r; t++) a[t] = tmp[t];
}

int main(void) {
    int a[6] = {5, 2, 8, 1, 3, 4};
    mergeSort(a, 0, 5);
    for (int i = 0; i < 6; i++) printf("%d ", a[i]);
    printf("\\n逆序对 = %lld\\n", inv);      // 8
    return 0;
}`,
        lang: "C",
        pts: [
          "`a[i] <= a[j]` 取左边才稳定，写 `<` 会破坏稳定性",
          "逆序对在「取右边」时累加 `m - i + 1`",
          "临时数组开全局或用 malloc，递归里开大会爆栈",
        ],
        pit: "临时数组在递归函数里 `int tmp[n]` 分配，深度 log n 层会累积占满栈。",
      },
      {
        t: "二分：lower_bound 与二分答案",
        lead: "二分的写法有十几种，选一种固定的「左闭右开」模板，能避免 90% 的边界错误。",
        body: [
          "`lower_bound` 返回第一个 ≥ x 的位置，`upper_bound` 返回第一个 > x。用 `lo < hi` 循环、`hi = mid` 收缩，全程不用考虑 ±1。",
          "二分答案的关键是「判定函数单调」：能二分的是 check，不是数组。",
        ],
        code: `#include <stdio.h>

int lowerBound(const int *a, int n, int x) {
    int lo = 0, hi = n;                 // [lo, hi)
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

int upperBound(const int *a, int n, int x) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] <= x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

int main(void) {
    int a[6] = {1, 3, 3, 3, 5, 8};
    printf("%d %d\\n", lowerBound(a, 6, 3), upperBound(a, 6, 3));  // 1 4
    printf("count = %d\\n", upperBound(a, 6, 3) - lowerBound(a, 6, 3));

    // 二分答案：最小的 x 使 x*x >= target
    long long target = 50, lo = 1, hi = 100000, ans = -1;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        if (mid * mid >= target) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    printf("ans = %lld\\n", ans);        // 8
    return 0;
}`,
        lang: "C",
        pts: [
          "统一用「左闭右开」区间，循环条件写 `lo < hi`",
          "`mid = lo + (hi - lo) / 2` 防溢出",
          "`upper_bound - lower_bound` 就是等于 x 的个数",
        ],
        pit: "混用闭区间与开区间的模板（`hi = mid - 1` 配 `lo < hi`）会死循环或漏解。",
      },
      {
        t: "手写 string 函数",
        lead: "面试常考「不用库函数实现 strlen/strcpy/memcpy」——考的是指针运算与边界意识。",
        body: [
          "`strlen` 逐字节扫到 0；`strcpy` 连 \\0 一起拷；`memcpy` 按字节拷 n 个，要处理重叠就用 `memmove`。",
          "实现时注意：返回值要能链式调用（返回目标指针），参数检查 NULL。",
        ],
        code: `#include <stdio.h>

size_t myStrlen(const char *s) {
    const char *p = s;
    while (*p) p++;
    return (size_t) (p - s);
}

char *myStrcpy(char *dst, const char *src) {
    char *r = dst;
    while ((*dst++ = *src++)) { }
    return r;
}

void *myMemcpy(void *dst, const void *src, size_t n) {
    unsigned char *d = dst;
    const unsigned char *s = src;
    while (n--) *d++ = *s++;
    return dst;
}

void *myMemmove(void *dst, const void *src, size_t n) {
    unsigned char *d = dst;
    const unsigned char *s = src;
    if (d < s) { while (n--) *d++ = *s++; }
    else { d += n; s += n; while (n--) *--d = *--s; }
    return dst;
}

int main(void) {
    char buf[16];
    myStrcpy(buf, "hello");
    printf("%zu %s\\n", myStrlen(buf), buf);
    myMemmove(buf + 1, buf, 5);
    printf("%s\\n", buf);
    return 0;
}`,
        lang: "C",
        pts: [
          "`while ((*dst++ = *src++))` 是 strcpy 的经典写法（赋值表达式的值）",
          "`memmove` 要判断方向，避免覆盖未拷贝的数据",
          "返回目标指针以支持链式调用",
        ],
        pit: "`memcpy` 用在重叠区间上是 UB，虽然小数据可能「看起来正常」。",
      },
    ],
    qa: [
      ["快排为什么要随机化基准？", "避免「已排序/逆序」这类输入导致的 O(n²) 退化，随机化后期望复杂度为 O(n log n)。"],
      ["归并排序的空间能省吗？", "可以做到 O(1) 额外空间的原地归并（很复杂），工程上多用 O(n) 临时数组换实现简单。"],
    ],
    sum: "快排分区+尾递归、归并统计逆序对、二分统一左闭右开、手写函数注意重叠与返回值。",
  },

  {
    t: "内存调试与问题定位",
    sub: "段错误 · 越界 · 泄漏 · gdb · ASan/valgrind",
    mins: 50,
    kw: "复杂度",
    goals: [
      "定位段错误的三种手段",
      "用 ASan 抓越界与泄漏",
      "会用 gdb 看调用栈与变量",
      "建立「先复现再改」的调试习惯",
    ],
    map: [
      ["工具", "能发现", "代价"],
      ["gdb", "崩溃位置、调用栈", "需 -g"],
      ["ASan", "越界、UAF、泄漏", "2~3 倍变慢"],
      ["valgrind", "泄漏、非法访问", "10~30 倍变慢"],
      ["UBSan", "未定义行为", "小幅开销"],
    ],
    mic: [
      {
        t: "段错误的三种常见根因",
        lead: "Segmentation fault 几乎只有三个来源：空指针解引用、数组越界、访问已释放内存。",
        body: [
          "`gdb` 跑一遍，`bt` 看栈，`frame N` 切到自己的代码，`print` 变量，通常三步就能定位。",
          "没有 gdb 时，用二分法插 `printf` 缩小范围，也能找到崩溃行。",
        ],
        code: `# gdb 定位崩溃
gcc -g -o app app.c
gdb -q ./app
(gdb) run
# Program received signal SIGSEGV
(gdb) bt                 # 看调用栈
(gdb) frame 0            # 切到崩溃帧
(gdb) print i            # 看变量
(gdb) list               # 看源码`,
        lang: "bash",
        pts: [
          "`-g` 编译才会有行号与变量名",
          "`bt full` 能打印所有局部变量",
          "`watch x` 监视变量变化，适合查「值被谁改了」",
        ],
        pit: "崩溃点常常不是出错点（越界写破坏堆后，崩溃发生在很久之后的 free），要看调用栈的实际上下文。",
      },
      {
        t: "AddressSanitizer：一行编译解决大半问题",
        lead: "`-fsanitize=address` 能在越界/释放后使用的瞬间报错，并给出精确行号——这是 C 开发最有性价比的工具。",
        body: [
          "它会在每次内存访问前检查，越界、UAF、双重释放、泄漏都能抓。代价是内存与时间开销变大，只用于调试构建。",
          "UBSan（`-fsanitize=undefined`）抓未定义行为：有符号溢出、移位越界、空指针解引用。",
        ],
        code: `# 编译（gcc / clang 都支持）
gcc -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer \\
    -o app app.c
./app

# 典型输出
# =================================================================
# ==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address ...
# READ of size 4 at 0x... thread T0
#     #0 0x... in main app.c:12:9
# =================================================================`,
        lang: "bash",
        pts: [
          "ASan 报的地址与行号非常准确，直接照着改",
          "`ASAN_OPTIONS=detect_leaks=1` 可检测泄漏",
          "发布构建不要带 ASan（性能与内存开销大）",
        ],
        pit: "ASan 与某些第三方库（预编译无插桩）混用会误报，需用 `__attribute__((no_sanitize))` 或重新编译依赖。",
      },
      {
        t: "内存泄漏与 valgrind",
        lead: "泄漏不会立刻崩溃，但长期运行的服务会持续吃内存直到 OOM。",
        body: [
          "valgrind 的 memcheck 能列出「哪些字节泄漏、在哪分配的」，但慢 10~30 倍。",
          "ASan 的 LeakSanitizer 更快，日常优先用它；valgrind 适合在没有源码或需要更细报告时用。",
        ],
        code: `# valgrind
gcc -g -o app app.c
valgrind --leak-check=full --show-leak-kinds=all ./app

# 典型输出
# ==1234== 40 bytes in 1 blocks are definitely lost in loss record 1 of 3
# ==1234==    at 0x...: malloc
# ==1234==    by 0x...: main (app.c:9)

# ASan 泄漏检测
gcc -g -fsanitize=address -o app app.c
ASAN_OPTIONS=detect_leaks=1 ./app`,
        lang: "bash",
        pts: [
          "「definitely lost」才是真泄漏，其余可能是缓存或全局持有",
          "泄漏报告会给出分配的调用栈，顺着找谁没 free",
          "静态分析工具（cppcheck、clang-tidy）能在编译期发现一部分",
        ],
        pit: "把「still reachable」（程序结束时仍持有的全局指针）当成泄漏，会白花时间排查。",
      },
      {
        t: "调试习惯：先复现，再改",
        lead: "最耗时的不是修 bug，而是「改了半天发现根本没改到点上」。",
        body: [
          "三步：稳定复现 → 缩小范围（二分注释/打印）→ 定位后一次性修好并补测试。避免「改一点试试」的随机修补。",
          "崩溃类问题优先看「输入边界」，逻辑类问题优先看「状态更新时机」。",
        ],
        code: `# 常用调试循环
1. 记录最小复现输入（1 行数据，越小越好）
2. ASan 跑一遍，拿到精确行号
3. 修正后重跑同一输入
4. 补一条断言/测试，防止回归

# 快速定位「谁改了变量」
(gdb) watch -l x
(gdb) continue
# 触发时 bt 看调用链

# 打印关键状态
fprintf(stderr, "i=%d sum=%lld\\n", i, sum);`,
        lang: "bash",
        pts: [
          "调试输出打到 stderr，不污染正常输出",
          "修完必须重跑原用例 + 边界用例",
          "同一个问题修三次没解决，说明理解错了根因，回去重新读代码",
        ],
        pit: "为了「让它先跑起来」注释掉断言与检查，会让后面的问题更难查。",
      },
    ],
    qa: [
      ["为什么 `printf` 调试有时会「改变」 bug？", "打印改变了内存布局与执行时序，掩盖了未定义行为。所以要优先用 ASan/gdb 这类不改逻辑的工具。"],
      ["release 版本崩溃但 debug 正常？", "典型是未初始化变量或 UB：优化后寄存器分配变了，垃圾值不同。用 ASan 跑 release 配置能复现。"],
    ],
    sum: "段错误先 gdb bt、越界用 ASan、泄漏用 valgrind、修完补测试。",
  },

  {
    t: "Makefile 与多文件工程",
    sub: "编译链接 · Makefile 规则 · 静态/动态库 · 自动化",
    mins: 45,
    kw: "复杂度",
    goals: [
      "理解编译与链接的分工",
      "写出可维护的 Makefile",
      "区分静态库与动态库",
      "知道什么时候该上 CMake",
    ],
    map: [
      ["概念", "产物", "用途"],
      ["目标文件", ".o", "单文件编译结果"],
      ["静态库", ".a", "链接时打包进可执行文件"],
      ["动态库", ".so/.dll", "运行时加载"],
      ["Makefile", "构建脚本", "增量编译"],
    ],
    mic: [
      {
        t: "编译与链接的分工",
        lead: "编译把每个 .c 变成 .o（只检查语法与符号引用），链接把 .o 拼起来并解析符号地址。",
        body: [
          "「undefined reference」是链接期错误，意思是「有人用了这个符号，但没人定义」。常见原因：忘了把对应 .c 加进编译、忘了链接库、C/C++ 名字改编不匹配。",
          "「multiple definition」是同一个符号被定义了多次，常见于在头文件里写函数体或全局变量。",
        ],
        code: `# 分步
gcc -c main.c -o main.o
gcc -c util.c -o util.o
gcc main.o util.o -o app

# 一步（等价）
gcc main.c util.c -o app

# 用到数学库：-lm 放在最后
gcc main.c -lm -o app
gcc -lm main.c -o app      # 可能链接失败（顺序敏感）`,
        lang: "bash",
        pts: [
          "链接器从左到右解析，库要放在使用它的目标文件之后",
          "`nm` 可以查看 .o 里的符号（T 定义、U 未定义）",
          "`ldd app` 查看运行时依赖的动态库",
        ],
        pit: "`-lm` 写在源文件前面会导致 `undefined reference to sqrt`——链接顺序是有语义的。",
      },
      {
        t: "Makefile 的三要素",
        lead: "Makefile 的核心是「目标 : 依赖」+「命令」，靠时间戳判断是否需要重建。",
        body: [
          "规则：`target: prerequisites` 换行 Tab 后写命令。变量用 `CC`/`CFLAGS`，`$@` 是目标、`$<` 是第一个依赖、`$^` 是全部依赖。",
          "`.PHONY` 声明伪目标（clean、all），避免与同名文件冲突。",
        ],
        code: `CC      = gcc
CFLAGS  = -std=c11 -Wall -Wextra -O2 -MMD
TARGET  = app
SRCS    = main.c util.c
OBJS    = $(SRCS:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET) *.d

.PHONY: all clean

-include $(OBJS:.o=.d)`,
        lang: "makefile",
        pts: [
          "命令前必须是 **Tab**，空格会报 missing separator",
          "`-MMD` 生成头文件依赖，改头文件能触发重编",
          "`make -j8` 并行编译，速度显著提升",
        ],
        pit: "用空格缩进命令行，make 报 `missing separator`，这个错误让无数新手卡住。",
      },
      {
        t: "静态库与动态库",
        lead: "静态库在链接时被复制进可执行文件（体积大、部署简单）；动态库在运行时加载（体积小、可共享更新）。",
        body: [
          "`ar rcs libx.a a.o b.o` 打包静态库，链接用 `-L. -lx`。动态库用 `-fPIC` 编译再 `-shared` 链接。",
          "动态库需要运行时能找到（`LD_LIBRARY_PATH` 或 `rpath`），否则报 library not found。",
        ],
        code: `# 静态库
gcc -c util.c -o util.o
ar rcs libutil.a util.o
gcc main.c -L. -lutil -o app

# 动态库
gcc -fPIC -c util.c -o util.o
gcc -shared -o libutil.so util.o
gcc main.c -L. -lutil -o app
LD_LIBRARY_PATH=. ./app

# 检查
nm -C libutil.a | head
ldd app`,
        lang: "bash",
        pts: [
          "动态库必须用 `-fPIC`（位置无关代码）",
          "静态库的链接顺序同样敏感",
          "`rpath` 可以把库搜索路径写进可执行文件",
        ],
        pit: "动态库编译时没加 `-fPIC`，链接时报 `relocation R_X86_64_32 against ... can not be used`。",
      },
      {
        t: "什么时候该用 CMake",
        lead: "Makefile 适合小型、单平台工程；一旦要跨平台、多配置、多目标，就该上 CMake。",
        body: [
          "CMake 生成 Makefile/Ninja/VS 工程，是 C/C++ 事实上的构建标准。三行就能起步，依赖管理用 `find_package` / `FetchContent`。",
          "调试与发布用不同构建目录，避免配置互相污染。",
        ],
        code: `cmake_minimum_required(VERSION 3.16)
project(app C)

set(CMAKE_C_STANDARD 11)
add_executable(app main.c util.c)
target_compile_options(app PRIVATE -Wall -Wextra -O2)
target_link_libraries(app PRIVATE m)

# 使用
# cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
# cmake --build build -j8
# ./build/app`,
        lang: "cmake",
        pts: [
          "`CMAKE_BUILD_TYPE` 决定优化与调试信息",
          "`target_link_libraries` 比全局 `link_directories` 更清晰",
          "大项目用 `add_subdirectory` 拆分模块",
        ],
        pit: "在源码目录里直接 `cmake .` 会生成一堆文件污染工程，永远用 `-B build`。",
      },
    ],
    qa: [
      ["为什么改了头文件没重新编译？", "Makefile 没生成头文件依赖。加 `-MMD -MP` 并 `-include *.d` 就能自动追踪。"],
      ["`-O2` 和 `-O3` 怎么选？", "`-O2` 是安全且效果显著的默认；`-O3` 可能增大体积甚至变慢，需要实测。"],
    ],
    sum: "库放最后、Makefile 用 Tab、动态库加 -fPIC、跨平台上 CMake。",
  },

  {
    t: "系统编程入门",
    sub: "系统调用 · 文件描述符 · 进程与管道 · 信号",
    mins: 55,
    kw: "复杂度",
    goals: [
      "理解系统调用与库函数的区别",
      "会用 open/read/write 操作文件",
      "会 fork + exec 创建进程与管道通信",
      "知道信号的基本用法",
    ],
    map: [
      ["概念", "含义", "例子"],
      ["系统调用", "内核提供的接口", "open/read/write"],
      ["文件描述符", "非负整数句柄", "0/1/2 是标准流"],
      ["进程", "独立地址空间", "fork/exec"],
      ["信号", "异步通知", "SIGINT、SIGTERM"],
    ],
    mic: [
      {
        t: "系统调用 vs 库函数",
        lead: "`printf` 是库函数（带缓冲），`write` 是系统调用（直接进内核）——理解这层差异才能解释很多现象。",
        body: [
          "库函数在用户态做缓冲与格式化，最终仍通过系统调用落到内核。系统调用开销大（用户态/内核态切换），所以要批量操作。",
          "`strace` 可以跟踪程序发起了哪些系统调用，是排查 IO 与权限问题的利器。",
        ],
        code: `#include <unistd.h>
#include <stdio.h>

int main(void) {
    const char *s = "hello\\n";
    write(1, s, 6);            // 1 = stdout，直接系统调用
    printf("via stdio\\n");     // 带缓冲的库函数
    return 0;
}

// 查看系统调用
// strace ./app`,
        lang: "C",
        pts: [
          "`write` 的返回值是实际写入字节数，可能小于请求值",
          "`printf` 有缓冲，`write` 没有（除非自己加）",
          "`strace -e trace=open,read,write ./app` 只看关心的调用",
        ],
        pit: "用 `write` 输出时不保证一次写完（管道/网络会部分写），循环写才是正确做法。",
      },
      {
        t: "文件描述符与 open/read/write",
        lead: "Linux 里「一切皆文件」：文件、管道、socket、设备都用文件描述符（fd）表示。",
        body: [
          "fd 0/1/2 分别是 stdin/stdout/stderr。`open` 返回最小可用 fd，`close` 释放。",
          "`O_RDONLY/O_WRONLY/O_CREAT/O_TRUNC/O_APPEND` 是常用标志，配合 `0644` 权限位。",
        ],
        code: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd < 0) { perror("open"); return 1; }

    const char *msg = "hello fd\\n";
    ssize_t n = write(fd, msg, strlen(msg));
    printf("wrote %zd bytes, fd=%d\\n", n, fd);
    close(fd);

    fd = open("out.txt", O_RDONLY);
    char buf[64];
    ssize_t r;
    while ((r = read(fd, buf, sizeof buf)) > 0)
        write(1, buf, (size_t) r);
    close(fd);
    return 0;
}`,
        lang: "C",
        pts: [
          "`open` 失败返回 -1 并设置 `errno`",
          "`read` 返回 0 表示 EOF，-1 表示错误",
          "`close` 后 fd 可能被下次 `open` 复用",
        ],
        pit: "打开太多文件不 close 会耗尽 fd（默认上限 1024），表现为「突然打不开任何文件」。",
      },
      {
        t: "进程：fork、exec 与管道",
        lead: "`fork` 复制出子进程，`exec` 把当前进程替换成另一个程序——两者组合就是 shell 执行命令的原理。",
        body: [
          "`fork` 后父子进程各返回一次：父进程得到子进程 pid，子进程得到 0。`wait` 回收子进程，避免僵尸。",
          "`pipe` 创建一对 fd（读端、写端），配合 fork 就是进程间通信的基础。",
        ],
        code: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

int main(void) {
    int pfd[2];
    if (pipe(pfd) < 0) { perror("pipe"); return 1; }

    pid_t pid = fork();
    if (pid == 0) {                      // 子进程
        close(pfd[0]);
        const char *m = "from child";
        write(pfd[1], m, strlen(m));
        close(pfd[1]);
        _exit(0);
    }

    close(pfd[1]);                       // 父进程
    char buf[64] = {0};
    ssize_t n = read(pfd[0], buf, sizeof buf - 1);
    close(pfd[0]);
    waitpid(pid, NULL, 0);
    printf("parent got: %s (%zd)\\n", buf, n);
    return 0;
}`,
        lang: "C",
        pts: [
          "`fork` 后要关闭不用的管道端，否则读端永远等不到 EOF",
          "子进程用 `_exit` 而不是 `exit`（避免刷新父进程的缓冲）",
          "必须 `wait`/`waitpid` 回收，否则产生僵尸进程",
        ],
        pit: "父子进程都保留写端时，读端永远等不到 EOF，`read` 会一直阻塞——这是管道最经典的错误。",
      },
      {
        t: "信号：异步事件通知",
        lead: "信号是内核发给进程的「异步事件」，如 Ctrl+C 发 SIGINT、`kill` 发 SIGTERM。",
        body: [
          "`signal`/`sigaction` 注册处理函数。信号处理函数里只能调用「异步信号安全」的函数（如 `write`），不能 `printf`/`malloc`。",
          "干净退出通常捕获 SIGINT/SIGTERM，置一个标志位，主循环里检查后优雅收尾。",
        ],
        code: `#include <stdio.h>
#include <signal.h>
#include <unistd.h>

static volatile sig_atomic_t g_stop = 0;

static void onSignal(int sig) {
    (void) sig;
    g_stop = 1;              // 只置标志，不做复杂操作
}

int main(void) {
    struct sigaction sa = {0};
    sa.sa_handler = onSignal;
    sigaction(SIGINT, &sa, NULL);
    sigaction(SIGTERM, &sa, NULL);

    int i = 0;
    while (!g_stop && i < 100) {
        printf("working %d\\n", ++i);
        usleep(100000);
    }
    printf("graceful exit\\n");
    return 0;
}`,
        lang: "C",
        pts: [
          "`volatile sig_atomic_t` 是信号处理里唯一可靠的共享类型",
          "处理函数里只置标志，真正逻辑放主循环",
          "`SIGKILL` 与 `SIGSTOP` 无法被捕获",
        ],
        pit: "在信号处理函数里 `printf` 可能死锁（stdio 内部有锁）——这是「加个日志就卡死」的常见原因。",
      },
    ],
    qa: [
      ["系统调用为什么比函数调用慢？", "要做用户态到内核态的切换（保存上下文、权限检查），一次几百纳秒到微秒级。"],
      ["僵尸进程是什么？", "子进程已结束但父进程没 wait，进程表项仍占着。用 wait/waitpid 或处理 SIGCHLD 解决。"],
    ],
    sum: "库函数带缓冲、fd 是句柄、fork 配 wait、信号处理只置标志。",
  },
];
