import * as utils from './utils';
import EventEmitter from "eventemitter3";
import axios from "axios";

class SymbolCanvas extends EventEmitter {

    private element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D
    private isPressingDown: boolean
    private previousCoords: Coordinates2D | null
    private drewBeforeRelease: boolean
    

    constructor(element: HTMLCanvasElement){
        super()
        this.element = element;
        this.context = element[0].getContext('2d')
        
        this.element.addEventListener('mousedown', this.onPressDown);
        this.element.addEventListener('touchstart', this.onPressDown);

        this.element.addEventListener('mouseup', this.onPressRelease)
        this.element.addEventListener('touchend', this.onPressRelease)

        this.element.addEventListener('mousemove', this.onMouseMove)
        this.element.addEventListener('touchmove', this.onToucheMove)

        this.isPressingDown = false;
        this.previousCoords = null;

        this.drewBeforeRelease = false;

    }

    private onPressDown(event: Event) {
        event.preventDefault();
        this.isPressingDown = true;    
    };

    private onPressRelease(event: Event) {
        event.preventDefault();

        this.isPressingDown = false;
    
        this.previousCoords = null;
    
        // increment current trace if person moved mouse between mouse down and up
        if(!this.drewBeforeRelease){
            return;
        }

        this.drewBeforeRelease = false
        
        this.emit('release')
        
    }
    private onToucheMove(event: TouchEvent){
        if(!this.isPressingDown){
            return;
        }
        if(!this.drewBeforeRelease){
            this.drewBeforeRelease = true
        }

        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();

        const targetTouch = event.targetTouches[0]

        const offsetX = targetTouch.pageX;
        const offsetY = targetTouch.pageY;

        const currentCoordinates = utils.calculateTouchPosistion(rect, offsetX, offsetY);

        this.handleNewCoordinates(currentCoordinates)

    }
    private onMouseMove(event: MouseEvent) {
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
    private handleNewCoordinates(coords: Coordinates2D) {

        this.emit('draw', {...coords}, {...this.previousCoords})

        this.previousCoords = coords;

    }

    public drawLine(fromCoords: Coordinates2D, toCoords: Coordinates2D, color = "#A0A3A6", lineWidth = 5) {

        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
        
        this.context.beginPath();
        this.context.moveTo(fromCoords.x, fromCoords.y);
        this.context.lineTo(toCoords.x, toCoords.y);
        this.context.closePath();
        
        this.context.stroke();
    }

    public drawCircle(coords: Coordinates2D, radius = 10, fillStyle= "white") {
        this.context.beginPath();
        
        this.context.arc(coords.x, coords.y, radius, 0, 2 * Math.PI, false);
        
        this.context.fillStyle = 'white';
        this.context.fill();
    
    }
}

class CanvasController extends EventEmitter{
    private canvas: SymbolCanvas
    private traceIndex: number
    private buffer: Coordinates2D[][]
    public isErasing: boolean
    public eraseRadius: number = 10



    constructor(canvas: SymbolCanvas){
        super()
        this.canvas = canvas;

        canvas.on('draw', this.handleDraw)
        canvas.on('release', this.handleRelease)

        this.isErasing = false;
        this.traceIndex = 0;
    }

    handleDraw(currentCoords: Coordinates2D, previousCoords: Coordinates2D){

        if(this.isErasing){
            this.buffer = utils.removeOverlapping(this.buffer, currentCoords, this.eraseRadius)
            this.canvas.drawCircle(currentCoords, this.eraseRadius)
        }

        else {
            this.buffer[this.traceIndex].push(currentCoords)
            if(previousCoords !== null){
                this.canvas.drawLine(previousCoords, currentCoords)
            }
        }
    }

    handleRelease(){
        this.emit('release', {...this.buffer})
    }
}


class MessageService {
    serverPath: string

    constructor(serverPath: string){
        this.serverPath = serverPath;
    }

    async requestPrediction(buffer: Coordinates2D[][]){

        try{
            const apiUrl = `${this.serverPath}/api`
            const result = await axios.post(apiUrl, JSON.stringify(buffer))

            return JSON.stringify(result);

        }
        catch(error){
            throw error
        }
    }
}

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