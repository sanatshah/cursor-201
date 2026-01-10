import ColorSwatches from './ColorSwatches'

const PropertiesPanel = ({
  activeTool,
  brushSize,
  onBrushSizeChange,
  opacity,
  onOpacityChange,
  brushColor,
  onColorChange,
  onClear,
  onExport
}) => {
  return (
    <div className="properties-panel">
      <div className="property-section">
        <span className="property-label">Tool</span>
        <span className="property-value" style={{ textTransform: 'capitalize' }}>
          {activeTool}
        </span>
      </div>

      <div className="property-section">
        <span className="property-label">Brush Size: {brushSize}px</span>
        <input
          type="range"
          className="property-slider"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
        />
      </div>

      <div className="property-section">
        <span className="property-label">Opacity: {opacity}%</span>
        <input
          type="range"
          className="property-slider"
          min="1"
          max="100"
          value={opacity}
          onChange={(e) => onOpacityChange(parseInt(e.target.value))}
        />
      </div>

      <div className="property-section">
        <span className="property-label">Color</span>
        <div className="color-picker-wrapper">
          <div style={{ position: 'relative' }}>
            <input
              type="color"
              className="color-input"
              value={brushColor}
              onChange={(e) => onColorChange(e.target.value)}
            />
            <div
              className="color-preview"
              style={{ backgroundColor: brushColor }}
            />
          </div>
          <span className="property-value">{brushColor.toUpperCase()}</span>
        </div>
      </div>

      <ColorSwatches currentColor={brushColor} onColorChange={onColorChange} />

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

export default PropertiesPanel
