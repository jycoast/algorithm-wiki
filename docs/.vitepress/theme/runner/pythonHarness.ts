/**
 * Python 判题 harness（Pyodide）。
 *
 * 流程：预置 typing 导入 → exec 用户代码（定义 class Solution）→
 * 逐用例调用 sol.<entry>(*args) → 结果以 JSON 字符串写入全局 __RESULT__。
 * 结果不经过 stdout，用户 print 的内容独立收集，便于调试展示。
 */

import { compareOutput } from './compare.ts'
import type { RunReport, TestCase } from './types.ts'
import { getPyodide, type PyodideLike } from './pyodideLoader.ts'

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/

function buildHarness(entry: string, mode: 'void-first-arg' | undefined): string {
  // entry 为受控标识符（前端校验过），可安全插值
  const call =
    mode === 'void-first-arg'
      ? `sol.${entry}(*tc["input"])\n        __out.append({"actual": tc["input"][0]})`
      : `__out.append({"actual": sol.${entry}(*tc["input"])})`
  return [
    'from typing import List, Dict, Optional, Tuple, Deque',
    'import json',
    'inf = float(\'inf\')',
    'nan = float(\'nan\')',
    '',
    'TASKS = json.loads(TASKS_JSON)',
    '',
    'exec(CODE)',
    '',
    'sol = Solution()',
    '__out = []',
    'for tc in TASKS:',
    '    try:',
    `        ${call}`,
    '    except Exception as e:',
    '        __out.append({"error": str(e)})',
    '__RESULT__ = json.dumps(__out, default=str)',
    '',
  ].join('\n')
}

interface HarnessItem {
  actual?: unknown
  error?: string
}

export async function runPython(
  code: string,
  entry: string,
  testcases: TestCase[],
  runtime?: PyodideLike,
  mode?: 'void-first-arg',
): Promise<RunReport> {
  const total = testcases.length
  if (!IDENT.test(entry)) {
    return { results: [], passed: 0, total, compileError: `非法的入口方法名：${entry}` }
  }

  let pyodide: PyodideLike
  try {
    pyodide = runtime ?? (await getPyodide())
  } catch (e) {
    return { results: [], passed: 0, total, compileError: `加载 Python 运行时失败：${(e as Error).message}` }
  }

  const stdout: string[] = []
  pyodide.setStdout({ batched: (line) => stdout.push(line) })
  pyodide.globals.set('CODE', code)
  // 经 JSON 往返，避免 JS 对象在 Pyodide 里停留为 JsProxy（嵌套数组无法直接下标/解包）
  pyodide.globals.set('TASKS_JSON', JSON.stringify(testcases))

  let items: HarnessItem[]
  try {
    await pyodide.runPythonAsync(buildHarness(entry, mode))
    const raw = pyodide.globals.get('__RESULT__')
    items = (typeof raw === 'string' ? JSON.parse(raw) : []) as HarnessItem[]
  } catch (e) {
    return { results: [], passed: 0, total, compileError: (e as Error).message }
  }

  const results = items.map((item, i) => {
    const base = { index: i + 1, expected: testcases[i]?.output }
    if (item.error) return { ...base, ok: false, error: item.error }
    return { ...base, ok: compareOutput(item.actual, testcases[i]?.output), actual: item.actual }
  })
  const passed = results.filter((r) => r.ok).length

  const report: RunReport = { results, passed, total: results.length }
  const userPrint = stdout.join('\n').trim()
  if (userPrint) report.stdout = userPrint
  return report
}
