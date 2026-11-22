// Python 第 1-5 章 · 每章 4 节微课
module.exports = [
  {
    t: "Python 入门",
    sub: "安装与解释器 · 第一个程序 · 交互模式 · 常见报错",
    mins: 40,
    kw: "输入输出",
    goals: [
      "装好 Python 并跑通第一个脚本",
      "分清解释执行与编译执行的区别",
      "会用交互模式和脚本两种方式试代码",
      "看懂 IndentationError / NameError / TypeError",
    ],
    map: [
      ["场景", "命令", "说明"],
      ["运行脚本", "`python main.py`", "最常用"],
      ["交互模式", "`python`", "逐行试验，Ctrl+D 退出"],
      ["装包", "`pip install 包名`", "第三方库"],
      ["查版本", "`python --version`", "确认 3.x"],
    ],
    mic: [
      {
        t: "解释器、脚本与交互模式",
        lead: "Python 不需要编译成 exe，解释器读一行执行一行——这让「改一行立刻看结果」变得极快。",
        body: [
          "`python main.py` 让解释器执行整个文件；直接敲 `python` 进入 REPL，适合验证一个表达式或一个 API 的行为。",
          "Python 靠**缩进**划分代码块，没有花括号。同一块代码的缩进必须一致，混用空格和 Tab 会直接报 `TabError`。",
        ],
        code: `# main.py
name = "AlgoMaster"
print(f"Hello, {name}!")

# 运行
# $ python main.py
# Hello, AlgoMaster!

# 交互模式
# >>> 2 ** 10
# 1024`,
        lang: "Python",
        pts: [
          "Python 3 是现在唯一该学的版本，Python 2 已于 2020 年停止维护",
          "缩进统一用 4 个空格，别用 Tab",
          "文件编码默认 UTF-8，中文字符串可直接写",
        ],
        pit: "文件名叫 `random.py` 会遮蔽标准库 random，`import random` 时导入的是你自己那个文件，报错非常费解。",
      },
      {
        t: "变量与动态类型",
        lead: "Python 变量是「贴在对象上的标签」，不是「装值的盒子」——这决定了它的赋值语义。",
        body: [
          "`a = 1` 让名字 a 指向整数对象 1；`a = \"s\"` 又让它指向字符串。类型跟着对象走，不跟着变量走。",
          "`type(x)` 查看类型，`id(x)` 查看对象身份。`a is b` 比较身份（同一对象），`a == b` 比较值。",
        ],
        code: `a = 1
print(type(a))        # <class 'int'>
a = "hello"
print(type(a))        # <class 'str'>

x = [1, 2]
y = x                 # 同一个对象
y.append(3)
print(x)              # [1, 2, 3]

z = x[:]              # 浅拷贝，新对象
print(x is z)         # False`,
        lang: "Python",
        pts: [
          "`is` 判断是否同一对象，只用于 `None` 比较",
          "小整数（-5~256）和短字符串会被缓存，`is` 偶尔为真，别依赖",
          "`a = b` 不复制对象，只复制引用",
        ],
        pit: "`if x is 1` 在 x = 1000 时可能为 False——数字用 `==`，只有 `None` 才用 `is`。",
      },
      {
        t: "输入输出：input 与 print",
        lead: "`input()` 永远返回字符串，需要数字就得自己转——这是新手第一个坑。",
        body: [
          "`input()` 读到换行为止；`sys.stdin.readline()` 更快，竞赛里读大量数据时用它。`print` 的 `sep` 与 `end` 参数控制分隔与结尾。",
          "一行多个整数用 `map(int, input().split())` 一行搞定，这是最常用的读入套路。",
        ],
        code: `n = int(input())                       # 单个整数
a, b = map(int, input().split())        # 一行两个
arr = list(map(int, input().split()))    # 一行一个数组
n, m = map(int, input().split())

print(a, b, sep=", ")        # 1, 2
print("no newline", end="")
print(f"{a} + {b} = {a+b}")  # f-string 最常用

import sys
line = sys.stdin.readline()             # 更快，含换行符`,
        lang: "Python",
        pts: [
          "`input()` 会自动去掉末尾换行，`readline()` 不会",
          "`split()` 不带参数时按任意空白切分（含多个空格）",
          "大量输出用 `sys.stdout.write` 或先拼成一个字符串再 print",
        ],
        pit: "`list(map(int, input().split()))` 遇到空行会返回空列表，多组数据时可能死循环，记得判空。",
      },
      {
        t: "常见报错对照表",
        lead: "Python 报错信息很友好，最后一行就是答案——先读它，别急着改代码。",
        body: [
          "`IndentationError` 是缩进问题；`NameError` 是名字没定义（拼错或作用域问题）；`TypeError` 是类型不匹配；`IndexError` 是下标越界；`KeyError` 是字典里没有这个键。",
          "养成习惯：看 traceback 的**最后一行**（异常类型与消息），再往上看**第一个指向你代码的行**。",
        ],
        code: `# IndentationError: expected an indented block
if True:
print("x")          # 缺少缩进

# NameError: name 'y' is not defined
print(y)

# TypeError: can only concatenate str (not "int") to str
print("age: " + 18)     # 要写 str(18)

# IndexError: list index out of range
a = [1, 2]
print(a[5])

# KeyError: 'k'
d = {"a": 1}
print(d["k"])           # 用 d.get("k") 更安全`,
        lang: "Python",
        pts: [
          "`KeyError` 用 `d.get(k, 默认值)` 或 `if k in d` 避免",
          "`TypeError` 九成是忘了 `int()` / `str()` 转换",
          "`AttributeError` 多半是对象类型搞错了，先 print 一下 type",
        ],
        pit: "报错行号指向的是「出错位置」而不是「原因位置」。比如 `None.xxx()` 报 AttributeError，根因往往在几行前的函数返回值。",
      },
    ],
    qa: [
      ["Python 是编译型还是解释型？", "先编译成字节码，再由虚拟机解释执行——所以有 .pyc 缓存，但不像 C++ 那样生成机器码。"],
      ["为什么 Python 慢？", "动态类型 + 每步都要查类型 + 解释执行，比 C++ 慢 20~100 倍；靠内置函数（C 实现）与向量化弥补。"],
    ],
    sum: "变量是标签不是盒子，input 永远给字符串，报错先看最后一行。",
  },

  {
    t: "变量与基本类型",
    sub: "int/float/str/bool · 类型转换 · f-string · 数值细节",
    mins: 45,
    kw: "模拟",
    goals: [
      "掌握四种基本类型的行为差异",
      "理解 Python 的整数没有溢出这件事",
      "会用 f-string 做格式化输出",
      "避开浮点数比较与真值判断的坑",
    ],
    map: [
      ["类型", "特点", "注意"],
      ["int", "任意精度，无溢出", "大数运算略慢"],
      ["float", "64 位双精度", "0.1+0.2 != 0.3"],
      ["str", "不可变序列", "拼接多时用 join"],
      ["bool", "True/False 是 int 子类", "True == 1"],
    ],
    mic: [
      {
        t: "int 没有溢出，float 有精度",
        lead: "Python 的 int 是「想多大就多大」，代价是大数运算会变慢；float 则是标准的 64 位双精度。",
        body: [
          "`2 ** 1000` 能直接算出来，不需要 long long。这是 Python 在算法题里的巨大优势，但注意大数乘法是 O(位数)，`2 ** 10**7` 会非常慢。",
          "float 只有约 15~16 位有效数字，`0.1 + 0.2 != 0.3` 是因为二进制无法精确表示 0.1。比较浮点要用 `math.isclose`。",
        ],
        code: `print(2 ** 100)              # 1267650600228229401496703205376
print(10 ** 18 + 1)          # 精确
print(1 / 3)                 # 0.3333333333333333
print(0.1 + 0.2)             # 0.30000000000000004
print(0.1 + 0.2 == 0.3)      # False

import math
print(math.isclose(0.1 + 0.2, 0.3))   # True

print(7 // 2, 7 % 2, 7 / 2)  # 3 1 3.5
print(-7 // 2, -7 % 2)       # -4 1（向下取整！）`,
        lang: "Python",
        pts: [
          "`//` 是向下取整，不是向零截断，负数时与 C++ 不同",
          "`int` 与 `float` 运算结果是 float",
          "`round(2.5)` 是 2（银行家舍入），要四舍五入用 `floor(x+0.5)`",
        ],
        pit: "从 C++ 转过来最容易错：`-7 // 2` 在 C++ 是 -3，在 Python 是 -4；`-7 % 2` 在 C++ 是 -1，在 Python 是 1。",
      },
      {
        t: "字符串与 f-string",
        lead: "f-string 是 Python 3.6 之后最值得用的语法：把变量直接嵌进字符串，还能写格式说明符。",
        body: [
          "`f\"{x:.2f}\"` 保留两位小数，`f\"{n:>5}\"` 右对齐宽度 5，`f\"{n:,}\"` 千分位分隔。这些比 `%` 格式化和 `format()` 都好读。",
          "字符串不可变：所有「修改」都返回新字符串。所以循环里 `s += c` 是 O(n²)，要用 `''.join(list)`。",
        ],
        code: `name, score = "Amy", 92.567
print(f"{name} 得分 {score:.2f}")     # Amy 得分 92.57
print(f"{1234567:,}")                 # 1,234,567
print(f"{42:>6}|")                    #     42|
print(f"{3.14159:.3e}")               # 3.142e+00

s = "abc"
print(s.upper(), s.replace("b", "B"), len(s))
print("-".join(["a", "b", "c"]))       # a-b-c
print("  pad  ".strip())               # pad`,
        lang: "Python",
        pts: [
          "f-string 里可以写表达式：`f\"{a + b}\"`",
          "`s[::-1]` 反转字符串，`s[1:3]` 切片",
          "多行字符串用三引号，保留换行",
        ],
        pit: "`'a' + 1` 会 TypeError；字符转数字要 `ord('a')`，数字转字符 `chr(97)`。Python 没有 char 类型。",
      },
      {
        t: "真值判断与类型转换",
        lead: "Python 里「空」就是假：空列表、空字典、空字符串、0、None 都当 False。",
        body: [
          "`if not arr:` 比 `if len(arr) == 0:` 更 Pythonic。但要注意 `0` 和 `False` 都是假，如果 0 是合法值，就必须显式 `is not None`。",
          "转换函数：`int()` 截断小数、`float()`、`str()`、`bool()`、`list()`、`tuple()`、`set()`、`dict()`。",
        ],
        code: `print(bool([]), bool([0]), bool(""), bool("0"), bool(0), bool(None))
# False True False True False False

x = 0
if x is not None:      # 0 是合法值时这样判断
    print("有值")

print(int("42"), int(3.99), float("1.5"), str(3.0))
print(list("abc"))     # ['a', 'b', 'c']
print(int("0x1f", 16)) # 31，按 16 进制解析`,
        lang: "Python",
        pts: [
          "`int(3.99)` 是向零截断得 3；`int(-3.99)` 得 -3",
          "`int('3.5')` 会 ValueError，要先 `float()` 再 `int()`",
          "`bool` 是 `int` 的子类，`True + True == 2`",
        ],
        pit: "`if x:` 在 x 可能是 0 时会把合法的 0 当假，导致逻辑错误且极难发现。",
      },
      {
        t: "常用内置函数与数学库",
        lead: "Python 内置了一堆「一行代替十行」的工具函数，先记住它们能省大量代码。",
        body: [
          "`sum`、`max`、`min`、`abs`、`sorted`、`enumerate`、`zip`、`any`、`all`、`round`、`divmod` 是高频组合。",
          "`math` 提供 `sqrt`、`gcd`、`inf`、`pi`、`floor`、`ceil`；`math.inf` 是无穷大，比 `1e18` 更语义化。",
        ],
        code: `a = [3, 1, 4, 1, 5]
print(sum(a), max(a), min(a), sorted(a, reverse=True))
print(divmod(7, 2))            # (3, 1)
print(any(x > 4 for x in a))   # True
print(all(x > 0 for x in a))   # True
for i, v in enumerate(a):      # 带下标
    pass
for x, y in zip([1,2], ["a","b"]):
    pass

import math
print(math.sqrt(16), math.gcd(12, 18), math.inf)
print(math.floor(3.7), math.ceil(3.2))   # 3 4`,
        lang: "Python",
        pts: [
          "`sum` 的初始值是 0，处理大数时可用 `sum(a, 0)`",
          "`sorted` 返回新列表，`list.sort()` 原地排序返回 None",
          "`math.floor` 对负数也向下取整，与 `int()` 不同",
        ],
        pit: "`x = list.sort()` 会让 x 变成 None——原地排序没有返回值，这是新手最常见的 NoneType 错误来源。",
      },
    ],
    qa: [
      ["为什么 Python 的整数不会溢出？", "int 是任意精度对象，内部按需扩展位数，代价是大数运算比机器字慢。"],
      ["`is` 和 `==` 什么时候结果不同？", "`==` 比较值，`is` 比较是否同一对象。两个内容相同的列表 `==` 为真但 `is` 为假。"],
    ],
    sum: "int 无溢出、float 有误差、`//` 向下取整、空即假、`sort` 无返回值。",
  },

  {
    t: "字符串操作大全",
    sub: "切片 · 常用方法 · 格式化 · 编码",
    mins: 45,
    kw: "字符串",
    goals: [
      "熟练用切片做子串、反转、步长取字符",
      "记住 10 个最高频的字符串方法",
      "分清 find / index / in 的差异",
      "会处理编码与大小写转换",
    ],
    map: [
      ["操作", "写法", "结果"],
      ["切片", "`s[1:4]`", "下标 1~3 的子串"],
      ["反转", "`s[::-1]`", "逆序字符串"],
      ["分割", "`s.split(',')`", "列表"],
      ["拼接", "`','.join(list)`", "字符串"],
    ],
    mic: [
      {
        t: "切片：Python 最优雅的语法之一",
        lead: "`s[start:stop:step]` 三个参数都是可选的，越界也不报错——这是它比 C++ 舒服的地方。",
        body: [
          "切片取的是「左闭右开」区间，`s[0:3]` 取前三个字符。省略 start 从头开始，省略 stop 到结尾，负索引从右往左数。",
          "步长为负时反向取：`s[::-1]` 反转，`s[::-2]` 每隔一个取。切片永远返回新对象，不会修改原串。",
        ],
        code: `s = "AlgoMaster"
print(s[0:4])      # Algo
print(s[4:])       # Master
print(s[-6:])      # Master
print(s[::-1])     # retsaMoglA
print(s[::2])      # AOMse
print(s[1:4:2])    # lo

a = [1,2,3,4,5]
print(a[1:3], a[::-1], a[::2])   # [2,3] [5,4,3,2,1] [1,3,5]

# 切片赋值（列表专有）
a[1:3] = [9, 9, 9]
print(a)           # [1, 9, 9, 9, 4, 5]`,
        lang: "Python",
        pts: [
          "切片越界不报错，会自动截断到边界",
          "`s[:]` 是浅拷贝，对字符串无意义（不可变），对列表有用",
          "切片赋值可以改变列表长度",
        ],
        pit: "`a[1:3] = 9` 会 TypeError（右侧必须是可迭代对象），要写 `a[1:3] = [9]`。",
      },
      {
        t: "高频字符串方法清单",
        lead: "这十个方法覆盖了 90% 的字符串题：split / join / strip / replace / find / startswith / count / upper / isdigit / zfill。",
        body: [
          "`find` 找不到返回 -1，`index` 找不到抛异常——竞赛里用 `find` 更安全。`in` 运算符返回 bool，可读性最好。",
          "`split()` 不带参数按任意空白切分并去掉空串；`split(' ')` 按单个空格切分，会保留空串。",
        ],
        code: `s = "  Hello,World  "
print(s.strip())                 # "Hello,World"
print(s.strip().split(","))      # ['Hello', 'World']
print("a b  c".split())          # ['a','b','c']
print("a b  c".split(" "))       # ['a','b','','c']
print("-".join(["2026","11","22"]))  # 2026-11-22

t = "abcabc"
print(t.find("bc"), t.count("a"))    # 1 2
print(t.startswith("ab"), t.endswith("bc"))  # True True
print(t.replace("a", "X"))       # XbcXbc
print("42".isdigit(), "4a".isdigit())  # True False
print("7".zfill(3))              # 007
print("abc".upper(), "ABC".lower())`,
        lang: "Python",
        pts: [
          "`strip()` 去两端空白，`lstrip`/`rstrip` 只去一侧",
          "`replace` 返回新串，原串不变",
          "`s.isdigit()` 对全角数字也返回 True，别和 `s.isdecimal()` 混",
        ],
        pit: "`\"\".split(',')` 返回 `['']` 而不是 `[]`——判空时要留意这个差异。",
      },
      {
        t: "格式化与对齐输出",
        lead: "题面要求「保留两位小数」「右对齐宽度 6」时，格式说明符能一行搞定。",
        body: [
          "格式说明符语法：`{值:填充对齐宽度.精度类型}`。`>5` 右对齐宽度 5，`<5` 左对齐，`^5` 居中，`05` 补零，`.2f` 两位小数。",
          "`%` 格式化是旧写法，`format()` 通用，f-string 最新最好读——新代码只用 f-string。",
        ],
        code: `x = 3.14159
print(f"{x:.2f}")        # 3.14
print(f"{x:8.3f}|")      #    3.142|
print(f"{42:05d}")       # 00042
print(f"{42:<6}|")       # 42    |
print(f"{'hi':^8}|")     #    hi   |
print(f"{0.5:.1%}")      # 50.0%
print(f"{255:#x}")       # 0xff

# 旧写法，能认就行
print("%.2f" % x, "{:.2f}".format(x))`,
        lang: "Python",
        pts: [
          "`f\"{x:,.2f}\"` 千分位 + 两位小数，金额输出常用",
          "`:.0f` 是四舍五入到整数（银行家舍入），不是截断",
          "`f\"{d}\"` 直接输出 dict 的可读形式，调试很方便",
        ],
        pit: "`f\"{3.145:.2f}\"` 得 3.15 还是 3.14 取决于二进制表示，涉及金额时用 decimal 模块。",
      },
      {
        t: "编码、字符与 ASCII",
        lead: "`ord` 与 `chr` 是字符和数字之间的桥，大小写转换与字母序号题都靠它们。",
        body: [
          "`ord('a') == 97`，`chr(97) == 'a'`。小写转大写可以 `chr(ord(c) - 32)`，但更简单的是 `c.upper()`。",
          "Python 3 的 str 是 Unicode，`bytes` 才是字节序列。读写二进制文件或网络数据时要做 `encode/decode`。",
        ],
        code: `print(ord('a'), ord('A'), chr(97))    # 97 65 a
print(ord('a') - ord('A'))             # 32

c = 'g'
print(chr(ord(c) - 32))                # G

s = "中文"
b = s.encode("utf-8")                  # b'\\xe4\\xb8\\xad\\xe6\\x96\\x87'
print(len(s), len(b))                  # 2 6
print(b.decode("utf-8"))               # 中文

print("abc".isalpha(), "123".isalnum())
print(list("abc"))                     # ['a','b','c']`,
        lang: "Python",
        pts: [
          "`len('中文') == 2`（按字符），`len('中文'.encode()) == 6`（按字节）",
          "字母序号：`ord(c) - ord('a')` 得到 0~25",
          "字符串可直接比较大小，按 Unicode 码位逐字符比",
        ],
        pit: "把 str 直接写入以 'wb' 打开的文件会报错，必须先 `encode()`。",
      },
    ],
    qa: [
      ["为什么循环里 `s += c` 很慢？", "字符串不可变，每次拼接都新建对象并复制全部内容，n 次就是 O(n²)；用 `''.join(list)` 是 O(n)。"],
      ["`find` 和 `index` 怎么选？", "不确定是否存在时用 `find`（返回 -1），确定存在时 `index` 报错更早暴露问题。"],
    ],
    sum: "切片左闭右开、越界不报错；`split()` 按空白、`join` 拼串；格式说明符管对齐与精度。",
  },

  {
    t: "列表、元组与切片",
    sub: "list · tuple · 排序 · 拷贝陷阱 · 二维列表",
    mins: 50,
    kw: "排序",
    goals: [
      "掌握 list 的增删改查与排序",
      "分清浅拷贝与深拷贝",
      "正确创建二维列表（避开引用陷阱）",
      "知道 tuple 什么时候比 list 好",
    ],
    map: [
      ["操作", "写法", "复杂度"],
      ["尾部追加", "`a.append(x)`", "O(1) 均摊"],
      ["头部插入", "`a.insert(0, x)`", "O(n)"],
      ["删除", "`a.pop()` / `a.remove(x)`", "O(1) / O(n)"],
      ["排序", "`a.sort()`", "O(n log n)"],
    ],
    mic: [
      {
        t: "list 的增删改查",
        lead: "list 是可变的有序序列，底层是动态数组——尾部操作快，头部操作慢。",
        body: [
          "`append` 尾部追加、`pop()` 弹尾部、`insert(i, x)` 插入、`remove(x)` 删第一个等于 x 的元素、`del a[i]` 按下标删。",
          "`in` 判断存在是 O(n)；频繁判存在就改用 set 或 dict。",
        ],
        code: `a = [3, 1, 2]
a.append(4)          # [3,1,2,4]
a.pop()              # 返回 4，[3,1,2]
a.insert(0, 9)       # [9,3,1,2]
a.remove(3)          # [9,1,2]
del a[0]             # [1,2]

a.extend([7, 8])     # 批量追加
a.sort()             # 原地升序，返回 None
a.sort(key=lambda x: -x)   # 降序
b = sorted(a)        # 返回新列表

print(len(a), a.index(2), a.count(1))
a.reverse()          # 原地反转`,
        lang: "Python",
        pts: [
          "`a.sort()` 返回 None，`sorted(a)` 返回新列表——别写 `a = a.sort()`",
          "`remove` 只删第一个匹配项，要全删用列表推导式过滤",
          "`a + b` 生成新列表，`a.extend(b)` 原地扩展",
        ],
        pit: "遍历列表时 `remove` 元素会跳过元素（下标前移），正确做法是遍历副本 `for x in a[:]` 或倒序删除。",
      },
      {
        t: "浅拷贝、深拷贝与二维列表陷阱",
        lead: "`[[0]*m]*n` 创建的不是 n 行，而是 n 个指向同一行的引用——改一行全变。",
        body: [
          "`a[:]`、`list(a)`、`copy.copy(a)` 都是**浅拷贝**：外层新建，内层元素还是同一个对象。嵌套结构要 `copy.deepcopy`。",
          "创建二维列表的正确写法是列表推导式 `[[0]*m for _ in range(n)]`，每行独立创建。",
        ],
        code: `# 错误：三行其实是同一个对象
bad = [[0] * 3] * 2
bad[0][0] = 9
print(bad)          # [[9,0,0],[9,0,0]]

# 正确
good = [[0] * 3 for _ in range(2)]
good[0][0] = 9
print(good)         # [[9,0,0],[0,0,0]]

# 浅拷贝 vs 深拷贝
import copy
a = [[1], [2]]
shallow = a[:]           # 内层共享
deep = copy.deepcopy(a)  # 完全独立`,
        lang: "Python",
        pts: [
          "`[[0]*m for _ in range(n)]` 是二维数组的标准写法",
          "`copy.deepcopy` 慢，能避免嵌套就用一维数组模拟",
          "不可变元素（int/str）的浅拷贝在行为上等于深拷贝",
        ],
        pit: "用 `*` 复制含可变元素的列表，是 Python 最著名的坑之一，且症状极其隐蔽。",
      },
      {
        t: "排序：key 函数与多关键字",
        lead: "`sort(key=...)` 让「按什么排」变成一行 lambda，比手写比较器简单得多。",
        body: [
          "`key` 接收一个函数，返回值用于比较。多关键字排序返回元组：`key=lambda x: (x[1], -x[0])` 表示第二列升序、第一列降序。",
          "`sort` 是稳定排序，相同 key 的元素保持原相对顺序——这可以用来做「多轮排序」。",
        ],
        code: `students = [("Amy", 92), ("Bob", 85), ("Cid", 92)]

students.sort(key=lambda s: s[1], reverse=True)
students.sort(key=lambda s: (-s[1], s[0]))    # 分数降序，名字升序

words = ["bb", "a", "ccc"]
words.sort(key=len)              # 按长度
words.sort(key=lambda w: (len(w), w))

# 对字典列表排序
rows = [{"n": "x", "v": 2}, {"n": "y", "v": 1}]
rows.sort(key=lambda r: r["v"])`,
        lang: "Python",
        pts: [
          "元组比较是逐元素字典序，天然支持多关键字",
          "用负号实现降序只适用于数字，字符串要分两轮排",
          "`sorted` 可对任何可迭代对象排序并返回列表",
        ],
        pit: "`key=lambda x: x[1] > 0` 只返回 bool，无法正确排序——key 要返回可比较的值，不是判断结果。",
      },
      {
        t: "tuple 与解包",
        lead: "tuple 是不可变序列，能做字典的键、能被缓存、解包时天然表达「一组相关值」。",
        body: [
          "`(x, y)` 一旦创建就不能改，所以可以作为 dict 的 key、放进 set。list 不行（不可哈希）。",
          "解包 `a, b = b, a` 交换无需临时变量；`*rest` 收集剩余元素；函数返回多个值时本质就是返回 tuple。",
        ],
        code: `t = (1, 2, 3)
print(t[0], len(t))
# t[0] = 9   # TypeError

x, y = 1, 2
x, y = y, x          # 交换
print(x, y)

first, *rest = [1, 2, 3, 4]
print(first, rest)   # 1 [2,3,4]

pos = {(0, 1): "a"}  # tuple 可作键
print(pos[(0, 1)])

def minmax(a):
    return min(a), max(a)
lo, hi = minmax([3, 1, 2])`,
        lang: "Python",
        pts: [
          "单元素 tuple 要写 `(1,)`，`(1)` 只是加括号的整数",
          "tuple 比 list 省内存、创建略快",
          "命名元组 `collections.namedtuple` 兼具可读性",
        ],
        pit: "`(1)` 不是 tuple 而是 int，`type((1))` 是 `<class 'int'>`，这是很常见的迷惑点。",
      },
    ],
    qa: [
      ["list 和 tuple 怎么选？", "需要修改用 list；固定结构、要当字典键、要省内存用 tuple。"],
      ["为什么 sort 是稳定的很重要？", "可以先按次要关键字排一遍，再按主要关键字排，结果就是「主要升序、次要保持原序」。"],
    ],
    sum: "尾部操作用 list，二维数组用推导式创建，多关键字排序返回元组。",
  },

  {
    t: "字典与集合",
    sub: "dict 操作 · Counter · set 运算 · 哈希要求",
    mins: 50,
    kw: "哈希表",
    goals: [
      "熟练用 dict 做计数与映射",
      "分清 `d[k]` 与 `d.get(k)` 的差异",
      "用 set 做去重与集合运算",
      "知道什么对象能当键",
    ],
    map: [
      ["结构", "查找", "有序", "典型用途"],
      ["dict", "O(1)", "3.7+ 保持插入序", "计数、映射、缓存"],
      ["set", "O(1)", "无序", "去重、交并差"],
      ["Counter", "O(1)", "3.7+ 插入序", "词频统计"],
      ["defaultdict", "O(1)", "插入序", "分组、建图"],
    ],
    mic: [
      {
        t: "dict 的五种取值方式",
        lead: "`d[k]` 缺键会抛异常，`d.get(k)` 返回 None——选错就是程序崩溃与逻辑错误的区别。",
        body: [
          "`d[k]` 直接取值（缺键 KeyError）；`d.get(k)` 缺键返回 None；`d.get(k, 0)` 给默认值；`d.setdefault(k, [])` 缺键时插入默认值并返回；`k in d` 只判存在。",
          "计数场景用 `collections.Counter` 最省事，`c.most_common(3)` 直接拿前三个高频项。",
        ],
        code: `d = {"a": 1}
print(d.get("b"))          # None
print(d.get("b", 0))       # 0
# print(d["b"])            # KeyError

d.setdefault("list", []).append(1)   # 分组惯用法
print(d)                   # {'a': 1, 'list': [1]}

for k, v in d.items():
    print(k, v)
print(list(d.keys()), list(d.values()))

from collections import Counter, defaultdict
c = Counter("abracadabra")
print(c.most_common(2))    # [('a',5), ('b',2)]

g = defaultdict(list)
for x in [1, 2, 3]:
    g[x % 2].append(x)`,
        lang: "Python",
        pts: [
          "`d.get(k, 默认值)` 不会修改字典，`setdefault` 会插入",
          "`Counter` 可直接相加减、取 `&`（取小）与 `|`（取大）",
          "`defaultdict(int)` 计数、`defaultdict(list)` 分组",
        ],
        pit: "用 `d[k] += 1` 计数时，首次遇到新键会 KeyError；用 `Counter` 或 `defaultdict(int)` 才安全。",
      },
      {
        t: "set：去重与集合运算",
        lead: "set 是哈希表实现的集合，去重是 O(n)，判存在是 O(1)，但元素无序且必须可哈希。",
        body: [
          "`|` 并集、`&` 交集、`-` 差集、`^` 对称差。`issubset` / `issuperset` 判断包含关系。",
          "创建空集合必须 `set()`，`{}` 是空字典——这是初学者常犯的语法错误。",
        ],
        code: `a = {1, 2, 3}
b = {2, 3, 4}
print(a | b, a & b, a - b, a ^ b)
# {1,2,3,4} {2,3} {1} {1,4}

print(2 in a)              # True
a.add(9); a.discard(1)     # 不存在也不报错
a.remove(2)                # 不存在会 KeyError

nums = [1, 1, 2, 3, 3]
uniq = list(set(nums))     # 去重但顺序丢失
uniq_sorted = sorted(set(nums))

empty = set()              # 空集合
print(type({}))            # <class 'dict'>`,
        lang: "Python",
        pts: [
          "`discard` 比 `remove` 安全（元素不存在时不报错）",
          "set 元素必须可哈希：int/str/tuple 可以，list/dict 不行",
          "大集合做 `in` 判断比 list 快成百上千倍",
        ],
        pit: "`list(set(...))` 会打乱顺序，需要保序去重就用 `dict.fromkeys(nums)`。",
      },
      {
        t: "哈希要求：什么能做键",
        lead: "能做字典键的对象必须「不可变且哈希值稳定」，否则哈希表会失效。",
        body: [
          "int、str、tuple（元素也都可哈希）、frozenset 可以；list、dict、set 不行。自定义类默认按 id 哈希，要按值比较得实现 `__hash__` 与 `__eq__`。",
          "用 tuple 做键是常见套路：`visited[(x, y)] = True`、`cnt[(a, b)] += 1`。",
        ],
        code: `d = {}
d[(0, 1)] = "start"        # tuple 作键
print(d[(0, 1)])

# d[[0, 1]] = 1            # TypeError: unhashable type: 'list'
d[(0, 1, 2)] = 1

visited = set()
for step in [(0,0), (0,1)]:
    visited.add(step)

# 嵌套 dict 替代二维表
cnt = {}
cnt.setdefault(3, {}).setdefault(4, 0)
cnt[3][4] += 1`,
        lang: "Python",
        pts: [
          "`frozenset` 是可变集合的不可变版本，可作键",
          "嵌套 dict 比二维 list 省内存，但访问慢一些",
          "需要「二维数组」且坐标范围不大时，直接用 list 更快",
        ],
        pit: "把 list 当键会立刻 TypeError；如果确实需要，转成 `tuple(lst)`。",
      },
      {
        t: "字典的排序、合并与遍历删除",
        lead: "字典本身无序（3.7+ 保持插入序），要按 key 或 value 排序得先转成 items。",
        body: [
          "`sorted(d.items())` 按 key 排，`sorted(d.items(), key=lambda kv: kv[1])` 按 value 排。`d1 | d2`（3.9+）合并字典，右边覆盖左边。",
          "遍历时不能改字典大小，要删除就先收集键再批量删，或遍历 `list(d.items())`。",
        ],
        code: `d = {"b": 2, "a": 1, "c": 3}
print(sorted(d.items()))                       # 按 key
print(sorted(d.items(), key=lambda kv: -kv[1]))# 按 value 降序
print(dict(sorted(d.items())))                  # 排序后的字典

e = {"a": 9, "d": 4}
print(d | e)          # 合并，e 的值覆盖 d

# 安全删除
for k in list(d.keys()):
    if d[k] < 2:
        del d[k]`,
        lang: "Python",
        pts: [
          "`d.update(e)` 原地合并，`d | e` 返回新字典",
          "`reversed(d)` 逆序遍历键（3.8+）",
          "`del d[k]` 缺键报错，`d.pop(k, None)` 更安全",
        ],
        pit: "遍历 dict 时 `del d[k]` 会 RuntimeError: dictionary changed size during iteration。",
      },
    ],
    qa: [
      ["Python 的 dict 为什么这么快？", "开放寻址哈希表，平均 O(1)；3.7 起用紧凑数组保存，内存也更省。"],
      ["Counter 和 defaultdict 怎么选？", "纯计数用 Counter（有 most_common）；分组或自定义初始值用 defaultdict。"],
    ],
    sum: "取值用 get、计数用 Counter、分组用 defaultdict、去重保序用 dict.fromkeys。",
  },
];
