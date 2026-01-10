import { COLOR_SWATCHES } from '../tools'

const ColorSwatches = ({ currentColor, onColorChange }) => {
  return (
    <div className="property-section">
      <span className="property-label">Swatches</span>
      <div className="color-swatches">
        {COLOR_SWATCHES.map((color) => (
          <div
            key={color}
            className={`color-swatch ${currentColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorSwatches
