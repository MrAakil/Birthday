"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { birthdayConfig } from "@/config/birthday";

interface FlameProps {
  position: [number, number, number];
  blown: boolean;
}

function Flame({ position, blown }: FlameProps) {
  const flameRef = useRef<THREE.Mesh | null>(null);

  // Animate the flame flickering slightly using sine wave
  useFrame(({ clock }) => {
    if (!flameRef.current || blown) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 15) * 0.08;
    flameRef.current.scale.set(scale, scale * 1.2, scale);
    
    // Slight sway
    flameRef.current.position.x = position[0] + Math.sin(t * 8) * 0.01;
    flameRef.current.position.z = position[2] + Math.cos(t * 8) * 0.01;
  });

  if (blown) return null;

  return (
    <group position={position}>
      {/* Outer Flame Glow */}
      <pointLight 
        color={birthdayConfig.cakeConfig.flameColor} 
        intensity={2.0} 
        distance={2.5} 
        decay={2}
      />
      {/* Flame Mesh (stylized teardrop shape using a cone) */}
      <mesh ref={flameRef} position={[0, 0.45, 0]}>
        <coneGeometry args={[0.07, 0.22, 12]} />
        <meshBasicMaterial color={birthdayConfig.cakeConfig.flameColor} />
      </mesh>
      
      {/* Inner Flame Core */}
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.04, 0.12, 12]} />
        <meshBasicMaterial color="#fffbeb" />
      </mesh>
    </group>
  );
}

interface CakeProps {
  blown: boolean;
}

function Cake({ blown }: CakeProps) {
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const cfg = birthdayConfig.cakeConfig;

  // Auto-rotate the cake slowly
  useFrame(() => {
    if (cakeGroupRef.current) {
      cakeGroupRef.current.rotation.y += 0.005;
    }
  });

  // Calculate candle positions in a ring on top of the cake
  const candlePositions: [number, number, number][] = [];
  const radius = 0.9;
  const count = cfg.candleCount;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    candlePositions.push([
      Math.cos(angle) * radius,
      0.35, // top of the cake height
      Math.sin(angle) * radius,
    ]);
  }

  // Candle colors (pastel palette)
  const candleColors = ["#818cf8", "#f472b6", "#fb7185", "#38bdf8", "#fbbf24"];

  return (
    <group ref={cakeGroupRef}>
      {/* 1. Glass Plate */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2.0, 2.2, 0.1, 32]} />
        <meshPhysicalMaterial 
          color={cfg.plateColor} 
          roughness={0.1} 
          transmission={0.6} 
          thickness={0.5} 
        />
      </mesh>

      {/* 2. Bottom Sponge Layer */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.8, 48]} />
        <meshStandardMaterial color={cfg.icingColor} roughness={0.3} />
      </mesh>

      {/* 3. Cream Middle Layer */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[1.51, 1.51, 0.08, 48]} />
        <meshStandardMaterial color={cfg.creamColor} roughness={0.4} />
      </mesh>

      {/* 4. Top Sponge Layer */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.7, 48]} />
        <meshStandardMaterial color={cfg.icingColor} roughness={0.3} />
      </mesh>

      {/* 5. Candles & Flames */}
      {candlePositions.map((pos, idx) => (
        <group key={idx}>
          {/* Candle Body */}
          <mesh position={[pos[0], pos[1] + 0.15, pos[2]]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 12]} />
            <meshStandardMaterial color={candleColors[idx % candleColors.length]} roughness={0.5} />
          </mesh>
          {/* Candle Wick */}
          <mesh position={[pos[0], pos[1] + 0.36, pos[2]]}>
            <cylinderGeometry args={[0.006, 0.006, 0.06, 8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          {/* Candle Flame */}
          <Flame position={[pos[0], pos[1] + 0.35, pos[2]]} blown={blown} />
        </group>
      ))}

      {/* Decorative Cream Dolls */}
      {Array.from({ length: 12 }).map((_, idx) => {
        const angle = (idx / 12) * Math.PI * 2;
        const dollR = 1.35;
        return (
          <mesh 
            key={idx} 
            position={[Math.cos(angle) * dollR, -0.27, Math.sin(angle) * dollR]}
            rotation={[0, angle, 0]}
          >
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={cfg.creamColor} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Cake3DCanvas({ blown }: CakeProps) {
  return (
    <div className="w-full h-[400px] md:h-[450px] outline-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 1.8, 4.5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        {/* Key Light */}
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        {/* Fill Light */}
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        {/* Rim Light */}
        <pointLight position={[0, 4, -2]} intensity={0.8} color="#c084fc" />
        
        <Cake blown={blown} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={0.4} 
          maxPolarAngle={Math.PI / 2.2} 
        />
      </Canvas>
    </div>
  );
}
