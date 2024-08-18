#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=92 lang=cpp
 *
 * [92] Reverse Linked List II
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
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        if (!head || left == right) { // 只有一个节点或者 位置left 等于 位置right 此时无须反转
            return head;
        }
        ListNode* dummy = new ListNode(0, head);
        ListNode* pre = dummy;
        ListNode* curr = head;
        // 从头节点出发，直到curr 指向需要翻转的节点
        for (int i = 0; i < left - 1; i++) {
            pre = pre->next;
            curr = curr->next;
        }
        // 开始翻转
        for (int i = 0; i < right - left; i++) {
            ListNode* temp = curr->next;
            curr->next = temp->next;
            temp->next = pre->next;
            pre->next = temp;
        }

        return dummy->next;
    }
};
// @lc code=end

