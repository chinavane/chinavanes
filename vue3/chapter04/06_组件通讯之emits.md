# 06.组件通讯之 emits

父子之间的关系除了父与子的通讯还会存在逆向的子与父之间的交互，可以利用自定义事件 emits 来实现。在子组件HelloWorld.vue中可以放置一个按钮，点击按钮想要通知父组件进行一个方法的调用那么可以给按钮绑定一个点击事件click，然后直接利用$emit进行从下向上的事件发射操作。$emit方法的第一个参数是自定义事件的名称，后面的参数则是通过事件想要附带传递的参数。当前我们确立的自定义事件名称为increaseParentCount，而参数则是一个数值2。

```vue
<template>
  <div>
    <button @click="$emit('increaseParentCount', 2)">直接触发自定义事件</button>
  </div>
</template>
```

有传递就需要有接收，父组件中如何知道子组件对父组件发射了什么事件呢？可以通过v-on来进行事件的监听。在引入组件并进行组件调用以后可以在调用的组件上进行自定义事件名称的监听` <HelloWorld @increaseParentCount="increase" />`，所以当前父组件监听的事件就是子组件通过$emit发射到父组件的事件名称。监听到自定义事件以后可以处理什么事情呢，可以进行一个后续的回调处理，所以当前设置了一个回调方法increase，在回调函数中可以通过设置参数来对应子组件中自定义事件发射时所传递的参数，所以当前设置了一个step步长，那么在increase方法中就可以对定义的响应式数据count进行步长模式的累加操作。

```vue
<script setup>
import { ref } from "vue"
import HelloWorld from "./components/HelloWorld.vue"
const count = ref(0)
const increase = (step) => {
  count.value += step
}
</script>

<template>
  <HelloWorld @increaseParentCount="increase" />
  <p>count:{{ count }}</p>
</template>
```

现在子组件中的自定义事件是直接编写在模板部分，利用$emit实现。但如果想在script脚本部分进行自定义事件的触发又应该如何呢？可以利用defineEmits进行自定义事件的声明。defineEmits的参数是一个字符串数组，每个字符串都是一个事件的名称，说明可以声明任意数量的自定义事件，最终将声明的内容赋值给一个变量，可以命名为emits，然后利用emits这个变量来触发自定义的事件并随之传递参数。对于父组件来讲，不管子组件的自定义事件是通过模板部分的$emit来传递还是通过script部分的defineEmits来触发都是一样的，所以父组件的内容不需要做任何的修改。

```vue
<template>
  <div>
    <button @click="$emit('increaseParentCount', 2)">直接触发自定义事件</button>
    <button @click="increase">通过脚本触发自定义事件</button>
  </div>
</template>

<script setup>
// defineEmits是一个字符串数组，每个字符串是一个事件的名称
const emits = defineEmits(["increaseParentCount"])
const increase = () => {
  emits("increaseParentCount", 2)
}
</script>
```

