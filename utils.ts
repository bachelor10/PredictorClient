export function calculateTouchPosistion(rectangle: ClientRect, pageOffsetX: number, pageOffsetY): Coordinates2D {
    // https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event

    return  {
        x: pageOffsetX - rectangle.left,
        y: pageOffsetY - rectangle.top
    }

}

export function distance(fromPoint: Coordinates2D, toPoint: Coordinates2D){
    return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2))
}

export function removeOverlapping(buffer: Coordinates2D[][], compareCoords: Coordinates2D, radius: number){
    const newBuffer = []

    buffer.forEach(trace => {
        const filteredTrace = trace.filter((coords) => {
            return distance(compareCoords, coords) > radius
        })
        newBuffer.push(filteredTrace)
    })
    return newBuffer;
}
