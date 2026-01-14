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
- `toolProperties` - Object containing property values for each tool, preserving settings when switching tools
  - Structure: `{ [toolName]: { [propertyKey]: value } }`
  - Initialized from `toolPropertiesRegistry` defaults
  - Example: `{ brush: { brushSize: 20, opacity: 100, brushColor: '#000000' }, blur: { brushSize: 20 } }`

**Hooks Used**:
- `useWebGL` - WebGL context and texture management
- `useDrawing` - Drawing event handlers

**Key Functions**:
- `initializeToolProperties()` - Initializes tool property state from registry defaults
- `handlePropertyChange(propertyKey, value)` - Updates property value for active tool
- `handleGenerateFractal()` - Generates fractal background pattern (if fractal tool exists)

**Component Structure**:

Tool properties are initialized from the registry:

```14:28:web-photoshop/src/App.jsx
  // Initialize tool properties state from registry defaults
  const initializeToolProperties = () => {
    const properties = {};
    Object.entries(toolPropertiesRegistry).forEach(([toolName, toolConfig]) => {
      properties[toolName] = {};
      Object.entries(toolConfig).forEach(([propertyKey, propertyConfig]) => {
        properties[toolName][propertyKey] = propertyConfig.default;
      });
    });
    return properties;
  };

  const [toolProperties, setToolProperties] = useState(() =>
    initializeToolProperties()
  );
```

Property changes update only the active tool's properties:

```35:44:web-photoshop/src/App.jsx
  // Handle property change for current tool
  const handlePropertyChange = (propertyKey, value) => {
    setToolProperties((prev) => ({
      ...prev,
      [activeTool]: {
        ...prev[activeTool],
        [propertyKey]: value,
      },
    }));
  };
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

**Purpose**: Dynamically displays tool properties and provides controls for tool settings based on the active tool's property configuration.

**Props**:
- `activeTool` - Currently selected tool
- `toolProperties` - Object containing current values for the active tool's properties
- `onPropertyChange` - Handler for property changes (propertyKey, value)
- `onClear` - Clear canvas handler
- `onExport` - Export canvas handler

**Features**:
- **Dynamic Property Rendering**: Automatically renders controls based on the active tool's property configuration from `toolPropertiesRegistry`
- **Property Types Supported**:
  - `slider` - Range input with min/max/unit display
  - `color` - Color picker with hex display and optional color swatches
- **Tool-Specific Controls**: Only shows properties defined by the active tool
- **Action Buttons**: Clear Canvas and Export PNG (always visible)

**Implementation**:

The PropertiesPanel uses the `toolPropertiesRegistry` to dynamically render properties:

```1:32:web-photoshop/src/components/PropertiesPanel.jsx
import { toolPropertiesRegistry } from '../tools'
import ColorSwatches from './ColorSwatches'

const PropertiesPanel = ({
  activeTool,
  toolProperties,
  onPropertyChange,
  onClear,
  onExport
}) => {
  const toolConfig = toolPropertiesRegistry[activeTool]
  
  if (!toolConfig) {
    return (
      <div className="properties-panel">
        <div className="property-section">
          <span className="property-label">Tool</span>
          <span className="property-value" style={{ textTransform: 'capitalize' }}>
            {activeTool}
          </span>
        </div>
        <div className="action-buttons">
          <button className="action-button" onClick={onClear}>
            Clear Canvas
          </button>
          <button className="action-button primary" onClick={onExport}>
            Export PNG
          </button>
        </div>
      </div>
    )
  }
```

Properties are rendered dynamically based on the tool's configuration:

```34:86:web-photoshop/src/components/PropertiesPanel.jsx
  const renderProperty = (propertyKey, propertyConfig) => {
    const value = toolProperties[propertyKey]
    const { type, label, min, max, unit, showSwatches } = propertyConfig

    if (type === 'slider') {
      return (
        <div key={propertyKey} className="property-section">
          <span className="property-label">
            {label}: {value}{unit}
          </span>
          <input
            type="range"
            className="property-slider"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onPropertyChange(propertyKey, parseInt(e.target.value))}
          />
        </div>
      )
    }

    if (type === 'color') {
      return (
        <div key={propertyKey} className="property-section">
          <span className="property-label">{label}</span>
          <div className="color-picker-wrapper">
            <div style={{ position: 'relative' }}>
              <input
                type="color"
                className="color-input"
                value={value}
                onChange={(e) => onPropertyChange(propertyKey, e.target.value)}
              />
              <div
                className="color-preview"
                style={{ backgroundColor: value }}
              />
            </div>
            <span className="property-value">{value.toUpperCase()}</span>
          </div>
          {showSwatches && (
            <ColorSwatches
              currentColor={value}
              onColorChange={(color) => onPropertyChange(propertyKey, color)}
            />
          )}
        </div>
      )
    }

    return null
  }
```

**Benefits of Dynamic Rendering**:
- **Modular**: Each tool defines its own properties, no hardcoded UI
- **Extensible**: Add new tools or properties without modifying PropertiesPanel
- **Maintainable**: Property definitions live with tool implementations
- **Type-Safe**: Property types are validated at render time

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
    ├── toolProperties (current tool's property values)
    ├── onPropertyChange (propertyKey, value)
    ├── onClear
    └── onExport
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
