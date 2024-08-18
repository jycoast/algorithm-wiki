#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=142 lang=cpp
 *
 * [142] Linked List Cycle II
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while(fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            // 快慢指针相遇，此时从 head节点和相遇点出发，同时查找直到相遇
            if (slow == fast) {
               ListNode* index1 = fast;
               ListNode* index2 = head;
               while (index1 != index2) {
                    index1 = index1->next;
                    index2 = index2->next;
               }
               return index1; // index1 或者 index2 均可
            }
        }
        return nullptr;
    }
};
// @lc code=end

