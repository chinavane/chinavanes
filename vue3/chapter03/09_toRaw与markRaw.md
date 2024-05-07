# 09.toRaw 与 markRaw

我们可以利用 ref、reactive、toRef、toRefs、shallowRef、shallowReactive 等方式进行响应式数据的声明与转换操作，但是有什么方法可以将响应式数据转化返回其原始对象呢？toRaw 函数就可以根据一个 Vue 创建的代理返回其原始对象。

不过需要注意的是 toRaw 并不能对 ref 声明的响应式对象进行原始对象的转化返回操作。假若声明一个 state 变量，它是 ref 响应式数据类型，并且对象中包含 count 属性，初始值为 0。现在可以确认 state 是一个 ref 响应式数据，并且为对象类型。现在如果利用`toRaw(state)`将其进行原始数据对象的转化尝试，利用 console.log 打印转化以后的 rawState 变量，判断`isRef(rawState)`返回值则为 true，而判断`rawState === state`的返回值也是 true， 所以 toRaw 无法将 ref 对象转化成原始对象，rawState 与 state 是同一个对象，都是响应式数据。这样在 increase 函数中如果利用`rawState.value.count++`进行 count 值的递增处理，界面中的 count 将会产生响应式的改变。

现在尝试进行一个普通对象 personObj 的定义，然后利用 reactive 进行响应式对象的声明，并再次利用 toRaw 进行响应式数据原始对象转化的尝试并赋值为 rawPerson，那么通过 console.log 打印`isReactive(rawPerson)`将返回的是 false，并且判断`rawPerson === person`返回的值也是 false，说明 toRaw 可以将 reactive 对象转化成原始对象，并明确 rawPerson 与 person 不是同一个对象，所以 rawPerson 不再是响应式数据。那么在 increase 函数中尝试利用`rawPerson.age++`进行数据修改界面上并不会生任何的响应式改变渲染。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>toRaw与markRaw</title>
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
      const { createApp, ref, isRef, reactive, isReactive, toRaw, markRaw } =
        Vue;

      createApp({
        setup(props, context) {
          const state = ref({
            count: 0,
          });
          // toRaw无法将ref对象转化成原始对象
          rawState = toRaw(state);
          // 所以rawState与state是同一个对象，都是响应式数据
          console.log(isRef(rawState), rawState === state); // true true
          const personObj = {
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          };

          const person = reactive(personObj);
          // toRaw可以将reactive对象转化成原始对象
          const rawPerson = toRaw(person);
          // 所以rawPerson与person不是同一个对象，rawPerson不是响应式数据
          console.log(isReactive(rawPerson), rawPerson === person); // false false
          const increase = () => {
            // rawState与state是同一个响应式数据对象，因此可以响应式修改
            rawState.value.count++;
            // toRaw可以将reactive对象转化成原始对象，所以通过rawPerson修改age的值，不会实现响应式渲染
            // rawPerson.age++
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

toRaw 可以将 reactive 等响应式数据转化为非响应式原始对象，而 markRaw 则可以将一个对象标记为不可被转为代理，并返回该对象本身。也就是说利用 markRaw 标记的对象不管你是利用 ref 还是 reactive 尝试进行响应式数据的声明转换，最终都将无法实现响应式数据的修改更新。

假如我们利用 markRaw 标记了一个对象其属性值 count 初始为 0，并且尝试利用 ref 进行响应式数据声明，而初始对象就是 markRaw 所标记的 markRawCount 对象。虽然利用 console.log 打印出`isRef(state)`返回的值为 true，表明 state 现在已经是一个响应式数据，但是在 increase 函数中如果利用`state.value.count++`进行 count 递增操作，界面是无法实现响应式更新渲染的。

现在如果利用 markRaw 标记一个用户的原始对象，再利用 reactive 进行响应式数据的声明，尝试利用 reactive 将原始对象转成 reactive 响应式对象数据，现在使用 console.log 进行`isReactive(person)`的结果判断，发现返回的是 false，如果判断`person === markRawPerson`返回的结果则为 true，说明用 markRaw 标记的原始对象是无法利用 reactive 进行响应式数据声明的，那么 increase 函数中如果想对`person.age++`进行修改的话是完全不能界面的响应式更新渲染的。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>toRaw与markRaw</title>
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
      const { createApp, ref, isRef, reactive, isReactive, toRaw, markRaw } =
        Vue;

      createApp({
        setup(props, context) {
          // 标记markRawCount为原始对象
          const markRawCount = markRaw({
            count: 0,
          });

          // 利用ref将原始对象转成ref响应式对象数据
          const state = ref(markRawCount);
          // 判断state是否为ref响应式对象，返回true
          console.log(isRef(state), markRawCount); // true 原对象

          // 标记markRawPerson为原始对象
          const markRawPerson = markRaw({
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          });

          // 尝试利用reactive将原始对象转成reactive响应式对象数据
          const person = reactive(markRawPerson);
          // 判断person是否为reactive响应式对象，返回false，markRaw标记的对象不能转换为响应式对象
          console.log(isReactive(person), person === markRawPerson);

          const increase = () => {
            // 虽然state是ref响应式对象，但其中的对象是通过markRaw标记的原始对象，所以不会触发响应式
            state.value.count++;
            // person是尝试利用reactive将markRaw标记的对象转换为响应式对象，但是失败了，所以不会触发响应式
            // person.age++
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

不管是 toRaw 还是 markRaw 可以返回由 reactive、readonly、shallowReactive 或者 shallowReadonly 等方法创建的代理对应的原始对象，不适应于 ref 函数返回的代理目标。

那么，什么时候需要使用 toRaw 以及 markRaw 呢？主要分成了两种情况：

其一，如果对象中存有海量数据的列表，但它又只是用以显示不需要修改，那么可以考虑跳过代理转换，这样做的目标是提高性能。

其二，对象中包含复杂的第三方实例或者 Vue 组件对象。举个不恰当的例子，假如 person 对象中需要包含一个第三方的实例对象 axios，那么这将是一件非常可怕的事情。因为 axios 是一个第三方类库，它本身包含众多的属性与方法，如果利用 reactive 进行响应式数据声明，并且对象属性又包含 axios，那么响应式数据将作用于 axios 所有的嵌套子节点，这个问题在之前已经强调，因为 vue 的响应式默认是基于所有嵌套子节点的，并且一般利用的是递归算法。所以，axios 实例对象中的属性也将会受递归算法的影响，而由于 axios 的嵌套属性方法众多，性能将会受到极大影响。事实上，axios 这一第三方类库的对象完全可以不用响应式，所以 axios 最好是利用 toRaw 进行原始对象的返回操作更为可取`axios:toRaw(axios)`，或者也可以利用`markRaw(axios)`将其标记为一个不可变普通函数再进行响应式对象的声明。

```js
const person = reactive({
  name: '张三',
  age: 18,
  address: {
    city: '北京',
  },
  axios: axios,
});
```
