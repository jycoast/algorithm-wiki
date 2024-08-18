#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=101 lang=cpp
 *
 * [101] Symmetric Tree
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
public:
    bool isSymmetric(TreeNode* root) {
        return dfs(root->left, root->right);
    }

    bool dfs(TreeNode* left, TreeNode* right) {
        if (left && !right) {
            return false;
        }

        if (!left && right) {
            return false;
        }

        if (!left && !right) {
            return true;
        }

        if (left->val != right->val) {
            return false;
        }

        bool isSymmetricLeft = dfs(left->left, right->right);
        bool isSymmetricRight = dfs(left->right, right->left);
        return isSymmetricLeft && isSymmetricRight;
    }
};
// @lc code=end

