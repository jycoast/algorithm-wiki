---
comments: true
difficulty: 中等

tags:
    - 字符串
    - 动态规划
    - 回溯
---

<script setup>
// 方法一（DFS + 剪枝）可视化：n = 2
// rows[0] 为当前括号串 t（空位用 '' 占位），rows[1] 为左右括号计数 [l, r]
const dfsPruneSteps = [
  { rows: [['', '', '', ''], [0, 0]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: 'n=2。初始 dfs(l=0, r=0, t="")。l < n 且 l == r（加 ")" 会违反 l≥r）→ 只能加 "("。' },
  { rows: [['(', '', '', ''], [1, 0]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [0] }], note: '加 "(" → dfs(1, 0, "(")：l=1, r=0，t="("。' },
  { rows: [['(', '(', '', ''], [2, 0]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [1] }], note: 'l=1 < n 且 l > r → 可加 "(" 或 ")"，先试 "("。加 "(" → dfs(2, 0, "((")：l=2, r=0，t="(("。' },
  { rows: [['(', '(', '', ''], [2, 0]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: 'l=2 == n → 不能加 "("（l 会变 3 > n，剪枝）；l > r → 可加 ")"。改加 ")"。' },
  { rows: [['(', '(', ')', ''], [2, 1]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [2] }], note: '加 ")" → dfs(2, 1, "(()")：l=2, r=1，t="(()"。' },
  { rows: [['(', '(', ')', ''], [2, 1]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: 'l=2 == n → 不能加 "("（剪枝）；l > r → 可加 ")"。改加 ")"。' },
  { rows: [['(', '(', ')', ')'], [2, 2]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [3] }], note: '加 ")" → dfs(2, 2, "(())")：l=2, r=2，t="(())"。' },
  { rows: [['(', '(', ')', ')'], [2, 2]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [0, 1, 2, 3] }], note: 'l==n 且 r==n → t="(())" 有效，加入 ans，return。' },
  { rows: [['(', '', '', ''], [1, 0]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: '回溯：从 dfs(2,2) 一路返回到 dfs(1, 0, "(")。l=1 < n 且 l == r → 只能加 ")"，尝试该分支。' },
  { rows: [['(', ')', '', ''], [1, 1]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [1] }], note: '加 ")" → dfs(1, 1, "()")：l=1, r=1，t="()"。l==r 且 l < n → 可加 "("，先试左分支。' },
  { rows: [['(', ')', '(', ''], [2, 1]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [2] }], note: '加 "(" → dfs(2, 1, "()(")：l=2, r=1，t="()("。' },
  { rows: [['(', ')', '(', ''], [2, 1]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: 'l=2 == n → 不能加 "("（剪枝）；l > r → 可加 ")"。改加 ")"。' },
  { rows: [['(', ')', '(', ')'], [2, 2]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [3] }], note: '加 ")" → dfs(2, 2, "()()")：l=2, r=2，t="()()"。' },
  { rows: [['(', ')', '(', ')'], [2, 2]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], rowHighlight: [{ row: 0, cols: [0, 1, 2, 3] }], note: 'l==n 且 r==n → t="()()" 有效，加入 ans，return。' },
  { rows: [['(', ')', '', ''], [1, 1]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: '回溯：回到 dfs(1, 1, "()")，尝试加 ")" → dfs(1, 2)，l=1 < r=2 → 剪枝，返回。' },
  { rows: [['', '', '', ''], [0, 0]], rowPointers: [{ row: 1, col: 0, label: 'l' }, { row: 1, col: 1, label: 'r' }], note: '全部回溯完成 → ans = ["(())", "()()"] ✅' },
]

// 方法二（递归）可视化：n = 2
// rows[0] 为 base 串 s，rows[1] 为在位置 i 插入 "()" 后的结果
const recursionSteps = [
  { rows: [['(', ')']], note: 'n=2。递归调用 generateParenthesis(1)：n=1 是基准情形，直接返回 ["()"]。' },
  { rows: [['(', ')'], ['(', ')', '(', ')']], rowPointers: [{ row: 0, col: 0, label: 'i=0' }], rowHighlight: [{ row: 1, cols: [0, 1] }], note: '对 s = "()" 的每个下标 i 插入 "()"：i=0 → s.slice(0,0) + "()" + s.slice(0) = "()()"。加入候选集合。' },
  { rows: [['(', ')'], ['(', '(', ')', ')']], rowPointers: [{ row: 0, col: 1, label: 'i=1' }], rowHighlight: [{ row: 1, cols: [1, 2] }], note: 'i=1 → s.slice(0,1) + "()" + s.slice(1) = "(())"。加入候选集合。' },
  { rows: [['(', ')'], ['(', '(', ')', ')']], note: 'new Set 对候选去重 → 返回 ["()()", "(())"] ✅' },
]
</script>

<!-- problem:start -->

# [22. 括号生成](https://leetcode.cn/problems/generate-parentheses)

## 题目描述

<!-- description:start -->

<p>数字 <code>n</code>&nbsp;代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 <strong>有效的 </strong>括号组合。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>n = 3
<strong>输出：</strong>["((()))","(()())","(())()","()(())","()()()"]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>n = 1
<strong>输出：</strong>["()"]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= n &lt;= 8</code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：DFS + 剪枝

题目中 $n$ 的范围为 $[1, 8]$，因此我们直接通过“暴力搜索 + 剪枝”的方式通过本题。

我们设计一个函数 $dfs(l, r, t)$，其中 $l$ 和 $r$ 分别表示左括号和右括号的数量，而 $t$ 表示当前的括号序列。那么我们可以得到如下的递归结构：

-   如果 $l \gt n$ 或者 $r \gt n$ 或者 $l \lt r$，那么当前括号组合 $t$ 不合法，直接返回；
-   如果 $l = n$ 且 $r = n$，那么当前括号组合 $t$ 合法，将其加入答案数组 `ans` 中，直接返回；
-   我们可以选择添加一个左括号，递归执行 `dfs(l + 1, r, t + "(")`；
-   我们也可以选择添加一个右括号，递归执行 `dfs(l, r + 1, t + ")")`。

时间复杂度 $O(2^{n\times 2} \times n)$，空间复杂度 $O(n)$。

### 可视化演示

> 以 `n = 2` 为例，演示 DFS + 剪枝生成括号：上方为当前括号串 `t`，下方为左右括号计数 `l`/`r`。`l == r` 时只能加 `(`，`l == n` 时只能加 `)`，黄色高亮表示刚加入的字符。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="dfsPruneSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    private List<String> ans = new ArrayList<>();
    private int n;

    public List<String> generateParenthesis(int n) {
        this.n = n;
        dfs(0, 0, "");
        return ans;
    }

    private void dfs(int l, int r, String t) {
        if (l > n || r > n || l < r) {
            return;
        }
        if (l == n && r == n) {
            ans.add(t);
            return;
        }
        dfs(l + 1, r, t + "(");
        dfs(l, r + 1, t + ")");
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> ans;
        function<void(int, int, string)> dfs = [&](int l, int r, string t) {
            if (l > n || r > n || l < r) return;
            if (l == n && r == n) {
                ans.push_back(t);
                return;
            }
            dfs(l + 1, r, t + "(");
            dfs(l, r + 1, t + ")");
        };
        dfs(0, 0, "");
        return ans;
    }
};
```

```ts [TypeScript]
function generateParenthesis(n: number): string[] {
    function dfs(l, r, t) {
        if (l > n || r > n || l < r) {
            return;
        }
        if (l == n && r == n) {
            ans.push(t);
            return;
        }
        dfs(l + 1, r, t + '(');
        dfs(l, r + 1, t + ')');
    }
    let ans = [];
    dfs(0, 0, '');
    return ans;
}
```

```python [Python]
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        def dfs(l, r, t):
            if l > n or r > n or l < r:
                return
            if l == n and r == n:
                ans.append(t)
                return
            dfs(l + 1, r, t + '(')
            dfs(l, r + 1, t + ')')

        ans = []
        dfs(0, 0, '')
        return ans
```
:::
<!-- tabs:end -->

<!-- solution:start -->

## 方法二：递归

### 可视化演示

> 以 `n = 2` 为例，演示递归生成：先递归求得 `generateParenthesis(1) = ["()"]`，再在串 `s` 的每个下标 `i` 处插入 `"()"`，最后用 `Set` 去重。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="recursionSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```ts [TypeScript]
function generateParenthesis(n: number): string[] {
    if (n === 1) return ['()'];

    return [
        ...new Set(
            generateParenthesis(n - 1).flatMap(s =>
                Array.from(s, (_, i) => s.slice(0, i) + '()' + s.slice(i)),
            ),
        ),
    ];
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->