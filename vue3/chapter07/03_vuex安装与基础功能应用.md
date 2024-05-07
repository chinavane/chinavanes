# 03.vuex 安装与初始状态应用

想要在 vue 项目中进行 vuex 模块的使用，首先可以利用 vite 进行一个 vuex 项目的创建，项目的名称定为“vue3-book-vuex"。

```bash
npm create vite@latest vue3-book-vuex -- --template vue
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
    <title>Vuex</title>
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
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const { resolve } = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 设置别名与后缀
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});
```

接下来在 components 目录下快速创建三个子组件，包括 Child1.vue、Child2.vue 以及 Grandson.vue，显然 Child1.vue 与 Child2.vue 是两个并列关系的子组件，而 Grandson.vue 是嵌套于 Child1.vue 中的孙级组件。

components/Child1.vue

```vue
<script setup>
import Grandson from "@/components/Grandson";
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
import Child1 from "@/components/Child1";
import Child2 from "@/components/Child2";
</script>

<template>
  <div class="container bg-info p-5 text-white">
    <h1>Vuex父组件</h1>
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

![image-20220505135449177](http://qn.chinavanes.com/qiniu_picGo/image-20220505135449177.png)

在将 vue 项目的组件结构准备完毕以后可以给当前项目进行 vuex 模块的融入结合处理，前提当然是模块的安装处理。虽然 vuex 是 vue 项目团队的官方插件，但并没有直接内置于 vue 框架当中，它和 vue-router 一样是以一个独立的插件存在，因为毕竟并不是所有 vue 项目一定需要 vuex 这一状态管理器的整合应用。

```bash
npm install vuex --save
```

安装完 vuex 插件以后先不着急进行仓库模块的具体代码编写，可以根据之前 vuex 层次结构与流程走向规划一下当前项目的目标功能。

- 在子组件 2 中需要直接渲染 vuex 仓库中的 state 状态值 count(vuex 的 state 值设置与 Vue Components 组件渲染)；
- 在子组件 2 中需要利用 getters 计算属性的方式获取加倍 count 值 doubleCount(vuex 的 getters 计算返回与 Vue Components 组件 getters 计算获取)；
- 在孙级组件中需要利用“同步 count 加 1”按钮 commit 提交 mutations 中的同步修改 state 状态方法进行 count 值加 1 操作(vuex 的 mutations 修改的定义与 Vue Components 组件提交 mutations 修改函数执行)；
- 在孙级组件中需要利用“异步 count 加 N”按钮 dispatch 派发 actions 中的异步动作，并且需要传递异步累加 count 的步长值进行指定参数的 count 累加操作(vuex 的 actions 异步的定义与 Vue Components 组件派发 actions 异步函数执行)；
- 在孙级组件中需要利用“异步 count 减 N”按钮 dispatch 派发 actions 中的异步动作，并且需要传递异步累加 count 的步长值对象进行指定参数的 count 递减操作，还需要将 actions 动作执行结果进行 Promise 返回让组件中可以进行 Promise 结果的获取(vuex 的 actions 异步的定义和异步函数结果 Promise 结果形式的返回以及 Vue Components 组件派发 actions 异步函数执行和 Promise 结果的获取)。

![image-20221119082806698](http://qn.chinavanes.com/qiniu_picGo/image-20221119082806698.png)

在安装完 vuex 与梳理好操作目标以后可以在入口文件中进行 vuex 实例的创建以及与 vue 项目的衔接配合操作。在使用创建 vuex 实例对象前需要从 vuex 中解构引入 createStore 函数，利用该函数可以进行 store 这唯一数据仓库的创建操作，需要强调的是 vuex 有且只有一个 store 数据仓库对象。

在这个仓库中可以设置 state 状态内容，它是函数数据类型，可以返回一个对象，目前该对象中只包含一个状态值也就是 count，默认值设置为 0。

获取数据 getters 中可以设置一个 multiCount 函数，函数的参数是 state，因为需要对 state 原状态值进行计算处理，当前直接 return 返回的是对 state.count 进行乘法 2 的计算结果值，这样在组件在进行 getters 的 multiCount 方法调用时直接将返回 2 倍的 count 值。

修改数据 mutations 同样是对 state 进行状态值的修改处理，所以 mutations 对象节点中的函数参数里也都是 state 为第一参数，而 state 中有 count 这一属性值，所以可以设置 increment 递增函数直接对 state.count++进行 count 值的累计加 1 操作。除此之外，mutations 中的函数还可以接收 payload 有效载荷的参数，该参数可以是任意数据类型，比如直接是数值型，那么 multiIncrement 函数中对 state.count 进行累加 N 操作时 payload 就是那个 N 值，但假若数据类型是对象型，那么 multiDecrement 函数中对 state.count 进行递减 N 操作时 payload 就是那个 payload.step 的对象属性值。

异步操作 actions 主要是对 mutations 进行 commit 提交操作，因为不建议在 mutations 层进行异步处理，所以可以在 actions 层先进行异步功能，然后需要修改数据的时候将数据通过 payload 的参数形式 commit 到 mutations 的修改数据方法中，所以 actions 中的 asyncMultiIncrement 方法中主要参数包括了 context 上下文以及 payload 有效载荷参数，context 上下文对象中包含 commit、dispatch、getters、rootGetters、rootState、state 等方法与属性，那么就可以利用 context.commit 进行 multiIncrement 这一 mutations 方法的提交，并且将 payload 作为参数一同传递。至于 asyncMultiDecrement 这个 actions 动作中可以直接将 commit 方法从 context 中解构，并且利用 return new Promise 方法将异步 actions 动作操作内容进行 Promise 形式的返回，而 Promise 中只需要利用 resolve、reject 将成功与失败内容进行解析或弹射处理即可。

到止 vuex 仓库的功能内容就根据目标进行了设定，不过目前这个数据仓库与 vue 项目还无关联，需要利用 use 的插件使用语法操作将 vue 与 vuex 的 store 仓库建立起对应关系，这样 store 才能在 vue 项目中起到它的作用。

main.js

```js {2-7,9-10}
import { createApp } from "vue";
import { createStore } from "vuex";
// 利用createStore创建唯一的store仓库实例
const store = createStore({
  // 设置状态state
  state: () => ({ count: 0 }),
  // 获取内容
  getters: {
    multiCount: (state) => {
      return state.count * 2;
    },
  },
  // 修改数据
  mutations: {
    // 同步count+1
    increment: (state) => {
      state.count++;
    },
    // 同步count+N
    multiIncrement: (state, payload) => {
      state.count += payload;
    },
    // 同步count-N
    multiDecrement: (state, payload) => {
      // 利用payload参数进行步长递减，对象属性模式
      state.count -= payload.step;
    },
  },
  // 异步操作
  actions: {
    // 利用context中的commit方法将异步执行结果提交到mutations中修改数据
    asyncMultiIncrement: (context, payload) => {
      // context上下文对象中包含commit、dispatch、getters、rootGetters、rootState、state等方法与属性
      setTimeout(() => {
        // 直接传递payload数值
        context.commit("multiIncrement", payload);
      }, 2000);
    },
    // 直接利用解构方式将commit方法从context中获取
    asyncMultiDecrement: ({ commit }, payload) => {
      // 将actions的结果返回Promise对象
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 直接传递payload对象
          commit("multiDecrement", payload);
          // 利用resolve返回成功执行结果
          resolve({
            code: 200,
            message: "actions异步操作成功",
          });
        }, 1000);
      });
    },
  },
});
import App from "./App.vue";
// 将store以插件形式与vue项目进行衔接
createApp(App).use(store).mount("#app");
```

因为 vuex 的 store 数据仓库已经建立并与当前的 vue 项目衔接完毕，那么就意味着在当前项目的任何一个层次的页面或者组件中都可以进行 store 仓库中 state 数据的获取与渲染显示操作。假设想在 Child2.vue 这个子组件中显示 store 仓库中的 count 状态值，那么可以尝试直接在组件的 template 模板层进行 `{ { store.state.count } } `仓库 state 状态值对象属性 count 的渲染处理。如果想通过 getters 获取 2 倍 state.count 状态值，那么需要先引入 useStore 这个 vuex 提供的 hook 钩子利用它获取当前 store 仓库实例，利用 vue 的 computed 计算属性功能可以直接将 store.getters.multiCount 值进行计算结果值的返回，并将计算结果值声明成 doubleCount 变量直接在 template 模板层进行数据渲染即可。

components/Child2.vue

```vue
<script setup>
import { computed } from "vue";
// 引入useStore这个vuex提供的hook钩子
import { useStore } from "vuex";
// 获取当前store仓库实例
const store = useStore();
// 通过getters获取store仓库中的状态值multiCount
const doubleCount = computed(() => store.getters.multiCount);
</script>

<template>
  <div class="p-5">
    <h2>子组件2</h2>
    <!-- 直接渲染store仓库中的state状态值count -->
    <p>Count：{{ store.state.count }}</p>
    <!-- 通过getters获取store仓库中的状态值multiCount -->
    <p>doubleCount:{{ doubleCount }}</p>
  </div>
</template>
```

state 状态与 getters 数据获取操作在 Child2.vue 组件中都得以了应用，那么 mutations 与 actions 层次的操作可以放置到 Grandson 孙级组件中，以确认 store 仓库可以在任意层次组件中进行仓库内容的操作。

在引入 useStore 这个 vuex 提供的 hook 钩子以后进行仓库的实例化处理，可以直接从 useStore 仓库实例对象中解构 commit、dispatch 等方法以便后续提交与派发操作。对于原来仓库中定义的 mutations 方法可以直接通过 commit 提交，可以不传递参数直接提交，但假若 mutations 的修改 state 方法里有 payload 参数的话，commit 提交操作时也是可以传递参数的。

如果理解了 mutations 的 commit 提交流程，那么 actions 的动作派发处理就如出一辙了，只不过在 dispatch 方法的时候可以传递参数，比如` dispatch('asyncMultiIncrement', 5);`在派发了 asyncMultiIncrement 的 actions 动作以后还传递了数值型参数 5，`dispatch('asyncMultiDecrement', {step: 5})`在派发了 asyncMultiDecrement 的 actions 动作以后则传递了对象型参数`{step:5}`。因为 asyncMultiDecrement 这个 actions 动作函数在定义的时候进行了 return new Promise 的返回处理，所以组件中除了 dispatch 动作派发还可以将 dispatch 派发的结果值进行 Promise 的方式进行返回，当前则利用 async、await 的方法进行 result 结果值的获取。

components/Grandson.vue

```vue
<script setup>
// 引入useStore这个vuex提供的hook钩子
import { useStore } from "vuex";
// 获取当前store仓库实例，解构commit与dispatch方法
const { commit, dispatch } = useStore();
// 定义一个方法，用于提交mutation
const increment = () => {
  commit("increment");
};
// 定义一个方法，用于派发action，传递数值参数
const multiIncrement = () => {
  dispatch("asyncMultiIncrement", 5);
};
// 定义一个方法，用于派发action，传递对象参数，并且获取action返回的Promise结果
const asyncMultiDecrement = async () => {
  const result = await dispatch("asyncMultiDecrement", {
    step: 5,
  });
  console.log(result);
};
</script>

<template>
  <div class="p-5 text-dark">
    <h3>孙级组件</h3>
    <button class="btn btn-primary" @click="increment">同步count加1</button>
    &nbsp;
    <button class="btn btn-success" @click="multiIncrement">
      异步count加N
    </button>
    &nbsp;
    <button class="btn btn-secondary" @click="asyncMultiDecrement">
      异步count减N
    </button>
  </div>
</template>
```

现在项目运行的结果已经成功的将 vuex 仓库内容在各个不同的层次组件中进行了渲染与调用操作，对于 vuex 的基础功能也进行了全面的掌握与了解。

![image-20221119091138586](http://qn.chinavanes.com/qiniu_picGo/image-20221119091138586.png)
