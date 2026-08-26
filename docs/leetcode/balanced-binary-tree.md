---
comments: true
difficulty: 简单
tags:
  - 树
  - 深度优先搜索
  - 二叉树
entry: isBalanced
testcases:
  - input:
      - - 3
        - 9
        - 20
        - null
        - null
        - 15
        - 7
    output: true
  - input:
      - - 1
        - 2
        - 2
        - 3
        - 3
        - null
        - null
        - 4
        - 4
    output: false
  - input:
      - []
    output: true
mode: tree
---


<script setup>
// 方法一（自底向上递归）可视化：root = [3, 9, 20, null, null, 15, 7]
// 层序下标：0=3, 1=9, 2=20, 3=null, 4=null, 5=15, 6=7
const balancedSteps = [
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'cur' }], note: '自底向上计算高度：height(9)（下标1）。节点 9 左右孩子均为 null → l=0, r=0，返回 h = 1 + max(0, 0) = 1。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'cur' }], labels: [{ id: 1, text: 'h:1' }], note: '节点 9 高度确定：h=1（绿色，标签 h:1）。继续计算 height(15)（下标5）：叶子节点 → l=0, r=0，h = 1。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'cur' }], labels: [{ id: 1, text: 'h:1' }, { id: 5, text: 'h:1' }], note: '节点 15 高度确定：h=1。继续计算 height(7)（下标6）：叶子节点 → l=0, r=0，h = 1。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 2, state: 'cur' }], labels: [{ id: 1, text: 'h:1' }, { id: 5, text: 'h:1' }, { id: 6, text: 'h:1' }, { id: 2, text: 'h:2' }], note: '节点 7 高度确定：h=1。计算 height(20)（下标2）：l=h(15)=1, r=h(7)=1，|1-1|=0 ≤ 1，返回 h = 1 + max(1, 1) = 2。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 1, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 2, state: 'done' }, { id: 0, state: 'cur' }], labels: [{ id: 1, text: 'h:1' }, { id: 5, text: 'h:1' }, { id: 6, text: 'h:1' }, { id: 2, text: 'h:2' }, { id: 0, text: 'h:3' }], note: '节点 20 高度确定：h=2。计算 height(3)（下标0）：l=h(9)=1, r=h(20)=2，|1-2|=1 ≤ 1，返回 h = 1 + max(1, 2) = 3。' },
  { tree: [3, 9, 20, null, null, 15, 7], states: [{ id: 0, state: 'mark' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }], labels: [{ id: 1, text: 'h:1' }, { id: 5, text: 'h:1' }, { id: 6, text: 'h:1' }, { id: 2, text: 'h:2' }, { id: 0, text: 'h:3' }], note: '根节点 3 高度 h=3。自底向上全程未出现 -1，且每个节点 |l-r| ≤ 1 → 是平衡二叉树，返回 true ✅。' },
]
</script>

<!-- problem:start -->

# [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree)



<!-- description:start -->

<p>给定一个二叉树，判断它是否是 <span data-keyword="height-balanced">平衡二叉树</span> &nbsp;</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110443846.png" alt="image-20240823110443846"  />

<pre>
<strong>输入：</strong>root = [3,9,20,null,null,15,7]
<strong>输出：</strong>true
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110500151.png" alt="image-20240823110500151"  />

<pre>
<strong>输入：</strong>root = [1,2,2,3,3,null,null,4,4]
<strong>输出：</strong>false
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = []
<strong>输出：</strong>true
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中的节点数在范围 <code>[0, 5000]</code> 内</li>
	<li><code>-10<sup>4</sup> &lt;= Node.val &lt;= 10<sup>4</sup></code></li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：自底向上的递归

定义函数 $height(root)$ 计算二叉树的高度，处理逻辑如下：

-   如果二叉树 $root$ 为空，返回 $0$。
-   否则，递归计算左右子树的高度，分别为 $l$ 和 $r$。如果 $l$ 或 $r$ 为 $-1$，或者 $l$ 和 $r$ 的差的绝对值大于 $1$，则返回 $-1$，否则返回 $max(l, r) + 1$。

那么，如果函数 $height(root)$ 返回的是 $-1$，则说明二叉树 $root$ 不是平衡二叉树，否则是平衡二叉树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

### 可视化演示

> 以 `root = [3, 9, 20, null, null, 15, 7]` 为例，演示自底向上递归求子树高度：叶子节点高度为 1，逐层向上 `h = 1 + max(l, r)`，任一节点出现 `-1` 或 `|l - r| > 1` 即非平衡。蓝色为正在计算高度的节点，绿色为已完成，节点下方 `h:` 标签为求得的高度。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="balancedSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public boolean isBalanced(TreeNode root) {
        return height(root) >= 0;
    }

    private int height(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int l = height(root.left);
        int r = height(root.right);
        if (l == -1 || r == -1 || Math.abs(l - r) > 1) {
            return -1;
        }
        return 1 + Math.max(l, r);
    }
}
```


```cpp [C++]
class Solution {
public:
    bool isBalanced(TreeNode* root) {
        function<int(TreeNode*)> height = [&](TreeNode* root) {
            if (!root) {
                return 0;
            }
            int l = height(root->left);
            int r = height(root->right);
            if (l == -1 || r == -1 || abs(l - r) > 1) {
                return -1;
            }
            return 1 + max(l, r);
        };
        return height(root) >= 0;
    }
};
```

```ts [TypeScript]
function isBalanced(root: TreeNode | null): boolean {
    const dfs = (root: TreeNode | null) => {
        if (root == null) {
            return 0;
        }
        const left = dfs(root.left);
        const right = dfs(root.right);
        if (left === -1 || right === -1 || Math.abs(left - right) > 1) {
            return -1;
        }
        return 1 + Math.max(left, right);
    };
    return dfs(root) > -1;
}
```

```python [Python]
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def height(root):
            if root is None:
                return 0
            l, r = height(root.left), height(root.right)
            if l == -1 or r == -1 or abs(l - r) > 1:
                return -1
            return 1 + max(l, r)

        return height(root) >= 0
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->