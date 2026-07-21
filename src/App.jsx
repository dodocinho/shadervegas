import { Canvas } from '@react-three/fiber'
import { VegasSphere } from './components/VegasBrisa'
import { SceneControls } from './components/SceneControls'
import { UIControls } from './components/ui-controls'
import Camera from './components/Camera'
import { CAMERA_DISTANCE } from './config/scene'
import './App.css'

function App() {
  return (
    <div className="app">
      <UIControls />
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} />
        <VegasSphere />
        <SceneControls />
        <Camera distance={CAMERA_DISTANCE} />
      </Canvas>
    </div>
  )
}

export default App
