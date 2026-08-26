---
comments: true
difficulty: 中等
tags:
  - 递归
  - 链表
entry: swapPairs
testcases:
  - input:
      - - 1
        - 2
        - 3
        - 4
    output:
      - 2
      - 1
      - 4
      - 3
  - input:
      - []
    output: []
  - input:
      - - 1
    output:
      - 1
mode: link
---


<script setup>
// 方法一（递归）可视化：head = [1,2,3,4]
// 递归深入最深层后，回溯时逐对交换相邻节点
const swapRecurSteps = [
  { lists: [
      { title: 'head', values: [1, 2, 3, 4], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
    ], note: 'swapPairs([1,2,3,4])：head = 1 且 head.next = 2 均存在，递归调用 swapPairs(head.next.next)，即对 [3,4] 继续两两交换。' },
  { lists: [
      { title: 'head', values: [3, 4], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
    ], note: '递归层 swapPairs([3,4])：head = 3 且 head.next = 4 均存在，递归调用 swapPairs(head.next.next)，即 swapPairs(null)。' },
  { lists: [
      { title: 'head', values: [] },
    ], note: '递归层 swapPairs(null)：head 为 null，命中终止条件，直接返回 null。' },
  { lists: [
      { title: '返回', values: [4, 3], pointers: [{ id: 0, label: 'p' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
    ], note: '回溯到 swapPairs([3,4])：t = swapPairs(null) = null；p = head.next = 4。p.next = head（4→3）、head.next = t（3→null），返回 p，子链表交换为 [4,3]。' },
  { lists: [
      { title: '返回', values: [2, 1, 4, 3], pointers: [{ id: 0, label: 'p' }], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }] },
    ], note: '回溯到 swapPairs([1,2,3,4])：t = swapPairs([3,4]) = [4,3]；p = head.next = 2。p.next = head（2→1）、head.next = t（1→[4,3]），返回 p。最终结果 [2,1,4,3] ✅。' },
]
// 方法二（迭代）可视化：dummy 虚拟头节点，pre 指向已交换对的前驱，cur/t 为当前待交换的两个节点
const swapSteps = [
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'pre' }, { id: 1, label: 'cur' }] },
    ], note: '创建虚拟头节点 dummy，pre = dummy，cur = head = 1。' },
  { lists: [
      { title: '链表', values: [null, 1, 2, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'pre' }, { id: 1, label: 'cur' }, { id: 2, label: 't' }], states: [{ id: 1, state: 'cur' }, { id: 2, state: 'hl' }] },
    ], note: '进入循环：cur = 1、cur.next = 2 均非空。t = cur.next = 2，准备交换 cur 与 t。' },
  { lists: [
      { title: '链表', values: [null, 2, 1, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'pre' }, { id: 1, label: 't' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '交换：cur.next = t.next（1→3）、t.next = cur（2→1）、pre.next = t（dummy→2），第一对节点完成交换，链表变为 2→1→3→4。' },
  { lists: [
      { title: '链表', values: [null, 2, 1, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '更新指针：pre = cur（指向 1），cur = cur.next = 3。' },
  { lists: [
      { title: '链表', values: [null, 2, 1, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'pre' }, { id: 3, label: 'cur' }, { id: 4, label: 't' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'cur' }, { id: 4, state: 'hl' }] },
    ], note: '进入循环：cur = 3、cur.next = 4 均非空。t = cur.next = 4，准备交换 cur 与 t。' },
  { lists: [
      { title: '链表', values: [null, 2, 1, 4, 3], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'pre' }, { id: 3, label: 't' }, { id: 4, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '交换：cur.next = t.next（3→null）、t.next = cur（4→3）、pre.next = t（1→4），第二对节点完成交换，链表变为 2→1→4→3。' },
  { lists: [
      { title: '链表', values: [null, 2, 1, 4, 3], pointers: [{ id: 0, label: 'dummy' }, { id: 4, label: 'pre' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '更新指针：pre = cur（指向 3），cur = cur.next = null，循环结束。' },
  { lists: [
      { title: '链表', values: [null, 2, 1, 4, 3], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '返回 dummy.next = [2,1,4,3] ✅，两两交换完成。' },
]
</script>

<!-- problem:start -->

# [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs)

## 题目描述

<!-- description:start -->

<p>给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104256208.png" alt="image-20240823104256208"  />

<pre>
<strong>输入：</strong>head = [1,2,3,4]
<strong>输出：</strong>[2,1,4,3]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>head = []
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>head = [1]
<strong>输出：</strong>[1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点的数目在范围 <code>[0, 100]</code> 内</li>
	<li><code>0 &lt;= Node.val &lt;= 100</code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：递归

我们可以通过递归的方式实现两两交换链表中的节点。

递归的终止条件是链表中没有节点，或者链表中只有一个节点，此时无法进行交换，直接返回该节点。

否则，我们递归交换链表 $head.next.next$，记交换后的头节点为 $t$，然后我们记 $head$ 的下一个节点为 $p$，然后令 $p$ 指向 $head$，而 $head$ 指向 $t$，最后返回 $p$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$，其中 $n$ 是链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4]` 为例，演示递归两两交换：递归逐层深入（蓝色为当前层头节点），回溯时逐对交换相邻节点（绿色），最终返回完整结果（红色）。点击 ▶ 播放，或逐步操作。

<ListViz :steps="swapRecurSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group
```java [Java]
class Solution {
    public ListNode swapPairs(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode t = swapPairs(head.next.next);
        ListNode p = head.next;
        p.next = head;
        head.next = t;
        return p;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        if (!head || !head->next) {
            return head;
        }
        ListNode* t = swapPairs(head->next->next);
        ListNode* p = head->next;
        p->next = head;
        head->next = t;
        return p;
    }
};
```

```ts [TypeScript]
function swapPairs(head: ListNode | null): ListNode | null {
    if (!head || !head.next) {
        return head;
    }
    const t = swapPairs(head.next.next);
    const p = head.next;
    p.next = head;
    head.next = t;
    return p;
}
```

```python [Python]
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if head is None or head.next is None:
            return head
        t = self.swapPairs(head.next.next)
        p = head.next
        p.next = head
        head.next = t
        return p
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：迭代

我们设置一个虚拟头节点 $dummy$，初始时指向 $head$，然后设置两个指针 $pre$ 和 $cur$，初始时 $pre$ 指向 $dummy$，而 $cur$ 指向 $head$。

接下来，我们遍历链表，每次需要交换 $pre$ 后面的两个节点，因此我们先判断 $cur$ 和 $cur.next$ 是否为空，若不为空，则进行交换，否则终止循环。

时间复杂度 $O(n)$，空间复杂度 $O(1)$，其中 $n$ 是链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4]` 为例，演示迭代两两交换：`dummy` 为虚拟头节点，`pre` 指向已交换对的前驱，`cur`/`t` 为当前待交换的两个节点。蓝色为当前节点，黄色为待交换节点，绿色为已完成交换，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="swapSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode pre = dummy;
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            ListNode t = cur.next;
            cur.next = t.next;
            t.next = cur;
            pre.next = t;
            pre = cur;
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* pre = dummy;
        ListNode* cur = head;
        while (cur && cur->next) {
            ListNode* t = cur->next;
            cur->next = t->next;
            t->next = cur;
            pre->next = t;
            pre = cur;
            cur = cur->next;
        }
        return dummy->next;
    }
};
```

```ts [TypeScript]
function swapPairs(head: ListNode | null): ListNode | null {
    const dummy = new ListNode(0, head);
    let [pre, cur] = [dummy, head];
    while (cur && cur.next) {
        const t = cur.next;
        cur.next = t.next;
        t.next = cur;
        pre.next = t;
        [pre, cur] = [cur, cur.next];
    }
    return dummy.next;
}
```

```python [Python]
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(next=head)
        pre, cur = dummy, head
        while cur and cur.next:
            t = cur.next
            cur.next = t.next
            t.next = cur
            pre.next = t
            pre, cur = cur, cur.next
        return dummy.next
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->