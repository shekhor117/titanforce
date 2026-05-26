"use client"

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function PlayerShirt() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.3
      groupRef.current.position.y = Math.cos(clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Jersey Body - Main Plane */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.1]} />
        <meshStandardMaterial
          color="#d91f3f"
          metalness={0.3}
          roughness={0.6}
          emissive="#8b1a2e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Jersey Stripes - Side accent */}
      <mesh position={[0.75, 0, 0.05]}>
        <boxGeometry args={[0.2, 1.8, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Jersey Number area */}
      <mesh position={[0, 0.2, 0.06]}>
        <boxGeometry args={[0.6, 0.8, 0.02]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Neck collar */}
      <mesh position={[0, 1, 0.08]}>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </group>
  )
}

export function PlayerShirt3D() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={75} />
      <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} />

      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 0, 5]} intensity={0.6} color="#d91f3f" />

      <PlayerShirt />
    </Canvas>
  )
}
