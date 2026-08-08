---
comments: true
difficulty: 简单

tags:
    - 数学
    - 字符串
    - 模拟
---

<script setup>
// 方法一（双指针）可视化：num1 = "456", num2 = "77" → "533"
// rows 模式：第 0 行 num1、第 1 行 num2、第 2 行 ans（累加结果，低位在前）
const addStringsSteps = [
    {
        rows: [
            ['4', '5', '6'],
            ['7', '7'],
            [],
        ],
        rowPointers: [
            { row: 0, col: 2, label: 'i' },
            { row: 1, col: 1, label: 'j' },
        ],
        note: '初始化：i = num1.length - 1 = 2 指向 "6"，j = num2.length - 1 = 1 指向 "7"，进位 c = 0，ans 为空。',
    },
    {
        rows: [
            ['4', '5', '6'],
            ['7', '7'],
            ['3'],
        ],
        rowPointers: [
            { row: 0, col: 2, label: 'i' },
            { row: 1, col: 1, label: 'j' },
        ],
        rowHighlight: [
            { row: 0, cols: [2] },
            { row: 1, cols: [1] },
            { row: 2, cols: [0] },
        ],
        note: '取 a = num1[2] = 6，b = num2[1] = 7：c += a + b = 0 + 6 + 7 = 13；个位 c % 10 = 3 写入 ans，进位 c = 13 / 10 = 1。i、j 前移。',
    },
    {
        rows: [
            ['4', '5', '6'],
            ['7', '7'],
            ['3', '3'],
        ],
        rowPointers: [
            { row: 0, col: 1, label: 'i' },
            { row: 1, col: 0, label: 'j' },
        ],
        rowHighlight: [
            { row: 0, cols: [1] },
            { row: 1, cols: [0] },
            { row: 2, cols: [1] },
        ],
        note: '取 a = num1[1] = 5，b = num2[0] = 7：c += a + b = 1 + 5 + 7 = 13；个位 3 写入 ans，进位 c = 13 / 10 = 1。i、j 前移。',
    },
    {
        rows: [
            ['4', '5', '6'],
            ['7', '7'],
            ['3', '3', '5'],
        ],
        rowPointers: [{ row: 0, col: 0, label: 'i' }],
        rowHighlight: [
            { row: 0, cols: [0] },
            { row: 2, cols: [2] },
        ],
        note: 'j 已越界（num2 取完），b = 0；取 a = num1[0] = 4：c += a + b = 1 + 4 + 0 = 5；个位 5 写入 ans，进位 c = 0。',
    },
    {
        rows: [
            ['4', '5', '6'],
            ['7', '7'],
            ['5', '3', '3'],
        ],
        note: '循环结束（i < 0 且 j < 0 且 c = 0）。ans 反转后拼接 → "533" ✅。',
    },
]
</script>

<!-- problem:start -->

# [415. 字符串相加](https://leetcode.cn/problems/add-strings)




<!-- description:start -->

<p>给定两个字符串形式的非负整数&nbsp;<code>num1</code> 和<code>num2</code>&nbsp;，计算它们的和并同样以字符串形式返回。</p>

<p>你不能使用任何內建的用于处理大整数的库（比如 <code>BigInteger</code>），&nbsp;也不能直接将输入的字符串转换为整数形式。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>num1 = "11", num2 = "123"
<strong>输出：</strong>"134"
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>num1 = "456", num2 = "77"
<strong>输出：</strong>"533"
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>num1 = "0", num2 = "0"
<strong>输出：</strong>"0"
</pre>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= num1.length, num2.length &lt;= 10<sup>4</sup></code></li>
	<li><code>num1</code> 和<code>num2</code> 都只包含数字&nbsp;<code>0-9</code></li>
	<li><code>num1</code> 和<code>num2</code> 都不包含任何前导零</li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：双指针

我们用两个指针 $i$ 和 $j$ 分别指向两个字符串的末尾，从末尾开始逐位相加。每次取出对应位的数字 $a$ 和 $b$，计算它们的和 $a + b + c$，其中 $c$ 表示上一次相加的进位，最后将 $a + b + c$ 的个位数添加到追加到答案字符串的末尾，然后将 $a + b + c$ 的十位数作为进位 $c$ 的值，循环此过程直至两个字符串的指针都已经指向了字符串的开头并且进位 $c$ 的值为 $0$。

最后将答案字符串反转并返回即可。

时间复杂度 $O(\max(m, n))$，其中 $m$ 和 $n$ 分别是两个字符串的长度。忽略答案字符串的空间消耗，空间复杂度 $O(1)$。

以下代码还实现了字符串相减，参考 `subStrings(num1, num2)` 函数。

### 可视化演示

> 以 `num1 = "456"`、`num2 = "77"` 为例，演示双指针从两数末尾逐位相加：第 0 行 `num1`、第 1 行 `num2`、第 2 行 `ans`（低位在前）。指针 `i`/`j` 指向当前读取位，黄色高亮为正在相加或刚写入的位置。

<ArrayViz :steps="addStringsSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String addStrings(String num1, String num2) {
        int i = num1.length() - 1, j = num2.length() - 1;
        StringBuilder ans = new StringBuilder();
        for (int c = 0; i >= 0 || j >= 0 || c > 0; --i, --j) {
            int a = i < 0 ? 0 : num1.charAt(i) - '0';
            int b = j < 0 ? 0 : num2.charAt(j) - '0';
            c += a + b;
            ans.append(c % 10);
            c /= 10;
        }
        return ans.reverse().toString();
    }

    public String subStrings(String num1, String num2) {
        int m = num1.length(), n = num2.length();
        boolean neg = m < n || (m == n && num1.compareTo(num2) < 0);
        if (neg) {
            String t = num1;
            num1 = num2;
            num2 = t;
        }
        int i = num1.length() - 1, j = num2.length() - 1;
        StringBuilder ans = new StringBuilder();
        for (int c = 0; i >= 0; --i, --j) {
            c = (num1.charAt(i) - '0') - c - (j < 0 ? 0 : num2.charAt(j) - '0');
            ans.append((c + 10) % 10);
            c = c < 0 ? 1 : 0;
        }
        while (ans.length() > 1 && ans.charAt(ans.length() - 1) == '0') {
            ans.deleteCharAt(ans.length() - 1);
        }
        if (neg) {
            ans.append('-');
        }
        return ans.reverse().toString();
    }
}
```

```cpp [C++]
class Solution {
public:
    string addStrings(string num1, string num2) {
        int i = num1.size() - 1, j = num2.size() - 1;
        string ans;
        for (int c = 0; i >= 0 || j >= 0 || c; --i, --j) {
            int a = i < 0 ? 0 : num1[i] - '0';
            int b = j < 0 ? 0 : num2[j] - '0';
            c += a + b;
            ans += to_string(c % 10);
            c /= 10;
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }

    string subStrings(string num1, string num2) {
        int m = num1.size(), n = num2.size();
        bool neg = m < n || (m == n && num1 < num2);
        if (neg) {
            swap(num1, num2);
        }
        int i = num1.size() - 1, j = num2.size() - 1;
        string ans;
        for (int c = 0; i >= 0; --i, --j) {
            c = (num1[i] - '0') - c - (j < 0 ? 0 : num2[j] - '0');
            ans += to_string((c + 10) % 10);
            c = c < 0 ? 1 : 0;
        }
        while (ans.size() > 1 && ans.back() == '0') {
            ans.pop_back();
        }
        if (neg) {
            ans.push_back('-');
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
```


```ts [TypeScript]
function addStrings(num1: string, num2: string): string {
    let i = num1.length - 1;
    let j = num2.length - 1;
    const ans: number[] = [];
    for (let c = 0; i >= 0 || j >= 0 || c; --i, --j) {
        c += i < 0 ? 0 : +num1[i];
        c += j < 0 ? 0 : +num2[j];
        ans.push(c % 10);
        c = Math.floor(c / 10);
    }
    return ans.reverse().join('');
}

function subStrings(num1: string, num2: string): string {
    const m = num1.length;
    const n = num2.length;
    const neg = m < n || (m == n && num1 < num2);
    if (neg) {
        const t = num1;
        num1 = num2;
        num2 = t;
    }
    let i = num1.length - 1;
    let j = num2.length - 1;
    const ans: number[] = [];
    for (let c = 0; i >= 0; --i, --j) {
        c = +num1[i] - c;
        if (j >= 0) {
            c -= +num2[j];
        }
        ans.push((c + 10) % 10);
        c = c < 0 ? 1 : 0;
    }
    while (ans.length > 1 && ans.at(-1) === 0) {
        ans.pop();
    }
    return (neg ? '-' : '') + ans.reverse().join('');
}
```


```python [Python]
class Solution:
    def addStrings(self, num1: str, num2: str) -> str:
        i, j = len(num1) - 1, len(num2) - 1
        ans = []
        c = 0
        while i >= 0 or j >= 0 or c:
            a = 0 if i < 0 else int(num1[i])
            b = 0 if j < 0 else int(num2[j])
            c, v = divmod(a + b + c, 10)
            ans.append(str(v))
            i, j = i - 1, j - 1
        return "".join(ans[::-1])

    def subStrings(self, num1: str, num2: str) -> str:
        m, n = len(num1), len(num2)
        neg = m < n or (m == n and num1 < num2)
        if neg:
            num1, num2 = num2, num1
        i, j = len(num1) - 1, len(num2) - 1
        ans = []
        c = 0
        while i >= 0:
            c = int(num1[i]) - c - (0 if j < 0 else int(num2[j]))
            ans.append(str((c + 10) % 10))
            c = 1 if c < 0 else 0
            i, j = i - 1, j - 1
        while len(ans) > 1 and ans[-1] == '0':
            ans.pop()
        if neg:
            ans.append('-')
        return ''.join(ans[::-1])
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->