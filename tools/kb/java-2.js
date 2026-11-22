// Java 第 6-10 章 · 每章 4 节微课
module.exports = [
  {
    t: "集合框架（二）",
    sub: "Map · Set · HashMap 原理 · 遍历与排序",
    mins: 55,
    kw: "哈希表",
    goals: [
      "按需求选 HashMap / TreeMap / LinkedHashMap",
      "理解 HashMap 的数组 + 链表 + 红黑树结构",
      "正确重写 equals 与 hashCode",
      "熟练做 Map 的遍历、排序与合并",
    ],
    map: [
      ["实现", "顺序", "单次操作", "用途"],
      ["HashMap", "无序", "O(1) 均摊", "通用映射"],
      ["LinkedHashMap", "插入序/访问序", "O(1)", "需要保序、LRU"],
      ["TreeMap", "按 key 排序", "O(log n)", "范围查询"],
      ["HashSet", "无序", "O(1)", "去重"],
    ],
    mic: [
      {
        t: "HashMap 的常用操作",
        lead: "`get` 返回 null 就是「不存在」，但值本身也可能是 null——用 `containsKey` 区分。",
        body: [
          "`put/get/remove/containsKey/size` 是基本操作。`getOrDefault` 一次完成「取不到给默认值并累加」的计数需求。",
          "`computeIfAbsent` 是建「一对多」结构的利器：`map.computeIfAbsent(k, x -> new ArrayList<>()).add(v)`。",
        ],
        code: `import java.util.*;

Map<String, Integer> cnt = new HashMap<>();
for (String w : new String[]{"a", "b", "a"}) {
    cnt.put(w, cnt.getOrDefault(w, 0) + 1);
}
System.out.println(cnt);                    // {a=2, b=1}
System.out.println(cnt.containsKey("a"));

Map<String, List<Integer>> groups = new HashMap<>();
groups.computeIfAbsent("x", k -> new ArrayList<>()).add(1);

for (Map.Entry<String, Integer> e : cnt.entrySet()) {
    System.out.println(e.getKey() + "=" + e.getValue());
}
cnt.forEach((k, v) -> System.out.print(k + v + " "));`,
        lang: "Java",
        pts: [
          "`map.get(k)` 缺键返回 null，不会抛异常（不像 Python 的 `d[k]`）",
          "`entrySet()` 遍历比「先 keySet 再 get」快",
          "`merge(k, 1, Integer::sum)` 也是计数写法",
        ],
        pit: "`map.put(k, map.get(k) + 1)` 在键不存在时 NPE（null 拆箱），必须用 getOrDefault。",
      },
      {
        t: "HashMap 的底层结构",
        lead: "HashMap = 数组 + 链表 + 红黑树：按 hash 定位桶，冲突就挂链，链太长转红黑树。",
        body: [
          "默认容量 16，负载因子 0.75，元素数超过 `容量 × 0.75` 就扩容为两倍并重新分布。",
          "链表长度 ≥ 8 且容量 ≥ 64 时转红黑树，查询从 O(n) 降到 O(log n)。这是 JDK 8 的重要优化。",
        ],
        code: `// 容量与负载因子的影响（可通过构造器指定）
Map<String, Integer> m1 = new HashMap<>(1024);          // 大容量，减少 rehash
Map<String, Integer> m2 = new HashMap<>(1024, 0.5f);

// 预分配：已知要放 n 个元素
int n = 10000;
Map<String, Integer> m3 = new HashMap<>((int) (n / 0.75f) + 1);

// 哈希冲突时同一个桶里挂链表
System.out.println("Aa".hashCode() == "BB".hashCode());  // true，经典碰撞`,
        lang: "Java",
        pts: [
          "扩容要重新计算所有元素位置，代价高，能预估就预分配",
          "key 的 hashCode 分布越均匀，性能越好",
          "JDK 8+ 的优化让最坏情况从 O(n) 变成 O(log n)",
        ],
        pit: "HashMap 非线程安全，多线程 put 在 JDK 7 可能形成环形链表死循环；并发场景用 ConcurrentHashMap。",
      },
      {
        t: "equals 与 hashCode 的契约",
        lead: "自定义对象当 key 时，必须同时重写 equals 和 hashCode，否则「看起来相同的两个键」会存成两份。",
        body: [
          "契约：`a.equals(b)` 为真则 `a.hashCode() == b.hashCode()` 必须成立。反过来不要求（哈希碰撞允许）。",
          "只重写 equals 不重写 hashCode，两个相等对象的哈希不同，会被放进不同的桶，导致查不到。",
        ],
        code: `import java.util.Objects;

class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() { return Objects.hash(x, y); }

    @Override
    public String toString() { return "(" + x + "," + y + ")"; }
}

java.util.Set<Point> s = new java.util.HashSet<>();
s.add(new Point(1, 2));
System.out.println(s.contains(new Point(1, 2)));   // true（正确重写后）`,
        lang: "Java",
        pts: [
          "`Objects.hash(...)` 一行生成组合哈希",
          "`instanceof` 判空顺带完成（null 会返回 false）",
          "record 类型（JDK 16+）自动生成 equals/hashCode/toString",
        ],
        pit: "用可变对象当 HashMap 的 key，改字段后哈希变了，就再也查不到了。",
      },
      {
        t: "TreeMap、LinkedHashMap 与 Set",
        lead: "需要有序用 TreeMap，需要保插入序用 LinkedHashMap（还能做 LRU），去重用 Set。",
        body: [
          "TreeMap 基于红黑树，支持 `firstKey/lastKey/floorKey/ceilingKey/subMap` 等范围操作，是 HashMap 做不到的。",
          "`LinkedHashMap` 的第三个参数 `accessOrder=true` 会按访问顺序排列，重写 `removeEldestEntry` 就是现成的 LRU 缓存。",
        ],
        code: `import java.util.*;

TreeMap<Integer, String> tm = new TreeMap<>();
tm.put(3, "c"); tm.put(1, "a"); tm.put(5, "e");
System.out.println(tm.firstKey() + " " + tm.lastKey());
System.out.println(tm.floorKey(4) + " " + tm.ceilingKey(4));

// LRU 缓存
class LRU<K, V> extends LinkedHashMap<K, V> {
    private final int cap;
    LRU(int cap) { super(16, 0.75f, true); this.cap = cap; }
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> e) {
        return size() > cap;
    }
}

Set<Integer> set = new HashSet<>(List.of(1, 2, 2, 3));
System.out.println(set.size());          // 3
TreeSet<Integer> ts = new TreeSet<>(List.of(5, 1, 3));
System.out.println(ts.first() + " " + ts.last());
System.out.println(ts.headSet(3));       // [1]`,
        lang: "Java",
        pts: [
          "`TreeMap` 的 key 必须可比较，否则抛 ClassCastException",
          "`floorKey/ceilingKey` 等价于 lower_bound 的邻居查询",
          "`TreeSet` 就是 TreeMap 只存 key 的版本",
        ],
        pit: "用 TreeMap 存自定义对象但没实现 Comparable，第一次 put 就抛 ClassCastException。",
      },
    ],
    qa: [
      ["HashMap 为什么容量是 2 的幂？", "`(n-1) & hash` 可以直接代替取模，且分布更均匀；扩容时元素只需看最高位决定去留，迁移快。"],
      ["HashSet 和 HashMap 什么关系？", "HashSet 内部就是一个 HashMap，元素当 key，value 是固定的 PRESENT 对象。"],
    ],
    sum: "计数用 getOrDefault、分组用 computeIfAbsent、有序用 TreeMap、LRU 用 LinkedHashMap。",
  },

  {
    t: "泛型与常用语法糖",
    sub: "泛型类/方法 · 类型擦除 · 通配符 · var/enum/record",
    mins: 50,
    kw: "复杂度",
    goals: [
      "写出泛型类与泛型方法",
      "理解类型擦除带来的限制",
      "会用 `? extends` 与 `? super`",
      "掌握 var、增强 switch、record 等语法糖",
    ],
    map: [
      ["语法", "含义", "注意"],
      ["`<T>`", "类型参数", "编译期检查"],
      ["`? extends T`", "上界通配（只读）", "不能 add"],
      ["`? super T`", "下界通配（可写）", "读取只能当 Object"],
      ["类型擦除", "运行时无泛型信息", "不能 new T[]"],
    ],
    mic: [
      {
        t: "泛型类与泛型方法",
        lead: "泛型让「同一份代码适配多种类型」在编译期就得到类型检查，不用到处强转。",
        body: [
          "泛型类 `class Box<T>` 在实例化时指定 T；泛型方法 `<T> T pick(T[] a)` 在调用时由参数推导 T。",
          "泛型只能是引用类型：`Box<int>` 不合法，要写 `Box<Integer>`。",
        ],
        code: `class Box<T> {
    private T value;
    void set(T v) { value = v; }
    T get() { return value; }
}

Box<String> b = new Box<>();
b.set("hi");
String s = b.get();          // 无需强转

class Util {
    static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }
}
System.out.println(Util.max(3, 7));
System.out.println(Util.max("a", "b"));`,
        lang: "Java",
        pts: [
          "`<T extends Comparable<T>>` 是「上界」，保证能调 compareTo",
          "泛型方法用 `static <T>` 声明在返回值之前",
          "菱形推断 `new Box<>()` 让编译器自己推类型",
        ],
        pit: "泛型参数不能是基本类型，`List<int>` 编译错误，必须 `List<Integer>`。",
      },
      {
        t: "类型擦除：运行时泛型不存在",
        lead: "泛型只在编译期检查，编译后所有 `List<String>` 都变成 `List`——这叫类型擦除。",
        body: [
          "因为擦除，所以不能 `new T()`、不能 `new T[n]`、不能 `instanceof List<String>`、不能重载 `f(List<String>)` 与 `f(List<Integer>)`。",
          "需要运行时类型时传 `Class<T>` 参数，或用反射。",
        ],
        code: `import java.util.*;

List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true！都是 ArrayList

// 不能这样写
// if (a instanceof List<String>) {}
// T[] arr = new T[10];

// 反射拿泛型信息（仅签名层面）
// 或传入 Class<T>
static <T> T create(Class<T> cls) throws Exception {
    return cls.getDeclaredConstructor().newInstance();
}`,
        lang: "Java",
        pts: [
          "擦除是为了兼容旧版本（JDK 5 之前没有泛型）",
          "`List<String>` 与 `List<Integer>` 运行时是同一个类",
          "数组是协变的、泛型是不变的，两者混用会出问题",
        ],
        pit: "因为擦除，`List<String>` 里其实能塞进 Integer（通过原始类型），取出来时才 ClassCastException。",
      },
      {
        t: "通配符：extends 与 super",
        lead: "`? extends T` 表示「T 或它的子类」，适合只读；`? super T` 表示「T 或它的父类」，适合写入。",
        body: [
          "记住 PECS 原则：**Producer Extends, Consumer Super**。数据来源用 extends，数据去向用 super。",
          "`List<? extends Number>` 不能 add（不知道具体是哪个子类），但能读成 Number。`List<? super Integer>` 能 add Integer，读出来只能当 Object。",
        ],
        code: `import java.util.*;

static double sum(List<? extends Number> list) {   // 只读
    double s = 0;
    for (Number n : list) s += n.doubleValue();
    return s;
}

static void fill(List<? super Integer> list, int n) {  // 只写
    for (int i = 0; i < n; i++) list.add(i);
}

List<Integer> ints = new ArrayList<>();
List<Double> dbls = new ArrayList<>();
System.out.println(sum(ints) + sum(dbls));

List<Number> nums = new ArrayList<>();
fill(nums, 3);

List<?> any = ints;      // 只读，不能 add（null 除外）`,
        lang: "Java",
        pts: [
          "`? extends T` 是协变，`? super T` 是逆变，`List<T>` 是不变",
          "`List<Object>` 与 `List<?>` 不同：前者能 add 任意对象",
          "`Collections.copy(dest, src)` 就是 PECS 的经典用例",
        ],
        pit: "`List<Object> list = new ArrayList<String>()` 编译错误——泛型不支持协变，必须 `List<? extends Object>`。",
      },
      {
        t: "现代语法糖：var、record、增强 switch",
        lead: "JDK 10+ 的几个语法糖能显著减少样板代码，但要清楚它们的边界。",
        body: [
          "`var` 只能用于局部变量且必须初始化，类型由右侧推断；它不是动态类型，编译后类型固定。",
          "`record` 是「不可变数据载体」，自动生成构造、getter、equals/hashCode/toString。",
        ],
        code: `var list = new java.util.ArrayList<String>();   // 推断为 ArrayList<String>
var n = 42;
// var x;                    // 错误：必须初始化

record Point(int x, int y) {
    Point {                                  // 紧凑构造器，可校验
        if (x < 0) throw new IllegalArgumentException();
    }
    int manhattan() { return Math.abs(x) + Math.abs(y); }
}

var p = new Point(3, 4);
System.out.println(p.x() + " " + p.manhattan());
System.out.println(p);                       // Point[x=3, y=4]

String desc = switch (p.x() % 2) {
    case 0 -> "偶";
    default -> "奇";
};`,
        lang: "Java",
        pts: [
          "`record` 的字段是 private final，访问用 `x()` 而不是 `getX()`",
          "record 不能继承其他类（已隐式继承 Record）",
          "`var` 用在 for-each 与 try-with-resources 里也很方便",
        ],
        pit: "`var` 让代码变短但也可能让类型不明显，复杂表达式还是显式写类型更好读。",
      },
    ],
    qa: [
      ["为什么 Java 泛型要擦除？", "为了向后兼容 JDK 5 之前的代码与已编译的类库，代价是运行时拿不到泛型信息。"],
      ["record 和 Lombok 的 @Data 区别？", "record 是语言特性、不可变、只有访问器；Lombok 生成可变 setter，需要额外依赖与注解处理。"],
    ],
    sum: "泛型编译期检查、擦除导致运行时无类型；PECS 记牢 extends 读 super 写。",
  },

  {
    t: "异常处理",
    sub: "try/catch/finally · 受检异常 · 自定义异常 · try-with-resources",
    mins: 45,
    kw: "字符串",
    goals: [
      "分清受检异常与运行时异常",
      "写出正确的资源释放代码",
      "定义有意义的自定义异常",
      "避开吞异常与 finally 覆盖返回值的坑",
    ],
    map: [
      ["类型", "是否必须处理", "例子"],
      ["受检异常", "必须 try 或 throws", "IOException、SQLException"],
      ["运行时异常", "不强制", "NullPointerException、IllegalArgumentException"],
      ["Error", "不该捕获", "OutOfMemoryError"],
    ],
    mic: [
      {
        t: "受检与非受检的分界",
        lead: "编译器强制你处理的是受检异常（Exception 的子类但非 RuntimeException）。",
        body: [
          "受检异常表示「外部环境可能出问题」（文件不存在、网络断），必须处理；运行时异常表示「代码写错了」（空指针、越界），不强制。",
          "`throws` 声明把责任交给调用方，`try-catch` 就地处理。选择取决于「当前层能不能合理处理」。",
        ],
        code: `import java.io.*;

// 受检：必须处理
static String read(String path) throws IOException {
    return new String(Files.readAllBytes(Path.of(path)));
}

static void read2(String path) {
    try {
        read(path);
    } catch (IOException e) {
        System.err.println("读取失败: " + e.getMessage());
    }
}

// 运行时异常：不强制
static int div(int a, int b) {
    if (b == 0) throw new ArithmeticException("除零");
    return a / b;
}`,
        lang: "Java",
        pts: [
          "`IOException`、`SQLException`、`InterruptedException` 都是受检异常",
          "`throws` 只是声明，不处理；`throw` 是抛出",
          "能在本层处理就别往上抛，否则异常会一路穿透",
        ],
        pit: "捕获受检异常后只写 `e.printStackTrace()` 就继续跑，等于把错误吞掉，线上问题无从排查。",
      },
      {
        t: "finally 与 try-with-resources",
        lead: "`finally` 一定执行（除非 JVM 退出）；JDK 7 起的 try-with-resources 能自动关闭资源，比手写 finally 更安全。",
        body: [
          "资源类实现 `AutoCloseable` 就能用 try-with-resources，即使抛异常也会按逆序关闭。",
          "`finally` 里不要写 return——它会覆盖 try 里的返回值，导致结果诡异。",
        ],
        code: `import java.io.*;

// 推荐：自动关闭
try (BufferedReader br = new BufferedReader(new FileReader("a.txt"));
     PrintWriter pw = new PrintWriter("b.txt")) {
    String line;
    while ((line = br.readLine()) != null) pw.println(line);
} catch (IOException e) {
    System.err.println(e.getMessage());
}

// 手写 finally（老写法，注意嵌套 try）
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("a.txt"));
} catch (IOException e) {
    // 处理
} finally {
    if (br != null) try { br.close(); } catch (IOException ignored) { }
}`,
        lang: "Java",
        pts: [
          "try-with-resources 的关闭顺序与声明顺序相反",
          "`AutoCloseable` 的 `close()` 可以抛异常",
          "多个资源用分号分隔，写在一个 try 里即可",
        ],
        pit: "在 finally 里 `return` 会吞掉 try 中的异常和返回值，是最隐蔽的逻辑错误之一。",
      },
      {
        t: "自定义异常与异常链",
        lead: "自定义异常让调用方能用类型区分「哪一类失败」，比解析错误字符串可靠得多。",
        body: [
          "继承 `RuntimeException` 表示「调用方可以不处理」，继承 `Exception` 表示「必须处理」。",
          "`new RuntimeException(\"msg\", cause)` 保留原始异常，`printStackTrace` 能看到完整链路。",
        ],
        code: `class BizException extends RuntimeException {
    private final String code;
    BizException(String code, String msg, Throwable cause) {
        super(msg, cause);
        this.code = code;
    }
    String getCode() { return code; }
}

static void pay(int amount) {
    if (amount <= 0) throw new IllegalArgumentException("金额必须为正");
    try {
        Integer.parseInt("abc");
    } catch (NumberFormatException e) {
        throw new BizException("E1001", "金额解析失败", e);   // 保留原因
    }
}

try {
    pay(0);
} catch (IllegalArgumentException e) {
    System.out.println("参数问题: " + e.getMessage());
} catch (BizException e) {
    System.out.println(e.getCode() + " " + e.getMessage());
}`,
        lang: "Java",
        pts: [
          "捕获顺序必须「子类在前，父类在后」",
          "保留 cause 才能看到根因，别丢掉原异常",
          "异常信息要包含「什么值导致了什么错」，方便定位",
        ],
        pit: "`catch (Exception e) {}` 空实现会把所有问题藏起来，包括本该暴露的 bug。",
      },
      {
        t: "异常使用的分寸",
        lead: "异常是「异常情况」，不是控制流——用异常做正常分支既慢又难读。",
        body: [
          "能用返回值表达（Optional、boolean、结果对象）就别抛异常；真正「不该发生」的才抛。",
          "在循环里抛异常开销很大（要填充栈信息），高频路径改用条件判断。",
        ],
        code: `// 差：用异常做分支
static int parseBad(String s) {
    try { return Integer.parseInt(s); }
    catch (NumberFormatException e) { return 0; }
}

// 好：先判断
static int parseGood(String s) {
    if (s == null || s.isEmpty()) return 0;
    for (int i = 0; i < s.length(); i++)
        if (!Character.isDigit(s.charAt(i))) return 0;
    return Integer.parseInt(s);
}

// 用 Optional 表达「可能没有」
static java.util.Optional<Integer> find(int[] a, int t) {
    for (int x : a) if (x == t) return java.util.Optional.of(x);
    return java.util.Optional.empty();
}`,
        lang: "Java",
        pts: [
          "`Optional` 强制调用方处理「没有值」的情况",
          "异常构造会抓取栈快照，1 万次循环里抛异常明显变慢",
          "对外 API 用受检异常还是运行时异常，取决于「调用方能否合理恢复」",
        ],
        pit: "为了「代码短」把整个方法体包在 try 里，会让「哪一行出错」变得无法判断。",
      },
    ],
    qa: [
      ["受检异常是 Java 的好设计吗？", "争议很大。它强制处理外部错误，但也导致大量样板 try-catch；现代框架多用运行时异常 + 统一处理。"],
      ["finally 一定执行吗？", "除 JVM 退出（System.exit）、线程被杀、死循环外，基本一定执行。"],
    ],
    sum: "受检异常必须处理、资源用 try-with-resources、finally 不放 return、别用异常做分支。",
  },

  {
    t: "Lambda 与 Stream API",
    sub: "函数式接口 · Stream 流水线 · Optional · 收集器",
    mins: 55,
    kw: "排序",
    goals: [
      "写出 lambda 与方法引用",
      "用 Stream 完成过滤、映射、聚合",
      "区分中间操作与终止操作",
      "知道 Stream 的性能与可读性边界",
    ],
    map: [
      ["操作类型", "例子", "是否立即执行"],
      ["中间操作", "filter/map/sorted", "否，惰性"],
      ["终止操作", "collect/count/forEach", "是，触发执行"],
      ["短路操作", "findFirst/anyMatch", "可提前结束"],
    ],
    mic: [
      {
        t: "函数式接口与 lambda",
        lead: "只有一个抽象方法的接口就是函数式接口，lambda 就是它的简写实现。",
        body: [
          "`Function<T,R>`、`Predicate<T>`、`Consumer<T>`、`Supplier<T>` 是四个最常用的内置接口。",
          "方法引用 `String::length`、`System.out::println` 是 lambda 的进一步简化，可读性更好。",
        ],
        code: `import java.util.function.*;

Function<Integer, Integer> sq = x -> x * x;
Predicate<String> isEmpty = String::isEmpty;
Consumer<String> print = System.out::println;
Supplier<Long> now = System::currentTimeMillis;

System.out.println(sq.apply(5));
System.out.println(isEmpty.test(""));
print.accept("hi");

// 自定义函数式接口
@FunctionalInterface
interface Calc { int apply(int a, int b); }
Calc add = (a, b) -> a + b;
System.out.println(add.apply(1, 2));`,
        lang: "Java",
        pts: [
          "`@FunctionalInterface` 让编译器检查「是否只有一个抽象方法」",
          "lambda 里引用的外部变量必须是 effectively final",
          "方法引用比 lambda 更短，但只在「直接调用」时可用",
        ],
        pit: "在 lambda 里修改外部局部变量会编译错误（不是 effectively final），要改用数组或成员变量。",
      },
      {
        t: "Stream 流水线三要素",
        lead: "Stream 是「数据的流水线」：源 → 若干中间操作 → 一个终止操作。中间操作是惰性的。",
        body: [
          "`list.stream().filter(...).map(...).sorted().collect(...)` 是标准形态。没有终止操作时什么都不会执行。",
          "Stream 只能消费一次，重复用会 IllegalStateException。",
        ],
        code: `import java.util.*;
import java.util.stream.*;

List<Integer> nums = List.of(5, 2, 8, 1);

List<Integer> evens = nums.stream()
    .filter(x -> x % 2 == 0)
    .map(x -> x * 10)
    .sorted()
    .collect(Collectors.toList());
System.out.println(evens);                       // [20, 80]

int sum = nums.stream().mapToInt(Integer::intValue).sum();
long count = nums.stream().filter(x -> x > 2).count();
Optional<Integer> first = nums.stream().filter(x -> x > 100).findFirst();
System.out.println(sum + " " + count + " " + first.orElse(-1));

boolean anyBig = nums.stream().anyMatch(x -> x > 7);
System.out.println(anyBig);`,
        lang: "Java",
        pts: [
          "`mapToInt` 返回 IntStream，有专属的 `sum/average/max`",
          "`findFirst` 返回 Optional，强制处理「可能没有」",
          "`sorted()` 无参要求元素实现 Comparable",
        ],
        pit: "在 `forEach` 里修改外部集合（add）会得到不确定结果甚至异常，Stream 应该「只读源、产出新结果」。",
      },
      {
        t: "Collectors：把流收成各种结构",
        lead: "`Collectors` 决定了流的终点：List、Set、Map、字符串、分组统计。",
        body: [
          "`toList/toSet/joining/groupingBy/partitioningBy/counting/summingInt/averagingInt` 是最常用的一组。",
          "`groupingBy` 可以做二级分组，`partitioningBy` 是按布尔条件分两组（key 一定是 true/false）。",
        ],
        code: `import java.util.*;
import java.util.stream.*;

List<String> words = List.of("apple", "avocado", "banana", "blueberry");

Map<Character, List<String>> byFirst = words.stream()
    .collect(Collectors.groupingBy(w -> w.charAt(0)));
System.out.println(byFirst);

Map<Boolean, List<String>> byLen = words.stream()
    .collect(Collectors.partitioningBy(w -> w.length() > 6));

String joined = words.stream().collect(Collectors.joining(", ", "[", "]"));
System.out.println(joined);

Map<Character, Long> counts = words.stream()
    .collect(Collectors.groupingBy(w -> w.charAt(0), Collectors.counting()));
System.out.println(counts);

IntSummaryStatistics st = words.stream()
    .collect(Collectors.summarizingInt(String::length));
System.out.println(st.getMax() + " " + st.getAverage());`,
        lang: "Java",
        pts: [
          "`toList()`（JDK 16+）返回不可变列表",
          "`groupingBy` 的 value 默认是 List，可再传下游收集器",
          "`IntSummaryStatistics` 一次拿到 count/sum/min/max/avg",
        ],
        pit: "`Collectors.toMap` 遇到重复 key 会抛 IllegalStateException，要传合并函数 `(a,b) -> b`。",
      },
      {
        t: "Optional 与 Stream 的取舍",
        lead: "Optional 表达「可能没有值」，Stream 表达「对集合做批量变换」——两者都不是万能药。",
        body: [
          "Optional 适合返回值；不适合字段、参数、集合元素（会多一层包装且不序列化友好）。",
          "Stream 在简单循环里可能更慢（每步都要创建对象），可读性优先；复杂逻辑用普通循环反而更清楚。",
        ],
        code: `import java.util.*;

static Optional<String> findName(List<String> names, String prefix) {
    return names.stream().filter(n -> n.startsWith(prefix)).findFirst();
}

List<String> names = List.of("amy", "bob");
String r = findName(names, "b")
    .map(String::toUpperCase)
    .orElse("未找到");
System.out.println(r);                       // BOB

findName(names, "z").ifPresentOrElse(
    System.out::println,
    () -> System.out.println("没有")
);

// 简单场景用循环更直观
int total = 0;
for (int x : List.of(1, 2, 3)) total += x;
System.out.println(total);`,
        lang: "Java",
        pts: [
          "`orElse` 会立即求值，`orElseGet` 惰性求值（默认值耗时时用它）",
          "`map` 后仍是 Optional，`flatMap` 用于返回 Optional 的函数",
          "`Optional.get()` 无值时抛 NoSuchElementException，别直接调",
        ],
        pit: "用 `optional.isPresent()` 再 `get()` 等于把 null 检查换了个包装，失去 Optional 的意义。",
      },
    ],
    qa: [
      ["Stream 比 for 循环快吗？", "不一定。简单操作用循环常更快；Stream 的优势是可读性与并行（parallelStream）支持。"],
      ["parallelStream 什么时候用？", "数据量大、操作无状态、不涉及共享可变状态时；小数据或 IO 操作反而更慢。"],
    ],
    sum: "中间操作惰性、终止操作触发、groupingBy 分组统计、Optional 替代 null 返回值。",
  },

  {
    t: "Java 算法竞赛模板",
    sub: "快速 IO · 常用容器 · 大数 · 排序与二分",
    mins: 50,
    kw: "输入输出",
    goals: [
      "用 BufferedReader + StringTokenizer 做快速读入",
      "知道 Java 在竞赛里的优势与劣势",
      "会用 BigInteger 处理超大数",
      "写出可复用的排序与二分模板",
    ],
    map: [
      ["需求", "做法", "备注"],
      ["快速读入", "`BufferedReader`", "比 Scanner 快 3~5 倍"],
      ["快速输出", "`StringBuilder` + `PrintWriter`", "少用 println"],
      ["大整数", "`BigInteger`", "任意精度，慢"],
      ["二分", "手写或 `Arrays.binarySearch`", "注意返回值语义"],
    ],
    mic: [
      {
        t: "快速 IO 骨架",
        lead: "Java 的 Scanner 很慢，1e5 以上输入就该换 BufferedReader——这是 Java 选手第一条军规。",
        body: [
          "`BufferedReader` 读一行，`StringTokenizer` 按空格切分，两者组合是最经典的快读写法。",
          "输出用 `StringBuilder` 累积，最后一次性 `System.out.print`；或用 `PrintWriter`。",
        ],
        code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());

        int[] a = new int[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());

        StringBuilder sb = new StringBuilder();
        for (int x : a) sb.append(x).append('\\n');
        System.out.print(sb);
    }
}`,
        lang: "Java",
        pts: [
          "`StringTokenizer` 比 `split` 快很多",
          "同一行有多个数时复用同一个 tokenizer",
          "输出用 `StringBuilder` 拼，避免多次 println",
        ],
        pit: "Java 的类必须叫 `Main`（多数 OJ 要求），且不能有 package 声明。",
      },
      {
        t: "Java 在竞赛里的取舍",
        lead: "Java 的优点是标准库丰富、没有指针、大数现成；缺点是启动慢、对象开销大、常数高。",
        body: [
          "`new` 出来的对象都在堆上，循环里大量创建会触发 GC 并拖慢。能复用就复用，能用数组就别用 List。",
          "二维数组 `int[n][m]` 比 `List<List<Integer>>` 快得多，内存也省。",
        ],
        code: `// 慢：装箱 + GC
List<Integer> list = new ArrayList<>();
for (int i = 0; i < 1_000_000; i++) list.add(i);

// 快：原始数组
int[] arr = new int[1_000_000];
for (int i = 0; i < arr.length; i++) arr[i] = i;

// 二维
int[][] g = new int[1005][1005];        // 快
// List<List<Integer>> g2 = ...;        // 慢

// 复用数组避免反复分配
int[] tmp = new int[1005];
for (int t = 0; t < T; t++) {
    Arrays.fill(tmp, 0);
    // 使用 tmp
}`,
        lang: "Java",
        pts: [
          "OJ 上 Java 时限通常是 C++ 的 2 倍，仍要控制常数",
          "`ArrayList<Integer>` 每个元素都是对象引用，内存是 int[] 的 4~5 倍",
          "排序对象数组比排序基本类型慢，因为要比较引用",
        ],
        pit: "在循环里 `list.add()` 百万次，既慢又可能 OOM——能预估容量就 `new ArrayList<>(n)`。",
      },
      {
        t: "BigInteger 与 BigDecimal",
        lead: "需要任意精度整数（阶乘、大数幂、组合数）时，BigInteger 是 Java 相对 C++ 的巨大优势。",
        body: [
          "`BigInteger` 支持加减乘除、取模、幂、gcd、进制转换；`BigDecimal` 处理精确小数（金额）。",
          "运算必须用方法（`add/multiply`），不能用运算符；对象不可变，每次运算都返回新对象。",
        ],
        code: `import java.math.BigInteger;

BigInteger a = new BigInteger("123456789012345678901234567890");
BigInteger b = BigInteger.valueOf(1000);

System.out.println(a.add(b));
System.out.println(a.multiply(b));
System.out.println(a.mod(b));
System.out.println(a.pow(2));
System.out.println(a.gcd(b));
System.out.println(b.toString(2));            // 二进制

BigInteger fact = BigInteger.ONE;
for (int i = 2; i <= 50; i++) fact = fact.multiply(BigInteger.valueOf(i));
System.out.println(fact);`,
        lang: "Java",
        pts: [
          "`BigInteger.ONE/ZERO/TEN` 是常用常量",
          "`modPow(e, m)` 就是快速幂取模",
          "`BigDecimal` 必须用字符串构造，否则带误差",
        ],
        pit: "BigInteger 的除法是向零截断，负数取模的符号与数学定义不同，注意修正。",
      },
      {
        t: "排序、二分与常用模板",
        lead: "Java 没有 `lower_bound`，二分要手写或用 `Arrays.binarySearch`（语义不同，注意）。",
        body: [
          "`Arrays.binarySearch` 找不到时返回 `-(插入点)-1`，不是 lower_bound。想找「第一个 ≥ x」得手写。",
          "自定义排序用 `Comparator`，比较整数时用 `Integer.compare` 防溢出。",
        ],
        code: `import java.util.*;

static int lowerBound(int[] a, int x) {      // 第一个 >= x
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = (lo + hi) >>> 1;
        if (a[mid] < x) lo = mid + 1; else hi = mid;
    }
    return lo;
}

int[] a = {1, 3, 3, 5};
System.out.println(lowerBound(a, 3));        // 1
System.out.println(lowerBound(a, 4));        // 3

Integer[] b = {3, 1, 2};
Arrays.sort(b, (x, y) -> Integer.compare(y, x));   // 降序
System.out.println(Arrays.toString(b));

// 二维按第一列排序
int[][] p = {{2, 1}, {1, 3}};
Arrays.sort(p, (x, y) -> Integer.compare(x[0], y[0]));`,
        lang: "Java",
        pts: [
          "`(lo + hi) >>> 1` 避免溢出且比除法快",
          "`Comparator` 返回负数表示 x 排在 y 前",
          "基本类型数组不能传 Comparator，要转包装类",
        ],
        pit: "用 `x[0] - y[0]` 当比较器，差值溢出会让排序结果错乱（大数时必现）。",
      },
    ],
    qa: [
      ["Java 适合打竞赛吗？", "中等难度可以，常数高、启动慢；重数据结构题不如 C++。优势是大数、字符串、库丰富。"],
      ["为什么 OJ 要求类名 Main？", "判题系统按固定类名启动，名字不对就找不到入口。"],
    ],
    sum: "BufferedReader 快读、数组替 List、BigInteger 管大数、二分自己写 lowerBound。",
  },
];
