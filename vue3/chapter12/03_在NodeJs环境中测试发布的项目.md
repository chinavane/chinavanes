# 03.在 NodeJs 环境中测试发布的项目

其实像 serve 这样的静态服务器是基于 NodeJs 环境进行二次封装而开发出来的，如果项目的后端本身是由 NodeJs 构建而不是利用 Java、Php、.Net、Python 等其它程序语言开发，那么这时候可能希望将前端项目在打包以后直接在 NodeJs 的后端环境中进行部署与运行，这时候可以对 NodeJs 的开发环境略作了解。

其实 NodeJs 中也可以使用很多的框架，比如最为熟悉的 Express，Koa、Hapi 等。我们可以利用 Express 框架将 Vue 发布的项目进行一个最为简单的集成操作。首先在任意磁盘位置创建一个目录 vue-node-express，在该目录下安装 express 模块，`npm install express --save`，并且创建 index.js 文件以及编写如下代码：

index.js

```js
const express = require('express'); // 引入express
const app = express(); // 实例化express

app.use(express.static('./dist')); // 利用express将项目的静态资源目录指向dist目录

// 启动服务，监听端口
app.listen(80, function () {
  console.log('Express server running at http://localhost');
});
```

然后可以将 Vue 在利用`npm run build`打包以后的 dist 目录迁移到 vue-node-express 这一项目的根目录下，然后利用命令`node index.js`将 NodeJs 的服务器服务内容进行启动，这时候只需要打开`http://localhost`地址就可以直接显示 Vue 的项目内容，当然这种模式是根级项目的启动模式，如果想实现以 dist 为名称的二级目录项目地址，只需要将 index.js 中的静态资源目录指向设置成`app.use(express.static('./'));`即可，那么在运行完`node index.js`以后则需要打开的地址形式为`http://localhost/dist`。
