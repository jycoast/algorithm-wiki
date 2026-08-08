<script setup lang="ts">
/**
 * ArrayViz —— 算法逐步可视化（四模式，按 step 字段自动探测）
 * 用法：<ArrayViz :steps="steps" />
 *
 * 单数组模式（默认）：array + pointers + highlight + window
 *   array:    number[] 数组快照
 *   pointers: { label, index }[] 指针（index 可为负，如 -1 表示数组之前）
 *   highlight: number[] 高亮索引（如交换中的两个位置）
 *   window:   [start, end] 滑动窗口高亮区间
 *
 * 多行模式（双数组/矩阵）：rows + rowPointers + rowHighlight
 *   rows:       number[][] 多行数组
 *   rowPointers: { row, col, label }[] 指向某行某列的指针
 *   rowHighlight: { row, cols }[] 某行的若干列高亮
 *
 * 哈希模式：map + mapHighlight
 *   map:          { key, value }[] 按插入序排列的键值对
 *   mapHighlight: number[] 高亮的键值对索引
 *
 * 区间模式：intervals + intervalHighlight
 *   intervals:        { start, end, merged? }[] 区间列表（含是否已合并）
 *   intervalHighlight: number[] 高亮区间索引
 *
 * 通用字段：note —— 当前步骤文字说明
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export interface VizPointer {
  label: string
  index: number
}
export interface VizRowPointer {
  row: number
  col: number
  label: string
}
export interface VizRowHighlight {
  row: number
  cols: number[]
}
export interface VizMapEntry {
  key: number
  value: number
}
export interface VizInterval {
  start: number
  end: number
  merged?: boolean
}
export interface VizStep {
  array?: number[]
  pointers?: VizPointer[]
  highlight?: number[]
  window?: [number, number]
  rows?: number[][]
  rowPointers?: VizRowPointer[]
  rowHighlight?: VizRowHighlight[]
  map?: VizMapEntry[]
  mapHighlight?: number[]
  intervals?: VizInterval[]
  intervalHighlight?: number[]
  note?: string
}

const props = defineProps<{ steps: VizStep[] }>()

const cur = ref(0)
const playing = ref(false)
const speed = ref(1000)
let timer: ReturnType<typeof setTimeout> | null = null

const total = computed(() => props.steps.length)
const step = computed(() => props.steps[cur.value] ?? props.steps[0])
const isFirst = computed(() => cur.value === 0)
const isLast = computed(() => cur.value >= total.value - 1)

// 模式探测（array 与 map 同时存在时，用 array-map 组合模式）
const mode = computed<'array' | 'rows' | 'map' | 'intervals' | 'array-map'>(() => {
  const s = step.value
  if (s.rows) return 'rows'
  if (s.intervals) return 'intervals'
  if (s.map) return s.array ? 'array-map' : 'map'
  return 'array'
})

const CELL_W = 52
const CELL_GAP = 6
const STRIDE = CELL_W + CELL_GAP

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function tick() {
  if (!playing.value) return
  if (isLast.value) {
    playing.value = false
    return
  }
  cur.value++
  timer = setTimeout(tick, speed.value)
}

function togglePlay() {
  if (playing.value) {
    playing.value = false
    clearTimer()
  } else {
    if (isLast.value) cur.value = 0
    playing.value = true
    timer = setTimeout(tick, speed.value)
  }
}

function stepBack() {
  if (isFirst.value) return
  playing.value = false
  clearTimer()
  cur.value--
}

function stepForward() {
  if (isLast.value) return
  playing.value = false
  clearTimer()
  cur.value++
}

function reset() {
  playing.value = false
  clearTimer()
  cur.value = 0
}

watch(
  () => props.steps,
  () => reset()
)
watch(speed, () => {
  if (playing.value) {
    clearTimer()
    timer = setTimeout(tick, speed.value)
  }
})
onBeforeUnmount(clearTimer)

/* ---------- 单数组模式 ---------- */

const ptrMap = computed(() => {
  const map: Record<number, VizPointer[]> = {}
  for (const p of step.value.pointers ?? []) {
    ;(map[p.index] ??= []).push(p)
  }
  return map
})
function pointerAt(i: number) {
  return ptrMap.value[i] ?? []
}
function isHighlight(i: number) {
  return step.value.highlight?.includes(i) ?? false
}
function inWindow(i: number) {
  const w = step.value.window
  return w ? i >= w[0] && i <= w[1] : false
}
const padLeft = computed(() => {
  let min = 0
  for (const p of step.value.pointers ?? []) {
    if (p.index < min) min = p.index
  }
  return min < 0 ? 36 : 0
})

/* ---------- 多行模式 ---------- */

function rowPointerAt(r: number, c: number) {
  return step.value.rowPointers?.filter((p) => p.row === r && p.col === c) ?? []
}
function rowIsHighlight(r: number, c: number) {
  return step.value.rowHighlight?.find((h) => h.row === r)?.cols.includes(c) ?? false
}

/* ---------- 区间模式 ---------- */

const axisMin = computed(() => {
  const ivs = step.value.intervals ?? []
  return ivs.length ? Math.min(...ivs.map((i) => i.start)) : 0
})
const axisMax = computed(() => {
  const ivs = step.value.intervals ?? []
  return ivs.length ? Math.max(...ivs.map((i) => i.end)) : 1
})
const axisSpan = computed(() => Math.max(1, axisMax.value - axisMin.value))
function intervalPct(iv: VizInterval) {
  const left = ((iv.start - axisMin.value) / axisSpan.value) * 100
  const width = ((iv.end - iv.start) / axisSpan.value) * 100
  return { left: `${left}%`, width: `${width}%` }
}
const axisTicks = computed(() => {
  const ticks: number[] = []
  for (let v = axisMin.value; v <= axisMax.value; v++) ticks.push(v)
  return ticks
})
</script>

<template>
  <div class="array-viz">
    <div class="viz-stage">
      <!-- ============ 单数组模式 ============ -->
      <div v-if="mode === 'array'">
        <!-- 指针行 -->
        <div class="viz-ptrs">
          <template v-for="(v, i) in step.array" :key="'p' + i">
            <span
              v-for="(p, pi) in pointerAt(i)"
              :key="p.label"
              class="viz-ptr"
              :style="{
                left: `${padLeft + i * STRIDE + 26 + (pi - (pointerAt(i).length - 1) / 2) * 16}px`,
              }"
              >{{ p.label }}<i>▼</i></span
            >
          </template>
        </div>

        <div class="viz-cols">
          <div
            v-for="(v, i) in step.array"
            :key="'c' + i"
            class="viz-cell"
            :class="{
              'is-zero': v === 0,
              'is-num': v !== 0,
              'is-hl': isHighlight(i),
              'is-win': inWindow(i) && !isHighlight(i),
              'is-ptr': pointerAt(i).length > 0,
            }"
          >
            <span class="viz-val">{{ v }}</span>
            <span class="viz-idx">{{ i }}</span>
          </div>
        </div>

        <div v-if="step.window" class="viz-window-hint">
          滑动窗口 [{{ step.window[0] }}, {{ step.window[1] }}]（绿色区域）
        </div>
      </div>

      <!-- ============ 数组 + 哈希组合模式 ============ -->
      <div v-else-if="mode === 'array-map'" class="viz-array-map">
        <div class="viz-am-array">
          <div class="viz-am-title">nums</div>
          <!-- 指针行 -->
          <div class="viz-ptrs">
            <template v-for="(v, i) in step.array" :key="'p' + i">
              <span
                v-for="(p, pi) in pointerAt(i)"
                :key="p.label"
                class="viz-ptr"
                :style="{
                  left: `${padLeft + i * STRIDE + 26 + (pi - (pointerAt(i).length - 1) / 2) * 16}px`,
                }"
                >{{ p.label }}<i>▼</i></span
              >
            </template>
          </div>
          <div class="viz-cols">
            <div
              v-for="(v, i) in step.array"
              :key="'c' + i"
              class="viz-cell"
              :class="{
                'is-zero': v === 0,
                'is-num': v !== 0,
                'is-hl': isHighlight(i),
                'is-ptr': pointerAt(i).length > 0,
              }"
            >
              <span class="viz-val">{{ v }}</span>
              <span class="viz-idx">{{ i }}</span>
            </div>
          </div>
        </div>

        <div class="viz-am-map">
          <div class="viz-am-title">哈希表 d</div>
          <div class="viz-map-head">
            <span class="viz-map-k">key</span>
            <span class="viz-map-v">value</span>
          </div>
          <div
            v-for="(e, i) in step.map"
            :key="'m' + i"
            class="viz-map-entry"
            :class="{ 'is-hl': step.mapHighlight?.includes(i) }"
          >
            <span class="viz-map-k">{{ e.key }}</span>
            <span class="viz-map-v">{{ e.value }}</span>
          </div>
          <div v-if="!step.map?.length" class="viz-map-empty">（哈希表为空）</div>
        </div>
      </div>

      <!-- ============ 多行模式 ============ -->
      <div v-else-if="mode === 'rows'" class="viz-rows">
        <div v-for="(row, r) in step.rows" :key="'r' + r" class="viz-row">
          <div class="viz-ptrs">
            <template v-for="(v, c) in row" :key="'rp' + c">
              <span
                v-for="(p, pi) in rowPointerAt(r, c)"
                :key="p.label"
                class="viz-ptr"
                :style="{
                  left: `${c * STRIDE + 26 + (pi - (rowPointerAt(r, c).length - 1) / 2) * 16}px`,
                }"
                >{{ p.label }}<i>▼</i></span
              >
            </template>
          </div>
          <div class="viz-cols">
            <div
              v-for="(v, c) in row"
              :key="'rc' + c"
              class="viz-cell"
              :class="{
                'is-zero': v === 0,
                'is-num': v !== 0,
                'is-hl': rowIsHighlight(r, c),
              }"
            >
              <span class="viz-val">{{ v }}</span>
              <span class="viz-idx">{{ c }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ 哈希模式 ============ -->
      <div v-else-if="mode === 'map'" class="viz-map">
        <div class="viz-map-head">
          <span class="viz-map-k">key</span>
          <span class="viz-map-v">value</span>
        </div>
        <div
          v-for="(e, i) in step.map"
          :key="'m' + i"
          class="viz-map-entry"
          :class="{ 'is-hl': step.mapHighlight?.includes(i) }"
        >
          <span class="viz-map-k">{{ e.key }}</span>
          <span class="viz-map-v">{{ e.value }}</span>
        </div>
        <div v-if="!step.map?.length" class="viz-map-empty">（哈希表为空）</div>
      </div>

      <!-- ============ 区间模式 ============ -->
      <div v-else-if="mode === 'intervals'" class="viz-intervals">
        <div
          v-for="(iv, i) in step.intervals"
          :key="'iv' + i"
          class="viz-iv-row"
          :class="{ 'is-hl': step.intervalHighlight?.includes(i) }"
        >
          <span class="viz-iv-label">[{{ iv.start }}, {{ iv.end }}]</span>
          <div class="viz-iv-track">
            <div
              class="viz-iv-bar"
              :class="iv.merged ? 'is-merged' : ''"
              :style="intervalPct(iv)"
            ></div>
          </div>
        </div>
        <div class="viz-iv-axis">
          <span v-for="t in axisTicks" :key="'t' + t" class="viz-iv-tick">{{ t }}</span>
        </div>
        <div class="viz-iv-legend">
          <span><i class="dot dot-num"></i>未合并</span>
          <span><i class="dot dot-merged"></i>已合并</span>
        </div>
      </div>

      <!-- 图例（数组/多行模式共用） -->
      <div v-if="mode === 'array' || mode === 'rows' || mode === 'array-map'" class="viz-legend">
        <span><i class="dot dot-zero"></i>0</span>
        <span><i class="dot dot-num"></i>非零</span>
        <span><i class="dot dot-hl"></i>交换中</span>
        <span><i class="dot dot-win"></i>窗口内</span>
        <span><i class="dot dot-ptr"></i>指针位置</span>
      </div>
    </div>

    <p v-if="step.note" class="viz-note">{{ step.note }}</p>

    <div class="viz-controls">
      <button class="viz-btn" :disabled="isFirst" @click="reset" title="重置">⏮</button>
      <button class="viz-btn" :disabled="isFirst" @click="stepBack" title="上一步">◀</button>
      <button class="viz-btn viz-play" @click="togglePlay" title="播放/暂停">
        {{ playing ? '⏸' : '▶' }}
      </button>
      <button class="viz-btn" :disabled="isLast" @click="stepForward" title="下一步">▶</button>
      <span class="viz-count">{{ cur + 1 }} / {{ total }}</span>
      <label class="viz-speed">
        速度
        <input v-model.number="speed" type="range" min="300" max="2000" step="100" />
        <b>{{ speed }}ms</b>
      </label>
    </div>
  </div>
</template>

<style scoped>
.array-viz {
  margin: 1.25rem 0;
  padding: 1rem 1.1rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}
.viz-stage {
  position: relative;
  overflow-x: auto;
}
/* ---------- 单数组 / 多行 ---------- */
.viz-ptrs {
  position: relative;
  height: 22px;
  margin-bottom: 2px;
}
.viz-ptr {
  position: absolute;
  transform: translateX(-50%);
  font-weight: 700;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}
.viz-ptr i {
  font-style: normal;
  display: block;
  font-size: 9px;
  text-align: center;
  line-height: 1;
}
.viz-cols {
  display: inline-flex;
  gap: 6px;
}
.viz-cell {
  width: 52px;
  height: 56px;
  border-radius: 8px;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  box-sizing: border-box;
}
.viz-val {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}
.viz-idx {
  font-size: 10px;
  opacity: 0.55;
}
.viz-cell.is-zero {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}
.viz-cell.is-num {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.viz-cell.is-hl {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
  border-color: var(--vp-c-yellow-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-yellow-2) 25%, transparent);
}
.viz-cell.is-win {
  background: color-mix(in srgb, var(--vp-c-green-2) 18%, transparent);
  color: var(--vp-c-green-1);
  border-color: color-mix(in srgb, var(--vp-c-green-2) 45%, transparent);
}
.viz-cell.is-ptr {
  border-color: var(--vp-c-brand-1);
}
.viz-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
/* ---------- 数组 + 哈希组合 ---------- */
.viz-array-map {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.viz-am-array {
  min-width: 200px;
}
.viz-am-map {
  min-width: 220px;
}
.viz-am-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  font-family: ui-monospace, Consolas, monospace;
}
.viz-window-hint {
  margin-top: 10px;
  font-size: 12px;
  color: var(--vp-c-green-1);
}
/* ---------- 哈希模式 ---------- */
.viz-map {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 260px;
}
.viz-map-head,
.viz-map-entry {
  display: grid;
  grid-template-columns: 100px 100px;
  gap: 6px;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
}
.viz-map-head span {
  font-size: 11px;
  color: var(--vp-c-text-3);
  padding: 0 10px;
}
.viz-map-entry span {
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
  font-size: 14px;
  transition: all 0.15s;
}
.viz-map-entry.is-hl span {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
  border-color: var(--vp-c-yellow-2);
}
.viz-map-entry.is-hl .viz-map-v {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-yellow-2) 25%, transparent);
}
.viz-map-empty {
  font-size: 13px;
  color: var(--vp-c-text-3);
}
/* ---------- 区间模式 ---------- */
.viz-intervals {
  min-width: 320px;
}
.viz-iv-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0;
  padding: 4px 6px;
  border-radius: 6px;
}
.viz-iv-row.is-hl {
  background: var(--vp-c-yellow-soft);
}
.viz-iv-label {
  min-width: 74px;
  font-size: 12px;
  font-family: ui-monospace, Consolas, monospace;
  color: var(--vp-c-text-2);
}
.viz-iv-track {
  flex: 1;
  position: relative;
  height: 18px;
  background: var(--vp-c-bg);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}
.viz-iv-bar {
  position: absolute;
  top: 3px;
  bottom: 3px;
  border-radius: 3px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  transition: left 0.2s, width 0.2s;
  box-sizing: border-box;
}
.viz-iv-bar.is-merged {
  background: color-mix(in srgb, var(--vp-c-green-2) 25%, transparent);
  border-color: var(--vp-c-green-1);
}
.viz-iv-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 4px;
  font-size: 10px;
  color: var(--vp-c-text-3);
  font-family: ui-monospace, Consolas, monospace;
}
.viz-iv-legend {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.viz-iv-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
/* ---------- 图例 / 说明 / 控制 ---------- */
.viz-legend {
  display: flex;
  gap: 14px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
}
.viz-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}
.dot-zero {
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
}
.dot-num {
  background: var(--vp-c-brand-soft);
}
.dot-hl {
  background: var(--vp-c-yellow-2);
}
.dot-win {
  background: color-mix(in srgb, var(--vp-c-green-2) 30%, transparent);
}
.dot-ptr {
  background: transparent;
  border: 2px solid var(--vp-c-brand-1);
}
.dot-merged {
  background: color-mix(in srgb, var(--vp-c-green-2) 30%, transparent);
}
.viz-note {
  margin: 12px 0 8px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 10px;
}
.viz-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.viz-btn {
  min-width: 36px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: border-color 0.15s, color 0.15s;
}
.viz-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.viz-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.viz-play {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.viz-play:hover:not(:disabled) {
  color: #fff;
  opacity: 0.9;
}
.viz-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-left: 4px;
  font-variant-numeric: tabular-nums;
}
.viz-speed {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-left: auto;
}
.viz-speed b {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
  min-width: 44px;
}
</style>
