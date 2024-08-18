#include "node.h"
using namespace std;
/*
 * @lc app=leetcode.cn id=2 lang=cpp
 *
 * [2] Add Two Numbers
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
		// 注意题目中的链表是逆序的
		ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
			int carry = 0;
			ListNode* dummy = new ListNode(0);
			ListNode* curr = dummy;
			while (l1 || l2 || carry != 0) {
				if (l1) {
					carry = carry + l1->val;
					l1 = l1->next;
				}
				if (l2) {
					carry = carry + l2->val;
					l2 = l2->next;
				}

				if (carry > 9) {
					ListNode* node = new ListNode(carry - 10);
					curr->next = node;
					carry = 1;
				} else {
					ListNode* node = new ListNode(carry);
					curr->next = node;
					carry = 0;
				}
				curr = curr->next;
			}

			return dummy->next;;
		}
  };

// @lc code=end

