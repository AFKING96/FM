"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const count = 1200;
  const mesh = useRef<THREE.Points>(null);
  
  // Generate random particles
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  const particlesColor = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color("#6b21a8"); // purple
    const colorB = new THREE.Color("#d946ef"); // neon pink/purple
    for (let i = 0; i < count; i++) {
      const mixedColor = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return colors;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      const targetY = state.pointer.x * 0.5 + state.clock.getElapsedTime() * 0.05;
      const targetX = -state.pointer.y * 0.5 + state.clock.getElapsedTime() * 0.02;

      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetY, 0.05);
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particlesColor, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-dark-bg pointer-events-none overflow-hidden">
      {/* Fallback ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-dark-bg to-dark-bg opacity-70"></div>
      
      {/* WebGL Canvas - Optimized DPR and framerate for smoothness */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
