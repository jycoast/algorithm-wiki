import { defineConfig } from 'vitepress'
import nav from './configs/nav'
import sidebar from './configs/sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Algorithm Wiki',
  description: '',
  lastUpdated: true,
  cleanUrls: true,
  base: '/',
  markdown: {
    math: true
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],

  themeConfig: {
    outlineTitle: '本页目录',
    lastUpdatedText: '上次更新',
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
    }
  }
})
