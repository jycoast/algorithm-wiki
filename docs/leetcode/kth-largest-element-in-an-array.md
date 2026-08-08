---
comments: true
difficulty: 中等

tags:
    - 数组
    - 分治
    - 快速选择
    - 排序
    - 堆（优先队列）
---

<script setup>
// 方法一（快速选择）可视化：nums = [3,2,1,5,6,4]，k = 2（第 2 大 → 排序后下标 k' = n-k = 4 的元素）
const quickSelectSteps = [
  { array: [3, 2, 1, 5, 6, 4], note: 'nums = [3,2,1,5,6,4]，k=2 → 找排序后下标 k=6-2=4 的元素。递归区间 [0, 5]，取 pivot x = nums[(0+5)>>1] = nums[2] = 1' },
  { array: [3, 2, 1, 5, 6, 4], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 2 }], highlight: [0, 2], note: '双指针向中间逼近：i 找 ≥ 1 的数（i=0，nums[0]=3），j 找 ≤ 1 的数（j=2，nums[2]=1）' },
  { array: [1, 2, 3, 5, 6, 4], pointers: [{ label: 'i', index: 1 }, { label: 'j', index: 0 }], note: 'i<j → 交换 nums[0] 与 nums[2] → [1,2,3,5,6,4]。继续移动后 i≥j 退出，j=0' },
  { array: [1, 2, 3, 5, 6, 4], note: 'j=0 < k=4 → 第 k 大元素在右半区间，递归 quickSort(1, 5)' },
  { array: [1, 2, 3, 5, 6, 4], pointers: [{ label: 'i', index: 3 }, { label: 'j', index: 5 }], highlight: [3, 5], note: '区间 [1,5]，pivot x = nums[(1+5)>>1] = nums[3] = 5。i=3（nums[3]=5），j=5（nums[5]=4）' },
  { array: [1, 2, 3, 4, 6, 5], pointers: [{ label: 'i', index: 4 }, { label: 'j', index: 3 }], note: 'i<j → 交换 nums[3] 与 nums[5] → [1,2,3,4,6,5]。继续后 i≥j 退出，j=3' },
  { array: [1, 2, 3, 4, 6, 5], note: 'j=3 < k=4 → 继续在右半区间递归 quickSort(4, 5)' },
  { array: [1, 2, 3, 4, 5, 6], note: '区间 [4,5]，pivot x=6，交换后 [1,2,3,4,5,6]，j=4 == k → 递归 quickSort(4,4)，l==r 返回 nums[4]=5。第 2 大元素 = 5 ✅' },
]

// 方法二（小根堆）可视化：维护大小为 k=2 的小根堆，堆顶即为第 k 大
const heapSteps = [
  { array: [3], pointers: [{ label: '堆顶', index: 0 }], note: '遍历 x=3：堆 [3]（size=1 ≤ 2）' },
  { array: [2, 3], pointers: [{ label: '堆顶', index: 0 }], note: '遍历 x=2：堆 [2,3]（size=2 ≤ 2）' },
  { array: [2, 3], pointers: [{ label: '堆顶', index: 0 }], note: '遍历 x=1：加入后堆 [1,2,3]，size=3 > 2 → 弹出堆顶 1 → [2,3]' },
  { array: [3, 5], pointers: [{ label: '堆顶', index: 0 }], note: '遍历 x=5：加入后堆 [2,3,5]，size=3 > 2 → 弹出堆顶 2 → [3,5]' },
  { array: [5, 6], pointers: [{ label: '堆顶', index: 0 }], note: '遍历 x=6：加入后堆 [3,5,6]，size=3 > 2 → 弹出堆顶 3 → [5,6]' },
  { array: [5, 6], pointers: [{ label: '堆顶', index: 0 }], highlight: [0], note: '遍历 x=4：加入后堆 [4,5,6]，size=3 > 2 → 弹出堆顶 4 → [5,6]' },
  { array: [5, 6], pointers: [{ label: '堆顶', index: 0 }], note: '遍历结束，堆中保留最大的 k=2 个元素 [5,6]，堆顶 = 第 2 大元素 = 5 ✅' },
]

// 方法三（计数排序）可视化：统计每个数出现次数，从大到小累计直到 k
const countSortSteps = [
  { array: [3, 2, 1, 5, 6, 4], map: [{ key: 1, value: 1 }, { key: 2, value: 1 }, { key: 3, value: 1 }, { key: 4, value: 1 }, { key: 5, value: 1 }, { key: 6, value: 1 }], note: '统计每个元素出现次数：cnt = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1}。k=2，从最大值 6 开始向下累计' },
  { array: [3, 2, 1, 5, 6, 4], map: [{ key: 1, value: 1 }, { key: 2, value: 1 }, { key: 3, value: 1 }, { key: 4, value: 1 }, { key: 5, value: 1 }, { key: 6, value: 1 }], mapHighlight: [5], note: 'i=6：k -= cnt[6]=1 → k=1，仍 > 0，继续' },
  { array: [3, 2, 1, 5, 6, 4], map: [{ key: 1, value: 1 }, { key: 2, value: 1 }, { key: 3, value: 1 }, { key: 4, value: 1 }, { key: 5, value: 1 }, { key: 6, value: 1 }], mapHighlight: [4], note: 'i=5：k -= cnt[5]=1 → k=0，k ≤ 0 → 返回 i = 5。第 2 大元素 = 5 ✅' },
]

// 方法四（计数排序的优化）可视化：count[offset+num]++，i 从高到低扫描，remain 累减
// 只展示最大值附近的非零段：行 0 为下标 i，行 1 为 count[i]
const countOptSteps = [
  { rows: [
      [10006, 10005, 10004, 10003, 10002, 10001, 10000],
      [1, 1, 1, 1, 1, 1, 0],
    ], rowPointers: [{ row: 0, col: 0, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: '统计频次：count[offset+num]++，nums=[3,2,1,5,6,4] 中 1~6 各出现一次 → count[10001..10006] = 1，其余为 0。remain = k = 2，i 从最高下标开始向下扫描。' },
  { rows: [
      [10006, 10005, 10004, 10003, 10002, 10001, 10000],
      [1, 1, 1, 1, 1, 1, 0],
    ], rowPointers: [{ row: 0, col: 0, label: 'i' }], rowHighlight: [{ row: 1, cols: [0] }], note: 'i=10006：remain -= count[10006] = 1 → remain = 1。remain > 0，继续向下扫描。' },
  { rows: [
      [10006, 10005, 10004, 10003, 10002, 10001, 10000],
      [1, 1, 1, 1, 1, 1, 0],
    ], rowPointers: [{ row: 0, col: 1, label: 'i' }], rowHighlight: [{ row: 1, cols: [1] }], note: 'i=10005：remain -= count[10005] = 1 → remain = 0 ≤ 0，返回 i - offset = 10005 - 10000 = 5。第 2 大的元素是 5 ✅' },
]
</script>

<!-- problem:start -->

# [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array)

## 题目描述

<!-- description:start -->

<p>给定整数数组 <code>nums</code> 和整数 <code>k</code>，请返回数组中第 <code><strong>k</strong></code> 个最大的元素。</p>

<p>请注意，你需要找的是数组排序后的第 <code>k</code> 个最大的元素，而不是第 <code>k</code> 个不同的元素。</p>

<p>你必须设计并实现时间复杂度为 <code>O(n)</code> 的算法解决此问题。</p>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>

<pre>
<strong>输入:</strong> <code>[3,2,1,5,6,4],</code> k = 2
<strong>输出:</strong> 5
</pre>

<p><strong>示例&nbsp;2:</strong></p>

<pre>
<strong>输入:</strong> <code>[3,2,3,1,2,4,5,5,6], </code>k = 4
<strong>输出:</strong> 4</pre>

<p>&nbsp;</p>

<p><strong>提示： </strong></p>

<ul>
	<li><code>1 &lt;= k &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>4</sup>&nbsp;&lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：快速选择

快速选择算法是一种在未排序的数组中查找第 `k` 个最大元素或最小元素的算法。它的基本思想是每次选择一个基准元素，将数组分为两部分，一部分的元素都比基准元素小，另一部分的元素都比基准元素大，然后根据基准元素的位置，决定继续在左边还是右边查找，直到找到第 `k` 个最大元素。

时间复杂度 $O(n)$，空间复杂度 $O(\log n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

### 可视化演示

> 以 `nums = [3, 2, 1, 5, 6, 4]`、`k = 2` 为例，演示快速选择的分治过程：每次选 pivot 分区，根据分区位置 `j` 决定去左半还是右半继续找。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="quickSelectSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int[] nums;
    private int k;

    public int findKthLargest(int[] nums, int k) {
        this.nums = nums;
        this.k = nums.length - k;
        return quickSort(0, nums.length - 1);
    }

    private int quickSort(int l, int r) {
        if (l == r) {
            return nums[l];
        }
        int i = l - 1, j = r + 1;
        int x = nums[(l + r) >>> 1];
        while (i < j) {
            while (nums[++i] < x) {
            }
            while (nums[--j] > x) {
            }
            if (i < j) {
                int t = nums[i];
                nums[i] = nums[j];
                nums[j] = t;
            }
        }
        if (j < k) {
            return quickSort(j + 1, r);
        }
        return quickSort(l, j);
    }
}
```

```cpp [C++]
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        int n = nums.size();
        k = n - k;
        auto quickSort = [&](auto&& quickSort, int l, int r) -> int {
            if (l == r) {
                return nums[l];
            }
            int i = l - 1, j = r + 1;
            int x = nums[(l + r) >> 1];
            while (i < j) {
                while (nums[++i] < x) {
                }
                while (nums[--j] > x) {
                }
                if (i < j) {
                    swap(nums[i], nums[j]);
                }
            }
            if (j < k) {
                return quickSort(quickSort, j + 1, r);
            }
            return quickSort(quickSort, l, j);
        };
        return quickSort(quickSort, 0, n - 1);
    }
};
```

```ts [TypeScript]
function findKthLargest(nums: number[], k: number): number {
    const n = nums.length;
    k = n - k;
    const quickSort = (l: number, r: number): number => {
        if (l === r) {
            return nums[l];
        }
        let [i, j] = [l - 1, r + 1];
        const x = nums[(l + r) >> 1];
        while (i < j) {
            while (nums[++i] < x);
            while (nums[--j] > x);
            if (i < j) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
            }
        }
        if (j < k) {
            return quickSort(j + 1, r);
        }
        return quickSort(l, j);
    };
    return quickSort(0, n - 1);
}
```

```python [Python]
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        def quick_sort(l: int, r: int) -> int:
            if l == r:
                return nums[l]
            i, j = l - 1, r + 1
            x = nums[(l + r) >> 1]
            while i < j:
                while 1:
                    i += 1
                    if nums[i] >= x:
                        break
                while 1:
                    j -= 1
                    if nums[j] <= x:
                        break
                if i < j:
                    nums[i], nums[j] = nums[j], nums[i]
            if j < k:
                return quick_sort(j + 1, r)
            return quick_sort(l, j)

        n = len(nums)
        k = n - k
        return quick_sort(0, n - 1)
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：优先队列（小根堆）

我们可以维护一个大小为 $k$ 的小根堆 $\textit{minQ}$，然后遍历数组 $\textit{nums}$，将数组中的元素依次加入到小根堆中，当小根堆的大小超过 $k$ 时，我们将堆顶元素弹出，这样最终小根堆中的 $k$ 个元素就是数组中的 $k$ 个最大元素，堆顶元素就是第 $k$ 个最大元素。

时间复杂度 $O(n\log k)$，空间复杂度 $O(k)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

### 可视化演示

> 以 `nums = [3, 2, 1, 5, 6, 4]`、`k = 2` 为例，演示小根堆维护「最大的 k 个元素」：堆大小超过 k 时弹出堆顶，遍历结束后堆顶即第 k 大。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="heapSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minQ = new PriorityQueue<>();
        for (int x : nums) {
            minQ.offer(x);
            if (minQ.size() > k) {
                minQ.poll();
            }
        }
        return minQ.peek();
    }
}
```

```cpp [C++]
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minQ;
        for (int x : nums) {
            minQ.push(x);
            if (minQ.size() > k) {
                minQ.pop();
            }
        }
        return minQ.top();
    }
};
```

```ts [TypeScript]
function findKthLargest(nums: number[], k: number): number {
    const minQ = new MinPriorityQueue();
    for (const x of nums) {
        minQ.enqueue(x);
        if (minQ.size() > k) {
            minQ.dequeue();
        }
    }
    return minQ.front().element;
}
```

```python [Python]
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return nlargest(k, nums)[-1]
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三：计数排序

我们可以使用计数排序的思想，统计数组 $\textit{nums}$ 中每个元素出现的次数，记录在哈希表 $\textit{cnt}$ 中，然后从大到小遍历元素 $i$，每次减去出现的次数 $\textit{cnt}[i]$，直到 $k$ 小于等于 $0$，此时的元素 $i$ 就是数组中的第 $k$ 个最大元素。

时间复杂度 $O(n + m)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度，而 $m$ 为数组 $\textit{nums}$ 中元素的最大值。

### 可视化演示

> 以 `nums = [3, 2, 1, 5, 6, 4]`、`k = 2` 为例，演示计数排序的思路：统计每个元素出现次数后，从大到小累计计数，直到 `k` 减到 ≤ 0。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="countSortSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        Integer max = Integer.MIN_VALUE;
        for (int num : nums) {
            max = Math.max(num, max);
            map.put(num, map.getOrDefault(num, 0) + 1);
        }

        for (int i = max; i >= Integer.MIN_VALUE; i--) {
            k -= map.getOrDefault(i, 0);
            if (k <= 0) {
                return i;
            }
        }

        throw new IllegalStateException("not find");
    }
}
```

```cpp [C++]
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        unordered_map<int, int> cnt;
        int m = INT_MIN;
        for (int x : nums) {
            ++cnt[x];
            m = max(m, x);
        }
        for (int i = m;; --i) {
            k -= cnt[i];
            if (k <= 0) {
                return i;
            }
        }
    }
};
```

```ts [TypeScript]
function findKthLargest(nums: number[], k: number): number {
    const cnt: Record<number, number> = {};
    for (const x of nums) {
        cnt[x] = (cnt[x] || 0) + 1;
    }
    const m = Math.max(...nums);
    for (let i = m; ; --i) {
        k -= cnt[i] || 0;
        if (k <= 0) {
            return i;
        }
    }
}
```

```python [Python]
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        cnt = Counter(nums)
        for i in count(max(cnt), -1):
            k -= cnt[i]
            if k <= 0:
                return i
```

:::

## 方法四：计数排序的优化

当数值范围有限时，可以用一个计数数组统计每个数值出现的次数，然后从大到小累减，直接定位第 $k$ 大的元素。先用 `offset = 10000` 做偏移，`count[offset + num]` 表示数值 `num` 出现的次数；再用 `remain = k` 从最大值往下扫：`remain -= count[i]`，当 `remain <= 0` 时，`i - offset` 就是答案。

时间复杂度 $O(n + U)$，空间复杂度 $O(U)$，其中 $U$ 为值域大小（本题为 $20001$）。

### 可视化演示

> 以 `nums = [3,2,1,5,6,4]`、`k = 2` 为例，演示计数排序优化的扫描过程：上面一行是计数数组的下标 `i`，下面一行是对应的 `count[i]`。`i` 从大到小扫描，黄色高亮为当前检查的频次，`remain` 从 `k` 开始逐项累减，减到 ≤ 0 时返回 `i - offset`。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="countOptSteps" />

<div class="viz-jump"><a href="#code-4">跳过可视化，直接看代码 ↓</a></div>

<a id="code-4"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int findKthLargest(int[] nums, int k) {
        int offset = 10000;
        int count[] = new int[20001]; // 最大的元素是20000，能访问的最大下标是容量-1
        for (int num : nums) {
            count[offset + num]++;
        }
        int remain = k;
        for (int i = count.length - 1; i >= 0; i--) {
            remain -= count[i];
            if (remain <= 0) {
                return i - offset;
            }
        }
        return -1;
    }
}
```

:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->