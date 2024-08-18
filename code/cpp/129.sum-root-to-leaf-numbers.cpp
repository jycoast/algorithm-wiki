#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=129 lang=cpp
 *
 * [129] Sum Root to Leaf Numbers
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
    int sumNumbers(TreeNode* root) {
        return dfs(root, 0);
    }

    int dfs(TreeNode* root, int ans) {
        if (!root) {
            return 0;
        }

        ans = ans * 10 + root->val;
        if (root->left == nullptr && root->right == nullptr) {
            return ans;
        }

        return dfs(root->left, ans) + dfs(root->right, ans);
    }
};
// @lc code=end

