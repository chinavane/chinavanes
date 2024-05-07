# 10.Tuple 元组类型

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

元组起源于函数编程语言（如 F#），这些语言中会频繁使用元组。

## 简单的例子

定义一对值分别为 `string` 和 `number` 的元组：

```ts
let guigu: [string, number] = ['硅谷', 9];
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```ts
let guigu: [string, number];
guigu[0] = '硅谷';
guigu[1] = 9;

guigu[0].slice(1);
guigu[1].toFixed(2);
```

也可以只赋值其中一项：

```ts
let guigu: [string, number];
guigu[0] = '硅谷';
```

但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

```ts
let guigu: [string, number];
guigu = ['硅谷', 9];
```

```ts
let guigu: [string, number];
guigu = ['硅谷'];

// 不能将类型“[string]”分配给类型“[string, number]”。源具有 1 个元素，但目标需要 2 个。
```

## 越界的元素

当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

```ts
let guigu: [string, number];
guigu = ['硅谷', 9];
guigu.push('男');
guigu.push(true);

// 类型“boolean”的参数不能赋给类型“string | number”的参数。
```
