# 04.中后台类 UI 框架 element-plus

## 1)Element-plus 的完整引入应用

BalmUI 是以前台展示型的 vue 项目为操作目标，所以它对于多端适配性处理的比较完善，但 vue 的很多项目主要是以 PC 操作为主要手段的后台管理的系统支持平台，那么利用 BalmUI 可能并不是非常良好的选择。因为 BalmUI 中包括表单验证等操作的功能还是比较薄弱的，这时候类似 Antv、Element-plus 这样的中后台类型为主的 UI 框架就有了用武之地。其实 Antv 与 Element-plus 的功能相差并不是很多，但 Element-plus 中像虚拟化表格、虚拟化选择器、无限滚动等辅助组件的增设让选择 Element-plus 这一 UI 框架的用户群体不断激增，所以我们可以一起再来看一下 Element-plus 这一 UI 框架的应用实例。

现在利用终端在创建一个名为“vue3-book-element-plus”的新的 vue 项目以后就可以考虑第一步查看 Element-plus 的官方网站文档，在快速入门中就包含了框架的安装与配置相关步骤，同样只需要根据引导一步一步操作即可。

```bash
npm create vite@latest vue3-book-element-plus -- --template vue
```

现在只需要在项目中进行 UI 框架的安装就可以完成框架的准备工作。

```bash
npm install element-plus --save
```

安装完 UI 框架以后需要在入口文件 main.js 中进行 element-plus 的完整引入与使用操作：

```js
import { createApp } from 'vue';
import App from './App.vue';
// 完整引入element-plus框架
import ElementPlus from 'element-plus';
// 完整引入element-plus的样式文件
import 'element-plus/dist/index.css';
const app = createApp(App);
// 完整使用element-plus框架
app.use(ElementPlus);
app.mount('#app');
```

然后将 App.vue 中的所有代码进行删除，也可以将 components 下的 HelloWorld.vue 组件删除，在 App.vue 中也可以使用最简单的按钮组件进行项目的测试，会发现页面中能够成功显示一个 element-plus 的按钮组件，这一过程同样快速又简便。

App.vue

```vue
<template>
  <el-button>Default</el-button>
</template>
```

![image-20220512124654562](http://qn.chinavanes.com/qiniu_picGo/image-20220512124654562.png)

现在可以对项目进行产品化打包处理，查看一下完整引入 element-plus 框架以后项目的整体体积到底是多大。

```bash
npm run build
```

在查看生成的 dist 目录以后可以确认最终生成的产品化目录体积有 1.2M 左右，但当前我们仍旧只使用了一个按钮组件而已，所以还需要考虑一下是否和 BalmUI 一样能够实现按需引入的功能。

![image-20220512124410374](http://qn.chinavanes.com/qiniu_picGo/image-20220512124410374.png)

## 2)Element-plus 的按需引入操作

Element-plus 的按需引入只需要进行简单的模块安装与环境配置即可，代码方面将会由所安装的插件自动完成解析完成。

首先你需要安装`unplugin-vue-components` 和 `unplugin-auto-import`这两款插件：

```bash
npm install unplugin-vue-components unplugin-auto-import --save-dev
```

然后只需要修改 vite.config.js 配置文件，将模块进行引入，并且调用对应插件即可，顺便我们还将原来操作过的别名设置也加入到了当前项目。

vie.config.js

```js {3-6,13-19}
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// element-plus按需引入辅助插件的引入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // element-plus按需引入辅助插件的应用
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
```

接下来将入口文件中原来完整引入 Element-plus 的配置代码全部去除，将入口文件代码恢复到最初项目的代码结构，不需要引入 element-plus 也不需要利用 vue.use 使用对应的插件。

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
```

现在运行项目页面中的按钮仍旧起效果，然后再在终端运行`npm run build`打包项目并查看最终 dist 目录所占空间容量会发现只有 109K，显然按需加载已经成功起效。

![image-20220512145726334](http://qn.chinavanes.com/qiniu_picGo/image-20220512145726334.png)

## 3)设计业务需求页面

我想绝大多数中后台管理系统的界面都会包含菜单、导航、列表等常用展示元素吧，那么利用 element-plus 是否能够非常快速的实现这样的功能需求呢？我想三分钟或许可以搞定。

因为类似的布局的菜单部分可能会使用到 icon 图标的内容，这样才能让界面更加的美观，所以需要先安装 element-plus 框架中的图标模块，所以需要在终端执行命令：

```bash
npm install @element-plus/icons-vue --save
```

然后我们可以打开 element-plus 官方文档，在组件应用中找到 Container 布局容器，里面就有对应的布局示例，只需要将代码进行复制粘贴，直接将 App.vue 代码进行替换即可，不需要做任何改变。

![image-20220512150335429](http://qn.chinavanes.com/qiniu_picGo/image-20220512150335429.png)

应用显示的结果与示例展示的效果完全一致，是否已经节省了项目一大把的界面布局时间呢？

![image-20220512150600174](http://qn.chinavanes.com/qiniu_picGo/image-20220512150600174.png)

不过因为 element-plus 主要是适应于 PC 浏览器端方向是中后台的 UI 框架，所以如果将当前的应用切换至移动端，界面显示就并不一定会如预期那么的完美了。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512150722602.png" alt="image-20220512150722602" style="zoom:33%;" />

同样的，对于element-plus框架的快速应用也只需要确认之前所提的Props属性、Events事件、Methods方法三大方面即可。
