import { atom } from 'jotai'

export type GeometryMode = 'sphere' | 'plane'
export type RotationVelocity = readonly [number, number, number]

export const geometryModeAtom = atom<GeometryMode>('sphere')
export const motionEnabledAtom = atom(true)
export const sphereRotationVelocityAtom = atom<RotationVelocity>([0.12, 0.18, 0.08])
export const planeMotionPhaseAtom = atom(0)
export const rhombusControlsOpenAtom = atom(false)
export const circlesControlsOpenAtom = atom(false)

export const toggleMotionAtom = atom(null, (get, set) => {
  if (get(geometryModeAtom) === 'sphere') {
    const direction = [
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    ] as const
    const magnitude = Math.hypot(...direction) || 1
    const speed = 0.24

    set(sphereRotationVelocityAtom, [
      (direction[0] / magnitude) * speed,
      (direction[1] / magnitude) * speed,
      (direction[2] / magnitude) * speed,
    ])
  } else {
    set(planeMotionPhaseAtom, Math.random() * Math.PI * 2)
  }

  set(motionEnabledAtom, !get(motionEnabledAtom))
})
