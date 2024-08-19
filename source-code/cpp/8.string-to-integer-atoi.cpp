#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=8 lang=cpp
 *
 * [8] String to Integer (atoi)
 */

// @lc code=start
class Solution {
public:
    int myAtoi(string s) {
        int i = 0, sign = 1, res = 0;
        // 跳过前导空格
        while (i < s.size() && s[i] == ' ') i++;
        // 处理符号
        if (i < s.size() && (s[i] == '-' || s[i] == '+')) {
            sign = (s[i++] == '-') ? -1 : 1;
        }
        // 处理数字
        while (i < s.size() && isdigit(s[i])) {
            int digit = s[i++] - '0';
            // 检查溢出
            if (res > (INT_MAX - digit) / 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            res = res * 10 + digit;
        }
        return sign * res;
    }

    // 更易读的写法
    int myAtoi2(string s) {
        int n = s.size();
        if (n == 0) {
            return 0;
        }
        int i = 0; //开始读取数字的地方
        while (i < n && s[i] == ' ') {
            i++;
        }
        // 仅包含空格
        if (i == n) {
            return 0;
        }
        int sign = 1; // 正负号

        if (s[i] == '-') {
            sign = -1;
            i++;
        } else if (s[i] == '+') {
            i++;
        }
        
        int res = 0;
        for (; i < n; i++) {
            if (s[i] < '0' || s[i] > '9') {
                break;
            }
            int digit = s[i] - '0';
            // 检查溢出
            if (res > (INT_MAX - digit) / 10) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }

            res = res * 10 + digit;
        }

        return sign * res;
    }
};
// @lc code=end

