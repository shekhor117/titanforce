'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function PhotoFrame() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    let time = 0
    const animate = () => {
      time += 0.01
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.4
        groupRef.current.position.y = Math.sin(time * 0.7) * 0.3
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <group ref={groupRef}>
      {/* Outer frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.6, 0.15]} />
        <meshStandardMaterial color={0x8b4513} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Inner frame darker border */}
      <mesh position={[0, 0, 0.08]} castShadow>
        <boxGeometry args={[1.1, 1.5, 0.05]} />
        <meshStandardMaterial color={0x654321} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Photo display area */}
      <mesh position={[0, 0, 0.081]} castShadow>
        <boxGeometry args={[0.95, 1.35, 0.05]} />
        <meshPhysicalMaterial
          color={0xd91f3f}
          metalness={0.2}
          roughness={0.4}
          emissive={0x8b0000}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glass shine effect */}
      <mesh position={[0, 0.2, 0.082]} castShadow>
        <boxGeometry args={[0.95, 0.7, 0.02]} />
        <meshStandardMaterial
          color={0xffffff}
          transparent
          opacity={0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color={0x4a4a4a} metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 6]} intensity={1} castShadow />
      <pointLight position={[-6, -6, 4]} intensity={0.6} color={0xfbbf24} />
    </>
  )
}

export function Gallery3DScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3.5], fov: 50 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 3.5]} />
      <Lights />
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0.4} fade speed={0.6} />
      <PhotoFrame />
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
    </Canvas>
  )
}
