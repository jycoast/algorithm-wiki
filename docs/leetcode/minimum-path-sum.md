---
comments: true
difficulty: 中等

tags:
    - 数组
    - 动态规划
    - 矩阵
---

<script setup>
// 方法一（动态规划）可视化：grid = [[1,3,1],[1,5,1],[4,2,1]]
// f[i][j] 表示从左上角走到 (i,j) 的最小路径和
// f[i][j] = min(f[i-1][j], f[i][j-1]) + grid[i][j]
const minPathSumSteps = [
  { grid: { values: [[1, null, null], [null, null, null], [null, null, null]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'cur' }], note: '起点：f[0][0] = grid[0][0] = 1。' },
  { grid: { values: [[1, 4, 5], [null, null, null], [null, null, null]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 0, c: 2, state: 'cur' }], note: '第 0 行：只能向右走。f[0][1] = f[0][0] + grid[0][1] = 1 + 3 = 4；f[0][2] = f[0][1] + grid[0][2] = 4 + 1 = 5。' },
  { grid: { values: [[1, 4, 5], [2, null, null], [6, null, null]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'cur' }, { r: 2, c: 0, state: 'cur' }], note: '第 0 列：只能向下走。f[1][0] = f[0][0] + grid[1][0] = 1 + 1 = 2；f[2][0] = f[1][0] + grid[2][0] = 2 + 4 = 6。' },
  { grid: { values: [[1, 4, 5], [2, 7, null], [6, null, null]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'hl' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'hl' }, { r: 1, c: 1, state: 'cur' }, { r: 2, c: 0, state: 'done' }], note: 'f[1][1]：min(f[0][1]=4, f[1][0]=2) + grid[1][1]=5 = 2 + 5 = 7。' },
  { grid: { values: [[1, 4, 5], [2, 7, 6], [6, 8, null]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'hl' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'hl' }, { r: 1, c: 2, state: 'cur' }, { r: 2, c: 0, state: 'hl' }, { r: 2, c: 1, state: 'cur' }], note: 'f[1][2]：min(f[0][2]=5, f[1][1]=7) + grid[1][2]=1 = 5 + 1 = 6；f[2][1]：min(f[1][1]=7, f[2][0]=6) + grid[2][1]=2 = 6 + 2 = 8。' },
  { grid: { values: [[1, 4, 5], [2, 7, 6], [6, 8, 7]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'hl' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'hl' }, { r: 2, c: 2, state: 'mark' }], note: 'f[2][2]：min(f[1][2]=6, f[2][1]=8) + grid[2][2]=1 = 6 + 1 = 7。答案 f[2][2] = 7。' },
  { grid: { values: [[1, 4, 5], [2, 7, 6], [6, 8, 7]], rowLabels: ['行0', '行1', '行2'], colLabels: ['列0', '列1', '列2'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'mark' }], gridTexts: [{ r: 0, c: 0, text: '1', state: 'path' }, { r: 0, c: 1, text: '4', state: 'path' }, { r: 0, c: 2, text: '5', state: 'path' }, { r: 1, c: 2, text: '6', state: 'path' }, { r: 2, c: 2, text: '7', state: 'mark' }], note: '回溯最优路径：(0,0)→(0,1)→(0,2)→(1,2)→(2,2)，对应 grid 值 1→3→1→1→1，最小路径和 = 7 ✅。' },
]
</script>

<!-- problem:start -->

# [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum)

## 题目描述

<!-- description:start -->

<p>给定一个包含非负整数的 <code><em>m</em>&nbsp;x&nbsp;<em>n</em></code>&nbsp;网格&nbsp;<code>grid</code> ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。</p>

<p><strong>说明：</strong>每次只能向下或者向右移动一步。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823111550638.png" alt="image-20240823111550638"  />
<pre>
<strong>输入：</strong>grid = [[1,3,1],[1,5,1],[4,2,1]]
<strong>输出：</strong>7
<strong>解释：</strong>因为路径 1→3→1→1→1 的总和最小。
</pre>

<p><strong class="example">示例 2：</strong></p>

<pre>
<strong>输入：</strong>grid = [[1,2,3],[4,5,6]]
<strong>输出：</strong>12
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>m == grid.length</code></li>
	<li><code>n == grid[i].length</code></li>
	<li><code>1 &lt;= m, n &lt;= 200</code></li>
	<li><code>0 &lt;= grid[i][j] &lt;= 200</code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i][j]$ 表示从左上角走到 $(i, j)$ 位置的最小路径和。初始时 $f[0][0] = grid[0][0]$，答案为 $f[m - 1][n - 1]$。

考虑 $f[i][j]$：

-   如果 $j = 0$，那么 $f[i][j] = f[i - 1][j] + grid[i][j]$；
-   如果 $i = 0$，那么 $f[i][j] = f[i][j - 1] + grid[i][j]$；
-   如果 $i \gt 0$ 且 $j \gt 0$，那么 $f[i][j] = \min(f[i - 1][j], f[i][j - 1]) + grid[i][j]$。

最后返回 $f[m - 1][n - 1]$ 即可。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是网格的行数和列数。

### 可视化演示

> 以 `grid = [[1,3,1],[1,5,1],[4,2,1]]` 为例，演示动态规划填表：`f[i][j]` 为从左上角到 `(i,j)` 的最小路径和，`f[i][j] = min(f[i-1][j], f[i][j-1]) + grid[i][j]`。蓝色为当前计算格子，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="minPathSumSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] f = new int[m][n];
        f[0][0] = grid[0][0];
        for (int i = 1; i < m; ++i) {
            f[i][0] = f[i - 1][0] + grid[i][0];
        }
        for (int j = 1; j < n; ++j) {
            f[0][j] = f[0][j - 1] + grid[0][j];
        }
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                f[i][j] = Math.min(f[i - 1][j], f[i][j - 1]) + grid[i][j];
            }
        }
        return f[m - 1][n - 1];
    }
}
```



```cpp [C++]
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        int f[m][n];
        f[0][0] = grid[0][0];
        for (int i = 1; i < m; ++i) {
            f[i][0] = f[i - 1][0] + grid[i][0];
        }
        for (int j = 1; j < n; ++j) {
            f[0][j] = f[0][j - 1] + grid[0][j];
        }
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                f[i][j] = min(f[i - 1][j], f[i][j - 1]) + grid[i][j];
            }
        }
        return f[m - 1][n - 1];
    }
};
```

```ts [TypeScript]
function minPathSum(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    const f: number[][] = Array(m)
        .fill(0)
        .map(() => Array(n).fill(0));
    f[0][0] = grid[0][0];
    for (let i = 1; i < m; ++i) {
        f[i][0] = f[i - 1][0] + grid[i][0];
    }
    for (let j = 1; j < n; ++j) {
        f[0][j] = f[0][j - 1] + grid[0][j];
    }
    for (let i = 1; i < m; ++i) {
        for (let j = 1; j < n; ++j) {
            f[i][j] = Math.min(f[i - 1][j], f[i][j - 1]) + grid[i][j];
        }
    }
    return f[m - 1][n - 1];
}
```

```python [Python]
class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        f = [[0] * n for _ in range(m)]
        f[0][0] = grid[0][0]
        for i in range(1, m):
            f[i][0] = f[i - 1][0] + grid[i][0]
        for j in range(1, n):
            f[0][j] = f[0][j - 1] + grid[0][j]
        for i in range(1, m):
            for j in range(1, n):
                f[i][j] = min(f[i - 1][j], f[i][j - 1]) + grid[i][j]
        return f[-1][-1]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->