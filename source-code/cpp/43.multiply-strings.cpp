#include <string>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=43 lang=cpp
 *
 * [43] Multiply Strings
 */

// @lc code=start
class Solution {
public:
    string multiply(string num1, string num2) {
        if (num1 == "0" || num2 == "0") {
            return "0";
        }
        int m = num1.size(), n = num2.size();
        vector<int> arr(m + n);

        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int a = num1[i] - '0';
                int b = num2[j] - '0';
                arr[i + j + 1] += a * b;
            }
        }

        for (int i = arr.size() - 1; i > 0; i--) {
            arr[i - 1] += arr[i] / 10;
            arr[i] %= 10;
        }

        string ans;
        int i = arr[0] == 0 ? 1 : 0;
        for (; i < arr.size(); i++) {
            ans += '0' + arr[i];
        }
        return ans;
    }
};
// @lc code=end

