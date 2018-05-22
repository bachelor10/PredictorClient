# PredictorClient

Predictor client is a frontend library intended to handle common canvas use cases.

## Symbol Canvas
The library includes a SymbolCanvas class, which handles most of the communication with the canvas. Its features are:

1. Drawing lines between coordinates.
2. Drawing filled circles (for erasing)
3. Converting touch - and mouse events to normalized coordinates.
4. Clearing the canvas.

### API

The SymbolCanvas class exposes four public methods, as well as three events.


__Constructor__
```ts
 /**
  * @param element The element drawing should be made on
  *
  * @returns {void}
  */
  constructor(element: HTMLCanvasElement) : void
```

__Draw line__
```ts
/**
 * @param fromCoords: The coordinates to draw from
 * @param toCoords: The coordinates to draw to
 * @param color: The color to draw the line, defaults to #A0A3A6
 * @param lineWidth: The width of the line, default to 5
 * 
 * @returns {void}
 */
drawLine(fromCoords: Coordinates2D, toCoords: Coordinates2D, color = "#A0A3A6", lineWidth = 5) : void
```

__Draw circle__
```ts
/**
 * @param coords: The coordinates in the center of the circle
 * @param radius: The radius of the circle, default to 10
 * @param fillStyle: The color to fill the circle, defaults to white
 * 
 * @returns {void}
 */
drawCircle(coords: Coordinates2D, radius = 10, fillStyle = "white") : void
```

__Clear canvas__
```ts
/**
 * @description Removes all color and drawings from the canvas.
 */
clearCanvas() : void
```

__Event emitters__
```ts
/**
 * @name click
 * @description Emits when the canvas was clicked.
 * 
 * @param {Coordinates2D} clickedCoords The coordinates where the canvas was clicked
 *
 *
 * @name draw
 * @description Emits when a user has drawn one step forward. 
 
 * @param {Coordinates2D} currentCoords The coordinates where the user drew to
 * @param {Coordinates2D | null} prevCoords The coordinates the user drew from. Can be null if there are no previous coords.
 *
 *
 * @name release
 * @description Emits when a user has released the canvas. If the user did not draw. Click will be dispatched
 *                 instead of release.
*/
```

## Canvas controller
The canvas controller class handles the communication between the canvas and your application, as well as common utility operations. Its features are:

1. Keeps a datastructure of coordinates in the format the server expects.
2. Validates touch events, in the case that a user clicked unintentionally.
3. Emits an event with the current trace buffer when a user is done drawing (on release if there is a valid buffer). This can be sent directly to the server.
4. Emits an event with the clicked trace if a user presses the canvas within a certain distance from a trace.
5. Can mark specific traces with a specified color (used for marking a group of traces)


### API

The CanvasController class exposes four public methods, as well as three events.


__Constructor__
```ts
/**
 * @param canvas   A canvas with a similar interface to SymbolCanvas
 * @param {Object}   options Options for how the controller should work. 
 * @param {bool}     options.isErasing Whether buffer should be removed or drawn. 
 *                     Can be accessed from symbolCanvas.options.isErasing
 * @param {number}   options.eraseRadius Number for the circle radius when erasing
 * @param {number}   options.minTraceCount How many samplings in a trace before it is valid
 * @param {number}   options.minTraceDistance The minimum distance a trace can be to be valid
 * @param {string}   options.canvasColor The color of the canvas
 * @param {string}   options.canvasSelectedColor The color a selected symbol should have
 * @param {number}   options.strokeWidth The width of each stroke
 * @param {string}   options.strokeColor The color of the drawn lines
 * @param {bool}     options.validateTrace If traces should be validated before being included in buffer. 
 *                     If false, minTraceCount and minTraceDistance will not be used.
 *
 * @returns {void}
 */
constructor(canvas: SymbolCanvas, options: ControllerOptions) : void
```

__Redraw buffer__
```ts
/**
 * @description Clears the canvas and redraws the buffer.
 * 
 * @returns {void}
 */
drawLine() : void
```

__Mark trace groups__
```ts
/**
 * @description Draws traces in buffer at specified indexes. Uses default values from options.
 *
 * @param traceGroupIndexes: The indexes for traces in buffer that should be drawn
 * @param color:             The color of the drawn traces. Defaults to value in options
 * @param strokeWidth:       The width of the drawn traces. Defaults to value in options
 * 
 * @returns {void}
 */
markTraceGroups(traceGroupIndexes: number[], color, strokeWidth): void
```

__Event emitters__
```ts
/**
 * @name release
 * @description Emits when the canvas was released, and at least one valid trace has been drawn.
 * 
 * @param {number[][]} buffer The current buffer at the time of release. Includes a list of traces.
 *
 *
 * @name symbolclick
 * @description Emits when the canvas was clicked, and a trace was within range of the click. 
 
 * @param {number} overlappingIndex The index of the closest trace to the click.

*/
```

## Example

```html
<!DOCTYPE html>
<html>
<body>
 
 <canvas id="canvas"></canvas>

</body>
</html>
```

```javascript
const canvas = document.getElementById("canvas")
const symbolCanvas = new SymbolCanvas(canvas);
const canvasController = new CanvasController(symbolCanvas);

canvasController.on("release", buffer => {
    // Send buffer to server
})
canvasController.on("symbolclick", traceIndex => {
  // Find which trace group the index is in
  const traceGroup = findTraceGroupByIndex(traceIndex) // Returns list of the traces' indexes
  canvasController.markTraceGroup(traceGroup, "red") // Paint the symbol (trace group) red.
})
```

A full example can be found in [symbol predictor server](https://github.com/bachelor10/symbol-predictor-server/blob/master/example/index.js).
