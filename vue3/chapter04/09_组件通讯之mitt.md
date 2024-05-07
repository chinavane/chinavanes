# 09.组件通讯之mitt

非父子之间的通讯依托vue3本身已经不容易实现，需要利用第三方类库支持，比如mitt。所以需要在当前项目中先利用`npm install mitt --save`进行依赖模块的安装。而对于mitt则可以通过https://github.com/developit/mitt项目地址查看其使用方法。其实它主要有all、on、emit、off几个方法，可以利用emit进行自定义事件的发射，利用on进行自定义事件的监听，利用off进行自定义事件的取消监听以及利用all进行所有事件的clear清除操作等。

假若在App根级组件中有两个子组件Child1与Child2，我们并不想通过父组件App进行中间衔接来实现两个子组件之间进行通讯，而是希望直接在两个子组件之间进行通讯，这其实就是非父子之间的通讯，因为两个子组件之间的关系属兄弟组件。

那么App组件只是进行了两个子组件的引入与使用，没有任何属性传递操作与事件监听处理。

```vue
<script setup>
import Child1 from "./components/Child1.vue"
import Child2 from "./components/Child2.vue"
</script>
<template>
  <Child1 />
  <Child2 />
</template>
```

因为已经安装了mitt模块的依赖，所以可以考虑在src目录下创建servies目录，并在其中新建emitter.js程序文件，该程序文件中只需要引入mitt，实例化并暴露mitt对象即可。

```js
import mitt from "mitt"
export default mitt()
```

在子组件1中我们会声明一个ref响应式数据count，但是在当前组件中仅实现渲染显示，触发改变的任务将交由子组件2来完成。

```vue
<template>
  <div>
    <h1>Child1</h1>
    <p>count:{{ count }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
const count = ref(0)
</script>
```

所以子组件2需要触发改变的按钮以及按钮绑定的方法，可以在子组件2中引入emitter事件总线对象，在触发count改变的方法里利用emitter这个mitt实例对象中的emit方法进行事件发射操作，而事件的名称定义为increaseCount，事件的参数设置为2，这一过程有些像之前介绍的自定义事件。

```vue
<template>
  <div>
    <h1>Child2</h1>
    <button @click="increase">increase</button>
  </div>
</template>

<script setup>
import emitter from "../servies/emitter" // 引入事件总线
// 在组件内部，发布事件
const increase = () => {
  emitter.emit("increaseCount", 2)
}
</script>
```

既然子组件2有事件的发射，那么子组件1中则需要有事件的监听，所以同样可以引入emitter事件对象，并且在onMounted挂载完成的生命周期钩子函数中进行on的事件监听操作，监听的事件名称就是increaseCount，在监听到以后可以进行回调函数的执行，当前设置的是increaseCountCallback回调函数。在该函数中可以接收到increaseCount自定义事件传递过来的参数，并且利用它进行count值的步长模式累计增长。我们一般会在组件卸载前对已经监听的事件进行取消监听的操作，所以可以在onBeforeUnmount的生命周期钩子函数中进行emitter的off方法调用，取消的就是increaseCount的事件名称。

```vue
<template>
  <div>
    <h1>Child1</h1>
    <p>count:{{ count }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import emitter from "../servies/emitter" // 引入事件总线
const count = ref(0)
// 订阅事件的回调函数，接收事件参数并进行使用
const increaseCountCallback = (step) => {
  count.value += step
}
// 在组件挂载时，订阅事件
onMounted(() => {
  emitter.on("increaseCount", increaseCountCallback)
})
// 在组件卸载时，取消订阅事件
onBeforeUnmount(() => {
  emitter.off("increaseCount", increaseCountCallback)
})
</script>
```

现在运行程序，就可以利用子组件2中的按钮来修改子组件1中的count值，轻松的实现了非父子组件的通讯。但这种通讯方式在组件数量越来越多，组件之间的通讯需求也越来越多的情况下，所有的代码都会分散在不同的组件中，那么组件的通讯关系就会变得越来越凌乱与繁杂，甚至形成蜘蛛网状态的结构，所以管理其来并不方便，那时候则可以考虑以后介绍的vuex以及pinia进行场景方案的解决。