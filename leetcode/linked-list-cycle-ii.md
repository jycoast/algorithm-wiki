---
comments: true
difficulty: 中等

tags:
    - 哈希表
    - 链表
    - 双指针
---

<!-- problem:start -->

# [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii)

## 题目描述

<!-- description:start -->

<p>给定一个链表的头节点 &nbsp;<code>head</code>&nbsp;，返回链表开始入环的第一个节点。&nbsp;<em>如果链表无环，则返回&nbsp;<code>null</code>。</em></p>

<p>如果链表中有某个节点，可以通过连续跟踪 <code>next</code> 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 <code>pos</code> 来表示链表尾连接到链表中的位置（<strong>索引从 0 开始</strong>）。如果 <code>pos</code> 是 <code>-1</code>，则在该链表中没有环。<strong>注意：<code>pos</code> 不作为参数进行传递</strong>，仅仅是为了标识链表的实际情况。</p>

<p><strong>不允许修改 </strong>链表。</p>

<ul>
</ul>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

![image-20240823102631508](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102631508.png)

<pre>
<strong>输入：</strong>head = [3,2,0,-4], pos = 1
<strong>输出：</strong>返回索引为 1 的链表节点
<strong>解释：</strong>链表中有一个环，其尾部连接到第二个节点。
</pre>

<p><strong>示例&nbsp;2：</strong></p>

![image-20240823102644356](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102644356.png)

<pre>
<strong>输入：</strong>head = [1,2], pos = 0
<strong>输出：</strong>返回索引为 0 的链表节点
<strong>解释：</strong>链表中有一个环，其尾部连接到第一个节点。
</pre>

<p><strong>示例 3：</strong></p>

![image-20240823102657695](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823102657695.png)

<pre>
<strong>输入：</strong>head = [1], pos = -1
<strong>输出：</strong>返回 null
<strong>解释：</strong>链表中没有环。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>链表中节点的数目范围在范围 <code>[0, 10<sup>4</sup>]</code> 内</li>
	<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>
	<li><code>pos</code> 的值为 <code>-1</code> 或者链表中的一个有效索引</li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你是否可以使用 <code>O(1)</code> 空间解决此题？</p>

<!-- description:end -->


<!-- solution:start -->

## 方法一：快慢指针

我们先利用快慢指针判断链表是否有环，如果有环的话，快慢指针一定会相遇，且相遇的节点一定在环中。

如果没有环，快指针会先到达链表尾部，直接返回 `null` 即可。

如果有环，我们再定义一个答案指针 $ans$ 指向链表头部，然后让 $ans$ 和慢指针一起向前走，每次走一步，直到 $ans$ 和慢指针相遇，相遇的节点即为环的入口节点。

为什么这样能找到环的入口节点呢？

我们不妨假设链表头节点到环入口的距离为 $x$，环入口到相遇节点的距离为 $y$，相遇节点到环入口的距离为 $z$，那么慢指针走过的距离为 $x + y$，快指针走过的距离为 $x + y + k \times (y + z)$，其中 $k$ 是快指针在环中绕了 $k$ 圈。

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823111145195.png" alt="image-20240823111145195"  />

由于快指针速度是慢指针的 $2$ 倍，因此有 $2 \times (x + y) = x + y + k \times (y + z)$，可以推出 $x + y = k \times (y + z)$，即 $x = (k - 1) \times (y + z) + z$。

也即是说，如果我们定义一个答案指针 $ans$ 指向链表头部，然后 $ans$ 和慢指针一起向前走，那么它们一定会在环入口相遇。

时间复杂度 $O(n)$，其中 $n$ 是链表中节点的数目。空间复杂度 $O(1)$。

<!-- tabs:start -->
::: code-group

```java [Java]
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode fast = head, slow = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode ans = head;
                while (ans != slow) {
                    ans = ans.next;
                    slow = slow.next;
                }
                return ans;
            }
        }
        return null;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        ListNode* fast = head;
        ListNode* slow = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                ListNode* ans = head;
                while (ans != slow) {
                    ans = ans->next;
                    slow = slow->next;
                }
                return ans;
            }
        }
        return nullptr;
    }
};
```

```ts [TypeScript]
function detectCycle(head: ListNode | null): ListNode | null {
    let [slow, fast] = [head, head];
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            let ans = head;
            while (ans !== slow) {
                ans = ans.next;
                slow = slow.next;
            }
            return ans;
        }
    }
    return null;
}
```

```python [Python]
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        fast = slow = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                ans = head
                while ans != slow:
                    ans = ans.next
                    slow = slow.next
                return ans
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->