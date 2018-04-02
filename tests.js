import {CanvasController, SymbolCanvas, MessageService} from './index'


describe('SymbolCanvas', () => {

    let listeners = {};

    let defaultEvent = {
        preventDefault: () => {}
    }

    let canvasMock;

    beforeEach(() => {
        canvasMock = {
            "0": {
                getContext: () => {}
            },
            addEventListener: (eventType, callback) => {
                listeners[eventType] = {count: 1, func: callback}
            }
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


        listeners['touchstart'].func(defaultEvent)

        expect(symbolCanvas.isPressingDown).toBe(true)
    })

    it('Resets isPressingDown on release', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);

        listeners['touchstart'].func(defaultEvent)

        listeners['touchend'].func(defaultEvent)

        expect(symbolCanvas.isPressingDown).toBe(false)
    })

    it('Handles onTouchMove correctly', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);

        listeners['touchstart'].func(defaultEvent)

        const touchEvent = {
            target: {
                getBoundingClientRect: () => ({
                    top: 0,
                    left: 0
                })
            },
            targetTouches: [{pageX: 0, pageY: 0}]
        }

        const eventFunc = jest.fn()

        symbolCanvas.on('draw', eventFunc)

        listeners['touchmove'].func(touchEvent)

        expect(eventFunc).toHaveBeenCalledTimes(1);

        expect(eventFunc).toHaveBeenLastCalledWith({x: 0, y: 0}, null)

        expect(symbolCanvas.previousCoords).toEqual({x: 0, y: 0})
    })

    it('Handles onMouseMove correctly', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);
        listeners['touchstart'].func(defaultEvent)


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

        listeners['touchstart'].func(defaultEvent)
        listeners['touchend'].func(defaultEvent)

        expect(eventFunc).not.toHaveBeenCalled()
    })

    it('Emits release when touch move has occured', () => {
        const symbolCanvas = new SymbolCanvas(canvasMock);

        const eventFunc = jest.fn()

        symbolCanvas.on('release', eventFunc)

        const mouseEvent = {
            preventDefault: () => {},
            offsetX: 0,
            offsetY: 0
        }

        listeners['touchstart'].func(defaultEvent)
        listeners['mousemove'].func(mouseEvent)
        listeners['touchend'].func(defaultEvent)

        expect(eventFunc).toHaveBeenCalledTimes(1)
    })


})


