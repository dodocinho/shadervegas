import { PerspectiveCamera } from "@react-three/drei";

const Camera = () => {

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, 150]}
      zoom={0.5}
      near={0.000001}
      far={1000}
    ></PerspectiveCamera>
  );
};
export default Camera;
