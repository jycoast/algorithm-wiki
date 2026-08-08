/**
 * Giscus 评论配置
 *
 * 接入前需要完成以下步骤（一次性）：
 *   1. 在 GitHub 仓库 settings 里开启 Discussions（需登录 jycoast/algorithm-wiki）
 *   2. 打开 https://giscus.app ，填入仓库名，按提示生成配置，得到 repo-id / category-id
 *   3. 把生成的 repo-id、category-id 填入下方
 *
 * 配置完成后，每个题解页底部会显示评论区。
 */
export const GISCUS_CONFIG = {
  /** 仓库（owner/name），保持与你的仓库一致 */
  repo: 'jycoast/algorithm-wiki',
  /** 仓库 Node ID，格式 R_kgDO...，在 giscus.app 配置页获取 */
  repoId: 'R_kgDOMhUBgg',
  /** Discussion 分类名（需先在仓库 Discussions 中创建，如 General） */
  category: 'General',
  /** 分类 ID，格式 DIC_kwDO...，在 giscus.app 配置页获取 */
  categoryId: 'DIC_kwDOMhUBgs4DC6Lp',
  /** 页面与讨论的映射方式：按 URL path 映射 */
  mapping: 'pathname',
  /** 语言 */
  lang: 'zh-CN',
}
