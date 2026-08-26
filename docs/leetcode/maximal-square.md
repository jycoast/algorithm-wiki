---
comments: true
difficulty: 中等
tags:
  - 数组
  - 动态规划
  - 矩阵
entry: maximalSquare
testcases:
  - input:
      - - - '1'
          - '0'
          - '1'
          - '0'
          - '0'
        - - '1'
          - '0'
          - '1'
          - '1'
          - '1'
        - - '1'
          - '1'
          - '1'
          - '1'
          - '1'
        - - '1'
          - '0'
          - '0'
          - '1'
          - '0'
    output: 4
  - input:
      - - - '0'
          - '1'
        - - '1'
          - '0'
    output: 1
  - input:
      - - - '0'
    output: 0
---


<script setup>
// 方法一（动态规划）可视化：matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]（4 行 × 5 列）
// dp[i+1][j+1] 表示以 matrix[i][j] 为右下角的最大正方形边长，dp 为 5 行 × 6 列（第 0 行、第 0 列为 0 边界）
// 当 matrix[i][j]=='1'：dp[i+1][j+1] = min(dp[i][j], dp[i][j+1], dp[i+1][j]) + 1
const maximalSquareSteps = [
  // 1. 第 0 行边界全 0
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, null, null, null, null, null], [0, null, null, null, null, null], [0, null, null, null, null, null], [0, null, null, null, null, null]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }], note: '初始化：dp 为 5 行 × 6 列表格，`dp[i+1][j+1]` 对应 `matrix[i][j]`。第 0 行全部置 0（dp 边界）。' },
  // 2. 第 0 列边界全 0
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, null, null, null, null, null], [0, null, null, null, null, null], [0, null, null, null, null, null], [0, null, null, null, null, null]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }], note: '第 0 列全部置 0。边界初始化完成，后续状态转移无需再判断越界。' },
  // 3. i=0 行（matrix 行 0）
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0], [0, null, null, null, null, null], [0, null, null, null, null, null], [0, null, null, null, null, null]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 1, c: 1, state: 'cur' }, { r: 1, c: 2, state: 'cur' }, { r: 1, c: 3, state: 'cur' }, { r: 1, c: 4, state: 'cur' }, { r: 1, c: 5, state: 'cur' }], note: 'i=0 行（matrix 第 0 行）：dp[1][1]=min(dp[0][0]=0, dp[0][1]=0, dp[1][0]=0)+1=1（matrix[0][0]="1"），dp[1][2]=0（"0"），dp[1][3]=1，dp[1][4]=0，dp[1][5]=0。mx=1。' },
  // 4. i=1 行（matrix 行 1 "10111"）
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0], [0, 1, 0, 1, 1, 1], [0, null, null, null, null, null], [0, null, null, null, null, null]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'cur' }, { r: 2, c: 2, state: 'cur' }, { r: 2, c: 3, state: 'cur' }, { r: 2, c: 4, state: 'cur' }, { r: 2, c: 5, state: 'cur' }], note: 'i=1 行（matrix 第 1 行 "10111"）：dp[2][1]=1，dp[2][2]=0，dp[2][3]=1，dp[2][4]=min(dp[1][4]=0, dp[2][3]=1, dp[1][3]=1)+1=1，dp[2][5]=1。mx 仍为 1。' },
  // 5. i=2 行（matrix 行 2 "11111"），cur 标 dp[3][4]
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0], [0, 1, 0, 1, 1, 1], [0, 1, 1, 1, 2, null], [0, null, null, null, null, null]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'cur' }], note: 'i=2 行（matrix 第 2 行 "11111"）：dp[3][1]=1，dp[3][2]=1，dp[3][3]=1，dp[3][4]=min(dp[2][4]=1, dp[3][3]=1, dp[2][3]=1)+1=2！首次出现边长为 2 的正方形，mx=2。' },
  // 6. i=2 行继续，dp[3][5]
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0], [0, 1, 0, 1, 1, 1], [0, 1, 1, 1, 2, 2], [0, null, null, null, null, null]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'cur' }], note: 'i=2 行继续：dp[3][5]=min(dp[2][5]=1, dp[3][4]=2, dp[2][4]=1)+1=2。mx 仍为 2。' },
  // 7. i=3 行（matrix 行 3 "10010"）
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0], [0, 1, 0, 1, 1, 1], [0, 1, 1, 1, 2, 2], [0, 1, 0, 0, 1, 0]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'done' }, { r: 4, c: 1, state: 'cur' }, { r: 4, c: 2, state: 'cur' }, { r: 4, c: 3, state: 'cur' }, { r: 4, c: 4, state: 'cur' }, { r: 4, c: 5, state: 'cur' }], note: 'i=3 行（matrix 第 3 行 "10010"）：dp[4][1]=1，dp[4][2]=0，dp[4][3]=0，dp[4][4]=min(dp[3][4]=2, dp[4][3]=0, dp[3][3]=1)+1=1，dp[4][5]=0。mx 仍为 2。' },
  // 8. 结论：mx=2，面积 = 4
  { grid: { values: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0], [0, 1, 0, 1, 1, 1], [0, 1, 1, 1, 2, 2], [0, 1, 0, 0, 1, 0]], rowLabels: ['0', '1', '2', '3', '4'], colLabels: ['0', '1', '2', '3', '4', '5'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }, { r: 0, c: 5, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 1, c: 4, state: 'done' }, { r: 1, c: 5, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 2, c: 5, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 3, c: 5, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 4, c: 5, state: 'done' }], gridTexts: [{ r: 3, c: 4, text: '2', state: 'mark' }, { r: 3, c: 5, text: '2', state: 'mark' }], note: '遍历结束：mx=2，最大正方形边长为 2，面积 = 2×2 = 4 ✅。红色标出两个边长为 2 的全 1 正方形的右下角（dp[3][4] 对应 matrix[2][3]，dp[3][5] 对应 matrix[2][4]）。' },
]
</script>

<!-- problem:start -->

# [221. 最大正方形](https://leetcode.cn/problems/maximal-square)

## 题目描述

<!-- description:start -->

<p>在一个由 <code>'0'</code> 和 <code>'1'</code> 组成的二维矩阵内，找到只包含 <code>'1'</code> 的最大正方形，并返回其面积。</p>

<p> </p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823111621650.png" alt="image-20240823111621650"  />

<pre>
<strong>输入：</strong>matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
<strong>输出：</strong>4
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823111636014.png" alt="image-20240823111636014"  />
<pre>
<strong>输入：</strong>matrix = [["0","1"],["1","0"]]
<strong>输出：</strong>1
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>matrix = [["0"]]
<strong>输出：</strong>0
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>m == matrix.length</code></li>
	<li><code>n == matrix[i].length</code></li>
	<li><code>1 <= m, n <= 300</code></li>
	<li><code>matrix[i][j]</code> 为 <code>'0'</code> 或 <code>'1'</code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：动态规划

我们定义 $dp[i + 1][j + 1]$ 表示以下标 $(i, j)$ 作为正方形右下角的最大正方形边长。答案为所有 $dp[i + 1][j + 1]$ 中的最大值。

状态转移方程为：

$$
dp[i + 1][j + 1] =
\begin{cases}
0 & \textit{if } matrix[i][j] = '0' \\
\min(dp[i][j], dp[i][j + 1], dp[i + 1][j]) + 1 & \textit{if } matrix[i][j] = '1'
\end{cases}
$$

时间复杂度 $O(m\times n)$，空间复杂度 $O(m\times n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

### 可视化演示

> 以 `matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]` 为例，演示动态规划填表：`dp[i+1][j+1]` 为以 `matrix[i][j]` 为右下角的最大正方形边长，字符为 `1` 时取左上、上、左三者的最小值 +1。蓝色为当前计算格子，绿色为已完成，红色为最大边长所在。点击 ▶ 播放，或逐步操作。

<DpViz :steps="maximalSquareSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

假设我们要计算 $dp[4][4]$，此时$matrix[3][3]$等于1，我们分别往上和往左进行延伸，直到碰到一个0为止，上面的长度为1，左边的长度为3，$dp[3][3]$等于1，那么本次的瓶颈在于这三者的最小值，即$min(1,1,3)$，也就是1，那么$dp[3][3]$就等于$min(1,1,3) + 1$ 。

![image-20240814140347623](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240814140347623.png)

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maximalSquare(char[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[][] dp = new int[m + 1][n + 1];
        int mx = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] == '1') {
                    dp[i + 1][j + 1] = Math.min(Math.min(dp[i][j + 1], dp[i + 1][j]), dp[i][j]) + 1;
                    mx = Math.max(mx, dp[i + 1][j + 1]);
                }
            }
        }
        return mx * mx;
    }
}
```

```cpp [C++]
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        int mx = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] == '1') {
                    dp[i + 1][j + 1] = min(min(dp[i][j + 1], dp[i + 1][j]), dp[i][j]) + 1;
                    mx = max(mx, dp[i + 1][j + 1]);
                }
            }
        }
        return mx * mx;
    }
};
```

```python [Python]
class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        m, n = len(matrix), len(matrix[0])
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        mx = 0
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == '1':
                    dp[i + 1][j + 1] = min(dp[i][j + 1], dp[i + 1][j], dp[i][j]) + 1
                    mx = max(mx, dp[i + 1][j + 1])
        return mx * mx
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->