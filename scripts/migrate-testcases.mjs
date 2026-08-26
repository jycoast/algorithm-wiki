#!/usr/bin/env node
/**
 * 在线判题 frontmatter 迁移脚本
 * --------------------------------
 * 扫描 docs/leetcode/*.md，对缺少 entry + testcases 的题目：
 *   - entry: 从 class Solution 的第一个 def 方法名推断
 *   - testcases: 从 description 区域中每个 <pre>…输入/输出…</pre> 块抽取
 * 至少 2 个可解析示例才写回 frontmatter；不满足则跳过。
 *
 * 用法：node scripts/migrate-testcases.mjs [--dry-run]
 *   --dry-run 只打印决策，不写文件
 *
 * 完成后请跑 npm run gen:runner 重新生成 problems-data.ts 与 docs/solve/*.md，
 * 再用 npm run smoke 端到端校验官方解法。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LEETCODE_DIR = path.join(ROOT, 'docs', 'leetcode')

const DRY_RUN = process.argv.includes('--dry-run')
const FIX_MODES = process.argv.includes('--fix-modes')

/* ---------------- 复用的解析器（与 gen-runner-data.mjs 保持一致） ---------------- */

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return { body: content, fm: {} }
  try {
    return { body: content.slice(m[0].length), fm: yamlLoad(m[1]) ?? {} }
  } catch {
    return { body: content, fm: {} }
  }
}

function extractCode(content, lang, label) {
  const re = new RegExp('```' + lang + '\\s*\\[' + label + '\\]\\r?\\n([\\s\\S]*?)```', 'i')
  const m = content.match(re)
  return m ? m[1].replace(/\r?\n$/, '') : undefined
}

function extractDescription(content) {
  const m = content.match(/<!--\s*description:start\s*-->([\s\S]*?)<!--\s*description:end\s*-->/)
  return m ? m[1] : ''
}

function getPythonEntry(pythonSrc) {
  if (!pythonSrc) return undefined
  const classMatch = pythonSrc.match(/^\s*class\s+Solution\b[^:]*:([\s\S]*?)(?=^\s*class\s|\Z)/m)
  const body = classMatch ? classMatch[1] : pythonSrc
  const defMatch = body.match(/^\s*def\s+([A-Za-z_]\w*)\s*\(/m)
  if (!defMatch) return undefined
  const name = defMatch[1]
  if (!/^[A-Za-z_]\w*$/.test(name)) return undefined
  return name
}

function getEntryParamNames(pythonSrc, entry) {
  if (!pythonSrc || !entry) return []
  const re = new RegExp('def\\s+' + entry + '\\s*\\(\\s*([^)]*)\\)')
  const m = pythonSrc.match(re)
  if (!m) return []
  return m[1]
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && p !== 'self')
    .map((p) => p.split(/[:\s=]/)[0].trim())
    .filter((p) => /^[A-Za-z_]\w*$/.test(p))
}

/* ---------------- 输入/输出解析 ---------------- */

/** 用 Function 求值一个 JS 表达式（仅用于站点已知字面量，安全） */
function safeEval(expr) {
  // 限制：仅允许数字/字符串/数组/null/true/false/数学运算/对象字面量
  // 通过 Function 沙箱运行，无闭包无法访问外部变量
  return Function('"use strict"; return (' + expr + ')')()
}

/** 从 <pre> 块里抽出 "输入" / "输出" 两段；返回 { inputStr, outputStr } 或 null */
function extractInputOutput(preText) {
  // 抹掉 HTML 标签（不留空格，避免把 <code>the sky is blue</code> 拆成 " the sky is blue "）
  const text = preText
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  // 找 "输入：..." 与 "输出：..."
  const m = text.match(/输入\s*[：:]\s*(.+?)\s*输出\s*[：:]\s*([\s\S]+?)$/)
  if (!m) return null
  const inputStr = m[1].trim()
  const outputStr = m[2]
    .trim()
    .replace(/^输出\s*[：:]\s*/, '')
    .split(/\s*解释\s*[：:]/)[0]
    .split(/\s*说明\s*[：:]/)[0]
    .split(/\s*提示\s*[：:]/)[0]
    .trim()
  // 兜底：再切一次 m[2] 里的多余尾巴
  return { inputStr, outputStr }
}

/** 从 description HTML 中抽"示例块"：支持 <pre>…</pre> 与 <div class="example-block">…</div> 两种旧/新 LeetCode 模板 */
function extractExampleBlocks(descriptionHtml) {
  const blocks = []
  // 旧格式：<pre>...</pre>
  const preRe = /<pre>([\s\S]*?)<\/pre>/gi
  let m
  while ((m = preRe.exec(descriptionHtml)) !== null) {
    blocks.push(m[1])
  }
  // 新格式：<div class="example-block">...</div>
  const divRe = /<div\s+class="example-block"[^>]*>([\s\S]*?)<\/div>/gi
  while ((m = divRe.exec(descriptionHtml)) !== null) {
    // 把 <p> 输入：</p><p><span class="example-io">xxx</span></p> 之类的转成 <p>输入：xxx</p>
    const normalized = m[1]
      .replace(/<p>\s*<strong>\s*输入\s*[：:]\s*<\/strong>\s*<span class="example-io">([\s\S]*?)<\/span>\s*<\/p>/g, '<p>输入：$1</p>')
      .replace(/<p>\s*<strong>\s*输出\s*[：:]\s*<\/strong>\s*<span class="example-io">([\s\S]*?)<\/span>\s*<\/p>/g, '<p>输出：$1</p>')
    blocks.push(normalized)
  }
  return blocks
}

/** 把 "a = 1, b = [2, 3]" 解析成 { a: 1, b: [2, 3] }；若无变量名则返回 null */
function parseNamedInput(s) {
  // 必须形如 name = ...
  if (!/^[A-Za-z_]\w*\s*=/.test(s.trim())) return null
  // 把 "name = expr" 改写为 "name: expr"
  const objLit = '{ ' + s.replace(/([A-Za-z_]\w*)\s*=\s*/g, '$1: ') + ' }'
  try {
    return safeEval(objLit)
  } catch {
    return null
  }
}

/** 把一个裸字面量字符串解析为 JS 值 */
function parseBareValue(s) {
  const v = s.trim()
  if (v === '') return undefined
  try {
    return safeEval(v)
  } catch {
    return undefined
  }
}

/** 顶层逗号切分：忽略 [] / {} / () 与字符串内部的逗号 */
function splitTopLevel(s) {
  const parts = []
  let depth = 0
  let cur = ''
  let quote = null
  for (const ch of s) {
    if (quote) {
      cur += ch
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      cur += ch
      continue
    }
    if (ch === '[' || ch === '{' || ch === '(') depth++
    else if (ch === ']' || ch === '}' || ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur.trim()) parts.push(cur)
  return parts.map((p) => p.trim())
}

/**
 * 把 input 字符串映射到 entry 参数的位置值数组。
 * 支持三种格式：
 *   - 全命名：  nums = [1,2], target = 9
 *   - 全裸值：  [7,1,5,3,6,4]  或  [[1,2],[3,4]]
 *   - 混合：    [3,2,1,5,6,4], k = 2   （LeetCode 旧格式，首个参数裸写）
 * 命名键与签名不一致时（如 l1/l2 vs list1/list2）按「示例声明顺序 → 签名顺序」位置对应。
 */
function buildInputValues(inputStr, paramNames) {
  const parts = splitTopLevel(inputStr)
  const named = {}
  const positional = []
  for (const part of parts) {
    const m = part.match(/^([A-Za-z_]\w*)\s*=\s*([\s\S]+)$/)
    if (m) named[m[1]] = safeEval(m[2].trim())
    else positional.push(safeEval(part))
  }
  const undefinedVal = positional.some((v) => v === undefined) ||
    Object.values(named).some((v) => v === undefined)
  if (undefinedVal) return null
  if (paramNames.length === 0) return []
  // 优先按签名名精确匹配；其余按位置序填充
  const out = []
  let p = 0
  for (const name of paramNames) {
    if (name in named) out.push(named[name])
    else if (p < positional.length) out.push(positional[p++])
    else if (Object.keys(named).length === paramNames.length) {
      // 全部命名但键与签名不一致（l1/l2 vs list1/list2）：按声明顺序取
      out.push(Object.values(named)[out.length])
    } else return null
  }
  // 位置参数多余则丢弃（如裸值只有一个但签名多参，且第 2 参无命名 → 失败）
  if (positional.length - p > 0) return null
  return out
}

/** 从 description HTML 抽取所有示例块（<pre> 或 <div class="example-block">） */
function extractPreBlocks(descriptionHtml) {
  return extractExampleBlocks(descriptionHtml)
}

/**
 * 根据 entry 的 Python 签名 + slug 推断判题模式（不再依赖 slug 关键词，避免误判如
 * minimum-path-sum 命中 "path-sum" 被当树）。
 */
function inferMode(pythonSrc, entry, slug) {
  if (!pythonSrc || !entry) return undefined
  const defRe = new RegExp('def\\s+' + entry + '\\s*\\(([^)]*)\\)\\s*(->[^:]*)?\\s*:')
  const m = pythonSrc.match(defRe)
  if (!m) return undefined
  const params = m[1]
    .split(',')
    .map((p) => p.trim().split(/[:\s=]/)[0].trim())
    .filter((p) => p && p !== 'self' && /^[A-Za-z_]\w*$/.test(p))
  const ret = (m[2] || '').toLowerCase()
  const isHeadParam = (p) => /^(head|list1|list2|l1|l2|lists|headA|headB)$/.test(p)

  // 操作式题目（entry 是类名，如 MinStack / MyQueue）：判方法调用序列
  if (new RegExp('class\\s+' + entry + '\\b').test(pythonSrc)) return 'ops'
  // 环形链表：head + pos 建环
  if (slug === 'linked-list-cycle') return 'link-cycle'
  // 环形链表 II：head + pos 建环，返回环入口节点值
  if (slug === 'linked-list-cycle-ii') return 'link-cycle-ii'
  // 相交链表：headA/headB + 相交值，共享尾段建链
  if (slug === 'intersection-of-two-linked-lists') return 'link-intersection'
  // 链表数组：lists 空数组语义为「没有链表」，保留 []
  if (slug === 'merge-k-sorted-lists') return 'link-lists'
  // 原地修改（返回 None）→ 判第一个参数修改后的值
  if (ret.includes('none')) {
    return params.some(isHeadParam) ? 'link-void' : 'void-first-arg'
  }
  // 树输出：输入是 preorder/inorder 数组
  if (params.includes('preorder') || params.includes('inorder')) return 'tree-output'
  // 最近公共祖先：root, p, q
  if (params.includes('root') && params.includes('p') && params.includes('q')) return 'tree-lca'
  // 链表参数 → 输出判 ListNode
  if (params.some(isHeadParam)) return 'link'
  // 树根参数 → 输出判 TreeNode
  if (params.includes('root')) return 'tree'
  return undefined
}

/** 解析单个 description HTML，返回可用 testcases 数组（可能为空） */
function parseTestcasesFromDescription(descriptionHtml, paramNames) {
  const cases = []
  for (const pre of extractPreBlocks(descriptionHtml)) {
    const io = extractInputOutput(pre)
    if (!io) continue
    const { inputStr, outputStr } = io
    if (!inputStr || !outputStr) continue
    // 跳过多解示例（输出含「或」且不是字符串字面量一部分）
    if (/(?<![A-Za-z0-9"])或(?![A-Za-z0-9"])/.test(outputStr)) continue
    if (/\s*或\s*\//.test(outputStr)) continue
    const inputValues = buildInputValues(inputStr, paramNames)
    if (inputValues === null) continue
    const outputValue = parseBareValue(outputStr)
    if (outputValue === undefined) continue
    cases.push({ input: inputValues, output: outputValue })
  }
  return cases
}

/* ---------------- 主流程 ---------------- */

const stats = { kept: 0, inferred: 0, skipped: 0, warned: 0 }
const log = (status, slug, note = '') => {
  const tag =
    status === 'inferred'
      ? '\x1b[32m[inferred]\x1b[0m'
      : status === 'kept'
        ? '\x1b[36m[kept]    \x1b[0m'
        : status === 'skip'
          ? '\x1b[33m[skip]    \x1b[0m'
          : status === 'warn'
            ? '\x1b[31m[warn]    \x1b[0m'
            : status
  const msg = `  ${tag} ${slug.padEnd(48)}${note ? '  — ' + note : ''}`
  console.log(msg)
}

/** 重写 frontmatter（保留 body），atomic rename */
function writeFrontmatter(fullPath, fm, body) {
  const yamlStr = yamlDump(fm, { lineWidth: 1000, noRefs: true, quotingType: '"' })
    .trimEnd()
    .replace(/^---\s*\n/, '')
    .replace(/\n---\s*$/, '')
  const newContent = `---\n${yamlStr}\n---${body.startsWith('\n') ? body : '\n' + body}`
  const tmpPath = fullPath + '.tmp'
  fs.writeFileSync(tmpPath, newContent, 'utf8')
  fs.renameSync(tmpPath, fullPath)
}

function processFile(file) {
  const slug = file.replace(/\.md$/, '')
  const fullPath = path.join(LEETCODE_DIR, file)
  const content = fs.readFileSync(fullPath, 'utf8')
  const { body, fm } = parseFrontmatter(content)

  const hasCases =
    typeof fm.entry === 'string' &&
    fm.entry.trim() &&
    Array.isArray(fm.testcases) &&
    fm.testcases.length >= 2

  // 已存在：默认保留；--fix-modes 时按签名重算 mode
  if (hasCases) {
    if (FIX_MODES) {
      const python = extractCode(content, 'python', 'Python')
      if (python) {
        const newMode = inferMode(python, fm.entry, slug)
        const curMode = typeof fm.mode === 'string' ? fm.mode : undefined
        if (newMode !== curMode) {
          const next = { ...fm }
          if (newMode) next.mode = newMode
          else delete next.mode
          if (DRY_RUN) {
            stats.inferred++
            log('inferred', slug, `mode: ${curMode ?? '—'} → ${newMode ?? '—'} [dry-run]`)
          } else {
            writeFrontmatter(fullPath, next, body)
            stats.inferred++
            log('inferred', slug, `mode: ${curMode ?? '—'} → ${newMode ?? '—'}`)
          }
          return
        }
      }
    }
    stats.kept++
    log('kept', slug)
    return
  }

  // 抽 Python 源码
  const python = extractCode(content, 'python', 'Python')
  if (!python) {
    stats.skipped++
    log('skip', slug, '无 python [Python] 代码块')
    return
  }
  // 抽 description
  const description = extractDescription(content)
  if (!description) {
    stats.skipped++
    log('skip', slug, '无 description 区域')
    return
  }
  // 抽 entry
  const entry = getPythonEntry(python)
  if (!entry) {
    stats.skipped++
    log('skip', slug, '无法从 class Solution 推断 entry')
    return
  }
  // 抽参数名
  const paramNames = getEntryParamNames(python, entry)
  if (paramNames.length === 0) {
    stats.skipped++
    log('skip', slug, 'entry 参数列表为空')
    return
  }
  // 抽 testcases
  const testcases = parseTestcasesFromDescription(description, paramNames)
  if (testcases.length < 2) {
    stats.skipped++
    log(
      'skip',
      slug,
      `少于 2 个可解析示例（仅 ${testcases.length} 个，entry=${entry}，参数=${paramNames.length}）`,
    )
    return
  }

  // 校验参数长度匹配
  if (testcases.some((c) => c.input.length !== paramNames.length)) {
    stats.warned++
    log('warn', slug, '部分用例参数长度与 entry 不匹配，跳过')
    return
  }

  // 写入
  if (DRY_RUN) {
    stats.inferred++
    log('inferred', slug, `(${testcases.length} examples, entry=${entry}) [dry-run]`)
    return
  }
  const newFm = { ...fm }
  if (!newFm.entry) newFm.entry = entry
  if (!newFm.testcases || newFm.testcases.length < 2) newFm.testcases = testcases
  const inferredMode = inferMode(python, entry, slug)
  if (inferredMode && !newFm.mode) newFm.mode = inferredMode
  writeFrontmatter(fullPath, newFm, body)
  stats.inferred++
  log('inferred', slug, `(${testcases.length} examples, entry=${entry})`)
}

function main() {
  if (DRY_RUN) console.log('🧪 dry-run 模式，不会修改任何文件\n')
  const files = fs
    .readdirSync(LEETCODE_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
  for (const f of files) {
    processFile(f)
  }
  console.log(
    `\n总计：推断 ${stats.inferred} / 跳过 ${stats.skipped} / 已存在 ${stats.kept} / 警告 ${stats.warned}`,
  )
  if (DRY_RUN) console.log('（dry-run，未写入）')
  if (stats.warned > 0) process.exitCode = 0 // 警告不致命
}

main()
