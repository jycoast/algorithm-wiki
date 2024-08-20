#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=695 lang=cpp
 *
 * [695] Max Area of Island
 */

// @lc code=start
class Solution {
private:
    int m;
    int n;
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        m = grid.size();
        if (m == 0) {
            return 0;
        }
        n = grid[0].size();
        int ans = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    int area = dfs(grid, i, j);
                    ans = max(area, ans);
                }
            }
        }
        return ans;
    }

    int dfs(vector<vector<int>>& grid, int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0) {
            return 0;
        }

        int area = 1;

        // Mark the cell as visited by setting it to 0
        grid[i][j] = 0;

        area += dfs(grid, i + 1, j);
        area += dfs(grid, i - 1, j);
        area += dfs(grid, i, j + 1);
        area += dfs(grid, i, j - 1);
        return area;
    }
};
// @lc code=end

