/**
 * Pyodide（CPython → WASM）懒加载单例。
 * 首次判题才从 CDN 拉取（约 10MB，之后浏览器缓存），会话内复用同一个实例。
 */

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

/** 只依赖我们用到的 Pyodide 接口，避免把整个 pyodide 包装进依赖 */
export interface PyodideLike {
  runPythonAsync(code: string): Promise<unknown>
  globals: {
    set(key: string, value: unknown): void
    get(key: string): unknown
  }
  setStdout(opts: { batched: (line: string) => void }): void
}

let instancePromise: Promise<PyodideLike> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`加载脚本失败：${src}`))
    document.head.appendChild(s)
  })
}

export function getPyodide(): Promise<PyodideLike> {
  if (!instancePromise) {
    instancePromise = (async () => {
      await loadScript(`${PYODIDE_CDN}pyodide.js`)
      const pyodide = await (window as unknown as {
        loadPyodide: (opts: { indexURL: string }) => Promise<PyodideLike>
      }).loadPyodide({ indexURL: PYODIDE_CDN })
      return pyodide
    })()
  }
  return instancePromise
}
