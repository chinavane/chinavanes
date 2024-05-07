# 05.Refs 对象类型的 TypeScript 支撑

## 1)网页元素的 Refs

我们可以给 HTML 元素以及自定义组件进行 ref 属性设置，并利用 ref 响应式数据操作模式可以快速的找到指定的 HTML 元素与自定义组件对象，从而进一步的对获取的内容进行控制，那么对于获取的对象又应该如何获得 TypeScript 的支撑呢？

现在想在 HelloWorld.vue 组件中放置一个 input 输入框，仅仅想在页面加载完成对其完成 focus 光标聚焦操作，那么又应该如何实现？

只需要在组件 template 模板部分中添加一个 input 输入框，并且给其添加 ref 属性，将其设置为 ipt。然后在逻辑脚本部分设置一个 ref 对象，并且在生命周期 onMounted 的时候想要对 ipt 框进行 focus 光标聚焦操作。当输入 ipt.value 内容的时候编辑器并不会提示任何信息的内容，并且进行强制 focus 聚焦操作时则会提示`类型“never”上不存在属性“focus”。`的错误警告信息。

src/components/HelloWorld.vue

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const ipt = ref(null);
onMounted(() => {
  // 在生命周期onMounted的时候想要对ipt框进行光标聚焦
  ipt.value?.focus();
});
</script>

<template>
  <input ref="ipt" />
</template>
```

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220529182333337.png" alt="image-20220529182333337" style="zoom:50%;" />

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220529182142317.png" alt="image-20220529182142317" style="zoom:50%;" />

因为提示信息中显示有 any 的数据类型，或者可以给 ref 对象设置 any 类型，虽然这时候代码将不再提示任何的错误，但 ipt.value 对象仍旧不会显示可以操作的方法内容的提示，因为显式设置对象类型为 any，所以没有提示操作也是必然。

src/components/HelloWorld.vue

```vue {5}
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const ipt = ref<any>(null);
onMounted(() => {
  ipt.value?.focus();
});
</script>

<template>
  <input ref="ipt" />
</template>
```

然而，只有指定的 HTML 的元素才会有 focus 这样的方法内容，不是吗？那么是否能够明确 ipt 的数据类型为定向的类型呢？在 TypeScript 部分有提及针对于 DOM 元素其实包含了很多的内置对象，似乎可以进行尝试查找。

将光标放置于元素 input 对象上，可以查看到一定的信息内容，可以点击并查看一下 MDN Reference，并会跳转到 input 这一 HTML 元素的帮助文档地址，

![image-20220529183310171](http://qn.chinavanes.com/qiniu_picGo/image-20220529183310171.png)

在文档中可以确认其 DOM 接口的类型是[`HTMLInputElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement)，那么就可以利用这一接口类型给当前的 ref 设置明确的内置对象类型。

![image-20220529183520694](http://qn.chinavanes.com/qiniu_picGo/image-20220529183520694.png)

现在将 ref 的数据类型设置为 HTMLInputElement 与 null 的联合数据类型以后，程序没有任何的问题，但却因为明确了操作对象的数据类型以后，在进行 ipt.value 代码输入的时候就已经有明确的提示信息，因为只有 HTMLOrSVGElement 的元素才会有 focus 的聚焦方法。

src/components/HelloWorld.vue

```vue {3,5}
<script setup lang="ts">
import { ref, onMounted } from 'vue';
const ipt = ref<HTMLInputElement | null>(null);
onMounted(() => {
  ipt.value?.focus();
});
</script>

<template>
  <input ref="ipt" />
</template>
```

![image-20220529183851885](http://qn.chinavanes.com/qiniu_picGo/image-20220529183851885.png)

## 2)自定义组件的 Refs

除了可以给 HTML 元素设置 ref，vue 也支持对自定义组件进行 ref 的设置，目的同样是更为方便的找到组件对象以便进行后续操作。现在有一需求是想要在父组件中对子组件进行显示与隐藏的切换控制，那么前提就是需要在父组件中找到子组件这个对象才可以。

对于子组件，可以利用一个布尔值进行一个 modal 模态框的 div 对象设置，目前结合 Teleport 穿梭瞬移知识点将其最终绑定在 body 元素而不是 app 这一元素节点上。除了设置了 ipt 这一 HTMLInputElement 网页元素，还添加了 toggleModal 的布尔值以及 toggle 这一方法，不过想让父组件调用 toggle 方法需要利用 defineExpose 将方法进行对外暴露操作。现在子组件的准备工作一切就续，就等父组件进行查找与方法调用。

src/components/HelloWorld.vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
// 设置input输入框ref对象
const ipt = ref<HTMLInputElement | null>(null);
// 切换框态框布尔值
const toggleModal = ref<boolean>(false);
// 切换框态框方法
const toggle = () => {
  // 将值取反
  toggleModal.value = !toggleModal.value;
  // 如果模态框显示的时候，设置input输入框的焦点
  if (toggleModal.value) {
    ipt.value?.focus();
  }
};
// 向外暴露toggle切换方法
defineExpose({
  toggle,
});
</script>

<template>
  <!-- 利用穿梭移动将modal框态框绑定到body元素上 -->
  <Teleport to="body">
    <div v-if="toggleModal" class="modal">
      这是一个模态框
      <input ref="ipt" />
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  background: #f5f5f5;
  width: 300px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
}
</style>
```

现在在父组件 App.vue 中添加一个 button 按钮，准备点击按钮进行子组件模态框的显示切换。所以给 HelloWorld 这一子组件同样设置了 ref 名称，其属性值为 helloWorldModal。所以在脚本部分也像 HTML 元素操作一样创建了对应的 ref 数据对象 helloWorldModal，在定义 toggleHellWorldModal 这个方法的时候会发现 helloWorldModal.value 进行 toggle 方法调用的时候出现了语法错误警告`类型“never”上不存在属性“toggle”。`这一错误提示与之前的 HTML 元素操作的错误提示如出一辙，想来主要的原因仍旧是没有给对象明确对应的数据类型。

src/App.vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const helloWorldModal = ref(null);
const toggleHellWorldModal = () => {
  helloWorldModal.value?.toggle();
};
</script>

<template>
  <button @click="toggleHellWorldModal">切换</button>
  <HelloWorld ref="helloWorldModal" />
</template>
```

![image-20220529190612763](http://qn.chinavanes.com/qiniu_picGo/image-20220529190612763.png)

但是当我们将鼠标放置于 HelloWorld 组件上时显示的提示信息则是 DefineComponent 等内容，其中确实有 toggle 等内容，但似乎对明确组件的数据类型没有任何的帮助，因为当前引入的HelloWorld子组件其本质应该是一个组件的实例对象。

![image-20220529190740523](http://qn.chinavanes.com/qiniu_picGo/image-20220529190740523.png)

所以是否可以考虑可以利用TypeScript的InstanceType进行类型判断，因为在 TypeScript 中创建动态类时，`InstanceType`可以用于检索动态实例的类型。所以在利用ref进行组件对象设置时可以尝试利用泛型与InstanceType的结合判断目标类型是否为HelloWorld的组件类型，在确认数据类型以后toggle切换的函数就不再报错，因为该函数确实是在HelloWorld的实例对象当中。而且在进行代码输入的时候就会有代码提示可以进行toggle方法的选择。

src/App.vue

```vue {4}
<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const helloWorldModal = ref<InstanceType<typeof HelloWorld> | null>(null);
const toggleHellWorldModal = () => {
  helloWorldModal.value?.toggle();
};
</script>
vue
<template>
  <button @click="toggleHellWorldModal">切换</button>
  <HelloWorld ref="helloWorldModal" />
</template>

```

![image-20220529191259298](http://qn.chinavanes.com/qiniu_picGo/image-20220529191259298.png)

如果你强行想调一个并不存在的方法，这时候则会提示组件对象上并不存在对应的属性的错误提示。

![image-20220529191718346](http://qn.chinavanes.com/qiniu_picGo/image-20220529191718346.png)

不过目前运行项目，虽然可以进行按钮的点击切换模态框的显示，但是input中并没有进行光标聚焦的功能。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220529191402630.png" alt="image-20220529191402630" style="zoom:50%;" />

产生这一问题的原因是子组件HelloWorld中的toggleModal数据是一个响应式对象，它在进行响应式变化时需要一定的时间，而当前逻辑是在该值进行切换以后直接进行input框的focus聚焦操作，显然focus聚焦是需要DOM渲染完毕才能正常操作的功能，所以在响应式数据改变以后并没有及时的完成DOM渲染，所以focus目标也无法实现。所以，现在需要考虑利用nextTick在等待toggleModal数据变化完以后先确认DOM已经再次渲染完毕，然后再进行focus聚焦操作。

src/components/HelloWorld.vue

```vue {2,8,11}
<script setup lang="ts">
import { ref, nextTick } from 'vue';
// 设置input输入框ref对象
const ipt = ref<HTMLInputElement | null>(null);
// 切换框态框布尔值
const toggleModal = ref<boolean>(false);
// 切换框态框方法
const toggle = async () => {
  // 将值取反
  toggleModal.value = !toggleModal.value;
  await nextTick(); // 等待DOM更新完毕
  // 如果模态框显示的时候，设置input输入框的焦点
  if (toggleModal.value) {
    ipt.value?.focus();
  }
};
// 向外暴露toggle切换方法
defineExpose({
  toggle,
});
</script>

<template>
  <!-- 利用穿梭移动将modal框态框绑定到body元素上 -->
  <Teleport to="body">
    <div v-if="toggleModal" class="modal">
      这是一个模态框
      <input ref="ipt" />
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  background: #f5f5f5;
  width: 300px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
}
</style>

```

现在模态框与input光标聚焦功能已经完毕，这一切都基于Refs与TypeScript的支撑。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220529192511517.png" alt="image-20220529192511517" style="zoom:50%;" />
