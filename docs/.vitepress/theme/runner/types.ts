/**
 * 判题运行层 —— 共享类型定义
 *
 * testcase 格式（每题 frontmatter）：
 *   entry: twoSum                     # 要调用的解法方法名（class Solution 上的实例方法）
 *   testcases:                        # 位置参数按方法签名顺序
 *     - input: [[2, 7, 11, 15], 9]    # -> twoSum(nums, target)
 *       output: [0, 1]
 */

/** 单个测试用例 */
export interface TestCase {
  /** 位置参数数组，按 entry 方法签名顺序展开调用 */
  input: unknown[]
  /** 期望输出（与返回值深比较） */
  output: unknown
  /** 多解：任选其一即判对（如最长回文子串 "bab"/"aba"） */
  accept?: unknown[]
  /** 结果数组顺序无关（集合比较，如 subsets 按任意顺序返回） */
  unordered?: boolean
}

/**
 * 判题模式：
 * - void-first-arg：原地修改第一个数组参数，判 input[0]（如 moveZeroes / rotate）
 * - link：输入 list ↔ ListNode，输出反序列化回 list
 * - link-lists：参数是 ListNode 数组（mergeKLists），每个元素建链表；空数组保留为 []
 * - tree：输入 list ↔ TreeNode，输出反序列化回 list
 * - link-void：原地修改 ListNode，判 input[0]（如 reorderList）
 * - tree-output：输入是数组、输出是树（如 buildTree(preorder, inorder)）
 * - tree-lca：root 建树、p/q 按值转节点，输出判节点 val（最近公共祖先）
 * - link-cycle：head 数组 + pos 建环（环形链表，判 bool）
 * - link-cycle-ii：head 数组 + pos 建环，判环入口节点 val（环形链表 II）
 * - link-intersection：两个链表数组 + 相交值，共享尾段建链，判相交节点 val（相交链表）
 * - ops：操作式题目（entry 为类名，如 MinStack / MyQueue），按 ops+args 序列调用并判返回值序列
 */
export type JudgeMode =
  | 'void-first-arg'
  | 'link'
  | 'link-lists'
  | 'tree'
  | 'link-void'
  | 'tree-output'
  | 'tree-lca'
  | 'link-cycle'
  | 'link-cycle-ii'
  | 'link-intersection'
  | 'ops'

/** 单个用例的判定结果 */
export interface CaseResult {
  /** 用例序号（从 1 起，用于展示） */
  index: number
  ok: boolean
  /** 该用例运行出错（抛异常）时记录的错误信息 */
  error?: string
  /** 期望输出（展示用） */
  expected?: unknown
  /** 实际输出（展示用） */
  actual?: unknown
}

/** 一次「运行」的完整报告 */
export interface RunReport {
  /** 逐用例结果 */
  results: CaseResult[]
  passed: number
  total: number
  /** 编译 / 语法错误（如 Java 编译失败、Python exec 失败） */
  compileError?: string
  /** 用户代码 print / System.out 的输出（供调试） */
  stdout?: string
}

/** 每题运行所需数据（problems-data.ts 生成的项） */
export interface ProblemRunnerData {
  entry: string
  testcases: TestCase[]
  solutions: {
    python?: string
    java?: string
  }
}

export type RunLang = 'python' | 'java'
