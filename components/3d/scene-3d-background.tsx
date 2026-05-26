'use client'

import { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { 
  ssr: false,
  loading: () => null
})

const ParticleSystem = dynamic(() => import('@/components/3d/particle-system').then(mod => mod.ParticleSystem), {
  ssr: false
})

interface Scene3DBackgroundProps {
  className?: string
}

export function Scene3DBackground({ className = '' }: Scene3DBackgroundProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || hasError) {
    return null
  }

  // Lazy load the scene config only on client
  const SceneContent = dynamic(() => Promise.resolve(SceneContentComponent), { ssr: false })

  return (
    <div className={`fixed inset-0 w-full h-screen z-0 ${className}`}>
      <Suspense fallback={null}>
        <div onError={() => setHasError(true)}>
          <SceneContent />
        </div>
      </Suspense>
    </div>
  )
}

function SceneContentComponent() {
  const useScene3D = require('@/lib/3d/scene-config').useScene3D
  const sceneConfig = useScene3D()

  try {
    return (
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
        {sceneConfig.fog && (
          <fog 
            attach="fog" 
            args={[sceneConfig.fogColor, sceneConfig.fogNear, sceneConfig.fogFar]} 
          />
        )}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight intensity={0.8} color="#ffffff" position={[10, 10, 10]} />
        <pointLight intensity={0.5} color="#60a5fa" position={[0, 5, 0]} />
        <ParticleSystem />
      </Canvas>
    )
  } catch (error) {
    console.error('[v0] 3D Scene error:', error)
    return null
  }
}

