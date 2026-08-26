---
comments: true
difficulty: 中等
tags:
  - 位运算
  - 数组
  - 回溯
entry: subsets
testcases:
  - input:
      - - 1
        - 2
        - 3
    output:
      - []
      - - 1
      - - 2
      - - 1
        - 2
      - - 3
      - - 1
        - 3
      - - 2
        - 3
      - - 1
        - 2
        - 3
    unordered: true
  - input:
      - - 0
    output:
      - []
      - - 0
    unordered: true
---


<script setup>
// 方法一（DFS 回溯）可视化：nums=[1,2,3]
// rows 三行：row0=nums，row1=t（当前路径），row2=ans（结果集合）
const subsets1Steps = [
  { rows: [[1, 2, 3], [], []], rowPointers: [{ row: 0, col: 0, label: 'i' }], note: 'nums=[1,2,3]。调用 dfs(0)。每次进入 dfs(i)：若 i==n 把 t 加入 ans；否则先"不选 nums[i]"递归 dfs(i+1)，再"选 nums[i]"递归 dfs(i+1)，递归后从 t 移除该元素（回溯）。' },
  { rows: [[1, 2, 3], [], []], rowPointers: [{ row: 0, col: 1, label: 'i' }], note: '不选 nums[0]=1：递归 dfs(1)，指针移到 i=1，t 不变。' },
  { rows: [[1, 2, 3], [], []], rowPointers: [{ row: 0, col: 2, label: 'i' }], note: '不选 nums[1]=2：递归 dfs(2)，指针移到 i=2，t 不变。' },
  { rows: [[1, 2, 3], [], ['[]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 2, cols: [0] }], note: '不选 nums[2]=3：递归 dfs(3)，i==n==3，把 t=[] 加入 ans。ans=[[]]。' },
  { rows: [[1, 2, 3], [3], ['[]', '[3]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }, { row: 2, cols: [1] }], note: '回到 dfs(2)：选 nums[2]=3，t=[3]，递归 dfs(3)：记录 [3]。ans=[[],[3]]。' },
  { rows: [[1, 2, 3], [], ['[]', '[3]']], note: '回溯：t.remove 撤销 3 → t=[]，dfs(2) 完成。' },
  { rows: [[1, 2, 3], [2], ['[]', '[3]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '回到 dfs(1)：选 nums[1]=2，t=[2]，递归 dfs(2)。' },
  { rows: [[1, 2, 3], [2], ['[]', '[3]', '[2]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 2, cols: [2] }], note: 'dfs(2)：不选 3，递归 dfs(3)：记录 [2]。ans=[[],[3],[2]]。' },
  { rows: [[1, 2, 3], [2, 3], ['[]', '[3]', '[2]', '[2,3]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }, { row: 2, cols: [3] }], note: 'dfs(2)：选 3，t=[2,3]，递归 dfs(3)：记录 [2,3]。ans=[[],[3],[2],[2,3]]。' },
  { rows: [[1, 2, 3], [], ['[]', '[3]', '[2]', '[2,3]']], note: '回溯：撤销 3 → t=[2]，再撤销 2 → t=[]，dfs(1) 的"不选"分支完成。' },
  { rows: [[1, 2, 3], [1], ['[]', '[3]', '[2]', '[2,3]']], rowPointers: [{ row: 0, col: 0, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '回到 dfs(0)：选 nums[0]=1，t=[1]，递归 dfs(1)。' },
  { rows: [[1, 2, 3], [1], ['[]', '[3]', '[2]', '[2,3]', '[1]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 2, cols: [4] }], note: 'dfs(1)：不选 2，递归 dfs(2)：不选 3，dfs(3) 记录 [1]。ans 增加 [1]。' },
  { rows: [[1, 2, 3], [1, 3], ['[]', '[3]', '[2]', '[2,3]', '[1]', '[1,3]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }, { row: 2, cols: [5] }], note: 'dfs(2)：选 3，t=[1,3]，记录 [1,3]。ans 增加 [1,3]。' },
  { rows: [[1, 2, 3], [1], ['[]', '[3]', '[2]', '[2,3]', '[1]', '[1,3]']], note: '回溯：撤销 3 → t=[1]，dfs(1) 的"不选"分支完成。' },
  { rows: [[1, 2, 3], [1, 2], ['[]', '[3]', '[2]', '[2,3]', '[1]', '[1,3]', '[1,2]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }, { row: 2, cols: [6] }], note: 'dfs(1)：选 nums[1]=2，t=[1,2]，递归 dfs(2)：不选 3，记录 [1,2]。' },
  { rows: [[1, 2, 3], [1, 2, 3], ['[]', '[3]', '[2]', '[2,3]', '[1]', '[1,3]', '[1,2]', '[1,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 1, cols: [2] }, { row: 2, cols: [7] }], note: 'dfs(2)：选 3，t=[1,2,3]，记录 [1,2,3]。共 8 个子集。' },
  { rows: [[1, 2, 3], [], ['[]', '[3]', '[2]', '[2,3]', '[1]', '[1,3]', '[1,2]', '[1,2,3]']], note: '回溯：撤销 3 → t=[1,2]，撤销 2 → t=[1]，撤销 1 → t=[]。全部子集生成完毕 ✅。' },
]

// 方法二（二进制枚举）可视化：nums=[1,2,3]，mask 从 0 到 2^n-1
const subsets2Steps = [
  { rows: [[1, 2, 3], [], ['[]']], rowHighlight: [{ row: 2, cols: [0] }], note: 'mask=0（二进制 000）：所有位为 0，不选任何元素 → t=[]，加入 ans。ans=[[]]。' },
  { rows: [[1, 2, 3], [1], ['[]', '[1]']], rowHighlight: [{ row: 0, cols: [0] }, { row: 1, cols: [0] }, { row: 2, cols: [1] }], note: 'mask=1（001）：第 0 位为 1 → 选 nums[0]=1，t=[1]，加入 ans。' },
  { rows: [[1, 2, 3], [2], ['[]', '[1]', '[2]']], rowHighlight: [{ row: 0, cols: [1] }, { row: 1, cols: [0] }, { row: 2, cols: [2] }], note: 'mask=2（010）：第 1 位为 1 → 选 nums[1]=2，t=[2]，加入 ans。' },
  { rows: [[1, 2, 3], [1, 2], ['[]', '[1]', '[2]', '[1,2]']], rowHighlight: [{ row: 0, cols: [0, 1] }, { row: 1, cols: [0, 1] }, { row: 2, cols: [3] }], note: 'mask=3（011）：第 0、1 位为 1 → 选 1、2，t=[1,2]，加入 ans。' },
  { rows: [[1, 2, 3], [3], ['[]', '[1]', '[2]', '[1,2]', '[3]']], rowHighlight: [{ row: 0, cols: [2] }, { row: 1, cols: [0] }, { row: 2, cols: [4] }], note: 'mask=4（100）：第 2 位为 1 → 选 nums[2]=3，t=[3]，加入 ans。' },
  { rows: [[1, 2, 3], [1, 3], ['[]', '[1]', '[2]', '[1,2]', '[3]', '[1,3]']], rowHighlight: [{ row: 0, cols: [0, 2] }, { row: 1, cols: [0, 1] }, { row: 2, cols: [5] }], note: 'mask=5（101）：第 0、2 位为 1 → 选 1、3，t=[1,3]，加入 ans。' },
  { rows: [[1, 2, 3], [2, 3], ['[]', '[1]', '[2]', '[1,2]', '[3]', '[1,3]', '[2,3]']], rowHighlight: [{ row: 0, cols: [1, 2] }, { row: 1, cols: [0, 1] }, { row: 2, cols: [6] }], note: 'mask=6（110）：第 1、2 位为 1 → 选 2、3，t=[2,3]，加入 ans。' },
  { rows: [[1, 2, 3], [1, 2, 3], ['[]', '[1]', '[2]', '[1,2]', '[3]', '[1,3]', '[2,3]', '[1,2,3]']], rowHighlight: [{ row: 0, cols: [0, 1, 2] }, { row: 1, cols: [0, 1, 2] }, { row: 2, cols: [7] }], note: 'mask=7（111）：所有位为 1 → 选 1、2、3，t=[1,2,3]，加入 ans。共 8 个子集 ✅。' },
]

// 方法三（迭代扩展）可视化：nums=[1,2,3]
const subsets3Steps = [
  { rows: [[1, 2, 3], ['[]']], rowPointers: [{ row: 0, col: 0, label: 'x' }], note: 'res=[[]] 初始化。遍历 nums 中的每个元素 x，把 res 中每个已有子集追加 x 生成新子集。' },
  { rows: [[1, 2, 3], ['[]', '[1]']], rowPointers: [{ row: 0, col: 0, label: 'x' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'x=1：res 中 [[]] 追加 1 → 新增 [1]。res=[[],[1]]。' },
  { rows: [[1, 2, 3], ['[]', '[1]', '[2]', '[1,2]']], rowPointers: [{ row: 0, col: 1, label: 'x' }], rowHighlight: [{ row: 1, cols: [2, 3] }], note: 'x=2：res 中 [] 和 [1] 分别追加 2 → 新增 [2]、[1,2]。res 变为 4 个。' },
  { rows: [[1, 2, 3], ['[]', '[1]', '[2]', '[1,2]', '[3]', '[1,3]', '[2,3]', '[1,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'x' }], rowHighlight: [{ row: 1, cols: [4, 5, 6, 7] }], note: 'x=3：res 中 4 个子集分别追加 3 → 新增 [3]、[1,3]、[2,3]、[1,2,3]。共 8 个子集 ✅。' },
]
</script>

<!-- problem:start -->

# [78. 子集](https://leetcode.cn/problems/subsets)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组&nbsp;<code>nums</code> ，数组中的元素 <strong>互不相同</strong> 。返回该数组所有可能的<span data-keyword="subset">子集</span>（幂集）。</p>

<p>解集 <strong>不能</strong> 包含重复的子集。你可以按 <strong>任意顺序</strong> 返回解集。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [1,2,3]
<strong>输出：</strong>[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [0]
<strong>输出：</strong>[[],[0]]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10</code></li>
	<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>
	<li><code>nums</code> 中的所有元素 <strong>互不相同</strong></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：DFS(回溯)

我们设计一个函数 $dfs(i)$，表示从数组的第 $i$ 个元素开始搜索所有子集。函数 $dfs(i)$ 的执行逻辑如下：

-   如果 $i=n$，表示当前已经搜索结束，将当前得到的子集 $t$ 加入答案数组 $ans$ 中，然后返回；
-   否则，我们可以选择不选择当前元素，直接执行 $dfs(i+1)$；也可以选择当前元素，即把当前元素 $nums[i]$ 加入子集 $t$，然后执行 $dfs(i+1)$，注意要在执行 $dfs(i+1)$ 以后再将 $nums[i]$ 从子集 $t$ 中移除（回溯）。

在主函数中，我们调用 $dfs(0)$，即从数组的第一个元素开始搜索所有子集。最后返回答案数组 $ans$ 即可。

时间复杂度 $O(n\times 2^n)$，空间复杂度 $O(n)$。其中 $n$ 为数组的长度。一共有 $2^n$ 个子集，每个子集需要 $O(n)$ 的时间来构造。

### 可视化演示

> 以 `nums = [1, 2, 3]` 为例，用三行分别展示数组 `nums`、当前路径 `t`、结果集合 `ans`。指针 `i` 指向当前决策的下标；黄色高亮表示刚加入 `t` 的元素或新写入 `ans` 的子集。

<ArrayViz :steps="subsets1Steps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> t = new ArrayList<>();
    private int[] nums;

    public List<List<Integer>> subsets(int[] nums) {
        this.nums = nums;
        dfs(0);
        return ans;
    }

    private void dfs(int i) {
        if (i == nums.length) {
            ans.add(new ArrayList<>(t));
            return;
        }
        dfs(i + 1);
        t.add(nums[i]);
        dfs(i + 1);
        t.remove(t.size() - 1);
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> ans;
        vector<int> t;
        function<void(int)> dfs = [&](int i) -> void {
            if (i == nums.size()) {
                ans.push_back(t);
                return;
            }
            dfs(i + 1);
            t.push_back(nums[i]);
            dfs(i + 1);
            t.pop_back();
        };
        dfs(0);
        return ans;
    }
};
```

```ts [TypeScript]
function subsets(nums: number[]): number[][] {
    const ans: number[][] = [];
    const t: number[] = [];
    const dfs = (i: number) => {
        if (i === nums.length) {
            ans.push(t.slice());
            return;
        }
        dfs(i + 1);
        t.push(nums[i]);
        dfs(i + 1);
        t.pop();
    };
    dfs(0);
    return ans;
}
```

```python [Python]
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        def dfs(i: int):
            if i == len(nums):
                ans.append(t[:])
                return
            dfs(i + 1)
            t.append(nums[i])
            dfs(i + 1)
            t.pop()

        ans = []
        t = []
        dfs(0)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：二进制枚举

我们也可以使用二进制枚举的方法得到所有的子集。

我们可以使用 $2^n$ 个二进制数来表示 $n$ 个元素的所有子集，对于当前二进制数 $mask$，如果第 $i$ 位为 $1$，表示选择了第 $i$ 个元素，否则表示不选择第 $i$ 个元素。

时间复杂度 $O(n\times 2^n)$，空间复杂度 $O(n)$。其中 $n$ 为数组的长度。一共有 $2^n$ 个子集，每个子集需要 $O(n)$ 的时间来构造。

### 可视化演示

> 以 `nums = [1, 2, 3]` 为例，用三行展示 `nums`、当前枚举出的子集 `t`、结果集合 `ans`。第一行黄色高亮表示 `mask` 中对应位为 1、被选中的元素。

<ArrayViz :steps="subsets2Steps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> ans = new ArrayList<>();
        for (int mask = 0; mask < 1 << n; ++mask) {
            List<Integer> t = new ArrayList<>();
            for (int i = 0; i < n; ++i) {
                if (((mask >> i) & 1) == 1) {
                    t.add(nums[i]);
                }
            }
            ans.add(t);
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        int n = nums.size();
        vector<vector<int>> ans;
        for (int mask = 0; mask < 1 << n; ++mask) {
            vector<int> t;
            for (int i = 0; i < n; ++i) {
                if (mask >> i & 1) {
                    t.emplace_back(nums[i]);
                }
            }
            ans.emplace_back(t);
        }
        return ans;
    }
};
```

```ts [TypeScript]
function subsets(nums: number[]): number[][] {
    const n = nums.length;
    const ans: number[][] = [];
    for (let mask = 0; mask < 1 << n; ++mask) {
        const t: number[] = [];
        for (let i = 0; i < n; ++i) {
            if (((mask >> i) & 1) === 1) {
                t.push(nums[i]);
            }
        }
        ans.push(t);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        ans = []
        for mask in range(1 << len(nums)):
            t = [x for i, x in enumerate(nums) if mask >> i & 1]
            ans.append(t)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三

### 可视化演示

> 以 `nums = [1, 2, 3]` 为例，用两行展示 `nums` 与不断增长的 `res`：每次取一个元素 `x`，把 `res` 中已有的每个子集追加 `x` 生成新子集（黄色高亮为本次新增）。

<ArrayViz :steps="subsets3Steps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>
<!-- tabs:start -->
::: code-group


```ts [TypeScript]
function subsets(nums: number[]): number[][] {
    const res: number[][] = [[]];
    for (const x of nums) {
        res.push(...res.map(arr => [...arr, x]));
    }

    return res;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->