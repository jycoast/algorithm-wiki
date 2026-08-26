---
comments: true
difficulty: 困难
tags:
  - 数组
  - 哈希表
entry: firstMissingPositive
testcases:
  - input:
      - - 1
        - 2
        - 0
    output: 3
  - input:
      - - 3
        - 4
        - -1
        - 1
    output: 2
  - input:
      - - 7
        - 8
        - 9
        - 11
        - 12
    output: 1
---


<script setup>
// 方法一（原地交换）可视化：nums = [3,4,-1,1]，n=4
const firstMissingPositiveSteps = [
  { array: [3, 4, -1, 1], pointers: [{ label: 'i', index: 0 }], note: 'nums = [3,4,-1,1]，n=4。目标：把每个数 x 放到下标 x-1。i=0，当前 nums[0]=3' },
  { array: [3, 4, -1, 1], pointers: [{ label: 'i', index: 0 }], highlight: [0, 2], note: 'nums[0]=3 在 [1,n] 内，应放下标 2；nums[2]=-1 ≠ 3 → 交换 nums[0] 与 nums[2]' },
  { array: [-1, 4, 3, 1], pointers: [{ label: 'i', index: 0 }], note: '交换后 [-1,4,3,1]。nums[0]=-1 不在 [1,n]，无需处理 → i++' },
  { array: [-1, 4, 3, 1], pointers: [{ label: 'i', index: 1 }], highlight: [1, 3], note: 'i=1，nums[1]=4 在 [1,n] 内，应放下标 3；nums[3]=1 ≠ 4 → 交换 nums[1] 与 nums[3]' },
  { array: [-1, 1, 3, 4], pointers: [{ label: 'i', index: 1 }], highlight: [0, 1], note: '交换后 [-1,1,3,4]。nums[1]=1 应放下标 0；nums[0]=-1 ≠ 1 → 交换 nums[1] 与 nums[0]' },
  { array: [1, -1, 3, 4], pointers: [{ label: 'i', index: 1 }], note: '交换后 [1,-1,3,4]。nums[1]=-1 不在 [1,n]，无需处理 → i++' },
  { array: [1, -1, 3, 4], pointers: [{ label: 'i', index: 2 }], note: 'i=2，nums[2]=3 应放下标 2，自身已就位（nums[2]==nums[nums[2]-1]）→ i++' },
  { array: [1, -1, 3, 4], pointers: [{ label: 'i', index: 3 }], note: 'i=3，nums[3]=4 应放下标 3，自身已就位 → i++，第一遍结束' },
  { array: [1, -1, 3, 4], pointers: [{ label: 'i', index: 1 }], highlight: [1], note: '第二遍扫描：i=0 时 i+1=1==nums[0] ✓；i=1 时 i+1=2 ≠ nums[1]=-1 → 返回缺失的第一个正数 2 ✅' },
]
</script>

<!-- problem:start -->

# [41. 缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive)

## 题目描述

<!-- description:start -->

<p>给你一个未排序的整数数组 <code>nums</code> ，请你找出其中没有出现的最小的正整数。</p>
请你实现时间复杂度为 <code>O(n)</code> 并且只使用常数级别额外空间的解决方案。

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [1,2,0]
<strong>输出：</strong>3
<strong>解释：</strong>范围 [1,2] 中的数字都在数组中。</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [3,4,-1,1]
<strong>输出：</strong>2
<strong>解释：</strong>1 在数组中，但 2 没有。</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [7,8,9,11,12]
<strong>输出：</strong>1
<strong>解释：</strong>最小的正数 1 没有出现。</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：原地交换

我们假设数组 $nums$ 长度为 $n$，那么最小的正整数一定在 $[1, .., n + 1]$ 之间。我们可以遍历数组，将数组中的每个数 $x$ 交换到它应该在的位置上，即 $x$ 应该在的位置为 $x - 1$。如果 $x$ 不在 $[1, n + 1]$ 之间，那么我们就不用管它。

遍历结束后，我们再遍历数组，如果 $i+1$ 不等于 $nums[i]$，那么 $i+1$ 就是我们要找的最小的正整数。

时间复杂度 $O(n)$，其中 $n$ 是数组的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `nums = [3, 4, -1, 1]` 为例，演示原地交换：指针 `i` 逐个检查，把落在 `[1, n]` 内的数 `x` 交换到下标 `x - 1`；黄色为正在交换的两个位置。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="firstMissingPositiveSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; ++i) {
            while (nums[i] >= 1 && nums[i] <= n && nums[i] != nums[nums[i] - 1]) {
                swap(nums, i, nums[i] - 1);
            }
        }
        for (int i = 0; i < n; ++i) {
            if (i + 1 != nums[i]) {
                return i + 1;
            }
        }
        return n + 1;
    }

    private void swap(int[] nums, int i, int j) {
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
}
```



```cpp [C++]
class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; ++i) {
            while (nums[i] >= 1 && nums[i] <= n && nums[i] != nums[nums[i] - 1]) {
                swap(nums[i], nums[nums[i] - 1]);
            }
        }
        for (int i = 0; i < n; ++i) {
            if (i + 1 != nums[i]) {
                return i + 1;
            }
        }
        return n + 1;
    }
};
```

```ts [TypeScript]
function firstMissingPositive(nums: number[]): number {
    const n = nums.length;
    let i = 0;
    while (i < n) {
        const j = nums[i] - 1;
        if (j === i || j < 0 || j >= n || nums[i] === nums[j]) {
            i++;
        } else {
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }

    const res = nums.findIndex((v, i) => v !== i + 1);
    return (res === -1 ? n : res) + 1;
}
```

```python [Python]
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        def swap(i, j):
            nums[i], nums[j] = nums[j], nums[i]

        n = len(nums)
        for i in range(n):
            while 1 <= nums[i] <= n and nums[i] != nums[nums[i] - 1]:
                swap(i, nums[i] - 1)
        for i in range(n):
            if i + 1 != nums[i]:
                return i + 1
        return n + 1
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->