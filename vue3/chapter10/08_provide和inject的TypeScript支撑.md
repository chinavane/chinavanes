# 08.provide 和 inject 的 TypeScript 支撑

用 provide 和 inject 可以很方便的在父子组件之间通讯，即使是多层子组件，也能获取到父组件的值。但是在接受 TypeScript 支撑的时候会遇上类型上的问题，导致父组件传给子组件的方法不能顺畅地调用。

比如可以在主组件 App.vue 中先定义一个名称为 User 的 interface 接口，它将包括 string 类型的 name 以及 number 类型的 age 这两个对象属性。然后设置响应式数据 user，数据类型为 User 接口类型，并设置初始值。接下来设置 setUser 方法，参数为 User 接口类型并进行解构赋值，函数返回类型 void。并且需要利用 provide 将 user 和 setUser 方法注入到组件中以便在其 App.vue 的嵌套子孙组件中进行调用，当然，为了方便查看也可以将用户的信息进行模板内容的渲染。

App.vue

```vue {2,16-29,33-34}
<script setup lang="ts">
import { provide, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const helloWorldModal = ref<InstanceType<typeof HelloWorld> | null>(null);
const toggleHellWorldModal = () => {
  helloWorldModal.value?.toggle();
};

const changeFnCallback = (emitObj: { id: number; value: string }) => {
  console.log(emitObj.id, emitObj.value);
};

interface User {
  name: string;
  age: number;
}
// 设置响应式数据user，数据类型为User接口类型，并设置初始值
const user = ref<User>({ name: '硅谷', age: 6 });
// 设置setUser方法，参数为User接口类型并进行解构赋值，函数返回类型void
const setUser = ({ name, age }: User): void => {
  user.value.name = name;
  user.value.age = age;
};
// 利用provide将user和setUser方法注入到组件中
provide('user', user);
provide('setUser', setUser);
</script>

<template>
  <h1>主组件App.vue</h1>
  <h2>用户名称：{{ user.name }} 用户年龄：{{ user.age }}</h2>
  <button @click="toggleHellWorldModal">切换</button>
  <HelloWorld
    msg="Vue3 & TypeScript"
    ref="helloWorldModal"
    @changeFn="changeFnCallback"
  />
</template>
```

然后在 components 目录下再新建一个 Grandson.vue 孙级组件，将利用利用 inject 将 user 数据和 setUser 方法注入到组件中，并且定义一个 changeUser 的方法，在该方法中将调用 setUser 这一由主组件 App 注入的函数。所以，为了数据的渲染与方法的调用，可以在模板部分添加插值表达式以及设置调用方法的按钮。

现在则可以查看到 setUser 的代码部分出现了错误警告，提示`对象的类型为 "unknown"`，同样在模板渲染部分 user 的对象内容也出现了 unknow 的情况。

components/Grandson.vue

```vue
<template>
  <div>
    <h2>孙级组件</h2>
    <p>{{ user.name }} {{ user.age }}</p>
    <button @click="changeUser">修改用户</button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
// 利用inject将user和setUser方法注入到组件中
const user = inject('user');
const setUser = inject('setUser');
// 添加changeUser方法，将调用setUser方法，并传入参数
const changeUser = () => {
  setUser({ name: '硅谷', age: 10 });
};
</script>
```

![image-20220602185420702](http://qn.chinavanes.com/qiniu_picGo/image-20220602185420702.png)

![image-20220603092200259](http://qn.chinavanes.com/qiniu_picGo/image-20220603092200259.png)

暂且将错误警告放置一边，先在 Grandson.vue 孙级组件的父组件中将 Grandson 这一子组件进行引入并调用。然后将 App.vue 这个父组件中 user 与 setUser 相关的代码进行完全的复制与粘贴操作。

```vue {2-3,91-104,108}
<script setup lang="ts">
import Grandson from './GrandSon.vue';
import { ref, nextTick, computed, watch, provide } from 'vue';
// 设置input输入框ref对象
const ipt = ref<HTMLInputElement | null>(null);
const count = ref<number>(0);
// 切换框态框布尔值
const toggleModal = ref<boolean>(false);
// 切换框态框方法
const toggle = async () => {
  // 将值取反
  toggleModal.value = !toggleModal.value;
  await nextTick(); // 等待DOM更新完毕
  // 如果模态框显示的时候，设置input输入框的焦点
  if (toggleModal.value) {
    ipt.value?.focus();
  }
};

// event参数为input框的Event事件类型，函数无返回值
const handleInput = (event: Event): void => {
  // 打印input输入框内容需要确认输入框的类型为HTMLInputElement，否则无法识别有其value属性
  // console.log((event.target as HTMLInputElement).value)
};

// 属性计算的返回值类型限定为number数字型
const double = computed<number>(() => {
  return count.value * 2;
});

// 可以传递参数的computed进行参数与计算返回值的类型定义
const stepCount = computed(() => {
  return function (step: number) {
    return count.value * step;
  };
});

watch(count, (newVal, oldVal) => {
  // 虽然根据类型推断count是数字类型，从而影响newVal和oldVal都是数字类型
  // 并且 newVal.toFixed(2) 代码模式也并不出错
  // 但是这都是基于ts是声明式，只有在代码书写阶段会判断其类型
  // 但是watch的执行是编译后，是运行时，代码已经转成了js，数据通过响应式变化，它并不识别count是否为number数据类型
  // 因为得到的是input操作以后变化的新值，所以得到的结果是一个string字符串类型，最终将导致程序出现问题，所以需要进行手动数据类型转换
  console.log((+newVal).toFixed(2));
});

// 向外暴露toggle切换方法
defineExpose({
  toggle,
});

// 子组件中定义父组件传递的属性
/*
const props = defineProps({
  // msg可以是字符型与数字型，并且必须传递该属性
  msg: { type: [String, Number], required: true },
  // birthday是数字类型，默认值为2015，还需要进行有效性校验，必须是2014、2015、2016三个数字中的一个
  birthday: {
    type: Number,
    required: true,
    default: 2015,
    validator: (prop: number) => {
      return [2014, 2015, 2016].includes(prop)
    }
  }
})
*/

// 定义自面量类型
type TBirthday = 2014 | 2015 | 2016;

// 定义接口类型属性
interface Props {
  msg: string | number;
  birthday?: TBirthday;
}

// 定义接收的属性为接口类型Props
// 可以利用withDefaults进行默认属性值设置
const props = withDefaults(defineProps<Props>(), {
  birthday: 2015,
});

const emit = defineEmits<{
  (e: 'changeFn', emitObj: { id: number; value: string }): void;
}>();
const changeParentEmit = () => {
  emit('changeFn', { id: 1, value: '我是子组件传递过来的值' });
};

interface User {
  name: string;
  age: number;
}
// 设置响应式数据user，数据类型为User接口类型，并设置初始值
const user = ref<User>({ name: '硅谷', age: 14 });
// 设置setUser方法，参数为User接口类型并进行解构赋值，函数返回类型void
const setUser = ({ name, age }: User): void => {
  user.value.name = name;
  user.value.age = age;
};
// 利用provide将user和setUser方法注入到组件中
provide('user', user);
provide('setUser', setUser);
</script>

<template>
  <Grandson />
  <!-- 利用穿梭移动将modal框态框绑定到body元素上 -->
  <Teleport to="body">
    <div v-if="toggleModal" class="modal">
      <p>这是一个模态框</p>
      <p>count:{{ count }}</p>
      <p>double:{{ double }}</p>
      <p>stepCount:{{ stepCount(5) }}</p>
      <p>msg:{{ msg }}</p>
      <p>birthday:{{ birthday }}</p>
      <input ref="ipt" v-model="count" @input="handleInput" />
      <button @click="changeParentEmit">改变父组件的值</button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  background: #f5f5f5;
  width: 300px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
}
</style>
```

然后回来考虑为什么会产生现在 unknow 的错误信息？这是因为在 inject 注入的时候我们注入的是 user、setUser 这两个数据与方法内容，虽然现在 App.vue 主组件中进行了数据的定义与 provide 的提供，但是在 Grandson.vue 的父组件 HelloWorld.vue 中是否还会定义？因为 App.vue 是属于爷爷级别的组件，事实上 HelloWorld.vue 这个父亲级别的组件也可以定义 user 以及 setUser，也可以进行 provide 的提供，那么作为孙级的 Grandson.vue 是否能够清楚到底应该接收的是哪一个？确实是不清楚的。

```typescript
const user = inject('user'); // 到底接收的是App还是HelloWorld的user？
const setUser = inject('setUser'); // 到底接收的是App还是HelloWorld的setUser？
```

那么如何才能对 provide 提供与 inject 注入的内容进行唯一性识别呢？可以想办法给他们设置一定的唯一标识。这时候就可以用 InjectionKey 来定义类型，确保父传出去的值和子接收到的值类型是一样的。

先在 src 目录下新建 types 目录，并在该目录下创建 provideInjectType.ts 程序文件。

我们可以定义用户接口数据类型，name 为 string 字符串，age 为 number 类型。

定义 SetUser 函数字面量类型，函数参数为 User 类型，返回值为 void 类型。

然后声明 userKey 以及 setUserKey，利用 InjectionKey 接口，指定注入的 key 值，再利用 Symbol 类型，指定并初始化 key 值的类型与初始值，因为 Symbol 会产生唯一的标识。

```typescript
import { InjectionKey, Ref, ref } from 'vue';
// 定义用户接口数据类型
export interface User {
  name: string;
  age: number;
}
// 定义SetUser函数字面量类型，函数参数为User类型，返回值为void类型
export type SetUser = (user: User) => void;
// 设置userKey，利用InjectionKey接口，指定注入的key值，利用Symbol类型，指定并初始化key值的类型与初始值
export const userKey: InjectionKey<Ref<User>> = Symbol('');
// 设置setUserKey，利用InjectionKey接口，指定注入的key值，利用Symbol类型，指定并初始化key值的类型与初始值
export const setUserKey: InjectionKey<SetUser> = Symbol('');
```

现在修改 App.vue，将 provideInjectType 中的 userKey、setUserKey、 User、 SetUser 等内容进行导入，然后删除 User 接口定义，可以将 user 以及 setUser 进行数据类型的明确，并且在 provide 中利用 userKey 与 setUserKey 进行唯一性 key 值的设置。

```vue {3,17,22,27-28}
<script setup lang="ts">
import { provide, ref } from 'vue';
import { userKey, setUserKey, User, SetUser } from './types/provideInjectType';
import HelloWorld from './components/HelloWorld.vue';
const helloWorldModal = ref<InstanceType<typeof HelloWorld> | null>(null);
const toggleHellWorldModal = () => {
  helloWorldModal.value?.toggle();
};

const changeFnCallback = (emitObj: { id: number; value: string }) => {
  console.log(emitObj.id, emitObj.value);
};

// 删除User接口定义

// 设置响应式数据user，数据类型为User接口类型，并设置初始值
const user = ref<User>({ name: '硅谷', age: 6 });
// 设置setUser方法，参数为User接口类型并进行解构赋值，函数返回类型void
const setUser: SetUser = ({ name, age }: User): void => {
  user.value.name = name;
  user.value.age = age;
};
// 利用provide将user和setUser方法注入到组件中
provide(userKey, user);
provide(setUserKey, setUser);
</script>

<template>
  <h1>主组件App.vue</h1>
  <h2>用户名称：{{ user.name }} 用户年龄：{{ user.age }}</h2>
  <button @click="toggleHellWorldModal">切换</button>
  <HelloWorld
    msg="Vue3 & TypeScript"
    ref="helloWorldModal"
    @changeFn="changeFnCallback"
  />
</template>
```

现在只需要在 Grandson.vue 孙组件中同样引入 provideInjectType 的 userKey 与 setUserKey，并且在 inject 注入的时候使用 userKey 与 setUserKey，这样的话就可以与 App.vue 中所 provide 的键名内容进行唯一性的对应。并且 setUser 方法以及 user 对象部分的内容不再报错，不过还是需要添加?可选项设置，因为不管是 setUser 还是 user 都可能会存在 undefined 未定义的情况。

```vue
<template>
  <div>
    <h2>孙级组件</h2>
    <p>{{ user?.name }} {{ user?.age }}</p>
    <button @click="changeUser">修改用户</button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { userKey, setUserKey } from '../types/provideInjectType';
// 利用inject将user和setUser方法注入到组件中
const user = inject(userKey);
const setUser = inject(setUserKey);
// 添加changeUser方法，将调用setUser方法，并传入参数
const changeUser = () => {
  setUser?.({ name: '硅谷', age: 10 });
};
</script>
```
