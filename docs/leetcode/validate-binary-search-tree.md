---
comments: true
difficulty: 中等

tags:
    - 树
    - 深度优先搜索
    - 二叉搜索树
    - 二叉树
---

<script setup>
// 方法一（递归中序）可视化：root = [2, 1, 3]
// 层序下标：0=2, 1=1, 2=3
const validateBstSteps = [
  { tree: [2, 1, 3], states: [{ id: 0, state: 'cur' }], aux: [{ title: 'prev', values: [null] }, { title: '中序', values: [] }], note: '递归中序遍历开始：当前节点 root = 2，prev 初始为 null。先递归遍历左子树。' },
  { tree: [2, 1, 3], states: [{ id: 0, state: 'path' }, { id: 1, state: 'cur' }], labels: [{ id: 1, text: '①' }], aux: [{ title: 'prev', values: [1] }, { title: '中序', values: [1] }], note: '递归进入左子树，当前节点 1。1 无左孩子，比较 prev(null) < 1 成立 → 访问 1，prev = 1。' },
  { tree: [2, 1, 3], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'done' }], labels: [{ id: 1, text: '①' }], aux: [{ title: 'prev', values: [2] }, { title: '中序', values: [1, 2] }], note: '左子树 1 访问完毕。返回根 2，比较 prev=1 < 2 成立 → 访问 2，prev = 2。' },
  { tree: [2, 1, 3], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }], labels: [{ id: 1, text: '①' }, { id: 0, text: '②' }], aux: [{ title: 'prev', values: [3] }, { title: '中序', values: [1, 2, 3] }], note: '递归右子树，当前节点 3。3 无左孩子，比较 prev=2 < 3 成立 → 访问 3，prev = 3。' },
  { tree: [2, 1, 3], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }], labels: [{ id: 1, text: '①' }, { id: 0, text: '②' }, { id: 2, text: '③' }], aux: [{ title: 'prev', values: [3] }, { title: '中序', values: [1, 2, 3] }], note: '整棵中序序列 [1, 2, 3] 严格升序 → 是有效的二叉搜索树，返回 true ✅' },
]
</script>

<!-- problem:start -->

# [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree)

## 题目描述

<!-- description:start -->

<p>给你一个二叉树的根节点 <code>root</code> ，判断其是否是一个有效的二叉搜索树。</p>

<p><strong>有效</strong> 二叉搜索树定义如下：</p>

<ul>
	<li>节点的左<span data-keyword="subtree">子树</span>只包含<strong> 小于 </strong>当前节点的数。</li>
	<li>节点的右子树只包含 <strong>大于</strong> 当前节点的数。</li>
	<li>所有左子树和右子树自身必须也是二叉搜索树。</li>
</ul>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110830140.png" alt="image-20240823110830140"  />

<pre>
<strong>输入：</strong>root = [2,1,3]
<strong>输出：</strong>true
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110845565.png" alt="image-20240823110845565" style="zoom:80%;" />
<pre>
<strong>输入：</strong>root = [5,1,4,null,null,3,6]
<strong>输出：</strong>false
<strong>解释：</strong>根节点的值是 5 ，但是右子节点的值是 4 。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目范围在<code>[1, 10<sup>4</sup>]</code> 内</li>
	<li><code>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递归

我们可以对二叉树进行递归中序遍历，如果遍历到的结果是严格升序的，那么这棵树就是一个二叉搜索树。

因此，我们使用一个变量 $\textit{prev}$ 来保存上一个遍历到的节点，初始时 $\textit{prev} = -\infty$，然后我们递归遍历左子树，如果左子树不是二叉搜索树，直接返回 $\textit{False}$，否则判断当前节点的值是否大于 $\textit{prev}$，如果不是，返回 $\textit{False}$，否则更新 $\textit{prev}$ 为当前节点的值，然后递归遍历右子树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点个数。

### 可视化演示

> 以 `root = [2, 1, 3]` 为例，演示递归中序遍历判断 BST：`prev` 保存上一个访问节点，每访问一个节点都要求 `prev < 当前值`，最后中序序列严格升序即为有效 BST。蓝色为当前节点，绿色描边为递归路径上的节点，绿色实心为已处理节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="validateBstSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private TreeNode prev;

    public boolean isValidBST(TreeNode root) {
        return dfs(root);
    }

    private boolean dfs(TreeNode root) {
        if (root == null) {
            return true;
        }
        if (!dfs(root.left)) {
            return false;
        }
        if (prev != null && prev.val >= root.val) {
            return false;
        }
        prev = root;
        return dfs(root.right);
    }
}
```

```cpp [C++]
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        TreeNode* prev = nullptr;
        function<bool(TreeNode*)> dfs = [&](TreeNode* root) {
            if (!root) {
                return true;
            }
            if (!dfs(root->left)) {
                return false;
            }
            if (prev && prev->val >= root->val) {
                return false;
            }
            prev = root;
            return dfs(root->right);
        };
        return dfs(root);
    }
};
```

```ts [TypeScript]
function isValidBST(root: TreeNode | null): boolean {
    let prev: TreeNode | null = null;
    const dfs = (root: TreeNode | null): boolean => {
        if (!root) {
            return true;
        }
        if (!dfs(root.left)) {
            return false;
        }
        if (prev && prev.val >= root.val) {
            return false;
        }
        prev = root;
        return dfs(root.right);
    };
    return dfs(root);
}
```

```python [Python]
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def dfs(root: Optional[TreeNode]) -> bool:
            if root is None:
                return True
            if not dfs(root.left):
                return False
            nonlocal prev
            if prev >= root.val:
                return False
            prev = root.val
            return dfs(root.right)

        prev = -inf
        return dfs(root)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->