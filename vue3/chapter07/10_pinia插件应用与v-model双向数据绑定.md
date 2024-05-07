# 10.pinia 插件应用与 v-model 双向数据绑定

## 1)pinia 中使用第三方插件实现数据持久化

pinia 的 state 状态与 vuex 的状态值一样，目前刷新页面就恢复到了初始状态，那么是否也可以使用插件进行数据持久化的操作呢？在 github.com 中可以找到 pinia 数据持久化的插件 pinia-plugin-persistedstate，它的地址是：https://github.com/prazdevs/pinia-plugin-persistedstate。

在项目中进行模块安装以后就可以直接使用该插件，只需要在 main.js 入口文件中引入插件，然后在 pinia 实例创建以后利用 use 的方法进行插件的使用即可。

```bash
npm install pinia-plugin-persistedstate --save
```

main.js

```js {5-6,10-11}
import { createApp } from 'vue';
import App from './App.vue';
// 引入createPinia方法
import { createPinia } from 'pinia';
// 引入pinia数据持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 实例化pinia
const pinia = createPinia();
// 使用pinia数据持久化插件
pinia.use(piniaPluginPersistedstate);
// 将pinia与vue进行集成
createApp(App).use(pinia).mount('#app');
```

而且，pinia-plugin-persistedstate 这个插件同样可以对指定的仓库数据进行数据持久化处理，并没有强制将所有的数据内容进行持久化，可以在 store/users.js 中添加新的属性 persist，它是一个对象类型，可以设置指定的 key 值也可以设置 paths 数组，这一操作内容和 vuex 数据持久化插件操作仍旧一致，它将起到白名单的功效，现在只设置了 user，说明当前项目数据的持久化操作将只存储 users 用户模块下的 user 用户信息数据，其它数据内容都不会进行本地存储操作。显然，项目测试的结果也如预期一般。

store/users.js

```js {41-44}
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUsersStore = defineStore({
  id: 'users', // 仓库的唯一标识
  ......
  persist: {
    key: 'users-store',
    paths: ['user'],
  },
});
```

![image-20221119100504516](http://qn.chinavanes.com/qiniu_picGo/image-20221119100504516.png)

## 2)对于仓库数据的 v-model 双向数据绑定操作

利用 pinia 进行仓库状态值在组件中的 v-model 双向数据绑定操作确实比 vuex 的操作模式简单太多，vuex 中需要利用 computed 的 get、set 进行取值设置操作，现在我们不需要任何的处理，只需要对指定的状态值进行 v-model 双向数据绑定即可。

比如在 Child2.vue 组件中可以对 count 这个状态值进行双向数据绑定操作，当前也仅仅是添加了一个 input 设置了 v-model，刷新应用测试，在输入框中修改状态值以后 count 这个状态值也就发生了时时改变。

components/Child2.vue

```vue {13-14}
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
    <p>count值的双向数据绑定：<input v-model="count" /></p>
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
