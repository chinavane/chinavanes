# 04.原生API请求

在理解接口概念，准备好正式与模拟接口并且利用swagger和postman进行测试成功以后则需要考虑在vue项目中进行数据请求操作。不过在此之前需要先理清楚接口请求的不同方式，主要包括原生API接口请求与第三方类库模式的接口请求两大类。不过，不管哪种请求方式都必须先掌握请求的基础原理，这里将提出Ajax这个核心概念。

## 1)Ajax基本概念与操作步骤

Ajax，全称“Asynchronous JavaScript and XML”，即异步的 JavaScript 和 XML。通过Ajax可以在浏览器中向服务器发送异步请求。Ajax有很多优势，包括：可以无需刷新页面与服务器端进行通信，允许根据用户事件来更新部分页面内容。但它也有一些不足，主要有：没有浏览历史，不能回退，还会存在跨域问题，并且对于SEO不友好，网页中的内容爬虫爬取不到。

想要实现Ajax进行数据请求，主要会经过如下几个主要操作步骤：

- 创建XMLHttpRequest类型的对象。XMLHttpRequest是Ajax数据请求的核心，使用XMLHttpRequest (XHR)对象可以与服务器交互。你可以从URL获取数据，而无需让整个的页面刷新。这使得Web页面可以只更新页面的局部，而不影响用户的操作。XMLHttpRequest在Ajax编程中被大量使用。尽管名称如此，XMLHttpRequest 可以用于获取任何类型的数据，而不仅仅是 XML。XMLHttpRequest是浏览器默认支持的Web API接口函数。
- 准备发送，打开与一个网址之间的连接。XMLHttpRequest.open将初始化一个请求，它有多个参数，第一个参数是请求方式，第二个是请求的地址，第三个是同步或者异步，需要注意的是该方法只能在 JavaScript 代码中使用。
- 执行发送动作。XMLHttpRequest.send()，如果请求是异步的（默认），那么该方法将在请求发送后立即返回。在发送的时候可以传递参数内容，如果不进行参数传递操作可以设置参数为null。
- 指定xhr状态变化事件处理函数，确认请求状态以及请求结果。XMLHttpRequest.onreadystatechange这一监听函数中可以获取到XMLHttpRequest.readyState，它是一个无符号短整型（`unsigned short`）数字，代表请求的状态码，主要包括0、1、2、3、4等不同的请求状态。XMLHttpRequest.status将同样返回一个无符号短整型（`unsigned short`）数字，它代表请求的响应状态，通常有1xx(信息)、2xx(成功)、3xx(重定向)、4xx(客户端错误)、5xx(服务器端错误)等内容。

那么在vue项目中如何认证Ajax操作的步骤流程呢？可以先利用 vite 进行一个请求项目的创建，项目的名称定为“vue3-book-request"。

```bash
npm create vite@latest vue3-book-request -- --template vue
```

可以将App.vue根组件中的代码内容清除，然后直接按Ajax操作步骤进行实现即可。

```vue
<script setup>
// 第一步：先创建一个ajax的核心，XMLHttpRequest实例对象
const xhr = new XMLHttpRequest();
// 第二步：使用open创建请求，第一个参数是请求方式，第二个是请求的地址，第三个是同步或者异步
xhr.open('GET', 'http://39.98.123.211:8510/api/cms/banner', false);
// 设置request请求报文，比如Content-Type文档类型等，application/x-www-form-urlencoded是Content-Type的默认类型
// 现在前后端交互时，一般都是json格式，所以可以设置Content-Type为application/json
xhr.setRequestHeader('Content-Type', 'application/json');
// 第三步：发送请求数据，调用send发送请求，如果不需要参数就写一个null参数
xhr.send(null);
// 第四步：为xhr.onreadystatechange设置监听事件，确认请求状态以及请求结果
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    //readyState  0 请求未初始化  刚刚实例化XMLHttpRequest
    //readyState  1 客户端与服务器建立链接  调用open方法
    //readyState  2 请求已经被接收
    //readyState  3 请求正在处理中
    //readyState  4 请求成功
    if (xhr.status == 200) {
      // status是http的状态码，主要有1xx(信息)、2xx(成功)、3xx(重定向)、4xx(客户端错误)、5xx(服务器端错误)等
      // responseText是服务器端返回的响应文本内容
      console.log(xhr.responseText);
    }
  }
};
</script>

<template>
  <div></div>
</template>
```

不过现在运行应用结果却很不幸，并没有成功的进行接口数据的请求并在控制台报了相应的错误信息，错误提示的大致意思是 http://localhost:5173 的项目地址想去请求 http://39.98.123.211:8510/api/cms/banner的接口地址产生了违反 CORS 同源策略的跨域问题。

![image-20221118112330271](http://qn.chinavanes.com/qiniu_picGo/image-20221118112330271.png)

> App.vue:10 Access to XMLHttpRequest at 'http://39.98.123.211:8510/api/cms/banner' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

我想对于 CORS 同源策略与跨域问题首先可以作一解释，所谓跨域问题的产生就是违反了同源策略的基本原则，而根据之前的 URL 地址的组成已经清楚 URL 的各个部分的功能，所以如果两个不同的域名在协议、主机名、端口这三个 URL 组成项中进行比较，任何一项存在不同就是表明它们不在同一个域中，就存在跨域的问题。而跨域问题产生的结果将是无法进行数据的正常获取，无法实现 DOM 的具体操作，无法实现本地存储的数据等内容。

现在的http://localhost:5173 项目地址与http://39.98.123.211:8510/api/cms/banner接口地址中除了http协议是相同之外，它们的主机名称以及端口都是不相同的，所以这就违反了同源策略从而产生了跨域问题。

现在的问题是想要进行数据的正常获取，所以就必须要先解决跨域的问题，当然跨域问题的解决有很多方法，包括前端、后台、运维等不同岗位人员都可以有办法实现跨域问题的解决。

对于前端人员来讲，跨域问题主要集中在开发测试阶段，因为在生产环境中跨域问题的解决主要还是要依赖后端与运维岗位实现。那么当前的项目目前在开发测试阶段应该如何处理跨域呢？

前端人员可以利用服务器接口代理请求地址的配置操作来解决跨域的内容，可以打开 vite.config.js 并修改项目运行的配置文件。可以给项目设置一个 server 本地服务配置，并确认 proxy 代理功能，可以设置代理地址接口前缀，比如/apiPrefix(这一前缀地址可以任意)，然后再确认代理地址目标 target，现在就是 http://39.98.123.211:8510/api 的服务器接口地址，当然还需要设置 changeOrigin 为 true，确认修改来源实现跨域，否则还是无法解决跨域的问题，至于 rewrite 是因为在进行请求接口操作时服务器所提供的接口中并不存在接口前缀所以在实现代理以后需要将其替换为空字符串。

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
      '/apiPrefix': {
        target: 'http://39.98.123.211:8510/api', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true, // 确认修改来源实现跨域
        rewrite: (path) => path.replace(/^\/apiPrefix/, ''), // 替换代理地址接口前缀为空字符串
      },
    },
  },
});
```

设置为项目的代理配置是否就已经可以进行接口的正常访问了吗？其实还不够，在进行接口请求的时候还有一些事项需要注意。在进行 xhr.open 请求时需要将请求地址从 http://39.98.123.211:8510/api/cms/banner 转变 /apiPrefix/cms/banner，这时在进行 http://localhost:5173 地址请求的时候会通过代理转发到 http://39.98.123.211:8510/api，并且加上 apiPrefix 的代理前缀，不过在请求时最终会替换成空的字符串，所以接口最终请求到 http://39.98.123.211:8510/api/cms/banner，这样数据就能够正常的获取与显示了。proxy代理的最终目标就是将请求的地址与项目的地址设置成相同的协议、主机名与端口名称，从而适应于同源不再产生跨域障碍。

![image-20221118113607500](http://qn.chinavanes.com/qiniu_picGo/image-20221118113607500.png)

不过前端开发解决跨域最简单的方案是给浏览器安装一个允许跨域测试的插件，可以到 chrome 的扩展插件市场搜索并下载 CORS 相关的插件内容，地址是：https://chrome.google.com/webstore/search/cors?hl=en&_category=extensions

![image-20220501104139326](http://qn.chinavanes.com/qiniu_picGo/image-20220501104139326.png)

当插件安装成功以后，只需要点击启用该插件，那么当前项目在测试阶段就会突破 CORS 的跨域访问限制，运行项目则能够正常访问与显示接口内容了，这样可以省去项目配置文件中代理相关的操作内容。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220501104045409.png" alt="image-20220501104045409" style="zoom:50%;" />

所以当前可以将之前的XMLHttpRequest模式的ajax请求结合Promise进行一次简单的Ajax请求函数封装，可以将url抽离成动态参数，然后将XMLHttpRequest发送的请求内容通过Promise的resolve以及reject进行成功与失败信息的返回。当进行ajax自定义请求函数调用时则只需要传递'/apiPrefix/cms/banner'这一跨域代理设置以后的接口地址即可，如果成功请求到数据将直接返回一个json的对象，就算是失败也会返回失败产生的错误信息。

```vue
<script setup>
function ajax(url) {
  // 利用Promise将XMLHttpRequest封装成一个函数返回的结果
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    // 返回的数据类型为json格式
    xhr.responseType = 'json';
    xhr.send(null);
    // 当一个XMLHttpRequest请求完成的时候会触发load事件，onload可以对xhr进行监听
    xhr.onload = function () {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
  });
}

ajax('/apiPrefix/cms/banner')
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.log(error);
  });
</script>

<template>
  <div></div>
</template>
```

![image-20221118134634864](http://qn.chinavanes.com/qiniu_picGo/image-20221118134634864.png)

## 2)Fetch请求

也许有一部分人员对XMLHttpRequest并不熟悉，也不想耗费时间精力进行自定义Ajax请求的封装操作，那么这时候应该怎么办呢？因为上述的ajax请求函数的封装只是实现了最为基本的功能，仅仅抽离了url为动态参数，像method请求方式、headers报文信息、Content-type设置等众多内容都没有进行动态化的抽离，所以后续想要实现完整强大的自定义ajax还是比较繁琐的。那么，这时候可以考虑浏览器所自带的fetch请求函数。

Fetch是一种HTTP数据请求的方式，是XMLHttpRequest的一种替代方案。Fetch不是ajax的进一步封装，它们是两个东西。Fetch函数就是原生js，并没有使用XMLHttpRequest对象。

XMLHttpRequest 是一个设计粗糙的API，配置和调用方式非常混乱，而且基于事件的异步模型写起来也没有现代的 Promise，generator/yield，async/await 友好。

Fetch 的出现就是为了解决 XHR 的问题，它实现了 Promise 规范，返回 Promise 实例，而 Promise 是为解决异步回调问题而摸索出的一套方案。

比如上述利用XMLHttpRequest进行的ajax请求改用fetch原生浏览器请求函数就可以改造成异常简洁的代码内容。

```vue
<script setup>
fetch('/apiPrefix/cms/banner')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.log(err);
  });
</script>

<template>
  <div></div>
</template>
```

因为Fetch 就是ES6提供的一个异步接口，这样省的自己封装了。一个基本的fetch操作很简单，就是通过fetch请求，返回一个promise对象，然后在promise对象的then方法里面用fetch的response.json()等方法进行解析数据，由于这个解析返回的也是一个promise对象，所以需要两个then才能得到我们需要的json数据。

虽然fetch有诸多的优势，比如浏览器内置，代码语法简洁，更加语义化，而且基于标准 Promise 实现，支持 async、await等。但是fetch是一个低层次的API，你可以把它考虑成原生的XHR，所以使用起来并不是那么舒服，比如它不支持文件上传进度监测、默认不带 cookie、不支持请求终止、没有统一的请求响应拦截器、使用不完美，需要大量的功能封装等，这同样给开发带去了繁琐操作。