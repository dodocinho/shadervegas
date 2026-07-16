export type GeometryMode = 'sphere' | 'plane'

type GeometryToggleProps = {
  mode: GeometryMode
  onToggle: () => void
}

export function GeometryToggle({ mode, onToggle }: GeometryToggleProps) {
  const isSphere = mode === 'sphere'

  return (
    <button
      type="button"
      className="geom-toggle"
      onClick={onToggle}
      aria-label={isSphere ? 'Trocar para plano' : 'Trocar para esfera'}
      title={isSphere ? 'Modo plano' : 'Modo esfera'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          className="geom-toggle__shape"
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            rx: isSphere ? 8.5 : 0,
            ry: isSphere ? 8.5 : 0,
          }}
        />
      </svg>
    </button>
  )
}
