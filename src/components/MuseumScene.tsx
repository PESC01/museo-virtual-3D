import { useTexture, Preload } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import artwork1 from "@/assets/artwork1.jpg";
import artwork2 from "@/assets/artwork2.jpg";
import artwork3 from "@/assets/artwork3.jpg";
import artwork4 from "@/assets/artwork4.jpg";

const ArtworkFrame = ({ position, rotation, imageUrl }: { position: [number, number, number]; rotation: [number, number, number]; imageUrl: string }) => {
  const texture = useTexture(imageUrl);
  
  // Configure texture to prevent flickering and black lines
  useMemo(() => {
    if (texture) {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
    return texture;
  }, [texture]);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[4.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Artwork - positioned slightly forward to avoid z-fighting */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3.98, 2.98]} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.FrontSide}
          toneMapped={false}
          transparent={false}
          depthWrite={true}
          depthTest={true}
        />
      </mesh>
      
      {/* Spotlight effect */}
      <spotLight
        position={[0, 2, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={50}
        castShadow
        target-position={position}
      />
    </group>
  );
};

export const MuseumScene = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.8} />
      
      {/* Main gallery lighting */}
      <pointLight position={[0, 5, 0]} intensity={50} color="#f5e6d3" />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#5a5550" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 3, -8]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      
      {/* Artworks on back wall */}
      <ArtworkFrame
        position={[-5, 2.5, -7.9]}
        rotation={[0, 0, 0]}
        imageUrl={artwork1}
      />
      <ArtworkFrame
        position={[5, 2.5, -7.9]}
        rotation={[0, 0, 0]}
        imageUrl={artwork2}
      />
      
      {/* Artworks on left wall */}
      <ArtworkFrame
        position={[-14.9, 2.5, -5]}
        rotation={[0, Math.PI / 2, 0]}
        imageUrl={artwork3}
      />
      
      {/* Artworks on right wall */}
      <ArtworkFrame
        position={[14.9, 2.5, -5]}
        rotation={[0, -Math.PI / 2, 0]}
        imageUrl={artwork4}
      />
      
      {/* Additional lighting accents */}
      <spotLight
        position={[-5, 5, -5]}
        angle={0.4}
        penumbra={0.5}
        intensity={60}
        color="#d4af37"
      />
      <spotLight
        position={[5, 5, -5]}
        angle={0.4}
        penumbra={0.5}
        intensity={60}
        color="#d4af37"
      />
      
      {/* Preload all textures to prevent flickering */}
      <Preload all />
    </>
  );
};
