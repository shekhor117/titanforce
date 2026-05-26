"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text3D } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import { Group, Color } from "three"

export function Player3DCard({ playerNumber, name }: { playerNumber: number; name: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#A71830" />
      
      <JerseyModel playerNumber={playerNumber} />
      
      <Environment preset="studio" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}

function JerseyModel({ playerNumber }: { playerNumber: number }) {
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef}>
      {/* Jersey Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2.5, 32]} />
        <meshPhongMaterial color={new Color("#A71830")} emissive={new Color("#A71830")} emissiveIntensity={0.3} />
      </mesh>

      {/* Jersey Stripes */}
      <mesh position={[-1.55, 0, 0]}>
        <planeGeometry args={[0.15, 2.5]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} />
      </mesh>
      <mesh position={[1.55, 0, 0]}>
        <planeGeometry args={[0.15, 2.5]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-1.8, 0.8, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshPhongMaterial color={new Color("#A71830")} emissive={new Color("#A71830")} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.8, 0.8, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshPhongMaterial color={new Color("#A71830")} emissive={new Color("#A71830")} emissiveIntensity={0.3} />
      </mesh>

      {/* Number Badge */}
      <mesh position={[0, 0.3, 1.6]}>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} emissive={new Color("#FFD700")} emissiveIntensity={0.5} />
      </mesh>

      {/* Number Text - simplified with sphere */}
      <mesh position={[0, 0.3, 1.62]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshPhongMaterial color={new Color("#FFD700")} emissive={new Color("#FFD700")} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}
