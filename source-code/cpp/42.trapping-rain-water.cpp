#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=42 lang=cpp
 *
 * [42] Trapping Rain Water
 */

// @lc code=start
class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        vector<int> left(n);
        vector<int> right(n);

        left[0] = height[0]; // 左边最高的就是自己
        for (int i = 1; i < n; i++) {
            left[i] = max(height[i], left[i - 1]);
        }
        right[n - 1] = height[n - 1]; // 右边最高的就是自己
        for (int i = n - 2; i >= 0; i--) {
            right[i] = max(height[i], right[i + 1]);
        }

        int ans = 0;
        for (int i = 0; i < n; i++) {
            int area = min(left[i], right[i]) - height[i];
            if (area > 0) {
                ans += area;
            }
        }
        return ans;
    }
};
// @lc code=end

