---
title: 关于我-子心
sidebar: false
aside: true
---

<img src="/public/hero.png" width="100%" />

# 关于我-子心

二十多年的互联网工作经验让我对该行业有了较深的认识与理解。从需求到设计，从设计到前端，从前端到开发，从开发到测试，从测试到运维，互联网项目及产品的诸多环节在这些年中都有较为深入的涉及，而且有一些较为成功的经验与案例，在企业级开发阶段带领几十人技术团队进行项目的攻克。后转行担任多个培训机构的金牌讲师，在担任讲师期间所带学生超过几千人，而多年讲师经验让我有很好的沟通协调能力。

## 就职情况

- 北京尚硅谷科技有限公司（讲师）
- 北京千锋互联科技有限公司（讲师）
- 杭州珍诚网络科技有限公司（技术总监）
- 杭州易网灵杰科技有限公司（技术总监）

## 技术能力

- 精通前端开发，包括 vue2.x、vue3.x、react、next.js、nuxt.js、小程序、uni-app、taro、react-native、flutter、vitePress 等功能性框架
- 精通各种 UI 框架，包括样式类 bootstrap 以及 daisyUI、原子类 tailwindcss 、中后台 elementUI、elementPlus、antd、移动端 vant、vux、weui 、uView、tmUI 等
- 熟悉各类辅助插件与类库 axios、dayjs、lodash、echarts、swiper、better-scroll、async.js、html2pdf、xlsx、vxe-table 等
- 擅长后端 nodejs、express、mysql、mongodb 等
- 擅长各类代码封装模式，包括 function 函数、class 类、module 模块、component 组件、directive 指令、filter 过滤器、mixin 混入、hook 钩子、plugin 插件、library 类库、framework 框架等
- 精通各类性能优化方案，包括文件级、请求级、渲染级、体验级、缓存级、流程级、交流级等

## 项目介绍

### 某听书

某听书是一个音频分享平台，用户可以创建自己的音频专辑，分享给其他用户，也可以订阅其他用户的专辑，听取他们分享的音频。

技术体系：uniapp、vue3、pinia、GraceUI、uniapp-axios-adapter 、微信小程序、腾讯云、新浪云等

功能实现：

- 利用 uni-app 配合 vue 3 与 typescript 应用 graceui 进行项目的整体架构，最终输出到微信小程序端
- 听书内容弹出层中配合 scroll-view 的拖拽控制处理
- 听书流程的整体梳理，包括用户注册登录、查看听书分类、查阅免费与收费的听书内容，点击购买听书项目，支付费用，订单查看等
- 发布听书内容，包括发布专辑，发布听书内容清单，发布免费与收费听书资料等，中间有使用表单处理，验证操作，富文本编辑器等，最终形成个人专辑
- 图片与音、视频资料的上传处理，包括单文件与多文件上传实现
- 听书的播放控制与优化
- 与新浪直播接口关联实现直播通道

### 某优选

某优选是一个典型的 O2O 线上对线下的微信端移动项目，主要实现提货点区域线上下单线下取货的功能目标，产品分类主要是水果生鲜等居家生活品类。

技术体系：uniapp+vue3+tmui+typescript+pinia+pinia-plugin-persist-uni+asyncjs+lodash+echart+luch-request+jsdoc 等

功能实现：

- 利用 uniapp 进行项目开发，最终输出成微信小程序端，也可以实现多端适配
- 利用 jsdoc 实现整体项目的文档管理与文档生成输出操作
- 利用 typescript 对 vue 3 中相关内容进行数据类型的约束，包括非响应式数据、响应式数据 ref、reactive、prop、emit、provide、inject、vue-router、axios、pinia 等
- 结合第三方百度地图进行地理位置控制与地图展示等操作，包括提货点标记点显示与标记区范围查看等
- 对加入购物车、提货点、优惠券等相关内容进行复用组件的封装
- 对于产品列表进行无限滚动与虚拟滚动相结合操作，以便实现性能优化
- 普通商品、秒杀商品整体的商品购买流程实现，包括优惠券的使用，促销模式的选择等，以至订单结算支付完成等操作
- IconFont、Svg 、自定义图标组件封装等实现不同模式下的图标内容应用

### 某品汇

某品汇后台管理是一个 B2C 的后台管理系统，面向的是企业内部的工作人员，是一个综合的电商对应的后台管理系统，包含了主要电商操作版块内容，包括用户、新闻、产品、促销、物流等

技术体系：eslint+prettier+husky+commitLint+vxe-table+sortablejs+vue3-html2pdf+localforage+scss+lodash +jszip +@vueup/vue-quill+websocket+async.js+element-Plus+TypeScript

功能实现：

- 利用 eslint 的配置实现了团队化开发成员的代码统一格式规范，使用 prettier 配合 eslint 让成员开发的代码格式更加美观，通过配置 husky 管理 GIt 中的 Hooks 用于提交仓库时自动测试代码的规范检查，配置 commit 文件使团队化开发时成员上传 git 仓库时规范注释前缀
- 采用了 vxe-table 复杂表格插件进行项目中表格内容渲染显示，增加分页、排序、筛选等功能，更方便地对表格进行操作和管理
- 采用了 json-server + mockjs 来构建新闻、订单等整体项目的模拟数据
- 使用了 hooks 技术来封装所有模块中增、删、改、查等常见操作的代码，使代码更加简洁、易于维护
- 使用 localforage 对海量数据图片进行 IndexedDB 本地化存储处理，可以提高页面加载时的速度和性能
- 集成百度地图，并进行地图位置定位、地址框中显示地址、反向填写地址、地图显示定位双向处理，以及目标用户地址标记点标记以及行程路线规划
- 使用了 sortable 插件配合 vxe-table 实现列表排序重组处理
- 利用 echart 配合 websocket 实现数据大屏可视化，并注重数据实时变化
- 利用 async.js 与文件切片配合 web-worker 实现百万级数据的高性级文件导出操作

### 某医通

某医通是一个医院、科室展示与预约挂号的前后台系统，主要解决的是不同医院的展示，同一医院不同科室的划分以及不同科室患者的预约挂号操作。

技术体系：react+typescript+antd+redux+react-redux+redux-persist+socket.io

功能实现：

- 利用 vite+react+typescript 进行项目的构建，配合 antd 这一 UI 框架进行界面控制
- 没有使用 useReducer 和 useContext 进行状态管理，仍旧采用 react-redux 进行统一状态进行管理
- 虽然医院与科室数量有限，但仍旧采用了 react-virtualized 虚拟列表方案
- 医生管理中有坐班时间段的规划管理，方便患者预约挂号
- 医院管理中利用百度地图进行位置与行程路线规划管理操作
- 前台有患者咨询，利用 socket.io 通讯技术，实现点对点实时咨询对话
- 患者可以进行科室医生预约挂号处理，需要实现支付的完整流程
