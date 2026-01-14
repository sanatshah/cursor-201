/**
 * Eraser tool properties configuration
 * Note: Eraser uses the same drawBrushStroke function as brush tool
 */
export const eraserToolProperties = {
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
  }
}
