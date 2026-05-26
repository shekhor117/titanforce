'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Icosahedron, Torus, Box, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

function WobbleBox() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.3
    }
  })

  return (
    <Box ref={meshRef} args={[1.5, 1.5, 1.5]} position={[-3, 0, 0]}>
      <MeshWobbleMaterial color="#00d9ff" speed={1.5} factor={0.8} />
    </Box>
  )
}

function RotatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.015
    }
  })

  return (
    <Torus ref={meshRef} args={[1, 0.4, 100, 100]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#ff6b9d" metalness={0.8} roughness={0.2} />
    </Torus>
  )
}

function RotatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z += 0.003
    }
  })

  return (
    <Icosahedron ref={meshRef} args={[1, 4]} position={[3, 0, 0]}>
      <meshStandardMaterial color="#00d9ff" metalness={0.7} roughness={0.3} />
    </Icosahedron>
  )
}

function ShowcaseScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <Environment preset="night" />
      <color attach="background" args={['#0a0f1a']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00d9ff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#ff6b9d" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ff6b9d" />

      <WobbleBox />
      <RotatingTorus />
      <RotatingIcosahedron />
    </Canvas>
  )
}

export function Showcase3D() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - 3D Scene */}
          <div className="h-96 rounded-xl overflow-hidden border border-border/30 bg-background/50 order-2 lg:order-1">
            <ShowcaseScene />
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg mb-4">
              <span className="text-sm font-semibold text-primary">3D Showcase</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Interactive 3D Elements
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience real-time 3D rendering with interactive controls. Our showcase demonstrates the power of modern web graphics with smooth animations, dynamic lighting, and immersive visual effects.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Real-time ray tracing and lighting',
                'Smooth animation and transitions',
                'Interactive controls and zoom',
                'Responsive design for all devices',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 font-semibold hover:scale-105">
              Explore More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
