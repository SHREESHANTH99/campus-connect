"use client";
// src/components/3d/ParticleField.tsx
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 120, color = "#6366F1" }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null!);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    return { positions, sizes };
  }, [count]);

  const speeds = useMemo(() => Array.from({ length: count }, () => Math.random() * 0.3 + 0.1), [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const geo = ref.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.004;
      if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6;
      pos[i * 3] += Math.sin(t * speeds[i] + i) * 0.002;
    }
    geo.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes,     1]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.6}
        fog={false}
      />
    </points>
  );
}

// Connection lines between nearby particles
function ConnectionWeb() {
  const ref  = useRef<THREE.LineSegments>(null!);
  const geo  = useMemo(() => {
    const pts: number[] = [];
    const n = 20;
    for (let i = 0; i < n; i++) {
      const ax = (Math.random() - 0.5) * 8;
      const ay = (Math.random() - 0.5) * 8;
      const bx = ax + (Math.random() - 0.5) * 3;
      const by = ay + (Math.random() - 0.5) * 3;
      pts.push(ax, ay, 0, bx, by, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.elapsedTime * 0.02;
    ref.current.rotation.y = clock.elapsedTime * 0.015;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 0.5) * 0.04;
  });

  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color="#6366F1" transparent opacity={0.1} />
    </lineSegments>
  );
}

interface Props {
  count?:  number;
  color?:  string;
  style?:  React.CSSProperties;
  className?: string;
}

export function ParticleField({ count = 100, color = "#6366F1", style, className }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={style}
      className={className}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <Particles count={count} color={color} />
        <ConnectionWeb />
      </Suspense>
    </Canvas>
  );
}
