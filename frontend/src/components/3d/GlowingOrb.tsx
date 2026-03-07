"use client";
// src/components/3d/GlowingOrb.tsx
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Trail } from "@react-three/drei";
import * as THREE from "three";

function OrbCore() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.3;
  });
  return (
    <mesh ref={ref}>
      <Sphere args={[0.8, 64, 64]}>
        <MeshDistortMaterial
          color="#6366F1"
          distort={0.3}
          speed={2}
          roughness={0}
          metalness={0}
          emissive="#6366F1"
          emissiveIntensity={0.5}
          transparent
          opacity={0.95}
        />
      </Sphere>
    </mesh>
  );
}

function PulseRing({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime + delay) % 3;
    const scale = 1 + t * 0.5;
    ref.current.scale.setScalar(scale);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, 0.3 - t * 0.1);
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.9, 0.015, 16, 100]} />
      <meshBasicMaterial color="#818CF8" transparent opacity={0.3} />
    </mesh>
  );
}

function FloatingSatellite({ angle, speed, r }: { angle: number; speed: number; r: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + angle;
    ref.current.position.x = Math.cos(t) * r;
    ref.current.position.y = Math.sin(t * 0.7) * r * 0.3;
    ref.current.position.z = Math.sin(t) * r * 0.6;
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.012;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} roughness={0} metalness={0.5} />
    </mesh>
  );
}

interface Props { style?: React.CSSProperties; className?: string; }

export function GlowingOrb({ style, className }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 40 }} style={style} className={className} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <pointLight position={[2, 2, 2]}  intensity={2}   color="#6366F1" />
        <pointLight position={[-2,-2,-2]} intensity={1}   color="#8B5CF6" />
        <pointLight position={[0, 0, 3]}  intensity={0.5} color="#60A5FA" />

        <OrbCore />
        <PulseRing delay={0} />
        <PulseRing delay={1} />
        <PulseRing delay={2} />
        <FloatingSatellite angle={0}    speed={0.5}  r={1.4} />
        <FloatingSatellite angle={2.1}  speed={0.35} r={1.7} />
        <FloatingSatellite angle={4.2}  speed={0.6}  r={1.2} />
      </Suspense>
    </Canvas>
  );
}

// Compact orb for cards
export function MiniOrb({ color = "#6366F1", style }: { color?: string; style?: React.CSSProperties }) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 40 }} style={style} dpr={[1, 1.2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[2, 2, 2]} intensity={1.5} color={color} />
        <mesh>
          <Sphere args={[0.7, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              distort={0.35}
              speed={2.5}
              roughness={0}
              emissive={color}
              emissiveIntensity={0.3}
              transparent opacity={0.9}
            />
          </Sphere>
        </mesh>
      </Suspense>
    </Canvas>
  );
}
