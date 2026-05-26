"use client"

import { Canvas } from "@react-three/fiber"
import { Float, Html, OrbitControls, Environment } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

interface Card3DProps {
  number: string
  label: string
  color: string
}

function Card3D({ number, label, color }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          wireframe={false}
          shininess={100}
        />
      </mesh>
      <Html scale={0.5} position={[0, 0, 0.1]}>
        <div className="text-center pointer-events-none select-none">
          <div className="text-4xl font-bold text-white">{number}</div>
          <div className="text-xs uppercase tracking-wider text-white/80 mt-2">
            {label}
          </div>
        </div>
      </Html>
    </Float>
  )
}

interface FloatingCard3DProps {
  number: string
  label: string
  color: string
}

export function FloatingCard3D({ number, label, color }: FloatingCard3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 75 }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
      }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color="#3B82F6" />

      <Card3D number={number} label={label} color={color} />

      <Environment preset="studio" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={4}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}
