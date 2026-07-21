import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useAtomValue } from 'jotai'
import { MOUSE } from 'three'
import {
  geometryModeAtom,
  motionEnabledAtom,
  planeMotionPhaseAtom,
} from '../state/controls'
import {
  CAMERA_DISTANCE,
  PLANE_PAN_MARGIN,
  PLANE_REFERENCE_DISTANCE,
} from '../config/scene'

const PAN_PATH_SCALE = 0.82
const MOTION_EASING = 1.8

export function SceneControls() {
  const { camera, size } = useThree()
  const controlsRef = useRef(null)
  const mode = useAtomValue(geometryModeAtom)
  const motionEnabled = useAtomValue(motionEnabledAtom)
  const motionPhase = useAtomValue(planeMotionPhaseAtom)
  const isSphere = mode === 'sphere'

  useEffect(() => {
    camera.position.set(0, 0, CAMERA_DISTANCE)
    camera.up.set(0, 1, 0)
    camera.zoom = 1
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    const controls = controlsRef.current
    if (!controls) return

    controls.target.set(0, 0, 0)
    controls.update()
  }, [mode, camera])

  useFrame(({ clock }, delta) => {
    const controls = controlsRef.current
    if (!controls || isSphere || !motionEnabled) return

    const fov = 'fov' in camera ? camera.fov : 50
    const fovRadians = (fov * Math.PI) / 180
    const baseVisibleHeight = 2 * Math.tan(fovRadians / 2) * CAMERA_DISTANCE
    const planeHeight =
      2 * Math.tan(fovRadians / 2) * PLANE_REFERENCE_DISTANCE * PLANE_PAN_MARGIN
    const aspect = size.width / Math.max(size.height, 1)
    const maxPanY = Math.max((planeHeight - baseVisibleHeight) / 2, 0) * PAN_PATH_SCALE
    const maxPanX = maxPanY * aspect
    const elapsed = clock.getElapsedTime()

    const desiredX = Math.sin(elapsed * 0.24 + motionPhase) * maxPanX
    const desiredY = Math.sin(elapsed * 0.31 + motionPhase * 1.7) * maxPanY
    const desiredZoom = 1.08 + Math.sin(elapsed * 0.42 + motionPhase) * 0.08
    const easing = 1 - Math.exp(-MOTION_EASING * delta)

    camera.position.x += (desiredX - camera.position.x) * easing
    camera.position.y += (desiredY - camera.position.y) * easing
    camera.zoom += (desiredZoom - camera.zoom) * easing
    camera.updateProjectionMatrix()

    controls.target.x = camera.position.x
    controls.target.y = camera.position.y
    controls.target.z = 0
    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={motionEnabled}
      enableRotate={isSphere}
      enableZoom
      enablePan={!isSphere}
      screenSpacePanning
      mouseButtons={
        isSphere
          ? {
              LEFT: MOUSE.ROTATE,
              MIDDLE: MOUSE.DOLLY,
              RIGHT: MOUSE.PAN,
            }
          : {
              LEFT: MOUSE.PAN,
              MIDDLE: MOUSE.DOLLY,
              RIGHT: MOUSE.PAN,
            }
      }
    />
  )
}
