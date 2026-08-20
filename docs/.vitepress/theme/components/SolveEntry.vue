<script setup lang="ts">
/**
 * 刷题模式入口横幅：由 inject-runner 插件前置到带 testcases 的 /leetcode/ 页面顶部，
 * 链接到全屏刷题页 /solve/<slug>。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const slug = computed(() => {
  const rel = (page.value.relativePath || '').replace(/\.md$/, '')
  return rel.split('/').pop() ?? ''
})
const href = computed(() => '/solve/' + slug.value)
</script>

<template>
  <div class="solve-entry">
    <span class="se-text">💻 在线刷题 · 全屏 IDE 模式</span>
    <a class="se-btn" :href="href">进入刷题模式 →</a>
  </div>
</template>

<style scoped>
.solve-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 16px;
  padding: 10px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), color-mix(in srgb, var(--vp-c-brand-2) 5%, transparent));
  flex-wrap: wrap;
}

.se-text {
  font-size: 13.5px;
  color: var(--vp-c-text-2);
}

.se-btn {
  padding: 5px 18px;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
}

.se-btn:hover {
  background: var(--vp-c-brand-2);
}
</style>
