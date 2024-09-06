/*
 * @lc app=leetcode.cn id=283 lang=java
 *
 * [283] Move Zeroes
 */

// @lc code=start
class Solution {
    public void moveZeroes(int[] nums) {
        int left = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] != 0) {
                nums[left++] = nums[right];
            }
        }

        for (int i = left; i < nums.length; i++) {
            nums[i] = 0;
        }
    }
}
// @lc code=end

