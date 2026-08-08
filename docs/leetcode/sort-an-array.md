---
comments: true
difficulty: 中等

tags:
    - 数组
    - 分治
    - 桶排序
    - 计数排序
    - 基数排序
    - 排序
    - 堆（优先队列）
    - 归并排序
---

<script setup>
// 方法一（快速排序）可视化：nums = [5,2,3,1]
// 双指针 i/j 夹逼，pivot x 取中点
const quickSortSteps = [
  { array: [5, 2, 3, 1], note: 'nums = [5,2,3,1]，区间 [0,3]，取 pivot x = nums[(0+3)>>1] = nums[1] = 2' },
  { array: [5, 2, 3, 1], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 3 }], highlight: [0, 3], note: 'i 找 < 2 停于 nums[0]=5，j 找 > 2 停于 nums[3]=1。i<j → 交换 → [1,2,3,5]' },
  { array: [1, 2, 3, 5], pointers: [{ label: 'i', index: 1 }, { label: 'j', index: 1 }], note: 'i 推进至 nums[1]=2（≥2 停），j 缩至 nums[1]，i≥j 退出。分区点 j=1' },
  { array: [1, 2, 3, 5], highlight: [0, 1], note: '递归左半 [0,1]：[1,2]，pivot = nums[0] = 1，一次分区后已有序' },
  { array: [1, 2, 3, 5], highlight: [2, 3], note: '递归右半 [2,3]：[3,5]，pivot = nums[2] = 3，一次分区后已有序' },
  { array: [1, 2, 3, 5], note: '全部区间排序完成 → [1,2,3,5] ✅' },
]

// 方法二（堆排序）可视化：nums = [5,2,3,1]，大根堆 + 不断把堆顶沉到末尾
const heapSortSteps = [
  { array: [5, 2, 3, 1], note: 'nums = [5,2,3,1]。建堆：从最后一个非叶节点 i = n/2-1 = 1 开始自下而上 heapify' },
  { array: [5, 2, 3, 1], note: 'heapify(4,1)：nums[3]=1 不大于 nums[1]=2；heapify(4,0)：左右子节点均 ≤ 5。大根堆建成：[5,2,3,1]' },
  { array: [5, 2, 3, 1], pointers: [{ label: '堆顶', index: 0 }], highlight: [0, 3], note: '交换堆顶与末尾：swap(nums[0], nums[3]) → [1,2,3,5]，末尾 5 已就位' },
  { array: [3, 2, 1, 5], pointers: [{ label: '堆顶', index: 0 }], note: '对前 3 个元素下沉：heapify(3,0)，5 换成 3 后向下调整 → [3,2,1,5]' },
  { array: [3, 2, 1, 5], pointers: [{ label: '堆顶', index: 0 }], highlight: [0, 2], note: '交换 nums[0] 与 nums[2] → [1,2,3,5]，末尾 3 就位' },
  { array: [2, 1, 3, 5], pointers: [{ label: '堆顶', index: 0 }], note: '下沉 heapify(2,0)：3 换成 2 后调整 → [2,1,3,5]' },
  { array: [1, 2, 3, 5], pointers: [{ label: '堆顶', index: 0 }], highlight: [0, 1], note: '交换 nums[0] 与 nums[1] → [1,2,3,5]，全部就位 ✅' },
]

// 方法三（归并排序）可视化：nums = [5,2,3,1]，先拆分后两两合并
const mergeSortSteps = [
  { array: [5, 2, 3, 1], note: 'nums = [5,2,3,1]。递归拆分：mid=(0+3)>>1=1 → 左半 [0,1]、右半 [2,3]' },
  { array: [2, 5, 3, 1], highlight: [0, 1], note: '合并左半 [5] 与 [2]：5≤2? 否，先取 2 再取 5 → [2,5]，写回 nums[0..1] → [2,5,3,1]' },
  { array: [2, 5, 1, 3], highlight: [2, 3], note: '合并右半 [3] 与 [1]：3≤1? 否，先取 1 再取 3 → [1,3]，写回 nums[2..3] → [2,5,1,3]' },
  { array: [2, 5, 1, 3], pointers: [{ label: 'i', index: 0 }, { label: 'j', index: 2 }], highlight: [0, 3], note: '合并 [2,5] 与 [1,3]：i=0,j=2。2≤1? 否 → 取 1；2≤3? 是 → 取 2；5≤3? 否 → 取 3；剩 5 → tmp=[1,2,3,5]' },
  { array: [1, 2, 3, 5], note: 'tmp 写回 nums[0..3] → [1,2,3,5]。排序完成 ✅' },
]
</script>

<!-- problem:start -->

# [912. 排序数组](https://leetcode.cn/problems/sort-an-array)



## 题目描述

<!-- description:start -->

<p>给你一个整数数组&nbsp;<code>nums</code>，请你将该数组升序排列。</p>

<p>&nbsp;</p>

<ol>
</ol>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>nums = [5,2,3,1]
<strong>输出：</strong>[1,2,3,5]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>nums = [5,1,1,2,0,0]
<strong>输出：</strong>[0,0,1,1,2,5]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>-5 * 10<sup>4</sup> &lt;= nums[i] &lt;= 5 * 10<sup>4</sup></code></li>
</ul>
<!-- description:end -->



<!-- solution:start -->

## 方法一：快速排序

快速排序是一种高效的排序算法。它的基本思想是通过一趟排序将待排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为数组长度。

### 可视化演示

> 以 `nums = [5, 2, 3, 1]` 为例，演示快速排序：取中点 `pivot`，双指针 `i`/`j` 夹逼分区，再递归左右两侧。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="quickSortSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int[] nums;

    public int[] sortArray(int[] nums) {
        this.nums = nums;
        quikcSort(0, nums.length - 1);
        return nums;
    }

    private void quikcSort(int l, int r) {
        if (l >= r) {
            return;
        }
        int x = nums[(l + r) >> 1];
        int i = l - 1, j = r + 1;
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
        quikcSort(l, j);
        quikcSort(j + 1, r);
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        function<void(int, int)> quick_sort = [&](int l, int r) {
            if (l >= r) {
                return;
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
            quick_sort(l, j);
            quick_sort(j + 1, r);
        };
        quick_sort(0, nums.size() - 1);
        return nums;
    }
};
```

```ts [TypeScript]
function sortArray(nums: number[]): number[] {
    function quickSort(l: number, r: number) {
        if (l >= r) {
            return;
        }
        let i = l - 1;
        let j = r + 1;
        const x = nums[(l + r) >> 1];
        while (i < j) {
            while (nums[++i] < x);
            while (nums[--j] > x);
            if (i < j) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
            }
        }
        quickSort(l, j);
        quickSort(j + 1, r);
    }
    const n = nums.length;
    quickSort(0, n - 1);
    return nums;
}
```

```python [Python]
class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        def quick_sort(l, r):
            if l >= r:
                return
            x = nums[randint(l, r)]
            i, j, k = l - 1, r + 1, l
            while k < j:
                if nums[k] < x:
                    nums[i + 1], nums[k] = nums[k], nums[i + 1]
                    i, k = i + 1, k + 1
                elif nums[k] > x:
                    j -= 1
                    nums[j], nums[k] = nums[k], nums[j]
                else:
                    k = k + 1
            quick_sort(l, i)
            quick_sort(j, r)

        quick_sort(0, len(nums) - 1)
        return nums
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->
## 方法二：堆排序

先将数组构建成一个大根堆，然后不断将堆顶元素（最大值）与末尾元素交换并缩小堆的大小，即可得到升序序列。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(1)$。其中 $n$ 为数组长度。

### 可视化演示

> 以 `nums = [5, 2, 3, 1]` 为例，演示堆排序：先建大根堆，再反复把堆顶与末尾交换并下沉调整。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="heapSortSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int[] sortArray(int[] nums) {
        heapSort(nums);
        return nums;
    }

    private void heapSort(int[] nums) {
        int n = nums.length;

        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(nums, n, i);
        }

        for (int i = n - 1; i > 0; i--) {
            swap(nums, 0, i);
            heapify(nums, i, 0);
        }
    }

    private void heapify(int[] nums, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && nums[left] > nums[largest]) {
            largest = left;
        }

        if (right < n && nums[right] > nums[largest]) {
            largest = right;
        }

        if (largest != i) {
            swap(nums, i, largest);
            heapify(nums, n, largest);
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```
:::
<!-- solution:end -->

## 方法三：归并排序

归并排序是一种分治算法，其思想是将待排序的数据序列不断地折半拆分，直到每个数据块只有一个元素为止，然后再按照拆分的顺序将每个数据块两两合并，在合并的过程中进行排序，最终得到一个有序的数据序列。

归并排序是一种稳定的排序算法，时间复杂度为 $O(n \times \log n)$，空间复杂度为 $O(n)$。其中 $n$ 为数组长度。

### 可视化演示

> 以 `nums = [5, 2, 3, 1]` 为例，演示归并排序：递归拆分到单元素后，用指针 `i`/`j` 逐个比较、两两有序合并。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="mergeSortSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int[] nums;

    public int[] sortArray(int[] nums) {
        this.nums = nums;
        mergeSort(0, nums.length - 1);
        return nums;
    }

    private void mergeSort(int l, int r) {
        if (l >= r) {
            return;
        }
        int mid = (l + r) >> 1;
        mergeSort(l, mid);
        mergeSort(mid + 1, r);
        int i = l, j = mid + 1, k = 0;
        int[] tmp = new int[r - l + 1];
        while (i <= mid && j <= r) {
            if (nums[i] <= nums[j]) {
                tmp[k++] = nums[i++];
            } else {
                tmp[k++] = nums[j++];
            }
        }
        while (i <= mid) {
            tmp[k++] = nums[i++];
        }
        while (j <= r) {
            tmp[k++] = nums[j++];
        }
        for (i = l; i <= r; ++i) {
            nums[i] = tmp[i - l];
        }
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        function<void(int, int)> merge_sort = [&](int l, int r) {
            if (l >= r) {
                return;
            }
            int mid = (l + r) >> 1;
            merge_sort(l, mid);
            merge_sort(mid + 1, r);
            int i = l, j = mid + 1, k = 0;
            int tmp[r - l + 1];
            while (i <= mid && j <= r) {
                if (nums[i] <= nums[j]) {
                    tmp[k++] = nums[i++];
                } else {
                    tmp[k++] = nums[j++];
                }
            }
            while (i <= mid) {
                tmp[k++] = nums[i++];
            }
            while (j <= r) {
                tmp[k++] = nums[j++];
            }
            for (i = l; i <= r; ++i) {
                nums[i] = tmp[i - l];
            }
        };
        merge_sort(0, nums.size() - 1);
        return nums;
    }
};
```

```ts [TypeScript]
function sortArray(nums: number[]): number[] {
    function mergetSort(l: number, r: number) {
        if (l >= r) {
            return;
        }
        const mid = (l + r) >> 1;
        mergetSort(l, mid);
        mergetSort(mid + 1, r);
        let [i, j, k] = [l, mid + 1, 0];
        while (i <= mid && j <= r) {
            if (nums[i] <= nums[j]) {
                tmp[k++] = nums[i++];
            } else {
                tmp[k++] = nums[j++];
            }
        }
        while (i <= mid) {
            tmp[k++] = nums[i++];
        }
        while (j <= r) {
            tmp[k++] = nums[j++];
        }
        for (i = l, j = 0; i <= r; ++i, ++j) {
            nums[i] = tmp[j];
        }
    }
    const n = nums.length;
    let tmp = new Array(n).fill(0);
    mergetSort(0, n - 1);
    return nums;
}
```

```python [Python]
class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        def merge_sort(l, r):
            if l >= r:
                return
            mid = (l + r) >> 1
            merge_sort(l, mid)
            merge_sort(mid + 1, r)
            i, j = l, mid + 1
            tmp = []
            while i <= mid and j <= r:
                if nums[i] <= nums[j]:
                    tmp.append(nums[i])
                    i += 1
                else:
                    tmp.append(nums[j])
                    j += 1
            if i <= mid:
                tmp.extend(nums[i : mid + 1])
            if j <= r:
                tmp.extend(nums[j : r + 1])
            for i in range(l, r + 1):
                nums[i] = tmp[i - l]

        merge_sort(0, len(nums) - 1)
        return nums
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->