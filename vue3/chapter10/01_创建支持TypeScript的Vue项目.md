# 01.创建支持 TypeScript 的 Vue 项目

原先创建与应用的 vue 项目都是 JavaScript 代码书写模式，不管是对响应式数据的操作、路由的处理、数据请求的获取还是状态管理的应用都是支持的，这说明在 vue3 的框架中利用 JavaScript 进行程序开发是没有任何问题的。而上一章节在学习与掌握了 TypeScript 以后对 vue 中可以完全使用 JavaScript 应该有了一个更为彻底的理解，毕竟 TypeScript 是 JavaScript 的超集，TypeScript 来源于 JavaScript 并且最终归于 JavaScript。不过，vue3 框架本身基于 TypeScript 进行开发，它对于 TypeScript 非常的友好，而且因为 TypeScript 强大的类型功能将项目开发时会出现的编译与逻辑错误大幅度的减少，即便有错误也都集中在最容易处理的语法错误，所以在 vue 项目中结合应用 TypeScript 成为了一项非常必要的挑战。特别是随着项目的业务功能越来越丰富逐步从小型功能系统发展成大中型项目的时候，需要进行多人的团队化开发情况下，在 vue 项目中应用 TypeScript 就成了一个可以增强开发约束、优化代码结构、强化后期维护的一项重要工作。TypeScript 的类型约束、语法检查、自动友好提示不仅不会给项目添加复杂度，在习惯了它们的磨合以后反倒会极大提高项目的开发速度。

首先，想要在 vue3 中确认 TypeScript 的支持其项目创建时采用的模板类型就不再是 vue 而是切换成了 vue-ts，所以可以考虑重新创建一个以 TypeScript 语法结构为基础的 vue3 项目可以采用如下的命令：

```bash
npm create vite@latest vue3-book-typescript -- --template vue-ts
```

这样我们将创建一个名称为`vue3-book-typescript`的项目，它将以 vue-ts 模板为基础，该项目中的语法结构也将以 TypeScript 为编码模式。

项目创建以后会发现许多文件的后缀名都从原来的.js 变成了.ts，包括项目的配置文件`vite.config.ts`、入口文件`main.t`s，而且还会多出相应的环境声明文件`end.d.ts`，或者可以查看与观察一下它们与之前的.js 程序文件是否有发生语法上的变化。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220522082508424.png" alt="image-20220522082508424" style="zoom:50%;" />

打开项目的环境配置文件`vite.config.ts`查看配置代码以后则发现，该文件除了后缀名进行了修改，初始配置中的代码与原来.js 的内容完全一致，没有发生任何的变化。

vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
```

现在可以再从项目入口文件 main.ts 中进行比较，可以确认 main.ts 与原来的 main.js 从初始代码上来看也没有任何的差异：

src/main.ts

```typescript
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

对于项目中新增的 env.d.ts 程序文件，在 TypeScript 基础知识内容中就已经强调，这是描述类型文件，因为在当前的 vue 项目中不光会存在.ts 后缀的 TypeScript 程序文件，还会出现.vue 为后缀的 vue 组件程序文件，那么在.vue 后缀的组件文件中同样也会应用 TypeScript 的语法，所以需要一定的语法声明文件支持，这样可以允许我们在后期 vue 项目开发时在组件文件中轻松愉快的编写 TypeScript 代码，而 TypeScript 也会对其中的代码作一定的语法检测与约束等支撑功能。

src/env.d.ts

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

接下来可以比较一下主组件 App.vue，会发现该程序文件还是发生了一些变化的，主要是集中在 script 逻辑脚本区，原来`<script setup>`的语法描述又多了一个 lang 的属性，确认当前的程序类型为 ts 也就是 TypeScript 类型。至于 template 与 style 部分内容与 js 的 vue 项目没有任何差别。

App.vue

```vue
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue';
</script>
```

对于初始脚手架项目中最后一个比较文件 components 下的 HelloWorld.vue 组件文件会发现 TypeScript 的语法内容在突显，除了 script 中需要显式声明其 lang 语法类型为 ts 以外，还对接收到的 msg 属性进行了 TypeScript 模式的类型约束，利用的语法就是 TypeScript 中的泛型，强制约束 msg 为 string 数据类型并且不是可选项参数。

![image-20220522084535251](http://qn.chinavanes.com/qiniu_picGo/image-20220522084535251.png)

现在如果在 App.vue 组件中进行 HelloWord 子组件应用时进行属性传递操作不遵守 TypeScript 对于属性接收的类型约束，编辑器中直接就会出现对应的语法错误提示，比如不设置 msg 属性，则会提示缺少了属性"msg"，如果属性的数据类型设置错误则会提示类似不能将类型"number"分配给类型"string"这样的错误内容。

![image-20220522085347708](http://qn.chinavanes.com/qiniu_picGo/image-20220522085347708.png)

![image-20220522085447129](http://qn.chinavanes.com/qiniu_picGo/image-20220522085447129.png)

我想现在就能够很好的体现 vue 中应用 TypeScript 的优势了，正如前面所说，在利用编辑开发的编码阶段就可以将很多的错误进行修复处理，以减少编译和逻辑错误的发生了。至此，我们就已经将 vue 的 TypeScript 版本进行了成功的初始构建。
