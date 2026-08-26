---
comments: true
difficulty: 中等
tags:
  - 树
  - 深度优先搜索
  - 广度优先搜索
  - 二叉树
entry: rightSideView
testcases:
  - input:
      - - 1
        - 2
        - 3
        - null
        - 5
        - null
        - 4
    output:
      - 1
      - 3
      - 4
  - input:
      - - 1
        - null
        - 3
    output:
      - 1
      - 3
  - input:
      - []
    output: []
mode: tree
---


<script setup>
// 方法一（BFS）可视化：root = [1, 2, 3, null, 5, null, 4]
// 层序下标：0=1, 1=2, 2=3, 3=null, 4=5, 5=null, 6=4
const rightSideViewBfsSteps = [
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'mark' }], aux: [{ title: '队列 q', values: [1], marker: 0, markerLabel: '右' }], note: '第一层：q = [1]，取队尾（最右）节点 1 → ans = [1]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'done' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }], aux: [{ title: '队列 q', values: [2, 3], marker: 1, markerLabel: '右' }], note: '出队 1，左孩子 2、右孩子 3 入队 → q = [2, 3]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 1, state: 'done' }, { id: 2, state: 'mark' }], aux: [{ title: '队列 q', values: [2, 3], marker: 1, markerLabel: '右' }], note: '第二层：取队尾（最右）节点 3 → ans = [1, 3]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 4, state: 'hl' }, { id: 6, state: 'hl' }], aux: [{ title: '队列 q', values: [5, 4], marker: 1, markerLabel: '右' }], note: '出队 2、3，左孩子 5、右孩子 4 入队 → q = [5, 4]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 4, state: 'done' }, { id: 6, state: 'mark' }], aux: [{ title: '队列 q', values: [5, 4], marker: 1, markerLabel: '右' }], note: '第三层：取队尾（最右）节点 4 → ans = [1, 3, 4]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'done' }, { id: 2, state: 'mark' }, { id: 4, state: 'done' }, { id: 6, state: 'mark' }], aux: [{ title: '队列 q', values: [] }], note: '出队 5、4，无孩子入队，q 为空，遍历结束。右视图 = [1, 3, 4] ✅' },
]
// 方法二（DFS）可视化：root = [1, 2, 3, null, 5, null, 4]
const rightSideViewDfsSteps = [
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'mark' }], labels: [{ id: 0, text: 'd:0' }], note: 'dfs(1, depth=0)：depth == ans.size() == 0，将 1 加入 ans → ans = [1]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'path' }, { id: 2, state: 'mark' }], labels: [{ id: 0, text: 'd:0' }, { id: 2, text: 'd:1' }], note: '先遍历右子树：dfs(3, depth=1)：depth == ans.size() == 1，将 3 加入 ans → ans = [1, 3]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'path' }, { id: 2, state: 'path' }], labels: [{ id: 0, text: 'd:0' }, { id: 2, text: 'd:1' }], note: 'dfs(3 的右孩子 null) 直接返回。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'path' }, { id: 2, state: 'path' }, { id: 6, state: 'mark' }], labels: [{ id: 0, text: 'd:0' }, { id: 2, text: 'd:1' }, { id: 6, text: 'd:2' }], note: '再遍历 3 的左孩子：dfs(4, depth=2)：depth == ans.size() == 2，将 4 加入 ans → ans = [1, 3, 4]。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 4, state: 'path' }], labels: [{ id: 0, text: 'd:0' }, { id: 1, text: 'd:1' }, { id: 4, text: 'd:2' }], note: '回溯后遍历左子树：dfs(2, depth=1)、dfs(5, depth=2) 的 depth 均小于 ans.size()=3，不再加入 ans。' },
  { tree: [1, 2, 3, null, 5, null, 4], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'done' }, { id: 2, state: 'mark' }, { id: 4, state: 'done' }, { id: 6, state: 'mark' }], labels: [{ id: 0, text: 'd:0' }, { id: 1, text: 'd:1' }, { id: 2, text: 'd:1' }, { id: 4, text: 'd:2' }, { id: 6, text: 'd:2' }], note: '每层第一个访问到的节点即最右节点。右视图 = [1, 3, 4] ✅' },
]
</script>

<!-- problem:start -->

# [199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view)

## 题目描述

<!-- description:start -->

<p>给定一个二叉树的 <strong>根节点</strong> <code>root</code>，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。</p>

<p> </p>

<p><strong>示例 1:</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110246767.png" alt="image-20240823110246767"  />

<pre>
<strong>输入:</strong> [1,2,3,null,5,null,4]
<strong>输出:</strong> [1,3,4]
</pre>

<p><strong>示例 2:</strong></p>

<pre>
<strong>输入:</strong> [1,null,3]
<strong>输出:</strong> [1,3]
</pre>

<p><strong>示例 3:</strong></p>

<pre>
<strong>输入:</strong> []
<strong>输出:</strong> []
</pre>

<p> </p>

<p><strong>提示:</strong></p>

<ul>
	<li>二叉树的节点个数的范围是 <code>[0,100]</code></li>
	<li><meta charset="UTF-8" /><code>-100 <= Node.val <= 100</code> </li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：BFS

使用 BFS 层序遍历二叉树，每层最后一个节点即为该层的右视图节点。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树节点个数。

### 可视化演示

> 以 `root = [1, 2, 3, null, 5, null, 4]` 为例，演示 BFS 右视图：每层队列的队尾（最右）节点即为该层右视图节点，收入 `ans`。黄色为本层待处理节点，红色为已收入 `ans` 的最右节点，`q` 面板中的 ▼ 指向当前层最右元素。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="rightSideViewBfsSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        if (root == null) {
            return ans;
        }
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            ans.add(q.peekLast().val);
            for (int n = q.size(); n > 0; --n) {
                TreeNode node = q.poll();
                if (node.left != null) {
                    q.offer(node.left);
                }
                if (node.right != null) {
                    q.offer(node.right);
                }
            }
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> ans;
        if (!root) {
            return ans;
        }
        queue<TreeNode*> q{{root}};
        while (!q.empty()) {
            ans.emplace_back(q.back()->val);
            for (int n = q.size(); n; --n) {
                TreeNode* node = q.front();
                q.pop();
                if (node->left) {
                    q.push(node->left);
                }
                if (node->right) {
                    q.push(node->right);
                }
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function rightSideView(root: TreeNode | null): number[] {
    if (!root) {
        return [];
    }
    let q = [root];
    const ans: number[] = [];
    while (q.length) {
        const nextq: TreeNode[] = [];
        ans.push(q.at(-1)!.val);
        for (const { left, right } of q) {
            if (left) {
                nextq.push(left);
            }
            if (right) {
                nextq.push(right);
            }
        }
        q = nextq;
    }
    return ans;
}
```



```python [Python]
class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        ans = []
        if root is None:
            return ans
        q = deque([root])
        while q:
            ans.append(q[-1].val)
            for _ in range(len(q)):
                node = q.popleft()
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：DFS

使用 DFS 深度优先遍历二叉树，每次先遍历右子树，再遍历左子树，这样每层第一个遍历到的节点即为该层的右视图节点。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树节点个数。

### 可视化演示

> 以 `root = [1, 2, 3, null, 5, null, 4]` 为例，演示 DFS 右视图：先右后左遍历，每层第一个访问到的节点即为最右节点，`depth == ans.size()` 时加入 `ans`。绿色描边为当前递归路径，红色为新加入 `ans` 的节点，节点下方标注其深度。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="rightSideViewDfsSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<Integer> ans = new ArrayList<>();

    public List<Integer> rightSideView(TreeNode root) {
        dfs(root, 0);
        return ans;
    }

    private void dfs(TreeNode node, int depth) {
        if (node == null) {
            return;
        }
        if (depth == ans.size()) {
            ans.add(node.val);
        }
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> ans;
        function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int depth) {
            if (!node) {
                return;
            }
            if (depth == ans.size()) {
                ans.emplace_back(node->val);
            }
            dfs(node->right, depth + 1);
            dfs(node->left, depth + 1);
        };
        dfs(root, 0);
        return ans;
    }
};
```

```ts [TypeScript]
function rightSideView(root: TreeNode | null): number[] {
    const ans = [];
    const dfs = (node: TreeNode | null, depth: number) => {
        if (!node) {
            return;
        }
        if (depth == ans.length) {
            ans.push(node.val);
        }
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    };
    dfs(root, 0);
    return ans;
}
```

```python [Python]
class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        def dfs(node, depth):
            if node is None:
                return
            if depth == len(ans):
                ans.append(node.val)
            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)

        ans = []
        dfs(root, 0)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->