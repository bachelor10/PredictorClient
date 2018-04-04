var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function calculateTouchPosistion(rectangle, pageOffsetX, pageOffsetY) {
        return {
            x: pageOffsetX - rectangle.left,
            y: pageOffsetY - rectangle.top
        };
    }
    exports.calculateTouchPosistion = calculateTouchPosistion;
    function distance(fromPoint, toPoint) {
        return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2));
    }
    exports.distance = distance;
    function removeOverlapping(buffer, compareCoords, radius) {
        var newBuffer = [];
        buffer.forEach(function (trace) {
            var filteredTrace = [[]];
            var currentTrace = 0;
            trace.forEach(function (coords) {
                if (distance(compareCoords, coords) > radius) {
                    filteredTrace[filteredTrace.length - 1].push(coords);
                }
                else if (filteredTrace[filteredTrace.length - 1].length > 0) {
                    filteredTrace.push([]);
                }
            });
            var filteredAndRemovedTrace = filteredTrace.filter(function (arr) { return arr.length > 0; });
            newBuffer = newBuffer.concat(filteredAndRemovedTrace);
        });
        return newBuffer;
    }
    exports.removeOverlapping = removeOverlapping;
});
define("index", ["require", "exports", "utils", "../node_modules/eventemitter3/index"], function (require, exports, utils, EventEmitter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SymbolCanvas = (function (_super) {
        __extends(SymbolCanvas, _super);
        function SymbolCanvas(element) {
            var _this = _super.call(this) || this;
            _this.previousCoords = null;
            _this.isPressingDown = false;
            _this.drewBeforeRelease = false;
            _this.onMouseDown = function (event) {
                event.preventDefault();
                _this.isPressingDown = true;
            };
            _this.onTouchStart = function (event) {
                event.preventDefault();
                _this.isPressingDown = true;
            };
            _this.onMouseUp = function (event) {
                _this.onPressRelease(event);
            };
            _this.onTouchEnd = function (event) {
                _this.onPressRelease(event);
            };
            _this.onPressRelease = function (event) {
                event.preventDefault();
                _this.isPressingDown = false;
                _this.previousCoords = null;
                if (!_this.drewBeforeRelease) {
                    return;
                }
                _this.drewBeforeRelease = false;
                _this.emit('release');
            };
            _this.normalizeTouchEventCoords = function (event) {
                var target = event.target;
                var rect = target.getBoundingClientRect();
                var targetTouch = event.targetTouches[0];
                var offsetX = targetTouch.pageX;
                var offsetY = targetTouch.pageY;
                return utils.calculateTouchPosistion(rect, offsetX, offsetY);
            };
            _this.onTouchMove = function (event) {
                if (!_this.isPressingDown) {
                    return;
                }
                if (!_this.drewBeforeRelease) {
                    _this.drewBeforeRelease = true;
                }
                _this.handleNewCoordinates(_this.normalizeTouchEventCoords(event));
            };
            _this.onMouseMove = function (event) {
                if (!_this.isPressingDown) {
                    return;
                }
                event.preventDefault();
                if (!_this.drewBeforeRelease) {
                    _this.drewBeforeRelease = true;
                }
                _this.handleNewCoordinates({
                    x: event.offsetX,
                    y: event.offsetY
                });
            };
            _this.handleNewCoordinates = function (coords) {
                var previousCoords = _this.previousCoords === null ? _this.previousCoords : __assign({}, _this.previousCoords);
                _this.emit('draw', __assign({}, coords), previousCoords);
                _this.previousCoords = coords;
            };
            _this.drawLine = function (fromCoords, toCoords, color, lineWidth) {
                if (color === void 0) { color = "#A0A3A6"; }
                if (lineWidth === void 0) { lineWidth = 5; }
                _this.context.lineWidth = lineWidth;
                _this.context.strokeStyle = color;
                _this.context.beginPath();
                _this.context.moveTo(fromCoords.x, fromCoords.y);
                _this.context.lineTo(toCoords.x, toCoords.y);
                _this.context.closePath();
                _this.context.stroke();
            };
            _this.drawCircle = function (coords, radius, fillStyle) {
                if (radius === void 0) { radius = 10; }
                if (fillStyle === void 0) { fillStyle = "white"; }
                _this.context.beginPath();
                _this.context.arc(coords.x, coords.y, radius, 0, 2 * Math.PI, false);
                _this.context.fillStyle = 'white';
                _this.context.fill();
            };
            _this.element = element;
            _this.context = element.getContext('2d');
            _this.element.addEventListener('mousedown', _this.onMouseDown);
            _this.element.addEventListener('touchstart', _this.onTouchStart);
            _this.element.addEventListener('mouseup', _this.onMouseUp);
            _this.element.addEventListener('touchend', _this.onTouchEnd);
            _this.element.addEventListener('mousemove', _this.onMouseMove);
            _this.element.addEventListener('touchmove', _this.onTouchMove);
            return _this;
        }
        return SymbolCanvas;
    }(EventEmitter));
    exports.SymbolCanvas = SymbolCanvas;
    var CanvasController = (function (_super) {
        __extends(CanvasController, _super);
        function CanvasController(canvas, options) {
            if (options === void 0) { options = { isErasing: false, eraseRadius: 10 }; }
            var _this = _super.call(this) || this;
            _this.traceIndex = 0;
            _this.buffer = [[]];
            _this.handleDraw = function (currentCoords, previousCoords) {
                if (_this.options.isErasing) {
                    _this.buffer = utils.removeOverlapping(_this.buffer, currentCoords, _this.options.eraseRadius);
                    _this.canvas.drawCircle(currentCoords, _this.options.eraseRadius);
                }
                else {
                    _this.buffer[_this.traceIndex].push(currentCoords);
                    if (previousCoords !== null) {
                        _this.canvas.drawLine(previousCoords, currentCoords);
                    }
                }
            };
            _this.handleRelease = function () {
                _this.buffer.push([]);
                _this.traceIndex += 1;
                _this.emit('release', __assign({}, _this.buffer));
            };
            _this.markTraceGroups = function (traceGroupIndexes, color) {
                if (color === void 0) { color = 'red'; }
                traceGroupIndexes.forEach(function (groupIndex) {
                    var trace = _this.buffer[groupIndex];
                    if (trace === undefined) {
                        throw new Error("Attempted to mark trace not in buffer. groupIndex: " + groupIndex + ". buffer: " + JSON.stringify(_this.buffer));
                    }
                    for (var i = 0; i < trace.length - 2; i++) {
                        _this.canvas.drawLine(trace[i], trace[i + 1], color, 4);
                    }
                });
            };
            _this.canvas = canvas;
            canvas.on('draw', _this.handleDraw);
            canvas.on('release', _this.handleRelease);
            _this.options = options;
            _this.traceIndex = 0;
            return _this;
        }
        return CanvasController;
    }(EventEmitter));
    exports.CanvasController = CanvasController;
    console.log("Im running here", window);
    var thisWindow = window;
    if (typeof window !== 'undefined') {
        thisWindow.SymbolCanvas = SymbolCanvas;
        thisWindow.CanvasController = CanvasController;
    }
});
//# sourceMappingURL=index.js.map