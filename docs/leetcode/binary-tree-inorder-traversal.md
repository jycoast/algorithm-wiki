---
comments: true
difficulty: 简单
edit_url: https://github.com/doocs/leetcode/edit/main/solution/0000-0099/0094.Binary%20Tree%20Inorder%20Traversal/README.md
tags:
    - 栈
    - 树
    - 深度优先搜索
    - 二叉树
---

<!-- problem:start -->

# [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal)

## 题目描述

<!-- description:start -->

<p>给定一个二叉树的根节点 <code>root</code> ，返回 <em>它的 <strong>中序</strong>&nbsp;遍历</em> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0000-0099/0094.Binary%20Tree%20Inorder%20Traversal/images/inorder_1.jpg" style="height: 200px; width: 125px;" />
<pre>
<strong>输入：</strong>root = [1,null,2,3]
<strong>输出：</strong>[1,3,2]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>root = []
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = [1]
<strong>输出：</strong>[1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目在范围 <code>[0, 100]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶:</strong>&nbsp;递归算法很简单，你可以通过迭代算法完成吗？</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递归遍历

我们先递归左子树，再访问根节点，接着递归右子树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数，空间复杂度主要取决于递归调用的栈空间。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<Integer> ans = new ArrayList<>();

    public List<Integer> inorderTraversal(TreeNode root) {
        dfs(root);
        return ans;
    }

    private void dfs(TreeNode root) {
        if (root == null) {
            return;
        }
        dfs(root.left);
        ans.add(root.val);
        dfs(root.right);
    }
}
```


```cpp [C++]
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        function<void(TreeNode*)> dfs = [&](TreeNode* root) {
            if (!root) {
                return;
            }
            dfs(root->left);
            ans.push_back(root->val);
            dfs(root->right);
        };
        dfs(root);
        return ans;
    }
};
```
```python [Python]
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        def dfs(root):
            if root is None:
                return
            dfs(root.left)
            ans.append(root.val)
            dfs(root.right)

        ans = []
        dfs(root)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：栈实现非递归遍历

非递归的思路如下：

1. 定义一个栈 $stk$
2. 将树的左节点依次入栈
3. 左节点为空时，弹出栈顶元素并处理
4. 重复 2-3 的操作

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数，空间复杂度主要取决于栈空间。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        Deque<TreeNode> stk = new ArrayDeque<>();
        while (root != null || !stk.isEmpty()) {
            if (root != null) {
                stk.push(root);
                root = root.left;
            } else {
                root = stk.pop();
                ans.add(root.val);
                root = root.right;
            }
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        stack<TreeNode*> stk;
        while (root || stk.size()) {
            if (root) {
                stk.push(root);
                root = root->left;
            } else {
                root = stk.top();
                stk.pop();
                ans.push_back(root->val);
                root = root->right;
            }
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        ans, stk = [], []
        while root or stk:
            if root:
                stk.append(root)
                root = root.left
            else:
                root = stk.pop()
                ans.append(root.val)
                root = root.right
        return ans
```

```ts [TypeScript]
function inorderTraversal(root: TreeNode | null): number[] {
    const stk: TreeNode[] = [];
    const ans: number[] = [];
    while (root || stk.length > 0) {
        if (root) {
            stk.push(root);
            root = root.left;
        } else {
            root = stk.pop();
            ans.push(root.val);
            root = root.right;
        }
    }
    return ans;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三：Morris 实现中序遍历

Morris 遍历无需使用栈，空间复杂度为 $O(1)$。核心思想是：

遍历二叉树节点，

1. 若当前节点 root 的左子树为空，**将当前节点值添加至结果列表 ans** 中，并将当前节点更新为 `root.right`
2. 若当前节点 root 的左子树不为空，找到左子树的最右节点 prev（也即是 root 节点在中序遍历下的前驱节点）：
    - 若前驱节点 prev 的右子树为空，将前驱节点的右子树指向当前节点 root，并将当前节点更新为 `root.left`。
    - 若前驱节点 prev 的右子树不为空，**将当前节点值添加至结果列表 ans** 中，然后将前驱节点右子树指向空（即解除 prev 与 root 的指向关系），并将当前节点更新为 `root.right`。
3. 循环以上步骤，直至二叉树节点为空，遍历结束。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 是二叉树的节点数。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        while (root != null) {
            if (root.left == null) {
                ans.add(root.val);
                root = root.right;
            } else {
                TreeNode prev = root.left;
                while (prev.right != null && prev.right != root) {
                    prev = prev.right;
                }
                if (prev.right == null) {
                    prev.right = root;
                    root = root.left;
                } else {
                    ans.add(root.val);
                    prev.right = null;
                    root = root.right;
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
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        while (root) {
            if (!root->left) {
                ans.push_back(root->val);
                root = root->right;
            } else {
                TreeNode* prev = root->left;
                while (prev->right && prev->right != root) {
                    prev = prev->right;
                }
                if (!prev->right) {
                    prev->right = root;
                    root = root->left;
                } else {
                    ans.push_back(root->val);
                    prev->right = nullptr;
                    root = root->right;
                }
            }
        }
        return ans;
    }
};
```
```ts [TypeScript]
function inorderTraversal(root: TreeNode | null): number[] {
    const ans: number[] = [];
    while (root) {
        if (!root.left) {
            ans.push(root.val);
            root = root.right;
        } else {
            let prev = root.left;
            while (prev.right && prev.right != root) {
                prev = prev.right;
            }
            if (!prev.right) {
                prev.right = root;
                root = root.left;
            } else {
                ans.push(root.val);
                prev.right = null;
                root = root.right;
            }
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        ans = []
        while root:
            if root.left is None:
                ans.append(root.val)
                root = root.right
            else:
                prev = root.left
                while prev.right and prev.right != root:
                    prev = prev.right
                if prev.right is None:
                    prev.right = root
                    root = root.left
                else:
                    ans.append(root.val)
                    prev.right = None
                    root = root.right
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->