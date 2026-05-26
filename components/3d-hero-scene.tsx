'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function FloatingBox() {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = Math.sin(frameRef.current * 0.01) * 0.5
      frameRef.current++
    }
  })

  return (
    <mesh ref={meshRef} scale={1.5}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#00d9ff"
        emissive="#00a8cc"
        emissiveIntensity={0.5}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  )
}

function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(frameRef.current * 0.008) * 3
      meshRef.current.position.z = Math.sin(frameRef.current * 0.008) * 3
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
      frameRef.current++
    }
  })

  return (
    <mesh ref={meshRef} position={[3, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#ff6b9d"
        emissive="#ff4081"
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  )
}

function FloatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004
      meshRef.current.rotation.z -= 0.002
      meshRef.current.position.y = Math.cos(frameRef.current * 0.006) * 1
      frameRef.current++
    }
  })

  return (
    <mesh ref={meshRef} position={[-3, 1, 0]} scale={0.8}>
      <torusGeometry args={[1.5, 0.5, 100, 100]} />
      <meshStandardMaterial
        color="#00d9ff"
        emissive="#00a8cc"
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.1}
      />
    </mesh>
  )
}

function ParticleField() {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = 1000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 10
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    particlesRef.current.geometry = geometry
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0001
      groupRef.current.rotation.y += 0.0002
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={particlesRef}>
        <bufferGeometry />
        <pointsMaterial size={0.05} color="#00d9ff" sizeAttenuation={true} />
      </points>
    </group>
  )
}

export function Scene3D() {
  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
      <Environment preset="night" />
      <color attach="background" args={['#0a0f1a']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
      <pointLight position={[-10, -10, 10]} intensity={0.7} color="#ff6b9d" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00d9ff" />

      {/* Floating 3D objects */}
      <FloatingBox />
      <FloatingSphere />
      <FloatingTorus />
      <ParticleField />

      <OrbitControls 
        enableZoom={true}
        autoRotate
        autoRotateSpeed={2}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}
