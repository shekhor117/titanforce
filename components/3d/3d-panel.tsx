'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { createGlassyMaterial, createEmissiveMaterial } from '@/lib/3d/materials'

interface Panel3DProps {
  title: string
  position?: [number, number, number]
  width?: number
  height?: number
  children?: React.ReactNode
}

export function Panel3D({ title, position = [0, 0, 0], width = 3, height = 4 }: Panel3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.001
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Panel back */}
      <mesh position={[0, 0, -0.1]} material={createGlassyMaterial()}>
        <boxGeometry args={[width, height, 0.05]} />
      </mesh>

      {/* Panel frame */}
      <mesh material={createEmissiveMaterial('#60a5fa', 0.3)} position={[0, height / 2 - 0.3, 0]}>
        <boxGeometry args={[width, 0.6, 0.02]} />
      </mesh>
    </group>
  )
}

export default Panel3D
