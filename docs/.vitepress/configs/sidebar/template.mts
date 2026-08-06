import { type DefaultTheme } from "vitepress";
const template: DefaultTheme.SidebarItem = {
  base: "/template/",
  text: "常用模板",
  link: "/index",
  items: [
    { text: "二分查找", link: "index" },
    { text: "二叉树DFS", link: "binary-tree-dfs" },
    { text: "二叉树BFS", link: "binary-tree-bfs" },
    { text: "回溯算法", link: "back-tracking" },
    { text: "分治算法", link: "divide-conquer" },
    { text: "动态规划", link: "dp" },
    { text: "字典树", link: "trie" },
    { text: "单调栈", link: "monotonic-stack" },
    { text: "滑动窗口", link: "sliding-window" },
  ],
};

export default template;
