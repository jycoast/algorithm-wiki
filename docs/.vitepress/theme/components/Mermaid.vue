<script setup lang="ts">
/**
 * Mermaid —— 懒加载流程图渲染
 * 用法：<Mermaid diagram="flowchart TD ..." />
 * 按需动态 import，不拖慢主包；主题切换时用 useData().isDark 重新渲染。
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ diagram: string }>()

const { isDark } = useData()
const container = ref<HTMLElement | null>(null)

let mermaid: any = null
let renderSeq = 0

async function render() {
  if (!container.value) return
  // 懒加载，仅在使用该组件的页面触发
  if (!mermaid) {
    const mod = await import('mermaid')
    mermaid = mod.default
  }
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'neutral',
    securityLevel: 'loose',
  })
  const id = `mmd-${++renderSeq}`
  container.value.innerHTML = ''
  try {
    const { svg } = await mermaid.render(id, props.diagram)
    container.value.innerHTML = svg
  } catch (err) {
    console.error('[Mermaid] 渲染失败:', err)
    container.value.innerHTML = `<pre class="mermaid-fallback">${props.diagram}</pre>`
  }
}

onMounted(render)
watch(() => props.diagram, () => render())
watch(isDark, () => render())
onBeforeUnmount(() => {
  mermaid = null
})
</script>

<template>
  <div ref="container" class="mermaid-wrap"></div>
</template>

<style scoped>
.mermaid-wrap {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  overflow-x: auto;
  padding: 8px 0;
}
.mermaid-wrap :deep(svg) {
  max-width: 100%;
  height: auto;
}
.mermaid-fallback {
  text-align: left;
  font-size: 13px;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}
</style>
