---
comments: true
difficulty: 中等
tags:
  - 贪心
  - 数组
  - 字符串
  - 排序
entry: largestNumber
testcases:
  - input:
      - - 10
        - 2
    output: '210'
  - input:
      - - 3
        - 30
        - 34
        - 5
        - 9
    output: '9534330'
---


<script setup>
// 可视化演示数据：nums = [3,30,34,5,9] → "9534330"
// 自定义排序规则：a 排在 b 前，当且仅当 a+b > b+a（拼接字典序更大）
const largestNumberSteps = [
  { array: [3, 30, 34, 5, 9], note: '初始：nums = [3,30,34,5,9]。排序规则：a 排在 b 前 ⟺ a+b > b+a（拼接更大的排前面）' },
  { array: [3, 30, 34, 5, 9], highlight: [0, 1], note: '比较 3 与 30："330" > "303" → 3 应在 30 前，顺序保持' },
  { array: [3, 34, 30, 5, 9], highlight: [1, 2], note: '比较 30 与 34："3034" < "3430" → 34 应在 30 前，交换 → [3,34,30,5,9]' },
  { array: [3, 34, 5, 30, 9], highlight: [2, 3], note: '比较 30 与 5："305" < "530" → 5 应在 30 前，交换 → [3,34,5,30,9]' },
  { array: [3, 34, 5, 9, 30], highlight: [3, 4], note: '比较 30 与 9："309" < "930" → 9 应在 30 前，交换 → [3,34,5,9,30]' },
  { array: [3, 5, 34, 9, 30], highlight: [1, 2], note: '比较 34 与 5："345" < "534" → 5 应在 34 前，交换 → [3,5,34,9,30]' },
  { array: [3, 5, 9, 34, 30], highlight: [2, 3], note: '比较 34 与 9："349" < "934" → 9 应在 34 前，交换 → [3,5,9,34,30]' },
  { array: [5, 3, 9, 34, 30], highlight: [0, 1], note: '比较 3 与 5："35" < "53" → 5 应在 3 前，交换 → [5,3,9,34,30]' },
  { array: [9, 5, 3, 34, 30], highlight: [1, 2], note: '比较 3 与 9："39" < "93" → 9 应在 3 前，交换 → [9,5,3,34,30]' },
  { array: [9, 5, 34, 3, 30], highlight: [2, 3], note: '比较 3 与 34："334" < "343" → 34 应在 3 前，交换 → [9,5,34,3,30]' },
  { array: [9, 5, 34, 3, 30], note: '排序完成！拼接：9 + 5 + 34 + 3 + 30 = "9534330" ✅' },
]
</script>

<!-- problem:start -->

# [179. 最大数](https://leetcode.cn/problems/largest-number)

## 题目描述

<!-- description:start -->

<p>给定一组非负整数 <code>nums</code>，重新排列每个数的顺序（每个数不可拆分）使之组成一个最大的整数。</p>

<p><strong>注意：</strong>输出结果可能非常大，所以你需要返回一个字符串而不是整数。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入<code>：</code></strong><code>nums = [10,2]</code>
<strong>输出：</strong><code>"210"</code></pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入<code>：</code></strong><code>nums = [3,30,34,5,9]</code>
<strong>输出：</strong><code>"9534330"</code>
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 100</code></li>
	<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：自定义排序

先转成字符串列表，再对字符串列表进行字典序降序排列。最后将列表所有字符串拼接即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

## 可视化演示

> 以 `nums = [3, 30, 34, 5, 9]` 为例，演示自定义排序规则：比较 `a + b` 与 `b + a`，拼接结果更大的排前面。黄色为正在比较的一对相邻元素，交换后数组快照随之更新。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="largestNumberSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public String largestNumber(int[] nums) {
        List<String> vs = new ArrayList<>();
        for (int v : nums) {
            vs.add(v + "");
        }
        vs.sort((a, b) -> (b + a).compareTo(a + b));
        if ("0".equals(vs.get(0))) {
            return "0";
        }
        return String.join("", vs);
    }
}
```



```cpp [C++]
class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> vs;
        for (int v : nums) vs.push_back(to_string(v));
        sort(vs.begin(), vs.end(), [](string& a, string& b) {
            return a + b > b + a;
        });
        if (vs[0] == "0") return "0";
        string ans;
        for (string v : vs) ans += v;
        return ans;
    }
};
```

```python [Python]
class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        nums = [str(v) for v in nums]
        nums.sort(key=cmp_to_key(lambda a, b: 1 if a + b < b + a else -1))
        return "0" if nums[0] == "0" else "".join(nums)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->