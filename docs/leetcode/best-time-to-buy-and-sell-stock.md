---
comments: true
difficulty: 简单

tags:
    - 数组
    - 动态规划
---

<script setup>
// 方法一（动态规划）可视化：prices = [7, 1, 5, 3, 6, 4]，答案 5
// dp[i][0] 表示第 i 天结束时持股的最大利润，dp[i][1] 表示空仓（不持股）的最大利润（与本文件代码一致）
// 递推：dp[i][0]=max(dp[i-1][0], -prices[i])，dp[i][1]=max(dp[i-1][1], dp[i-1][0]+prices[i])
const stockSteps = [
  { grid: { values: [[-7, null, null, null, null, null], [0, null, null, null, null, null]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 1, c: 0, state: 'cur' }], note: 'i=0 初始化：dp[0][0] = -prices[0] = -7（持股，第 1 天以 7 元买入），dp[0][1] = 0（空仓，最大利润 0）。' },
  { grid: { values: [[-7, -1, null, null, null, null], [0, 0, null, null, null, null]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'i=1：dp[1][0] = max(dp[0][0], -prices[1]) = max(-7, -1) = -1（第 2 天以 1 元买入更优）；dp[1][1] = max(dp[0][1], dp[0][0] + prices[1]) = max(0, -7 + 1) = 0（空仓利润仍为 0）。' },
  { grid: { values: [[-7, -1, -1, null, null, null], [0, 0, 4, null, null, null]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'cur' }, { r: 1, c: 2, state: 'cur' }], note: 'i=2：dp[2][0] = max(dp[1][0], -prices[2]) = max(-1, -5) = -1（继续持股）；dp[2][1] = max(dp[1][1], dp[1][0] + prices[2]) = max(0, -1 + 5) = 4（第 2 天 1 元买入、第 3 天 5 元卖出，利润 4）。' },
  { grid: { values: [[-7, -1, -1, -1, null, null], [0, 0, 4, 4, null, null]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'cur' }, { r: 1, c: 3, state: 'cur' }], note: 'i=3：dp[3][0] = max(dp[2][0], -prices[3]) = max(-1, -3) = -1（继续持股）；dp[3][1] = max(dp[2][1], dp[2][0] + prices[3]) = max(4, -1 + 3) = 4（利润不变，仍为 4）。' },
  { grid: { values: [[-7, -1, -1, -1, -1, null], [0, 0, 4, 4, 5, null]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 0, c: 4, state: 'cur' }, { r: 1, c: 4, state: 'cur' }], note: 'i=4：dp[4][0] = max(dp[3][0], -prices[4]) = max(-1, -6) = -1（继续持股）；dp[4][1] = max(dp[3][1], dp[3][0] + prices[4]) = max(4, -1 + 6) = 5（第 2 天 1 元买入、第 5 天 6 元卖出，利润 5）。' },
  { grid: { values: [[-7, -1, -1, -1, -1, -1], [0, 0, 4, 4, 5, 5]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 0, c: 5, state: 'cur' }, { r: 1, c: 5, state: 'cur' }], note: 'i=5：dp[5][0] = max(dp[4][0], -prices[5]) = max(-1, -4) = -1（继续持股）；dp[5][1] = max(dp[4][1], dp[4][0] + prices[5]) = max(5, -1 + 4) = 5（利润不变，仍为 5）。' },
  { grid: { values: [[-7, -1, -1, -1, -1, -1], [0, 0, 4, 4, 5, 5]], rowLabels: ['dp[i][0] 持股', 'dp[i][1] 空仓'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'mark' }], note: '遍历结束，答案 dp[5][1] = 5 ✅：第 2 天以 1 元买入、第 5 天以 6 元卖出，最大利润 = 6 - 1 = 5。' },
]
// 方法二（扫描法）可视化：mi 维护最低买入价，ans 维护最大利润
const scanSteps = [
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'mi', index: 0 }, { label: 'i', index: 0 }], highlight: [0], note: 'i=0，v=7：ans = max(ans, v - mi) = max(0, 7 - 7) = 0；mi = min(mi, v) = 7。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'mi', index: 1 }, { label: 'i', index: 1 }], highlight: [1], note: 'i=1，v=1：ans = max(0, 1 - 7) = 0；mi 更新为 min(7, 1) = 1（更低价）。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'mi', index: 1 }, { label: 'i', index: 2 }], highlight: [2], note: 'i=2，v=5：ans = max(ans, v - mi) = max(0, 5 - 1) = 4。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'mi', index: 1 }, { label: 'i', index: 3 }], highlight: [3], note: 'i=3，v=3：ans = max(4, 3 - 1) = 4，利润不变。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'mi', index: 1 }, { label: 'i', index: 4 }], highlight: [4], note: 'i=4，v=6：ans = max(ans, v - mi) = max(4, 6 - 1) = 5。' },
  { array: [7, 1, 5, 3, 6, 4], pointers: [{ label: 'mi', index: 1 }, { label: 'i', index: 5 }], highlight: [5], note: 'i=5，v=4：ans = max(5, 4 - 1) = 5，利润不变。遍历结束，答案 ans = 5 ✅（第 2 天 1 元买入、第 5 天 6 元卖出）。' },
]
</script>

<!-- problem:start -->

# [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock)

## 题目描述

<!-- description:start -->

<p>给定一个数组 <code>prices</code> ，它的第 <code>i</code> 个元素 <code>prices[i]</code> 表示一支给定股票第 <code>i</code> 天的价格。</p>

<p>你只能选择 <strong>某一天</strong> 买入这只股票，并选择在 <strong>未来的某一个不同的日子</strong> 卖出该股票。设计一个算法来计算你所能获取的最大利润。</p>

<p>返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 <code>0</code> 。</p>

<p> </p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>[7,1,5,3,6,4]
<strong>输出：</strong>5
<strong>解释：</strong>在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>prices = [7,6,4,3,1]
<strong>输出：</strong>0
<strong>解释：</strong>在这种情况下, 没有交易完成, 所以最大利润为 0。
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 <= prices.length <= 10<sup>5</sup></code></li>
	<li><code>0 <= prices[i] <= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：动态规划

### 可视化演示

> 以 `prices = [7, 1, 5, 3, 6, 4]` 为例，演示动态规划填表：`dp[i][0]` 表示持股最大利润，`dp[i][1]` 表示空仓最大利润。蓝色为当前计算格子，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="stockSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

```java [Java]
class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        int[][] dp = new int[n][2];
        // 第i天持有
        dp[0][0] = -prices[0];
        // 第i天不持有
        dp[0][1] = 0;

        for (int i = 1; i < n; i++) {
            dp[i][0] = Math.max(dp[i - 1][0], -prices[i]);
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
        }

        return dp[n - 1][1];
    }
}
```



## 方法二：枚举 + 维护前缀最小值

我们可以枚举数组 $nums$ 每个元素作为卖出价格，那么我们需要在前面找到一个最小值作为买入价格，这样才能使得利润最大化。

因此，我们用一个变量 $mi$ 维护数组 $nums$ 的前缀最小值。接下来遍历数组 $nums$，对于每个元素 $v$，计算其与前面元素的最小值 $mi$ 的差值，更新答案为差值的最大值。然后更新 $mi = min(mi, v)$。继续遍历数组 $nums$，直到遍历结束。

最后返回答案即可。

时间复杂度 $O(n)$，其中 $n$ 是数组 $nums$ 的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `prices = [7, 1, 5, 3, 6, 4]` 为例，演示扫描法：`mi` 维护到当前为止的最低买入价，`ans` 维护最大利润。遍历每个价格 `v`，先算 `ans = max(ans, v - mi)`，再更新 `mi = min(mi, v)`。黄色为当前访问元素，蓝色边框为指针位置。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="scanSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxProfit(int[] prices) {
        int ans = 0, mi = prices[0];
        for (int v : prices) {
            ans = Math.max(ans, v - mi);
            mi = Math.min(mi, v);
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int ans = 0, mi = prices[0];
        for (int& v : prices) {
            ans = max(ans, v - mi);
            mi = min(mi, v);
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        ans, mi = 0, inf
        for v in prices:
            ans = max(ans, v - mi)
            mi = min(mi, v)
        return ans
```

:::



<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->