# 01.六何分析理解 TypeScript

现在准备利用六何分析法剖析TypeScript到底是什么，让我们一同感受一下TypeScript强大的功能与魅力。

## 1)What

TypeScript 是什么？它是 JavaScript 的超集，TypeScript 是建立在 JavaScript 之上的。不管是浏览器还是 NodeJs 的环境本身都不支持对 TypeScript 的直接解析，如果程序采用 TypeScript 编码需要使用 TypeScript 编译器将 TypeScript 代码编译为纯 JavaScript 代码，只有拥有纯 JavaScript 代码后，才可以将其部署到 JavaScript 运行的任何环境中。

TypeScript 文件使用`.ts`扩展名而不是 JavaScript 的`.js`文件的扩展名。

![img](http://qn.chinavanes.com/qiniu_picGo/what-is-typescript-compiler.png)

TypeScript 是始于 JavaScript 归于 Javascritp，它使用 JavaScript 语法，只是添加了更多额外的语法来支持类型。如果原来的 JavaScript 程序没有任何语法错误，那么它也是一个 TypeScript 程序。这意味着所有的 JavaScript 程序都是 TypeScript 程序。如果您要将现有的 JavaScript 代码库迁移到 TypeScript，这将非常有用。

下图展示了 TypeScript 和 JavaScript 之间的关系：

![TS与JS.png](http://qn.chinavanes.com/qiniu_picGo/v2-c327c810e7b80cd27568e92d5a6d5721_720w.jpg)

## 2)Who

Typescript 是由世界互联网巨头微软开发的，相信大家都听说过背靠大树好乘凉，由微软开发的 Typescript 相信是非常值得信赖与依靠的。而 JavaScript 是世界排名前 10 的程序语言，它拥有异常庞大的用户群体，根据 Stack Overflow 对过往年份的统计，JavaScript 一度是需求量最大的编程语言之一。那么作为 JavaScript 的超集 TypeScript，原先 JavaScript 的拥护者非常容易的就会转投 TypeScript 的怀抱，所以 TypeScript 语言在全球程序语言排行 TIOBE 上稳步提升。

## 3)When

2012-10，微软发布了 TypeScript 第一个版本（0.8），此前 TypeScript 已经在微软内部开发了两年。又经过 2 年的完善与增强在 2014-04TypeScript 发布了 1.0 版本。随着时间的发展历史的推进 TypeScript 经历了十多年不懈的努力，不断的完善了对前端 Angular、React、Vue 等众多框架的支持，也逐步强化了对 Node、Deno 等后台运行环境的支撑。

在互联网这个优胜劣汰的大环境中任何一个项目任何一门程序语言能熬过 10 年都不是一件容易的事情，TypeScript 不像 Java、Python 一样经历了 30 年的风雨历经沧桑，它也不像 JavaScript 一样经受了 20 年的雷霆磨砺，但它在 10 多年的挫折中不断强大，所以未来 TypeScript 的发展将是一片光明。

## 4)Where

TypeScript 适用于任何规模任何类型的项目！

TypeScript 非常适用于大型项目，TypeScript 的类型系统可以为大型项目带来更高的可维护性，以及更少的 bug，这部分 TypeScript 特性稍后会重点介绍。

在中小型项目中推行 TypeScript 的最大障碍就是认为使用 TypeScript 需要写额外的代码，降低开发效率。但事实上，由于有类型推论，大部分类型都不需要手动声明了。相反，TypeScript 增强了编辑器（IDE）的功能，包括代码补全、接口提示、跳转到定义、代码重构等，这在很大程度上提高了开发效率。而且 TypeScript 有近百个编译选项，如果你认为类型检查过于严格，那么可以通过修改编译选项来降低类型检查的标准。

TypeScript 还可以和 JavaScript 共存。这意味着如果你有一个使用 JavaScript 开发的旧项目，又想使用 TypeScript 的特性，那么你不需要急着把整个项目都迁移到 TypeScript，你可以使用 TypeScript 编写新文件，然后在后续更迭中逐步迁移旧文件。如果一些 JavaScript 文件的迁移成本太高，TypeScript 也提供了一个方案，可以让你在不修改 JavaScript 文件的前提下，编写一个类型声明文件，实现旧项目的渐进式迁移。

事实上，就算你从来没学习过 TypeScript，你也可能已经在不知不觉中使用到了 TypeScript——在 VSCode 编辑器中编写 JavaScript 时，代码补全和接口提示等功能就是通过 TypeScript Language Service 实现的：

![what-is-typescript-vscode](http://qn.chinavanes.com/qiniu_picGo/what-is-typescript-vscode.png)

一些第三方库原生支持了 TypeScript，在使用时就能获得代码补全了，比如 Vue 3.0：

![what-is-typescript-vue](http://qn.chinavanes.com/qiniu_picGo/what-is-typescript-vue.png)

有一些第三方库原生不支持 TypeScript，但是可以通过安装社区维护的类型声明库（比如通过运行 `npm install --save-dev @types/react` 来安装 React 的类型声明库）来获得代码补全能力——不管是在 JavaScript 项目中还是在 TypeScript 中项目中都是支持的：

![what-is-typescript-react](http://qn.chinavanes.com/qiniu_picGo/what-is-typescript-react.png)

由此可见，TypeScript 的发展已经深入到前端社区的方方面面了，任何规模的项目都或多或少得到了 TypeScript 的支持。

## 5)Why

TypeScript 的主要目标是：

- 将可选类型引入 JavaScript；
- 实现未来 JavaScript 的计划功能，即 ECMAScript Next 或 ES Next 到当前 JavaScript。

### 1) TypeScript 提高您的工作效率，同时帮助避免错误

程序开发时候最容易出现问题就是出错，我通常把错误类型划分成三大类：

- 语法错误：这部分的错误在开发阶段编辑器环境中就会有所提示，所以非常容易定位与解决；
- 编译错误：在代码书写阶段并不会出现任何错误提示与信息，只有在程序编译运行的时候才会出现并带有一定的错误参考信息，但解决该类错误需要强化错误参考信息的理解能力与分析原因能力；
- 逻辑错误：这类错误在编码、编译运行时都不会出现，但运行结果与预期总是不一致，所以往往很难发现与解决，需要拥有强大的错误调试能力，比如说错误输出、断点调试等。

所以，是否能够将逻辑错误、编译错误进行错误前置，尽可能都被划分到语法错误级别，那么程序的出错率将会大幅度的降低。

而 TypeScript 强大的类型通过帮助你避免许多错误来提高生产力。通过使用类型，您可以在编译时捕获错误，而不是让它们在运行时发生。

以下函数将两个数字`x`和相加`y`：

```js
function add(x, y) {
  return x + y;
}
```

如果您从 HTML 输入元素中获取值并将它们传递给函数，您可能会得到意想不到的结果：

```js
let result = add(input1.value, input2.value);
console.log(result); // result of concatenating strings
```

例如，如果用户输入`10`and `20`，该`add()`函数将返回`1020`，而不是`30`。

原因是`input1.value`and`input2.value`是字符串，而不是数字。当您使用运算符`+`添加两个字符串时，它将它们连接成一个字符串。

当您使用 TypeScript 显式指定参数的类型时，如下所示：

```js
function add(x: number, y: number) {
  return x + y;
}
```

在此函数中，我们将数字类型添加到参数中。该函数`add()`将只接受数字，而不接受任何其他值。

当您按如下方式调用该函数时：

```js
let result = add(input1.value, input2.value);
```

如果你把 TypeScript 代码编译成 JavaScript，TypeScript 编译器会报错。因此，您可以防止错误在运行时发生。

### 2)与标准同步发展

学习使用 TypeScript 的另一个重要的原因就是它坚持与 ECMAScript 标准同步发展。

ECMAScript 是 JavaScript 核心语法的标准，自 2015 年起，每年都会发布一个新版本，包含一些新的语法。

一个新的语法从提案到变成正式标准，需要经历以下几个阶段：

- Stage 0：展示阶段，仅仅是提出了讨论、想法，尚未正式提案。
- Stage 1：征求意见阶段，提供抽象的 API 描述，讨论可行性，关键算法等。
- Stage 2：草案阶段，使用正式的规范语言精确描述其语法和语义。
- Stage 3：候选人阶段，语法的设计工作已完成，需要浏览器、Node.js 等环境支持，搜集用户的反馈。
- Stage 4：定案阶段，已准备好将其添加到正式的 ECMAScript 标准中。

一个语法进入到 Stage 3 阶段后，TypeScript 就会实现它。一方面，让我们可以尽早的使用到最新的语法，帮助它进入到下一个阶段；另一方面，处于 Stage 3 阶段的语法已经比较稳定了，基本不会有语法的变更，这使得我们能够放心的使用它。

除了实现 ECMAScript 标准之外，TypeScript 团队也推进了诸多语法提案，比如可选链操作符（`?.`）、空值合并操作符（`??`）、Throw 表达式、正则匹配索引等。

TypeScript 支持在 ES Next 中为当前 JavaScript 引擎计划的即将推出的功能，这意味着您可以在 Web 浏览器（或其他环境）完全支持它们之前使用新的 JavaScript 功能。

## 6)How

从 TypeScript 的名字就可以看出来，“类型”是其最核心的特性，所以要如何学习好 TypeScript 关键在于掌握好 TypeScript 的类型。

我们知道，JavaScript 是一门非常灵活的编程语言：

- 它没有类型约束，一个变量可能初始化时是字符串，过一会儿又被赋值为数字。
- 由于隐式类型转换的存在，有的变量的类型很难在运行前就确定。
- 基于原型的面向对象编程，使得原型上的属性或方法可以在运行时被修改。
- 函数是 JavaScript 中的一等公民，可以赋值给变量，也可以当作参数或返回值。

这种灵活性就像一把双刃剑，一方面使得 JavaScript 蓬勃发展，无所不能，从 2013 年开始就一直蝉联最普遍使用的编程语言排行榜冠军；另一方面也使得它的代码质量参差不齐，维护成本高，运行时错误多。

而 TypeScript 的类型系统，在很大程度上弥补了 JavaScript 的缺点。

### 1)TypeScript 是静态类型

类型系统按照“类型检查的时机”来分类，可以分为动态类型和静态类型。

动态类型是指在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误。JavaScript 是一门解释型语言，没有编译阶段，所以它是动态类型，以下这段代码在运行时才会报错：

```js
let foo = 1;
foo.split(' ');
// Uncaught TypeError: foo.split is not a function
// 运行时会报错（foo.split 不是一个函数），造成线上 bug
```

静态类型是指编译阶段就能确定每个变量的类型，这种语言的类型错误往往会导致语法错误。TypeScript 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查，所以 **TypeScript 是静态类型**，这段 TypeScript 代码在编译阶段就会报错了：

```ts
let foo = 1;
foo.split(' ');
// Property 'split' does not exist on type 'number'.
// 编译时会报错（数字没有 split 方法），无法通过编译
```

你可能会奇怪，这段 TypeScript 代码看上去和 JavaScript 没有什么区别呀。

没错！大部分 JavaScript 代码都只需要经过少量的修改（或者完全不用修改）就变成 TypeScript 代码，这得益于 TypeScript 强大的类型推论，即使不去手动声明变量 `foo` 的类型，也能在变量初始化时自动推论出它是一个 `number` 类型。

完整的 TypeScript 代码是这样的：

```ts
let foo: number = 1;
foo.split(' ');
// Property 'split' does not exist on type 'number'.
// 编译时会报错（数字没有 split 方法），无法通过编译
```

### 2)TypeScript 是弱类型

类型系统按照“是否允许隐式类型转换”来分类，可以分为强类型和弱类型。

以下这段代码不管是在 JavaScript 中还是在 TypeScript 中都是可以正常运行的，运行时数字 `1` 会被隐式类型转换为字符串 `'1'`，加号 `+` 被识别为字符串拼接，所以打印出结果是字符串 `'11'`。

```js
console.log(1 + '1');
// 打印出字符串 '11'
```

TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性，所以**它们都是弱类型**。

作为对比，Python 是强类型，以下代码会在运行时报错：

```py
print(1 + '1')
# TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

若要修复该错误，需要进行强制类型转换：

```py
print(str(1) + '1')
# 打印出字符串 '11'
```

> 强/弱是相对的，Python 在处理整型和浮点型相加时，会将整型隐式转换为浮点型，但是这并不影响 Python 是强类型的结论，因为大部分情况下 Python 并不会进行隐式类型转换。相比而言，JavaScript 和 TypeScript 中不管加号两侧是什么类型，都可以通过隐式类型转换计算出一个结果——而不是报错——所以 JavaScript 和 TypeScript 都是弱类型。

> 虽然 TypeScript 不限制加号两侧的类型，但是我们可以借助 TypeScript 提供的类型系统，以及 ESLint 提供的代码检查功能，来限制加号两侧必须同为数字或同为字符串。这在一定程度上使得 TypeScript 向「强类型」更近一步了——当然，这种限制是可选的。

这样的类型系统体现了 TypeScript 的核心设计理念：在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型系统来提高代码的可维护性，减少可能出现的 bug。

## 总结

在利用六何分析法了解了什么是 TypeScript 以后，可以对它做一个简要的总结：

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目；
- TypeScript 是一门静态类型、弱类型的语言；
- TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性；
- TypeScript 可以编译为 JavaScript，然后运行在浏览器、Node.js 等任何能运行 JavaScript 的环境中；
- TypeScript 拥有很多编译选项，类型检查的严格程度由你决定；
- TypeScript 可以和 JavaScript 共存，这意味着 JavaScript 项目能够渐进式的迁移到 TypeScript；
- TypeScript 增强了编辑器（IDE）的功能，提供了代码补全、接口提示、跳转到定义、代码重构等能力；
- TypeScript 拥有活跃的社区，大多数常用的第三方库都提供了类型声明；
- TypeScript 与标准同步发展，符合最新的 ECMAScript 标准（stage 3）。
