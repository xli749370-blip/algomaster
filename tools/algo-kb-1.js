/* 算法专题 KB · 基础篇（6 个专题）
   每个专题：goals 目标 → sections 若干节（lead 直觉 / body 解释 / fig 图示 / code 代码 / table 对照 / pts 要点 / pit 踩坑）→ sum 一句话
*/
module.exports = [
  {
    id: "complexity",
    cat: "基础",
    title: "时间复杂度与算法分析",
    diff: "简单",
    desc: "大 O 记号 · 主定理 · 由数据范围倒推算法",
    mins: 22,
    goals: [
      "能用大 O 说清一段代码随 n 增长的量级",
      "看到题目数据范围就能倒推出可用的复杂度上限",
      "判断递归式 T(n)=aT(n/b)+f(n) 的量级",
      "知道常数、缓存、语言差异会怎样影响实际耗时",
    ],
    sections: [
      {
        t: "大 O 只关心「增长」，不关心「跑多快」",
        lead: "同一份代码换台机器能快十倍，但 n 翻倍后耗时变成几倍，这个「倍数关系」才是算法的本质。",
        body: [
          "大 O 描述的是 **上界**：当 n 足够大时，耗时不会超过某个常数乘以 f(n)。所以 3n²+100n+5000 写作 O(n²)，常数和低阶项都被扔掉。",
          "这么做的理由是：n=10⁵ 时，n²=10¹⁰ 完全压倒了 100n=10⁷。低阶项只在 n 很小时重要，而那时任何写法都能过。",
        ],
        fig: "curve",
        pts: [
          "**O(1)**：数组下标、哈希查找、栈顶操作",
          "**O(log n)**：二分、平衡树、倍增（n 每次减半 → 约 20 次就到 1）",
          "**O(n)**：一次遍历、双指针、前缀和",
          "**O(n log n)**：排序、堆操作 n 次、归并类分治",
          "**O(n²)**：双重循环、枚举点对、Floyd",
          "**O(2ⁿ) / O(n!)**：子集枚举、全排列暴力",
        ],
      },
      {
        t: "倒推法：从数据范围反推复杂度上限",
        lead: "比赛里最快确定算法方向的办法，不是想算法，而是先看 n 有多大。",
        body: [
          "经验值：C++ 每秒约 **10⁸** 次简单运算；Java 约 10⁷~10⁸；Python 约 10⁶~10⁷（同样代码慢 20~50 倍）。据此可以框定复杂度上限：",
        ],
        table: [
          ["数据范围", "可接受复杂度", "典型算法"],
          ["n ≤ 10", "O(n!)", "全排列、暴力搜"],
          ["n ≤ 20", "O(2ⁿ)", "状压 DP、子集枚举"],
          ["n ≤ 100", "O(n³)", "Floyd、区间 DP、三重循环"],
          ["n ≤ 2000", "O(n²)", "普通 DP、枚举点对"],
          ["n ≤ 10⁵", "O(n log n)", "排序、二分、线段树、堆"],
          ["n ≤ 10⁷", "O(n)", "双指针、前缀和、哈希、单调栈"],
          ["n ≥ 10⁸", "O(log n) / O(1)", "数学公式、快速幂、矩阵快速幂"],
        ],
        pit: "范围是 1 ≤ n ≤ 2000 却写了 O(n²) 的 DP，看着能过，但常数大的时候（每次转移里有取模、字符串拼接）会刚好超时。留 3~5 倍余量才稳。",
      },
      {
        t: "递归式的量级：主定理够用了",
        lead: "分治算法的复杂度都长成 T(n) = a·T(n/b) + O(n^d) 的样子，套公式就能出结果。",
        code: `// T(n) = a·T(n/b) + O(n^d) 的三种情况
// 1) d < log_b(a)  →  T(n) = O(n^(log_b a))   子问题主导
// 2) d = log_b(a)  →  T(n) = O(n^d · log n)   两者相当
// 3) d > log_b(a)  →  T(n) = O(n^d)           合并主导

// 归并排序：T(n)=2T(n/2)+O(n)  → a=2,b=2,d=1，log_2(2)=1=d → O(n log n)
// 二分查找：T(n)=1T(n/2)+O(1)  → a=1,b=2,d=0，log_2(1)=0=d → O(log n)
// 快速幂  ：T(n)=1T(n/2)+O(1)  → 同上 → O(log n)
// 二叉树遍历：T(n)=2T(n/2)+O(1) → a=2,b=2,d=0，0<1 → O(n)`,
        lang: "text",
        cap: "记不住公式就代具体例子：归并排序每次把问题劈两半、再花 O(n) 合并，一共劈 log n 层，所以是 n log n。",
      },
      {
        t: "常数、空间与实测",
        lead: "同样是 O(n log n)，std::sort 比手写冒泡快几十倍——渐进复杂度相同，常数不同。",
        body: [
          "渐进复杂度只保证「n 大时谁更优」，但在 n 不够大时，常数决定胜负。所以小数据下插入排序常被用作快排的收尾优化（小区间直接插排）。",
          "空间复杂度同样要看：递归深度 O(n) 在 n=10⁶ 时会把栈撑爆，必须改成迭代或手工栈。DP 常用滚动数组把 O(n²) 空间压到 O(n)。",
        ],
        pts: [
          "**时间换空间**：预处理表、记忆化、打表",
          "**空间换时间**：哈希表把 O(n) 查找降到 O(1)",
          "**缓存友好**：连续内存访问比随机跳转快 5~10 倍，所以二维数组按行遍历更快",
          "**避免不必要拷贝**：C++ 传 `const string&`，Java 小心 `substring` 在旧版本里的内存泄漏",
        ],
        pit: "用 `endl` 而不是 `\\n` 刷输出，每次强制 flush，10⁵ 行输出能慢十倍——这是最常见的「莫名其妙的 TLE」。",
      },
    ],
    sum: "先看数据范围定复杂度上限，再想算法；大 O 只管增长，常数要靠写法规避。",
  },

  {
    id: "sorting",
    cat: "基础",
    title: "排序算法全家桶",
    diff: "简单",
    desc: "快排 / 归并 / 堆排 / 计数排序 · 稳定性 · 手写模板",
    mins: 26,
    goals: [
      "说清五种常见排序的复杂度、稳定性与适用场景",
      "能手写归并排序并顺便求出逆序对",
      "知道什么时候该用计数排序而不是 sort",
      "会用自定义比较器做多关键字排序",
    ],
    sections: [
      {
        t: "一张表看懂所有排序",
        lead: "面试问排序，真正想听的是「你为什么选这个」，而不是背诵复杂度。",
        table: [
          ["算法", "平均", "最坏", "空间", "稳定", "适合场景"],
          ["冒泡 / 插入", "O(n²)", "O(n²)", "O(1)", "稳定", "n 很小或基本有序"],
          ["选择排序", "O(n²)", "O(n²)", "O(1)", "不稳定", "交换代价大的场合"],
          ["快速排序", "O(n log n)", "O(n²)", "O(log n)", "不稳定", "通用，常数最小"],
          ["归并排序", "O(n log n)", "O(n log n)", "O(n)", "稳定", "要求稳定 / 求逆序对"],
          ["堆排序", "O(n log n)", "O(n log n)", "O(1)", "不稳定", "内存紧、要最坏保证"],
          ["计数排序", "O(n+k)", "O(n+k)", "O(k)", "稳定", "值域小（如成绩 0~100）"],
          ["sort()", "O(n log n)", "O(n log n)", "O(log n)", "不稳定", "默认就用它"],
        ],
        pit: "std::sort 不稳定！需要稳定排序时用 `std::stable_sort`，或者把「原始下标」一起塞进比较器做兜底。",
      },
      {
        t: "快速排序：分区是全部难点",
        lead: "快排的核心只有一句：选一个基准值，把小于它的放左边、大于它的放右边，然后两边递归。",
        body: [
          "下面这份写法用「挖坑法」分区：把基准值存起来，右指针找小的往左填，左指针找大的往右填，最后把基准值放回坑里。",
          "随机化基准值可以避免「已有序数组」退化成 O(n²)——这是最容易被卡的测试点。",
        ],
        code: `void quickSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int p = l + rand() % (r - l + 1);   // 随机基准，防退化
    swap(a[l], a[p]);
    int key = a[l], i = l, j = r;
    while (i < j) {
        while (i < j && a[j] >= key) --j;  // 右找小
        if (i < j) a[i++] = a[j];
        while (i < j && a[i] <= key) ++i;  // 左找大
        if (i < j) a[j--] = a[i];
    }
    a[i] = key;
    quickSort(a, l, i - 1);
    quickSort(a, i + 1, r);
}`,
        lang: "cpp",
        cap: "注意 `>=` / `<=` 的等号：漏掉会让重复元素多的数组死循环。",
        fig: "passes",
      },
      {
        t: "归并排序：顺手求出逆序对",
        lead: "归并的合并过程天然知道「右边有多少个数比左边小」，所以求逆序对只是加一行计数。",
        code: `long long cnt = 0;                        // 逆序对数量
void mergeSort(vector<int>& a, vector<int>& t, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(a, t, l, mid);
    mergeSort(a, t, mid + 1, r);
    int i = l, j = mid + 1, k = l;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) t[k++] = a[i++];
        else { cnt += mid - i + 1; t[k++] = a[j++]; }  // a[i..mid] 全比 a[j] 大
    }
    while (i <= mid) t[k++] = a[i++];
    while (j <= r)   t[k++] = a[j++];
    for (int x = l; x <= r; ++x) a[x] = t[x];
}`,
        lang: "cpp",
        cap: "`cnt += mid - i + 1` 是关键：一旦 a[j] 更小，左半边从 i 到 mid 的所有元素都构成逆序对。",
        pts: [
          "逆序对数量可达 n(n-1)/2，n=10⁵ 时是 5×10⁹，**必须用 long long**",
          "归并排序是稳定排序：合并时 `a[i] <= a[j]` 取左边，相等元素顺序不变",
          "用 `std::inplace_merge` 可以少写合并逻辑，但求逆序对必须自己写",
        ],
      },
      {
        t: "计数排序与自定义比较器",
        lead: "值域很小时，把「比较」换成「计数」，复杂度直接降到 O(n+k)。",
        code: `// 值域 0..100 的成绩排序：O(n + 101)
vector<int> cnt(101, 0);
for (int x : score) cnt[x]++;
for (int v = 0; v <= 100; ++v)
    for (int k = 0; k < cnt[v]; ++k) ans.push_back(v);

// 多关键字：先按分数降序，分数相同按名字升序
sort(v.begin(), v.end(), [](const Node& a, const Node& b) {
    if (a.score != b.score) return a.score > b.score;
    return a.name < b.name;            // 比较器必须是严格弱序
});`,
        lang: "cpp",
        pit: "比较器里用 `>=` 而不是 `>` 会破坏严格弱序，std::sort 可能越界崩溃（表现为莫名其妙的 RE）。相等的情况一律返回 false。",
      },
    ],
    sum: "默认用 sort；要稳定用 stable_sort；值域小用计数排序；求逆序对用归并。",
  },

  {
    id: "binary",
    cat: "基础",
    title: "二分查找与二分答案",
    diff: "简单",
    desc: "三种写法 · lower_bound · 答案单调性识别",
    mins: 24,
    goals: [
      "写出不会死循环、不会漏解的二分模板",
      "区分「找值」「找左边界」「找右边界」三种需求",
      "识别哪些最优化问题可以用二分答案做",
      "用 STL 的 lower_bound / upper_bound 少写代码",
    ],
    sections: [
      {
        t: "二分的本质：每次丢掉一半",
        lead: "只要「答案空间」能用一个单调的判定函数切开，就能二分——不管这个空间是数组下标还是某个数值。",
        fig: "bsearch",
        body: [
          "数组二分要求有序；二分答案要求「单调性」：如果 x 可行，那么比 x 更宽松（或更严格）的一侧也可行。",
          "写二分最容易错的是边界：区间是闭的 `[l, r]` 还是半开 `[l, r)`？循环条件是 `l <= r` 还是 `l < r`？混用必崩。",
        ],
      },
      {
        t: "模板一：找精确值（闭区间）",
        lead: "最直观的写法：区间是 [l, r]，循环到区间为空为止。",
        code: `int bsearch(const vector<int>& a, int target) {
    int l = 0, r = (int)a.size() - 1;
    while (l <= r) {                 // 闭区间，l > r 时区间为空
        int mid = l + (r - l) / 2;   // 防溢出，等价于 (l+r)/2
        if (a[mid] == target) return mid;
        if (a[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;                        // 没找到
}`,
        lang: "cpp",
        cap: "`mid = l + (r - l) / 2` 比 `(l + r) / 2` 更安全：当 l、r 都接近 INT_MAX 时后者会溢出成负数，导致越界访问。",
      },
      {
        t: "模板二：找边界（半开区间，最不容易错）",
        lead: "把答案想成「第一个满足条件的下标」，写法固定为 [l, r)，全程不改语义。",
        code: `// 第一个 >= x 的位置（等价于 lower_bound）
int lowerBound(const vector<int>& a, int x) {
    int l = 0, r = (int)a.size();     // 半开区间 [l, r)
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (a[mid] < x) l = mid + 1;  // mid 不可能是答案
        else r = mid;                 // mid 可能是答案，保留
    }
    return l;                          // l == r，就是答案
}

// 最后一个 <= x 的位置：把条件与返回值都反过来
int lastLE(const vector<int>& a, int x) {
    int l = 0, r = (int)a.size();
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (a[mid] <= x) l = mid + 1;  // mid 可以，往右找更靠后的
        else r = mid;
    }
    return l - 1;                      // 回退一格
}`,
        lang: "cpp",
        pts: [
          "**记忆口诀**：条件写成「mid 满足吗」，满足就保留 mid（`r = mid`），不满足就 `l = mid + 1`",
          "`lower_bound(a, x)` = 第一个 ≥ x；`upper_bound(a, x)` = 第一个 > x",
          "两者相减就是 x 的出现次数：`upper_bound - lower_bound`",
          "半开区间写法**永远返回 l**，不需要 ±1 的特判",
        ],
        pit: "在 `while(l < r)` 里写 `l = mid` 会死循环（当 r = l + 1 时 mid 永远等于 l）。半开写法里必须至少一边是 `mid + 1`。",
      },
      {
        t: "二分答案：把「求最优」变成「判可行」",
        lead: "题目问「最小的最大长度」「最多能装多少」，只要能快速判断「给定值是否可行」，就可以对答案二分。",
        body: [
          "判定函数 check(x) 必须单调：x 变大时可行 → 不可行，或者反过来。二分找出这个临界点。",
          "下面是最经典的「分割数组的最大值」：把数组切成 k 段，让最大段和最小。答案是「段和」，范围是 [最大值, 总和]。",
        ],
        code: `bool check(const vector<int>& a, int k, long long limit) {
    long long cur = 0; int seg = 1;
    for (int x : a) {
        if (x > limit) return false;          // 单个元素就超了
        if (cur + x > limit) { ++seg; cur = x; }
        else cur += x;
    }
    return seg <= k;
}

long long solve(const vector<int>& a, int k) {
    long long l = *max_element(a.begin(), a.end());
    long long r = accumulate(a.begin(), a.end(), 0LL);
    while (l < r) {                            // 找第一个可行的 limit
        long long mid = l + (r - l) / 2;
        if (check(a, k, mid)) r = mid;
        else l = mid + 1;
    }
    return l;
}`,
        lang: "cpp",
        cap: "答案是「最小可行值」，所以用「第一个满足 check 的位置」模板，答案区间就是 [max, sum]，不用担心越界。",
        pit: "check 里用 int 累加会溢出（总和可能到 10¹⁴），所有涉及和的变量一律 long long。",
      },
    ],
    sum: "二分只有两种：找值用闭区间，找边界用半开区间；二分答案的前提是 check 单调。",
  },

  {
    id: "twopointer",
    cat: "基础",
    title: "双指针与滑动窗口",
    diff: "简单",
    desc: "对撞指针 · 快慢指针 · 定长与不定长窗口",
    mins: 25,
    goals: [
      "判断一道题该用对撞指针、快慢指针还是滑动窗口",
      "写出不会漏掉答案的不定长窗口模板",
      "用双指针把 O(n²) 的枚举优化到 O(n)",
      "处理窗口内的计数、去重、最值维护",
    ],
    sections: [
      {
        t: "三种指针，三种用途",
        lead: "双指针不是一种算法，而是一类「用两个位置代替两层循环」的优化思路。",
        fig: "twoptr",
        table: [
          ["类型", "移动方向", "典型题"],
          ["对撞指针", "从两端向中间", "两数之和（有序）、回文判断、盛最多水的容器"],
          ["快慢指针", "同向，速度不同", "链表找环、找中点、删除倒数第 k 个"],
          ["滑动窗口", "同向，右扩左缩", "最长无重复子串、最小覆盖子串、定长子数组最大和"],
        ],
        body: [
          "能用的前提是 **单调性**：左指针右移后，右指针不需要回退。这让总移动次数是 O(n) 而不是 O(n²)。",
        ],
      },
      {
        t: "对撞指针：两数之和（有序数组）",
        lead: "和太小就左指针右移，和太大就右指针左移——每一步都能排除一整行或一整列。",
        code: `vector<int> twoSum(vector<int>& a, int target) {
    int l = 0, r = (int)a.size() - 1;
    while (l < r) {
        int sum = a[l] + a[r];
        if (sum == target) return {l, r};
        if (sum < target) ++l;      // 太小：只能增大左边
        else --r;                    // 太大：只能减小右边
    }
    return {};
}`,
        lang: "cpp",
        cap: "为什么不会漏解：当 a[l]+a[r] < target 时，a[l] 与任何 a[j] (j ≤ r) 的和都更小，所以 l 可以永久右移。",
      },
      {
        t: "不定长滑动窗口：万能模板",
        lead: "右指针负责「扩张」，左指针负责「收缩到合法」，每次收缩完都是一段合法区间。",
        code: `// 例：最长无重复字符子串
int lengthOfLongestSubstring(string s) {
    vector<int> last(128, -1);      // 每个字符最后出现的位置
    int ans = 0, l = 0;
    for (int r = 0; r < (int)s.size(); ++r) {
        if (last[s[r]] >= l) l = last[s[r]] + 1;   // 左边界跳到重复字符之后
        last[s[r]] = r;
        ans = max(ans, r - l + 1);                 // 当前窗口 [l, r]
    }
    return ans;
}`,
        lang: "cpp",
        body: [
          "窗口的通用骨架是：`for (r ...) { 加入 a[r]; while (不合法) { 移除 a[l]; ++l; } 更新答案; }`。",
          "「不合法」的判断用计数数组 / 哈希表 / 单调队列维护，取决于题目要的是「无重复」还是「最大最小值」。",
        ],
        pts: [
          "窗口长度固定时（如「长度为 k 的子数组最大和」），不需要 while，直接减去 a[r-k] 即可",
          "求「最小窗口」时，答案要在 while 循环内部更新，而不是外面",
          "窗口内求和用前缀和，求最值用单调队列，求众数用计数数组",
        ],
        pit: "用 `map` 记录位置时忘了判断 `last[c] >= l`：如果重复字符在窗口外，左边界不应该跳，否则会漏掉更长的合法窗口。",
      },
      {
        t: "快慢指针：链表找环",
        lead: "慢指针走一步、快指针走两步；有环必然相遇，相遇后从头再走一遍就能找到环入口。",
        code: `ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {                  // 相遇，说明有环
            ListNode* p = head;
            while (p != slow) { p = p->next; slow = slow->next; }
            return p;                        // 环入口
        }
    }
    return nullptr;
}`,
        lang: "cpp",
        cap: "设头到环入口距离 a、入口到相遇点 b、环长 c，则 2(a+b) = a+b+kc → a = (k-1)c + (c-b)，所以从头和从相遇点同步走必在入口相遇。",
      },
    ],
    sum: "对撞指针靠「和的单调性」，滑动窗口靠「左边界不回退」，快慢指针靠「两步追一步」。",
  },

  {
    id: "prefix",
    cat: "基础",
    title: "前缀和与差分",
    diff: "简单",
    desc: "一维 / 二维前缀和 · 差分数组 · 区间修改",
    mins: 22,
    goals: [
      "用前缀和把区间求和从 O(n) 降到 O(1)",
      "用差分把区间加从 O(n) 降到 O(1)",
      "写出二维前缀和与二维差分的公式",
      "知道什么时候该用前缀异或、前缀积、前缀最值",
    ],
    sections: [
      {
        t: "前缀和：用一次预处理换 n 次查询",
        lead: "把「前面所有数的和」提前算好存起来，任意区间和就变成两个前缀相减。",
        code: `// 下标从 1 开始，pre[0] = 0，省掉边界判断
vector<long long> pre(n + 1, 0);
for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + a[i];

// 区间 [l, r] 的和
long long sum = pre[r] - pre[l - 1];

// 和为 k 的子数组个数（配合哈希）
unordered_map<long long, int> cnt{{0, 1}};
long long ans = 0;
for (int i = 1; i <= n; ++i) {
    ans += cnt[pre[i] - k];      // 有多少个前缀 = pre[i] - k
    cnt[pre[i]]++;
}`,
        lang: "cpp",
        fig: "prefixsum",
        pts: [
          "下标从 1 开始能省掉 `if (l > 1)` 的判断，代价是多开一个格子",
          "和可能很大：n=10⁵、每个数 10⁹ 时总和是 10¹⁴，必须 long long",
          "「前缀和 + 哈希表」是求「和为 k 的子数组」的标准解法，O(n)",
        ],
        pit: "差分数组回填时用 `for (i = 1; i <= n; ++i) d[i] += d[i-1]`，别漏了从 1 开始——从 0 开始会把 d[0] 的自增算进去。",
      },
      {
        t: "差分：区间加法的逆运算",
        lead: "要对 [l, r] 整体加 v，只在 l 处 +v、r+1 处 -v，最后求一次前缀和就还原了。",
        code: `vector<long long> d(n + 2, 0);           // 多开一位放 r+1
auto rangeAdd = [&](int l, int r, long long v) {
    d[l] += v;
    d[r + 1] -= v;
};

// 所有操作完成后，一次前缀和还原
for (int i = 1; i <= n; ++i) {
    d[i] += d[i - 1];
    a[i] = d[i];                          // a[i] 就是最终值
}`,
        lang: "cpp",
        cap: "差分数组 d[i] 的含义是「a[i] - a[i-1]」。区间加 v 只改变两个边界处的差分值，所以是 O(1)。",
        body: [
          "差分适合「先做很多次区间修改，最后统一查询」的场景。如果查询和修改交替出现，就需要线段树或树状数组。",
        ],
      },
      {
        t: "二维前缀和与二维差分",
        lead: "二维就是容斥原理：大矩形减去两条边，再加回多减的那块。",
        code: `// 二维前缀和：pre[i][j] = 左上角 (1,1) 到 (i,j) 的矩形和
pre[i][j] = pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1] + a[i][j];

// 子矩阵 (x1,y1)~(x2,y2) 的和
sum = pre[x2][y2] - pre[x1-1][y2] - pre[x2][y1-1] + pre[x1-1][y1-1];

// 二维差分：给子矩阵整体加 v
d[x1][y1] += v;
d[x1][y2+1] -= v;
d[x2+1][y1] -= v;
d[x2+1][y2+1] += v;   // 多减的加回来
// 还原：两遍前缀和（先按行，再按列）`,
        lang: "cpp",
        table: [
          ["用途", "一维", "二维"],
          ["区间求和", "pre[r] - pre[l-1]", "四角容斥（4 项）"],
          ["区间加", "d[l]+=v, d[r+1]-=v", "四角标记（4 项）"],
          ["还原方式", "一次前缀和", "两次前缀和"],
          ["空间", "O(n)", "O(n·m)"],
        ],
        pit: "二维差分数组要开到 (n+2)×(m+2)，因为会访问 x2+1、y2+1。开小了在边界上直接越界，报错信息还看不懂。",
      },
    ],
    sum: "求和用前缀和，区间改用差分；二维全靠容斥，四个角别写反。",
  },

  {
    id: "hash",
    cat: "基础",
    title: "哈希表实战",
    diff: "简单",
    desc: "拉链法与开放寻址 · STL 容器选择 · 防卡哈希",
    mins: 20,
    goals: [
      "说清哈希表为什么平均 O(1)、最坏 O(n)",
      "在 unordered_map / map / 数组之间做正确选择",
      "知道怎么防「被卡哈希」的构造数据",
      "用哈希表解决去重、计数、配对三类问题",
    ],
    sections: [
      {
        t: "哈希表是怎么做到 O(1) 的",
        lead: "把 key 用一个函数算成桶号，直接跳到那个桶——省掉了「逐个比较」的过程。",
        fig: "buckets",
        body: [
          "两个 key 算出同一个桶号叫**冲突**。主流解决方式有两种：拉链法（桶里挂链表 / 红黑树）和开放寻址（冲突就往后找空位）。",
          "桶的数量固定时，元素越多冲突越多。所以当**负载因子**（元素数 / 桶数）超过阈值（通常 0.75）就要扩容并重新哈希。",
        ],
        table: [
          ["容器", "底层", "查询", "有序", "适用"],
          ["unordered_map", "哈希 + 拉链", "平均 O(1)", "否", "纯查表、计数"],
          ["map", "红黑树", "O(log n)", "是（按 key 升序）", "需要有序遍历 / 前驱后继"],
          ["数组（值域小）", "直接下标", "O(1)", "是", "值域 ≤ 10⁷ 的计数"],
          ["set / unordered_set", "同上", "O(1) / O(log n)", "—", "只判存在性"],
        ],
      },
      {
        t: "三个高频套路",
        lead: "哈希表在算法题里基本只干三件事：判重、计数、配对。",
        code: `// 1. 配对：两数之和（无序版）
unordered_map<int,int> pos;
for (int i = 0; i < n; ++i) {
    auto it = pos.find(target - a[i]);
    if (it != pos.end()) return {it->second, i};
    pos[a[i]] = i;
}

// 2. 计数：出现次数最多的元素
unordered_map<int,int> cnt;
for (int x : a) ++cnt[x];
int best = 0, val = 0;
for (auto& [k, v] : cnt) if (v > best) { best = v; val = k; }

// 3. 判重：最长连续序列（把数全塞进 set，只从「序列起点」开始数）
unordered_set<int> st(a.begin(), a.end());
int ans = 0;
for (int x : st) {
    if (st.count(x - 1)) continue;        // 不是起点，跳过
    int y = x;
    while (st.count(y + 1)) ++y;
    ans = max(ans, y - x + 1);
}`,
        lang: "cpp",
        cap: "最长连续序列只在「x-1 不存在」时才开始数，保证每个元素最多被访问两次，整体 O(n)。",
      },
      {
        t: "被卡哈希怎么办",
        lead: "出题人知道 unordered_map 的哈希函数，可以构造出全部落在同一个桶的数据，让你的 O(n) 退化成 O(n²)。",
        body: [
          "Codeforces 上著名的「blow up unordered_map」攻击就是利用 `std::hash<int>` 是恒等函数（整数直接当桶号），构造一堆模桶数同余的数。",
          "防御方式有三种：换随机哈希、换成 `map`（O(log n) 但稳定）、或者自己写离散化 + 数组。",
        ],
        code: `// 防御一：加随机偏移的自定义哈希
struct CustomHash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED);        // 每次运行种子不同，无法预先构造
    }
};
unordered_map<long long, int, CustomHash> mp;

// 防御二：先离散化，再用数组（最稳，也最快）
vector<long long> v = a; sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());
int id = lower_bound(v.begin(), v.end(), x) - v.begin();`,
        lang: "cpp",
        pit: "`mp[key]` 在 key 不存在时会**插入**一个默认值，循环里用它会悄悄改变 size 甚至死循环。只查不改请用 `find` 或 `count`。",
      },
    ],
    sum: "哈希表 = 用空间把查找降到 O(1)；值域小用数组，要顺序用 map，怕被卡就离散化。",
  },
];
