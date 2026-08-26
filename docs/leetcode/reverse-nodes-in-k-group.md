---
comments: true
difficulty: 困难
tags:
  - 递归
  - 链表
entry: reverseKGroup
testcases:
  - input:
      - - 1
        - 2
        - 3
        - 4
        - 5
      - 2
    output:
      - 2
      - 1
      - 4
      - 3
      - 5
  - input:
      - - 1
        - 2
        - 3
        - 4
        - 5
      - 3
    output:
      - 3
      - 2
      - 1
      - 4
      - 5
mode: link
---


<script setup>
// 方法一（迭代）可视化：head = [1,2,3,4,5]，k = 2 → [2,1,4,3,5]
// dummy 虚拟头节点；每轮 cur 前进 k 步定位组尾，切出后用 reverseList 反转并接回
const reverseKSteps = [
  { lists: [
      { title: 'dummy', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 0, label: 'cur' }] },
    ], note: 'k = 2。dummy = new ListNode(0, head) 建立虚拟头节点，pre = dummy，cur = dummy。' },
  { lists: [
      { title: 'dummy', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 2, label: 'cur' }] },
    ], note: 'while cur.next 非空：for 循环 k=2 次，cur 每轮前进一位：dummy → 节点1 → 节点2。cur 指向第一组末尾节点 2。' },
  { lists: [
      { title: 'dummy', values: [null, 1, 2], pointers: [{ id: 0, label: 'pre' }, { id: 2, label: 'cur' }, { id: 1, label: 'start' }], states: [{ id: 1, state: 'hl' }, { id: 2, state: 'hl' }] },
      { title: 't', values: [3, 4, 5], pointers: [{ id: 0, label: 't' }] },
    ], note: 't = cur.next = 节点 3；cur.next = null 将第一段 [1,2] 切出。start = pre.next = 节点 1。' },
  { lists: [
      { title: 'start', values: [1, 2], pointers: [{ id: 0, label: 'p' }], states: [{ id: 0, state: 'hl' }, { id: 1, state: 'hl' }] },
      { title: 'pre', values: [] },
    ], note: 'reverseList(start)：反转 [1,2]。pre = null，p = start（节点 1）。' },
  { lists: [
      { title: 'pre', values: [1], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }] },
      { title: 'p', values: [2], pointers: [{ id: 0, label: 'p' }] },
    ], note: '第 1 轮：q = p.next = 节点 2；p.next = pre（节点 1 → null）；pre = p（pre 指向节点 1）；p = q（p 指向节点 2）。' },
  { lists: [
      { title: 'pre', values: [2, 1], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
      { title: 'p', values: [] },
    ], note: '第 2 轮：q = p.next = null；p.next = pre（节点 2 → 节点 1）；pre = p（pre = [2,1]）；p = null。reverseList 返回 [2,1]。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 3, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }] },
    ], note: 'pre.next = reverseList(start) = 节点 2（dummy → 2 → 1）；start.next = t（节点 1 → 节点 3）。pre = start = 节点 1，cur = pre。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 3, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 4, label: 'cur' }], states: [{ id: 1, state: 'done' }] },
    ], note: '下一轮：cur.next 非空（节点 1 → 节点 3）。第二组：cur 前进 k=2 步：节点 1 → 节点 3 → 节点 4。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 3, 4], pointers: [{ id: 2, label: 'pre' }, { id: 4, label: 'cur' }, { id: 3, label: 'start' }], states: [{ id: 1, state: 'done' }, { id: 3, state: 'hl' }, { id: 4, state: 'hl' }] },
      { title: 't', values: [5], pointers: [{ id: 0, label: 't' }] },
    ], note: 't = cur.next = 节点 5；cur.next = null 切出第二段 [3,4]。start = pre.next = 节点 3。' },
  { lists: [
      { title: 'start', values: [3, 4], pointers: [{ id: 0, label: 'p' }], states: [{ id: 0, state: 'hl' }, { id: 1, state: 'hl' }] },
      { title: 'pre', values: [] },
    ], note: 'reverseList(start)：反转 [3,4]。pre = null，p = start（节点 3）。' },
  { lists: [
      { title: 'pre', values: [3], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }] },
      { title: 'p', values: [4], pointers: [{ id: 0, label: 'p' }] },
    ], note: '第 1 轮：q = p.next = 节点 4；p.next = pre（节点 3 → null）；pre = p（pre 指向节点 3）；p = q（p 指向节点 4）。' },
  { lists: [
      { title: 'pre', values: [4, 3], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
      { title: 'p', values: [] },
    ], note: '第 2 轮：q = p.next = null；p.next = pre（节点 4 → 节点 3）；pre = p（pre = [4,3]）；p = null。reverseList 返回 [4,3]。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 3, 5], pointers: [{ id: 4, label: 'pre' }, { id: 4, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: 'pre.next = 反转后头节点 4；start.next = t（节点 3 → 节点 5）。链表变为 ∅ → 2 → 1 → 4 → 3 → 5。pre = start = 节点 3，cur = pre。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 3, 5], pointers: [{ id: 4, label: 'pre' }], states: [{ id: 1, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '下一轮：cur.next 非空（节点 3 → 节点 5）。cur 前进 k=2 步：节点 3 → 节点 5 → null。cur == null，剩余节点不足一组，return dummy.next。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 3, 5], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'mark' }] },
    ], note: '返回 dummy.next = [2,1,4,3,5] ✅，剩余节点 5 保持原序。' },
]

// 方法二（递归）可视化：head = [1,2,3,4,5]，k = 2
// root 记录每组前驱，pre.next = cur 先接组尾，node/next 在段内逐节点翻转
const reverseKRecurSteps = [
  { lists: [
      { title: 'dummy', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'root' }] },
    ], note: 'k = 2。dummy = new ListNode(0, head)，root = dummy 记录每组前驱。' },
  { lists: [
      { title: 'dummy', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 2, label: 'cur' }] },
    ], note: 'pre = root，cur = root。count 前进 2 步：cur → 节点 1 → 节点 2，cur 指向第一组末尾。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 3, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 1, label: 'cur' }] },
      { title: 'nextRoot', values: [1], pointers: [{ id: 0, label: 'nextRoot' }] },
    ], note: 'nextRoot = pre.next = 节点 1；pre.next = cur（dummy 直接指向节点 2），节点 1 由 nextRoot 暂存。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 3, 4, 5], pointers: [{ id: 1, label: 'cur' }] },
    ], note: 'node = nextRoot（节点 1），next = node.next（节点 2）；node.next = cur.next（节点 1 → 节点 3）。交换 next.next = node（节点 2 → 节点 1），node = 节点 2 = cur，段内反转结束。root = nextRoot = 节点 1。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 3, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 4, label: 'cur' }] },
    ], note: '下一组：root = 节点 1 非空。pre = root（节点 1），cur 前进 2 步：节点 1 → 节点 3 → 节点 4，cur 指向第二组末尾。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 3, label: 'cur' }] },
      { title: 'nextRoot', values: [3], pointers: [{ id: 0, label: 'nextRoot' }] },
    ], note: 'nextRoot = pre.next = 节点 3；pre.next = cur（节点 1 → 节点 4），节点 3 由 nextRoot 暂存。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 3, 5], pointers: [{ id: 3, label: 'cur' }] },
    ], note: 'node = nextRoot（节点 3），next = node.next（节点 4）；node.next = cur.next（节点 3 → 节点 5）。交换 next.next = node（节点 4 → 节点 3），node = 节点 4 = cur，段内反转结束。root = nextRoot = 节点 3。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 3, 5], pointers: [{ id: 4, label: 'pre' }] },
    ], note: '下一组：root = 节点 3 非空。pre = root（节点 3），cur 前进：节点 3 → 节点 5 → null。cur == null，剩余不足 k 个，return dummy.next。' },
  { lists: [
      { title: 'dummy', values: [null, 2, 1, 4, 3, 5], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'mark' }] },
    ], note: '返回 dummy.next = [2,1,4,3,5] ✅，剩余节点 5 保持原序。' },
]
</script>

<!-- problem:start -->

# [25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group)

## 题目描述

<!-- description:start -->

<p>给你链表的头节点 <code>head</code> ，每&nbsp;<code>k</code><em>&nbsp;</em>个节点一组进行翻转，请你返回修改后的链表。</p>

<p><code>k</code> 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是&nbsp;<code>k</code><em>&nbsp;</em>的整数倍，那么请将最后剩余的节点保持原有顺序。</p>

<p>你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103414402.png" alt="image-20240823103414402" style="zoom: 80%;" />

<pre>
<strong>输入：</strong>head = [1,2,3,4,5], k = 2
<strong>输出：</strong>[2,1,4,3,5]
</pre>

<p><strong>示例 2：</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103436212.png" alt="image-20240823103436212" style="zoom: 80%;" />

<pre>
<strong>输入：</strong>head = [1,2,3,4,5], k = 3
<strong>输出：</strong>[3,2,1,4,5]
</pre>

<p>&nbsp;</p>
<strong>提示：</strong>

<ul>
	<li>链表中的节点数目为 <code>n</code></li>
	<li><code>1 &lt;= k &lt;= n &lt;= 5000</code></li>
	<li><code>0 &lt;= Node.val &lt;= 1000</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你可以设计一个只用 <code>O(1)</code> 额外内存空间的算法解决此问题吗？</p>

<ul>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：迭代

时间复杂度为 $O(n)$，空间复杂度为 $O(1)$，其中 $n$ 是链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]`、`k = 2` 为例，演示每 k 个节点一组翻转：`dummy` 为虚拟头节点，先让 `cur` 走 k 步定位组尾，再用 `reverseList` 反转该段并接回。蓝色为当前操作节点，黄色为待反转段，绿色为已翻转节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseKSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode pre = dummy, cur = dummy;
        while (cur.next != null) {
            for (int i = 0; i < k && cur != null; ++i) {
                cur = cur.next;
            }
            if (cur == null) {
                return dummy.next;
            }
            ListNode t = cur.next;
            cur.next = null;
            ListNode start = pre.next;
            pre.next = reverseList(start);
            start.next = t;
            pre = start;
            cur = pre;
        }
        return dummy.next;
    }

    private ListNode reverseList(ListNode head) {
        ListNode pre = null, p = head;
        while (p != null) {
            ListNode q = p.next;
            p.next = pre;
            pre = p;
            p = q;
        }
        return pre;
    }
}
```

```ts [TypeScript]
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    let dummy = new ListNode(0, head);
    let pre = dummy;
    // pre->head-> ... ->tail-> next
    while (head != null) {
        let tail = pre;
        for (let i = 0; i < k; ++i) {
            tail = tail.next;
            if (tail == null) {
                return dummy.next;
            }
        }
        let t = tail.next;
        [head, tail] = reverse(head, tail);
        // set next
        pre.next = head;
        tail.next = t;
        // set new pre and new head
        pre = tail;
        head = t;
    }
    return dummy.next;
}

function reverse(head: ListNode, tail: ListNode) {
    let cur = head;
    let pre = tail.next;
    // head -> next -> ... -> tail -> pre
    while (pre != tail) {
        let t = cur.next;
        cur.next = pre;
        pre = cur;
        cur = t;
    }
    return [tail, head];
}
```

```python [Python]
class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        def reverseList(head):
            pre, p = None, head
            while p:
                q = p.next
                p.next = pre
                pre = p
                p = q
            return pre

        dummy = ListNode(next=head)
        pre = cur = dummy
        while cur.next:
            for _ in range(k):
                cur = cur.next
                if cur is None:
                    return dummy.next
            t = cur.next
            cur.next = None
            start = pre.next
            pre.next = reverseList(start)
            start.next = t
            pre = start
            cur = pre
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：递归

时间复杂度为 $O(n)$，空间复杂度为 $O(\log _k n)$，其中 $n$ 是链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]`、`k = 2` 为例，演示递归解法逐组处理：`root` 记录每组前驱，`pre.next = cur` 先将组尾接到前驱，再在段内用 `node`/`next` 逐节点翻转。蓝色为当前操作节点，绿色为已翻转节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseKRecurSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group

```ts [TypeScript]
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    if (k === 1) {
        return head;
    }

    const dummy = new ListNode(0, head);
    let root = dummy;
    while (root != null) {
        let pre = root;
        let cur = root;

        let count = 0;
        while (count !== k) {
            count++;
            cur = cur.next;
            if (cur == null) {
                return dummy.next;
            }
        }

        const nextRoot = pre.next;
        pre.next = cur;

        let node = nextRoot;
        let next = node.next;
        node.next = cur.next;
        while (node != cur) {
            [next.next, node, next] = [node, next, next.next];
        }
        root = nextRoot;
    }

    return dummy.next;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->