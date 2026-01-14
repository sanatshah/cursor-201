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
├── index.js              # Tool exports and properties registry
├── brushTool.js          # Brush implementation + properties
├── eraserTool.js         # Eraser properties configuration
├── blurTool.js           # Blur implementation + properties
├── fillTool.js           # Fill implementation + properties
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

1. **Tool Properties Configuration**: Exported object defining tool-specific properties
2. **Tool Function**: Exported function that modifies ImageData
3. **Icon Component**: React component for the toolbar
4. **Registration**: Added to Toolbar component and toolPropertiesRegistry
5. **Handler**: Integrated into useDrawing hook (if mouse-based)

#### Tool Properties Configuration

Each tool defines its own properties configuration that determines what controls appear in the PropertiesPanel. This makes tools completely modular and self-contained.

**Property Configuration Format**:

```javascript
export const toolNameProperties = {
  propertyKey: {
    type: 'slider' | 'color',  // Property type
    label: 'Display Label',    // UI label
    default: defaultValue,      // Default value
    // Type-specific options:
    // For 'slider':
    min: 1,                     // Minimum value
    max: 100,                   // Maximum value
    unit: 'px' | '%',          // Display unit
    // For 'color':
    showSwatches: true          // Show color swatches (optional)
  }
}
```

**Example - Brush Tool Properties**:

```7:30:web-photoshop/src/tools/brushTool.js
export const brushToolProperties = {
  brushSize: {
    type: 'slider',
    label: 'Brush Size',
    min: 1,
    max: 100,
    default: 20,
    unit: 'px'
  },
  opacity: {
    type: 'slider',
    label: 'Opacity',
    min: 1,
    max: 100,
    default: 100,
    unit: '%'
  },
  brushColor: {
    type: 'color',
    label: 'Color',
    default: '#000000',
    showSwatches: true
  }
}
```

**Example - Blur Tool Properties** (simpler, only brush size):

```6:15:web-photoshop/src/tools/blurTool.js
export const blurToolProperties = {
  brushSize: {
    type: "slider",
    label: "Brush Size",
    min: 1,
    max: 100,
    default: 20,
    unit: "px",
  },
};
```

**Example - Fill Tool Properties** (only color):

```7:14:web-photoshop/src/tools/fillTool.js
export const fillToolProperties = {
  brushColor: {
    type: 'color',
    label: 'Color',
    default: '#000000',
    showSwatches: true
  }
}
```

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

#### Tool Properties Registry

All tool properties are registered in `src/tools/index.js` via the `toolPropertiesRegistry`:

```28:34:web-photoshop/src/tools/index.js
// Tool registry - maps tool names to their property configurations
export const toolPropertiesRegistry = {
  [TOOLS.BRUSH]: brushToolProperties,
  [TOOLS.ERASER]: eraserToolProperties,
  [TOOLS.BLUR]: blurToolProperties,
  [TOOLS.FILL]: fillToolProperties
}
```

The registry allows the PropertiesPanel to dynamically render the appropriate controls for each tool.

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

**File**: `src/tools/eraserTool.js`

**Properties**: `eraserToolProperties`

**Properties Configuration**:
- `brushSize` - Size of the eraser in pixels (1-100, default: 20)
- `opacity` - Opacity percentage (1-100, default: 100)

**Function**: Uses `drawBrushStroke` from `brushTool.js` with `isEraser: true`, which sets the color to white (255, 255, 255).

**Note**: The eraser tool has its own properties configuration file but shares the brush tool's drawing function.

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

```1:34:web-photoshop/src/tools/index.js
// Constants - import TOOLS directly so we can use it in the registry
import { TOOLS } from './constants'
export { TOOLS, COLOR_SWATCHES, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

// Icons
export { BrushIcon, EraserIcon, BlurIcon, FillIcon } from './icons'

// Utils
export { hexToRgb, getCursorClass } from './utils'

// Tool functions
export { drawBrushStroke } from './brushTool'
export { applyBlurEffect } from './blurTool'
export { floodFillArea } from './fillTool'

// Tool properties - import directly so we can use them in the registry
import { brushToolProperties } from './brushTool'
import { eraserToolProperties } from './eraserTool'
import { blurToolProperties } from './blurTool'
import { fillToolProperties } from './fillTool'

// Re-export tool properties
export { brushToolProperties } from './brushTool'
export { eraserToolProperties } from './eraserTool'
export { blurToolProperties } from './blurTool'
export { fillToolProperties } from './fillTool'

// Tool registry - maps tool names to their property configurations
export const toolPropertiesRegistry = {
  [TOOLS.BRUSH]: brushToolProperties,
  [TOOLS.ERASER]: eraserToolProperties,
  [TOOLS.BLUR]: blurToolProperties,
  [TOOLS.FILL]: fillToolProperties
}
```

**Key Exports**:
- **Constants**: `TOOLS`, `COLOR_SWATCHES`, `CANVAS_WIDTH`, `CANVAS_HEIGHT`
- **Icons**: All tool icon components
- **Utils**: Shared utility functions
- **Tool Functions**: Drawing/effect functions for each tool
- **Tool Properties**: Property configurations for each tool
- **Tool Properties Registry**: Central registry mapping tools to their property configurations

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
   - **Define tool properties configuration** (export `{toolName}ToolProperties`)
   - Export function that modifies ImageData
   - Follow tool function signature pattern

3. **Create Tool Icon**
   - Create `src/tools/icons/{ToolName}Icon.jsx`
   - Export from `src/tools/icons/index.js`

4. **Export Tool**
   - Add tool function export to `src/tools/index.js`
   - Add tool properties import and export to `src/tools/index.js`
   - Add icon export to `src/tools/index.js`
   - **Register tool in `toolPropertiesRegistry`** in `src/tools/index.js`

5. **Register in Toolbar**
   - Add tool entry to tools array in `src/components/Toolbar.jsx`

6. **Add Handler (if mouse-based)**
   - Add tool handler in `src/hooks/useDrawing.js`
   - Route mouse events to tool function
   - Pass `toolProperties` object to tool function

7. **Add Cursor Class (optional)**
   - Add cursor mapping in `src/tools/utils.js` `getCursorClass` function

**Note**: The PropertiesPanel will automatically render the appropriate controls based on your tool's properties configuration. No manual UI code is needed!

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
