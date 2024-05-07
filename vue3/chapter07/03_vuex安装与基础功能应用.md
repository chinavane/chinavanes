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

安装完vuex插件以后先不着急进行仓库模块的具体代码编写，可以根据之前vuex层次结构与流程走向规划一下当前项目的目标功能。

- 在子组件2中需要直接渲染vuex仓库中的state状态值count(vuex的state值设置与Vue Components组件渲染)；
- 在子组件2中需要利用getters计算属性的方式获取加倍count值doubleCount(vuex的getters计算返回与Vue Components组件getters计算获取)；
- 在孙级组件中需要利用“同步count加1”按钮commit提交mutations中的同步修改state状态方法进行count值加1操作(vuex的mutations修改的定义与Vue Components组件提交mutations修改函数执行)；
- 在孙级组件中需要利用“异步count加N”按钮dispatch派发actions中的异步动作，并且需要传递异步累加count的步长值进行指定参数的count累加操作(vuex的actions异步的定义与Vue Components组件派发actions异步函数执行)；
- 在孙级组件中需要利用“异步count减N”按钮dispatch派发actions中的异步动作，并且需要传递异步累加count的步长值对象进行指定参数的count递减操作，还需要将actions动作执行结果进行Promise返回让组件中可以进行Promise结果的获取(vuex的actions异步的定义和异步函数结果Promise结果形式的返回以及Vue Components组件派发actions异步函数执行和Promise结果的获取)。

![image-20221119082806698](http://qn.chinavanes.com/qiniu_picGo/image-20221119082806698.png)

在安装完 vuex 与梳理好操作目标以后可以在入口文件中进行 vuex 实例的创建以及与 vue 项目的衔接配合操作。在使用创建 vuex 实例对象前需要从 vuex 中解构引入 createStore 函数，利用该函数可以进行 store 这唯一数据仓库的创建操作，需要强调的是 vuex 有且只有一个 store 数据仓库对象。

在这个仓库中可以设置 state 状态内容，它是函数数据类型，可以返回一个对象，目前该对象中只包含一个状态值也就是 count，默认值设置为 0。

获取数据getters中可以设置一个multiCount函数，函数的参数是state，因为需要对state原状态值进行计算处理，当前直接return返回的是对state.count进行乘法2的计算结果值，这样在组件在进行getters的multiCount方法调用时直接将返回2倍的count值。

修改数据mutations同样是对state进行状态值的修改处理，所以mutations对象节点中的函数参数里也都是state为第一参数，而state中有count这一属性值，所以可以设置increment递增函数直接对state.count++进行count值的累计加1操作。除此之外，mutations中的函数还可以接收payload有效载荷的参数，该参数可以是任意数据类型，比如直接是数值型，那么multiIncrement函数中对state.count进行累加N操作时payload就是那个N值，但假若数据类型是对象型，那么multiDecrement函数中对state.count进行递减N操作时payload就是那个payload.step的对象属性值。

异步操作actions主要是对mutations进行commit提交操作，因为不建议在mutations层进行异步处理，所以可以在actions层先进行异步功能，然后需要修改数据的时候将数据通过payload的参数形式commit到mutations的修改数据方法中，所以actions中的asyncMultiIncrement方法中主要参数包括了context上下文以及payload有效载荷参数，context上下文对象中包含commit、dispatch、getters、rootGetters、rootState、state等方法与属性，那么就可以利用context.commit进行multiIncrement这一mutations方法的提交，并且将payload作为参数一同传递。至于asyncMultiDecrement这个actions动作中可以直接将commit方法从context中解构，并且利用return new Promise方法将异步actions动作操作内容进行Promise形式的返回，而Promise中只需要利用resolve、reject将成功与失败内容进行解析或弹射处理即可。

到止vuex仓库的功能内容就根据目标进行了设定，不过目前这个数据仓库与 vue 项目还无关联，需要利用 use 的插件使用语法操作将 vue 与 vuex 的 store 仓库建立起对应关系，这样 store 才能在 vue 项目中起到它的作用。

main.js

```js {2-7,9-10}
import { createApp } from 'vue';
import { createStore } from 'vuex';
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
        context.commit('multiIncrement', payload);
      }, 2000);
    },
    // 直接利用解构方式将commit方法从context中获取
    asyncMultiDecrement: ({ commit }, payload) => {
      // 将actions的结果返回Promise对象
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 直接传递payload对象
          commit('multiDecrement', payload);
          // 利用resolve返回成功执行结果
          resolve({
            code: 200,
            message: 'actions异步操作成功',
          });
        }, 1000);
      });
    },
  },
});
import App from './App.vue';
// 将store以插件形式与vue项目进行衔接
createApp(App).use(store).mount('#app');
```

因为 vuex 的 store 数据仓库已经建立并与当前的 vue 项目衔接完毕，那么就意味着在当前项目的任何一个层次的页面或者组件中都可以进行 store 仓库中 state 数据的获取与渲染显示操作。假设想在 Child2.vue 这个子组件中显示 store 仓库中的 count 状态值，那么可以尝试直接在组件的template模板层进行 {{store.state.count}}仓库state状态值对象属性count的渲染处理。如果想通过getters获取2倍state.count状态值，那么需要先引入 useStore 这个 vuex 提供的 hook 钩子利用它获取当前 store 仓库实例，利用vue的computed计算属性功能可以直接将store.getters.multiCount值进行计算结果值的返回，并将计算结果值声明成doubleCount变量直接在template模板层进行数据渲染即可。

components/Child2.vue

```vue
<script setup>
import { computed } from 'vue';
// 引入useStore这个vuex提供的hook钩子
import { useStore } from 'vuex';
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

state状态与getters数据获取操作在Child2.vue组件中都得以了应用，那么mutations与actions层次的操作可以放置到Grandson孙级组件中，以确认store仓库可以在任意层次组件中进行仓库内容的操作。

在引入useStore这个vuex提供的hook钩子以后进行仓库的实例化处理，可以直接从useStore仓库实例对象中解构commit、dispatch等方法以便后续提交与派发操作。对于原来仓库中定义的mutations方法可以直接通过commit提交，可以不传递参数直接提交，但假若mutations的修改state方法里有payload参数的话，commit提交操作时也是可以传递参数的。

如果理解了mutations的commit提交流程，那么actions的动作派发处理就如出一辙了，只不过在dispatch方法的时候可以传递参数，比如` dispatch('asyncMultiIncrement', 5);`在派发了asyncMultiIncrement的actions动作以后还传递了数值型参数5，`dispatch('asyncMultiDecrement', {step: 5})`在派发了asyncMultiDecrement的actions动作以后则传递了对象型参数`{step:5}`。因为asyncMultiDecrement这个actions动作函数在定义的时候进行了return new Promise的返回处理，所以组件中除了dispatch动作派发还可以将dispatch派发的结果值进行Promise的方式进行返回，当前则利用async、await的方法进行result结果值的获取。

components/Grandson.vue

```vue
<script setup>
// 引入useStore这个vuex提供的hook钩子
import { useStore } from 'vuex';
// 获取当前store仓库实例，解构commit与dispatch方法
const { commit, dispatch } = useStore();
// 定义一个方法，用于提交mutation
const increment = () => {
  commit('increment');
};
// 定义一个方法，用于派发action，传递数值参数
const multiIncrement = () => {
  dispatch('asyncMultiIncrement', 5);
};
// 定义一个方法，用于派发action，传递对象参数，并且获取action返回的Promise结果
const asyncMultiDecrement = async () => {
  const result = await dispatch('asyncMultiDecrement', {
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

 现在项目运行的结果已经成功的将vuex仓库内容在各个不同的层次组件中进行了渲染与调用操作，对于vuex的基础功能也进行了全面的掌握与了解。

![image-20221119091138586](http://qn.chinavanes.com/qiniu_picGo/image-20221119091138586.png)
