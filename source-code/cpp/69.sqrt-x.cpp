using namespace std;
/*
 * @lc app=leetcode.cn id=69 lang=cpp
 *
 * [69] Sqrt(x)
 */

// @lc code=start
class Solution {
public:
    int mySqrt(int x) {
        int left = 0;
        int right = x;
        while (left < right) {
            int mid = (left + right + 1ll) >> 1;
            if (mid > x / mid) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }
        return left;
    }
};
// @lc code=end

