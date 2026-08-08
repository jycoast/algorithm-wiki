---
comments: true
difficulty: 中等

tags:
    - 数组
    - 二分查找
    - 动态规划
    - 滑动窗口
    - 哈希函数
    - 滚动哈希
---

<script setup>
// 方法一（动态规划）可视化：nums1 = [1,2,3,2,1]，nums2 = [3,2,1,4,7]
// f[i][j] 表示以 nums1[i-1]、nums2[j-1] 结尾的最长公共子数组长度
// 两数相等时 f[i][j] = f[i-1][j-1] + 1；行/列 0 为 0 边界（6 行 × 6 列）
const repeatedSubarraySteps = [
  { grid: { values: [[0,0,0,0,0,0],[0,null,null,null,null,null],[0,null,null,null,null,null],[0,null,null,null,null,null],[0,null,null,null,null,null],[0,null,null,null,null,null]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 5, c: 0, state: 'done' }], note: '边界初始化：第 0 行与第 0 列全为 0（nums1 或 nums2 为空时没有公共子数组）。f[i][j] 表示以 nums1[i-1]、nums2[j-1] 结尾的最长公共子数组长度。' },
  { grid: { values: [[0,0,0,0,0,0],[0,0,0,1,0,0],[0,null,null,null,null,null],[0,null,null,null,null,null],[0,null,null,null,null,null],[0,null,null,null,null,null]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'cur' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }], note: 'i=1 行：遍历 j=1..5，仅 j=3 时 nums1[0]=1 == nums2[2]=1，f[1][3] = f[0][2]+1 = 0+1 = 1。其余位置两数不等，f=0。' },
  { grid: { values: [[0,0,0,0,0,0],[0,0,0,1,0,0],[0,0,1,0,0,0],[0,null,null,null,null,null],[0,null,null,null,null,null],[0,null,null,null,null,null]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'cur' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }], note: 'i=2 行：j=2 时 nums1[1]=2 == nums2[1]=2，f[2][2] = f[1][1]+1 = 0+1 = 1。' },
  { grid: { values: [[0,0,0,0,0,0],[0,0,0,1,0,0],[0,0,1,0,0,0],[0,1,0,0,0,0],[0,null,null,null,null,null],[0,null,null,null,null,null]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 1, state: 'cur' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'done' }], note: 'i=3 行：j=1 时 nums1[2]=3 == nums2[0]=3，f[3][1] = f[2][0]+1 = 0+1 = 1。' },
  { grid: { values: [[0,0,0,0,0,0],[0,0,0,1,0,0],[0,0,1,0,0,0],[0,1,0,0,0,0],[0,0,2,0,0,0],[0,null,null,null,null,null]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'cur' }, { r: 4, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 4, c: 5, state: 'done' }], note: 'i=4 行：j=2 时 nums1[3]=2 == nums2[1]=2，f[4][2] = f[3][1]+1 = 1+1 = 2！连续公共子数组延续，长度 +1。' },
  { grid: { values: [[0,0,0,0,0,0],[0,0,0,1,0,0],[0,0,1,0,0,0],[0,1,0,0,0,0],[0,0,2,0,0,0],[0,0,0,3,0,0]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 4, c: 5, state: 'done' }, { r: 5, c: 1, state: 'done' }, { r: 5, c: 2, state: 'done' }, { r: 5, c: 3, state: 'mark' }, { r: 5, c: 4, state: 'done' }, { r: 5, c: 5, state: 'done' }], gridTexts: [{ r: 3, c: 1, text: '1', state: 'path' }, { r: 4, c: 2, text: '2', state: 'path' }, { r: 5, c: 3, text: '3', state: 'mark' }], note: 'i=5 行：j=3 时 nums1[4]=1 == nums2[2]=1，f[5][3] = f[4][2]+1 = 2+1 = 3，连续匹配延续，ans=3。沿对角线标出 1→2→3，红色为答案。' },
  { grid: { values: [[0,0,0,0,0,0],[0,0,0,1,0,0],[0,0,1,0,0,0],[0,1,0,0,0,0],[0,0,2,0,0,0],[0,0,0,3,0,0]], rowLabels: ['0','1','2','3','4','5'], colLabels: ['0','1','2','3','4','5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 4, c: 5, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 5, c: 1, state: 'done' }, { r: 5, c: 2, state: 'done' }, { r: 5, c: 3, state: 'mark' }, { r: 5, c: 4, state: 'done' }, { r: 5, c: 5, state: 'done' }], gridTexts: [{ r: 3, c: 1, text: '1', state: 'path' }, { r: 4, c: 2, text: '2', state: 'path' }, { r: 5, c: 3, text: '3', state: 'mark' }], note: '遍历结束，ans = 3。最长公共子数组为 [3,2,1]（对应 f[5][3]，路径 (3,1)→(4,2)→(5,3)），长度 3 ✅。' },
]
</script>

<!-- problem:start -->

# [718. 最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray)

## 题目描述

<!-- description:start -->

<p>给两个整数数组&nbsp;<code>nums1</code>&nbsp;和&nbsp;<code>nums2</code>&nbsp;，返回 <em>两个数组中 <strong>公共的</strong> 、长度最长的子数组的长度&nbsp;</em>。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
<strong>输出：</strong>3
<strong>解释：</strong>长度最长的公共子数组是 [3,2,1] 。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
<strong>输出：</strong>5
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums1.length, nums2.length &lt;= 1000</code></li>
	<li><code>0 &lt;= nums1[i], nums2[i] &lt;= 100</code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i][j]$ 表示以 $nums1[i - 1]$ 和 $nums2[j - 1]$ 结尾的最长公共子数组的长度，那么我们可以得到状态转移方程：

$$
f[i][j]=
\begin{cases}
0, & nums1[i - 1] \neq nums2[j - 1] \\
f[i - 1][j - 1] + 1, & nums1[i - 1] = nums2[j - 1]
\end{cases}
$$

最终的答案即为所有 $f[i][j]$ 中的最大值。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是数组 $nums1$ 和 $nums2$ 的长度。

### 可视化演示

> 以 `nums1 = [1,2,3,2,1]`、`nums2 = [3,2,1,4,7]` 为例，演示动态规划填表：`f[i][j]` 为以 `nums1[i-1]`、`nums2[j-1]` 结尾的最长公共子数组长度，两数相等时取左上 +1。蓝色为当前计算格子，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="repeatedSubarraySteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int findLength(int[] nums1, int[] nums2) {
        int m = nums1.length;
        int n = nums2.length;
        int[][] f = new int[m + 1][n + 1];
        int ans = 0;
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (nums1[i - 1] == nums2[j - 1]) {
                    f[i][j] = f[i - 1][j - 1] + 1;
                    ans = Math.max(ans, f[i][j]);
                }
            }
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    int findLength(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size(), n = nums2.size();
        vector<vector<int>> f(m + 1, vector<int>(n + 1));
        int ans = 0;
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (nums1[i - 1] == nums2[j - 1]) {
                    f[i][j] = f[i - 1][j - 1] + 1;
                    ans = max(ans, f[i][j]);
                }
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function findLength(nums1: number[], nums2: number[]): number {
    const m = nums1.length;
    const n = nums2.length;
    const f = Array.from({ length: m + 1 }, _ => new Array(n + 1).fill(0));
    let ans = 0;
    for (let i = 1; i <= m; ++i) {
        for (let j = 1; j <= n; ++j) {
            if (nums1[i - 1] == nums2[j - 1]) {
                f[i][j] = f[i - 1][j - 1] + 1;
                ans = Math.max(ans, f[i][j]);
            }
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def findLength(self, nums1: List[int], nums2: List[int]) -> int:
        m, n = len(nums1), len(nums2)
        f = [[0] * (n + 1) for _ in range(m + 1)]
        ans = 0
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if nums1[i - 1] == nums2[j - 1]:
                    f[i][j] = f[i - 1][j - 1] + 1
                    ans = max(ans, f[i][j])
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->