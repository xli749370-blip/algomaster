/* 算法专题 KB · 进阶与数据结构篇（7 个专题） */
module.exports = [
  {
    id: "recursion",
    cat: "进阶",
    title: "递归、分治与回溯",
    diff: "中等",
    desc: "递归三要素 · 分治框架 · 回溯去重与剪枝",
    mins: 28,
    goals: [
      "用「出口 + 缩小 + 不重不漏」三要素写出正确的递归",
      "说清分治与递归的关系，写出归并 / 快排的分治骨架",
      "用回溯模板解决子集、排列、组合三类问题",
      "知道回溯去重的两种写法与剪枝的三个切入口",
    ],
    sections: [
      {
        t: "递归三要素",
        lead: "递归写错，99% 是这三件事之一没想清楚：什么时候停、每层规模怎么变小、每层做的操作能不能拼出答案。",
        body: [
          "**出口**：最基本的情况直接返回，不再递归。漏掉就是栈溢出（StackOverflow）。",
          "**缩小**：每次调用必须让问题规模严格变小，否则永远到不了出口。",
          "**合并**：用子问题的结果拼出当前问题的答案。这一条决定了递归是「正向」还是「反向」。",
        ],
        code: `// 例：二叉树最大深度 —— 出口 + 缩小 + 合并
int maxDepth(TreeNode* root) {
    if (!root) return 0;                        // 出口
    int l = maxDepth(root->left);               // 缩小
    int r = maxDepth(root->right);
    return max(l, r) + 1;                       // 合并
}

// 递归深度 = 调用栈层数，n 层递归大约占 n × 单帧字节的栈空间
// 一般 OJ 栈限制 8MB，递归深度超过 10^5 就要改成迭代`,
        lang: "cpp",
        fig: "rectree",
        pit: "递归里传引用（`vector<int>& path`）能省拷贝，但回溯时必须手动恢复现场（`path.pop_back()`），漏了就是「答案里出现幽灵元素」。",
      },
      {
        t: "分治：把问题劈成互不相交的两半",
        lead: "分治 = 递归 + 「子问题互不重叠」。如果子问题重叠（如 fib），就该用动态规划而不是分治。",
        table: [
          ["算法", "怎么分", "怎么合", "复杂度"],
          ["归并排序", "按位置对半分", "合并两个有序数组", "O(n log n)"],
          ["快速排序", "按基准值分区", "无需合并（原地）", "平均 O(n log n)"],
          ["二分查找", "按大小丢一半", "直接返回", "O(log n)"],
          ["快速幂", "指数对半分", "底数平方", "O(log n)"],
          ["最近点对", "按 x 对半分", "跨中线带内暴力", "O(n log n)"],
        ],
        code: `// 快速幂：a^n 的分治写法
long long qpow(long long a, long long n, long long mod) {
    long long res = 1 % mod;
    a %= mod;
    while (n) {
        if (n & 1) res = res * a % mod;   // 当前二进制位为 1
        a = a * a % mod;                   // 底数平方
        n >>= 1;
    }
    return res;
}`,
        lang: "cpp",
        cap: "迭代版快幂就是分治的「自底向上」写法：把 n 看成二进制，每一位对应一次平方。",
      },
      {
        t: "回溯：在决策树上做深度优先搜索",
        lead: "回溯 = 递归 + 撤销选择。每一层做一个决定，走到叶子收集答案，返回时把决定撤回。",
        code: `// 通用模板
void backtrack(参数) {
    if (满足结束条件) { 收集答案; return; }
    for (每个候选 c : 当前可选集合) {
        if (需要剪枝(c)) continue;
        做出选择;                  // path.push_back(c)
        backtrack(下一层);
        撤销选择;                  // path.pop_back()
    }
}

// 例：子集（每个元素选 / 不选）
void subsets(vector<int>& a, int i, vector<int>& path, vector<vector<int>>& ans) {
    if (i == (int)a.size()) { ans.push_back(path); return; }
    subsets(a, i + 1, path, ans);        // 不选 a[i]
    path.push_back(a[i]);
    subsets(a, i + 1, path, ans);        // 选 a[i]
    path.pop_back();
}`,
        lang: "cpp",
      },
      {
        t: "去重与剪枝",
        lead: "回溯超时基本只有两个原因：重复搜索和无效搜索。",
        pts: [
          "**排序后去重**：`if (i > start && a[i] == a[i-1]) continue;` —— 同一层不选相同值",
          "**used 数组去重**：排列问题里用 `used[i]` 标记已选，避免同一元素重复使用",
          "**可行性剪枝**：当前和已经超过目标，直接 return",
          "**最优性剪枝**：当前代价已经不优于已知最优解，直接 return",
          "**顺序剪枝**：先排序，让大的先试，更快触发剪枝",
        ],
        code: `// 组合总和：候选可重复使用，需要排序 + 同层去重
void dfs(vector<int>& c, int start, int left, vector<int>& path, vector<vector<int>>& ans) {
    if (left == 0) { ans.push_back(path); return; }
    for (int i = start; i < (int)c.size(); ++i) {
        if (c[i] > left) break;                              // 可行性剪枝（已排序）
        if (i > start && c[i] == c[i - 1]) continue;          // 同层去重
        path.push_back(c[i]);
        dfs(c, i, left - c[i], path, ans);                    // i 而不是 i+1：可重复选
        path.pop_back();
    }
}`,
        lang: "cpp",
        pit: "`dfs(c, i, ...)` 与 `dfs(c, i+1, ...)` 的区别就是「元素能不能重复用」。写错了要么漏解要么无限递归。",
      },
    ],
    sum: "递归想清楚出口、缩小、合并；分治要求子问题不重叠；回溯记住「做选择 → 递归 → 撤销」。",
  },

  {
    id: "greedy",
    cat: "进阶",
    title: "贪心算法",
    diff: "中等",
    desc: "局部最优的成立条件 · 区间调度 · 排序后贪心",
    mins: 22,
    goals: [
      "判断一道题能不能贪心（而不是想当然）",
      "掌握区间调度、区间覆盖、区间合并三类套路",
      "用交换论证说明贪心为什么对",
      "识别「看起来能贪心其实要 DP」的陷阱",
    ],
    sections: [
      {
        t: "贪心的成立条件",
        lead: "贪心每一步都选当前看起来最好的，但它成立需要两个前提：无后效性 + 贪心选择性质。",
        body: [
          "**无后效性**：当前的选择不会让后面的可选集合变差（未来的决策只依赖当前状态，不依赖怎么走到这里）。",
          "**贪心选择性质**：存在一个最优解包含当前的最优选择。这一点通常用**交换论证**证明：假设最优解不选它，把它换进去不会变差。",
          "反例警示：0/1 背包按「单位价值」贪心就是错的（可能装不满），必须用 DP；而分数背包按单位价值贪心是对的。",
        ],
        fig: "greedy",
      },
      {
        t: "区间调度：结束越早越赚",
        lead: "选最多的不重叠区间，按右端点升序排，能选就选。",
        code: `// 最多能参加多少个不冲突的会议
int maxMeetings(vector<pair<int,int>>& seg) {
    sort(seg.begin(), seg.end(),
         [](auto& a, auto& b) { return a.second < b.second; });  // 按结束时间排
    int cnt = 0, lastEnd = INT_MIN;
    for (auto& [s, e] : seg) {
        if (s >= lastEnd) { ++cnt; lastEnd = e; }   // 不冲突就参加
    }
    return cnt;
}`,
        lang: "cpp",
        cap: "为什么按结束时间而不是开始时间：结束早的区间给后面留的余地更大，这是一个严格的交换论证。",
        table: [
          ["问题", "排序依据", "扫描方式"],
          ["最多不重叠区间", "右端点升序", "能选就选"],
          ["最少箭引爆气球", "右端点升序", "同上（相交算一组）"],
          ["合并所有重叠区间", "左端点升序", "维护当前区间右端"],
          ["用最少区间覆盖 [0, m]", "左端点升序", "每次取能接上的最远右端"],
        ],
      },
      {
        t: "排序 + 贪心：两个经典题",
        lead: "很多贪心题的解法就一句话：排序，然后从左到右做一个局部的判断。",
        code: `// 1. 分发饼干：胃口小的给最小能满足的饼干
int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());
    int i = 0, j = 0;
    while (i < (int)g.size() && j < (int)s.size()) {
        if (s[j] >= g[i]) { ++i; ++j; }   // 满足一个
        else ++j;                          // 饼干太小，换大的
    }
    return i;
}

// 2. 跳跃游戏：维护「当前能到的最远位置」
bool canJump(vector<int>& a) {
    int far = 0;
    for (int i = 0; i < (int)a.size(); ++i) {
        if (i > far) return false;         // 走不到这里
        far = max(far, i + a[i]);
        if (far >= (int)a.size() - 1) return true;
    }
    return true;
}`,
        lang: "cpp",
        pit: "跳跃游戏 II（求最少步数）不能简单贪「跳得最远」，而是要在当前步数能覆盖的范围内找下一跳的最远距离，本质是 BFS 分层。",
      },
      {
        t: "什么时候不能贪心",
        lead: "只要「当前选择会影响后面能否取得更优解」，就该怀疑贪心。",
        pts: [
          "**0/1 背包**：拿了一个物品会占容量，影响后续 → 必须 DP",
          "**最短路径含负权**：贪心选最近点会失效（Dijkstra 不能处理负边）→ 用 Bellman-Ford / SPFA",
          "**需要全局最优且局部选择互相制约**：如「划分数组使最大和最小」→ 二分答案",
          "**有后效性的状态**：如股票买卖含冷冻期 → DP",
        ],
        body: [
          "实用判断法：先写一个暴力/DP 求小数据的最优解，再写贪心，随机生成 1000 组小数据对拍。对不上就说明贪心错了——这比在考场空想证明有效得多。",
        ],
      },
    ],
    sum: "贪心 = 排序 + 局部最优；能用交换论证说明就放心写，说不清就先对拍。",
  },

  {
    id: "dp",
    cat: "进阶",
    title: "动态规划入门到进阶",
    diff: "中等",
    desc: "状态定义 · 转移方程 · 初始化与遍历顺序 · 空间压缩",
    mins: 32,
    goals: [
      "把一道题拆成「状态 + 转移 + 边界」三部分",
      "识别线性 DP、区间 DP、背包、树形 DP 四种基本形态",
      "写出正确的初始化与遍历顺序",
      "用滚动数组把二维 DP 压成一维",
    ],
    sections: [
      {
        t: "DP 的四步法",
        lead: "DP 不是玄学：定义状态 → 写转移 → 定初值 → 定顺序，四步走完代码就出来了。",
        table: [
          ["步骤", "要回答的问题", "例子（爬楼梯）"],
          ["1 状态", "dp[i] 表示什么？", "dp[i] = 爬到第 i 阶的方法数"],
          ["2 转移", "dp[i] 由谁推出？", "dp[i] = dp[i-1] + dp[i-2]"],
          ["3 初值", "最小规模是多少？", "dp[0] = 1, dp[1] = 1"],
          ["4 顺序", "先算谁后算谁？", "i 从 2 到 n 递增"],
        ],
        body: [
          "状态定义决定了题能不能做出来。好状态的标志是：**它包含了做出下一步决策所需的全部信息**，而且规模可枚举。",
          "如果发现状态不够用（比如还需要知道「上一个选了什么」），就加维度：`dp[i][0/1]` 表示第 i 个位置选或不选。",
        ],
        code: `// 爬楼梯：空间压缩到 O(1)
int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;                 // dp[i-2], dp[i-1]
    for (int i = 3; i <= n; ++i) {
        int c = a + b;
        a = b; b = c;
    }
    return b;
}`,
        lang: "cpp",
        fig: "dp1d",
      },
      {
        t: "0/1 背包：一维数组为什么必须倒序",
        lead: "压成一维后，正序遍历会让「同一件物品被用多次」，那就变成了完全背包。",
        code: `// 0/1 背包：每件物品最多选一次
int knapsack01(vector<int>& w, vector<int>& v, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < (int)w.size(); ++i)
        for (int j = W; j >= w[i]; --j)          // 倒序！
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}

// 完全背包：每件物品可以选无限次 → 正序
for (int i = 0; i < n; ++i)
    for (int j = w[i]; j <= W; ++j)               // 正序！
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);`,
        lang: "cpp",
        fig: "dptable",
        cap: "倒序时 dp[j-w[i]] 还没被本轮更新，用的是「上一行」的值；正序时它已经被更新，等于允许重复选。",
        pit: "「求方案数」和「求最大价值」的转移不一样：方案数是 `dp[j] += dp[j-w[i]]`，最大价值是 `max`。把两者混起来是最常见的错。",
      },
      {
        t: "四种基本形态",
        lead: "绝大多数 DP 题都能归到这四类里，认出类型就直接套框架。",
        table: [
          ["形态", "状态", "典型题", "复杂度"],
          ["线性 DP", "dp[i] 前 i 个", "最长上升子序列、打家劫舍", "O(n) / O(n²)"],
          ["区间 DP", "dp[l][r] 区间", "石子合并、最长回文子序列", "O(n³)"],
          ["背包 DP", "dp[j] 容量", "0/1、完全、多重、分组", "O(nW)"],
          ["树形 DP", "dp[u][0/1] 子树", "没有上司的舞会、树的重心", "O(n)"],
        ],
        code: `// 最长上升子序列 O(n log n)：贪心 + 二分
int lis(vector<int>& a) {
    vector<int> tail;                      // tail[k] = 长度 k+1 的上升子序列的最小结尾
    for (int x : a) {
        auto it = lower_bound(tail.begin(), tail.end(), x);
        if (it == tail.end()) tail.push_back(x);
        else *it = x;                       // 替换成更小的结尾，留更多余地
    }
    return (int)tail.size();
}`,
        lang: "cpp",
        cap: "tail 数组本身不是答案序列，只是「每种长度的最小结尾」，但它足以决定最长能有多长。",
      },
      {
        t: "初始化与遍历顺序的两个坑",
        lead: "DP 错一半是转移写错，另一半是初值和顺序写错。",
        pts: [
          "**求最小值**时初值要设成 INF（如 `0x3f3f3f3f`），设成 0 会导致「什么都不选」也算最优",
          "**求方案数**时初值 dp[0]=1，其余 0",
          "**区间 DP** 必须按区间长度从小到大枚举，否则 `dp[l+1][r-1]` 还没算出来",
          "**二维依赖左上** 的转移（如编辑距离）从左上往右下遍历；依赖左、上、左上都要保证已算",
          "**多重背包**用二进制拆分（1,2,4,8...）把 O(nW·c) 降到 O(nW·log c)",
        ],
        code: `// 区间 DP 标准三层循环
for (int len = 2; len <= n; ++len)             // 先枚举长度
    for (int l = 1; l + len - 1 <= n; ++l) {    // 再枚举起点
        int r = l + len - 1;
        for (int k = l; k < r; ++k)             // 最后枚举分割点
            dp[l][r] = min(dp[l][r], dp[l][k] + dp[k+1][r] + cost(l, r));
    }`,
        lang: "cpp",
        fig: "interval",
        pit: "`memset(dp, 0x3f, sizeof dp)` 得到的是 0x3f3f3f3f（约 10⁹），两个相加不会溢出 int；但三个相加就会。涉及累加时用 long long。",
      },
    ],
    sum: "DP 四步：定状态、写转移、给初值、定顺序；背包看方向，区间看长度。",
  },

  {
    id: "linkedlist",
    cat: "数据结构",
    title: "链表专题",
    diff: "中等",
    desc: "虚拟头节点 · 反转 · 快慢指针 · 合并与分割",
    mins: 24,
    goals: [
      "用虚拟头节点消除「删除首节点」的特判",
      "手写链表反转（迭代 + 递归）并说清指针顺序",
      "用快慢指针找中点、判环、找倒数第 k 个",
      "合并、分割、重排链表时不丢节点",
    ],
    sections: [
      {
        t: "虚拟头节点：一个 dummy 省掉一半特判",
        lead: "只要涉及「可能删除头节点」或「结果需要拼接」，就先造一个假节点指向头。",
        code: `struct ListNode { int val; ListNode* next; };

// 删除所有值为 val 的节点
ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy{0, head};              // 栈上分配，随函数结束自动回收
    ListNode* cur = &dummy;
    while (cur->next) {
        if (cur->next->val == val) cur->next = cur->next->next;  // 跳过它
        else cur = cur->next;
    }
    return dummy.next;
}`,
        lang: "cpp",
        cap: "`cur->next = cur->next->next` 就是删除；注意不要 `cur = cur->next`，因为新接上来的节点还没检查。",
      },
      {
        t: "反转链表：三指针顺序不能错",
        lead: "反转的本质是把每个节点的 next 指向它的前驱，所以必须先保存「原来的 next」。",
        fig: "listrev",
        code: `// 迭代版：prev / cur / next 三指针
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
        ListNode* nxt = cur->next;   // 1. 先存
        cur->next = prev;            // 2. 再改指向
        prev = cur;                  // 3. 整体右移
        cur = nxt;
    }
    return prev;                     // prev 是新头
}`,
        lang: "cpp",
        pit: "把第 1 步和第 2 步顺序写反，`cur->next` 已经被改掉，`nxt` 就丢了，后半条链直接消失（表现为答案被截断）。",
      },
      {
        t: "快慢指针的四种用法",
        lead: "一个走一步一个走两步，能在 O(1) 空间里解决「中点、环、倒数第 k 个」三类问题。",
        code: `// 1. 找中点（偶数个时取后一个）
ListNode* middle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    return slow;
}

// 2. 删除倒数第 n 个：先让 fast 领先 n 步
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy{0, head};
    ListNode *fast = &dummy, *slow = &dummy;
    for (int i = 0; i <= n; ++i) fast = fast->next;
    while (fast) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy.next;
}

// 3. 判环 + 找环入口见「双指针与滑动窗口」专题
// 4. 判断回文链表：找中点 → 反转后半 → 逐个比较 → 再反转回去`,
        lang: "cpp",
        pts: [
          "`while (fast && fast->next)` 是唯一安全的循环条件，少一个就会空指针",
          "删除倒数第 n 个时 fast 先走 n+1 步（配合 dummy），这样 slow 正好停在待删节点的前一个",
          "递归版反转的返回值是「新头」，每次回溯只改两个指针",
        ],
      },
      {
        t: "合并与重排",
        lead: "链表题的通用心法：**先断开，再拼接**。不断开就分不清哪段是哪段。",
        code: `// 合并两个有序链表
ListNode* mergeTwo(ListNode* a, ListNode* b) {
    ListNode dummy{0, nullptr};
    ListNode* t = &dummy;
    while (a && b) {
        if (a->val <= b->val) { t->next = a; a = a->next; }
        else { t->next = b; b = b->next; }
        t = t->next;
    }
    t->next = a ? a : b;                 // 接上剩下的一整段
    return dummy.next;
}

// 重排链表：L0→Ln→L1→Ln-1…  = 找中点 + 反转后半 + 交叉合并
void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    ListNode* mid = middle(head);
    ListNode* second = reverseList(mid->next);
    mid->next = nullptr;                 // 关键：断开，否则会成环
    ListNode* p = head;
    while (second) {
        ListNode* n1 = p->next, *n2 = second->next;
        p->next = second; second->next = n1;
        p = n1; second = n2;
    }
}`,
        lang: "cpp",
        pit: "「先断后拼」漏掉断开这一步，重排后会形成环，判题系统遍历时直接死循环（TLE 而不是 WA）。",
      },
    ],
    sum: "链表三件宝：dummy 省特判、三指针防丢链、快慢指针省空间。",
  },

  {
    id: "stackqueue",
    cat: "数据结构",
    title: "栈与队列专题",
    diff: "简单",
    desc: "括号匹配 · 表达式求值 · 单调栈 · 单调队列 · 双端队列",
    mins: 26,
    goals: [
      "用栈解决括号匹配与嵌套结构解析",
      "写出后缀表达式求值与中缀转后缀",
      "用单调栈求「下一个更大元素」",
      "用单调队列维护滑动窗口最大值",
    ],
    sections: [
      {
        t: "栈：处理「最近的未匹配」",
        lead: "只要题目有「嵌套」「配对」「撤销」的语义，栈几乎总是对的。",
        fig: "stackqueue",
        code: `// 括号匹配
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) return false;
            char t = st.top();
            if ((c == ')' && t != '(') || (c == ']' && t != '[') || (c == '}' && t != '{'))
                return false;
            st.pop();
        }
    }
    return st.empty();                 // 全部配对完才算合法
}`,
        lang: "cpp",
        cap: "最后 `st.empty()` 不能省：`\"(((\"` 这种只有左括号的情况，中途不会返回 false。",
      },
      {
        t: "单调栈：每个元素进出一次",
        lead: "求「左边/右边第一个更大（更小）的元素」，维护一个单调的栈，新元素进来时把破坏单调性的都弹掉。",
        code: `// 下一个更大元素（循环数组版）
vector<int> nextGreater(vector<int>& a) {
    int n = a.size();
    vector<int> res(n, -1);
    stack<int> st;                       // 存下标，栈内对应值单调递减
    for (int i = 0; i < 2 * n; ++i) {
        int x = a[i % n];
        while (!st.empty() && a[st.top()] < x) {
            res[st.top()] = x;            // 找到了它的下一个更大值
            st.pop();
        }
        if (i < n) st.push(i);            // 只把第一轮的下标入栈
    }
    return res;
}`,
        lang: "cpp",
        fig: "mono",
        cap: "循环数组的技巧：把数组「假装」延长一倍，用 `i % n` 取原值，只在第一轮入栈避免重复。",
        table: [
          ["题型", "栈内单调性", "弹出时机"],
          ["下一个更大元素", "递减", "遇到更大的就弹出"],
          ["下一个更小元素", "递增", "遇到更小的就弹出"],
          ["柱状图最大矩形", "递增", "遇到更矮的就算面积"],
          ["接雨水", "递减", "遇到更高的就算水量"],
        ],
      },
      {
        t: "单调队列：滑动窗口最值",
        lead: "窗口滑动时，「又老又小」的元素永远不可能成为答案，可以放心丢掉——这就是单调队列。",
        code: `// 滑动窗口最大值
vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> dq;                        // 存下标，对应值单调递减
    vector<int> res;
    for (int i = 0; i < (int)a.size(); ++i) {
        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();  // 过期
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();  // 又老又小
        dq.push_back(i);
        if (i >= k - 1) res.push_back(a[dq.front()]);
    }
    return res;
}`,
        lang: "cpp",
        pit: "队列里存**下标**而不是值，否则无法判断是否过期（`i - k`）。存值只能求最大值，不能处理窗口滑动。",
      },
    ],
    sum: "配对嵌套用栈，最值窗口用单调队列，下一个更大用单调栈——都是「弹掉不可能成为答案的元素」。",
  },

  {
    id: "tree",
    cat: "数据结构",
    title: "二叉树专题",
    diff: "中等",
    desc: "四种遍历 · 递归与迭代 · BST 性质 · 最近公共祖先",
    mins: 28,
    goals: [
      "手写前中后序的递归与迭代版本",
      "用「遍历顺序 + 返回值」解决子树类问题",
      "利用 BST 的中序有序性做验证与查找",
      "求最近公共祖先并说清后序遍历为什么合适",
    ],
    sections: [
      {
        t: "四种遍历，一句话区分",
        lead: "前中后序的区别只有一个：把「访问根节点」放在递归的哪个位置。",
        fig: "treeorders",
        table: [
          ["遍历", "顺序", "用途"],
          ["前序", "根 → 左 → 右", "复制树、序列化、求深度"],
          ["中序", "左 → 根 → 右", "BST 得到升序序列"],
          ["后序", "左 → 右 → 根", "求子树信息（高度、路径、LCA）"],
          ["层序", "按层从左到右", "求最小深度、右视图、按层输出"],
        ],
        code: `// 递归：三行代码换一下位置就是三种遍历
void dfs(TreeNode* u, vector<int>& out) {
    if (!u) return;
    out.push_back(u->val);   // 前序放这里
    dfs(u->left, out);
    // out.push_back(u->val);  // 中序放这里
    dfs(u->right, out);
    // out.push_back(u->val);  // 后序放这里
}`,
        lang: "cpp",
      },
      {
        t: "迭代写法：用栈模拟递归",
        lead: "递归靠系统栈，迭代就自己维护一个栈。中序迭代是面试最常考的手写题。",
        code: `// 中序迭代：一路向左压栈，弹出时访问，再转向右子树
vector<int> inorder(TreeNode* root) {
    vector<int> out;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }  // 走到最左
        cur = st.top(); st.pop();
        out.push_back(cur->val);                        // 访问
        cur = cur->right;                               // 转向右
    }
    return out;
}

// 层序：队列
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size();                 // 当前层节点数，必须先存下来
        vector<int> row;
        while (sz--) {
            auto* u = q.front(); q.pop();
            row.push_back(u->val);
            if (u->left) q.push(u->left);
            if (u->right) q.push(u->right);
        }
        res.push_back(row);
    }
    return res;
}`,
        lang: "cpp",
        pit: "层序里 `q.size()` 必须在 while 之前存进 `sz`：循环中间会 push 新节点，直接用 `q.size()` 会把下一层也算进来。",
      },
      {
        t: "BST：中序就是升序",
        lead: "二叉搜索树的所有性质都来自一句话：左子树全小、右子树全大。所以中序遍历必然是升序。",
        code: `// 验证 BST：中序遍历必须严格递增
bool isValidBST(TreeNode* root) {
    TreeNode* prev = nullptr;
    function<bool(TreeNode*)> dfs = [&](TreeNode* u) -> bool {
        if (!u) return true;
        if (!dfs(u->left)) return false;
        if (prev && prev->val >= u->val) return false;   // 不严格递增
        prev = u;
        return dfs(u->right);
    };
    return dfs(root);
}

// 第 k 小的元素：中序走到第 k 个就停
// 查找：比当前大就往右，小就往左，O(h)`,
        lang: "cpp",
        cap: "用「中序 + prev 指针」验证 BST，比「递归比较上下界」好写且不容易错。",
      },
      {
        t: "最近公共祖先：后序的典型应用",
        lead: "先问左右子树「你们找到 p 或 q 了吗」，再根据结果决定自己是不是 LCA。",
        code: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* L = lowestCommonAncestor(root->left, p, q);
    TreeNode* R = lowestCommonAncestor(root->right, p, q);
    if (L && R) return root;      // 一左一右，当前就是 LCA
    return L ? L : R;             // 都在同一侧
}`,
        lang: "cpp",
        cap: "为什么用后序：必须知道左右子树的结果才能判断自己，这正是「左右根」的顺序。",
        pts: [
          "BST 的 LCA 更简单：从根开始，两个值都小于当前就往左，都大于就往右，否则当前就是答案",
          "递归函数返回「找到的节点」，天然处理了「p 是 q 的祖先」这种情况",
          "树的高度用后序：`1 + max(左高, 右高)`",
        ],
      },
    ],
    sum: "遍历只差「访问根」的位置；子树类问题用后序；BST 的一切都靠中序有序。",
  },

  {
    id: "heap",
    cat: "数据结构",
    title: "堆与优先队列",
    diff: "中等",
    desc: "上浮下沉 · 建堆 O(n) · Top-K · 对顶堆",
    mins: 22,
    goals: [
      "说清堆的数组表示与父子下标关系",
      "手写 push / pop 并解释为什么是 O(log n)",
      "用堆解决 Top-K、合并 K 个有序链表",
      "用对顶堆维护动态中位数",
    ],
    sections: [
      {
        t: "堆就是一棵「用数组存的完全二叉树」",
        lead: "不需要指针：节点 i 的两个孩子是 2i+1 和 2i+2，父亲是 (i-1)/2。",
        fig: "heaptree",
        table: [
          ["操作", "做法", "复杂度"],
          ["取最值", "返回 a[0]", "O(1)"],
          ["插入", "放末尾后上浮", "O(log n)"],
          ["删除堆顶", "末尾换到顶后下沉", "O(log n)"],
          ["建堆", "从 n/2-1 往前逐个下沉", "O(n)"],
          ["堆排序", "反复取顶 + 下沉", "O(n log n)"],
        ],
        body: [
          "建堆为什么是 O(n) 而不是 O(n log n)：大部分节点在底层，下沉距离很短。精确求和后是 O(n)，这也是 `priority_queue` 初始化比逐个 push 快的原因。",
        ],
        code: `// 手写小根堆（大根堆把比较反过来即可）
struct Heap {
    vector<int> a;
    void up(int i) {                        // 上浮
        while (i > 0 && a[(i - 1) / 2] > a[i]) {
            swap(a[i], a[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }
    void down(int i) {                      // 下沉
        int n = a.size();
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, m = i;
            if (l < n && a[l] < a[m]) m = l;
            if (r < n && a[r] < a[m]) m = r;
            if (m == i) break;
            swap(a[i], a[m]);
            i = m;
        }
    }
    void push(int x) { a.push_back(x); up(a.size() - 1); }
    int top() { return a[0]; }
    void pop() { a[0] = a.back(); a.pop_back(); if (!a.empty()) down(0); }
};`,
        lang: "cpp",
        pit: "`priority_queue<int>` 默认是**大根堆**。要小根堆得写 `priority_queue<int, vector<int>, greater<int>>`，或者存负数取反。",
      },
      {
        t: "Top-K 与多路合并",
        lead: "求「最大的 K 个」用小根堆，求「最小的 K 个」用大根堆——堆里始终只留 K 个。",
        code: `// 前 K 个最大元素：小根堆，堆顶是「目前第 K 大」
int findKthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : a) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();     // 弹出当前最小的
    }
    return pq.top();
}

// 合并 K 个有序链表：堆里放每条链的当前头
struct Cmp { bool operator()(ListNode* x, ListNode* y) { return x->val > y->val; } };
ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*, vector<ListNode*>, Cmp> pq;
    for (auto* p : lists) if (p) pq.push(p);
    ListNode dummy{0, nullptr}, *t = &dummy;
    while (!pq.empty()) {
        auto* u = pq.top(); pq.pop();
        t->next = u; t = t->next;
        if (u->next) pq.push(u->next);
    }
    return dummy.next;
}`,
        lang: "cpp",
        cap: "复杂度 O(n log K)：每个元素进出堆各一次，堆大小始终 ≤ K。比全排序的 O(n log n) 更优。",
      },
      {
        t: "对顶堆：动态中位数",
        lead: "左边一个大根堆存较小的一半，右边一个小根堆存较大的一半，中位数永远在某个堆顶。",
        code: `// 数据流中位数
priority_queue<int> small;                                   // 小的一半（大根堆）
priority_queue<int, vector<int>, greater<int>> big;           // 大的一半（小根堆）

void add(int x) {
    if (small.empty() || x <= small.top()) small.push(x);
    else big.push(x);
    // 平衡：small 最多比 big 多 1 个
    if ((int)small.size() > (int)big.size() + 1) { big.push(small.top()); small.pop(); }
    if ((int)big.size() > (int)small.size()) { small.push(big.top()); big.pop(); }
}
double median() {
    if (small.size() == big.size()) return (small.top() + big.top()) / 2.0;
    return small.top();
}`,
        lang: "cpp",
        pit: "每次插入后都要「平衡」两个堆。漏了平衡，堆顶就不是中位数——这个 bug 只在大数据量下暴露，小样例完全正常。",
      },
    ],
    sum: "堆 = 只关心最值的有序结构；Top-K 用反向堆，多路合并用堆放各路段首，中位数用对顶堆。",
  },
];
