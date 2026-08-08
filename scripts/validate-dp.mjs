// 校验 16 道 DP 题可视化数据
// 检查：DpViz/ArrayViz 引用的 steps 变量存在、语法合法、grid/1D 数据越界、state 合法、viz-jump 锚点
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'

const DIR = 'E:/code/personal/algorithm-wiki/docs/leetcode'
const VALID_STATE = new Set(['cur', 'hl', 'done', 'path', 'mark'])

const files = [
  'maximum-subarray.md',
  'edit-distance.md',
  'longest-common-subsequence.md',
  'longest-palindromic-substring.md',
  'minimum-path-sum.md',
  'maximum-length-of-repeated-subarray.md',
  'maximal-square.md',
  'best-time-to-buy-and-sell-stock.md',
  'longest-increasing-subsequence.md',
  'trapping-rain-water.md',
  'climbing-stairs.md',
  'coin-change.md',
  'unique-paths.md',
  'maximum-product-subarray.md',
  'best-time-to-buy-and-sell-stock-ii.md',
  'word-break.md',
]

let totalErrors = 0
const reports = []

for (const file of files) {
  const path = join(DIR, file)
  const src = readFileSync(path, 'utf8')
  const errors = []
  const ok = (cond, msg) => {
    if (!cond) {
      errors.push(msg)
      totalErrors++
    }
  }

  // 1. script setup 存在
  const m = src.match(/<script setup>([\s\S]*?)<\/script>/)
  ok(!!m, '缺少 <script setup> 块')
  if (!m) {
    reports.push({ file, steps: 0, errors })
    continue
  }
  const code = m[1]

  // 2. 提取组件引用的 steps 变量名
  const usedNames = [...src.matchAll(/<(?:DpViz|ArrayViz)\s+:steps="([^"]+)"/g)].map((x) => x[1])
  ok(usedNames.length > 0, '没有任何 <DpViz/> 或 <ArrayViz/> 引用')
  const uniqueNames = [...new Set(usedNames)]

  // 3. 语法合法 + eval 收集 steps
  let stepsObj = {}
  try {
    const append = '\n; __out = [' + uniqueNames.join(', ') + ']'
    const sandbox = {}
    vm.createContext(sandbox)
    const out = vm.runInContext(code + append, sandbox, { filename: file })
    for (let i = 0; i < uniqueNames.length; i++) stepsObj[uniqueNames[i]] = out[i]
  } catch (e) {
    ok(false, `script setup 语法/求值失败: ${e.message}`)
    reports.push({ file, steps: 0, errors })
    continue
  }

  // 4. 每个被引用的 steps 数组校验
  for (const name of uniqueNames) {
    const steps = stepsObj[name]
    ok(Array.isArray(steps) && steps.length > 0, `[${name}] 不是非空数组`)
    if (!Array.isArray(steps)) continue
    for (let si = 0; si < steps.length; si++) {
      const s = steps[si]
      const where = `[${name}][${si}]`
      // grid 模式
      if (s.grid) {
        const { values, rowLabels, colLabels } = s.grid
        ok(Array.isArray(values) && values.length > 0, `${where} grid.values 为空`)
        if (!Array.isArray(values) || !values.length) continue
        const rows = values.length
        const cols = values[0].length
        ok(Array.isArray(rowLabels) && rowLabels.length === rows, `${where} rowLabels(${rowLabels?.length}) 与行数(${rows})不匹配`)
        ok(Array.isArray(colLabels) && colLabels.length === cols, `${where} colLabels(${colLabels?.length}) 与列数(${cols})不匹配`)
        ok(values.every((r) => Array.isArray(r) && r.length === cols), `${where} grid.values 行长度不一致`)
        for (let r = 0; r < values.length; r++) {
          for (let c = 0; c < values[r].length; c++) {
            const v = values[r][c]
            if (v !== null && typeof v !== 'number') ok(false, `${where} grid(${r},${c}) 值类型非法: ${v}`)
          }
        }
        for (const key of ['gridStates', 'gridTexts', 'gridPointers']) {
          for (const cell of s[key] ?? []) {
            ok(typeof cell.r === 'number' && typeof cell.c === 'number', `${where} ${key} 缺少 r/c`)
            ok(cell.r >= 0 && cell.r < rows && cell.c >= 0 && cell.c < cols, `${where} ${key}(${cell.r},${cell.c}) 越界 (${rows}x${cols})`)
            if (key !== 'gridPointers') {
              ok(cell.state === undefined || VALID_STATE.has(cell.state), `${where} ${key}(${cell.r},${cell.c}) state 非法: ${cell.state}`)
            }
          }
        }
      }
      // 1D 模式
      if (s.dp) {
        ok(Array.isArray(s.dp), `${where} dp 不是数组`)
        const n = s.dp?.length
        ok(n > 0, `${where} dp 为空`)
        for (let i = 0; i < (s.dp ?? []).length; i++) {
          const v = s.dp[i]
          if (v !== null && typeof v !== 'number') ok(false, `${where} dp[${i}] 值类型非法: ${v}`)
        }
        for (const key of ['dpStates', 'dpLabels', 'pointers']) {
          for (const it of s[key] ?? []) {
            ok(typeof it.i === 'number' && it.i >= 0 && it.i < n, `${where} ${key} i=${it.i} 越界 (n=${n})`)
            if (key === 'dpStates') ok(VALID_STATE.has(it.state), `${where} ${key} i=${it.i} state 非法: ${it.state}`)
            if (key === 'pointers') ok(typeof it.label === 'string' && it.label.length > 0, `${where} pointers i=${it.i} 缺 label`)
          }
        }
        for (const row of s.aux ?? []) {
          ok(Array.isArray(row.values) && row.values.length === n, `${where} aux "${row.title}" values 长度(${row.values?.length})与 dp(${n})不一致`)
          for (const st of row.states ?? []) {
            ok(st.i >= 0 && st.i < n, `${where} aux "${row.title}" states i=${st.i} 越界`)
            ok(VALID_STATE.has(st.state), `${where} aux "${row.title}" state 非法: ${st.state}`)
          }
          for (const h of row.highlight ?? []) {
            ok(h >= 0 && h < n, `${where} aux "${row.title}" highlight ${h} 越界`)
          }
        }
      }
      // ArrayViz 模式
      if (s.array) {
        const n = s.array.length
        for (const p of s.pointers ?? []) {
          ok(typeof p.index === 'number' && p.index >= 0 && p.index < n, `${where} pointer ${p.label} index=${p.index} 越界 (n=${n})`)
        }
        for (const h of s.highlight ?? []) ok(h >= 0 && h < n, `${where} highlight ${h} 越界`)
        if (s.window) ok(s.window[0] >= 0 && s.window[1] < n, `${where} window ${s.window} 越界`)
      }
    }
  }

  // 5. viz-jump 与锚点
  const jumps = [...src.matchAll(/class="viz-jump"><a href="#(code[^"]*)"/g)].map((x) => x[1])
  const anchors = [...src.matchAll(/<a id="(code[^"]*)"/g)].map((x) => x[1])
  const anchorSet = new Set(anchors)
  for (const j of jumps) {
    ok(anchorSet.has(j), `viz-jump 指向 #${j} 但无对应 <a id="${j}"> 锚点`)
  }
  ok(jumps.length > 0, '没有任何 viz-jump 跳过链接')

  // 6. 每个「方法N」section 都必须有可视化：组件 + viz-jump + 本 section 内匹配锚点
  const methodHeads = [...src.matchAll(/^#{2,3}\s*方法[一二三四五六七八九十]+/gm)]
  for (let i = 0; i < methodHeads.length; i++) {
    const head = methodHeads[i]
    const name = head[0].trim()
    const start = head.index
    const end = i + 1 < methodHeads.length ? methodHeads[i + 1].index : src.length
    const sec = src.slice(start, end)
    ok(/<(ArrayViz|ListViz|DpViz|TreeViz|Mermaid)\b/.test(sec), `${name} 缺少可视化组件`)
    const secJumps = [...sec.matchAll(/class="viz-jump"><a href="#(code[^"]*)"/g)].map((x) => x[1])
    ok(secJumps.length > 0, `${name} 缺少 viz-jump`)
    const secAnchorSet = new Set([...sec.matchAll(/<a id="(code[^"]*)"/g)].map((x) => x[1]))
    for (const j of secJumps) {
      ok(secAnchorSet.has(j), `${name} 的 viz-jump 指向 #${j} 但本 section 内无对应锚点`)
    }
  }

  reports.push({ file, steps: usedNames.length, errors })
}

console.log('='.repeat(70))
let passCount = 0
for (const r of reports) {
  const status = r.errors.length === 0 ? 'PASS' : 'FAIL'
  if (status === 'PASS') passCount++
  console.log(`[${status}] ${r.file} (${r.steps} 个可视化)`)
  for (const e of r.errors) console.log(`        ✗ ${e}`)
}
console.log('='.repeat(70))
console.log(`结果：${passCount}/${reports.length} 个文件通过`)
if (totalErrors > 0) {
  console.log(`发现 ${totalErrors} 个错误`)
  process.exit(1)
} else {
  console.log('全部校验通过 ✅')
}
