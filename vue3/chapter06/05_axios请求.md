# 05.axios请求

## 1)axios基本请求实现

为了解决XMLHttpRequest的ajax请求封装复杂性以及fetch这一底层API接口的二次封装繁琐性以及增加请求响应等拦截器的常用功能，我们可以考虑使用第三方类库axios。axios是一个基于promise可以用于浏览器和node.js的网络请求库，作用于node.js和浏览器中。 它是isomorphic 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js 的`http` 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests实现。因为axios作者对于请求操作已经在axios这第三方库中进行了常用功能的完美封装，所以开发人员想实现网络请求功能只需要直接安装使用它即可，那么我们就会拥有axios带来的诸多新的特性内容，主要包括：

- 支持从浏览器创建XMLHttpRequests
- 支持从 node.js 创建 http请求
- 支持Promise API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换JSON数据
- 客户端支持防御XSRF

现在可以在项目中进行axios模块的安装，然后在项目中引入方可使用它。

```bash
npm install axios --save
```

原先ajax与fetch的请求操作代码示例就可以切换成axios代码模式，看起来它的代码调用也异常的清爽简洁。

```vue
<script setup>
import axios from 'axios';
axios
  .get('/apiPrefix/cms/banner')
  .then(function (res) {
    // axios中将返回response响应数据对象，从res中可以获取到data数据
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });
</script>

<template>
  <div></div>
</template>
```

我们在请求了正式swagger接口以后还可以尝试请求原先使用json-server与mockjs相结合构建的模拟数据接口，细心的读者会发生这种模式构建的模拟数据接口在请求时并没出现跨域问题，这是因为json-server已经内置协助在服务器端处理了CORS跨域问题。

```vue
<script setup>
import axios from 'axios';
// 请求json-server与mockjs结合的模拟数据接口不会产生跨域问题
// json-server服务器内容处理了cors
axios
  .get(' http://localhost:5000/users')
  .then(function (res) {
    // axios中将返回response响应数据对象，从res中可以获取到data数据
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(err);
  });
</script>

<template>
  <div></div>
</template>

```

## 2)axios项目功能集成

不管是自定义ajax、fetch还是axios，在实际的复杂项目中通常都不会进行直接请求操作，必须会进行更进一步请求的再次封装以简化后续出现的代码重用的繁杂问题。接下来我们将以axios为示例，结合json-server与mockjs模拟出来的接口数据进行实际项目中请求的代码封装应用操作。

### 1]请求的基本封装

首先可以在项目的 src 目录下创建一个 request 子目录，可以在 request 目录中新建 baseAxios.js，在引入 axios 类库以后对 axios 的请求进行基础请求封装操作，因为 axios 默认是返回 json 数据类型，所以对于绝大多数接口请求操作已经适用，至于如果出现 text、blob、ArrayBuffer 等其它类型的数据返回到时可以传递 options 可选项内容即可。

request/baseAxios.js

```js
// 引入axios第三方类库
import axios from 'axios';
// 封装基础axios请求函数，将url、method、options动态内容进行参数化抽离
export default async (url, method, options = {}) =>
  axios({
    method: method.toUpperCase(),
    url,
    ...options,
  });
```

当然还需要在 request 目录下创建 axiosApi.js 的程序文件，在该文件中利用 baseAxios 进行 getHttp、postHttp、putHttp、deleteHttp 的请求功能封装。axios 对于 get 请求的参数是可以设置到 params 对象属性中的，也就是说除了可以直接设置 URL 的 query 参数进行 URL 的拼接以外还可以利用 params 将 query 参数进行对象化的转化传递操作，至于 post、put、delete 中可以直接传递 data 数据，虽然 axios 中的 content-type 默认为 application/x-www-form-urlencoded，但是对于 data 数据对象内部也会自动对象序列化为 JSON。

request/axiosApi.js

```js
// 引入基础axios请求操作函数
import baseHttp from './baseAxios';

// get获取数据请求方法的封装，可设置params参数传递
// 需要注意axiox中的params参数对应的是URL组成部分中的query查询项参数
export const getHttp = async (url, params, options) =>
  baseHttp(url, 'get', {
    ...options,
    params,
  });

// post新增数据的封装，可设置data参数传递
export const postHttp = async (url, data, options) =>
  baseHttp(url, 'post', {
    data,
    ...options,
  });

// put修改数据的封装，可设置data参数传递
export const putHttp = async (url, data, options) =>
  baseHttp(url, 'put', {
    data,
    ...options,
  });

// delete删除数据的封装，可设置data参数传递
export const deleteHttp = async (url, data, options) =>
  baseHttp(url, 'delete', {
    data,
    ...options,
  });
```

在进行了axiosApi请求的功能封装以后，尝试修改components下的HelloWorld.vue组件，可以直接将 getHttp, postHttp, putHttp, deleteHttp 方法进行局部引入，引入的来源如果使用@别名符号则需要修改 vite.config.js 配置文件加入别名与扩展名的支持，这部分的内容已经在前面章节中介绍，在此不再复述，那么请求的时候则可以直接使用 getHttp 方法进行 get 模式的接口请求操作。

components/HelloWorld.vue

```vue
<script setup>
import { getHttp, postHttp, putHttp, deleteHttp } from '@/request/axiosApi';
const result = await getHttp('http://localhost:5000/users');
console.log(result);
</script>

<template></template>
```

对于App.vue根组件中需要引入与调用HelloWorld.vue子组件，然后运行项目进行测试。

App.vue

```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <HelloWorld />
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

![image-20221118151221977](http://qn.chinavanes.com/qiniu_picGo/image-20221118151221977.png)

运行当前项目查看调试控制台则会看到有一个warn警告信息，需要在App.vue这个父组件中利用Suspense进行异步挂起处理，这样的话HelloWorld这个子组件中在进行异步请求没有完成的情况下可以显示一定的提示内容，因为Suspense中有default默认插槽与fallback备用插槽两个插槽内容的显示应用，如果在网速很慢的情况下，界面中将会先显示“数据加载中...”的文本信息，如果请求已经完成则会显示HelloWorld的组件内容。

```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <HelloWorld />
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



既然已经成功的调用到了getHttp的请求方法，那么postHttp、putHttp、deleteHttp又应该如何实现呢？我想可以先将getHttp的用户列表获取进行getUsers函数化的封装操作，并且默认需要调用该函数以便获取到用户列表。然后编写postUser新增用户、putUser修改用户、deleteUser删除用户的操作，可以利用不同的请求方式进行接口的调用并设置post与put请求时需要的body参数内容，因为在baseFetch封装时确认的content-type类型为application/json，所以现在只需要进行对象化的参数设置即可，只不过目前设置的是一些静态的数据内容。不过，在新增、修改、删除请求以后需要重新调用getUsers获取用户函数以便获取到最新的用户列表。

至于template模板部分，只需要添加一个button进行postUser函数的事件绑定，再在列表中添加两个a链接，对putUser与deleteUser这两个函数进行事件绑定操作，那么现在就可以实现对用户的添加、修改、删除以及列表查看操作了。

components/HelloWorld.vue

```vue {7-42,49-59}
<script setup>
import { ref } from 'vue';
// 直接将getHttp, postHttp, putHttp, deleteHttp方法进行局部引入
import { getHttp, postHttp, putHttp, deleteHttp } from '@/request/axiosApi';
const users = ref(null);
const error = ref(null);
const avatar = ref(null);
const postUser = async () => {
  // 利用postHttp方法直接进行请求，新增用户
  const result = await postHttp('http://localhost:5000/users', {
    name: 'atguigu',
    address: '北京',
    avatar: 'http://dummyimage.com/100x100/b6f279/FFF&text=atguigu',
  });
  getUsers(); // 重新获取用户列表
};
const putUser = async (id) => {
  // 利用putHttp方法直接进行请求，修改用户
  const result = await putHttp(`http://localhost:5000/users/${id}`, {
    name: '尚硅谷',
    address: '北京',
    avatar: 'http://dummyimage.com/100x100/b6f279/FFF&text=atguigu',
  });
  getUsers(); // 重新获取用户列表
};
const deleteUser = async (id) => {
  // 利用deletetHttp方法直接进行请求，删除用户
  const result = await deleteHttp(`http://localhost:5000/users/${id}`);
  getUsers(); // 重新获取用户列表
};

const getUsers = async () => {
  try {
    // 利用getHttp方法直接进行请求，URL的query查询项组成可以在get请求中对应到params参数对象
    //  const result = await getHttp(
    //   'http://localhost:5000/users?_page=1&_limit=5&_sort=id&_order=desc'
    // );
    const result = await getHttp('http://localhost:5000/users', {
      _page: 1,
      _limit: 5,
      _sort: 'id',
      _order: 'desc',
    });
    // axios请求的结果内容默认返回的是json类型，但是结果值被设置到data属性当中
    users.value = result.data;
  } catch (e) {
    error.value = e;
  }
};

getUsers();
</script>

<template>
  <div v-if="error">error:{{ error }}</div>
  <ul v-for="user in users" :key="user.id">
    <li>
      {{ user.id }}
      &nbsp;
      {{ user.name }}
      <a href="javascript:void(0)" @click="putUser(user.id)">修改</a>
      &nbsp;
      <a href="javascript:void(0)" @click="deleteUser(user.id)">删除</a>
    </li>
  </ul>
  <button @click="postUser">新增用户</button>
</template>

```

![image-20221118153625072](http://qn.chinavanes.com/qiniu_picGo/image-20221118153625072.png)

### 2]axios 的 instance 实例应用

接下来我们将了解的是 axios 的 instance 也就是实例的创建与应用。对于 axios 的实例也许我们会存在一系的问题，比如：axios 为什么创建实例？为什么会考虑创建不同实例？axios 创建实例作用是什么？可以不创建实例吗？

其实在使用 axios 时默认会导出实例 axios，并且通常只需使用这个 axios 就可以了，所以说一般情况下我们仅需要单个 axios 的实例。我们可以给这些实例设置一些默认配置，这样这些配置项就不需要每次操作，很典型的一个需求就是之前的 fetch 与 axios 请求，在 get、post、put、delete 请求过程中都需要设置 http://localhost:5000 这个前缀地址。想象一下，如果这个接口地址发生改变，那么对应的代码量需要多少内容进行修改，这是非常可怕的一件事情。所以，如果能够进行一次性的基础设置，到时候不管 http://localhost:5000 切换什么其它什么地址，仅仅需要修改一个位置就能牵一发而动全身了。

当然，后续开发中某些配置或许会不一样，如 timeout，content-type、authorization、token 等，这时我们就可以创建新的实例，并传入属于该实例的配置信息，这就是多实例的需求。

因为项目开发过程中有时候确实需要创建多个实例，比如需要访问多个服务地址，而这些服务请求和响应的结构都完全不同，那么就可以通过 axios.create 创建不同的实例来处理。

当前项目包含用户模块，对应也就会有用户接口，假若这些用户接口是在某一台服务器上，这时候就需要创建 axios 的一个实例，因为这一台的服务器的 content-type 可能设置为 application/x-www-form-urlencoded。但当前项目中可能还包含支付模块，并且支付模块的接口与用户模块的接口并不在同一台服务器上，关键的是支付接口的 content-type 类型约束可能是 application/json，那么这就产生了不同的接口设置项不同，除了 content-type 之外可能还会存在其它属性设置的差异或者是状态码等内容的区别，所以这就需要我们为支付接口其创建不同的 axios 请求实例进行区分。

现在可以先修改request下的baseAxios.js程序文件，添加一个createAxios这是创建axios实例的方法，然后利用它先构建一个localApi，将之前的axios请求替换成localApi的请求操作，这样的话fetchAxios.js中的getHttp、postHttp、putHttp、deleteHttp将会使用localApi这一个axios实例配置。然后可以利用createAxios再构建一个jsonServerApi的axios实例对象，并且配置了最为基础的baseURL基础路径前缀，设置为http://loclahost:5000的接口前缀地址。

request/baseAxios.js

```js
// 引入axios第三方类库
import axios from 'axios';

// 创建axios实例方法
export function createAxios(options = {}) {
  return axios.create({
    ...options,
  });
}

// 创建localApi实例对象
const localApi = createAxios();

// 封装基础axios请求函数，将url、method、options动态内容进行参数化抽离
export default async (url, method, options = {}) =>
  localApi({
    method: method.toUpperCase(),
    url,
    ...options,
  });

// 创建jsonServerApi实例对象
export const jsonServerApi = createAxios({
  baseURL: 'http://localhost:5000/',
});
```

这样可以在request目录下新建立userApi.js这个用户接口管理文件，在引入jsonServerApi这个axios实例对象以后就可以利用它进行请求接口的封装操作，目前只封装了一个getUserById根据id获取用户信息的方法，注意在jsonServerApi.get请求调用的时候并没有设置接口的基础请求前缀路径地址。

request/usersApi.js

```js
// 引入jsonServerApi实例对象
import { jsonServerApi } from './baseAxios';
// 利用jsonServerApi实例对象进行请求接口的封装
export const getUserById = async (id) => jsonServerApi.get(`users/${id}`);
```

那么在HelloWorld.vue组件中也可以直接引入getUserById的接口请求函数，然后创建一个viewUserById的回调函数调用getUserById的接口请求函数并进行结果打印，接下来只需要在template模板层进行对应的viewUserById的回调函数事件绑定操作即可实现回调函数的调用与接口请求的处理。

components/HelloWorld.vue

```vue {5,41-45,82-83}
<script setup>
import { ref } from 'vue';
// 直接将getHttp, postHttp, putHttp, deleteHttp方法进行局部引入
import { getHttp, postHttp, putHttp, deleteHttp } from '@/request/axiosApi';
import { getUserById } from '@/request/usersApi';
const users = ref(null);
const error = ref(null);
const avatar = ref(null);
const postUser = async () => {
  // 利用postHttp方法直接进行请求，新增用户
  const result = await postHttp('http://localhost:5000/users', {
    name: 'atguigu',
    address: '北京',
    avatar: 'http://dummyimage.com/100x100/b6f279/FFF&text=atguigu',
  });
  getUsers(); // 重新获取用户列表
};
const putUser = async (id) => {
  // 利用putHttp方法直接进行请求，修改用户
  const result = await putHttp(`http://localhost:5000/users/${id}`, {
    name: '尚硅谷',
    address: '北京',
    avatar: 'http://dummyimage.com/100x100/b6f279/FFF&text=atguigu',
  });
  getUsers(); // 重新获取用户列表
};
const deleteUser = async (id) => {
  // 利用deletetHttp方法直接进行请求，删除用户
  const result = await deleteHttp(`http://localhost:5000/users/${id}`);
  getUsers(); // 重新获取用户列表
};

// 通过id查看用户信息
const viewUserById = async (id) => {
  const result = await getUserById(id);
  console.log(result);
};

const getUsers = async () => {
  try {
    // 利用getHttp方法直接进行请求，URL的query查询项组成可以在get请求中对应到params参数对象
    //  const result = await getHttp(
    //   'http://localhost:5000/users?_page=1&_limit=5&_sort=id&_order=desc'
    // );
    const result = await getHttp('http://localhost:5000/users', {
      _page: 1,
      _limit: 5,
      _sort: 'id',
      _order: 'desc',
    });
    // axios请求的结果内容默认返回的是json类型，但是结果值被设置到data属性当中
    users.value = result.data;
  } catch (e) {
    error.value = e;
  }
};

getUsers();
</script>

<template>
  <div v-if="error">error:{{ error }}</div>
  <ul v-for="user in users" :key="user.id">
    <li>
      {{ user.id }}
      &nbsp;
      {{ user.name }}
      <a href="javascript:void(0)" @click="putUser(user.id)">修改</a>
      &nbsp;
      <a href="javascript:void(0)" @click="deleteUser(user.id)">删除</a>
      &nbsp;
      <a href="javascript:void(0)" @click="viewUserById(user.id)">查看详情</a>
    </li>
  </ul>
  <button @click="postUser">新增用户</button>
</template>

```

需要强调的是在getUserById接口请求函数调用的时候并没有设置请求的地址也没有强调http://localhsot:5000的请求前缀，因为这些配置项内容都已经在jsonServerApi的axios实例中设置了。

![image-20221118163416912](http://qn.chinavanes.com/qiniu_picGo/image-20221118163416912.png)

### 3]axios 拦截器应用

不同于fetch，我们选择axios其中一个非常重要的原因就是它的一项功能叫拦截器，这是fetch请求所没有的，如果想要给fetch实现拦截器功能就需要编写大量代码进行自定义的封装实现或者再安装类似fetch-intercept这样的其它第三方类库。所以，为什么不一步到位直接使用axios呢！

那么接下来了解一下axios的拦截器的功能，它一般分为两种：请求拦截器与响应拦截器。

请求拦截器：可以在请求发送前进行必要操作处理，例如添加统一cookie、请求体加验证、设置请求头等，相当于是对每个接口里相同操作的一个封装；

响应拦截器：同理，响应拦截器也是如此功能，只是在请求得到响应之后，对响应体的一些处理，通常是数据统一处理等，也常来判断登录失效等。

![vue3-book-15.axios拦截器](http://qn.chinavanes.com/qiniu_picGo/vue3-book-15.axios%E6%8B%A6%E6%88%AA%E5%99%A8.png)

比如一些网站过了一定的时间不进行操作，就会退出登录让你重新登陆页面，当然不用拦截器或许也可以完成这样的功能，但是会很麻烦而且代码会产生大量重复，所以可以尝试用拦截器进行更简单的操作。

axios的拦截器作用非常大，每个axios的实例都可以设置多个请求或者响应拦截，并且每个拦截器都可以设置两个拦截函数，一个为成功拦截，一个为失败拦截。在调用axios.request()之后，请求的配置会先进入请求拦截器中，正常可以一直执行成功拦截函数，如果有异常会进入失败拦截函数，并不会发起请求；调起请求响应返回后，会根据响应信息进入响应成功拦截函数或者响应失败拦截函数。

```js
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

### 4]请求二次封装的主要内容

请求的二次封装主要就是对 axios 以及 axios 的实例对象进行一些全局基础属性的设置以及利用请求与响应拦截器进行一些功能的统一性操作。

#### 1)axios 全局基础属性设置

如果想要对所有 axios 请求进行全局的属性设置可以考虑对 axios.defaults 的相关属性进行操作，这样的处理方式将会影响到 axios 的所有实例对象，在当前项目中将会影响到 localApi 以及 jsonServerApi 这两个 axios 实例对象，比如说可以尝试给 axios.defaults 设置 headers 头信息，并且设置公共的 Authorization 属性，内容暂定为 AUTH_TOKEN 的字符串。刷新应用会看到用户列表这一请求中的 request 部分就包含了 Authorization 的请求头信息，内容就是字符串 AUTH_TOKEN，而这一请求实际上是调用了 localApi 的 axios 实例方法。如果我们点击查看用户详情，这时查看对应的请求报文信息，则会看到同样在 request 请求部分也包含了 Authorization 的请求头信息，内容同样是字符串 AUTH_TOKEN。这就证实了 axios 的全局属性设置已经作用到了 localApi 与 jsonServerApi 这两个 axios 实例对象，实现了全局影响所有 axios 实例的目标。

request/baseAxios.js

```js {3-4}
// 引入axios第三方类库
import axios from 'axios';
// 全局设置axios请求的headers头信息
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

// 创建axios实例方法
export function createAxios(options = {}) {
  return axios.create({
    ...options,
  });
}
// 创建localApi实例对象
const localApi = createAxios();

// 封装基础axios请求函数，将url、method、options动态内容进行参数化抽离
export default async (url, method, options = {}) =>
  localApi({
    method: method.toUpperCase(),
    url,
    ...options,
  });

// 创建jsonServerApi实例对象
export const jsonServerApi = createAxios({
  baseURL: 'http://localhost:5000/',
});
```

![image-20221118163844136](http://qn.chinavanes.com/qiniu_picGo/image-20221118163844136.png)

![image-20221118163922435](http://qn.chinavanes.com/qiniu_picGo/image-20221118163922435.png)

#### 2)axios 实例基础属性设置

除了全局还可以针对某一实例进行实例基础属性的设置操作，如果并不想给 localApi 进行更多功能的扩展，只考虑给 jsonServerApi 实例对象进行其它基础属性的设置，那么可以考虑在创建时进行基础属性的统一设置：

```js
export const jsonServerApi = createAxios({
  baseURL: 'http://localhost:5000/',
  // 可以创建实例的时候统一设置
  timeout: 1000 * 20, // 请求超时时长
  headers: { 'X-Custom-Header': 'foo' }, // header头信息中自定义头信息设置
});
```

也可以考虑利用实例对象进行基础属性的逐一设置：

```js
// 也可以利用实例进行分开设置
// 请求超时时长
jsonServerApi.defaults.timeout = 1000 * 20;
// header头信息中自定义头信息设置
jsonServerApi.defaults.headers.common['X-Custom-Header'] = 'foo';
```

request/baseAxios.js

```js {23-35}
// 引入axios第三方类库
import axios from 'axios';
// 全局设置axios请求的headers头信息
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

// 创建axios实例方法
export function createAxios(options = {}) {
  return axios.create({
    ...options,
  });
}
// 创建localApi实例对象
const localApi = createAxios();

// 封装基础axios请求函数，将url、method、options动态内容进行参数化抽离
export default async (url, method, options = {}) =>
  localApi({
    method: method.toUpperCase(),
    url,
    ...options,
  });

// 创建jsonServerApi实例对象
// 利用实例方式设置axios的基础属性
export const jsonServerApi = createAxios({
  baseURL: 'http://localhost:5000/',
  // 可以创建实例的时候统一设置
  timeout: 1000 * 20, // 请求超时时长
  headers: { 'X-Custom-Header': 'foo' }, // header头信息中自定义头信息设置
});
// 也可以利用实例进行分开设置
// 请求超时时长
// jsonServerApi.defaults.timeout = 1000 * 20;
// header头信息中自定义头信息设置
// jsonServerApi.defaults.headers.common['X-Custom-Header'] = 'foo';
```

这时测试项目的接口请求，在进行用户列表这个 localApi 实例请求操作时 request 请求部分并不会包含 X-Custom-Header 的头信息内容，而在进行用户详情这个 jsonServerApi 实例请求操作时 request 请求部分则会包含 X-Custom-Header 的头信息内容。

![image-20220502222439649](http://qn.chinavanes.com/qiniu_picGo/image-20220502222439649.png)

![image-20220502222459126](http://qn.chinavanes.com/qiniu_picGo/image-20220502222459126.png)

#### 3)利用拦截器进行更多请求二次封装功能扩展

如果使用了实例对象的拦截器操作并且同样设置了全局或者实例属性中的内容，比如 headers 头信息，那么最终将会以拦截器操作为最高优先级，覆盖全局与实例基础属性设置。

比如给 jsonServerApi 实例对象进行 request 请求拦截，并且同样设置了 headers 的一些基础属性内容，包括 content-type 以及 token 属性，并没有设置 Authorization 或者 X-Custom-Header 的属性值，但是在进行用户详情接口操作时 Authorization 以及 X-Custom-Header 头信息的内容将不覆存在，只会保留 token 的 headers 头信息内容。

在实际项目中通常在请求拦截器里设置 token 口令以确保用户身份，这样在没有登陆没有进行授权的情况下对于一些敏感数据的接口就不开放接口请求的操作，让系统能够更加的安全。

```js
// 给jsonServerApi这一axios实例添加request请求拦截器
jsonServerApi.interceptors.request.use(
  function (config) {
    // 可以在请求的时候固定设置content-type以及token等信息内容
    config.headers = {
      'content-type': 'application/json',
      token:
        'This is the uniform setting content of the token in the request interceptor',
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
```

![image-20220502223814295](http://qn.chinavanes.com/qiniu_picGo/image-20220502223814295.png)

那么在响应拦截器中一般我们又会进行哪些设置呢？其实主要分成两大部分：

- 在 error 异常捕获部分可以利用 http 的状态码进行错误类型的判断，并且根据 http 状态码手动设置错误提示信息，当然最后可以将错误内容进行收集或者统一进行 UI 界面的反馈操作以增强用户体验。

- 对于正常有响应内容返回的情况也需要谨慎处理，因为并不是有响应内容就代表一定有你需要的返回数据信息，因为不同的接口项目可能会根据不同的应用情况返回带有一定企业自定义编码的结果数据，比如接口服务器返回数据：

  ```json
  {
    "code": 40003,
    "message": "你没有足够的权限访问此数据",
    "data": null
  }
  ```

  这里的 code 是企业自定义的一个编码内容，它与 http 状态码没有任何的关系，而且不同的公司接口类似的 code 码代表的意义都不同，就算是同一公司不同的项目可能也会代表不同的意义。并且很有可能返回的 data 结果数据就是为 null，这样你就无法得到想要的数据结果内容了，所以可以考虑在成功响应部分对企业的 code 码进行条件的判断，并且给以一定的操作提示。

  目前的项目接口中并不包含企业 code 码部分内容，所以暂时无需进行对应的功能扩展，如果有需要则可以考虑将 response 响应信息内容进行重组再进行返回，比如在 response 响应拦截器中可以进行 return 对象自定义的对象数据。

  ```js
  // 可以返回指定对象，包括请求状态码(或者企业code码）、状态提示文本(或者企业状态提示文本)、返回数据等
  return {
    code: response.status, // 可以是请求状态码(或者企业code码）
    message: response.statusText, // 可以是状态提示文本(或者企业状态提示文本)
    data: response.data, // 响应数据内容
  };
  ```

  而当前的接口数据操作功能比较单一，或者也可以将直接将 response.data 用户所需内容直接返回，至少组件中不需要每次都去操作 data 属性节点。

  request/baseAxios.js

  ```js {53-122}
  // 引入axios第三方类库
  import axios from 'axios';
  // 全局设置axios请求的headers头信息
  axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
  
  // 创建axios实例方法
  export function createAxios(options = {}) {
    return axios.create({
      ...options,
    });
  }
  // 创建localApi实例对象
  const localApi = createAxios();
  
  // 封装基础axios请求函数，将url、method、options动态内容进行参数化抽离
  export default async (url, method, options = {}) =>
    localApi({
      method: method.toUpperCase(),
      url,
      ...options,
    });
  
  // 创建jsonServerApi实例对象
  // 利用实例方式设置axios的基础属性
  export const jsonServerApi = createAxios({
    baseURL: 'http://localhost:5000/',
    // 可以创建实例的时候统一设置
    // timeout: 1000 * 20, // 请求超时时长
    // headers: { 'X-Custom-Header': 'foo' }, // header头信息中自定义头信息设置
  });
  // 也可以利用实例进行分开设置
  // 请求超时时长
  jsonServerApi.defaults.timeout = 1000 * 20;
  // header头信息中自定义头信息设置
  jsonServerApi.defaults.headers.common['X-Custom-Header'] = 'foo';
  
  // 给jsonServerApi这一axios实例添加request请求拦截器
  jsonServerApi.interceptors.request.use(
    function (config) {
      // 可以在请求的时候固定设置content-type以及token等信息内容
      config.headers = {
        'content-type': 'application/json',
        token:
          'This is the uniform setting content of the token in the request interceptor',
      };
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  // 给jsonServerApi这一axios实例添加response响应拦截器
  jsonServerApi.interceptors.response.use(
    function (response) {
      // 请求能够正常响应不代表一定能够获取到服务器返回的数据
      // 有时候请求成功服务器却会因为具体的业务场景返回一定的错误企业编码与数据信息
  
      // 可以返回指定对象，包括请求状态码(或者企业code码）、状态提示文本(或者企业状态提示文本)、返回数据等
      // return {
      //   code: response.status,
      //   message: response.statusText,
      //   data: response.data,
      // };
  
      // 也可以将直接将response.data用户所需内容直接返回，组件中不需要每次都去操作data属性节点
      return response.data;
    },
    function (error) {
      // 利用http状态码可以实现不同情况接口错误内容的收集与反馈操作
      if (error && error.response) {
        // 判断http请求的状态码，并设置不同的错误提示信息
        switch (error.response.status) {
          case 400:
            error.message = '错误请求';
            break;
          case 401:
            error.message = '未授权，请重新登录';
            break;
          case 403:
            error.message = '拒绝访问';
            break;
          case 404:
            error.message = '请求错误,未找到该资源';
            break;
          case 405:
            error.message = '请求方法未允许';
            break;
          case 408:
            error.message = '请求超时';
            break;
          case 500:
            error.message = '服务器端出错';
            break;
          case 501:
            error.message = '网络未实现';
            break;
          case 502:
            error.message = '网络错误';
            break;
          case 503:
            error.message = '服务不可用';
            break;
          case 504:
            error.message = '网络超时';
            break;
          case 505:
            error.message = 'http版本不支持该请求';
            break;
          default:
            error.message = `连接错误${error.response.status}`;
        }
        let errorData = {
          code: error.response.status,
          message: error.message,
        };
        // 统一错误处理可以放这，例如页面提示错误...
        console.log('统一错误处理: ', errorData);
      }
      return Promise.reject(error);
    }
  );
  ```

所以，对于请求二次封装的主要内容可以做一定的总结，主要包括：

- 类似 baseURL 接口前缀路径、timeout 请求超时这样的基础属性内容的设置
- 对于 authorization、token、content-type 这样的 headers 头信息的统一设置
- 利用 http 状态码进行请求错误的统一判断，将错误信息进行统一收集与提示操作
- 将接口返回的数据进行进一步的条件判断，并且根据需求返回指定格式的数据内容

当然，对于请求的二次封装最终还是需要根据不同的项目进行具体的封装扩展操作。

### 5]项目接口的统一管理

现在对于axios的接口操作其实分成了两种模式，在baseAxios模块中包含了localApi与jsonServerApi两个实例对象，它们也代表了两种模式模式，localApi对应的是axiosApi当然的getHttp、postHttp、putHttp与deleteHttp基础请求函数的封装功能，而jsonServerApi对应的是userApi当中具体实现的getUserById的直接接口封装操作。前者需要在组件中进行不同的功能的不同操作请求，并且需要在接口函数调用函数的时候传递相应的地址参数等内容，接口请求的代码相对来说比较分散，维护成本看起来还是比较高的。而后者在组件中可以进行接口函数的直接调用，不需要考虑到底进行的是get、post、put还是delete操作，看上去不光代码量相对较少，而且代码的理解与维护层度更高，并且随着项目功能模块的不断增加可以构建newsApi、productApi、orderApi等不同的接口模块，在不同的模块里对不同的模块进行更为统一的接口封装管理，项目的层次结构也将会显得更为的清晰，所以说在项目中进行接口的统一管理显得极其的重要。

现在可以将组件中具体功能需求的接口操作进行用户接口模块的统一迁移操作，比如getUsersList获取用户列表、addUser新增用户、updateUser修改用户、removeUser删除用户以及getUserAvatar查看头像等操作都可以在userApi.js中进行统一定义，在这些功能函数封装时已经确认了get、post、put还是delete操作模式，所以说在组件中调用根本不需要关心，而且在这一接口模块中进行代码查看则可以基本明确对于用户模块将会进行哪些接口操作，有更好的统筹视角。

request/userApi.j

```js
// 引入jsonServerApi实例对象
import { jsonServerApi } from './baseAxios';
// 利用jsonServerApi实例对象进行请求接口的封装

// 通过id获取用户信息
export const getUserById = async (id) => jsonServerApi.get(`users/${id}`);

// 用户列表
export const getUsersList = async (params) =>
  jsonServerApi.get(`users`, { params });

// 新增用户
export const addUser = async (data) => jsonServerApi.post(`users`, data);

// 修改用户
export const updateUser = async (id, data) =>
  jsonServerApi.put(`users/${id}`, data);

// 删除用户
export const removeUser = async (id) => jsonServerApi.delete(`users/${id}`);

// 查看头像
export const getUserAvatar = async (user) => {
  const result = await jsonServerApi.get(user.avatar, { responseType: 'blob' });
  // 在响应拦截中已经返回response.data，所以可以直接获取请求的结果数据
  return URL.createObjectURL(result);
};
```

接下来还需要在request目录中再新建index.js程序文件，该文件的主要作用是起到接口管理的统一入口功能。试想一下，如果没有一个统一的入口，那么在组件中进行不同的模块接口引入时可能一会要引入userApi一会又要引入productApi，那样的话将会十会的混乱。但是通过index.js这个接口的统一入口，则可以将所有模块的接口在此入口中进行引入然后再一次性统一暴露出去以供组件等内容进行访问使用。

request/index.js

```js
// 利用request目录的index.js默认主程序进行所有模块的统一管理
// 可以将不同的模块接口函数进行统一导入并导出
export {
  getUserById,
  getUsersList,
  addUser,
  updateUser,
  removeUser,
  getUserAvatar,
} from './usersApi'; // 统一从用户模块引入用户接口请求函数并暴露

// 以后还可以引入其它模块接口函数并暴露

```

回到HelloWorld.vue组件，可以将axiosApi中的getHttp、postHttp、putHttp、deleteHttp模块引入内容进行删除，然后从request的接口入口模块中将getUserById、 getUsersList、addUser、updateUser、 removeUser、getUserAvatar等接口操作函数进行引入，然后对于获取用户列表、新增用户、修改用户、删除用户、查看用户以及查看用户头像内容进行接口封装函数的直接调用就行，还是需要强调一下因为在axios的jsonServerApi实例中进行了响应拦截器操作，直接返回了response.data的内容，所以现在可以直接获取到接口返回的内容值而不需要再通过result.data获取。

```vue {3-11,16-21,25-30,36-37,43-44,56-62}
<script setup>
import { ref } from 'vue';
// 所有接口请求方法都从request/index.js统一入口进行引入操作
import {
  getUserById,
  getUsersList,
  addUser,
  updateUser,
  removeUser,
  getUserAvatar,
} from '@/request';
const users = ref(null);
const error = ref(null);
const avatar = ref(null);
const postUser = async () => {
  // 调用addUser统一接口函数，新增用户
  const result = await addUser({
    name: 'atguigu',
    address: '北京',
    avatar: 'http://dummyimage.com/100x100/b6f279/FFF&text=atguigu',
  });
  getUsers(); // 重新获取用户列表
};
const putUser = async (id) => {
  // 调用updateUser统一接口函数，修改用户
  const result = await updateUser(id, {
    name: '尚硅谷',
    address: '北京',
    avatar: 'http://dummyimage.com/100x100/b6f279/FFF&text=atguigu',
  });

  getUsers(); // 重新获取用户列表
};

const deleteUser = async (id) => {
  // 调用removeUser统一接口函数，删除用户
  const result = await removeUser(id);
  getUsers(); // 重新获取用户列表
};

// 查看头像
const viewAvatar = async (user) => {
  // 调用getUserAvatar统一接口函数，获取用户头像
  avatar.value = await getUserAvatar(user);
};

// 通过id查看用户信息
const viewUserById = async (id) => {
  // 调用getUserById统一接口函数，查看详情
  const result = await getUserById(id);
  console.log(result);
};

const getUsers = async () => {
  try {
    // 调用getUsersList统一接口函数，获取用户列表
    users.value = await getUsersList({
      _page: 1,
      _limit: 5,
      _sort: 'id',
      _order: 'desc',
    });
  } catch (e) {
    error.value = e;
  }
};

getUsers();
</script>

<template>
  <div v-if="error">error:{{ error }}</div>
  <img v-if="avatar" :src="avatar" style="width: 100px" />
  <ul v-for="user in users" :key="user.id">
    <li>
      {{ user.id }}
      &nbsp;
      {{ user.name }}
      <a href="javascript:void(0)" @click="putUser(user.id)">修改</a>
      &nbsp;
      <a href="javascript:void(0)" @click="deleteUser(user.id)">删除</a>
      &nbsp;
      <a href="javascript:void(0)" @click="viewAvatar(user)">查看头像</a>
      &nbsp;
      <a href="javascript:void(0)" @click="viewUserById(user.id)">查看详情</a>
    </li>
  </ul>
  <button @click="postUser">新增用户</button>
</template>

```

接下来进行项目功能的测试，可以确认用户列表、添加、修改、删除、查看用户等功能都没有任何的问题，但是在进行用户头像查看的时候则程序报了跨域问题的错误，但这时你可以确认就算浏览器的CORS unblock插件已经打开这个错误依旧无法进行解决。

![image-20220503130145068](http://qn.chinavanes.com/qiniu_picGo/image-20220503130145068.png)

产生这个错误的原因是什么呢？事实上我们确实也请求了其它不同的网站的图片资源存在一定的跨域问题，但因为在测试阶段，所以打开了CORS unblock的浏览器插件，那么按此预估就不该再有跨域问题的产生。但是因为之前在进行jsonServerApi请求拦截器操作的时候有强行设置content-type以及token头信息的内容，原来查看头像使用的是localApi的实例，现在却使用了jsonServerApi的实例对象，所以在进行外部图片地址请求时请求的头信息中包含了token值，而正是因为多此一举的token设置导致外部网站无法将图片信息返回到当前项目中。那么需要如何解决该问题呢？既然之前是在jsonServerApi实例的请求拦截器中设置的token头信息，那么也可以在请求拦截器中进行判断终结。

![image-20221118164457490](http://qn.chinavanes.com/qiniu_picGo/image-20221118164457490.png)

在baseAxios基础请求封装的jsonServerApi实例请求拦截器中添加一个条件判断，如果请求返回的数据类型不是blob二进制时才进行token值的设置，否则的话则不再进行token的设值操作。现在再进行用户头像查看操作，则会发现又可以查看到用户的头像图片了。

request/baseAxios.js

```js {6-15,19}
// 给jsonServerApi这一axios实例添加request请求拦截器
jsonServerApi.interceptors.request.use(
  function (config) {
    // 可以在请求的时候固定设置content-type以及token等信息内容

    // 模认设置一个token对象
    let tokenObject = {};
    // 只有在响应类型不为blob的时候需要设置tokenObject中的token值内容
    // 因为blob返回类型的时候将请求外部网站的图片资源，而外部网站不认可项目内部的token值，反而会获取不到数据
    if (config.responseType !== 'blob') {
      tokenObject = {
        token:
          'This is the uniform setting content of the token in the request interceptor',
      };
    }

    config.headers = {
      'content-type': 'application/json',
      ...tokenObject, // 展开tokenObject对象
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
```

### 6]结合路由模块实现用户接口的调用

上一章节我们曾介绍了 vue-router 路由的功能而本章节又了解了数据接口与数据请求操作，那么是否能够将封装的接口请求内容移植到路由项目中去呢，答案一定是肯定的。

首先需要先切换至原来路由操作相关项目，因为在路由项目中并没有安装 axios 请求模块，所以需要先给原项目进行该模块的安装操作：

```bash
npm install axios --save
```

接下来在项目的 src 目录中创建 request 目录，并且将接口请求项目中 request 目录下的 baseAxios.js、userApi.js 以及 index.js 这三个接口封装程序文件进行完全的复制与粘贴操作，实现接口请求模块的迁移工作。

原来路由项目中的用户页里的用户列表是利用循环硬编码写死的数据信息，现在既然拥有用户接口服务，还有已经封装好的用户模块统一 API，那么是否可以直接在用户列表组件中进行对应接口方法的引入与使用呢？所以可以在路由项目的 src/views/user/Users.vue 组件文件中先将 getUsersList 函数从 request/index.js 中进行引入。

```js
import { getUsersList } from '@/request';
```

现在只需要声明一个 users 的响应式数据，并且再定义一个 getUsers 函数，在该函数中调用 getUsersList 调用接口的函数，将返回的数据内容设值到 users.value 中，最后再在 onMounted 生命周期钩子函数中调用 getUsers 函数即可，这样的话用户列表的数据就可以正常的获取到。

```js
const users = ref(null);

// 获取用户列表功能函数
const getUsers = async () => {
  users.value = await getUsersList({
    _page: 1,
    _limit: 5,
    _sort: 'id',
    _order: 'desc',
  });
};

onMounted(async () => {
  console.log('Users onMounted');
  getUsers(); // 获取用户列表数据
});
```

既然数据已经获取，那么只需要将 template 模板中原来硬编码的循环内容替换成现在的接口用户数据即可。

```vue
<router-link
  v-for="user in users"
  :key="user.id"
  :to="`/users/${user.id}`"
  class="list-group-item list-group-item-action"
  :class="{ active: user.id === currentId }"
  :aria-current="user.id === currentId"
>
 {{ user.name }}
</router-link>
```

views/user/Users.vue

```vue {23-33,65,81,83-91,99}
<template>
  <div>
    <!-- 用户页的面包屑导航 -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/" class="text-decoration-none">首页</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          <router-link to="/users" class="text-decoration-none"
            >用户</router-link
          >
        </li>
      </ol>
    </nav>

    <!-- 用户列表以及用户详情、编辑用户是左右两个独立的部分 -->
    <div class="row">
      <!-- 用户列表 -->
      <div class="col">
        <h1>用户列表</h1>
        <div class="list-group">
          <!-- 跳转用户详情路由链接 -->
          <router-link
            v-for="user in users"
            :key="user.id"
            :to="`/users/${user.id}`"
            class="list-group-item list-group-item-action"
            :class="{ active: user.id === currentId }"
            :aria-current="user.id === currentId"
          >
            {{ user.name }}</router-link
          >
        </div>
      </div>
      <!-- 用户查看、用户详情、编辑用户 -->
      <div class="col">
        <!-- 嵌套子路由的占位渲染 -->
        <router-view name="users-alert"></router-view>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'users',
};
</script>

<script setup>
import {
  ref,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
} from 'vue';
import { getUsersList } from '@/request';
import { useRoute } from 'vue-router';
// 通过 useRoute 钩子声明当前 route 路由对象
const route = useRoute();
// 声明一个响应式数据为当前选中的用户id
const currentId = ref(null);
// 利用 watch 监控确认在不同用户点击以后路由参数发生变化
watch(
  () => route.params.id,
  (newVal) => {
    // 对当前选中的用户id进行重新赋值
    // 将变化以后新值在数据类型转化以后再给它
    currentId.value = +newVal;
  }
);

const users = ref(null);

// 获取用户列表功能函数
const getUsers = async () => {
  users.value = await getUsersList({
    _page: 1,
    _limit: 5,
    _sort: 'id',
    _order: 'desc',
  });
};
// 初始
onBeforeMount(() => {
  console.log('Users onBeforeMount');
});

onMounted(async () => {
  console.log('Users onMounted');
  getUsers(); // 获取用户列表数据
});

// 更新
onBeforeUpdate(() => {
  console.log('Users onBeforeUpdate');
});

onUpdated(() => {
  console.log('Users onUpdated');
});

// 销毁
onBeforeUnmount(() => {
  console.log('Users onBeforeUnmount');
});

onUnmounted(() => {
  console.log('Users onUnmounted');
});

// 激活
onActivated(() => {
  console.log('Users onActivated');
});

// 失活
onDeactivated(() => {
  console.log('Users onDeactivated');
});
</script>
```

既然用户列表的接口能够进行请求访问并且获取到数据，那么用户详情的接口与数据获取相信也没有任何的问题。可以修改 views/user/UserDetail.vue，需要从 vue 中引入 ref 与 watch。利用 ref 声明一个响应式的 user 数据应该很容易理解，那么为什么需要引入 watch 进行监控操作呢？这是因为当对用户列表的用户项进行切换操作时 url 地址会发生变化，而主要变化的内容就是路由的 params 参数中的 id 值，如果我们将详情信息的请求放置于生命周期钩子函数 onMounted 中，那么用户信息的获取操作只能进行一次，所以可以利用 watch 去监控路由参数的变化，只有确认了路由参数的改变这样才可以进行指定参数内容的用户信息获取。当然，getUserById 的接口请求功能方法的引入一定是必不可少的，所以只需要根据思路在 watch 监控的时候进行指定路由 params.id 参数的用户信息接口请求即可，这样就可以动态获取不同的用户信息内容。

```js
import { watch, ref } from 'vue';
import { getUserById } from '@/request';

// 设置用户响应式数据
const user = ref(null);
// 需要利用watch监控确认路由中的params参数产生变化
// 如果确实参数内容发生变化，则需要利用接口请求新的用户详情信息
// immediate的作用是需要对路由进行立即监控处理
watch(
  () => route.params.id,
  async (newVal) => {
    if (newVal) user.value = await getUserById(route.params.id);
  },
  {
    immediate: true,
  }
);
```

在获取到数据以后想要进行内容的渲染显示就变得十分的轻松，修改 template 部分的内容，将用户名称、地址、头像等信息进行显示即可。

```vue
<template>
  <div v-if="user">
    <h1>用户详情</h1>
    <!-- 接收路由的params参数，参数名称为id -->
    <p>用户编号：{{ $route.params.id }}</p>
    <p>用户名称：{{ user.name }}</p>
    <p>用户地址：{{ user.address }}</p>
    <p>用户头像：<img :src="user.avatar" /></p>
    <!-- 将router-link声明式导航改造成编程式导航 -->
    <button class="btn btn-primary" @click="gotoEdit">编辑用户</button>
  </div>
</template>
```

view/user/UserDetail.vue

```vue {2-11,15-16,25-38}
<template>
  <div v-if="user">
    <h1>用户详情</h1>
    <!-- 接收路由的params参数，参数名称为id -->
    <p>用户编号：{{ $route.params.id }}</p>
    <p>用户名称：{{ user.name }}</p>
    <p>用户地址：{{ user.address }}</p>
    <p>用户头像：<img :src="user.avatar" /></p>
    <!-- 将router-link声明式导航改造成编程式导航 -->
    <button class="btn btn-primary" @click="gotoEdit">编辑用户</button>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { getUserById } from '@/request';

// 引入路由中useRouter、useRoute这两hook钩子
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
// 获取应用程序中的路由实例
const router = useRouter();
// 获取当前路由实例对象
const route = useRoute();

// 设置用户响应式数据
const user = ref(null);
// 需要利用watch监控确认路由中的params参数产生变化
// 如果确实参数内容发生变化，则需要利用接口请求新的用户详情信息
// immediate的作用是需要对路由进行立即监控处理
watch(
  () => route.params.id,
  async (newVal) => {
    if (newVal) user.value = await getUserById(route.params.id);
  },
  {
    immediate: true,
  }
);

const gotoEdit = () => {
  // 1.字符串路径
  // router.push(`/users/${route.params.id}/edit?name=张三&age=18`)
  // 2.带有路径的对象与query查询参数
  // 注意：path不能与params配合使用，但它可以与query参数结合使用
  // router.push({ path: `/users/${route.params.id}/edit`, query: { name: '张三', age: 18 } })
  // 3.命名的路由，带params与query参数
  router.push({
    name: 'userEdit',
    params: { id: route.params.id },
    query: { name: '张三', age: 18 },
    hash: '#bottom',
  });
  // 4.替换位置处理
  // router.replace({
  //   name: 'userEdit',
  //   params: { id: route.params.id },
  //   query: { name: '张三', age: 18 },
  // })
};

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    alert(`已经切换查看不同的用户信息，目标用户id为${to.params.id}`);
  }
});
</script>
```

最终项目的运行效果就是列表显示动态的用户数据，点击查看用户的详情信息。

![image-20220503185557274](http://qn.chinavanes.com/qiniu_picGo/image-20220503185557274.png)

既然我们能够在路由项目中进行 getUsersList、getUserById 等接口函数的调用，相信修改用户、删除用户等接口的调用也不会是问题了。

