"use strict";
exports.__esModule = true;
function calculateTouchPosistion(rectangle, pageOffsetX, pageOffsetY) {
    // https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event
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
        var filteredTrace = trace.filter(function (coords) {
            return distance(compareCoords, coords) > radius;
        });
        newBuffer.push(filteredTrace);
    });
    return newBuffer;
}
exports.removeOverlapping = removeOverlapping;
