#include <algorithm>
#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=415 lang=cpp
 *
 * [415] Add Strings
 */

// @lc code=start
class Solution {
public:
    string addStrings(string num1, string num2) {
        int i = num1.size() - 1, j = num2.size() - 1;
        string ans;
        int carry = 0;
        while (i >= 0 || j >= 0 || carry != 0) {
            int a = i < 0 ? 0 : num1[i] - '0';
            int b = j < 0 ? 0 : num2[j] - '0';
            carry += a + b;
            ans += to_string(carry % 10);
            carry /= 10;
            i--;
            j--;
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
// @lc code=end

