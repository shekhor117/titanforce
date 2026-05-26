'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, useTexture } from '@react-three/drei'
import { useRef, useState } from 'react'

interface Gallery3DCardProps {
  imageUrl: string
  title: string
  onFlip?: () => void
}

function Card3D({ imageUrl, title }: Gallery3DCardProps) {
  const groupRef = useRef<any>(null)
  const meshRef = useRef<any>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const { mouse } = useThree()

  const texture = useTexture(imageUrl, (tex) => {
    tex.colorSpace = 'srgb'
  })

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Smooth hover tilt
      groupRef.current.rotation.x = (mouse.y * 0.15) * 0.2
      groupRef.current.rotation.y = (mouse.x * 0.15) * 0.2

      // Add slight bob animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1

      // Flip animation
      if (isFlipping) {
        const newRotation = rotation + 0.1
        meshRef.current.rotation.y = newRotation
        setRotation(newRotation)

        if (newRotation > Math.PI) {
          setIsFlipping(false)
          setRotation(0)
        }
      }

      // Subtle shimmer
      meshRef.current.material.emissiveIntensity =
        0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const handleCardClick = () => {
    setIsFlipping(true)
    setRotation(0)
  }

  return (
    <group
      ref={groupRef}
      onClick={handleCardClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <mesh ref={meshRef} scale={[3, 2, 0.2]}>
        {/* Front face - Image */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.3}
          roughness={0.4}
          emissive="#a71930"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Light effect */}
      <mesh position={[0, 0, 0.15]} scale={[3.1, 2.1, 0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          emissive="#d91e3f"
          emissiveIntensity={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

export function Gallery3DCardScene({ imageUrl, title }: Gallery3DCardProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6] }}
      className="w-full h-full"
      dpr={[1, 2]}
      style={{ touchAction: 'none' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#d91e3f" />

      <Card3D imageUrl={imageUrl} title={title} />
    </Canvas>
  )
}
