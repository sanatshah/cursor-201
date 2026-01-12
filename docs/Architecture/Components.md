# Component Architecture

This document describes the component structure and architecture of Web Photoshop.

## Overview

Web Photoshop uses a component-based architecture with React. The application is organized into reusable components, custom hooks, and tool modules.

## Component Structure

```
src/
├── components/              # React components
│   ├── Canvas.jsx          # Canvas rendering component
│   ├── Toolbar.jsx         # Tool selection toolbar
│   ├── PropertiesPanel.jsx # Tool properties and settings
│   ├── ColorSwatches.jsx    # Color swatch picker
│   └── index.js            # Component exports
├── hooks/                  # Custom React hooks
│   ├── useWebGL.js         # WebGL initialization and management
│   ├── useDrawing.js       # Drawing event handlers
│   └── index.js            # Hook exports
├── tools/                   # Tool implementations (see Tools.md)
└── App.jsx                  # Main application component
```

## Main Components

### App.jsx

**Location**: `src/App.jsx`

**Purpose**: Main application component that orchestrates all other components and manages application state.

**State Management**:
- `activeTool` - Currently selected tool
- `brushSize` - Brush size in pixels
- `brushColor` - Selected color (hex string)
- `opacity` - Opacity percentage (0-100)

**Hooks Used**:
- `useWebGL` - WebGL context and texture management
- `useDrawing` - Drawing event handlers

**Key Functions**:
- `handleGenerateFractal()` - Generates fractal background pattern

**Component Structure**:
```27:37:web-photoshop/src/App.jsx
  // Fractal generation handler
  const handleGenerateFractal = () => {
    if (imageDataRef.current) {
      generateFractalBackground({
        imageData: imageDataRef.current,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
      })
      updateTexture()
    }
  }
```

### Canvas.jsx

**Location**: `src/components/Canvas.jsx`

**Purpose**: Renders the WebGL canvas and handles mouse events.

**Props**:
- `activeTool` - Currently selected tool (for cursor styling)
- `onMouseDown` - Mouse down event handler
- `onMouseMove` - Mouse move event handler
- `onMouseUp` - Mouse up event handler

**Features**:
- WebGL canvas with fixed dimensions (800x600)
- Dynamic cursor class based on active tool
- Mouse event forwarding to parent component

**Implementation**:
```4:29:web-photoshop/src/components/Canvas.jsx
const Canvas = forwardRef(({ 
  activeTool, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp 
}, ref) => {
  return (
    <div className="canvas-container">
      <div className="canvas-header">
        WebGL Photoshop - {CANVAS_WIDTH} x {CANVAS_HEIGHT}px
      </div>
      <div className="canvas-wrapper">
        <canvas
          ref={ref}
          className={`drawing-canvas ${getCursorClass(activeTool)}`}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
      </div>
    </div>
  )
})
```

### Toolbar.jsx

**Location**: `src/components/Toolbar.jsx`

**Purpose**: Displays available tools and allows tool selection.

**Props**:
- `activeTool` - Currently selected tool
- `onToolChange` - Callback when tool is selected

**Features**:
- Visual tool buttons with icons
- Active tool highlighting
- Tooltips with keyboard shortcuts

**Implementation**:
```3:24:web-photoshop/src/components/Toolbar.jsx
const Toolbar = ({ activeTool, onToolChange }) => {
  const tools = [
    { id: TOOLS.BRUSH, icon: BrushIcon, title: 'Brush (B)' },
    { id: TOOLS.ERASER, icon: EraserIcon, title: 'Eraser (E)' },
    { id: TOOLS.BLUR, icon: BlurIcon, title: 'Blur (U)' },
    { id: TOOLS.FILL, icon: FillIcon, title: 'Fill (G)' },
    { id: TOOLS.FRACTAL, icon: FractalIcon, title: 'Fractal (F)' }
  ]

  return (
    <div className="toolbar">
      {tools.map(({ id, icon: Icon, title }) => (
        <button
          key={id}
          className={`tool-button ${activeTool === id ? 'active' : ''}`}
          onClick={() => onToolChange(id)}
          title={title}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
```

### PropertiesPanel.jsx

**Location**: `src/components/PropertiesPanel.jsx`

**Purpose**: Displays tool properties and provides controls for tool settings.

**Props**:
- `activeTool` - Currently selected tool
- `brushSize` - Current brush size
- `onBrushSizeChange` - Brush size change handler
- `opacity` - Current opacity
- `onOpacityChange` - Opacity change handler
- `brushColor` - Current color
- `onColorChange` - Color change handler
- `onClear` - Clear canvas handler
- `onExport` - Export canvas handler
- `onGenerateFractal` - Fractal generation handler (for fractal tool)

**Features**:
- Tool-specific controls (conditional rendering)
- Brush size slider (1-100px)
- Opacity slider (1-100%)
- Color picker with hex display
- Color swatches for quick selection
- Action buttons (Clear, Export)
- Fractal generation button (when fractal tool is active)

**Implementation**:
```70:76:web-photoshop/src/components/PropertiesPanel.jsx
      {activeTool === TOOLS.FRACTAL && (
        <div className="property-section">
          <button className="action-button primary" onClick={onGenerateFractal}>
            Generate Fractal
          </button>
        </div>
      )}
```

### ColorSwatches.jsx

**Location**: `src/components/ColorSwatches.jsx`

**Purpose**: Provides quick color selection via predefined color swatches.

**Props**:
- `currentColor` - Currently selected color
- `onColorChange` - Color change handler

**Features**:
- Predefined color palette
- Visual selection indicator
- Click to select color

## Custom Hooks

### useWebGL

**Location**: `src/hooks/useWebGL.js`

**Purpose**: Manages WebGL context, texture, and rendering pipeline.

**Returns**:
- `imageDataRef` - Reference to ImageData array
- `updateTexture()` - Function to update WebGL texture
- `clearCanvas()` - Function to clear canvas to white
- `exportCanvas()` - Function to export canvas as PNG

**Key Features**:
- WebGL context initialization
- Texture creation and management
- Shader compilation and program creation
- ImageData to texture conversion
- Texture rendering to canvas

**Usage**:
```18:18:web-photoshop/src/App.jsx
  const { imageDataRef, updateTexture, clearCanvas, exportCanvas } = useWebGL(canvasRef)
```

### useDrawing

**Location**: `src/hooks/useDrawing.js`

**Purpose**: Handles mouse events and routes them to appropriate tool functions.

**Parameters**:
- `canvasRef` - Reference to canvas element
- `imageDataRef` - Reference to ImageData array
- `updateTexture` - Function to update WebGL texture

**Returns**:
- `handleMouseDown` - Mouse down event handler
- `handleMouseMove` - Mouse move event handler
- `handleMouseUp` - Mouse up event handler

**Key Features**:
- Coordinate transformation (screen to canvas)
- Tool routing based on active tool
- Drawing state management
- Tool function invocation

**Usage**:
```21:25:web-photoshop/src/App.jsx
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawing(
    canvasRef,
    imageDataRef,
    updateTexture
  )
```

## Component Data Flow

### Tool Selection Flow

1. User clicks tool in `Toolbar`
2. `onToolChange` callback updates `activeTool` state in `App`
3. `activeTool` prop passed to `Canvas`, `Toolbar`, and `PropertiesPanel`
4. Components update UI to reflect selected tool

### Drawing Flow

1. User interacts with `Canvas` (mouse events)
2. `Canvas` forwards events to `App` handlers
3. `App` calls `useDrawing` hook handlers with tool settings
4. `useDrawing` routes to appropriate tool function
5. Tool function modifies `imageDataRef.current`
6. `updateTexture()` updates WebGL texture
7. Canvas re-renders with updated texture

### Fractal Generation Flow

1. User selects fractal tool in `Toolbar`
2. `PropertiesPanel` shows "Generate Fractal" button
3. User clicks button
4. `onGenerateFractal` callback in `App` calls `generateFractalBackground`
5. Tool function fills `imageDataRef.current` with fractal pattern
6. `updateTexture()` updates WebGL texture
7. Canvas re-renders with new fractal pattern

## Component Communication

### Props Flow

```
App
├── Toolbar (activeTool, onToolChange)
├── Canvas (activeTool, onMouseDown, onMouseMove, onMouseUp)
└── PropertiesPanel
    ├── activeTool
    ├── brushSize, onBrushSizeChange
    ├── opacity, onOpacityChange
    ├── brushColor, onColorChange
    ├── onClear
    ├── onExport
    └── onGenerateFractal
```

### State Management

- **Local State**: Component-level state using `useState`
- **Refs**: Canvas and ImageData references using `useRef`
- **No Global State**: No Redux, Context, or other global state management

## Styling

Components use CSS classes defined in:
- `src/App.css` - Main application styles
- `src/index.css` - Global styles

CSS classes follow BEM-like naming:
- `.toolbar` - Toolbar container
- `.tool-button` - Individual tool button
- `.tool-button.active` - Active tool button
- `.properties-panel` - Properties panel container
- `.property-section` - Property section
- `.action-button` - Action button
- `.action-button.primary` - Primary action button

## Component Best Practices

1. **Single Responsibility**: Each component has a single, well-defined purpose
2. **Props Interface**: Clear, documented prop interfaces
3. **Event Handling**: Events are handled at appropriate levels
4. **Reusability**: Components are designed for reuse
5. **Separation of Concerns**: UI components separate from business logic
6. **Forward Refs**: Canvas uses `forwardRef` for ref forwarding
