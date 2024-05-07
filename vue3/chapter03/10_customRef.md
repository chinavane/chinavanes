# 10.customRef

vue3 除了内置的 ref 响应式数据声明还支持自定义创建 ref，用户可以对数据进行依赖的跟踪，还可以在指定条件下触发更新。利用 customRef 就可以实现自定义创建 ref，不过它是一个工厂函数，并且该函数有 track 和 trigger 这两个参数，这两个参数都是函数类型。customRef 函数可以返回一个对象，对象中包含 get 与 set 方法，通常 track 在 get 方法中调用，它会通知 vue 对监测值进行跟踪，而 trigger 则在 set 方法中调用，它会通知 vue 重新编译模板。

在 setup 函数中尝试定义一个 myRef 的自定义函数，该函数有一个参数为 value。这时可以从 vue 中先引入 customRef 方法，并在 myRef 自定义函数中返回 customRef 这个方法的内容，当然需要传入 track 以及 trigger 这两个参数以便在 customRef 这个函数中进行 return 对象返回中 get 与 set 方法里进行调用。在 get 方法中可以利用`track()`函数执行通知 vue 追踪 value 的变化，而在 set 操作时可以先定义一个 timer 变量，并且在 set 函数里通过定时器设置做延时反应，在指定时间以后才让响应值等于新值，并且利用`trigger()`函数执行去主动通知模板重新编译渲染。

在完成 myRef 函数定义以后，我们可以通过 myRef 进行自定义的响应式数据的定义与初始设置，然后通过 setup 函数的返回并在模板中进行调用即可，当前案例就是实现了自定义数据的防抖处理。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>customRef</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <input type="text" v-model="keyCode" />
      <h3>{{ keyCode }}</h3>
    </div>
    <script>
      const { createApp, customRef } = Vue;

      createApp({
        setup(props, context) {
          //自定义一个ref，名字叫做myRef
          function myRef(value) {
            // value是传入的初始值
            // customRef调用的时候需要里面传入一个函数，这个函数需要返回一个对象
            return customRef((track, trigger) => {
              let timer;
              return {
                // 读数据走get
                get() {
                  console.log('myRef这个容器中的数据被读取了:', value);
                  // 我们会发现数据被读取了两次，input初始化显示的输入的内容会读取一次，h3标签显示的时候也会读取一次
                  track(); // 通知vue追踪value的变化
                  return value;
                },
                // 改数据走set
                set(newValue) {
                  console.log(
                    'myRef这个容器中的数据被修改了,修改为了:',
                    newValue
                  );
                  // value是一个形参，也是函数作用域里面的一个变量
                  clearTimeout(timer);
                  timer = setTimeout(() => {
                    value = newValue;
                    trigger(); //通知vue去重新解析模板
                  }, 1000);
                },
              };
            });
          }
          let keyCode = myRef('hello'); // 程序员自定义的ref
          return {
            keyCode,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```
