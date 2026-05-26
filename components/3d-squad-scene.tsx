'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function FootballShirt() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    let time = 0
    const animate = () => {
      time += 0.01
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(time) * 0.5
        groupRef.current.position.y = Math.cos(time * 0.7) * 0.2
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Main shirt body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.8, 0.2]} />
        <meshStandardMaterial color={0xd91f3f} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* White stripe center */}
      <mesh position={[0, 0, 0.11]} castShadow>
        <boxGeometry args={[0.08, 0.8, 0.05]} />
        <meshStandardMaterial color={0xffffff} metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.35, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.35, 16]} />
        <meshStandardMaterial color={0xd91f3f} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.35, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.35, 16]} />
        <meshStandardMaterial color={0xd91f3f} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Neck collar */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial color={0xffffff} metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, -5, 3]} intensity={0.6} color={0xfbbf24} />
    </>
  )
}

export function Squad3DScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
      <Lights />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
      <FootballShirt />
      <OrbitControls autoRotate autoRotateSpeed={3} enableZoom={false} />
    </Canvas>
  )
}
