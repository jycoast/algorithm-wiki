---
comments: true
difficulty: 中等

tags:
    - 数组
    - 回溯
---

<script setup>
// 方法一（排序 + 剪枝 + 回溯）可视化：candidates=[2,3,6,7]，target=7
// rows 三行：row0=candidates，row1=t（当前路径），row2=ans（结果集合）
const combinationSum1Steps = [
  { rows: [[2, 3, 6, 7], [], []], rowPointers: [{ row: 0, col: 0, label: 'j' }], note: 'candidates 排序后 = [2,3,6,7]，target=7。调用 dfs(0, 7)：从下标 i=0 开始搜索，剩余目标值 s=7，当前路径 t 为空，答案 ans 为空。' },
  { rows: [[2, 3, 6, 7], [2], []], rowPointers: [{ row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 1, cols: [0] }], note: '循环 j=0：t.add(candidates[0]=2)，t=[2]，递归 dfs(0, 5)（s=7-2=5）。' },
  { rows: [[2, 3, 6, 7], [2, 2], []], rowPointers: [{ row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'j=0：t.add(2)，t=[2,2]，递归 dfs(0, 3)（s=5-2=3）。' },
  { rows: [[2, 3, 6, 7], [2, 2, 2], []], rowPointers: [{ row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 1, cols: [2] }], note: 'j=0：t.add(2)，t=[2,2,2]，递归 dfs(0, 1)（s=3-2=1）。' },
  { rows: [[2, 3, 6, 7], [2, 2, 2], []], note: 'dfs(0,1)：s=1 < candidates[0]=2，后面的元素都不小于 2，凑不齐剩余值，直接 return（剪枝）。' },
  { rows: [[2, 3, 6, 7], [2, 2], []], rowPointers: [{ row: 0, col: 0, label: 'j' }], note: '回溯：回到 dfs(0,3)，t.remove 撤销 2 → t=[2,2]，循环 j 继续。' },
  { rows: [[2, 3, 6, 7], [2, 2, 3], []], rowPointers: [{ row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 1, cols: [2] }], note: 'j=1：t.add(candidates[1]=3)，t=[2,2,3]，递归 dfs(1, 0)（s=3-3=0）。' },
  { rows: [[2, 3, 6, 7], [2, 2, 3], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 2, cols: [0] }], note: 'dfs(1,0)：s=0，把 t=[2,2,3] 加入 ans。ans=[[2,2,3]]。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], note: '回溯：撤销 3 → t=[2,2]，回到 dfs(0,3)，循环 j 继续。' },
  { rows: [[2, 3, 6, 7], [2, 2, 6], ['[2,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 1, cols: [2] }], note: 'j=2：t.add(candidates[2]=6)，t=[2,2,6]，递归 dfs(2, -3)：s<0 且 s < candidates[2]=6，直接 return（剪枝）。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[2,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'j' }], note: '回溯：撤销 6 → t=[2,2]，循环 j 继续。' },
  { rows: [[2, 3, 6, 7], [2, 2, 7], ['[2,2,3]']], rowPointers: [{ row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 1, cols: [2] }], note: 'j=3：t.add(candidates[3]=7)，t=[2,2,7]，递归 dfs(3, -4)：s<0 直接 return（剪枝）。' },
  { rows: [[2, 3, 6, 7], [2], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], note: '回溯：撤销 7 → t=[2,2]，dfs(0,3) 循环结束；再撤销 2 → t=[2]，回到 dfs(0,5)。' },
  { rows: [[2, 3, 6, 7], [2, 3], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'dfs(0,5)：j=1，t.add(3)，t=[2,3]，递归 dfs(1, 2)：s=2 < candidates[1]=3，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [2], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], note: '回溯：撤销 3 → t=[2]，循环 j 继续。' },
  { rows: [[2, 3, 6, 7], [2, 6], ['[2,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'j=2：t.add(6)，t=[2,6]，递归 dfs(2, -1)：s<0 剪枝 return。' },
  { rows: [[2, 3, 6, 7], [2], ['[2,2,3]']], note: '回溯：撤销 6 → t=[2]。' },
  { rows: [[2, 3, 6, 7], [2, 7], ['[2,2,3]']], rowPointers: [{ row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'j=3：t.add(7)，t=[2,7]，递归 dfs(3, -2)：s<0 剪枝 return。' },
  { rows: [[2, 3, 6, 7], [], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], note: '回溯：撤销 7 → t=[2]，dfs(0,5) 循环结束；再撤销 2 → t=[]，回到 dfs(0,7)。' },
  { rows: [[2, 3, 6, 7], [3], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 1, cols: [0] }], note: 'dfs(0,7)：j=1，t.add(candidates[1]=3)，t=[3]，递归 dfs(1, 4)（s=7-3=4）。' },
  { rows: [[2, 3, 6, 7], [3, 3], ['[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'dfs(1,4)：j=1，t.add(3)，t=[3,3]，递归 dfs(1, 1)：s=1 < candidates[1]=3，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [3], ['[2,2,3]']], note: '回溯：撤销 3 → t=[3]。' },
  { rows: [[2, 3, 6, 7], [3, 6], ['[2,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'j=2：t.add(6)，t=[3,6]，递归 dfs(2, -2)：s<0 剪枝 return。' },
  { rows: [[2, 3, 6, 7], [3], ['[2,2,3]']], note: '回溯：撤销 6 → t=[3]。' },
  { rows: [[2, 3, 6, 7], [3, 7], ['[2,2,3]']], rowPointers: [{ row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'j=3：t.add(7)，t=[3,7]，递归 dfs(3, -3)：s<0 剪枝 return。' },
  { rows: [[2, 3, 6, 7], [], ['[2,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'j' }], note: '回溯：撤销 7 → t=[3]，dfs(1,4) 循环结束；再撤销 3 → t=[]，回到 dfs(0,7)。' },
  { rows: [[2, 3, 6, 7], [6], ['[2,2,3]']], rowPointers: [{ row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 1, cols: [0] }], note: 'dfs(0,7)：j=2，t.add(candidates[2]=6)，t=[6]，递归 dfs(2, 1)：s=1 < candidates[2]=6，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [], ['[2,2,3]']], note: '回溯：撤销 6 → t=[]。' },
  { rows: [[2, 3, 6, 7], [7], ['[2,2,3]']], rowPointers: [{ row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 1, cols: [0] }], note: 'j=3：t.add(candidates[3]=7)，t=[7]，递归 dfs(3, 0)（s=7-7=0）。' },
  { rows: [[2, 3, 6, 7], [7], ['[2,2,3]', '[7]']], rowPointers: [{ row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 2, cols: [1] }], note: 'dfs(3,0)：s=0，把 t=[7] 加入 ans。ans=[[2,2,3],[7]]。' },
  { rows: [[2, 3, 6, 7], [], ['[2,2,3]', '[7]']], note: '回溯：撤销 7 → t=[]。dfs(0,7) 遍历完毕，得到答案 [[2,2,3],[7]] ✅。' },
]

// 方法二（排序 + 剪枝 + 回溯，写法二）可视化：candidates=[2,3,6,7]，target=7
// 每次进入 dfs(i,s)：先"不选"递归 dfs(i+1,s)，再"选"递归 dfs(i,s-candidates[i])
const combinationSum2Steps = [
  { rows: [[2, 3, 6, 7], [], []], rowPointers: [{ row: 0, col: 0, label: 'i' }], note: 'candidates=[2,3,6,7]，target=7。调用 dfs(0, 7)。写法二：进入 dfs(i,s) 后，若 s==0 记录答案；若 i≥n 或 s<candidates[i] 剪枝；否则先"不选 candidates[i]"递归 dfs(i+1,s)，再"选"递归 dfs(i,s-candidates[i])。' },
  { rows: [[2, 3, 6, 7], [], []], rowPointers: [{ row: 0, col: 1, label: 'i' }], note: '不选 candidates[0]=2：递归 dfs(1, 7)，指针移到 i=1，t 不变。' },
  { rows: [[2, 3, 6, 7], [], []], rowPointers: [{ row: 0, col: 2, label: 'i' }], note: '不选 candidates[1]=3：递归 dfs(2, 7)，指针移到 i=2，t 不变。' },
  { rows: [[2, 3, 6, 7], [], []], rowPointers: [{ row: 0, col: 3, label: 'i' }], note: '不选 candidates[2]=6：递归 dfs(3, 7)，指针移到 i=3，t 不变。' },
  { rows: [[2, 3, 6, 7], [], []], note: '不选 candidates[3]=7：递归 dfs(4, 7)。i=4 ≥ n=4，无法继续，return（剪枝）。' },
  { rows: [[2, 3, 6, 7], [7], []], rowPointers: [{ row: 0, col: 3, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '回到 dfs(3,7)：选 candidates[3]=7，t.add(7)，t=[7]，递归 dfs(3, 0)（s=7-7=0）。' },
  { rows: [[2, 3, 6, 7], [7], ['[7]']], rowPointers: [{ row: 0, col: 3, label: 'i' }], rowHighlight: [{ row: 2, cols: [0] }], note: 'dfs(3,0)：s=0，把 t=[7] 加入 ans。ans=[[7]]。' },
  { rows: [[2, 3, 6, 7], [], ['[7]']], note: '回溯：t.pop 撤销 7 → t=[]，回到 dfs(2,7)。' },
  { rows: [[2, 3, 6, 7], [6], ['[7]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '回到 dfs(2,7)：选 candidates[2]=6，t=[6]，递归 dfs(2, 1)（s=7-6=1）。' },
  { rows: [[2, 3, 6, 7], [6], ['[7]']], note: 'dfs(2,1)：s=1 < candidates[2]=6，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [], ['[7]']], note: '回溯：撤销 6 → t=[]，回到 dfs(1,7)。' },
  { rows: [[2, 3, 6, 7], [3], ['[7]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '回到 dfs(1,7)：选 candidates[1]=3，t=[3]，递归 dfs(1, 4)。' },
  { rows: [[2, 3, 6, 7], [3], ['[7]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], note: 'dfs(1,4) 中先"不选 3"：递归 dfs(2, 4)，指针移到 i=2。' },
  { rows: [[2, 3, 6, 7], [3], ['[7]']], note: 'dfs(2,4)：s=4 < candidates[2]=6，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [3, 3], ['[7]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }], note: '回到 dfs(1,4)：选 candidates[1]=3，t=[3,3]，递归 dfs(1, 1)。' },
  { rows: [[2, 3, 6, 7], [3, 3], ['[7]']], note: 'dfs(1,1)：s=1 < candidates[1]=3，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [3], ['[7]']], note: '回溯：撤销 3 → t=[3]，dfs(1,4) 的"选"分支结束。' },
  { rows: [[2, 3, 6, 7], [], ['[7]']], note: '回溯：撤销 3 → t=[]，dfs(1,7) 的"不选"分支结束，回到 dfs(0,7)。' },
  { rows: [[2, 3, 6, 7], [2], ['[7]']], rowPointers: [{ row: 0, col: 0, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '回到 dfs(0,7)：选 candidates[0]=2，t=[2]，递归 dfs(0, 5)。' },
  { rows: [[2, 3, 6, 7], [2], ['[7]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], note: 'dfs(0,5) 中先"不选 2"：递归 dfs(1, 5)，指针移到 i=1。' },
  { rows: [[2, 3, 6, 7], [2], ['[7]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], note: 'dfs(1,5) 中先"不选 3"：递归 dfs(2, 5)，指针移到 i=2。' },
  { rows: [[2, 3, 6, 7], [2], ['[7]']], note: 'dfs(2,5)：s=5 < candidates[2]=6，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [2, 3], ['[7]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }], note: '回到 dfs(1,5)：选 candidates[1]=3，t=[2,3]，递归 dfs(1, 2)。' },
  { rows: [[2, 3, 6, 7], [2, 3], ['[7]']], note: 'dfs(1,2)：s=2 < candidates[1]=3，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [2], ['[7]']], note: '回溯：撤销 3 → t=[2]，dfs(1,5) 结束。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[7]']], rowPointers: [{ row: 0, col: 0, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }], note: '回到 dfs(0,5)：选 candidates[0]=2，t=[2,2]，递归 dfs(0, 3)。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[7]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], note: 'dfs(0,3) 中先"不选 2"：递归 dfs(1, 3)，指针移到 i=1。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[7]']], rowPointers: [{ row: 0, col: 2, label: 'i' }], note: 'dfs(1,3) 中先"不选 3"：递归 dfs(2, 3)，指针移到 i=2。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[7]']], note: 'dfs(2,3)：s=3 < candidates[2]=6，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [2, 2, 3], ['[7]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [2] }], note: '回到 dfs(1,3)：选 candidates[1]=3，t=[2,2,3]，递归 dfs(1, 0)。' },
  { rows: [[2, 3, 6, 7], [2, 2, 3], ['[7]', '[2,2,3]']], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 2, cols: [1] }], note: 'dfs(1,0)：s=0，把 t=[2,2,3] 加入 ans。ans=[[7],[2,2,3]]。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[7]', '[2,2,3]']], note: '回溯：撤销 3 → t=[2,2]，dfs(1,3) 结束。' },
  { rows: [[2, 3, 6, 7], [2, 2, 2], ['[7]', '[2,2,3]']], rowPointers: [{ row: 0, col: 0, label: 'i' }], rowHighlight: [{ row: 1, cols: [2] }], note: '回到 dfs(0,3)：选 candidates[0]=2，t=[2,2,2]，递归 dfs(0, 1)。' },
  { rows: [[2, 3, 6, 7], [2, 2, 2], ['[7]', '[2,2,3]']], note: 'dfs(0,1)：s=1 < candidates[0]=2，剪枝 return。' },
  { rows: [[2, 3, 6, 7], [2, 2], ['[7]', '[2,2,3]']], note: '回溯：撤销 2 → t=[2,2]，dfs(0,3) 结束。' },
  { rows: [[2, 3, 6, 7], [2], ['[7]', '[2,2,3]']], note: '回溯：撤销 2 → t=[2]，dfs(0,5) 结束。' },
  { rows: [[2, 3, 6, 7], [], ['[7]', '[2,2,3]']], note: '回溯：撤销 2 → t=[]，dfs(0,7) 全部结束。答案 [[7],[2,2,3]] ✅（与写法一结果相同，顺序可任意）。' },
]
</script>

<!-- problem:start -->

# [39. 组合总和](https://leetcode.cn/problems/combination-sum)

## 题目描述

<!-- description:start -->

<p>给你一个 <strong>无重复元素</strong> 的整数数组&nbsp;<code>candidates</code> 和一个目标整数&nbsp;<code>target</code>&nbsp;，找出&nbsp;<code>candidates</code>&nbsp;中可以使数字和为目标数&nbsp;<code>target</code> 的 所有<em>&nbsp;</em><strong>不同组合</strong> ，并以列表形式返回。你可以按 <strong>任意顺序</strong> 返回这些组合。</p>

<p><code>candidates</code> 中的 <strong>同一个</strong> 数字可以 <strong>无限制重复被选取</strong> 。如果至少一个数字的被选数量不同，则两种组合是不同的。&nbsp;</p>

<p>对于给定的输入，保证和为&nbsp;<code>target</code> 的不同组合数少于 <code>150</code> 个。</p>

<p>&nbsp;</p>

<p><strong>示例&nbsp;1：</strong></p>

<pre>
<strong>输入：</strong>candidates = <code>[2,3,6,7], </code>target = <code>7</code>
<strong>输出：</strong>[[2,2,3],[7]]
<strong>解释：</strong>
2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
7 也是一个候选， 7 = 7 。
仅有这两种组合。</pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入: </strong>candidates = [2,3,5]<code>, </code>target = 8
<strong>输出: </strong>[[2,2,2,2],[2,3,3],[3,5]]</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入: </strong>candidates = <code>[2], </code>target = 1
<strong>输出: </strong>[]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= candidates.length &lt;= 30</code></li>
	<li><code>2 &lt;= candidates[i] &lt;= 40</code></li>
	<li><code>candidates</code> 的所有元素 <strong>互不相同</strong></li>
	<li><code>1 &lt;= target &lt;= 40</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：排序 + 剪枝 + 回溯

我们可以先对数组进行排序，方便剪枝。

接下来，我们设计一个函数 $dfs(i, s)$，表示从下标 $i$ 开始搜索，且剩余目标值为 $s$，其中 $i$ 和 $s$ 都是非负整数，当前搜索路径为 $t$，答案为 $ans$。

在函数 $dfs(i, s)$ 中，我们先判断 $s$ 是否为 $0$，如果是，则将当前搜索路径 $t$ 加入答案 $ans$ 中，然后返回。如果 $s \lt candidates[i]$，说明当前下标及后面的下标的元素都大于剩余目标值 $s$，路径不合法，直接返回。否则，我们从下标 $i$ 开始搜索，搜索的下标范围是 $j \in [i, n)$，其中 $n$ 为数组 $candidates$ 的长度。在搜索的过程中，我们将当前下标的元素加入搜索路径 $t$，递归调用函数 $dfs(j, s - candidates[j])$，递归结束后，将当前下标的元素从搜索路径 $t$ 中移除。

在主函数中，我们只要调用函数 $dfs(0, target)$，即可得到答案。

时间复杂度 $O(2^n \times n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $candidates$ 的长度。由于剪枝，实际的时间复杂度要远小于 $O(2^n \times n)$。

相似题目：

-   [40. 组合总和 II](https://github.com/doocs/leetcode/blob/main/solution/0000-0099/0040.Combination%20Sum%20II/README.md)
-   [77. 组合](https://github.com/doocs/leetcode/blob/main/solution/0000-0099/0077.Combinations/README.md)
-   [216. 组合总和 III](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0216.Combination%20Sum%20III/README.md)

### 可视化演示

> 以 `candidates = [2, 3, 6, 7]`、`target = 7` 为例，用三行分别展示候选数组 `candidates`、当前路径 `t`、结果集合 `ans`。指针 `j` 指向当前选择的候选下标；黄色高亮表示刚加入 `t` 的元素或新写入 `ans` 的组合。

<ArrayViz :steps="combinationSum1Steps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> t = new ArrayList<>();
    private int[] candidates;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        this.candidates = candidates;
        dfs(0, target);
        return ans;
    }

    private void dfs(int i, int s) {
        if (s == 0) {
            ans.add(new ArrayList(t));
            return;
        }
        if (s < candidates[i]) {
            return;
        }
        for (int j = i; j < candidates.length; ++j) {
            t.add(candidates[j]);
            dfs(j, s - candidates[j]);
            t.remove(t.size() - 1);
        }
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> ans;
        vector<int> t;
        function<void(int, int)> dfs = [&](int i, int s) {
            if (s == 0) {
                ans.emplace_back(t);
                return;
            }
            if (s < candidates[i]) {
                return;
            }
            for (int j = i; j < candidates.size(); ++j) {
                t.push_back(candidates[j]);
                dfs(j, s - candidates[j]);
                t.pop_back();
            }
        };
        dfs(0, target);
        return ans;
    }
};
```


```ts [TypeScript]
function combinationSum(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);
    const ans: number[][] = [];
    const t: number[] = [];
    const dfs = (i: number, s: number) => {
        if (s === 0) {
            ans.push(t.slice());
            return;
        }
        if (s < candidates[i]) {
            return;
        }
        for (let j = i; j < candidates.length; ++j) {
            t.push(candidates[j]);
            dfs(j, s - candidates[j]);
            t.pop();
        }
    };
    dfs(0, target);
    return ans;
}
```

```python [Python]
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        def dfs(i: int, s: int):
            if s == 0:
                ans.append(t[:])
                return
            if s < candidates[i]:
                return
            for j in range(i, len(candidates)):
                t.append(candidates[j])
                dfs(j, s - candidates[j])
                t.pop()

        candidates.sort()
        t = []
        ans = []
        dfs(0, target)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：排序 + 剪枝 + 回溯（写法二）

我们也可以将函数 $dfs(i, s)$ 的实现逻辑改为另一种写法。在函数 $dfs(i, s)$ 中，我们先判断 $s$ 是否为 $0$，如果是，则将当前搜索路径 $t$ 加入答案 $ans$ 中，然后返回。如果 $i \geq n$ 或者 $s \lt candidates[i]$，路径不合法，直接返回。否则，我们考虑两种情况，一种是不选当前下标的元素，即递归调用函数 $dfs(i + 1, s)$，另一种是选当前下标的元素，即递归调用函数 $dfs(i, s - candidates[i])$。

时间复杂度 $O(2^n \times n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $candidates$ 的长度。由于剪枝，实际的时间复杂度要远小于 $O(2^n \times n)$。

### 可视化演示

> 以 `candidates = [2, 3, 6, 7]`、`target = 7` 为例，同样用三行展示 `candidates`、当前路径 `t`、结果集合 `ans`。指针 `i` 表示当前考虑的下标；每一步先"不选"`candidates[i]`（指针右移、`t` 不变），再"选"（`t` 增加元素）。

<ArrayViz :steps="combinationSum2Steps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> t = new ArrayList<>();
    private int[] candidates;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        this.candidates = candidates;
        dfs(0, target);
        return ans;
    }

    private void dfs(int i, int s) {
        if (s == 0) {
            ans.add(new ArrayList(t));
            return;
        }
        if (i >= candidates.length || s < candidates[i]) {
            return;
        }
        dfs(i + 1, s);
        t.add(candidates[i]);
        dfs(i, s - candidates[i]);
        t.remove(t.size() - 1);
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> ans;
        vector<int> t;
        function<void(int, int)> dfs = [&](int i, int s) {
            if (s == 0) {
                ans.emplace_back(t);
                return;
            }
            if (i >= candidates.size() || s < candidates[i]) {
                return;
            }
            dfs(i + 1, s);
            t.push_back(candidates[i]);
            dfs(i, s - candidates[i]);
            t.pop_back();
        };
        dfs(0, target);
        return ans;
    }
};
```
```ts [TypeScript]
function combinationSum(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);
    const ans: number[][] = [];
    const t: number[] = [];
    const dfs = (i: number, s: number) => {
        if (s === 0) {
            ans.push(t.slice());
            return;
        }
        if (i >= candidates.length || s < candidates[i]) {
            return;
        }
        dfs(i + 1, s);
        t.push(candidates[i]);
        dfs(i, s - candidates[i]);
        t.pop();
    };
    dfs(0, target);
    return ans;
}
```

```python [Python]
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        def dfs(i: int, s: int):
            if s == 0:
                ans.append(t[:])
                return
            if i >= len(candidates) or s < candidates[i]:
                return
            dfs(i + 1, s)
            t.append(candidates[i])
            dfs(i, s - candidates[i])
            t.pop()

        candidates.sort()
        t = []
        ans = []
        dfs(0, target)
        return ans
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->