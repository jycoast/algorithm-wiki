---
comments: true
difficulty: 中等

tags:
    - 数组
    - 回溯
---

<script setup>
// 方法一（DFS 回溯）可视化：nums = [1, 2, 3]
// rows[0] 为原数组 nums，rows[1] 为当前排列 t（空位用 '' 占位），rows[2] 为已选标记 vis
const permuteSteps = [
  { rows: [[1, 2, 3], ['', '', ''], [0, 0, 0]], rowPointers: [{ row: 1, col: 0, label: 'i' }], note: 'nums = [1,2,3]，n=3。t 为空，vis 全为 false。调用 dfs(0) 填充第 0 个位置。' },
  { rows: [[1, 2, 3], [1, '', ''], [1, 0, 0]], rowPointers: [{ row: 1, col: 0, label: 'i' }, { row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 2, cols: [0] }, { row: 1, cols: [0] }], note: 'dfs(0)：j=0，vis[0]=false → 选 nums[0]=1，置 vis[0]=true，放入 t[0]=1。递归 dfs(1)。' },
  { rows: [[1, 2, 3], [1, 2, ''], [1, 1, 0]], rowPointers: [{ row: 1, col: 1, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 2, cols: [1] }, { row: 1, cols: [1] }], note: 'dfs(1)：j=0 的 nums[0] 已被选跳过；j=1，vis[1]=false → 选 nums[1]=2，置 vis[1]=true，放入 t[1]=2。递归 dfs(2)。' },
  { rows: [[1, 2, 3], [1, 2, 3], [1, 1, 1]], rowPointers: [{ row: 1, col: 2, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 2, cols: [2] }, { row: 1, cols: [2] }], note: 'dfs(2)：j=0、1 已被选跳过；j=2，vis[2]=false → 选 nums[2]=3，置 vis[2]=true，放入 t[2]=3。递归 dfs(3)。' },
  { rows: [[1, 2, 3], [1, 2, 3], [1, 1, 1]], rowHighlight: [{ row: 1, cols: [0, 1, 2] }], note: 'i=3 == n → 完整排列 t=[1,2,3] 加入 ans。return，开始回溯。' },
  { rows: [[1, 2, 3], [1, 3, ''], [1, 0, 1]], rowPointers: [{ row: 1, col: 1, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 2, cols: [2] }, { row: 1, cols: [1] }], note: '回溯：移除 t[2]=3、vis[2]=false，dfs(2) 结束返回；再移除 t[1]=2、vis[1]=false。回到 dfs(1) 循环，j=2，vis[2]=false → 选 nums[2]=3，t[1]=3。递归 dfs(2)。' },
  { rows: [[1, 2, 3], [1, 3, 2], [1, 1, 1]], rowPointers: [{ row: 1, col: 2, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 2, cols: [1] }, { row: 1, cols: [2] }], note: 'dfs(2)：j=1，vis[1]=false → 选 nums[1]=2，置 vis[1]=true，放入 t[2]=2。递归 dfs(3)。' },
  { rows: [[1, 2, 3], [1, 3, 2], [1, 1, 1]], rowHighlight: [{ row: 1, cols: [0, 1, 2] }], note: 'i=3 == n → 完整排列 t=[1,3,2] 加入 ans。return。' },
  { rows: [[1, 2, 3], [2, '', ''], [0, 1, 0]], rowPointers: [{ row: 1, col: 0, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 2, cols: [1] }, { row: 1, cols: [0] }], note: '回溯：移除 t[2]=2、t[1]=3、t[0]=1 及对应 vis。回到 dfs(0) 循环，j=1，vis[1]=false → 选 nums[1]=2，t[0]=2。递归 dfs(1)。' },
  { rows: [[1, 2, 3], [2, 1, ''], [1, 1, 0]], rowPointers: [{ row: 1, col: 1, label: 'i' }, { row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 2, cols: [0] }, { row: 1, cols: [1] }], note: 'dfs(1)：j=0，vis[0]=false → 选 nums[0]=1，置 vis[0]=true，放入 t[1]=1。递归 dfs(2)。' },
  { rows: [[1, 2, 3], [2, 1, 3], [1, 1, 1]], rowPointers: [{ row: 1, col: 2, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 2, cols: [2] }, { row: 1, cols: [2] }], note: 'dfs(2)：j=2，vis[2]=false → 选 nums[2]=3，置 vis[2]=true，放入 t[2]=3。递归 dfs(3)。' },
  { rows: [[1, 2, 3], [2, 1, 3], [1, 1, 1]], rowHighlight: [{ row: 1, cols: [0, 1, 2] }], note: 'i=3 == n → 完整排列 t=[2,1,3] 加入 ans。return。' },
  { rows: [[1, 2, 3], [2, 3, ''], [0, 1, 1]], rowPointers: [{ row: 1, col: 1, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 2, cols: [2] }, { row: 1, cols: [1] }], note: '回溯：移除 t[2]=3、vis[2]=false，dfs(2) 返回；再移除 t[1]=1、vis[0]=false。回到 dfs(1) 循环，j=2，vis[2]=false → 选 nums[2]=3，t[1]=3。递归 dfs(2)。' },
  { rows: [[1, 2, 3], [2, 3, 1], [1, 1, 1]], rowPointers: [{ row: 1, col: 2, label: 'i' }, { row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 2, cols: [0] }, { row: 1, cols: [2] }], note: 'dfs(2)：j=0，vis[0]=false → 选 nums[0]=1，置 vis[0]=true，放入 t[2]=1。递归 dfs(3)。' },
  { rows: [[1, 2, 3], [2, 3, 1], [1, 1, 1]], rowHighlight: [{ row: 1, cols: [0, 1, 2] }], note: 'i=3 == n → 完整排列 t=[2,3,1] 加入 ans。return。' },
  { rows: [[1, 2, 3], [3, '', ''], [0, 0, 1]], rowPointers: [{ row: 1, col: 0, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 2, cols: [2] }, { row: 1, cols: [0] }], note: '回溯：移除 t[2]=1、t[1]=3、t[0]=2 及对应 vis。回到 dfs(0) 循环，j=2，vis[2]=false → 选 nums[2]=3，t[0]=3。递归 dfs(1)。' },
  { rows: [[1, 2, 3], [3, 1, ''], [1, 0, 1]], rowPointers: [{ row: 1, col: 1, label: 'i' }, { row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 2, cols: [0] }, { row: 1, cols: [1] }], note: 'dfs(1)：j=0，vis[0]=false → 选 nums[0]=1，置 vis[0]=true，放入 t[1]=1。递归 dfs(2)。' },
  { rows: [[1, 2, 3], [3, 1, 2], [1, 1, 1]], rowPointers: [{ row: 1, col: 2, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 2, cols: [1] }, { row: 1, cols: [2] }], note: 'dfs(2)：j=1，vis[1]=false → 选 nums[1]=2，置 vis[1]=true，放入 t[2]=2。递归 dfs(3)。' },
  { rows: [[1, 2, 3], [3, 1, 2], [1, 1, 1]], rowHighlight: [{ row: 1, cols: [0, 1, 2] }], note: 'i=3 == n → 完整排列 t=[3,1,2] 加入 ans。return。' },
  { rows: [[1, 2, 3], [3, 2, ''], [0, 1, 1]], rowPointers: [{ row: 1, col: 1, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 2, cols: [1] }, { row: 1, cols: [1] }], note: '回溯：移除 t[2]=2、vis[1]=false，dfs(2) 返回；再移除 t[1]=1、vis[0]=false。回到 dfs(1) 循环，j=1，vis[1]=false → 选 nums[1]=2，t[1]=2。递归 dfs(2)。' },
  { rows: [[1, 2, 3], [3, 2, 1], [1, 1, 1]], rowPointers: [{ row: 1, col: 2, label: 'i' }, { row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 2, cols: [0] }, { row: 1, cols: [2] }], note: 'dfs(2)：j=0，vis[0]=false → 选 nums[0]=1，置 vis[0]=true，放入 t[2]=1。递归 dfs(3)。' },
  { rows: [[1, 2, 3], [3, 2, 1], [1, 1, 1]], rowHighlight: [{ row: 1, cols: [0, 1, 2] }], note: 'i=3 == n → 完整排列 t=[3,2,1] 加入 ans。return。' },
  { rows: [[1, 2, 3], ['', '', ''], [0, 0, 0]], note: '回溯：移除 t[2]=1、t[1]=2、t[0]=3 及对应 vis。全部回溯完成 → ans = [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] ✅' },
]
</script>

<!-- problem:start -->

# [46. 全排列](https://leetcode.cn/problems/permutations)

## 题目描述

<!-- description:start -->

<p>给定一个不含重复数字的数组 <code>nums</code> ，返回其 <em>所有可能的全排列</em> 。你可以 <strong>按任意顺序</strong> 返回答案。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [1,2,3]
<strong>输出：</strong>[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [0,1]
<strong>输出：</strong>[[0,1],[1,0]]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [1]
<strong>输出：</strong>[[1]]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 6</code></li>
	<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
	<li><code>nums</code> 中的所有整数 <strong>互不相同</strong></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：DFS（回溯）

我们设计一个函数 $dfs(i)$ 表示已经填完了前 $i$ 个位置，现在需要填第 $i+1$ 个位置。枚举所有可能的数，如果这个数没有被填过，就填入这个数，然后继续填下一个位置，直到填完所有的位置。

时间复杂度 $O(n \times n!)$，其中 $n$ 是数组的长度。一共有 $n!$ 个排列，每个排列需要 $O(n)$ 的时间来构造。

相似题目：

-   [47. 全排列 II](https://github.com/doocs/leetcode/blob/main/solution/0000-0099/0047.Permutations%20II/README.md)

### 可视化演示

> 以 `nums = [1, 2, 3]` 为例，演示 DFS 回溯：上方为原数组 `nums`，中间为当前排列 `t`（空位为空白），下方为已选标记 `vis`。`i` 指向待填充位置，`j` 指向候选元素，黄色高亮表示刚选中的元素/位置。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="permuteSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> t = new ArrayList<>();
    private boolean[] vis;
    private int[] nums;

    public List<List<Integer>> permute(int[] nums) {
        this.nums = nums;
        vis = new boolean[nums.length];
        dfs(0);
        return ans;
    }

    private void dfs(int i) {
        if (i == nums.length) {
            ans.add(new ArrayList<>(t));
            return;
        }
        for (int j = 0; j < nums.length; ++j) {
            if (!vis[j]) {
                vis[j] = true;
                t.add(nums[j]);
                dfs(i + 1);
                t.remove(t.size() - 1);
                vis[j] = false;
            }
        }
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        int n = nums.size();
        vector<vector<int>> ans;
        vector<int> t(n);
        vector<bool> vis(n);
        function<void(int)> dfs = [&](int i) {
            if (i == n) {
                ans.emplace_back(t);
                return;
            }
            for (int j = 0; j < n; ++j) {
                if (!vis[j]) {
                    vis[j] = true;
                    t[i] = nums[j];
                    dfs(i + 1);
                    vis[j] = false;
                }
            }
        };
        dfs(0);
        return ans;
    }
};
```

```ts [TypeScript]
function permute(nums: number[]): number[][] {
    const n = nums.length;
    const res: number[][] = [];
    const dfs = (i: number) => {
        if (i === n) {
            res.push([...nums]);
        }
        for (let j = i; j < n; j++) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            dfs(i + 1);
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    };
    dfs(0);
    return res;
}
```

```python [Python]
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        def dfs(i):
            if i == n:
                ans.append(t[:])
                return
            for j in range(n):
                if not vis[j]:
                    vis[j] = True
                    t[i] = nums[j]
                    dfs(i + 1)
                    vis[j] = False

        n = len(nums)
        vis = [False] * n
        t = [0] * n
        ans = []
        dfs(0)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->