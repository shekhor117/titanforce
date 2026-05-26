'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Sun component
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshBasicMaterial color="#FDB813" />
      <pointLight intensity={2} distance={100} />
    </mesh>
  )
}

// Planet component
interface PlanetProps {
  size: number
  color: string
  distance: number
  speed: number
  rotationSpeed: number
}

function Planet({ size, color, distance, speed, rotationSpeed }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.elapsedTime * speed
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={planetRef} position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>

      {/* Orbit line */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={64}
            array={new Float32Array(
              Array.from({ length: 64 }).flatMap((_, i) => {
                const angle = (i / 64) * Math.PI * 2
                return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance]
              })
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </lineSegments>
    </group>
  )
}

export function SolarSystem3D() {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={60} />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5} 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />

      {/* Stars background */}
      <Stars radius={500} depth={50} count={1000} factor={7} />

      {/* Sun */}
      <Sun />

      {/* Mercury */}
      <Planet size={0.3} color="#8C7853" distance={4} speed={0.1} rotationSpeed={0.05} />

      {/* Venus */}
      <Planet size={0.7} color="#FFC649" distance={6} speed={0.07} rotationSpeed={0.03} />

      {/* Earth */}
      <Planet size={0.7} color="#4A90E2" distance={8.5} speed={0.05} rotationSpeed={0.04} />

      {/* Mars */}
      <Planet size={0.5} color="#E74C3C" distance={11} speed={0.04} rotationSpeed={0.035} />

      {/* Jupiter */}
      <Planet size={1.5} color="#C88B3A" distance={15} speed={0.025} rotationSpeed={0.03} />

      {/* Saturn */}
      <Planet size={1.2} color="#F4D47F" distance={19} speed={0.015} rotationSpeed={0.025} />

      {/* Fog effect */}
      <fog attach="fog" args={['#000000', 30, 500]} />
    </Canvas>
  )
}
