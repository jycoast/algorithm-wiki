#include <stack>
using namespace std;
/*
 * @lc app=leetcode.cn id=232 lang=cpp
 *
 * [232] Implement Queue using Stacks
 */

// @lc code=start
class MyQueue {
public:
    MyQueue() {

    }
    
    void push(int x) {
        stk1.push(x);
    }
    
    int pop() {
        if (stk2.empty()) {
            transfer(stk1, stk2);
        }
        int top = stk2.top();
        stk2.pop();
        return top;
    }
    
    int peek() {
        if (stk2.empty()) {
            transfer(stk1, stk2);
        }
        return stk2.top();
    }
    
    bool empty() {
        if (stk2.empty()) {
            transfer(stk1, stk2);
        }
        return stk2.empty();
    }

    // 将第一个栈中的所有元素，转移到另外一个栈中
    void transfer(stack<int>& stk1, stack<int>& stk2) {
        while(!stk1.empty()) {
            int top = stk1.top();
            stk2.push(top);
            stk1.pop();
        }
    }
private:
    stack<int> stk1;
    stack<int> stk2;
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue* obj = new MyQueue();
 * obj->push(x);
 * int param_2 = obj->pop();
 * int param_3 = obj->peek();
 * bool param_4 = obj->empty();
 */
// @lc code=end

