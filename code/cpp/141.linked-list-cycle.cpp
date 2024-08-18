#include <unordered_set>
#include "node.h"

using namespace std;

/*
 * @lc app=leetcode.cn id=141 lang=cpp
 *
 * [141] Linked List Cycle
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
    // 快慢指针
    bool hasCycle(ListNode *head) {
        if (!head || !head->next) {
            return false;
        }

        ListNode* slow = head;
        ListNode* fast = head->next;

        while (slow != fast) {
            if (!fast || !fast->next) {
                return false;
            }
            slow = slow->next;
            fast = fast->next->next;
        }

        return true;
    }

    // 使用Set求解
    bool hasCycle2(ListNode *head) {
        unordered_set<ListNode*> set;
        while (head) {
            if (set.find(head) != set.end()) {
                return true;
            }
            set.insert(head); // 先插入当前节点，再移动到下一个节点
            head = head->next;
        }
        return false;
    }
};
// @lc code=end

