# 08.组件通讯之 provide 与 inject

我们已经了解了很多父子、子父组件的通讯方式，接下来可以了解一下祖孙组件的通讯方式。假若我们想将祖组件App中的一些数据传递给孙级组件Grandson，但中间还多了一层子组件Child，那么这就产生了跨层次的祖孙传递模式。其实祖孙的层次并不受限制，可以跨域一层也可以跨域无限层，可以在祖组件中利用provide进行数据内容的提供，然后只需要在需要接收的孙级组件中利用inject进行数据的注入接收就可以了。

现在在App.vue组件中引入provide、ref与shallowRef等方法，并且设置count、state、msg等初始值，count是ref类型，state是shallowRef类型，而msg只是一个简单字符串并不是响应式的代理数据对象。可以在App组件的模板层对刚才所定义的数据进行插值渲染显示。

```vue
<script setup>
import { provide, ref, shallowRef } from "vue"
import Child from "./components/Child.vue"
const count = ref(0)
const state = shallowRef({ count: 0 })
provide("count", count) // count是ref数据类型
provide("state", state) // state是shallowRef数据类型
provide("msg", "你好，尚硅谷") // msg是普通数据类型
const increase = () => {
  count.value++
}
provide("increase", increase) // increase是方法
</script>

<template>
  <Child />
  <p>msg:{{ msg }}</p>
  <p>count:{{ count }}</p>
  <p>state.count:{{ state.count }}</p>
</template>

```

Child子组件没有任何特殊内容，只是引入并调用了一下孙级组件Grandson，不过Child子组件需要在App这个祖组件中进行引入并调用。

```vue
<template>
  <div>
    <h1>Child</h1>
    <Grandson />
  </div>
</template>

<script setup>
import Grandson from "./Grandson.vue"
</script>
```

在孙级组件Grandson中可以在引入inject方法以后利用它进行祖组件传递数据的注入操作，在尝试将普通数据msg、ref数据count以及shallowRef数据state进行inject注入以后尝试在模板部分进行渲染，结果会发现msg的信息内容并不能显示，并且控制台还会出现`Property "msg" was accessed during render but is not defined on instance`的警告错误，这是因为普通数据无法添加到实例对象上，所以孙组件无法实现渲染。而ref以及shallowRef等代理数据最终会被添加到实例对象上，所以在孙组件中可以进行正常渲染。

在孙组件接收到ref、shallowRef数据以后也可以尝试对其进行修改处理，最终发现ref响应式数据在孙组件中修改以后祖组件也会随之发生重绘渲染，那就意味着祖组件的数据也发生了变化。而由于shallowRef数据类型的特性，在孙组件中尝试对其数据进行修改，不管是孙组件还是祖组件都不会产生任何的重绘。

既然数据能够进行跨层传递，方法同样也是可以的，比如在祖组件中可以定义increase的方法并通过provide进行提供，在孙组件只需要同样使用inject进行方法注入也就可以直接调用了。

```vue
<template>
  <h2>Grandson</h2>
  <!-- 普通数据无法添加到实例对象上，所以孙组件无法实现渲染 -->
  <!-- Property "msg" was accessed during render but is not defined on instance -->
  <p>msg:{{ msg }}</p>
  <!-- 代理数据可以进行正常的渲染 -->
  <p>count:{{ count }}</p>
  <!-- shallowRef在进行属性值修改时不触发响应式界面重绘 -->
  <p>state.count:{{ state.count }}</p>
  <button @click="increaseCount">increaseCount</button>
  <button @click="updateStateCount">updateStateCount</button>
  <button @click="increase">increase</button>
</template>

<script setup>
import { inject } from "vue"
const msg = inject("msg") // 普通数据类型
const count = inject("count") // ref数据类型
const state = inject("state") // shallowRef数据类型
const increase = inject("increase") // 方法
const increaseCount = () => {
  count.value++ // 可以实现响应式修改与渲染
}
const updateStateCount = () => {
  state.value.count++ // shallowRef修改值的方式并不会触发界面渲染
}
</script>
```

