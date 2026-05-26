'use client'

import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { createEmissiveMaterial } from '@/lib/3d/materials'

interface Button3DProps {
  text: string
  position?: [number, number, number]
  onClick?: () => void
  scale?: number
  color?: string
}

export function Button3D({ text, position = [0, 0, 0], onClick, scale = 1, color = '#60a5fa' }: Button3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.01
      groupRef.current.rotation.y += 0.02
      if (hovered) {
        groupRef.current.scale.lerp(new THREE.Vector3(scale * 1.2, scale * 1.2, scale * 1.2), 0.1)
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      }
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <mesh material={createEmissiveMaterial(color, hovered ? 1 : 0.5)}>
        <boxGeometry args={[1, 0.6, 0.3]} />
      </mesh>
    </group>
  )
}

export default Button3D
