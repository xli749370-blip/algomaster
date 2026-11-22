// ============================================================
// 题型知识库：120 个题型的识别特征 / 思路 / 关键不变量 / 参考实现 / 易错点
// 题解生成器（tools/gen-solutions.js）据此为每道题展开完整题解
// 字段：rec 识别 | idea 思路 | key 关键点 | cpp C++ 实现 | py Python 对照
//       time 时间复杂度 | sp 空间复杂度 | pit 易错点[] | va 变体
// ============================================================
module.exports = {

/* ---------------- 数组 ---------------- */
"sum-array": {
  rec: "题面出现「求和 / 累加 / 总和」，数组规模 n 可达 1e5~1e7。",
  idea: "一次线性扫描，把每个元素累加进一个 64 位累加器。这是「扫描一遍就够了」的最小模型：每个元素只读一次，不回头。",
  key: "累加变量必须用 long long / long / Python 原生大整数。n 个 1e9 相加最多到 1e14，32 位 int 必爆。",
  cpp: `long long sum = 0;
for (int i = 0; i < n; i++) {
    long long x; cin >> x;
    sum += x;              // 边读边加，不需要存数组
}
cout << sum << "\\n";`,
  py: `n = int(input())
a = list(map(int, input().split()))
print(sum(a))   # Python 整数无上限，不会溢出`,
  time: "O(n)", sp: "O(1)",
  pit: ["漏开 long long：1e5 个 1e9 相加 = 1e14，int 上限只有 2.1e9",
        "用 int 存中间和，即使最终答案很小也会在过程中溢出",
        "多组测试数据时忘记每轮把 sum 清零"],
  va: "改成求「区间和」就升级为前缀和；改成求「子数组最大和」就是最大子段和（Kadane）",
},

"max-array": {
  rec: "求最大值 / 最小值 / 极值所在下标，通常还要输出位置。",
  idea: "维护当前最优值与它的下标，遇到更优就替换。比较时用严格大于可以保证取到「第一个」最大值。",
  key: "初始值不要写 0，要写「第一个元素」或极小值，否则全负数数组会错。",
  cpp: `int mx = a[0], pos = 0;
for (int i = 1; i < n; i++)
    if (a[i] > mx) { mx = a[i]; pos = i; }   // > 取第一个最大值
cout << mx << " " << pos << "\\n";`,
  py: `mx = max(a); pos = a.index(mx)   # index 天然返回第一个`,
  time: "O(n)", sp: "O(1)",
  pit: ["mx 初始化为 0，全负数时输出 0", "题目下标从 1 开始时忘记 +1", "用 >= 会取到最后一个最大值，与题意不符"],
  va: "同时求最大和最小只需遍历一次，两个变量分别维护",
},

"reverse-array": {
  rec: "原地逆序 / 翻转数组，要求不额外开空间。",
  idea: "双指针从两端向中间靠拢，每次交换一对元素。循环结束时 n/2 对全部交换完成。",
  key: "循环条件写 i < n/2 或 i < j，写成 i <= j 会重复交换两次等于没换。",
  cpp: `for (int i = 0, j = n - 1; i < j; i++, j--)
    swap(a[i], a[j]);`,
  py: `a.reverse()      # 原地
# 或 a[:] = a[::-1]`,
  time: "O(n)", sp: "O(1)",
  pit: ["循环写到 i <= n/2，中间元素被交换两次", "输出格式要求空格分隔且行末不能有多余空格"],
  va: "逆序对计数是另一回事（用归并排序或树状数组，O(n log n)）",
},

"matrix-transpose": {
  rec: "矩阵转置 / 沿主对角线翻转 / 输出转置后的行列。",
  idea: "结果矩阵的第 i 行第 j 列等于原矩阵第 j 行第 i 列。原地转置只遍历上三角并交换 (i,j) 与 (j,i)。",
  key: "原地转置只能处理方阵；非方阵必须新开一个 n×m 的结果矩阵。",
  cpp: `// 非方阵：新开矩阵
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        b[j][i] = a[i][j];

// 方阵原地
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        swap(a[i][j], a[j][i]);`,
  py: `b = [list(row) for row in zip(*a)]   # zip 天然转置`,
  time: "O(n·m)", sp: "O(1) 原地 / O(n·m) 新建",
  pit: ["行列写反：b[i][j] = a[i][j] 等于复制", "非方阵却用原地交换，越界", "输出时行列顺序搞反"],
  va: "旋转 90° = 先转置再左右翻转；逆时针 = 先转置再上下翻转",
},

/* ---------------- 排序 ---------------- */
"bubble-sort": {
  rec: "明确要求「冒泡排序」过程，或输出每一轮交换后的数组。",
  idea: "相邻两两比较，逆序就交换。每一轮把当前未排序部分的最大值「冒」到末尾，第 i 轮结束后末尾 i 个元素已就位。",
  key: "内层循环上界是 n-1-i，因为末尾 i 个已经排好，再比就是浪费。加一个 swapped 标记可提前退出。",
  cpp: `for (int i = 0; i < n - 1; i++) {
    bool sw = false;
    for (int j = 0; j < n - 1 - i; j++)
        if (a[j] > a[j + 1]) { swap(a[j], a[j + 1]); sw = true; }
    if (!sw) break;          // 已经有序，提前结束
}`,
  py: `for i in range(n - 1):
    sw = False
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]; sw = True
    if not sw: break`,
  time: "O(n²)，最好 O(n)（已有序）", sp: "O(1)",
  pit: ["内层上界写成 n-1，越界访问 a[j+1]", "需要稳定排序时用 > 不用 >=，否则相等元素会被交换",
        "要求输出每轮结果时，把输出放在了提前 break 之后"],
  va: "选择排序每轮只交换一次；插入排序在近乎有序的数组上更快",
},

"count-inversions": {
  rec: "统计「前面比后面大」的数对个数，或「至少需要多少次相邻交换」。",
  idea: "本质是逆序对。冒泡计数是 O(n²)，正解用归并排序：合并两个有序段时，右段元素被提前取走一次，就贡献「左段剩余元素个数」个逆序对。",
  key: "答案最大 n(n-1)/2，n=1e5 时约 5e9，必须 long long。",
  cpp: `long long cnt = 0;
void mergeSort(int l, int r) {
    if (l >= r) return;
    int mid = (l + r) >> 1;
    mergeSort(l, mid); mergeSort(mid + 1, r);
    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];       // <= 保证稳定
        else { cnt += mid - i + 1; tmp[k++] = a[j++]; }   // 右段小，左段剩下的都构成逆序
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= r)   tmp[k++] = a[j++];
    for (int t = 0; t < k; t++) a[l + t] = tmp[t];
}`,
  py: `# 树状数组解法：从右往左扫，统计已出现的比当前小的个数
def add(i):
    while i <= n: bit[i] += 1; i += i & -i
def qry(i):
    s = 0
    while i > 0: s += bit[i]; i -= i & -i
    return s`,
  time: "O(n log n)", sp: "O(n)",
  pit: ["cnt 用 int 溢出（n=1e5 时逆序对可达 5e9）",
        "合并时用 < 而不是 <=，相等元素被算成逆序，结果偏大",
        "递归深度 1e5 时可能爆栈，改用迭代或增大栈"],
  va: "「交换成有序的最小相邻交换次数」等于逆序对数；「交换任意两个元素的最小次数」等于 n - 环个数",
},

"sort-multi-key": {
  rec: "按多个字段排序：先按分数降序，分数相同按姓名升序之类。",
  idea: "把多个键合成一个比较函数，返回第一个不相等字段的比较结果；全相等再比下一个。降序对调比较方向即可。",
  key: "比较函数必须满足严格弱序（不能出现 a<b 和 b<a 同时为假却返回相等的情况），否则 sort 行为未定义。",
  cpp: `struct Node { string name; int score, id; };
sort(v.begin(), v.end(), [](const Node &x, const Node &y) {
    if (x.score != y.score) return x.score > y.score;   // 分数降序
    if (x.name  != y.name)  return x.name  < y.name;    // 姓名升序
    return x.id < y.id;                                 // 兜底，避免并列
});`,
  py: `v.sort(key=lambda t: (-t.score, t.name, t.id))   # 负号实现降序`,
  time: "O(n log n)", sp: "O(1) 额外（原地）",
  pit: ["只写第一个键，相等时顺序不稳定导致答案错", "需要输出「原来第几个」时必须带原始下标",
        "多键比较时漏掉最后一层兜底，导致并列元素顺序随机"],
  va: "需要稳定排序时用 stable_sort；键很多时可以先按最后一键排，再依次向前稳定排序",
},

"merge-two-sorted": {
  rec: "两个有序数组合并成一个有序数组 / 归并排序的合并步骤。",
  idea: "两个指针各指向一个数组的头，每次取较小的那个放入结果并前移。一个走完后把另一个剩余部分整体接上。",
  key: "剩余部分可以直接整段拷贝（memcpy / 切片），不需要逐个元素循环。",
  cpp: `int i = 0, j = 0, k = 0;
while (i < n && j < m)
    res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];   // <= 保证稳定
while (i < n) res[k++] = a[i++];
while (j < m) res[k++] = b[j++];`,
  py: `res = []
while a and b:
    res.append(a.pop(0) if a[0] <= b[0] else b.pop(0))  # 注意 pop(0) 是 O(n)
res += a + b`,
  time: "O(n + m)", sp: "O(n + m)",
  pit: ["漏掉剩余部分拷贝", "比较用 < 而不是 <=，相等元素顺序被颠倒（影响稳定性）",
        "Python 里用 pop(0) 会退化成 O(n²)，应该用下标或 heapq.merge"],
  va: "多个有序数组合并用优先队列（k 路归并），时间 O(N log k)",
},

/* ---------------- 二分 ---------------- */
"binary-search": {
  rec: "有序数组里找某个值 / 找是否存在，或「答案具有单调性可以二分」。",
  idea: "每次把搜索区间砍一半：比较中点与目标，缩小到左半或右半。区间长度每次至少减 1，最多 log2(n) 次收敛。",
  key: "区间定义要统一：用左闭右闭 [l, r]，循环条件 l <= r，中点 mid = l + (r - l) / 2 防溢出。",
  cpp: `int l = 0, r = n - 1, ans = -1;
while (l <= r) {
    int mid = l + (r - l) / 2;      // 防 (l+r) 溢出
    if (a[mid] == x) { ans = mid; break; }
    else if (a[mid] < x) l = mid + 1;
    else r = mid - 1;
}
cout << ans << "\\n";`,
  py: `import bisect
i = bisect.bisect_left(a, x)
print(i if i < len(a) and a[i] == x else -1)`,
  time: "O(log n)", sp: "O(1)",
  pit: ["mid = (l + r) / 2 在 l, r 接近 INT_MAX 时溢出", "循环条件写 l < r 却用 r = mid，可能死循环",
        "数组无序却直接二分（除非题目保证有序）"],
  va: "找第一个 ≥ x 的位置用 lower_bound（左边界）；找最后一个 ≤ x 用 upper_bound - 1",
},

"binary-leftmost": {
  rec: "有序数组里找「第一个等于 x」「最后一个等于 x」或「第一个大于 x」。",
  idea: "二分不急着返回，而是记录当前答案后继续向目标方向收缩。左边界：命中后 r = mid - 1 继续往左找；右边界对称。",
  key: "用「可行区间」思维：把问题变成「最小的满足条件的位置」，每次判断 mid 是否可行。",
  cpp: `// 第一个 >= x
int lowerBound(int x) {
    int l = 0, r = n;              // 注意 r = n，答案可能是 n（不存在）
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (a[mid] >= x) r = mid;  // mid 可行，答案在 [l, mid]
        else l = mid + 1;
    }
    return l;
}
// 最后一个 <= x = upperBound(x+1) - 1`,
  py: `# bisect_left 返回第一个 >= x 的下标
import bisect
first = bisect.bisect_left(a, x)
last  = bisect.bisect_right(a, x) - 1
cnt   = last - first + 1        # 出现次数`,
  time: "O(log n)", sp: "O(1)",
  pit: ["r 初始化为 n-1 而不是 n，导致「不存在」时返回错误下标", "存在多个相同值时随便返回一个，不是最左",
        "统计出现次数时忘记判断 first 是否真的等于 x"],
  va: "「第一个使得 check(mid) 为真的位置」是最通用的二分模板，能覆盖 90% 的二分题",
},

"binary-sqrt": {
  rec: "求平方根 / 开 k 次方 / 判断完全平方数，要求整数部分或精度。",
  idea: "在答案范围 [0, x] 上二分答案：每次判断 mid² ≤ x，满足就往右找更大的，最后得到整数平方根。",
  key: "mid*mid 在 mid 达 5e4 时约 2.5e9 会爆 int，必须用 long long 或改用 mid <= x / mid 避免乘法。",
  cpp: `int mySqrt(int x) {
    long long l = 0, r = x, ans = 0;
    while (l <= r) {
        long long mid = l + (r - l) / 2;
        if (mid * mid <= (long long)x) { ans = mid; l = mid + 1; }
        else r = mid - 1;
    }
    return (int)ans;
}`,
  py: `l, r, ans = 0, x, 0
while l <= r:
    mid = (l + r) // 2
    if mid * mid <= x: ans, l = mid, mid + 1
    else: r = mid - 1
print(ans)`,
  time: "O(log x)", sp: "O(1)",
  pit: ["mid*mid 溢出 int", "浮点二分忘记控制迭代次数（用 for 100 次比 while 更稳）",
        "x = 0 / 1 时边界返回错"],
  va: "浮点开方用「二分 100 次」或牛顿迭代；三次方根同理",
},

"rotated-min": {
  rec: "原本有序的数组被旋转过（如 [4,5,6,1,2,3]），求最小值。",
  idea: "二分中点与右端点比较：mid 比右端大说明最小值在右半，否则在左半（含 mid）。每次区间缩短一半。",
  key: "与右端点比较而不是左端点，因为「旋转后左段整体大于右段」，右端点代表右段。",
  cpp: `int findMin(vector<int>& a) {
    int l = 0, r = a.size() - 1;
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (a[mid] > a[r]) l = mid + 1;   // 最小值一定在 mid 右边
        else r = mid;                      // mid 可能就是最小值
    }
    return a[l];
}`,
  py: `l, r = 0, len(a) - 1
while l < r:
    mid = (l + r) // 2
    if a[mid] > a[r]: l = mid + 1
    else: r = mid
print(a[l])`,
  time: "O(log n)", sp: "O(1)",
  pit: ["用 a[l] 比较，遇到完全有序的数组（未旋转）会出错", "有重复元素时 a[mid] == a[r] 需要 r-- 单独处理",
        "while 写成 l <= r，r = mid 时死循环"],
  va: "旋转数组查找某个值：先判断哪一半有序，再决定是否在该半二分",
},

"count-occur": {
  rec: "统计某个数在有序数组中出现次数。",
  idea: "两次二分分别求左边界和右边界，出现次数 = 右 - 左 + 1。O(log n) 完成，优于线性扫描。",
  key: "不存在时两个边界会相等且不指向目标值，必须额外判断。",
  cpp: `int lo = lower_bound(a, a + n, x) - a;
int hi = upper_bound(a, a + n, x) - a;   // 第一个 > x
cout << (lo < n && a[lo] == x ? hi - lo : 0) << "\\n";`,
  py: `import bisect
lo = bisect.bisect_left(a, x); hi = bisect.bisect_right(a, x)
print(hi - lo)   # 不存在时天然为 0`,
  time: "O(log n)", sp: "O(1)",
  pit: ["用一次二分找到后向两边线性扩展，最坏退化成 O(n)", "忘记判断 lo 是否越界",
        "手写 upper_bound 时返回的是「第一个大于」而不是「最后一个等于」"],
  va: "统计区间内元素个数 = upper_bound(r) - lower_bound(l)",
},

"binary-ship-capacity": {
  rec: "「最小的最大」「最大的最小」这类最值问题，判定函数单调。",
  idea: "二分答案：猜测一个容量 cap，用一个贪心判定函数检查能否在限定天数内运完。cap 越大越容易，因此单调，可以二分。",
  key: "二分下界取「单个最大重量」，上界取「总重量」。每次判定 O(n)，总复杂度 O(n log sum)。",
  cpp: `bool ok(long long cap, int D) {
    long long cur = 0; int days = 1;
    for (int i = 0; i < n; i++) {
        if (cur + w[i] > cap) { days++; cur = 0; }   // 装不下就开新的一天
        cur += w[i];
        if (days > D) return false;
    }
    return true;
}
long long l = *max_element(w, w + n), r = accumulate(w, w + n, 0LL), ans = r;
while (l <= r) {
    long long mid = l + (r - l) / 2;
    if (ok(mid, D)) { ans = mid; r = mid - 1; }
    else l = mid + 1;
}`,
  py: `def ok(cap):
    days, cur = 1, 0
    for x in w:
        if cur + x > cap: days += 1; cur = 0
        cur += x
    return days <= D`,
  time: "O(n log Σw)", sp: "O(1)",
  pit: ["判定函数里「恰好装满」和「装不下就换天」逻辑写反", "下界取 0 会进入死循环或无意义区间",
        "总重量用 int 溢出"],
  va: "「分割数组的最大值」「按时完成任务的最少时间」都是同一模板：二分答案 + 贪心判定",
},

/* ---------------- 前缀和 / 差分 ---------------- */
"prefix-sum": {
  rec: "多次询问区间和，数组不变。",
  idea: "预处理前缀和 S[i] = a[1]+…+a[i]，则区间 [l, r] 的和 = S[r] - S[l-1]，每次查询 O(1)。用 O(n) 预处理换 O(m) 次查询。",
  key: "前缀和数组要开 n+1 大小并让 S[0] = 0，这样 l=1 时不用特判。",
  cpp: `vector<long long> s(n + 1, 0);
for (int i = 1; i <= n; i++) s[i] = s[i - 1] + a[i];
// 查询 [l, r]
cout << s[r] - s[l - 1] << "\\n";`,
  py: `s = [0] * (n + 1)
for i in range(1, n + 1): s[i] = s[i - 1] + a[i - 1]
print(s[r] - s[l - 1])`,
  time: "预处理 O(n)，每次查询 O(1)", sp: "O(n)",
  pit: ["忘记 S[0] = 0，导致 l = 1 时访问 S[0] 越界或得到错误值",
        "前缀和数组用 int 溢出", "l、r 是 1-based 还是 0-based 混用"],
  va: "二维前缀和 / 前缀积（遇到 0 要特殊处理）/ 前缀异或（区间异或 = 前缀异或再异或）",
},

"diff-range": {
  rec: "多次对区间整体加同一个值，最后一次性输出整个数组。",
  idea: "差分是前缀和的逆运算：对 [l, r] 加 v，只需 d[l] += v、d[r+1] -= v。所有操作做完后对 d 求一次前缀和就还原出数组。",
  key: "差分数组要开到 n+2，因为 r+1 可能等于 n+1。",
  cpp: `vector<long long> d(n + 2, 0);
while (m--) {
    int l, r; long long v; cin >> l >> r >> v;
    d[l] += v; d[r + 1] -= v;
}
for (int i = 1; i <= n; i++) d[i] += d[i - 1];   // 前缀和还原`,
  py: `d = [0] * (n + 2)
for _ in range(m):
    l, r, v = map(int, input().split())
    d[l] += v; d[r + 1] -= v
for i in range(1, n + 1): d[i] += d[i - 1]`,
  time: "O(n + m)", sp: "O(n)",
  pit: ["r + 1 越界（差分数组只开 n）", "忘记最后求前缀和就直接输出 d",
        "把差分写成前缀和，方向搞反"],
  va: "二维差分处理矩阵区域加；树上差分处理路径加",
},

"prefix-2d": {
  rec: "多次询问子矩阵元素和。",
  idea: "二维前缀和 S[i][j] 表示左上角 (1,1) 到 (i,j) 的和。查询 (x1,y1)-(x2,y2) 用容斥：S[x2][y2] - S[x1-1][y2] - S[x2][y1-1] + S[x1-1][y1-1]。",
  key: "容斥的四个角容易写错，记「右下 - 上 - 左 + 左上」。",
  cpp: `// 预处理
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + a[i][j];
// 查询
long long q = s[x2][y2] - s[x1-1][y2] - s[x2][y1-1] + s[x1-1][y1-1];`,
  py: `s = [[0]*(m+1) for _ in range(n+1)]
for i in range(1, n+1):
    for j in range(1, m+1):
        s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + a[i-1][j-1]`,
  time: "预处理 O(n·m)，查询 O(1)", sp: "O(n·m)",
  pit: ["容斥少减或多加一块", "下标 0-based 与 1-based 混用导致整行偏移",
        "n·m 达 1e6 时二维数组内存超限，需要滚动数组"],
  va: "二维差分是它的逆运算，用于区域加值",
},

/* ---------------- 双指针 ---------------- */
"two-sum-sorted": {
  rec: "有序数组中找两个数之和等于目标值。",
  idea: "左右指针向中间收缩：和偏小就左指针右移（增大），和偏大就右指针左移（减小）。每次必能排除一个元素，O(n) 收敛。",
  key: "数组必须有序。无序版本要先排序并记住原下标，或者用哈希表 O(n)。",
  cpp: `int l = 0, r = n - 1;
while (l < r) {
    long long s = a[l] + a[r];
    if (s == target) { cout << l << " " << r; break; }
    else if (s < target) l++;
    else r--;
}`,
  py: `l, r = 0, n - 1
while l < r:
    s = a[l] + a[r]
    if s == target: break
    elif s < target: l += 1
    else: r -= 1`,
  time: "O(n)", sp: "O(1)",
  pit: ["a[l]+a[r] 溢出 int", "用 l <= r 而不是 l < r，同一个元素被用两次",
        "要求返回 1-based 下标时忘记 +1"],
  va: "三数之和 = 固定一个 + 双指针，注意去重；最接近的三数之和用一个变量维护最小差",
},

"max-water": {
  rec: "两条垂线加 x 轴围成的最大容器 / 最大面积。",
  idea: "面积由「较短边 × 底边宽」决定。从两端开始，每次移动较短的那条边——因为移动长边只会让宽度变小而高度受限于短边，结果不会变好。",
  key: "正确性靠「排除法」：当前较短边无论和谁配，面积都不会超过当前值，因此可以安全丢弃。",
  cpp: `int l = 0, r = n - 1, best = 0;
while (l < r) {
    best = max(best, min(a[l], a[r]) * (r - l));
    if (a[l] < a[r]) l++; else r--;
}`,
  py: `l, r, best = 0, n - 1, 0
while l < r:
    best = max(best, min(a[l], a[r]) * (r - l))
    if a[l] < a[r]: l += 1
    else: r -= 1`,
  time: "O(n)", sp: "O(1)",
  pit: ["每次移动较高的一边（会漏掉最优解）", "面积用 int 溢出（高度 1e9 × 宽度 1e5）",
        "忘记取绝对值/宽度计算写成 r - l + 1"],
  va: "接雨水是加强版：需要额外维护左右最大值数组，或用单调栈",
},

"rain-water": {
  rec: "柱状图能接多少雨水 / 凹槽积水。",
  idea: "每个位置的水高 = min(左侧最大高度, 右侧最大高度) - 自身高度（小于 0 则取 0）。预处理两个方向的极值数组后一次求和；双指针可把空间降到 O(1)。",
  key: "关键是「短板效应」：水位由左右两侧较矮的那道墙决定。",
  cpp: `// 双指针 O(1) 空间
int l = 0, r = n - 1, lm = 0, rm = 0, ans = 0;
while (l < r) {
    if (a[l] < a[r]) {
        lm = max(lm, a[l]); ans += lm - a[l]; l++;
    } else {
        rm = max(rm, a[r]); ans += rm - a[r]; r--;
    }
}`,
  py: `l, r, lm, rm, ans = 0, n-1, 0, 0, 0
while l < r:
    if a[l] < a[r]:
        lm = max(lm, a[l]); ans += lm - a[l]; l += 1
    else:
        rm = max(rm, a[r]); ans += rm - a[r]; r -= 1`,
  time: "O(n)", sp: "O(1)",
  pit: ["先算加法后更新最大值，导致自身高度被当成水位", "相减出现负数没有取 max(0, …)",
        "用单调栈时把「宽度」算错"],
  va: "二维接雨水用「木桶原理 + 优先队列从边界向内灌水」",
},

"dedup-sorted": {
  rec: "有序数组原地去重，返回新长度。",
  idea: "快慢指针：慢指针指向最后一个已去重的位置，快指针扫描，遇到不同的值就写到慢指针的下一位。",
  key: "原地写指针永远不会超过读指针，所以不会覆盖未读数据。",
  cpp: `if (n == 0) { cout << 0; return; }
int k = 1;
for (int i = 1; i < n; i++)
    if (a[i] != a[k - 1]) a[k++] = a[i];
cout << k << "\\n";`,
  py: `k = 1
for i in range(1, n):
    if a[i] != a[k-1]: a[k] = a[i]; k += 1`,
  time: "O(n)", sp: "O(1)",
  pit: ["a[i] != a[i-1] 在已经覆盖后比较的是新值，会出错", "n = 0 未特判，k-1 越界",
        "题目要求返回新数组而不是长度，输出格式不符"],
  va: "每个元素最多保留两次：增加一个计数；移除元素（删除指定值）用同样的快慢指针",
},

/* ---------------- 滑动窗口 ---------------- */
"window-sum": {
  rec: "求长度固定为 k 的子数组最大和 / 平均最大。",
  idea: "先算第一个窗口的和，然后每次「进一个、出一个」，用 O(1) 更新窗口和。总复杂度 O(n)。",
  key: "窗口和用前缀和也能算，但滑窗写法常数更小、更直观。",
  cpp: `long long s = 0;
for (int i = 0; i < k; i++) s += a[i];
long long best = s;
for (int i = k; i < n; i++) {
    s += a[i] - a[i - k];        // 进 a[i]，出 a[i-k]
    best = max(best, s);
}`,
  py: `s = sum(a[:k]); best = s
for i in range(k, n):
    s += a[i] - a[i-k]
    best = max(best, s)`,
  time: "O(n)", sp: "O(1)",
  pit: ["k > n 时没有特判", "窗口和用 int 溢出", "循环里更新顺序写反（先减后加也算对，但别漏项）"],
  va: "长度不固定的窗口用「右指针扩张 + 左指针收缩」的模板，配合条件判定",
},

"slide-max": {
  rec: "每个长度为 k 的窗口里的最大值。",
  idea: "单调队列维护窗口内「可能成为最大值」的下标，队列按值递减。新元素进来时把队尾比它小的全部弹出，队首就是当前最大值。",
  key: "队首过期（下标 ≤ i-k）时要弹出；队列存下标而不是值，才能判断过期。",
  cpp: `deque<int> q;
for (int i = 0; i < n; i++) {
    while (!q.empty() && a[q.back()] <= a[i]) q.pop_back();
    q.push_back(i);
    if (q.front() <= i - k) q.pop_front();       // 过期
    if (i >= k - 1) cout << a[q.front()] << " ";
}`,
  py: `from collections import deque
q = deque()
for i, x in enumerate(a):
    while q and a[q[-1]] <= x: q.pop()
    q.append(i)
    if q[0] <= i - k: q.popleft()
    if i >= k - 1: print(a[q[0]], end=' ')`,
  time: "O(n)（每个元素进出队各一次）", sp: "O(k)",
  pit: ["队列里存值而不是下标，无法判断过期", "用 <= 还是 < 决定相等元素保留策略，影响某些题目的答案",
        "窗口还没满就输出"],
  va: "滑动窗口最小值对称；「和至少为 K 的最短子数组」用前缀和 + 单调队列",
},

"min-window": {
  rec: "包含目标串所有字符的最短子串。",
  idea: "右指针扩张直到满足条件，然后左指针尽量收缩并记录最短答案。用一个 need 计数（还需匹配多少种字符）来判断是否满足，避免每次遍历。",
  key: "字母表大小写敏感；need 用计数表；当某字符计数降到 0 才 need--。",
  cpp: `int cnt[128] = {0}, need = 0;
for (char c : t) { if (cnt[c]++ == 0) need++; }
int l = 0, bestL = 0, bestLen = INT_MAX;
for (int r = 0; r < n; r++) {
    if (--cnt[s[r]] == 0) need--;          // 用负数表示「多给了」
    while (need == 0) {
        if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
        if (cnt[s[l]]++ == 0) need++;      // 移出导致缺少
        l++;
    }
}`,
  py: `from collections import Counter
need = Counter(t); missing = len(t)
l = 0; best = (0, len(s) + 1)
for r, c in enumerate(s):
    if need[c] > 0: missing -= 1
    need[c] -= 1
    while missing == 0:
        if r - l + 1 < best[1]: best = (l, r - l + 1)
        need[s[l]] += 1
        if need[s[l]] > 0: missing += 1
        l += 1`,
  time: "O(n + m)", sp: "O(字符集)",
  pit: ["用 set 判断覆盖导致每次 O(26)，常数大但不错；用数组计数更稳",
        "need 的加减方向搞反，导致窗口永远不满足", "左指针收缩时忘记恢复计数"],
  va: "「最长无重复子串」是同类模板：条件改成「窗口内无重复」",
},

/* ---------------- 字符串 ---------------- */
"reverse-string": {
  rec: "翻转字符串 / 单词 / 按单词逆序。",
  idea: "整体翻转 + 逐词翻转，是「单词顺序反转但不反转单词内部」的标准两步法。只翻转字符串本身则首尾双指针交换。",
  key: "处理连续空格和首尾空格是易错点；用 stringstream 天然分词。",
  cpp: `// 每个单词内部逆序，单词顺序不变 → 直接双指针
for (int i = 0, j = n - 1; i < j; i++, j--) swap(s[i], s[j]);

// 单词顺序反转（内部不变）：先整体反转，再逐个单词反转
reverse(s.begin(), s.end());
int st = 0;
for (int i = 0; i <= n; i++)
    if (i == n || s[i] == ' ') { reverse(s.begin() + st, s.begin() + i); st = i + 1; }`,
  py: `s = s[::-1]                       # 整体翻转
words = s.split()                 # 自动处理多余空格
print(" ".join(w[::-1] for w in words))	# 单词内也翻转`,
  time: "O(n)", sp: "O(1) 原地 / O(n) 新建",
  pit: ["多空格被压缩成一个（split 会，手写要跳过连续空格）", "未处理首尾空格",
        "中文/UTF-8 字符按字节翻转会出现乱码"],
  va: "左旋转字符串 = 整体翻转 + 分段翻转（三次翻转法）",
},

"palindrome": {
  rec: "判断回文 / 最长回文子串 / 回文数。",
  idea: "判断回文用双指针；最长回文子串用「中心扩展」（每个位置/每对位置向两边扩）或 Manacher。中心扩展 O(n²) 但常数小、最好写。",
  key: "回文中心有 2n-1 个（n 个奇中心 + n-1 个偶中心），漏掉偶中心是最常见错误。",
  cpp: `bool isPal(const string &s) {
    int i = 0, j = s.size() - 1;
    while (i < j) if (s[i++] != s[j--]) return false;
    return true;
}
// 最长回文子串：中心扩展
int expand(int l, int r) {
    while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
    return r - l - 1;
}
int best = 0;
for (int i = 0; i < n; i++) best = max({best, expand(i, i), expand(i, i + 1)});`,
  py: `def expand(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1; r += 1
    return r - l - 1
best = max(max(expand(i, i), expand(i, i+1)) for i in range(len(s)))`,
  time: "判断 O(n)，最长回文 O(n²)", sp: "O(1)",
  pit: ["只考虑奇数长度中心，漏掉偶数长度回文", "空串和单字符要返回正确结果",
        "忽略大小写/非字母字符的题目要预处理"],
  va: "Manacher 把最长回文做到 O(n)；回文分割用区间 DP",
},

"char-count": {
  rec: "统计字符出现次数 / 第一个不重复字符 / 变位词判断。",
  idea: "用固定大小的计数数组（ASCII 128 或 26 个小写字母）替代哈希表，常数更小。两次遍历：先统计，再找答案。",
  key: "字符可能含大写、空格、标点，数组开 128 或 256 更安全。",
  cpp: `int cnt[128] = {0};
for (char c : s) cnt[c]++;
for (int i = 0; i < n; i++)
    if (cnt[s[i]] == 1) { cout << i; break; }   // 第一个不重复`,
  py: `from collections import Counter
cnt = Counter(s)
for i, c in enumerate(s):
    if cnt[c] == 1: print(i); break`,
  time: "O(n)", sp: "O(1)（字符集固定）",
  pit: ["数组只开 26 但输入含大写/空格导致越界", "找「第一个不重复」时遍历原串而不是计数表（顺序错）",
        "多组数据处理前忘记清空计数数组"],
  va: "变位词 = 排序后比较 / 计数数组逐位比较；众数用 Boyer-Moore 投票",
},

"rle": {
  rec: "压缩字符串（连续相同字符写成「字符+次数」）/ 解压。",
  idea: "压缩：遍历并统计连续相同字符的个数，遇到不同就输出上一段。解压：识别数字与字符，重复展开。",
  key: "计数可能超过 9（多位数），解压时要逐位解析数字而不是只读一位。",
  cpp: `string zip(const string &s) {
    string r;
    for (int i = 0; i < (int)s.size(); ) {
        int j = i;
        while (j < (int)s.size() && s[j] == s[i]) j++;
        r += s[i] + to_string(j - i);
        i = j;
    }
    return r;
}`,
  py: `import re
def zip(s):
    return re.sub(r'(.)\\1*', lambda m: m.group(1) + str(len(m.group(0))), s)
def unzip(s):
    return re.sub(r'(.)(\\d+)', lambda m: m.group(1) * int(m.group(2)), s)`,
  time: "O(n)", sp: "O(n)",
  pit: ["只处理单数字次数，遇到 10 以上就错", "最后一段没有输出（循环结束后忘记收尾）",
        "空串返回空串而不是异常"],
  va: "行程编码的进阶是 LZW / Huffman，属于压缩算法范畴",
},

"anagram-pairs": {
  rec: "找出所有变位词 / 字母异位词分组。",
  idea: "把每个单词归一化成「键」：排序后的字符串，或 26 个字母的计数签名。键相同的分到一组。",
  key: "排序键 O(L log L)，计数键 O(L)，L 大时计数更快。",
  cpp: `unordered_map<string, vector<string>> g;
for (auto &w : words) {
    string k = w;
    sort(k.begin(), k.end());     // 归一化
    g[k].push_back(w);
}`,
  py: `from collections import defaultdict
g = defaultdict(list)
for w in words:
    g[''.join(sorted(w))].append(w)`,
  time: "O(n·L log L)", sp: "O(n·L)",
  pit: ["键用原始字符串，等于没分组", "区分大小写/空格未处理", "输出顺序要求字典序时需要额外排序"],
  va: "两字符串是否互为变位词：长度不同直接 false，再用计数数组比较",
},

"trie-prefix": {
  rec: "前缀查询 / 单词插入 / 自动补全 / 最大异或对。",
  idea: "字典树每个节点代表一个前缀，边是字符。插入与查询都从根出发逐字符走，走到末尾标记单词结束。",
  key: "节点数上限 = 总字符数 + 1；用数组模拟（child[N][26]）比指针快且好写。",
  cpp: `int ch[N][26], cnt[N], tot = 0;   // N = 总字符数 + 5
void insert(const string &s) {
    int p = 0;
    for (char c : s) {
        int &q = ch[p][c - 'a'];
        if (!q) q = ++tot;
        p = q;
    }
    cnt[p]++;                       // 标记单词结束
}
bool query(const string &s) {
    int p = 0;
    for (char c : s) { p = ch[p][c - 'a']; if (!p) return false; }
    return cnt[p] > 0;
}`,
  py: `ch = [[0]*26]; cnt = [0]
def insert(s):
    p = 0
    for c in s:
        i = ord(c) - 97
        if not ch[p][i]:
            ch.append([0]*26); cnt.append(0); ch[p][i] = len(ch) - 1
        p = ch[p][i]
    cnt[p] += 1`,
  time: "O(L) 每次操作", sp: "O(总字符数 × 26)",
  pit: ["N 开小了导致越界（总字符数可达 1e6）", "查询前缀和查询完整单词混为一谈",
        "大小写/数字字符映射越界"],
  va: "01 Trie 求最大异或对：把数字按二进制位插入，查询时尽量走相反的位",
},

"kmp-first": {
  rec: "在主串里找模式串第一次出现的位置。",
  idea: "预处理模式串的 next（最长相同前后缀）数组。匹配失败时用 next 把模式串「滑到」下一个可能匹配的位置，主串指针不回头。",
  key: "next[i] 表示 p[0..i] 的最长相等前后缀长度；失配时 j = next[j-1]。这是 O(n+m) 的关键。",
  cpp: `vector<int> buildNext(const string &p) {
    vector<int> nx(p.size(), 0);
    for (int i = 1, j = 0; i < (int)p.size(); i++) {
        while (j && p[i] != p[j]) j = nx[j - 1];
        if (p[i] == p[j]) j++;
        nx[i] = j;
    }
    return nx;
}
int kmp(const string &s, const string &p) {
    auto nx = buildNext(p);
    for (int i = 0, j = 0; i < (int)s.size(); i++) {
        while (j && s[i] != p[j]) j = nx[j - 1];
        if (s[i] == p[j]) j++;
        if (j == (int)p.size()) return i - j + 1;   // 第一次出现
    }
    return -1;
}`,
  py: `# Python 直接用 str.find 就是 KMP 级实现
print(s.find(p))`,
  time: "O(n + m)", sp: "O(m)",
  pit: ["next 数组的求法写成「前缀函数」但边界差一", "失配时 j = next[j] 而不是 next[j-1]",
        "要求所有出现位置时忘记 j 回退后继续"],
  va: "Z 函数 / 字符串哈希（O(n) 预处理 O(1) 比较）也能解决同类问题",
},

"bigint-add": {
  rec: "两个超大整数（超过 64 位）相加 / 相乘。",
  idea: "用字符串或数组按位模拟竖式加法：从低位到高位相加并处理进位，最后翻转。",
  key: "进位变量在循环结束后可能还有值（最高位进位），必须补上。",
  cpp: `string add(string a, string b) {
    reverse(a.begin(), a.end()); reverse(b.begin(), b.end());
    string r; int carry = 0;
    for (int i = 0; i < (int)max(a.size(), b.size()) || carry; i++) {
        int s = carry;
        if (i < (int)a.size()) s += a[i] - '0';
        if (i < (int)b.size()) s += b[i] - '0';
        r += char('0' + s % 10);
        carry = s / 10;
    }
    while (r.size() > 1 && r.back() == '0') r.pop_back();   // 去前导 0
    reverse(r.begin(), r.end());
    return r;
}`,
  py: `print(int(a) + int(b))          # Python 原生大整数
# 手写：用数组按位加，逻辑同上`,
  time: "O(max(len))", sp: "O(max(len))",
  pit: ["最高位进位丢失", "前导零未处理（如 0 + 0 输出 00）", "负数需要先判断符号再决定加还是减"],
  va: "大数乘法用竖式 O(n·m)，或 FFT O(n log n)",
},

"str-count-occur": {
  rec: "统计模式串在主串中出现几次（可重叠 / 不可重叠）。",
  idea: "KMP 匹配到一次后，把 j 回退到 next[j-1] 继续找下一次（可重叠）；不可重叠则直接 j = 0。",
  key: "「可重叠」和「不可重叠」的回退方式不同，这是本题的核心区别。",
  cpp: `int cnt = 0;
for (int i = 0, j = 0; i < (int)s.size(); i++) {
    while (j && s[i] != p[j]) j = nx[j - 1];
    if (s[i] == p[j]) j++;
    if (j == (int)p.size()) { cnt++; j = nx[j - 1]; }   // 可重叠
}`,
  py: `cnt, start = 0, 0
while True:
    i = s.find(p, start)
    if i < 0: break
    cnt += 1; start = i + 1     # 不可重叠改成 i + len(p)`,
  time: "O(n + m)", sp: "O(m)",
  pit: ["可重叠/不可重叠回退方式搞混", "空模式串要特殊处理", "计数用 int 溢出（n 很大时）"],
  va: "字符串哈希做法：预处理前缀哈希后 O(1) 判断每个位置是否匹配",
},

"str-longest-palindrome": {
  rec: "最长回文子串 / 回文子序列长度。",
  idea: "子串用中心扩展 O(n²) 或 Manacher O(n)；子序列用区间 DP：dp[i][j] = 两端相等时 dp[i+1][j-1]+2，否则 max(dp[i+1][j], dp[i][j-1])。",
  key: "子串连续、子序列不连续，两者的解法完全不同，先看清楚题目。",
  cpp: `// 子序列 DP
int dp[N][N] = {0};
for (int i = 0; i < n; i++) dp[i][i] = 1;
for (int len = 2; len <= n; len++)
    for (int i = 0; i + len - 1 < n; i++) {
        int j = i + len - 1;
        if (s[i] == s[j]) dp[i][j] = dp[i+1][j-1] + 2;
        else dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
    }`,
  py: `dp = [[0]*n for _ in range(n)]
for i in range(n): dp[i][i] = 1
for ln in range(2, n+1):
    for i in range(n-ln+1):
        j = i+ln-1
        dp[i][j] = dp[i+1][j-1] + 2 if s[i] == s[j] else max(dp[i+1][j], dp[i][j-1])`,
  time: "O(n²)", sp: "O(n²)",
  pit: ["把子序列当子串做", "len=2 时 dp[i+1][j-1] 越界（需要单独的初始化或哨兵）",
        "n 达 1e5 时 O(n²) 超时，必须用 Manacher"],
  va: "Manacher 通过插入分隔符把奇偶回文统一处理，O(n)",
},

/* ---------------- 数学 ---------------- */
"gcd-lcm": {
  rec: "求最大公约数 / 最小公倍数 / 分数化简。",
  idea: "欧几里得算法：gcd(a,b) = gcd(b, a mod b)，直到 b = 0 时 a 即为答案。LCM = a / gcd × b，先除后乘防溢出。",
  key: "LCM 必须先除后乘，直接 a*b 在 1e9 时立刻溢出。",
  cpp: `long long gcd(long long a, long long b) { return b ? gcd(b, a % b) : a; }
long long lcm(long long a, long long b) { return a / gcd(a, b) * b; }
// C++17 可直接用 std::gcd / std::lcm`,
  py: `import math
g = math.gcd(a, b)
l = a // g * b`,
  time: "O(log min(a,b))", sp: "O(1)",
  pit: ["lcm 写成 a*b/g 溢出", "负数传入时要先取绝对值", "多组数据递归深度不成问题但要注意 0 的处理"],
  va: "多个数的 gcd 用逐个累积；扩展欧几里得可解 ax+by=gcd(a,b)",
},

"prime-sieve": {
  rec: "求 1~n 内所有质数 / 质数个数 / 最小质因子。",
  idea: "埃氏筛：从 2 开始，把每个质数的倍数标记为合数。优化：内层从 i*i 开始（更小的倍数已被筛过），只用质数筛。线性筛（欧拉筛）保证每个合数只被最小质因子筛一次。",
  key: "内层 j 从 i*i 开始，且 i*i 可能溢出 int。",
  cpp: `vector<bool> isComp(n + 1, false);
vector<int> primes;
for (int i = 2; i <= n; i++) {
    if (!isComp[i]) primes.push_back(i);
    for (int p : primes) {
        if ((long long)i * p > n) break;
        isComp[i * p] = true;
        if (i % p == 0) break;      // 线性筛：保证只被最小质因子筛
    }
}`,
  py: `is_comp = [False]*(n+1); primes = []
for i in range(2, n+1):
    if not is_comp[i]: primes.append(i)
    for p in primes:
        if i*p > n: break
        is_comp[i*p] = True
        if i % p == 0: break`,
  time: "埃氏 O(n log log n)，线性 O(n)", sp: "O(n)",
  pit: ["n=1e7 时用 vector<bool> 才不超内存", "i*i 溢出 int（i 达 5e4 时）",
        "线性筛里 break 条件写错导致重复筛"],
  va: "筛法求欧拉函数、莫比乌斯函数都可以在同一个循环里顺带算",
},

"fast-pow": {
  rec: "求 a^b（可能要对 p 取模），b 可达 1e18。",
  idea: "二进制快速幂：把指数拆成二进制，每次平方底数，遇到 1 的位就乘进答案。O(log b) 完成。",
  key: "乘法中间结果要用 long long 承接再取模；指数为 0 返回 1（包括 0^0 按题目约定）。",
  cpp: `long long qpow(long long a, long long b, long long p) {
    long long r = 1 % p; a %= p;
    while (b) {
        if (b & 1) r = (__int128)r * a % p;    // 防溢出
        a = (__int128)a * a % p;
        b >>= 1;
    }
    return r;
}`,
  py: `print(pow(a, b, p))     # 内置三参数 pow 就是快速幂`,
  time: "O(log b)", sp: "O(1)",
  pit: ["a^b 整体溢出后才取模", "p=1 时答案应为 0（1 % p）", "指数是负数时不存在整数答案"],
  va: "矩阵快速幂可求线性递推（斐波那契第 n 项 O(log n)）",
},

"josephus": {
  rec: "n 个人围成一圈，每数到 m 淘汰一个，问最后剩下谁。",
  idea: "递推：f(1) = 0，f(i) = (f(i-1) + m) % i。含义是「i 个人时的胜者在 i-1 人局面里的编号」，倒推回去得到原始编号 +1。",
  key: "题目从 0 开始还是从 1 开始计数要看清，最后答案可能要 +1。",
  cpp: `int f = 0;                        // 1 个人时，胜者下标为 0
for (int i = 2; i <= n; i++) f = (f + m) % i;
cout << f + 1 << "\\n";            // 转成 1-based`,
  py: `f = 0
for i in range(2, n+1): f = (f + m) % i
print(f + 1)`,
  time: "O(n)", sp: "O(1)",
  pit: ["递推式写成 (f+m-1)%i 但最后又 +1，重复调整", "n 很大（1e9）时 O(n) 超时，需要分段加速",
        "m 很大时取模仍要算"],
  va: "m=2 时有 O(log n) 的位运算解法；一般情况可以用「跳跃淘汰」加速到 O(m log n)",
},

"moore-vote": {
  rec: "找出现次数超过一半的元素（保证存在）。",
  idea: "摩尔投票：维护候选人和票数，遇到相同票数 +1，不同票数 -1，票数归零时换候选人。超过一半的元素最终一定留下来。",
  key: "第二遍必须验证候选人的实际出现次数（题目不保证存在时）。",
  cpp: `int cand = a[0], cnt = 0;
for (int x : a) {
    if (cnt == 0) { cand = x; cnt = 1; }
    else if (x == cand) cnt++;
    else cnt--;
}
// 验证（不保证存在时必做）
int real = count(a.begin(), a.end(), cand);
cout << (real * 2 > n ? cand : -1);`,
  py: `cand, cnt = None, 0
for x in a:
    if cnt == 0: cand, cnt = x, 1
    elif x == cand: cnt += 1
    else: cnt -= 1
print(cand if a.count(cand) * 2 > len(a) else -1)`,
  time: "O(n)", sp: "O(1)",
  pit: ["不验证就输出，题目不保证存在时答案错", "票数归零判断放在循环开头还是结尾影响初始化",
        "要求输出所有出现超过 n/3 的元素时需要用两个候选人"],
  va: "超过 n/k 的元素最多 k-1 个，用 k-1 个候选人同时投票",
},

"prime-factor": {
  rec: "质因数分解 / 输出所有质因子 / 因子个数。",
  idea: "从 2 试除到 √n，能整除就连续除尽并记录。最后如果剩下来的数大于 1，它本身就是一个质因子。",
  key: "循环上界用 i*i <= n（或 i <= n/i）而不是 i <= sqrt(n)（浮点误差），且 n 在循环内会变小。",
  cpp: `vector<pair<long long,int>> fac;
for (long long i = 2; i * i <= n; i++) {
    if (n % i) continue;
    int c = 0;
    while (n % i == 0) { n /= i; c++; }
    fac.push_back({i, c});
}
if (n > 1) fac.push_back({n, 1});     // 剩下的一定是质数`,
  py: `fac = []; i = 2
while i * i <= n:
    while n % i == 0: fac.append(i); n //= i
    i += 1
if n > 1: fac.append(n)`,
  time: "O(√n)", sp: "O(1)",
  pit: ["漏掉最后剩余的质因子", "循环条件用 i <= sqrt(n) 有浮点误差",
        "n 是 1 或质数时结果为空/只有一个"],
  va: "1e9 以内的多组分解改用筛法预处理最小质因子 O(log n) 分解",
},

"divisor-count": {
  rec: "求约数个数 / 约数和 / 枚举所有约数。",
  idea: "约数成对出现：枚举到 √n，每找到 i 就同时得到 n/i。约数个数用质因数分解的指数连乘：∏(e_i + 1)。",
  key: "完全平方数会让 √n 这个约数只算一次，需要特判。",
  cpp: `int cnt = 0;
for (long long i = 1; i * i <= n; i++) {
    if (n % i) continue;
    cnt++;
    if (i != n / i) cnt++;       // 成对出现
}
cout << cnt << "\\n";`,
  py: `import math
cnt = 0
for i in range(1, int(math.isqrt(n)) + 1):
    if n % i == 0: cnt += 1 if i == n // i else 2`,
  time: "O(√n)", sp: "O(1)",
  pit: ["完全平方数重复计数", "i*i 溢出", "要求约数和时忘记把 n/i 也加上"],
  va: "1~n 所有数的约数个数用筛法 O(n log n)；约数和公式 = ∏(p^(e+1)-1)/(p-1)",
},

"pascal-row": {
  rec: "杨辉三角 / 组合数 C(n,k) / 第 k 行。",
  idea: "递推 C(n,k) = C(n-1,k-1) + C(n-1,k)，逐行滚动更新可以只用 O(k) 空间（倒序更新避免覆盖）。",
  key: "倒序遍历 j 才能保证用到的是上一行数据。",
  cpp: `vector<long long> C(k + 1, 0);
C[0] = 1;
for (int i = 1; i <= n; i++)
    for (int j = min(i, k); j >= 1; j--)     // 倒序
        C[j] += C[j - 1];
cout << C[k] << "\\n";`,
  py: `from math import comb
print(comb(n, k))     # Python 3.8+`,
  time: "O(n·k)", sp: "O(k)",
  pit: ["正序遍历导致用的是本行已更新的值（结果错）", "组合数溢出（需要取模或用大整数）",
        "k > n 时返回 0"],
  va: "大量组合数查询用阶乘 + 逆元预处理 O(1)；模数为质数才能用费马小定理求逆元",
},

"math-fast-pow": {
  rec: "矩阵快速幂 / 求递推式第 n 项（n 达 1e18）。",
  idea: "把递推写成矩阵乘法，再用快速幂求矩阵的 n 次方。斐波那契的转移矩阵是 [[1,1],[1,0]]。",
  key: "矩阵乘法的顺序不能交换；取模要在每次乘加后做。",
  cpp: `struct Mat { long long a[2][2]; };
Mat mul(Mat x, Mat y, long long p) {
    Mat r{};
    for (int i = 0; i < 2; i++) for (int j = 0; j < 2; j++)
        for (int k = 0; k < 2; k++)
            r.a[i][j] = (r.a[i][j] + x.a[i][k] * y.a[k][j]) % p;
    return r;
}
Mat mpow(Mat b, long long e, long long p) {
    Mat r{{{1,0},{0,1}}};         // 单位矩阵
    while (e) { if (e & 1) r = mul(r, b, p); b = mul(b, b, p); e >>= 1; }
    return r;
}`,
  py: `def mul(x, y):
    return [[sum(x[i][k]*y[k][j] for k in range(2)) % MOD for j in range(2)] for i in range(2)]`,
  time: "O(k³ log n)，k 为矩阵阶数", sp: "O(k²)",
  pit: ["单位矩阵初始化为全 1", "乘法顺序写反导致结果不同", "中间乘积溢出（需要 __int128 或先取模）"],
  va: "带常数项的递推要在矩阵里加一维；线性递推的通用解是 BM 算法 + 线性递推",
},

"math-sieve-count": {
  rec: "统计区间内质数个数 / 第 k 个质数。",
  idea: "先用筛法预处理到上界，再做前缀和数组，查询区间质数个数 O(1)。",
  key: "上界要按题目最大查询范围一次筛够，别每个查询都重筛。",
  cpp: `const int MAXN = 1e7 + 5;
vector<bool> comp(MAXN);
vector<int> pre(MAXN);           // 质数个数前缀和
for (int i = 2; i < MAXN; i++) {
    if (!comp[i]) for (long long j = (long long)i * i; j < MAXN; j += i) comp[j] = true;
    pre[i] = pre[i - 1] + (!comp[i]);
}`,
  py: `comp = bytearray(MAXN); pre = [0]*MAXN
for i in range(2, MAXN):
    if not comp[i]:
        comp[i*i::i] = b'\\x01' * len(range(i*i, MAXN, i))
    pre[i] = pre[i-1] + (0 if comp[i] else 1)`,
  time: "预处理 O(n log log n)，查询 O(1)", sp: "O(n)",
  pit: ["MAXN 按最大查询而不是最大 n 开", "pre 数组忘记包含 i 本身", "1 不是质数但被计入"],
  va: "区间 [L, R] 很大但区间很短时用「区间筛」",
},

"math-gcd-range": {
  rec: "多个数的 gcd / 区间 gcd 查询。",
  idea: "多个数的 gcd 满足结合律，逐个累积即可。区间 gcd 用稀疏表（ST 表）O(1) 查询，或线段树 O(log n)。",
  key: "区间 gcd 的前缀思想不成立（不能减），所以要用 ST 表。",
  cpp: `// 逐个累积
int g = 0;
for (int x : a) g = gcd(g, x);

// ST 表
int st[20][N], lg[N];
void build() {
    for (int i = 0; i < n; i++) st[0][i] = a[i];
    for (int k = 1; (1 << k) <= n; k++)
        for (int i = 0; i + (1 << k) <= n; i++)
            st[k][i] = gcd(st[k-1][i], st[k-1][i + (1 << (k-1))]);
}
int query(int l, int r) {
    int k = lg[r - l + 1];
    return gcd(st[k][l], st[k][r - (1 << k) + 1]);
}`,
  py: `from math import gcd
from functools import reduce
print(reduce(gcd, a))`,
  time: "累积 O(n log V)，ST 查询 O(1)", sp: "O(n log n)",
  pit: ["ST 表区间长度算错（右端点要减 2^k 再加 1）", "gcd(0, x) = x 这个性质可以用来处理空集",
        "取模意义下不能求 gcd（除非同时维护因子）"],
  va: "带修改的区间 gcd 用线段树；区间 gcd 的变体是「区间最大公约数 + 差分」",
},

/* ---------------- DP ---------------- */
"fib": {
  rec: "斐波那契数列 / 爬楼梯 / 递推计数。",
  idea: "dp[i] = dp[i-1] + dp[i-2]。因为只依赖前两项，可以用两个变量滚动，空间降到 O(1)。",
  key: "取模要在每次加法后做；n 大时直接递推会超时，需要矩阵快速幂。",
  cpp: `long long a = 0, b = 1;         // f(0), f(1)
for (int i = 2; i <= n; i++) { long long c = (a + b) % MOD; a = b; b = c; }
cout << (n == 0 ? 0 : b) << "\\n";`,
  py: `a, b = 0, 1
for _ in range(n): a, b = b, (a + b) % MOD
print(a)`,
  time: "O(n)", sp: "O(1)",
  pit: ["n=0/1 边界返回错", "不取模导致溢出", "n 达 1e18 时 O(n) 超时"],
  va: "n 很大用矩阵快速幂 O(log n)；带模数的循环节问题用 Pisano 周期",
},

"climb-stairs": {
  rec: "每次走 1 或 2 步，问走 n 阶有多少种方法。",
  idea: "到达第 i 阶的最后一步只能来自 i-1 或 i-2，所以 dp[i] = dp[i-1] + dp[i-2]，即斐波那契。",
  key: "dp[0] = 1（不放任何步也是一种方案）还是 0 要看题意，这决定了前几项。",
  cpp: `if (n <= 2) { cout << n; return; }
long long a = 1, b = 2;
for (int i = 3; i <= n; i++) { long long c = a + b; a = b; b = c % MOD; }`,
  py: `a, b = 1, 2
for _ in range(3, n+1): a, b = b, a + b`,
  time: "O(n)", sp: "O(1)",
  pit: ["dp[0] 定义错导致整体偏移一位", "每次可以走 1..k 步时要用滑动窗口维护前缀和",
        "结果要取模时忘记取"],
  va: "每次走 1..k 步：dp[i] = sum(dp[i-k..i-1])，用前缀和优化到 O(n)",
},

"knapsack01": {
  rec: "每个物品只能选一次，容量有限，求最大价值（0/1 背包）。",
  idea: "dp[j] 表示容量 j 时能获得的最大价值。对每个物品，倒序枚举容量（保证每个物品只用一次）：dp[j] = max(dp[j], dp[j-w] + v)。",
  key: "必须倒序！正序会变成完全背包（同一物品被重复选）。",
  cpp: `vector<long long> dp(W + 1, 0);
for (int i = 0; i < n; i++)
    for (int j = W; j >= w[i]; j--)          // 倒序
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
cout << dp[W] << "\\n";`,
  py: `dp = [0] * (W + 1)
for wi, vi in items:
    for j in range(W, wi - 1, -1):
        dp[j] = max(dp[j], dp[j - wi] + vi)`,
  time: "O(n·W)", sp: "O(W)",
  pit: ["容量正序遍历，退化成完全背包", "dp 数组用 int 溢出（价值总和可能很大）",
        "要求「恰好装满」时初始化为 -inf 而不是 0"],
  va: "恰好装满、求方案数、二维费用都是同一模板的变体",
},

"lis": {
  rec: "最长上升子序列（不要求连续）。",
  idea: "O(n²) 版本：dp[i] = 以 i 结尾的最长上升子序列长度，向前找比它小的转移。O(n log n) 版本：维护「长度为 L 的上升子序列的最小结尾」，用 lower_bound 更新。",
  key: "tails 数组不是答案序列，只是维持最优末尾；要输出方案需额外记录前驱。",
  cpp: `// O(n log n)
vector<int> tails;
for (int x : a) {
    auto it = lower_bound(tails.begin(), tails.end(), x);   // 严格上升用 lower_bound
    if (it == tails.end()) tails.push_back(x);
    else *it = x;
}
cout << tails.size() << "\\n";`,
  py: `import bisect
tails = []
for x in a:
    i = bisect.bisect_left(tails, x)
    if i == len(tails): tails.append(x)
    else: tails[i] = x
print(len(tails))`,
  time: "O(n log n)", sp: "O(n)",
  pit: ["非严格上升用 upper_bound，用错就变成严格上升", "O(n²) 版本在 n=1e5 时超时",
        "把 tails 当答案输出（它只是辅助数组）"],
  va: "最长下降子序列 = 取负后做 LIS；二维偏序的最长链用 CDQ 分治或树状数组",
},

"lcs": {
  rec: "最长公共子序列（不要求连续）。",
  idea: "dp[i][j] = A 前 i 个与 B 前 j 个的 LCS 长度。字符相等时 dp[i-1][j-1]+1，否则 max(dp[i-1][j], dp[i][j-1])。",
  key: "空串的边界行/列要初始化为 0；要还原具体子序列需要从后往前回溯。",
  cpp: `for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1] + 1
                                      : max(dp[i-1][j], dp[i][j-1]);`,
  py: `dp = [[0]*(m+1) for _ in range(n+1)]
for i in range(1, n+1):
    for j in range(1, m+1):
        dp[i][j] = dp[i-1][j-1] + 1 if a[i-1] == b[j-1] else max(dp[i-1][j], dp[i][j-1])`,
  time: "O(n·m)", sp: "O(n·m)（可滚动到 O(min(n,m))）",
  pit: ["下标混用（字符串 0-based，dp 1-based）", "求「最长公共子串」时忘了不相等要清零",
        "n·m 达 1e8 时内存超限，需要滚动数组"],
  va: "最长公共子串：dp[i][j] = a[i]==b[j] ? dp[i-1][j-1]+1 : 0；编辑距离是它的近亲",
},

"kadane": {
  rec: "最大子段和（连续子数组最大和）。",
  idea: "dp[i] = 以 i 结尾的最大和 = max(a[i], dp[i-1] + a[i])。等价说法：前缀和为负就丢弃，重新开始。",
  key: "全负数时答案是最大的那个负数，不能初始化为 0。",
  cpp: `long long cur = a[0], best = a[0];
for (int i = 1; i < n; i++) {
    cur = max((long long)a[i], cur + a[i]);
    best = max(best, cur);
}`,
  py: `cur = best = a[0]
for x in a[1:]:
    cur = max(x, cur + x); best = max(best, cur)`,
  time: "O(n)", sp: "O(1)",
  pit: ["best 初始化为 0，全负数时输出 0", "要求输出区间的起止位置时要额外记录",
        "循环从 0 开始但 cur 已用 a[0] 初始化，重复计算"],
  va: "最大子矩阵和 = 枚举行区间 + 列方向 Kadane O(n³)；带长度限制的用前缀和 + 单调队列",
},

"coin-dp": {
  rec: "用最少的硬币凑出金额 / 凑不出返回 -1。",
  idea: "完全背包求最小值：dp[j] = min(dp[j], dp[j-coin] + 1)，容量正序遍历（硬币可用无限次）。",
  key: "dp 初始化为 INF（不是 0），dp[0] = 0；最后判断是否仍为 INF。",
  cpp: `vector<int> dp(amount + 1, INT_MAX);
dp[0] = 0;
for (int c : coins)
    for (int j = c; j <= amount; j++)      // 正序 = 完全背包
        if (dp[j - c] != INT_MAX) dp[j] = min(dp[j], dp[j - c] + 1);
cout << (dp[amount] == INT_MAX ? -1 : dp[amount]);`,
  py: `INF = float('inf')
dp = [0] + [INF] * amount
for c in coins:
    for j in range(c, amount + 1):
        dp[j] = min(dp[j], dp[j-c] + 1)
print(-1 if dp[amount] == INF else dp[amount])`,
  time: "O(n·amount)", sp: "O(amount)",
  pit: ["dp 初始化为 0，导致所有答案都是 0", "0/1 背包（每个硬币只能用一次）不能正序遍历",
        "求方案数时 dp[0] 要设为 1"],
  va: "求方案数：dp[j] += dp[j-c]（组合数需外层硬币内层金额，排列数反之）",
},

"edit-dist": {
  rec: "把字符串 A 变成 B 的最少操作次数（增删改）。",
  idea: "dp[i][j] = A 前 i 个变成 B 前 j 个的最少操作。相等则继承 dp[i-1][j-1]，否则取「删、增、改」三者最小值 + 1。",
  key: "初始化：dp[i][0] = i（全删），dp[0][j] = j（全增）。",
  cpp: `for (int i = 0; i <= n; i++) dp[i][0] = i;
for (int j = 0; j <= m; j++) dp[0][j] = j;
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1]
            : 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});`,
  py: `dp = [[i if j == 0 else j if i == 0 else 0 for j in range(m+1)] for i in range(n+1)]
for i in range(1, n+1):
    for j in range(1, m+1):
        dp[i][j] = dp[i-1][j-1] if a[i-1] == b[j-1] else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`,
  time: "O(n·m)", sp: "O(n·m)（可滚到 O(m)）",
  pit: ["边界行/列忘记初始化", "三种操作对应的三个转移写混", "只允许删除和插入时公式不同"],
  va: "只允许删除/插入 = n + m - 2·LCS；带权编辑距离把 1 换成对应代价",
},

"min-path-sum": {
  rec: "矩阵从左上到右下，每次只能向右/向下，求最小路径和。",
  idea: "dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]。第一行只能从左边来，第一列只能从上边来。",
  key: "可以原地修改 grid 省空间，但会破坏输入（需要保留时要小心）。",
  cpp: `for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++) {
        if (i == 0 && j == 0) continue;
        if (i == 0) g[i][j] += g[i][j-1];
        else if (j == 0) g[i][j] += g[i-1][j];
        else g[i][j] += min(g[i-1][j], g[i][j-1]);
    }`,
  py: `for i in range(n):
    for j in range(m):
        if i == 0 and j == 0: continue
        if i == 0: g[i][j] += g[i][j-1]
        elif j == 0: g[i][j] += g[i-1][j]
        else: g[i][j] += min(g[i-1][j], g[i][j-1])`,
  time: "O(n·m)", sp: "O(1) 原地 / O(m) 滚动",
  pit: ["第一行/第一列未单独处理导致访问负数下标", "负权值矩阵不能用贪心",
        "只能向右/向下与可以四向移动是两类问题（后者是 Dijkstra）"],
  va: "三角形最小路径和：自底向上递推更简单",
},

"unique-paths": {
  rec: "网格从左上到右下的路径条数（只能向右/向下）。",
  idea: "dp[i][j] = dp[i-1][j] + dp[i][j-1]，第一行第一列都是 1。也可用组合数 C(n+m-2, n-1)。",
  key: "有障碍物时，障碍格 dp = 0（不是 1）。",
  cpp: `vector<vector<long long>> dp(n, vector<long long>(m, 1));
for (int i = 1; i < n; i++)
    for (int j = 1; j < m; j++)
        dp[i][j] = dp[i-1][j] + dp[i][j-1];`,
  py: `dp = [[1]*m for _ in range(n)]
for i in range(1, n):
    for j in range(1, m):
        dp[i][j] = dp[i-1][j] + dp[i][j-1]`,
  time: "O(n·m)", sp: "O(n·m) 或 O(m)",
  pit: ["障碍格未清零", "路径数超出 long long（n,m 大时要用大整数或取模）",
        "组合数解法忘记取模"],
  va: "带障碍的路径数、不同路径 III（必须走完所有空格）用状压 DP",
},

"complete-knapsack": {
  rec: "每种物品可以选无限次，求最大价值。",
  idea: "与 0/1 背包唯一的区别是容量正序遍历——这样 dp[j-w] 可能已经包含了当前物品，等价于可以重复选。",
  key: "正序 vs 倒序就是完全背包 vs 0/1 背包的分水岭，背下来。",
  cpp: `for (int i = 0; i < n; i++)
    for (int j = w[i]; j <= W; j++)       // 正序
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);`,
  py: `for wi, vi in items:
    for j in range(wi, W + 1):
        dp[j] = max(dp[j], dp[j - wi] + vi)`,
  time: "O(n·W)", sp: "O(W)",
  pit: ["写成倒序，退化成 0/1 背包", "多重背包（每种有限个）需要二进制拆分或单调队列",
        "求最小值时初始化方向相反"],
  va: "多重背包的二进制拆分 O(W·Σlog c)；单调队列优化到 O(n·W)",
},

"lps": {
  rec: "最长回文子序列（不要求连续）。",
  idea: "区间 DP：两端字符相等则 dp[i][j] = dp[i+1][j-1] + 2，否则取 max(dp[i+1][j], dp[i][j-1])。",
  key: "区间长度必须从小到大枚举，否则依赖的短区间还没算。",
  cpp: `for (int i = 0; i < n; i++) dp[i][i] = 1;
for (int len = 2; len <= n; len++)
    for (int i = 0; i + len - 1 < n; i++) {
        int j = i + len - 1;
        dp[i][j] = (s[i] == s[j]) ? dp[i+1][j-1] + 2 : max(dp[i+1][j], dp[i][j-1]);
    }`,
  py: `dp = [[0]*n for _ in range(n)]
for i in range(n): dp[i][i] = 1
for ln in range(2, n+1):
    for i in range(n-ln+1):
        j = i+ln-1
        dp[i][j] = dp[i+1][j-1] + 2 if s[i] == s[j] else max(dp[i+1][j], dp[i][j-1])`,
  time: "O(n²)", sp: "O(n²)",
  pit: ["len=2 时 dp[i+1][j-1] 越界（i+1 > j-1）", "枚举顺序错（按 i 从小到大但依赖更长的区间）",
        "把子序列做成子串"],
  va: "最少插入次数构成回文 = n - LPS；回文分割是另一个区间 DP",
},

"subset-count": {
  rec: "有多少个子集的和等于目标 / 能否划分成等和两半。",
  idea: "0/1 背包计数：dp[j] += dp[j-num]，容量倒序遍历，dp[0] = 1。",
  key: "dp[0] = 1 表示「空集和为 0」这一种方案，这是所有计数的基础。",
  cpp: `vector<long long> dp(target + 1, 0);
dp[0] = 1;
for (int x : nums)
    for (int j = target; j >= x; j--)
        dp[j] = (dp[j] + dp[j - x]) % MOD;`,
  py: `dp = [0]*(target+1); dp[0] = 1
for x in nums:
    for j in range(target, x-1, -1):
        dp[j] = (dp[j] + dp[j-x]) % MOD`,
  time: "O(n·target)", sp: "O(target)",
  pit: ["dp[0] 设为 0，答案恒为 0", "正序遍历变成「可重复选」", "结果过大要取模"],
  va: "「差为 target」的符号分配问题可以转化成子集和；多重集计数用生成函数",
},

"house-robber": {
  rec: "不能抢相邻两家，求最大金额（打家劫舍）。",
  idea: "dp[i] = max(dp[i-1], dp[i-2] + a[i])：要么不抢第 i 家，要么抢它加上前 i-2 家的最优。",
  key: "环形房屋要拆成「不抢第一家」和「不抢最后一家」两种情况取最大。",
  cpp: `long long pre = 0, cur = 0;
for (int x : a) { long long t = max(cur, pre + x); pre = cur; cur = t; }
cout << cur << "\\n";`,
  py: `pre = cur = 0
for x in a: pre, cur = cur, max(cur, pre + x)
print(cur)`,
  time: "O(n)", sp: "O(1)",
  pit: ["环形时忘记分类讨论", "全部相邻时的推进顺序写错", "金额用 int 溢出"],
  va: "树形打家劫舍：树上 DP（选/不选当前节点两种状态）",
},

"partition-equal": {
  rec: "能否把数组分成两个和相等的子集。",
  idea: "总和必须是偶数，然后看能否凑出 sum/2 —— 标准的 0/1 背包可达性 DP。",
  key: "总和为奇数直接返回 false，这一步能省掉一半无解情况。",
  cpp: `int sum = accumulate(a, a+n, 0);
if (sum & 1) { cout << "false"; return; }
int t = sum / 2;
vector<bool> dp(t + 1, false); dp[0] = true;
for (int x : a)
    for (int j = t; j >= x; j--) dp[j] = dp[j] || dp[j - x];
cout << (dp[t] ? "true" : "false");`,
  py: `s = sum(a)
if s % 2: print("false")
else:
    t = s // 2; dp = [True] + [False]*t
    for x in a:
        for j in range(t, x-1, -1):
            dp[j] = dp[j] or dp[j-x]
    print("true" if dp[t] else "false")`,
  time: "O(n·sum)", sp: "O(sum)",
  pit: ["总和的奇偶未判断", "容量正序遍历（会重复用元素）", "用 bitset 可以把常数降到 1/64"],
  va: "「分成 k 个等和子集」是状压 DP；带负数时要偏移下标",
},

"stone-merge": {
  rec: "石子合并 / 相邻区间合并的最小代价。",
  idea: "区间 DP：dp[i][j] = min(dp[i][k] + dp[k+1][j]) + sum(i..j)。用前缀和 O(1) 求区间和，用四边形不等式可优化到 O(n²)。",
  key: "必须先枚举区间长度，再枚举起点，再枚举分割点——三层循环顺序不能颠倒。",
  cpp: `for (int i = 1; i <= n; i++) pre[i] = pre[i-1] + a[i];
memset(dp, 0x3f, sizeof dp);
for (int i = 1; i <= n; i++) dp[i][i] = 0;
for (int len = 2; len <= n; len++)
    for (int i = 1; i + len - 1 <= n; i++) {
        int j = i + len - 1;
        for (int k = i; k < j; k++)
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + pre[j] - pre[i-1]);
    }`,
  py: `for ln in range(2, n+1):
    for i in range(1, n-ln+2):
        j = i + ln - 1
        dp[i][j] = min(dp[i][k] + dp[k+1][j] for k in range(i, j)) + pre[j] - pre[i-1]`,
  time: "O(n³)（n ≤ 300；优化后 O(n²)）", sp: "O(n²)",
  pit: ["循环顺序错导致用未计算的状态", "区间和每次重新累加导致 TLE", "环形石子合并要拆成两倍长度"],
  va: "环形石子合并：长度 2n 后取长度 n 的窗口；四边形不等式优化把 k 的枚举范围缩到 opt 附近",
},

"dp-lcs": {
  rec: "与 LCS 同型：求最长公共子序列长度 / 输出具体方案。",
  idea: "二维 DP 填表，回溯时从 dp[n][m] 往回走：相等就取这个字符并向左上走，否则向值更大的方向走。",
  key: "回溯得到的答案要反转；多个等长解时题目可能要求字典序最小。",
  cpp: `string r;
for (int i = n, j = m; i > 0 && j > 0; ) {
    if (a[i-1] == b[j-1]) { r += a[i-1]; i--; j--; }
    else if (dp[i-1][j] >= dp[i][j-1]) i--;
    else j--;
}
reverse(r.begin(), r.end());`,
  py: `r = []; i, j = n, m
while i and j:
    if a[i-1] == b[j-1]: r.append(a[i-1]); i -= 1; j -= 1
    elif dp[i-1][j] >= dp[i][j-1]: i -= 1
    else: j -= 1
print(''.join(reversed(r)))`,
  time: "O(n·m)", sp: "O(n·m)",
  pit: ["回溯方向与填表方向不一致", "忘记反转结果", "空串时输出格式"],
  va: "最短公共超序列 = n + m - LCS；多串 LCS 是 NP 难度（高维 DP）",
},

"dp-lis": {
  rec: "与 LIS 同型：需要输出具体的最长上升子序列。",
  idea: "记录每个位置的前驱 pre[i]，dp 值最大处开始沿 pre 回溯即可还原方案。",
  key: "O(n²) 版本天然支持记录前驱；O(n log n) 版本需要额外记录「tail 位置对应的前驱」。",
  cpp: `int best = 0, bestPos = 0;
for (int i = 0; i < n; i++) {
    dp[i] = 1; pre[i] = -1;
    for (int j = 0; j < i; j++)
        if (a[j] < a[i] && dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; pre[i] = j; }
    if (dp[i] > best) { best = dp[i]; bestPos = i; }
}
vector<int> path;
for (int i = bestPos; i != -1; i = pre[i]) path.push_back(a[i]);
reverse(path.begin(), path.end());`,
  py: `dp = [1]*n; pre = [-1]*n
for i in range(n):
    for j in range(i):
        if a[j] < a[i] and dp[j] + 1 > dp[i]: dp[i], pre[i] = dp[j] + 1, j
best = dp.index(max(dp))
path = []
while best != -1: path.append(a[best]); best = pre[best]
print(*reversed(path))`,
  time: "O(n²)", sp: "O(n)",
  pit: ["前驱记录在更新 dp 之前", "要求字典序最小时需要额外判断", "严格上升与不下降的转移条件不同"],
  va: "O(n log n) 还原方案需要记录每个长度的最优末位下标与它的前驱",
},

"dp-coin-comb": {
  rec: "硬币凑金额的方案数（组合数）。",
  idea: "dp[j] += dp[j-coin]，外层循环硬币、内层循环金额（正序）才能得到「组合」，反过来得到「排列」。",
  key: "循环顺序决定是组合还是排列，这是本题唯一的坑，也是唯一的考点。",
  cpp: `vector<long long> dp(amount + 1, 0);
dp[0] = 1;
for (int c : coins)                    // 外层硬币 → 组合
    for (int j = c; j <= amount; j++)
        dp[j] += dp[j - c];`,
  py: `dp = [0]*(amount+1); dp[0] = 1
for c in coins:
    for j in range(c, amount+1):
        dp[j] += dp[j-c]`,
  time: "O(n·amount)", sp: "O(amount)",
  pit: ["内外循环写反，得到排列数", "dp[0] 未设为 1", "结果溢出（需要取模或大整数）"],
  va: "排列数（顺序有关）：外层金额内层硬币；带限制（每种最多 k 个）用多重背包",
},

"dp-palindrome-cut": {
  rec: "把字符串切成若干回文串，求最少切几刀。",
  idea: "先用中心扩展预处理 isPal[i][j]（O(n²)），再 dp[i] = min(dp[j] + 1) 对所有 isPal[j][i] 成立的位置。",
  key: "预处理回文表能把判断从 O(n) 降到 O(1)，否则整体 O(n³) 会超时。",
  cpp: `// 预处理回文
for (int i = 0; i < n; i++) {
    for (int l = i, r = i; l >= 0 && r < n && s[l] == s[r]; l--, r++) pal[l][r] = true;
    for (int l = i, r = i+1; l >= 0 && r < n && s[l] == s[r]; l--, r++) pal[l][r] = true;
}
vector<int> dp(n + 1, INT_MAX); dp[0] = 0;
for (int i = 1; i <= n; i++)
    for (int j = 0; j < i; j++)
        if (pal[j][i-1]) dp[i] = min(dp[i], dp[j] + 1);
cout << dp[n] - 1 << "\\n";           // 切割次数 = 段数 - 1`,
  py: `pal = [[False]*n for _ in range(n)]
for i in range(n):
    l, r = i, i
    while l >= 0 and r < n and s[l] == s[r]: pal[l][r] = True; l -= 1; r += 1
    l, r = i, i+1
    while l >= 0 and r < n and s[l] == s[r]: pal[l][r] = True; l -= 1; r += 1
dp = [0] + [10**9]*n
for i in range(1, n+1):
    for j in range(i):
        if pal[j][i-1]: dp[i] = min(dp[i], dp[j] + 1)
print(dp[n] - 1)`,
  time: "O(n²)", sp: "O(n²)",
  pit: ["答案是「段数 - 1」而不是段数", "只枚举奇中心，漏掉偶回文",
        "isPal 用 O(n) 判断导致 O(n³)"],
  va: "回文分割 II 的进阶是 O(n) 的 Manacher + 线性 DP",
},

"dp-word-break": {
  rec: "字符串能否由字典里的单词拼接而成。",
  idea: "dp[i] 表示前 i 个字符可拆分。枚举分割点 j，只要 dp[j] 为真且 s[j..i) 在字典里，dp[i] 就为真。",
  key: "字典用哈希集合 O(1) 查询；单词最大长度可以限制 j 的枚举范围来提速。",
  cpp: `unordered_set<string> dict(words.begin(), words.end());
vector<bool> dp(n + 1, false); dp[0] = true;
for (int i = 1; i <= n; i++)
    for (int j = 0; j < i; j++)
        if (dp[j] && dict.count(s.substr(j, i - j))) { dp[i] = true; break; }
cout << (dp[n] ? "true" : "false");`,
  py: `d = set(words); dp = [True] + [False]*n
for i in range(1, n+1):
    dp[i] = any(dp[j] and s[j:i] in d for j in range(i))
print("true" if dp[n] else "false")`,
  time: "O(n²·L)（substr 有开销，可优化到 O(n·L)）", sp: "O(n)",
  pit: ["dp[0] 未设为 true", "单词可重复使用时逻辑不变（本题天然允许）",
        "输出所有方案时需要用 DFS + 记忆化"],
  va: "输出所有拆分方案：回溯 + 记忆化搜索；单词可修改字符时用 BFS + 状态压缩",
},

"dp-matrix-chain": {
  rec: "矩阵连乘的最小乘法次数 / 多边形三角剖分。",
  idea: "与石子合并同构：dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]·p[k]·p[j])。",
  key: "三个循环的顺序（长度 → 起点 → 分割点）是这类区间 DP 的固定骨架。",
  cpp: `for (int i = 1; i <= n; i++) dp[i][i] = 0;
for (int len = 2; len <= n; len++)
    for (int i = 1; i + len - 1 <= n; i++) {
        int j = i + len - 1;
        dp[i][j] = INT_MAX;
        for (int k = i; k < j; k++)
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]);
    }`,
  py: `for ln in range(2, n+1):
    for i in range(1, n-ln+2):
        j = i + ln - 1
        dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j] for k in range(i, j))`,
  time: "O(n³)", sp: "O(n²)",
  pit: ["p 下标从 0 还是 1 开始容易错一位", "开区间/闭区间混淆", "n 大时 O(n³) 超时（本题 n ≤ 100 才安全）"],
  va: "多边形三角剖分、最优二叉树（Huffman 之外）都是同一骨架",
},

/* ---------------- 栈 ---------------- */
"bracket-match": {
  rec: "括号匹配 / 判断合法性 / 最长有效括号。",
  idea: "遇到左括号就压栈，遇到右括号就弹出栈顶并检查是否配对。遍历结束后栈必须为空。",
  key: "右括号来时栈为空说明多余；最后栈非空说明左括号多余。两种情况都要判。",
  cpp: `stack<char> st;
for (char c : s) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
        if (st.empty()) { cout << "no"; return; }
        char t = st.top(); st.pop();
        if ((c == ')' && t != '(') || (c == ']' && t != '[') || (c == '}' && t != '{')) { cout << "no"; return; }
    }
}
cout << (st.empty() ? "yes" : "no");`,
  py: `pairs = {')': '(', ']': '[', '}': '{'}
st = []
for c in s:
    if c in "([{": st.append(c)
    elif not st or st.pop() != pairs[c]: print("no"); break
else: print("yes" if not st else "no")`,
  time: "O(n)", sp: "O(n)",
  pit: ["只判左右数量不判嵌套顺序", "遍历结束忘记检查栈空", "空串应判为合法"],
  va: "最长有效括号：栈存下标，用「栈底哨兵」技巧一次遍历求解",
},

"next-greater": {
  rec: "每个元素右边第一个比它大的数。",
  idea: "单调栈：从左往右扫，栈里存「还没找到答案的下标」且值递减。当前元素比栈顶大时，栈顶的答案就是它。",
  key: "栈里存下标而不是值，才能回填答案；循环结束后栈内元素答案为 -1。",
  cpp: `vector<int> ans(n, -1);
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) { ans[st.top()] = a[i]; st.pop(); }
    st.push(i);
}`,
  py: `ans = [-1]*n; st = []
for i, x in enumerate(a):
    while st and a[st[-1]] < x: ans[st.pop()] = x
    st.append(i)`,
  time: "O(n)", sp: "O(n)",
  pit: ["栈存值不存下标，无法回填", "要求「大于等于」时比较符要改", "循环方向搞反（找左边更大则从右往左）"],
  va: "环形数组：遍历 2n 次并对 n 取模；下一个更大元素的距离用下标相减",
},

"stack-eval": {
  rec: "计算表达式 / 逆波兰表达式求值 / 基本计算器。",
  idea: "逆波兰用栈：遇数字压栈，遇运算符弹出两个数计算后压回。带括号的中缀表达式需要双栈（数字栈 + 符号栈）或转成后缀再算。",
  key: "减法与除法要注意操作数顺序（先弹出的是右操作数）。整数除法向零取整。",
  cpp: `stack<long long> st;
for (auto &tk : tokens) {
    if (tk == "+" || tk == "-" || tk == "*" || tk == "/") {
        long long b = st.top(); st.pop();
        long long a = st.top(); st.pop();      // 注意顺序：a 是先压的
        st.push(tk == "+" ? a + b : tk == "-" ? a - b : tk == "*" ? a * b : a / b);
    } else st.push(stoll(tk));
}
cout << st.top();`,
  py: `st = []
for t in tokens:
    if t in "+-*/":
        b, a = st.pop(), st.pop()
        st.append(int(a / b) if t == '/' else eval(f"{a}{t}{b}"))
    else: st.append(int(t))
print(st[0])`,
  time: "O(n)", sp: "O(n)",
  pit: ["弹出顺序搞反导致 a-b 变 b-a", "负数除法的取整方向（C++ 向零，Python 向下）",
        "多位数与负号混淆"],
  va: "中缀转后缀（调度场算法）；支持括号和优先级的计算器用递归下降",
},

/* ---------------- 链表 ---------------- */
"reverse-k": {
  rec: "每 k 个一组反转链表 / 反转链表前 n 个。",
  idea: "递归或迭代：先判断剩余长度是否够 k，够就先反转这一段，再把这一段接到后续处理结果的后面。",
  key: "不足 k 个时保持原序是常见要求；哨兵节点能大幅简化头节点处理。",
  cpp: `ListNode* reverseK(ListNode* head, int k) {
    ListNode *p = head;
    for (int i = 0; i < k; i++) { if (!p) return head; p = p->next; }   // 不足 k
    ListNode *pre = nullptr, *cur = head;
    for (int i = 0; i < k; i++) { ListNode *nx = cur->next; cur->next = pre; pre = cur; cur = nx; }
    head->next = reverseK(cur, k);
    return pre;
}`,
  py: `def reverseK(head, k):
    p = head
    for _ in range(k):
        if not p: return head
        p = p.next
    pre, cur = None, head
    for _ in range(k):
        cur.next, pre, cur = pre, cur, cur.next
    head.next = reverseK(cur, k)
    return pre`,
  time: "O(n)", sp: "O(n/k) 递归栈 / O(1) 迭代",
  pit: ["不足 k 个时被反转", "反转后忘记连接后续段", "指针操作顺序错导致断链"],
  va: "两两交换是 k=2 的特例；旋转链表是另一种切分",
},

"list-middle": {
  rec: "找链表中点 / 判断回文链表 / 找环入口。",
  idea: "快慢指针：快指针每次走两步、慢指针一步。快指针到尾时慢指针正好在中点。",
  key: "节点数为偶数时，中点取「靠前」还是「靠后」取决于快指针初始化与循环条件。",
  cpp: `ListNode *slow = head, *fast = head;
while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
// slow 即中点（偶数个时偏后）`,
  py: `slow = fast = head
while fast and fast.next:
    slow = slow.next; fast = fast.next.next`,
  time: "O(n)", sp: "O(1)",
  pit: ["循环条件只写 fast 不写 fast->next，空指针解引用", "奇偶长度对「中点」定义要求不同",
        "回文链表需要边找中点边反转前半段"],
  va: "找环入口：快慢指针相遇后，一个指针回到 head，两个同速前进再相遇处即入口",
},

"list-merge": {
  rec: "合并两个有序链表。",
  idea: "哨兵节点 + 尾指针：每次比较两个链表头，把小的接到尾部并前移。最后把剩余部分整体接上。",
  key: "哨兵节点（dummy）能让「第一个节点」的处理与后续完全一致，避免空指针判断。",
  cpp: `ListNode dummy, *tail = &dummy;
while (a && b) {
    if (a->val <= b->val) { tail->next = a; a = a->next; }
    else { tail->next = b; b = b->next; }
    tail = tail->next;
}
tail->next = a ? a : b;`,
  py: `dummy = tail = ListNode(0)
while a and b:
    if a.val <= b.val: tail.next, a = a, a.next
    else: tail.next, b = b, b.next
    tail = tail.next
tail.next = a or b`,
  time: "O(n + m)", sp: "O(1)",
  pit: ["最后忘记接剩余段", "用 < 而不是 <= 影响稳定性", "哨兵节点被返回导致多一个 0"],
  va: "k 路归并：优先队列或分治两两合并",
},

"list-cycle": {
  rec: "判断链表是否有环 / 求环长度 / 求环入口。",
  idea: "快慢指针必然在环内相遇（若有环）。相遇后把一个指针放回 head，两者同速前进，再次相遇处就是环入口。",
  key: "相遇点到入口的距离 = head 到入口的距离，这是快慢指针的数学结论。",
  cpp: `bool hasCycle(ListNode* h) {
    ListNode *s = h, *f = h;
    while (f && f->next) {
        s = s->next; f = f->next->next;
        if (s == f) return true;
    }
    return false;
}`,
  py: `s = f = head
while f and f.next:
    s, f = s.next, f.next.next
    if s is f: return True
return False`,
  time: "O(n)", sp: "O(1)",
  pit: ["先移动后判断还是先判断后移动，影响单节点自环", "环长度需要再绕一圈计数",
        "用哈希表存节点会额外 O(n) 空间（可用但非最优）"],
  va: "环入口：相遇后 s = head，两指针同速再走；环长度：相遇后继续走直到再次相遇",
},

/* ---------------- 图论 ---------------- */
"graph-bfs": {
  rec: "无权图最短路 / 层次遍历 / 最少步数。",
  idea: "队列从起点扩散，每次把未访问的邻居入队并标记距离 +1。第一次访问到某点时的距离就是最短距离。",
  key: "入队时就标记 visited，而不是出队时——否则同一点会被重复入队，复杂度爆炸。",
  cpp: `queue<int> q; q.push(s);
vector<int> d(n, -1); d[s] = 0;
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u])
        if (d[v] == -1) { d[v] = d[u] + 1; q.push(v); }
}`,
  py: `from collections import deque
d = [-1]*n; d[s] = 0; q = deque([s])
while q:
    u = q.popleft()
    for v in g[u]:
        if d[v] < 0: d[v] = d[u] + 1; q.append(v)`,
  time: "O(n + m)", sp: "O(n)",
  pit: ["出队时才标记，导致重复入队（复杂度退化）", "多源 BFS 忘记把所有源点一起入队",
        "网格题方向数组写错或越界"],
  va: "多源 BFS（腐烂的橘子）；0-1 BFS（边权只有 0/1 时用双端队列）",
},

"dijkstra": {
  rec: "非负权图的单源最短路。",
  idea: "贪心 + 优先队列：每次取出当前距离最小的未确定点，用它松弛邻居。每个点第一次被取出时距离就是最终答案。",
  key: "边权必须非负；有负权要用 SPFA/Bellman-Ford。堆优化后 O((n+m) log n)。",
  cpp: `vector<long long> d(n, LLONG_MAX); d[s] = 0;
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
pq.push({0, s});
while (!pq.empty()) {
    auto [du, u] = pq.top(); pq.pop();
    if (du > d[u]) continue;                     // 过期堆元素
    for (auto [v, w] : g[u])
        if (d[u] + w < d[v]) { d[v] = d[u] + w; pq.push({d[v], v}); }
}`,
  py: `import heapq
d = [float('inf')]*n; d[s] = 0; pq = [(0, s)]
while pq:
    du, u = heapq.heappop(pq)
    if du > d[u]: continue
    for v, w in g[u]:
        if du + w < d[v]: d[v] = du + w; heapq.heappush(pq, (d[v], v))`,
  time: "O((n + m) log n)", sp: "O(n + m)",
  pit: ["忘记跳过过期堆元素（du > d[u]）导致 TLE", "距离用 int 溢出",
        "有负权边却用 Dijkstra（结果错）"],
  va: "求最长路需 DAG 上拓扑排序 DP；多源最短路加超级源点",
},

"union-find": {
  rec: "连通性判断 / 合并集合 / 判断是否成环。",
  idea: "每个集合用一棵树表示，根是代表元。合并时把一棵树的根挂到另一棵上；查询时路径压缩把链压平，均摊接近 O(1)。",
  key: "路径压缩 + 按秩合并后均摊 O(α(n))；只写路径压缩也够用。",
  cpp: `int fa[N];
int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
void merge(int a, int b) { fa[find(a)] = find(b); }
// 初始化 for (int i = 0; i < n; i++) fa[i] = i;`,
  py: `fa = list(range(n))
def find(x):
    while fa[x] != x:
        fa[x] = fa[fa[x]]; x = fa[x]
    return x
def merge(a, b): fa[find(a)] = find(b)`,
  time: "均摊 O(α(n)) ≈ O(1)", sp: "O(n)",
  pit: ["忘记初始化 fa[i] = i", "合并时写 fa[a] = b 而不是 fa[find(a)] = find(b)",
        "带权并查集需要额外维护到根的距离"],
  va: "带权并查集（食物链）；可撤销并查集（按秩合并，不能路径压缩）",
},

"topo-sort": {
  rec: "任务调度 / 依赖顺序 / 判断有向图是否有环。",
  idea: "Kahn 算法：统计入度，把入度为 0 的点入队，出队时把邻居入度减 1，减到 0 就入队。若输出点数小于 n 则存在环。",
  key: "「输出数量 < n」就是有环的判据；按字典序输出要用优先队列代替普通队列。",
  cpp: `vector<int> indeg(n, 0);
for (int u = 0; u < n; u++) for (int v : g[u]) indeg[v]++;
queue<int> q;
for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
vector<int> ord;
while (!q.empty()) {
    int u = q.front(); q.pop(); ord.push_back(u);
    for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
}
if ((int)ord.size() < n) cout << "cycle";`,
  py: `from collections import deque
indeg = [0]*n
for u in range(n):
    for v in g[u]: indeg[v] += 1
q = deque(i for i in range(n) if indeg[i] == 0)
ord = []
while q:
    u = q.popleft(); ord.append(u)
    for v in g[u]:
        indeg[v] -= 1
        if indeg[v] == 0: q.append(v)`,
  time: "O(n + m)", sp: "O(n + m)",
  pit: ["入度减到 0 后才入队，忘记减", "未检查环", "要求字典序最小时用普通队列结果错"],
  va: "DFS 版本用三色标记判环；拓扑序 DP 可求 DAG 上最长路",
},

"floyd": {
  rec: "求任意两点间的最短路 / n 较小（≤ 500）。",
  idea: "枚举中转点 k，用 dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]) 松弛。k 必须在最外层，保证用到的是「只经过前 k-1 个点」的最短路。",
  key: "三层循环的顺序不能换：k 在最外层。这是 Floyd 正确性的核心。",
  cpp: `for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];`,
  py: `for k in range(n):
    for i in range(n):
        for j in range(n):
            if d[i][k] + d[k][j] < d[i][j]: d[i][j] = d[i][k] + d[k][j]`,
  time: "O(n³)", sp: "O(n²)",
  pit: ["k 写在内层（结果错）", "初始化时 i==j 设为 0、不可达设为 INF", "INF 加 INF 溢出（需判断）"],
  va: "传递闭包（可达性）用 bitset 优化到 O(n³/64)；最小环枚举 k 时更新答案",
},

"grid-bfs": {
  rec: "网格里从起点到终点的最少步数（四方向移动）。",
  idea: "把格子当节点做 BFS，方向数组 {1,0,-1,0,0,1,0,-1} 枚举四个方向，越界和障碍跳过。",
  key: "起点即终点要返回 0；dist 数组初始化为 -1 同时充当 visited。",
  cpp: `int dx[4] = {1, -1, 0, 0}, dy[4] = {0, 0, 1, -1};
queue<pair<int,int>> q; q.push({sx, sy});
vector<vector<int>> d(n, vector<int>(m, -1)); d[sx][sy] = 0;
while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int k = 0; k < 4; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
        if (grid[nx][ny] || d[nx][ny] != -1) continue;
        d[nx][ny] = d[x][y] + 1; q.push({nx, ny});
    }
}`,
  py: `from collections import deque
d = [[-1]*m for _ in range(n)]; d[sx][sy] = 0; q = deque([(sx, sy)])
while q:
    x, y = q.popleft()
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        nx, ny = x+dx, y+dy
        if 0 <= nx < n and 0 <= ny < m and not g[nx][ny] and d[nx][ny] < 0:
            d[nx][ny] = d[x][y] + 1; q.append((nx, ny))`,
  time: "O(n·m)", sp: "O(n·m)",
  pit: ["方向数组越界检查顺序错", "起点不可达时输出格式（-1）", "八方向与四方向搞混"],
  va: "带权网格最短路用 Dijkstra；能打破障碍的用 0-1 BFS",
},

"island-count": {
  rec: "统计连通块个数 / 岛屿数量 / 朋友圈。",
  idea: "遍历每个未访问的格子，若是陆地就计数 +1 并从它开始 DFS/BFS 把整个连通块标记为已访问。",
  key: "标记要在入队/入栈时做，避免重复遍历；网格大时用 BFS 防止爆栈。",
  cpp: `int cnt = 0;
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        if (g[i][j] == '1') { cnt++; bfs(i, j); }   // bfs 内把整块置 '0'`,
  py: `cnt = 0
for i in range(n):
    for j in range(m):
        if g[i][j] == '1':
            cnt += 1; flood(i, j)`,
  time: "O(n·m)", sp: "O(n·m) 最坏",
  pit: ["访问标记漏写导致死循环", "DFS 递归深度达 1e5 时爆栈，应改 BFS",
        "只统计上下左右，但题目是八连通"],
  va: "并查集做法：合并相邻陆地后统计不同根的数量",
},

"graph-topo-lex": {
  rec: "要求输出字典序最小的拓扑序。",
  idea: "把 Kahn 算法里的普通队列换成小根堆，每次取编号最小的入度为 0 的点。",
  key: "必须是「取最小」，堆（优先队列）而不是队列，这是唯一的差别。",
  cpp: `priority_queue<int, vector<int>, greater<int>> pq;
for (int i = 0; i < n; i++) if (!indeg[i]) pq.push(i);
while (!pq.empty()) {
    int u = pq.top(); pq.pop(); cout << u << " ";
    for (int v : g[u]) if (--indeg[v] == 0) pq.push(v);
}`,
  py: `import heapq
h = [i for i in range(n) if indeg[i] == 0]; heapq.heapify(h)
while h:
    u = heapq.heappop(h); print(u, end=' ')
    for v in g[u]:
        indeg[v] -= 1
        if indeg[v] == 0: heapq.heappush(h, v)`,
  time: "O((n + m) log n)", sp: "O(n + m)",
  pit: ["用普通队列得到的是某个拓扑序而非字典序最小", "编号从 1 开始时要统一",
        "有环时输出不完整未检测"],
  va: "「最小字典序的拓扑序」与「反向图求最大字典序」并不对称，需要注意方向",
},

"graph-dijkstra": {
  rec: "与 dijkstra 同型：带权图最短路，需要输出路径或距离。",
  idea: "在松弛时记录 pre[v] = u，最后从终点沿 pre 回溯得到路径。堆优化写法同上。",
  key: "pre 只在真正更新距离时写入，否则会记录非最短路径上的前驱。",
  cpp: `vector<int> pre(n, -1);
// 松弛时
if (d[u] + w < d[v]) { d[v] = d[u] + w; pre[v] = u; pq.push({d[v], v}); }
// 回溯
for (int x = t; x != -1; x = pre[x]) path.push_back(x);
reverse(path.begin(), path.end());`,
  py: `pre = [-1]*n
# 更新时 pre[v] = u
path, x = [], t
while x != -1: path.append(x); x = pre[x]
path.reverse()`,
  time: "O((n + m) log n)", sp: "O(n + m)",
  pit: ["pre 记录在判断之外（覆盖正确答案）", "不可达时输出格式", "路径要求从终点到起点输出时需要反转"],
  va: "次短路：维护每个点的最短与次短两个距离",
},

"graph-kruskal": {
  rec: "最小生成树 / 连接所有点的最小成本。",
  idea: "把所有边按权值排序，依次尝试加入：若两端不在同一并查集就合并（这条边入选），否则丢弃（成环）。选够 n-1 条边即完成。",
  key: "并查集判断成环，边排序是核心；图不连通时无法生成完整树。",
  cpp: `sort(edges.begin(), edges.end());      // 按 w 升序
for (int i = 0; i < n; i++) fa[i] = i;
long long ans = 0; int cnt = 0;
for (auto &[w, u, v] : edges) {
    if (find(u) == find(v)) continue;
    fa[find(u)] = find(v); ans += w;
    if (++cnt == n - 1) break;
}
cout << (cnt == n - 1 ? to_string(ans) : "impossible");`,
  py: `edges.sort()
ans = cnt = 0
for w, u, v in edges:
    if find(u) == find(v): continue
    fa[find(u)] = find(v); ans += w; cnt += 1
    if cnt == n - 1: break`,
  time: "O(m log m)", sp: "O(n + m)",
  pit: ["边数不足 n-1 时误判成功", "排序按 (u,v,w) 而不是 w", "答案用 int 溢出"],
  va: "最大生成树按降序排序；Prim 适合稠密图 O(n²)",
},

/* ---------------- 区间 / 贪心 ---------------- */
"merge-intervals": {
  rec: "合并重叠区间 / 插入区间 / 会议室安排。",
  idea: "先按左端点排序，然后线性扫描：当前区间与结果末尾重叠（左端点 ≤ 末尾右端点）就合并取最大右端点，否则追加。",
  key: "排序是前提；「重叠」的判定是 l ≤ lastR，等于也算重叠。",
  cpp: `sort(iv.begin(), iv.end());
vector<pair<int,int>> r;
for (auto [l, rr] : iv) {
    if (!r.empty() && l <= r.back().second) r.back().second = max(r.back().second, rr);
    else r.push_back({l, rr});
}`,
  py: `iv.sort(); r = []
for l, rr in iv:
    if r and l <= r[-1][1]: r[-1][1] = max(r[-1][1], rr)
    else: r.append([l, rr])`,
  time: "O(n log n)", sp: "O(n)",
  pit: ["未排序直接扫描", "合并时忘记取 max（区间包含时不取 max 会缩短）", "端点相等是否算重叠看题意"],
  va: "会议室 II（最少会议室数）：把所有端点排序后扫描，开始 +1 结束 -1 取最大前缀",
},

"jump-min": {
  rec: "跳跃游戏，求最少跳跃次数 / 能否到达终点。",
  idea: "贪心维护「当前跳跃次数能到达的最远位置」和「再跳一次能到达的最远位置」。当遍历到达当前边界时，次数 +1 并更新边界。",
  key: "不要在能到达时输出，而是在必须再跳一次时计数——这是最不易错的写法。",
  cpp: `int jumps = 0, curEnd = 0, farthest = 0;
for (int i = 0; i < n - 1; i++) {
    farthest = max(farthest, i + a[i]);
    if (i == curEnd) { jumps++; curEnd = farthest; }
}`,
  py: `jumps = cur = far = 0
for i in range(n-1):
    far = max(far, i + a[i])
    if i == cur: jumps += 1; cur = far`,
  time: "O(n)", sp: "O(1)",
  pit: ["循环到 n-1 而不是 n（最后一个位置不需要再跳）", "只判断能否到达时逻辑更简单，别混用",
        "a[i] = 0 时死循环（其实不会，边界会推进）"],
  va: "跳跃游戏 I 只需判断可达性；带障碍的跳跃 DP 需要维护区间最值",
},

"coin-greedy": {
  rec: "硬币找零，面额有倍数关系时贪心最优。",
  idea: "每次尽量用最大面额。仅当面额体系「规范」（如 1/5/10/25）时贪心才最优；任意面额必须用 DP。",
  key: "贪心的正确性依赖面额结构，题目给的面额一般是特定体系，要说明这一点。",
  cpp: `int cnt = 0;
for (int i = 0; i < k; i++) { cnt += amount / c[i]; amount %= c[i]; }   // c 降序
cout << (amount ? -1 : cnt);`,
  py: `cnt = 0
for c in sorted(coins, reverse=True):
    cnt += amount // c; amount %= c
print(-1 if amount else cnt)`,
  time: "O(k)", sp: "O(1)",
  pit: ["面额不规整时用贪心得到次优解（如 1/3/4 凑 6）", "面额未降序", "无法凑出时返回 -1"],
  va: "任意面额用完全背包 DP；限制硬币数量用多重背包",
},

"greedy-activity": {
  rec: "最多能参加多少个不冲突的活动 / 区间调度。",
  idea: "按结束时间升序排序，依次选择结束最早且开始时间不早于上一个结束时间的活动。这是区间调度的经典贪心。",
  key: "按结束时间排序而不是开始时间，这是正确性的关键。",
  cpp: `sort(v.begin(), v.end(), [](auto &x, auto &y) { return x.second < y.second; });
int cnt = 0, last = INT_MIN;
for (auto [s, e] : v)
    if (s >= last) { cnt++; last = e; }`,
  py: `v.sort(key=lambda x: x[1])
cnt, last = 0, -10**18
for s, e in v:
    if s >= last: cnt += 1; last = e`,
  time: "O(n log n)", sp: "O(1)",
  pit: ["按开始时间排序（结果可能不是最优）", "端点相接算不算冲突看题意（>= 还是 >）",
        "区间是开区间还是闭区间"],
  va: "带权区间调度（每个活动有权值）不能用贪心，要按结束时间 DP + 二分",
},

"stock-profit": {
  rec: "股票买卖一次的最大利润。",
  idea: "遍历时维护「历史最低价」，用当前价减最低价更新最大利润。一次遍历完成。",
  key: "先更新最低价还是先算利润？顺序不影响结果，但答案不能是负数（可以不动）。",
  cpp: `int low = INT_MAX, best = 0;
for (int x : a) { best = max(best, x - low); low = min(low, x); }`,
  py: `low, best = 10**18, 0
for x in a:
    best = max(best, x - low); low = min(low, x)`,
  time: "O(n)", sp: "O(1)",
  pit: ["先更新 low 再算利润会得到 0（允许当天买卖）", "答案要求返回最大亏损时要另算",
        "价格用 int 溢出（一般不会）"],
  va: "多次买卖 = 累加所有上涨段；最多 k 次交易用 DP（状态：天数 × 交易次数 × 是否持股）",
},

"greedy-gas-station": {
  rec: "环形加油站能否绕一圈 / 起点在哪。",
  idea: "总油量 ≥ 总消耗则一定有解。扫描时累计当前余量，一旦为负就说明此前所有点都不能作为起点，把起点设为下一个点并清零。",
  key: "「余量为负则起点后移」是贪心的核心结论，需要总油量判定兜底。",
  cpp: `long long total = 0, cur = 0; int start = 0;
for (int i = 0; i < n; i++) {
    total += gas[i] - cost[i];
    cur += gas[i] - cost[i];
    if (cur < 0) { start = i + 1; cur = 0; }
}
cout << (total < 0 ? -1 : start);`,
  py: `total = cur = start = 0
for i in range(n):
    total += gas[i] - cost[i]; cur += gas[i] - cost[i]
    if cur < 0: start, cur = i + 1, 0
print(-1 if total < 0 else start)`,
  time: "O(n)", sp: "O(1)",
  pit: ["忘记总油量判定，无解时返回了错误的起点", "cur 用 int 溢出", "起点下标越界（i+1 == n 时应为 0）"],
  va: "二维版本（两个加油站数组）仍需 O(n)；带权环形问题可用前缀和 + 单调队列",
},

"greedy-task-cool": {
  rec: "任务调度带冷却时间 / 相同元素间隔。",
  idea: "统计各任务频次，设最大频次为 mx、达到最大频次的种类数为 k。答案 = max(n, (mx-1)*(cool+1) + k)。",
  key: "这个公式本质是「按最高频任务排出骨架，其余填空」，填空不够就用总长度。",
  cpp: `int cnt[26] = {0};
for (char c : tasks) cnt[c - 'A']++;
int mx = *max_element(cnt, cnt + 26);
int k = count(cnt, cnt + 26, mx);
cout << max((int)tasks.size(), (mx - 1) * (cool + 1) + k);`,
  py: `from collections import Counter
c = Counter(tasks); mx = max(c.values())
k = sum(1 for v in c.values() if v == mx)
print(max(len(tasks), (mx - 1) * (cool + 1) + k))`,
  time: "O(n)", sp: "O(1)",
  pit: ["公式记错（+k 写成 +1）", "冷却为 0 时公式退化但答案正确", "任务种类映射越界"],
  va: "需要输出具体调度方案的用优先队列模拟",
},

"greedy-candy": {
  rec: "分糖果，相邻孩子评分高的必须多拿。",
  idea: "两次扫描：从左往右保证「比左边高就 +1」，从右往左保证「比右边高就 +1」，取两次的最大值（或直接在第二遍取 max）。",
  key: "单次扫描不够，因为左右两个方向的要求会冲突，必须各扫一遍。",
  cpp: `vector<int> c(n, 1);
for (int i = 1; i < n; i++) if (a[i] > a[i-1]) c[i] = c[i-1] + 1;
for (int i = n - 2; i >= 0; i--) if (a[i] > a[i+1]) c[i] = max(c[i], c[i+1] + 1);
cout << accumulate(c.begin(), c.end(), 0);`,
  py: `c = [1]*n
for i in range(1, n):
    if a[i] > a[i-1]: c[i] = c[i-1] + 1
for i in range(n-2, -1, -1):
    if a[i] > a[i+1]: c[i] = max(c[i], c[i+1] + 1)
print(sum(c))`,
  time: "O(n)", sp: "O(n)",
  pit: ["第二遍扫描用赋值而不是 max，覆盖了第一遍的结果", "相等时不应该加糖果",
        "只扫一遍得到局部最优"],
  va: "环形排列的糖果需要三次扫描；只求总数可以用 O(1) 空间的「峰谷」解法",
},

"greedy-stock-multi": {
  rec: "可以多次买卖股票，求最大总利润。",
  idea: "所有「明天比今天贵」的相邻差之和就是答案——等价于在每段上涨的起点买、终点卖。",
  key: "不需要真的找买卖点，把所有正收益段加起来即可。",
  cpp: `int p = 0;
for (int i = 1; i < n; i++) if (a[i] > a[i-1]) p += a[i] - a[i-1];`,
  py: `print(sum(max(0, a[i] - a[i-1]) for i in range(1, n)))`,
  time: "O(n)", sp: "O(1)",
  pit: ["要求「不能同时持有多笔」时结论不变（等价）", "含手续费时每次交易要扣费，需要 DP",
        "冷冻期同样需要 DP"],
  va: "带手续费/冷冻期用状态机 DP（持股/不持股两种状态）",
},

/* ---------------- 树 ---------------- */
"tree-inorder": {
  rec: "二叉树中序/前序/后序遍历。",
  idea: "中序：左 → 根 → 右。递归最直观；迭代用显式栈（一路压左孩子，弹出访问后转向右孩子）。",
  key: "BST 的中序遍历是升序，这是很多 BST 题目的突破口。",
  cpp: `// 迭代中序
vector<int> r; stack<TreeNode*> st; TreeNode* p = root;
while (p || !st.empty()) {
    while (p) { st.push(p); p = p->left; }
    p = st.top(); st.pop(); r.push_back(p->val);
    p = p->right;
}`,
  py: `def inorder(root):
    r, st, p = [], [], root
    while p or st:
        while p: st.append(p); p = p.left
        p = st.pop(); r.append(p.val); p = p.right
    return r`,
  time: "O(n)", sp: "O(h)",
  pit: ["迭代版忘记转向右孩子（死循环）", "空树返回空数组", "前中后序的访问时机搞混"],
  va: "Morris 遍历 O(1) 空间；层序遍历用队列",
},

"tree-height": {
  rec: "求二叉树高度 / 深度 / 是否平衡。",
  idea: "高度 = max(左高, 右高) + 1，后序遍历自底向上计算。判平衡时可以顺手返回 -1 表示不平衡，避免重复计算。",
  key: "自顶向下求高度是 O(n²)，自底向上 O(n)，树大时必须用后者。",
  cpp: `int height(TreeNode* r) {
    if (!r) return 0;
    return 1 + max(height(r->left), height(r->right));
}
// 判平衡（-1 表示不平衡）
int check(TreeNode* r) {
    if (!r) return 0;
    int l = check(r->left); if (l < 0) return -1;
    int rr = check(r->right); if (rr < 0) return -1;
    return abs(l - rr) <= 1 ? max(l, rr) + 1 : -1;
}`,
  py: `def height(r):
    return 0 if not r else 1 + max(height(r.left), height(r.right))`,
  time: "O(n)", sp: "O(h)",
  pit: ["空节点返回 0 还是 -1 要统一", "判平衡时重复调用 height 导致 O(n²)", "链状树递归深度达 1e5 时爆栈"],
  va: "最小深度要特判单侧为空（不能直接 min，否则为 0）",
},

"tree-lca": {
  rec: "最近公共祖先（LCA）。",
  idea: "递归：若当前节点为空或等于 p/q 就返回；分别递归左右子树，两边都非空则当前节点即 LCA，否则返回非空的那一边。",
  key: "这个递归默认 p、q 一定在树中；若可能不存在需要额外判断。",
  cpp: `TreeNode* lca(TreeNode* r, TreeNode* p, TreeNode* q) {
    if (!r || r == p || r == q) return r;
    TreeNode* l = lca(r->left, p, q);
    TreeNode* rt = lca(r->right, p, q);
    if (l && rt) return r;
    return l ? l : rt;
}`,
  py: `def lca(r, p, q):
    if not r or r is p or r is q: return r
    l, rt = lca(r.left, p, q), lca(r.right, p, q)
    return r if l and rt else (l or rt)`,
  time: "O(n) 单次；倍增预处理 O(n log n) 后每次 O(log n)", sp: "O(h)",
  pit: ["BST 的 LCA 可以用值比较 O(h)，不必用通用递归", "p、q 之一不在树中时结果无意义",
        "多次查询必须用倍增/欧拉序 + ST 表，否则超时"],
  va: "倍增法：up[i][k] 表示 i 向上 2^k 步的祖先，先对齐深度再同时上跳",
},

"tree-diameter": {
  rec: "树的直径（最长路径边数/节点数）。",
  idea: "从任意点出发找到最远点 A，再从 A 出发找最远点 B，AB 即直径。两次 BFS/DFS。",
  key: "树的直径端点一定可以从任意点的最远点找到，这是可证明的性质。",
  cpp: `int far = 0, maxd = -1;
void dfs(int u, int p, int d) {
    if (d > maxd) { maxd = d; far = u; }
    for (int v : g[u]) if (v != p) dfs(v, u, d + 1);
}
dfs(0, -1, 0); dfs(far, -1, 0);
cout << maxd;`,
  py: `def dfs(u, p, d):
    global far, maxd
    if d > maxd: maxd, far = d, u
    for v in g[u]:
        if v != p: dfs(v, u, d + 1)`,
  time: "O(n)", sp: "O(n)",
  pit: ["树形 DP 解法写成两次 DFS 但图不是树（有环会错）", "边权为负时两次 DFS 不成立（需要树形 DP）",
        "直径是边数还是节点数要看清"],
  va: "带权树的直径用树形 DP：维护每个节点向下的最长与次长链",
},

/* ---------------- 堆 ---------------- */
"heap-kth": {
  rec: "第 k 大 / 第 k 小 / 前 k 个高频。",
  idea: "求第 k 大维护大小为 k 的小根堆（堆顶就是第 k 大）；求前 k 个高频用「哈希计数 + 小根堆」。",
  key: "求第 k 大用小根堆（不是大根堆），这样超出 k 个就弹出最小的。",
  cpp: `priority_queue<int, vector<int>, greater<int>> pq;   // 小根堆
for (int x : a) {
    pq.push(x);
    if ((int)pq.size() > k) pq.pop();
}
cout << pq.top();     // 第 k 大`,
  py: `import heapq
h = []
for x in a:
    heapq.heappush(h, x)
    if len(h) > k: heapq.heappop(h)
print(h[0])`,
  time: "O(n log k)", sp: "O(k)",
  pit: ["求第 k 大却用大根堆（会弹出正确答案）", "k 大于数组长度时未处理", "结果要求去重时逻辑不同"],
  va: "快速选择（quickselect）平均 O(n)；数据范围小时用计数排序 O(n)",
},

"heap-k-merge": {
  rec: "合并 k 个有序链表/数组。",
  idea: "优先队列存每个列表的当前队首，每次取出全局最小并推进该列表。堆大小为 k，每次操作 O(log k)。",
  key: "堆里要存（值, 来自哪个列表, 该列表内的位置），只存值无法知道该推进哪个列表。",
  cpp: `using T = tuple<int,int,int>;                     // val, listId, idx
priority_queue<T, vector<T>, greater<T>> pq;
for (int i = 0; i < k; i++) if (!lists[i].empty()) pq.push({lists[i][0], i, 0});
while (!pq.empty()) {
    auto [v, i, j] = pq.top(); pq.pop();
    cout << v << " ";
    if (j + 1 < (int)lists[i].size()) pq.push({lists[i][j+1], i, j+1});
}`,
  py: `import heapq
h = [(l[0], i, 0) for i, l in enumerate(lists) if l]
heapq.heapify(h)
while h:
    v, i, j = heapq.heappop(h)
    print(v, end=' ')
    if j + 1 < len(lists[i]): heapq.heappush(h, (lists[i][j+1], i, j+1))`,
  time: "O(N log k)", sp: "O(k)",
  pit: ["堆元素缺少列表标识", "空列表未跳过", "tuple 比较大小时顺序错（先比值再比 id）"],
  va: "分治两两合并 O(N log k) 且常数更小",
},

"heap-median-stream": {
  rec: "数据流的中位数。",
  idea: "两个堆：大根堆存较小的一半，小根堆存较大的一半。保持两者大小差不超过 1，中位数从堆顶取。",
  key: "插入后如果大小差超过 1 就互相搬移元素，始终保持「大根堆大小 ≥ 小根堆」。",
  cpp: `priority_queue<int> lo;                                  // 大根堆
priority_queue<int, vector<int>, greater<int>> hi;      // 小根堆
void add(int x) {
    lo.push(x);
    hi.push(lo.top()); lo.pop();
    if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
}
double median() {
    return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;
}`,
  py: `import heapq
lo, hi = [], []      # lo 存负数模拟大根堆
def add(x):
    heapq.heappush(lo, -x); heapq.heappush(hi, -heapq.heappop(lo))
    if len(hi) > len(lo): heapq.heappush(lo, -heapq.heappop(hi))`,
  time: "每次 O(log n)", sp: "O(n)",
  pit: ["两个堆大小关系维护错", "偶数个时忘记取平均（整数除法丢失 0.5）", "Python 大根堆要存负数"],
  va: "滑动窗口中位数：双堆 + 延迟删除（用哈希记录待删元素）",
},

/* ---------------- 位运算 ---------------- */
"bit-count-range": {
  rec: "统计 0~n 每个数的二进制 1 的个数。",
  idea: "dp[i] = dp[i >> 1] + (i & 1)，利用「去掉最低位」的结果已经算过。O(n) 一次遍历。",
  key: "i >> 1 < i 恒成立，所以正序遍历即可保证依赖已算。",
  cpp: `vector<int> dp(n + 1, 0);
for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);`,
  py: `dp = [0]*(n+1)
for i in range(1, n+1): dp[i] = dp[i >> 1] + (i & 1)`,
  time: "O(n)", sp: "O(n)",
  pit: ["对每个数单独算 popcount 导致 O(n log n)", "n 到 1e7 时内存吃紧", "输出格式要求数组还是总和"],
  va: "只求单个数的 popcount 用 n & (n-1) 循环，复杂度 O(1 的个数)",
},

"xor-single": {
  rec: "只有一个数出现一次，其余出现两次。",
  idea: "异或的性质：a ^ a = 0、a ^ 0 = a。全部异或起来，成对的抵消，剩下的就是答案。",
  key: "出现三次的情况不能用异或，要按位统计。",
  cpp: `int x = 0;
for (int v : a) x ^= v;
cout << x;`,
  py: `x = 0
for v in a: x ^= v
print(x)`,
  time: "O(n)", sp: "O(1)",
  pit: ["有两个只出现一次的数时，需要按最低不同位分组再异或", "出现三次时异或失效",
        "负数异或要注意补码表示"],
  va: "两个单数：先全部异或得 a^b，取 lowbit 分组分别异或",
},

"bits-reverse": {
  rec: "翻转二进制位 / 判断 2 的幂 / 交换奇偶位。",
  idea: "逐位取出原数的第 i 位放到结果的第 31-i 位，循环 32 次。或用分治掩码一次处理一半。",
  key: "必须固定 32 位（前导 0 也要参与翻转），不能只处理到最高位 1。",
  cpp: `uint32_t reverseBits(uint32_t n) {
    uint32_t r = 0;
    for (int i = 0; i < 32; i++) { r = (r << 1) | (n & 1); n >>= 1; }
    return r;
}`,
  py: `r = 0
for _ in range(32):
    r = (r << 1) | (n & 1); n >>= 1`,
  time: "O(32)", sp: "O(1)",
  pit: ["用有符号数右移（算术右移补 1）导致死循环", "只循环到最高位 1", "输入输出当无符号处理"],
  va: "判断 2 的幂：n > 0 && (n & (n-1)) == 0；统计不同位数用异或后 popcount",
},

"bits-count-upto": {
  rec: "统计 0~n 中所有数的二进制里 1 的总个数。",
  idea: "按位统计：第 k 位（值为 2^k）在 0~n 中每 2^(k+1) 个数循环一次，其中前 2^k 个该位为 1。公式：full * 2^k + max(0, n % 2^(k+1) - 2^k + 1)。",
  key: "逐位计算比逐个数计算快得多，O(log n) 完成。",
  cpp: `long long cnt = 0;
for (long long k = 0; (1LL << k) <= n; k++) {
    long long len = 1LL << (k + 1), half = 1LL << k;
    cnt += (n + 1) / len * half + max(0LL, (n + 1) % len - half);
}`,
  py: `cnt = 0; k = 0
while (1 << k) <= n:
    ln, half = 1 << (k+1), 1 << k
    cnt += (n+1) // ln * half + max(0, (n+1) % ln - half)
    k += 1`,
  time: "O(log n)", sp: "O(1)",
  pit: ["周期公式的 +1 漏掉（n 本身也算）", "n 到 1e9 时答案超 int", "k 的上界判断错"],
  va: "数位 DP 是这类「统计 0~n 中满足某性质的数」的通用解法",
},

/* ---------------- 回溯 ---------------- */
"n-queens": {
  rec: "N 皇后 / 数独 / 排列组合枚举。",
  idea: "逐行放置皇后，用三个布尔数组（列、主对角线、副对角线）O(1) 判断冲突，放不下就回溯。",
  key: "对角线编号：主对角线用 r - c + n，副对角线用 r + c，这样能映射成非负下标。",
  cpp: `int ans = 0, n;
bool col[20], d1[40], d2[40];
void dfs(int r) {
    if (r == n) { ans++; return; }
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[r - c + n] || d2[r + c]) continue;
        col[c] = d1[r - c + n] = d2[r + c] = true;
        dfs(r + 1);
        col[c] = d1[r - c + n] = d2[r + c] = false;    // 回溯
    }
}`,
  py: `def dfs(r):
    if r == n: return 1
    s = 0
    for c in range(n):
        if c in col or r-c+n in d1 or r+c in d2: continue
        col.add(c); d1.add(r-c+n); d2.add(r+c)
        s += dfs(r + 1)
        col.remove(c); d1.remove(r-c+n); d2.remove(r+c)
    return s`,
  time: "O(n!)（有剪枝）", sp: "O(n)",
  pit: ["回溯时忘记恢复状态", "对角线编号出现负数下标", "用 O(n) 判断冲突导致超时"],
  va: "位运算加速：用三个整数的位表示占用情况，n ≤ 15 时极快",
},

"backtrack-kth-perm": {
  rec: "第 k 个排列 / 下一个排列 / 全排列。",
  idea: "按位确定：从左到右，每一位尝试剩余数字中第几小的，用 (k-1) / (n-i-1)! 定位，再用 (k-1) % (n-i-1)! 缩小问题。",
  key: "k 是 1-based，计算时要用 k-1；阶乘可能溢出 long long。",
  cpp: `string getPerm(int n, long long k) {
    vector<char> d; for (int i = 1; i <= n; i++) d.push_back('0' + i);
    long long f[10] = {1}; for (int i = 1; i <= n; i++) f[i] = f[i-1] * i;
    k--; string r;
    for (int i = n; i >= 1; i--) {
        long long idx = k / f[i-1];
        r += d[idx]; d.erase(d.begin() + idx);
        k %= f[i-1];
    }
    return r;
}`,
  py: `import math
d = list('123456789'[:n]); k -= 1; r = []
for i in range(n-1, -1, -1):
    idx, k = divmod(k, math.factorial(i))
    r.append(d.pop(idx))
print(''.join(r))`,
  time: "O(n²)（erase 开销）", sp: "O(n)",
  pit: ["k 未减 1 导致偏移一位", "阶乘溢出", "下一个排列的「找上升点 + 交换 + 反转后缀」三步漏一步"],
  va: "下一个排列 O(n)：从右找第一个 a[i] < a[i+1]，再找右边第一个大于 a[i] 的交换，最后反转后缀",
},

/* ---------------- 矩阵 ---------------- */
"spiral": {
  rec: "螺旋顺序遍历矩阵 / 螺旋填充。",
  idea: "维护上下左右四个边界，按「右、下、左、上」顺序走一圈，每走完一条边就收缩对应边界，直到边界交叉。",
  key: "收缩后要立即判断边界是否交叉，否则单行/单列会重复遍历。",
  cpp: `int t = 0, b = n - 1, l = 0, r = m - 1;
while (t <= b && l <= r) {
    for (int j = l; j <= r; j++) cout << g[t][j] << " "; t++;
    for (int i = t; i <= b; i++) cout << g[i][r] << " "; r--;
    if (t <= b) { for (int j = r; j >= l; j--) cout << g[b][j] << " "; b--; }
    if (l <= r) { for (int i = b; i >= t; i--) cout << g[i][l] << " "; l++; }
}`,
  py: `while t <= b and l <= r:
    for j in range(l, r+1): out.append(g[t][j])
    t += 1
    for i in range(t, b+1): out.append(g[i][r])
    r -= 1
    if t <= b:
        for j in range(r, l-1, -1): out.append(g[b][j])
        b -= 1
    if l <= r:
        for i in range(b, t-1, -1): out.append(g[i][l])
        l += 1`,
  time: "O(n·m)", sp: "O(1)",
  pit: ["后两条边没有判断边界，单行时重复输出", "四个边界更新顺序错", "非方阵时空指针"],
  va: "螺旋矩阵 II 是填充版本；对角线遍历用 (i+j) 分组",
},

"rotate-matrix": {
  rec: "矩阵顺时针旋转 90°（原地）。",
  idea: "顺时针 90° = 先沿主对角线转置，再左右翻转每一行。逆时针 = 转置 + 上下翻转。",
  key: "两个步骤的顺序不能反，且都必须原地（只遍历一半元素）。",
  cpp: `// 顺时针 90°
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) swap(a[i][j], a[j][i]);   // 转置
for (int i = 0; i < n; i++)
    for (int j = 0; j < n / 2; j++) swap(a[i][j], a[i][n-1-j]); // 左右翻转`,
  py: `a[:] = [list(r) for r in zip(*a)]          # 转置
for row in a: row.reverse()                  # 每行反转`,
  time: "O(n²)", sp: "O(1)",
  pit: ["转置时遍历整个矩阵（交换两次等于没换）", "顺时针和逆时针的翻转方向搞反", "非方阵无法原地旋转"],
  va: "旋转 180° = 上下翻转 + 左右翻转；旋转任意角度需插值不在本题范围",
},

"spiral-generate": {
  rec: "生成 n×n 螺旋矩阵（1 到 n²）。",
  idea: "与螺旋遍历同构，只是把「读」换成「写」，用一个递增计数器填充。",
  key: "边界收缩的判断条件与遍历版完全一致。",
  cpp: `vector<vector<int>> g(n, vector<int>(n));
int t = 0, b = n - 1, l = 0, r = n - 1, v = 1;
while (t <= b && l <= r) {
    for (int j = l; j <= r; j++) g[t][j] = v++;
    t++;
    for (int i = t; i <= b; i++) g[i][r] = v++;
    r--;
    if (t <= b) { for (int j = r; j >= l; j--) g[b][j] = v++; b--; }
    if (l <= r) { for (int i = b; i >= t; i--) g[i][l] = v++; l++; }
}`,
  py: `g = [[0]*n for _ in range(n)]
t, b, l, r, v = 0, n-1, 0, n-1, 1
while t <= b and l <= r:
    for j in range(l, r+1): g[t][j] = v; v += 1
    t += 1
    for i in range(t, b+1): g[i][r] = v; v += 1
    r -= 1
    if t <= b:
        for j in range(r, l-1, -1): g[b][j] = v; v += 1
        b -= 1
    if l <= r:
        for i in range(b, t-1, -1): g[i][l] = v; v += 1
        l += 1`,
  time: "O(n²)", sp: "O(n²)",
  pit: ["后两条边缺边界判断导致覆盖", "n = 1 时特判", "行列索引写反"],
  va: "按方向数组 + 撞墙转向的写法更通用（适合非方阵）",
},

/* ---------------- 单调栈 ---------------- */
"mono-next-greater": {
  rec: "下一个更大元素 / 左右第一个更小的数。",
  idea: "与 next-greater 同一模板：栈内保持单调，遇到破坏单调性的元素就弹栈并回填答案。",
  key: "找「下一个更大」栈递减；找「下一个更小」栈递增。方向决定单调性。",
  cpp: `vector<int> ans(n, -1); stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) { ans[st.top()] = a[i]; st.pop(); }
    st.push(i);
}`,
  py: `ans = [-1]*n; st = []
for i, x in enumerate(a):
    while st and a[st[-1]] < x: ans[st.pop()] = x
    st.append(i)`,
  time: "O(n)", sp: "O(n)",
  pit: ["递增/递减方向搞反", "环形需要遍历 2n 次取模", "要求下标距离而不是值"],
  va: "接雨水、柱状图最大矩形都是单调栈的经典应用",
},

"mono-daily-temp": {
  rec: "还要等几天才会更暖 / 下一个更大元素的距离。",
  idea: "单调栈存下标，当前温度大于栈顶温度时，两者下标差就是栈顶的答案。",
  key: "答案存的是「距离」而不是「值」，所以栈里必须存下标。",
  cpp: `vector<int> ans(n, 0); stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) { ans[st.top()] = i - st.top(); st.pop(); }
    st.push(i);
}`,
  py: `ans = [0]*n; st = []
for i, x in enumerate(a):
    while st and a[st[-1]] < x: ans[st.pop()] = i - st[-1] if False else 0
    st.append(i)
# 正确写法
ans = [0]*n; st = []
for i, x in enumerate(a):
    while st and a[st[-1]] < x:
        j = st.pop(); ans[j] = i - j
    st.append(i)`,
  time: "O(n)", sp: "O(n)",
  pit: ["下标差写反（i - j）", "相等温度不算更暖（用 < 不用 <=）", "默认值应为 0"],
  va: "变体：找下一个更小的距离，改比较符即可",
},

"mono-max-rect": {
  rec: "柱状图中最大的矩形面积。",
  idea: "对每根柱子，找左右两边第一个比它矮的位置，宽度 = 右 - 左 - 1，面积 = 高度 × 宽度。用单调栈一次遍历求出所有柱子的左右边界。",
  key: "两头加哨兵（高度 0）可以省掉栈非空的边界判断，写法更干净。",
  cpp: `vector<int> h = heights; h.insert(h.begin(), 0); h.push_back(0);
stack<int> st; long long best = 0;
for (int i = 0; i < (int)h.size(); i++) {
    while (!st.empty() && h[st.top()] > h[i]) {
        int ht = h[st.top()]; st.pop();
        int w = i - st.top() - 1;
        best = max(best, (long long)ht * w);
    }
    st.push(i);
}`,
  py: `h = [0] + heights + [0]; st = []; best = 0
for i, x in enumerate(h):
    while st and h[st[-1]] > x:
        ht = h[st.pop()]; w = i - st[-1] - 1
        best = max(best, ht * w)
    st.append(i)`,
  time: "O(n)", sp: "O(n)",
  pit: ["宽度算成 i - j（少减 1）", "面积用 int 溢出", "哨兵忘了加导致边界处理复杂"],
  va: "最大子矩阵：逐行累积高度后对每行跑一次本题算法 O(n·m)",
},

/* ---------------- 并查集 / 进阶 ---------------- */
"uf-components": {
  rec: "连通块个数 / 有多少个朋友圈。",
  idea: "初始每个点自成一个集合（连通块数 = n），每次成功合并就让计数减 1。",
  key: "只有 find(a) != find(b) 时才是有效合并，否则计数不变。",
  cpp: `int comp = n;
int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) { fa[a] = b; comp--; }
}`,
  py: `comp = n
def find(x):
    while fa[x] != x: fa[x] = fa[fa[x]]; x = fa[x]
    return x
def unite(a, b):
    global comp
    a, b = find(a), find(b)
    if a != b: fa[a] = b; comp -= 1`,
  time: "均摊 O(α(n))", sp: "O(n)",
  pit: ["先减计数再判断是否连通", "初始化遗漏", "只统计根的数量也可以，但要遍历所有点"],
  va: "统计每个连通块大小：合并时把 size 相加",
},

"uf-redundant": {
  rec: "找出一条多余的边（加入后成环）。",
  idea: "按顺序处理每条边，若两端已连通，这条边就是多余的（成环）；否则合并。",
  key: "题目要求返回「最后出现」的多余边时，需要遍历完所有边并记录最后一个冲突。",
  cpp: `for (auto &[u, v] : edges) {
    if (find(u) == find(v)) { cout << u << " " << v; }   // 多余的边
    else fa[find(u)] = find(v);
}`,
  py: `for u, v in edges:
    if find(u) == find(v): print(u, v)
    else: fa[find(u)] = find(v)`,
  time: "O(m α(n))", sp: "O(n)",
  pit: ["要求最后一条时忘记继续遍历", "有向图版本需要分别考虑入度为 2 的情况", "边的顺序影响答案"],
  va: "有向图的冗余边：先找入度为 2 的候选，再用并查集验证",
},

"fenwick-ops": {
  rec: "单点修改 + 前缀和查询（或区间和）。",
  idea: "树状数组用 lowbit 划分区间：修改时向父亲跳（i += i & -i），查询时向低位跳（i -= i & -i）。两个操作都是 O(log n)。",
  key: "树状数组的下标必须从 1 开始，0 会导致死循环。",
  cpp: `int bit[N];
void add(int i, int v) { for (; i <= n; i += i & -i) bit[i] += v; }
long long sum(int i) { long long s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }
// 区间和 = sum(r) - sum(l-1)`,
  py: `def add(i, v):
    while i <= n: bit[i] += v; i += i & -i
def qry(i):
    s = 0
    while i > 0: s += bit[i]; i -= i & -i
    return s`,
  time: "O(log n) 每次操作", sp: "O(n)",
  pit: ["下标 0 导致死循环（lowbit(0) = 0）", "查询用 sum(r) - sum(l) 少减 1", "多组数据忘记清空 bit"],
  va: "区间修改 + 区间查询用「两个树状数组」；二维树状数组做矩阵前缀和",
},

"sparse-rmq": {
  rec: "静态数组的区间最大值 / 最小值查询（无修改）。",
  idea: "ST 表：st[k][i] 表示从 i 开始长度为 2^k 的区间最值。预处理 O(n log n)，查询时用两段长度 2^k 的区间覆盖 [l, r] 取最值。",
  key: "查询时两段可以重叠（最值可重复计算），这正是 ST 表能做到 O(1) 的原因。",
  cpp: `int lg[N], st[20][N];
for (int i = 2; i <= n; i++) lg[i] = lg[i >> 1] + 1;
for (int i = 1; i <= n; i++) st[0][i] = a[i];
for (int k = 1; (1 << k) <= n; k++)
    for (int i = 1; i + (1 << k) - 1 <= n; i++)
        st[k][i] = max(st[k-1][i], st[k-1][i + (1 << (k-1))]);
int query(int l, int r) {
    int k = lg[r - l + 1];
    return max(st[k][l], st[k][r - (1 << k) + 1]);
}`,
  py: `import math
lg = [0]*(n+1)
for i in range(2, n+1): lg[i] = lg[i>>1] + 1
st = [a[:]]
k = 1
while (1 << k) <= n:
    prev = st[-1]; half = 1 << (k-1)
    st.append([max(prev[i], prev[i+half]) for i in range(n - (1<<k) + 1)])
    k += 1`,
  time: "预处理 O(n log n)，查询 O(1)", sp: "O(n log n)",
  pit: ["右端点算成 r - 2^k（要 +1）", "lg 数组未预处理导致每次 log 调用", "有修改时 ST 表失效"],
  va: "有修改的区间最值用线段树；区间 gcd 也可用 ST 表（gcd 同样可重叠）",
},

"diff-range-add": {
  rec: "对区间统一加值 / 统一赋值，最后输出。",
  idea: "与 diff-range 完全同构：差分数组记录变化量，最后前缀和还原。若是区间赋值，需要用「差分 + 时间戳」或线段树。",
  key: "多次操作后一次性还原时，差分是最优解（O(n + m)）。",
  cpp: `vector<long long> d(n + 2, 0);
while (m--) {
    int l, r; long long v; cin >> l >> r >> v;
    d[l] += v; d[r + 1] -= v;
}
for (int i = 1; i <= n; i++) d[i] += d[i - 1];`,
  py: `for _ in range(m):
    l, r, v = map(int, input().split())
    d[l] += v; d[r + 1] -= v
for i in range(1, n+1): d[i] += d[i-1]`,
  time: "O(n + m)", sp: "O(n)",
  pit: ["r+1 越界", "忘记还原", "区间赋值不能用简单差分（要用线段树懒标记）"],
  va: "二维区间加用二维差分；需要中间查询时改用树状数组",
},

"game-nim": {
  rec: "取石子游戏，两人轮流取，取最后一个获胜。",
  idea: "Nim 博弈：所有堆石子数异或和不为 0 时先手必胜。异或和为 0 是必败态，任何操作都会变成非 0，对手总能还回 0。",
  key: "结论只依赖异或和是否为 0；具体策略需要「让异或和回到 0」的那一步。",
  cpp: `int x = 0;
for (int v : a) x ^= v;
cout << (x ? "first" : "second");`,
  py: `x = 0
for v in a: x ^= v
print("first" if x else "second")`,
  time: "O(n)", sp: "O(1)",
  pit: ["规则是「取最后一个输」时结论反转（除全为 1 外仍按异或）", "每次可取 1~k 个是另一种博弈（取模）",
        "多堆合并时异或顺序无关"],
  va: "威佐夫博弈、巴什博弈各有独立结论；SG 函数可处理任意规则",
},

"sim-robot": {
  rec: "按指令移动机器人 / 模拟走格子。",
  idea: "维护方向（0/1/2/3 对应右上左下）与坐标，每个指令更新状态。用方向数组避免大量 if-else。",
  key: "左转是 (d + 3) % 4，右转是 (d + 1) % 4 —— 减 1 要 +4 再取模防负数。",
  cpp: `int dx[4] = {0, 1, 0, -1}, dy[4] = {1, 0, -1, 0};   // 右上左下
int x = 0, y = 0, d = 0;
for (char c : cmd) {
    if (c == 'L') d = (d + 3) % 4;
    else if (c == 'R') d = (d + 1) % 4;
    else { x += dx[d]; y += dy[d]; }
}`,
  py: `dx, dy = (0,1,0,-1), (1,0,-1,0)
x = y = d = 0
for c in cmd:
    if c == 'L': d = (d + 3) % 4
    elif c == 'R': d = (d + 1) % 4
    else: x += dx[d]; y += dy[d]`,
  time: "O(len)", sp: "O(1)",
  pit: ["左转写成 (d - 1) % 4，C++ 中负数取模为负", "坐标系方向与题目不一致（左右手系）",
        "撞墙/越界时的处理规则"],
  va: "判断指令是否成环（重复执行回到原点）用状态 (x, y, d) 的集合判重",
},

"stack-two-queue": {
  rec: "用两个栈实现队列 / 用两个队列实现栈。",
  idea: "两个栈：in 栈负责入队，out 栈负责出队。out 为空时把 in 全部倒入 out，顺序就反过来了（正好符合 FIFO）。均摊 O(1)。",
  key: "只在 out 为空时倒栈，否则顺序会乱，且复杂度退化。",
  cpp: `stack<int> in, out;
void push(int x) { in.push(x); }
int pop() {
    if (out.empty()) while (!in.empty()) { out.push(in.top()); in.pop(); }
    int v = out.top(); out.pop(); return v;
}`,
  py: `in_, out_ = [], []
def push(x): in_.append(x)
def pop():
    if not out_:
        while in_: out_.append(in_.pop())
    return out_.pop()`,
  time: "均摊 O(1)", sp: "O(n)",
  pit: ["每次 pop 都倒栈导致 O(n²)", "out 非空时仍然倒栈", "空队列的边界处理"],
  va: "用两个队列实现栈：每次 push 后把前面的元素搬到新队列尾部",
},

};
