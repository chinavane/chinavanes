export default [
  {
    text: "Vue3全系列教程",
    items: [
      {
        base: "/vue3/chapter01/",
        text: "第1章 Vue概述",
        collapsed: true,
        items: [
          {
            text: "六何思维分析Vue",
            link: "01_六何思维分析Vue",
          },
          {
            text: "Vue3的新特性",
            link: "02_Vue3的新特性",
          },
          {
            text: "Vue3的运行环境",
            link: "03_Vue3的运行环境",
          },
        ],
      },
      {
        text: "第2章 核心语法",
        base: "/vue3/chapter02/",
        collapsed: true,
        items: [],
      },
      {
        text: "第3章 Vue3新语法",
        base: "/vue3/chapter03/",
        collapsed: true,
        items: [
          {
            text: "01_组合API的了解",
            link: "01_组合API的了解",
          },
          {
            text: "02_setup组合API入口函数",
            link: "02_setup组合API入口函数",
          },
          {
            text: "03_利用ref声明响应式数据",
            link: "03_利用ref声明响应式数据",
          },
          {
            text: "04_利用reactive声明响应式数据",
            link: "04_利用reactive声明响应式数据",
          },
          {
            text: "05_toRef将reactive属性值进行ref类型转换",
            link: "05_toRef将reactive属性值进行ref类型转换",
          },
          {
            text: "06_toRefs将reactive属性值进行ref类型转换",
            link: "06_toRefs将reactive属性值进行ref类型转换",
          },
          {
            text: "07_readonly与shallowReadonly",
            link: "07_readonly与shallowReadonly",
          },
          {
            text: "08_shallowRef与shallowReactive",
            link: "08_shallowRef与shallowReactive",
          },
          {
            text: "09_toRaw与markRaw",
            link: "09_toRaw与markRaw",
          },
          {
            text: "10_customRef",
            link: "10_customRef",
          },
          {
            text: "11_computed、watch",
            link: "11_computed、watch",
          },
          {
            text: "12_生命周期钩子函数",
            link: "12_生命周期钩子函数",
          },
          {
            text: "13_总结",
            link: "13_总结",
          },
        ],
      },
      {
        text: "第4章 组件详解",
        base: "/vue3/chapter04/",
        collapsed: true,
        items: [
          {
            text: "01_脚手架项目的分析",
            link: "01_脚手架项目的分析",
          },
          {
            text: "02_eslint与prettier",
            link: "02_eslint与prettier",
          },
          {
            text: "03_组件样式控制",
            link: "03_组件样式控制",
          },
          {
            text: "04_组件通讯之props",
            link: "04_组件通讯之props",
          },
          {
            text: "05_组件通讯之ref与defineExpose",
            link: "05_组件通讯之ref与defineExpose",
          },
          {
            text: "06_组件通讯之emits",
            link: "06_组件通讯之emits",
          },
          {
            text: "07_组件通讯之attrs",
            link: "07_组件通讯之attrs",
          },
          {
            text: "08_组件通讯之provide与inject",
            link: "08_组件通讯之provide与inject",
          },
          {
            text: "09_组件通讯之mitt",
            link: "09_组件通讯之mitt",
          },
          {
            text: "10-组件通讯之slot",
            link: "10-组件通讯之slot",
          },
          {
            text: "11-内置组件之Component",
            link: "11-内置组件之Component",
          },
          {
            text: "12-内置组件之KeepAlive",
            link: "12-内置组件之KeepAlive",
          },
          {
            text: "13-内置组件之Teleport",
            link: "13-内置组件之Teleport",
          },
          {
            text: "14-内置组件之Suspense",
            link: "14-内置组件之Suspense",
          },
          {
            text: "15_代码封装之directive指令",
            link: "15_代码封装之directive指令",
          },
          {
            text: "16_代码封装之mixin混入",
            link: "16_代码封装之mixin混入",
          },
          {
            text: "17_代码封装之hook钩子",
            link: "17_代码封装之hook钩子",
          },
          {
            text: "18_代码封装之plugin插件",
            link: "18_代码封装之plugin插件",
          },
        ],
      },
      {
        text: "第5章 Vue路由",
        base: "/vue3/chapter05/",
        collapsed: true,
        items: [
          {
            text: "01_路由的概念",
            link: "01_路由的概念",
          },
          {
            text: "02_动态组件加载",
            link: "02_动态组件加载",
          },
          {
            text: "03_配置简单路由",
            link: "03_配置简单路由",
          },
          {
            text: "04_链接高亮显示",
            link: "04_链接高亮显示",
          },
          {
            text: "05_嵌套路由实现",
            link: "05_嵌套路由实现",
          },
          {
            text: "06_动态路由传参",
            link: "06_动态路由传参",
          },
          {
            text: "07_路由参数映射",
            link: "07_路由参数映射",
          },
          {
            text: "08_命名路由切换",
            link: "08_命名路由切换",
          },
          {
            text: "09_命名视图渲染",
            link: "09_命名视图渲染",
          },
          {
            text: "10_编程路由导航",
            link: "10_编程路由导航",
          },
          {
            text: "11_路由过滤筛选",
            link: "11_路由过滤筛选",
          },
          {
            text: "12_路由过渡动效",
            link: "12_路由过渡动效",
          },
          {
            text: "13_路由滚动行为",
            link: "13_路由滚动行为",
          },
          {
            text: "14_路由的懒加载",
            link: "14_路由的懒加载",
          },
          {
            text: "15_缓存性能提升",
            link: "15_缓存性能提升",
          },
          {
            text: "16_路由守卫功能",
            link: "16_路由守卫功能",
          },
          {
            text: "17_动态路由处理",
            link: "17_动态路由处理",
          },
        ],
      },
      {
        text: "第6章 数据请求",
        base: "/vue3/chapter06/",
        collapsed: true,
        items: [
          {
            text: "01_数据请求的概念",
            link: "01_数据请求的概念",
          },
          {
            text: "02_api与rest-api的理解",
            link: "02_api与rest-api的理解",
          },
          {
            text: "03_模拟数据的需求",
            link: "03_模拟数据的需求",
          },
          {
            text: "04_在线模拟数据与接口调试工具",
            link: "04_在线模拟数据与接口调试工具",
          },
          {
            text: "05_ajax请求在线模拟数据",
            link: "05_ajax请求在线模拟数据",
          },
          {
            text: "06_自定义服务器与fetch请求跨域问题解决",
            link: "06_自定义服务器与fetch请求跨域问题解决",
          },
          {
            text: "07_json-server模拟数据和axios第三方类库安装应用",
            link: "07_json-server模拟数据和axios第三方类库安装应用",
          },
          {
            text: "08_构建fetch请求的包装方法",
            link: "08_构建fetch请求的包装方法",
          },
          {
            text: "09_全局挂载与局部引入调用",
            link: "09_全局挂载与局部引入调用",
          },
          {
            text: "10_将fetch方法改造成axios方法",
            link: "10_将fetch方法改造成axios方法",
          },
          {
            text: "11_axios的instance实例应用",
            link: "11_axios的instance实例应用",
          },
          {
            text: "12_axios拦截器应用",
            link: "12_axios拦截器应用",
          },
          {
            text: "13_请求二次封装的主要内容",
            link: "13_请求二次封装的主要内容",
          },
          {
            text: "14_项目接口的统一管理",
            link: "14_项目接口的统一管理",
          },
          {
            text: "15_结合路由模块实现用户接口的调用",
            link: "15_结合路由模块实现用户接口的调用",
          },
        ],
      },
      {
        text: "第7章 状态管理",
        base: "/vue3/chapter07/",
        collapsed: true,
        items: [
          {
            text: "01_常规组件通讯的弊端",
            link: "01_常规组件通讯的弊端",
          },
          {
            text: "02_vuex状态管理器的概念",
            link: "02_vuex状态管理器的概念",
          },
          {
            text: "03_vuex安装与基础功能应用",
            link: "03_vuex安装与基础功能应用",
          },
          {
            text: "04_vuex的模块化开发",
            link: "04_vuex的模块化开发",
          },
          {
            text: "05_vuex状态的持久化",
            link: "05_vuex状态的持久化",
          },
          {
            text: "06_vuex的状态值的v-model双向数据绑定",
            link: "06_vuex的状态值的v-model双向数据绑定",
          },
          {
            text: "07_pinia状态管理器的概念",
            link: "07_pinia状态管理器的概念",
          },
          {
            text: "08_pinia安装与基本应用",
            link: "08_pinia安装与基本应用",
          },
          {
            text: "09_pinia多仓库应用",
            link: "09_pinia多仓库应用",
          },
          {
            text: "10_pinia插件应用与v-model双向数据绑定",
            link: "10_pinia插件应用与v-model双向数据绑定",
          },
        ],
      },
      {
        text: "第8章 UI框架",
        base: "/vue3/chapter08/",
        collapsed: true,
        items: [
          {
            text: "01_功能性框架与UI框架的结合",
            link: "01_功能性框架与UI框架的结合",
          },
          {
            text: "02_UI框架分类与常用组件",
            link: "02_UI框架分类与常用组件",
          },
          {
            text: "03_前台样式类UI框架BalmUI",
            link: "03_前台样式类UI框架BalmUI",
          },
          {
            text: "04_中后台类UI框架element-plus",
            link: "04_中后台类UI框架element-plus",
          },
          {
            text: "05_移动端类UI框架Vant3",
            link: "05_移动端类UI框架Vant3",
          },
        ],
      },
      {
        text: "第9章 TypeScript",
        base: "/vue3/chapter09/",
        collapsed: true,
        items: [
          {
            text: "01_六何分析理解TypeScript",
            link: "01_六何分析理解TypeScript",
          },
          {
            text: "02_安装TypeScript环境",
            link: "02_安装TypeScript环境",
          },
          {
            text: "03_一切从HelloWorld开始",
            link: "03_一切从HelloWorld开始",
          },
          {
            text: "04_TypeScript的数据类型",
            link: "04_TypeScript的数据类型",
          },
          {
            text: "05_原始数据类型",
            link: "05_原始数据类型",
          },
          {
            text: "06_其它几个基础类型",
            link: "06_其它几个基础类型",
          },
          {
            text: "07_类型推断",
            link: "07_类型推断",
          },
          {
            text: "08_联合类型",
            link: "08_联合类型",
          },
          {
            text: "09_Array数组类型",
            link: "09_Array数组类型",
          },
          {
            text: "10_Tuple元组类型",
            link: "10_Tuple元组类型",
          },
          {
            text: "11_Enum枚举类型",
            link: "11_Enum枚举类型",
          },
          {
            text: "12_Object对象类型",
            link: "12_Object对象类型",
          },
          {
            text: "13_Function函数类型",
            link: "13_Function函数类型",
          },
          {
            text: "14_Assertion类型断言",
            link: "14_Assertion类型断言",
          },
          {
            text: "15_Aliases类型别名",
            link: "15_Aliases类型别名",
          },
          {
            text: "16_字面量类型",
            link: "16_字面量类型",
          },
          {
            text: "17_Class类",
            link: "17_Class类",
          },
          {
            text: "18_Class类与Interface接口",
            link: "18_Class类与Interface接口",
          },
          {
            text: "19_Generic泛型",
            link: "19_Generic泛型",
          },
          {
            text: "20_声明合并",
            link: "20_声明合并",
          },
          {
            text: "21_声明文件",
            link: "21_声明文件",
          },
          {
            text: "22_内置对象",
            link: "22_内置对象",
          },
        ],
      },
      {
        text: "第10章 Vue3与TypeScript",
        base: "/vue3/chapter10/",
        collapsed: true,
        items: [
          {
            text: "01_创建支持TypeScript的Vue项目",
            link: "01_创建支持TypeScript的Vue项目",
          },
          {
            text: "02_非响应数据的TypeScript支撑",
            link: "02_非响应数据的TypeScript支撑",
          },
          {
            text: "03_ref响应数据的TypeScript支撑",
            link: "03_ref响应数据的TypeScript支撑",
          },
          {
            text: "04_reactive响应数据的TypeScript支撑",
            link: "04_reactive响应数据的TypeScript支撑",
          },
          {
            text: "05_Refs对象类型的TypeScript支撑",
            link: "05_Refs对象类型的TypeScript支撑",
          },
          {
            text: "06_computed属性计算、methods方法调用与watch监控中的TypeScript支撑",
            link: "06_computed属性计算、methods方法调用与watch监控中的TypeScript支撑",
          },
          {
            text: "07_props和emits的TypeScript支撑",
            link: "07_props和emits的TypeScript支撑",
          },
          {
            text: "08_provide和inject的TypeScript支撑",
            link: "08_provide和inject的TypeScript支撑",
          },
          {
            text: "09_vue-router路由的TypeScript支撑",
            link: "09_vue-router路由的TypeScript支撑",
          },
          {
            text: "09_vue-router路由的TypeScript支撑",
            link: "09_vue-router路由的TypeScript支撑",
          },
          {
            text: "11_vuex状态管理的TypeScript支撑",
            link: "11_vuex状态管理的TypeScript支撑",
          },
          {
            text: "12_pinia状态管理的TypeScript支撑",
            link: "12_pinia状态管理的TypeScript支撑",
          },
        ],
      },
      {
        text: "第11章 电商项目",
        base: "/vue3/chapter11/",
        collapsed: true,
        items: [
          {
            text: "01_项目入手与规划",
            link: "01_项目入手与规划",
          },
          {
            text: "02_路由是项目开启的起点",
            link: "02_路由是项目开启的起点",
          },
          {
            text: "03_通用组件的应用与路由跳转注意事项",
            link: "03_通用组件的应用与路由跳转注意事项",
          },
          {
            text: "04_请求的二次封装与接口的统一管理",
            link: "04_请求的二次封装与接口的统一管理",
          },
          {
            text: "05_三级分类的实现与性能优化",
            link: "05_三级分类的实现与性能优化",
          },
          {
            text: "06_首页的结构划分与轮播组件封装",
            link: "06_首页的结构划分与轮播组件封装",
          },
          {
            text: "07_轮播图功能实现与注意细节",
            link: "07_轮播图功能实现与注意细节",
          },
          {
            text: "08_搜索与商品列表",
            link: "08_搜索与商品列表",
          },
          {
            text: "09_商品详情页",
            link: "09_商品详情页",
          },
          {
            text: "10_注册登陆页",
            link: "10_注册登陆页",
          },
          {
            text: "11_购物车清单",
            link: "11_购物车清单",
          },
          {
            text: "12_生成结算订单",
            link: "12_生成结算订单",
          },
          {
            text: "13_支付订单",
            link: "13_支付订单",
          },
          {
            text: "14_会员中心",
            link: "14_会员中心",
          },
        ],
      },
      {
        text: "第12章 项目发布",
        base: "/vue3/chapter12/",
        collapsed: true,
        items: [
          {
            text: "01_项目发布环境配置",
            link: "01_项目发布环境配置",
          },
          {
            text: "02_在静态服务器环境中测试发布的项目",
            link: "02_在静态服务器环境中测试发布的项目",
          },
          {
            text: "03_在NodeJs环境中测试发布的项目",
            link: "03_在NodeJs环境中测试发布的项目",
          },
          {
            text: "04_在Nginx环境中测试发布的项目",
            link: "04_在Nginx环境中测试发布的项目",
          },
          {
            text: "05_项目发布性能优化等方面的强化",
            link: "05_项目发布性能优化等方面的强化",
          },
          {
            text: "06_域名、DNS解析、主机、FTP等概念的简单介绍",
            link: "06_域名、DNS解析、主机、FTP等概念的简单介绍",
          },
        ],
      },
    ],
  },
];
