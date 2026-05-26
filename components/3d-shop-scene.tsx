'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function ShoppingBag() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    let time = 0
    const animate = () => {
      time += 0.01
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.6
        groupRef.current.rotation.x = Math.cos(time * 0.5) * 0.3
        groupRef.current.position.y = Math.sin(time) * 0.4
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <group ref={groupRef} scale={1.3}>
      {/* Bag main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 1, 0.3]} />
        <meshStandardMaterial color={0xd91f3f} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Front panel with shine */}
      <mesh position={[0, 0, 0.16]} castShadow>
        <boxGeometry args={[0.75, 0.95, 0.05]} />
        <meshPhysicalMaterial
          color={0xff2547}
          metalness={0.6}
          roughness={0.3}
          emissive={0xa71730}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Left handle */}
      <mesh position={[-0.25, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color={0xfbbf24} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Right handle */}
      <mesh position={[0.25, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color={0xfbbf24} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Handle connector */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.1]} />
        <meshStandardMaterial color={0xfbbf24} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Logo circle */}
      <mesh position={[0, 0, 0.17]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshStandardMaterial color={0xfbbf24} emissive={0xfbbf24} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 8, 8]} intensity={1} castShadow />
      <pointLight position={[-8, -8, 5]} intensity={0.7} color={0xfbbf24} />
    </>
  )
}

export function Shop3DScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3.5], fov: 50 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 3.5]} />
      <Lights />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.2} fade speed={1.2} />
      <ShoppingBag />
      <OrbitControls autoRotate autoRotateSpeed={3} enableZoom={false} />
    </Canvas>
  )
}
