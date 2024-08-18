#include "node.h"
#include <iterator>
#include <streambuf>
using namespace std;
#include <cstddef>
#include <string>
/*
 * @lc app=leetcode.cn id=206 lang=cpp
 *
 * [206] Reverse Linked List
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
    // 调整指针方向
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) {
            return head;
        }
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
        return head;
    }

    // 头插法
    ListNode* reverseList2(ListNode* head) {
        // 链表为空，或者只有一个节点
        if (!head || !head->next) {
            return head;
        }

        ListNode* newHead = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = newHead;
            newHead = curr; // 更新头节点
            curr = next;
        }
        return newHead;
    }
};
// @lc code=end

