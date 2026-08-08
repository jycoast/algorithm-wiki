---
comments: true
difficulty: 中等

tags:
    - 数组
    - 二分查找
---

<script setup>
// 可视化演示数据：nums = [4,5,6,7,0,1,2]，target = 0，返回下标 4
const rotatedSearchSteps = [
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 6 }], note: '初始：left = 0，right = n - 1 = 6' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 6 }], highlight: [3], note: 'mid = 3，nums[3] = 7。nums[0]=4 ≤ 7，左半 [4,5,6,7] 有序' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 4 }, { label: 'right', index: 6 }], note: 'target=0 不在有序左半 [4,7] 内，left = mid + 1 = 4' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 4 }, { label: 'right', index: 6 }], highlight: [5], note: 'mid = 5，nums[5] = 1。nums[0]=4 > 1，右半 [0,1,2] 有序' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 4 }, { label: 'right', index: 5 }], note: 'target=0 不在有序右半 (1,2] 内，right = mid = 5' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 4 }, { label: 'right', index: 5 }], highlight: [4], note: 'mid = 4，nums[4] = 0。nums[0]=4 > 0，右半 [0] 有序' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 4 }, { label: 'right', index: 4 }], note: 'nums[4]=0 < target 不成立，right = mid = 4，left == right 终止' },
  { array: [4, 5, 6, 7, 0, 1, 2], pointers: [{ label: 'left', index: 4 }, { label: 'right', index: 4 }], highlight: [4], note: 'nums[4] = 0 == target，返回下标 4 ✅' },
]
</script>

<!-- problem:start -->

# [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array)

## 题目描述

<!-- description:start -->

<p>整数数组 <code>nums</code> 按升序排列，数组中的值 <strong>互不相同</strong> 。</p>

<p>在传递给函数之前，<code>nums</code> 在预先未知的某个下标 <code>k</code>（<code>0 &lt;= k &lt; nums.length</code>）上进行了 <strong>旋转</strong>，使数组变为 <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code>（下标 <strong>从 0 开始</strong> 计数）。例如， <code>[0,1,2,4,5,6,7]</code> 在下标 <code>3</code> 处经旋转后可能变为&nbsp;<code>[4,5,6,7,0,1,2]</code> 。</p>

<p>给你 <strong>旋转后</strong> 的数组 <code>nums</code> 和一个整数 <code>target</code> ，如果 <code>nums</code> 中存在这个目标值 <code>target</code> ，则返回它的下标，否则返回&nbsp;<code>-1</code>&nbsp;。</p>

<p>你必须设计一个时间复杂度为 <code>O(log n)</code> 的算法解决此问题。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [<code>4,5,6,7,0,1,2]</code>, target = 0
<strong>输出：</strong>4
</pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入：</strong>nums = [<code>4,5,6,7,0,1,2]</code>, target = 3
<strong>输出：</strong>-1</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [1], target = 0
<strong>输出：</strong>-1
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 5000</code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
	<li><code>nums</code> 中的每个值都 <strong>独一无二</strong></li>
	<li>题目数据保证 <code>nums</code> 在预先未知的某个下标上进行了旋转</li>
	<li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：二分查找

我们使用二分，将数组分割成 $[left,.. mid]$, $[mid + 1,.. right]$ 两部分，这时候可以发现，其中有一部分一定是有序的。

因此，我们可以根据有序的那一部分，判断 $target$ 是否在这一部分中：

-   若 $[0,.. mid]$ 范围内的元素构成有序数组：
    -   若满足 $nums[0] \leq target \leq nums[mid]$，那么我们搜索范围可以缩小为 $[left,.. mid]$；
    -   否则，在 $[mid + 1,.. right]$ 中查找；
-   若 $[mid + 1, n - 1]$ 范围内的元素构成有序数组：
    -   若满足 $nums[mid] \lt target \leq nums[n - 1]$，那么我们搜索范围可以缩小为 $[mid + 1,.. right]$；
    -   否则，在 $[left,.. mid]$ 中查找。

二分查找终止条件是 $left \geq right$，若结束后发现 $nums[left]$ 与 $target$ 不等，说明数组中不存在值为 $target$ 的元素，返回 $-1$，否则返回下标 $left$。

时间复杂度 $O(\log n)$，其中 $n$ 是数组 $nums$ 的长度。空间复杂度 $O(1)$。

## 可视化演示

> 以 `nums = [4, 5, 6, 7, 0, 1, 2]`、`target = 0` 为例，演示旋转数组二分查找的收缩过程。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="rotatedSearchSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int search(int[] nums, int target) {
        int n = nums.length;
        int left = 0, right = n - 1;
        while (left < right) {
            int mid = (left + right) >> 1;
            if (nums[0] <= nums[mid]) {
                if (nums[0] <= target && target <= nums[mid]) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[n - 1]) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
        }
        return nums[left] == target ? left : -1;
    }
}
```

```cpp [C++]
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int n = nums.size();
        int left = 0, right = n - 1;
        while (left < right) {
            int mid = (left + right) >> 1;
            if (nums[0] <= nums[mid]) {
                if (nums[0] <= target && target <= nums[mid])
                    right = mid;
                else
                    left = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[n - 1])
                    left = mid + 1;
                else
                    right = mid;
            }
        }
        return nums[left] == target ? left : -1;
    }
};
```

```ts [TypeScript]
function search(nums: number[], target: number): number {
    const n = nums.length;
    let left = 0,
        right = n - 1;
    while (left < right) {
        const mid = (left + right) >> 1;
        if (nums[0] <= nums[mid]) {
            if (nums[0] <= target && target <= nums[mid]) {
                right = mid;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[n - 1]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
    }
    return nums[left] == target ? left : -1;
}
```

```python [Python]
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        n = len(nums)
        left, right = 0, n - 1
        while left < right:
            mid = (left + right) >> 1
            if nums[0] <= nums[mid]:
                if nums[0] <= target <= nums[mid]:
                    right = mid
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[n - 1]:
                    left = mid + 1
                else:
                    right = mid
        return left if nums[left] == target else -1
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->