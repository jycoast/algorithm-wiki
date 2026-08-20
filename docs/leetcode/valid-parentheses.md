---
comments: true
difficulty: 简单

tags:
    - 栈
    - 字符串
entry: isValid
testcases:
  - input: ["()"]
    output: true
  - input: ["()[]{}"]
    output: true
  - input: ["(]"]
    output: false
  - input: ["([)]"]
    output: false
hidden_testcases:
  - input: ["((()))"]
    output: true
  - input: ["{[()]}"]
    output: true
  - input: ["["]
    output: false
  - input: ["[(])"]
    output: false
---

<script setup>
// 方法一（栈）可视化：s = "([])"，演示左括号入栈、右括号弹栈匹配
// 上行 = 被遍历的括号序列 s，下行 = 栈 stk 内容（栈顶在行尾）
const validParenthesesSteps = [
  { rows: [['(', '[', ']', ')'], []], rowPointers: [{ row: 0, col: 0, label: 'c' }], note: '初始：指针 c 指向 s[0]="("，栈 stk 为空，开始遍历。' },
  { rows: [['(', '[', ']', ')'], ['(']], rowPointers: [{ row: 0, col: 0, label: 'c' }, { row: 1, col: 0, label: '栈顶' }], rowHighlight: [{ row: 0, cols: [0] }, { row: 1, cols: [0] }], note: 'c="(" 是左括号 → push 入栈。stk=["("]，栈顶为 "("。' },
  { rows: [['(', '[', ']', ')'], ['(', '[']], rowPointers: [{ row: 0, col: 1, label: 'c' }, { row: 1, col: 1, label: '栈顶' }], rowHighlight: [{ row: 0, cols: [1] }, { row: 1, cols: [1] }], note: 'c="[" 是左括号 → push 入栈。stk=["(", "["]，栈顶为 "["。' },
  { rows: [['(', '[', ']', ')'], ['(']], rowPointers: [{ row: 0, col: 2, label: 'c' }, { row: 1, col: 0, label: '栈顶' }], rowHighlight: [{ row: 0, cols: [2] }, { row: 1, cols: [0] }], note: 'c="]" 是右括号 → pop 栈顶 "[" 并匹配成功（"[" 与 "]" 配对）。stk=["("]。' },
  { rows: [['(', '[', ']', ')'], []], rowPointers: [{ row: 0, col: 3, label: 'c' }], rowHighlight: [{ row: 0, cols: [3] }], note: 'c=")" 是右括号 → pop 栈顶 "(" 并匹配成功（"(" 与 ")" 配对）。stk=[]。' },
  { rows: [['(', '[', ']', ')'], []], note: '遍历结束，栈 stk 为空 → 所有括号都正确闭合，返回 true ✅。' },
]
</script>

<!-- problem:start -->

# [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses)

## 题目描述

<!-- description:start -->

<p>给定一个只包括 <code>'('</code>，<code>')'</code>，<code>'{'</code>，<code>'}'</code>，<code>'['</code>，<code>']'</code>&nbsp;的字符串 <code>s</code> ，判断字符串是否有效。</p>

<p>有效字符串需满足：</p>

<ol>
	<li>左括号必须用相同类型的右括号闭合。</li>
	<li>左括号必须以正确的顺序闭合。</li>
	<li>每个右括号都有一个对应的相同类型的左括号。</li>
</ol>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "()"
<strong>输出：</strong>true
</pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入：</strong>s = "()[]{}"
<strong>输出：</strong>true
</pre>

<p><strong>示例&nbsp;3：</strong></p>

<pre>
<strong>输入：</strong>s = "(]"
<strong>输出：</strong>false
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s</code> 仅由括号 <code>'()[]{}'</code> 组成</li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：栈

遍历括号字符串 $s$，遇到左括号时，压入当前的左括号；遇到右括号时，弹出栈顶元素（若栈为空，直接返回 `false`），判断是否匹配，若不匹配，直接返回 `false`。

也可以选择遇到左括号时，将右括号压入栈中；遇到右括号时，弹出栈顶元素（若栈为空，直接返回 `false`），判断是否是相等。若不匹配，直接返回 `false`。

> 两者的区别仅限于括号转换时机，一个是在入栈时，一个是在出栈时。

遍历结束，若栈为空，说明括号字符串有效，返回 `true`；否则，返回 `false`。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为括号字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "([])"` 为例：上方是被遍历的括号序列（指针 `c` 依次扫描），下方是栈 `stk` 内容（`栈顶` 指针标出栈顶），黄色高亮为当前字符与栈顶元素；遇左括号入栈，遇右括号弹栈匹配。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="validParenthesesSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stk = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stk.push(c);
            } else if (stk.isEmpty() || !match(stk.pop(), c)) {
                return false;
            }
        }
        return stk.isEmpty();
    }

    private boolean match(char l, char r) {
        return (l == '(' && r == ')') || (l == '{' && r == '}') || (l == '[' && r == ']');
    }
}
```

```cpp [C++]
class Solution {
public:
    bool isValid(string s) {
        string stk;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[')
                stk.push_back(c);
            else if (stk.empty() || !match(stk.back(), c))
                return false;
            else
                stk.pop_back();
        }
        return stk.empty();
    }

    bool match(char l, char r) {
        return (l == '(' && r == ')') || (l == '[' && r == ']') || (l == '{' && r == '}');
    }
};
```

```ts [TypeScript]
const map = new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
]);

function isValid(s: string): boolean {
    const stack = [];
    for (const c of s) {
        if (map.has(c)) {
            stack.push(map.get(c));
        } else if (stack.pop() !== c) {
            return false;
        }
    }
    return stack.length === 0;
}
```

```python [Python]
class Solution:
    def isValid(self, s: str) -> bool:
        stk = []
        d = {'()', '[]', '{}'}
        for c in s:
            if c in '({[':
                stk.append(c)
            elif not stk or stk.pop() + c not in d:
                return False
        return not stk
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->