---
comments: true
difficulty: 中等

tags:
    - 哈希表
    - 字符串
    - 滑动窗口
entry: lengthOfLongestSubstring
testcases:
  - input: ["abcabcbb"]
    output: 3
  - input: ["bbbbb"]
    output: 1
  - input: ["pwwkew"]
    output: 3
---

<script setup>
// 方法一（双指针 + HashMap）可视化：s = "pwwkew" → 3（最长无重复子串 "wke"）
// array + window：left/right 指针夹出滑动窗口，绿色区域为窗口，黄色为当前字符 c
const lssMapSteps = [
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 0 }], window: [0, 0], note: '初始：left=0，ans=0，map 为空。right 从 0 开始遍历 s="pwwkew"。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 0 }], highlight: [0], window: [0, 0], note: 'right=0，c=s[0]="p"。map 中无 "p"，写入 map["p"]=0。窗口 "p" 无重复，ans=max(0, 0-0+1)=1。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 1 }], highlight: [1], window: [0, 1], note: 'right=1，c="w"。map 中无 "w"，写入 map["w"]=1。窗口 "pw" 无重复，ans=max(1, 1-0+1)=2。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 2 }], highlight: [2], window: [2, 2], note: 'right=2，c="w"，map["w"]=1 >= left(0)：窗口内重复 → left=map["w"]+1=2，更新 map["w"]=2。窗口 "w" 长度 1，ans=max(2, 1)=2。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 3 }], highlight: [3], window: [2, 3], note: 'right=3，c="k"。map 中无 "k"，写入 map["k"]=3。窗口 "wk" 无重复，ans=max(2, 3-2+1)=2。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 4 }], highlight: [4], window: [2, 4], note: 'right=4，c="e"。map 中无 "e"，写入 map["e"]=4。窗口 "wke" 无重复，ans=max(2, 4-2+1)=3。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 3 }, { label: 'right', index: 5 }], highlight: [5], window: [3, 5], note: 'right=5，c="w"，map["w"]=2 >= left(2)：窗口内重复 → left=map["w"]+1=3，更新 map["w"]=5。窗口 "kew" 长度 3，ans=max(3, 3)=3。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], note: '遍历结束，返回 ans=3 ✅（最长无重复子串为 "wke"）。' },
]

// 方法二（双指针 + HashSet）可视化：s = "pwwkew" → 3
const lssSetSteps = [
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 0 }], window: [0, 0], note: '初始：left=0，ans=0，set 为空。right 从 0 开始遍历 s="pwwkew"。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 0 }], highlight: [0], window: [0, 0], note: 'right=0，c="p"。set 中无 "p"，加入 set。窗口 "p" 无重复，ans=max(0, 0-0+1)=1。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 0 }, { label: 'right', index: 1 }], highlight: [1], window: [0, 1], note: 'right=1，c="w"。set 中无 "w"，加入 set。窗口 "pw" 无重复，ans=max(1, 1-0+1)=2。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 2 }], highlight: [2], window: [2, 2], note: 'right=2，c="w"，set 中有 "w"：先移除 s[left=0]="p"（left=1），set 中仍有 "w"，再移除 s[1]="w"（left=2）。加入 "w"，窗口 "w" 长度 1，ans=max(2, 1)=2。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 3 }], highlight: [3], window: [2, 3], note: 'right=3，c="k"。set 中无 "k"，加入 set。窗口 "wk" 无重复，ans=max(2, 3-2+1)=2。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 2 }, { label: 'right', index: 4 }], highlight: [4], window: [2, 4], note: 'right=4，c="e"。set 中无 "e"，加入 set。窗口 "wke" 无重复，ans=max(2, 4-2+1)=3。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], pointers: [{ label: 'left', index: 3 }, { label: 'right', index: 5 }], highlight: [5], window: [3, 5], note: 'right=5，c="w"，set 中有 "w"：移除 s[left=2]="w"（left=3）。加入 "w"，窗口 "kew" 长度 3，ans=max(3, 3)=3。' },
  { array: ['p', 'w', 'w', 'k', 'e', 'w'], note: '遍历结束，返回 ans=3 ✅（最长无重复子串为 "wke"）。' },
]
</script>

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

## 方法一：双指针 + HashMap

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

### 可视化演示

> 以 `s = "pwwkew"` 为例，演示滑动窗口：`left`/`right` 双指针夹出无重复子串窗口，绿色区域为当前窗口，黄色为正在处理的字符 `c`。`map` 记录每个字符最近一次出现的下标。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="lssMapSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, ans = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            // 如果字符 c 出现过，并且在当前窗口内
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;  // 把 left 移动到重复字符之后
            }

            map.put(c, right);  // 更新字符 c 的最新位置
            ans = Math.max(ans, right - left + 1);
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

## 方法二：双指针 + HashSet

### 可视化演示

> 以 `s = "pwwkew"` 为例，演示滑动窗口：`left`/`right` 双指针夹出无重复子串窗口，绿色区域为当前窗口，黄色为正在处理的字符 `c`。`set` 记录窗口内已出现的字符。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="lssSetSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

````java [Java]
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int left = 0, ans = 0;
        Set<Character> set = new HashSet<>();

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            // 如果出现重复字符，就移动左边界
            while (set.contains(c)) {
                set.remove(s.charAt(left));
                left++;
            }
            set.add(c);
            ans = Math.max(ans, right - left + 1);
        }
        return ans;
    }
}
````

:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
