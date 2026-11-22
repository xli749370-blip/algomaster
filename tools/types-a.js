// 题型模板库 A（1-14）：每个题型含真实 solver 与四语言题解
// gen(p) 生成输入 -> 返回 {lines:[], args:{}}；solve(args) 返回输出字符串（用于生成样例）

const TYPES_A = [

// 1. 数组求和
{
  key: "sum-array", cat: "数组", diff: "简单",
  title: p => `数组元素求和（n = ${p.n}）`,
  desc: p => `给定一个长度为 ${p.n} 的整数数组，请输出所有元素之和。数据保证每个元素绝对值不超过 10^9，结果需要用 64 位整型承接（long long / long / Python 大整数）。`,
  gen: r => { const n = 5 + r.int(60); const a = Array.from({length:n}, () => r.int(2001) - 1000); return { n, a }; },
  solve: p => String(p.a.reduce((s,x)=>s+x, 0)),
  inputText: p => `第一行一个整数 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => String(p.a.reduce((s,x)=>s+x, 0)),
  code: {
    cpp: `long long sumArray(const vector<int>& a) {
    long long s = 0;                 // 用 long long 防溢出
    for (int x : a) s += x;
    return s;
}`,
    py: `def sum_array(a):
    return sum(a)      # Python 整数无溢出`,
    java: `static long sumArray(int[] a) {
    long s = 0;
    for (int x : a) s += x;
    return s;
}`,
    c: `long long sumArray(const int* a, int n) {
    long long s = 0;
    for (int i = 0; i < n; i++) s += a[i];
    return s;
}`
  },
  points: ["累加变量必须用 64 位整型，1e5 个 1e9 相加会超过 int 上限", "C 语言传数组需同时传长度（数组传参会退化为指针）", "Python 整数是任意精度，天然不会溢出"]
},

// 2. 最大值
{
  key: "max-array", cat: "数组", diff: "简单",
  title: p => `求数组最大值与下标（n = ${p.n}）`,
  desc: p => `给出 ${p.n} 个整数，输出最大值以及它第一次出现的下标（下标从 0 开始）。若最大值出现多次，取最早出现的位置。`,
  gen: r => { const n = 5 + r.int(80); const a = Array.from({length:n}, () => r.int(2001) - 1000); return { n, a }; },
  solve: p => { let mi = 0; p.a.forEach((x,i)=>{ if (x > p.a[mi]) mi = i; }); return `${p.a[mi]} ${mi}`; },
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => { let mi = 0; p.a.forEach((x,i)=>{ if (x > p.a[mi]) mi = i; }); return `${p.a[mi]} ${mi}`; },
  code: {
    cpp: `pair<int,int> maxWithIndex(const vector<int>& a) {
    int idx = 0;
    for (int i = 1; i < (int)a.size(); i++)
        if (a[i] > a[idx]) idx = i;    // 严格大于 => 保留最早出现的
    return {a[idx], idx};
}`,
    py: `def max_with_index(a):
    idx = a.index(max(a))   # index 返回首次出现位置
    return a[idx], idx`,
    java: `static int[] maxWithIndex(int[] a) {
    int idx = 0;
    for (int i = 1; i < a.length; i++)
        if (a[i] > a[idx]) idx = i;
    return new int[]{a[idx], idx};
}`,
    c: `void maxWithIndex(const int* a, int n, int* val, int* idx) {
    *idx = 0;
    for (int i = 1; i < n; i++)
        if (a[i] > a[*idx]) *idx = i;
    *val = a[*idx];
}`
  },
  points: ["初始化下标为 0 而不是 -1，避免全负数时判断出错", "用严格大于比较可以自然保留最早出现的最大元素", "C 语言用指针传出多个结果，这是 C 的常见风格"]
},

// 3. 数组逆序
{
  key: "reverse-array", cat: "数组", diff: "简单",
  title: p => `数组原地逆序（n = ${p.n}）`,
  desc: p => `将长度为 ${p.n} 的数组原地逆序后输出。要求空间复杂度 O(1)，即不能新建等长数组。`,
  gen: r => { const n = 4 + r.int(40); const a = Array.from({length:n}, () => r.int(200) ); return { n, a }; },
  solve: p => p.a.slice().reverse().join(" "),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => p.a.slice().reverse().join(" "),
  code: {
    cpp: `void reverseArray(vector<int>& a) {
    for (int i = 0, j = a.size() - 1; i < j; i++, j--)
        swap(a[i], a[j]);
}`,
    py: `def reverse_array(a):
    i, j = 0, len(a) - 1
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1; j -= 1
    return a`,
    java: `static void reverseArray(int[] a) {
    for (int i = 0, j = a.length - 1; i < j; i++, j--) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`,
    c: `void reverseArray(int* a, int n) {
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`
  },
  points: ["双指针对撞是 O(1) 空间逆序的标准写法", "循环条件写 i < j，写 i <= j 时中间元素会自己和自己交换（虽无害但多余）", "Python 的 a[::-1] 会新建列表，不满足原地要求"]
},

// 4. 冒泡排序
{
  key: "bubble-sort", cat: "排序", diff: "简单",
  title: p => `冒泡排序（n = ${p.n}）`,
  desc: p => `用冒泡排序将 ${p.n} 个整数升序排列后输出。请实现带「本趟无交换即提前结束」优化的版本，并思考最坏与最好情况的复杂度差异。`,
  gen: r => { const n = 5 + r.int(30); const a = Array.from({length:n}, () => r.int(100)); return { n, a }; },
  solve: p => p.a.slice().sort((x,y)=>x-y).join(" "),
  inputText: p => `第一行 n = ${p.n}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => p.a.slice().sort((x,y)=>x-y).join(" "),
  code: {
    cpp: `void bubbleSort(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;                 // 优化：本趟无交换说明已有序
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) { swap(a[j], a[j + 1]); swapped = true; }
        if (!swapped) break;
    }
}`,
    py: `def bubble_sort(a):
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a`,
    java: `static void bubbleSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < a.length - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swapped = true;
            }
        if (!swapped) break;
    }
}`,
    c: `void bubbleSort(int* a, int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; swapped = 1;
            }
        if (!swapped) break;
    }
}`
  },
  points: ["内层循环上界是 n-1-i：后面 i 个元素已经排好，不必再比", "最好情况（已有序）加优化后是 O(n)，最坏 O(n²)", "冒泡是稳定排序：相等元素不会交换，相对次序保持"]
},

// 5. 二分查找
{
  key: "binary-search", cat: "二分", diff: "简单",
  title: p => `有序数组二分查找（n = ${p.n}，q = ${p.q}）`,
  desc: p => `给定一个升序数组（长度 ${p.n}）和 ${p.q} 个查询值，对每个查询输出其下标，不存在输出 -1。要求每次查询 O(log n)。`,
  gen: r => {
    const n = 10 + r.int(90);
    const a = Array.from({length:n}, () => r.int(500)).sort((x,y)=>x-y);
    const q = 3 + r.int(5);
    const qs = Array.from({length:q}, () => r.int(600));
    return { n, a, q, qs };
  },
  solve: p => p.qs.map(x => p.a.indexOf(x)).join(" "),
  inputText: p => `第一行 n = ${p.n}, q = ${p.q}\n第二行 ${p.n} 个升序整数：${p.a.join(" ")}\n第三行 ${p.q} 个查询：${p.qs.join(" ")}`,
  outputText: p => p.qs.map(x => p.a.indexOf(x)).join(" "),
  code: {
    cpp: `int lowerBound(const vector<int>& a, int x) {   // 第一个 >= x 的位置
    int l = 0, r = (int)a.size() - 1, ans = -1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == x) { ans = m; r = m - 1; }     // 继续往左找首个
        else if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return ans;
}`,
    py: `import bisect
def search(a, x):
    i = bisect.bisect_left(a, x)
    return i if i < len(a) and a[i] == x else -1`,
    java: `static int search(int[] a, int x) {
    int l = 0, r = a.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == x) return m;
        else if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
    c: `int search(const int* a, int n, int x) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == x) return m;
        else if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
  },
  points: ["mid 用 l+(r-l)/2 计算，避免 l+r 溢出", "循环不变式：答案始终在 [l, r] 内，所以 while(l<=r)", "二分前必须确认数组有序——这是最常见的错误前提"]
},

// 6. 前缀和
{
  key: "prefix-sum", cat: "前缀和", diff: "简单",
  title: p => `区间和查询（n = ${p.n}，m = ${p.m}）`,
  desc: p => `数组长度 ${p.n}，共 ${p.m} 次查询，每次给出 l、r（0 起闭区间），输出 a[l] + ... + a[r]。要求每次查询 O(1)，总复杂度 O(n+m)。`,
  gen: r => {
    const n = 10 + r.int(90);
    const a = Array.from({length:n}, () => r.int(201) - 100);
    const m = 3 + r.int(6);
    const qs = Array.from({length:m}, () => { let l = r.int(n); let rr = l + r.int(n - l); return [l, rr]; });
    return { n, a, m, qs };
  },
  solve: p => p.qs.map(([l, r]) => { let s = 0; for (let i = l; i <= r; i++) s += p.a[i]; return s; }).join("\n"),
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n第二行 ${p.n} 个整数：${p.a.join(" ")}\n接下来 ${p.m} 行，每行 l r：\n${p.qs.map(q=>q.join(" ")).join("\n")}`,
  outputText: p => p.qs.map(([l, r]) => { let s = 0; for (let i = l; i <= r; i++) s += p.a[i]; return s; }).join("\n"),
  code: {
    cpp: `// 预处理 O(n)，每次查询 O(1)
vector<long long> pre(n + 1, 0);
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
auto query = [&](int l, int r) { return pre[r + 1] - pre[l]; };`,
    py: `pre = [0] * (n + 1)
for i, x in enumerate(a):
    pre[i + 1] = pre[i] + x
def query(l, r):
    return pre[r + 1] - pre[l]`,
    java: `long[] pre = new long[n + 1];
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
// 查询 [l, r]：pre[r + 1] - pre[l]`,
    c: `long long pre[100005];
pre[0] = 0;
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
// 查询 [l, r]：pre[r + 1] - pre[l]`
  },
  points: ["前缀和数组比原数组多一位（pre[0]=0），可以省掉 l==0 的特判", "开 long long：n 个 1e9 累加必然溢出 int", "区间和转成两个前缀和相减，是 O(1) 查询的核心思想"]
},

// 7. 差分
{
  key: "diff-range", cat: "前缀和", diff: "中等",
  title: p => `区间加与最终数组（n = ${p.n}，m = ${p.m}）`,
  desc: p => `初始有 ${p.n} 个 0，执行 ${p.m} 次操作：把区间 [l, r] 内所有数加 c。全部操作后输出最终数组。要求单次操作 O(1)。`,
  gen: r => {
    const n = 8 + r.int(30);
    const m = 3 + r.int(6);
    const ops = Array.from({length:m}, () => { let l = r.int(n); let rr = l + r.int(n - l); return [l, rr, 1 + r.int(9)]; });
    return { n, m, ops };
  },
  solve: p => { const a = new Array(p.n).fill(0); p.ops.forEach(([l,r,c])=>{ for(let i=l;i<=r;i++) a[i]+=c; }); return a.join(" "); },
  inputText: p => `第一行 n = ${p.n}, m = ${p.m}\n接下来 ${p.m} 行，每行 l r c：\n${p.ops.map(o=>o.join(" ")).join("\n")}`,
  outputText: p => { const a = new Array(p.n).fill(0); p.ops.forEach(([l,r,c])=>{ for(let i=l;i<=r;i++) a[i]+=c; }); return a.join(" "); },
  code: {
    cpp: `vector<long long> d(n + 2, 0);
// 区间 [l, r] 全部加 c
d[l] += c; d[r + 1] -= c;
// 所有操作完成后求前缀和还原
long long cur = 0;
for (int i = 0; i < n; i++) { cur += d[i]; a[i] = cur; }`,
    py: `d = [0] * (n + 2)
for l, r, c in ops:          # 区间加 c
    d[l] += c; d[r + 1] -= c
cur = 0
a = []
for i in range(n):           # 前缀和还原
    cur += d[i]; a.append(cur)`,
    java: `long[] d = new long[n + 2];
for (int[] op : ops) { d[op[0]] += op[2]; d[op[1] + 1] -= op[2]; }
long cur = 0;
for (int i = 0; i < n; i++) { cur += d[i]; a[i] = (int) cur; }`,
    c: `long long d[100005] = {0};
// 区间加：d[l] += c; d[r+1] -= c;
long long cur = 0;
for (int i = 0; i < n; i++) { cur += d[i]; a[i] = cur; }`
  },
  points: ["差分是前缀和的逆运算：差分数组求前缀和就还原成原数组", "d[r+1] -= c 时数组要多开一位，避免越界", "区间修改 + 单点查询用差分；区间修改 + 区间查询需再套前缀和或线段树"]
},

// 8. 有序数组两数之和
{
  key: "two-sum-sorted", cat: "双指针", diff: "简单",
  title: p => `有序数组两数之和（n = ${p.n}）`,
  desc: p => `给定升序数组（长度 ${p.n}）和目标值 target = ${p.target}，判断是否存在两个不同位置的元素之和等于 target，输出 YES 或 NO。要求 O(n) 时间、O(1) 额外空间。`,
  gen: r => { const n = 8 + r.int(50); const a = Array.from({length:n}, () => r.int(200)).sort((x,y)=>x-y); return { n, a, target: r.int(400) }; },
  solve: p => { let i = 0, j = p.a.length - 1; while (i < j) { const s = p.a[i] + p.a[j]; if (s === p.target) return "YES"; if (s < p.target) i++; else j--; } return "NO"; },
  inputText: p => `第一行 n = ${p.n}, target = ${p.target}\n第二行 ${p.n} 个升序整数：${p.a.join(" ")}`,
  outputText: p => { let i = 0, j = p.a.length - 1; while (i < j) { const s = p.a[i] + p.a[j]; if (s === p.target) return "YES"; if (s < p.target) i++; else j--; } return "NO"; },
  code: {
    cpp: `bool twoSum(const vector<int>& a, int target) {
    int i = 0, j = (int)a.size() - 1;
    while (i < j) {
        int s = a[i] + a[j];
        if (s == target) return true;
        else if (s < target) i++;   // 和偏小，左指针右移
        else j--;                    // 和偏大，右指针左移
    }
    return false;
}`,
    py: `def two_sum(a, target):
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target: return True
        elif s < target: i += 1
        else: j -= 1
    return False`,
    java: `static boolean twoSum(int[] a, int target) {
    int i = 0, j = a.length - 1;
    while (i < j) {
        int s = a[i] + a[j];
        if (s == target) return true;
        else if (s < target) i++;
        else j--;
    }
    return false;
}`,
    c: `int twoSum(const int* a, int n, int target) {
    int i = 0, j = n - 1;
    while (i < j) {
        int s = a[i] + a[j];
        if (s == target) return 1;
        else if (s < target) i++;
        else j--;
    }
    return 0;
}`
  },
  points: ["有序是双指针成立的前提；无序时用哈希表做 O(n)", "两个指针相向而行，每步至少排除一个不可能的元素", "要注意 i != j，不能重复用同一元素"]
},

// 9. 定长窗口最大和
{
  key: "window-sum", cat: "滑动窗口", diff: "中等",
  title: p => `长度为 k 的连续子数组最大和（n = ${p.n}，k = ${p.k}）`,
  desc: p => `数组长度 ${p.n}，求所有长度为 ${p.k} 的连续子数组中的最大和。要求 O(n)。`,
  gen: r => { const n = 10 + r.int(60); const k = 2 + r.int(Math.min(8, n - 2)); const a = Array.from({length:n}, () => r.int(201) - 100); return { n, k, a }; },
  solve: p => { let s = 0, best = -Infinity; for (let i = 0; i < p.n; i++) { s += p.a[i]; if (i >= p.k) s -= p.a[i - p.k]; if (i >= p.k - 1) best = Math.max(best, s); } return String(best); },
  inputText: p => `第一行 n = ${p.n}, k = ${p.k}\n第二行 ${p.n} 个整数：${p.a.join(" ")}`,
  outputText: p => { let s = 0, best = -Infinity; for (let i = 0; i < p.n; i++) { s += p.a[i]; if (i >= p.k) s -= p.a[i - p.k]; if (i >= p.k - 1) best = Math.max(best, s); } return String(best); },
  code: {
    cpp: `long long maxWindowSum(const vector<int>& a, int k) {
    long long s = 0, best = LLONG_MIN;
    for (int i = 0; i < (int)a.size(); i++) {
        s += a[i];                     // 右端进入窗口
        if (i >= k) s -= a[i - k];     // 左端离开窗口
        if (i >= k - 1) best = max(best, s);
    }
    return best;
}`,
    py: `def max_window_sum(a, k):
    s = sum(a[:k])
    best = s
    for i in range(k, len(a)):
        s += a[i] - a[i - k]     # 一进一出，O(1) 更新
        best = max(best, s)
    return best`,
    java: `static long maxWindowSum(int[] a, int k) {
    long s = 0, best = Long.MIN_VALUE;
    for (int i = 0; i < a.length; i++) {
        s += a[i];
        if (i >= k) s -= a[i - k];
        if (i >= k - 1) best = Math.max(best, s);
    }
    return best;
}`,
    c: `long long maxWindowSum(const int* a, int n, int k) {
    long long s = 0, best = LLONG_MIN;
    for (int i = 0; i < n; i++) {
        s += a[i];
        if (i >= k) s -= a[i - k];
        if (i >= k - 1 && s > best) best = s;
    }
    return best;
}`
  },
  points: ["窗口和用「加新元素、减旧元素」维护，避免每次重新求和", "best 初值不能设 0，数组全负数时会错", "定长窗口用一层循环即可；变长窗口需 while 收缩"]
},

// 10. 字符串反转
{
  key: "reverse-string", cat: "字符串", diff: "简单",
  title: p => `字符串反转（长度 ${p.len}）`,
  desc: p => `给定一个只含小写字母的字符串（长度 ${p.len}），输出它的反转。请分别思考「原地交换」和「切片/新串」两种实现的差异。`,
  gen: r => { const len = 5 + r.int(40); let s = ""; for (let i = 0; i < len; i++) s += String.fromCharCode(97 + r.int(26)); return { len, s }; },
  solve: p => p.s.split("").reverse().join(""),
  inputText: p => `一行字符串：${p.s}`,
  outputText: p => p.s.split("").reverse().join(""),
  code: {
    cpp: `string reverseStr(string s) {
    int i = 0, j = (int)s.size() - 1;
    while (i < j) swap(s[i++], s[j--]);
    return s;
}`,
    py: `def reverse_str(s):
    return s[::-1]        # 切片反转，最 Pythonic`,
    java: `static String reverseStr(String s) {
    char[] c = s.toCharArray();
    for (int i = 0, j = c.length - 1; i < j; i++, j--) {
        char t = c[i]; c[i] = c[j]; c[j] = t;
    }
    return new String(c);
}`,
    c: `void reverseStr(char* s) {
    int n = strlen(s);
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
    }
}`
  },
  points: ["Java 的 String 不可变，必须转 char[] 才能原地交换", "C 的字符串以 '\\0' 结尾，反转时不要动结尾符", "Python 的 s[::-1] 步长 -1 表示倒序取，最简洁"]
},

// 11. 回文判断
{
  key: "palindrome", cat: "字符串", diff: "简单",
  title: p => `回文串判断（长度 ${p.len}）`,
  desc: p => `判断字符串是否为回文（正读反读相同），输出 YES 或 NO。要求 O(n) 时间、O(1) 额外空间。`,
  gen: r => {
    const len = 4 + r.int(20);
    let base = ""; for (let i = 0; i < len; i++) base += String.fromCharCode(97 + r.int(5));
    // 一半概率构造成回文
    const s = r.int(2) ? base : base + base.split("").reverse().slice(1).join("");
    return { len: s.length, s };
  },
  solve: p => p.s === p.s.split("").reverse().join("") ? "YES" : "NO",
  inputText: p => `一行字符串：${p.s}`,
  outputText: p => p.s === p.s.split("").reverse().join("") ? "YES" : "NO",
  code: {
    cpp: `bool isPalindrome(const string& s) {
    int i = 0, j = (int)s.size() - 1;
    while (i < j)
        if (s[i++] != s[j--]) return false;   // 有一处不等即失败
    return true;
}`,
    py: `def is_palindrome(s):
    return s == s[::-1]`,
    java: `static boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j)
        if (s.charAt(i++) != s.charAt(j--)) return false;
    return true;
}`,
    c: `int isPalindrome(const char* s) {
    int i = 0, j = strlen(s) - 1;
    while (i < j)
        if (s[i++] != s[j--]) return 0;
    return 1;
}`
  },
  points: ["双指针从两端向中间比，遇到不同立即返回 false", "偶数长度时 i 与 j 会交叉，奇数长度时 i==j 停在中心，循环条件 i<j 都成立", "判断回文子串的最优解法是中心扩展或 Manacher，而不是逐个子串判断"]
},

// 12. 字符计数
{
  key: "char-count", cat: "字符串", diff: "简单",
  title: p => `统计字符出现次数（长度 ${p.len}）`,
  desc: p => `统计字符串中每个小写字母出现的次数，按 a 到 z 的顺序输出出现过的字母及其次数（无出现的跳过）。要求 O(n)。`,
  gen: r => { const len = 10 + r.int(50); let s = ""; for (let i = 0; i < len; i++) s += String.fromCharCode(97 + r.int(8)); return { len, s }; },
  solve: p => { const c = {}; for (const ch of p.s) c[ch] = (c[ch]||0)+1; return Object.keys(c).sort().map(k=>`${k} ${c[k]}`).join("\n"); },
  inputText: p => `一行字符串：${p.s}`,
  outputText: p => { const c = {}; for (const ch of p.s) c[ch] = (c[ch]||0)+1; return Object.keys(c).sort().map(k=>`${k} ${c[k]}`).join("\n"); },
  code: {
    cpp: `int cnt[26] = {0};
for (char c : s) cnt[c - 'a']++;       // 字符转下标
for (int i = 0; i < 26; i++)
    if (cnt[i]) cout << char('a' + i) << " " << cnt[i] << "\\n";`,
    py: `from collections import Counter
cnt = Counter(s)               # 直接得到计数器
for ch in sorted(cnt):
    print(ch, cnt[ch])`,
    java: `int[] cnt = new int[26];
for (char c : s.toCharArray()) cnt[c - 'a']++;
for (int i = 0; i < 26; i++)
    if (cnt[i] > 0) System.out.println((char)('a' + i) + " " + cnt[i]);`,
    c: `int cnt[26] = {0};
for (int i = 0; s[i]; i++) cnt[s[i] - 'a']++;
for (int i = 0; i < 26; i++)
    if (cnt[i]) printf("%c %d\\n", 'a' + i, cnt[i]);`
  },
  points: ["用长度 26 的计数数组比哈希表更快、更省内存", "字符与下标互转：c - 'a' 得到 0~25，'a' + i 还原字符", "统计类问题的通用套路：先计数，再按需扫描"]
},

// 13. 最大公约数 / 最小公倍数
{
  key: "gcd-lcm", cat: "数学", diff: "简单",
  title: p => `gcd 与 lcm（a = ${p.a}, b = ${p.b}）`,
  desc: p => `给定两个正整数 a = ${p.a}、b = ${p.b}，输出它们的最大公约数和最小公倍数。请使用辗转相除法（欧几里得算法），并注意 lcm 的溢出问题。`,
  gen: r => { const a = 2 + r.int(5000), b = 2 + r.int(5000); return { a, b }; },
  solve: p => { const g = (x,y)=> y ? g(y, x%y) : x; const G = g(p.a,p.b); return `${G} ${p.a/G*p.b}`; },
  inputText: p => `一行两个整数 a = ${p.a}, b = ${p.b}`,
  outputText: p => { const g = (x,y)=> y ? g(y, x%y) : x; const G = g(p.a,p.b); return `${G} ${p.a/G*p.b}`; },
  code: {
    cpp: `long long gcd(long long a, long long b) {
    while (b) { long long t = a % b; a = b; b = t; }   // 辗转相除
    return a;
}
long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;      // 先除后乘，避免溢出
}`,
    py: `import math
g = math.gcd(a, b)          # 3.9+ 支持多参数
l = a // g * b              # 同样先除后乘`,
    java: `static long gcd(long a, long b) {
    while (b != 0) { long t = a % b; a = b; b = t; }
    return a;
}
static long lcm(long a, long b) { return a / gcd(a, b) * b; }`,
    c: `long long gcd(long long a, long long b) {
    while (b) { long long t = a % b; a = b; b = t; }
    return a;
}
long long lcm(long long a, long long b) { return a / gcd(a, b) * b; }`
  },
  points: ["lcm 写成 a/gcd*b 而不是 a*b/gcd，防止 a*b 先溢出", "多个数的 gcd：从左到右两两合并即可", "gcd(0, x) = x 是重要边界，辗转相除的循环条件 b 天然处理"]
},

// 14. 素数筛选
{
  key: "prime-sieve", cat: "数学", diff: "中等",
  title: p => `统计 ${p.n} 以内的素数个数`,
  desc: p => `输出 2 到 ${p.n} 之间（含端点）的素数个数，并输出最小的 10 个素数。n 最大 10^7，要求使用埃氏筛或线性筛，O(n log log n) 以内。`,
  gen: r => { const n = 50 + r.int(3000); return { n }; },
  solve: p => { const isP = new Array(p.n+1).fill(true); isP[0]=isP[1]=false; for (let i=2;i*i<=p.n;i++) if (isP[i]) for (let j=i*i;j<=p.n;j+=i) isP[j]=false; const ps=[]; for (let i=2;i<=p.n;i++) if (isP[i]) ps.push(i); return `${ps.length}\n${ps.slice(0,10).join(" ")}`; },
  inputText: p => `一行一个整数 n = ${p.n}`,
  outputText: p => { const isP = new Array(p.n+1).fill(true); isP[0]=isP[1]=false; for (let i=2;i*i<=p.n;i++) if (isP[i]) for (let j=i*i;j<=p.n;j+=i) isP[j]=false; const ps=[]; for (let i=2;i<=p.n;i++) if (isP[i]) ps.push(i); return `${ps.length}\n${ps.slice(0,10).join(" ")}`; },
  code: {
    cpp: `vector<int> primes;
bool notPrime[N];
void sieve(int n) {                        // 埃氏筛 O(n log log n)
    notPrime[0] = notPrime[1] = true;
    for (int i = 2; i * i <= n; i++)
        if (!notPrime[i])
            for (int j = i * i; j <= n; j += i) notPrime[j] = true;
    for (int i = 2; i <= n; i++) if (!notPrime[i]) primes.push_back(i);
}`,
    py: `def sieve(n):
    is_p = [True] * (n + 1)
    is_p[0] = is_p[1] = False
    i = 2
    while i * i <= n:
        if is_p[i]:
            is_p[i*i::i] = [False] * len(is_p[i*i::i])   # 切片批量置 False
        i += 1
    return [x for x in range(2, n + 1) if is_p[x]]`,
    java: `static List<Integer> sieve(int n) {
    boolean[] notPrime = new boolean[n + 1];
    List<Integer> ps = new ArrayList<>();
    for (int i = 2; i * i <= n; i++)
        if (!notPrime[i])
            for (int j = i * i; j <= n; j += i) notPrime[j] = true;
    for (int i = 2; i <= n; i++) if (!notPrime[i]) ps.add(i);
    return ps;
}`,
    c: `int notPrime[N];
void sieve(int n) {
    notPrime[0] = notPrime[1] = 1;
    for (int i = 2; (long long)i * i <= n; i++)
        if (!notPrime[i])
            for (int j = i * i; j <= n; j += i) notPrime[j] = 1;
}`
  },
  points: ["内层从 i*i 开始而不是 2*i：更小的倍数已被更小的质数筛过", "i*i 可能溢出 int，C 语言里写成 (long long)i*i <= n", "线性筛（欧拉筛）保证每个合数只被最小质因子筛一次，复杂度严格 O(n)"]
}
];

module.exports = { TYPES_A };
