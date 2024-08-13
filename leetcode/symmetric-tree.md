---
comments: true
difficulty: 简单
edit_url: https://github.com/doocs/leetcode/edit/main/solution/0100-0199/0101.Symmetric%20Tree/README.md
tags:
    - 树
    - 深度优先搜索
    - 广度优先搜索
    - 二叉树
---

<!-- problem:start -->

# [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree)

## 题目描述

<!-- description:start -->

<p>给你一个二叉树的根节点 <code>root</code> ， 检查它是否轴对称。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0100-0199/0101.Symmetric%20Tree/images/1698026966-JDYPDU-image.png" style="width: 354px; height: 291px;" />
<pre>
<strong>输入：</strong>root = [1,2,2,3,4,4,3]
<strong>输出：</strong>true
</pre>

<p><strong>示例 2：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0100-0199/0101.Symmetric%20Tree/images/1698027008-nPFLbM-image.png" style="width: 308px; height: 258px;" />
<pre>
<strong>输入：</strong>root = [1,2,2,null,3,null,3]
<strong>输出：</strong>false
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目在范围 <code>[1, 1000]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶：</strong>你可以运用递归和迭代两种方法解决这个问题吗？</p>

<!-- description:end -->


<!-- solution:start -->

## 方法一：递归

我们设计一个函数 $dfs(root1, root2)$，用于判断两个二叉树是否对称。答案即为 $dfs(root, root)$。

函数 $dfs(root1, root2)$ 的逻辑如下：

-   如果 $root1$ 和 $root2$ 都为空，则两个二叉树对称，返回 `true`；
-   如果 $root1$ 和 $root2$ 中只有一个为空，或者 $root1.val \neq root2.val$，则两个二叉树不对称，返回 `false`；
-   否则，判断 $root1$ 的左子树和 $root2$ 的右子树是否对称，以及 $root1$ 的右子树和 $root2$ 的左子树是否对称，这里使用了递归。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return dfs(root, root);
    }

    private boolean dfs(TreeNode root1, TreeNode root2) {
        if (root1 == null && root2 == null) {
            return true;
        }
        if (root1 == null || root2 == null || root1.val != root2.val) {
            return false;
        }
        return dfs(root1.left, root2.right) && dfs(root1.right, root2.left);
    }
}
```

```cpp [C++]
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        function<bool(TreeNode*, TreeNode*)> dfs = [&](TreeNode* root1, TreeNode* root2) -> bool {
            if (!root1 && !root2) return true;
            if (!root1 || !root2 || root1->val != root2->val) return false;
            return dfs(root1->left, root2->right) && dfs(root1->right, root2->left);
        };
        return dfs(root, root);
    }
};
```

```ts [TypeScript]
const dfs = (root1: TreeNode | null, root2: TreeNode | null) => {
    if (root1 == root2) {
        return true;
    }
    if (root1 == null || root2 == null || root1.val != root2.val) {
        return false;
    }
    return dfs(root1.left, root2.right) && dfs(root1.right, root2.left);
};

function isSymmetric(root: TreeNode | null): boolean {
    return dfs(root.left, root.right);
}
```

```python [Python]
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        def dfs(root1, root2):
            if root1 is None and root2 is None:
                return True
            if root1 is None or root2 is None or root1.val != root2.val:
                return False
            return dfs(root1.left, root2.right) and dfs(root1.right, root2.left)

        return dfs(root, root)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->