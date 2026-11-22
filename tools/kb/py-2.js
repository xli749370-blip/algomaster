// Python 第 6-10 章 · 每章 4 节微课
module.exports = [
  {
    t: "控制流与循环",
    sub: "if/elif/else · for/while · enumerate/zip · 循环技巧",
    mins: 45,
    kw: "模拟",
    goals: [
      "写出符合 Python 风格的 branch 与循环",
      "熟练用 range / enumerate / zip 组合遍历",
      "会用 for-else 与 break 处理「找到就停」",
      "避开修改容器导致的下标错乱",
    ],
    map: [
      ["结构", "写法", "典型场景"],
      ["多分支", "`if/elif/else`", "区间判断"],
      ["计数循环", "`for i in range(n)`", "下标遍历"],
      ["带下标", "`enumerate(a)`", "同时要 i 和值"],
      ["并行遍历", "`zip(a, b)`", "两组数据配对"],
    ],
    mic: [
      {
        t: "if/elif/else 与条件表达式",
        lead: "Python 用缩进划分代码块，`elif` 就是 else if，条件从上往下第一个成立的执行。",
        body: [
          "条件表达式 `x if cond else y` 可以内联取值，比写四行 if 赋值清爽。链式比较 `0 < x < 10` 是 Python 特有的写法，等价于 `0 < x and x < 10`。",
          "真值判断直接用对象本身：`if arr:`、`if not s:`，比 `len(arr) > 0` 更 Pythonic。",
        ],
        code: `score = 85
if score >= 90: grade = "A"
elif score >= 80: grade = "B"
else: grade = "C"

level = "高" if score >= 80 else "低"

x = 5
print(0 < x < 10)          # True，链式比较
print(1 < x > 3)           # False，等价于 1<x and x>3

if arr:                    # 非空即真
    pass`,
        lang: "Python",
        pts: [
          "`elif` 是 else if 的缩写，没有 `elseif` 关键字",
          "Python 没有 `switch`（3.10 起有 `match`）",
          "条件里不要写 `x == True`，直接 `if x:`",
        ],
        pit: "`if x = 1` 是语法错误（赋值不是表达式），这一点比 C++ 安全，但 `if 0 < x < 10` 之外的链式比较要小心语义。",
      },
      {
        t: "for 与 range 的三种写法",
        lead: "Python 的 for 是「遍历可迭代对象」，不是 C 那种「初始化-判断-自增」。",
        body: [
          "`range(n)` 生成 0~n-1，`range(a, b)` 左闭右开，`range(a, b, step)` 支持步长与倒序（step 为负）。",
          "要同时拿下标和值用 `enumerate`，要从 1 开始就 `enumerate(a, 1)`。要并行遍历两个序列用 `zip`（以短的为准）。",
        ],
        code: `for i in range(5): print(i, end=" ")      # 0 1 2 3 4
print()
for i in range(2, 6): print(i, end=" ")    # 2 3 4 5
print()
for i in range(10, 0, -3): print(i, end=" ")  # 10 7 4 1
print()

a = ["x", "y"]
for i, v in enumerate(a, 1):
    print(i, v)                             # 1 x / 2 y

for p, q in zip([1,2,3], ["a","b"]):
    print(p, q)                             # 1 a / 2 b（短的结束）`,
        lang: "Python",
        pts: [
          "`range` 是惰性对象，不占内存，`list(range(1e6))` 才占",
          "`zip` 会截断到最短序列，需要补齐用 `itertools.zip_longest`",
          "倒序遍历 `reversed(a)` 或 `range(len(a)-1, -1, -1)`",
        ],
        pit: "`range(5, 0)` 是空序列——步长默认 +1，倒着走必须写 `-1`。",
      },
      {
        t: "while、break、continue 与 for-else",
        lead: "`for-else` 的 else 在「循环正常结束」时执行，用来判断「没找到」。",
        body: [
          "`break` 跳出当前循环，`continue` 跳过本次。Python 独有的 `for...else`：循环没有被 break 打断时执行 else，非常适合「找质因数/找答案」的写法。",
          "`while True` 配合 break 是读不定长输入的常用模式。",
        ],
        code: `n = 12
for i in range(2, n):
    if n % i == 0:
        print("不是质数", i)
        break
else:
    print("是质数")          # 没有 break 才执行

total = 0
i = 0
while i < 5:
    i += 1
    if i == 3: continue
    total += i
print(total)                # 1+2+4+5 = 12`,
        lang: "Python",
        pts: [
          "`while` 的循环变量必须手动更新，否则死循环",
          "`else` 与 `for` 同级缩进，不是与 if 同级",
          "需要「跳出两层」时把内层封装成函数用 return",
        ],
        pit: "`for...else` 里的 else 很容易被误读成「否则」，实际含义是「循环完整跑完」。",
      },
      {
        t: "循环中的容器修改与性能",
        lead: "边遍历边删除会跳过元素，这是所有语言的通病，Python 里尤其隐蔽。",
        body: [
          "正确做法：遍历副本 `for x in a[:]`，或倒序遍历删除，或用列表推导式生成新列表。",
          "循环内的字符串拼接、重复 `in list` 判断都是 O(n²) 的隐形炸弹，提前换成 join / set。",
        ],
        code: `a = [1, 2, 3, 4, 5]

# 错误：会跳过元素
for x in a:
    if x % 2 == 0: a.remove(x)
print(a)                  # [1,3,5] 侥幸对了，但换数据就错

# 正确：推导式生成新列表
a = [x for x in a if x % 2]

# 倒序删除
for i in range(len(a) - 1, -1, -1):
    if a[i] > 3: del a[i]

# 循环里累加字符串（慢）
s = ""
for c in "abcdef": s += c        # O(n^2)
s = "".join("abcdef")            # O(n)`,
        lang: "Python",
        pts: [
          "列表推导式通常比 for+append 快 1.5~2 倍",
          "循环里避免重复计算 `len(a)`、避免 `x in list`",
          "需要索引又需要值时用 enumerate，别用 `range(len(a))`",
        ],
        pit: "`for x in a: a.remove(x)` 这类代码在特定数据下「看起来是对的」，换个用例就出错，属于最难查的 bug。",
      },
    ],
    qa: [
      ["Python 的 for 和 C 的 for 本质区别？", "Python 的 for 是迭代器协议驱动，遍历任何可迭代对象；C 的 for 是计数循环。"],
      ["为什么推导式比 for 快？", "推导式在 C 层执行循环，省掉了解释器逐条指令的开销。"],
    ],
    sum: "要下标用 enumerate、要配对用 zip、找答案用 for-else、改容器用推导式。",
  },

  {
    t: "函数与作用域",
    sub: "定义 · 默认参数 · *args/**kwargs · lambda · 闭包",
    mins: 50,
    kw: "递归",
    goals: [
      "定义带默认值、可变参数的函数",
      "理解 LEGB 作用域与 global/nonlocal",
      "避开可变默认参数这个经典坑",
      "会写 lambda 与简单闭包",
    ],
    map: [
      ["概念", "含义", "注意"],
      ["位置参数", "按顺序传", "最常用"],
      ["关键字参数", "`f(x=1)`", "顺序无关"],
      ["默认参数", "`def f(a=0)`", "别用可变对象"],
      ["可变参数", "`*args/**kwargs`", "打包成 tuple/dict"],
    ],
    mic: [
      {
        t: "参数的五种形态",
        lead: "Python 的参数机制非常灵活：位置、关键字、默认值、可变、仅关键字，全都支持。",
        body: [
          "`*args` 把多余位置参数收成 tuple，`**kwargs` 把多余关键字参数收成 dict。定义时是「打包」，调用时是「解包」。",
          "`def f(a, *, b)` 中的 `*` 表示 b 只能用关键字传，能防止调用顺序错误。",
        ],
        code: `def f(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)

f(1)                       # 1 2 () {}
f(1, 3, 4, 5, k=6)         # 1 3 (4,5) {'k': 6}

def g(a, *, b):
    return a + b
g(1, b=2)                  # 必须写 b=2

# 解包调用
nums = [1, 2]
def add(x, y): return x + y
print(add(*nums))          # 3`,
        lang: "Python",
        pts: [
          "默认参数必须放在位置参数之后",
          "`*args` 接收的是 tuple，不能修改",
          "用 `**d` 可以把字典展开成关键字参数",
        ],
        pit: "**默认参数只在定义时求值一次**。`def f(a=[])` 会共享同一个列表，多次调用互相污染。",
      },
      {
        t: "LEGB 作用域与 global/nonlocal",
        lead: "找变量按 Local → Enclosing → Global → Builtin 的顺序，函数内部赋值会创建新的局部变量。",
        body: [
          "函数里 `x = 1` 会创建一个局部 x，不会改全局的 x。要改全局必须 `global x`；要改外层函数的变量用 `nonlocal x`。",
          "只读全局变量不需要声明，只有「赋值」才需要。",
        ],
        code: `count = 0
def inc():
    global count
    count += 1

inc(); inc()
print(count)         # 2

def outer():
    n = 0
    def inner():
        nonlocal n
        n += 1
        return n
    return inner

f = outer()
print(f(), f())      # 1 2`,
        lang: "Python",
        pts: [
          "`global` 用于模块级变量，`nonlocal` 用于外层函数变量",
          "滥用 global 会让状态难以追踪，优先用返回值或类",
          "内置名字（如 `list`、`sum`）被局部变量遮蔽后会报奇怪的错",
        ],
        pit: "函数里既读又写同名全局变量时，不写 global 会 UnboundLocalError——因为赋值让 Python 判定它是局部变量。",
      },
      {
        t: "lambda 与高阶函数",
        lead: "lambda 是「只有一行的匿名函数」，专门用于传给 sort/map/filter 这类高阶函数。",
        body: [
          "`lambda x: x * 2` 等价于 `def f(x): return x * 2`。它只能写一个表达式，不能有语句。",
          "`map`/`filter` 返回惰性对象，要 `list()` 才看到结果；列表推导式通常更快更可读。`functools.reduce` 做累积。",
        ],
        code: `sq = lambda x: x * x
print(sq(5))                       # 25

a = [(1, "b"), (2, "a")]
a.sort(key=lambda p: p[1])         # 按第二项

nums = [1, 2, 3, 4]
print(list(map(lambda x: x * 2, nums)))        # [2,4,6,8]
print(list(filter(lambda x: x % 2 == 0, nums))) # [2,4]
print([x * 2 for x in nums])                   # 推导式更好读

from functools import reduce
print(reduce(lambda acc, x: acc + x, nums, 0))  # 10`,
        lang: "Python",
        pts: [
          "lambda 不能包含赋值语句或 return",
          "`key=lambda` 是最常见的用法，能省一个 def",
          "推导式比 map+lambda 快，且更好读",
        ],
        pit: "`lambda x: x.append(1)` 返回 None，用它做 key 会导致排序结果完全错误。",
      },
      {
        t: "递归与记忆化",
        lead: "Python 递归默认上限约 1000 层，超了直接 RecursionError——这是它和 C++ 的重要差别。",
        body: [
          "`sys.setrecursionlimit(10**6)` 能提高上限，但真正的栈深度仍受内存限制，深搜建议改迭代。",
          "`functools.lru_cache` 一行搞定记忆化，比手写 dict 缓存更省事。",
        ],
        code: `import sys
sys.setrecursionlimit(300000)

def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)

from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(100))        # 354224848179261915075
print(fib.cache_info())`,
        lang: "Python",
        pts: [
          "`lru_cache` 的参数必须可哈希",
          "递归深度 1e5 以上，即使调高上限也可能段错误",
          "尾递归 Python 不会优化，深递归改写成循环",
        ],
        pit: "开了 lru_cache 的递归函数在多次调用间共享缓存，如果输入依赖全局状态，会返回错误结果。",
      },
    ],
    qa: [
      ["为什么默认参数不能用列表？", "默认值在函数定义时只创建一次，所有调用共享同一个对象，会累积相互影响。用 None 作默认值再在函数内创建。"],
      ["lambda 能有多个返回值吗？", "不能直接返回多个，但可以返回 tuple：`lambda x: (x, x*2)`。"],
    ],
    sum: "默认可变参数用 None、改全局要 global、递归太深改迭代、记忆化用 lru_cache。",
  },

  {
    t: "面向对象基础",
    sub: "class · __init__ · 继承 · 魔法方法 · 属性",
    mins: 50,
    kw: "模拟",
    goals: [
      "定义类、实例属性与类属性",
      "理解 self 与 __init__ 的作用",
      "会用继承与 super() 复用代码",
      "掌握 __str__/__repr__/__eq__ 等魔法方法",
    ],
    map: [
      ["概念", "写法", "说明"],
      ["实例方法", "`def f(self)`", "第一个参数是实例"],
      ["类方法", "`@classmethod`", "第一个参数是类"],
      ["静态方法", "`@staticmethod`", "没有自动参数"],
      ["属性", "`@property`", "像字段一样访问的方法"],
    ],
    mic: [
      {
        t: "class、__init__ 与 self",
        lead: "`self` 就是「当前实例」，Python 必须显式写出来，这是它与 Java/C++ 最大的语法差异。",
        body: [
          "`__init__` 是初始化方法（不是构造函数，对象已创建）。它负责给实例挂属性。类属性属于类本身，所有实例共享。",
          "`self.x = x` 创建实例属性；直接在类体里写 `x = 0` 是类属性，修改它会影响所有未覆盖该属性的实例。",
        ],
        code: `class Point:
    dim = 2                    # 类属性，共享

    def __init__(self, x=0, y=0):
        self.x = x             # 实例属性
        self.y = y

    def dist2(self):
        return self.x ** 2 + self.y ** 2

p = Point(3, 4)
print(p.dist2(), p.dim, Point.dim)

q = Point()
q.dim = 3                      # 只改 q 自己的
print(Point.dim, q.dim)        # 2 3`,
        lang: "Python",
        pts: [
          "`self` 不是关键字，只是约定俗成的名字，但别改",
          "实例属性优先于类属性，赋值时创建实例属性",
          "`__init__` 不应返回任何值",
        ],
        pit: "把可变对象写成类属性（如 `items = []`），所有实例会共享同一个列表——和默认参数是同一个坑。",
      },
      {
        t: "继承、super 与多态",
        lead: "子类继承父类的方法，`super()` 调用父类实现，方法同名即覆盖（多态）。",
        body: [
          "Python 支持多继承，方法解析顺序是 MRO（C3 线性化），`Cls.__mro__` 可以查看。日常用单继承就够。",
          "`isinstance(x, Base)` 判断类型（含子类），`type(x) is Base` 判断精确类型。",
        ],
        code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."
    def __str__(self):
        return f"<{self.name}>"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)     # 调父类构造
        self.breed = breed
    def speak(self):
        return "Woof"

a = Animal("x"); d = Dog("d", "corgi")
print(d.speak(), isinstance(d, Animal), str(d))
print(Dog.__mro__)`,
        lang: "Python",
        pts: [
          "`super().__init__(...)` 是调用父类构造的标准写法",
          "子类方法完全覆盖父类，需要时显式调 `super().method()`",
          "Python 没有真正的私有，`_x` 是约定，`__x` 会名字改编",
        ],
        pit: "忘写 `super().__init__()` 会让父类属性缺失，报错位置在很远的地方（AttributeError）。",
      },
      {
        t: "魔法方法：让对象支持内置语法",
        lead: "实现 `__len__` 就能 `len(obj)`，实现 `__getitem__` 就能 `obj[i]`——这叫协议驱动。",
        body: [
          "最常用的几个：`__str__`（print 显示）、`__repr__`（调试显示）、`__eq__`（==）、`__lt__`（排序）、`__len__`、`__getitem__`、`__iter__`。",
          "实现了 `__eq__` 就要考虑 `__hash__`，否则对象变成不可哈希，不能放进 set。",
        ],
        code: `class Vec:
    def __init__(self, x, y): self.x, self.y = x, y
    def __repr__(self):  return f"Vec({self.x},{self.y})"
    def __eq__(self, o): return (self.x, self.y) == (o.x, o.y)
    def __lt__(self, o): return (self.x, self.y) < (o.x, o.y)
    def __add__(self, o): return Vec(self.x + o.x, self.y + o.y)
    def __len__(self): return 2
    def __getitem__(self, i): return (self.x, self.y)[i]

v = Vec(1, 2)
print(v + Vec(3, 4), len(v), v[1])
print(sorted([Vec(2,1), Vec(1,2)]))`,
        lang: "Python",
        pts: [
          "`__repr__` 面向开发者，`__str__` 面向用户，没定义 str 时用 repr",
          "重载 `__lt__` 之后 `sorted` 才能用",
          "`__slots__` 可限制属性、省内存（大量小对象时有用）",
        ],
        pit: "只实现 `__eq__` 不实现 `__hash__`，对象会变成 unhashable，放进 dict/set 直接报错。",
      },
      {
        t: "property、类方法与静态方法",
        lead: "`@property` 把方法伪装成属性，既能做校验又能保持 `obj.x` 的简洁访问。",
        body: [
          "`@property` 定义读，`@x.setter` 定义写。适合「取值需要计算」或「赋值需要校验」的场景。",
          "`@classmethod` 第一个参数是 cls，常用作替代构造函数；`@staticmethod` 就是不访问实例也不访问类的普通函数，放在类里只为组织。",
        ],
        code: `class Circle:
    def __init__(self, r): self._r = r

    @property
    def area(self):
        return 3.14159 * self._r ** 2

    @property
    def r(self): return self._r

    @r.setter
    def r(self, v):
        if v < 0: raise ValueError("半径不能为负")
        self._r = v

    @classmethod
    def unit(cls): return cls(1)

    @staticmethod
    def describe(): return "圆"

c = Circle(2)
print(c.area, c.r)
c.r = 3
print(Circle.unit().r, Circle.describe())`,
        lang: "Python",
        pts: [
          "`@property` 之后 `c.area` 不需要加括号",
          "setter 里做校验是它最大的价值",
          "类方法常用于「从其他格式构造实例」：`from_dict`、`parse`",
        ],
        pit: "property 名字不能与实例属性同名，否则 setter 里 `self.x = v` 会无限递归。",
      },
    ],
    qa: [
      ["Python 的私有成员怎么实现？", "没有强制私有。`_x` 是约定（不要外部访问），`__x` 会被改名成 `_类名__x`，起到弱保护作用。"],
      ["什么时候用类，什么时候用函数？", "需要维护状态、多个函数共享数据、要实现协议（len/iter）时用类；纯数据转换用函数。"],
    ],
    sum: "self 必须写、构造调 super、魔法方法开语法、property 做校验。",
  },

  {
    t: "模块、包与常用标准库",
    sub: "import 机制 · math/collections/heapq · itertools · bisect",
    mins: 50,
    kw: "二分",
    goals: [
      "理解 import 的几种写法与差异",
      "熟练使用 collections 的四个工具",
      "用 heapq 实现堆与优先队列",
      "用 bisect 做二分查找",
    ],
    map: [
      ["模块", "关键 API", "用途"],
      ["collections", "Counter/defaultdict/deque", "计数、分组、双端队列"],
      ["heapq", "heappush/heappop/heapify", "小根堆"],
      ["bisect", "bisect_left/right/insort", "有序数组二分"],
      ["itertools", "permutations/combinations", "排列组合"],
    ],
    mic: [
      {
        t: "import 的四种写法",
        lead: "`import` 是把模块对象绑定到名字上，谁绑定谁就决定了你怎么访问。",
        body: [
          "`import math` → `math.sqrt`；`from math import sqrt` → 直接 `sqrt`；`import numpy as np` → 别名；`from math import *` → 污染命名空间，别用。",
          "模块只会被执行一次（首次导入时），后续导入直接用缓存。所以模块级的初始化代码只跑一次。",
        ],
        code: `import math
print(math.sqrt(9))

from math import sqrt, pi
print(sqrt(9), pi)

import numpy as np            # 第三方
import os.path as p

# 条件导入 / 别名冲突时
try:
    import ujson as json
except ImportError:
    import json`,
        lang: "Python",
        pts: [
          "`from x import *` 会覆盖同名变量，禁止在项目中使用",
          "模块名不要和标准库重名（如 json.py、random.py）",
          "`if __name__ == \"__main__\":` 保护脚本入口",
        ],
        pit: "循环导入（a 导入 b，b 又导入 a）会导致 ImportError 或拿到半初始化的模块，用延迟导入或重构拆分解决。",
      },
      {
        t: "collections 四件套",
        lead: "Counter 管计数、defaultdict 管分组、deque 管双端队列、namedtuple 管可读的结构。",
        body: [
          "`deque` 的 `appendleft`/`popleft` 是 O(1)，而 list 的 `insert(0)` 是 O(n)——BFS 与滑动窗口必须用 deque。",
          "`Counter` 支持 `+ - & |`，`elements()` 展开，`most_common(n)` 取前 n。",
        ],
        code: `from collections import Counter, defaultdict, deque, namedtuple

c = Counter("hello")
print(c.most_common(2))        # [('l',2),('h',1)]

g = defaultdict(list)
for w in ["apple", "avocado", "banana"]:
    g[w[0]].append(w)

dq = deque([1, 2, 3], maxlen=3)
dq.appendleft(0)
dq.append(9)                    # 超过 maxlen 会挤掉左边
print(dq)                       # deque([0,1,2], maxlen=3)

Point = namedtuple("Point", "x y")
p = Point(1, 2)
print(p.x, p.y, p[0])`,
        lang: "Python",
        pts: [
          "`deque(maxlen=n)` 天然就是滑动窗口",
          "`Counter` 缺键返回 0，不会 KeyError",
          "`namedtuple` 比普通 tuple 可读，比 dataclass 轻",
        ],
        pit: "`deque` 随机访问 `dq[i]` 是 O(n)，需要频繁随机访问就用 list。",
      },
      {
        t: "heapq：只有小根堆",
        lead: "Python 的 heapq 只提供小根堆，要最大堆就把值取负存进去。",
        body: [
          "`heappush`/`heappop` 是 O(log n)，`heapify` 是 O(n)，`heap[0]` 取最小值 O(1)。",
          "要存「(优先级, 数据)」时用 tuple，heapq 按 tuple 字典序比较——数据部分必须可比较，否则用计数器占位。",
        ],
        code: `import heapq

h = []
heapq.heappush(h, 3)
heapq.heappush(h, 1)
print(heapq.heappop(h))        # 1

nums = [5, 1, 4]
heapq.heapify(nums)            # 原地变堆，O(n)
print(nums[0])                 # 1

# 最大堆：存负数
mx = []
for x in [3, 9, 1]:
    heapq.heappush(mx, -x)
print(-heapq.heappop(mx))      # 9

# 前 k 大
print(heapq.nlargest(2, [3,9,1]))   # [9,3]`,
        lang: "Python",
        pts: [
          "`heappop` 只能弹出最小值，取其他元素要自己实现",
          "Dijkstra 里的优先队列用 `(dist, node)` 元组",
          "`nlargest/nsmallest` 在 k 远小于 n 时比完整排序快",
        ],
        pit: "对普通 list 直接 `heappop` 前必须先 `heapify`，否则结果错误——heapq 不会自动维护。",
      },
      {
        t: "bisect 与 itertools 速用",
        lead: "`bisect` 是「Python 版 lower_bound」，`itertools` 是「一行枚举排列组合」。",
        body: [
          "`bisect_left(a, x)` 返回第一个 ≥ x 的位置，`bisect_right` 返回第一个 > x 的位置。配合 `insort` 可以维护有序列表（但插入是 O(n)）。",
          "`permutations` 全排列、`combinations` 组合、`product` 笛卡尔积、`accumulate` 前缀和。",
        ],
        code: `import bisect
from itertools import permutations, combinations, product, accumulate

a = [1, 3, 3, 5]
print(bisect.bisect_left(a, 3))    # 1
print(bisect.bisect_right(a, 3))   # 3
bisect.insort(a, 4)                # 插入并保持有序
print(a)

print(list(permutations([1,2,3], 2)))
print(list(combinations([1,2,3], 2)))
print(list(product([0,1], repeat=2)))
print(list(accumulate([1,2,3,4])))  # [1,3,6,10]`,
        lang: "Python",
        pts: [
          "`bisect_left` 等价于 C++ 的 `lower_bound`",
          "`permutations` 生成的是 tuple，需要时转 list",
          "`accumulate` 加 `max` 参数可做前缀最值",
        ],
        pit: "`bisect` 要求列表**已排序**，未排序时不会报错，但返回的位置毫无意义。",
      },
    ],
    qa: [
      ["deque 和 list 怎么选？", "需要两端操作（BFS、滑动窗口）用 deque；需要随机访问与切片用 list。"],
      ["heapq 能删除任意元素吗？", "不能直接删。常用「懒删除」：弹出时检查是否已失效，失效就跳过。"],
    ],
    sum: "计数 Counter、分组 defaultdict、队列 deque、堆 heapq、二分 bisect，这五个够用八成题。",
  },

  {
    t: "异常处理与文件操作",
    sub: "try/except · 自定义异常 · with open · JSON/CSV",
    mins: 45,
    kw: "字符串",
    goals: [
      "用 try/except 精准捕获异常而不是一把抓",
      "理解 finally 与上下文管理器的执行顺序",
      "正确读写文本与二进制文件",
      "会处理 JSON 与 CSV 数据",
    ],
    map: [
      ["结构", "作用", "执行顺序"],
      ["try", "可能出错的代码", "先执行"],
      ["except", "捕获指定异常", "出错时执行"],
      ["else", "没出错时执行", "try 成功后"],
      ["finally", "无论如何都执行", "最后"],
    ],
    mic: [
      {
        t: "try/except 的正确姿势",
        lead: "`except:` 一把抓会连 Ctrl+C 都吞掉，必须指定具体的异常类型。",
        body: [
          "常见异常：`ValueError`（值不合法）、`TypeError`（类型不对）、`KeyError`、`IndexError`、`ZeroDivisionError`、`FileNotFoundError`。",
          "`except (A, B) as e:` 可以一次捕多种。`else` 在 try 成功时执行，`finally` 无条件执行——常用于释放资源。",
        ],
        code: `try:
    n = int(input())
    print(10 / n)
except ValueError:
    print("不是整数")
except ZeroDivisionError as e:
    print("除零", e)
except (KeyError, IndexError):
    print("索引/键问题")
else:
    print("一切正常")
finally:
    print("收尾，一定执行")

# 主动抛出
def check(x):
    if x < 0: raise ValueError(f"x 不能为负: {x}")`,
        lang: "Python",
        pts: [
          "捕获异常后要么处理，要么 `raise` 重新抛出，别默默吞掉",
          "`except Exception as e` 能兜底，但会掩盖真正的 bug",
          "`raise ... from e` 保留原始异常链",
        ],
        pit: "在循环里用 try/except 包住整个循环体，出错后继续下一轮，会让状态不一致且极难排查。",
      },
      {
        t: "上下文管理器与 with",
        lead: "`with open(...)` 保证文件一定被关闭，即使中间抛异常——这是它存在的唯一理由。",
        body: [
          "`with` 会调用对象的 `__enter__` 与 `__exit__`，`__exit__` 无论是否异常都会执行。文件、锁、数据库连接都该这么用。",
          "自己写可以用 `contextlib.contextmanager` 装饰器 + yield，几行搞定。",
        ],
        code: `with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:                 # 逐行读，不占内存
        print(line.rstrip())

# 自定义
from contextlib import contextmanager
import time

@contextmanager
def timer(name):
    t0 = time.perf_counter()
    yield
    print(f"{name} 用时 {time.perf_counter() - t0:.3f}s")

with timer("计算"):
    sum(range(10**6))`,
        lang: "Python",
        pts: [
          "永远指定 `encoding='utf-8'`，否则在 Windows 上会乱码",
          "`with open(a) as f1, open(b) as f2:` 可以并列多个",
          "`f.readlines()` 一次性读入，大文件用逐行迭代",
        ],
        pit: "不写 encoding 会用系统默认编码（Windows 是 GBK），读 UTF-8 文件直接 UnicodeDecodeError。",
      },
      {
        t: "文件读写模式与二进制",
        lead: "`r/w/a/x` 四种模式 + `b` 表示二进制 + `+` 表示可读写，组合起来就够用了。",
        body: [
          "`w` 会**清空**原文件，`a` 追加，`x` 只在文件不存在时创建。读写二进制用 `rb/wb`，处理图片、压缩包必须用它。",
          "`f.write` 写入的是字符串（文本模式）或 bytes（二进制模式），别混。",
        ],
        code: `# 写文本
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("line1\\n")
    print("line2", file=f)

# 追加
with open("out.txt", "a", encoding="utf-8") as f:
    f.write("line3\\n")

# 读全部
with open("out.txt", encoding="utf-8") as f:
    text = f.read()

# 二进制
with open("a.png", "rb") as f:
    data = f.read()
with open("b.png", "wb") as f:
    f.write(data)

import os, json
print(os.path.exists("out.txt"), os.path.getsize("out.txt"))`,
        lang: "Python",
        pts: [
          "`w` 模式一打开就清空文件，写之前确认路径没错",
          "`json.dump/load` 处理文件，`dumps/loads` 处理字符串",
          "`os.path.join` 拼路径，别手写斜杠",
        ],
        pit: "用 `w` 打开一个已有文件，即使写完就崩了，原内容也已经没了——重要数据先写临时文件再替换。",
      },
      {
        t: "JSON 与 CSV 处理",
        lead: "JSON 是嵌套结构（dict/list），CSV 是表格——两者用途完全不同，别混。",
        body: [
          "`json.dumps(obj, ensure_ascii=False, indent=2)` 输出可读中文；`json.loads` 解析字符串。注意 JSON 的 key 永远是字符串。",
          "CSV 用 `csv.DictReader` 按列名读，`csv.writer` 写。含逗号或换行的字段必须由 csv 模块负责转义。",
        ],
        code: `import json, csv

data = {"name": "算法", "tags": ["dp", "图论"], "n": 3}
s = json.dumps(data, ensure_ascii=False, indent=2)
print(s)
print(json.loads(s)["tags"])

with open("d.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)

with open("t.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "score"])
    w.writerow([1, 92])

with open("t.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["id"], row["score"])`,
        lang: "Python",
        pts: [
          "`ensure_ascii=False` 才能输出中文而不是 \\uXXXX",
          "CSV 写入时加 `newline=\"\"`，否则 Windows 会多空行",
          "JSON 不支持 tuple/set，序列化前要转成 list",
        ],
        pit: "`json.dumps` 一个含 set 的对象会 TypeError: Object of type set is not JSON serializable。",
      },
    ],
    qa: [
      ["为什么不要用裸 except？", "它会捕获 KeyboardInterrupt 和 SystemExit，导致 Ctrl+C 无效、程序无法退出，还会掩盖真正的错误。"],
      ["with 一定等价于 try/finally 吗？", "语义上等价，但 with 更简洁且能处理多个资源，推荐优先用 with。"],
    ],
    sum: "异常指定类型、资源用 with、文件指定 encoding、JSON 记住 ensure_ascii。",
  },
];
