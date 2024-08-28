#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=143 lang=cpp
 *
 * [143] Reorder List
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
    void reorderList(ListNode* head) {
        // 快慢指针找到链表中点
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // curr 指向右半部分链表
        ListNode* curr = slow->next;
        slow->next = nullptr;

        // 反转右半部分链表
        ListNode* pre = nullptr;
        while (curr) {
            ListNode* temp = curr->next;
            curr->next = pre;
            pre = curr;
            curr = temp;
        }

        curr = head;

        // 此时 curr、pre分别指向链表左右两半的第一个节点
        // 合并
        while (pre) {
            ListNode* temp = pre->next;
            pre->next = curr->next;
            curr->next = pre;
            curr = pre->next;
            pre = temp;
        }
    }
};
// @lc code=end

