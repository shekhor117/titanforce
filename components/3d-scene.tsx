'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface RotatingBoxProps {
  position: [number, number, number]
  color: string
}

function RotatingBox({ position, color }: RotatingBoxProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.005
      ref.current.rotation.y += 0.008
    }
  })

  return (
    <RoundedBox ref={ref} position={position} args={[0.8, 0.8, 0.8]} radius={0.1}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </RoundedBox>
  )
}

interface FloatingCardProps {
  position: [number, number, number]
  label: string
}

function FloatingCard({ position, label }: FloatingCardProps) {
  const ref = useRef<THREE.Mesh>(null)
  const yPos = useRef(position[1])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.5
      ref.current.rotation.z += 0.005
    }
  })

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[1.2, 1.2, 0.2]} radius={0.1}>
        <meshStandardMaterial color="#6366f1" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <Html position={[0, 0, 0.15]} center scale={1}>
        <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
          <span className="text-white text-center font-bold">{label}</span>
        </div>
      </Html>
    </group>
  )
}

function FloatingParticles() {
  const particles = useRef<THREE.Points>(null)
  const positionArray = useRef<Float32Array>()

  useEffect(() => {
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 20
    }

    positionArray.current = positions
  }, [])

  useFrame(() => {
    if (particles.current && particles.current.geometry) {
      const positions = particles.current.geometry.attributes.position.array as Float32Array
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.01
        if (positions[i] < -10) {
          positions[i] = 10
        }
      }
      particles.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positionArray.current?.length || 0 / 3} array={positionArray.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation color="#e0e7ff" />
    </points>
  )
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    >
      <OrbitControls enableZoom enablePan enableRotate />
      <Environment preset="night" />

      <FloatingParticles />

      {/* Central text */}
      <group position={[0, 2, 0]}>
        <Text position={[0, 0, 0]} fontSize={2} color="#e0e7ff" anchorX="center">
          3D Experience
        </Text>
        <Text position={[0, -0.8, 0]} fontSize={0.8} color="#a5b4fc" anchorX="center">
          Interactive 3D UI
        </Text>
      </group>

      {/* Rotating boxes in a circle */}
      <RotatingBox position={[4, 0, 0]} color="#3b82f6" />
      <RotatingBox position={[-4, 0, 0]} color="#8b5cf6" />
      <RotatingBox position={[0, 4, 0]} color="#ec4899" />
      <RotatingBox position={[0, -4, 0]} color="#06b6d4" />

      {/* Floating cards */}
      <FloatingCard position={[3, -4, -3]} label="Design" />
      <FloatingCard position={[-3, -4, -3]} label="Build" />
      <FloatingCard position={[3, 0, -5]} label="Create" />
      <FloatingCard position={[-3, 0, -5]} label="Innovate" />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#a78bfa" />
    </Canvas>
  )
}
