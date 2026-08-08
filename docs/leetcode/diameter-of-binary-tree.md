---
comments: true
difficulty: 简单

tags:
    - 树
    - 深度优先搜索
    - 二叉树
---

<script setup>
// 方法一（dfs 求子树高度）可视化：root = [1, 2, 3, 4, 5]
// 层序下标：0=1, 1=2, 2=3, 3=4, 4=5
const diameterDfsSteps = [
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'cur' }], labels: [{ id: 3, text: 'h:1', state: 'done' }], note: 'dfs(4)：叶子节点，l = 0，r = 0，经过它的路径 left+right = 0。返回高度 h = 1 + max(0, 0) = 1' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'done' }, { id: 4, state: 'cur' }], labels: [{ id: 3, text: 'h:1', state: 'done' }, { id: 4, text: 'h:1', state: 'done' }], note: 'dfs(5)：叶子节点，l = 0，r = 0，h = 1。返回给父节点 2' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 1, state: 'cur' }], labels: [{ id: 1, text: 'l:1 r:1 h:2', state: 'done' }, { id: 3, text: 'h:1', state: 'done' }, { id: 4, text: 'h:1', state: 'done' }], note: 'dfs(2)：l = h(4) = 1，r = h(5) = 1。经过节点 2 的路径 left+right = 2，ans = max(0, 2) = 2。返回高度 h = 1 + max(1, 1) = 2' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }], labels: [{ id: 2, text: 'h:1', state: 'done' }], note: 'dfs(3)：叶子节点，l = 0，r = 0，h = 1。经过路径 0，ans 保持 2。返回给根 1' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 0, state: 'cur' }], labels: [{ id: 0, text: 'l:2 r:1', state: 'done' }, { id: 1, text: 'l:1 r:1 h:2', state: 'done' }, { id: 2, text: 'h:1', state: 'done' }], note: 'dfs(1)：l = h(2) = 2，r = h(3) = 1。经过根 1 的路径 left+right = 3，ans = max(2, 3) = 3。h = 1 + max(2, 1) = 3' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 2, state: 'path' }, { id: 3, state: 'path' }], labels: [{ id: 0, text: 'l:2 r:1', state: 'path' }, { id: 1, text: 'l:1 r:1 h:2', state: 'path' }, { id: 2, text: 'h:1', state: 'path' }, { id: 3, text: 'h:1', state: 'path' }], note: '最长路径为 [4, 2, 1, 3]（下标 3、1、0、2），长度为 3 条边，即直径 ans = 3 ✅' },
]

// 方法二（建图 + 两次 DFS）可视化：root = [1, 2, 3, 4, 5]
// 层序下标：0=1, 1=2, 2=3, 3=4, 4=5
const diameterGraphSteps = [
  { tree: [1, 2, 3, 4, 5], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }], note: 'build(root)：把每条父子边加入无向图邻接表 d。d = {1: {2, 3}, 2: {1, 4, 5}, 3: {1}, 4: {2}, 5: {2}}。所有节点标记完成' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 0, state: 'cur' }], note: '第一次 dfs：vis = set()，从根 1（下标0）出发，深度 t = 0。遍历邻接边，记录最大距离 ans 与最远节点 next' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 0, state: 'done' }, { id: 1, state: 'path' }, { id: 3, state: 'mark' }], note: '从根 1 出发最远到达 4（下标3）或 5（下标4），距离 t = 2。第一次 dfs 结束：ans = 2，next = 4。随后 vis.clear() 清空访问记录' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'cur' }, { id: 1, state: 'path' }], note: '第二次 dfs：从 next = 4（下标3）出发，t = 0。沿边走到节点 2（下标1），t = 1，继续沿另一条边前进' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'path' }, { id: 1, state: 'path' }, { id: 0, state: 'path' }, { id: 2, state: 'mark' }], note: '继续沿 4 → 2 → 1 → 3 前进，最远到达节点 3（下标2），距离 t = 3。ans = max(2, 3) = 3，next = 3' },
  { tree: [1, 2, 3, 4, 5], states: [{ id: 3, state: 'mark' }, { id: 1, state: 'path' }, { id: 0, state: 'path' }, { id: 2, state: 'mark' }], note: '第二次 dfs 结束：最远距离 ans = 3，即为直径。端点 4 与 3 之间路径 [4, 2, 1, 3] 长度为 3 条边 ✅' },
]
</script>

<!-- problem:start -->

# [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree)

## 题目描述

<!-- description:start -->

<p>给你一棵二叉树的根节点，返回该树的 <strong>直径</strong> 。</p>

<p>二叉树的 <strong>直径</strong> 是指树中任意两个节点之间最长路径的 <strong>长度</strong> 。这条路径可能经过也可能不经过根节点 <code>root</code> 。</p>

<p>两节点之间路径的 <strong>长度</strong> 由它们之间边数表示。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110530525.png" alt="image-20240823110530525"  />
<pre>
<strong>输入：</strong>root = [1,2,3,4,5]
<strong>输出：</strong>3
<strong>解释：</strong>3 ，取路径 [4,2,1,3] 或 [5,2,1,3] 的长度。
</pre>

<p><strong class="example">示例 2：</strong></p>

<pre>
<strong>输入：</strong>root = [1,2]
<strong>输出：</strong>1
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目在范围 <code>[1, 10<sup>4</sup>]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一

后序遍历计算每个节点左右子树的高度，经过该节点的最长路径长度为 `left + right`，答案 `ans` 取全局最大值。最终 `ans` 即为直径（边数）。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点个数。

### 可视化演示

> 以 `root = [1, 2, 3, 4, 5]` 为例，演示 dfs 求直径：自底向上计算每个节点的左右子树高度 `l`、`r`，经过该节点的路径为 `left + right`，`ans` 取最大值。绿色描边为最长路径。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="diameterDfsSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int ans;

    public int diameterOfBinaryTree(TreeNode root) {
        ans = 0;
        dfs(root);
        return ans;
    }

    private int dfs(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int left = dfs(root.left);
        int right = dfs(root.right);
        ans = Math.max(ans, left + right);
        return 1 + Math.max(left, right);
    }
}
```



```cpp [C++]
class Solution {
public:
    int ans;

    int diameterOfBinaryTree(TreeNode* root) {
        ans = 0;
        dfs(root);
        return ans;
    }

    int dfs(TreeNode* root) {
        if (!root) return 0;
        int left = dfs(root->left);
        int right = dfs(root->right);
        ans = max(ans, left + right);
        return 1 + max(left, right);
    }
};
```

```ts [TypeScript]
function diameterOfBinaryTree(root: TreeNode | null): number {
    let res = 0;
    const dfs = (root: TreeNode | null) => {
        if (root == null) {
            return 0;
        }
        const { left, right } = root;
        const l = dfs(left);
        const r = dfs(right);
        res = Math.max(res, l + r);
        return Math.max(l, r) + 1;
    };
    dfs(root);
    return res;
}
```

```python [Python]
class Solution:
    def diameterOfBinaryTree(self, root: TreeNode) -> int:
        def dfs(root):
            if root is None:
                return 0
            nonlocal ans
            left, right = dfs(root.left), dfs(root.right)
            ans = max(ans, left + right)
            return 1 + max(left, right)

        ans = 0
        dfs(root)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二

将二叉树转成无向图（邻接表 `d`），从任意节点（如根）DFS 找到最远节点 `next`，再从 `next` 第二次 DFS，找到的最远距离即为直径。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。

### 可视化演示

> 以 `root = [1, 2, 3, 4, 5]` 为例，演示建图 + 两次 DFS 求直径：先把树转成无向图，第一次 DFS 从根找到最远端点 4，第二次 DFS 从 4 找到最远端点 3，两者距离 3 即为直径。红色为直径端点，绿色描边为路径。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="diameterGraphSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group


```python [Python]
class Solution:
    def diameterOfBinaryTree(self, root: TreeNode) -> int:
        def build(root):
            if root is None:
                return
            nonlocal d
            if root.left:
                d[root].add(root.left)
                d[root.left].add(root)
            if root.right:
                d[root].add(root.right)
                d[root.right].add(root)
            build(root.left)
            build(root.right)

        def dfs(u, t):
            nonlocal ans, vis, d, next
            if u in vis:
                return
            vis.add(u)
            if t > ans:
                ans = t
                next = u
            for v in d[u]:
                dfs(v, t + 1)

        d = defaultdict(set)
        ans = 0
        next = root
        build(root)
        vis = set()
        dfs(next, 0)
        vis.clear()
        dfs(next, 0)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->