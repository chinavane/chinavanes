# 07.props 和 emits 的 TypeScript 支撑

## 1)props 属性与 TypeScript 的支撑

在子组件中接收父组件传递过来的属性可以有多种方式进行属性内容的约束操作，比如在 defineProps 中直接定义接收属性的类型、必填、默认值与有效性值等内容。

假若现在在子组件中定义父组件传递的属性，其一是 msg 属性，它可以是字符型与数字型，并且必须传递该属性。那么就可以限制其 type 类型，而因为属性类型可以是字符串与数字多种类型，所以可以设置一个数组，再添加 required 属性为 true。至于 birthday 目前设置的是数字类型，默认值为 2015，还进行了有效性校验，必须是 2014、2015、2016 三个数字中的一个。

components/HelloWorld.vue

```typescript
// 子组件中定义父组件传递的属性
const props = defineProps({
  // msg可以是字符型与数字型，并且必须传递该属性
  msg: { type: [String, Number], required: true },
  // birthday是数字类型，默认值为2015，还需要进行有效性校验，必须是2014、2015、2016三个数字中的一个
  birthday: {
    type: Number,
    default: 2015,
    validator: (prop: number) => {
      return [2014, 2015, 2016].includes(prop);
    },
  },
});
```

当然，可以将父组件传递过来的属性值进行渲染，显示在当前的页面上。

```vue {9-10}
<template>
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
    </div>
  </Teleport>
</template>
```

现在回到主组件 App.vue 中，因为 App.vue 中对于子组件 HelloWorld 的调用并没有传递 msg 等属性，则会报以语法错误。

![image-20220602163726281](http://qn.chinavanes.com/qiniu_picGo/image-20220602163726281.png)

但如果将 HelloWorld 组件的 msg 属性进行设置，那么程序将不再报以任何的错误。

```vue
<HelloWorld msg="Vue3 & TypeScript" ref="helloWorldModal" />
```

或许可以尝试将 birthday 也添加 required 必填值的设置，但这时也仅仅会在运行时提示警告信息，因为我们设置了 default 默认值。

```typescript {8}
// 子组件中定义父组件传递的属性
const props = defineProps({
  // msg可以是字符型与数字型，并且必须传递该属性
  msg: { type: [String, Number], required: true },
  // birthday是数字类型，默认值为2015，还需要进行有效性校验，必须是2014、2015、2016三个数字中的一个
  birthday: {
    type: Number,
    required: true,
    default: 2015,
    validator: (prop: number) => {
      return [2014, 2015, 2016].includes(prop);
    },
  },
});
```

![image-20220602164510189](http://qn.chinavanes.com/qiniu_picGo/image-20220602164510189.png)

假如在 App.vue 中在进行 HelloWorld 子组件调用时设置 birthday，但属性值并不在 2014、2015、2016 这三个数字中，那么程序仍旧不会报以任何错误，而只是会在运行的时候提示警告信息。

```vue
<HelloWorld msg="Vue3 & TypeScript" :birthday="2013" ref="helloWorldModal" />
```

![image-20220602164551797](http://qn.chinavanes.com/qiniu_picGo/image-20220602164551797.png)

利用 TypeScript 进行属性数据类型的定义与约束可以更好的强化组件之间的属性传递的代码编写体验，对于 msg 属性可以利用 interface 定义一个接口，msg 就可以是 string 与 number 的联合类型，至于 birthday 则可以是一个字面量数据类型，并且利用?进行可选属性的设定，然后只需要将 Props 这个接口类型限制于 defineProps 中即可。

```typescript
// 定义自面量类型
type TBirthday = 2014 | 2015 | 2016;

// 定义接口类型属性
interface Props {
  msg: string | number;
  birthday?: TBirthday;
}

// 定义接收的属性为接口类型Props
const props = defineProps<Props>();
```

现在查看 App.vue 父组件，则可以明确提示 birthday 这一属性是不能设置 2013 这一数字值的，报以了语法错误信息。

![image-20220602165529998](http://qn.chinavanes.com/qiniu_picGo/image-20220602165529998.png)

即便你尝试利用 withDefaults 进行 birthday 默认值的设置，仍旧无法改变 birthday 这一属性值不能设置 2013 这一数值的结果，利用 TypeScript 进行属性类型的约束可以将程序问题限定在语法错误范围，而不是运行的警告错误。

```typescript
// 定义接收的属性为接口类型Props
// 可以利用withDefaults进行默认属性值设置
const props = withDefaults(defineProps<Props>(), {
  birthday: 2015,
});
```

## 2)emits 自定义事件与 TypeScript 的支撑

现在父组件 App.vue 中在进行 HelloWorld 子组件调用的时候我想给它添加一个自定义事件的监听，也就是 changeFn，它将绑定 changeFnCallback 的回调函数，而在该函数中目前将打印一个 e 的回调参数，只不过现在这个 e 目前只能被推断为 any 类型，所以显示了警告提示`参数“e”隐式具有“any”类型`。

App.vue

```vue {9-11,16}
<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const helloWorldModal = ref<InstanceType<typeof HelloWorld> | null>(null);
const toggleHellWorldModal = () => {
  helloWorldModal.value?.toggle();
};

const changeFnCallback = (e) => {
  console.log(e);
};
</script>

<template>
  <button @click="toggleHellWorldModal">切换</button>
  <HelloWorld
    msg="Vue3 & TypeScript"
    ref="helloWorldModal"
    @changeFn="changeFnCallback"
  />
</template>
```

![image-20220602171144420](http://qn.chinavanes.com/qiniu_picGo/image-20220602171144420.png)

现在在 HelloWorld.vue 子组件中就可以利用 defineEmits 进行数据类型的定义，利用泛型我们确认了将绑定的事件名称为 changeFn，并且在调用该事件的时候将可以传递一个对象，并且对象中将拥有 number 类型的 id 以及 string 类型的 value 这两对象属性值。

```typescript
const emit = defineEmits<{
  (e: 'changeFn', emitObj: { id: number; value: string }): void;
}>();
```

那么现在只需要在模板中添加一个 button 按钮，并且绑定 click 事件，该事件的回调函数是 changeParentEmit。

```vue
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
```

所以再定义 changeParentEmit 函数，并且在该函数调用 emit，并且 emit 的事件名称就是 defineEmits 中所约束的 changeFn，而且还需要传递一个对象，对象中必须包含 number 类型的 id 以及 string 类型的 value，如果只有 id 属性值没有 value，那么程序就会报以错误信息，如果数据类型不对应，也同样会报一定的错误信息。

```typescript
const changeParentEmit = () => {
  emit('changeFn', { id: 1, value: '我是子组件传递过来的值' });
};
```

![image-20220602171755976](http://qn.chinavanes.com/qiniu_picGo/image-20220602171755976.png)

现在回到父组件中查看@changeFn 的自定义事件，则可以清晰的看到 changeFn 这个事件传递对象的内容以及类型了。可以直接将 emitObj 的函数参数以及类型定义复制，并粘贴到 changeFnCallback 的函数参数当中去。

![image-20220602172045544](http://qn.chinavanes.com/qiniu_picGo/image-20220602172045544.png)

既然 changeFnCallback 的参数也同样确认了类型，所以可以非常轻松的获取到子组件自定义事件传递过来的数据对象以及对象属性内容。

![image-20220602172309399](http://qn.chinavanes.com/qiniu_picGo/image-20220602172309399.png)

App.vue

```vue {9-14,19}
<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
const helloWorldModal = ref<InstanceType<typeof HelloWorld> | null>(null);
const toggleHellWorldModal = () => {
  helloWorldModal.value?.toggle();
};

const changeFnCallback = (emitObj: { id: number; value: string }) => {
  console.log(emitObj.id, emitObj.value);
};
</script>

<template>
  <button @click="toggleHellWorldModal">切换</button>
  <HelloWorld
    msg="Vue3 & TypeScript"
    ref="helloWorldModal"
    @changeFn="changeFnCallback"
  />
</template>
```

components/HelloWorld.vue

```vue {68-88,99-100,102}
<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue';
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
</script>

<template>
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
