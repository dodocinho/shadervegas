import type { ReactNode } from 'react'

type ToggleControlProps = {
  active: boolean
  label: string
  onToggle: () => void
  children: ReactNode
  className?: string
}

export function ToggleControl({
  active,
  label,
  onToggle,
  children,
  className = '',
}: ToggleControlProps) {
  return (
    <button
      type="button"
      className={`ui-control ${className}${active ? ' is-active' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={active}
      title={label}
    >
      {children}
      <span className="visually-hidden">{label}</span>
    </button>
  )
}
