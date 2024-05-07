# 06.computed 属性计算、methods 方法调用与 watch 监控中的 TypeScript 支撑

除了给数据进行 TypeScript 数据类型的支撑在 vue 中还有 methods 方法、computed 属性计算以及 watch 监控等操作，在这些以函数为主体操作的内容当中又与 TypeScript 有什么样的关联呢？

## 1)methods 方法与 TypeScript 的支撑

假若声明一个 ref 的响应式数据 count，定义其数据类型为 number，初始化其值为 0，并且修改页面中的 input 输入框内容，添加 v-model 双向数据绑定操作，那么这时就可以进行 count 值的插值表达式渲染了。

```typescript
// 新增一个count数据，数据类型为number，初始值为0
const count = ref<number>(0);
```

```vue
<div v-if="toggleModal" class="modal">
  <p>这是一个模态框</p>
  <!-- input进行双向数据绑定并进行count插值渲染 -->
  <p>count:{{ count }}</p>
  <input ref="ipt" v-model="count" />
</div>
```

接下来准备给 input 输入框绑定一个 input 的事件 handleInput，需要在脚本部分声明对应的函数 handleInput，其实函数中可以接收一个参数 event，这是用户在进行输入框输入时的事件对象，如果没有给其明确的事件类型，那么在进行事件对象属性获取的时候并不会产生任何有效属性的提示，而且就算编写了错误的属性获取也不会有任何的提示信息，比如 event.target 上并不存在 currentValue 这一属性值。

```typescript
const handleInput = (event) => {
	console.log(event.target.currentValue); // event.target上存在value属性并不存在currentValue属性值
};
```

![image-20220602120017819](http://qn.chinavanes.com/qiniu_picGo/image-20220602120017819.png)

那么如何才能明确 handleInput 中的 event 参数的类型呢？可以将鼠标移动至@input 事件绑定的位置，编辑器会弹出提示信息，确认 payload 有效载荷的类型为 Event 事件类型，那么就可以明确 handleInput 的 event 其类型就是为 Event。

![image-20220602121330238](http://qn.chinavanes.com/qiniu_picGo/image-20220602121330238.png)

在明确了 event 的事件参数类型以后其 event.target.currentValue 代码内容就已经明确报以错误提示。

![image-20220602121550124](http://qn.chinavanes.com/qiniu_picGo/image-20220602121550124.png)

如果将鼠标放置 currentValue 关键字内容上，则会显示`类型“EventTarget”上不存在属性“currentValue”`的错误信息。如果将鼠标放置 evnet.target 关键字内容上，则会显示`对象可能为 "null"`的错误信息。

![image-20220602122242963](http://qn.chinavanes.com/qiniu_picGo/image-20220602122242963.png)

![image-20220602122334239](http://qn.chinavanes.com/qiniu_picGo/image-20220602122334239.png)

所以在重写代码时，只需要输入 event 就可以显示该对象下所有可用属性，但在输入 event.target 以后还是没有提示 event.target 下的任何可用属性，而产生此问题的原因是什么呢？

![image-20220602124042857](http://qn.chinavanes.com/qiniu_picGo/image-20220602124042857.png)

![image-20220602122627256](http://qn.chinavanes.com/qiniu_picGo/image-20220602122627256.png)

其实当前只是定义了 handleInput 的 event 事件类型，但最终 event.target 操作的是 input 这个 HTMLInputElement 元素，所以在没有明确 event.target 对象的类型时并不能够确认它具有 value 属性值。所以可以将 event.target 进行 as 断言判断，如果它的类型为 HTMLInputElement 类型，那么可以确认它将会拥有 value 属性值。

```typescript
// event参数为input框的Event事件类型，函数无返回值
const handleInput = (event: Event): void => {
	// 打印input输入框内容需要确认输入框的类型为HTMLInputElement，否则无法识别有其value属性
	console.log((event.target as HTMLInputElement).value);
};
```

![image-20220602124931269](http://qn.chinavanes.com/qiniu_picGo/image-20220602124931269.png)

## 2)computed 属性计算与 TypeScript 的支撑

简单的 computed 属性计算的类型定义比较明确，因为 computed 应用的是一个函数，所以只需要考虑函数的返回类型即可。比如定义一个 double 属性计算结果值，在进行 computed 属性计算时定义其函数返回的类型为 number，那么在函数 return 返回时只需要返回数字类型即可。

```typescript
// 属性计算的返回值类型限定为number数字型
const double = computed<number>(() => {
	return count.value * 2; // 因为使用的是乘法，所以数据类型自动转化
});
```

如果函数返回的数据类型不是 number 类型，那么就会报以语法错误，提示数据类型不匹配。

![image-20220602131138579](http://qn.chinavanes.com/qiniu_picGo/image-20220602131138579.png)

事实上 computed 属性计算除了可以进行直接结果计算，还可以进行传参模式的操作，不过需要在属性计算中进行函数类型的返回操作。那么对于返回的函数中参数类型是否也同样能够进行类型约束呢？答案当然是肯定的。

我们可以再定义一个 stepCount 属性计算结果值，并且希望在该函数调用的时候可以传递一个数据类型为 number 的 step 步长值，最终利用 count.value 值与其步长参数相加进行最终结果的返回。

```typescript
// 可以传递参数的computed进行参数与计算返回值的类型定义
const stepCount = computed(() => {
	return function (step: number) {
		return count.value * step;
	};
});
```

那么，在模板中调用 stepCount 这个属性函数时，如果传递的参数并不是 number 数字类型，则会报以错误提示，比如`类型“string”的参数不能赋给类型“number”的参数`。

![image-20220602132020717](http://qn.chinavanes.com/qiniu_picGo/image-20220602132020717.png)

现在只是简单的给函数的参数 step 进行了 number 数据类型的定义，如果想对 computed 进行完整的类型定义应该如何操作呢？可以将鼠标放置 computed 关键字上，可以看到有详细的提示信息，其实已经明确 computed 的类型是一个函数类型，step 的参数为 number，并且函数的返回类型仍旧是 number。可以将`<(step: number) => number>`的 computed 泛型类型定义内容进行复制，然后直接粘贴至 computed 关键字的后面，这样就可以显式的进行 computed 数据类型的定义操作。

![image-20220602135154746](http://qn.chinavanes.com/qiniu_picGo/image-20220602135154746.png)

```typescript
// 可以传递参数的computed进行参数与计算返回值的类型定义
const stepCount = computed<(step: number) => number>(() => {
	return function (step: number) {
		return count.value * step;
	};
});
```

## 3)watch 监控与 TypeScript 的支撑

methods 方法调用与 computed 属性计算都可以进行 TypeScript 的数据类型定义，我想 watch 实时监控也没什么问题吧。当我们想对 count 这一响应式数据进行 watch 监控时，可以在调用 newVal 时看到 number 类型所拥有的方法内容，这是因为不管是去查看 count 还是 newVal 或者 oldVal 这些单词内容时都可以明确的获知对象是 number 类型，所以在函数体里进行尝试对 newVal 进行 toFixed 方法的调用。

![image-20220602135314154](http://qn.chinavanes.com/qiniu_picGo/image-20220602135314154.png)

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220602135412534.png" alt="image-20220602135412534" style="zoom:50%;" />

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220602135425506.png" alt="image-20220602135425506" style="zoom:50%;" />

看起来 watch 监控的数据类型推测以及函数调用在语法检测阶段没有任何的问题，但是在运行项目时，在改变 input 内容以后却报了 newVal 中 toFixed 函数不存在的问题，为什么会产生如此情况呢？

```typescript
watch(count, (newVal, oldVal) => {
	console.log(newVal.toFixed(2));
});
```

![image-20220602135723995](http://qn.chinavanes.com/qiniu_picGo/image-20220602135723995.png)

虽然根据类型推断 count 是数字类型，从而预测 newVal 和 oldVal 都是数字类型，并且 newVal.toFixed(2) 代码模式也并不出错，但是这些都是基于 TypeScript，TypeScript 其实是声明式，只有在代码书写阶段会判断其类型。但是 watch 的执行是编译后，是运行时，其实这时候的代码已经转成了 JavaScript，数据通过响应式变化，它并不会识别 count 是否为 number 数据类型，因为对于 JavaScript 来说现在的 count 不管是什么类型都是没有任何错误的，至少从代码内容上来说是如此。现在监控 input 操作以后变化的新值，打印其数据类型的话，得到的结果是一个 string 字符串类型，而这最终将导致程序出现问题，所以需要进行手动数据类型转换操作。

```typescript
watch(count, (newVal, oldVal) => {
	console.log(typeof newVal); // string
});
```

```typescript
watch(count, (newVal, oldVal) => {
	console.log((+newVal).toFixed(2));
	// 需要进行数据类型的转化，需要注意静态检测与动态编译不同的阶段
});
```

所以说 TypeScript 实现的是静态检测，并不是所有场景都适应，有些场景下还是需要开发人员对其值的类型进行转换操作。

components/HelloWorld.vue

```vue
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
</script>

<template>
	<!-- 利用穿梭移动将modal框态框绑定到body元素上 -->
	<Teleport to="body">
		<div v-if="toggleModal" class="modal">
			<p>这是一个模态框</p>
			<p>count:{{ count }}</p>
			<p>double:{{ double }}</p>
			<p>stepCount:{{ stepCount(5) }}</p>
			<input ref="ipt" v-model="count" @input="handleInput" />
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
