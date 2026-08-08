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

export default {
  extends: DefaultTheme,
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
