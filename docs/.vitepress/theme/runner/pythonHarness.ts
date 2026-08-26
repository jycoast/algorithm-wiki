/**
 * Python 判题 harness（Pyodide）。
 *
 * 流程：预置 typing 导入 → exec 用户代码（定义 class Solution）→
 * 逐用例调用 sol.<entry>(*args) → 结果以 JSON 字符串写入全局 __RESULT__。
 * 结果不经过 stdout，用户 print 的内容独立收集，便于调试展示。
 */

import { compareTestCase } from './compare.ts'
import type { JudgeMode, RunReport, TestCase } from './types.ts'
import { getPyodide, type PyodideLike } from './pyodideLoader.ts'

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/

function buildHarness(entry: string, mode: JudgeMode | undefined): string {
  // entry 为受控标识符（前端校验过），可安全插值
  // 输入转换：把 list 参数转成 ListNode/TreeNode（void-first-arg / tree-output 不改输入）
  const preConvert =
    mode === 'link' || mode === 'link-void'
      ? '_tc["input"] = [_to_link_arg(x) for x in _tc["input"]]'
      : mode === 'link-lists'
        ? '_tc["input"] = [[_to_list_node(e) for e in x] if isinstance(x, list) else x for x in _tc["input"]]'
        : mode === 'tree'
          ? '_tc["input"] = [_to_tree_node(x) if isinstance(x, list) else x for x in _tc["input"]]'
          : mode === 'tree-lca'
            ? '_tc["input"] = _to_lca_args(_tc["input"])'
            : mode === 'link-cycle' || mode === 'link-cycle-ii'
              ? '_tc["input"] = [_build_cycle(_tc["input"][0], _tc["input"][1] if len(_tc["input"]) > 1 else -1)]'
              : mode === 'link-intersection'
                ? '_tc["input"] = _build_intersection(_tc["input"])'
                : ''
  // ops：按 LeetCode 的 [ops, args] 序列实例化类并依次调用，收集返回值序列（None 统一为 null）
  const call =
    mode === 'ops'
      ? [
          '_op_seq, _op_args = tc["input"][0], tc["input"][1]',
          '_obj = None',
          '_seq = []',
          'for _op, _arg in zip(_op_seq, _op_args):',
          `    if _op == ${JSON.stringify(entry)}:`,
          `        _obj = ${entry}(*_arg)`,
          '        _seq.append(None)',
          '    else:',
          '        _v = getattr(_obj, _op)(*_arg)',
          '        _seq.append(None if _v is None else _v)',
          '_r["actual"] = _seq',
        ].join('\n        ')
      : mode === 'void-first-arg'
        ? `_r["actual"] = tc["input"][0]\n        sol.${entry}(*tc["input"])`
        : mode === 'link-void'
          ? `sol.${entry}(*tc["input"])\n        _r["actual"] = _from_link_or_tree(tc["input"][0])`
          : `_r["actual"] = sol.${entry}(*tc["input"])`
  // 输出反序列化：ListNode/TreeNode → list；tree-lca / link-cycle-ii / link-intersection 输出节点 val（None 原样）
  const postConvert =
    mode === 'link' || mode === 'link-lists' || mode === 'tree' || mode === 'tree-output'
      ? 'if "actual" in _r:\n            _r["actual"] = _from_link_or_tree(_r["actual"])'
      : mode === 'tree-lca' || mode === 'link-cycle-ii' || mode === 'link-intersection'
        ? 'if "actual" in _r and _r["actual"] is not None:\n            _r["actual"] = _r["actual"].val'
        : ''
  return [
    'from typing import List, Dict, Optional, Tuple, Deque',
    'import json',
    'import functools',
    'import itertools',
    'from functools import cmp_to_key, reduce',
    'from itertools import pairwise, accumulate',
    'import bisect',
    'import heapq',
    'import collections',
    'import random',
    'import math',
    'import string',
    'import sys',
    'import re',
    'from bisect import bisect_left, bisect_right, insort',
    'from collections import deque, Counter, defaultdict, OrderedDict',
    'from heapq import heapify, heappush, heappop, heappushpop, heapreplace, nlargest, nsmallest',
    'from random import randint, randrange, choice, shuffle, seed',
    'from math import gcd, sqrt, floor, ceil',
    'from itertools import product, permutations, combinations, combinations_with_replacement, chain, count, cycle, groupby',
    'inf = float(\'inf\')',
    'nan = float(\'nan\')',
    '',
    // 链表节点 + 二叉树节点辅助类（仅在被 mode 触发时使用）
    'class ListNode:',
    '    def __init__(self, val=0, next=None):',
    '        self.val = val',
    '        self.next = next',
    'def _to_list_node(arr):',
    '    if not isinstance(arr, list) or not arr: return None',
    '    head = ListNode()',
    '    cur = head',
    '    for v in arr:',
    '        cur.next = ListNode(v)',
    '        cur = cur.next',
    '    return head.next',
    'def _from_list_node(node):',
    '    out = []',
    '    while node:',
    '        out.append(node.val)',
    '        node = node.next',
    '    return out',
    'def _to_link_arg(x):',
    '    # 链表参数：flat list → 单个 ListNode；list of lists → 多链表头（如 mergeKLists）',
    '    if not isinstance(x, list):',
    '        return x',
    '    if x and all(isinstance(e, list) for e in x):',
    '        return [_to_list_node(e) for e in x]',
    '    return _to_list_node(x)',
    '',
    'class TreeNode:',
    '    def __init__(self, val=0, left=None, right=None):',
    '        self.val = val',
    '        self.left = left',
    '        self.right = right',
    'def _to_tree_node(arr):',
    '    if not isinstance(arr, list) or not arr: return None',
    '    nodes = [None if v is None else TreeNode(v) for v in arr]',
    '    kids = nodes[::-1]',
    '    root = kids.pop()',
    '    for node in nodes:',
    '        if node:',
    '            if kids: node.left = kids.pop()',
    '            if kids: node.right = kids.pop()',
    '    return root',
    'def _from_tree_node(node):',
    '    if not node: return []',
    '    out, q = [], [node]',
    '    while q:',
    '        n = q.pop(0)',
    '        if n is None: out.append(None); continue',
    '        out.append(n.val)',
    '        q.append(n.left); q.append(n.right)',
    '    while out and out[-1] is None: out.pop()',
    '    return out',
    'def _find_node(root, val):',
    '    if not root: return None',
    '    if root.val == val: return root',
    '    return _find_node(root.left, val) or _find_node(root.right, val)',
    'def _to_lca_args(inp):',
    '    # LCA：root 建树，p/q 为节点值 → 找到树中对应节点引用',
    '    root = _to_tree_node(inp[0])',
    '    return [root] + [_find_node(root, v) if isinstance(v, int) and not isinstance(v, bool) else v for v in inp[1:]]',
    'def _build_cycle(arr, pos):',
    '    # 环形链表：head 数组 + pos（>=0 时把尾节点指向下标 pos 的节点）',
    '    head = _to_list_node(arr)',
    '    if head is None or pos < 0: return head',
    '    tail = head',
    '    while tail.next is not None: tail = tail.next',
    '    p = head',
    '    for _ in range(pos): p = p.next',
    '    tail.next = p',
    '    return head',
    'def _build_intersection(inp):',
    '    # 相交链表：listA/listB 两条链，val>0 时共享 val 起始的尾段（同一组节点对象）',
    '    a_arr, b_arr = inp[0], inp[1]',
    '    val = inp[2] if len(inp) > 2 else 0',
    '    if not val or val == 0:',
    '        return [_to_list_node(a_arr), _to_list_node(b_arr)]',
    '    ia = a_arr.index(val)',
    '    ib = b_arr.index(val)',
    '    shared = _to_list_node(a_arr[ia:])',
    '    def _cat(head, tail):',
    '        if head is None: return tail',
    '        h = head',
    '        while h.next is not None: h = h.next',
    '        h.next = tail',
    '        return head',
    '    a = _cat(_to_list_node(a_arr[:ia]), shared)',
    '    b = _cat(_to_list_node(b_arr[:ib]), shared)',
    '    return [a, b]',
    'def rand7():',
    '    # LeetCode 470 题面内置的全局 rand7()（仅在 rand10 解法引用时用到）',
    '    return random.randint(1, 7)',
    'def _from_link_or_tree(v):',
    '    # 链表的 actual 是单节点；树的 actual 是根节点；都按 _from_* 反序列化',
    '    # None（空表/空树）→ []，与期望的 null 表示保持一致',
    '    if v is None: return []',
    '    if hasattr(v, "next") and hasattr(v, "val"): return _from_list_node(v)',
    '    if hasattr(v, "left") and hasattr(v, "right") and hasattr(v, "val"): return _from_tree_node(v)',
    '    return v',
    '',
    'TASKS = json.loads(TASKS_JSON)',
    'for _tc in TASKS:',
    `    ${preConvert || 'pass'}`,
    '',
    'exec(CODE)',
    '',
    // ops 模式：用户代码定义的是类（MinStack/MyQueue），不需要实例化 Solution
    mode === 'ops' ? '' : 'sol = Solution()',
    '__out = []',
    'for tc in TASKS:',
    '    try:',
    `        _r = {}`,
    `        ${call}`,
    postConvert
      ? '        ' + postConvert
      : '',
    '        __out.append(_r)',
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
  mode?: JudgeMode,
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
    return { ...base, ok: compareTestCase(item.actual, testcases[i]), actual: item.actual }
  })
  const passed = results.filter((r) => r.ok).length

  const report: RunReport = { results, passed, total: results.length }
  const userPrint = stdout.join('\n').trim()
  if (userPrint) report.stdout = userPrint
  return report
}
