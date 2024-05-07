# 11.computed、watch

在选项 API 中有 methods 方法调用、computed 计算属性、watch 对象监听的属性，其中都是对象类型，而其对象的键值对都可以是函数类型。那么在 vue3 中 methods、computed、watch 又应该如何实现呢？之前已经提及 methods 只需要在 setup 函数中定义方法并进行函数的 return 返回即可。比如在定义了一个 ref 响应式数据并初始为 0 的 count 变量以后，首先可以利用 isProxy 方法进行是否为代理数据的判断，不过 isProxy 对 ref 的响应式数据是无法判断的，因此将会返回 false 的结果值。然后再定义 person 这一 reactive 响应式数据，同样利用 isProxy 对其是否为代理数据的结果判断，可以确认返回的类型为 true。因为 isProxy 这一函数可以检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理。现在在 increase 函数中对`count.value++`以及`person.age++`，那么这个 increase 就是选项 API 中的 methods 方法了，在 return 返回 count、person、increase 方法以后就可以在模板中进行显示与方法调用处理。

methods 在 vue3 的 setup 函数中直接定义与返回就可以，那么 computed 计算属性呢？它需要从 vue 中先进行 computed 函数的引入，并在 setup 函数中进行计算的调用设置。我们可以定义一个 double 的变量，该变量的值是 computed 计算属性函数运行的结果值，而 computed 计算属性函数中的参数可以是函数类型，直接将`count.value*2`的计算结果进行 return 返回即可。事实上 computed 计算属性既可以是函数类型，也可以是对象类型，并且对象类型中可以进行 getter 取值与 setter 设值的区分操作，而如果像之前一样进行函数的设置，则默认实现的就是 getter 取值的操作。现在可以尝试设置一个计算属性结果值 triple，它的值就是利用 computed 进行计算的结果，并且 computed 的参数类型是对象，包括了 get 与 set 函数。get 中进行了 3 倍 count 值的获取计算`count.value*3`，而 set 里对 count 进行了设置值除 3 的计算操作。同样的，需要在 setup 的 return 中将 triple 进行返回，然后在模板部分进行对应的调用，我们除了将 triple 进行插值表达式的直接显示还设置了一个 input 输入框进行 triple 的 v-model 双向数据绑定操作，这样便于直接进行 triple 值的修改处理，以便触发 triple 这个 computed 计算属性中的 set 方法内容。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>methods、computed、watch</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <p>double:{{ double }}</p>
      <p>triple:{{ triple }}</p>
      <input v-model="triple" />
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, ref, reactive, isProxy, computed } = Vue;

      createApp({
        setup(props, context) {
          const count = ref(0);
          // isProxy不能判断ref响应式数据
          console.log(isProxy(count)); // false
          const person = reactive({
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          });
          // isProxy可以判断reactive、readonly、shallowReadonly、shallowReactive等代理的数据
          console.log(isProxy(person)); // true
          // methods方法
          const increase = () => {
            count.value++;
            person.age++;
          };
          // computed计算属性，函数形式，默认就是getter
          const double = computed(() => {
            return count.value * 2;
          });
          // computed计算属性，对象形式，可以设置getter、setter
          const triple = computed({
            get() {
              console.log('getter');
              return count.value * 3;
            },
            set(val) {
              console.log('setter');
              count.value = val / 3;
            },
          });
          return {
            count,
            double,
            triple,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```

与 computed 计算属性一样，watch 监听也同样需要引入并调用，并且 watch 可以实现对 ref、reactive 等响应式数据的监听，而且还可以实现单值、多值、深度对象监听与立即监听等多种监听方式，最关键的是监听以便通常直接进行后续功能的再处理，所以无需对监听进行 setup 的 return 内容返回操作。

我们不光可以直接对 ref 响应式数据进行监听，还可以对 computed 计算属性返回值进行监听，比如可以监听 double 这一计算属性值，而监听的结果可以通过回调函数进行后续处理，并且返回 newVal 新值与 oldVal 旧值两个监听对象。

对于 reactive 对象的监听需要注意不能直接监听其对象属性，需要利用函数对对象的属性进行返回，监听的是函数的返回值。为什么会产生这种情况呢？当给 person 的属性 age 重新赋值的时候，person.age 会从 Proxy 对象变为普通对象，那么直接 watch(person.age, cb)是捕捉不到的，因为 person.age 已经不是 reactive 的了，这个 watch 将失效。

watch 不光可以进行单个对象的监听还可以实现多个对象的监听，利用数组的形式就可以解决。比如监听`[double, () => person.age]`这两个对象内容，而监听对象返回的回调函数中的参数也同样使用数组方式，第一个参数将返回所有的新值列表，第二个参数将返回所有的旧值列表。

person 是我们定义的 reactive 响应式数据对象，如果直接对 person 进行监听，但目前我们修改的是 person 的属性值 age，那么将无法实现正常的监听，除非给监听添加 deep 参数，实现深度的对象监听，才能实现对对象属性修改实现监听的目标。除了 deep 深度监听，watch 监听是在响应式数据发生变化的时候才会触发，并不包含初始阶段。所以想要实现初始阶段的数据变化就需要添加 immediate 属性，这样可以实现对象的立即监听。

```vue
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>methods、computed、watch</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.2.40/vue.global.js"></script>
  </head>

  <body>
    <div id="app">
      <p>count:{{ count }}</p>
      <p>double:{{ double }}</p>
      <button @click="increase">increase</button>
    </div>

    <script>
      const { createApp, ref, reactive, isProxy, computed, watch } = Vue;

      createApp({
        setup(props, context) {
          const count = ref(0);
          const person = reactive({
            name: '张三',
            age: 18,
            address: {
              city: '北京',
            },
          });
          // methods方法
          const increase = () => {
            count.value++;
            person.age++;
          };
          // computed计算属性，函数形式，默认就是getter
          const double = computed(() => {
            return count.value * 2;
          });

          // watch监听，ref响应式数据监听
          watch(double, (newVal, oldVal) => {
            console.log(newVal, oldVal);
          });
          // 对于reactive的数据可以通过函数的方式进行监听
          watch(
            () => person.age,
            (newVal, oldVal) => {
              console.log(newVal, oldVal);
            }
          );
          // 可以对多值进行监听，利用数组方式
          watch(
            [double, () => person.age],
            ([newDouble, newAge], [oldDouble, oldAge]) => {
              console.log(newDouble, newAge, oldDouble, oldAge);
            }
          );
          // 利用watch监听对象，如果修改的是对象属性值，则需要使用深度监听才能实现，deep为true
          // immediate实现的是立即监听
          watch(
            () => person,
            (newVal, oldVal) => {
              console.log(newVal, oldVal);
            },
            {
              immediate: true,
              deep: true,
            }
          );
          return {
            count,
            double,
            increase,
          };
        },
      }).mount('#app');
    </script>
  </body>
</html>
```
