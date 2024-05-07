# 14.内置组件之 Teleport

Teleport是瞬间移动穿梭的意思，在vue当中Teleport内置组件可以将组件中的一部分元素穿梭到指定的目标元素上。

我们都知道vue所有组件都被包含在App这一根组件下，而在入口文件main.js中在引入App这一根组件以后会将其挂载于#app网页元素上，那就意味着vue项目的所有组件元素都会被包含于#app网页元素中。但假若页面中有一个模态框，它需要显示于网页的最顶层，那么这个模态框的元素如果直接包含于body节点与#app网页元素处于同级别并列关系其控制结果就会变得更简单，所以这时候就可以使用Teleport这一具有穿梭功能的内置组件。

假若App组件中将引入一个GlobalAlert具有弹出框的子组件：

```vue
<template>
  <GlobalAlert />
</template>

<script setup>
import GlobalAlert from "./components/GlobalAlert.vue"
</script>

<style>
#app {
  text-align: center;
  background: #2c3e50;
  padding-top: 60px;
  height: 100vh;
}
</style>
```

在GlobalAlert子组件中拥有控制框态框的按钮以及带有动画效果的模态框两部分内容。按钮的显示仍旧会被包裹于#app元素中，这一操作与之前所有的过程没有任何的区别。但是带有动画效果的模态框弹出层则希望被挂载于body网页的标签中与#app元素成同级并列关系，这样的话模态框将更容易控制到页面的最上层。所以在Teleport瞬移穿梭组件中设置to属性，而to的属性值就是瞬移穿梭的目标，也就是body。现在运行程序并点击打开模态框按钮，则会发现在页面最上层显示了一个模态框，可以利用调试工具中的Elements审查元素，则可以清楚确认#app与模态框的元素是并列关系，模态框的div处于页面的最顶层body下。

```vue
<script setup>
import { ref } from "vue"
const isOpen = ref(false) // 控制是否显示模态框
const isTeleport = ref(false) // 控制是否禁用 Teleport
</script>

<template>
  <!-- 按钮部分将被嵌套于#app元素当中 -->
  <button @click="isOpen = !isOpen">
    {{ isOpen ? "关闭" : "打开" }}模态框
  </button>
  <button @click="isTeleport = !isTeleport">
    {{ isTeleport ? "禁用" : "非禁用" }}穿梭功能
  </button>
  <!-- 利用Teleport内置组件将其包裹的元素穿梭到body标签内 -->
  <Teleport to="body" :disabled="isTeleport">
    <!-- 动画效果增强视觉 -->
    <Transition mode="in-out">
      <!-- 利用v-if控制模态框的显示与隐藏 -->
      <div v-if="isOpen" class="modal">
        <p>元素被穿梭到Body，与#app的div元素属并列关系</p>
        <!-- 按钮点击控制模态框的隐藏显示 -->
        <button class="close" type="button" @click="isOpen = false">
          关闭
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  isolation: isolate;
  z-index: 1;
  top: 2rem;
  left: 2rem;
  width: 20rem;
  border: 1px solid grey;
  padding: 0.5rem;
  border-radius: 1rem;
  background-color: grey;
  box-shadow: 2px 2px 4px grey;
  backdrop-filter: blur(4px);
  color: #f4f4f4;
}
button {
  padding: 0.5rem;
  border: 0;
  border-radius: 1rem;
  box-shadow: inset 0 -1px 4px grey, 1px 1px 4px grey;
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out;
}
button:hover {
  box-shadow: inset 0 -1px 2px grey, 1px 1px 2px grey;
}
.close {
  display: block;
  margin-left: auto;
}
/* 在没有设置name时可以设置统一的动画样式类名，以v-xxx方式命名 */
.v-enter-active,
.v-leave-active {
  transition: all 0.25s ease-in-out;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(-10vw);
}
</style>

```

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221026111932532.png" alt="image-20221026111932532" style="zoom:50%;" />

Teleport组件还有disabled的属性，利用该属性可以确认是否禁用瞬移穿梭功能，如果disabled为true，则穿梭功能将被禁用，否则可以使用。禁用状态下Teleport组件内元素仍旧保持不穿梭状态的元素位置。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221026112219717.png" alt="image-20221026112219717" style="zoom:50%;" />
