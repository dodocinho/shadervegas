import { extend, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { useAtomValue } from 'jotai'
import { Mesh, PerspectiveCamera, ShaderMaterial } from "three"
import { VegasMaterial } from '../materials/VegasShaderMaterial'
import {
  geometryModeAtom,
  motionEnabledAtom,
  sphereRotationVelocityAtom,
} from '../state/controls'
import { PLANE_PAN_MARGIN, PLANE_REFERENCE_DISTANCE } from '../config/scene'

extend({ VegasMaterial });

export const VegasSphere = () => {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const { camera, size } = useThree();
  const mode = useAtomValue(geometryModeAtom);
  const motionEnabled = useAtomValue(motionEnabledAtom);
  const rotationVelocity = useAtomValue(sphereRotationVelocityAtom);
  const isSphere = mode === 'sphere';

  const planeSize = useMemo(() => {
    const perspective = camera as PerspectiveCamera;
    const fovRad = ((perspective.fov ?? 50) * Math.PI) / 180;
    const height =
      2 * Math.tan(fovRad / 2) * PLANE_REFERENCE_DISTANCE * PLANE_PAN_MARGIN;
    const width = height * (size.width / Math.max(size.height, 1));
    return [width, height] as const;
  }, [camera, size.width, size.height]);

  useFrame(({ clock }, delta) => {
    if (meshRef.current && isSphere && motionEnabled) {
      meshRef.current.rotation.x += rotationVelocity[0] * delta;
      meshRef.current.rotation.y += rotationVelocity[1] * delta;
      meshRef.current.rotation.z += rotationVelocity[2] * delta;
    }

    if (!materialRef.current) return;
    materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.iResolution.value = isSphere
      ? [10, 5]
      : [size.width, size.height];
  });

  if (isSphere) {
    return (
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, -Math.PI / 2, 0]}
      >
        <sphereGeometry args={[100, 256, 256]} />
        <vegasMaterial ref={materialRef} />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[planeSize[0], planeSize[1]]} />
      <vegasMaterial ref={materialRef} />
    </mesh>
  );
}
