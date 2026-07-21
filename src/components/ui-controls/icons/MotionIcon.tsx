type MotionIconProps = {
  active: boolean
}

export function MotionIcon({ active }: MotionIconProps) {
  return (
    <svg className="motion-icon" viewBox="0 0 28 24" aria-hidden="true">
      <path
        className="motion-icon__wing motion-icon__wing--left"
        d="M3 8 C7 8, 10 11, 14 16"
      />
      <path
        className="motion-icon__wing motion-icon__wing--right"
        d="M14 16 C18 11, 21 8, 25 8"
      />
      {active && <circle className="motion-icon__body" cx="14" cy="15.5" r="1.35" />}
    </svg>
  )
}
