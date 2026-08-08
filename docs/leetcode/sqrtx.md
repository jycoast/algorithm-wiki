---
comments: true
difficulty: 简单

tags:
    - 数学
    - 二分查找
entry: mySqrt
testcases:
  - input: [4]
    output: 2
  - input: [8]
    output: 2
  - input: [1]
    output: 1
---

<script setup>
// 可视化演示数据：x = 8，在候选值区间 [0, 8] 上二分查找平方根
// 指针 l/r 标出当前查找范围，highlight 标当前 mid（上取整二分）
const sqrtSteps = [
  { array: [0, 1, 2, 3, 4, 5, 6, 7, 8], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 8 }], note: 'x = 8，候选值为 [0, 8] 共 9 个整数。初始 l = 0，r = x = 8' },
  { array: [0, 1, 2, 3, 4, 5, 6, 7, 8], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 8 }], highlight: [4], note: 'mid = (l+r+1)>>1 = (0+8+1)>>1 = 4。4 > 8/4 = 2 成立 → 平方根在 [l, mid-1]，令 r = mid-1 = 3' },
  { array: [0, 1, 2, 3, 4, 5, 6, 7, 8], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 3 }], highlight: [2], note: 'mid = (0+3+1)>>1 = 2。2 > 8/2 = 4 不成立 → 平方根在 [mid, r]，令 l = mid = 2' },
  { array: [0, 1, 2, 3, 4, 5, 6, 7, 8], pointers: [{ label: 'l', index: 2 }, { label: 'r', index: 3 }], highlight: [3], note: 'mid = (2+3+1)>>1 = 3。3 > 8/3 = 2 成立 → 令 r = mid-1 = 2' },
  { array: [0, 1, 2, 3, 4, 5, 6, 7, 8], pointers: [{ label: 'l', index: 2 }, { label: 'r', index: 2 }], highlight: [2], note: 'l == r = 2，循环结束。返回 l = 2，即 sqrt(8) 的整数部分 ✅' },
]
</script>

<!-- problem:start -->

# [69. x 的平方根](https://leetcode.cn/problems/sqrtx)

## 题目描述

<!-- description:start -->

<p>给你一个非负整数 <code>x</code> ，计算并返回&nbsp;<code>x</code>&nbsp;的 <strong>算术平方根</strong> 。</p>

<p>由于返回类型是整数，结果只保留 <strong>整数部分 </strong>，小数部分将被 <strong>舍去 。</strong></p>

<p><strong>注意：</strong>不允许使用任何内置指数函数和算符，例如 <code>pow(x, 0.5)</code> 或者 <code>x ** 0.5</code> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>x = 4
<strong>输出：</strong>2
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>x = 8
<strong>输出：</strong>2
<strong>解释：</strong>8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>0 &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：二分查找

我们定义二分查找的左边界 $l = 0$，右边界 $r = x$，然后在 $[l, r]$ 范围内查找平方根。

在每一步查找中，我们找出中间值 $mid = (l + r + 1) / 2$，如果 $mid > x / mid$，说明平方根在 $[l, mid - 1]$ 范围内，我们令 $r = mid - 1$；否则说明平方根在 $[mid, r]$ 范围内，我们令 $l = mid$。

查找结束后，返回 $l$ 即可。

时间复杂度 $O(\log x)$，空间复杂度 $O(1)$。

### 可视化演示

> 以 `x = 8` 为例，在候选值数组 `[0, 1, ..., 8]` 上演示二分查找：`l`/`r` 指针（蓝色边框）标出当前查找范围，黄色高亮为当前 `mid`，note 说明每次区间收缩。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="sqrtSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int mySqrt(int x) {
        int l = 0, r = x;
        while (l < r) {
            int mid = (l + r + 1) >>> 1;
            if (mid > x / mid) {
                r = mid - 1;
            } else {
                l = mid;
            }
        }
        return l;
    }
}
```

```cpp [C++]
class Solution {
public:
    int mySqrt(int x) {
        int l = 0, r = x;
        while (l < r) {
            int mid = (l + r + 1ll) >> 1;
            if (mid > x / mid) {
                r = mid - 1;
            } else {
                l = mid;
            }
        }
        return l;
    }
};
```

```python [Python]
class Solution:
    def mySqrt(self, x: int) -> int:
        l, r = 0, x
        while l < r:
            mid = (l + r + 1) >> 1
            if mid > x // mid:
                r = mid - 1
            else:
                l = mid
        return l
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->