---
comments: true
difficulty: 中等

tags:
    - 链表
    - 双指针
    - 分治
    - 排序
    - 归并排序
---

<script setup>
// 方法一（自顶向下归并）可视化：head = [4,2,1,3]
// 快慢指针找中点拆分 → 递归排序左右半 → dummy/cur 归并，指针名与代码一致
const sortListSteps = [
  { lists: [
      { title: 'head', values: [4, 2, 1, 3], pointers: [{ id: 0, label: 'slow' }, { id: 1, label: 'fast' }] },
    ], note: 'sortList(head)：head = [4,2,1,3]。快慢指针定位中点：slow = head 指向 4，fast = head.next 指向 2。' },
  { lists: [
      { title: 'head', values: [4, 2, 1, 3], pointers: [{ id: 1, label: 'slow' }, { id: 2, label: 'fast' }] },
    ], note: 'fast 与 fast.next 均非空：slow 前进一步指向 2，fast 前进两步指向 1。' },
  { lists: [
      { title: 'head', values: [4, 2, 1, 3], pointers: [{ id: 2, label: 'slow' }] },
    ], note: '再走一步：slow 指向 1，fast 越界为 null，循环结束。中点 slow = 1，右半起点 t = slow.next = 3。' },
  { lists: [
      { title: '左半（head）', values: [4, 2] },
      { title: '右半（t）', values: [1, 3] },
    ], note: '执行 slow.next = null 切断链表：左半 [4,2] 交给 sortList(head)，右半 [1,3] 交给 sortList(t)。' },
  { lists: [
      { title: 'head（左半）', values: [4, 2], pointers: [{ id: 0, label: 'slow' }, { id: 1, label: 'fast' }] },
    ], note: '递归 sortList(head)：对左半 [4,2] 找中点，slow = 4，fast = 2。' },
  { lists: [
      { title: '左半（l1）', values: [4] },
      { title: '右半（l2）', values: [2] },
    ], note: 'fast.next 为空，循环结束。中点 slow = 4，t = slow.next = 2，slow.next = null → 拆成 [4] 与 [2]。' },
  { lists: [
      { title: 'l1', values: [4], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'l2', values: [2], pointers: [{ id: 0, label: 'l2' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'cur' }] },
    ], note: '合并子链表：l1 = [4]，l2 = [2]。比较头节点 4 与 2，2 < 4，取 l2 头节点 2（黄色为参照，蓝色为取出）。' },
  { lists: [
      { title: 'l1', values: [], },
      { title: 'l2', values: [], },
      { title: 'result', values: [null, 2, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: 'l2 变空，cur.next = l1 剩余节点 4，合并结果 [2,4]。该结果作为 l1 返回给上一层。' },
  { lists: [
      { title: 'head（右半）', values: [1, 3], pointers: [{ id: 0, label: 'slow' }, { id: 1, label: 'fast' }] },
    ], note: '递归 sortList(t)：对右半 [1,3] 找中点，slow = 1，fast = 3。' },
  { lists: [
      { title: '左半（l1）', values: [1] },
      { title: '右半（l2）', values: [3] },
    ], note: 'fast.next 为空，循环结束。中点 slow = 1，t = slow.next = 3，slow.next = null → 拆成 [1] 与 [3]。' },
  { lists: [
      { title: 'l1', values: [1], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'l2', values: [3], pointers: [{ id: 0, label: 'l2' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'cur' }] },
    ], note: '合并子链表：l1 = [1]，l2 = [3]。比较 1 与 3，1 < 3，取 l1 头节点 1（蓝色为取出，黄色为参照）。' },
  { lists: [
      { title: 'l1', values: [], },
      { title: 'l2', values: [], },
      { title: 'result', values: [null, 1, 3], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: 'l1 变空，cur.next = l2 剩余节点 3，合并结果 [1,3]。该结果作为 l2 返回给上一层。' },
  { lists: [
      { title: 'l1', values: [2, 4], pointers: [{ id: 0, label: 'l1' }] },
      { title: 'l2', values: [1, 3], pointers: [{ id: 0, label: 'l2' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'cur' }] },
    ], note: '回到顶层：l1 = [2,4]，l2 = [1,3]。建虚拟头节点 dummy，cur = dummy。' },
  { lists: [
      { title: 'l1', values: [2, 4], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'l2', values: [3], pointers: [{ id: 0, label: 'l2' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'result', values: [null, 1], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'cur' }], states: [{ id: 1, state: 'done' }] },
    ], note: '比较 2 与 1，1 < 2，取 l2 头节点 1。cur.next = 1，l2 后移，cur = 1。' },
  { lists: [
      { title: 'l1', values: [4], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'l2', values: [3], pointers: [{ id: 0, label: 'l2' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 1, 2], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '比较 2 与 3，2 <= 3，取 l1 头节点 2。cur.next = 2，l1 后移，cur = 2。' },
  { lists: [
      { title: 'l1', values: [4], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'l2', values: [], },
      { title: 'result', values: [null, 1, 2, 3], pointers: [{ id: 0, label: 'dummy' }, { id: 3, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '比较 4 与 3，3 < 4，取 l2 头节点 3。cur.next = 3，l2 后移变空，cur = 3。' },
  { lists: [
      { title: 'l1', values: [], },
      { title: 'l2', values: [], },
      { title: 'result', values: [null, 1, 2, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 4, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: 'l2 为空，cur.next = l1（剩余节点 4），拼接完成，得 [1,2,3,4]。' },
  { lists: [
      { title: 'l1', values: [], },
      { title: 'l2', values: [], },
      { title: 'result', values: [null, 1, 2, 3, 4], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
    ], note: '返回 dummy.next = [1,2,3,4] ✅，链表排序完成。' },
]
</script>

<!-- problem:start -->

# [148. 排序链表](https://leetcode.cn/problems/sort-list)

## 题目描述

<!-- description:start -->

<p>给你链表的头结点&nbsp;<code>head</code>&nbsp;，请将其按 <strong>升序</strong> 排列并返回 <strong>排序后的链表</strong> 。</p>

<ul>
</ul>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104010134.png" alt="image-20240823104010134"  />

<pre>
<b>输入：</b>head = [4,2,1,3]
<b>输出：</b>[1,2,3,4]
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104027024.png" alt="image-20240823104027024"  />

<pre>
<b>输入：</b>head = [-1,5,3,4,0]
<b>输出：</b>[-1,0,3,4,5]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<b>输入：</b>head = []
<b>输出：</b>[]
</pre>

<p>&nbsp;</p>

<p><b>提示：</b></p>

<ul>
	<li>链表中节点的数目在范围&nbsp;<code>[0, 5 * 10<sup>4</sup>]</code>&nbsp;内</li>
	<li><code>-10<sup>5</sup>&nbsp;&lt;= Node.val &lt;= 10<sup>5</sup></code></li>
</ul>

<p>&nbsp;</p>

<p><b>进阶：</b>你可以在&nbsp;<code>O(n&nbsp;log&nbsp;n)</code> 时间复杂度和常数级空间复杂度下，对链表进行排序吗？</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一

先用快慢指针 `slow`/`fast` 找到链表的中点 `slow`，令 `t = slow.next` 并断开，得到左右两个子链表；递归对左右子链表排序后，再用 `dummy`/`cur` 归并两个有序子链表，最终返回 `dummy.next`。时间复杂度 $O(n \log n)$，空间复杂度 $O(\log n)$。

### 可视化演示

> 以题目示例 `head = [4,2,1,3]` 为例，演示自顶向下归并排序：先快慢指针 `slow`/`fast` 定位中点拆分链表，递归排好左右两半后，用 `dummy`/`cur` 归并。蓝色为当前取出的节点，黄色为被比较的节点，绿色为已拼接节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="sortListSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode t = slow.next;
        slow.next = null;
        ListNode l1 = sortList(head);
        ListNode l2 = sortList(t);
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                cur.next = l1;
                l1 = l1.next;
            } else {
                cur.next = l2;
                l2 = l2.next;
            }
            cur = cur.next;
        }
        cur.next = l1 == null ? l2 : l1;
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* sortList(ListNode* head) {
        if (!head || !head->next) return head;
        auto* slow = head;
        auto* fast = head->next;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        auto* t = slow->next;
        slow->next = nullptr;
        auto* l1 = sortList(head);
        auto* l2 = sortList(t);
        auto* dummy = new ListNode();
        auto* cur = dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) {
                cur->next = l1;
                l1 = l1->next;
            } else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = l1 ? l1 : l2;
        return dummy->next;
    }
};
```

```ts [TypeScript]
function sortList(head: ListNode | null): ListNode | null {
    if (head == null || head.next == null) return head;
    // 快慢指针定位中点
    let slow: ListNode = head,
        fast: ListNode = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 归并排序
    let mid: ListNode = slow.next;
    slow.next = null;
    let l1: ListNode = sortList(head);
    let l2: ListNode = sortList(mid);
    let dummy: ListNode = new ListNode();
    let cur: ListNode = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            cur.next = l1;
            l1 = l1.next;
        } else {
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    cur.next = l1 == null ? l2 : l1;
    return dummy.next;
}
```

```python [Python]
class Solution:
    def sortList(self, head: ListNode) -> ListNode:
        if head is None or head.next is None:
            return head
        slow, fast = head, head.next
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        t = slow.next
        slow.next = None
        l1, l2 = self.sortList(head), self.sortList(t)
        dummy = ListNode()
        cur = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                cur.next = l1
                l1 = l1.next
            else:
                cur.next = l2
                l2 = l2.next
            cur = cur.next
        cur.next = l1 or l2
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->