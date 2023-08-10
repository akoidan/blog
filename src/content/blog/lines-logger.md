---
title: "Lines-logger"
description: "Bring new era logs to your frontend"
date: "22 June 2023"
tags: 
 - frontend
 - logging
 - javascript
 - typescript
---

Have you faced these issues while developing your web app?
 - You add console.log to view information and then you have to delete just before you merge the PR?
 - Some bug app gets into production but you don't have any information and a minified file?
 - You don't want your logs to be in production build so you don't write them at all?
 - It's hard to understand what's going on on frontend because you don't have logs at all?
 - Using 3rd party logger is not a variant since the source of the messages are in some kind of third-party-lib.js?

Then [lines-logger](https://www.npmjs.com/package/lines-logger) is gonna be your saver! Make your logs look like this!
![logs example](/posts/lines-logger/browser-logging.png)

Lets see you [lines-logger](https://www.npmjs.com/package/lines-logger) solves all of these issues.
### Install 

Add the logger to your project with npm 
```bash
npm install lines-logger --save
```
Or by including a link to the header:
```html
<script src="https://cdn.jsdelivr.net/npm/lines-logger@2.1.2/lib/browser.js"></script>
```
### Create a logger factory
If you use javascript:
```javascript
var LoggerFactory = require('lines-logger').LoggerFactory; // import {LoggerFactory} from 'lines-logger';
var loggerFactory = new LoggerFactory();
var logger = loggerFactory.getLogger('tag');
```
If you use Typescript:
```typescript
import {Logger, LoggerFactory} from 'lines-logger';

let factory: LoggerFactory = new LoggerFactory();
let logger: Logger = factory.getLogger('tag');
```

###  Log anywhere in your code

```javascript
logger.log('Hello world')();
logger.debug('My array is {}, object is {}', [1,2,3], {1:1, 2:2})();
```
Pay attention to () in the end. `logger.log` returns a function that should be called, thus `console.log` is called from YOUR location instead of the library.
### Turn off log in production
Now let's turn off logs for productions. You can replace loggerFactory with this construction. Don't forget that you need inject `NODE_ENV` const into the build using your frontend builder like webpack or vite.
```js
new LoggerFactory(process.env.NODE_ENV === 'production' ? 'disable': 'trace');
```
### Check logs on production build
We've just disabled logs for prod. But it turned out that our build doesn't work as expected. We can turn on logs on already running server. Just expose your loggerFactory to a window scope and use:

You would probably like to expose loggerFactory to global scope (window). Thus in case of troubleshooting you can go to production site and turn on logs during runtime.
```js
var LoggerFactory = require('lines-logger').LoggerFactory;
var loggerFactory = new LoggerFactory(process.env.NODE_ENV === 'production' ? 'disable': 'trace');
window.loggerFactory = loggerFactory
```
Now you can open the browser, put the developer tools on and use:
```js
loggerFactory.setLogWarnings('trace')
```
This will enable logs for all of the loggers created with this factory

### What about timestamps?
If you need time for your logs, modern browser provide that out of the box. E.g. in chrome you can go to preferences -> console -> Show timestamps.

### Put raw objects right into the console!
Remember that modern browsers allow you to log objects as well as string. It's also possible with line-logger. Use positional arguments like logger.log('Hello {}', { text: 'world'} ) when you want a browser to paste an object instead of string. Remember chrome and some other browsers don't freeze this object, meaning it's live. So when you later change its value it automatically changes in the log (if it's not rendered yet). So if you need to paste just a simple text use es6 templates like `logger.log(`&acute;`Hello ${word}`&acute;`)` 
