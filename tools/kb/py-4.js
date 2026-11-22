// Python 第 16-20 章 · 每章 4 节微课
module.exports = [
  {
    t: "类型注解与 dataclass",
    sub: "typing · Optional/Union · dataclass · 类型检查",
    mins: 45,
    kw: "模拟",
    goals: [
      "给函数与变量加上类型注解",
      "用 dataclass 少写样板代码",
      "理解注解只是提示、不强制",
      "会用 mypy 做静态检查",
    ],
    map: [
      ["写法", "含义", "说明"],
      ["`x: int`", "变量注解", "运行时不检查"],
      ["`def f(a: int) -> str`", "参数/返回", "文档 + 检查工具"],
      ["`Optional[int]`", "int 或 None", "等价 `int | None`"],
      ["`list[int]`", "元素类型", "3.9+ 内置泛型"],
    ],
    mic: [
      {
        t: "注解是给人和工具看的",
        lead: "Python 不会因为注解报错，但 IDE 补全、mypy 检查、文档生成都靠它。",
        body: [
          "`def greet(name: str, times: int = 1) -> str:` 明确写出输入输出类型，读代码的人立刻明白怎么用。",
          "注解保存在 `__annotations__` 里，可以被框架读取（如 FastAPI 用它自动生成校验与文档）。",
        ],
        code: `def greet(name: str, times: int = 1) -> str:
    return f"hi {name}" * times

print(greet("a", 2))
print(greet.__annotations__)
# {'name': <class 'str'>, 'times': <class 'int'>, 'return': <class 'str'>}

x: int = 3
names: list[str] = ["a"]
table: dict[str, int] = {"a": 1}
print(greet(1))     # 不报错，只是类型不对`,
        lang: "Python",
        pts: [
          "注解不影响运行，`greet(1)` 照样执行",
          "3.10+ 用 `int | None` 比 `Optional[int]` 更简洁",
          "复杂类型用 `from typing import List, Dict, Optional, Union`（3.9 前）",
        ],
        pit: "给函数加了注解就以为有运行时校验，是常见误解——真要校验得用 pydantic 之类。",
      },
      {
        t: "dataclass：少写 __init__ 和 __repr__",
        lead: "一个 `@dataclass` 装饰器自动生成 `__init__`、`__repr__`、`__eq__`，省掉十几行样板。",
        body: [
          "字段用带注解的类属性声明。`field(default_factory=list)` 解决可变默认值问题。`frozen=True` 让实例不可变（可哈希，能进 set）。",
          "`order=True` 自动生成比较方法，可直接排序。",
        ],
        code: `from dataclasses import dataclass, field

@dataclass
class Point:
    x: int
    y: int
    tags: list[str] = field(default_factory=list)

p = Point(1, 2)
print(p)                  # Point(x=1, y=2, tags=[])
print(p == Point(1, 2))   # True

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int

print(sorted([Version(2,0), Version(1,9)]))`,
        lang: "Python",
        pts: [
          "`field(default_factory=list)` 是可变默认值的正确写法",
          "`frozen=True` 后对象不可改，可作 dict 键",
          "`asdict(obj)` 转成普通 dict，方便序列化",
        ],
        pit: "dataclass 里直接写 `tags: list = []` 会 `ValueError: mutable default`，必须用 field。",
      },
      {
        t: "Optional、Union 与字面量类型",
        lead: "类型系统能表达「可能为空」「几种之一」「只能是这几个值」，让意图更清楚。",
        body: [
          "`Optional[str]` 表示 str 或 None——这不是「可选参数」，参数可选是默认值的事。`Union[int, str]` 是几种类型之一。",
          "`Literal[\"asc\", \"desc\"]` 限定取值，比 str 精确得多，IDE 能给出补全。",
        ],
        code: `from typing import Optional, Union, Literal, TypedDict

def find(name: str) -> Optional[int]:
    return None

def parse(v: Union[int, str]) -> int:
    return int(v)

Sort = Literal["asc", "desc"]
def sortBy(mode: Sort) -> None: ...

class User(TypedDict):
    id: int
    name: str

u: User = {"id": 1, "name": "a"}
print(find("x"), parse("3"))`,
        lang: "Python",
        pts: [
          "`Optional[X]` == `Union[X, None]` == `X | None`",
          "`TypedDict` 描述「有固定键的 dict」，适合配置与 JSON",
          "返回值可能为 None 时，调用方必须判空（mypy 会提醒）",
        ],
        pit: "把 `Optional` 理解成「可以不传这个参数」是常见误解，它的意思是「值可能是 None」。",
      },
      {
        t: "用 mypy 做静态检查",
        lead: "mypy 在运行前就能发现类型错误，比等到线上报错强得多。",
        body: [
          "`pip install mypy` 后执行 `mypy main.py`。它会检查参数类型、返回值、属性是否存在。",
          "大型项目建议开启 `--strict`，再逐步修；小脚本可以只检查关键模块。",
        ],
        code: `# main.py
def add(a: int, b: int) -> int:
    return a + b

add("1", 2)      # mypy 报错：Argument 1 has incompatible type "str"

# 运行
# $ mypy main.py
# main.py:5: error: Argument 1 to "add" has incompatible type "str"; expected "int"

# 忽略某行（谨慎使用）
add("1", 2)  # type: ignore`,
        lang: "Python",
        pts: [
          "mypy 不做类型推断的逃逸分析，`Any` 会让检查失效",
          "第三方库没有类型标注时，用 `types-包名` 或 stub 文件",
          "CI 里跑 mypy 能防止类型问题合并进主干",
        ],
        pit: "给所有变量都写 `Any` 等于关掉类型检查——类型注解的价值在于具体。",
      },
    ],
    qa: [
      ["注解会影响性能吗？", "几乎不影响。函数调用时不会检查类型，只有 `get_type_hints` 之类的反射才会解析。"],
      ["dataclass 和 namedtuple 的区别？", "dataclass 可变（默认）、支持默认值和方法；namedtuple 不可变、更轻、更省内存。"],
    ],
    sum: "注解写意图、dataclass 省样板、Optional 表示可能为 None、mypy 提前抓错。",
  },

  {
    t: "并发：线程、进程与 asyncio",
    sub: "GIL · ThreadPoolExecutor · multiprocessing · async/await",
    mins: 55,
    kw: "复杂度",
    goals: [
      "理解 GIL 对多线程的影响",
      "知道 IO 密集与 CPU 密集该用哪种并发",
      "会用线程池与进程池",
      "写得出基本的 async/await 代码",
    ],
    map: [
      ["方式", "适合", "限制"],
      ["多线程", "IO 密集", "GIL 让 CPU 任务无法并行"],
      ["多进程", "CPU 密集", "进程间通信有开销"],
      ["asyncio", "高并发 IO", "需要全链路异步"],
      ["线程池", "简单任务并发", "仍需注意共享状态"],
    ],
    mic: [
      {
        t: "GIL：Python 的全局锁",
        lead: "CPython 有一把全局解释器锁，同一时刻只有一个线程在执行 Python 字节码。",
        body: [
          "所以多线程做 CPU 密集任务（纯计算）不会变快，甚至更慢（切换开销）。但 IO 等待时线程会释放 GIL，所以 IO 密集场景多线程有效。",
          "Python 3.13 起有实验性的 free-threaded 构建（无 GIL），但生态兼容性仍需观察。",
        ],
        code: `import threading, time

def cpu_work(n):
    s = 0
    for i in range(n): s += i
    return s

t0 = time.time()
cpu_work(10**7); cpu_work(10**7)
print("串行", time.time() - t0)

t0 = time.time()
ts = [threading.Thread(target=cpu_work, args=(10**7,)) for _ in range(2)]
[t.start() for t in ts]; [t.join() for t in ts]
print("多线程", time.time() - t0)   # 不会更快`,
        lang: "Python",
        pts: [
          "CPU 密集用 multiprocessing，IO 密集用 threading/asyncio",
          "numpy 等 C 扩展在计算时会释放 GIL，能真正并行",
          "线程共享内存，进程间数据要序列化",
        ],
        pit: "以为「多线程就能加速」是最大误区——纯 Python 计算任务多线程反而更慢。",
      },
      {
        t: "线程池与进程池",
        lead: "手动管理线程容易泄漏，用 `concurrent.futures` 的池化接口更安全。",
        body: [
          "`ThreadPoolExecutor(max_workers=n)` 用于 IO；`ProcessPoolExecutor` 用于 CPU。`executor.map` 一次性提交，`submit` 返回 future 可单独取结果。",
          "进程池的函数与参数必须可 pickle，所以 lambda、局部函数不能直接提交。",
        ],
        code: `from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time

def fetch(i):
    time.sleep(0.2)          # 模拟网络
    return i * 2

t0 = time.time()
with ThreadPoolExecutor(max_workers=8) as ex:
    print(list(ex.map(fetch, range(8))))     # 约 0.2s
print("线程池", round(time.time() - t0, 2))

def heavy(n):
    return sum(i * i for i in range(n))

with ProcessPoolExecutor() as ex:
    print(list(ex.map(heavy, [10**6] * 4)))`,
        lang: "Python",
        pts: [
          "`max_workers` 默认是 CPU 数 × 5（IO）或 CPU 数（CPU）",
          "`executor.map` 保持输入顺序返回结果",
          "进程池在 Windows 上必须有 `if __name__ == \"__main__\":`",
        ],
        pit: "在 Windows 下没有 main 保护就创建进程池，会导致子进程无限递归创建进程。",
      },
      {
        t: "asyncio：单线程处理上万连接",
        lead: "协程在「等待 IO」时主动让出控制权，一个线程就能同时推进大量任务。",
        body: [
          "`async def` 定义协程，`await` 挂起等待，`asyncio.gather` 并发执行多个。事件循环负责调度。",
          "关键前提：整条链路都不能有阻塞调用。一个 `time.sleep` 或同步 requests 就会卡住整个循环。",
        ],
        code: `import asyncio

async def fetch(i):
    await asyncio.sleep(0.2)      # 非阻塞等待
    return i * 2

async def main():
    t0 = asyncio.get_event_loop().time()
    r = await asyncio.gather(*[fetch(i) for i in range(10)])
    print(r, round(asyncio.get_event_loop().time() - t0, 2))

asyncio.run(main())

# 超时控制
async def guard():
    try:
        await asyncio.wait_for(fetch(1), timeout=0.1)
    except asyncio.TimeoutError:
        print("超时")`,
        lang: "Python",
        pts: [
          "`asyncio.run()` 是启动入口，一个程序通常只调一次",
          "`gather` 并发、`wait` 更细粒度控制、`create_task` 后台跑",
          "异步里调用同步阻塞函数要用 `run_in_executor`",
        ],
        pit: "在协程里写 `time.sleep(1)` 会阻塞整个事件循环，所有任务一起卡住——必须用 `await asyncio.sleep`。",
      },
      {
        t: "并发编程的共享状态",
        lead: "线程共享内存，两个线程同时改一个变量就会丢更新——这是并发 bug 的根源。",
        body: [
          "`threading.Lock` 保护临界区；`queue.Queue` 是线程安全的任务队列，比手动加锁更简单。",
          "进程间不共享内存，用 `Queue`/`Pipe` 传数据，或用共享内存。",
        ],
        code: `import threading

counter = 0
lock = threading.Lock()

def inc():
    global counter
    for _ in range(100000):
        with lock:              # 保护临界区
            counter += 1

ts = [threading.Thread(target=inc) for _ in range(4)]
[t.start() for t in ts]; [t.join() for t in ts]
print(counter)                  # 400000（去掉 lock 会小于它）

from queue import Queue
q = Queue()
q.put(1); print(q.get())`,
        lang: "Python",
        pts: [
          "不加锁的 `+=` 不是原子操作，会丢更新",
          "锁的粒度要小，但别在锁里做 IO",
          "`queue.Queue` 内部已加锁，生产-消费首选",
        ],
        pit: "两个锁交叉获取会死锁（A 等 B、B 等 A），固定加锁顺序能避免。",
      },
    ],
    qa: [
      ["GIL 会取消吗？", "Python 3.13 提供了实验性 free-threaded 构建，但默认构建仍保留 GIL，短期不会改变主流用法。"],
      ["爬虫用多线程还是 asyncio？", "几十个请求用线程池足够；几千并发用 aiohttp + asyncio。"],
    ],
    sum: "CPU 密集上进程、IO 密集上线程或协程、共享状态必须加锁。",
  },

  {
    t: "正则表达式实战",
    sub: "元字符 · 分组 · 贪婪匹配 · 常用模式",
    mins: 50,
    kw: "字符串",
    goals: [
      "看懂并写出常见正则",
      "分清贪婪与非贪婪",
      "会用分组提取与替换",
      "避开正则的性能陷阱",
    ],
    map: [
      ["符号", "含义", "例子"],
      ["`.`", "任意字符（除换行）", "`a.c` 匹配 abc"],
      ["`\\d \\w \\s`", "数字/单词/空白", "`\\d+` 匹配数字"],
      ["`* + ?`", "0+/1+/0 或 1 次", "`a+` 至少一个 a"],
      ["`^ $`", "行首/行尾", "`^abc$` 整行"],
    ],
    mic: [
      {
        t: "最小可用正则",
        lead: "正则就是「描述字符串形状的模板」，先掌握 8 个符号就能解决大部分问题。",
        body: [
          "`\\d` 数字、`\\w` 字母数字下划线、`\\s` 空白、`.` 任意字符。`+` 一个或多个、`*` 零个或多个、`?` 零个或一个、`{m,n}` 指定次数。",
          "`[]` 字符集（`[abc]`、`[0-9]`、`[^0-9]` 取反），`|` 或，`()` 分组。",
        ],
        code: `import re

s = "订单 A123 金额 99 元，订单 B7 金额 1200 元"
print(re.findall(r"[A-Z]\\d+", s))        # ['A123', 'B7']
print(re.findall(r"\\d+", s))              # ['123', '99', '7', '1200']
print(re.search(r"金额 (\\d+)", s).group(1))   # 99

print(re.fullmatch(r"\\d{11}", "13800138000"))  # 手机号
print(bool(re.match(r"^[a-z]+$", "abc")))       # True

# 编译一次，重复使用
pat = re.compile(r"\\d+")
print(pat.findall("a1b22c333"))`,
        lang: "Python",
        pts: [
          "正则字符串用 raw string `r\"...\"`，避免反斜杠转义问题",
          "`match` 只从开头匹配，`search` 全文找，`fullmatch` 整串匹配",
          "`re.compile` 后复用能省下重复编译开销",
        ],
        pit: "`re.match(r\"\\d+\", \"abc123\")` 返回 None——match 只从位置 0 开始，找中间要用 search。",
      },
      {
        t: "分组、命名分组与替换",
        lead: "`()` 把一部分模式括起来，就能单独提取或替换。",
        body: [
          "`group(1)` 取第一组，`groups()` 取全部。`(?P<name>...)` 命名分组，用 `group('name')` 取，可读性更好。",
          "`re.sub(pattern, replacement, s)` 替换，`replacement` 里可用 `\\1` 或 `\\g<name>` 引用分组。",
        ],
        code: `import re

s = "2026-11-22"
m = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", s)
print(m.groups())        # ('2026', '11', '22')
print(m.group(1))        # 2026

m2 = re.match(r"(?P<y>\\d{4})-(?P<m>\\d{2})", s)
print(m2.group("y"))     # 2026

# 替换：日期格式转换
print(re.sub(r"(\\d{4})-(\\d{2})-(\\d{2})", r"\\3/\\2/\\1", s))
# 22/11/2026

# 去掉多余空白
print(re.sub(r"\\s+", " ", "  a   b  c ").strip())`,
        lang: "Python",
        pts: [
          "分组编号从 1 开始，`\\0` 或 `group(0)` 是整个匹配",
          "`(?:...)` 是非捕获分组，只要分组不要编号时用它",
          "替换字符串里反斜杠要写成 `r\"\\1\"`",
        ],
        pit: "`re.sub` 的替换参数是普通字符串，`\\1` 需要 raw string 或双反斜杠，否则变成控制字符。",
      },
      {
        t: "贪婪与非贪婪",
        lead: "`.*` 会尽可能多吃，`.*?` 会尽可能少吃——这是正则最容易出错的地方。",
        body: [
          "默认量词是**贪婪**的：`<.*>` 匹配 `<a><b>` 会一口吞掉整串。加 `?` 变非贪婪：`<.*?>` 只匹配 `<a>`。",
          "`^` 与 `$` 在 `re.M` 模式下匹配每行首尾；`re.S` 让 `.` 也能匹配换行。",
        ],
        code: `import re

s = "<a><b><c>"
print(re.findall(r"<.*>", s))     # ['<a><b><c>']  贪婪
print(re.findall(r"<.*?>", s))    # ['<a>','<b>','<c>'] 非贪婪

text = """line1
line2"""
print(re.findall(r"^line\\d$", text, re.M))   # ['line1','line2']
print(re.findall(r"line1.*line2", text, re.S))

html = '<div class="x">hi</div>'
print(re.search(r'class="([^"]+)"', html).group(1))   # x`,
        lang: "Python",
        pts: [
          "`[^\"]+` 比 `.*?` 更精确也更高效",
          "`re.M` 多行模式、`re.S` 让点匹配换行、`re.I` 忽略大小写",
          "多层嵌套结构不要用正则解析，改 HTML 解析器",
        ],
        pit: "用正则解析 HTML/JSON 是经典反模式——嵌套与转义会让正则迅速失控且极易漏匹配。",
      },
      {
        t: "性能陷阱与安全边界",
        lead: "某些正则会指数级回溯，一个几十字符的输入就能让 CPU 跑满——这叫 ReDoS。",
        body: [
          "`(a+)+b` 这类嵌套量词在匹配失败时会尝试海量路径。避免嵌套量词，尽量用字符集代替 `.*`，能限定长度就限定。",
          "处理不可信输入时给正则加超时（Python 3.11+ 无内置超时，可用第三方 regex 模块或限制输入长度）。",
        ],
        code: `import re, time

bad = re.compile(r"(a+)+b")
s = "a" * 22                 # 没有 b，触发回溯爆炸
t0 = time.time()
bad.match(s)
print("耗时", round(time.time() - t0, 3), "s")

# 改写：用字符集限定
good = re.compile(r"a+b")
t0 = time.time()
good.match(s)
print("改写后", round(time.time() - t0, 6), "s")

# 预编译 + 限制长度
if len(s) < 1000:
    good.match(s)`,
        lang: "Python",
        pts: [
          "嵌套量词 `(x+)+`、`(.*)*` 是 ReDoS 的典型特征",
          "`[^,]+` 比 `.*?` 在多数场景更快",
          "对用户输入做长度上限，是最经济的防护",
        ],
        pit: "看起来「更严格」的复杂正则，往往既慢又容易漏匹配；能用简单的字符串方法就用方法。",
      },
    ],
    qa: [
      ["什么时候不该用正则？", "解析嵌套结构（HTML/JSON）、需要语义理解、模式非常复杂时——用专门的解析器或手写状态机更可靠。"],
      ["`re.match` 和 `re.fullmatch` 的区别？", "match 只要开头匹配即可（后面可以有多余内容），fullmatch 要求整个字符串完全匹配。"],
    ],
    sum: "raw string 写正则、分组提取用 ()、贪婪加 ? 变非贪婪、嵌套量词要避开。",
  },

  {
    t: "性能优化与剖析",
    sub: "cProfile · 复杂度陷阱 · 数据结构选择 · 内存",
    mins: 50,
    kw: "复杂度",
    goals: [
      "用 cProfile 找出真正的瓶颈",
      "识别代码里的隐形 O(n²)",
      "按访问模式选对数据结构",
      "知道 Python 的内存开销在哪",
    ],
    map: [
      ["手段", "收益", "说明"],
      ["cProfile", "定位瓶颈", "先测再优化"],
      ["set 替代 list 查找", "O(n)→O(1)", "最常用的一招"],
      ["join 替代 +=", "O(n²)→O(n)", "字符串拼接"],
      ["局部变量", "5~15%", "查找更快"],
    ],
    mic: [
      {
        t: "先度量，再优化",
        lead: "凭直觉猜瓶颈十次有九次是错的——用 profiler 看数据。",
        body: [
          "`python -m cProfile -s cumtime script.py` 输出每个函数的调用次数与耗时，按累计时间排序。",
          "`time.perf_counter()` 测单段代码；`line_profiler` 能精确到行（需安装）。",
        ],
        code: `# 命令行
# python -m cProfile -s cumtime main.py | head -20

import cProfile, pstats, io

def slow():
    return [i * i for i in range(10**6)]

pr = cProfile.Profile()
pr.enable()
slow()
pr.disable()

s = io.StringIO()
pstats.Stats(pr, stream=s).sort_stats("cumtime").print_stats(8)
print(s.getvalue())`,
        lang: "Python",
        pts: [
          "先看 `cumtime`（累计）再看 `tottime`（自身）",
          "调用次数异常高的函数往往是主要嫌疑",
          "优化后必须重新测，确认真的变快且结果没变",
        ],
        pit: "在 profiler 下跑会慢 2~5 倍，别用它的耗时当绝对基准，只看相对占比。",
      },
      {
        t: "隐形 O(n²)：最常见的四种",
        lead: "这些写法看起来是一层循环，实际每次都扫了整个容器。",
        body: [
          "① `x in list` 在循环里 → 换 set；② `s += c` 拼字符串 → 换 join；③ `list.insert(0, x)` → 换 deque；④ 嵌套里重复 `len()`/切片 → 提到外面。",
          "识别方法：看循环体内是否有「随 n 增长的扫描」。有就是 O(n²)。",
        ],
        code: `# ① in list
for x in a:
    if x in b:        # b 是 list → O(n)
        pass
bset = set(b)         # 先转 set
for x in a:
    if x in bset: pass

# ② 字符串拼接
s = ""
for w in words: s += w        # 慢
s = "".join(words)            # 快

# ③ 头部插入
a.insert(0, x)                # O(n)
dq.appendleft(x)              # O(1)

# ④ 重复切片
for i in range(n):
    part = a[:i]              # 每次都拷贝 → O(n^2)
# 改用前缀和或增量维护`,
        lang: "Python",
        pts: [
          "`in set` / `in dict` 是 O(1)，`in list` 是 O(n)",
          "`a[:i]` 每次都创建新列表，代价常被低估",
          "嵌套循环里调用函数，先看这个函数是不是 O(n)",
        ],
        pit: "把 list 转成 set 也要 O(n)，只查一两次反而更慢——要看查询次数决定。",
      },
      {
        t: "数据结构选择清单",
        lead: "选对容器，性能差一个数量级；选错了再怎么优化代码也没用。",
        body: [
          "需要按 key 查 → dict；需要去重/判存在 → set；需要顺序 + 随机访问 → list；需要两端操作 → deque；需要有序 + 范围 → 排序后的 list + bisect。",
          "Python 没有内置平衡树，需要「有序集合 + 插入删除」时用 `sortedcontainers`（第三方）或自己写。",
        ],
        code: `# 需要频繁查询键 → dict
cache = {}
if k in cache: v = cache[k]

# 需要频次统计 → Counter
from collections import Counter
c = Counter(data)

# 需要固定大小窗口 → deque(maxlen=k)
from collections import deque
win = deque(maxlen=3)

# 需要「有序 + 二分」→ 排序 list + bisect
import bisect
a.sort()
i = bisect.bisect_left(a, x)`,
        lang: "Python",
        pts: [
          "dict/set 的 O(1) 是均摊，极端情况下会退化",
          "list 的内存开销比 array('i') 大 3~4 倍",
          "超大数值数组用 `array` 或 numpy 省内存",
        ],
        pit: "为了「有序」把 list 每次插入后重新 sort，是 O(n² log n) 的灾难，改用 bisect.insort 或 heap。",
      },
      {
        t: "内存与生成式思维",
        lead: "Python 每个 int 对象约 28 字节，一个 list 存 100 万个 int 要几十 MB——数据一大就 MLE。",
        body: [
          "用生成器代替中间列表、用 `array`/`numpy` 存数值、及时 `del` 大对象并 `gc.collect()`，是三条主线。",
          "`sys.getsizeof` 看对象本身大小，`tracemalloc` 看分配来源。",
        ],
        code: `import sys, tracemalloc
from array import array

print(sys.getsizeof(1))          # 28
print(sys.getsizeof([1,2,3]))    # 88（不含元素对象）

a = array("i", range(10**6))     # 4MB，比 list 省 8 倍以上

tracemalloc.start()
big = [i for i in range(10**5)]
cur, peak = tracemalloc.get_traced_memory()
print(cur / 1024 / 1024, "MB")

del big
import gc; gc.collect()`,
        lang: "Python",
        pts: [
          "小整数被缓存，大整数每个都是独立对象",
          "`array('i')` 存 32 位整数，内存紧凑但操作不如 list 灵活",
          "循环里不断 append 大对象是最常见的内存增长源",
        ],
        pit: "`del x` 只是删名字，如果还有别的引用（列表里、闭包里），内存不会释放。",
      },
    ],
    qa: [
      ["Python 能优化到 C 的速度吗？", "单靠写法优化最多快几倍；要接近 C 得用 numpy 向量化、Cython、或把热路径写成 C 扩展。"],
      ["为什么 PyPy 有时反而慢？", "启动有 JIT 预热成本，短脚本或重 C 扩展的场景不明显；长循环、纯 Python 计算才收益大。"],
    ],
    sum: "先 profile 再优化，`in list` 换 set、拼接换 join、头部插入换 deque。",
  },

  {
    t: "虚拟环境与项目结构",
    sub: "venv · pip · requirements · 包组织 · 代码规范",
    mins: 40,
    kw: "复杂度",
    goals: [
      "为每个项目建独立虚拟环境",
      "用 requirements 锁定依赖",
      "按标准结构组织包",
      "知道该提交什么、不该提交什么",
    ],
    map: [
      ["工具", "作用", "命令"],
      ["venv", "隔离依赖", "`python -m venv .venv`"],
      ["pip", "装包", "`pip install requests`"],
      ["requirements", "锁定版本", "`pip freeze > requirements.txt`"],
      ["ruff/black", "格式化与检查", "`ruff check .`"],
    ],
    mic: [
      {
        t: "为什么必须用虚拟环境",
        lead: "不同项目依赖不同版本的同一个库，装到全局就会互相破坏。",
        body: [
          "`python -m venv .venv` 创建独立环境，激活后 `pip install` 只装进这个目录。删除 `.venv` 就等于彻底卸载。",
          "激活：Windows `.venv\\Scripts\\activate`，macOS/Linux `source .venv/bin/activate`。",
        ],
        code: `# 创建
python -m venv .venv

# 激活（Windows Git Bash）
source .venv/Scripts/activate
# 激活（macOS / Linux）
source .venv/bin/activate

# 确认
which python
python -V

# 退出
deactivate`,
        lang: "bash",
        pts: [
          "一个项目一个环境，环境目录名统一 `.venv`",
          "`.venv/` 必须写进 .gitignore",
          "IDE 里要手动指向 `.venv` 的解释器",
        ],
        pit: "忘了激活就在全局 pip install，装完发现「代码能跑但换台机器就跑不了」——因为依赖没记录。",
      },
      {
        t: "依赖管理与版本锁定",
        lead: "`requirements.txt` 记录精确版本，才能保证别人（和 CI）装出一样的环境。",
        body: [
          "`pip freeze > requirements.txt` 导出当前全部依赖及版本；`pip install -r requirements.txt` 还原。",
          "正式项目用 `pyproject.toml` + `uv`/`poetry` 管理，能区分直接依赖与传递依赖。",
        ],
        code: `# 安装
pip install requests pandas

# 导出精确版本
pip freeze > requirements.txt

# 还原
pip install -r requirements.txt

# 升级单个包
pip install --upgrade requests

# 查看已装
pip list`,
        lang: "bash",
        pts: [
          "requirements.txt 里写 `==` 而不是 `>=`，保证可复现",
          "开发依赖（pytest、ruff）单独放 requirements-dev.txt",
          "包名大小写不敏感，但文件名建议保持一致",
        ],
        pit: "`pip freeze` 会把开发机上的所有包（含无关的）都导出，产生冗余依赖；建议先建干净环境再 freeze。",
      },
      {
        t: "项目结构：从脚本到工程",
        lead: "文件一多就需要结构：源码、测试、配置、文档各归其位。",
        body: [
          "最小可用结构：`src/包名/` 放代码，`tests/` 放测试，根目录放 `pyproject.toml`、`README.md`、`.gitignore`。",
          "包内用相对导入 `from .utils import f`；入口脚本放 `src/包名/__main__.py`，就能 `python -m 包名` 运行。",
        ],
        code: `project/
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── __main__.py
│       ├── core.py
│       └── utils.py
├── tests/
│   └── test_core.py
├── pyproject.toml
├── README.md
└── .gitignore

# 运行
# python -m myapp
# pytest`,
        lang: "text",
        pts: [
          "`__init__.py` 让目录成为包（3.3+ 命名空间包可省，但显式更好）",
          "测试与源码分离，`pytest` 会自动发现 `test_*.py`",
          "`__main__.py` 让包可以直接运行",
        ],
        pit: "把业务代码写在根目录的 `main.py` 里，随着文件增多会出现大量循环导入——尽早建包。",
      },
      {
        t: "代码规范与 Git 提交",
        lead: "统一的格式不是洁癖：它让 diff 干净、review 高效、合并冲突更少。",
        body: [
          "PEP 8 是官方风格指南：4 空格缩进、snake_case 函数名、PascalCase 类名、常量全大写。用 `ruff` 或 `black` 自动格式化，不用手调。",
          "`.gitignore` 至少排除 `.venv/`、`__pycache__/`、`.env`、`*.pyc` 和本地数据文件。",
        ],
        code: `# 格式化与检查
pip install ruff
ruff check .
ruff format .

# .gitignore
.venv/
__pycache__/
*.pyc
.env
data/*.csv
.DS_Store

# 提交前自检
ruff check . && pytest -q`,
        lang: "bash",
        pts: [
          "不要提交 `.env`、密钥、大模型权重、数据集",
          "提交信息写「做了什么」而不是「改了文件」",
          "CI 里跑 lint + test，防止坏代码进主干",
        ],
        pit: "把 `print` 调试语句、临时脚本、密码一起提交上去，是最常见也最尴尬的事故。",
      },
    ],
    qa: [
      ["venv 和 conda 怎么选？", "纯 Python 项目用 venv（自带、轻量）；需要管理非 Python 依赖（CUDA、C 库）时 conda 更方便。"],
      ["为什么依赖要锁版本？", "不锁版本时，某天上游发新版可能破坏你的代码，而你在本地完全无法复现。"],
    ],
    sum: "一项目一 venv、依赖写死版本、代码分包放 src、`.venv` 绝不提交。",
  },
];
