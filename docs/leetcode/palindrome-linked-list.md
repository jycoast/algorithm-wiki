---
comments: true
difficulty: 简单

tags:
    - 栈
    - 递归
    - 链表
    - 双指针
---

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