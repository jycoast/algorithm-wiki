---
comments: true
difficulty: 中等
edit_url: https://github.com/doocs/leetcode/edit/main/solution/0100-0199/0155.Min%20Stack/README.md
tags:
    - 栈
    - 设计
---

<!-- problem:start -->

# [155. 最小栈](https://leetcode.cn/problems/min-stack)


<!-- description:start -->

<p>设计一个支持 <code>push</code> ，<code>pop</code> ，<code>top</code> 操作，并能在常数时间内检索到最小元素的栈。</p>

<p>实现 <code>MinStack</code> 类:</p>

<ul>
	<li><code>MinStack()</code> 初始化堆栈对象。</li>
	<li><code>void push(int val)</code> 将元素val推入堆栈。</li>
	<li><code>void pop()</code> 删除堆栈顶部的元素。</li>
	<li><code>int top()</code> 获取堆栈顶部的元素。</li>
	<li><code>int getMin()</code> 获取堆栈中的最小元素。</li>
</ul>

<p>&nbsp;</p>

<p><strong>示例 1:</strong></p>

<pre>
<strong>输入：</strong>
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

<strong>输出：</strong>
[null,null,null,null,-3,null,0,-2]

<strong>解释：</strong>
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --&gt; 返回 -3.
minStack.pop();
minStack.top();      --&gt; 返回 0.
minStack.getMin();   --&gt; 返回 -2.
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>-2<sup>31</sup>&nbsp;&lt;= val &lt;= 2<sup>31</sup>&nbsp;- 1</code></li>
	<li><code>pop</code>、<code>top</code> 和 <code>getMin</code> 操作总是在 <strong>非空栈</strong> 上调用</li>
	<li><code>push</code>,&nbsp;<code>pop</code>,&nbsp;<code>top</code>, and&nbsp;<code>getMin</code>最多被调用&nbsp;<code>3 * 10<sup>4</sup></code>&nbsp;次</li>
</ul>

<!-- description:end -->


<!-- solution:start -->

## 方法一：双栈

我们用两个栈来实现，其中 `stk1` 用来存储数据，`stk2` 用来存储当前栈中的最小值。初始时，`stk2` 中存储一个极大值。

-   当我们向栈中压入一个元素 $x$ 时，我们将 $x$ 压入 `stk1`，并将 `min(x, stk2[-1])` 压入 `stk2`。
-   当我们从栈中弹出一个元素时，我们将 `stk1` 和 `stk2` 的栈顶元素都弹出。
-   当我们要获取当前栈中的栈顶元素时，我们只需要返回 `stk1` 的栈顶元素即可。
-   当我们要获取当前栈中的最小值时，我们只需要返回 `stk2` 的栈顶元素即可。

每个操作的时间复杂度为 $O(1)$。整体的空间复杂度为 $O(n)$，其中 $n$ 为栈中元素的个数。

<!-- tabs:start -->
::: code-group

```java [Java]
class MinStack {
    private Deque<Integer> stk1 = new ArrayDeque<>();
    private Deque<Integer> stk2 = new ArrayDeque<>();

    public MinStack() {
        stk2.push(Integer.MAX_VALUE);
    }

    public void push(int val) {
        stk1.push(val);
        stk2.push(Math.min(val, stk2.peek()));
    }

    public void pop() {
        stk1.pop();
        stk2.pop();
    }

    public int top() {
        return stk1.peek();
    }

    public int getMin() {
        return stk2.peek();
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(val);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```



```cpp [C++]
class MinStack {
public:
    MinStack() {
        stk2.push(INT_MAX);
    }

    void push(int val) {
        stk1.push(val);
        stk2.push(min(val, stk2.top()));
    }

    void pop() {
        stk1.pop();
        stk2.pop();
    }

    int top() {
        return stk1.top();
    }

    int getMin() {
        return stk2.top();
    }

private:
    stack<int> stk1;
    stack<int> stk2;
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack* obj = new MinStack();
 * obj->push(val);
 * obj->pop();
 * int param_3 = obj->top();
 * int param_4 = obj->getMin();
 */
```

```ts [TypeScript]
class MinStack {
    stk1: number[];
    stk2: number[];

    constructor() {
        this.stk1 = [];
        this.stk2 = [Infinity];
    }

    push(val: number): void {
        this.stk1.push(val);
        this.stk2.push(Math.min(val, this.stk2[this.stk2.length - 1]));
    }

    pop(): void {
        this.stk1.pop();
        this.stk2.pop();
    }

    top(): number {
        return this.stk1[this.stk1.length - 1];
    }

    getMin(): number {
        return this.stk2[this.stk2.length - 1];
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
```


```python [Python]
class MinStack:
    def __init__(self):
        self.stk1 = []
        self.stk2 = [inf]

    def push(self, val: int) -> None:
        self.stk1.append(val)
        self.stk2.append(min(val, self.stk2[-1]))

    def pop(self) -> None:
        self.stk1.pop()
        self.stk2.pop()

    def top(self) -> int:
        return self.stk1[-1]

    def getMin(self) -> int:
        return self.stk2[-1]


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->