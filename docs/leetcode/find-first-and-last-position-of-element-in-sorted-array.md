---
comments: true
difficulty: 中等

tags:
    - 数组
    - 二分查找
---

<script setup>
// 可视化演示数据：nums = [5,7,7,8,8,10]，target = 8
// 核心思路：两次二分 —— 找 target 的插入位置 l、target+1 的插入位置 r，区间为 [l, r-1]
const searchRangeSteps = [
  { array: [5, 7, 7, 8, 8, 10], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 6 }], note: '第一次二分：查找 target=8 的插入位置（左边界）。left = 0，right = n = 6' },
  { array: [5, 7, 7, 8, 8, 10], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 6 }], highlight: [3], note: 'mid = 3，nums[3] = 8 ≥ 8，满足条件，right = mid = 3' },
  { array: [5, 7, 7, 8, 8, 10], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 3 }], highlight: [1], note: 'mid = 1，nums[1] = 7 < 8，left = mid + 1 = 2' },
  { array: [5, 7, 7, 8, 8, 10], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 3 }], highlight: [2], note: 'mid = 2，nums[2] = 7 < 8，left = mid + 1 = 3' },
  { array: [5, 7, 7, 8, 8, 10], pointers: [{ label: 'left', index: 3 }, { label: 'right', index: 3 }], highlight: [3], note: 'left == right = 3，第一次二分结束：左边界 l = 3' },
  { array: [5, 7, 7, 8, 8, 10], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 6 }], highlight: [5], note: '第二次二分：查找 target+1=9 的插入位置（右边界外）。可得 r = 5' },
  { array: [5, 7, 7, 8, 8, 10], highlight: [3, 4], note: 'l = 3，r = 5，区间为 [l, r-1] = [3, 4]。返回 [3, 4] ✅' },
]
</script>

<!-- problem:start -->

# [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array)

## 题目描述

<!-- description:start -->

<p>给你一个按照非递减顺序排列的整数数组 <code>nums</code>，和一个目标值 <code>target</code>。请你找出给定目标值在数组中的开始位置和结束位置。</p>

<p>如果数组中不存在目标值 <code>target</code>，返回&nbsp;<code>[-1, -1]</code>。</p>

<p>你必须设计并实现时间复杂度为&nbsp;<code>O(log n)</code>&nbsp;的算法解决此问题。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [<code>5,7,7,8,8,10]</code>, target = 8
<strong>输出：</strong>[3,4]</pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入：</strong>nums = [<code>5,7,7,8,8,10]</code>, target = 6
<strong>输出：</strong>[-1,-1]</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [], target = 0
<strong>输出：</strong>[-1,-1]</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>0 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>9</sup>&nbsp;&lt;= nums[i]&nbsp;&lt;= 10<sup>9</sup></code></li>
	<li><code>nums</code>&nbsp;是一个非递减数组</li>
	<li><code>-10<sup>9</sup>&nbsp;&lt;= target&nbsp;&lt;= 10<sup>9</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：二分查找

我们可以进行两次二分查找，分别查找出左边界和右边界。

时间复杂度 $O(\log n)$，空间复杂度 $O(1)$。其中 $n$ 是数组 $nums$ 的长度。

## 可视化演示

> 以 `nums = [5, 7, 7, 8, 8, 10]`、`target = 8` 为例，演示两次二分查找左右边界的过程。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="searchRangeSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

以下是二分查找的两个通用模板：

模板 1：

```java
boolean check(int x) {
}

int search(int left, int right) {
    while (left < right) {
        int mid = (left + right) >> 1;
        if (check(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
```

模板 2：

```java
boolean check(int x) {
}

int search(int left, int right) {
    while (left < right) {
        int mid = (left + right + 1) >> 1;
        if (check(mid)) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    return left;
}
```

做二分题目时，可以按照以下套路：

1. 写出循环条件 $left < right$；
1. 循环体内，不妨先写 $mid = \lfloor \frac{left + right}{2} \rfloor$；
1. 根据具体题目，实现 $check()$ 函数（有时很简单的逻辑，可以不定义 $check$），想一下究竟要用 $right = mid$（模板 $1$） 还是 $left = mid$（模板 $2$）；
       - 如果 $right = mid$，那么写出 else 语句 $left = mid + 1$，并且不需要更改 mid 的计算，即保持 $mid = \lfloor \frac{left + right}{2} \rfloor$；
       - 如果 $left = mid$，那么写出 else 语句 $right = mid - 1$，并且在 $mid$ 计算时补充 +1，即 $mid = \lfloor \frac{left + right + 1}{2} \rfloor$；
1. 循环结束时， $left$ 与 $right$ 相等。

注意，这两个模板的优点是始终保持答案位于二分区间内，二分结束条件对应的值恰好在答案所处的位置。 对于可能无解的情况，只要判断二分结束后的 $left$ 或者 $right$ 是否满足题意即可。

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int l = search(nums, target);
        int r = search(nums, target + 1);
        return l == r ? new int[] {-1, -1} : new int[] {l, r - 1};
    }

    private int search(int[] nums, int x) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = (left + right) >>> 1;
            if (nums[mid] >= x) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int l = lower_bound(nums.begin(), nums.end(), target) - nums.begin();
        int r = lower_bound(nums.begin(), nums.end(), target + 1) - nums.begin();
        if (l == r) return {-1, -1};
        return {l, r - 1};
    }
};
```

```ts [TypeScript]
function searchRange(nums: number[], target: number): number[] {
    const search = (x: number): number => {
        let [left, right] = [0, nums.length];
        while (left < right) {
            const mid = (left + right) >> 1;
            if (nums[mid] >= x) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    };
    const l = search(target);
    const r = search(target + 1);
    return l === r ? [-1, -1] : [l, r - 1];
}
```

```python [Python]
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        l = bisect_left(nums, target)
        r = bisect_left(nums, target + 1)
        return [-1, -1] if l == r else [l, r - 1]
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->