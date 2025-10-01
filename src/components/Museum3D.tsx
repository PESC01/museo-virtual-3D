import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { MuseumScene } from "./MuseumScene";

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
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.6, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />
        <Suspense fallback={null}>
          <MuseumScene />
        </Suspense>
      </Canvas>
    </div>
  );
};
