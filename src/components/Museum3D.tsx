import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { MuseumScene } from "./MuseumScene";
import { BoundedControls } from "./BoundedControls";

export const Museum3D = () => {
  return (
    <div className="w-full h-screen bg-background">
      <Canvas 
        shadows 
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 1.6, 8]} fov={75} near={0.1} far={1000} />
        <BoundedControls />
        <Suspense fallback={null}>
          <MuseumScene />
        </Suspense>
      </Canvas>
    </div>
  );
};
