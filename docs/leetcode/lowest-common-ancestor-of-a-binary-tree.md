---
comments: true
difficulty: 中等
tags:
  - 树
  - 深度优先搜索
  - 二叉树
entry: lowestCommonAncestor
testcases:
  - input:
      - - 3
        - 5
        - 1
        - 6
        - 2
        - 0
        - 8
        - null
        - null
        - 7
        - 4
      - 5
      - 1
    output: 3
  - input:
      - - 3
        - 5
        - 1
        - 6
        - 2
        - 0
        - 8
        - null
        - null
        - 7
        - 4
      - 5
      - 4
    output: 5
  - input:
      - - 1
        - 2
      - 1
      - 2
    output: 1
mode: tree-lca
---


<script setup>
// 方法一（递归）可视化：root = [3,5,1,6,2,0,8,null,null,7,4]，p = 5，q = 1
// 层序下标：0=3, 1=5, 2=1, 3=6, 4=2, 5=0, 6=8, 7=null, 8=null, 9=7, 10=4
const lcaSteps = [
  { tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], states: [{ id: 0, state: 'cur' }], note: '从根节点 3 开始递归。root 不为空，且不等于 p=5、q=1，先递归左子树' },
  { tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }], note: '递归到左孩子 5：root == p → 返回 5（不再深入 5 的子树），left = 5' },
  { tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], states: [{ id: 0, state: 'done' }, { id: 1, state: 'mark' }, { id: 2, state: 'cur' }], note: '回到 3，再递归右子树：递归到右孩子 1：root == q → 返回 1（不再深入），right = 1' },
  { tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], states: [{ id: 0, state: 'cur' }, { id: 1, state: 'mark' }, { id: 2, state: 'mark' }], note: '回到 3：left=5 与 right=1 均非空 → p、q 分别在左右子树，当前节点 3 即最近公共祖先 ✅' },
]
</script>

<!-- problem:start -->

# [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree)

## 题目描述

<!-- description:start -->

<p>给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。</p>

<p><a href="https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin" target="_blank">百度百科</a>中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（<strong>一个节点也可以是它自己的祖先</strong>）。”</p>

<p> </p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110021899.png" alt="image-20240823110021899" style="zoom:150%;" />

<pre>
<strong>输入：</strong>root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
<strong>输出：</strong>3
<strong>解释：</strong>节点 <code>5 </code>和节点 <code>1 </code>的最近公共祖先是节点 <code>3 。</code>
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110034673.png" alt="image-20240823110034673" style="zoom:150%;" />
<pre>
<strong>输入：</strong>root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
<strong>输出：</strong>5
<strong>解释：</strong>节点 <code>5 </code>和节点 <code>4 </code>的最近公共祖先是节点 <code>5 。</code>因为根据定义最近公共祖先节点可以为节点本身。
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = [1,2], p = 1, q = 2
<strong>输出：</strong>1
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目在范围 <code>[2, 10<sup>5</sup>]</code> 内。</li>
	<li><code>-10<sup>9</sup> <= Node.val <= 10<sup>9</sup></code></li>
	<li>所有 <code>Node.val</code> <code>互不相同</code> 。</li>
	<li><code>p != q</code></li>
	<li><code>p</code> 和 <code>q</code> 均存在于给定的二叉树中。</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：递归

我们递归遍历二叉树：

如果当前节点为空或者等于 $p$ 或者 $q$，则返回当前节点；

否则，我们递归遍历左右子树，将返回的结果分别记为 $left$ 和 $right$。如果 $left$ 和 $right$ 都不为空，则说明 $p$ 和 $q$ 分别在左右子树中，因此当前节点即为最近公共祖先；如果 $left$ 和 $right$ 中只有一个不为空，返回不为空的那个。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树节点个数。

### 可视化演示

> 以 `root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]`、`p = 5`、`q = 1` 为例，演示递归求最近公共祖先：递归到左孩子 5 时命中 `p` 返回，递归到右孩子 1 时命中 `q` 返回，左右均非空则当前节点即为答案。红色为 `p`/`q` 命中节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="lcaSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }
        var left = lowestCommonAncestor(root.left, p, q);
        var right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) {
            return root;
        }
        return left == null ? right : left;
    }
}
```


```cpp [C++]
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (root == nullptr || root == p || root == q) {
            return root;
        }
        auto left = lowestCommonAncestor(root->left, p, q);
        auto right = lowestCommonAncestor(root->right, p, q);
        if (left && right) {
            return root;
        }
        return left ? left : right;
    }
};
```

```ts [TypeScript]
function lowestCommonAncestor(
    root: TreeNode | null,
    p: TreeNode | null,
    q: TreeNode | null,
): TreeNode | null {
    if (!root || root === p || root === q) {
        return root;
    }
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    return left && right ? root : left || right;
}
```

```python [Python]
class Solution:
    def lowestCommonAncestor(
        self, root: "TreeNode", p: "TreeNode", q: "TreeNode"
    ) -> "TreeNode":
        if root in (None, p, q):
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        return root if left and right else (left or right)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->