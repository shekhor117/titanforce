'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, OrbitControls, Sphere, MeshWobbleMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Get CSS variable colors safely
function getCSSColor(variableName: string): number {
  if (typeof window === 'undefined') return 0xd91e3f
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim()
    if (!value) return 0xd91e3f
    const hex = value.replace('#', '').replace(/\s/g, '')
    return parseInt(hex, 16) || 0xd91e3f
  } catch (e) {
    console.error(`[v0] Failed to parse color ${variableName}:`, e)
    return 0xd91e3f
  }
}

function RotatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [mainColor, setMainColor] = useState(0xd91e3f)
  const [emissiveColor, setEmissiveColor] = useState(0xa71930)

  useEffect(() => {
    setMainColor(getCSSColor('--accent'))
    setEmissiveColor(getCSSColor('--primary'))
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <MeshWobbleMaterial
        color={mainColor}
        speed={2}
        factor={0.6}
        emissive={emissiveColor}
        emissiveIntensity={0.5}
      />
    </Sphere>
  )
}

function FloatingBox() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [mainColor, setMainColor] = useState(0xd91e3f)
  const [emissiveColor, setEmissiveColor] = useState(0xa71930)

  useEffect(() => {
    setMainColor(getCSSColor('--accent'))
    setEmissiveColor(getCSSColor('--primary'))
  }, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime) * 2
      meshRef.current.rotation.x = clock.elapsedTime * 0.5
      meshRef.current.rotation.y = clock.elapsedTime * 0.7
    }
  })

  return (
    <mesh ref={meshRef} position={[4, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color={mainColor}
        metalness={0.8}
        roughness={0.2}
        emissive={emissiveColor}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function FloatingTetrahedron() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [mainColor, setMainColor] = useState(0xa71930)
  const [emissiveColor, setEmissiveColor] = useState(0xd91e3f)

  useEffect(() => {
    setMainColor(getCSSColor('--primary'))
    setEmissiveColor(getCSSColor('--accent'))
  }, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.cos(clock.elapsedTime * 0.8) * 2
      meshRef.current.rotation.x = clock.elapsedTime * 0.3
      meshRef.current.rotation.z = clock.elapsedTime * 0.4
    }
  })

  return (
    <mesh ref={meshRef} position={[-4, 0, 0]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={mainColor}
        metalness={0.6}
        roughness={0.3}
        emissive={emissiveColor}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

export function Scene3D() {
  const [accentLightColor, setAccentLightColor] = useState(0xd91e3f)

  useEffect(() => {
    setAccentLightColor(getCSSColor('--accent'))
  }, [])

  return (
    <Canvas
      className="w-full h-full"
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.4} color={accentLightColor} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color={accentLightColor} />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={500} factor={4} />

      {/* 3D Objects */}
      <RotatingSphere />
      <FloatingBox />
      <FloatingTetrahedron />

      {/* Fog effect */}
      <fog attach="fog" args={['#000000', 5, 25]} />
    </Canvas>
  )
}
