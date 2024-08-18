## 二叉树BFS
```java
import java.util.LinkedList;
import java.util.Queue;

public class BinaryTreeBFS {
    
    public void levelOrderTraversal(TreeNode root) {
        if (root == null) {
            return;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                
                // 处理当前节点
                System.out.print(node.val + " ");
                
                // 将当前节点的子节点加入队列
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
        }
    }
}
```