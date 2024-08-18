#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=39 lang=cpp
 *
 * [39] Combination Sum
 */

// @lc code=start
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> path;
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        dfs(candidates, target, 0, 0);
        return ans;
    }

    void dfs(vector<int>& candidates, int target, int startIndex, int sum) {
        if (sum == target) {
            ans.emplace_back(path);
        }

        for (int i = startIndex; i < candidates.size(); i++) {
            if (sum + candidates[i] > target) {
                break;
            }
            path.push_back(candidates[i]);
            dfs(candidates, target, i, sum + candidates[i]);
            path.pop_back();
        }
    }
};
// @lc code=end

