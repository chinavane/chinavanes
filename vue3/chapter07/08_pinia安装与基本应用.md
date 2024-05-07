# 08.pinia 安装与基本应用

想要在 vue 项目中进行 pinia 模块的使用，首先可以利用 vite 进行一个 pinia 项目的创建，项目的名称定为“vue3-book-pinia"。

```bash
npm create vite@latest vue3-book-pinia -- --template vue
```

然后在主页面 index.html 中引入 bootstrap 这一 UI 框架的 css 样式，以及将 components 下的 HelloWorld.vue 组件删除，并且将 App.vue 主组件的内容进行清除。

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.1.3/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Pinia</title>
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

为了在 vue 项目中引入模块内容使用别名与省略后缀功能，还需要再次设置 vite.config.js，加上 resolve 属性节点，并且设置 alias 与 extensions 的内容。

vite.config.js

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 设置别名与后缀
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
```

接下来在 components 目录下快速创建三个子组件，包括 Child1.vue、Child2.vue 以及 Grandson.vue，显然 Child1.vue 与 Child2.vue 是两个并列关系的子组件，而 Grandson.vue 是嵌套于 Child1.vue 中的孙级组件。

components/Child1.vue

```vue
<script setup>
import Grandson from '@/components/Grandson';
</script>

<template>
  <div class="p-5">
    <h2>子组件1</h2>
    <div class="card">
      <grandson />
    </div>
  </div>
</template>
```

components/Child2.vue

```vue
<script setup></script>

<template>
  <div class="p-5">
    <h2>子组件2</h2>
  </div>
</template>
```

components/Grandson.vue

```vue
<script setup></script>

<template>
  <div class="p-5 text-dark">
    <h3>孙级组件</h3>
  </div>
</template>
```

然后，在主组件 App.vue 中需要将 Child1.vue 和 Child2.vue 这两个子组件进入引入与渲染。

App.vue

```vue
<script setup>
import Child1 from '@/components/Child1';
import Child2 from '@/components/Child2';
</script>

<template>
  <div class="container bg-info p-5 text-white">
    <h1>Pinia父组件</h1>
    <div class="row">
      <div class="col bg-primary text-white">
        <child1></child1>
      </div>
      <div class="col bg-danger text-white">
        <child2></child2>
      </div>
    </div>
  </div>
</template>
```

所以最后 vue 项目运行的结果应该是 App.vue 下嵌套了两个子组件 Child1 与 Child2，而 Child1 子组件下又嵌套了 Grandson 这一子组件，我们可以在浏览器调试工具中找到 vue 调试插件面板，可以对 vue 的 Components 组件结构进行直观的查看并且确认它们之间的层次关系，确实是三层嵌套结构。

上述的操作步骤在 vuex 应用过程中已经经历过一次，项目前期准备工作都基本相同。

在将 vue 项目的组件结构准备完毕以后可以给当前项目进行 pinia 模块的融入结合处理，前提当然是模块的安装处理。

```bash
npm install pinia --save
```

在安装完 pinia 以后可以在入口文件中进行 pinia 实例的创建以及与 vue 项目的衔接配合操作。在使用创建 pinia 实例对象前需要从 pinia 中解构引入 createPinia 函数，然后直接利用该函数进行 pinia 实例的创建，最后可以使用 use(pinia)与 vue 项目进行集成。

main.js

```js
import { createApp } from 'vue';
import App from './App.vue';
// 引入createPinia方法
import { createPinia } from 'pinia';
// 实例化pinia
const pinia = createPinia();
// 将pinia与vue进行集成
createApp(App).use(pinia).mount('#app');
```

接下来创建 store 目录并在该目录下新建 counter.js 文件，需要先从 pinia 中引入 defineStore 方法并利用该函数创建 counter 仓库模块，我们将 counter 模块名称定义为 useCounterStore。

- 在 defineStore 创建仓库实例对象的时候可以设置 id 属性，这是仓库的唯一标识，需要明确的是这个属性是必要的，因为 pinia 使用它来将 store 连接到 vue 的调试工具；
- 在 pinia 中设置 state 状态的模式与 vuex 保持一致，当前直接设置了 count 状态值，初始值为 0；
- 同样的，在 pinia 中 getters 获取内容的方式与 vuex 也保持一致，需要通过 state 参数操作状态属性 count，所以可以将 vuex 中的 multiCount 这一 getters 进行设置；
- 不过因为 pinia 中已经去除了 mutations 修改数据的层次，所以可以直接定义 actions，并准备在 actions 中进行同步数据的修改以及异步数据修改的操作。可以定义 increment、decrement 同步修改 count 值函数，在这两个函数中将利用 this 对象直接控制 count 值的递增与递减处理，this 是当前仓库实例对象，我们需要通过 this 操作当前仓库的 state 属性值。然后再定义 asyncIncrement、asyncDecrement 这两个异步修改 count 值函数，在这两个函数中可以进行 payload 参数的传递，可以利用 payload 参数进行步长递增递减处理，而 payload 可以应用不同的数据类型，当前同样也利用了 setTimeout 进行了异步操作的模拟处理；

```js
import { defineStore } from 'pinia';
export const useCounterStore = defineStore({
  id: 'counter', // 仓库的唯一标识
  // 设置状态 state
  state: () => ({
    count: 0,
  }),
  // 获取内容 getters
  getters: {
    // 通过state参数操作状态属性count
    multiCount: (state) => state.count * 2,
  },
  // 同异步修改数据 actions
  actions: {
    // this是当前仓库实例对象
    // 通过this操作当前仓库的state属性值
    increment() {
      this.count++;
    },
    // 利用payload参数进行步长递减，数字属性模式
    asyncIncrement(payload) {
      setTimeout(() => {
        this.count += payload;
      }, 1000);
    },
    // 利用payload参数进行步长递减，对象属性模式
    asyncDecrement(payload) {
      setTimeout(() => {
        this.count -= payload.step;
      }, 500);
    },
  },
});
```

既然已经创建好 counter 仓库，那么组件中应该如何进行仓库的引入与调用呢？可以先打开 Grandson 孙组件，直接将 store/counter 的仓库对象进行引入，并且可以利用解构建的方式直接从 useCounterStore 仓库中将 increment、asyncIncrement、asyncDecrement 这几个 actions 动作方法进行获取，并且在 template 模板部分直接进行对应函数的调用，至于 asyncIncrement 与 asyncDecrement 函数调用时可以传递递增递减的步长参数值，可以是数值类型也可以对象类型。

components/Grandson.vue

```vue
<script setup>
import { useCounterStore } from '@/store/counter';
const { increment, asyncIncrement, asyncDecrement } = useCounterStore();
</script>

<template>
  <div class="p-5 text-dark">
    <h3>孙级组件</h3>
    <button class="btn btn-primary" @click="increment">同步count加1</button>
    &nbsp;
    <button class="btn btn-secondary" @click="asyncIncrement(10)">
      异步count加N
    </button>
    &nbsp;
    <button class="btn btn-secondary" @click="asyncDecrement({ step: 5 })">
      异步count减N
    </button>
  </div>
</template>
```

接下来准备修改 Child2 这个子组件，同样的也从 store/counter 引入 useCounterStore 的仓库内容，并用可以直接将 count 这个 state 状态值与 multiCount 这个 getters 方法从 useCounterStore 仓库中进行解构引入，并且直接在 template 模板层进行渲染显示。

components/Child2.vue

```vue
<script setup>
import { useCounterStore } from '@/store/counter';
const { count, multiCount } = useCounterStore();
</script>

<template>
  <div class="p-5">
    <h2>子组件2</h2>
    <p>Count：{{ count }}</p>
    <p>doubleCount:{{ multiCount }}</p>
  </div>
</template>
```

现在测试应用进行 count 值的递增递减操作并打开 vue 调试工具查看会发现调试工具中的状态值发生了改变而页面上的 count 值并没有响应式的变化，这种情况似乎在 vuex 中也曾出现过，需要利用 toRefs 将非响应式数据转化为响应式数据才可以。

![image-20221119095714282](http://qn.chinavanes.com/qiniu_picGo/image-20221119095714282.png)

pinia 同样提供了类似的操作函数，可以从 pinia 里引入 storeToRefs 方法，并且利用该方法将 useCounterStore 函数调用的返回内容进行响应式数据的转换操作，现在再测试应用一切都变得非常完美，不管是同步增减还是异步增减都没有任何的问题，但现在的代码却是比 vuex 要精减太多，也更容易读懂理解与编写维护。

```vue
<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/store/counter';
// 利用storeToRefs将非响应式数据转成响应式数据
const { count, multiCount } = storeToRefs(useCounterStore());
</script>
```

![image-20221119095803330](http://qn.chinavanes.com/qiniu_picGo/image-20221119095803330.png)
