'use client'

import { Canvas } from '@react-three/fiber'
import { Fog, Suspense } from 'react'
import { ReactNode } from 'react'
import { useScene3D } from '@/lib/3d/scene-config'
import { defaultLightsConfig } from '@/lib/3d/lights-config'

interface Scene3DWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

function Lights() {
  const config = defaultLightsConfig

  return (
    <>
      <ambientLight intensity={config.ambientLight.intensity} color={config.ambientLight.color} />
      <directionalLight
        intensity={config.directionalLight.intensity}
        color={config.directionalLight.color}
        position={config.directionalLight.position}
      />
      <pointLight intensity={config.pointLight.intensity} color={config.pointLight.color} position={config.pointLight.position} />
    </>
  )
}

export function Scene3DCanvas({ children, fallback }: Scene3DWrapperProps) {
  const sceneConfig = useScene3D()

  return (
    <Canvas
      camera={{
        position: sceneConfig.camera.position,
        fov: sceneConfig.camera.fov,
        near: sceneConfig.camera.near,
        far: sceneConfig.camera.far,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <color attach="background" args={[sceneConfig.background]} />
      {sceneConfig.fog && <Fog attach="fog" args={[sceneConfig.fogColor, sceneConfig.fogNear, sceneConfig.fogFar]} />}
      <Lights />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}

export default Scene3DCanvas
