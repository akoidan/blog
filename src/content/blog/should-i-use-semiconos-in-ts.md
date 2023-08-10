---
title: "Semicolons in typescript hollywar"
description: "Caught up in a debate with your buddies about using semicolons in JavaScript/TypeScript? Share this cool article with them."
date: "10 August 2023"
tags: 
 - typescript
 - javascript
 - patterns
---

## Introduction
When you're arguing about something specific, you want to back up your points. Think about semicolons – do they really make coding easier? Or are you spending extra time hitting that keyboard key for no good reason? Sometimes, programming languages offer us tools that we shouldn't use too much. It's like having a superpower – just because you can use it, doesn't mean you should use it all the time. For instance, think about using a "monkey-patch" to change how things work in your code. Is it a good idea?

## A Practical Example
Imagine we're using an old-fashioned method to create classes in JavaScript. Can you find the mistake in this code?

```ts
// @ts-nocheck
function mainFn() {
  (this as any).start = function() {
    return 'start'
  }

  (this as any).finish = function() {
    return 'finish'
  }

  this.finish()
}

new mainFn();
```
Did you spot the problem? If yes, great job! If not, check out this curious function:
```ts
  (this as any).start = function() {
    return 'start'
  }(this as any)
```
Adding a simple return statement can clear things up:
```ts
  (this).start = function() {
    return 3
  }(this)
  console.log(this.start)
```
If you spend a lot of time coding, you'll come across many examples like these.

## Conclusion
My advice? I recommend setting up ESLint with a simple rule:

### Explicit is better than implicit
