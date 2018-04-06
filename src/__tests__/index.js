import {CanvasController, SymbolCanvas} from '../index'
import * as utils from './utils'

describe('SymbolCanvas', () => {

    let listeners = {};

    let defaultEvent = {
        preventDefault: () => {},

    }

    let canvasMock;

    beforeEach(() => {
        canvasMock = {
            getContext: () => {},
            addEventListener: (eventType, callback) => {
                listeners[eventType] = {count: 1, func: callback}
            },
            
        }
    })

    it('Initalizes listeners correctly', () => {

        const symbolCanvas = new SymbolCanvas(canvasMock)

        expect(listeners['touchstart'].count).toBe(1)
        expect(listeners['touchend'].count).toBe(1)
        expect(listeners['touchmove'].count).toBe(1)
        expect(listeners['mouseup'].count).toBe(1)
        expect(listeners['mousedown'].count).toBe(1)
        expect(listeners['mousemove'].count).toBe(1)
    })

    it('Sets is pressed when mousedown is called', () => {

        const symbolCanvas = new SymbolCanvas(canvasMock);

        expect(symbolCanvas.isPressingDown).toBe(false)


        listeners['mousedown'].func(defaultEvent)

        expect(symbolCanvas.isPressingDown).toBe(true)
    })

    it('Resets isPressingDown on release', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);

        listeners['mousedown'].func(defaultEvent)

        listeners['mouseup'].func(defaultEvent)

        expect(symbolCanvas.isPressingDown).toBe(false)
    })

    it('Handles onTouchMove correctly', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);


        const touchEvent = {
            target: {
                getBoundingClientRect: () => ({
                    top: 0,
                    left: 0
                })
            },
            preventDefault: () => {},
            targetTouches: [{pageX: 0, pageY: 0}]
        }
        listeners['touchstart'].func(touchEvent)

        const eventFunc = jest.fn()

        symbolCanvas.on('draw', eventFunc)

        listeners['touchmove'].func(touchEvent)

        expect(eventFunc).toHaveBeenCalledTimes(1);

        expect(eventFunc).toHaveBeenLastCalledWith({x: 0, y: 0}, null)

        expect(symbolCanvas.previousCoords).toEqual({x: 0, y: 0})
    })

    it('Handles onMouseMove correctly', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);
        listeners['mousedown'].func(defaultEvent)


        const mouseEvent = {
            preventDefault: () => {},
            offsetX: 0,
            offsetY: 0
        }

        const eventFunc = jest.fn()

        symbolCanvas.on('draw', eventFunc)

        listeners['mousemove'].func(mouseEvent)
        listeners['mousemove'].func(mouseEvent)

        expect(eventFunc).toHaveBeenCalledTimes(2)
        expect(eventFunc).toBeCalledWith({x: 0, y: 0}, null)
        expect(eventFunc).toBeCalledWith({x: 0, y: 0}, {x: 0, y: 0})

        expect(symbolCanvas.previousCoords).toEqual({x: 0, y: 0})

    })

    it('Returns early from pressRelease when move has not occured', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);

        const eventFunc = jest.fn()

        symbolCanvas.on('release', eventFunc)

        listeners['mousedown'].func(defaultEvent)
        listeners['mouseup'].func(defaultEvent)

        expect(eventFunc).not.toHaveBeenCalled()
    })

    it('Emits release when mouse move has occured', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);

        const eventFunc = jest.fn()

        symbolCanvas.on('release', eventFunc)

        const mouseEvent = {
            preventDefault: () => {},
            offsetX: 0,
            offsetY: 0
        }

        listeners['mousedown'].func(defaultEvent)
        listeners['mousemove'].func(mouseEvent)
        listeners['mouseup'].func(defaultEvent)

        expect(eventFunc).toHaveBeenCalledTimes(1)
    })
})



describe('CanvasController', () => {

    let eventCallbacks = {};

    let symbolCanvasMock = {};

    let drawLineSpy;

    let drawCircleSpy;

    beforeEach(() => {

        eventCallbacks = {}
        drawLineSpy = jest.fn()
        drawCircleSpy = jest.fn()

        symbolCanvasMock = {
            on: (event, callback) => {
                eventCallbacks[event] = callback
            },
            drawLine: drawLineSpy,
            drawCircle: drawCircleSpy

        }
    })

    it('Attaches correct listeners', () => {

        const canvasController = new CanvasController(symbolCanvasMock);

        expect(eventCallbacks['release']).toBeDefined()

        expect(eventCallbacks['draw']).toBeDefined()

    })

    it('Dispatches release when canvas dispatches release', () => {
        const canvasController = new CanvasController(symbolCanvasMock);

        const spyCallback = jest.fn()

        canvasController.on('release', spyCallback);

        eventCallbacks['release']()
        eventCallbacks['release']()

        expect(spyCallback).toHaveBeenCalledTimes(2)

    })

    it('Adds drawing correctly to buffer and calls draw line', () => {

        const canvasController = new CanvasController(symbolCanvasMock);

        eventCallbacks['draw']({x: 10, y: 10}, null)
        eventCallbacks['draw']({x: 20, y: 20}, {x: 10, y: 10})


        expect(canvasController.buffer).toEqual([[{x: 10, y: 10}, {x: 20, y: 20}]])

        expect(drawLineSpy).toHaveBeenCalledWith({x: 10, y: 10}, {x: 20, y: 20})

    })

    it('Creates new buffer after release', () => {

        const canvasController = new CanvasController(symbolCanvasMock);

        eventCallbacks['draw']({x: 10, y: 10}, null)
        eventCallbacks['draw']({x: 20, y: 20}, {x: 10, y: 10})

        eventCallbacks['release']()

        eventCallbacks['draw']({x: 10, y: 10}, null)
        eventCallbacks['draw']({x: 20, y: 20}, {x: 10, y: 10})


        expect(canvasController.buffer).toEqual([[{x: 10, y: 10}, {x: 20, y: 20}], [{x: 10, y: 10}, {x: 20, y: 20}]])

    })

    it('Erases both from buffer and canvas', () => {

        const canvasController = new CanvasController(symbolCanvasMock, {eraseRadius: 10});

        eventCallbacks['draw']({x: 10, y: 10}, null)
        eventCallbacks['draw']({x: 20, y: 20}, {x: 10, y: 10})

        canvasController.options.isErasing = true

        eventCallbacks['draw']({x: 25, y: 25}, {x: 20, y: 20})


        expect(canvasController.buffer).toEqual([[{x: 10, y: 10}]])

        expect(drawCircleSpy).toHaveBeenCalledWith({x: 25, y: 25}, 10)

    })
})

