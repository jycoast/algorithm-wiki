#include "node.h"
#include <unordered_map>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=105 lang=cpp
 *
 * [105] Construct Binary Tree from Preorder and Inorder Traversal
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
    vector<int> preorder;
    unordered_map<int, int> map;
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        int n = preorder.size();
        this->preorder = preorder;
        for (int i = 0; i < inorder.size(); i++) {
            map[inorder[i]] = i;
        }

        return dfs(0, 0, n);
    }

    // i 和 j 分别表示前序序列和中序序列的起始位置
    // n 表示节点的个数
    TreeNode* dfs(int i, int j, int n) {
        if (n <= 0) {
            return nullptr;
        }

        int v = preorder[i]; // 作为根节点
        int k = map[v]; // 根节点在中序序列中的位置

        TreeNode* left = dfs(i + 1, j, k - j);
        TreeNode* right = dfs(i + 1 + k - j, k + 1, n - 1- (k - j));
        return new TreeNode(v, left, right);
    }
};
// @lc code=end

