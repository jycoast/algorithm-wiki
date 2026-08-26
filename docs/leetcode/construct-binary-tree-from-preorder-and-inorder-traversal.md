---
comments: true
difficulty: 中等
tags:
  - 树
  - 数组
  - 哈希表
  - 分治
  - 二叉树
entry: buildTree
testcases:
  - input:
      - - 3
        - 9
        - 20
        - 15
        - 7
      - - 9
        - 3
        - 15
        - 20
        - 7
    output:
      - 3
      - 9
      - 20
      - null
      - null
      - 15
      - 7
  - input:
      - - -1
      - - -1
    output:
      - -1
mode: tree-output
---


<script setup>
// 方法一（哈希表 + 递归）可视化：preorder = [3, 9, 20, 15, 7]，inorder = [9, 3, 15, 20, 7]
// 层序下标：0=3, 1=9, 2=20, 3=null, 4=null, 5=15, 6=7
const buildTreeSteps = [
  {
    tree: [null, null, null, null, null, null, null],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 0, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 0, markerLabel: 'j' },
    ],
    note: '建立哈希表 d = {9:0, 3:1, 15:2, 20:3, 7:4}（inorder 值 → 下标）。调用 dfs(0, 0, 5)：preorder 起点 i=0，inorder 起点 j=0，共 n=5 个节点。',
  },
  {
    tree: [3, null, null, null, null, null, null],
    states: [{ id: 0, state: 'cur' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 0, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 1, markerLabel: 'k' },
    ],
    note: 'dfs(0, 0, 5)：取出 v = preorder[i] = preorder[0] = 3 作为根节点。由 d 得 k = d[v] = d[3] = 1，即 3 在中序中的位置。左子树节点数 k-j = 1，右子树节点数 n-1-(k-j) = 3。',
  },
  {
    tree: [3, null, null, null, null, null, null],
    states: [{ id: 0, state: 'done' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 1, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 1, markerLabel: 'k' },
    ],
    note: '根 3 构造完成。递归构造左子树 l = dfs(i+1, j, k-j) = dfs(1, 0, 1)，对应中序区间 inorder[0..0] = [9]。',
  },
  {
    tree: [3, 9, null, null, null, null, null],
    states: [{ id: 0, state: 'done' }, { id: 1, state: 'cur' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 1, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 0, markerLabel: 'k' },
    ],
    note: 'dfs(1, 0, 1)：取出 v = preorder[1] = 9 作为左子树根。k = d[v] = d[9] = 0。左子树节点数 k-j = 0，右子树节点数 n-1-(k-j) = 0，9 是叶子。',
  },
  {
    tree: [3, 9, null, null, null, null, null],
    states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 2, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 2, markerLabel: 'j' },
    ],
    note: '9 的子树节点数均为 0，返回，左子树构造完成。回到根 3，递归构造右子树 r = dfs(i+1+k-j, k+1, n-1-(k-j)) = dfs(2, 2, 3)，对应中序区间 inorder[2..4] = [15, 20, 7]。',
  },
  {
    tree: [3, 9, 20, null, null, null, null],
    states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'cur' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 2, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 3, markerLabel: 'k' },
    ],
    note: 'dfs(2, 2, 3)：取出 v = preorder[2] = 20 作为右子树根。k = d[v] = d[20] = 3。左子树节点数 k-j = 1（inorder[2..2] = [15]），右子树节点数 n-1-(k-j) = 1（inorder[4..4] = [7]）。',
  },
  {
    tree: [3, 9, 20, null, null, 15, null],
    states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'cur' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 3, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 2, markerLabel: 'k' },
    ],
    note: '递归构造 20 的左子树 l = dfs(i+1, j, k-j) = dfs(3, 2, 1)：取出 v = preorder[3] = 15，k = d[15] = 2。左右子树节点数均为 0，15 是叶子（层序下标 5）。',
  },
  {
    tree: [3, 9, 20, null, null, 15, 7],
    states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'cur' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7], marker: 4, markerLabel: 'i' },
      { title: 'inorder', values: [9, 3, 15, 20, 7], marker: 4, markerLabel: 'k' },
    ],
    note: '递归构造 20 的右子树 r = dfs(i+1+k-j, k+1, n-1-(k-j)) = dfs(4, 4, 1)：取出 v = preorder[4] = 7，k = d[7] = 4。左右子树节点数均为 0，7 是叶子（层序下标 6）。',
  },
  {
    tree: [3, 9, 20, null, null, 15, 7],
    states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }],
    aux: [
      { title: 'preorder', values: [3, 9, 20, 15, 7] },
      { title: 'inorder', values: [9, 3, 15, 20, 7] },
    ],
    note: '所有子树节点数 n≤0，递归全部返回，二叉树构造完成 ✅。最终树为 [3, 9, 20, null, null, 15, 7]。',
  },
]
</script>

<!-- problem:start -->

# [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal)

## 题目描述

<!-- description:start -->

<p>给定两个整数数组&nbsp;<code>preorder</code> 和 <code>inorder</code>&nbsp;，其中&nbsp;<code>preorder</code> 是二叉树的<strong>先序遍历</strong>， <code>inorder</code>&nbsp;是同一棵树的<strong>中序遍历</strong>，请构造二叉树并返回其根节点。</p>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823110326601.png" alt="image-20240823110326601"  />
<pre>
<strong>输入</strong><strong>:</strong> preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
<strong>输出:</strong> [3,9,20,null,null,15,7]
</pre>

<p><strong>示例 2:</strong></p>

<pre>
<strong>输入:</strong> preorder = [-1], inorder = [-1]
<strong>输出:</strong> [-1]
</pre>

<p>&nbsp;</p>

<p><strong>提示:</strong></p>

<ul>
	<li><code>1 &lt;= preorder.length &lt;= 3000</code></li>
	<li><code>inorder.length == preorder.length</code></li>
	<li><code>-3000 &lt;= preorder[i], inorder[i] &lt;= 3000</code></li>
	<li><code>preorder</code>&nbsp;和&nbsp;<code>inorder</code>&nbsp;均 <strong>无重复</strong> 元素</li>
	<li><code>inorder</code>&nbsp;均出现在&nbsp;<code>preorder</code></li>
	<li><code>preorder</code>&nbsp;<strong>保证</strong> 为二叉树的前序遍历序列</li>
	<li><code>inorder</code>&nbsp;<strong>保证</strong> 为二叉树的中序遍历序列</li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：哈希表 + 递归

前序序列的第一个节点 $preorder[0]$ 为根节点，我们在中序序列中找到根节点的位置 $k$，可以将中序序列划分为左子树 $inorder[0..k]$ 、右子树 $inorder[k+1..]$。

通过左右子树的区间，可以计算出左、右子树节点的个数，假设为 $a$ 和 $b$。然后在前序节点中，从根节点往后的 $a$ 个节点为左子树，再往后的 $b$ 个节点为右子树。

因此，我们设计一个函数 $dfs(i, j, n)$，其中 $i$ 和 $j$ 分别表示前序序列和中序序列的起始位置，而 $n$ 表示节点个数。函数的返回值是以 $preorder[i..i+n-1]$ 为前序序列，以 $inorder[j..j+n-1]$ 为中序序列构造出的二叉树。

函数 $dfs(i, j, n)$ 的执行过程如下：

-   如果 $n \leq 0$，说明没有节点，返回空节点。
-   取出前序序列的第一个节点 $v = preorder[i]$ 作为根节点，然后利用哈希表 $d$ 找到根节点在中序序列中的位置 $k$，那么左子树的节点个数为 $k - j$，右子树的节点个数为 $n - k + j - 1$。
-   递归构造左子树 $l = dfs(i + 1, j, k - j)$ 和右子树 $r = dfs(i + 1 + k - j, k + 1, n - k + j - 1)$。
-   最后返回以 $v$ 为根节点且左右子树分别为 $l$ 和 $r$ 的二叉树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为二叉树节点个数。

### 可视化演示

> 以 `preorder = [3, 9, 20, 15, 7]`、`inorder = [9, 3, 15, 20, 7]` 为例，演示"哈希表 + 递归"构造二叉树：每次取 `preorder` 中 `i` 处的节点 `v` 作为根，通过哈希表 `d` 找到 `v` 在中序中的位置 `k`，从而划分左右子树区间并递归。蓝色为当前构造的根节点 `v`，绿色为已构造完成的节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="buildTreeSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int[] preorder;
    private Map<Integer, Integer> d = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        int n = preorder.length;
        this.preorder = preorder;
        for (int i = 0; i < n; ++i) {
            d.put(inorder[i], i);
        }
        return dfs(0, 0, n);
    }

    private TreeNode dfs(int i, int j, int n) {
        if (n <= 0) {
            return null;
        }
        int v = preorder[i];
        int k = d.get(v);
        TreeNode l = dfs(i + 1, j, k - j);
        TreeNode r = dfs(i + 1 + k - j, k + 1, n - 1 - (k - j));
        return new TreeNode(v, l, r);
    }
}
```

```cpp [C++]
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        int n = preorder.size();
        unordered_map<int, int> d;
        for (int i = 0; i < n; ++i) {
            d[inorder[i]] = i;
        }
        function<TreeNode*(int, int, int)> dfs = [&](int i, int j, int n) -> TreeNode* {
            if (n <= 0) {
                return nullptr;
            }
            int v = preorder[i];
            int k = d[v];
            TreeNode* l = dfs(i + 1, j, k - j);
            TreeNode* r = dfs(i + 1 + k - j, k + 1, n - 1 - (k - j));
            return new TreeNode(v, l, r);
        };
        return dfs(0, 0, n);
    }
};
```

```ts [TypeScript]
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    const d: Map<number, number> = new Map();
    const n = inorder.length;
    for (let i = 0; i < n; ++i) {
        d.set(inorder[i], i);
    }
    const dfs = (i: number, j: number, n: number): TreeNode | null => {
        if (n <= 0) {
            return null;
        }
        const v = preorder[i];
        const k = d.get(v)!;
        const l = dfs(i + 1, j, k - j);
        const r = dfs(i + 1 + k - j, k + 1, n - 1 - (k - j));
        return new TreeNode(v, l, r);
    };
    return dfs(0, 0, n);
}
```



```python [Python]
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        def dfs(i: int, j: int, n: int) -> Optional[TreeNode]:
            if n <= 0:
                return None
            v = preorder[i]
            k = d[v]
            l = dfs(i + 1, j, k - j)
            r = dfs(i + 1 + k - j, k + 1, n - k + j - 1)
            return TreeNode(v, l, r)

        d = {v: i for i, v in enumerate(inorder)}
        return dfs(0, 0, len(preorder))
```

:::
<!-- tabs:end -->

如果题目中给定的节点值存在重复，那么我们只需要记录每个节点值出现的所有位置，然后递归构建出所有可能的二叉树即可。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<Integer> preorder;
    private Map<Integer, List<Integer>> d = new HashMap<>();

    public List<TreeNode> getBinaryTrees(List<Integer> preOrder, List<Integer> inOrder) {
        int n = preOrder.size();
        this.preorder = preOrder;
        for (int i = 0; i < n; ++i) {
            d.computeIfAbsent(inOrder.get(i), k -> new ArrayList<>()).add(i);
        }
        return dfs(0, 0, n);
    }

    private List<TreeNode> dfs(int i, int j, int n) {
        List<TreeNode> ans = new ArrayList<>();
        if (n <= 0) {
            ans.add(null);
            return ans;
        }
        int v = preorder.get(i);
        for (int k : d.get(v)) {
            if (k >= j && k < j + n) {
                for (TreeNode l : dfs(i + 1, j, k - j)) {
                    for (TreeNode r : dfs(i + 1 + k - j, k + 1, n - 1 - (k - j))) {
                        ans.add(new TreeNode(v, l, r));
                    }
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
    vector<TreeNode*> getBinaryTrees(vector<int>& preOrder, vector<int>& inOrder) {
        int n = inOrder.size();
        unordered_map<int, vector<int>> d;
        for (int i = 0; i < n; ++i) {
            d[inOrder[i]].push_back(i);
        }
        function<vector<TreeNode*>(int, int, int)> dfs = [&](int i, int j, int n) -> vector<TreeNode*> {
            vector<TreeNode*> ans;
            if (n <= 0) {
                ans.push_back(nullptr);
                return ans;
            }
            int v = preOrder[i];
            for (int k : d[v]) {
                if (k >= j && k < j + n) {
                    auto lefts = dfs(i + 1, j, k - j);
                    auto rights = dfs(i + 1 + k - j, k + 1, n - 1 - (k - j));
                    for (TreeNode* l : lefts) {
                        for (TreeNode* r : rights) {
                            TreeNode* node = new TreeNode(v);
                            node->left = l;
                            node->right = r;
                            ans.push_back(node);
                        }
                    }
                }
            }
            return ans;
        };
        return dfs(0, 0, n);
    }
};
```

```python [Python]
class Solution:
    def getBinaryTrees(self, preOrder: List[int], inOrder: List[int]) -> List[TreeNode]:
        def dfs(i: int, j: int, n: int) -> List[TreeNode]:
            if n <= 0:
                return [None]
            v = preOrder[i]
            ans = []
            for k in d[v]:
                if j <= k < j + n:
                    for l in dfs(i + 1, j, k - j):
                        for r in dfs(i + 1 + k - j, k + 1, n - 1 - (k - j)):
                            ans.append(TreeNode(v, l, r))
            return ans

        d = defaultdict(list)
        for i, x in enumerate(inOrder):
            d[x].append(i)
        return dfs(0, 0, len(preOrder))
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->