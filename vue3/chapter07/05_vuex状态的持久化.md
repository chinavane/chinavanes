# 05.vuex 状态的持久化

现在测试应用进行 count 值的递增、递减等操作以后再刷新页面会发现所有的状态值都变成了初始的数据，store 仓库中的 state 状态值没有实现保存的目标。state 既然是状态，当然会发生变化，但是状态值是否需要持久化的保持呢？答案当然是肯定的。在实际项目中如果用户将商品加入到购物车中，而购物车的数据信息保存到了 store 仓库的 state 状态值里，结果页面一刷新所有加入购物车的商品信息都丢失了，那将会是怎么样的一种场景？相信用户没有心情每次都将商品加入购物车，他们当然希望下次还能查看到之前加入的购物车商品信息，所以数据持久化操作对于 vuex 的 store 仓库来说也是一项重要的工作。不过我们也需要思考，是否所有的状态值都需要进行持久化处理，哪些数据需要持久化操作。这当然得看实际的业务场景与需求，几个基本原则可以参考：

- 并不是所有的 vuex 数据都需要持久化，可以针对指定的数据内容进行持久化操作；
- 对于更新频率不高的数据可以考虑持久化；
- 对于需要数据复现的数据需要考虑持久化；
- 对于需要实现离线功能性的数据需要考虑持久化；

那么，应该如何实现 vuex 仓库数据的持久化操作呢？这就需要利用 vuex 的 plugins 插件功能，因为 vuex 仓库数据的持久化功能在 vuex 中并没有存在，而第三方的插件比如 vuex-persistedstate、vuex-persist 等却实现了这些功能，所以可以将它们这些第三方进行进行安装并在 vuex 仓库中利用 plugins 插件功能进行集成。

首先可以打开 vuex-persistedstate 的项目地址https://www.npmjs.com/package/vuex-persistedstate，根据文档在当前项目中进行模块的安装操作：

```bash
npm install vuex-persistedstate --save
```

然后回到store仓库的主文件store/index.js 中引入该模块内容，并且只需要在 createStore 实例化 store 仓库的 时候设置plugins 属性，并进行插件应用即可，其它组件不需要进行任何的修改。

main.js

```js {3,134-135}
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// 引入counter模块
import counter from './modules/counter';
import users from './modules/users';

// 利用createStore创建唯一的store仓库实例
const store = createStore({
  // 模块拆分
  modules: {
    // counter模块
    counter,
    users,
  },
  // 调用持久化数据存储插件
  plugins: [createPersistedState()],
});

export default store;
```

现在测试应用对 count 进行递增、递减操作以后重新刷新页面，页面上将保留之前操作的状态值。那么利用 vuex-persistedstate 这个插件保存的 state 存储至哪里了呢？可以打开浏览器的 Application 调试面板，查看 Local Storage 本地存储，则可以看到有键名为 vuex 的状态值数据。当然浏览器本地存储的方式有很多，如果想要存储至 Cookie、Session Storage、IndexedDB、Web SQL 等其它的存储位置可以进行自由的控制，只是 vuex-persistedstate 插件在浏览器中默认存储位置是 Local Storage。

![image-20221119093736529](http://qn.chinavanes.com/qiniu_picGo/image-20221119093736529.png)

如果说我们并不想将所有的状态值都进行本地存储只是想将指定的模块或内容进行本地存储操作，那又需要如何处理呢？比如现在并不想存储 counter 模块中的所有状态值，只想将 users 模块中的状态值进行持久化存储，那么可以给 vuex-persistedstate 插件设置参数 paths，它是一个数组，可以将 users 这个模块路径进行设置，那么就只会持久化 users 模块的状态值，如果以后还有其它的模块想要持久化，也可以在数组中添加指定的路径，这说明 paths 相当于一个白名单的功能，只要符合设置路径的内容就会被持久化存储。

main.js

```js
// 调用持久化数据存储插件，设置只存储users模块状态值
plugins: [createPersistedState({ paths: ['users'] })],
```

现在即便对 counter 模块的 count 值进行递增、递减操作状态值也不会再持久化存储而只会存储 users 相关的内容了。

![image-20221119093810216](http://qn.chinavanes.com/qiniu_picGo/image-20221119093810216.png)
