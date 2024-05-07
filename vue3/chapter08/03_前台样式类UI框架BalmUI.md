# 03.前台样式类 UI 框架 BalmUI

## 1)BalmUI的安装配置与初步使用

学习任何一个UI框架最好的方式主要抓住几个步骤：

- 快速入门安装配置UI框架
- 尝试调用最简单的组件进行UI框架环境测试
- 查看组件示例代码，采用复制粘贴方式快速感受UI框架组件效果
- 掌握设置属性、触发事件、调用方法的三大基本文档查看能力
- 利用UI框架尝试自定义界面的布局应用

现在利用终端在创建一个名为“vue3-book-balmui”的新的vue项目以后就可以考虑第一步查看BalmUI的官方网站文档，在快速入门中就包含了框架的安装与配置相关步骤，只需要根据引导一步一步操作即可。

```bash
npm create vite@latest vue3-book-balmui -- --template vue
```

![image-20220512010009444](http://qn.chinavanes.com/qiniu_picGo/image-20220512010009444.png)

第一步，在当前vue项目中先安装balm-ui框架，只需要运行终端命令即可；

```bash
npm install balm-ui --save
```

第二步，需要在入口文件main.js中引入balm-ui整体框架并同时再引入balm-ui整体样式，还需要使用BalmUI整体框架内容；

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
// 引入balm-ui整体框架
import BalmUI from 'balm-ui';
// 引入balm-ui整体样式
import 'balm-ui-css';
const app = createApp(App);
// 使用BalmUI整体框架
app.use(BalmUI);
app.mount('#app');
```

第三步，因为在入口文件中使用了balm-ui-css的别名内容，所以需要在vite.config.js配置文件中添加对应别名指向的路径，其实balm-ui的样式最终指向的是balm-ui/dist/balm-ui.css的样式文件；

vite.config.js

```js {7-14}
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 设置别名
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      'balm-ui-plus': 'balm-ui/dist/balm-ui-plus.esm.js',
      'balm-ui-css': 'balm-ui/dist/balm-ui.css',
    },
  },
});

```

第四步，可以将App.vue中所有代码进行删除，甚至将components下的HelloWorld.vue组件也同样删除，然后查看balm-ui框架最为简单的组件文档，比如button按钮组件，文档中一般除了组件介绍还会有示例演示，如果有属性、事件和方法，也会有对应的详情说明；

App.vue

```vue
<template><ui-button>Text</ui-button></template>
```

现在启动项目刷新页面，则会看到最简单的一个按钮就显示在界面上了，那就已经说明ui框架已经成功安装配置，环境配置无误，组件应用良好了。

![image-20220512080426063](http://qn.chinavanes.com/qiniu_picGo/image-20220512080426063.png)

第五步，可以考虑查看Props属性、Events事件、Methods方法的文档说明，如果组件有对应的功能则可以进行相应的设置。比如可以给button添加unelevated以及raised等属性，也可以给按钮绑定click事件，这是因为按钮的说明文档中就包含了对应的属性以及相关的事件，修改完毕直接查看效果即可；

App.vue

```vue
<template>
  <ui-button unelevated raised @click="btnClick">Icon</ui-button>
</template>

<script setup>
const btnClick = () => {
  alert('这是按钮绑定的回调事件');
};
</script>
```

![image-20220512080544226](http://qn.chinavanes.com/qiniu_picGo/image-20220512080544226.png)

![image-20220512080528355](http://qn.chinavanes.com/qiniu_picGo/image-20220512080528355.png)

## 2)按需引入的实现

在我们进行下一步利用UI框架尝试自定义界面的布局应用之前先将应用的运行中断，然后在终端中输入命令：

```bash
npm run build
```

先将项目进行打包编译操作，最终在项目目录下将生成一个dist目录，查看该目录的资源信息会看到生成的产品化项目的资源占据了2.2MB的空间大小。现在应用程序什么也没操作，仅仅是在界面上放置了一个小小的按钮，产品化以后的项目文件就占用2M多的空间尺寸，这是多么可怕的一件事。产生该问题的原因是什么呢？主要的原因是对于BalmUI框架进行的是整体导入与应用处理，包括它所有组件功能的javascript文件以及所有的css资源，因而最终产品化输出的资源占用非常的高，我想是否需要考虑优化呢？结果一定的是。

如果说只使用了UI框架中的按钮组件，那么是否只需要引入UI框架的按钮功能js与按钮样式css资源，对于其它没有涉及的UI组件都不进行引入与使用，那么整个项目的文件体积就将变得很小，这一思路应该没有丝毫问题。

![image-20220512070931851](http://qn.chinavanes.com/qiniu_picGo/image-20220512070931851.png)



接下来可以在src目录下新建index.scss预编译样式文件，该文件中将引入使用_vendors.scss的样式内容。当然，还是得在该目录下再新建\_vendors.scss预编译样式文件，在此文件中只需要将balmUI的button相关文档中的代码内容进行拷贝即可，因为文档中对于组件的独立用法都有详细的说明。

styles/index.scss

```scss
// 使用vendors片段
@use './vendors';
```

styles/_vendors.scss

```scss
// 使用core核心样式
@use 'balm-ui/components/core';
// 使用button组件样式
@use 'balm-ui/components/button/button';
```

![image-20220512081927155](http://qn.chinavanes.com/qiniu_picGo/image-20220512081927155.png)

回到入口文件main.js中，只需要按需引入按钮组件，并在导入自定义样式预编译文件index.scss的前提下去使用按钮组件即可。

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
// 按需只引入按钮组件
import UiButton from 'balm-ui/components/button';
// 创建自定义样式预编译文件
import './styles/index.scss';
const app = createApp(App);
// 按需只使用按钮组件
app.use(UiButton);
app.mount('#app');
```

这时运行项目可能会提示你当前的项目环境并没有安装sass模块，错误信息类似`[plugin:vite:css] Preprocessor dependency "sass" not found. Did you install it?`，因为当前项目中已经使用了预编译样式scss，所以需要在项目中安装sass模块的支持，只需要在终端运行sass安装命令即可。

```bash
npm install sass --save-dev
```

重启项目运行页面会发现按钮仍旧起效没有任何问题，只不过现在再对项目进行产品化打包处理，运行`npm run build`以后查看dist目录磁盘资源占用情况你会发现只有215K的空间占用，差不多小了整整10倍，说明当前项目中只将按钮的资源内容进行了打包处理，如果还想使用其它组件则按类似的流程进行处理即可。



![image-20220512081107684](http://qn.chinavanes.com/qiniu_picGo/image-20220512081107684.png)

## 3)设计业务需求页面

在实现了BlamUI框架整体与按需引入操作以后，可以根据自己的业务结合框架现有组件来快速实现页面的设计与布局。假若项目的目标是设计一个能够满足PC浏览器以及能够适配移动端的页面，该页面中包含了类似抽屉开关的功能，用户能够进行指定按钮的点击打开或者关闭抽屉菜单，并在抽屉内容区用卡片式的布局进行栅格化的显示。看起来这一目标内容需求十分的繁多，但如果利用UI框架实现仅需要几分钟就可完成。为了便于开发测试可以先将BalmUI框架的应用模式切换回整体引入的结构，所以main.js的内容修改如下代码：

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
// 引入balm-ui整体框架
import BalmUI from 'balm-ui';
// 引入balm-ui整体样式
import 'balm-ui-css';
const app = createApp(App);
// 使用BalmUI整体框架
app.use(BalmUI);
app.mount('#app');
```

根据项目目标现在只需要找到最接近功能的UI组件即可，当前的功能需求利用“侧边导航栏”组件，也就是Drawer组件即可完成。打开该组件的文档，查看“例子”部分链接可以找到相应的组件案例，并且所有案例中都有示例代码，为了快速查看效果，可以将代码内容完全的复制与粘贴到当前项目的App.vue组件中，然后刷新页面查看效果。

![image-20220512084311171](http://qn.chinavanes.com/qiniu_picGo/image-20220512084311171.png)

![image-20220512084507969](http://qn.chinavanes.com/qiniu_picGo/image-20220512084507969.png)

App.vue

```vue
<template>
<div class="demo-container">
  <!-- Drawer -->
  <ui-drawer viewport-height>
    <ui-drawer-header>
      <ui-drawer-title>Title</ui-drawer-title>
      <ui-drawer-subtitle>Subtitle</ui-drawer-subtitle>
    </ui-drawer-header>
    <ui-drawer-content>
      <ui-nav>
        <ui-nav-item href="javascript:void(0)" active>Item {{ 0 }}</ui-nav-item>
        <ui-nav-item v-for="i in 12" :key="i" href="javascript:void(0)">
          Item {{ i }}
        </ui-nav-item>
      </ui-nav>
    </ui-drawer-content>
  </ui-drawer>
  <!-- Content -->
  <div class="demo-content">
    <!-- App bar -->
    <ui-top-app-bar
      class="demo-app-bar"
      content-selector=".demo-app-content"
      :nav-icon="false"
    >
      Title
    </ui-top-app-bar>
    <!-- App content -->
    <div class="demo-app-content">
      <p v-for="i in 24" :key="i">Main Content {{ i }}</p>
    </div>
  </div>
</div>
</template>

<style>
.demo-content {
  width: 100%;
}

.demo-app-content {
  height: 100%;
  overflow: auto;
}
</style>
```

应用页面在PC端浏览器中能够完全显示，如果打开浏览器调试工具使用移动端模拟器进行效果查看，界面也没有任何的问题。

![image-20220512084652931](http://qn.chinavanes.com/qiniu_picGo/image-20220512084652931.png)

![image-20220512084746264](http://qn.chinavanes.com/qiniu_picGo/image-20220512084746264.png)

现在只需要根据组件文档查看组件的Props属性、Events事件与Methods方法具体有哪些支持就可以，比如drawer抽屉组件中就有type属性的提供，可以实现抽屉的打开与显示，0就是permanent打开状态，1就是dismissible关闭状态。同样的，top-app-bar组件也有其nav-icon是否显示导航图标与navIcon导航图标内容的属性设置，还有nav的导航切换事件监听，我们都可以给他们进行属性设置与事件监听操作。

我们将抽屉类型默认设置为0，即permanent打开状态，头部导航图标默认显示设置，头部导航图标内容默认则为menu_open，并且添加toggleNav头部导航实现切换效果，实现如果原来的抽屉是打开，将切换至关闭，导航图标进行设置，反之亦然的最终效果。

App.vue

```vue {1-20,24-25,43,48-49}
<script setup>
import { ref } from 'vue';
// 抽屉类型默认为0，即permanent打开状态
const drawerType = ref(0);
// 头部导航图标是否设置，默认显示
const showNavIcon = ref(true);
// 头部导航图标内容设置，默认menu_open图标类型
const navIcon = ref('menu_open');
// 头部导航实现切换效果
const toggleNav = () => {
  // 如果原来的抽屉是打开，将切换至关闭，导航图标进行设置，反之亦然
  if (drawerType.value === 0) {
    drawerType.value = 1;
    navIcon.value = 'menu';
  } else {
    drawerType.value = 0;
    navIcon.value = 'menu_open';
  }
};
</script>

<template>
  <div class="demo-container">
    <!-- Drawer，type属性设置 -->
    <ui-drawer :type="drawerType" viewport-height>
      <ui-drawer-header>
        <ui-drawer-title>Title</ui-drawer-title>
        <ui-drawer-subtitle>Subtitle</ui-drawer-subtitle>
      </ui-drawer-header>
      <ui-drawer-content>
        <ui-nav>
          <ui-nav-item href="javascript:void(0)" active
            >Item {{ 0 }}</ui-nav-item
          >
          <ui-nav-item v-for="i in 12" :key="i" href="javascript:void(0)">
            Item {{ i }}
          </ui-nav-item>
        </ui-nav>
      </ui-drawer-content>
    </ui-drawer>
    <!-- Content -->
    <div class="demo-content">
      <!-- App bar，nav-icon、navIcon属性设置，@nav事件绑定 -->
      <ui-top-app-bar
        class="demo-app-bar"
        content-selector=".demo-app-content"
        :nav-icon="showNavIcon"
        :navIcon="navIcon"
        @nav="toggleNav"
      >
        Title
      </ui-top-app-bar>
      <!-- App content -->
      <div class="demo-app-content">
        <p v-for="i in 24" :key="i">Main Content {{ i }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.demo-content {
  width: 100%;
}

.demo-app-content {
  height: 100%;
  overflow: auto;
}
</style>
```

现在的页面功能非常的强大，头部导航不光显示了图标，在点击切换图标以后，不光抽屉会伸缩，导航图标也随之变化，所以不光从视觉效果还是操作体验来讲都十分的完美，更关键的是开发的效率与速度，那是奇快无比。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512090906133.png" alt="image-20220512090906133" style="zoom: 33%;" />

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512090918851.png" alt="image-20220512090918851" style="zoom:33%;" />

现在的项目只需要使用Layout Grid与Card组件就可以实现原来即定的目标了，我们将App.vue中抽屉内容部分的代码利用grid与card组件进行改造，改造的代码都直接从对应的组件中进行复制与粘贴即可，只需要稍加修改就可以完成目标。

```vue {20-29,65-90,105-136}
<script setup>
import { ref } from 'vue';
// 抽屉类型默认为0，即permanent打开状态
const drawerType = ref(0);
// 头部导航图标是否设置，默认显示
const showNavIcon = ref(true);
// 头部导航图标内容设置，默认menu_open图标类型
const navIcon = ref('menu_open');
// 头部导航实现切换效果
const toggleNav = () => {
  // 如果原来的抽屉是打开，将切换至关闭，导航图标进行设置，反之亦然
  if (drawerType.value === 0) {
    drawerType.value = 1;
    navIcon.value = 'menu';
  } else {
    drawerType.value = 0;
    navIcon.value = 'menu_open';
  }
};
// 对示例代码中的图标声明方式进行了转化
const icon1 = ref({
  on: 'favorite',
  off: 'favorite_border',
});

const icon2 = ref({
  on: 'bookmark',
  off: 'bookmark_border',
});
</script>

<template>
  <div class="demo-container">
    <!-- Drawer，type属性设置 -->
    <ui-drawer :type="drawerType" viewport-height>
      <ui-drawer-header>
        <ui-drawer-title>Title</ui-drawer-title>
        <ui-drawer-subtitle>Subtitle</ui-drawer-subtitle>
      </ui-drawer-header>
      <ui-drawer-content>
        <ui-nav>
          <ui-nav-item href="javascript:void(0)" active
            >Item {{ 0 }}</ui-nav-item
          >
          <ui-nav-item v-for="i in 12" :key="i" href="javascript:void(0)">
            Item {{ i }}
          </ui-nav-item>
        </ui-nav>
      </ui-drawer-content>
    </ui-drawer>
    <!-- Content -->
    <div class="demo-content">
      <!-- App bar，nav-icon、navIcon属性设置，@nav事件绑定 -->
      <ui-top-app-bar
        class="demo-app-bar"
        content-selector=".demo-app-content"
        :nav-icon="showNavIcon"
        :navIcon="navIcon"
        @nav="toggleNav"
      >
        Title
      </ui-top-app-bar>
      <!-- App content -->
      <div class="demo-app-content">
        <!-- 使用了grid与grid-cell组件进行栅格化布局设置 -->
        <ui-grid class="demo-grid">
          <ui-grid-cell class="demo-cell" v-for="i in 24" :key="i">
            <!-- 利用card卡片组件进行卡片式布局渲染 -->
            <ui-card class="demo-card demo-card--photo">
              <ui-card-content class="demo-card__primary-action">
                <ui-card-media square class="demo-card__media">
                  <ui-card-media-content
                    class="demo-card__media-content--with-title"
                  >
                    <div :class="[$tt('subtitle2'), 'demo-card__media-title']">
                      Vacation Photos
                    </div>
                  </ui-card-media-content>
                </ui-card-media>
              </ui-card-content>
              <ui-card-actions>
                <ui-card-icons>
                  <ui-icon-button :toggle="icon1"></ui-icon-button>
                  <ui-icon-button :toggle="icon2"></ui-icon-button>
                  <ui-icon-button icon="share"></ui-icon-button>
                </ui-card-icons>
              </ui-card-actions>
            </ui-card>
          </ui-grid-cell>
        </ui-grid>
      </div>
    </div>
  </div>
</template>

<style>
.demo-content {
  width: 100%;
}

.demo-app-content {
  height: 100%;
  overflow: auto;
}
/* 直接拷贝card卡片布局样式，
并在public目录下新建images目录，
放置一个card-image.jpg的图片，
因为卡片布局中使用到图片资源  */
.demo-card {
  width: 350px;
  margin: 48px;
}

.demo-card--photo {
  width: 200px;
}

.demo-card__media {
  background-image: url('/images/card-img.jpg');
}

.demo-card__media-content--with-title {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.demo-card__media-title {
  padding: 8px 16px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  color: white;
}
</style>
```

现在的页面在PC浏览器端可以正常的显示，在移动设备端也能正常渲染，但似乎界面上卡片的显示效果并不是特别的理想，这是因为没有实现浏览器适配的操作问题。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512092201791.png" alt="image-20220512092201791" style="zoom:33%;" />

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512092226767.png" alt="image-20220512092226767" style="zoom:33%;" />

我们可以给vscode编辑软件安装一个px to rpx的插件，利用插件来快速将px的单位设置转成rpx自动适配模式的单位格式。利用插件提供的功能可以快速的将px的样式单位转成rpx的单位内容，而rpx是响应式的像素单位可以解决多端适配的问题。现在再看页面在不同设备上的显示，效果感觉更好了。

![image-20220512092604475](http://qn.chinavanes.com/qiniu_picGo/image-20220512092604475.png)

![image-20220512092707501](http://qn.chinavanes.com/qiniu_picGo/image-20220512092707501.png)

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512092744945.png" alt="image-20220512092744945" style="zoom:33%;" />

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220512092805745.png" alt="image-20220512092805745" style="zoom:33%;" />

现在我们已经感受到利用UI框架布局一个多端适配的页面到底有多神速了。
