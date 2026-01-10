/**
 * Parse hex color to RGB object
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

/**
 * Get cursor class based on active tool
 */
export const getCursorClass = (tool) => {
  const cursorMap = {
    brush: 'cursor-brush',
    eraser: 'cursor-eraser',
    blur: 'cursor-blur',
    fill: 'cursor-fill'
  }
  return cursorMap[tool] || ''
}
