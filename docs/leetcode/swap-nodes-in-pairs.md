---
comments: true
difficulty: 中等

tags:
    - 递归
    - 链表
---

<!-- problem:start -->

# [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs)

## 题目描述

<!-- description:start -->

<p>给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823104256208.png" alt="image-20240823104256208"  />

<pre>
<strong>输入：</strong>head = [1,2,3,4]
<strong>输出：</strong>[2,1,4,3]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>head = []
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>head = [1]
<strong>输出：</strong>[1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点的数目在范围 <code>[0, 100]</code> 内</li>
	<li><code>0 &lt;= Node.val &lt;= 100</code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：递归

我们可以通过递归的方式实现两两交换链表中的节点。

递归的终止条件是链表中没有节点，或者链表中只有一个节点，此时无法进行交换，直接返回该节点。

否则，我们递归交换链表 $head.next.next$，记交换后的头节点为 $t$，然后我们记 $head$ 的下一个节点为 $p$，然后令 $p$ 指向 $head$，而 $head$ 指向 $t$，最后返回 $p$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$，其中 $n$ 是链表的长度。

<!-- tabs:start -->
::: code-group
```java [Java]
class Solution {
    public ListNode swapPairs(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode t = swapPairs(head.next.next);
        ListNode p = head.next;
        p.next = head;
        head.next = t;
        return p;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        if (!head || !head->next) {
            return head;
        }
        ListNode* t = swapPairs(head->next->next);
        ListNode* p = head->next;
        p->next = head;
        head->next = t;
        return p;
    }
};
```

```ts [TypeScript]
function swapPairs(head: ListNode | null): ListNode | null {
    if (!head || !head.next) {
        return head;
    }
    const t = swapPairs(head.next.next);
    const p = head.next;
    p.next = head;
    head.next = t;
    return p;
}
```

```python [Python]
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if head is None or head.next is None:
            return head
        t = self.swapPairs(head.next.next)
        p = head.next
        p.next = head
        head.next = t
        return p
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：迭代

我们设置一个虚拟头节点 $dummy$，初始时指向 $head$，然后设置两个指针 $pre$ 和 $cur$，初始时 $pre$ 指向 $dummy$，而 $cur$ 指向 $head$。

接下来，我们遍历链表，每次需要交换 $pre$ 后面的两个节点，因此我们先判断 $cur$ 和 $cur.next$ 是否为空，若不为空，则进行交换，否则终止循环。

时间复杂度 $O(n)$，空间复杂度 $O(1)$，其中 $n$ 是链表的长度。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode pre = dummy;
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            ListNode t = cur.next;
            cur.next = t.next;
            t.next = cur;
            pre.next = t;
            pre = cur;
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* pre = dummy;
        ListNode* cur = head;
        while (cur && cur->next) {
            ListNode* t = cur->next;
            cur->next = t->next;
            t->next = cur;
            pre->next = t;
            pre = cur;
            cur = cur->next;
        }
        return dummy->next;
    }
};
```

```ts [TypeScript]
function swapPairs(head: ListNode | null): ListNode | null {
    const dummy = new ListNode(0, head);
    let [pre, cur] = [dummy, head];
    while (cur && cur.next) {
        const t = cur.next;
        cur.next = t.next;
        t.next = cur;
        pre.next = t;
        [pre, cur] = [cur, cur.next];
    }
    return dummy.next;
}
```

```python [Python]
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(next=head)
        pre, cur = dummy, head
        while cur and cur.next:
            t = cur.next
            cur.next = t.next
            t.next = cur
            pre.next = t
            pre, cur = cur, cur.next
        return dummy.next
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->