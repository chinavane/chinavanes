# 11.vuex 状态管理的 TypeScript 支撑

## 1)state 状态值的 TypeScript 支撑与代码提示

在 vue 中想对 vuex 状态管理进行 TypeScript 的支撑辅助并不是一件容易的事情，这是因为 vuex 的层次结构本身比较复杂，包括设置状态 state、获取内容 getters、修改数据 mutations、异步操作 actions、模块拆分 modules、命名空间 namespaced、插件辅助 plugins 等核心层次。而且 vuex 的应用模式众多，涉及仓库的直接使用与映射操作等。所以在 vue 中使用 vuex 并且结合 TypeScript 的操作过程我们将按步骤逐一慢慢讲解。

当然，首先想到的第一步是在当前的项目中安装 vuex 模块的支持：

```bash
npm install vuex --save
```

接下来需要考虑创建状态管理器的 store 仓库，还需要考虑利用模块化拆分的方式进行仓库结构的组织，所以在 src 目录下创建 store 目录，并在该目录下再创建 todos 子目录。在 todos 目录中新建 state.ts 状态部分的声明文件：

store/todos/state.ts

```typescript
// 声明todos的状态为函数类型
function state() {
  return {
    todo: {},
    todos: [],
  };
}
export default state;
```

当前声明的 state 是一个函数，对于函数返回内容的 todo 与 todos 想来需要进行一个类型的声明，所以考虑在 store 目录下新建 types.ts 类型声明文件，并进行 todo 与 todos 的声明操作，当前声明的 ITodo 是一个接口类型，对于 todo 对象的属性 completed、id、title、userId 都做了指定类型的约束。而 ITodo 是一个字面量类型，它是一个数组，数组的元素则是 Todo 类型。所以 todos 模块的状态 todo 与 todos 就是 ITodo 与 ITodos 的类型，我们将整个 todos 的对象类型定义为接口类型 ITodosState。

store/types.ts

```typescript
// 分类模块state状态定义
// 定义接口类型Todo
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

那么，返回到 todos/state.ts 中就可以对 state 函数的返回值进行类型定义，从 types 中引入 ITodosState，并且将 state 函数返回类型定义为 ITodosState，这时则报了语法错误提示`类型“{}”缺少类型“ITodo”中的以下属性: completed, id, title, userId`

store/todos/state.ts

```typescript
import { ITodosState } from '../types';
// 定义state函数的返回类型为ITodosState
function state(): ITodosState {
  return {
    todo: {},
    todos: [],
  };
}
export default state;
```

![image-20220605105622531](http://qn.chinavanes.com/qiniu_picGo/image-20220605105622531.png)

对于 todo 这一属性，需要将 completed、id、title、userId 等属性都需要进行添加并进行初始化操作，这样看起来 todos 模块的 state 就已经轻松的定义完成。

store/todos/state.ts

```typescript
import { ITodosState } from '../types';
// 定义state函数的返回类型为ITodosState
function state(): ITodosState {
  return {
    todo: {
      completed: false,
      id: 0,
      title: '',
      userId: 0,
    },
    todos: [],
  };
}
export default state;
```

当前只是声明了 todos 的 state 状态内容，后续还有 getters、mutations、actions 等其它核心部分，所以可以在 todos 目录下新建 index.ts 进行 todos 模块的统一管理操作。可以将 state 进行引入，并定义一个 todosModule 的常量，内容就是 state，并且添加 namespaced 命名空间的属性。

store/todos/index.ts

```typescript
import state from './state';

const todosModule = {
  state,
  namespaced: true, // 开启命名空间
};
export default todosModule;
```

将鼠标放置于 todosModule 上，则可以确认 state 函数返回的类型就是 ITodosState。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220605110037800.png" alt="image-20220605110037800" style="zoom:50%;" />

那么在 store 目录中则需要新建 index.ts 对刚创建的 todos 模块进行仓库模块操作的统一管理，将 todosModule 从 todos 目录的 index.ts 中引入，并利用 createStore 进行仓库的创建，设置 modules 模块，当前只有一个模块 todos，其值就是引入的 todosModule 内容。

store/index.ts

```typescript
import { createStore } from 'vuex';
import todosModule from './todos';

const store = createStore({
  modules: {
    todos: todosModule, // 设置todos模块
  },
});

export default store;
```

现在我们已经完成了一个最简单的 vuex 仓库的创建，当前仓库中只有一个模块 todos，而 todos 中也只有 state 状态的声明，其它的功能都没有进行添加。那么接下去的目标就是将 vuex 仓库与当前的项目进行结合，所以需要切换至入口文件 main.ts 中将 store 进行引入与使用操作。

main.ts

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 引入仓库
import store from './store';
const app = createApp(App);
// 使用仓库
app.use(store);
app.use(router);
app.mount('#app');
```

现在尝试到页面组件中进行 store 仓库的应用处理，打开 views/About.vue 程序文件，将原来的脚本代码删除，并从 vuex 中引入 useStore，然后进行实例化，当我们尝试对 store 的 state 状态进行获取的时候没有任何后续的代码提示操作，但如果直接打印 store.state，在控制台却可以查看到输出的 todos 模块以及下属的对象属性 todo 以及 todos 内容。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220605110734984.png" alt="image-20220605110734984" style="zoom:50%;" />

显然，这并不是我们想要的结果，因为将 vuex 配合 TypeScript 进行结合操作，希望达到的目标是在 store.state 代码输入的时候就可以明确有哪些模块，并且模块下面还有哪些属性，这些属性的数据类型到底是什么类型。如果拥有良好的代码提示，那么在进行团队项目多人开发的时候就会有比较好的可维护性。

![image-20220605111133366](http://qn.chinavanes.com/qiniu_picGo/image-20220605111133366.png)

其实现在只是对 todos 的 state 函数的返回值进行了类型的声明，但现在 store 中还有更上一层的 createStore，如果将鼠标放置至 createStore 上进行信息提示查看则会发现 createStore 的数据类型为 unknow，我想这是产生问题的一个主要原因吧。其实，我们需要明确层次，createStore 是最上级，而 createStore 下 modules 模块中的 todos 只是它其中的一个下层节点而已，如果光定义下层的数据类型，没有确认最上级的数据类型，那么在组件中进行仓库应用时确实无法获取到 store.state 下的对象属性。

![image-20220605111900319](http://qn.chinavanes.com/qiniu_picGo/image-20220605111900319.png)

所以需要在 store/types.ts 中定义 createStore 的状态数据类型，它应该是往后各个模块的一个总集合类型。

store/types.ts

```typescript {1-5}
// 所有state状态
export interface IAllState {
  todos: ITodosState; // todos模块
  // 以后还可以添加users、news、products等模块
}

// 分类模块state状态定义
// 定义接口类型Todo
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

那么回到 store/index.ts 程序文件中尝试给 createStore 添加整个仓库的数据类型 IAllState，如果再查看 createStore 则可以明确 Store 的类型就是刚设定的 IAllState。

store/index.ts

```typescript {3,5-6}
import { createStore } from 'vuex';
import todosModule from './todos';
import { IAllState } from './types';

// IAllState是整个仓库的数据类型定义
const store = createStore<IAllState>({
  modules: {
    todos: todosModule, // 设置todos模块
  },
});

export default store;
```

![image-20220605112644301](http://qn.chinavanes.com/qiniu_picGo/image-20220605112644301.png)

现在回到 views/About.vue 中进行 store.state 内容的打印输出，其结果没有任何的变化。为什么我们已经设置了整个 store 的数据类型，也设置了 todos 子模块的数据类型，还是没有办法进行提示代码的实现呢？

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220605110734984.png" alt="image-20220605110734984" style="zoom:50%;" />

也许大家还记得之前在介绍 provide 与 inject 的时候跨不同的组件层级之间的通讯操作，如果没有给 provide 添加 InjectionKey，那么在组件中将无法识别是哪个层级的 provide 提供的数据。现在的 store 仓库也实现的是任何组件的通讯操作，和 provide、inject 相似，同样也需要给 store 确认唯一的 key 的标识才能在组件中找到真正的 store 仓库实例对象。

现在需要修改 store/index.ts 程序文件，除了需要设置唯一值 key，利用 InjectionKey 类型将具有 IAllState 的 Store 仓库进行 Symbol 唯一值的设置之外还需要将 useStore 进行别名处理，别名成 baseUseStore，并且重新定义 useStore，利用函数重写的方式将 vuex 中的 useStore 进行改造，改造成具有唯一值 key 的 useStore，这样在组件中才可以利用 key 进行精确 store 仓库的查找。

store/index.ts

```typescript {1-3,7-8,17-20}
import { InjectionKey } from 'vue';
// 将useStore别名成baseUseStore，以便在其他地方使用
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import todosModule from './todos';
import { IAllState } from './types';

// 设置唯一值key，利用InjectionKey类型将具有IAllState的Store仓库进行Symbol唯一值的设置
export const key: InjectionKey<Store<IAllState>> = Symbol();

// IAllState是整个仓库的数据类型定义
const store = createStore<IAllState>({
  modules: {
    todos: todosModule, // 设置todos模块
  },
});

// 利用baseUseStore函数将store仓库注入到vuex中，并且设置key值确认其唯一性
export function useStore() {
  return baseUseStore(key);
}

export default store;
```

除了修改 store 仓库添加唯一值 key，在项目的入口文件中也需要给 store 添加上识别内容 key 值。

main.ts

```typescript {4-5,8}
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 引入仓库与key值
import store, { key } from './store';
const app = createApp(App);
// 使用仓库，并且设置key值，以确认唯一性
app.use(store, key);
app.use(router);
app.mount('#app');
```

现在再回到 views/About.vue 视图组件当中，原来从 vuex 中引入的 useStore 就直接改从 store/index.ts 中引入，因为在 store/index.ts 中已经对 useStore 进行唯一值 key 的添加重写操作，所以现在获取到的 useStore 实例对象就是具有明确 key 值目标的 store 仓库内容，那么在进行 store.state 指定状态获取时就可以发现 todos 与 todo 等属性节点的代码提示信息了。

![image-20220605115635909](http://qn.chinavanes.com/qiniu_picGo/image-20220605115635909.png)

views/About.vue

```vue
<template>
  <h1>关于我们</h1>
</template>

<script setup lang="ts">
import { useStore } from '../store';
const store = useStore();
console.log(store.state.todos.todo);
</script>
```

## 2) getters、mutations、actions 的 TypeScript 支撑与代码提示

想要实现 getters、mutations、actions 的 TypeScript 支撑与代码提示首先得回到 store/todos/index.ts 程序文件，之前已经给 store/index.ts 中的 createStore 进行了顶层仓库数据类型的定义，也给 todosModule 中的 state 模块状态进行了数据类型的定义，但对于 todosModule 这一模块内容并没有明确拥有的数据类型。现在可以从 vuex 中先引入 Module 这一对象，并且按下 ctrl 后点击 Module，这时代码将跳转至 vuex 中对 Module 的接口定义代码部分。

store/todos/index.ts

```typescript
import { Module } from 'vuex';
import state from './state';

const todosModule = {
  state,
  namespaced: true, // 开启命名空间
};
export default todosModule;
```

你将看到 Module 这一接口类型中带有泛型内容 S 与 R，而除了 state 中有 S 的泛型定义外，还有 getters、actions、mutations 等都有 GetterTree、ActionTree 与 MutationTree 等的泛型定义，这就说明当前的 todos 仓库模块的 todosModule 可以定义为 Module 数据类型，并可以设置泛型 S 与 R，而 S 则代表当前模块的 state 的状态类型 ITodosState，而 R 则代表仓库根级的 state 状态类型 IAllState。

![image-20220605125550256](http://qn.chinavanes.com/qiniu_picGo/image-20220605125550256.png)

所以现在的 store/todos/index.ts 中就可以对 todosModule 进行明确的数据类型定义：

```typescript {1-2,5}
import { Module } from 'vuex';
import { IAllState, ITodosState } from '../types';
import state from './state';

const todosModule: Module<ITodosState, IAllState> = {
  state,
  namespaced: true, // 开启命名空间
};
export default todosModule;
```

如果想要对 todo 进行单个内容的请求以及对 todos 进行多个列表数据的获取可以在 actions 层进行 vuex 仓库的 action 动作定义。在 store/todos 目录下新建 actions.ts 程序文件，在该文件中需要引入 ActionTree，将利用它进行 action 的数据类型声明，所以需要从 types 中引入 ITodosState 当前模块状态数据类型、 IAllState 所有模块状态数据类型，并且需要从统一接口封装模块中引入 getTodoById, getTodosList 两个请求方法。在定义 actions 的时候只需要利用 ActionTree 这一数据类型明确 ITodosState、IAllState 这两个泛型对象即可，不过最终需要通过 commit 将接口请求到的结果数据提交到 mutations 层进行状态值的修改。

store/todos/actions.ts

```typescript
import { ActionTree } from 'vuex'; // Action部分将使用ActionTree进行action的数据类型声明
import { ITodosState, IAllState } from '../types'; // 引入数据类型
import { getTodoById, getTodosList } from '../../request'; // 引入请求方法
// 定义actions，数据类型则使用ActionTree进行声明
const actions: ActionTree<ITodosState, IAllState> = {
  // 单个Todo的action请求动作
  async getTodoByIdAction({ commit }, payload) {
    const result = await getTodoById(payload);
    // 提交到mutations中进行修改数据
    commit('GET_TODO_BY_ID_MUTATIONS', result);
  },
  // 多个Todos的action请求动作
  async getTodosListAction({ commit }, payload) {
    const result = await getTodosList(payload);
    // 提交到mutations中进行修改数据
    commit('GET_TODOS_LIST_MUTATIONS', result);
  },
};
export default actions;
```

所以需要在 store/todos 下新建 mutations.ts，那么这一层次的内容在明确了 actions 部分内容以后就十分容易的理解。只需要引入 MutationTree 数据类型接口以及 ITodosState 当前模块数据类型定义就可以准备 mutations 的定义操作。

store/todos/mutations.ts

```typescript
import { MutationTree } from 'vuex'; // Mutation部分将使用MutationTree进行mutation的数据类型声明
import { ITodosState } from '../types'; // 引入数据类型
// 定义mutations，数据类型则使用MutationTree进行声明，只需当前模块的state即可
const mutations: MutationTree<ITodosState> = {
  // 单个Todo的mutation修改数据
  GET_TODO_BY_ID_MUTATIONS(state, payload) {
    state.todo = payload;
  },
  // 多个Todos的mutation修改数据
  GET_TODOS_LIST_MUTATIONS(state, payload) {
    state.todos = payload;
  },
};
export default mutations;
```

同样的 store/todos/getters.ts 的过程也是类似，只不过接口类型是 GetterTree。不过在定义 getTopNList 的时候利用了高阶函数的方式返回了一个 function 函数，这样做的目的就是为了让 getter 的计算函数能够传递参数，不过现在函数参数 n 则报了`参数“n”隐式具有“any”类型`的错误信息，因为并没有给 n 设置函数参数类型。

store/todos/getters.ts

```typescript
import { GetterTree } from 'vuex'; // Getters部分将使用GetterTree进行getter的数据类型声明
import { ITodosState, IAllState } from '../types'; // 引入数据类型
// 定义getters，数据类型则使用GetterTree进行声明
const getters: GetterTree<ITodosState, IAllState> = {
  // 获取todos前几个列表数据项
  getTopNList(state) {
    return function (n) {
      return state.todos.slice(0, n);
    };
  },
};
export default getters;
```

最终需要在 store/todos/index.ts 模块的入口文件中将 getters、mutations、actions 一同引入并添加至当前 todosModule 模块当中。

store/todos/index.ts

```typescript {4-6,10-12}
import { Module } from 'vuex';
import { IAllState, ITodosState } from '../types';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const todosModule: Module<ITodosState, IAllState> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true, // 开启命名空间
};
export default todosModule;
```

现在切换到视图页面组件 views/About.vue 中，利用 store 的 action 动作派发函数 dispatch 进行单个 todo 动作的执行操作，并且传递了一个参数 1，这将获取到 id 值为 1 的 todo 对象内容。

```vue
<template>
  <h1>关于我们</h1>
  <!-- 通过getters进行内容的获取，并且可以传递参数 -->
  <p>{{ store.getters['todos/getTopNList'](2) }}</p>
</template>

<script setup lang="ts">
import { useStore } from '../store';
const store = useStore();
// 调用getTodoByIdAction，并且传递参数，参数类型应该是一个数字型，因为是id值
store.dispatch('todos/getTodoByIdAction', 1);
// 调用getTodosListAction，并且传递参数，参数类型应该是一个对象，_page和_limit，它们都是数字型
store.dispatch('todos/getTodosListAction', { _page: 1, _limit: 5 });
</script>
```

从程序的执行结果来看程序并没有任何的问题，但在代码书写的时候并没有进行任何代码提示的操作，除非已经对 vuex 掌握的非常到位，否则不管是 actions 还是 getters，还是很难进行代码的书写与参数传递等操作的。

![image-20220605134535109](http://qn.chinavanes.com/qiniu_picGo/image-20220605134535109.png)

因为在 actions 与 getters 方法调用的时候都传递了参数，所以考虑在 actions 与 getters 指定的位置进行参数的数据类型限制，然后再查看在视图页面中如果参数不对应是否会产生错误提示。

我们给 actions 中的 getTodoByIdAction 的 payload 设置了 number 数字类型，给 getTodosListAction 的 payload 设置了对象数据类型，其中 \_page 为当前页数，\_limit 为每页显示条数，它们都是数字型。

store/todos/actions.ts

```typescript {7-8,14-18}
import { ActionTree } from 'vuex'; // Action部分将使用ActionTree进行action的数据类型声明
import { ITodosState, IAllState } from '../types'; // 引入数据类型
import { getTodoById, getTodosList } from '../../request'; // 引入请求方法
// 定义actions，数据类型则使用ActionTree进行声明
const actions: ActionTree<ITodosState, IAllState> = {
  // 单个Todo的action请求动作
  // 给payload设置数据类型为number
  async getTodoByIdAction({ commit }, payload: number) {
    const result = await getTodoById(payload);
    // 提交到mutations中进行修改数据
    commit('GET_TODO_BY_ID_MUTATIONS', result);
  },
  // 多个Todos的action请求动作
  // 给payload设置数据类型为对象类型，其中_page为当前页数，_limit为每页显示条数，它们都是数字型
  async getTodosListAction(
    { commit },
    payload: { _page: number; _limit: number }
  ) {
    const result = await getTodosList(payload);
    // 提交到mutations中进行修改数据
    commit('GET_TODOS_LIST_MUTATIONS', result);
  },
};
export default actions;
```

至于 getters 中 getTopNList 函数中返回函数的参数 n 现在则设置了 number 数字类型。

store/todos/getters.ts

```typescript {7}
import { GetterTree } from 'vuex'; // Getters部分将使用GetterTree进行getter的数据类型声明
import { ITodosState, IAllState } from '../types'; // 引入数据类型
// 定义getters，数据类型则使用GetterTree进行声明
const getters: GetterTree<ITodosState, IAllState> = {
  // 获取todos前几个列表数据项
  getTopNList(state) {
    return function (n: number) {
      return state.todos.slice(0, n);
    };
  },
};
export default getters;
```

原以为在 actions 与 getters 中对参数进行了指定类型的设置，在调用的时候就可以明确其数据类型，但是当我们回到 views/About.vue 中，将原来正确的数字类型的参数内容都改成字符串形式，程序并没有任何错误警告提示，我想这种结果是十分不理想的。

```vue
<template>
  <h1>关于我们</h1>
  <!-- 通过getters进行内容的获取，并且可以传递参数 -->
  <p>{{ store.getters['todos/getTopNList']('2') }}</p>
</template>

<script setup lang="ts">
import { useStore } from '../store';
const store = useStore();
// 调用getTodoByIdAction，并且传递参数，参数类型应该是一个数字型，因为是id值
store.dispatch('todos/getTodoByIdAction', '2');
// 调用getTodosListAction，并且传递参数，参数类型应该是一个对象，_page和_limit，它们都是数字型
store.dispatch('todos/getTodosListAction', { _page: '1', _limit: '5' });
</script>
```

如果直接调用 actions 与 getters 无法进行更好的 TypeScript 结合，或许可以转变思路尝试利用映射的方式进行操作。所以，需要在当前项目中安装 vuex-composition-helpers 模块，需要利用该模块进行 vuex 映射的支持。

```bash
npm install vuex-composition-helpers@next --save
```

安装完模块以后对于 vuex 的 store 仓库并不需要进行任何的修改，直接尝试在 views/About.vue 视图组件中进行 state、getters、actions 的映射操作。因为涉及到命名空间的问题，所以需要利用 vuex-composition-helpers 中的 createNamespacedHelpers 来确认当前操作的模块 todos，并且从中引入 useState、useGetters、useActions 等不同的映射方法，利用这些带命名空间的映射方式对 state、getters、actions 的具体内容进行映射操作。比如从 useState 中引入 todo、todos，从 useGetters 中引入 getTopNList 方法，从 useActions 中引入 getTodoByIdAction、getTodosListAction 方法。这样在进行 getTodoByIdAction 与 getTodosListAction 动作派发处理以后就可以进行单个 todo 的渲染、getTopNList 属性计算的显示以及 todos 列表的循环处理操作。

views/About.vue

```vue
<template>
  <h1>关于我们</h1>
  <!-- 单个todo对象的显示 -->
  <p>{{ todo }}</p>
  <!-- 通过getters进行内容的获取，并且可以传递参数 -->
  <p>{{ getTopNList('2') }}</p>
  <!-- 列表显示 -->
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.title }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { useStore } from '../store';
const store = useStore();
// 指定命名空间todos进行useState、useGetters、useActions的引入操作
const { useState, useGetters, useActions } = createNamespacedHelpers('todos');
// 利用useState从todos模块中映射todo、todos数据内容
const { todo, todos } = useState(['todo', 'todos']);
// 利用useGetters从todos模块中映射getTopNList方法
const { getTopNList } = useGetters(['getTopNList']);
// 利用useActions从todos模块中映射getTodoByIdAction、getTodosListAction方法
const { getTodoByIdAction, getTodosListAction } = useActions([
  'getTodoByIdAction',
  'getTodosListAction',
]);
// 调用getTodoByIdAction方法，获取指定id的todo内容
await getTodoByIdAction('2');
// 调用getTodosListAction方法，获取todos数据内容
await getTodosListAction({ _page: '1', _limit: '10' });
</script>
```

![image-20220605141052021](http://qn.chinavanes.com/qiniu_picGo/image-20220605141052021.png)

不过现在我们在进行 getTodoByIdAction、getTodosListAction、getTopNList 等函数调用时，传递错误类型的参数并没有显示程序错误，而在进行 todo 等插值表达式代码书写时也没有任何的代码提示，显然，当前的内容最后还是没有得到 TypeScript 的很好支持。

现在将鼠标移至 createNamespacedHelpers 这一函数上，可以查看到该函数的泛型参数内容有四个 any，那么这些 any 代表的意义是什么呢？通过 ctrl 加点击 createNamespacedHelpers 可以确认这 4 个 any 可以依次指定 TState、TGetters、TActions、TMutations 的数据类型。

![image-20220605141425760](http://qn.chinavanes.com/qiniu_picGo/image-20220605141425760.png)

![image-20220605141627367](http://qn.chinavanes.com/qiniu_picGo/image-20220605141627367.png)

既然泛型中已经明确可以设置 state、getter、actions、mutations 的数据类型，那么是否就可以给它添加对应的类型内容呢？现在似乎也只有定义了 ITodosState 状态值的数据类型，那么可以考虑先将它进行添加查看一下效果如何。

views/About.vue

```vue {4,10,21-22}
<template>
  <h1>关于我们</h1>
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

<script setup lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { useStore } from '../store';
import { ITodosState } from '../store/types';
const store = useStore();
// 指定命名空间todos进行useState、useGetters、useActions的引入操作
const { useState, useGetters, useActions } =
  createNamespacedHelpers<ITodosState>('todos');
// 利用useState从todos模块中映射todo、todos数据内容
const { todo, todos } = useState(['todo', 'todos']);
// 利用useGetters从todos模块中映射getTopNList方法
const { getTopNList } = useGetters(['getTopNList']);
// 利用useActions从todos模块中映射getTodoByIdAction、getTodosListAction方法
const { getTodoByIdAction, getTodosListAction } = useActions([
  'getTodoByIdAction',
  'getTodosListAction',
]);
// 调用getTodoByIdAction方法，获取指定id的todo内容
await getTodoByIdAction('2');
// 调用getTodosListAction方法，获取todos数据内容
await getTodosListAction({ _page: '1', _limit: '10' });
</script>
```

在给 createNamespacedHelpers 添加了 ITodosState 这一 state 的数据类型以后，模板中进行 todo 内容输入时则立即出现了对应的属性内容，说明 TypeScript 的支撑效果已经显现。

![image-20220605143006235](http://qn.chinavanes.com/qiniu_picGo/image-20220605143006235.png)

![image-20220605143021754](http://qn.chinavanes.com/qiniu_picGo/image-20220605143021754.png)

如果 state 状态能够进行 TypeScript 的支撑，那么 getters、actions 与 mutations 又应该如何处理呢？页面中 getTodoByIdAction、getTodosListAction、getTopNList 等函数调用的错误参数现在仍旧没有任何的反应。

回到 store/todos/getters.ts 程序文件中，将鼠标放置于 getTopNList 上查看函数的数据类型，它的 state 参数是 ITodosState，有一个函数参数 n 其数据类型为 number，并且函数的返回类型则是 ITodo[]。我们可以将这部分的提示代码进行复制，然后打开 store/types.ts 程序文件进行 TodosGetters 数据类型的定义操作，只需要将之前的提示信息类型粘贴到 TodosGetters 这个字面量类型当中即可。

![image-20220605144633422](http://qn.chinavanes.com/qiniu_picGo/image-20220605144633422.png)

store/types.ts

```typescript {27-30}
import { ActionContext } from 'vuex';

// 所有state状态
export interface IAllState {
  todos: ITodosState; // todos模块
  // 以后还可以添加users、news、products等模块
}

// 分类模块state状态定义
// 定义接口类型Todo
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
```

对于 actions 也可以进行类似的操作，将鼠标移至 getTodoByIdAction、getTodosListAction 上的时候也可以明确函数的返回类型，然后将提示信息进行复制，然后粘贴到 types.ts 的 actions 类型定义当中即可。

![image-20220605144912274](http://qn.chinavanes.com/qiniu_picGo/image-20220605144912274.png)

store/types.ts

```typescript {32-45}
import { ActionContext } from 'vuex';

// 所有state状态
export interface IAllState {
  todos: ITodosState; // todos模块
  // 以后还可以添加users、news、products等模块
}

// 分类模块state状态定义
// 定义接口类型Todo
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
  getTodoByIdAction(
    { commit }: ActionContext<ITodosState, IAllState>,
    payload: number
  ): Promise<void>;
  getTodosListAction(
    { commit }: ActionContext<ITodosState, IAllState>,
    payload: {
      _page: number;
      _limit: number;
    }
  ): Promise<void>;
};
```

现在只需要在 views/About.vue 中引入刚才定义的 TodosGetters、TodosActions 并给 createNamespacedHelpers 指定 getters 与 actions 即可。

```vue {18,22-23}
<template>
  <h1>关于我们</h1>
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

<script setup lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { useStore } from '../store';
import { ITodosState, TodosActions, TodosGetters } from '../store/types';
const store = useStore();
// 指定命名空间todos进行useState、useGetters、useActions的引入操作
const { useState, useGetters, useActions } = createNamespacedHelpers<
  ITodosState,
  TodosGetters,
  TodosActions
>('todos');
// 利用useState从todos模块中映射todo、todos数据内容
const { todo, todos } = useState(['todo', 'todos']);
// 利用useGetters从todos模块中映射getTopNList方法
const { getTopNList } = useGetters(['getTopNList']);
// 利用useActions从todos模块中映射getTodoByIdAction、getTodosListAction方法
const { getTodoByIdAction, getTodosListAction } = useActions([
  'getTodoByIdAction',
  'getTodosListAction',
]);
// 调用getTodoByIdAction方法，获取指定id的todo内容
await getTodoByIdAction('2');
// 调用getTodosListAction方法，获取todos数据内容
await getTodosListAction({ _page: '1', _limit: '10' });
</script>
```

现在编辑工具中马上显现了 getTopNList、getTodoByIdAction、getTodosListAction 等函数的错误数据类型内容，那么只需要根据提示修改成对应正确的 number 数据类型即可。

![image-20220605145544983](http://qn.chinavanes.com/qiniu_picGo/image-20220605145544983.png)

![image-20220605145710378](http://qn.chinavanes.com/qiniu_picGo/image-20220605145710378.png)

现在我们就已经将 vuex 仓库内容与 TypeScript 进行了完美的结合，让 TypeScript 在进行仓库管理的时候具备很好的类型约束与代码提示功能了。
