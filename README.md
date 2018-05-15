# PredictorClient

Predictor client is a frontend library intended to handle common canvas use cases.

### Symbol Canvas
The library includes a SymbolCanvas class, which handles most of the communication with the canvas. Its features are:

1. Drawing lines between coordinates.
2. Drawing filled circles (for erasing)
3. Converting touch - and mouse events to normalized coordinates.
4. Clearing the canvas.

### Canvas controller
The canvas controller class handles the communication between the canvas and your application, as well as common utility operations. Its features are:

1. Keeps a datastructure of coordinates in the format the server expects.
2. Validates touch events, in the case that a user clicked unintentionally.
3. Emits an event with the current trace buffer when a user is done drawing (on release if there is a valid buffer). This can be sent directly to the server.
4. Emits an event with the clicked trace if a user presses the canvas within a certain distance from a trace.
5. Can mark specific traces with a specified color (used for marking a group of traces)

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
