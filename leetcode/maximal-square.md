---
comments: true
difficulty: 中等

tags:
    - 数组
    - 动态规划
    - 矩阵
---

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

假设我们要计算 $dp[4][4]$，此时$matrix[3][3]$等于1，我们分别往上和往左进行延伸，直到碰到一个0为止，上面的长度为1，左边的长度为3，$dp[3][3]$等于1，那么本次的瓶颈在于这三者的最小值，即$min(1,1,3)$，也就是1，那么$dp[3][3]$就等于$min(1,1,3) + 1$ 。

![image-20240814140347623](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240814140347623.png)

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