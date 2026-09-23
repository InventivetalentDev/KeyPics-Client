[![K](https://key.pics/key/K.svg?size=128) ![E](https://key.pics/key/E.svg?size=128) ![Y](https://key.pics/key/Y.svg?size=128) ![.pics](https://key.pics/key/.pics.svg?shape=wide&size=128)](https://key.pics)

# Quick, Simple, Consistent, Scalable Key & Button Icons

JavaScript client for [Key.Pics](https://key.pics/), a service that renders keyboard key and mouse button icons as SVG or PNG.
It was originally intended for visualizing inputs of games and other software to their users.

For example:  
![](https://key.pics/key/ctrl.svg?size=100&shape=wide)+![](https://key.pics/key/C.svg?size=50) to copy the selected text  
![](https://key.pics/key/ctrl.svg?size=100&shape=wide)+![](https://key.pics/key/V.svg?size=50) to paste the copied text

## Installation

[![NPM](https://nodei.co/npm/key.pics.png)](https://nodei.co/npm/key.pics/)

```
npm install --save key.pics
```

or load it from a CDN:

```html
<script src="https://unpkg.com/key.pics/dist/key.pics.min.js"></script>
<!-- or -->
<script src="https://key.pics/client/key.pics.min.js"></script>
```

## Usage

Add `<i class="keypics">` elements to your page. They are replaced automatically once the document has loaded.

```html
<i class="keypics">K</i>
<i class="keypics" data-color="blue" data-shape="wide">ctrl</i>
<i class="keypics" data-mode="fetch" data-color="green">E</i>
<i class="keypics" data-type="mouse" data-label="x2">right</i>
<i class="keypics" data-font="RobotoMono" data-font-style="Bold">far:smile</i>
```

The element's text is the key label (or `left`, `right`, `middle`, `none` for mouse buttons).
Labels starting with `fas:`, `far:` or `fab:` render a [Font Awesome](https://fontawesome.com/icons) icon instead of text.

Two attributes control the client itself:

| Attribute   | Values                     | Description                                                                 |
|-------------|----------------------------|-----------------------------------------------------------------------------|
| `data-type` | `key` (default), `mouse`   | Which kind of icon to render.                                               |
| `data-mode` | `link` (default), `fetch`  | `link` replaces the element with an `<img>`. `fetch` downloads the SVG and inlines it, so it can be styled with CSS. |

Every other `data-*` attribute is passed to the image API as a query parameter, so `data-label-color="red"` becomes `?labelColor=red`.
Common parameters are `size`, `shape` (`square`, `wide`, `tall`), `style` (`classic`, `flat`, `plain`), `color`, `label-color`, `font`, `font-style` and `font-size`.
See [key.pics](https://key.pics) for the full list.

### Programmatic use

```js
import { applyIcon, autoApply, getKeyUrl, getMouseUrl } from "key.pics";

// Process elements added after page load
autoApply(document.querySelector("#help"));
applyIcon(document.querySelector("i.keypics"));

// Or just build URLs
getKeyUrl("ctrl", { shape: "wide", color: "blue" }); // https://key.pics/key/ctrl.svg?shape=wide&color=blue
getMouseUrl("left", { label: "x2" });              // https://key.pics/mouse/left.svg?label=x2
```

When loaded through a `<script>` tag the same functions are available on `window.KeyPics`.

## Development

```
npm install
npm run build   # writes dist/ (IIFE, minified IIFE with source map, ESM and CommonJS builds)
npm test
```

`test.html` is a small manual test page; open it after building.
