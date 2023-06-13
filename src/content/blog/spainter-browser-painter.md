---
title: "Spainter browser painter"
description: "Draw and share images directly from the browser. Integrate painter into your web application"
date: "13 June 2023"
tags:
 - painter
 - image-upload
---
### Image sharing

Check this webapp [spainter.akoidad.com](https://spainter.akoidan.com/). You can easily draw and share an image with anyone in the world. Images are blazingly fast using D1 storage from Cloudflare.  
<img src="/posts/spainter/spainter.png"/>

### Integrating into you server:
- If you use bundler like webpack:

```bash
npm i spainter lines-logger
```

```javascript
import Painter from 'spainter';
import 'spainter/index.sass'; // you can import index.css if you don't have sass, ensure that you copy the fonts from the directory as well to production. Set `$FontelloPath: "../node_modules/spainter/font"`
import {LoggerFactory} from 'lines-logger'; // yarn install lines-logger
const containerPainter = document.createElement('div');
document.body.appendChild(containerPainter);
const p = new Painter(containerPainter, {logger: new LoggerFactory().getLogger('spainter')});
```
If you use [fontello](http://fontello.com/) in your server, you can generate single font importing [no-fonts.sass](no-fonts.sass), joining it with [config.json](config.json)

- If you use server rendering and cdn:

```html
<script src="https://cdn.jsdelivr.net/npm/spainter@1.2.10/index.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/spainter@1.2.10/index.css"/>
<div id="containerPainter"></div>
<script>
var p = new Painter(containerPainter);
</script>
```
Target the latest version instead of `1.2.10` [![npm version](https://img.shields.io/npm/v/spainter.svg)](https://www.npmjs.com/package/spainter)
