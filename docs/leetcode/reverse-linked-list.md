---
comments: true
difficulty: 简单

tags:
    - 递归
    - 链表
---

<!-- problem:start -->

# [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list)

## 题目描述

<!-- description:start -->

给你单链表的头节点 <code>head</code> ，请你反转链表，并返回反转后的链表。

<div class="original__bRMd">
<div>
<p> </p>

<p><strong>示例 1：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0200-0299/0206.Reverse%20Linked%20List/images/rev1ex1.jpg" style="width: 542px; height: 222px;" />
<pre>
<strong>输入：</strong>head = [1,2,3,4,5]
<strong>输出：</strong>[5,4,3,2,1]
</pre>

<p><strong>示例 2：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0200-0299/0206.Reverse%20Linked%20List/images/rev1ex2.jpg" style="width: 182px; height: 222px;" />
<pre>
<strong>输入：</strong>head = [1,2]
<strong>输出：</strong>[2,1]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>head = []
<strong>输出：</strong>[]
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点的数目范围是 <code>[0, 5000]</code></li>
	<li><code>-5000 <= Node.val <= 5000</code></li>
</ul>

<p> </p>

<p><strong>进阶：</strong>链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？</p>
</div>
</div>

<!-- description:end -->

<!-- solution:start -->

## 方法一：双指针

只需要改变链表的next指针的指向，直接将链表反转即可，时间复杂度 O(n)，空间复杂度 O(n)。其中 n 为链表的长度。

图示如下：

![img](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/206.%25E7%25BF%25BB%25E8%25BD%25AC%25E9%2593%25BE%25E8%25A1%25A8.gif)

::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null) {
            return head;
        }

        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        head = prev;
        return head;
    }
}
```

```ts [TypeScript]
class Solution {
    reverseList(head: ListNode | null): ListNode | null {
        if (head === null) {
            return head;
        }

        let prev: ListNode | null = null;
        let curr: ListNode | null = head;
        while (curr !== null) {
            const next: ListNode | null = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        return prev;
    }
}
```



:::

## 方法二：头插法

创建虚拟头节点 $dummy$，遍历链表，将每个节点依次插入 $dummy$ 的下一个节点。遍历结束，返回 $dummy.next$。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为链表的长度。

图示如下：

![image-20250424115032080](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20250424115032080.png)

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode dummy = new ListNode();
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = dummy.next;
            dummy.next = curr;
            curr = next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* dummy = new ListNode();
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = dummy->next;
            dummy->next = curr;
            curr = next;
        }
        return dummy->next;
    }
};
```

```ts [TypeScript]
function reverseList(head: ListNode | null): ListNode | null {
    if (head == null) {
        return head;
    }
    let pre = null;
    let cur = head;
    while (cur != null) {
        const next = cur.next;
        cur.next = pre;
        [pre, cur] = [cur, next];
    }
    return pre;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三：从前向后递归

时间复杂度 O(n)，空间复杂度 O(n)。其中 n 为链表的长度。

::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        return rescursion(null, head);
    }

    private ListNode rescursion(ListNode prev, ListNode curr) {
        if (curr == null) {
            return prev;
        }
        ListNode next = curr.next;
        curr.next = prev;

        return rescursion(curr, next);
    }
}
```

:::

## 方法四：从后向前递归

递归反转链表的第二个节点到尾部的所有节点，然后 $head$ 插在反转后的链表的尾部。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为链表的长度。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
         // 递归调用，翻转第二个节点开始往后的链表
        ListNode ans = reverseList(head.next);
        // 翻转头节点与第二个节点的指向
        head.next.next = head;
        //此时的 head 节点为尾节点，next 需要指向 NULL
        head.next = null;
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* ans = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        return ans;
    }
};
```

```ts [TypeScript]
const rev = (pre: ListNode | null, cur: ListNode | null): ListNode | null => {
    if (cur == null) {
        return pre;
    }
    const next = cur.next;
    cur.next = pre;
    return rev(cur, next);
};

function reverseList(head: ListNode | null): ListNode | null {
    if (head == null) {
        return head;
    }
    const next = head.next;
    head.next = null;
    return rev(head, next);
}
```

```python [Python]
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if head is None or head.next is None:
            return head
        ans = self.reverseList(head.next)
        head.next.next = head
        head.next = None
        return ans
```

:::

## 方法五：使用栈

时间复杂度 $O(n)$，空间复杂度 $O(n)$。

::: code-group

```java [Java]
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        Stack<ListNode> stack = new Stack<>();
        ListNode current = head;
        while (current != null) {
            stack.push(current);
            current = current.next;
        }
        ListNode newHead = stack.pop();
        current = newHead;
        
        while (!stack.isEmpty()) {
            ListNode node = stack.pop();
            current.next = node;
            current = node;
        }
       
        current.next = null;
        return newHead;
    }
}
```

````ts [TypeScript]
class Solution {
    reverseList(head: ListNode | null): ListNode | null {
        if (head === null || head.next === null) {
            return head;
        }

        const stack: ListNode[] = [];
        
        let current: ListNode | null = head;
        while (current !== null) {
            stack.push(current);
            current = current.next;
        }
        const newHead: ListNode = stack.pop()!;
        current = newHead;
        
        while (stack.length > 0) {
            const node = stack.pop()!;
            current.next = node;
            current = node;
        }
        
        current.next = null;
        return newHead;
    }
}
````

:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
