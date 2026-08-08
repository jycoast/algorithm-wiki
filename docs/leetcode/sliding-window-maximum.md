---
comments: true
difficulty: 困难

tags:
    - 队列
    - 数组
    - 滑动窗口
    - 单调队列
    - 堆（优先队列）
---

<script setup>
// 方法一（优先队列/大根堆）可视化：nums = [3,1,2,-1]，k=3
const maxSlidingWindowHeapSteps = [
  { array: [3, 1, 2, -1], window: [0, 1], note: '初始化：把前 k-1=2 个元素入大根堆：(3,0)、(1,1)。堆顶为 (3,0)，即 nums[0]=3' },
  { array: [3, 1, 2, -1], window: [0, 2], pointers: [{ label: 'i', index: 2 }, { label: '堆顶', index: 0 }], highlight: [2], note: 'i=2：入堆 (2,2)。堆顶 (3,0) 下标 0 > i-k=-1，未滑出窗口 → ans[0]=堆顶值 3' },
  { array: [3, 1, 2, -1], window: [1, 3], pointers: [{ label: 'i', index: 3 }, { label: '堆顶', index: 2 }], highlight: [0, 3], note: 'i=3：入堆 (-1,3)。堆顶 (3,0) 下标 0 ≤ i-k=0 已滑出 → 弹出；新堆顶 (2,2) 下标 2 > 0，未滑出 → ans[1]=2。ans=[3,2] ✅' },
]

// 方法二（单调队列）可视化：nums = [1,3,-1,-3,5,3,6,7]，k=3，队列 q 存下标
const maxSlidingWindowDequeSteps = [
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [0, 0], pointers: [{ label: 'i', index: 0 }], note: 'i=0：q 为空，直接入队 → q=[0]（存下标）。窗口未满（k=3），暂不记录最大值' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [0, 1], pointers: [{ label: 'i', index: 1 }, { label: '队尾', index: 0 }], highlight: [0, 1], note: 'i=1：队尾 nums[0]=1 ≤ nums[1]=3 → 弹出队尾（更小且更早的元素不可能再成为最大值）→ q=[]。入队 1 → q=[1]' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [0, 2], pointers: [{ label: 'i', index: 2 }, { label: '队首', index: 1 }, { label: '队尾', index: 2 }], highlight: [1, 2], note: 'i=2：队尾 nums[1]=3 > nums[2]=-1，保留。入队 2 → q=[1,2]。窗口已满，队首 nums[1]=3 → ans=[3]' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [1, 3], pointers: [{ label: 'i', index: 3 }, { label: '队首', index: 1 }, { label: '队尾', index: 3 }], highlight: [2, 3], note: 'i=3：队头下标 1 在窗口内（左界 i-k+1=1）。队尾 nums[2]=-1 > nums[3]=-3，保留。入队 3 → q=[1,2,3]。队首 nums[1]=3 → ans=[3,3]' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [2, 4], pointers: [{ label: 'i', index: 4 }, { label: '队首', index: 4 }, { label: '队尾', index: 4 }], highlight: [1, 2, 3, 4], note: 'i=4：队头下标 1 已滑出（左界 2）→ 弹出。新元素 5 大于队尾 -3、-1 → 全部弹出 → q=[]。入队 4 → q=[4]。队首 nums[4]=5 → ans=[3,3,5]' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [3, 5], pointers: [{ label: 'i', index: 5 }, { label: '队首', index: 4 }, { label: '队尾', index: 5 }], highlight: [4, 5], note: 'i=5：队头下标 4 在窗口内。队尾 nums[4]=5 > nums[5]=3，保留。入队 5 → q=[4,5]。队首 nums[4]=5 → ans=[3,3,5,5]' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [4, 6], pointers: [{ label: 'i', index: 6 }, { label: '队首', index: 6 }, { label: '队尾', index: 6 }], highlight: [4, 5, 6], note: 'i=6：队尾 nums[5]=3 ≤ 6、nums[4]=5 ≤ 6 → 全部弹出 → q=[]。入队 6 → q=[6]。队首 nums[6]=6 → ans=[3,3,5,5,6]' },
  { array: [1, 3, -1, -3, 5, 3, 6, 7], window: [5, 7], pointers: [{ label: 'i', index: 7 }, { label: '队首', index: 7 }, { label: '队尾', index: 7 }], highlight: [6, 7], note: 'i=7：队尾 nums[6]=6 ≤ 7 → 弹出。入队 7 → q=[7]。队首 nums[7]=7 → ans=[3,3,5,5,6,7] ✅' },
]
</script>

<!-- problem:start -->

# [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>nums</code>，有一个大小为&nbsp;<code>k</code><em>&nbsp;</em>的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 <code>k</code>&nbsp;个数字。滑动窗口每次只向右移动一位。</p>

<p>返回 <em>滑动窗口中的最大值 </em>。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<b>输入：</b>nums = [1,3,-1,-3,5,3,6,7], k = 3
<b>输出：</b>[3,3,5,5,6,7]
<b>解释：</b>
滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       <strong>3</strong>
 1 [3  -1  -3] 5  3  6  7       <strong>3</strong>
 1  3 [-1  -3  5] 3  6  7      <strong> 5</strong>
 1  3  -1 [-3  5  3] 6  7       <strong>5</strong>
 1  3  -1  -3 [5  3  6] 7       <strong>6</strong>
 1  3  -1  -3  5 [3  6  7]      <strong>7</strong>
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<b>输入：</b>nums = [1], k = 1
<b>输出：</b>[1]
</pre>

<p>&nbsp;</p>

<p><b>提示：</b></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>4</sup>&nbsp;&lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
	<li><code>1 &lt;= k &lt;= nums.length</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：优先队列（大根堆）

我们可以使用优先队列（大根堆）来维护滑动窗口中的最大值。

先将前 $k-1$ 个元素加入优先队列，接下来从第 $k$ 个元素开始，将新元素加入优先队列，同时判断堆顶元素是否滑出窗口，如果滑出窗口则将堆顶元素弹出。然后我们将堆顶元素加入结果数组。

时间复杂度 $O(n \times \log k)$，空间复杂度 $O(k)$。其中 $n$ 为数组长度。

### 可视化演示

> 以 `nums = [3, 1, 2, -1]`，`k = 3` 为例，演示优先队列（大根堆）：绿色为当前窗口，指针 `i` 标当前新入堆元素，指针 `堆顶` 标堆顶对应数组位置；黄色为本次涉及的元素。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="maxSlidingWindowHeapSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        PriorityQueue<int[]> q
            = new PriorityQueue<>((a, b) -> a[0] == b[0] ? a[1] - b[1] : b[0] - a[0]);
        int n = nums.length;
        for (int i = 0; i < k - 1; ++i) {
            q.offer(new int[] {nums[i], i});
        }
        int[] ans = new int[n - k + 1];
        for (int i = k - 1, j = 0; i < n; ++i) {
            q.offer(new int[] {nums[i], i});
            while (q.peek()[1] <= i - k) {
                q.poll();
            }
            ans[j++] = q.peek()[0];
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        priority_queue<pair<int, int>> q;
        int n = nums.size();
        for (int i = 0; i < k - 1; ++i) {
            q.push({nums[i], -i});
        }
        vector<int> ans;
        for (int i = k - 1; i < n; ++i) {
            q.push({nums[i], -i});
            while (-q.top().second <= i - k) {
                q.pop();
            }
            ans.emplace_back(q.top().first);
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        q = [(-v, i) for i, v in enumerate(nums[: k - 1])]
        heapify(q)
        ans = []
        for i in range(k - 1, len(nums)):
            heappush(q, (-nums[i], i))
            while q[0][1] <= i - k:
                heappop(q)
            ans.append(-q[0][0])
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：单调队列

这道题也可以使用单调队列来解决。时间复杂度 $O(n)$，空间复杂度 $O(k)$。

单调队列常见模型：找出滑动窗口中的最大值/最小值。模板：

```python [Python]
q = deque()
for i in range(n):
    # 判断队头是否滑出窗口
    while q and checkout_out(q[0]):
        q.popleft()
    while q and check(q[-1]):
        q.pop()
    q.append(i)
```

### 可视化演示

> 以 `nums = [1, 3, -1, -3, 5, 3, 6, 7]`，`k = 3` 为例，演示单调队列：绿色为当前窗口，指针 `队首`/`队尾` 指向单调递减队列 `q` 的首尾下标，指针 `i` 标当前元素；黄色为本次被弹出/入队的元素。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="maxSlidingWindowDequeSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] ans = new int[n - k + 1];
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0, j = 0; i < n; ++i) {
            if (!q.isEmpty() && i - k + 1 > q.peekFirst()) {
                q.pollFirst();
            }
            while (!q.isEmpty() && nums[q.peekLast()] <= nums[i]) {
                q.pollLast();
            }
            q.offer(i);
            if (i >= k - 1) {
                ans[j++] = nums[q.peekFirst()];
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> q;
        vector<int> ans;
        for (int i = 0; i < nums.size(); ++i) {
            if (!q.empty() && i - k + 1 > q.front()) {
                q.pop_front();
            }
            while (!q.empty() && nums[q.back()] <= nums[i]) {
                q.pop_back();
            }
            q.push_back(i);
            if (i >= k - 1) {
                ans.emplace_back(nums[q.front()]);
            }
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        q = deque()
        ans = []
        for i, v in enumerate(nums):
            if q and i - k + 1 > q[0]:
                q.popleft()
            while q and nums[q[-1]] <= v:
                q.pop()
            q.append(i)
            if i >= k - 1:
                ans.append(nums[q[0]])
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->