---
title: "How to write clean code with vue3 composition api"
description: "Bring separation of concern on your frontend!"
date: "1 Oct 2023"
tags: 
 - vue3 
 - patterns
---
How often we all face the code it's impossible to support? But how to write a clean one?

<img src="/posts/css-approach/who-wrote-that-code.png" style="max-height: 400px"/>


## Use types with typescript, avoid any
**_Explicit is better than explicit_**

I suggest we always define types, when it's easier sometimes to write any, it's more time-costy for people to support this code, or using its api. The cost doesn't cover of saving 10seconds of time.

## Overcomplicated components
**_Keep it simple stupid_**

The component should ideally fit into the screen of your laptop. It's hard to maintain big component, use them or fix bugs. If it's huge, it should be either simplified, either decoupled by logic to multiple components.


## Using shadow state
**_Single Source of Truth_**

Shadow state is considered any state that can be calculated from another state. E.g. you use <question-answer-selection and you define selectionState on the component itself and on component that uses it

## Use function style
**_KISS_**
Vue is not React, and you don't need to write arrow functions, just because you come from react word and you want to avoid bugs with binding `this`.
 - const making code harder to debug (no fn name)
 - you spend more time writting ` = ` and ` => `
 - and function looks harder to read. This especially comes when your functon is a factory that returns another function and you define types on top.

**_Before_**
```ts
const onUpdate = (value: string): void => {
```
**_After_**
```ts
function onUpdate(value: string): void {
```


## Define props and emits with interfaces
Always define props with generic interfaces instead of arguments. If you need to provide default values, do NOT use computed, use `withDefaults` util.

**_Before_**
```ts
const props = defineProps({
  className: String
});
const emit = defineEmits(["update:selection"]);
```

**_After_**
```ts
const props = withDefaults(defineProps<{
  className: string;
}>(), {
  className: 'primary',
});

const emit = defineEmits<{
  'update:selection': [value: number];
}>();
```


## Decouple your code
Not everything should be inside a component. E.g. the function below that generates a unique id, is an ideal candidate to move it to utils function.

**_Before_**:
```vue
<script setup>
  let myId = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 5) {
    myId += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
</script>
<template>
 <div :id="myId">Text</div>
</template>
```
**_After_**:
```vue
<script setup>
import makeid from '@/utils'
const myId = makeid();
</script>
<template>
 <div :id="myId">Text</div>
</template>
```
## Remove unnecessary variables
If variables is used only once and you declare the variable that uses it beneath it, it's a great sign that it can be inlined. Ofc there could be exceptions. E.g. code within single line is too complex to make it a single instruction. 

**_Before_**:
```ts
const componentId = makeId();
const optionElIdPrefix = `${componentId}-prefix-`;
```

**_After_**:
```ts
const optionElIdPrefix = `${makeId()}-prefix-`;
```

## Stop using // eslint-disable-line
If you spot an eslint error and you don't know how to fix it, this is not a sign that you should disable it. Google or ask chatGPT, it literally takes 30 seconds.

## Move some complicated code to directives

**_Before_**:
```vue
<div 
  @keydown.up.prevent.stop="move('vertical', -1)"
  @keydown.down.prevent.stop="move('vertical', 1)"
  @keydown.left.prevent.stop="move('horizontal', -1)"
  @keydown.right.prevent.stop="move('horizontal', -1)" 
/>
```

**_After_**:
```vue
<div v-move-selection="move"/>
```

Ofcourse the directive below looks overloaded, but it's fully decoupled from implementation, which makes the api so easy to use. Thus you follow encapsulation pattern.
**_directive.ts_**
```ts
const app: VueApp = addDirectives(createApp(App))
app.directive('move-selection', {
  mounted(el: CurrentElement, binding: DirectiveBinding<Function>): void {
    const listener = (event: KeyboardEvent): void => {
      const {key} = event;
      if (key === 'ArrowUp') {
        binding.value('vertical', -1);
      } else if (key === 'ArrowDown') {
        binding.value('vertical', 1);
      } else if (key === 'ArrowLeft') {
        binding.value('horizontal', -1);
      } else if (key === 'ArrowRight') {
        binding.value('horizontal', 1);
      }
    };
    el.addEventListener('keydown', listener);
    el.keydownListener = listener;
  },
  beforeUnmount(el: CurrentElement): void {
    if (el.keydownListener) {
      el.removeEventListener('keydown', el.keydownListener);
      delete el.keydownListener;
    }
  },
});
```


## Separate api calls 
In 2023 I no longer use axios, furthermore I never define my api inside components or vuex/pinia actions. We still follow separation of concerns principle which dictates that api implementation should be isolated.

Typical scenario what I usually see is call urls are scattered across all files, making it impossible to maitain.  
**_Before_**:
```ts
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async updatePreferences(N) {
      const auth = useAuthStore()
      this.preferences = await axios.post('/preferences', {
        notifications: false,
      })
    },
  },
})
```
**_After_**:
```ts
export class Api {
  private readonly httpWrapper: HttpWrapper;

  constructor(backendUrl: string) {
    this.httpWrapper = new HttpWrapper(backendUrl);
  }

  public async updatePreferences(body: PreferencesDto): Promise<PreferencesDto> {
    return this.httpWrapper.post({
      url: '/settings',
      body
    });
  }
}
```

```ts
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async updatePreferences(data) {
      this.preferences = await api.updatePreferences(data);
    }
  },
})
```

Bonus tip, in this case if your API is not ready yet and you want to mock it, you can easily do so by importing json fixtures to `api` class, this way you can change your code without any need to rewrite you components.

```ts
import preferenceFixture from '@/mocks/preference.json';

export class Api {
  private readonly httpWrapper: HttpWrapper;

  constructor(backendUrl: string) {
    this.httpWrapper = new HttpWrapper(backendUrl);
  }

  public async updatePreferences(body: PreferencesDto): Promise<PreferencesDto> {
    return preferenceFixture;
  }
}
```


## Define css colors inside sass or css variables
**_Before_**:
```css
div {
    color: #4b5563;
}
```
**_After_**:

_variables.css_
```css
:root {
  --main-bg-color: #4b5563;
}
```
_component.css_
```css
div {
    color: var(--main-bg-color);
}
```


## Define complex vue optional classes within script in object-way:
use object style class, it provides you with optional classes
JS code should be in script. Any js evaluations, whether this string concatenation, string triming, ternary operator, and operator is considered js evaluation.
Evaluating js directly in template leads to poor readability and hard time using vue devtools, since state is not directly mapped to template.

**_Before_**:
```vue
<div class="`wrapper ${props.selection.has(id) ? 'selectedClass' : ''} ${index === activeIndex.value ? 'activeClass': ''}`.trim()"/>
```
**_After_**:
```vue
<script lang="ts">
function getClass(id: string, index: number): Record<string, boolean> {
  return { 
    wrapperClass: true,
    selectedClass: props.selection.has(id), 
    activeClass:  index === activeIndex.value, 
  }; 
}
</script>
<template>
  <div :class="getClass(id)"/>
</template>
```

## Double quotes
Many people use single quotes to define string. But this is not entirely true in typescript. Typescript comes from C#, and follows it styles. Double quotes gives you 2 benefits:
 - you don't need to escape a single quote, which you use a lot more than double as your data
 - you use single style inside `<style`, inside `<template` and while defiying `<script lang="ts` which is a lot nicer

**_Before_**:
```vue
<template>
  <error-text :error="error"/>
</template>
<script setup lang="ts">
import {
  ref,
} from 'vue';

const error = ref('');
</script>
<style>
div {
  color: "black"
}
</style>
```

**_After_**:
```vue
<template>
  <div :error="error"/>
</template>
<script setup lang="ts">
import {
  ref,
} from "vue";

const error = ref("");
</script>
<style>
div {
  color: "black"
}
</style>
```

## Use script before template and style
This way you combine styles and html together by making it more readable

