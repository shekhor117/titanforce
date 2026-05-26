'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Football() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.008
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshPhysicalMaterial
        color={0xffffff}
        metalness={0.3}
        roughness={0.4}
        emissive={0xd91e3f}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function FootballField() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 6.5]} />
      <meshStandardMaterial color={0x1a472a} />
    </mesh>
  )
}

function FieldMarkings() {
  const points = [
    new THREE.Vector3(-5, 0.01, 0),
    new THREE.Vector3(5, 0.01, 0),
  ]
  
  return (
    <group>
      {/* Center line */}
      <Line points={points} color={0xffffff} lineWidth={2} />
      
      {/* Center circle points */}
      <mesh position={[0, 0.02, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color={0xffffff} wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Goal areas */}
      <mesh position={[-4.5, 0.02, 0]}>
        <planeGeometry args={[1.5, 4]} />
        <meshBasicMaterial color={0xffffff} wireframe transparent opacity={0.2} />
      </mesh>
      
      <mesh position={[4.5, 0.02, 0]}>
        <planeGeometry args={[1.5, 4]} />
        <meshBasicMaterial color={0xffffff} wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function Player({ position, color }: { position: [number, number, number], color: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x += Math.sin(clock.elapsedTime * 0.5) * 0.01
      groupRef.current.position.z += Math.cos(clock.elapsedTime * 0.5) * 0.01
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={0xffb88c} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>
      <mesh position={[0.1, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 8, 0]} intensity={0.4} color={0xffffff} />
      <pointLight position={[5, 8, 0]} intensity={0.4} color={0xd91e3f} />
    </>
  )
}

export function Football3DScene() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
      shadows
    >
      <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={50} />
      <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={false} />
      
      <Lights />
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      
      {/* Field and markings */}
      <FootballField />
      <FieldMarkings />
      
      {/* Football */}
      <Football />
      
      {/* Players */}
      <Player position={[-2, 0, 1]} color={0xd91e3f} />
      <Player position={[2, 0, -1]} color={0xffffff} />
      <Player position={[-1, 0, -2]} color={0xd91e3f} />
      <Player position={[1.5, 0, 2]} color={0xffffff} />
      
      {/* Fog effect */}
      <fog attach="fog" args={['#000000', 5, 30]} />
    </Canvas>
  )
}
