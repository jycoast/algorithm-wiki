#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=912 lang=cpp
 *
 * [912] Sort an Array
 */

// @lc code=start
class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        // quickSort(nums, 0, nums.size() - 1);
        heapSort(nums);
        return nums;
    }

    void heapSort(vector<int>& nums) {
        int n = nums.size();
        for (int i = n / 2; i >= 0; i--) {
            heapify(nums, n, i);
        }

        for (int i = n -1; i > 0; i--) {
            std::swap(nums[0], nums[i]);
            heapify(nums, i, 0);
        }
    }

    void heapify(vector<int>& nums, int n, int i) {
        int largest = i;
        int left = 2 * i + 1; // 左子节点
        int right = 2 * i + 2; // 右子节点
        
        if (left < n && nums[left] > nums[largest]) {
            largest = left;
        }

        if (right < n && nums[right] > nums[largest]) {
            largest = right;
        }

        if (largest != i) {
            std::swap(nums[i], nums[largest]);
            heapify(nums, n, largest);
        }
    }

    void quickSort(vector<int>& nums, int left, int right) {
        if (left >= right) {
            return;
        }
        
        // 中间元素作为基准元素
        int x = nums[(left + right) >> 1];

        int i = left - 1, j = right + 1;
        while (i < j) {
            // 从左向右，找到首个大于基准元素的元素
            while (nums[++i] < x) {
            }
            // 从右向左，找到首个小于基准元素的元素
            while (nums[--j] > x) {
            }
            if (i < j) {
                swap(nums, i, j);
            }
        }

        quickSort(nums, left, j);
        quickSort(nums, j + 1, right);
    }

    void swap(vector<int>& nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
};
// @lc code=end

