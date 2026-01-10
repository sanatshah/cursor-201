import { useRef, useEffect, useCallback } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../tools'

// Vertex shader for rendering texture
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`

// Fragment shader for rendering texture
const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
  }
`

const useWebGL = (canvasRef) => {
  const glRef = useRef(null)
  const textureRef = useRef(null)
  const frameBufferRef = useRef(null)
  const imageDataRef = useRef(null)

  // Compile shader
  const compileShader = useCallback((gl, source, type) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }, [])

  // Create shader program
  const createProgram = useCallback((gl, vertexSource, fragmentSource) => {
    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return null
    }
    return program
  }, [compileShader])

  // Render texture to canvas
  const renderTexture = useCallback((gl) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
    gl.useProgram(program)

    // Set up position buffer
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Set up texCoord buffer (flipped Y for correct orientation)
    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 1, 1, 1, 0, 0,
      0, 0, 1, 1, 1, 0
    ]), gl.STATIC_DRAW)

    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

    // Bind texture
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0)

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    // Cleanup
    gl.deleteBuffer(positionBuffer)
    gl.deleteBuffer(texCoordBuffer)
    gl.deleteProgram(program)
  }, [createProgram])

  // Update texture and render
  const updateTexture = useCallback(() => {
    const gl = glRef.current
    const imageData = imageDataRef.current
    if (!gl || !imageData) return

    gl.bindTexture(gl.TEXTURE_2D, textureRef.current)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CANVAS_WIDTH, CANVAS_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData)
    renderTexture(gl)
  }, [renderTexture])

  // Clear canvas to white
  const clearCanvas = useCallback(() => {
    const imageData = imageDataRef.current
    if (!imageData) return

    for (let i = 0; i < imageData.length; i += 4) {
      imageData[i] = 255
      imageData[i + 1] = 255
      imageData[i + 2] = 255
      imageData[i + 3] = 255
    }

    updateTexture()
  }, [updateTexture])

  // Export canvas as PNG
  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'artwork.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [canvasRef])

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }
    glRef.current = gl

    // Create texture for drawing
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // Initialize with white
    const whitePixels = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT * 4)
    for (let i = 0; i < whitePixels.length; i += 4) {
      whitePixels[i] = 255     // R
      whitePixels[i + 1] = 255 // G
      whitePixels[i + 2] = 255 // B
      whitePixels[i + 3] = 255 // A
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CANVAS_WIDTH, CANVAS_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixels)
    textureRef.current = texture
    imageDataRef.current = whitePixels

    // Create framebuffer
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    frameBufferRef.current = framebuffer

    // Initial render
    renderTexture(gl)

    return () => {
      gl.deleteTexture(texture)
      gl.deleteFramebuffer(framebuffer)
    }
  }, [canvasRef, renderTexture])

  return {
    imageDataRef,
    updateTexture,
    clearCanvas,
    exportCanvas
  }
}

export default useWebGL
