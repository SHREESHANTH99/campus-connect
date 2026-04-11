"use client";
// src/components/3d/FloatingBlob.tsx
import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Float, Torus, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════
   CRYSTAL DIAMOND — main hero shape
   ═══════════════════════════════════════════════════════════════════ */
function CrystalDiamond({ color = "#6366F1" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);

  const geo = useMemo(() => {
    // Custom diamond / gem geometry
    const g = new THREE.BufferGeometry();
    const h = 1.4; // height
    const r = 0.9; // radius
    const segments = 8;

    const verts: number[] = [];
    const indices: number[] = [];

    // Top apex
    verts.push(0, h * 0.45, 0);
    // Upper ring
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      verts.push(Math.cos(a) * r, h * 0.05, Math.sin(a) * r);
    }
    // Lower ring (slightly inset)
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2 + Math.PI / segments;
      verts.push(Math.cos(a) * r * 0.7, -h * 0.18, Math.sin(a) * r * 0.7);
    }
    // Bottom apex
    verts.push(0, -h * 0.55, 0);

    const topApex = 0;
    const upperStart = 1;
    const lowerStart = 1 + segments;
    const botApex = 1 + segments * 2;

    // Top facets (apex → upper ring)
    for (let i = 0; i < segments; i++) {
      const a = upperStart + i;
      const b = upperStart + ((i + 1) % segments);
      indices.push(topApex, a, b);
    }
    // Mid facets (upper → lower)
    for (let i = 0; i < segments; i++) {
      const a = upperStart + i;
      const b = upperStart + ((i + 1) % segments);
      const c = lowerStart + i;
      const d = lowerStart + ((i + 1) % segments);
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
    // Bottom facets (lower → apex)
    for (let i = 0; i < segments; i++) {
      const a = lowerStart + i;
      const b = lowerStart + ((i + 1) % segments);
      indices.push(botApex, b, a);
    }

    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.28;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    ref.current.position.y = Math.sin(t * 0.5) * 0.08;
  });

  return (
    <mesh ref={ref} geometry={geo} castShadow>
      <MeshTransmissionMaterial
        color={color}
        thickness={0.5}
        roughness={0}
        transmission={0.92}
        ior={2.4}
        chromaticAberration={0.08}
        anisotropy={0.4}
        distortion={0.1}
        distortionScale={0.3}
        temporalDistortion={0.02}
        envMapIntensity={1.8}
        attenuationColor={color}
        attenuationDistance={0.4}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TORUS KNOT — decorative orbiting shape
   ═══════════════════════════════════════════════════════════════════ */
function GlassTorusKnot({ color = "#8B5CF6", scale = 0.4 }: { color?: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.y = t * 0.22;
    ref.current.rotation.z = t * 0.18;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <torusKnotGeometry args={[1, 0.32, 128, 16, 2, 3]} />
      <MeshTransmissionMaterial
        color={color}
        thickness={0.3}
        roughness={0.02}
        transmission={0.85}
        ior={1.8}
        chromaticAberration={0.05}
        envMapIntensity={1.5}
        attenuationColor={color}
        attenuationDistance={0.6}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ICOSAHEDRON (low-poly gem)
   ═══════════════════════════════════════════════════════════════════ */
function LowPolyGem({ color = "#F59E0B", position = [0, 0, 0] as [number, number, number], scale = 0.3 }: {
  color?: string; position?: [number, number, number]; scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.3 + Math.random() * 0.3, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.6;
    ref.current.rotation.y = t * 0.9;
    ref.current.rotation.z = t * 0.4;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={0.8}
          envMapIntensity={2}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   OCTAHEDRON CRYSTAL
   ═══════════════════════════════════════════════════════════════════ */
function OctahedronCrystal({ color = "#06B6D4", position = [0, 0, 0] as [number, number, number], scale = 0.28 }: {
  color?: string; position?: [number, number, number]; scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.7;
    ref.current.rotation.z = t * 0.4;
  });
  return (
    <Float speed={1.2} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.2}
          roughness={0}
          transmission={0.9}
          ior={2.0}
          chromaticAberration={0.04}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   WIREFRAME DODECAHEDRON — structural accent
   ═══════════════════════════════════════════════════════════════════ */
function WireDodecahedron({ scale = 1.6 }: { scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = t * 0.08;
    ref.current.rotation.y = t * 0.12;
    ref.current.rotation.z = t * 0.05;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#6366F1" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RING STACK — concentric rings
   ═══════════════════════════════════════════════════════════════════ */
function ConcentricRings({ color = "#6366F1" }: { color?: string }) {
  const rings = [
    { r: 1.55, tube: 0.018, speed: 0.25, axis: [1, 0, 0] as [number, number, number] },
    { r: 1.30, tube: 0.014, speed: 0.35, axis: [0, 1, 0] as [number, number, number] },
    { r: 1.10, tube: 0.010, speed: 0.50, axis: [0, 0, 1] as [number, number, number] },
  ];

  return (
    <>
      {rings.map((ring, i) => (
        <RingMesh key={i} {...ring} color={color} />
      ))}
    </>
  );
}

function RingMesh({ r, tube, speed, axis, color }: {
  r: number; tube: number; speed: number; axis: [number, number, number]; color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const initRot = useMemo(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  ], []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    ref.current.rotation.x = initRot[0] + axis[0] * t;
    ref.current.rotation.y = initRot[1] + axis[1] * t;
    ref.current.rotation.z = initRot[2] + axis[2] * t;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[r, tube, 16, 120]} />
      <meshStandardMaterial
        color={color}
        roughness={0.05}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.3}
        envMapIntensity={2}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PUBLIC EXPORTS
   ═══════════════════════════════════════════════════════════════════ */

interface Props {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Auth page visual — diamond + rings
export function FloatingBlob({ color = "#6366F1", className, style }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      className={className}
      style={style}
      dpr={[1, 1.5]}
      shadows
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 4]} intensity={2.5} color="#818CF8" castShadow />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color={color} />
        <pointLight position={[0, -4, -2]} intensity={0.6} color="#F59E0B" />
        <spotLight position={[0, 6, 2]} intensity={1.5} color="white" angle={0.4} penumbra={0.8} />

        <CrystalDiamond color={color} />
        <ConcentricRings color={color} />
        <WireDodecahedron />

        <OctahedronCrystal color="#06B6D4" position={[1.8, 0.8, -0.5]} scale={0.28} />
        <LowPolyGem color="#F59E0B" position={[-1.7, -0.6, 0.2]} scale={0.22} />

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

// Hero landing page — orbiting gem system
function GemOrbit({ radius, speed, offset, color, size, type = "icosa" }: {
  radius: number; speed: number; offset: number; color: string; size: number;
  type?: "icosa" | "octa" | "box" | "knot";
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.6) * (radius * 0.35);
    ref.current.position.z = Math.sin(t * 0.8) * (radius * 0.4);
    ref.current.rotation.x += 0.008;
    ref.current.rotation.y += 0.012;
    ref.current.rotation.z += 0.005;
  });

  const geo = useMemo(() => {
    switch (type) {
      case "octa": return <octahedronGeometry args={[size, 0]} />;
      case "box": return <boxGeometry args={[size, size, size]} />;
      default: return <icosahedronGeometry args={[size, 0]} />;
    }
  }, [type, size]);

  return (
    <group ref={ref}>
      <mesh>
        {geo}
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={0.75}
          emissive={color}
          emissiveIntensity={0.18}
          envMapIntensity={2.5}
        />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]} shadows>
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 4]} intensity={3} color="#6366F1" castShadow />
        <pointLight position={[-5, -3, 2]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[0, -5, -3]} intensity={0.8} color="#F59E0B" />
        <spotLight position={[0, 8, 3]} intensity={2} color="white" angle={0.35} penumbra={1} />

        {/* Central glass diamond */}
        <CrystalDiamond color="#6366F1" />

        {/* Concentric orbit rings */}
        <ConcentricRings color="#6366F1" />

        {/* Outer wireframe */}
        <WireDodecahedron scale={2.0} />

        {/* Orbiting gems */}
        <GemOrbit radius={2.8} speed={0.38} offset={0} color="#8B5CF6" size={0.28} type="icosa" />
        <GemOrbit radius={2.4} speed={0.52} offset={2.09} color="#F59E0B" size={0.20} type="octa" />
        <GemOrbit radius={3.1} speed={0.28} offset={4.19} color="#06B6D4" size={0.24} type="icosa" />
        <GemOrbit radius={2.0} speed={0.65} offset={1.05} color="#818CF8" size={0.16} type="box" />
        <GemOrbit radius={3.4} speed={0.22} offset={3.14} color="#F43F5E" size={0.19} type="octa" />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
