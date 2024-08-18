#include "node.h"
#include <stack>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=144 lang=cpp
 *
 * [144] Binary Tree Preorder Traversal
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
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> ans;
        if (!root) {
            return ans;
        }
        iterator(root, ans);
        return ans;
    }

    // 迭代法
    void iterator(TreeNode* root, vector<int>& ans) {
        stack<TreeNode*> stack;
        stack.push(root);
        while (stack.size()) {
            TreeNode* node = stack.top();

            ans.push_back(node->val);
            stack.pop();

            if (node->right) {
                stack.push(node->right);
            }
            if (node->left) {
                stack.push(node->left);
            }
        }
    }

    // 递归法
    void dfs(TreeNode* root, vector<int>& ans) {
        if (!root) {
            return;
        }

        ans.push_back(root->val);
        dfs(root->left, ans);
        dfs(root->right, ans);
    }
};
// @lc code=end

