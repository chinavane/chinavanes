# 04.TypeScript 的数据类型

## 1)TypeScript 中的类型是什么

在 TypeScript 中，类型是一种方便的方式来引用一个值所具有的不同属性和函数。值是可以分配给变量的任何内容，例如数字、字符串、数组、对象和函数。

请参阅以下值：

```typescript
'Hello';
```

当你看这个值时，你可以确认它是一个字符串。这个值也将具有字符串所应该具有的属性和方法。

例如，该`'Hello'`值有一个`length`属性，它将返回字符串的长度：

```typescript
console.log('Hello'.length); // 5
```

字符串还有许多方法，如`match()`,`indexOf()`和`toLocaleUpperCase()`。例如：

```typescript
console.log('Hello'.toLocaleUpperCase()); // HELLO
```

但如果需要通过查看值`'Hello'`并通过列出它的属性和方法来描述它，那是非常不方便的。

引用一个值更为简便的方法则是为其分配一个类型。在此示例中，你可以确认`'Hello'`是一个 string，那么就可以清晰`'Hello'`这个字符串的属性与方法内容了。

总之，在 TypeScript 中：

- 类型是描述值具有的不同属性和方法的标签；
- 每个值都有一个类型。

## 2)TypeScript 中的类型

TypeScript 继承了 JavaScript 的内置类型，所以TypeScript 类型主要分为：

- 原始类型
- 对象类型

### 原始类型

下面说明了 TypeScript 中的原始类型：

| **姓名**    | **描述**                                        |
| ----------- | ----------------------------------------------- |
| `string`    | 表示文本数据                                    |
| `number`    | 表示数值                                        |
| `boolean`   | 有真值和假值                                    |
| `null`      | 有一个值：空                                    |
| `undefined` | 有一个值：`undefined`. 它是未初始化变量的默认值 |
| `symbol`    | 表示唯一的常数值                                |
| `BigInt`    | 任意长度的整数                                  |

### 对象类型

对象类型是函数、数组、类等，稍后，您将学习如何创建自定义对象类型。

## 3)TypeScript 中类型的用途

TypeScript 中类型的主要用途有两个：

- 首先，TypeScript 编译器使用类型来分析代码中的错误；
- 其次，类型允许您了解哪些值与变量相关联。

## 4)TypeScript 类型示例

以下示例使用该`querySelector()`方法选择`<h1>`元素：

```typescript
const heading = document.querySelector('h1');
```

TypeScript 编译器知道的类型`heading`是`HTMLHeadingElement`：

![image-20220513191144344](http://qn.chinavanes.com/qiniu_picGo/image-20220513191144344.png)

它显示了`heading`这个`HTMLHeadingElement`类型对象可以访问的属性以及方法列表：

![image-20220513191224526](http://qn.chinavanes.com/qiniu_picGo/image-20220513191224526.png)

如果您尝试访问不存在的属性或方法，TypeScript 编译器将显示错误。例如：

![image-20220513191526232](http://qn.chinavanes.com/qiniu_picGo/image-20220513191526232.png)

## 5)概括

- TypeScript 中的每个值都有一个类型；
- 类型是描述值所具有的属性和方法的标签；
- TypeScript 编译器使用类型来分析您的代码以寻找错误和错误。
