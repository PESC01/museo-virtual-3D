import { useRef, useEffect, useState } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BoundedControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera, gl } = useThree();
  const [isMobile, setIsMobile] = useState(false);
  
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

  // Controles táctiles para móvil
  const touchState = useRef({
    moveX: 0,
    moveY: 0,
    lookStartX: 0,
    lookStartY: 0,
    isLooking: false,
  });

  const rotation = useRef({ yaw: 0, pitch: 0 });

  const moveSpeed = 0.3;
  const lookSpeed = 0.002;
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();

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

    // Touch controls para móvil
    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobile) return;
      
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX;
        const width = window.innerWidth;

        // Lado izquierdo para movimiento, derecho para mirar
        if (x < width / 2) {
          // Joystick de movimiento (izquierda)
          touchState.current.moveX = (touch.clientX - width / 4) / (width / 4);
          touchState.current.moveY = (touch.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        } else {
          // Área de mirar (derecha)
          touchState.current.isLooking = true;
          touchState.current.lookStartX = touch.clientX;
          touchState.current.lookStartY = touch.clientY;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobile) return;
      e.preventDefault();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX;
        const width = window.innerWidth;

        if (x < width / 2) {
          // Actualizar joystick de movimiento
          touchState.current.moveX = (touch.clientX - width / 4) / (width / 4);
          touchState.current.moveY = (touch.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        } else if (touchState.current.isLooking) {
          // Actualizar rotación de cámara
          const deltaX = touch.clientX - touchState.current.lookStartX;
          const deltaY = touch.clientY - touchState.current.lookStartY;
          
          rotation.current.yaw -= deltaX * lookSpeed;
          rotation.current.pitch -= deltaY * lookSpeed;
          rotation.current.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.pitch));

          touchState.current.lookStartX = touch.clientX;
          touchState.current.lookStartY = touch.clientY;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isMobile) return;
      
      touchState.current.moveX = 0;
      touchState.current.moveY = 0;
      touchState.current.isLooking = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  useFrame(() => {
    if (!camera) return;

    // Aplicar rotación en móvil
    if (isMobile) {
      camera.rotation.order = 'YXZ';
      camera.rotation.y = rotation.current.yaw;
      camera.rotation.x = rotation.current.pitch;
    }

    // Resetear velocidad
    velocity.current.set(0, 0, 0);

    // Obtener dirección de la cámara
    camera.getWorldDirection(direction.current);
    direction.current.y = 0; // Mantener movimiento horizontal
    direction.current.normalize();

    // Calcular dirección derecha (perpendicular)
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction.current).normalize();

    // Movimiento por teclado (escritorio)
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

    // Movimiento táctil (móvil)
    if (isMobile && (touchState.current.moveX !== 0 || touchState.current.moveY !== 0)) {
      velocity.current.add(direction.current.clone().multiplyScalar(-touchState.current.moveY * moveSpeed));
      velocity.current.add(right.clone().multiplyScalar(-touchState.current.moveX * moveSpeed));
    }

    // Aplicar movimiento con límites
    const newPosition = camera.position.clone().add(velocity.current);
    
    // Limitar posición dentro de los bounds
    newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
    newPosition.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPosition.z));
    newPosition.y = fixedHeight; // Mantener altura fija

    camera.position.copy(newPosition);
  });

  // Solo usar PointerLockControls en escritorio
  if (!isMobile) {
    return (
      <PointerLockControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
      />
    );
  }

  return null;
};
