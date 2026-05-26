"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Sphere } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function RotatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
        <meshPhongMaterial
          color="#A71830"
          emissive="#8B1123"
          emissiveIntensity={0.5}
          wireframe={false}
          shininess={100}
        />
      </Sphere>
    </Float>
  )
}

function RotatingRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.15, 16, 100]} />
        <meshPhongMaterial
          color="#3B82F6"
          emissive="#1E40AF"
          emissiveIntensity={0.3}
          wireframe={false}
        />
      </mesh>
    </Float>
  )
}

function FloatingCubes() {
  return (
    <>
      <Float speed={1.2} rotationIntensity={1} floatIntensity={1} position={[-4, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhongMaterial
            color="#D91E3F"
            emissive="#A71830"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1} position={[4, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhongMaterial
            color="#3B82F6"
            emissive="#1E40AF"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={1} floatIntensity={1} position={[0, -3, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshPhongMaterial
            color="#10B981"
            emissive="#059669"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
    </>
  )
}

export function ThreeDBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 10]} intensity={0.4} color="#3B82F6" />

      <RotatingOrb />
      <RotatingRing />
      <FloatingCubes />

      <Environment preset="night" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}
