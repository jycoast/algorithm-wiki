---
comments: true
difficulty: 简单

tags:
    - 栈
    - 树
    - 深度优先搜索
    - 二叉树
---

<script setup>
// 方法一（递归）可视化：root = [1, null, 2, null, null, null, 3]
// 层序下标：0=1, 1=null, 2=2, 3=null, 4=null, 5=null, 6=3
const inorderRecSteps = [
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'cur' }], aux: [{ title: 'ans', values: [] }], note: '调用 dfs(root=1)：root 非空，先递归左子树 dfs(1.left)' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'cur' }], aux: [{ title: 'ans', values: [] }], note: 'dfs(1.left) 为 null，直接返回，回到节点 1' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }], aux: [{ title: 'ans', values: [1] }], note: '访问根节点：ans.add(1) → ans = [1]。随后递归右子树 dfs(1.right) → dfs(2)' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'cur' }], aux: [{ title: 'ans', values: [1] }], note: '进入 dfs(root=2)：root 非空，先递归左子树 dfs(2.left)' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'cur' }], aux: [{ title: 'ans', values: [1] }], note: 'dfs(2.left) 为 null，直接返回，回到节点 2' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }], aux: [{ title: 'ans', values: [1, 2] }], note: '访问节点 2：ans.add(2) → ans = [1, 2]。随后递归右子树 dfs(2.right) → dfs(3)' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'cur' }], aux: [{ title: 'ans', values: [1, 2] }], note: '进入 dfs(root=3)：root 非空，先递归左子树 dfs(3.left)' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'cur' }], aux: [{ title: 'ans', values: [1, 2] }], note: 'dfs(3.left) 为 null，直接返回，回到节点 3' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'done' }], aux: [{ title: 'ans', values: [1, 2, 3] }], note: '访问节点 3：ans.add(3) → ans = [1, 2, 3]。dfs(3.right) 为 null 返回，整棵二叉树遍历完成 ✅' },
]
// 方法二（栈迭代）可视化：root = [1, null, 2, null, null, null, 3]
const inorderStackSteps = [
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'hl' }], aux: [{ title: 'stk', values: [1], marker: 0, markerLabel: '栈顶' }, { title: 'ans', values: [] }], note: '初始 root 指向节点 1，非空 → stk.push(1)，stk = [1]（▼ 为栈顶）；root 指向 1 的左孩子 null' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'cur' }], aux: [{ title: 'stk', values: [] }, { title: 'ans', values: [1] }], note: 'root 为 null 且栈非空 → stk.pop() 弹出 1 并访问：ans.add(1) → ans = [1]；root 指向 1 的右孩子 2' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'hl' }], aux: [{ title: 'stk', values: [2], marker: 0, markerLabel: '栈顶' }, { title: 'ans', values: [1] }], note: 'root 指向节点 2，非空 → stk.push(2)，stk = [2]（▼ 为栈顶）；root 指向 2 的左孩子 null' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'cur' }], aux: [{ title: 'stk', values: [] }, { title: 'ans', values: [1, 2] }], note: 'root 为 null → stk.pop() 弹出 2 并访问：ans.add(2) → ans = [1, 2]；root 指向 2 的右孩子 3' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'hl' }], aux: [{ title: 'stk', values: [3], marker: 0, markerLabel: '栈顶' }, { title: 'ans', values: [1, 2] }], note: 'root 指向节点 3，非空 → stk.push(3)，stk = [3]（▼ 为栈顶）；root 指向 3 的左孩子 null' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'cur' }], aux: [{ title: 'stk', values: [] }, { title: 'ans', values: [1, 2, 3] }], note: 'root 为 null → stk.pop() 弹出 3 并访问：ans.add(3) → ans = [1, 2, 3]；root 指向 3 的右孩子 null' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'done' }], aux: [{ title: 'stk', values: [] }, { title: 'ans', values: [1, 2, 3] }], note: 'root 为 null 且 stk 为空 → while 循环结束，返回 ans = [1, 2, 3] ✅' },
]
// 方法三（Morris）可视化：root = [1, null, 2, null, null, null, 3]
const inorderMorrisSteps = [
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'cur' }], aux: [{ title: 'ans', values: [1] }], note: 'root 指向节点 1：root.left 为 null → 直接访问 ans.add(1) → ans = [1]；root = root.right = 节点 2' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'cur' }], aux: [{ title: 'ans', values: [1, 2] }], note: 'root 指向节点 2：root.left 为 null → ans.add(2) → ans = [1, 2]；root = root.right = 节点 3' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'cur' }], aux: [{ title: 'ans', values: [1, 2, 3] }], note: 'root 指向节点 3：root.left 为 null → ans.add(3) → ans = [1, 2, 3]；root = root.right = null' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'done' }], aux: [{ title: 'ans', values: [1, 2, 3] }], note: 'root 为 null，while 循环结束，返回 ans = [1, 2, 3]。Morris 通过临时改变前驱节点的右指针指向实现 O(1) 空间，本示例各节点左子树均空，故每次直接向右走' },
  { tree: [1, null, 2, null, null, null, 3], states: [{ id: 0, state: 'done' }, { id: 2, state: 'done' }, { id: 6, state: 'done' }], aux: [{ title: 'ans', values: [1, 2, 3] }], note: '补充：Morris 通用线索逻辑——若 root.left 非空，找 prev = root 左子树的最右节点（中序前驱）：① 若 prev.right 为空 → 令 prev.right = root 建立线索，root = root.left；② 若 prev.right == root → 说明左子树已遍历完，ans.add(root.val) 并 prev.right = null 解除线索，root = root.right。本例左子树均空，始终走“直接访问并向右”分支，未触发线索化 ✅' },
]
</script>

<!-- problem:start -->

# [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal)

## 题目描述

<!-- description:start -->

<p>给定一个二叉树的根节点 <code>root</code> ，返回 <em>它的 <strong>中序</strong>&nbsp;遍历</em> 。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105304708.png" alt="image-20240823105304708" style="zoom:80%;" />
<pre>
<strong>输入：</strong>root = [1,null,2,3]
<strong>输出：</strong>[1,3,2]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>root = []
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = [1]
<strong>输出：</strong>[1]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点数目在范围 <code>[0, 100]</code> 内</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>

<p>&nbsp;</p>

<p><strong>进阶:</strong>&nbsp;递归算法很简单，你可以通过迭代算法完成吗？</p>

<!-- description:end -->



<!-- solution:start -->

## 方法一：递归遍历

我们先递归左子树，再访问根节点，接着递归右子树。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数，空间复杂度主要取决于递归调用的栈空间。

### 可视化演示

> 以 `root = [1, null, 2, null, null, null, 3]` 为例，演示递归中序遍历：先递归左子树，再访问根节点，最后递归右子树，访问顺序为 1 → 2 → 3。蓝色为当前访问节点，绿色为已加入结果 `ans` 的节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="inorderRecSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<Integer> ans = new ArrayList<>();

    public List<Integer> inorderTraversal(TreeNode root) {
        dfs(root);
        return ans;
    }

    private void dfs(TreeNode root) {
        if (root == null) {
            return;
        }
        dfs(root.left);
        ans.add(root.val);
        dfs(root.right);
    }
}
```


```cpp [C++]
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        function<void(TreeNode*)> dfs = [&](TreeNode* root) {
            if (!root) {
                return;
            }
            dfs(root->left);
            ans.push_back(root->val);
            dfs(root->right);
        };
        dfs(root);
        return ans;
    }
};
```
```python [Python]
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        def dfs(root):
            if root is None:
                return
            dfs(root.left)
            ans.append(root.val)
            dfs(root.right)

        ans = []
        dfs(root)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：栈实现非递归遍历

非递归的思路如下：

1. 定义一个栈 $stk$
2. 将树的左节点依次入栈
3. 左节点为空时，弹出栈顶元素并处理
4. 重复 2-3 的操作

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是二叉树的节点数，空间复杂度主要取决于栈空间。

### 可视化演示

> 以 `root = [1, null, 2, null, null, null, 3]` 为例，演示栈迭代中序遍历：指针 `root` 沿左子树一路入栈，遇到 null 时弹出栈顶访问并转向右子树。黄色为入栈节点，蓝色为弹出访问节点，绿色为已处理节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="inorderStackSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        Deque<TreeNode> stk = new ArrayDeque<>();
        while (root != null || !stk.isEmpty()) {
            if (root != null) {
                stk.push(root);
                root = root.left;
            } else {
                root = stk.pop();
                ans.add(root.val);
                root = root.right;
            }
        }
        return ans;
    }
}
```



```cpp [C++]
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        stack<TreeNode*> stk;
        while (root || stk.size()) {
            if (root) {
                stk.push(root);
                root = root->left;
            } else {
                root = stk.top();
                stk.pop();
                ans.push_back(root->val);
                root = root->right;
            }
        }
        return ans;
    }
};
```

```python [Python]
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        ans, stk = [], []
        while root or stk:
            if root:
                stk.append(root)
                root = root.left
            else:
                root = stk.pop()
                ans.append(root.val)
                root = root.right
        return ans
```

```ts [TypeScript]
function inorderTraversal(root: TreeNode | null): number[] {
    const stk: TreeNode[] = [];
    const ans: number[] = [];
    while (root || stk.length > 0) {
        if (root) {
            stk.push(root);
            root = root.left;
        } else {
            root = stk.pop();
            ans.push(root.val);
            root = root.right;
        }
    }
    return ans;
}
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三：Morris 实现中序遍历

Morris 遍历无需使用栈，空间复杂度为 $O(1)$。核心思想是：

遍历二叉树节点，

1. 若当前节点 root 的左子树为空，**将当前节点值添加至结果列表 ans** 中，并将当前节点更新为 `root.right`
2. 若当前节点 root 的左子树不为空，找到左子树的最右节点 prev（也即是 root 节点在中序遍历下的前驱节点）：
    - 若前驱节点 prev 的右子树为空，将前驱节点的右子树指向当前节点 root，并将当前节点更新为 `root.left`。
    - 若前驱节点 prev 的右子树不为空，**将当前节点值添加至结果列表 ans** 中，然后将前驱节点右子树指向空（即解除 prev 与 root 的指向关系），并将当前节点更新为 `root.right`。
3. 循环以上步骤，直至二叉树节点为空，遍历结束。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 是二叉树的节点数。

### 可视化演示

> 以 `root = [1, null, 2, null, null, null, 3]` 为例，演示 Morris 中序遍历：左子树为空时直接访问并向右走，不借助额外栈空间（O(1)）。蓝色为当前访问节点，绿色为已处理节点。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="inorderMorrisSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        while (root != null) {
            if (root.left == null) {
                ans.add(root.val);
                root = root.right;
            } else {
                TreeNode prev = root.left;
                while (prev.right != null && prev.right != root) {
                    prev = prev.right;
                }
                if (prev.right == null) {
                    prev.right = root;
                    root = root.left;
                } else {
                    ans.add(root.val);
                    prev.right = null;
                    root = root.right;
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
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        while (root) {
            if (!root->left) {
                ans.push_back(root->val);
                root = root->right;
            } else {
                TreeNode* prev = root->left;
                while (prev->right && prev->right != root) {
                    prev = prev->right;
                }
                if (!prev->right) {
                    prev->right = root;
                    root = root->left;
                } else {
                    ans.push_back(root->val);
                    prev->right = nullptr;
                    root = root->right;
                }
            }
        }
        return ans;
    }
};
```
```ts [TypeScript]
function inorderTraversal(root: TreeNode | null): number[] {
    const ans: number[] = [];
    while (root) {
        if (!root.left) {
            ans.push(root.val);
            root = root.right;
        } else {
            let prev = root.left;
            while (prev.right && prev.right != root) {
                prev = prev.right;
            }
            if (!prev.right) {
                prev.right = root;
                root = root.left;
            } else {
                ans.push(root.val);
                prev.right = null;
                root = root.right;
            }
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        ans = []
        while root:
            if root.left is None:
                ans.append(root.val)
                root = root.right
            else:
                prev = root.left
                while prev.right and prev.right != root:
                    prev = prev.right
                if prev.right is None:
                    prev.right = root
                    root = root.left
                else:
                    ans.append(root.val)
                    prev.right = None
                    root = root.right
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->