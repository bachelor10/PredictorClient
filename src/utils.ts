
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

export const accumulateDistance = (trace: Coordinates2D[]) => {
    return trace.reduce((accumulator, currentValue, currentIndex) => {
        if(currentIndex >= trace.length - 1) return accumulator
        return accumulator + distance(currentValue, trace[currentIndex + 1])
    }, 0)
}

export const getArrayIndexes = (arr: any[]) => {
    return arr.map((_, i) => i)
}

export function getOverlapping(buffer: Coordinates2D[][], compareCoords: Coordinates2D, radius: number){

    let index = -1
    let closestMatch = Number.MAX_VALUE

    buffer.forEach((trace, i) => {
        let closestMatchInTrace = Number.MAX_VALUE
        trace.forEach((coord) => {
            const dist = distance(coord, compareCoords);
            if(dist < closestMatchInTrace){
                closestMatchInTrace = dist
            }
        })
        if(closestMatchInTrace < closestMatch){
            index = i;
            closestMatch = closestMatchInTrace
        }
    }) 
    return index;
}

