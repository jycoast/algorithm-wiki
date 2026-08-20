/**
 * 轻量智能提示 —— CodeMirror 自定义补全源。
 *
 * 策略（不做 LSP，保持零额外体积）：
 * - Python：常用片段 + 语言自带的 globalCompletion / localCompletionSource
 * - Java：常用片段 + 内置关键字/常用类型补全（@codemirror/lang-java 仅提供语言解析，
 *   关键字列表在此手动维护，与官方 javaLanguage 的 autocomplete 数据等价）
 *
 * useEditor 通过 `autocompletion({ override })` 合并进 basicSetup（basicSetup 的
 * autocompletion 配置为空对象，后加带 override 的实例不冲突）。
 */
import { snippetCompletion, type Completion, type CompletionSource } from '@codemirror/autocomplete'
import { globalCompletion, localCompletionSource } from '@codemirror/lang-python'
import type { RunLang } from './types'

const PYTHON_SNIPPETS: Completion[] = [
  snippetCompletion('class Solution:\n\t${1:pass}', {
    label: 'class Solution',
    detail: '题目入口类',
    type: 'keyword',
  }),
  snippetCompletion('def ${1:method}(self, ${2}):\n\t${3}', {
    label: 'def',
    detail: '定义方法',
    type: 'function',
  }),
  snippetCompletion('for ${1:i} in range(${2:n}):\n\t${3}', {
    label: 'for range',
    detail: 'range 循环',
    type: 'keyword',
  }),
  snippetCompletion('if ${1:cond}:\n\t${2}', {
    label: 'if',
    detail: '条件分支',
    type: 'keyword',
  }),
  snippetCompletion('from typing import ${1:List}', {
    label: 'from typing',
    detail: '类型标注导入',
    type: 'module',
  }),
  snippetCompletion('import ${1:math}', {
    label: 'import',
    detail: '导入模块',
    type: 'module',
  }),
]

const JAVA_SNIPPETS: Completion[] = [
  snippetCompletion('class Solution {\n\t${1}\n}', {
    label: 'class Solution',
    detail: '题目入口类',
    type: 'keyword',
  }),
  snippetCompletion('public ${1:int} ${2:method}(${3}) {\n\t${4}\n\treturn ${5};\n}', {
    label: 'public',
    detail: '公开方法',
    type: 'function',
  }),
  snippetCompletion('for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n\t${3}\n}', {
    label: 'for',
    detail: 'for 循环',
    type: 'keyword',
  }),
  snippetCompletion('for (${1:T} ${2:x} : ${3:arr}) {\n\t${4}\n}', {
    label: 'for each',
    detail: '增强 for',
    type: 'keyword',
  }),
  snippetCompletion('import java.util.*;', {
    label: 'import',
    detail: '集合工具包导入',
    type: 'module',
  }),
  snippetCompletion('if (${1:cond}) {\n\t${2}\n}', {
    label: 'if',
    detail: '条件分支',
    type: 'keyword',
  }),
]

/** Java 关键字 / 常用类型（等价于官方 autocomplete 语言数据，覆盖日常刷题） */
const JAVA_KEYWORDS: Completion[] = [
  'public', 'private', 'protected', 'static', 'final', 'abstract',
  'void', 'int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short',
  'class', 'interface', 'extends', 'implements', 'new', 'return', 'this', 'super',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue',
  'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'null', 'true', 'false',
  'String', 'List', 'Map', 'Set', 'Queue', 'Deque',
  'ArrayList', 'LinkedList', 'HashMap', 'HashSet', 'LinkedHashMap', 'TreeMap',
  'ArrayDeque', 'PriorityQueue', 'Arrays', 'Collections', 'Math', 'Objects',
].map((kw) => ({ label: kw, type: 'keyword', detail: 'Java' }))

/** 按前缀过滤的通用片段源 */
function snippetSource(lang: RunLang): CompletionSource {
  const list = lang === 'python' ? PYTHON_SNIPPETS : JAVA_SNIPPETS
  return (context) => {
    const word = context.matchBefore(/[\w]*$/)
    if (!word || (word.from === word.to && !context.explicit)) return null
    return { from: word.from, options: list.filter((c) => c.label.startsWith(word.text)) }
  }
}

/** Java 关键字补全源 */
const javaKeywordSource: CompletionSource = (context) => {
  const word = context.matchBefore(/[\w]*$/)
  if (!word || (word.from === word.to && !context.explicit)) return null
  return { from: word.from, options: JAVA_KEYWORDS.filter((c) => c.label.startsWith(word.text)) }
}

/** 某语言的完整补全源列表（片段 + 语言自带），供 autocompletion override 使用 */
export function completionSourcesFor(lang: RunLang): CompletionSource[] {
  if (lang === 'python') return [snippetSource('python'), globalCompletion, localCompletionSource]
  return [snippetSource('java'), javaKeywordSource]
}
