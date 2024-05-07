# 05.ajax 请求在线模拟数据

想要利用 ajax 进行在线模拟数据的请求测试操作，可以利用 vite 进行一个请求项目的创建，项目的名称定为“vue3-book-request"。

```bash
npm create vite@latest vue3-book-request -- --template vue
```

但是，在该项目中我们如果想要进行 ajax 请求操作应该使用什么样的方式呢？也许有人会考虑自己利用 xhr 进行一个 ajax 功能函数的封装然后进行请求操作，但那样的话会耗费大量的时间精力，而现在可以考虑在当前项目中引入 jquery 这个第三方类库，因为在 jquery 中有对应的数据请求方法，比如 get、post 或者是 ajax 等。至于最终在 vue 项目中是否会引入 jquery 这一类库并且利用它的数据请求方法内容，我们稍后再做讨论，现在可以先关注功能处理。

可以先从[https://www.bootcdn.cn/](https://www.bootcdn.cn/)网站中查找 jquery 以及获取到指定版本的 CDN 资源，然后在项目根目录的 index.html 中添加脚本资源。

```html {8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  </head>

  <body>
    <div id="app"></div>
    html
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

然后将 components/HelloWorld.vue 代码内容全部清除，重新添加 script 脚本，并利用 setup 语法糖进行代码内容的书写。因为在主页面 index.html 中已经引入了 jquery，所以可以直接利用 jquery 中的$.get 进行接口的请求操作，而接口的地址就是之前 jsonplaceholder 所提供的在线接口地址，在请求的时候可以写上 await 异步操作的关键字，并且直接 console 打印 result 结果内容。

或许大家已经注意到在这两行代码中并没有 async 关键字的存在，却直接使用了 await 的异步请求操作，而 async、await 这两个关键字应该是同步使用的，但事实上是 vue3 的 script 中在顶层已经内置了 async，所以不需要再书写 async 关键字可以直接使用 await 操作。

components/HelloWorld.vue

```vue
<script setup>
// 利用jquery的get方法进行数据请求
const result = await $.get('https://jsonplaceholder.typicode.com/posts');
console.log(result);
</script>
```

现在运行程序并查看浏览器调试工具中的 Console 控制面板，你就可以看到利用 jquery 的 get 请求返回来的数据结果内容，但在数据结果的上面却也有一个 Vue 的警告信息`setup function returned a promise, but no <Suspense> boundary was found in the parent component tree`。该信息告诉我们在 setup 函数中返回 promise，需要在该组件父级组件树中使用`<Suspense>`边界控制操作。

![image-20220430201754597](http://qn.chinavanes.com/qiniu_picGo/image-20220430201754597.png)

所以，回到 HelloWorld 这个组件的父组件也就是 App.vue 中，尝试添加`<Suspense>`，结果控制台提示`<Suspense> slots expect a single root node. `，这意味着`<Suspense>`这个组件的插槽部分只允许设置单一的节点内容，看来不应该将 img 标签也包裹在`<Suspense>`组件中。

App.vue

```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <!-- 在父组件利用Suspense进行插槽内容的包裹 -->
  <Suspense>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Hello Vue 3 + Vite" />
  </Suspense>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

![image-20220430202425982](http://qn.chinavanes.com/qiniu_picGo/image-20220430202425982.png)

所以控制`<Suspense>`的插槽内容只保留 HelloWorld 的组件内容，现在控制台中可能会提示`<Suspense> is an experimental feature and its API will likely change.`，对于`<Suspense>`这一组件的功能目前还是实验性的，希望它能尽早进入到正式阶段吧。

```vue {7-10}
<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- Suspense组件的插槽只允许单一节点 -->
  <Suspense>
    <HelloWorld msg="Hello Vue 3 + Vite" />
  </Suspense>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

![image-20220430202634158](http://qn.chinavanes.com/qiniu_picGo/image-20220430202634158.png)

现在有一个问题需要思考，假若在进行数据请求的时候遇到网络延时，那时候可能会发生什么样的问题？界面中的数据无法渲染，没有良好提示的时候界面可能出现白屏等不良用户体验的状况，对于类似问题是否有较好的解决方案呢？

现在可以将浏览器调试工具切换至 Network 面板，并且在网络状态中选择 Slow 3G 调低网络请求的速度，刷新页面以后则会看到在进行数据请求的时候界面是以白屏状态显现，这样的用户体验感应该是比较差的。

![image-20220430203450222](http://qn.chinavanes.com/qiniu_picGo/image-20220430203450222.png)

![image-20220430203354861](http://qn.chinavanes.com/qiniu_picGo/image-20220430203354861.png)

在`<Suspense>`组件的插槽中，其实可以加入一个 fallback 备用方案插槽，可以将 HelloWorld 组件设置到 default 的插槽中，再添加一个 fallback 备用插槽内容，这样在 HelloWorld 没有完全加载完之前就会先显示 fallback 的备用插槽内容，这样也可以优化用户操作体验。

App.vue

```vue {7-13}
<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- Suspense的插槽可以包括default默认插槽与fallback备用插槽 -->
  <Suspense>
    <template #default>
      <HelloWorld msg="Hello Vue 3 + Vite" />
    </template>
    <template #fallback> 数据加载中... </template>
  </Suspense>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

![image-20220430203635113](http://qn.chinavanes.com/qiniu_picGo/image-20220430203635113.png)

既然已经成功请求到数据，并且还给组件添加了一个 loading 提示信息进行了用户体验的加强，接下来就可以将数据进行设置与渲染操作，将请求返回的结果数据设置到指定的 ref 数据中就可以进行数据的循环渲染处理。

components/HelloWorld.vue

```vue
<script setup>
import { ref } from 'vue';
const posts = ref(null);
// 利用jquery的get方法进行数据请求
const result = await $.get('https://jsonplaceholder.typicode.com/posts');
// 将请求成功的值存储至ref响应式数据对象中进行模板的渲染显示
posts.value = result;
</script>

<template>
  <ul v-for="post in posts" :key="post.id">
    <li>{{ post.title }}</li>
  </ul>
</template>
```

![image-20220430204955658](http://qn.chinavanes.com/qiniu_picGo/image-20220430204955658.png)

但似乎我们还缺少了一些细节的处理，比如说异常错误的内容，如果说请求的地址是一个错误的地址，那么请求就不会成功，这时需要给予一些错误信息的提示操作。我们可以设置一个 error 的 ref 数据，并且利用 trycatch 进行异常信息的捕获，将请求的地址设置为一个错误的接口地址，这样的话一定会进入到 catch 的步骤，而在模板层，如果有错误信息则需要显示错误内容。

components/HelloWorld.vue

```vue {4-6,13-16,20-22}
<script setup>
import { ref } from 'vue';
const posts = ref(null);
const error = ref(null);
// 利用trycatch进行异常捕获
try {
  // 利用jquery的get方法进行数据请求
  const result = await $.get(
    'https://jsonplaceholder.typicode.com/posts-error'
  );
  // 将请求成功的值存储至ref响应式数据对象中进行模板的渲染显示
  posts.value = result;
} catch (e) {
  // 将错误内容放置error的ref对象中
  error.value = e;
}
</script>

<template>
  <!-- 错误内容的输出 -->
  <div v-if="error">error:{{ error }}</div>
  <!-- 成功结果的输出 -->
  <ul v-for="post in posts" :key="post.id">
    <li>{{ post.title }}</li>
  </ul>
</template>
```

运行程序则会看到控制台中的 404 错误内容，界面中也包含了 catch 捕获的 error 错误信息。

![image-20220430205358514](http://qn.chinavanes.com/qiniu_picGo/image-20220430205358514.png)

现在已经利用 jquery 的 get 方法实现了最为基本的接口请求操作，我想是时候来思考一下在当前 Vue 项目是引入 jquery 这一第三方类库是否合适的问题了。

jquery 这个类库的存在已经有蛮悠久的历史了，它主要针对的是 DOM 模式的操作，包括对于真实 DOM 的查询与操作，只不过这个库中集成了 get、post 与 ajax 这样的功能方法可以实现数据接口的请求操作，请求的功能方法只是类库中附带的一些很小的功能，而且 jquery 这一类库就算是 min 压缩版本也有 90K 近百 K 的文件体积大小，应该说并不算小的这么一个第三方类库了。并且 Vue 是以虚拟 DOM 为技术核心的 JS 框架，在虚拟 DOM 为核心的框架体系中又尝试使用真实 DOM 为核心的第三方类库，从操作思路上说就显得格格不入。所以，根据这些前置原因的影响，一般情况在 Vue 的项目中并不会使用 jquery 这样的第三方类库以及其中所带的请求方法来实现 Vue 项目中的数据请求操作，至于在 Vue 项目中可能会使用哪些操作方式，则在后续再作进一步讨论。
