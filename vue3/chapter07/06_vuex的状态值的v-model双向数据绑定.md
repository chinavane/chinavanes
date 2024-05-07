# 06.vuex 的状态值的 v-model 双向数据绑定

到目前为止项目中对于 store 仓库的状态值都仅仅是获取显示或者是操作修改，但是并没有对 state 状态值进行双向数据绑定的操作，那么对于 store 仓库中的 state 状态值在组件里是否能够进行双向数据绑定操作呢？

可以尝试修改 User2 组件，在页面中添加一个 input 输入框，想利用它来实现 count 值的双向数据绑定操作，但运行程序得到的结果并不理想，提示属性计算的值是只读的。其实computed属性计算的操作模式有两种，一种是函数式，也就是当前应用的模式，还有一种是对象式，可以进行get取值set设值操作，而函数式的computed属性计算实现的就对象式中的get取值操作并不具备set设值功能，所以程序提示属性计算是只读的也是情有可原。

Child2.vue

```vue {12,20}
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
// 获取counter模块下的count这一state状态值
const count = computed(() => store.state.counter.count);
</script>

<template>
  <div class="p-5">
    <h2>子组件2</h2>
    <!-- 直接渲染store仓库中的state状态值count -->
    <p>Count：{{ store.state.counter.count }}</p>
    <!-- 通过getters获取store仓库中的状态值multiCount -->
    <p>doubleCount:{{ doubleCount }}</p>
    <!-- 双向数据绑定count值 -->
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

![image-20221116120518595](http://qn.chinavanes.com/qiniu_picGo/image-20221116120518595.png)

既然computed的函数式不能满足v-model双向数据绑定操作，那么可以考虑它的对象式操作模式，利用get获取仓库中的状态值，再利用set进行状态值的修改操作，但修改方法是仓库模块中的mutations方法，因为只有store仓库中的mutations才是唯一修改store仓库状态值数据的地方。

```vue {12-20}
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
// 获取counter模块下的count这一state状态值
const count = computed({
  // 利用get获取仓库中的状态值
  get() {
    return store.state.counter.count;
  },
  // 利用set进行状态值的修改操作，但修改方法是仓库模块中的mutations方法
  set(val) {
    store.commit('counter/increment', val);
  },
});
</script>
```

现在运行应用程序，在“子组件2”的文本框中进行count值的修改操作，其它位置的count值也将随之发生改变，这样便实现了store仓库中state状态值在组件里v-model双向数据绑定的操作。

![image-20221119094353704](http://qn.chinavanes.com/qiniu_picGo/image-20221119094353704.png)
