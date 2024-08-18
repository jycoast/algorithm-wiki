#include "node.h"
#include <algorithm>
#include <queue>
#include <type_traits>
#include <utility>
using namespace std;

/*
 * @lc app=leetcode.cn id=662 lang=cpp
 *
 * [662] Maximum Width of Binary Tree
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
    int widthOfBinaryTree(TreeNode* root) {
        int ans = 0;
        queue<pair<TreeNode*, int>> queue;
        queue.push({root, 1});
        while (!queue.empty()) {
            // 计算当前层的宽度，并更新最大宽度
            ans = max(ans, queue.back().second - queue.front().second + 1);
            int i = queue.front().second;
            for (int n = queue.size(); n > 0; n--) {
                auto p = queue.front();
                 // root: 当前节点
                root = p.first;
                int j = p.second;
                // 计算左右节点在二叉树中的编号
                if (root->left) {
                    queue.push({root->left, (j << 1) - (i << 1)});
                }
                if (root->right) {
                    queue.push({root->right, (j << 1 | 1) - (i << 1)});
                }
                queue.pop();
            }
        }
        return  ans;    
    }
};
// @lc code=end

