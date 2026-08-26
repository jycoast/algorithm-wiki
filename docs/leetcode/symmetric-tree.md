---
comments: true
difficulty: 简单
tags:
  - 树
  - 深度优先搜索
  - 广度优先搜索
  - 二叉树
entry: isSymmetric
testcases:
  - input:
      - - 1
        - 2
        - 2
        - 3
        - 4
        - 4
        - 3
    output: true
  - input:
      - - 1
        - 2
        - 2
        - null
        - 3
        - null
        - 3
    output: false
mode: tree
---


<script setup>
// 方法一（递归）可视化：root = [1, 2, 2, 3, 4, 4, 3]
// 层序下标：0=1, 1=2, 2=2, 3=3, 4=4, 5=4, 6=3
const symmetricSteps = [
  { tree: [1, 2, 2, 3, 4, 4, 3], states: [{ id: 0, state: 'cur' }], note: 'dfs(root, root)：从根节点 1 开始，root1 与 root2 值相等（1 == 1）。继续成对比较：root1 的左子树(下标1) vs root2 的右子树(下标2)、root1 的右子树(下标2) vs root2 的左子树(下标1)。' },
  { tree: [1, 2, 2, 3, 4, 4, 3], states: [{ id: 0, state: 'done' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }], note: '递归比较左右子树镜像：dfs(下标1 的 2, 下标2 的 2)。两者值相等（2 == 2），继续比较它们的对称孩子。' },
  { tree: [1, 2, 2, 3, 4, 4, 3], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'hl' }, { id: 6, state: 'hl' }], note: '对称比较：下标1 的左孩子 3（下标3） vs 下标2 的右孩子 3（下标6）。值相等（3 == 3），且均为叶子节点，返回 true。' },
  { tree: [1, 2, 2, 3, 4, 4, 3], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 6, state: 'done' }, { id: 4, state: 'hl' }, { id: 5, state: 'hl' }], note: '对称比较：下标1 的右孩子 4（下标4） vs 下标2 的左孩子 4（下标5）。值相等（4 == 4），且均为叶子节点，返回 true。' },
  { tree: [1, 2, 2, 3, 4, 4, 3], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], note: '两个递归分支均返回 true：根节点 1 的左子树与右子树互为镜像，逐层回溯，返回 true。' },
  { tree: [1, 2, 2, 3, 4, 4, 3], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], note: '所有对称成对节点（1-1、2-2、3-3、4-4）值均相等，且子树结构镜像 → 整棵树轴对称，返回 true ✅。' },
]
</script>

<!-- problem:start -->

# [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree)

## 题目描述

<!-- description:start -->

<p>给你一个二叉树的根节点 <code>root</code> ， 检查它是否轴对称。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105400499.png" alt="image-20240823105400499"  />

<pre>
<strong>输入：</strong>root = [1,2,2,3,4,4,3]
<strong>输出：</strong>true
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105815263.png" alt="image-20240823105815263" style="zoom:80%;" />
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

### 可视化演示

> 以 `root = [1, 2, 2, 3, 4, 4, 3]` 为例，演示递归对称比较：`dfs(root1, root2)` 成对比较，root1 的左 vs root2 的右、root1 的右 vs root2 的左。黄色为正在比较的对称节点，绿色为已确认相等的节点，红色为最终结果。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="symmetricSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
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