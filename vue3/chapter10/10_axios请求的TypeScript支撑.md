# 10.axios 请求的 TypeScript 支撑

## 1)普通 axios 请求的 TypeScript 支撑

要了解 vue 中 axios 的 TypeScript 支撑需要先在当前项目中进行 axios 模块的安装操作：

```bash
npm install axios --save
```

接下来利用在线模拟数据进行测试，可以打开[https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)进行 todos 接口数据返回的接口调试，明确[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)返回的是单个 todo 的内容，而[https://jsonplaceholder.typicode.com/todos](https://jsonplaceholder.typicode.com/todos)则将返回 todos 数组列表。

可以直接打开 views/Home.vue 视图页面组件，在引入 axios 的前提下直接利用 axios.get 进行单个 todo 内容的获取操作，TypeScript 会根据类型推断推测 result 是 AxiosResponse 响应返回的类型，其中返回的对象属性应该包括 config、data、headers、request、status 以及 statusText 等众多的内容。

![image-20220604165311056](http://qn.chinavanes.com/qiniu_picGo/image-20220604165311056.png)

如果将 result 整体内容进行输出打印，在控制台则可以看到返回的内容就是提示的 config、data、headers、request、status 以及 statusText 等内容信息。

views/Home.vue

```vue {1-5}
<script lang="ts" setup>
import axios from 'axios';
const result = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
console.log(result);
</script>

<template>
  <h1>首页</h1>
</template>
```

![image-20220604164548034](http://qn.chinavanes.com/qiniu_picGo/image-20220604164548034.png)

通常，最终将使用的是 result.data 中的 todo 对象属性，包括 completed、id、title 与 userId，但现在尝试输出 result.data.title 时并没有任何的代码提示，因为 axios 中的 TypeScript 支撑只能支持到 axios 部分的代码提示信息，没办法对用户自定义的数据信息进行友好完善。

![image-20220604170343865](http://qn.chinavanes.com/qiniu_picGo/image-20220604170343865.png)

可以尝试定义一个 interface 接口类型 ITodo，它的内容就包括 completed 布尔型、id 数字型、title 字符串类型、userId 数字型。如果直接将 result 返回的结果设置成 ITodo 的数据类型，看起来在进行 result 输出的时候可以显示 completed、id、title 与 userId 等字段的信息提示，但是这结果是否正确？显然 result 下应该存在的是 config、data、headers、request、status 以及 statusText 等内容，如果直接给 result 设置 ITodo 的类型其实是将 axios 请求的返回数据类型进行了 ITodo 类型的覆盖，如果直接进行 result.title 结果的输出得到的将是 undefined 这样的错误结果。

![image-20220604170619862](http://qn.chinavanes.com/qiniu_picGo/image-20220604170619862.png)

所以，result 最终返回的应该是什么样的数据类型呢？因为现在进行的 axios 请求，所以还得需要询问 axios.get 才是合理的目标。可以将鼠标放置于 axios.get 上，则可以查看到 Axios.get 请求返回的将是一个 Promise，并且支持泛型`AxiosResponse<any,any>`。

![image-20220604171227930](http://qn.chinavanes.com/qiniu_picGo/image-20220604171227930.png)

然后进行 result 内容的输出，并将鼠标同样放置于 result 上，则可以进一步明确 axios 请求返回的 result 结果确实就是`AxiosResponse<any,any>`这一数据类型，现在只需要将定义好的 ITodo 接口类型对 AxiosResponse 泛型内容进行明确就行。

![image-20220604171521287](http://qn.chinavanes.com/qiniu_picGo/image-20220604171521287.png)

我们可以按下 ctrl 按并点击 axios.get 将会跳转至 axios 的 TypeScript 声明描述文件，你将会看到 request、get、delete 等不同请求方式的类型修饰声明，而 get 部分的声明内容是：

```typescript
get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

![image-20220604171714998](http://qn.chinavanes.com/qiniu_picGo/image-20220604171714998.png)

现在按下 ctrl 键查看 AxiosResponse 这一单词，则可以明确它就是一个 interface 接口类型，它还是一个泛型接口，并且第一个 T 现在是 any 类型，第二个 D 同样也是 any 类型。通过查看 AxiosResponse 的接口内容，可以分析出 T 将作用于返回的 data 对象属性，而 D 则是在 config 的 AxiosRequestConfig 中进行了泛型约束。

![image-20220604172103826](http://qn.chinavanes.com/qiniu_picGo/image-20220604172103826.png)

那么，现在就可以返回 Home.vue 视图页面中对 result 这一请求结果进行类型的约束，将其明确为`AxiosResponse<ITodo,any>`的数据类型，因为对于 data 数据来说，已经明确是 ITodo 类型，所以只需要在泛型中进行数据类型的确认即可。那么在 result.data 中就可以看到 ITodo 接口中定义的所有对象属性，代码也有了明确的提示。

![image-20220604172833792](http://qn.chinavanes.com/qiniu_picGo/image-20220604172833792.png)

其实并不一定要对 result 进行 AxiosResponse 数据类型的明确定义，也可以给 axios.get 进行泛型修饰同样能够达到预期的目标，因为明确 result.data 的数据类型是 ITodo，所以直接给 axios.get 进行泛型约束，确认泛型类型为 ITodo 即可，这时候会进行泛型参数的传递，鼠标移至 axios.get 上则可以看到 Promise 中的 AxiosResponse 里的第一个泛型参数已经变成了 ITodo，那么在 result.data 输出的时候同样也是可以看到 ITodo 定义的对象属性提示的。

![image-20220604173131977](http://qn.chinavanes.com/qiniu_picGo/image-20220604173131977.png)

views/Home.vue

```vue
<script lang="ts" setup>
import axios, { AxiosResponse } from 'axios';
// 定义接口类型Todo
interface ITodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}
const result = await axios.get<ITodo>(
  'https://jsonplaceholder.typicode.com/todos/1'
);
console.log(result.data.title);
</script>

<template>
  <h1>首页</h1>
</template>
```

除了单个 todo 的请求还可以进行 todos 多条数据的请求操作。

首先，可以将 axios.get 请求的数据类型改造成`ITodo[]`数组类型，并且添加 AxiosRequestConfig 请求配置，当前设置 params 参数，包括 \_page 与 \_limit。

然后在从 vue 中引入 ref，并设置一个 res 数据，其类型为`ITodo[] | null`，确认初始值为 null。

接下来可以将 result.data 数据内容赋值给 res 这一响应式数据。

最后利用 watch 监控 res，想要在监控结果对返回的新值数据进行指定下标数组元素获取时则会看到有 todo 的属性字段提示信息，但是程序仍旧会有出错警告，因为`对象可能为 "null"`。

![image-20220604193510474](http://qn.chinavanes.com/qiniu_picGo/image-20220604193510474.png)

最后可以利用条件判断的形式作以程序判断，以确认在存有数据的时候才进行内容的打印输出操作。

![image-20220604193706687](http://qn.chinavanes.com/qiniu_picGo/image-20220604193706687.png)

views/Home.vue

```vue
<script lang="ts" setup>
import axios, { AxiosResponse } from 'axios';
import { watch, ref } from 'vue';
// 定义接口类型Todo
interface ITodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}
const res = ref<ITodo[] | null>(null);
// 请求todos列表数据，数据类型为ITodo[]数组结构
// 可以添加params参数，添加参数后，可以根据查询参数条件进行请求
const result = await axios.get<ITodo[]>(
  'https://jsonplaceholder.typicode.com/todos',
  {
    params: {
      _page: 1,
      _limit: 5,
    },
  }
);
// 将请求的结果赋值给res
res.value = result.data;
// 对res请求结果数据进行响应式监控
watch(
  res,
  (newVal) => {
    // 因为数据请求返回结果前可能是null，所以程序需要做判断
    console.log(newVal[0].completed);
  },
  { immediate: true }
);
</script>

<template>
  <h1>首页</h1>
</template>
```

## 2)封装 axios 请求的 TypeScript 支撑

对于 axios 的二次封装与统一接口请求已经在请求相关部分进行了一定的介绍，现在可以先在 src 下创建 request 目录，并且新建 baseAxios.ts 程序文件。baseAxios.ts 程序文件主要的作用就是 axios 请求的二次封装，主要的内容是 axios 实例的创建，类似 baseUrl 基础参数的统一设置以及 request 请求拦截和 response 响应拦截的处理。在 request 请求拦截中进行了 content-type 的设置，而在 response 响应拦截中重点则是对 http 状态码内容进行了成功与失败的判断，目前成功判断主要考虑了 200 到 300 范围内的 http 状态码内容，如果在此范围中则表明请求成功，将返回 response.data 的数据内容，不再考虑 config、headers、request、status、statusText 等其它的 AxiosResponse 数据对象属性。

```typescript
// 引入axios第三方类库
import axios from 'axios';

// 创建axios实例方法
export function createAxios(options = {}) {
  return axios.create({
    ...options,
  });
}

// 创建jsonServerApi实例对象
export const jsonServerApi = createAxios({
  baseURL: 'https://jsonplaceholder.typicode.com/',
});

jsonServerApi.interceptors.request.use(
  function (config) {
    // 可以在请求的时候固定设置content-type以及token等信息内容
    config.headers = {
      'content-type': 'application/json',
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
    if (response.status >= 200 && response.status < 300) {
      // 也可以将直接将response.data用户所需内容直接返回，组件中不需要每次都去操作data属性节点
      return response.data;
    }
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

现在可以利用请求的二次封装模块进行数据接口的请求功能函数封装，所以在 request 目录下新建 todosApi.ts 程序文件，并声明 getTodoById 与 getTodosList 两个请求函数。

todosApi.ts

```typescript
import { jsonServerApi } from './baseAxios';
export const getTodoById = async (id: number) =>
  jsonServerApi.get(`todos/${id}`);

export const getTodosList = async (params: { _page: number; _limit: number }) =>
  jsonServerApi.get(`todos`, { params });
```

想要使用 getTodoById 与 getTodosList 两个请求函数以及以后会增加的更多函数内容，可以在 request 目录下新建 index.ts 程序文件，该文件主要进行接口的统一引入与暴露操作。

```typescript
export { getTodoById, getTodosList } from './todosApi'; // 统一从todos模块引入todos接口请求函数并暴露
```

现在回到 views/Home.vue 程序文件中，从 request/index.ts 程序文件中引入 getTodoById、getTodosList 两个请求封装函数并进行 getTodoById 函数的调用操作，当进行 result 结果内容打印的时候代码却依旧提示了 config、data、headers、requests、status、statusText 等 AxiosResponse 数据对象属性内容。

![image-20220604195325760](http://qn.chinavanes.com/qiniu_picGo/image-20220604195325760.png)

但在请求的二次封装中已经在 response 拦截器里将 response.data 的数据进行了直接返回，说明现在 Home.vue 组件中的 result 结果数据类型与实际的数据类型已经产生了差异，并不一一匹配了。

![image-20220604195544944](http://qn.chinavanes.com/qiniu_picGo/image-20220604195544944.png)

我们查看 todosApi.ts 中的 getTodoById 数据类型，确实仍旧是`Promise<AxiosResponse<any,any>>`的类型。但现在我们真正想要的应该是什么数据类型呢？应该是 ITodo 或者是 ITodo[]数据类型。

![image-20220604195704746](http://qn.chinavanes.com/qiniu_picGo/image-20220604195704746.png)

可以在 Home.vue 中声明接口 ITodo，在尝试给 result 设置 ITodo 数据类型的时候则发现程序已经报了错误警告。

```vue
<script lang="ts" setup>
// 封装的axios请求操作
import { getTodoById, getTodosList } from '../request';
// 定义接口类型Todo
interface ITodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}
const result: ITodo = await getTodoById(1);
console.log(result);
</script>

<template>
  <h1>首页</h1>
</template>
```

![image-20220604200031311](http://qn.chinavanes.com/qiniu_picGo/image-20220604200031311.png)

那么，需要使用什么方式才能解决当前的问题？其实解决此问题的方法有很多。

其一，可以将ITodo接口定义迁移至todosApi.ts当中，既然getTodoById、getTodosList函数返回的是Promise，并且Pomise是一个泛型，那么就可以明确指定AxiosResponse泛型的数据类型为ITodo或者ITodo[]。

```typescript
import { jsonServerApi } from './baseAxios';
// 定义接口类型Todo
interface ITodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

export const getTodoById = async (id: number): Promise<ITodo> =>
  jsonServerApi.get(`todos/${id}`);

export const getTodosList = async (params: {
  _page: number;
  _limit: number;
}): Promise<ITodo[]> => jsonServerApi.get(`todos`, { params });

```

那么在Home.vue中可以不进行result数据类型的约束也可以实现result中代码提示的效果。

![image-20220604214102323](http://qn.chinavanes.com/qiniu_picGo/image-20220604214102323.png)

其二，可以在src下新建axios.d.ts声明文件，并且在该文件中对axios部分的接口内容进行重写，比如可以重新声明AxiosResponse，确认它继承于Promise，并且返回的数据类型为any任意数据类型。

src/axios.d.ts

```typescript
import axios from 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

```

这时如果Home.vue中的result不进行确认的数据类型声明，那么则会将其声明为any任意类型，不过这时候也不会有任何的代码提示功能。

![image-20220604200540741](http://qn.chinavanes.com/qiniu_picGo/image-20220604200540741.png)

不过我们已经声明了ITodo的接口数据类型，那么可以给result进行类型约束，这样的话就相当于将result进行了自定义数据类型的强制声明，所以在输出result的时候可以直接查看到ITodo接口的字段提示。

![image-20220604200649923](http://qn.chinavanes.com/qiniu_picGo/image-20220604200649923.png)
