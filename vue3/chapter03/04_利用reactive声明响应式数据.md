# 04.利用 reactive 声明响应式数据

reactive 同样是 Vue3 中提供的实现响应式数据的方法，在 Vue2 中对象的响应式数据是通过 Object.defineProperty 数据劫持来实现，在 Vue3 中响应式数据是通过 ES 的 Proxy 与 Reflect 对象代理劫持与反射操作实现的。reactive 参数必须是数组或对象，假若给 reactive 传递了其它数据类型，默认情况下，修改数据将无法实现界面的数据绑定更新。

比如我们在从 vue 中引入 reactive 函数以后声明响应式数据 count 尝试设置初始值为 0，那就意味着 reactive 的数据类型为基础数据类型，假若想用 increase 函数进行 count++递增操作，在将 count 与 increase 进行 return 返回以后，虽然模板中可以显示 count 的初始值 0，但想进行按钮点击触发 increase 递增函数则会发现界面中的 count 值没有任何的变化。如果在 increase 中利用 console.log 打印输出 count 值会发现数值确实发生变化，但它却不是响应式数据，无法触发界面的重绘显示。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用reactive声明响应式数据</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <button @click="increase">increase</button>
    </div>
    <script>
      const { createApp, reactive } = Vue;
      createApp({
        setup(props, context) {
          // 如果reactive的数据类型是基础数据类型
          // 那么increase函数中的count++操作不会触发视图更新
          const count = reactive(0);
          const increase = () => {
            count++;
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

所以可以尝试将 reactive 的数据类型设置为对象，那么在 increase 函数中修改 reactive 数据的时候则需要通过对对象属性进行递增处理。如果 setup 函数的 return 最终返回的是声明的 reactive 对象，那么在模板页面中进行插值显示时也需要通过对象属性的方式进行渲染显示。如果我们通过 console.log 打印 reactive 声明的数据，可以在控制台查看到 Proxy 代理对象，这表明你所声明的数据确实为响应式数据。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用reactive声明响应式数据</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <p>state.count:{{ state.count }}</p>
      <button @click="increase">increase</button>
    </div>
    <script>
      const { createApp, reactive } = Vue;
      createApp({
        setup(props, context) {
          // reactive的数据类型需要是数组或对象
          // 那么increase函数中的state.count++操作则会触发视图更新
          const state = reactive({
            count: 0,
          });
          console.log(state);
          const increase = () => {
            state.count++;
          };
          return {
            state,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

现在将 reactive 的数据类型设置为数组，通过 console.log 打印 reactive 声明的数据，可以在控制台查看到 Proxy 代理对象，这表明数据类型为数组的 reactive 变量同样也为响应式数据。既然是响应式数据，那么就可以对数组元素进行修改处理，同样的也会触发模板中的视图结果。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用reactive声明响应式数据</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>state:{{ state }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, reactive } = Vue;

      createApp({
        setup(props, context) {
          // reactive的数据类型需要是数组或对象
          // 那么increase函数中的state[0]++操作则会触发视图更新
          const state = reactive([1, 2, 3, 4, 5]);
          console.log(state);
          const increase = () => {
            state[0]++;
          };
          return {
            state,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```
