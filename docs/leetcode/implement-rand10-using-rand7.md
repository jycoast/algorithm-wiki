---
comments: true
difficulty: 中等

tags:
    - 数学
    - 拒绝采样
    - 概率与统计
    - 随机化
entry: rand10
testcases:
  - input: []
    output: 5
    accept: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  - input: []
    output: 1
    accept: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
---

<script setup>
// 方法一（拒绝采样）可视化：一次实际调用，第一次 x=42 被拒绝，第二次 x=5 被接受
// 每行是一次采样尝试：[i = rand7()-1, j = rand7(), x = i*7+j, 判定结果]（变量名与代码一致）
const rand10Steps = [
  {
    rows: [[5, 7, 42, '?']],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 0, col: 1, label: 'j' },
      { row: 0, col: 2, label: 'x' },
    ],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: '第一次采样：rand7() = 6 → i = 6-1 = 5；rand7() = 7 → j = 7；x = i×7 + j = 5×7+7 = 42。',
  },
  {
    rows: [[5, 7, 42, '拒绝']],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 0, col: 1, label: 'j' },
      { row: 0, col: 2, label: 'x' },
    ],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: 'x = 42 > 40，落在拒绝区间 [41, 49] → 不返回，进入 while(true) 重新采样。',
  },
  {
    rows: [[5, 7, 42, '拒绝'], [0, 5, 5, '?']],
    rowPointers: [
      { row: 1, col: 0, label: 'i' },
      { row: 1, col: 1, label: 'j' },
      { row: 1, col: 2, label: 'x' },
    ],
    rowHighlight: [{ row: 1, cols: [2] }],
    note: '第二次采样：rand7() = 1 → i = 1-1 = 0；rand7() = 5 → j = 5；x = i×7 + j = 0×7+5 = 5。',
  },
  {
    rows: [[5, 7, 42, '拒绝'], [0, 5, 5, '接受']],
    rowPointers: [
      { row: 1, col: 0, label: 'i' },
      { row: 1, col: 1, label: 'j' },
      { row: 1, col: 2, label: 'x' },
      { row: 1, col: 3, label: '结果' },
    ],
    rowHighlight: [{ row: 1, cols: [2, 3] }],
    note: 'x = 5 ≤ 40，落在接受区间 [1, 40] → 返回 x % 10 + 1 = 5 % 10 + 1 = 6。所以 rand10() 返回 6 ✅。',
  },
]
</script>

<!-- problem:start -->

# [470. 用 Rand7() 实现 Rand10()](https://leetcode.cn/problems/implement-rand10-using-rand7)

## 题目描述

<!-- description:start -->

<p>给定方法&nbsp;<code>rand7</code>&nbsp;可生成 <code>[1,7]</code> 范围内的均匀随机整数，试写一个方法&nbsp;<code>rand10</code>&nbsp;生成 <code>[1,10]</code> 范围内的均匀随机整数。</p>

<p>你只能调用&nbsp;<code>rand7()</code>&nbsp;且不能调用其他方法。请不要使用系统的&nbsp;<code>Math.random()</code>&nbsp;方法。</p>

<ol>
</ol>

<p>每个测试用例将有一个内部参数 <code>n</code>，即你实现的函数 <code>rand10()</code> 在测试时将被调用的次数。请注意，这不是传递给 <code>rand10()</code> 的参数。</p>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>

<pre>
<strong>输入: </strong>1
<strong>输出: </strong>[2]
</pre>

<p><strong>示例 2:</strong></p>

<pre>
<strong>输入: </strong>2
<strong>输出: </strong>[2,8]
</pre>

<p><strong>示例 3:</strong></p>

<pre>
<strong>输入: </strong>3
<strong>输出: </strong>[3,8,10]
</pre>

<p>&nbsp;</p>

<p><strong>提示:</strong></p>

<ul>
	<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶:</strong></p>

<ul>
	<li><code>rand7()</code>调用次数的&nbsp;<a href="https://en.wikipedia.org/wiki/Expected_value" target="_blank">期望值</a>&nbsp;是多少&nbsp;?</li>
	<li>你能否尽量少调用 <code>rand7()</code> ?</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：拒绝采样

我们可以使用拒绝采样的方法实现等概率生成任意区间的随机数。拒绝采样的思路是如果生成的随机数落在我们希望的区间内，那么就返回该随机数，否则会不断生成直到生成一个落在区间内的随机数为止。

对于本题，我们可以通过调用 $rand7()$ 两次来实现生成 $[1,10]$ 以内的随机数，具体如下：

我们生成一个大于等于 $1$ 且小于等于 $40$ 的整数 $x$，其中等概率生成的方式为 $x = (rand7() - 1) \times 7 + rand7()$，然后，我们返回 $x \bmod 10 + 1$ 即可。

期望时间复杂度为 $O(1)$，但是最坏情况下会达到无穷大的时间复杂度。空间复杂度为 $O(1)$。

### 可视化演示

> 以一次实际调用为例，演示拒绝采样：每行是一次采样尝试，依次列出 `i = rand7()-1`、`j = rand7()`、`x = i*7+j` 与判定结果。`x ∈ [1,40]` 接受并返回 `x%10+1`，`x ∈ [41,49]` 拒绝重试。黄色高亮表示当前计算的 `x` 与判定结果。

<ArrayViz :steps="rand10Steps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
/**
 * The rand7() API is already defined in the parent class SolBase.
 * public int rand7();
 * @return a random integer in the range 1 to 7
 */
class Solution extends SolBase {
    public int rand10() {
        while (true) {
            int i = rand7() - 1;
            int j = rand7();
            int x = i * 7 + j;
            if (x <= 40) {
                return x % 10 + 1;
            }
        }
    }
}
```



```cpp [C++]
// The rand7() API is already defined for you.
// int rand7();
// @return a random integer in the range 1 to 7

class Solution {
public:
    int rand10() {
        while (1) {
            int i = rand7() - 1;
            int j = rand7();
            int x = i * 7 + j;
            if (x <= 40) {
                return x % 10 + 1;
            }
        }
    }
};
```

```ts [TypeScript]
/**
 * The rand7() API is already defined for you.
 * function rand7(): number {}
 * @return a random integer in the range 1 to 7
 */

function rand10(): number {
    while (true) {
        const i = rand7() - 1;
        const j = rand7();
        const x = i * 7 + j;
        if (x <= 40) {
            return (x % 10) + 1;
        }
    }
}
```

```python [Python]
# The rand7() API is already defined for you.
# def rand7():
# @return a random integer in the range 1 to 7


class Solution:
    def rand10(self):
        """
        :rtype: int
        """
        while 1:
            i = rand7() - 1
            j = rand7()
            x = i * 7 + j
            if x <= 40:
                return x % 10 + 1
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->