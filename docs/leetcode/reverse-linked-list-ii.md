---
comments: true
difficulty: 中等

tags:
    - 链表
---

<script setup>
// 方法一（模拟）可视化：head = [1,2,3,4,5]，left = 2，right = 4
// pre 走到第 left-1 个节点后，循环将 cur 依次反接到 pre 之前，最后重新接入链表
const reverseBetweenSteps = [
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'pre' }] },
    ], note: 'head = [1,2,3,4,5]，left = 2，right = 4。创建虚拟头节点 dummy，pre = dummy。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'pre' }, { id: 1, label: 'p' }, { id: 2, label: 'q' }, { id: 2, label: 'cur' }], states: [{ id: 2, state: 'hl' }] },
    ], note: 'pre 向后移动 left-1 = 1 步到节点 1。p = pre（节点 1），q = pre.next = 节点 2，cur = q。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 2, label: 'cur' }, { id: 3, label: 't' }], states: [{ id: 2, state: 'cur' }, { id: 3, state: 'hl' }] },
    ], note: '第 1 次循环：t = cur.next = 节点 3，准备将节点 2 拆出并反接。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 2, state: 'done' }] },
    ], note: '执行 cur.next = pre（2→1），pre = cur（指向 2），cur = t（指向 3）。节点 2 已反转。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 2, label: 'pre' }, { id: 3, label: 'cur' }, { id: 4, label: 't' }], states: [{ id: 2, state: 'done' }, { id: 3, state: 'cur' }, { id: 4, state: 'hl' }] },
    ], note: '第 2 次循环：t = cur.next = 节点 4，准备将节点 3 反接到 pre 之前。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 3, label: 'pre' }, { id: 4, label: 'cur' }], states: [{ id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '执行 cur.next = pre（3→2），pre = cur（指向 3），cur = t（指向 4）。节点 3 已反转，反转段为 3→2→1。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 3, label: 'pre' }, { id: 4, label: 'cur' }, { id: 5, label: 't' }], states: [{ id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'cur' }, { id: 5, state: 'hl' }] },
    ], note: '第 3 次循环：t = cur.next = 节点 5，准备将节点 4 反接到 pre 之前。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 4, label: 'pre' }, { id: 5, label: 'cur' }], states: [{ id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '执行 cur.next = pre（4→3），pre = cur（指向 4），cur = t（指向 5）。节点 4 已反转，反转段为 4→3→2→1。' },
  { lists: [
      { title: '链表', values: [null, 1, 4, 3, 2, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'p' }, { id: 2, label: 'pre' }, { id: 4, label: 'q' }, { id: 5, label: 'cur' }], states: [{ id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '循环结束。p.next = pre（1→4）、q.next = cur（2→5），反转段 [4,3,2] 被重新接入，链表变为 1→4→3→2→5。' },
  { lists: [
      { title: '链表', values: [null, 1, 4, 3, 2, 5], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'done' }] },
    ], note: '返回 dummy.next = [1,4,3,2,5] ✅，第 2 到第 4 个节点反转完成。' },
]
</script>

<!-- problem:start -->

# [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii)

## 题目描述

<!-- description:start -->

给你单链表的头指针 <code>head</code> 和两个整数 <code>left</code> 和 <code>right</code> ，其中 <code>left <= right</code> 。请你反转从位置 <code>left</code> 到位置 <code>right</code> 的链表节点，返回 <strong>反转后的链表</strong> 。

<p> </p>

<p><strong>示例 1：</strong></p>
<pre>
<strong>输入：</strong>head = [1,2,3,4,5], left = 2, right = 4
<strong>输出：</strong>[1,4,3,2,5]
</pre>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103540360.png" alt="image-20240823103540360" style="zoom: 80%;" />


<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>head = [5], left = 1, right = 1
<strong>输出：</strong>[5]
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点数目为 <code>n</code></li>
	<li><code>1 <= n <= 500</code></li>
	<li><code>-500 <= Node.val <= 500</code></li>
	<li><code>1 <= left <= right <= n</code></li>
</ul>

<p> </p>

<p><strong>进阶：</strong> 你可以使用一趟扫描完成反转吗？</p>

<!-- description:end -->


<!-- solution:start -->

## 方法一：模拟

定义一个虚拟头结点 `dummy`，指向链表的头结点 `head`，然后定义一个指针 `pre` 指向 `dummy`，从虚拟头结点开始遍历链表，遍历到第 `left` 个结点时，将 `pre` 指向该结点，然后从该结点开始遍历 `right - left + 1` 次，将遍历到的结点依次插入到 `pre` 的后面，最后返回 `dummy.next` 即可。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]`、`left = 2`、`right = 4` 为例，演示区间反转：`pre` 从虚拟头节点走到第 `left-1` 个节点，循环将 `cur` 依次反接到 `pre` 之前。蓝色为当前待反接节点，黄色为 `t`（后继节点），绿色为已完成反转的节点，红色为反转区间。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseBetweenSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        if (head.next == null || left == right) {
            return head;
        }
        ListNode dummy = new ListNode(0, head);
        ListNode pre = dummy;
        for (int i = 0; i < left - 1; ++i) {
            pre = pre.next;
        }
        ListNode p = pre;
        ListNode q = pre.next;
        ListNode cur = q;
        for (int i = 0; i < right - left + 1; ++i) {
            ListNode t = cur.next;
            cur.next = pre;
            pre = cur;
            cur = t;
        }
        p.next = pre;
        q.next = cur;
        return dummy.next;
    }
}
```



```cpp [C++]
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        if (!head->next || left == right) {
            return head;
        }
        ListNode* dummy = new ListNode(0, head);
        ListNode* pre = dummy;
        for (int i = 0; i < left - 1; ++i) {
            pre = pre->next;
        }
        ListNode *p = pre, *q = pre->next;
        ListNode* cur = q;
        for (int i = 0; i < right - left + 1; ++i) {
            ListNode* t = cur->next;
            cur->next = pre;
            pre = cur;
            cur = t;
        }
        p->next = pre;
        q->next = cur;
        return dummy->next;
    }
};
```

```ts [TypeScript]
function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
    const n = right - left;
    if (n === 0) {
        return head;
    }

    const dummy = new ListNode(0, head);
    let pre = null;
    let cur = dummy;
    for (let i = 0; i < left; i++) {
        pre = cur;
        cur = cur.next;
    }
    const h = pre;
    pre = null;
    for (let i = 0; i <= n; i++) {
        const next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    h.next.next = cur;
    h.next = pre;
    return dummy.next;
}
```

```python [Python]
class Solution:
    def reverseBetween(
        self, head: Optional[ListNode], left: int, right: int
    ) -> Optional[ListNode]:
        if head.next is None or left == right:
            return head
        dummy = ListNode(0, head)
        pre = dummy
        for _ in range(left - 1):
            pre = pre.next
        p, q = pre, pre.next
        cur = q
        for _ in range(right - left + 1):
            t = cur.next
            cur.next = pre
            pre, cur = cur, t
        p.next = pre
        q.next = cur
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->