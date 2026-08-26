---
comments: true
difficulty: 困难
tags:
  - 哈希表
  - 字符串
  - 滑动窗口
entry: minWindow
testcases:
  - input:
      - ADOBECODEBANC
      - ABC
    output: BANC
  - input:
      - a
      - a
    output: a
  - input:
      - a
      - aa
    output: ''
---


<script setup>
// 可视化演示数据：s = "ABAC"，t = "ABC"，答案 s.slice(1, 4) = "BAC"
// 变量与代码一致：need = t 的字符要求计数；window = 当前窗口 [j, i] 内字符计数；
// cnt = 已覆盖 t 的必要字符数；cnt == n 时进入 while 收缩左边界 j；k / mi 记录最优子串起点和长度
const minWindowSteps = [
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 0 }, { label: 'i', index: -1 }],
    map: [],
    note: '初始状态：need 记录 t="ABC" 的字符要求（A=1、B=1、C=1），window 各字符计数为 0。cnt=0，j=0（窗口左边界），i 即将从 0 开始遍历 s（右边界）。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 0 }, { label: 'i', index: 0 }],
    window: [0, 0],
    highlight: [0],
    map: [{ key: 'A', value: 1 }],
    mapHighlight: [0],
    note: 'i=0：window[A]++ => 1。need[A]=1 >= window[A]=1，A 是必要字符，cnt++ => cnt=1。cnt != n(3)，窗口 [0,0]="A" 未覆盖 t，不收缩，继续扩展右边界。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 0 }, { label: 'i', index: 1 }],
    window: [0, 1],
    highlight: [1],
    map: [{ key: 'A', value: 1 }, { key: 'B', value: 1 }],
    mapHighlight: [1],
    note: 'i=1：window[B]++ => 1。need[B]=1 >= window[B]=1，B 是必要字符，cnt=2。窗口 [0,1]="AB" 仍缺 C，继续扩展右边界。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 0 }, { label: 'i', index: 2 }],
    window: [0, 2],
    highlight: [2],
    map: [{ key: 'A', value: 2 }, { key: 'B', value: 1 }],
    mapHighlight: [0],
    note: 'i=2：window[A]++ => 2。need[A]=1 < window[A]=2，A 已超出需要，cnt 不变仍为 2。窗口 [0,2]="ABA" 仍缺 C。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 0 }, { label: 'i', index: 3 }],
    window: [0, 3],
    highlight: [3],
    map: [{ key: 'A', value: 2 }, { key: 'B', value: 1 }, { key: 'C', value: 1 }],
    mapHighlight: [2],
    note: 'i=3：window[C]++ => 1。need[C]=1 >= window[C]=1，C 是必要字符，cnt=3 == n！窗口 [0,3]="ABAC" 已覆盖 t，进入 while 收缩左边界 j。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 1 }, { label: 'i', index: 3 }],
    window: [1, 3],
    highlight: [0],
    map: [{ key: 'A', value: 1 }, { key: 'B', value: 1 }, { key: 'C', value: 1 }],
    mapHighlight: [0],
    note: '收缩：i-j+1=3-0+1=4 < mi(∞)，记录 mi=4、k=0（候选 s[0:4]="ABAC"）。need[A]=1 < window[A]=2，移除 s[0]="A" 后仍满足 need，cnt 不变。window[A]-- => 1，j=1，窗口 [1,3]="BAC" 仍覆盖 t。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 2 }, { label: 'i', index: 3 }],
    window: [2, 3],
    highlight: [1],
    map: [{ key: 'A', value: 1 }, { key: 'B', value: 0 }, { key: 'C', value: 1 }],
    mapHighlight: [1],
    note: '收缩：i-j+1=3-1+1=3 < mi(4)，更新 mi=3、k=1（候选 s[1:4]="BAC"）。need[B]=1 >= window[B]=1，B 是必要字符，移除后 cnt-- => 2。window[B]-- => 0，j=2。cnt(2) != n，while 退出。',
  },
  {
    array: ['A', 'B', 'A', 'C'],
    pointers: [{ label: 'j', index: 1 }, { label: 'i', index: 3 }],
    window: [1, 3],
    highlight: [1, 2, 3],
    map: [{ key: 'A', value: 1 }, { key: 'B', value: 1 }, { key: 'C', value: 1 }],
    note: '结果：最优记录 k=1、mi=3，k >= 0，返回 s.slice(1, 1+3) = "BAC" ✅。窗口 [1,3]="BAC" 是覆盖 t 的最短子串。',
  },
]
</script>

<!-- problem:start -->

# [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring)

## 题目描述

<!-- description:start -->

<p>给你一个字符串 <code>s</code> 、一个字符串 <code>t</code> 。返回 <code>s</code> 中涵盖 <code>t</code> 所有字符的最小子串。如果 <code>s</code> 中不存在涵盖 <code>t</code> 所有字符的子串，则返回空字符串 <code>""</code> 。</p>

<p>&nbsp;</p>

<p><strong>注意：</strong></p>

<ul>
	<li>对于 <code>t</code> 中重复字符，我们寻找的子字符串中该字符数量必须不少于 <code>t</code> 中该字符数量。</li>
	<li>如果 <code>s</code> 中存在这样的子串，我们保证它是唯一的答案。</li>
</ul>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "ADOBECODEBANC", t = "ABC"
<strong>输出：</strong>"BANC"
<strong>解释：</strong>最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = "a", t = "a"
<strong>输出：</strong>"a"
<strong>解释：</strong>整个字符串 s 是最小覆盖子串。
</pre>

<p><strong>示例 3:</strong></p>

<pre>
<strong>输入:</strong> s = "a", t = "aa"
<strong>输出:</strong> ""
<strong>解释:</strong> t 中两个字符 'a' 均应包含在 s 的子串中，
因此没有符合条件的子字符串，返回空字符串。</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code><sup>m == s.length</sup></code></li>
	<li><code><sup>n == t.length</sup></code></li>
	<li><code>1 &lt;= m, n &lt;= 10<sup>5</sup></code></li>
	<li><code>s</code> 和 <code>t</code> 由英文字母组成</li>
</ul>

<p>&nbsp;</p>
<strong>进阶：</strong>你能设计一个在 <code>o(m+n)</code> 时间内解决此问题的算法吗？

<!-- description:end -->


<!-- solution:start -->

## 方法一：计数 + 双指针

我们用一个哈希表或数组 $need$ 统计字符串 $t$ 中每个字符出现的次数，用另一个哈希表或数组 $window$ 统计滑动窗口中每个字符出现的次数。另外，定义两个指针 $j$ 和 $i$ 分别指向窗口的左右边界，变量 $cnt$ 表示窗口中已经包含了 $t$ 中的多少个字符，变量 $k$ 和 $mi$ 分别表示最小覆盖子串的起始位置和长度。

我们从左到右遍历字符串 $s$，对于当前遍历到的字符 $s[i]$：

我们将其加入窗口中，即 $window[s[i]] = window[s[i]] + 1$，如果此时 $need[s[i]] \geq window[s[i]]$，则说明 $s[i]$ 是一个「必要的字符」，我们将 $cnt$ 加一。如果 $cnt$ 等于 $t$ 的长度，说明此时窗口中已经包含了 $t$ 中的所有字符，我们就可以尝试更新最小覆盖子串的起始位置和长度了。如果 $i - j + 1 \lt mi$，说明当前窗口表示的子串更短，我们就更新 $mi = i - j + 1$ 和 $k = j$。然后，我们尝试移动左边界 $j$，如果此时 $need[s[j]] \geq window[s[j]]$，则说明 $s[j]$ 是一个「必要的字符」，移动左边界时会把 $s[j]$ 这个字符从窗口中移除，因此我们需要将 $cnt$ 减一，然后更新 $window[s[j]] = window[s[j]] - 1$，并将 $j$ 右移一位。如果 $cnt$ 与 $t$ 的长度不相等，说明此时窗口中还没有包含 $t$ 中的所有字符，我们就不需要移动左边界了，直接将 $i$ 右移一位，继续遍历即可。

遍历结束，如果没有找到最小覆盖子串，返回空字符串，否则返回 $s[k:k+mi]$ 即可。

时间复杂度 $O(m + n)$，空间复杂度 $O(C)$。其中 $m$ 和 $n$ 分别是字符串 $s$ 和 $t$ 的长度；而 $C$ 是字符集的大小，本题中 $C = 128$。

## 可视化演示

> 以 `s = "ABAC"`、`t = "ABC"` 为例，演示「计数 + 双指针」滑动窗口的扩展与收缩过程。左侧数组为 `s` 字符序列，右侧哈希表为当前窗口 `window` 计数；黄色高亮为当前处理的字符/计数，指针 `j` / `i` 标记窗口左右边界，`cnt` 为已覆盖 `t` 的必要字符数。

<ArrayViz :steps="minWindowSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        int[] window = new int[128];
        int m = s.length(), n = t.length();
        for (int i = 0; i < n; ++i) {
            ++need[t.charAt(i)];
        }
        int cnt = 0, j = 0, k = -1, mi = 1 << 30;
        for (int i = 0; i < m; ++i) {
            ++window[s.charAt(i)];
            if (need[s.charAt(i)] >= window[s.charAt(i)]) {
                ++cnt;
            }
            while (cnt == n) {
                if (i - j + 1 < mi) {
                    mi = i - j + 1;
                    k = j;
                }
                if (need[s.charAt(j)] >= window[s.charAt(j)]) {
                    --cnt;
                }
                --window[s.charAt(j++)];
            }
        }
        return k < 0 ? "" : s.substring(k, k + mi);
    }
}
```



```cpp [C++]
class Solution {
public:
    string minWindow(string s, string t) {
        int need[128]{};
        int window[128]{};
        int m = s.size(), n = t.size();
        for (char& c : t) {
            ++need[c];
        }
        int cnt = 0, j = 0, k = -1, mi = 1 << 30;
        for (int i = 0; i < m; ++i) {
            ++window[s[i]];
            if (need[s[i]] >= window[s[i]]) {
                ++cnt;
            }
            while (cnt == n) {
                if (i - j + 1 < mi) {
                    mi = i - j + 1;
                    k = j;
                }
                if (need[s[j]] >= window[s[j]]) {
                    --cnt;
                }
                --window[s[j++]];
            }
        }
        return k < 0 ? "" : s.substr(k, mi);
    }
};
```

```ts [TypeScript]
function minWindow(s: string, t: string): string {
    const need: number[] = new Array(128).fill(0);
    const window: number[] = new Array(128).fill(0);
    for (const c of t) {
        ++need[c.charCodeAt(0)];
    }
    let cnt = 0;
    let j = 0;
    let k = -1;
    let mi = 1 << 30;
    for (let i = 0; i < s.length; ++i) {
        ++window[s.charCodeAt(i)];
        if (need[s.charCodeAt(i)] >= window[s.charCodeAt(i)]) {
            ++cnt;
        }
        while (cnt === t.length) {
            if (i - j + 1 < mi) {
                mi = i - j + 1;
                k = j;
            }
            if (need[s.charCodeAt(j)] >= window[s.charCodeAt(j)]) {
                --cnt;
            }
            --window[s.charCodeAt(j++)];
        }
    }
    return k < 0 ? '' : s.slice(k, k + mi);
}
```

```python [Python]
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        window = Counter()
        cnt, j, k, mi = 0, 0, -1, inf
        for i, c in enumerate(s):
            window[c] += 1
            if need[c] >= window[c]:
                cnt += 1
            while cnt == len(t):
                if i - j + 1 < mi:
                    mi = i - j + 1
                    k = j
                if need[s[j]] >= window[s[j]]:
                    cnt -= 1
                window[s[j]] -= 1
                j += 1
        return '' if k < 0 else s[k : k + mi]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->