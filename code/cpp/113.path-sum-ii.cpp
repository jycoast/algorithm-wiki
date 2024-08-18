#include "node.h"
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=113 lang=cpp
 *
 * [113] Path Sum II
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
    vector<int> path;
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> ans;
        dfs(root, targetSum, ans);
        return ans;
    }

    void dfs(TreeNode* root, int sum, vector<vector<int>>& ans) {
        if (!root) {
            return;
        }
        path.push_back(root->val);
        sum = sum - root->val;
        if (root->left == nullptr && root->right == nullptr && sum == 0) {
            ans.push_back(path);
        }

        dfs(root->left, sum, ans);
        dfs(root->right, sum, ans);
        path.pop_back();
    }
};
// @lc code=end

