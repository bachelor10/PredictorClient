/// <reference path="./utils.ts" />
/// <reference path="../node_modules/eventemitter3/index.js" />

import * as utils from './utils';
import * as EventEmitter from '../node_modules/eventemitter3/index';

export interface Coordinates2D {
    x: number,
    y: number
}

export class SymbolCanvas extends EventEmitter {

    private element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D
    private previousCoords: Coordinates2D = null
    private isPressingDown = false
    private drewBeforeRelease = false
    private initialClickPosition: Coordinates2D = null
    

    constructor(element: HTMLCanvasElement){
        super()
        this.element = element;
        this.context = element.getContext('2d')
        
        this.element.addEventListener('mousedown', this.onMouseDown);
        this.element.addEventListener('touchstart', this.onTouchStart);

        this.element.addEventListener('mouseup', this.onMouseUp)
        this.element.addEventListener('touchend', this.onTouchEnd)

        this.element.addEventListener('mousemove', this.onMouseMove)
        this.element.addEventListener('touchmove', this.onTouchMove)


    }

    private onMouseDown = (event: MouseEvent) => {

        event.preventDefault();

        this.initialClickPosition = {x: event.offsetX, y: event.offsetY}
        this.isPressingDown = true;
    
    }
    private onTouchStart = (event: TouchEvent) => {

        event.preventDefault()

        this.initialClickPosition = this.normalizeTouchEventCoords(event)

        this.isPressingDown = true;


    }

    private onMouseUp = (event: MouseEvent) => {

        this.onPressRelease(event)

    }
    private onTouchEnd = (event: TouchEvent) => {

        this.onPressRelease(event)
    }

    private onPressRelease = (event: Event) => {
        event.preventDefault();

        this.isPressingDown = false;
    
        this.previousCoords = null;
        // Do not register as a
        if(!this.drewBeforeRelease){
            this.drewBeforeRelease = true
            this.emit('click', this.initialClickPosition)
            return;
        }

        this.drewBeforeRelease = false
        
        this.emit('release')
        
    }
    private normalizeTouchEventCoords = (event: TouchEvent) => {
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();

        const targetTouch = event.targetTouches[0]

        const offsetX = targetTouch.pageX;
        const offsetY = targetTouch.pageY;

        return utils.calculateTouchPosistion(rect, offsetX, offsetY);

    }
    private onTouchMove = (event: TouchEvent) => {
        if(!this.isPressingDown){
            return;
        }
        event.preventDefault();

        if(!this.drewBeforeRelease){
            this.drewBeforeRelease = true
        }
        this.handleNewCoordinates(this.normalizeTouchEventCoords(event))

    }
    private onMouseMove = (event: MouseEvent) => {

        if(!this.isPressingDown){
            return;
        }
        event.preventDefault();

        if(!this.drewBeforeRelease){
            this.drewBeforeRelease = true
        }
        this.handleNewCoordinates({
            x: event.offsetX,
            y: event.offsetY
        })

    
    }

    private handleNewCoordinates = (coords: Coordinates2D) => {

        const previousCoords = this.previousCoords === null ? this.previousCoords : {...this.previousCoords}
        this.emit('draw', {...coords}, previousCoords)

        this.previousCoords = coords;

    }


    public drawLine = (fromCoords: Coordinates2D, toCoords: Coordinates2D, color = "#A0A3A6", lineWidth = 5) => {

        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
        
        this.context.beginPath();
        this.context.moveTo(fromCoords.x, fromCoords.y);
        this.context.lineTo(toCoords.x, toCoords.y);
        this.context.closePath();
        
        this.context.stroke();
    }

    public drawCircle = (coords: Coordinates2D, radius = 10, fillStyle= "white") => {
        this.context.beginPath();
        
        this.context.arc(coords.x, coords.y, radius, 0, 2 * Math.PI, false);
        
        this.context.fillStyle = 'white';
        this.context.fill();
    
    }

    public clearCanvas = () => {
        this.context.clearRect(0,0, this.element.width, this.element.height);
    }
}

export interface ControllerOptions {
    isErasing: boolean
    eraseRadius: number,
    minTraceCount: number,
    minTraceDistance: number,
    canvasColor: string,
    canvasSelectedColor: string,
    strokeWidth: number,
    strokeColor: string,
    validateTrace: boolean
}

const defaultControllerOptions = {
    isErasing: false,
    eraseRadius: 10,
    minTraceCount: 5,
    minTraceDistance: 10,
    canvasColor: 'white',
    canvasSelectedColor: 'red',
    strokeWidth: 5,
    strokeColor: '#A0A3A6',
    validateTrace: true
}
export class CanvasController extends EventEmitter{
    public options: ControllerOptions
    private canvas: SymbolCanvas
    private traceIndex: number = 0
    private buffer: Coordinates2D[][] = [[]]




    constructor(canvas: SymbolCanvas, options: ControllerOptions = defaultControllerOptions){
        super()
        this.canvas = canvas;

        canvas.on('draw', this.handleDraw)
        canvas.on('release', this.handleRelease)
        canvas.on('click', this.handleCanvasClick)

        this.options = options
        this.traceIndex = 0

    }

    private handleDraw = (currentCoords: Coordinates2D, previousCoords: Coordinates2D) => {

        if(this.options.isErasing){
            this.buffer = utils.removeOverlapping(this.buffer, currentCoords, this.options.eraseRadius)
            if(this.buffer.length === 0 || this.buffer[this.buffer.length - 1].length !== 0){
                this.buffer.push([])
            }
            this.traceIndex = this.buffer.length - 1
            this.redrawBuffer()
        }

        else {
            this.buffer[this.traceIndex].push(currentCoords)
            if(previousCoords !== null){
                this.canvas.drawLine(previousCoords, currentCoords)
            }
        }
    }

    private validateTrace = (trace: Coordinates2D[], minTraceCount: number, minTraceDistance: number) => {
        if(!this.options.validateTrace) return true;

        if(trace.length < minTraceCount){
            return false;
        }

        const traceDistance = utils.accumulateDistance(trace)

        if(traceDistance <= minTraceDistance){
            return false
        }

        return true
    }

    private handleRelease = () => {

        const {minTraceCount, minTraceDistance} = this.options;

        const isValidTrace = this.validateTrace(this.buffer[this.buffer.length - 1], minTraceCount, minTraceDistance)

        if(this.options.isErasing){
            this.buffer = this.buffer.filter((b) => b.length >= 1)
            this.emit('release', [...this.buffer])
            this.buffer.push([]);
            this.traceIndex = this.buffer.length - 1

        }
        else if(isValidTrace){
            this.emit('release', [...this.buffer])
            this.buffer.push([]);    
            this.traceIndex = this.buffer.length - 1;
        }
        else {
            this.buffer[this.buffer.length - 1] = [];
            this.redrawBuffer()
        }
    }

    private handleCanvasClick = (coords: Coordinates2D) => {
        const overlappingIndex = utils.getOverlapping(this.buffer, coords, 50)
        if(overlappingIndex >= 0){
            this.emit('symbolclick', overlappingIndex)
        }
    }

    public redrawBuffer = () => {
        this.canvas.clearCanvas()
        this.markTraceGroups(utils.getArrayIndexes(this.buffer), this.options.strokeColor, this.options.strokeWidth)
    }

    public markTraceGroups = (traceGroupIndexes: number[], color = this.options.canvasSelectedColor, strokeWidth = this.options.strokeWidth): void => {

        traceGroupIndexes.forEach(groupIndex => {
            const trace = this.buffer[groupIndex];

            if(trace === undefined) {
                throw new Error("Attempted to mark trace not in buffer. groupIndex: " + groupIndex + ". buffer: " + JSON.stringify(this.buffer));
            }

            for(let i = 0; i<trace.length-1;i++){
                this.canvas.drawLine(trace[i], trace[i+1], color, strokeWidth)
            }
        });
    }
}


if (typeof window !== 'undefined') {
    (window as any).SymbolCanvas = SymbolCanvas;
    (window as any).CanvasController = CanvasController
}