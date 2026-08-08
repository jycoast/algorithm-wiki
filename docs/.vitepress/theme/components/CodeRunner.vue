<script setup lang="ts">
/**
 * 在线运行 + 自动判题面板（LeetCode 风格，纯前端）。
 *
 * - 由 markdown 插件 inject-runner 自动追加到有 testcases 的 /leetcode/ 页面
 * - 语言 tab：Python（Pyodide）/ Java（CheerpJ，即将上线）
 * - 编辑器预填题库自带解法（problems-data.ts 构建时从代码块提取）
 * - 运行 → WASM 懒加载判题 → 逐用例 ✓/✗ + 期望/实际 + print 输出
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { problemsData } from '../runner/problems-data'
import { runPython } from '../runner/pythonHarness'
import type { RunLang, RunReport, TestCase } from '../runner/types'

const { page } = useData()

/* ---------------- 页面数据 ---------------- */

const slug = computed(() => {
  const rel = (page.value.relativePath || '').replace(/\.md$/, '')
  return rel.split('/').pop() ?? ''
})

const frontmatter = computed(() => (page.value.frontmatter ?? {}) as Record<string, unknown>)
const entry = computed(() => (frontmatter.value.entry ?? '') as string)
const testcases = computed(() =>
  (Array.isArray(frontmatter.value.testcases) ? frontmatter.value.testcases : []) as TestCase[],
)

const hasData = computed(() => {
  const sol = problemsData[slug.value]
  return !!(entry.value && testcases.value.length > 0 && sol && (sol.python || sol.java))
})

/* ---------------- 语言与代码缓冲 ---------------- */

const lang = ref<RunLang>('python')
const pythonCode = ref('')
const javaCode = ref('')
const currentCode = computed(() => (lang.value === 'python' ? pythonCode.value : javaCode.value))

const STUB_PYTHON = '# 在此编写你的解法…\n'
const STUB_JAVA = '// 在此编写你的解法…\n'

function seedIfEmpty() {
  if (lang.value === 'python' && !pythonCode.value) {
    pythonCode.value = problemsData[slug.value]?.python ?? STUB_PYTHON
  }
  if (lang.value === 'java' && !javaCode.value) {
    javaCode.value = problemsData[slug.value]?.java ?? STUB_JAVA
  }
}

function switchLang(l: RunLang) {
  if (lang.value === l || running.value) return
  lang.value = l
  report.value = null
  seedIfEmpty()
}

/* ---------------- CodeMirror ---------------- */

const editorEl = ref<HTMLDivElement | null>(null)
let view: EditorView | null = null

// 跟随站点深浅色主题（用 VitePress 变量，无需额外暗色主题包）
const runnerTheme = EditorView.theme({
  '&': {
    fontSize: '13.5px',
    height: 'auto',
    color: 'var(--vp-c-text-1)',
    backgroundColor: 'transparent',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'var(--vp-c-text-3)',
    borderRight: '1px solid var(--vp-c-divider)',
  },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: 'color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent)',
  },
  '.cm-cursor': { borderLeftColor: 'var(--vp-c-brand-1)' },
  '.cm-matchingBracket': { color: 'var(--vp-c-brand-1)', fontWeight: 'bold' },
})

function initEditor() {
  const el = editorEl.value
  if (!el) return
  view?.destroy()
  view = new EditorView({
    state: EditorState.create({
      doc: currentCode.value,
      extensions: [
        basicSetup,
        lang.value === 'python' ? python() : java(),
        keymap.of([indentWithTab]),
        EditorView.lineWrapping,
        runnerTheme,
        EditorView.updateListener.of((u) => {
          if (!u.docChanged) return
          const text = u.state.doc.toString()
          if (lang.value === 'python') pythonCode.value = text
          else javaCode.value = text
        }),
      ],
    }),
    parent: el,
  })
}

watch(
  [lang, hasData],
  async () => {
    if (!hasData.value) return
    seedIfEmpty()
    await nextTick()
    initEditor()
  },
  { immediate: true },
)

onBeforeUnmount(() => view?.destroy())

/* ---------------- 运行与结果 ---------------- */

const running = ref(false)
const loading = ref(false)
const loadingText = ref('')
const report = ref<RunReport | null>(null)

function fmt(v: unknown): string {
  if (v === undefined) return 'undefined'
  return JSON.stringify(v)
}

async function run() {
  if (running.value || !hasData.value) return
  running.value = true
  loading.value = true
  report.value = null
  loadingText.value = lang.value === 'python'
    ? '正在加载 Python 运行时（首次约 10MB，请稍候）…'
    : '正在加载 Java 运行时（首次约 20MB，请稍候）…'
  try {
    if (lang.value === 'python') {
      report.value = await runPython(currentCode.value, entry.value, testcases.value)
    } else {
      // Java（CheerpJ）在后续阶段接入
      report.value = {
        results: [],
        passed: 0,
        total: testcases.value.length,
        compileError: 'Java 判题正在接入中，敬请期待 🚧（Python 已可用）',
      }
    }
  } finally {
    running.value = false
    loading.value = false
  }
}

function reset() {
  if (lang.value === 'python') pythonCode.value = problemsData[slug.value]?.python ?? STUB_PYTHON
  else javaCode.value = problemsData[slug.value]?.java ?? STUB_JAVA
  report.value = null
  initEditor()
}
</script>

<template>
  <div v-if="hasData" class="code-runner">
    <div class="cr-header">
      <div class="cr-tabs">
        <button
          class="cr-tab"
          :class="{ active: lang === 'python' }"
          :disabled="running"
          @click="switchLang('python')"
        >
          Python
        </button>
        <button
          class="cr-tab"
          :class="{ active: lang === 'java' }"
          :disabled="running"
          @click="switchLang('java')"
        >
          Java
        </button>
      </div>
      <div class="cr-actions">
        <span class="cr-hint">在线编辑 · 运行 · 自动判题</span>
        <button class="cr-btn cr-btn-ghost" :disabled="running" @click="reset">重置</button>
        <button class="cr-btn cr-btn-primary" :disabled="running" @click="run">
          {{ running ? '运行中…' : '▶ 运行' }}
        </button>
      </div>
    </div>

    <div ref="editorEl" :key="lang" class="cr-editor"></div>

    <div v-if="loading" class="cr-loading">
      <span class="cr-spinner"></span>
      <span>{{ loadingText }}</span>
    </div>

    <div v-if="report" class="cr-report">
      <template v-if="report.compileError">
        <div class="cr-error">
          <strong>无法运行：</strong>{{ report.compileError }}
        </div>
      </template>
      <template v-else>
        <div class="cr-summary" :class="report.passed === report.total ? 'ok' : 'fail'">
          <span class="cr-pass">{{ report.passed }} / {{ report.total }}</span>
          <span>用例通过</span>
          <span v-if="report.passed === report.total" class="cr-all-pass">🎉 全部通过</span>
        </div>
        <div class="cr-cases">
          <div v-for="c in report.results" :key="c.index" class="cr-case" :class="c.ok ? 'ok' : 'fail'">
            <span class="cr-case-icon">{{ c.ok ? '✓' : '✗' }}</span>
            <span class="cr-case-name">用例 {{ c.index }}</span>
            <span v-if="c.error" class="cr-case-error">运行出错：{{ c.error }}</span>
            <span v-else class="cr-case-detail">
              期望 <code>{{ fmt(c.expected) }}</code>
              <template v-if="!c.ok">，实际 <code class="wrong">{{ fmt(c.actual) }}</code></template>
            </span>
          </div>
        </div>
        <div v-if="report.stdout" class="cr-stdout">
          <div class="cr-stdout-title">print 输出</div>
          <pre>{{ report.stdout }}</pre>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.code-runner {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.cr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  flex-wrap: wrap;
}

.cr-tabs {
  display: flex;
  gap: 4px;
}

.cr-tab {
  padding: 4px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.cr-tab:hover {
  color: var(--vp-c-text-1);
}

.cr-tab.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.cr-tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cr-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cr-hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-right: 4px;
}

.cr-btn {
  padding: 4px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.cr-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cr-btn-ghost {
  background: transparent;
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.cr-btn-ghost:hover:not(:disabled) {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.cr-btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.cr-btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.cr-editor {
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.cr-editor :deep(.cm-editor) {
  outline: none;
}

.cr-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

.cr-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: cr-spin 0.8s linear infinite;
}

@keyframes cr-spin {
  to {
    transform: rotate(360deg);
  }
}

.cr-report {
  padding: 12px 16px;
}

.cr-summary {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.cr-summary.ok {
  color: var(--vp-c-green-2);
}

.cr-summary.fail {
  color: var(--vp-c-red-2);
}

.cr-all-pass {
  font-weight: 400;
  color: var(--vp-c-green-1);
}

.cr-cases {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.cr-case {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.cr-case:last-child {
  border-bottom: none;
}

.cr-case-icon {
  font-weight: 700;
}

.cr-case.ok .cr-case-icon {
  color: var(--vp-c-green-1);
}

.cr-case.fail {
  background: color-mix(in srgb, var(--vp-c-red-1) 5%, transparent);
}

.cr-case.fail .cr-case-icon {
  color: var(--vp-c-red-1);
}

.cr-case-name {
  color: var(--vp-c-text-2);
  min-width: 56px;
}

.cr-case-detail code,
.cr-case-error {
  color: var(--vp-c-text-1);
}

.cr-case-detail code.wrong {
  color: var(--vp-c-red-1);
  font-weight: 600;
}

.cr-error {
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--vp-c-red-1) 40%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--vp-c-red-1) 8%, transparent);
  color: var(--vp-c-red-2);
  font-size: 13px;
  white-space: pre-wrap;
}

.cr-stdout {
  margin-top: 10px;
}

.cr-stdout-title {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 4px;
}

.cr-stdout pre {
  margin: 0;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  font-size: 12.5px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
