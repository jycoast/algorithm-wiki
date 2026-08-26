---
comments: true
difficulty: 中等
tags:
  - 递归
  - 链表
  - 数学
entry: addTwoNumbers
testcases:
  - input:
      - - 2
        - 4
        - 3
      - - 5
        - 6
        - 4
    output:
      - 7
      - 0
      - 8
  - input:
      - - 0
      - - 0
    output:
      - 0
  - input:
      - - 9
        - 9
        - 9
        - 9
        - 9
        - 9
        - 9
      - - 9
        - 9
        - 9
        - 9
    output:
      - 8
      - 9
      - 9
      - 9
      - 0
      - 0
      - 0
      - 1
mode: link
---


<script setup>
// 方法一（模拟）可视化：l1 = [2,4,3]，l2 = [5,6,4]，表示 342 + 465 = 807
// 每步展示当前位 s 的计算与进位 carry，dummy 为虚拟头节点，cur 指向结果链表末尾
const addTwoNumbersSteps = [
  { lists: [
      { title: 'l1', values: [2, 4, 3], pointers: [{ id: 0, label: 'l1' }] },
      { title: 'l2', values: [5, 6, 4], pointers: [{ id: 0, label: 'l2' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'cur' }] },
    ], note: '初始化：dummy = new ListNode(0)，carry = 0，cur = dummy。l1 = [2,4,3] 表示 342，l2 = [5,6,4] 表示 465。' },
  { lists: [
      { title: 'l1', values: [4, 3], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'l2', values: [6, 4], pointers: [{ id: 0, label: 'l2' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 7], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'cur' }], states: [{ id: 1, state: 'done' }] },
    ], note: '第1位：s = l1.val(2) + l2.val(5) + carry(0) = 7。carry = 7/10 = 0。cur.next = new ListNode(7)，l1、l2 后移。' },
  { lists: [
      { title: 'l1', values: [3], pointers: [{ id: 0, label: 'l1' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'l2', values: [4], pointers: [{ id: 0, label: 'l2' }], states: [{ id: 0, state: 'hl' }] },
      { title: 'result', values: [null, 7, 0], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '第2位：s = l1.val(4) + l2.val(6) + carry(0) = 10。carry = 10/10 = 1。cur.next = new ListNode(0)，产生进位 1。' },
  { lists: [
      { title: 'l1', values: [] },
      { title: 'l2', values: [] },
      { title: 'result', values: [null, 7, 0, 8], pointers: [{ id: 0, label: 'dummy' }, { id: 3, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '第3位：s = l1.val(3) + l2.val(4) + carry(1) = 8。carry = 8/10 = 0。cur.next = new ListNode(8)，l1、l2 变为空。' },
  { lists: [
      { title: 'l1', values: [] },
      { title: 'l2', values: [] },
      { title: 'result', values: [null, 7, 0, 8], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }] },
    ], note: '循环结束（l1、l2 为空且 carry = 0）。返回 dummy.next = [7,0,8]，即 342 + 465 = 807 ✅。' },
]
</script>

<!-- problem:start -->

# [2. 两数相加](https://leetcode.cn/problems/add-two-numbers)

## 题目描述

<!-- description:start -->

<p>给你两个&nbsp;<strong>非空</strong> 的链表，表示两个非负的整数。它们每位数字都是按照&nbsp;<strong>逆序</strong>&nbsp;的方式存储的，并且每个节点只能存储&nbsp;<strong>一位</strong>&nbsp;数字。</p>

<p>请你将两个数相加，并以相同形式返回一个表示和的链表。</p>

<p>你可以假设除了数字 0 之外，这两个数都不会以 0&nbsp;开头。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823101925768.png" alt="image-20240823101925768"  />

<pre>
<strong>输入：</strong>l1 = [2,4,3], l2 = [5,6,4]
<strong>输出：</strong>[7,0,8]
<strong>解释：</strong>342 + 465 = 807.
</pre>

<p><strong class="example">示例 2：</strong></p>

<pre>
<strong>输入：</strong>l1 = [0], l2 = [0]
<strong>输出：</strong>[0]
</pre>

<p><strong class="example">示例 3：</strong></p>

<pre>
<strong>输入：</strong>l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
<strong>输出：</strong>[8,9,9,9,0,0,0,1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>每个链表中的节点数在范围 <code>[1, 100]</code> 内</li>
	<li><code>0 &lt;= Node.val &lt;= 9</code></li>
	<li>题目数据保证列表表示的数字不含前导零</li>
</ul>
<!-- description:end -->

<!-- solution:start -->

## 方法一：模拟

我们同时遍历两个链表 $l_1$ 和 $l_2$，并使用变量 $carry$ 表示当前是否有进位。

每次遍历时，我们取出对应链表的当前位，计算它们与进位 $carry$ 的和，然后更新进位的值，最后将当前位的值加入答案链表。如果两个链表都遍历完了，并且进位为 $0$ 时，遍历结束。

最后我们返回答案链表的头节点即可。

时间复杂度 $O(\max(m, n))$，其中 $m$ 和 $n$ 分别为两个链表的长度。我们需要遍历两个链表的全部位置，而处理每个位置只需要 $O(1)$ 的时间。忽略答案的空间消耗，空间复杂度 $O(1)$。

### 可视化演示

> 以 `l1 = [2, 4, 3]`、`l2 = [5, 6, 4]`（即 342 + 465）为例，演示逐位模拟加法：`dummy` 为虚拟头节点，`cur` 指向结果链表末尾，`carry` 记录进位。蓝色为当前相加的节点，黄色为被参照的节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="addTwoNumbersSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        int carry = 0;
        ListNode cur = dummy;
        while (l1 != null || l2 != null || carry != 0) {
            int s = (l1 == null ? 0 : l1.val) + (l2 == null ? 0 : l2.val) + carry;
            carry = s / 10;
            cur.next = new ListNode(s % 10);
            cur = cur.next;
            l1 = l1 == null ? null : l1.next;
            l2 = l2 == null ? null : l2.next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* dummy = new ListNode();
        int carry = 0;
        ListNode* cur = dummy;
        while (l1 || l2 || carry) {
            int s = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
            carry = s / 10;
            cur->next = new ListNode(s % 10);
            cur = cur->next;
            l1 = l1 ? l1->next : nullptr;
            l2 = l2 ? l2->next : nullptr;
        }
        return dummy->next;
    }
};
```


```ts [TypeScript]
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode();
    let cur = dummy;
    let sum = 0;
    while (l1 != null || l2 != null || sum !== 0) {
        if (l1 != null) {
            sum += l1.val;
            l1 = l1.next;
        }
        if (l2 != null) {
            sum += l2.val;
            l2 = l2.next;
        }
        cur.next = new ListNode(sum % 10);
        cur = cur.next;
        sum = Math.floor(sum / 10);
    }
    return dummy.next;
}
```

```python [Python]
class Solution:
    def addTwoNumbers(
        self, l1: Optional[ListNode], l2: Optional[ListNode]
    ) -> Optional[ListNode]:
        dummy = ListNode()
        carry, curr = 0, dummy
        while l1 or l2 or carry:
            s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
            carry, val = divmod(s, 10)
            curr.next = ListNode(val)
            curr = curr.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->