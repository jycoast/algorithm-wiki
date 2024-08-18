#include <vector>
#include <string>

using namespace std;

/*
 * @lc app=leetcode.cn id=22 lang=cpp
 *
 * [22] Generate Parentheses
 */

// @lc code=start
class Solution {
private:
    string path;
    vector<string> ans;

public:
    vector<string> generateParenthesis(int n) {
        dfs(0, 0, n);
        return ans;
    }

    void dfs(int l, int r, int n) {
        if (l > n || r > l || r > n) { // 如果左括号的数量大于 n 或右括号的数量大于左括号，则返回
            return;
        }

        if (path.size() == 2 * n) {
            ans.push_back(path);
            return; // 递归终止条件
        }

        for (int i = 0; i < 2; i++) {
            if (i == 0) {
                path.push_back('(');
                dfs(l + 1, r, n);
                path.pop_back();
            }
            if (i == 1) {
                path.push_back(')');
                dfs(l, r + 1, n);
                path.pop_back();
            }
        }
    }
};
// @lc code=end

