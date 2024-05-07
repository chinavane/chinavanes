# 07.组件通讯之 attrs

父子、子父组件的通讯除了 props、ref、defineProps、emits 之外还有 attrs 可以实现批量非 props 属性以及原生和自定义事件的传递操作。

在 App 父组件中可以引入并调用子组件 HelloWorld，并且设置 props 属性 msg 以及非 props 属性 value 与 style，从父组件属性设置与传递上来看并不能区分 props 与非 props 属性，需要在子组件中进行区分。除了设置与传递属性还给 HelloWorld 子组件进行了原生事件 change 的监听以及自定义事件 customClick 事件的监听，那么在子组件中如何实现属性与事件的获取与使用呢？

```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue';
const changeHandler = () => {
  console.log('changeHandler', event);
};
const customClickHandler = (msg) => {
  console.log('customClickHandler: ', msg);
};
</script>

<template>
  <!--
    msg：定义props属性
    value、style：非props属性
    change：原生事件
    customClick：自定义事件
  -->
  <HelloWorld
    msg="你好，尚硅谷"
    value="尚硅谷欢迎你"
    style="color: red"
    @change="changeHandler"
    @customClick="customClickHandler"
  />
</template>
```

在 HelloWorld 子组件中仍旧可以通过 defineProps 进行 props 属性的接收处理。但是，对于 value、style、change 与 customClick 等属性事件，在引入 useAttrs 方法并进行调用实例化以后可以得到非 props 的 msg 属性之外的所有属性与事件内容。所以，如果设置一个 input 输入框并通过 v-bind 进行$attrs属性绑定操作，则可以确认input绑定的属性内容是除了msg之外的所有属性值。至于props属性在子组件中可以单独使用，而对于自定义事件虽然被绑定在input框中，但并不会起作用，所以可以尝试设置一个button按钮然后利用$emit 进行 customClick 自定义事件的发射与参数传递处理，而父组件中已经进行了对应的监听与回调所以结果也能够正常输出。

```vue
<template>
  <div>
    <input v-bind="$attrs" />
    <p>{{ props.msg }}</p>
    <button @click="$emit('customClick', '自定义事件')">
      自定义事件的触发
    </button>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue';
const props = defineProps(['msg']);
const attrs = useAttrs();
console.log('props: ', props);
console.log('attrs: ', attrs);
</script>
```

当前运行程序会发现，子组件中的 props 属性只有 msg，而非 props 属性包括了 value、style、onChange、onCustomClick 等，在 input 输入框输入内容并失去焦点以后会触发原生绑定的 change 事件，而在 change 事件中还可以输出 event 原生事件对象。点击按钮则会触发$emit 设置的 customClick 事件对象，并且输出自定义事件传递的参数。

![image-20221025094856884](http://qn.chinavanes.com/qiniu_picGo/image-20221025094856884.png)

不过需要注意界面的样式，除了 input 框的 value 值已经变成了红色说明 style 的字体效果起作用之外 p 标签的字体也呈现红色，这是因为默认情况下子组件的根元素会自动添加父组件传递过来的非 props 属性，而子组件的子元素是“透传”绑定。

![image-20221025094924738](http://qn.chinavanes.com/qiniu_picGo/image-20221025094924738.png)

如果不想子组件的根元素受传递的非 props 属性所影响，可以在 HelloWorld 子组件中添加新的 script 脚本，将 inheritAttrs 继承属性内容设置为 false，再刷新页面的时候子组件根元素的样式控制将会清除。

```vue
<script>
export default {
  inheritAttrs: false,
};
</script>
```
