---
comments: true
difficulty: 困难
tags:
  - 链表
  - 分治
  - 堆（优先队列）
  - 归并排序
entry: mergeKLists
testcases:
  - input:
      - - - 1
          - 4
          - 5
        - - 1
          - 3
          - 4
        - - 2
          - 6
    output:
      - 1
      - 1
      - 2
      - 3
      - 4
      - 4
      - 5
      - 6
  - input:
      - []
    output: []
  - input:
      - - []
    output: []
mode: link-lists
---


<script setup>
// 方法一（优先队列/小根堆）可视化：lists = [[1,4,5],[1,3,4],[2,6]]
// 每步展示小根堆 pq 中头节点的弹出与入堆，dummy/cur 拼接 result，各链表头节点逐步后移
const mergeKSteps = [
  { lists: [
      { title: 'lists[0]', values: [1, 4, 5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [1, 3, 4], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[2]', values: [2, 6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [1, 1, 2], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null], pointers: [{ id: 0, label: 'dummy' }, { id: 0, label: 'cur' }] },
    ], note: '将所有非空链表的头节点入堆：pq = {1, 1, 2}（分别来自 lists[0]、lists[1]、lists[2]）。建虚拟头节点 dummy，cur = dummy。' },
  { lists: [
      { title: 'lists[0]', values: [4, 5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [1, 3, 4], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[2]', values: [2, 6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [1, 2, 4], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1], pointers: [{ id: 0, label: 'dummy' }, { id: 1, label: 'cur' }], states: [{ id: 1, state: 'done' }] },
    ], note: '弹出堆顶 node=1（来自 lists[0]），其 next=4 入堆。cur.next = node，cur = node。堆 = {1, 2, 4}。' },
  { lists: [
      { title: 'lists[0]', values: [4, 5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [3, 4], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[2]', values: [2, 6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [2, 3, 4], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1, 1], pointers: [{ id: 0, label: 'dummy' }, { id: 2, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }] },
    ], note: '弹出堆顶 node=1（来自 lists[1]），其 next=3 入堆。cur.next = node，cur = node。堆 = {2, 3, 4}。' },
  { lists: [
      { title: 'lists[0]', values: [4, 5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [3, 4], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[2]', values: [6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [3, 4, 6], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1, 1, 2], pointers: [{ id: 0, label: 'dummy' }, { id: 3, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }] },
    ], note: '弹出堆顶 node=2（来自 lists[2]），其 next=6 入堆。cur.next = node，cur = node。堆 = {3, 4, 6}。' },
  { lists: [
      { title: 'lists[0]', values: [4, 5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [4], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[2]', values: [6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [4, 4, 6], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1, 1, 2, 3], pointers: [{ id: 0, label: 'dummy' }, { id: 4, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }] },
    ], note: '弹出堆顶 node=3（来自 lists[1]），其 next=4 入堆。cur.next = node，cur = node。堆 = {4, 4, 6}。' },
  { lists: [
      { title: 'lists[0]', values: [5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [4], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[2]', values: [6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [4, 5, 6], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1, 1, 2, 3, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 5, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }] },
    ], note: '弹出堆顶 node=4（来自 lists[0]），其 next=5 入堆。cur.next = node，cur = node。堆 = {4, 5, 6}。' },
  { lists: [
      { title: 'lists[0]', values: [5], pointers: [{ id: 0, label: 'head' }] },
      { title: 'lists[1]', values: [], },
      { title: 'lists[2]', values: [6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [5, 6], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1, 1, 2, 3, 4, 4], pointers: [{ id: 0, label: 'dummy' }, { id: 6, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }] },
    ], note: '弹出堆顶 node=4（来自 lists[1]），其 next 为空不入堆，lists[1] 变空。cur.next = node，cur = node。堆 = {5, 6}。' },
  { lists: [
      { title: 'lists[0]', values: [], },
      { title: 'lists[1]', values: [], },
      { title: 'lists[2]', values: [6], pointers: [{ id: 0, label: 'head' }] },
      { title: 'pq（堆）', values: [6], pointers: [{ id: 0, label: '堆顶' }] },
      { title: 'result', values: [null, 1, 1, 2, 3, 4, 4, 5], pointers: [{ id: 0, label: 'dummy' }, { id: 7, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 7, state: 'done' }] },
    ], note: '弹出堆顶 node=5（来自 lists[0]），其 next 为空不入堆，lists[0] 变空。cur.next = node，cur = node。堆 = {6}。' },
  { lists: [
      { title: 'lists[0]', values: [], },
      { title: 'lists[1]', values: [], },
      { title: 'lists[2]', values: [], },
      { title: 'pq（堆）', values: [], },
      { title: 'result', values: [null, 1, 1, 2, 3, 4, 4, 5, 6], pointers: [{ id: 0, label: 'dummy' }, { id: 8, label: 'cur' }], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 7, state: 'done' }, { id: 8, state: 'done' }] },
    ], note: '弹出堆顶 node=6（来自 lists[2]），其 next 为空不入堆。cur.next = node，cur = node。堆为空，循环结束。' },
  { lists: [
      { title: 'lists[0]', values: [], },
      { title: 'lists[1]', values: [], },
      { title: 'lists[2]', values: [], },
      { title: 'pq（堆）', values: [], },
      { title: 'result', values: [null, 1, 1, 2, 3, 4, 4, 5, 6], pointers: [{ id: 0, label: 'dummy' }], states: [{ id: 1, state: 'mark' }, { id: 2, state: 'mark' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 5, state: 'mark' }, { id: 6, state: 'mark' }, { id: 7, state: 'mark' }, { id: 8, state: 'mark' }] },
    ], note: '返回 dummy.next = [1,1,2,3,4,4,5,6] ✅，K 个链表合并完成。' },
]
</script>

<!-- problem:start -->

# [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists)

## 题目描述

<!-- description:start -->

<p>给你一个链表数组，每个链表都已经按升序排列。</p>

<p>请你将所有链表合并到一个升序链表中，返回合并后的链表。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre><strong>输入：</strong>lists = [[1,4,5],[1,3,4],[2,6]]
<strong>输出：</strong>[1,1,2,3,4,4,5,6]
<strong>解释：</strong>链表数组如下：
[
  1-&gt;4-&gt;5,
  1-&gt;3-&gt;4,
  2-&gt;6
]
将它们合并到一个有序链表中得到。
1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6
</pre>

<p><strong>示例 2：</strong></p>

<pre><strong>输入：</strong>lists = []
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre><strong>输入：</strong>lists = [[]]
<strong>输出：</strong>[]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>k == lists.length</code></li>
	<li><code>0 &lt;= k &lt;= 10^4</code></li>
	<li><code>0 &lt;= lists[i].length &lt;= 500</code></li>
	<li><code>-10^4 &lt;= lists[i][j] &lt;= 10^4</code></li>
	<li><code>lists[i]</code> 按 <strong>升序</strong> 排列</li>
	<li><code>lists[i].length</code> 的总和不超过 <code>10^4</code></li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：优先队列（小根堆）

我们可以创建一个小根堆来 $pq$ 维护所有链表的头节点，每次从小根堆中取出值最小的节点，添加到结果链表的末尾，然后将该节点的下一个节点加入堆中，重复上述步骤直到堆为空。

时间复杂度 $O(n \times \log k)$，空间复杂度 $O(k)$。其中 $n$ 是所有链表节点数目的总和，而 $k$ 是题目给定的链表数目。

### 可视化演示

> 以题目示例 `lists = [[1,4,5],[1,3,4],[2,6]]` 为例，演示小根堆合并：`pq` 维护各链表当前头节点（堆内最小值在堆顶），每步弹出堆顶接到 `result` 的 `cur` 之后，再将该节点的 `next` 入堆，直到堆空。绿色为已接入结果的节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<ListViz :steps="mergeKSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode head : lists) {
            if (head != null) {
                pq.offer(head);
            }
        }
        ListNode dummy = new ListNode();
        ListNode cur = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            if (node.next != null) {
                pq.offer(node.next);
            }
            cur.next = node;
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

```cpp [C++]
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq;
        for (auto head : lists) {
            if (head) {
                pq.push(head);
            }
        }
        ListNode* dummy = new ListNode();
        ListNode* cur = dummy;
        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();
            if (node->next) {
                pq.push(node->next);
            }
            cur->next = node;
            cur = cur->next;
        }
        return dummy->next;
    }
};
```

```ts [TypeScript]
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const pq = new MinPriorityQueue({ priority: (node: ListNode) => node.val });
    for (const head of lists) {
        if (head) {
            pq.enqueue(head);
        }
    }
    const dummy: ListNode = new ListNode();
    let cur: ListNode = dummy;
    while (!pq.isEmpty()) {
        const node = pq.dequeue().element;
        cur.next = node;
        cur = cur.next;
        if (node.next) {
            pq.enqueue(node.next);
        }
    }
    return dummy.next;
}
```

```python [Python]
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        setattr(ListNode, "__lt__", lambda a, b: a.val < b.val)
        pq = [head for head in lists if head]
        heapify(pq)
        dummy = cur = ListNode()
        while pq:
            node = heappop(pq)
            if node.next:
                heappush(pq, node.next)
            cur.next = node
            cur = cur.next
        return dummy.next
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->