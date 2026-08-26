---
comments: true
difficulty: 中等
tags:
  - 字典树
  - 记忆化搜索
  - 数组
  - 哈希表
  - 字符串
  - 动态规划
entry: wordBreak
testcases:
  - input:
      - leetcode
      - - leet
        - code
    output: true
  - input:
      - applepenapple
      - - apple
        - pen
    output: true
  - input:
      - catsandog
      - - cats
        - dog
        - sand
        - and
        - cat
    output: false
---


<script setup>
// 方法一（哈希表 + 动态规划）可视化：s = "leetcode"，wordDict = ["leet", "code"]，答案 true
// f[i] 表示 s 前 i 个字符能否被拆分（1=true，0=false），f[0]=true；
// 若存在 j ∈ [0, i)，使 f[j] 为真且 s[j..i) 在 wordDict 中，则 f[i]=true。
const prefixLabels = [
  { i: 0, text: '∅' }, { i: 1, text: 'l' }, { i: 2, text: 'le' }, { i: 3, text: 'lee' },
  { i: 4, text: 'leet' }, { i: 5, text: 'leetc' }, { i: 6, text: 'leetco' },
  { i: 7, text: 'leetcod' }, { i: 8, text: 'leetcode' },
]
const wordBreakSteps = [
  { dp: [1, null, null, null, null, null, null, null, null], dpStates: [{ i: 0, state: 'cur' }], pointers: [{ i: 0, label: 'i' }], dpLabels: prefixLabels, note: '初始化：f[0] = true（空串可拆分）。f 数组共 9 格（下标 0..8），值为 1（true）或 0（false），格子下方标注对应的前缀 s[0..i)。' },
  { dp: [1, 0, 0, 0, null, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'cur' }], pointers: [{ i: 3, label: 'i' }], dpLabels: prefixLabels, note: 'i=1、2、3：枚举 j<i，s.substring(j,i) 为 "l"、"le"、"lee"，均不在字典中 → f[1]=f[2]=f[3]=0。' },
  { dp: [1, 0, 0, 0, 1, null, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'cur' }], pointers: [{ i: 4, label: 'i' }], dpLabels: prefixLabels, note: 'i=4：j=0 时 f[0]=true 且 s.substring(0,4)="leet" ∈ wordDict → f[4]=true！' },
  { dp: [1, 0, 0, 0, 1, 0, null, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'cur' }], pointers: [{ i: 5, label: 'i' }], dpLabels: prefixLabels, note: 'i=5：j=0 时 "leetc" 不在字典；j=4 时 "c" 不在字典 → f[5]=0。' },
  { dp: [1, 0, 0, 0, 1, 0, 0, null, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'cur' }], pointers: [{ i: 6, label: 'i' }], dpLabels: prefixLabels, note: 'i=6：j=0 时 "leetco" 不在字典；j=4 时 "co" 不在字典 → f[6]=0。' },
  { dp: [1, 0, 0, 0, 1, 0, 0, 0, null], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'done' }, { i: 7, state: 'cur' }], pointers: [{ i: 7, label: 'i' }], dpLabels: prefixLabels, note: 'i=7：j=0 时 "leetcod" 不在字典；j=4 时 "cod" 不在字典 → f[7]=0。' },
  { dp: [1, 0, 0, 0, 1, 0, 0, 0, 1], dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'done' }, { i: 7, state: 'done' }, { i: 8, state: 'mark' }], pointers: [{ i: 8, label: 'i' }], dpLabels: prefixLabels, note: 'i=8：j=4 时 f[4]=true 且 s.substring(4,8)="code" ∈ wordDict → f[8]=true。答案 true ✅（"leet" + "code" 拆分）。' },
]
// 方法二（前缀树 + 动态规划）可视化：f[i] 表示 s[i..n) 能否被拆分（1=true，0=false），f[n]=true，从右往左倒序计算
const suffixLabels = [
  { i: 0, text: 'leetcode' }, { i: 1, text: 'eetcode' }, { i: 2, text: 'etcode' },
  { i: 3, text: 'tcode' }, { i: 4, text: 'code' }, { i: 5, text: 'ode' },
  { i: 6, text: 'de' }, { i: 7, text: 'e' }, { i: 8, text: '∅' },
]
const wordBreakTrieSteps = [
  { dp: [null, null, null, null, null, null, null, null, 1], dpStates: [{ i: 8, state: 'cur' }], pointers: [{ i: 8, label: 'i' }], dpLabels: suffixLabels, note: '初始化：f[8] = true（末尾哨兵，空后缀可拆分）。格子下方标注对应的后缀 s[i..8)，从右往左倒序计算 f[i]。' },
  { dp: [null, null, null, null, null, null, null, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'cur' }], pointers: [{ i: 7, label: 'i' }], dpLabels: suffixLabels, note: 'i=7：s[7]="e"，字典树根节点只有 "leet" 的 l 分支与 "code" 的 c 分支，无 "e" 分支 → break，f[7]=0。' },
  { dp: [null, null, null, null, null, null, 0, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'done' }, { i: 6, state: 'cur' }], pointers: [{ i: 6, label: 'i' }], dpLabels: suffixLabels, note: 'i=6：s[6]="d"，根节点无 "d" 分支 → break，f[6]=0。' },
  { dp: [null, null, null, null, null, 0, 0, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'done' }, { i: 6, state: 'done' }, { i: 5, state: 'cur' }], pointers: [{ i: 5, label: 'i' }], dpLabels: suffixLabels, note: 'i=5：s[5]="o"，根节点无 "o" 分支 → break，f[5]=0。' },
  { dp: [null, null, null, null, 1, 0, 0, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'done' }, { i: 6, state: 'done' }, { i: 5, state: 'done' }, { i: 4, state: 'cur' }], pointers: [{ i: 4, label: 'i' }], dpLabels: suffixLabels, note: 'i=4：沿字典树匹配 c→o→d→e 到达 "code" 词尾，且 f[4+4]=f[8]=true → f[4]=true！' },
  { dp: [null, null, null, 0, 1, 0, 0, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'done' }, { i: 6, state: 'done' }, { i: 5, state: 'done' }, { i: 4, state: 'done' }, { i: 3, state: 'cur' }], pointers: [{ i: 3, label: 'i' }], dpLabels: suffixLabels, note: 'i=3：s[3]="t"，根节点无 "t" 分支 → break，f[3]=0。' },
  { dp: [null, null, 0, 0, 1, 0, 0, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'done' }, { i: 6, state: 'done' }, { i: 5, state: 'done' }, { i: 4, state: 'done' }, { i: 3, state: 'done' }, { i: 2, state: 'cur' }], pointers: [{ i: 2, label: 'i' }], dpLabels: suffixLabels, note: 'i=2：s[2]="e"，根节点无 "e" 分支 → break，f[2]=0。' },
  { dp: [null, 0, 0, 0, 1, 0, 0, 0, 1], dpStates: [{ i: 8, state: 'done' }, { i: 7, state: 'done' }, { i: 6, state: 'done' }, { i: 5, state: 'done' }, { i: 4, state: 'done' }, { i: 3, state: 'done' }, { i: 2, state: 'done' }, { i: 1, state: 'cur' }], pointers: [{ i: 1, label: 'i' }], dpLabels: suffixLabels, note: 'i=1：s[1]="e"，根节点无 "e" 分支 → break，f[1]=0。' },
  { dp: [1, 0, 0, 0, 1, 0, 0, 0, 1], dpStates: [{ i: 0, state: 'mark' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'done' }, { i: 6, state: 'done' }, { i: 7, state: 'done' }, { i: 8, state: 'done' }], pointers: [{ i: 0, label: 'i' }], dpLabels: suffixLabels, note: 'i=0：沿字典树匹配 l→e→e→t 到达 "leet" 词尾，且 f[0+4]=f[4]=true → f[0]=true。答案 f[0]=true ✅（"leet" + "code" 拆分）。' },
]
</script>

<!-- problem:start -->

# [139. 单词拆分](https://leetcode.cn/problems/word-break)

## 题目描述

<!-- description:start -->

<p>给你一个字符串 <code>s</code> 和一个字符串列表 <code>wordDict</code> 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 <code>s</code>&nbsp;则返回 <code>true</code>。</p>

<p><strong>注意：</strong>不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入:</strong> s = "leetcode", wordDict = ["leet", "code"]
<strong>输出:</strong> true
<strong>解释:</strong> 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入:</strong> s = "applepenapple", wordDict = ["apple", "pen"]
<strong>输出:</strong> true
<strong>解释:</strong> 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
&nbsp;    注意，你可以重复使用字典中的单词。
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入:</strong> s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
<strong>输出:</strong> false
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 300</code></li>
	<li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>
	<li><code>1 &lt;= wordDict[i].length &lt;= 20</code></li>
	<li><code>s</code> 和 <code>wordDict[i]</code> 仅由小写英文字母组成</li>
	<li><code>wordDict</code> 中的所有字符串 <strong>互不相同</strong></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：哈希表 + 动态规划

我们定义 $f[i]$ 表示字符串 $s$ 的前 $i$ 个字符能否拆分成 $wordDict$ 中的单词，初始时 $f[0]=true$，其余为 $false$。答案为 $f[n]$。

考虑 $f[i]$，如果存在 $j \in [0, i)$ 使得 $f[j] \land s[j:i] \in wordDict$，则 $f[i]=true$。为了优化效率，我们可以使用哈希表存储 $wordDict$ 中的单词，这样可以快速判断 $s[j:i]$ 是否在 $wordDict$ 中。

时间复杂度 $O(n^3)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "leetcode"`、`wordDict = ["leet", "code"]` 为例，演示动态规划：`f[i]` 表示 `s` 前 `i` 个字符能否被拆分（1=true，0=false），存在 `j` 使 `f[j]` 为真且 `s[j..i)` 在字典中则 `f[i]` 为真。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="wordBreakSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> words = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] f = new boolean[n + 1];
        f[0] = true;
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (f[j] && words.contains(s.substring(j, i))) {
                    f[i] = true;
                    break;
                }
            }
        }
        return f[n];
    }
}
```



```cpp [C++]
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> words(wordDict.begin(), wordDict.end());
        int n = s.size();
        bool f[n + 1];
        memset(f, false, sizeof(f));
        f[0] = true;
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (f[j] && words.count(s.substr(j, i - j))) {
                    f[i] = true;
                    break;
                }
            }
        }
        return f[n];
    }
};
```

```ts [TypeScript]
function wordBreak(s: string, wordDict: string[]): boolean {
    const words = new Set(wordDict);
    const n = s.length;
    const f: boolean[] = new Array(n + 1).fill(false);
    f[0] = true;
    for (let i = 1; i <= n; ++i) {
        for (let j = 0; j < i; ++j) {
            if (f[j] && words.has(s.substring(j, i))) {
                f[i] = true;
                break;
            }
        }
    }
    return f[n];
}
```

```python [Python]
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        n = len(s)
        f = [True] + [False] * n
        for i in range(1, n + 1):
            f[i] = any(f[j] and s[j:i] in words for j in range(i))
        return f[n]
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：前缀树 + 动态规划

我们先将 $wordDict$ 中的单词存入前缀树中，然后使用动态规划求解。

我们定义 $f[i]$ 表示从字符串 $s$ 的第 $i$ 个字符开始往后拆分，能否拆分成 $wordDict$ 中的单词，初始时 $f[n]=true$，其余为 $false$。答案为 $f[0]$。

接下来，我们从大到小枚举 $i$，对于每个 $i$，我们从 $i$ 开始往后拆分，如果 $s[i:j]$ 在前缀树中，且 $f[j+1]=true$，则 $f[i]=true$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "leetcode"`、`wordDict = ["leet", "code"]` 为例，演示前缀树（字典树）+ 动态规划：`f[i]` 表示 `s` 从第 `i` 个字符开始的后缀 `s[i..n)` 能否被拆分（1=true，0=false），`f[n]=true`，从右往左倒序计算；在字典树中匹配到完整单词且其后缀可拆分则 `f[i]` 为真。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="wordBreakTrieSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Trie trie = new Trie();
        for (String w : wordDict) {
            trie.insert(w);
        }
        int n = s.length();
        boolean[] f = new boolean[n + 1];
        f[n] = true;
        for (int i = n - 1; i >= 0; --i) {
            Trie node = trie;
            for (int j = i; j < n; ++j) {
                int k = s.charAt(j) - 'a';
                if (node.children[k] == null) {
                    break;
                }
                node = node.children[k];
                if (node.isEnd && f[j + 1]) {
                    f[i] = true;
                    break;
                }
            }
        }
        return f[0];
    }
}

class Trie {
    Trie[] children = new Trie[26];
    boolean isEnd = false;

    public void insert(String w) {
        Trie node = this;
        for (int i = 0; i < w.length(); ++i) {
            int j = w.charAt(i) - 'a';
            if (node.children[j] == null) {
                node.children[j] = new Trie();
            }
            node = node.children[j];
        }
        node.isEnd = true;
    }
}
```



```cpp [C++]
class Trie {
public:
    vector<Trie*> children;
    bool isEnd;
    Trie()
        : children(26)
        , isEnd(false) {}

    void insert(string word) {
        Trie* node = this;
        for (char c : word) {
            c -= 'a';
            if (!node->children[c]) node->children[c] = new Trie();
            node = node->children[c];
        }
        node->isEnd = true;
    }
};

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        Trie trie;
        for (auto& w : wordDict) {
            trie.insert(w);
        }
        int n = s.size();
        vector<bool> f(n + 1);
        f[n] = true;
        for (int i = n - 1; ~i; --i) {
            Trie* node = &trie;
            for (int j = i; j < n; ++j) {
                int k = s[j] - 'a';
                if (!node->children[k]) {
                    break;
                }
                node = node->children[k];
                if (node->isEnd && f[j + 1]) {
                    f[i] = true;
                    break;
                }
            }
        }
        return f[0];
    }
};
```

```ts [TypeScript]
function wordBreak(s: string, wordDict: string[]): boolean {
    const trie = new Trie();
    for (const w of wordDict) {
        trie.insert(w);
    }
    const n = s.length;
    const f: boolean[] = new Array(n + 1).fill(false);
    f[n] = true;
    for (let i = n - 1; i >= 0; --i) {
        let node: Trie = trie;
        for (let j = i; j < n; ++j) {
            const k = s.charCodeAt(j) - 97;
            if (!node.children[k]) {
                break;
            }
            node = node.children[k];
            if (node.isEnd && f[j + 1]) {
                f[i] = true;
                break;
            }
        }
    }
    return f[0];
}

class Trie {
    children: Trie[];
    isEnd: boolean;

    constructor() {
        this.children = new Array(26);
        this.isEnd = false;
    }

    insert(w: string): void {
        let node: Trie = this;
        for (const c of w) {
            const i = c.charCodeAt(0) - 97;
            if (!node.children[i]) {
                node.children[i] = new Trie();
            }
            node = node.children[i];
        }
        node.isEnd = true;
    }
}
```

```python [Python]
class Trie:
    def __init__(self):
        self.children: List[Trie | None] = [None] * 26
        self.isEnd = False

    def insert(self, w: str):
        node = self
        for c in w:
            idx = ord(c) - ord('a')
            if not node.children[idx]:
                node.children[idx] = Trie()
            node = node.children[idx]
        node.isEnd = True


class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        trie = Trie()
        for w in wordDict:
            trie.insert(w)
        n = len(s)
        f = [False] * (n + 1)
        f[n] = True
        for i in range(n - 1, -1, -1):
            node = trie
            for j in range(i, n):
                idx = ord(s[j]) - ord('a')
                if not node.children[idx]:
                    break
                node = node.children[idx]
                if node.isEnd and f[j + 1]:
                    f[i] = True
                    break
        return f[0]
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->