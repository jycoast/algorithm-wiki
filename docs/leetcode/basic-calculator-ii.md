---
comments: true
difficulty: 中等
tags:
  - 栈
  - 数学
  - 字符串
entry: calculate
testcases:
  - input:
      - 3+2*2
    output: 7
  - input:
      - ' 3/2 '
    output: 1
  - input:
      - ' 3+5 / 2 '
    output: 5
---


<script setup>
// 方法一（栈）可视化：s = "3+2*2"，期望结果 7
// 行 0 为表达式 s（指针 i 指向当前字符），行 1 为栈 stk，行 2 为 [v, sign]（变量名与代码一致）
const calcIiSteps = [
  {
    rows: [['3', '+', '2', '*', '2'], [], [0, '+']],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 2, col: 0, label: 'v' },
      { row: 2, col: 1, label: 'sign' },
    ],
    note: 's = "3+2*2"。初始化：sign = \'+\'（第一个数字前视为加号），v = 0，栈 stk 为空。i 从 0 开始扫描。',
  },
  {
    rows: [['3', '+', '2', '*', '2'], [], [3, '+']],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 2, col: 0, label: 'v' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [0] }],
    note: '读到数字 \'3\' → v = v×10 + 3 = 3。当前位不是运算符，先不处理，等遇到运算符或末尾时再按 sign 结算。',
  },
  {
    rows: [['3', '+', '2', '*', '2'], [3], [0, '+']],
    rowPointers: [
      { row: 0, col: 1, label: 'i' },
      { row: 1, col: 0, label: '栈顶' },
      { row: 2, col: 0, label: 'v' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [1] }, { row: 1, cols: [0] }],
    note: '遇到运算符 \'+\' → 之前 sign 是 \'+\'：把 v = 3 压入栈 stk = [3]。重置 v = 0，sign 更新为 \'+\'。',
  },
  {
    rows: [['3', '+', '2', '*', '2'], [3], [2, '+']],
    rowPointers: [
      { row: 0, col: 2, label: 'i' },
      { row: 2, col: 0, label: 'v' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: '读到数字 \'2\' → v = v×10 + 2 = 2。',
  },
  {
    rows: [['3', '+', '2', '*', '2'], [3, 2], [0, '*']],
    rowPointers: [
      { row: 0, col: 3, label: 'i' },
      { row: 1, col: 1, label: '栈顶' },
      { row: 2, col: 0, label: 'v' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [3] }, { row: 1, cols: [1] }],
    note: '遇到运算符 \'*\' → 之前 sign 是 \'+\'：把 v = 2 压入栈 stk = [3, 2]。重置 v = 0，sign 更新为 \'*\'。',
  },
  {
    rows: [['3', '+', '2', '*', '2'], [3, 4], [0, '*']],
    rowPointers: [
      { row: 0, col: 4, label: 'i' },
      { row: 1, col: 1, label: '栈顶' },
      { row: 2, col: 0, label: 'v' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [1] }],
    note: '读到数字 \'2\' → v = 2。i 已是最后一个字符 → 按 sign = \'*\' 结算：弹出栈顶 2，2×v(2) = 4，把结果压回栈，stk = [3, 4]。',
  },
  {
    rows: [['3', '+', '2', '*', '2'], [3, 4], [7]],
    rowPointers: [
      { row: 2, col: 0, label: 'ans' },
    ],
    rowHighlight: [{ row: 1, cols: [0, 1] }],
    note: '遍历结束，将栈中所有元素求和：ans = 3 + 4 = 7 ✅。',
  },
]
</script>

<!-- problem:start -->

# [227. 基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii)

<!-- description:start -->

## 题目描述

<p>给你一个字符串表达式 <code>s</code> ，请你实现一个基本计算器来计算并返回它的值。</p>

<p>整数除法仅保留整数部分。</p>

<p>你可以假设给定的表达式总是有效的。所有中间结果将在&nbsp;<code>[-2<sup>31</sup>, 2<sup>31</sup>&nbsp;- 1]</code> 的范围内。</p>

<p><strong>注意：</strong>不允许使用任何将字符串作为数学表达式计算的内置函数，比如 <code>eval()</code> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "3+2*2"
<strong>输出：</strong>7
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = " 3/2 "
<strong>输出：</strong>1
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>s = " 3+5 / 2 "
<strong>输出：</strong>5
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 3 * 10<sup>5</sup></code></li>
	<li><code>s</code> 由整数和算符 <code>('+', '-', '*', '/')</code> 组成，中间由一些空格隔开</li>
	<li><code>s</code> 表示一个 <strong>有效表达式</strong></li>
	<li>表达式中的所有整数都是非负整数，且在范围 <code>[0, 2<sup>31</sup> - 1]</code> 内</li>
	<li>题目数据保证答案是一个 <strong>32-bit 整数</strong></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：栈

遍历字符串 $s$，并用变量 `sign` 记录每个数字之前的运算符，对于第一个数字，其之前的运算符视为加号。每次遍历到数字末尾时，根据 `sign` 来决定计算方式：

-   加号：将数字压入栈；
-   减号：将数字的相反数压入栈；
-   乘除号：计算数字与栈顶元素，并将栈顶元素替换为计算结果。

遍历结束后，将栈中元素求和即为答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "3+2*2"` 为例，逐步演示用栈 `stk` 做不含括号的四则运算：行 0 是表达式（指针 `i` 指向当前字符），行 1 是栈 `stk`，行 2 是当前数字 `v` 与待生效的运算符 `sign`。黄色高亮表示当前处理的字符或参与计算的栈元素；乘除会先弹出栈顶结算再压回。

<ArrayViz :steps="calcIiSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int calculate(String s) {
        Deque<Integer> stk = new ArrayDeque<>();
        char sign = '+';
        int v = 0;
        for (int i = 0; i < s.length(); ++i) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                v = v * 10 + (c - '0');
            }
            if (i == s.length() - 1 || c == '+' || c == '-' || c == '*' || c == '/') {
                if (sign == '+') {
                    stk.push(v);
                } else if (sign == '-') {
                    stk.push(-v);
                } else if (sign == '*') {
                    stk.push(stk.pop() * v);
                } else {
                    stk.push(stk.pop() / v);
                }
                sign = c;
                v = 0;
            }
        }
        int ans = 0;
        while (!stk.isEmpty()) {
            ans += stk.pop();
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int calculate(string s) {
        int v = 0, n = s.size();
        char sign = '+';
        stack<int> stk;
        for (int i = 0; i < n; ++i) {
            char c = s[i];
            if (isdigit(c)) v = v * 10 + (c - '0');
            if (i == n - 1 || c == '+' || c == '-' || c == '*' || c == '/') {
                if (sign == '+')
                    stk.push(v);
                else if (sign == '-')
                    stk.push(-v);
                else if (sign == '*') {
                    int t = stk.top();
                    stk.pop();
                    stk.push(t * v);
                } else {
                    int t = stk.top();
                    stk.pop();
                    stk.push(t / v);
                }
                sign = c;
                v = 0;
            }
        }
        int ans = 0;
        while (!stk.empty()) {
            ans += stk.top();
            stk.pop();
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def calculate(self, s: str) -> int:
        v, n = 0, len(s)
        sign = '+'
        stk = []
        for i, c in enumerate(s):
            if c.isdigit():
                v = v * 10 + int(c)
            if i == n - 1 or c in '+-*/':
                match sign:
                    case '+':
                        stk.append(v)
                    case '-':
                        stk.append(-v)
                    case '*':
                        stk.append(stk.pop() * v)
                    case '/':
                        stk.append(int(stk.pop() / v))
                sign = c
                v = 0
        return sum(stk)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->