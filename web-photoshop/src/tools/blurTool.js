import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

/**
 * Apply blur effect at specified position
 */
export const applyBlurEffect = ({ imageData, x, y, brushSize }) => {
  if (!imageData) return

  const radius = brushSize
  const blurRadius = 3

  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      if (i * i + j * j <= radius * radius) {
        const px = Math.floor(x + i)
        const py = Math.floor(y + j)

        if (px >= blurRadius && px < CANVAS_WIDTH - blurRadius &&
            py >= blurRadius && py < CANVAS_HEIGHT - blurRadius) {

          let r = 0, g = 0, b = 0, count = 0

          // Box blur
          for (let bi = -blurRadius; bi <= blurRadius; bi++) {
            for (let bj = -blurRadius; bj <= blurRadius; bj++) {
              const idx = ((py + bj) * CANVAS_WIDTH + (px + bi)) * 4
              r += imageData[idx]
              g += imageData[idx + 1]
              b += imageData[idx + 2]
              count++
            }
          }

          const idx = (py * CANVAS_WIDTH + px) * 4
          imageData[idx] = Math.round(r / count)
          imageData[idx + 1] = Math.round(g / count)
          imageData[idx + 2] = Math.round(b / count)
        }
      }
    }
  }
}
