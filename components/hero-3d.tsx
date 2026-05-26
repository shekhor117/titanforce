'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Environment, Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'
import { Navbar3D } from './navbar-3d'

function AnimatedTitle() {
  const groupRef = useRef<THREE.Group>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(frameRef.current * 0.005) * 0.1
      frameRef.current++
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Text
        position={[0, 2, 0]}
        fontSize={1.5}
        color="#00d9ff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        IMMERSIVE
      </Text>
      <Text
        position={[0, 0, 0]}
        fontSize={2}
        color="#ff6b9d"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        3D DESIGN
      </Text>
      <Text
        position={[0, -2, 0]}
        fontSize={1.2}
        color="#00d9ff"
        anchorX="center"
        anchorY="middle"
        fontWeight="normal"
      >
        Experience the Future
      </Text>
    </group>
  )
}

function RotatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
      meshRef.current.scale.set(
        1 + Math.sin(frameRef.current * 0.01) * 0.2,
        1 + Math.sin(frameRef.current * 0.01) * 0.2,
        1 + Math.sin(frameRef.current * 0.01) * 0.2
      )
      frameRef.current++
    }
  })

  return (
    <Sphere ref={meshRef} args={[1.5, 128, 128]} position={[-5, 0, 0]}>
      <meshStandardMaterial
        color="#00d9ff"
        emissive="#00a8cc"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  )
}

function HeroScene() {
  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
      <Environment preset="night" />
      <color attach="background" args={['#0a0f1a']} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00d9ff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#ff6b9d" />

      <AnimatedTitle />
      <RotatingOrb />

      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}

export function Hero3D() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-background via-card to-background">
      <Navbar3D />
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full">
        <HeroScene />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-20">
        <div className={`text-center transform transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            Welcome to 3D
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore a stunning immersive experience with cutting-edge 3D design and interactive elements
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="#features" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold hover:scale-105">
              Explore
            </Link>
            <Link href="#contact" className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-semibold hover:scale-105">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
