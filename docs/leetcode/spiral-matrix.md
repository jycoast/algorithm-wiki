---
comments: true
difficulty: 中等
tags:
  - 数组
  - 矩阵
  - 模拟
entry: spiralOrder
testcases:
  - input:
      - - - 1
          - 2
          - 3
        - - 4
          - 5
          - 6
        - - 7
          - 8
          - 9
    output:
      - 1
      - 2
      - 3
      - 6
      - 9
      - 8
      - 7
      - 4
      - 5
  - input:
      - - - 1
          - 2
          - 3
          - 4
        - - 5
          - 6
          - 7
          - 8
        - - 9
          - 10
          - 11
          - 12
    output:
      - 1
      - 2
      - 3
      - 4
      - 8
      - 12
      - 11
      - 10
      - 9
      - 5
      - 6
      - 7
---


<script setup>
// 螺旋矩阵三解法共用示例：matrix = [[1,2,3],[4,5,6],[7,8,9]]，m = n = 3
// 顺时针螺旋顺序结果：ans = [1,2,3,6,9,8,7,4,5]
const M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
const rowLabels = ['0', '1', '2']
const colLabels = ['0', '1', '2']
const m = 3, n = 3
const dirs = [0, 1, 0, -1, 0]
const DIR_NAME = ['右', '下', '左', '上']
const hl = (r, c) => ({ r, c, state: 'hl' })
const cur = (r, c) => ({ r, c, state: 'cur' })
const done = (r, c) => ({ r, c, state: 'done' })
const txt = (r, c, t, s) => (s ? { r, c, text: String(t), state: s } : { r, c, text: String(t) })

// 方法一（模拟 + vis 布尔数组）可视化
const spiralSteps = []
{
    const vis = Array.from({ length: m }, () => Array(n).fill(false))
    const ord = Array.from({ length: m }, () => Array(n).fill(0))
    let i = 0, j = 0, k = 0
    let cnt = 0
    spiralSteps.push({
        grid: { values: M, rowLabels, colLabels },
        gridStates: [cur(0, 0)],
        note: '初始状态：i = 0，j = 0，k = 0（向右）。dirs = [0, 1, 0, -1, 0]，用布尔数组 vis 记录已访问元素，ans 依次收集访问结果。',
    })
    for (let h = m * n; h > 0; --h) {
        cnt++
        ord[i][j] = cnt
        vis[i][j] = true
        const x = i + dirs[k], y = j + dirs[k + 1]
        let reason = ''
        if (x < 0 || x >= m || y < 0 || y >= n) reason = `前方 (${x},${y}) 越界`
        else if (vis[x][y]) reason = `前方 (${x},${y}) 已访问`
        const kOld = k
        if (reason) k = (k + 1) % 4
        const states = []
        const texts = []
        for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
            if (vis[r][c]) {
                if (r === i && c === j) states.push(cur(r, c))
                else states.push(done(r, c))
                texts.push(txt(r, c, ord[r][c]))
            }
        }
        let note
        if (reason) {
            note = `第 ${cnt} 步：读取 matrix[${i}][${j}] = ${M[i][j]} 加入 ans，vis[${i}][${j}] = true。${reason}，方向 k 由 ${kOld}（${DIR_NAME[kOld]}）转至 ${k}（${DIR_NAME[k]}）。`
        } else {
            note = `第 ${cnt} 步：读取 matrix[${i}][${j}] = ${M[i][j]} 加入 ans，vis[${i}][${j}] = true。前方未越界且未访问，方向 k 保持 ${k}（${DIR_NAME[k]}）。`
        }
        spiralSteps.push({ grid: { values: M, rowLabels, colLabels }, gridStates: states, gridTexts: texts, note })
        i += dirs[k]
        j += dirs[k + 1]
    }
    const finalStates = []
    const finalTexts = []
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
        finalStates.push(done(r, c))
        finalTexts.push(txt(r, c, ord[r][c]))
    }
    spiralSteps.push({
        grid: { values: M, rowLabels, colLabels },
        gridStates: finalStates,
        gridTexts: finalTexts,
        note: '全部 m×n = 9 个元素访问完毕。ans = [1, 2, 3, 6, 9, 8, 7, 4, 5] ✅',
    })
}

// 方法二（原地 +300 标记）可视化：不用 vis，访问后 matrix[i][j] += 300，前方 matrix[x][y] > 100 即已访问
const spiralMarkSteps = []
{
    const mat = M.map((row) => row.slice())
    let i = 0, j = 0, k = 0
    let cnt = 0
    spiralMarkSteps.push({
        grid: { values: mat, rowLabels, colLabels },
        gridStates: [cur(0, 0)],
        note: '初始状态：不使用 vis，访问后 matrix[i][j] += 300 原地标记，判断前方 matrix[x][y] > 100 即视为已访问。i = 0，j = 0，k = 0（向右）。',
    })
    for (let h = m * n; h > 0; --h) {
        cnt++
        const orig = mat[i][j]
        mat[i][j] += 300
        const x = i + dirs[k], y = j + dirs[k + 1]
        let reason = ''
        if (x < 0 || x >= m || y < 0 || y >= n) reason = `前方 (${x},${y}) 越界`
        else if (mat[x][y] > 100) reason = `前方 matrix[${x}][${y}] = ${mat[x][y]} > 100（已标记）`
        const kOld = k
        if (reason) k = (k + 1) % 4
        const states = []
        for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
            if (r === i && c === j) continue
            if (mat[r][c] > 100) states.push(done(r, c))
        }
        states.push(cur(i, j))
        const texts = [{ r: i, c: j, text: String(orig), state: 'cur' }]
        const values = mat.map((row) => row.slice())
        let note
        if (reason) {
            note = `第 ${cnt} 步：读取 matrix[${i}][${j}] = ${orig} 加入 ans，随后 matrix[${i}][${j}] += 300 → ${mat[i][j]}。${reason}，方向 k 由 ${kOld}（${DIR_NAME[kOld]}）转至 ${k}（${DIR_NAME[k]}）。`
        } else {
            note = `第 ${cnt} 步：读取 matrix[${i}][${j}] = ${orig} 加入 ans，随后 matrix[${i}][${j}] += 300 → ${mat[i][j]}。前方 matrix[${x}][${y}] = ${mat[x][y]} ≤ 100，方向 k 保持 ${k}（${DIR_NAME[k]}）。`
        }
        spiralMarkSteps.push({ grid: { values, rowLabels, colLabels }, gridStates: states, gridTexts: texts, note })
        i += dirs[k]
        j += dirs[k + 1]
    }
    spiralMarkSteps.push({
        grid: { values: mat.map((row) => row.slice()), rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), done(0, 2), done(1, 0), done(1, 1), done(1, 2), done(2, 0), done(2, 1), done(2, 2)],
        note: '遍历结束：所有元素均已被 +300 标记（301~309）。ans = [1, 2, 3, 6, 9, 8, 7, 4, 5] ✅',
    })
}

// 方法三（逐层收缩边界）可视化：用 x1、y1、x2、y2 圈定当前层，依次遍历上、右、下、左边后向内收缩
const ring1Done = [done(0, 0), done(0, 1), done(0, 2), done(1, 0), done(1, 2), done(2, 0), done(2, 1), done(2, 2)]
const ring1Texts = [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3), txt(1, 0, 8), txt(1, 2, 4), txt(2, 0, 7), txt(2, 1, 6), txt(2, 2, 5)]
const spiralLayerSteps = [
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [hl(0, 0), hl(0, 2), hl(2, 0), hl(2, 2)],
        note: '初始状态：while (x1 <= x2 && y1 <= y2)。第 1 圈边界 x1=0，y1=0，x2=2，y2=2，先沿上边从左到右遍历。黄色为 4 个边界角。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [cur(0, 0)],
        gridTexts: [txt(0, 0, 1, 'cur')],
        note: '第 1 步：上边 for (j = 0; j <= 2; ++j)，加入 matrix[0][0] = 1。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), cur(0, 1)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2, 'cur')],
        note: '第 2 步：上边，加入 matrix[0][1] = 2。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), cur(0, 2)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3, 'cur')],
        note: '第 3 步：上边，加入 matrix[0][2] = 3。上边遍历结束。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), done(0, 2), cur(1, 2)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3), txt(1, 2, 4, 'cur')],
        note: '第 4 步：右边 for (i = 1; i <= 2; ++i)，加入 matrix[1][2] = 6。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), done(0, 2), done(1, 2), cur(2, 2)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3), txt(1, 2, 4), txt(2, 2, 5, 'cur')],
        note: '第 5 步：右边，加入 matrix[2][2] = 9。右边遍历结束。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), done(0, 2), done(1, 2), done(2, 2), cur(2, 1)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3), txt(1, 2, 4), txt(2, 2, 5), txt(2, 1, 6, 'cur')],
        note: '第 6 步：x1 < x2 且 y1 < y2 成立，下边 for (j = 1; j >= 0; --j)，加入 matrix[2][1] = 8。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), done(0, 2), done(1, 2), done(2, 2), done(2, 1), cur(2, 0)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3), txt(1, 2, 4), txt(2, 2, 5), txt(2, 1, 6), txt(2, 0, 7, 'cur')],
        note: '第 7 步：下边，加入 matrix[2][0] = 7。下边遍历结束。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [done(0, 0), done(0, 1), done(0, 2), done(1, 2), done(2, 2), done(2, 1), done(2, 0), cur(1, 0)],
        gridTexts: [txt(0, 0, 1), txt(0, 1, 2), txt(0, 2, 3), txt(1, 2, 4), txt(2, 2, 5), txt(2, 1, 6), txt(2, 0, 7), txt(1, 0, 8, 'cur')],
        note: '第 8 步：左边 for (i = 1; i > 0; --i)，加入 matrix[1][0] = 4。第 1 圈遍历完成。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [...ring1Done, hl(1, 1)],
        gridTexts: ring1Texts,
        note: '第 1 圈完成，收缩边界：++x1、++y1、--x2、--y2 → x1=1，y1=1，x2=1，y2=1，进入第 2 圈。黄色为中心位置。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [...ring1Done, cur(1, 1)],
        gridTexts: [...ring1Texts, txt(1, 1, 9, 'cur')],
        note: '第 9 步：上边 for (j = 1; j <= 1; ++j)，加入 matrix[1][1] = 5。右边、下边、左边均因 x1 == x2 而跳过。',
    },
    {
        grid: { values: M, rowLabels, colLabels },
        gridStates: [...ring1Done, done(1, 1)],
        gridTexts: [...ring1Texts, txt(1, 1, 9)],
        note: '再次收缩：++x1、++y1、--x2、--y2 → x1=2，y1=2，x2=0，y2=0，x1 > x2 退出 while 循环。ans = [1, 2, 3, 6, 9, 8, 7, 4, 5] ✅',
    },
]
</script>

<!-- problem:start -->

# [54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix)

## 题目描述

<!-- description:start -->

<p>给你一个 <code>m</code> 行 <code>n</code> 列的矩阵 <code>matrix</code> ，请按照 <strong>顺时针螺旋顺序</strong> ，返回矩阵中的所有元素。</p>

<p> </p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104833669.png" alt="image-20240823104833669"  />

<pre>
<strong>输入：</strong>matrix = [[1,2,3],[4,5,6],[7,8,9]]
<strong>输出：</strong>[1,2,3,6,9,8,7,4,5]
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104848002.png" alt="image-20240823104848002"  />
<pre>
<strong>输入：</strong>matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
<strong>输出：</strong>[1,2,3,4,8,12,11,10,9,5,6,7]
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>m == matrix.length</code></li>
	<li><code>n == matrix[i].length</code></li>
	<li><code>1 <= m, n <= 10</code></li>
	<li><code>-100 <= matrix[i][j] <= 100</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：模拟

我们用 $i$ 和 $j$ 分别表示当前访问到的元素的行和列，用 $k$ 表示当前的方向，用数组或哈希表 $vis$ 记录每个元素是否被访问过。每次我们访问到一个元素后，将其标记为已访问，然后按照当前的方向前进一步，如果前进一步后发现越界或者已经访问过，则改变方向继续前进，直到遍历完整个矩阵。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

对于访问过的元素，我们也可以将其值加上一个常数 $300$，这样就不需要额外的 $vis$ 数组或哈希表来记录是否访问过了，从而将空间复杂度降低到 $O(1)$。

### 可视化演示

> 以 `matrix = [[1,2,3],[4,5,6],[7,8,9]]` 为例，演示顺时针螺旋遍历：`dirs = [0,1,0,-1,0]` 控制方向（右→下→左→上），`vis` 记录已访问。格子中的数字为访问顺序号，蓝色为当前访问，绿色为已访问。点击 ▶ 播放，或逐步操作。

<DpViz :steps="spiralSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[] dirs = {0, 1, 0, -1, 0};
        int i = 0, j = 0, k = 0;
        List<Integer> ans = new ArrayList<>();
        boolean[][] vis = new boolean[m][n];
        for (int h = m * n; h > 0; --h) {
            ans.add(matrix[i][j]);
            vis[i][j] = true;
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x < 0 || x >= m || y < 0 || y >= n || vis[x][y]) {
                k = (k + 1) % 4;
            }
            i += dirs[k];
            j += dirs[k + 1];
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        int dirs[5] = {0, 1, 0, -1, 0};
        int i = 0, j = 0, k = 0;
        vector<int> ans;
        bool vis[m][n];
        memset(vis, false, sizeof(vis));
        for (int h = m * n; h; --h) {
            ans.push_back(matrix[i][j]);
            vis[i][j] = true;
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x < 0 || x >= m || y < 0 || y >= n || vis[x][y]) {
                k = (k + 1) % 4;
            }
            i += dirs[k];
            j += dirs[k + 1];
        }
        return ans;
    }
};
```

```ts [TypeScript]
function spiralOrder(matrix: number[][]): number[] {
    const m = matrix.length;
    const n = matrix[0].length;
    const ans: number[] = [];
    const vis = new Array(m).fill(0).map(() => new Array(n).fill(false));
    const dirs = [0, 1, 0, -1, 0];
    for (let h = m * n, i = 0, j = 0, k = 0; h > 0; --h) {
        ans.push(matrix[i][j]);
        vis[i][j] = true;
        const x = i + dirs[k];
        const y = j + dirs[k + 1];
        if (x < 0 || x >= m || y < 0 || y >= n || vis[x][y]) {
            k = (k + 1) % 4;
        }
        i += dirs[k];
        j += dirs[k + 1];
    }
    return ans;
}
```

```python [Python]
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        m, n = len(matrix), len(matrix[0])
        dirs = (0, 1, 0, -1, 0)
        i = j = k = 0
        ans = []
        vis = set()
        for _ in range(m * n):
            ans.append(matrix[i][j])
            vis.add((i, j))
            x, y = i + dirs[k], j + dirs[k + 1]
            if not 0 <= x < m or not 0 <= y < n or (x, y) in vis:
                k = (k + 1) % 4
            i = i + dirs[k]
            j = j + dirs[k + 1]
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：逐层模拟

我们也可以从外往里一圈一圈遍历并存储矩阵元素。

时间复杂度 $O(m \times n)$，空间复杂度 $O(1)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

### 可视化演示

> 以 `matrix = [[1,2,3],[4,5,6],[7,8,9]]` 为例，演示不用 `vis` 的空间优化版本：访问后 `matrix[i][j] += 300` 原地标记，前方 `matrix[x][y] > 100` 即判定已访问并转向。蓝色为当前访问（显示原值），绿色为已访问（显示 +300 后的标记值）。点击 ▶ 播放，或逐步操作。

<DpViz :steps="spiralMarkSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[] dirs = {0, 1, 0, -1, 0};
        List<Integer> ans = new ArrayList<>();
        for (int h = m * n, i = 0, j = 0, k = 0; h > 0; --h) {
            ans.add(matrix[i][j]);
            matrix[i][j] += 300;
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x < 0 || x >= m || y < 0 || y >= n || matrix[x][y] > 100) {
                k = (k + 1) % 4;
            }
            i += dirs[k];
            j += dirs[k + 1];
        }
        // for (int i = 0; i < m; ++i) {
        //     for (int j = 0; j < n; ++j) {
        //         matrix[i][j] -= 300;
        //     }
        // }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        int dirs[5] = {0, 1, 0, -1, 0};
        vector<int> ans;
        for (int h = m * n, i = 0, j = 0, k = 0; h; --h) {
            ans.push_back(matrix[i][j]);
            matrix[i][j] += 300;
            int x = i + dirs[k], y = j + dirs[k + 1];
            if (x < 0 || x >= m || y < 0 || y >= n || matrix[x][y] > 100) {
                k = (k + 1) % 4;
            }
            i += dirs[k];
            j += dirs[k + 1];
        }
        // for (int i = 0; i < m; ++i) {
        //     for (int j = 0; j < n; ++j) {
        //         matrix[i][j] -= 300;
        //     }
        // }
        return ans;
    }
};
```

```ts [TypeScript]
function spiralOrder(matrix: number[][]): number[] {
    const m = matrix.length;
    const n = matrix[0].length;
    const ans: number[] = [];
    const dirs = [0, 1, 0, -1, 0];
    for (let h = m * n, i = 0, j = 0, k = 0; h > 0; --h) {
        ans.push(matrix[i][j]);
        matrix[i][j] += 300;
        const x = i + dirs[k];
        const y = j + dirs[k + 1];
        if (x < 0 || x >= m || y < 0 || y >= n || matrix[x][y] > 100) {
            k = (k + 1) % 4;
        }
        i += dirs[k];
        j += dirs[k + 1];
    }
    // for (let i = 0; i < m; ++i) {
    //     for (let j = 0; j < n; ++j) {
    //         matrix[i][j] -= 300;
    //     }
    // }
    return ans;
}
```

```python [Python]
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        m, n = len(matrix), len(matrix[0])
        dirs = (0, 1, 0, -1, 0)
        i = j = k = 0
        ans = []
        for _ in range(m * n):
            ans.append(matrix[i][j])
            matrix[i][j] += 300
            x, y = i + dirs[k], j + dirs[k + 1]
            if not 0 <= x < m or not 0 <= y < n or matrix[x][y] > 100:
                k = (k + 1) % 4
            i = i + dirs[k]
            j = j + dirs[k + 1]
        # for i in range(m):
        #     for j in range(n):
        #         matrix[i][j] -= 300
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三

### 可视化演示

> 以 `matrix = [[1,2,3],[4,5,6],[7,8,9]]` 为例，演示逐层收缩边界法：用 `x1、y1、x2、y2` 圈定当前层，依次遍历上边、右边、下边、左边后向内收缩。格子中的数字为访问顺序号，蓝色为当前访问，绿色为已访问，黄色为边界角。点击 ▶ 播放，或逐步操作。

<DpViz :steps="spiralLayerSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int x1 = 0, y1 = 0, x2 = m - 1, y2 = n - 1;
        List<Integer> ans = new ArrayList<>();
        while (x1 <= x2 && y1 <= y2) {
            for (int j = y1; j <= y2; ++j) {
                ans.add(matrix[x1][j]);
            }
            for (int i = x1 + 1; i <= x2; ++i) {
                ans.add(matrix[i][y2]);
            }
            if (x1 < x2 && y1 < y2) {
                for (int j = y2 - 1; j >= y1; --j) {
                    ans.add(matrix[x2][j]);
                }
                for (int i = x2 - 1; i > x1; --i) {
                    ans.add(matrix[i][y1]);
                }
            }
            ++x1;
            ++y1;
            --x2;
            --y2;
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        int x1 = 0, y1 = 0, x2 = m - 1, y2 = n - 1;
        vector<int> ans;
        while (x1 <= x2 && y1 <= y2) {
            for (int j = y1; j <= y2; ++j) {
                ans.push_back(matrix[x1][j]);
            }
            for (int i = x1 + 1; i <= x2; ++i) {
                ans.push_back(matrix[i][y2]);
            }
            if (x1 < x2 && y1 < y2) {
                for (int j = y2 - 1; j >= y1; --j) {
                    ans.push_back(matrix[x2][j]);
                }
                for (int i = x2 - 1; i > x1; --i) {
                    ans.push_back(matrix[i][y1]);
                }
            }
            ++x1, ++y1;
            --x2, --y2;
        }
        return ans;
    }
};
```

```ts [TypeScript]
function spiralOrder(matrix: number[][]): number[] {
    const m = matrix.length;
    const n = matrix[0].length;
    let x1 = 0;
    let y1 = 0;
    let x2 = m - 1;
    let y2 = n - 1;
    const ans: number[] = [];
    while (x1 <= x2 && y1 <= y2) {
        for (let j = y1; j <= y2; ++j) {
            ans.push(matrix[x1][j]);
        }
        for (let i = x1 + 1; i <= x2; ++i) {
            ans.push(matrix[i][y2]);
        }
        if (x1 < x2 && y1 < y2) {
            for (let j = y2 - 1; j >= y1; --j) {
                ans.push(matrix[x2][j]);
            }
            for (let i = x2 - 1; i > x1; --i) {
                ans.push(matrix[i][y1]);
            }
        }
        ++x1;
        ++y1;
        --x2;
        --y2;
    }
    return ans;
}
```

```python [Python]
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        m, n = len(matrix), len(matrix[0])
        x1, y1, x2, y2 = 0, 0, m - 1, n - 1
        ans = []
        while x1 <= x2 and y1 <= y2:
            for j in range(y1, y2 + 1):
                ans.append(matrix[x1][j])
            for i in range(x1 + 1, x2 + 1):
                ans.append(matrix[i][y2])
            if x1 < x2 and y1 < y2:
                for j in range(y2 - 1, y1 - 1, -1):
                    ans.append(matrix[x2][j])
                for i in range(x2 - 1, x1, -1):
                    ans.append(matrix[i][y1])
            x1, y1 = x1 + 1, y1 + 1
            x2, y2 = x2 - 1, y2 - 1
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->