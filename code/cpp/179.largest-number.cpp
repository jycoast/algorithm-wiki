#include <algorithm>
#include <string>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=179 lang=cpp
 *
 * [179] Largest Number
 */

// @lc code=start
class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> strNums;
        for (int num : nums) {
            strNums.push_back(std::to_string(num));
        }
        sort(strNums.begin(), strNums.end(), [](string& a, string& b) {
            return a + b > b + a;
        });
        
        if (strNums[0] == "0") {
            return "0";
        }
        
        string ans;
        for (string str : strNums) {
            ans += str;
        }
        return ans;
    }
};
// @lc code=end

