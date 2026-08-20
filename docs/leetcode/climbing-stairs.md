---
comments: true
difficulty: 简单

tags:
    - 记忆化搜索
    - 数学
    - 动态规划
entry: climbStairs
testcases:
  - input: [2]
    output: 2
  - input: [3]
    output: 3
  - input: [5]
    output: 8
hidden_testcases:
  - input: [1]
    output: 1
  - input: [4]
    output: 5
  - input: [10]
    output: 89
---

<script setup>
// 方法一（动态规划）可视化：n = 6，f[i] 表示爬到第 i 阶的方法数
// f[i] = f[i-1] + f[i-2]，f[0] = f[1] = 1；答案 f[6] = 13
const stairSteps = [
  { dp: [1, 1, null, null, null, null, null], dpStates: [{ i: 0, state: 'cur' }, { i: 1, state: 'cur' }], pointers: [{ i: 0, label: 'i' }, { i: 1, label: 'i' }], note: '初始化边界：f[0]=1（0 阶到 0 阶 1 种），f[1]=1（1 阶 1 种）。' },
  { dp: [1, 1, 2, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }], pointers: [{ i: 2, label: 'i' }], note: 'i=2：f[2]=f[1]+f[0]=1+1=2（一次跨 2 阶或两次跨 1 阶）。' },
  { dp: [1, 1, 2, 3, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'cur' }], pointers: [{ i: 3, label: 'i' }], note: 'i=3：f[3]=f[2]+f[1]=2+1=3。' },
  { dp: [1, 1, 2, 3, 5, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'cur' }], pointers: [{ i: 4, label: 'i' }], note: 'i=4：f[4]=f[3]+f[2]=3+2=5。' },
  { dp: [1, 1, 2, 3, 5, 8, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'cur' }], pointers: [{ i: 5, label: 'i' }], note: 'i=5：f[5]=f[4]+f[3]=5+3=8。' },
  { dp: [1, 1, 2, 3, 5, 8, 13], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'cur' }], pointers: [{ i: 6, label: 'i' }], note: 'i=6：f[6]=f[5]+f[4]=8+5=13。' },
  { dp: [1, 1, 2, 3, 5, 8, 13], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'mark' }], note: '结论：f[6]=13 ✅，爬到第 6 阶共有 13 种方法。' },
]
// 方法二（矩阵快速幂）可视化：base = [[1,1],[1,0]]，res = [[1,1]]
// f[n] = (base^(n-1))[0][0]，本例 n=6，需计算 base^5
const matrixSteps = [
  { grid: { values: [[1, 1], [1, 0]], rowLabels: ['', ''], colLabels: ['', ''] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 0, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'base = [[1,1],[1,0]]。斐波那契递推的转移矩阵，f[n] = (base^(n-1))[0][0]，本例需计算 base^5。' },
  { grid: { values: [[2, 1], [1, 1]], rowLabels: ['', ''], colLabels: ['', ''] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 0, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'base^2 = base × base = [[1×1+1×1, 1×1+1×0],[1×1+0×1, 1×1+0×0]] = [[2,1],[1,1]]。' },
  { grid: { values: [[3, 2], [2, 1]], rowLabels: ['', ''], colLabels: ['', ''] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 0, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'base^3 = base^2 × base = [[2,1],[1,1]] × [[1,1],[1,0]] = [[3,2],[2,1]]。' },
  { grid: { values: [[5, 3], [3, 2]], rowLabels: ['', ''], colLabels: ['', ''] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 0, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'base^4 = base^3 × base = [[3,2],[2,1]] × [[1,1],[1,0]] = [[5,3],[3,2]]。' },
  { grid: { values: [[8, 5], [5, 3]], rowLabels: ['', ''], colLabels: ['', ''] }, gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 0, state: 'cur' }, { r: 1, c: 1, state: 'cur' }], note: 'base^5 = base^4 × base = [[5,3],[3,2]] × [[1,1],[1,0]] = [[8,5],[5,3]]。' },
  { grid: { values: [[13, 8]], rowLabels: [''], colLabels: ['', ''] }, gridStates: [{ r: 0, c: 0, state: 'mark' }, { r: 0, c: 1, state: 'done' }], note: 'res × base^5 = [[1,1]] × [[8,5],[5,3]] = [[13, 8]]。答案 f[6] = res[0][0] = 13 ✅。' },
]
</script>

<!-- problem:start -->

# [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs)

## 题目描述

<!-- description:start -->

<p>假设你正在爬楼梯。需要 <code>n</code>&nbsp;阶你才能到达楼顶。</p>

<p>每次你可以爬 <code>1</code> 或 <code>2</code> 个台阶。你有多少种不同的方法可以爬到楼顶呢？</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>n = 2
<strong>输出：</strong>2
<strong>解释：</strong>有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>n = 3
<strong>输出：</strong>3
<strong>解释：</strong>有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= n &lt;= 45</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递推

我们定义 $f[i]$ 表示爬到第 $i$ 阶楼梯的方法数，那么 $f[i]$ 可以由 $f[i - 1]$ 和 $f[i - 2]$ 转移而来，即：

$$
f[i] = f[i - 1] + f[i - 2]
$$

初始条件为 $f[0] = 1$，$f[1] = 1$，即爬到第 0 阶楼梯的方法数为 1，爬到第 1 阶楼梯的方法数也为 1。

答案即为 $f[n]$。

由于 $f[i]$ 只与 $f[i - 1]$ 和 $f[i - 2]$ 有关，因此我们可以只用两个变量 $a$ 和 $b$ 来维护当前的方法数，空间复杂度降低为 $O(1)$。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。

### 可视化演示

> 以 `n = 6` 为例，演示动态规划：`f[i]` 为爬到第 `i` 阶的方法数，`f[i] = f[i-1] + f[i-2]`。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="stairSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int climbStairs(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; ++i) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
```

```cpp [C++]
class Solution {
public:
    int climbStairs(int n) {
        int a = 0, b = 1;
        for (int i = 0; i < n; ++i) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};
```

```ts [TypeScript]
function climbStairs(n: number): number {
    let p = 1;
    let q = 1;
    for (let i = 1; i < n; i++) {
        [p, q] = [q, p + q];
    }
    return q;
}
```

```python [Python]
class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return b
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：矩阵快速幂加速递推

我们设 $Fib(n)$ 表示一个 $1 \times 2$ 的矩阵 $\begin{bmatrix} F_n & F_{n - 1} \end{bmatrix}$，其中 $F_n$ 和 $F_{n - 1}$ 分别是第 $n$ 个和第 $n - 1$ 个斐波那契数。

我们希望根据 $Fib(n-1) = \begin{bmatrix} F_{n - 1} & F_{n - 2} \end{bmatrix}$ 推出 $Fib(n)$。也即是说，我们需要一个矩阵 $base$，使得 $Fib(n - 1) \times base = Fib(n)$，即：

$$
\begin{bmatrix}
F_{n - 1} & F_{n - 2}
\end{bmatrix} \times base = \begin{bmatrix} F_n & F_{n - 1} \end{bmatrix}
$$

由于 $F_n = F_{n - 1} + F_{n - 2}$，所以矩阵 $base$ 的第一列为：

$$
\begin{bmatrix}
1 \\
1
\end{bmatrix}
$$

第二列为：

$$
\begin{bmatrix}
1 \\
0
\end{bmatrix}
$$

因此有：

$$
\begin{bmatrix} F_{n - 1} & F_{n - 2} \end{bmatrix} \times \begin{bmatrix}1 & 1 \\ 1 & 0\end{bmatrix} = \begin{bmatrix} F_n & F_{n - 1} \end{bmatrix}
$$

我们定义初始矩阵 $res = \begin{bmatrix} 1 & 1 \end{bmatrix}$，那么 $F_n$ 等于 $res$ 乘以 $base^{n - 1}$ 的结果矩阵中第一行的第一个元素。使用矩阵快速幂求解即可。

时间复杂度 $O(\log n)$，空间复杂度 $O(1)$。

### 可视化演示

> 以 `n = 6` 为例，演示矩阵快速幂：`f[n] = (base^(n-1))[0][0]`，`base = [[1,1],[1,0]]`。逐步计算 `base` 的幂，蓝色为当前计算的矩阵，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="matrixSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private final int[][] a = {{1, 1}, {1, 0}};

    public int climbStairs(int n) {
        return pow(a, n - 1)[0][0];
    }

    private int[][] mul(int[][] a, int[][] b) {
        int m = a.length, n = b[0].length;
        int[][] c = new int[m][n];
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                for (int k = 0; k < a[0].length; ++k) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return c;
    }

    private int[][] pow(int[][] a, int n) {
        int[][] res = {{1, 1}, {0, 0}};
        while (n > 0) {
            if ((n & 1) == 1) {
                res = mul(res, a);
            }
            n >>= 1;
            a = mul(a, a);
        }
        return res;
    }
}
```



```cpp [C++]
class Solution {
public:
    int climbStairs(int n) {
        vector<vector<long long>> a = {{1, 1}, {1, 0}};
        return pow(a, n - 1)[0][0];
    }

private:
    vector<vector<long long>> mul(vector<vector<long long>>& a, vector<vector<long long>>& b) {
        int m = a.size(), n = b[0].size();
        vector<vector<long long>> res(m, vector<long long>(n));
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                for (int k = 0; k < a[0].size(); ++k) {
                    res[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return res;
    }

    vector<vector<long long>> pow(vector<vector<long long>>& a, int n) {
        vector<vector<long long>> res = {{1, 1}, {0, 0}};
        while (n) {
            if (n & 1) {
                res = mul(res, a);
            }
            a = mul(a, a);
            n >>= 1;
        }
        return res;
    }
};
```

```ts [TypeScript]
function climbStairs(n: number): number {
    const a = [
        [1, 1],
        [1, 0],
    ];
    return pow(a, n - 1)[0][0];
}

function mul(a: number[][], b: number[][]): number[][] {
    const [m, n] = [a.length, b[0].length];
    const c = Array(m)
        .fill(0)
        .map(() => Array(n).fill(0));
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            for (let k = 0; k < a[0].length; ++k) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return c;
}

function pow(a: number[][], n: number): number[][] {
    let res = [
        [1, 1],
        [0, 0],
    ];
    while (n) {
        if (n & 1) {
            res = mul(res, a);
        }
        a = mul(a, a);
        n >>= 1;
    }
    return res;
}
```

```python [Python]
class Solution:
    def climbStairs(self, n: int) -> int:
        def mul(a: List[List[int]], b: List[List[int]]) -> List[List[int]]:
            m, n = len(a), len(b[0])
            c = [[0] * n for _ in range(m)]
            for i in range(m):
                for j in range(n):
                    for k in range(len(a[0])):
                        c[i][j] = c[i][j] + a[i][k] * b[k][j]
            return c

        def pow(a: List[List[int]], n: int) -> List[List[int]]:
            res = [[1, 1]]
            while n:
                if n & 1:
                    res = mul(res, a)
                n >>= 1
                a = mul(a, a)
            return res

        a = [[1, 1], [1, 0]]
        return pow(a, n - 1)[0][0]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->