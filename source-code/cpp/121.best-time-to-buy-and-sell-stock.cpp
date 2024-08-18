#include <algorithm>
#include <vector>
using namespace std;
/*
 * @lc app=leetcode.cn id=121 lang=cpp
 *
 * [121] Best Time to Buy and Sell Stock
 */

// @lc code=start
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // dp[i][0] 表示第i天持有股票所得最多现金
        // dp[i][1] 表示第i天不持有股票所得最多现金
        int len = prices.size();
        if (len == 0) {
            return 0;
        }

        vector<vector<int>> dp(len, vector<int>(2));
        dp[0][0] = -prices[0];
        dp[0][1] = 0;

        for (int i = 1; i < len; i++) {
            dp[i][0] = max(dp[i - 1][0], -prices[i]);
            dp[i][1] = max(dp[i - 1][1], prices[i] + dp[i - 1][0]);
        }

        return dp[len - 1][1];
    }
};
// @lc code=end

