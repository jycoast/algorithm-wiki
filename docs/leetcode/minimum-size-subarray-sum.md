---
comments: true
difficulty: 中等

tags:
    - 数组
    - 二分查找
    - 前缀和
    - 滑动窗口
---

<script setup>
// 方法一（前缀和 + 二分）可视化：nums = [2,3,1,2,4,3]，target = 7
// 前缀和 s = [0,2,5,6,8,12,15]，对每个 i 二分找 s[j] ≥ s[i]+7
const prefixSteps = [
  { array: [0, 2, 5, 6, 8, 12, 15], pointers: [{ label: 'i', index: 0 }], note: '前缀和 s = [0,2,5,6,8,12,15]。i=0，二分找 s[j] ≥ 0+7=7' },
  { array: [0, 2, 5, 6, 8, 12, 15], pointers: [{ label: 'i', index: 0 }], highlight: [4], note: 's[4]=8 ≥ 7 → j=4，子数组长度 j-i = 4，ans = 4' },
  { array: [0, 2, 5, 6, 8, 12, 15], pointers: [{ label: 'i', index: 1 }], highlight: [4], note: 'i=1，s[1]=2，二分找 ≥ 2+7=9 → j=4，长度 3，ans = min(4,3) = 3' },
  { array: [0, 2, 5, 6, 8, 12, 15], pointers: [{ label: 'i', index: 2 }], highlight: [4], note: 'i=2，s[2]=5，二分找 ≥ 5+7=12 → j=5，长度 3，ans 保持 3' },
  { array: [0, 2, 5, 6, 8, 12, 15], pointers: [{ label: 'i', index: 3 }], highlight: [5], note: 'i=3，s[3]=6，二分找 ≥ 6+7=13 → j=5，长度 2，ans = min(3,2) = 2' },
  { array: [0, 2, 5, 6, 8, 12, 15], pointers: [{ label: 'i', index: 4 }], highlight: [5], note: 'i=4，s[4]=8，二分找 ≥ 15 → j=6，长度 2，ans 保持 2' },
  { array: [0, 2, 5, 6, 8, 12, 15], note: '后续 i 均无更优解。最终 ans = 2 ✅' },
]

// 方法二（双指针滑动窗口）可视化：nums = [2,3,1,2,4,3]，target = 7
const slidingSteps = [
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 0 }], window: [0, 0], note: '初始：l=0，r=0，窗口和 s=2 < 7，右移 r' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 1 }], window: [0, 1], note: 'r=1，s=2+3=5 < 7，右移 r' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 2 }], window: [0, 2], note: 'r=2，s=5+1=6 < 7，右移 r' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 0 }, { label: 'r', index: 3 }], window: [0, 3], note: 'r=3，s=6+2=8 ≥ 7！窗口长度 4，ans=4。缩小窗口：s -= nums[0]=2，l 右移' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 1 }, { label: 'r', index: 3 }], window: [1, 3], note: '窗口 [1,3] 和=6 < 7，退出循环，右移 r' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 1 }, { label: 'r', index: 4 }], window: [1, 4], note: 'r=4，s=6+4=10 ≥ 7，长度 4，ans 保持 4。缩小：s -= 3，l 右移' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 2 }, { label: 'r', index: 4 }], window: [2, 4], note: '窗口 [2,4] 和=7 ≥ 7，长度 3，ans = min(4,3) = 3。缩小：s -= 1，l 右移' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 3 }, { label: 'r', index: 4 }], window: [3, 4], note: '窗口 [3,4] 和=6 < 7，退出，右移 r' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 3 }, { label: 'r', index: 5 }], window: [3, 5], note: 'r=5，s=6+3=9 ≥ 7，长度 3，ans 保持 3。缩小：s -= 2，l 右移' },
  { array: [2, 3, 1, 2, 4, 3], pointers: [{ label: 'l', index: 4 }, { label: 'r', index: 5 }], window: [4, 5], note: '窗口 [4,5] 和=7 ≥ 7，长度 2，ans = min(3,2) = 2。缩小后 s<7' },
  { array: [2, 3, 1, 2, 4, 3], note: '遍历结束，最小窗口 [4,3] 长度为 2 ✅' },
]
</script>

<!-- problem:start -->

# [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum)

## 题目描述

<!-- description:start -->

<p>给定一个含有&nbsp;<code>n</code><strong>&nbsp;</strong>个正整数的数组和一个正整数 <code>target</code><strong> 。</strong></p>

<p>找出该数组中满足其总和大于等于<strong> </strong><code>target</code><strong> </strong>的长度最小的 <strong><span data-keyword="subarray-nonempty">子数组</span></strong>&nbsp;<code>[nums<sub>l</sub>, nums<sub>l+1</sub>, ..., nums<sub>r-1</sub>, nums<sub>r</sub>]</code> ，并返回其长度<strong>。</strong>如果不存在符合条件的子数组，返回 <code>0</code> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>target = 7, nums = [2,3,1,2,4,3]
<strong>输出：</strong>2
<strong>解释：</strong>子数组&nbsp;<code>[4,3]</code>&nbsp;是该条件下的长度最小的子数组。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>target = 4, nums = [1,4,4]
<strong>输出：</strong>1
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>target = 11, nums = [1,1,1,1,1,1,1,1]
<strong>输出：</strong>0
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>1 &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong></p>

<ul>
	<li>如果你已经实现<em> </em><code>O(n)</code> 时间复杂度的解法, 请尝试设计一个 <code>O(n log(n))</code> 时间复杂度的解法。</li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：前缀和 + 二分查找

我们先预处理出数组 $nums$ 的前缀和数组 $s$，其中 $s[i]$ 表示数组 $nums$ 前 $i$ 项元素之和。由于数组 $nums$ 中的元素都是正整数，因此数组 $s$ 也是单调递增的。另外，我们初始化答案 $ans = n + 1$，其中 $n$ 为数组 $nums$ 的长度。

接下来，我们遍历前缀和数组 $s$，对于其中的每个元素 $s[i]$，我们可以通过二分查找的方法找到满足 $s[j] \geq s[i] + target$ 的最小下标 $j$，如果 $j \leq n$，则说明存在满足条件的子数组，我们可以更新答案，即 $ans = min(ans, j - i)$。

最后，如果 $ans \leq n$，则说明存在满足条件的子数组，返回 $ans$，否则返回 $0$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $nums$ 的长度。

### 可视化演示

> 以 `target = 7`、`nums = [2, 3, 1, 2, 4, 3]` 为例，演示「前缀和 + 二分查找」过程。前缀和 `s = [0,2,5,6,8,12,15]`，`i` 遍历前缀和，二分找到第一个 `s[j] ≥ s[i] + target` 的位置，更新 `ans = min(ans, j - i)`。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="prefixSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int n = nums.length;
        long[] s = new long[n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        int ans = n + 1;
        for (int i = 0; i <= n; ++i) {
            int j = search(s, s[i] + target);
            if (j <= n) {
                ans = Math.min(ans, j - i);
            }
        }
        return ans <= n ? ans : 0;
    }

    private int search(long[] nums, long x) {
        int l = 0, r = nums.length;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (nums[mid] >= x) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l;
    }
}
```



```cpp [C++]
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        vector<long long> s(n + 1);
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        int ans = n + 1;
        for (int i = 0; i <= n; ++i) {
            int j = lower_bound(s.begin(), s.end(), s[i] + target) - s.begin();
            if (j <= n) {
                ans = min(ans, j - i);
            }
        }
        return ans <= n ? ans : 0;
    }
};
```


```ts [TypeScript]
function minSubArrayLen(target: number, nums: number[]): number {
    const n = nums.length;
    const s: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; ++i) {
        s[i + 1] = s[i] + nums[i];
    }
    let ans = n + 1;
    const search = (x: number) => {
        let l = 0;
        let r = n + 1;
        while (l < r) {
            const mid = (l + r) >>> 1;
            if (s[mid] >= x) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l;
    };
    for (let i = 0; i <= n; ++i) {
        const j = search(s[i] + target);
        if (j <= n) {
            ans = Math.min(ans, j - i);
        }
    }
    return ans === n + 1 ? 0 : ans;
}
```


```python [Python]
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        n = len(nums)
        s = list(accumulate(nums, initial=0))
        ans = n + 1
        for i, x in enumerate(s):
            j = bisect_left(s, x + target)
            if j <= n:
                ans = min(ans, j - i)
        return ans if ans <= n else 0
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：双指针

我们注意到，数组 $\textit{nums}$ 中的元素均为正整数，我们可以考虑使用双指针来维护一个滑动窗口。

具体地，我们定义两个指针 $\textit{l}$ 和 $\textit{r}$ 分别表示滑动窗口的左边界和右边界，用一个变量 $\textit{s}$ 代表滑动窗口中的元素和。

在每一步操作中，我们移动右指针 $\textit{r}$，使得滑动窗口中加入一个元素，如果此时 $\textit{s} \ge \textit{target}$，我们就更新最小长度 $\textit{ans} = \min(\textit{ans}, \textit{r} - \textit{l} + 1$，并将左指针 $\textit{l}$ 循环向右移动，直至有 $\textit{s} < \textit{target}$。

最后，如果最小长度 $\textit{ans}$ 仍为初始值，我们就返回 $0$，否则返回 $\textit{ans}$。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{nums}$ 的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `target = 7`、`nums = [2, 3, 1, 2, 4, 3]` 为例，演示双指针 `l`/`r` 维护滑动窗口的过程。绿色区域为当前窗口 `[l, r]`，窗口和 `s ≥ target` 时收缩左边界。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="slidingSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int l = 0, n = nums.length;
        long s = 0;
        int ans = n + 1;
        for (int r = 0; r < n; ++r) {
            s += nums[r];
            while (s >= target) {
                ans = Math.min(ans, r - l + 1);
                s -= nums[l++];
            }
        }
        return ans > n ? 0 : ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int l = 0, n = nums.size();
        long long s = 0;
        int ans = n + 1;
        for (int r = 0; r < n; ++r) {
            s += nums[r];
            while (s >= target) {
                ans = min(ans, r - l + 1);
                s -= nums[l++];
            }
        }
        return ans > n ? 0 : ans;
    }
};
```

```ts [TypeScript]
function minSubArrayLen(target: number, nums: number[]): number {
    const n = nums.length;
    let [s, ans] = [0, n + 1];
    for (let l = 0, r = 0; r < n; ++r) {
        s += nums[r];
        while (s >= target) {
            ans = Math.min(ans, r - l + 1);
            s -= nums[l++];
        }
    }
    return ans > n ? 0 : ans;
}
```

```python [Python]
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        l = s = 0
        ans = inf
        for r, x in enumerate(nums):
            s += x
            while s >= target:
                ans = min(ans, r - l + 1)
                s -= nums[l]
                l += 1
        return 0 if ans == inf else ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->