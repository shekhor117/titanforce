"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef } from "react"
import { Group, Color } from "three"

export function Gallery3DFrame({ imageUrl }: { imageUrl?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
      <pointLight position={[-5, 5, 5]} intensity={0.6} color="#A71830" />
      
      <Frame3D />
      
      <Environment preset="studio" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}

function Frame3D() {
  return (
    <group>
      {/* Frame Border - Top */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.1]} />
        <meshPhongMaterial
          color={new Color("#FFD700")}
          emissive={new Color("#FFD700")}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Frame Border - Bottom */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.1]} />
        <meshPhongMaterial
          color={new Color("#FFD700")}
          emissive={new Color("#FFD700")}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Frame Border - Left */}
      <mesh position={[-1.05, 0, 0]}>
        <boxGeometry args={[0.1, 2.2, 0.1]} />
        <meshPhongMaterial
          color={new Color("#FFD700")}
          emissive={new Color("#FFD700")}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Frame Border - Right */}
      <mesh position={[1.05, 0, 0]}>
        <boxGeometry args={[0.1, 2.2, 0.1]} />
        <meshPhongMaterial
          color={new Color("#FFD700")}
          emissive={new Color("#FFD700")}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Inner Display Area */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2, 2, 0.02]} />
        <meshPhongMaterial
          color={new Color("#1E293B")}
          emissive={new Color("#1E293B")}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Corner Gems - Top Left */}
      <mesh position={[-1.05, 1.05, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial
          color={new Color("#FF1744")}
          emissive={new Color("#FF1744")}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Corner Gems - Top Right */}
      <mesh position={[1.05, 1.05, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial
          color={new Color("#FF1744")}
          emissive={new Color("#FF1744")}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Corner Gems - Bottom Left */}
      <mesh position={[-1.05, -1.05, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial
          color={new Color("#FF1744")}
          emissive={new Color("#FF1744")}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Corner Gems - Bottom Right */}
      <mesh position={[1.05, -1.05, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial
          color={new Color("#FF1744")}
          emissive={new Color("#FF1744")}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Rotating Center Accent */}
      <mesh position={[0, 0, 0.1]}>
        <octahedronGeometry args={[0.3]} />
        <meshPhongMaterial
          color={new Color("#A71830")}
          emissive={new Color("#A71830")}
          emissiveIntensity={0.7}
          wireframe={false}
        />
      </mesh>
    </group>
  )
}
