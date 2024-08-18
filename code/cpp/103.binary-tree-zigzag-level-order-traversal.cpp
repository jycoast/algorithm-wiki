#include "node.h"
#include <queue>
#include <type_traits>
#include <vector>
using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=103 lang=cpp
 *
 * [103] Binary Tree Zigzag Level Order Traversal
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
  vector<vector<int>> zigzagLevelOrder(TreeNode *root) {
    vector<vector<int>> ans;
    if (!root) {
      return ans;
    }

    queue<TreeNode *> queue;
    queue.push(root);
    bool isLeft = true;
    while (!queue.empty()) {
      int size = queue.size();
      vector<int> t(size);
      for (int i = 0; i < size; i++) {
        TreeNode *node = queue.front();
        queue.pop();
        int index = isLeft ? i : (size - 1 - i);
        t[index] = node->val;

        if (node->left) {
          queue.push(node->left);
        }
        if (node->right) {
          queue.push(node->right);
        }
      }
      isLeft = !isLeft;
      ans.push_back(t);
    }
    return ans;
  }
};
// @lc code=end
