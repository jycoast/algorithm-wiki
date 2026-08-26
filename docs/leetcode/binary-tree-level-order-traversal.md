---
comments: true
difficulty: 中等
tags:
  - 树
  - 广度优先搜索
  - 二叉树
entry: levelOrder
testcases:
  - input:
      - - 3
        - 9
        - 20
        - null
        - null
        - 15
        - 7
    output:
      - - 3
      - - 9
        - 20
      - - 15
        - 7
  - input:
      - - 1
    output:
      - - 1
  - input:
      - []
    output: []
mode: tree
---


<script setup>
// 方法一（BFS 层序）可视化：root = [3,9,20,null,null,15,7]
// 层序下标：0=3, 1=9, 2=20, 3=null, 4=null, 5=15, 6=7
const levelOrderSteps = [
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'cur' }], aux: [{ title: '队列 q', values: [3] }], note: '初始：q = [3]，root 入队。开始第一层遍历' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }], aux: [{ title: '队列 q', values: [9, 20] }], note: '出队 3 → t = [3]。左孩子 9、右孩子 20 入队，q = [9, 20]。本层结束，ans = [[3]]' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }, { id: 2, state: 'done' }], aux: [{ title: '队列 q', values: [20] }], note: '第二层：出队 9 → t = [9]。9 的孩子均为 null，不入队' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }], aux: [{ title: '队列 q', values: [15, 7] }], note: '出队 20 → t = [9, 20]。左孩子 15、右孩子 7 入队，q = [15, 7]。本层结束，ans = [[3], [9, 20]]' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'cur' }], aux: [{ title: '队列 q', values: [7] }], note: '第三层：出队 15 → t = [15]。15 的孩子均为 null' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'cur' }], aux: [{ title: '队列 q', values: [] }], note: '出队 7 → t = [15, 7]。队列为空，遍历结束。ans = [[3], [9, 20], [15, 7]] ✅' },
]
</script>

<!-- problem:start -->

# [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal)

## 题目描述

<!-- description:start -->

<p>给你二叉树的根节点 <code>root</code> ，返回其节点值的 <strong>层序遍历</strong> 。 （即逐层地，从左到右访问所有节点）。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105950521.png" alt="image-20240823105950521"  />
<pre>
<strong>输入：</strong>root = [3,9,20,null,null,15,7]
<strong>输出：</strong>[[3],[9,20],[15,7]]
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
	<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：BFS

我们可以使用 BFS 的方法来解决这道题。首先将根节点入队，然后不断地进行以下操作，直到队列为空：

-   遍历当前队列中的所有节点，将它们的值存储到一个临时数组 $t$ 中，然后将它们的孩子节点入队。
-   将临时数组 $t$ 存储到答案数组中。

最后返回答案数组即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点个数。

### 可视化演示

> 以 `root = [3, 9, 20, null, null, 15, 7]` 为例，演示 BFS 层序遍历：队列 `q` 存放当前层节点，逐层出队并入队孩子节点。蓝色为当前出队节点，黄色为本层入队的节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="levelOrderSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) {
            return ans;
        }
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
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
            ans.add(t);
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> ans;
        if (!root) return ans;
        queue<TreeNode*> q{{root}};
        while (!q.empty()) {
            vector<int> t;
            for (int n = q.size(); n; --n) {
                auto node = q.front();
                q.pop();
                t.push_back(node->val);
                if (node->left) {
                    q.push(node->left);
                }
                if (node->right) {
                    q.push(node->right);
                }
            }
            ans.push_back(t);
        }
        return ans;
    }
};
```

```ts [TypeScript]
function levelOrder(root: TreeNode | null): number[][] {
    const ans: number[][] = [];
    if (!root) {
        return ans;
    }
    const q: TreeNode[] = [root];
    while (q.length) {
        const t: number[] = [];
        const qq: TreeNode[] = [];
        for (const { val, left, right } of q) {
            t.push(val);
            left && qq.push(left);
            right && qq.push(right);
        }
        ans.push(t);
        q.splice(0, q.length, ...qq);
    }
    return ans;
}
```

```python [Python]
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        ans = []
        if root is None:
            return ans
        q = deque([root])
        while q:
            t = []
            for _ in range(len(q)):
                node = q.popleft()
                t.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            ans.append(t)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->