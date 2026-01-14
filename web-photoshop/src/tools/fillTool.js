import { hexToRgb } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

/**
 * Fill tool properties configuration
 */
export const fillToolProperties = {
  brushColor: {
    type: 'color',
    label: 'Color',
    default: '#000000',
    showSwatches: true
  }
}

/**
 * Flood fill algorithm
 */
export const floodFillArea = ({ imageData, startX, startY, brushColor }) => {
  if (!imageData) return

  const x = Math.floor(startX)
  const y = Math.floor(startY)
  const targetColor = {
    r: imageData[(y * CANVAS_WIDTH + x) * 4],
    g: imageData[(y * CANVAS_WIDTH + x) * 4 + 1],
    b: imageData[(y * CANVAS_WIDTH + x) * 4 + 2]
  }
  const fillColor = hexToRgb(brushColor)

  // Don't fill if colors are the same
  if (targetColor.r === fillColor.r &&
      targetColor.g === fillColor.g &&
      targetColor.b === fillColor.b) return

  const tolerance = 32
  const colorsMatch = (idx) => {
    return Math.abs(imageData[idx] - targetColor.r) <= tolerance &&
           Math.abs(imageData[idx + 1] - targetColor.g) <= tolerance &&
           Math.abs(imageData[idx + 2] - targetColor.b) <= tolerance
  }

  const stack = [[x, y]]
  const visited = new Set()

  while (stack.length > 0) {
    const [cx, cy] = stack.pop()
    const key = `${cx},${cy}`

    if (visited.has(key)) continue
    if (cx < 0 || cx >= CANVAS_WIDTH || cy < 0 || cy >= CANVAS_HEIGHT) continue

    const idx = (cy * CANVAS_WIDTH + cx) * 4
    if (!colorsMatch(idx)) continue

    visited.add(key)
    imageData[idx] = fillColor.r
    imageData[idx + 1] = fillColor.g
    imageData[idx + 2] = fillColor.b

    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
  }
}
