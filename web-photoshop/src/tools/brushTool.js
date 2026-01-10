import { hexToRgb } from "./utils";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

/**
 * Draw brush stroke using Bresenham's line algorithm
 */
export const drawBrushStroke = ({
  imageData,
  x,
  y,
  prevX,
  prevY,
  brushSize,
  brushColor,
  opacity,
  isEraser = false,
}) => {
  if (!imageData) return;

  const color = isEraser ? { r: 255, g: 255, b: 255 } : hexToRgb(brushColor);
  const alpha = opacity / 100;

  // Bresenham's line algorithm for smooth strokes
  const dx = Math.abs(x - prevX);
  const dy = Math.abs(y - prevY);
  const sx = prevX < x ? 1 : -1;
  const sy = prevY < y ? 1 : -1;
  let err = dx - dy;

  let cx = prevX;
  let cy = prevY;

  while (true) {
    // Draw circle at current position
    for (let i = -brushSize; i <= brushSize; i++) {
      for (let j = -brushSize; j <= brushSize; j++) {
        if (i * i + j * j <= brushSize * brushSize) {
          const px = Math.floor(cx + i);
          const py = Math.floor(cy + j);

          if (px >= 0 && px < CANVAS_WIDTH && py >= 0 && py < CANVAS_HEIGHT) {
            const idx = (py * CANVAS_WIDTH + px) * 4;

            // Distance-based falloff for softer brush
            const dist = Math.sqrt(i * i + j * j);
            const falloff = 1 - dist / brushSize;
            const effectiveAlpha = alpha * falloff;

            // Alpha blending
            imageData[idx] = Math.round(
              imageData[idx] * (1 - effectiveAlpha) + color.r * effectiveAlpha
            );
            imageData[idx + 1] = Math.round(
              imageData[idx + 1] * (1 - effectiveAlpha) +
                color.g * effectiveAlpha
            );
            imageData[idx + 2] = Math.round(
              imageData[idx + 2] * (1 - effectiveAlpha) +
                color.b * effectiveAlpha
            );
          }
        }
      }
    }

    if (cx === x && cy === y) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      cx += sx;
    }
    if (e2 < dx) {
      err += dx;
      cy += sy;
    }
  }
};
