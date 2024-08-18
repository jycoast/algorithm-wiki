#include <string>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=14 lang=cpp
 *
 * [14] Longest Common Prefix
 */

// @lc code=start
class Solution {
public:
    // 纵向扫描
    string longestCommonPrefix(vector<string>& strs) {
        int n = strs.size();
        for (int i = 0; i < strs[0].size(); i++) {
            for (int j = 0; j < n; j++) {
                if (strs[0][i] != strs[j][i]) {
                    return strs[0].substr(0, i);
                }
            }
        }
        return strs[0];
    }
    // 还可以：横向扫描 分治 二分查找
};
// @lc code=end

