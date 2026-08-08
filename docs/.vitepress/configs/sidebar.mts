export default {
  '/': getLeetCode(),
  '/template/': getTemplate()
}

function getLeetCode() {
  return [
    {
      text: '数组',
      collapsed: false,
      items: [
        { text: "1. 两数之和", link: "/leetcode/two-sum" },
        { text: "283. 移动零", link: "/leetcode/move-zeroes" },
        { text: "704. 二分查找", link: "/leetcode/binary-search" },
        { text: "88. 合并两个有序数组", link: "/leetcode/merge-sorted-array" },
        { text: "560. 和为 K 的子数组", link: "/leetcode/subarray-sum-equals-k" },
        { text: "128. 最长连续序列", link: "/leetcode/longest-consecutive-sequence" },
        { text: "209. 长度最小的子数组", link: "/leetcode/minimum-size-subarray-sum" },
        { text: "15. 三数之和", link: "/leetcode/3sum" },
        { text: "33. 搜索旋转排序数组", link: "/leetcode/search-in-rotated-sorted-array" },
        { text: "34. 在排序数组中查找元素的第一个和最后一个位置", link: "/leetcode/find-first-and-last-position-of-element-in-sorted-array" },
        { text: "179. 最大数", link: "/leetcode/largest-number" },
        { text: "162. 寻找峰值", link: "/leetcode/find-peak-element" },
        { text: "31. 下一个排列", link: "/leetcode/next-permutation" },
        { text: "56. 合并区间", link: "/leetcode/merge-intervals" },
        { text: "215. 数组中的第K个最大元素", link: "/leetcode/kth-largest-element-in-an-array" },
        { text: "912. 排序数组", link: "/leetcode/sort-an-array" },
        { text: "4. 寻找两个正序数组的中位数", link: "/leetcode/median-of-two-sorted-arrays" },
      ]
    },
    {
      text: '字符串',
      collapsed: true,
      items: [
        { text: "415. 字符串相加", link: "/leetcode/add-strings" },
        { text: "14. 最长公共前缀", link: "/leetcode/longest-common-prefix" },
        { text: "43. 字符串相乘", link: "/leetcode/multiply-strings" },
        { text: "8. 字符串转换整数 (atoi)", link: "/leetcode/string-to-integer-atoi" },
        { text: "151. 反转字符串中的单词", link: "/leetcode/reverse-words-in-a-string" },
        { text: "394. 字符串解码", link: "/leetcode/decode-string" },
        { text: "139. 单词拆分", link: "/leetcode/word-break" },
        { text: "165. 比较版本号", link: "/leetcode/compare-version-numbers" },
        { text: "3. 无重复字符的最长子串", link: "/leetcode/longest-substring-without-repeating-characters" },
        { text: "76. 最小覆盖子串", link: "/leetcode/minimum-window-substring" },
      ]
    },
    {
      text: '链表',
      collapsed: true,
      items: [
        { text: "206. 反转链表", link: "/leetcode/reverse-linked-list" },
        { text: "141. 环形链表", link: "/leetcode/linked-list-cycle" },
        { text: "142. 环形链表 II", link: "/leetcode/linked-list-cycle-ii" },
        { text: "160. 相交链表", link: "/leetcode/intersection-of-two-linked-lists" },
        { text: "21. 合并两个有序链表", link: "/leetcode/merge-two-sorted-lists" },
        { text: "83. 删除排序链表中的重复元素", link: "/leetcode/remove-duplicates-from-sorted-list" },
        { text: "234. 回文链表", link: "/leetcode/palindrome-linked-list" },
        { text: "面试题 22. 链表中倒数第 k 个节点", link: "/leetcode/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof" },
        { text: "92. 反转链表 II", link: "/leetcode/reverse-linked-list-ii" },
        { text: "82. 删除排序链表中的重复元素 II", link: "/leetcode/remove-duplicates-from-sorted-list-ii" },
        { text: "148. 排序链表", link: "/leetcode/sort-list" },
        { text: "2. 两数相加", link: "/leetcode/add-two-numbers" },
        { text: "19. 删除链表的倒数第 N 个结点", link: "/leetcode/remove-nth-node-from-end-of-list" },
        { text: "24. 两两交换链表中的节点", link: "/leetcode/swap-nodes-in-pairs" },
        { text: "143. 重排链表", link: "/leetcode/reorder-list" },
        { text: "23. 合并 K 个升序链表", link: "/leetcode/merge-k-sorted-lists" },
        { text: "25. K 个一组翻转链表", link: "/leetcode/reverse-nodes-in-k-group" },
      ]
    },
    {
      text: '栈与队列',
      collapsed: true,
      items: [
        { text: "20. 有效的括号", link: "/leetcode/valid-parentheses" },
        { text: "232. 用栈实现队列", link: "/leetcode/implement-queue-using-stacks" },
        { text: "155. 最小栈", link: "/leetcode/min-stack" },
        { text: "32. 最长有效括号", link: "/leetcode/longest-valid-parentheses" },
        { text: "239. 滑动窗口最大值", link: "/leetcode/sliding-window-maximum" },
        { text: "227. 基本计算器 II", link: "/leetcode/basic-calculator-ii" },
        { text: "224. 基本计算器", link: "/leetcode/basic-calculator" },
      ]
    },
    {
      text: '二叉树',
      collapsed: true,
      items: [
        { text: "94. 二叉树的中序遍历", link: "/leetcode/binary-tree-inorder-traversal" },
        { text: "101. 对称二叉树", link: "/leetcode/symmetric-tree" },
        { text: "110. 平衡二叉树", link: "/leetcode/balanced-binary-tree" },
        { text: "543. 二叉树的直径", link: "/leetcode/diameter-of-binary-tree" },
        { text: "104. 二叉树的最大深度", link: "/leetcode/maximum-depth-of-binary-tree" },
        { text: "226. 翻转二叉树", link: "/leetcode/invert-binary-tree" },
        { text: "112. 路径总和", link: "/leetcode/path-sum" },
        { text: "98. 验证二叉搜索树", link: "/leetcode/validate-binary-search-tree" },
        { text: "102. 二叉树的层序遍历", link: "/leetcode/binary-tree-level-order-traversal" },
        { text: "103. 二叉树的锯齿形层序遍历", link: "/leetcode/binary-tree-zigzag-level-order-traversal" },
        { text: "199. 二叉树的右视图", link: "/leetcode/binary-tree-right-side-view" },
        { text: "129. 求根节点到叶节点数字之和", link: "/leetcode/sum-root-to-leaf-numbers" },
        { text: "662. 二叉树最大宽度", link: "/leetcode/maximum-width-of-binary-tree" },
        { text: "113. 路径总和 II", link: "/leetcode/path-sum-ii" },
        { text: "105. 从前序与中序遍历序列构造二叉树", link: "/leetcode/construct-binary-tree-from-preorder-and-inorder-traversal" },
        { text: "124. 二叉树中的最大路径和", link: "/leetcode/binary-tree-maximum-path-sum" },
        { text: "236. 二叉树的最近公共祖先", link: "/leetcode/lowest-common-ancestor-of-a-binary-tree" },
      ]
    },
    {
      text: '回溯法',
      collapsed: true,
      items: [
        { text: "78. 子集", link: "/leetcode/subsets" },
        { text: "46. 全排列", link: "/leetcode/permutations" },
        { text: "39. 组合总和", link: "/leetcode/combination-sum" },
        { text: "22. 括号生成", link: "/leetcode/generate-parentheses" },
        { text: "93. 复原 IP 地址", link: "/leetcode/restore-ip-addresses" },
      ]
    },
    {
      text: '动态规划',
      collapsed: true,
      items: [
        { text: "70. 爬楼梯", link: "/leetcode/climbing-stairs" },
        { text: "121. 买卖股票的最佳时机", link: "/leetcode/best-time-to-buy-and-sell-stock" },
        { text: "62. 不同路径", link: "/leetcode/unique-paths" },
        { text: "64. 最小路径和", link: "/leetcode/minimum-path-sum" },
        { text: "221. 最大正方形", link: "/leetcode/maximal-square" },
        { text: "53. 最大子数组和", link: "/leetcode/maximum-subarray" },
        { text: "152. 乘积最大子数组", link: "/leetcode/maximum-product-subarray" },
        { text: "718. 最长重复子数组", link: "/leetcode/maximum-length-of-repeated-subarray" },
        { text: "42. 接雨水", link: "/leetcode/trapping-rain-water" },
        { text: "139. 单词拆分", link: "/leetcode/word-break" },
        { text: "5. 最长回文子串", link: "/leetcode/longest-palindromic-substring" },
        { text: "122. 买卖股票的最佳时机 II", link: "/leetcode/best-time-to-buy-and-sell-stock-ii" },
        { text: "322. 零钱兑换", link: "/leetcode/coin-change" },
        { text: "300. 最长递增子序列", link: "/leetcode/longest-increasing-subsequence" },
        { text: "1143. 最长公共子序列", link: "/leetcode/longest-common-subsequence" },
        { text: "72. 编辑距离", link: "/leetcode/edit-distance" },
      ]
    },
    {
      text: '图论',
      collapsed: true,
      items: [
        { text: "240. 搜索二维矩阵 II", link: "/leetcode/search-a-2d-matrix-ii" },
        { text: "54. 螺旋矩阵", link: "/leetcode/spiral-matrix" },
        { text: "48. 旋转图像", link: "/leetcode/rotate-image" },
        { text: "200. 岛屿数量", link: "/leetcode/number-of-islands" },
        { text: "695. 岛屿的最大面积", link: "/leetcode/max-area-of-island" },
      ]
    },
    {
      text: '数学',
      collapsed: true,
      items: [
        { text: "69. x 的平方根", link: "/leetcode/sqrtx" },
        { text: "169. 多数元素", link: "/leetcode/majority-element" },
        { text: "470. 用 Rand7() 实现 Rand10()", link: "/leetcode/implement-rand10-using-rand7" },
        { text: "179. 最大数", link: "/leetcode/largest-number" },
        { text: "41. 缺失的第一个正数", link: "/leetcode/first-missing-positive" },
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
          { text: '滑动窗口', link: '/template/sliding-window' },
        ]
      }
    ]
}
