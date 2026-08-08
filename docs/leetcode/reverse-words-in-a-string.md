---
comments: true
difficulty: 中等

tags:
    - 双指针
    - 字符串
---

<script setup>
// 方法一（双指针）可视化：s = "the sky is blue" → "blue is sky the"
// rows 模式：第 0 行为字符串字符，第 1 行为收集到的 words 列表（逐步增长，最后反转）
const reverseWordsTwoPointerSteps = [
  {
    rows: [
      ['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e'],
      [],
    ],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 0, col: 0, label: 'j' },
    ],
    note: 's.trim() = "the sky is blue"，n=15，words=[]，i=0。开始扫描提取单词。',
  },
  {
    rows: [
      ['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e'],
      ['the'],
    ],
    rowPointers: [
      { row: 0, col: 0, label: 'i' },
      { row: 0, col: 3, label: 'j' },
    ],
    rowHighlight: [
      { row: 0, cols: [0, 1, 2] },
      { row: 1, cols: [0] },
    ],
    note: 'i=0 处非空格，j 向右扫到 s[3]=" " 停下：s[0..2]="the"，words.push("the")，i=j=3。',
  },
  {
    rows: [
      ['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e'],
      ['the', 'sky'],
    ],
    rowPointers: [
      { row: 0, col: 4, label: 'i' },
      { row: 0, col: 7, label: 'j' },
    ],
    rowHighlight: [
      { row: 0, cols: [4, 5, 6] },
      { row: 1, cols: [1] },
    ],
    note: 'i 跳过 s[3]=" " 到 4，j 扫到 s[7]=" " 停下：s[4..6]="sky"，words=["the","sky"]，i=j=7。',
  },
  {
    rows: [
      ['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e'],
      ['the', 'sky', 'is'],
    ],
    rowPointers: [
      { row: 0, col: 8, label: 'i' },
      { row: 0, col: 10, label: 'j' },
    ],
    rowHighlight: [
      { row: 0, cols: [8, 9] },
      { row: 1, cols: [2] },
    ],
    note: 'i 跳过空格到 8，j 扫到 s[10]=" " 停下：s[8..9]="is"，words=["the","sky","is"]，i=j=10。',
  },
  {
    rows: [
      ['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e'],
      ['the', 'sky', 'is', 'blue'],
    ],
    rowPointers: [
      { row: 0, col: 11, label: 'i' },
      { row: 0, col: 14, label: 'j' },
    ],
    rowHighlight: [
      { row: 0, cols: [11, 12, 13, 14] },
      { row: 1, cols: [3] },
    ],
    note: 'i 跳过空格到 11，j 一直扫到字符串末尾 s[14]="e"：s[11..14]="blue"，words 加入 "blue"，i=j=15，i<n 不成立循环结束。',
  },
  {
    rows: [
      ['t', 'h', 'e', ' ', 's', 'k', 'y', ' ', 'i', 's', ' ', 'b', 'l', 'u', 'e'],
      ['blue', 'is', 'sky', 'the'],
    ],
    rowHighlight: [{ row: 1, cols: [0, 1, 2, 3] }],
    note: 'words.reverse() 反转列表 → ["blue","is","sky","the"]；String.join(" ", words) → "blue is sky the" ✅。',
  },
]

// 方法二（字符串分割）可视化：s = "  hello world  " → "world hello"
// rows 模式：第 0 行原始 s，第 1 行 s.trim() 结果，第 2 行分割后的 words，第 3 行反转后的 words
const reverseWordsSplitSteps = [
  {
    rows: [
      [' ', ' ', 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', ' ', ' '],
      [],
      [],
      [],
    ],
    note: '方法二：使用语言内置分割函数。s = "  hello world  "（含前导、尾随空格）。',
  },
  {
    rows: [
      [' ', ' ', 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', ' ', ' '],
      ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'],
      [],
      [],
    ],
    rowHighlight: [{ row: 1, cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }],
    note: 's.trim() 去掉首尾空格 → "hello world"。',
  },
  {
    rows: [
      [' ', ' ', 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', ' ', ' '],
      ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'],
      ['hello', 'world'],
      [],
    ],
    rowHighlight: [{ row: 2, cols: [0, 1] }],
    note: 'split 按空白字符分割（正则 \\s+，匹配一个或多个空格）→ words = ["hello","world"]。',
  },
  {
    rows: [
      [' ', ' ', 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', ' ', ' '],
      ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'],
      ['world', 'hello'],
      [],
    ],
    rowHighlight: [{ row: 2, cols: [0, 1] }],
    note: 'Collections.reverse(words)（TS: .reverse()，Python: reversed(words)）反转列表 → ["world","hello"]。',
  },
  {
    rows: [
      [' ', ' ', 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', ' ', ' '],
      ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'],
      ['world', 'hello'],
      [],
    ],
    note: 'String.join(" ", words)（Python: " ".join(...)）拼接 → "world hello" ✅。',
  },
]
</script>

<!-- problem:start -->

# [151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string)

## 题目描述

<!-- description:start -->

<p>给你一个字符串 <code>s</code> ，请你反转字符串中 <strong>单词</strong> 的顺序。</p>

<p><strong>单词</strong> 是由非空格字符组成的字符串。<code>s</code> 中使用至少一个空格将字符串中的 <strong>单词</strong> 分隔开。</p>

<p>返回 <strong>单词</strong> 顺序颠倒且 <strong>单词</strong> 之间用单个空格连接的结果字符串。</p>

<p><strong>注意：</strong>输入字符串 <code>s</code>中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "<code>the sky is blue</code>"
<strong>输出：</strong>"<code>blue is sky the</code>"
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = " &nbsp;hello world &nbsp;"
<strong>输出：</strong>"world hello"
<strong>解释：</strong>反转后的字符串中不能存在前导空格和尾随空格。
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>s = "a good &nbsp; example"
<strong>输出：</strong>"example good a"
<strong>解释：</strong>如果两个单词间有多余的空格，反转后的字符串需要将单词间的空格减少到仅有一个。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s</code> 包含英文大小写字母、数字和空格 <code>' '</code></li>
	<li><code>s</code> 中 <strong>至少存在一个</strong> 单词</li>
</ul>

<ul>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>如果字符串在你使用的编程语言中是一种可变数据类型，请尝试使用&nbsp;<code>O(1)</code> 额外空间复杂度的 <strong>原地</strong> 解法。</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一：双指针

我们可以使用双指针 $i$ 和 $j$，每次找到一个单词，将其添加到结果列表中，最后将结果列表反转，再拼接成字符串即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串的长度。

### 可视化演示

> 以 `s = "the sky is blue"` 为例，演示双指针提取单词并反转：第 0 行为字符串字符，第 1 行为收集到的 `words` 列表；指针 `i`/`j` 标出当前单词边界，黄色高亮为正在提取的字符或刚写入的单词。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="reverseWordsTwoPointerSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public String reverseWords(String s) {
        if (s == null || s.length() == 0) {
            return "";
        }

        // 去除前后空格的字符串
        s = s.trim();
        int i = 0;
        int n = s.length();
        List<String> ans = new ArrayList<>();

        while (i < n) {
            // 如果是空串则跳过
            while (s.charAt(i) == ' ') {
                i++;
            }
            // 双指针找到下一个单词的位置
            int j = i;
            StringBuilder builder = new StringBuilder();
            while (j < n && s.charAt(j) != ' ') {
                builder.append(s.charAt(j));
                j++;
            }
            ans.add(builder.toString());
            i = j;
        }

        Collections.reverse(ans);
        return String.join(" ", ans);
    }
}
```


```cpp [C++]
class Solution {
public:
    string reverseWords(string s) {
        int i = 0;
        int j = 0;
        int n = s.size();
        while (i < n) {
            while (i < n && s[i] == ' ') {
                ++i;
            }
            if (i < n) {
                if (j != 0) {
                    s[j++] = ' ';
                }
                int k = i;
                while (k < n && s[k] != ' ') {
                    s[j++] = s[k++];
                }
                reverse(s.begin() + j - (k - i), s.begin() + j);
                i = k;
            }
        }
        s.erase(s.begin() + j, s.end());
        reverse(s.begin(), s.end());
        return s;
    }
};
```

```ts [TypeScript]
function reverseWords(s: string): string {
    const words: string[] = [];
    const n = s.length;
    let i = 0;
    while (i < n) {
        while (i < n && s[i] === ' ') {
            i++;
        }
        if (i < n) {
            let j = i;
            while (j < n && s[j] !== ' ') {
                j++;
            }
            words.push(s.slice(i, j));
            i = j;
        }
    }
    return words.reverse().join(' ');
}
```

```python [Python]
class Solution:
    def reverseWords(self, s: str) -> str:
        words = []
        i, n = 0, len(s)
        while i < n:
            while i < n and s[i] == " ":
                i += 1
            if i < n:
                j = i
                while j < n and s[j] != " ":
                    j += 1
                words.append(s[i:j])
                i = j
        return " ".join(words[::-1])
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：字符串分割

我们可以使用语言内置的字符串分割函数，将字符串按空格分割成单词列表，然后将列表反转，再拼接成字符串即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串的长度。

### 可视化演示

> 以 `s = "  hello world  "` 为例，演示内置分割解法：第 0 行为原始字符串，第 1 行为 `s.trim()` 结果，第 2 行为分割出的 `words` 列表，第 3 行为反转后的列表。黄色高亮为当前步骤产生的结果行。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="reverseWordsSplitSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public String reverseWords(String s) {
        List<String> words = Arrays.asList(s.trim().split("\\s+"));
        Collections.reverse(words);
        return String.join(" ", words);
    }
}
```



```ts [TypeScript]
function reverseWords(s: string): string {
    return s.trim().split(/\s+/).reverse().join(' ');
}
```

```python [Python]
class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(reversed(s.split()))
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->