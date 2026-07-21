import { shaderMaterial } from "@react-three/drei";
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

export const VegasMaterial = shaderMaterial(
  {
    iResolution: [7, 5],
    iTime: 0,
    rhombusColorFlux: 0,
    rhombusBodyPulse: 0.5,
    rhombusOrbitIntensity: 0,
    circleColorChange: 0,
    circleBodyChange: 0.5,
    circleOrbitChange: 0,
  },
  vertexShader,
  fragmentShader
)

