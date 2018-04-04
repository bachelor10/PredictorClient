
import { Coordinates2D } from './index';

export function calculateTouchPosistion(rectangle: ClientRect, pageOffsetX: number, pageOffsetY: number): Coordinates2D {
    // https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event

    return  {
        x: pageOffsetX - rectangle.left,
        y: pageOffsetY - rectangle.top
    }

}

export function distance(fromPoint: Coordinates2D, toPoint: Coordinates2D): number{
    return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2))
}


export function removeOverlapping(buffer: Coordinates2D[][], compareCoords: Coordinates2D, radius: number){
    let newBuffer: Coordinates2D[][] = []

    buffer.forEach(trace => {
        const filteredTrace: Coordinates2D[][] = [[]];
        let currentTrace = 0;
        trace.forEach((coords) => {
            if(distance(compareCoords, coords) > radius){
                filteredTrace[filteredTrace.length-1].push(coords)
            }
            else if (filteredTrace[filteredTrace.length-1].length > 0) {
                filteredTrace.push([])
            }
        })
        //Remove empty arrays
        const filteredAndRemovedTrace = filteredTrace.filter(arr => arr.length > 0)
        newBuffer = newBuffer.concat(filteredAndRemovedTrace)
        
    })
    return newBuffer;
}

export function getOverlapping(buffer: Coordinates2D[][], compareCoords: Coordinates2D, radius: number){

    let index = -1
    buffer.forEach((trace, i) => {
        const hasMatch = trace.some((coord) => {
            return distance(coord, compareCoords) < radius
        })
        if(hasMatch){
            index = i;
            return false;
        }
    }) 
    return index
}

