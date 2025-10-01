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
        intensity={80}
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
      <ambientLight intensity={1.5} />
      
      {/* Main gallery lighting */}
      <pointLight position={[0, 5, 0]} intensity={100} color="#f5e6d3" />
      <pointLight position={[-5, 5, 5]} intensity={70} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={70} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={60} color="#f5e6d3" />
      <pointLight position={[5, 5, -5]} intensity={60} color="#f5e6d3" />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 3, -10]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Front wall (to close the room) */}
      <mesh position={[0, 3, 10]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Artworks on back wall */}
      <ArtworkFrame
        position={[-4, 2.5, -9.9]}
        rotation={[0, 0, 0]}
        imageUrl={artwork1}
      />
      <ArtworkFrame
        position={[4, 2.5, -9.9]}
        rotation={[0, 0, 0]}
        imageUrl={artwork2}
      />
      
      {/* Artworks on left wall */}
      <ArtworkFrame
        position={[-9.9, 2.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        imageUrl={artwork3}
      />
      
      {/* Artworks on right wall */}
      <ArtworkFrame
        position={[9.9, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        imageUrl={artwork4}
      />
      
      {/* Additional lighting accents */}
      <spotLight
        position={[-5, 5, -5]}
        angle={0.4}
        penumbra={0.5}
        intensity={100}
        color="#d4af37"
      />
      <spotLight
        position={[5, 5, -5]}
        angle={0.4}
        penumbra={0.5}
        intensity={100}
        color="#d4af37"
      />
      <spotLight
        position={[-5, 5, 5]}
        angle={0.4}
        penumbra={0.5}
        intensity={100}
        color="#d4af37"
      />
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={0.5}
        intensity={100}
        color="#d4af37"
      />
      
      {/* Preload all textures to prevent flickering */}
      <Preload all />
    </>
  );
};
