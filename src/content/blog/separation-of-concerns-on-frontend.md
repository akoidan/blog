---
title: "Separation of concerns for frontend"
description: "Write clean code for Vue, Angular, React. Placing html and content to templates, logic to javascript and styles to css"
date: "13 June 2023"
tags: 
 - patterns 
 - ecosystem
---
How often we all face the code it's impossible to support? But how to write a clean one?

<img src="/posts/css-approach/who-wrote-that-code.png" style="max-height: 400px"/>


## Remove css from html
Let's view the following code and try to spot an issue:
```html
<div class="mx-auto flex max-w-3xl flex-col items-center justify-between sm:flex-row">
  <a style="background-color: red; font-size: 14px">Skip to content</a>
</div>
```
- Purge everything css related from html. It's much easier to understand dom tree where you only see the relevant content.
  In 2023 you can use css preprocessors and pseudo selectors.
- Remove numerous css classes from the elements. Most of frameworks dictates you vice versa, and you end up with.
```html
<div class="skip-content-wrapper">
  <a>Skip content</a>  
</div>
```
```css
.skip-content-wrapper {
  @apply mx-auto flex max-w-3xl flex-col items-center justify-between sm:flex-row
}
.skip-content-wrapper a {
  background-color: red;
  font-size: 14px
}
```
## Remove assets from html
Let's view the following code and try to spot an issue:
```html
<button>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="menu-icon"
  >
    <line x1="7" y1="12" x2="21" y2="12" class="line"></line>
    <line x1="3" y1="6" x2="21" y2="6" class="line"></line>
    <line x1="12" y1="18" x2="21" y2="18" class="line"></line>
    <line x1="18" y1="6" x2="6" y2="18" class="close"></line>
    <line x1="6" y1="6" x2="18" y2="18" class="close"></line>
  </svg>
</button>
```
- All assets should be moved outside of html structure, this include SVGs and etc. Use your bundler if you want to pack an asset, but it's also ok to leave it external, since we have http2.
```vue
<template>
  <button v-html="MySvg"/>
</template>
<script>
  import MySvg from "/public/mysvg.svg";
</script>
```
## Remove html from javascript
Let's view the following code and try to spot an issue:
#### MyComponent
```vue
<template>
  <nav>
    <ul>
        <li v-for="link in navbar">
          <a :href="link.link">
            <icon :content="link.icon"/>
            {{link.title}}
          </a>
        </li>
    </ul>
  </nav>
</template>
<script>
export default {
  data() {
    navbar: [
      {title: 'Home', link: '/', icon: 'home'},
      {title: 'About', link: '/about', icon: 'about'},
      {title: 'Search', link: '/search', icon: 'lens'},
      {title: 'Help', link: '/help', icon: 'question-mark'},
    ]
  },
}
</script>
```
- Javascript code should only contain logic, not string data for content. You can create a new component in order to avoid data duplication.

#### MyLink
```vue
<template>
  <li>
    <a :href="link">
      <icon :content="icon"/>
      {{ title }}
    </a>
  </li>
</template>
<script>
export default {
  props: ['icon', 'link', 'title'],
}
</script>
```
#### MyComponent
```vue
<template>
  <nav>
    <ul>
      <MyLink  link="/" title="Home" icon="home"/>
      <MyLink  link="/about" title="About" icon="about"/>
      <MyLink  link="/search" title="Search" icon="lens"/>
      <MyLink  link="/help" title="Help" icon="question-mark"/>
    </ul>
  </nav>
</template>
```
