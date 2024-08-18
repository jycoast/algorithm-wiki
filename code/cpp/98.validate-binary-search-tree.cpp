#include "node.h"
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=98 lang=cpp
 *
 * [98] Validate Binary Search Tree
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
    TreeNode* prev;
public:
    bool isValidBST(TreeNode* root) {
      return dfs(root);
    }

    bool dfs(TreeNode* root) {
        if (!root) {
            return true;
        }
        if (!dfs(root->left)) {
            return false;
        }
        if (prev != nullptr && prev->val >= root->val) {
            return false;
        }
        prev = root; // 更新 prev
        return dfs(root->right);
    }

    bool traverse(TreeNode* root) {
        vector<int> t;
        dfs(root, t);
        for (int i = 0; i < t.size(); i++) {
            if (i > 0 && t[i - 1] >= t[i]) {
                return false;
            }
        }
        return true;
    }

    void dfs(TreeNode* root, vector<int>& t) {
        if (!root) {
            return;
        }
        dfs(root->left, t);
        t.push_back(root->val);
        dfs(root->right, t);
    }
};
// @lc code=end

