'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function MatchScoreboard() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    let time = 0
    const animate = () => {
      time += 0.01
      if (groupRef.current) {
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.3
        groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.2
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <group ref={groupRef}>
      {/* Main scoreboard */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 0.1]} />
        <meshStandardMaterial color={0x1f1f1f} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Score left */}
      <mesh position={[-0.4, 0, 0.06]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color={0xfbbf24} emissive={0xfbbf24} emissiveIntensity={0.8} />
      </mesh>

      {/* Score right */}
      <mesh position={[0.4, 0, 0.06]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color={0xfbbf24} emissive={0xfbbf24} emissiveIntensity={0.8} />
      </mesh>

      {/* Center divider */}
      <mesh position={[0, 0, 0.061]} castShadow>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color={0xd91f3f} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Top stand */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <boxGeometry args={[1.6, 0.15, 0.1]} />
        <meshStandardMaterial color={0x333333} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Support legs */}
      <mesh position={[-0.6, -0.6, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color={0x222222} metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0.6, -0.6, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color={0x222222} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 0, 3]} intensity={0.7} color={0xfbbf24} />
      <pointLight position={[0, 5, -5]} intensity={0.6} color={0xd91f3f} />
    </>
  )
}

export function Fixtures3DScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} />
      <Lights />
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0.3} fade speed={0.8} />
      <MatchScoreboard />
      <OrbitControls autoRotate autoRotateSpeed={2.5} enableZoom={false} />
    </Canvas>
  )
}
