import {
  EsLint,
  ExportData,
  Icon,
  Jsdoc,
  Mysql,
  Next14,
  Node,
  React2024,
  Sass,
  Upload,
  Url,
  Vue3,
} from "./sidebar";

import { defineConfig } from "vitepress";

export default defineConfig({
  markdown: {
    lineNumbers: true,
  },
  title: "风向标，互联网开发技术中心",
  description: "风向标技术中心",
  themeConfig: {
    search: {
      provider: "local",
    },
    outline: "deep",
    outlineTitle: "页面导航",
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    footer: {
      message: "Released under the MIT License",
      copyright: "Copyright © 2024-present 子心",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "技术点系列教程",
        items: [
          { text: "URL的组成", link: "/url/" },
          { text: "图标发展史", link: "/icon/" },
          { text: "百万数据处理导入导出", link: "/exportData/" },
          { text: "JsDoc注释文档生成利器", link: "/jsdoc/" },
        ],
      },
      {
        text: "起步教程",
        items: [
          { text: "文件上传起步教程", link: "/upload/" },
          { text: "EsLint起步教程", link: "/eslint/" },
          { text: "Sass起步教程", link: "/sass/" },
          { text: "Mysql起步教程", link: "/mysql/" },
          { text: "NextJs起步教程", link: "/next14/" },
        ],
      },
      {
        text: "全系列教程",
        items: [
          { text: "React2024全系列教程", link: "/react2024/" },
          { text: "NodeJs全系列教程", link: "/nodejs/" },
          { text: "Vue3全系列教程", link: "/vue3/" },
        ],
      },
    ],
    sidebar: {
      "/vue3/": Vue3,
      "/react2024/": React2024,
      "/nodejs/": Node,
      "/mysql/": Mysql,
      "/url/": Url,
      "/icon/": Icon,
      "/exportData/": ExportData,
      "/jsdoc/": Jsdoc,
      "/upload/": Upload,
      "/eslint/": EsLint,
      "/sass/": Sass,
      "/next14/": Next14,
    },
  },
});
