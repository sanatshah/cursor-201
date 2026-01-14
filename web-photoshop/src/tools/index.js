// Constants - import TOOLS directly so we can use it in the registry
import { TOOLS } from './constants'
export { TOOLS, COLOR_SWATCHES, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

// Icons
export { BrushIcon, EraserIcon, BlurIcon, FillIcon } from './icons'

// Utils
export { hexToRgb, getCursorClass } from './utils'

// Tool functions
export { drawBrushStroke } from './brushTool'
export { applyBlurEffect } from './blurTool'
export { floodFillArea } from './fillTool'

// Tool properties - import directly so we can use them in the registry
import { brushToolProperties } from './brushTool'
import { eraserToolProperties } from './eraserTool'
import { blurToolProperties } from './blurTool'
import { fillToolProperties } from './fillTool'

// Re-export tool properties
export { brushToolProperties } from './brushTool'
export { eraserToolProperties } from './eraserTool'
export { blurToolProperties } from './blurTool'
export { fillToolProperties } from './fillTool'

// Tool registry - maps tool names to their property configurations
export const toolPropertiesRegistry = {
  [TOOLS.BRUSH]: brushToolProperties,
  [TOOLS.ERASER]: eraserToolProperties,
  [TOOLS.BLUR]: blurToolProperties,
  [TOOLS.FILL]: fillToolProperties
}
