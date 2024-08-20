#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=162 lang=cpp
 *
 * [162] Find Peak Element
 */

// @lc code=start
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            int mid = (left + right) >> 1;
            if (nums[mid] > nums[mid + 1]) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
    
    // 直接找最大值也可以
    int findPeakElement2(vector<int>& nums) {
        if (nums.size() == 1) {
            return 0;
        }
        int maxNumber = nums[0];
        int ans;
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] > maxNumber) {
                maxNumber = nums[i];
                ans = i;
            }
        }
        return ans;
    }
};
// @lc code=end

