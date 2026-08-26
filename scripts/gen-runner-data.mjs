#!/usr/bin/env node
/**
 * 在线判题数据生成器（含全屏刷题数据）
 * -----------------------------------
 * 从每题 frontmatter 读取 entry + testcases（可选 hidden_testcases）+ mode，
 * 从 ::: code-group 提取首个 python / java 解法源码（代码块是唯一事实源），
 * 并从 H1 / description 标记截取题名、题号与题目描述 HTML。
 *
 * 生成输出：
 *   docs/.vitepress/theme/runner/problems-data.ts   （slug → 完整刷题数据）
 *   docs/solve/<slug>.md                             （layout:false 的全屏刷题页）
 *
 * 用法：
 *   node scripts/gen-runner-data.mjs      # 或 npm run gen:runner（build 前自动执行）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LEETCODE_DIR = path.join(ROOT, 'docs', 'leetcode')
const SOLVE_DIR = path.join(ROOT, 'docs', 'solve')
const RUNNER_DATA = path.join(ROOT, 'docs', '.vitepress', 'theme', 'runner', 'problems-data.ts')

const warnings = []

/* ---------------- 解析工具 ---------------- */

/** 解析 frontmatter（完整 YAML）。仅解析首个 --- 块。 */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  try {
    return yamlLoad(m[1]) ?? {}
  } catch (e) {
    warnings.push(`frontmatter 解析失败：${e.message}`)
    return {}
  }
}

/** 提取首个 <lang> [<label>] 代码块内容（code-group 格式），label 大小写不敏感 */
function extractCode(content, lang, label) {
  const re = new RegExp('```' + lang + '\\s*\\[' + label + '\\]\\r?\\n([\\s\\S]*?)```', 'i')
  const m = content.match(re)
  return m ? m[1].replace(/\r?\n$/, '') : undefined
}

/** 从 H1 `# [12. 标题](url)` 提取题号与题名；剑指 Offer 格式 `# [面试题 22. 标题](url)` 只取标题（无数值题号） */
function extractTitle(content) {
  let m = content.match(/^#\s*\[(\d+)\.\s*([^\]]+)\]/m)
  if (m) return { number: Number(m[1]), title: `${m[1]}. ${m[2].trim()}` }
  m = content.match(/^#\s*\[面试题\s*(\d+)\.\s*([^\]]+)\]/m)
  if (m) return { number: undefined, title: `面试题 ${m[1]}. ${m[2].trim()}` }
  return undefined
}

/** 截取 <!-- description:start --> 与 <!-- description:end --> 之间的题目描述 HTML */
function extractDescription(content) {
  const m = content.match(/<!--\s*description:start\s*-->([\s\S]*?)<!--\s*description:end\s*-->/)
  return m ? m[1].trim() : ''
}

/** 校验 testcases / hidden_testcases 结构，返回规范化数组 */
function validateCases(slug, list, label) {
  if (!Array.isArray(list)) return []
  for (let i = 0; i < list.length; i++) {
    const tc = list[i]
    if (!Array.isArray(tc?.input) || !('output' in tc)) {
      warnings.push(`${slug}: ${label} 第 ${i + 1} 个用例缺少 input 数组或 output`)
    }
  }
  return list
}

/** 生成全屏刷题页 markdown（layout:false 关闭文档外壳） */
function solvePageMarkdown(slug, title) {
  const safe = String(title).replace(/'/g, "''")
  return `---
layout: false
title: '${safe} · 在线刷题'
---

<Solver slug="${slug}" />
`
}

/** 生成 /solve 导航表格页（题号 · 题目 · 难度 · 标签 · 刷题按钮） */
function writeSolveIndex(data) {
  const rows = Object.entries(data)
    .map(([slug, p]) => ({ slug, p, num: typeof p.number === 'number' ? p.number : Infinity }))
    .sort((a, b) => a.num - b.num || String(a.p.title).localeCompare(String(b.p.title)))
  const lines = [
    '---',
    'title: 在线刷题',
    '---',
    '',
    '# 在线刷题',
    '',
    '> 全部支持在线刷题的题目。点击「刷题」进入全屏 IDE 模式；点击题名进入题解页查看讲解与可视化。',
    '',
    '| # | 题目 | 难度 | 标签 | 操作 |',
    '|---|------|------|------|------|',
  ]
  for (const { slug, p, num } of rows) {
    const displayTitle = String(p.title).replace(/^\d+\.\s*/, '').replace(/\|/g, '\\|')
    const diff = p.difficulty ?? '—'
    const tags = Array.isArray(p.tags) && p.tags.length ? p.tags.join(' / ') : '—'
    const numText = num === Infinity ? '—' : num
    lines.push(
      `| ${numText} | [${displayTitle}](/leetcode/${slug}) | ${diff} | ${tags} | [刷题](/solve/${slug}) |`,
    )
  }
  lines.push('', `> 共 ${rows.length} 道可在线判题的题目。`, '')
  fs.writeFileSync(path.join(SOLVE_DIR, 'index.md'), lines.join('\n'))
}

/* ---------------- main ---------------- */

function main() {
  const data = {}
  let testcaseCount = 0

  for (const f of fs.readdirSync(LEETCODE_DIR)) {
    if (!f.endsWith('.md')) continue
    const slug = f.replace(/\.md$/, '')
    const content = fs.readFileSync(path.join(LEETCODE_DIR, f), 'utf8')
    const fm = parseFrontmatter(content)

    const entry = typeof fm.entry === 'string' ? fm.entry.trim() : ''
    const testcases = validateCases(slug, fm.testcases, 'testcases')

    if (!entry && testcases.length > 0) {
      warnings.push(`${slug}: 声明了 testcases 但缺少 entry`)
      continue
    }
    if (!entry && !testcases.length) continue // 未接入判题的题不进入数据

    const titleInfo = extractTitle(content)
    const python = extractCode(content, 'python', 'Python')
    const java = extractCode(content, 'java', 'Java')
    if (!python) warnings.push(`${slug}: 未找到 Python 解法代码块`)
    if (!java) warnings.push(`${slug}: 未找到 Java 解法代码块`)

    const hidden = validateCases(slug, fm.hidden_testcases, 'hidden_testcases')

    data[slug] = {
      number: titleInfo?.number,
      title: titleInfo?.title ?? slug,
      difficulty: typeof fm.difficulty === 'string' ? fm.difficulty : undefined,
      tags: Array.isArray(fm.tags) ? fm.tags : undefined,
      entry,
      mode: typeof fm.mode === 'string' ? fm.mode : undefined,
      testcases,
      hiddenTestcases: hidden.length ? hidden : undefined,
      descriptionHtml: extractDescription(content),
      python,
      java,
    }
    testcaseCount += testcases.length
  }

  // 按题号升序排列（剑指 Offer 等无题号的排最后），计算上一题 / 下一题
  const ordered = Object.entries(data)
    .map(([slug, p]) => ({ slug, p, num: typeof p.number === 'number' ? p.number : Infinity }))
    .sort((a, b) => a.num - b.num || String(a.p.title).localeCompare(String(b.p.title)))
  for (let i = 0; i < ordered.length; i++) {
    const { slug, p } = ordered[i]
    if (i > 0) p.prev = ordered[i - 1].slug
    if (i < ordered.length - 1) p.next = ordered[i + 1].slug
  }

  /* -------- 写 problems-data.ts -------- */

  const lines = []
  lines.push('/**')
  lines.push(' * AUTO-GENERATED by scripts/gen-runner-data.mjs — 请勿手动编辑。')
  lines.push(' * 重新生成：npm run gen:runner（npm run build 时也会自动执行）。')
  lines.push(' *')
  lines.push(' * 数据来源：docs/leetcode/*.md 的 frontmatter（entry/testcases/hidden_testcases/mode）、')
  lines.push(' *           H1（题号/题名）、description 标记（描述 HTML）与 code-group 代码块。')
  lines.push(' */')
  lines.push('')
  lines.push("import type { TestCase } from './types.ts'")
  lines.push('')
  lines.push('export interface GeneratedProblem {')
  lines.push('  number?: number')
  lines.push("  title: string")
  lines.push("  difficulty?: string")
  lines.push("  tags?: string[]")
  lines.push("  entry: string")
  lines.push("  mode?: 'void-first-arg' | 'link' | 'link-lists' | 'tree' | 'link-void' | 'tree-output' | 'tree-lca' | 'link-cycle' | 'link-cycle-ii' | 'link-intersection' | 'ops'")
  lines.push('  testcases: TestCase[]')
  lines.push('  hiddenTestcases?: TestCase[]')
  lines.push('  descriptionHtml: string')
  lines.push("  python?: string")
  lines.push("  java?: string")
  lines.push("  prev?: string")
  lines.push("  next?: string")
  lines.push('}')
  lines.push('')
  lines.push('export const problemsData: Record<string, GeneratedProblem> = {')
  for (const [slug, p] of Object.entries(data)) {
    lines.push(`  ${JSON.stringify(slug)}: {`)
    for (const [k, v] of Object.entries(p)) {
      if (v === undefined) continue
      lines.push(`    ${k}: ${JSON.stringify(v)},`)
    }
    lines.push('  },')
  }
  lines.push('}')
  lines.push('')

  fs.writeFileSync(RUNNER_DATA, lines.join('\n'))

  /* -------- 写 docs/solve/<slug>.md -------- */

  fs.mkdirSync(SOLVE_DIR, { recursive: true })
  for (const [slug, p] of Object.entries(data)) {
    fs.writeFileSync(path.join(SOLVE_DIR, `${slug}.md`), solvePageMarkdown(slug, p.title))
  }
  // 清理不再有判题数据的旧刷题页
  for (const f of fs.readdirSync(SOLVE_DIR)) {
    if (!f.endsWith('.md')) continue
    if (!data[f.replace(/\.md$/, '')]) {
      fs.unlinkSync(path.join(SOLVE_DIR, f))
    }
  }

  // 生成 /solve 导航表格页
  writeSolveIndex(data)

  console.log(`✅ 已生成 ${RUNNER_DATA}`)
  console.log(`   已生成刷题页 docs/solve/ 共 ${Object.keys(data).length} 个`)
  console.log(`   含判题数据题目：${Object.keys(data).length} 道，共 ${testcaseCount} 个可见用例`)
  if (warnings.length) {
    warnings.forEach((w) => console.warn('⚠️  ' + w))
    console.log(`⚠️  共 ${warnings.length} 条警告`)
  }
}

main()
