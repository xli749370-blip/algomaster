// ============ 做题技巧数据 ============
// TECHNIQUES = [{title, diff, desc, html}]

const TECHNIQUES = [

{ title: "读题四步法：从题目到算法", diff: "通用", desc: "数据范围倒推 · 关键词信号 · 样例验证", html: `
  <h2>读题四步法</h2>
  <ol>
    <li><strong>看数据范围，倒推复杂度</strong>（最重要的一步！）<br>n ≤ 20 → 暴力/DFS；n ≤ 5000 → O(n²)；n ≤ 10^6 → O(n log n)；再大 → O(n) 数学/双指针</li>
    <li><strong>抓关键词信号</strong>：<br>"有序" → 二分/双指针；"最少/最长" → DP/BFS；"第 k 大" → 堆；"所有方案" → 回溯；"连续子数组" → 前缀和/滑窗；"区间修改" → 差分/线段树</li>
    <li><strong>手推样例</strong>：把样例在纸上一步步演算，90% 的理解偏差都会暴露</li>
    <li><strong>先想暴力，再想优化</strong>：先写暴力版验证思路，再优化。DP 的状态往往就是暴力枚举里"重复计算的部分"</li>
  </ol>
  <div class="tip-box">💡 想不出解法时的万能检查单：排序后如何？倒着做如何？二分答案行不行？哈希能省掉哪层循环？状态能不能压缩？</div>
` },

{ title: "调试技巧：快速定位 WA 与 TLE", diff: "通用", desc: "对拍 · 边界检查单 · 卡常手段", html: `
  <h2>调试技巧</h2>
  <h3>WA（答案错误）排查顺序</h3>
  <ol>
    <li>边界：n=0 / n=1？全相同？负数？最大值溢出 int？</li>
    <li>输出格式：多打空格/换行？浮点精度位数？</li>
    <li>多组数据：数组/计数器有没有清空（<code>memset</code>）？</li>
    <li>对拍：写暴力程序 + 数据生成器，随机数据对比正确性（竞赛大杀器）</li>
  </ol>
  <h3>TLE（超时）排查顺序</h3>
  <ol>
    <li>复杂度算错了？数据范围再看一遍</li>
    <li>传参拷贝：C++ vector 是否用了 <code>&amp;</code>？Python 是否没加快速读入？</li>
    <li>常数优化：C++ 关同步 <code>ios::sync_with_stdio(false)</code>；用 <code>emplace_back</code>；减少取模次数</li>
    <li>哈希被卡？换 <code>map</code> 或手写哈希</li>
  </ol>
  <span class="code-lang">C++（对拍脚本思路）</span>
  <pre><code>// gen.cpp 生成随机数据 -> std.cpp 暴力正解 -> my.cpp 待测程序
// Windows: for /l %i in (1,1,1000) do (gen > in &amp; std &lt; in &gt; ans &amp; my &lt; in &gt; out &amp; fc ans out)</code></pre>
` },

{ title: "竞赛时间管理与应试策略", diff: "通用", desc: "性价比排序 · 部分分思维 · 检查清单", html: `
  <h2>竞赛时间管理与应试策略</h2>
  <h3>性价比原则</h3>
  <ul>
    <li>开考先花 5 分钟<strong>通读所有题</strong>，按"预期得分/预计耗时"排序</li>
    <li>签到题（模拟/简单贪心）15 分钟内必须拿下，别恋战</li>
    <li>一道题卡 30 分钟没思路 → 写暴力拿部分分，先做下一题</li>
  </ul>
  <h3>部分分思维（CSP/蓝桥杯保命术）</h3>
  <ul>
    <li>小数据范围暴力往往单独算分——20 分也是分</li>
    <li>输出任意合法解的题：乱写也可能骗到分</li>
    <li>骗分指南：样例硬编码、随机输出、特判 n=1</li>
  </ul>
  <h3>交卷前检查清单</h3>
  <ul>
    <li>long long 用了吗？（乘法溢出）</li>
    <li>数组开够了吗？多组数据清零了吗？</li>
    <li>文件读写/输出格式和题目要求一致吗？</li>
    <li>编译能过吗？（最后 10 分钟编译一次全部代码）</li>
  </ul>
` },

{ title: "递归与回溯设计心法", diff: "进阶", desc: "如何把问题变成搜索 · 状态设计 · 剪枝", html: `
  <h2>递归与回溯设计心法</h2>
  <h3>三问定搜索</h3>
  <ol>
    <li><strong>每一步决策是什么？</strong>（选哪个数 / 走哪个方向）</li>
    <li><strong>状态怎么表示？</strong>（参数：当前下标、已选集合、剩余容量）</li>
    <li><strong>什么时候是答案/剪枝？</strong>（达到条件收集结果，超过限制 return）</li>
  </ol>
  <h3>模板骨架</h3>
  <span class="code-lang">C++</span>
  <pre><code>void dfs(int step, /* 状态 */) {
    if (越界或剪枝条件) return;
    if (step == 终点) { 记录答案; return; }
    for (每个选择 opt) {
        if (opt 不合法) continue;
        做选择;              // 改状态
        dfs(step + 1, 新状态);
        撤销选择;            // 回溯恢复状态
    }
}</code></pre>
  <h3>剪枝四大类</h3>
  <ul>
    <li><strong>可行性剪枝</strong>：当前已不合法，后面不用看</li>
    <li><strong>最优性剪枝</strong>：当前答案已 ≥ 已知最优，放弃</li>
    <li><strong>排序剪枝</strong>：先排序，让不合法分支尽早出现</li>
    <li><strong>记忆化</strong>：状态重复出现就存表（这其实就是 DP 的由来！）</li>
  </ol>
  <div class="tip-box">💡 <strong>DP = 记忆化搜索</strong>。写不出递推式时，先写记忆化搜索版（自顶向下），通常更容易想对，之后想转递推就转，不转也能 AC。</div>
` },

{ title: "DP 状态设计：最难的一步怎么破", diff: "进阶", desc: "状态定义套路 · 无后效性 · 降维优化", html: `
  <h2>DP 状态设计心法</h2>
  <h3>状态定义套路</h3>
  <ul>
    <li>"以 i 结尾 / 前 i 个" —— 一维线性问题</li>
    <li>"以 (i,j) 结尾 / 两个串的前 i、j 个" —— 双序列（LCS 类）</li>
    <li>"容量还剩 j 时" —— 背包类</li>
    <li>"区间 [l, r]" —— 区间 DP</li>
    <li>"走到节点 u 且用过集合 S" —— 树形/状压 DP</li>
  </ul>
  <h3>无后效性检查</h3>
  <p>如果当前状态推不出未来，说明<strong>状态少了维度</strong>。典型例子：股票买卖要加"是否持有"状态；干草垛问题要加"最后选了什么"。</p>
  <span class="code-lang">C++（股票问题：加一维状态）</span>
  <pre><code>// dp[i][0] 不持股 / dp[i][1] 持股
dp[i][0] = max(dp[i-1][0], dp[i-1][1] + p[i]);   // 今天卖出
dp[i][1] = max(dp[i-1][1], dp[i-1][0] - p[i]);   // 今天买入</code></pre>
  <h3>优化方向</h3>
  <ul>
    <li>滚动数组：dp[i] 只依赖 dp[i-1] → 两个变量滚过去，省空间</li>
    <li>单调队列优化：转移是取区间最值 → O(n²) 降 O(n)</li>
    <li>前缀和优化：转移是区间求和 → 同样降维</li>
  </ul>
` },

{ title: "图论建模：把生活问题变成图", diff: "进阶", desc: "节点边怎么定 · 超级源点 · 分层图技巧", html: `
  <h2>图论建模心法</h2>
  <h3>建模三问</h3>
  <ol>
    <li><strong>节点是什么？</strong>（城市、格子、单词、状态、时间步...）</li>
    <li><strong>边是什么？</strong>（相邻、可转移、代价）</li>
    <li><strong>问的是什么对应什么算法？</strong>（连通→并查集/DFS，最短→最短路，顺序→拓扑排序，最大匹配→网络流）</li>
  </ol>
  <h3>高级技巧</h3>
  <ul>
    <li><strong>虚拟超级源点</strong>：多起点问题加一个源点连向所有起点</li>
    <li><strong>分层图</strong>：允许"免费跳过一次"的题，把图复制 k 层，层间连 0 权边</li>
    <li><strong>状态点</strong>：把（位置, 剩余钥匙, 方向）等打包成状态编号 <code>id = x * C1 + y * C2 + s</code></li>
    <li><strong>网格图转图论</strong>：黑白染色后是二分图（可做最大匹配）</li>
  </ul>
  <span class="code-lang">C++（分层图核心）</span>
  <pre><code>// 允许免费走一条边：id = 层 * n + 点
add(u, v + n, 0);          // 第0层的u 免费跳到 第1层的v</code></pre>
` },

{ title: "刷题方法论：怎么刷才有效", diff: "通用", desc: "间隔重复 · 题单推荐 · 错题本", html: `
  <h2>刷题方法论</h2>
  <h3>正确姿势</h3>
  <ol>
    <li><strong>按专题刷，不随机刷</strong>：一周只攻一个专题（如二分），形成条件反射</li>
    <li><strong>25 分钟定则</strong>：Medium 想 25 分钟没思路就看题解，别硬耗（但看完必须关掉题解自己写一遍！）</li>
    <li><strong>间隔重复</strong>：1 天后、3 天后、1 周后重做同一题，做 3 遍胜过刷 10 遍新题</li>
    <li><strong>错题本</strong>：记录"错在哪一类 + 应该想到什么信号"，考前翻</li>
  </ol>
  <h3>推荐题单路线</h3>
  <ul>
    <li>入门：力扣热题 100 → 面试经典 150</li>
    <li>进阶：洛谷【算法 1-1】~【算法 2】试炼场、Codeforces Div2 A/B</li>
    <li>专项：二分、滑窗、DP 背包九讲、图论模板题各 20 道</li>
    <li>竞赛：蓝桥杯真题、CSP-J/S 真题、Codeforces 虚拟赛</li>
  </ol>
  <div class="tip-box">💡 检验是否真会一道题的标准：<strong>3 天后白板重写，不看任何提示</strong>。App 的打卡功能就是帮你执行"间隔重复"——今天就打个卡吧！</div>
` }
];

// ============ 实战题库数据 ============
// PROBLEMS = [{id, title, diff, tags, desc, hint, sol:{cpp, python, java, c}}]

const PROBLEMS = [

{ id: "P1", title: "两数之和", diff: "简单", tags: ["哈希"], desc: "给定整数数组 nums 和目标值 target，找出和为 target 的两个整数下标。每个输入恰有一个解，同一元素不能用两次。", hint: "遍历时把每个数存进哈希表，查找 target-x 是否出现过。",
  sol: {
    cpp: `vector&lt;int&gt; twoSum(vector&lt;int&gt;&amp; nums, int target) {
    unordered_map&lt;int,int&gt; pos;
    for (int i = 0; i &lt; (int)nums.size(); i++) {
        if (pos.count(target - nums[i])) return {pos[target-nums[i]], i};
        pos[nums[i]] = i;
    }
    return {}; }`,
    python: `def twoSum(nums, target):
    pos = {}
    for i, x in enumerate(nums):
        if target - x in pos:
            return [pos[target - x], i]
        pos[x] = i`,
    java: `public int[] twoSum(int[] nums, int target) {
    Map&lt;Integer, Integer&gt; pos = new HashMap&lt;&gt;();
    for (int i = 0; i &lt; nums.length; i++) {
        if (pos.containsKey(target - nums[i]))
            return new int[]{pos.get(target - nums[i]), i};
        pos.put(nums[i], i);
    }
    return new int[]{}; }`,
    c: `// 需手写哈希或 O(n^2) 暴力（数据小可接受）
int* twoSum(int* nums, int n, int target, int* returnSize) {
    for (int i = 0; i &lt; n; i++)
        for (int j = i + 1; j &lt; n; j++)
            if (nums[i] + nums[j] == target) {
                int* r = malloc(2 * sizeof(int));
                r[0] = i; r[1] = j; *returnSize = 2;
                return r;
            }
    *returnSize = 0; return NULL; }`
} },

{ id: "P2", title: "二分查找", diff: "简单", tags: ["二分"], desc: "在有序（升序）数组中查找 target，返回下标，不存在返回 -1。要求 O(log n)。", hint: "l + (r - l) / 2 防溢出；区间开闭要一致。",
  sol: {
    cpp: `int search(vector&lt;int&gt;&amp; a, int t) {
    int l = 0, r = a.size() - 1;
    while (l &lt;= r) {
        int m = l + (r - l) / 2;
        if (a[m] == t) return m;
        else if (a[m] &lt; t) l = m + 1;
        else r = m - 1;
    }
    return -1; }`,
    python: `def search(a, t):
    l, r = 0, len(a) - 1
    while l &lt;= r:
        m = (l + r) // 2
        if a[m] == t: return m
        elif a[m] &lt; t: l = m + 1
        else: r = m - 1
    return -1`,
    java: `public int search(int[] a, int t) {
    int l = 0, r = a.length - 1;
    while (l &lt;= r) {
        int m = l + (r - l) / 2;
        if (a[m] == t) return m;
        else if (a[m] &lt; t) l = m + 1;
        else r = m - 1;
    }
    return -1; }`,
    c: `int search(int* a, int n, int t) {
    int l = 0, r = n - 1;
    while (l &lt;= r) {
        int m = l + (r - l) / 2;
        if (a[m] == t) return m;
        else if (a[m] &lt; t) l = m + 1;
        else r = m - 1;
    }
    return -1; }`
} },

{ id: "P3", title: "最大子数组和", diff: "简单", tags: ["DP"], desc: "找出具有最大和的连续子数组，返回该最大和。如 [-2,1,-3,4,-1,2,1,-5,4] → 6（[4,-1,2,1]）。", hint: "dp[i] = max(nums[i], dp[i-1] + nums[i])，滚动变量即可。",
  sol: {
    cpp: `int maxSubArray(vector&lt;int&gt;&amp; a) {
    int ans = a[0], cur = a[0];
    for (int i = 1; i &lt; (int)a.size(); i++) {
        cur = max(a[i], cur + a[i]);
        ans = max(ans, cur);
    }
    return ans; }`,
    python: `def maxSubArray(a):
    ans = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        ans = max(ans, cur)
    return ans`,
    java: `public int maxSubArray(int[] a) {
    int ans = a[0], cur = a[0];
    for (int i = 1; i &lt; a.length; i++) {
        cur = Math.max(a[i], cur + a[i]);
        ans = Math.max(ans, cur);
    }
    return ans; }`,
    c: `int maxSubArray(int* a, int n) {
    int ans = a[0], cur = a[0];
    for (int i = 1; i &lt; n; i++) {
        cur = a[i] &gt; cur + a[i] ? a[i] : cur + a[i];
        if (cur &gt; ans) ans = cur;
    }
    return ans; }`
} },

{ id: "P4", title: "爬楼梯", diff: "简单", tags: ["DP"], desc: "每次爬 1 或 2 阶，求爬到 n 阶的不同方法数。n=3 → 3 种。", hint: "就是斐波那契：f(n) = f(n-1) + f(n-2)。",
  sol: {
    cpp: `int climbStairs(int n) {
    int a = 1, b = 1;              // f(0), f(1)
    while (--n) { int c = a + b; a = b; b = c; }
    return b; }`,
    python: `def climbStairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b`,
    java: `public int climbStairs(int n) {
    int a = 1, b = 1;
    for (int i = 1; i &lt; n; i++) { int c = a + b; a = b; b = c; }
    return b; }`,
    c: `int climbStairs(int n) {
    long long a = 1, b = 1;
    for (int i = 1; i &lt; n; i++) { long long c = a + b; a = b; b = c; }
    return (int)b; }`
} },

{ id: "P5", title: "合并两个有序链表", diff: "简单", tags: ["链表"], desc: "将两个升序链表合并为一个新升序链表并返回。", hint: "虚拟头节点 + 双指针比较拼接，最后接上剩余部分。",
  sol: {
    cpp: `ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0); ListNode* t = &amp;dummy;
    while (a &amp;&amp; b) {
        if (a-&gt;val &lt;= b-&gt;val) { t-&gt;next = a; a = a-&gt;next; }
        else { t-&gt;next = b; b = b-&gt;next; }
        t = t-&gt;next;
    }
    t-&gt;next = a ? a : b;
    return dummy.next; }`,
    python: `def mergeTwoLists(a, b):
    dummy = tail = ListNode(0)
    while a and b:
        if a.val &lt;= b.val: tail.next, a = a, a.next
        else: tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`,
    java: `public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), t = dummy;
    while (a != null &amp;&amp; b != null) {
        if (a.val &lt;= b.val) { t.next = a; a = a.next; }
        else { t.next = b; b = b.next; }
        t = t.next;
    }
    t.next = (a != null) ? a : b;
    return dummy.next; }`,
    c: `struct Node* merge(struct Node* a, struct Node* b) {
    struct Node dummy = {0, NULL}, *t = &amp;dummy;
    while (a &amp;&amp; b) {
        if (a-&gt;val &lt;= b-&gt;val) { t-&gt;next = a; a = a-&gt;next; }
        else { t-&gt;next = b; b = b-&gt;next; }
        t = t-&gt;next;
    }
    t-&gt;next = a ? a : b;
    return dummy.next; }`
} },

{ id: "P6", title: "有效的括号", diff: "简单", tags: ["栈"], desc: "判断字符串 s 中的括号 ()[]{} 是否全部正确匹配闭合。", hint: "左括号压栈期待的右括号；右括号需匹配栈顶。",
  sol: {
    cpp: `bool isValid(string s) {
    stack&lt;char&gt; st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else if (st.empty() || st.top() != c) return false;
        else st.pop();
    }
    return st.empty(); }`,
    python: `def isValid(s):
    st = []
    m = {'(': ')', '[': ']', '{': '}'}
    for c in s:
        if c in m: st.append(m[c])
        elif not st or st.pop() != c: return False
    return not st`,
    java: `public boolean isValid(String s) {
    Deque&lt;Character&gt; st = new ArrayDeque&lt;&gt;();
    for (char c : s.toCharArray()) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else if (st.isEmpty() || st.pop() != c) return false;
    }
    return st.isEmpty(); }`,
    c: `bool isValid(char* s) {
    char st[10005]; int top = 0;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(') st[top++] = ')';
        else if (c == '[') st[top++] = ']';
        else if (c == '{') st[top++] = '}';
        else if (top == 0 || st[--top] != c) return false;
    }
    return top == 0; }`
} },

{ id: "P7", title: "买卖股票的最佳时机", diff: "简单", tags: ["DP","贪心"], desc: "已知每天股价，只能买卖一次，求最大利润。", hint: "维护历史最低价，每天尝试卖出。",
  sol: {
    cpp: `int maxProfit(vector&lt;int&gt;&amp; p) {
    int ans = 0, mn = INT_MAX;
    for (int x : p) {
        mn = min(mn, x);
        ans = max(ans, x - mn);
    }
    return ans; }`,
    python: `def maxProfit(p):
    ans, mn = 0, float('inf')
    for x in p:
        mn = min(mn, x)
        ans = max(ans, x - mn)
    return ans`,
    java: `public int maxProfit(int[] p) {
    int ans = 0, mn = Integer.MAX_VALUE;
    for (int x : p) {
        mn = Math.min(mn, x);
        ans = Math.max(ans, x - mn);
    }
    return ans; }`,
    c: `int maxProfit(int* p, int n) {
    int ans = 0, mn = INT_MAX;
    for (int i = 0; i &lt; n; i++) {
        if (p[i] &lt; mn) mn = p[i];
        if (p[i] - mn &gt; ans) ans = p[i] - mn;
    }
    return ans; }`
} },

{ id: "P8", title: "无重复字符的最长子串", diff: "中等", tags: ["滑动窗口"], desc: "求不含重复字符的最长子串长度。如 \"abcabcbb\" → 3。", hint: "右指针扩张，出现重复时左指针收缩。",
  sol: {
    cpp: `int lengthOfLongestSubstring(string s) {
    int cnt[128] = {0}, ans = 0;
    for (int l = 0, r = 0; r &lt; (int)s.size(); r++) {
        cnt[(int)s[r]]++;
        while (cnt[(int)s[r]] &gt; 1) cnt[(int)s[l++]]--;
        ans = max(ans, r - l + 1);
    }
    return ans; }`,
    python: `def lengthOfLongestSubstring(s):
    cnt = {}
    ans = l = 0
    for r, c in enumerate(s):
        cnt[c] = cnt.get(c, 0) + 1
        while cnt[c] &gt; 1:
            cnt[s[l]] -= 1; l += 1
        ans = max(ans, r - l + 1)
    return ans`,
    java: `public int lengthOfLongestSubstring(String s) {
    int[] cnt = new int[128];
    int ans = 0, l = 0;
    for (int r = 0; r &lt; s.length(); r++) {
        cnt[s.charAt(r)]++;
        while (cnt[s.charAt(r)] &gt; 1) cnt[s.charAt(l++)]--;
        ans = Math.max(ans, r - l + 1);
    }
    return ans; }`,
    c: `int lengthOfLongestSubstring(char* s) {
    int cnt[128] = {0}, ans = 0, l = 0, n = strlen(s);
    for (int r = 0; r &lt; n; r++) {
        cnt[(int)s[r]]++;
        while (cnt[(int)s[r]] &gt; 1) cnt[(int)s[l++]]--;
        if (r - l + 1 &gt; ans) ans = r - l + 1;
    }
    return ans; }`
} },

{ id: "P9", title: "翻转二叉树", diff: "简单", tags: ["树","递归"], desc: "将二叉树左右子树互换（镜像）。", hint: "递归：交换左右子节点，再分别递归。",
  sol: {
    cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(invertTree(root-&gt;left), invertTree(root-&gt;right));
    return root; }`,
    python: `def invertTree(root):
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
    java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode l = invertTree(root.left);
    root.left = invertTree(root.right);
    root.right = l;
    return root; }`,
    c: `Node* invert(Node* root) {
    if (!root) return NULL;
    Node* l = invert(root-&gt;left);
    root-&gt;left = invert(root-&gt;right);
    root-&gt;right = l;
    return root; }`
} },

{ id: "P10", title: "滑动窗口最大值", diff: "较难", tags: ["单调队列","堆"], desc: "给定数组和窗口大小 k，返回每个窗口位置的最大值。要求 O(n)。", hint: "单调递减队列存下标，队头即窗口最大值。",
  sol: {
    cpp: `vector&lt;int&gt; maxSlidingWindow(vector&lt;int&gt;&amp; a, int k) {
    deque&lt;int&gt; dq; vector&lt;int&gt; res;
    for (int i = 0; i &lt; (int)a.size(); i++) {
        while (!dq.empty() &amp;&amp; a[dq.back()] &lt;= a[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() &lt;= i - k) dq.pop_front();
        if (i &gt;= k - 1) res.push_back(a[dq.front()]);
    }
    return res; }`,
    python: `from collections import deque
def maxSlidingWindow(a, k):
    dq, res = deque(), []
    for i, x in enumerate(a):
        while dq and a[dq[-1]] &lt;= x: dq.pop()
        dq.append(i)
        if dq[0] &lt;= i - k: dq.popleft()
        if i &gt;= k - 1: res.append(a[dq[0]])
    return res`,
    java: `public int[] maxSlidingWindow(int[] a, int k) {
    Deque&lt;Integer&gt; dq = new ArrayDeque&lt;&gt;();
    int n = a.length; int[] res = new int[n - k + 1];
    for (int i = 0; i &lt; n; i++) {
        while (!dq.isEmpty() &amp;&amp; a[dq.peekLast()] &lt;= a[i]) dq.pollLast();
        dq.offerLast(i);
        if (dq.peekFirst() &lt;= i - k) dq.pollFirst();
        if (i &gt;= k - 1) res[i - k + 1] = a[dq.peekFirst()];
    }
    return res; }`,
    c: `// 数组模拟单调队列
int* maxSlidingWindow(int* a, int n, int k, int* rs) {
    int* dq = malloc(n * sizeof(int));  // 存下标
    int* res = malloc((n - k + 1) * sizeof(int));
    int h = 0, t = 0, cnt = 0;
    for (int i = 0; i &lt; n; i++) {
        while (t &gt; h &amp;&amp; a[dq[t-1]] &lt;= a[i]) t--;
        dq[t++] = i;
        if (dq[h] &lt;= i - k) h++;
        if (i &gt;= k - 1) res[cnt++] = a[dq[h]];
    }
    *rs = cnt; return res; }`
} },

{ id: "P11", title: "岛屿数量", diff: "中等", tags: ["DFS","BFS"], desc: "二维网格中 1 是陆地 0 是水，求岛屿数量（上下左右相连算同一岛）。", hint: "每个未访问的 1 触发一次 DFS，把整个岛标记掉。",
  sol: {
    cpp: `int dx[4] = {1,-1,0,0}, dy[4] = {0,0,1,-1};
void dfs(vector&lt;vector&lt;char&gt;&gt;&amp; g, int x, int y) {
    int n = g.size(), m = g[0].size();
    if (x &lt; 0 || x &gt;= n || y &lt; 0 || y &gt;= m || g[x][y] != '1') return;
    g[x][y] = '0';
    for (int d = 0; d &lt; 4; d++) dfs(g, x + dx[d], y + dy[d]);
}
int numIslands(vector&lt;vector&lt;char&gt;&gt;&amp; g) {
    int ans = 0;
    for (int i = 0; i &lt; (int)g.size(); i++)
        for (int j = 0; j &lt; (int)g[0].size(); j++)
            if (g[i][j] == '1') { ans++; dfs(g, i, j); }
    return ans; }`,
    python: `def numIslands(g):
    n, m = len(g), len(g[0])
    def dfs(x, y):
        if x &lt; 0 or x &gt;= n or y &lt; 0 or y &gt;= m or g[x][y] != '1': return
        g[x][y] = '0'
        dfs(x+1, y); dfs(x-1, y); dfs(x, y+1); dfs(x, y-1)
    ans = 0
    for i in range(n):
        for j in range(m):
            if g[i][j] == '1': ans += 1; dfs(i, j)
    return ans`,
    java: `public int numIslands(char[][] g) {
    int ans = 0;
    for (int i = 0; i &lt; g.length; i++)
        for (int j = 0; j &lt; g[0].length; j++)
            if (g[i][j] == '1') { ans++; dfs(g, i, j); }
    return ans;
}
void dfs(char[][] g, int x, int y) {
    if (x &lt; 0 || x &gt;= g.length || y &lt; 0 || y &gt;= g[0].length || g[x][y] != '1') return;
    g[x][y] = '0';
    dfs(g, x+1, y); dfs(g, x-1, y); dfs(g, x, y+1); dfs(g, x, y-1);
}`,
    c: `void dfs(char** g, int n, int m, int x, int y) {
    if (x &lt; 0 || x &gt;= n || y &lt; 0 || y &gt;= m || g[x][y] != '1') return;
    g[x][y] = '0';
    dfs(g, n, m, x+1, y); dfs(g, n, m, x-1, y);
    dfs(g, n, m, x, y+1); dfs(g, n, m, x, y-1);
}
int numIslands(char** g, int n, int m) {
    int ans = 0;
    for (int i = 0; i &lt; n; i++)
        for (int j = 0; j &lt; m; j++)
            if (g[i][j] == '1') { ans++; dfs(g, n, m, i, j); }
    return ans; }`
} },

{ id: "P12", title: "最长回文子串", diff: "中等", tags: ["DP","双指针"], desc: "求字符串 s 中最长的回文子串。如 \"babad\" → \"bab\"。", hint: "中心扩展法：每个位置（含间隙）向两边扩展，O(n²)。",
  sol: {
    cpp: `pair&lt;int,int&gt; expand(const string&amp; s, int l, int r) {
    while (l &gt;= 0 &amp;&amp; r &lt; (int)s.size() &amp;&amp; s[l] == s[r]) { l--; r++; }
    return {l + 1, r - 1};
}
string longestPalindrome(string s) {
    int bl = 0, br = 0;
    for (int i = 0; i &lt; (int)s.size(); i++) {
        auto [l1, r1] = expand(s, i, i);       // 奇数长度
        auto [l2, r2] = expand(s, i, i + 1);   // 偶数长度
        if (r1 - l1 &gt; br - bl) { bl = l1; br = r1; }
        if (r2 - l2 &gt; br - bl) { bl = l2; br = r2; }
    }
    return s.substr(bl, br - bl + 1); }`,
    python: `def longestPalindrome(s):
    def expand(l, r):
        while l &gt;= 0 and r &lt; len(s) and s[l] == s[r]: l -= 1; r += 1
        return l + 1, r
    bl, br = 0, 0
    for i in range(len(s)):
        for l, r in (expand(i, i), expand(i, i + 1)):
            if r - l &gt; br - bl: bl, br = l, r
    return s[bl:br]`,
    java: `public String longestPalindrome(String s) {
    int[] best = {0, 0};
    for (int i = 0; i &lt; s.length(); i++) {
        expand(s, i, i, best);
        expand(s, i, i + 1, best);
    }
    return s.substring(best[0], best[1] + 1);
}
void expand(String s, int l, int r, int[] best) {
    while (l &gt;= 0 &amp;&amp; r &lt; s.length() &amp;&amp; s.charAt(l) == s.charAt(r)) { l--; r++; }
    if (r - l - 1 &gt; best[1] - best[0]) { best[0] = l + 1; best[1] = r - 1; }
}`,
    c: `void expand(char* s, int n, int* bl, int* br, int l, int r) {
    while (l &gt;= 0 &amp;&amp; r &lt; n &amp;&amp; s[l] == s[r]) { l--; r++; }
    if (r - l - 1 &gt; *br - *bl) { *bl = l + 1; *br = r - 1; }
}
char* longestPalindrome(char* s) {
    int n = strlen(s), bl = 0, br = 0;
    for (int i = 0; i &lt; n; i++) {
        expand(s, n, &amp;bl, &amp;br, i, i);
        expand(s, n, &amp;bl, &amp;br, i, i + 1);
    }
    s[br + 1] = '\\0';
    return s + bl; }`
} },

{ id: "P13", title: "零钱兑换", diff: "中等", tags: ["DP","完全背包"], desc: "硬币面额 coins，凑出 amount 的最少硬币数，凑不出返回 -1。每种硬币可用无限次。", hint: "完全背包：dp[i] = min(dp[i], dp[i - c] + 1)，内层正序。",
  sol: {
    cpp: `int coinChange(vector&lt;int&gt;&amp; coins, int amount) {
    vector&lt;int&gt; dp(amount + 1, INT_MAX - 1);   // 防加法溢出
    dp[0] = 0;
    for (int c : coins)
        for (int j = c; j &lt;= amount; j++)
            dp[j] = min(dp[j], dp[j - c] + 1);
    return dp[amount] &gt;= INT_MAX - 1 ? -1 : dp[amount]; }`,
    python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for c in coins:
        for j in range(c, amount + 1):
            dp[j] = min(dp[j], dp[j - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    java: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int c : coins)
        for (int j = c; j &lt;= amount; j++)
            dp[j] = Math.min(dp[j], dp[j - c] + 1);
    return dp[amount] &gt; amount ? -1 : dp[amount]; }`,
    c: `int coinChange(int* coins, int cn, int amount) {
    int INF = INT_MAX - 1;
    int* dp = malloc((amount + 1) * sizeof(int));
    dp[0] = 0;
    for (int j = 1; j &lt;= amount; j++) dp[j] = INF;
    for (int i = 0; i &lt; cn; i++)
        for (int j = coins[i]; j &lt;= amount; j++)
            if (dp[j - coins[i]] + 1 &lt; dp[j]) dp[j] = dp[j - coins[i]] + 1;
    return dp[amount] &gt;= INF ? -1 : dp[amount]; }`
} },

{ id: "P14", title: "最长递增子序列 LIS", diff: "中等", tags: ["DP","二分"], desc: "求严格递增子序列的最长长度。要求 O(n log n) 做法。", hint: "tails[i] = 长度为 i+1 的 LIS 的最小结尾，二分插入。",
  sol: {
    cpp: `int lengthOfLIS(vector&lt;int&gt;&amp; a) {
    vector&lt;int&gt; tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size(); }`,
    python: `import bisect
def lengthOfLIS(a):
    tails = []
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)`,
    java: `public int lengthOfLIS(int[] a) {
    int[] tails = new int[a.length];
    int size = 0;
    for (int x : a) {
        int l = 0, r = size;
        while (l &lt; r) {
            int m = (l + r) / 2;
            if (tails[m] &lt; x) l = m + 1; else r = m;
        }
        tails[l] = x;
        if (l == size) size++;
    }
    return size; }`,
    c: `int lengthOfLIS(int* a, int n) {
    int* tails = malloc(n * sizeof(int));
    int size = 0;
    for (int i = 0; i &lt; n; i++) {
        int l = 0, r = size;
        while (l &lt; r) {
            int m = (l + r) / 2;
            if (tails[m] &lt; a[i]) l = m + 1; else r = m;
        }
        tails[l] = a[i];
        if (l == size) size++;
    }
    return size; }`
} },

{ id: "P15", title: "合并区间", diff: "中等", tags: ["排序","贪心"], desc: "给出一组区间，把所有重叠的区间合并后返回。如 [[1,3],[2,6],[8,10]] → [[1,6],[8,10]]。", hint: "按左端点排序，遍历时若当前区间左端 ≤ 上一个右端则合并。",
  sol: {
    cpp: `vector&lt;vector&lt;int&gt;&gt; merge(vector&lt;vector&lt;int&gt;&gt;&amp; a) {
    sort(a.begin(), a.end());
    vector&lt;vector&lt;int&gt;&gt; res;
    for (auto&amp; p : a) {
        if (!res.empty() &amp;&amp; p[0] &lt;= res.back()[1])
            res.back()[1] = max(res.back()[1], p[1]);
        else res.push_back(p);
    }
    return res; }`,
    python: `def merge(a):
    a.sort()
    res = []
    for l, r in a:
        if res and l &lt;= res[-1][1]:
            res[-1][1] = max(res[-1][1], r)
        else: res.append([l, r])
    return res`,
    java: `public int[][] merge(int[][] a) {
    Arrays.sort(a, (x, y) -&gt; x[0] - y[0]);
    List&lt;int[]&gt; res = new ArrayList&lt;&gt;();
    for (int[] p : a) {
        if (!res.isEmpty() &amp;&amp; p[0] &lt;= res.get(res.size()-1)[1])
            res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], p[1]);
        else res.add(p);
    }
    return res.toArray(new int[0][]); }`,
    c: `// qsort 按左端点排序后贪心合并（略去比较函数）
int cmp(const void* a, const void* b) {
    int x = (*(int**)a)[0], y = (*(int**)b)[0];
    return (x &gt; y) - (x &lt; y); }`
} },

{ id: "P16", title: "课程表（拓扑排序）", diff: "中等", tags: ["图论","拓扑排序"], desc: "n 门课程，prerequisites[i] = [a, b] 表示修 a 前必须修 b。判断能否修完全部课程（即 DAG 判环）。", hint: "Kahn 算法：入度为 0 的先出队，最后检查出队数是否为 n。",
  sol: {
    cpp: `bool canFinish(int n, vector&lt;vector&lt;int&gt;&gt;&amp; pre) {
    vector&lt;vector&lt;int&gt;&gt; g(n);
    vector&lt;int&gt; indeg(n, 0);
    for (auto&amp; p : pre) { g[p[1]].push_back(p[0]); indeg[p[0]]++; }
    queue&lt;int&gt; q;
    for (int i = 0; i &lt; n; i++) if (!indeg[i]) q.push(i);
    int cnt = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); cnt++;
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return cnt == n; }`,
    python: `from collections import deque
def canFinish(n, pre):
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in pre:
        g[b].append(a); indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    cnt = 0
    while q:
        u = q.popleft(); cnt += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return cnt == n`,
    java: `public boolean canFinish(int n, int[][] pre) {
    List&lt;List&lt;Integer&gt;&gt; g = new ArrayList&lt;&gt;();
    for (int i = 0; i &lt; n; i++) g.add(new ArrayList&lt;&gt;());
    int[] indeg = new int[n];
    for (int[] p : pre) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
    Queue&lt;Integer&gt; q = new ArrayDeque&lt;&gt;();
    for (int i = 0; i &lt; n; i++) if (indeg[i] == 0) q.offer(i);
    int cnt = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); cnt++;
        for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return cnt == n; }`,
    c: `// 邻接表 + 数组模拟队列，思路同上（ Kahn 算法）
// 核心三步：建图计入度 -> 入度0入队 -> 出队减邻点入度
// 最后 cnt == n 则无环可修完`
} },

{ id: "P17", title: "LRU 缓存", diff: "较难", tags: ["哈希","设计","链表"], desc: "实现 get/put 均为 O(1) 的 LRU 缓存：容量满时淘汰最久未使用的键。", hint: "哈希表 + 双向链表：哈希定位节点，链表维护使用顺序。",
  sol: {
    cpp: `class LRUCache {
    int cap;
    list&lt;pair&lt;int,int&gt;&gt; lst;                            // 头=最近使用
    unordered_map&lt;int, list&lt;pair&lt;int,int&gt;&gt;::iterator&gt; mp;
public:
    LRUCache(int c) : cap(c) {}
    int get(int key) {
        auto it = mp.find(key);
        if (it == mp.end()) return -1;
        lst.splice(lst.begin(), lst, it-&gt;second);      // 移到头部
        return it-&gt;second-&gt;second;
    }
    void put(int key, int val) {
        auto it = mp.find(key);
        if (it != mp.end()) {
            it-&gt;second-&gt;second = val;
            lst.splice(lst.begin(), lst, it-&gt;second);
            return;
        }
        if ((int)lst.size() == cap) {
            mp.erase(lst.back().first);
            lst.pop_back();
        }
        lst.push_front({key, val});
        mp[key] = lst.begin();
    }
};`,
    python: `class LRUCache:
    def __init__(self, capacity):
        from collections import OrderedDict
        self.od = OrderedDict()
        self.cap = capacity
    def get(self, key):
        if key not in self.od: return -1
        self.od.move_to_end(key)
        return self.od[key]
    def put(self, key, value):
        if key in self.od: self.od.move_to_end(key)
        self.od[key] = value
        if len(self.od) &gt; self.cap:
            self.od.popitem(last=False)   # 淘汰最久未用`,
    java: `class LRUCache extends LinkedHashMap&lt;Integer, Integer&gt; {
    private int cap;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);   // true = 按访问顺序
        this.cap = capacity;
    }
    public int get(int key) { return super.getOrDefault(key, -1); }
    public void put(int key, int value) { super.put(key, value); }
    protected boolean removeEldestEntry(Map.Entry&lt;Integer,Integer&gt; e) {
        return size() &gt; cap;
    }
}`,
    c: `// C 手写：数组存 key/value，另维护 lastUsed 时间戳
// 淘汰时线性扫最小时间戳（O(n)），容量小可接受
// 追求 O(1) 需手写双向链表 + 开放寻址哈希表`
} },

{ id: "P18", title: "编辑距离", diff: "较难", tags: ["DP"], desc: "把 word1 变成 word2 最少需要多少次操作（插入/删除/替换一个字符）。", hint: "dp[i][j]：两串前 i/j 个字符的编辑距离，转移分等/不等讨论。",
  sol: {
    cpp: `int minDistance(string a, string b) {
    int n = a.size(), m = b.size();
    vector&lt;vector&lt;int&gt;&gt; dp(n + 1, vector&lt;int&gt;(m + 1));
    for (int i = 0; i &lt;= n; i++) dp[i][0] = i;
    for (int j = 0; j &lt;= m; j++) dp[0][j] = j;
    for (int i = 1; i &lt;= n; i++)
        for (int j = 1; j &lt;= m; j++)
            dp[i][j] = (a[i-1] == b[j-1])
                ? dp[i-1][j-1]
                : min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;
    return dp[n][m]; }`,
    python: `def minDistance(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1): dp[i][0] = i
    for j in range(m + 1): dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
    return dp[n][m]`,
    java: `public int minDistance(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i &lt;= n; i++) dp[i][0] = i;
    for (int j = 0; j &lt;= m; j++) dp[0][j] = j;
    for (int i = 1; i &lt;= n; i++)
        for (int j = 1; j &lt;= m; j++)
            dp[i][j] = (a.charAt(i-1) == b.charAt(j-1))
                ? dp[i-1][j-1]
                : Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1])) + 1;
    return dp[n][m]; }`,
    c: `int minDistance(char* a, char* b) {
    int n = strlen(a), m = strlen(b);
    int** dp = malloc((n+1) * sizeof(int*));
    for (int i = 0; i &lt;= n; i++) {
        dp[i] = malloc((m+1) * sizeof(int));
        dp[i][0] = i;
    }
    for (int j = 0; j &lt;= m; j++) dp[0][j] = j;
    for (int i = 1; i &lt;= n; i++)
        for (int j = 1; j &lt;= m; j++) {
            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1];
            else {
                int t = dp[i-1][j-1];
                if (dp[i-1][j] &lt; t) t = dp[i-1][j];
                if (dp[i][j-1] &lt; t) t = dp[i][j-1];
                dp[i][j] = t + 1;
            }
        }
    return dp[n][m]; }`
} },

{ id: "P19", title: "Dijkstra 最短路（模板题）", diff: "中等", tags: ["图论","堆","最短路"], desc: "n 个点 m 条带权有向边，求源点 s 到所有点的最短距离。无负权边。", hint: "小根堆 + dist 数组，取出过期记录要跳过。",
  sol: {
    cpp: `vector&lt;long long&gt; dijkstra(int n, int s, vector&lt;vector&lt;pair&lt;int,int&gt;&gt;&gt;&amp; g) {
    vector&lt;long long&gt; dist(n, LLONG_MAX);
    priority_queue&lt;pair&lt;ll,int&gt;, vector&lt;pair&lt;ll,int&gt;&gt;, greater&lt;&gt;&gt; pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d &gt; dist[u]) continue;
        for (auto [v, w] : g[u])
            if (d + w &lt; dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
    }
    return dist; }`,
    python: `import heapq
def dijkstra(n, s, g):     # g[u] = [(v, w), ...]
    dist = [float('inf')] * n
    dist[s] = 0
    pq = [(0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if d &gt; dist[u]: continue
        for v, w in g[u]:
            nd = d + w
            if nd &lt; dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
    java: `long[] dijkstra(int n, int s, List&lt;List&lt;int[]&gt;&gt; g) {
    long[] dist = new long[n];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[s] = 0;
    PriorityQueue&lt;long[]&gt; pq = new PriorityQueue&lt;&gt;((a, b) -&gt; Long.compare(a[0], b[0]));
    pq.offer(new long[]{0, s});
    while (!pq.isEmpty()) {
        long[] t = pq.poll();
        long d = t[0]; int u = (int) t[1];
        if (d &gt; dist[u]) continue;
        for (int[] e : g.get(u))
            if (d + e[1] &lt; dist[e[0]]) {
                dist[e[0]] = d + e[1];
                pq.offer(new long[]{dist[e[0]], e[0]});
            }
    }
    return dist; }`,
    c: `// 无负权时可写 O(n^2) 版：每轮找未确定点中 dist 最小的
int u = -1;
for (int i = 0; i &lt; n; i++)
    if (!done[i] &amp;&amp; (u == -1 || dist[i] &lt; dist[u])) u = i;
done[u] = 1;
for (int v = 0; v &lt; n; v++)
    if (g[u][v] &lt; INF &amp;&amp; dist[u] + g[u][v] &lt; dist[v])
        dist[v] = dist[u] + g[u][v];`
} },

{ id: "P20", title: "快速幂与取模", diff: "简单", tags: ["数学","数论"], desc: "计算 a^b % mod，b 可达 10^18，要求 O(log b)。", hint: "b 的二进制逐位处理，每一位平方 base。",
  sol: {
    cpp: `long long qpow(long long a, long long b, long long mod) {
    long long r = 1; a %= mod;
    for (; b; b &gt;&gt;= 1, a = a * a % mod)
        if (b &amp; 1) r = r * a % mod;
    return r; }`,
    python: `def qpow(a, b, mod):
    r = 1
    a %= mod
    while b:
        if b &amp; 1: r = r * a % mod
        a = a * a % mod
        b &gt;&gt;= 1
    return r
# Python 内置：pow(a, b, mod) 直接就是快速幂！`,
    java: `public long qpow(long a, long b, long mod) {
    long r = 1;
    a %= mod;
    while (b &gt; 0) {
        if ((b &amp; 1) == 1) r = r * a % mod;
        a = a * a % mod;
        b &gt;&gt;= 1;
    }
    return r; }`,
    c: `long long qpow(long long a, long long b, long long mod) {
    long long r = 1;
    a %= mod;
    while (b) {
        if (b &amp; 1) r = r * a % mod;
        a = a * a % mod;
        b &gt;&gt;= 1;
    }
    return r; }`
} },

{ id: "P21", title: "环形链表判环", diff: "简单", tags: ["链表","双指针"], desc: "判断链表中是否存在环。要求 O(1) 空间。", hint: "Floyd 判圈：快慢指针，快 2 慢 1，相遇即有环。",
  sol: {
    cpp: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast &amp;&amp; fast-&gt;next) {
        slow = slow-&gt;next;
        fast = fast-&gt;next-&gt;next;
        if (slow == fast) return true;
    }
    return false; }`,
    python: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast: return True
    return False`,
    java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null &amp;&amp; fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false; }`,
    c: `bool hasCycle(Node* head) {
    Node *slow = head, *fast = head;
    while (fast &amp;&amp; fast-&gt;next) {
        slow = slow-&gt;next;
        fast = fast-&gt;next-&gt;next;
        if (slow == fast) return true;
    }
    return false; }`
} },

{ id: "P22", title: "接雨水", diff: "较难", tags: ["双指针","DP","单调栈"], desc: "给定柱子高度数组，求能接的雨水总量。经典 hard 题。", hint: "每个位置的水量 = min(左侧最高, 右侧最高) - 自身高度。双指针 O(1) 空间。",
  sol: {
    cpp: `int trap(vector&lt;int&gt;&amp; h) {
    int l = 0, r = h.size() - 1;
    int lm = 0, rm = 0, ans = 0;
    while (l &lt; r) {
        if (h[l] &lt; h[r]) {
            if (h[l] &gt;= lm) lm = h[l];
            else ans += lm - h[l];
            l++;
        } else {
            if (h[r] &gt;= rm) rm = h[r];
            else ans += rm - h[r];
            r--;
        }
    }
    return ans; }
// 更易读的版本：先预处理每个位置的左右最大值，再逐位累加 min(lm, rm) - h[i]`,
    python: `def trap(h):
    l, r = 0, len(h) - 1
    lm = rm = ans = 0
    while l &lt; r:
        if h[l] &lt; h[r]:
            lm = max(lm, h[l])
            ans += lm - h[l]
            l += 1
        else:
            rm = max(rm, h[r])
            ans += rm - h[r]
            r -= 1
    return ans`,
    java: `public int trap(int[] h) {
    int l = 0, r = h.length - 1, lm = 0, rm = 0, ans = 0;
    while (l &lt; r) {
        if (h[l] &lt; h[r]) {
            lm = Math.max(lm, h[l]);
            ans += lm - h[l];
            l++;
        } else {
            rm = Math.max(rm, h[r]);
            ans += rm - h[r];
            r--;
        }
    }
    return ans; }`,
    c: `int trap(int* h, int n) {
    int l = 0, r = n - 1, lm = 0, rm = 0, ans = 0;
    while (l &lt; r) {
        if (h[l] &lt; h[r]) {
            if (h[l] &gt; lm) lm = h[l]; else ans += lm - h[l];
            l++;
        } else {
            if (h[r] &gt; rm) rm = h[r]; else ans += rm - h[r];
            r--;
        }
    }
    return ans; }`
} },

{ id: "P23", title: "数组中第 K 个最大元素", diff: "中等", tags: ["堆","快选","排序"], desc: "在无序数组中找第 k 大的元素。要求不排序也能解。", hint: "方案一：大小为 k 的小根堆 O(n log k)；方案二：快速选择（partition）平均 O(n)。",
  sol: {
    cpp: `int findKthLargest(vector&lt;int&gt;&amp; a, int k) {
    priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq;
    for (int x : a) {
        pq.push(x);
        if ((int)pq.size() &gt; k) pq.pop();
    }
    return pq.top(); }
// 快速选择：随机 pivot partition，若位置==n-k 返回，
// 否则递归一侧，平均 O(n)`,
    python: `import heapq
def findKthLargest(a, k):
    return heapq.nlargest(k, a)[-1]
# 或：小根堆维护 k 个
pq = a[:k]
heapq.heapify(pq)
for x in a[k:]:
    if x &gt; pq[0]:
        heapq.heapreplace(pq, x)
return pq[0]`,
    java: `public int findKthLargest(int[] a, int k) {
    PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;&gt;();
    for (int x : a) {
        pq.offer(x);
        if (pq.size() &gt; k) pq.poll();
    }
    return pq.peek(); }`,
    c: `// C 方案：qsort 后取第 n-k 位（O(n log n)）
// 或手写快速选择：partition 后判断 pivot 位置
int qselect(int* a, int l, int r, int k) {
    int pivot = a[l + rand() % (r - l + 1)];
    int i = l, j = r;
    while (i &lt; j) {
        while (i &lt; j &amp;&amp; a[j] &gt; pivot) j--;
        if (i &lt; j) a[i++] = a[j];
        while (i &lt; j &amp;&amp; a[i] &lt; pivot) i++;
        if (i &lt; j) a[j--] = a[i];
    }
    a[i] = pivot;
    if (i == k) return a[i];
    return i &lt; k ? qselect(a, i + 1, r, k) : qselect(a, l, i - 1, k); }`
} },

{ id: "P24", title: "打家劫舍 III（树形DP）", diff: "较难", tags: ["DP","树"], desc: "二叉树节点有权值，不能偷直接相邻的两个节点，求能偷到的最大金额。", hint: "每个节点返回 (偷, 不偷) 两个值，父节点用子节点信息合并。",
  sol: {
    cpp: `pair&lt;int,int&gt; dfs(TreeNode* r) {
    if (!r) return {0, 0};
    auto [la, lb] = dfs(r-&gt;left);
    auto [ra, rb] = dfs(r-&gt;right);
    int rob = r-&gt;val + lb + rb;                 // 偷当前：子节点只能不偷
    int skip = max(la, lb) + max(ra, rb);       // 不偷：子节点随意
    return {rob, skip};
}
int rob(TreeNode* root) {
    auto [a, b] = dfs(root);
    return max(a, b); }`,
    python: `def rob(root):
    def dfs(r):
        if not r: return (0, 0)
        la, lb = dfs(r.left)
        ra, rb = dfs(r.right)
        return (r.val + lb + rb, max(la, lb) + max(ra, rb))
    a, b = dfs(root)
    return max(a, b)`,
    java: `public int rob(TreeNode root) {
    int[] r = dfs(root);
    return Math.max(r[0], r[1]);
}
int[] dfs(TreeNode r) {          // [偷, 不偷]
    if (r == null) return new int[]{0, 0};
    int[] l = dfs(r.left), rr = dfs(r.right);
    return new int[]{ r.val + l[1] + rr[1],
        Math.max(l[0], l[1]) + Math.max(rr[0], rr[1]) }; }`,
    c: `void dfs(Node* r, int* rob, int* skip) {
    if (!r) { *rob = *skip = 0; return; }
    int la, lb, ra, rb;
    dfs(r-&gt;left, &amp;la, &amp;lb);
    dfs(r-&gt;right, &amp;ra, &amp;rb);
    *rob = r-&gt;val + lb + rb;
    *skip = (la &gt; lb ? la : lb) + (ra &gt; rb ? ra : rb);
}
int rob(Node* root) {
    int a, b;
    dfs(root, &amp;a, &amp;b);
    return a &gt; b ? a : b; }`
} }
];
