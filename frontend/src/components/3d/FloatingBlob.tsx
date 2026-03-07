"use client";
// src/components/3d/FloatingBlob.tsx
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import * as THREE from "three";

interface BlobProps {
  color?: string;
  wireColor?: string;
  distort?: number;
  speed?: number;
  scale?: number;
}

function BlobMesh({ color = "#6366F1", distort = 0.45, speed = 1.8, scale = 1 }: BlobProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.22;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.08;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.85}
          envMapIntensity={1.2}
        />
      </Sphere>
    </mesh>
  );
}

function WireBlob({ scale = 1.15 }: { scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    meshRef.current.rotation.x = -t * 0.1;
    meshRef.current.rotation.y = t * 0.18;
  });
  return (
    <mesh ref={meshRef} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#818CF8" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

interface Props {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingBlob({ color = "#6366F1", className, style }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      className={className}
      style={style}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 3]} intensity={1.2} color="#818CF8" />
        <pointLight position={[-3, -2, -2]} intensity={0.5} color={color} />
        <BlobMesh color={color} />
        <WireBlob />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

// Multi-blob scene for landing
function OrbitBlob({ radius, speed, offset, color, size }: {
  radius: number; speed: number; offset: number; color: string; size: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * (radius * 0.4);
    ref.current.position.z = Math.sin(t) * (radius * 0.5);
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.z = t * 0.2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.3} transparent opacity={0.7} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]} intensity={2} color="#6366F1" />
        <pointLight position={[-4, -2, 2]} intensity={1} color="#8B5CF6" />
        <pointLight position={[0, -4, -2]} intensity={0.5} color="#F59E0B" />

        {/* Center blob */}
        <mesh>
          <Sphere args={[1.2, 64, 64]}>
            <MeshDistortMaterial color="#6366F1" distort={0.4} speed={1.5}
              roughness={0} metalness={0.2} transparent opacity={0.9} envMapIntensity={2} />
          </Sphere>
        </mesh>

        <OrbitBlob radius={2.4} speed={0.4}  offset={0}    color="#8B5CF6" size={0.35} />
        <OrbitBlob radius={2.0} speed={0.6}  offset={2.1}  color="#F59E0B" size={0.22} />
        <OrbitBlob radius={2.8} speed={0.25} offset={4.2}  color="#06B6D4" size={0.28} />
        <OrbitBlob radius={1.6} speed={0.55} offset={1.0}  color="#818CF8" size={0.18} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
