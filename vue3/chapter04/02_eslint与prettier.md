# 02.eslint与prettier

## 1)ESLint语法检测

ESLint 是一个用来识别 ECMAScript、JavaScript 并且按照规则给出报告的代码检测工具，ESLint 就是一个工具，而且是一个用来检查代码的工具。代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。但JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。所以ESLint 这样的工具可以让程序员在编码的过程中发现问题，而不是在执行的过程中发现问题。

ESlint有其自身的特点，首先它不会推荐任何编码风格，因为不同的公司与团队开发代码的风格与习惯都是各不相同的，所以ESLint的规则是自由的。用户可以进行ESLint规则的自定义，并且将其结果设置成warn警告或者error错误模式。而且配置的每条规则都是各自独立的，可以根据项目情况选择开启与关闭。ESLint还有其它更多的特点，可以在应用过程中逐步的发掘。

回看当前项目，在打开main.js、App.vue等程序文件的时候，默认情况下没有任何的提示与问题。这是因为当前文件中的代码默认符合ESLint代码检测的标准，但是假若我们打开.eslintrc.cjs配置文件并进行修改，给当前项目的ESLint添加自定义的校验规则rules，并且强制约束项目中代码的引号需要是单引号，如果检测失败，则报错误提示。当然，如果想要降低报错等级，可以将error修改成warn警告配置，那么出现的提示则是警告信息。

```js
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier"
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  // 以下是新添加的ESLint校验规则
  rules: {
    quotes: ["error", "single"] // 约束项目中代码的引号需要是单引号，如果检测失败，则报错误提示
  }
}

```

因为main.js等程序文件中引号代码默认都是双引号，所以现在在vscode编辑器中则会出现红色波浪线的错误，因为现在的代码要求是单引号，这就是ESLint在进行了语法的校验操作。至于ESLint的更多语法校验规则可以查看官网地址：https://eslint.org/docs/latest/rules/。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221020151752000.png" alt="image-20221020151752000" style="zoom:33%;" />

现在可以打开命令终端，输入在README.md说明文档中查看到的语法检测命令行`npm run lint`则可以看到类似下图的ESLint检测报告，方便开发人员对指定文件指定代码行作进一步的修正处理。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221020152239268.png" alt="image-20221020152239268" style="zoom:33%;" />

## 2)Prettier代码格式化

不过在ESLint的检测报告中在众多的文件中都发现了双引号的代码问题，那么开发人员是否需要对发现的代码进行一行一行的逐一修改呢？显然这样的开发效率是很有问题的，所以需要利用vscode的prettier插件进行代码格式化操作。可以查看.prettierrc.json配置文件，默认并没有任何具体的配置项代码内容，只有一个`{}`空对象，可以添加singleQuote属性，并设置为true。

```json
{
    "singleQuote": true,
}
```

然后打开main.js等程序文件，点击鼠标右键调出`使用...格式化文档`菜单，点击该菜单项则会出现`选择格式化程序`下拉菜单，只需要选择Prettier进行代码格式化操作即可，这时候将会把所有的双引号代码都自动修改为单引号，这时的代码则会符合ESLint代码检测工具的需求。

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221020152411575.png" alt="image-20221020152411575" style="zoom: 33%;" />

<img src="http://qn.chinavanes.com/qiniu_picGo/image-20221020152440238.png" alt="image-20221020152440238" style="zoom:33%;" />