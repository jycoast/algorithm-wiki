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
  基于 <code>VitePress</code> 构建的开源算法知识库，系统整理算法高频面试题、通用模板与解题笔记，内置<span style="font-weight:bold">可视化演示</span>与<span style="font-weight:bold">在线判题</span>。
</p>


<p align="center">
  <a href="https://algorithm-wiki.pages.dev"><strong>🌐 在线预览</strong></a>
</p>

---

## Preview

![image-20260330210015826](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20260330210015826.png)

算法可视化演示：

![image-20260827235509348](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20260827235509348.png)

在线刷题：

![image-20260827235549821](https://blog-1304855543.cos.ap-guangzhou.myqcloud.com/blog/image-20260827235549821.png)

### Overview

`Algorithm Wiki` 是一个基于 `VitePress` 构建的开源算法文档站，围绕 [CodeTop](https://codetop.cc/) 高频题目、经典算法模板与高频问题总结进行持续沉淀。

除了常规的图文题解，每道题还配备了**逐步可视化动画**与**在线判题**，真正做到「先看懂，再手写」。

本项目适用于日常学习、面试准备以及系统性复习。

### Why this project

- 仅聚焦热度最高且最常用到的前 **100** 题
- 每一道题目提供多种思路和解法
- 详细的解题步骤和注释
- 支持多种编程语言
- 可视化演示 + 在线判题，理论与实践双闭环

### Features

- **算法可视化**：二分、双指针、链表、二叉树、动态规划等核心算法的逐步动画演示，直观理解每一步
- **在线刷题**：编写代码 、点击运行  即刻通过测试用例验证高频算法题题解与思路拆解
- **多种解法**：同一问题的多解法对比与复杂度分析
- **延伸扩展**：常见变种题与延伸问题整理
- **模板沉淀**：二分、回溯、动态规划、滑动窗口等算法模板沉淀

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
* `pyodide` / `cheerpj`：Python / Java 在线判题引擎（WASM，纯浏览器运行）
* `@codemirror`：代码编辑器
* `mermaid`：图渲染，支持用 mermaid 绘制流程图
* `.vitepress`：本地搜索与主题定制

### Project Structure

```text
.
|-- docs/
|   |-- .vitepress/           # 站点配置、导航、侧边栏与主题定制
|   |   |-- config.mts        # 入口配置
|   |   |-- configs/          # 导航 / 侧边栏配置
|   |   |-- plugins/          # markdown 插件（如注入刷题入口 inject-runner.mts）
|   |   |-- theme/            # 主题定制（含可视化 / 刷题 Vue 组件、composables、runner）
|   |       |-- runner/       # 在线判题运行时（Pyodide / CheerpJ / 编辑器 / 判题对比）
|   |-- leetcode/        # 题解内容
|   |-- solve/           # 在线刷题页（由 gen-runner 脚本自动生成，layout: false 全屏 IDE）
|   |-- template/        # 常用算法模板
|   |-- public/          # 静态资源（图标等）
|   |-- index.md         # 落地首页（手写，layout: home）
|   |-- category.md      # 分类刷题页（由 gen 脚本生成）
|   |-- top100.md        # Top100 热度榜页（由 gen 脚本生成）
|-- scripts/             # js-yaml + gen-lists.mjs / gen-runner-data.mjs 生成器
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

### Recommended Resources

* Hello 算法：[https://www.hello-algo.com/](https://www.hello-algo.com/)
* 代码随想录：[https://programmercarl.com/](https://programmercarl.com/)
* 排序算法可视化：[https://sort.hust.cc/](https://sort.hust.cc/)
* LeetCode Wiki：[https://doocs.github.io/leetcode/](https://doocs.github.io/leetcode/)


## 友情链接
[LiunxDo](https://linux.do/)
