# Algorithm Wiki

<p align="center">
  <a href="https://github.com/jycoast/algorithm-wiki/stargazers">
    <img src="https://img.shields.io/github/stars/jycoast/algorithm-wiki?style=flat-square" alt="stars" />
  </a>
  <a href="https://algorithm-wiki.pages.dev">
    <img src="https://img.shields.io/badge/deploy-pages.dev-blue?style=flat-square" alt="deploy" />
  </a>
</p>
<p align="center">
  基于 <code>VitePress</code> 构建的开源算法知识库，系统整理算法高频面试题、通用模板与解题笔记。
</p>


<p align="center">
  <a href="https://algorithm-wiki.pages.dev"><strong>🌐 在线预览</strong></a>
</p>

---

## Preview

![image-20260330210015826](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20260330210015826.png)

### Overview

`Algorithm Wiki` 是一个基于 `VitePress` 构建的开源算法文档站，围绕 [CodeTop](https://codetop.cc/) 高频题目、常用算法模板与专题总结进行持续沉淀。

本项目适用于日常学习、面试准备以及系统性复习。

### Why this project

- 仅聚焦热度最高、最常用到的前 **100** 题
- 每一道题目提供多种思路和解法
- 详细的解题步骤和注释
- 支持多种编程语言

### Features

- 高频算法题题解与思路拆解
- 同一问题的多解法对比与复杂度分析
- 常见变种题与延伸问题整理
- 二分、回溯、动态规划、滑动窗口等算法模板沉淀
- 💬 每道题解底部评论区（基于 GitHub Discussions 的 Giscus，无需登录即可评论）
- 基于 `VitePress` 的静态站点，支持持续迭代与良好阅读体验

### Quick Start

Node.js 版本 >=20.19.0 或 >=22.12.0

安装依赖：

```bash
npm install
```

启动本地开发环境：

```bash
npm run dev
```

构建静态站点：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

### Tech Stack

* `VitePress`：文档站点生成
* `markdown-it` / `markdown-it-mathjax3`：Markdown 与公式渲染
* `.vitepress`：本地搜索与主题定制

### Project Structure

```text
.
|-- docs/
|   |-- .vitepress/      # 站点配置、导航、侧边栏与主题定制
|   |-- leetcode/        # 题解内容
|   |-- template/        # 常用算法模板
|   |-- public/          # 静态资源（图标等）
|   |-- index.md         # 文档首页
|-- source-code/         # 示例实现（多语言）
|-- README.md
```


### Contributing

欢迎通过以下方式参与项目改进：

* 提交 Issue：反馈错别字、失效链接或内容问题
* 提交 PR：补充题解、模板或专题内容
* 优化结构：改进信息架构、导航与可读性

为保持一致性，建议遵循：

* 标题清晰、具备可检索性
* 题解结构统一（思路 / 复杂度 / 关键实现）
* 优先抽象通用解法与模式

### 评论区（Giscus）

每道题解底部集成 [Giscus](https://giscus.app/) 评论区（基于 GitHub Discussions），访客无需登录即可评论，评论以讨论串形式沉淀在仓库中。

评论功能默认关闭（未配置 ID 时不渲染），接入需完成一次配置：

1. 在仓库 Settings → Features 中开启 **Discussions**，并新建分类（如 `General`）
2. 打开 [giscus.app](https://giscus.app/)，填入仓库名 `jycoast/algorithm-wiki`，选择分类，复制生成的 **repo-id** 与 **category-id**
3. 填入 `docs/.vitepress/theme/giscus-config.ts` 中的 `repoId` 与 `categoryId`

配置完成后重新部署即可生效。跟随站点的亮/暗主题自动换肤。

### 新增题解（自动维护清单）

侧边栏（Top100）与首页分类表格由 `scripts/gen-lists.mjs` 从题解文件自动生成，无需手改。

新增一道题：

1. 在 `docs/leetcode/` 新建题解 md，frontmatter 需含 `difficulty` 与 `tags`，H1 标题格式为 `# [N. 题目](url)`
2. 将文件名 slug 加入 `scripts/list-data.json` 的 `order`（热度排序位置）与对应分类
3. 运行 `npm run gen` 重新生成 `sidebar.mts` 与 `index.md`

首次使用或需要重建清单数据时运行 `node scripts/gen-lists.mjs --init`（从现有 sidebar/index.md 抽取 order 与分类）。

### Recommended Resources

* Hello 算法：[https://www.hello-algo.com/](https://www.hello-algo.com/)
* 代码随想录：[https://programmercarl.com/](https://programmercarl.com/)
* 排序算法可视化：[https://sort.hust.cc/](https://sort.hust.cc/)
* LeetCode Wiki：[https://doocs.github.io/leetcode/](https://doocs.github.io/leetcode/)


## 友情链接
[LiunxDo](https://linux.do/)
