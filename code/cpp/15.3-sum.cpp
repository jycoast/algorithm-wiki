#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=15 lang=cpp
 *
 * [15] 3Sum
 */

// @lc code=start
class Solution {
public:
    vector<vector<int>> threeSum(vector<int> &nums) {
        vector<vector<int>> ans;
        sort(nums.begin(), nums.end());
        int n = nums.size();
        for (int i = 0; i < n; i++) {
        if (i > 0 && nums[i - 1] == nums[i]) {
            continue;
        }
        int j = i + 1;
        int k = n - 1;
        while (j < k) {
            int sum = nums[i] + nums[j] + nums[k];
            if (sum == 0) {
                vector<int> t = {nums[i], nums[j], nums[k]};
                ans.push_back(t);
                j++;
                k--;
                // 跳过重复元素
                while (j < k && nums[j] == nums[j - 1]) {
                    j++;
                }
                while (j < k && nums[k] == nums[k + 1]) {
                    k--;
                }
            } else if (sum >= 0) {
                k--;
            } else {
                j++;
            }
        }
        }
        return ans;
    }
};
// @lc code=end
