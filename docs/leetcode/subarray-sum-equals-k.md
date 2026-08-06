---
comments: true
difficulty: 中等

tags:
    - 数组
    - 哈希表
    - 前缀和
---

<!-- problem:start -->

# [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>nums</code> 和一个整数&nbsp;<code>k</code> ，请你统计并返回 <em>该数组中和为&nbsp;<code>k</code><strong>&nbsp;</strong>的子数组的个数&nbsp;</em>。</p>

<p>子数组是数组中元素的连续非空序列。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [1,1,1], k = 2
<strong>输出：</strong>2
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [1,2,3], k = 3
<strong>输出：</strong>2
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>
	<li><code>-10<sup>7</sup> &lt;= k &lt;= 10<sup>7</sup></code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：哈希表 + 前缀和

我们定义一个哈希表 $\textit{cnt}$，用于存储数组 $\textit{nums}$ 的前缀和出现的次数。初始时，我们将 $\textit{cnt}[0]$ 的值设为 $1$，表示前缀和 $0$ 出现了一次。

我们遍历数组 $\textit{nums}$，计算前缀和 $\textit{s}$，然后将 $\textit{cnt}[s - k]$ 的值累加到答案中，并将 $\textit{cnt}[s]$ 的值增加 $1$。

遍历结束后，我们返回答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int subarraySum(int[] nums, int k) {
        int ans = 0, int sum = 0;
        Map<Integer, Integer> map = new HashMap<>();
        // 当 prefixSum[j] = k 时，prefixSum[j] - k = 0，需要哈希表中有键 0 来捕捉从开头到 j 的子数组。
        //值 1 表示空数组（前缀和 0）出现了一次。在遍历开始前，只有空数组满足前缀和为 0，因此初始化为 1 次。
        map.put(0, 1);
        for (int num : nums) {
            sum += num;
            // 子数组 [i, j] 的和可以表示为：sum(i, j) = prefixSum[j] - prefixSum[i-1] = k
            // 即：prefixSum[j] - k = prefixSum[i-1]
            // 查找是否存在某个之前的 prefixSum[i-1] 等于 sum - k。如果存在，说明子数组 [i, j] 的和为 k。
            ans += map.getOrDefault(sum - k, 0);
            // 当前前缀和加入map
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> cnt{{0, 1}};
        int ans = 0, s = 0;
        for (int x : nums) {
            s += x;
            ans += cnt[s - k];
            ++cnt[s];
        }
        return ans;
    }
};
```

```ts [TypeScript]
function subarraySum(nums: number[], k: number): number {
    const cnt: Map<number, number> = new Map();
    cnt.set(0, 1);
    let [ans, s] = [0, 0];
    for (const x of nums) {
        s += x;
        ans += cnt.get(s - k) || 0;
        cnt.set(s, (cnt.get(s) || 0) + 1);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        cnt = Counter({0: 1})
        ans = s = 0
        for x in nums:
            s += x
            ans += cnt[s - k]
            cnt[s] += 1
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->