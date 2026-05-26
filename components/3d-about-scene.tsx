'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function FloatingBall() {
  const ref = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!ref.current) return
    let time = 0
    const animate = () => {
      time += 0.01
      if (ref.current) {
        ref.current.rotation.x += 0.003
        ref.current.rotation.y += 0.004
        ref.current.position.y = Math.sin(time) * 0.3
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshPhysicalMaterial
        color={0xd91f3f}
        metalness={0.8}
        roughness={0.2}
        emissive={0xa71730}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function FootballField() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial color={0x1a472a} />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, 5]} intensity={0.4} color={0xff6b9d} />
    </>
  )
}

export function About3DScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3.5], fov: 50 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 3.5]} />
      <Lights />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FootballField />
      <FloatingBall />
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
    </Canvas>
  )
}
