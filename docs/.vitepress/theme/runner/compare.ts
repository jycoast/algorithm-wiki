/**
 * 判题输出深比较（LeetCode 风格）：
 * - 数组 / 嵌套 / 字符串 / 布尔 / null 精确匹配
 * - 数字：整数精确；浮点允许 1e-9 容差（相对 + 绝对）
 * - Python None → null（判等时 null 与 undefined 等价）
 */

import type { TestCase } from './types.ts'

const EPS = 1e-9

function closeNumbers(a: number, b: number): boolean {
  if (a === b) return true
  return Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b))
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** 集合比较用的规范化串：数组元素排序、对象键排序，顺序无关判等 */
function canonical(v: unknown): string {
  if (Array.isArray(v)) {
    return '[' + v.map(canonical).sort().join(',') + ']'
  }
  if (isPlainObject(v)) {
    return (
      '{' +
      Object.keys(v)
        .sort()
        .map((k) => JSON.stringify(k) + ':' + canonical(v[k]))
        .join(',') +
      '}'
    )
  }
  return JSON.stringify(v)
}

/** 顺序无关比较：outer 数组视为集合，元素（可嵌套）按规范化串判等 */
function compareUnordered(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false
    const as = actual.map(canonical).sort()
    const bs = expected.map(canonical).sort()
    return as.every((x, i) => x === bs[i])
  }
  return compareOutput(actual, expected)
}

/** 带元数据的判题：支持多解 accept / 无序 unordered */
export function compareTestCase(actual: unknown, tc: TestCase): boolean {
  if (Array.isArray(tc.accept) && tc.accept.length) {
    return tc.accept.some((x) => compareOutput(actual, x))
  }
  if (tc.unordered) {
    return compareUnordered(actual, tc.output)
  }
  return compareOutput(actual, tc.output)
}

export function compareOutput(actual: unknown, expected: unknown): boolean {
  // Python None / JS null / undefined 都视作「空」
  if (actual === null || actual === undefined) {
    return expected === null || expected === undefined
  }
  if (expected === null || expected === undefined) {
    return false
  }
  if (typeof actual === 'number' && typeof expected === 'number') {
    return closeNumbers(actual, expected)
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false
    return actual.every((v, i) => compareOutput(v, expected[i]))
  }
  if (isPlainObject(actual) && isPlainObject(expected)) {
    const ak = Object.keys(actual)
    const ek = Object.keys(expected)
    if (ak.length !== ek.length) return false
    return ak.every((k) => compareOutput(actual[k], expected[k]))
  }
  return actual === expected
}
