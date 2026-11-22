// Java 第 1-5 章 · 每章 4 节微课
module.exports = [
  {
    t: "Java 入门与开发环境",
    sub: "JDK/JRE/JVM · 编译运行 · 第一个程序 · 常见错误",
    mins: 40,
    kw: "输入输出",
    goals: [
      "分清 JDK、JRE、JVM 的职责",
      "用 javac + java 手动编译运行程序",
      "写出规范的 main 方法",
      "看懂常见的编译错误与运行时异常",
    ],
    map: [
      ["组件", "包含", "作用"],
      ["JVM", "执行引擎", "运行字节码"],
      ["JRE", "JVM + 类库", "运行 Java 程序"],
      ["JDK", "JRE + 编译器 + 工具", "开发 Java 程序"],
      ["字节码", ".class", "跨平台的中间产物"],
    ],
    mic: [
      {
        t: "JDK、JRE、JVM 三层关系",
        lead: "JVM 提供跨平台，JRE 让你能跑程序，JDK 让你能写程序——开发只需要装 JDK。",
        body: [
          "`.java` 源码被 `javac` 编译成 `.class` 字节码，再由 JVM 解释/即时编译成机器码执行。字节码是跨平台的，JVM 是平台相关的。",
          "所以「一次编写，到处运行」指的是字节码，不是 JVM 本身——每个平台都得装对应的 JVM。",
        ],
        code: `# 检查版本（装 JDK 17 或 21）
java -version
javac -version

# 编译 + 运行
javac Hello.java
java Hello

# 直接运行单文件（JDK 11+）
java Hello.java`,
        lang: "bash",
        table: [
          ["问题", "原因"],
          ["javac 不是内部命令", "只装了 JRE，或 PATH 没配"],
          ["UnsupportedClassVersionError", "用高版本 JDK 编译，低版本 JRE 运行"],
          ["找不到主类", "类名与文件名不一致，或包路径不对"],
        ],
        pts: [
          "类名必须与文件名完全一致（含大小写）",
          "`java Hello` 不带 `.class` 后缀",
          "有 `package` 声明时，要按包结构放目录",
        ],
        pit: "装了多个 JDK 时，`java -version` 与 `javac -version` 可能指向不同版本，导致编译运行不一致。",
      },
      {
        t: "第一个程序与 main 方法",
        lead: "`public static void main(String[] args)` 是 JVM 唯一认的入口签名，一个字符都不能错。",
        body: [
          "`public` 让 JVM 能访问，`static` 让 JVM 不用创建对象就能调用，`void` 表示无返回值，参数是字符串数组（命令行参数）。",
          "类名首字母大写（PascalCase），方法名小驼峰，常量全大写——这是 Java 的命名惯例。",
        ],
        code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, AlgoMaster!");
        System.out.printf("%d + %d = %d%n", 1, 2, 3);
        System.err.println("错误流");

        if (args.length > 0) {
            System.out.println("参数: " + args[0]);
        }
    }
}`,
        lang: "Java",
        pts: [
          "`System.out.println` 输出并换行，`print` 不换行",
          "`printf` 用 `%n` 换行（跨平台），`\\n` 也行",
          "`args` 是从命令行传进来的参数数组",
        ],
        pit: "把 `main` 写成 `Main`、或少了 `static`，编译能过但运行报「找不到主类」或「主方法签名错误」。",
      },
      {
        t: "编译期错误与运行时异常",
        lead: "Java 是强类型静态语言：类型不对连编译都过不了，这比 Python 更早暴露问题。",
        body: [
          "编译错误：缺分号、类型不匹配、方法不存在、未处理的受检异常。运行时异常：空指针、数组越界、除零、类型转换失败。",
          "`NullPointerException` 是 Java 最常见异常——调用任何方法前都要确认对象不是 null。",
        ],
        code: `public class Err {
    public static void main(String[] args) {
        int x = 10;
        // String s = x;              // 编译错误：不兼容类型

        String s = null;
        // System.out.println(s.length());  // NPE

        int[] a = new int[3];
        // System.out.println(a[5]);        // ArrayIndexOutOfBounds

        // int y = 1 / 0;                   // ArithmeticException

        Object o = "text";
        if (o instanceof String str) {      // JDK 16+ 模式匹配
            System.out.println(str.length());
        }
    }
}`,
        lang: "Java",
        pts: [
          "受检异常必须 try-catch 或 throws，否则编译不过",
          "`instanceof` 判断后再强转，避免 ClassCastException",
          "看异常栈从**最上面一行**开始读，那是出错位置",
        ],
        pit: "`Integer` 与 `int` 混用时自动拆箱，`Integer x = null; int y = x;` 会直接 NPE，而不是给 0。",
      },
      {
        t: "开发工具与工程结构",
        lead: "日常开发用 IDEA，竞赛/刷题用纯文本也行——但工程化项目一定要用构建工具。",
        body: [
          "Maven/Gradle 管理依赖与构建；IDEA 内置两者。目录结构固定：`src/main/java` 放源码，`src/test/java` 放测试。",
          "包名用倒置域名（`com.example.app`），与目录结构一一对应。",
        ],
        code: `project/
├── src/
│   ├── main/java/com/example/
│   │   ├── App.java
│   │   └── util/MathUtil.java
│   └── test/java/com/example/
│       └── AppTest.java
├── pom.xml            # Maven
└── build.gradle       # 或 Gradle

# Maven 常用
mvn compile
mvn test
mvn package`,
        lang: "text",
        pts: [
          "`package com.example;` 声明必须与目录匹配",
          "跨包使用类要 `import`，同包不用",
          "构建产物（target/、build/）不要提交到 Git",
        ],
        pit: "包声明与目录不一致时，`javac` 能过但 `java` 找不到类，报错提示与实际原因相距很远。",
      },
    ],
    qa: [
      ["Java 和 C++ 最大的区别？", "Java 没有指针（只有引用）、全自动内存管理（GC）、单继承多接口、强制异常处理、跨平台字节码。"],
      ["为什么 main 必须是 static？", "JVM 启动时还没有任何对象，只能通过类直接调用静态方法作为入口。"],
    ],
    sum: "JDK 装开发、JRE 管运行、JVM 撑跨平台；类名即文件名，main 签名不能错。",
  },

  {
    t: "数据类型与运算",
    sub: "八大基本类型 · 包装类 · String · 自动装箱",
    mins: 50,
    kw: "模拟",
    goals: [
      "记住八种基本类型的位数与范围",
      "理解自动装箱拆箱的开销与陷阱",
      "分清 String 的不可变与字符串常量池",
      "避开整数除法、溢出与浮点比较的坑",
    ],
    map: [
      ["类型", "位数", "范围"],
      ["byte", "8", "-128 ~ 127"],
      ["short", "16", "约 ±3.2 万"],
      ["int", "32", "约 ±21 亿"],
      ["long", "64", "约 ±9.2×10¹⁸"],
      ["double", "64", "15~16 位有效数字"],
    ],
    mic: [
      {
        t: "八种基本类型与默认值",
        lead: "Java 的基本类型位数是**固定的**，不随平台变化——这是它比 C++ 更可预测的地方。",
        body: [
          "byte(8)、short(16)、int(32)、long(64)、float(32)、double(64)、char(16, Unicode)、boolean。",
          "成员变量有默认值（int 为 0、boolean 为 false、引用为 null），**局部变量没有**——不初始化直接用会编译错误。",
        ],
        code: `int a = 100;
long big = 10_000_000_000L;    // 字面量加 L
double d = 3.14;
float f = 3.14F;               // 必须加 F
char c = 'A';
boolean flag = true;
byte b = (byte) 200;           // 溢出：200 → -56

int maxInt = Integer.MAX_VALUE;
System.out.println(maxInt + 1);   // -2147483648，溢出回绕

int x;                         // 局部变量
// System.out.println(x);      // 编译错误：可能未初始化`,
        lang: "Java",
        pts: [
          "`long` 字面量必须加 `L`，否则按 int 解析可能溢出",
          "`float` 必须加 `F`，默认小数是 double",
          "`char` 是 16 位无符号，能存中文（BMP 范围）",
        ],
        pit: "`Integer.MAX_VALUE + 1` 不会抛异常，而是静默回绕成负数——溢出检测要自己写或用 `Math.addExact`。",
      },
      {
        t: "包装类与自动装箱",
        lead: "泛型与集合只能装对象，所以基本类型要「装箱」成包装类，这带来了开销与陷阱。",
        body: [
          "`int` ↔ `Integer` 自动转换（装箱/拆箱）。`Integer` 缓存了 -128~127，这个范围内 `==` 为真，超出则为假。",
          "比较包装类的值必须用 `equals` 或先转基本类型，`==` 比的是引用。",
        ],
        code: `Integer a = 127, b = 127;
System.out.println(a == b);        // true（缓存）

Integer c = 128, d = 128;
System.out.println(c == d);        // false（不同对象）
System.out.println(c.equals(d));   // true

int e = c;                         // 自动拆箱
Integer f = null;
// int g = f;                      // NPE！

System.out.println(Integer.parseInt("42"));
System.out.println(String.valueOf(42));`,
        lang: "Java",
        pts: [
          "`==` 对引用比较地址，对基本类型比较值",
          "`Integer.parseInt` 与 `Integer.valueOf` 前者返回 int 后者返回对象",
          "需要对象身份比较时用 `Objects.equals(a, b)` 更安全",
        ],
        pit: "`Integer x = null; if (x == 0)` 会 NPE（拆箱），而 `x == null` 才是判空。",
      },
      {
        t: "String 与字符串常量池",
        lead: "String 不可变，且字面量会被池化复用——这让 `==` 的表现常常出人意料。",
        body: [
          "`String s = \"abc\"` 会在常量池里找已有的 \"abc\"；`new String(\"abc\")` 一定创建新对象。所以两者 `==` 为 false、`equals` 为 true。",
          "拼接 `a + b` 若不是编译期常量，会在运行时创建新对象，循环里拼接是 O(n²)。",
        ],
        code: `String s1 = "abc";
String s2 = "abc";
String s3 = new String("abc");
System.out.println(s1 == s2);        // true  （池）
System.out.println(s1 == s3);        // false（新对象）
System.out.println(s1.equals(s3));   // true

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 5; i++) sb.append(i).append(',');
System.out.println(sb.toString());

System.out.println("a,b,c".split(",").length);   // 3
System.out.println("abc".substring(1));          // bc`,
        lang: "Java",
        pts: [
          "字符串比较永远用 `equals`，不要用 `==`",
          "循环拼接用 `StringBuilder`（线程安全用 StringBuffer）",
          "`String` 的 `+` 在 JDK 9+ 编译期会转成 StringConcatFactory，比早期快但仍不适合循环",
        ],
        pit: "`sb.append(1).append(2)` 链式调用返回 this 才能用；忘了接收返回值不会报错但结果不对（append 返回的是同一个对象，通常没问题）。",
      },
      {
        t: "运算符与数值细节",
        lead: "Java 的整数除法截断、取模符号、位移与浮点比较，与 C++ 几乎一致，但仍有两个独特之处。",
        body: [
          "`>>>` 是无符号右移（高位补 0），`>>` 是算术右移（保留符号）。`%` 结果符号跟被除数一致。",
          "`0.1 + 0.2 != 0.3` 同样存在；金额计算用 `BigDecimal`（构造要传字符串）。",
        ],
        code: `System.out.println(7 / 2);        // 3
System.out.println(7 / 2.0);      // 3.5
System.out.println(-7 % 3);       // -1
System.out.println(-8 >> 1);      // -4
System.out.println(-8 >>> 1);     // 2147483644

System.out.println(0.1 + 0.2);    // 0.30000000000000004

java.math.BigDecimal a = new java.math.BigDecimal("0.1");
java.math.BigDecimal b = new java.math.BigDecimal("0.2");
System.out.println(a.add(b));     // 0.3

System.out.println(1 << 4);       // 16
System.out.println(16 >>> 2);     // 4`,
        lang: "Java",
        pts: [
          "`new BigDecimal(0.1)` 会把误差带进去，必须用字符串构造",
          "`Math.floorDiv(-7, 2)` 是向下取整（-4），与 `/` 不同",
          "`++i` 与 `i++` 在表达式中取值不同，别写在一行里",
        ],
        pit: "`>>>` 用在负数上会得到巨大正数，位运算解压状态时要清楚自己在处理有符号还是无符号。",
      },
    ],
    qa: [
      ["int 和 Integer 怎么选？", "实体字段、计算用 int（快、无 NPE）；泛型、集合、可能为空用 Integer。"],
      ["String 为什么设计成不可变？", "可安全共享（常量池）、哈希值可缓存（适合做 map 键）、线程安全、避免被意外修改。"],
    ],
    sum: "字面量 long 加 L、float 加 F、包装类比较用 equals、钱用 BigDecimal。",
  },

  {
    t: "控制流与数组",
    sub: "if/switch · 循环 · 数组 · Arrays 工具类",
    mins: 45,
    kw: "排序",
    goals: [
      "用新旧两种 switch 语法",
      "写出正确的数组声明、初始化与遍历",
      "熟练使用 Arrays.sort / toString / fill",
      "理解二维数组其实是「数组的数组」",
    ],
    map: [
      ["操作", "方法", "说明"],
      ["排序", "`Arrays.sort(a)`", "基本类型用双轴快排"],
      ["打印", "`Arrays.toString(a)`", "否则打印出地址"],
      ["填充", "`Arrays.fill(a, v)`", "批量赋初值"],
      ["复制", "`Arrays.copyOf(a, n)`", "返回新数组"],
    ],
    mic: [
      {
        t: "分支与增强 switch",
        lead: "JDK 14+ 的 switch 表达式用箭头语法，不写 break 也不会「坠落」，还能直接返回值。",
        body: [
          "传统 switch 用冒号 + break，忘记 break 会穿透。新语法 `case X -> ...` 自动结束，且 `yield` 可返回值。",
          "`switch` 支持 int、char、String、枚举（JDK 7+ 支持 String）。",
        ],
        code: `int op = 2;
// 新写法（JDK 14+）
String name = switch (op) {
    case 1 -> "加";
    case 2 -> "减";
    default -> "未知";
};
System.out.println(name);

// 传统写法
switch (op) {
    case 1:
        System.out.println("加");
        break;
    default:
        System.out.println("其他");
}

int grade = 85;
String lv = grade >= 90 ? "A" : grade >= 80 ? "B" : "C";`,
        lang: "Java",
        pts: [
          "新 switch 每个分支自动 break，不会穿透",
          "多值合并：`case 1, 2 -> ...`",
          "`switch` 里不能用 `long`、`double`、`boolean`",
        ],
        pit: "传统 switch 忘写 break 会一直执行到下一个 break，这是最经典的 Java 陷阱之一。",
      },
      {
        t: "循环与标签跳转",
        lead: "Java 有带标签的 break/continue，可以直接跳出多层循环，这是它比 C++ 方便的一点。",
        body: [
          "`for`、`while`、`do-while`、增强 for（for-each）四种循环。增强 for 不能修改元素本身（改的是副本），也不能删除元素。",
          "`outer:` 标签配合 `break outer;` 跳出外层循环。",
        ],
        code: `int[] a = {1, 2, 3};
for (int x : a) System.out.print(x + " ");

outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break outer;   // 跳出两层
    }
}

int i = 0;
while (i < 3) i++;
do { i--; } while (i > 0);

// 遍历时删除要倒序或用 Iterator
java.util.List<Integer> list = new java.util.ArrayList<>(java.util.List.of(1,2,3));
for (int k = list.size() - 1; k >= 0; k--) if (list.get(k) == 2) list.remove(k);`,
        lang: "Java",
        pts: [
          "增强 for 无法拿到下标，需要下标就用普通 for",
          "`for (int x : a) { x = 0; }` 不会修改数组元素",
          "标签名后面必须跟冒号",
        ],
        pit: "在增强 for 里 `list.remove(x)` 会抛 ConcurrentModificationException，必须用 Iterator.remove。",
      },
      {
        t: "数组：声明、初始化与二维",
        lead: "Java 数组长度固定，`new int[n]` 自动零初始化——这是它比 C 安全的地方。",
        body: [
          "`int[] a = new int[5]` 全 0；`int[] b = {1,2,3}` 字面量初始化。`.length` 是字段不是方法（String 的是方法）。",
          "二维数组是「数组的数组」，每行长度可以不同：`int[][] g = new int[n][]; g[0] = new int[3];`",
        ],
        code: `int[] a = new int[5];              // 全 0
int[] b = {3, 1, 2};
int[][] g = new int[3][4];         // 3 行 4 列，全 0

int[][] jag = new int[3][];
jag[0] = new int[]{1};
jag[1] = new int[]{1, 2};

System.out.println(a.length);       // 5
System.out.println(g[0].length);    // 4

java.util.Arrays.sort(b);
System.out.println(java.util.Arrays.toString(b));   // [1, 2, 3]
java.util.Arrays.fill(a, 7);

int[] c = java.util.Arrays.copyOf(b, 5);   // 扩容到 5，补 0
System.out.println(java.util.Arrays.equals(b, c));   // false`,
        lang: "Java",
        pts: [
          "`a.length` 是字段，`s.length()` 是方法",
          "`Arrays.toString(a)` 才能打印内容，直接 print 是 `[I@1b6d3586`",
          "二维数组的 `Arrays.deepToString(g)` 打印内容",
        ],
        pit: "数组下标越界抛 `ArrayIndexOutOfBoundsException`，是运行时异常——编译阶段完全不会提醒。",
      },
      {
        t: "Arrays 工具类速查",
        lead: "排序、查找、填充、比较、转字符串，五个静态方法解决九成数组操作。",
        body: [
          "`Arrays.sort` 对基本类型用双轴快排（不稳定），对对象用归并（稳定）。`Arrays.binarySearch` 要求数组已排序。",
          "对象数组排序要传 `Comparator`；`sort(a, 0, k)` 支持只排前 k 个。",
        ],
        code: `import java.util.Arrays;
import java.util.Comparator;

int[] a = {5, 2, 8, 1};
Arrays.sort(a);                          // 1 2 5 8
int idx = Arrays.binarySearch(a, 5);     // 2

Integer[] b = {3, 1, 2};
Arrays.sort(b, Comparator.reverseOrder());   // 降序

int[][] pts = {{1, 2}, {1, 1}, {0, 5}};
Arrays.sort(pts, (p, q) -> p[0] != q[0] ? p[0] - q[0] : p[1] - q[1]);

Arrays.sort(a, 1, 3);                    // 只排 [1,3)
System.out.println(Arrays.toString(a));`,
        lang: "Java",
        pts: [
          "`Arrays.sort` 基本类型不能传 Comparator（需用包装类或 stream）",
          "`binarySearch` 找不到返回负数（`-(插入点)-1`）",
          "比较器返回负数表示「前小于后」",
        ],
        pit: "用 `(p, q) -> p[0] - q[0]` 做比较器，当差值超出 int 范围时会溢出导致排序错乱，改用 `Integer.compare`。",
      },
    ],
    qa: [
      ["增强 for 能修改数组元素吗？", "不能。它遍历的是元素的副本，改副本不影响原数组；要改必须用下标。"],
      ["为什么 `Arrays.sort` 对基本类型不稳定？", "双轴快排追求速度，不保证稳定性；对象数组用 TimSort 才有稳定性。"],
    ],
    sum: "length 是字段、toString 才能看内容、比较器用 Integer.compare 防溢出。",
  },

  {
    t: "面向对象三大特性",
    sub: "封装 · 继承 · 多态 · 接口与抽象类",
    mins: 55,
    kw: "模拟",
    goals: [
      "用 private + getter/setter 实现封装",
      "理解继承的构造顺序与 super 调用",
      "说清多态（运行时绑定）的实现原理",
      "会选接口还是抽象类",
    ],
    map: [
      ["特性", "关键词", "作用"],
      ["封装", "private / public", "隐藏实现细节"],
      ["继承", "extends", "复用父类代码"],
      ["多态", "重写 + 父类引用", "同一调用不同行为"],
      ["抽象", "abstract / interface", "定义契约"],
    ],
    mic: [
      {
        t: "封装：字段私有，行为公开",
        lead: "把字段设成 private，只暴露必要的方法——这样你才能在赋值时做校验，也能随时改内部实现。",
        body: [
          "标准写法：私有字段 + public 构造 + getter/setter。`this.x = x` 解决参数与字段同名的问题。",
          "`static` 成员属于类，`final` 表示不可修改（常量/不可重写/不可继承，视位置而定）。",
        ],
        code: `public class Account {
    private long balance;              // 私有字段
    private static int count = 0;      // 类变量

    public Account(long init) {
        if (init < 0) throw new IllegalArgumentException("初始金额不能为负");
        this.balance = init;
        count++;
    }
    public long getBalance() { return balance; }
    public void deposit(long amt) {
        if (amt <= 0) throw new IllegalArgumentException("金额必须为正");
        balance += amt;
    }
    public static int getCount() { return count; }
}`,
        lang: "Java",
        pts: [
          "getter/setter 里做校验，是封装的核心价值",
          "`final` 字段必须在构造完成前赋值",
          "字段私有 + 方法是修改状态的唯一入口",
        ],
        pit: "给每个字段机械生成 getter/setter 而没有任何校验，等于没做封装，只是多写了代码。",
      },
      {
        t: "继承、super 与构造顺序",
        lead: "子类会先构造父类那部分，再构造自己——所以 `super()` 必须是构造方法的第一行。",
        body: [
          "Java 是单继承：一个类只能 extends 一个类，但可以 implements 多个接口。所有类默认继承 Object。",
          "重写（override）要求方法签名相同、访问权限不能更严；重载（overload）是参数列表不同。",
        ],
        code: `class Animal {
    protected String name;
    Animal(String name) { this.name = name; System.out.println("Animal"); }
    void speak() { System.out.println("..."); }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);                   // 必须第一行
        System.out.println("Dog");
    }
    @Override
    void speak() { System.out.println(name + ": Woof"); }
}

Animal a = new Dog("d");    // 先 Animal 后 Dog
a.speak();                  // Woof（多态）`,
        lang: "Java",
        pts: [
          "`@Override` 让编译器检查是否真的重写了",
          "父类无参构造不存在时，子类必须显式 `super(...)`",
          "`protected` 允许子类与同包访问",
        ],
        pit: "在父类构造方法里调用被子类重写的方法，会用到子类还没初始化的字段，得到 null/0。",
      },
      {
        t: "多态：一个接口多种实现",
        lead: "父类引用指向子类对象，调用重写方法时执行子类版本——这是运行期决定的。",
        body: [
          "多态让调用方只依赖抽象：`List<String> list = new ArrayList<>()`，以后换成 LinkedList 不影响其他代码。",
          "`instanceof` 判断实际类型；JDK 16+ 支持 `if (o instanceof Dog d)` 直接绑定变量。",
        ],
        code: `abstract class Shape {
    abstract double area();
    public String toString() { return getClass().getSimpleName() + ":" + area(); }
}
class Circle extends Shape {
    double r; Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }
}
class Rect extends Shape {
    double w, h; Rect(double w, double h) { this.w = w; this.h = h; }
    double area() { return w * h; }
}

Shape[] shapes = { new Circle(1), new Rect(2, 3) };
for (Shape s : shapes) System.out.println(s);

java.util.List<String> list = new java.util.ArrayList<>();`,
        lang: "Java",
        pts: [
          "多态只看「实际对象类型」决定调用哪个重写方法",
          "静态方法、私有方法、final 方法不参与多态",
          "面向接口编程能显著降低耦合",
        ],
        pit: "字段不参与多态：`父类引用.字段` 取的是父类声明的字段，即使实际是子类对象。",
      },
      {
        t: "接口 vs 抽象类",
        lead: "接口定义「能做什么」，抽象类定义「是什么」+ 部分实现。",
        body: [
          "接口可以多实现，方法默认 public abstract；JDK 8+ 支持 `default` 方法与 `static` 方法。抽象类单继承，可有构造方法与字段。",
          "选择原则：需要共享状态或部分实现用抽象类；只需要契约、要多继承用接口。",
        ],
        code: `interface Swimmer { void swim(); }
interface Flyer {
    void fly();
    default void rest() { System.out.println("休息"); }   // 默认实现
}

abstract class Animal2 {
    protected String name;
    Animal2(String n) { name = n; }
    abstract void speak();
    void eat() { System.out.println(name + " 吃东西"); }
}

class Duck extends Animal2 implements Swimmer, Flyer {
    Duck(String n) { super(n); }
    void speak() { System.out.println("嘎"); }
    public void swim() { System.out.println("游泳"); }
    public void fly() { System.out.println("飞"); }
}

Duck d = new Duck("d");
d.speak(); d.swim(); d.fly(); d.rest();`,
        lang: "Java",
        pts: [
          "接口方法默认 `public abstract`，字段默认 `public static final`",
          "`default` 方法可在接口里给默认实现（JDK 8+）",
          "一个类只能 extends 一个类，但可 implements 多个接口",
        ],
        pit: "两个接口有同名 default 方法时，实现类必须显式重写，否则编译报错。",
      },
    ],
    qa: [
      ["重载和重写的区别？", "重载是同类中方法名相同参数不同（编译期决定）；重写是子类覆盖父类同签名方法（运行期决定）。"],
      ["为什么建议面向接口编程？", "调用方只依赖契约，实现可替换（ArrayList/LinkedList、MySQL/内存库），测试也更容易 mock。"],
    ],
    sum: "封装守校验、继承先父后子、多态看实际类型、接口管契约抽象类管部分实现。",
  },

  {
    t: "集合框架（一）",
    sub: "List · ArrayList · LinkedList · 遍历与删除",
    mins: 50,
    kw: "模拟",
    goals: [
      "按读写模式选择 ArrayList 或 LinkedList",
      "理解 ArrayList 的扩容与随机访问优势",
      "写出安全的三种遍历方式",
      "避开遍历中删除的并发修改异常",
    ],
    map: [
      ["实现", "底层", "随机访问", "头部插入"],
      ["ArrayList", "动态数组", "O(1)", "O(n)"],
      ["LinkedList", "双向链表", "O(n)", "O(1)"],
      ["Vector", "动态数组（同步）", "O(1)", "O(n)"],
      ["CopyOnWriteArrayList", "写时复制", "O(1)", "O(n)"],
    ],
    mic: [
      {
        t: "ArrayList：默认就用它",
        lead: "ArrayList 就是会自动扩容的数组，随机访问 O(1)，尾部追加均摊 O(1)——九成场景都够用。",
        body: [
          "默认容量 10，满了按 1.5 倍扩容并整体拷贝。知道要装多少时用 `new ArrayList<>(n)` 预留，能省掉所有扩容。",
          "`get/set` 是 O(1)，`add(index, x)` 和 `remove(index)` 是 O(n)（要搬移后面的元素）。",
        ],
        code: `import java.util.ArrayList;
import java.util.List;

List<Integer> list = new ArrayList<>(100);   // 预留容量
list.add(1);
list.add(0, 9);             // 头部插入 O(n)
System.out.println(list.get(0));
list.set(0, 8);
list.remove(Integer.valueOf(8));   // 按值删
list.remove(0);                    // 按下标删

System.out.println(list.size() + " " + list.contains(1));
System.out.println(list.indexOf(1));

List<Integer> nums = List.of(3, 1, 2);   // 不可变
List<Integer> copy = new ArrayList<>(nums);  // 可变副本`,
        lang: "Java",
        pts: [
          "`remove(int)` 是删下标，`remove(Object)` 是删值——传 Integer 时极易搞错",
          "`List.of()` 返回不可变列表，`add` 会 UnsupportedOperationException",
          "`subList` 返回的是视图，改它会影响原列表",
        ],
        pit: "`list.remove(1)` 想删值 1 却删了下标 1。要删值必须 `remove(Integer.valueOf(1))`。",
      },
      {
        t: "LinkedList 与 Deque",
        lead: "LinkedList 是双向链表，头部插入 O(1)，但随机访问是 O(n)，实际很少用它当 List。",
        body: [
          "它同时实现了 `Deque`，所以适合当队列/栈用：`offerFirst`、`pollLast`、`push`、`pop`。",
          "理论上链表插删快，但每次都要创建节点、缓存不友好，实测大多数场景比 ArrayList 慢。",
        ],
        code: `import java.util.LinkedList;
import java.util.Deque;

Deque<Integer> dq = new LinkedList<>();
dq.offerFirst(1);
dq.offerLast(2);
System.out.println(dq.peekFirst() + " " + dq.peekLast());
dq.pollFirst();

dq.push(3);      // 当栈用
dq.pop();

// 队列
java.util.Queue<Integer> q = new java.util.ArrayDeque<>();
q.offer(1); q.poll(); q.peek();`,
        lang: "Java",
        pts: [
          "队列优先用 `ArrayDeque`（比 LinkedList 快）",
          "`offer/poll/peek` 失败返回特殊值，`add/remove/element` 失败抛异常",
          "LinkedList 的 `get(i)` 会从头或尾遍历，循环里 `get(i)` 是 O(n²)",
        ],
        pit: "用 LinkedList 写 `for (int i = 0; i < list.size(); i++) list.get(i)` 是 O(n²)，改用迭代器或增强 for。",
      },
      {
        t: "三种遍历与安全删除",
        lead: "遍历中修改集合是 Java 最经典的坑，`ConcurrentModificationException` 就是它。",
        body: [
          "增强 for 底层是迭代器，集合结构被修改（add/remove）会触发 fail-fast 检查。要删除必须用 `Iterator.remove()`，或用 `removeIf`。",
          "`removeIf` 是最简洁的现代写法：`list.removeIf(x -> x < 0)`。",
        ],
        code: `import java.util.*;

List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4));

// ① 增强 for + 删除 → 异常
// for (int x : list) if (x == 2) list.remove(Integer.valueOf(x));

// ② Iterator 删除 → 正确
Iterator<Integer> it = list.iterator();
while (it.hasNext()) if (it.next() == 2) it.remove();

// ③ removeIf → 最简洁
list.removeIf(x -> x > 3);

// ④ 倒序下标删除
for (int i = list.size() - 1; i >= 0; i--) if (list.get(i) < 0) list.remove(i);

list.forEach(x -> System.out.print(x + " "));`,
        lang: "Java",
        pts: [
          "`Iterator.remove()` 是唯一安全的遍历中删除方式",
          "`removeIf` 内部也做了正确处理，优先用它",
          "并发场景用 `CopyOnWriteArrayList` 或 `ConcurrentHashMap`",
        ],
        pit: "在增强 for 里 `list.remove(x)` 有时不抛异常却删错元素——单元素列表会「侥幸」通过，换成多元素就崩。",
      },
      {
        t: "List 的排序与转换",
        lead: "`Collections.sort` / `list.sort` / `Comparator` 三者的组合，是 Java 排序的全部。",
        body: [
          "`list.sort(Comparator.comparingInt(...))` 是最推荐的写法，链式调用可拼多关键字：`.thenComparing(...)`。",
          "数组与 List 互转：`Arrays.asList(a)` 返回固定长度列表（不能 add），`list.toArray(new T[0])` 转数组。",
        ],
        code: `import java.util.*;
import java.util.stream.*;

List<String> names = new ArrayList<>(List.of("Bob", "alice", "Cid"));
names.sort(String::compareToIgnoreCase);
names.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
names.sort(Comparator.comparing(String::length).reversed());

Integer[] arr = {3, 1, 2};
List<Integer> fromArr = Arrays.asList(arr);          // 固定长度
List<Integer> copy = new ArrayList<>(fromArr);       // 可变

int[] nums = {5, 2, 9};
List<Integer> boxed = Arrays.stream(nums).boxed().collect(Collectors.toList());
int[] back = boxed.stream().mapToInt(Integer::intValue).toArray();

Collections.reverse(names);
Collections.shuffle(names);`,
        lang: "Java",
        pts: [
          "`Arrays.asList` 返回的列表不能 `add/remove`",
          "`Comparator.comparing(...).thenComparing(...)` 表达多关键字最清晰",
          "基本类型数组转 List 必须 `boxed()`",
        ],
        pit: "`Comparator.comparing(String::length).reversed()` 只反转长度比较，`thenComparing` 要放在 reversed 之前才符合直觉。",
      },
    ],
    qa: [
      ["ArrayList 和 LinkedList 怎么选？", "默认 ArrayList。只有「频繁在头部/中间插入删除且不随机访问」时才考虑 LinkedList，队列场景用 ArrayDeque。"],
      ["ArrayList 扩容多少？", "JDK 中按 `oldCapacity + (oldCapacity >> 1)` 即 1.5 倍扩，用 `ensureCapacity` 可一次性预留。"],
    ],
    sum: "默认 ArrayList、队列用 ArrayDeque、删除用 removeIf 或 Iterator.remove。",
  },
];
