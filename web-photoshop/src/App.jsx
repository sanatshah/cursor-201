import { useState, useRef, useMemo } from "react";
import "./App.css";

import { TOOLS, toolPropertiesRegistry } from "./tools";
import { Toolbar, Canvas, PropertiesPanel } from "./components";
import { useWebGL, useDrawing } from "./hooks";

function App() {
  const canvasRef = useRef(null);

  // Tool state
  const [activeTool, setActiveTool] = useState(TOOLS.BRUSH);

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

  // Get current tool's properties
  const currentToolProperties = useMemo(() => {
    return toolProperties[activeTool] || {};
  }, [activeTool, toolProperties]);

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

  // WebGL hook
  const { imageDataRef, updateTexture, clearCanvas, exportCanvas } =
    useWebGL(canvasRef);

  // Drawing hook
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawing(
    canvasRef,
    imageDataRef,
    updateTexture
  );

  // Wrap handlers to pass current tool properties
  const onMouseDown = (e) =>
    handleMouseDown(e, activeTool, currentToolProperties);
  const onMouseMove = (e) =>
    handleMouseMove(e, activeTool, currentToolProperties);

  return (
    <div className="app">
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />

      <Canvas
        ref={canvasRef}
        activeTool={activeTool}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleMouseUp}
      />

      <PropertiesPanel
        activeTool={activeTool}
        toolProperties={currentToolProperties}
        onPropertyChange={handlePropertyChange}
        onClear={clearCanvas}
        onExport={exportCanvas}
      />
    </div>
  );
}

export default App;
