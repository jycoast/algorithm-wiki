/**
 * CheerpJ（WASM JVM + OpenJDK）懒加载单例。
 * 首次 Java 判题才从 CDN 拉取（约 10-20MB，之后浏览器缓存），会话内复用同一实例。
 *
 * 参考实现：SimpleJavaRunner（https://github.com/jpkaiser2/SimpleJavaRunner）
 * 依赖说明：cheerpjRunMain 支持在 classPath 中放 .java 源文件路径并自动编译；
 *           本 harness 采用与参考实现一致的显式 javac 调用方式（更可控、可捕获错误）。
 *
 * CDN 版本说明：LeaningTech 以「数字版本号」提供 loader（如 3.2/4.3），版本更替后旧路径
 * 直接返回空响应（HTTP 204），脚本 onload 照常触发但全局 API 缺失，表现为「CheerpJ 未正确加载」。
 * 因此这里使用 latest 别名（当前仍是 3.x 系，提供 cheerpjAddStringFile 文件写入 API；
 * 4.x 引导脚本已移除该 API）。加载前先用 fetch 预检，CDN 再变更时能给出明确报错。
 */

const CHEERPJ_CDN = 'https://cjrtnc.leaningtech.com/latest/loader.js'
const LOAD_TIMEOUT = 60_000

/** 只依赖我们用到的 CheerpJ 全局 API */
export interface CheerpJLike {
  cheerpOSAddStringFile(path: string, content: string | Uint8Array): void
  cheerpjRunMain(className: string, classPath: string, ...args: string[]): Promise<number>
  cjFileBlob(path: string): Promise<Blob>
}

let instancePromise: Promise<CheerpJLike> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    const timer = window.setTimeout(() => {
      s.remove()
      reject(new Error(`加载超时（${LOAD_TIMEOUT / 1000}s）：${src}`))
    }, LOAD_TIMEOUT)
    s.onload = () => {
      clearTimeout(timer)
      resolve()
    }
    s.onerror = () => {
      clearTimeout(timer)
      s.remove()
      reject(new Error(`脚本加载失败（网络错误）：${src}`))
    }
    document.head.appendChild(s)
  })
}

/**
 * CDN 预检：脚本标签对「200 空响应 / 被拦成 HTML」也会触发 onload，导致 API 缺失。
 * 先用 fetch 确认返回的是真正的 JS（CDN 已带 access-control-allow-origin: *）。
 */
async function preflightCdn(): Promise<void> {
  const describe = (msg: string) => `CheerpJ 加载器异常：${msg}：${CHEERPJ_CDN}`
  try {
    const res = await fetch(CHEERPJ_CDN, { method: 'GET' })
    if (res.status === 204 || (res.status >= 400 && !res.ok)) {
      throw new Error(describe(`CDN 返回空响应（HTTP ${res.status}），加载器地址可能已失效，请反馈站点维护者`))
    }
    const type = res.headers.get('content-type') ?? ''
    if (!/javascript/i.test(type)) {
      throw new Error(describe(`CDN 返回了非脚本内容（content-type: ${type || '无'}），可能被网络拦截`))
    }
    // 只校验头信息，不重复下载 111KB 的 loader（稍后脚本标签会再拉一次）
    await res.body?.cancel()
  } catch (e) {
    if ((e as Error).message?.startsWith('CheerpJ 加载器异常')) throw e
    // fetch 因网络/CORS 失败时不阻塞，交由脚本标签注入兜底并给出对应错误
  }
}

export function getCheerpJ(): Promise<CheerpJLike> {
  if (!instancePromise) {
    instancePromise = (async () => {
      await preflightCdn()
      await loadScript(CHEERPJ_CDN)
      const w = window as unknown as Record<string, unknown>
      const init = w.cheerpjInit as ((opts?: { status?: string }) => Promise<unknown>) | undefined
      if (typeof init !== 'function') {
        throw new Error(`CheerpJ 加载器异常：脚本已加载但未暴露 cheerpjInit：${CHEERPJ_CDN}`)
      }
      await init({ status: 'none' })
      // 3.x 为 cheerpOSAddStringFile / 旧名 cheerpjAddStringFile（latest 走旧名）
      const addFile = (w.cheerpOSAddStringFile ?? w.cheerpjAddStringFile) as
        | CheerpJLike['cheerpOSAddStringFile']
        | undefined
      const runMain = w.cheerpjRunMain as CheerpJLike['cheerpjRunMain'] | undefined
      const fileBlob = w.cjFileBlob as CheerpJLike['cjFileBlob'] | undefined
      if (typeof addFile !== 'function' || typeof runMain !== 'function' || typeof fileBlob !== 'function') {
        throw new Error('CheerpJ 加载器异常：初始化后缺少判题所需 API，请反馈站点维护者')
      }
      return { cheerpOSAddStringFile: addFile, cheerpjRunMain: runMain, cjFileBlob: fileBlob }
    })()
  }
  return instancePromise
}
