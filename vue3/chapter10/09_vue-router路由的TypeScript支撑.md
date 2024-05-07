# 09.vue-router 路由的 TypeScript 支撑

利用 vue-router 可以实现页面之间的切换，在路由功能实现的时候又应该如何利用 TypeScript 做到更好的支撑协助操作呢？

首先需要在当前项目中安装路由模块：

```bash
npm install vue-router --save
```

然后将之前的 App.vue 与 components 下的组件内容进行清除，并在 src 目录下创建 views 目录，新建 Home.vue 与 About.vue 两个页面视图组件，内容就为最基本的文本展示：

src/views/Home.vue、About.vue

Home.vue、About.vue

```vue
<template>
  <h1>首页</h1>
</template>
```

接下来在 src 目录下创建 router 目录，并在该目录下新建 index.ts 程序文件，这是路由配置文件。在此文件中可以先从 vue-router 中引入 createRouter、createWebHashHistory 等内容，然后将 Home 与 About 两个组件进行引入就可以进行 routes 静态路由表的配置操作，可以对 routes 数组中每个路由对象设置路由配置属性，比如 name、component、path 等。不过现在编辑器并不会提示你进行路由配置时有哪些属性可以进行配置与选择，这对开发人员来讲应该说非常的不友好，除非将路由配置项的所有属性都了然于胸才能轻松的设置路由对象。

![image-20220604083836582](http://qn.chinavanes.com/qiniu_picGo/image-20220604083836582.png)

router/index.ts

```typescript
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
const routes = [
  {
    name: 'Home',
    component: Home,
    path: '/',
  },
  {
    name: 'About',
    component: About,
    path: '/about',
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
```

在定义好完整路由配置以后需要回到入口文件 main.ts 中将路由引入并应用：

```typescript {3-6}
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
const app = createApp(App);
app.use(router);
app.mount('#app');
```

配置好路由以后还需要将内容进行页面的渲染，所以重新编辑根组件 App.vue，只需要利用 router-view 进行占位渲染即可：

App.vue

```vue
<template>
  <router-view />
</template>
```

现在可以打开并修改 views/About.vue 文件，在引入并实例化 route 对象以后，再使用 route 中的 params 或者 query 等其它属性则可以显示有一定的提示信息。

![image-20220604085020691](http://qn.chinavanes.com/qiniu_picGo/image-20220604085020691.png)

```vue
<template>
  <h1>关于我们</h1>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
console.log(route.path);
</script>
```

现在我想先回过头去解决 router/index.ts 中的路由对象属性的自动提示问题，可以将鼠标放置于 createRouter 创建路由实例对象中的 routes 属性上，它将会提示路由选项 routes 的数据类型为 RouteRecordRaw[]，那么是否可以从 router-view 将 RouteRecordRaw 进行引入，并且在 routes 路由配置的时候就明确其数据类型呢？

![image-20220604085504865](http://qn.chinavanes.com/qiniu_picGo/image-20220604085504865.png)

所以，在利用 TypeScript 明确其路由的数据类型为 RouteRecordRaw[]以后，在进行路由对象修改时就会提示对应的属性内容，比如输入 meta，就会看到它是一个可选项属性，它是由\_RouteRecordBase 这一基础对象类型所提供的子属性。我们给 About 路由添加了 meta 元信息，并且在该对象节点下添加了 title、isAdmin、requiresAuth 等属性内容。

![image-20220604085708581](http://qn.chinavanes.com/qiniu_picGo/image-20220604085708581.png)

router/index.ts

```typescript {1,4,14-18}
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    component: Home,
    path: '/',
  },
  {
    name: 'About',
    component: About,
    path: '/about',
    meta: {
      title: '关于我们',
      isAdmin: true,
      requiresAuth: true,
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
```

那么回到 views/About.vue 中，route 实例对象中是否会有刚才所加的 meta 子属性内容的提示呢？得到的结果并不理解，现在 route.meta 中并没有 title、isAdmin、requiresAuth 等属性内容的代码提示。这是因为这些 meta 的属性是当前项目自定义的属性，并不是由 vue-router 提供的自带的路由对象属性。

![image-20220604090349782](http://qn.chinavanes.com/qiniu_picGo/image-20220604090349782.png)

看起来需要想办法将对象属性与数据类型约束添加到当前的路由对象中才可以有更好的路由编码提示操作。那么应该是怎么样的操作流程呢？

第一步，可以查看路由中的 meta 属性是什么数据类型，将鼠标移动到 meta 属性上则可以看到它是 RouteMeta 数据类型；

![image-20220604090956411](http://qn.chinavanes.com/qiniu_picGo/image-20220604090956411.png)

第二步，可以在 src 下新建立 vue-router.d.ts 描述文件。为什么有声明文件呢？ 在学习 TypeScript 的时候会强调因为 TypeScript 直接引用第三方 JS 库的时候，虽然可以用，但是是没有类型检查，所以我们需要做一个声明文件，来声明这些第三方库的类型，这样在使用第三方库的时候，就有类型了。这其实是默认情况，现在项目中已经安装了 vue-router 第三方库，并且在操作 route 对象的时候也有一定的类型协助，但问题的关键是实际项目需要更多的类型的支持，所以需要进行自定义的类型文件扩展操作。

在声明文件中可以从 vue-rotuer 中引入 RouteMeta，并且利用 declare 进行 module 模块声明，对于 RouteMeta 这个接口类型进行对象属性的扩展操作，将 title、isAdmin、requiresAuth 属性进行添加以及数据类型的定义。

```typescript
import { RouteMeta } from 'vue-router';

declare module 'vue-router' {
  // 路由meta元信息接口对象属性扩展
  interface RouteMeta {
    // 可以将属性添加到路由meta对象中，现在都为可选项模式
    title?: string;
    isAdmin?: boolean;
    requiresAuth?: boolean;
  }
}
```

现在点击 vue-router 这一关键字，编辑器会弹出两个 vue-router.d.ts 提示内容，第一个其实就是 vue-router 第三方模块安装好以后自带的描述文件，第二个其实就是当前用户自定义扩展的描述文件，这样的话自定义的描述文件与 vue-router 系统的描述文件将会产生一个整合，最终一同对项目的代码进行类型约束操作。

![image-20220604091617122](http://qn.chinavanes.com/qiniu_picGo/image-20220604091617122.png)

现在还可以将鼠标放置于 RouteMeta 接口对象上进行点击查看，则可以查看到第一个 vue-router.d.ts 描述文件中同样也能够找到 RouteMeta 相关的内容，因为自定义的 RouteMeta 就是从系统的 RouteMeta 而来的。

![image-20220604092043773](http://qn.chinavanes.com/qiniu_picGo/image-20220604092043773.png)

点击右侧第一个 vue-router.d.ts 描述文件的 RotueMeta 提示代码以后则可以跳转至安装在 node_modules 下的 vue-router 相关的代码文件中，并清晰查看到 RouteMeta 是 extends 继承于 Record 等类型内容。

![image-20220604092247962](http://qn.chinavanes.com/qiniu_picGo/image-20220604092247962.png)

第三步，现在需要回到视图页面 About.vue 当中，再进行 route.meta 代码输入的时候则可以清晰看到 title、isAdmin、requiresAuth 等属性的代码提示信息。

![image-20220604090932968](http://qn.chinavanes.com/qiniu_picGo/image-20220604090932968.png)

如果对于路由的配置并不想在 meta 元信息中添加新的属性，而是想在路由的根对象中添加自定义属性，比如现在想添加一个 hidden 属性，那么则会发现程序出现了语法错误。

![image-20220604093001471](http://qn.chinavanes.com/qiniu_picGo/image-20220604093001471.png)

查看 hidden 错误信息则可以看到一大堆的错误提示，是因为 RouteRecordRaw 类型中并不存在 hidden 这个用户自定义属性，那么这时候又应该如何？

![image-20220604093023971](http://qn.chinavanes.com/qiniu_picGo/image-20220604093023971.png)

当我们将鼠标放置于 path 等其它的路由对象属性上查看信息的时候则可以明确路由对象是基于\_RouteRecordBase 这个基础类型。

![image-20220604093155753](http://qn.chinavanes.com/qiniu_picGo/image-20220604093155753.png)

所以可以回到 src/vue-router.d.ts 描述文件中，除了从 vue-rotuer 路由模块中引入 \_RouteRecordBase，那么就可以进行自定义类型的扩展，利用 interface 扩展 \_RouteRecordBase 并添加 hidden 这个可选的自定义属性，将其设置为布尔型。如果想了解 \_RouteRecordBase 这个基础类型则可以进行点击查看第三方模块中对它的详情定义。

![image-20220604093333544](http://qn.chinavanes.com/qiniu_picGo/image-20220604093333544.png)

现在的路由配置中虽然添加了自定义的 hidden 属性，但也不会报以任何的错误信息，并且在代码书写的时候还会出现 hidden 属性的提示信息。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220604093606520.png" alt="image-20220604093606520" style="zoom:50%;" />

![image-20220604093700454](http://qn.chinavanes.com/qiniu_picGo/image-20220604093700454.png)

不过现在回到视图页 About.vue 中，如果你想从 route 这个对象中获取到 hidden 属性则会发现并没有任何的代码提示，这又是为什么呢？其实查看编辑器提示信息则可以发现，在路由中 hidden 的来源是基于 \_RouteRecordBase 这个对象类型，而视图页面中所看到的 fullPath 等属性都是基于 \_RouteLocationBase 这个对象类型，而 \_RouteLocationBase 这个对象类型中我们并没有定义 hidden 这个自定义属性，所以视图页的 route 对象中自然没有 hidden 属性代码的提示。

![image-20220604093803131](http://qn.chinavanes.com/qiniu_picGo/image-20220604093803131.png)

现在可以进一步修改 src/vue-router.d.ts 描述文件，需要加入对 \_RouteLocationBase 的扩展内容：

```typescript {1,9-13}
import { _RouteRecordBase, _RouteLocationBase, RouteMeta } from 'vue-router';

declare module 'vue-router' {
  // RouterRecordRaw的属性扩展
  // 主要在路由配置表中进行应用
  interface _RouteRecordBase {
    hidden?: boolean;
  }
  // RouteLocationNormalized标准化路由位置属性扩展
  // 主要在组件中对于useRoute对象进行应用
  interface _RouteLocationBase {
    hidden?: boolean;
  }
  // 路由meta元信息接口对象属性扩展
  interface RouteMeta {
    // 可以将属性添加到路由meta对象中，现在都为可选项模式
    title?: string;
    isAdmin?: boolean;
    requiresAuth?: boolean;
  }
}
```

完成属性扩展以后回到视图页 About.vue 中，则可以查看到 route 对象中已经包含了 hidden 这一自定义属性内容。

![image-20220604094253004](http://qn.chinavanes.com/qiniu_picGo/image-20220604094253004.png)

但是在视图页面，我们不光可以操作当前路由对象 route 还可以操作整体路由对象 router，在引入并实例化 router 整体路由对象以后，利用 getRotues 获取到所有路由并进行循环以后，在循环中的 route 单个路由对象中似乎也没有发现 hidden 这个自定义属性，那么这个问题又应该如何解决呢？

![image-20220604095647259](http://qn.chinavanes.com/qiniu_picGo/image-20220604095647259.png)

我们将鼠标放置于 forEach 循环体内的 route 参数上则可以看到这一 route 的数据类型则是 RouteRecordNormalized，所以需要在这里对 route 进行 hidden 的属性提示看来还得继续进一步完善自定义 vue-router 的描述文件。

![image-20220604095817010](http://qn.chinavanes.com/qiniu_picGo/image-20220604095817010.png)

修改 src/vue-router.d.ts 描述文件，添加 RouteRecordNormalized 的接口类型，同样设置 hidden 自定义属性，那么现在视图页的循环体内 route 中就会出现 hidden 的代码提示内容。

```typescript {1-6,19-22}
import {
  _RouteRecordBase,
  _RouteLocationBase,
  RouteRecordNormalized,
  RouteMeta,
} from 'vue-router';

declare module 'vue-router' {
  // RouterRecordRaw的属性扩展
  // 主要在路由配置表中进行应用
  interface _RouteRecordBase {
    hidden?: boolean;
  }
  // RouteLocationNormalized标准化路由位置属性扩展
  // 主要在组件中对于useRoute对象进行应用
  interface _RouteLocationBase {
    hidden?: boolean;
  }
  // 对于router.getRoutes().forEach(route =>{})中的route对象进行应用
  interface RouteRecordNormalized {
    hidden?: boolean;
  }
  // 路由meta元信息接口对象属性扩展
  interface RouteMeta {
    // 可以将属性添加到路由meta对象中，现在都为可选项模式
    title?: string;
    isAdmin?: boolean;
    requiresAuth?: boolean;
  }
}
```

![image-20220604100103186](http://qn.chinavanes.com/qiniu_picGo/image-20220604100103186.png)

在vue-router的应用中我们利用了描述文件进行了数据类型的约束操作，这其实同样是TypeScript对vue的一种支撑形式。
