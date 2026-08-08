---
comments: true
difficulty: 中等

tags:
    - 栈
    - 递归
    - 链表
    - 双指针
---

<script setup>
// 方法一（快慢指针 + 反转 + 合并）可视化：head = [1,2,3,4,5] → [1,5,2,4,3]
// 阶段一：fast/slow 快慢指针找中点；阶段二：cur/pre/t 反转右半部分；阶段三：cur/pre 合并左右两半
const reorderSteps = [
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 0, label: 'fast' }, { id: 0, label: 'slow' }] },
    ], note: '初始化：fast = slow = head，都指向节点 1。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 2, label: 'fast' }, { id: 1, label: 'slow' }] },
    ], note: 'fast.next 与 fast.next.next 均非空：slow 前进一步到节点 2，fast 前进两步到节点 3。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 4, 5], pointers: [{ id: 4, label: 'fast' }, { id: 2, label: 'slow' }] },
    ], note: '再次循环：slow 前进到节点 3，fast 前进到节点 5。' },
  { lists: [
      { title: 'head', values: [1, 2, 3], pointers: [{ id: 2, label: 'slow' }], states: [{ id: 2, state: 'mark' }] },
      { title: 'cur', values: [4, 5], pointers: [{ id: 0, label: 'cur' }] },
    ], note: 'fast.next 为 null 退出循环，slow 指向中点节点 3。cur = slow.next 指向节点 4，slow.next = null 将链表分成左右两半。' },
  { lists: [
      { title: 'cur', values: [4, 5], pointers: [{ id: 0, label: 'cur' }, { id: 1, label: 't' }] },
      { title: 'pre', values: [] },
    ], note: '反转右半部分：pre = null。cur 指向节点 4，t = cur.next = 节点 5。' },
  { lists: [
      { title: 'pre', values: [4], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }] },
      { title: 'cur', values: [5], pointers: [{ id: 0, label: 'cur' }] },
    ], note: 'cur.next = pre（节点 4 → null），pre = cur（pre 指向节点 4），cur = t（cur 指向节点 5）。' },
  { lists: [
      { title: 'pre', values: [5, 4], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
      { title: 'cur', values: [] },
    ], note: 't = cur.next = null；cur.next = pre（节点 5 → 节点 4），pre = cur（pre = [5,4]），cur = null。右半部分反转完成。' },
  { lists: [
      { title: 'head', values: [1, 2, 3], pointers: [{ id: 0, label: 'cur' }] },
      { title: 'pre', values: [5, 4], pointers: [{ id: 0, label: 'pre' }] },
    ], note: 'cur = head 重新指向左半部分头节点 1，pre 指向反转后右半部分头节点 5，开始合并左右两半。' },
  { lists: [
      { title: 'head', values: [1, 5, 2, 3], pointers: [{ id: 2, label: 'cur' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
      { title: 'pre', values: [4], pointers: [{ id: 0, label: 'pre' }] },
    ], note: '第一轮：t = pre.next = 节点 4；pre.next = cur.next（节点 5 → 节点 2）；cur.next = pre（节点 1 → 节点 5）；cur = pre.next（节点 2），pre = t（节点 4）。' },
  { lists: [
      { title: 'head', values: [1, 5, 2, 4, 3], pointers: [{ id: 4, label: 'cur' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
      { title: 'pre', values: [] },
    ], note: '第二轮：t = pre.next = null；pre.next = cur.next（节点 4 → 节点 3）；cur.next = pre（节点 2 → 节点 4）；cur = pre.next（节点 3），pre = null。循环结束。' },
  { lists: [
      { title: 'head', values: [1, 5, 2, 4, 3], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '链表重排完成：1 → 5 → 2 → 4 → 3 ✅。' },
]
</script>

<!-- problem:start -->

# [143. 重排链表](https://leetcode.cn/problems/reorder-list)

## 题目描述

<!-- description:start -->

<p>给定一个单链表 <code>L</code><em> </em>的头节点 <code>head</code> ，单链表 <code>L</code> 表示为：</p>

<pre>
L<sub>0</sub> → L<sub>1</sub> → … → L<sub>n - 1</sub> → L<sub>n</sub>
</pre>

<p>请将其重新排列后变为：</p>

<pre>
L<sub>0</sub> → L<sub>n</sub> → L<sub>1</sub> → L<sub>n - 1</sub> → L<sub>2</sub> → L<sub>n - 2</sub> → …</pre>

<p>不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102438951.png" alt="image-20240823102438951" style="zoom:125%;" />

<pre>
<strong>输入：</strong>head = [1,2,3,4]
<strong>输出：</strong>[1,4,2,3]</pre>

<p><strong>示例 2：</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102417597.png" alt="image-20240823102417597" style="zoom:125%;" />

<pre>
<strong>输入：</strong>head = [1,2,3,4,5]
<strong>输出：</strong>[1,5,2,4,3]</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表的长度范围为 <code>[1, 5 * 10<sup>4</sup>]</code></li>
	<li><code>1 &lt;= node.val &lt;= 1000</code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：快慢指针 + 反转链表 + 合并链表

我们先用快慢指针找到链表的中点，然后将链表的后半部分反转，最后将左右两个链表合并。

时间复杂度 $O(n)$，其中 $n$ 是链表的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `head = [1, 2, 3, 4, 5]` 为例，演示「快慢指针找中点 → 反转右半部分 → 合并左右两半」三步。蓝色为当前操作节点，黄色为参照节点，绿色为已处理节点，红色为目标/结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="reorderSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public void reorderList(ListNode head) {
        // 快慢指针找到链表中点
        ListNode fast = head, slow = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // cur 指向右半部分链表
        ListNode cur = slow.next;
        slow.next = null;

        // 反转右半部分链表
        ListNode pre = null;
        while (cur != null) {
            ListNode t = cur.next;
            cur.next = pre;
            pre = cur;
            cur = t;
        }
        cur = head;

        // 此时 cur, pre 分别指向链表左右两半的第一个节点
        // 合并
        while (pre != null) {
            ListNode t = pre.next;
            pre.next = cur.next;
            cur.next = pre;
            cur = pre.next;
            pre = t;
        }
    }
}
```

```cpp [C++]
class Solution {
public:
    void reorderList(ListNode* head) {
        // 快慢指针找到链表中点
        ListNode* fast = head;
        ListNode* slow = head;
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // cur 指向右半部分链表
        ListNode* cur = slow->next;
        slow->next = nullptr;

        // 反转右半部分链表
        ListNode* pre = nullptr;
        while (cur) {
            ListNode* t = cur->next;
            cur->next = pre;
            pre = cur;
            cur = t;
        }
        cur = head;

        // 此时 cur, pre 分别指向链表左右两半的第一个节点
        // 合并
        while (pre) {
            ListNode* t = pre->next;
            pre->next = cur->next;
            cur->next = pre;
            cur = pre->next;
            pre = t;
        }
    }
};
```

```ts [TypeScript]
/**
 Do not return anything, modify head in-place instead.
 */
function reorderList(head: ListNode | null): void {
    let slow = head;
    let fast = head;
    // 找到中心节点
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 反转节点
    let next = slow.next;
    slow.next = null;
    while (next) {
        [next.next, slow, next] = [slow, next, next.next];
    }
    // 合并
    let left = head;
    let right = slow;
    while (right.next) {
        const next = left.next;
        left.next = right;
        right = right.next;
        left.next.next = next;
        left = left.next.next;
    }
}
```

```python [Python]
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        # 快慢指针找到链表中点
        fast = slow = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next

        # cur 指向右半部分链表
        cur = slow.next
        slow.next = None

        # 反转右半部分链表
        pre = None
        while cur:
            t = cur.next
            cur.next = pre
            pre, cur = cur, t
        cur = head

        # 此时 cur, pre 分别指向链表左右两半的第一个节点
        # 合并
        while pre:
            t = pre.next
            pre.next = cur.next
            cur.next = pre
            cur, pre = pre.next, t
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->