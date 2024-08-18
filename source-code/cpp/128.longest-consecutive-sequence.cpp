#include <algorithm>
#include <type_traits>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=128 lang=cpp
 *
 * [128] Longest Consecutive Sequence
 */

// @lc code=start
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        int n = nums.size();
        if (n <= 1) {
            return n;
        }
        sort(nums.begin(), nums.end());
        int ans = 1; // 最少也有一个数字，所以这里初始化为1
        int t = 1;
        for (int i = 1; i < n; i++) {
            if (nums[i] == nums[i - 1]) {
                continue;
            }
            if (nums[i] == nums[i - 1] + 1) {
                ans = max(ans, ++t);
            } else {
                t = 1;
            }
        }
        return ans;
    }
};
// @lc code=end

