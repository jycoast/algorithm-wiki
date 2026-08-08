---
comments: true
difficulty: 中等

tags:
    - 数组
    - 分治
    - 动态规划
---

<script setup>
// 方法一（动态规划）可视化：nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
// f[i] 表示以 nums[i] 结尾的最大子数组和，f[0] = nums[0]；答案 ans = max f
const maxSubSteps = [
  { dp: [-2, null, null, null, null, null, null, null, null], dpStates: [{ i: 0, state: 'cur' }], pointers: [{ i: 0, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: '初始化：f = nums[0] = -2，ans = -2。第一行 f 为状态数组，第二行 nums 为原数组。' },
  { dp: [-2, 1, null, null, null, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }], pointers: [{ i: 1, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=1：f = max(f, 0) + nums[1] = max(-2, 0) + 1 = 1。以 1 结尾的最大子数组为 [1]，和为 1。ans = max(-2, 1) = 1。' },
  { dp: [-2, 1, -2, null, null, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }], pointers: [{ i: 2, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=2：f = max(1, 0) + (-3) = -2。以 -3 结尾的最大子数组为 [1, -3]，和为 -2。ans 仍为 1。' },
  { dp: [-2, 1, -2, 4, null, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'cur' }], pointers: [{ i: 3, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=3：f = max(-2, 0) + 4 = 4。以 4 结尾的最大子数组为 [4]，和为 4。ans = max(1, 4) = 4。' },
  { dp: [-2, 1, -2, 4, 3, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'cur' }], pointers: [{ i: 4, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=4：f = max(4, 0) + (-1) = 3。以 -1 结尾的最大子数组为 [4, -1]，和为 3。ans 仍为 4。' },
  { dp: [-2, 1, -2, 4, 3, 5, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'cur' }], pointers: [{ i: 5, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=5：f = max(3, 0) + 2 = 5。以 2 结尾的最大子数组为 [4, -1, 2]，和为 5。ans = max(4, 5) = 5。' },
  { dp: [-2, 1, -2, 4, 3, 5, 6, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'cur' }], pointers: [{ i: 6, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=6：f = max(5, 0) + 1 = 6。以 1 结尾的最大子数组为 [4, -1, 2, 1]，和为 6。ans = max(5, 6) = 6。' },
  { dp: [-2, 1, -2, 4, 3, 5, 6, 1, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'done' }, { i: 7, state: 'cur' }], pointers: [{ i: 7, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=7：f = max(6, 0) + (-5) = 1。以 -5 结尾的最大子数组为 [4, -1, 2, 1, -5]... 不对，应是 [1, -5]？不：f 保留的是以 -5 结尾的最大和 = max(f[6],0)+nums[7] = 6 + (-5) = 1，对应子数组 [4, -1, 2, 1, -5]。ans 仍为 6。' },
  { dp: [-2, 1, -2, 4, 3, 5, 6, 1, 5], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'mark' }, { i: 7, state: 'done' }, { i: 8, state: 'cur' }], pointers: [{ i: 8, label: 'i' }], aux: [{ title: 'nums', values: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }], note: 'i=8：f = max(1, 0) + 4 = 5。遍历结束，最大和 ans = 6（对应 f[6]，子数组 [4, -1, 2, 1]，红色标注）✅。' },
]
// 方法二（分治法）可视化：maxSub(nums, left, right) 递归，mid 分割，跨中点最大和 crossMaxSub
const maxSubDivideSteps = [
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 4 }, { label: 'r', index: 8 }], window: [0, 8], note: 'maxSub(0, 8)：mid = (0+8)>>1 = 4。分治：左半 [0..4]，右半 [5..8]，再分别求最大子数组和。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 2 }, { label: 'r', index: 4 }], window: [0, 4], note: '递归左半 maxSub(0, 4)：mid = 2。继续二分：左 [0..2]，右 [3..4]。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 1 }, { label: 'r', index: 2 }], window: [0, 2], note: '递归 maxSub(0, 2)：mid = 1。再二分：左 [0..1]，右 [2..2]。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 0 }, { label: 'r', index: 1 }], window: [0, 1], note: 'maxSub(0, 1)：mid = 0。叶子 maxSub(0,0) 返回 -2，maxSub(1,1) 返回 1。crossMaxSub(0, 0, 1)：左半边 lmx = -2，右半边 rmx = 1，跨中点 lmx+rmx = -1。返回 max(-2, 1, -1) = 1。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 1 }, { label: 'r', index: 2 }], window: [0, 2], note: '回到 maxSub(0, 2)：lsum = 1（来自 [0..1]），rsum = -3（[2..2]）。crossMaxSub(0, 1, 2)：左半从 mid 向左 lmx = 1，右半向右 rmx = -3，跨中点 = -2。返回 max(1, -3, -2) = 1。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 2 }, { label: 'r', index: 4 }], window: [0, 4], note: '回到 maxSub(0, 4)：lsum = 1（[0..2]），rsum = 4（[3..4]，子数组 [4]）。crossMaxSub(0, 2, 4)：左半 lmx = -2，右半 rmx = 4，跨中点 = 2。返回 max(1, 4, 2) = 4。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 5 }, { label: 'mid', index: 6 }, { label: 'r', index: 8 }], window: [5, 8], note: '递归右半 maxSub(5, 8)：mid = 6。子问题：maxSub(5,6)=3（子数组 [2,1]），maxSub(7,8)=4（子数组 [4]）。crossMaxSub(5, 6, 8)：左半 lmx=3，右半 rmx=-1，跨中点=2。返回 max(3, 4, 2)=4。' },
  { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4], pointers: [{ label: 'l', index: 0 }, { label: 'mid', index: 4 }, { label: 'r', index: 8 }], window: [0, 8], note: '回到根 maxSub(0, 8)：lsum=4（左半），rsum=4（右半）。crossMaxSub(0, 4, 8)：从 mid=4 向左累加，最大 lmx=3（[1,2]）；向右累加，最大 rmx=3（[2,1]）。跨中点最大和 = 3+3 = 6。返回 max(4, 4, 6) = 6 ✅。' },
]
</script>

<!-- problem:start -->

# [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>nums</code> ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。</p>

<p><strong><span data-keyword="subarray-nonempty">子数组 </span></strong>是数组中的一个连续部分。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [-2,1,-3,4,-1,2,1,-5,4]
<strong>输出：</strong>6
<strong>解释：</strong>连续子数组&nbsp;[4,-1,2,1] 的和最大，为&nbsp;6 。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [1]
<strong>输出：</strong>1
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [5,4,-1,7,8]
<strong>输出：</strong>23
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>如果你已经实现复杂度为 <code>O(n)</code> 的解法，尝试使用更为精妙的 <strong>分治法</strong> 求解。</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i]$ 表示以元素 $nums[i]$ 为结尾的连续子数组的最大和，初始时 $f[0] = nums[0]$，那么最终我们要求的答案即为 $\max_{0 \leq i < n} f[i]$。

考虑 $f[i]$，其中 $i \geq 1$，它的状态转移方程为：

$$
f[i] = \max \{ f[i - 1] + nums[i], nums[i] \}
$$

也即：

$$
f[i] = \max \{ f[i - 1], 0 \} + nums[i]
$$

由于 $f[i]$ 只与 $f[i - 1]$ 有关系，因此我们可以只用一个变量 $f$ 来维护对于当前 $f[i]$ 的值是多少，然后进行状态转移即可。答案为 $\max_{0 \leq i < n} f$。

时间复杂度 $O(n)$，其中 $n$ 为数组 $nums$ 的长度。我们只需要遍历一遍数组即可求得答案。空间复杂度 $O(1)$，我们只需要常数空间存放若干变量。

### 可视化演示

> 以 `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]` 为例，演示动态规划 `f = max(f, 0) + nums[i]` 的过程：`f` 表示以当前元素结尾的最大子数组和，蓝色为当前计算的格子，绿色为已完成，红色为最大和所在位置。点击 ▶ 播放，或逐步操作。

<DpViz :steps="maxSubSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxSubArray(int[] nums) {
        int ans = nums[0];
        for (int i = 1, f = nums[0]; i < nums.length; ++i) {
            f = Math.max(f, 0) + nums[i];
            ans = Math.max(ans, f);
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int ans = nums[0], f = nums[0];
        for (int i = 1; i < nums.size(); ++i) {
            f = max(f, 0) + nums[i];
            ans = max(ans, f);
        }
        return ans;
    }
};
```

```ts [TypeScript]
function maxSubArray(nums: number[]): number {
    let [ans, f] = [nums[0], nums[0]];
    for (let i = 1; i < nums.length; ++i) {
        f = Math.max(f, 0) + nums[i];
        ans = Math.max(ans, f);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        ans = f = nums[0]
        for x in nums[1:]:
            f = max(f, 0) + x
            ans = max(ans, f)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：分治法

### 可视化演示

> 以 `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]` 为例，演示分治法：递归 `maxSub(left, right)` 将区间对半分割，分别求左半、右半及跨中点的最大子数组和，取三者最大值返回。绿色区间为当前递归考察的区间。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="maxSubDivideSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxSubArray(int[] nums) {
        return maxSub(nums, 0, nums.length - 1);
    }

    private int maxSub(int[] nums, int left, int right) {
        if (left == right) {
            return nums[left];
        }
        int mid = (left + right) >>> 1;
        int lsum = maxSub(nums, left, mid);
        int rsum = maxSub(nums, mid + 1, right);
        return Math.max(Math.max(lsum, rsum), crossMaxSub(nums, left, mid, right));
    }

    private int crossMaxSub(int[] nums, int left, int mid, int right) {
        int lsum = 0, rsum = 0;
        int lmx = Integer.MIN_VALUE, rmx = Integer.MIN_VALUE;
        for (int i = mid; i >= left; --i) {
            lsum += nums[i];
            lmx = Math.max(lmx, lsum);
        }
        for (int i = mid + 1; i <= right; ++i) {
            rsum += nums[i];
            rmx = Math.max(rmx, rsum);
        }
        return lmx + rmx;
    }
}
```

```python [Python]
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        def crossMaxSub(nums, left, mid, right):
            lsum = rsum = 0
            lmx = rmx = -inf
            for i in range(mid, left - 1, -1):
                lsum += nums[i]
                lmx = max(lmx, lsum)
            for i in range(mid + 1, right + 1):
                rsum += nums[i]
                rmx = max(rmx, rsum)
            return lmx + rmx

        def maxSub(nums, left, right):
            if left == right:
                return nums[left]
            mid = (left + right) >> 1
            lsum = maxSub(nums, left, mid)
            rsum = maxSub(nums, mid + 1, right)
            csum = crossMaxSub(nums, left, mid, right)
            return max(lsum, rsum, csum)

        left, right = 0, len(nums) - 1
        return maxSub(nums, left, right)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->