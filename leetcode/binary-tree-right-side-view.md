---
comments: true
difficulty: 中等

tags:
    - 树
    - 深度优先搜索
    - 广度优先搜索
    - 二叉树
---

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