---
title: "Vue class based components"
description: "Save time while coding with class-based approach for vue"
date: "6 June 2023"
tags: 
 - vue
 - patterns
---
This project features:
 - Production-ready Vue3 template that I personally used for commercial projects.
 - ESlint with strict rules that don't conflict with each other
 - Cypress test with configured CI/CD pipelines.
 - Vite with blazing-fast reload, Sass and Vuetify
 - Fully type-saved class-based approach on typescript including components and vuex modules.
 
Make your code look like this:
```js
import { Vue, Component, Prop, Watch, Emit, Ref } from 'vue-property-decorator'

@Component
export class MyComp extends Vue {

  @Ref
  button: HTMLInputElement;

  @Prop() readonly propA!: number;

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }

  @Emit()
  changedProps() {}
}
```
Clone this repo [akoidan/vue3-vite-vue-class-component](https://github.com/akoidan/vue3-vite-vue-class-component)
and check the docs there
