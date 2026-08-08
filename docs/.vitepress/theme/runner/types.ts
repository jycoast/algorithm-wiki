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
}

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
