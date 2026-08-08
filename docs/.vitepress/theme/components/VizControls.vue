<script setup lang="ts">
/**
 * VizControls —— 可视化组件共用的说明文字 + 播放控制条
 * 用法：<VizControls :state="state" :note="step.note ?? ''" />
 * state 来自 useVizControl(props) 的返回值。
 */
import type { VizControlState } from '../composables/useVizControl'

defineProps<{
  state: VizControlState
  note?: string
}>()
</script>

<template>
  <p v-if="note" class="viz-note">{{ note }}</p>

  <div class="viz-controls">
    <button class="viz-btn" :disabled="state.isFirst" @click="state.reset" title="重置">⏮</button>
    <button class="viz-btn" :disabled="state.isFirst" @click="state.stepBack" title="上一步">◀</button>
    <button class="viz-btn viz-play" @click="state.togglePlay" title="播放/暂停">
      {{ state.playing ? '⏸' : '▶' }}
    </button>
    <button class="viz-btn" :disabled="state.isLast" @click="state.stepForward" title="下一步">▶</button>
    <span class="viz-count">{{ state.cur + 1 }} / {{ state.total }}</span>
    <label class="viz-speed">
      速度
      <input v-model.number="state.speed" type="range" min="300" max="2000" step="100" />
      <b>{{ state.speed }}ms</b>
    </label>
  </div>
</template>

<style scoped>
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
