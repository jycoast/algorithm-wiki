#include "node.h"
#include <stack>
using namespace std;

/*
 * @lc app=leetcode.cn id=234 lang=cpp
 *
 * [234] Palindrome Linked List
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
    // 快慢指针
    // 先找到中间节点，反转后半部分链表，比较前半部分和反转后的半部分
    bool isPalindrome(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head->next;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // 此时slow 指针刚好是中间节点
        ListNode* pre = nullptr;
        ListNode* curr = slow;
        while (curr) {
            ListNode* temp = curr->next;
            curr->next = pre;
            pre = curr;
            curr = temp;
        }

        // 总链表长度如果是奇数，head 比 pre 多一个节点
        while (head) {
            if (pre->val != head->val) {
                return false;
            }
            pre = pre->next;
            head = head->next;
        }

        return true;
    }

    // 使用栈
    bool isPalindrome2(ListNode* head) {
        stack<ListNode*> stk;
        ListNode* curr = head;
        while (curr) {
            stk.push(curr);
            curr = curr->next;
        }

        curr = head;
        while (!stk.empty()) {
            if (curr->val != stk.top()->val) {
                return false;
            }
            stk.pop();
            curr = curr->next;
        }
        return true;
    }
};
// @lc code=end

