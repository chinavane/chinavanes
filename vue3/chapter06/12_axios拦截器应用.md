# 12.axios 拦截器应用

不同于fetch，我们选择axios其中一个非常重要的原因就是它的一项功能叫拦截器，这是fetch请求所没有的，如果想要给fetch实现拦截器功能就需要编写大量代码进行自定义的封装实现或者再安装类似fetch-intercept这样的其它第三方类库。所以，为什么不一步到位直接使用axios呢！

那么接下来了解一下axios的拦截器的功能，它一般分为两种：请求拦截器与响应拦截器。

请求拦截器：可以在请求发送前进行必要操作处理，例如添加统一cookie、请求体加验证、设置请求头等，相当于是对每个接口里相同操作的一个封装；

响应拦截器：同理，响应拦截器也是如此功能，只是在请求得到响应之后，对响应体的一些处理，通常是数据统一处理等，也常来判断登录失效等。

![vue3-book-15.axios拦截器](http://qn.chinavanes.com/qiniu_picGo/vue3-book-15.axios%E6%8B%A6%E6%88%AA%E5%99%A8.png)

比如一些网站过了一定的时间不进行操作，就会退出登录让你重新登陆页面，当然不用拦截器或许也可以完成这样的功能，但是会很麻烦而且代码会产生大量重复，所以可以尝试用拦截器进行更简单的操作。

axios的拦截器作用非常大，每个axios的实例都可以设置多个请求或者响应拦截，并且每个拦截器都可以设置两个拦截函数，一个为成功拦截，一个为失败拦截。在调用axios.request()之后，请求的配置会先进入请求拦截器中，正常可以一直执行成功拦截函数，如果有异常会进入失败拦截函数，并不会发起请求；调起请求响应返回后，会根据响应信息进入响应成功拦截函数或者响应失败拦截函数。

```js
// 
axios.interceptors.request.use(
  function (config) {
    // 请求成功拦截器
    return config;
  },
  function (error) {
    // 请求失败拦截器
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // 响应成功拦截器
    return response;
  },
  function (error) {
    // 响应失败拦截器
    return Promise.reject(error);
  }
);
```

