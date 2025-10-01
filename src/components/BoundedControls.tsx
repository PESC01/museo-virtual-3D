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
    lastTouchX: 0,
    lastTouchY: 0,
    touchStartDistance: 0,
    currentZoom: 8,
  });

  const rotation = useRef({ yaw: 0, pitch: 0 });

  const moveSpeed = 0.3;
  const lookSpeed = 0.005;
  const zoomSpeed = 0.05;
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

    // Touch controls mejorados para móvil
    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobile) return;
      
      if (e.touches.length === 1) {
        // Un dedo - preparar para movimiento/rotación
        touchState.current.lastTouchX = e.touches[0].clientX;
        touchState.current.lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        // Dos dedos - preparar para zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchState.current.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobile) return;
      e.preventDefault();

      if (e.touches.length === 1) {
        // Un dedo - rotar cámara y mover
        const deltaX = e.touches[0].clientX - touchState.current.lastTouchX;
        const deltaY = e.touches[0].clientY - touchState.current.lastTouchY;
        
        // Rotar cámara
        rotation.current.yaw -= deltaX * lookSpeed;
        rotation.current.pitch -= deltaY * lookSpeed;
        rotation.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.current.pitch));

        touchState.current.lastTouchX = e.touches[0].clientX;
        touchState.current.lastTouchY = e.touches[0].clientY;

      } else if (e.touches.length === 2) {
        // Dos dedos - zoom (acercar/alejar)
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const delta = distance - touchState.current.touchStartDistance;
        touchState.current.currentZoom -= delta * zoomSpeed;
        touchState.current.currentZoom = Math.max(2, Math.min(15, touchState.current.currentZoom));
        
        touchState.current.touchStartDistance = distance;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isMobile) return;
      
      if (e.touches.length === 0) {
        // Reset
        touchState.current.touchStartDistance = 0;
      }
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

    // Aplicar movimiento con límites
    const newPosition = camera.position.clone().add(velocity.current);
    
    // Limitar posición dentro de los bounds
    newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
    newPosition.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPosition.z));
    newPosition.y = fixedHeight; // Mantener altura fija

    camera.position.copy(newPosition);

    // Aplicar zoom en móvil (mover la cámara adelante/atrás)
    if (isMobile) {
      const zoomDirection = direction.current.clone().multiplyScalar(8 - touchState.current.currentZoom);
      camera.position.add(zoomDirection.multiplyScalar(0.1));
    }
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
