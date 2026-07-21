type GeometryIconProps = {
  isSphere: boolean
}

export function GeometryIcon({ isSphere }: GeometryIconProps) {
  return (
    <svg viewBox="0 0 28 24" aria-hidden="true">
      <rect
        className={`geom-toggle__square${isSphere ? '' : ' is-active'}`}
        x="2"
        y="7"
        width="13"
        height="13"
        rx="1.5"
      />
      <circle
        className={`geom-toggle__circle${isSphere ? ' is-active' : ''}`}
        cx="19"
        cy="8"
        r="6.5"
      />
    </svg>
  )
}
