---
comments: true
difficulty: 简单

tags:
    - 数组
    - 哈希表
entry: twoSum
testcases:
  - input: [[2, 7, 11, 15], 9]
    output: [0, 1]
  - input: [[3, 2, 4], 6]
    output: [1, 2]
  - input: [[3, 3], 6]
    output: [0, 1]
hidden_testcases:
  - input: [[0, 4, 3, 0], 0]
    output: [0, 3]
  - input: [[1, 3, 4, 2], 6]
    output: [2, 3]
  - input: [[-1, -2, -3, -4, -5], -8]
    output: [2, 4]
---

<script setup>
// 可视化演示数据：nums = [2,7,11,15]，target = 9，返回 [0, 1]
// 哈希表 d：key 存元素值，value 存下标。遍历时先查 target - x 是否已在表内
const twoSumSteps = [
  { array: [2, 7, 11, 15], pointers: [{ label: 'i', index: 0 }], map: [], note: '初始：哈希表 d 为空，i 从头遍历' },
  { array: [2, 7, 11, 15], pointers: [{ label: 'i', index: 0 }], map: [], highlight: [0], note: 'i=0，x=2，需要找 y = target - x = 7。d 中无 7，将 2→0 存入哈希表' },
  { array: [2, 7, 11, 15], pointers: [{ label: 'i', index: 1 }], map: [{ key: 2, value: 0 }], highlight: [1], note: 'i=1，x=7，需要找 y = target - x = 2。d 中有 key=2（value=0）！' },
  { array: [2, 7, 11, 15], pointers: [{ label: 'i', index: 1 }], map: [{ key: 2, value: 0 }], mapHighlight: [0], highlight: [0, 1], note: '命中！返回 [d[2], i] = [0, 1] ✅' },
]
</script>

<!-- problem:start -->

# [1. 两数之和](https://leetcode.cn/problems/two-sum)

## 题目描述

<!-- description:start -->

<p>给定一个整数数组 <code>nums</code>&nbsp;和一个整数目标值 <code>target</code>，请你在该数组中找出 <strong>和为目标值 </strong><em><code>target</code></em>&nbsp; 的那&nbsp;<strong>两个</strong>&nbsp;整数，并返回它们的数组下标。</p>

<p>你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。</p>

<p>你可以按任意顺序返回答案。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [2,7,11,15], target = 9
<strong>输出：</strong>[0,1]
<strong>解释：</strong>因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
</pre>

<p><strong class="example">示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [3,2,4], target = 6
<strong>输出：</strong>[1,2]
</pre>

<p><strong class="example">示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [3,3], target = 6
<strong>输出：</strong>[0,1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>只会存在一个有效答案</strong></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你可以想出一个时间复杂度小于 <code>O(n<sup>2</sup>)</code> 的算法吗？</p>

<!-- description:end -->

<!-- solution:start -->

## 方法一：哈希表

我们可以使用一个哈希表 $\textit{d}$ 来存储每个元素及其对应的索引。

遍历数组 $\textit{nums}$，对于当前元素 $\textit{nums}[i]$，我们首先判断 $\textit{target} - \textit{nums}[i]$ 是否在哈希表 $\textit{d}$ 中，如果在 $\textit{d}$ 中，说明 $\textit{target}$ 值已经找到，返回 $\textit{target} - \textit{nums}[i]$ 的索引和 $i$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{nums}$ 的长度。

## 可视化演示

> 以 `nums = [2, 7, 11, 15]`、`target = 9` 为例，演示哈希表边遍历边查表的过程。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="twoSumSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> d = new HashMap<>();
        for (int i = 0;; ++i) {
            int x = nums[i];
            int y = target - x;
            if (d.containsKey(y)) {
                return new int[] {d.get(y), i};
            }
            d.put(x, i);
        }
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> d;
        for (int i = 0;; ++i) {
            int x = nums[i];
            int y = target - x;
            if (d.contains(y)) {
                return {d[y], i};
            }
            d[x] = i;
        }
    }
};
```

```ts [TypeScript]
function twoSum(nums: number[], target: number): number[] {
    const d = new Map<number, number>();
    for (let i = 0; ; ++i) {
        const x = nums[i];
        const y = target - x;
        if (d.has(y)) {
            return [d.get(y)!, i];
        }
        d.set(x, i);
    }
}
```

```python [Python]
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        d = {}
        for i, x in enumerate(nums):
            y = target - x
            if y in d:
                return [d[y], i]
            d[x] = i
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->