# Tool Architecture

This document describes the architecture and implementation of tools in Web Photoshop.

## Overview

Tools in Web Photoshop are completely independent modules that can be added or removed without breaking other parts of the codebase. Each tool is self-contained with no interdependencies.

## Tool List

The following tools are currently implemented:

1. **Brush** (`TOOLS.BRUSH`) - Draw strokes with customizable size, color, and opacity
2. **Eraser** (`TOOLS.ERASER`) - Erase parts of the canvas
3. **Blur** (`TOOLS.BLUR`) - Apply blur effects to specific areas
4. **Fill** (`TOOLS.FILL`) - Flood fill areas with color using tolerance-based algorithm
5. **Fractal** (`TOOLS.FRACTAL`) - Generate random fractal patterns to fill the entire canvas

## Tool Structure

### File Organization

```
src/tools/
├── constants.js          # Tool constants and canvas dimensions
├── utils.js              # Shared utility functions
├── index.js              # Tool exports
├── brushTool.js          # Brush implementation
├── blurTool.js           # Blur implementation
├── fillTool.js           # Fill implementation
├── fractalTool.js        # Fractal generation
└── icons/                # Tool icon components
    ├── BrushIcon.jsx
    ├── EraserIcon.jsx
    ├── BlurIcon.jsx
    ├── FillIcon.jsx
    ├── FractalIcon.jsx
    └── index.js
```

### Tool Constants

All tools are defined in `src/tools/constants.js`:

```1:7:web-photoshop/src/tools/constants.js
export const TOOLS = {
  BRUSH: 'brush',
  ERASER: 'eraser',
  BLUR: 'blur',
  FILL: 'fill',
  FRACTAL: 'fractal'
}
```

### Tool Implementation Pattern

Each tool follows a consistent pattern:

1. **Tool Function**: Exported function that modifies ImageData
2. **Icon Component**: React component for the toolbar
3. **Registration**: Added to Toolbar component
4. **Handler**: Integrated into useDrawing hook (if mouse-based)

#### Tool Function Signature

All tool functions accept a single parameter object with destructured properties:

```javascript
export const toolFunctionName = ({
  imageData, // Required: ImageData object to modify
  // ... tool-specific required parameters
}) => {
  if (!imageData) return;
  // Tool implementation - modify imageData directly
};
```

## Tool Implementations

### Brush Tool

**File**: `src/tools/brushTool.js`

**Function**: `drawBrushStroke`

**Parameters**:
- `imageData` - ImageData array to modify
- `x`, `y` - Current position
- `prevX`, `prevY` - Previous position
- `brushSize` - Size of the brush in pixels
- `brushColor` - Hex color string
- `opacity` - Opacity percentage (0-100)
- `isEraser` - Boolean flag for eraser mode

**Algorithm**: Uses Bresenham's line algorithm for smooth strokes with distance-based falloff and alpha blending.

### Eraser Tool

The eraser uses the same `drawBrushStroke` function with `isEraser: true`, which sets the color to white (255, 255, 255).

### Blur Tool

**File**: `src/tools/blurTool.js`

**Function**: `applyBlurEffect`

**Parameters**:
- `imageData` - ImageData array to modify
- `x`, `y` - Center position
- `brushSize` - Radius of blur effect

**Algorithm**: Box blur algorithm that averages surrounding pixels within the brush radius.

### Fill Tool

**File**: `src/tools/fillTool.js`

**Function**: `floodFillArea`

**Parameters**:
- `imageData` - ImageData array to modify
- `startX`, `startY` - Starting position
- `brushColor` - Hex color string to fill with

**Algorithm**: Flood fill algorithm with tolerance-based color matching (32-unit tolerance) using a stack-based approach.

### Fractal Tool

**File**: `src/tools/fractalTool.js`

**Function**: `generateFractalBackground`

**Parameters**:
- `imageData` - ImageData array to modify
- `width` - Canvas width (default: CANVAS_WIDTH)
- `height` - Canvas height (default: CANVAS_HEIGHT)

**Algorithm**: Plasma fractal using midpoint displacement (diamond-square algorithm):
1. Initialize corners with random values
2. Diamond step: Set center of each square as average of corners plus random offset
3. Square step: Set midpoints of edges as average of adjacent points plus random offset
4. Recursively subdivide until pixel-level resolution
5. Map noise values to RGB colors using sine wave color gradient
6. Write RGBA values directly to ImageData

**Note**: Unlike other tools, the fractal tool fills the entire canvas at once and is triggered via a button rather than mouse interaction.

## Tool Icons

Each tool has an associated icon component in `src/tools/icons/`:

- Icons are React functional components
- Use SVG with `viewBox="0 0 24 24"`
- Styled with `stroke="currentColor"` for theming
- Exported from `src/tools/icons/index.js`

Example:

```1:12:web-photoshop/src/tools/icons/FractalIcon.jsx
const FractalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
)

export default FractalIcon
```

## Tool Registration

### Toolbar Registration

Tools are registered in `src/components/Toolbar.jsx`:

```4:10:web-photoshop/src/components/Toolbar.jsx
  const tools = [
    { id: TOOLS.BRUSH, icon: BrushIcon, title: 'Brush (B)' },
    { id: TOOLS.ERASER, icon: EraserIcon, title: 'Eraser (E)' },
    { id: TOOLS.BLUR, icon: BlurIcon, title: 'Blur (U)' },
    { id: TOOLS.FILL, icon: FillIcon, title: 'Fill (G)' },
    { id: TOOLS.FRACTAL, icon: FractalIcon, title: 'Fractal (F)' }
  ]
```

### Tool Exports

Tools are exported from `src/tools/index.js`:

```1:25:web-photoshop/src/tools/index.js
// Constants
export {
  TOOLS,
  COLOR_SWATCHES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./constants";

// Icons
export {
  BrushIcon,
  EraserIcon,
  BlurIcon,
  FillIcon,
  FractalIcon,
} from "./icons";

// Utils
export { hexToRgb, getCursorClass } from "./utils";

// Tool functions
export { drawBrushStroke } from "./brushTool";
export { applyBlurEffect } from "./blurTool";
export { floodFillArea } from "./fillTool";
export { generateFractalBackground } from "./fractalTool";
```

## Tool Execution Flow

### Mouse-Based Tools (Brush, Eraser, Blur, Fill)

1. User selects tool from toolbar
2. User interacts with canvas (mouse down/move/up)
3. `useDrawing` hook routes to appropriate tool handler
4. Tool function modifies `imageDataRef.current`
5. `updateTexture()` is called to update WebGL texture
6. Canvas re-renders with updated texture

### Button-Based Tools (Fractal)

1. User selects fractal tool from toolbar
2. User clicks "Generate Fractal" button in properties panel
3. `handleGenerateFractal` in App.jsx calls `generateFractalBackground`
4. Tool function fills entire `imageDataRef.current` with fractal pattern
5. `updateTexture()` is called to update WebGL texture
6. Canvas re-renders with new fractal pattern

## Adding a New Tool

To add a new tool, follow these steps:

1. **Add Tool Constant**
   - Add tool ID to `TOOLS` object in `src/tools/constants.js`

2. **Create Tool Implementation**
   - Create `src/tools/{toolName}Tool.js`
   - Export function that modifies ImageData
   - Follow tool function signature pattern

3. **Create Tool Icon**
   - Create `src/tools/icons/{ToolName}Icon.jsx`
   - Export from `src/tools/icons/index.js`

4. **Export Tool**
   - Add tool function export to `src/tools/index.js`
   - Add icon export to `src/tools/index.js`

5. **Register in Toolbar**
   - Add tool entry to tools array in `src/components/Toolbar.jsx`

6. **Add Handler (if mouse-based)**
   - Add tool handler in `src/hooks/useDrawing.js`
   - Route mouse events to tool function

7. **Add Cursor Class (optional)**
   - Add cursor mapping in `src/tools/utils.js` `getCursorClass` function

8. **Add UI Controls (if needed)**
   - Add tool-specific controls to `src/components/PropertiesPanel.jsx`

## Tool Dependencies

Tools may ONLY import from:
- `./utils` - Shared utility functions
- `./constants` - Canvas dimensions and constants
- Standard JavaScript/React libraries

Tools MUST NOT:
- Import other tool files
- Share mutable state
- Depend on React components or hooks directly
- Create circular dependencies

## Utility Functions

### `hexToRgb(hex)`
Converts hex color string to RGB object.

**Location**: `src/tools/utils.js`

**Usage**:
```javascript
const color = hexToRgb('#FF0000'); // { r: 255, g: 0, b: 0 }
```

### `getCursorClass(tool)`
Returns CSS class name for tool cursor.

**Location**: `src/tools/utils.js`

**Usage**:
```javascript
const cursorClass = getCursorClass(TOOLS.BRUSH); // 'cursor-brush'
```

## Canvas Dimensions

Canvas dimensions are defined in `src/tools/constants.js`:

- `CANVAS_WIDTH`: 800 pixels
- `CANVAS_HEIGHT`: 600 pixels

These constants are used throughout the codebase to ensure consistency.

## ImageData Format

All tools work with ImageData arrays in RGBA format:
- Each pixel is represented by 4 consecutive array elements
- Index calculation: `(y * width + x) * 4`
- Channels: `[R, G, B, A]` at indices `[idx, idx+1, idx+2, idx+3]`
- Value range: 0-255 for each channel
