# Data Flow Architecture

This document describes the data flow patterns in Web Photoshop, from user interactions to canvas updates.

## Overview

Web Photoshop uses a unidirectional data flow pattern where:
1. User interactions trigger events
2. Events are handled by components/hooks
3. Tool functions modify ImageData
4. WebGL texture is updated
5. Canvas re-renders

## Data Flow Diagram

```
User Interaction
    ↓
Component Event Handler
    ↓
Hook Handler (useDrawing)
    ↓
Tool Function
    ↓
ImageData Modification
    ↓
WebGL Texture Update
    ↓
Canvas Re-render
```

## Detailed Data Flows

### 1. Tool Selection Flow

**Trigger**: User clicks tool button in Toolbar

**Flow**:
1. `Toolbar` component receives click event
2. Calls `onToolChange(toolId)` prop
3. `App` component updates `activeTool` state
4. `activeTool` prop flows to:
   - `Toolbar` (highlights active tool)
   - `Canvas` (updates cursor class)
   - `PropertiesPanel` (shows tool-specific controls)

**Data**:
- Input: Tool ID (e.g., `'brush'`, `'fractal'`)
- State: `activeTool` in App component
- Output: UI updates across components

### 2. Brush Drawing Flow

**Trigger**: User clicks and drags on canvas

**Step 1: Mouse Event**
- `Canvas` component receives mouse event
- Calls `onMouseDown` prop handler

**Step 2: Coordinate Transformation**
- `useDrawing` hook's `getCanvasCoords` function:
  - Gets canvas bounding rectangle
  - Calculates scale factors (canvas size / display size)
  - Transforms screen coordinates to canvas coordinates

**Step 3: Tool Routing**
- `handleMouseDown` in `useDrawing` checks `activeTool`
- Routes to `drawBrush` function

**Step 4: Brush Stroke Application**
- `drawBrush` calls `drawBrushStroke` from `brushTool.js`
- Parameters passed from `toolProperties` object:
  ```javascript
  {
    imageData: imageDataRef.current,
    x, y, prevX, prevY,
    brushSize: toolProperties.brushSize,
    brushColor: toolProperties.brushColor,
    opacity: toolProperties.opacity,
    isEraser: false
  }
  ```

**Step 5: ImageData Modification**
- `drawBrushStroke` modifies `imageDataRef.current` array
- Uses Bresenham's algorithm for smooth lines
- Applies alpha blending for opacity
- Writes RGBA values directly to array

**Step 6: Texture Update**
- `updateTexture()` called from `useDrawing`
- `useWebGL` hook:
  - Binds texture to WebGL context
  - Uploads ImageData using `gl.texImage2D()`
  - Renders texture to canvas using shaders

**Step 7: Canvas Update**
- WebGL renders updated texture
- User sees brush stroke on canvas

**Data Transformation**:
```
Mouse Event (screen coords)
  → Canvas Coordinates (canvas coords)
  → Tool Properties (from toolProperties[activeTool])
  → Tool Parameters (extracted from toolProperties)
  → ImageData Array (RGBA values)
  → WebGL Texture (GPU memory)
  → Canvas Display (pixels)
```

### 3. Fractal Generation Flow

**Trigger**: User clicks "Generate Fractal" button

**Step 1: Button Click**
- `PropertiesPanel` receives click event
- Calls `onGenerateFractal` prop

**Step 2: Handler Execution**
- `handleGenerateFractal` in `App.jsx` (if fractal tool exists):
  ```javascript
  generateFractalBackground({
    imageData: imageDataRef.current,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  })
  updateTexture()
  ```

**Step 3: Fractal Generation**
- `generateFractalBackground` from `fractalTool.js`:
  - Creates 2D grid for noise values
  - Initializes corners with random values
  - Applies midpoint displacement algorithm
  - Maps noise values to RGB colors
  - Writes RGBA values to entire ImageData array

**Step 4: Texture Update**
- `updateTexture()` updates WebGL texture with new ImageData
- Entire canvas texture is replaced

**Step 5: Canvas Update**
- Canvas displays new fractal pattern

**Data Transformation**:
```
Button Click
  → Handler Function
  → Fractal Algorithm (noise generation)
  → Color Mapping (noise → RGB)
  → ImageData Array (full canvas)
  → WebGL Texture
  → Canvas Display
```

### 4. Fill Tool Flow

**Trigger**: User clicks on canvas with fill tool selected

**Flow**:
1. Mouse event → `useDrawing` → `floodFill` function
2. `floodFill` calls `floodFillArea` from `fillTool.js`
3. Parameters passed from `toolProperties`:
   - `brushColor: toolProperties.brushColor`
4. Algorithm:
   - Gets target color at click position
   - Uses stack-based flood fill with tolerance
   - Replaces matching pixels with fill color
5. Modifies ImageData array
6. Updates texture and canvas

**Key Difference**: Fill tool is a one-shot operation (no mouse move handling)

### 5. Blur Tool Flow

**Trigger**: User clicks and drags on canvas with blur tool

**Flow**:
1. Mouse events → `useDrawing` → `applyBlur` function
2. `applyBlur` calls `applyBlurEffect` from `blurTool.js`
3. Parameters passed from `toolProperties`:
   - `brushSize: toolProperties.brushSize`
4. Algorithm:
   - For each pixel in brush radius
   - Calculates average of surrounding pixels (box blur)
   - Replaces pixel with averaged color
5. Modifies ImageData array
6. Updates texture and canvas

## ImageData Structure

### Format

ImageData is a `Uint8ClampedArray` with RGBA format:
- **Length**: `width * height * 4`
- **Index Calculation**: `(y * width + x) * 4`
- **Channels**: 
  - `[idx]` = Red (0-255)
  - `[idx + 1]` = Green (0-255)
  - `[idx + 2]` = Blue (0-255)
  - `[idx + 3]` = Alpha (0-255)

### Example

For a pixel at (100, 50) on an 800x600 canvas:
```javascript
const x = 100
const y = 50
const width = 800
const idx = (y * width + x) * 4

imageData[idx]     // Red channel
imageData[idx + 1] // Green channel
imageData[idx + 2] // Blue channel
imageData[idx + 3] // Alpha channel
```

## WebGL Rendering Pipeline

### Initialization

1. **Context Creation**: `canvas.getContext('webgl')`
2. **Texture Creation**: `gl.createTexture()`
3. **Shader Compilation**: Vertex and fragment shaders
4. **Program Creation**: Link shaders into program
5. **Initial ImageData**: White pixels (255, 255, 255, 255)

### Update Cycle

1. **Tool Modifies ImageData**: Direct array manipulation
2. **Texture Upload**: `gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData)`
3. **Shader Rendering**: 
   - Bind texture
   - Set up vertex buffers
   - Draw triangles covering canvas
4. **Display**: Canvas shows rendered texture

## State Management

### Component State

- **App Component**:
  - `activeTool` - Selected tool
  - `toolProperties` - Tool-specific property state object
    - Structure: `{ [toolName]: { [propertyKey]: value } }`
    - Each tool maintains its own property values
    - Properties are preserved when switching between tools
    - Initialized from `toolPropertiesRegistry` default values
    - Example structure:
      ```javascript
      {
        brush: { brushSize: 20, opacity: 100, brushColor: '#000000' },
        eraser: { brushSize: 20, opacity: 100 },
        blur: { brushSize: 20 },
        fill: { brushColor: '#000000' }
      }
      ```

### Refs

- **canvasRef**: Reference to canvas DOM element
- **imageDataRef**: Reference to ImageData array (managed by useWebGL)
- **glRef**: Reference to WebGL context (internal to useWebGL)
- **textureRef**: Reference to WebGL texture (internal to useWebGL)

### Data Flow Pattern

```
Props Down, Events Up
  ↓
Component State (App)
  ↓
Props to Child Components
  ↓
Event Handlers Call Parent Functions
  ↓
State Updates
  ↓
Re-render with New Props
```

## Performance Considerations

### ImageData Operations

- **Direct Array Access**: Tools directly modify ImageData array for performance
- **Batch Updates**: Multiple pixel operations in single function call
- **Minimal Allocations**: Reuse ImageData array, avoid creating new arrays

### WebGL Updates

- **Texture Upload**: Only when ImageData changes
- **Shader Reuse**: Shaders compiled once, reused for all renders
- **Efficient Rendering**: Single draw call per update

### Event Handling

- **Coordinate Caching**: Canvas coordinates calculated once per event
- **State Minimization**: Only necessary state in components
- **Callback Optimization**: useCallback for stable function references

## Error Handling

### Tool Functions

- **Null Checks**: All tools check for `imageData` existence
- **Bounds Checking**: Tools verify coordinates are within canvas bounds
- **Early Returns**: Tools return early if conditions aren't met

### WebGL

- **Context Validation**: Checks for WebGL support
- **Shader Compilation Errors**: Logged to console
- **Texture Upload Errors**: Handled gracefully

## Data Flow Summary

| Flow Type | Trigger | Handler | Data Modified | Update Method |
|-----------|---------|---------|--------------|---------------|
| Tool Selection | Toolbar click | App state | `activeTool`, `toolProperties` (preserved) | React re-render |
| Property Change | PropertiesPanel control | App state | `toolProperties[activeTool][propertyKey]` | React re-render |
| Brush Drawing | Mouse drag | useDrawing → brushTool | ImageData | WebGL texture |
| Fractal Generate | Button click | App → fractalTool | ImageData (full) | WebGL texture |
| Fill | Canvas click | useDrawing → fillTool | ImageData (region) | WebGL texture |
| Blur | Mouse drag | useDrawing → blurTool | ImageData (region) | WebGL texture |
