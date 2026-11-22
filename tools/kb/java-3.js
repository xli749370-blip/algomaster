// Java 第 11-15 章 · 每章 4 节微课
module.exports = [
  {
    t: "多线程与并发入门",
    sub: "Thread · synchronized · 线程池 · 并发容器",
    mins: 55,
    kw: "复杂度",
    goals: [
      "创建线程的三种方式",
      "理解 synchronized 与锁的作用范围",
      "用线程池管理任务而不是手动 new Thread",
      "知道常用并发容器的适用场景",
    ],
    map: [
      ["机制", "作用", "注意"],
      ["synchronized", "互斥 + 可见性", "锁对象要选对"],
      ["volatile", "可见性 + 禁止重排", "不保证原子性"],
      ["线程池", "复用线程、限流", "参数要配"],
      ["ConcurrentHashMap", "线程安全 Map", "分段/CAS 优化"],
    ],
    mic: [
      {
        t: "三种创建线程的方式",
        lead: "继承 Thread 最直观但耦合高；实现 Runnable / Callable 更灵活，生产代码一律用线程池。",
        body: [
          "`Runnable.run()` 无返回值，`Callable.call()` 可返回结果并抛异常，配合 `Future` 取值。",
          "`start()` 才真正开新线程，直接调 `run()` 只是普通方法调用（还在当前线程）。",
        ],
        code: `public class T {
    public static void main(String[] args) throws Exception {
        // ① Runnable
        Thread t1 = new Thread(() -> System.out.println("runnable"));
        t1.start();

        // ② Thread 子类
        new Thread() {
            public void run() { System.out.println("thread"); }
        }.start();

        // ③ Callable + Future
        var pool = java.util.concurrent.Executors.newSingleThreadExecutor();
        var future = pool.submit(() -> 1 + 2);
        System.out.println(future.get());     // 3
        pool.shutdown();
    }
}`,
        lang: "Java",
        pts: [
          "`start()` 后线程进入就绪态，由调度器决定何时执行",
          "`join()` 等待线程结束，`sleep()` 让出 CPU 但不释放锁",
          "`interrupt()` 是协作式中断，线程要自己检查标志",
        ],
        pit: "直接调 `run()` 不会创建新线程，所有代码仍在主线程里串行执行——看起来「并发了」其实是假象。",
      },
      {
        t: "synchronized 与锁的对象",
        lead: "synchronized 锁的是「对象」，不是代码块——不同对象上的同步互不影响。",
        body: [
          "修饰实例方法 = 锁 this；修饰静态方法 = 锁 Class 对象；`synchronized(obj)` = 锁指定对象。",
          "`volatile` 保证可见性与禁止指令重排，但 `count++` 依然不是原子操作。",
        ],
        code: `class Counter {
    private int n = 0;
    private final Object lock = new Object();

    public synchronized void inc() { n++; }          // 锁 this

    public void inc2() {
        synchronized (lock) { n++; }                 // 锁指定对象
    }

    public static synchronized void stat() { }       // 锁 Class

    public int get() { synchronized (lock) { return n; } }
}

// volatile 只保证可见性
class Flag { volatile boolean stop = false; }`,
        lang: "Java",
        pts: [
          "锁的粒度越小并发越高，但别在锁里做 IO",
          "`synchronized` 可重入（同一线程可重复获取）",
          "`volatile` 适合「一个线程写、多个线程读」的标志位",
        ],
        pit: "锁不同对象（`synchronized(this)` 在多个实例上）不会互斥，这是「加了锁还是错」的常见原因。",
      },
      {
        t: "线程池：别手动 new Thread",
        lead: "线程创建销毁成本高，线程池复用线程并限制并发数——生产环境的标准做法是自定义 ThreadPoolExecutor。",
        body: [
          "七个参数：核心数、最大数、空闲存活时间、时间单位、任务队列、线程工厂、拒绝策略。",
          "`Executors.newFixedThreadPool` 用的是无界队列，任务堆积可能 OOM；高负载场景应显式指定有界队列。",
        ],
        code: `import java.util.concurrent.*;

ThreadPoolExecutor pool = new ThreadPoolExecutor(
    4,                                  // corePoolSize
    8,                                  // maximumPoolSize
    60L, TimeUnit.SECONDS,              // keepAlive
    new ArrayBlockingQueue<>(1000),     // 有界队列
    Executors.defaultThreadFactory(),
    new ThreadPoolExecutor.CallerRunsPolicy()   // 满了由调用方执行
);

for (int i = 0; i < 10; i++) {
    int id = i;
    pool.submit(() -> System.out.println("task " + id));
}
pool.shutdown();`,
        lang: "Java",
        pts: [
          "任务提交顺序：核心线程 → 队列 → 扩到最大线程 → 拒绝策略",
          "`shutdown()` 不再接新任务，等已提交的跑完",
          "线程数经验值：CPU 密集 ≈ 核数，IO 密集可到核数 × 2~4",
        ],
        pit: "`Executors.newCachedThreadPool` 的最大线程数是 Integer.MAX_VALUE，任务突发时会创建海量线程直接压垮机器。",
      },
      {
        t: "并发容器与原子类",
        lead: "`ConcurrentHashMap`、`CopyOnWriteArrayList`、`AtomicInteger` 是并发场景下替代同步包装的标准工具。",
        body: [
          "`Collections.synchronizedMap` 是全局锁，吞吐低；`ConcurrentHashMap` 用 CAS + 桶级锁，并发度高得多。",
          "`AtomicInteger.incrementAndGet()` 基于 CAS，无锁且原子。",
        ],
        code: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.merge("a", 1, Integer::sum);
map.computeIfAbsent("b", k -> 0);

CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("x");                        // 写时复制，读多写少才用

AtomicInteger cnt = new AtomicInteger();
cnt.incrementAndGet();
cnt.compareAndSet(1, 10);             // CAS

BlockingQueue<Integer> q = new LinkedBlockingQueue<>(10);
q.put(1);            // 满了阻塞
q.take();            // 空了阻塞`,
        lang: "Java",
        pts: [
          "`ConcurrentHashMap` 不允许 null 键值",
          "`CopyOnWriteArrayList` 写操作要复制整个数组，写多会极慢",
          "阻塞队列是「生产者-消费者」的标准实现",
        ],
        pit: "`ConcurrentHashMap` 的复合操作（先 get 再 put）仍非原子，要用 `compute` / `merge` 原子方法。",
      },
    ],
    qa: [
      ["synchronized 和 Lock 的区别？", "synchronized 是关键字、自动释放、不可中断；Lock 可超时、可中断、可公平锁，但必须手动 unlock。"],
      ["volatile 能替代锁吗？", "不能。它只保证可见性和有序性，涉及「读-改-写」的复合操作仍需锁或原子类。"],
    ],
    sum: "线程用池、锁对象要对、复合操作用原子方法、并发容器替 synchronized 包装。",
  },

  {
    t: "Java 学习路线与面试地图",
    sub: "知识体系 · 高频考点 · 项目建议 · 学习顺序",
    mins: 40,
    kw: "复杂度",
    goals: [
      "画出 Java 后端知识体系的全景",
      "知道面试高频考点集中在哪几块",
      "规划从语法到框架的学习顺序",
      "避免「学了很多但串不起来」",
    ],
    map: [
      ["阶段", "内容", "产出"],
      ["基础", "语法、OOP、集合、异常、IO", "能写小工具"],
      ["进阶", "泛型、并发、JVM、反射", "能读懂框架源码"],
      ["工程", "Maven、Git、单测、日志", "能协作开发"],
      ["框架", "Spring Boot、MyBatis、Redis", "能交付服务"],
    ],
    mic: [
      {
        t: "知识体系全景",
        lead: "Java 后端 = 语言基础 + JVM + 并发 + 框架 + 数据库 + 中间件，缺一块都会在面试里露馅。",
        body: [
          "语言层：集合源码、泛型擦除、异常体系、IO/NIO。运行时层：类加载、内存模型、GC。工程层：构建、测试、日志、监控。",
          "框架层的核心是「Spring 怎么管理对象、怎么处理请求」；中间件是「缓存、消息、搜索」各自解决什么问题。",
        ],
        code: `语言基础
├── 语法 / OOP / 泛型 / 异常
├── 集合：List/Map/Set 源码与复杂度
└── IO：BIO / NIO / Netty 概览
运行时
├── 类加载：双亲委派
├── 内存：堆/栈/元空间
└── GC：分代、收集器、调优
并发
├── 线程 / 锁 / volatile
├── 线程池 / 并发容器
└── JMM：可见性、有序性、原子性
框架与中间件
├── Spring / Spring Boot / MyBatis
├── MySQL 索引与事务
└── Redis / MQ / 分布式基础`,
        lang: "text",
        pts: [
          "先把「集合 + 并发 + JVM」三块吃透，面试通过率提升最明显",
          "框架会用只是起点，能说清「它替你做了什么」才是加分项",
          "每个知识点都要能答出「为什么这样设计」",
        ],
        pit: "只背八股不动手写代码，一问到「你项目里怎么用的」就答不上来，简历会显得很虚。",
      },
      {
        t: "高频面试考点排序",
        lead: "面试题有明确的重心：集合、并发、JVM、MySQL、Redis 五块占了大半。",
        body: [
          "集合：HashMap 结构、扩容、为什么 2 的幂、ConcurrentHashMap 实现。并发：线程池参数、锁升级、volatile、AQS。",
          "JVM：内存分区、GC 算法与收集器、类加载、OOM 排查。MySQL：索引结构、最左前缀、事务隔离、锁。Redis：数据结构、持久化、缓存三兄弟问题。",
        ],
        code: `高频（必答）
1. HashMap 底层与扩容
2. 线程池七个参数与拒绝策略
3. synchronized 与 volatile 区别
4. JVM 内存分区 + GC 流程
5. MySQL 索引与最左前缀
6. Redis 缓存穿透/击穿/雪崩
中频
7. AQS 与 ReentrantLock
8. 类加载与双亲委派
9. Spring IOC/AOP 原理
10. 分布式锁的实现与坑`,
        lang: "text",
        pts: [
          "回答结构：是什么 → 为什么这么设计 → 有什么坑 → 你怎么解决的",
          "能画出图（HashMap 结构、JVM 分区）比背文字更有说服力",
          "项目里踩过的坑比标准答案更能体现深度",
        ],
        pit: "把「八股」背成结论而没有推演过程，追问两层就答不上来。",
      },
      {
        t: "学习顺序与时间分配",
        lead: "先能写出能跑的东西，再回头深挖原理——反过来会陷入「学不动」的泥潭。",
        body: [
          "第一轮：语法 + OOP + 集合，能写命令行小工具。第二轮：并发 + IO + 数据库，能写带存储的服务。第三轮：Spring Boot + 项目，能交付。",
          "原理（JVM、GC、AQS）放在「用过之后」再学，理解成本会低很多。",
        ],
        code: `第 1 个月：语法、OOP、集合、异常、IO
第 2 个月：并发基础、JDBC、MySQL 基础
第 3 个月：Spring Boot、REST API、MyBatis
第 4 个月：做一个完整项目（登录、分页、缓存）
持续：JVM、GC、AQS、分布式（面试前集中攻）

每天节奏建议：
30min 读文档/源码 → 90min 写代码 → 30min 复盘笔记`,
        lang: "text",
        pts: [
          "每个阶段都要有「可展示的产出」，不要只停留在看视频",
          "项目宁可小而完整，也不要做一半的「电商系统」",
          "写博客/笔记能强制你把理解说清楚",
        ],
        pit: "收藏了几十个教程却一个都没跑完，是学 Java 最常见的失败模式。",
      },
      {
        t: "项目怎么选才不虚",
        lead: "面试官不关心项目多大，只关心「你解决了什么问题、做了什么决策」。",
        body: [
          "好的项目特征：有真实痛点、有技术取舍、有可量化结果（响应时间、并发量、错误率）。",
          "避免「教程复刻」：至少在一个点上做自己的改造（换存储、加缓存、优化慢查询、补监控）。",
        ],
        code: `项目描述模板（简历用）
· 背景：为解决 XX 场景下的 XX 问题
· 我的角色：负责 XX 模块（技术栈：Spring Boot + MySQL + Redis）
· 关键决策：为什么用 Redis 而不用本地缓存（多实例一致性）
· 难点与方案：慢查询 → 加联合索引 + 分页游标，P99 从 800ms 降到 60ms
· 结果：支撑 500 QPS，错误率 0.1%

可讲的深挖点
1. 一次线上问题的完整排查过程
2. 一个你推翻自己方案的决策
3. 一处你引入的 bug 与修复`,
        lang: "text",
        pts: [
          "准备 3 个能讲 5 分钟的技术故事",
          "数据要真实可解释，别编造「百万并发」",
          "能说清「如果重做一次会怎么改」体现反思能力",
        ],
        pit: "项目里用了十个中间件却说不清各自解决什么问题，反而扣分。",
      },
    ],
    qa: [
      ["非科班怎么补基础？", "重点补「操作系统 + 网络 + 数据结构」，这三门决定你能否理解 Java 的底层设计。"],
      ["要不要学 JVM 调优？", "先会「看懂 GC 日志、定位 OOM」，调优参数在实际问题中再学，死记参数没意义。"],
    ],
    sum: "先把集合/并发/JVM 吃透，每阶段有产出，项目要能讲清决策与数据。",
  },

  {
    t: "IO 与 NIO 基础",
    sub: "字节流字符流 · 缓冲 · Files · 快速读入",
    mins: 45,
    kw: "输入输出",
    goals: [
      "分清字节流与字符流的使用场景",
      "会用 BufferedReader/BufferedWriter 提升性能",
      "掌握 Files 工具类的常用方法",
      "理解 NIO 的 Channel 与 Buffer 模型",
    ],
    map: [
      ["类型", "代表类", "场景"],
      ["字节流", "InputStream/OutputStream", "二进制、图片"],
      ["字符流", "Reader/Writer", "文本，需指定编码"],
      ["缓冲流", "BufferedReader/Writer", "减少系统调用"],
      ["NIO", "Channel/Buffer/Selector", "高并发网络"],
    ],
    mic: [
      {
        t: "字节流与字符流",
        lead: "字节流处理原始数据，字符流处理文本——用错会出现乱码或损坏文件。",
        body: [
          "`FileInputStream/FileOutputStream` 按字节读写；`FileReader/FileWriter` 按字符（默认平台编码，容易乱码）。",
          "指定编码要用 `InputStreamReader(is, StandardCharsets.UTF_8)`，这是跨平台可移植的写法。",
        ],
        code: `import java.io.*;
import java.nio.charset.StandardCharsets;

// 字节流：复制二进制
try (InputStream in = new FileInputStream("a.png");
     OutputStream out = new FileOutputStream("b.png")) {
    byte[] buf = new byte[8192];
    int n;
    while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
}

// 字符流 + 指定编码
try (BufferedReader br = new BufferedReader(
        new InputStreamReader(new FileInputStream("a.txt"), StandardCharsets.UTF_8))) {
    String line;
    while ((line = br.readLine()) != null) System.out.println(line);
}`,
        lang: "Java",
        pts: [
          "文本读写永远显式指定 `StandardCharsets.UTF_8`",
          "`read()` 返回 -1 表示结束",
          "`read(buf)` 返回实际读到的字节数，不一定是 buf 长度",
        ],
        pit: "用 `FileWriter` 不指定编码，在 Windows 下会写成 GBK，Linux 上读就乱码。",
      },
      {
        t: "缓冲流与性能",
        lead: "每次 `read()` 都是一次系统调用，缓冲流把小块读写攒成大块，性能差几十倍。",
        body: [
          "`BufferedReader`/`BufferedWriter` 默认 8KB 缓冲；`PrintWriter` 带格式化输出。",
          "输出记得 `flush()` 或关闭（try-with-resources 会自动 flush + close）。",
        ],
        code: `import java.io.*;

// 写
try (BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"))) {
    for (int i = 0; i < 5; i++) {
        bw.write("line " + i);
        bw.newLine();
    }
}

// 快速读整数（竞赛常用）
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());

// 一次性读全部（小文件）
String all = new String(Files.readAllBytes(Path.of("out.txt")), StandardCharsets.UTF_8);`,
        lang: "Java",
        pts: [
          "缓冲流包装在节点流外层：`new BufferedReader(new FileReader(...))`",
          "`bw.newLine()` 跨平台换行",
          "`PrintWriter` 的 `println` 可设自动 flush",
        ],
        pit: "只 `write` 不 `flush` 也不 `close`，数据可能还在缓冲区里没落盘，文件是空的。",
      },
      {
        t: "Files 工具类：现代写法",
        lead: "JDK 7 的 `java.nio.file.Files` 把常见文件操作变成一行，比老 IO 简洁得多。",
        body: [
          "`Files.readAllLines` / `readString`（JDK 11+）/ `writeString` / `copy` / `move` / `deleteIfExists` / `walk`。",
          "`Path.of(\"a\", \"b.txt\")` 是跨平台路径拼接，比字符串拼 `/` 安全。",
        ],
        code: `import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

Path p = Path.of("data", "out.txt");
Files.createDirectories(p.getParent());

Files.writeString(p, "hello\\nworld\\n", StandardCharsets.UTF_8);
List<String> lines = Files.readAllLines(p, StandardCharsets.UTF_8);
System.out.println(lines);

Files.copy(p, Path.of("data", "copy.txt"), StandardCopyOption.REPLACE_EXISTING);
try (var stream = Files.lines(p)) {
    stream.filter(l -> l.startsWith("he")).forEach(System.out::println);
}
System.out.println(Files.exists(p) + " " + Files.size(p));`,
        lang: "Java",
        pts: [
          "`Files.readString` 是 JDK 11+，老版本用 `new String(Files.readAllBytes(...))`",
          "`Files.lines` 返回 Stream，必须关闭（用 try-with-resources）",
          "`walk` 可递归遍历目录",
        ],
        pit: "`Files.readAllLines` 会把整个文件读进内存，大文件要改用 `Files.lines` 或 BufferedReader 逐行读。",
      },
      {
        t: "NIO 三件套：Channel、Buffer、Selector",
        lead: "NIO 用「缓冲区 + 通道 + 多路复用」实现一个线程管理大量连接，是 Netty 的基础。",
        body: [
          "Channel 双向可读可写，数据必须先读进 Buffer 再处理。Selector 让你用单线程监听多个 Channel 的事件（可读/可写/连接）。",
          "日常业务开发很少直接写 NIO，但理解它能解释「为什么 Netty 快」。",
        ],
        code: `import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;

try (FileChannel ch = FileChannel.open(Path.of("a.txt"), StandardOpenOption.READ)) {
    ByteBuffer buf = ByteBuffer.allocate(1024);
    while (ch.read(buf) != -1) {
        buf.flip();                        // 切换到读模式
        while (buf.hasRemaining()) System.out.print((char) buf.get());
        buf.clear();                       // 清空，准备下次写
    }
}

// 内存映射文件（大文件高效读）
try (FileChannel ch = FileChannel.open(Path.of("big.bin"), StandardOpenOption.READ)) {
    MappedByteBuffer mb = ch.map(FileChannel.MapMode.READ_ONLY, 0, ch.size());
}`,
        lang: "Java",
        pts: [
          "`flip()` 写转读，`clear()` 清空，`rewind()` 重读",
          "`allocateDirect` 分配堆外内存，减少一次拷贝但分配慢",
          "Netty 封装了 NIO 的复杂度，业务代码一般用它",
        ],
        pit: "忘了 `flip()` 就读，position 在末尾，一个字节也读不到——这是 NIO 最经典的错误。",
      },
    ],
    qa: [
      ["BIO、NIO、AIO 的区别？", "BIO 阻塞、一连接一线程；NIO 非阻塞 + 多路复用；AIO 异步回调（Linux 支持不完善，少用）。"],
      ["为什么 NIO 快？", "不是「IO 本身快」，而是用少量线程处理大量连接，减少了线程切换与内存占用。"],
    ],
    sum: "文本指定 UTF-8、缓冲流提速、Files 一行搞定、NIO 记住 flip。",
  },

  {
    t: "反射与注解",
    sub: "Class 对象 · 反射调用 · 自定义注解 · 注解处理",
    mins: 45,
    kw: "复杂度",
    goals: [
      "通过反射获取类信息并调用方法",
      "理解反射的性能代价与使用边界",
      "定义并读取自定义注解",
      "知道 Spring 是怎么用这两者的",
    ],
    map: [
      ["能力", "API", "用途"],
      ["获取 Class", "`obj.getClass()` / `X.class`", "入口"],
      ["创建实例", "`getDeclaredConstructor().newInstance()`", "解耦"],
      ["调用方法", "`getMethod().invoke()`", "动态派发"],
      ["读注解", "`getAnnotation()`", "框架配置"],
    ],
    mic: [
      {
        t: "拿到 Class 对象的三种方式",
        lead: "Class 对象是反射的入口，它代表「运行时的类型信息」。",
        body: [
          "`obj.getClass()`、`类名.class`、`Class.forName(\"全限定名\")`。第三种支持运行时按字符串加载，是框架解耦的关键。",
          "拿到 Class 后可以查字段、方法、构造器、注解，也能创建实例。",
        ],
        code: `class User {
    private String name;
    public User() {}
    public User(String n) { name = n; }
    public String hello() { return "hi " + name; }
}

Class<?> c1 = User.class;
Class<?> c2 = new User().getClass();
Class<?> c3 = Class.forName("User");     // 需全限定名
System.out.println(c1 == c2 && c2 == c3);   // true

for (var m : c1.getDeclaredMethods()) System.out.println(m.getName());
for (var f : c1.getDeclaredFields()) System.out.println(f.getName());`,
        lang: "Java",
        pts: [
          "同一个类在 JVM 里只有一个 Class 对象",
          "`getMethods()` 含继承的 public 方法，`getDeclaredMethods()` 只本类",
          "`Class.forName` 会触发类初始化（执行 static 块）",
        ],
        pit: "`Class.forName` 用的是全限定名（含包名），漏了包名就 ClassNotFoundException。",
      },
      {
        t: "反射创建对象与调用方法",
        lead: "反射让「编译期不知道具体类」的代码也能工作，这是所有框架的基础。",
        body: [
          "`getDeclaredConstructor(...)` 拿构造器，`newInstance()` 创建对象。私有成员要 `setAccessible(true)`。",
          "反射调用比直接调用慢几十倍（要做访问检查），高频路径要缓存 Method 对象或改用 MethodHandle。",
        ],
        code: `import java.lang.reflect.*;

Class<?> cls = Class.forName("User");
Object u = cls.getDeclaredConstructor(String.class).newInstance("Amy");

Method m = cls.getMethod("hello");
System.out.println(m.invoke(u));           // hi Amy

Field f = cls.getDeclaredField("name");
f.setAccessible(true);
System.out.println(f.get(u));              // Amy
f.set(u, "Bob");

// 缓存 Method 减少查找开销
Method cached = cls.getMethod("hello");
for (int i = 0; i < 1000; i++) cached.invoke(u);`,
        lang: "Java",
        pts: [
          "`invoke` 的第一个参数是实例，静态方法传 null",
          "`setAccessible(true)` 在模块化（JDK 9+）下可能被拒绝",
          "`getMethod` 只找 public，私有方法用 `getDeclaredMethod`",
        ],
        pit: "反射调用抛的是 `InvocationTargetException`，真实异常在 `getCause()` 里，直接看 message 会一头雾水。",
      },
      {
        t: "自定义注解与读取",
        lead: "注解本身只是「标记」，真正干活的是读取注解的代码——这就是「注解 + 反射」的组合。",
        body: [
          "`@Retention(RUNTIME)` 决定注解能否在运行时读到，`@Target` 限制能标在哪里。",
          "框架（Spring、JUnit）就是扫描注解 → 反射处理 → 执行逻辑。自己写个小框架同理。",
        ],
        code: `import java.lang.annotation.*;
import java.lang.reflect.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface Route { String value(); }

class Handler {
    @Route("/hello")
    public String hello() { return "hello"; }
    @Route("/bye")
    public String bye() { return "bye"; }
}

for (Method m : Handler.class.getDeclaredMethods()) {
    Route r = m.getAnnotation(Route.class);
    if (r != null) System.out.println(r.value() + " -> " + m.getName());
}
// /hello -> hello
// /bye -> bye`,
        lang: "Java",
        pts: [
          "`RetentionPolicy.SOURCE` 编译后丢弃（如 @Override）",
          "`@Target` 可指定多个：`{METHOD, FIELD}`",
          "注解属性只能是基本类型、String、Class、枚举、注解或其数组",
        ],
        pit: "忘了写 `@Retention(RUNTIME)`，运行时 `getAnnotation` 返回 null，代码看起来完全正确但没有效果。",
      },
      {
        t: "反射的代价与边界",
        lead: "反射强大但破坏封装、绕过编译期检查、还有性能开销——能用静态方式解决就别用反射。",
        body: [
          "反射无法被编译器优化，也无法在编译期发现拼写错误；重构时字符串里的类名不会被自动改。",
          "现代替代：`MethodHandle`（更快）、`invokedynamic`、或编译期代码生成（注解处理器）。",
        ],
        code: `// 危险：字符串写错只有运行时才知道
// Class.forName("Uesr")   // 拼错，运行时才报

// 更安全：用类字面量
Class<?> safe = User.class;

// 性能对比（大致量级）
// 直接调用：1x
// 反射 invoke：10~50x
// MethodHandle：2~5x

import java.lang.invoke.*;
MethodHandles.Lookup lk = MethodHandles.lookup();
MethodHandle mh = lk.findVirtual(User.class, "hello", MethodType.methodType(String.class));
System.out.println((String) mh.invoke(new User("A")));`,
        lang: "Java",
        pts: [
          "反射遍历所有方法在启动时做一次可以，别放在请求路径上",
          "JDK 17 强封装后，`setAccessible` 对 JDK 内部类会失败",
          "GraalVM 原生镜像对反射需要额外配置",
        ],
        pit: "用反射修改 final 字段在 JDK 12+ 会被拒绝或行为未定义，别依赖这种技巧。",
      },
    ],
    qa: [
      ["Spring 的 IOC 用了反射吗？", "用了：扫描注解 → 反射创建 Bean → 反射注入依赖。AOP 则用动态代理（JDK Proxy 或 CGLIB）。"],
      ["反射会影响 JIT 优化吗？", "会。反射调用点难以内联，这也是 MethodHandle/LambdaMetafactory 被引入的原因。"],
    ],
    sum: "Class 是入口、setAccessible 开私有、注解要 RUNTIME 才读得到、反射别放热路径。",
  },

  {
    t: "集合源码视角",
    sub: "ArrayList 扩容 · HashMap 细节 · 负载因子 · 线程安全",
    mins: 50,
    kw: "哈希表",
    goals: [
      "说清 ArrayList 的扩容与拷贝成本",
      "讲明白 HashMap 的 put 全过程",
      "解释负载因子 0.75 的取舍",
      "知道各集合的线程安全方案",
    ],
    map: [
      ["问题", "答案", "影响"],
      ["ArrayList 扩容", "1.5 倍 + 数组拷贝", "频繁扩容变慢"],
      ["HashMap 定位", "`(n-1) & hash`", "容量必须 2 的幂"],
      ["树化条件", "链长 ≥ 8 且容量 ≥ 64", "最坏 O(log n)"],
      ["线程安全", "ConcurrentHashMap", "CAS + 桶锁"],
    ],
    mic: [
      {
        t: "ArrayList 的扩容与拷贝",
        lead: "ArrayList 的所有「方便」都建立在数组拷贝上：扩容要拷、中间插入要挪。",
        body: [
          "默认容量 10（第一次 add 时才分配），满了按 `old + (old >> 1)` 扩到 1.5 倍，用 `Arrays.copyOf` 整体拷贝。",
          "`ensureCapacity(n)` 可一次性预留，避免多次扩容；`trimToSize()` 把容量缩到实际大小。",
        ],
        code: `import java.util.ArrayList;

ArrayList<Integer> list = new ArrayList<>();     // 延迟分配
list.add(1);                                     // 此时才分配 10

ArrayList<Integer> big = new ArrayList<>(10000); // 直接预留
big.ensureCapacity(20000);

// 扩容代价示意：n 次 add 的总拷贝约 3n 次元素移动
// 均摊 O(1)，但单次可能 O(n)

list.trimToSize();                               // 缩容（极少用）`,
        lang: "Java",
        pts: [
          "`new ArrayList<>(n)` 只设容量，`size()` 仍是 0",
          "中间 `add(i, x)` 要移动 i 之后的所有元素",
          "`subList` 是视图，`clear()` 它会清掉原列表对应区间",
        ],
        pit: "`ArrayList(int)` 与 `ArrayList(Collection)` 是不同构造器，传集合时不会把它当容量。",
      },
      {
        t: "HashMap 的 put 全过程",
        lead: "put 的关键三步：算 hash → 定位桶 → 插入或覆盖，冲突就挂链、链长就树化。",
        body: [
          "① `hash(key)` 高低位异或扰动；② `(n-1) & hash` 定位；③ 桶空就放，否则比较 hash 与 equals，相同则覆盖，不同则挂到链表尾部。",
          "④ 链表长度 ≥ 8 且容量 ≥ 64 转红黑树；⑤ 元素数 > 容量 × 0.75 就扩容两倍并迁移。",
        ],
        code: `// 关键代码逻辑（简化）
// int h = key.hashCode();
// h ^= (h >>> 16);                 // 扰动，让高位参与定位
// int idx = (n - 1) & h;           // 定位桶
// if (桶空) 放入
// else if (hash 相同 && (key == k || key.equals(k))) 覆盖
// else 挂链 / 树化
// if (++size > threshold) resize();

Map<Integer, String> m = new HashMap<>(16);
for (int i = 0; i < 20; i++) m.put(i, "v" + i);   // 触发扩容

// 为什么容量是 2 的幂：
// n = 16 时 (n-1) = 15 = 0b1111，与 hash 按位与等价于取模，且分布均匀`,
        lang: "Java",
        pts: [
          "key 为 null 时固定放在 0 号桶",
          "扩容时元素要么留在原位，要么移到「原位 + 旧容量」",
          "`hashCode` 重复但 `equals` 不同 → 同桶不同元素",
        ],
        pit: "重写 `equals` 不重写 `hashCode`，两个「相等」的键会被放进不同桶，导致 `get` 拿不到值。",
      },
      {
        t: "负载因子 0.75 的取舍",
        lead: "0.75 是「空间」与「冲突概率」的折中，不是随便定的。",
        body: [
          "太小（如 0.5）：冲突少但浪费一半空间，扩容更频繁；太大（如 1.0）：空间省但冲突增多，链表变长。",
          "0.75 时哈希冲突概率在可接受范围，同时空间利用率较高，是数学与工程的平衡点。",
        ],
        code: `// 空间与时间的三档
Map<String, Integer> tight  = new HashMap<>(16, 0.5f);   // 快但费内存
Map<String, Integer> normal = new HashMap<>(16, 0.75f);  // 默认
Map<String, Integer> dense  = new HashMap<>(16, 0.9f);   // 省内存但冲突多

// 已知元素数时正确预分配
int n = 100000;
int cap = (int) Math.ceil(n / 0.75);
Map<String, Integer> pre = new HashMap<>(cap);`,
        lang: "Java",
        pts: [
          "预分配时用 `n / 0.75` 再 +1，避免最后一次扩容",
          "元素数量稳定的场景可以调大负载因子省内存",
          "`HashMap` 的容量会向上取到 2 的幂",
        ],
        pit: "`new HashMap<>(100000)` 实际容量会被调整到 131072（2 的幂），别以为就是 10 万。",
      },
      {
        t: "线程安全的四种选择",
        lead: "从「全局锁」到「无锁」有四档方案，选错会带来性能问题或并发 bug。",
        body: [
          "`Hashtable`（全局锁，已淘汰）→ `Collections.synchronizedMap`（全局锁，简单）→ `ConcurrentHashMap`（桶级锁 + CAS，推荐）→ 不可变 Map（只读场景）。",
          "`CopyOnWriteArrayList` 适合「读多写极少」，写时复制整个数组。",
        ],
        code: `import java.util.*;
import java.util.concurrent.*;

// ① 淘汰
Hashtable<String, Integer> h = new Hashtable<>();

// ② 简单包装
Map<String, Integer> sync = Collections.synchronizedMap(new HashMap<>());

// ③ 推荐
ConcurrentHashMap<String, Integer> chm = new ConcurrentHashMap<>();
chm.put("a", 1);
chm.merge("a", 1, Integer::sum);
chm.compute("a", (k, v) -> v == null ? 1 : v + 1);

// ④ 只读
Map<String, Integer> ro = Map.of("a", 1);`,
        lang: "Java",
        pts: [
          "`ConcurrentHashMap` 的 `size()` 是估算值，不保证精确",
          "复合操作要用 `merge`/`compute`，别 get 后再 put",
          "只读多写并发用 `Collections.unmodifiableMap` 包装快照",
        ],
        pit: "`Collections.synchronizedMap` 的迭代仍需手动 `synchronized(map)`，否则可能 ConcurrentModificationException。",
      },
    ],
    qa: [
      ["为什么 JDK 8 把头插改成尾插？", "头插在并发扩容时可能形成环形链表导致死循环；尾插避免了这个问题，也让顺序更稳定。"],
      ["ConcurrentHashMap 为什么不允许 null？", "并发下无法区分「没有这个键」与「值就是 null」，会造成歧义。"],
    ],
    sum: "扩容 1.5 倍、定位用位与、树化看 8 和 64、并发一律 ConcurrentHashMap。",
  },
];
