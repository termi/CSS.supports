/* CSS.supports polyfill | @version 0.3 | MIT License | github.com/termi/CSS.supports */
void function(){"use strict";
var j=!0,k=null,l=!1;
a:{var m=function(b){function d(){var b=p.length-1;0>b&&(t=l);return p[b]}function i(b){var a=p.length-1;0>a&&(t=l);e=p[a]=b}function q(a,e,c,i){r=c||f;var d,g,h;i&&r--;do c=b.charAt(++r),i&&(h=c&&(d||g),"'"==c||'"'==c?h=d=!d:d||(!g&&"("==c?h=g=j:g&&")"==c&&(g=l,h=j)));while(h||c&&(!a||c!=a)&&(!e||c==e));if(a==k||c==a)return r}b||m.a();var b=m.b(b+""),p=[],g,e,t=j,v,h,x,w,u,c=41,a,f=-1,r,y=b.length;for(p.push(void 0);++f<y;){1==a?c=40:2==a||4==a||32==a?c=41:64==a?c=39:16==a?c=103:8==a&&(c=16);g=b.charAt(f);
if(c&1&&"n"==g&&"not"==b.substr(f,3))a=1,f+=2;else if(c&2&&"a"==g&&"and"==b.substr(f,3))a=2,f+=2;else if(c&4&&"o"==g&&"or"==b.substr(f,2))a=4,f++;else if(c&32&&"("==g&&q("("," "))f=r-1,a=32;else if(c&64&&")"==g&&1<p.length)a=64;else if(c&8&&"("==g&&(h=q(k," "))&&q(":",k,h)){f=r-1;x=b.substr(h,f-h+1).trim();h=0;a=8;w=k;continue}else if(c&16&&(h=q(k," "))&&q(")",k,h,j))f=r,w=b.substr(h,f-h).trim(),h=0,a=16,g=" ";else if(" "==g)continue;else a=0;(!t||!g||!(a&c))&&m.a();t=j;if(4==a)e===l?(i(),u=l):e===
j&&(u=j);else if(!u)if(e=d(),1==a)v=j;else if(2==a)e===l?u=j:i();else{if(e!==l||a&96)32==a?p.push(void 0):64==a?(u=l,p.pop(),void 0!==d()&&(e=!!(e&d())),v=l):16==a&&(i(n(x,w)),v&&(e=!e),v=l,w=x=k);i(e)}}(!t||void 0===e||1<p.length)&&m.a();return e},s=this,n;s.CSS||(s.CSS={});n=s.CSS.supports;!n&&s.supportsCSS&&(n=s.CSS.supports=s.supportsCSS,s.__proto__&&delete s.__proto__.supportsCSS);if("function"===typeof n){if(!function(){try{n.call(s,"(a:a)"),n=k}catch(b){return n=n.bind(s),j}}.call(k))break a}else n=
function(b,d,i,q){i=(i||"").replace(this,b);if(b=i in d)d[i]=q,b=d[i]==q;d.cssText="";return b}.bind(/(-)([a-z])/g,function(b,d,i){return i.toUpperCase()},s.document.createElement("_").style);m.a=function(){throw Error("SYNTAX_ERR");};m.b=function(b){return b.replace(this," ")}.bind(/[\s\r\n]/g);s.CSS.supports=function(b,d){if(!arguments.length)throw Error("WRONG_ARGUMENTS_ERR");return 1==arguments.length?m(b):n(b,d)};s=k}
}.call(this);
