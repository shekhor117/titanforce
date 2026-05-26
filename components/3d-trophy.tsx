"use client"

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Cone, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

function Trophy3D() {
  const groupRef = useRef<THREE.Group>(null)
  const coneRef = useRef<THREE.Mesh>(null)
  const cylinderRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.3
    }
    if (coneRef.current) {
      coneRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Trophy Cup - Cone */}
      <mesh ref={coneRef} position={[0, 1, 0]}>
        <coneGeometry args={[1, 1.5, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.9}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Trophy Base - Cylinder */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.4, 32]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.5}
          roughness={0.4}
          emissive="#111827"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Trophy Stand */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Decorative Ring */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[1.1, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.9}
          roughness={0.05}
          emissive="#f59e0b"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

export function Trophy3DScene() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={75} />

      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 3, 5]} intensity={0.8} color="#fbbf24" />
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#f59e0b" />

      <Trophy3D />
    </Canvas>
  )
}
