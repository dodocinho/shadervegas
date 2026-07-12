import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { VegasSphere } from './components/VegasBrisa'
import Camera from './components/Camera'
import './App.css'

function Scene() {
  return (
    <VegasSphere />
  )
}

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} />
      <Scene />
      <OrbitControls />
      <Camera />
    </Canvas>
  )
}

export default App
