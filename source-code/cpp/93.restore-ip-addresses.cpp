#include <string>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=93 lang=cpp
 *
 * [93] Restore IP Addresses
 */

// @lc code=start
class Solution {
private:
    vector<string> ans;
public:
    vector<string> restoreIpAddresses(string s) {
        dfs(s, 0, 0);
        return ans;
    }

    void dfs(string& s, int startIndex, int count) {
        if (count == 3) {
            if (isValid(s, startIndex, s.size() - 1)) {
                ans.push_back(s);
            }
            return;
        }

        for (int i = startIndex; i < s.length(); i++) {
            if (isValid(s, startIndex, i)) {
                s.insert(s.begin() + i + 1, '.');
                count++;
                dfs(s, i + 2, count);
                count--;
                s.erase(s.begin() + i + 1);
            } else {
                break;
            }
        }
    }

    bool isValid(string& s, int start, int end) {
                if (start > end) {
            return false;
        }
        if (s[start] == '0' && start != end) { // 0开头的数字不合法
                return false;
        }
        int num = 0;
        for (int i = start; i <= end; i++) {
            if (s[i] > '9' || s[i] < '0') { // 遇到非数字字符不合法
                return false;
            }
            num = num * 10 + (s[i] - '0');
            if (num > 255) { // 如果大于255了不合法
                return false;
            }
        }
        return true;
    }
};
// @lc code=end

