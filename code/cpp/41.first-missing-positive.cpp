#include <unordered_set>
#include <vector>
using namespace std;
/*
 * @lc app=leetcode.cn id=41 lang=cpp
 *
 * [41] First Missing Positive
 */

// @lc code=start
class Solution {
public:
    // 原地交换
    int firstMissingPositive(vector<int>& nums) {
        
    }

    // 使用Set
    int firstMissingPositive2(vector<int>& nums) {
        unordered_set<int> set;
        for (int i = 0; i < nums.size(); i++) {
            set.insert(nums[i]);
        }

        for (int i = 1; i <= nums.size(); i++) {
            if (set.find(i) == set.end()) {
                return i;
            }
        }

        return nums.size() + 1;
    }
};
// @lc code=end

