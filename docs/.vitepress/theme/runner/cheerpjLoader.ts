/**
 * CheerpJ 3（WASM JVM + OpenJDK）懒加载单例。
 * 首次 Java 判题才从 CDN 拉取（约 10-20MB，之后浏览器缓存），会话内复用同一实例。
 *
 * 参考实现：SimpleJavaRunner（https://github.com/jpkaiser2/SimpleJavaRunner）
 * 依赖说明：cheerpjRunMain 支持在 classPath 中放 .java 源文件路径并自动编译；
 *           本 harness 采用与参考实现一致的显式 javac 调用方式（更可控、可捕获错误）。
 */

const CHEERPJ_CDN = 'https://cjrtnc.leaningtech.com/3.2/loader.js'

/** 只依赖我们用到的 CheerpJ 全局 API */
export interface CheerpJLike {
  cheerpOSAddStringFile(path: string, content: string | Uint8Array): void
  cheerpjRunMain(className: string, classPath: string, ...args: string[]): Promise<number>
  cjFileBlob(path: string): Promise<Blob>
}

let instancePromise: Promise<CheerpJLike> | null = null

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

export function getCheerpJ(): Promise<CheerpJLike> {
  if (!instancePromise) {
    instancePromise = (async () => {
      await loadScript(CHEERPJ_CDN)
      const w = window as unknown as Record<string, unknown>
      const init = w.cheerpjInit as ((opts?: { status?: string }) => Promise<unknown>) | undefined
      if (typeof init !== 'function') {
        throw new Error('CheerpJ 未正确加载')
      }
      await init({ status: 'none' })
      // 3.2 起为 cheerpOSAddStringFile；兼容旧名 cheerpjAddStringFile
      const addFile = (w.cheerpOSAddStringFile ?? w.cheerpjAddStringFile) as
        | CheerpJLike['cheerpOSAddStringFile']
        | undefined
      const runMain = w.cheerpjRunMain as CheerpJLike['cheerpjRunMain'] | undefined
      const fileBlob = w.cjFileBlob as CheerpJLike['cjFileBlob'] | undefined
      if (typeof addFile !== 'function' || typeof runMain !== 'function' || typeof fileBlob !== 'function') {
        throw new Error('CheerpJ API 不完整')
      }
      return { cheerpOSAddStringFile: addFile, cheerpjRunMain: runMain, cjFileBlob: fileBlob }
    })()
  }
  return instancePromise
}
