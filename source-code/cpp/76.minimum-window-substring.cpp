#include <climits>
#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=76 lang=cpp
 *
 * [76] Minimum Window Substring
 */

// @lc code=start
class Solution {
public:
    string minWindow(string s, string t) {
        int need[128]{};
        int window[128]{};
        int m = s.size(), n = t.size();
        for (char& c : t) {
            ++need[c];
        }
        // 用于记录当前窗口中包含的t的字符个数
        int count = 0;
        // 窗口的起始索引
        int j = 0;
        // 最短子串的起始索引
        int k = -1;
        // 最短子串的长度
        int mi = 1 << 30;
        for (int i = 0; i < m; i++) {
            ++window[s[i]];
            // 如果当前字符在window数组中的计数等于在need数组中的计数
            if (need[s[i]] >= window[s[i]]) {
                ++count;
            }
            // 说明当前窗口包含了t中所有的字符
            while (count == n) {
                if (i - j + 1 < mi) {
                    mi = i - j + 1;
                    k = j;
                }

                if (need[s[j]] >= window[s[j]]) {
                    --count;
                }
                --window[s[j++]];
            }
           
        }
        return k < 0 ? "" : s.substr(k, mi);

    }
};
// @lc code=end

