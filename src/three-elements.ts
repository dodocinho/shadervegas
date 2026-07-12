import { ReactThreeFiber } from "@react-three/fiber";
import { VegasMaterial } from "./materials/VegasShaderMaterial";

declare module "@react-three/fiber" {
  interface ThreeElements {
    vegasMaterial: ReactThreeFiber.ThreeElement<typeof VegasMaterial>;
   
  }
}