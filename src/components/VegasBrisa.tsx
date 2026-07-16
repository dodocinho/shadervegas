import { extend, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PerspectiveCamera, ShaderMaterial } from "three"
import { VegasMaterial } from '../materials/VegasShaderMaterial'
import type { GeometryMode } from './GeometryToggle'

extend({ VegasMaterial });

/** Distância de referência da câmera (igual à de Camera / App) */
const CAMERA_DISTANCE = 200;
/** Quanto o plano ultrapassa a tela — dá folga para pan */
const PLANE_PAN_MARGIN = 1.5;

type VegasSphereProps = {
  mode?: GeometryMode
}

export const VegasSphere = ({ mode = 'sphere' }: VegasSphereProps) => {
  const ref = useRef<ShaderMaterial | null>(null);
  const { camera, size } = useThree();
  const isSphere = mode === 'sphere';

  const planeSize = useMemo(() => {
    const perspective = camera as PerspectiveCamera;
    const fovRad = ((perspective.fov ?? 50) * Math.PI) / 180;
    const height =
      2 * Math.tan(fovRad / 2) * CAMERA_DISTANCE * PLANE_PAN_MARGIN;
    const width = height * (size.width / Math.max(size.height, 1));
    return [width, height] as const;
  }, [camera, size.width, size.height]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.uniforms.iTime.value = clock.getElapsedTime();
    ref.current.uniforms.iResolution.value = isSphere
      ? [10, 5]
      : [size.width, size.height];
  });

  if (isSphere) {
    return (
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
        <sphereGeometry args={[100, 256, 256]} />
        <vegasMaterial ref={ref} />
      </mesh>
    );
  }

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[planeSize[0], planeSize[1]]} />
      <vegasMaterial ref={ref} />
    </mesh>
  );
}
