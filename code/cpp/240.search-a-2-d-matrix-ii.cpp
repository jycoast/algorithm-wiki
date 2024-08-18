#include <algorithm>
#include <iterator>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=240 lang=cpp
 *
 * [240] Search a 2D Matrix II
 */

// @lc code=start
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size();
        int n = matrix[0].size();
        for (int i = 0; i < m; i++) {
            vector<int>::iterator it = lower_bound(matrix[i].begin(), matrix[i].end(), target);
            if (it != matrix[i].end() && *it == target) {
                return true;
            }
        }
        return false;
    }
};
// @lc code=end

