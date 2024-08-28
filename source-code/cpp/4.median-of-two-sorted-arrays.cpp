#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=4 lang=cpp
 *
 * [4] Median of Two Sorted Arrays
 */

// @lc code=start
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        
    }

    // 暴力法
    double findMedianSortedArrays2(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size(), n = nums2.size();
        vector<int> mergeNums(m + n) ;
        int i = 0, j = 0, index = 0;
        while (i < m || j < n) {
            if (i < m && (j >= n || nums1[i] <= nums2[j])) {
                mergeNums[index++] = nums1[i++];
            } else {
                mergeNums[index++] = nums2[j++];
            }
        }
        int length = mergeNums.size();
        // 除以 2.0，是因为两个数的和是奇数，那么结果会被截断，导致精度丢失
        return length % 2 == 0 ? 
        (mergeNums[length / 2] + mergeNums[length / 2 - 1]) / 2.0 : mergeNums[length / 2];
    }
};
// @lc code=end

