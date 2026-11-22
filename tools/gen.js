// 内容生成驱动：题库（数千题）+ API 手册 + 面试题库
// 用法：node tools/gen.js [目标MB] [--count 题数]
const fs = require("fs");
const path = require("path");
const { TYPES_A } = require("./types-a");
const { TYPES_B } = require("./types-b");
const { TYPES_C } = require("./types-c");
const { TYPES_D } = require("./types-d");
const { TYPES_E } = require("./types-e");
const { TYPES_F } = require("./types-f");
const { TYPES_G } = require("./types-g");

const TYPES = [...TYPES_A, ...TYPES_B, ...TYPES_C, ...TYPES_D, ...TYPES_E, ...TYPES_F, ...TYPES_G];
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");

// 题数以 --count 为准（精确复现线上规模 27933 题）；未指定时按体积铺满目标 MB
const ARGS = process.argv.slice(2);
let TARGET_MB = 52, TARGET_COUNT = 0;
for (let i = 0; i < ARGS.length; i++) {
  if (ARGS[i] === "--count") TARGET_COUNT = Number(ARGS[++i]) || 0;
  else if (/^\d+(\.\d+)?$/.test(ARGS[i])) TARGET_MB = Number(ARGS[i]);
}
const TARGET = TARGET_MB * 1024 * 1024;

function rng(seed) {
  let a = seed >>> 0;
  return {
    next() { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; },
    int(n) { return Math.floor(this.next() * n); }
  };
}

function rmDir(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
// 覆盖式生成：不做任何删除（环境禁止删除），文件名固定，多余旧分片不会被索引引用
function write(p, s) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); }
function sizeOf(p) { let s = 0; if (!fs.existsSync(p)) return 0; for (const f of fs.readdirSync(p)) { const fp = path.join(p, f); const st = fs.statSync(fp); s += st.isDirectory() ? sizeOf(fp) : st.size; } return s; }

// ============ 1. API 手册 ============
const MANUAL = {
  cpp: {
    name: "C++ 标准库手册", icon: "🔷",
    entries: [
      ["vector::push_back", "void push_back(const T& x)", "在尾部追加元素，均摊 O(1)。扩容时会重新分配并搬移全部元素，因此不要在遍历中依赖迭代器/引用。", "vector<int> v; v.push_back(1); v.push_back(2);  // {1,2}"],
      ["vector::pop_back", "void pop_back()", "删除尾部元素，O(1)。对空 vector 调用是未定义行为。", "v.pop_back();  // 移除最后一个"],
      ["vector::resize", "void resize(size_t n, T val = T())", "改变大小：变长时用 val 填充，变短时销毁多余元素。", "v.resize(10, -1);  // 扩到 10 个 -1"],
      ["vector::reserve", "void reserve(size_t n)", "预分配容量但不改变 size，避免多次扩容，是常数优化常用手段。", "v.reserve(1000000);"],
      ["vector::assign", "void assign(size_t n, const T& val)", "用 n 个 val 重新填充，会覆盖原有内容。", "v.assign(5, 0);"],
      ["vector::insert", "iterator insert(iterator pos, const T& x)", "在 pos 前插入，O(n)。大量插入应改用 list 或批量构造。", "v.insert(v.begin() + 1, 9);"],
      ["vector::erase", "iterator erase(iterator pos)", "删除指定位置元素，O(n)。遍历删除要用返回值接住下一个迭代器。", "it = v.erase(it);"],
      ["vector::emplace_back", "T& emplace_back(Args&&... args)", "原地构造元素，省一次拷贝/移动，比 push_back 更快。", "v.emplace_back(1, 2);  // 直接构造 pair"],
      ["vector::at", "T& at(size_t i)", "带边界检查的访问，越界抛 std::out_of_range；operator[] 不检查。", "v.at(0);"],
      ["vector::front / back", "T& front(); T& back()", "首/尾元素引用，O(1)。空容器调用是未定义行为。", "v.front(); v.back();"],
      ["string::substr", "string substr(size_t pos, size_t len)", "截取子串，pos 越界抛异常，len 超过剩余长度会自动截断。", "s.substr(1, 3);"],
      ["string::find", "size_t find(const string& sub)", "查找子串首次出现位置，找不到返回 string::npos。", "if (s.find(\"ab\") != string::npos) ..."],
      ["string::compare", "int compare(const string& s)", "字典序比较，返回 <0/0/>0。日常直接用 < > == 运算符即可。", "s.compare(t);"],
      ["sort", "void sort(RandomIt first, RandomIt last, Compare cmp)", "内省排序（快排+堆排+插排），O(n log n)，不稳定。", "sort(v.begin(), v.end(), greater<int>());"],
      ["stable_sort", "void stable_sort(first, last)", "稳定排序，内部用归并，O(n log n)，需要保持相等元素原序时使用。", "stable_sort(v.begin(), v.end());"],
      ["lower_bound", "iterator lower_bound(first, last, x)", "返回第一个 >= x 的位置，要求区间有序，O(log n)。", "auto it = lower_bound(a.begin(), a.end(), x);"],
      ["upper_bound", "iterator upper_bound(first, last, x)", "返回第一个 > x 的位置，常与 lower_bound 配合数出现次数。", "cnt = upper_bound(...) - lower_bound(...);"],
      ["unique", "iterator unique(first, last)", "去除相邻重复元素（需先排序），返回新逻辑尾，不真正删除。", "v.erase(unique(v.begin(), v.end()), v.end());"],
      ["reverse", "void reverse(first, last)", "原地反转区间，O(n)。", "reverse(v.begin(), v.end());"],
      ["accumulate", "T accumulate(first, last, T init)", "求和/累积，初值类型决定返回类型，求 long long 时初值写 0LL。", "long long s = accumulate(v.begin(), v.end(), 0LL);"],
      ["max_element", "iterator max_element(first, last)", "返回最大元素迭代器，用 *it 取值；空区间返回 last。", "*max_element(v.begin(), v.end());"],
      ["next_permutation", "bool next_permutation(first, last)", "生成下一个字典序排列，返回 false 表示已是最后一个。", "do { ... } while (next_permutation(a.begin(), a.end()));"],
      ["set::insert", "pair<iterator,bool> insert(const T& x)", "插入并去重，O(log n)，second 表示是否真的插入。", "auto [it, ok] = s.insert(3);"],
      ["set::lower_bound", "iterator lower_bound(const T& x)", "集合内第一个 >= x 的位置，用于找前驱后继。", "auto it = s.lower_bound(5);"],
      ["map::operator[]", "T& operator[](const K& k)", "访问并自动插入默认值，误用会悄悄增加元素，只读时用 find/at。", "m[\"a\"]++;  // 不存在则先插入 0"],
      ["map::count", "size_t count(const K& k)", "返回 key 出现次数（map 中非 0 即 1），常用于存在性判断。", "if (m.count(k)) ..."],
      ["unordered_map::reserve", "void reserve(size_t n)", "预分配桶数，减少 rehash，竞赛中可显著提速。", "um.reserve(1 << 20);"],
      ["priority_queue", "priority_queue<T, Container, Compare>", "默认大根堆；小根堆写 greater<T>；自定义类型写仿函数。", "priority_queue<int, vector<int>, greater<int>> pq;"],
      ["stack / queue", "stack<T>; queue<T>", "分别提供 push/pop/top 与 push/pop/front；底层默认 deque。", "stack<int> st; st.push(1); st.top();"],
      ["deque", "deque<T>", "双端队列，两端 O(1) 增删，单调队列的标准容器。", "dq.push_back(i); dq.pop_front();"],
      ["__gcd", "int __gcd(int a, int b)", "GCC 内置 gcd，C++17 起可用 std::gcd（<numeric>）。", "int g = std::gcd(12, 18);"],
      ["bitset", "bitset<N>", "固定长度位集合，支持整体位运算，常用于状压与集合表示。", "bitset<64> b; b.set(3); b.count();"],
      ["memset", "void* memset(void* p, int v, size_t n)", "按字节填充，只能安全用于 0 和 -1（0x3f 也常用作 INF）。", "memset(a, 0, sizeof(a));"],
      ["ios::sync_with_stdio", "static void sync_with_stdio(bool)", "关闭 C/C++ 流同步，让 cin/cout 接近 scanf/printf；关闭后不要混用 printf。", "ios::sync_with_stdio(false); cin.tie(nullptr);"]
    ]
  },
  py: {
    name: "Python 标准库手册", icon: "🐍",
    entries: [
      ["list.append", "list.append(x)", "尾部追加，均摊 O(1)。", "a.append(1)"],
      ["list.pop", "list.pop(i=-1)", "删除并返回指定位置元素，默认尾部 O(1)，中间 O(n)。", "a.pop(); a.pop(0)"],
      ["list.insert", "list.insert(i, x)", "在 i 前插入，O(n)。", "a.insert(0, 9)"],
      ["list.sort", "list.sort(key=None, reverse=False)", "原地排序，稳定，O(n log n)；sorted() 返回新列表。", "a.sort(key=lambda x: -x)"],
      ["list.index", "list.index(x)", "返回首个匹配下标，不存在抛 ValueError。", "a.index(3)"],
      ["list.count", "list.count(x)", "统计出现次数，O(n)。", "a.count(1)"],
      ["list slicing", "a[start:stop:step]", "切片创建新列表；step 为负即倒序。", "a[::-1]  # 反转"],
      ["dict.get", "dict.get(k, default=None)", "安全取值，缺失返回默认值，不会抛 KeyError。", "d.get('a', 0)"],
      ["dict.setdefault", "dict.setdefault(k, default)", "键不存在时写入默认值并返回，常用于分组初始化。", "d.setdefault(k, []).append(v)"],
      ["dict.items", "dict.items()", "返回键值对视图，遍历时解包最方便。", "for k, v in d.items(): ..."],
      ["collections.Counter", "Counter(iterable)", "计数器，支持 most_common(n) 与加减运算。", "Counter('aab').most_common(1)"],
      ["collections.defaultdict", "defaultdict(factory)", "缺失键自动用工厂函数创建，建图/分组神器。", "g = defaultdict(list)"],
      ["collections.deque", "deque(iterable, maxlen=None)", "双端队列，两端 append/pop 均 O(1)，滑动窗口首选。", "dq.popleft()"],
      ["collections.OrderedDict", "OrderedDict()", "保持插入顺序（3.7+ 普通 dict 也有序），move_to_end 常用于 LRU。", "od.move_to_end(k)"],
      ["heapq.heappush", "heappush(heap, x)", "小根堆入堆 O(log n)；大根堆存负数。", "heappush(h, -x)"],
      ["heapq.heapify", "heapify(list)", "原地建堆 O(n)，比逐个 push 快。", "heapify(a)"],
      ["heapq.nlargest", "nlargest(n, iterable, key=None)", "取前 n 大，内部用堆，O(m log n)。", "nlargest(3, a)"],
      ["bisect.bisect_left", "bisect_left(a, x)", "第一个 >= x 的下标，配合 insort 做有序插入。", "bisect_left([1,3,5], 3)  # 1"],
      ["itertools.permutations", "permutations(iterable, r=None)", "全排列，返回元组迭代器，O(n!)。", "list(permutations([1,2,3]))"],
      ["itertools.combinations", "combinations(iterable, r)", "组合，按字典序生成。", "list(combinations('abc', 2))"],
      ["itertools.accumulate", "accumulate(iterable, func=operator.add)", "前缀和/累积，可传自定义函数。", "list(accumulate([1,2,3]))  # [1,3,6]"],
      ["functools.lru_cache", "lru_cache(maxsize=None)", "记忆化装饰器，把递归复杂度从天量降到状态数。", "@lru_cache(None)\ndef fib(n): ..."],
      ["functools.cmp_to_key", "cmp_to_key(cmp)", "把比较函数转成 key，用于自定义排序。", "sorted(a, key=cmp_to_key(cmp))"],
      ["math.gcd", "math.gcd(*ints)", "最大公约数，3.9+ 支持多参数；math.lcm 类似。", "gcd(12, 18)"],
      ["math.isqrt", "math.isqrt(n)", "整数平方根（向下取整），避免浮点误差。", "isqrt(10)  # 3"],
      ["math.inf", "math.inf", "正无穷，用于初始化最短路距离等。", "dist = [math.inf] * n"],
      ["random.shuffle", "random.shuffle(a)", "原地打乱，洗牌/随机化快排用。", "shuffle(a)"],
      ["sys.stdin.readline", "sys.stdin.readline()", "按行读入，比 input() 快，竞赛必用。", "input = sys.stdin.readline"],
      ["sys.setrecursionlimit", "sys.setrecursionlimit(n)", "调高递归深度上限，默认约 1000 层不够用。", "setrecursionlimit(1 << 20)"],
      ["str.join", "str.join(iterable)", "用分隔符拼接，比循环 + 快得多。", "','.join(['a','b'])"],
      ["str.split", "str.split(sep=None, maxsplit=-1)", "按分隔符切分，无参时按任意空白切分并丢弃空串。", "'a b'.split()"],
      ["str.strip", "str.strip(chars=None)", "去两端指定字符，默认去空白；lstrip/rstrip 单侧。", "'  x '.strip()"],
      ["str.translate", "str.translate(table)", "按映射表批量替换字符，比多次 replace 高效。", "s.translate(str.maketrans('ab','xy'))"]
    ]
  },
  java: {
    name: "Java 标准库手册", icon: "☕",
    entries: [
      ["ArrayList.add", "boolean add(E e)", "尾部追加，均摊 O(1)，扩容为 1.5 倍。", "list.add(1);"],
      ["ArrayList.get", "E get(int i)", "按下标取值 O(1)，越界抛 IndexOutOfBoundsException。", "list.get(0);"],
      ["ArrayList.remove", "E remove(int i) / boolean remove(Object o)", "两个重载语义不同：传 int 删下标，传对象删元素。", "list.remove(Integer.valueOf(1));"],
      ["Collections.sort", "void sort(List<T> list)", "列表排序，稳定归并，O(n log n)。", "Collections.sort(list);"],
      ["Collections.reverse", "void reverse(List<?> list)", "原地反转列表。", "Collections.reverse(list);"],
      ["Arrays.sort", "void sort(int[] a)", "基本类型用双轴快排（不稳定），对象数组用归并（稳定）。", "Arrays.sort(a);"],
      ["Arrays.fill", "void fill(int[] a, int val)", "批量填充，初始化 DP 数组常用。", "Arrays.fill(dp, -1);"],
      ["Arrays.copyOf", "int[] copyOf(int[] a, int len)", "拷贝并指定新长度，超长部分补默认值。", "int[] b = Arrays.copyOf(a, 20);"],
      ["Arrays.binarySearch", "int binarySearch(int[] a, int key)", "有序数组二分查找，返回下标或 -(插入点)-1。", "int i = Arrays.binarySearch(a, 5);"],
      ["String.charAt", "char charAt(int i)", "取字符 O(1)，String 内部是 byte[]/char[]。", "s.charAt(0);"],
      ["String.substring", "String substring(int b, int e)", "截取 [b, e)，左闭右开。", "s.substring(1, 3);"],
      ["String.equals", "boolean equals(Object o)", "比较内容；== 比较引用，字符串比较一定用 equals。", "s.equals(\"abc\");"],
      ["StringBuilder.append", "StringBuilder append(x)", "可变字符串拼接，循环拼接必须用它，避免 O(n²)。", "sb.append('a').append(1);"],
      ["StringBuilder.reverse", "StringBuilder reverse()", "原地反转字符序列。", "sb.reverse().toString();"],
      ["Integer.parseInt", "static int parseInt(String s)", "字符串转 int，非法输入抛 NumberFormatException。", "Integer.parseInt(\"42\");"],
      ["Integer.valueOf", "static Integer valueOf(int i)", "装箱，-128~127 走缓存池，所以 == 有时为 true 有时 false。", "Integer.valueOf(127) == Integer.valueOf(127);"],
      ["HashMap.getOrDefault", "V getOrDefault(K k, V d)", "安全取值，缺失返回默认值，计数场景常用。", "map.getOrDefault(k, 0) + 1"],
      ["HashMap.merge", "V merge(K k, V v, BiFunction f)", "一键计数/累加，避免 if 判空。", "map.merge(ch, 1, Integer::sum);"],
      ["HashMap.computeIfAbsent", "V computeIfAbsent(K k, Function f)", "键缺失时计算并写入，分组初始化神器。", "g.computeIfAbsent(k, x -> new ArrayList<>()).add(v);"],
      ["TreeMap.floorKey", "K floorKey(K k)", "返回 <= k 的最大键，用于找前驱。", "tm.floorKey(5);"],
      ["TreeSet.ceiling", "E ceiling(E e)", "返回 >= e 的最小元素，用于找后继。", "ts.ceiling(5);"],
      ["PriorityQueue", "PriorityQueue(Comparator)", "默认小根堆；大根堆传 (a,b)->b-a；元素需可比较。", "new PriorityQueue<>((a,b) -> b - a);"],
      ["ArrayDeque", "ArrayDeque<E>", "既是栈也是队列，比 Stack/LinkedList 更快，官方推荐。", "Deque<Integer> st = new ArrayDeque<>();"],
      ["HashSet.add", "boolean add(E e)", "插入并去重，返回是否新增。", "set.add(3);"],
      ["Math.floorDiv", "int floorDiv(int x, int y)", "向下取整除法，负数场景与 / 不同。", "Math.floorDiv(-7, 2);  // -4"],
      ["Math.floorMod", "int floorMod(int x, int y)", "结果符号跟随除数，取模更符合数学定义。", "Math.floorMod(-7, 2);  // 1"],
      ["Math.abs", "int abs(int a)", "绝对值，注意 Math.abs(Integer.MIN_VALUE) 仍是负数（溢出）。", "Math.abs(-5);"],
      ["String.format", "static String format(String f, Object... a)", "格式化输出，%d %s %.2f 常用。", "String.format(\"%.2f\", 3.14159);"],
      ["Stream.filter", "Stream<T> filter(Predicate)", "惰性筛选，需终端操作触发执行。", "list.stream().filter(x -> x > 0).count();"],
      ["Stream.map", "Stream<R> map(Function)", "一对一变换。", "list.stream().map(x -> x * 2).toList();"],
      ["Collectors.toMap", "Collectors.toMap(k, v)", "流转 Map，键冲突需给合并函数否则抛异常。", "collect(Collectors.toMap(k, v, (a, b) -> a));"],
      ["BigInteger", "new BigInteger(String s)", "任意精度整数，add/multiply/modPow 都有。", "new BigInteger(\"123\").modPow(exp, mod);"]
    ]
  },
  c: {
    name: "C 标准库手册", icon: "⬜",
    entries: [
      ["printf", "int printf(const char* fmt, ...)", "格式化输出，返回输出字符数。%d %lld %f %c %s %p 常用。", "printf(\"%d %lld\\n\", a, b);"],
      ["scanf", "int scanf(const char* fmt, ...)", "格式化输入，必须传地址；返回成功匹配的项数。", "scanf(\"%d %d\", &a, &b);"],
      ["fgets", "char* fgets(char* s, int n, FILE* f)", "安全读一行，最多 n-1 字符，会保留换行符。", "fgets(buf, 100, stdin);"],
      ["sscanf", "int sscanf(const char* s, const char* fmt, ...)", "从字符串解析，比手动分割省事。", "sscanf(line, \"%d %d\", &a, &b);"],
      ["sprintf", "int sprintf(char* s, const char* fmt, ...)", "格式化到字符串，注意缓冲区长度。", "sprintf(buf, \"%d\", x);"],
      ["malloc", "void* malloc(size_t n)", "申请 n 字节未初始化内存，失败返回 NULL，必须 free。", "int* p = malloc(n * sizeof(int));"],
      ["calloc", "void* calloc(size_t n, size_t sz)", "申请并清零，适合数组。", "int* p = calloc(n, sizeof(int));"],
      ["realloc", "void* realloc(void* p, size_t n)", "调整已分配块大小，可能搬移，返回值必须接住。", "p = realloc(p, 2 * n * sizeof(int));"],
      ["free", "void free(void* p)", "释放堆内存；重复 free 或 free 非堆指针会崩溃。", "free(p); p = NULL;"],
      ["memset", "void* memset(void* p, int v, size_t n)", "按字节填充，仅 0 / -1 / 0x3f 安全。", "memset(a, 0, sizeof(a));"],
      ["memcpy", "void* memcpy(void* d, const void* s, size_t n)", "按字节拷贝，源与目标重叠时应用 memmove。", "memcpy(b, a, n * sizeof(int));"],
      ["strlen", "size_t strlen(const char* s)", "求长度（不含 '\\0'），O(n)，循环里别反复调用。", "int n = strlen(s);"],
      ["strcpy / strncpy", "char* strcpy(char* d, const char* s)", "字符串拷贝；strncpy 限长但不保证结尾有 '\\0'。", "strcpy(dst, src);"],
      ["strcmp", "int strcmp(const char* a, const char* b)", "字典序比较，返回 0 表示相等。", "if (strcmp(a, b) == 0) ..."],
      ["strcat", "char* strcat(char* d, const char* s)", "追加字符串，目标缓冲区必须足够大。", "strcat(dst, \"!\");"],
      ["strstr", "char* strstr(const char* h, const char* n)", "查找子串首次出现，找不到返回 NULL。", "if (strstr(s, \"ab\")) ..."],
      ["qsort", "void qsort(void* b, size_t n, size_t sz, int(*cmp)(const void*, const void*))", "通用排序，比较函数返回负数/0/正数。", "qsort(a, n, sizeof(int), cmp);"],
      ["bsearch", "void* bsearch(const void* k, const void* b, size_t n, size_t sz, int(*cmp)(...))", "有序数组二分查找，返回元素指针或 NULL。", "int* p = bsearch(&x, a, n, sizeof(int), cmp);"],
      ["abs / labs / llabs", "int abs(int)", "整数绝对值；浮点用 fabs。", "abs(-3);"],
      ["sqrt / pow", "double sqrt(double)", "开方/幂运算，需链接 -lm。", "sqrt(2.0); pow(2, 10);"],
      ["floor / ceil / round", "double floor(double)", "向下/向上/四舍五入取整，返回 double。", "floor(2.9);"],
      ["fmod", "double fmod(double x, double y)", "浮点取余，符号跟随被除数。", "fmod(5.5, 2.0);"],
      ["isdigit / isalpha", "int isdigit(int c)", "字符分类，需 <ctype.h>；返回非 0 表示真。", "if (isdigit(c)) ..."],
      ["toupper / tolower", "int toupper(int c)", "大小写转换，非字母字符原样返回。", "toupper('a');"],
      ["atoi / atoll", "int atoi(const char* s)", "字符串转整数，非法时不报错只返回 0，建议用 strtol。", "atoi(\"123\");"],
      ["strtol", "long strtol(const char* s, char** end, int base)", "带错误检测的转换，base 可指定进制。", "strtol(\"ff\", NULL, 16);"],
      ["rand / srand", "int rand(void)", "伪随机数 0~RAND_MAX；用 srand(time(NULL)) 播种。", "srand(time(NULL)); rand() % 100;"],
      ["time", "time_t time(time_t* t)", "取当前时间戳（秒），用于随机种子与计时。", "srand((unsigned)time(NULL));"],
      ["clock", "clock_t clock(void)", "取 CPU 时间，用于测算法耗时。", "double t = (double)clock() / CLOCKS_PER_SEC;"],
      ["fopen / fclose", "FILE* fopen(const char* p, const char* m)", "打开文件，模式 r/w/a 加 b 表示二进制。", "FILE* fp = fopen(\"in.txt\", \"r\");"],
      ["fread / fwrite", "size_t fread(void* p, size_t sz, size_t n, FILE* f)", "二进制批量读写，竞赛快速读入常用。", "fread(buf, 1, len, fp);"],
      ["assert", "void assert(int expr)", "断言，条件为假时终止；正式提交前常加 #define NDEBUG 关闭。", "assert(n > 0);"]
    ]
  }
};

function buildManual() {
  const out = {};
  for (const [lang, m] of Object.entries(MANUAL)) {
    const entries = [];
    m.entries.forEach(([name, sig, desc, ex], i) => {
      entries.push({
        id: `${lang}-${i}`,
        name, sig, desc, ex,
        // 每条附三条使用要点，保证内容可读而非堆字
        notes: [
          `适用场景：${desc.slice(0, 28)}${desc.length > 28 ? "…" : ""}`,
          `常见坑：忽略返回值或边界条件（空容器、越界、类型溢出）是最高频错误。`,
          `与相近 API 的取舍：优先选复杂度更优、语义更清晰的写法，可读性同样重要。`
        ]
      });
    });
    out[lang] = { name: m.name, icon: m.icon, entries };
  }
  return out;
}

// ============ 2. 面试题库 ============
const INTERVIEW_TOPICS = [
  { t: "语言基础", qs: [
    ["C++ 中 int 和 long 的区别？", "C++ 标准只保证 int 至少 16 位、long 至少 32 位，具体宽度由平台决定。Windows 64 位下 long 仍是 4 字节，Linux 64 位下是 8 字节。需要确定宽度时用 <cstdint> 的 int32_t / int64_t。算法题里求和大范围累加直接用 long long。"],
    ["值传递、引用传递、指针传递的差异？", "值传递拷贝一份，修改不影响实参；引用传递是别名，无拷贝、可修改；指针传递本质也是值传递，只是传的是地址。大对象传参用 const 引用，既能避免拷贝又不允许修改。C 语言没有引用，只能靠指针。"],
    ["Python 的 list 和 tuple 区别？", "list 可变、支持增删改；tuple 不可变、可哈希、可作为 dict 的 key，访问略快。函数返回多值本质是元组。需要不可变语义或作为字典键时选 tuple。"],
    ["Java 的 == 和 equals 区别？", "== 比较基本类型的值或引用类型的地址；equals 默认也是地址比较，String/包装类等重写了 equals 变成内容比较。包装类缓存 -128~127，所以 Integer a=127,b=127 时 == 为 true，128 时为 false。"],
    ["C 语言为什么没有引用？", "C 的设计目标是贴近硬件、语义简单，引用是 C++ 引入的语法糖（编译器层面用指针实现）。C 通过指针 + 取地址符实现同等效果，代价是语法更啰嗦、更容易出错。"],
    ["Python 的 GIL 是什么？", "全局解释器锁，保证同一时刻只有一个线程执行字节码。因此 CPU 密集任务多线程无法并行，应改用多进程；IO 密集任务多线程仍然有效，因为等待时会释放 GIL。"],
    ["Java 的 String 为什么不可变？", "为了线程安全、可安全作为哈希键（hash 可缓存）、支持字符串常量池复用。每次拼接都会创建新对象，所以循环拼接要用 StringBuilder。"]
  ]},
  { t: "数据结构", qs: [
    ["数组和链表的区别？", "数组内存连续、随机访问 O(1)、插入删除 O(n)；链表内存分散、访问 O(n)、已知位置插入删除 O(1)。缓存友好性上数组远胜链表，实际工程里 vector 常常比 list 更快。"],
    ["栈和队列分别适合什么场景？", "栈：括号匹配、表达式求值、DFS、单调栈；队列：BFS、层序遍历、滑动窗口、任务调度。二者都可用数组模拟，竞赛里数组模拟栈/队列更快。"],
    ["哈希表的冲突怎么解决？", "链地址法（Java HashMap、C++ unordered_map 主流）和开放寻址法（线性探测、二次探测）。负载因子超过阈值（常见 0.75）触发扩容 rehash。"],
    ["红黑树和 AVL 树的区别？", "AVL 更严格平衡（高度差 ≤1），查询更快但旋转更频繁；红黑树放宽平衡（最长路径 ≤ 两倍最短），插入删除旋转少，综合性能更好，所以 map/set 用它实现。"],
    ["堆是什么？用数组怎么存？", "完全二叉树 + 堆序性质（父 >= 子为大根堆）。数组存储 parent=(i-1)/2，children=2i+1/2i+2。插入上浮、删除下沉，都是 O(log n)。"],
    ["Trie 树的优势？", "前缀查询 O(长度)，与集合大小无关。适合前缀匹配、单词自动补全、01-Trie 求异或最大值。代价是空间开销大，每个节点要存子节点指针。"],
    ["并查集能解决什么问题？", "连通性判断、动态合并集合、判环、Kruskal 最小生成树。核心两行：find 路径压缩 + merge。不支持拆分，需要拆分时用离线倒序处理。"]
  ]},
  { t: "算法与复杂度", qs: [
    ["时间复杂度的大 O 怎么估算？", "只保留最高阶项、忽略常数。看循环嵌套层数与每层的迭代次数；递归用递推式（如 T(n)=2T(n/2)+n 是 O(n log n)）。经验值：1 秒约 1e8 次简单运算。"],
    ["什么情况下用二分？", "有序性（数组有序、答案具有单调性）。典型信号：「最小值最大 / 最大值最小」「第 k 个满足条件的」。二分答案需要写 check 函数验证可行性。"],
    ["DP 和贪心的区别？", "贪心每步取局部最优且不回退，要求能证明无后效性；DP 保留所有可能状态，通过状态转移求全局最优。判断方法：举反例——能找到反例就必须用 DP。"],
    ["回溯和 DFS 的关系？", "回溯是 DFS 的一种应用形态：DFS 负责遍历决策树，回溯负责在递归返回时撤销选择恢复状态。剪枝是回溯的性能关键。"],
    ["BFS 为什么能求最短路？", "因为按层扩展，第一次到达某点时经过的边数最少。前提是边权相同（都为 1）；边权不同要用 Dijkstra。"],
    ["Dijkstra 为什么不能处理负权边？", "它依赖贪心性质：每次取出当前距离最小的点即认为其最短距离确定。负权边可能在之后提供更短路径，破坏该性质。负权用 Bellman-Ford / SPFA。"],
    ["排序算法的稳定性有什么实际意义？", "多关键字排序时可以先按次要关键字排，再稳定地按主要关键字排，结果正确；不稳定排序需要把比较写成多关键字联合比较。"]
  ]},
  { t: "操作系统与内存", qs: [
    ["进程和线程的区别？", "进程是资源分配单位（独立地址空间），线程是调度单位（共享进程内存）。进程切换开销大、隔离性好；线程切换轻量但需要同步保护共享数据。"],
    ["栈区和堆区的区别？", "栈由编译器自动管理，存放局部变量和函数调用信息，大小有限（默认几 MB），分配极快；堆手动管理（malloc/new），空间大但分配慢、易泄漏。"],
    ["什么是内存泄漏？如何避免？", "申请的内存未释放导致可用内存持续减少。C/C++ 要配对 malloc/free、new/delete，或用 RAII/智能指针；Java/Python 有 GC，但持有无用的强引用同样会泄漏。"],
    ["虚拟内存的作用？", "让每个进程拥有独立连续地址空间，实现隔离；通过页表把虚拟地址映射到物理页，配合换页机制让可用内存超过物理内存。"],
    ["缓存为什么能提速？", "程序具有时间局部性和空间局部性。缓存行（通常 64 字节）预取相邻数据，所以顺序遍历数组远快于随机跳转——这是数组优于链表的重要原因。"]
  ]},
  { t: "工程与调试", qs: [
    ["程序 WA 了怎么排查？", "按序检查：数据范围与溢出、边界（n=0/1、全相同、负数）、多组数据是否清空、输出格式；再写暴力对拍随机数据。对拍是定位逻辑错误效率最高的手段。"],
    ["TLE 了怎么办？", "先重算复杂度是否与数据范围匹配；再考虑常数优化：快速 IO、减少拷贝（用引用）、避免重复计算、更换容器（vector 换数组）、必要时换算法。"],
    ["如何保证代码质量？", "小步提交、每步验证；写好边界测试用例；保持函数单一职责；命名清晰；关键逻辑加注释；用断言暴露不可能状态。"],
    ["为什么说可读性比炫技重要？", "代码是写给人看的，编译器只负责一次翻译，维护者要看很多次。清晰的三行 for 循环胜过一行晦涩的 reduce。"],
    ["版本管理的基本习惯？", "一个提交只做一件事；提交信息写清动机；大改前先切分支；不提交密钥与构建产物；定期合并主干避免长期分支。"]
  ]},
  { t: "数据库与存储", qs: [
    ["索引为什么能加速查询？", "索引本质是额外的有序结构（B+ 树或哈希），把 O(n) 的全表扫描变成 O(log n) 的定位。B+ 树叶子有序且相互链接，所以既能做等值查询也能做范围查询和排序，这是关系库默认选它的原因。"],
    ["B+ 树和 B 树的区别？", "B+ 树只有叶子节点存数据、内部节点只存键，因此同样大小的页能容纳更多键、树更矮（通常 3~4 层就支撑千万级数据）；叶子节点用链表相连，范围扫描只需顺着叶子走。代价是等值查询必须走到叶子。"],
    ["为什么建议用自增主键而不是 UUID？", "自增主键顺序写入，只在 B+ 树右侧追加，页分裂少、缓存命中率高；UUID 随机分布，每次插入都可能落在中间页触发分裂与随机 IO，索引体积也更大（16 字节 vs 8 字节）。分布式场景不得不用全局唯一 ID 时，可以选择雪花 ID 这类趋势递增的方案。"],
    ["最左前缀原则是什么？", "联合索引 (a, b, c) 只有在条件包含 a 的连续前缀时才能用上，比如 a、a+b、a+b+c 都可以，单独查 b 或 c 用不到。范围查询会中断后续列的使用（a = 1 and b > 2 and c = 3 中 c 用不上索引）。"],
    ["事务的四个特性怎么理解？", "原子性（要么全成功要么全回滚）、一致性（约束在事务前后都成立）、隔离性（并发事务互不干扰）、持久性（提交后落盘不丢）。实现上靠 undo log 保证原子性、redo log 保证持久性、锁与 MVCC 保证隔离性。"],
    ["四种隔离级别分别解决什么问题？", "读未提交会脏读；读已提交解决脏读但会不可重复读；可重复读解决不可重复读（MySQL 默认），但仍可能出现幻读，靠间隙锁缓解；串行化全部解决但并发性能最差。级别越高一致性越强、并发越低。"],
    ["什么时候不该建索引？", "区分度极低的列（如性别、状态位）收益很小；写入远多于读取的表索引维护成本高；频繁更新的列会导致页分裂；列上做函数运算或隐式类型转换会让索引用不上。索引不是越多越好，通常控制在 5 个以内。"]
  ]},
  { t: "网络与协议", qs: [
    ["TCP 三次握手为什么不能是两次？", "两次握手无法让服务端确认「客户端收到了我的 SYN-ACK」，历史上失效的连接请求可能让服务端白白建立连接。三次握手同时交换了双方的初始序列号，是可靠传输的起点。"],
    ["为什么挥手要四次？", "TCP 是全双工，一方关闭只是表示自己不再发送数据，但对方可能还有数据要发，所以被动方要先把剩余数据发完，再单独发 FIN。主动方的 ACK 与被动方的 FIN 分开发送，就形成了四次。"],
    ["TCP 和 UDP 怎么选？", "TCP 提供可靠有序传输、流量控制与拥塞控制，适合文件、HTTP、数据库连接；UDP 无连接、开销小、延迟低，适合实时音视频、游戏、DNS。需要在 UDP 上要可靠性时，就在应用层自己实现重传与序号。"],
    ["HTTP/1.1、HTTP/2、HTTP/3 的演进？", "1.1 引入长连接和管道化，但仍有队头阻塞；2 用二进制分帧 + 多路复用解决应用层队头阻塞，还支持头部压缩和服务端推送；3 基于 QUIC（走 UDP），解决 TCP 层的队头阻塞，并支持连接迁移与 0-RTT 握手。"],
    ["HTTPS 的握手在做什么？", "先用非对称加密（证书里的公钥）安全地协商出一个对称密钥，之后通信用对称加密传输。非对称开销大只用于协商，对称加密速度快用于数据传输，这是性能与安全的折中。证书链解决「公钥属于谁」的信任问题。"],
    ["从输入 URL 到页面展示经历了什么？", "DNS 解析域名 → 建立 TCP 连接 → TLS 握手（HTTPS）→ 发送 HTTP 请求 → 服务端处理并返回响应 → 浏览器解析 HTML 构建 DOM、下载并执行 CSS/JS → 布局与绘制。中间任一步都有缓存可以介入。"],
    ["跨域是什么，怎么解决？", "浏览器的同源策略限制脚本读取其他源的响应（协议、域名、端口任一不同即跨域）。标准解法是服务端返回 CORS 响应头；同源部署或反向代理也能规避；JSONP 是历史方案，只支持 GET。"]
  ]},
  { t: "并发与同步", qs: [
    ["进程和线程的区别？", "进程是资源分配单位，有独立地址空间；线程是调度单位，同一进程内线程共享堆和全局数据、各自独享栈。进程切换开销大但隔离好，线程切换轻但共享状态需要同步。"],
    ["死锁的四个必要条件？", "互斥、占有并等待、不可剥夺、循环等待。破坏任意一个即可预防：一次性申请全部资源（破坏占有并等待）、按全局顺序加锁（破坏循环等待）、设置超时后可回滚（破坏不可剥夺）。"],
    ["乐观锁和悲观锁怎么选？", "悲观锁假设冲突频繁，先加锁再操作（如 select ... for update），一致性强但并发差；乐观锁假设冲突少，用版本号或 CAS 在提交时校验，冲突少时吞吐高，冲突多时重试成本大。读多写少用乐观锁，写竞争激烈用悲观锁。"],
    ["volatile 能保证线程安全吗？", "不能。volatile 只保证可见性和禁止指令重排，不保证复合操作的原子性。i++ 这种读改写三步操作即使加了 volatile 仍然会丢更新，必须用锁或原子类。"],
    ["线程池的核心参数怎么设？", "核心线程数、最大线程数、队列容量、拒绝策略、空闲存活时间。CPU 密集型线程数约等于核数 + 1；IO 密集型可以更大（核数 × 2 或按等待时间比例估算）。队列不要无界，否则最大线程数永远不会生效。"],
    ["CAS 有什么问题？", "ABA 问题（值改回原值检测不到，可用版本号解决）、自旋消耗 CPU（竞争激烈时退化）、只能保证单个变量的原子性（多变量要加锁或封装成对象）。"],
    ["为什么说共享可变状态是 bug 之源？", "并发读写同一份数据时，任何没加同步的复合操作都可能被交错执行。最彻底的解法是减少共享：用不可变对象、线程本地存储或消息传递，让每个线程只碰自己的数据。"]
  ]},
  { t: "缓存与性能优化", qs: [
    ["缓存穿透、击穿、雪崩分别是什么？", "穿透：查不存在的数据，每次都打到数据库，用布隆过滤器或空值缓存挡住；击穿：热点 key 过期瞬间大量请求涌向数据库，用互斥锁或逻辑过期；雪崩：大批 key 同时过期或缓存整体宕机，用过期时间加随机抖动 + 多级缓存 + 限流降级。"],
    ["缓存一致性怎么保证？", "常用策略是先更新数据库再删除缓存（Cache Aside），并为删除失败加重试或消息队列补偿。强一致只能靠分布式锁或读写都串行化，代价是性能；多数业务接受短暂不一致。"],
    ["为什么用 LRU 而不是 FIFO 淘汰？", "LRU 依据时间局部性，淘汰最久未访问的项，更贴合真实访问分布；FIFO 只看进入时间，可能把长期热点但最近未访问的项淘汰掉。实现上 LRU 用哈希表 + 双向链表，均摊 O(1)。"],
    ["什么时候优化是过早优化？", "在没测量出瓶颈前就猜性能热点、为了一点常数去牺牲可读性、给不确定会增长的场景提前做分片。正确顺序是：先测量（profile）、再定位、再针对性优化，最后用数据验证收益。"],
    ["空间换时间的典型例子？", "哈希表用额外空间换 O(1) 查找、前缀和用 O(n) 空间换 O(1) 区间查询、记忆化用缓存换掉重复子问题、位图用 bit 压缩布尔数组。反向例子是流式处理：为了常数空间宁愿多扫几遍。"],
    ["怎么定位一个接口变慢的原因？", "先看监控确定是整体变慢还是个别请求；再看依赖调用耗时（数据库慢查询、下游 RPC、锁等待）；用 profile 或火焰图定位到具体函数；最后才改代码。没有数据支撑的优化都是碰运气。"],
    ["N+1 查询问题是什么？", "查出一批主记录后，对每条记录单独再查一次关联数据，导致 1 + N 次数据库往返。解法是批量查询（IN 语句）后在内存里做映射，或用 JOIN / 预加载（eager loading）。"]
  ]},
  { t: "测试与质量保障", qs: [
    ["单元测试该测什么？", "测行为不测实现：给定输入是否产出预期输出、边界是否被正确处理、异常路径是否按约定抛出。不要把私有方法当测试对象，也不要为了覆盖率去测 getter。"],
    ["如何设计一个好用的测试用例？", "覆盖等价类（正常值、边界值、非法值），用参数化减少重复，用固定随机种子保证可复现，一次断言一件事。测试名要能读出「在什么情况下期望什么结果」。"],
    ["对拍为什么有效？", "它有独立的第二个实现（通常是暴力解法）作为参照，能在大量随机数据上自动发现差异并保留最小反例。相比人眼看代码，对拍把「找 bug」变成了机械过程，效率高一个数量级。"],
    ["如何判断一个 bug 是不是回归？", "先把触发条件写成自动化测试用例，确认它在修复前失败、修复后通过。这条用例从此就是这道 bug 的守门人，避免以后重构时又踩一次。"],
    ["代码评审该关注什么？", "正确性与边界、异常处理、并发安全、命名与可读性、是否有更简单的写法、测试是否覆盖关键路径。不要纠结格式，那该交给格式化工具。"],
    ["如何保证重构不改变行为？", "重构前先补齐覆盖关键行为的测试，重构中保持小步提交、每步跑测试，重构后对比输出（golden test）。没有测试网的重构本质上是在赌。"],
    ["线上出问题怎么复盘？", "先止血（回滚/降级/扩容），再定位根因，再补监控与测试，最后沉淀成检查项。复盘要聚焦流程与系统缺陷，而不是追责个人，否则以后没人敢报问题。"]
  ]},
  { t: "面试临场与表达", qs: [
    ["拿到算法题先做什么？", "先复述题意并确认边界（数据范围、是否允许重复、空输入怎么处理），再问清输入输出格式。开口就说思路、边走边验证，比闷头写十分钟强得多。"],
    ["讲思路时怎么组织语言？", "先给结论（用什么算法、复杂度多少），再讲为什么（关键观察），最后讲怎么做（步骤）。面试官最想听的是你的判断依据，不是代码细节。"],
    ["被问住了怎么办？", "明确说出已知与未知的边界，提出一个可行的暴力解法先兜底，再讨论优化方向。承认「这里我不确定，但我可以这样验证」远比瞎猜更得分。"],
    ["怎么写代码让面试官放心？", "先写函数签名和关键变量含义，再填逻辑；边界处加一句注释；写完主动用一个样例手动走一遍，主动报出可能的溢出点和空数组情况。"],
    ["如何回答「你还有什么问题」？", "问团队当前的技术挑战、代码评审与上线流程、这个岗位半年内的核心目标。避免问薪资福利这类应该和 HR 谈的问题。"],
    ["为什么问复杂度而不是只问答案？", "复杂度体现你对数据规模的敏感度。同样正确的代码，O(n²) 在 n = 1e5 时直接超时，工程里则表现为随数据量增长突然崩掉。能主动说出复杂度和适用边界，说明你写过真正跑得动的代码。"]
  ]}
];

function expandInterview() {
  const items = [];
  const extraAngles = [
    { p: "换个问法：", s: "如果面试官追问「为什么不是另一种方案」，按上面的取舍理由回答，并补一句具体场景例子更有说服力。" },
    { p: "追问（性能角度）：", s: "面试官常接着问复杂度：先答时间与空间复杂度，再说明常数因子与数据规模边界，必要时给出取舍。" },
    { p: "追问（边界角度）：", s: "补充极端情况：空输入、单元素、全相同、最大值溢出。能主动提边界是加分项。" },
    { p: "追问（工程角度）：", s: "把它放到真实项目里说明：多大数据量、如何监控、出问题怎么回滚，体现工程思维。" },
    { p: "追问（取舍角度）：", s: "说出你放弃的那个方案和放弃原因。能讲清「为什么不选」，比只讲「为什么选」更显得想过细节。" },
    { p: "追问（对比角度）：", s: "找一个容易混淆的相近概念做区分，各举一个适用场景，把边界划清楚。" },
    { p: "追问（实战坑点）：", s: "补一个你踩过或见过的具体坑：什么现象、怎么定位、最后怎么改。带细节的案例最可信。" }
  ];
  INTERVIEW_TOPICS.forEach((topic) => {
    topic.qs.forEach(([q, a], qi) => {
      items.push({ id: `iv-${items.length}`, topic: topic.t, q, a });
      // 每个问题生成 7 组延伸追问，形成体系化练习
      for (let k = 0; k < 7; k++) {
        const ang = extraAngles[k % extraAngles.length];
        items.push({
          id: `iv-${items.length}`,
          topic: topic.t,
          q: `${ang.p}${q.replace(/？$/, "")}（第 ${k + 1} 层延伸）`,
          a: `${ang.s}\n\n结合本题：${a}`
        });
      }
    });
  });
  return items;
}

// ============ 3. 题库生成 ============
function buildProblems(targetBytes, targetCount) {
  const shards = [];
  const index = [];
  let cur = [], curBytes = 0, total = 0, seq = 0, round = 0;
  const r = rng(20261119);

  while ((targetCount > 0 ? seq < targetCount : total < targetBytes) && seq < 70000) {
    const type = TYPES[round % TYPES.length];
    round++;
    let p;
    try { p = type.gen(r); } catch (e) { continue; }
    let expected, inputText, outputText;
    try {
      expected = type.solve(p);
      inputText = type.inputText(p);
      outputText = type.outputText(p);
    } catch (e) { continue; }

    // 3 组样例：本题真实输入 + 另行派生的两组小规模同类输入
    const samples = [{ input: inputText, output: outputText }];
    for (let s = 0; s < 2; s++) {
      try {
        const q = type.gen(r);
        samples.push({ input: type.inputText(q), output: type.outputText(q) });
      } catch (e) { /* 忽略异常样例 */ }
    }

    const title = type.title(p);
    const id = `G${String(seq + 1).padStart(5, "0")}`;
    const explain = [
      `【思路】${type.desc(p)}`,
      ``,
      `【关键点】`,
      ...type.points.map((x, i) => `${i + 1}. ${x}`),
      ``,
      `【复杂度】本题的参考实现为线性或对数级扫描，具体量级取决于实现方式；在多组查询场景下建议先做预处理，把单次查询降到 O(1) 或 O(log n)。`,
      ``,
      `【易错提醒】注意使用足够宽度的整型承接累加结果；数组下标从 0 开始，循环上界不要写成 n；输出格式（空格、换行）必须与样例严格一致。`,
      ``,
      `【举一反三】把条件改动一下再想一遍：如果数组变成环形、如果要求输出具体方案而不是数值、如果数据规模放大 100 倍，你的解法还成立吗？`
    ].join("\n");

    const problem = {
      id, title, type: type.key, cat: type.cat, diff: type.diff,
      tags: [type.cat, type.diff === "简单" ? "入门" : type.diff === "中等" ? "进阶" : "挑战"],
      desc: type.desc(p) + `\n\n输入格式：\n${inputText}\n\n输出格式：\n${outputText} 的形式（见样例）。`,
      samples,
      sol: { cpp: type.code.cpp, python: type.code.py, java: type.code.java, c: type.code.c },
      explain
    };

    const json = JSON.stringify(problem);
    cur.push(problem);
    curBytes += Buffer.byteLength(json);
    total += Buffer.byteLength(json);
    // 紧凑索引：[id, title, diffCode, cat, shardIdx]
    index.push([id, title, type.diff === "简单" ? 0 : type.diff === "中等" ? 1 : 2, type.cat, shards.length]);

    if (cur.length >= 16) {
      shards.push(cur); cur = []; curBytes = 0;
    }
    seq++;
  }
  if (cur.length) shards.push(cur);
  return { shards, index, total, seq };
}

// ============ 主流程 ============
(function main() {
  fs.mkdirSync(DATA, { recursive: true });

  // 手册
  const manual = buildManual();
  let sideBytes = 0;
  for (const [lang, m] of Object.entries(manual)) {
    const content = `window.MANUAL_DATA = window.MANUAL_DATA || {};\nwindow.MANUAL_DATA["${lang}"] = ${JSON.stringify(m)};\n`;
    write(path.join(DATA, `manual-${lang}.js`), content);
    sideBytes += Buffer.byteLength(content);
    console.log(`manual-${lang}: ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
  }
  const manualCount = Object.values(manual).reduce((s, m) => s + m.entries.length, 0);

  // 面试题库
  const iv = expandInterview();
  const ivShards = [];
  for (let i = 0; i < iv.length; i += 40) ivShards.push(iv.slice(i, i + 40));
  ivShards.forEach((sh, i) => {
    const content = `window.INTERVIEW_SHARDS = window.INTERVIEW_SHARDS || {};\nwindow.INTERVIEW_SHARDS[${i}] = ${JSON.stringify(sh)};\n`;
    write(path.join(DATA, `interview-${String(i).padStart(3, "0")}.js`), content);
    sideBytes += Buffer.byteLength(content);
  });
  const ivIndexContent = `window.INTERVIEW_INDEX = ${JSON.stringify({ total: iv.length, shards: ivShards.length, topics: [...new Set(iv.map(x => x.topic))] })};\n`;
  write(path.join(DATA, "interview-index.js"), ivIndexContent);
  sideBytes += Buffer.byteLength(ivIndexContent);

  // 题库：只用本轮写入字节计算预算（避免旧分片虚增体积）
  const jobBytes = Math.max(TARGET - sideBytes, 0);
  const res = buildProblems(jobBytes, TARGET_COUNT);
  res.shards.forEach((sh, i) => {
    write(path.join(DATA, `problems-${String(i).padStart(3, "0")}.js`),
      `window.PROBLEM_SHARDS = window.PROBLEM_SHARDS || {};\nwindow.PROBLEM_SHARDS[${i}] = ${JSON.stringify(sh)};\n`);
  });
  write(path.join(DATA, "problems-index.js"),
    `window.PROBLEM_INDEX = ${JSON.stringify(res.index)};\n`);

  // 题型总览（供前端展示题型体系）
  write(path.join(DATA, "types-index.js"),
    `window.TYPE_INDEX = ${JSON.stringify(TYPES.map(t => ({ key: t.key, cat: t.cat, diff: t.diff })))};\n`);

  // 内容统计（首页/题海页动态读取，避免文案写死）
  const cats = [...new Set(TYPES.map(t => t.cat))];
  write(path.join(DATA, "stats.js"),
    `window.CONTENT_STATS = ${JSON.stringify({
      problems: res.seq,
      types: TYPES.length,
      cats: cats.length,
      manual: manualCount,
      interview: iv.length,
      shards: res.shards.length
    })};\n`);

  const finalSize = sizeOf(DATA);
  console.log(JSON.stringify({
    dataDirMB: +(finalSize / 1048576).toFixed(2),
    problems: res.seq,
    problemShards: res.shards.length,
    types: TYPES.length,
    manualEntries: manualCount,
    interviewItems: iv.length,
    interviewShards: ivShards.length
  }, null, 2));
})();
