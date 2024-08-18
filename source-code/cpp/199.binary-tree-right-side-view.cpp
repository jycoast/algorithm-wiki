#include "node.h"
#include <queue>
#include <vector>
using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=199 lang=cpp
 *
 * [199] Binary Tree Right Side View
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
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
  vector<int> rightSideView(TreeNode *root) {
    vector<int> ans;
    dfs(root, ans, 0);
    return ans;
  }

  // 广度优先遍历
  vector<int> bfs(TreeNode *root) {
    vector<int> ans;
    if (!root) {
      return ans;
    }
    queue<TreeNode *> queue;
    queue.push(root);
    while (!queue.empty()) {
      int size = queue.size();
      ans.emplace_back(queue.back()->val);
      for (int i = 0; i < size; i++) {
        TreeNode *node = queue.front();
        queue.pop();
        if (node->left) {
          queue.push(node->left);
        }
        if (node->right) {
          queue.push(node->right);
        }
      }
    }
    return ans;
  }

  // 深度优先遍历
  void dfs(TreeNode *root, vector<int>& ans, int depth) {
    if (!root) {
      return;
    }

    if (ans.size() == depth) {
      ans.push_back(root->val);
    }

    dfs(root->right, ans, depth + 1);
    dfs(root->left, ans, depth + 1);
  }
};
// @lc code=end
