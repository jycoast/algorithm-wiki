// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme-without-fonts'
import './global.css'

import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

export default {
    extends: DefaultTheme,
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
  }