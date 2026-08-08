<script setup lang="ts">
/**
 * DpViz —— 动态规划逐步可视化（配合 ArrayViz / TreeViz 使用）
 * 用法：<DpViz :steps="steps" />
 *
 * 每步结构（两种模式，按 grid 字段是否出现自动探测）：
 *
 * ① 一维状态数组模式（1D DP）：
 *   dp:        (number | null)[]  状态数组值，null 表示尚未计算/占位
 *   dpStates:  { i, state }[]      每格状态
 *   dpLabels:  { i, text, state? }[] 单元格下方小标签（如 "f[i]"、公式提示）
 *   pointers:  { i, label }[]      指针（▼ 标注，i 为下标）
 *   title:     主行标题（默认 "f"，如接雨水可写 "height"）
 *   aux:       { title, values, states?, highlight? }[]  辅助行（如原数组 nums）
 *     values 为 (number|null)[]；states 为 { i, state }[]；highlight 为高亮下标
 *
 * ② 二维表格模式（2D DP）：
 *   grid:        { values, rowLabels, colLabels }
 *     values     (number|null)[][] 表格值（null 显示为空）
 *     rowLabels  string[] 行标题（如 word1 的字符）
 *     colLabels  string[] 列标题（如 word2 的字符）
 *   gridStates:  { r, c, state }[]    单元格状态
 *   gridTexts:   { r, c, text, state? }[]  覆盖单元格文字（如回溯箭头 ←/↑/↖）
 *   gridPointers:{ r, c, label }[]    单元格内指针标记（如 "i"/"j"）
 *
 * 通用字段：note —— 当前步骤文字说明
 *
 * 状态语义（与 TreeViz 一致）：
 *   cur  = 当前计算/访问中（品牌色实心）
 *   hl   = 比较/参照中（黄色）
 *   done = 已计算完成（绿色）
 *   path = 回溯路径上（绿色描边）
 *   mark = 答案/目标格子（红色）
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export type DpState = 'cur' | 'hl' | 'done' | 'path' | 'mark'

export interface DpVizAuxRow {
  title: string
  values: (number | null)[]
  states?: { i: number; state: DpState }[]
  highlight?: number[]
}
export interface DpVizStep {
  dp?: (number | null)[]
  dpStates?: { i: number; state: DpState }[]
  dpLabels?: { i: number; text: string; state?: DpState }[]
  pointers?: { i: number; label: string }[]
  title?: string
  aux?: DpVizAuxRow[]
  grid?: { values: (number | null)[][]; rowLabels: string[]; colLabels: string[] }
  gridStates?: { r: number; c: number; state: DpState }[]
  gridTexts?: { r: number; c: number; text: string; state?: DpState }[]
  gridPointers?: { r: number; c: number; label: string }[]
  note?: string
}

const props = defineProps<{ steps: DpVizStep[] }>()

const cur = ref(0)
const playing = ref(false)
const speed = ref(1000)
let timer: ReturnType<typeof setTimeout> | null = null

const total = computed(() => props.steps.length)
const step = computed(() => props.steps[cur.value] ?? props.steps[0])
const isFirst = computed(() => cur.value === 0)
const isLast = computed(() => cur.value >= total.value - 1)

const CELL_W = 48
const CELL_GAP = 6
const STRIDE = CELL_W + CELL_GAP

const mode = computed<'array' | 'grid'>(() => (step.value.grid ? 'grid' : 'array'))

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

/* ---------- 一维模式 ---------- */

const ptrMap = computed(() => {
  const map: Record<number, string[]> = {}
  for (const p of step.value.pointers ?? []) {
    ;(map[p.i] ??= []).push(p.label)
  }
  return map
})
function pointerAt(i: number) {
  return ptrMap.value[i] ?? []
}
function dpStateAt(i: number) {
  return step.value.dpStates?.find((s) => s.i === i)?.state ?? ''
}
function dpLabelAt(i: number) {
  return step.value.dpLabels?.find((l) => l.i === i)
}
function auxStateAt(row: DpVizAuxRow, i: number) {
  return row.states?.find((s) => s.i === i)?.state ?? ''
}
function auxIsHighlight(row: DpVizAuxRow, i: number) {
  return row.highlight?.includes(i) ?? false
}
function stateClass(state: string) {
  return {
    'is-cur': state === 'cur',
    'is-hl': state === 'hl',
    'is-done': state === 'done',
    'is-path': state === 'path',
    'is-mark': state === 'mark',
  }
}

/* ---------- 二维模式 ---------- */

function gridStateAt(r: number, c: number) {
  return step.value.gridStates?.find((s) => s.r === r && s.c === c)?.state ?? ''
}
function gridTextAt(r: number, c: number) {
  return step.value.gridTexts?.find((t) => t.r === r && t.c === c)
}
function gridPointerAt(r: number, c: number) {
  return step.value.gridPointers?.find((p) => p.r === r && p.c === c)
}
</script>

<template>
  <div class="dp-viz">
    <div class="viz-stage">
      <!-- ============ 一维状态数组模式 ============ -->
      <div v-if="mode === 'array'">
        <!-- dp 指针行 -->
        <div class="dp-ptrs">
          <template v-for="(v, i) in step.dp" :key="'p' + i">
            <span
              v-for="(label, pi) in pointerAt(i)"
              :key="label"
              class="dp-ptr"
              :style="{
                left: `${i * STRIDE + 24 + (pi - (pointerAt(i).length - 1) / 2) * 16}px`,
              }"
              >{{ label }}<i>▼</i></span
            >
          </template>
        </div>
        <!-- dp 行 -->
        <div class="dp-title">{{ step.title ?? 'f' }}</div>
        <div class="dp-cols">
          <div
            v-for="(v, i) in step.dp"
            :key="'c' + i"
            class="dp-cell"
            :class="[stateClass(dpStateAt(i)), { 'is-empty': v === null }]"
          >
            <span v-if="v !== null" class="dp-val">{{ v }}</span>
            <span v-else class="dp-val dp-val-null">·</span>
            <span class="dp-idx">{{ i }}</span>
          </div>
        </div>
        <!-- dp 标签行 -->
        <div v-if="step.dpLabels?.length" class="dp-labels">
          <template v-for="(v, i) in step.dp" :key="'l' + i">
            <span
              v-if="dpLabelAt(i)"
              class="dp-label"
              :class="[stateClass(dpLabelAt(i)!.state ?? '')]"
              :style="{ left: `${i * STRIDE + 24}px` }"
              >{{ dpLabelAt(i)!.text }}</span
            >
          </template>
        </div>
        <!-- 辅助行（原数组等） -->
        <div v-if="step.aux?.length" class="dp-aux">
          <div v-for="(row, ri) in step.aux" :key="'a' + ri" class="dp-aux-row">
            <div class="dp-title">{{ row.title }}</div>
            <div class="dp-cols">
              <div
                v-for="(v, i) in row.values"
                :key="'av' + i"
                class="dp-cell"
                :class="[
                  stateClass(auxStateAt(row, i)),
                  { 'is-empty': v === null, 'is-aux-hl': auxIsHighlight(row, i) },
                ]"
              >
                <span v-if="v !== null" class="dp-val">{{ v }}</span>
                <span v-else class="dp-val dp-val-null">·</span>
                <span class="dp-idx">{{ i }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ 二维表格模式 ============ -->
      <div v-else class="dp-grid-wrap">
        <div
          class="dp-grid"
          :style="{ gridTemplateColumns: `auto repeat(${step.grid.colLabels.length}, ${CELL_W}px)` }"
        >
          <div class="dp-grid-corner"></div>
          <div v-for="(cl, c) in step.grid.colLabels" :key="'ch' + c" class="dp-grid-head">
            {{ cl }}
          </div>
          <template v-for="(row, r) in step.grid.values" :key="'r' + r">
            <div class="dp-grid-head dp-grid-rowhead">{{ step.grid.rowLabels[r] }}</div>
            <div
              v-for="(v, c) in row"
              :key="'g' + r + '-' + c"
              class="dp-cell"
              :class="[
                stateClass(gridTextAt(r, c)?.state ?? gridStateAt(r, c)),
                { 'is-empty': v === null && !gridTextAt(r, c) },
              ]"
            >
              <template v-if="gridTextAt(r, c)">
                <span class="dp-val dp-val-text">{{ gridTextAt(r, c)!.text }}</span>
                <span v-if="gridPointerAt(r, c)" class="dp-grid-ptr">
                  {{ gridPointerAt(r, c)!.label }}<i>▼</i>
                </span>
              </template>
              <template v-else>
                <span v-if="v !== null" class="dp-val">{{ v }}</span>
                <span class="dp-idx" v-if="false">{{ c }}</span>
              </template>
            </div>
          </template>
        </div>
      </div>

      <!-- 图例 -->
      <div class="dp-legend">
        <span><i class="dot dot-cur"></i>当前计算</span>
        <span><i class="dot dot-hl"></i>比较/参照</span>
        <span><i class="dot dot-done"></i>已计算</span>
        <span><i class="dot dot-path"></i>回溯路径</span>
        <span><i class="dot dot-mark"></i>答案</span>
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
.dp-viz {
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
/* ---------- 行标题 ---------- */
.dp-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
}
/* ---------- 指针 ---------- */
.dp-ptrs {
  position: relative;
  height: 22px;
  margin-bottom: 2px;
}
.dp-ptr {
  position: absolute;
  transform: translateX(-50%);
  font-weight: 700;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}
.dp-ptr i {
  font-style: normal;
  display: block;
  font-size: 9px;
  text-align: center;
  line-height: 1;
}
/* ---------- 单元格 ---------- */
.dp-cols {
  display: inline-flex;
  gap: 6px;
}
.dp-cell {
  width: 48px;
  height: 52px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  box-sizing: border-box;
  position: relative;
}
.dp-val {
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-text-1);
}
.dp-val-null {
  color: var(--vp-c-text-3);
  opacity: 0.5;
}
.dp-val-text {
  font-size: 16px;
}
.dp-idx {
  font-size: 10px;
  opacity: 0.55;
}
.dp-cell.is-empty {
  background: var(--vp-c-default-soft);
  border-color: transparent;
}
.dp-cell.is-cur {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.dp-cell.is-cur .dp-val {
  color: #fff;
}
.dp-cell.is-cur .dp-idx {
  color: #fff;
  opacity: 0.7;
}
.dp-cell.is-hl {
  background: var(--vp-c-yellow-soft);
  border-color: var(--vp-c-yellow-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-yellow-2) 25%, transparent);
}
.dp-cell.is-hl .dp-val {
  color: var(--vp-c-yellow-1);
}
.dp-cell.is-done {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
}
.dp-cell.is-done .dp-val {
  color: var(--vp-c-green-1);
}
.dp-cell.is-path {
  background: color-mix(in srgb, var(--vp-c-green-2) 14%, transparent);
  border-color: var(--vp-c-green-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-green-2) 20%, transparent);
}
.dp-cell.is-path .dp-val {
  color: var(--vp-c-green-1);
}
.dp-cell.is-mark {
  background: var(--vp-c-red-soft);
  border-color: var(--vp-c-red-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-red-2) 25%, transparent);
}
.dp-cell.is-mark .dp-val {
  color: var(--vp-c-red-1);
}
/* 辅助行高亮 */
.dp-cell.is-aux-hl {
  border-color: var(--vp-c-brand-1);
}
/* ---------- dp 标签行 ---------- */
.dp-labels {
  position: relative;
  height: 0;
}
.dp-label {
  position: absolute;
  transform: translateX(-50%);
  top: 8px;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.3;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
}
.dp-label.is-cur {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.dp-label.is-hl {
  background: var(--vp-c-yellow-soft);
  border-color: var(--vp-c-yellow-2);
  color: var(--vp-c-yellow-1);
}
.dp-label.is-done,
.dp-label.is-path {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
  color: var(--vp-c-green-1);
}
.dp-label.is-mark {
  background: var(--vp-c-red-soft);
  border-color: var(--vp-c-red-2);
  color: var(--vp-c-red-1);
}
/* ---------- 辅助行 ---------- */
.dp-aux {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--vp-c-divider);
}
.dp-aux-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/* ---------- 二维表格 ---------- */
.dp-grid-wrap {
  overflow-x: auto;
}
.dp-grid {
  display: grid;
  gap: 6px;
  align-items: center;
}
.dp-grid-head {
  min-width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 7px;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
}
.dp-grid-rowhead {
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  font-size: 13px;
}
.dp-grid-corner {
  width: 32px;
  height: 28px;
}
.dp-grid-ptr {
  position: absolute;
  top: 0;
  right: 3px;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
  background: var(--vp-c-bg-soft);
  padding: 0 2px;
}
.dp-grid-ptr i {
  font-style: normal;
  font-size: 8px;
  display: block;
  text-align: center;
}
/* ---------- 图例 / 说明 / 控制（与 ArrayViz 一致） ---------- */
.dp-legend {
  display: flex;
  gap: 14px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
}
.dp-legend span {
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
.dot-cur {
  background: var(--vp-c-brand-1);
}
.dot-hl {
  background: var(--vp-c-yellow-2);
}
.dot-done {
  background: var(--vp-c-green-2);
}
.dot-path {
  background: transparent;
  border: 2px solid var(--vp-c-green-1);
  box-sizing: border-box;
}
.dot-mark {
  background: var(--vp-c-red-2);
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
