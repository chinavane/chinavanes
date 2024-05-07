# 18.代码封装之plugin插件

插件是给Vue添加全局功能的代码封装方式，一个插件可以是拥有install()方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的应用实例和传递给app.use()的额外选项作为参数。自定义插件中可以注册全局组件、全局指令、全局混入以及全局方法等众多内容。

以下罗列了vue插件的两种定义的基础结构方式，一种对象式，一种函数式。对象式中有install方法，而函数式直接本身就是安装方法，两者都可以设置app应用实例与options插件参数选项等内容。

```js
// 插件定义第一种方式，对象式：拥有 install() 方法的对象
const myPlugin = {
  install(app, options) {
  }
}

// 插件定义第二种方式，函数式：安装函数本身
const myPlugin = function (app, options) {
}
```

我们首先利用app.config.globalProperties应用配置的全局属性添加一个全局函数globalMethod，函数可以传递一个参数，最终对全局函数的参数值进行小写转化的操作。

```js
const myPlugin = {
  install(app, options) {
    // 配置全局方法
    app.config.globalProperties.globalMethod = function (value) {
      return value.toLowerCase()
    }
  }
}
```

还可以利用app.component进行最为简单的组件注册，只需要在components目录中定义一个Header.vue组件，然后在插件定义前进行引入，并且在自定义插件中利用app.component进行全局组件注册即可。

```vue
<template>
  <h1>Header头部组件</h1>
</template>
```

```js
const myPlugin = {
  install(app, options) {
    // 配置全局方法
    app.config.globalProperties.globalMethod = function (value) {
      return value.toLowerCase()
    }
    // 注册全局组件
    app.component("Header", Header)
  }
}
```

利用app.mixin可以实现全局代码的混入，可以将之前clickPositionMixin的mixin代码混入示例内容进行测试，在插件定义提引入src/mixins目录下clickPositionMixin.js程序文件，然后在插件定义的时候进行app.mixin(clickPositionMixin)的代码混入操作：

```js
const myPlugin = {
  install(app, options) {
    // 配置全局方法
    app.config.globalProperties.globalMethod = function (value) {
      return value.toLowerCase()
    }
    // 注册全局组件
    app.component("Header", Header)
    // 插件中利用mixin设置全局混入
    app.mixin(clickPositionMixin)
  }
}
```

利用app.directive可以进行全局指令的注册操作，利用自定义指令的arg参数进行条件判断，确认使用myPlugin插件中的可选参数内容，最终控制指令设置值的大写转换并确认其文本的字体大小。

```js
const myPlugin = {
  install(app, options) {
    // 配置全局方法
    app.config.globalProperties.globalMethod = function (value) {
      return value.toLowerCase()
    }
    // 注册全局组件
    app.component("Header", Header)
    // 插件中利用mixin设置全局混入
    app.mixin(clickPositionMixin)
    // 注册全局指令
    app.directive("upper", function (el, binding) {
      el.textContent = binding.value.toUpperCase() // 通过指令参数判断调用插件的options可选参数
      if (binding.arg === "small") {
        el.style.fontSize = options.small + "px"
      } else if (binding.arg === "medium") {
        el.style.fontSize = options.medium + "px"
      } else {
        el.style.fontSize = options.large + "px"
      }
    })
  }
}
```

定义好插件以后需要利用use方法进行插件的使用操作，这样在当前应用中才可以正确的使用已经定义好的自定义插件，我们除了使用myPlugin插件还给插件传递了一个对象可选参数，设置了small、medium、large所对应的字体大小尺寸。

```js
app.use(myPlugin, {
  small: 12,
  medium: 24,
  large: 36
})
```

那么，我们在实现Comp1、Comp2组件切换时就可以在Comp1、Comp2中进行自定义插件中全局方法、组件、混入与指令内容的任意调用了。

比如Comp1中可以调用Header公共组件，mixins全局混入代码、v-upper自定义全局指令、globalMethod全局方法。

```vue
<template>
  <div>
    <p>x坐标:{{ x }}</p>
    <p>y坐标:{{ y }}</p>
    <!-- 插件组件的调用 -->
    <Header></Header>
    <!-- 插件指令的调用 -->
    <p v-upper:medium="'Hello Vue3'"></p>
    <!-- 插件全局方法调用 -->
    <p>{{ globalMethod("hi Vue3") }}</p>
  </div>
</template>
```

而在Comp2中则也可以调用mixins全局混入代码。

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

