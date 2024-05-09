const fs = require("fs");
const path = require("path");

// 假设这是您的Markdown文件内容，实际上应从文件读取
const markdownContent = `
## performance
- 01.前端性能优化-文件优化-01
- 02.前端性能优化-文件优化-02
- 03.前端性能优化-请求优化-01
- 04.前端性能优化-请求优化-02
- 05.前端性能优化-请求优化-03
- 06.前端性能优化-请求优化-04
- 07.前端性能优化-请求优化-05
- 08.前端性能优化-请求优化-06
- 09.前端性能优化-请求优化-07
- 10.前端性能优化-请求优化-08
- 11.前端性能优化-请求优化-09
- 12.前端性能优化-请求优化-10


## project-interview

- 01.你所擅长的框架是什么
- 02.在应用框架时，你结合过哪些插件或类库来增强应用性能和用户体验
- 03.你在项目开发的时候遇到过Bug吗？
- 04.你对vue、react中的路由参数是如何理解的？
- 05.vue、react中的路由参数有何差异？
- 06.你对于gzip是否有所了解
- 07.详细介绍一下node中动态数据内容的压缩应用
- 08.indexedDb
- 09.web-vitals
- 10.为什么使用双token实现无感刷新用户认证
- 11.双token实现无感刷新用户认证流程梳理
- 12.双token配合请求retry实现无感刷新认证应用实现
- 13.基于位的权限系统
- 14.抽离前端项目模块，让项目起飞
- 15.利用闭包与高阶函数实现缓存函数的创建
- 16.缓存函数在项目中的性能优化
- 17.REST API规范命名
- 18.API优先原则的理解
- 19.前端开发如何配合API优先原则
- 20.什么是CDN

## react-interview

- 01.利用ts进行react项目的属性校验
- 02.回顾 js 模式下 prop-types 进行属性的约束
- 03.清晰的组件类型注解
- 04.对 Children 类型注解
- 05.对 State 状态的约束的准备
- 06.State 状态与类型推断
- 07.State 中联合类型应用
- 08.React行内事件触发
- 09.独立事件的类型限定
- 10.其它事件
- 11.TS与类组件
- 12.Refs的类型
- 13.更多Refs相关
- 14.react-redux的ts结合项目预览
- 15.项目创建
- 16.redux设计模式
- 17.reducer的设置
- 18.返回类型的注解
- 19.action动作类型
- 20.给Action动作拆分Interface接口类型
- 21.应用action接口
- 22.给Action添加枚举类型
- 23.更好的目录与代码结构
- 24.添加Action Creators层
- 25.添加请求逻辑
- 26.给dispatch设置类型
- 27.设置exports模块暴露
- 28.连接React
- 29.初始state
- 30.事件类型
- 31.调用Action Creator
- 32.绑定Action Creator
- 33.选择状态
- 34.React-Redux 中尴尬的类型
- 35.创建类型选择
- 36.显示仓库状态
- 37.模块总结
- 38.react-hooks-useState
- 39.react-hooks-useEffect-1
- 40.react-hooks-useEffect-2
- 41.react-hooks-useEffect-3
- 42.react-hooks-useLayoutEffect
- 43.React异步更新机制-状态的展现
- 44.React异步更新机制-回调函数应用
- 45.React异步更新机制-useEffect监听变化
- 46.React异步更新机制-利用useRef进行状态快照保存
- 47.React异步更新机制-利用useRef进行快照保存实例解析
- 48.利用拖拽实现列表重新排序
- 49.如何利用useRef进行性能的优化
- 50.如何利用IntersectionObserver进行图片懒载载性能优化
- 51.利用IntersectionObserver实现无限滚动
- 52.利用hooks封装IntersectionObserver实现React中的无限滚动
- 53.darkmode的切换应用
- 54.i18n实现多国语言切换处理-01
- 55.i18n实现多国语言切换处理-02
- 56.利用react的hook实现复制粘贴操作
- 57.react-errorboundary
- 58.React-2024-Roadmap

## typescript-interview

- 01.javascript开发者是否需要学习typescript
- 02.typescript中interface与type之间的差异
- 03.type类型在实际项目中的应用技巧
- 04.ts中any、unknown、never数据类型的差异
- 05.typescript中pick类型的理解与实际应用
- 06.typescript中omit类型的理解与实际应用
- 07.typescript中partial类型的理解与实际应用
- 08.typescript中required类型的理解与实际应用
- 09.typescript中record类型的理解与实际应用
- 10.typescript中parameters类型的理解与实际应用
- 11.typescript中returnType类型的理解与实际应用
- 12.typescript中InstanceType类型的理解与实际应用
- 13.typescript中as const在对象类型中的应用
- 14.深入理解Axios的TypeScript类型约束-01
- 15.深入理解Axios的TypeScript类型约束-02

## vue-interview

- 01.vue3+ts的项目如何实现ts有效性的强制检测
- 02.vue3 项目中如何实现模块的自动导入
- 03.vue3 项目中如何实现组件的自动导入
- 04.vue3项目中如何实现图片的压缩
- 05.vue3项目中如何实现图片的二次处理
- 06.compositionApi与optionsApi有什么区别
- 07.给vite创建的vute项目进行eslint语法检测的配置
- 08.如何理解Vue当中computed的缓存机制
- 09.vue中如何设置与使用全局属性
- 10.vue3中如何获取子组件并调用其数据和方法
- 11.vue3中是否还能使用children获取到子组件
- 12.进一步理解vue3中的subTree
- 13.深度理解vue3的subTree
- 14.问号与感叹号的使用方法
- 15.vue3中如何获取到父组件
- 16.vue3中通过root获取到根级组件
- 17.vite创建的vue3项目如何设置不同开发环境的变量
- 18.vue3.3.4发布，新增泛型组件功能
- 19.vue3.3.4发布，新增defineModel功能
- 20.vue3.3.4发布，新增属性解构功能
- 21.vue3.3.4发布，新增属性defineSlots功能
- 22.Vue项目中如何使用IconFont组件库
- 23.methods、watch、computed之间的差异区别
- 24.你对于pinia的理解
- 25.你对vue中的keep-alive的理解
- 26.vue-error-handle
- 27.vue3当中如何利用拖拽实现列表重新排序操作
- 28.Vue项目中如何使用IconFont组件库
- 29.快速理解vuex核心-1
- 30.快速理解vuex核心-2
- 32.useVirtualList虚拟滚动实现
- 33.useInfiniteScroll无限滚动功能实现

## web-worker-interview

- 01.Web Worker的快速理解与简单应用
- 02.Shared Worker的快速理解与简单应用
- 03.客户端读取并显示XLXS文件
- 04.本地读取Excel文件并进行数据压缩传递到服务器
- 05.对读取的Excel文件数据进行拆分并发请求发送到后端服务器
- 06.利用Web worker对读取Excel进行拆分并发请求进行性能优化
`;

// 解析Markdown内容
const lines = markdownContent.split("\n");
let currentModule = null;

lines.forEach((line) => {
  line = line.trim();

  if (line.startsWith("##")) {
    // 新模块开始
    currentModule = line.replace(/^##\s*/, "").trim();
    fs.mkdirSync(path.join(__dirname, currentModule), { recursive: true });
  } else if (line.startsWith("- ")) {
    // 课程条目
    // 直接提取编号和标题，去除列表标记和前导空格，然后添加.md扩展名
    const fullTitleWithNumber = line.replace(/^\s*-\s*/, "").trim();
    const fileName = `${fullTitleWithNumber}.md`;
    const filePath = path.join(__dirname, currentModule, fileName);

    // 写入Markdown文件内容
    const [number, title] = fullTitleWithNumber.split(".");
    const content = `---
title: ${title.trim()}
aside: false
---

# ${fullTitleWithNumber.trim()}

<video autoplay src="http://qn.chinavanes.com/interview/${currentModule}/${fullTitleWithNumber}.mp4" controls controlsList="nodownload" width="50%"/>

`;
    fs.writeFileSync(filePath, content, "utf8");
  }
});

console.log("所有文件和目录已成功创建！");
