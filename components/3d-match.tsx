"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef } from "react"
import { Group, Color } from "three"

export function Match3DVisualization() {
  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#3B82F6" />
      
      <SoccerField />
      <FootballPlayers />
      
      <Environment preset="park" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.5}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  )
}

function SoccerField() {
  return (
    <group>
      {/* Field Base */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshPhongMaterial color={new Color("#2D5016")} />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 6]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} emissive={new Color("#FFFFFF")} emissiveIntensity={0.3} />
      </mesh>

      {/* Center Circle */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 16, 32]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} emissive={new Color("#FFFFFF")} emissiveIntensity={0.3} />
      </mesh>

      {/* Goal Areas - Left */}
      <mesh position={[-4.8, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 2]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} transparent opacity={0.1} />
      </mesh>

      {/* Goal Areas - Right */}
      <mesh position={[4.8, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 2]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} transparent opacity={0.1} />
      </mesh>

      {/* Goal Posts - Left */}
      <mesh position={[-5, 0.3, -0.8]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} />
      </mesh>
      <mesh position={[-5, 0.3, 0.8]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} />
      </mesh>

      {/* Goal Posts - Right */}
      <mesh position={[5, 0.3, -0.8]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} />
      </mesh>
      <mesh position={[5, 0.3, 0.8]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
        <meshPhongMaterial color={new Color("#FFFFFF")} />
      </mesh>
    </group>
  )
}

function FootballPlayers() {
  const positions = [
    { x: -3, y: 0.5, z: -1, color: "#A71830" },
    { x: -3, y: 0.5, z: 0, color: "#A71830" },
    { x: -3, y: 0.5, z: 1, color: "#A71830" },
    { x: 3, y: 0.5, z: -1, color: "#3B82F6" },
    { x: 3, y: 0.5, z: 0, color: "#3B82F6" },
    { x: 3, y: 0.5, z: 1, color: "#3B82F6" },
    { x: 0, y: 0.5, z: -0.5, color: "#FFFFFF" },
  ]

  return (
    <group>
      {positions.map((pos, i) => (
        <Player3D key={i} position={[pos.x, pos.y, pos.z]} color={pos.color} />
      ))}
    </group>
  )
}

function Player3D({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshPhongMaterial color={new Color("#F4A460")} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.6, 16]} />
        <meshPhongMaterial color={new Color(color)} emissive={new Color(color)} emissiveIntensity={0.4} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshPhongMaterial color={new Color("#000000")} />
      </mesh>
      <mesh position={[0.1, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshPhongMaterial color={new Color("#000000")} />
      </mesh>
    </group>
  )
}
