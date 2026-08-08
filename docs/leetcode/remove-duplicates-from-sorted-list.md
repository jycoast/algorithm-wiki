---
comments: true
difficulty: 简单

tags:
    - 链表
---

<script setup>
// 方法一（一次遍历）可视化：head = [1,1,2,3,3]
const deleteDupSteps = [
  { lists: [
      { title: 'head', values: [1, 1, 2, 3, 3], pointers: [{ id: 0, label: 'cur' }], states: [{ id: 0, state: 'cur' }] },
    ], note: '初始化 cur = head，cur 指向头节点 1。' },
  { lists: [
      { title: 'head', values: [1, 1, 2, 3, 3], pointers: [{ id: 0, label: 'cur' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'hl' }] },
    ], note: '比较 cur.val=1 与 cur.next.val=1，两者相等，说明 cur 后面有重复节点。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 3], pointers: [{ id: 0, label: 'cur' }], states: [{ id: 0, state: 'cur' }] },
    ], note: 'cur.next = cur.next.next，跳过重复的 1，链表变为 [1,2,3,3]，cur 仍指向节点 1。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 3], pointers: [{ id: 0, label: 'cur' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'hl' }] },
    ], note: '比较 cur.val=1 与 cur.next.val=2，不相等，说明节点 1 无重复，cur 后移。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 3], pointers: [{ id: 1, label: 'cur' }], states: [{ id: 1, state: 'cur' }] },
    ], note: 'cur = cur.next，cur 指向节点 2。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 3], pointers: [{ id: 1, label: 'cur' }], states: [{ id: 1, state: 'cur' }, { id: 2, state: 'hl' }] },
    ], note: '比较 cur.val=2 与 cur.next.val=3，不相等，cur 后移。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 3], pointers: [{ id: 2, label: 'cur' }], states: [{ id: 2, state: 'cur' }] },
    ], note: 'cur = cur.next，cur 指向第一个节点 3。' },
  { lists: [
      { title: 'head', values: [1, 2, 3, 3], pointers: [{ id: 2, label: 'cur' }], states: [{ id: 2, state: 'cur' }, { id: 3, state: 'hl' }] },
    ], note: '比较 cur.val=3 与 cur.next.val=3，两者相等，说明有重复节点 3。' },
  { lists: [
      { title: 'head', values: [1, 2, 3], pointers: [{ id: 2, label: 'cur' }], states: [{ id: 2, state: 'cur' }] },
    ], note: 'cur.next = cur.next.next，跳过重复的 3，链表变为 [1,2,3]。' },
  { lists: [
      { title: 'head', values: [1, 2, 3], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }] },
    ], note: 'cur.next 为 null，遍历结束。返回 head = [1,2,3]，去重完成 ✅。' },
]
</script>

<!-- problem:start -->

# [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list)

## 题目描述

<!-- description:start -->

<p>给定一个已排序的链表的头<meta charset="UTF-8" />&nbsp;<code>head</code>&nbsp;，&nbsp;<em>删除所有重复的元素，使每个元素只出现一次</em>&nbsp;。返回 <em>已排序的链表</em>&nbsp;。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103110082.png" alt="image-20240823103110082"  />
<pre>
<strong>输入：</strong>head = [1,1,2]
<strong>输出：</strong>[1,2]
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823103122645.png" alt="image-20240823103122645"  />

<pre>
<strong>输入：</strong>head = [1,1,2,3,3]
<strong>输出：</strong>[1,2,3]
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

我们用一个指针 $cur$ 来遍历链表。如果当前 $cur$ 与 $cur.next$ 对应的元素相同，我们就将 $cur$ 的 $next$ 指针指向 $cur$ 的下下个节点。否则，说明链表中 $cur$ 对应的元素是不重复的，因此可以将 $cur$ 指针移动到下一个节点。

遍历结束后，返回链表的头节点即可。

时间复杂度 $O(n)$，其中 $n$ 是链表的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以 `head = [1,1,2,3,3]` 为例，演示一次遍历去重：`cur` 指针逐个比较当前节点与下一节点，值相同则跳过重复节点。蓝色为当前节点，黄色为被比较的下一节点，红色为最终去重结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="deleteDupSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            if (cur.val == cur.next.val) {
                cur.next = cur.next.next;
            } else {
                cur = cur.next;
            }
        }
        return head;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode* cur = head;
        while (cur != nullptr && cur->next != nullptr) {
            if (cur->val == cur->next->val) {
                cur->next = cur->next->next;
            } else {
                cur = cur->next;
            }
        }
        return head;
    }
};
```

```python [Python]
class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        cur = head
        while cur and cur.next:
            if cur.val == cur.next.val:
                cur.next = cur.next.next
            else:
                cur = cur.next
        return head
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->