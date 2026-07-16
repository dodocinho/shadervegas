import { PerspectiveCamera } from "@react-three/drei";

type CameraProps = {
  /** Distância da câmera ao centro; maior = esfera menor na tela */
  distance?: number;
};

const Camera = ({ distance = 280 }: CameraProps) => {
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, distance]}
      zoom={1}
      near={0.1}
      far={2000}
    />
  );
};

export default Camera;
