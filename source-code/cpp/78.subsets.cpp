#include <cassert>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=78 lang=cpp
 *
 * [78] Subsets
 */

// @lc code=start
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> path;
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        dfs(nums, 0);
        return ans;
    }

    void dfs(vector<int>& nums, int startIndex) {
        ans.push_back({path});

        for (int i = startIndex; i < nums.size(); i++) {
            path.push_back(nums[i]);
            dfs(nums, i + 1);
            path.pop_back();
        }
    }
};
// @lc code=end

