---
comments: true
difficulty: 简单

tags:
    - 哈希表
    - 链表
    - 双指针
entry: getIntersectionNode
mode: link-intersection
testcases:
  - input: [[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 8]
    output: 8
  - input: [[1, 9, 1, 2, 4], [3, 2, 4], 2]
    output: 2
  - input: [[2, 6, 4], [1, 5], 0]
    output: null
---

<script setup>
// 方法一（双指针）可视化：headA = [4,1,8,4,5]，headB = [5,6,1,8,4,5]，在值为 8 的节点相交
// 每步展示 a/b 指针分别遍历 headA/headB，走到末尾后跳转到另一条链表头，最终在公共节点相遇
const getIntersectionNodeSteps = [
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 0, label: 'a' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 0, label: 'b' }], states: [{ id: 0, state: 'hl' }] },
    ], note: '初始化 a = headA，b = headB。两链表在值为 8 的节点相交（headA 下标 2，headB 下标 3）。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 1, label: 'a' }], states: [{ id: 1, state: 'cur' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 1, label: 'b' }], states: [{ id: 1, state: 'hl' }] },
    ], note: 'a ≠ b，继续。a → headA[1] = 1，b → headB[1] = 6。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 2, label: 'a' }], states: [{ id: 2, state: 'cur' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 2, label: 'b' }], states: [{ id: 2, state: 'hl' }] },
    ], note: 'a → headA[2] = 8，b → headB[2] = 1。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 3, label: 'a' }], states: [{ id: 3, state: 'cur' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 3, label: 'b' }], states: [{ id: 3, state: 'hl' }] },
    ], note: 'a → headA[3] = 4，b → headB[3] = 8（b 已到公共节点，但 a 尚未到达）。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 4, label: 'a' }], states: [{ id: 4, state: 'cur' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 4, label: 'b' }], states: [{ id: 4, state: 'hl' }] },
    ], note: 'a → headA[4] = 5，b → headB[4] = 4。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 5, label: 'b' }], states: [{ id: 5, state: 'hl' }] },
    ], note: 'a 遍历完 headA 变为 null，b → headB[5] = 5。下一次循环 a 将跳转到 headB。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 0, label: 'a' }], states: [{ id: 0, state: 'cur' }] },
    ], note: 'a 为 null 时跳转到 headB，指向 headB[0] = 5；b 遍历完 headB 变为 null。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 0, label: 'b' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 1, label: 'a' }], states: [{ id: 1, state: 'cur' }] },
    ], note: 'b 为 null 时跳转到 headA，指向 headA[0] = 4；a → headB[1] = 6。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 1, label: 'b' }], states: [{ id: 1, state: 'hl' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 2, label: 'a' }], states: [{ id: 2, state: 'cur' }] },
    ], note: 'a → headB[2] = 1，b → headA[1] = 1。两指针值相同但指向不同节点，继续。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], pointers: [{ id: 2, label: 'b' }], states: [{ id: 2, state: 'hl' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], pointers: [{ id: 3, label: 'a' }], states: [{ id: 3, state: 'cur' }] },
    ], note: 'a → headB[3] = 8，b → headA[2] = 8。a == b，两指针相遇于公共节点，循环结束。' },
  { lists: [
      { title: 'headA', values: [4, 1, 8, 4, 5], states: [{ id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }] },
      { title: 'headB', values: [5, 6, 1, 8, 4, 5], states: [{ id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'mark' }] },
    ], note: '返回相交节点 8 ✅。两链表在值为 8 的节点（headA 下标 2，headB 下标 3）开始相交，公共部分为 [8, 4, 5]。' },
]
</script>

<!-- problem:start -->

# [160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists)

## 题目描述

<!-- description:start -->

<p>给你两个单链表的头节点&nbsp;<code>headA</code> 和 <code>headB</code> ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 <code>null</code> 。</p>

<p>图示两个链表在节点 <code>c1</code> 开始相交<strong>：</strong></p>

![image-20240823102823099](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102823099.png)

<p>题目数据 <strong>保证</strong> 整个链式结构中不存在环。</p>

<p><strong>注意</strong>，函数返回结果后，链表必须 <strong>保持其原始结构</strong> 。</p>

<p><strong>自定义评测：</strong></p>

<p><strong>评测系统</strong> 的输入如下（你设计的程序 <strong>不适用</strong> 此输入）：</p>

<ul>
	<li><code>intersectVal</code> - 相交的起始节点的值。如果不存在相交节点，这一值为 <code>0</code></li>
	<li><code>listA</code> - 第一个链表</li>
	<li><code>listB</code> - 第二个链表</li>
	<li><code>skipA</code> - 在 <code>listA</code> 中（从头节点开始）跳到交叉节点的节点数</li>
	<li><code>skipB</code> - 在 <code>listB</code> 中（从头节点开始）跳到交叉节点的节点数</li>
</ul>

<p>评测系统将根据这些输入创建链式数据结构，并将两个头节点 <code>headA</code> 和 <code>headB</code> 传递给你的程序。如果程序能够正确返回相交节点，那么你的解决方案将被 <strong>视作正确答案</strong> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

![image-20240823102845071](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102845071.png)

<pre>
<strong>输入：</strong>intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
<strong>输出：</strong>Intersected at '8'
<strong>解释：</strong>相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
— 请注意相交节点的值不为 1，因为在链表 A 和链表 B 之中值为 1 的节点 (A 中第二个节点和 B 中第三个节点) 是不同的节点。换句话说，它们在内存中指向两个不同的位置，而链表 A 和链表 B 中值为 8 的节点 (A 中<font size="1">第三个</font>节点，B 中第四个节点) 在内存中指向相同的位置。
</pre>

<p>&nbsp;</p>

<p><strong>示例&nbsp;2：</strong></p>

![image-20240823102906415](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102906415.png)

<pre>
<strong>输入：</strong>intersectVal&nbsp;= 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
<strong>输出：</strong>Intersected at '2'
<strong>解释：</strong>相交节点的值为 2 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [1,9,1,2,4]，链表 B 为 [3,2,4]。
在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
</pre>

<p><strong>示例&nbsp;3：</strong></p>

![image-20240823102926504](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102926504.png)

<pre>
<strong>输入：</strong>intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
<strong>输出：</strong>null
<strong>解释：</strong>从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。
由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
这两个链表不相交，因此返回 null 。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>listA</code> 中节点数目为 <code>m</code></li>
	<li><code>listB</code> 中节点数目为 <code>n</code></li>
	<li><code>1 &lt;= m, n &lt;= 3 * 10<sup>4</sup></code></li>
	<li><code>1 &lt;= Node.val &lt;= 10<sup>5</sup></code></li>
	<li><code>0 &lt;= skipA &lt;= m</code></li>
	<li><code>0 &lt;= skipB &lt;= n</code></li>
	<li>如果 <code>listA</code> 和 <code>listB</code> 没有交点，<code>intersectVal</code> 为 <code>0</code></li>
	<li>如果 <code>listA</code> 和 <code>listB</code> 有交点，<code>intersectVal == listA[skipA] == listB[skipB]</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你能否设计一个时间复杂度 <code>O(m + n)</code> 、仅用 <code>O(1)</code> 内存的解决方案？</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一：双指针

我们使用两个指针 $a$, $b$ 分别指向两个链表 $headA$, $headB$。

同时遍历链表，当 $a$ 到达链表 $headA$ 的末尾时，重新定位到链表 $headB$ 的头节点；当 $b$ 到达链表 $headB$ 的末尾时，重新定位到链表 $headA$ 的头节点。

若两指针相遇，所指向的结点就是第一个公共节点。若没相遇，说明两链表无公共节点，此时两个指针都指向 `null`，返回其中一个即可。

时间复杂度 $O(m+n)$，其中 $m$ 和 $n$ 分别是链表 $headA$ 和 $headB$ 的长度。空间复杂度 $O(1)$。

### 可视化演示

> 以示例 1 的 `headA = [4, 1, 8, 4, 5]`、`headB = [5, 6, 1, 8, 4, 5]` 为例，演示双指针相交判定：指针 `a`、`b` 各自遍历两条链表，走到末尾后跳到另一条链表头，最终在公共节点相遇。蓝色为指针 `a` 指向，黄色为指针 `b` 指向，红色为相交节点。点击 ▶ 播放，或逐步操作。

<ListViz :steps="getIntersectionNodeSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA, b = headB;
        while (a != b) {
            a = a == null ? headB : a.next;
            b = b == null ? headA : b.next;
        }
        return a;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
        ListNode *a = headA, *b = headB;
        while (a != b) {
            a = a ? a->next : headB;
            b = b ? b->next : headA;
        }
        return a;
    }
};
```

```ts [TypeScript]
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    let a = headA;
    let b = headB;
    while (a != b) {
        a = a ? a.next : headB;
        b = b ? b.next : headA;
    }
    return a;
}
```

```python [Python]
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        a, b = headA, headB
        while a != b:
            a = a.next if a else headB
            b = b.next if b else headA
        return a
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->