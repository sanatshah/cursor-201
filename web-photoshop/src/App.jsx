import { useState, useRef } from 'react'
import './App.css'

import { TOOLS } from './tools'
import { Toolbar, Canvas, PropertiesPanel } from './components'
import { useWebGL, useDrawing } from './hooks'

function App() {
  const canvasRef = useRef(null)
  
  // Tool state
  const [activeTool, setActiveTool] = useState(TOOLS.BRUSH)
  const [brushSize, setBrushSize] = useState(20)
  const [brushColor, setBrushColor] = useState('#000000')
  const [opacity, setOpacity] = useState(100)

  // WebGL hook
  const { imageDataRef, updateTexture, clearCanvas, exportCanvas } = useWebGL(canvasRef)

  // Drawing hook
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawing(
    canvasRef,
    imageDataRef,
    updateTexture
  )

  // Wrap handlers to pass current tool settings
  const onMouseDown = (e) => handleMouseDown(e, activeTool, brushSize, brushColor, opacity)
  const onMouseMove = (e) => handleMouseMove(e, activeTool, brushSize, brushColor, opacity)

  return (
    <div className="app">
      <Toolbar 
        activeTool={activeTool} 
        onToolChange={setActiveTool} 
      />

      <Canvas
        ref={canvasRef}
        activeTool={activeTool}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleMouseUp}
      />

      <PropertiesPanel
        activeTool={activeTool}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        opacity={opacity}
        onOpacityChange={setOpacity}
        brushColor={brushColor}
        onColorChange={setBrushColor}
        onClear={clearCanvas}
        onExport={exportCanvas}
      />
    </div>
  )
}

export default App
