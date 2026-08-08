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
// 方法一（递归）可视化：root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]，targetSum = 22
// 层序下标：0=5, 1=4, 2=8, 3=11, 4=null, 5=13, 6=4, 7=7, 8=2, 9=null, 10=null, 11=null, 12=1
const hasPathSumSteps = [
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'cur' }], labels: [{ id: 0, text: 's:17' }], note: '从根节点 5 开始 dfs(root, 22)：s = 22 - 5 = 17。5 不是叶子，先递归左子树' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'cur' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }], note: '递归到左孩子 4：s = 17 - 4 = 13。4 不是叶子，继续递归左子树' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'cur' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }, { id: 3, text: 's:2' }], note: '递归到 4 的左孩子 11：s = 13 - 11 = 2。11 不是叶子，先递归左孩子 7' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }, { id: 7, state: 'cur' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }, { id: 3, text: 's:2' }, { id: 7, text: 's:-5' }], note: '递归到 11 的左孩子 7（叶子）：s = 2 - 7 = -5 ≠ 0，此路不通，返回 false' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }, { id: 7, state: 'done' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }, { id: 3, text: 's:2' }, { id: 7, text: 's:-5' }], note: '7 判断完毕（叶子但 s ≠ 0），标为已处理。回溯到 11，改走右孩子 2' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }, { id: 7, state: 'done' }, { id: 8, state: 'cur' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }, { id: 3, text: 's:2' }, { id: 8, text: 's:0' }], note: '递归到 11 的右孩子 2（叶子）：s = 2 - 2 = 0。叶子且 s = 0 → 返回 true ✅' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }, { id: 8, state: 'mark' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }, { id: 3, text: 's:2' }, { id: 8, text: 's:0' }], note: '命中！路径 5 → 4 → 11 → 2 之和 = 5 + 4 + 11 + 2 = 22 ✅。true 沿调用栈逐层返回，最终 hasPathSum 返回 true' },
]
</script>

<!-- problem:start -->

# [112. 路径总和](https://leetcode.cn/problems/path-sum)

## 题目描述

<!-- description:start -->

<p>给你二叉树的根节点&nbsp;<code>root</code> 和一个表示目标和的整数&nbsp;<code>targetSum</code> 。判断该树中是否存在 <strong>根节点到叶子节点</strong> 的路径，这条路径上所有节点值相加等于目标和&nbsp;<code>targetSum</code> 。如果存在，返回 <code>true</code> ；否则，返回 <code>false</code> 。</p>

<p><strong>叶子节点</strong> 是指没有子节点的节点。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105040156.png" alt="image-20240823105040156" style="zoom:80%;" />

<pre>
<strong>输入：</strong>root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
<strong>输出：</strong>true
<strong>解释：</strong>等于目标和的根节点到叶节点路径如上图所示。
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105054341.png" alt="image-20240823105054341"  />
<pre>
<strong>输入：</strong>root = [1,2,3], targetSum = 5
<strong>输出：</strong>false
<strong>解释：</strong>树中存在两条根节点到叶子节点的路径：
(1 --&gt; 2): 和为 3
(1 --&gt; 3): 和为 4
不存在 sum = 5 的根节点到叶子节点的路径。</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = [], targetSum = 0
<strong>输出：</strong>false
<strong>解释：</strong>由于树是空的，所以不存在根节点到叶子节点的路径。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点的数目在范围 <code>[0, 5000]</code> 内</li>
	<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>
	<li><code>-1000 &lt;= targetSum &lt;= 1000</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递归

从根节点开始，递归地对树进行遍历，并在遍历过程中更新节点的值为从根节点到该节点的路径和。当遍历到叶子节点时，判断该路径和是否等于目标值，如果相等则返回 `true`，否则返回 `false`。

时间复杂度 $O(n)$，其中 $n$ 是二叉树的节点数。对每个节点访问一次。

### 可视化演示

> 以 `root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]`、`targetSum = 22` 为例，演示递归求路径总和：`s` 从 `22` 递减（Java 语义），节点下方标注剩余值 `s`。绿色描边为当前递归路径，红色为命中的叶子节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="hasPathSumSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        return dfs(root, targetSum);
    }

    private boolean dfs(TreeNode root, int s) {
        if (root == null) {
            return false;
        }
        s -= root.val;
        if (root.left == null && root.right == null && s == 0) {
            return true;
        }
        return dfs(root.left, s) || dfs(root.right, s);
    }
}
```


```cpp [C++]
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        function<bool(TreeNode*, int)> dfs = [&](TreeNode* root, int s) -> int {
            if (!root) return false;
            s += root->val;
            if (!root->left && !root->right && s == targetSum) return true;
            return dfs(root->left, s) || dfs(root->right, s);
        };
        return dfs(root, 0);
    }
};
```

```ts [TypeScript]
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if (root === null) {
        return false;
    }
    const { val, left, right } = root;
    if (left === null && right === null) {
        return targetSum - val === 0;
    }
    return hasPathSum(left, targetSum - val) || hasPathSum(right, targetSum - val);
}
```

```python [Python]
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        def dfs(root, s):
            if root is None:
                return False
            s += root.val
            if root.left is None and root.right is None and s == targetSum:
                return True
            return dfs(root.left, s) or dfs(root.right, s)

        return dfs(root, 0)
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->