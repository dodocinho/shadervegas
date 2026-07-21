type SliderIconProps = {
  kind: 'color' | 'neon' | 'orbit' | 'circle-neon' | 'circle-orbit'
}

export function SliderIcon({ kind }: SliderIconProps) {
  if (kind === 'color') {
    return (
      <svg className="slider-icon slider-icon--color" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="10" cy="11" r="6" />
        <circle cx="18" cy="11" r="6" />
        <circle cx="14" cy="18" r="6" />
      </svg>
    )
  }

  if (kind === 'neon') {
    return (
      <svg className="slider-icon slider-icon--neon" viewBox="0 0 28 28" aria-hidden="true">
        <path className="slider-icon__glow" d="M14 2 26 14 14 26 2 14Z" />
        <path d="M14 6 22 14 14 22 6 14Z" />
      </svg>
    )
  }

  if (kind === 'circle-neon') {
    return (
      <svg className="slider-icon slider-icon--neon" viewBox="0 0 28 28" aria-hidden="true">
        <circle className="slider-icon__glow" cx="14" cy="14" r="11" />
        <circle cx="14" cy="14" r="7" />
      </svg>
    )
  }

  if (kind === 'circle-orbit') {
    return (
      <svg className="slider-icon slider-icon--orbit" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="12" />
        <circle cx="14" cy="14" r="7" />
        <circle cx="14" cy="14" r="3" />
        <circle className="slider-icon__star" cx="23" cy="9" r="1.8" />
      </svg>
    )
  }

  return (
    <svg className="slider-icon slider-icon--orbit" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M14 2 26 14 14 26 2 14Z" />
      <path d="M14 7 21 14 14 21 7 14Z" />
      <path d="M14 11 17 14 14 17 11 14Z" />
      <circle className="slider-icon__star" cx="23" cy="9" r="1.8" />
    </svg>
  )
}
