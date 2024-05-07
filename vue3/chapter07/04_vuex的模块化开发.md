# 04.vuex 的 modules 模块拆分

## 1)利用 modules 进行模块拆分

现在 vuex 仓库中操作内容都是围绕着 count 这一状态值进行处理，包括 state 的设置状态、getters 的获取内容、mutations 的修改数据、actions 的异步操作，但是假若以后还有对 users 用户，news 新闻，products 产品，orders 订单等等不同的内容进行仓库的各种状态进行管理，那么这个 vuex 的 store 在进行代码维护的时候将会是比较混乱的一个场面。因为如果将不同内容的 state 状态值以及各种 getters、mutations、actions 不同操作方法都混乱参杂一块，一下子操作的是 count，一下子处理的又是 news，一下子冒出来的是 product 的代码，代码的书写顺序、可读性、可维护性等各种方面都面临挑战，而且所有内容都设置在一个对象当中时这个对象也将会变得异常的臃肿。所以 vuex 提供了 modules 模块拆分的功能，利用它可以轻松解决不同板块进行不同 vuex 仓库区内容的划分。虽然所有的内容仍旧在一个大的仓库中，但进行了分模块分片区的管理，这样代码结构清晰返回的指定对象也会小很多轻巧很多。

现在可以在项目 src 目录中创建 store 仓库子目录，并在 store 下再创建 modules 仓库模块子目录，然后新建 counter.js 仓库模块文件，可以将 main.js 入口文件中 createStore 创建仓库内容的 state、getters、mutations、actions 等层次的属性性节点进行逐一拆分与迁移，并且利用 export default 直接进行统一对象的模块暴露操作。

store/modules/counter.js

```js
// 原先state、getters、mutations、actions都是createStore方法中对象的属性节点
// 现在可以将它们进行单独的变量声明，这样可以更加清晰代码的层次与结构
// 设置状态state
const state = () => ({ count: 0 });
// 获取内容
const getters = {
  multiCount: (state) => {
    return state.count * 2;
  },
};
// 修改数据
const mutations = {
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
};
// 异步操作
const actions = {
  // 利用context中的commit方法将异步执行结果提交到mutations中修改数据
  asyncMultiIncrement: (context, payload) => {
    // context上下文对象中包含commit、dispatch、getters、rootGetters、rootState、state等方法与属性
    console.log(context);
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
};

// 将state、getters、mutations、actions进行统一对象的模块暴露
export default {
  state,
  getters,
  mutations,
  actions,
};
```

当前这一 counter 模块与 vuex 状态管理器并没有任何直接的关联，它只是单独的一个模块文件而已，所以需要在 store 目录下新建一个 index.js 程序文件，该程序文件的作用是创建 store 仓库的实现，并且将已经拆分好的 counter 子模块与 store 仓库实现对象建立起关联关系。

同样可以从 vuex 中引入 createStore 方法并且利用该方法实例 store 仓库对象，并且在 createStore 构建仓库实例时可以将引入的 counter 模块设置到 store 仓库的 modules 模块节点当中，这时就会在 store 这个顶层仓库对象下拆分出 counter 这一子模块内容。

```js
import { createStore } from 'vuex';
// 引入counter模块
import counter from './modules/counter';

// 利用createStore创建唯一的store仓库实例
const store = createStore({
  // 模块拆分
  modules: {
    // counter模块
    counter,
  },
});
// 暴露store仓库实例对象
export default store;
```

不过当前暴露出的 store 仓库实例对象与入口文件 main.js 中的 vue 实例是否有关联关系呢？暂时还没有，所以需要在 main.js 入口文件中将 store 仓库实例进行引入，并且利用 use(store)方式与 vue 实例进行集成关联，这样就可以在 vue 实例中找到 store 仓库对象内容。

main.js

```js {5-55}
import { createApp } from 'vue';
import store from '@/store';
import App from './App.vue';
// 将store以插件形式与vue项目进行衔接
createApp(App).use(store).mount('#app');
```

现在刷新应用并查看 vue 调试工具中的 vuex 面板则可以看到 Root 根级下面多出了 counter 的子层次节点，而 state 的状态值也已经被嵌入到了 counter 模块下，但是 getters 下的 multiCount 方法仍旧是在根级层次。

![image-20221119091743193](http://qn.chinavanes.com/qiniu_picGo/image-20221119091743193.png)

这时候查看 Chid2 组件中利用 state 直接获取状态值的方式仍旧从根级的 store.state 中取 count 值，那么将无法正常的获取，需要从根级的 counter 模块中获取 count 状态值才可以，至于 getters 为什么仍旧是成功的是因为 getters 的 multiCount 存在于根级节点没有改变。

components/Child2.vue

```vue {11-15}
<template>
  <div class="p-5">
    <h2>子组件2</h2>
    <!-- 因为设置了counter模块，所以count值需要从counter模块中进行获取 -->
    <p>Count：{{ store.state.counter.count }}</p>
    <!-- getters 的multiCount存在于根级节点没有改变，所以不需要修改 -->
    <p>doubleCount:{{ doubleCount }}</p>
  </div>
</template>
```

## 2)用户模块的添加

目前应用的 store 仓库中只包含 counter 一个模块，如何才能快速的增加其它模块呢？假若有一个用户模块，需要在该模块中进行接口数据的请求，并且页面上进行指定用户信息的显示，那么仓库模块又该如何操作。

首先，需要确认当前应用中是否已经安装 axios 第三方类库，如果没有则需要利用`npm install axios --save`进行模块安装。

然后，在 store 仓库的 modules 子目录下新建 users.js，这是 store 仓库下准备新增的用户模块，在该模块中同样可以设置 state、getters、mutations、actions 等仓库模块的属性对象，也需要进行 export default 的默认对象暴露操作。

```js
import axios from 'axios'; // 引入axios请求模块
const state = () => ({ user: {} });
const mutations = {
  // 修改用户信息
  changeUserById(state, payload) {
    state.user = payload;
  },
};
const actions = {
  // 根据指定参数获取用户信息
  async asyncGetUserById({ commit }, payload) {
    // 利用axios进行在线模拟数据用户接口的请求，并可以传递指定的payload参数，payload可以传递用户的id数值参数
    const result = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${payload}`
    );
    // 将axios请求返回的内容提交到mutation中以便实现对user状态值的修改操作
    commit('changeUserById', result.data);
  },
};

export default {
  state,
  mutations,
  actions,
};
```

在 store 目录的 index.js 中还需要将刚新增的 user 模块进行引入，并且需要添加到 modules 模块节点下，这样才能确保 store 仓库中新增了 users 这一子模块内容。

```js
import { createStore } from 'vuex';
// 引入counter模块
import counter from './modules/counter';
import users from './modules/users';

// 利用createStore创建唯一的store仓库实例
const store = createStore({
  // 模块拆分
  modules: {
    // counter模块
    counter,
    users,
  },
});

export default store;
```

接下来只需要修改 Child2.vue 子组件，因为在该组件中已经通过useStore进行了store对象的实例化，所以可以直接利用dispatch进行asyncGetUserById这一异步请求数据的action动作派发操作，还传递了id为1的参数内容。假若请求到了数据，那么可以利用 computed 进行用户对象数据的获取，需要注意的是 store 仓库下 state 状态值中还是需要先找到 users 这个模块才能最终确认 user 对象的存在。因为是异步请求，页面中建议对 user.id 先进行条件的判断，因为在请求没有成功返回的情况下还是不要显示指定的用户信息为好，不然的话页面也会出现错误信息。

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

// 直接派发触发user用户模块下的asyncGetUserById方法，并且传递指定的用户id参数
store.dispatch('asyncGetUserById', 1);
// 请求完毕以后利用computed计算属性获取users模块下的user对象
const user = computed(() => store.state.users.user);
</script>

<template>
  <div class="p-5">
    <h2>子组件2</h2>
    <!-- 直接渲染store仓库中的state状态值count -->
    <p>Count：{{ store.state.counter.count }}</p>
    <!-- 通过getters获取store仓库中的状态值multiCount -->
    <p>doubleCount:{{ doubleCount }}</p>

    <ol class="list-group" v-if="user.id">
      <li
        class="list-group-item d-flex justify-content-between align-items-start"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">{{ user.name }}</div>
          {{ user.website }}
        </div>
        <span class="badge bg-primary rounded-pill">
          {{ user.id }}
        </span>
      </li>
    </ol>
  </div>
</template>

```

![image-20221119092655678](http://qn.chinavanes.com/qiniu_picGo/image-20221119092655678.png)

## 3)vuex 的 modules 命名空间

vuex模块化拆分开发中还有一个重要的概念是namespaced命名空间。在一大城市，当一醉汉打车回家告诉司机他住万达广场的时候你知道会发生什么事吗？司机并不知道他住的到底是东城万达、西城万达、南城万达还是北城万达，所以为了用户至上的原则司机就将用户逐个万达送了一个遍。事实上现在的 vuex 仓库也已经遇到了这样的问题，因为当前的仓库已经分成了 counter 模块、users 模块，以后可能还会有 news 模块、product 模块、order 模块，而这些模块里可能会有同样名称的数据值，并且也可能会包含同样名称的操作方法，这时候会发生什么样的状况？为了确保司机能够准确的将用户送达指定的万达广场，那么就需要对目标进行唯一名称的设定，所以vuex的store仓库中还有一个重要的概念就是命名空间，它的工作就是给仓库模块设定唯一名称。

vuex仓库模块命名空间的操作处理非常的简单，只需要在store/modules/counter.js与users.js仓库模块文件在进行export default 模块暴露的时候添加一个`namespaced:true`的属性值即可，但这时候当前项目运行的结果将会报错。

```js
......

export default {
  namespaced: true, // 开启仓库模块的命名空间
  state,
  getters,
  mutations,
  actions,
};

```

对于仓库模块数据，将无法正常的渲染，对于action异步请求也会无法正常的调用，控制台中已经明确提示asyncGetUserById的这个action方法没有找到，所以更无法正常的触发mutations与修改state数据值了。

![image-20221119093027396](http://qn.chinavanes.com/qiniu_picGo/image-20221119093027396.png)

查看vue调试工具中的Vuex面板，则可以确认store仓库的各个模块中都已经添加上了namespaced的属性，而因为这一属性的添加将直接影响到原来所编写的所有页面与组件文件。

![image-20221116112957850](http://qn.chinavanes.com/qiniu_picGo/image-20221116112957850.png)

在Child2.vue子组件中，原来利用getters进行了状态值的直接获取处理，但添加namespaced命名空间以后，getters状态值的获取需要从指定命名空间下获取对应的状态值，而现在的命名空间名称就是counter，所以对应命名空间下的multiCount属性值就变成了counter/multiCount属性值获取方式。getters在调用时添加了命名空间的模块路径前缀，其实mutations、actions的提交与派发也是遵循类似原则，所以在Child2.vue、Grandsone.vue当中只需要将commit提交、dispatch派发操作时添加上命名空间的路径前缀即可。

components/Child2.vue

```vue
<script setup>
import { computed } from 'vue';
// 引入useStore这个vuex提供的hook钩子
import { useStore } from 'vuex';
// 获取当前store仓库实例
const store = useStore();
// 通过getters获取store仓库中的状态值multiCount
const doubleCount = computed(() => store.getters['counter/multiCount']);

// 直接派发触发user用户模块下的asyncGetUserById方法，并且传递指定的用户id参数
store.dispatch('users/asyncGetUserById', 1);
// 请求完毕以后利用computed计算属性获取users模块下的user对象
const user = computed(() => store.state.users.user);
</script>
```

Grandsone.vue

```vue
<script setup>
// 引入useStore这个vuex提供的hook钩子
import { useStore } from 'vuex';
// 获取当前store仓库实例，解构commit与dispatch方法
const { commit, dispatch } = useStore();
// 定义一个方法，用于提交mutation
const increment = () => {
  commit('counter/increment');
};
// 定义一个方法，用于派发action，传递数值参数
const multiIncrement = () => {
  dispatch('counter/asyncMultiIncrement', 5);
};
// 定义一个方法，用于派发action，传递对象参数，并且获取action返回的Promise结果
const asyncMultiDecrement = async () => {
  const result = await dispatch('counter/asyncMultiDecrement', {
    step: 5,
  });
  console.log(result);
};
</script>
```

因为添加namespaced命名空间属性会影响整个项目的代码书写方式，所以强烈建议在vuex仓库应用规划时先考虑好是否确认使用或不使用命名空间功能。

