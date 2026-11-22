// Python 第 11-15 章 · 每章 4 节微课
module.exports = [
  {
    t: "Python 算法竞赛模板",
    sub: "快速 IO · 常用数据结构 · 递归与记忆化 · 常数优化",
    mins: 50,
    kw: "输入输出",
    goals: [
      "写出抗 TLE 的 Python 竞赛骨架",
      "用 sys.stdin 批量读入替代 input",
      "知道哪些操作在 Python 里特别慢",
      "把 C++ 套路翻译成 Python 等价写法",
    ],
    map: [
      ["需求", "C++", "Python"],
      ["批量读入", "快读", "`sys.stdin.buffer.read().split()`"],
      ["堆", "priority_queue", "`heapq`"],
      ["二分", "lower_bound", "`bisect`"],
      ["树状数组", "手写", "手写（Python 里慎用）"],
    ],
    mic: [
      {
        t: "极速 IO：一次读完再解析",
        lead: "Python 的 `input()` 每次都要走一层缓冲与解码，1e6 行输入能差出 3 秒。",
        body: [
          "标准做法是把整个 stdin 一次读进来再 split，然后按需取。这对「第一行 n，接下来 n 个数」的题极其有效。",
          "输出多时用 `sys.stdout.write('\\n'.join(map(str, ans)))`，比循环 print 快一个数量级。",
        ],
        code: `import sys

def main():
    data = sys.stdin.buffer.read().split()
    it = iter(data)
    n = int(next(it))
    a = [int(next(it)) for _ in range(n)]
    # ... 计算
    sys.stdout.write("\\n".join(map(str, a)))

if __name__ == "__main__":
    main()`,
        lang: "Python",
        pts: [
          "`sys.stdin.buffer.read()` 返回 bytes，`int()` 可直接解析",
          "`iter()` + `next()` 适合按需顺序取值",
          "输出用 join 拼一个大字符串，避免多次 write",
        ],
        pit: "`data = sys.stdin.read().split()` 在 Windows 下可能遇到 `\\r\\n`，用 `buffer` 版本或 `.strip()` 处理。",
      },
      {
        t: "数据结构对照表",
        lead: "Python 自带的 list/dict/set 覆盖了大部分需求，缺的用 heapq/bisect 补。",
        body: [
          "栈用 list（append/pop），队列用 deque（append/popleft），堆用 heapq，有序集合没有内置的——需要时用 bisect 维护有序 list 或自己写。",
          "并查集、线段树这类结构需要手写，Python 里要注意用 list 而不是 dict，访问更快。",
        ],
        code: `from collections import deque
import heapq, bisect

st = []                      # 栈
st.append(1); st.pop()

q = deque()                  # 队列
q.append(1); q.popleft()

h = []                       # 小根堆
heapq.heappush(h, 2); heapq.heappop(h)

# 并查集
fa = list(range(n + 1))
def find(x):
    while fa[x] != x:
        fa[x] = fa[fa[x]]
        x = fa[x]
    return x
def union(a, b):
    a, b = find(a), find(b)
    if a != b: fa[a] = b`,
        lang: "Python",
        pts: [
          "并查集用迭代版 find 避免递归深度问题",
          "`list(range(n))` 是最快的初始化方式",
          "Python 没有 multiset，用 Counter 或 sortedlist 替代",
        ],
        pit: "把线段树/树状数组硬翻译成 Python 往往还是 TLE——这类题优先换语言，或想 O(n) 解法。",
      },
      {
        t: "递归、记忆化与迭代改写",
        lead: "Python 递归有 1000 层默认上限，深搜题必须提高上限或改迭代，否则 RE。",
        body: [
          "`sys.setrecursionlimit(1 << 20)` 打开上限；同时注意每层栈帧占内存，深度 1e6 会直接段错误。",
          "DFS 能改成显式栈就改；DP 能写成递推就别写递归——两者在 Python 里性能差距可以到 5 倍。",
        ],
        code: `import sys
sys.setrecursionlimit(1 << 20)

from functools import lru_cache

@lru_cache(maxsize=None)
def dp(i, j):
    if i == 0 or j == 0: return 0
    return max(dp(i-1, j), dp(i, j-1)) + 1

# 迭代版（更稳更快）
def dp_iter(n, m):
    f = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            f[i][j] = max(f[i-1][j], f[i][j-1]) + 1
    return f[n][m]`,
        lang: "Python",
        pts: [
          "`lru_cache` 只适合参数少、状态空间小的递归",
          "二维 DP 用列表推导式建表，别用 `[[0]*m]*n`",
          "记忆化递归仍可能超时，优先考虑递推",
        ],
        pit: "`sys.setrecursionlimit` 设太大 + 深递归 = 段错误，程序直接消失没有任何报错。",
      },
      {
        t: "Python 常数优化清单",
        lead: "同样的算法，Python 里写得好坏能差 3~5 倍——而这些差别都不改变复杂度。",
        body: [
          "列表推导式 > for+append；局部变量 > 全局变量（查找更快）；`sum()`/`max()` 等 C 实现函数 > 手写循环。",
          "避免在循环里做类型转换、属性查找、函数调用；把能提到循环外的都提出来。",
        ],
        code: `# 慢
r = []
for i in range(n):
    r.append(i * i)

# 快
r = [i * i for i in range(n)]

# 慢：全局查找
total = 0
def f(a):
    global total
    for x in a: total += x

# 快：内置函数 + 局部
def g(a):
    return sum(a)

# 慢：循环里重复求 len
for i in range(len(a)): pass
# 快
for i, x in enumerate(a): pass`,
        lang: "Python",
        pts: [
          "Python 一次简单循环迭代约 50~100ns，1e7 次就是 0.5~1 秒",
          "numpy 向量化能快 10~100 倍，但竞赛环境不一定有",
          "PyPy 比 CPython 快 3~5 倍，很多 OJ 提供 PyPy 选项",
        ],
        pit: "用 PyPy 时 `sys.setrecursionlimit` 行为不同，且 `lru_cache` 性能不如 CPython，测过再交。",
      },
    ],
    qa: [
      ["Python 打竞赛现实吗？", "多数 OJ 对 Python 放宽时限（2~3 倍）。算法对、常数优化到位，中等题没问题；重数据结构题建议换 C++。"],
      ["PyPy 和 CPython 怎么选？", "纯循环多的题用 PyPy；依赖 C 扩展（numpy）的用 CPython。"],
    ],
    sum: "一次读完 stdin、输出拼串、递归改递推、循环里只做必要的事。",
  },

  {
    t: "Python 与数据科学 / 爬虫入门",
    sub: "numpy · pandas 概览 · requests · 反爬常识",
    mins: 45,
    kw: "复杂度",
    goals: [
      "知道 numpy 向量化为什么快",
      "能用 pandas 做基础表格处理",
      "用 requests 抓取公开页面",
      "了解合法合规的爬虫边界",
    ],
    map: [
      ["库", "用途", "关键概念"],
      ["numpy", "数值数组", "ndarray、广播"],
      ["pandas", "表格数据", "DataFrame、Series"],
      ["requests", "HTTP 请求", "headers、session"],
      ["BeautifulSoup", "HTML 解析", "选择器"],
    ],
    mic: [
      {
        t: "numpy：把循环交给 C",
        lead: "numpy 的核心不是「提供了数组」，而是「整块数据用 C 循环处理」，比 Python 循环快几十倍。",
        body: [
          "`np.array` 创建同类型连续数组，所有运算都是逐元素向量化。`a * 2 + 1` 一行完成，无需循环。",
          "广播（broadcasting）让不同形状的数组自动对齐，这是 numpy 最强大的特性，也是最容易出意外的地方。",
        ],
        code: `import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2 + 1)          # [3 5 7 9]
print(a.sum(), a.mean(), a.max())
print(a[a > 2])           # [3 4]

m = np.arange(6).reshape(2, 3)
print(m.shape, m.T)
print(m.sum(axis=0))      # 按列求和

# 广播
col = np.array([[1], [2]])
print(m + col)`,
        lang: "Python",
        pts: [
          "numpy 数组元素类型统一，混类型会被向上转换",
          "`a[i:j]` 是视图（共享内存），改它会影响原数组",
          "`np.copy(a)` 才是真拷贝",
        ],
        pit: "切片得到的是视图不是副本，修改切片会悄悄改掉原数组——这是数据分析里最常见的数据污染来源。",
      },
      {
        t: "pandas：表格数据的瑞士军刀",
        lead: "DataFrame 就是「带行列标签的二维表」，读 CSV、筛选、分组、聚合都是一行。",
        body: [
          "`read_csv` 读表，`df[条件]` 筛选，`groupby().agg()` 分组聚合，`sort_values` 排序，`to_csv` 导出。",
          "`Series` 是一列，带索引。注意 pandas 的索引对齐机制：两个 Series 相加是按索引对齐的，不是按位置。",
        ],
        code: `import pandas as pd

df = pd.DataFrame({
    "name": ["a", "b", "c"],
    "score": [92, 85, 92],
})
print(df[df.score > 88])
print(df.groupby("score").size())
print(df.sort_values("score", ascending=False))
df["pass"] = df.score >= 60
print(df.describe())

# 读写
# df = pd.read_csv("data.csv")
# df.to_csv("out.csv", index=False)`,
        lang: "Python",
        pts: [
          "`df.loc[行, 列]` 按标签取，`df.iloc` 按位置取",
          "`inplace=True` 会原地修改，容易踩坑，建议直接赋值",
          "数据量大时用 `dtype` 指定类型可省大量内存",
        ],
        pit: "链式赋值 `df[df.a > 0][\"b\"] = 1` 可能不生效（SettingWithCopyWarning），用 `.loc` 一步完成。",
      },
      {
        t: "requests：抓取公开页面",
        lead: "抓数据先看三件事：目标是否允许、请求频率是否合理、返回的是 HTML 还是 JSON。",
        body: [
          "`requests.get(url, headers=..., timeout=...)` 是最小可用请求。很多站点会检查 `User-Agent`，不带会被直接拒绝。",
          "**合规底线**：遵守 robots.txt、不绕过登录与付费墙、不高频请求、不抓取个人隐私数据。只抓公开且允许的数据。",
        ],
        code: `import requests

headers = {"User-Agent": "Mozilla/5.0 (compatible; StudyBot/1.0)"}
r = requests.get("https://example.com/api/list",
                 headers=headers, timeout=10)
r.raise_for_status()          # 4xx/5xx 抛异常

data = r.json()               # 若是 JSON
# text = r.text               # 若是 HTML

# 会话复用（保持 cookie）
s = requests.Session()
s.headers.update(headers)

import time
time.sleep(1)                 # 控制频率，别给服务器压力`,
        lang: "Python",
        pts: [
          "永远设置 `timeout`，否则可能永久挂起",
          "`raise_for_status()` 让错误显式暴露",
          "批量抓取加 `sleep`，既是礼貌也是避免封 IP",
        ],
        pit: "抓取受版权保护或需登录的内容属于违规，也可能违法。动手前先确认目标站点的条款与 robots.txt。",
      },
      {
        t: "从脚本到可维护的小工具",
        lead: "一次性脚本和能长期用的工具，差别在于错误处理、日志、参数化。",
        body: [
          "把「硬编码路径」换成 `argparse` 参数，把 `print` 换成 `logging`，把「出错就崩」换成重试与跳过。",
          "数据清洗的经验：先看样本、再定规则、最后写代码；每步都打印统计量，异常早发现。",
        ],
        code: `import argparse, logging, json, pathlib

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

p = argparse.ArgumentParser()
p.add_argument("--input", required=True)
p.add_argument("--out", default="result.json")
args = p.parse_args()

src = pathlib.Path(args.input)
logging.info("读取 %s", src)
rows = json.loads(src.read_text(encoding="utf-8"))
ok = [r for r in rows if r.get("score") is not None]
logging.info("有效 %d / 总 %d", len(ok), len(rows))
pathlib.Path(args.out).write_text(
    json.dumps(ok, ensure_ascii=False, indent=2), encoding="utf-8")`,
        lang: "Python",
        pts: [
          "`pathlib` 比 `os.path` 更现代，路径运算更直观",
          "`logging` 能控制级别与输出位置，比 print 专业",
          "处理外部数据永远假设「字段可能缺失」",
        ],
        pit: "把密钥、token 写进脚本再上传到 Git，是最常见的安全事故。用环境变量或 .env（且不要提交）。",
      },
    ],
    qa: [
      ["numpy 为什么快？", "连续同类型内存 + C 循环 + SIMD 指令，避免了 Python 对象的逐个装箱拆箱。"],
      ["爬虫违法吗？", "抓公开数据一般可以，但绕过技术保护措施、抓个人隐私、超高频请求、违反站点条款都可能违规甚至违法。"],
    ],
    sum: "numpy 靠向量化、pandas 靠表操作、requests 靠 headers，抓数据先看合规再看频率。",
  },

  {
    t: "推导式与生成器",
    sub: "列表/字典/集合推导式 · yield · 惰性求值 · 内存",
    mins: 45,
    kw: "模拟",
    goals: [
      "用一行推导式替代 for+append",
      "理解生成器的惰性与一次性",
      "会写带 yield 的函数",
      "知道什么时候该用生成器而不是列表",
    ],
    map: [
      ["写法", "结果", "内存"],
      ["`[f(x) for x in a]`", "list", "全部加载"],
      ["`{k: v for ...}`", "dict", "全部加载"],
      ["`(f(x) for x in a)`", "generator", "惰性、一次一个"],
      ["`yield`", "generator", "惰性"],
    ],
    mic: [
      {
        t: "四种推导式",
        lead: "推导式是「用一行描述一个序列」，比 for + append 更快也更清晰。",
        body: [
          "列表 `[...]`、集合 `{...}`、字典 `{k: v ...}`、生成器 `(...)`。可以带 if 过滤，也可以嵌套。",
          "多层嵌套时，书写顺序与 for 循环一致：`[(i,j) for i in a for j in b]` 等价于两层 for。",
        ],
        code: `a = [1, 2, 3, 4]
print([x * x for x in a])                 # [1,4,9,16]
print([x for x in a if x % 2 == 0])       # [2,4]
print({x % 3 for x in a})                 # {1,2,0} 集合
print({x: x * x for x in a})              # 字典

print([(i, j) for i in range(2) for j in range(2)])
# [(0,0),(0,1),(1,0),(1,1)]

# 条件表达式
print(["偶" if x % 2 == 0 else "奇" for x in a])`,
        lang: "Python",
        pts: [
          "推导式里的变量作用域不外泄（3.x）",
          "嵌套超过两层就用普通循环，可读性更重要",
          "生成器推导式用圆括号，惰性求值",
        ],
        pit: "`[x for x in a if x % 2 == 0 else 0]` 是语法错误——`else` 只能出现在 `x if cond else y` 这个表达式位置。",
      },
      {
        t: "yield：函数可以暂停",
        lead: "普通函数 return 一次就结束；带 yield 的函数每次产出一个值就暂停，下次调用接着跑。",
        body: [
          "`yield` 让函数变成生成器。它不会一次性算出所有结果，而是「你要一个我给一个」，所以可以表示无限序列。",
          "生成器只能遍历一次：遍历完再遍历就是空的。要重复用就转成 list。",
        ],
        code: `def count_up(n):
    i = 0
    while i < n:
        yield i
        i += 1

for x in count_up(3):
    print(x, end=" ")      # 0 1 2

g = count_up(2)
print(list(g))             # [0, 1]
print(list(g))             # [] 已经耗尽

# 无限序列 + 惰性
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fib(), 8)))   # [0,1,1,2,3,5,8,13]`,
        lang: "Python",
        pts: [
          "生成器函数调用后不会立即执行，第一次 next 才开始",
          "`send()` 可向生成器传值，是协程的基础",
          "生成器比 list 省内存，但不支持下标与 len",
        ],
        pit: "对生成器用 `len()` 会 TypeError；`sum(g)` 之后再 `list(g)` 得到空列表。",
      },
      {
        t: "惰性求值的收益与代价",
        lead: "惰性意味着「用多少算多少」——处理大文件、无限序列时能省下大量内存。",
        body: [
          "读 10GB 日志时，`for line in open(f)` 是逐行惰性读，内存恒定；`f.readlines()` 会把整个文件读进内存。",
          "代价是：调试时看不到内容、不能重复遍历、异常出现的时机被推迟。",
        ],
        code: `# 惰性：内存恒定
with open("big.log", encoding="utf-8") as f:
    for line in f:
        if "ERROR" in line:
            print(line.rstrip())

# 生成器管道
def read_nums(path):
    with open(path) as f:
        for line in f:
            yield int(line)

def squares(nums):
    for n in nums:
        yield n * n

total = sum(squares(read_nums("nums.txt")))   # 不占内存
print(total)`,
        lang: "Python",
        pts: [
          "生成器管道（一个 yield 喂给下一个）是处理大数据的基本套路",
          "`itertools.islice` 可以给生成器切片",
          "`list(generator)` 会把惰性变成一次性全加载",
        ],
        pit: "生成器里引用了外部可变变量，遍历过程中该变量被改，结果会跟着变——调试时极难发现。",
      },
      {
        t: "生成器表达式与内置函数配合",
        lead: "`sum(x*x for x in a)` 比 `sum([x*x for x in a])` 省一份完整列表的内存。",
        body: [
          "`any`/`all`/`sum`/`max`/`min` 都接收可迭代对象，直接传生成器表达式即可，短路径还能提前结束（any 找到真就停）。",
          "`any(x > 100 for x in data)` 这种写法在大数据上比先建列表快得多。",
        ],
        code: `a = [3, 1, 4, 1, 5]
print(sum(x * x for x in a))          # 52
print(any(x > 4 for x in a))          # True，遇到 5 就返回
print(all(x > 0 for x in a))          # True
print(max(a, key=lambda x: -x))       # 1（key 最小者）

# 配合 zip 计算
xs, ys = [1,2,3], [4,5,6]
print(sum(x * y for x, y in zip(xs, ys)))   # 32
print(max(xs, key=lambda v: abs(v - 2)))`,
        lang: "Python",
        pts: [
          "`any`/`all` 短路，能提前结束",
          "`max/min` 的 key 参数决定比较依据",
          "嵌套生成器表达式过长时改用显式函数更可读",
        ],
        pit: "`all([])` 返回 True、`any([])` 返回 False——空集合的边界值容易搞反。",
      },
    ],
    qa: [
      ["推导式里的 if 和三元表达式怎么区分？", "`[x for x in a if 条件]` 是过滤；`[A if 条件 else B for x in a]` 是取值分支。位置不同，作用不同。"],
      ["生成器能重置吗？", "不能。需要重复遍历就每次新建，或转成 list 保存。"],
    ],
    sum: "推导式写一行、yield 写惰性、生成器只能遍历一次、any/all 会短路。",
  },

  {
    t: "装饰器与上下文管理器",
    sub: "@decorator · functools.wraps · with 协议 · contextlib",
    mins: 45,
    kw: "复杂度",
    goals: [
      "理解函数是一等对象，这是装饰器的基础",
      "写出带参数与不带参数的装饰器",
      "用 @contextmanager 简化资源管理",
      "知道装饰器的常见误用",
    ],
    map: [
      ["概念", "本质", "用途"],
      ["装饰器", "接收函数返回函数", "日志、计时、缓存、权限"],
      ["functools.wraps", "保留原函数元信息", "避免签名被覆盖"],
      ["__enter__/__exit__", "上下文协议", "with 语句"],
      ["contextmanager", "用生成器写上下文", "少写一个类"],
    ],
    mic: [
      {
        t: "函数是一等对象",
        lead: "在 Python 里函数可以赋值、可以传参、可以作为返回值——装饰器就是利用了这一点。",
        body: [
          "`f = g` 让 f 指向 g；`def outer(f): return f` 只是返回函数；`def outer(): return inner` 是闭包。",
          "理解了「函数可以作为返回值」，装饰器就只是语法糖：`@dec` 等价于 `f = dec(f)`。",
        ],
        code: `def hello(): return "hi"

f = hello
print(f())                 # hi

def make_adder(n):
    def add(x):
        return x + n
    return add

add5 = make_adder(5)
print(add5(3))             # 8

# 装饰器的展开
def dec(fn):
    def wrapper():
        print("before")
        return fn()
    return wrapper

def target(): return 1
target = dec(target)       # 等价于 @dec`,
        lang: "Python",
        pts: [
          "闭包记住外层变量（自由变量）",
          "函数有 `__name__`、`__doc__` 等属性",
          "装饰器作用在「定义时」而不是「调用时」",
        ],
        pit: "闭包捕获的是变量而不是值，在循环里创建多个闭包会全部捕获同一个最终值。",
      },
      {
        t: "写一个实用的装饰器",
        lead: "计时、重试、缓存是最常用的三个装饰器，模板几乎一样。",
        body: [
          "外层接收参数（可选），中层接收函数，内层接收参数并调用。用 `*args, **kwargs` 保证能装饰任意签名的函数。",
          "一定加 `@functools.wraps(fn)`，否则被装饰函数的 `__name__`、`__doc__` 会全变成 wrapper 的。",
        ],
        code: `import time, functools

def timer(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        r = fn(*args, **kwargs)
        print(f"{fn.__name__} {time.perf_counter()-t0:.4f}s")
        return r
    return wrapper

@timer
def work(n):
    return sum(range(n))

work(10**6)

# 带参数的装饰器（三层）
def retry(times=3):
    def dec(fn):
        @functools.wraps(fn)
        def wrapper(*a, **kw):
            for i in range(times):
                try: return fn(*a, **kw)
                except Exception:
                    if i == times - 1: raise
        return wrapper
    return dec

@retry(3)
def flaky(): ...`,
        lang: "Python",
        pts: [
          "`functools.wraps` 是必须的，不是可选项",
          "带参数的装饰器多一层嵌套，容易写错返回位置",
          "缓存用 `@lru_cache` 就够了，别手写",
        ],
        pit: "装饰器在模块导入时就执行了。在里面做耗时初始化（读文件、连数据库）会拖慢启动。",
      },
      {
        t: "上下文管理器协议",
        lead: "`with` 的本质是：进入时调用 `__enter__`，退出时调用 `__exit__`（无论是否异常）。",
        body: [
          "`__exit__` 接收 (异常类型, 异常值, traceback)，返回 True 表示「已处理，不再抛出」。用它保证资源释放。",
          "写类来实现比较啰嗦，`contextlib.contextmanager` + yield 十行内解决。",
        ],
        code: `class Timer:
    def __enter__(self):
        import time
        self.t0 = time.perf_counter()
        return self
    def __exit__(self, et, ev, tb):
        import time
        print("cost", time.perf_counter() - self.t0)
        return False        # 不吞异常

with Timer():
    sum(range(10**6))

from contextlib import contextmanager, suppress

@contextmanager
def opened(path):
    f = open(path)
    try: yield f
    finally: f.close()

with suppress(FileNotFoundError):
    open("nope.txt")      # 不报错`,
        lang: "Python",
        pts: [
          "`__exit__` 返回 False/None 时异常继续向外传播",
          "`contextlib.suppress` 可以优雅地忽略指定异常",
          "`ExitStack` 可动态管理多个资源",
        ],
        pit: "`@contextmanager` 装饰的生成器里，yield 之后的代码在异常时也会执行，但必须写在 finally 里才保证释放。",
      },
      {
        t: "常见误用与边界",
        lead: "装饰器不是万能的：它会改变调用栈、影响调试、拖慢热路径。",
        body: [
          "在性能敏感的循环里用装饰器包每一层调用，累积开销可观。装饰器适合「一次性」逻辑（初始化、日志、权限）。",
          "多个装饰器叠加时，执行顺序是「从下往上包装，从上往下执行」。",
        ],
        code: `def a(fn):
    def w(*x):
        print("a before"); r = fn(*x); print("a after"); return r
    return w

def b(fn):
    def w(*x):
        print("b before"); r = fn(*x); print("b after"); return r
    return w

@a
@b
def f(): print("f")

f()
# a before / b before / f / b after / a after`,
        lang: "Python",
        pts: [
          "@a 在最上，最后包装，最先执行",
          "装饰器会掩盖原始 traceback 的行号（有 wraps 会好一些）",
          "类装饰器可以给类添加方法，但不如继承直观",
        ],
        pit: "把「需要参数的装饰器」写成两层而不是三层，会报 `TypeError: 'function' object is not callable`，非常迷惑。",
      },
    ],
    qa: [
      ["装饰器和继承怎么选？", "装饰器适合横向的通用逻辑（日志、缓存）；继承适合纵向的类型层次。"],
      ["为什么 wraps 这么重要？", "它把原函数的 __name__/__doc__/__wrapped__ 复制到 wrapper，调试、文档生成、框架反射都依赖这些信息。"],
    ],
    sum: "装饰器 = 函数套函数，带参数就三层，wraps 必加；with 的本质是 enter/exit。",
  },

  {
    t: "迭代器协议与 itertools",
    sub: "__iter__/__next__ · 六大工具 · 组合与累积 · 无限序列",
    mins: 45,
    kw: "模拟",
    goals: [
      "理解 for 循环背后的迭代器协议",
      "写出自己的可迭代类",
      "熟练使用 itertools 的组合工具",
      "用无限迭代器 + islice 表达生成逻辑",
    ],
    map: [
      ["工具", "作用", "典型场景"],
      ["count/cycle/repeat", "无限序列", "循环填充"],
      ["chain", "拼接多个可迭代", "合并数据源"],
      ["groupby", "按 key 分组（需先排序）", "统计连续段"],
      ["product/permutations/combinations", "组合枚举", "暴力搜索"],
    ],
    mic: [
      {
        t: "for 循环到底做了什么",
        lead: "`for x in obj` 会先调 `iter(obj)` 拿迭代器，再反复 `next()` 直到 StopIteration。",
        body: [
          "可迭代对象实现 `__iter__`（返回迭代器），迭代器实现 `__next__`（返回下一个值或抛 StopIteration）。",
          "自己写类时实现这两个方法，就能被 for、sum、list 等所有内置工具消费。",
        ],
        code: `class Range3:
    def __init__(self, n): self.n = n
    def __iter__(self):
        for i in range(self.n):
            yield i

for x in Range3(3): print(x, end=" ")   # 0 1 2

# 手动驱动迭代器
it = iter([10, 20])
print(next(it))     # 10
print(next(it))     # 20
print(next(it, "end"))   # end，不抛异常

print(sum(Range3(4)))    # 0+1+2+3 = 6`,
        lang: "Python",
        pts: [
          "迭代器是「一次性的游标」，可迭代对象可以反复产生新迭代器",
          "`next(it, 默认值)` 避免 StopIteration",
          "生成器函数自动实现了这两个方法",
        ],
        pit: "对象同时是「可迭代」和「迭代器」（`__iter__` 返回 self）时，只能遍历一次。",
      },
      {
        t: "itertools 组合工具",
        lead: "排列、组合、笛卡尔积、去重排列——这四个是暴力枚举题的常客。",
        body: [
          "`permutations(a, r)` 有序选 r 个；`combinations(a, r)` 无序；`combinations_with_replacement` 可重复；`product(a, repeat=2)` 笛卡尔积。",
          "结果是 tuple，需要列表就 `list()`。数量巨大时别一次性 list 化，会爆内存。",
        ],
        code: `from itertools import (permutations, combinations,
                        combinations_with_replacement, product)

print(list(permutations("ab")))          # [('a','b'),('b','a')]
print(list(combinations("abc", 2)))      # [('a','b'),('a','c'),('b','c')]
print(list(combinations_with_replacement("ab", 2)))
print(list(product([0,1], repeat=2)))    # [(0,0),(0,1),(1,0),(1,1)]

# 枚举所有子集
a = [1, 2, 3]
for r in range(len(a) + 1):
    for c in combinations(a, r):
        pass`,
        lang: "Python",
        pts: [
          "`combinations` 保持原顺序，不会重复",
          "`product` 是最通用的多重循环替代",
          "`itertools.permutations` 与 `next_permutation` 类似但更慢",
        ],
        pit: "`permutations` 生成 n! 个结果，n = 10 就是 362 万，直接 list 化会吃掉大量内存。",
      },
      {
        t: "流式处理：chain、groupby、accumulate",
        lead: "这些工具让「多段数据合并」「按段统计」「前缀和」变成一行，而且全程惰性。",
        body: [
          "`chain(a, b)` 把多个可迭代串起来；`groupby` 只能合并**相邻**的同 key 元素，所以必须先排序；`accumulate` 就是前缀和。",
          "`islice` 给任意迭代器切片，是处理无限序列的唯一办法。",
        ],
        code: `from itertools import chain, groupby, accumulate, islice, count

print(list(chain([1,2], [3], "ab")))     # [1,2,3,'a','b']

data = [("a",1),("a",2),("b",3)]
for k, g in groupby(data, key=lambda x: x[0]):
    print(k, list(g))

print(list(accumulate([1,2,3,4])))       # [1,3,6,10]
print(list(accumulate([1,2,3], max)))    # 前缀最大

print(list(islice(count(5), 3)))         # [5,6,7]`,
        lang: "Python",
        pts: [
          "`groupby` 不排序就分组，会把相同 key 拆成多段",
          "`accumulate` 的第二个参数可以是任意二元函数",
          "`islice(it, start, stop, step)` 支持完整切片语义",
        ],
        pit: "`groupby` 返回的 group 是迭代器，循环结束后就失效——要保存必须 `list(g)`。",
      },
      {
        t: "把迭代器组合成数据管道",
        lead: "真实的数据处理就是「读 → 过滤 → 转换 → 聚合」，每一段都可以是生成器。",
        body: [
          "每段只做一件事，用 yield 连接。这样内存恒定、逻辑清晰、任意一段都能单独测试。",
          "这套写法和 Unix 管道思想一致，处理 GB 级文件也不会爆内存。",
        ],
        code: `def lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip()

def nonEmpty(seq):
    for s in seq:
        if s: yield s

def toPair(seq):
    for s in seq:
        k, _, v = s.partition(",")
        yield k, int(v)

def total(seq):
    from collections import defaultdict
    agg = defaultdict(int)
    for k, v in seq: agg[k] += v
    return dict(agg)

# 管道
# print(total(toPair(nonEmpty(lines("data.csv")))))`,
        lang: "Python",
        pts: [
          "生成器管道是惰性的，只有在最后聚合时才真正执行",
          "每段职责单一，便于复用与测试",
          "`with open` 写在最内层生成器里，保证文件及时关闭",
        ],
        pit: "生成器管道里抛异常，traceback 会横跨多层 yield，定位时从最后一行往上找实际出错点。",
      },
    ],
    qa: [
      ["可迭代对象和迭代器的区别？", "可迭代对象实现 `__iter__`（可反复产生迭代器）；迭代器还实现 `__next__`（一次性游标）。"],
      ["为什么 groupby 要求先排序？", "它只比较相邻元素，不排序时相同 key 会被拆成多组。"],
    ],
    sum: "for 背后是 iter/next，组合枚举用 itertools，流式处理用生成器管道。",
  },
];
