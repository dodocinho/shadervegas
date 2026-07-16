import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MOUSE } from 'three'
import { VegasSphere } from './components/VegasBrisa'
import { GeometryToggle } from './components/GeometryToggle'
import Camera from './components/Camera'
import './App.css'

/** @typedef {'sphere' | 'plane'} GeometryMode */

const CAMERA_DISTANCE = 280

/**
 * @param {{ mode: GeometryMode }} props
 */
function SceneControls({ mode }) {
  const { camera } = useThree()
  const controlsRef = useRef(null)
  const isSphere = mode === 'sphere'

  useEffect(() => {
    camera.position.set(0, 0, CAMERA_DISTANCE)
    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    const controls = controlsRef.current
    if (!controls) return

    controls.target.set(0, 0, 0)
    controls.update()
  }, [mode, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
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

function App() {
  /** @type {[GeometryMode, import('react').Dispatch<import('react').SetStateAction<GeometryMode>>]} */
  const [mode, setMode] = useState('sphere')

  return (
    <div className="app">
      <GeometryToggle
        mode={mode}
        onToggle={() => setMode((m) => (m === 'sphere' ? 'plane' : 'sphere'))}
      />
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} />
        <VegasSphere mode={mode} />
        <SceneControls mode={mode} />
        <Camera distance={CAMERA_DISTANCE} />
      </Canvas>
    </div>
  )
}

export default App
