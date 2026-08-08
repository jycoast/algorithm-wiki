---
comments: true
difficulty: 简单

tags:
    - 树
    - 深度优先搜索
    - 广度优先搜索
    - 二叉树
---

<script setup>
// 方法一（递归，先交换再递归）可视化：root = [4, 2, 7, 1, 3, 6, 9]
// 层序下标：0=4, 1=2, 2=7, 3=1, 4=3, 5=6, 6=9
const invertRecSteps = [
  { tree: [4, 2, 7, 1, 3, 6, 9], states: [{ id: 0, state: 'cur' }], note: '初始树。从根节点 4 开始 dfs：先交换当前节点的左右孩子，再递归处理子树' },
  { tree: [4, 7, 2, 1, 3, 6, 9], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }], note: '交换根 4 的左右孩子：左 2 ↔ 右 7 → 层序 [4, 7, 2, 1, 3, 6, 9]。随后递归左子树（当前下标 1，值 7）' },
  { tree: [4, 7, 2, 1, 3, 6, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }, { id: 2, state: 'done' }], note: '递归到左孩子 7（下标 1）。它的左右孩子在层序下标 3、4（值 1、3），交换之' },
  { tree: [4, 7, 2, 3, 1, 6, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }, { id: 2, state: 'done' }, { id: 3, state: 'hl' }, { id: 4, state: 'hl' }], note: '交换 7 的左右孩子：1 ↔ 3 → 层序 [4, 7, 2, 3, 1, 6, 9]。7 的孩子都是叶子，递归返回' },
  { tree: [4, 7, 2, 3, 1, 6, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }], note: '回溯到根，递归右子树 2（下标 2）。它的孩子在层序下标 5、6（值 6、9），交换之' },
  { tree: [4, 7, 2, 3, 1, 9, 6], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }, { id: 5, state: 'hl' }, { id: 6, state: 'hl' }], note: '交换 2 的左右孩子：6 ↔ 9 → 层序 [4, 7, 2, 3, 1, 9, 6]。2 的孩子都是叶子，递归返回' },
  { tree: [4, 7, 2, 9, 6, 3, 1], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], note: '整棵树翻转完成 ✅。最终层序 [4, 7, 2, 9, 6, 3, 1]：根 4 的左右孩子为 7、2，7 的孩子为 9、6，2 的孩子为 3、1' },
]
// 方法二（递归后序，先递归再交换）可视化
const invertPostSteps = [
  { tree: [4, 2, 7, 1, 3, 6, 9], states: [{ id: 0, state: 'cur' }], note: '后序递归：先递归翻转左右子树，最后再交换当前节点的左右孩子。从根 4 开始，先递归左子树（下标 1，值 2）' },
  { tree: [4, 2, 7, 1, 3, 6, 9], states: [{ id: 0, state: 'path' }, { id: 1, state: 'cur' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }], note: '左子树 2：先递归左右孩子 1、3（均为叶子）并返回。此时交换 2 的孩子 → 下标 3、4 互换' },
  { tree: [4, 2, 7, 3, 1, 6, 9], states: [{ id: 0, state: 'path' }, { id: 1, state: 'done' }, { id: 3, state: 'hl' }, { id: 4, state: 'hl' }], note: '左子树 2 翻转完成（孩子变为 3、1）→ 层序 [4, 2, 7, 3, 1, 6, 9]。回到根，递归右子树 7（下标 2）' },
  { tree: [4, 2, 7, 3, 1, 6, 9], states: [{ id: 0, state: 'path' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], note: '右子树 7：先递归左右孩子 6、9（均为叶子）并返回。此时交换 7 的孩子 → 下标 5、6 互换' },
  { tree: [4, 2, 7, 3, 1, 9, 6], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], note: '右子树 7 翻转完成（孩子变为 9、6）→ 层序 [4, 2, 7, 3, 1, 9, 6]。左右子树均已翻转，最后交换根 4 的孩子：下标 1（2）↔ 下标 2（7）' },
  { tree: [4, 7, 2, 9, 6, 3, 1], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], note: '根交换完成，整棵树翻转成功 ✅。最终层序 [4, 7, 2, 9, 6, 3, 1]' },
]
</script>

<!-- problem:start -->

# [226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree)

## 题目描述

<!-- description:start -->

<p>给你一棵二叉树的根节点 <code>root</code> ，翻转这棵二叉树，并返回其根节点。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110742279.png" alt="image-20240823110742279"  />

<pre>
<strong>输入：</strong>root = [4,2,7,1,3,6,9]
<strong>输出：</strong>[4,7,2,9,6,3,1]
</pre>

<p><strong>示例 2：</strong></p>

<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110803139.png" alt="image-20240823110803139"  />

<pre>
<strong>输入：</strong>root = [2,1,3]
<strong>输出：</strong>[2,3,1]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = []
<strong>输出：</strong>[]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目范围在 <code>[0, 100]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递归

递归的思路很简单，就是交换当前节点的左右子树，然后递归地交换当前节点的左右子树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点个数。

### 可视化演示

> 以 `root = [4, 2, 7, 1, 3, 6, 9]` 为例，演示「先交换再递归」的前序式翻转：每步先对调当前节点的左右孩子，再递归处理子树。蓝色为当前交换的父节点，黄色为被交换的两个孩子。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="invertRecSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public TreeNode invertTree(TreeNode root) {
        dfs(root);
        return root;
    }

    private void dfs(TreeNode root) {
        if (root == null) {
            return;
        }
        TreeNode t = root.left;
        root.left = root.right;
        root.right = t;
        dfs(root.left);
        dfs(root.right);
    }
}
```

```cpp [C++]
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        function<void(TreeNode*)> dfs = [&](TreeNode* root) {
            if (!root) {
                return;
            }
            swap(root->left, root->right);
            dfs(root->left);
            dfs(root->right);
        };
        dfs(root);
        return root;
    }
};
```

```ts [TypeScript]
function invertTree(root: TreeNode | null): TreeNode | null {
    const dfs = (root: TreeNode | null) => {
        if (root === null) {
            return;
        }
        [root.left, root.right] = [root.right, root.left];
        dfs(root.left);
        dfs(root.right);
    };
    dfs(root);
    return root;
}
```

```python [Python]
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        def dfs(root):
            if root is None:
                return
            root.left, root.right = root.right, root.left
            dfs(root.left)
            dfs(root.right)

        dfs(root)
        return root
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：递归（后序）

与方法一思路一致，但顺序相反：先递归地翻转左右子树，最后再交换当前节点的左右孩子。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点个数。

### 可视化演示

> 以 `root = [4, 2, 7, 1, 3, 6, 9]` 为例，演示「先递归再交换」的后序式翻转：先递归翻转左右子树，最后才交换当前节点的左右孩子。蓝色为当前交换的父节点，黄色为被交换的两个孩子。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="invertPostSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        TreeNode l = invertTree(root.left);
        TreeNode r = invertTree(root.right);
        root.left = r;
        root.right = l;
        return root;
    }
}
```

```cpp [C++]
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) {
            return root;
        }
        TreeNode* l = invertTree(root->left);
        TreeNode* r = invertTree(root->right);
        root->left = r;
        root->right = l;
        return root;
    }
};
```

```ts [TypeScript]
function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) {
        return root;
    }
    const l = invertTree(root.left);
    const r = invertTree(root.right);
    root.left = r;
    root.right = l;
    return root;
}
```

```python [Python]
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if root is None:
            return None
        l, r = self.invertTree(root.left), self.invertTree(root.right)
        root.left, root.right = r, l
        return root
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->