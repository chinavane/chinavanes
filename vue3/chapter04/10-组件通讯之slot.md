# 10.组件通讯之 slot

组件通讯中还有一种极为常见与重要的方式是slot插槽，而slot插槽既会存在父子组件的通讯也会存在子父组件的通讯场景。slot插槽主要划分成普通插槽、具名插槽、默认插槽、插槽默认值、作用域插槽等不同插槽模式。

## 1.普通插槽

原先介绍的父子组件通讯主要可以利用props进行属性设置与传递操作，但现在假若想要将一些HTML标签元素控制也一同进行属性设置，并且类似的属性内容十分的众多，那么利用props属性传递的模式就不是非常的合适。比如有一子组件Child，父组件想向其传递title、content等众多属性内容，但每个属性都会包含HTML标签元素，`<Quote title="<h1>标题</h1>" content="<p>内容</p>" ....../>`，试想一下子组件应该如何接收属性与控制属性。

现在我们可以直接利用插槽的方式轻松实现类似需求。可以在components目录中新建一个子组件Quote.vue，然后在App父组件中引入并使用quote子组件，并且在quote组件标签的主体区域中直接设置h1与p标签内容，这样就实现了一个slot插槽内容的父向子组件传递操作。

```vue
<script setup>
import Quote from "./components/Quote.vue"
</script>

<template>
  <quote>
    <h1>标题</h1>
    <p>内容</p>
  </quote>
</template>
```

现在只需要在子组件Quote.vue中利用`<slot></slot>`插槽标签进行父组件传递过来的插槽内容接收与渲染显示操作即可。运行程序后发现子组件中的slot组件实现的是插槽内容的占位与渲染显示作用。

```
<template>
  <slot></slot>
</template>
```

## 2.具名插槽

因为App父组件中Quote组件的插槽内容设置有h1与p两个内容，我们在子组件里甚至可以给其设置具体的name名称进行指定元素的接收，还可以在子组件中利用具名插槽控制插槽内容的位置显示。

```vue
<template>
	<!-- content内容放置到了title的前面 -->
  <slot name="content"></slot>
  <slot name="title"></slot>
</template>
```

那么在父组件中可以利用template块级代码与v-slot属性进行指定名称的插槽内容传递处理，template标签在页面渲染的时候本身并不会渲染，它只是包裹渲染元素内容而已。`v-slot:title`与`v-slot:content`已经明确对应的插槽名称是title与content，与子组件中的slot的name属性是一一对应关系，所以现在刷新页面将会看到的是content内容的位置是在title标题的上面，因为子组件的具名插槽不光控制了接收，还明确了显示的位置。

```vue
<script setup>
import Quote from "./components/Quote.vue"
</script>

<template>
  <quote>
    <template v-slot:title>
      <h1>标题</h1>
    </template>
    <template v-slot:content>
      <p>内容</p>
    </template>
  </quote>
</template>

```

## 3.默认插槽

原来是将h1与p标签都进行了v-slot指定名称的限定，但除了这两个插槽内容，在quote组件调用的主体内容中可能还会存在hr与span等其它的标签内容，而这部分内容并没有使用template与v-slot进行具名插槽的限定，那么在子组件中可以添加`<slot></slot>`进行渲染，而`<slot></slot>`插槽的内容将会把没有进行具名插槽的剩余内容进行统一的全部渲染操作，这是实现了默认插槽的目标。其实slot有一个默认的name值为default，它会对没有具体命名的插槽内容进行点位渲染处理。

```vue
<script setup>
import Quote from "./components/Quote.vue"
</script>

<template>
  <quote>
    <template v-slot:title>
      <h1>标题</h1>
    </template>
    <template v-slot:content>
      <p>内容</p>
    </template>
    <!-- 除了具名插槽，剩余部分都是默认插槽，包括hr与span -->
    <hr />
    <span>默认插槽</span>
  </quote>
</template>

```

```vue
<template>
  <slot name="content"></slot>
  <slot name="title"></slot>
  <!-- 其实slot有一个默认的name值为default -->
  <slot></slot>
</template>

```

## 4.插槽默认值

我们可以在子组件中直接设置一个slot，可以设置其name属性与具体的插槽内容，比如现在的subTitle与副标题标签内容的设置，如果这时候父组件中并没有进行subTitle的具名插槽内容传递页面将直接渲染刚刚设置的插槽默认值，也就是副标题的p标签内容。

```vue
<template>
  <slot name="content"></slot>
  <slot name="title"></slot>
  <!-- 如果父组件没有进行v-slot:subTitle副标题的内容传递，则会直接显示插槽默认值"副标题" -->
  <slot name="subTitle"><p>副标题</p></slot>
  <!-- 其实slot有一个默认的name值为default -->
  <slot></slot>
</template>

```

但如果在父组件中进行了具名插槽subTitle的内容设置与传递操作，比如现在的h2标签内容，那么最终页面显示的则是父组件传递的h2标签内容。

```vue
<script setup>
import Quote from "./components/Quote.vue"
</script>

<template>
  <quote>
    <template v-slot:title>
      <h1>标题</h1>
    </template>
    <template v-slot:content>
      <p>内容</p>
    </template>
    <!-- 除了具名插槽，剩余部分都是默认插槽，包括hr与span -->
    <hr />
    <span>默认插槽</span>
    <!-- 如果v-slot:subTitle进行了传递则显示传递的值 -->
    <template v-slot:subTitle>
      <h2>传递的副标题</h2>
    </template>
  </quote>
</template>
```

所以插槽的默认值是没有传递使用默认值，如果传递则使用传递值。

## 5.作用域插槽

父组件里写的插槽的内容需要使用子组件里的数据时将会应用到作用域插槽，这种插槽模式通常是在父组件中想要进行更多界面化控制的操作需求。

我们现在有一个App父组件，在这一组件中有一列表数据list，这个list列表数据可以进行属性传递，传递到App嵌套子组件List当中。

```vue
<script setup>
import { ref } from "vue"
import List from "./components/List.vue"
const list = ref(["Javascript", "Vue", "React", "Angular"])
</script>

<template>
  <List :list="list"></List>
</template>

```

List子组件将接收父组件传递的数组数据，并利用slot插槽标签进行循环，在循环过程中还可以对item与index等元素对象与下标内容进行slot标签组件的绑定操作。

```vue
<script setup>
defineProps(["list"])
</script>
<template>
  <slot v-for="(item, index) in list" :item="item" :index="index"></slot>
</template>
```

事实上List组件中的slot是获取到了item与index并进行了插槽内容的回传处理，item与index内容将由子组件利用插槽形式回传到父组件当中，而父组件则可以利用插槽调试方式进行直接子组件回传内容调用即可。

同普通插槽一样，利用template与v-slot结合进行插槽内容的获取，但v-slot将会获取到的是子组件回传回来的一个对象，可以利用对象解构的方式直接将item与index属性内容进行获取操作。既然获取到了对象，那么在父组件中可以进行任意布局形式的操控，比如通过取余实现类似斑马线的显示操作。

```vue
<List :list="list">
    <template v-slot="{ item, index }">
      <li v-if="index % 2">
        <b>{{ item }}</b>
      </li>
      <li v-else>
        <i>{{ item }}</i>
      </li>
    </template>
  </List>
```

