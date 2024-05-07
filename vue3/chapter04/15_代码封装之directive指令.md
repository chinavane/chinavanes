# 15.代码封装之directive指令

在vue中代码的封装方式有很多，从简单到复杂的封装主要包括有：函数function、类class、模块module、组件component、过滤器filter、指令directive、混入mixin、钩子hook、插件plugin、类库library、框架framework等，有一些封装方式是存在于vue2中，有一些封装方式在vue3里已经取消，有一些方式可以在选项API中应用还有一些封装方式只能在组合API中操作，下面我们就将vue常见代码封装方式作一简要说明。

函数function：这一封装方式应该无需多说，methods、computed、watch等内容不管是选项API还是组合API中都有其函数的声明类型，不过需要注意的是函数封装中的一些基本概念，主要有：命名函数、匿名函数、普通函数、箭头函数、回调函数、函数形参、函数实参、剩余参数、参数默认值等等。

类class：其实Vue从本质上看就是构造函数，也就是一个类，当我们在进行实例化操作的时候就可以感受到Vue类的操作模式。对于类来讲主要的一些内容涉及到：类的声明、类的实例化、类的继承、类的普通方法、类的构造函数、静态属性、静态方式等等。

模块module：现在项目中的开发其实都属于模块化开发模式，对于模块化开发主要可以利用模块定义、模块暴露、模块引入、模块使用等四个词进行囊括，对于变量、函数、类、组件等众多的内容都可以进行模块化的声明，然后可以利用export default等模块暴露方式进行对外暴露操作，以便其它的模块可以进行import模块引入以后实现模块调用操作，不过当前项目主要使用的是ES的模块化开发。

组件component：vue组件的封装在之前案例中已经演示了很多，而component主要分成了template模板、script逻辑脚本与style组件样式等三大部分，在组件中可以利用export default进行暴露操作，而在组件里可以import引入其它子组件进行子组件模块的调用处理，所以函数、类、模块、组件等代码的封装也是可以进行整合的。

过滤器filter：在vue2中是存在过滤器filter的封装方式的，可以利用`|`管道符进行调用，但在vue3中filter过滤器的方式可以直接利用methods等方式进行代替，所以不再单独支持此种代码封装方式了。

指令directive：vue提供了15个内置指令，比如v-show、v-if、v-else、v-else-if、v-for、v-on、v-bind、v-model、v-text、v-html、v-pre、v-once、v-memo、v-cloak、v-slot等，这些内置指令都是vue这一框架中官方已经封装好的指令，而现在我们强调的则是开发人员可以进行自定义的指令。

自定义指令主要包括created、beforeMount、mounted、beforeUpdate、updated、beforeUnmount、unmounted等钩子函数，这些钩子函数与vue的生命周期钩子函数十分的相似，除了没有beforeCreate，其它常用的7个钩子函数保持了名称的一致性。而自定义指定的钩子函数都有相同的参数内容，主要包括元素el、数据绑定对象binding、虚拟DOM对象vnode以及旧虚拟DOM对象prevVnode等。

对于钩子函数的参数主要使用目标操作元素el与数据绑定对象binding，而binding中主要有参数arg、修饰符modifiers、数据值value几个内容。

如果想要利用自定义指令实现一个霓虹灯闪烁功能，则可以进行app.directive全局指令注册或者在选项API中利用directives进行局部自定义指令的注册操作。注意参数arg与自定义指令间是用冒号分隔，而修饰符modifiers则是用点号连接，至于值value则是利用等号进行设置处理。

当我们获取到元素、参数、修饰符与值等内容以后就完全可以实现各种不同条件的判断与处理，实现既定的操作目标。

在main.js入口文件中，使用app.directive设置highlight自定义指令名称，第二个参数则可以设置一个对象，而对象中则包括之前提及的自定义指令的钩子函数，而在函数中将主要使用el与binding这两个参数。

```js
import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)
app.directive("highlight", {
  // 自定义指令的mounted钩子函数
  mounted(el, binding) {
    let delay = 0 // 利用binding.modifiers获取delayed修饰符值进行判断 // 如果有此修饰符，则将delay值设置为3000
    if (binding.modifiers.delayed) {
      delay = 3000
    } // 利用binding.modifiers获取blink修饰符值进行判断 // 如果有此修饰符，则进行闪烁效果
    if (binding.modifiers.blink) {
      // 利用binding.value获取主颜色以及次颜色
      let mainColor = binding.value.mainColor
      let secondColor = binding.value.secondColor // 设置当前颜色先为主色
      let currentColor = mainColor // 设置延时定时器
      setTimeout(() => {
        // 设置闪烁定时器
        setInterval(() => {
          // 三元运算确认当前颜色
          currentColor == secondColor
            ? (currentColor = mainColor)
            : (currentColor = secondColor)
          if (binding.arg === "background") {
            // 背景
            el.style.backgroundColor = currentColor
          } else {
            // 字体
            el.style.color = currentColor
          }
        }, binding.value.delay) // 闪烁间隔时间
      }, delay) // 延迟3秒
    } else {
      // 没有blink修饰符，则直接设置颜色
      setTimeout(() => {
        // 利用binding.arg获取background参数值进行判断
        if (binding.arg === "background") {
          // 背景颜色设置
          el.style.backgroundColor = binding.value.mainColor
        } else {
          // 字体颜色设置
          el.style.color = binding.value.mainColor
        }
      }, delay) // 延迟3秒
    }
  }
})
app.mount("#app")
```

在注册好全局指令以后，调用是异常简单的，在项目的任何一个组件中只需要利用v-highlight就可以调用当前定义的高亮霓虹灯效果指令，在延时3秒以后将会产生红绿背景颜色的切换效果，每次切换时间是500毫秒。

```vue
<template>
  <!-- background为钩子函数中binding里的arg参数 -->
  <!-- delayed与blink为钩子函数中binding里的modifiers修饰符内容 -->
  <!-- {mainColor:'red',secondColor:'green',delay:500}为钩子函数中binding里的value值内容 -->
  <p v-highlight:background.delayed.blink="{ mainColor: 'red', secondColor: 'green', delay: 500 }">
    自定义指令的调用
  </p>
</template>

```

