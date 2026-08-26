---
comments: true
difficulty: 简单
tags:
  - 树
  - 深度优先搜索
  - 广度优先搜索
  - 二叉树
entry: maxDepth
testcases:
  - input:
      - - 3
        - 9
        - 20
        - null
        - null
        - 15
        - 7
    output: 3
  - input:
      - - 1
        - null
        - 2
    output: 2
mode: tree
---


<script setup>
// 方法一（递归）可视化：root = [3, 9, 20, null, null, 15, 7]
// 层序下标：0=3, 1=9, 2=20, 3=null, 4=null, 5=15, 6=7
const maxDepthSteps = [
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'cur' }], labels: [{ id: 1, text: 'd:1', state: 'done' }], note: '递归到左孩子 9（下标1，叶子）：l = maxDepth(null) = 0，r = 0，深度 = 1 + max(0, 0) = 1' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'cur' }], labels: [{ id: 1, text: 'd:1', state: 'done' }, { id: 5, text: 'd:1', state: 'done' }], note: '递归到右子树节点 15（下标5，叶子）：l = 0，r = 0，深度 = 1' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'cur' }], labels: [{ id: 1, text: 'd:1', state: 'done' }, { id: 5, text: 'd:1', state: 'done' }, { id: 6, text: 'd:1', state: 'done' }], note: '递归到节点 7（下标6，叶子）：l = 0，r = 0，深度 = 1' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 2, state: 'cur' }], labels: [{ id: 1, text: 'd:1', state: 'done' }, { id: 5, text: 'd:1', state: 'done' }, { id: 6, text: 'd:1', state: 'done' }, { id: 2, text: 'd:2', state: 'done' }], note: '节点 20（下标2）：l = maxDepth(15) = 1，r = maxDepth(7) = 1，深度 = 1 + max(1, 1) = 2' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 0, state: 'cur' }], labels: [{ id: 0, text: 'd:3', state: 'done' }, { id: 1, text: 'd:1', state: 'done' }, { id: 2, text: 'd:2', state: 'done' }, { id: 5, text: 'd:1', state: 'done' }, { id: 6, text: 'd:1', state: 'done' }], note: '根 3（下标0）：l = maxDepth(9) = 1，r = maxDepth(20) = 2，深度 = 1 + max(1, 2) = 3' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], labels: [{ id: 0, text: 'd:3', state: 'mark' }], note: '最大深度 = 根节点深度 = 3 ✅' },
]
</script>

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

### 可视化演示

> 以 `root = [3, 9, 20, null, null, 15, 7]` 为例，演示递归求二叉树最大深度：自底向上计算每个节点的深度，节点下方标注 `d` 表示该子树的最大深度。蓝色为当前计算节点，红色标注最终结果。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="maxDepthSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
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