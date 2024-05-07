# 04.reactive 响应数据的 TypeScript 支撑

除了使用 ref 可以进行响应式声明 reactive 同样也可以，那么在 reactive 进行响应式数据定义的时候又如何结合 TypeScript 进行类型约束呢？

如果利用 reactive 定义一个 user 的对象，那么能否限制其值的数据类型？其实可以利用断言的方式进行限制，比如 user 对象的 age 可以断言它的数据类型既可以是 string 字符串也可以是 number 数字型，断言 age 的数据类型是这两种数据类型的联合数据类型。那么对于 user.age 的属性不光可以进行字符串的赋值操作，还可以进行数字的赋值操作。

```typescript
const user = reactive({
  id: 1,
  name: '硅谷',
  age: 9 as string | number,
  address: '北京',
});

user.age = '10'; // 可以将字符串进行赋值操作
user.age = 18; // 也可以将数字进行赋值操作
```

如果尝试将 boolean、array 或者是 object 等其它不符合断言类型的数据进行赋值操作，那么就会报以语法错误提示，比如设置了 true 以后就提示`不能将类型“boolean”分配给类型“string | number”。`

![image-20220529103821795](http://qn.chinavanes.com/qiniu_picGo/image-20220529103821795.png)

除了给 age 进行赋值操作，其它的对象属性同样可以进行类似的操作，比如说重新设置 id 值。但如果添加一个没有初始的属性值的时候则会报以错误提示：

```typescript
user.id = 2; // 可以进行正常赋值操作
user.courses = ['前端', 'JAVA', '大数据', 'UI']; // 类型“{ id: number; name: string; age: number; address: string; }”上不存在属性“courses”
```

但是在实际应用中或者会思考 id 值是唯一值，它不应该能够随意变动，而 courses 是一个可选属性，如果有则可以进行设置，如果没有则不进行赋值，那么类似的需求又应该如何实现呢？

类似需求可以通过定义一个 interface 接口类型来进行实现，比如定义 IUserState，它的 id 利用 readonly 进行明确是只读的属性，而 courses 则利用?声明是一个可选项，那么在定义 user 这一响应式数据的时候则可以明确其数据类型就是 IUserState 类型。

```typescript
interface IUserState {
  readonly id: number;
  name: string;
  age: number;
  address: string;
  courses?: string[];
}

const user: IUserState = reactive({
  id: 1,
  name: '硅谷',
  age: 9 as number,
  address: '北京',
});

// user.age = '10';
user.age = 18;

user.id = 2;
user.courses = ['前端', 'JAVA', '大数据', 'UI'];
```

那么现在开发工具就会对 id 部分的操作提示`无法分配到 "id" ，因为它是只读属性。`，而 courses 的属性内容则可以进行直接的赋值处理。

![image-20220529122147698](http://qn.chinavanes.com/qiniu_picGo/image-20220529122147698.png)

也许现在你还想给 user 这一 reactive 数据对象添加一个新的属性，比如 birthday，并且它的取值范围只能是指定的年份，假设是 2014、2015 、 2016 、 2017 里的任意一个年份，那么又应该如何处理呢？

那么可以定义一个字面类数据类型，比如 year，它的取值范围就是预想期望的年份，并且可以再定义一个字面类数据类型 TUserState，利用 & 符号将 IUserState 这个接口类型与当前需求的 year 字面类数据类型进行交叉合并操作。

```typescript
interface IUserState {
  readonly id: number;
  name: string;
  age: number;
  address: string;
  courses?: string[];
}
type year = 2014 | 2015 | 2016 | 2017;
type TUserState = IUserState & { birthday: year };

const user: TUserState = reactive({
  id: 1,
  name: '硅谷',
  age: 9 as number,
  address: '北京',
});

// user.age = '10';
user.age = 18;

// user.id = 2;
user.courses = ['前端', 'JAVA', '大数据', 'UI'];
```

因为 user 中并没有设置 birthday 的属性值，那么就会报数据类型不匹配的错误，强调需要 birthday 的属性。

![image-20220529123039508](http://qn.chinavanes.com/qiniu_picGo/image-20220529123039508.png)

不过，即便你设置 birthday 属性，但属性值并不在 type 类型的可选范围值中仍旧会报错，`不能将类型“{ id: number; name: string; age: number; address: string; birthday: 2013; }”分配给类型“TUserState”。 不能将类型“{ id: number; name: string; age: number; address: string; birthday: 2013; }”分配给类型“{ birthday: year; }”。`，所以必须将 birthday 属性设置为正确的 type 可选范围值才可以。

![image-20220529123256447](http://qn.chinavanes.com/qiniu_picGo/image-20220529123256447.png)

除了给响应式数据对象 user 进行指定的 TypeScript 数据类型的限制，也可以利用泛型进行约束，并且如果遇到错误的设值操作，它们的提示信息还会略微不同。

```typescript
const user = reactive<TUserState>({
  id: 1,
  name: '硅谷',
  age: 9 as number,
  address: '北京',
  birthday: 2013,
});
```

![image-20220529123805894](http://qn.chinavanes.com/qiniu_picGo/image-20220529123805894.png)

显然，TypeScript 的各种数据类型对 reactive 都可以进行很好的支撑，而且它们的声明方式多种多样非常的灵活。

src/componens/HelloWorld.vue

```vue
<script setup lang="ts">
import { reactive, Ref, ref, watch } from 'vue';

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

// 利用Ref进行数据类型的声明
const converTransform: Ref<number> = ref(0); // 位移转换的初始值
const divBgColor: Ref<Color> = ref(Color.Red); // div的背景颜色初始值

// const converTransform = ref<number>(0); // 位移转换的初始值
// const divBgColor = ref<Color>(Color.Red); // div的背景颜色初始值

// 移动开始
const handleTouchStart = (e: TouchEvent): void => {
  startY = e.touches[0].clientY;
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

interface IUserState {
  readonly id: number;
  name: string;
  age: number;
  address: string;
  courses?: string[];
}
type year = 2014 | 2015 | 2016 | 2017;
type TUserState = IUserState & { birthday: year };

const user = reactive<TUserState>({
  id: 1,
  name: '硅谷',
  age: 9 as number,
  address: '北京',
  birthday: 2015,
});

// user.age = '10';
user.age = 18;

// user.id = 2;
user.courses = ['前端', 'JAVA', '大数据', 'UI'];
</script>

<template>
  <h1>{{ showWeeks() }}</h1>
  <p>用户年龄：{{ user.age }}</p>
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

