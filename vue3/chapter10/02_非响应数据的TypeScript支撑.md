# 02.非响应数据的 TypeScript 支撑

## 1)枚举类型日期与函数返回类型的类型约束

在 vue 项目中进行 TypeScritp 类型约束操作时的第一个问题是什么？我想先考虑一下是否对非响应式数据的类型约束是否能够很好支持，而且我们需要思考在 vue 项目中是否所有的数据都需要声明成响应式数据。

其实在 vue 项目中并不是所有数据都需要声明成响应式数据，应该说如何可以不声明成响应式数据建议不要声明成响应式数据。因为将普通的数据转化为响应式数据其实会消耗大量的功能逻辑操作，比如说需要进行数据的劫持代理，数据的订阅观察，甚至是数据的递归遍历等，这样对不需要进行响应式操作的数据对象进行响应式数据声明以后反而会造成极大的资源损耗与浪费。

比如现在有一个需求，只需要页面中显示当前日期是星期几的功能，看起来并不需要动态响应式的修改这一时间内容，所以就可以将相应的变量定义成普通变量的模式即可。

想要实现这一简单功能，可以将 App.vue 与 HelloWorld.vue 这两个组件的代码进行清理，将所有无用的代码直接进行删除，只需要实现 App.vue 组件中进行 HelloWorld.vue 组件调用即可，并且 HelloWorld.vue 组件中还没有任何功能的操作。

src/App.vue

```vue
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <HelloWorld />
</template>
```

src/components/HelloWorld.vue

```vue
<script setup lang="ts"></script>
<template></template>
```

想要显示星期几需要考虑一个星期的第一天从什么时候开始，利用 js 的 getDay 方法虽然可以获取到 0（周日） 到 6（周六） 之间的一个整数，但这返回值是一个数字类型，与应用所期望的星期几这个字符串还有一定的距离。所以是否考虑定义一个枚举型的常量 Weeks 呢，可以给这个 Weeks 对象进行数字与字符类型的对应设置。目前给星期一进行了下标起始位置的强制约束，如果星期一的下标值为 1，那么星期二开始的日期都会依照星期一下标的起始值为起点进行递增，如果想给星期天作特殊处理，也可以给它进行指定元素的下标标识。如果想要打印输出 Weeks 这个对象，则可以确认它会形成正向与反向两种对应模式的键值对对象。

```typescript
// 设置Weeks星期为枚举类型，星期一的起位下标为1，星期天的下标为0
enum Weeks {
  '星期一' = 1, // 可以约束下标起始位置
  '星期二', // 后续的日期会依照前面的下标顺序递增
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期天' = 0, // 也可以对指定元素进行指定下标的定义
}
```

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20220522101235529.png" alt="image-20220522101235529" style="zoom:50%;" />

可以再声明一个显示星期几的函数 showWeeks，该函数返回的数据类型应该是 string 字符串，在通过 new Date 的 getDay 函数返回数字型数据以后则可以利用对象的下标获取方式利用 Weeks 这个枚举对象确认当前时间为星期几。不过，因为限制了函数的返回类型为 string，如果函数直接返回的是 currentDay 的话，那么编辑器就会直接报以不能将类型“number”分配给类型“string”的语法错误，显然在当前 vue 项目中 TypeScript 的类型约束已经展现出其功能。

```typescript
// 显示星期几函数，函数的返回数据类型为字符串类型
const showWeeks = (): string => {
  // currentDay返回值是 0（周日） 到 6（周六） 之间的一个整数
  const currentDay = new Date().getDay();
  // 利用枚举类型的下标获取当前星期几的字符串
  return Weeks[currentDay];
};
```

![image-20220522101419628](http://qn.chinavanes.com/qiniu_picGo/image-20220522101419628.png)

所以，现在只需要在 template 模板中调用刚才所定义的 showWeeks 函数即可。

src/components/HelloWorld.vue

```vue
<script setup lang="ts">
// 设置Weeks星期为枚举类型，星期一的起位下标为1，星期天的下标为0
enum Weeks {
  '星期一' = 1, // 可以约束下标起始位置
  '星期二', // 后续的日期会依照前面的下标顺序递增
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期天' = 0, // 也可以对指定元素进行指定下标的定义
}

// 显示星期几函数，函数的返回数据类型为字符串类型
const showWeeks = (): string => {
  // currentDay返回值是 0（周日） 到 6（周六） 之间的一个整数
  const currentDay = new Date().getDay();
  // 利用枚举类型的下标获取当前星期几的字符串
  return Weeks[currentDay];
};
</script>

<template>
  <h1>{{ showWeeks() }}</h1>
</template>
```

## 2)枚举类型在 template 模板中的应用

为什么说 TypeScript 在应用的时候会极大的加快代码的编写速度，还能很好的实现代码可读性与可维护性的增强？现在可以再定义一个枚举类型 Color，在 Color 里需要定义一些颜色的键名，比如 Red、Blue、Yellow 等，因为这些键名在开发的时候更具有意义更容易理解，但显示颜色值可以设置为 RGB、字符串或者十六进制等不同的声明模式，所以在编码的时候如果不使用有意义 Red、Blue、Yellow 进行书写而是在代码中直接进行 RGB、字符串或者十六进制对应内容的编写将会十分容易遗忘它们所对应的颜色。

```typescript
// 定义枚举类型Color，颜色值可以是RGB、字符串、十六进制模式
enum Color {
  Red = 'rgb(255, 0, 0)',
  Blue = 'blue',
  Yellow = '#ffcc00',
  Gray = '#f5f5f5',
  White = '#fff',
}
```

现在在 template 模板中如果添加 div 并且设置动态行内样式，假若设置其 color 字体颜色时利用 Color 这一枚举类型则可以实现更有意义的 Red、Blue、Yellow 等键名的提示与选择操作，这时候的代码其可读性与可理解性也会大幅度的增加，而且就算后期维护也会十分清楚这里使用的到底是什么颜色，而不需要去考虑到底它的 RGB、字符串或者十六进制值是什么内容。

![image-20220522110210966](http://qn.chinavanes.com/qiniu_picGo/image-20220522110210966.png)

components/HelloWorld.vue

```vue {13-20,34-39,42-50}
<script setup lang="ts">
// 设置Weeks星期为枚举类型，星期一的起位下标为1，星期天的下标为0
enum Weeks {
  '星期一' = 1, // 可以约束下标起始位置
  '星期二', // 后续的日期会依照前面的下标顺序递增
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期天' = 0, // 也可以对指定元素进行指定下标的定义
}

// 定义枚举类型Color，颜色值可以是RGB、字符串、十六进制模式
enum Color {
  Red = 'rgb(255, 0, 0)',
  Blue = 'blue',
  Yellow = '#ffcc00',
  Gray = '#f5f5f5',
  White = '#fff',
}

// 显示星期几函数，函数的返回数据类型为字符串类型
const showWeeks = (): string => {
  // currentDay返回值是 0（周日） 到 6（周六） 之间的一个整数
  const currentDay = new Date().getDay();
  // 利用枚举类型的下标获取当前星期几的字符串
  return Weeks[currentDay];
};
</script>

<template>
  <h1>{{ showWeeks() }}</h1>
  <!-- 利用枚举类型获取颜色，代码的可读性增强，更容易实现代码维护操作 -->
  <div
    class="dragBox"
    :style="{ color: Color.White, backgroundColor: Color.Red }"
  >
    往下拖动图层颜色会变化
  </div>
</template>

<style>
.dragBox {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
```

## 3)基础数据类型与事件类型的应用

当前的应用目标是想对页面中 div 对象进行拖放操作，并且需要在拖放移动的过程中对 div 元素进行背景颜色的改变操作。想要实现这一目标需要设置坐标开始位置、坐标实时位置，并且计算坐标移动距离，而且可以利用 touchstart、touchmove、touchend 等移动端事件进行实时距离的计算操作，最后可以结合 ref 响应式数据将实时的距离进行响应式数据的赋值处理以便实现 div 元素的位移与颜色改变操作。

首先，可以声明 startY、moveY、moveDistance 三个非响应式数据，并且明确其数据类型都是 number 数字型。

然后，再声明 converTransform 与 divBgColor 这两个 ref 的响应式数据，converTransform 的初始值为 0，而 divBgColor 则使用了 Color.Red 这个枚举类型值作为初始值。

```typescript
// 实现在移动端对div图层的拖放并且播放过程中背景颜色的改变与动画的实现
let startY: number = 0; // 坐标开始位置
let moveY: number = 0; // 坐标实时位置
let moveDistance: number = 0; // 坐标移动距离

const converTransform = ref(0); // 位移转换的初始值
const divBgColor = ref(Color.Red); // div的背景颜色初始值
```

接下来，在 touchstart 移动开始的时候可以设置 handleTouchStart 的回调事件，而拖动开始的时候会有 event 事件对象，当前直接设置为 e，如果我们不对 event 事件对象进行数据类型的限制，那么系统将自动会将它推断为 any 任意类型，这时候如果想进行 event 事件对象下属的属性内容获取操作时会发现没有任何的友好有效提示信息，所以让开发人员很难明确到底应该获取与操作什么 event 事件属性。

```typescript
// 移动开始
const handleTouchStart = (e): void => {};
```

![image-20220522154643079](http://qn.chinavanes.com/qiniu_picGo/image-20220522154643079.png)

![image-20220522115550658](http://qn.chinavanes.com/qiniu_picGo/image-20220522115550658.png)

那么到底应该如何确认当前的 event 事件类型呢？可以在 div 进行事件绑定的时候进行绑定事件的查看，可以将鼠标放置于@touchstart 事件绑定代码上，则可以看到 payload 的类型是 TouchEvent，这就明确了 handleTouchStart 这个回调函数中的 event 事件类型就是 TouchEvent。

![image-20220522154724349](http://qn.chinavanes.com/qiniu_picGo/image-20220522154724349.png)

所以在给 e 进行 TouchEvent 事件类型声明以后，再进行 event 事件对象属性的获取则可以查看到 TouchEvent 的所有有效事件对象内容，这时则可以轻松获取到 clientY 的坐标内容。

![image-20220522115736167](http://qn.chinavanes.com/qiniu_picGo/image-20220522115736167.png)

现在就可以轻松又明确的获取到当前拖动位置 clientY 的数据值了。

```typescript
// 移动开始
const handleTouchStart = (e: TouchEvent): void => {
  startY = e.touches[0].clientY; // 获取拖动时坐标的纵向起始值
};
```

既然已经梳理了 touchstart 的流程类型约束操作流程，那么 touchmove 与 touchend 的步骤也是一样的，只不过在 touchmove 的时候做了更多的业务逻辑判断。在移动的时候也可以利用 TouchEvent 的事件类型获取到 clientY 的坐标位置，然后利用当前实时的坐标位置与初始的 startY 坐标位置进行相减，那么就可以计算出 moveDistance 移动的距离值，我们不光可以对 moveDistance 这个距离值进行边界的判断操作，还可以利用条件语句与 Color 枚举对象进行结合，针对不同的移动距离范围内的背景颜色 divBgColor 进行响应式数据的赋值处理，最后还可以将这个 moveDistance 的距离值赋值给 converTransform 这个响应式数据，这时也可以发现业务逻辑代码中 Color 枚举对象的应用让我们更清楚在什么距离值下使用的是什么颜色值，而不需要考虑 RGB、字符串或者十六进制的颜色值类型。

```typescript
// 移动中
const handleTouchMove = (e: TouchEvent): void => {
  moveY = e.touches[0].clientY; // 获取纵向坐标实时位置
  moveDistance = moveY - startY; // 利用实时与初始值的差计算对象拖动的距离值

  // 实现边界的判断，小于0直接中断，大于100则让其距离值恒等于100
  if (moveDistance < 0) {
    return;
  }
  if (moveDistance > 100) {
    moveDistance = 100;
  }

  // 利用距离值的范围对div的背景颜色值进行动态改变
  if (moveDistance > 0 && moveDistance < 30) {
    divBgColor.value = Color.Red;
  } else if (moveDistance > 30 && moveDistance < 60) {
    divBgColor.value = Color.Blue;
  } else if (moveDistance > 60 && moveDistance < 100) {
    divBgColor.value = Color.Yellow;
  }
  // 设置拖动对象的位置距离值
  converTransform.value = moveDistance;
};
```

至于拖放结束以后可以考虑将 divBgColorg 与 converTransform 这两个响应式数据回归到初始值状态。

```typescript
// 拖动结束时需要回归初始值
const handleTouchEnd = (): void => {
  divBgColor.value = Color.Red;
  converTransform.value = 0;
};
```

最后在 template 模板部分只需要给 div 元素添加相应的事件监听以及处理动态样式绑定，利用 transform 与 backgroundColor 实现元素位置与背景颜色的改变即可。

```vue
<div
  class="dragBox"
  :style="{
    color: Color.White,
    backgroundColor: Color.Red,
    transform: `translateY(${converTransform}px)`,
    backgroundColor: divBgColor,
  }"
  @touchstart="handleTouchStart"
  @touchmove="handleTouchMove"
  @touchend="handleTouchEnd"
>
    往下拖动图层颜色会变化
  </div>
```

最终在移动端模拟器环境下进行应用测试，则可以看到在进行 div 元素拖放过程中 div 元素的背景将会随着坐标位置的改变而显示不同的颜色内容。

![image-20220522122243206](http://qn.chinavanes.com/qiniu_picGo/image-20220522122243206.png)

![image-20220522122211187](http://qn.chinavanes.com/qiniu_picGo/image-20220522122211187.png)

![image-20220522122229956](http://qn.chinavanes.com/qiniu_picGo/image-20220522122229956.png)

components/HelloWorld.vue

```vue {31-73,78-94}
<script setup lang="ts">
import { ref } from 'vue';
// 设置Weeks星期为枚举类型，星期一的起位下标为1，星期天的下标为0
enum Weeks {
  '星期一' = 1, // 可以约束下标起始位置
  '星期二', // 后续的日期会依照前面的下标顺序递增
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期天' = 0, // 也可以对指定元素进行指定下标的定义
}

// 定义枚举类型Color，颜色值可以是RGB、字符串、十六进制模式
enum Color {
  Red = 'rgb(255, 0, 0)',
  Blue = 'blue',
  Yellow = '#ffcc00',
  Gray = '#f5f5f5',
  White = '#fff',
}

// 显示星期几函数，函数的返回数据类型为字符串类型
const showWeeks = (): string => {
  // currentDay返回值是 0（周日） 到 6（周六） 之间的一个整数
  const currentDay = new Date().getDay();
  // 利用枚举类型的下标获取当前星期几的字符串
  return Weeks[currentDay];
};

// 实现在移动端对div图层的拖放并且播放过程中背景颜色的改变与动画的实现
let startY: number = 0; // 坐标开始位置
let moveY: number = 0; // 坐标实时位置
let moveDistance: number = 0; // 坐标移动距离

const converTransform = ref(0); // 位移转换的初始值
const divBgColor = ref(Color.Red); // div的背景颜色初始值

// 移动开始
const handleTouchStart = (e: TouchEvent): void => {
  startY = e.touches[0].clientY; // 获取拖动时坐标的纵向起始值
};

// 移动中
const handleTouchMove = (e: TouchEvent): void => {
  moveY = e.touches[0].clientY; // 获取纵向坐标实时位置
  moveDistance = moveY - startY; // 利用实时与初始值的差计算对象拖动的距离值

  // 实现边界的判断，小于0直接中断，大于100则让其距离值恒等于100
  if (moveDistance < 0) {
    return;
  }
  if (moveDistance > 100) {
    moveDistance = 100;
  }

  // 利用距离值的范围对div的背景颜色值进行动态改变
  if (moveDistance > 0 && moveDistance < 30) {
    divBgColor.value = Color.Red;
  } else if (moveDistance > 30 && moveDistance < 60) {
    divBgColor.value = Color.Blue;
  } else if (moveDistance > 60 && moveDistance < 100) {
    divBgColor.value = Color.Yellow;
  }
  // 设置拖动对象的位置距离值
  converTransform.value = moveDistance;
};

// 拖动结束时需要回归初始值
const handleTouchEnd = (): void => {
  divBgColor.value = Color.Red;
  converTransform.value = 0;
};
</script>

<template>
  <h1>{{ showWeeks() }}</h1>
  <!-- 利用枚举类型获取颜色，代码的可读性增强，更容易实现代码维护操作 -->
  <!-- 利用transform的translateY实现纵向位移功能 -->
  <!-- touchstart、touchmove、touchend是移动端事件，需要利用浏览器模拟器进行测试 -->
  <div
    class="dragBox"
    :style="{
      color: Color.White,
      backgroundColor: Color.Red,
      transform: `translateY(${converTransform}px)`,
      backgroundColor: divBgColor,
    }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    往下拖动图层颜色会变化
  </div>
</template>

<style>
.dragBox {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
```
