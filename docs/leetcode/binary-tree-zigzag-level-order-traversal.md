---
comments: true
difficulty: 中等

tags:
    - 树
    - 广度优先搜索
    - 二叉树
---

<script setup>
// 方法一（BFS + left 标志）可视化：root = [3,9,20,null,null,15,7]
// 层序下标：0=3, 1=9, 2=20, 3=null, 4=null, 5=15, 6=7
const zigzagLevelOrderSteps = [
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'cur' }], aux: [{ title: '队列 q', values: [3], marker: 0, markerLabel: '队首' }, { title: '本层 t', values: [] }], note: '初始：q = [3]，left = true（第一层从左到右）。开始第一层遍历。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }], aux: [{ title: '队列 q', values: [9, 20], marker: 0, markerLabel: '队首' }, { title: '本层 t', values: [3] }], note: '第一层：出队 3 → t = [3]，孩子 9、20 入队，q = [9, 20]。本层结束，left=true 不翻转，ans = [[3]]，随后 left 翻转为 false。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }, { id: 2, state: 'hl' }], aux: [{ title: '队列 q', values: [20], marker: 0, markerLabel: '队首' }, { title: '本层 t', values: [9] }], note: '第二层（left = false，从右到左）：出队 9 → t = [9]。9 的孩子均为 null，不入队。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }], aux: [{ title: '队列 q', values: [15, 7], marker: 0, markerLabel: '队首' }, { title: '本层 t', values: [9, 20] }], note: '出队 20 → t = [9, 20]，孩子 15、7 入队，q = [15, 7]。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'hl' }, { id: 6, state: 'hl' }], aux: [{ title: '队列 q', values: [15, 7], marker: 0, markerLabel: '队首' }, { title: '本层 t', values: [20, 9] }], note: '第二层结束：left=false → 将 t 反转为 [20, 9]，ans = [[3], [20, 9]]。left 翻转为 true（第三层从左到右）。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'cur' }, { id: 6, state: 'hl' }], aux: [{ title: '队列 q', values: [7], marker: 0, markerLabel: '队首' }, { title: '本层 t', values: [15] }], note: '第三层（left = true）：出队 15 → t = [15]。15 的孩子均为 null，不入队。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'cur' }], aux: [{ title: '队列 q', values: [] }, { title: '本层 t', values: [15, 7] }], note: '出队 7 → t = [15, 7]。队列为空，第三层结束，left=true 不翻转，ans = [[3], [20, 9], [15, 7]] ✅' },
]
</script>

<!-- problem:start -->

# [103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal)

## 题目描述

<!-- description:start -->

<p>给你二叉树的根节点 <code>root</code> ，返回其节点值的 <strong>锯齿形层序遍历</strong> 。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110122081.png" alt="image-20240823110122081"  />

<pre>
<strong>输入：</strong>root = [3,9,20,null,null,15,7]
<strong>输出：</strong>[[3],[20,9],[15,7]]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>root = [1]
<strong>输出：</strong>[[1]]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = []
<strong>输出：</strong>[]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目在范围 <code>[0, 2000]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：BFS

为了实现锯齿形层序遍历，需要在层序遍历的基础上增加一个标志位 `left`，用于标记当前层的节点值的顺序。如果 `left` 为 `true`，则当前层的节点值按照从左到右的顺序存入结果数组 `ans` 中；如果 `left` 为 `false`，则当前层的节点值按照从右到左的顺序存入结果数组 `ans` 中。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树的节点数。

### 可视化演示

> 以 `root = [3, 9, 20, null, null, 15, 7]` 为例，演示锯齿形层序遍历：队列 `q` 存放当前层节点，标志位 `left` 控制每层方向（`true` 从左到右，`false` 从右到左）。蓝色为当前出队节点，黄色为本层节点，绿色为已处理。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="zigzagLevelOrderSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) {
            return ans;
        }
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        boolean left = true;
        while (!q.isEmpty()) {
            List<Integer> t = new ArrayList<>();
            for (int n = q.size(); n > 0; --n) {
                TreeNode node = q.poll();
                t.add(node.val);
                if (node.left != null) {
                    q.offer(node.left);
                }
                if (node.right != null) {
                    q.offer(node.right);
                }
            }
            if (!left) {
                Collections.reverse(t);
            }
            ans.add(t);
            left = !left;
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        if (!root) {
            return ans;
        }
        queue<TreeNode*> q{{root}};
        int left = 1;
        while (!q.empty()) {
            vector<int> t;
            for (int n = q.size(); n; --n) {
                auto node = q.front();
                q.pop();
                t.emplace_back(node->val);
                if (node->left) {
                    q.push(node->left);
                }
                if (node->right) {
                    q.push(node->right);
                }
            }
            if (!left) {
                reverse(t.begin(), t.end());
            }
            ans.emplace_back(t);
            left ^= 1;
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        ans = []
        if root is None:
            return ans
        q = deque([root])
        ans = []
        left = 1
        while q:
            t = []
            for _ in range(len(q)):
                node = q.popleft()
                t.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            ans.append(t if left else t[::-1])
            left ^= 1
        return ans
```


```ts [TypeScript]
function zigzagLevelOrder(root: TreeNode | null): number[][] {
    const ans: number[][] = [];
    if (!root) {
        return ans;
    }
    const q: TreeNode[] = [root];
    let left: number = 1;
    while (q.length) {
        const t: number[] = [];
        const qq: TreeNode[] = [];
        for (const { val, left, right } of q) {
            t.push(val);
            left && qq.push(left);
            right && qq.push(right);
        }
        ans.push(left ? t : t.reverse());
        q.splice(0, q.length, ...qq);
        left ^= 1;
    }
    return ans;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->