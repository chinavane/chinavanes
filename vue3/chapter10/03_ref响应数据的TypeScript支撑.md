# 03.ref 响应数据的 TypeScript 支撑

TypeScript 拥有非常智能的类型推断能力，在之前的项目编码过程中虽然对非响应式数据类型进行了类型的强制定义，但对于响应式数据并没有做过多的声明，比如目前并没有清晰的明确 ref 类型的响应式数据 converTransform 和 divBgColor 它们具体数据类型，但显然程序的运行结果没有任何的问题。那么 converTransform 和 divBgColor 到底应该是什么样的数据类型呢？

在对 converTransform 进行定义的时候设置了初始值 0，想来可以非常直观的考虑到这个变量的数据类型为 number 数字型，但是 divBgColor 这个变量在定义的时候初始值却是 Color.Red 这个枚举类型的对象值，那么它又应该是什么数据类型呢？Color.Red 返回的结果应该是`rgb(255, 0, 0)`这个 RGB 颜色值，难道 divBgColor 应该是字符串类型？

```typescript
const converTransform = ref(0); // 位移转换的初始值
const divBgColor = ref(Color.Red); // div的背景颜色初始值
```

其实我们有更简单直接的办法可以明确 ref 响应式数据的数据类型，可以将鼠标放置到 converTransform 这个变量上，编辑器会提示它的数据类型是`Ref<number>`，说明当前的 ref 数据类型被默认推测为 number 类型，这与之前的推测不谋而合。

![image-20220522154831944](http://qn.chinavanes.com/qiniu_picGo/image-20220522154831944.png)

但是当将鼠标放置于 divBgColor 以后这时候发现提示的数据类型却不是之前所预期的 string 字符串类型，而是 Color 颜色这一枚举对象类型，所以我想在响应式数据声明的时候就确认其数据类型会对数据后期的的应用会有更好的理解与帮助。

![image-20220522145157624](http://qn.chinavanes.com/qiniu_picGo/image-20220522145157624.png)

那么，现在应该如何给 ref 响应式数据进行强制类型的声明呢？其实提示信息已经非常的明确，既然 converTransform 的数据类型推测的是`Ref<number>`那么我们是否可以给它直接进行该类型的定义呢，不过在给 converTransform 约束类型为`Ref<number>`的时候则会提示找不到名称"Ref"，可以点击“快速修复...”功能，跟随帮助直接将 Ref 从"vue"更新导入。

![image-20220522154922518](http://qn.chinavanes.com/qiniu_picGo/image-20220522154922518.png)

![image-20220522154945188](http://qn.chinavanes.com/qiniu_picGo/image-20220522154945188.png)

如此操作以后，从 vue 中引入的内容主要包括 ref 和 Ref 两个对象，但需要明确的是 Ref 是 interface 接口，利用它可以实现数据类型的定义约束，而 ref 是函数，利用它可以进行响应式数据的声明。

```typescript
import { Ref, ref } from 'vue';
```

![image-20220522152330679](http://qn.chinavanes.com/qiniu_picGo/image-20220522152330679.png)

![image-20220522152343988](http://qn.chinavanes.com/qiniu_picGo/image-20220522152343988.png)

既然 converTransform 已经利用 Ref 进行了 number 数据类型的显式声明，那么 divBgColor 同样也可以利用 Ref 进行数据类型的显式声明，而且也只需要随着原先的提示信息将其设置为 Color 的数据类型即可。

```typescript
const converTransform: Ref<number> = ref(0); // 位移转换的初始值
const divBgColor: Ref<Color> = ref(Color.Red); // div的背景颜色初始值
```

其实除了利用 Ref 进行 ref 数据类型的显式声明，还可以利用泛型进行 ref 数据类型的定义：

```typescript
const converTransform = ref<number>(0); // 位移转换的初始值
const divBgColor = ref<Color>(Color.Red); // div的背景颜色初始值
```

需要注意的是，如果用泛型的模式进行数据类型约束在设置初始值以后可以明确其数据类型为 number，但如果 ref 在进行设置的时候不进行初始值设置，那么根据类型推断会将 ref 类型推测为`<number | undefined>`联合数据类型，而不是单纯的 number 数字类型。

![image-20220522155033066](http://qn.chinavanes.com/qiniu_picGo/image-20220522155033066.png)

![image-20220522155051293](http://qn.chinavanes.com/qiniu_picGo/image-20220522155051293.png)

如果再查看利用 Ref 进行数据类型定义的模式时则可以确认如果不给 0 这个初始值是会出现语法错误提示的，提示信息为`不能将类型“Ref<number | undefined>”分配给类型“Ref<number>”，不能将类型“number | undefined”分配给类型“number”`。

![image-20220522155121922](http://qn.chinavanes.com/qiniu_picGo/image-20220522155121922.png)

所以从语法的严格性来讲，利用 Ref 进行数据类型定义会比泛型定义来得更为的严格。
