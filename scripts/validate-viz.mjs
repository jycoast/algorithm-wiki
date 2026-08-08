// 校验 docs/leetcode 下所有题目的可视化数据
// 检查：组件引用的 steps 变量存在、语法合法、各组件数据越界、state 合法、viz-jump 锚点
// 覆盖：ArrayViz（array/rows/map/intervals/array-map）、ListViz、DpViz（1D/2D）、TreeViz
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'

const DIR = 'E:/code/personal/algorithm-wiki/docs/leetcode'
const VALID_STATE = new Set(['cur', 'hl', 'done', 'path', 'mark'])
const VALID_LIST_STATE = new Set(['cur', 'hl', 'done', 'path', 'mark'])

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()

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

  // 1. 提取组件引用（steps 变量名）
  const refs = [
    ...src.matchAll(/<(ArrayViz|ListViz|DpViz|TreeViz)\s+:steps="([^"]+)"/g),
  ].map((m) => ({ comp: m[1], name: m[2] }))
  if (refs.length === 0) {
    reports.push({ file, steps: 0, errors })
    continue
  }
  const uniqueNames = [...new Set(refs.map((r) => r.name))]

  // 2. script setup 块（可能有多个）
  const blocks = [...src.matchAll(/<script setup>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  ok(blocks.length > 0, `有 ${refs.length} 个组件引用但缺少 <script setup> 块`)
  if (blocks.length === 0) {
    reports.push({ file, steps: refs.length, errors })
    continue
  }
  const code = blocks.join('\n')

  // 3. eval 收集 steps 对象
  let stepsObj = {}
  try {
    const append = '\n; __out = [' + uniqueNames.join(', ') + ']'
    const sandbox = {}
    vm.createContext(sandbox)
    const out = vm.runInContext(code + append, sandbox, { filename: file })
    for (let i = 0; i < uniqueNames.length; i++) stepsObj[uniqueNames[i]] = out[i]
  } catch (e) {
    ok(false, `script setup 语法/求值失败: ${e.message}`)
    reports.push({ file, steps: refs.length, errors })
    continue
  }

  // 4. 每个引用校验
  const namedValidated = new Set()
  for (const { comp, name } of refs) {
    if (namedValidated.has(name)) continue
    namedValidated.add(name)
    const steps = stepsObj[name]
    const where = `[${name}]`
    ok(Array.isArray(steps) && steps.length > 0, `${where} 不是非空数组`)
    if (!Array.isArray(steps)) continue
    for (let si = 0; si < steps.length; si++) {
      const s = steps[si]
      const at = `${where}[${si}]`
      if (comp === 'ListViz') validateList(at, s, ok)
      else if (comp === 'DpViz') validateDp(at, s, ok)
      else if (comp === 'TreeViz') validateTree(at, s, ok)
      else validateArray(at, s, ok)
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

  reports.push({ file, steps: refs.length, errors })
}

function validateList(at, s, ok) {
  ok(Array.isArray(s.lists) && s.lists.length > 0, `${at} lists 为空`)
  for (let li = 0; li < (s.lists ?? []).length; li++) {
    const row = s.lists[li]
    const w = `${at}.lists[${li}]`
    ok(Array.isArray(row.values), `${w} 缺少 values`)
    if (!Array.isArray(row.values)) continue
    const n = row.values.length
    for (let i = 0; i < n; i++) {
      const v = row.values[i]
      if (v !== null && typeof v !== 'number' && typeof v !== 'string') {
        ok(false, `${w} values[${i}] 类型非法: ${v}`)
      }
    }
    for (const p of row.pointers ?? []) {
      ok(typeof p.id === 'number' && p.id >= 0 && p.id < n, `${w} 指针 ${p.label} id=${p.id} 越界 (n=${n})`)
      ok(typeof p.label === 'string' && p.label.length > 0, `${w} 指针缺 label`)
    }
    for (const st of row.states ?? []) {
      ok(typeof st.id === 'number' && st.id >= 0 && st.id < n, `${w} states id=${st.id} 越界 (n=${n})`)
      ok(VALID_LIST_STATE.has(st.state), `${w} states id=${st.id} state 非法: ${st.state}`)
    }
    if (row.cycleTo !== undefined) {
      ok(typeof row.cycleTo === 'number' && row.cycleTo >= 0 && row.cycleTo < n, `${w} cycleTo=${row.cycleTo} 越界 (n=${n})`)
    }
  }
}

function validateDp(at, s, ok) {
  // 2D grid 模式
  if (s.grid) {
    const { values, rowLabels, colLabels } = s.grid
    ok(Array.isArray(values) && values.length > 0, `${at} grid.values 为空`)
    if (!Array.isArray(values) || !values.length) return
    const rows = values.length
    const cols = values[0].length
    ok(Array.isArray(rowLabels) && rowLabels.length === rows, `${at} rowLabels(${rowLabels?.length}) 与行数(${rows})不匹配`)
    ok(Array.isArray(colLabels) && colLabels.length === cols, `${at} colLabels(${colLabels?.length}) 与列数(${cols})不匹配`)
    ok(values.every((r) => Array.isArray(r) && r.length === cols), `${at} grid.values 行长度不一致`)
    for (const key of ['gridStates', 'gridTexts', 'gridPointers']) {
      for (const cell of s[key] ?? []) {
        ok(typeof cell.r === 'number' && typeof cell.c === 'number', `${at} ${key} 缺少 r/c`)
        ok(cell.r >= 0 && cell.r < rows && cell.c >= 0 && cell.c < cols, `${at} ${key}(${cell.r},${cell.c}) 越界 (${rows}x${cols})`)
        if (key !== 'gridPointers') {
          ok(cell.state === undefined || VALID_STATE.has(cell.state), `${at} ${key}(${cell.r},${cell.c}) state 非法: ${cell.state}`)
        }
      }
    }
  }
  // 1D 模式
  if (s.dp) {
    const n = s.dp.length
    for (const key of ['dpStates', 'dpLabels', 'pointers']) {
      for (const it of s[key] ?? []) {
        ok(typeof it.i === 'number' && it.i >= 0 && it.i < n, `${at} ${key} i=${it.i} 越界 (n=${n})`)
        if (key === 'dpStates') ok(VALID_STATE.has(it.state), `${at} ${key} i=${it.i} state 非法: ${it.state}`)
        if (key === 'pointers') ok(typeof it.label === 'string' && it.label.length > 0, `${at} pointers i=${it.i} 缺 label`)
      }
    }
    for (const row of s.aux ?? []) {
      ok(Array.isArray(row.values) && row.values.length === n, `${at} aux "${row.title}" values 长度(${row.values?.length})与 dp(${n})不一致`)
      for (const st of row.states ?? []) {
        ok(st.i >= 0 && st.i < n, `${at} aux "${row.title}" states i=${st.i} 越界`)
        ok(VALID_STATE.has(st.state), `${at} aux "${row.title}" state 非法: ${st.state}`)
      }
      for (const h of row.highlight ?? []) ok(h >= 0 && h < n, `${at} aux "${row.title}" highlight ${h} 越界`)
    }
  }
}

function validateTree(at, s, ok) {
  ok(Array.isArray(s.tree), `${at} 缺少 tree`)
  if (!Array.isArray(s.tree)) return
  const n = s.tree.length
  for (const st of s.states ?? []) {
    ok(typeof st.id === 'number' && st.id >= 0 && st.id < n, `${at} states id=${st.id} 越界 (n=${n})`)
    ok(VALID_STATE.has(st.state), `${at} states id=${st.id} state 非法: ${st.state}`)
  }
  for (const l of s.labels ?? []) {
    ok(typeof l.id === 'number' && l.id >= 0 && l.id < n, `${at} labels id=${l.id} 越界 (n=${n})`)
    ok(typeof l.text === 'string', `${at} labels id=${l.id} 缺 text`)
    if (l.state) ok(VALID_STATE.has(l.state), `${at} labels id=${l.id} state 非法: ${l.state}`)
  }
  for (const a of s.aux ?? []) {
    ok(Array.isArray(a.values), `${at} aux "${a.title}" 缺 values`)
    if (a.marker !== undefined) {
      ok(a.marker >= 0 && a.marker < (a.values?.length ?? 0), `${at} aux "${a.title}" marker=${a.marker} 越界 (n=${a.values?.length})`)
    }
  }
}

function validateArray(at, s, ok) {
  // array（或 array-map）——指针允许边界：-1 表示数组之前，n 表示数组之后（开区间右界）
  if (s.array) {
    const n = s.array.length
    for (const p of s.pointers ?? []) {
      ok(typeof p.index === 'number' && p.index >= -1 && p.index <= n, `${at} pointer ${p.label} index=${p.index} 越界 (允许 [-1, ${n}])`)
    }
    for (const h of s.highlight ?? []) ok(h >= 0 && h < n, `${at} highlight ${h} 越界`)
    if (s.window) ok(s.window[0] >= 0 && s.window[1] < n, `${at} window ${s.window} 越界`)
  }
  // rows 模式
  if (s.rows) {
    for (let r = 0; r < s.rows.length; r++) {
      const n = s.rows[r].length
      for (const p of s.rowPointers ?? []) {
        if (p.row === r) ok(p.col >= 0 && p.col < n, `${at} rowPointers ${p.label} (${p.row},${p.col}) 越界 (n=${n})`)
      }
      for (const h of s.rowHighlight ?? []) {
        if (h.row === r) for (const c of h.cols) ok(c >= 0 && c < n, `${at} rowHighlight 行${r} col${c} 越界 (n=${n})`)
      }
    }
  }
  // map 模式
  if (s.map) {
    for (let i = 0; i < s.map.length; i++) {
      const e = s.map[i]
      const kv = [e.key, e.value]
      for (const x of kv) {
        if (typeof x !== 'number' && typeof x !== 'string') ok(false, `${at} map[${i}] key/value 类型非法: ${x}`)
      }
    }
    for (const h of s.mapHighlight ?? []) ok(h >= 0 && h < s.map.length, `${at} mapHighlight ${h} 越界`)
  }
  // intervals 模式
  if (s.intervals) {
    for (let i = 0; i < s.intervals.length; i++) {
      const iv = s.intervals[i]
      ok(typeof iv.start === 'number' && typeof iv.end === 'number' && iv.start <= iv.end, `${at} intervals[${i}] [${iv.start},${iv.end}] 非法`)
    }
    for (const h of s.intervalHighlight ?? []) ok(h >= 0 && h < s.intervals.length, `${at} intervalHighlight ${h} 越界`)
  }
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
