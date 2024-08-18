#include "node.h"
#include <algorithm>
using namespace std;

/*
 * @lc app=leetcode.cn id=124 lang=cpp
 *
 * [124] Binary Tree Maximum Path Sum
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
    int ans = -1001;
public:
    int maxPathSum(TreeNode* root) {
        dfs(root);
        return ans;
    }

    int dfs(TreeNode* root) {
        if (!root) {
            return 0;
        }

        int left = max(0, dfs(root->left));
        int right = max(0, dfs(root->right));
        ans = max(ans, root->val + left + right);
        return root->val + left + right;
    }
};
// @lc code=end

