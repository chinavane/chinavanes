# 10.将 fetch 方法改造成 axios 方法

之前已经提及 fetch 这种原生的数据请求方式存在一些不足，特别是没有统一拦截器等操作，我想可以考虑尝试用第三方类库 axios 对之前 fetch 的操作流程进行改造，确认一下它们之间的进一步差异。

可以在 request 目录中新建 baseAxios.js，在引入 axios 类库以后对 axios 的请求进行基础请求封装操作，则可以看出 axios 的代码精减度要远超 fetch，因为 axios 默认是返回 json 数据类型，所以对于绝大多数接口请求操作已经适用，至于如果出现 text、blob、ArrayBuffer 等其它类型的数据返回到时可以传递 options 可选项内容即可。

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

当然还需要在 request 目录下创建 axiosApi.js 的程序文件，在该文件中利用 baseAxios 进行 getHttp、postHttp、putHttp、deleteHttp 的请求功能封装。类似于 fetch，axios 对于 get 请求的参数是可以设置到 params 对象属性中的，也就是说除了可以直接设置 URL 的 query 参数进行 URL 的拼接以外还可以利用 params 将 query 参数进行对象化的转化传递操作，至于 post、put、delete 中仍旧可以传递 data 数据，这雷同于 fetch 中的 body 内容，不过并不需要在 axios 中设置 headers 的 content-type，也不需要进行 JSON.stringify 对象转换操作，这使得开发者可以省略很多细节问题。事实上 axios 中的 content-type 默认为 application/x-www-form-urlencoded，但是对于 data 数据对象内部也会自动对象序列化为 JSON。

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

接下来在组件中只需要注意 axios 请求方式与 fetch 的一些差异点就可以完成之前 fetch 实现的数据操作功能。现在可以直接用接口的局部使用方式从 request/axiosApi 中引入 getHttp、 postHttp、putHttp、 deleteHttp 方法。因为封装功能与参数设置的相似性，所以在进行 postUser 新增用户、putUser 修改用户、deleteUser 删除用户操作时与原来 fetch 操作的代码都没有发生改变，只不过在 getUsers 获取用户列表时除了可以尝试使用 URL 的参数拼接形式进行接口调用，还可以将 query 参数进行 params 对象化参数的设置传递，关键的是 axios 请求返回的最终数据内容都被放置到了返回对象的 data 属性当中，所以需要利用 result.data 进行最终数据内容的接收操作。至于 viewAvatar 查看头像的功能，是在进行接口请求时需要限制请求返回的数据类型为二进制 blob 类型，至于 params 参数如果没有可以设置为空对象，最终仍旧将返回对象中的 data 属性节点数据进行获取进行图片内容的展示操作。

components/HelloWorld.vue

```vue {3-4,10,19,28,34-37,42-53}
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

// 查看头像
const viewAvatar = async (user) => {
  // 限制请求返回的数据类型为二进制blob类型，params参数如果没有可以设置为空对象
  const result = await getHttp(user.avatar, {}, { responseType: 'blob' });
  // 将图片的二进制数据存储于内存当中，注意result.data中的data属性节点
  avatar.value = URL.createObjectURL(result.data);
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
    </li>
  </ul>
  <button @click="postUser">新增用户</button>
</template>
```

显然，fetch与axios的操作还是存在一些细节的差异与不同的，所以在应用的时候需要注意这一些细少的差异项。
