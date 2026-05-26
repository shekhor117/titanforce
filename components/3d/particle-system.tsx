'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { createStandardMaterial } from '@/lib/3d/materials'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  size: number
}

export function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<Particle[]>([])

  // Initialize particles
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
        size: Math.random() * 0.1,
      })
    }
  }

  useFrame(() => {
    if (pointsRef.current && pointsRef.current.geometry) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      particlesRef.current.forEach((particle, i) => {
        particle.position.add(particle.velocity)

        // Wrap around
        if (particle.position.x > 20) particle.position.x = -20
        if (particle.position.x < -20) particle.position.x = 20
        if (particle.position.y > 20) particle.position.y = -20
        if (particle.position.y < -20) particle.position.y = 20
        if (particle.position.z > 20) particle.position.z = -20
        if (particle.position.z < -20) particle.position.z = 20

        positions[i * 3] = particle.position.x
        positions[i * 3 + 1] = particle.position.y
        positions[i * 3 + 2] = particle.position.z
      })

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const positions = new Float32Array(particlesRef.current.length * 3)
  particlesRef.current.forEach((particle, i) => {
    positions[i * 3] = particle.position.x
    positions[i * 3 + 1] = particle.position.y
    positions[i * 3 + 2] = particle.position.z
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#60a5fa" size={0.05} sizeAttenuation />
    </points>
  )
}

export default ParticleSystem
