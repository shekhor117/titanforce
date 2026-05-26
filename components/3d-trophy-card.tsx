'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Icosahedron, Float } from '@react-three/drei'
import { useRef } from 'react'

interface Trophy3DCardProps {
  icon: string
  name: string
  year: number
  category: string
}

function Trophy3D({ icon, year }: Trophy3DCardProps) {
  const groupRef = useRef<any>(null)
  const gemRef = useRef<any>(null)
  const { mouse } = useThree()

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation based on mouse position
      groupRef.current.rotation.x = (mouse.y * 0.5) * 0.15
      groupRef.current.rotation.y = (mouse.x * 0.5) * 0.15

      // Gentle rotation
      groupRef.current.rotation.z += 0.002
    }

    if (gemRef.current) {
      // Pulsing scale effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      gemRef.current.scale.set(scale, scale, scale)

      // Color shift based on animation
      const hue = (state.clock.elapsedTime * 0.2) % 1
      const saturation = 0.8
      const lightness = 0.6
      gemRef.current.material.color.setHSL(hue * 0.1, saturation, lightness)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main gem/trophy shape */}
      <Icosahedron ref={gemRef} args={[1.2, 4]} scale={1}>
        <meshStandardMaterial
          color="#d91e3f"
          emissive="#a71930"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.1}
          wireframe={false}
        />
      </Icosahedron>

      {/* Glow particles around trophy */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial
          emissive="#d91e3f"
          emissiveIntensity={0.15}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -1.5, 0]} scale={[2, 0.3, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.6}
          roughness={0.3}
          emissive="#a71930"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Year indicator ring */}
      <mesh position={[0, -1.3, 0]} scale={[2.2, 0.1, 2.2]}>
        <torusGeometry args={[1, 0.1, 32, 32]} />
        <meshStandardMaterial
          color="#d91e3f"
          emissive="#d91e3f"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

export function Trophy3DCardScene({ icon, name, year, category }: Trophy3DCardProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      className="w-full h-full"
      dpr={[1, 2]}
      style={{ touchAction: 'none' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 8]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#d91e3f" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#a71930" />

      <Trophy3D icon={icon} name={name} year={year} category={category} />
    </Canvas>
  )
}
