'use client'

import { Canvas } from '@react-three/fiber'
import { useScene3D } from '@/lib/3d/scene-config'
import { ParticleSystem } from '@/components/3d/particle-system'

interface Dashboard3DWrapperProps {
  children: React.ReactNode
}

export function Dashboard3DWrapper({ children }: Dashboard3DWrapperProps) {
  const sceneConfig = useScene3D()

  return (
    <div className="min-h-screen bg-background relative w-full">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <Canvas
          camera={{
            position: sceneConfig.camera.position,
            fov: sceneConfig.camera.fov,
            near: sceneConfig.camera.near,
            far: sceneConfig.camera.far,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <color attach="background" args={[sceneConfig.background]} />
          {sceneConfig.fog && <fog attach="fog" args={[sceneConfig.fogColor, sceneConfig.fogNear, sceneConfig.fogFar]} />}
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight intensity={0.8} color="#ffffff" position={[10, 10, 10]} />
          <pointLight intensity={0.5} color="#60a5fa" position={[0, 5, 0]} />
          <ParticleSystem />
        </Canvas>
      </div>

      {/* 2D Content Overlay */}
      <div className="relative z-10 min-h-screen bg-background">
        {children}
      </div>
    </div>
  )
}
