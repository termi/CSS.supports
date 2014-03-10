CSS.supports

A polyfill to add window.CSS.supports JavaScript API support to browsers without support @supports. It uses window.supportsCSS if available.

window.CSS.supports is the proposed object defined in the [CSS Conditional Rules Module Level 3](http://www.w3.org/TR/css3-conditional/) specification. Opera added support for window.supportsCSS() in version 12.10 of the browser. Though @support is enabled in Firefox 17.0 behind a flag, the JavaScript API is not yet available.

Other browsers have not yet added support ([check current support tables](http://caniuse.com/#feat=css-featurequeries)).

This polyfill bring both syntax of CSS.supports:
```
interface CSS {
  boolean supports(DOMString property, DOMString value);
  boolean supports(DOMString declaration);
}
```
so you can write:
```javascript
CSS.supports("(display: none) and(display:flex)") == (CSS.supports("display", "none") && CSS.supports("display", "flex"))
```
