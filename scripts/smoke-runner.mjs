#!/usr/bin/env node
/**
 * 在线判题冒烟测试（Node + 真实 Pyodide WASM）
 * --------------------------------------------
 * 走完整链路：leetcode/*.md frontmatter(entry+testcases) + code-group 提取
 * → problems-data.ts → runPython harness → Pyodide 真实执行 → 深比较判题。
 *
 * 用法：node scripts/smoke-runner.mjs
 * 依赖：devDependencies 里的 pyodide（仅测试用，浏览器走 CDN）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as yamlLoad } from 'js-yaml'
import { loadPyodide } from 'pyodide'
import { runPython } from '../docs/.vitepress/theme/runner/pythonHarness.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LEETCODE_DIR = path.join(ROOT, 'docs', 'leetcode')

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  try {
    return yamlLoad(m[1]) ?? {}
  } catch {
    return {}
  }
}

function extractCode(content, lang, label) {
  const re = new RegExp('```' + lang + '\\s*\\[' + label + '\\]\\r?\\n([\\s\\S]*?)```', 'i')
  const m = content.match(re)
  return m ? m[1].replace(/\r?\n$/, '') : undefined
}

/** 发现所有声明了 entry + testcases 的题目 */
function discoverProblems() {
  const out = []
  for (const f of fs.readdirSync(LEETCODE_DIR)) {
    if (!f.endsWith('.md')) continue
    const slug = f.replace(/\.md$/, '')
    const content = fs.readFileSync(path.join(LEETCODE_DIR, f), 'utf8')
    const fm = parseFrontmatter(content)
    if (typeof fm.entry !== 'string' || !Array.isArray(fm.testcases) || !fm.testcases.length) continue
    out.push({ slug, entry: fm.entry, testcases: fm.testcases, python: extractCode(content, 'python', 'Python') })
  }
  return out
}

const problems = discoverProblems()
if (!problems.length) {
  console.error('❌ 没有发现带 testcases 的题目')
  process.exit(1)
}

console.log(`🚀 加载 Pyodide（真实 WASM）…`)
const pyodide = await loadPyodide()

let failed = 0
for (const p of problems) {
  if (!p.python) {
    console.error(`❌ ${p.slug}：无 Python 代码块，跳过`)
    failed++
    continue
  }
  const report = await runPython(p.python, p.entry, p.testcases, pyodide)
  if (report.compileError) {
    console.error(`❌ ${p.slug} [${p.entry}]：编译/运行失败 → ${report.compileError}`)
    failed++
    continue
  }
  const ok = report.passed === report.total
  if (!ok) {
    failed++
    console.error(`❌ ${p.slug} [${p.entry}]：${report.passed}/${report.total} 通过`)
    for (const r of report.results) {
      if (!r.ok) {
        console.error(`   - 用例 ${r.index}：期望 ${JSON.stringify(r.expected)}，实际 ${JSON.stringify(r.actual)}${r.error ? '，错误 ' + r.error : ''}`)
      }
    }
  } else {
    console.log(`✅ ${p.slug} [${p.entry}]：${report.passed}/${report.total} 通过`)
  }
}

/* ---------------- 反向校验：错误代码必须被判 ✗ ---------------- */
console.log('\n🔍 反向校验：错误答案应被判错 …')
const badCode = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        return []  # 故意写错，应全部 ✗`
const badReport = await runPython(badCode, 'twoSum', problems.find((p) => p.slug === 'two-sum').testcases, pyodide)
if (badReport.compileError) {
  console.error(`❌ 反向校验失败：编译错误 ${badReport.compileError}`)
  failed++
} else if (badReport.passed !== 0) {
  console.error(`❌ 反向校验失败：错误代码竟通过了 ${badReport.passed}/${badReport.total}`)
  failed++
} else {
  console.log(`✅ 反向校验：错误答案 0/${badReport.total} 通过，符合预期`)
}

console.log(failed ? `\n❌ ${failed} 项失败` : '\n🎉 全部通过')
process.exit(failed ? 1 : 0)
