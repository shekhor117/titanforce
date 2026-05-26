'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Realistic Player Model
function RealisticPlayer({ 
  position = [0, 0, 0], 
  teamColor = 0xd91e3f,
  animationOffset = 0,
  isKicking = false 
}) {
  const playerGroupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!playerGroupRef.current) return
    
    const time = clock.elapsedTime + animationOffset
    
    // Walking animation
    if (!isKicking) {
      playerGroupRef.current.position.x = position[0] + Math.sin(time * 2) * 2
      playerGroupRef.current.position.z = position[2] + Math.cos(time * 2) * 1.5
    } else {
      // Kicking animation
      const kickCycle = Math.sin(time * 3)
      playerGroupRef.current.rotation.z = kickCycle * 0.2
      playerGroupRef.current.position.y = position[1] + Math.abs(Math.sin(time * 3)) * 0.3
    }
  })

  return (
    <group ref={playerGroupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={0xfdbcb4} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.25]} />
        <meshStandardMaterial color={teamColor} />
      </mesh>

      {/* Jersey Number on Back */}
      <mesh position={[0, 1.2, -0.13]} castShadow>
        <planeGeometry args={[0.2, 0.3]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.2, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color={0xfdbcb4} />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.2, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color={0xfdbcb4} />
      </mesh>

      {/* Shorts */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.25]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.12, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.12, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>

      {/* Left Shoe */}
      <mesh position={[-0.12, -0.1, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.25]} />
        <meshStandardMaterial color={0x000000} />
      </mesh>

      {/* Right Shoe */}
      <mesh position={[0.12, -0.1, 0.05]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.25]} />
        <meshStandardMaterial color={0x000000} />
      </mesh>
    </group>
  )
}

// Football Ball
function Ball({ position = [2, 1, 0] }) {
  const ballRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ballRef.current) {
      ballRef.current.rotation.x += 0.02
      ballRef.current.rotation.y += 0.015
      ballRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2.5) * 0.15
    }
  })

  return (
    <mesh ref={ballRef} position={position} castShadow>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshPhysicalMaterial
        color={0xffffff}
        metalness={0.3}
        roughness={0.4}
        emissive={0xd91e3f}
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

// Football Field
function Field() {
  return (
    <>
      {/* Main Field */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color={0x1a472a} />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 10]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      {/* Center Circle */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.05, 8, 32]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      {/* Goal Areas */}
      <mesh position={[-7.5, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 3]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      <mesh position={[7.5, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 3]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
    </>
  )
}

// Lighting
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color={0xd91e3f} />
      <pointLight position={[10, 8, 10]} intensity={0.4} color={0xfbbf24} />
    </>
  )
}

export function RealisticPlayers3D() {
  return (
    <Canvas 
      className="w-full h-full"
      style={{ background: 'transparent' }}
      shadows
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={60} />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={1.5}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.6}
        minPolarAngle={Math.PI * 0.3}
      />

      <Lighting />

      {/* Starfield */}
      <Stars radius={150} depth={80} count={1000} factor={5} />

      {/* Field */}
      <Field />

      {/* Players - Team Red */}
      <RealisticPlayer position={[2, 0, 1]} teamColor={0xd91e3f} animationOffset={0} isKicking={true} />
      <RealisticPlayer position={[-2, 0, -1]} teamColor={0xd91e3f} animationOffset={1} />
      <RealisticPlayer position={[1, 0, -3]} teamColor={0xd91e3f} animationOffset={2} />

      {/* Players - Team White */}
      <RealisticPlayer position={[-3, 0, 2]} teamColor={0xffffff} animationOffset={0.5} />
      <RealisticPlayer position={[3, 0, -2]} teamColor={0xffffff} animationOffset={1.5} />

      {/* Ball */}
      <Ball position={[2, 1.2, 0]} />

      {/* Fog effect */}
      <fog attach="fog" args={['#000000', 10, 50]} />
    </Canvas>
  )
}
