<script setup lang="ts">
/**
 * Giscus 评论区（基于 GitHub Discussions）
 * 仅在 /leetcode/* 题解页底部渲染；未配置 repoId/categoryId 时不显示。
 */
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { useRoute, useData } from 'vitepress'
import { GISCUS_CONFIG } from '../giscus-config'

const route = useRoute()
const { isDark } = useData()
const container = ref<HTMLDivElement | null>(null)

const isEnabled = Boolean(GISCUS_CONFIG.repoId && GISCUS_CONFIG.categoryId)
const isProblemPage = computed(() => /\/leetcode\//.test(route.path))

let scriptEl: HTMLScriptElement | null = null

function themeName() {
  return isDark.value ? 'dark' : 'light'
}

/** 注入 giscus 脚本；先清空容器，避免重复挂载 */
function load() {
  if (!isEnabled || !container.value) return
  container.value.innerHTML = ''
  scriptEl = document.createElement('script')
  scriptEl.src = 'https://giscus.app/client.js'
  scriptEl.async = true
  scriptEl.crossOrigin = 'anonymous'
  const attrs: Record<string, string> = {
    'data-repo': GISCUS_CONFIG.repo,
    'data-repo-id': GISCUS_CONFIG.repoId,
    'data-category': GISCUS_CONFIG.category,
    'data-category-id': GISCUS_CONFIG.categoryId,
    'data-mapping': GISCUS_CONFIG.mapping,
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'bottom',
    'data-theme': themeName(),
    'data-lang': GISCUS_CONFIG.lang,
    'data-loading': 'lazy',
  }
  for (const [k, v] of Object.entries(attrs)) scriptEl.setAttribute(k, v)
  container.value.appendChild(scriptEl)
}

/** 主题切换时通过 postMessage 通知 giscus iframe 换肤（不重载） */
function syncTheme() {
  const frame = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
  if (frame?.contentWindow) {
    frame.contentWindow.postMessage({ giscus: { setConfig: { theme: themeName() } } }, 'https://giscus.app')
  }
}

onMounted(() => {
  load()
  // 切换页面后重载评论；切换主题后实时换肤
  watch(
    () => route.path,
    () => nextTick(load)
  )
  watch(isDark, () => syncTheme())
})

onBeforeUnmount(() => {
  scriptEl?.remove()
  scriptEl = null
})
</script>

<template>
  <div v-if="isEnabled && isProblemPage" class="giscus-wrap">
    <h2 class="giscus-title">评论</h2>
    <div ref="container"></div>
  </div>
</template>
