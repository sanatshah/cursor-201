import { useState, useRef, useCallback } from 'react'
import { TOOLS, drawBrushStroke, applyBlurEffect, floodFillArea } from '../tools'

const useDrawing = (canvasRef, imageDataRef, updateTexture) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  // Get canvas coordinates from mouse event
  const getCanvasCoords = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    // Scale mouse position to canvas coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [canvasRef])

  // Draw brush stroke
  const drawBrush = useCallback((x, y, prevX, prevY, brushSize, brushColor, opacity, isEraser = false) => {
    const imageData = imageDataRef.current
    if (!imageData) return

    drawBrushStroke({
      imageData,
      x,
      y,
      prevX,
      prevY,
      brushSize,
      brushColor,
      opacity,
      isEraser
    })

    updateTexture()
  }, [imageDataRef, updateTexture])

  // Apply blur effect
  const applyBlur = useCallback((x, y, brushSize) => {
    const imageData = imageDataRef.current
    if (!imageData) return

    applyBlurEffect({ imageData, x, y, brushSize })
    updateTexture()
  }, [imageDataRef, updateTexture])

  // Flood fill
  const floodFill = useCallback((startX, startY, brushColor) => {
    const imageData = imageDataRef.current
    if (!imageData) return

    floodFillArea({ imageData, startX, startY, brushColor })
    updateTexture()
  }, [imageDataRef, updateTexture])

  // Mouse down handler
  const handleMouseDown = useCallback((e, activeTool, brushSize, brushColor, opacity) => {
    const coords = getCanvasCoords(e)

    if (activeTool === TOOLS.FILL) {
      floodFill(coords.x, coords.y, brushColor)
      return
    }

    setIsDrawing(true)
    lastPosRef.current = coords

    if (activeTool === TOOLS.BRUSH) {
      drawBrush(coords.x, coords.y, coords.x, coords.y, brushSize, brushColor, opacity)
    } else if (activeTool === TOOLS.ERASER) {
      drawBrush(coords.x, coords.y, coords.x, coords.y, brushSize, brushColor, opacity, true)
    } else if (activeTool === TOOLS.BLUR) {
      applyBlur(coords.x, coords.y, brushSize)
    }
  }, [getCanvasCoords, drawBrush, applyBlur, floodFill])

  // Mouse move handler
  const handleMouseMove = useCallback((e, activeTool, brushSize, brushColor, opacity) => {
    if (!isDrawing) return

    const coords = getCanvasCoords(e)

    if (activeTool === TOOLS.BRUSH) {
      drawBrush(coords.x, coords.y, lastPosRef.current.x, lastPosRef.current.y, brushSize, brushColor, opacity)
    } else if (activeTool === TOOLS.ERASER) {
      drawBrush(coords.x, coords.y, lastPosRef.current.x, lastPosRef.current.y, brushSize, brushColor, opacity, true)
    } else if (activeTool === TOOLS.BLUR) {
      applyBlur(coords.x, coords.y, brushSize)
    }

    lastPosRef.current = coords
  }, [isDrawing, getCanvasCoords, drawBrush, applyBlur])

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}

export default useDrawing
