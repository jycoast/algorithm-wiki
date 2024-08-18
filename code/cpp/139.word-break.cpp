#include <cstring>
#include <string>
#include <unordered_set>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=139 lang=cpp
 *
 * [139] Word Break
 */

// @lc code=start
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> words(wordDict.begin(), wordDict.end());
        int n = s.size();
        bool dp[n + 1];
        memset(dp, false, sizeof(dp)); // memset用于将一段内存空间设置为指定的值。
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && words.find(s.substr(j, i - j)) != words.end()) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
};
// @lc code=end

