# 02.setup 组合 API 入口函数

vue3 既能使用选项 API 又能应用组合 API，那么代码方式应该如何区别呢？其实 vue3 给组合 API 提供了一个 setup 函数，该函数实现了组合 API 操作代码的入口。setup 函数拥有两个参数，第一个参数是 props 将接受组件的属性，第二个参数是 context 上下文对象，其中包括 attrs、emit、slot、expose 等对象属性，并且在 setup 函数中并不存在指向 vue 实例的 this 对象，这就意味着 vue3 组合 API 的数据操作无法像选项 API 那样利用 this.xxx 进行响应式数据的任何操作。

```vue
<script>
const { createApp } = Vue;

createApp({
  setup(props, context) {
    // this指向的是window而并不是当前vue实例
    console.log(this);
  },
}).mount('#app');
</script>
```

正是因为 setup 中没有指向 vue 实例的 this 指向，所以 vue3 的 setup 里组合 API 中的响应式数据定义方式将与选项 API 产生巨大的差异，不再使用 data 的方式进行响应式数据的定义操作，而是提出了 ref、reactive 等 vue3 特有的新的响应式数据声明方式，接下来我们就一个一个的进行详细了解。
