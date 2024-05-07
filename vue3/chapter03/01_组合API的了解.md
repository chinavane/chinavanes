# 01.组合 API 的了解

Vue 3 除了沿用传统的 Options API 选项 API 的代码模式还引入了 Composition API 也就是组合 API，它允许开发人员以更好的方式编写程序。使用此 API，开发人员可以将逻辑代码块组合在一起，从而有助于编写可读代码。

我们可以查看一下传统 Options API 选项 API 的代码书写方式 ，最主要暴露的一个问题就是操作同一内容目标的代码会被分散在不同的选项中，例如`data`、`methods`、`computed`、`watch`以及生命周期钩子函数等等。显然我们操作的都是 count 这一数据对象，但选项 API 的代码看起来十分的凌乱。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>组合API的了解-选项api</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <p>double:{{ double }}</p>
      <button @click="increase">increase</button>
    </div>
    <script>
      const { createApp } = Vue;
      createApp({
        // 响应式数据声明
        data() {
          return {
            count: 0,
          };
        },
        // 方法调用
        methods: {
          increase() {
            this.count++;
          },
        },
        // 计算属性
        computed: {
          double() {
            return this.count * 2;
          },
        },
        // 监控对象
        watch: {
          count(newVal, oldVal) {
            console.log(newVal, oldVal);
          },
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

使用 Composition API 组合 API 的时候，你可以将代码组织成更小的逻辑片段，并将它们组合在一起，甚至在后续需要重用它们时进行抽离。

现在利用组合 API 进行相同功能目标的代码书写，则可以看到操作 count 数据目标的所有功能代码都被集中到了一起，这更便于代码的编写、查看以及后续维护操作。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>组合API的了解-组合API</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>
  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <p>double:{{ double }}</p>
      <button @click="increase">increase</button>
    </div>
    <script>
      const { createApp, ref, computed, watch } = Vue;
      createApp({
        setup(props, context) {
          // 初始化ref响应式数据
          const count = ref(0);
          // 设置methods方法
          const increase = () => {
            count.value++;
          };
          // 设置计算属性
          const double = computed(() => count.value * 2);
          // 设置watch监听，监控count值变化
          watch(count, (newVal, oldVal) => {
            console.log(newVal, oldVal);
          });
          // 返回响应式数据以及方法与属性计算操作
          return {
            count,
            increase,
            double,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

使用组合 API 优点还很多，除了更灵活的代码组织更好的逻辑重用外还将提供更好的 TS 类型接口衔接，因为 Vue 3 是本身是用 Typescript 编写的，而且为了性能提升还可以实现 treeshaking 代码树摇目标，从而产生更小的生产包和更少的网络开销。
