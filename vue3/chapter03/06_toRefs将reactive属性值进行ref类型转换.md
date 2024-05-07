# 06.toRefs 将 reactive 属性值进行 ref 类型转换

通过 toRef 可以将 reactive 对象的属性值进行一个一个 ref 类型的转化，但假若 reactive 声明的对象有很多的属性值，并且都想将其属性值转化为 ref 数据类型，那么逐一转化的操作过程将会变得十分的繁琐，可以考虑利用 toRefs 进行 reactive 响应式对象的整体转化操作。toRefs 会将一个 reactive 响应式对象转换为一个普通对象，但这个普通对象的每个属性都是指向源对象相应属性的 ref，每个单独的 ref 都是使用 toRef() 创建的。这就意味着通过 toRefs 转化以后的 reactive 响应式对象本身是普通对象，但对象中的每个属性值却又都是 ref 响应式数据。

现在先从 vue 中引入 toRefs 函数，利用`const stateToRefs = toRefs(state)`将 state 转换成普通对象，但其所有下属属性则转化为 ref 的响应式数据，那么在 increase 函数中如果直接修改 state 的属性值，同样也将影响到 stateToRefs 对象的属性值。但因为 stateToRefs 已经转化为了普通对象，所以想利用`stateToRefs.count++`的方式进行数据修改并实现页面重新渲染是达不到预期效果的，只有通过 ref 响应式数据修改方式进行`stateToRefs.count.value++`利用 ref 的 value 进行递增处理界面中的数据才会发生响应式的更新。当然，这一切的前提都是将 stateToRefs 进行函数的返回操作后才能实现，而模板中的渲染内容都仍旧是 stateToRefs.count 以及 stateToRefs.update 对象属性的方式进行渲染显示。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>toRefs</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>stateToRefs.count:{{ stateToRefs.count }}</p>
      <p>stateToRefs.update:{{ stateToRefs.update }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, reactive, toRefs } = Vue;

      createApp({
        setup(props, context) {
          const state = reactive({
            count: 0,
            update: 0,
          });
          const stateToRefs = toRefs(state);
          const increase = () => {
            // 修改state.count值，将会触发stateToRefs.count的更新
            // state.count++
            // 修改stateToRefs.count值，并不会触发stateToRefs.count的更新
            // 因为stateToRefs的count属性已经变成了一个ref对象
            // stateToRefs.count++
            // 所以只有个性stateToRefs.count的value值，才会触发stateToRefs.count的更新
            // stateToRefs.count.value++
          };
          return {
            stateToRefs,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

或许有读者会考虑，如果页面中想要直接渲染 count 或 update，不想利用对象属性的方式进行显示，那是否可以将 state 这一 reactive 响应式数据对象进行展开处理？首先可以尝试直接将 state 进行对象展开模式的 return 函数返回操作，那么模板中渲染显示的内容则可以直接切换为 count 以及 update 值。但是 increase 方法中如果利用`state.count++`方式进行数值累加，界面并不会发生任何的变化，这是因为 state 这一 reactive 响应式数据对象在直接...state 展开以后对象的属性值都自动转变成了普通对象属性而不再是响应式数据，所以无法产生界面重绘目标。现在终于能够明确为什么需要使用 toRefs 将 state 对象中的属性转化成 ref 响应式数据类型了，现在只需要将 stateToRefs 转化以后的对象进行...stateToRefs 展开处理，并进行 return 返回，那么 count 与 update 这些对象属性值则都转化为了 ref 响应式数据。现在如果直接通过`state.count++`或者`stateToRefs.count.value++`的方式进行数据的修改，模板中的 count 与 update 则可以实现页面的动态重绘。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>toRefs</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <p>update:{{ update }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, reactive, toRefs, isReactive } = Vue;

      createApp({
        setup(props, context) {
          const state = reactive({
            count: 0,
            update: 0,
          });
          const stateToRefs = toRefs(state);
          console.log(isReactive(state), isReactive(stateToRefs));
          const increase = () => {
            // 修改state.count值，将会触发stateToRefs.count的更新
            state.count++;

            // 修改stateToRefs.count值，并不会触发stateToRefs.count的更新
            // 因为stateToRefs的count属性已经变成了一个ref对象
            // stateToRefs.count++

            // 所以只有个性stateToRefs.count的value值，才会触发stateToRefs.count的更新
            // stateToRefs.count.value++
          };
          return {
            ...state, // 直接解构state，state下所有属性不再是响应式数据
            // ...stateToRefs, // 可以将state下的属性转换成ref响应式数据
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

为了区别 state 与 statetoRefs 这两个对象，可以尝试从 vue 中引入 isReactive 函数，然后对 state 与 stateToRefs 这两个对象进行 isReactive 函数的调用输出打印，运行程序结果显示 state 是 reactive 数据类型，判断返回值为 true，而 stateToRefs 并不是 reactive 数据类型，判断返回值为 false。所以现在可以再次确认 toRefs 函数将 reactive 响应式数据对象进行转化以后，转化的整体对象是普通对象，只不过对象中的每个属性则是 ref 响应式数据类型而已。
