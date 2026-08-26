---
comments: true
difficulty: 中等
tags:
  - 链表
  - 双指针
entry: removeNthFromEnd
testcases:
  - input:
      - - 1
        - 2
        - 3
        - 4
        - 5
      - 2
    output:
      - 1
      - 2
      - 3
      - 5
  - input:
      - - 1
      - 1
    output: []
  - input:
      - - 1
        - 2
      - 1
    output:
      - 1
mode: link
---


<script setup>
// 方法一（快慢指针）可视化：head = [1,2,3,4,5]，n = 2
// 每步展示 dummy 虚拟头节点 + fast/slow 指针移动，最终删除倒数第 2 个节点
const removeNthFromEndSteps = [
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'fast' }, { id: 0, label: 'slow' }] },
    ], note: '建立虚拟头节点 dummy 指向 head，初始化 fast = slow = dummy。目标：删除倒数第 n = 2 个节点（值为 4）。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'fast' }, { id: 0, label: 'slow' }], states: [{ id: 1, state: 'cur' }] },
    ], note: 'fast 先向前走第 1 步，指向节点 1。剩余步数 n = 1。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'fast' }, { id: 0, label: 'slow' }], states: [{ id: 2, state: 'cur' }] },
    ], note: 'fast 走第 2 步，指向节点 2。此时 n = 0，fast 领先 slow 正好 n = 2 步。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 3, label: 'fast' }, { id: 1, label: 'slow' }], states: [{ id: 3, state: 'cur' }, { id: 1, state: 'hl' }] },
    ], note: 'fast 和 slow 同时前进：slow 指向节点 1，fast 指向节点 3。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 4, label: 'fast' }, { id: 2, label: 'slow' }], states: [{ id: 4, state: 'cur' }, { id: 2, state: 'hl' }] },
    ], note: '继续前进：slow 指向节点 2，fast 指向节点 4。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 5, label: 'fast' }, { id: 3, label: 'slow' }], states: [{ id: 5, state: 'cur' }, { id: 3, state: 'hl' }] },
    ], note: '继续前进：slow 指向节点 3，fast 指向节点 5（链尾）。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 5, label: 'fast' }, { id: 3, label: 'slow' }], states: [{ id: 3, state: 'cur' }, { id: 4, state: 'mark' }] },
    ], note: 'fast.next 为 null，循环结束。此时 slow 指向倒数第 2 个节点（节点 4）的前驱节点 3。' },
  { lists: [
      { title: 'head', values: [null, 1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 3, label: 'slow' }], states: [{ id: 3, state: 'cur' }, { id: 4, state: 'mark' }] },
    ], note: '执行 slow.next = slow.next.next，跳过节点 4，将其从链表中删除。' },
  { lists: [
      { title: 'result', values: [null, 1, 2, 3, 5], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '返回 dummy.next = [1, 2, 3, 5] ✅，删除倒数第 2 个节点完成。' },
]
</script>

<!-- problem:start -->

# [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list)

## 题目描述

<!-- description:start -->

<p>给你一个链表，删除链表的倒数第&nbsp;<code>n</code><em>&nbsp;</em>个结点，并且返回链表的头结点。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104158246.png" alt="image-20240823104158246"  />

<pre>
<strong>输入：</strong>head = [1,2,3,4,5], n = 2
<strong>输出：</strong>[1,2,3,5]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>head = [1], n = 1
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>head = [1,2], n = 1
<strong>输出：</strong>[1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中结点的数目为 <code>sz</code></li>
	<li><code>1 &lt;= sz &lt;= 30</code></li>
	<li><code>0 &lt;= Node.val &lt;= 100</code></li>
	<li><code>1 &lt;= n &lt;= sz</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你能尝试使用一趟扫描实现吗？</p>

<!-- description:end -->


<!-- solution:start -->

## 方法一：快慢指针

我们定义两个指针 `fast` 和 `slow`，初始时都指向链表的虚拟头结点 `dummy`。

接着 `fast` 指针先向前移动 $n$ 步，然后 `fast` 和 `slow` 指针同时向前移动，直到 `fast` 指针到达链表的末尾。此时 `slow.next` 指针指向的结点就是倒数第 `n` 个结点的前驱结点，将其删除即可。

时间复杂度 $O(n)$，其中 $n$ 为链表的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]`、`n = 2` 为例，演示快慢指针删除倒数第 n 个节点：`fast` 先走 n 步，再与 `slow` 同步前进，最后删除 `slow.next` 指向的节点。蓝色为 `fast` 当前指向，黄色为 `slow` 当前指向，红色为待删除节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="removeNthFromEndSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        while (n-- > 0) {
            fast = fast.next;
        }
        while (fast.next != null) {
            slow = slow.next;
            fast = fast.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* fast = dummy;
        ListNode* slow = dummy;
        while (n--) {
            fast = fast->next;
        }
        while (fast->next) {
            slow = slow->next;
            fast = fast->next;
        }
        slow->next = slow->next->next;
        return dummy->next;
    }
};
```

```ts [TypeScript]
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    const dummy = new ListNode(0, head);
    let fast = dummy;
    let slow = dummy;
    while (n--) {
        fast = fast.next;
    }
    while (fast.next) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}
```

```python [Python]
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(next=head)
        fast = slow = dummy
        for _ in range(n):
            fast = fast.next
        while fast.next:
            slow, fast = slow.next, fast.next
        slow.next = slow.next.next
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->