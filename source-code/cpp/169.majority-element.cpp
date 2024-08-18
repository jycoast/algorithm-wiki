#include <stdexcept>
#include <unordered_map>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=169 lang=cpp
 *
 * [169] Majority Element
 */

// @lc code=start
class Solution {
public:
    // 摩尔投票
    int majorityElement(vector<int>& nums) {
        unordered_map<int, int> t;
        for (int i = 0; i < nums.size(); i++) {
            t[nums[i]] = t[nums[i]] + 1;
        }

        for (const auto& entry: t) {
            if (2 * entry.second > nums.size()) {
                return entry.first;
            }
        }

        throw runtime_error("not found number");
    }

    // 摩尔投票
    int majorityElement2(vector<int>& nums) {
        int major = 0;
        int count = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (count == 0) {
                major = nums[i];
            }
            if (major == nums[i]) {
                count++;
            } else {
                count--;
            }
        }
        return major;
    }
};
// @lc code=end

