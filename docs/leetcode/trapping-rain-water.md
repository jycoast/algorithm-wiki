---
comments: true
difficulty: 困难
tags:
  - 栈
  - 数组
  - 双指针
  - 动态规划
  - 单调栈
entry: trap
testcases:
  - input:
      - - 0
        - 1
        - 0
        - 2
        - 1
        - 0
        - 1
        - 3
        - 2
        - 1
        - 2
        - 1
    output: 6
  - input:
      - - 4
        - 2
        - 0
        - 3
        - 2
        - 5
    output: 9
---


<script setup>
// 方法一（动态规划）可视化：height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
// left[i] 前缀最大，right[i] 后缀最大，water[i] = min(left[i], right[i]) - height[i]
const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
const left = [0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]
const right = [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1]
const water = [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0]
const hDone = height.map((_, i) => ({ i, state: 'done' }))
const leftDone = left.map((_, i) => ({ i, state: 'done' }))
const rightDone = right.map((_, i) => ({ i, state: 'done' }))
const waterDone = water.map((_, i) => ({ i, state: 'done' }))
const empty12 = Array.from({ length: 12 }, () => null)
// 以 base 为基础，把 map 中指定下标改为对应状态
function st(base, map) {
  return base.map((s) => (s.i in map ? { i: s.i, state: map[s.i] } : s))
}
const rainWaterSteps = [
  {
    dp: height,
    title: 'height',
    dpStates: hDone,
    note: '木桶效应：某列能接多少水，取决于它左右两侧最高墙中较矮的一侧。先算 left[i]（左侧最高，含自身）与 right[i]（右侧最高，含自身），每列接水量 = min(left[i], right[i]) - height[i]。',
  },
  {
    dp: height,
    title: 'height',
    dpStates: hDone,
    pointers: [{ i: 11, label: 'i' }],
    aux: [
      { title: 'left', values: left, states: leftDone },
      { title: 'right', values: empty12 },
    ],
    note: '从左往右计算 left：left[i] = max(left[i-1], height[i])。得到 left = [0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]，记录每个位置左侧的最高墙。',
  },
  {
    dp: height,
    title: 'height',
    dpStates: hDone,
    pointers: [{ i: 0, label: 'i' }],
    aux: [
      { title: 'left', values: left, states: leftDone },
      { title: 'right', values: right, states: rightDone },
    ],
    note: '从右往左计算 right：right[i] = max(right[i+1], height[i])。得到 right = [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1]，记录每个位置右侧的最高墙。',
  },
  {
    dp: height,
    title: 'height',
    dpStates: st(hDone, { 1: 'hl', 3: 'hl', 7: 'hl', 2: 'cur', 4: 'cur', 5: 'cur' }),
    dpLabels: [
      { i: 2, text: '=1', state: 'cur' },
      { i: 4, text: '=1', state: 'cur' },
      { i: 5, text: '=2', state: 'cur' },
    ],
    aux: [
      { title: 'left', values: left, states: st(leftDone, { 2: 'hl', 4: 'hl', 5: 'hl' }) },
      { title: 'right', values: right, states: st(rightDone, { 2: 'hl', 4: 'hl', 5: 'hl' }) },
    ],
    note: '逐列算水：i=2：min(left[2]=1, right[2]=3) - 0 = 1；i=4：min(left[4]=2, right[4]=3) - 1 = 1；i=5：min(left[5]=2, right[5]=3) - 0 = 2。蓝色为当前列，黄色为左右两侧墙。',
  },
  {
    dp: height,
    title: 'height',
    dpStates: st(hDone, { 3: 'hl', 7: 'hl', 10: 'hl', 6: 'cur', 9: 'cur' }),
    dpLabels: [
      { i: 6, text: '=1', state: 'cur' },
      { i: 9, text: '=1', state: 'cur' },
    ],
    aux: [
      { title: 'left', values: left, states: st(leftDone, { 6: 'hl', 9: 'hl' }) },
      { title: 'right', values: right, states: st(rightDone, { 6: 'hl', 9: 'hl' }) },
    ],
    note: '继续：i=6：min(left[6]=2, right[6]=3) - 1 = 1；i=9：min(left[9]=3, right[9]=2) - 1 = 1。其余列 min(left, right) ≤ height[i]，接水量为 0。',
  },
  {
    dp: height,
    title: 'height',
    dpStates: hDone,
    dpLabels: [
      { i: 2, text: '1', state: 'mark' },
      { i: 4, text: '1', state: 'mark' },
      { i: 5, text: '2', state: 'mark' },
      { i: 6, text: '1', state: 'mark' },
      { i: 9, text: '1', state: 'mark' },
    ],
    aux: [
      { title: 'left', values: left, states: leftDone },
      { title: 'right', values: right, states: rightDone },
    ],
    note: '累加各列接水量：1（i=2）+ 1（i=4）+ 2（i=5）+ 1（i=6）+ 1（i=9）= 6。',
  },
  {
    dp: height,
    title: 'height',
    dpStates: hDone,
    aux: [
      { title: 'left', values: left, states: leftDone },
      { title: 'right', values: right, states: rightDone },
      {
        title: 'water',
        values: water,
        states: st(waterDone, { 2: 'mark', 4: 'mark', 5: 'mark', 6: 'mark', 9: 'mark' }),
      },
    ],
    note: '结论：总接水量 ans = 0 + 0 + 1 + 0 + 1 + 2 + 1 + 0 + 0 + 1 + 0 + 0 = 6 ✅。',
  },
]
</script>

<!-- problem:start -->

# [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water)

## 题目描述

<!-- description:start -->

<p>给定&nbsp;<code>n</code> 个非负整数表示每个宽度为 <code>1</code> 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104454689.png" alt="image-20240823104454689"  />

<pre>
<strong>输入：</strong>height = [0,1,0,2,1,0,1,3,2,1,2,1]
<strong>输出：</strong>6
<strong>解释：</strong>上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>height = [4,2,0,3,2,5]
<strong>输出：</strong>9
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>n == height.length</code></li>
	<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>0 &lt;= height[i] &lt;= 10<sup>5</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：动态规划（双指针）

我们定义 $left[i]$ 表示下标 $i$ 位置及其左边的最高柱子的高度，定义 $right[i]$ 表示下标 $i$ 位置及其右边的最高柱子的高度。那么下标 $i$ 位置能接的雨水量为 $\min(left[i], right[i]) - height[i]$。我们遍历数组，计算出 $left[i]$ 和 $right[i]$，最后答案为 $\sum_{i=0}^{n-1} \min(left[i], right[i]) - height[i]$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组的长度。

### 可视化演示

> 以 `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]` 为例，演示"前缀最大 + 后缀最大"法：每列接水量 = min(左侧最高, 右侧最高) - 自身高度。`left` 为前缀最大，`right` 为后缀最大。蓝色为当前计算，绿色为已完成。点击 ▶ 播放，或逐步操作。

<DpViz :steps="rainWaterSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int trap(int[] height) {
        int n = height.length;
        int[] left = new int[n];
        int[] right = new int[n];
        left[0] = height[0];
        right[n - 1] = height[n - 1];
        int ans = 0;
        for (int i = 1; i < n; i++) {
            left[i] = Math.max(left[i - 1], height[i]);
        }
        for (int i = n - 2; i >= 0; i--) {
            right[i] = Math.max(right[i + 1], height[i]);
        }

        for (int i = 0; i < n; i++) {
            int area = Math.min(right[i], left[i]) - height[i];
            if (area > 0) {
                ans += area;
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        int left[n], right[n];
        left[0] = height[0];
        right[n - 1] = height[n - 1];
        for (int i = 1; i < n; ++i) {
            left[i] = max(left[i - 1], height[i]);
            right[n - i - 1] = max(right[n - i], height[n - i - 1]);
        }
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            ans += min(left[i], right[i]) - height[i];
        }
        return ans;
    }
};
```

```ts [TypeScript]
function trap(height: number[]): number {
    const n = height.length;
    const left: number[] = new Array(n).fill(height[0]);
    const right: number[] = new Array(n).fill(height[n - 1]);
    for (let i = 1; i < n; ++i) {
        left[i] = Math.max(left[i - 1], height[i]);
        right[n - i - 1] = Math.max(right[n - i], height[n - i - 1]);
    }
    let ans = 0;
    for (let i = 0; i < n; ++i) {
        ans += Math.min(left[i], right[i]) - height[i];
    }
    return ans;
}
```

```python [Python]
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        left = [height[0]] * n
        right = [height[-1]] * n
        for i in range(1, n):
            left[i] = max(left[i - 1], height[i])
            right[n - i - 1] = max(right[n - i], height[n - i - 1])
        return sum(min(l, r) - h for l, r, h in zip(left, right, height))
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->