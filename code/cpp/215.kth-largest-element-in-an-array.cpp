#include <functional>
#include <queue>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=215 lang=cpp
 *
 * [215] Kth Largest Element in an Array
 */

// @lc code=start
class Solution {
public:
  int findKthLargest(vector<int> &nums, int k) {
    priority_queue<int, vector<int>, greater<int>>
        pq; // 默认是最大堆，所以需要 std::greater<int> 来构建一个最小堆。
    for (int num : nums) {
      pq.push(num);
      if (pq.size() > k) {
        pq.pop();
      }
    }
    return pq.top();
  }
};
// @lc code=end
