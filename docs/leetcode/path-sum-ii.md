---
comments: true
difficulty: 中等
tags:
  - 树
  - 深度优先搜索
  - 回溯
  - 二叉树
entry: pathSum
testcases:
  - input:
      - - 5
        - 4
        - 8
        - 11
        - null
        - 13
        - 4
        - 7
        - 2
        - null
        - null
        - 5
        - 1
      - 22
    output:
      - - 5
        - 4
        - 11
        - 2
      - - 5
        - 8
        - 4
        - 5
  - input:
      - - 1
        - 2
        - 3
      - 5
    output: []
  - input:
      - - 1
        - 2
      - 0
    output: []
mode: tree
---


<script setup>
// 方法一（DFS 回溯）可视化：root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]，targetSum = 22
// 层序下标：0=5, 1=4, 2=8, 3=11, 4=null, 5=13, 6=4, 7=7, 8=2, 9=null, 10=null, 11=5, 12=1
const pathSumSteps = [
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }], labels: [{ id: 0, text: 's:17' }], aux: [{ title: '路径 t', values: [5] }, { title: '结果 ans', values: [] }], note: 'dfs(5, 22)：s = 22 - 5 = 17，t = [5]。s 从 targetSum 递减。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }], aux: [{ title: '路径 t', values: [5, 4] }, { title: '结果 ans', values: [] }], note: 'dfs(4, 17)：s = 17 - 4 = 13，t = [5, 4]。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }], labels: [{ id: 0, text: 's:17' }, { id: 1, text: 's:13' }, { id: 3, text: 's:2' }], aux: [{ title: '路径 t', values: [5, 4, 11] }, { title: '结果 ans', values: [] }], note: 'dfs(11, 13)：s = 13 - 11 = 2，t = [5, 4, 11]。11 非叶子，继续向左。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }, { id: 7, state: 'cur' }], labels: [{ id: 3, text: 's:2' }, { id: 7, text: 's:-5' }], aux: [{ title: '路径 t', values: [5, 4, 11, 7] }, { title: '结果 ans', values: [] }], note: 'dfs(7, 2)：s = 2 - 7 = -5。叶子 7 但 s ≠ 0，不加入 ans，回溯移除 7。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'path' }, { id: 3, state: 'path' }, { id: 7, state: 'done' }, { id: 8, state: 'mark' }], labels: [{ id: 3, text: 's:2' }, { id: 8, text: 's:0' }], aux: [{ title: '路径 t', values: [5, 4, 11, 2] }, { title: '结果 ans', values: [5, 4, 11, 2] }], note: 'dfs(2, 2)：s = 2 - 2 = 0。叶子 2 且 s == 0 → 命中！ans = [[5, 4, 11, 2]]（红色）。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 1, state: 'done' }, { id: 2, state: 'path' }, { id: 3, state: 'done' }, { id: 7, state: 'done' }, { id: 8, state: 'mark' }], labels: [{ id: 0, text: 's:17' }, { id: 2, text: 's:9' }], aux: [{ title: '路径 t', values: [5, 8] }, { title: '结果 ans', values: [5, 4, 11, 2] }], note: '回溯移除 2、11、4，t = [5]；从根 5 转向右子树：dfs(8, 17)：s = 17 - 8 = 9，t = [5, 8]。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 2, state: 'path' }, { id: 5, state: 'cur' }, { id: 8, state: 'mark' }], labels: [{ id: 2, text: 's:9' }, { id: 5, text: 's:-4' }], aux: [{ title: '路径 t', values: [5, 8, 13] }, { title: '结果 ans', values: [5, 4, 11, 2] }], note: 'dfs(13, 9)：s = 9 - 13 = -4。叶子 13 但 s ≠ 0，回溯移除 13。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 2, state: 'path' }, { id: 5, state: 'done' }, { id: 6, state: 'path' }, { id: 8, state: 'mark' }], labels: [{ id: 2, text: 's:9' }, { id: 6, text: 's:5' }], aux: [{ title: '路径 t', values: [5, 8, 4] }, { title: '结果 ans', values: [5, 4, 11, 2] }], note: 'dfs(4, 9)：s = 9 - 4 = 5，t = [5, 8, 4]。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'path' }, { id: 2, state: 'path' }, { id: 5, state: 'done' }, { id: 6, state: 'path' }, { id: 8, state: 'mark' }, { id: 11, state: 'mark' }], labels: [{ id: 6, text: 's:5' }, { id: 11, text: 's:0' }], aux: [{ title: '路径 t', values: [5, 8, 4, 5] }, { title: '结果 ans', values: [5, 4, 11, 2, null, 5, 8, 4, 5] }], note: 'dfs(5, 5)：s = 5 - 5 = 0。叶子 5 且 s == 0 → 命中！ans = [[5, 4, 11, 2], [5, 8, 4, 5]]（红色）。' },
  { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], states: [{ id: 0, state: 'done' }, { id: 1, state: 'done' }, { id: 2, state: 'done' }, { id: 3, state: 'done' }, { id: 5, state: 'done' }, { id: 6, state: 'done' }, { id: 7, state: 'done' }, { id: 8, state: 'mark' }, { id: 11, state: 'mark' }], aux: [{ title: '路径 t', values: [] }, { title: '结果 ans', values: [5, 4, 11, 2, null, 5, 8, 4, 5] }], note: '全部回溯完毕。命中两条路径 [5, 4, 11, 2] 与 [5, 8, 4, 5]，返回 ans ✅。' },
]
</script>

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
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105129310.png" alt="image-20240823105129310" style="zoom: 80%;" />

<pre>
<strong>输入：</strong>root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
<strong>输出：</strong>[[5,4,11,2],[5,8,4,5]]
</pre>

<p><strong>示例 2：</strong></p>
<img src="https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20240823105143253.png" alt="image-20240823105143253"  />
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

### 可视化演示

> 以 `root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]`、`targetSum = 22` 为例，演示 DFS 回溯寻找路径和为 22 的根到叶子路径：`s` 从 targetSum 递减，`t` 记录当前路径。绿色描边为当前路径节点，红色为命中路径的叶子节点，节点下方 `s:` 标签为剩余和。点击 ▶ 播放，或逐步操作。

<TreeViz :steps="pathSumSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
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