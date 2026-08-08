---
comments: true
difficulty: 困难

tags:
    - 栈
    - 字符串
    - 动态规划
---

<script setup>
// 方法一（动态规划）可视化：s = ")()())"
// 行 0 为字符串 s（第 0 列占位，与 f 对齐），行 1 为 dp 数组 f
const longestValidDpSteps = [
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 0, 0, 0, 0]],
    note: 's = ")()())"，n = 6。f[i] 表示以 s[i-1] 结尾的最长有效括号长度，f 初始全 0，ans = 0。',
  },
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 0, 0, 0, 0]],
    rowPointers: [{ row: 0, col: 2, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: 'i = 2：s[i-1] = s[1] = \'(\' 是左括号，以它结尾的有效长度必为 0 → f[2] = 0。',
  },
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 2, 0, 0, 0]],
    rowPointers: [{ row: 0, col: 3, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [3] }, { row: 1, cols: [3] }],
    note: 'i = 3：s[2] = \')\' 且 s[i-2] = s[1] = \'(\' → f[3] = f[1] + 2 = 0 + 2 = 2，ans = 2。',
  },
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 2, 0, 0, 0]],
    rowPointers: [{ row: 0, col: 4, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [4] }],
    note: 'i = 4：s[3] = \'(\' 是左括号 → f[4] = 0。',
  },
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 2, 0, 4, 0]],
    rowPointers: [{ row: 0, col: 5, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [5] }, { row: 1, cols: [5] }],
    note: 'i = 5：s[4] = \')\' 且 s[i-2] = s[3] = \'(\' → f[5] = f[3] + 2 = 2 + 2 = 4，ans = 4。',
  },
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 2, 0, 4, 0]],
    rowPointers: [{ row: 0, col: 6, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [6] }],
    note: 'i = 6：s[5] = \')\'，前一个字符 s[4] = \')\' 也是右括号 → j = i - f[5] - 1 = 6 - 4 - 1 = 1，但 s[j-1] = s[0] = \')\' 不是左括号，条件不成立 → f[6] 保持 0，ans 仍为 4。',
  },
  {
    rows: [['', ')', '(', ')', '(', ')', ')'], [0, 0, 0, 2, 0, 4, 0]],
    note: '遍历结束，返回 ans = 4。最长有效括号子串是 s[1..4] = "()()" ✅。',
  },
]

// 方法二（栈）可视化：s = ")()())"
// 行 0 为字符串 s（当前字符指针 i），行 1 为栈 stack（存放索引，栈底哨兵 -1）
const longestValidStackSteps = [
  {
    rows: [[')', '(', ')', '(', ')', ')'], [-1]],
    note: 's = ")()())"。初始化栈 stack = [-1]（栈底哨兵，辅助计算长度），max_length = 0。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [0]],
    rowPointers: [{ row: 0, col: 0, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [0] }],
    note: 'i = 0：s[0] = \')\' → 弹出栈顶 -1 后栈为空，无法匹配 → 把 0 压栈作为新起点。stack = [0]。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [0, 1]],
    rowPointers: [{ row: 0, col: 1, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [1] }],
    note: 'i = 1：s[1] = \'(\' 是左括号 → 把索引 1 压栈。stack = [0, 1]。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [0]],
    rowPointers: [{ row: 0, col: 2, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: 'i = 2：s[2] = \')\' → 弹出栈顶 1，栈底 0 与之匹配 → 长度 = 2 - 0 = 2，max_length = 2。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [0, 3]],
    rowPointers: [{ row: 0, col: 3, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [3] }],
    note: 'i = 3：s[3] = \'(\' → 把索引 3 压栈。stack = [0, 3]。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [0]],
    rowPointers: [{ row: 0, col: 4, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [4] }],
    note: 'i = 4：s[4] = \')\' → 弹出栈顶 3，栈底 0 匹配 → 长度 = 4 - 0 = 4，max_length = 4。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [5]],
    rowPointers: [{ row: 0, col: 5, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [5] }],
    note: 'i = 5：s[5] = \')\' → 弹出栈顶 0 后栈为空 → 把 5 压栈作为新起点。stack = [5]。',
  },
  {
    rows: [[')', '(', ')', '(', ')', ')'], [5]],
    note: '遍历结束，返回 max_length = 4。最长有效括号子串 "()()" 长度为 4 ✅。',
  },
]
</script>

<!-- problem:start -->

# [32. 最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses)

## 题目描述

<!-- description:start -->

<p>给你一个只包含 <code>'('</code>&nbsp;和 <code>')'</code>&nbsp;的字符串，找出最长有效（格式正确且连续）括号<span data-keyword="substring">子串</span>的长度。</p>

<p>&nbsp;</p>

<div class="original__bRMd">
<div>
<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "(()"
<strong>输出：</strong>2
<strong>解释：</strong>最长有效括号子串是 "()"
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = ")()())"
<strong>输出：</strong>4
<strong>解释：</strong>最长有效括号子串是 "()()"
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>s = ""
<strong>输出：</strong>0
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 3 * 10<sup>4</sup></code></li>
	<li><code>s[i]</code> 为 <code>'('</code> 或 <code>')'</code></li>
</ul>
</div>
</div>

<!-- description:end -->

<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i]$ 表示以 $s[i-1]$ 结尾的最长有效括号的长度，那么答案就是 $\max\limits_{i=1}^n f[i]$。

-   如果 $s[i-1]$ 是左括号，那么以 $s[i-1]$ 结尾的最长有效括号的长度一定为 $0$，因此 $f[i] = 0$。
-   如果 $s[i-1]$ 是右括号，有以下两种情况：
    -   如果 $s[i-2]$ 是左括号，那么以 $s[i-1]$ 结尾的最长有效括号的长度为 $f[i-2] + 2$。
    -   如果 $s[i-2]$ 是右括号，那么以 $s[i-1]$ 结尾的最长有效括号的长度为 $f[i-1] + 2$，但是还需要考虑 $s[i-f[i-1]-2]$ 是否是左括号，如果是左括号，那么以 $s[i-1]$ 结尾的最长有效括号的长度为 $f[i-1] + 2 + f[i-f[i-1]-2]$。

因此，我们可以得到状态转移方程：

$$
\begin{cases}
f[i] = 0, & \textit{if } s[i-1] = '(',\\
f[i] = f[i-2] + 2, & \textit{if } s[i-1] = ')' \textit{ and } s[i-2] = '(',\\
f[i] = f[i-1] + 2 + f[i-f[i-1]-2], & \textit{if } s[i-1] = ')' \textit{ and } s[i-2] = ')' \textit{ and } s[i-f[i-1]-2] = '(',\\
\end{cases}
$$

最后返回 $\max\limits_{i=1}^n f[i]$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串的长度。

### 可视化演示

> 以 `s = ")()())"` 为例，逐 `i` 演示动态规划。行 0 为字符串 `s`（第 0 列是占位，与 `f` 对齐），行 1 为 dp 数组 `f`，指针 `i` 指向当前考察的 `s[i-1]`。黄色高亮为当前计算的字符与 `f` 值。

<ArrayViz :steps="longestValidDpSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int longestValidParentheses(String s) {
        int n = s.length();
        int[] f = new int[n + 1];
        int ans = 0;
        for (int i = 2; i <= n; ++i) {
            if (s.charAt(i - 1) == ')') {
                if (s.charAt(i - 2) == '(') {
                    f[i] = f[i - 2] + 2;
                } else {
                    int j = i - f[i - 1] - 1;
                    if (j > 0 && s.charAt(j - 1) == '(') {
                        f[i] = f[i - 1] + 2 + f[j - 1];
                    }
                }
                ans = Math.max(ans, f[i]);
            }
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    int longestValidParentheses(string s) {
        int n = s.size();
        int f[n + 1];
        memset(f, 0, sizeof(f));
        for (int i = 2; i <= n; ++i) {
            if (s[i - 1] == ')') {
                if (s[i - 2] == '(') {
                    f[i] = f[i - 2] + 2;
                } else {
                    int j = i - f[i - 1] - 1;
                    if (j && s[j - 1] == '(') {
                        f[i] = f[i - 1] + 2 + f[j - 1];
                    }
                }
            }
        }
        return *max_element(f, f + n + 1);
    }
};
```

```ts [TypeScript]
function longestValidParentheses(s: string): number {
    const n = s.length;
    const f: number[] = new Array(n + 1).fill(0);
    for (let i = 2; i <= n; ++i) {
        if (s[i - 1] === ')') {
            if (s[i - 2] === '(') {
                f[i] = f[i - 2] + 2;
            } else {
                const j = i - f[i - 1] - 1;
                if (j && s[j - 1] === '(') {
                    f[i] = f[i - 1] + 2 + f[j - 1];
                }
            }
        }
    }
    return Math.max(...f);
}
```

```python [Python]
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        n = len(s)
        f = [0] * (n + 1)
        for i, c in enumerate(s, 1):
            if c == ")":
                if i > 1 and s[i - 2] == "(":
                    f[i] = f[i - 2] + 2
                else:
                    j = i - f[i - 1] - 1
                    if j and s[j - 1] == "(":
                        f[i] = f[i - 1] + 2 + f[j - 1]
        return max(f)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：使用栈

-   使用栈来存储左括号的索引，栈底元素初始化为 `-1`，用于辅助计算有效括号的长度。
-   遍历字符串，对于每个字符：
    -   如果是左括号，将当前位置压入栈。
    -   如果是右括号，弹出栈顶元素表示匹配了一个左括号。
        -   如果栈为空，说明当前右括号无法匹配，将当前位置压入栈作为新的起点。
        -   如果栈不为空，计算当前有效括号子串的长度，更新最大长度。
-   最终返回最大长度。

总结：这个算法的关键在于维护一个线，栈内存放的是左括号的索引，通过弹出和压入的操作来更新有效括号子串的长度。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串的长度。

### 可视化演示

> 以 `s = ")()())"` 为例，演示栈解法。行 0 为字符串 `s`（当前字符指针 `i`），行 1 为栈 `stack`（存放左括号索引，栈底哨兵 `-1`）。黄色高亮为当前考察的字符。

<ArrayViz :steps="longestValidStackSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group


```ts [TypeScript]
function longestValidParentheses(s: string): number {
    let max_length: number = 0;
    const stack: number[] = [-1];
    for (let i = 0; i < s.length; i++) {
        if (s.charAt(i) == '(') {
            stack.push(i);
        } else {
            stack.pop();

            if (stack.length === 0) {
                stack.push(i);
            } else {
                max_length = Math.max(max_length, i - stack[stack.length - 1]);
            }
        }
    }

    return max_length;
}
```


```python [Python]
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack = [-1]
        ans = 0
        for i in range(len(s)):
            if s[i] == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)
                else:
                    ans = max(ans, i - stack[-1])
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->