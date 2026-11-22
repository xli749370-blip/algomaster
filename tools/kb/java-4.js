// Java 第 16-20 章 · 每章 4 节微课
module.exports = [
  {
    t: "JVM 内存模型与 GC 入门",
    sub: "内存分区 · 对象生命周期 · GC 算法 · 排查 OOM",
    mins: 55,
    kw: "复杂度",
    goals: [
      "说清 JVM 的五块内存区域",
      "理解对象从创建到回收的流程",
      "知道分代收集与常见收集器",
      "会用日志与工具排查 OOM",
    ],
    map: [
      ["区域", "存什么", "是否共享"],
      ["堆", "对象实例", "线程共享"],
      ["虚拟机栈", "栈帧、局部变量", "线程私有"],
      ["方法区/元空间", "类元信息、常量", "共享"],
      ["程序计数器", "当前字节码行号", "私有"],
    ],
    mic: [
      {
        t: "五块内存区域",
        lead: "堆放对象、栈放局部变量、方法区放类信息——记住这三句就能答对大半。",
        body: [
          "**堆**是 GC 的主战场，所有 `new` 出来的对象都在这里；**虚拟机栈**每个线程一份，存方法的局部变量与栈帧。",
          "**方法区**（JDK 8 后由元空间实现，在本地内存）存类结构、常量池；**程序计数器**记录当前执行到哪条字节码。",
        ],
        code: `public class Mem {
    static int s = 1;                 // 方法区（类变量）

    public static void main(String[] args) {
        int a = 2;                    // 虚拟机栈（局部变量）
        int[] arr = new int[3];       // 引用在栈，数组对象在堆
        String str = "abc";           // "abc" 在字符串常量池
        Object o = new Object();      // 对象在堆
    }
}`,
        lang: "Java",
        table: [
          ["现象", "可能原因"],
          ["OutOfMemoryError: Java heap space", "堆内存不足，对象无法回收"],
          ["StackOverflowError", "递归太深或栈帧过大"],
          ["OutOfMemoryError: Metaspace", "类太多（动态生成类）"],
          ["GC overhead limit exceeded", "GC 时间长但回收很少"],
        ],
        pts: [
          "栈溢出是 `StackOverflowError`，堆溢出是 `OutOfMemoryError`",
          "字符串常量池在 JDK 7 后移到了堆里",
          "元空间用本地内存，不再受 `-XX:MaxPermSize` 限制",
        ],
        pit: "把「堆」和「栈」混着说（「对象在栈上」）是面试最常见的失分点——对象实例永远在堆。",
      },
      {
        t: "对象的一生：创建、晋升、回收",
        lead: "对象先在新生代 Eden 出生，熬过几轮 Minor GC 就晋升老年代，最后被 Full GC 清理。",
        body: [
          "新生代分 Eden + 两个 Survivor（默认 8:1:1）。Minor GC 把存活对象复制到 Survivor，年龄 +1，达到阈值（默认 15）晋升老年代。",
          "大对象直接进老年代，避免在 Survivor 之间反复复制。",
        ],
        code: `// 相关参数（了解即可）
// -Xms512m -Xmx512m          堆初始/最大
// -Xmn256m                   新生代大小
// -XX:SurvivorRatio=8        Eden : Survivor = 8:1
// -XX:MaxTenuringThreshold=15 晋升年龄
// -XX:+PrintGCDetails        打印 GC 日志

// 触发 GC 的常见场景
// 1. Eden 满 → Minor GC
// 2. 老年代满 → Full GC（会 STW，尽量少发生）
// 3. System.gc() → 建议 Full GC（不保证执行）`,
        lang: "text",
        pts: [
          "Minor GC 快（毫秒级），Full GC 慢（可能秒级）且会暂停应用",
          "Survivor 的作用是「筛掉短命对象」，避免它们进老年代",
          "`-Xms` 与 `-Xmx` 设成一样可避免堆反复扩缩",
        ],
        pit: "频繁创建大对象会让老年代迅速填满，触发频繁 Full GC，表现为「服务周期性卡顿」。",
      },
      {
        t: "GC 算法与常见收集器",
        lead: "三种基础算法：标记清除（碎片）、复制（费空间）、标记整理（移动成本高），收集器是它们的工程组合。",
        body: [
          "**Serial** 单线程、**Parallel** 多线程吞吐优先、**CMS** 低延迟（已废弃）、**G1** 分 Region 可预测停顿（JDK 9+ 默认）、**ZGC** 亚毫秒停顿。",
          "选型：普通服务用 G1；对延迟极敏感（如交易）考虑 ZGC。",
        ],
        code: `// G1（JDK 9+ 默认）
// -XX:+UseG1GC -XX:MaxGCPauseMillis=200

// ZGC（JDK 15+ 生产可用）
// -XX:+UseZGC

// 并行收集器（吞吐优先，批处理场景）
// -XX:+UseParallelGC

// 查看当前使用的收集器
// java -XX:+PrintFlagsFinal -version | grep UseG1GC`,
        lang: "text",
        table: [
          ["收集器", "特点", "适用"],
          ["Serial", "单线程，简单", "小内存客户端"],
          ["Parallel", "多线程，吞吐高", "批处理"],
          ["G1", "分区，可预测停顿", "通用服务（默认）"],
          ["ZGC", "极低停顿", "大堆低延迟"],
        ],
        pts: [
          "「吞吐量」与「停顿时间」通常是矛盾的，要按业务选",
          "G1 把堆分成 Region，优先回收「垃圾最多」的区域",
          "STW（Stop The World）是 GC 时暂停所有应用线程",
        ],
        pit: "为了「低延迟」把堆设得极大又用 Parallel，会导致单次 Full GC 停顿数秒——参数要配合收集器选。",
      },
      {
        t: "OOM 排查的实用套路",
        lead: "先拿到现场（堆转储 + GC 日志），再定位「谁占了内存」，最后才是改代码。",
        body: [
          "启动加 `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp`，OOM 时自动 dump。用 MAT / VisualVM 分析支配树，找到最大的对象与持有链。",
          "GC 日志用 `-Xlog:gc*`（JDK 9+），看「回收后仍占用多少」，判断是泄漏还是单纯不够用。",
        ],
        code: `# 启动参数
java -Xms1g -Xmx1g \\
     -XX:+HeapDumpOnOutOfMemoryError \\
     -XX:HeapDumpPath=/tmp/heap.hprof \\
     -Xlog:gc*:file=/tmp/gc.log \\
     -jar app.jar

# 运行时查看（需 JDK 工具）
jps -l
jstat -gc <pid> 1000
jmap -histo:live <pid> | head -20
jstack <pid> > /tmp/thread.txt

# 常见结论
# 1. 某个 Map 无限增长 → 缓存没设上限
# 2. 大量 byte[] → 大文件/图片未释放
# 3. 线程数暴涨 → 线程池配置错误`,
        lang: "bash",
        pts: [
          "`jstat -gc` 看 Eden/Old 的占用与 GC 次数最直观",
          "`jmap -histo` 快速看「哪类对象最多」",
          "`jstack` 查线程死锁与卡死位置",
        ],
        pit: "dump 文件可能和堆一样大，生产环境要先确认磁盘空间，别把机器写满。",
      },
    ],
    qa: [
      ["堆和栈的区别？", "堆线程共享、放对象、由 GC 管理；栈线程私有、放局部变量与调用帧、随方法结束自动释放。"],
      ["什么情况会 Full GC？", "老年代满、元空间满、显式 System.gc()、晋升失败、大对象分配失败等。"],
    ],
    sum: "堆放对象栈放变量、新生代熬年龄晋升、G1 是默认、OOM 先 dump 再分析。",
  },

  {
    t: "设计模式实战",
    sub: "单例 · 工厂 · 策略 · 观察者 · 何时不用",
    mins: 50,
    kw: "模拟",
    goals: [
      "写出线程安全的单例",
      "用工厂与策略消除 if-else 堆叠",
      "用观察者实现事件解耦",
      "知道什么时候不该用设计模式",
    ],
    map: [
      ["模式", "解决的问题", "Java 中的例子"],
      ["单例", "全局唯一实例", "Runtime、Spring Bean"],
      ["工厂", "创建逻辑集中", "Calendar.getInstance"],
      ["策略", "算法可替换", "Comparator"],
      ["观察者", "一对多通知", "事件监听"],
    ],
    mic: [
      {
        t: "单例：四种写法",
        lead: "单例要保证「全局唯一」且「线程安全」，最简单可靠的写法是枚举。",
        body: [
          "饿汉式（类加载即创建，简单）、懒汉式 + 双重检查（延迟加载，需 volatile）、静态内部类（延迟 + 线程安全）、枚举（防反射与反序列化破坏）。",
          "双重检查里 `instance` 必须 `volatile`，否则可能拿到「构造未完成」的对象。",
        ],
        code: `// ① 枚举（最推荐）
enum Config {
    INSTANCE;
    public String get(String k) { return System.getProperty(k); }
}

// ② 静态内部类（延迟 + 安全）
class Holder {
    private Holder() {}
    private static class H { static final Holder I = new Holder(); }
    public static Holder get() { return H.I; }
}

// ③ 双重检查
class DCL {
    private static volatile DCL instance;
    private DCL() {}
    public static DCL get() {
        if (instance == null) {
            synchronized (DCL.class) {
                if (instance == null) instance = new DCL();
            }
        }
        return instance;
    }
}`,
        lang: "Java",
        pts: [
          "枚举单例天然防反射攻击与反序列化重建",
          "静态内部类在首次调用 `get()` 时才加载",
          "`volatile` 防止指令重排导致的半初始化对象",
        ],
        pit: "双重检查漏了 `volatile`，高并发下可能拿到 `instance != null` 但字段还没赋值的对象。",
      },
      {
        t: "工厂与建造者",
        lead: "当「创建对象」的逻辑变复杂（多参数、多类型、需要校验），就把它从业务代码里搬出去。",
        body: [
          "简单工厂用一个方法按类型返回不同实现；工厂方法让子类决定创建什么；建造者（Builder）解决「参数太多」的问题。",
          "Spring 的 BeanFactory 就是工厂的极致形态。",
        ],
        code: `interface Notifier { void send(String msg); }
class Sms implements Notifier { public void send(String m) {} }
class Mail implements Notifier { public void send(String m) {} }

class NotifierFactory {
    static Notifier create(String type) {
        return switch (type) {
            case "sms" -> new Sms();
            case "mail" -> new Mail();
            default -> throw new IllegalArgumentException(type);
        };
    }
}

// 建造者
class Req {
    private final String url; private final int timeout; private final boolean retry;
    private Req(Builder b) { url = b.url; timeout = b.timeout; retry = b.retry; }
    static class Builder {
        private String url; private int timeout = 1000; private boolean retry = true;
        Builder url(String u) { url = u; return this; }
        Builder timeout(int t) { timeout = t; return this; }
        Builder retry(boolean r) { retry = r; return this; }
        Req build() { return new Req(this); }
    }
}
Req r = new Req.Builder().url("/api").timeout(3000).build();`,
        lang: "Java",
        pts: [
          "工厂把「new 哪个类」的决策集中到一处",
          "建造者让多参数构造变得可读且不易传错",
          "工厂 + 配置（Map<String, Supplier>）比 switch 更易扩展",
        ],
        pit: "参数只有 2~3 个还硬上 Builder，是过度设计，直接构造器更清楚。",
      },
      {
        t: "策略与观察者",
        lead: "策略消除「按类型分支」，观察者把「通知」与「业务」解耦。",
        body: [
          "策略：把每个分支抽成一个实现类，用 Map 注册，新增逻辑不用改原有代码（开闭原则）。",
          "观察者：事件发生时遍历监听器列表通知，发布者不需要知道订阅者是谁。",
        ],
        code: `import java.util.*;
import java.util.function.Function;

// 策略
class PriceCalc {
    private final Map<String, Function<Double, Double>> rules = new HashMap<>();
    PriceCalc() {
        rules.put("vip", p -> p * 0.8);
        rules.put("new", p -> p - 10);
        rules.put("none", p -> p);
    }
    double calc(String type, double price) {
        return rules.getOrDefault(type, rules.get("none")).apply(price);
    }
}

// 观察者
class EventBus {
    private final List<java.util.function.Consumer<String>> subs = new ArrayList<>();
    void on(java.util.function.Consumer<String> c) { subs.add(c); }
    void emit(String e) { subs.forEach(c -> c.accept(e)); }
}

EventBus bus = new EventBus();
bus.on(e -> System.out.println("A 收到 " + e));
bus.on(e -> System.out.println("B 收到 " + e));
bus.emit("order-created");`,
        lang: "Java",
        pts: [
          "策略的 key 可以用枚举，避免字符串拼错",
          "观察者要注意「通知时被注册/注销」导致的并发修改",
          "Spring 的 `ApplicationEvent` 就是内置的事件总线",
        ],
        pit: "监听器里抛异常会中断后续通知，重要场景要每个 listener 单独 try-catch。",
      },
      {
        t: "什么时候不该用模式",
        lead: "设计模式的目的是「让变化可控」，如果没有变化，加模式只是增加阅读成本。",
        body: [
          "判断标准：这段代码真的要变吗？变化点在哪？如果没有明确的变化点，就别抽接口。",
          "两个实现的「策略」不如一个 if 清楚；三个字段的「建造者」不如直接构造。",
        ],
        code: `// 过度设计：只有一个实现还抽接口
interface UserRepo { User find(int id); }
class UserRepoImpl implements UserRepo { public User find(int id) { return null; } }

// 适度：先用具体类，等真需要替换时再抽
class UserRepo2 { User find(int id) { return null; } }

// 合理：确实有两个以上的实现，且调用方需要替换
interface Sender { void send(String m); }
class SmsSender implements Sender { public void send(String m) {} }
class MailSender implements Sender { public void send(String m) {} }`,
        lang: "Java",
        pts: [
          "「未来可能会变」不是理由，等真的要变再重构",
          "模式是沟通词汇，团队不认识时先写清楚注释",
          "Spring 已经替你实现了很多模式，别重复造轮子",
        ],
        pit: "为了「符合设计模式」硬套，会让三层调用变成六层，排查问题时找不到真正的逻辑在哪。",
      },
    ],
    qa: [
      ["最常用的三个模式是哪几个？", "策略（消除分支）、工厂（集中创建）、单例（全局配置/连接池），加上 Builder 基本够用。"],
      ["设计模式会被语言特性取代吗？", "部分会。比如 lambda 让策略更轻，record 让值对象更简单，但模式背后的思想仍然成立。"],
    ],
    sum: "单例用枚举、工厂集中创建、策略替分支、没有变化点就别抽接口。",
  },

  {
    t: "测试与构建工具",
    sub: "JUnit 5 · 断言 · Mockito · Maven/Gradle",
    mins: 45,
    kw: "复杂度",
    goals: [
      "为方法写出有意义的单测",
      "用参数化测试覆盖边界",
      "用 Mockito 隔离外部依赖",
      "会用 Maven 完成构建与打包",
    ],
    map: [
      ["工具", "作用", "关键注解"],
      ["JUnit 5", "单测框架", "`@Test` `@BeforeEach`"],
      ["AssertJ", "流式断言", "`assertThat`"],
      ["Mockito", "模拟依赖", "`@Mock` `when`"],
      ["Maven", "构建依赖管理", "`pom.xml`"],
    ],
    mic: [
      {
        t: "JUnit 5 基础",
        lead: "单测的价值不在「跑通」，而在「改动之后还能立刻知道有没有破坏原行为」。",
        body: [
          "`@Test` 标记测试方法，`@BeforeEach`/`@AfterEach` 做前置清理，`@DisplayName` 给人类看的名字。",
          "断言用 `assertEquals`、`assertTrue`、`assertThrows`；一个测试只验证一个行为。",
        ],
        code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalcTest {
    Calc calc;

    @BeforeEach
    void setUp() { calc = new Calc(); }

    @Test
    @DisplayName("两数相加")
    void add() {
        assertEquals(3, calc.add(1, 2));
    }

    @Test
    void divideByZero() {
        assertThrows(ArithmeticException.class, () -> calc.div(1, 0));
    }

    @AfterEach
    void tearDown() { calc = null; }
}`,
        lang: "Java",
        pts: [
          "测试方法不能有参数、不能是 private",
          "`assertThrows` 返回异常对象，可继续断言 message",
          "测试名与方法名要说明「测什么场景」",
        ],
        pit: "一个测试里断言十几个东西，失败时不知道是哪一条挂了——拆成多个测试更好。",
      },
      {
        t: "参数化测试与边界",
        lead: "边界值（0、负数、最大值、空集合）是最容易出 bug 的地方，参数化测试一次覆盖多个。",
        body: [
          "`@ParameterizedTest` + `@ValueSource` / `@CsvSource` / `@MethodSource` 批量喂数据。",
          "每个 bug 修复后都补一条对应用例，形成回归保护。",
        ],
        code: `import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import static org.junit.jupiter.api.Assertions.*;

class ParseTest {
    @ParameterizedTest
    @ValueSource(strings = {"1", "42", "999"})
    void valid(String s) {
        assertEquals(Integer.parseInt(s), new Parser().parse(s));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "abc", "1.5"})
    void invalid(String s) {
        assertThrows(NumberFormatException.class, () -> new Parser().parse(s));
    }

    @ParameterizedTest
    @CsvSource({"1,2,3", "0,0,0", "-1,1,0"})
    void add(int a, int b, int expect) {
        assertEquals(expect, new Calc().add(a, b));
    }
}`,
        lang: "Java",
        pts: [
          "`@MethodSource` 可返回复杂对象流，适合大数据集",
          "边界值优先于随机值：0、1、-1、MAX、空",
          "参数化测试失败时会打印「哪一组参数」失败",
        ],
        pit: "只测「正常路径」不测异常路径，等于只测了一半——异常分支往往才是最容易出错的。",
      },
      {
        t: "Mockito：隔离外部依赖",
        lead: "单测不该连数据库、发 HTTP——用 mock 替身把外部世界挡在外面。",
        body: [
          "`@Mock` 创建替身，`when(...).thenReturn(...)` 定义行为，`verify(...)` 校验调用次数。",
          "`ArgumentCaptor` 可以捕获传入参数做断言。",
        ],
        code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepo repo;              // 替身
    @InjectMocks UserService svc;     // 自动注入

    @Test
    void findById() {
        when(repo.find(1)).thenReturn(new User("Amy"));
        assertEquals("Amy", svc.findById(1).name());
        verify(repo, times(1)).find(1);
    }

    @Test
    void notFound() {
        when(repo.find(9)).thenReturn(null);
        assertNull(svc.findById(9));
    }
}`,
        lang: "Java",
        pts: [
          "mock 只该用于「外部依赖」，业务逻辑不要 mock",
          "`verify` 过度使用会让测试与实现耦合",
          "对静态方法 mock 需要 mockito-inline",
        ],
        pit: "把所有协作者都 mock 掉，测试就变成「验证自己写的调用顺序」，反而更脆弱。",
      },
      {
        t: "Maven 与 Gradle",
        lead: "Maven 用约定优于配置（目录结构固定）；Gradle 用脚本更灵活、增量构建更快。",
        body: [
          "`pom.xml` 声明依赖与插件，`mvn clean package` 产出 jar。Gradle 用 `build.gradle`，`gradle build`。",
          "依赖冲突用 `mvn dependency:tree` 看，`<exclusions>` 排除传递依赖。",
        ],
        code: `<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>demo</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>`,
        lang: "xml",
        pts: [
          "`scope=test` 的依赖不会打进最终产物",
          "`mvn -DskipTests package` 跳过测试打包",
          "多模块项目用 `<modules>` 聚合构建",
        ],
        pit: "两个依赖引入同一个库的不同版本时，Maven 按「路径最短优先」选，可能选到旧版本导致运行时报 NoSuchMethodError。",
      },
    ],
    qa: [
      ["单测要覆盖多少？", "核心业务与边界分支尽量全覆盖；工具类与 getter 不必强求。覆盖率是参考不是目标。"],
      ["先写测试还是先写代码？", "TDD 适合逻辑清晰的小模块；多数场景是「先写代码，补测试」，但 bug 修复必须先补测试。"],
    ],
    sum: "一测一行为、边界优先、外部依赖用 mock、Maven 三行起步。",
  },

  {
    t: "JDBC 与数据库访问",
    sub: "连接 · PreparedStatement · 事务 · 连接池",
    mins: 50,
    kw: "SQL",
    goals: [
      "用 JDBC 完成增删改查",
      "理解 PreparedStatement 为什么能防注入",
      "正确使用事务与回滚",
      "知道为什么必须用连接池",
    ],
    map: [
      ["组件", "作用", "注意"],
      ["Driver", "连接数据库", "JDBC 4 自动加载"],
      ["Connection", "一个会话", "用完必须还池"],
      ["PreparedStatement", "预编译 SQL", "用 ? 占位"],
      ["ResultSet", "结果集", "按列名取值"],
    ],
    mic: [
      {
        t: "最小可用的 JDBC 流程",
        lead: "加载驱动 → 获取连接 → 准备语句 → 执行 → 处理结果 → 关闭，六步一个都不能少。",
        body: [
          "JDBC 4 之后驱动会自动注册，只需要 `DriverManager.getConnection(url, user, pwd)`。",
          "所有资源用 try-with-resources，顺序是「先开后关、后开先关」。",
        ],
        code: `import java.sql.*;

String url = "jdbc:mysql://localhost:3306/demo?serverTimezone=UTC";
try (Connection conn = DriverManager.getConnection(url, "root", "pwd");
     PreparedStatement ps = conn.prepareStatement(
         "SELECT id, name FROM user WHERE age > ?")) {
    ps.setInt(1, 18);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("id") + " " + rs.getString("name"));
        }
    }
} catch (SQLException e) {
    e.printStackTrace();
}`,
        lang: "Java",
        pts: [
          "`executeQuery` 用于 SELECT，`executeUpdate` 用于增删改（返回影响行数）",
          "列下标从 1 开始，用列名更安全",
          "`setInt/setString/setDate` 按类型设置参数",
        ],
        pit: "`rs.getString(0)` 会抛异常——JDBC 的列下标从 1 开始，与数组习惯不同。",
      },
      {
        t: "PreparedStatement 与 SQL 注入",
        lead: "字符串拼 SQL 等于把用户输入当代码执行，`' OR '1'='1` 就能绕过登录。",
        body: [
          "`PreparedStatement` 把 SQL 结构与参数分离，参数被当作「值」而不是「语句片段」，从根本上防注入。",
          "它还能复用执行计划，批量插入时性能更好。",
        ],
        code: `// 危险：拼接
String sql = "SELECT * FROM user WHERE name = '" + name + "'";
// 输入  ' OR '1'='1  就变成恒真条件

// 安全：占位符
String sql2 = "SELECT * FROM user WHERE name = ? AND pwd = ?";
try (PreparedStatement ps = conn.prepareStatement(sql2)) {
    ps.setString(1, name);
    ps.setString(2, pwd);
    try (ResultSet rs = ps.executeQuery()) { /* ... */ }
}

// 批量插入
try (PreparedStatement ps = conn.prepareStatement("INSERT INTO t(a,b) VALUES(?,?)")) {
    for (int i = 0; i < 1000; i++) {
        ps.setInt(1, i); ps.setString(2, "v" + i);
        ps.addBatch();
    }
    ps.executeBatch();
}`,
        lang: "Java",
        pts: [
          "占位符只能用于「值」，不能用于表名/列名/排序方向",
          "批量操作 `addBatch` + `executeBatch` 比循环执行快十倍以上",
          "表名动态拼接必须走白名单校验",
        ],
        pit: "把占位符用在 `ORDER BY ?` 上不生效——排序字段必须是确定的结构，需要白名单映射。",
      },
      {
        t: "事务、隔离级别与回滚",
        lead: "默认每条语句自动提交；要「要么全成功要么全失败」就必须关掉自动提交并手动 commit/rollback。",
        body: [
          "`conn.setAutoCommit(false)` 开启事务，成功后 `commit()`，异常时 `rollback()`。",
          "隔离级别从低到高：读未提交、读已提交、可重复读（MySQL 默认）、串行化。级别越高一致性越强、并发越低。",
        ],
        code: `Connection conn = null;
try {
    conn = DriverManager.getConnection(url, user, pwd);
    conn.setAutoCommit(false);

    try (PreparedStatement a = conn.prepareStatement(
            "UPDATE account SET balance = balance - ? WHERE id = ?");
         PreparedStatement b = conn.prepareStatement(
            "UPDATE account SET balance = balance + ? WHERE id = ?")) {
        a.setInt(1, 100); a.setInt(2, 1); a.executeUpdate();
        b.setInt(1, 100); b.setInt(2, 2); b.executeUpdate();
    }
    conn.commit();
} catch (SQLException e) {
    if (conn != null) conn.rollback();
    throw new RuntimeException("转账失败", e);
} finally {
    if (conn != null) conn.setAutoCommit(true);
}`,
        lang: "Java",
        pts: [
          "事务要作用在同一个 Connection 上",
          "`rollback` 也要 try-catch，别让它掩盖原始异常",
          "Spring 的 `@Transactional` 本质就是这么做的代理",
        ],
        pit: "`@Transactional` 标注在 private 方法或同类内部调用上不生效（代理没经过），这是最常见的「事务没起作用」。",
      },
      {
        t: "连接池：为什么不能每次新建连接",
        lead: "建立一次数据库连接要几十毫秒并消耗服务端资源，高并发下会瞬间打满。",
        body: [
          "连接池预先建立一批连接并复用，用完归还而不是关闭。常用 HikariCP（Spring Boot 默认）、Druid。",
          "关键参数：最大连接数、最小空闲、连接超时、空闲存活时间。最大连接数不是越大越好，要小于数据库的 max_connections。",
        ],
        code: `import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

HikariConfig cfg = new HikariConfig();
cfg.setJdbcUrl("jdbc:mysql://localhost:3306/demo");
cfg.setUsername("root");
cfg.setPassword("pwd");
cfg.setMaximumPoolSize(10);
cfg.setMinimumIdle(2);
cfg.setConnectionTimeout(3000);
cfg.setIdleTimeout(600_000);

HikariDataSource ds = new HikariDataSource(cfg);
try (Connection conn = ds.getConnection()) { /* ... */ }
ds.close();`,
        lang: "Java",
        pts: [
          "`getConnection()` 从池里借，`close()` 是归还而不是真关闭",
          "连接数 ≈ 核心线程数 × (1 + 等待时间/计算时间)",
          "连接泄漏（借了不还）会让池耗尽，表现为「获取连接超时」",
        ],
        pit: "用 try-with-resources 包住 Connection 才算真正归还；手动 `conn = ds.getConnection()` 后忘了 close，池很快耗尽。",
      },
    ],
    qa: [
      ["JDBC 和 ORM 的关系？", "JDBC 是底层标准，MyBatis/Hibernate 在其上做映射与简化；理解 JDBC 才能排查 ORM 的慢查询与事务问题。"],
      ["为什么 MyBatis 的 #{} 比 ${} 安全？", "`#{}` 是占位符（预编译），`${}` 是字符串拼接，后者有注入风险。"],
    ],
    sum: "资源用 try-with-resources、SQL 用占位符、事务同一连接、连接必须来自池。",
  },

  {
    t: "常用工具类与最佳实践",
    sub: "Objects · Collections · Optional · Stream 陷阱",
    mins: 45,
    kw: "复杂度",
    goals: [
      "用 Objects/Collections 减少样板代码",
      "避免 Optional 的常见误用",
      "识别 Stream 的隐蔽陷阱",
      "建立一套可复用的编码规范",
    ],
    map: [
      ["工具", "方法", "用途"],
      ["Objects", "`equals/hash/requireNonNull`", "空安全"],
      ["Collections", "`emptyList/sort/unmodifiable`", "常量与包装"],
      ["Optional", "`ofNullable/orElseGet`", "表达可能为空"],
      ["String", "`isBlank/repeat/strip`", "JDK 11+ 新方法"],
    ],
    mic: [
      {
        t: "Objects 与空安全",
        lead: "`Objects.equals(a, b)` 能安全处理 null，`Objects.requireNonNull` 能在入口就拦住 null。",
        body: [
          "`a.equals(b)` 在 a 为 null 时 NPE；`Objects.equals` 内部先判 null，是标准写法。",
          "`requireNonNull(x, \"msg\")` 让「参数不能为空」的契约显式化，错误在源头暴露。",
        ],
        code: `import java.util.Objects;

String a = null, b = "x";
System.out.println(Objects.equals(a, b));        // false，不抛异常
System.out.println(Objects.hash(a, b));

static void save(String name) {
    Objects.requireNonNull(name, "name 不能为空");
    // 后续逻辑可以放心用 name
}

try { save(null); }
catch (NullPointerException e) { System.out.println(e.getMessage()); }

// JDK 11+ 字符串新方法
System.out.println("  ".isBlank());              // true
System.out.println("ab".repeat(3));              // ababab
System.out.println("  x  ".strip());             // x`,
        lang: "Java",
        pts: [
          "`Objects.toString(x, \"默认\")` 安全转字符串",
          "`Objects.requireNonNullElse(x, def)` JDK 9+",
          "`isBlank` 比 `trim().isEmpty()` 更能识别全空白",
        ],
        pit: "`Objects.equals` 只能比较两个对象，不能用于「集合里是否包含 null 安全的元素」——那需要自己处理。",
      },
      {
        t: "不可变集合与防御性拷贝",
        lead: "对外暴露可变集合，等于把内部状态的控制权交出去。",
        body: [
          "`List.of()` / `Map.of()` 返回不可变集合（不能 add/remove/set）；`Collections.unmodifiableList` 是包装视图（原集合变了它也变）。",
          "返回内部集合时做防御性拷贝：`return new ArrayList<>(items)`。",
        ],
        code: `import java.util.*;

class Team {
    private final List<String> members = new ArrayList<>();

    public void add(String m) { members.add(m); }

    // 安全：拷贝后返回
    public List<String> members() { return List.copyOf(members); }

    // 或只读视图（注意：原集合变化会反映出来）
    public List<String> view() { return Collections.unmodifiableList(members); }
}

Team t = new Team();
t.add("a");
List<String> ms = t.members();
// ms.add("b");      // UnsupportedOperationException
System.out.println(ms);

List<String> fixed = List.of("x", "y");
System.out.println(fixed);`,
        lang: "Java",
        pts: [
          "`List.copyOf` 会拷贝并禁止修改，最安全",
          "`List.of` 不允许 null 元素",
          "不可变集合可作为常量安全共享（线程安全）",
        ],
        pit: "`Arrays.asList(a)` 既不能 add 也不能 remove，且修改元素会写回原数组——它只是视图。",
      },
      {
        t: "Optional 的正确用法",
        lead: "Optional 是「返回值的类型」，不是「字段/参数的装饰」。",
        body: [
          "用法：方法返回可能为空的结果时用 `Optional<T>`，调用方必须显式处理。避免 `Optional` 作为字段、参数、集合元素。",
          "`orElse` 立即求值，`orElseGet` 惰性；`map/flatMap/filter` 链式处理。",
        ],
        code: `import java.util.Optional;

static Optional<String> findUser(int id) {
    return id == 1 ? Optional.of("Amy") : Optional.empty();
}

// 好
String name = findUser(1).map(String::toUpperCase).orElse("匿名");

// 好：惰性默认值
String slow = findUser(2).orElseGet(() -> expensiveDefault());

// 不好：等价于 null 检查的包装
Optional<String> o = findUser(1);
if (o.isPresent()) System.out.println(o.get());

// 不好：字段用 Optional
class Bad { Optional<String> name; }`,
        lang: "Java",
        pts: [
          "`Optional.of(null)` 会 NPE，用 `ofNullable`",
          "`orElseThrow(() -> new XxxException())` 表达「必须有」",
          "`ifPresentOrElse` 同时处理两种情况（JDK 9+）",
        ],
        pit: "把 Optional 用在实体字段上，会导致序列化（JSON）出现奇怪结构，也让代码到处 `get()`。",
      },
      {
        t: "Stream 的五个隐蔽陷阱",
        lead: "Stream 写起来爽，但副作用、装箱、重复消费、并行安全这四个坑很常见。",
        body: [
          "① 在 forEach 里修改外部集合；② 基本类型流用 `Stream<Integer>` 造成装箱；③ Stream 被消费两次；④ 并行流里操作非线程安全集合；⑤ 用 Stream 做有状态的累加。",
          "简单循环反而更快更清楚，别为了「函数式」硬套。",
        ],
        code: `import java.util.*;
import java.util.stream.*;

// ① 副作用
List<Integer> out = new ArrayList<>();
// IntStream.range(0, 5).forEach(out::add);   // 顺序不确定时很危险（并行）

// ② 装箱：用 IntStream 避免
int sum = IntStream.rangeClosed(1, 100).sum();      // 快
int sum2 = IntStream.rangeClosed(1, 100).boxed()
        .reduce(0, Integer::sum);                   // 慢

// ③ 重复消费
Stream<Integer> s = Stream.of(1, 2, 3);
s.count();
// s.findFirst();      // IllegalStateException

// ⑤ 有状态累加用循环更清楚
int acc = 0;
for (int x : List.of(1, 2, 3)) if (x % 2 == 1) acc += x;
System.out.println(sum + sum2 + acc);`,
        lang: "Java",
        pts: [
          "`IntStream/LongStream/DoubleStream` 避免装箱",
          "并行流只用无状态、无副作用、可结合的操作",
          "Stream 的调试不如循环直观，复杂逻辑优先循环",
        ],
        pit: "并行流 + `ArrayList.add` 会丢数据或数组越界，必须用 `collect` 而不是 forEach 累加。",
      },
    ],
    qa: [
      ["为什么推荐不可变对象？", "天然线程安全、可安全共享、易于推理，避免「谁改了我」的问题。"],
      ["Optional 会让代码变啰嗦吗？", "在「返回值可能为空」这一个场景它是净收益；滥用才会啰嗦。"],
    ],
    sum: "空判断用 Objects、集合对外只给不可变、Optional 只做返回值、Stream 别带副作用。",
  },
];
