---
comments: true
difficulty: 简单

tags:
    - 递归
    - 链表
---

<script setup>
// 方法一（递归）可视化：l1 = [1,2,4]，l2 = [1,3,4]
// 每步展示当前递归层 mergeTwoLists(list1, list2) 的头节点比较，note 描述递归与回溯
const mergeRecurSteps = [
  { lists: [
      { title: 'list1', values: [1, 2, 4], pointers: [{ id: 0, label: 'list1' }] },
      { title: 'list2', values: [1, 3, 4], pointers: [{ id: 0, label: 'list2' }] },
    ], note: 'mergeTwoLists(list1, list2)：比较头节点，list1.val=1 <= list2.val=1，取 list1 头节点 1，递归 mergeTwoLists(list1.next, list2)。' },
  { lists: [
      { title: 'list1', values: [2, 4], pointers: [{ id: 0, label: 'list1' }] },
      { title: 'list2', values: [1, 3, 4], pointers: [{ id: 0, label: 'list2' }] },
    ], note: '递归层：mergeTwoLists([2,4], [1,3,4])：2 > 1，取 list2 头节点 1，递归 mergeTwoLists(list1, list2.next)。' },
  { lists: [
      { title: 'list1', values: [2, 4], pointers: [{ id: 0, label: 'list1' }] },
      { title: 'list2', values: [3, 4], pointers: [{ id: 0, label: 'list2' }] },
    ], note: '递归层：mergeTwoLists([2,4], [3,4])：2 <= 3，取 list1 头节点 2，递归 mergeTwoLists(list1.next, list2)。' },
  { lists: [
      { title: 'list1', values: [4], pointers: [{ id: 0, label: 'list1' }] },
      { title: 'list2', values: [3, 4], pointers: [{ id: 0, label: 'list2' }] },
    ], note: '递归层：mergeTwoLists([4], [3,4])：4 > 3，取 list2 头节点 3，递归 mergeTwoLists(list1, list2.next)。' },
  { lists: [
      { title: 'list1', values: [4], pointers: [{ id: 0, label: 'list1' }] },
      { title: 'list2', values: [4], pointers: [{ id: 0, label: 'list2' }] },
    ], note: '递归层：mergeTwoLists([4], [4])：4 <= 4，取 list1 头节点 4，递归 mergeTwoLists(list1.next, list2)。' },
  { lists: [
      { title: 'list1', values: [] },
      { title: 'list2', values: [4], pointers: [{ id: 0, label: 'list2' }] },
    ], note: '递归出口：list1 为空，返回 list2 = [4]。开始回溯拼接。' },
  { lists: [
      { title: 'list1', values: [] },
      { title: 'list2', values: [] },
    ], note: '回溯：返回的链表逐层拼接：4 → 3-4 → 2-3-4 → 1-2-3-4 → 1-1-2-3-4，最终合并结果 [1,1,2,3,4,4] ✅。' },
]
// 方法二（迭代）可视化：dummy 虚拟头节点，curr 指向已合并末尾，list1/list2 头指针逐步后移
const mergeSteps = [
  { lists: [
      { title: 'list1', values: [1, 2, 4], pointers: [{ id: 0, label: 'list1' }] },
      { title: 'list2', values: [1, 3, 4], pointers: [{ id: 0, label: 'list2' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'curr' }] },
    ], note: '建虚拟头节点 dummy，curr = dummy。list1 = [1,2,4]，list2 = [1,3,4]。' },
  { lists: [
      { title: 'list1', values: [2, 4], pointers: [{ id: 0, label: 'list1' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'list2', values: [1, 3, 4], pointers: [{ id: 0, label: 'list2' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 1], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'curr' }], states: [{ id: 1, state: 'done' }] },
    ], note: '比较 list1.val=1 与 list2.val=1，1 <= 1 取 list1 头节点。curr.next = 1，list1 后移，curr = 1。' },
  { lists: [
      { title: 'list1', values: [2, 4], pointers: [{ id: 0, label: 'list1' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'list2', values: [3, 4], pointers: [{ id: 0, label: 'list2' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'result', values: [null, 1, 1], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'curr' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '比较 2 与 list2.val=1，1 < 2 取 list2 头节点。curr.next = 1，list2 后移，curr = 1。' },
  { lists: [
      { title: 'list1', values: [4], pointers: [{ id: 0, label: 'list1' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'list2', values: [3, 4], pointers: [{ id: 0, label: 'list2' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 1, 1, 2], pointers: [{ id: 0, label: 'dummy' }, { id: 3, label: 'curr' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '比较 2 与 3，2 <= 3 取 list1 头节点 2。curr.next = 2，list1 后移，curr = 2。' },
  { lists: [
      { title: 'list1', values: [4], pointers: [{ id: 0, label: 'list1' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'list2', values: [4], pointers: [{ id: 0, label: 'list2' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'result', values: [null, 1, 1, 2, 3], pointers: [{ id: 0, label: 'dummy' }, { id: 4, label: 'curr' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '比较 4 与 3，3 < 4 取 list2 头节点 3。curr.next = 3，list2 后移，curr = 3。' },
  { lists: [
      { title: 'list1', values: [], },
      { title: 'list2', values: [4], pointers: [{ id: 0, label: 'list2' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'result', values: [null, 1, 1, 2, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 5, label: 'curr' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }] },
    ], note: '比较 4 与 4，4 <= 4 取 list1 头节点 4。list1 变为空，curr = 4。' },
  { lists: [
      { title: 'list1', values: [] },
      { title: 'list2', values: [] },
      { title: 'result', values: [null, 1, 1, 2, 3, 4, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 6, label: 'curr' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }] },
    ], note: 'list1 为空，curr.next = list2 剩余部分（节点 4），拼接完成。' },
  { lists: [
      { title: 'list1', values: [] },
      { title: 'list2', values: [] },
      { title: 'result', values: [null, 1, 1, 2, 3, 4, 4], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'mark' }, { id: 6, state: 'mark' }] },
    ], note: '返回 dummy.next = [1,1,2,3,4,4] ✅，合并完成。' },
]
</script>

<!-- problem:start -->

# [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists)

## 题目描述

<!-- description:start -->

<p>将两个升序链表合并为一个新的 <strong>升序</strong> 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 </p>

<p> </p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103009784.png" alt="image-20240823103009784" style="zoom:80%;" />
<pre>
<strong>输入：</strong>l1 = [1,2,4], l2 = [1,3,4]
<strong>输出：</strong>[1,1,2,3,4,4]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>l1 = [], l2 = []
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>l1 = [], l2 = [0]
<strong>输出：</strong>[0]
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li>两个链表的节点数目范围是 <code>[0, 50]</code></li>
	<li><code>-100 <= Node.val <= 100</code></li>
	<li><code>l1</code> 和 <code>l2</code> 均按 <strong>非递减顺序</strong> 排列</li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递归

我们先判断链表 $l_1$ 和 $l_2$ 是否为空，若其中一个为空，则返回另一个链表。否则，我们比较 $l_1$ 和 $l_2$ 的头节点：

-   若 $l_1$ 的头节点的值小于等于 $l_2$ 的头节点的值，则递归调用函数 $mergeTwoLists(l_1.next, l_2)$，并将 $l_1$ 的头节点与返回的链表头节点相连，返回 $l_1$ 的头节点。
-   否则，递归调用函数 $mergeTwoLists(l_1, l_2.next)$，并将 $l_2$ 的头节点与返回的链表头节点相连，返回 $l_2$ 的头节点。

时间复杂度 $O(m + n)$，空间复杂度 $O(m + n)$。其中 $m$ 和 $n$ 分别为两个链表的长度。

### 可视化演示

> 以 `l1 = [1, 2, 4]`、`l2 = [1, 3, 4]` 为例，演示递归合并：每层比较两链表头节点，较小者被取出并递归合并剩余部分，回溯时逐层拼接。蓝色为当前比较的节点，黄色为被参照的节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="mergeRecurSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        if (list1 == null) {
            return list2;
        }
        if (list2 == null) {
            return list1;
        }
        if (list1.val <= list2.val) {
            list1.next = mergeTwoLists(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoLists(list1, list2.next);
            return list2;
        }
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (!list1) return list2;
        if (!list2) return list1;
        if (list1->val <= list2->val) {
            list1->next = mergeTwoLists(list1->next, list2);
            return list1;
        } else {
            list2->next = mergeTwoLists(list1, list2->next);
            return list2;
        }
    }
};
```

```ts [TypeScript]
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    if (list1 == null || list2 == null) {
        return list1 || list2;
    }
    if (list1.val < list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
}
```

```python [Python]
class Solution:
    def mergeTwoLists(
        self, list1: Optional[ListNode], list2: Optional[ListNode]
    ) -> Optional[ListNode]:
        if list1 is None or list2 is None:
            return list1 or list2
        if list1.val <= list2.val:
            list1.next = self.mergeTwoLists(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists(list1, list2.next)
            return list2
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：迭代

我们也可以用迭代的方式来实现两个排序链表的合并。

我们先定义一个虚拟头节点 $dummy$，然后循环遍历两个链表，比较两个链表的头节点，将较小的节点添加到 $dummy$ 的末尾，直到其中一个链表为空，然后将另一个链表的剩余部分添加到 $dummy$ 的末尾。

最后返回 $dummy.next$ 即可。

时间复杂度 $O(m + n)$，其中 $m$ 和 $n$ 分别为两个链表的长度。忽略答案链表的空间消耗，空间复杂度 $O(1)$。

### 可视化演示

> 以 `l1 = [1, 2, 4]`、`l2 = [1, 3, 4]` 为例，演示迭代合并：`dummy` 为虚拟头节点，`curr` 指向已合并链表的末尾，每步将较小的头节点拼接到 `curr` 之后。蓝色为当前取出的节点，黄色为被比较的节点，红色为最终合并结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="mergeSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode();
        ListNode curr = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                curr.next = list1;
                list1 = list1.next;
            } else {
                curr.next = list2;
                list2 = list2.next;
            }
            curr = curr.next;
        }
        curr.next = list1 == null ? list2 : list1;
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode* dummy = new ListNode();
        ListNode* curr = dummy;
        while (list1 && list2) {
            if (list1->val <= list2->val) {
                curr->next = list1;
                list1 = list1->next;
            } else {
                curr->next = list2;
                list2 = list2->next;
            }
            curr = curr->next;
        }
        curr->next = list1 ? list1 : list2;
        return dummy->next;
    }
};
```

```ts [TypeScript]
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let cur = dummy;
    while (list1 != null && list2 != null) {
        if (list1.val < list2.val) {
            cur.next = list1;
            list1 = list1.next;
        } else {
            cur.next = list2;
            list2 = list2.next;
        }
        cur = cur.next;
    }
    cur.next = list1 || list2;
    return dummy.next;
}
```

```python [Python]
class Solution:
    def mergeTwoLists(
        self, list1: Optional[ListNode], list2: Optional[ListNode]
    ) -> Optional[ListNode]:
        dummy = ListNode()
        curr = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                curr.next = list1
                list1 = list1.next
            else:
                curr.next = list2
                list2 = list2.next
            curr = curr.next
        curr.next = list1 or list2
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->