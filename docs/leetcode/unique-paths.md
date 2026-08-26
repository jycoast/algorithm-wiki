---
comments: true
difficulty: 中等
tags:
  - 数学
  - 动态规划
  - 组合数学
entry: uniquePaths
testcases:
  - input:
      - 3
      - 7
    output: 28
  - input:
      - 3
      - 2
    output: 3
  - input:
      - 7
      - 3
    output: 28
  - input:
      - 3
      - 3
    output: 6
---


<script setup>
// 方法一（二维动态规划）可视化：m = 3, n = 3
// f[i][j] 表示从左上角走到 (i, j) 的路径数，f[0][j] = 1, f[i][0] = 1
// f[i][j] = f[i - 1][j] + f[i][j - 1]
const uniquePathsSteps = [
  {
    grid: { values: [[1, null, null], [null, null, null], [null, null, null]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'cur' }],
    note: '起点：f[0][0] = 1（机器人从左上角出发，自身即一条路径）。',
  },
  {
    grid: { values: [[1, 1, 1], [null, null, null], [null, null, null]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 0, c: 2, state: 'cur' }],
    note: '第 0 行：只能向右走，均只有 1 条路径。f[0][1] = f[0][0] = 1，f[0][2] = f[0][1] = 1。',
  },
  {
    grid: { values: [[1, 1, 1], [1, null, null], [1, null, null]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'cur' }, { r: 2, c: 0, state: 'cur' }],
    note: '第 0 列：只能向下走，均只有 1 条路径。f[1][0] = f[0][0] = 1，f[2][0] = f[1][0] = 1。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, null], [1, null, null]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'hl' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'hl' }, { r: 1, c: 1, state: 'cur' }, { r: 2, c: 0, state: 'done' }],
    note: 'f[1][1]：可从上方或左方到达，f[1][1] = f[0][1] + f[1][0] = 1 + 1 = 2。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, 3], [1, 3, null]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'hl' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'hl' }, { r: 1, c: 2, state: 'cur' }, { r: 2, c: 0, state: 'hl' }, { r: 2, c: 1, state: 'cur' }],
    note: 'f[1][2] = f[0][2] + f[1][1] = 1 + 2 = 3；f[2][1] = f[1][1] + f[2][0] = 2 + 1 = 3。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, 3], [1, 3, 6]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'hl' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'hl' }, { r: 2, c: 2, state: 'mark' }],
    note: 'f[2][2] = f[1][2] + f[2][1] = 3 + 3 = 6。答案 f[2][2] = 6 ✅。',
  },
]
// 方法二（全 1 初始化后递推）可视化：m = 3, n = 3
// 先 fill f[*][*] = 1，再 for i=1.., for j=1..: f[i][j] = f[i-1][j] + f[i][j-1]
const uniquePathsFillSteps = [
  {
    grid: { values: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 2, c: 0, state: 'done' }],
    note: '初始化：f 全部填 1。第 0 行与第 0 列为边界值（只能向右/向下，各只有 1 条路径）；内部格子先占位为 1，随后逐格递推覆盖。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, 1], [1, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'hl' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'hl' }, { r: 1, c: 1, state: 'cur' }, { r: 2, c: 0, state: 'done' }],
    note: 'i=1, j=1：f[1][1] = f[0][1] + f[1][0] = 1 + 1 = 2。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, 3], [1, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'hl' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'cur' }, { r: 2, c: 0, state: 'done' }],
    note: 'i=1, j=2：f[1][2] = f[0][2] + f[1][1] = 1 + 2 = 3。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, 3], [1, 3, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'hl' }, { r: 1, c: 2, state: 'done' }, { r: 2, c: 0, state: 'hl' }, { r: 2, c: 1, state: 'cur' }],
    note: 'i=2, j=1：f[2][1] = f[1][1] + f[2][0] = 2 + 1 = 3。',
  },
  {
    grid: { values: [[1, 1, 1], [1, 2, 3], [1, 3, 6]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
    gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'hl' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'hl' }, { r: 2, c: 2, state: 'mark' }],
    note: 'i=2, j=2：f[2][2] = f[1][2] + f[2][1] = 3 + 3 = 6。答案 f[2][2] = 6 ✅。',
  },
]
// 方法三（一维空间优化）可视化：m = 3, n = 3
// f[j] 滚动数组，初始 f = [1,1,1]，每行 f[j] += f[j-1]
const uniquePaths1dSteps = [
  {
    dp: [1, 1, 1],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }],
    note: '初始化：f = [1, 1, 1]，对应第 0 行各格路径数（只能向右，均为 1）。',
  },
  {
    dp: [1, 2, 1],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }, { i: 2, state: 'done' }],
    note: '第 1 行，j=1：f[1] += f[0]，即 1 + 1 = 2。',
  },
  {
    dp: [1, 2, 3],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }],
    note: '第 1 行，j=2：f[2] += f[1]，即 1 + 2 = 3。第 1 行完成：f = [1, 2, 3]。',
  },
  {
    dp: [1, 3, 3],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }, { i: 2, state: 'done' }],
    note: '第 2 行，j=1：f[1] += f[0]，即 2 + 1 = 3。',
  },
  {
    dp: [1, 3, 6],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'mark' }],
    note: '第 2 行，j=2：f[2] += f[1]，即 3 + 3 = 6。答案 f[2] = 6 ✅（与二维表 f[2][2] 一致）。',
  },
]
</script>

<!-- problem:start -->

# [62. 不同路径](https://leetcode.cn/problems/unique-paths)

## 题目描述

<!-- description:start -->

<p>一个机器人位于一个 <code>m x n</code><em>&nbsp;</em>网格的左上角 （起始点在下图中标记为 “Start” ）。</p>

<p>机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。</p>

<p>问总共有多少条不同的路径？</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104943196.png" alt="image-20240823104943196"  />

<pre>
<strong>输入：</strong>m = 3, n = 7
<strong>输出：</strong>28</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>m = 3, n = 2
<strong>输出：</strong>3
<strong>解释：</strong>
从左上角开始，总共有 3 条路径可以到达右下角。
1. 向右 -&gt; 向下 -&gt; 向下
2. 向下 -&gt; 向下 -&gt; 向右
3. 向下 -&gt; 向右 -&gt; 向下
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>m = 7, n = 3
<strong>输出：</strong>28
</pre>

<p><strong>示例 4：</strong></p>

<pre>
<strong>输入：</strong>m = 3, n = 3
<strong>输出：</strong>6</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= m, n &lt;= 100</code></li>
	<li>题目数据保证答案小于等于 <code>2 * 10<sup>9</sup></code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i][j]$ 表示从左上角走到 $(i, j)$ 的路径数量，初始时 $f[0][0] = 1$，答案为 $f[m - 1][n - 1]$。

考虑 $f[i][j]$：

-   如果 $i \gt 0$，那么 $f[i][j]$ 可以从 $f[i - 1][j]$ 走一步到达，因此 $f[i][j] = f[i][j] + f[i - 1][j]$；
-   如果 $j \gt 0$，那么 $f[i][j]$ 可以从 $f[i][j - 1]$ 走一步到达，因此 $f[i][j] = f[i][j] + f[i][j - 1]$。

因此，我们有如下的状态转移方程：

$$
f[i][j] = \begin{cases}
1 & i = 0, j = 0 \\
f[i - 1][j] + f[i][j - 1] & \textit{otherwise}
\end{cases}
$$

最终的答案即为 $f[m - 1][n - 1]$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是网格的行数和列数。

我们注意到 $f[i][j]$ 仅与 $f[i - 1][j]$ 和 $f[i][j - 1]$ 有关，因此我们优化掉第一维空间，仅保留第二维空间，得到时间复杂度 $O(m \times n)$，空间复杂度 $O(n)$ 的实现。

### 可视化演示

> 以 `m = 3`、`n = 3` 为例，演示动态规划：`f[i][j] = f[i-1][j] + f[i][j-1]`（只能向下/向右）。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="uniquePathsSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int uniquePaths(int m, int n) {
        var f = new int[m][n];
        f[0][0] = 1;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (i > 0) {
                    f[i][j] += f[i - 1][j];
                }
                if (j > 0) {
                    f[i][j] += f[i][j - 1];
                }
            }
        }
        return f[m - 1][n - 1];
    }
}
```

```cpp [C++]
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> f(m, vector<int>(n));
        f[0][0] = 1;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (i) {
                    f[i][j] += f[i - 1][j];
                }
                if (j) {
                    f[i][j] += f[i][j - 1];
                }
            }
        }
        return f[m - 1][n - 1];
    }
};
```

```ts [TypeScript]
function uniquePaths(m: number, n: number): number {
    const f: number[][] = Array(m)
        .fill(0)
        .map(() => Array(n).fill(0));
    f[0][0] = 1;
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            if (i > 0) {
                f[i][j] += f[i - 1][j];
            }
            if (j > 0) {
                f[i][j] += f[i][j - 1];
            }
        }
    }
    return f[m - 1][n - 1];
}
```

```python [Python]
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        f = [[0] * n for _ in range(m)]
        f[0][0] = 1
        for i in range(m):
            for j in range(n):
                if i:
                    f[i][j] += f[i - 1][j]
                if j:
                    f[i][j] += f[i][j - 1]
        return f[-1][-1]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二

### 可视化演示

> 以 `m = 3`、`n = 3` 为例，演示动态规划：初始化 `f[i][j] = 1`，再递推 `f[i][j] = f[i-1][j] + f[i][j-1]`。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="uniquePathsFillSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int uniquePaths(int m, int n) {
        var f = new int[m][n];
        for (var g : f) {
            Arrays.fill(g, 1);
        }
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; j++) {
                f[i][j] = f[i - 1][j] + f[i][j - 1];
            }
        }
        return f[m - 1][n - 1];
    }
}
```


```cpp [C++]
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> f(m, vector<int>(n, 1));
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                f[i][j] = f[i - 1][j] + f[i][j - 1];
            }
        }
        return f[m - 1][n - 1];
    }
};
```


```ts [TypeScript]
function uniquePaths(m: number, n: number): number {
    const f: number[][] = Array(m)
        .fill(0)
        .map(() => Array(n).fill(1));
    for (let i = 1; i < m; ++i) {
        for (let j = 1; j < n; ++j) {
            f[i][j] = f[i - 1][j] + f[i][j - 1];
        }
    }
    return f[m - 1][n - 1];
}
```

```python [Python]
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        f = [[1] * n for _ in range(m)]
        for i in range(1, m):
            for j in range(1, n):
                f[i][j] = f[i - 1][j] + f[i][j - 1]
        return f[-1][-1]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三

### 可视化演示

> 以 `m = 3`、`n = 3` 为例，演示一维空间优化的滚动数组：`f[j] += f[j-1]`。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="uniquePaths1dSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int uniquePaths(int m, int n) {
        int[] f = new int[n];
        Arrays.fill(f, 1);
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                f[j] += f[j - 1];
            }
        }
        return f[n - 1];
    }
}
```

```cpp [C++]
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> f(n, 1);
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                f[j] += f[j - 1];
            }
        }
        return f[n - 1];
    }
};
```

```ts [TypeScript]
function uniquePaths(m: number, n: number): number {
    const f: number[] = Array(n).fill(1);
    for (let i = 1; i < m; ++i) {
        for (let j = 1; j < n; ++j) {
            f[j] += f[j - 1];
        }
    }
    return f[n - 1];
}
```
```python [Python]
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        f = [1] * n
        for _ in range(1, m):
            for j in range(1, n):
                f[j] += f[j - 1]
        return f[-1]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->