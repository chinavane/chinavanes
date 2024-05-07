# 09.pinia 多仓库应用

vuex 是有且只有一个 store 数据仓库，所以它利用多模块实现不同功能模块之间的划分。那么 pinia 是单仓库还是多仓库呢？pinia 可以利用 defineStore 实现不同的仓库模块的构建，它有些像 vuex 中的模块概念，比如说我们需要构建一个 users 的功能内容，那么可以先在 store 目录下新建 users.js 程序文件，并准备利用 defineStore 再定义一个新的仓库模块。

然后从 pinia 中引入 defineStore，state、getters、actions 的操作流程和之前的 counter 以及 vuex 中的 users 用户模块也都基本一致，所以可以在安装完 axios 模块以后在当前的用户模块中引入并进行请求使用。

store/users.js

```js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUsersStore = defineStore({
  id: 'users', // 仓库的唯一标识
  // 设置状态 state
  state: () => ({
    user: {},
  }),
  // 同异步修改数据 actions
  actions: {
    async asyncGetUserById(payload) {
      const result = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${payload}`
      );
      this.user = result.data;
    },
  },
});
```

既然已经定义了第 2 个数据仓库内容，那么可以在Child2.vue 组件中进行用户的获取与显示，这两个操作目标与 vuex 中用户的操作目标保持完全一致。

所以修改 Child2.vue 的组件内容，除了从 store/users 中引入 useUsersStore 这一仓库外，还需要从应用之前已经引入的 storeToRefs 函数，不过需要注意的是 actions 方法的引入不能够使用 storeToRefs，所以需要从仓库中另外分别引入，比如 asyncGetUserById 这个获取用户信息的方法。

在引入 asyncGetUserById 方法以后就可以直接调用该函数，当然也可以传递你所需要的参数内容。

现在的 pinia 项目中 Child2.vue 用户组件的 template 模块代码与 vuex 项目中的代码保持一致，并没有进行任何的修改，因为只要获取到对应的数据就可以进行数据的显示操作。

components/Child2.vue

```vue {1-15}
<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/store/counter';
import { useUsersStore } from '@/store/users';
// 利用storeToRefs将非响应式数据转成响应式数据
const { count, multiCount } = storeToRefs(useCounterStore());
// 利用storeToRefs将非响应式数据转成响应式数据
const { user } = storeToRefs(useUsersStore());
// 对于actions方法的引入不能够使用storeToRefs，所以需要分别引入
const { asyncGetUserById } = useUsersStore();
// actions方法的调用并传递对应的参数
await asyncGetUserById(1);
</script>

<template>
  <div class="p-5">
    <h2>子组件2</h2>
    <p>Count：{{ count }}</p>
    <p>doubleCount:{{ multiCount }}</p>

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

运行项目会看到Child2组件并不能够进行成功的显示，需要考虑到Suspense挂起处理，得返回到它们的父组件App.vue中将Child2组件调用使用`<Suspense><child2></child2></Suspense>`进行包裹处理。

![image-20221119100159820](http://qn.chinavanes.com/qiniu_picGo/image-20221119100159820.png)

如此也能够进行pinia项目运行结果的正常显示了。

![image-20221119100401497](http://qn.chinavanes.com/qiniu_picGo/image-20221119100401497.png)
