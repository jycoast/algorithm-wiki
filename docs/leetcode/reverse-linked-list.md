---
comments: true
difficulty: 简单
tags:
  - 递归
  - 链表
entry: reverseList
testcases:
  - input:
      - - 1
        - 2
        - 3
        - 4
        - 5
    output:
      - 5
      - 4
      - 3
      - 2
      - 1
  - input:
      - - 1
        - 2
    output:
      - 2
      - 1
  - input:
      - []
    output: []
mode: link
---


<script setup>
// 方法一（双指针）可视化：head = [1,2,3,4,5]
// prev 为已反转链表，curr 为剩余链表，每轮把 curr 头节点摘下接到 prev 之前
const reversePtrSteps = [
  { lists: [
      { title: 'prev', values: [] },
      { title: 'curr', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '初始化：prev = null，curr = head = 1。head = [1,2,3,4,5]。' },
  { lists: [
      { title: 'prev', values: [1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'curr', values: [2, 3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '第1轮：next = curr.next = 2；curr.next = prev(null)；prev = curr(1)；curr = next(2)。节点 1 反转到新链表头。' },
  { lists: [
      { title: 'prev', values: [2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }] },
      { title: 'curr', values: [3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '第2轮：next = curr.next = 3；curr.next = prev(1)；prev = curr(2)；curr = next(3)。节点 2 反转到新链表头。' },
  { lists: [
      { title: 'prev', values: [3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }] },
      { title: 'curr', values: [4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '第3轮：next = curr.next = 4；curr.next = prev(2)；prev = curr(3)；curr = next(4)。节点 3 反转到新链表头。' },
  { lists: [
      { title: 'prev', values: [4, 3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
      { title: 'curr', values: [5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '第4轮：next = curr.next = 5；curr.next = prev(3)；prev = curr(4)；curr = next(5)。节点 4 反转到新链表头。' },
  { lists: [
      { title: 'prev', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
      { title: 'curr', values: [] },
    ], note: '第5轮：next = curr.next = null；curr.next = prev(4)；prev = curr(5)；curr = next(null)。节点 5 反转完成，curr 为空。' },
  { lists: [
      { title: 'prev', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
      { title: 'curr', values: [] },
    ], note: '循环结束（curr == null）。head = prev = [5,4,3,2,1]，返回 head ✅，链表反转完成。' },
]
// 方法二（头插法）可视化：dummy 为虚拟头节点，每轮把 curr 头节点插入 dummy 之后
const reverseDummySteps = [
  { lists: [
      { title: 'curr', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }] },
    ], note: '初始化：dummy = new ListNode()，curr = head = 1。head = [1,2,3,4,5]。' },
  { lists: [
      { title: 'curr', values: [2, 3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 1], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'done' }] },
    ], note: '第1轮：next = curr.next = 2；curr.next = dummy.next(null)；dummy.next = curr(1)；curr = next(2)。节点 1 头插到 dummy 之后。' },
  { lists: [
      { title: 'curr', values: [3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 2, 1], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '第2轮：next = curr.next = 3；curr.next = dummy.next(1)；dummy.next = curr(2)；curr = next(3)。节点 2 头插到 dummy 之后。' },
  { lists: [
      { title: 'curr', values: [4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 3, 2, 1], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '第3轮：next = curr.next = 4；curr.next = dummy.next(2)；dummy.next = curr(3)；curr = next(4)。节点 3 头插到 dummy 之后。' },
  { lists: [
      { title: 'curr', values: [5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 4, 3, 2, 1], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '第4轮：next = curr.next = 5；curr.next = dummy.next(3)；dummy.next = curr(4)；curr = next(5)。节点 4 头插到 dummy 之后。' },
  { lists: [
      { title: 'curr', values: [] },
      { title: 'result', values: [null, 5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }] },
    ], note: '第5轮：next = null；curr.next = dummy.next(4)；dummy.next = curr(5)；curr = next(null)。节点 5 头插完成，curr 为空。' },
  { lists: [
      { title: 'curr', values: [] },
      { title: 'result', values: [null, 5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'mark' }] },
    ], note: '循环结束（curr == null）。返回 dummy.next = [5,4,3,2,1] ✅。' },
]
// 方法三（从前向后递归）可视化：rescursion(prev, curr)，prev 为已反转链表，curr 为剩余链表
const reverseRecurSteps = [
  { lists: [
      { title: 'prev', values: [] },
      { title: 'curr', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '调用 rescursion(null, head)：prev = null，curr = head = 1。' },
  { lists: [
      { title: 'prev', values: [1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'curr', values: [2, 3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '递归层 rescursion(null, [1,2,3,4,5])：curr=1 非空，next = curr.next = 2，curr.next = prev(null)，递归 rescursion(1, 2)。' },
  { lists: [
      { title: 'prev', values: [2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }] },
      { title: 'curr', values: [3, 4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '递归层 rescursion(1, [2,3,4,5])：next = curr.next = 3，curr.next = prev(1)，递归 rescursion(2, 3)。' },
  { lists: [
      { title: 'prev', values: [3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }] },
      { title: 'curr', values: [4, 5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '递归层 rescursion(2, [3,4,5])：next = curr.next = 4，curr.next = prev(2)，递归 rescursion(3, 4)。' },
  { lists: [
      { title: 'prev', values: [4, 3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
      { title: 'curr', values: [5], pointers: [{ id: 0, label: 'curr' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '递归层 rescursion(3, [4,5])：next = curr.next = 5，curr.next = prev(3)，递归 rescursion(4, 5)。' },
  { lists: [
      { title: 'prev', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
      { title: 'curr', values: [] },
    ], note: '递归层 rescursion(4, [5])：next = curr.next = null，curr.next = prev(4)，递归 rescursion(5, null)。' },
  { lists: [
      { title: 'prev', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'prev' }], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
      { title: 'curr', values: [] },
    ], note: '递归出口：rescursion(5, null) 中 curr == null，返回 prev = 5。逐层回溯返回 5，最终返回 [5,4,3,2,1] ✅。' },
]
// 方法四（从后向前递归）可视化：先递归反转 head.next 得到 ans，回溯时把 head 接到 ans 末尾
const reverseBackRecurSteps = [
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [] },
    ], note: 'reverseList([1,2,3,4,5])：head=1，head.next=2 非空，递归 reverseList(head.next)=reverseList([2,3,4,5])。' },
  { lists: [
      { title: 'head', values: [2, 3, 4, 5], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [] },
    ], note: '递归进入 reverseList([2,3,4,5])：head=2，继续递归 reverseList([3,4,5])。' },
  { lists: [
      { title: 'head', values: [3, 4, 5], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [] },
    ], note: '递归进入 reverseList([3,4,5])：head=3，继续递归 reverseList([4,5])。' },
  { lists: [
      { title: 'head', values: [4, 5], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [] },
    ], note: '递归进入 reverseList([4,5])：head=4，继续递归 reverseList([5])。' },
  { lists: [
      { title: 'head', values: [5], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [] },
    ], note: '递归进入 reverseList([5])：head.next == null，返回 head = 5（递归出口），开始回溯。' },
  { lists: [
      { title: 'head', values: [4], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [5, 4], pointers: [{ id: 0, label: 'ans' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
    ], note: '回溯到 reverseList([4,5])：ans = reverseList([5]) = 5；head.next.next = head（5.next = 4）；head.next = null；返回 ans = [5,4]。' },
  { lists: [
      { title: 'head', values: [3], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [5, 4, 3], pointers: [{ id: 0, label: 'ans' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '回溯到 reverseList([3,4,5])：ans = 5；head.next.next = head（4.next = 3）；head.next = null；返回 ans = [5,4,3]。' },
  { lists: [
      { title: 'head', values: [2], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [5, 4, 3, 2], pointers: [{ id: 0, label: 'ans' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '回溯到 reverseList([2,3,4,5])：ans = 5；head.next.next = head（3.next = 2）；head.next = null；返回 ans = [5,4,3,2]。' },
  { lists: [
      { title: 'head', values: [1], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'ans', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'ans' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '回溯到 reverseList([1,2,3,4,5])：ans = 5；head.next.next = head（2.next = 1）；head.next = null；返回 ans = [5,4,3,2,1]。' },
  { lists: [
      { title: 'head', values: [] },
      { title: 'ans', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'ans' }], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '回溯结束，返回 ans = [5,4,3,2,1] ✅。' },
]
// 方法五（使用栈）可视化：先把所有节点依次入栈，再依次弹出重建新链表
const reverseStackSteps = [
  { lists: [
      { title: 'current', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'current' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'stack', values: [] },
    ], note: '初始化：stack = new Stack<>()，current = head = 1。开始遍历链表，依次入栈。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [1, 2, 3, 4, 5], pointers: [{ id: 4, label: 'top' }] },
    ], note: '遍历完成：依次 push 1,2,3,4,5，栈顶 top = 5。newHead = stack.pop() = 5。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [1, 2, 3, 4], pointers: [{ id: 3, label: 'top' }] },
      { title: 'result', values: [5], pointers: [{ id: 0, label: 'newHead' }, { id: 0, label: 'current' }], states: [{ id: 0, state: 'cur' }] },
    ], note: 'newHead = stack.pop() = 5；current = newHead = 5。开始弹出节点重建链表。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [1, 2, 3], pointers: [{ id: 2, label: 'top' }] },
      { title: 'result', values: [5, 4], pointers: [{ id: 0, label: 'newHead' }, { id: 1, label: 'current' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }] },
    ], note: 'pop node = 4；current.next = 4；current = 4。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [1, 2], pointers: [{ id: 1, label: 'top' }] },
      { title: 'result', values: [5, 4, 3], pointers: [{ id: 0, label: 'newHead' }, { id: 2, label: 'current' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }] },
    ], note: 'pop node = 3；current.next = 3；current = 3。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [1], pointers: [{ id: 0, label: 'top' }] },
      { title: 'result', values: [5, 4, 3, 2], pointers: [{ id: 0, label: 'newHead' }, { id: 3, label: 'current' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'cur' }] },
    ], note: 'pop node = 2；current.next = 2；current = 2。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [] },
      { title: 'result', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'newHead' }, { id: 4, label: 'current' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'cur' }] },
    ], note: 'pop node = 1；current.next = 1；current = 1；current.next = null。' },
  { lists: [
      { title: 'current', values: [] },
      { title: 'stack', values: [] },
      { title: 'result', values: [5, 4, 3, 2, 1], pointers: [{ id: 0, label: 'newHead' }], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '栈为空，循环结束。返回 newHead = [5,4,3,2,1] ✅。' },
]
</script>

<!-- problem:start -->

# [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list)

## 题目描述

<!-- description:start -->

给你单链表的头节点 <code>head</code> ，请你反转链表，并返回反转后的链表。

<div class="original__bRMd">
<div>
<p> </p>

<p><strong>示例 1：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0200-0299/0206.Reverse%20Linked%20List/images/rev1ex1.jpg" style="width: 542px; height: 222px;" />
<pre>
<strong>输入：</strong>head = [1,2,3,4,5]
<strong>输出：</strong>[5,4,3,2,1]
</pre>

<p><strong>示例 2：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0200-0299/0206.Reverse%20Linked%20List/images/rev1ex2.jpg" style="width: 182px; height: 222px;" />
<pre>
<strong>输入：</strong>head = [1,2]
<strong>输出：</strong>[2,1]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>head = []
<strong>输出：</strong>[]
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点的数目范围是 <code>[0, 5000]</code></li>
	<li><code>-5000 <= Node.val <= 5000</code></li>
</ul>

<p> </p>

<p><strong>进阶：</strong>链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？</p>
</div>
</div>

<!-- description:end -->

<!-- solution:start -->

## 方法一：双指针

只需要改变链表的next指针的指向，直接将链表反转即可，时间复杂度 O(n)，空间复杂度 O(n)。其中 n 为链表的长度。

图示如下：

![img](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/206.%25E7%25BF%25BB%25E8%25BD%25AC%25E9%2593%25BE%25E8%25A1%25A8.gif)

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]` 为例，演示双指针反转：`prev` 为已反转的链表，`curr` 为剩余待反转链表，每轮把 `curr` 头节点摘下接到 `prev` 之前。蓝色为刚反转的节点，黄色为下一个待处理节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reversePtrSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null) {
            return head;
        }

        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        head = prev;
        return head;
    }
}
```

```ts [TypeScript]
class Solution {
    reverseList(head: ListNode | null): ListNode | null {
        if (head === null) {
            return head;
        }

        let prev: ListNode | null = null;
        let curr: ListNode | null = head;
        while (curr !== null) {
            const next: ListNode | null = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        return prev;
    }
}
```



:::

## 方法二：头插法

创建虚拟头节点 $dummy$，遍历链表，将每个节点依次插入 $dummy$ 的下一个节点。遍历结束，返回 $dummy.next$。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为链表的长度。

图示如下：

![image-20250424115032080](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20250424115032080.png)

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]` 为例，演示头插法反转：`dummy` 为虚拟头节点，每轮把 `curr` 的头节点摘下插入 `dummy` 之后，最终 `dummy.next` 即为反转后的链表。蓝色为刚插入的节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseDummySteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode dummy = new ListNode();
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = dummy.next;
            dummy.next = curr;
            curr = next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* dummy = new ListNode();
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = dummy->next;
            dummy->next = curr;
            curr = next;
        }
        return dummy->next;
    }
};
```

```ts [TypeScript]
function reverseList(head: ListNode | null): ListNode | null {
    if (head == null) {
        return head;
    }
    let pre = null;
    let cur = head;
    while (cur != null) {
        const next = cur.next;
        cur.next = pre;
        [pre, cur] = [cur, next];
    }
    return pre;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三：从前向后递归

时间复杂度 O(n)，空间复杂度 O(n)。其中 n 为链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]` 为例，演示从前向后递归反转：递归函数 `rescursion(prev, curr)` 思路与双指针法一致，每层把 `curr` 头节点接到 `prev` 之前，再递归处理剩余部分。蓝色为刚反转的节点，黄色为下一个待处理节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseRecurSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>

::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        return rescursion(null, head);
    }

    private ListNode rescursion(ListNode prev, ListNode curr) {
        if (curr == null) {
            return prev;
        }
        ListNode next = curr.next;
        curr.next = prev;

        return rescursion(curr, next);
    }
}
```

:::

## 方法四：从后向前递归

递归反转链表的第二个节点到尾部的所有节点，然后 $head$ 插在反转后的链表的尾部。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为链表的长度。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]` 为例，演示从后向前递归反转：先递归反转 `head.next` 得到 `ans`，回溯时再把 `head` 节点接到 `ans` 末尾。蓝色为当前正在接回的节点，绿色为已反转部分。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseBackRecurSteps" />

<div class="viz-jump"><a href="#code-4">跳过可视化，直接看代码 ↓</a></div>

<a id="code-4"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
         // 递归调用，翻转第二个节点开始往后的链表
        ListNode ans = reverseList(head.next);
        // 翻转头节点与第二个节点的指向
        head.next.next = head;
        //此时的 head 节点为尾节点，next 需要指向 NULL
        head.next = null;
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* ans = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        return ans;
    }
};
```

```ts [TypeScript]
const rev = (pre: ListNode | null, cur: ListNode | null): ListNode | null => {
    if (cur == null) {
        return pre;
    }
    const next = cur.next;
    cur.next = pre;
    return rev(cur, next);
};

function reverseList(head: ListNode | null): ListNode | null {
    if (head == null) {
        return head;
    }
    const next = head.next;
    head.next = null;
    return rev(head, next);
}
```

```python [Python]
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if head is None or head.next is None:
            return head
        ans = self.reverseList(head.next)
        head.next.next = head
        head.next = None
        return ans
```

:::

## 方法五：使用栈

时间复杂度 $O(n)$，空间复杂度 $O(n)$。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]` 为例，演示用栈反转：先把所有节点依次入栈，再依次弹出并重建新链表。`top` 指向栈顶，`newHead` 为新链表头，`current` 指向已重建的末尾。蓝色为当前弹出的节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reverseStackSteps" />

<div class="viz-jump"><a href="#code-5">跳过可视化，直接看代码 ↓</a></div>

<a id="code-5"></a>

::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        Stack<ListNode> stack = new Stack<>();
        ListNode current = head;
        while (current != null) {
            stack.push(current);
            current = current.next;
        }
        ListNode newHead = stack.pop();
        current = newHead;
        
        while (!stack.isEmpty()) {
            ListNode node = stack.pop();
            current.next = node;
            current = node;
        }
       
        current.next = null;
        return newHead;
    }
}
```

````ts [TypeScript]
class Solution {
    reverseList(head: ListNode | null): ListNode | null {
        if (head === null || head.next === null) {
            return head;
        }

        const stack: ListNode[] = [];
        
        let current: ListNode | null = head;
        while (current !== null) {
            stack.push(current);
            current = current.next;
        }
        const newHead: ListNode = stack.pop()!;
        current = newHead;
        
        while (stack.length > 0) {
            const node = stack.pop()!;
            current.next = node;
            current = node;
        }
        
        current.next = null;
        return newHead;
    }
}
````

:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
