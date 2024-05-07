# 12.pinia 状态管理的 TypeScript 支撑

pinia 这一状态管理器的层级比 vuex 要简化很多，除了去除了 mutations 和 module 这两个层次和 TypeScript 的结合应用也显示更为的丝滑。

在当前的项目中先安装 pinia 模块：

```bash
npm install pinia --save
```

然后在 src 下创建 pinia 目录，并新建 index.ts 程序文件，可以在该文件中先进行 state 的状态声明，现在的代码模式就如同 JavaScript 操作 pinia 一样，并没有进行任何数据类型的声明与定义，不过只是处理了 state 的状态内容。

src/pinia/index.ts

```typescript
import { defineStore } from 'pinia';

const useTodosStore = defineStore('todos', {
  // 设置状态
  state: () => {
    return {
      todo: { completed: false, id: 0, title: '', userId: 0 },
      todos: [],
    };
  },
});

export default useTodosStore;
```

要使用 pinia 还是需要到入口文件中创建 pinia 的实例对象并进行应用程序的使用才行：

```typescript {4-6,12-13}
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 实例化pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
// 引入仓库与key值
import store, { key } from './store';
const app = createApp(App);
// 使用仓库，并且设置key值，以确认唯一性
app.use(store, key);
// 使用pinia
app.use(pinia);
app.use(router);
app.mount('#app');
```

可以打开 views/Home.vue 视图页面，先将原先的代码内容进行清除，然后进行 pinia 仓库调用的测试。只需要将 useTodosStore 引入就可以利用它进行 todos 模块的实例化操作，可以将 todos 模块的状态内容利用引入的 storeToRefs 进行响应式数据类型的转换。那么在打印 todo.value 数据内容时则可以看到已经拥有了 completed、id、title、userId 等对象属性的提示信息，并且在 template 模板层进行插值渲染同样也支持代码提示。

pinia/index.ts

```vue
<script lang="ts" setup>
// 仓库内容转refs响应式数据
import { storeToRefs } from 'pinia';
// 引入todos模块
import useTodosStore from '../pinia';
// 实例化todos仓库实例并将state状态转成refs类型数据
const { todo, todos } = storeToRefs(useTodosStore());
console.log(todo.value.title);
</script>

<template>
  <h1>首页</h1>
  <!-- 单个todo对象的显示 -->
  <p>{{ todo.title }}</p>
</template>
```

![image-20220606072400947](http://qn.chinavanes.com/qiniu_picGo/image-20220606072400947.png)

![image-20220606072421060](http://qn.chinavanes.com/qiniu_picGo/image-20220606072421060.png)

只要将鼠标放到不同位置的 todo 上进行信息查看，就可以看到 todo 这一状态值所声明的数据类型，这一切都是通过 TypeScript 进行自动推断的，显然 pinia 与 TypeScript 的结合让开发人员省去了很多烦恼。

![image-20220606072741460](http://qn.chinavanes.com/qiniu_picGo/image-20220606072741460.png)

![image-20220606072759418](http://qn.chinavanes.com/qiniu_picGo/image-20220606072759418.png)

现在可以考虑在 pinia 中将 vuex 里对 todo 与 todos 操作的 getters 与 actions 功能操作进行迁移引入与修改，主要引入 getTodoById 与 getTodosList 这两个封装的请求方法，然后定义 getters 的 getTopNList 函数，并且这一函数结构与内容 vuex 中的 getters 定义没有任何的差别。至于 getTodoByIdAction、getTodosListAction 这两个异步请求函数还是需要一定内容的修改，主要是 pinia 中没有 mutations 层次，所以 commit 提交相关的参数内容可以删除，至于 commit 提交部分的代码直接切换成 this.todo 和 this.todos 进行状态值的修改即可，其它内容并没有做过多的增减，至于每个函数中的参数与参数类型也同 vuex 案例中的一模一样。

```typescript {2,12-33}
import { defineStore } from 'pinia';
import { getTodoById, getTodosList } from '../request';

const useTodosStore = defineStore('todos', {
  // 设置状态
  state: () => {
    return {
      todo: { completed: false, id: 0, title: '', userId: 0 },
      todos: [],
    };
  },
  getters: {
    // 获取todos前几个列表数据项
    getTopNList(state) {
      return function (n: number) {
        return state.todos.slice(0, n);
      };
    },
  },
  actions: {
    // 单个Todo的action请求动作
    // 给payload设置数据类型为number
    async getTodoByIdAction(payload: number) {
      const result = await getTodoById(payload);
      this.todo = result;
    },
    // 多个Todos的action请求动作
    // 给payload设置数据类型为对象类型，其中_page为当前页数，_limit为每页显示条数，它们都是数字型
    async getTodosListAction(payload: { _page: number; _limit: number }) {
      const result = await getTodosList(payload);
      this.todos = result;
    },
  },
});

export default useTodosStore;
```

回到 views/Home.vue 视图页面对 getters 与 actions 方法在脚本与模板渲染部分进行调用测试，只需要将 getTodoByIdAction、getTodosListAction、getTopNList 从 useTodosStore 的实例对象中进行解构引入即可，在脚本部分直接调用 getTodoByIdAction 与 getTodosListAction 两个 action 方法，并且尝试传递错误数据类型的参数，这时程序将报以错误提示。同样的，在 template 模板层中将 vuex 里的内容渲染也迁移过来则会看到 getTopNList 函数在进行错误类型参数传递的时候同样也出现了报错信息。

views/Home.vue

```vue {5,7-8,15-22}
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import useTodosStore from '../pinia';
const { todo, todos } = storeToRefs(useTodosStore());
const { getTodoByIdAction, getTodosListAction, getTopNList } = useTodosStore();
console.log(todo.value.title);
getTodoByIdAction('2');
getTodosListAction({ _page: '1', _limit: '10' });
</script>

<template>
  <h1>首页</h1>
  <!-- 单个todo对象的显示 -->
  <p>{{ todo.title }}</p>
  <!-- 通过getters进行内容的获取，并且可以传递参数 -->
  <p>{{ getTopNList('2') }}</p>
  <!-- 列表显示 -->
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.title }}
    </li>
  </ul>
</template>
```

![image-20220606074456889](http://qn.chinavanes.com/qiniu_picGo/image-20220606074456889.png)

![image-20220606074509482](http://qn.chinavanes.com/qiniu_picGo/image-20220606074509482.png)

![image-20220606074520451](http://qn.chinavanes.com/qiniu_picGo/image-20220606074520451.png)

在将 getters 与 actions 几个函数参数数据类型调整正确以后则发现程序页中对 todos 循环部分的内容仍旧有报错信息，提示循环体内的 todo 对象是 never 数据类型，所以它的上面并不存在 title 的属性。

views/Home.vue

```vue {7-8,16}
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import useTodosStore from '../pinia';
const { todo, todos } = storeToRefs(useTodosStore());
const { getTodoByIdAction, getTodosListAction, getTopNList } = useTodosStore();
console.log(todo.value.title);
getTodoByIdAction(2);
getTodosListAction({ _page: 1, _limit: 10 });
</script>

<template>
  <h1>首页</h1>
  <!-- 单个todo对象的显示 -->
  <p>{{ todo.title }}</p>
  <!-- 通过getters进行内容的获取，并且可以传递参数 -->
  <p>{{ getTopNList(2) }}</p>
  <!-- 列表显示 -->
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.title }}
    </li>
  </ul>
</template>
```

![image-20220606075042586](http://qn.chinavanes.com/qiniu_picGo/image-20220606075042586.png)

看来绝大部分情况 pinia 与 TypeScript 的结合是非常智能的，但还有一些小的细节需要进行手动数据类型的设置操作。这是因为在进行 pinia 状态设置的时候，todo 的数据类型可以通过设置的对象属性明确但 todos 只是设置了初始值，并没办法很好的进行数据类型的推演，所以得到的数据类型就是`never[]`，也难怪在视图页面中报以错误提示。

![image-20220606075219696](http://qn.chinavanes.com/qiniu_picGo/image-20220606075219696.png)

![image-20220606075229360](http://qn.chinavanes.com/qiniu_picGo/image-20220606075229360.png)

解决这个问题只需要将 vuex 中对 todo 与 todos 的数据类型定义迁移过来即可，在 pinia 目录下新建 types.ts 程序文件，将 todo 与 todos 的数据类型声明进行定义：

pinia/types.ts

```typescript
// 分类模块state状态定义
export interface ITodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

// 定义ITodo字面量类型
export type ITodos = ITodo[];

// 定义todos模块的状态类型
export interface ITodosState {
  todo: ITodo;
  todos: ITodos;
}
```

现在只需要在 pinia 中对 state 状态设置数据类型即可，

pinia/index.ts

```typescript {3,7}
import { defineStore } from 'pinia';
import { getTodoById, getTodosList } from '../request';
import { ITodosState } from './types';

const useTodosStore = defineStore('todos', {
  // 设置状态，确认状态函数返回的数据类型
  state: (): ITodosState => {
    return {
      todo: { completed: false, id: 0, title: '', userId: 0 },
      todos: [],
    };
  },
  getters: {
    // 获取todos前几个列表数据项
    getTopNList(state) {
      return function (n: number) {
        return state.todos.slice(0, n);
      };
    },
  },
  actions: {
    // 单个Todo的action请求动作
    // 给payload设置数据类型为number
    async getTodoByIdAction(payload: number) {
      const result = await getTodoById(payload);
      this.todo = result;
    },
    // 多个Todos的action请求动作
    // 给payload设置数据类型为对象类型，其中_page为当前页数，_limit为每页显示条数，它们都是数字型
    async getTodosListAction(payload: { _page: number; _limit: number }) {
      const result = await getTodosList(payload);
      this.todos = result;
    },
  },
});

export default useTodosStore;
```

只需要设置 state 状态的数据类型，回到视图页中，即便循环体内的数据类型也不再提示错误，鼠标移动查看提示信息也可以明确其数据类型。

![image-20220606075815147](http://qn.chinavanes.com/qiniu_picGo/image-20220606075815147.png)

其实我们也可以和 vuex 一样，对 pinia 的 state、getters、actions 每个层次内容进行数据类型的强制定义。当我们在 pinia/index.ts 文件中按下 ctrl 键并点击 defineStore 的时候就可以查看到 defineStore 中也可以使用泛型，而且包含 Id、StateTree、GetterTree 等内容。

![image-20220606080006445](http://qn.chinavanes.com/qiniu_picGo/image-20220606080006445.png)

将鼠标放置 getters 与 actions 定义的函数中也会显示类似 vuex 中的数据类型定义操作，所以可以再次修改 pinia/types.ts 程序文件，将 getters 与 actions 的类型进行定义，这部分的内容可以从 vuex 中的定义进行迁移，只需要将 actions 方法中 commit 相关的代码去除即可。

![image-20220606080229011](http://qn.chinavanes.com/qiniu_picGo/image-20220606080229011.png)

pinia/types.ts

```typescript {18-27}
// 分类模块state状态定义
export interface ITodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

// 定义ITodo字面量类型
export type ITodos = ITodo[];

// 定义todos模块的状态类型
export interface ITodosState {
  todo: ITodo;
  todos: ITodos;
}

// 定义todos模块的getters类型
export type TodosGetters<S = ITodosState> = {
  getTopNList(state: ITodosState): (n: number) => ITodo[];
};

// 定义todos模块的actions类型
export type TodosActions<S = ITodosState> = {
  getTodoByIdAction(payload: number): Promise<void>;
  getTodosListAction(payload: { _page: number; _limit: number }): Promise<void>;
};
```

我们可以将 TodosGetters、TodosActions 数据类型从类型定义文件中引入，然后在 defineStore 的时候直接使用泛型模式进行数据类型定义即可，第一个是当前模块的 id，第二至第四个类型依次就是 state、getters、actions 的指定类型。在定义好 defineStore 数据类型以后，原先仅对 state 进行数据类型定义操作的内容就可以进行剔除，并且查看 defineStore 提示则可以明确看到各个层次的数据类型是清清楚楚。

pinia/index.ts

```typescript {3,5-10}
import { defineStore } from 'pinia';
import { getTodoById, getTodosList } from '../request';
import { ITodosState, TodosGetters, TodosActions } from './types';

const useTodosStore = defineStore<
  'todos',
  ITodosState,
  TodosGetters,
  TodosActions
>('todos', {
  // 设置状态，确认状态函数返回的数据类型
  state: () => {
    return {
      todo: { completed: false, id: 0, title: '', userId: 0 },
      todos: [],
    };
  },
  getters: {
    // 获取todos前几个列表数据项
    getTopNList(state) {
      return function (n: number) {
        return state.todos.slice(0, n);
      };
    },
  },
  actions: {
    // 单个Todo的action请求动作
    // 给payload设置数据类型为number
    async getTodoByIdAction(payload: number) {
      const result = await getTodoById(payload);
      this.todo = result;
    },
    // 多个Todos的action请求动作
    // 给payload设置数据类型为对象类型，其中_page为当前页数，_limit为每页显示条数，它们都是数字型
    async getTodosListAction(payload: { _page: number; _limit: number }) {
      const result = await getTodosList(payload);
      this.todos = result;
    },
  },
});

export default useTodosStore;
```

![image-20220606080741968](http://qn.chinavanes.com/qiniu_picGo/image-20220606080741968.png)

现在回到视图层进行 state、getters、actions 不同状态与方法的调用，都可以看到一定的提示信息与错误警告内容，pinia 与 TypeScript 的支撑就得以完美解决。
