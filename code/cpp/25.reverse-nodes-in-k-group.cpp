#include "node.h"
using namespace std;

/*
 * @lc app=leetcode.cn id=25 lang=cpp
 *
 * [25] Reverse Nodes in k-Group
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
    // 参考链接：https://leetcode-solution-leetcode-pp.gitbook.io/leetcode-solution/hard/25.reverse-nodes-in-k-groups
    ListNode* reverseKGroup(ListNode* head, int k) {
        if (!head || k == 1) {
            return head;
        }

        ListNode* dummy = new ListNode(0, head);
        dummy->next = head;

        ListNode* start = dummy;
        ListNode* end = head;
        int count = 0;
        while (end) {
            count++;
            if (count % k == 0) {
                start = reverse(start, end->next);
                end = start->next;
            } else {
                end = end->next;
            }
        }
        return dummy->next;
    }

    ListNode* reverse(ListNode* start, ListNode* end) {
        ListNode* curr = start->next;
        ListNode* prev = start;
        ListNode* first = curr;
        while (curr != end){
            ListNode* temp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = temp;
        }
        start->next = prev;
        first->next = curr;
        return first;
    }
};
// @lc code=end

