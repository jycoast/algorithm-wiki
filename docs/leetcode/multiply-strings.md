---
comments: true
difficulty: 中等

tags:
    - 数学
    - 字符串
    - 模拟
---

<script setup>
// 方法一（数学乘法模拟）可视化：num1 = "123", num2 = "456" → "56088"
// rows 模式：第 0 行 num1、第 1 行 num2、第 2 行 arr（乘积每位累加，长度 m+n）
const multiplySteps = [
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 0, 0, 0, 0],
        ],
        rowPointers: [
            { row: 0, col: 2, label: 'i' },
            { row: 1, col: 2, label: 'j' },
        ],
        note: 'num1 = "123"，num2 = "456"，乘积最多 m + n = 6 位，申请 arr = [0,0,0,0,0,0]。i = 2、j = 2 从两数最低位开始逐位相乘。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 0, 0, 0, 18],
        ],
        rowPointers: [
            { row: 0, col: 2, label: 'i' },
            { row: 1, col: 2, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [5] }],
        note: 'a = num1[2] = 3，b = num2[2] = 6：arr[2 + 2 + 1 = 5] += 3 × 6 = 18 → arr[5] = 18。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 0, 0, 15, 18],
        ],
        rowPointers: [
            { row: 0, col: 2, label: 'i' },
            { row: 1, col: 1, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [4] }],
        note: 'a = 3，b = num2[1] = 5：arr[2 + 1 + 1 = 4] += 3 × 5 = 15 → arr[4] = 15。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 0, 12, 15, 18],
        ],
        rowPointers: [
            { row: 0, col: 2, label: 'i' },
            { row: 1, col: 0, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [3] }],
        note: 'a = 3，b = num2[0] = 4：arr[2 + 0 + 1 = 3] += 3 × 4 = 12 → arr[3] = 12。j 遍历完，i 前移到 1。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 0, 12, 27, 18],
        ],
        rowPointers: [
            { row: 0, col: 1, label: 'i' },
            { row: 1, col: 2, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [4] }],
        note: 'a = num1[1] = 2，b = 6：arr[1 + 2 + 1 = 4] += 2 × 6 = 12 → arr[4] = 15 + 12 = 27。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 0, 22, 27, 18],
        ],
        rowPointers: [
            { row: 0, col: 1, label: 'i' },
            { row: 1, col: 1, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [3] }],
        note: 'a = 2，b = 5：arr[1 + 1 + 1 = 3] += 2 × 5 = 10 → arr[3] = 12 + 10 = 22。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 8, 22, 27, 18],
        ],
        rowPointers: [
            { row: 0, col: 1, label: 'i' },
            { row: 1, col: 0, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [2] }],
        note: 'a = 2，b = 4：arr[1 + 0 + 1 = 2] += 2 × 4 = 8 → arr[2] = 8。j 遍历完，i 前移到 0。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 8, 28, 27, 18],
        ],
        rowPointers: [
            { row: 0, col: 0, label: 'i' },
            { row: 1, col: 2, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [3] }],
        note: 'a = num1[0] = 1，b = 6：arr[0 + 2 + 1 = 3] += 1 × 6 = 6 → arr[3] = 22 + 6 = 28。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 0, 13, 28, 27, 18],
        ],
        rowPointers: [
            { row: 0, col: 0, label: 'i' },
            { row: 1, col: 1, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [2] }],
        note: 'a = 1，b = 5：arr[0 + 1 + 1 = 2] += 1 × 5 = 5 → arr[2] = 8 + 5 = 13。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 4, 13, 28, 27, 18],
        ],
        rowPointers: [
            { row: 0, col: 0, label: 'i' },
            { row: 1, col: 0, label: 'j' },
        ],
        rowHighlight: [{ row: 2, cols: [1] }],
        note: 'a = 1，b = 4：arr[0 + 0 + 1 = 1] += 1 × 4 = 4 → arr[1] = 4。相乘完成：arr = [0,4,13,28,27,18]。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 4, 13, 28, 28, 8],
        ],
        rowPointers: [{ row: 2, col: 5, label: 'i' }],
        rowHighlight: [{ row: 2, cols: [4, 5] }],
        note: '处理进位：i = 5，arr[4] += arr[5] / 10 = 18 / 10 = 1 → 28；arr[5] = arr[5] % 10 = 8。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 4, 13, 30, 8, 8],
        ],
        rowPointers: [{ row: 2, col: 4, label: 'i' }],
        rowHighlight: [{ row: 2, cols: [3, 4] }],
        note: 'i = 4，arr[3] += arr[4] / 10 = 28 / 10 = 2 → 30；arr[4] = 28 % 10 = 8。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 4, 16, 0, 8, 8],
        ],
        rowPointers: [{ row: 2, col: 3, label: 'i' }],
        rowHighlight: [{ row: 2, cols: [2, 3] }],
        note: 'i = 3，arr[2] += arr[3] / 10 = 30 / 10 = 3 → 16；arr[3] = 30 % 10 = 0。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 5, 6, 0, 8, 8],
        ],
        rowPointers: [{ row: 2, col: 2, label: 'i' }],
        rowHighlight: [{ row: 2, cols: [1, 2] }],
        note: 'i = 2，arr[1] += arr[2] / 10 = 16 / 10 = 1 → 5；arr[2] = 16 % 10 = 6。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 5, 6, 0, 8, 8],
        ],
        rowPointers: [{ row: 2, col: 1, label: 'i' }],
        rowHighlight: [{ row: 2, cols: [0, 1] }],
        note: 'i = 1，arr[0] += arr[1] / 10 = 5 / 10 = 0 → 0；arr[1] = 5 % 10 = 5。进位处理完成：arr = [0,5,6,0,8,8]。',
    },
    {
        rows: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            [0, 5, 6, 0, 8, 8],
        ],
        note: 'arr[0] = 0（最高位无进位），i 从 1 开始拼接 → "56088" ✅。',
    },
]
</script>

<!-- problem:start -->

# [43. 字符串相乘](https://leetcode.cn/problems/multiply-strings)

## 题目描述

<!-- description:start -->

<p>给定两个以字符串形式表示的非负整数&nbsp;<code>num1</code>&nbsp;和&nbsp;<code>num2</code>，返回&nbsp;<code>num1</code>&nbsp;和&nbsp;<code>num2</code>&nbsp;的乘积，它们的乘积也表示为字符串形式。</p>

<p><strong>注意：</strong>不能使用任何内置的 BigInteger 库或直接将输入转换为整数。</p>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>

<pre>
<strong>输入:</strong> num1 = "2", num2 = "3"
<strong>输出:</strong> "6"</pre>

<p><strong>示例&nbsp;2:</strong></p>

<pre>
<strong>输入:</strong> num1 = "123", num2 = "456"
<strong>输出:</strong> "56088"</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= num1.length, num2.length &lt;= 200</code></li>
	<li><code>num1</code>&nbsp;和 <code>num2</code>&nbsp;只能由数字组成。</li>
	<li><code>num1</code>&nbsp;和 <code>num2</code>&nbsp;都不包含任何前导零，除了数字0本身。</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：数学乘法模拟

假设 $num1$ 和 $num2$ 的长度分别为 $m$ 和 $n$，则它们的乘积的长度最多为 $m + n$。

证明如下：

-   如果 $num1$ 和 $num2$ 都取最小值，那么它们的乘积为 ${10}^{m - 1} \times {10}^{n - 1} = {10}^{m + n - 2}$，长度为 $m + n - 1$。
-   如果 $num1$ 和 $num2$ 都取最大值，那么它们的乘积为 $({10}^m - 1) \times ({10}^n - 1) = {10}^{m + n} - {10}^m - {10}^n + 1$，长度为 $m + n$。

因此，我们可以申请一个长度为 $m + n$ 的数组，用于存储乘积的每一位。

从低位到高位，依次计算乘积的每一位，最后将数组转换为字符串即可。

注意判断最高位是否为 $0$，如果是，则去掉。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m + n)$。其中 $m$ 和 $n$ 分别为 $num1$ 和 $num2$ 的长度。

### 可视化演示

> 以 `num1 = "123"`、`num2 = "456"` 为例，演示数学乘法模拟：第 0 行 `num1`、第 1 行 `num2`、第 2 行 `arr`（乘积累加，长度 m+n）。指针 `i`/`j` 指向当前相乘的位，黄色高亮为 `arr[i+j+1]` 被更新或进位处理的两位。

<ArrayViz :steps="multiplySteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String multiply(String num1, String num2) {
        if ("0".equals(num1) || "0".equals(num2)) {
            return "0";
        }
        int m = num1.length(), n = num2.length();
        int[] arr = new int[m + n];
        for (int i = m - 1; i >= 0; --i) {
            int a = num1.charAt(i) - '0';
            for (int j = n - 1; j >= 0; --j) {
                int b = num2.charAt(j) - '0';
                arr[i + j + 1] += a * b;
            }
        }
        for (int i = arr.length - 1; i > 0; --i) {
            arr[i - 1] += arr[i] / 10;
            arr[i] %= 10;
        }
        int i = arr[0] == 0 ? 1 : 0;
        StringBuilder ans = new StringBuilder();
        for (; i < arr.length; ++i) {
            ans.append(arr[i]);
        }
        return ans.toString();
    }
}
```

```cpp [C++]
class Solution {
public:
    string multiply(string num1, string num2) {
        if (num1 == "0" || num2 == "0") {
            return "0";
        }
        int m = num1.size(), n = num2.size();
        vector<int> arr(m + n);
        for (int i = m - 1; i >= 0; --i) {
            int a = num1[i] - '0';
            for (int j = n - 1; j >= 0; --j) {
                int b = num2[j] - '0';
                arr[i + j + 1] += a * b;
            }
        }
        for (int i = arr.size() - 1; i; --i) {
            arr[i - 1] += arr[i] / 10;
            arr[i] %= 10;
        }
        int i = arr[0] ? 0 : 1;
        string ans;
        for (; i < arr.size(); ++i) {
            ans += '0' + arr[i];
        }
        return ans;
    }
};
```

```ts [TypeScript]
function multiply(num1: string, num2: string): string {
    if (num1 === '0' || num2 === '0') {
        return '0';
    }
    const m: number = num1.length;
    const n: number = num2.length;
    const arr: number[] = Array(m + n).fill(0);
    for (let i: number = m - 1; i >= 0; i--) {
        const a: number = +num1[i];
        for (let j: number = n - 1; j >= 0; j--) {
            const b: number = +num2[j];
            arr[i + j + 1] += a * b;
        }
    }
    for (let i: number = arr.length - 1; i > 0; i--) {
        arr[i - 1] += Math.floor(arr[i] / 10);
        arr[i] %= 10;
    }
    let i: number = 0;
    while (i < arr.length && arr[i] === 0) {
        i++;
    }
    return arr.slice(i).join('');
}
```

```python [Python]
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == "0" or num2 == "0":
            return "0"
        m, n = len(num1), len(num2)
        arr = [0] * (m + n)
        for i in range(m - 1, -1, -1):
            a = int(num1[i])
            for j in range(n - 1, -1, -1):
                b = int(num2[j])
                arr[i + j + 1] += a * b
        for i in range(m + n - 1, 0, -1):
            arr[i - 1] += arr[i] // 10
            arr[i] %= 10
        i = 0 if arr[0] else 1
        return "".join(str(x) for x in arr[i:])
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->