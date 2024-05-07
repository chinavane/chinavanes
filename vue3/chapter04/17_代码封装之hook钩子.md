# 17.代码封装之hook钩子

在vue3中mixin代码混入的方式其实并不是非常推荐的代码封装方式，因为在vue3中可能会建议使用可维护性更高的组合API而不是使用传统的选项API，那么在组合API中又不支持mixin代码混入方式，所以可以了解一下vue3里组合API的hook钩子代码封装方法。

还是实现mixin代码混入的操作功能，只不过我们利用vue3的组合API实现，可以利用如下代码实现：

```vue
<template>
  <div>
    <p>x坐标:{{ x }}</p>
    <p>y坐标:{{ y }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const x = ref(0)
const y = ref(0)

const clickPosition = (event) => {
  x.value = event.pageX;
  y.value = event.pageY;
};

// 在挂载后
onMounted(() => {
  // 给页面绑定点击监听, 收集坐标
  setTimeout(()=>{
    document.addEventListener("click", clickPosition);
  },3000)
});

// 在卸载前, 解绑监听
onBeforeUnmount(() => {
  document.removeEventListener("click", clickPosition);
});
</script>

```

如果不想将Comp1的代码直接复制粘贴成Comp2，再去修改x、y的初始值，那么可以考虑在src下创建hooks目录，并且新建clickPositionHook.js程序文件。

我们可以将Comp1中的逻辑脚本进行迁移，像ref、onMounted、onBeforeUnmount等对象的引入仍旧不变，但是setup中的代码内容可以利用函数化封装的方式进行模块化的默认暴露，因为Comp1与Comp2的x、y初始值可能变化，所以可以利用函数传参的方式进行x、y的ref初始值设值操作。

因为是将setup部分的代码进行函数化的hook封装，所以最终需要将x、y等结果值进行return函数化的返回处理。

```js
import { ref, onMounted, onBeforeUnmount } from "vue";
export default (initX = 0,initY=0) => {
  const x = ref(initX)
  const y = ref(initY)

  const clickPosition = (event) => {
    x.value = event.pageX;
    y.value = event.pageY;
  };

  // 在挂载后
  onMounted(() => {
    // 给页面绑定点击监听, 收集坐标
    setTimeout(()=>{
      document.addEventListener("click", clickPosition);
    },3000)
  });

  // 在卸载前, 解绑监听
  onBeforeUnmount(() => {
    document.removeEventListener("click", clickPosition);
  });

  return { x,y }
}

```

现在我们在Comp2中可以引入clickPositionHook，而引入的clickPositionHook对象是一个函数，那么就可以进行该函数的调用操作，如果需要传递x、y初始值，那么可以直接传递，如果想用hook里initX、initY初始值，则不需要在调用时传递参数，最终调用的结果可以通过解构的方式将x、y等内容进行返回。

```vue
<template>
  <div>
    <p>x坐标:{{ x }}</p>
    <p>y坐标:{{ y }}</p>
  </div>
</template>

<script setup>
import clickPositionHook from "../hooks/clickPositionHook"
const { x,y } = clickPositionHook(20)
</script>
```

