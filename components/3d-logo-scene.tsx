'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Sphere, Float } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'

interface LogoProps {
  logoImageUrl?: string
}

function RotatingLogo({ logoImageUrl = '/logo.png' }: LogoProps) {
  const meshRef = useRef<any>(null)
  const containerRef = useRef<any>(null)
  const particlesRef = useRef<any>(null)
  const { mouse } = useThree()
  const [hasImage, setHasImage] = useState(false)
  const particleCount = 150

  useEffect(() => {
    // Pre-load image to check if it exists
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setHasImage(true)
    img.onerror = () => setHasImage(false)
    img.src = logoImageUrl
  }, [logoImageUrl])

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }

    if (containerRef.current) {
      // Mouse tracking for subtle movement
      containerRef.current.rotation.x = (mouse.y * 0.3) * 0.2
      containerRef.current.rotation.y = (mouse.x * 0.3) * 0.2
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0002
    }
  })

  const particles = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount * 3; i += 3) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 2
    particles[i] = Math.cos(angle) * radius
    particles[i + 1] = (Math.random() - 0.5) * 4
    particles[i + 2] = Math.sin(angle) * radius
  }

  return (
    <group ref={containerRef}>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#a71930"
          sizeAttenuation
          transparent
          opacity={0.4}
          fog={false}
        />
      </points>

      {/* Main Logo Group */}
      <group ref={meshRef}>
        {/* Glowing sphere background */}
        <Sphere args={[1.8, 32, 32]} scale={1}>
          <meshStandardMaterial
            color="#a71930"
            emissive="#d91e3f"
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.4}
            wireframe={false}
          />
        </Sphere>

        {/* Logo plane with canvas texture */}
        <mesh position={[0, 0, 1.85]} scale={1.6}>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissiveIntensity={0.1}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>

        {/* Accent ring */}
        <mesh scale={[2.2, 2.2, 0.1]}>
          <torusGeometry args={[1.8, 0.15, 32, 64]} />
          <meshStandardMaterial
            color="#d91e3f"
            emissive="#d91e3f"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Outer glow */}
      <Sphere args={[2.5, 32, 32]} scale={1}>
        <meshStandardMaterial
          color="#a71930"
          emissive="#a71930"
          emissiveIntensity={0.15}
          transparent
          opacity={0.2}
          metalness={0.5}
          roughness={0.5}
        />
      </Sphere>
    </group>
  )
}

export function Logo3DScene({ logoImageUrl }: LogoProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="w-full h-full"
      dpr={[1, 2]}
      style={{ touchAction: 'none' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#d91e3f" />
      
      <RotatingLogo logoImageUrl={logoImageUrl} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  )
}
