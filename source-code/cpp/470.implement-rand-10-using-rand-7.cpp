using namespace std;

/*
 * @lc app=leetcode.cn id=470 lang=cpp
 *
 * [470] Implement Rand10() Using Rand7()
 */

// @lc code=start
// The rand7() API is already defined for you.
// int rand7();
// @return a random integer in the range 1 to 7

class Solution {
public:
    int rand10() {
        while (1) {
            // (randX() - 1)*Y + randY() 可以等概率的生成[1, X * Y]范围的随机数
            int x = (rand7() - 1) * 7 + rand7(); // 生成 1 - 49 的随机数
            if (x <= 40) {
                return x % 10 + 1;
            }
        }
    }

    // rand3()构造rand18()
    int rand18() {
        while (1) {
            int x = (rand9() - 1) * 2 + rand3();
            if (x <= 18) {
                return x;
            }
        }
    }

    int rand9() {
        while (1) {
            return (rand3() - 1) * 3 + rand3();
        }
    }
};
// @lc code=end

