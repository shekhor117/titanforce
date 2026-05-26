'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function ParticleRing() {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0005
      groupRef.current.rotation.y += 0.001
    }
    if (particlesRef.current) {
      frameRef.current++
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00a8cc"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.5}
          wireframe={false}
        />
      </Sphere>

      {/* Orbit rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3, 0.1, 16, 32]} />
        <meshStandardMaterial color="#ff6b9d" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[3, 0.1, 16, 32]} />
        <meshStandardMaterial color="#00d9ff" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CTAScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <Environment preset="night" />
      <color attach="background" args={['#0a0f1a']} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00d9ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ff6b9d" />

      <ParticleRing />
    </Canvas>
  )
}

export function CTA3D() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - 3D Scene */}
          <div className="h-80 rounded-xl overflow-hidden border border-border/30 bg-background/50 order-2 lg:order-1">
            <CTAScene />
          </div>

          {/* Right - CTA Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              Ready to Experience 3D?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join us in exploring the future of web design. Experience immersive 3D interfaces that push the boundaries of what&apos;s possible on the web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 font-semibold hover:scale-105">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-semibold hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  )
}
