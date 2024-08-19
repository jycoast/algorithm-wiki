#include <stack>
#include <string>
using namespace std;

/*
 * @lc app=leetcode.cn id=227 lang=cpp
 *
 * [227] Basic Calculator II
 */

// @lc code=start
class Solution {
public:
  int calculate(string s) {
    stack<int> myStack;
    char sign = '+';
    int res = 0, tmp = 0;
    for (unsigned int i = 0; i < s.size(); i++) {
        if (isdigit(s[i]))
            tmp = 10*tmp + s[i]-'0';
        if (!isdigit(s[i]) && !isspace(s[i]) || i == s.size()-1) {
            if (sign == '-')
                myStack.push(-tmp);
            else if (sign == '+')
                myStack.push(tmp);
            else {
                int num;
                if (sign == '*' )
                    num = myStack.top()*tmp;
                else
                    num = myStack.top()/tmp;
                myStack.pop();
                myStack.push(num);
            } 
            sign = s[i];
            tmp = 0;
        }
    }
    while (!myStack.empty()) {
        res += myStack.top();
        myStack.pop();
    }
    return res;
}
};
// @lc code=end

