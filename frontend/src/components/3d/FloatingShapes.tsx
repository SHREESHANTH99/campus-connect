"use client";
// src/components/3d/FloatingShapes.tsx
import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ShapeType = "box" | "torus" | "octahedron" | "icosahedron" | "cone";

interface ShapeConfig {
  type:     ShapeType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale:    number;
  color:    string;
  speed:    [number, number, number];
  drift:    [number, number];
}

function Shape({ cfg }: { cfg: ShapeConfig }) {
  const ref    = useRef<THREE.Mesh>(null!);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + offset;
    ref.current.rotation.x += cfg.speed[0] * 0.008;
    ref.current.rotation.y += cfg.speed[1] * 0.01;
    ref.current.rotation.z += cfg.speed[2] * 0.006;
    ref.current.position.y = cfg.position[1] + Math.sin(t * cfg.drift[0]) * cfg.drift[1];
    ref.current.position.x = cfg.position[0] + Math.cos(t * cfg.drift[0] * 0.7) * (cfg.drift[1] * 0.5);
  });

  const geo = useMemo(() => {
    switch (cfg.type) {
      case "box":          return new THREE.BoxGeometry(1, 1, 1);
      case "torus":        return new THREE.TorusGeometry(1, 0.35, 16, 40);
      case "octahedron":   return new THREE.OctahedronGeometry(1, 0);
      case "icosahedron":  return new THREE.IcosahedronGeometry(1, 0);
      case "cone":         return new THREE.ConeGeometry(0.7, 1.4, 6);
    }
  }, [cfg.type]);

  return (
    <mesh ref={ref} position={cfg.position} rotation={cfg.rotation} scale={cfg.scale} geometry={geo}>
      <meshStandardMaterial
        color={cfg.color}
        roughness={0.15}
        metalness={0.6}
        transparent
        opacity={0.55}
        wireframe={cfg.type === "icosahedron"}
      />
    </mesh>
  );
}

const DEFAULT_SHAPES: ShapeConfig[] = [
  { type: "torus",       position: [-3.5, 1.5, -2],   rotation: [0.5, 0, 0.3],  scale: 0.55, color: "#6366F1", speed: [1,1.2,0.8], drift: [0.4, 0.25] },
  { type: "octahedron",  position: [3.0, -1.2, -1.5], rotation: [0, 0.4, 0],    scale: 0.50, color: "#8B5CF6", speed: [0.8,1,1.2], drift: [0.35, 0.30] },
  { type: "icosahedron", position: [-2.0,-2.0, -2.5], rotation: [0.2, 0, 0.1],  scale: 0.60, color: "#818CF8", speed: [0.6,0.8,1], drift: [0.3, 0.20] },
  { type: "box",         position: [2.5, 2.0, -3],    rotation: [0.3, 0.5, 0],  scale: 0.40, color: "#F59E0B", speed: [1,0.8,1.2], drift: [0.45, 0.22] },
  { type: "cone",        position: [-3.5,-1.0, -2],   rotation: [0, 0, 0.2],    scale: 0.45, color: "#06B6D4", speed: [0.7,1.1,0.9], drift: [0.38, 0.28] },
];

interface Props {
  style?:     React.CSSProperties;
  className?: string;
  shapes?:    ShapeConfig[];
}

export function FloatingShapes({ style, className, shapes = DEFAULT_SHAPES }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 55 }} style={style} className={className} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 2]}  intensity={1.5} color="#6366F1" />
        <pointLight position={[-4,-3, 0]} intensity={0.8} color="#8B5CF6" />
        {shapes.map((cfg, i) => <Shape key={i} cfg={cfg} />)}
      </Suspense>
    </Canvas>
  );
}

// Torus ring decoration
function TorusRing({ radius, tube, speed }: { radius: number; tube: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.6;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 16, 80]} />
      <meshStandardMaterial color="#6366F1" roughness={0.1} metalness={0.7} transparent opacity={0.7} />
    </mesh>
  );
}

export function RotatingRings({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={style} className={className} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 3, 2]} intensity={2} color="#6366F1" />
        <pointLight position={[-3,-2,-2]} intensity={1} color="#8B5CF6" />
        <TorusRing radius={1.4} tube={0.06} speed={0.3} />
        <TorusRing radius={1.0} tube={0.04} speed={0.5} />
        <TorusRing radius={0.65} tube={0.03} speed={0.8} />
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#818CF8" emissive="#6366F1" emissiveIntensity={1} roughness={0} metalness={0} />
        </mesh>
      </Suspense>
    </Canvas>
  );
}
