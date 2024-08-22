#include <stack>
#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=224 lang=cpp
 *
 * [224] Basic Calculator
 */

// @lc code=start
class Solution {
public:
    int calculate(string s) {
        stack<int> nums;
        stack<int> ops;
        int ans = 0;
        int sign = 1;
        int n = s.size();
        for (int i = 0; i < n; i++) {
            char ch = s[i];
            if (isdigit(ch)) {
                int num = 0;
                while (i < n && isdigit(s[i])) {
                    num = num * 10 + (s[i] - '0');
                    i++;
                }
                i--; // 修正 i，防止多走一步
                ans += sign * num; // 根据符号更新结果
            } else if (ch == '+') {
                sign = 1;
            } else if (ch == '-') {
                sign = -1;
            } else if (ch == '(') {
                nums.push(ans);
                ops.push(sign);
                ans = 0;
                sign = 1;
            } else if (ch == ')') {
                ans = nums.top() + ops.top() * ans;
                nums.pop();
                ops.pop();
            }
        }

        return ans;
    }
};
// @lc code=end

