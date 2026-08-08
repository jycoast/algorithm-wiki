---
comments: true
difficulty: 简单

tags:
    - 数组
    - 双指针
---

<script setup>
// 可视化演示数据：数组 [0,1,0,3,12] 逐步执行「双指针」（指针名与代码一致：i 为落点、j 为扫描）
const moveZeroesSteps = [
  { array: [0, 1, 0, 3, 12], pointers: [{ label: 'i', index: -1 }, { label: 'j', index: 0 }], note: '初始：i = -1 指向已处理好的非零序列末尾，j 从头开始扫描' },
  { array: [0, 1, 0, 3, 12], pointers: [{ label: 'i', index: -1 }, { label: 'j', index: 0 }], highlight: [0], note: 'nums[0] = 0，无需移动，j 继续后移' },
  { array: [0, 1, 0, 3, 12], pointers: [{ label: 'i', index: -1 }, { label: 'j', index: 1 }], note: 'j 后移到 1' },
  { array: [0, 1, 0, 3, 12], pointers: [{ label: 'i', index: -1 }, { label: 'j', index: 1 }], highlight: [1], note: 'nums[1] = 1 ≠ 0，i 先自增' },
  { array: [1, 0, 0, 3, 12], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 1 }], highlight: [0, 1], note: '交换 nums[i] 与 nums[j]，1 被搬到位置 0' },
  { array: [1, 0, 0, 3, 12], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 2 }], note: 'j 后移到 2' },
  { array: [1, 0, 0, 3, 12], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 2 }], highlight: [2], note: 'nums[2] = 0，跳过，j 继续后移' },
  { array: [1, 0, 0, 3, 12], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 3 }], note: 'j 后移到 3' },
  { array: [1, 0, 0, 3, 12], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 3 }], highlight: [3], note: 'nums[3] = 3 ≠ 0，i 先自增到 1' },
  { array: [1, 3, 0, 0, 12], pointers: [{ label: 'i', index: 1 }, { label: 'j', index: 3 }], highlight: [1, 3], note: '交换 nums[i] 与 nums[j]，3 被搬到位置 1' },
  { array: [1, 3, 0, 0, 12], pointers: [{ label: 'i', index: 1 }, { label: 'j', index: 4 }], note: 'j 后移到 4' },
  { array: [1, 3, 0, 0, 12], pointers: [{ label: 'i', index: 1 }, { label: 'j', index: 4 }], highlight: [4], note: 'nums[4] = 12 ≠ 0，i 先自增到 2' },
  { array: [1, 3, 12, 0, 0], pointers: [{ label: 'i', index: 2 }, { label: 'j', index: 4 }], highlight: [2, 4], note: '交换 nums[i] 与 nums[j]，12 被搬到位置 2' },
  { array: [1, 3, 12, 0, 0], note: '遍历结束：所有非零元素保持原序前移，0 全部落回末尾 ✅' },
]

const moveZeroesDiagram = `flowchart TD
    A["初始化 w=0, j=0"] --> B{"j < n ?"}
    B -- "否" --> F["完成：非零元素已全部前移"]
    B -- "是" --> C{"nums[j] != 0 ?"}
    C -- "否" --> D["j 后移"]
    C -- "是" --> E["交换 nums[w] 与 nums[j]"]
    E --> G["w 后移"]
    G --> D
    D --> B`
</script>

<!-- problem:start -->

# [283. 移动零](https://leetcode.cn/problems/move-zeroes)

## 题目描述

<!-- description:start -->

<p>给定一个数组 <code>nums</code>，编写一个函数将所有 <code>0</code> 移动到数组的末尾，同时保持非零元素的相对顺序。</p>

<p><strong>请注意</strong>&nbsp;，必须在不复制数组的情况下原地对数组进行操作。</p>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>

<pre>
<strong>输入:</strong> nums = <code>[0,1,0,3,12]</code>
<strong>输出:</strong> <code>[1,3,12,0,0]</code>
</pre>

<p><strong>示例 2:</strong></p>

<pre>
<strong>输入:</strong> nums = <code>[0]</code>
<strong>输出:</strong> <code>[0]</code></pre>

<p>&nbsp;</p>

<p><strong>提示</strong>:</p>
<meta charset="UTF-8" />

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-2<sup>31</sup>&nbsp;&lt;= nums[i] &lt;= 2<sup>31</sup>&nbsp;- 1</code></li>
</ul>

<p>&nbsp;</p>

<p><b>进阶：</b>你能尽量减少完成的操作次数吗？</p>

<!-- description:end -->

<!-- solution:start -->

## 方法一：双指针

我们使用两个指针 $i$ 和 $j$，其中指针 $i$ 指向当前已经处理好的序列的尾部，而指针 $j$ 指向待处理序列的头部。初始时 $i=-1$。

接下来，我们遍历 $j \in [0,n)$，如果 $nums[j] \neq 0$，那么我们就将指针 $i$ 指向的下一个数与 $nums[j]$ 交换，同时将 $i$ 后移。继续遍历，直至 $j$ 到达数组的尾部，该数组的所有非零元素就按照原有顺序被移动到数组的头部，而所有零元素都被移动到了数组的尾部。

时间复杂度 $O(n)$，其中 $n$ 是数组 $nums$ 的长度。空间复杂度 $O(1)$。

## 可视化演示

> 以 `nums = [0, 1, 0, 3, 12]` 为例，演示双指针 `i`（落点，初始 -1）与 `j`（扫描）的移动过程。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="moveZeroesSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

算法整体流程如下：

<Mermaid :diagram="moveZeroesDiagram" />

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public void moveZeroes(int[] nums) {
        int i = -1, n = nums.length;
        for (int j = 0; j < n; ++j) {
            if (nums[j] != 0) {
                int t = nums[++i];
                nums[i] = nums[j];
                nums[j] = t;
            }
        }
    }
}
```

```cpp [C++]
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int i = -1, n = nums.size();
        for (int j = 0; j < n; ++j) {
            if (nums[j]) {
                swap(nums[++i], nums[j]);
            }
        }
    }
};
```

```ts [TypeScript]
function moveZeroes(nums: number[]): void {
    const n = nums.length;
    let i = 0;
    for (let j = 0; j < n; j++) {
        if (nums[j]) {
            if (j > i) {
                [nums[i], nums[j]] = [nums[j], 0];
            }
            i++;
        }
    }
}
```

```python [Python]
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        i = -1
        for j, x in enumerate(nums):
            if x:
                i += 1
                nums[i], nums[j] = nums[j], nums[i]
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->