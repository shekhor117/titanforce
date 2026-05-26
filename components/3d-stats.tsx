"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { Group, Color } from "three"

export function Stats3DVisualization() {
  return (
    <Canvas
      camera={{ position: [0, 4, 8], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#22C55E" />
      
      <StatsBars />
      
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

function StatsBars() {
  const stats = [
    { label: "Players", value: 25, color: "#A71830" },
    { label: "Goals", value: 45, color: "#3B82F6" },
    { label: "Assists", value: 30, color: "#22C55E" },
    { label: "Rating", value: 4.5, color: "#FFD700" },
  ]

  return (
    <group>
      {stats.map((stat, index) => {
        const x = (index - 1.5) * 2.5
        const height = stat.value * 0.15
        return (
          <group key={index} position={[x, 0, 0]}>
            {/* Bar */}
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshPhongMaterial
                color={new Color(stat.color)}
                emissive={new Color(stat.color)}
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Base */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[1, 0.2, 0.8]} />
              <meshPhongMaterial color={new Color("#1E293B")} />
            </mesh>

            {/* Label Indicator */}
            <mesh position={[0, height + 0.5, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshPhongMaterial
                color={new Color(stat.color)}
                emissive={new Color(stat.color)}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
