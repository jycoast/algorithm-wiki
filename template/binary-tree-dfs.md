```java
public class BinaryTreeDFS {
    
    // 前序遍历
    public void preorderTraversal(TreeNode root) {
        if (root == null) {
            return;
        }
        
        // 处理当前节点
        System.out.print(root.val + " ");
        
        // 递归遍历左子树
        preorderTraversal(root.left);
        
        // 递归遍历右子树
        preorderTraversal(root.right);
    }
    
    // 中序遍历
    public void inorderTraversal(TreeNode root) {
        if (root == null) {
            return;
        }
        
        // 递归遍历左子树
        inorderTraversal(root.left);
        
        // 处理当前节点
        System.out.print(root.val + " ");
        
        // 递归遍历右子树
        inorderTraversal(root.right);
    }
    
    // 后序遍历
    public void postorderTraversal(TreeNode root) {
        if (root == null) {
            return;
        }
        
        // 递归遍历左子树
        postorderTraversal(root.left);
        
        // 递归遍历右子树
        postorderTraversal(root.right);
        
        // 处理当前节点
        System.out.print(root.val + " ");
    }
}
```
