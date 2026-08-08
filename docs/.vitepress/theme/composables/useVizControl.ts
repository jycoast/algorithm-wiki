/**
 * useVizControl —— 可视化组件共用的播放控制状态（ArrayViz / TreeViz / DpViz / ListViz 共用）
 *
 * 用法：
 *   const { state, step } = useVizControl(props)
 *
 * 返回：
 *   state: reactive 控制对象（模板中直接读写 state.cur / state.speed 等，ref 自动解包）
 *     cur / playing / speed / total / isFirst / isLast
 *     togglePlay / stepBack / stepForward / reset
 *   step:  当前步骤（props.steps[cur] 的快捷引用）
 *
 * 传给 <VizControls :state="state" :note="step.note ?? ''" /> 即可复用播放条与说明。
 */
import { ref, computed, reactive, watch, onBeforeUnmount } from 'vue'

export interface VizControlState {
  cur: number
  playing: boolean
  speed: number
  total: number
  isFirst: boolean
  isLast: boolean
  togglePlay: () => void
  stepBack: () => void
  stepForward: () => void
  reset: () => void
}

export function useVizControl<S>(props: { steps: S[] }) {
  const cur = ref(0)
  const playing = ref(false)
  const speed = ref(1000)
  let timer: ReturnType<typeof setTimeout> | null = null

  const total = computed(() => props.steps.length)
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

  const step = computed(() => props.steps[cur.value] ?? props.steps[0])

  // 注意：不要用 reactive<VizControlState> 显式标注 —— 传入的是 ref，
  // 交给 UnwrapNestedRefs 自动推断即可把 cur/playing/… 解包成普通值。
  const state = reactive({
    cur,
    playing,
    speed,
    total,
    isFirst,
    isLast,
    togglePlay,
    stepBack,
    stepForward,
    reset,
  })

  return { state, step }
}
