---
comments: true
difficulty: 简单
---

<!-- problem:start -->

# [面试题 22. 链表中倒数第 k 个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

## 题目描述

<!-- description:start -->

<p>输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。</p>

<p>例如，一个链表有 <code>6</code> 个节点，从头节点开始，它们的值依次是 <code>1、2、3、4、5、6</code>。这个链表的倒数第 <code>3</code> 个节点是值为 <code>4</code> 的节点。</p>

<p> </p>

<p><strong>示例：</strong></p>

<pre>
给定一个链表: <strong>1->2->3->4->5</strong>, 和 <em>k </em><strong>= 2</strong>.

返回链表 4<strong>->5</strong>.</pre>

<!-- description:end -->

<!-- solution:start -->

## 方法一：快慢指针

我们可以定义快慢指针 `fast` 和 `slow`，初始时均指向 `head`。

然后快指针 `fast` 先向前走 $k$ 步，然后快慢指针同时向前走，直到快指针走到链表尾部，此时慢指针指向的节点就是倒数第 $k$ 个节点。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为链表长度。

<!-- tabs:start -->
::: code-group

```java
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode slow = head, fast = head;
        while (k-- > 0) {
            fast = fast.next;
        }
        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }
}
```

```cpp
class Solution {
public:
    ListNode* getKthFromEnd(ListNode* head, int k) {
        ListNode *slow = head, *fast = head;
        while (k--) {
            fast = fast->next;
        }
        while (fast) {
            slow = slow->next;
            fast = fast->next;
        }
        return slow;
    }
};
```

```python
class Solution:
    def getKthFromEnd(self, head: ListNode, k: int) -> ListNode:
        slow = fast = head
        for _ in range(k):
            fast = fast.next
        while fast:
            slow, fast = slow.next, fast.next
        return slow
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->