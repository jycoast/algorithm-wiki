---
comments: true
tags:
    - 哈希表
    - 字符串
    - 滑动窗口
---

<!-- problem:start -->

# [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters)



<!-- description:start -->

<p>给定一个字符串 <code>s</code> ，请你找出其中不含有重复字符的&nbsp;<strong>最长 <span data-keyword="substring-nonempty">子串</span></strong><strong>&nbsp;</strong>的长度。</p>

<p>&nbsp;</p>

<p><strong>示例&nbsp;1:</strong></p>

<pre>
<strong>输入: </strong>s = "abcabcbb"
<strong>输出: </strong>3 
<strong>解释:</strong> 因为无重复字符的最长子串是 <code>"abc"</code>，所以其长度为 3。
</pre>

<p><strong>示例 2:</strong></p>

<pre>
<strong>输入: </strong>s = "bbbbb"
<strong>输出: </strong>1
<strong>解释: </strong>因为无重复字符的最长子串是 <code>"b"</code>，所以其长度为 1。
</pre>

<p><strong>示例 3:</strong></p>

<pre>
<strong>输入: </strong>s = "pwwkew"
<strong>输出: </strong>3
<strong>解释: </strong>因为无重复字符的最长子串是&nbsp;<code>"wke"</code>，所以其长度为 3。
&nbsp;    请注意，你的答案必须是 <strong>子串 </strong>的长度，<code>"pwke"</code>&nbsp;是一个<em>子序列，</em>不是子串。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>s</code>&nbsp;由英文字母、数字、符号和空格组成</li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：双指针 + 哈希表

定义一个哈希表记录当前窗口内出现的字符，记 $i$ 和 $j$ 分别表示不重复子串的开始位置和结束位置，无重复字符子串的最大长度记为 `ans`。

遍历字符串 `s` 的每个字符 $s[j]$，我们记为 $c$。若 $s[i..j-1]$ 窗口内存在 $c$，则 $i$ 循环向右移动，更新哈希表，直至 $s[i..j-1]$ 窗口不存在 `c`，循环结束。将 `c` 加入哈希表中，此时 $s[i..j]$ 窗口内不含重复元素，更新 `ans` 的最大值。

最后返回 `ans` 即可。

时间复杂度 $O(n)$，其中 $n$ 表示字符串 `s` 的长度。

双指针算法模板：

```java
for (int i = 0, j = 0; i < n; ++i) {
    while (j < i && check(j, i)) {
        ++j;
    }
    // 具体问题的逻辑
}
```

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int lengthOfLongestSubstring(String s) {
        boolean[] ss = new boolean[128];
        int ans = 0;
        for (int i = 0, j = 0; j < s.length(); ++j) {
            char c = s.charAt(j);
            while (ss[c]) {
                ss[s.charAt(i++)] = false;
            }
            ss[c] = true;
            ans = Math.max(ans, j - i + 1);
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        bool ss[128]{};
        int ans = 0;
        for (int i = 0, j = 0; j < s.size(); ++j) {
            while (ss[s[j]]) {
                ss[s[i++]] = false;
            }
            ss[s[j]] = true;
            ans = max(ans, j - i + 1);
        }
        return ans;
    }
};
```

```ts [TypeScript]
function lengthOfLongestSubstring(s: string): number {
    let ans = 0;
    const ss: Set<string> = new Set();
    for (let i = 0, j = 0; j < s.length; ++j) {
        while (ss.has(s[j])) {
            ss.delete(s[i++]);
        }
        ss.add(s[j]);
        ans = Math.max(ans, j - i + 1);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        ss = set()
        ans = i = 0
        for j, c in enumerate(s):
            while c in ss:
                ss.remove(s[i])
                i += 1
            ss.add(c)
            ans = max(ans, j - i + 1)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
