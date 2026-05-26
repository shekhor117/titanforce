'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Football Ball
function FootballBall({ position = [0, 1.5, -1] }) {
  const ballRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ballRef.current) {
      ballRef.current.rotation.x += 0.02
      ballRef.current.rotation.y += 0.015
      // Slight floating motion
      ballRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={ballRef} position={position} castShadow>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshPhysicalMaterial
        color={0xffffff}
        metalness={0.4}
        roughness={0.3}
        emissive={0xd91e3f}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// Player Body
function PlayerBody() {
  const playerRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (playerRef.current) {
      // Player kicking animation
      const time = clock.elapsedTime
      const kickCycle = (Math.sin(time * 0.5) + 1) / 2 // 0 to 1
      
      if (kickCycle < 0.5) {
        // Kick motion
        const kickProgress = kickCycle * 2 // 0 to 1
        playerRef.current.rotation.z = kickProgress * 0.3 - 0.15
      } else {
        // Return to normal
        const returnProgress = (kickCycle - 0.5) * 2 // 0 to 1
        playerRef.current.rotation.z = 0.3 * (1 - returnProgress) - 0.15 * returnProgress
      }
    }
  })

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      {/* Torso */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.25]} />
        <meshStandardMaterial color={0xd91e3f} /> {/* Red team color */}
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={0xf5a99f} /> {/* Skin tone */}
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.35, 1, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={0xf5a99f} /> {/* Skin tone */}
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.35, 1, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color={0xf5a99f} /> {/* Skin tone */}
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.15, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color={0xffffff} /> {/* White shorts */}
      </mesh>

      {/* Right Leg (animated kicking leg) */}
      <mesh
        position={[0.15, 0.3, 0]}
        castShadow
        rotation={[0.5, 0, 0]}
      >
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color={0xffffff} /> {/* White shorts */}
      </mesh>

      {/* Jersey Number */}
      <mesh position={[0, 0.8, 0.13]}>
        <boxGeometry args={[0.3, 0.4, 0.01]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
    </group>
  )
}

// Football Field Ground
function FieldGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[12, 8]} />
      <meshStandardMaterial color={0x1a472a} />
    </mesh>
  )
}

// Center Circle marking
function CenterCircle() {
  const points = []
  for (let i = 0; i <= 32; i++) {
    const angle = (i / 32) * Math.PI * 2
    const radius = 1.5
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0.01,
        Math.sin(angle) * radius
      )
    )
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={0xffffff} linewidth={2} />
    </line>
  )
}

// Lights
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 8, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.6} color={0xd91e3f} />
      <pointLight position={[5, 5, -5]} intensity={0.4} color={0xa71930} />
    </>
  )
}

export function PlayerAction3D() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
      shadows
    >
      <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={60} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.5}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Environment */}
      <Stars radius={150} depth={80} count={1000} factor={5} saturation={0.5} />
      <fog attach="fog" args={['#000000', 8, 30]} />

      {/* Lighting */}
      <Lighting />

      {/* Field and Elements */}
      <FieldGround />
      <CenterCircle />

      {/* Player */}
      <PlayerBody />

      {/* Football */}
      <FootballBall />
    </Canvas>
  )
}
