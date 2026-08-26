---
comments: true
difficulty: 中等
tags:
  - 双指针
  - 字符串
  - 动态规划
entry: longestPalindrome
testcases:
  - input:
      - babad
    output: bab
    accept:
      - bab
      - aba
  - input:
      - cbbd
    output: bb
---


<script setup>
// 方法一（动态规划）可视化：s = "babad"，n = 5
// f[i][j] 表示 s[i..j] 是否为回文（1 = true，0 = false），null 为尚未计算的格子
const longestPalSteps = [
  { grid: { values: [[1, null, null, null, null], [null, 1, null, null, null], [null, null, 1, null, null], [null, null, null, 1, null], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }], note: '初始化对角线：f[i][i] = true，单个字符都是回文。' },
  { grid: { values: [[1, null, null, null, null], [null, 1, null, null, null], [null, null, 1, null, null], [null, null, null, 1, 0], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 3, c: 4, state: 'cur' }], note: 'i=3：s[3]="a" ≠ s[4]="d"，f[3][4] = false。' },
  { grid: { values: [[1, null, null, null, null], [null, 1, null, null, null], [null, null, 1, 0, 0], [null, null, null, 1, 0], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 2, c: 3, state: 'cur' }, { r: 2, c: 4, state: 'cur' }], note: 'i=2：s[2]="b" vs s[3]="a" 不等 → f[2][3]=false；s[2]="b" vs s[4]="d" 不等 → f[2][4]=false。' },
  { grid: { values: [[1, null, null, null, null], [null, 1, 0, 1, null], [null, null, 1, 0, 0], [null, null, null, 1, 0], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 1, c: 2, state: 'cur' }, { r: 1, c: 3, state: 'mark' }], note: 'i=1：s[1]="a" vs s[2]="b" 不等 → f[1][2]=false；s[1]="a" == s[3]="a" → f[1][3] = f[2][2] = true，子串 "aba" 是回文，更新 mx=3, k=1。' },
  { grid: { values: [[1, 0, null, null, null], [null, 1, 0, 1, 0], [null, null, 1, 0, 0], [null, null, null, 1, 0], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'mark' }, { r: 1, c: 4, state: 'cur' }, { r: 0, c: 1, state: 'cur' }], note: 'i=1 继续：j=4，s[1]="a" vs s[4]="d" 不等 → false；i=0：j=1，s[0]="b" vs s[1]="a" 不等 → false。' },
  { grid: { values: [[1, 0, 1, 0, 0], [null, 1, 0, 1, 0], [null, null, 1, 0, 0], [null, null, null, 1, 0], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'mark' }, { r: 1, c: 4, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'hl' }, { r: 0, c: 3, state: 'cur' }, { r: 0, c: 4, state: 'cur' }], note: 'i=0：s[0]="b" == s[2]="b" → f[0][2] = f[1][1] = true，子串 "bab" 长度 3，但 mx=3 不更新（3<3 不成立，k 保持 1）；j=3 "b" vs "a" → false；j=4 "b" vs "d" → false。' },
  { grid: { values: [[1, 0, 1, 0, 0], [null, 1, 0, 1, 0], [null, null, 1, 0, 0], [null, null, null, 1, 0], [null, null, null, null, 1]], rowLabels: ['b', 'a', 'b', 'a', 'd'], colLabels: ['b', 'a', 'b', 'a', 'd'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 4, state: 'done' }, { r: 3, c: 4, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 2, c: 4, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'mark' }, { r: 1, c: 4, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 0, c: 4, state: 'done' }], gridTexts: [{ r: 1, c: 3, text: 'aba', state: 'mark' }], note: '填表完成。k=1, mx=3，答案 s.substring(1, 4) = "aba"，长度 3 ✅。' },
]

// 方法二（枚举中心点扩散）可视化：s = "babad"
// l/r 指针从中心 i=2 向两边扩散，绿色窗口 [1, 3] 为最长回文 "aba"
const expandSteps = [
  { array: ['b', 'a', 'b', 'a', 'd'], pointers: [{ label: 'l', index: 2 }, { label: 'r', index: 2 }], note: '中心 i=2（字符 "b"）：奇数中心 f(2,2) 从自己开始，l=2, r=2。' },
  { array: ['b', 'a', 'b', 'a', 'd'], pointers: [{ label: 'l', index: 1 }, { label: 'r', index: 3 }], highlight: [1, 2, 3], note: 'f(2,2) 扩散：s[1]="a" == s[3]="a" → l=1, r=3，回文 "aba" 长度 3。' },
  { array: ['b', 'a', 'b', 'a', 'd'], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 4 }], highlight: [0, 1, 2, 3, 4], note: '继续扩散：s[0]="b" vs s[4]="d" 不等，停止。长度 = r-l-1 = 4-0-1 = 3（区间 [1,3]）。偶数中心 f(2,3)="b" vs "a" 不等 → 0。t = max(3, 0) = 3。' },
  { array: ['b', 'a', 'b', 'a', 'd'], window: [1, 3], note: '更新 mx=3，start = 2 - ((3-1)>>1) = 1。答案 s.substring(1, 4) = "aba" ✅。' },
]
</script>

<!-- problem:start -->

# [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring)

## 题目描述

<!-- description:start -->

<p>给你一个字符串 <code>s</code>，找到 <code>s</code> 中最长的 <span data-keyword="palindromic-string">回文</span> <span data-keyword="substring-nonempty">子串</span>。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "babad"
<strong>输出：</strong>"bab"
<strong>解释：</strong>"aba" 同样是符合题意的答案。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = "cbbd"
<strong>输出：</strong>"bb"
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 1000</code></li>
	<li><code>s</code> 仅由数字和英文字母组成</li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i][j]$ 表示字符串 $s[i..j]$ 是否为回文串，初始时 $f[i][j] = true$。

接下来，我们定义变量 $k$ 和 $mx$，其中 $k$ 表示最长回文串的起始位置，$mx$ 表示最长回文串的长度。初始时 $k = 0$, $mx = 1$。

考虑 $f[i][j]$，如果 $s[i] = s[j]$，那么 $f[i][j] = f[i + 1][j - 1]$；否则 $f[i][j] = false$。如果 $f[i][j] = true$ 并且 $mx \lt j - i + 1$，那么我们更新 $k = i$, $mx = j - i + 1$。

由于 $f[i][j]$ 依赖于 $f[i + 1][j - 1]$，因此我们需要保证 $i + 1$ 在 $j - 1$ 之前，因此我们需要从大到小地枚举 $i$，从小到大地枚举 $j$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 是字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "babad"` 为例，演示动态规划填表：`f[i][j]` 表示 `s[i..j]` 是否为回文（`1` 为 true，`0` 为 false）。初始对角线全为 `1`，从 `i = n - 2` 到 `0` 枚举 `j`，当 `s[i] == s[j]` 时 `f[i][j] = f[i + 1][j - 1]`。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="longestPalSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        boolean[][] f = new boolean[n][n];
        for (var g : f) {
            Arrays.fill(g, true);
        }
        int k = 0, mx = 1;
        for (int i = n - 2; i >= 0; --i) {
            for (int j = i + 1; j < n; ++j) {
                f[i][j] = false;
                if (s.charAt(i) == s.charAt(j)) {
                    f[i][j] = f[i + 1][j - 1];
                    if (f[i][j] && mx < j - i + 1) {
                        mx = j - i + 1;
                        k = i;
                    }
                }
            }
        }
        return s.substring(k, k + mx);
    }
}
```



```cpp [C++]
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size();
        vector<vector<bool>> f(n, vector<bool>(n, true));
        int k = 0, mx = 1;
        for (int i = n - 2; ~i; --i) {
            for (int j = i + 1; j < n; ++j) {
                f[i][j] = false;
                if (s[i] == s[j]) {
                    f[i][j] = f[i + 1][j - 1];
                    if (f[i][j] && mx < j - i + 1) {
                        mx = j - i + 1;
                        k = i;
                    }
                }
            }
        }
        return s.substr(k, mx);
    }
};
```

```ts [TypeScript]
function longestPalindrome(s: string): string {
    const n = s.length;
    const f: boolean[][] = Array(n)
        .fill(0)
        .map(() => Array(n).fill(true));
    let k = 0;
    let mx = 1;
    for (let i = n - 2; i >= 0; --i) {
        for (let j = i + 1; j < n; ++j) {
            f[i][j] = false;
            if (s[i] === s[j]) {
                f[i][j] = f[i + 1][j - 1];
                if (f[i][j] && mx < j - i + 1) {
                    mx = j - i + 1;
                    k = i;
                }
            }
        }
    }
    return s.slice(k, k + mx);
}
```

```python [Python]
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        f = [[True] * n for _ in range(n)]
        k, mx = 0, 1
        for i in range(n - 2, -1, -1):
            for j in range(i + 1, n):
                f[i][j] = False
                if s[i] == s[j]:
                    f[i][j] = f[i + 1][j - 1]
                    if f[i][j] and mx < j - i + 1:
                        k, mx = i, j - i + 1
        return s[k : k + mx]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：枚举回文中间点

我们可以枚举回文中间点，向两边扩散，找到最长的回文串。

时间复杂度 $O(n^2)$，空间复杂度 $O(1)$。其中 $n$ 是字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "babad"` 为例，演示枚举中心点向两边扩散：固定中心 `i=2`（字符 "b"），`l`/`r` 指针从中心向两端移动比较，黄色为当前扩散范围，绿色窗口为最终答案 `[1, 3] = "aba"`。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="expandSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private String s;
    private int n;

    public String longestPalindrome(String s) {
        this.s = s;
        n = s.length();
        int start = 0, mx = 1;
        for (int i = 0; i < n; ++i) {
            int a = f(i, i);
            int b = f(i, i + 1);
            int t = Math.max(a, b);
            if (mx < t) {
                mx = t;
                start = i - ((t - 1) >> 1);
            }
        }
        return s.substring(start, start + mx);
    }

    private int f(int l, int r) {
        while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) {
            --l;
            ++r;
        }
        return r - l - 1;
    }
}
```


```cpp [C++]
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size();
        int start = 0, mx = 1;
        auto f = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) {
                l--, r++;
            }
            return r - l - 1;
        };
        for (int i = 0; i < n; ++i) {
            int a = f(i, i);
            int b = f(i, i + 1);
            int t = max(a, b);
            if (mx < t) {
                mx = t;
                start = i - (t - 1 >> 1);
            }
        }
        return s.substr(start, mx);
    }
};
```

```python [Python]
class Solution:
    def longestPalindrome(self, s: str) -> str:
        def f(l, r):
            while l >= 0 and r < n and s[l] == s[r]:
                l, r = l - 1, r + 1
            return r - l - 1

        n = len(s)
        start, mx = 0, 1
        for i in range(n):
            a = f(i, i)
            b = f(i, i + 1)
            t = max(a, b)
            if mx < t:
                mx = t
                start = i - ((t - 1) >> 1)
        return s[start : start + mx]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->