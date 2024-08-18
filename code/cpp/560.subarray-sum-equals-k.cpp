#include <unordered_map>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=560 lang=cpp
 *
 * [560] Subarray Sum Equals K
 */

// @lc code=start
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        int ans = 0;
        int s = 0;
        unordered_map<int, int> cnt{{0, 1}};
        for (int num : nums) {
            s += num;
            s += cnt[s - k];
            ++cnt[s];
        }
        return ans;   
    }
};
// @lc code=end

