#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=283 lang=cpp
 *
 * [283] Move Zeroes
 */

// @lc code=start
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int left = 0;
        for (int j = 0; j < nums.size(); j++) {
            if (nums[j] != 0) {
                nums[left] = nums[j];
                left++;
            }
        }

        for (int i = left; i < nums.size(); i++) {
            nums[i] = 0;
        }
    }
};
// @lc code=end

