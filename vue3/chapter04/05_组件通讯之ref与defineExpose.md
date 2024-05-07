# 05.组件通讯之 ref 与 defineExpose

父与子组件之间除了 props 属性操作还有其它什么方式可以控制？之前章节曾提及 ref 元素标识的功能，利用 vue 的 ref 可以给元素设置一个标识，并且利用设置的标识找到该元素。那么 ref 是否能够作用于组件呢？这样的话就可以在父组件中通过 ref 的方法找到子组件，而如果找到组件以后就可以考虑控制子组件的数据以及子组件的方法。

我们可以将子组件 HelloWorld.vue 进行修改，设置一个名为 count 的 ref 响应式数据，并且利用 increase 方法对其进行递增累加操作。

```vue
<template>
  <div>
    <p>count:{{ count }}</p>
    <button @click="increase">increase</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
const increase = () => {
  count.value++;
};
</script>
```

那么在 App.vue 这一父组件中进行 HelloWorld 子组件调用的时候，可以给组件进行 ref 标识的设置。但是当我们利用 console.log 将 refCount 对象进行打印的时候在输出的结果中并没有任何子组件数据与方法的内容显示。如果进行`console.log(refCount.value)`打印则可以确认输出的是 null 空内容。

```vue
<script setup>
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const refCount = ref(null);
console.log(refCount);
</script>

<template>
  <HelloWorld ref="refCount" />
</template>
```

那么父组件是否能够获取到子组件的数据与方法？其实是可以的，只不过需要得到子组件的许可与确认。需要修改子组件 HelloWorld.vue，将 count 与 increase 利用 defineExpose 进行暴露，这样父组件才能查看与操控子组件允许他人操作的内容。

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
const increase = () => {
  count.value++;
};

// 允许其他组件使用当前组件的count与increase
defineExpose({
  count,
  increase,
});
</script>
```

在子组件将数据与方法进行暴露以后，父组件中利用 ref 找到子组件以后就可以查看到子组件中暴露的数据与方法内容。我们可以尝试编写两个函数 increaseChildCount 与 invokeChildIncrease 对子组件的响应式数据进行直接修改或者直接调用子组件中的方法，其结果也能够正常执行，说明父组件与子组件成功实现了交互通信。

```vue
<script setup>
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const refCount = ref(null);

// 利用ref找到子组件并控制子组件的count响应式数据
const increaseChildCount = () => {
  refCount.value.count++;
};

// 利用ref找到子组件并控制子组件的increase方法的调用
const invokeChildIncrease = () => {
  refCount.value.increase();
};
</script>

<template>
  <HelloWorld ref="refCount" />
  <button @click="increaseChildCount">increaseChildCount</button>
  <button @click="invokeChildIncrease">invokeChildIncrease</button>
</template>
```
