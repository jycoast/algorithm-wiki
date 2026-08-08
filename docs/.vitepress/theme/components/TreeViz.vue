<script setup lang="ts">
/**
 * TreeViz —— 二叉树逐步可视化（配合 ArrayViz 使用）
 * 用法：<TreeViz :steps="steps" />
 *
 * 每步结构：
 *   tree:   (number | null)[]  层序数组，与 LeetCode 输入 root = [...] 格式一致
 *                               例：[3, 9, 20, null, null, 15, 7]
 *   states: { id, state }[]    节点状态覆盖（id 为层序下标，root=0，left=2i+1，right=2i+2）
 *     state 取值：cur（当前访问/考察中，品牌色实心）
 *                 hl （比较/交换/匹配中，黄色）
 *                 done（已访问/已加入答案，绿色）
 *                 path（路径上的节点，绿色描边）
 *                 mark（目标/结果/非法节点，红色）
 *   labels: { id, text, state? }[]  节点下方的小标签（如子树高度、路径和、合法区间）
 *   aux:    { title, values, marker?, markerLabel? }[]  辅助结构面板（栈/队列/数组）
 *     values 为元素数组；marker 为需要打 ▼ 的下标；markerLabel 为 marker 处文字
 *   note:   当前步骤文字说明
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export interface TreeVizNodeState {
  id: number
  state: 'cur' | 'hl' | 'done' | 'path' | 'mark'
}
export interface TreeVizLabel {
  id: number
  text: string
  state?: 'cur' | 'hl' | 'done' | 'path' | 'mark'
}
export interface TreeVizAux {
  title: string
  values: (number | null)[]
  marker?: number
  markerLabel?: string
}
export interface TreeVizStep {
  tree: (number | null)[]
  states?: TreeVizNodeState[]
  labels?: TreeVizLabel[]
  aux?: TreeVizAux[]
  note?: string
}

const props = defineProps<{ steps: TreeVizStep[] }>()

const cur = ref(0)
const playing = ref(false)
const speed = ref(1000)
let timer: ReturnType<typeof setTimeout> | null = null

const total = computed(() => props.steps.length)
const step = computed(() => props.steps[cur.value] ?? props.steps[0])
const isFirst = computed(() => cur.value === 0)
const isLast = computed(() => cur.value >= total.value - 1)

const NODE_R = 20
const X_STEP = 56
const Y_STEP = 88
const LABEL_H = 18
const PAD_X = NODE_R + 6 // 左右留白：防止最左/最右节点被容器裁剪
const TOP_PAD = NODE_R + 6 // 顶部留白：防止根节点上半部分被遮挡

/* ---------- 布局：由层序数组计算每个节点的坐标 ---------- */

interface TreePos {
  id: number
  val: number
  depth: number
  offset: number
  x: number
  y: number
}

const layout = computed(() => {
  const tree = step.value.tree ?? []
  const nodes: TreePos[] = []
  tree.forEach((v, i) => {
    if (v === null) return
    const depth = Math.floor(Math.log2(i + 1))
    const offset = i - (2 ** depth - 1)
    nodes.push({ id: i, val: v, depth, offset, x: 0, y: 0 })
  })
  const maxDepth = nodes.length ? Math.max(...nodes.map((n) => n.depth)) : 0
  const maxSlots = 2 ** maxDepth
  // 深度过大时压缩横向间距，保证整树宽度不超过可视区域
  const xStep = maxSlots > 12 ? Math.max(34, (X_STEP * 12) / maxSlots) : X_STEP
  nodes.forEach((n) => {
    n.x = PAD_X + (n.offset + 0.5) * xStep
    n.y = TOP_PAD + n.depth * Y_STEP
  })
  const stageW = Math.max(120, PAD_X * 2 + maxSlots * xStep + 8)
  const stageH = TOP_PAD + maxDepth * Y_STEP + NODE_R + LABEL_H + 34
  return { nodes, stageW, stageH }
})

const posMap = computed(() => {
  const m: Record<number, TreePos> = {}
  for (const n of layout.value.nodes) m[n.id] = n
  return m
})

/* ---------- 节点状态 / 标签 / 边 ---------- */

const stateMap = computed(() => {
  const m: Record<number, string> = {}
  for (const s of step.value.states ?? []) m[s.id] = s.state
  return m
})
const labelMap = computed(() => {
  const m: Record<number, TreeVizLabel> = {}
  for (const l of step.value.labels ?? []) m[l.id] = l
  return m
})
function nodeState(id: number) {
  return stateMap.value[id] ?? ''
}

/* 边：父节点 -> 左右孩子（仅当孩子存在） */
interface TreeEdge {
  x1: number
  y1: number
  x2: number
  y2: number
}
const edges = computed(() => {
  const list: TreeEdge[] = []
  for (const n of layout.value.nodes) {
    for (const child of [2 * n.id + 1, 2 * n.id + 2]) {
      const c = posMap.value[child]
      if (!c) continue
      list.push({
        x1: n.x,
        y1: n.y + NODE_R,
        x2: c.x,
        y2: c.y - NODE_R,
      })
    }
  }
  return list
})

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
</script>

<template>
  <div class="tree-viz">
    <div class="viz-stage">
      <!-- ============ 树 ============ -->
      <svg
        class="tree-edges"
        :viewBox="`0 0 ${layout.stageW} ${layout.stageH}`"
        :width="layout.stageW"
        :height="layout.stageH"
      >
        <line
          v-for="(e, i) in edges"
          :key="'e' + i"
          :x1="e.x1"
          :y1="e.y1"
          :x2="e.x2"
          :y2="e.y2"
          class="tree-edge-line"
        />
      </svg>

      <div
        v-for="n in layout.nodes"
        :key="n.id"
        class="tree-node"
        :class="{ 'is-cur': nodeState(n.id) === 'cur', 'is-hl': nodeState(n.id) === 'hl', 'is-done': nodeState(n.id) === 'done', 'is-path': nodeState(n.id) === 'path', 'is-mark': nodeState(n.id) === 'mark' }"
        :style="{ left: `${n.x}px`, top: `${n.y}px` }"
      >
        <span class="tree-node-val">{{ n.val }}</span>
        <span
          v-if="labelMap[n.id]"
          class="tree-node-label"
          :class="{ 'is-cur': labelMap[n.id].state === 'cur', 'is-hl': labelMap[n.id].state === 'hl', 'is-done': labelMap[n.id].state === 'done', 'is-path': labelMap[n.id].state === 'path', 'is-mark': labelMap[n.id].state === 'mark' }"
          >{{ labelMap[n.id].text }}</span
        >
      </div>
      <div v-if="!layout.nodes.length" class="tree-empty">（空树）</div>
    </div>

    <!-- ============ 辅助面板（栈 / 队列 / 数组） ============ -->
    <div v-if="step.aux?.length" class="tree-aux">
      <div v-for="(a, ai) in step.aux" :key="'a' + ai" class="tree-aux-row">
        <div class="tree-aux-title">{{ a.title }}</div>
        <div class="tree-aux-body">
          <div class="tree-aux-ptrs">
            <span v-if="a.marker !== undefined" class="tree-aux-ptr" :style="{ left: `${a.marker * 40 + 20}px` }"
              >{{ a.markerLabel ?? '▼' }}</span
            >
          </div>
          <div class="tree-aux-cells">
            <span
              v-for="(v, vi) in a.values"
              :key="'v' + vi"
              class="tree-aux-cell"
              :class="{ 'is-null': v === null }"
              >{{ v }}</span
            >
          </div>
        </div>
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
.tree-viz {
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
/* ---------- 树 ---------- */
.tree-edges {
  display: block;
}
.tree-edge-line {
  stroke: var(--vp-c-divider);
  stroke-width: 2;
}
.tree-node {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  z-index: 1;
}
.tree-node-val {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  color: var(--vp-c-text-1);
}
.tree-node-label {
  position: absolute;
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
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
.tree-node-label.is-cur {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.tree-node-label.is-hl {
  background: var(--vp-c-yellow-soft);
  border-color: var(--vp-c-yellow-2);
  color: var(--vp-c-yellow-1);
}
.tree-node-label.is-done,
.tree-node-label.is-path {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
  color: var(--vp-c-green-1);
}
.tree-node-label.is-mark {
  background: var(--vp-c-red-soft);
  border-color: var(--vp-c-red-2);
  color: var(--vp-c-red-1);
}
.tree-node.is-cur {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.tree-node.is-cur .tree-node-val {
  color: #fff;
}
.tree-node.is-hl {
  background: var(--vp-c-yellow-soft);
  border-color: var(--vp-c-yellow-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-yellow-2) 25%, transparent);
}
.tree-node.is-hl .tree-node-val {
  color: var(--vp-c-yellow-1);
}
.tree-node.is-done {
  background: var(--vp-c-green-soft);
  border-color: var(--vp-c-green-2);
}
.tree-node.is-done .tree-node-val {
  color: var(--vp-c-green-1);
}
.tree-node.is-path {
  background: color-mix(in srgb, var(--vp-c-green-2) 14%, transparent);
  border-color: var(--vp-c-green-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-green-2) 20%, transparent);
}
.tree-node.is-path .tree-node-val {
  color: var(--vp-c-green-1);
}
.tree-node.is-mark {
  background: var(--vp-c-red-soft);
  border-color: var(--vp-c-red-2);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-red-2) 25%, transparent);
}
.tree-node.is-mark .tree-node-val {
  color: var(--vp-c-red-1);
}
.tree-empty {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
/* ---------- 辅助面板 ---------- */
.tree-aux {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px dashed var(--vp-c-divider);
}
.tree-aux-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.tree-aux-title {
  min-width: 60px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  padding-top: 6px;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
}
.tree-aux-body {
  position: relative;
}
.tree-aux-ptrs {
  position: relative;
  height: 18px;
}
.tree-aux-ptr {
  position: absolute;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}
.tree-aux-cells {
  display: inline-flex;
  gap: 4px;
}
.tree-aux-cell {
  min-width: 36px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 14px;
  font-weight: 600;
  padding: 0 8px;
  box-sizing: border-box;
  font-family: ui-monospace, 'JetBrains Mono', Consolas, monospace;
  color: var(--vp-c-text-1);
}
.tree-aux-cell.is-null {
  color: var(--vp-c-text-3);
  opacity: 0.6;
}
/* ---------- 说明 / 控制（与 ArrayViz 一致） ---------- */
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
