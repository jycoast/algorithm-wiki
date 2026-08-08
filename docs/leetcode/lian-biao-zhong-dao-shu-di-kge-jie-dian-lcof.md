---
comments: true
difficulty: 简单

tags:
    - 链表
    - 双指针
---

<script setup>
// 方法一（快慢指针）可视化：head = [1,2,3,4,5]，k = 2
// 每步展示 slow/fast 指针移动，最终 slow 指向倒数第 k 个节点
const getKthFromEndSteps = [
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'slow' }, { id: 0, label: 'fast' }] },
    ], note: '初始化 slow = fast = head（节点 1）。目标：找到倒数第 k = 2 个节点。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 1, label: 'fast' }, { id: 0, label: 'slow' }], states: [{ id: 1, state: 'cur' }] },
    ], note: 'fast 先向前走第 1 步，指向节点 2。剩余步数 k = 1。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 2, label: 'fast' }, { id: 0, label: 'slow' }], states: [{ id: 2, state: 'cur' }] },
    ], note: 'fast 走第 2 步，指向节点 3。此时 k = 0，fast 领先 slow k = 2 步。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 3, label: 'fast' }, { id: 1, label: 'slow' }], states: [{ id: 3, state: 'cur' }, { id: 1, state: 'hl' }] },
    ], note: 'fast 和 slow 同时前进：slow 指向节点 2，fast 指向节点 4。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 4, label: 'fast' }, { id: 2, label: 'slow' }], states: [{ id: 4, state: 'cur' }, { id: 2, state: 'hl' }] },
    ], note: '继续前进：slow 指向节点 3，fast 指向节点 5（链尾，非空）。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 3, label: 'slow' }], states: [{ id: 3, state: 'cur' }] },
    ], note: 'fast 再前进一步变为 null，循环结束。此时 slow 指向节点 4，即倒数第 2 个节点。' },
  { lists: [
      { title: 'result', values: [4, 5], pointers: [{ id: 0, label: 'slow' }], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }] },
    ], note: '返回 slow，即从节点 4 开始的链表 [4, 5] ✅。' },
]
</script>

<!-- problem:start -->

# [面试题 22. 链表中倒数第 k 个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

## 题目描述

<!-- description:start -->

<p>输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。</p>

<p>例如，一个链表有 <code>6</code> 个节点，从头节点开始，它们的值依次是 <code>1、2、3、4、5、6</code>。这个链表的倒数第 <code>3</code> 个节点是值为 <code>4</code> 的节点。</p>

<p> </p>

<p><strong>示例：</strong></p>

<pre>
给定一个链表: <strong>1->2->3->4->5</strong>, 和 <em>k </em><strong>= 2</strong>.

返回链表 4<strong>->5</strong>.</pre>

<!-- description:end -->

<!-- solution:start -->

## 方法一：快慢指针

我们可以定义快慢指针 `fast` 和 `slow`，初始时均指向 `head`。

然后快指针 `fast` 先向前走 $k$ 步，然后快慢指针同时向前走，直到快指针走到链表尾部，此时慢指针指向的节点就是倒数第 $k$ 个节点。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为链表长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]`、`k = 2` 为例，演示快慢指针找倒数第 k 个节点：`fast` 先走 k 步，再与 `slow` 同步前进，`fast` 到达链表尾部时 `slow` 即为结果。蓝色为 `fast` 当前指向，黄色为 `slow` 当前指向，红色为目标节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="getKthFromEndSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group

```java
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode slow = head, fast = head;
        while (k-- > 0) {
            fast = fast.next;
        }
        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }
}
```

```cpp
class Solution {
public:
    ListNode* getKthFromEnd(ListNode* head, int k) {
        ListNode *slow = head, *fast = head;
        while (k--) {
            fast = fast->next;
        }
        while (fast) {
            slow = slow->next;
            fast = fast->next;
        }
        return slow;
    }
};
```

```python
class Solution:
    def getKthFromEnd(self, head: ListNode, k: int) -> ListNode:
        slow = fast = head
        for _ in range(k):
            fast = fast.next
        while fast:
            slow, fast = slow.next, fast.next
        return slow
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->