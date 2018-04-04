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

        this.isPressingDown = true;
    
    }
    private onTouchStart = (event: TouchEvent) => {
        event.preventDefault()

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
}

export interface ControllerOptions {
    isErasing: boolean
    eraseRadius: number
}

export class CanvasController extends EventEmitter{
    public options: ControllerOptions
    private canvas: SymbolCanvas
    private traceIndex: number = 0
    private buffer: Coordinates2D[][] = [[]]




    constructor(canvas: SymbolCanvas, options: ControllerOptions = {isErasing: false, eraseRadius: 10}){
        super()
        this.canvas = canvas;

        canvas.on('draw', this.handleDraw)
        canvas.on('release', this.handleRelease)

        this.options = options
        this.traceIndex = 0

    }

    private handleDraw = (currentCoords: Coordinates2D, previousCoords: Coordinates2D) => {

        if(this.options.isErasing){
            this.buffer = utils.removeOverlapping(this.buffer, currentCoords, this.options.eraseRadius)
            this.canvas.drawCircle(currentCoords, this.options.eraseRadius)
        }

        else {
            this.buffer[this.traceIndex].push(currentCoords)
            if(previousCoords !== null){
                this.canvas.drawLine(previousCoords, currentCoords)
            }
        }
    }

    private handleRelease = () => {
        this.buffer.push([]);
        this.traceIndex += 1;
        this.emit('release', {...this.buffer})
    }

    public markTraceGroups = (traceGroupIndexes: number[], color = 'red'): void => {
        traceGroupIndexes.forEach(groupIndex => {

            const trace = this.buffer[groupIndex];

            if(trace === undefined) {
                throw new Error("Attempted to mark trace not in buffer. groupIndex: " + groupIndex + ". buffer: " + JSON.stringify(this.buffer));
            }

            for(let i = 0; i<trace.length-2;i++){
                this.canvas.drawLine(trace[i], trace[i+1], color, 4)
            }
        });
    }
}

if (typeof window !== 'undefined') {

    window.SymbolCanvas = SymbolCanvas;
    window.CanvasController = CanvasController
}