---
comments: true
difficulty: 中等
tags:
  - 数组
  - 动态规划
entry: maxProduct
testcases:
  - input:
      - - 2
        - 3
        - -2
        - 4
    output: 6
  - input:
      - - -2
        - 0
        - -1
    output: 0
---


<script setup>
// 方法一（二维动态规划）可视化：nums = [2, 3, -2, 4]
// dp[i][0] 表示以 nums[i] 结尾的最大乘积，dp[i][1] 表示最小乘积
// dp[i][0] = max(nums[i], dp[i-1][0] * nums[i], dp[i-1][1] * nums[i])
// dp[i][1] = min(nums[i], dp[i-1][0] * nums[i], dp[i-1][1] * nums[i])
const maxProductSteps = [
  { grid: { values: [[2, null, null, null], [2, null, null, null]], rowLabels: ['dp[i][0] 最大积', 'dp[i][1] 最小积'], colLabels: ['0', '1', '2', '3'] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 1, c: 0, state: 'cur' }], note: '初始化 i=0：dp[0][0] = dp[0][1] = nums[0] = 2，ans = 2。同时维护最大积与最小积，是因为负数乘负数会反转大小。' },
  { grid: { values: [[2, 6, null, null], [2, 3, null, null]], rowLabels: ['dp[i][0] 最大积', 'dp[i][1] 最小积'], colLabels: ['0', '1', '2', '3'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'i=1，nums[1]=3：dp[1][0] = max(3, 2×3, 2×3) = 6；dp[1][1] = min(3, 6, 6) = 3。ans = max(2, 6) = 6。' },
  { grid: { values: [[2, 6, -2, null], [2, 3, -12, null]], rowLabels: ['dp[i][0] 最大积', 'dp[i][1] 最小积'], colLabels: ['0', '1', '2', '3'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'cur' }, { r: 1, c: 2, state: 'cur' }], note: 'i=2，nums[2]=-2：dp[2][0] = max(-2, 6×(-2), 3×(-2)) = -2；dp[2][1] = min(-2, -12, -6) = -12。关键：必须维护最小积 dp[2][1]=-12，因为负×负得正，最小积乘负数可能反转为最大值。ans 仍为 6。' },
  { grid: { values: [[2, 6, -2, 4], [2, 3, -12, -48]], rowLabels: ['dp[i][0] 最大积', 'dp[i][1] 最小积'], colLabels: ['0', '1', '2', '3'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'cur' }, { r: 1, c: 3, state: 'cur' }], note: 'i=3，nums[3]=4：dp[3][0] = max(4, (-2)×4, (-12)×4) = 4；dp[3][1] = min(4, -8, -48) = -48。ans = max(6, 4) = 6。' },
  { grid: { values: [[2, 6, -2, 4], [2, 3, -12, -48]], rowLabels: ['dp[i][0] 最大积', 'dp[i][1] 最小积'], colLabels: ['0', '1', '2', '3'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 0, c: 1, state: 'mark' }, { r: 1, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 3, state: 'done' }], note: '遍历结束：ans = 6，对应 dp[1][0] = 6，即子数组 [2, 3] 的乘积最大（红色标注）✅。' },
]
// 方法二（滚动变量 f/g）可视化：nums = [2, 3, -2, 4]
// f 为以 nums[i] 结尾的最大乘积，g 为最小乘积；ff/gg 为上一轮旧值
// f = max(nums[i], ff * nums[i], gg * nums[i]); g = min(nums[i], ff * nums[i], gg * nums[i])
const rollSteps = [
  { dp: [2, null, null, null], dpStates: [{ i: 0, state: 'cur' }], pointers: [{ i: 0, label: 'i' }], aux: [{ title: 'g', values: [2, null, null, null] }, { title: 'nums', values: [2, 3, -2, 4] }], note: '初始化 i=0：f = g = ans = nums[0] = 2。f 为最大乘积，g 为最小乘积。' },
  { dp: [2, 6, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }], pointers: [{ i: 1, label: 'i' }], aux: [{ title: 'g', values: [2, 3, null, null] }, { title: 'nums', values: [2, 3, -2, 4] }], note: 'i=1，nums[1]=3：旧值 ff=2, gg=2 → f = max(3, 2×3, 2×3) = 6；g = min(3, 6, 6) = 3。ans = max(2, 6) = 6。' },
  { dp: [2, 6, -2, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }], pointers: [{ i: 2, label: 'i' }], aux: [{ title: 'g', values: [2, 3, -12, null] }, { title: 'nums', values: [2, 3, -2, 4] }], note: 'i=2，nums[2]=-2：旧值 ff=6, gg=3 → f = max(-2, 6×(-2), 3×(-2)) = -2；g = min(-2, -12, -6) = -12。维护最小积 g 正是为了应对负数：负×负得正，-12 之后乘负数可能反转。ans 仍为 6。' },
  { dp: [2, 6, -2, 4], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'cur' }], pointers: [{ i: 3, label: 'i' }], aux: [{ title: 'g', values: [2, 3, -12, -48] }, { title: 'nums', values: [2, 3, -2, 4] }], note: 'i=3，nums[3]=4：旧值 ff=-2, gg=-12 → f = max(4, (-2)×4, (-12)×4) = 4；g = min(4, -8, -48) = -48。ans = max(6, 4) = 6。' },
  { dp: [2, 6, -2, 4], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'mark' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }], aux: [{ title: 'g', values: [2, 3, -12, -48] }, { title: 'nums', values: [2, 3, -2, 4] }], note: '遍历结束：ans = 6，对应 f[1] = 6，即子数组 [2, 3] 的乘积最大（红色标注）✅。' },
]
</script>

<!-- problem:start -->

# [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray)



<!-- description:start -->

<p>给你一个整数数组 <code>nums</code>&nbsp;，请你找出数组中乘积最大的非空连续<span data-keyword="subarray-nonempty">子数组</span>（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。</p>

<p>测试用例的答案是一个&nbsp;<strong>32-位</strong> 整数。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1:</strong></p>

<pre>
<strong>输入:</strong> nums = [2,3,-2,4]
<strong>输出:</strong> <code>6</code>
<strong>解释:</strong>&nbsp;子数组 [2,3] 有最大乘积 6。
</pre>

<p><strong class="example">示例 2:</strong></p>

<pre>
<strong>输入:</strong> nums = [-2,0,-1]
<strong>输出:</strong> 0
<strong>解释:</strong>&nbsp;结果不能为 2, 因为 [-2,-1] 不是子数组。</pre>

<p>&nbsp;</p>

<p><strong>提示:</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
	<li><code>nums</code> 的任何前缀或后缀的乘积都 <strong>保证</strong>&nbsp;是一个 <strong>32-位</strong> 整数</li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：动态规划

### 可视化演示

> 以 `nums = [2, 3, -2, 4]` 为例，演示动态规划：同时维护以 `nums[i]` 结尾的最大乘积与最小乘积（因为负数乘负数会反转大小）。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="maxProductSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
::: code-group

```java [Java]
class Solution {
    public int maxProduct(int[] nums) {
        int n = nums.length;
        int ans = nums[0];
        int[][] dp = new int[n][2];
        dp[0][0] = nums[0];
        dp[0][1] = nums[0];

        for (int i = 1; i < n; i++) {
            // 最大值
            dp[i][0] = Math.max(nums[i], Math.max(dp[i - 1][0] * nums[i], dp[i - 1][1] * nums[i]));
            // 最小值
            dp[i][1] = Math.min(nums[i], Math.min(dp[i - 1][1] * nums[i], dp[i - 1][0] * nums[i]));
            ans = Math.max(dp[i][0], ans);
        }

        return ans;
    }
}
```

:::

## 方法二：动态规划优化

我们定义两个变量 $f$ 和 $g$，其中 $f$ 表示以 $nums[i]$ 结尾的乘积最大子数组的乘积，而 $g$ 表示以 $nums[i]$ 结尾的乘积最小子数组的乘积。初始时 $f$ 和 $g$ 都等于 $nums[0]$。答案为所有 $f$ 中的最大值。

从 $i=1$ 开始，我们可以考虑将第 $i$ 个数 $nums[i]$ 添加到前面的乘积最大或者乘积最小的子数组乘积的后面，或者单独作为一个子数组乘积（即此时子数组长度只有 $1$）。我们将此前的乘积最大值记为 $ff$，乘积最小值记为 $gg$，那么 $f = \max(f, ff \times nums[i], gg \times nums[i])$，而 $g = \min(g, ff \times nums[i], gg \times nums[i])$。接下来，我们更新答案 $ans = \max(ans, f)$，然后继续计算下一个位置。

最后的答案即为 $ans$。

时间复杂度 $O(n)$，其中 $n$ 是数组 $nums$ 的长度。我们只需要遍历数组一次即可求得答案。空间复杂度 $O(1)$。

### 可视化演示

> 以 `nums = [2, 3, -2, 4]` 为例，演示滚动变量优化：`f` 为最大乘积、`g` 为最小乘积，每次用旧值 `ff`、`gg` 推出新 `f`、`g`（因为负数乘负数会反转大小）。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="rollSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxProduct(int[] nums) {
        int f = nums[0], g = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; ++i) {
            int ff = f, gg = g;
            f = Math.max(nums[i], Math.max(ff * nums[i], gg * nums[i]));
            g = Math.min(nums[i], Math.min(ff * nums[i], gg * nums[i]));
            ans = Math.max(ans, f);
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int f = nums[0], g = nums[0], ans = nums[0];
        for (int i = 1; i < nums.size(); ++i) {
            int ff = f, gg = g;
            f = max({nums[i], ff * nums[i], gg * nums[i]});
            g = min({nums[i], ff * nums[i], gg * nums[i]});
            ans = max(ans, f);
        }
        return ans;
    }
};
```

```ts [TypeScript]
function maxProduct(nums: number[]): number {
    let [f, g, ans] = [nums[0], nums[0], nums[0]];
    for (let i = 1; i < nums.length; ++i) {
        const [ff, gg] = [f, g];
        f = Math.max(nums[i], ff * nums[i], gg * nums[i]);
        g = Math.min(nums[i], ff * nums[i], gg * nums[i]);
        ans = Math.max(ans, f);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        ans = f = g = nums[0]
        for x in nums[1:]:
            ff, gg = f, g
            f = max(x, ff * x, gg * x)
            g = min(x, ff * x, gg * x)
            ans = max(ans, f)
        return ans
```

:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->