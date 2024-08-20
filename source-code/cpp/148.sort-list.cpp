#include "node.h"
#include <algorithm>
#include <vector>
using namespace std;

/*
 * @lc app=leetcode.cn id=148 lang=cpp
 *
 * [148] Sort List
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
    ListNode* sortList(ListNode* head) {
        vector<int> t;
        while (head) {
            t.push_back(head->val);
            head = head->next;
        }
        sort(t.begin(), t.end());

        ListNode* dummy = new ListNode(0);
        ListNode* curr = dummy;

        for (int value : t) {
            ListNode* node = new ListNode(value);
            curr->next = node;
            curr = curr->next;
        }

        return dummy->next;
    }
};
// @lc code=end

