# 08.shallowRef 与 shallowReactive

在介绍 shallowReadonly 函数时已经看到 shallow 这一单词，明确了它的意思是“浅的”意思，就像是 shallowReadonly 中实现对象的浅层只读转化，那么对于 ref 与 reactive 响应式数据是否也能够实现浅层声明呢？其实 vue3 同样提供了 shallowRef 与 shallowReactive 进行浅层对象响应式数据的声明方式。

shallowRef 是 ref 的浅层实现，也就是利用 shallowRef 声明的响应式对象其对象的整体是响应式数据类型，但这一响应式对象的嵌套子属性都不再是响应式对象。我们从 vue 中引入 shallowRef 函数以后将之前利用 ref 声明的 state 直接改写成 shallowRef 进行声明，然后利用 isRef 对 state 以及 state.value.count 进行判断输出，返回的值应该是 true 与 false，因为整体对象仍旧是 ref 响应式，但对象的 count 属性不再是 ref 响应式，能够确认实现的是浅层对象的响应式声明。既然实现浅层 ref 响应式数据的声明，那么如果在 increase 中尝试`state.value.count++`想对对象属性直接修改数据，这时会发现无法实现响应式界面渲染更新。如果想要实现修改响应式数据并重绘界面，那么可以考虑给 state.value 值进行整个对象的重新赋值操作，比如`state.value = {count: state.value.count + 1}`。如果既想直接对 ref 对象属性值进行修改，又想实现界面的重新渲染，则可以考虑从 vue 中引入 triggerRef，这一函数可以在进行 ref 对象属性值修改以后触发浅层 ref 的副作用，从而实现界面的重绘目标。

如果理解了 shallowRef 浅层 ref 响应式数据的声明，那么对于 shallowReactive 的理解也就水到渠成了。因为从操作与结果上来看，它们两者非常的相似。从 vue 中引入 shallowReactive 以后同样可以将之前 reactive 声明的 person 对象利用 shallowReactive 来替换，并且通过 isReactive 来判断 person 与 person.address 这两个数据结果，则可以明确前者是 reactive 响应式数据，而 person.address 却不再是 reactive 响应式数据。这就意味着如 shallowRef 一样，直接对 person 对象 adress 属性中的 city 属性节点进行值的修改操作`person.address.city = '上海'`并不会触发界面的重新渲染，同样的需要利用整体赋值的方式`person.address = {city: '上海'}`才能实现界面的响应式渲染重绘操作。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>shallowRef与shallowReactive</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>state.count:{{ state.count }}</p>
      <p>person.age:{{ person.age }}</p>
      <p>person.address.city:{{ person.address.city }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const {
        createApp,
        shallowRef,
        triggerRef,
        isRef,
        isReactive,
        shallowReactive,
      } = Vue;

      createApp({
        setup(props, context) {
          const state = shallowRef({
            count: 0,
          });

          console.log(isRef(state), isRef(state.value.count));
          // true false
          // 整体对象是ref，但对象的count属性不再是ref

          const person = shallowReactive({
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          });
          console.log(isReactive(person), isReactive(person.address));
          // true false
          // 整体对象是reactive，但对象的address属性不再是reactive

          const increase = () => {
            // 第一种情况：
            // state.value.count++ // 对象属性直接修改数据无法实现响应式界面渲染更新
            // person.address.city = '上海' // 对象嵌套子属性修改数据无法实现响应式界面渲染更新
            // 第二种情况：
            // person.age++; // 对象根级属性修改数据将会实现响应式界面渲染更新
            // 第三种情况：
            // 需要对state.value整体进行重新赋值才能实现响应式界面渲染更新
            // state.value = {
            //     count: state.value.count + 1
            // }
            // 需要对person.address整体进行重新赋值才能实现响应式界面渲染更新
            // person.address = {
            //     city: '上海'
            // }
            // 第四种情况：
            // state.value.count++ // 对象属性直接修改数据无法实现响应式界面渲染更新
            // triggerRef(state) // 利用triggerRef函数手动触发响应式界面渲染更新
          };
          return {
            state,
            person,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

shallowRef 与 shallowReactive 主要在什么样的场景下进行使用呢？因为 vue 的响应式默认都是深度的，对于对象来说如果存在嵌套则需要应用到递归等比较影响性能的算法，特别是数据量巨大时，因为响应式数据每个属性访问都将触发代理的依赖追踪，深度响应式中的递归等算法处理会导致性能的快速下降。所以 vue 为此提供了一种解决方案，通过使用 shallowRef 与 shallowReactive 来绕开深度响应。浅层式 API 创建的状态只在其顶层是响应式的，对所有深层的对象不会做任何处理，这使得对深层级属性的访问变得更快。但任何事物都有双面性，高性能付出的代价是必须将所有深层级对象视为不可变的，只能通过替换整个根状态来触发更新。
