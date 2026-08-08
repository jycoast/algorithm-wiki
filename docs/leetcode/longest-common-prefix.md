---
comments: true
difficulty: 简单

tags:
    - 字典树
    - 字符串
entry: longestCommonPrefix
testcases:
  - input: [["flower", "flow", "flight"]]
    output: "fl"
  - input: [["dog", "racecar", "car"]]
    output: ""
---

<script setup>
// 方法一（字符比较/纵向扫描）可视化：strs = ["flower", "flow", "flight"] → "fl"
// rows 模式：第 0 行 strs[0]、第 1 行 strs[1]、第 2 行 strs[2]，i 为当前比较的列
const longestCommonPrefixSteps = [
  {
    rows: [
      ['f', 'l', 'o', 'w', 'e', 'r'],
      ['f', 'l', 'o', 'w'],
      ['f', 'l', 'i', 'g', 'h', 't'],
    ],
    note: 'strs = ["flower", "flow", "flight"]。以 strs[0] 为基准，纵向逐列比较各字符串的第 i 个字符（strs[j][i] 与 strs[0][i]）。',
  },
  {
    rows: [
      ['f', 'l', 'o', 'w', 'e', 'r'],
      ['f', 'l', 'o', 'w'],
      ['f', 'l', 'i', 'g', 'h', 't'],
    ],
    rowPointers: [{ row: 0, col: 0, label: 'i' }],
    rowHighlight: [
      { row: 0, cols: [0] },
      { row: 1, cols: [0] },
      { row: 2, cols: [0] },
    ],
    note: 'i=0：strs[1][0]="f"、strs[2][0]="f" 均等于 strs[0][0]="f"，第 0 列全部相同，继续比较下一列。',
  },
  {
    rows: [
      ['f', 'l', 'o', 'w', 'e', 'r'],
      ['f', 'l', 'o', 'w'],
      ['f', 'l', 'i', 'g', 'h', 't'],
    ],
    rowPointers: [{ row: 0, col: 1, label: 'i' }],
    rowHighlight: [
      { row: 0, cols: [1] },
      { row: 1, cols: [1] },
      { row: 2, cols: [1] },
    ],
    note: 'i=1：strs[1][1]="l"、strs[2][1]="l" 均等于 strs[0][1]="l"，第 1 列全部相同，继续比较下一列。',
  },
  {
    rows: [
      ['f', 'l', 'o', 'w', 'e', 'r'],
      ['f', 'l', 'o', 'w'],
      ['f', 'l', 'i', 'g', 'h', 't'],
    ],
    rowPointers: [{ row: 0, col: 2, label: 'i' }],
    rowHighlight: [
      { row: 0, cols: [2] },
      { row: 1, cols: [2] },
      { row: 2, cols: [2] },
    ],
    note: 'i=2：strs[1][2]="o" 与 strs[0][2]="o" 相同，但 strs[2][2]="i" ≠ "o"，出现不匹配 → 返回 strs[0].substr(0, 2) = "fl" ✅',
  },
]
</script>

<!-- problem:start -->

# [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix)

## 题目描述

<!-- description:start -->

<p>编写一个函数来查找字符串数组中的最长公共前缀。</p>

<p>如果不存在公共前缀，返回空字符串&nbsp;<code>""</code>。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>

<pre>
<strong>输入：</strong>strs = ["flower","flow","flight"]
<strong>输出：</strong>"fl"
</pre>

<p><strong class="example">示例 2：</strong></p>

<pre>
<strong>输入：</strong>strs = ["dog","racecar","car"]
<strong>输出：</strong>""
<strong>解释：</strong>输入不存在公共前缀。</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= strs.length &lt;= 200</code></li>
	<li><code>0 &lt;= strs[i].length &lt;= 200</code></li>
	<li><code>strs[i]</code> 仅由小写英文字母组成</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：字符比较

我们以第一个字符串 $strs[0]$ 为基准，依次比较后面的字符串的第 $i$ 个字符是否与 $strs[0]$ 的第 $i$ 个字符相同，如果相同则继续比较下一个字符，否则返回 $strs[0]$ 的前 $i$ 个字符。

遍历结束，说明所有字符串的前 $i$ 个字符都相同，返回 $strs[0]$ 即可。

时间复杂度 $(n \times m)$，其中 $n$ 和 $m$ 分别为字符串数组的长度以及字符串的最小长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `strs = ["flower", "flow", "flight"]` 为例，演示纵向逐列比较：第 0 行 `strs[0]`、第 1 行 `strs[1]`、第 2 行 `strs[2]`，指针 `i` 指向当前比较的列，黄色高亮为该列正在比较的字符。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="longestCommonPrefixSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";

        String prefix = strs[0]; // 设定第一个字符串为初始公共前缀

        for (int i = 1; i < strs.length; i++) {
            // 如果当前字符串不是以 prefix 开头，就缩短 prefix
            while (!strs[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }

        return prefix;
    }
}

```

```cpp [C++]
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        int n = strs.size();
        for (int i = 0; i < strs[0].size(); ++i) {
            for (int j = 1; j < n; ++j) {
                if (strs[j].size() <= i || strs[j][i] != strs[0][i]) {
                    return strs[0].substr(0, i);
                }
            }
        }
        return strs[0];
    }
};
```

```ts [TypeScript]
function longestCommonPrefix(strs: string[]): string {
    const len = strs.reduce((r, s) => Math.min(r, s.length), Infinity);
    for (let i = len; i > 0; i--) {
        const target = strs[0].slice(0, i);
        if (strs.every(s => s.slice(0, i) === target)) {
            return target;
        }
    }
    return '';
}
```

```python [Python]
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        for i in range(len(strs[0])):
            for s in strs[1:]:
                if len(s) <= i or s[i] != strs[0][i]:
                    return s[:i]
        return strs[0]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->