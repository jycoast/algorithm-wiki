#!/usr/bin/env node
/**
 * 单一数据源生成器
 * -----------------
 * 数据来源：
 *   1. docs/leetcode/*.md 的 frontmatter —— 难度 difficulty、标签 tags（H1 标题）
 *   2. scripts/list-data.json —— Top100 热度排序 order + 分类归属 categories
 *
 * 生成输出：
 *   1. docs/.vitepress/configs/sidebar.mts   （按分类折叠的侧边栏）
 *   2. docs/index.md                         （首页分类表格）
 *
 * 用法：
 *   node scripts/gen-lists.mjs --init   # 首次：从现有 sidebar.mts / index.md 抽取生成 list-data.json
 *   node scripts/gen-lists.mjs          # 生成两份清单 + 一致性校验
 *
 * 校验项：文件缺失、标题/难度/tags 缺失、重复 slug、未分类/未收录文件等。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const LEETCODE_DIR = path.join(ROOT, 'docs', 'leetcode')
const DATA_FILE = path.join(__dirname, 'list-data.json')
const SIDEBAR_FILE = path.join(ROOT, 'docs', '.vitepress', 'configs', 'sidebar.mts')
const INDEX_FILE = path.join(ROOT, 'docs', 'index.md')

/** 首页分类顺序（也是 index.md 的章节顺序） */
const CATEGORY_ORDER = ['数组', '字符串', '链表', '栈与队列', '二叉树', '回溯法', '动态规划', '图论', '数学']

/** 按 Top100 热度排名排序：返回一个 slug → 排名 的排序函数，未收录（不在 order 中）的排最后 */
function rankByTop100(order) {
  const index = new Map(order.map((slug, i) => [slug, i]))
  return (a, b) => (index.get(a) ?? Infinity) - (index.get(b) ?? Infinity)
}

const isInit = process.argv.includes('--init')
const warnings = []
const errors = []

/* ---------------- 解析工具 ---------------- */

/** 解析 frontmatter，返回 { difficulty, tags }。仅解析首个 --- 块，避免误读正文列表。 */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = {}
  let inTags = false
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.trim()
    if (inTags) {
      if (/^-\s+/.test(line)) {
        ;(fm.tags ??= []).push(line.replace(/^-\s+/, ''))
      } else if (line !== '') {
        inTags = false
      }
      if (inTags) continue
    }
    if (/^difficulty:\s*(.+)$/.test(line)) {
      fm.difficulty = line.match(/^difficulty:\s*(.+)$/)[1].trim()
    } else if (/^tags:\s*$/.test(line)) {
      fm.tags = []
      inTags = true
    } else if (/^tags:\s*\[(.+)\]$/.test(line)) {
      fm.tags = line.match(/^tags:\s*\[(.+)\]$/)[1].split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return fm
}

/** 提取 H1 标题，如 `# [15. 三数之和](...)` → `15. 三数之和` */
function extractTitle(content) {
  const m = content.match(/^#\s*\[([^\]]+)\]\(/m)
  return m ? m[1] : null
}

function readProblems() {
  const problems = {}
  for (const f of fs.readdirSync(LEETCODE_DIR)) {
    if (!f.endsWith('.md')) continue
    const slug = f.replace(/\.md$/, '')
    const content = fs.readFileSync(path.join(LEETCODE_DIR, f), 'utf8')
    const fm = parseFrontmatter(content)
    problems[slug] = { slug, title: extractTitle(content), difficulty: fm.difficulty, tags: fm.tags }
  }
  return problems
}

/* ---------------- --init：从现有文件抽取数据 ---------------- */

function extractSidebarOrder() {
  const src = fs.readFileSync(SIDEBAR_FILE, 'utf8')
  const slugs = []
  for (const m of src.matchAll(/link:\s*"\/leetcode\/([^"]+)"/g)) slugs.push(m[1])
  return slugs
}

function extractIndexCategories() {
  const src = fs.readFileSync(INDEX_FILE, 'utf8')
  const categories = {}
  let current = null
  for (const line of src.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+)$/)
    if (h) { current = h[1].trim(); categories[current] = []; continue }
    if (!current) continue
    const row = line.match(/\|\s+\[[^\]]+\]\(\/leetcode\/([^)]+)\)\s*\|/)
    if (row) categories[current].push(row[1].replace(/\.md$/, ''))
  }
  return categories
}

/* ---------------- 生成 sidebar.mts ---------------- */

const TEMPLATE_SECTION = `function getTemplate() {
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
}`

function renderSidebar(data, problems) {
  const byTop100 = rankByTop100(data.order)
  const groups = CATEGORY_ORDER
    .filter((cat) => data.categories[cat] && data.categories[cat].length)
    .map((cat, i) => {
      const items = [...data.categories[cat]]
        .sort(byTop100)
        .map((slug) => `        { text: "${problems[slug].title}", link: "/leetcode/${slug}" },`)
        .join('\n')
      return `    {
      text: '${cat}',
      collapsed: ${i === 0 ? 'false' : 'true'},
      items: [
${items}
      ]
    }`
    })
    .join(',\n')
  return `export default {
  '/': getLeetCode(),
  '/template/': getTemplate()
}

function getLeetCode() {
  return [
${groups}
  ]
}

${TEMPLATE_SECTION}
`
}

/* ---------------- 生成 index.md ---------------- */

function renderIndex(data, problems) {
  const byTop100 = rankByTop100(data.order)
  const sections = CATEGORY_ORDER
    .filter((cat) => data.categories[cat] && data.categories[cat].length)
    .map((cat) => {
      const rows = [...data.categories[cat]]
        .sort(byTop100)
        .map((slug) => {
          const p = problems[slug]
          return `| [${p.title}](/leetcode/${slug}.md) | ${p.difficulty} |`
        })
        .join('\n')
      return `## ${cat}

| 题目 | 难度 |
| :--- | :---: |
${rows}
`
    })
    .join('\n')

  return `---
title: Algorithm Wiki
---

# 题目分类
${sections}`
}

/* ---------------- 校验 ---------------- */

function validate(data, problems) {
  const allSlugs = new Set(Object.keys(problems))
  const listed = new Set(data.order)
  const categorized = new Set(Object.values(data.categories).flat())

  for (const slug of data.order) {
    if (slug in problems && new Set(data.order).has(slug)) {
      if (data.order.filter((s) => s === slug).length > 1) warnings.push(`重复的 order 条目：${slug}`)
    }
  }
  for (const slug of listed) {
    if (!allSlugs.has(slug)) errors.push(`order 中引用了不存在的文件：${slug}`)
  }
  for (const slug of categorized) {
    if (!allSlugs.has(slug)) errors.push(`categories 中引用了不存在的文件：${slug}`)
  }
  for (const [cat, slugs] of Object.entries(data.categories)) {
    if (!CATEGORY_ORDER.includes(cat)) warnings.push(`未知分类（不在 CATEGORY_ORDER 中）：${cat}`)
    if (new Set(slugs).size !== slugs.length) warnings.push(`分类 ${cat} 存在重复条目`)
  }
  for (const slug of allSlugs) {
    const p = problems[slug]
    if (!p.title) errors.push(`缺少 H1 标题：${slug}`)
    if (!p.difficulty) errors.push(`缺少 difficulty：${slug}`)
    if (!p.tags || p.tags.length === 0) warnings.push(`缺少 tags：${slug}`)
    if (!listed.has(slug)) warnings.push(`未收录进 Top100（不在 order 中）：${slug}`)
    if (!categorized.has(slug)) warnings.push(`未分类（不在任何 categories 中）：${slug}`)
  }
}

/* ---------------- main ---------------- */

function main() {
  const problems = readProblems()

  if (isInit) {
    const data = {
      order: extractSidebarOrder(),
      categories: extractIndexCategories(),
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n')
    console.log(`✅ 已从现有 sidebar.mts / index.md 生成 ${DATA_FILE}`)
    console.log(`   order: ${data.order.length} 条，categories: ${Object.keys(data.categories).length} 个`)
    return
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ 缺少 ${DATA_FILE}，请先运行：node scripts/gen-lists.mjs --init`)
    process.exit(1)
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))

  validate(data, problems)

  if (errors.length) {
    console.error('❌ 发现硬错误，中止生成：')
    errors.forEach((e) => console.error('   - ' + e))
    process.exit(1)
  }
  warnings.forEach((w) => console.warn('⚠️  ' + w))

  fs.writeFileSync(SIDEBAR_FILE, renderSidebar(data, problems))
  fs.writeFileSync(INDEX_FILE, renderIndex(data, problems))
  console.log(`✅ 已生成 ${SIDEBAR_FILE}（${data.order.length} 项）`)
  console.log(`✅ 已生成 ${INDEX_FILE}（${Object.keys(data.categories).length} 个分类）`)
  if (warnings.length) console.log('⚠️  有 ' + warnings.length + ' 条警告，见上方输出')
}

main()
