# 03.利用 ref 声明响应式数据

ref 是 vue3 组合式 API 中最为常用的一种响应式数据声明方式，在利用 ref 进行响应式数据声明的时候需要先从 vue 中引入 ref 方法，然后在 setup 函数中才可以利用 ref 函数声明响应式数据，否则将会报以`ref is not defined`的错误信息。这是 vue3 为了实现 treeShaking 树摇方式的基本操作前提，就是将原来整体对象引入的方式改写成了函数引入方式，使用什么函数就引入什么函数，那么 vue3 在编译打包的时候会将没有使用到的内容进行 treeShaking 树摇操作给剔除。

在从 vue 中引入 ref 响应式声明函数以后就可以在 setup 里进行响应式数据的声明操作，可以直接声明响应式数据并且利用 ref 进行初始值设置处理。比如现在可以`const count = ref(0)`就是声明了一个初始值为 0 的响应式数据 count。不过这时候如果想在 template 模板中进行插值显示与渲染还有一定的障碍，因为想要在 template 模板中正常调用`count`这一响应式数据需要在 setup 函数中利用 return 进行对象返回，而返回的对象中需要有`count`这一响应式数据。

在完成引入 ref、利用 ref 进行响应式数据声明以及 return 返回响应式数据这三个步骤操作以后就可以在 template 模板部分利用插值表达式的方式进行响应式数据的渲染操作，当前渲染的结果就是 ref 初始化的值。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用ref声明响应式数据</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <p>count:{{ count }}</p>
    </div>
    <script>
      const { createApp, ref } = Vue;
      createApp({
        setup(props, context) {
          const count = ref(0);
          return {
            count,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

其实 ref 声明的响应式数据是一个对象，有且只有一个属性值为 value，在 template 模板中渲染 ref 响应式对象并不需要通过 value 获取显示，但是在 js 操作部分则需要通过 value 属性值来修改 ref 声明的响应式数据。比如可以在 setup 函数中定义一个 increase 递增函数，而此函数的作用就是对利用 ref 声明的 count 值进行递增操作，那么我们需要对 count 的属性 value 值进行累加处理才可以，而不能仅仅对 count 进行数字叠加，否则会报以`Assignment to constant variable`尝试给常量赋值的错误。

其实 increase 这个函数就相当于选项 API 中的 methods 对象中对响应式数据操作的方法，因为在组合 API 中不再有单独的 methods 方法声明，不过在定义完 increase 方法以后想要在模板中正常调用此方法同样需要在 setup 的 return 对象中将此函数进行返回处理。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用ref声明响应式数据</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <button @click="increase">increase</button>
    </div>
    <script>
      const { createApp, ref, isRef, unref } = Vue;
      createApp({
        setup(props, context) {
          const count = ref(0);
          const update = 8;
          const increase = () => {
            count.value++;
            // 判断是否为ref响应式数据，如果判断count返回的就是true，如果判断update返回的就是false
            console.log(isRef(count));
            // 可以利用unref返回ref及普通数据的数据值
            // 如果unref参数是 ref，则返回内部值，否则返回参数本身。
            // 这是 val = isRef(val) ? val.value : val 计算的一个语法糖
            console.log(unref(update));
          };
          return {
            count,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

对于利用 ref 声明的响应式数据还有一些函数进行辅助配合，比如 isRef 可以判断参数是否为 ref 声明的响应式数据，只有返回值是 true 才表明是 ref 声明的响应式数据。而 unref 函数可以返回 ref 以及普通数据的数据值，如果 unref 参数是 ref 声明的响应式数据，那么 unref 函数调用以后就会直接返回 ref 声明响应式数据的 value 值，如果 unref 函数的参数是普通的非响应式数据，那么 unref 函数调用以后则直接返回普通数据值，它算是 isRef 条件判断的三元运算结果语法糖吧。

需要注意的是，在组合 API 中通常利用 ref 进行一些基础数据类型的定义，对于数组与对象类型则一般使用 reactive 进行实现，不过这不代表无法利用 ref 进行数据与对象式响应式数据的定义。

因为 reactive 进行响应式数据声明必须传递一个数组或对象，所以在实际开发中如果只是想让某个变量实现响应式的时候会非常麻烦，因此存在了 ref 这一函数。但 ref 底层其实还是 reactive，所以当运行时系统会自动根据传入的 ref 转换成 reactive 的对象形式。所以接下来再一起了解一下 reactive 如何进行响应式数据的声明。
