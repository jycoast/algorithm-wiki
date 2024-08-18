#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=221 lang=cpp
 *
 * [221] Maximal Square
 */

// @lc code=start
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        // dp[i + 1][j + 1] 表示以下标 (i,j) 作为正方形右下角的最大正方形边长
        int m = matrix.size();
        int n = matrix[0].size();
        int mx = 0;
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    dp[i + 1][j + 1] = min(dp[i][j], min(dp[i][j + 1], dp[i + 1][j])) + 1;
                    mx = max(mx, dp[i + 1][j + 1]);
                }
            }
        }
        return mx * mx;
    }
};
// @lc code=end

