// .vitepress/theme/index.ts
// 迁移自旧项目 theme/index.js,保持 medium-zoom 图片缩放功能
import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'
import './global.css'
import 'virtual:group-icons.css'
import './custom.css'

import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import GiscusComments from './components/GiscusComments.vue'
import ArrayViz from './components/ArrayViz.vue'
import TreeViz from './components/TreeViz.vue'
import DpViz from './components/DpViz.vue'
import Mermaid from './components/Mermaid.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // markdown 中可直接使用 <ArrayViz /> / <TreeViz /> / <DpViz /> / <Mermaid />
    app.component('ArrayViz', ArrayViz)
    app.component('TreeViz', TreeViz)
    app.component('DpViz', DpViz)
    app.component('Mermaid', Mermaid)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 题解页正文之后、编辑链接之前：Giscus 评论区
      'doc-footer-before': () => h(GiscusComments),
    })
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 为所有图片增加缩放功能
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
} satisfies Theme
