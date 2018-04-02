"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var utils = require("./utils");
var EventEmitter = require("eventemitter3");
var axios_1 = require("axios");
var SymbolCanvas = /** @class */ (function (_super) {
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
            // Do not register as a
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
            console.log('Mouse move');
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
        _this.context = element[0].getContext('2d');
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
var CanvasController = /** @class */ (function (_super) {
    __extends(CanvasController, _super);
    function CanvasController(canvas) {
        var _this = _super.call(this) || this;
        _this.eraseRadius = 10;
        _this.handleDraw = function (currentCoords, previousCoords) {
            if (_this.isErasing) {
                _this.buffer = utils.removeOverlapping(_this.buffer, currentCoords, _this.eraseRadius);
                _this.canvas.drawCircle(currentCoords, _this.eraseRadius);
            }
            else {
                _this.buffer[_this.traceIndex].push(currentCoords);
                if (previousCoords !== null) {
                    _this.canvas.drawLine(previousCoords, currentCoords);
                }
            }
        };
        _this.handleRelease = function () {
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
        _this.isErasing = false;
        _this.traceIndex = 0;
        return _this;
    }
    return CanvasController;
}(EventEmitter));
exports.CanvasController = CanvasController;
var MessageService = /** @class */ (function () {
    function MessageService(serverPath) {
        this.serverPath = serverPath;
    }
    MessageService.prototype.requestPrediction = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var apiUrl, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        apiUrl = this.serverPath + "/api";
                        return [4 /*yield*/, axios_1["default"].post(apiUrl, JSON.stringify(buffer))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.stringify(result)];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MessageService;
}());
exports.MessageService = MessageService;
/**
 * Example code
 *
 * const canvas = document.getElementById("canvas")
 *
 * const symbolCanvas = new SymbolCanvas(canvas)
 *
 * const canvasController = new CanvasController(symbolCanvas)
 *
 * const messageService = new MessageService("localhost:3000")
 *
 * canvasController.on('release', async (buffer) => {
 *      const result = await messageService.requestPrediction(buffer);
 *
 *      console.log("Result in latex", result.latex)
 * })
 */ 
