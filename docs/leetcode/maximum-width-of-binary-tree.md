---
comments: true
difficulty: 中等

tags:
    - 树
    - 深度优先搜索
    - 广度优先搜索
    - 二叉树
---

<script setup>
// 方法一（BFS）可视化：root = [1, 3, 2, 5, 3, null, 9]
// 层序下标：0=1, 1=3, 2=2, 3=5, 4=3, 5=null, 6=9
const maxWidthBfsSteps = [
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'cur' }], labels: [{ id: 0, text: 'i:1' }], aux: [{ title: '队列 q（编号）', values: [1] }], note: 'BFS 初始化：根节点 1 编号为 1 入队，q = [1]。每层宽度 = 该层最大编号 - 最小编号 + 1。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'hl' }, { id: 2, state: 'hl' }], labels: [{ id: 1, text: 'i:2' }, { id: 2, text: 'i:3' }], aux: [{ title: '队列 q（编号）', values: [2, 3] }], note: '第一层：宽度 = 1 - 1 + 1 = 1，ans = 1。出队 1，将左右孩子 3、2（编号 2、3）入队 → q = [2, 3]。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'hl' }, { id: 4, state: 'hl' }, { id: 6, state: 'hl' }], labels: [{ id: 3, text: 'i:4' }, { id: 4, text: 'i:5' }, { id: 6, text: 'i:7' }], aux: [{ title: '队列 q（编号）', values: [4, 5, 7] }], note: '第二层：宽度 = 3 - 2 + 1 = 2，ans = 2。出队 3、2，将孩子 5、3、9（编号 4、5、7）入队 → q = [4, 5, 7]。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'hl' }, { id: 4, state: 'hl' }, { id: 6, state: 'hl' }], labels: [{ id: 3, text: 'i:4' }, { id: 4, text: 'i:5' }, { id: 6, text: 'i:7' }], aux: [{ title: '队列 q（编号）', values: [] }], note: '第三层：宽度 = 7 - 4 + 1 = 4，ans = max(2, 4) = 4。叶子节点无孩子，全部出队，q 为空。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'mark' }, { id: 4, state: 'mark' }, { id: 6, state: 'mark' }], labels: [{ id: 3, text: 'i:4' }, { id: 4, text: 'i:5' }, { id: 6, text: 'i:7' }], note: '最大宽度 = 4 ✅（第 3 层：编号 4~7，位置 4、5、6、7，节点 5、3、null、9 占位 4）。' },
]

// 方法二（DFS）可视化：root = [1, 3, 2, 5, 3, null, 9]
// 层序下标：0=1, 1=3, 2=2, 3=5, 4=3, 5=null, 6=9
const maxWidthDfsSteps = [
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'cur' }], labels: [{ id: 0, text: 'i:1' }], note: 'dfs(1, depth=0, i=1)：t[0] = 1（第 0 层最左编号 1）。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }], labels: [{ id: 1, text: 'i:2' }], note: 'dfs(3, depth=1, i=2)：t[1] = 2（第 1 层最左编号 2）。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 3, state: 'cur' }], labels: [{ id: 3, text: 'i:4' }], note: 'dfs(5, depth=2, i=4)：t[2] = 4（第 2 层最左编号 4）。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'cur' }], labels: [{ id: 4, text: 'i:5' }], note: 'dfs(3, depth=2, i=5)：t[2] = 4 已存在 → width = 5 - 4 + 1 = 2，ans = max(1, 2) = 2。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 4, state: 'done' }, { id: 6, state: 'cur' }], labels: [{ id: 2, text: 'i:3' }, { id: 6, text: 'i:7' }], note: '左子树访问完，回溯到根 1，进入右子树：dfs(2, depth=1, i=3) → width = 3 - 2 + 1 = 2（ans 不变）；dfs(9, depth=2, i=7) → width = 7 - 4 + 1 = 4，ans = max(2, 4) = 4。' },
  { tree: [1, 3, 2, 5, 3, null, 9], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'mark' }, { id: 4, state: 'done' }, { id: 6, state: 'mark' }], labels: [{ id: 3, text: 'i:4' }, { id: 6, text: 'i:7' }], note: '最大宽度 = 4 ✅（第 3 层最左编号 4、最右编号 7，宽度 = 7 - 4 + 1 = 4）。' },
]
</script>

<!-- problem:start -->

# [662. 二叉树最大宽度](https://leetcode.cn/problems/maximum-width-of-binary-tree)

## 题目描述

<!-- description:start -->

<p>给你一棵二叉树的根节点 <code>root</code> ，返回树的 <strong>最大宽度</strong> 。</p>

<p>树的 <strong>最大宽度</strong> 是所有层中最大的 <strong>宽度</strong> 。</p>

<div class="original__bRMd">
<div>
<p>每一层的 <strong>宽度</strong> 被定义为该层最左和最右的非空节点（即，两个端点）之间的长度。将这个二叉树视作与满二叉树结构相同，两端点间会出现一些延伸到这一层的 <code>null</code> 节点，这些 <code>null</code> 节点也计入长度。</p>

<p>题目数据保证答案将会在&nbsp; <strong>32 位</strong> 带符号整数范围内。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110611719.png" alt="image-20240823110611719" style="zoom:80%;" />

<pre>
<strong>输入：</strong>root = [1,3,2,5,3,null,9]
<strong>输出：</strong>4
<strong>解释：</strong>最大宽度出现在树的第 3 层，宽度为 4 (5,3,null,9) 。
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110629658.png" alt="image-20240823110629658" style="zoom:80%;" />

<pre>
<strong>输入：</strong>root = [1,3,2,5,null,null,9,6,null,7]
<strong>输出：</strong>7
<strong>解释：</strong>最大宽度出现在树的第 4 层，宽度为 7 (6,null,null,null,null,null,7) 。
</pre>

<p><strong>示例 3：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110644208.png" alt="image-20240823110644208" style="zoom:80%;" />
<pre>
<strong>输入：</strong>root = [1,3,2,5]
<strong>输出：</strong>2
<strong>解释：</strong>最大宽度出现在树的第 2 层，宽度为 2 (3,2) 。
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点的数目范围是 <code>[1, 3000]</code></li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>
</div>
</div>

<!-- description:end -->


<!-- solution:start -->

## 方法一：BFS

对节点进行编号，初始根节点编号为 $1$。

对于一个编号为 `i` 的节点，它的左节点编号为 `i<<1`，右节点编号为 `i<<1|1`。

采用 BFS 进行层序遍历，求每层的宽度时，用该层的最大节点编号减去最小节点编号再加一即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

### 可视化演示

> 以 `root = [1, 3, 2, 5, 3, null, 9]` 为例，演示 BFS 逐层求最大宽度：对节点编号（根为 1，左右孩子编号为 2i、2i+1），每层宽度 = 该层最大编号 - 最小编号 + 1。节点下方 `i:` 标签为编号，队列 `q` 存放当前层编号。黄色为当前层节点，绿色为已处理层，红色为最终最大宽度所在层。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="maxWidthBfsSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        Deque<Pair<TreeNode, Integer>> q = new ArrayDeque<>();
        q.offer(new Pair<>(root, 1));
        int ans = 0;
        while (!q.isEmpty()) {
            ans = Math.max(ans, q.peekLast().getValue() - q.peekFirst().getValue() + 1);
            for (int n = q.size(); n > 0; --n) {
                var p = q.pollFirst();
                root = p.getKey();
                int i = p.getValue();
                if (root.left != null) {
                    q.offer(new Pair<>(root.left, i << 1));
                }
                if (root.right != null) {
                    q.offer(new Pair<>(root.right, i << 1 | 1));
                }
            }
        }
        return ans;
    }
}
```

```cpp [C++]
class Solution {
public:
    int widthOfBinaryTree(TreeNode* root) {
        queue<pair<TreeNode*, int>> q;
        q.push({root, 1});
        int ans = 0;
        while (!q.empty()) {
            ans = max(ans, q.back().second - q.front().second + 1);
            int i = q.front().second;
            for (int n = q.size(); n; --n) {
                auto p = q.front();
                q.pop();
                root = p.first;
                int j = p.second;
                if (root->left) q.push({root->left, (j << 1) - (i << 1)});
                if (root->right) q.push({root->right, (j << 1 | 1) - (i << 1)});
            }
        }
        return ans;
    }
};
```


```python [Python]
class Solution:
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        ans = 0
        q = deque([(root, 1)])
        while q:
            ans = max(ans, q[-1][1] - q[0][1] + 1)
            for _ in range(len(q)):
                root, i = q.popleft()
                if root.left:
                    q.append((root.left, i << 1))
                if root.right:
                    q.append((root.right, i << 1 | 1))
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：DFS

定义 `dfs(root, depth, i)` 表示从深度为 `depth`，且编号为 `i` 的节点 `root` 开始往下搜索。记录每一层最先访问到的节点的编号。访问到当前层其它节点时，求当前节点编号与当前层最小编号的差再加一，更新当前层的最大宽度。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数。

### 可视化演示

> 以 `root = [1, 3, 2, 5, 3, null, 9]` 为例，演示 DFS 求最大宽度：`dfs(root, depth, i)` 记录每层最左节点编号 `t[depth]`，width = `i - t[depth] + 1`。蓝色为当前访问节点，绿色为已处理，节点下方 `i:` 标签为编号。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="maxWidthDfsSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int ans = 1;
    private List<Integer> t = new ArrayList<>();

    public int widthOfBinaryTree(TreeNode root) {
        dfs(root, 0, 1);
        return ans;
    }

    private void dfs(TreeNode root, int depth, int i) {
        if (root == null) {
            return;
        }
        if (t.size() == depth) {
            t.add(i);
        } else {
            ans = Math.max(ans, i - t.get(depth) + 1);
        }
        dfs(root.left, depth + 1, i << 1);
        dfs(root.right, depth + 1, i << 1 | 1);
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<int> t;
    int ans = 1;
    using ull = unsigned long long;

    int widthOfBinaryTree(TreeNode* root) {
        dfs(root, 0, 1);
        return ans;
    }

    void dfs(TreeNode* root, int depth, ull i) {
        if (!root) return;
        if (t.size() == depth) {
            t.push_back(i);
        } else {
            ans = max(ans, (int) (i - t[depth] + 1));
        }
        dfs(root->left, depth + 1, i << 1);
        dfs(root->right, depth + 1, i << 1 | 1);
    }
};
```

```python [Python]
class Solution:
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        def dfs(root, depth, i):
            if root is None:
                return
            if len(t) == depth:
                t.append(i)
            else:
                nonlocal ans
                ans = max(ans, i - t[depth] + 1)
            dfs(root.left, depth + 1, i << 1)
            dfs(root.right, depth + 1, i << 1 | 1)

        ans = 1
        t = []
        dfs(root, 0, 1)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->