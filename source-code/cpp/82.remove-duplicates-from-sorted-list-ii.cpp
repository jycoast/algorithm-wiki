#include "node.h"
using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=82 lang=cpp
 *
 * [82] Remove Duplicates from Sorted List II
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* prev = dummy;
        ListNode* curr = head;
        while (curr) {
            while (curr->next && curr->val == curr->next->val) {
                curr = curr->next;
            }

            if (prev->next == curr) {
                prev = curr;  // 没有重复项
            } else {
                prev->next = curr->next; // 有重复项
            }
            curr = curr->next;
        }
        return dummy->next;
    }
};
// @lc code=end

