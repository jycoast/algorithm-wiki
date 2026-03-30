# Algorithm Wiki

<p align="center">
  <a href="https://github.com/jycoast/algorithm-wiki/stargazers">
    <img src="https://img.shields.io/github/stars/jycoast/algorithm-wiki?style=flat-square" alt="stars" />
  </a>
  <a href="https://github.com/jycoast/algorithm-wiki/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/jycoast/algorithm-wiki?style=flat-square" alt="license" />
  </a>
  <a href="https://algorithm-wiki.pages.dev">
    <img src="https://img.shields.io/badge/deploy-pages.dev-blue?style=flat-square" alt="deploy" />
  </a>
</p>

<p align="center">
  基于 <code>VitePress</code> 构建的开源算法知识库，系统整理高频面试题、通用模板与解题笔记，打造结构清晰、可复用、可持续维护的学习体系。
</p>

<p align="center">
  <a href="https://algorithm-wiki.pages.dev"><strong>🌐 在线预览</strong></a>
</p>

---

## Preview

![image-20260330210015826](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20260330210015826.png)

---

[中文版](#中文版) | [English](#english)

---

## 中文版

### Overview

`Algorithm Wiki` 是一个基于 `VitePress` 构建的开源算法文档站，围绕 [CodeTop](https://codetop.cc/) 高频题目、常用算法模板与专题总结进行持续沉淀。

与传统题解仓库不同，本项目更关注**知识结构化**与**长期可维护性**：  
将刷题经验抽象为可复用的解题模式、模板与专题体系，而非零散题解的简单堆积。

适用于日常学习、面试准备以及系统性复习。

### Why this project

市面上有大量算法题解仓库，但大多数存在一些共性问题：

- ❌ 题解零散，缺乏统一结构  
- ❌ 重代码轻思路，难以迁移与复用  
- ❌ 缺少模板抽象，刷题效率低  
- ❌ 内容更新不可持续，难以长期维护  

`Algorithm Wiki` 的目标是解决这些问题：

- ✅ 将题解抽象为可复用的解题模式与算法模板  
- ✅ 以“专题 + 模板 + 题目”的结构组织知识  
- ✅ 强调思路拆解、复杂度分析与通用性  
- ✅ 构建一个可持续迭代的算法知识体系  

相比“题解集合”，它更接近一个**可维护的算法知识库**。

> 与其反复刷题，不如沉淀可复用的解题能力。

### Features

- 高频算法题题解与思路拆解
- 同一问题的多解法对比与复杂度分析
- 常见变种题与延伸问题整理
- 二分、回溯、动态规划、滑动窗口等算法模板沉淀
- 按专题组织内容，支持体系化复习
- 基于 `VitePress` 的静态站点，支持持续迭代与良好阅读体验

### Quick Start

安装依赖：

```bash
npm install
````

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

* `VitePress`：文档站点生成
* `markdown-it` / `markdown-it-mathjax3`：Markdown 与公式渲染
* `.vitepress`：本地搜索与主题定制

### Project Structure

```text
.
|-- .vitepress/      # 站点配置、导航、侧边栏与主题定制
|-- leetcode/        # 题解内容
|-- template/        # 常用算法模板
|-- source-code/     # 示例实现（多语言）
|-- index.md         # 文档首页
|-- README.md
```

### Content Scope

当前仓库主要包含：

* 高频题题解文档
* 按专题归类的问题索引
* 常用算法模板

### Contributing

欢迎通过以下方式参与项目改进：

* 提交 Issue：反馈错别字、失效链接或内容问题
* 提交 PR：补充题解、模板或专题内容
* 优化结构：改进信息架构、导航与可读性

为保持一致性，建议遵循：

* 标题清晰、具备可检索性
* 题解结构统一（思路 / 复杂度 / 关键实现）
* 优先抽象通用解法与模式

### Recommended Resources

* Hello 算法：[https://www.hello-algo.com/](https://www.hello-algo.com/)
* 代码随想录：[https://programmercarl.com/](https://programmercarl.com/)
* 排序算法可视化：[https://sort.hust.cc/](https://sort.hust.cc/)
* LeetCode Wiki：[https://doocs.github.io/leetcode/](https://doocs.github.io/leetcode/)

---

## English

### Overview

`Algorithm Wiki` is an open-source algorithm knowledge base built with `VitePress`. It focuses on organizing high-frequency interview problems from [CodeTop](https://codetop.cc/), reusable templates, and topic-based notes.

Rather than collecting scattered solutions, the project emphasizes **structured knowledge** and **long-term maintainability**—turning problem-solving experience into reusable patterns, templates, and topic systems.

It is designed for daily practice, interview preparation, and systematic review.

### Why this project

Many algorithm repositories exist, but most of them share common issues:

* ❌ Scattered solutions with inconsistent structure
* ❌ Code-heavy, idea-light — hard to generalize and reuse
* ❌ Lack of reusable templates and abstractions
* ❌ Poor maintainability over time

`Algorithm Wiki` aims to address these problems by:

* ✅ Abstracting solutions into reusable patterns and templates
* ✅ Organizing knowledge by topics, templates, and problems
* ✅ Emphasizing problem-solving ideas, complexity, and reusability
* ✅ Building a maintainable and continuously evolving knowledge base

It is designed not just as a collection of solutions, but as a **structured algorithm knowledge system**.

> Focus on reusable problem-solving patterns, not just solving more problems.

### Features

* Solution write-ups for high-frequency problems
* Multiple approaches with trade-off and complexity analysis
* Follow-up variants and extended discussions
* Reusable templates for binary search, backtracking, dynamic programming, sliding window, etc.
* Topic-based organization for structured learning
* Static documentation site powered by `VitePress`, optimized for continuous updates

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

* `VitePress` for site generation
* `markdown-it` / `markdown-it-mathjax3` for Markdown and math rendering
* Local search and theme customization via `.vitepress`

### Project Structure

```text
.
|-- .vitepress/      # Site config, navigation, sidebar, and theme
|-- leetcode/        # Problem solutions
|-- template/        # Reusable algorithm templates
|-- source-code/     # Example implementations
|-- index.md         # Homepage
|-- README.md
```

### Content Scope

The repository includes:

* High-frequency problem write-ups
* Topic-based indexes
* Reusable templates
* Selected source code examples

### Contributing

Contributions are welcome:

* Open issues for bugs, typos, or missing content
* Submit PRs with new solutions, templates, or topic summaries
* Improve structure, naming, and readability

Guidelines:

* Use clear and searchable titles
* Keep a consistent write-up structure
* Focus on ideas, complexity, and reusability

### Recommended Resources

* Hello Algo: [https://www.hello-algo.com/](https://www.hello-algo.com/)
* Programmercarl: [https://programmercarl.com/](https://programmercarl.com/)
* Sorting Visualization: [https://sort.hust.cc/](https://sort.hust.cc/)
* LeetCode Wiki: [https://doocs.github.io/leetcode/](https://doocs.github.io/leetcode/)
