/*
 * @lc app=leetcode.cn id=1 lang=cpp
 *
 * [1] Two Sum
 */

// @lc code=start
#include <unordered_map>
#include <vector>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> hash_map;
        for (int i = 0; i < nums.size(); i++) {
            int temp = target - nums[i];
            if (hash_map.find(temp) != hash_map.end()) {
                return {hash_map[temp], i};
            }
            hash_map[nums[i]] = i;
        }
        return {};
    }
};
// @lc code=end

