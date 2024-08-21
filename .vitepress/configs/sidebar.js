export default {
  '/': getLeetCode(),
  '/template/': getTemplate()
}

function getLeetCode() {
  return [
    {
      text: 'Top100',
      items: [
        {
            text: "3. 无重复字符的最长子串",
            link: "/leetcode/longest-substring-without-repeating-characters"
        },
        {
            text: "206. 反转链表",
            link: "/leetcode/reverse-linked-list"
        },
        {
            text: "215. 数组中的第K个最大元素",
            link: "/leetcode/kth-largest-element-in-an-array"
        },
        {
            text: "25. K 个一组翻转链表",
            link: "/leetcode/reverse-nodes-in-k-group"
        },
        {
            text: "15. 三数之和",
            link: "/leetcode/3sum"
        },
        {
            text: "53. 最大子数组和",
            link: "/leetcode/maximum-subarray"
        },
        {
            text: "912. 排序数组",
            link: "/leetcode/sort-an-array"
        },
        {
            text: "21. 合并两个有序链表",
            link: "/leetcode/merge-two-sorted-lists"
        },
        {
            text: "5. 最长回文子串",
            link: "/leetcode/longest-palindromic-substring"
        },
        {
            text: "1. 两数之和",
            link: "/leetcode/two-sum"
        },
        {
            text: "102. 二叉树的层序遍历",
            link: "/leetcode/binary-tree-level-order-traversal"
        },
        {
            text: "33. 搜索旋转排序数组",
            link: "/leetcode/search-in-rotated-sorted-array"
        },
        {
            text: "200. 岛屿数量",
            link: "/leetcode/number-of-islands"
        },
        {
            text: "121. 买卖股票的最佳时机",
            link: "/leetcode/best-time-to-buy-and-sell-stock"
        },
        {
            text: "20. 有效的括号",
            link: "/leetcode/valid-parentheses"
        },
        {
            text: "46. 全排列",
            link: "/leetcode/permutations"
        },
        {
            text: "141. 环形链表",
            link: "/leetcode/linked-list-cycle"
        },
        {
            text: "88. 合并两个有序数组",
            link: "/leetcode/merge-sorted-array"
        },
        {
            text: "236. 二叉树的最近公共祖先",
            link: "/leetcode/lowest-common-ancestor-of-a-binary-tree"
        },
        {
            text: "103. 二叉树的锯齿形层次遍历",
            link: "/leetcode/binary-tree-zigzag-level-order-traversal"
        },
        {
            text: "92. 反转链表 II",
            link: "/leetcode/reverse-linked-list-ii"
        },
        {
            text: "54. 螺旋矩阵",
            link: "/leetcode/spiral-matrix"
        },
        {
            text: "23. 合并K个排序链表",
            link: "/leetcode/merge-k-sorted-lists"
        },
        {
            text: "300. 最长上升子序列",
            link: "/leetcode/longest-increasing-subsequence"
        },
        {
            text: "160. 相交链表",
            link: "/leetcode/intersection-of-two-linked-lists"
        },
        {
            text: "415. 字符串相加",
            link: "/leetcode/add-strings"
        },
        {
            text: "143. 重排链表",
            link: "/leetcode/reorder-list"
        },
        {
            text: "42. 接雨水",
            link: "/leetcode/trapping-rain-water"
        },
        {
            text: "142. 环形链表 II",
            link: "/leetcode/linked-list-cycle-ii"
        },
        {
            text: "56. 合并区间",
            link: "/leetcode/merge-intervals"
        },
        {
            text: "124. 二叉树中的最大路径和",
            link: "/leetcode/binary-tree-maximum-path-sum"
        },
        {
            text: "72. 编辑距离",
            link: "/leetcode/edit-distance"
        },
        {
            text: "93. 复原IP地址",
            link: "/leetcode/restore-ip-addresses"
        },
        {
            text: "19. 删除链表的倒数第N个",
            link: "/leetcode/remove-nth-node-from-end-of-list"
        },
        {
            text: "1143. 最长公共子序列",
            link: "/leetcode/longest-common-subsequence"
        },
        {
            text: "82. 删除排序链表中的重复元素II",
            link: "/leetcode/remove-duplicates-from-sorted-list-ii"
        },
        {
            text: "94. 二叉树的中序遍历",
            link: "/leetcode/binary-tree-inorder-traversal"
        },
        {
            text: "4. 寻找两个正序数组的中位数",
            link: "/leetcode/median-of-two-sorted-arrays"
        },
        {
            text: "704. 二分查找",
            link: "/leetcode/binary-search"
        },
        {
            text: "199. 二叉树的右视图",
            link: "/leetcode/binary-tree-right-side-view"
        },
        {
            text: "148. 排序链表",
            link: "/leetcode/sort-list"
        },
        {
            text: "31. 下一个排列",
            link: "/leetcode/next-permutation"
        },
        {
            text: "232. 用栈实现队列",
            link: "/leetcode/implement-queue-using-stacks"
        },
        {
            text: "8. 字符串转换整数 (atoi)",
            link: "/leetcode/string-to-integer-atoi"
        },
        {
            text: "69. x 的平方根",
            link: "/leetcode/sqrtx"
        },
        {
            text: "22. 括号生成",
            link: "/leetcode/generate-parentheses"
        },
        {
            text: "2. 两数相加",
            link: "/leetcode/add-two-numbers"
        },
        {
            text: "70. 爬楼梯",
            link: "/leetcode/climbing-stairs"
        },
        {
            text: "239. 滑动窗口最大值",
            link: "/leetcode/sliding-window-maximum"
        },
        {
            text: "165. 比较版本号",
            link: "/leetcode/compare-version-numbers"
        },
        {
            text: "41. 缺失的第一个正数",
            link: "/leetcode/first-missing-positive"
        },
        {
            text: "322. 零钱兑换",
            link: "/leetcode/coin-change"
        },
        {
            text: "剑指 Offer 22. 链表中倒数第K个节点",
            link: "/leetcode/offer-22-lian-biao-zhong-dao-shu-di-k-ge-jie-dian"
        },
        {
            text: "76. 最小覆盖子串",
            link: "/leetcode/minimum-window-substring"
        },
        {
            text: "78. 子集",
            link: "/leetcode/subsets"
        },
        {
            text: "105. 从前序与中序遍历序列构造二叉树",
            link: "/leetcode/construct-binary-tree-from-preorder-and-inorder-traversal"
        },
        {
            text: "43. 字符串相乘",
            link: "/leetcode/multiply-strings"
        },
        {
            text: "155. 最小栈",
            link: "/leetcode/min-stack"
        },
        {
            text: "32. 最长有效括号",
            link: "/leetcode/longest-valid-parentheses"
        },
        {
            text: "151. 翻转字符串里的单词",
            link: "/leetcode/reverse-words-in-a-string"
        },
        {
            text: "129. 求根到叶子节点数字之和",
            link: "/leetcode/sum-root-to-leaf-numbers"
        },
        {
            text: "101. 对称二叉树",
            link: "/leetcode/symmetric-tree"
        },
        {
            text: "104. 二叉树的最大深度",
            link: "/leetcode/maximum-depth-of-binary-tree"
        },
        {
            text: "110. 平衡二叉树",
            link: "/leetcode/balanced-binary-tree"
        },
        {
            text: "39. 组合总和",
            link: "/leetcode/combination-sum"
        },
        {
            text: "543. 二叉树的直径",
            link: "/leetcode/diameter-of-binary-tree"
        },
        {
            text: "34. 在排序数组中查找元素",
            link: "/leetcode/find-first-and-last-position-of-element-in-sorted-array"
        },
        {
            text: "470. 用 Rand7() 实现 Rand10()",
            link: "/leetcode/implement-rand10-using-rand7"
        },
        {
            text: "48. 旋转图像",
            link: "/leetcode/rotate-image"
        },
        {
            text: "98. 验证二叉搜索树",
            link: "/leetcode/validate-binary-search-tree"
        },
        {
            text: "64. 最小路径和",
            link: "/leetcode/minimum-path-sum"
        },
        {
            text: "394. 字符串解码",
            link: "/leetcode/decode-string"
        },
        {
            text: "221. 最大正方形",
            link: "/leetcode/maximal-square"
        },
        {
            text: "113. 路径总和 II",
            link: "/leetcode/path-sum-ii"
        },
        {
            text: "240. 搜索二维矩阵 II",
            link: "/leetcode/search-a-2d-matrix-ii"
        },
        {
            text: "14. 最长公共前缀",
            link: "/leetcode/longest-common-prefix"
        },
        {
            text: "162. 寻找峰值",
            link: "/leetcode/find-peak-element"
        },
        {
            text: "128. 最长连续序列",
            link: "/leetcode/longest-consecutive-sequence"
        },
        {
            text: "234. 回文链表",
            link: "/leetcode/palindrome-linked-list"
        },
        {
            text: "112. 路径总和",
            link: "/leetcode/path-sum"
        },
        {
            text: "662. 二叉树最大宽度",
            link: "/leetcode/maximum-width-of-binary-tree"
        },
        {
            text: "169. 多数元素",
            link: "/leetcode/majority-element"
        },
        {
            text: "179. 最大数",
            link: "/leetcode/largest-number"
        },
        {
            text: "718. 最长重复子数组",
            link: "/leetcode/maximum-length-of-repeated-subarray"
        },
        {
            text: "83. 删除排序链表中的重复元素",
            link: "/leetcode/remove-duplicates-from-sorted-list"
        },
        {
            text: "227. 基本计算器 II",
            link: "/leetcode/basic-calculator-ii"
        },
        {
            text: "62. 不同路径",
            link: "/leetcode/unique-paths"
        },
        {
            text: "152. 乘积最大子数组",
            link: "/leetcode/maximum-product-subarray"
        },
        {
            text: "122. 买卖股票的最佳时机 II",
            link: "/leetcode/best-time-to-buy-and-sell-stock-ii"
        },
        {
            text: "226. 翻转二叉树",
            link: "/leetcode/invert-binary-tree"
        },
        {
            text: "139. 单词拆分",
            link: "/leetcode/word-break"
        },
        {
            text: "695. 岛屿的最大面积",
            link: "/leetcode/max-area-of-island"
        },
        {
            text: "560. 和为K的子数组",
            link: "/leetcode/subarray-sum-equals-k"
        },
        {
            text: "24. 两两交换链表中的节点",
            link: "/leetcode/swap-nodes-in-pairs"
        },
        {
            text: "209. 长度最小的子数组",
            link: "/leetcode/minimum-size-subarray-sum"
        },
        {
            text: "224. 基本计算器",
            link: "/leetcode/basic-calculator"
        }
      ]
    }
  ]
}

function getTemplate() {
    return [
        {
        text: '常用模板',
        items: [
          { text: '二分查找', link: '/template/index' },
          { text: '二叉树DFS', link: '/template/binary-tree-dfs' },
          { text: '二叉树BFS', link: '/template/binary-tree-bfs' },
          { text: '回溯算法', link: '/template/back-tracking' },
          { text: '分治算法', link: '/template/divide-conquer' },
          { text: '动态规划', link: '/template/dp' },
          { text: '字典树', link: '/template/trie' },
          { text: '单调栈', link: '/template/monotonic-stack' },
          { text: '滑动窗口', link: '/template/siding-window' },
        ]
      }
    ]
}