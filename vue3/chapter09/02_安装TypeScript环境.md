# 02.安装 TypeScript 环境

## 1)不管浏览器环境还是 Node 环境都无法运行 TypeScript

TypeScript 程序无法在浏览器或者是 NodeJs 的环境中直接运行，这一点可以通过尝试来证实。可以先创建一个 vue3-book-typescript-basic/typescript-setup 的空目录，然后在此目录下新建一个 TypeScript 的程序文件 helloWorld.ts，该文件中只有一句 JavaScript 的代码，因为之前已经强调 TypeScript 是 JavaScript 的超集，所以 JavaScript 的代码在 TypeScript 都可以正常的运行，不过程序文件的后缀名不再是.js 而是变成了.ts，我们约定使用 TypeScript 编写的文件以 `.ts` 为后缀。

helloWorld.ts

```typescript
const hi: string = '你好，这是TypeScript程序文件';
console.log(hi);
```

现在再新建一个 index.html 网页，并在该网页中利用 script 标签引入 helloWorld.ts 程序文件，然后打开页面查看效果，可以打开浏览器调试工具的 Console 控制台，则会看到有错误内容显示，已经表明无法正常解析 TypeScript 程序类型的文件。

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeScript</title>
  </head>

  <body>
    <script src="./helloWorld.ts"></script>
  </body>
</html>
```

![image-20220513102247588](http://qn.chinavanes.com/qiniu_picGo/image-20220513102247588.png)

或许有人想看看利用 node 环境是否能够运行刚才的 helloWorld，所以可以尝试在终端运行命令：

```
node helloWorld.ts
```

然后将终端中查看到有类似的错误信息显示，表明在 node 环境下 TypeScrpt 程序文件也无法直接正常运行。

![image-20220513103038983](http://qn.chinavanes.com/qiniu_picGo/image-20220513103038983.png)

## 2)安装 TypeScript 环境

我们需要在操作系统全局进行 TypeScript 命令行工具地安装，方法如下：

```bash
npm install -g typescript
```

以上命令会在全局环境下安装 `tsc` 命令，安装完成之后，我们就可以在任何地方执行 `tsc` 命令了。

编译一个 TypeScript 文件很简单：

```bash
tsc helloWorld.ts
```

这时候在同级目录下将会产生一个 helloWorld.js 程序文件，代码内容现在已经被编译成：

helloWorld.js

```js
var hi = '你好，这是TypeScript程序文件';
console.log(hi);
```

那么在 html 页面中也不能够再进行.ts 程序文件的直接引入，而是需要替换成编译以后的.js 程序文件，这时候相信任何浏览器都能够正常运行当前的程序。

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeScript</title>
  </head>

  <body>
    <script src="./helloWorld.js"></script>
  </body>
</html>
```

如果你还想用 node 进行测试，同样的也可以直接运行.js 的程序文件，运行的结果也将很正常。

```bash
node helloWorld.js
```

所以，TypeScript 程序的运行需要环境的支持，虽然它来源于 JavaScript，但它最终还是要归结于 JavaScript 才能被各种运行模式所支持。
