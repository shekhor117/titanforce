"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function RotatingTrophy() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
      <group ref={meshRef}>
        {/* Trophy Base */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.3, 32]} />
          <meshPhongMaterial color="#D4AF37" emissive="#B8860B" emissiveIntensity={0.4} />
        </mesh>

        {/* Trophy Cup */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.25, 0.8, 32]} />
          <meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.5} />
        </mesh>

        {/* Trophy Handles */}
        <mesh position={[-0.4, 0.2, 0]}>
          <torusGeometry args={[0.2, 0.08, 16, 100, Math.PI]} />
          <meshPhongMaterial color="#D4AF37" emissive="#B8860B" emissiveIntensity={0.4} />
        </mesh>

        <mesh position={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.2, 0.08, 16, 100, Math.PI]} />
          <meshPhongMaterial color="#D4AF37" emissive="#B8860B" emissiveIntensity={0.4} />
        </mesh>

        {/* Trophy Top */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshPhongMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

export function Trophy3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 75 }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
      }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#D4AF37" />

      <RotatingTrophy />

      <Environment preset="studio" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={3}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}
