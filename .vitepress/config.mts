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
    
    // nav
    nav,

    // sidebar
    sidebar,

    // editLink: {
    //   pattern: 'https://github.com/xinlei3166/vitepress-demo/edit/master/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jycoast/algorithm-wiki.git' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present jycoder'
    }
  }
})
