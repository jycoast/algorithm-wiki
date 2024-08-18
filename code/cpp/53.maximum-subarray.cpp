#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=53 lang=cpp
 *
 * [53] Maximum Subarray
 */

// @lc code=start
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n);
        // dp[i] 表示以 nums[i] 为结尾的连续子数组的最大和
        dp[0] = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            dp[i] = max(dp[i - 1] + nums[i], nums[i]);
        }
        return *max_element(dp.begin(), dp.end());
    }

    // 优化空间复杂度
    int maxSubArray2(vector<int>& nums) {
        int ans = nums[0], sum = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            sum = max(sum, 0) + nums[i];
            ans = max(ans, sum);
        }
        return ans;
    }

    // 如果要返回的是子数组
    vector<int> maxSubArray3(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n);
        dp[0] = nums[0];

        // 初始化最大和及其对应的起始和结束位置
        int max_sum = dp[0];
        int start = 0, end = 0, temp_start = 0;

        for (int i = 1; i < n; i++) {
            if (dp[i - 1] + nums[i] > nums[i]) {
                dp[i] = dp[i - 1] + nums[i];
            } else {
                dp[i] = nums[i];
                temp_start = i;
            }

            // 更新最大和及其对应的起始和结束位置
            if (dp[i] > max_sum) {
                max_sum = dp[i];
                start = temp_start;
                end = i;
            }
        }

        // 返回最大和的连续子数组
        return vector<int>(nums.begin() + start, nums.begin() + end + 1);
    }
};
// @lc code=end

