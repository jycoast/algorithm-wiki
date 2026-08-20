/**
 * CodeMirror 编辑器组合式 —— 供 CodeRunner.vue 与 Solver.vue 共用。
 *
 * 职责：
 * - 语言切换（Python/Java）与各自独立的代码缓冲（互不覆盖）
 * - 首次切到某语言时从 problemsData 预填官方解法（缺失用 stub）
 * - 编辑器创建 / 销毁（SSR 安全：组件挂载后再调用 initEditor）
 * - 跟随站点深浅色主题（用 VitePress 变量，无需额外暗色主题包）
 *
 * 注意：组件模板需用 `:key="lang"` 包裹编辑器 div，lang 变化时 DOM 重建，
 * 并在 watch 里重新调用 initEditor(el)。沿用 CodeRunner 既有模式。
 */
import { computed, ref, type Ref } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { autocompletion } from '@codemirror/autocomplete'
import { indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { problemsData } from './problems-data'
import { completionSourcesFor } from './completions'
import type { RunLang } from './types'

export const STUB_PYTHON = '# 在此编写你的解法…\n'
export const STUB_JAVA = '// 在此编写你的解法…\n'

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

export interface UseEditorOptions {
  /** 切换语言是否被禁止（如运行中）。返回 true 时忽略 setLang */
  isLocked?: () => boolean
}

export function useEditor(slug: Ref<string>, options: UseEditorOptions = {}) {
  const lang = ref<RunLang>('python')
  const pythonCode = ref('')
  const javaCode = ref('')
  const currentCode = computed(() => (lang.value === 'python' ? pythonCode.value : javaCode.value))

  let view: EditorView | null = null

  /** 当前语言缓冲为空时预填官方解法 */
  function seedIfEmpty() {
    if (lang.value === 'python' && !pythonCode.value) {
      pythonCode.value = problemsData[slug.value]?.python ?? STUB_PYTHON
    }
    if (lang.value === 'java' && !javaCode.value) {
      javaCode.value = problemsData[slug.value]?.java ?? STUB_JAVA
    }
  }

  /** 切换语言（保留各语言缓冲）。锁定状态下忽略 */
  function setLang(l: RunLang) {
    if (lang.value === l || options.isLocked?.()) return
    lang.value = l
    seedIfEmpty()
  }

  /** 重置当前语言代码为官方解法（不重建编辑器） */
  function reset() {
    if (lang.value === 'python') pythonCode.value = problemsData[slug.value]?.python ?? STUB_PYTHON
    else javaCode.value = problemsData[slug.value]?.java ?? STUB_JAVA
  }

  /** 在容器元素上创建 CodeMirror 实例（先销毁旧的）。SSR 下不应调用 */
  function initEditor(el: HTMLElement, seed = false) {
    if (seed) seedIfEmpty()
    view?.destroy()
    view = new EditorView({
      state: EditorState.create({
        doc: currentCode.value,
        extensions: [
          basicSetup,
          lang.value === 'python' ? python() : java(),
          // 轻量智能提示：片段 + 语言自带补全（覆盖 basicSetup 的默认源）
          autocompletion({ override: completionSourcesFor(lang.value) }),
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

  function destroy() {
    view?.destroy()
    view = null
  }

  return { lang, pythonCode, javaCode, currentCode, seedIfEmpty, setLang, reset, initEditor, destroy }
}
