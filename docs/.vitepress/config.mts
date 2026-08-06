import { defineConfig } from 'vitepress'
import nav from './configs/nav.mjs'
import sidebar from './configs/sidebar.mjs'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Algorithm Wiki',
  description: '',
  lastUpdated: true,
  cleanUrls: true,
  base: '/',
  markdown: {
    math: true,
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  vite:{
    plugins: [groupIconVitePlugin({
      customIcon: {
        'java': 'vscode-icons:file-type-java',
        'c++': 'vscode-icons:file-type-cpp',
        'python': 'vscode-icons:file-type-python',
        'typescript': 'vscode-icons:file-type-typescript',
        }
      }
    )],
  },

  themeConfig: {
    // 本页目录标题(VitePress 2.0 中 outlineTitle 改为 outline.label)
    outline: {
      label: '本页目录'
    },
    // 上次更新文案(VitePress 2.0 中 lastUpdatedText 改为 lastUpdated.text)
    lastUpdated: {
      text: '上次更新'
    },
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },

    // 导航栏
    nav,

    // 侧边栏
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jycoast/algorithm-wiki.git' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present jiyongchao'
    },

  }
})
