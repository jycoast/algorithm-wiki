#include <deque>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=239 lang=cpp
 *
 * [239] Sliding Window Maximum
 */

// @lc code=start
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        vector<int> ans;
        // 用于存储当前窗口中有可能成为最大值的元素的索引
        deque<int> deque;
        for (int i = 0; i < nums.size(); i++) {
            if (!deque.empty() && i - k + 1 > deque.front()) {
                deque.pop_front();
            }

            while (!deque.empty() && nums[deque.back()] <= nums[i]) {
                deque.pop_back();
            }

            deque.push_back(i);

            if (i >= k - 1) {
                ans.push_back(nums[deque.front()]);
            }
        }
        return ans;
    }
};
// @lc code=end

