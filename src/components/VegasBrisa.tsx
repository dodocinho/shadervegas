import { extend, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { useAtomValue } from 'jotai'
import { Group, PerspectiveCamera, ShaderMaterial } from "three"
import { VegasMaterial } from '../materials/VegasShaderMaterial'
import {
  circleBodyChangeAtom,
  circleColorChangeAtom,
  circleOrbitChangeAtom,
  geometryModeAtom,
  motionEnabledAtom,
  rhombusBodyPulseAtom,
  rhombusColorFluxAtom,
  sphereRotationVelocityAtom,
  rhombusOrbitIntensityAtom,
} from '../state/controls'
import { PLANE_PAN_MARGIN, PLANE_REFERENCE_DISTANCE } from '../config/scene'

extend({ VegasMaterial });

export const VegasSphere = () => {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const sphereRotationRef = useRef<Group | null>(null);
  const { camera, size } = useThree();
  const mode = useAtomValue(geometryModeAtom);
  const motionEnabled = useAtomValue(motionEnabledAtom);
  const rotationVelocity = useAtomValue(sphereRotationVelocityAtom);
  const rhombusColorFlux = useAtomValue(rhombusColorFluxAtom);
  const rhombusBodyPulse = useAtomValue(rhombusBodyPulseAtom);
  const rhombusOrbitIntensity = useAtomValue(rhombusOrbitIntensityAtom);
  const circleColorChange = useAtomValue(circleColorChangeAtom);
  const circleBodyChange = useAtomValue(circleBodyChangeAtom);
  const circleOrbitChange = useAtomValue(circleOrbitChangeAtom);
  const isSphere = mode === 'sphere';

  const sphereYOffset = useMemo(() => {
    const perspective = camera as PerspectiveCamera;
    const fovRad = ((perspective.fov ?? 50) * Math.PI) / 180;
    const distance = Math.abs(perspective.position.z);
    const visibleHeight = 2 * Math.tan(fovRad / 2) * distance;
    const headerHeight = size.width <= 520 ? 60 : 64;

    return -(headerHeight / 2) * (visibleHeight / Math.max(size.height, 1));
  }, [camera, size.height, size.width]);

  const planeSize = useMemo(() => {
    const perspective = camera as PerspectiveCamera;
    const fovRad = ((perspective.fov ?? 50) * Math.PI) / 180;
    const height =
      2 * Math.tan(fovRad / 2) * PLANE_REFERENCE_DISTANCE * PLANE_PAN_MARGIN;
    const width = height * (size.width / Math.max(size.height, 1));
    return [width, height] as const;
  }, [camera, size.width, size.height]);

  useFrame(({ clock }, delta) => {
    if (sphereRotationRef.current && isSphere && motionEnabled) {
      sphereRotationRef.current.rotation.x += rotationVelocity[0] * delta;
      sphereRotationRef.current.rotation.y += rotationVelocity[1] * delta;
      sphereRotationRef.current.rotation.z += rotationVelocity[2] * delta;
    }

    if (!materialRef.current) return;
    materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.rhombusColorFlux.value = rhombusColorFlux;
    materialRef.current.uniforms.rhombusBodyPulse.value = rhombusBodyPulse;
    materialRef.current.uniforms.rhombusOrbitIntensity.value =
      rhombusOrbitIntensity;
    materialRef.current.uniforms.circleColorChange.value = circleColorChange;
    materialRef.current.uniforms.circleBodyChange.value = circleBodyChange;
    materialRef.current.uniforms.circleOrbitChange.value = circleOrbitChange;
    materialRef.current.uniforms.iResolution.value = isSphere
      ? [10, 5]
      : [size.width, size.height];
  });

  if (isSphere) {
    return (
      <group ref={sphereRotationRef} position={[0, sphereYOffset, 0]}>
        <mesh rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
          <sphereGeometry args={[100, 256, 256]} />
          <vegasMaterial ref={materialRef} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[planeSize[0], planeSize[1]]} />
      <vegasMaterial ref={materialRef} />
    </mesh>
  );
}
