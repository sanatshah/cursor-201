import { TOOLS, BrushIcon, EraserIcon, BlurIcon, FillIcon } from '../tools'

const Toolbar = ({ activeTool, onToolChange }) => {
  const tools = [
    { id: TOOLS.BRUSH, icon: BrushIcon, title: 'Brush (B)' },
    { id: TOOLS.ERASER, icon: EraserIcon, title: 'Eraser (E)' },
    { id: TOOLS.BLUR, icon: BlurIcon, title: 'Blur (U)' },
    { id: TOOLS.FILL, icon: FillIcon, title: 'Fill (G)' }
  ]

  return (
    <div className="toolbar">
      {tools.map(({ id, icon: Icon, title }) => (
        <button
          key={id}
          className={`tool-button ${activeTool === id ? 'active' : ''}`}
          onClick={() => onToolChange(id)}
          title={title}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}

export default Toolbar
