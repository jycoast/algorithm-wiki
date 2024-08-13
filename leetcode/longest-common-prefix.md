---
comments: true
difficulty: 简单
edit_url: https://github.com/doocs/leetcode/edit/main/solution/0000-0099/0014.Longest%20Common%20Prefix/README.md
tags:
    - 字典树
    - 字符串
---

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

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String longestCommonPrefix(String[] strs) {
        int n = strs.length;
        for (int i = 0; i < strs[0].length(); ++i) {
            for (int j = 1; j < n; ++j) {
                if (strs[j].length() <= i || strs[j].charAt(i) != strs[0].charAt(i)) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0];
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