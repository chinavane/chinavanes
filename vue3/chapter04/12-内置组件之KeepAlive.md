# 12.内置组件之 KeepAlive

vue 为动态加载的组件提供了一种性能优化的方案就是缓存组件，可以利用内置组件 KeepAlive 实现。常见的组件加载时组件会经历组件的初始、加载、更新、销毁等生命周期过程，但是像动态组件加载操作案例一样频繁的切换组件显示会不断的重复组件的初始、加载、销毁等生命周期过程，而这一过程其实是程序不断读取与释放内存的过程，因此不断重复频繁处理将会极大影响内存开销从而影响项目的性能。对于一些常用组件是否可以考虑将其暂存于内存当中不做释放处理呢？如果暂时不用就先将其放置一边，稍后再用则从内存中直接取出，这样就省却了组件创建与销毁等更耗费内存的操作处理过程。所以 vue 就提供了 KeepAlive 内置组件来实现这一目标。

想要实现缓存组件只需要利用 KeepAlive 将 Component 动态组件进行包裹即可，但是如何才能确认缓存组件的运行需要对子组件进行生命周期的添加才能够感受结果。

```vue
<template>
  <button @click="changeTab(Comp1)">ChangeComp1</button>
  <button @click="changeTab(Comp2)">ChangeComp2</button>
  <button @click="changeTab(Comp3)">ChangeComp3</button>
  <keep-alive>
    <component :is="tab"></component>
  </keep-alive>
</template>
```

我们可以组 Comp1、Comp2、Comp3 添加生命周期钩子函数并输出对应的字符串进行输出测试，结果当前运行程序会发现从 Comp1 切换至 Comp2 的时候两个组件的生命周期都只是执行了挂载的 onBeforeMount、onMounted 两个钩子函数，而当前已经离开了 Comp1，那么 Comp1 中的 onBeforeUnmount、onUnmounted 钩子函数并没有触发，说明当前的组件已经被缓存了。

```vue
<template>
  <h1>Comp 1</h1>
</template>

<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
} from 'vue';

onBeforeMount(() => {
  console.log('Comp1 onBeforeMount');
});

onMounted(() => {
  console.log('Comp1 onMounted');
});

onBeforeUpdate(() => {
  console.log('Comp1 onBeforeUpdate');
});

onUpdated(() => {
  console.log('Comp1 onUpdated');
});

onBeforeUnmount(() => {
  console.log('Comp1 onBeforeUnmount');
});

onUnmounted(() => {
  console.log('Comp1 onUnmounted');
});

// 新添加的生命周期钩子函数，在KeepAlive使用的时候才触发
// 组件激活时触发
onActivated(() => {
  console.log('Comp1 onActivated');
});
// 组件失活时触发
onDeactivated(() => {
  console.log('Comp1 onDeactivated');
});
</script>
```

![image-20221026091827709](http://qn.chinavanes.com/qiniu_picGo/image-20221026091827709.png)我们可以尝试引入两个新的生命周期钩子函数 onActivated、onDeactivated 来进一步确认缓存组存的运行结果。当添加这两个生命周期并进行字符串打印以后，初始 Comp1 组件时触发的是三个钩子函数而不再是之前的两个钩子函数，现在还触发了 onActivated 组件激活状态的钩子函数。

![image-20221026092342921](http://qn.chinavanes.com/qiniu_picGo/image-20221026092342921.png)

离开 Comp1 切换到 Comp2 的时候确实没有触发 onBeforeUnmount 与 onUnmounted 钩子函数，而是触发了组件失活的 onDeactivated 钩子函数，说明 Comp1 组件已经被暂存于内存中，并没有从内存中销毁。对应 Comp2，其实过程也是一致的。

![image-20221026092524314](http://qn.chinavanes.com/qiniu_picGo/image-20221026092524314.png)

到目前为止，利用 KeepAlive 内置组件将会对所有动态加载的组件都进行缓存组件化的操作，如果缓存组件的内容很多其实也会给内存带来一定的压力，因为内存的存储空间是一定的是受限的，所以是否能够控制指定的目标组件进行缓存，对于不需要缓存的组件并不进行内存的暂存处理。所以，KeepAlive 提供了 include 与 exclude 这两个属性。include 是包含，确认哪些组件进行缓存处理，而 exclude 则是排除，排除哪些组件进行暂存处理。它们都有字符串、正则与数组这几种设置的方式。

不过，目前可能遇到一个问题，虽然 KeepAlive 有 include 与 exclude 属性，但是包含谁？排除谁？我们是否知晓？现在有 Comp1、Comp2、Comp3，如何让 include 与 exclude 明确其包含与排除的目标，这就需要配合组件的 name 名称来实现。

在 vue3 中`<script setup>`的脚本部分因为应用了组合 API 所以并没有提供给组件设置 name 名称的功能，所以如果想要给组件设置名称可以在组件中再添加一个`<script>`并且利用选项 API 的方式给其添加 name 属性，比如可以给 Comp1、Comp2、Comp3 组件添加如下代码：

```vue
<script>
export default {
  name: 'Comp1',
};
</script>
```

当我们利用 vue 调试工具确认当前项目运行状态的时候就可以明确 KeepAlive 的 include、exclude 都是 undefined 未定义，所以可以准备给其进行对应组件名称的设置。

![image-20221026094007800](http://qn.chinavanes.com/qiniu_picGo/image-20221026094007800.png)

假若给 KeepAlive 进行 include 属性的设置可以利用字符串、正则、数组几种模式，而通常情况下数组操作模式最为方便与容易理解。

```vue
<!-- 字符串模式 -->
<keep-alive include="Comp1,Comp2">
	<component :is="tab"></component>
</keep-alive>
```

```vue
<!-- 正则模式 -->
<keep-alive :include="/Comp1|Comp2/">
	<component :is="tab"></component>
</keep-alive>
```

```vue
<!-- 数组模式 -->
<keep-alive :include="['Comp1', 'Comp2']">
	<component :is="tab"></component>
</keep-alive>
```

我们在运行项目的时候可以通过 Console 控制台打输出的方式进行 Comp3 组件是否有被缓存的确认，也可以通过 Vue 调试工具来明确 Comp3 是否被缓存，显然生命周期没有触发 onActivated 等生命周期钩子函数，而 Vue 调试工具的 Comp3 也没有 inactive 的状态显示，所以 Comp3 是没有被组件缓存的。

相信了解了 include 属性设置，exclude 的操作模式都是一致的，也能够轻松掌握。

![image-20221026094613654](http://qn.chinavanes.com/qiniu_picGo/image-20221026094613654.png)

![image-20221026094551819](http://qn.chinavanes.com/qiniu_picGo/image-20221026094551819.png)

其实 KeepAlive 还有一个属性是 max，它可以限制缓存组件的最大数量，比如可以给 max 设置 5，那么内存中缓存组件最大的数量就只有 5 个。不过，需要注意的是 max 的算法并不是将最先加入缓存的组件进行清除，而是遵循 LRU(least recently used 最近最少使用)算法模式。比如有[Comp1、Comp2、Comp3、Comp4、Comp5]个组件已经被缓存，现在有 Comp6 需要加入缓存，但因为 max 设置为 5，所以并不是将 Comp1 数组中的第一个进行清除，而是要根据 LRU 算法进行计算，比如 Comp1 使用了 3 次，Comp2 使用了 2 次，Comp3 使用了 5 次，Comp4 使用了 1 次，Comp5 使用了 8 次，那么这时候会将 Comp4 只使用了 1 次的组件进行清除，并将 Comp6 加入到缓存当中。

在vue中还有之前已经介绍过的动画相关内置组件`<Transition>`与`<TransitionGroup>`等，配合动态组件Component与缓存组件KeepAlive仍旧可以实现动画效果的应用。

可以在项目根目录的index.html中引入animate.css动画类库`<link href="https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet">`，然后直接在App组件中调用`<Transition>`动画内置组件即可实现动画效果的展现。

```vue
<template>
  <button @click="changeTab(Comp1)">ChangeComp1</button>
  <button @click="changeTab(Comp2)">ChangeComp2</button>
  <button @click="changeTab(Comp3)">ChangeComp3</button>
  <transition
    enter-active-class="animate__animated animate__tada"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <keep-alive :include="['Comp1', 'Comp2']">
      <component :is="tab"></component>
    </keep-alive>
  </transition>
</template>
```

