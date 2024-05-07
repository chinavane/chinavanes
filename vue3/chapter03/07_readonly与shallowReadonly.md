# 07.readonly 与 shallowReadonly

readonly 将接受一个普通对象 ，或者是 ref、reactive 声明的响应式数据对象为参数，但最终却返回一个原值的只读代理，也就是说利用 readonly 函数调用过的对象是只读的无法修改的，而且 readonly 还将作用于对象的所有嵌套属性，这就意味着它是深层级的转换操作。

我们首先可以先利用 ref 声明一个简单数据类型的 count 响应式数据，还可以利用 ref 声明一个对象类型的 state 响应式数据，因为之前章节中就已经强调 ref 其实可以声明引用数据类型为响应式数据的。接下来再利用 reactive 声明一个对象类型的 person 响应式数据，并且在从 vue 引入 readonly 以及 isReadonly 等函数以后就可以利用 readonly 函数将 count、state 与 person 进行只读数据的转化处理，得到 ROCount、ROState 与 ROPerson 三个转化后的只读数据对象。如果想要确认这三个转化后的数据是否为只读可以通过 isReadonly 函数进行判断，通过 console.log 打印`isReadonly(ROCount)`等内容得到的结果是三个转化后的数据都为 true，也就是都为只读数据。所以在 increase 函数中想要对`ROCount.value++`简单数据类型进行直接修改或者尝试对象嵌套属性值的修改`ROState.value.update++`、` ROPerson.address.city = '上海'`控制台都会报以警告错误。或许有读者考虑对对象或者对象属性值不进行单独修改而尝试进行整体重新赋值操作，最终会发现仍旧没有任何效果，控制台仍旧报警告错误，毕竟 readonly 实现的是深层只读属性的转化操作。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用readonly限制响应式数据只读</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>ROCount:{{ ROCount }}</p>
      <p>ROState.update:{{ ROState.update }}</p>
      <p>ROPerson.address.city:{{ ROPerson.address.city }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, ref, readonly, reactive, isReadonly } = Vue;

      createApp({
        setup(props, context) {
          const count = ref(0);
          const state = ref({
            update: 0,
          });
          const person = reactive({
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          });
          // 将count、state、person转换为只读的响应式数据
          // count为ref简单数据类型
          // state为ref对象数据类型
          // person为reactive对象数据类型
          const ROCount = readonly(count);
          const ROState = readonly(state);
          const ROPerson = readonly(person);
          console.log(
            isReadonly(ROCount),
            isReadonly(ROState),
            isReadonly(ROPerson)
          ); // 三个返回值均为true
          const increase = () => {
            // 因为三个数据均为只读，所以无法修改，控制台将报警告错误
            ROCount.value++;
            // 因为readonly将限定对象所有子节点属性都为只读，所以对子节点属性进行整体赋值或者部分修改控制台都会报警告错误
            // ROState.value = {
            //     update: 2
            // }
            ROState.value.update++;
            // ROPerson.address = {
            //     city: '上海'
            // }
            ROPerson.address.city = '上海';
          };
          return {
            ROCount,
            ROState,
            ROPerson,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

如果我们并不想对对象进行深层只读的转化，其实可以考虑使用 shallowReadonly 进行浅层对象的只读转化。shallowReadonly 的操作方式与 readonly 一样，但它只实现浅层只读转化，只对对象的第一层属性进行只读转化，不会对对象的子节点属性进行只读转化，这就意味着对象嵌套的子属性是不被转化为 readonly 只读模式的。现在可以将原来的 readonly 函数都替换成 shallowReadonly，对 count、state 与 person 进行只读转化，利用 isReadonly 判断 ROCount、ROState 与 ROPerson 返回的都是 true，也就是顶层对象转化成功。但对 ROState.value.update 与 ROPerson.address.city 进行 isReadonly 判断返回的都是 false，说明嵌套属性并没有转化成只读模式。假若尝试对 ROState.value 与 ROPerson.address 这两个根级属性数据进行整体赋值，因为是只读，所以控制台报警告错误。但如果进行`ROState.value.update++`与`ROPerson.address.city = '上海'`对象嵌套属性的单独修改则可以成功触发界面的响应式数据修改结果显示。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>利用shallowReadonly限制响应式数据只读</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>ROCount:{{ ROCount }}</p>
      <p>ROState.update:{{ ROState.update }}</p>
      <p>ROPerson.address.city:{{ ROPerson.address.city }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, ref, shallowReadonly, reactive, isReadonly } = Vue;

      createApp({
        setup(props, context) {
          const count = ref(0);
          const state = ref({
            update: 0,
          });
          const person = reactive({
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          });
          // shallowReadonly实现浅层只读转化，只对对象的第一层属性进行只读转化，不会对对象的子节点属性进行只读转化
          const ROCount = shallowReadonly(count);
          const ROState = shallowReadonly(state);
          const ROPerson = shallowReadonly(person);
          console.log(
            isReadonly(ROCount),
            isReadonly(ROState),
            isReadonly(ROPerson)
          ); // 返回都是true
          console.log(
            isReadonly(ROState.value.update),
            isReadonly(ROPerson.address.city)
          ); // 返回都是false

          const increase = () => {
            ROCount.value++;
            // 对根级属性数据进行整体赋值，因为是只读，所以控制台报警告错误
            // ROState.value = {
            //     update: 2
            // }
            ROState.value.update++; // 可以对嵌套属性进行修改，因为是浅只读
            // 对根级属性数据进行整体赋值，因为是只读，所以控制台报警告错误
            // ROPerson.address = {
            //     city: '上海'
            // }
            ROPerson.address.city = '上海'; // 可以对嵌套属性进行修改，因为是浅只读
          };
          return {
            ROCount,
            ROState,
            ROPerson,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

或许有读者会有疑问，为什么不直接进行普通对象的声明而需要利用 readonly 与 shallowReadonly 进行只读对象的转化操作？其实定义一个普通对象，最终是可以修改其属性值的，只不过并不会响应式的触发模板的重新渲染显示而已。但 readonly 与 shallowReadonly 转化的只读对象不同，它是不允许对其对象进行任何的数据修改操作。

```js
// 普通对象其实可以修改属性值，只是不会实现响应式数据渲染而已
const person = {
  name: '张三',
  age: 18,
  address: {
    city: '北京',
  },
};
```

那么 readonly 与 shallowReadonly 只读对象转化操作的应用场景应该在哪里呢？试想一下如果项目开发过程中有团队其他成员开发了一些功能组件，它们允许其他开发者进行对应组件的使用，但使用的功能需要进行一定的约束，其他组件的使用人员只能使用其数据并不能够修改其数据，那么组件使用者在对其数据定义的时候可以利用 readonly 与 shallowReadonly 进行只读数据的转化操作，这样可以保证程序的高度可读性也可以保证数据的安全性。
