---
comments: true
difficulty: 中等
tags:
  - 双指针
  - 字符串
entry: compareVersion
testcases:
  - input:
      - '1.2'
      - '1.10'
    output: -1
  - input:
      - '1.01'
      - '1.001'
    output: 0
  - input:
      - '1.0'
      - 1.0.0.0
    output: 0
---


<script setup>
// 方法一（双指针）可视化：version1 = "1.2"，version2 = "1.10"
// 指针 i / j 分别遍历两个版本号字符串，逐段解析修订号 a / b 并比较
const compareVersionSteps = [
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 1, col: 0, label: 'j' },
    ],
    note: 'version1 = "1.2"，version2 = "1.10"。初始化指针 i = j = 0，逐段比较修订号。',
  },
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    rowPointers: [{ row: 0, col: 1, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [0] }],
    note: '解析 version1 第 1 段修订号：\'1\' → a = 0×10 + 1 = 1，i 前进到 \'.\' 处停下。',
  },
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    rowPointers: [{ row: 1, col: 1, label: 'j' }],
    rowHighlight: [{ row: 1, cols: [0] }],
    note: '解析 version2 第 1 段修订号：\'1\' → b = 0×10 + 1 = 1，j 前进到 \'.\' 处停下。',
  },
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    rowPointers: [
      { row: 0, col: 2, label: 'i' },
      { row: 1, col: 2, label: 'j' },
    ],
    note: 'a = 1，b = 1，第一段相等。for 循环 ++i、++j，指针后移，继续比较下一段。',
  },
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    rowPointers: [{ row: 0, col: 2, label: 'i' }],
    rowHighlight: [{ row: 0, cols: [2] }],
    note: '解析 version1 第 2 段修订号：\'2\' → a = 0×10 + 2 = 2，i 越过字符串末尾（i = 3 = m）。',
  },
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    rowPointers: [{ row: 1, col: 3, label: 'j' }],
    rowHighlight: [{ row: 1, cols: [2, 3] }],
    note: '解析 version2 第 2 段修订号：\'1\' → b = 1，\'0\' → b = 1×10 + 0 = 10，j 越过末尾（j = 4 = n）。',
  },
  {
    rows: [['1', '.', '2'], ['1', '.', '1', '0']],
    note: 'a = 2 < b = 10，version1 < version2，返回 -1 ✅。',
  },
]
</script>

<!-- problem:start -->

# [165. 比较版本号](https://leetcode.cn/problems/compare-version-numbers)

## 题目描述

<!-- description:start -->

<p>给你两个 <strong>版本号字符串</strong>&nbsp;<code>version1</code> 和 <code>version2</code> ，请你比较它们。版本号由被点&nbsp;<code>'.'</code> 分开的修订号组成。<strong>修订号的值</strong> 是它 <strong>转换为整数</strong> 并忽略前导零。</p>

<p>比较版本号时，请按 <strong>从左到右的顺序</strong> 依次比较它们的修订号。如果其中一个版本字符串的修订号较少，则将缺失的修订号视为 <code>0</code>。</p>

<p>返回规则如下：</p>

<ul>
	<li>如果&nbsp;<code><em>version1&nbsp;</em>&lt;&nbsp;<em>version2</em></code> 返回 <code>-1</code>，</li>
	<li>如果&nbsp;<code><em>version1&nbsp;</em>&gt;&nbsp;<em>version2</em></code>&nbsp;返回&nbsp;<code>1</code>，</li>
	<li>除此之外返回 <code>0</code>。</li>
</ul>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>

<div class="example-block">
<p><strong>输入：</strong><span class="example-io">version1 = "1.2", version2 = "1.10"</span></p>

<p><strong>输出：</strong><span class="example-io">-1</span></p>

<p><strong>解释：</strong></p>

<p>version1 的第二个修订号为&nbsp;"2"，version2 的第二个修订号为 "10"：2 &lt; 10，所以 version1 &lt; version2。</p>
</div>

<p><strong class="example">示例 2：</strong></p>

<div class="example-block">
<p><strong>输入：</strong><span class="example-io">version1 = "1.01", version2 = "1.001"</span></p>

<p><strong>输出：</strong><span class="example-io">0</span></p>

<p><strong>解释：</strong></p>

<p>忽略前导零，"01" 和 "001" 都代表相同的整数 "1"。</p>
</div>

<p><strong class="example">示例 3：</strong></p>

<div class="example-block">
<p><strong>输入：</strong><span class="example-io">version1 = "1.0", version2 = "1.0.0.0"</span></p>

<p><strong>输出：</strong><span class="example-io">0</span></p>

<p><strong>解释：</strong></p>

<p>version1 有更少的修订号，每个缺失的修订号按 "0" 处理。</p>
</div>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= version1.length, version2.length &lt;= 500</code></li>
	<li><code>version1</code> 和 <code>version2</code> 仅包含数字和 <code>'.'</code></li>
	<li><code>version1</code> 和 <code>version2</code> 都是 <strong>有效版本号</strong></li>
	<li><code>version1</code> 和 <code>version2</code> 的所有修订号都可以存储在 <strong>32 位整数</strong> 中</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：双指针

同时遍历两个字符串，用两个指针 $i$ 和 $j$ 分别指向两个字符串的当前位置，初始时 $i = j = 0$。

每次取出两个字符串中对应的修订号，记为 $a$ 和 $b$，比较 $a$ 和 $b$ 的大小，如果 $a \lt b$，则返回 $-1$；如果 $a \gt b$，则返回 $1$；如果 $a = b$，则继续比较下一对修订号。

时间复杂度 $O(\max(m, n))$，空间复杂度 $O(1)$。其中 $m$ 和 $n$ 分别是两个字符串的长度。

### 可视化演示

> 以 `version1 = "1.2"`、`version2 = "1.10"` 为例，演示双指针逐段取出修订号 `a`/`b` 并比较。第一行为 `version1`、第二行为 `version2`，黄色高亮为当前解析的修订号字符，指针 `i`/`j` 为两个字符串的当前位置。

<ArrayViz :steps="compareVersionSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int compareVersion(String version1, String version2) {
        int m = version1.length(), n = version2.length();
        for (int i = 0, j = 0; i < m || j < n; ++i, ++j) {
            int a = 0, b = 0;
            while (i < m && version1.charAt(i) != '.') {
                a = a * 10 + (version1.charAt(i++) - '0');
            }
            while (j < n && version2.charAt(j) != '.') {
                b = b * 10 + (version2.charAt(j++) - '0');
            }
            if (a != b) {
                return a < b ? -1 : 1;
            }
        }
        return 0;
    }
}
```



```cpp [C++]
class Solution {
public:
    int compareVersion(string version1, string version2) {
        int m = version1.size(), n = version2.size();
        for (int i = 0, j = 0; i < m || j < n; ++i, ++j) {
            int a = 0, b = 0;
            while (i < m && version1[i] != '.') {
                a = a * 10 + (version1[i++] - '0');
            }
            while (j < n && version2[j] != '.') {
                b = b * 10 + (version2[j++] - '0');
            }
            if (a != b) {
                return a < b ? -1 : 1;
            }
        }
        return 0;
    }
};
```

```ts [TypeScript]
function compareVersion(version1: string, version2: string): number {
    const v1 = version1.split('.');
    const v2 = version2.split('.');
    for (let i = 0; i < Math.max(v1.length, v2.length); ++i) {
        const [n1, n2] = [+v1[i] || 0, +v2[i] || 0];
        if (n1 < n2) {
            return -1;
        }
        if (n1 > n2) {
            return 1;
        }
    }
    return 0;
}
```

```python [Python]
class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        m, n = len(version1), len(version2)
        i = j = 0
        while i < m or j < n:
            a = b = 0
            while i < m and version1[i] != '.':
                a = a * 10 + int(version1[i])
                i += 1
            while j < n and version2[j] != '.':
                b = b * 10 + int(version2[j])
                j += 1
            if a != b:
                return -1 if a < b else 1
            i, j = i + 1, j + 1
        return 0
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->