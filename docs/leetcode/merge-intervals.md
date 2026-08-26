---
comments: true
difficulty: 中等
tags:
  - 数组
  - 排序
entry: merge
testcases:
  - input:
      - - - 1
          - 3
        - - 2
          - 6
        - - 8
          - 10
        - - 15
          - 18
    output:
      - - 1
        - 6
      - - 8
        - 10
      - - 15
        - 18
  - input:
      - - - 1
          - 4
        - - 4
          - 5
    output:
      - - 1
        - 5
---


<script setup>
// 可视化演示数据：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 排序 + 一次遍历：ed 维护当前合并区间的右端点，重叠则取 max，不重叠则输出
const mergeIntervalSteps = [
  { intervals: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }], note: '按左端点升序排序。取第一个区间作为当前合并区间：st=1，ed=3' },
  { intervals: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [0, 1], note: '处理 [2,6]：ed=3 ≥ s=2，两区间重叠 → ed = max(3,6) = 6（当前合并区间变为 [1,6]）' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [1], note: '处理 [8,10]：ed=6 < s=8，不重叠 → 输出合并结果 [1,6]，开始新区间 [8,10]' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [2], note: '处理 [15,18]：ed=10 < s=15，不重叠 → 输出 [8,10]，开始新区间 [15,18]' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10, merged: true }, { start: 15, end: 18, merged: true }], note: '遍历结束，输出最后一个区间 [15,18]。最终结果 [[1,6],[8,10],[15,18]] ✅' },
]
// 方法二（ans 列表）可视化：ans 始终维护已合并的区间，s/e 为当前区间左右端点
const mergeAnsSteps = [
  { intervals: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }], note: '排序后。ans 初始化为第一个区间：ans = [[1,3]]。从 i=1 开始遍历。' },
  { intervals: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [1], note: 'i=1：s=2，e=6。ans 末尾 end=3 ≥ s=2，重叠 → ans 末尾 end = max(3,6) = 6，即 [1,3] 更新为 [1,6]。' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [1], note: 'i=2：s=8，e=10。ans 末尾 end=6 < s=8，不重叠 → 将 [8,10] 直接加入 ans，ans = [[1,6],[8,10]]。' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10, merged: true }, { start: 15, end: 18 }], intervalHighlight: [2], note: 'i=3：s=15，e=18。ans 末尾 end=10 < s=15，不重叠 → 将 [15,18] 加入 ans，ans = [[1,6],[8,10],[15,18]]。' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10, merged: true }, { start: 15, end: 18, merged: true }], note: '遍历结束，返回 ans = [[1,6],[8,10],[15,18]] ✅' },
]
// 方法三（l/r 指针）可视化：l/r 维护当前合并区间，内层 while 贪心扩展 r，res 收集结果
const mergeResSteps = [
  { intervals: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [0], note: '排序后。i=0：取当前区间为合并段 l=1，r=3。i 后移。' },
  { intervals: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [0, 1], note: '内层 while：r=3 ≥ intervals[1].start=2，重叠 → r = max(3,6) = 6，i 后移。' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [1], note: 'r=6 < intervals[2].start=8，内层结束，res 加入 [l,r]=[1,6]。i=2：取 l=8，r=10。' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10 }, { start: 15, end: 18 }], intervalHighlight: [1, 2], note: '内层 while：r=10 < intervals[3].start=15，不重叠，内层直接结束，res 加入 [8,10]。i=3：取 l=15，r=18。' },
  { intervals: [{ start: 1, end: 6, merged: true }, { start: 8, end: 10, merged: true }, { start: 15, end: 18, merged: true }], note: 'i=3 到达末尾，res 加入 [15,18]。res = [[1,6],[8,10],[15,18]] ✅' },
]
</script>

<!-- problem:start -->

# [56. 合并区间](https://leetcode.cn/problems/merge-intervals)

## 题目描述

<!-- description:start -->

<p>以数组 <code>intervals</code> 表示若干个区间的集合，其中单个区间为 <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> 。请你合并所有重叠的区间，并返回&nbsp;<em>一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间</em>&nbsp;。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>intervals = [[1,3],[2,6],[8,10],[15,18]]
<strong>输出：</strong>[[1,6],[8,10],[15,18]]
<strong>解释：</strong>区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
</pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入：</strong>intervals = [[1,4],[4,5]]
<strong>输出：</strong>[[1,5]]
<strong>解释：</strong>区间 [1,4] 和 [4,5] 可被视为重叠区间。</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= intervals.length &lt;= 10<sup>4</sup></code></li>
	<li><code>intervals[i].length == 2</code></li>
	<li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：排序 + 一次遍历

我们可以将区间按照左端点升序排列，然后遍历区间进行合并操作。

具体的合并操作如下。

我们先将第一个区间加入答案，然后依次考虑之后的每个区间：

-   如果答案数组中最后一个区间的右端点小于当前考虑区间的左端点，说明两个区间不会重合，因此我们可以直接将当前区间加入答案数组末尾；
-   否则，说明两个区间重合，我们需要用当前区间的右端点更新答案数组中最后一个区间的右端点，将其置为二者的较大值。

最后，我们返回答案数组即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为区间个数。

### 可视化演示

> 以 `intervals = [[1,3],[2,6],[8,10],[15,18]]` 为例，演示「排序 + 一次遍历」合并区间。绿色为已合并输出的区间。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="mergeIntervalSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        int st = intervals[0][0], ed = intervals[0][1];
        List<int[]> ans = new ArrayList<>();
        for (int i = 1; i < intervals.length; ++i) {
            int s = intervals[i][0], e = intervals[i][1];
            if (ed < s) {
                ans.add(new int[] {st, ed});
                st = s;
                ed = e;
            } else {
                ed = Math.max(ed, e);
            }
        }
        ans.add(new int[] {st, ed});
        return ans.toArray(new int[ans.size()][]);
    }
}
```


```cpp [C++]
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        int st = intervals[0][0], ed = intervals[0][1];
        vector<vector<int>> ans;
        for (int i = 1; i < intervals.size(); ++i) {
            if (ed < intervals[i][0]) {
                ans.push_back({st, ed});
                st = intervals[i][0];
                ed = intervals[i][1];
            } else {
                ed = max(ed, intervals[i][1]);
            }
        }
        ans.push_back({st, ed});
        return ans;
    }
};
```

```ts [TypeScript]
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const ans: number[][] = [];
    let [st, ed] = intervals[0];
    for (const [s, e] of intervals.slice(1)) {
        if (ed < s) {
            ans.push([st, ed]);
            [st, ed] = [s, e];
        } else {
            ed = Math.max(ed, e);
        }
    }
    ans.push([st, ed]);
    return ans;
}
```

```python [Python]
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        ans = []
        st, ed = intervals[0]
        for s, e in intervals[1:]:
            if ed < s:
                ans.append([st, ed])
                st, ed = s, e
            else:
                ed = max(ed, e)
        ans.append([st, ed])
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二

我们将区间按左端点升序排序，然后维护一个结果列表 `ans`。遍历每个区间，用 `s`、`e` 记录当前区间的左右端点：若 `ans` 末尾区间的右端点小于 `s`，说明不重叠，直接加入 `ans`；否则更新末尾区间的右端点为较大值。

时间复杂度 $O(n \log n)$，空间复杂度 $O(\log n)$（排序所需）。

### 可视化演示

> 以 `intervals = [[1,3],[2,6],[8,10],[15,18]]` 为例，演示 `ans` 列表的维护过程：绿色为已合并/已确定加入 `ans` 的区间，黄色为当前正在处理的输入区间。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="mergeAnsSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> ans = new ArrayList<>();
        ans.add(intervals[0]);
        for (int i = 1; i < intervals.length; ++i) {
            int s = intervals[i][0], e = intervals[i][1];
            if (ans.get(ans.size() - 1)[1] < s) {
                ans.add(intervals[i]);
            } else {
                ans.get(ans.size() - 1)[1] = Math.max(ans.get(ans.size() - 1)[1], e);
            }
        }
        return ans.toArray(new int[ans.size()][]);
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> ans;
        ans.emplace_back(intervals[0]);
        for (int i = 1; i < intervals.size(); ++i) {
            if (ans.back()[1] < intervals[i][0]) {
                ans.emplace_back(intervals[i]);
            } else {
                ans.back()[1] = max(ans.back()[1], intervals[i][1]);
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const ans: number[][] = [intervals[0]];
    for (let i = 1; i < intervals.length; ++i) {
        if (ans.at(-1)[1] < intervals[i][0]) {
            ans.push(intervals[i]);
        } else {
            ans.at(-1)[1] = Math.max(ans.at(-1)[1], intervals[i][1]);
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        ans = [intervals[0]]
        for s, e in intervals[1:]:
            if ans[-1][1] < s:
                ans.append([s, e])
            else:
                ans[-1][1] = max(ans[-1][1], e)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三

我们也可以先把区间按左端点升序排序，再用双指针的方式合并。`l`、`r` 维护当前合并段的左右端点，指针 `i` 从前往后扫描：内层 `while` 不断吞并所有与当前段重叠的区间并扩展 `r`，每处理完一段就把 `[l, r]` 加入结果 `res`。

时间复杂度 $O(n \log n)$，空间复杂度 $O(\log n)$（排序所需）。

### 可视化演示

> 以 `intervals = [[1,3],[2,6],[8,10],[15,18]]` 为例，演示 `l`/`r` 合并段的扩展过程：绿色为已确定加入 `res` 的区间，黄色为当前正在被 `l`/`r` 扫描的区间。点击 ▶ 播放，或逐步操作。

<ArrayViz :steps="mergeResSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>

<!-- tabs:start -->
::: code-group

```ts [TypeScript]
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const n = intervals.length;
    const res = [];
    let i = 0;
    while (i < n) {
        let [l, r] = intervals[i];
        i++;
        while (i < n && r >= intervals[i][0]) {
            r = Math.max(r, intervals[i][1]);
            i++;
        }
        res.push([l, r]);
    }
    return res;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->