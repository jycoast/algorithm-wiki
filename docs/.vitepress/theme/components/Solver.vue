<script setup lang="ts">
/**
 * LeetCode 式全屏刷题组件（layout:false 页面）。
 *
 * - 由 docs/solve/<slug>.md（自动生成）以 `<Solver slug="..." />` 引入
 * - 左侧题目描述（构建时从 description 标记截取的 HTML），右侧 CodeMirror 编辑器
 * - 顶栏：返回题解 / 题号难度 / 上一题下一题 / 语言切换 / ▶运行 / 提交
 * - 运行：判可见示例用例，逐用例 ✓/✗；提交：判 hidden_testcases（无则回退可见），verdict 大 banner
 * - 数据全部来自 problemsData（构建时生成），不依赖页面 frontmatter
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import { useEditor } from '../runner/useEditor'
import { problemsData, type GeneratedProblem } from '../runner/problems-data'
import { runPython } from '../runner/pythonHarness'
import { runJava } from '../runner/javaHarness'
import type { RunReport, TestCase } from '../runner/types'

const props = defineProps<{ slug: string }>()
const router = useRouter()

/* ---------------- 题目数据 ---------------- */

const problem = computed<GeneratedProblem | undefined>(() => problemsData[props.slug])
const entry = computed(() => problem.value?.entry ?? '')
const testcases = computed<TestCase[]>(() => problem.value?.testcases ?? [])
const hiddenTestcases = computed<TestCase[]>(() => problem.value?.hiddenTestcases ?? [])
const mode = computed<'void-first-arg' | undefined>(() => problem.value?.mode)

const difficultyText = computed(() => problem.value?.difficulty ?? '')
const difficultyClass = computed(() => {
  const d = difficultyText.value
  if (d.includes('简单')) return 'easy'
  if (d.includes('困难')) return 'hard'
  return 'medium'
})

const prevSlug = computed(() => problem.value?.prev)
const nextSlug = computed(() => problem.value?.next)

/* ---------------- 编辑器（useEditor） ---------------- */

const running = ref(false)
const slugRef = computed(() => props.slug)
const { lang, currentCode, setLang, reset: resetEditor, initEditor, destroy: destroyEditor } =
  useEditor(slugRef, { isLocked: () => running.value })

const editorEl = ref<HTMLDivElement | null>(null)

watch(
  [lang, slugRef],
  async () => {
    if (!problem.value) return
    await nextTick()
    if (editorEl.value) initEditor(editorEl.value, true)
  },
  { immediate: true },
)

onBeforeUnmount(() => destroyEditor())

function switchLang(l: 'python' | 'java') {
  setLang(l)
  consoleMode.value = null
}

function reset() {
  resetEditor()
  consoleMode.value = null
  if (editorEl.value) initEditor(editorEl.value)
}

/* ---------------- 运行 / 提交 ---------------- */

const loading = ref(false)
const loadingText = ref('')
const consoleMode = ref<'run' | 'submit' | null>(null)
const report = ref<RunReport | null>(null)
const submitReport = ref<RunReport | null>(null)

function fmt(v: unknown): string {
  if (v === undefined) return 'undefined'
  return JSON.stringify(v)
}

const LOADING_TEXT: Record<string, string> = {
  python: '正在加载 Python 运行时（首次约 10MB，请稍候）…',
  java: '正在加载 Java 运行时（首次约 20MB，请稍候）…',
}

async function run() {
  if (running.value || !problem.value || !testcases.value.length) return
  consoleMode.value = 'run'
  report.value = null
  submitReport.value = null
  running.value = true
  loading.value = true
  loadingText.value = LOADING_TEXT[lang.value]
  try {
    report.value = lang.value === 'python'
      ? await runPython(currentCode.value, entry.value, testcases.value, undefined, mode.value)
      : await runJava(currentCode.value, entry.value, testcases.value, mode.value)
  } finally {
    running.value = false
    loading.value = false
  }
}

async function submit() {
  if (running.value || !problem.value) return
  const cases = hiddenTestcases.value.length ? hiddenTestcases.value : testcases.value
  if (!cases.length) return
  consoleMode.value = 'submit'
  report.value = null
  submitReport.value = null
  running.value = true
  loading.value = true
  loadingText.value = LOADING_TEXT[lang.value]
  try {
    submitReport.value = lang.value === 'python'
      ? await runPython(currentCode.value, entry.value, cases, undefined, mode.value)
      : await runJava(currentCode.value, entry.value, cases, mode.value)
  } finally {
    running.value = false
    loading.value = false
  }
}

/* ---------------- 分割条 ---------------- */

const leftWidth = ref(42) // 左栏占视口百分比
const consoleHeight = ref(36) // 控制台占右侧百分比
const dragging = ref(false)

function startLeftDrag(e: MouseEvent) {
  e.preventDefault()
  dragging.value = true
  const move = (ev: MouseEvent) => {
    const w = (ev.clientX / window.innerWidth) * 100
    leftWidth.value = Math.max(22, Math.min(75, w))
  }
  const up = () => {
    dragging.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function startConsoleDrag(e: MouseEvent) {
  e.preventDefault()
  dragging.value = true
  const move = (ev: MouseEvent) => {
    const panel = document.querySelector('.sv-right') as HTMLElement | null
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    const h = ((rect.bottom - ev.clientY) / rect.height) * 100
    consoleHeight.value = Math.max(15, Math.min(70, h))
  }
  const up = () => {
    dragging.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function go(href: string) {
  router.go(href)
}
</script>

<template>
  <div v-if="problem" class="solver" :class="{ dragging }">
    <!-- 顶栏 -->
    <header class="sv-topbar">
      <a class="sv-back" :href="'/leetcode/' + slug" @click.prevent="go('/leetcode/' + slug)">← 题解</a>
      <div class="sv-title">
        <span class="sv-title-name">{{ problem.title }}</span>
        <span class="sv-diff" :class="difficultyClass">{{ difficultyText }}</span>
      </div>
      <nav class="sv-nav">
        <a v-if="prevSlug" class="sv-nav-link" :href="'/solve/' + prevSlug" @click.prevent="go('/solve/' + prevSlug)">上一题</a>
        <span v-else class="sv-nav-link disabled">上一题</span>
        <a v-if="nextSlug" class="sv-nav-link" :href="'/solve/' + nextSlug" @click.prevent="go('/solve/' + nextSlug)">下一题</a>
        <span v-else class="sv-nav-link disabled">下一题</span>
      </nav>
      <div class="sv-actions">
        <div class="sv-tabs">
          <button class="sv-tab" :class="{ active: lang === 'python' }" :disabled="running" @click="switchLang('python')">Python</button>
          <button class="sv-tab" :class="{ active: lang === 'java' }" :disabled="running" @click="switchLang('java')">Java</button>
        </div>
        <button class="sv-btn sv-btn-ghost" :disabled="running" @click="reset">重置</button>
        <button class="sv-btn sv-btn-ghost" :disabled="running" @click="run">
          {{ running ? '运行中…' : '▶ 运行' }}
        </button>
        <button class="sv-btn sv-btn-primary" :disabled="running" @click="submit">提交</button>
      </div>
    </header>

    <!-- 主体 -->
    <div class="sv-body">
      <section class="sv-left" :style="{ flexBasis: leftWidth + '%' }">
        <div class="sv-desc" v-html="problem.descriptionHtml"></div>
      </section>
      <div class="sv-splitter" @mousedown="startLeftDrag"></div>
      <section class="sv-right">
        <div ref="editorEl" :key="lang" class="sv-editor"></div>
        <div class="sv-console-splitter" @mousedown="startConsoleDrag"></div>
        <div class="sv-console" :style="{ height: consoleHeight + '%' }">
          <div v-if="loading" class="sv-loading">
            <span class="sv-spinner"></span>
            <span>{{ loadingText }}</span>
          </div>

          <!-- 运行：逐用例 -->
          <template v-else-if="consoleMode === 'run' && report">
            <div v-if="report.compileError" class="sv-error-box">
              <strong>无法运行：</strong><span>{{ report.compileError }}</span>
            </div>
            <template v-else>
              <div class="sv-cases">
                <div v-for="c in report.results" :key="c.index" class="sv-case" :class="c.ok ? 'ok' : 'fail'">
                  <span class="sv-case-icon">{{ c.ok ? '✓' : '✗' }}</span>
                  <span class="sv-case-name">示例 {{ c.index }}</span>
                  <span v-if="c.error" class="sv-case-error">运行出错：{{ c.error }}</span>
                  <span v-else class="sv-case-detail">
                    期望 <code>{{ fmt(c.expected) }}</code>
                    <template v-if="!c.ok">，实际 <code class="wrong">{{ fmt(c.actual) }}</code></template>
                  </span>
                </div>
              </div>
              <div v-if="report.stdout" class="sv-stdout">
                <div class="sv-stdout-title">print / System.out 输出</div>
                <pre>{{ report.stdout }}</pre>
              </div>
            </template>
          </template>

          <!-- 提交：verdict -->
          <template v-else-if="consoleMode === 'submit' && submitReport">
            <div
              class="sv-verdict"
              :class="submitReport.compileError ? 'ce' : submitReport.passed === submitReport.total ? 'pass' : 'fail'"
            >
              <template v-if="submitReport.compileError">
                <span class="sv-verdict-badge">编译错误</span>
                <span class="sv-verdict-text">{{ submitReport.compileError }}</span>
              </template>
              <template v-else-if="submitReport.passed === submitReport.total">
                <span class="sv-verdict-badge">通过</span>
                <span class="sv-verdict-text">🎉 恭喜，全部 {{ submitReport.total }} 个测试用例通过！</span>
              </template>
              <template v-else>
                <span class="sv-verdict-badge">未通过</span>
                <span class="sv-verdict-text">
                  通过了 {{ submitReport.passed }} / {{ submitReport.total }} 个测试用例，请检查失败用例。
                </span>
              </template>
            </div>
            <template v-if="!submitReport.compileError && submitReport.passed !== submitReport.total">
              <div class="sv-cases">
                <div v-for="c in submitReport.results" :key="c.index" class="sv-case" :class="c.ok ? 'ok' : 'fail'">
                  <span class="sv-case-icon">{{ c.ok ? '✓' : '✗' }}</span>
                  <span class="sv-case-name">用例 {{ c.index }}</span>
                  <span v-if="c.error" class="sv-case-error">运行出错：{{ c.error }}</span>
                  <span v-else class="sv-case-detail">
                    期望 <code>{{ fmt(c.expected) }}</code>，实际 <code class="wrong">{{ fmt(c.actual) }}</code>
                  </span>
                </div>
              </div>
            </template>
            <div v-if="submitReport.stdout" class="sv-stdout">
              <div class="sv-stdout-title">print / System.out 输出</div>
              <pre>{{ submitReport.stdout }}</pre>
            </div>
          </template>

          <!-- 空态提示 -->
          <div v-else class="sv-console-empty">
            <p>▶ <b>运行</b>：编辑代码后点击「运行」，观察每个示例用例的实际输出。</p>
            <p>📤 <b>提交</b>：点击「提交」，自动判断代码是否正确{{ hiddenTestcases.length ? '（含隐藏用例）' : '' }}。</p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="solver-missing">题目不存在：{{ slug }}</div>
</template>

<style scoped>
.solver {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.solver.dragging {
  cursor: col-resize;
  user-select: none;
}

/* ---------------- 顶栏 ---------------- */

.sv-topbar {
  flex: 0 0 52px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.sv-back {
  flex: none;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  white-space: nowrap;
}

.sv-back:hover {
  color: var(--vp-c-brand-1);
}

.sv-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.sv-title-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sv-diff {
  flex: none;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.sv-diff.easy {
  color: var(--vp-c-green-1);
  background: color-mix(in srgb, var(--vp-c-green-1) 12%, transparent);
}

.sv-diff.medium {
  color: var(--vp-c-orange-1, #d97706);
  background: color-mix(in srgb, var(--vp-c-orange-1, #d97706) 12%, transparent);
}

.sv-diff.hard {
  color: var(--vp-c-red-1);
  background: color-mix(in srgb, var(--vp-c-red-1) 12%, transparent);
}

.sv-nav {
  flex: none;
  display: flex;
  gap: 6px;
  white-space: nowrap;
}

.sv-nav-link {
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  cursor: pointer;
}

.sv-nav-link:hover:not(.disabled) {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.sv-nav-link.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sv-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sv-tabs {
  display: flex;
  gap: 4px;
}

.sv-tab {
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.sv-tab:hover {
  color: var(--vp-c-text-1);
}

.sv-tab.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.sv-tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sv-btn {
  padding: 5px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.sv-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sv-btn-ghost {
  background: transparent;
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.sv-btn-ghost:hover:not(:disabled) {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.sv-btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.sv-btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

/* ---------------- 主体 ---------------- */

.sv-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sv-left {
  min-width: 0;
  overflow-y: auto;
  background: var(--vp-c-bg);
}

.sv-desc {
  padding: 20px 24px;
  line-height: 1.75;
}

.sv-desc :deep(p) {
  margin: 0 0 1em;
}

.sv-desc :deep(pre) {
  margin: 0 0 1em;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.sv-desc :deep(code) {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
}

.sv-desc :deep(pre code) {
  padding: 0;
  background: transparent;
}

.sv-desc :deep(ul),
.sv-desc :deep(ol) {
  padding-left: 1.4em;
  margin: 0 0 1em;
}

.sv-desc :deep(li) {
  margin-bottom: 0.3em;
}

.sv-desc :deep(strong) {
  font-weight: 600;
}

.sv-desc :deep(blockquote) {
  margin: 0 0 1em;
  padding: 4px 14px;
  border-left: 3px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.sv-splitter {
  flex: 0 0 6px;
  cursor: col-resize;
  background: var(--vp-c-divider);
  transition: background 0.15s;
}

.sv-splitter:hover,
.solver.dragging .sv-splitter {
  background: var(--vp-c-brand-1);
}

.sv-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
}

.sv-editor {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.sv-editor :deep(.cm-editor) {
  height: 100%;
  outline: none;
}

.sv-editor :deep(.cm-scroller) {
  overflow: auto;
}

.sv-console-splitter {
  flex: 0 0 4px;
  cursor: row-resize;
  background: var(--vp-c-divider);
  transition: background 0.15s;
}

.sv-console-splitter:hover,
.solver.dragging .sv-console-splitter {
  background: var(--vp-c-brand-1);
}

.sv-console {
  overflow-y: auto;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

/* ---------------- 控制台 ---------------- */

.sv-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.sv-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: sv-spin 0.8s linear infinite;
}

@keyframes sv-spin {
  to {
    transform: rotate(360deg);
  }
}

.sv-console-empty {
  padding: 14px 16px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.sv-console-empty p {
  margin: 0 0 4px;
}

.sv-error-box {
  margin: 12px 16px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--vp-c-red-1) 40%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--vp-c-red-1) 8%, transparent);
  color: var(--vp-c-red-2);
  font-size: 13px;
  white-space: pre-wrap;
}

.sv-verdict {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 16px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13.5px;
}

.sv-verdict.pass {
  background: color-mix(in srgb, var(--vp-c-green-1) 10%, transparent);
  color: var(--vp-c-green-2);
}

.sv-verdict.fail {
  background: color-mix(in srgb, var(--vp-c-red-1) 8%, transparent);
  color: var(--vp-c-red-2);
}

.sv-verdict.ce {
  background: color-mix(in srgb, var(--vp-c-red-1) 8%, transparent);
  color: var(--vp-c-red-2);
  white-space: pre-wrap;
}

.sv-verdict-badge {
  flex: none;
  padding: 2px 12px;
  border-radius: 999px;
  font-weight: 700;
  background: var(--vp-c-bg);
}

.sv-verdict-text {
  min-width: 0;
}

.sv-cases {
  margin: 0 16px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.sv-case {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  font-size: 12.5px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sv-case:last-child {
  border-bottom: none;
}

.sv-case-icon {
  font-weight: 700;
}

.sv-case.ok .sv-case-icon {
  color: var(--vp-c-green-1);
}

.sv-case.fail {
  background: color-mix(in srgb, var(--vp-c-red-1) 5%, transparent);
}

.sv-case.fail .sv-case-icon {
  color: var(--vp-c-red-1);
}

.sv-case-name {
  color: var(--vp-c-text-2);
  min-width: 52px;
}

.sv-case-detail code,
.sv-case-error {
  color: var(--vp-c-text-1);
}

.sv-case-detail code.wrong {
  color: var(--vp-c-red-1);
  font-weight: 600;
}

.sv-stdout {
  margin: 0 16px 12px;
}

.sv-stdout-title {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 4px;
}

.sv-stdout pre {
  margin: 0;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}

.solver-missing {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--vp-c-text-2);
}
</style>
