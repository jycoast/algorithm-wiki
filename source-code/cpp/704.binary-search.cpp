#include <iterator>
#include <vector>
#include <cstddef>
#include <string>

using namespace std;

/*
 * @lc app=leetcode.cn id=704 lang=cpp
 *
 * [704] Binary Search
 */

// @lc code=start
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        for (int i = 0; i < nums.size(); i++) {
            int mid = (right + left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return -1;
    }
};
// @lc code=end

