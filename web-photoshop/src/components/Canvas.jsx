import { forwardRef } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, getCursorClass } from '../tools'

const Canvas = forwardRef(({ 
  activeTool, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp 
}, ref) => {
  return (
    <div className="canvas-container">
      <div className="canvas-header">
        WebGL Photoshop - {CANVAS_WIDTH} x {CANVAS_HEIGHT}px
      </div>
      <div className="canvas-wrapper">
        <canvas
          ref={ref}
          className={`drawing-canvas ${getCursorClass(activeTool)}`}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
      </div>
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas
