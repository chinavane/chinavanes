# 05.toRef 将 reactive 属性值进行 ref 类型转换

我们已经通过 reactive 的方式进行了数组与对象类型的响应式数据声明，在 js 逻辑层可以通过对象属性的方式进行 reactive 对象属性的操作，但是在模板层同样也需要通过对象属性的方式进行调用与渲染。那么是否有更为简便的方式将 reactive 对象属性在模板层直接渲染显示呢？可以考虑将 reactive 对象属性进行 ref 响应式数据的转换操作。

假若 state 这一 reactive 响应式数据有 count 对象属性，那么从 vue 中引入 toRef 函数以后可以通过`toRef(state, 'count')`将 count 这一个属性内容进行 ref 类型的转化，并且在转换以后进行 setup 函数 return 的返回处理，这样可以在模板层直接调用 count 值进行渲染。

显然 count 这一对象属性在原来 reactive 响应式数据定义的时候就已经初始化，所以利用 toRef 进行 ref 类型转换是能够正常处理。但如果对一个未初始化的 reactive 对象属性是否也能够直接利用 toRef 进行 ref 类型的转化操作呢？现在尝试直接` toRef(state, 'update')`，尝试将 state 中未定义的 update 属性进行 ref 类型转换并赋值给 update 变量，如果现在直接`console.log(update)`打印 update 则可以确认它就是一个 ref 类型数据，只不过 value 的值为 undefined 而已，那么就可以利用`update.value=0`进行 update 这一 ref 数据初始化操作，现在只需要将其 return 返回在模板层也可以直接操作与渲染 update 这一响应式数据内容。

现在在 increase 函数中可以直接对 reactive 对象属性 state.count 以及 state.update 进行修改操作，其修改以后的值同样会作用到 count 与 update 这两个 ref 响应式数据。如果想对 count 与 update 这两个 ref 数据进行直接修改，则需要通过 value 属性值的方式进行处理，同样的它们也会对应关联到 state 对象中 count 与 update 这两个属性，因为 count 与 update 是从 state 这个 reactive 响应式数据对象转化而来。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>toRef</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <p>update:{{ update }}</p>
      <p>satate.update:{{ state.update }}</p>
      <p>state.count:{{ state.count }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, reactive, toRef } = Vue;

      createApp({
        setup(props, context) {
          const state = reactive({
            count: 0,
          });
          // 将state的count转换为ref模式的响应式数据
          const count = toRef(state, 'count');
          // 利用toRef可以给state添加新的ref模式的响应式数据
          const update = toRef(state, 'update');
          // update为ref的响应式数据，所以可以通过value值进行赋值处理
          update.value = 0;
          const increase = () => {
            // 修改state.count、state.update值，将会触发count、update的更新
            state.count++;
            state.update++;

            // 如果要直接修改count与update，需要利用ref的方式进行value处理
            // count.value++;
            // update.value++;
          };
          return {
            count,
            update,
            state,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```
