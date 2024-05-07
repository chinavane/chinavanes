# 11.axios 的 instance 实例应用

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

// 查看头像
const viewAvatar = async (user) => {
  // 限制请求返回的数据类型为二进制blob类型，params参数如果没有可以设置为空对象
  const result = await getHttp(user.avatar, {}, { responseType: 'blob' });
  // 将图片的二进制数据存储于内存当中，注意result.data中的data属性节点
  avatar.value = URL.createObjectURL(result.data);
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

需要强调的是在getUserById接口请求函数调用的时候并没有设置请求的地址也没有强调http://localhsot:5000的请求前缀，因为这些配置项内容都已经在jsonServerApi的axios实例中设置了。

![image-20220502141915559](http://qn.chinavanes.com/qiniu_picGo/image-20220502141915559.png)
