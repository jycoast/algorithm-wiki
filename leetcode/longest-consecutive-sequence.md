---
comments: true
difficulty: 中等

tags:
    - 并查集
    - 数组
    - 哈希表
---

<!-- problem:start -->

# [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence)

## 题目描述

<!-- description:start -->

<p>给定一个未排序的整数数组 <code>nums</code> ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。</p>

<p>请你设计并实现时间复杂度为&nbsp;<code>O(n)</code><em> </em>的算法解决此问题。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [100,4,200,1,3,2]
<strong>输出：</strong>4
<strong>解释：</strong>最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [0,3,7,2,5,8,4,6,0,1]
<strong>输出：</strong>9
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>0 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

### 方法一：排序

我们先将数组排序，然后用一个变量 $t$ 记录当前连续序列的长度，用一个变量 $ans$ 记录最长连续序列的长度。

当数组元素的个数超过1的时候，答案最少也有一个，所以变量$t$的初始值为1。

接下来，我们从下标 $i=1$ 开始遍历数组，对于当前遍历到的元素 $nums[i]$：

-   如果 $nums[i]=nums[i-1]$，则说明当前元素重复，无需考虑；
-   如果 $nums[i]=nums[i-1]+1$，则说明当前元素可以接在上一个连续序列后面以形成更长的连续序列，我们更新 $t = t + 1$，然后更新答案 $ans = \max(ans, t)$；
-   否则，说明当前元素无法接在上一个连续序列后面，我们将 $t$ 重新置为 $1$。

最终，我们返回答案 $ans$ 即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 是数组的长度。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int longestConsecutive(int[] nums) {
        int n = nums.length;
        if (n < 2) {
            return n;
        }
        Arrays.sort(nums);
        int ans = 1, t = 1;
        for (int i = 1; i < n; ++i) {
            if (nums[i] == nums[i - 1]) {
                continue;
            }
            if (nums[i] == nums[i - 1] + 1) {
                ans = Math.max(ans, ++t);
            } else {
                t = 1;
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        int n = nums.size();
        if (n < 2) {
            return n;
        }
        sort(nums.begin(), nums.end());
        int ans = 1, t = 1;
        for (int i = 1; i < n; ++i) {
            if (nums[i] == nums[i - 1]) {
                continue;
            }
            if (nums[i] == nums[i - 1] + 1) {
                ans = max(ans, ++t);
            } else {
                t = 1;
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function longestConsecutive(nums: number[]): number {
    const n = nums.length;
    if (n < 2) {
        return n;
    }
    let ans = 1;
    let t = 1;
    nums.sort((a, b) => a - b);
    for (let i = 1; i < n; ++i) {
        if (nums[i] === nums[i - 1]) {
            continue;
        }
        if (nums[i] === nums[i - 1] + 1) {
            ans = Math.max(ans, ++t);
        } else {
            t = 1;
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        n = len(nums)
        if n < 2:
            return n
        nums.sort()
        ans = t = 1
        for a, b in pairwise(nums):
            if a == b:
                continue
            if a + 1 == b:
                t += 1
                ans = max(ans, t)
            else:
                t = 1
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：哈希表

我们用哈希表存储数组中的所有元素，然后遍历数组中的每个元素 $x$，如果当前元素的前驱 $x-1$ 不在哈希表中，那么我们以当前元素为起点，不断尝试匹配 $x+1, x+2, x+3, \dots$，直到匹配不到为止，此时的匹配长度即为以 $x$ 为起点的最长连续序列长度，我们更新答案即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组的长度。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) {
            s.add(x);
        }
        int ans = 0;
        for (int x : nums) {
            if (!s.contains(x - 1)) {
                int y = x + 1;
                while (s.contains(y)) {
                    ++y;
                }
                ans = Math.max(ans, y - x);
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int ans = 0;
        for (int x : nums) {
            if (!s.count(x - 1)) {
                int y = x + 1;
                while (s.count(y)) {
                    y++;
                }
                ans = max(ans, y - x);
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function longestConsecutive(nums: number[]): number {
    const s: Set<number> = new Set(nums);
    let ans = 0;
    for (const x of s) {
        if (!s.has(x - 1)) {
            let y = x + 1;
            while (s.has(y)) {
                y++;
            }
            ans = Math.max(ans, y - x);
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        ans = 0
        for x in nums:
            if x - 1 not in s:
                y = x + 1
                while y in s:
                    y += 1
                ans = max(ans, y - x)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->