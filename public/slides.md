<!-- .slide: class="cover-slide" -->

<div class="eyebrow">高级数据结构 · 课程项目</div>

# 搜索树<br><span class="accent">性能对比</span>

<p class="subtitle">普通二叉搜索树、AVL 树、伸展树、红黑树与 B+ 树</p>

<div class="badge-row">
  <span>5 类数据结构</span><span>6 种配置</span><span>126 组测量</span>
</div>

Note:
开场：我们的目标不是只背复杂度，而是观察同一批操作如何让不同树产生完全不同的结构和运行时间。
本次展示将依次介绍项目基础、数据结构实现、实验设计、实验结果和总结。

<!-- h -->

<!-- .slide: class="chapter-cover" -->

<div class="chapter-number">01</div>

# 项目基础

统一问题、比较范围与测试接口

<div class="chapter-map">研究问题 · 实验范围 · 统一接口</div>

Note:
第一章介绍研究问题、比较范围和统一树接口，为后续实现与实验建立共同基础。

<!-- v -->

<div class="eyebrow">01 · 项目基础</div>

# 项目要回答的问题

<div class="question-box">
  <div class="question-mark">?</div>
  <div><h3>树的结构会在多大程度上影响性能？</h3><p>让每种实现执行完全相同的插入与删除序列，再比较它们的运行时间。</p></div>
</div>

<div class="cards three">
  <article><b>↕</b><h3>树形</h3><p>树会退化成链，还是能始终控制高度？</p></article>
  <article><b>↻</b><h3>维护</h3><p>更新时需要多少旋转、染色、分裂或合并？</p></article>
  <article><b>⇄</b><h3>负载</h3><p>操作顺序会怎样改变树形和运行时间？</p></article>
</div>

Note:
强调三个影响因素：树高、维护开销和操作顺序。后续实现与结果会分别对应这三个因素。

<!-- v -->

<div class="eyebrow">01 · 项目基础</div>

# 实验规模

<div class="stats">
  <div><b>5</b><span>类搜索树</span></div>
  <div><b>6</b><span>种配置</span></div>
  <div><b>3</b><span>组负载</span></div>
  <div><b>7</b><span>种输入规模</span></div>
  <div><b>126</b><span>条结果</span></div>
</div>

<div class="tree-legend">
  <span class="bst">普通 BST</span><span class="avl">AVL 树</span><span class="splay">伸展树</span>
  <span class="rb">红黑树</span><span class="bp3">3 阶 B+ 树</span><span class="bp100">100 阶 B+ 树</span>
</div>

<div class="callout">N = 1 千、2 千、5 千、1 万、2 万、5 万和 10 万</div>

Note:
B+ 树采用相同算法测试两个阶数，因此五类数据结构对应六种配置。

<!-- v -->

<div class="eyebrow">01 · 项目基础</div>

# 统一的测试接口

<div class="two-column code-layout">

<pre><code class="language-c">typedef struct TreeInterface {
    void *object;
    void (*insert)(void *, int);
    void (*remove)(void *, int);
    int  (*contains)(void *, int);
    void (*destroy)(void *);
    const char *name;
} TreeInterface;</code></pre>

<div class="stack-list">
  <div><b>object</b><span>用 <code>void *</code> 隐藏具体树对象</span></div>
  <div><b>operations</b><span>通过函数指针调用各树的操作</span></div>
  <div><b>name</b><span>统一标记输出，无需特殊分支</span></div>
</div>

</div>

<div class="callout">所有树共享同一段测试循环，变化的只有函数指针。</div>

Note:
benchmark 不访问具体节点，只调用统一函数指针。这是保证测试代码一致的核心。
contains 已实现，但原始实验只计时插入和删除。

<!-- h -->

<!-- .slide: class="chapter-cover" -->

<div class="chapter-number">02</div>

# 数据结构实现

五种控制或利用树形的策略

<div class="chapter-map">普通 BST · AVL · Splay · 红黑树 · B+ 树</div>

Note:
第二章依次介绍五类搜索树的关键实现、结构保证和主要代价。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# 普通二叉搜索树（BST）

<div class="two-column">
  <div>
    <h3 class="accent">几乎没有维护开销</h3>
    <ul>
      <li>只保持普通二叉搜索次序</li>
      <li>插入、查询、删除和销毁均为迭代实现</li>
      <li>节点不记录高度、颜色或父指针</li>
      <li>删除双子节点时使用中序后继</li>
    </ul>
    <div class="complexity"><span>平均情况</span><b>O(log N)</b><span>最坏情况</span><b class="danger">O(N)</b></div>
  </div>
  <div class="diagram-panel">
    <div class="chain"><span>0</span><i></i><span>1</span><i></i><span>2</span><i></i><span>3</span><i></i><span>…</span><i></i><span>N−1</span></div>
    <p>递增插入会形成高度为 N 的右链。</p>
  </div>
</div>

Note:
第 i 次递增插入大约经过 i 个节点，总插入成本成为 O(N²)。删除顺序还会进一步改变代价。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# AVL 树

<div class="two-column">
  <div class="diagram-panel formula-panel">
    <span>BF(x) = h(left) − h(right)</span>
    <b>|BF(x)| ≤ 1</b>
    <div class="tag-row"><i>LL</i><i>LR</i><i>RR</i><i>RL</i></div>
  </div>
  <div>
    <h3 class="accent">严格控制树高</h3>
    <ul>
      <li>每个节点缓存子树高度</li>
      <li>递归返回时更新并检查祖先节点</li>
      <li>通过单旋或双旋恢复平衡</li>
      <li>查询操作不改变树的结构</li>
    </ul>
    <div class="complexity"><span>全部操作</span><b>O(log N)</b><span>代价</span><b>旋转较多</b></div>
  </div>
</div>

Note:
AVL 最严格地限制高度，查找路径短且稳定；代价是更新高度并执行旋转。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# 伸展树（Splay Tree）

<div class="two-column">
  <div>
    <h3 class="accent">适应最近的访问</h3>
    <ul>
      <li>采用自底向上的递归伸展</li>
      <li>通过 zig-zig 与 zig-zag 完成旋转</li>
      <li>插入后将新节点移动到根</li>
      <li>查询成功或失败都会调整树形</li>
    </ul>
    <div class="complexity"><span>摊还复杂度</span><b>O(log N)</b><span>单次操作</span><b class="warning">可能为 O(N)</b></div>
  </div>
  <div class="diagram-panel splay-diagram">
    <div><span>30</span><span>20</span><span>10</span></div><b>→</b><div class="reverse"><span>10</span><span>20</span><span>30</span></div>
    <p>zig-zig 将访问到的键移动到根节点</p>
  </div>
</div>

Note:
本项目使用 bottom-up splay。contains 也会伸展命中节点或最后访问节点，但查询不在当前 benchmark 中。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# 红黑树（Red-Black Tree）

<div class="two-column">
  <div class="diagram-panel rb-diagram">
    <div><span class="black-node">20</span></div>
    <i>╱　　　　　　　╲</i>
    <div><span class="red-node">10</span><span class="red-node">30</span></div>
    <i>╱　╲　　　　　╱　╲</i>
    <div class="nil-row"><span>NIL</span><span>NIL</span><span>NIL</span><span>NIL</span></div>
  </div>
  <div>
    <h3 class="accent">用颜色保持近似平衡</h3>
    <ul>
      <li>父指针支持局部修复</li>
      <li>共享的黑色 <code>nil</code> 哨兵表示叶节点</li>
      <li>插入后修复连续红色冲突</li>
      <li>删除后恢复各路径的黑高</li>
    </ul>
    <div class="complexity"><span>全部操作</span><b>O(log N)</b><span>保证</span><b>高度有界</b></div>
  </div>
</div>

Note:
红黑树不追求 AVL 那样严格的平衡，而是用颜色规则保证最长路径不超过最短路径的两倍。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# B+ 树

<div class="bplus-diagram">
  <div class="bplus-root"><span>20</span><span>50</span><span>80</span></div>
  <div class="fan">╱　　　　│　　　　│　　　　╲</div>
  <div class="bplus-leaves"><span>3 · 8 · 12</span><i>→</i><span>20 · 31</span><i>→</i><span>50 · 67</span><i>→</i><span>80 · 91</span></div>
</div>

<div class="cards three compact">
  <article><h3>内部节点</h3><p>保存分隔键和多个子指针</p></article>
  <article><h3>叶节点</h3><p>全部数据键形成双向链表</p></article>
  <article><h3>更新操作</h3><p>溢出时分裂，不足时借用或合并</p></article>
</div>

Note:
第 i 个分隔键等于第 i+1 个孩子子树中的最小键。内部节点和叶节点都使用二分查找。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# 为什么测试两种 B+ 树阶数？

<div class="order-comparison">
  <article class="order-3"><strong>3</strong><h3>低扇出</h3><p>每个节点最多 3 个孩子</p><ul><li>层数更多</li><li>内存分配更多</li><li>分裂与合并更频繁</li></ul></article>
  <b>对比</b>
  <article class="order-100"><strong>100</strong><h3>高扇出</h3><p>每个节点最多 100 个孩子</p><ul><li>树更浅</li><li>数组连续存储</li><li>节点内部使用二分查找</li></ul></article>
</div>

<div class="callout">两者使用相同实现，只改变 <code>order</code> 参数。</div>

Note:
这组对比说明参数选择也会显著改变常数开销。这是内存测试，不能直接推广为磁盘数据库的最佳阶数。

<!-- v -->

<div class="eyebrow">02 · 数据结构实现</div>

# 理论复杂度预期

| 数据结构 | 查询 | 插入 | 删除 | 结构保证 |
|---|---:|---:|---:|---|
| 普通 BST | 平均 O(log N)，最坏 O(N) | 同左 | 同左 | 无 |
| AVL 树 | O(log N) | O(log N) | O(log N) | 严格限高 |
| 伸展树 | 摊还 O(log N) | 摊还 O(log N) | 摊还 O(log N) | 访问局部性 |
| 红黑树 | O(log N) | O(log N) | O(log N) | 高度有界 |
| m 阶 B+ 树 | O(logₘ N) 次节点访问 | 同左 | 同左 | 节点占用率 |

<div class="callout">理论决定增长趋势；实测还包含内存分配、缓存、分支和再平衡成本。</div>

Note:
同为 O(log N) 不代表时间相同。渐进复杂度描述增长趋势，具体排名还取决于常数。

<!-- h -->

<!-- .slide: class="chapter-cover" -->

<div class="chapter-number">03</div>

# 实验设计

控制输入、统一操作、分别计时

<div class="chapter-map">三种负载 · 测试流程 · 计时方法 · 公平性</div>

Note:
第三章解释 benchmark，重点是输入一致、计时边界和实验范围。

<!-- v -->

<div class="eyebrow">03 · 实验设计</div>

# 三种规定负载

<div class="scenario-grid">
  <article><b>01</b><h3>递增插入 → 同序删除</h3><code>0 1 2 … N−1</code><code class="delete">0 1 2 … N−1</code></article>
  <article><b>02</b><h3>递增插入 → 逆序删除</h3><code>0 1 2 … N−1</code><code class="delete">N−1 … 2 1 0</code></article>
  <article><b>03</b><h3>随机插入 → 随机删除</h3><code>7 1 9 3 …</code><code class="delete">4 9 0 7 …</code></article>
</div>

<div class="callout">每个数组都恰好包含 N 个互不相同的整数 0 … N−1。</div>

Note:
malloc 的原始内容不会被使用。make_keys 先完整写入 0 到 N−1，再按场景反转或打乱。

<!-- v -->

<div class="eyebrow">03 · 实验设计</div>

# 基准测试流程

<div class="pipeline">
  <div><b>1</b><span>分配数组</span></div><i>→</i>
  <div><b>2</b><span>准备序列</span></div><i>→</i>
  <div><b>3</b><span>创建空树</span></div><i>→</i>
  <div class="active"><b>4</b><span>插入计时</span></div><i>→</i>
  <div class="active"><b>5</b><span>删除计时</span></div><i>→</i>
  <div><b>6</b><span>输出并销毁</span></div>
</div>

<div class="cards two compact">
  <article><h3>计时范围内</h3><p>只包含对 <code>insert</code> 或 <code>remove</code> 的调用</p></article>
  <article><h3>计时范围外</h3><p>序列准备、建树对象、结果输出和销毁</p></article>
</div>

Note:
每个 tree/scenario/N 组合都从新树开始。先完成 N 次插入，再在同一棵树上完成 N 次删除。

<!-- v -->

<div class="eyebrow">03 · 实验设计</div>

# 计时与 CSV 输出

<div class="two-column code-layout">

<pre><code class="language-c">insert_start = current_time_ns();
for (i = 0; i &lt; n; ++i)
    tree.insert(tree.object, insert_keys[i]);
insert_end = current_time_ns();

delete_start = current_time_ns();
for (i = 0; i &lt; n; ++i)
    tree.remove(tree.object, delete_keys[i]);
delete_end = current_time_ns();</code></pre>

<div class="stack-list">
  <div><b>CLOCK_MONOTONIC</b><span>不受系统时间调整影响</span></div>
  <div><b>纳秒</b><span>分别记录插入与删除时间</span></div>
  <div><b>C11 + O2</b><span>所有树使用相同编译参数</span></div>
</div>

</div>

<div class="csv-line">tree, scenario, n, insert_ns, delete_ns, total_ns</div>

Note:
CSV 一共 126 条测量。current_time_ns 使用单调时钟，避免系统时间调整影响时间差。

<!-- v -->

<div class="eyebrow">03 · 实验设计</div>

# 公平性控制

<div class="check-grid">
  <article><b>✓</b><div><h3>相同键集合</h3><p>每棵树都接收 0 … N−1。</p></div></article>
  <article><b>✓</b><div><h3>相同操作顺序</h3><p>各实现复用准备好的序列。</p></div></article>
  <article><b>✓</b><div><h3>相同调用接口</h3><p>全部使用同一组间接函数调用。</p></div></article>
  <article><b>✓</b><div><h3>相同初始状态</h3><p>每次测量都从空树开始。</p></div></article>
</div>

<div class="callout warning-box"><b>实验范围：</b>查询已经实现，但课程规定的性能实验只包含插入与删除，因此不纳入本次计时。</div>

Note:
随机种子由 N 和 N+1 决定，所以数据可复现，而且不同树收到相同顺序。
Splay 查询会改变结构，因此若加入查询应作为独立实验。

<!-- h -->

<!-- .slide: class="chapter-cover" -->

<div class="chapter-number">04</div>

# 实验结果

对数坐标同时呈现数量级与常数差异

<div class="chapter-map">同序删除 · 逆序删除 · 随机序列 · 结果解释</div>

Note:
第四章展示实测结果。上下方向依次查看三种场景及分析。

<!-- v -->

<div class="eyebrow">04 · 实验结果</div>

# 如何阅读图表

<div class="cards three plot-guide">
  <article><b>X</b><h3>输入规模 N</h3><p>从 1 千到 10 万，使用对数坐标</p></article>
  <article><b>Y</b><h3>总运行时间</h3><p>插入加删除，单位为毫秒，使用对数坐标</p></article>
  <article><b>↘</b><h3>曲线越低越快</h3><p>斜率体现增长趋势，间距体现常数差异</p></article>
</div>

<div class="callout">对数坐标避免退化 BST 的数秒耗时把其他曲线压缩在一起。</div>

Note:
先解释坐标再读图。看曲线斜率判断增长趋势，再看相近曲线之间的常数差异。

<!-- v -->

<!-- .slide: class="chart-slide" -->

<div class="eyebrow">04 · 实验结果 · 负载一</div>

# 递增插入 → 同序删除

<img class="chart" src="charts/increasing_same.svg" alt="递增插入并同序删除的运行时间折线图">

Note:
普通 BST 从 0.54 ms 增长到 7753.85 ms，呈现明显平方级趋势。其余结构保持在几十毫秒以内。

<!-- v -->

<div class="eyebrow">04 · 实验结果 · 负载一</div>

# 为什么会出现这样的结果？

<div class="result-hero">
  <div><span>普通 BST · N=10 万</span><b>7.754 s</b></div><i>对比</i>
  <div><span>100 阶 B+ 树 · N=10 万</span><b class="accent">5.406 ms</b></div>
  <strong>约 1434 倍</strong>
</div>

<div class="cards three compact">
  <article><h3>普通 BST</h3><p>递增插入构成右链，总插入成本为 O(N²)。</p></article>
  <article><h3>伸展树</h3><p>每次插入的新最大值都位于根附近。</p></article>
  <article><h3>100 阶 B+ 树</h3><p>较低树高和连续数组抵消了更新开销。</p></article>
</div>

Note:
同序删除右链 BST 时总是删除当前根，删除本身便宜，但插入阶段已经付出平方级代价。

<!-- v -->

<!-- .slide: class="chart-slide" -->

<div class="eyebrow">04 · 实验结果 · 负载二</div>

# 递增插入 → 逆序删除

<img class="chart" src="charts/increasing_reverse.svg" alt="递增插入并逆序删除的运行时间折线图">

Note:
这是 BST 最差的一组：递增插入形成右链，反序删除又反复寻找最右端。

<!-- v -->

<div class="eyebrow">04 · 实验结果 · 负载二</div>

# 逆序删除进一步放大链式退化

<div class="result-hero">
  <div><span>普通 BST · N=10 万</span><b>17.294 s</b></div><i>对比</i>
  <div><span>100 阶 B+ 树 · N=10 万</span><b class="accent">3.872 ms</b></div>
  <strong>约 4466 倍</strong>
</div>

<div class="chain-cost">
  <span>查找 N−1</span><i>N 步</i><span>查找 N−2</span><i>N−1 步</i><span>查找 N−3</span><i>N−2 步</i><b>总计约 O(N²)</b>
</div>

<div class="callout">操作顺序让普通 BST 相差数秒，而平衡结构只相差数毫秒。</div>

Note:
AVL 和红黑树靠高度约束稳定。Splay 也适合这个局部访问模式。100 阶配置是本组最快配置。

<!-- v -->

<!-- .slide: class="chart-slide" -->

<div class="eyebrow">04 · 实验结果 · 负载三</div>

# 随机插入 → 随机删除

<img class="chart" src="charts/random_random.svg" alt="随机插入并随机删除的运行时间折线图">

Note:
随机顺序消除了 BST 的结构性灾难，六条曲线明显靠近，这时常数开销成为主要差异。

<!-- v -->

<div class="eyebrow">04 · 实验结果 · 负载三</div>

# 随机顺序改变了排名

<div class="ranking">
  <div class="first"><span>1</span><b>100 阶 B+ 树</b><em>15.11 ms</em></div>
  <div><span>2</span><b>普通 BST</b><em>19.76 ms</em></div>
  <div><span>3</span><b>红黑树</b><em>23.17 ms</em></div>
  <div><span>4</span><b>AVL 树</b><em>28.84 ms</em></div>
  <div><span>5</span><b>伸展树</b><em>31.46 ms</em></div>
  <div><span>6</span><b>3 阶 B+ 树</b><em>64.77 ms</em></div>
</div>

<p class="footnote">N = 100,000 时的总运行时间；数据来自一次完整测试。</p>

Note:
随机 BST 的期望高度接近对数级，且无需旋转，因此本次比 AVL、Splay 和红黑树更快；这不是最坏情况保证。

<!-- v -->

<div class="eyebrow">04 · 实验结果</div>

# N = 100,000 时的结果

<table class="result-table">
  <thead><tr><th>数据结构</th><th>递增 / 同序</th><th>递增 / 逆序</th><th>随机 / 随机</th></tr></thead>
  <tbody>
    <tr><td>普通 BST</td><td class="danger">7753.85 ms</td><td class="danger">17294.24 ms</td><td>19.76 ms</td></tr>
    <tr><td>AVL 树</td><td>9.50 ms</td><td>9.44 ms</td><td>28.84 ms</td></tr>
    <tr><td>伸展树</td><td>6.11 ms</td><td>5.08 ms</td><td>31.46 ms</td></tr>
    <tr><td>红黑树</td><td>8.48 ms</td><td>8.51 ms</td><td>23.17 ms</td></tr>
    <tr><td>3 阶 B+ 树</td><td>43.89 ms</td><td>41.11 ms</td><td>64.77 ms</td></tr>
    <tr class="winner"><td>100 阶 B+ 树</td><td>5.41 ms</td><td>3.87 ms</td><td>15.11 ms</td></tr>
  </tbody>
</table>

<p class="footnote">本次数据中最快，并不代表在所有环境和负载中都最优。</p>

Note:
原 CSV 使用纳秒，这里转换为毫秒便于阅读。强调本表是单次实验快照。

<!-- v -->

<div class="eyebrow">04 · 实验结果</div>

# B+ 树阶数带来的差异

<div class="big-ratio">3 阶 <span>→</span> 100 阶</div>

<div class="ratio-grid">
  <div><b>8.1 倍</b><span>递增插入 / 同序删除</span></div>
  <div><b>10.6 倍</b><span>递增插入 / 逆序删除</span></div>
  <div><b>4.3 倍</b><span>随机插入 / 随机删除</span></div>
</div>

<div class="callout">高扇出减少树高和指针跳转；最佳阶数仍取决于缓存、键大小、节点查找方法和存储介质。</div>

Note:
倍数由 N=10 万 的总时间计算。100 阶配置在整数键、内存运行、节点内二分查找条件下表现很好。

<!-- v -->

<div class="eyebrow">04 · 实验结果</div>

# 理论解释趋势，实现决定差距

<div class="equation-cards">
  <article><span>渐进结构</span><h3>曲线会以多快的速度增长？</h3><p>普通 BST 的链式退化产生了唯一灾难性的 O(N²) 序列。</p></article>
  <b>+</b>
  <article><span>常数因素</span><h3>每次操作把时间花在哪里？</h3><p>旋转、内存分配、缓存局部性、递归和扇出拉开了 O(log N) 树之间的差距。</p></article>
</div>

<div class="takeaway">大 O 复杂度预测扩展趋势，但不能决定每次有限规模测试的冠军。</div>

Note:
不要根据一张表宣布某种树永远最好。结构保证决定增长上限，实现细节决定有限规模下的差距。

<!-- v -->

<div class="eyebrow">04 · 实验结果</div>

# 当前实验的边界

<div class="limits">
  <article><b>01</b><h3>只运行一次</h3><p>暂时没有方差或置信区间。</p></article>
  <article><b>02</b><h3>测试顺序固定</h3><p>系统噪声可能偏向某个位置。</p></article>
  <article><b>03</b><h3>只测试更新</h3><p>查询和范围查询不在本次范围内。</p></article>
  <article><b>04</b><h3>只使用一个平台</h3><p>硬件与内存分配器会影响常数。</p></article>
</div>

<div class="callout warning-box">更严格的后续实验可以重复多轮、随机化树的测试次序、报告中位数并记录运行环境。</div>

Note:
主动说明实验边界。当前实现满足课程要求，但更严格的实证研究需要重复试验和环境记录。

<!-- h -->

<!-- .slide: class="chapter-cover" -->

<div class="chapter-number">05</div>

# 总结

根据结构保证与实际负载选择搜索树

<div class="chapter-map">核心结论 · 项目产物 · 问题讨论</div>

Note:
最后一章总结三个核心结论，并说明如何复现实验和幻灯片。

<!-- v -->

<div class="eyebrow">05 · 总结</div>

# 三点结论

<div class="conclusions">
  <article><b>1</b><div><h3>平衡机制能够抵御不利顺序</h3><p>AVL、红黑树、伸展树和 B+ 树都避免了普通 BST 的数秒级退化。</p></div></article>
  <article><b>2</b><div><h3>访问模式也是算法表现的一部分</h3><p>伸展树会利用局部性；普通 BST 的表现则随操作顺序剧烈变化。</p></div></article>
  <article><b>3</b><div><h3>参数与常数开销同样重要</h3><p>在本次内存测试中，100 阶 B+ 树显著快于 3 阶配置。</p></div></article>
</div>

Note:
一句话总结：结构保证决定上限，工作负载决定实际形状，实现细节决定常数。

<!-- v -->

<div class="eyebrow">05 · 总结</div>

# 项目产物

<div class="cards three project-output">
  <article><b>01</b><h3>数据结构实现</h3><p>五类搜索树及完整的插入、删除、查询与销毁操作。</p></article>
  <article><b>02</b><h3>基准测试数据</h3><p>三种规定负载、七种输入规模和 126 条 CSV 记录。</p></article>
  <article><b>03</b><h3>分析与展示</h3><p>由真实数据生成的图表、实验解释与网页幻灯片。</p></article>
</div>

<div class="pipeline small-pipeline"><div>C 源代码</div><i>→</i><div>CSV 数据</div><i>→</i><div>SVG 图表</div><i>→</i><div class="active">实验结论</div></div>

Note:
项目形成了从数据结构实现、统一测试、原始数据到分析展示的完整链路，也方便组员通过 Git 和 Pull Request 分工协作。

<!-- v -->

<!-- .slide: class="final-slide" -->

<div class="eyebrow">搜索树性能对比</div>

# 谢谢！

<p class="subtitle">欢迎提问与讨论</p>

<div class="final-equation"><span>结构保证</span><b>×</b><span>工作负载</span><b>×</b><span>实现细节</span></div>

Note:
结束。回答问题时可以结合二维章节结构，快速回到对应的实现、实验方法或结果页面。
