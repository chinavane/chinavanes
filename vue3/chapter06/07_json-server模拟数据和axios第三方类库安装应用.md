# 07.json-server 模拟数据和 axios 第三方类库安装应用

## 1)json-server 与 mockjs 的结合使用

在线模拟数据与自定义服务器模拟数据的局限性已经非常的明显，前者功能薄弱后者技术性要求极强，那么有没有一种更好的解决方案即不需要编写大量代码又可以支持强大的功能的呢？接下来我们就来了解一下利用 json-server 实现自定义模拟数据的强大解决方案。

可以打开 github.com 搜索关键字 json-server 可以找到对应的模块内容，这是一款”在不到 30 秒的时间内即可获得零编码的完整模拟数据的工具，并且它还支持 rest api 接口风格“。

想要使用此工具需要根据文档先全局安装 json-server 模块，在终端输入命令：

```bash
npm install json-server -g
```

然后新建立一个项目，目录名称设为 json-server-mock-server，并且在该目录下创建一文件 db.json，可以将文档中的 db.json 代码部分复制粘贴到刚刚新建的文件当中，并且在终端运行命令 json-server -p 5000 --watch db.json 即可，这一命令可以开启一个本地服务并且端口为设定的 5000。

```json
{
  "posts": [{ "id": 1, "title": "json-server", "author": "typicode" }],
  "comments": [{ "id": 1, "body": "some comment", "postId": 1 }],
  "profile": { "name": "typicode" }
}
```

这时即可打开浏览器 http://localhost:5000 就可以看到本地服务的首页内容确认 json-server 已经成功开启，并且 resouce 中已经明确列出了已经支持的接口清单，包括 posts、comments 和 profile。posts 和 comments 的数据类型为数组，目前这两个接口下包含 1 个数组元素，而 profile 则是对象类型。那么就可以打开浏览器 http://localhost:5000/posts 查看到 posts 部分的数据列表，如果想要查看 id 为 1 的记录内容，则可以后面加上/1 的参数，具体地址为 http://localhost:5000/posts/1，就可以查看指定 id 的数据，这一操作过程有些像在线模拟数据 JSONPlaceholder 的操作流程。

![image-20220501144038070](http://qn.chinavanes.com/qiniu_picGo/image-20220501144038070.png)

当然浏览器只能进行 get 请求模式的测试，而 json-server 也是支持 rest api 风格的，这就意味着它不光可以支持 get 数据请求，还可以支持 post、put、delete 等请求模式，不过如果想要进行更多的请求方式测试，还是可以使用接口调试工具 postman 进行测试，接下来我们将结合 postman 与 json-server 再一同进行当前应用接口的调试测试。

如果想要给模拟数据新增数据则可以利用 post 方式，在请求模式中选择 post，不过还需要给新数据设置对应的值，所以要给 body 添加对应的参数，这部分内容相当于表单处理。更为重要的是需要选择表单参数传递模式，当前选择 x-www-form-urlencoded，然后再在键值对处添加 title 以及 author 信息，不需要关心 id，因为它是自增的。

![image-20220501144547316](http://qn.chinavanes.com/qiniu_picGo/image-20220501144547316.png)

在添加完数据以后，可以重新打开之前 json-server-mock-server 目录中的 db.json 文件，则会发现新增数据已经添加进去了。

![image-20220501144623751](http://qn.chinavanes.com/qiniu_picGo/image-20220501144623751.png)

当然，如果你想修改刚刚添加的这条数据内容，则可以利用 put 请求模式，不过修改数据的时候需要指定数据的内容，所以将请求地址指向了 id 为 2 的记录，同样的，表单的传递模式与表单键值对参数可以进行再设置。

至于删除操作则是 delete，也需要指定删除的记录内容，所以地址中同样涵盖 id 参数，不过 delete 比较简单，不需要设置其它更多的内容即可实现。

对于增、删、改、查的操作过程与之前在线模拟数据的 postman 调试过程似乎并没有什么两样，关键的问题就是 JSONPlaceholder 这一在线模拟数据的服务内容也同样是由 json-server 所提供，所以它们的操作过程几乎一致。

不过与 JSONPlaceholder 在线模拟数据操作不同，json-server 提供了更多强大功能，比如过滤、分页、排序、截取、全文检索、数据关联等，这部分的内容从 json-server 模块介绍的文档中可以详情查看与应用测试。

不过目前仍旧有一个问题，就是在测试数据的时候，基本上所有的数据内容都需要手动进行增、删、改、查，就数据的输入而言，也会耗费蛮多的时间与精力。假若需要设置 1 万条数据，并且这些数据还要尽可能的接近真实项目的数据模式，那么是否需要安排人员一条一条数据的进行增设呢？我想这是绝不可能的。那么是否有更好的办法帮助我们实现一些更贴近实际的并且随意数量的数据内容呢？这就需要另一个工具，也就是假数据生成器 mock.js 的帮助。

首先需要了解一下 mockjs 的应用场景，在程序开发并调试阶段往往开发人员对于数据的真实性并不很关注，例如姓名、地址、电话等信息经常会用 aaa/bbb/123 来进行输入、调示与展示操作，因而整体应用与最终的实际效果其实感觉上相差甚远。因为想要输入更多更实际的数据内容往往需要耗费很多的时间与精力，有些得不偿失。

mock.js 则是一款可以随机生成数据并且可以拦截 Ajax 请求的工具，它的网站地址是http://mockjs.com。

通过文档阅读可以了解到通过 mock.js 可以实现地址、日期、图片、网络、姓名、语句、段落、随机等上百种字段信息的内容的随机生成，并且还支持中英文不同的语言内容。

我们可以在之前的 json-server-mock-server 目录中先进行 mock.js 模块的安装，需要在终端运行命令：

```bash
npm install mockjs --save
```

然后新建一个 index.js 程序文件，在该文件中引入 mockjs 模块，并尝试通过 mockjs 模块随机生成一句假数据

json-server-mock-server/index.js

```js
const Mock = require('mockjs');
console.log(Mock.Random.cname());
```

可以通过 node index.js 进行测试，发现每次运行该命令输出的信息都是不同的。由此可见，通过 mock.js 可以生成靠近实际应用的一些伪造的假数据。

既然可以生成一条数据内容，那么生成多条数据应该如何处理呢？完全可以通过循环的方式进行处理。例如我们想构建一批用户数据，可以修改 index.js 程序文件：

json-server-mock-server/index.js

```js
const Mock = require('mockjs');
for (let i = 0; i < 58; i++) {
  console.log(Mock.Random.cname());
}
```

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220501150520971.png" alt="image-20220501150520971" style="zoom:50%;" />

现在的问题是虽然可以利用 mock.js 生成一系列的随机数据，但是似乎与 json-server 本地服务接口没有任何的关系，按照原来 json-server 的操作模式似乎应该把 mock.js 生成的数据复制粘贴到 db.json 文件当中去才行，这看起来并不智能。最好的方式就是让 mock.js 与 json-server 这两者建立起合作渠道确认结合。

接下来可以修改 index.js 程序文件，在引入 Mock 以后利用 Mock.Random 进行随机内容的生成，不过在生成数据的时候可以利用 module.exports 进行模块的定义，并且定义的内容是一个函数。虽然 module.exports 是 nodejs 环境下 commonjs 的规范，说明当前程序的运行环境底层基础仍旧是 node。在这个函数中可以创建一个 data 数据类型为对象，并且包含一个 users 的属性节点。然后利用循环向这个 data 下的 users 数组内容进行数组元素对象值的追加，最终将 data 数据进行返回。这部分的内容看起来就是最为简单的函数定义与随机内容生成的处理，只不过多了一个模块暴露操作，而这个暴露的功能主要是让 json-server 能够去应用当前的模拟数据模块。

json-server-mock-server/index.js

```js
let Mock = require('mockjs');
let Random = Mock.Random;

module.exports = () => {
  let data = {
    users: [],
  };

  for (let i = 1; i <= 324; i++) {
    data.users.push({
      id: i,
      name: Random.cname(),
      address: Random.cword(10, 20),
      avatar: Random.image('100x100', Random.color(), '#FFF', Random.name()),
    });
  }
  return data;
};
```

现在就可以将之前运行 db.json 的终端命令进行终止，并利用 index.js 程序文件替换 db.json 数据文件，在终端运行命令：

```bash
json-server -p 5000 --watch index.js
```

现在打开 http://localhost:5000 就可以看到 users 进入到了我们的 json-server 服务接口当中，打开浏览器或者利用 postman 进行接口调试都可以看到用户的随机数据。

![image-20220501151605672](http://qn.chinavanes.com/qiniu_picGo/image-20220501151605672.png)

比如在 postman 中进行 http://localhost:5000/users?\_page=1&\_limit=5 接口的 get 请求，就可以返回 json-server 服务进行分页以后的数据内容，而且随机的数据也更接近真实项目的内容，当然它是支持中文的。

![image-20220501184758796](http://qn.chinavanes.com/qiniu_picGo/image-20220501184758796.png)

## 2)axios 请求的尝试

在我们很好的解决了模拟数据的生成问题以后现在可能得需思考一下请求方式的内容。前面已经强调在 vue 项目中引入 jquery 并使用它的 ajax 进行数据请求并不是一种合理方案，所以尝试改用了原生的 fetch 进行接口请求测试。但事实上 fetch 这个原生函数也存在诸多的问题，虽然 fetch 是浏览器级别原生支持的 api，支持 promise api，语法简洁且符合 es 标准规范，并且现在已经是 w3c 规范，但是它仍旧许多的不足。比如它不支持文件上传进度监测、默认不带 cookie、不支持请求终止、没有统一的请求响应拦截器、使用不完美，需要大量的功能封装等。所以，我想还需要找寻更好的接口请求解决方案，那就是 axios 这一个专注请求操作的第三方类库。

axios 是一个独立开发功能目标明确的请求类库，axios 基于 promise 既可用于浏览器又可以用于 nodejs 服务器的 http 请求模块，本质上它也是对原生 XHR 的封装，只不过他是 promise 的实现版本，符合最新 ES 规范。axios 有很多的优势，主要包括如下：

- 功能目标明确，文件体积较小
- 支持浏览器与 nodejs 前后端发请求
- 支持 promise 语法
- 支持自动解析 json
- 支持中断请求
- 支持拦截请求
- 支持进度条检测
- 支持客户端防止 CSRF
- 功能封装相对完美

首先我们可以在 vue 项目中进行 axios 模块的安装处理，当然你可以像 jquery 一样在 bootcdn.cn 中查找 axios 模块，并且将 cdn 链接地址放置于项目根目录的 index.html 主页面当然，不过也可以使用模块安装与引入的操作模式。可以在项目中打开终端，运行命令：

```bash
npm install axios --save
```

然后打开原先 vue 项目的 HelloWorld.vue 组件，在组件中引入 axios 模块，并且利用 axios 进行用户接口的请求，请求的地址 url 可以设置为 http://localhost:5000/users，不过需要注意的是 axios 请求的结果内容会被放置于返回数据的 data 属性节点当中，也不需要像 fetch 一样在请求以后还需要利用 json()方法进行数据类型的转化，因为它已经自动的将 json 数据进行了内部转化操作，这样我们就利用 axios 请求到了 json-server 与 mockjs 所结合的模拟数据接口并成功的进行了数据的渲染显示，并且接口地址进行了分页的操作限制数据将只返回 300 多条模拟数据中第 1 页的 5 条数据内容。

components/HelloWorld.vue

```vue
<script setup>
import { ref } from 'vue';
// 引入axios模块
import axios from 'axios';
const users = ref(null);
const error = ref(null);
try {
  // 利用axios进行数据接口请求
  const result = await axios({
    url: 'http://localhost:5000/users?_page=1&_limit=5',
  });
  // axios请求的结果内容会被放置于返回数据的data属性节点当中
  users.value = result.data;
} catch (e) {
  error.value = e;
}
</script>

<template>
  <div v-if="error">error:{{ error }}</div>
  <ul v-for="user in users" :key="user.id">
    <li>{{ user.name }}</li>
  </ul>
</template>
```

![image-20220501155413363](http://qn.chinavanes.com/qiniu_picGo/image-20220501155413363.png)
