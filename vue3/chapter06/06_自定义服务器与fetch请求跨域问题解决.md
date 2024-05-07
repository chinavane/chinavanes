# 06.自定义服务器与 fetch 请求跨域问题解决

JSONPlaceholder 在线模拟数据的局限估计大家都已经非常清楚了，现在请求到的数据内容都是英文示例，对于中文的支持力度几乎没有，而且很难修改其中数据结构的节点属性，那么针对这些弊端需要如何解决呢？我想可以尝试自己设置一个接口服务器并且自定义去封装一些接口并返回期望的数据内容。

可以先新建一个 node-server 的空目录，该目录主要实现接口服务器的构建操作与原来的 vue3-boot-request 项目从项目关联性上讲完全独立没有任何关联。进入到该目录以后可以先进行 express 模块的安装，打开终端运行命令：

```
npm install express --save
```

然后在 node-server 根目录创建 index.js，该文件中主要实现 express 这一 nodejs 框架的引入与实例化，并且利用 express 自带的路由功能实现路由地址的配置，再使用 listen 端口监听功能开启一个服务器的地址。显然，指定路由中的数据内容都是由我们自行定义，包括数据的结构与中文的设置。

node-server/index.js

```js
// 引入express框架模块
const express = require('express');
// 利用express实例化应用，名称为app
const app = express();

// 设置请求路由，地址为/，并且返回对象数据
// 对象中包含data属性节点，该节点的数据类型为数组
app.get('/', function (req, res) {
  res.send({
    data: [
      { name: 'UI', level: '初级' },
      { name: '前端', level: '中级' },
      { name: 'Java', level: '高级' },
      { name: '大数据', level: '高级' },
    ],
  });
});

// 利用端口监听实现服务的启动操作
app.listen(5000, () => {
  console.log('服务器运行地址为：http://localhost:5000');
});
```

在配置完服务器以后，需要打开终端运行当前的 index.js 程序文件，命令内容为`node index.js`，这时在终端则会显示`服务器运行地址为：http://localhost:5000`的提示字样。

```bash
node index.js
```

因为服务的路由设置的是 get 请求模式，所以可以直接在浏览器中输入 http://localhost:5000 的地址，可以看到返回的数据内容。

![image-20220501101743144](http://qn.chinavanes.com/qiniu_picGo/image-20220501101743144.png)

既然已经准备好了接口内容，那么就可以考虑回到 vue 的项目中进行数据的请求操作。不过之前也已经说明在 vue 中引入 jquery 并调用 jquery 所提供的请求方式并不是一种合适的选择，那么在当前 vue 项目中还可以利用什么样的方式进行数据请求呢？事实上浏览器中已经内置了一个数据请求方法就是 fetch，不过这个 fetch 并不是所有浏览器都支持，它存有一定的兼容性问题，利用 caniuse.com 平台进行 fetch 内容的兼容性查询可以确认 IE 浏览器都是不支持该方法的。

![image-20220501102324531](http://qn.chinavanes.com/qiniu_picGo/image-20220501102324531.png)

不过随着 IE 浏览器逐步被历史所淘汰，那么 fetch 的应用率将会被大幅度的增高，因为它是浏览器内置方法所以不需要附加引入其它的第三方类库，因而不会增加项目的文件体积使得项目变得更为的轻巧，性能也会更好。不过 fetch 的使用与 jquery 的数据请求操作也有一定的差异。

所以可以回到项目的 HelloWorld.vue 组件中，尝试利用 fetch 进行数据接口的请求测试，不过 fetch 请求返回的是 promise，所以需要将返回结果进行所需的 json 模式转化，将结构转化的值存储至 ref 响应式数据对象中才能进行模板的渲染显示。

components/HelloWorld.vue

```vue
<script setup>
import { ref } from 'vue';
const courses = ref(null);
const error = ref(null);
// 利用trycatch进行异常捕获
try {
  // 利用fetch进行数据请求
  const result = await fetch('http://localhost:5000');
  // 因为fetch返回的是promise，所以需要将返回结果进行所需的json模式转化
  // 将结构转化的值存储至ref响应式数据对象中进行模板的渲染显示
  courses.value = await result.json();
} catch (e) {
  // 将错误内容放置error的ref对象中
  error.value = e;
}
</script>

<template>
  <!-- 错误内容的输出 -->
  <div v-if="error">error:{{ error }}</div>
  <!-- 成功结果的输出 -->
  <ul v-for="course in courses.data" :key="course.id">
    <li>{{ course.name }}</li>
  </ul>
</template>
```

不过现在运行应用结果却很不幸，并没有成功的进行接口数据的请求并在控制台报了相应的错误信息，错误提示的大致意思是 http://localhost:3000 的项目地址想去请求 http://localhost:5000/的接口地址产生了违反 CORS 同源策略的跨域问题。之前在进行 JSONPlaceholder 在线模拟数据的接口请求的时候似乎并没有遇到跨域的问题，那么为什么自己构建服务器接口反倒遇到这样的问题呢？这是因为 JSONPlaceholder 在服务器端已经确认了 CORS 跨域的许可让客户端请求的时候不再受其限制。

> Access to fetch at 'http://localhost:5000/' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

![image-20220501101937005](http://qn.chinavanes.com/qiniu_picGo/image-20220501101937005.png)

我想对于 CORS 同源策略与跨域问题首先可以作一解释，所以跨域问题的产生就是违反了同源策略的基本原则，而根据之前的 URL 地址的组成已经清楚 URL 的各个部分的功能，所以如果两个不同的域名在协议、主机名、端口这三个 URL 组成项中进行比较，任何一项存在不同就是表明它们不在同一个域中，就存在跨域的问题。而跨域问题产生的结果将是无法进行数据的正常获取，无法实现 DOM 的具体操作，无法实现本地存储的数据等内容。

现在的问题是想要进行数据的正常获取，所以就必须要先解决跨域的问题，当然跨域问题的解决有很多方法，包括前端、后台、运维等不同岗位人员都可以有办法实现跨域问题的解决。

对于前端人员来讲，跨域问题主要集中在开发测试阶段，因为在生产环境中跨域问题的解决主要还是要依赖后端与运维岗位实现。那么当前的项目目前在开发测试阶段应该如何处理跨域呢？

最简单的方案是给浏览器安装一个允许跨域测试的插件，可以到 chrome 的扩展插件市场搜索并下载 CORS 相关的插件内容，地址是：https://chrome.google.com/webstore/search/cors?hl=en&_category=extensions

![image-20220501104139326](http://qn.chinavanes.com/qiniu_picGo/image-20220501104139326.png)

当插件安装成功以后，只需要点击启用该插件，那么当前项目在测试阶段就会突破 CORS 的跨域访问限制，运行项目则能够正常访问与显示接口内容了。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220501104045409.png" alt="image-20220501104045409" style="zoom:50%;" />

![image-20220501104259651](http://qn.chinavanes.com/qiniu_picGo/image-20220501104259651.png)

其实前端人员也利用服务器接口代理请求地址的配置操作来解决跨域的内容，可以打开 vite.config.js 并修改项目运行的配置文件。可以给项目设置一个 server 本地服务配置，并确认 proxy 代理功能，可以设置代理地址接口前缀，比如/api(这一前缀地址可以任意)，然后再确认代理地址目标 target，现在就是 http://localhost:5000 的服务器接口地址，当然还需要设置 changeOrigin 为 true，确认修改来源实现跨域，否则还是无法解决跨域的问题，至于 rewrite 是因为在进行请求接口操作时服务器所提供的接口中并不存在接口前缀所以在实现代理以后需要将其替换为空字符串。

vite.config.js

```js {7-16}
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 设置代理地址接口前缀
      '/api': {
        target: 'http://localhost:5000', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true, // 确认修改来源实现跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 替换代理地址接口前缀为空字符串
      },
    },
  },
});
```

设置为项目的代理配置是否就已经可以进行接口的正常访问了吗？其实还不够，在进行接口请求的时候还有一些事项需要注意。在进行 fetch 请求时需要将请求地址从 http://localhost:5000 转变 http://localhost:3000/api，这时在进行 http://localhost:3000 地址请求的时候会通过代理转发到 http://localhost:5000，而加上 api 的代理前缀，在请求时最终会替换成字的字符串，接口最终请求到 http://localhost:5000，这样数据就能够正常的获取与显示了。

```vue {7-11}
<script setup>
import { ref } from 'vue';
const courses = ref(null);
const error = ref(null);
// 利用trycatch进行异常捕获
try {
  // 利用fetch进行数据请求
  // 请求地址从http://localhost:5000转变http://localhost:3000/api
  // 这时在进行http://localhost:3000地址请求的时候会代理转发到http://localhost:5000
  // 需要添加api的代理前缀，在请求时最终会替换成字的字符串，最终请求到http://localhost:5000
  const result = await fetch('http://localhost:3000/api');
  // 因为fetch返回的是promise，所以需要将返回结果进行所需的json模式转化
  // 将结构转化的值存储至ref响应式数据对象中进行模板的渲染显示
  courses.value = await result.json();
} catch (e) {
  // 将错误内容放置error的ref对象中
  error.value = e;
}
</script>

<template>
  <!-- 错误内容的输出 -->
  <div v-if="error">error:{{ error }}</div>
  <!-- 成功结果的输出 -->
  <ul v-for="course in courses.data" :key="course.id">
    <li>{{ course.name }}</li>
  </ul>
</template>
```

前端可以利用插件或者是 proxy 代理进行跨域问题的解决，其实 node 的后台接口也可以利用 cors 进行跨域问题的处理。可以在 node-server 项目中安装 cors 模块：

```bash
npm install cors --save-dev
```

然后修改 node-server/index.js 的接口服务文件，将 cors 模块进行引入与使用，这样的话后台接口就如同 JSONPlaceholder 在线模拟数据接口一样，在服务器端就已经将跨域问题进行处理，前端项目不需要担心任何的跨域问题。

```js
// 引入express框架模块
const express = require('express');
// 利用express实例化应用，名称为app
const app = express();
// 引入cors跨域问题解决模块
const cors = require('cors');
// 使用cors跨域支持模块，让所有接口都不受跨域问题干扰
app.use(cors());

// 设置请求路由，地址为/，并且返回对象数据
// 对象中包含data属性节点，该节点的数据类型为数组
app.get('/', function (req, res) {
  res.send({
    data: [
      { name: 'UI', level: '初级' },
      { name: '前端', level: '中级' },
      { name: 'Java', level: '高级' },
      { name: '大数据', level: '高级' },
    ],
  });
});

// 利用端口监听实现服务的启动操作
app.listen(5000, () => {
  console.log('服务器运行地址为：http://localhost:5000');
});
```

所以 vue 项目中的 HelloWorld.vue 中的 fetch 请求地址仍旧可以切换回最初的请求地址 http://localhost:5000，同样数据请求能够正常得到并成功进行数据的渲染显示。

```js
const result = await fetch('http://localhost:5000');
```

不过，如果我们将接口的请求地址假设性的设置为一个错误地址，比如 http://localhost:5000/error，那么这时候程序仍旧会报以错误信息，这是因为 courses 默认设置的值为 null，而数据请求又是一个异步操作，模板在渲染的时候因为请求地址错误而无法正常返回 courses 数据内容，更不用说它下面的 data 属性节点的数据了，所以报错误信息`Cannot read properties of null (reading 'data')`，确认 null 这个内容下面是没有 data 属性可以读取并渲染显示的。

components/HelloWorld.vue

```vue {11}
<script setup>
import { ref } from 'vue';
const courses = ref(null);
const error = ref(null);
// 利用trycatch进行异常捕获
try {
  // 利用fetch进行数据请求
  // 请求地址从http://localhost:5000转变http://localhost:3000/api
  // 这时在进行http://localhost:3000地址请求的时候会代理转发到http://localhost:5000
  // 需要添加api的代理前缀，在请求时最终会替换成字的字符串，最终请求到http://localhost:5000
  const result = await fetch('http://localhost:5000/error');
  // 因为fetch返回的是promise，所以需要将返回结果进行所需的json模式转化
  // 将结构转化的值存储至ref响应式数据对象中进行模板的渲染显示
  courses.value = await result.json();
} catch (e) {
  // 将错误内容放置error的ref对象中
  error.value = e;
}
</script>

<template>
  <!-- 错误内容的输出 -->
  <div v-if="error">error:{{ error }}</div>
  <!-- 成功结果的输出 -->
  <ul v-for="course in courses.data" :key="course.id">
    <li>{{ course.name }}</li>
  </ul>
</template>
```

![image-20220501113211265](http://qn.chinavanes.com/qiniu_picGo/image-20220501113211265.png)

如果想将这个错误信息进行渲染显示，那又应该如何实现？其实在 HelloWorld.vue 的父级组件中可以进行 Boundary 错误边界的控制，利用 onErrorCaptured 错误捕获函数进行 error 错误的获取与拦截，并且设置一个 error 的 ref 数据内容将拦截的错误信息进行存储，并且在 template 模板显示的时候进行错误内容的输出。如此，在子组件请求出错时，父组件中将进行错误内容的直接渲染显示，以提高用户的操作体验感。

App.vue

```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue';
import { ref, onErrorCaptured } from 'vue';
const error = ref(null);
// 利用onErrorCaptured进行错误捕获操作，并设置error错误信息内容
onErrorCaptured((e) => {
  error.value = e;
});
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- Suspense的插槽可以包括default默认插槽与fallback备用插槽 -->
  <!-- 错误内容的输出 -->
  <div v-if="error">error:{{ error }}</div>
  <Suspense v-else>
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

![image-20220501113855977](http://qn.chinavanes.com/qiniu_picGo/image-20220501113855977.png)

到现在为止已经自定义了 node 接口服务器并且利用 fetch 这一浏览器内置方法进行了数据请求，我想应该可以分析出这种操作流程的一些优势与不足了。

自定义服务器的优势十分明显，接口操作自由，中文支持完美，即便存在跨域问题也可以轻松解决。但是这种模式不足点也异常突出，因为需要开发人员掌握一定的后端开发技术，目前只涉及到了 node 的基础服务器启动与路由设置操作，但更多的功能比如分页查询、排序功能以及与关系型数据库例如 mysql 与非关系型数据库例如 mongodb 等结合的内容需要大量的技术储备，毕竟数据最终还是需要进入到数据库进行存储的，这时候对于人员的前后端技术要求过高短时间内不一定能够适应。
