#include <cctype>
#include <stack>
#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=394 lang=cpp
 *
 * [394] Decode String
 */

// @lc code=start
class Solution {
public:
    string decodeString(string s) {
        // eg: 3[a]2[bc] -> aaabcbc
        string ans;
        stack<char> stack;
        for (char ch : s) {
            if (ch != ']') {
                stack.push(ch);
            } else {
                string tempStr;
                while (!stack.empty() && isalpha(stack.top())) {
                    tempStr = stack.top() + tempStr;
                    stack.pop();
                }

                stack.pop();
                
                string countStr;
                while (!stack.empty() && isdigit(stack.top())) {
                    countStr = stack.top() + countStr;
                    stack.pop();
                }

                int count = stoi(countStr);

                for (int i = 0; i < count; i++) {
                    // 不直接 ans = ans + tempStr; 是因为存在嵌套的情况：3[a2[c]]
                    for (char tempCh: tempStr) {
                        stack.push(tempCh);
                    }
                }
            }
        }

        while (!stack.empty()) {
            ans = stack.top() + ans;
            stack.pop();
        }
        return ans;
    }
};
// @lc code=end

