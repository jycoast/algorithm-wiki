---
comments: true
difficulty: 中等

tags:
    - 深度优先搜索
    - 广度优先搜索
    - 并查集
    - 数组
    - 矩阵
---

<!-- problem:start -->

# [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island)

## 题目描述

<!-- description:start -->

<p>给你一个大小为 <code>m x n</code> 的二进制矩阵 <code>grid</code> 。</p>

<p><strong>岛屿</strong>&nbsp;是由一些相邻的&nbsp;<code>1</code>&nbsp;(代表土地) 构成的组合，这里的「相邻」要求两个 <code>1</code> 必须在 <strong>水平或者竖直的四个方向上 </strong>相邻。你可以假设&nbsp;<code>grid</code> 的四个边缘都被 <code>0</code>（代表水）包围着。</p>

<p>岛屿的面积是岛上值为 <code>1</code> 的单元格的数目。</p>

<p>计算并返回 <code>grid</code> 中最大的岛屿面积。如果没有岛屿，则返回面积为 <code>0</code> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104546147.png" alt="image-20240823104546147"  />
<pre>
<strong>输入：</strong>grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]
<strong>输出：</strong>6
<strong>解释：</strong>答案不应该是 <code>11</code> ，因为岛屿只能包含水平或垂直这四个方向上的 <code>1</code> 。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>grid = [[0,0,0,0,0,0,0,0]]
<strong>输出：</strong>0
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>m == grid.length</code></li>
	<li><code>n == grid[i].length</code></li>
	<li><code>1 &lt;= m, n &lt;= 50</code></li>
	<li><code>grid[i][j]</code> 为 <code>0</code> 或 <code>1</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：DFS

我们可以遍历每一个格子 $(i, j)$，从每个格子开始进行深度优先搜索，如果搜索到的格子是陆地，就将当前格子标记为已访问，并且继续搜索上、下、左、右四个方向的格子。搜索结束后，计算标记的陆地的数量，即为岛屿的面积。我们找出最大的岛屿面积即为答案。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是二维数组的行数和列数。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int m;
    private int n;
    private int[][] grid;

    public int maxAreaOfIsland(int[][] grid) {
        m = grid.length;
        n = grid[0].length;
        this.grid = grid;
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                ans = Math.max(ans, dfs(i, j));
            }
        }
        return ans;
    }

    private int dfs(int i, int j) {
        if (grid[i][j] == 0) {
            return 0;
        }
        int ans = 1;
        grid[i][j] = 0;
        int[] dirs = {-1, 0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x >= 0 && x < m && y >= 0 && y < n) {
                ans += dfs(x, y);
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        int dirs[5] = {-1, 0, 1, 0, -1};
        int ans = 0;
        function<int(int, int)> dfs = [&](int i, int j) {
            if (grid[i][j] == 0) {
                return 0;
            }
            int ans = 1;
            grid[i][j] = 0;
            for (int k = 0; k < 4; ++k) {
                int x = i + dirs[k], y = j + dirs[k + 1];
                if (x >= 0 && x < m && y >= 0 && y < n) {
                    ans += dfs(x, y);
                }
            }
            return ans;
        };
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                ans = max(ans, dfs(i, j));
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function maxAreaOfIsland(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    const dirs = [-1, 0, 1, 0, -1];
    const dfs = (i: number, j: number): number => {
        if (grid[i][j] === 0) {
            return 0;
        }
        let ans = 1;
        grid[i][j] = 0;
        for (let k = 0; k < 4; ++k) {
            const [x, y] = [i + dirs[k], j + dirs[k + 1]];
            if (x >= 0 && x < m && y >= 0 && y < n) {
                ans += dfs(x, y);
            }
        }
        return ans;
    };
    let ans = 0;
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            ans = Math.max(ans, dfs(i, j));
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        def dfs(i: int, j: int) -> int:
            if grid[i][j] == 0:
                return 0
            ans = 1
            grid[i][j] = 0
            dirs = (-1, 0, 1, 0, -1)
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if 0 <= x < m and 0 <= y < n:
                    ans += dfs(x, y)
            return ans

        m, n = len(grid), len(grid[0])
        return max(dfs(i, j) for i in range(m) for j in range(n))
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->