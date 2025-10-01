import { useRef, useEffect, useState } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BoundedControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera, gl } = useThree();
  
  // Límites de la habitación (20x20, paredes en ±10)
  const bounds = {
    minX: -9.5,
    maxX: 9.5,
    minZ: -9.5,
    maxZ: 9.5,
  };

  // Altura fija a nivel de los ojos (punto medio)
  const fixedHeight = 1.6;

  // Estado de las teclas presionadas
  const keysPressed = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const moveSpeed = 0.3;
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current || e.key in keysPressed.current) {
        keysPressed.current[key as keyof typeof keysPressed.current] = true;
        keysPressed.current[e.key as keyof typeof keysPressed.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current || e.key in keysPressed.current) {
        keysPressed.current[key as keyof typeof keysPressed.current] = false;
        keysPressed.current[e.key as keyof typeof keysPressed.current] = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!camera) return;

    // Resetear velocidad
    velocity.current.set(0, 0, 0);

    // Obtener dirección de la cámara
    camera.getWorldDirection(direction.current);
    direction.current.y = 0; // Mantener movimiento horizontal
    direction.current.normalize();

    // Calcular dirección derecha (perpendicular)
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction.current).normalize();

    // Mover según las teclas presionadas
    if (keysPressed.current.w || keysPressed.current.ArrowUp) {
      velocity.current.add(direction.current.clone().multiplyScalar(moveSpeed));
    }
    if (keysPressed.current.s || keysPressed.current.ArrowDown) {
      velocity.current.add(direction.current.clone().multiplyScalar(-moveSpeed));
    }
    if (keysPressed.current.a || keysPressed.current.ArrowLeft) {
      velocity.current.add(right.clone().multiplyScalar(moveSpeed));
    }
    if (keysPressed.current.d || keysPressed.current.ArrowRight) {
      velocity.current.add(right.clone().multiplyScalar(-moveSpeed));
    }

    // Aplicar movimiento con límites
    const newPosition = camera.position.clone().add(velocity.current);
    
    // Limitar posición dentro de los bounds
    newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
    newPosition.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPosition.z));
    newPosition.y = fixedHeight; // Mantener altura fija

    camera.position.copy(newPosition);
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
    />
  );
};
