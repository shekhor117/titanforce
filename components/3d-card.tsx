"use client"

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Card3DProps {
  color?: string
  emissiveColor?: string
}

function RotatingCard({ color = '#d91f3f', emissiveColor = '#8b1a2e' }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.5
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 3, 0.2]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        emissive={emissiveColor}
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

export function Card3D({ color = '#d91f3f', emissiveColor = '#8b1a2e' }: Card3DProps) {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={75} />
      <OrbitControls autoRotate autoRotateSpeed={3} enableZoom={false} />

      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color={color} />

      <RotatingCard color={color} emissiveColor={emissiveColor} />
    </Canvas>
  )
}
