以[77. 组合](https://leetcode.cn/problems/combinations/)问题为例，回溯算法的模板代码如下：

```java
import java.util.ArrayList;
import java.util.List;

class Solution {

    // 存放最终的结果
    private List<List<Integer>> ans = new ArrayList<>();

    // 存放符合条件结果
    private List<Integer> path = new LinkedList<>();

    public List<List<Integer>> combine(int n, int k) {
        dfs(n, k, 1);
        return ans;
    }

    private void dfs(int n, int k, int startIndex) {
        // 递归的终止条件
        if (path.size() == k) {
            ans.add(new ArrayList<>(path));
            return;
        }

        // 树的横向遍历
        for (int i = startIndex; i <= n; i++) {
            // 处理节点
            path.add(i);
            // 递归，树的纵向遍历
            dfs(n, k, i + 1);
            // 撤销处理的节点
            path.remove(path.size() - 1);
        }
    }
}
```

回溯算法是一种穷举类型的递归。
