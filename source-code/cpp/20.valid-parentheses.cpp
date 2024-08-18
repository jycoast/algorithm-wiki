using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=20 lang=cpp
 *
 * [20] Valid Parentheses
 */

// @lc code=start
class Solution {
public:
  bool isValid(string s) {
    string stk; // 用字符串来模拟栈
    for (char c : s) {
      if (c == '(' || c == '[' || c == '{') {
        stk.push_back(c);
      } else if (stk.empty() || !isMath(stk.back(), c)) {
        return false;
      } else {
        stk.pop_back();
      }
    }
    return stk.empty();
  }

  bool isMath(char l, char r) {
    return (l == '(' && r == ')') || (l == '[' && r == ']') ||
           (l == '{' && r == '}');
  }
};
// @lc code=end