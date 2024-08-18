#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=165 lang=cpp
 *
 * [165] Compare Version Numbers
 */

// @lc code=start
class Solution {
public:
    int compareVersion(string version1, string version2) {
        int m = version1.size();
        int n = version2.size();
        for (int i = 0, j = 0; i < m || j < n; i++, j++) {
            int a = 0;
            int b = 0;
            while (i < m && version1[i] != '.') {
                a = a * 10 + (version1[i] - '0'); // 字符转数字：version1[i] - '0'
                i++;
            }
            while (j < n && version2[j] != '.') {
                b = b * 10 + (version2[j] - '0');
                j++;
            }
            if (a != b) {
                return a < b ? -1 : 1;
            }
        }
        return 0;
    }
};
// @lc code=end

