/* CSS.supports polyfill | @version 0.1 | MIT License | github.com/termi */
void function(){"use strict";
function a(b,e,c){return c.toUpperCase()}function d(b,e){var b=(b||"").replace(f,a),c=b in g;c&&(g[b]=e,c=g[b]==e);g.cssText="";return c}function h(){if(!arguments.length||1==arguments.length)throw Error("WRONG_ARGUMENTS_ERR");return d.apply(null,arguments)}var i=this;
if(!(i.CSS&&"function"===typeof i.CSS.supports||!i.document&&(!testElement||!testElement.style)))if(i.CSS||(i.CSS={}),i.supportsCSS)i.CSS.supports=i.supportsCSS,delete i.supportsCSS;else{var f=/(-)([a-z])/g,g=i.document.createElement("_").style;i.CSS||(i.CSS={});i.CSS.supports=h;g.cssText="";i=null}
}.call(this);