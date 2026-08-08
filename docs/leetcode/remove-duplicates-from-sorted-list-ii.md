---
comments: true
difficulty: 中等

tags:
    - 链表
    - 双指针
---

<script setup>
// 方法一（一次遍历）可视化：dummy 虚拟头节点 + pre/cur 指针，head = [1,2,3,3,4,4,5]
const deleteDup2Steps = [
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 1, label: 'cur' }] },
    ], note: '建虚拟头节点 dummy，dummy.next = head。pre = dummy，cur = head，开始遍历。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 0, label: 'pre' }, { id: 1, label: 'cur' }], states: [{ id: 1, state: 'cur' }, { id: 2, state: 'hl' }] },
    ], note: '内层循环：cur.val=1，cur.next.val=2，两者不等，跳过内层 while，cur 不后移。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 1, label: 'pre' }, { id: 1, label: 'cur' }], states: [{ id: 1, state: 'cur' }] },
    ], note: 'pre.next == cur，说明 pre 与 cur 之间没有重复节点，pre 移动到 cur（节点 1）。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 1, label: 'pre' }, { id: 2, label: 'cur' }], states: [{ id: 2, state: 'cur' }, { id: 3, state: 'hl' }] },
    ], note: 'cur = cur.next，cur 指向节点 2。比较 cur.val=2 与 cur.next.val=3，不等，跳过内层 while。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 2, label: 'cur' }], states: [{ id: 2, state: 'cur' }] },
    ], note: 'pre.next == cur，无重复节点，pre 移动到 cur（节点 2）。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 3, state: 'cur' }, { id: 4, state: 'hl' }] },
    ], note: 'cur = cur.next，cur 指向节点 3。比较 cur.val=3 与 cur.next.val=3，相等，cur 后移。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 3, 3, 4, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 4, label: 'cur' }], states: [{ id: 4, state: 'cur' }, { id: 5, state: 'hl' }] },
    ], note: 'cur 后移，再比较 cur.val=3 与 cur.next.val=4，不等，内层循环结束，cur 停在最后一个 3。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 4, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 3, state: 'cur' }] },
    ], note: 'pre.next != cur，说明中间有重复节点。pre.next = cur.next，删除所有值为 3 的节点；cur = cur.next。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 4, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 3, state: 'cur' }, { id: 4, state: 'hl' }] },
    ], note: '比较 cur.val=4 与 cur.next.val=4，相等，cur 后移。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 4, 4, 5], pointers: [{ id: 2, label: 'pre' }, { id: 4, label: 'cur' }], states: [{ id: 4, state: 'cur' }, { id: 5, state: 'hl' }] },
    ], note: '比较 cur.val=4 与 cur.next.val=5，不等，内层循环结束，cur 停在最后一个 4。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 5], pointers: [{ id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 3, state: 'cur' }] },
    ], note: 'pre.next != cur，有重复节点。pre.next = cur.next，删除所有值为 4 的节点；cur = cur.next。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 5], pointers: [{ id: 2, label: 'pre' }, { id: 3, label: 'cur' }], states: [{ id: 3, state: 'cur' }] },
    ], note: 'cur.next 为 null，跳过内层循环。pre.next == cur，无重复节点，pre 移动到 cur（节点 5）。' },
  { lists: [
      { title: 'list', values: [null, 1, 2, 5], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }] },
    ], note: 'cur 为空，遍历结束。返回 dummy.next = [1,2,5] ✅，所有重复节点已删除。' },
]
</script>

<!-- problem:start -->

# [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii)

## 题目描述

<!-- description:start -->

<p>给定一个已排序的链表的头&nbsp;<code>head</code> ，&nbsp;<em>删除原始链表中所有重复数字的节点，只留下不同的数字</em>&nbsp;。返回 <em>已排序的链表</em>&nbsp;。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103839417.png" alt="image-20240823103839417"  />

<pre>
<strong>输入：</strong>head = [1,2,3,3,4,4,5]
<strong>输出：</strong>[1,2,5]
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103857591.png" alt="image-20240823103857591"  />
<pre>
<strong>输入：</strong>head = [1,1,1,2,3]
<strong>输出：</strong>[2,3]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点数目在范围 <code>[0, 300]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
	<li>题目数据保证链表已经按升序 <strong>排列</strong></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：一次遍历

我们先创建一个虚拟头节点 $dummy$，令 $dummy.next = head$，然后创建指针 $pre$ 指向 $dummy$，指针 $cur$ 指向 $head$，开始遍历链表。

当 $cur$ 指向的节点值与 $cur.next$ 指向的节点值相同时，我们就让 $cur$ 不断向后移动，直到 $cur$ 指向的节点值与 $cur.next$ 指向的节点值不相同时，停止移动。此时，我们判断 $pre.next$ 是否等于 $cur$，如果相等，说明 $pre$ 与 $cur$ 之间没有重复节点，我们就让 $pre$ 移动到 $cur$ 的位置；否则，说明 $pre$ 与 $cur$ 之间有重复节点，我们就让 $pre.next$ 指向 $cur.next$。然后让 $cur$ 继续向后移动。继续上述操作，直到 $cur$ 为空，遍历结束。

最后，返回 $dummy.next$ 即可。

时间复杂度 $O(n)$，其中 $n$ 为链表的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `head = [1,2,3,3,4,4,5]` 为例，演示一次遍历去重：`pre` 指向已确认不重复的尾部，`cur` 扫描重复段，重复段通过 `pre.next = cur.next` 整体跳过。`∅` 为虚拟头节点 dummy。蓝色为当前节点，黄色为被比较的节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="deleteDup2Steps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode pre = dummy;
        ListNode cur = head;
        while (cur != null) {
            while (cur.next != null && cur.next.val == cur.val) {
                cur = cur.next;
            }
            if (pre.next == cur) {
                pre = cur;
            } else {
                pre.next = cur.next;
            }
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* pre = dummy;
        ListNode* cur = head;
        while (cur) {
            while (cur->next && cur->next->val == cur->val) {
                cur = cur->next;
            }
            if (pre->next == cur) {
                pre = cur;
            } else {
                pre->next = cur->next;
            }
            cur = cur->next;
        }
        return dummy->next;
    }
};
```

```ts [TypeScript]
function deleteDuplicates(head: ListNode | null): ListNode | null {
    const dummy = new ListNode(0, head);
    let pre = dummy;
    let cur = head;
    while (cur) {
        while (cur.next && cur.val === cur.next.val) {
            cur = cur.next;
        }
        if (pre.next === cur) {
            pre = cur;
        } else {
            pre.next = cur.next;
        }
        cur = cur.next;
    }
    return dummy.next;
}
```

```python [Python]
class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = pre = ListNode(next=head)
        cur = head
        while cur:
            while cur.next and cur.next.val == cur.val:
                cur = cur.next
            if pre.next == cur:
                pre = cur
            else:
                pre.next = cur.next
            cur = cur.next
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->