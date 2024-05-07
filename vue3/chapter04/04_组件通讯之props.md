# 04.组件通讯之 props

## 1.组件关系

在组件样式控制操作时候产生了一个组件嵌套的结果，在App父组件中嵌套了HelloWorld子组件，这就意味着vue的组件是可以进行嵌套处理的。那么随之延伸出来的就有嵌套是否存在层级关系，嵌套组件之间是否会产生相互的沟通与信息传递，嵌套的结构关系主要划分等一系列问题。

vue组件之间能够实现嵌套的结果是十分明显了，并且因为嵌套的层次与结构将会产生如下几种主要的嵌套模式：

- 父与子关系模式

  在App中嵌套了HelloWorld子组件，那么相对于HelloWorld这一子组件而言App就是它的父组件，所以父子关系的模式是从上到下的模式。

<img src="http://qn.chinavanes.com/qiniu_picGo/%E7%BB%84%E4%BB%B6%E9%80%9A%E8%AE%AF-%E7%AC%AC%201%20%E9%A1%B5.png" alt="组件通讯-第 1 页" style="zoom:50%;" />

- 子与父关系模式

  那么分析App父组件与HelloWorld子组件的关系，换一个视角从HelloWorld子组件的立场来看App，那么就变成了子与父的从下到上的模式。

  <img src="http://qn.chinavanes.com/qiniu_picGo/%E7%BB%84%E4%BB%B6%E9%80%9A%E8%AE%AF-%E7%AC%AC%202%20%E9%A1%B5.png" alt="组件通讯-第 2 页" style="zoom:50%;" />

- 祖孙关系模式

  父下会有子，而子又会再包含子，但父与孩子的孩子之间的关系就转成了祖孙关系，并且除了祖与孙还会存在祖与曾孙，祖与玄孙等更深层级的关系，但只要超过了父子，就算是孙、曾孙、玄孙是不是都可以简化为祖孙之间的关系模式呢，我想答案是确定的。

  <img src="http://qn.chinavanes.com/qiniu_picGo/%E7%BB%84%E4%BB%B6%E9%80%9A%E8%AE%AF-%E7%AC%AC%203%20%E9%A1%B5.png" alt="组件通讯-第 3 页" style="zoom:50%;" />

- 非父子关系模式

  当然父组件可能会包含一个子组件，也可能会有多个子组件，而子组件中仍旧可能会存在孙、曾孙、玄孙等更深嵌套子组件，那么从横向视角来看，子2与子1、子2与孙1、孙2与曾孙1等关系就成了更为复杂的跨越父与子、祖与孙单向顺序的非父子关系模式了。

  <img src="http://qn.chinavanes.com/qiniu_picGo/%E7%BB%84%E4%BB%B6%E9%80%9A%E8%AE%AF-%E7%AC%AC%204%20%E9%A1%B5-1.png" alt="组件通讯-第 4 页-1" style="zoom:50%;" />

## 2.父与子通讯之props

### 1)简单数组接收模式

父与子这种从上到下的关系模式数据是如何进行通信交互的呢？可以通过props属性传递的方式实现。而从父组件的设置与传递属性到子组件的接收与使用属性，对于属性操作的这一过程主要划分成4个部分。我们可以尝试在App这一父组件中在进行HelloWorld子组件调用的时候进行相应的属性设置与传递操作。比如给HelloWorld子组件设置msg与count两个属性，并且给msg属性传递值`你好，尚硅谷`，给count属性传递值`0`。

```vue
<script setup>
import HelloWorld from "./components/HelloWorld.vue"
</script>

<template>
  <HelloWorld msg="你好，尚硅谷！" count="0" />
</template>
```

那么在子组件中想要使用msg与count这两个父组件设置传递的属性则需要先行接收，可以利用defineProps实现属性的接收处理，因为是多个属性所以defineProps在接收的时候可以利用数组进行属性接收的确认。

既然接收到属性，那么在模板部分可以直接使用接收到的属性值，比如利用插值进行渲染或者对属性进行累加处理等。不过现在对于count属性值进行increase累加处理是直接在模板中进行操作，而在以往过程中我们通常是编写increase方法对响应式数据进行处理，如果现在在子组件中也需要创建increase方法，并且想对count进行累加，那么又应该如何实现呢？

```vue
<template>
  <div>
    <p>{{ msg }}</p>
    <p>count:{{ count }}</p>
    <button @click="count++">count++</button>
  </div>
</template>

<script setup>
defineProps(["msg", "count"])
</script>
```

如果直接定义increase方法，并且想对count进行累加操作，按以往的方式使用`count.value++`处理则会报`'count' is not defined`的错误提示。

```vue
<template>
  <div>
    <p>{{ msg }}</p>
    <p>count:{{ count }}</p>
    <button @click="count++">count++</button>
    <button @click="increase">increase</button>
  </div>
</template>

<script setup>
defineProps(["msg", "count"])
const increase = () => {
  count.value++
}
</script>
```

或许我们可以考虑将defineProps接收到的属性声明成一个变量对象，比如props，然手利用对象属性的方式进行获取与操作，但运行的结果却会报`Set operation on key "count" failed: target is readonly`的警告错误。

```vue
<script setup>
const props = defineProps(["msg", "count"])
const increase = () => {
  props.count++
}
</script>

```

那么在script脚本中是否无法操作defineProps接收到的数据了呢？其实可以通过中转的方式来实现。比如在子组件中声明一个ref响应式数据update，而它的初始值则为defineProps接收到的count属性值，利用的是`props.count`进行使用处理，那么在increase函数中可以直接对`update.value++`进行累加处理，并且在模板中进行update响应式数据的渲染与累加控制。

```vue
<template>
  <div>
    <p>{{ msg }}</p>
    <p>count:{{ count }}</p>
    <p>update:{{ update }}</p>
    <button @click="count++">count++</button>
    <button @click="increase">increase</button>
  </div>
</template>

<script setup>
import { ref } from "vue"
const props = defineProps(["msg", "count"])
const update = ref(props.count)
const increase = () => {
  update.value++
}
</script>
```

也许有读者觉得count属性值为0看不出`props.count`的应用效果，可以尝试将子组件调用时的count属性传递值进行其它初始状态值的修改，比如`<HelloWorld msg="你好，尚硅谷！" count="8" />`，这样可以确认update的初始值显示也变成了8。

### 2)简单对象接收模式

如果只是用简单数组进行属性的接收，其实对于属性的数据类型是无法判别的。细心的读者会发现，在进行HelloWorld子组件调用的时候count的属性值设置与传递似乎与msg的属性值设置传递没有任何的区别。但显然msg应该是字符串数据类型，是否意味着count也是字符串数据类型了？但count值不应该是数值型的数据类型吗？程序在运行的时候却没有任何的提示、警告或者报错呢。

现在可以修改子组件中的defineProps属性接收方式，将其修改为简单对象模式，确认一下会产生什么样的影响。

```js
// 简单数组接收属性方式
// const props = defineProps(["msg", "count"])
// 简单对象接收属性方式
const props = defineProps({
  msg: String,
  count: Number
})
```

因为属性count在设置的时候与属性msg没有任何差异，现在子组件在进行接收的时候已经限制count属性应该为Number数据类型，结果之前的count属性设置与传递的都是字符串，所以子组件对于属性进行了数据类型的检测工作，并且给以了警告提示，希望得到的是数值类型的8，但实际拿到的却是字符串类型的8，看起来运行结果没有变化，但数据类型不对应的代码其实是会存在一定的隐患。当我们在父组件中对子组件传递的count属性进行修改以后则可以解决该问题，只需要利用v-bind对count值进行绑定处理`<HelloWorld msg="你好，尚硅谷！" :count="8" />`。

![image-20221024142044338](http://qn.chinavanes.com/qiniu_picGo/image-20221024142044338.png)

### 3)复杂对象接收模式

简单数组仅能实现属性接收无法进行数据类型约束，而简单对象不光可以进行属性接收还能进行数据类型的约束，但功能是否足够？假若父组件中在进行子组件调用并进行属性设置的时候遗忘了count属性值的设置`<HelloWorld msg="你好，尚硅谷！"/>`，而在子组件中又进行了count属性值的接收与使用，这时候运行程序则会得到NaN界面的结果显示，控制台则不报错，但其运行结果与预期结果显然不一致。

我想可以利用defineProps复杂对象接收模式进行程序的优化处理，将count设置为对象类型，而对象的属性值主要包括type类型、default默认值、required是否必须传递、validator自定义校验规则四个部分组成。

虽然父组件在调用HelloWorld子组件时并没有设置与传递count属性，但是在子组件中利用复杂对象的接收方式设置了count的数据类型与初始值以及是否必填等属性，那么界面中显示的结果并不会出错，能够与预期达成一致。只不过控制台中还会出现`[Vue warn]: Missing required prop: "count"`的警告错误提示，这是因为count的属性在接收的时候限制其required必填为真。

```js
// 复杂对象接收属性方式
const props = defineProps({
  msg: String,
  count: {
    type: Number, // 约束数据类型
    default: 8, // 设置默认值
    required: true, // 是否必须传递
    validator: (val) => val > 0 && val < 3 // 自定义校验规则
  }
})
```

如果在HelloWorld子组件调用时设置回count属性，并且初始值为8，运行程序在控制台中则会出现无效属性的警告错误显示，因为我们设置了自定义校验规则，要求count属性值是大于0且小于3的值范围，而当前是8显然不在此范围内，但程序的运行仍旧能够执行，并不会产生中断结果。

![image-20221024143529184](http://qn.chinavanes.com/qiniu_picGo/image-20221024143529184.png)

这是因为defineProps属性接收是运行时环境，不是开发编辑的静态检测环境起效，所以它只是出现警告并不会报错，因为最终vue代码编译转化成js，而js对于类型检测是比较薄弱的。
