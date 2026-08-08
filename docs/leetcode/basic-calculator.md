---
comments: true
difficulty: 困难

tags:
    - 栈
    - 递归
    - 数学
    - 字符串
---

<script setup>
// 方法一（栈）可视化：s = "1-(2+3)"，期望结果 -4
// 行 0 为表达式 s（指针 i 指向当前字符），行 1 为栈 stk，行 2 为 [ans, sign]（变量名与代码一致）
const calcSteps = [
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [], [0, 1]],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    note: 's = "1-(2+3)"。初始化：ans = 0，sign = 1（默认正号），栈 stk 为空。i 从 0 开始扫描表达式。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [], [1, 1]],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [0] }],
    note: '读到数字 \'1\' → 循环读入连续数字得 x = 1；ans += sign×x = 0 + 1×1 = 1。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [], [1, -1]],
    rowPointers: [
      { row: 0, col: 1, label: 'i' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [1] }],
    note: '遇到 \'-\' → sign 置为 -1，表示下一个数字要作减法。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [1, -1], [0, 1]],
    rowPointers: [
      { row: 0, col: 2, label: 'i' },
      { row: 1, col: 1, label: '栈顶' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [2] }, { row: 1, cols: [0, 1] }],
    note: '遇到 \'(\' → 把括号前的 ans = 1 和 sign = -1 依次压入栈 stk；随后 ans 清零、sign 重置为 1，开始计算括号内的子表达式。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [1, -1], [2, 1]],
    rowPointers: [
      { row: 0, col: 3, label: 'i' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [3] }],
    note: '读到数字 \'2\' → x = 2；ans += sign×x = 0 + 1×2 = 2。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [1, -1], [2, 1]],
    rowPointers: [
      { row: 0, col: 4, label: 'i' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [4] }],
    note: '遇到 \'+\' → sign 置为 1，括号内的下一个数字用加法。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [1, -1], [5, 1]],
    rowPointers: [
      { row: 0, col: 5, label: 'i' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [5] }],
    note: '读到数字 \'3\' → x = 3；ans += sign×x = 2 + 1×3 = 5。括号内子式 2+3 得 5。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [1, -1], [5, 1]],
    rowPointers: [
      { row: 0, col: 6, label: 'i' },
      { row: 1, col: 1, label: '栈顶' },
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    rowHighlight: [{ row: 0, cols: [6] }, { row: 1, cols: [0, 1] }],
    note: '遇到 \')\' → 弹出栈顶的 sign = -1 和括号前的结果 1（即 stk.pop() × ans + stk.pop()）。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [], [-4, 1]],
    rowPointers: [
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    note: '计算 ans = sign×括号内结果 + 括号前结果 = (-1)×5 + 1 = -4。括号已闭合，栈变回空。',
  },
  {
    rows: [['1', '-', '(', '2', '+', '3', ')'], [], [-4, 1]],
    rowPointers: [
      { row: 2, col: 0, label: 'ans' },
      { row: 2, col: 1, label: 'sign' },
    ],
    note: '遍历结束，返回 ans = -4，即 1-(2+3) = -4 ✅。',
  },
]
</script>

<!-- problem:start -->

# [224. 基本计算器](https://leetcode.cn/problems/basic-calculator)

## 题目描述

<!-- description:start -->

<p>给你一个字符串表达式 <code>s</code> ，请你实现一个基本计算器来计算并返回它的值。</p>

<p>注意:不允许使用任何将字符串作为数学表达式计算的内置函数，比如 <code>eval()</code> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "1 + 1"
<strong>输出：</strong>2
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = " 2-1 + 2 "
<strong>输出：</strong>3
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>s = "(1+(4+5+2)-3)+(6+8)"
<strong>输出：</strong>23
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 3&nbsp;* 10<sup>5</sup></code></li>
	<li><code>s</code> 由数字、<code>'+'</code>、<code>'-'</code>、<code>'('</code>、<code>')'</code>、和 <code>' '</code> 组成</li>
	<li><code>s</code> 表示一个有效的表达式</li>
	<li><font color="#c7254e"><font face="Menlo, Monaco, Consolas, Courier New, monospace"><span style="font-size:12.6px"><span style="background-color:#f9f2f4">'+'</span></span></font></font> 不能用作一元运算(例如， <font color="#c7254e"><font face="Menlo, Monaco, Consolas, Courier New, monospace"><span style="font-size:12.6px"><span style="background-color:#f9f2f4">"+1"</span></span></font></font>&nbsp;和 <code>"+(2 + 3)"</code>&nbsp;无效)</li>
	<li><font color="#c7254e"><font face="Menlo, Monaco, Consolas, Courier New, monospace"><span style="font-size:12.6px"><span style="background-color:#f9f2f4">'-'</span></span></font></font> 可以用作一元运算(即 <font color="#c7254e"><font face="Menlo, Monaco, Consolas, Courier New, monospace"><span style="font-size:12.6px"><span style="background-color:#f9f2f4">"-1"</span></span></font></font>&nbsp;和 <code>"-(2 + 3)"</code>&nbsp;是有效的)</li>
	<li>输入中不存在两个连续的操作符</li>
	<li>每个数字和运行的计算将适合于一个有符号的 32位 整数</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：栈

我们用一个栈 $stk$ 来保存当前的计算结果和操作符，用一个变量 $sign$ 保存当前的符号，变量 $ans$ 保存最终的计算结果。

接下来，我们遍历字符串 $s$ 的每一个字符：

-   如果当前字符是数字，那么我们用一个循环将后面的连续数字都读进来，然后用当前的符号将其加或者减到 $ans$ 中。
-   如果当前字符是 `'+'`，我们修改变量 $sign$ 为正号。
-   如果当前字符是 `'-'`，我们修改变量 $sign$ 为负号。
-   如果当前字符是 `'('`，我们把当前的 $ans$ 和 $sign$ 入栈，并分别置空置 1，重新开始计算新的 $ans$ 和 $sign$。
-   如果当前字符是 `')'`，我们弹出栈顶的两个元素，一个是操作符，一个是括号前计算好的数字，我们将当前的数字乘上操作符，再加上之前的数字，作为新的 $ans$。

遍历完字符串 $s$ 之后，我们返回 $ans$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "1-(2+3)"` 为例，逐步演示用栈 `stk` 求值：行 0 是表达式（指针 `i` 指向当前字符），行 1 是栈 `stk`（遇到 `(` 时压入括号前的 `ans` 与 `sign`），行 2 是当前的 `[ans, sign]`。黄色高亮表示当前正在处理的字符或参与计算的栈元素。

<ArrayViz :steps="calcSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int calculate(String s) {
        Deque<Integer> stk = new ArrayDeque<>();
        int sign = 1;
        int ans = 0;
        int n = s.length();
        for (int i = 0; i < n; ++i) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                int j = i;
                int x = 0;
                while (j < n && Character.isDigit(s.charAt(j))) {
                    x = x * 10 + s.charAt(j) - '0';
                    j++;
                }
                ans += sign * x;
                i = j - 1;
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                stk.push(ans);
                stk.push(sign);
                ans = 0;
                sign = 1;
            } else if (c == ')') {
                ans = stk.pop() * ans + stk.pop();
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int calculate(string s) {
        stack<int> stk;
        int ans = 0, sign = 1;
        int n = s.size();
        for (int i = 0; i < n; ++i) {
            if (isdigit(s[i])) {
                int x = 0;
                int j = i;
                while (j < n && isdigit(s[j])) {
                    x = x * 10 + (s[j] - '0');
                    ++j;
                }
                ans += sign * x;
                i = j - 1;
            } else if (s[i] == '+') {
                sign = 1;
            } else if (s[i] == '-') {
                sign = -1;
            } else if (s[i] == '(') {
                stk.push(ans);
                stk.push(sign);
                ans = 0;
                sign = 1;
            } else if (s[i] == ')') {
                ans *= stk.top();
                stk.pop();
                ans += stk.top();
                stk.pop();
            }
        }
        return ans;
    }
};
```



```ts [TypeScript]
function calculate(s: string): number {
    const stk: number[] = [];
    let sign = 1;
    let ans = 0;
    const n = s.length;
    for (let i = 0; i < n; ++i) {
        if (s[i] === ' ') {
            continue;
        }
        if (s[i] === '+') {
            sign = 1;
        } else if (s[i] === '-') {
            sign = -1;
        } else if (s[i] === '(') {
            stk.push(ans);
            stk.push(sign);
            ans = 0;
            sign = 1;
        } else if (s[i] === ')') {
            ans *= stk.pop() as number;
            ans += stk.pop() as number;
        } else {
            let x = 0;
            let j = i;
            for (; j < n && !isNaN(Number(s[j])) && s[j] !== ' '; ++j) {
                x = x * 10 + (s[j].charCodeAt(0) - '0'.charCodeAt(0));
            }
            ans += sign * x;
            i = j - 1;
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def calculate(self, s: str) -> int:
        stk = []
        ans, sign = 0, 1
        i, n = 0, len(s)
        while i < n:
            if s[i].isdigit():
                x = 0
                j = i
                while j < n and s[j].isdigit():
                    x = x * 10 + int(s[j])
                    j += 1
                ans += sign * x
                i = j - 1
            elif s[i] == "+":
                sign = 1
            elif s[i] == "-":
                sign = -1
            elif s[i] == "(":
                stk.append(ans)
                stk.append(sign)
                ans, sign = 0, 1
            elif s[i] == ")":
                ans = stk.pop() * ans + stk.pop()
            i += 1
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->