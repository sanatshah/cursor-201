# Web Photoshop - Welcome

A web-based image editing application built with React and WebGL, providing a Photoshop-like experience in the browser.

## Overview

Web Photoshop is a modern, browser-based image editing tool that combines React for UI management and WebGL for high-performance canvas rendering. The application provides a variety of drawing and editing tools, including brushes, erasers, blur effects, fill tools, and fractal background generation.

## Features

### Drawing Tools

- **Brush Tool** - Draw with customizable size, color, and opacity
- **Eraser Tool** - Erase parts of the canvas
- **Blur Tool** - Apply blur effects to specific areas
- **Fill Tool** - Flood fill areas with color
- **Fractal Background Tool** - Generate random fractal patterns to fill the entire canvas

### Canvas Features

- **WebGL Rendering** - High-performance canvas rendering using WebGL
- **Real-time Updates** - Immediate visual feedback for all tool operations
- **Export Functionality** - Export your artwork as PNG images
- **Clear Canvas** - Reset the canvas to a blank white background

### User Interface

- **Toolbar** - Quick access to all available tools
- **Properties Panel** - Configure tool settings (brush size, opacity, color)
- **Color Swatches** - Quick color selection
- **Color Picker** - Full color selection with hex code display

## Project Structure

```
web-photoshop/
├── src/
│   ├── components/          # React components
│   │   ├── Canvas.jsx       # Canvas component with WebGL rendering
│   │   ├── Toolbar.jsx      # Tool selection toolbar
│   │   ├── PropertiesPanel.jsx  # Tool properties and settings
│   │   └── ColorSwatches.jsx   # Color swatch picker
│   ├── hooks/               # Custom React hooks
│   │   ├── useWebGL.js      # WebGL initialization and texture management
│   │   └── useDrawing.js    # Drawing event handlers and tool routing
│   ├── tools/               # Tool implementations
│   │   ├── constants.js     # Tool constants and canvas dimensions
│   │   ├── utils.js         # Utility functions
│   │   ├── brushTool.js     # Brush stroke implementation
│   │   ├── blurTool.js      # Blur effect implementation
│   │   ├── fillTool.js      # Flood fill implementation
│   │   ├── fractalTool.js   # Fractal background generation
│   │   └── icons/           # Tool icon components
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd web-photoshop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Basic Drawing

1. Select a tool from the toolbar (Brush, Eraser, Blur, Fill, or Fractal)
2. Adjust tool properties in the properties panel:
   - **Brush Size**: Control the size of your brush strokes
   - **Opacity**: Control the transparency of your strokes
   - **Color**: Select a color using the color picker or swatches
3. Click and drag on the canvas to draw

### Fractal Backgrounds

1. Select the **Fractal** tool from the toolbar
2. Click the **Generate Fractal** button in the properties panel
3. A new random fractal pattern will fill the entire canvas
4. Click the button again to generate a different pattern

### Exporting Your Work

1. Click the **Export PNG** button in the properties panel
2. Your artwork will be downloaded as `artwork.png`

### Clearing the Canvas

1. Click the **Clear Canvas** button in the properties panel
2. The canvas will be reset to a white background

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **WebGL** - High-performance canvas rendering
- **JavaScript/ES6+** - Programming language

## Canvas Specifications

- **Width**: 800 pixels
- **Height**: 600 pixels
- **Format**: RGBA (32-bit color with alpha channel)

## Browser Support

Web Photoshop requires a modern browser with WebGL support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development

See the [Architecture Documentation](./Architecture/) for detailed information about:
- Tool architecture and implementation
- Component structure and data flow
- How to add new tools
- WebGL rendering pipeline

## License

This project is part of a development workspace.
