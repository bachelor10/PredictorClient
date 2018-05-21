!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";var o=Object.prototype.hasOwnProperty,r="~";function i(){}function s(e,t,n,o,i){if("function"!=typeof n)throw new TypeError("The listener must be a function");var s=new function(e,t,n){this.fn=e,this.context=t,this.once=n||!1}(n,o||e,i),a=r?r+t:t;return e._events[a]?e._events[a].fn?e._events[a]=[e._events[a],s]:e._events[a].push(s):(e._events[a]=s,e._eventsCount++),e}function a(e,t){0==--e._eventsCount?e._events=new i:delete e._events[t]}function c(){this._events=new i,this._eventsCount=0}Object.create&&(i.prototype=Object.create(null),(new i).__proto__||(r=!1)),c.prototype.eventNames=function(){var e,t,n=[];if(0===this._eventsCount)return n;for(t in e=this._events)o.call(e,t)&&n.push(r?t.slice(1):t);return Object.getOwnPropertySymbols?n.concat(Object.getOwnPropertySymbols(e)):n},c.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var o=0,i=n.length,s=new Array(i);o<i;o++)s[o]=n[o].fn;return s},c.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},c.prototype.emit=function(e,t,n,o,i,s){var a=r?r+e:e;if(!this._events[a])return!1;var c,u,f=this._events[a],l=arguments.length;if(f.fn){switch(f.once&&this.removeListener(e,f.fn,void 0,!0),l){case 1:return f.fn.call(f.context),!0;case 2:return f.fn.call(f.context,t),!0;case 3:return f.fn.call(f.context,t,n),!0;case 4:return f.fn.call(f.context,t,n,o),!0;case 5:return f.fn.call(f.context,t,n,o,i),!0;case 6:return f.fn.call(f.context,t,n,o,i,s),!0}for(u=1,c=new Array(l-1);u<l;u++)c[u-1]=arguments[u];f.fn.apply(f.context,c)}else{var v,h=f.length;for(u=0;u<h;u++)switch(f[u].once&&this.removeListener(e,f[u].fn,void 0,!0),l){case 1:f[u].fn.call(f[u].context);break;case 2:f[u].fn.call(f[u].context,t);break;case 3:f[u].fn.call(f[u].context,t,n);break;case 4:f[u].fn.call(f[u].context,t,n,o);break;default:if(!c)for(v=1,c=new Array(l-1);v<l;v++)c[v-1]=arguments[v];f[u].fn.apply(f[u].context,c)}}return!0},c.prototype.on=function(e,t,n){return s(this,e,t,n,!1)},c.prototype.once=function(e,t,n){return s(this,e,t,n,!0)},c.prototype.removeListener=function(e,t,n,o){var i=r?r+e:e;if(!this._events[i])return this;if(!t)return a(this,i),this;var s=this._events[i];if(s.fn)s.fn!==t||o&&!s.once||n&&s.context!==n||a(this,i);else{for(var c=0,u=[],f=s.length;c<f;c++)(s[c].fn!==t||o&&!s[c].once||n&&s[c].context!==n)&&u.push(s[c]);u.length?this._events[i]=1===u.length?u[0]:u:a(this,i)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&a(this,t)):(this._events=new i,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=r,c.EventEmitter=c,e.exports=c},function(e,t,n){"use strict";function o(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}n.r(t);var r=function(e){return e.reduce(function(t,n,r){return r>=e.length-1?t:t+o(n,e[r+1])},0)},i=function(e){return e.map(function(e,t){return t})};var s=n(0);n.d(t,"SymbolCanvas",function(){return f}),n.d(t,"CanvasController",function(){return v});var a,c=(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},function(e,t){function n(){this.constructor=e}a(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),u=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},f=function(e){function t(t){var n=e.call(this)||this;return n.previousCoords=null,n.isPressingDown=!1,n.drewBeforeRelease=!1,n.initialClickPosition=null,n.onMouseDown=function(e){e.preventDefault(),n.initialClickPosition={x:e.offsetX,y:e.offsetY},n.isPressingDown=!0},n.onTouchStart=function(e){e.preventDefault(),n.initialClickPosition=n.normalizeTouchEventCoords(e),n.isPressingDown=!0},n.onMouseUp=function(e){n.onPressRelease(e)},n.onTouchEnd=function(e){n.onPressRelease(e)},n.onPressRelease=function(e){if(e.preventDefault(),n.isPressingDown=!1,n.previousCoords=null,!n.drewBeforeRelease)return n.drewBeforeRelease=!0,void n.emit("click",n.initialClickPosition);n.drewBeforeRelease=!1,n.emit("release")},n.normalizeTouchEventCoords=function(e){var t,n,o=e.target.getBoundingClientRect(),r=e.targetTouches[0],i=r.pageX,s=r.pageY;return n=s,{x:i-(t=o).left,y:n-t.top}},n.onTouchMove=function(e){n.isPressingDown&&(e.preventDefault(),n.drewBeforeRelease||(n.drewBeforeRelease=!0),n.handleNewCoordinates(n.normalizeTouchEventCoords(e)))},n.onMouseMove=function(e){n.isPressingDown&&(e.preventDefault(),n.drewBeforeRelease||(n.drewBeforeRelease=!0),n.handleNewCoordinates({x:e.offsetX,y:e.offsetY}))},n.handleNewCoordinates=function(e){var t=null===n.previousCoords?n.previousCoords:u({},n.previousCoords);n.emit("draw",u({},e),t),n.previousCoords=e},n.drawLine=function(e,t,o,r){void 0===o&&(o="#A0A3A6"),void 0===r&&(r=5),n.context.lineWidth=r,n.context.strokeStyle=o,n.context.beginPath(),n.context.moveTo(e.x,e.y),n.context.lineTo(t.x,t.y),n.context.closePath(),n.context.stroke()},n.drawCircle=function(e,t,o){void 0===t&&(t=10),void 0===o&&(o="white"),n.context.beginPath(),n.context.arc(e.x,e.y,t,0,2*Math.PI,!1),n.context.fillStyle="white",n.context.fill()},n.clearCanvas=function(){n.context.clearRect(0,0,n.element.width,n.element.height)},n.element=t,n.context=t.getContext("2d"),n.element.addEventListener("mousedown",n.onMouseDown),n.element.addEventListener("touchstart",n.onTouchStart),n.element.addEventListener("mouseup",n.onMouseUp),n.element.addEventListener("touchend",n.onTouchEnd),n.element.addEventListener("mousemove",n.onMouseMove),n.element.addEventListener("touchmove",n.onTouchMove),n}return c(t,e),t}(s),l={isErasing:!1,eraseRadius:10,minTraceCount:5,minTraceDistance:10,canvasColor:"white",canvasSelectedColor:"red",strokeWidth:5,strokeColor:"#A0A3A6",validateTrace:!0},v=function(e){function t(t,n){void 0===n&&(n=l);var s=e.call(this)||this;return s.traceIndex=0,s.buffer=[[]],s.handleDraw=function(e,t){var n,r,i,a;s.options.isErasing?(s.buffer=(n=s.buffer,r=e,i=s.options.eraseRadius,a=[],n.forEach(function(e){var t=[[]];e.forEach(function(e){o(r,e)>i?t[t.length-1].push(e):t[t.length-1].length>0&&t.push([])});var n=t.filter(function(e){return e.length>1});a=a.concat(n)}),a),0!==s.buffer.length&&0===s.buffer[s.buffer.length-1].length||s.buffer.push([]),s.traceIndex=s.buffer.length-1,s.redrawBuffer()):(s.buffer[s.traceIndex].push(e),null!==t&&s.canvas.drawLine(t,e))},s.validateTrace=function(e,t,n){return!s.options.validateTrace||!(e.length<t)&&!(r(e)<=n)},s.handleRelease=function(){var e=s.options,t=e.minTraceCount,n=e.minTraceDistance;s.validateTrace(s.buffer[s.buffer.length-1],t,n)||s.options.isErasing?(s.emit("release",s.buffer.slice()),s.traceIndex+=1,s.buffer.push([])):(s.buffer[s.buffer.length-1]=[],s.redrawBuffer())},s.handleCanvasClick=function(e){var t,n,r,i,a=(t=s.buffer,n=e,r=-1,i=Number.MAX_VALUE,t.forEach(function(e,t){var s=Number.MAX_VALUE;e.forEach(function(e){var t=o(e,n);t<s&&(s=t)}),s<i&&(r=t,i=s)}),r);a>=0&&s.emit("symbolclick",a)},s.redrawBuffer=function(){s.canvas.clearCanvas(),s.markTraceGroups(i(s.buffer),s.options.strokeColor,s.options.strokeWidth)},s.markTraceGroups=function(e,t,n){void 0===t&&(t=s.options.canvasSelectedColor),void 0===n&&(n=s.options.strokeWidth),e.forEach(function(e){var o=s.buffer[e];if(void 0===o)throw new Error("Attempted to mark trace not in buffer. groupIndex: "+e+". buffer: "+JSON.stringify(s.buffer));for(var r=0;r<o.length-1;r++)s.canvas.drawLine(o[r],o[r+1],t,n)})},s.canvas=t,t.on("draw",s.handleDraw),t.on("release",s.handleRelease),t.on("click",s.handleCanvasClick),s.options=n,s.traceIndex=0,s}return c(t,e),t}(s);"undefined"!=typeof window&&(window.SymbolCanvas=f,window.CanvasController=v)}]);