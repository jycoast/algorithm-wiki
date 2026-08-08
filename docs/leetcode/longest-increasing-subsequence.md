---
comments: true
difficulty: 中等

tags:
    - 数组
    - 二分查找
    - 动态规划
---

<script setup>
// 方法一（动态规划 O(n²)）可视化：nums = [10, 9, 2, 5, 3, 7, 101, 18]
// f[i] = 以 nums[i] 结尾的最长递增子序列长度，f[i] = max(f[i], f[j] + 1) for j < i 且 nums[j] < nums[i]
// 答案 f = [1, 1, 1, 2, 2, 3, 4, 4]，即 4
const lisSteps = [
  {
    dp: [1, null, null, null, null, null, null, null],
    dpStates: [{ i: 0, state: 'cur' }],
    pointers: [{ i: 0, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [0] }],
    note: 'i=0：nums[0]=10，前面没有元素，f[0]=1。以 10 结尾的最长递增子序列就是它本身。',
  },
  {
    dp: [1, 1, null, null, null, null, null, null],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'cur' }],
    pointers: [{ i: 1, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [1] }],
    note: 'i=1：nums[1]=9，前面 nums[0]=10 不小于 9，找不到更小元素，f[1]=1。',
  },
  {
    dp: [1, 1, 1, null, null, null, null, null],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'cur' }],
    pointers: [{ i: 2, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [2] }],
    note: 'i=2：nums[2]=2，前面 10、9 都不小于 2，找不到更小元素，f[2]=1。',
  },
  {
    dp: [1, 1, 1, 2, null, null, null, null],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'hl' }, { i: 3, state: 'cur' }],
    pointers: [{ i: 3, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [3] }],
    note: 'i=3：nums[3]=5，j=2 时 nums[2]=2<5，f[3]=f[2]+1=1+1=2。最长递增子序列为 [2,5]。',
  },
  {
    dp: [1, 1, 1, 2, 2, null, null, null],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'hl' }, { i: 3, state: 'done' }, { i: 4, state: 'cur' }],
    pointers: [{ i: 4, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [4] }],
    note: 'i=4：nums[4]=3，j=2 时 nums[2]=2<3，f[4]=f[2]+1=1+1=2。最长递增子序列为 [2,3]。',
  },
  {
    dp: [1, 1, 1, 2, 2, 3, null, null],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'hl' }, { i: 3, state: 'hl' }, { i: 4, state: 'hl' }, { i: 5, state: 'cur' }],
    pointers: [{ i: 5, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [5] }],
    note: 'i=5：nums[5]=7，j∈{2,3,4} 都小于 7，f[5]=max(f[2],f[3],f[4])+1=max(1,2,2)+1=3。最长递增子序列为 [2,5,7] 或 [2,3,7]。',
  },
  {
    dp: [1, 1, 1, 2, 2, 3, 4, null],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'hl' }, { i: 6, state: 'cur' }],
    pointers: [{ i: 6, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [6] }],
    note: 'i=6：nums[6]=101，前面 10,9,2,5,3,7 全部小于 101，取最大 f=3，f[6]=3+1=4。最长递增子序列为 [2,5,7,101] 或 [2,3,7,101]。',
  },
  {
    dp: [1, 1, 1, 2, 2, 3, 4, 4],
    dpStates: [{ i: 0, state: 'done' }, { i: 1, state: 'done' }, { i: 2, state: 'done' }, { i: 3, state: 'done' }, { i: 4, state: 'done' }, { i: 5, state: 'hl' }, { i: 6, state: 'mark' }, { i: 7, state: 'cur' }],
    pointers: [{ i: 7, label: 'i' }],
    aux: [{ title: 'nums', values: [10, 9, 2, 5, 3, 7, 101, 18], highlight: [7] }],
    note: 'i=7：nums[7]=18，前面小于 18 的最大 f 是 f[5]=3（nums[5]=7<18），f[7]=3+1=4。答案 ans = 4（子序列 [2,5,7,101] 或 [2,3,7,101]）✅。',
  },
]

// 方法二（离散化 + 树状数组 BIT）可视化：nums = [10, 9, 2, 5, 3, 7, 101, 18]
// 离散化后 ranks = [5, 4, 1, 3, 2, 6, 8, 7]，tree 为树状数组（节点下标 1..8）
// dp 数组下标 0..7 对应 tree 节点下标 1..8（dp[0]=tree[1]，…，dp[7]=tree[8]）
const bitSteps = [
  {
    dp: [0, 0, 0, 0, 0, 0, 0, 0],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7] }],
    note: '初始化：tree 为树状数组，节点下标 1..8。tree[i] 覆盖区间 (i-lowbit(i)+1 .. i) 的最大值。这里 dp 数组下标 0..7 对应 tree 节点下标 1..8（dp[0]=tree[1]，…，dp[7]=tree[8]）。辅助行 rank 为 nums 离散化后的排名：10→5, 9→4, 2→1, 5→3, 3→2, 7→6, 101→8, 18→7。',
  },
  {
    dp: [0, 0, 0, 0, 1, 1, 0, 1],
    dpStates: [{ i: 4, state: 'cur' }, { i: 5, state: 'hl' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 4, label: 'x=5' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [0] }],
    note: 'x=5：query(5)=0，t=0+1=1；update(5,1)：i=5→tree[5]=1，i=6→tree[6]=1，i=8→tree[8]=1。tree=[0,0,0,0,1,1,0,1]。',
  },
  {
    dp: [0, 0, 0, 1, 1, 1, 0, 1],
    dpStates: [{ i: 3, state: 'cur' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 3, label: 'x=4' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [1] }],
    note: 'x=4：query(4)=0，t=0+1=1；update(4,1)：i=4→tree[4]=1，i=8→tree[8]=1。tree=[0,0,0,1,1,1,0,1]。',
  },
  {
    dp: [1, 1, 0, 1, 1, 1, 0, 1],
    dpStates: [{ i: 0, state: 'cur' }, { i: 1, state: 'hl' }, { i: 3, state: 'hl' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 0, label: 'x=1' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [2] }],
    note: 'x=1：query(1)=0，t=0+1=1；update(1,1)：i=1→tree[1]=1，i=2→tree[2]=1，i=4→tree[4]=1，i=8→tree[8]=1。tree=[1,1,0,1,1,1,0,1]。',
  },
  {
    dp: [1, 1, 2, 2, 1, 1, 0, 2],
    dpStates: [{ i: 2, state: 'cur' }, { i: 3, state: 'hl' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 2, label: 'x=3' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [3] }],
    note: 'x=3：query(3)：i=3→tree[3]=0，i=2→tree[2]=1，前缀最大=1，t=1+1=2；update(3,2)：i=3→tree[3]=2，i=4→tree[4]=2，i=8→tree[8]=2。tree=[1,1,2,2,1,1,0,2]。',
  },
  {
    dp: [1, 2, 2, 2, 1, 1, 0, 2],
    dpStates: [{ i: 1, state: 'cur' }, { i: 3, state: 'hl' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 1, label: 'x=2' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [4] }],
    note: 'x=2：query(2)=tree[2]=1，t=1+1=2；update(2,2)：i=2→tree[2]=2，i=4→tree[4]=2，i=8→tree[8]=2。tree=[1,2,2,2,1,1,0,2]。',
  },
  {
    dp: [1, 2, 2, 2, 1, 3, 0, 3],
    dpStates: [{ i: 5, state: 'cur' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 5, label: 'x=6' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [5] }],
    note: 'x=6：query(6)：i=6→tree[6]=1，i=4→tree[4]=2，前缀最大=2，t=2+1=3；update(6,3)：i=6→tree[6]=3，i=8→tree[8]=3。tree=[1,2,2,2,1,3,0,3]。',
  },
  {
    dp: [1, 2, 2, 2, 1, 3, 0, 4],
    dpStates: [{ i: 7, state: 'cur' }],
    pointers: [{ i: 7, label: 'x=8' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [6] }],
    note: 'x=8：query(8)=tree[8]=3，t=3+1=4；update(8,4)：i=8→tree[8]=4。tree=[1,2,2,2,1,3,0,4]。',
  },
  {
    dp: [1, 2, 2, 2, 1, 3, 4, 4],
    dpStates: [{ i: 6, state: 'cur' }, { i: 7, state: 'hl' }],
    pointers: [{ i: 6, label: 'x=7' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7], highlight: [7] }],
    note: 'x=7：query(7)：i=7→tree[7]=0，i=6→tree[6]=3，i=4→tree[4]=2，前缀最大=3，t=3+1=4；update(7,4)：i=7→tree[7]=4，i=8→tree[8]=4。tree=[1,2,2,2,1,3,4,4]。',
  },
  {
    dp: [1, 2, 2, 2, 1, 3, 4, 4],
    dpStates: [{ i: 7, state: 'mark' }],
    pointers: [{ i: 7, label: 'ans' }],
    title: 'tree',
    aux: [{ title: 'rank', values: [5, 4, 1, 3, 2, 6, 8, 7] }],
    note: '遍历结束，答案 = query(8) = tree[8] = 4 ✅。最长递增子序列为 [2,5,7,101] 或 [2,3,7,101]，长度 4。',
  },
]
</script>

<!-- problem:start -->

# [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>nums</code> ，找到其中最长严格递增子序列的长度。</p>

<p><strong>子序列&nbsp;</strong>是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，<code>[3,6,2,7]</code> 是数组 <code>[0,3,1,6,2,2,7]</code> 的<span data-keyword="subsequence-array">子序列</span>。</p>
&nbsp;

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [10,9,2,5,3,7,101,18]
<strong>输出：</strong>4
<strong>解释：</strong>最长递增子序列是 [2,3,7,101]，因此长度为 4 。
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [0,1,0,3,2,3]
<strong>输出：</strong>4
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>nums = [7,7,7,7,7,7,7]
<strong>输出：</strong>1
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 2500</code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
</ul>

<p>&nbsp;</p>

<p><b>进阶：</b></p>

<ul>
	<li>你能将算法的时间复杂度降低到&nbsp;<code>O(n log(n))</code> 吗?</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i]$ 表示以 $nums[i]$ 结尾的最长递增子序列的长度，初始时 $f[i] = 1$，答案为 $f[i]$ 的最大值。

对于 $f[i]$，我们需要枚举 $0 \le j \lt i$，如果 $nums[j] \lt nums[i]$，则 $f[i] = \max(f[i], f[j] + 1)$。

最后的答案即为 $f[i]$ 的最大值。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

算法过程演示：

![img](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/68747470733a2f2f6c6162756c61646f6e672e6f6e6c696e652f616c676f2f696d616765732f2545362539432538302545392539352542462545392538302539322545352541322539452545352541442539302545352542412538462545352538382539372f676966312e676966)

### 可视化演示

> 以 `nums = [10, 9, 2, 5, 3, 7, 101, 18]` 为例，演示动态规划：`f[i]` 为以 `nums[i]` 结尾的最长递增子序列长度，取所有小于 `nums[i]` 的前缀中的最大 `f[j]` 再加 1。蓝色为当前计算，绿色为已完成，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="lisSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] f = new int[n];
        Arrays.fill(f, 1);
        int ans = 1;
        for (int i = 1; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (nums[j] < nums[i]) {
                    f[i] = Math.max(f[i], f[j] + 1);
                }
            }
            ans = Math.max(ans, f[i]);
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> f(n, 1);
        for (int i = 1; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (nums[j] < nums[i]) {
                    f[i] = max(f[i], f[j] + 1);
                }
            }
        }
        return *max_element(f.begin(), f.end());
    }
};
```

```ts [TypeScript]
function lengthOfLIS(nums: number[]): number {
    const n = nums.length;
    const f: number[] = new Array(n).fill(1);
    for (let i = 1; i < n; ++i) {
        for (let j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                f[i] = Math.max(f[i], f[j] + 1);
            }
        }
    }
    return Math.max(...f);
}
```

```python [Python]
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        f = [1] * n
        for i in range(1, n):
            for j in range(i):
                if nums[j] < nums[i]:
                    f[i] = max(f[i], f[j] + 1)
        return max(f)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：离散化 + 树状数组

我们将数组中的元素离散化，然后使用树状数组维护不大于某个元素的最长递增子序列的长度。

遍历数组中的每个元素 $x$，将其离散化，然后在树状数组中查找不大于 $x-1$ 的最长递增子序列的长度 $t$，则 $x$ 的最长递增子序列的长度为 $t+1$，更新答案，并且更新树状数组中 $x$ 的最长递增子序列的长度。

遍历完数组中的所有元素，即可得到答案。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

### 可视化演示

> 以 `nums = [10, 9, 2, 5, 3, 7, 101, 18]` 为例，演示离散化 + 树状数组：先离散化得排名 `rank = [5, 4, 1, 3, 2, 6, 8, 7]`，对每个 `x` 用 `query(x-1)+1` 求出以该元素结尾的最长递增子序列长度 `t`，再 `update(x, t)` 写回树状数组。蓝色为当前元素，黄色为被更新的树状数组节点，红色为答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="bitSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] s = nums.clone();
        Arrays.sort(s);
        int m = 0;
        int n = s.length;
        for (int i = 0; i < n; ++i) {
            if (i == 0 || s[i] != s[i - 1]) {
                s[m++] = s[i];
            }
        }
        BinaryIndexedTree tree = new BinaryIndexedTree(m);
        for (int x : nums) {
            x = search(s, x, m);
            int t = tree.query(x - 1) + 1;
            tree.update(x, t);
        }
        return tree.query(m);
    }

    private int search(int[] nums, int x, int r) {
        int l = 0;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (nums[mid] >= x) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l + 1;
    }
}

class BinaryIndexedTree {
    private int n;
    private int[] c;

    public BinaryIndexedTree(int n) {
        this.n = n;
        c = new int[n + 1];
    }

    public void update(int x, int v) {
        while (x <= n) {
            c[x] = Math.max(c[x], v);
            x += x & -x;
        }
    }

    public int query(int x) {
        int mx = 0;
        while (x > 0) {
            mx = Math.max(mx, c[x]);
            x -= x & -x;
        }
        return mx;
    }
}
```

```cpp [C++]
class BinaryIndexedTree {
public:
    BinaryIndexedTree(int _n)
        : n(_n)
        , c(_n + 1) {}

    void update(int x, int v) {
        while (x <= n) {
            c[x] = max(c[x], v);
            x += x & -x;
        }
    }

    int query(int x) {
        int mx = 0;
        while (x) {
            mx = max(mx, c[x]);
            x -= x & -x;
        }
        return mx;
    }

private:
    int n;
    vector<int> c;
};

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> s = nums;
        sort(s.begin(), s.end());
        s.erase(unique(s.begin(), s.end()), s.end());
        BinaryIndexedTree tree(s.size());
        for (int x : nums) {
            x = lower_bound(s.begin(), s.end(), x) - s.begin() + 1;
            int t = tree.query(x - 1) + 1;
            tree.update(x, t);
        }
        return tree.query(s.size());
    }
};
```

```ts [TypeScript]
class BinaryIndexedTree {
    private n: number;
    private c: number[];

    constructor(n: number) {
        this.n = n;
        this.c = new Array(n + 1).fill(0);
    }

    update(x: number, v: number) {
        while (x <= this.n) {
            this.c[x] = Math.max(this.c[x], v);
            x += x & -x;
        }
    }

    query(x: number): number {
        let mx = 0;
        while (x) {
            mx = Math.max(mx, this.c[x]);
            x -= x & -x;
        }
        return mx;
    }
}

function lengthOfLIS(nums: number[]): number {
    const s = [...new Set(nums)].sort((a, b) => a - b);
    const m = s.length;
    const tree = new BinaryIndexedTree(m);
    for (let x of nums) {
        x = search(s, x);
        const t = tree.query(x - 1) + 1;
        tree.update(x, t);
    }
    return tree.query(m);
}

function search(nums: number[], x: number): number {
    let l = 0,
        r = nums.length - 1;
    while (l < r) {
        const mid = (l + r) >> 1;
        if (nums[mid] >= x) {
            r = mid;
        } else {
            l = mid + 1;
        }
    }
    return l + 1;
}
```

```python [Python]
class BinaryIndexedTree:
    def __init__(self, n: int):
        self.n = n
        self.c = [0] * (n + 1)

    def update(self, x: int, v: int):
        while x <= self.n:
            self.c[x] = max(self.c[x], v)
            x += x & -x

    def query(self, x: int) -> int:
        mx = 0
        while x:
            mx = max(mx, self.c[x])
            x -= x & -x
        return mx


class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        s = sorted(set(nums))
        m = len(s)
        tree = BinaryIndexedTree(m)
        for x in nums:
            x = bisect_left(s, x) + 1
            t = tree.query(x - 1) + 1
            tree.update(x, t)
        return tree.query(m)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->