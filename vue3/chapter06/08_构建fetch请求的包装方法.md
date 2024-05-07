# 08.构建 fetch 请求的包装方法

到目前为止我们已经了解了在线模拟数据、自定义服务器模拟数据、json-server 与 mockjs 结合模拟数据的几种模拟数据的操作方式，也熟悉了 jquery 的 ajax 请求、fetch 的数据获取、利用第三方类库 axios 操作接口的操作等模式。最终在分析优势与不足以后根据实现的项目需求可能会屏弃在线模拟数据与自定义服务器模拟数据两种功能欠缺或者技术要求过高的模拟数据创建方法，也许还不再考虑 jquery 的 ajax 请求方式，那么可能还会想再深入了解一下 fetch 与 axios 的具体功能实现，那么接下来就对它们这两者在实际项目中的操作模式做进一步和探讨。

如果想进一步了解 fetch 的操作方式可以先仔细查阅一下它的参考文档，地址是：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch。虽然一个基本的 fetch 请求设置起来很简单，这在之前 fetch 的操作使用过程中已经被证实，但它还会有更多的操作方式属性设置与注意事项。fetch 同样是支持 rest api 请求操作模式的，这就意味着它同样支持 get、post、put、delete 等不同的请求方式，只不过不同的请求方式在 fetch 应用过程中需要注意不同的操作细节。比如 get 或 head 请求方法的时候请求是不能包含 body 信息的，而 post、put、delete 进行请求操作时 body 参数的传输方式有很多，如果 Content-Type 设置为 application/x-www-form-urlencoded 类型的时候需要利用 URL 查询字符串模式比如`name=atguigu&address=北京`进行传递，如果 Content-Type 设置为 application/json 类型的时候则需要利用`JSON.stringify({ name: 'atguigu', address: '上海' })`对象转字符串的模式进行传递，不同的参数设置才能在不同情况下实现程序的正常运行。当然 fetch 所提示的可设属性也是非常的多，除了常见的 method、headers、body 之处还有不常见的 mode、credentials、cache、redirect、referrer、referrerPolicy 以及 integrity 等。而且，fetch 对于请求返回的数据类型也需要通过转化进行识别，常见的返回数据类型像 json、文本、二进制、二进制数据缓冲区等，它们需要通过 json、text、blob、arrayBuffer 等不同的方法进行数据结果的转换操作。

对于 fetch 基本功能进行一定的了解可能还不够，对于项目来说，如何实现更好的代码书写调用与后期维护也是一个重要的内容，所以是根据页面中的功能每一次都进行一次大量属性设置的 fetch 请求还是想办法实现 fetch 请求功能的封装调用就是一个非常值得思考的问题。

接下来可以一起来熟悉 fetch 请求的包装方法具体操作流程，感受一下在封装完 fetch 请求以后和原来直接进行 fetch 函数调用会产生什么样的代码书写差别。

首先可以在项目的 src 目录下创建一个 request 子目录，并且在该目录下新建 baseFetch.js 的程序文件，将文件将会把 fetch 的基础请求操作中的动态内容进行参数化的抽离，主要包括 url、method、options 等内容。接下来需要对请求方式 method 进行条件判断，而 toUpperCase 的作用可以忽略用户在请求方式设置时的大小输入，并且需要区分 get 与 post 等其它不同的请求模式，因为之前已经强调 get 请求是不需要 body 参数的设置的，如果要操作应用中常用参数可以逐一设置，比如 cache，而对于不常用属性 options 可以通过扩展操作符进行统一对象的传递与展开自动拼接处理。对于最终数据的返回类型可以根据用户指定的数据类型需求返回 json、text、blob、formData、arrayBuffer 等，但是需要利用不同方法来进行数据类型结果的转换操作。

request/baseFetch.js

```js
// 封装基础fetch请求函数，将url、method、options动态内容进行参数化抽离
export default async (url, method, options = {}) => {
  // 设置请求返回变量
  let httpRequest;
  // 如果为get请求时是没有body参数的
  if (method.toUpperCase() === 'GET') {
    httpRequest = await fetch(url, {
      cache: 'reload',
      ...options,
    });
  } else {
    /*
    如果为post、put、delete请求时可以设置body参数
    content-type为x-www-form-urlencoded时，
    body设置需要URL查询字符串模式比如`name=atguigu&address=北京`

    content-type为application/json时，
    body设置需要`JSON.stringify({ name: 'atguigu', address: '上海' })`对象转字符串的模式
    */
    httpRequest = await fetch(url, {
      method: method.toUpperCase(),
      cache: 'reload',
      headers: {
        // 确认content-type
        'content-type': 'application/json',
      },
      ...options,
      // 对应content-type类型的body参数模式
      body: JSON.stringify(options.body),
    });
  }
  // 对于不同的返回数据类型需求进行不同的格式转换操作
  return (type) => {
    switch (type.toLocaleLowerCase()) {
      // json格式
      case 'json':
        return httpRequest.json();
      // 二进制格式
      case 'blob':
        return httpRequest.blob();
      // 文本格式
      case 'text':
        return httpRequest.text();
      // FormData对象格式
      case 'formdata':
        return httpRequest.formData();
      // 二进制数据缓冲区格式
      default:
        return httpRequest.arrayBuffer();
    }
  };
};
```

目前只是封装了最为基础的fetch请求函数，并没有相应的get、post、put、delete等获取、新增、修改与删除的操作确定，所以可以在request目录下再新建fetchApi.js文件将这几种常见的操作进行函数化封装。

现在可以将已经封装的基础fetch方法进行引入，因为get、post、put、delete的请求操作都将会依赖于基础fetch请求函数，然后只需要根据基础fetch请求函数的参数进行参数的设置与传递操作去分别拆分getHttp、postHttp、putHttp、deleteHttp请求函数即可，当然需要注意的是区分body参数的传递操作。

request/fetchApi.js

```js
// 引入基础fetch请求操作函数
import baseHttp from './baseFetch';

// get获取数据请求方法的封装，不设body参数传递，并且可以设置返回的数据类型
export const getHttp = async (url, type = 'json', options) =>
  (await baseHttp(url, 'get', options))(type);

// post新增数据的封装，可设置body参数，并且可以设置返回的数据类型
export const postHttp = async (url, body, type = 'json', options) =>
  (
    await baseHttp(url, 'post', {
      body,
      ...options,
    })
  )(type);

// put修改数据请求方法的封装，可设置body参数，并且可以设置返回的数据类型
export const putHttp = async (url, body, type = 'json', options) =>
  (
    await baseHttp(url, 'put', {
      body,
      ...options,
    })
  )(type);

// delete删除数据请求方法的封装，可设置body参数，并且可以设置返回的数据类型
export const deleteHttp = async (url, body, type = 'json', options) =>
  (
    await baseHttp(url, 'delete', {
      body,
      ...options,
    })
  )(type);

```

在完成了不同请求类型的fetch请求方法拆分封装以后，在当前的项目就可以考虑如何去调用它们就可以了。
