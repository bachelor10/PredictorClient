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
        var filteredAndRemovedTrace = filteredTrace.filter(function (arr) { return arr.length > 1; });
        newBuffer = newBuffer.concat(filteredAndRemovedTrace);
    });
    return newBuffer;
}
export var accumulateDistance = function (trace) {
    return trace.reduce(function (accumulator, currentValue, currentIndex) {
        if (currentIndex >= trace.length - 1)
            return accumulator;
        return accumulator + distance(currentValue, trace[currentIndex + 1]);
    }, 0);
};
export var getArrayIndexes = function (arr) {
    return arr.map(function (_, i) { return i; });
};
export function getOverlapping(buffer, compareCoords, radius) {
    var index = -1;
    var closestMatch = Number.MAX_VALUE;
    var hasMatch = false;
    buffer.forEach(function (trace, i) {
        var closestMatchInTrace = Number.MAX_VALUE;
        trace.forEach(function (coord) {
            var dist = distance(coord, compareCoords);
            if (dist < closestMatchInTrace) {
                closestMatchInTrace = dist;
            }
            if (dist < radius) {
                hasMatch = true;
            }
        });
        if (closestMatchInTrace < closestMatch) {
            index = i;
            closestMatch = closestMatchInTrace;
        }
    });
    return index;
}
//# sourceMappingURL=utils.js.map