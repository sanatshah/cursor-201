import { toolPropertiesRegistry } from "../tools";
import ColorSwatches from "./ColorSwatches";

const PropertiesPanel = ({
  activeTool,
  toolProperties,
  onPropertyChange,
  onClear,
  onExport,
}) => {
  const toolConfig = toolPropertiesRegistry[activeTool];

  if (!toolConfig) {
    return (
      <div className="properties-panel">
        <div className="property-section">
          <span className="property-label">Tool</span>
          <span
            className="property-value"
            style={{ textTransform: "capitalize" }}
          >
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
    );
  }

  const renderProperty = (propertyKey, propertyConfig) => {
    const value = toolProperties[propertyKey];
    const { type, label, min, max, unit, showSwatches } = propertyConfig;

    if (type === "slider") {
      return (
        <div key={propertyKey} className="property-section">
          <span className="property-label">
            {label}: {value}
            {unit}
          </span>
          <input
            type="range"
            className="property-slider"
            min={min}
            max={max}
            value={value}
            onChange={(e) =>
              onPropertyChange(propertyKey, parseInt(e.target.value))
            }
          />
        </div>
      );
    }

    if (type === "color") {
      return (
        <div key={propertyKey} className="property-section">
          <span className="property-label">{label}</span>
          {showSwatches && (
            <ColorSwatches
              currentColor={value}
              onColorChange={(color) => onPropertyChange(propertyKey, color)}
            />
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="properties-panel">
      <div className="property-section">
        <span className="property-label">Tool</span>
        <span
          className="property-value"
          style={{ textTransform: "capitalize" }}
        >
          {activeTool}
        </span>
      </div>

      {Object.entries(toolConfig).map(([propertyKey, propertyConfig]) =>
        renderProperty(propertyKey, propertyConfig)
      )}

      <div className="action-buttons">
        <button className="action-button" onClick={onClear}>
          Clear Canvas
        </button>
        <button className="action-button primary" onClick={onExport}>
          Export PNG
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
