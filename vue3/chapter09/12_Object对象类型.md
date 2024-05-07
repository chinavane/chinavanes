# 12.Object 对象类型

在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

## 什么是接口

在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。

## 简单的例子

```ts
interface Person {
  name: string;
  age: number;
}

let guigu: Person = {
  name: '硅谷',
  age: 9,
};
```

上面的例子中，我们定义了一个接口 `Person`，接着定义了一个变量 `guigu`，它的类型是 `Person`。这样，我们就约束了 `guigu` 的形状必须和接口 `Person` 一致。

接口一般首字母大写，有的编程语言中会建议接口的名称加上 `I` 前缀。

定义的变量比接口少了一些属性是不允许的：

```ts
interface Person {
  name: string;
  age: number;
}

let guigu: Person = {
  name: '硅谷',
};

// 类型 "{ name: string; }" 中缺少属性 "age"，但类型 "Person" 中需要该属性。
// 在此处声明了 "age"。
```

多一些属性也是不允许的：

```ts
interface Person {
  name: string;
  age: number;
}

let guigu: Person = {
  name: '硅谷',
  age: 9,
  gender: '男',
};

// 不能将类型“{ name: string; age: number; gender: string; }”分配给类型“Person”。
// 对象文字可以只指定已知属性，并且“gender”不在类型“Person”中。
```

可见，赋值的时候，变量的形状必须和接口的形状保持一致。

## 可选属性

有时我们希望不要完全匹配一个形状，那么可以用可选属性：

```ts
interface Person {
  name: string;
  age?: number;
}

let guigu: Person = {
  name: '硅谷',
};
```

```ts
interface Person {
  name: string;
  age?: number;
}

let guigu: Person = {
  name: '硅谷',
  age: 9,
};
```

可选属性的含义是该属性可以不存在。

这时**仍然不允许添加未定义的属性**：

```ts
interface Person {
  name: string;
  age?: number;
}

let guigu: Person = {
  name: '硅谷',
  age: 9,
  gender: '男',
};

// 不能将类型“{ name: string; age: number; gender: string; }”分配给类型“Person”。
// 对象文字可以只指定已知属性，并且“gender”不在类型“Person”中。
```

## 任意属性

有时候我们希望一个接口允许有任意的属性，可以使用如下方式：

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let guigu: Person = {
  name: '硅谷',
  gender: '男',
};
```

使用 `[propName: string]` 定义了任意属性取 `string` 类型的值。

需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: string;
}

let guigu: Person = {
  name: '硅谷',
  age: 9,
  gender: '男',
};

// 不能将类型“{ name: string; age: number; gender: string; }”分配给类型“Person”。
//  属性“age”与索引签名不兼容。
//    不能将类型“number”分配给类型“string”。
```

上例中，任意属性的值允许是 `string`，但是可选属性 `age` 的值却是 `number`，`number` 不是 `string` 的子属性，所以报错了。

另外，在报错信息中可以看出，此时 `{ name: '硅谷', age: 9, gender: '男' }` 的类型被推断成了 `{ [x: string]: string | number; name: string; age: number; gender: string; }`，这是联合类型和接口的结合。

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型：

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let guigu: Person = {
  name: '硅谷',
  age: 9,
  gender: '男',
};
```

## 只读属性

有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 `readonly` 定义只读属性：

```ts
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

let guigu: Person = {
  id: 89757,
  name: '硅谷',
  gender: '男',
};

guigu.id = 9527;

// 无法分配到 "id" ，因为它是只读属性。
```

上例中，使用 `readonly` 定义的属性 `id` 初始化后，又被赋值了，所以报错了。

**注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**：

```ts
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

let guigu: Person = {
  name: '硅谷',
  gender: '男',
};

guigu.id = 89757;

// 类型 "{ name: string; gender: string; }" 中缺少属性 "id"，但类型 "Person" 中需要该属性。
// 在此处声明了 "id"。
// 无法分配到 "id" ，因为它是只读属性。
```

上例中，报错信息有两处，第一处是在对 `guigu` 进行赋值的时候，没有给 `id` 赋值。

第二处是在给 `guigu.id` 赋值的时候，由于它是只读属性，所以报错了。
