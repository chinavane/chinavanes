# 05.移动端类 UI 框架 Vant3

## 1)Vant3的完整引入应用

BalmUI 是以前台展示型的 vue 项目为操作目标，Element-plus则以中后台管理系统为操作目标，那么针对于移动界面的应用我们通常选择什么UI框架呢？Vant3应该是一个不错的选择。

现在利用终端在创建一个名为“vue3-book-vant3”的新的 vue 项目以后就可以考虑第一步查看 Vant3 的官方网站文档，在快速上手中就包含了框架的安装与配置相关步骤，同样只需要根据引导一步一步操作即可。

```bash
npm create vite@latest vue3-book-vant3 -- --template vue
```

现在只需要在项目中进行 UI 框架的安装就可以完成框架的准备工作。

```bash
npm install vant --save
```

安装完 UI 框架以后需要在入口文件 main.js 中进行 vant 的完整引入与使用操作：

```js
import { createApp } from 'vue';
import App from './App.vue';
// 完整引入vant框架
import Vant from 'vant';
// 完整引入vant的样式文件
import 'vant/lib/index.css';
const app = createApp(App);
// 完整使用vant框架
app.use(Vant);
app.mount('#app');
```

然后将 App.vue 中的所有代码进行删除，也可以将 components 下的 HelloWorld.vue 组件删除，在 App.vue 中也可以使用最简单的按钮组件进行项目的测试，会发现页面中能够成功显示一个 Vant 的按钮组件，这一过程同样快速又简便。

App.vue

```vue
<template>
  <van-button type="primary">主要按钮</van-button>
</template>
```

![image-20220512124654562](http://qn.chinavanes.com/qiniu_picGo/image-20220512124654562.png)

现在可以对项目进行产品化打包处理，查看一下完整引入 vant 框架以后项目的整体体积到底是多大。

```bash
npm run build
```

在查看生成的 dist 目录以后可以确认最终生成的产品化目录体积有 432K 左右，但当前我们仍旧只使用了一个按钮组件而已，所以还需要考虑一下是否和 BalmUI以及Element-plus 一样能够实现按需引入的功能。

![image-20220512160105400](http://qn.chinavanes.com/qiniu_picGo/image-20220512160105400.png)

## 2)Vant3 的按需引入操作

Vant 的按需引入需要进行简单的模块安装与环境配置，随后在入口文件中则需要指定使用的模块与使用指定的模块操作。

首先你需要安装`vite-plugin-style-import`这款插件：

```bash
npm i vite-plugin-style-import@1.4.1 --save-dev
```

然后只需要修改 vite.config.js 配置文件，将模块进行引入，并且调用对应插件即可。

vie.config.js

```js {3-6,13-19}
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// vant按需引入辅助插件的引入
import styleImport, { VantResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vant按需引入辅助插件的应用
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
});

```

接下来将入口文件中原来完整引入 Vant 的配置代码全部去除，需要从vant中按需求引入当前项目中使用的组件内容，并且去使用指定的组件内容。

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
// 按需引入指定模块
import { Button } from 'vant';
const app = createApp(App);
// 按需使用指定模块
app.use(Button);
app.mount('#app');
```

现在运行项目页面中的按钮仍旧起效果，然后再在终端运行`npm run build`打包项目并查看最终 dist 目录所占空间容量会发现只有 125K，显然按需加载已经成功起效。

![image-20220512154519442](http://qn.chinavanes.com/qiniu_picGo/image-20220512154519442.png)

## 3)设计业务需求页面

之前在BalmUI与element-plus这两个UI框架应用的时候都只是设置了Props属性，监听了Events事件，至于Methods方法还没有调用。所以在Vant3移动项目中考虑构建一个Tabs选项卡，不光要给它设置初始的Tabs展示页，还需要确认在Tabs切换时选项卡所在的位置，并且需要点击操作一个与Tabs独立存在的按钮，点击它以后选项卡可以跳转到指定下标的位置。

所以需要在入口文件main.js中引入所需的Button、Tab与Tabs这几个组件并进行使用。

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
// 按需引入指定模块
import { Button,Tab, Tabs } from 'vant';
const app = createApp(App);
// 按需使用指定模块
app.use(Button);
app.use(Tab);
app.use(Tabs);
app.mount('#app');

```

在App.vue中利用ref声明设置选项卡默认选中项数据active，然后设置查找选项卡的ref值tabRef，并且还需要设置选项卡监听回调事件changeTab。在定义的switchTab这个方法中将利用ref对象的查找方法先找到tabRef这个Tabs对象，并且可以调用tabs所拥有的scorllTo这个methods方法。所以我们可以确认属性与事件都是在组件本身上所进行设置与监听操作，而组件所拥有的methods方法则需要通过其它组件来触发，当然触发的前提是其它组件先要找到目标组件的对象为先。

App.vue

```vue
<script setup>
import { ref } from 'vue';
// 设置选项卡默认选中项
const active = ref(1);
// 设置选项卡ref值
const tabRef = ref(null);
// 切换选项卡时的事件回调
const changeTab = (index) => {
  console.log('当前选项卡下标：', index);
};
// 点击按钮对选项卡的方法进行调用
const switchTab = () => {
  tabRef.value.scrollTo(2);
};
</script>
<template>
  <!-- 利用第三方按钮，在找到tabs选项卡以后调用其方法 -->
  <van-button type="primary" @click="switchTab">切换至第3个标签</van-button>
  <!-- 属性绑定与事件监听 -->
  <van-tabs v-model:active="active" ref="tabRef" @change="changeTab">
    <van-tab title="标签 1">内容 1</van-tab>
    <van-tab title="标签 2">内容 2</van-tab>
    <van-tab title="标签 3">内容 3</van-tab>
    <van-tab title="标签 4">内容 4</van-tab>
  </van-tabs>
</template>
```

所以刷新应用会看到初始的选项卡位置是在下标为1的“标签2”位置，在进行选项卡切换以后可以查看到changeTab回调事件的console打印信息，并在控制台输出其下标内容。然后点击按钮以后选项卡也会直接跳转至下标为2的“标签3”选项卡页面。

![image-20220512161407249](http://qn.chinavanes.com/qiniu_picGo/image-20220512161407249.png)

事件上不管是BalmUI、Element-plus还是Vant3等不同的UI框架，在了解使用了它们以后会发现UI框架的应用步骤基本都如出一辙，最关键的仍旧是之前所提的查看组件文档的能力提升，设置Props属性、监听Events事件、调用Methods方法，这三句话牢记心头，一切轻松解决。
