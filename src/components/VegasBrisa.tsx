import { extend, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { BufferGeometry, ShaderMaterial } from "three"
import { VegasMaterial } from '../materials/VegasShaderMaterial'

extend({ VegasMaterial });
export const VegasSphere = () => {
  const ref = useRef<ShaderMaterial | null>(null);
  const refGeometry = useRef<BufferGeometry | null>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.uniforms.iTime.value = clock.getElapsedTime();
    ref.current.uniforms.iResolution.value = [10, 5];
  });

  return (
    <mesh position={[0, 0, 0]} rotation={[Math.PI/2, -Math.PI/2, 0]}>
      {/* <boxBufferGeometry args={[5,5,5]} ref={refGeometry}/> */}
      <sphereGeometry args={[100, 256, 256]} ref={refGeometry} />
      <vegasMaterial ref={ref}/> 
    </mesh>
  );
}
