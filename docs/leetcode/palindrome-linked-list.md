---
comments: true
difficulty: 简单

tags:
    - 栈
    - 递归
    - 链表
    - 双指针
---

<script setup>
// 方法一（快慢指针）可视化：head = [1,2,2,1]
// 阶段一：slow/fast 找中点；阶段二：反转右半段（cur 摘除、pre 头插）；阶段三：pre 与 head 逐节点比较
const palindromeSteps = [
  { lists: [
      { title: 'head', values: [1, 2, 2, 1], pointers: [{ id: 0, label: 'slow' }, { id: 1, label: 'fast' }] },
    ], note: '初始化 slow = head（节点 1），fast = head.next（节点 2）。' },
  { lists: [
      { title: 'head', values: [1, 2, 2, 1], pointers: [{ id: 1, label: 'slow' }, { id: 3, label: 'fast' }] },
    ], note: 'fast 与 fast.next 均非空：slow = slow.next 走到节点 2，fast = fast.next.next 走到节点 1。' },
  { lists: [
      { title: 'head', values: [1, 2, 2, 1], pointers: [{ id: 1, label: 'slow' }, { id: 3, label: 'fast' }], states: [{ id: 1, state: 'done' }] },
    ], note: 'fast.next 为 null，循环结束。slow 停在左半段末尾（第二个节点 2），右半段从 slow.next 开始。' },
  { lists: [
      { title: '左半段', values: [1, 2], pointers: [{ id: 0, label: 'head' }] },
      { title: '右半段', values: [2, 1], pointers: [{ id: 0, label: 'cur' }], states: [{ id: 0, state: 'cur' }] },
    ], note: 'cur = slow.next 指向右半段头节点 2，slow.next = null 将链表从中间断开。' },
  { lists: [
      { title: '右半段(剩余)', values: [1], pointers: [{ id: 0, label: 'cur' }], states: [{ id: 0, state: 'cur' }] },
      { title: 'pre(已反转)', values: [2], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }] },
    ], note: 't = cur.next 暂存节点 1；cur.next = pre（初始为 null）；pre = cur = 节点 2；cur = t = 节点 1。节点 2 成为反转链表新头。' },
  { lists: [
      { title: '右半段(剩余)', values: [] },
      { title: 'pre(已反转)', values: [1, 2], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }] },
    ], note: 't = cur.next = null；cur.next = pre（节点 2）；pre = cur = 节点 1；cur = null。右半段反转完成，pre 指向 [1,2]。' },
  { lists: [
      { title: 'head(左半段)', values: [1, 2], pointers: [{ id: 0, label: 'head' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'hl' }] },
      { title: 'pre(反转后)', values: [1, 2], pointers: [{ id: 0, label: 'pre' }], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'hl' }] },
    ], note: '开始比较：pre.val=1 与 head.val=1 相等，pre 与 head 各向后移动一步。' },
  { lists: [
      { title: 'head(左半段)', values: [1, 2], pointers: [{ id: 1, label: 'head' }], states: [{ id: 1, state: 'cur' }] },
      { title: 'pre(反转后)', values: [1, 2], pointers: [{ id: 1, label: 'pre' }], states: [{ id: 1, state: 'cur' }] },
    ], note: 'pre.val=2 与 head.val=2 相等，继续后移。' },
  { lists: [
      { title: 'head(左半段)', values: [1, 2], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }] },
      { title: 'pre(反转后)', values: [1, 2], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'mark' }] },
    ], note: 'pre 为空，比较结束，所有对应节点值相等。是回文链表，返回 true ✅。' },
]
</script>

<!-- problem:start -->

# [234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list)

## 题目描述

<!-- description:start -->

<p>给你一个单链表的头节点 <code>head</code> ，请你判断该链表是否为<span data-keyword="palindrome-sequence">回文链表</span>。如果是，返回 <code>true</code> ；否则，返回 <code>false</code> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104331812.png" alt="image-20240823104331812"  />
<pre>
<strong>输入：</strong>head = [1,2,2,1]
<strong>输出：</strong>true
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104344516.png" alt="image-20240823104344516"  />

<pre>
<strong>输入：</strong>head = [1,2]
<strong>输出：</strong>false
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点数目在范围<code>[1, 10<sup>5</sup>]</code> 内</li>
	<li><code>0 &lt;= Node.val &lt;= 9</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你能否用&nbsp;<code>O(n)</code> 时间复杂度和 <code>O(1)</code> 空间复杂度解决此题？</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一：快慢指针

我们可以先用快慢指针找到链表的中点，接着反转右半部分的链表。然后同时遍历前后两段链表，若前后两段链表节点对应的值不等，说明不是回文链表，否则说明是回文链表。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为链表的长度。

### 可视化演示

> 以 `head = [1,2,2,1]` 为例，分三阶段演示：先用 `slow`/`fast` 快慢指针找中点，再反转右半段（`cur` 摘除节点、`pre` 头插），最后 `pre` 与 `head` 逐节点比较。蓝色为当前节点，黄色为被比较的节点，绿色为已处理/已反转节点，红色为最终比对结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="palindromeSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public boolean isPalindrome(ListNode head) {
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode cur = slow.next;
        slow.next = null;
        ListNode pre = null;
        while (cur != null) {
            ListNode t = cur.next;
            cur.next = pre;
            pre = cur;
            cur = t;
        }
        while (pre != null) {
            if (pre.val != head.val) {
                return false;
            }
            pre = pre.next;
            head = head.next;
        }
        return true;
    }
}
```



```cpp [C++]
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head->next;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* pre = nullptr;
        ListNode* cur = slow->next;
        while (cur) {
            ListNode* t = cur->next;
            cur->next = pre;
            pre = cur;
            cur = t;
        }
        while (pre) {
            if (pre->val != head->val) return false;
            pre = pre->next;
            head = head->next;
        }
        return true;
    }
};
```

```ts [TypeScript]
function isPalindrome(head: ListNode | null): boolean {
    let slow: ListNode = head,
        fast: ListNode = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let cur: ListNode = slow.next;
    slow.next = null;
    let prev: ListNode = null;
    while (cur != null) {
        let t: ListNode = cur.next;
        cur.next = prev;
        prev = cur;
        cur = t;
    }
    while (prev != null) {
        if (prev.val != head.val) return false;
        prev = prev.next;
        head = head.next;
    }
    return true;
}
```

```python [Python]
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        slow, fast = head, head.next
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
        pre, cur = None, slow.next
        while cur:
            t = cur.next
            cur.next = pre
            pre, cur = cur, t
        while pre:
            if pre.val != head.val:
                return False
            pre, head = pre.next, head.next
        return True
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->