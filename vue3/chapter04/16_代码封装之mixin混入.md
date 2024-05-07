# 16.代码封装之mixin混入

Mixin代码混入是vue一种缩减代码的常用封装方式，因为在项目开发过程中经常会遇到相同或者类似的不同页面操作，比如新闻、产品、订单、物流等业务模块都会有信息的添加、修改、删除、查询等常规处理，只不过数据的内容不尽相同而已，但它们的add、update、delete、search对应的方法应该大同小异。如果说不采用合理的代码封装，那么以后的每个模块都会陷入机械的复制粘贴过程，而且后期代码的可维护性也将会极大的降低。

Mixin混入可以将每个组件页面公共代码进行抽离，通过混入不同的页面将会填充Mixin所编写的公共代码，但如果某一具体页面有其特殊性，那么可以进行该组件私有操作的单独设置，而在Mixin混入时则会以组件单独设置的代码为更高优先级。

在Vue3中只有在组合API中可以进行本地Mixin混入处理在组合API中是无法实现本地Mixin混入操作的，但是和directive指令一样，也可以利用app.mixin实现全局混入的设置。

假若利用component动态组件加载实现Comp1、Comp2两个组件的切换，而Comp1与Comp2中都有一个相同的需求，那就是需要获取当前鼠标在页面中点击时的坐标位置。

```vue
<template>
  <button @click="changeTab(Comp1)">ChangeComp1</button>
  <button @click="changeTab(Comp2)">ChangeComp2</button>
  <component :is="tab"></component>
</template>
<script setup>
import Comp1 from "./components/Comp1.vue"
import Comp2 from "./components/Comp2.vue"
import { ref, markRaw } from "vue"
const tab = ref(null)
function changeTab(comp) {
  tab.value = markRaw(comp)
}
changeTab(Comp1)
</script>
```

只不过Comp2组件在页面初始化时与Comp1不同，它的x与y初始坐标并不是0，而是另一个值，比如20。对于此种情况一般的开发人员会将Comp1组件直接复制粘贴成一个Comp2组件，然后将x、y数据初始化设置为20就解决当前需求，但假若需求发生变化，还有Comp3、Comp4......需要逐步扩展的话那又应该如何？

```vue
<template>
  <div>
    <p>x坐标:{{ x }}</p>
    <p>y坐标:{{ y }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0
    }
  },
  methods: {
    clickPosition(event) {
      this.x = event.pageX
      this.y = event.pageY
    }
  },
  // 在挂载后
  mounted() {
    // 延时3秒后进行点击事件监听
    setTimeout(() => {
      document.addEventListener("click", this.clickPosition)
    }, 3000)
  },
  // 在卸载前, 解绑监听
  beforeUnmount() {
    document.removeEventListener("click", this.clickPosition)
  }
}
</script>

```

我们可以尝试在src目录下创建一个mixins目录，然后新建clickPositionMixin.js程序文件，可以直接将Comp1中的`export default{...}`中的代码内容进行直接迁移，尝试将它设置为一个公共的mixin混入代码块。

现在在Comp1中只需要进行import引入，然后利用mixins进行本地组件中代码混入操作即可，mixins设置的是一个数组，说明混入代码可以设置多个。

```vue
<template>
  <div>
    <!-- 因为clickPositionMixin的混入，所以x、y、clickPosition、mounted、beforeUnmount等内容全部支持 -->
    <p>x坐标:{{ x }}</p>
    <p>y坐标:{{ y }}</p>
  </div>
</template>

<script>
// 引入混入代码
import clickPositionMixin from "../mixins/clickPositionMixin"
export default {
  // 将clickPositionMixin进行混入操作
  mixins: [clickPositionMixin]
}
</script>

```

因为Comp2中的x、y初始值要为20，所以在Comp2中除了引入设置clickPositionMixin还可以再次初始化count值，这样在clickPositionMixin中有一x、y初始值在当前组件中仍旧有一x、y初始值，在两者代码进行混入操作时则会以当前组件的x、y初始值为优先处理，所以Comp2页面显示的时候会显示x、y初始值为20，至于其它操作一切照常。

```vue
<script>
import clickPositionMixin from "../mixins/clickPositionMixin"
export default {
  mixins: [clickPositionMixin],
  data() {
    return {
      x: 20,
      y: 20
    }
  }
}
</script>
```

除了在组件内进行本地局部注册mixin混入其实还可以利用app.mixin进行全局的混入代码设置，可以在main.js入口文件中同样引入clickPositionMixin，然后只需要利用app.mixin进行混入代码设置即可：

```js
import { createApp } from "vue"
import App from "./App.vue"
import clickPositionMixin from "./mixins/clickPositionMixin"

const app = createApp(App)
app.mixin(clickPositionMixin)
app.mount("#app")
```

因为已经在全局进行clickPositionMixin代码的混入，那么Comp1、Comp2中可以将import引入clickPositionMixin的操作与mixins的设置都去除，只留下基础代码内容。

```vue
<template>
  <div>
    <p>x坐标:{{ x }}</p>
    <p>y坐标:{{ y }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      x: 20,
      y: 20
    }
  }
}
</script>

```

