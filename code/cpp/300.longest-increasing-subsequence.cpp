#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=300 lang=cpp
 *
 * [300] Longest Increasing Subsequence
 */

// @lc code=start
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        // dp[i] 以 nums[i] 结尾的最长递增子序列的长度
        int n = nums.size();
        int ans = 1;
        vector<int> dp(n, 1);
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
                ans = max(dp[i], ans);
            }
        }
        return ans;
    }
};
// @lc code=end

