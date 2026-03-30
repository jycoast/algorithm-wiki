# Algorithm Wiki

[中文版](#中文版) | [English](#english)

An open algorithm documentation site built with `VitePress`, focused on organizing high-frequency interview problems, reusable templates, and topic-based notes into a maintainable knowledge base.

- Website: [https://algorithm-wiki.pages.dev](https://algorithm-wiki.pages.dev)
- Source: [https://github.com/jycoast/algorithm-wiki](https://github.com/jycoast/algorithm-wiki)

## 中文版

### Overview

`Algorithm Wiki` 是一个基于 `VitePress` 构建的开源算法文档站，围绕 [CodeTop](https://codetop.cc/) 高频题目、常用算法模板和专题总结持续整理内容。

它的目标不是简单堆积题解，而是把刷题经验沉淀成结构化、可检索、可复用的知识文档，方便日常学习、面试准备和长期维护。

### Features

- 以高频算法题为核心的题解文档
- 同一道题的多解法整理与思路对比
- 常见变种题与扩展讨论
- 二分、回溯、动态规划、滑动窗口等模板沉淀
- 按主题分类的内容组织，便于系统复习
- 基于 `VitePress` 的静态文档站，适合持续迭代与在线浏览

### Quick Start

安装依赖：

```bash
npm install
```

启动本地开发环境：

```bash
npm run docs:dev
```

构建静态站点：

```bash
npm run docs:build
```

本地预览构建产物：

```bash
npm run docs:preview
```

### Tech Stack

- `VitePress` for documentation site generation
- `markdown-it` and `markdown-it-mathjax3` for Markdown and math rendering
- Local search and custom theme configuration through `.vitepress`

### Project Structure

```text
.
|-- .vitepress/      # 文档站配置、导航、侧边栏与主题定制
|-- leetcode/        # 题解内容
|-- template/        # 常用算法模板
|-- source-code/     # 部分语言实现示例
|-- index.md         # 文档首页
|-- README.md
```

### Content Scope

当前仓库主要包含：

- 高频题题解文档
- 按专题归类的问题索引
- 常用算法模板

### Contributing

欢迎通过以下方式参与改进这个文档站：

- 提交 Issue 反馈错别字、失效链接、内容错误或遗漏
- 提交 Pull Request 增补题解、模板或专题总结
- 优化文档结构、导航、命名和可读性

如果你准备贡献内容，建议优先保持以下风格一致：

- 标题命名清晰、可检索
- 题解结构尽量固定，突出思路、复杂度和关键实现

### Recommended Resources

- Hello 算法：[https://www.hello-algo.com/](https://www.hello-algo.com/)
- 代码随想录：[https://programmercarl.com/](https://programmercarl.com/)
- 排序算法可视化：[https://sort.hust.cc/](https://sort.hust.cc/)
- LeetCode Wiki：[https://doocs.github.io/leetcode/](https://doocs.github.io/leetcode/)

## English

### Overview

`Algorithm Wiki` is an open-source algorithm documentation site built with `VitePress`. It organizes high-frequency interview problems from [CodeTop](https://codetop.cc/), reusable algorithm templates, and topic-based notes into a maintainable knowledge base.

The goal is not just to collect solutions, but to turn problem-solving experience into structured, searchable, and reusable documentation.

### Features

- Solution notes for high-frequency algorithm problems
- Multiple approaches and trade-off discussions for the same problem
- Follow-up variants and extended problem discussions
- Reusable templates for binary search, backtracking, dynamic programming, sliding window, and more
- Topic-based organization for systematic review
- A static documentation site powered by `VitePress`, designed for continuous maintenance

### Quick Start

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run docs:dev
```

Build the static site:

```bash
npm run docs:build
```

Preview the production build locally:

```bash
npm run docs:preview
```

### Tech Stack

- `VitePress` for site generation
- `markdown-it` and `markdown-it-mathjax3` for Markdown and math rendering
- Local search and custom theme configuration under `.vitepress`

### Project Structure

```text
.
|-- .vitepress/      # Site config, navigation, sidebar, and theme customizations
|-- leetcode/        # Problem solution documents
|-- template/        # Reusable algorithm templates
|-- source-code/     # Example implementations in some languages
|-- index.md         # Documentation homepage
|-- README.md
```

### Content Scope

The repository currently includes:

- Problem write-ups for high-frequency questions
- Topic-based problem indexes
- Reusable algorithm templates
- A small set of example source code directories

### Contributing

Contributions are welcome. You can help by:

- Opening issues for typos, broken links, incorrect explanations, or missing content
- Submitting pull requests with new solutions, templates, or topic summaries
- Improving information architecture, navigation, naming, and readability

To keep the documentation consistent, contributors are encouraged to:

- Use clear and searchable titles
- Keep a stable structure for solution write-ups
- Emphasize problem-solving ideas, complexity analysis, and reusability

### Recommended Resources

- Hello Algo: [https://www.hello-algo.com/](https://www.hello-algo.com/)
- Programmercarl: [https://programmercarl.com/](https://programmercarl.com/)
- Sorting Visualization: [https://sort.hust.cc/](https://sort.hust.cc/)
- LeetCode Wiki: [https://doocs.github.io/leetcode/](https://doocs.github.io/leetcode/)