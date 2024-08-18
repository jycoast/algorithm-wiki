#include <vector>
using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=46 lang=cpp
 *
 * [46] Permutations
 */

// @lc code=start
class Solution {
    vector<vector<int>> ans;
    vector<int> path;
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<bool> used(nums.size(), false);
        dfs(nums, used);
        return ans;
    }

    void dfs(vector<int>& nums, vector<bool>& used) {
        if (path.size() == nums.size()) {
            ans.push_back(path);
        }

        for (int i = 0; i < nums.size(); i++) {
            if (used[i] == true) { // path中已经收录过的元素，直接跳过
                continue;
            }
            used[i] = true;
            path.push_back(nums[i]);
            dfs(nums, used);
            path.pop_back();
            used[i] = false;
        }
    }
};
// @lc code=end

