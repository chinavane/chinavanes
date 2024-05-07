# 15.内置组件之 Suspense

Suspense可以帮助我们处理异步组件，允许我们协调整个应用程序的加载状态，包括所有深度嵌套的组件。

我们可以先查看下图所示的组件显示效果：在根级组件中嵌套包含了子组件，而且子组件的嵌套层次很多属于深度嵌套结构。每个子组件中都有异步操作所以加载该子组件都需要花费一定的时长。那么普通的组件加载过程是否属于“爆米花”模式，所有子组件初始的时候就是一块加入爆米花筒，然后每个组件就像一颗一颗爆米花十分凌乱的爆出。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221026121109072.png" alt="image-20221026121109072" style="zoom: 33%;" />

测试这一普通的异步嵌套组件加载过程可以在App根组件中引入并使用子组件BeforeSuspense，因为是异步嵌套组件，所以每次BeforeSuspense组件调用时可以给其设定异步延时时间time，而组件的嵌套显示可以利用父子组件的插槽技术实现。

```vue
<template>
  <button @click="reload">刷新页面</button>
  <BeforeSuspense :time="3000">
    <BeforeSuspense :time="2000" />
    <BeforeSuspense :time="1000">
      <BeforeSuspense :time="500" />
      <BeforeSuspense :time="4000" />
    </BeforeSuspense>
  </BeforeSuspense>
</template>

<script setup>
import BeforeSuspense from "./components/BeforeSuspense.vue"
const reload = () => {
  window.location.reload()
}
</script>

<style>
html {
  background: slategray;
}
</style>
```

所以BeforeSuspense中除了设置一个loading状态值还设置了`<slot/>`插槽的显示，而slot插槽将渲染父组件中嵌套的BeforeSuspense子组件内容。子组件里通过defineProps进行属性接收，接收时利用的是复杂对象操作模式，所以可以设置默认值，当前是2000毫秒也就是2秒。不过需要注意的是，如果利用解构的方式将属性进行重新变量的声明，那么解构声明的变量将不再有响应式功能，只不过现在解构的time时间仅仅是用来做定时器时间设置所以不需要响应式功能。所以在组件中可以利用setTimeout延时来模拟异步，在指定时间内控制loading这一响应式数据，而在模板层则利用loading这一布尔值进行Spinner子组件的显示。

```vue
<template>
  <!-- 模拟异步组件，显示Spinner指示子组件 -->
  <div class="async-component" :class="!loading && 'loaded'">
    <Spinner v-if="loading" />
    <!-- 利用slot插槽实现组件的嵌套内容显示 -->
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue"
import Spinner from "./Spinner.vue"

const loading = ref(true)
// 对属性进行解构声明会丢失响应式
const { time } = defineProps({
  time: {
    type: Number,
    default: 2000
  }
})
// 根据 time 值来决定是否显示 loading，time只是时间值不需要响应式
setTimeout(() => (loading.value = false), time)
</script>

<style scoped>
.async-component {
  border: 1px solid rgb(200, 200, 200);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 32px;
  margin: 20px;
}

.loaded {
  background: rgba(0, 255, 100, 0.3);
  border-color: rgb(0, 255, 100);
}
</style>

```

至于Spinner子组件只是为了添加具有动画效果的加载状态指示器，它的内容主要利用样式进行控制：

```vue
<template>
  <!-- 带动画效果的Spinner指示器 -->
  <div class="loader"></div>
</template>

<style scoped>
.loader,
.loader:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}
.loader {
  width: 40px;
  height: 40px;
}
.loader {
  margin: 20px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

```

现在运行程序就出现了“爆米花”模式的组件加载显示状态。所有组件在页面打开的时候都显示Spinner加载指示器，而500毫秒的BeforeSuspense子组件先异步操作完毕然后显示加载成功的结果，接下来1000、2000、3000、4000毫秒的BeforeSuspense子组件逐个异步操作完毕并显示加载成功以后的结果。或许有些读者认为这种操作模式也能够接收，但在一定情况下这种场景对用户体验感受并不十分理想，特别是这所有嵌套子组件应该作为一个整体看待的时候。

内置组件Suspense就可以帮助我们达到异步嵌套组件作为整体进行加载显示操作的这一目标。Suspense主要有两个插槽：`#default` 和 `#fallback`。两个插槽都只允许一个直接子节点。如果组件没有渲染完毕将会先渲染显示`#fallback`插件中的内容，如果最终异步嵌套组件加载完成，则将显示`#default`插槽中的内容。

所以在App组件中直接引入了Spinner加载指示器子组件并且在Suspense的`#fallback`插槽中进行使用，至于原来的BeforeSuspense子组件全部替换成了现在的WithSuspense，WithSuspense的调用方式和属性与之前的BeforeSuspense没有任何的差异，只不过现在的WithSuspense可以被嵌套于Suspense的`#default`插槽当中。

```vue
<template>
  <button @click="reload">刷新页面</button>
  <Suspense>
    <template #default>
      <WithSuspense :time="2000">
        <WithSuspense :time="1500" />
        <WithSuspense :time="1200">
          <WithSuspense :time="1000" />
          <WithSuspense :time="5000" />
        </WithSuspense>
      </WithSuspense>
    </template>

    <template #fallback>
      <Spinner />
    </template>
  </Suspense>
</template>

<script setup>
import WithSuspense from "./components/WithSuspense.vue"
import Spinner from "./components/Spinner.vue"
const reload = () => {
  window.location.reload()
}
</script>

<style>
html {
  background: slategray;
}
</style>

```

WithSuspense子组件中不再需要Spinner加载指示器显示，可以利用Promise来模拟异步组件加载，我们可以在setup与setTimeout中进行`console.log("Mounting " + time)`与`console.log("Resolving " + time)`打印测试确认组件加载时间与异步操作时间。

```vue
<template>
  <div class="async-component loaded">
    <!-- 不再需要Spinner加载指示器显示 -->
    <slot />
  </div>
</template>

<script setup>
// 对属性进行解构声明会丢失响应式
const { time } = defineProps({
  time: {
    type: Number,
    required: true
  }
})

console.log("Mounting " + time)

// 模拟异步组件加载
await new Promise((resolve) => {
  setTimeout(() => {
    console.log("Resolving " + time)
    resolve()
  }, time)
})
</script>
```

现在运行项目可以看到界面中显示了加载指示器Spinner，因为需要等待WithSuspense所有的嵌套异步组件的加载，在未完成情况下渲染了`#fallback`的插槽内容，而控制台也可以清晰查看到解析与加载的时间内容。当然，最后在所有嵌套异步组件都加载完毕以后，Suspense组件将提供`#default`插槽内容的渲染显示。

![image-20221026142217553](http://qn.chinavanes.com/qiniu_picGo/image-20221026142217553.png)
