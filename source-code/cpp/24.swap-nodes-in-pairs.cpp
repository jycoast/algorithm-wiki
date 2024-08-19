using namespace std;
#include "node.h"

/*
 * @lc app=leetcode.cn id=24 lang=cpp
 *
 * [24] Swap Nodes in Pairs
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
    ListNode* swapPairs(ListNode* head) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* pre = dummy;
        ListNode* curr = head;
        while (curr && curr->next) {
            // 反转节点
            ListNode* temp = curr->next;
            curr->next = temp->next;
            temp->next = curr;
            pre->next = temp; 

            // 继续剩余的节点
            pre = curr;
            curr = curr->next;
        }
        return dummy->next;
    }
};
// @lc code=end

