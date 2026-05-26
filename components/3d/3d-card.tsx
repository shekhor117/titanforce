'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { createGlassyMaterial } from '@/lib/3d/materials'
import { Text } from '@react-three/drei'

interface Card3DProps {
  title: string
  description?: string
  position?: [number, number, number]
  scale?: number
  onClick?: () => void
}

export function Card3D({ title, description, position = [0, 0, 0], scale = 1, onClick }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.002
    }
  })

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      <mesh scale={scale} material={createGlassyMaterial()}>
        <boxGeometry args={[2, 2.5, 0.2]} />
      </mesh>
      <Text position={[0, 0.8, 0.12]} fontSize={0.4} color="#ffffff" anchorY="top">
        {title}
      </Text>
      {description && (
        <Text position={[0, -0.5, 0.12]} fontSize={0.2} color="#cccccc" anchorY="middle" maxWidth={1.8}>
          {description}
        </Text>
      )}
    </group>
  )
}

export default Card3D
