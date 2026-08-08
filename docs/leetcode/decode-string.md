---
comments: true
difficulty: 中等

tags:
    - 栈
    - 递归
    - 字符串
---

<script setup>
// 方法一（辅助栈）可视化：s = "3[a2[c]]"
// 行 0 为输入字符串（当前字符指针 c），行 1 为数字栈 s1，行 2 为字符串栈 s2（变量名与 Java/Python 实现一致）
const decodeStringSteps = [
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [], []],
    rowPointers: [{ row: 0, col: 0, label: 'c' }],
    note: 's = "3[a2[c]]"。初始化：数字栈 s1 = []、字符串栈 s2 = []，num = 0，res = ""。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [], []],
    rowPointers: [{ row: 0, col: 0, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [0] }],
    note: 'c = \'3\' 是数字 → num = 0×10 + 3 = 3。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [3], ['']],
    rowPointers: [{ row: 0, col: 1, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [1] }, { row: 1, cols: [0] }],
    note: 'c = \'[\' → 入栈：s1.push(3)、s2.push("")；重置 num = 0、res = ""。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [3], ['']],
    rowPointers: [{ row: 0, col: 2, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: 'c = \'a\' 是字母 → 拼接到 res：res = "a"。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [3], ['']],
    rowPointers: [{ row: 0, col: 3, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [3] }],
    note: 'c = \'2\' 是数字 → num = 0×10 + 2 = 2。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [3, 2], ['', 'a']],
    rowPointers: [{ row: 0, col: 4, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [1] }, { row: 2, cols: [1] }],
    note: 'c = \'[\' → 入栈：s1.push(2)、s2.push("a")；重置 num = 0、res = ""。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [3, 2], ['', 'a']],
    rowPointers: [{ row: 0, col: 5, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [5] }],
    note: 'c = \'c\' 是字母 → 拼接到 res：res = "c"。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [3], ['']],
    rowPointers: [{ row: 0, col: 6, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [6] }, { row: 1, cols: [0] }, { row: 2, cols: [0] }],
    note: 'c = \']\' → 弹出 s1 得次数 n = 2，res = "c" 重复 2 次得 "cc"，再拼 s2.pop() 的 "a" → res = "acc"。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [], []],
    rowPointers: [{ row: 0, col: 7, label: 'c' }],
    rowHighlight: [{ row: 0, cols: [7] }],
    note: 'c = \']\' → 弹出 s1 得次数 n = 3，res = "acc" 重复 3 次得 "accaccacc"，再拼 s2.pop() 的 "" → res = "accaccacc"。',
  },
  {
    rows: [['3', '[', 'a', '2', '[', 'c', ']', ']'], [], []],
    note: '遍历结束，返回 res = "accaccacc" ✅。',
  },
]
</script>

<!-- problem:start -->

# [394. 字符串解码](https://leetcode.cn/problems/decode-string)

## 题目描述

<!-- description:start -->

<p>给定一个经过编码的字符串，返回它解码后的字符串。</p>

<p>编码规则为: <code>k[encoded_string]</code>，表示其中方括号内部的 <code>encoded_string</code> 正好重复 <code>k</code> 次。注意 <code>k</code> 保证为正整数。</p>

<p>你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。</p>

<p>此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 <code>k</code> ，例如不会出现像&nbsp;<code>3a</code>&nbsp;或&nbsp;<code>2[4]</code>&nbsp;的输入。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "3[a]2[bc]"
<strong>输出：</strong>"aaabcbc"
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = "3[a2[c]]"
<strong>输出：</strong>"accaccacc"
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>s = "2[abc]3[cd]ef"
<strong>输出：</strong>"abcabccdcdcdef"
</pre>

<p><strong>示例 4：</strong></p>

<pre>
<strong>输入：</strong>s = "abc3[cd]xyz"
<strong>输出：</strong>"abccdcdcdxyz"
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 30</code></li>
	<li><meta charset="UTF-8" /><code>s</code>&nbsp;由小写英文字母、数字和方括号<meta charset="UTF-8" />&nbsp;<code>'[]'</code> 组成</li>
	<li><code>s</code>&nbsp;保证是一个&nbsp;<strong>有效</strong>&nbsp;的输入。</li>
	<li><code>s</code>&nbsp;中所有整数的取值范围为<meta charset="UTF-8" />&nbsp;<code>[1, 300]</code>&nbsp;</li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一

### 可视化演示

> 以 `s = "3[a2[c]]"` 为例，演示辅助栈解码。三行从上到下依次为：输入字符串（当前字符指针 `c`）、数字栈 `s1`、字符串栈 `s2`（变量名与 Java/Python 实现一致）。黄色高亮为当前处理的字符及入栈/出栈的栈顶。

<ArrayViz :steps="decodeStringSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String decodeString(String s) {
        Deque<Integer> s1 = new ArrayDeque<>();
        Deque<String> s2 = new ArrayDeque<>();
        int num = 0;
        String res = "";
        for (char c : s.toCharArray()) {
            if ('0' <= c && c <= '9') {
                num = num * 10 + c - '0';
            } else if (c == '[') {
                s1.push(num);
                s2.push(res);
                num = 0;
                res = "";
            } else if (c == ']') {
                StringBuilder t = new StringBuilder();
                for (int i = 0, n = s1.pop(); i < n; ++i) {
                    t.append(res);
                }
                res = s2.pop() + t.toString();
            } else {
                res += String.valueOf(c);
            }
        }
        return res;
    }
}
```

```ts [TypeScript]
function decodeString(s: string): string {
    let ans = '';
    let stack = [];
    let count = 0; // repeatCount
    for (let cur of s) {
        if (/[0-9]/.test(cur)) {
            count = count * 10 + Number(cur);
        } else if (/[a-z]/.test(cur)) {
            ans += cur;
        } else if ('[' == cur) {
            stack.push([ans, count]);
            // reset
            ans = '';
            count = 0;
        } else {
            // match ']'
            let [pre, count] = stack.pop();
            ans = pre + ans.repeat(count);
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def decodeString(self, s: str) -> str:
        s1, s2 = [], []
        num, res = 0, ''
        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == '[':
                s1.append(num)
                s2.append(res)
                num, res = 0, ''
            elif c == ']':
                res = s2.pop() + res * s1.pop()
            else:
                res += c
        return res
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->