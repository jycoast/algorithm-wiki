#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=32 lang=cpp
 *
 * [32] Longest Valid Parentheses
 */

// @lc code=start
class Solution {
public:
    int longestValidParentheses(string s) {
        int n = s.size();
        int ans;
        string stk;
        for (int i = 0; i < n; i++) {
            if (s[i] == '(') {
                stk.push_back('(');
            } else {
                stk.pop_back();

            }
        }
        return ans;
    }
};
// @lc code=end

