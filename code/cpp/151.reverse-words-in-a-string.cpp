#include <algorithm>
#include <string>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=151 lang=cpp
 *
 * [151] Reverse Words in a String
 */

// @lc code=start
class Solution {
public:
    string reverseWords(string s) {
        int i = 0;
        int n = s.length();
        vector<string> words;
        while (i < n) {
            while (i < n && s[i] == ' ') { // 去除空格
                i++;
            }
            string word;
            int j = i;
            while (j < n && s[j] != ' ') { // 找到第一个非空格的下标
                word.push_back(s[j]);
                j++;
            }
            if (i < j) {
                words.push_back(word);
            }
            i = j;
        }
        
        reverse(words.begin(), words.end());

        string ans;
        for (int k = 0; k < words.size(); ++k) {
            if (k > 0) {
                ans += " ";
            }
            ans += words[k];
        }
        return ans;
    }
};
// @lc code=end

