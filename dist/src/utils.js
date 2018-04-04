export function calculateTouchPosistion(rectangle, pageOffsetX, pageOffsetY) {
    return {
        x: pageOffsetX - rectangle.left,
        y: pageOffsetY - rectangle.top
    };
}
export function distance(fromPoint, toPoint) {
    return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2));
}
export function removeOverlapping(buffer, compareCoords, radius) {
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
//# sourceMappingURL=utils.js.map