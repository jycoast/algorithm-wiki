#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=112 lang=cpp
 *
 * [112] Path Sum
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
    bool hasPathSum(TreeNode* root, int targetSum) {
        return dfs(root, targetSum);
    }

    bool dfs(TreeNode* root, int sum) {
        if (!root) {
            return false;
        }
        sum = sum - root->val;
        if (!root->left && !root->right && sum == 0) {
            return true;
        }

        return dfs(root->left, sum) || dfs(root->right, sum);
    }
};
// @lc code=end

