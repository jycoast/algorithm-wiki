---
comments: true
difficulty: 中等
tags:
  - 贪心
  - 数组
  - 动态规划
entry: maxProfit
testcases:
  - input:
      - - 7
        - 1
        - 5
        - 3
        - 6
        - 4
    output: 7
  - input:
      - - 1
        - 2
        - 3
        - 4
        - 5
    output: 4
  - input:
      - - 7
        - 6
        - 4
        - 3
        - 1
    output: 0
---


<script setup>
// 方法一（贪心）可视化：prices = [7, 1, 5, 3, 6, 4]，ans += max(0, prices[i] - prices[i-1])，答案 7
const greedySteps = [
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'i', index: 1 }], highlight: [0, 1], note: 'i=1：prices[1]-prices[0]=1-7=-6 < 0，不上涨，不加利润。ans=0。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'i', index: 2 }], highlight: [1, 2], note: 'i=2：prices[2]-prices[1]=5-1=4 > 0，上涨获利，ans=0+4=4。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'i', index: 3 }], highlight: [2, 3], note: 'i=3：prices[3]-prices[2]=3-5=-2 < 0，不上涨，不加利润。ans=4。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'i', index: 4 }], highlight: [3, 4], note: 'i=4：prices[4]-prices[3]=6-3=3 > 0，上涨获利，ans=4+3=7。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'i', index: 5 }], highlight: [4, 5], note: 'i=5：prices[5]-prices[4]=4-6=-2 < 0，不上涨，不加利润。ans=7。' },
  { array: [7, 1, 5, 3, 6, 4], highlight: [1, 2, 3, 4], note: '结论：ans=7 ✅。两段上涨 1→5（+4）与 3→6（+3），总利润 4+3=7。' },
]
// 方法二（二维动态规划）可视化：f[i][0]=持股利润（买入为负成本），f[i][1]=空仓利润，答案 f[5][1]=7
const dp2Steps = [
  {
    grid: {
      values: [
        [0, null, null, null, null, null],
        [-7, null, null, null, null, null],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 1, c: 0, state: 'cur' }],
    note: 'i=0：初始化。f[0][1]=0（第 0 天空仓，最大利润 0）；f[0][0]=-prices[0]=-7（第 0 天持股，花费 7 买入，利润 -7）。',
  },
  {
    grid: {
      values: [
        [0, 0, null, null, null, null],
        [-7, -1, null, null, null, null],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 1, state: 'cur' }],
    note: 'i=1：f[1][0]=max(f[0][0], f[0][1]-prices[1])=max(-7, 0-1)=-1（持股）；f[1][1]=max(f[0][1], f[0][0]+prices[1])=max(0, -7+1)=0（空仓）。',
  },
  {
    grid: {
      values: [
        [0, 0, 4, null, null, null],
        [-7, -1, -1, null, null, null],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'cur' }, { r: 1, c: 2, state: 'cur' }],
    note: 'i=2：f[2][0]=max(f[1][0], f[1][1]-prices[2])=max(-1, 0-5)=-1（持股）；f[2][1]=max(f[1][1], f[1][0]+prices[2])=max(0, -1+5)=4（空仓）。',
  },
  {
    grid: {
      values: [
        [0, 0, 4, 4, null, null],
        [-7, -1, -1, 1, null, null],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'cur' }, { r: 1, c: 3, state: 'cur' }],
    note: 'i=3：f[3][0]=max(f[2][0], f[2][1]-prices[3])=max(-1, 4-3)=1（持股）；f[3][1]=max(f[2][1], f[2][0]+prices[3])=max(4, -1+3)=4（空仓）。',
  },
  {
    grid: {
      values: [
        [0, 0, 4, 4, 7, null],
        [-7, -1, -1, 1, 1, null],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 0, c: 4, state: 'cur' }, { r: 1, c: 4, state: 'cur' }],
    note: 'i=4：f[4][0]=max(f[3][0], f[3][1]-prices[4])=max(1, 4-6)=1（持股）；f[4][1]=max(f[3][1], f[3][0]+prices[4])=max(4, 1+6)=7（空仓）。',
  },
  {
    grid: {
      values: [
        [0, 0, 4, 4, 7, 7],
        [-7, -1, -1, 1, 1, 3],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 0, c: 5, state: 'cur' }, { r: 1, c: 5, state: 'cur' }],
    note: 'i=5：f[5][0]=max(f[4][0], f[4][1]-prices[5])=max(1, 7-4)=3（持股）；f[5][1]=max(f[4][1], f[4][0]+prices[5])=max(7, 1+4)=7（空仓）。',
  },
  {
    grid: {
      values: [
        [0, 0, 4, 4, 7, 7],
        [-7, -1, -1, 1, 1, 3],
      ],
      rowLabels: ['f[i][1] 空仓', 'f[i][0] 持股'],
      colLabels: ['0', '1', '2', '3', '4', '5'],
    },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 0, c: 5, state: 'mark' }, { r: 1, c: 5, state: 'done' }],
    note: '结论：f[5][1]=7 ✅（第 5 天空仓的最大利润），即最大总利润为 7。',
  },
]
// 方法三（空间优化滚动变量）可视化：f/g 两个长度 2 的数组滚动，g 计算第 i 天新状态后赋给 f，返回 f[1]=7
const rollSteps = [
  { dp: [0, null, null, null, null, null], dpStates: [{ i: 0, state: 'cur' }], pointers: [{ i: 0, label: 'i' }], aux: [{ title: 'g', values: [-7, null, null, null, null, null], states: [{ i: 0, state: 'cur' }] }, { title: 'prices', values: [7, 1, 5, 3, 6, 4] }], note: 'i=0：初始化 f=[-prices[0], 0]=[-7, 0]。主行 f 显示空仓利润 f[1]=0，辅助行 g 显示持股利润 g[0]=-7。' },
  { dp: [0, 0, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }], pointers: [{ i: 1, label: 'i' }], aux: [{ title: 'g', values: [-7, -1, null, null, null, null], states: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }] }, { title: 'prices', values: [7, 1, 5, 3, 6, 4] }], note: 'i=1：g[0]=max(f[0], f[1]-prices[1])=max(-7, 0-1)=-1（持股）；g[1]=max(f[1], f[0]+prices[1])=max(0, -7+1)=0（空仓）。f=g → f=[-1, 0]。' },
  { dp: [0, 0, 4, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }], pointers: [{ i: 2, label: 'i' }], aux: [{ title: 'g', values: [-7, -1, -1, null, null, null], states: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }] }, { title: 'prices', values: [7, 1, 5, 3, 6, 4] }], note: 'i=2：g[0]=max(-1, 0-5)=-1；g[1]=max(0, -1+5)=4。f=g → f=[-1, 4]。' },
  { dp: [0, 0, 4, 4, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'cur' }], pointers: [{ i: 3, label: 'i' }], aux: [{ title: 'g', values: [-7, -1, -1, 1, null, null], states: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'cur' }] }, { title: 'prices', values: [7, 1, 5, 3, 6, 4] }], note: 'i=3：g[0]=max(-1, 4-3)=1；g[1]=max(4, -1+3)=4。f=g → f=[1, 4]。' },
  { dp: [0, 0, 4, 4, 7, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'cur' }], pointers: [{ i: 4, label: 'i' }], aux: [{ title: 'g', values: [-7, -1, -1, 1, 1, null], states: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'cur' }] }, { title: 'prices', values: [7, 1, 5, 3, 6, 4] }], note: 'i=4：g[0]=max(1, 4-6)=1；g[1]=max(4, 1+6)=7。f=g → f=[1, 7]。' },
  { dp: [0, 0, 4, 4, 7, 7], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'mark' }], pointers: [{ i: 5, label: 'i' }], aux: [{ title: 'g', values: [-7, -1, -1, 1, 1, 3], states: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }] }, { title: 'prices', values: [7, 1, 5, 3, 6, 4] }], note: 'i=5：g[0]=max(1, 7-4)=3；g[1]=max(7, 1+4)=7。f=g → f=[3, 7]。遍历结束，返回 f[1]=7 ✅。' },
]
</script>

<!-- problem:start -->

# [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>prices</code> ，其中&nbsp;<code>prices[i]</code> 表示某支股票第 <code>i</code> 天的价格。</p>

<p>在每一天，你可以决定是否购买和/或出售股票。你在任何时候&nbsp;<strong>最多</strong>&nbsp;只能持有 <strong>一股</strong> 股票。你也可以先购买，然后在 <strong>同一天</strong> 出售。</p>

<p>返回 <em>你能获得的 <strong>最大</strong> 利润</em>&nbsp;。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>prices = [7,1,5,3,6,4]
<strong>输出：</strong>7
<strong>解释：</strong>在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4。
随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6 - 3 = 3。
最大总利润为 4 + 3 = 7 。</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>prices = [1,2,3,4,5]
<strong>输出：</strong>4
<strong>解释：</strong>在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4。
最大总利润为 4 。</pre>

<p><strong>示例&nbsp;3：</strong></p>

<pre>
<strong>输入：</strong>prices = [7,6,4,3,1]
<strong>输出：</strong>0
<strong>解释：</strong>在这种情况下, 交易无法获得正利润，所以不参与交易可以获得最大利润，最大利润为 0。</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= prices.length &lt;= 3 * 10<sup>4</sup></code></li>
	<li><code>0 &lt;= prices[i] &lt;= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：贪心

从第二天开始，如果当天股价大于前一天股价，则在前一天买入，当天卖出，即可获得利润。如果当天股价小于前一天股价，则不买入，不卖出。也即是说，所有上涨交易日都做买卖，所有下跌交易日都不做买卖，最终获得的利润是最大的。

时间复杂度 $O(n)$，其中 $n$ 为数组 `prices` 的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `prices = [7, 1, 5, 3, 6, 4]` 为例，演示贪心策略：`ans += max(0, prices[i] - prices[i-1])`，只在上涨日卖出获利，把相邻正差值累加。黄色为高亮：前几步是当前比较的两个价格，最后一步是两段上升段。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="greedySteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxProfit(int[] prices) {
        int ans = 0;
        for (int i = 1; i < prices.length; ++i) {
            ans += Math.max(0, prices[i] - prices[i - 1]);
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int ans = 0;
        for (int i = 1; i < prices.size(); ++i) ans += max(0, prices[i] - prices[i - 1]);
        return ans;
    }
};
```



```ts [TypeScript]
function maxProfit(prices: number[]): number {
    let ans = 0;
    for (let i = 1; i < prices.length; i++) {
        ans += Math.max(0, prices[i] - prices[i - 1]);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        return sum(max(0, b - a) for a, b in pairwise(prices))
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：动态规划

我们设 $f[i][j]$ 表示第 $i$ 天交易完后的最大利润，其中 $j$ 表示当前是否持有股票，持有股票时 $j=0$，不持有股票时 $j=1$。初始状态为 $f[0][0]=-prices[0]$，其余状态均为 $0$。

如果当前持有股票，那么可能是前一天就持有股票，今天什么都不做，即 $f[i][0]=f[i-1][0]$；也可能是前一天不持有股票，今天买入股票，即 $f[i][0]=f[i-1][1]-prices[i]$。

如果当前不持有股票，那么可能是前一天就不持有股票，今天什么都不做，即 $f[i][1]=f[i-1][1]$；也可能是前一天持有股票，今天卖出股票，即 $f[i][1]=f[i-1][0]+prices[i]$。

因此，我们可以写出状态转移方程：

$$
\begin{cases}
f[i][0]=\max(f[i-1][0],f[i-1][1]-prices[i])\\
f[i][1]=\max(f[i-1][1],f[i-1][0]+prices[i])
\end{cases}
$$

最终的答案即为 $f[n-1][1]$，其中 $n$ 为数组 `prices` 的长度。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 `prices` 的长度。

### 可视化演示

> 以 `prices = [7, 1, 5, 3, 6, 4]` 为例，演示二维动态规划：`f[i][0]` 为第 i 天结束仍持股的最大利润（买入记负成本），`f[i][1]` 为第 i 天结束空仓的最大利润。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="dp2Steps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int[][] f = new int[n][2];
        f[0][0] = -prices[0];
        for (int i = 1; i < n; ++i) {
            f[i][0] = Math.max(f[i - 1][0], f[i - 1][1] - prices[i]);
            f[i][1] = Math.max(f[i - 1][1], f[i - 1][0] + prices[i]);
        }
        return f[n - 1][1];
    }
}
```



```cpp [C++]
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size();
        int f[n][2];
        f[0][0] = -prices[0];
        f[0][1] = 0;
        for (int i = 1; i < n; ++i) {
            f[i][0] = max(f[i - 1][0], f[i - 1][1] - prices[i]);
            f[i][1] = max(f[i - 1][1], f[i - 1][0] + prices[i]);
        }
        return f[n - 1][1];
    }
};
```

```python [Python]
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        n = len(prices)
        f = [[0] * 2 for _ in range(n)]
        f[0][0] = -prices[0]
        for i in range(1, n):
            f[i][0] = max(f[i - 1][0], f[i - 1][1] - prices[i])
            f[i][1] = max(f[i - 1][1], f[i - 1][0] + prices[i])
        return f[n - 1][1]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三：动态规划（空间优化）

我们可以发现，在方法二中，第 $i$ 天的状态，只与第 $i-1$ 天的状态有关，因此我们可以只用两个变量来维护第 $i-1$ 天的状态，从而将空间复杂度优化到 $O(1)$。

时间复杂度 $O(n)$，其中 $n$ 为数组 `prices` 的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `prices = [7, 1, 5, 3, 6, 4]` 为例，演示空间优化：用 `f`、`g` 两个长度 2 的数组滚动维护状态，`g` 存第 i 天的新状态，计算后赋给 `f`。主行 `f` 显示空仓利润（答案），辅助行 `g` 显示持股利润。点击 ▶ 播放，或逐步操作。

<DpViz :steps="rollSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int[] f = new int[] {-prices[0], 0};
        for (int i = 1; i < n; ++i) {
            int[] g = new int[2];
            g[0] = Math.max(f[0], f[1] - prices[i]);
            g[1] = Math.max(f[1], f[0] + prices[i]);
            f = g;
        }
        return f[1];
    }
}
```


```cpp [C++]
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int n = prices.size();
        int f[2] = {-prices[0], 0};
        for (int i = 1; i < n; ++i) {
            int g[2];
            g[0] = max(f[0], f[1] - prices[i]);
            g[1] = max(f[1], f[0] + prices[i]);
            f[0] = g[0], f[1] = g[1];
        }
        return f[1];
    }
};
```

```python [Python]
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        n = len(prices)
        f = [-prices[0], 0]
        for i in range(1, n):
            g = [0] * 2
            g[0] = max(f[0], f[1] - prices[i])
            g[1] = max(f[1], f[0] + prices[i])
            f = g
        return f[1]
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->