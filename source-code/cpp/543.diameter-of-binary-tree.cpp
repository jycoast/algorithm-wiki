#include <algorithm>
using namespace std;
#include "node.h"
/*
 * @lc app=leetcode.cn id=543 lang=cpp
 *
 * [543] Diameter of Binary Tree
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
private:
    int ans;
public:
    int diameterOfBinaryTree(TreeNode* root) {
        dfs(root);
        return ans;
    }

    // 使用深度遍历求二叉树的最大深度
    int dfs(TreeNode* root) {
        if (!root) {
            return 0;
        }

        int left = dfs(root->left);
        int right = dfs(root->right);
        ans = max(ans, left + right); // 二叉树某个节点直径 = 左子树的最大深度 + 右子树的最大深度
        // 当前节点的最大深度 = 1 + max（左子树的最大深度，右子树的最大深度）
        return 1 + max(left, right);
    }
};
// @lc code=end

