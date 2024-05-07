# 11.内置组件之 Component

有关组件的技术点除了组件之间的结构与通讯还有一个非常重要的方面是 vue 所提供的内置组件的应用，接下来我们就将 vue3 所提供的一些常用内置组件进行详细的介绍。

首先是 Component，这一内置组件提供了动态组件加载的功能，它可以将自定义组件在 Component 内置组件占位点进行指定目标的渲染，页面当中常见的 Tabs 选项卡效果利用动态组件加载功能可以非常轻松的实现。

假若项目目录 components 下有 Comp1.vue、Comp2.vue、Comp3.vue 等三个基础组件文件，内容结构也非常简单，只是一个字符串的显示而已。

```vue
<template>
  <h1>Comp 1</h1>
</template>
```

那么在 App.vue 父组件想要引入并在页面上渲染显示子组件，但想要的效果只是显示其中一个子组件，只有在点击切换按钮以后才在指定位置显示目标子组件。

可以声明一个 ref 的响应式数据 tab，该数据将会动态改变成指定的组件对象。然后定义一个切换组件函数 changeTab，会将组件本身 comp 当成参数进行传递，而且需要利用 markRaw 对 comp 进行声明，这是将 tab 的值设置为非代理对象，其目的是为了不对组件进行递归响应式数据代理操作以便增强性能(markRaw 函数作用可以参考之前章节中 markRaw 内容)。在页面初始化时可以拿组件 Comp1 作为默认显示对象进行 changeTab 方法的调用处理。

那么在模板块只需要利用`<component :is="tab"></component>`即可实现 Comp1、Comp2、Comp3 的动态显示，利用的是 component 这个内置组件的 is 属性，强调的是渲染的目标对象，因为默认利用 changeTab 显示 Comp1，所以只有新增不同的 button 按钮来点击调用 changeTab 才能实现 Comp2、Comp3 等其它组件的动态切换。

```vue
<template>
  <button @click="changeTab(Comp1)">ChangeComp1</button>
  <button @click="changeTab(Comp2)">ChangeComp2</button>
  <button @click="changeTab(Comp3)">ChangeComp3</button>
  <component :is="tab"></component>
</template>
<script setup>
import Comp1 from './components/Comp1.vue';
import Comp2 from './components/Comp2.vue';
import Comp3 from './components/Comp3.vue';
import { ref, markRaw } from 'vue';
// 设置需要切换的目标
const tab = ref(null);
// 定义切换组件函数，将组件本身当成参数传递
function changeTab(comp) {
  // 将tab的值设置为非代理对象
  // 这是为了不对组件进行递归响应式数据代理操作以便增强性能
  tab.value = markRaw(comp);
}
// 默认切换显示组件1
changeTab(Comp1);
</script>
```
