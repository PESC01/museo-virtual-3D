import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BoundedControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Límites de la habitación (20x20, paredes en ±10)
  const bounds = {
    minX: -9.5,
    maxX: 9.5,
    minZ: -9.5,
    maxZ: 9.5,
    minY: 0.5,
    maxY: 5.5,
  };

  useFrame(() => {
    if (controlsRef.current && camera) {
      const position = camera.position;
      let needsUpdate = false;

      // Limitar la posición de la cámara dentro de los límites
      if (position.x < bounds.minX) {
        position.x = bounds.minX;
        needsUpdate = true;
      }
      if (position.x > bounds.maxX) {
        position.x = bounds.maxX;
        needsUpdate = true;
      }
      if (position.z < bounds.minZ) {
        position.z = bounds.minZ;
        needsUpdate = true;
      }
      if (position.z > bounds.maxZ) {
        position.z = bounds.maxZ;
        needsUpdate = true;
      }
      if (position.y < bounds.minY) {
        position.y = bounds.minY;
        needsUpdate = true;
      }
      if (position.y > bounds.maxY) {
        position.y = bounds.maxY;
        needsUpdate = true;
      }

      // Limitar el target de los controles
      if (controlsRef.current.target) {
        const target = controlsRef.current.target;
        if (target.x < bounds.minX) target.x = bounds.minX;
        if (target.x > bounds.maxX) target.x = bounds.maxX;
        if (target.z < bounds.minZ) target.z = bounds.minZ;
        if (target.z > bounds.maxZ) target.z = bounds.maxZ;
        if (target.y < bounds.minY) target.y = bounds.minY;
        if (target.y > bounds.maxY) target.y = bounds.maxY;
      }

      if (needsUpdate) {
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.01}
      maxDistance={12}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={0}
      target={[0, 1.6, 0]}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
};
