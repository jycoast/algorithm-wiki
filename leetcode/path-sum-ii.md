---
comments: true
difficulty: 中等
edit_url: https://github.com/doocs/leetcode/edit/main/solution/0100-0199/0113.Path%20Sum%20II/README.md
tags:
    - 树
    - 深度优先搜索
    - 回溯
    - 二叉树
---

<!-- problem:start -->

# [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii)

## 题目描述

<!-- description:start -->

<p>给你二叉树的根节点 <code>root</code> 和一个整数目标和 <code>targetSum</code> ，找出所有 <strong>从根节点到叶子节点</strong> 路径总和等于给定目标和的路径。</p>

<p><strong>叶子节点</strong> 是指没有子节点的节点。</p>

<div class="original__bRMd">
<div>
<p> </p>

<p><strong>示例 1：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0100-0199/0113.Path%20Sum%20II/images/pathsumii1.jpg" style="width: 500px; height: 356px;" />
<pre>
<strong>输入：</strong>root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
<strong>输出：</strong>[[5,4,11,2],[5,8,4,5]]
</pre>

<p><strong>示例 2：</strong></p>
<img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0100-0199/0113.Path%20Sum%20II/images/pathsum2.jpg" style="width: 212px; height: 181px;" />
<pre>
<strong>输入：</strong>root = [1,2,3], targetSum = 5
<strong>输出：</strong>[]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>root = [1,2], targetSum = 0
<strong>输出：</strong>[]
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li>树中节点总数在范围 <code>[0, 5000]</code> 内</li>
	<li><code>-1000 <= Node.val <= 1000</code></li>
	<li><code>-1000 <= targetSum <= 1000</code></li>
</ul>
</div>
</div>

<!-- description:end -->



<!-- solution:start -->

## 方法一：DFS

我们从根节点开始，递归遍历所有从根节点到叶子节点的路径，并记录路径和。当遍历到叶子节点时，如果此时路径和等于 `targetSum`，则将此路径加入答案。

时间复杂度 $O(n^2)$，其中 $n$ 是二叉树的节点数。空间复杂度 $O(n)$。

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private List<Integer> t = new ArrayList<>();

    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        dfs(root, targetSum);
        return ans;
    }

    private void dfs(TreeNode root, int s) {
        if (root == null) {
            return;
        }
        s -= root.val;
        t.add(root.val);
        if (root.left == null && root.right == null && s == 0) {
            ans.add(new ArrayList<>(t));
        }
        dfs(root.left, s);
        dfs(root.right, s);
        t.remove(t.size() - 1);
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> ans;
        vector<int> t;
        function<void(TreeNode*, int)> dfs = [&](TreeNode* root, int s) {
            if (!root) return;
            s -= root->val;
            t.emplace_back(root->val);
            if (!root->left && !root->right && s == 0) ans.emplace_back(t);
            dfs(root->left, s);
            dfs(root->right, s);
            t.pop_back();
        };
        dfs(root, targetSum);
        return ans;
    }
};
```

```python [Python]
class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        def dfs(root, s):
            if root is None:
                return
            s += root.val
            t.append(root.val)
            if root.left is None and root.right is None and s == targetSum:
                ans.append(t[:])
            dfs(root.left, s)
            dfs(root.right, s)
            t.pop()

        ans = []
        t = []
        dfs(root, 0)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->