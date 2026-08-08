/**
 * VitePress markdown 插件：给带 testcases 的 /leetcode/ 页面追加 <CodeRunner />。
 *
 * <CodeRunner /> 由 theme/index.ts 全局注册，markdown 输出作为页面模板编译时
 * 按全局组件解析（与 ArrayViz / TreeViz 等一致的机制）。
 *
 * 仅当 frontmatter 含非空 testcases 时注入，避免 77 道未接入题目出现空面板。
 */
import type { PluginSimple } from 'markdown-it'

export const injectRunnerPlugin: PluginSimple = (md) => {
  const originalRender = md.renderer.render
  md.renderer.render = function (tokens, options, env) {
    const html = originalRender.call(this, tokens, options, env)
    const rel = (env?.relativePath as string | undefined) ?? ''
    const testcases = (env?.frontmatter as { testcases?: unknown } | undefined)?.testcases
    if (rel.startsWith('leetcode/') && Array.isArray(testcases) && testcases.length > 0) {
      return html + '\n\n<CodeRunner />\n'
    }
    return html
  }
}
