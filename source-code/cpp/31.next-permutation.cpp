#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=31 lang=cpp
 *
 * [31] Next Permutation
 */

// @lc code=start
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        // eg: 1,5,3,6,4,1 -> 1,5,4,1,3,6
        // 从后往前，找到第一个降序的元素
        int n = nums.size();
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) { // 找到的就是3这个元素
            i--;
        }

        if (i >= 0) { // 从后往前。找到第一个比3大的元素,即4
            int j = n - 1;
            while (nums[j] <= nums[i]) {
                j--;
            }

            // 找到了以后交换这两个数，此时 1,5,4,6,3,1
           swap(nums, i, j);
        }

        // 按照这种方式，此时i后面其实是一个降序序列，将 i 后面的所有元素反转，使得这个部分变为最小的排列。
        for (int j = i + 1, k = n - 1; j < k; ++j, --k) {
            swap(nums, j, k);
        }
    }

    void swap(vector<int>& nums, int i, int j) {
        int temp = nums[j];
        nums[j] = nums[i];
        nums[i] = temp;
    }
};
// @lc code=end

