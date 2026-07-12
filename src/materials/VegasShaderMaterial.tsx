import { shaderMaterial } from "@react-three/drei";
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

export const VegasMaterial = shaderMaterial(
  {
    iResolution: [7, 5],
    iTime: 0,
  },
  vertexShader,
  fragmentShader
)

