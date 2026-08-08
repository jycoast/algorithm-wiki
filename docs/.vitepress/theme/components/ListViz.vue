<script setup lang="ts">
/**
 * ListViz —— 链表逐步可视化（配合 ArrayViz / TreeViz / DpViz 使用）
 * 用法：<ListViz :steps="steps" />
 *
 * 每步结构：
 *   lists: ListRow[]  一个或多个链表（合并、双指针等场景）
 *     title:    string?   链表名（如 l1 / l2 / result）
 *     values:   (number | string | null)[]  节点值，null 表示空/哨兵/末尾
 *     pointers: { id, label }[]  指针（id 为节点下标，0=head）
 *     states:   { id, state }[]  节点状态
 *     cycleTo:  number?  该链表尾节点指向的下标（环），画 ↰ 标记
 *   note:   当前步骤文字说明
 *
 * 状态语义（与 TreeViz / DpViz 一致）：
 *   cur  = 当前访问/操作中（品牌色实心）
 *   hl   = 比较/参照中（黄色）
 *   done = 已完成（绿色）
 *   path = 路径/已连接（绿色描边）
 *   mark = 目标/结果节点（红色）
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export type ListState = 'cur' | 'hl' | 'done' | 'path' | 'mark'
export interface ListRow {
  title?: string
  values: (number | string | null)[]
  pointers?: { id: number; label: string }[]
  states?: { id: number; state: ListState }[]
  cycleTo?: number
}
export interface ListVizStep {
  lists: ListRow[]
  note?: string
}

const props = defineProps<{ steps: ListVizStep[] }>()

const cur = ref(0)
const playing = ref(false)
const speed = ref(1000)
let timer: ReturnType<typeof setTimeout> | null = null

const total = computed(() => props.steps.length)
const step = computed(() => props.steps[cur.value] ?? props.steps[0])
const isFirst = computed(() => cur.value === 0)
const isLast = computed(() => cur.value >= total.value - 1)

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

/* ---------- 布局辅助 ---------- */

function ptrAt(row: ListRow, id: number) {
  return row.pointers?.filter((p) => p.id === id) ?? []
}
function nodeState(row: ListRow, id: number) {
  return row.states?.find((s) => s.id === id)?.state ?? ''
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
// slot 序列：节点0、箭头、节点1、箭头、…（节点 slot 偶、箭头 slot 奇）
function slotCount(row: ListRow) {
  return Math.max(0, row.values.length * 2 - 1)
}
function slotIsArrow(slot: number) {
  return slot % 2 === 1
}
function nodeIndexOf(slot: number) {
  return Math.floor(slot / 2)
}
</script>

<template>
  <div class="list-viz">
    <div class="viz-stage">
      <!-- ============ 链表（一个或多个） ============ -->
      <div v-if="step.lists?.length" class="list-rows">
        <div v-for="(row, ri) in step.lists" :key="'r' + ri" class="list-row">
          <div v-if="row.title" class="list-title">{{ row.title }}</div>
          <div class="list-track">
            <!-- 指针行（与节点行同 slot 结构，保证对齐） -->
            <div class="list-ptrs">
              <template v-for="(s, si) in slotCount(row)" :key="'p' + si">
                <div
                  class="list-slot"
                  :class="slotIsArrow(s) ? 'is-arrow-slot' : 'is-node-slot'"
                >
                  <span
                    v-if="!slotIsArrow(s) && ptrAt(row, nodeIndexOf(s)).length"
                    class="list-ptr"
                    >{{ ptrAt(row, nodeIndexOf(s)).map((p) => p.label).join(' ') }}<i>▼</i></span
                  >
                </div>
              </template>
              <div v-if="row.cycleTo !== undefined" class="list-slot is-cycle-slot"></div>
            </div>
            <!-- 节点行 -->
            <div class="list-nodes">
              <template v-for="(s, si) in slotCount(row)" :key="'n' + si">
                <div
                  class="list-slot"
                  :class="slotIsArrow(s) ? 'is-arrow-slot' : 'is-node-slot'"
                >
                  <div
                    v-if="!slotIsArrow(s)"
                    class="list-node"
                    :class="[stateClass(nodeState(row, nodeIndexOf(s))), { 'is-null': row.values[nodeIndexOf(s)] === null }]"
                  >
                    <span class="list-val">{{ row.values[nodeIndexOf(s)] === null ? '∅' : row.values[nodeIndexOf(s)] }}</span>
                    <span class="list-idx">{{ nodeIndexOf(s) }}</span>
                  </div>
                  <div v-else class="list-arrow">→</div>
                </div>
              </template>
              <!-- 环标记 -->
              <div v-if="row.cycleTo !== undefined" class="list-cycle">
                ↰ 环入口 = {{ row.cycleTo }}
              </div>
            </div>
          </div>
          <div v-if="!row.values.length" class="list-empty">（空链表）</div>
        </div>
      </div>
      <div v-else class="list-empty">（空）</div>

      <!-- 图例 -->
      <div class="list-legend">
        <span><i class="dot dot-cur"></i>当前操作</span>
        <span><i class="dot dot-hl"></i>比较/参照</span>
        <span><i class="dot dot-done"></i>已完成</span>
        <span><i class="dot dot-path"></i>已连接</span>
        <span><i class="dot dot-mark"></i>目标/结果</span>
        <span><i class="dot dot-null"></i>空节点</span>
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
.list-viz {
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
/* ---------- 链表 ---------- */
.list-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.list-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.list-title {
  min-width: 52px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  padding-top: 28px;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  text-align: right;
}
.list-track {
  display: flex;
  flex-direction: column;
}
.list-ptrs {
  display: flex;
  height: 22px;
  margin-bottom: 2px;
}
.list-nodes {
  display: flex;
  align-items: center;
}
.list-slot {
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-slot.is-node-slot {
  width: 58px;
  flex: none;
}
.list-slot.is-arrow-slot {
  width: 20px;
  flex: none;
}
.list-ptr {
  font-weight: 700;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
  line-height: 1;
}
.list-ptr i {
  font-style: normal;
  display: block;
  font-size: 9px;
  text-align: center;
  line-height: 1;
}
.list-node {
  width: 54px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  box-sizing: border-box;
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
}
.list-val {
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-text-1);
}
.list-idx {
  font-size: 9px;
  opacity: 0.5;
  line-height: 1;
}
.list-arrow {
  color: var(--vp-c-text-3);
  font-size: 15px;
  line-height: 1;
}
.list-empty {
  font-size: 13px;
  color: var(--vp-c-text-3);
  padding: 8px 0;
}
/* 环标记 */
.list-cycle {
  margin-left: 4px;
  align-self: center;
  font-size: 11px;
  white-space: nowrap;
  color: var(--vp-c-red-1);
  border: 1px dashed var(--vp-c-red-2);
  background: var(--vp-c-red-soft);
  padding: 2px 6px;
  border-radius: 6px;
  font-family: ui-monospace, Consolas, monospace;
}
/* 空节点 */
.list-node.is-null {
  background: var(--vp-c-default-soft);
  border-style: dashed;
  opacity: 0.7;
}
.list-node.is-null .list-val {
  color: var(--vp-c-text-3);
}
/* 状态 */
.list-node.is-cur {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.list-node.is-cur .list-val {
  color: #fff;
}
.list-node.is-cur .list-idx {
  color: #fff;
  opacity: 0.7;
}
.list-node.is-hl {
  background: var(--vp-c-yellow-soft);
  border-color: var(--vp-c-yellow-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-yellow-2) 25%, transparent);
}
.list-node.is-hl .list-val {
  color: var(--vp-c-yellow-1);
}
.list-node.is-done {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
}
.list-node.is-done .list-val {
  color: var(--vp-c-green-1);
}
.list-node.is-path {
  background: color-mix(in srgb, var(--vp-c-green-2) 14%, transparent);
  border-color: var(--vp-c-green-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-green-2) 20%, transparent);
}
.list-node.is-path .list-val {
  color: var(--vp-c-green-1);
}
.list-node.is-mark {
  background: var(--vp-c-red-soft);
  border-color: var(--vp-c-red-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-red-2) 25%, transparent);
}
.list-node.is-mark .list-val {
  color: var(--vp-c-red-1);
}
/* ---------- 图例 / 说明 / 控制 ---------- */
.list-legend {
  display: flex;
  gap: 14px;
  margin-top: 14px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
}
.list-legend span {
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
.dot-null {
  background: var(--vp-c-default-soft);
  border: 1px dashed var(--vp-c-text-3);
  box-sizing: border-box;
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
