---
comments: true
difficulty: 简单

tags:
    - 树
    - 深度优先搜索
    - 广度优先搜索
    - 二叉树
---

<!-- problem:start -->

# [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree)

## 题目描述

<!-- description:start -->

<p>给定一个二叉树 <code>root</code> ，返回其最大深度。</p>

<p>二叉树的 <strong>最大深度</strong> 是指从根节点到最远叶子节点的最长路径上的节点数。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

![image-20240823105915372](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105915372.png)

<p>&nbsp;</p>

<pre>
<b>输入：</b>root = [3,9,20,null,null,15,7]
<b>输出：</b>3
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<b>输入：</b>root = [1,null,2]
<b>输出：</b>2
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点的数量在&nbsp;<code>[0, 10<sup>4</sup>]</code>&nbsp;区间内。</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：递归

递归遍历左右子树，求左右子树的最大深度，然后取最大值加 $1$ 即可。

时间复杂度 $O(n)$，其中 $n$ 是二叉树的节点数。每个节点在递归中只被遍历一次。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int l = maxDepth(root.left);
        int r = maxDepth(root.right);
        return 1 + Math.max(l, r);
    }
}
```

```cpp [C++]
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        int l = maxDepth(root->left), r = maxDepth(root->right);
        return 1 + max(l, r);
    }
};
```

```ts [TypeScript]
function maxDepth(root: TreeNode | null): number {
    if (root === null) {
        return 0;
    }
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

```python [Python]
class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        if root is None:
            return 0
        l, r = self.maxDepth(root.left), self.maxDepth(root.right)
        return 1 + max(l, r)
```
:::

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->