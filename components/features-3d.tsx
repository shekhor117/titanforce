'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Feature3DCardProps {
  title: string
  description: string
  icon: string
  color: string
  position: [number, number, number]
}

function Feature3DCard({ title, description, icon, color, position }: Feature3DCardProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
      meshRef.current.position.y = position[1] + Math.sin(frameRef.current * 0.008) * 0.5
      frameRef.current++
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[2, 2.5, 0.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  )
}

export function Features3D() {
  const features = [
    {
      title: 'Interactive 3D',
      description: 'Engage with stunning 3D models and animations',
      icon: '🎨',
      color: '#00d9ff',
      position: [-5, 0, 0] as [number, number, number],
    },
    {
      title: 'Immersive Design',
      description: 'Experience next-generation visual design',
      icon: '✨',
      color: '#ff6b9d',
      position: [0, 0, 0] as [number, number, number],
    },
    {
      title: 'Real-time Effects',
      description: 'Dynamic animations and particle systems',
      icon: '⚡',
      color: '#00d9ff',
      position: [5, 0, 0] as [number, number, number],
    },
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background via-card/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Features & Capabilities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our cutting-edge 3D design features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl card-3d p-8 bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* 3D Canvas for feature showcase */}
        <div className="w-full h-96 rounded-xl overflow-hidden border border-border/30 bg-background/50">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
            <Environment preset="night" />
            <color attach="background" args={['#0a0f1a']} />
            
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
            <pointLight position={[-10, -10, 10]} intensity={0.7} color="#ff6b9d" />

            {features.map((feature, index) => (
              <Feature3DCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                position={feature.position}
              />
            ))}

            <OrbitControls
              enableZoom={true}
              autoRotate
              autoRotateSpeed={2}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
