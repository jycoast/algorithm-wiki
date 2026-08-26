---
comments: true
difficulty: 中等
tags:
  - 数组
  - 二分查找
  - 分治
  - 矩阵
entry: searchMatrix
testcases:
  - input:
      - - - 1
          - 4
          - 7
          - 11
          - 15
        - - 2
          - 5
          - 8
          - 12
          - 19
        - - 3
          - 6
          - 9
          - 16
          - 22
        - - 10
          - 13
          - 14
          - 17
          - 24
        - - 18
          - 21
          - 23
          - 26
          - 30
      - 5
    output: true
  - input:
      - - - 1
          - 4
          - 7
          - 11
          - 15
        - - 2
          - 5
          - 8
          - 12
          - 19
        - - 3
          - 6
          - 9
          - 16
          - 22
        - - 10
          - 13
          - 14
          - 17
          - 24
        - - 18
          - 21
          - 23
          - 26
          - 30
      - 20
    output: false
---


<script setup>
// 方法一（逐行二分查找）可视化：matrix 5×5，target = 5
// 对每一行做二分查找（left/right/mid），找第一个 >= target 的元素并判断是否等于 target
const M1 = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
    [10, 13, 14, 17, 24],
    [18, 21, 23, 26, 30],
]
const rowLabels = ['0', '1', '2', '3', '4']
const colLabels = ['0', '1', '2', '3', '4']
const grid1 = { values: M1, rowLabels, colLabels }
// 第 r 行 c0..c1 列标记为 state；rowRangeEx 跳过 mid 所在列 c（避免与 cur 重叠）
const rowRange = (r, c0, c1, state) => {
    const s = []
    for (let c = c0; c <= c1; c++) s.push({ r, c, state })
    return s
}
const rowRangeEx = (r, c0, c1, exC, state) => {
    const s = []
    for (let c = c0; c <= c1; c++) if (c !== exC) s.push({ r, c, state })
    return s
}
const rowAll = (r, state) => rowRange(r, 0, 4, state)
const binarySearchSteps = [
    {
        grid: grid1,
        note: '目标 target = 5。方法一：依次对每一行做二分查找，找到第一个 ≥ target 的元素，再判断它是否等于 target。从第 0 行开始。',
    },
    {
        grid: grid1,
        gridStates: rowAll(0, 'hl'),
        note: '第 0 行 [1,4,7,11,15]：left = 0，right = n = 5，开始二分查找。',
    },
    {
        grid: grid1,
        gridStates: [...rowRangeEx(0, 0, 4, 2, 'hl'), { r: 0, c: 2, state: 'cur' }],
        gridTexts: [{ r: 0, c: 2, text: '7' }],
        gridPointers: [{ r: 0, c: 2, label: 'mid' }],
        note: 'mid = (0+5)>>1 = 2，matrix[0][2] = 7 ≥ target = 5，目标在左半部分，right = 2。',
    },
    {
        grid: grid1,
        gridStates: [...rowRangeEx(0, 0, 1, 1, 'hl'), { r: 0, c: 1, state: 'cur' }],
        gridTexts: [{ r: 0, c: 1, text: '4' }],
        gridPointers: [{ r: 0, c: 1, label: 'mid' }],
        note: 'mid = (0+2)>>1 = 1，matrix[0][1] = 4 < 5，目标在右半部分，left = mid + 1 = 2。',
    },
    {
        grid: grid1,
        gridStates: rowAll(0, 'done'),
        note: 'left = 2 与 right = 2 相等，循环结束。left ≠ n（5）且 matrix[0][2] = 7 ≠ 5，第 0 行未找到，标记为已排除，继续搜索下一行。',
    },
    {
        grid: grid1,
        gridStates: [...rowAll(0, 'done'), ...rowAll(1, 'hl')],
        note: '第 1 行 [2,5,8,12,19]：left = 0，right = n = 5，开始二分查找。',
    },
    {
        grid: grid1,
        gridStates: [...rowAll(0, 'done'), ...rowRangeEx(1, 0, 4, 2, 'hl'), { r: 1, c: 2, state: 'cur' }],
        gridTexts: [{ r: 1, c: 2, text: '8' }],
        gridPointers: [{ r: 1, c: 2, label: 'mid' }],
        note: 'mid = (0+5)>>1 = 2，matrix[1][2] = 8 ≥ 5，right = 2。',
    },
    {
        grid: grid1,
        gridStates: [...rowAll(0, 'done'), ...rowRangeEx(1, 0, 1, 1, 'hl'), { r: 1, c: 1, state: 'cur' }],
        gridTexts: [{ r: 1, c: 1, text: '5' }],
        gridPointers: [{ r: 1, c: 1, label: 'mid' }],
        note: 'mid = (0+2)>>1 = 1，matrix[1][1] = 5 ≥ 5，right = 1。',
    },
    {
        grid: grid1,
        gridStates: [...rowAll(0, 'done'), { r: 1, c: 0, state: 'cur' }],
        gridTexts: [{ r: 1, c: 0, text: '2' }],
        gridPointers: [{ r: 1, c: 0, label: 'mid' }],
        note: 'mid = (0+1)>>1 = 0，matrix[1][0] = 2 < 5，left = mid + 1 = 1。',
    },
    {
        grid: grid1,
        gridStates: [...rowAll(0, 'done'), { r: 1, c: 1, state: 'mark' }],
        gridTexts: [{ r: 1, c: 1, text: '5' }],
        gridPointers: [{ r: 1, c: 1, label: 'mid' }],
        note: 'left = 1 与 right = 1 相等，循环结束。left ≠ n（5）且 matrix[1][1] = 5 == target，找到目标，返回 true ✅。',
    },
]

// 方法二（左下角 Z 字搜索）可视化：从 (m-1, 0) 出发，target = 5
const M2 = M1
const grid2 = { values: M2, rowLabels, colLabels }
// 将 r0..r1 行、c0..c1 列全部标记为 state
const block = (state, r0, r1, c0, c1) => {
    const s = []
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) s.push({ r, c, state })
    return s
}
// 当前比较位置：i,j 指针 + cur 状态（gridTexts 保留格子数值以承载指针）
const curAt = (r, c) => ({
    gridStates: [{ r, c, state: 'cur' }],
    gridTexts: [{ r, c, text: String(M2[r][c]) }],
    gridPointers: [{ r, c, label: 'i,j' }],
})
const zSteps = [
    {
        grid: grid2,
        ...curAt(4, 0),
        note: '目标 target = 5。方法二：从左下角出发，i = m - 1 = 4，j = 0。当前 matrix[4][0] = 18，与 target 比较。',
    },
    {
        grid: grid2,
        gridStates: [...curAt(3, 0).gridStates, ...block('done', 4, 4, 0, 4)],
        gridTexts: curAt(3, 0).gridTexts,
        gridPointers: curAt(3, 0).gridPointers,
        note: 'matrix[4][0] = 18 > 5：第 4 行从左到右递增、均大于 5，排除整行（绿色），i 上移 --i → i = 3。现比较 matrix[3][0] = 10。',
    },
    {
        grid: grid2,
        gridStates: [...curAt(2, 0).gridStates, ...block('done', 3, 4, 0, 4)],
        gridTexts: curAt(2, 0).gridTexts,
        gridPointers: curAt(2, 0).gridPointers,
        note: 'matrix[3][0] = 10 > 5：排除第 3 行（绿色），i 上移 --i → i = 2。现比较 matrix[2][0] = 3。',
    },
    {
        grid: grid2,
        gridStates: [...curAt(2, 1).gridStates, ...block('done', 3, 4, 0, 4), ...block('done', 0, 2, 0, 0)],
        gridTexts: curAt(2, 1).gridTexts,
        gridPointers: curAt(2, 1).gridPointers,
        note: 'matrix[2][0] = 3 < 5：第 0 列从上到下递增、均小于 5，排除第 0 列剩余部分（第 0~2 行，绿色），j 右移 ++j → j = 1。现比较 matrix[2][1] = 6。',
    },
    {
        grid: grid2,
        gridStates: [...curAt(1, 1).gridStates, ...block('done', 3, 4, 0, 4), ...block('done', 0, 2, 0, 0), ...block('done', 2, 2, 1, 4)],
        gridTexts: curAt(1, 1).gridTexts,
        gridPointers: curAt(1, 1).gridPointers,
        note: 'matrix[2][1] = 6 > 5：排除第 2 行第 1~4 列（绿色），i 上移 --i → i = 1。现比较 matrix[1][1] = 5。',
    },
    {
        grid: grid2,
        gridStates: [...block('done', 3, 4, 0, 4), ...block('done', 0, 2, 0, 0), ...block('done', 2, 2, 1, 4), { r: 1, c: 1, state: 'mark' }],
        gridTexts: [{ r: 1, c: 1, text: '5' }],
        gridPointers: [{ r: 1, c: 1, label: 'i,j' }],
        note: 'matrix[1][1] = 5 == target = 5，找到目标，返回 true ✅。绿色为已排除的行/列区域，剩余搜索区域已收缩到目标格子。',
    },
]
</script>

<!-- problem:start -->

# [240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii)

## 题目描述

<!-- description:start -->

<p>编写一个高效的算法来搜索&nbsp;<code><em>m</em>&nbsp;x&nbsp;<em>n</em></code>&nbsp;矩阵 <code>matrix</code> 中的一个目标值 <code>target</code> 。该矩阵具有以下特性：</p>

<ul>
	<li>每行的元素从左到右升序排列。</li>
	<li>每列的元素从上到下升序排列。</li>
</ul>

<p>&nbsp;</p>

<p><b>示例 1：</b></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104638915.png" alt="image-20240823104638915" style="zoom: 80%;" />

<pre>
<b>输入：</b>matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
<b>输出：</b>true
</pre>

<p><b>示例 2：</b></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104659791.png" alt="image-20240823104659791" style="zoom:80%;" />
<pre>
<b>输入：</b>matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
<b>输出：</b>false
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>m == matrix.length</code></li>
	<li><code>n == matrix[i].length</code></li>
	<li><code>1 &lt;= n, m &lt;= 300</code></li>
	<li><code>-10<sup>9</sup>&nbsp;&lt;= matrix[i][j] &lt;= 10<sup>9</sup></code></li>
	<li>每行的所有元素从左到右升序排列</li>
	<li>每列的所有元素从上到下升序排列</li>
	<li><code>-10<sup>9</sup>&nbsp;&lt;= target &lt;= 10<sup>9</sup></code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：二分查找

由于每一行的所有元素升序排列，因此，对于每一行，我们可以使用二分查找找到第一个大于等于 `target` 的元素，然后判断该元素是否等于 `target`。如果等于 `target`，说明找到了目标值，直接返回 `true`。如果不等于 `target`，说明这一行的所有元素都小于 `target`，应该继续搜索下一行。

如果所有行都搜索完了，都没有找到目标值，说明目标值不存在，返回 `false`。

时间复杂度 $O(m \times \log n)$，其中 $m$ 和 $n$ 分别为矩阵的行数和列数。空间复杂度 $O(1)$。

### 可视化演示

> 以 5×5 矩阵、`target = 5` 为例，演示方法一「逐行二分查找」：黄色为当前查找区间，蓝色为正在比较的 `mid` 元素，绿色为已排除的行，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="binarySearchSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        for (var row : matrix) {
            int j = Arrays.binarySearch(row, target);
            if (j >= 0) {
                return true;
            }
        }
        return false;
    }
}
```



```cpp [C++]
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        for (auto& row : matrix) {
            int j = lower_bound(row.begin(), row.end(), target) - row.begin();
            if (j < matrix[0].size() && row[j] == target) {
                return true;
            }
        }
        return false;
    }
};
```


```ts [TypeScript]
function searchMatrix(matrix: number[][], target: number): boolean {
    const n = matrix[0].length;
    for (const row of matrix) {
        let left = 0,
            right = n;
        while (left < right) {
            const mid = (left + right) >> 1;
            if (row[mid] >= target) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        if (left != n && row[left] == target) {
            return true;
        }
    }
    return false;
}
```

```python [Python]
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        for row in matrix:
            j = bisect_left(row, target)
            if j < len(matrix[0]) and row[j] == target:
                return True
        return False
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：从左下角或右上角搜索

这里我们以左下角作为起始搜索点，往右上方向开始搜索，比较当前元素 `matrix[i][j]`与 `target` 的大小关系：

-   若 $\textit{matrix}[i][j] = \textit{target}$，说明找到了目标值，直接返回 `true`。
-   若 $\textit{matrix}[i][j] > \textit{target}$，说明这一列从当前位置开始往上的所有元素均大于 `target`，应该让 $i$ 指针往上移动，即 $i \leftarrow i - 1$。
-   若 $\textit{matrix}[i][j] < \textit{target}$，说明这一行从当前位置开始往右的所有元素均小于 `target`，应该让 $j$ 指针往右移动，即 $j \leftarrow j + 1$。

若搜索结束依然找不到 `target`，返回 `false`。

时间复杂度 $O(m + n)$，其中 $m$ 和 $n$ 分别为矩阵的行数和列数。空间复杂度 $O(1)$。

### 可视化演示

> 以 5×5 矩阵、`target = 5` 为例，演示方法二「左下角 Z 字搜索」：蓝色为当前比较节点 `matrix[i][j]`，绿色为已排除的行/列区域，红色为答案。每次比较后按大小关系决定向上移动 `--i` 还是向右移动 `++j`。点击 ▶ 播放，或逐步操作。

<DpViz :steps="zSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int i = m - 1, j = 0;
        while (i >= 0 && j < n) {
            if (matrix[i][j] == target) {
                return true;
            }
            if (matrix[i][j] > target) {
                --i;
            } else {
                ++j;
            }
        }
        return false;
    }
}
```

```cpp [C++]
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int i = m - 1, j = 0;
        while (i >= 0 && j < n) {
            if (matrix[i][j] == target) {
                return true;
            }
            if (matrix[i][j] > target) {
                --i;
            } else {
                ++j;
            }
        }
        return false;
    }
};
```

```ts [TypeScript]
function searchMatrix(matrix: number[][], target: number): boolean {
    const [m, n] = [matrix.length, matrix[0].length];
    let [i, j] = [m - 1, 0];
    while (i >= 0 && j < n) {
        if (matrix[i][j] === target) {
            return true;
        }
        if (matrix[i][j] > target) {
            --i;
        } else {
            ++j;
        }
    }
    return false;
}
```

```python [Python]
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        i, j = m - 1, 0
        while i >= 0 and j < n:
            if matrix[i][j] == target:
                return True
            if matrix[i][j] > target:
                i -= 1
            else:
                j += 1
        return False
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->