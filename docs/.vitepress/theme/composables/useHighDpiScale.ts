/**
 * useHighDpiScale —— 高分屏整体等比缩放（让显示观感与 1080p 一致）
 *
 * 原理：
 *   高分屏（2K / 4K / 放大后的宽屏）上视口逻辑宽度 > 1920px 时，
 *   把 <html> 按  scale = clamp(innerWidth / 1920, 1, 2.5) 设置 zoom，
 *   页面整体等比放大 —— 字号、图表、代码块在物理屏上的观感与 1080p 显示器一致，
 *   而不是默认的分辨率越高字越小。
 *
 * 约束：
 *   - 只放大不缩小：1920px 及以下（含 1080p、平板、手机）保持原样
 *   - 跟随窗口 resize / 系统缩放（DPI）变化实时更新
 *   - 依赖浏览器普遍支持的 zoom 属性（Chromium、Safari、Firefox 126+）
 */
import { onBeforeUnmount, onMounted } from 'vue'

/** 1080p 对应的视口逻辑宽度（基准） */
const BASE_WIDTH = 1920
/** 最大缩放，避免 5K/8K 等极端大屏把页面放得过大 */
const MAX_SCALE = 2.5

export function useHighDpiScale() {
  let mql: MediaQueryList | null = null

  function applyScale() {
    const el = document.documentElement
    if (!el) return
    // 先按无缩放读取视口宽，避免 zoom 叠加影响读数（zoom 不变 innerWidth，这里仅作防御）
    const width = window.innerWidth
    const scale = Math.min(Math.max(width / BASE_WIDTH, 1), MAX_SCALE)
    el.style.zoom = scale > 1 ? String(scale) : ''
  }

  /** DPI 变化时重建监听并重新计算（拖拽到不同缩放的屏幕 / 系统改缩放比例） */
  function onDprChange() {
    mql?.removeEventListener('change', onDprChange)
    attachDprWatch()
    applyScale()
  }

  function attachDprWatch() {
    mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mql.addEventListener('change', onDprChange)
  }

  onMounted(() => {
    applyScale()
    attachDprWatch()
    window.addEventListener('resize', applyScale)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', applyScale)
    mql?.removeEventListener('change', onDprChange)
  })
}