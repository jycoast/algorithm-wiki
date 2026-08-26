---
comments: true
difficulty: 中等
tags:
  - 广度优先搜索
  - 数组
  - 动态规划
entry: coinChange
testcases:
  - input:
      - - 1
        - 2
        - 5
      - 11
    output: 3
  - input:
      - - 2
      - 3
    output: -1
  - input:
      - - 1
      - 0
    output: 0
---


<script setup>
// 方法一（动态规划·二维完全背包）可视化：coins = [1, 2, 5]，amount = 11
// f[i][j] 表示用前 i 种硬币凑出金额 j 的最少硬币数
// 递推：f[i][j] = min(f[i-1][j], f[i][j-coins[i-1]] + 1)，inf=999 表示无法凑出
const INF = 999
const R0 = [0, INF, INF, INF, INF, INF, INF, INF, INF, INF, INF, INF]
const R1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const R2 = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]
const R3 = [0, 1, 1, 2, 1, 2, 2, 3, 3, 2, 3, 3]
const nullRow = () => Array(12).fill(null)
const rowLabels = ['无', '1', '2', '5']
const colLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
// 生成第 r0..r1 行、第 c0..c1 列全部标记为 state 的状态
const block = (state, r0, r1, c0 = 0, c1 = 11) => {
    const s = []
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) s.push({ r, c, state })
    return s
}
const coinSteps = [
    {
        grid: { values: [R0, nullRow(), nullRow(), nullRow()], rowLabels, colLabels },
        gridStates: [{ r: 0, c: 0, state: 'cur' }],
        note: '初始化：f[0][0] = 0（金额 0 不需要硬币），其余 f[i][j] = 999（INF，表示无法凑出）。第 0 行表示不使用任何硬币，仅金额 0 可达。',
    },
    {
        grid: { values: [R0, R1, nullRow(), nullRow()], rowLabels, colLabels },
        gridStates: [...block('done', 0, 0), ...block('cur', 1, 1)],
        note: '硬币 1：f[1][j] = min(f[0][j], f[1][j-1] + 1)。面值 1 的硬币可无限使用，凑出金额 j 需 j 枚，故 f[1][j] = j。',
    },
    {
        grid: { values: [R0, R1, R2, nullRow()], rowLabels, colLabels },
        gridStates: [...block('done', 0, 1), ...block('cur', 2, 2)],
        note: '硬币 2：f[2][j] = min(f[1][j], f[2][j-2] + 1)。例如 f[2][2] = min(2, f[2][0]+1) = 1；f[2][5] = min(5, f[2][3]+1) = 3（2+2+1）。',
    },
    {
        grid: { values: [R0, R1, R2, R3], rowLabels, colLabels },
        gridStates: [...block('done', 0, 2), ...block('cur', 3, 3)],
        note: '硬币 5：f[3][j] = min(f[2][j], f[3][j-5] + 1)。例如 f[3][5] = min(3, f[3][0]+1) = 1；f[3][11] = min(6, f[3][6]+1) = 3。',
    },
    {
        grid: { values: [R0, R1, R2, R3], rowLabels, colLabels },
        gridStates: [...block('done', 0, 2), ...block('done', 3, 3, 0, 10), { r: 3, c: 11, state: 'mark' }],
        note: '结论：答案 f[3][11] = 3，即 11 = 5 + 5 + 1，最少需要 3 枚硬币 ✅。',
    },
    {
        grid: { values: [R0, R1, R2, R3], rowLabels, colLabels },
        gridStates: [
            { r: 0, c: 0, state: 'path' },
            { r: 1, c: 1, state: 'path' },
            { r: 2, c: 1, state: 'path' },
            { r: 3, c: 1, state: 'path' },
            { r: 3, c: 6, state: 'path' },
            { r: 3, c: 11, state: 'mark' },
        ],
        note: '回溯最优解：f[3][11] = f[3][6] + 1（用 5）= f[3][1] + 1（再用 5）= f[2][1]（不用 5）= f[1][1]（不用 2）= 1（最后用 1），即 11 = 5 + 5 + 1，共 3 枚硬币。',
    },
]
</script>

<!-- problem:start -->

# [322. 零钱兑换](https://leetcode.cn/problems/coin-change)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>coins</code> ，表示不同面额的硬币；以及一个整数 <code>amount</code> ，表示总金额。</p>

<p>计算并返回可以凑成总金额所需的 <strong>最少的硬币个数</strong> 。如果没有任何一种硬币组合能组成总金额，返回&nbsp;<code>-1</code> 。</p>

<p>你可以认为每种硬币的数量是无限的。</p>

<p>&nbsp;</p>

<p><strong>示例&nbsp;1：</strong></p>

<pre>
<strong>输入：</strong>coins = <code>[1, 2, 5]</code>, amount = <code>11</code>
<strong>输出：</strong><code>3</code> 
<strong>解释：</strong>11 = 5 + 5 + 1</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>coins = <code>[2]</code>, amount = <code>3</code>
<strong>输出：</strong>-1</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>coins = [1], amount = 0
<strong>输出：</strong>0
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= coins.length &lt;= 12</code></li>
	<li><code>1 &lt;= coins[i] &lt;= 2<sup>31</sup> - 1</code></li>
	<li><code>0 &lt;= amount &lt;= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：动态规划(完全背包)

我们定义 $f[i][j]$ 表示使用前 $i$ 种硬币，凑出金额 $j$ 的最少硬币数。初始时 $f[0][0] = 0$，其余位置的值均为正无穷。

我们可以枚举使用的最后一枚硬币的数量 $k$，那么有：

$$
f[i][j] = \min(f[i - 1][j], f[i - 1][j - x] + 1, \cdots, f[i - 1][j - k \times x] + k)
$$

其中 $x$ 表示第 $i$ 种硬币的面值。

不妨令 $j = j - x$，那么有：

$$
f[i][j - x] = \min(f[i - 1][j - x], f[i - 1][j - 2 \times x] + 1, \cdots, f[i - 1][j - k \times x] + k - 1)
$$

将二式代入一式，我们可以得到以下状态转移方程：

$$
f[i][j] = \min(f[i - 1][j], f[i][j - x] + 1)
$$

最后答案即为 $f[m][n]$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别为硬币的种类数和总金额。

### 可视化演示

> 以 `coins = [1, 2, 5]`、`amount = 11` 为例，演示二维完全背包动态规划：`f[i][j]` 为用前 `i` 种硬币凑出金额 `j` 所需的最少硬币数，逐个硬币更新。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="coinSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int coinChange(int[] coins, int amount) {
        final int inf = 1 << 30;
        int m = coins.length;
        int n = amount;
        int[][] f = new int[m + 1][n + 1];
        for (var g : f) {
            Arrays.fill(g, inf);
        }
        f[0][0] = 0;
        for (int i = 1; i <= m; ++i) {
            for (int j = 0; j <= n; ++j) {
                f[i][j] = f[i - 1][j];
                if (j >= coins[i - 1]) {
                    f[i][j] = Math.min(f[i][j], f[i][j - coins[i - 1]] + 1);
                }
            }
        }
        return f[m][n] >= inf ? -1 : f[m][n];
    }
}
```

```cpp [C++]
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        int m = coins.size(), n = amount;
        int f[m + 1][n + 1];
        memset(f, 0x3f, sizeof(f));
        f[0][0] = 0;
        for (int i = 1; i <= m; ++i) {
            for (int j = 0; j <= n; ++j) {
                f[i][j] = f[i - 1][j];
                if (j >= coins[i - 1]) {
                    f[i][j] = min(f[i][j], f[i][j - coins[i - 1]] + 1);
                }
            }
        }
        return f[m][n] > n ? -1 : f[m][n];
    }
};
```

```ts [TypeScript]
function coinChange(coins: number[], amount: number): number {
    const m = coins.length;
    const n = amount;
    const f: number[][] = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(1 << 30));
    f[0][0] = 0;
    for (let i = 1; i <= m; ++i) {
        for (let j = 0; j <= n; ++j) {
            f[i][j] = f[i - 1][j];
            if (j >= coins[i - 1]) {
                f[i][j] = Math.min(f[i][j], f[i][j - coins[i - 1]] + 1);
            }
        }
    }
    return f[m][n] > n ? -1 : f[m][n];
}
```

:::
<!-- tabs:end -->


我们注意到 $f[i][j]$ 只与 $f[i - 1][j]$ 和 $f[i][j - x]$ 有关，因此我们可以将二维数组优化为一维数组，空间复杂度降为 $O(n)$。

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int coinChange(int[] coins, int amount) {
        final int inf = 1 << 30;
        int n = amount;
        int[] f = new int[n + 1];
        Arrays.fill(f, inf);
        f[0] = 0;
        for (int x : coins) {
            for (int j = x; j <= n; ++j) {
                f[j] = Math.min(f[j], f[j - x] + 1);
            }
        }
        return f[n] >= inf ? -1 : f[n];
    }
}
```



```cpp [C++]
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        int n = amount;
        int f[n + 1];
        memset(f, 0x3f, sizeof(f));
        f[0] = 0;
        for (int x : coins) {
            for (int j = x; j <= n; ++j) {
                f[j] = min(f[j], f[j - x] + 1);
            }
        }
        return f[n] > n ? -1 : f[n];
    }
};
```

```ts [TypeScript]
function coinChange(coins: number[], amount: number): number {
    const n = amount;
    const f: number[] = Array(n + 1).fill(1 << 30);
    f[0] = 0;
    for (const x of coins) {
        for (let j = x; j <= n; ++j) {
            f[j] = Math.min(f[j], f[j - x] + 1);
        }
    }
    return f[n] > n ? -1 : f[n];
}
```

```python [Python]
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        n = amount
        f = [0] + [inf] * n
        for x in coins:
            for j in range(x, n + 1):
                f[j] = min(f[j], f[j - x] + 1)
        return -1 if f[n] >= inf else f[n]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->