---
comments: true
difficulty: 中等

tags:
    - 哈希表
    - 链表
    - 双指针
entry: detectCycle
mode: link-cycle-ii
testcases:
  - input: [[3, 2, 0, -4], 1]
    output: 2
  - input: [[1, 2], 0]
    output: 1
  - input: [[1], -1]
    output: null
---

<script setup>
// 方法一（快慢指针）可视化：head = [3,2,0,-4]，pos = 1（尾节点 -4 指向下标 1 的节点 2，构成环）
// 变量名与代码一致：阶段一 fast/slow 找相遇点（节点 -4），阶段二 ans 与 slow 同步走找环入口（节点 2）
const detectCycleSteps = [
  { lists: [
      { title: 'head', values: [3, 2, 0, -4], cycleTo: 1, pointers: [{ id: 0, label: 'fast' }, { id: 0, label: 'slow' }] },
    ], note: '阶段一：`fast = slow = head`，先移动快慢指针寻找相遇点。' },
  { lists: [
      { title: 'head', values: [3, 2, 0, -4], cycleTo: 1, pointers: [{ id: 2, label: 'fast' }, { id: 1, label: 'slow' }], states: [{ id: 2, state: 'cur' }, { id: 1, state: 'hl' }] },
    ], note: '第 1 轮：`slow = slow.next` → 节点 2，`fast = fast.next.next` → 节点 0，二者未相遇。' },
  { lists: [
      { title: 'head', values: [3, 2, 0, -4], cycleTo: 1, pointers: [{ id: 1, label: 'fast' }, { id: 2, label: 'slow' }], states: [{ id: 1, state: 'cur' }, { id: 2, state: 'hl' }] },
    ], note: '第 2 轮：slow → 节点 0，fast → 节点 2（绕环半圈），二者未相遇。' },
  { lists: [
      { title: 'head', values: [3, 2, 0, -4], cycleTo: 1, pointers: [{ id: 3, label: 'fast' }, { id: 3, label: 'slow' }], states: [{ id: 3, state: 'cur' }] },
    ], note: '第 3 轮：slow 与 fast 在节点 -4 相遇，确认链表存在环。' },
  { lists: [
      { title: 'head', values: [3, 2, 0, -4], cycleTo: 1, pointers: [{ id: 3, label: 'slow' }, { id: 0, label: 'ans' }], states: [{ id: 3, state: 'done' }] },
    ], note: '阶段二：令 `ans = head`，ans 与 slow 同步每次走一步，直到二者相遇，相遇节点即环入口。' },
  { lists: [
      { title: 'head', values: [3, 2, 0, -4], cycleTo: 1, pointers: [{ id: 1, label: 'slow' }, { id: 1, label: 'ans' }], states: [{ id: 1, state: 'mark' }, { id: 3, state: 'done' }] },
    ], note: 'ans 与 slow 均走到节点 2，二者相遇，该节点即环入口（下标 1），返回 `ans` ✅。' },
]
</script>

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

### 可视化演示

> 以 `head = [3, 2, 0, -4]`、`pos = 1` 为例，演示快慢指针找环入口：阶段一 `fast`/`slow` 移动找相遇点，阶段二 `ans` 与 `slow` 同步走，相遇节点即环入口。蓝色为 `fast`/`ans` 当前节点，黄色为 `slow` 当前节点，绿色为已确认的相遇节点，红色为环入口结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="detectCycleSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

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