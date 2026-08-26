/**
 * VitePress markdown 插件：给带 testcases 的 /leetcode/ 页面前置 <SolveEntry />（刷题入口）。
 *
 * 组件由 theme/index.ts 全局注册，markdown 输出作为页面模板编译时按全局组件解析
 * （与 ArrayViz / TreeViz 等一致的机制）。
 *
 * 仅当 frontmatter 含非空 testcases 时注入，避免未接入题目出现空面板。
 */
import type { PluginSimple } from 'markdown-it'

/** 幂等标记：防止同一 markdown-it 实例被重复 md.use() 而双重包裹 renderer */
const APPLIED = Symbol('injectRunnerPlugin.applied')

export const injectRunnerPlugin: PluginSimple = (md) => {
  // 某些构建环境（如托管平台的构建流程）会对同一 md 实例多次应用 markdown.config，
  // 重复 md.use() 会让 renderer 被包裹两次 → <SolveEntry /> 被前置两次。
  // 用 Symbol 做标记，已在则直接返回，保证幂等。
  if ((md as unknown as Record<PropertyKey, unknown>)[APPLIED]) return
  Object.defineProperty(md, APPLIED, { value: true, enumerable: false, configurable: true })

  const originalRender = md.renderer.render
  md.renderer.render = function (tokens, options, env) {
    const html = originalRender.call(this, tokens, options, env)
    const rel = (env?.relativePath as string | undefined) ?? ''
    const testcases = (env?.frontmatter as { testcases?: unknown } | undefined)?.testcases
    if (rel.startsWith('leetcode/') && Array.isArray(testcases) && testcases.length > 0) {
      return '<SolveEntry />\n\n' + html
    }
    return html
  }
}
